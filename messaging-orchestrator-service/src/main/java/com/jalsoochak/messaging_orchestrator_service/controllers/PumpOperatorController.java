package com.jalsoochak.messaging_orchestrator_service.controllers;

import com.jalsoochak.messaging_orchestrator_service.services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pump-operators")
@RequiredArgsConstructor
public class PumpOperatorController {
    private final PersonService personService;

    @PostMapping("/process-all")
    public ResponseEntity<String> processAllPumpOperators() {
        try {
            personService.processAllPumpOperators();
            return ResponseEntity.ok("Processing started for all pump operators");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error processing pump operators: " + e.getMessage());
        }
    }
}
