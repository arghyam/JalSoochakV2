package com.jalsoochak.water_supply_calculation_service.exceptions;

import lombok.Builder;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;

/**
 * Global exception handler for all webhook endpoints.
 * Ensures HTTP 200 responses even on errors.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Data
    @Builder
    static class GenericWebhookResponse {
        private boolean success;
        private String message;
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<GenericWebhookResponse> handleApiException(ApiException ex) {
        log.warn("Handled ApiException: {}", ex.getMessage());
        return ResponseEntity.ok(GenericWebhookResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericWebhookResponse> handleGenericException(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.ok(GenericWebhookResponse.builder()
                .success(false)
                .message("Something went wrong. Please try again.")
                .build());
    }
}
