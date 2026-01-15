**9. API Specifications**

For the full OpenAPI 3.0 specification, see [openapi.yaml](openapi.yaml).

The API includes the following categories:

- **Tenant Admin**: Create, list, get, update, delete tenants.
- **State Config**: Get and update tenant configurations (water norms, languages, thresholds, escalation rules).
- **Messaging Orchestrator**: Inbound webhook from Glific.
- **Field Operations**: List schemes/operators/readings, submit readings, section officer dashboard.
- **Integration**: Sync users/schemes, get sync status.
- **Dashboard**: Geo/dept summaries, country-level summary.

Below are representative examples:

**9.1 Tenant Admin APIs**

**POST /api/tenants**
Create a new tenant (state).

Request (Super User only):

```json
{
  "code": "AP",
  "name": "Andhra Pradesh",
  "country": "IN",
  "defaultLanguages": ["te", "en"],
  "defaultConfig": {
    "defaultWaterNormLpcd": 55
  }
}
```

Response:

```json
{
  "tenantId": "uuid",
  "code": "AP",
  "name": "Andhra Pradesh"
}
```

**9.2 State Config APIs**

**PUT /api/tenants/{tenantId}/config/water-norms**

```json
{
  "norms": [
    { "category": "rural", "lpcd": 55 },
    { "category": "urban", "lpcd": 70 }
  ]
}
```

**PUT /api/tenants/{tenantId}/config/escalation-rules**

```json
{
  "rules": [
    {
      "id": "no-submission-24-hours",
      "condition": { "type": "no_submission", "durationHours": 24 },
      "levels": [
        { "level": 1, "notifyRole": "SectionOfficer" },
        { "level": 2, "notifyRole": "AssistantExecutiveEngineer" }
      ]
    }
  ]
}
```

**9.3 Messaging Orchestrator APIs**

**POST /api/glific/webhook/inbound**
Webhook endpoint for Glific.

Request (example):

```json
{
  "from": "9198xxxxxxx",
  "message": "BFM 235",
  "timestamp": "2025-12-01T05:00:00Z",
  "providerMetadata": { "...": "..." }
}
```

Response:

```json
{ "status": "accepted" }
```

The service will:

* Resolve Pump Operator by phone.
* Determine tenant\_id and scheme.
* Forward parsed submission to Field Operations Service.

**9.4 Field Operations APIs**

**POST /api/tenants/{tenantId}/bfm-readings**

```json
{
  "schemeId": "uuid",
  "operatorId": "uuid",
  "readingValue": 235.0,
  "readingTime": "2025-12-01T05:00:00Z"
}
```

Response:

```json
{
  "submissionId": "uuid",
  "computedQuantityLitre": 1200.0
}
```

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

```json
{
  "sourceSystem": "state_it_system_name",
  "users": [
    {
      "externalId": "IT_123",
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
```

Response:

```json
{
  "importId": "uuid",
  "status": "in_progress"
}
```

**9.6 Dashboard APIs**

**GET /api/tenants/{tenantId}/dashboard/geo-summary**

Params: level=state|district|block|gp|village, parentId?, date=YYYY-MM-DD

Returns data for map + summary cards:

```json
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
```

**GET /api/country/dashboard/summary**

Aggregated across all tenants:

```json
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
```