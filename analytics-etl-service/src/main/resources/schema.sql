-- ============================================================================
-- JalSoochak Analytics Warehouse Schema
-- ============================================================================
-- This script creates all tables for the unified warehouse schema.
-- Run this script against the warehouse_db PostgreSQL database.
-- 
-- Prerequisites:
--   1. PostgreSQL database created: CREATE DATABASE warehouse_db;
--   2. PostGIS extension enabled: CREATE EXTENSION IF NOT EXISTS postgis;
-- ============================================================================

-- Create warehouse schema if not exists
CREATE SCHEMA IF NOT EXISTS warehouse;

-- Enable PostGIS extension for geometry support
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- DIMENSION TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- dim_tenant: Tenant master for multi-tenancy
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.dim_tenant (
    tenant_id SERIAL PRIMARY KEY,
    tenant_code VARCHAR(20) NOT NULL UNIQUE,
    tenant_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL DEFAULT 'IN',
    config JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- dim_lgd_location: Flattened LGD geographic hierarchy with PostGIS geometry
-- Hierarchy: STATE → DISTRICT → BLOCK → GRAM_PANCHAYAT → VILLAGE
-- This is the authoritative geography dimension for geo drilldown and map visualization
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.dim_lgd_location (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_lgd_id INT NOT NULL,
    parent_id INT DEFAULT 0, -- the states will have no parent_id(i.e. 0)
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
    admin_location_id INT,  -- References dim_admin_location for village admin mapping
    -- PostGIS geometry column for map visualization
    geom geometry(MULTIPOLYGON, 4326),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_lgd_tenant_source UNIQUE (tenant_id, source_lgd_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_lgd_tenant_location_type ON warehouse.dim_lgd_location(tenant_id, location_type);
CREATE INDEX IF NOT EXISTS idx_dim_lgd_tenant_district ON warehouse.dim_lgd_location(tenant_id, lgd_district_id);
CREATE INDEX IF NOT EXISTS idx_dim_lgd_tenant_block ON warehouse.dim_lgd_location(tenant_id, lgd_block_id);
CREATE INDEX IF NOT EXISTS idx_dim_lgd_parent ON warehouse.dim_lgd_location(parent_id);
CREATE INDEX IF NOT EXISTS idx_dim_lgd_geom ON warehouse.dim_lgd_location USING GIST (geom);

-- ----------------------------------------------------------------------------
-- dim_admin_location: Flattened administrative jurisdiction hierarchy
-- Hierarchy: ZONE → CIRCLE → DIVISION → SUB_DIVISION
-- Intentionally stops at SUB_DIVISION level. Villages are NOT modeled as child nodes.
-- Village jurisdiction is represented via dim_village.admin_location_id mapping.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.dim_admin_location (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_admin_id INT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_dim_admin_tenant_type ON warehouse.dim_admin_location(tenant_id, location_type);
CREATE INDEX IF NOT EXISTS idx_dim_admin_tenant_division ON warehouse.dim_admin_location(tenant_id, admin_division_id);

-- ----------------------------------------------------------------------------
-- dim_village: Service/operational village dimension
-- This is NOT a geographic hierarchy table. It acts as a bridge dimension linking:
--   - LGD geographic hierarchy (via lgd_location_id)
--   - Administrative jurisdiction (via admin_location_id)
--   - Service analytics (scheme mappings, habitation aggregation)
-- Village geometry is stored in dim_lgd_location.geom where location_type='VILLAGE'
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.dim_village (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_village_id INT NOT NULL,
    title VARCHAR(255),
    lgd_code VARCHAR(50),
    household_count INT,
    -- Location references (geometry accessed via lgd_location_id join)
    lgd_location_id INT,              -- References dim_lgd_location.id where location_type='VILLAGE'
    admin_location_id INT,            -- References dim_admin_location.id for jurisdiction mapping
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_village_tenant_source UNIQUE (tenant_id, source_village_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_village_tenant ON warehouse.dim_village(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_village_tenant_lgd ON warehouse.dim_village(tenant_id, lgd_location_id);
CREATE INDEX IF NOT EXISTS idx_dim_village_tenant_admin ON warehouse.dim_village(tenant_id, admin_location_id);

-- ----------------------------------------------------------------------------
-- dim_scheme: Scheme dimension with denormalized hierarchies
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.dim_scheme (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_scheme_id INT NOT NULL,
    scheme_name VARCHAR(255),
    state_scheme_id INT,
    centre_scheme_id INT,
    fhtc_count INT,
    planned_fhtc INT,
    house_hold_count INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    -- Denormalized village
    village_id INT,
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

CREATE INDEX IF NOT EXISTS idx_dim_scheme_tenant ON warehouse.dim_scheme(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_scheme_tenant_district ON warehouse.dim_scheme(tenant_id, lgd_district_id);
CREATE INDEX IF NOT EXISTS idx_dim_scheme_tenant_division ON warehouse.dim_scheme(tenant_id, admin_division_id);
CREATE INDEX IF NOT EXISTS idx_dim_scheme_tenant_village ON warehouse.dim_scheme(tenant_id, village_id);

-- ----------------------------------------------------------------------------
-- dim_person: Person/operator dimension (PII excluded)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.dim_person (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    source_person_id INT NOT NULL,
    full_name VARCHAR(200),
    person_type VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_dim_person_tenant_source UNIQUE (tenant_id, source_person_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_person_tenant ON warehouse.dim_person(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dim_person_tenant_type ON warehouse.dim_person(tenant_id, person_type);

-- ============================================================================
-- EVENT TABLES (Immutable, Append-Only)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- event_log: Immutable audit trail of all Kafka events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.event_log (
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

CREATE INDEX IF NOT EXISTS idx_event_log_tenant ON warehouse.event_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_event_log_tenant_topic ON warehouse.event_log(tenant_id, topic, created_at);
CREATE INDEX IF NOT EXISTS idx_event_log_processed ON warehouse.event_log(processed_at) WHERE processed_at IS NULL;

-- ----------------------------------------------------------------------------
-- fact_bfm_reading_event: Event-grain BFM readings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_bfm_reading_event (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL,
    tenant_id INT NOT NULL,
    scheme_id INT NOT NULL,
    person_id INT NOT NULL,
    reading_date_time TIMESTAMP NOT NULL,
    reading_date DATE NOT NULL, -- the date of the reading, not the date of the event
    confirmed_reading INT,
    extracted_reading INT,
    reading_url TEXT,
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_bfm_event_tenant_event UNIQUE (tenant_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_fact_bfm_event_tenant_scheme_date ON warehouse.fact_bfm_reading_event(tenant_id, scheme_id, reading_date);
CREATE INDEX IF NOT EXISTS idx_fact_bfm_event_tenant_created ON warehouse.fact_bfm_reading_event(tenant_id, created_at);

-- ----------------------------------------------------------------------------
-- fact_water_quantity_event: Event-grain computed water quantities
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_water_quantity_event (
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

CREATE INDEX IF NOT EXISTS idx_fact_water_qty_event_tenant ON warehouse.fact_water_quantity_event(tenant_id, scheme_id, date);
CREATE INDEX IF NOT EXISTS idx_fact_water_qty_event_tenant_created ON warehouse.fact_water_quantity_event(tenant_id, created_at);

-- ----------------------------------------------------------------------------
-- fact_anomaly_event: Event-grain anomalies
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_anomaly_event (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL,
    tenant_id INT NOT NULL,
    scheme_id INT NOT NULL,
    anomaly_type VARCHAR(100) NOT NULL,
    anomaly_date DATE NOT NULL,
    expected_qty_ltr DECIMAL(12,2),
    actual_qty_ltr DECIMAL(12,2),
    details JSONB,
    anomaly_status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_anomaly_event_tenant_event UNIQUE (tenant_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_fact_anomaly_event_tenant_scheme ON warehouse.fact_anomaly_event(tenant_id, scheme_id, anomaly_date);
CREATE INDEX IF NOT EXISTS idx_fact_anomaly_event_tenant_status ON warehouse.fact_anomaly_event(tenant_id, anomaly_status) WHERE anomaly_status = 'OPEN';

-- ============================================================================
-- SNAPSHOT FACT TABLES (UPSERT, Dashboard-Optimized)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- fact_daily_submission: Daily submission percentages and counts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_daily_submission (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT NOT NULL,
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    total_operators INTEGER NOT NULL,
    submitted_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_daily_sub UNIQUE (tenant_id, scheme_id, date)
);

CREATE INDEX IF NOT EXISTS idx_fact_daily_sub_tenant_date ON warehouse.fact_daily_submission(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_fact_daily_sub_tenant_district_date ON warehouse.fact_daily_submission(tenant_id, lgd_district_id, date);
CREATE INDEX IF NOT EXISTS idx_fact_daily_sub_tenant_village_date ON warehouse.fact_daily_submission(tenant_id, village_id, date);
CREATE INDEX IF NOT EXISTS idx_fact_daily_sub_tenant_division_date ON warehouse.fact_daily_submission(tenant_id, admin_division_id, date);

-- ----------------------------------------------------------------------------
-- fact_water_quantity_daily: Daily water supply snapshot
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_water_quantity_daily (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT NOT NULL,
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    water_supplied BOOLEAN NOT NULL,
    qty_ltr DECIMAL(12,2) NOT NULL DEFAULT 0,
    data_source VARCHAR(50) NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_water_qty_daily UNIQUE (tenant_id, scheme_id, date)
);

CREATE INDEX IF NOT EXISTS idx_fwq_daily_tenant_date ON warehouse.fact_water_quantity_daily(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_fwq_daily_tenant_district_date ON warehouse.fact_water_quantity_daily(tenant_id, lgd_district_id, date);
CREATE INDEX IF NOT EXISTS idx_fwq_daily_tenant_scheme_date ON warehouse.fact_water_quantity_daily(tenant_id, scheme_id, date);
CREATE INDEX IF NOT EXISTS idx_fwq_daily_tenant_division_date ON warehouse.fact_water_quantity_daily(tenant_id, admin_division_id, date);

-- ----------------------------------------------------------------------------
-- fact_anomaly: Aggregated anomaly metrics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_anomaly (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT,
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    anomaly_type VARCHAR(100) NOT NULL,
    open_count INTEGER NOT NULL DEFAULT 0,
    resolved_count INTEGER NOT NULL DEFAULT 0,
    total_expected_qty_ltr DECIMAL(12,2) DEFAULT 0,
    total_actual_qty_ltr DECIMAL(12,2) DEFAULT 0,
    loaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_anomaly UNIQUE (tenant_id, COALESCE(scheme_id, 0), date, anomaly_type)
);

CREATE INDEX IF NOT EXISTS idx_fact_anomaly_tenant_date ON warehouse.fact_anomaly(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_fact_anomaly_tenant_type ON warehouse.fact_anomaly(tenant_id, anomaly_type, date);
CREATE INDEX IF NOT EXISTS idx_fact_anomaly_tenant_district ON warehouse.fact_anomaly(tenant_id, lgd_district_id, date);

-- ----------------------------------------------------------------------------
-- fact_status_snapshot: Status color per scheme/geo/date 
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouse.fact_status_snapshot (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES warehouse.dim_tenant(tenant_id),
    scheme_id INT,
    village_id INT,
    lgd_district_id INT,
    admin_division_id INT,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    score DECIMAL(5,2),
    rule_applied VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_fact_status UNIQUE (tenant_id, COALESCE(scheme_id, 0), COALESCE(village_id, 0), date)
);

CREATE INDEX IF NOT EXISTS idx_fact_status_tenant_date ON warehouse.fact_status_snapshot(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_fact_status_tenant_status ON warehouse.fact_status_snapshot(tenant_id, status, date);
CREATE INDEX IF NOT EXISTS idx_fact_status_tenant_district ON warehouse.fact_status_snapshot(tenant_id, lgd_district_id, date);

-- ============================================================================
-- ETL CONTROL TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- etl_batch_job_runs: Tracks batch job execution
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS warehouse.etl_batch_job_runs (
--     job_name VARCHAR(255) NOT NULL,
--     run_id UUID PRIMARY KEY,
--     tenant_id INT,
--     started_at TIMESTAMP WITH TIME ZONE NOT NULL,
--     completed_at TIMESTAMP WITH TIME ZONE,
--     status VARCHAR(50) NOT NULL,
--     records_processed INTEGER,
--     error_message TEXT,
--     metadata JSONB
-- );

-- CREATE INDEX IF NOT EXISTS idx_etl_job_tenant ON warehouse.etl_batch_job_runs(tenant_id, job_name, started_at);
-- CREATE INDEX IF NOT EXISTS idx_etl_job_status ON warehouse.etl_batch_job_runs(job_name, status, started_at);

-- ----------------------------------------------------------------------------
-- etl_watermarks: Tracks processing progress for late-arriving data
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS warehouse.etl_watermarks (
--     tenant_id INT NOT NULL,
--     scheme_id INT NOT NULL,
--     fact_type VARCHAR(100) NOT NULL,
--     watermark_date DATE NOT NULL,
--     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
--     PRIMARY KEY (tenant_id, scheme_id, fact_type)
-- );

-- ----------------------------------------------------------------------------
-- etl_dead_letter: Failed events for manual review
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS warehouse.etl_dead_letter (
--     id BIGSERIAL PRIMARY KEY,
--     event_id UUID,
--     tenant_id INT,
--     topic VARCHAR(255),
--     partition_id INTEGER,
--     "offset" BIGINT,
--     payload JSONB,
--     error_message TEXT,
--     error_type VARCHAR(100),
--     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
--     resolved_at TIMESTAMP WITH TIME ZONE,
--     resolved_by VARCHAR(100)
-- );

-- CREATE INDEX IF NOT EXISTS idx_etl_dead_letter_unresolved ON warehouse.etl_dead_letter(created_at) WHERE resolved_at IS NULL;
