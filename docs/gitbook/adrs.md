**8. Architectural Decision Records (ADRs)**

**ADR-001: Microservices in Mono-repo**

* **Decision:** Use microservice architecture with all services managed in a single Git mono-repo.
* **Rationale:** Easier code sharing, consistent tooling, simpler onboarding and CI/CD.
* **Status:** Accepted.

**ADR-002: Cloud-neutral Kubernetes Deployment**

* **Decision:** Base deployment on generic Kubernetes manifests and Helm charts.
* **Rationale:** Avoid vendor lock-in; support on-prem and different cloud providers.
* **Status:** Accepted.

**ADR-003: Single Shared MySQL Schema for Multi-tenancy (v2)**

* **Decision:** Use a single MySQL schema, scoped with tenant\_id in all domain tables.
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