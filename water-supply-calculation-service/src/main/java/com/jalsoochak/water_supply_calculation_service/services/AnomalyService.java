package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.responses.AnomalyResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
public class AnomalyService {

    private final RestTemplate restTemplate;
    private final String url;

    public AnomalyService(RestTemplate restTemplate,
                          @Value("${anomaly.service.url}") String url) {
        this.restTemplate = restTemplate;
        this.url = url;
    }

    public AnomalyResult analyze(String imageUrl) {
        Map<String, String> request = Map.of("image_url", imageUrl);

        try {
            AnomalyResult result = restTemplate.postForObject(url, request, AnomalyResult.class);
            return Optional.ofNullable(result)
                    .orElse(new AnomalyResult(false, "No result returned from anomaly service"));
        } catch (RestClientException e) {
            return new AnomalyResult(false, "Error calling anomaly service: " + e.getMessage());
        }
    }
}
