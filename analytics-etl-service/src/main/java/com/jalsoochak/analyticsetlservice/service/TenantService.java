package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.TenantResponseDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Tenant operations
 */
public interface TenantService {

    /**
     * Get all tenants
     */
    List<TenantResponseDTO> getAllTenants();

    /**
     * Get all active tenants
     */
    List<TenantResponseDTO> getActiveTenants();

    /**
     * Get tenant by ID
     */
    Optional<TenantResponseDTO> getTenantById(Integer tenantId);

    /**
     * Get tenant by code
     */
    Optional<TenantResponseDTO> getTenantByCode(String tenantCode);
}
