package com.jalsoochak.analyticsetlservice.controller;

import com.jalsoochak.analyticsetlservice.dto.TenantResponseDTO;
import com.jalsoochak.analyticsetlservice.service.TenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Tenant operations
 */
@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    /**
     * Get all tenants
     */
    @GetMapping
    public ResponseEntity<List<TenantResponseDTO>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    /**
     * Get all active tenants
     */
    @GetMapping("/active")
    public ResponseEntity<List<TenantResponseDTO>> getActiveTenants() {
        return ResponseEntity.ok(tenantService.getActiveTenants());
    }

    /**
     * Get tenant by ID
     */
    @GetMapping("/{tenantId}")
    public ResponseEntity<TenantResponseDTO> getTenantById(@PathVariable Integer tenantId) {
        return tenantService.getTenantById(tenantId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get tenant by code
     */
    @GetMapping("/code/{tenantCode}")
    public ResponseEntity<TenantResponseDTO> getTenantByCode(@PathVariable String tenantCode) {
        return tenantService.getTenantByCode(tenantCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
