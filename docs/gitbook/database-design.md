# JalSoochak  — Transactional Database Design
*(Migration-friendly, V1-compatible, multi-tenant)*

This document defines the **transactional database schema** for JalSoochak .  
It is intentionally aligned with the **existing table naming and structure** (e.g., `*_master`, `*_mapping`) to ensure ease of migration.

> **Important:**  
> This document is **documentation-first**. The raw SQL DDL should live in the repository under migrations (Flyway/Liquibase).  
> The SQL block from the earlier draft has been removed and replaced with clear table documentation.

---

## 1. Design Goals

### 1.1 Migration-first (compatible)
We retain entities such as:
- `scheme_master`
- `person_master`
- `bfm_reading`
- `person_scheme_mapping`
- `village_master`, `lgd_location_master`, `administrative_location_master`

This reduces migration complexity and avoids renaming-based churn.

### 1.2 Multi-tenancy (State = Tenant)
JalSoochak  is **multi-tenant**, with each state being a tenant.

All tenant-scoped tables include:
- `tenant_id`

A country-level dashboard aggregates across tenants using `tenant_id`.

### 1.3 Consistent tenant isolation
Tenant isolation is enforced by:
- Including `tenant_id` in all relevant tables
- Using composite uniqueness on `(id, tenant_id)` for FK safety
- Indexing on `(tenant_id, …)` for all high-volume queries

### 1.4 Soft delete for master data
V1 uses `deleted_at` widely. We retain this pattern for master tables and mappings to simplify migration.

---

## 2. Tenancy

### 2.1 `tenants`
**Purpose**  
Represents a tenant (state).

**Key columns**
- `id` (PK)
- `code` (unique, e.g., `AP`, `AS`, `MH`)
- `name`
- `country`
- `created_at`, `updated_at`

**Notes**
- `code` should be used for dashboard URLs and tenant routing.
- This table is owned by the Tenant Admin Service.

---

## 3. Core Master Data

### 3.1 `scheme_master`
**Purpose**  
Stores master data for water supply schemes.

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `scheme_name`
- `state_scheme_id` (nullable, external identifier)
- `centre_scheme_id` (nullable, external identifier)
- `fhtc_count`
- `planned_fhtc`
- `house_hold_count`
- `latitude`, `longitude`
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Relationships**
- Referenced by:
  - `bfm_reading.scheme_id`
  - `village_scheme_mapping.scheme_id`
  - `person_scheme_mapping.scheme_id`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`
- `UNIQUE (tenant_id, state_scheme_id)` *(if stable and available)*
- `UNIQUE (tenant_id, centre_scheme_id)` *(if stable and available)*

**Recommended indexes**
- `INDEX (tenant_id, deleted_at)`
- `INDEX (tenant_id, scheme_name)`
- `INDEX (tenant_id, state_scheme_id)`
- `INDEX (tenant_id, centre_scheme_id)`

---

### 3.2 `person_master`
**Purpose**  
Stores people involved in the system, including:
- Pump Operators
- Section Officers
- Assistant Executive Engineers (AEE)
- Executive Engineers (EE)
- Other supervisory/administrative roles

Role is determined by `person_type_id`.

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `first_name`, `last_name`, `full_name`
- `phone_number`
- `person_type_id` (FK → person_type_master.id)
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Relationships**
- Referenced by:
  - `bfm_reading.person_id`
  - `person_scheme_mapping.person_id`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`
- `UNIQUE (tenant_id, phone_number)` *(strongly recommended for WhatsApp mapping)*

**Recommended indexes**
- `INDEX (tenant_id, person_type_id)`
- `INDEX (tenant_id, deleted_at)`
- `INDEX (tenant_id, full_name)`

**Notes**
- We intentionally do not use `users` vs `persons` dual models in .  
  `person_master` is the canonical table for all human actors.

---

## 4. Transactional Tables

### 4.1 `bfm_reading`
**Purpose**  
Stores BFM (Bulk Flow Meter) reading submissions.

