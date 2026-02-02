package com.jalsoochak.water_supply_calculation_service.exceptions;

import com.jalsoochak.water_supply_calculation_service.models.app.responses.IntroResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<IntroResponse> handleApiException(ApiException ex) {

        log.error("Handled ApiException: {}", ex.getMessage());

        return ResponseEntity
                .status(ex.getStatus())
                .body(IntroResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build());
    }
}

