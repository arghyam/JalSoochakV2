package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class SchemeNotFoundException extends CustomException {

    public SchemeNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "SCHEME_NOT_FOUND", message);
    }
    
    public SchemeNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "SCHEME_NOT_FOUND", "Scheme with ID " + id + " not found");
    }
}
