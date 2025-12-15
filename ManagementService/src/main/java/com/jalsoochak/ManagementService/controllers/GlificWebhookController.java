package com.jalsoochak.ManagementService.controllers;

import com.jalsoochak.ManagementService.models.app.response.GlificSendMessageDto;
import com.jalsoochak.ManagementService.services.impl.GlificService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/glific/webhook")
public class GlificWebhookController {

    private final GlificService glificService;

    public GlificWebhookController(GlificService glificService) {
        this.glificService = glificService;
    }

    @PostMapping("/inbound")
    public ResponseEntity<?> inbound(@RequestBody GlificSendMessageDto glificSendMessageDto) {
        glificService.handleInboundMessage(glificSendMessageDto);
        return ResponseEntity.ok().build();
    }
}
