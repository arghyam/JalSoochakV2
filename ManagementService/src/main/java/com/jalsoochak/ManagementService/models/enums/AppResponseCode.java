package com.jalsoochak.ManagementService.models.enums;

public enum AppResponseCode {
    SUCCESSFUL("0000", "SUCCESS", "Operation completed successfully"),
    VALIDATION_ERROR("0001", "VALIDATION_ERROR", "Validation failed"),
    NOT_FOUND("0002", "NOT_FOUND", "Resource not found"),
    INTERNAL_ERROR("0003", "INTERNAL_ERROR", "Internal server error"),
    BAD_REQUEST("0004", "BAD_REQUEST", "Bad request"),
    UNAUTHORIZED("0005", "UNAUTHORIZED", "Unauthorized access"),
    FORBIDDEN("0006", "FORBIDDEN", "Access forbidden");

    private final String code;
    private final String status;
    private final String message;

    AppResponseCode(String code, String status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }
}
