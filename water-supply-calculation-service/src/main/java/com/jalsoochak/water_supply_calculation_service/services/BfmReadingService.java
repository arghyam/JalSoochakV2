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

    public CreateReadingResponse createReading(CreateReadingRequest request){
        String tenantId = TenantContext.getTenantId();

        SchemeMaster scheme = schemeRepository
                .findByIdAndTenantId(request.getSchemeId(), tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "State scheme not found"));

        Long schemeId = scheme.getId();

        PersonMaster operator = personRepository
                .findByIdAndTenantId(request.getOperatorId(), tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operator not found"));

        Long operatorId = operator.getId();

        boolean personBelongsToScheme = personSchemeRepository
                .findByPersonIdAndSchemeId(operatorId, schemeId)
                .isPresent();

        if (!personBelongsToScheme) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Operator does not belong to the specified scheme");
        }

        FlowVisionResult ocrResult = null;
        BigDecimal finalReading = request.getReadingValue();

        if (request.getReadingValue() != null && request.getReadingValue().compareTo(BigDecimal.ZERO) <= 0) {
            if (request.getReadingUrl() == null || request.getReadingUrl().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either readingValue or readingUrl must be provided");
            }
            //i need the flow vision api here
//            ocrResult = flowVisionService.extractReading(request.getReadingUrl());
//            if (ocrResult != null && ocrResult.getAdjustedReading() != null) {
//                finalReading = ocrResult.getAdjustedReading();
//            }
        }
        BfmReading reading = BfmReading.builder()
                .schemeId(schemeId)
                .personId(operatorId)
                .readingUrl(request.getReadingUrl())
                .extractedReading(finalReading)
                .confirmedReading(request.getReadingValue())
                .readingDateTime(Optional.ofNullable(request.getReadingTime()).orElse(LocalDateTime.now()))
                .correlationId(Optional.ofNullable(ocrResult)
                        .map(FlowVisionResult::getCorrelationId)
                        .orElse(UUID.randomUUID().toString()))
                .tenantId(tenantId)
                .build();

        bfmReadingRepository.save(reading);

        return CreateReadingResponse.builder()
                .correlationId(reading.getCorrelationId())
                .meterReading(finalReading)
                .qualityStatus(ocrResult != null ? ocrResult.getQualityStatus() : null)
                .qualityConfidence(ocrResult != null ? ocrResult.getQualityConfidence() : null)
                .lastConfirmedReading(
                        bfmReadingRepository.findTopBySchemeIdAndTenantIdOrderByReadingDateTimeDesc(schemeId, tenantId)
                                .map(BfmReading::getConfirmedReading)
                                .orElse(null)
                )
                .build();
    }
}
