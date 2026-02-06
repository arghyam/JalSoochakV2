package com.jalsoochak.analyticsetlservice.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Dimension table for geographic hierarchy
 */
@Entity
@Table(name = "dim_geo")
public class DimGeo {

    @Id
    @Column(name = "geo_id", columnDefinition = "UUID")
    private UUID geoId;

    @Column(name = "tenant_id", nullable = false, columnDefinition = "UUID")
    private UUID tenantId;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "geo_state_id", columnDefinition = "UUID")
    private UUID geoStateId;

    @Column(name = "geo_district_id", columnDefinition = "UUID")
    private UUID geoDistrictId;

    @Column(name = "geo_block_id", columnDefinition = "UUID")
    private UUID geoBlockId;

    @Column(name = "geo_gp_id", columnDefinition = "UUID")
    private UUID geoGpId;

    @Column(name = "geo_village_id", columnDefinition = "UUID")
    private UUID geoVillageId;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public DimGeo() {}

    public DimGeo(UUID geoId, UUID tenantId, String type, String name, UUID geoStateId,
                  UUID geoDistrictId, UUID geoBlockId, UUID geoGpId, UUID geoVillageId,
                  OffsetDateTime updatedAt) {
        this.geoId = geoId;
        this.tenantId = tenantId;
        this.type = type;
        this.name = name;
        this.geoStateId = geoStateId;
        this.geoDistrictId = geoDistrictId;
        this.geoBlockId = geoBlockId;
        this.geoGpId = geoGpId;
        this.geoVillageId = geoVillageId;
        this.updatedAt = updatedAt;
    }

    public UUID getGeoId() { return geoId; }
    public void setGeoId(UUID geoId) { this.geoId = geoId; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getGeoStateId() { return geoStateId; }
    public void setGeoStateId(UUID geoStateId) { this.geoStateId = geoStateId; }

    public UUID getGeoDistrictId() { return geoDistrictId; }
    public void setGeoDistrictId(UUID geoDistrictId) { this.geoDistrictId = geoDistrictId; }

    public UUID getGeoBlockId() { return geoBlockId; }
    public void setGeoBlockId(UUID geoBlockId) { this.geoBlockId = geoBlockId; }

    public UUID getGeoGpId() { return geoGpId; }
    public void setGeoGpId(UUID geoGpId) { this.geoGpId = geoGpId; }

    public UUID getGeoVillageId() { return geoVillageId; }
    public void setGeoVillageId(UUID geoVillageId) { this.geoVillageId = geoVillageId; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
