package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.exceptions.ApiException;
import com.jalsoochak.water_supply_calculation_service.models.app.requests.CreateReadingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.CreateReadingResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.FlowVisionResult;
import com.jalsoochak.water_supply_calculation_service.models.entities.BfmReading;
import com.jalsoochak.water_supply_calculation_service.models.entities.MessageTemplate;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonMaster;
import com.jalsoochak.water_supply_calculation_service.models.entities.SchemeMaster;
import com.jalsoochak.water_supply_calculation_service.models.entities.StateAdminConfig;
import com.jalsoochak.water_supply_calculation_service.repositories.BfmReadingRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.MessageTemplateRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonSchemeRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.SchemeRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.StateAdminConfigRepository;
import com.jalsoochak.water_supply_calculation_service.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BfmReadingService {

    private final SchemeRepository schemeRepository;
    private final PersonRepository personRepository;
    private final PersonSchemeRepository personSchemeRepository;
    private final BfmReadingRepository bfmReadingRepository;
    private final FlowVisionService flowVisionService;
    private final StateAdminConfigRepository stateAdminConfigRepository;
    private final MessageTemplateRepository messageTemplateRepository;

    public CreateReadingResponse createReading(CreateReadingRequest request, PersonMaster person, String contactId) {

        String tenantId = person.getTenantId();

        SchemeMaster scheme = schemeRepository
                .findByIdAndTenantId(request.getSchemeId(), tenantId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "State scheme not found")
                );

        PersonMaster operator = personRepository
                .findByIdAndTenantId(request.getOperatorId(), tenantId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Operator not found")
                );

        boolean belongsToScheme = personSchemeRepository
                .findByPerson_IdAndScheme_Id(request.getOperatorId(), request.getSchemeId())
                .isPresent();

        if (!belongsToScheme) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator does not belong to the specified scheme"
            );
        }

        FlowVisionResult ocrResult = null;
        BigDecimal finalReading = request.getReadingValue();
        String message = "Reading created successfully";
        BigDecimal confidenceLevel = null;

        if (finalReading == null) {

            if (request.getReadingUrl() == null || request.getReadingUrl().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Either readingValue or readingUrl must be provided"
                );
            }

            try {
                ocrResult = flowVisionService.extractReading(request.getReadingUrl());
                log.info("ocr result: {}", ocrResult);
                if (ocrResult == null || ocrResult.getAdjustedReading() == null) {
                    message = getLocalizedMessage(person, "OCRNoReadingMessage");
                } else {
                    finalReading = ocrResult.getAdjustedReading();
                    confidenceLevel = ocrResult.getQualityConfidence();
                }

            } catch (Exception ex) {
                log.error("FlowVision OCR failed for URL: {}", request.getReadingUrl(), ex);

                message = getLocalizedMessage(person, "OCRFailedMessage");

                return CreateReadingResponse.builder()
                        .success(false)
                        .message(message)
                        .correlationId(UUID.randomUUID().toString())
                        .build();
            }

        }

        boolean isValid = finalReading != null
                && finalReading.compareTo(BigDecimal.ZERO) > 0
                && (confidenceLevel == null || confidenceLevel.compareTo(BigDecimal.valueOf(0.7)) >= 0);

        BfmReading reading = BfmReading.builder()
                .scheme(scheme)
                .person(operator)
                .readingUrl(request.getReadingUrl())
                .extractedReading(
                        ocrResult != null ? ocrResult.getAdjustedReading() : null
                )
                .confirmedReading(
                        request.getReadingValue() != null
                                ? request.getReadingValue()
                                : finalReading
                )
                .qualityConfidence(confidenceLevel)
                .readingDateTime(
                        Optional.ofNullable(request.getReadingTime())
                                .orElse(LocalDateTime.now())
                )
                .correlationId(
                        Optional.ofNullable(ocrResult)
                                .map(FlowVisionResult::getCorrelationId)
                                .orElse(UUID.randomUUID().toString())
                )
                .tenantId(tenantId)
                .build();

        bfmReadingRepository.save(reading);

        BigDecimal lastConfirmedReading = bfmReadingRepository
                .findTopByScheme_IdAndTenantIdAndIdNotAndConfirmedReadingGreaterThanAndQualityConfidenceGreaterThanEqualOrderByReadingDateTimeDesc(
                        scheme.getId(),
                        tenantId,
                        reading.getId(),
                        BigDecimal.ZERO,
                        0.7
                )
                .map(BfmReading::getConfirmedReading)
                .orElse(null);

        String finalMessage;
        if(isValid){
            finalMessage = getReadingResultMessage(contactId,  finalReading, lastConfirmedReading);
        } else if (finalReading == null || finalReading.compareTo(BigDecimal.ZERO) <= 0){
            finalMessage = getLocalizedMessage(person, "InvalidReadingMessage");
        } else {
            finalMessage = getLocalizedMessage(person, "LowConfidenceMessage");
        }
        return CreateReadingResponse.builder()
                .success(isValid)
                .message(finalMessage)
                .correlationId(reading.getCorrelationId())
                .meterReading(finalReading)
                .qualityConfidence(confidenceLevel)
                .qualityStatus(ocrResult != null ? ocrResult.getQualityStatus() : null)
                .lastConfirmedReading(lastConfirmedReading)
                .build();
    }

    private String getLocalizedMessage(PersonMaster person, String flowName) {

        StateAdminConfig config = stateAdminConfigRepository
                .findByPhoneNumber(person.getPhoneNumber())
                .orElseThrow(() -> new ApiException(
                        "config not found for user with phone number: " + person.getPhoneNumber(),
                        HttpStatus.NOT_FOUND
                ));

        MessageTemplate template = messageTemplateRepository
                .findByFlowNameAndLanguageCode(flowName, config.getLanguageCode())
                .orElseThrow(() -> new ApiException(
                        "Message template not found for flow " + flowName +
                                " and language " + config.getLanguageCode(),
                        HttpStatus.NOT_FOUND
                ));

        return formatTemplates(template.getTemplateText());
    }

    private String formatTemplates(String templateText) {
        if (templateText == null || templateText.isBlank()) {
            return "";
        }
        return templateText
                .trim()
                .replace("\\n", "\n")
                .replaceAll("\n{3,}", "\n\n");
    }


    private String getReadingResultMessage(
            String contactId,
            BigDecimal currentReading,
            BigDecimal lastConfirmedReading
    ) {
        StateAdminConfig config = stateAdminConfigRepository.findByPhoneNumber(contactId)
                .orElseThrow(() -> new ApiException( "config not found for user with phone number: " + contactId,
                        HttpStatus.NOT_FOUND));

        MessageTemplate template = messageTemplateRepository
                .findByFlowNameAndLanguageCode(
                        "ReadingResultMessage",
                        config.getLanguageCode()
                )
                .orElseThrow(() -> new ApiException(
                        "Reading result message template not found",
                        HttpStatus.NOT_FOUND
                ));

        return formatTemplate(
                template.getTemplateText(),
                currentReading,
                lastConfirmedReading
        );
    }

    @Transactional
    public CreateReadingResponse updateConfirmedReading(
            String correlationId,
            BigDecimal confirmedReading
    ) {
        String tenantId = TenantContext.getTenantId();

        if (correlationId == null || correlationId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "correlationId must be provided"
            );
        }

        if (confirmedReading == null || confirmedReading.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "confirmedReading must be a non-negative number"
            );
        }

        BfmReading reading = bfmReadingRepository
                .findByCorrelationIdAndTenantId(correlationId, tenantId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Reading not found"
                        )
                );

        reading.setConfirmedReading(confirmedReading);
        bfmReadingRepository.save(reading);

        return CreateReadingResponse.builder()
                .success(true)
                .message("Reading updated successfully")
                .correlationId(reading.getCorrelationId())
                .meterReading(confirmedReading)
                .qualityStatus("CONFIRMED")
                .build();
    }

    private String formatTemplate(
            String template,
            BigDecimal currentReading,
            BigDecimal lastReading
    ) {
        return template
                .replace("{current_reading}",
                        currentReading != null ? currentReading.toPlainString() : "-")
                .replace("{last_reading}",
                        lastReading != null ? lastReading.toPlainString() : "N/A");
    }
}
