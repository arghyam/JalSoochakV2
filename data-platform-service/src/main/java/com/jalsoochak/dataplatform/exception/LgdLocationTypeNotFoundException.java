package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class LgdLocationTypeNotFoundException extends CustomException {

    public LgdLocationTypeNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "LGD_LOCATION_TYPE_NOT_FOUND", message);
    }

    public LgdLocationTypeNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "LGD_LOCATION_TYPE_NOT_FOUND", "Lgd location type with ID " + id + " not found");
    }
}
