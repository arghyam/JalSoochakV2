package com.jalsoochak.messaging_orchestrator_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GlificGraphqlClient {
    private static final Logger log = LoggerFactory.getLogger(GlificGraphqlClient.class);

    private final WebClient webClient;
    private final GlificAuthService authService;


    public GlificGraphqlClient(
            WebClient.Builder builder,
            GlificAuthService authService,
            @Value("${glific.base-url}") String baseUrl
    ) {
        this.webClient = builder
                .baseUrl(baseUrl)
                .build();
        this.authService = authService;
    }

    public JsonNode execute(String query, Map<String, Object> variables) {
        try {
            log.debug("Executing GraphQL query: {}, variables: {}", query, variables);

            JsonNode response = webClient.post()
                    .uri("/api")
                    .header(HttpHeaders.AUTHORIZATION, authService.getAccessToken())
                    .bodyValue(Map.of("query", query, "variables", variables))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            log.debug("GraphQL response: {}", response);
            return response;

        } catch (Exception e) {
            log.error("GraphQL execution failed: {}", e.getMessage(), e);
            throw e;
        }
    }
}
