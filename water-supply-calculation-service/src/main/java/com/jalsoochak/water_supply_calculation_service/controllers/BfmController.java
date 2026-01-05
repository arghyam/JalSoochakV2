package com.jalsoochak.water_supply_calculation_service.controllers;

import com.jalsoochak.water_supply_calculation_service.models.app.requests.CreateReadingRequest;
import com.jalsoochak.water_supply_calculation_service.models.app.responses.CreateReadingResponse;
import com.jalsoochak.water_supply_calculation_service.services.BfmReadingService;
import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;

@RestController
@RequestMapping("/api/v2/water")
public class BfmController {
    private static final Logger log = LoggerFactory.getLogger(BfmController.class);
    private final BfmReadingService bfmReadingService;

    public BfmController(BfmReadingService bfmReadingService) {
        this.bfmReadingService = bfmReadingService;
    }

    @PostMapping("/bfm/readings")
    public ResponseEntity<CreateReadingResponse> createReading( @Valid @RequestBody CreateReadingRequest request){
        log.info("endpoint hit");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bfmReadingService.createReading(request));
    }
}
