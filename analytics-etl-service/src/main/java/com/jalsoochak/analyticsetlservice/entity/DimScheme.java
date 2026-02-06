package com.jalsoochak.analyticsetlservice.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Dimension table for scheme with denormalized hierarchies
 */
@Entity
@Table(name = "dim_scheme", schema = "warehouse")
public class DimScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "tenant_id", nullable = false)
    private Integer tenantId;

    @Column(name = "source_scheme_id", nullable = false)
    private Integer sourceSchemeId;

    @Column(name = "scheme_name", length = 255)
    private String schemeName;

    @Column(name = "state_scheme_id")
    private Integer stateSchemeId;

    @Column(name = "centre_scheme_id")
    private Integer centreSchemeId;

    @Column(name = "fhtc_count")
    private Integer fhtcCount;

    @Column(name = "planned_fhtc")
    private Integer plannedFhtc;

    @Column(name = "house_hold_count")
    private Integer houseHoldCount;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "village_id")
    private Integer villageId;

    @Column(name = "village_name", length = 255)
    private String villageName;

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

    @Column(name = "admin_zone_id")
    private Integer adminZoneId;

    @Column(name = "admin_zone_name", length = 255)
    private String adminZoneName;

    @Column(name = "admin_circle_id")
    private Integer adminCircleId;

    @Column(name = "admin_circle_name", length = 255)
    private String adminCircleName;

    @Column(name = "admin_division_id")
    private Integer adminDivisionId;

    @Column(name = "admin_division_name", length = 255)
    private String adminDivisionName;

    @Column(name = "admin_sub_division_id")
    private Integer adminSubDivisionId;

    @Column(name = "admin_sub_division_name", length = 255)
    private String adminSubDivisionName;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public DimScheme() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTenantId() { return tenantId; }
    public void setTenantId(Integer tenantId) { this.tenantId = tenantId; }

    public Integer getSourceSchemeId() { return sourceSchemeId; }
    public void setSourceSchemeId(Integer sourceSchemeId) { this.sourceSchemeId = sourceSchemeId; }

    public String getSchemeName() { return schemeName; }
    public void setSchemeName(String schemeName) { this.schemeName = schemeName; }

    public Integer getStateSchemeId() { return stateSchemeId; }
    public void setStateSchemeId(Integer stateSchemeId) { this.stateSchemeId = stateSchemeId; }

    public Integer getCentreSchemeId() { return centreSchemeId; }
    public void setCentreSchemeId(Integer centreSchemeId) { this.centreSchemeId = centreSchemeId; }

    public Integer getFhtcCount() { return fhtcCount; }
    public void setFhtcCount(Integer fhtcCount) { this.fhtcCount = fhtcCount; }

    public Integer getPlannedFhtc() { return plannedFhtc; }
    public void setPlannedFhtc(Integer plannedFhtc) { this.plannedFhtc = plannedFhtc; }

    public Integer getHouseHoldCount() { return houseHoldCount; }
    public void setHouseHoldCount(Integer houseHoldCount) { this.houseHoldCount = houseHoldCount; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getVillageId() { return villageId; }
    public void setVillageId(Integer villageId) { this.villageId = villageId; }

    public String getVillageName() { return villageName; }
    public void setVillageName(String villageName) { this.villageName = villageName; }

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

    public Integer getAdminZoneId() { return adminZoneId; }
    public void setAdminZoneId(Integer adminZoneId) { this.adminZoneId = adminZoneId; }

    public String getAdminZoneName() { return adminZoneName; }
    public void setAdminZoneName(String adminZoneName) { this.adminZoneName = adminZoneName; }

    public Integer getAdminCircleId() { return adminCircleId; }
    public void setAdminCircleId(Integer adminCircleId) { this.adminCircleId = adminCircleId; }

    public String getAdminCircleName() { return adminCircleName; }
    public void setAdminCircleName(String adminCircleName) { this.adminCircleName = adminCircleName; }

    public Integer getAdminDivisionId() { return adminDivisionId; }
    public void setAdminDivisionId(Integer adminDivisionId) { this.adminDivisionId = adminDivisionId; }

    public String getAdminDivisionName() { return adminDivisionName; }
    public void setAdminDivisionName(String adminDivisionName) { this.adminDivisionName = adminDivisionName; }

    public Integer getAdminSubDivisionId() { return adminSubDivisionId; }
    public void setAdminSubDivisionId(Integer adminSubDivisionId) { this.adminSubDivisionId = adminSubDivisionId; }

    public String getAdminSubDivisionName() { return adminSubDivisionName; }
    public void setAdminSubDivisionName(String adminSubDivisionName) { this.adminSubDivisionName = adminSubDivisionName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
