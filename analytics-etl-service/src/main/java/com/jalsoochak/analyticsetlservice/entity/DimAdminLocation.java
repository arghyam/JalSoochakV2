package com.jalsoochak.analyticsetlservice.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Dimension table for administrative jurisdiction hierarchy
 * Hierarchy: ZONE → CIRCLE → DIVISION → SUB_DIVISION
 */
@Entity
@Table(name = "dim_admin_location", schema = "warehouse")
public class DimAdminLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "tenant_id", nullable = false)
    private Integer tenantId;

    @Column(name = "source_admin_id", nullable = false)
    private Integer sourceAdminId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "location_type", nullable = false, length = 50)
    private String locationType;

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

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public DimAdminLocation() {}

    public DimAdminLocation(Integer id, Integer tenantId, Integer sourceAdminId, String title,
                            String locationType, Integer adminZoneId, String adminZoneName,
                            Integer adminCircleId, String adminCircleName, Integer adminDivisionId,
                            String adminDivisionName, Integer adminSubDivisionId,
                            String adminSubDivisionName, OffsetDateTime updatedAt) {
        this.id = id;
        this.tenantId = tenantId;
        this.sourceAdminId = sourceAdminId;
        this.title = title;
        this.locationType = locationType;
        this.adminZoneId = adminZoneId;
        this.adminZoneName = adminZoneName;
        this.adminCircleId = adminCircleId;
        this.adminCircleName = adminCircleName;
        this.adminDivisionId = adminDivisionId;
        this.adminDivisionName = adminDivisionName;
        this.adminSubDivisionId = adminSubDivisionId;
        this.adminSubDivisionName = adminSubDivisionName;
        this.updatedAt = updatedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTenantId() { return tenantId; }
    public void setTenantId(Integer tenantId) { this.tenantId = tenantId; }

    public Integer getSourceAdminId() { return sourceAdminId; }
    public void setSourceAdminId(Integer sourceAdminId) { this.sourceAdminId = sourceAdminId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }

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

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
