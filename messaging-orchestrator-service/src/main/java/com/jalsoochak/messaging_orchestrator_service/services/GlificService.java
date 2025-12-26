package com.jalsoochak.messaging_orchestrator_service.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class GlificService {

    private static final Logger log = LoggerFactory.getLogger(GlificService.class);

    private final String GLIFIC_API_URL = "https://api.glific.org/v1/messages";
    private final String GLIFIC_TOKEN = "YOUR_GLIFIC_TOKEN";

    private final WebClient webClient = WebClient.builder()
            .build();

    public Mono<String> sendWhatsAppMessage(String phoneNumber, String message) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("to", phoneNumber);
        payload.put("type", "text");
        payload.put("text", message);

        return webClient.post()
                .uri(GLIFIC_API_URL)
                .header("Authorization", "Bearer " + GLIFIC_TOKEN)
                .header("Content-Type", "application/json")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(10))
                .doOnSuccess(resp -> log.info("Message sent to {}: {}", phoneNumber, resp))
                .doOnError(err -> {
                    if (err instanceof WebClientResponseException e) {
                        log.error("Error sending message to {}: Status {}, Body {}", phoneNumber, e.getRawStatusCode(), e.getResponseBodyAsString());
                    } else {
                        log.error("Error sending message to {}: {}", phoneNumber, err.getMessage(), err);
                    }
                });
    }
}
