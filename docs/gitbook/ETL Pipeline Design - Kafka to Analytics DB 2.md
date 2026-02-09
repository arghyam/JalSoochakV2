# ETL Pipeline Design: Kafka Consumer → Staging → Analytics DB

This document defines the ETL pipeline for JalSoochak v2: consuming events from Kafka, staging them in PostgreSQL, and loading aggregated data into a PostgreSQL Analytics DB for dashboards and reporting.

---

## 1. Pipeline Overview

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Source Services │     │       Kafka          │     │  ETL Service     │     │  Analytics DB    │
│  (Field Ops,     │────▶│  (event topics)      │────▶│  (consumer +     │────▶│  (PostgreSQL     │
│   Messaging,     │     │                      │     │   loader jobs)   │     │   star schema)   │
│   Management)    │     │                      │     │                  │     │                  │
└─────────────────┘     └──────────────────────┘     └─────────────────┘     └──────────────────┘
                                                               │
                                                               ▼
                                                        ┌─────────────────┐
                                                        │  Staging DB     │
                                                        │  (PostgreSQL)   │
                                                        │  (raw + cleaned) │
                                                        └─────────────────┘
```

**Pipeline stages:**

- **Extract**: Kafka consumers continuously ingest events from topics (streaming).
- **Transform**: Events are validated, deduplicated, and normalized into staging tables. Batch jobs aggregate staging data.
- **Load**: Scheduled jobs transform staging aggregates into Analytics DB fact and dimension tables (batch, typically 15-minute or hourly intervals).

---

## 2. Services Involved

| Service | Responsibility |
|--------|----------------|
| **ETL / Analytics Ingestion Service** (new) | Java + Spring Boot service that: (1) consumes Kafka topics via Spring Kafka consumers, (2) writes raw and cleaned events to Staging DB (PostgreSQL), (3) runs scheduled batch jobs (ShedLock/Quartz) that aggregate staging data and load into Analytics DB. |
| **Kafka** | Event backbone. Source services publish events; ETL service consumes. |
| **Staging DB** (PostgreSQL) | Separate PostgreSQL database (or schema) containing raw event log, cleaned staging tables, and ETL control metadata. Isolated from transactional DB to avoid OLTP impact. |
| **Analytics DB** (PostgreSQL) | Read-optimized PostgreSQL database with star schema (dimensions and facts). Serves Dashboard API Service queries. |
| **Source services** (existing) | **Management Service**, **Messaging Orchestrator**, **Field Operations**,  These services **produce** events to Kafka only; they do not participate in ETL. |

**Optional separation (for scale):**

- **Kafka Consumer Service**: Consumes Kafka → writes to Staging DB (streaming).
- **Staging → Analytics Loader**: Reads from Staging DB, aggregates, loads into Analytics DB (batch, scheduled).

For initial implementation, a single **ETL / Analytics Ingestion Service** performing both functions is sufficient.

---

## 3. Kafka Topics and Events

### 3.1 Event Schema Requirements

**All events MUST include:**

- `event_id` (UUID, globally unique) — Required for idempotent processing and replay.
- `tenant_id` (UUID) — Required for multi-tenant isolation.
- `timestamp` (ISO 8601 UTC) — Event occurrence time.
- `source_service` (string) — Producer service identifier.
- `event_type` (string) — Event classification (e.g., `FIELD_SUBMISSION_CREATED`).

**NOTE: Event payloads are JSON. May consider Avro schema registry for schema evolution in production.To enforce the event formatting**

### 3.2 Topics and Event Payloads

| Topic | Event Type | Key Fields (beyond required) | Produced by | Analytics Purpose |
|-------|------------|------------------------------|-------------|-------------------|
| `field.submission.created` | `FIELD_SUBMISSION_CREATED` | `scheme_id`, `user_id`, `reading_value`, `reading_time`, `source` (WHATSAPP\|MANUAL), `raw_message_id` | Management Service / Field Operations | BFM readings, daily quantity calculation, submission rates, continuity |
| `water.quantity.computed` | `WATER_QUANTITY_COMPUTED` | `scheme_id`, `date`, `computed_quantity_litre`, `start_reading`, `end_reading` | Field Operations | Water supplied metrics, trends |
| `pump-operator-created` | `PUMP_OPERATOR_CREATED` | `user_id`, `full_name`, `phone_number` | Messaging Orchestrator | Operator onboarding counts, active operator base |
| `anomaly.detected` | `ANOMALY_DETECTED` | `scheme_id`, `type` (LOW_QUANTITY\|NO_SUBMISSION\|REPEATED_IMAGE), `date`, `expected_qty_ltr`, `actual_qty_ltr`, `details` (JSON) | Anomaly / Field Operations | Anomaly counts, status color derivation. **Note:** Anomaly detection happens upstream; ETL stores source-of-truth values from events. |
| `config.updated` (optional, if there is any tenant-specific config) | `CONFIG_UPDATED` | `config_type` (WATER_NORMS\|ESCALATION_RULES), `config_payload` (JSON) | State Config Service | Context for threshold-based reports |

**We may consider data sync at regular intervals**

**Identity standardization:** Use `user_id` consistently across all events (not `operator_id`, `person_id`, or `pump_operator_id`). Map legacy `person_id` fields to `user_id` during staging normalization.

**Implementation priority:**

1. **Phase 1**: `field.submission.created`, `water.quantity.computed`
2. **Phase 2**: `pump-operator-created` (enhance existing), `anomaly.detected`

---

## 4. Staging Layer (Staging DB - PostgreSQL)

### 4.1 Responsibilities

Staging DB serves three distinct purposes:

1. **Raw event log** — Immutable audit trail of all consumed Kafka events. Used for replay and debugging.
2. **Cleaned / normalized staging** — Parsed, validated, deduplicated event data in domain-aligned tables. Input for aggregation jobs.
3. **ETL control metadata** — Kafka consumer offsets, batch job execution state, reprocessing windows.

### 4.2 Staging Tables

#### Raw Event Log

**`stg_event_log`** — Single table for all topics (simplifies management vs. per-topic tables).

```sql
CREATE TABLE stg_event_log (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,  -- Global event UUID from Kafka payload
    topic VARCHAR(255) NOT NULL,
    partition_id INTEGER NOT NULL,
    offset BIGINT NOT NULL,
    payload JSONB NOT NULL,  -- Full event payload (PostgreSQL JSONB for querying)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_event_log_topic_partition_offset UNIQUE (topic, partition_id, offset)
);

