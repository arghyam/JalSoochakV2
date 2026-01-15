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