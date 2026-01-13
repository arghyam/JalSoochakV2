package com.jalsoochak.water_supply_calculation_service.models.app.responses;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FlowVisionResult {

    private BigDecimal adjustedReading;

    private String correlationId;

    private String qualityStatus;

    private BigDecimal qualityConfidence;
}
