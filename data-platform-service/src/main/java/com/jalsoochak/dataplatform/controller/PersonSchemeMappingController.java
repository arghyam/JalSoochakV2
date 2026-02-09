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

import com.jalsoochak.dataplatform.dto.request.CreatePersonSchemeMappingRequestDTO;
import com.jalsoochak.dataplatform.dto.request.PersonSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonSchemeMappingResponseDTO;
import com.jalsoochak.dataplatform.service.PersonSchemeMappingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v2/person-scheme-mapping")
public class PersonSchemeMappingController {
    
    private final PersonSchemeMappingService mappingService;
    
    public PersonSchemeMappingController(PersonSchemeMappingService mappingService) {
        this.mappingService = mappingService;
    }

    /**
     * Get all person scheme mappings with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of mappings matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<PersonSchemeMappingResponseDTO>>> getAllMappings(
            @RequestBody(required = false) PersonSchemeMappingFilterDTO filter) {
        
        ApiResponseDTO<List<PersonSchemeMappingResponseDTO>> response = mappingService.getAllMappings(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get person scheme mapping by ID
     * 
     * @param id Mapping ID
     * @return Mapping details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<PersonSchemeMappingResponseDTO>> getMappingById(@PathVariable Long id) {
        ApiResponseDTO<PersonSchemeMappingResponseDTO> response = mappingService.getMappingById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new person scheme mapping
     * 
     * @param request Mapping creation request
     * @param userId Current user's ID from header (for audit tracking)
     * @return Created mapping details
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponseDTO<PersonSchemeMappingResponseDTO>> createMapping(
            @Valid @RequestBody CreatePersonSchemeMappingRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        ApiResponseDTO<PersonSchemeMappingResponseDTO> response = mappingService.createMapping(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Soft delete person scheme mapping
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
