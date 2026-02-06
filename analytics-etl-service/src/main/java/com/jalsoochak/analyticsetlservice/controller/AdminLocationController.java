package com.jalsoochak.analyticsetlservice.controller;

import com.jalsoochak.analyticsetlservice.dto.AdminLocationResponseDTO;
import com.jalsoochak.analyticsetlservice.service.AdminLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Admin Location operations
 */
@RestController
@RequestMapping("/api/admin-locations")
public class AdminLocationController {

    private final AdminLocationService adminLocationService;

    public AdminLocationController(AdminLocationService adminLocationService) {
        this.adminLocationService = adminLocationService;
    }

    /**
     * Get all admin locations
     */
    @GetMapping
    public ResponseEntity<List<AdminLocationResponseDTO>> getAllLocations() {
        return ResponseEntity.ok(adminLocationService.getAllLocations());
    }

    /**
     * Get location by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminLocationResponseDTO> getLocationById(@PathVariable Integer id) {
        return adminLocationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get locations by tenant
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<AdminLocationResponseDTO>> getLocationsByTenant(@PathVariable Integer tenantId) {
        return ResponseEntity.ok(adminLocationService.getLocationsByTenant(tenantId));
    }

    /**
     * Get locations by tenant and type
     */
    @GetMapping("/tenant/{tenantId}/type/{locationType}")
    public ResponseEntity<List<AdminLocationResponseDTO>> getLocationsByTenantAndType(
            @PathVariable Integer tenantId,
            @PathVariable String locationType) {
        return ResponseEntity.ok(adminLocationService.getLocationsByTenantAndType(tenantId, locationType));
    }

    /**
     * Get locations by tenant and division
     */
    @GetMapping("/tenant/{tenantId}/division/{divisionId}")
    public ResponseEntity<List<AdminLocationResponseDTO>> getLocationsByDivision(
            @PathVariable Integer tenantId,
            @PathVariable Integer divisionId) {
        return ResponseEntity.ok(adminLocationService.getLocationsByDivision(tenantId, divisionId));
    }
}
