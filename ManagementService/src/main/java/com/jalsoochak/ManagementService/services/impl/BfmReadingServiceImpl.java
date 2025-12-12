package com.jalsoochak.ManagementService.services.impl;



import com.jalsoochak.ManagementService.exceptions.InvalidRequestException;
import com.jalsoochak.ManagementService.exceptions.ResourceNotFoundException;
import com.jalsoochak.ManagementService.models.app.request.CreateBfmReadingRequestDTO;
import com.jalsoochak.ManagementService.models.app.response.CreateBfmReadingResponseDTO;
import com.jalsoochak.ManagementService.models.entity.BfmReading;
import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.SchemeMaster;
import com.jalsoochak.ManagementService.repositories.BfmReadingRepository;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import com.jalsoochak.ManagementService.repositories.SchemeMasterRepository;
import com.jalsoochak.ManagementService.services.service.BfmReadingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BfmReadingServiceImpl implements BfmReadingService {

    private final BfmReadingRepository bfmReadingRepository;
    private final SchemeMasterRepository schemeMasterRepository;
    private final PersonMasterRepository personMasterRepository;

    @Override
    @Transactional
    public CreateBfmReadingResponseDTO createBfmReading(
            String tenantId,
            CreateBfmReadingRequestDTO request) {

        log.info("Creating BFM reading for tenant: {}, scheme: {}, operator: {}",
                tenantId, request.getSchemeId(), request.getOperatorId());

        // Validate tenant ID
        if (tenantId == null || tenantId.isBlank()) {
            throw new InvalidRequestException("Tenant ID cannot be empty");
        }

        // Fetch and validate scheme
        SchemeMaster scheme = schemeMasterRepository
                .findByIdAndDeletedAtIsNull(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scheme not found with ID: " + request.getSchemeId()));

        // Fetch and validate operator (person)
        PersonMaster operator = personMasterRepository
                .findByIdAndDeletedAtIsNull(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Operator not found with ID: " + request.getOperatorId()));

        // TODO: Validate that scheme and operator belong to the same tenant
        // This ensures data isolation in multi-tenant environment

        // Generate correlation ID (UUID) for submission tracking
        String correlationId = UUID.randomUUID().toString();

        // Create BFM Reading entity
        BfmReading bfmReading = BfmReading.builder()
                .tenantId(tenantId)
                .scheme(scheme)
                .person(operator)
                .confirmedReading(request.getReadingValue())
                .readingDateTime(request.getReadingTime())
                .correlationId(correlationId)
                // Note: readingDateTime should NOT use @CreationTimestamp if we want
                // to accept it from the request. Consider updating entity annotation.
                // TODO: Set createdBy from authentication context (JWT token)
                .build();

        // Save to database
        BfmReading savedReading = bfmReadingRepository.save(bfmReading);

        log.info("BFM reading created successfully with correlation ID: {}", correlationId);

        // Calculate quantity in litres
        BigDecimal computedQuantity = calculateQuantityInLitres(
                scheme,
                request.getReadingValue());

        // Build and return response
        return CreateBfmReadingResponseDTO.builder()
                .submissionId(correlationId)
                .computedQuantityLitre(computedQuantity)
                .build();
    }

    /**
     * Calculate quantity in litres based on reading value and scheme parameters.
     *
     * TODO: Implement actual business logic for quantity calculation.
     * This could involve:
     * - Scheme-specific conversion factors
     * - Meter specifications (flow rate, calibration)
     * - Time-based calculations
     * - Historical reading comparisons
     *
     * Current implementation uses a placeholder formula.
     */
    private BigDecimal calculateQuantityInLitres(
            SchemeMaster scheme,
            BigDecimal readingValue) {

        // PLACEHOLDER LOGIC - Replace with actual business logic
        // Example: 1 reading unit = 5 litres
        BigDecimal conversionFactor = new BigDecimal("5.0");

        BigDecimal computedQuantity = readingValue
                .multiply(conversionFactor)
                .setScale(1, RoundingMode.HALF_UP);

        log.debug("Calculated quantity: {} litres for reading: {}",
                computedQuantity, readingValue);

        return computedQuantity;

        // Possible real implementation:
        // return schemeService.calculateWaterQuantity(scheme.getId(), readingValue);
        // Or:
        // BigDecimal previousReading = getLastReading(scheme.getId());
        // BigDecimal consumption = readingValue.subtract(previousReading);
        // return consumption.multiply(scheme.getMeterConversionFactor());
    }
}

// ============================================================================
// 9. CONTROLLER
// ============================================================================
