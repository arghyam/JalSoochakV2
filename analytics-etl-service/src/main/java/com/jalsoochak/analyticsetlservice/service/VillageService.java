package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.VillageResponseDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Village operations
 */
public interface VillageService {

    /**
     * Get all villages
     */
    List<VillageResponseDTO> getAllVillages();

    /**
     * Get village by ID
     */
    Optional<VillageResponseDTO> getVillageById(Integer id);

    /**
     * Get villages by tenant
     */
    List<VillageResponseDTO> getVillagesByTenant(Integer tenantId);

    /**
     * Get villages by tenant and LGD location
     */
    List<VillageResponseDTO> getVillagesByLgdLocation(Integer tenantId, Integer lgdLocationId);

    /**
     * Get villages by tenant and admin location
     */
    List<VillageResponseDTO> getVillagesByAdminLocation(Integer tenantId, Integer adminLocationId);
}
