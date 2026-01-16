package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.CreateReadingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.CreateReadingResponse;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonMaster;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonSchemeMapping;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonSchemeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.math.BigDecimal;

@Slf4j
@Service
public class GlificWebhookService {

    private final MinioService minioService;
    private final PersonSchemeRepository personSchemeRepository;
    private final RestTemplate restTemplate;
    private final PersonRepository personRepository;
    private final BfmReadingService bfmReadingService;

    //temporary for now
    private static final String GLIFIC_API_TOKEN = "<YOUR_GLIFIC_API_TOKEN>";

    public GlificWebhookService(MinioService minioService,
                                PersonSchemeRepository personSchemeRepository,
                                RestTemplate restTemplate, PersonRepository personRepository, BfmReadingService bfmReadingService) {
        this.minioService = minioService;
        this.personSchemeRepository = personSchemeRepository;
        this.restTemplate = restTemplate;
        this.personRepository = personRepository;
        this.bfmReadingService = bfmReadingService;
    }

    public CreateReadingResponse processImage(GlificWebhookRequest glificWebhookRequest) {
        try {
            if (glificWebhookRequest.getConfirmedReading() != null &&
                    glificWebhookRequest.getCorrelationId() != null) {

                return bfmReadingService.updateConfirmedReading(
                        glificWebhookRequest.getCorrelationId(),
                        new BigDecimal(glificWebhookRequest.getConfirmedReading())
                );
            }
            log.info("request in: {}", glificWebhookRequest);
            byte[] imageBytes;

            if (glificWebhookRequest.getMediaId() != null) {
                imageBytes = downloadImageFromGlific(glificWebhookRequest.getMediaId());
            } else if (glificWebhookRequest.getMediaUrl() != null) {
                imageBytes = downloadImage(glificWebhookRequest.getMediaUrl());
            } else {
                throw new IllegalArgumentException("No mediaId or mediaUrl provided in webhook payload");
            }

            log.info("Downloaded image size={} bytes", imageBytes.length);
            if (imageBytes == null) {
                throw new IOException("Downloaded image is null");
            }

            String s3Key = "bfm/" + glificWebhookRequest.getContactId() + "/" + System.currentTimeMillis() + ".jpg";
            log.info("s3key: {}", s3Key);
            String imageUrl = minioService.upload(imageBytes, s3Key);
            log.info("imageurl: {}", imageUrl);

            PersonMaster operator = personRepository
                    .findByPhoneNumber(glificWebhookRequest.getContactId())
                    .orElseThrow(() ->
                            new IllegalStateException("No operator found for contactId " + glificWebhookRequest.getContactId())
                    );

            PersonSchemeMapping mapping = personSchemeRepository
                    .findFirstByPerson_Id(operator.getId())
                    .orElseThrow(() ->
                            new IllegalStateException("Operator is not mapped to any scheme")
                    );

            Long schemeId = mapping.getScheme().getId();

            CreateReadingRequest createReadingRequest = CreateReadingRequest.builder()
                    .schemeId(schemeId)
                    .operatorId(operator.getId())
                    .readingUrl(imageUrl)
                    .readingValue(null)
                    .readingTime(null)
                    .build();

            return bfmReadingService.createReading(createReadingRequest);

        } catch (Exception e) {
            log.error("Failed to process image for contactId {}: {}", glificWebhookRequest.getContactId(), e.getMessage(), e);
            throw new RuntimeException("Failed to process image", e);

        }
    }

    private CreateReadingResponse handleManualReadings(GlificWebhookRequest glificWebhookRequest){
        PersonMaster operator = personRepository
                .findByPhoneNumber(glificWebhookRequest.getContactId())
                .orElseThrow(() ->
                                new IllegalStateException("Operator not found")
                        );

        PersonSchemeMapping mapping = personSchemeRepository
                .findFirstByPerson_Id(operator.getId())
                .orElseThrow(() ->
                        new IllegalStateException("Operator not mapped to scheme")
                );

        BigDecimal manualReading;
        try {
            manualReading = new BigDecimal(glificWebhookRequest.getConfirmedReading());
        } catch(NumberFormatException e) {
            throw new IllegalArgumentException("Invalid reading value");
        }

        CreateReadingRequest createRequest = CreateReadingRequest.builder()
                .schemeId(mapping.getScheme().getId())
                .operatorId(operator.getId())
                .readingValue(manualReading)
                .readingUrl(null)
                .readingTime(null)
                .build();

        return bfmReadingService.createReading(createRequest);
    }

    private byte[] downloadImageFromGlific(String mediaId) throws IOException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(GLIFIC_API_TOKEN);
            headers.set(HttpHeaders.USER_AGENT, "WaterSupplyBot/1.0");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    "https://api.glific.org/v1/media/" + mediaId,
                    HttpMethod.GET,
                    entity,
                    byte[].class
            );

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new IOException("Failed to download image from Glific, status: " + response.getStatusCode());
            }

            return response.getBody();

        } catch (RestClientException e) {
            throw new IOException("Failed to download image from Glific: " + e.getMessage(), e);
        }
    }

    private byte[] downloadImage(String url) throws IOException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.USER_AGENT, "WaterSupplyBot/1.0");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    byte[].class
            );

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new IOException("Failed to download image, status: " + response.getStatusCode());
            }

            return response.getBody();

        } catch (RestClientException e) {
            throw new IOException("Failed to download image: " + e.getMessage(), e);
        }
    }

}


