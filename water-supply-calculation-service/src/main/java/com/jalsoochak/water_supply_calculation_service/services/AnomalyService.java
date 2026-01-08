package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.responses.AnomalyResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AnomalyService {
    @Value("${anomaly.service.url}")
    private String url;

    public AnomalyResult analyze(String imageUrl) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> request = Map.of("image_url", imageUrl);
        return restTemplate.postForObject(url, request, AnomalyResult.class);
    }
}
