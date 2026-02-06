package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.SchemeResponseDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Scheme operations
 */
public interface SchemeService {

    /**
     * Get all schemes
     */
    List<SchemeResponseDTO> getAllSchemes();

    /**
     * Get scheme by ID
     */
    Optional<SchemeResponseDTO> getSchemeById(Integer id);

    /**
     * Get schemes by tenant
     */
    List<SchemeResponseDTO> getSchemesByTenant(Integer tenantId);

    /**
     * Get active schemes by tenant
     */
    List<SchemeResponseDTO> getActiveSchemesByTenant(Integer tenantId);

    /**
     * Get schemes by tenant and district
     */
    List<SchemeResponseDTO> getSchemesByDistrict(Integer tenantId, Integer districtId);

    /**
     * Get schemes by tenant and village
     */
    List<SchemeResponseDTO> getSchemesByVillage(Integer tenantId, Integer villageId);

    /**
     * Get schemes by tenant and admin division
     */
    List<SchemeResponseDTO> getSchemesByAdminDivision(Integer tenantId, Integer divisionId);
}
