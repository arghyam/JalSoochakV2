package com.jalsoochak.analyticsetlservice.dto;

import java.time.OffsetDateTime;

/**
 * Response DTO for DimLgdLocation
 */
public class LgdLocationResponseDTO {

    private Integer id;
    private Integer tenantId;
    private Integer sourceLgdId;
    private Integer parentId;
    private String title;
    private String lgdCode;
    private String locationType;
    private Integer lgdStateId;
    private String lgdStateName;
    private Integer lgdDistrictId;
    private String lgdDistrictName;
    private Integer lgdBlockId;
    private String lgdBlockName;
    private Integer lgdGramPanchayatId;
    private String lgdGramPanchayatName;
    private Integer householdCount;
    private Integer adminLocationId;
    private OffsetDateTime updatedAt;

    public LgdLocationResponseDTO() {}

    private LgdLocationResponseDTO(Builder builder) {
        this.id = builder.id;
        this.tenantId = builder.tenantId;
        this.sourceLgdId = builder.sourceLgdId;
        this.parentId = builder.parentId;
        this.title = builder.title;
        this.lgdCode = builder.lgdCode;
        this.locationType = builder.locationType;
        this.lgdStateId = builder.lgdStateId;
        this.lgdStateName = builder.lgdStateName;
        this.lgdDistrictId = builder.lgdDistrictId;
        this.lgdDistrictName = builder.lgdDistrictName;
        this.lgdBlockId = builder.lgdBlockId;
        this.lgdBlockName = builder.lgdBlockName;
        this.lgdGramPanchayatId = builder.lgdGramPanchayatId;
        this.lgdGramPanchayatName = builder.lgdGramPanchayatName;
        this.householdCount = builder.householdCount;
        this.adminLocationId = builder.adminLocationId;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer id;
        private Integer tenantId;
        private Integer sourceLgdId;
        private Integer parentId;
        private String title;
        private String lgdCode;
        private String locationType;
        private Integer lgdStateId;
        private String lgdStateName;
        private Integer lgdDistrictId;
        private String lgdDistrictName;
        private Integer lgdBlockId;
        private String lgdBlockName;
        private Integer lgdGramPanchayatId;
        private String lgdGramPanchayatName;
        private Integer householdCount;
        private Integer adminLocationId;
        private OffsetDateTime updatedAt;

        public Builder id(Integer id) { this.id = id; return this; }
        public Builder tenantId(Integer tenantId) { this.tenantId = tenantId; return this; }
        public Builder sourceLgdId(Integer sourceLgdId) { this.sourceLgdId = sourceLgdId; return this; }
        public Builder parentId(Integer parentId) { this.parentId = parentId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder lgdCode(String lgdCode) { this.lgdCode = lgdCode; return this; }
        public Builder locationType(String locationType) { this.locationType = locationType; return this; }
        public Builder lgdStateId(Integer lgdStateId) { this.lgdStateId = lgdStateId; return this; }
        public Builder lgdStateName(String lgdStateName) { this.lgdStateName = lgdStateName; return this; }
        public Builder lgdDistrictId(Integer lgdDistrictId) { this.lgdDistrictId = lgdDistrictId; return this; }
        public Builder lgdDistrictName(String lgdDistrictName) { this.lgdDistrictName = lgdDistrictName; return this; }
        public Builder lgdBlockId(Integer lgdBlockId) { this.lgdBlockId = lgdBlockId; return this; }
        public Builder lgdBlockName(String lgdBlockName) { this.lgdBlockName = lgdBlockName; return this; }
        public Builder lgdGramPanchayatId(Integer lgdGramPanchayatId) { this.lgdGramPanchayatId = lgdGramPanchayatId; return this; }
        public Builder lgdGramPanchayatName(String lgdGramPanchayatName) { this.lgdGramPanchayatName = lgdGramPanchayatName; return this; }
        public Builder householdCount(Integer householdCount) { this.householdCount = householdCount; return this; }
        public Builder adminLocationId(Integer adminLocationId) { this.adminLocationId = adminLocationId; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public LgdLocationResponseDTO build() { return new LgdLocationResponseDTO(this); }
    }

    // Getters
    public Integer getId() { return id; }
    public Integer getTenantId() { return tenantId; }
    public Integer getSourceLgdId() { return sourceLgdId; }
    public Integer getParentId() { return parentId; }
    public String getTitle() { return title; }
    public String getLgdCode() { return lgdCode; }
    public String getLocationType() { return locationType; }
    public Integer getLgdStateId() { return lgdStateId; }
    public String getLgdStateName() { return lgdStateName; }
    public Integer getLgdDistrictId() { return lgdDistrictId; }
    public String getLgdDistrictName() { return lgdDistrictName; }
    public Integer getLgdBlockId() { return lgdBlockId; }
    public String getLgdBlockName() { return lgdBlockName; }
    public Integer getLgdGramPanchayatId() { return lgdGramPanchayatId; }
    public String getLgdGramPanchayatName() { return lgdGramPanchayatName; }
    public Integer getHouseholdCount() { return householdCount; }
    public Integer getAdminLocationId() { return adminLocationId; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
