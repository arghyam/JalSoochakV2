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
  + Database volumes.
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