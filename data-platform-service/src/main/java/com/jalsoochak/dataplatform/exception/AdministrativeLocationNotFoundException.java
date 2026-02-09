package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class AdministrativeLocationNotFoundException extends CustomException {
    
    public AdministrativeLocationNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "ADMINISTRATIVE_LOCATION_NOT_FOUND", message);
    }

    public AdministrativeLocationNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "ADMINISTRATIVE_LOCATION_NOT_FOUND", "Administrative location with ID " + id + " not found");
    }
}
