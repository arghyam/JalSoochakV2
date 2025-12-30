package com.jalsoochak.messaging_orchestrator_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.Map;


@Service
public class GlificAuthService {
    private static final Logger log = LoggerFactory.getLogger(GlificAuthService.class);
    private final WebClient webClient;
    private final String username;
    private final String password;
    private final String baseUrl;
    private String accessToken;
    private Instant expiryTime;

    public GlificAuthService(
            WebClient.Builder builder,
            @Value("${glific.base-url}") String baseUrl,
            @Value("${glific.username}") String username,
            @Value("${glific.password}") String password
    ) {
        this.baseUrl = baseUrl;
        this.webClient = builder.baseUrl(baseUrl).build();
        this.username = username;
        this.password = password;
    }


    public synchronized String getAccessToken() {
        log.info("Glific base URL: {}", baseUrl);
        log.info("Glific username: {}", username);

        if (accessToken == null || Instant.now().isAfter(expiryTime)){
            login();
        }
        return accessToken;
    }

    public void login(){
        Map<String, Object> payload = Map.of(
                "user", Map.of(
                        "phone", username,
                        "password", password
                )
        );

        try {
            JsonNode response = webClient.post()
                    .uri("/api/v1/session")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            log.debug("Login response: {}", response);

            JsonNode data = response.get("data");
            this.accessToken = data.get("access_token").asText();
            this.expiryTime = Instant.parse(data.get("token_expiry_time").asText());
            log.info("Successfully obtained access token, expires at {}", expiryTime);
        } catch (Exception e) {
            log.error("Failed to login to Glific: {}", e.getMessage(), e);
            throw new RuntimeException("Glific login failed", e);
        }
    }
}
