package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.TenantEventDTO;
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

    /**
     * Create or update tenant from event data.
     */
    TenantResponseDTO upsertTenant(TenantEventDTO eventDTO);

    /**
     * Delete tenant by ID.
     * 
     * @return true if tenant was found and deleted, false if not found
     */
    boolean deleteTenantById(Integer tenantId);

    /**
     * Delete tenant by code.
     * 
     * @return true if tenant was found and deleted, false if not found
     */
    boolean deleteTenantByCode(String tenantCode);
}
