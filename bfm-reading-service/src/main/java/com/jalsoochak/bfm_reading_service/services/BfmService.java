package com.jalsoochak.bfm_reading_service.services;

import com.jalsoochak.bfm_reading_service.kafka.producer.ImageProcessorProducer;
import com.jalsoochak.bfm_reading_service.models.app.request.BfmRequestDto;
import com.jalsoochak.bfm_reading_service.models.entity.BfmReading;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BfmService {
    private final ImageProcessorProducer imageProcessorProducer;

    public BfmReading createReading(BfmRequestDto bfmRequestDto){
        log.debug("Creating dummy reading for request: {}", bfmRequestDto);

        BfmReading bfmReading = BfmReading.builder()
                .id(1L)
                .tenantId("tenant-123")
                .createdBy("system")
                .updatedBy("system")
                .deletedAt(null)
                .readingDateTime(LocalDateTime.now())
                .confirmedReading(new BigDecimal("123.4"))
                .extractedReading(new BigDecimal("123.4"))
                .readingUrl(bfmRequestDto.getReadingUrl()) // Use the URL from request
                .geolocation("POINT(77.5946 12.9716)")
                .correlationId(UUID.randomUUID().toString())
                .schemeId(101L)
                .personId(201L)
                .build();

        imageProcessorProducer.sendImageForProcessing(bfmRequestDto.getReadingUrl());

        return bfmReading;
    }
}