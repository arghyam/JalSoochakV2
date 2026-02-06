package com.jalsoochak.analyticsetlservice.controller;

import com.jalsoochak.analyticsetlservice.dto.DimGeoResponseDTO;
import com.jalsoochak.analyticsetlservice.service.GeoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for Geo operations
 */
@RestController
@RequestMapping("/api/geos")
public class GeoController {

    private final GeoService geoService;

    // Constructor for dependency injection
    public GeoController(GeoService geoService) {
        this.geoService = geoService;
    }

    /**
     * Get all geo records
     *
     * @return List of DimGeoResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<DimGeoResponseDTO>> getAllGeo() {
        List<DimGeoResponseDTO> geos = geoService.getAllGeo();
        return ResponseEntity.ok(geos);
    }
}
