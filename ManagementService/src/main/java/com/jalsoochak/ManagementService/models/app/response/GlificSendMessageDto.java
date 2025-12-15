package com.jalsoochak.ManagementService.models.app.response;

import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
public class GlificSendMessageDto {
    private String from;
    private String message;
    private Instant timestamp;
    private Map<String, Object> providerMetaData;
}
