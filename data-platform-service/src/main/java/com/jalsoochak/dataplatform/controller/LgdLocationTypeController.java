package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.service.LgdLocationTypeService;

@RestController
@RequestMapping("/api/v2/lgd-location-type") 
public class LgdLocationTypeController {
    
    private final LgdLocationTypeService lgdLocationTypeService;

    public LgdLocationTypeController(LgdLocationTypeService lgdLocationTypeService) {
        this.lgdLocationTypeService = lgdLocationTypeService;
    }
    
    /**
     * Get all LGD location types
     * 
     * @return List of all LGD location types
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponseDTO<List<LgdLocationTypeResponseDTO>>> getAllLgdLocationTypes() {
        ApiResponseDTO<List<LgdLocationTypeResponseDTO>> response = lgdLocationTypeService.getAllLgdLocationTypes();
        return ResponseEntity.ok(response);
    }

    /**
     * Get LGD location type by ID
     * 
     * @param id LGD location type ID
     * @return LGD location type details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<LgdLocationTypeResponseDTO>> getLgdLocationTypeById(@PathVariable Long id) {
        ApiResponseDTO<LgdLocationTypeResponseDTO> response = lgdLocationTypeService.getLgdLocationTypeById(id);
        return ResponseEntity.ok(response);
    }
}
