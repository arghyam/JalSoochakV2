package com.jalsoochak.analyticsetlservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for Tenant events received from Kafka
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TenantEventDTO {

    @JsonProperty("event_type")
    private String eventType;

    @JsonProperty("tenant_id")
    private Integer tenantId;

    @JsonProperty("tenant_code")
    private String tenantCode;

    @JsonProperty("tenant_name")
    private String tenantName;

    @JsonProperty("country_code")
    private String countryCode;

    @JsonProperty("config")
    private String config;

    @JsonProperty("is_active")
    private Boolean isActive;

    public TenantEventDTO() {}

    public TenantEventDTO(String tenantCode, String tenantName, String countryCode, 
                          String config, Boolean isActive) {
        this.tenantCode = tenantCode;
        this.tenantName = tenantName;
        this.countryCode = countryCode;
        this.config = config;
        this.isActive = isActive;
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Integer getTenantId() { return tenantId; }
    public void setTenantId(Integer tenantId) { this.tenantId = tenantId; }

    public String getTenantCode() { return tenantCode; }
    public void setTenantCode(String tenantCode) { this.tenantCode = tenantCode; }

    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getConfig() { return config; }
    public void setConfig(String config) { this.config = config; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    @Override
    public String toString() {
        return "TenantEventDTO{" +
                "eventType='" + eventType + '\'' +
                ", tenantId=" + tenantId +
                ", tenantCode='" + tenantCode + '\'' +
                ", tenantName='" + tenantName + '\'' +
                ", countryCode='" + countryCode + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
