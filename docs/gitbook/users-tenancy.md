**3. Users and Tenancy Model**

**3.1 Tenancy Model**

* **Multi-tenant system**:
  + **Tenant = State** (e.g., AP, TS, MH).
* Each tenant has:
  + Own configuration (languages, water norms, escalation rules, thresholds, etc.).
  + Own public dashboards (state-specific URL).
* **Country-level dashboard** aggregates data across all tenants.

Implementation approach (v2):

* **Single logical database (MySQL) with shared schema**.
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