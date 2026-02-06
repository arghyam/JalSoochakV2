package com.jalsoochak.analyticsetlservice.dto;

import java.time.OffsetDateTime;

/**
 * Response DTO for DimAdminLocation
 */
public class AdminLocationResponseDTO {

    private Integer id;
    private Integer tenantId;
    private Integer sourceAdminId;
    private String title;
    private String locationType;
    private Integer adminZoneId;
    private String adminZoneName;
    private Integer adminCircleId;
    private String adminCircleName;
    private Integer adminDivisionId;
    private String adminDivisionName;
    private Integer adminSubDivisionId;
    private String adminSubDivisionName;
    private OffsetDateTime updatedAt;

    public AdminLocationResponseDTO() {}

    private AdminLocationResponseDTO(Builder builder) {
        this.id = builder.id;
        this.tenantId = builder.tenantId;
        this.sourceAdminId = builder.sourceAdminId;
        this.title = builder.title;
        this.locationType = builder.locationType;
        this.adminZoneId = builder.adminZoneId;
        this.adminZoneName = builder.adminZoneName;
        this.adminCircleId = builder.adminCircleId;
        this.adminCircleName = builder.adminCircleName;
        this.adminDivisionId = builder.adminDivisionId;
        this.adminDivisionName = builder.adminDivisionName;
        this.adminSubDivisionId = builder.adminSubDivisionId;
        this.adminSubDivisionName = builder.adminSubDivisionName;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer id;
        private Integer tenantId;
        private Integer sourceAdminId;
        private String title;
        private String locationType;
        private Integer adminZoneId;
        private String adminZoneName;
        private Integer adminCircleId;
        private String adminCircleName;
        private Integer adminDivisionId;
        private String adminDivisionName;
        private Integer adminSubDivisionId;
        private String adminSubDivisionName;
        private OffsetDateTime updatedAt;

        public Builder id(Integer id) { this.id = id; return this; }
        public Builder tenantId(Integer tenantId) { this.tenantId = tenantId; return this; }
        public Builder sourceAdminId(Integer sourceAdminId) { this.sourceAdminId = sourceAdminId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder locationType(String locationType) { this.locationType = locationType; return this; }
        public Builder adminZoneId(Integer adminZoneId) { this.adminZoneId = adminZoneId; return this; }
        public Builder adminZoneName(String adminZoneName) { this.adminZoneName = adminZoneName; return this; }
        public Builder adminCircleId(Integer adminCircleId) { this.adminCircleId = adminCircleId; return this; }
        public Builder adminCircleName(String adminCircleName) { this.adminCircleName = adminCircleName; return this; }
        public Builder adminDivisionId(Integer adminDivisionId) { this.adminDivisionId = adminDivisionId; return this; }
        public Builder adminDivisionName(String adminDivisionName) { this.adminDivisionName = adminDivisionName; return this; }
        public Builder adminSubDivisionId(Integer adminSubDivisionId) { this.adminSubDivisionId = adminSubDivisionId; return this; }
        public Builder adminSubDivisionName(String adminSubDivisionName) { this.adminSubDivisionName = adminSubDivisionName; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public AdminLocationResponseDTO build() { return new AdminLocationResponseDTO(this); }
    }

    // Getters
    public Integer getId() { return id; }
    public Integer getTenantId() { return tenantId; }
    public Integer getSourceAdminId() { return sourceAdminId; }
    public String getTitle() { return title; }
    public String getLocationType() { return locationType; }
    public Integer getAdminZoneId() { return adminZoneId; }
    public String getAdminZoneName() { return adminZoneName; }
    public Integer getAdminCircleId() { return adminCircleId; }
    public String getAdminCircleName() { return adminCircleName; }
    public Integer getAdminDivisionId() { return adminDivisionId; }
    public String getAdminDivisionName() { return adminDivisionName; }
    public Integer getAdminSubDivisionId() { return adminSubDivisionId; }
    public String getAdminSubDivisionName() { return adminSubDivisionName; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
