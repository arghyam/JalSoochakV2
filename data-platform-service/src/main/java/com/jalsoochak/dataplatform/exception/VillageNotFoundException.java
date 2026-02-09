package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class VillageNotFoundException extends CustomException {

    public VillageNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "VILLAGE_NOT_FOUND", message);
    }
    
    public VillageNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "VILLAGE_NOT_FOUND", "Village with ID " + id + " not found");
    }
    
}
