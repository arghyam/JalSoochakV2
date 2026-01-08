package com.jalsoochak.water_supply_calculation_service.models.app.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlificWebhookRequest {
    private String contactId;
    private String messageType;
    private String mediaUrl;
    private String timestamp;
}
