package com.jalsoochak.messaging_orchestrator_service.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GlificService {
    private final String GLIFIC_API_URL = "https://api.glific.org/v1/messages";
    private final String GLIFIC_TOKEN = "YOUR_GLIFIC_TOKEN";
    private final WebClient webClient = WebClient.builder().build();

    public void sendWhatsAppMessage(String phoneNumber, String message) {
        String payload = "{\"to\":\"" + phoneNumber + "\",\"type\":\"text\",\"text\":\"" + message + "\"}";

        webClient.post()
                .uri(GLIFIC_API_URL)
                .header("Authorization", "Bearer " + GLIFIC_TOKEN)
                .header("Content-Type", "application/json")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(
                        resp -> System.out.println("Message sent: " + resp),
                        err -> System.err.println("Error sending message: " + err.getMessage())
                );
    }
}
