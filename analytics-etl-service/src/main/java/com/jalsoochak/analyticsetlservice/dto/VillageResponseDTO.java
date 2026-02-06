package com.jalsoochak.analyticsetlservice.dto;

import java.time.OffsetDateTime;

/**
 * Response DTO for DimVillage
 */
public class VillageResponseDTO {

    private Integer id;
    private Integer tenantId;
    private Integer sourceVillageId;
    private String title;
    private String lgdCode;
    private Integer householdCount;
    private Integer lgdLocationId;
    private Integer adminLocationId;
    private OffsetDateTime updatedAt;

    public VillageResponseDTO() {}

    private VillageResponseDTO(Builder builder) {
        this.id = builder.id;
        this.tenantId = builder.tenantId;
        this.sourceVillageId = builder.sourceVillageId;
        this.title = builder.title;
        this.lgdCode = builder.lgdCode;
        this.householdCount = builder.householdCount;
        this.lgdLocationId = builder.lgdLocationId;
        this.adminLocationId = builder.adminLocationId;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer id;
        private Integer tenantId;
        private Integer sourceVillageId;
        private String title;
        private String lgdCode;
        private Integer householdCount;
        private Integer lgdLocationId;
        private Integer adminLocationId;
        private OffsetDateTime updatedAt;

        public Builder id(Integer id) { this.id = id; return this; }
        public Builder tenantId(Integer tenantId) { this.tenantId = tenantId; return this; }
        public Builder sourceVillageId(Integer sourceVillageId) { this.sourceVillageId = sourceVillageId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder lgdCode(String lgdCode) { this.lgdCode = lgdCode; return this; }
        public Builder householdCount(Integer householdCount) { this.householdCount = householdCount; return this; }
        public Builder lgdLocationId(Integer lgdLocationId) { this.lgdLocationId = lgdLocationId; return this; }
        public Builder adminLocationId(Integer adminLocationId) { this.adminLocationId = adminLocationId; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public VillageResponseDTO build() { return new VillageResponseDTO(this); }
    }

    // Getters
    public Integer getId() { return id; }
    public Integer getTenantId() { return tenantId; }
    public Integer getSourceVillageId() { return sourceVillageId; }
    public String getTitle() { return title; }
    public String getLgdCode() { return lgdCode; }
    public Integer getHouseholdCount() { return householdCount; }
    public Integer getLgdLocationId() { return lgdLocationId; }
    public Integer getAdminLocationId() { return adminLocationId; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
