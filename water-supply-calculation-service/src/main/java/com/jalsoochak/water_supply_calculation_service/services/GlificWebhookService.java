package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.exceptions.ApiException;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.ClosingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.CreateReadingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.GlificWebhookRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.IntroRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.ClosingResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.CreateReadingResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.IntroResponse;
import com.jalsoochak.water_supply_calculation_service.models.entities.MessageTemplate;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonMaster;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonSchemeMapping;
import com.jalsoochak.water_supply_calculation_service.models.entities.StateAdminConfig;
import com.jalsoochak.water_supply_calculation_service.repositories.MessageTemplateRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonSchemeRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.StateAdminConfigRepository;
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

@Slf4j
@Service
public class GlificWebhookService {

    private final MinioService minioService;
    private final PersonSchemeRepository personSchemeRepository;
    private final RestTemplate restTemplate;
    private final PersonRepository personRepository;
    private final BfmReadingService bfmReadingService;
    private final StateAdminConfigRepository stateAdminConfigRepository;
    private final MessageTemplateRepository messageTemplateRepository;

    private static final String GLIFIC_API_TOKEN = "hhhvbfrrrtbbbb";

    public GlificWebhookService(MinioService minioService,
                                PersonSchemeRepository personSchemeRepository,
                                RestTemplate restTemplate, PersonRepository personRepository, BfmReadingService bfmReadingService, StateAdminConfigRepository stateAdminConfigRepository, MessageTemplateRepository messageTemplateRepository) {
        this.minioService = minioService;
        this.personSchemeRepository = personSchemeRepository;
        this.restTemplate = restTemplate;
        this.personRepository = personRepository;
        this.bfmReadingService = bfmReadingService;
        this.stateAdminConfigRepository = stateAdminConfigRepository;
        this.messageTemplateRepository = messageTemplateRepository;
    }

    public CreateReadingResponse processImage(GlificWebhookRequest glificWebhookRequest) {
        try {
//            if (glificWebhookRequest.getConfirmedReading() != null &&
//                    glificWebhookRequest.getCorrelationId() != null) {
//
//                return bfmReadingService.updateConfirmedReading(
//                        glificWebhookRequest.getCorrelationId(),
//                        new BigDecimal(glificWebhookRequest.getConfirmedReading())
//                );
//            }
            log.info("request in: {}", glificWebhookRequest);
            String contactId = glificWebhookRequest.getContactId();
            String mediaId = glificWebhookRequest.getMediaId();
            String mediaUrl = glificWebhookRequest.getMediaUrl();

            boolean hasImage = (mediaId != null && !mediaId.isBlank()) ||
                    (mediaUrl != null && !mediaUrl.isBlank());

            if (!hasImage) {
                log.info("Non-image content received from contactId={}", glificWebhookRequest.getContactId());

                String message = getLocalizedMessage(
                        glificWebhookRequest.getContactId(),
                        "InvalidMediaMessage"
                );

                return CreateReadingResponse.builder()
                        .success(false)
                        .message(message)
                        .qualityStatus("REJECTED")
                        .correlationId(glificWebhookRequest.getContactId())
                        .build();
            }

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

            return bfmReadingService.createReading(createReadingRequest, operator, contactId);

        } catch (ApiException ae) {
            log.warn("User error for contactId {}: {}", glificWebhookRequest.getContactId(), ae.getMessage());
            return CreateReadingResponse.builder()
                    .success(false)
                    .message(ae.getMessage())
                    .qualityStatus("REJECTED")
                    .correlationId(glificWebhookRequest.getContactId())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error processing image for contactId {}: {}", glificWebhookRequest.getContactId(), e.getMessage(), e);
            String fallbackMessage = "Something went wrong. Please try again."; // default fallback
            return CreateReadingResponse.builder()
                    .success(false)
                    .message(fallbackMessage)
                    .qualityStatus("REJECTED")
                    .correlationId(glificWebhookRequest.getContactId())
                    .build();
        }
    }

    public IntroResponse introMessage(IntroRequest introRequest){
        log.info("intro request received: {}", introRequest.getContactId());

        StateAdminConfig config = stateAdminConfigRepository.findByPhoneNumber(introRequest.getContactId())
                .orElseThrow(() -> new ApiException( "config not found for user with phone number: " + introRequest.getContactId(),
                        HttpStatus.NOT_FOUND));

        String languageCode = config.getLanguageCode();
        MessageTemplate messageTemplate = messageTemplateRepository.findByFlowNameAndLanguageCode("IntroMessage", languageCode)
                .orElseThrow(() -> new ApiException("Message template not found for flow type and language code " + languageCode,
                        HttpStatus.NOT_FOUND));

        String formattedMessage = formatTemplate(messageTemplate.getTemplateText());

        return IntroResponse.builder()
                .success(true)
                .message(formattedMessage)
                .build();
    }

    public ClosingResponse closingMessage(ClosingRequest closingRequest){
        log.info("closing request received: {}", closingRequest.getContactId());

        StateAdminConfig config = stateAdminConfigRepository.findByPhoneNumber(closingRequest.getContactId())
                .orElseThrow(() -> new ApiException( "config not found for user with phone number: " + closingRequest.getContactId(),
                        HttpStatus.NOT_FOUND));

        String languageCode = config.getLanguageCode();

        MessageTemplate messageTemplate = messageTemplateRepository.findByFlowNameAndLanguageCode("ThankYouMessage", languageCode)
                .orElseThrow(() -> new ApiException("Message template not found for flow type and language code " + languageCode,
                        HttpStatus.NOT_FOUND));

        String formattedMessage = formatTemplate(messageTemplate.getTemplateText());

        return ClosingResponse.builder()
                .success(true)
                .message(formattedMessage)
                .build();
    }

    private String formatTemplate(String templateText) {
        if (templateText == null || templateText.isBlank()) {
            return "";
        }
        return templateText
                .trim()
                .replace("\\n", "\n")
                .replaceAll("\n{3,}", "\n\n");
    }


    private String getLocalizedMessage(String contactId, String flowName) {
        StateAdminConfig config = stateAdminConfigRepository
                .findByPhoneNumber(contactId)
                .orElseThrow(() -> new ApiException(
                        "config not found for user with phone number: " + contactId,
                        HttpStatus.NOT_FOUND
                ));

        MessageTemplate template = messageTemplateRepository
                .findByFlowNameAndLanguageCode(flowName, config.getLanguageCode())
                .orElseThrow(() -> new ApiException(
                        "Message template not found for flow " + flowName,
                        HttpStatus.NOT_FOUND
                ));

        return formatTemplate(template.getTemplateText());
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


