**JalSoochak Technical Specifications**

Contents

[**JalSoochak Technical Specifications** 1](#_Toc215475563)

[**1. Introduction** 2](#_Toc215475564)

[**1.1 Purpose** 2](#_Toc215475565)

[**1.2 Scope** 2](#_Toc215475566)

[**2. DPG Orientation** 2](#_Toc215475567)

[**3. Users and Tenancy Model** 3](#_Toc215475568)

[**3.1 Tenancy Model** 3](#_Toc215475569)

[**3.2 Business User Roles (Domain hierarchy)** 3](#_Toc215475570)

[**3.3 System User Roles (Access & Configuration)** 3](#_Toc215475571)

[**3.4 User Provisioning Rules** 4](#_Toc215475572)

[**4. Functional Overview** 4](#_Toc215475573)

[**4.1 Core Modules** 4](#_Toc215475574)

[**5. Technical Architecture** 5](#_Toc215475575)

[**5.1 Architectural Style** 5](#_Toc215475576)

[**5.2 Key Backend Services** 5](#_Toc215475577)

[**5.3 Data Flow Examples** 6](#_Toc215475578)

[**6. Deployment Architecture** 7](#_Toc215475579)

[**6.1 Cloud-neutral Principles** 7](#_Toc215475580)

[**6.2 Environments** 7](#_Toc215475581)

[**6.3 Components** 7](#_Toc215475582)

[**6.4 Network Layout** 7](#_Toc215475583)

[**7. Technology Stack** 8](#_Toc215475584)

[**7.1 Backend** 8](#_Toc215475585)

[**7.2 Frontend** 8](#_Toc215475586)

[**7.3 Database & Messaging** 8](#_Toc215475587)

[**7.4 Documentation & Repo** 8](#_Toc215475588)

[**8. Architectural Decision Records (ADRs)** 8](#_Toc215475589)

[**ADR-001: Microservices in Mono-repo** 8](#_Toc215475590)

[**ADR-002: Cloud-neutral Kubernetes Deployment** 8](#_Toc215475591)

[**ADR-003: Single Shared Database Schema for Multi-tenancy (v2)** 8](#_Toc215475592)

[**ADR-004: Glific as WhatsApp Integration Layer** 9](#_Toc215475593)

[**ADR-005: Unified Field Operations Service** 9](#_Toc215475594)

[**9. API Specifications (Representative)** 9](#_Toc215475595)

[**9.1 Tenant Admin APIs** 9](#_Toc215475596)

[**9.2 State Config APIs** 10](#_Toc215475597)

[**9.3 Messaging Orchestrator APIs** 10](#_Toc215475598)

[**9.4 Field Operations APIs** 10](#_Toc215475599)

[**9.5 Integration APIs (State IT Systems)** 11](#_Toc215475600)

[**9.6 Dashboard APIs** 12](#_Toc215475601)

[**10. Transactional Database Design** 12](#_Toc215475602)

[**10.1 Tenancy & Users** 12](#_Toc215475603)

[**10.2 Location & Hierarchies** 13](#_Toc215475604)

[**10.3 Schemes, Pumps, Assignments** 13](#_Toc215475605)

[**10.4 Readings & Submissions** 14](#_Toc215475606)

[**10.5 Messaging & Nudge Config** 15](#_Toc215475607)

[**10.6 Anomalies & Status** 15](#_Toc215475608)

[**10.7 Sync Tracking** 16](#_Toc215475609)

[**11. Non-functional Requirements (NFRs)** 16](#_Toc215475610)

[**12. Future Work** 17](#_Toc215475611)

**1. Introduction**

**1.1 Purpose**

This document defines the **technical architecture**, **deployment model**, **technology stack**, **architectural decisions**, **API specifications**, and **transactional database design** of **JalSoochak**.

JalSoochak will be built as a **Digital Public Good (DPG)** and is intended to be reusable by multiple states and countries for monitoring rural water supply using **WhatsApp-driven field data** and **public dashboards**.

**Terminology:**
Throughout this document we use the term **Pump Operator** as the generic designation for field operators.
Some states (e.g., Assam) may use a local term like Jal Mitra; this is treated as a **state-specific label** mapped to the generic Pump Operator role.

### 1.2 Scope

The system covers:

* **WhatsApp-based interactions** with Pump Operators and field staff via **Glific**.
* **Tenant-specific public dashboards** (per state) and a **country-level consolidated dashboard**.
* **Configuration and orchestration services** for:
  + State-level water norms, thresholds, escalation rules.
  + Multi-language messaging.
  + Integrations with state IT systems and Glific.
* **Field operations tracking** (schemes, Pump Operators, BFM readings, pump status, anomalies).
* **Identity and Access Management (IAM)** via **Keycloak** for admin/config interfaces.
* **Multi-tenant, cloud-neutral deployment**, with **each State = tenant**.

Analytics DB/schema will be documented separately.

**2. DPG Orientation**

JalSoochak is designed as a **Digital Public Good** and will adhere to DPG principles:

### 2.1 Openness & Reusability

* **Open standards & APIs:** RESTful APIs with JSON payloads, documented via OpenAPI/Swagger.
* **Reusable components:** Modular microservices that can be adapted by other states/countries.
* **Open licensing & docs:** Source and documentation (including tech specs, deployment guides, and contribution guidelines) will be openly available; tech + functional docs hosted on **GitBook**.
* **Localization & inclusivity:** Full **multi-language** support for messages and dashboards.
* **Interoperability:** Integration with state IT systems for user and master data.

### 2.2 Cloud-neutrality

* No hard dependency on vendor-specific cloud services.
* Deployable on:
  + Any **CNCF-compliant Kubernetes** cluster (on-prem or cloud).
  + Standard **PostgreSQL** and **Kafka** distributions.
  + S3-compatible object storage.

### 2.3 Accessibility

* The UI design and implementation will conform to:
  + **GIGW 3.0** (Guidelines for Indian Government Websites) where applicable.
  + **WCAG 2.1 AA** accessibility best practices.
* Key aspects:
  + Screen-reader-friendly markup.
  + Sufficient color contrast.
  + Keyboard-only navigation support.
  + No color-only signalling: status colors (green/red/etc.) will be accompanied by text/labels or icons.

### 2.4 Data Security & Privacy

* **Encryption in transit:** All external endpoints over **HTTPS/TLS 1.2+**.
* **Encryption at rest:**
  + Database volumes (PostgreSQL).
  + Object storage (for images, dumps).
  + Backups where stored.
* **PII handling:**
  + Phone numbers and operator identifiers treated as **PII**.
  + Minimal PII stored; access restricted to necessary services and roles.
* **Open yet safe:**
  + **Public dashboards** are tenant-specific and show only aggregated, non-PII metrics.
  + **Admin/config endpoints** are strictly authenticated and authorized via Keycloak.
* **Audit logging:**
  + Key configuration changes, sync operations, and escalations are logged in a structured way.
  + Logs avoid excessive PII.

**3. Users and Tenancy Model**

**3.1 Tenancy Model**

* **Multi-tenant system**:
  + **Tenant = State** (e.g., AP, TS, MH).
* Each tenant has:
  + Own configuration (languages, water norms, escalation rules, thresholds, etc.).
  + Own public dashboards (state-specific URL).
* **Country-level dashboard** aggregates data across all tenants.

Implementation approach (v2):

* **Single logical database (PostgreSQL) with shared schema**.
* Almost all domain tables include a tenant\_id.
* Services enforce tenant isolation at application level.
* Future ADR leaves room for DB-per-tenant model if needed.

**3.2 Business User Roles (Domain hierarchy)**

These are **domain concepts** used for filtering dashboards, drill-down and escalation paths:

* **Central Level**
  + Central Political
  + Central Bureaucratic
* **State Level**
  + State Political
  + State Bureaucratic
* **State (Department) Levels**
  + Zone
  + Circle
  + Division
  + Sub-Division
* **State (Administrative) Levels**
  + District Level
  + Block Level
  + Gram Panchayat (GP) Level
  + Village Level
  + Pump Operator

These are not necessarily direct login roles (B), but are **dimensions in the data model and UI filters**.

**3.3 System User Roles (Access & Configuration)**

These are actual system roles that log into admin/config UIs:

1. **Super User (Multi-state Tenant Admin)**
   * Manages all states (tenants).
   * Actions:
     + Add new state (tenant).
     + Edit/delete state.
     + Assign/unassign **State System Admin** to a state.
     + Edit **default configuration parameters** for new states (default water norms, default thresholds, default Glific/webhook settings, etc.).
2. **State System Admin (State Admin)**
   * Manages configuration for **exactly one state (tenant)**.
   * Actions:
     + Set **state default languages**.
     + Configure **water norms** (e.g., 55L / 70L / 90L per capita).
     + Configure **WhatsApp/Glific integration parameters**.
     + Configure **thresholds**, **escalation rules**, **nudge messages**, and **message templates**.
     + Monitor **data sync issues** with State IT systems.

**3.4 User Provisioning Rules**

* Pump Operators, Section Officers, AEEs, EEs, etc. are **not manually created** in the JalSoochak UI.
* All such data arrives from **State IT Systems** via:
  + **One-time data dump** during onboarding.
  + **API-based sync** for updates (e.g., new phone numbers, reassignments).

This requires:

* A **Data Ingestion / Integration Service**.
* Persistent **sync logs**, **error logs**, and **dedupe logic**.

**4. Functional Overview**

**4.1 Core Functional Modules**

1. **Field Operations Module (Unified Service with Submodules)**

* Manages:
  + Schemes and pumps.
  + Pump Operators and their assignments.
  + BFM readings and daily quantities.
  + Pump functionality status.
* Provides views and APIs for:
  + Section Officer & other supervisory roles.
  + Metrics like top/bottom performing Pump Operators (7/15/30 days).
  + Absent Pump Operators (no submissions).

1. **Messaging & Nudge Orchestration (Glific Integration)**

* Determines **who gets what message when** based on:
  + State-level configuration (thresholds, water norms, escalation rules).
  + Anomaly detection and submission data.
* Integrates with **Glific**:
  + Outbound messages via Glific APIs.
  + Handles inbound webhooks from Glific (Pump Operator submissions, commands).

1. **Dashboards & Analytics**

* **Tenant-specific public dashboards** for each state.
* **Country-level dashboard** aggregating across all states.
* Dual drill-down:
  + **Geo hierarchy**: Centre → State → District → Block → GP → Village.
  + **Departmental hierarchy**: Zone → Circle → Division → Sub-division.
* Metrics:
  + Status by color (green/light green/orange/red/dark red).
  + Daily submission % per unit.
  + Water quantity supplied.
  + Continuity / no-water days.
  + Active vs inactive Pump Operators.
  + Comparative views across states/districts.

1. **Configuration & State Administration**

* Tenant creation and high-level defaults (Super User).
* State-specific languages, norms, thresholds, escalation rules, templates (State System Admin).

1. **Identity & Access Management (IAM)**

* Using **Keycloak**:
  + Realms, clients, roles for various UIs.
  + Maps system roles (Super User, State Admin).
  + Issues JWT tokens for backend API access.

1. **Anomaly Detection Module**

* **Rule-based** detection initially, using:
  + Configured thresholds and rules per tenant.
  + Field Operations data (BFM readings, submissions).
* Flags:
  + Low quantity.
  + No submissions.
  + Same image used repeatedly.
* Integrates with:
  + Messaging Orchestrator (trigger escalations/nudges).
  + Dashboards (anomaly indicators).
* Future-ready for ML-based anomaly detection.

1. **Integration Module (State IT Systems & Data Sync)**

* Imports:
  + Staff master data (Pump Operators, Section Officers, etc.).
  + Schemes, locations, pumps.
* Handles:
  + One-time bulk import.
  + Subsequent incremental updates via APIs.
* Exposes monitoring views for State System Admin.

**5. Technical Architecture**

**5.1 Architectural Style**

* **Microservices-based backend**, implemented in **Java + Spring Boot**.
* **Mono-repo** structure:
  + /services/field-operations-service
  + /services/messaging-orchestrator-service
  + /services/tenant-admin-service
  + /services/state-config-service
  + /services/integration-service
  + /services/dashboard-api-service
  + /frontend/ (React + ECharts)
  + /libs/ (shared DTOs, constants, common code)
  + /infra/ (Helm, manifests, Terraform, etc.)
* Asynchronous communication via **Kafka** for:
  + Event-based notifications.
  + Decoupling ingestion/outbound messaging and processing.
* **Keycloak** for IAM.

**5.2 Key Backend Services**

1. **API Gateway / Edge Service**
   * Terminates HTTPS.
   * Routes traffic to internal services.
   * Handles API versioning and rate limiting.
2. **Auth & Tenant Resolver (Lightweight) using Keycloak**
   * Authentication and Authorization
   * Mostly needed for admin/config UIs.
   * Dashboard UIs (public) may be **URL-token based** or unauthenticated.
   * Determines tenant\_id from:
     + URL / subdomain (e.g., /tenant/{tenantSlug}), or Message Header or
     + Token for admin users.
3. **Tenant Admin Service**
   * Manages tenants (states).
   * Assigns State System Admins.
   * Stores tenant metadata (name, code, country mapping, default configs).
4. **State Config Service**
   * Manages:
     + State languages.
     + Water norms.
     + Thresholds, anomaly rules.
     + Escalation rules.
     + Message templates & nudges.
     + WhatsApp/Glific configuration per tenant.
   * Exposes APIs for the Messaging Orchestrator & Dashboards to query config.
5. **Field Operations Service (Unified with Submodules)**
   * Domain submodules:
     + **Scheme & Location Management**
     + **Pump Operator assignments**
     + **Ingress reading submissions (BFM reading, other channels)**
     + **Pump operation status**
     + **Pump Operator performance calculations**
     + **Section Officer views**
       1. Handles logic like:
          1. water\_quantity = BFM\_reading(today) - BFM\_reading(yesterday)
          2. Top/bottom Pump Operators (7/15/30 days).
          3. Absent Pump Operators (no submissions).
6. **Messaging Orchestrator Service**
   * Contains the **rules engine**: “what messages to send, when, to whom”.
   * Reads configuration from State Config Service / DB.
   * Outbound:
     + Calls **Glific(or other service providers) APIs** to send messages.
   * Inbound:
     + Exposes webhook endpoints for Glific(Service provider) to post messages.
   * Emits events to Kafka for downstream processing (e.g., logging, analytics).
7. **Integration Service**
   * Handles **data ingestion from State IT systems**:
     + One-time dump APIs or file uploads.
     + Periodic/real-time sync APIs.
   * Validates, deduplicates, and persists:
     + Users (pump operators, Section Officers, AEE, EE…).
     + Schemes, locations, pumps.
   * Records sync statuses and error logs for State System Admin to monitor.
8. **Dashboard API Service**
   * Read-only APIs for:
     + State public dashboards.
     + Country-level dashboards.
   * Implements:
     + Geo & departmental drilldown.
     + Status color logic (green, orange, red, dark red).
     + Daily submission percentages, continuity metrics.
     + Comparative views across states/districts.
   * Uses **ECharts-friendly API responses** for visualization.
9. **Country Aggregator Logic**
   * Provided as part of Dashboard API Service or a microservice:
     + Aggregates tenant\_id-scoped data across all tenants.
     + Powers **country-level dashboard**.

**5.3 Data Flow Examples**

**Field submission via WhatsApp**

1. Pump Operator sends BFM reading or status via WhatsApp.
2. Glific receives and posts to JalSoochak **Messaging Orchestrator Webhook**.
3. Orchestrator parses and validates message.
4. Orchestrator posts to **Field Operations Service** (/submissions endpoint).
5. Field Operations Service stores submission in PostgreSQL.
6. Events pushed to Kafka (field.submission.created).
7. Dashboard queries use these submissions in near real-time.

**Admin configuration update**

1. State System Admin updates escalation rule in React UI.
2. Frontend calls State Config Service API.
3. Config persists to DB and optionally publishes config.updated events to Kafka.
4. Messaging Orchestrator consumes updated rules.

**6. Deployment Architecture**

**6.1 Cloud-neutral Principles**

* Runs on any **Kubernetes** cluster (on-prem, any cloud).
* No cloud-vendor-proprietary managed services required.
* Infra described using **Helm** + optionally **Terraform**, keeping providers pluggable.

**6.2 Environments**

* dev
* staging
* prod

**6.3 Components**

* **Kubernetes cluster**
* **PostgreSQL cluster** (multi-AZ/high availability)
* **Kafka cluster** (e.g., Bitnami Helm chart or cloud-neutral Kafka distribution)
* **Object storage** (S3-compatible, for images, file dumps)
* **Reverse proxy / ingress** (NGINX Ingress, Traefik, etc.)
* **Monitoring**: Prometheus + Grafana
* **Logging**: EFK / ELK stack

**6.4 Network Layout**

* Public ingress only to:
  + API Gateway (REST APIs)
  + Public dashboard frontend
  + Glific webhook endpoints
* All internal services and databases in **private network**.
* TLS for all external endpoints.

**7. Technology Stack**

**7.1 Backend**

* **Language:** Java 17+
* **Framework:** Spring Boot (Web, Data JPA, Security, Kafka)
* **Build:** Gradle/Maven
* **Packaging:** Docker images

**7.2 Frontend**

* **Framework:** React + TypeScript
* **Visualization:** ECharts (geo maps, bar charts, line charts, etc.)
* **i18n:** React i18next or similar library
* **Deployment:** Static files served via CDN / object storage or K8s-based web server.

**7.3 Database & Messaging**

* **Transactional DB:** PostgreSQL
* **Caching (optional):** Redis
* **Message Broker:** Kafka

**7.4 Documentation & Repo**

* **Code:** Single Git repository (mono-repo).
* **Docs:** GitBook (with sections for architecture, APIs, ADRs, deployment, DPG compliance, contribution guide).

**8. Architectural Decision Records (ADRs)**

**ADR-001: Microservices in Mono-repo**

* **Decision:** Use microservice architecture with all services managed in a single Git mono-repo.
* **Rationale:** Easier code sharing, consistent tooling, simpler onboarding and CI/CD.
* **Status:** Accepted.

**ADR-002: Cloud-neutral Kubernetes Deployment**

* **Decision:** Base deployment on generic Kubernetes manifests and Helm charts.
* **Rationale:** Avoid vendor lock-in; support on-prem and different cloud providers.
* **Status:** Accepted.

**ADR-003: Single Shared Database Schema for Multi-tenancy (v2)**

* **Decision:** Use a single Database schema, scoped with tenant\_id in all domain tables.
* **Rationale:** Simpler operation and maintenance in early stages; easier to run country-level aggregates.
* **Status:** Accepted; revisit when tenants > X or per-tenant data isolation mandated by policy (legally).

**ADR-004: Glific as WhatsApp Integration Layer**

* **Decision:** Use **Glific** rather than direct WhatsApp Business API integration.
* **Rationale:** Glific handles WhatsApp plumbing, templating, compliance; JalSoochak focuses on domain logic and orchestration. Reuse of existing implementation
* **Status:** Accepted.

**ADR-005: Unified Field Operations Service**

* **Decision:** Use a single **Field Operations Service** with submodules for schemes, Pump Operators, readings, performance, etc.
* **Rationale:** Cohesive domain; reduces orchestration overhead; matches current team capacity.
* **Status:** Accepted.

Java vs Node

**9. API Specifications (Representative)**

*(All APIs use tenant\_id in path or inferred from context where needed.)*

**9.1 Tenant Admin APIs**

**POST /api/tenants**
Create a new tenant (state).

Request (Super User only):

{

"code": "AP",

"name": "Andhra Pradesh",

"country": "IN",

"defaultLanguages": ["te", "en"],

"defaultConfig": {

"defaultWaterNormLpcd": 55

}

}

Response:

{

"tenantId": "uuid",

"code": "AP",

"name": "Andhra Pradesh"

}

**9.2 State Config APIs**

**PUT /api/tenants/{tenantId}/config/water-norms**

{

"norms": [

{ "category": "rural", "lpcd": 55 },

{ "category": "urban", "lpcd": 70 }

]

}

**PUT /api/tenants/{tenantId}/config/escalation-rules**

{

"rules": [

{

"id": "no-submission-24-hours",

"condition": { "type": "no\_submission", "durationHours": 24 },

"levels": [

{ "level": 1, "notifyRole": "SectionOfficer" },

{ "level": 2, "notifyRole": "AssistantExecutiveEngineer" }

]

}

]

}

**9.3 Messaging Orchestrator APIs**

**POST /api/glific/webhook/inbound**
Webhook endpoint for Glific.

Request (example):

{

"from": "9198xxxxxxx",

"message": "BFM 235",

"timestamp": "2025-12-01T05:00:00Z",

"providerMetadata": { "...": "..." }

}

Response:

{ "status": "accepted" }

The service will:

* Resolve Pump Operator by phone.
* Determine tenant\_id and scheme.
* Forward parsed submission to Field Operations Service.

**9.4 Field Operations APIs**

**POST /api/tenants/{tenantId}/bfm-readings**

{

"schemeId": "uuid",

"operatorId": "uuid",

"readingValue": 235.0,

"readingTime": "2025-12-01T05:00:00Z"

}

Response:

{

"submissionId": "uuid",

"computedQuantityLitre": 1200.0

}

**GET /api/tenants/{tenantId}/section-officer/dashboard**

Query params: officerId, range=7|15|30

Returns:

* Pump Operator reporting status (reported / not reported).
* Scheme functionality status.
* Top/bottom performers.
* Absent Pump Operators.
* Graph data structures for performance (ECharts-ready).

**9.5 Integration APIs (State IT Systems)**

**POST /api/tenants/{tenantId}/sync/users**

One-time or periodic sync of operator/staff master data.

{

"sourceSystem": "state\_it\_system\_name",

"users": [

{

"externalId": "IT\_123",

"name": "Pump Operator 1",

"phone": "91xxxxxxxxxx",

"role": "PumpOperator",

"location": {

"district": "X",

"block": "Y",

"gp": "Z",

"village": "V1"

}

}

]

}

Response:

{

"importId": "uuid",

"status": "in\_progress"

}

**9.6 Dashboard APIs**

**GET /api/tenants/{tenantId}/dashboard/geo-summary**

Params: level=state|district|block|gp|village, parentId?, date=YYYY-MM-DD

Returns data for map + summary cards:

{

"level": "district",

"items": [

{

"id": "district-01",

"name": "District A",

"status": "GREEN",

"dailySubmissionPercent": 92.5,

"noWaterDays": 0,

"activeOperators": 120,

"inactiveOperators": 5

}

]

}

**GET /api/country/dashboard/summary**

Aggregated across all tenants:

{

"country": "IN",

"date": "2025-12-01",

"states": [

{

"tenantCode": "AP",

"name": "Andhra Pradesh",

"status": "ORANGE",

"dailySubmissionPercent": 78.3

},

{

"tenantCode": "MH",

"name": "Maharashtra",

"status": "GREEN",

"dailySubmissionPercent": 95.1

}

]

}

**10. Transactional Database Design**

**10.1 Tenancy & Users**

**tenants**

* tenant\_id (PK, UUID)
* code (varchar, unique, e.g., “AP”)
* name (varchar)
* country (varchar, e.g., “IN”)
* created\_at, updated\_at

**users**

* user\_id (PK, UUID)
* tenant\_id (FK → tenants)
* external\_id (nullable, for state IT mapping)
* name (varchar)
* phone (varchar, unique per tenant)
* system\_role (enum: SUPER\_USER, STATE\_ADMIN, NONE)
* business\_role (enum: PUMP\_OPERATOR, SECTION\_OFFICER, AEE, EE, DISTRICT\_LEVEL, BLOCK\_LEVEL, GP\_LEVEL, VILLAGE\_LEVEL, etc.)
* status (enum: ACTIVE, INACTIVE)
* created\_at, updated\_at

**10.2 Location & Hierarchies**

**geo\_units**

* geo\_id (PK, UUID)
* tenant\_id
* type (enum: STATE, DISTRICT, BLOCK, GP, VILLAGE)
* name
* parent\_geo\_id (FK → geo\_units.geo\_id, nullable)

**dept\_units**

* dept\_id (PK, UUID)
* tenant\_id
* type (enum: ZONE, CIRCLE, DIVISION, SUB\_DIVISION)
* name
* parent\_dept\_id (FK → dept\_units.dept\_id, nullable)

**10.3 Schemes, Pumps, Assignments**

**schemes**

* scheme\_id (PK, UUID)
* tenant\_id
* name
* geo\_id (FK → geo\_units)
* dept\_id (nullable, FK → dept\_units)
* status (enum: FUNCTIONAL, NON\_FUNCTIONAL)
* created\_at, updated\_at

**pumps**

* pump\_id (PK, UUID)
* tenant\_id
* scheme\_id (FK → schemes)
* identifier (varchar, unique per scheme)
* status (enum: ACTIVE, INACTIVE)
* created\_at, updated\_at

**operator\_assignments**

* assignment\_id (PK, UUID)
* tenant\_id
* user\_id (FK → users, Pump Operator)
* scheme\_id (FK → schemes)
* role (enum: PUMP\_OPERATOR, SECTION\_OFFICER, AEE, EE)
* is\_primary (boolean)
* start\_date
* end\_date (nullable)

This supports “1 Pump Operator per scheme; sometimes 2” with is\_primary indicating the primary operator.

**10.4 Readings & Submissions**

**bfm\_readings**

* reading\_id (PK, UUID)
* tenant\_id
* scheme\_id
* pump\_id (nullable if scheme-level)
* user\_id (operator)
* reading\_value (decimal)
* reading\_time (timestamp)
* source (enum: WHATSAPP, MANUAL, OTHER)
* raw\_message\_id (nullable FK → messages.message\_id)

**water\_quantities**

* quantity\_id (PK, UUID)
* tenant\_id
* scheme\_id
* date (date)
* start\_reading\_id (FK → bfm\_readings)
* end\_reading\_id (FK → bfm\_readings)
* computed\_quantity\_litre (decimal)
* computed\_at

**10.5 Messaging & Nudge Config**

**message\_templates**

* template\_id (PK, UUID)
* tenant\_id
* code (e.g., “DAILY\_NUDGE\_PUMP\_OPERATOR”)
* channel (enum: WHATSAPP)
* default\_language
* created\_at, updated\_at

**message\_template\_texts**

* id (PK)
* template\_id (FK)
* language\_code (e.g., “te”, “en”)
* content (text with placeholders, e.g., “Dear {{name}}…”)

**nudges**

* nudge\_id (PK, UUID)
* tenant\_id
* template\_id (FK)
* target\_role (e.g., PUMP\_OPERATOR, SECTION\_OFFICER)
* trigger\_type (enum: SCHEDULED, EVENT\_BASED)
* schedule\_cron (nullable)
* event\_condition\_json (JSON for event-based logic)
* active (boolean)

**messages**

* message\_id (PK, UUID)
* tenant\_id
* user\_id (FK, nullable for broadcast)
* direction (enum: INBOUND, OUTBOUND)
* channel (enum: WHATSAPP)
* content (text)
* language\_code
* provider\_message\_id
* timestamp
* processed (boolean)

**10.6 Anomalies & Status**

**anomalies**

* anomaly\_id (PK, UUID)
* tenant\_id
* scheme\_id
* type (enum: LOW\_QUANTITY, NO\_SUBMISSION, REPEATED\_IMAGE, OTHER)
* date
* details (JSON)
* status (OPEN, RESOLVED)
* created\_at, updated\_at

**10.7 Sync Tracking**

**imports**

* import\_id (PK, UUID)
* tenant\_id
* source\_system
* type (USERS, SCHEMES, PUMPS)
* status (IN\_PROGRESS, COMPLETED, FAILED, PARTIAL)
* started\_at, finished\_at
* error\_summary (text)

**import\_errors**

* error\_id (PK, UUID)
* import\_id (FK)
* row\_identifier
* error\_code
* error\_message
* payload (JSON)

**11. Non-functional Requirements (NFRs)**

* **Performance:**
  + Capable of handling at least **X** WhatsApp messages per minute per tenant (to be defined).
  + Dashboards should load in < 3 seconds for typical views.
* **Scalability:**
  + Horizontal scaling of stateless services via Kubernetes.
  + Kafka partitions per topic sized for expected throughput.
* **Security:**
  + HTTPS everywhere.
  + JWT-based authentication for admin/config APIs.
  + Public dashboards are tenant-specific URLs; if stronger access control is added later, model via roles + tokens.
* **Observability:**
  + Structured logs with correlation IDs.
  + Dashboards for key metrics (message throughput, submissions per day, errors per integration).

**12. Future Work**

* **Analytics DB and schema** (star schema for multi-dimensional analysis).
* **ML-based anomaly detection**.
* **Stronger RBAC in dashboards** if needed later.
* **Per-tenant database isolation** if mandated by policy or scale.