This supports:
- WhatsApp submissions (via Glific)
- Manual entry (if enabled)
- Image evidence for readings
- OCR / extracted reading workflows (optional)

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `reading_date_time`
- `confirmed_reading` *(final accepted value)*
- `extracted_reading` *(OCR/system extracted value)*
- `reading_url` *(image location or object key reference)*
- `person_id` *(FK → person_master.id)*
- `scheme_id` *(FK → scheme_master.id)*
- `reading_date` *(date bucket for dashboards)*
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Tenant-safe foreign key strategy**
To prevent cross-tenant references, use composite FK constraints:
- `(scheme_id, tenant_id) → scheme_master(id, tenant_id)`
- `(person_id, tenant_id) → person_master(id, tenant_id)`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`

**Recommended indexes**
- `INDEX (tenant_id, scheme_id, reading_date)`
- `INDEX (tenant_id, person_id, reading_date)`
- `INDEX (tenant_id, reading_date_time)`
- `INDEX (tenant_id, deleted_at)`

**Notes**
- For DPG security/privacy, avoid storing long-lived public URLs.  
  Prefer storing an object-store key (S3-compatible) and generating signed URLs when required.
- `confirmed_reading` and `extracted_reading` should have clearly documented semantics:
  - `extracted_reading` may be null if OCR is not enabled
  - `confirmed_reading` is the value used for official computations

---

## 5. Location & Hierarchy (Retained for Migration)

Even though the  product does not require all hierarchy tables immediately, they are retained to:
- reduce migration effort
- support future geo drilldowns and LGD alignment

### 5.1 `village_master`
**Purpose**  
Stores village-level master data.

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `title`
- `lgd_code`
- `parent_administrative_location_id`
- `parent_lgd_location_id`
- `household_count`
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`
- `UNIQUE (tenant_id, lgd_code)` *(if LGD codes are used as stable IDs)*

**Recommended indexes**
- `INDEX (tenant_id, parent_administrative_location_id)`
- `INDEX (tenant_id, parent_lgd_location_id)`
- `INDEX (tenant_id, deleted_at)`

---

### 5.2 `lgd_location_master`
**Purpose**  
Represents the LGD hierarchy of locations.

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `title`
- `lgd_code`
- `lgd_location_type_id` (FK → lgd_location_type_master.id)
- `parent_id`
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`
- `UNIQUE (tenant_id, lgd_code)` *(if stable)*

**Recommended indexes**
- `INDEX (tenant_id, parent_id)`
- `INDEX (tenant_id, lgd_location_type_id)`

---

### 5.3 `administrative_location_master`
**Purpose**  
Represents administrative/departmental hierarchy (Zone → Circle → Division → Sub-division).

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `title`
- `administrative_location_type_id` (FK → administrative_location_type_master.id)
- `parent_id`
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`

**Recommended indexes**
- `INDEX (tenant_id, parent_id)`
- `INDEX (tenant_id, administrative_location_type_id)`

---

## 6. Type Masters (Global)

These tables define type hierarchies.  
They are **not tenant-scoped** and are treated as global reference data.

### 6.1 `person_type_master`
**Purpose**  
Defines the type of a person, such as:
- Pump Operator
- Section Officer
- Assistant Executive Engineer (AEE)
- Executive Engineer (EE)
- District / Block / GP / Village-level staff (if modeled)

**Key columns**
- `id` (PK)
- `title`
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

---

### 6.2 `lgd_location_type_master`
**Purpose**  
Defines LGD location type hierarchy.

**Key columns**
- `id` (PK)
- `title`
- `parent_id`
- Audit columns

---

### 6.3 `administrative_location_type_master`
**Purpose**  
Defines administrative location type hierarchy.

**Key columns**
- `id` (PK)
- `title`
- `parent_id`
- Audit columns

---

## 7. Mapping Tables

