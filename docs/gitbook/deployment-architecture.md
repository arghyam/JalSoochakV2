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
* **MySQL cluster** (multi-AZ/high availability)
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