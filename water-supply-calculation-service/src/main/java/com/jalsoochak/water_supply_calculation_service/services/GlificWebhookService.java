package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.AnomalyResult;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ImageAnalysisResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Service
public class GlificWebhookService {

    private final MinioService minioService;
    private final AnomalyService anomalyService;
    private final RestTemplate restTemplate;

    public GlificWebhookService(MinioService minioService,
                                AnomalyService anomalyService,
                                RestTemplate restTemplate) {
        this.minioService = minioService;
        this.anomalyService = anomalyService;
        this.restTemplate = restTemplate;
    }

    public ImageAnalysisResponse processImage(GlificWebhookRequest glificWebhookRequest) {
        try {
            byte[] imageBytes = downloadImage(glificWebhookRequest.getMediaUrl());
            if (imageBytes == null) {
                throw new IOException("Downloaded image is null");
            }

            String s3Key = "bfm/" + glificWebhookRequest.getContactId() + "/" + System.currentTimeMillis() + ".jpg";
            String imageUrl = minioService.upload(imageBytes, s3Key);

            AnomalyResult result = Optional.ofNullable(anomalyService.analyze(imageUrl))
                    .orElse(new AnomalyResult(false, "Anomaly analysis returned null"));

            if (!result.isValid()) {
                return new ImageAnalysisResponse(
                        glificWebhookRequest.getContactId(),
                        imageUrl,
                        "REJECTED",
                        result.getReason()
                );
            }

            return new ImageAnalysisResponse(
                    glificWebhookRequest.getContactId(),
                    imageUrl,
                    "ACCEPTED",
                    "OK"
            );

        } catch (Exception e) {
            // ✅ Log the exception for debugging
            log.error("Failed to process image for contactId {}: {}", glificWebhookRequest.getContactId(), e.getMessage(), e);

            return new ImageAnalysisResponse(
                    glificWebhookRequest.getContactId(),
                    null,
                    "REJECTED",
                    "PROCESSING_ERROR"
            );
        }
    }

    private byte[] downloadImage(String url) throws IOException {
        try {
            byte[] bytes = restTemplate.getForObject(url, byte[].class);
            return Optional.ofNullable(bytes).orElse(null);
        } catch (RestClientException e) {
            throw new IOException("Failed to download image: " + e.getMessage(), e);
        }
    }
}


