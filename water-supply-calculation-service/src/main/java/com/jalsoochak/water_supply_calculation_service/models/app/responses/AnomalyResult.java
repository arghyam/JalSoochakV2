package com.jalsoochak.water_supply_calculation_service.models.app.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnomalyResult {
    private boolean valid;
    private String reason;
}
