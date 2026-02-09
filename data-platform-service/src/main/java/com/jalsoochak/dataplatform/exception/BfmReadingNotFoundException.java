package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class BfmReadingNotFoundException extends CustomException {

    public BfmReadingNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "BFM_READING_NOT_FOUND", message);
    }
    
    public BfmReadingNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "BFM_READING_NOT_FOUND", "BFM Reading with ID " + id + " not found");
    }
    
}
