package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.VillageFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageResponseDTO;
import com.jalsoochak.dataplatform.service.VillageService;

@RestController
@RequestMapping("/api/v2/village")
public class VillageController {
    
    private final VillageService villageService;
    
    public VillageController(VillageService villageService) {
        this.villageService = villageService;
    }

    /**
     * Get all villages with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of villages matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<VillageResponseDTO>>> getAllVillages(
            @RequestBody(required = false) VillageFilterDTO filter) {
        
        ApiResponseDTO<List<VillageResponseDTO>> response = villageService.getAllVillages(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get village by ID
     * 
     * @param id Village ID
     * @return Village details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<VillageResponseDTO>> getVillageById(@PathVariable Long id) {
        ApiResponseDTO<VillageResponseDTO> response = villageService.getVillageById(id);
        return ResponseEntity.ok(response);
    }

}
