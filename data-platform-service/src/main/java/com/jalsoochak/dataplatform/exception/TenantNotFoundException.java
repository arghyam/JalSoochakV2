package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class TenantNotFoundException extends CustomException {

    public TenantNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", message);
    }
    
    public TenantNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant with ID " + id + " not found");
    }
    
}