CREATE INDEX idx_stg_event_log_event_id ON stg_event_log(event_id);
CREATE INDEX idx_stg_event_log_topic_ingested ON stg_event_log(topic, created_at);
CREATE INDEX idx_stg_event_log_processed ON stg_event_log(processed_at) WHERE processed_at IS NULL;

| id | event_id | topic                    | partition_id | offset | payload (JSONB)                                     | created_at              | processed_at             |
|----|----------|--------------------------|--------------|--------|-----------------------------------------------------|-------------------------|--------------------------|
| 1  | uuid1    | field.submission.created | 0            | 123    | {"scheme_id":"...","reading_value":29.5}            | 2023-10-01 12:00:00+00  | 2023-10-01 12:00:10+00   |
| 2  | uuid2    | water.quantity.computed  | 0            | 124    | {"scheme_id":"...","computed_quantity_litre":10000} | 2023-10-01 12:01:00+00  | 2023-10-01 12:01:08+00   |
| 3  | uuid3    | anomaly.detected         | 1            | 201    | {"scheme_id":"...","type":"LOW_QUANTITY"}           | 2023-10-01 12:02:00+00  | (null)                   |
| 4  | uuid4    | pump-operator-created    | 1            | 202    | {"user_id":"...","full_name":"Jane Doe"}            | 2023-10-01 12:03:00+00  | 2023-10-01 12:03:10+00   |




