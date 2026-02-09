package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.CreateVillageSchemeMappingRequestDTO;
import com.jalsoochak.dataplatform.dto.request.VillageSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageSchemeMappingResponseDTO;
import com.jalsoochak.dataplatform.service.VillageSchemeMappingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v2/village-scheme-mapping")
public class VillageSchemeMappingController {
    
    private final VillageSchemeMappingService mappingService;
    
    public VillageSchemeMappingController(VillageSchemeMappingService mappingService) {
        this.mappingService = mappingService;
    }

    /**
     * Get all village scheme mappings with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of mappings matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<VillageSchemeMappingResponseDTO>>> getAllMappings(
            @RequestBody(required = false) VillageSchemeMappingFilterDTO filter) {
        
        ApiResponseDTO<List<VillageSchemeMappingResponseDTO>> response = mappingService.getAllMappings(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get village scheme mapping by ID
     * 
     * @param id Mapping ID
     * @return Mapping details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<VillageSchemeMappingResponseDTO>> getMappingById(@PathVariable Long id) {
        ApiResponseDTO<VillageSchemeMappingResponseDTO> response = mappingService.getMappingById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new village scheme mapping
     * 
     * @param request Mapping creation request
     * @param userId Current user's ID from header (for audit tracking)
     * @return Created mapping details
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponseDTO<VillageSchemeMappingResponseDTO>> createMapping(
            @Valid @RequestBody CreateVillageSchemeMappingRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        ApiResponseDTO<VillageSchemeMappingResponseDTO> response = mappingService.createMapping(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Soft delete village scheme mapping
     * 
     * @param id Mapping ID
     * @param userId Current user's ID from header (for audit tracking)
     * @return Success response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteMapping(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        ApiResponseDTO<Void> response = mappingService.deleteMapping(id, userId);
        return ResponseEntity.ok(response);
    }

}
