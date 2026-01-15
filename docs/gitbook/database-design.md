**10. Transactional Database Design (MySQL)**

**10.1 Tenancy & Users**

**tenants**

* tenant\_id (PK, UUID)
* code (varchar, unique, e.g., "AP")
* name (varchar)
* country (varchar, e.g., "IN")
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

This supports "1 Pump Operator per scheme; sometimes 2" with is\_primary indicating the primary operator.

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
* code (e.g., "DAILY\_NUDGE\_PUMP\_OPERATOR")
* channel (enum: WHATSAPP)
* default\_language
* created\_at, updated\_at

**message\_template\_texts**

* id (PK)
* template\_id (FK)
* language\_code (e.g., "te", "en")
* content (text with placeholders, e.g., "Dear {{name}}…")

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