package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class VillageSchemeMappingNotFoundException extends CustomException {

    public VillageSchemeMappingNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "VILLAGE_SCHEME_MAPPING_NOT_FOUND", message);
    }
    
    public VillageSchemeMappingNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "VILLAGE_SCHEME_MAPPING_NOT_FOUND", "Village Scheme Mapping with ID " + id + " not found");
    }
    
}
