# ETL Pipeline Design: Kafka Consumer → Unified Warehouse

This document defines the ETL pipeline for JalSoochak v2: consuming events from Kafka and loading data into a single PostgreSQL `warehouse_db` with a unified `warehouse` schema containing event tables, snapshot fact tables, dimension tables, and ETL control tables.

---

## 1. Pipeline Overview

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Source Services │     │       Kafka          │     │  ETL Service     │
│  (Field Ops,     │────▶│  (event topics)      │────▶│  (consumer +     │
│   Messaging,     │     │                      │     │   loader jobs)   │
│   Management)    │     │                      │     │                  │
└─────────────────┘     └──────────────────────┘     └────────┬────────┘
                                                              │
                            ┌─────────────────────────────────┼─────────────────────────────────┐
                            │                                 ▼                                 │
                            │          Single PostgreSQL Warehouse (warehouse_db)              │
                            │  ┌─────────────────────────────────────────────────────────────┐  │
                            │  │                      warehouse schema                       │  │
                            │  │  ┌─────────────────────────────────────────────────────┐   │  │
                            │  │  │  EVENT TABLES (immutable, append-only)              │   │  │
                            │  │  │  • event_log (audit trail, replay source)           │   │  │
                            │  │  │  • fact_bfm_reading_event                           │   │  │
                            │  │  │  • fact_water_quantity_event                        │   │  │
                            │  │  │  • fact_anomaly_event                               │   │  │
                            │  │  └─────────────────────────────────────────────────────┘   │  │
                            │  │                          │ batch jobs                      │  │
                            │  │                          ▼                                 │  │
                            │  │  ┌─────────────────────────────────────────────────────┐   │  │
                            │  │  │  SNAPSHOT FACT TABLES (UPSERT, dashboard-optimized) │   │  │
                            │  │  │  • fact_daily_submission                            │   │  │
                            │  │  │  • fact_water_quantity_daily                        │   │  │
                            │  │  │  • fact_anomaly                                     │   │  │
                            │  │  │  • fact_status_snapshot                             │   │  │
                            │  │  └─────────────────────────────────────────────────────┘   │  │
                            │  │  ┌─────────────────────────────────────────────────────┐   │  │
                            │  │  │  DIMENSION TABLES                                   │   │  │
                            │  │  │  • dim_tenant, dim_lgd_location, dim_admin_location │   │  │
                            │  │  │  • dim_village, dim_scheme, dim_person              │   │  │
                            │  │  └─────────────────────────────────────────────────────┘   │  │
                            │  │  ┌─────────────────────────────────────────────────────┐   │  │
                            │  │  │  ETL CONTROL TABLES                                 │   │  │
                            │  │  │  • etl_batch_job_runs, etl_watermarks, etl_dead_letter │ │  │
                            │  │  └─────────────────────────────────────────────────────┘   │  │
                            │  └─────────────────────────────────────────────────────────────┘  │
                            └───────────────────────────────────────────────────────────────────┘
```

**Pipeline stages:**

- **Extract**: Kafka consumers continuously ingest events from topics (streaming).
- **Transform**: Events are validated, deduplicated, and written directly to event tables. Batch jobs aggregate event data into snapshot fact tables.
- **Load**: Scheduled jobs transform event-level data into snapshot fact tables for dashboard queries (batch, typically 15-minute or hourly intervals).

**Unified Warehouse Architecture:**

We use a single `warehouse_db` PostgreSQL database with a unified `warehouse` schema:

```sql
-- Create database and schema
CREATE DATABASE warehouse_db;
\c warehouse_db
CREATE SCHEMA warehouse;
```

**Table Organization within `warehouse` schema:**

| Table Type | Purpose | Tables |
|------------|---------|--------|
| **Event Tables** | Immutable, append-only event-level data from Kafka | `event_log`, `fact_bfm_reading_event`, `fact_water_quantity_event`, `fact_anomaly_event` |
| **Snapshot Fact Tables** | Aggregated, UPSERT-enabled daily snapshots for dashboards | `fact_daily_submission`, `fact_water_quantity_daily`, `fact_anomaly`, `fact_status_snapshot` |
| **Dimension Tables** | Flattened reference data for query joins | `dim_tenant`, `dim_lgd_location`, `dim_admin_location`, `dim_village`, `dim_scheme`, `dim_person` |
| **ETL Control Tables** | Job metadata, watermarks, dead-letter queue | `etl_batch_job_runs`, `etl_watermarks`, `etl_dead_letter` |

**Benefits:**
- Simpler infrastructure: Single schema to manage, backup, and monitor
- Reduced complexity: No cross-schema coordination; batch jobs use direct SQL joins
- Event sourcing: Immutable event tables enable replay and audit
- Dashboard performance: Snapshot tables optimized for OLAP queries

---

## 2. Multi-Tenant Design

### 2.1 Multi-Tenancy Strategy

We use a **Shared Schema + Tenant ID** approach:

| Strategy | Description |
|----------|-------------|
| **Shared Schema + Tenant ID** | Single schema, all tables have `tenant_id` column. Simple ops, easy cross-tenant queries (country-level dashboards). |

**Key characteristics:**
- `tenant_id INT` column in all event tables, snapshot fact tables, and dimension tables
- All unique constraints include `tenant_id` as prefix
- All indexes include `tenant_id` for efficient filtering
- Kafka events include `tenant_id` in payload
- Cross-tenant queries possible via joins to `dim_tenant` (for country dashboards)

### 2.2 Source Database Reference

The ETL database aligns with the main transactional database schema (source of truth):

**Main Entities:**
- `scheme_master` — Water supply schemes
- `person_master` — Pump operators and personnel
- `bfm_reading` — Bulk flow meter readings

**Location Hierarchy:**
- `lgd_location_master` — LGD geographic hierarchy (State → District → Block → Gram Panchayat → Village). This is the authoritative geography hierarchy used for geo drilldown and map visualization.
- `administrative_location_master` — Administrative jurisdiction hierarchy (Zone → Circle → Division → Sub-division). Intentionally stops at subdivision level.
- `village_master` — Service/operational village data with references to LGD and administrative locations.

**Type Masters:**
- `person_type_master`, `lgd_location_type_master`, `administrative_location_type_master`

**Mappings:**
- `village_scheme_mapping` — Village to scheme relationships
- `person_scheme_mapping` — Person to scheme assignments

---

## 3. Services Involved

| Service | Responsibility |
|--------|----------------|
| **ETL / Analytics Ingestion Service** (new) | Java + Spring Boot service that: (1) consumes Kafka topics via Spring Kafka consumers, (2) writes events to `warehouse` event tables, (3) runs scheduled batch jobs (ShedLock/Quartz) that aggregate event data into snapshot fact tables. |
| **Kafka** | Event backbone. Source services publish events; ETL service consumes. |
| **warehouse_db** (PostgreSQL) | Single PostgreSQL database with unified `warehouse` schema containing: event tables (immutable), snapshot fact tables (UPSERT), dimension tables, and ETL control tables. Isolated from transactional DB to avoid OLTP impact. |
| **Source services** (existing) | **Management Service**, **Messaging Orchestrator**, **Field Operations**. These services **produce** events to Kafka only; they do not participate in ETL. |

**Optional separation (for scale):**

- **Kafka Consumer Service**: Consumes Kafka → writes to event tables (streaming).
- **Snapshot Loader Service**: Reads from event tables, aggregates, loads into snapshot fact tables (batch, scheduled).

For initial implementation, a single **ETL / Analytics Ingestion Service** performing both functions is sufficient.

---

## 4. Kafka Topics and Events

### 4.1 Event Schema Requirements

**All events MUST include:**

- `event_id` (UUID, globally unique) — Required for idempotent processing and replay.
- `tenant_id` (INT) — Required for multi-tenant isolation.
- `timestamp` (ISO 8601 UTC) — Event occurrence time.
- `source_service` (string) — Producer service identifier.
- `event_type` (string) — Event classification (e.g., `FIELD_SUBMISSION_CREATED`).

**Example Event Structure:**

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": 1,
  "timestamp": "2024-06-10T10:30:00Z",
  "source_service": "field-operations",
  "event_type": "FIELD_SUBMISSION_CREATED",
  "payload": {
    "scheme_id": 123,
    "person_id": 456,
    "confirmed_reading": 295,
    "reading_date_time": "2024-06-10T10:25:00Z",
    "source": "WHATSAPP"
  }
}
```

**NOTE: Event payloads are JSON. May consider Avro schema registry for schema evolution in production.**

### 4.2 Topics and Event Payloads

