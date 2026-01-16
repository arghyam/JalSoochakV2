package com.jalsoochak.water_supply_calculation_service.services;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.CreateReadingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.CreateReadingResponse;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.FlowVisionResult;
import com.jalsoochak.water_supply_calculation_service.models.entities.BfmReading;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonMaster;
import com.jalsoochak.water_supply_calculation_service.models.entities.SchemeMaster;
import com.jalsoochak.water_supply_calculation_service.repositories.BfmReadingRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.PersonSchemeRepository;
import com.jalsoochak.water_supply_calculation_service.repositories.SchemeRepository;
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

    public CreateReadingResponse createReading(CreateReadingRequest request) {

        String tenantId = TenantContext.getTenantId();

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
                    message = "Image processed but meter reading could not be detected clearly";
                } else {
                    finalReading = ocrResult.getAdjustedReading();
                }

            } catch (Exception ex) {
                log.error("FlowVision OCR failed for URL: {}", request.getReadingUrl(), ex);

                message = "Image could not be processed. Please upload a clearer image.";

                return CreateReadingResponse.builder()
                        .success(false)
                        .message(message)
                        .correlationId(UUID.randomUUID().toString())
                        .build();
            }
        }

        if (finalReading == null) {
            return CreateReadingResponse.builder()
                    .success(false)
                    .message("Meter reading could not be determined. Please retry.")
                    .correlationId(UUID.randomUUID().toString())
                    .build();
        }

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

        return CreateReadingResponse.builder()
                .success(true)
                .message(message)
                .correlationId(reading.getCorrelationId())
                .meterReading(finalReading)
                .qualityStatus(ocrResult != null ? ocrResult.getQualityStatus() : null)
                .qualityConfidence(ocrResult != null ? ocrResult.getQualityConfidence() : null)
                .lastConfirmedReading(
                        bfmReadingRepository
                                .findTopByScheme_IdAndTenantIdOrderByReadingDateTimeDesc(
                                        scheme.getId(), tenantId
                                )
                                .map(BfmReading::getConfirmedReading)
                                .orElse(null)
                )
                .build();
    }
}
