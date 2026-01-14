package com.jalsoochak.water_supply_calculation_service.models.app.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageAnalysisResponse {
    private String contactId;
    private String imageUrl;
    private String status;
    private String reason;
}
