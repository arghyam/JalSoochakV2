package com.jalsoochak.ManagementService.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", ex.getStatusCode().value());

        HttpStatus httpStatus = HttpStatus.resolve(ex.getStatusCode().value());
        body.put("error", httpStatus != null ? httpStatus.getReasonPhrase() : "Error");

        body.put("message", ex.getReason());
        return new ResponseEntity<>(body, ex.getStatusCode());
    }


}

