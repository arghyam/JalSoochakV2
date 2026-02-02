package com.jalsoochak.water_supply_calculation_service.controllers;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.ClosingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.IntroRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ClosingResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.CreateReadingResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ImageAnalysisResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.IntroResponse;
import com.jalsoochak.water_supply_calculation_service.services.GlificWebhookService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/webhook")
public class GlificWebhookController {

    private static final Logger log = LoggerFactory.getLogger(GlificWebhookController.class);
    private final GlificWebhookService glificWebhookService;

    public GlificWebhookController(GlificWebhookService glificWebhookService) {
        this.glificWebhookService = glificWebhookService;
    }

    @PostMapping(
            value = "/glific",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<CreateReadingResponse> receive(@RequestBody GlificWebhookRequest glificWebhookRequest,
                                                          @RequestHeader(value = "X-Tenant-ID", required = false) String tenantId) {
        try {
            CreateReadingResponse response = glificWebhookService.processImage(glificWebhookRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing webhook for contactId {}: {}",
                    glificWebhookRequest.getContactId(), e.getMessage(), e);

            CreateReadingResponse errorResponse = CreateReadingResponse.builder()
                    .correlationId(glificWebhookRequest.getContactId())
                    .meterReading(null)
                    .qualityStatus("REJECTED")
                    .qualityConfidence(null)
                    .lastConfirmedReading(null)
                    .build();

            return ResponseEntity.ok(errorResponse);
        }

    }

    @PostMapping("/intro")
    public ResponseEntity<IntroResponse> sendIntro(@RequestBody @Valid IntroRequest introRequest) {
        try {
            IntroResponse response = glificWebhookService.introMessage(introRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending intro message for contactId {}: {}", introRequest.getContactId(), e.getMessage(), e);

            IntroResponse fallbackResponse = IntroResponse.builder()
                    .success(false)
                    .message("Something went wrong. Please try again.")
                    .build();

            return ResponseEntity.ok(fallbackResponse);
        }
    }

    @PostMapping("/closing")
    public ResponseEntity<ClosingResponse> closingMessage(@RequestBody @Valid ClosingRequest closingRequest) {
        try {
            ClosingResponse response = glificWebhookService.closingMessage(closingRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending closing message for contactId {}: {}", closingRequest.getContactId(), e.getMessage(), e);

            ClosingResponse fallbackResponse = ClosingResponse.builder()
                    .success(false)
                    .message("Something went wrong. Please try again.")
                    .build();

            return ResponseEntity.ok(fallbackResponse);
        }
    }

}
