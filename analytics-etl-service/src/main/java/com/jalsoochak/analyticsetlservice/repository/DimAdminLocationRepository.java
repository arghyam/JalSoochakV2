package com.jalsoochak.analyticsetlservice.repository;

import com.jalsoochak.analyticsetlservice.entity.DimAdminLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for DimAdminLocation entity
 */
@Repository
public interface DimAdminLocationRepository extends JpaRepository<DimAdminLocation, Integer> {

    /**
     * Find all locations by tenant
     */
    List<DimAdminLocation> findByTenantId(Integer tenantId);

    /**
     * Find locations by tenant and location type
     */
    List<DimAdminLocation> findByTenantIdAndLocationType(Integer tenantId, String locationType);

    /**
     * Find locations by tenant and division
     */
    List<DimAdminLocation> findByTenantIdAndAdminDivisionId(Integer tenantId, Integer adminDivisionId);
}