```

**Idempotency:** Unique constraint on `(topic, partition_id, offset)` prevents duplicate ingestion. `event_id` uniqueness enables cross-topic deduplication if needed.

#### Cleaned Staging Tables

**`stg_bfm_readings`**

```sql
CREATE TABLE stg_bfm_readings (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE REFERENCES stg_event_log(event_id),
    tenant_id UUID NOT NULL,
    scheme_id UUID NOT NULL,
    user_id UUID NOT NULL,  -- Standardized identity
    reading_value DECIMAL(10,2) NOT NULL,
    reading_time TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(50) NOT NULL,  -- WHATSAPP, MANUAL, etc.
    raw_message_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stg_bfm_readings_event_id ON stg_bfm_readings(event_id);
CREATE INDEX idx_stg_bfm_readings_tenant_scheme_time ON stg_bfm_readings(tenant_id, scheme_id, reading_time);
CREATE INDEX idx_stg_bfm_readings_ingested ON stg_bfm_readings(created_at);



| id | event_id | tenant_id | scheme_id | user_id | reading_value | reading_time            | source    | raw_message_id | created_at              |
|----|----------|-----------|-----------|---------|--------------|--------------------------|-----------|----------------|-------------------------|
| 1  | uuid8    | t1        | s1        | u5      | 29.50        | 2023-10-01 11:45:00+00   | WHATSAPP  | rmid1          | 2023-10-01 11:46:00+00  |
| 2  | uuid9    | t2        | s2        | u6      | 33.10        | 2023-10-02 09:35:00+00   | MANUAL    | rmid2          | 2023-10-02 09:36:00+00  |
| 3  | uuid10   | t1        | s3        | u7      | 27.80        | 2023-10-03 18:15:00+00   | WHATSAPP  | rmid3          | 2023-10-03 18:16:00+00  |


```

**`stg_water_quantities`**

```sql
CREATE TABLE stg_water_quantities (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE REFERENCES stg_event_log(event_id),
    tenant_id UUID NOT NULL,
    scheme_id UUID NOT NULL,
    date DATE NOT NULL,
    computed_quantity_litre DECIMAL(12,2) NOT NULL,
    start_reading DECIMAL(10,2) NOT NULL,  -- BFM reading value at start of period
    end_reading DECIMAL(10,2) NOT NULL,      -- BFM reading value at end of period
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_stg_water_quantities_scheme_date UNIQUE (scheme_id, date)
);

CREATE INDEX idx_stg_water_quantities_event_id ON stg_water_quantities(event_id);
CREATE INDEX idx_stg_water_quantities_tenant_scheme_date ON stg_water_quantities(tenant_id, scheme_id, date);

| id | event_id | tenant_id | scheme_id | date       | computed_quantity_litre | start_reading | end_reading | created_at              |
|----|----------|-----------|-----------|------------|------------------------|---------------|-------------|-------------------------|
| 1  | uuid11   | t1        | s1        | 2023-10-01 | 1250.50                | 29.50         | 31.25       | 2023-10-01 12:00:00+00  |
| 2  | uuid12   | t2        | s2        | 2023-10-02 | 900.00                 | 33.10         | 34.00       | 2023-10-02 10:00:00+00  |
| 3  | uuid13   | t1        | s3        | 2023-10-03 | 1875.25                | 27.80         | 29.55       | 2023-10-03 19:00:00+00  |

```
<!-- 
**`stg_operator_events`**

```sql
CREATE TABLE stg_operator_events (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE REFERENCES stg_event_log(event_id),
    user_id UUID NOT NULL,  -- Standardized identity
    event_type VARCHAR(100) NOT NULL,  -- CREATED, UPDATED, DEACTIVATED
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stg_operator_events_event_id ON stg_operator_events(event_id);
CREATE INDEX idx_stg_operator_events_user_time ON stg_operator_events(user_id, event_time);
``` -->

**`stg_anomalies`** — Source-of-truth staging table for anomalies. Anomaly detection happens upstream (Anomaly Detection Module / Field Operations Service); ETL stores the full anomaly payload including `expected_qty_ltr` and `actual_qty_ltr` directly from Kafka events for auditability and replay.

```sql
CREATE TABLE stg_anomalies (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE REFERENCES stg_event_log(event_id),
    tenant_id UUID NOT NULL,
    scheme_id UUID NOT NULL,
    anomaly_type VARCHAR(100) NOT NULL,  -- LOW_QUANTITY, NO_SUBMISSION, REPEATED_IMAGE
    anomaly_date DATE NOT NULL,
    expected_qty_ltr DECIMAL(12,2),  -- Source-of-truth: expected quantity from upstream anomaly detection
    actual_qty_ltr DECIMAL(12,2),      -- Source-of-truth: actual quantity from upstream anomaly detection
    details JSONB,  -- PostgreSQL JSONB for flexible anomaly metadata (full event payload preserved)
    anomaly_status VARCHAR(50) NOT NULL DEFAULT 'OPEN',  -- OPEN, RESOLVED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stg_anomalies_event_id ON stg_anomalies(event_id);
CREATE INDEX idx_stg_anomalies_tenant_scheme_date ON stg_anomalies(tenant_id, scheme_id, anomaly_date);
CREATE INDEX idx_stg_anomalies_status ON stg_anomalies(anomaly_status) WHERE anomaly_status = 'OPEN';

| id | event_id | tenant_id | scheme_id | anomaly_type     | anomaly_date | expected_qty_ltr | actual_qty_ltr | details                                          | anomaly_status | created_at              |
|----|----------|-----------|-----------|------------------|--------------|------------------|----------------|--------------------------------------------------|----------------|-------------------------|
| 1  | uuid21   | t1        | s1        | LOW_QUANTITY     | 2023-10-05   | 2000.00          | 200.00         | {"threshold": 500, "rule_applied": "min_quantity"}| OPEN          | 2023-10-05 12:12:00+00  |
| 2  | uuid22   | t2        | s2        | NO_SUBMISSION    | 2023-10-06   | NULL             | NULL           | {"reason": "Missed mandatory entry"}             | OPEN           | 2023-10-06 10:10:00+00  |
| 3  | uuid23   | t1        | s3        | REPEATED_IMAGE   | 2023-10-07   | NULL             | NULL           | {"image_hash": "abcd1234", "previous": "uuid09"} | RESOLVED       | 2023-10-07 19:45:00+00  |

```

#### ETL Control Metadata

<!-- **`etl_consumer_offsets`** — Tracks Kafka consumer group progress per topic/partition, will need further discussions/work.

```sql
CREATE TABLE etl_consumer_offsets (
    topic VARCHAR(255) NOT NULL,
    partition_id INTEGER NOT NULL,
    consumer_group VARCHAR(255) NOT NULL,
    last_offset BIGINT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (topic, partition_id, consumer_group)
);
``` -->

**`etl_batch_job_runs`** — Tracks batch job execution for staging → analytics loads.

```sql
CREATE TABLE etl_batch_job_runs (
    job_name VARCHAR(255) NOT NULL,
    run_id UUID PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL,  -- RUNNING, COMPLETED, FAILED
    records_processed INTEGER,
    error_message TEXT,
    metadata JSONB
);

CREATE INDEX idx_etl_batch_job_runs_job_status ON etl_batch_job_runs(job_name, status, started_at);

| job_name         | run_id   | started_at              | completed_at           | status     | records_processed | error_message         | metadata                               |
|------------------|----------|-------------------------|------------------------|------------|-------------------|-----------------------|----------------------------------------|
| "daily_ingest"   | '4f87fee2'| 2023-10-10 01:05:00+00 | 2023-10-10 01:07:12+00 | COMPLETED  | 50000             | NULL                  | {"source": "kafka", "duration_sec": 132}|
| "daily_ingest"   | '1011a6b3'| 2023-10-11 01:05:02+00 | 2023-10-11 01:05:42+00 | FAILED     | 23012             | "DB write timeout"    | {"attempt": 1, "source": "kafka"}      |
| "delta_sync"     | '29f0e475'| 2023-10-12 03:02:00+00 | 2023-10-12 03:02:42+00 | COMPLETED  | 1289              | NULL                  | {"window": "2023-10-12"}              |


```

### 4.3 Kafka Consumer Behavior

**Offset commit semantics:** Commit offsets **only after successful write to Staging DB** (at-least-once delivery). Use idempotent writes (unique constraints) to handle duplicates.

**Consumer configuration:**

- `enable.auto.commit = false` — Manual offset commits after staging write.
- `isolation.level = read_committed` — Read only committed messages.
- `max.poll.records` — Batch size (e.g., 100-500) for efficient staging writes.

**Error handling:**

- Transient failures: Retry with exponential backoff, do not commit offset.
- Permanent failures: Write to dead-letter queue (separate table or topic), commit offset to avoid blocking.
- Dead-letter events: Log for manual review; do not block pipeline.

------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------
## 5. Analytics DB – Data Model (PostgreSQL)

### 5.1 Data Requirements

Analytics DB holds **aggregated, non-PII(personally identifiable information) data** for:

- Tenant-specific and country-level dashboards.
- Drill-down by **geo hierarchy** (State → District → Block → GP → Village) and **department hierarchy** (Zone → Circle → Division → Sub-division).
- Metrics: status color, daily submission %, water quantity supplied, continuity/no-water days, active vs inactive operator counts, comparative views.

**PII exclusion:** No raw phone numbers, operator names, or message content. Only `user_id` (UUID) if needed for "top N performers" queries (server-side aggregation only).

### 5.2 Star Schema Design

**Dimensions** — Flattened, denormalized tables (no recursive parent joins). Parent relationships are denormalized as columns (e.g., `geo_state_id`, `geo_district_id`) for query performance.

**Facts** — Aggregated metrics at specific grains (e.g., per tenant/geo/date, per tenant/scheme/date).

#### Dimension Tables

**`dim_tenant`**

```sql
CREATE TABLE dim_tenant (
    tenant_id UUID PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(10) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
Example rows (conceptually):

| tenant_id                              | code  | name            | country | updated_at                |
|----------------------------------------|-------|-----------------|---------|---------------------------|
| 36cf0e64-0bfa-4b99-b6c7-501d50cde857   | TN01  | Assam Water     | IN      | 2024-06-04T10:00:00+00:00 |
| 0a4a6090-64b4-4782-abd8-6cedd2e5b9f0   | TN02  | Punjab Water    | IN      | 2024-06-04T10:00:00+00:00 |
| 4bd917a3-8a7e-4a5a-bfbc-4c706a8fbf19   | TN03  | Bengal Jal      | IN      | 2024-06-04T10:00:00+00:00 |
| ebf0c75e-d9da-4e5b-a99a-c131dceec345   | TN04  | Bihar           | IN      | 2024-06-04T10:00:00+00:00 |



```

**`dim_geo`** — Flattened geo hierarchy (no recursive joins).

```sql
CREATE TABLE dim_geo (
    geo_id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    type VARCHAR(50) NOT NULL,  -- STATE, DISTRICT, BLOCK, GP, VILLAGE
    name VARCHAR(255) NOT NULL,
    -- Denormalized parent IDs (flattened hierarchy)
    geo_state_id UUID,
    geo_district_id UUID,
    geo_block_id UUID,
    geo_gp_id UUID, -- may not be needed 
    geo_village_id UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_dim_geo_tenant_type ON dim_geo(tenant_id, type);
CREATE INDEX idx_dim_geo_state ON dim_geo(geo_state_id) WHERE geo_state_id IS NOT NULL;
CREATE INDEX idx_dim_geo_district ON dim_geo(geo_district_id) WHERE geo_district_id IS NOT NULL;

Example rows (conceptually):

| geo_id |   type    |    name    | geo_state_id | geo_district_id | geo_block_id | geo_village_id |
|--------|-----------|------------|--------------|-----------------|--------------|----------------|
| s1     | STATE     | Assam      | s1           | NULL            | NULL         |  NULL          |
| d1     | DISTRICT  | Kamrup     | s1           | d1              | NULL         | NULL           |
| b1     | BLOCK     | Block A    | s1           | d1              | b1           | NULL           |
| v1     | VILLAGE   | Village X  | s1           | d1              | b1           |  v1            |

// TODO: explore materialised view for caching
// may be use in-memory caching
```

**`dim_dept_hierarchy`** — Flattened department hierarchy. may consider dept_hierarchy.

```sql
CREATE TABLE dim_dept_hierarchy (
    dept_id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    type VARCHAR(50) NOT NULL,  -- ZONE, CIRCLE, DIVISION, SUB_DIVISION
    name VARCHAR(255) NOT NULL,
    -- Denormalized parent IDs
    dept_zone_id UUID,
    dept_circle_id UUID,
    dept_division_id UUID,
    dept_sub_division_id UUID,
    dept_village_id UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

Example rows (conceptually):

| dept_id |     type      |        name         | dept_zone_id | dept_circle_id| dept_division_id | dept_sub_division_id| dept_village_id
|---------|---------------|---------------------|--------------|---------------|------------------|---------------------|----------------
| z1      | ZONE          | North Zone          | z1           | NULL          | NULL             | NULL                | NULL
| c1      | CIRCLE        | Guwahati Circle     | z1           | c1            | NULL             | NULL                | NULL
| c2      | CIRCLE        | Jorhat Circle       | z1           | c2            | NULL             | NULL                | NULL
| div1    | DIVISION      | Guwahati Div        | z1           | c1            | div1             | NULL                | NULL
| div2    | DIVISION      | Nalbari Div         | z1           | c1            | div2             | NULL                | NULL
| sd1     | SUB_DIVISION  | SubDiv A            | z1           | c1            | div1             | sd1                 | NULL
| sd2     | SUB_DIVISION  | SubDiv B            | z1           | c1            | div1             | sd2                 | NULL
| v1      | VILLAGE       | Village A           | z1           | c1            | div1             | sd2                 | v1



```

**`dim_scheme`**

```sql
CREATE TABLE dim_scheme (
    scheme_id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    name VARCHAR(255) NOT NULL,
    geo_id UUID REFERENCES dim_geo(geo_id),
    dept_id UUID REFERENCES dim_dept_hierarchy(dept_id),
    status VARCHAR(50) NOT NULL,  -- Active, Inactive , currently we are not save the status, open to discussion with client
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
Example rows (conceptually):

| scheme_id | tenant_id |           name               | geo_id |    dept_id   |    status        |         updated_at         |
|-----------|-----------|------------------------------|--------|--------------|------------------|----------------------------|
| s1        | t1        | Jal Jeevan Scheme - Block A  | v1     | b1           | Active           | 2024-06-10 10:00:00+00     |
| s2        | t1        | Water Supply Scheme - Block B| v2     | b2           | Inactive         | 2024-06-11 14:15:00+00     |
| s3        | t2        | Rural Water Project          | v3     | b3           | Active           | 2024-06-12 09:30:00+00     |



CREATE INDEX idx_dim_scheme_tenant_geo ON dim_scheme(tenant_id, geo_id);
```
<!-- dim_date may not be needed in this setup -->
**`dim_date`** — Time dimension for date-based queries.

```sql
CREATE TABLE dim_date (
    date DATE PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    fiscal_year INTEGER,
    fiscal_quarter INTEGER,
    week_of_year INTEGER,
    day_of_week INTEGER
);


```

#### Fact Tables

**`fact_daily_submission`** — Daily submission percentages and counts/open for discussion.

```sql
CREATE TABLE fact_daily_submission (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    geo_id UUID REFERENCES dim_geo(geo_id),
    scheme_id UUID REFERENCES dim_scheme(scheme_id),
    date DATE NOT NULL REFERENCES dim_date(date),
    total_operators INTEGER NOT NULL, -- ideally it should be 1, but kept it open to allow many-many ,mapping
    submitted_count INTEGER NOT NULL, -- ideally it should be 1, but we may allow multiple submissions a day
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_daily_submission UNIQUE (tenant_id, COALESCE(geo_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(scheme_id, '00000000-0000-0000-0000-000000000000'::UUID), date)
);
Example rows (`fact_daily_submission`):

| id | tenant_id  | geo_id                                | scheme_id   | date       | total_operators | submitted_count |        created_at         |
|----|------------|---------------------------------------|-------------|------------|-----------------|-----------------|---------------------------|
| 1  | TENANT0001 | 22222222-2222-2222-2222-222222222222  | SCHEME0001  | 2024-06-10 |        1        |         1       | 2024-06-10 23:59:59+00    |
| 2  | TENANT0001 | 22222222-2222-2222-2222-222222222222  | SCHEME0007  | 2024-06-11 |       10        |         8       | 2024-06-11 23:59:59+00    |
| 3  | TENANT0002 | 6666                                  | SCHEME0002  | 2024-06-10 |        1        |         0       | 2024-06-10 23:59:59+00    |
| 4  | TENANT0001 | 7777                                  | null        | 2024-06-12 |      200        |       170       | 2024-06-12 23:59:59+00    |

- `geo_id` and `scheme_id` may be `NULL` for aggregated (tenant-level) facts.
- Typical queries will filter by `tenant_id`, `date`, and dimension keys.



CREATE INDEX idx_fact_daily_submission_tenant_geo_date ON fact_daily_submission(tenant_id, geo_id, date) WHERE geo_id IS NOT NULL;
CREATE INDEX idx_fact_daily_submission_tenant_scheme_date ON fact_daily_submission(tenant_id, scheme_id, date) WHERE scheme_id IS NOT NULL;
```

**`fact_water_quantity`** — Water supplied metrics.

```sql
CREATE TABLE fact_water_quantity (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    scheme_id UUID REFERENCES dim_scheme(scheme_id),
    geo_id UUID REFERENCES dim_geo(geo_id),
    date DATE NOT NULL REFERENCES dim_date(date),
    qty_ltr DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_water_quantity UNIQUE (tenant_id, COALESCE(scheme_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(geo_id, '00000000-0000-0000-0000-000000000000'::UUID), date)
);

CREATE INDEX idx_fact_water_quantity_tenant_scheme_date ON fact_water_quantity(tenant_id, scheme_id, date) WHERE scheme_id IS NOT NULL;
CREATE INDEX idx_fact_water_quantity_tenant_geo_date ON fact_water_quantity(tenant_id, geo_id, date) WHERE geo_id IS NOT NULL;

**Example Table**

| id | tenant_id  | scheme_id | geo_id    | date       |       qty_ltr        |        created_at          |
|----|------------|-----------|-----------|------------|----------------------|-------------|--------------|
| 1  | TENANT0001 | SCHEME001 | GEO000002 | 2024-06-10 |       10500.00       | 2024-06-10 23:59:59+00     |
| 2  | TENANT0001 | SCHEME002 | GEO000002 | 2024-06-11 |       9800.00        | 2024-06-11 23:59:59+00     |
| 3  | TENANT0002 | NULL      | GEO000004 | 2024-06-10 |       12000.00       | 2024-06-10 23:59:59+00     |
| 4  | TENANT0001 | NULL      | NULL      | 2024-06-12 |       45000.00       | 2024-06-12 23:59:59+00     |


- Query typically filters on `tenant_id`, `date`, and dimensions.



```

**`fact_anomaly`** — Aggregated anomaly metrics by type and status. **This is a derived/aggregated table, not source-of-truth.** Values are aggregated from `stg_anomalies` (which stores source-of-truth `expected_qty_ltr` and `actual_qty_ltr` from upstream anomaly detection).

```sql
CREATE TABLE fact_anomaly (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    scheme_id UUID REFERENCES dim_scheme(scheme_id),
    geo_id UUID REFERENCES dim_geo(geo_id),
    date DATE NOT NULL REFERENCES dim_date(date),
    anomaly_type VARCHAR(100) NOT NULL, -- LOW_QUANTITY, NO_SUBMISSION, REPEATED_IMAGE
    open_count INTEGER NOT NULL DEFAULT 0,
    resolved_count INTEGER NOT NULL DEFAULT 0,
    -- Aggregated quantities (summed from stg_anomalies for anomalies with quantity data)
    total_expected_qty_ltr DECIMAL(12,2) DEFAULT 0,
    total_actual_qty_ltr DECIMAL(12,2) DEFAULT 0,
    loaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_anomaly UNIQUE (tenant_id, COALESCE(scheme_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(geo_id, '00000000-0000-0000-0000-000000000000'::UUID), date, anomaly_type)
);

**Example Table**

| id | tenant_id  | scheme_id | geo_id    | date       | anomaly_type | open_count | resolved_count | total_expected_qty_ltr | total_actual_qty_ltr | loaded_at             |
|----|------------|-----------|-----------|------------|--------------|------------|----------------|------------------------|---------------------|------------------------|
| 1  | TENANT0001 | SCHEME001 | GEO000002 | 2024-06-10 | LOW_QUANTITY | 1          | 0              | 2000.00                | 200.00              | 2024-06-10 23:59:59+00 |
| 2  | TENANT0001 | SCHEME002 | GEO000002 | 2024-06-11 | NO_SUBMISSION | 1         | 0              | 0.00                   | 0.00                | 2024-06-11 23:59:59+00 |

- Typical queries filter by `tenant_id`, `date`, `anomaly_type`, and status counts.


```

**`fact_status_snapshot`** — Status color per geo/tenant/date (derived from rules)/ can be improved.

```sql
CREATE TABLE fact_status_snapshot (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES dim_tenant(tenant_id),
    scheme_id UUID REFERENCES dim_scheme(scheme_id),
    geo_id UUID NOT NULL REFERENCES dim_geo(geo_id),
    date DATE NOT NULL REFERENCES dim_date(date),
    status VARCHAR(50) NOT NULL,  -- GREEN, LIGHT_GREEN, ORANGE, RED, DARK_RED
    score DECIMAL(5,2),  -- Optional numeric score
    rule_applied VARCHAR(255),  -- Which rule/threshold triggered this status
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_status_snapshot UNIQUE (tenant_id, geo_id, date)
);

CREATE INDEX idx_fact_status_snapshot_tenant_geo_date ON fact_status_snapshot(tenant_id, geo_id, date);
CREATE INDEX idx_fact_status_snapshot_status ON fact_status_snapshot(status);

**Example Table**

| id | tenant_id  | scheme_id  | geo_id   | date       | status    | score | rule_applied                | created_at             |
|----|------------|------------|----------|------------|-----------|-------|-----------------------------|------------------------|
| 1  | TENANT0001 | SCHEME001  | GEO0001  | 2024-06-10 | GREEN     | 98.56 | "All metrics within normal" | 2024-06-10 23:59:59+00 |
| 2  | TENANT0001 | SCHEME002  | GEO0002  | 2024-06-10 | ORANGE    | 68.20 | "Low daily submission"      | 2024-06-10 23:59:59+00 |
| 3  | TENANT0002 | SCHEME003  | GEO0005  | 2024-06-11 | RED       | 40.00 | "Severe no-water event"     | 2024-06-11 23:59:59+00 |

- We may create the data in this table daily/weekly/monthly as may be required by the client
```
------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------
**PostgreSQL optimizations:**

- Use `UPSERT` (`ON CONFLICT`) for idempotent fact table loads.
- Consider table partitioning by `date` for large fact tables (e.g., monthly partitions).
- Indexes on foreign keys and common filter columns (tenant_id, geo_id, date).
- `JSONB` for flexible metadata (anomaly details, config payloads).

---

## 6. ETL Processing Logic

### 6.1 Kafka Consumer → Staging (Streaming)

**Process:**

1. Consume batch of events from Kafka topic (Spring Kafka `@KafkaListener`).
2. For each event:
   - Validate required fields (`event_id`, `tenant_id`, `timestamp`).
   - Check `stg_event_log` for duplicate `event_id` (idempotency).
   - If duplicate: Skip, log warning.
   - If new: Write to `stg_event_log` (raw payload as JSONB).
3. Parse event payload and write to appropriate cleaned staging table (`stg_bfm_readings`, `stg_water_quantities`, `stg_anomalies`, etc.) using `ON CONFLICT` for idempotency.
   - **For `anomaly.detected` events:** Extract `expected_qty_ltr` and `actual_qty_ltr` directly from event payload and store in `stg_anomalies` (do NOT compute these values; they are source-of-truth from upstream anomaly detection).
4. Mark `stg_event_log.processed_at = NOW()`.
5. Commit Kafka offsets (after successful staging writes).

**Error handling:** Failed events go to dead-letter table; commit offset to avoid blocking.

### 6.2 Staging → Analytics DB (Batch)

**Scheduled jobs** (ShedLock/Quartz) run at configured intervals (e.g., every 24 hours).

#### Job: Load Dimensions

**Frequency:** Daily (nightly) or on-demand when transactional DB changes.

**Process:**

1. Read dimension data from transactional DB (or staging snapshot).
2. Upsert into `dim_tenant`, `dim_geo`, `dim_dept_hierarchy`, `dim_scheme` using `ON CONFLICT ... DO UPDATE`.
3. Update `updated_at` timestamps.

**Geo hierarchy flattening:** When loading `dim_geo`, compute and populate denormalized parent ID columns (e.g., `geo_state_id`, `geo_district_id`) by traversing parent relationships once and storing flattened paths.

#### Job: Aggregate Daily Submissions

**Frequency:** Every 15 minutes (or hourly).

**Process:**

1. Read `stg_bfm_readings` where `created_at > last_run_time` (or use watermark table).
2. Group by `tenant_id`, `scheme_id`, `date(reading_time)`.
3. Count total operators (from `operator_assignments` in transactional DB or staging snapshot).
4. Count submissions per scheme/date.
5. Calculate `submission_pct = (submitted_count / total_operators) * 100`.
6. Upsert into `fact_daily_submission` using `ON CONFLICT ... DO UPDATE`.

**Geo-level aggregation:** Aggregate scheme-level facts to geo levels (district, block, GP, village) by joining `dim_scheme` → `dim_geo` and summing counts.

#### Job: Aggregate Water Quantities

**Frequency:** Every 15 minutes (or hourly).

**Process:**

1. Read `stg_water_quantities` where `created_at > last_run_time`.
2. Upsert into `fact_water_quantity` at scheme grain.
3. Aggregate to geo levels by joining `dim_scheme` → `dim_geo` and summing quantities.

#### Job: Aggregate Anomalies

**Frequency:** Every 15 minutes (or hourly).

**Process:**

1. Read `stg_anomalies` where `created_at > last_run_time` (or use watermark table).
2. **Source-of-truth:** Use `expected_qty_ltr` and `actual_qty_ltr` directly from `stg_anomalies` (do NOT compute these values in ETL; they come from upstream anomaly detection).
3. Group by `tenant_id`, `scheme_id` (or aggregate to `geo_id`), `anomaly_date`, `anomaly_type`.
4. Count anomalies by status (`OPEN` vs `RESOLVED`).
5. Sum `expected_qty_ltr` and `actual_qty_ltr` for anomalies that have quantity data (NULL values excluded from sum).
6. Upsert into `fact_anomaly` using `ON CONFLICT ... DO UPDATE`.
7. Aggregate to geo levels by joining `dim_scheme` → `dim_geo` and summing counts/quantities.

**Note:** `stg_anomalies` stores the full anomaly payload (including `details` JSONB) for auditability and replay. The ETL job aggregates counts and sums quantities; it does not recompute anomaly detection logic.

#### Job: Compute Status Colors

**Frequency:** Every 15 minutes (or hourly), after submission and water quantity jobs.

**Process:**

1. Read `fact_daily_submission`, `fact_water_quantity`, `fact_anomaly` for target date range.
2. Apply status color rules (from State Config Service or hardcoded):
   - **GREEN**: submission_pct >= 90 AND no_water_days = 0 AND open_anomalies = 0
   - **LIGHT_GREEN**: submission_pct >= 75 AND no_water_days <= 1
   - **ORANGE**: submission_pct >= 50 AND no_water_days <= 3
   - **RED**: submission_pct < 50 OR no_water_days > 3
   - **DARK_RED**: submission_pct < 25 OR no_water_days > 7
3. Upsert into `fact_status_snapshot`.

### 6.3 Late-Arriving Data Handling

**Problem:** Events may arrive out of order or delayed (e.g., network issues, reprocessing).

**Strategy:**

- **Staging:** Accept late events up to a **reprocessing window** (e.g., 7 days). Events older than window are rejected or logged for manual review.
- **Analytics aggregation:** Use **watermark-based processing**. Track `max(reading_time)` per tenant/scheme processed. When aggregating, include events where `reading_time` is within the watermark window, even if `created_at` is recent.
- **Reprocessing:** Batch jobs can reprocess a date range (e.g., last 7 days) to incorporate late-arriving data. Use `ON CONFLICT` upserts to handle re-aggregation idempotently.

**Watermark table:**

```sql
CREATE TABLE etl_watermarks (
    tenant_id UUID NOT NULL,
    scheme_id UUID NOT NULL,
    fact_type VARCHAR(100) NOT NULL,  -- DAILY_SUBMISSION, WATER_QUANTITY
    watermark_date DATE NOT NULL,  -- Latest date fully processed
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tenant_id, scheme_id, fact_type)
);
```

### 6.4 Backfills and Replays

**Backfill process:**

1. Identify date range to backfill (e.g., last 30 days).
2. Reprocess `stg_event_log` for that range (or replay from Kafka if events are retained).
3. Re-run aggregation jobs for the date range.
4. Upsert into Analytics DB (idempotent via `ON CONFLICT`).

**Kafka replay:**

- Use consumer group with new group ID to replay from earliest offset.
- Write to staging with idempotency checks (`event_id` uniqueness).
- Re-run batch aggregation jobs.

---

## 7. Implementation Steps

### Step 1: Define and Publish Events

- Enhance source services to publish events with required schema (`event_id` UUID, `tenant_id`, `timestamp`, etc.).
- Standardize identity fields to `user_id` (map legacy `person_id` in event producers).
- Document event schemas (JSON or Avro) in shared library or schema registry.

### Step 2: Create Staging DB Schema

- Create PostgreSQL Staging DB (separate database or schema).
- Create staging tables (`stg_event_log`, `stg_bfm_readings`, `stg_water_quantities`, `stg_operator_events`, `stg_anomalies`, `etl_consumer_offsets`, `etl_batch_job_runs`).
- Create indexes and constraints.

### Step 3: Implement ETL Service - Kafka Consumers

- Create **ETL / Analytics Ingestion Service** (Java 17+, Spring Boot, Spring Kafka).
- Implement Kafka consumers per topic (`@KafkaListener`).
- Implement staging writers (raw event log + cleaned tables) with idempotency (`ON CONFLICT`).
- Configure manual offset commits (after successful staging write).
- Deploy service (K8s deployment).

### Step 4: Create Analytics DB Schema

- Create PostgreSQL Analytics DB (separate database).
- Create dimension tables (`dim_tenant`, `dim_geo`, `dim_dept_hierarchy`, `dim_scheme`, `dim_date`).
- Create fact tables (`fact_daily_submission`, `fact_water_quantity`, `fact_operator_summary`, `fact_anomaly`, `fact_status_snapshot`).
- Create indexes and foreign keys.
- Populate `dim_date` (pre-populate date range, e.g., 2020-2030).

### Step 5: Implement Batch Jobs

- Implement scheduled jobs (ShedLock/Quartz) in ETL service:
  - Dimension loader (daily).
  - Daily submission aggregator (15-min or hourly).
  - Water quantity aggregator (15-min or hourly).
  - Status color calculator (15-min or hourly, after other facts).
- Implement watermark tracking for late-arriving data.
- Implement reprocessing logic (date range backfills).

### Step 6: Wire Dashboard API

- Point **Dashboard API Service** to Analytics DB for:
  - `/api/tenants/{tenantId}/dashboard/geo-summary`
  - `/api/country/dashboard/summary`
- Keep transactional DB for real-time, single-entity queries.

---

## 8. Summary

| Component | Specification |
|-----------|---------------|
| **Pipeline** | Kafka (streaming) → ETL Service → Staging DB (PostgreSQL) → Batch Jobs → Analytics DB (PostgreSQL star schema) |
| **Services** | Single **ETL / Analytics Ingestion Service** (Kafka consumers + batch jobs). Optional split: consumer service + loader service. |
| **Staging DB** | PostgreSQL. Raw event log (`stg_event_log`), cleaned staging tables, ETL control metadata. |
| **Analytics DB** | PostgreSQL. Star schema: flattened dimensions (`dim_tenant`, `dim_geo`, `dim_dept_hierarchy`, `dim_scheme`, `dim_date`) and fact tables (daily submission %, water quantity, operator counts, anomalies, status color). |
| **Event Requirements** | All events must include `event_id` (UUID), `tenant_id`, `timestamp`, `source_service`, `event_type`. Use `user_id` consistently (not `operator_id` or `person_id`). |
| **Idempotency** | Unique constraints on `event_id` and `(topic, partition, offset)` in staging. `ON CONFLICT` upserts in Analytics DB. |
| **Offset Commits** | Commit only after successful staging write (at-least-once delivery). |
| **Late Data** | Reprocessing window (7 days). Watermark-based aggregation. Reprocess date ranges for backfills. |
| **Batch Frequency** | Dimensions: daily. Facts: 15-minute or hourly intervals. |

This design aligns with JalSoochak Technical Specifications: Kafka event backbone, PostgreSQL databases, multi-tenant geo/department drill-down, and non-PII analytics data for public dashboards.
