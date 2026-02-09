package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class PersonNotFoundException extends CustomException {
    
    public PersonNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "PERSON_NOT_FOUND", message);
    }
    
    public PersonNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "PERSON_NOT_FOUND", "Person with ID " + id + " not found");
    }
}
