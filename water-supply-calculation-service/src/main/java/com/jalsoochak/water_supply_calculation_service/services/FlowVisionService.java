package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.responses.FlowVisionResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class FlowVisionService {

    private static final String FLOWVISION_URL =
            "https://jalsoochak.beehyv.com/flowvision/v1/extract-reading";

    private final RestTemplate restTemplate;

    public FlowVisionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public FlowVisionResult extractReading(String readingUrl) {

        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("imageURL", readingUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> requestEntity =
                    new HttpEntity<>(payload, headers);

            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    FLOWVISION_URL,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            if (responseEntity.getStatusCode() != HttpStatus.OK) {
                log.warn("FlowVision returned status {}", responseEntity.getStatusCode());
                return null;
            }

            Map<String, Object> responseBody = responseEntity.getBody();
            if (responseBody == null || !responseBody.containsKey("result")) {
                log.warn("FlowVision response missing 'result': {}", responseBody);
                return null;
            }

            Map<String, Object> resultMap =
                    (Map<String, Object>) responseBody.get("result");

            BigDecimal adjustedReading = null;
            Object meterReadingObj = resultMap.get("meterReading");

            if (meterReadingObj != null) {
                try {
                    adjustedReading = new BigDecimal(meterReadingObj.toString());
                } catch (NumberFormatException ex) {
                    log.warn("Invalid meterReading from FlowVision: {}", meterReadingObj);
                }
            }

            String qualityStatus =
                    resultMap.getOrDefault("qualityStatus", "unknown").toString();

            BigDecimal qualityConfidence = null;
            Object confidenceObj = resultMap.get("qualityConfidence");
            if (confidenceObj != null) {
                try {
                    qualityConfidence = new BigDecimal(confidenceObj.toString());
                } catch (NumberFormatException ex) {
                    log.warn("Invalid qualityConfidence from FlowVision: {}", confidenceObj);
                }
            }


            String correlationId =
                    resultMap.getOrDefault("correlationId", UUID.randomUUID().toString()).toString();

            return FlowVisionResult.builder()
                    .adjustedReading(adjustedReading)
                    .qualityStatus(qualityStatus)
                    .qualityConfidence(qualityConfidence)
                    .correlationId(correlationId)
                    .build();

        } catch (Exception ex) {
            log.error("FlowVision OCR call failed for image {}", readingUrl, ex);
            return null;
        }
    }
}
