package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class PersonTypeNotFoundException extends CustomException {
    
    public PersonTypeNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "PERSON_TYPE_NOT_FOUND", message);
    }
    
    public PersonTypeNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "PERSON_TYPE_NOT_FOUND", "Person type with ID " + id + " not found");
    }
}
