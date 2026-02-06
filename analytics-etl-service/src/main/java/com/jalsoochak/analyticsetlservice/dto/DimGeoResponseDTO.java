package com.jalsoochak.analyticsetlservice.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for DimGeo
 */
public class DimGeoResponseDTO {

    private UUID geoId;
    private UUID tenantId;
    private String type;
    private String name;
    private UUID geoStateId;
    private UUID geoDistrictId;
    private UUID geoBlockId;
    private UUID geoGpId;
    private UUID geoVillageId;
    private OffsetDateTime updatedAt;

    public DimGeoResponseDTO() {}

    private DimGeoResponseDTO(Builder builder) {
        this.geoId = builder.geoId;
        this.tenantId = builder.tenantId;
        this.type = builder.type;
        this.name = builder.name;
        this.geoStateId = builder.geoStateId;
        this.geoDistrictId = builder.geoDistrictId;
        this.geoBlockId = builder.geoBlockId;
        this.geoGpId = builder.geoGpId;
        this.geoVillageId = builder.geoVillageId;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID geoId;
        private UUID tenantId;
        private String type;
        private String name;
        private UUID geoStateId;
        private UUID geoDistrictId;
        private UUID geoBlockId;
        private UUID geoGpId;
        private UUID geoVillageId;
        private OffsetDateTime updatedAt;

        public Builder geoId(UUID geoId) { this.geoId = geoId; return this; }
        public Builder tenantId(UUID tenantId) { this.tenantId = tenantId; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder geoStateId(UUID geoStateId) { this.geoStateId = geoStateId; return this; }
        public Builder geoDistrictId(UUID geoDistrictId) { this.geoDistrictId = geoDistrictId; return this; }
        public Builder geoBlockId(UUID geoBlockId) { this.geoBlockId = geoBlockId; return this; }
        public Builder geoGpId(UUID geoGpId) { this.geoGpId = geoGpId; return this; }
        public Builder geoVillageId(UUID geoVillageId) { this.geoVillageId = geoVillageId; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public DimGeoResponseDTO build() { return new DimGeoResponseDTO(this); }
    }

    // Getters
    public UUID getGeoId() { return geoId; }
    public UUID getTenantId() { return tenantId; }
    public String getType() { return type; }
    public String getName() { return name; }
    public UUID getGeoStateId() { return geoStateId; }
    public UUID getGeoDistrictId() { return geoDistrictId; }
    public UUID getGeoBlockId() { return geoBlockId; }
    public UUID getGeoGpId() { return geoGpId; }
    public UUID getGeoVillageId() { return geoVillageId; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
