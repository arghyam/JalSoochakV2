package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class PersonSchemeMappingNotFoundException extends CustomException {

    public PersonSchemeMappingNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "PERSON_SCHEME_MAPPING_NOT_FOUND", message);
    }
    
    public PersonSchemeMappingNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "PERSON_SCHEME_MAPPING_NOT_FOUND", "Person Scheme Mapping with ID " + id + " not found");
    }
    
}
