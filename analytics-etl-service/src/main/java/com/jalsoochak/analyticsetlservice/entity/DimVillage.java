package com.jalsoochak.analyticsetlservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

/**
 * Dimension table for service/operational village
 * Acts as a bridge dimension linking LGD geography, administrative jurisdiction, and service analytics
 */
@Entity
@Table(name = "dim_village", schema = "warehouse")
public class DimVillage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "tenant_id", nullable = false)
    private Integer tenantId;

    @Column(name = "source_village_id", nullable = false)
    private Integer sourceVillageId;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "lgd_code", length = 50)
    private String lgdCode;

    @Column(name = "household_count")
    private Integer householdCount;

    @Column(name = "lgd_location_id")
    private Integer lgdLocationId;

    @Column(name = "admin_location_id")
    private Integer adminLocationId;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Default constructor
    public DimVillage() {}

    // All-args constructor
    public DimVillage(Integer id, Integer tenantId, Integer sourceVillageId, String title,
                      String lgdCode, Integer householdCount, Integer lgdLocationId,
                      Integer adminLocationId, OffsetDateTime updatedAt) {
        this.id = id;
        this.tenantId = tenantId;
        this.sourceVillageId = sourceVillageId;
        this.title = title;
        this.lgdCode = lgdCode;
        this.householdCount = householdCount;
        this.lgdLocationId = lgdLocationId;
        this.adminLocationId = adminLocationId;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTenantId() { return tenantId; }
    public void setTenantId(Integer tenantId) { this.tenantId = tenantId; }

    public Integer getSourceVillageId() { return sourceVillageId; }
    public void setSourceVillageId(Integer sourceVillageId) { this.sourceVillageId = sourceVillageId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLgdCode() { return lgdCode; }
    public void setLgdCode(String lgdCode) { this.lgdCode = lgdCode; }

    public Integer getHouseholdCount() { return householdCount; }
    public void setHouseholdCount(Integer householdCount) { this.householdCount = householdCount; }

    public Integer getLgdLocationId() { return lgdLocationId; }
    public void setLgdLocationId(Integer lgdLocationId) { this.lgdLocationId = lgdLocationId; }

    public Integer getAdminLocationId() { return adminLocationId; }
    public void setAdminLocationId(Integer adminLocationId) { this.adminLocationId = adminLocationId; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