### 7.1 `village_scheme_mapping`
**Purpose**  
Many-to-many mapping between villages and schemes.

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `village_id` (FK → village_master.id)
- `scheme_id` (FK → scheme_master.id)
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Tenant-safe FK strategy**
- `(village_id, tenant_id) → village_master(id, tenant_id)`
- `(scheme_id, tenant_id) → scheme_master(id, tenant_id)`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`
- `UNIQUE (tenant_id, village_id, scheme_id)` *(prevents duplicates)*

**Recommended indexes**
- `INDEX (tenant_id, scheme_id)`
- `INDEX (tenant_id, village_id)`

---

### 7.2 `person_scheme_mapping`
**Purpose**  
Maps people to schemes.

This is used for:
- Pump Operator → Scheme assignment
- Section Officer → Scheme assignment
- Engineer assignments

**Key columns**
- `id` (PK)
- `tenant_id` (FK → tenants.id)
- `person_id` (FK → person_master.id)
- `scheme_id` (FK → scheme_master.id)
- Audit: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`

**Tenant-safe FK strategy**
- `(person_id, tenant_id) → person_master(id, tenant_id)`
- `(scheme_id, tenant_id) → scheme_master(id, tenant_id)`

**Recommended constraints**
- `UNIQUE (id, tenant_id)`
- `UNIQUE (tenant_id, person_id, scheme_id)` *(prevents duplicates)*

**Recommended indexes**
- `INDEX (tenant_id, scheme_id)`
- `INDEX (tenant_id, person_id)`

**Important note**
If the product requires:
- “1 Pump Operator per scheme; sometimes 2”
- “primary vs secondary operator”
then this table should be extended with:
- `is_primary BOOLEAN`
- optionally `assignment_role VARCHAR/ENUM` (if role is not derived from person_type)

This can be added without breaking migration.

---

## 8. Messaging, Templates, Nudges ( Additions)

These tables support:
- multi-language messaging
- nudges
- WhatsApp orchestration via Glific
- full auditability of message delivery

### 8.1 `message_templates`
- `template_id` (PK)
- `tenant_id`
- `code`
- `channel`
- `default_language`
- `created_at`, `updated_at`

### 8.2 `message_template_texts`
- `id` (PK)
- `template_id`
- `language_code`
- `content`

### 8.3 `nudges`
- `nudge_id` (PK)
- `tenant_id`
- `template_id`
- `target_role`
- `trigger_type`
- `schedule_cron`
- `event_condition_json`
- `active`

### 8.4 `messages`
- `message_id` (PK)
- `tenant_id`
- `person_id` *(recommended; use person_master as canonical)*  
- `direction`
- `channel`
- `content`
- `language_code`
- `provider_message_id`
- `timestamp`
- `processed`

---

## 9. Anomalies

### 9.1 `anomalies`
Stores anomaly records detected by rule-based detection.

- `anomaly_id` (PK)
- `tenant_id`
- `scheme_id`
- `type` (LOW_QUANTITY, NO_SUBMISSION, REPEATED_IMAGE, OTHER)
- `date`
- `details` (JSON)
- `status` (OPEN, RESOLVED)
- `created_at`, `updated_at`

**Recommended indexes**
- `INDEX (tenant_id, scheme_id, date)`
- `INDEX (tenant_id, type, date)`
- `INDEX (tenant_id, status)`

---

## 10. Sync Tracking (State IT Integrations)

### 10.1 `imports`
Tracks import and sync runs.

- `import_id` (PK)
- `tenant_id`
- `source_system`
- `type` (USERS, SCHEMES, PUMPS, LOCATIONS)
- `status` (IN_PROGRESS, COMPLETED, FAILED, PARTIAL)
- `started_at`, `finished_at`
- `error_summary`

### 10.2 `import_errors`
Tracks row-level import errors.

- `error_id` (PK)
- `import_id` (FK → imports)
- `row_identifier`
- `error_code`
- `error_message`
- `payload` (JSON)

---
