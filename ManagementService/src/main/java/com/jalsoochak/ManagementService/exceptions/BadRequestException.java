package com.jalsoochak.ManagementService.exceptions;

import java.util.List;
import java.util.Map;

public class BadRequestException extends RuntimeException {

    private final List<Map<String, String>> errors;

    public BadRequestException(String message) {
        super(message);
        this.errors = null;
    }

    public BadRequestException(String message, List<Map<String, String>> errors) {
        super(message);
        this.errors = errors;
    }

    public List<Map<String, String>> getErrors() {
        return errors;
    }
}
