package com.jalsoochak.bfm_reading_service.controllers;

import com.jalsoochak.bfm_reading_service.models.app.request.BfmRequestDto;
import com.jalsoochak.bfm_reading_service.models.app.response.ApiResponse;
import com.jalsoochak.bfm_reading_service.models.entity.BfmReading;
import com.jalsoochak.bfm_reading_service.models.enums.AppResponseCode;
import com.jalsoochak.bfm_reading_service.services.BfmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api/readings")
@RequiredArgsConstructor
public class BfmController {

    private final BfmService bfmService;

    @PostMapping("/createReadings")
    public ApiResponse createBfmReading(@RequestBody BfmRequestDto bfmRequestDto) {
        BfmReading bfmReading = bfmService.createReading(bfmRequestDto);

        return ApiResponse.builder()
                .success(true)
                .data(bfmReading)
                .errors(null)
                .code(AppResponseCode.SUCCESSFUL.getCode())
                .message("Reading created successfully")
                .build();
    }
}
