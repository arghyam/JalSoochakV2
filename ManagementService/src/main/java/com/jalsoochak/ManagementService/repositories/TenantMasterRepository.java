package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.TenantMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantMasterRepository extends JpaRepository<TenantMaster, Long> {
    Optional<TenantMaster> findByTenantCode(String tenantCode);
    Optional<TenantMaster> findByTenantName(String tenantName);
}
