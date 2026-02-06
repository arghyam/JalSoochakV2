package com.jalsoochak.analyticsetlservice.repository;

import com.jalsoochak.analyticsetlservice.entity.DimVillage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for DimVillage entity
 */
@Repository
public interface DimVillageRepository extends JpaRepository<DimVillage, Integer> {

    /**
     * Find all villages by tenant
     */
    List<DimVillage> findByTenantId(Integer tenantId);

    /**
     * Find villages by tenant and LGD location
     */
    List<DimVillage> findByTenantIdAndLgdLocationId(Integer tenantId, Integer lgdLocationId);

    /**
     * Find villages by tenant and admin location
     */
    List<DimVillage> findByTenantIdAndAdminLocationId(Integer tenantId, Integer adminLocationId);
}
