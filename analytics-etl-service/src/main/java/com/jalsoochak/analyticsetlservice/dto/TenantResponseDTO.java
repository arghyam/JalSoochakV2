package com.jalsoochak.analyticsetlservice.dto;

import java.time.OffsetDateTime;

/**
 * Response DTO for DimTenant
 */
public class TenantResponseDTO {

    private Integer tenantId;
    private String tenantCode;
    private String tenantName;
    private String countryCode;
    private String config;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public TenantResponseDTO() {}

    private TenantResponseDTO(Builder builder) {
        this.tenantId = builder.tenantId;
        this.tenantCode = builder.tenantCode;
        this.tenantName = builder.tenantName;
        this.countryCode = builder.countryCode;
        this.config = builder.config;
        this.isActive = builder.isActive;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer tenantId;
        private String tenantCode;
        private String tenantName;
        private String countryCode;
        private String config;
        private Boolean isActive;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public Builder tenantId(Integer tenantId) { this.tenantId = tenantId; return this; }
        public Builder tenantCode(String tenantCode) { this.tenantCode = tenantCode; return this; }
        public Builder tenantName(String tenantName) { this.tenantName = tenantName; return this; }
        public Builder countryCode(String countryCode) { this.countryCode = countryCode; return this; }
        public Builder config(String config) { this.config = config; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public TenantResponseDTO build() { return new TenantResponseDTO(this); }
    }

    // Getters
    public Integer getTenantId() { return tenantId; }
    public String getTenantCode() { return tenantCode; }
    public String getTenantName() { return tenantName; }
    public String getCountryCode() { return countryCode; }
    public String getConfig() { return config; }
    public Boolean getIsActive() { return isActive; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
