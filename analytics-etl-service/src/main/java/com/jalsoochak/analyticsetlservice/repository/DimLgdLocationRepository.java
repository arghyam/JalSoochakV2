package com.jalsoochak.analyticsetlservice.repository;

import com.jalsoochak.analyticsetlservice.entity.DimLgdLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for DimLgdLocation entity
 */
@Repository
public interface DimLgdLocationRepository extends JpaRepository<DimLgdLocation, Integer> {

    /**
     * Find all locations by tenant
     */
    List<DimLgdLocation> findByTenantId(Integer tenantId);

    /**
     * Find locations by tenant and location type
     */
    List<DimLgdLocation> findByTenantIdAndLocationType(Integer tenantId, String locationType);

    /**
     * Find child locations by parent ID
     */
    List<DimLgdLocation> findByTenantIdAndParentId(Integer tenantId, Integer parentId);

    /**
     * Find locations by tenant and district
     */
    List<DimLgdLocation> findByTenantIdAndLgdDistrictId(Integer tenantId, Integer lgdDistrictId);

    /**
     * Find locations by tenant and block
     */
    List<DimLgdLocation> findByTenantIdAndLgdBlockId(Integer tenantId, Integer lgdBlockId);
}
