package com.jalsoochak.analyticsetlservice.service;

import com.jalsoochak.analyticsetlservice.dto.DimGeoResponseDTO;

import java.util.List;

/**
 * Service interface for Geo operations
 */
public interface GeoService {

    /**
     * Get all geo records
     *
     * @return List of DimGeoResponseDTO
     */
    List<DimGeoResponseDTO> getAllGeo();
}
