package com.jalsoochak.analyticsetlservice.repository;

import com.jalsoochak.analyticsetlservice.entity.DimScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for DimScheme entity
 */
@Repository
public interface DimSchemeRepository extends JpaRepository<DimScheme, Integer> {

    /**
     * Find all schemes by tenant
     */
    List<DimScheme> findByTenantId(Integer tenantId);

    /**
     * Find schemes by tenant and status
     */
    List<DimScheme> findByTenantIdAndStatus(Integer tenantId, String status);

    /**
     * Find schemes by tenant and district
     */
    List<DimScheme> findByTenantIdAndLgdDistrictId(Integer tenantId, Integer lgdDistrictId);

    /**
     * Find schemes by tenant and village
     */
    List<DimScheme> findByTenantIdAndVillageId(Integer tenantId, Integer villageId);

    /**
     * Find schemes by tenant and admin division
     */
    List<DimScheme> findByTenantIdAndAdminDivisionId(Integer tenantId, Integer adminDivisionId);
}
