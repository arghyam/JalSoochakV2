package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.TenantFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.TenantResponseDTO;
import com.jalsoochak.dataplatform.service.TenantService;

@RestController
@RequestMapping("/api/v2/tenant")   
public class TenantController {
    
    private final TenantService tenantService;
    
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    /**
     * Get all tenants with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of tenants matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<TenantResponseDTO>>> getAllTenants(
            @RequestBody(required = false) TenantFilterDTO filter) {
        
        ApiResponseDTO<List<TenantResponseDTO>> response = tenantService.getAllTenants(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get tenant by ID
     * 
     * @param id Tenant ID
     * @return Tenant details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<TenantResponseDTO>> getTenantById(@PathVariable Long id) {
        ApiResponseDTO<TenantResponseDTO> response = tenantService.getTenantById(id);
        return ResponseEntity.ok(response);
    }

}
