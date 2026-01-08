package com.jalsoochak.water_supply_calculation_service.controllers;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ImageAnalysisResponse;
import com.jalsoochak.water_supply_calculation_service.services.GlificWebhookService;
import jakarta.validation.Valid; // ✅ For @Valid
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
public class GlificWebhookController {

    private static final Logger log = LoggerFactory.getLogger(GlificWebhookController.class);
    private final GlificWebhookService glificWebhookService;

    public GlificWebhookController(GlificWebhookService glificWebhookService) {
        this.glificWebhookService = glificWebhookService;
    }

    @PostMapping("/glific")
    public ResponseEntity<ImageAnalysisResponse> receive(@Valid @RequestBody GlificWebhookRequest glificWebhookRequest){
        try {
            ImageAnalysisResponse response = glificWebhookService.processImage(glificWebhookRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing webhook for contactId {}: {}",
                    glificWebhookRequest.getContactId(), e.getMessage(), e);
            ImageAnalysisResponse errorResponse = new ImageAnalysisResponse(
                    glificWebhookRequest.getContactId(),
                    null,
                    "REJECTED",
                    "SERVICE_ERROR"
            );
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
