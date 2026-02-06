# Analytics ETL Service

A minimal, modular ETL service scaffold built with Spring Boot, PostgreSQL, and Kafka.

## 🎯 Overview

This is a **starter/scaffold ETL service** designed to be easily expandable. It provides:

- Clean modular architecture
- PostgreSQL database integration
- Kafka consumer setup (placeholder)
- REST API endpoint for geo data
- Layered architecture following best practices

## 🏗️ Architecture

```
com.jalsoochak.analyticsetlservice
 ├── config
 │     └── KafkaConfig              # Kafka consumer configuration
 │
 ├── controller
 │     └── GeoController            # REST API endpoints
 │
 ├── service
 │     └── GeoService               # Service interface
 │     └── impl
 │           └── GeoServiceImpl    # Service implementation
 │
 ├── repository
 │     └── DimGeoRepository         # JPA repository
 │
 ├── entity
 │     └── DimGeo                   # JPA entity
 │
 ├── kafka
 │     └── GeoEventConsumer         # Kafka consumer (placeholder)
 │
 ├── dto
 │     └── DimGeoResponseDTO        # Response DTO
 │
 ├── mapper
 │     └── GeoMapper                # Entity to DTO mapper
 │
 └── EtlApplication                  # Main application class
```

## 🛠️ Technology Stack

- **Java 21**
- **Spring Boot 3.2.0**
- **Spring Web** - REST API
- **Spring Data JPA** - Database access
- **Spring Kafka** - Kafka integration
- **PostgreSQL** - Database
- **Lombok** - Boilerplate reduction
- **Maven** - Build tool

## 📋 Prerequisites

- Java 21+
- Maven 3.6+
- PostgreSQL 12+
- Kafka (for Kafka consumer functionality)

## 🚀 Getting Started

### 1. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE jalsoochak_analytics_db;
```

The `dim_geo` table will be created automatically via JPA `ddl-auto=update`, or you can run the SQL script:

```sql
-- See src/main/resources/schema.sql
```

### 2. Configuration

Update `application.yml` with your database and Kafka settings:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jalsoochak_analytics_db
    username: postgres
    password: postgres
  
  kafka:
    bootstrap-servers: localhost:9092
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The service will start on port `9090`.

## 📡 API Endpoints

### GET /api/geos

Returns all geo records from `dim_geo` table.

**Response:**
```json
[
  {
    "geoId": "uuid",
    "tenantId": "uuid",
    "type": "STATE",
    "name": "Assam",
    "geoStateId": null,
    "geoDistrictId": null,
    "geoBlockId": null,
    "geoGpId": null,
    "geoVillageId": null,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

## 🔄 Kafka Integration

The service includes a placeholder Kafka consumer that subscribes to `geo.events` topic.

**Current behavior:** Only logs received messages.

**Future:** Will process and store geo events.

## 📁 Project Structure

- **Entity Layer** (`entity/`) - JPA entities
- **Repository Layer** (`repository/`) - Data access
- **Service Layer** (`service/`) - Business logic
- **Controller Layer** (`controller/`) - REST endpoints
- **DTO Layer** (`dto/`) - Data transfer objects
- **Mapper Layer** (`mapper/`) - Entity/DTO conversion
- **Kafka Layer** (`kafka/`) - Kafka consumers
- **Config Layer** (`config/`) - Configuration classes

## 🔧 Extending the Service

### Adding a New Table

1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create DTO in `dto/` package
4. Create mapper in `mapper/` package
5. Create service interface and implementation
6. Create controller endpoint

### Adding a New Kafka Consumer

1. Create consumer class in `kafka/` package
2. Annotate with `@KafkaListener`
3. Configure topic in `application.yml` if needed

## 🧪 Testing

Run tests:

```bash
mvn test
```

## 📝 Notes

- This is a **scaffold/starter** project, not a full production implementation
- Database schema is managed via JPA `ddl-auto=update`
- Kafka consumer is a placeholder - implement processing logic as needed
- Follow the existing structure when adding new features

## 🎯 Design Philosophy

- **Modularity** - Clear separation of concerns
- **Extensibility** - Easy to add new tables, APIs, and consumers
- **Simplicity** - Minimal complexity, maximum clarity
- **Best Practices** - Follows Spring Boot and Java best practices
