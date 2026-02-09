package com.jalsoochak.dataplatform.exception;

import org.springframework.http.HttpStatus;

public class DuplicatePhoneNumberException extends CustomException {
    
    public DuplicatePhoneNumberException(String phoneNumber) {
        super(HttpStatus.CONFLICT, "DUPLICATE_PHONE_NUMBER", 
              "Phone number " + phoneNumber + " is already registered");
    }
}
