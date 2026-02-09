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

import com.jalsoochak.dataplatform.dto.request.BfmReadingFilterDTO;
import com.jalsoochak.dataplatform.dto.request.CreateBfmReadingRequestDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.BfmReadingResponseDTO;
import com.jalsoochak.dataplatform.service.BfmReadingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v2/bfm-reading")
public class BfmReadingController {
    
    private final BfmReadingService bfmReadingService;
    
    public BfmReadingController(BfmReadingService bfmReadingService) {
        this.bfmReadingService = bfmReadingService;
    }

    /**
     * Get all BFM readings with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of BFM readings matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<BfmReadingResponseDTO>>> getAllBfmReadings(
            @RequestBody(required = false) BfmReadingFilterDTO filter) {
        
        ApiResponseDTO<List<BfmReadingResponseDTO>> response = bfmReadingService.getAllBfmReadings(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get BFM reading by ID
     * 
     * @param id BFM Reading ID
     * @return BFM reading details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<BfmReadingResponseDTO>> getBfmReadingById(@PathVariable Long id) {
        ApiResponseDTO<BfmReadingResponseDTO> response = bfmReadingService.getBfmReadingById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new BFM reading
     * 
     * @param request BFM reading creation request
     * @param userId Current user's ID from header (for audit tracking)
     * @return Created BFM reading details
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponseDTO<BfmReadingResponseDTO>> createBfmReading(
            @Valid @RequestBody CreateBfmReadingRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        ApiResponseDTO<BfmReadingResponseDTO> response = bfmReadingService.createBfmReading(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Soft delete BFM reading
     * 
     * @param id BFM Reading ID
     * @param userId Current user's ID from header (for audit tracking)
     * @return Success response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteBfmReading(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        ApiResponseDTO<Void> response = bfmReadingService.deleteBfmReading(id, userId);
        return ResponseEntity.ok(response);
    }

}
