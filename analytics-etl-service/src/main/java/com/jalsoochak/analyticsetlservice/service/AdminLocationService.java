package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.AdminLocationResponseDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Admin Location operations
 */
public interface AdminLocationService {

    /**
     * Get all admin locations
     */
    List<AdminLocationResponseDTO> getAllLocations();

    /**
     * Get location by ID
     */
    Optional<AdminLocationResponseDTO> getLocationById(Integer id);

    /**
     * Get locations by tenant
     */
    List<AdminLocationResponseDTO> getLocationsByTenant(Integer tenantId);

    /**
     * Get locations by tenant and location type
     */
    List<AdminLocationResponseDTO> getLocationsByTenantAndType(Integer tenantId, String locationType);

    /**
     * Get locations by tenant and division
     */
    List<AdminLocationResponseDTO> getLocationsByDivision(Integer tenantId, Integer divisionId);
}
