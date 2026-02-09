package com.jalsoochak.dataplatform.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBfmReadingRequestDTO {
    
    @NotBlank(message = "Tenant ID cannot be blank")
    private String tenantId;
    
    @NotNull(message = "Confirmed reading cannot be null")
    private BigDecimal confirmedReading;
    
    private BigDecimal extractedReading;
    
    private String readingUrl;
    
    private String geolocation;
    
    @NotBlank(message = "Correlation ID cannot be blank")
    private String correlationId;
    
    @NotNull(message = "Scheme ID cannot be null")
    private Long schemeId;
    
    @NotNull(message = "Person ID cannot be null")
    private Long personId;
    
}
