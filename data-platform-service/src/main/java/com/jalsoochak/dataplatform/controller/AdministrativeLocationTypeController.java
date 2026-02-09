package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.service.AdministrativeLocationTypeService;

@RestController
@RequestMapping("/api/v2/administrative-location-type")
public class AdministrativeLocationTypeController {
    
    private final AdministrativeLocationTypeService administrativeLocationTypeService;

    public AdministrativeLocationTypeController(AdministrativeLocationTypeService administrativeLocationTypeService) {
        this.administrativeLocationTypeService = administrativeLocationTypeService;
    }

    /**
     * Get all administrative location types
     * 
     * @return List of all administrative location types
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponseDTO<List<AdministrativeLocationTypeResponseDTO>>> getAllAdministrativeLocationTypes() {
        ApiResponseDTO<List<AdministrativeLocationTypeResponseDTO>> response = administrativeLocationTypeService.getAllAdministrativeLocationTypes();
        return ResponseEntity.ok(response);
    }

    /**
     * Get administrative location type by ID
     * 
     * @param id Administrative location type ID
     * @return Administrative location type details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<AdministrativeLocationTypeResponseDTO>> getAdministrativeLocationTypeById(@PathVariable Long id) {
        ApiResponseDTO<AdministrativeLocationTypeResponseDTO> response = administrativeLocationTypeService.getAdministrativeLocationTypeById(id);
        return ResponseEntity.ok(response);
    }
    
}
