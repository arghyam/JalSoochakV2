package com.jalsoochak.analyticsetlservice.dto;

import java.time.OffsetDateTime;

/**
 * Response DTO for DimScheme
 */
public class SchemeResponseDTO {

    private Integer id;
    private Integer tenantId;
    private Integer sourceSchemeId;
    private String schemeName;
    private Integer stateSchemeId;
    private Integer centreSchemeId;
    private Integer fhtcCount;
    private Integer plannedFhtc;
    private Integer houseHoldCount;
    private Double latitude;
    private Double longitude;
    private Integer villageId;
    private String villageName;
    private Integer lgdStateId;
    private String lgdStateName;
    private Integer lgdDistrictId;
    private String lgdDistrictName;
    private Integer lgdBlockId;
    private String lgdBlockName;
    private Integer lgdGramPanchayatId;
    private String lgdGramPanchayatName;
    private Integer adminZoneId;
    private String adminZoneName;
    private Integer adminCircleId;
    private String adminCircleName;
    private Integer adminDivisionId;
    private String adminDivisionName;
    private Integer adminSubDivisionId;
    private String adminSubDivisionName;
    private String status;
    private OffsetDateTime updatedAt;

    public SchemeResponseDTO() {}

    private SchemeResponseDTO(Builder builder) {
        this.id = builder.id;
        this.tenantId = builder.tenantId;
        this.sourceSchemeId = builder.sourceSchemeId;
        this.schemeName = builder.schemeName;
        this.stateSchemeId = builder.stateSchemeId;
        this.centreSchemeId = builder.centreSchemeId;
        this.fhtcCount = builder.fhtcCount;
        this.plannedFhtc = builder.plannedFhtc;
        this.houseHoldCount = builder.houseHoldCount;
        this.latitude = builder.latitude;
        this.longitude = builder.longitude;
        this.villageId = builder.villageId;
        this.villageName = builder.villageName;
        this.lgdStateId = builder.lgdStateId;
        this.lgdStateName = builder.lgdStateName;
        this.lgdDistrictId = builder.lgdDistrictId;
        this.lgdDistrictName = builder.lgdDistrictName;
        this.lgdBlockId = builder.lgdBlockId;
        this.lgdBlockName = builder.lgdBlockName;
        this.lgdGramPanchayatId = builder.lgdGramPanchayatId;
        this.lgdGramPanchayatName = builder.lgdGramPanchayatName;
        this.adminZoneId = builder.adminZoneId;
        this.adminZoneName = builder.adminZoneName;
        this.adminCircleId = builder.adminCircleId;
        this.adminCircleName = builder.adminCircleName;
        this.adminDivisionId = builder.adminDivisionId;
        this.adminDivisionName = builder.adminDivisionName;
        this.adminSubDivisionId = builder.adminSubDivisionId;
        this.adminSubDivisionName = builder.adminSubDivisionName;
        this.status = builder.status;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer id;
        private Integer tenantId;
        private Integer sourceSchemeId;
        private String schemeName;
        private Integer stateSchemeId;
        private Integer centreSchemeId;
        private Integer fhtcCount;
        private Integer plannedFhtc;
        private Integer houseHoldCount;
        private Double latitude;
        private Double longitude;
        private Integer villageId;
        private String villageName;
        private Integer lgdStateId;
        private String lgdStateName;
        private Integer lgdDistrictId;
        private String lgdDistrictName;
        private Integer lgdBlockId;
        private String lgdBlockName;
        private Integer lgdGramPanchayatId;
        private String lgdGramPanchayatName;
        private Integer adminZoneId;
        private String adminZoneName;
        private Integer adminCircleId;
        private String adminCircleName;
        private Integer adminDivisionId;
        private String adminDivisionName;
        private Integer adminSubDivisionId;
        private String adminSubDivisionName;
        private String status;
        private OffsetDateTime updatedAt;

        public Builder id(Integer id) { this.id = id; return this; }
        public Builder tenantId(Integer tenantId) { this.tenantId = tenantId; return this; }
        public Builder sourceSchemeId(Integer sourceSchemeId) { this.sourceSchemeId = sourceSchemeId; return this; }
        public Builder schemeName(String schemeName) { this.schemeName = schemeName; return this; }
        public Builder stateSchemeId(Integer stateSchemeId) { this.stateSchemeId = stateSchemeId; return this; }
        public Builder centreSchemeId(Integer centreSchemeId) { this.centreSchemeId = centreSchemeId; return this; }
        public Builder fhtcCount(Integer fhtcCount) { this.fhtcCount = fhtcCount; return this; }
        public Builder plannedFhtc(Integer plannedFhtc) { this.plannedFhtc = plannedFhtc; return this; }
        public Builder houseHoldCount(Integer houseHoldCount) { this.houseHoldCount = houseHoldCount; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder villageId(Integer villageId) { this.villageId = villageId; return this; }
        public Builder villageName(String villageName) { this.villageName = villageName; return this; }
        public Builder lgdStateId(Integer lgdStateId) { this.lgdStateId = lgdStateId; return this; }
        public Builder lgdStateName(String lgdStateName) { this.lgdStateName = lgdStateName; return this; }
        public Builder lgdDistrictId(Integer lgdDistrictId) { this.lgdDistrictId = lgdDistrictId; return this; }
        public Builder lgdDistrictName(String lgdDistrictName) { this.lgdDistrictName = lgdDistrictName; return this; }
        public Builder lgdBlockId(Integer lgdBlockId) { this.lgdBlockId = lgdBlockId; return this; }
        public Builder lgdBlockName(String lgdBlockName) { this.lgdBlockName = lgdBlockName; return this; }
        public Builder lgdGramPanchayatId(Integer lgdGramPanchayatId) { this.lgdGramPanchayatId = lgdGramPanchayatId; return this; }
        public Builder lgdGramPanchayatName(String lgdGramPanchayatName) { this.lgdGramPanchayatName = lgdGramPanchayatName; return this; }
        public Builder adminZoneId(Integer adminZoneId) { this.adminZoneId = adminZoneId; return this; }
        public Builder adminZoneName(String adminZoneName) { this.adminZoneName = adminZoneName; return this; }
        public Builder adminCircleId(Integer adminCircleId) { this.adminCircleId = adminCircleId; return this; }
        public Builder adminCircleName(String adminCircleName) { this.adminCircleName = adminCircleName; return this; }
        public Builder adminDivisionId(Integer adminDivisionId) { this.adminDivisionId = adminDivisionId; return this; }
        public Builder adminDivisionName(String adminDivisionName) { this.adminDivisionName = adminDivisionName; return this; }
        public Builder adminSubDivisionId(Integer adminSubDivisionId) { this.adminSubDivisionId = adminSubDivisionId; return this; }
        public Builder adminSubDivisionName(String adminSubDivisionName) { this.adminSubDivisionName = adminSubDivisionName; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public SchemeResponseDTO build() { return new SchemeResponseDTO(this); }
    }

    // Getters
    public Integer getId() { return id; }
    public Integer getTenantId() { return tenantId; }
    public Integer getSourceSchemeId() { return sourceSchemeId; }
    public String getSchemeName() { return schemeName; }
    public Integer getStateSchemeId() { return stateSchemeId; }
    public Integer getCentreSchemeId() { return centreSchemeId; }
    public Integer getFhtcCount() { return fhtcCount; }
    public Integer getPlannedFhtc() { return plannedFhtc; }
    public Integer getHouseHoldCount() { return houseHoldCount; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Integer getVillageId() { return villageId; }
    public String getVillageName() { return villageName; }
    public Integer getLgdStateId() { return lgdStateId; }
    public String getLgdStateName() { return lgdStateName; }
    public Integer getLgdDistrictId() { return lgdDistrictId; }
    public String getLgdDistrictName() { return lgdDistrictName; }
    public Integer getLgdBlockId() { return lgdBlockId; }
    public String getLgdBlockName() { return lgdBlockName; }
    public Integer getLgdGramPanchayatId() { return lgdGramPanchayatId; }
    public String getLgdGramPanchayatName() { return lgdGramPanchayatName; }
    public Integer getAdminZoneId() { return adminZoneId; }
    public String getAdminZoneName() { return adminZoneName; }
    public Integer getAdminCircleId() { return adminCircleId; }
    public String getAdminCircleName() { return adminCircleName; }
    public Integer getAdminDivisionId() { return adminDivisionId; }
    public String getAdminDivisionName() { return adminDivisionName; }
    public Integer getAdminSubDivisionId() { return adminSubDivisionId; }
    public String getAdminSubDivisionName() { return adminSubDivisionName; }
    public String getStatus() { return status; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