| Topic | Event Type | Key Fields (beyond required) | Produced by | Analytics Purpose |
|-------|------------|------------------------------|-------------|-------------------|
| `field.submission.created` | `FIELD_SUBMISSION_CREATED` | `scheme_id`, `person_id`, `confirmed_reading`, `extracted_reading`, `reading_date_time`, `source` (WHATSAPP\|MANUAL), `reading_url` | Management Service / Field Operations | BFM readings, daily quantity calculation, submission rates, continuity |
| `water.quantity.computed` | `WATER_QUANTITY_COMPUTED` | `scheme_id`, `date`, `computed_quantity_litre`, `start_reading`, `end_reading` | Field Operations | Water supplied metrics, trends |
| `pump-operator-created` | `PUMP_OPERATOR_CREATED` | `person_id`, `full_name`, `person_type_id` | Messaging Orchestrator | Operator onboarding counts, active operator base |
| `anomaly.detected` | `ANOMALY_DETECTED` | `scheme_id`, `type` (LOW_QUANTITY\|NO_SUBMISSION\|REPEATED_IMAGE), `date`, `expected_qty_ltr`, `actual_qty_ltr`, `details` (JSON) | Anomaly / Field Operations | Anomaly counts, status color derivation. |
| `config.updated` (optional) | `CONFIG_UPDATED` | `config_type` (WATER_NORMS\|ESCALATION_RULES), `config_payload` (JSON) | State Config Service | Context for threshold-based reports |

**Identity alignment:** Use `person_id` consistently across all events (matching `person_master.id` from main DB).

**Implementation priority:**

1. **Phase 1**: `field.submission.created`, `water.quantity.computed`
2. **Phase 2**: `pump-operator-created` (enhance existing), `anomaly.detected`

---

## 5. Event Data Layer

### 5.1 Responsibilities

The event data layer within the `warehouse` schema serves three distinct purposes:

1. **Immutable event log** — Append-only audit trail of all consumed Kafka events. Used for replay, debugging, and idempotency.
2. **Event-grain fact tables** — Parsed, validated, deduplicated event data in domain-aligned tables. Input for aggregation jobs.
3. **Multi-tenant isolation** — All tables include `tenant_id` for data segregation.

### 5.2 Event Tables

