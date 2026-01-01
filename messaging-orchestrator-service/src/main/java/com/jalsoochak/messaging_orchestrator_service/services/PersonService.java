package com.jalsoochak.messaging_orchestrator_service.services;

import com.jalsoochak.messaging_orchestrator_service.kafka.producers.EventProducerService;
import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import com.jalsoochak.messaging_orchestrator_service.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private final EventProducerService eventProducerService;

    @Transactional
    public void processAllPumpOperators() {
        log.info("Processing all pump operators...");

        List<PersonMaster> pumpOperators = personRepository
                .findByDeletedAtIsNullAndPersonType_cName("pump_operator");

        log.info("Found {} active pump operators", pumpOperators.size());

        for (PersonMaster operator : pumpOperators) {
            eventProducerService.publishPumpOperatorCreated(operator);
        }

        log.info("Finished processing {} pump operators", pumpOperators.size());
    }
    }
