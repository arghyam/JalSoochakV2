package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.LgdLocationResponseDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for LGD Location operations
 */
public interface LgdLocationService {

    /**
     * Get all LGD locations
     */
    List<LgdLocationResponseDTO> getAllLocations();

    /**
     * Get location by ID
     */
    Optional<LgdLocationResponseDTO> getLocationById(Integer id);

    /**
     * Get locations by tenant
     */
    List<LgdLocationResponseDTO> getLocationsByTenant(Integer tenantId);

    /**
     * Get locations by tenant and location type
     */
    List<LgdLocationResponseDTO> getLocationsByTenantAndType(Integer tenantId, String locationType);

    /**
     * Get child locations by parent ID (for drilldown)
     */
    List<LgdLocationResponseDTO> getChildLocations(Integer tenantId, Integer parentId);

    /**
     * Get locations by tenant and district
     */
    List<LgdLocationResponseDTO> getLocationsByDistrict(Integer tenantId, Integer districtId);
}
