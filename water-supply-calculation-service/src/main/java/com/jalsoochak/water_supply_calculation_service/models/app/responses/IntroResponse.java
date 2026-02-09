package com.jalsoochak.water_supply_calculation_service.models.app.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IntroResponse {
    private boolean success;
    private String message;
}
