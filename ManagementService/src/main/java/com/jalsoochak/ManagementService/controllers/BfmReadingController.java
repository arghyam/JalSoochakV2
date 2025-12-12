package com.jalsoochak.ManagementService.controllers;


import com.jalsoochak.ManagementService.models.app.request.CreateBfmReadingRequestDTO;
import com.jalsoochak.ManagementService.models.app.response.CreateBfmReadingResponseDTO;
import com.jalsoochak.ManagementService.services.service.BfmReadingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/tenants/{tenantId}/bfm-readings")
@RequiredArgsConstructor
public class BfmReadingController {

    private final BfmReadingService bfmReadingService;

    /**
     * Create a new BFM (Bulk Flow Meter) reading.
     *
     * @param tenantId The tenant identifier from path
     * @param request The BFM reading request containing scheme, operator, and reading details
     * @return Response containing submission ID and computed quantity in litres
     */
    @PostMapping
    public ResponseEntity<CreateBfmReadingResponseDTO> createBfmReading(
            @PathVariable String tenantId,
            @Valid @RequestBody CreateBfmReadingRequestDTO request) {

        log.info("Received request to create BFM reading for tenant: {}", tenantId);

        CreateBfmReadingResponseDTO response = bfmReadingService
                .createBfmReading(tenantId, request);

        log.info("BFM reading created successfully with submission ID: {}",
                response.getSubmissionId());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Additional endpoints can be added here:
    // - GET /api/tenants/{tenantId}/bfm-readings - List all readings
    // - GET /api/tenants/{tenantId}/bfm-readings/{id} - Get by ID
    // - PUT /api/tenants/{tenantId}/bfm-readings/{id} - Update reading
    // - DELETE /api/tenants/{tenantId}/bfm-readings/{id} - Soft delete
}
