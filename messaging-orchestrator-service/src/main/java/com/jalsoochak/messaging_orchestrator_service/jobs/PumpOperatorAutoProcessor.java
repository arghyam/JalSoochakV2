package com.jalsoochak.messaging_orchestrator_service.jobs;

import com.jalsoochak.messaging_orchestrator_service.enums.MessageStatus;
import com.jalsoochak.messaging_orchestrator_service.enums.MessageType;
import com.jalsoochak.messaging_orchestrator_service.kafka.producers.EventProducerService;
import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import com.jalsoochak.messaging_orchestrator_service.repositories.MessageRepository;
import com.jalsoochak.messaging_orchestrator_service.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PumpOperatorAutoProcessor {
    private final PersonRepository personRepository;
    private final EventProducerService eventProducerService;
    private final MessageRepository messageRepository;

    @Scheduled(fixedDelay = 60000)
    @SchedulerLock(
            name = "WelcomeMessageJob_sendWelcomeMessages",
            lockAtMostFor = "5m",
            lockAtLeastFor = "1m"
    )
    @Transactional
    public void processNewPumpOperators() {
        log.info("Auto-processing pump operators started");

        List<PersonMaster> pumpOperators =
                personRepository.findByDeletedAtIsNullAndPersonType_cName("pump_operator");

        int processed = 0;
        int skipped = 0;

        for (PersonMaster person : pumpOperators) {

            boolean alreadyProcessed =
                    messageRepository.existsByPersonAndTypeAndStatusIn(
                            person,
                            MessageType.WELCOME,
                            List.of(
                                    MessageStatus.PENDING,
                                    MessageStatus.SENT,
                                    MessageStatus.FAILED
                            )
                    );

            if (alreadyProcessed) {
                skipped++;
                continue;
            }

            eventProducerService.publishPumpOperatorCreated(person);
            processed++;
        }

        log.info("Auto-processing completed. processed={}, skipped={}",
                processed, skipped);
    }
}
