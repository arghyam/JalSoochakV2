package com.jalsoochak.ManagementService.controllers;

import com.jalsoochak.ManagementService.models.app.response.ApiResponseDTO;
import com.jalsoochak.ManagementService.models.app.response.SchemeFilterDTO;
import com.jalsoochak.ManagementService.models.app.response.SchemeResponseDTO;
import com.jalsoochak.ManagementService.services.service.SchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {
    @Autowired
    private SchemeService schemeService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponseDTO<List<SchemeResponseDTO>>> getAllSchemes(SchemeFilterDTO filter) {
        ApiResponseDTO<List<SchemeResponseDTO>> response = schemeService.getAllSchemes(filter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/centre/{centreSchemeId}")
    public ResponseEntity<ApiResponseDTO<SchemeResponseDTO>> getSchemeByCentreId(
            @PathVariable Integer centreSchemeId) {
        ApiResponseDTO<SchemeResponseDTO> response = schemeService.getSchemeByCentreId(centreSchemeId);
        return ResponseEntity.ok(response);
    }
}
