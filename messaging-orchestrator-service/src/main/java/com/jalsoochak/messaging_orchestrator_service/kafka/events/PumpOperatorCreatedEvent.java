package com.jalsoochak.messaging_orchestrator_service.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PumpOperatorCreatedEvent {
    private Long personId;
    private String fullName;
    private String phoneNumber;
    private Instant createdAt;
}