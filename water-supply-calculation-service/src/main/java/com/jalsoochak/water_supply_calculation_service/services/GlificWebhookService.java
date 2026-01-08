package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.AnomalyResult;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ImageAnalysisResponse;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

public class GlificWebhookService {
    private final MinioService minioService;
    private final AnomalyService anomalyService;

    public GlificWebhookService(MinioService minioService, AnomalyService anomalyService) {
        this.minioService = minioService;
        this.anomalyService = anomalyService;
    }

    public ImageAnalysisResponse processImage(GlificWebhookRequest glificWebhookRequest) {
        try {
            byte[] imageBytes = downloadImage(glificWebhookRequest.getMediaUrl());
            String s3Key = "bfm/" + glificWebhookRequest.getContactId() + "/" + System.currentTimeMillis() + ".jpg";

            String imageUrl = minioService.upload(imageBytes, s3Key);
            AnomalyResult result = anomalyService.analyze(imageUrl);

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
            return new ImageAnalysisResponse(
                    glificWebhookRequest.getContactId(),
                    null,
                    "REJECTED",
                    "PROCESSING_ERROR"
            );
        }
    }

    private byte[] downloadImage(String url) throws IOException {
        return new RestTemplate().getForObject(url, byte[].class);
    }

}
