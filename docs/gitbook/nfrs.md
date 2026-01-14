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