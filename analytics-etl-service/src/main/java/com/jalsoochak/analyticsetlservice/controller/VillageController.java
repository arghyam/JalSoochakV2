package com.jalsoochak.analyticsetlservice.controller;

import com.jalsoochak.analyticsetlservice.dto.VillageResponseDTO;
import com.jalsoochak.analyticsetlservice.service.VillageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Village operations
 */
@RestController
@RequestMapping("/api/villages")
public class VillageController {

    private final VillageService villageService;

    public VillageController(VillageService villageService) {
        this.villageService = villageService;
    }

    /**
     * Get all villages
     */
    @GetMapping
    public ResponseEntity<List<VillageResponseDTO>> getAllVillages() {
        return ResponseEntity.ok(villageService.getAllVillages());
    }

    /**
     * Get village by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VillageResponseDTO> getVillageById(@PathVariable Integer id) {
        return villageService.getVillageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get villages by tenant
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<VillageResponseDTO>> getVillagesByTenant(@PathVariable Integer tenantId) {
        return ResponseEntity.ok(villageService.getVillagesByTenant(tenantId));
    }

    /**
     * Get villages by tenant and LGD location
     */
    @GetMapping("/tenant/{tenantId}/lgd-location/{lgdLocationId}")
    public ResponseEntity<List<VillageResponseDTO>> getVillagesByLgdLocation(
            @PathVariable Integer tenantId,
            @PathVariable Integer lgdLocationId) {
        return ResponseEntity.ok(villageService.getVillagesByLgdLocation(tenantId, lgdLocationId));
    }

    /**
     * Get villages by tenant and admin location
     */
    @GetMapping("/tenant/{tenantId}/admin-location/{adminLocationId}")
    public ResponseEntity<List<VillageResponseDTO>> getVillagesByAdminLocation(
            @PathVariable Integer tenantId,
            @PathVariable Integer adminLocationId) {
        return ResponseEntity.ok(villageService.getVillagesByAdminLocation(tenantId, adminLocationId));
    }
}
