package com.jalsoochak.analyticsetlservice.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Dimension table for LGD geographic hierarchy
 * Hierarchy: STATE → DISTRICT → BLOCK → GRAM_PANCHAYAT → VILLAGE
 */
@Entity
@Table(name = "dim_lgd_location", schema = "warehouse")
public class DimLgdLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "tenant_id", nullable = false)
    private Integer tenantId;

    @Column(name = "source_lgd_id", nullable = false)
    private Integer sourceLgdId;

    @Column(name = "parent_id")
    private Integer parentId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "lgd_code", length = 50)
    private String lgdCode;

    @Column(name = "location_type", nullable = false, length = 50)
    private String locationType;

    @Column(name = "lgd_state_id")
    private Integer lgdStateId;

    @Column(name = "lgd_state_name", length = 255)
    private String lgdStateName;

    @Column(name = "lgd_district_id")
    private Integer lgdDistrictId;

    @Column(name = "lgd_district_name", length = 255)
    private String lgdDistrictName;

    @Column(name = "lgd_block_id")
    private Integer lgdBlockId;

    @Column(name = "lgd_block_name", length = 255)
    private String lgdBlockName;

    @Column(name = "lgd_gram_panchayat_id")
    private Integer lgdGramPanchayatId;

    @Column(name = "lgd_gram_panchayat_name", length = 255)
    private String lgdGramPanchayatName;

    @Column(name = "household_count")
    private Integer householdCount;

    @Column(name = "admin_location_id")
    private Integer adminLocationId;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public DimLgdLocation() {}

    public DimLgdLocation(Integer id, Integer tenantId, Integer sourceLgdId, Integer parentId,
                          String title, String lgdCode, String locationType, Integer lgdStateId,
                          String lgdStateName, Integer lgdDistrictId, String lgdDistrictName,
                          Integer lgdBlockId, String lgdBlockName, Integer lgdGramPanchayatId,
                          String lgdGramPanchayatName, Integer householdCount,
                          Integer adminLocationId, OffsetDateTime updatedAt) {
        this.id = id;
        this.tenantId = tenantId;
        this.sourceLgdId = sourceLgdId;
        this.parentId = parentId;
        this.title = title;
        this.lgdCode = lgdCode;
        this.locationType = locationType;
        this.lgdStateId = lgdStateId;
        this.lgdStateName = lgdStateName;
        this.lgdDistrictId = lgdDistrictId;
        this.lgdDistrictName = lgdDistrictName;
        this.lgdBlockId = lgdBlockId;
        this.lgdBlockName = lgdBlockName;
        this.lgdGramPanchayatId = lgdGramPanchayatId;
        this.lgdGramPanchayatName = lgdGramPanchayatName;
        this.householdCount = householdCount;
        this.adminLocationId = adminLocationId;
        this.updatedAt = updatedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTenantId() { return tenantId; }
    public void setTenantId(Integer tenantId) { this.tenantId = tenantId; }

    public Integer getSourceLgdId() { return sourceLgdId; }
    public void setSourceLgdId(Integer sourceLgdId) { this.sourceLgdId = sourceLgdId; }

    public Integer getParentId() { return parentId; }
    public void setParentId(Integer parentId) { this.parentId = parentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLgdCode() { return lgdCode; }
    public void setLgdCode(String lgdCode) { this.lgdCode = lgdCode; }

    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }

    public Integer getLgdStateId() { return lgdStateId; }
    public void setLgdStateId(Integer lgdStateId) { this.lgdStateId = lgdStateId; }

    public String getLgdStateName() { return lgdStateName; }
    public void setLgdStateName(String lgdStateName) { this.lgdStateName = lgdStateName; }

    public Integer getLgdDistrictId() { return lgdDistrictId; }
    public void setLgdDistrictId(Integer lgdDistrictId) { this.lgdDistrictId = lgdDistrictId; }

    public String getLgdDistrictName() { return lgdDistrictName; }
    public void setLgdDistrictName(String lgdDistrictName) { this.lgdDistrictName = lgdDistrictName; }

    public Integer getLgdBlockId() { return lgdBlockId; }
    public void setLgdBlockId(Integer lgdBlockId) { this.lgdBlockId = lgdBlockId; }

    public String getLgdBlockName() { return lgdBlockName; }
    public void setLgdBlockName(String lgdBlockName) { this.lgdBlockName = lgdBlockName; }

    public Integer getLgdGramPanchayatId() { return lgdGramPanchayatId; }
    public void setLgdGramPanchayatId(Integer lgdGramPanchayatId) { this.lgdGramPanchayatId = lgdGramPanchayatId; }

    public String getLgdGramPanchayatName() { return lgdGramPanchayatName; }
    public void setLgdGramPanchayatName(String lgdGramPanchayatName) { this.lgdGramPanchayatName = lgdGramPanchayatName; }

    public Integer getHouseholdCount() { return householdCount; }
    public void setHouseholdCount(Integer householdCount) { this.householdCount = householdCount; }

    public Integer getAdminLocationId() { return adminLocationId; }
    public void setAdminLocationId(Integer adminLocationId) { this.adminLocationId = adminLocationId; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
