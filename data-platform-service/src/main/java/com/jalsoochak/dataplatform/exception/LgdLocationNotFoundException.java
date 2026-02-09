package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class LgdLocationNotFoundException extends CustomException {
    
    public LgdLocationNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "LGD_LOCATION_NOT_FOUND", message);
    }

    public LgdLocationNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "LGD_LOCATION_NOT_FOUND", "Lgd location with id " + id + " not found");
    }
}
