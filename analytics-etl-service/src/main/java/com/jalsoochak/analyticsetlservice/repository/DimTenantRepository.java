package com.jalsoochak.analyticsetlservice.repository;

import com.jalsoochak.analyticsetlservice.entity.DimTenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for DimTenant entity
 */
@Repository
public interface DimTenantRepository extends JpaRepository<DimTenant, Integer> {

    /**
     * Find tenant by tenant code
     */
    Optional<DimTenant> findByTenantCode(String tenantCode);

    /**
     * Find all active tenants
     */
    List<DimTenant> findByIsActiveTrue();
}
