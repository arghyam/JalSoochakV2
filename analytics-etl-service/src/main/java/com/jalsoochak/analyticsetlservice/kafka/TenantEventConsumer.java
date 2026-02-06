package com.jalsoochak.analyticsetlservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jalsoochak.analyticsetlservice.dto.TenantEventDTO;
import com.jalsoochak.analyticsetlservice.service.TenantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for tenant events.
 * 
 * Listens to tenant.events topic and routes based on event_type:
 * - TENANT_CREATED: Creates a new tenant entry in dim_tenant (requires tenant_code, tenant_name)
 * - TENANT_UPDATED: Updates an existing tenant entry in dim_tenant (requires tenant_code)
 * - TENANT_DELETED: Deletes a tenant entry from dim_tenant (requires tenant_id or tenant_code)
 */
@Component
public class TenantEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(TenantEventConsumer.class);

    private static final String EVENT_TENANT_CREATED = "TENANT_CREATED";
    private static final String EVENT_TENANT_UPDATED = "TENANT_UPDATED";
    private static final String EVENT_TENANT_DELETED = "TENANT_DELETED";

    private final TenantService tenantService;
    private final ObjectMapper objectMapper;

    public TenantEventConsumer(TenantService tenantService, ObjectMapper objectMapper) {
        this.tenantService = tenantService;
        this.objectMapper = objectMapper;
    }

    /**
     * Consume messages from tenant.events topic
     * 
     * Expected JSON formats vary by event_type:
     * 
     * TENANT_CREATED:
     * {
     *   "event_type": "TENANT_CREATED",
     *   "tenant_code": "STATE_CODE",
     *   "tenant_name": "State Name",
     *   "country_code": "IN",
     *   "config": "{}",
     *   "is_active": true
     * }
     * 
     * TENANT_UPDATED:
     * {
     *   "event_type": "TENANT_UPDATED",
     *   "tenant_code": "STATE_CODE",
     *   "tenant_name": "Updated Name"  // partial updates allowed
     * }
     * 
     * TENANT_DELETED:
     * {
     *   "event_type": "TENANT_DELETED",
     *   "tenant_id": 123
     * }
     * // or
     * {
     *   "event_type": "TENANT_DELETED",
     *   "tenant_code": "STATE_CODE"
     * }
     * 
     * @param message Raw JSON message payload
     */
    @KafkaListener(topics = "tenant.events", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeTenantEvent(String message) {
        log.info("Received tenant event: {}", message);

        try {
            TenantEventDTO eventDTO = objectMapper.readValue(message, TenantEventDTO.class);
            String eventType = eventDTO.getEventType();

            if (eventType == null || eventType.isBlank()) {
                log.error("Invalid tenant event: event_type is required. Message: {}", message);
                return;
            }

            switch (eventType) {
                case EVENT_TENANT_CREATED:
                    handleTenantCreated(eventDTO, message);
                    break;
                case EVENT_TENANT_UPDATED:
                    handleTenantUpdated(eventDTO, message);
                    break;
                case EVENT_TENANT_DELETED:
                    handleTenantDeleted(eventDTO, message);
                    break;
                default:
                    log.debug("Ignoring unhandled tenant event type: {}", eventType);
            }

        } catch (JsonProcessingException e) {
            log.error("Failed to parse tenant event JSON: {}. Error: {}", message, e.getMessage());
        } catch (Exception e) {
            log.error("Failed to process tenant event: {}. Error: {}", message, e.getMessage(), e);
        }
    }

    // This method is used to handle the TENANT_CREATED event.
    private void handleTenantCreated(TenantEventDTO eventDTO, String message) {
        if (!validateRequiredFields(eventDTO, message)) {
            return;
        }

        tenantService.upsertTenant(eventDTO);
        log.info("Successfully processed TENANT_CREATED for tenant_code: {}", eventDTO.getTenantCode());
    }


    // This method is used to handle the TENANT_UPDATED event.
    private void handleTenantUpdated(TenantEventDTO eventDTO, String message) {
        if (eventDTO.getTenantCode() == null || eventDTO.getTenantCode().isBlank()) {
            log.error("Invalid TENANT_UPDATED event: tenant_code is required. Message: {}", message);
            return;
        }

        tenantService.upsertTenant(eventDTO);
        log.info("Successfully processed TENANT_UPDATED for tenant_code: {}", eventDTO.getTenantCode());
    }


    // This method is used to handle the TENANT_DELETED event.
    private void handleTenantDeleted(TenantEventDTO eventDTO, String message) {
        // TENANT_DELETED can use either tenant_id or tenant_code
        boolean deleted = false;

        if (eventDTO.getTenantId() != null) {
            deleted = tenantService.deleteTenantById(eventDTO.getTenantId());
            if (deleted) {
                log.info("Successfully processed TENANT_DELETED for tenant_id: {}", eventDTO.getTenantId());
            }
        } else if (eventDTO.getTenantCode() != null && !eventDTO.getTenantCode().isBlank()) {
            deleted = tenantService.deleteTenantByCode(eventDTO.getTenantCode());
            if (deleted) {
                log.info("Successfully processed TENANT_DELETED for tenant_code: {}", eventDTO.getTenantCode());
            }
        } else {
            log.error("Invalid TENANT_DELETED event: tenant_id or tenant_code is required. Message: {}", message);
            return;
        }

        if (!deleted) {
            log.warn("TENANT_DELETED: Tenant not found. Message: {}", message);
        }
    }


    // This method is used to validate the required fields for the tenant event.
    private boolean validateRequiredFields(TenantEventDTO eventDTO, String message) {
        if (eventDTO.getTenantCode() == null || eventDTO.getTenantCode().isBlank()) {
            log.error("Invalid tenant event: tenant_code is required. Message: {}", message);
            return false;
        }

        if (eventDTO.getTenantName() == null || eventDTO.getTenantName().isBlank()) {
            log.error("Invalid tenant event: tenant_name is required. Message: {}", message);
            return false;
        }

        return true;
    }
}
