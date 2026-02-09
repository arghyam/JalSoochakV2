package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.AdministrativeLocationFilterDTO;
import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationResponseDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.service.AdministrativeLocationService;

@RestController
@RequestMapping("/api/v2/administrative-location")
public class AdministrativeLocationController {

    private final AdministrativeLocationService administrativeLocationService;

    public AdministrativeLocationController(AdministrativeLocationService administrativeLocationService) {
        this.administrativeLocationService = administrativeLocationService;
    }
    
    /**
     * Search administrative locations with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of administrative locations matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<AdministrativeLocationResponseDTO>>> getAllAdministrativeLocations(
            @RequestBody(required = false) AdministrativeLocationFilterDTO filter) {
        ApiResponseDTO<List<AdministrativeLocationResponseDTO>> response = administrativeLocationService.getAllAdministrativeLocations(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get administrative location by ID
     * 
     * @param id Administrative location ID
     * @return Administrative location details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<AdministrativeLocationResponseDTO>> getAdministrativeLocationById(@PathVariable Long id) {
        ApiResponseDTO<AdministrativeLocationResponseDTO> response = administrativeLocationService.getAdministrativeLocationById(id);
        return ResponseEntity.ok(response);
    }
    
}
