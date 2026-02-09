package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class AdministrativeLocationTypeNotFoundException extends CustomException {

    public AdministrativeLocationTypeNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "ADMINISTRATIVE_LOCATION_TYPE_NOT_FOUND", message);
    }

    public AdministrativeLocationTypeNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "ADMINISTRATIVE_LOCATION_TYPE_NOT_FOUND", "Administrative location type with ID " + id + " not found");
    }
}
