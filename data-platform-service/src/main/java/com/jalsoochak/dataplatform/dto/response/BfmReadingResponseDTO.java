package com.jalsoochak.dataplatform.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BfmReadingResponseDTO {
    
    private Long id;
    private String tenantId;
    private LocalDateTime readingDateTime;
    private BigDecimal confirmedReading;
    private BigDecimal extractedReading;
    private String readingUrl;
    private String geolocation;
    private String correlationId;
    private Long schemeId;
    private Long personId;
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
    private Long deletedBy;
    private LocalDateTime deletedAt;
    
}
