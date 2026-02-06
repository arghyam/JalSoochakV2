package com.jalsoochak.analyticsetlservice.controller;

import com.jalsoochak.analyticsetlservice.dto.SchemeResponseDTO;
import com.jalsoochak.analyticsetlservice.service.SchemeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Scheme operations
 */
@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    /**
     * Get all schemes
     */
    @GetMapping
    public ResponseEntity<List<SchemeResponseDTO>> getAllSchemes() {
        return ResponseEntity.ok(schemeService.getAllSchemes());
    }

    /**
     * Get scheme by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponseDTO> getSchemeById(@PathVariable Integer id) {
        return schemeService.getSchemeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get schemes by tenant
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<SchemeResponseDTO>> getSchemesByTenant(@PathVariable Integer tenantId) {
        return ResponseEntity.ok(schemeService.getSchemesByTenant(tenantId));
    }

    /**
     * Get active schemes by tenant
     */
    @GetMapping("/tenant/{tenantId}/active")
    public ResponseEntity<List<SchemeResponseDTO>> getActiveSchemesByTenant(@PathVariable Integer tenantId) {
        return ResponseEntity.ok(schemeService.getActiveSchemesByTenant(tenantId));
    }

    /**
     * Get schemes by tenant and district
     */
    @GetMapping("/tenant/{tenantId}/district/{districtId}")
    public ResponseEntity<List<SchemeResponseDTO>> getSchemesByDistrict(
            @PathVariable Integer tenantId,
            @PathVariable Integer districtId) {
        return ResponseEntity.ok(schemeService.getSchemesByDistrict(tenantId, districtId));
    }

    /**
     * Get schemes by tenant and village
     */
    @GetMapping("/tenant/{tenantId}/village/{villageId}")
    public ResponseEntity<List<SchemeResponseDTO>> getSchemesByVillage(
            @PathVariable Integer tenantId,
            @PathVariable Integer villageId) {
        return ResponseEntity.ok(schemeService.getSchemesByVillage(tenantId, villageId));
    }

    /**
     * Get schemes by tenant and admin division
     */
    @GetMapping("/tenant/{tenantId}/division/{divisionId}")
    public ResponseEntity<List<SchemeResponseDTO>> getSchemesByAdminDivision(
            @PathVariable Integer tenantId,
            @PathVariable Integer divisionId) {
        return ResponseEntity.ok(schemeService.getSchemesByAdminDivision(tenantId, divisionId));
    }
}