The warehouse schema contains the following event tables (see [Appendix A](#appendix-a-table-definitions-and-examples) for full DDL and examples):

- **`warehouse.event_log`** — Immutable audit trail for all Kafka events. Idempotency via unique constraint on `(tenant_id, event_id)`. **Never deleted or modified.**
- **`warehouse.fact_bfm_reading_event`** — Event-grain BFM readings. Maps to `bfm_reading` from main DB.
- **`warehouse.fact_water_quantity_event`** — Event-grain computed water quantities per scheme per date.
- **`warehouse.fact_anomaly_event`** — Event-grain anomalies as detected.

**Data Governance (Event Tables):**
- **Append-only**: Event tables are immutable and append-only.
- **No updates or deletes**: Once written, event data is never modified.
- **Idempotency**: Unique constraints on `(tenant_id, event_id)` prevent duplicates.
- **Replay source**: Event tables enable full replay of historical data.

### 5.3 Kafka Consumer Behavior

**Offset commit semantics:** Commit offsets **only after successful write to event tables** (at-least-once delivery). Use idempotent writes (unique constraints) to handle duplicates.

**Consumer configuration:**

- `enable.auto.commit = false` — Manual offset commits after event table write.
- `isolation.level = read_committed` — Read only committed messages.
- `max.poll.records` — Batch size (e.g., 100-500) for efficient batch writes.

**Error handling:**

- Transient failures: Retry with exponential backoff, do not commit offset.
- Permanent failures: Write to dead-letter queue (`warehouse.etl_dead_letter`), commit offset to avoid blocking.
- Dead-letter events: Log for manual review; do not block pipeline.

---

## 6. Snapshot Analytics Layer

### 6.1 Data Requirements

The snapshot analytics layer within the `warehouse` schema holds **aggregated, non-PII (personally identifiable information) data** for:

- Tenant-specific and country-level dashboards.
- Drill-down by **geo hierarchy** (State → District → Block → Gram Panchayat → Village) via `lgd_location_master`.
- Drill-down by **department hierarchy** (Zone → Circle → Division → Sub-division) via `administrative_location_master`.
- Metrics: status color, daily submission %, water quantity supplied, continuity/no-water days, active vs inactive operator counts.

**PII exclusion:** No raw phone numbers, operator names (except in `dim_person`), or message content in snapshot fact tables.

### 6.2 Star Schema Design

**Dimensions** — Flattened, denormalized tables (no recursive parent joins). Parent relationships are denormalized as columns for query performance.

**Snapshot Facts** — Aggregated metrics at specific grains (e.g., per tenant/scheme/date). Optimized for dashboard queries.

#### Dimension Tables

See [Appendix A](#appendix-a-table-definitions-and-examples) for full DDL and examples.

- **`warehouse.dim_tenant`** — Tenant master for multi-tenancy.
- **`warehouse.dim_lgd_location`** — Flattened LGD geographic hierarchy (State → District → Block → Gram Panchayat → Village). Stores geometry for all hierarchy levels including villages. This is the authoritative geography dimension for geo drilldown and map visualization.
- **`warehouse.dim_admin_location`** — Flattened administrative jurisdiction hierarchy (Zone → Circle → Division → Sub-division). Intentionally stops at subdivision level; village jurisdiction is represented via `dim_village.admin_location_id`.
- **`warehouse.dim_village`** — Service/operational village dimension (from `village_master`). Links LGD geographic hierarchy to administrative jurisdiction and service analytics. References `dim_lgd_location` for geography and `dim_admin_location` for jurisdiction.
- **`warehouse.dim_scheme`** — Scheme dimension (from `scheme_master`), denormalized with hierarchy.
- **`warehouse.dim_person`** — Person/operator dimension (from `person_master`).

**Hierarchy and Dimension Design Rationale:**

The separation between `dim_lgd_location` (LGD geographic hierarchy) and `dim_village` (service/operational dimension) maintains:
- **Government-aligned geographic modeling** — LGD hierarchy follows official administrative boundaries
- **Flexible operational mapping** — Village jurisdiction can be reassigned without restructuring hierarchies
- **Simplified ETL maintenance** — Geographic and operational concerns are decoupled
- **Future extensibility** — Supports habitation aggregation or service cluster modeling

**Drilldown Behavior:**
- **Geo drilldown** uses LGD geographic hierarchy including village level (State → District → Block → GP → Village)
- **Administrative drilldown** uses administrative jurisdiction hierarchy up to subdivision level (Zone → Circle → Division → Sub-division)
- **Village-level administrative analytics** are supported via joins through `dim_village`

#### Snapshot Fact Tables

See [Appendix A](#appendix-a-table-definitions-and-examples) for full DDL and examples.

- **`warehouse.fact_daily_submission`** — Daily submission percentages and counts.
- **`warehouse.fact_water_quantity_daily`** — Daily Water Supply Snapshot. One row per scheme per date.
- **`warehouse.fact_anomaly`** — Aggregated anomaly metrics by type and status.
- **`warehouse.fact_status_snapshot`** — Status color per scheme/geo/date (derived from rules).

**Data Governance (Snapshot Fact Tables):**
- **UPSERT allowed**: Snapshot tables support `ON CONFLICT ... DO UPDATE` for late-arriving data.
- **Dashboard-optimized**: Pre-aggregated for fast query performance.
- **Late data handling**: Late-arriving events update existing snapshot rows.
- **Derived data**: Computed from event tables; can be regenerated from event data.

**Regularity calculation:**

```sql
-- Regularity for a scheme in a time period
SELECT 
    scheme_id,
    ROUND(100.0 * COUNT(*) FILTER (WHERE water_supplied = TRUE) / COUNT(*), 2) AS regularity_pct
FROM warehouse.fact_water_quantity_daily
WHERE tenant_id = 1 
  AND date BETWEEN '2024-06-01' AND '2024-06-30'
GROUP BY scheme_id;
```

---

## Geo Map Data Serving Using PostGIS

JalSoochak dashboards require hierarchical drilldown map visualization based on the LGD geographic hierarchy (Country → State → District → Block → Gram Panchayat → Village). This section documents the PostGIS-based approach for storing and serving geographic boundary geometry. LGD village is treated as an administrative geographic node with geometry stored in `warehouse.dim_lgd_location.geom`.

### 6.3.1 Geo Serving Strategy

JalSoochak uses PostgreSQL with PostGIS extension to store and serve administrative boundary geometry. GeoJSON is generated dynamically from PostGIS geometry columns at query time.

**Hierarchical Lazy Loading:**

The system uses lazy loading for drilldown visualization. Only one hierarchy level is loaded at a time based on user selection:

| Selected Level   | Loaded Boundary  |
|------------------|------------------|
| India            | States           |
| State            | Districts        |
| District         | Blocks           |
| Block            | Gram Panchayats  |
| Gram Panchayat   | Villages         |

**Performance Reasoning:**

- Reduces payload size per request (only child boundaries of selected parent are fetched).
- Avoids loading entire country geometry upfront.
- Aligns with dashboard UX where users drill down progressively.
- Keeps query complexity manageable for moderate traffic (~50–70 dashboard loads/day, scaling to ~10,000/day).

### 6.3.2 PostGIS Geometry Integration

**Tenancy Model Assumption:**

Each tenant represents a single Indian state. Administrative boundary geometry is therefore tenant-scoped and does not overlap across tenants. Geometry is stored directly within `warehouse.dim_lgd_location` to simplify ETL, tenant isolation, and state-level geo data lifecycle management.

Geometry column in `warehouse.dim_lgd_location` (see [Appendix A.2.2](#a22-warehousedim_lgd_location) for full DDL):

| Column | Type                           | Purpose                                               |
|--------|--------------------------------|-------------------------------------------------------|
| `geom` | `geometry(MULTIPOLYGON, 4326)` | Simplified geometry for dashboard map rendering      |

**Column Purpose:**

- **`geom`**: Stores pre-simplified geometry for efficient GeoJSON serialization and frontend rendering. Geometry is simplified during ingestion to reduce vertex count while preserving topology.

### 6.3.3 Geometry Simplification Strategy

Geometry is simplified using `ST_SimplifyPreserveTopology` during geo data ingestion before storing in the `geom` column. Simplification is **not** performed at query time to avoid runtime overhead.

**Simplification during ingestion:**

```sql
-- Apply simplification when inserting geometry from source data
INSERT INTO warehouse.dim_lgd_location (tenant_id, source_lgd_id, ..., geom)
VALUES (
    :tenant_id,
    :source_lgd_id,
    ...,
    ST_SimplifyPreserveTopology(:source_geometry, :tolerance)
);
```

**Tolerance Values:**

Tolerance values should be configured based on hierarchy level. Lower levels (villages, GPs) may use smaller tolerances to preserve boundary accuracy, while higher levels (states, districts) can use larger tolerances for faster rendering.

**Benefits:**

- Reduces GeoJSON serialization overhead.
- Decreases network payload size.
- Improves frontend map rendering performance.
- Avoids repeated simplification computation per request.

### 6.3.4 GeoJSON Generation Query Pattern

GeoJSON is generated dynamically using PostGIS `ST_AsGeoJSON` function. The query returns child boundaries for a selected parent location.

**Example Query:**

```sql
SELECT
    source_lgd_id,
    title,
    ST_AsGeoJSON(geom) AS geometry
FROM warehouse.dim_lgd_location
WHERE parent_id = :selected_lgd_id;
```

**Frontend Integration:**

The API returns rows with `source_lgd_id`, `title`, and `geometry` (GeoJSON string). The frontend converts these rows into a GeoJSON `FeatureCollection`:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "lgd_id": 10, "title": "Kamrup" },
      "geometry": { "type": "MultiPolygon", "coordinates": [...] }
    }
  ]
}
```

### 6.3.5 Indexing Strategy

Spatial indexing is required for efficient geometry queries.

**DDL:**

```sql
CREATE INDEX idx_dim_lgd_geom
ON warehouse.dim_lgd_location
USING GIST (geom);
```

**Additional Index for Parent Lookup:**

```sql
CREATE INDEX idx_dim_lgd_parent
ON warehouse.dim_lgd_location (parent_id);
```

**Purpose:**

- GIST index on `geom` enables efficient spatial operations if needed in future (e.g., point-in-polygon queries).
- Index on `parent_id` accelerates drilldown queries that filter by parent location.

### 6.3.6 Performance Characteristics

PostGIS-based serving is sufficient for JalSoochak's current and projected usage:

| Factor                  | Characteristic                                                |
|-------------------------|---------------------------------------------------------------|
| Dashboard loads         | ~50–70/day currently, scaling to ~10,000/day                  |
| Drilldown frequency     | Moderate (users drill down progressively, not continuously)   |
| Geometry complexity     | Pre-simplified at ingestion time                              |
| Connection pooling      | Standard PostgreSQL connection pool handles expected load     |
| Query latency           | Sub-second for typical drilldown queries with proper indexing |

**Caching Considerations:**

Redis or API-level caching may be introduced later if:

- Traffic exceeds 10,000 dashboard loads/day significantly.
- Repeated identical drilldown queries become a bottleneck.
- Response latency requirements become stricter.

For current requirements, database-level query caching and connection pooling are sufficient.

### 6.3.7 Future Scalability Note

If JalSoochak evolves into a high-volume public geo portal or requires continuous zoom/pan rendering (slippy map behavior), vector tiles or CDN-based GeoJSON delivery may be evaluated in future. Current architecture intentionally avoids this complexity to maintain a simple, maintainable infrastructure suitable for internal monitoring dashboards.

---

## 7. ETL Control Tables

### 7.1 ETL Metadata Tables

See [Appendix A](#appendix-a-table-definitions-and-examples) for full DDL.

The `warehouse` schema includes the following ETL control tables:

- **`warehouse.etl_batch_job_runs`** — Tracks batch job execution.
- **`warehouse.etl_watermarks`** — Tracks processing progress for late-arriving data handling.
- **`warehouse.etl_dead_letter`** — Failed events for manual review.

---

## 8. ETL Processing Logic

### 8.1 Kafka Consumer → Event Tables (Streaming)

**ETL Flow:**

```
Kafka → warehouse.event_log (immutable audit trail)
      → warehouse.fact_*_event tables (event-grain data)
```

**Process:**

1. Consume batch of events from Kafka topic (Spring Kafka `@KafkaListener`).
2. For each event:
   - Validate required fields (`event_id`, `tenant_id`, `timestamp`).
   - Check `warehouse.event_log` for duplicate `(tenant_id, event_id)` (idempotency).
   - If duplicate: Skip, log warning.
   - If new: Write to `warehouse.event_log` (raw payload as JSONB). **This table is immutable.**
3. Parse event payload and write to appropriate event fact table (`warehouse.fact_bfm_reading_event`, `warehouse.fact_water_quantity_event`, `warehouse.fact_anomaly_event`) using `ON CONFLICT` for idempotency.
4. Mark `warehouse.event_log.processed_at = NOW()`.
5. Commit Kafka offsets (after successful event table writes).

**Error handling:** Failed events go to `warehouse.etl_dead_letter`; commit offset to avoid blocking.

### 8.2 Event Tables → Snapshot Fact Tables (Batch Jobs)

**ETL Flow:**

```
warehouse.fact_*_event tables (event-grain) → Batch Jobs → warehouse.fact_*_daily/snapshot tables (snapshot-grain)
```

**Scheduled jobs** (ShedLock/Quartz) run at configured intervals.

#### Job: Load Dimensions

**Frequency:** Daily (nightly) or on-demand when transactional DB changes.

**Process:**

1. Read dimension data from transactional DB (main source of truth).
2. Upsert into `warehouse.dim_tenant`, `warehouse.dim_lgd_location`, `warehouse.dim_admin_location`, `warehouse.dim_village`, `warehouse.dim_scheme`, `warehouse.dim_person` using `ON CONFLICT ... DO UPDATE`.
3. Update `updated_at` timestamps.

**Hierarchy flattening example (LGD):**

```sql
-- Flatten lgd_location_master hierarchy into dim_lgd_location
WITH RECURSIVE lgd_hierarchy AS (
    -- Base case: root nodes (states)
    SELECT 
        id,
        title,
        lgd_code,
        lgd_location_type_id,
        parent_id,
        id AS lgd_state_id,
        title AS lgd_state_name,
        NULL::INT AS lgd_district_id,
        NULL::VARCHAR AS lgd_district_name,
        NULL::INT AS lgd_block_id,
        NULL::VARCHAR AS lgd_block_name,
        NULL::INT AS lgd_gram_panchayat_id,
        NULL::VARCHAR AS lgd_gram_panchayat_name
    FROM lgd_location_master
    WHERE parent_id IS NULL AND deleted_at IS NULL
    
    UNION ALL
    
    -- Recursive case: child nodes
    SELECT 
        c.id,
        c.title,
        c.lgd_code,
        c.lgd_location_type_id,
        c.parent_id,
        p.lgd_state_id,
        p.lgd_state_name,
        CASE WHEN ct.title = 'DISTRICT' THEN c.id ELSE p.lgd_district_id END,
        CASE WHEN ct.title = 'DISTRICT' THEN c.title ELSE p.lgd_district_name END,
        CASE WHEN ct.title = 'BLOCK' THEN c.id ELSE p.lgd_block_id END,
        CASE WHEN ct.title = 'BLOCK' THEN c.title ELSE p.lgd_block_name END,
        CASE WHEN ct.title = 'GRAM_PANCHAYAT' THEN c.id ELSE p.lgd_gram_panchayat_id END,
        CASE WHEN ct.title = 'GRAM_PANCHAYAT' THEN c.title ELSE p.lgd_gram_panchayat_name END
    FROM lgd_location_master c
    JOIN lgd_hierarchy p ON c.parent_id = p.id
    JOIN lgd_location_type_master ct ON c.lgd_location_type_id = ct.id
    WHERE c.deleted_at IS NULL
)
INSERT INTO warehouse.dim_lgd_location (tenant_id, source_lgd_id, title, lgd_code, location_type, 
    lgd_state_id, lgd_state_name, lgd_district_id, lgd_district_name, 
    lgd_block_id, lgd_block_name, lgd_gram_panchayat_id, lgd_gram_panchayat_name, updated_at)
SELECT 
    :tenant_id,
    h.id,
    h.title,
    h.lgd_code,
    lt.title,
    h.lgd_state_id,
    h.lgd_state_name,
    h.lgd_district_id,
    h.lgd_district_name,
    h.lgd_block_id,
    h.lgd_block_name,
    h.lgd_gram_panchayat_id,
    h.lgd_gram_panchayat_name,
    NOW()
FROM lgd_hierarchy h
JOIN lgd_location_type_master lt ON h.lgd_location_type_id = lt.id
ON CONFLICT (tenant_id, source_lgd_id) DO UPDATE SET
    title = EXCLUDED.title,
    lgd_code = EXCLUDED.lgd_code,
    location_type = EXCLUDED.location_type,
    lgd_state_id = EXCLUDED.lgd_state_id,
    lgd_state_name = EXCLUDED.lgd_state_name,
    lgd_district_id = EXCLUDED.lgd_district_id,
    lgd_district_name = EXCLUDED.lgd_district_name,
    lgd_block_id = EXCLUDED.lgd_block_id,
    lgd_block_name = EXCLUDED.lgd_block_name,
    lgd_gram_panchayat_id = EXCLUDED.lgd_gram_panchayat_id,
    lgd_gram_panchayat_name = EXCLUDED.lgd_gram_panchayat_name,
    updated_at = NOW();
```

#### Job: Aggregate Daily Submissions

**Frequency:** Every 15 minutes (or hourly).

**Process:**

1. Read `warehouse.fact_bfm_reading_event` where `created_at > last_run_time`.
2. Group by `tenant_id`, `scheme_id`, `reading_date`.
3. Join with `warehouse.dim_scheme` to get `village_id`, `lgd_district_id`, `admin_division_id`.
4. Count total operators (from `person_scheme_mapping` in transactional DB).
5. Count submissions per scheme/date.
6. Upsert into `warehouse.fact_daily_submission` using `ON CONFLICT ... DO UPDATE`.

#### Job: Aggregate Water Quantities

**Frequency:** Every 15 minutes (or hourly).

**Process:**

1. Read `warehouse.fact_water_quantity_event` where `created_at > last_run_time`.
2. For each event, UPSERT into `warehouse.fact_water_quantity_daily`:
   - Set `water_supplied = TRUE`.
   - Set `qty_ltr` from event payload.
   - Set `data_source = 'EVENT'` if inserting, `'LATE_EVENT_UPDATE'` if updating SNAPSHOT_BACKFILL.
3. Join with `warehouse.dim_scheme` to populate denormalized fields.

#### Job: Midnight Snapshot (No-Supply Day Backfill)

**Frequency:** Daily at midnight.

**Process:**

1. For each active scheme per tenant, check if a row exists in `warehouse.fact_water_quantity_daily` for yesterday.
2. If no row exists:
   - Insert with `water_supplied = FALSE`, `qty_ltr = 0`, `data_source = 'SNAPSHOT_BACKFILL'`.

#### Job: Aggregate Anomalies

**Frequency:** Every 15 minutes (or hourly).

**Process:**

1. Read `warehouse.fact_anomaly_event` where `created_at > last_run_time`.
2. Group by `tenant_id`, `scheme_id`, `anomaly_date`, `anomaly_type`.
3. Count by status, sum quantities.
4. Upsert into `warehouse.fact_anomaly`.

#### Job: Compute Status Colors

**Frequency:** Every 15 minutes (or hourly), after other fact jobs.

**Process:**

1. Read `warehouse.fact_daily_submission`, `warehouse.fact_water_quantity_daily`, `warehouse.fact_anomaly`.
2. Apply status color rules:
   - **GREEN**: submission_pct >= 90 AND no_water_days = 0 AND open_anomalies = 0
   - **LIGHT_GREEN**: submission_pct >= 75 AND no_water_days <= 1
   - **ORANGE**: submission_pct >= 50 AND no_water_days <= 3
   - **RED**: submission_pct < 50 OR no_water_days > 3
   - **DARK_RED**: submission_pct < 25 OR no_water_days > 7
3. Upsert into `warehouse.fact_status_snapshot`.

### 8.3 Late-Arriving Data Handling

**Strategy:**

- **Event Tables:** Accept late events up to a **reprocessing window** (e.g., 7 days). Events are always appended (immutable).
- **Snapshot Aggregation:** Use watermark-based processing via `warehouse.etl_watermarks`.
- **Snapshot Update:** Late events trigger UPSERT on snapshot fact tables with `data_source = 'LATE_EVENT_UPDATE'`.
- **Reprocessing:** Batch jobs can reprocess a date range using `ON CONFLICT` upserts on snapshot tables.

### 8.4 Backfills and Replays

**Backfill process:**

1. Identify date range to backfill.
2. Reprocess `warehouse.event_log` for that range (event log is immutable and serves as replay source).
3. Re-run aggregation jobs for the date range.
4. Upsert into snapshot fact tables (idempotent via `ON CONFLICT`).

---

## 9. Example Queries

### 9.1 Tenant-Specific Dashboard (District Summary)

```sql
SELECT 
    ds.lgd_district_name,
    COUNT(DISTINCT fwq.scheme_id) AS total_schemes,
    SUM(CASE WHEN fwq.water_supplied THEN 1 ELSE 0 END) AS schemes_with_water,
    ROUND(AVG(fwq.qty_ltr), 2) AS avg_qty_ltr,
    ROUND(100.0 * SUM(CASE WHEN fwq.water_supplied THEN 1 ELSE 0 END) / COUNT(*), 2) AS water_supply_pct
FROM warehouse.fact_water_quantity_daily fwq
JOIN warehouse.dim_scheme ds ON fwq.scheme_id = ds.id AND fwq.tenant_id = ds.tenant_id
WHERE fwq.tenant_id = 1  -- Assam
  AND fwq.date = '2024-06-10'
GROUP BY ds.lgd_district_name
ORDER BY ds.lgd_district_name;
```

### 9.2 Cross-Tenant (Country-Level) Summary

```sql
SELECT 
    dt.tenant_name AS state,
    COUNT(DISTINCT fwq.scheme_id) AS total_schemes,
    SUM(CASE WHEN fwq.water_supplied THEN 1 ELSE 0 END) AS schemes_with_water,
    ROUND(100.0 * SUM(CASE WHEN fwq.water_supplied THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS water_supply_pct
FROM warehouse.fact_water_quantity_daily fwq
JOIN warehouse.dim_tenant dt ON fwq.tenant_id = dt.tenant_id
WHERE fwq.date = '2024-06-10'
GROUP BY dt.tenant_name
ORDER BY water_supply_pct DESC;
```

### 9.3 Scheme Regularity (Last 30 Days)

```sql
SELECT 
    ds.scheme_name,
    ds.village_name,
    COUNT(*) AS total_days,
    SUM(CASE WHEN fwq.water_supplied THEN 1 ELSE 0 END) AS supply_days,
    ROUND(100.0 * SUM(CASE WHEN fwq.water_supplied THEN 1 ELSE 0 END) / COUNT(*), 2) AS regularity_pct
FROM warehouse.fact_water_quantity_daily fwq
JOIN warehouse.dim_scheme ds ON fwq.scheme_id = ds.id AND fwq.tenant_id = ds.tenant_id
WHERE fwq.tenant_id = 1
  AND fwq.date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
GROUP BY ds.scheme_name, ds.village_name
ORDER BY regularity_pct ASC
LIMIT 20;
```

### 9.4 Anomaly Summary by Type

```sql
SELECT 
    fa.anomaly_type,
    SUM(fa.open_count) AS total_open,
    SUM(fa.resolved_count) AS total_resolved,
    SUM(fa.total_expected_qty_ltr) AS total_expected_ltr,
    SUM(fa.total_actual_qty_ltr) AS total_actual_ltr
FROM warehouse.fact_anomaly fa
WHERE fa.tenant_id = 1
  AND fa.date BETWEEN '2024-06-01' AND '2024-06-30'
GROUP BY fa.anomaly_type
ORDER BY total_open DESC;
```

---

## 10. Row-Level Security (Optional)

For API-level tenant isolation, you can use PostgreSQL RLS:

```sql
-- Enable RLS on snapshot fact tables
ALTER TABLE warehouse.fact_water_quantity_daily ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation ON warehouse.fact_water_quantity_daily
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::INT);

-- In your application, set tenant context before queries
SET app.current_tenant_id = '1';  -- Assam
SELECT * FROM warehouse.fact_water_quantity_daily WHERE date = '2024-06-10';
-- Only returns Assam data
```

---

## 11. Implementation Steps

### Step 1: Create warehouse_db and Schema

```sql
CREATE DATABASE warehouse_db;

\c warehouse_db

CREATE SCHEMA warehouse;
```

### Step 2: Create Warehouse Tables

- Create event tables in `warehouse` schema (`event_log`, `fact_*_event`).
- Create dimension tables in `warehouse` schema (`dim_*`).
- Create snapshot fact tables in `warehouse` schema (`fact_*_daily`, `fact_*_snapshot`).
- Create ETL control tables in `warehouse` schema (`etl_*`).
- Create indexes and constraints.

### Step 3: Define and Publish Events

- Enhance source services to publish events with required schema (`event_id` UUID, `tenant_id` INT, `timestamp`, etc.).
- Ensure `scheme_id`, `person_id` match main DB IDs (INT).
- Document event schemas in shared library.

### Step 4: Implement ETL Service - Kafka Consumers

- Create **ETL / Analytics Ingestion Service** (Java 17+, Spring Boot, Spring Kafka).
- Implement Kafka consumers per topic (`@KafkaListener`).
- Implement event table writers with idempotency (`ON CONFLICT`).
- Ensure `event_log` remains immutable (append-only, no updates/deletes).
- Configure manual offset commits.
- Deploy service (K8s deployment).

### Step 5: Implement Batch Jobs

- Implement scheduled jobs (ShedLock/Quartz):
  - Dimension loader (daily).
  - Daily submission aggregator (15-min or hourly) — reads from `fact_bfm_reading_event`.
  - Water quantity aggregator (15-min or hourly) — reads from `fact_water_quantity_event`.
  - Midnight snapshot job (daily) — backfills `fact_water_quantity_daily`.
  - Anomaly aggregator (15-min or hourly) — reads from `fact_anomaly_event`.
  - Status color calculator (15-min or hourly).
- Implement watermark tracking for late-arriving data.
- Implement reprocessing logic using `event_log` as replay source.

### Step 6: Wire Dashboard API

- Point **Dashboard API Service** to `warehouse_db` `warehouse` schema for:
  - `/api/tenants/{tenantId}/dashboard/geo-summary`
  - `/api/tenants/{tenantId}/dashboard/dept-summary`
  - `/api/country/dashboard/summary`
- Use snapshot fact tables for dashboard queries (optimized for OLAP).
- Keep transactional DB for real-time, single-entity queries.

---

## 12. Summary

| Component | Specification |
|-----------|---------------|
| **Database** | Single `warehouse_db` PostgreSQL database with unified `warehouse` schema |
| **Multi-Tenancy** | Shared schema + `tenant_id INT` column in all tables. Supports tenant-specific and cross-tenant (country) queries. |
| **ID Alignment** | Uses INT IDs matching main DB (`scheme_master.id`, `person_master.id`, `village_master.id`, etc.) |
| **Event Tables** | Immutable event log (`event_log`) and event-grain fact tables (`fact_bfm_reading_event`, `fact_water_quantity_event`, `fact_anomaly_event`) |
| **Snapshot Fact Tables** | Dashboard-optimized tables (`fact_daily_submission`, `fact_water_quantity_daily`, `fact_anomaly`, `fact_status_snapshot`) |
| **Dimension Tables** | Flattened dimensions (`dim_tenant`, `dim_lgd_location`, `dim_admin_location`, `dim_village`, `dim_scheme`, `dim_person`) |
| **ETL Control Tables** | Batch job runs, watermarks, dead-letter queue (`etl_batch_job_runs`, `etl_watermarks`, `etl_dead_letter`) |
| **Event Requirements** | All events must include `event_id` (UUID), `tenant_id` (INT), `timestamp`, `source_service`, `event_type`. Use `person_id` (INT) for identity. |
| **Idempotency** | Unique constraints on `(tenant_id, event_id)` in event tables. `ON CONFLICT` upserts in snapshot fact tables. |
| **Batch Frequency** | Dimensions: daily. Snapshot facts: 15-minute or hourly intervals. Midnight snapshot: daily. |
| **Late Data** | Reprocessing window (7 days). Watermark-based aggregation. Late events update snapshot tables. |

### Design Philosophy

This is an **Event-Driven ELT Warehouse Architecture** optimized for:

- **Reduced infrastructure complexity**: Single schema, single database
- **Kafka-driven ingestion**: Events flow directly to warehouse event tables
- **Snapshot-based dashboard performance**: Pre-aggregated fact tables for OLAP queries
- **Replay-safe event sourcing**: Immutable event_log enables full replay and audit

### Data Governance Summary

| Table Type | Mutability | Operations | Purpose |
|------------|------------|------------|---------|
| `event_log` | **Immutable** | Append only | Audit trail, replay source, idempotency |
| `fact_*_event` | **Append-only** | Insert (with idempotency) | Event-grain data, aggregation source |
| `fact_*_daily/snapshot` | **UPSERT** | Insert/Update via `ON CONFLICT` | Dashboard-optimized snapshots |
| `dim_*` | **UPSERT** | Insert/Update via `ON CONFLICT` | Reference data for joins |
| `etl_*` | **Mutable** | Full CRUD | ETL metadata and control |

---
---
---

## Appendix A: Table Definitions and Examples

This appendix contains all table DDL statements and example data for the warehouse database.

---

### A.1 Event Tables

#### A.1.1 warehouse.event_log

**Purpose:** Immutable audit trail of all Kafka events. Never deleted or modified. Used for replay and idempotency.

**DDL:**

```sql
CREATE TABLE warehouse.event_log (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL,
    tenant_id INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    partition_id INTEGER NOT NULL,
    offset BIGINT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_event_log_tenant_event UNIQUE (tenant_id, event_id),
    CONSTRAINT uk_event_log_topic_partition_offset UNIQUE (topic, partition_id, offset)
);

CREATE INDEX idx_event_log_tenant ON warehouse.event_log(tenant_id);
CREATE INDEX idx_event_log_tenant_topic ON warehouse.event_log(tenant_id, topic, created_at);
CREATE INDEX idx_event_log_processed ON warehouse.event_log(processed_at) WHERE processed_at IS NULL;
```

**Data Governance:** This table is **IMMUTABLE**. Append-only, no updates or deletes allowed.

**Example Data:**

| id | event_id | tenant_id | topic                    | partition_id | offset | payload (JSONB)                                   | created_at             | processed_at           |
|----|----------|-----------|--------------------------|--------------|--------|---------------------------------------------------|------------------------|------------------------|
| 1  | uuid1    | 1         | field.submission.created | 0            | 123    | {"scheme_id":101,"confirmed_reading":295}         | 2024-06-10 12:00:00+00 | 2024-06-10 12:00:10+00 |
| 2  | uuid2    | 1         | water.quantity.computed  | 0            | 124    | {"scheme_id":101,"computed_quantity_litre":10000} | 2024-06-10 12:01:00+00 | 2024-06-10 12:01:08+00 |
| 3  | uuid3    | 2         | anomaly.detected         | 1            | 201    | {"scheme_id":205,"type":"LOW_QUANTITY"}           | 2024-06-10 12:02:00+00 | (null)                 |

---

#### A.1.2 warehouse.fact_bfm_reading_event

**Purpose:** Event-grain BFM readings. Maps to `bfm_reading` from main DB.

**DDL:**

```sql
CREATE TABLE warehouse.fact_bfm_reading_event (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL,
    tenant_id INT NOT NULL,
    scheme_id INT NOT NULL,           -- References scheme_master.id
    person_id INT NOT NULL,           -- References person_master.id
    reading_date_time TIMESTAMP NOT NULL,
    reading_date DATE NOT NULL,
    confirmed_reading INT,
    extracted_reading INT,
    reading_url TEXT,
    source VARCHAR(50) NOT NULL,      -- WHATSAPP, MANUAL
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_bfm_event_tenant_event UNIQUE (tenant_id, event_id)
);

CREATE INDEX idx_fact_bfm_event_tenant_scheme_date ON warehouse.fact_bfm_reading_event(tenant_id, scheme_id, reading_date);
CREATE INDEX idx_fact_bfm_event_tenant_created ON warehouse.fact_bfm_reading_event(tenant_id, created_at);
```

**Data Governance:** This table is **append-only**. New events are inserted with idempotency via unique constraint.

**Example Data:**

| id | event_id | tenant_id | scheme_id | person_id | reading_date_time   | reading_date | confirmed_reading | extracted_reading | source   | created_at             |
|----|----------|-----------|-----------|-----------|---------------------|--------------|-------------------|-------------------|----------|------------------------|
| 1  | uuid8    | 1         | 101       | 501       | 2024-06-10 11:45:00 | 2024-06-10   | 295               | 294               | WHATSAPP | 2024-06-10 11:46:00+00 |
| 2  | uuid9    | 1         | 102       | 502       | 2024-06-11 09:35:00 | 2024-06-11   | 331               | 330               | MANUAL   | 2024-06-11 09:36:00+00 |
| 3  | uuid10   | 2         | 205       | 603       | 2024-06-12 18:15:00 | 2024-06-12   | 278               | NULL              | WHATSAPP | 2024-06-12 18:16:00+00 |

---

#### A.1.3 warehouse.fact_water_quantity_event

**Purpose:** Event-grain computed water quantities per scheme per date.

**DDL:**

```sql
CREATE TABLE warehouse.fact_water_quantity_event (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL,
    tenant_id INT NOT NULL,
    scheme_id INT NOT NULL,
    date DATE NOT NULL,
    computed_quantity_litre DECIMAL(12,2) NOT NULL,
    start_reading INT,
    end_reading INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_water_qty_event_tenant_scheme_date UNIQUE (tenant_id, scheme_id, date)
);

CREATE INDEX idx_fact_water_qty_event_tenant ON warehouse.fact_water_quantity_event(tenant_id, scheme_id, date);
CREATE INDEX idx_fact_water_qty_event_tenant_created ON warehouse.fact_water_quantity_event(tenant_id, created_at);
```

**Data Governance:** This table is **append-only**. New events are inserted with idempotency via unique constraint.

**Example Data:**

| id | event_id | tenant_id | scheme_id | date       | computed_quantity_litre | start_reading | end_reading | created_at             |
|----|----------|-----------|-----------|------------|-------------------------|---------------|-------------|------------------------|
| 1  | uuid11   | 1         | 101       | 2024-06-10 | 1250.50                 | 295           | 312         | 2024-06-10 12:00:00+00 |
| 2  | uuid12   | 1         | 102       | 2024-06-11 | 900.00                  | 331           | 340         | 2024-06-11 10:00:00+00 |
| 3  | uuid13   | 2         | 205       | 2024-06-12 | 1875.25                 | 278           | 295         | 2024-06-12 19:00:00+00 |

---

#### A.1.4 warehouse.fact_anomaly_event

**Purpose:** Event-grain anomalies as detected.

**DDL:**

```sql
CREATE TABLE warehouse.fact_anomaly_event (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL,
    tenant_id INT NOT NULL,
    scheme_id INT NOT NULL,
    anomaly_type VARCHAR(100) NOT NULL,  -- LOW_QUANTITY, NO_SUBMISSION, REPEATED_IMAGE
    anomaly_date DATE NOT NULL,
    expected_qty_ltr DECIMAL(12,2),
    actual_qty_ltr DECIMAL(12,2),
    details JSONB,
    anomaly_status VARCHAR(50) NOT NULL DEFAULT 'OPEN',  -- OPEN, RESOLVED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_anomaly_event_tenant_event UNIQUE (tenant_id, event_id)
);

CREATE INDEX idx_fact_anomaly_event_tenant_scheme ON warehouse.fact_anomaly_event(tenant_id, scheme_id, anomaly_date);
CREATE INDEX idx_fact_anomaly_event_tenant_status ON warehouse.fact_anomaly_event(tenant_id, anomaly_status) WHERE anomaly_status = 'OPEN';
```

**Data Governance:** This table is **append-only**. New events are inserted with idempotency via unique constraint.

**Example Data:**

| id | event_id | tenant_id | scheme_id | anomaly_type   | anomaly_date | expected_qty_ltr | actual_qty_ltr | details                    | anomaly_status | created_at             |
|----|----------|-----------|-----------|----------------|--------------|------------------|----------------|----------------------------|----------------|------------------------|
| 1  | uuid21   | 1         | 101       | LOW_QUANTITY   | 2024-06-15   | 2000.00          | 200.00         | {"threshold": 500}         | OPEN           | 2024-06-15 12:12:00+00 |
| 2  | uuid22   | 2         | 205       | NO_SUBMISSION  | 2024-06-16   | NULL             | NULL           | {"reason": "Missed entry"} | OPEN           | 2024-06-16 10:10:00+00 |
| 3  | uuid23   | 1         | 102       | REPEATED_IMAGE | 2024-06-17   | NULL             | NULL           | {"image_hash": "abcd1234"} | RESOLVED       | 2024-06-17 19:45:00+00 |

---

### A.2 Dimension Tables

#### A.2.1 warehouse.dim_tenant

**DDL:**

```sql
CREATE TABLE warehouse.dim_tenant (
    tenant_id SERIAL PRIMARY KEY,
    tenant_code VARCHAR(20) NOT NULL UNIQUE,  -- e.g., 'ASSAM', 'PUNJAB', 'BIHAR'
    tenant_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL DEFAULT 'IN',
    config JSONB,  -- Tenant-specific config (water norms, thresholds, etc.)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

**Example Data:**

| tenant_id | tenant_code | tenant_name                          | country_code | is_active | updated_at             |
|-----------|-------------|--------------------------------------|--------------|-----------|------------------------|
| 1         | ASSAM       | Assam Jal Jeevan Mission             | IN           | TRUE      | 2024-06-01 10:00:00+00 |
| 2         | PUNJAB      | Punjab Water Supply & Sanitation     | IN           | TRUE      | 2024-06-01 10:00:00+00 |
| 3         | BIHAR       | Bihar Public Health Engineering Dept | IN           | TRUE      | 2024-06-01 10:00:00+00 |

---

#### A.2.2 warehouse.dim_lgd_location

**Purpose:** Flattened LGD geographic hierarchy. This is the authoritative geography dimension for geo drilldown and map visualization.

**Hierarchy Levels:** STATE → DISTRICT → BLOCK → GRAM_PANCHAYAT → VILLAGE

**Key Points:**
- `location_type` includes `VILLAGE` — LGD village is treated as an administrative geographic node
- Geometry (`geom`) is stored for all hierarchy levels including villages
- This table is the single source of truth for geographic boundaries

**DDL:**

```sql
CREATE TABLE warehouse.dim_lgd_location (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_lgd_id INT NOT NULL,       -- Original lgd_location_master.id
    parent_id INT,                    -- References dim_lgd_location.source_lgd_id for hierarchy traversal
    title VARCHAR(255) NOT NULL,
    lgd_code VARCHAR(50),
    location_type VARCHAR(50) NOT NULL,  -- STATE, DISTRICT, BLOCK, GRAM_PANCHAYAT, VILLAGE
    -- Denormalized parent IDs (flattened hierarchy)
    lgd_state_id INT,
    lgd_state_name VARCHAR(255),
    lgd_district_id INT,
    lgd_district_name VARCHAR(255),
    lgd_block_id INT,
    lgd_block_name VARCHAR(255),
    lgd_gram_panchayat_id INT,
    lgd_gram_panchayat_name VARCHAR(255),
    -- Village-specific fields (applicable when location_type='VILLAGE')
    household_count INT,
    admin_location_id INT,            -- References dim_admin_location for village admin mapping
    -- PostGIS geometry column for map visualization (see Section 6.3)
    geom geometry(MULTIPOLYGON, 4326),  -- Simplified geometry for dashboard rendering
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_lgd_tenant_source UNIQUE (tenant_id, source_lgd_id)
);

CREATE INDEX idx_dim_lgd_tenant_type ON warehouse.dim_lgd_location(tenant_id, location_type);
CREATE INDEX idx_dim_lgd_tenant_district ON warehouse.dim_lgd_location(tenant_id, lgd_district_id);
CREATE INDEX idx_dim_lgd_tenant_block ON warehouse.dim_lgd_location(tenant_id, lgd_block_id);
CREATE INDEX idx_dim_lgd_parent ON warehouse.dim_lgd_location(parent_id);
CREATE INDEX idx_dim_lgd_geom ON warehouse.dim_lgd_location USING GIST (geom);
```

**Example Data:**

| id | tenant_id | source_lgd_id | title     | lgd_code | location_type | lgd_state_id | lgd_state_name | lgd_district_id | lgd_district_name | lgd_block_id | lgd_block_name |
|----|-----------|---------------|-----------|----------|---------------|--------------|----------------|-----------------|-------------------|--------------|----------------|
| 1  | 1         | 1             | Assam     | AS001    | STATE         | 1            | Assam          | NULL            | NULL              | NULL         | NULL           |
| 2  | 1         | 10            | Kamrup    | KM001    | DISTRICT      | 1            | Assam          | 10              | Kamrup            | NULL         | NULL           |
| 3  | 1         | 101           | Block A   | BA001    | BLOCK         | 1            | Assam          | 10              | Kamrup            | 101          | Block A        |
| 4  | 1         | 1001          | Village X | VX001    | VILLAGE       | 1            | Assam          | 10              | Kamrup            | 101          | Block A        |

---

#### A.2.3 warehouse.dim_admin_location

**Purpose:** Flattened administrative jurisdiction hierarchy. This hierarchy intentionally stops at SUB_DIVISION level.

**Design Rationale:** Villages are NOT modeled as child hierarchy nodes inside `dim_admin_location`. Instead, department jurisdiction over villages is represented via mapping in `warehouse.dim_village.admin_location_id`. This design allows jurisdiction reassignment without restructuring the administrative hierarchy.

**DDL:**

```sql
CREATE TABLE warehouse.dim_admin_location (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_admin_id INT NOT NULL,     -- Original administrative_location_master.id
    title VARCHAR(255) NOT NULL,
    location_type VARCHAR(50) NOT NULL,  -- ZONE, CIRCLE, DIVISION, SUB_DIVISION
    -- Denormalized parent IDs
    admin_zone_id INT,
    admin_zone_name VARCHAR(255),
    admin_circle_id INT,
    admin_circle_name VARCHAR(255),
    admin_division_id INT,
    admin_division_name VARCHAR(255),
    admin_sub_division_id INT,
    admin_sub_division_name VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_admin_tenant_source UNIQUE (tenant_id, source_admin_id)
);

CREATE INDEX idx_dim_admin_tenant_type ON warehouse.dim_admin_location(tenant_id, location_type);
CREATE INDEX idx_dim_admin_tenant_division ON warehouse.dim_admin_location(tenant_id, admin_division_id);
```

**Example Data:**

| id | tenant_id | source_admin_id | title             | location_type | admin_zone_id | admin_zone_name | admin_circle_id | admin_circle_name | admin_division_id | admin_division_name |
|----|-----------|-----------------|-------------------|---------------|---------------|-----------------|-----------------|-------------------|-------------------|---------------------|
| 1  | 1         | 1               | North Zone        | ZONE          | 1             | North Zone      | NULL            | NULL              | NULL              | NULL                |
| 2  | 1         | 10              | Guwahati Circle   | CIRCLE        | 1             | North Zone      | 10              | Guwahati Circle   | NULL              | NULL                |
| 3  | 1         | 101             | Guwahati Division | DIVISION      | 1             | North Zone      | 10              | Guwahati Circle   | 101               | Guwahati Division   |
| 4  | 1         | 1001            | SubDiv A          | SUB_DIVISION  | 1             | North Zone      | 10              | Guwahati Circle   | 101               | Guwahati Division   |

---

#### A.2.4 warehouse.dim_village

**Purpose:** Service/operational village dimension. This is NOT a geographic hierarchy table.

**Role:** `dim_village` acts as a bridge dimension linking:
- **LGD geographic hierarchy** (via `lgd_location_id` → `dim_lgd_location`)
- **Administrative jurisdiction** (via `admin_location_id` → `dim_admin_location`)
- **Service analytics** (scheme mappings, habitation aggregation)

**Design Rationale:** This table remains separate from `dim_lgd_location` to maintain:
- Government-aligned geographic modeling (LGD hierarchy stores geography)
- Flexible operational mapping (jurisdiction can be reassigned without restructuring)
- Simplified ETL maintenance
- Future support for habitation or service clusters

**Note:** Village geometry is stored in `dim_lgd_location.geom` where `location_type='VILLAGE'`. This table references the LGD village node via `lgd_location_id`.

**DDL:**

```sql
CREATE TABLE warehouse.dim_village (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_village_id INT NOT NULL,   -- Original village_master.id
    title VARCHAR(255),
    lgd_code VARCHAR(50),
    household_count INT,
    -- Location references (geometry accessed via lgd_location_id join)
    lgd_location_id INT,              -- References dim_lgd_location.id where location_type='VILLAGE'
    admin_location_id INT,            -- References dim_admin_location.id for jurisdiction mapping
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_village_tenant_source UNIQUE (tenant_id, source_village_id)
);

CREATE INDEX idx_dim_village_tenant ON warehouse.dim_village(tenant_id);
CREATE INDEX idx_dim_village_tenant_lgd ON warehouse.dim_village(tenant_id, lgd_location_id);
CREATE INDEX idx_dim_village_tenant_admin ON warehouse.dim_village(tenant_id, admin_location_id);
```

---

#### A.2.5 warehouse.dim_scheme

**DDL:**

```sql
CREATE TABLE warehouse.dim_scheme (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_scheme_id INT NOT NULL,    -- Original scheme_master.id
    scheme_name VARCHAR(255),
    state_scheme_id INT,
    centre_scheme_id INT,
    fhtc_count INT,
    planned_fhtc INT,
    house_hold_count INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    -- Denormalized village
    village_id INT,                   -- References dim_village.id
    village_name VARCHAR(255),
    -- Denormalized LGD hierarchy (flattened)
    lgd_state_id INT,
    lgd_state_name VARCHAR(255),
    lgd_district_id INT,
    lgd_district_name VARCHAR(255),
    lgd_block_id INT,
    lgd_block_name VARCHAR(255),
    lgd_gram_panchayat_id INT,
    lgd_gram_panchayat_name VARCHAR(255),
    -- Denormalized admin hierarchy (flattened)
    admin_zone_id INT,
    admin_zone_name VARCHAR(255),
    admin_circle_id INT,
    admin_circle_name VARCHAR(255),
    admin_division_id INT,
    admin_division_name VARCHAR(255),
    admin_sub_division_id INT,
    admin_sub_division_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_scheme_tenant_source UNIQUE (tenant_id, source_scheme_id)
);

CREATE INDEX idx_dim_scheme_tenant ON warehouse.dim_scheme(tenant_id);
CREATE INDEX idx_dim_scheme_tenant_district ON warehouse.dim_scheme(tenant_id, lgd_district_id);
CREATE INDEX idx_dim_scheme_tenant_division ON warehouse.dim_scheme(tenant_id, admin_division_id);
CREATE INDEX idx_dim_scheme_tenant_village ON warehouse.dim_scheme(tenant_id, village_id);
```

**Example Data:**

| id | tenant_id | source_scheme_id | scheme_name                      | village_id | lgd_district_id | lgd_district_name | admin_division_id | admin_division_name | status   |
|----|-----------|------------------|----------------------------------|------------|-----------------|-------------------|-------------------|---------------------|----------|
| 1  | 1         | 101              | Jal Jeevan Scheme - Village X    | 4          | 10              | Kamrup            | 101               | Guwahati Division   | ACTIVE   |
| 2  | 1         | 102              | Water Supply - Village Y         | 5          | 10              | Kamrup            | 101               | Guwahati Division   | ACTIVE   |
| 3  | 2         | 205              | Rural Water Project - Village Z  | 12         | 20              | Ludhiana          | 201               | Ludhiana Division   | INACTIVE |

---

#### A.2.6 warehouse.dim_person

**DDL:**

```sql
CREATE TABLE warehouse.dim_person (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_person_id INT NOT NULL,    -- Original person_master.id
    full_name VARCHAR(200),
    person_type VARCHAR(100),         -- Denormalized from person_type_master
    -- No phone_number (PII excluded from warehouse)
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_person_tenant_source UNIQUE (tenant_id, source_person_id)
);

CREATE INDEX idx_dim_person_tenant ON warehouse.dim_person(tenant_id);
CREATE INDEX idx_dim_person_tenant_type ON warehouse.dim_person(tenant_id, person_type);
```

---

### A.3 Snapshot Fact Tables

#### A.3.1 warehouse.fact_daily_submission

**Purpose:** Daily submission percentages and counts. Dashboard-optimized snapshot.

**DDL:**

```sql
CREATE TABLE warehouse.fact_daily_submission (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT NOT NULL,           -- References dim_scheme.id
    village_id INT,                   -- References dim_village.id
    lgd_district_id INT,              -- Denormalized for efficient filtering
    admin_division_id INT,            -- Denormalized for efficient filtering
    date DATE NOT NULL,
    total_operators INTEGER NOT NULL,
    submitted_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_daily_sub UNIQUE (tenant_id, scheme_id, date)
);

CREATE INDEX idx_fact_daily_sub_tenant_date ON warehouse.fact_daily_submission(tenant_id, date);
CREATE INDEX idx_fact_daily_sub_tenant_district_date ON warehouse.fact_daily_submission(tenant_id, lgd_district_id, date);
CREATE INDEX idx_fact_daily_sub_tenant_village_date ON warehouse.fact_daily_submission(tenant_id, village_id, date);
CREATE INDEX idx_fact_daily_sub_tenant_division_date ON warehouse.fact_daily_submission(tenant_id, admin_division_id, date);
```

**Data Governance:** Supports UPSERT via `ON CONFLICT ... DO UPDATE`.

**Example Data:**

| id | tenant_id | scheme_id | village_id | lgd_district_id | date       | total_operators | submitted_count | created_at             |
|----|-----------|-----------|------------|-----------------|------------|-----------------|-----------------|------------------------|
| 1  | 1         | 1         | 4          | 10              | 2024-06-10 | 1               | 1               | 2024-06-10 23:59:59+00 |
| 2  | 1         | 2         | 5          | 10              | 2024-06-10 | 1               | 0               | 2024-06-10 23:59:59+00 |
| 3  | 2         | 3         | 12         | 20              | 2024-06-11 | 2               | 2               | 2024-06-11 23:59:59+00 |

---

#### A.3.2 warehouse.fact_water_quantity_daily

**Purpose:** Daily Water Supply Snapshot. One row per scheme per date. Dashboard-optimized.

**Table characteristics:**
- **One row per scheme per date** (enforced by unique constraint).
- `water_supplied` explicitly indicates whether water was supplied on that date (TRUE/FALSE).
- `qty_ltr` is always numeric (never NULL); defaults to 0 for no-supply days.
- Rows for no-supply days are inserted via a midnight snapshot job.
- Late-arriving events update existing rows using UPSERT.

**DDL:**

```sql
CREATE TABLE warehouse.fact_water_quantity_daily (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT NOT NULL,           -- References dim_scheme.id
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    water_supplied BOOLEAN NOT NULL,
    qty_ltr DECIMAL(12,2) NOT NULL DEFAULT 0,
    data_source VARCHAR(50) NOT NULL,  -- EVENT / SNAPSHOT_BACKFILL / LATE_EVENT_UPDATE
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_water_qty_daily UNIQUE (tenant_id, scheme_id, date)
);

CREATE INDEX idx_fwq_daily_tenant_date ON warehouse.fact_water_quantity_daily(tenant_id, date);
CREATE INDEX idx_fwq_daily_tenant_district_date ON warehouse.fact_water_quantity_daily(tenant_id, lgd_district_id, date);
CREATE INDEX idx_fwq_daily_tenant_scheme_date ON warehouse.fact_water_quantity_daily(tenant_id, scheme_id, date);
CREATE INDEX idx_fwq_daily_tenant_division_date ON warehouse.fact_water_quantity_daily(tenant_id, admin_division_id, date);
```

**Data Governance:** Supports UPSERT via `ON CONFLICT ... DO UPDATE`. Late-arriving events update `data_source` to `'LATE_EVENT_UPDATE'`.

**Example Data:**

| id | tenant_id | scheme_id | village_id | lgd_district_id | date       | water_supplied | qty_ltr  | data_source       | last_updated_at        | created_at             |
|----|-----------|-----------|------------|-----------------|------------|----------------|----------|-------------------|------------------------|------------------------|
| 1  | 1         | 1         | 4          | 10              | 2024-06-10 | TRUE           | 10500.00 | EVENT             | 2024-06-10 18:30:00+00 | 2024-06-10 18:30:00+00 |
| 2  | 1         | 2         | 5          | 10              | 2024-06-10 | FALSE          | 0.00     | SNAPSHOT_BACKFILL | 2024-06-11 00:05:00+00 | 2024-06-11 00:05:00+00 |
| 3  | 1         | 1         | 4          | 10              | 2024-06-11 | TRUE           | 9800.00  | LATE_EVENT_UPDATE | 2024-06-12 10:15:00+00 | 2024-06-11 00:05:00+00 |

---

#### A.3.3 warehouse.fact_anomaly

**Purpose:** Aggregated anomaly metrics by type and status. Dashboard-optimized snapshot.

**DDL:**

```sql
CREATE TABLE warehouse.fact_anomaly (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT,                    -- References dim_scheme.id
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    anomaly_type VARCHAR(100) NOT NULL,  -- LOW_QUANTITY, NO_SUBMISSION, REPEATED_IMAGE
    open_count INTEGER NOT NULL DEFAULT 0,
    resolved_count INTEGER NOT NULL DEFAULT 0,
    total_expected_qty_ltr DECIMAL(12,2) DEFAULT 0,
    total_actual_qty_ltr DECIMAL(12,2) DEFAULT 0,
    loaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_anomaly UNIQUE (tenant_id, COALESCE(scheme_id, 0), date, anomaly_type)
);

CREATE INDEX idx_fact_anomaly_tenant_date ON warehouse.fact_anomaly(tenant_id, date);
CREATE INDEX idx_fact_anomaly_tenant_type ON warehouse.fact_anomaly(tenant_id, anomaly_type, date);
CREATE INDEX idx_fact_anomaly_tenant_district ON warehouse.fact_anomaly(tenant_id, lgd_district_id, date);
```

**Data Governance:** Supports UPSERT via `ON CONFLICT ... DO UPDATE`.

**Example Data:**

| id | tenant_id | scheme_id | lgd_district_id | date       | anomaly_type  | open_count | resolved_count | total_expected_qty_ltr | total_actual_qty_ltr |
|----|-----------|-----------|-----------------|------------|---------------|------------|----------------|------------------------|----------------------|
| 1  | 1         | 1         | 10              | 2024-06-15 | LOW_QUANTITY  | 1          | 0              | 2000.00                | 200.00               |
| 2  | 2         | 3         | 20              | 2024-06-16 | NO_SUBMISSION | 1          | 0              | 0.00                   | 0.00                 |

---

#### A.3.4 warehouse.fact_status_snapshot

**Purpose:** Status color per scheme/geo/date (derived from rules). Dashboard-optimized snapshot.

**DDL:**

```sql
CREATE TABLE warehouse.fact_status_snapshot (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT,
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,      -- GREEN, LIGHT_GREEN, ORANGE, RED, DARK_RED
    score DECIMAL(5,2),
    rule_applied VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_status UNIQUE (tenant_id, COALESCE(scheme_id, 0), COALESCE(village_id, 0), date)
);

CREATE INDEX idx_fact_status_tenant_date ON warehouse.fact_status_snapshot(tenant_id, date);
CREATE INDEX idx_fact_status_tenant_status ON warehouse.fact_status_snapshot(tenant_id, status, date);
CREATE INDEX idx_fact_status_tenant_district ON warehouse.fact_status_snapshot(tenant_id, lgd_district_id, date);
```

**Data Governance:** Supports UPSERT via `ON CONFLICT ... DO UPDATE`.

**Example Data:**

| id | tenant_id | scheme_id | lgd_district_id | date       | status | score | rule_applied              | created_at             |
|----|-----------|-----------|-----------------|------------|--------|-------|---------------------------|------------------------|
| 1  | 1         | 1         | 10              | 2024-06-10 | GREEN  | 98.56 | All metrics within normal | 2024-06-10 23:59:59+00 |
| 2  | 1         | 2         | 10              | 2024-06-10 | ORANGE | 68.20 | Low daily submission      | 2024-06-10 23:59:59+00 |
| 3  | 2         | 3         | 20              | 2024-06-11 | RED    | 40.00 | Severe no-water event     | 2024-06-11 23:59:59+00 |

---

### A.4 ETL Control Tables
| Table                | Purpose                                                                                               |
|----------------------|-------------------------------------------------------------------------------------------------------|
| etl_batch_job_runs   | Tracks execution history of batch jobs (status, start/end time, records processed, errors)            |
| etl_watermarks       | Stores the "last processed" timestamp/date for each data stream to handle late-arriving data          |
| etl_dead_letter      | Captures failed events that couldn't be processed for manual review and retry                         |


#### A.4.1 warehouse.etl_batch_job_runs

**Purpose:** Tracks batch job execution.

**DDL:**

```sql
CREATE TABLE warehouse.etl_batch_job_runs (
    job_name VARCHAR(255) NOT NULL,
    run_id UUID PRIMARY KEY,
    tenant_id INT,                    -- NULL for cross-tenant jobs
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL,      -- RUNNING, COMPLETED, FAILED
    records_processed INTEGER,
    error_message TEXT,
    metadata JSONB
);

CREATE INDEX idx_etl_job_tenant ON warehouse.etl_batch_job_runs(tenant_id, job_name, started_at);
CREATE INDEX idx_etl_job_status ON warehouse.etl_batch_job_runs(job_name, status, started_at);
```

---

#### A.4.2 warehouse.etl_watermarks

**Purpose:** Tracks processing progress for late-arriving data handling.

**DDL:**

```sql
CREATE TABLE warehouse.etl_watermarks (
    tenant_id INT NOT NULL,
    scheme_id INT NOT NULL,
    fact_type VARCHAR(100) NOT NULL,  -- DAILY_SUBMISSION, WATER_QUANTITY, ANOMALY
    watermark_date DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tenant_id, scheme_id, fact_type)
);
```

---

#### A.4.3 warehouse.etl_dead_letter

**Purpose:** Failed events for manual review.

**DDL:**

```sql
CREATE TABLE warehouse.etl_dead_letter (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID,
    tenant_id INT,
    topic VARCHAR(255),
    partition_id INTEGER,
    offset BIGINT,
    payload JSONB,
    error_message TEXT,
    error_type VARCHAR(100),          -- VALIDATION_ERROR, PROCESSING_ERROR, etc.
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(100)
);

CREATE INDEX idx_etl_dead_letter_unresolved ON warehouse.etl_dead_letter(created_at) WHERE resolved_at IS NULL;
```
