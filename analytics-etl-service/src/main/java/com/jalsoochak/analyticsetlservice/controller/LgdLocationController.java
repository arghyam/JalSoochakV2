package com.jalsoochak.analyticsetlservice.controller;

import com.jalsoochak.analyticsetlservice.dto.LgdLocationResponseDTO;
import com.jalsoochak.analyticsetlservice.service.LgdLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for LGD Location operations
 */
@RestController
@RequestMapping("/api/lgd-locations")
public class LgdLocationController {

    private final LgdLocationService lgdLocationService;

    public LgdLocationController(LgdLocationService lgdLocationService) {
        this.lgdLocationService = lgdLocationService;
    }

    /**
     * Get all LGD locations
     */
    @GetMapping
    public ResponseEntity<List<LgdLocationResponseDTO>> getAllLocations() {
        return ResponseEntity.ok(lgdLocationService.getAllLocations());
    }

    /**
     * Get location by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<LgdLocationResponseDTO> getLocationById(@PathVariable Integer id) {
        return lgdLocationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get locations by tenant
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<LgdLocationResponseDTO>> getLocationsByTenant(@PathVariable Integer tenantId) {
        return ResponseEntity.ok(lgdLocationService.getLocationsByTenant(tenantId));
    }

    /**
     * Get locations by tenant and type
     */
    @GetMapping("/tenant/{tenantId}/type/{locationType}")
    public ResponseEntity<List<LgdLocationResponseDTO>> getLocationsByTenantAndType(
            @PathVariable Integer tenantId,
            @PathVariable String locationType) {
        return ResponseEntity.ok(lgdLocationService.getLocationsByTenantAndType(tenantId, locationType));
    }

    /**
     * Get child locations for drilldown (by parent ID)
     */
    @GetMapping("/tenant/{tenantId}/children/{parentId}")
    public ResponseEntity<List<LgdLocationResponseDTO>> getChildLocations(
            @PathVariable Integer tenantId,
            @PathVariable Integer parentId) {
        return ResponseEntity.ok(lgdLocationService.getChildLocations(tenantId, parentId));
    }

    /**
     * Get locations by tenant and district
     */
    @GetMapping("/tenant/{tenantId}/district/{districtId}")
    public ResponseEntity<List<LgdLocationResponseDTO>> getLocationsByDistrict(
            @PathVariable Integer tenantId,
            @PathVariable Integer districtId) {
        return ResponseEntity.ok(lgdLocationService.getLocationsByDistrict(tenantId, districtId));
    }
}
