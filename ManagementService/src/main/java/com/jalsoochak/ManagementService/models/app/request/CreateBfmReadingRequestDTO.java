package com.jalsoochak.ManagementService.models.app.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBfmReadingRequestDTO {

    @NotNull(message = "Scheme ID is required")
    private Long schemeId;

    @NotNull(message = "Operator ID is required")
    private Long operatorId;

    @NotNull(message = "Reading value is required")
    @Positive(message = "Reading value must be positive")
    private BigDecimal readingValue;

    @NotNull(message = "Reading time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime readingTime;
}