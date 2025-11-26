package com.jalsoochak.bfm_reading_service.models.app.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class ApiResponse {
    private Boolean success;
    private Object data;
    private List<Object> errors;
    private String code;
    private String message;
}