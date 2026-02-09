package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.SchemeFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.SchemeResponseDTO;
import com.jalsoochak.dataplatform.service.SchemeService;

@RestController
@RequestMapping("/api/v2/scheme")
public class SchemeController {
    
    private final SchemeService schemeService;
    
    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    /**
     * Get all schemes with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of schemes matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<SchemeResponseDTO>>> getAllSchemes(
            @RequestBody(required = false) SchemeFilterDTO filter) {
        
        ApiResponseDTO<List<SchemeResponseDTO>> response = schemeService.getAllSchemes(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get scheme by ID
     * 
     * @param id Scheme ID
     * @return Scheme details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<SchemeResponseDTO>> getSchemeById(
            @PathVariable Long id) {
        
        ApiResponseDTO<SchemeResponseDTO> response = schemeService.getSchemeById(id);
        return ResponseEntity.ok(response);
    }

}
