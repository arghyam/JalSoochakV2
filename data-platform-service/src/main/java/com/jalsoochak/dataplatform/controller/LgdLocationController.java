package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.LgdLocationFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationResponseDTO;
import com.jalsoochak.dataplatform.service.LgdLocationService;

@RestController
@RequestMapping("/api/v2/lgd-location")
public class LgdLocationController {
    
    private final LgdLocationService lgdLocationService;

    public LgdLocationController(LgdLocationService lgdLocationService) {
        this.lgdLocationService = lgdLocationService;
    }

    /**
     * Search LGD locations with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of LGD locations matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<LgdLocationResponseDTO>>> getAllLgdLocations(
            @RequestBody(required = false) LgdLocationFilterDTO filter) {
        ApiResponseDTO<List<LgdLocationResponseDTO>> response = lgdLocationService.getAllLgdLocations(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get LGD location by ID
     * 
     * @param id LGD location ID
     * @return LGD location details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<LgdLocationResponseDTO>> getLgdLocationById(@PathVariable Long id) {
        ApiResponseDTO<LgdLocationResponseDTO> response = lgdLocationService.getLgdLocationById(id);
        return ResponseEntity.ok(response);
    }
    
}
