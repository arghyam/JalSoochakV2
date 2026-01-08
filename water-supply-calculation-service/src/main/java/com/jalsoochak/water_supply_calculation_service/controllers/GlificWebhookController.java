package com.jalsoochak.water_supply_calculation_service.controllers;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.services.GlificWebhookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ImageAnalysisResponse;

@RestController
@RequestMapping("/webhooks")
public class GlificWebhookController {
    private static final Logger log = LoggerFactory.getLogger(GlificWebhookController.class);
    private final GlificWebhookService glificWebhookService;

    public GlificWebhookController(GlificWebhookService glificWebhookService) {
        this.glificWebhookService = glificWebhookService;
    }

    @PostMapping("/glific")
    public ResponseEntity<ImageAnalysisResponse> receive(@RequestBody GlificWebhookRequest glificWebhookRequest){
        ImageAnalysisResponse response = glificWebhookService.processImage(glificWebhookRequest);
        return ResponseEntity.ok(response);
    }
}
