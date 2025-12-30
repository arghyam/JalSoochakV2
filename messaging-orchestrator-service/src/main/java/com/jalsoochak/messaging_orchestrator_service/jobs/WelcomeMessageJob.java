package com.jalsoochak.messaging_orchestrator_service.jobs;

import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import com.jalsoochak.messaging_orchestrator_service.repositories.PersonRepository;
import com.jalsoochak.messaging_orchestrator_service.services.GlificService;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WelcomeMessageJob {
    private static final Logger log = LoggerFactory.getLogger(WelcomeMessageJob.class);

    private final PersonRepository personRepository;
    private final GlificService glificService;

    public WelcomeMessageJob(PersonRepository personRepository, GlificService glificService) {
        this.personRepository = personRepository;
        this.glificService = glificService;
    }

    @Scheduled(fixedDelay = 60000)
    @SchedulerLock(
            name = "WelcomeMessageJob_sendWelcomeMessages",
            lockAtMostFor = "5m",
            lockAtLeastFor = "1m"
    )
    public void sendWelcomeMessages() {
        List<PersonMaster> persons = personRepository
                .findByWelcomeSentFalseAndDeletedAtIsNullAndPersonType_CName("pump_operator");

        log.info("Found {} persons to send welcome HSM", persons.size());

        for (PersonMaster person : persons) {
            try {
                log.info("Processing person: {} ({})", person.getFullName(), person.getPhoneNumber());

                Long receiverId = glificService.createContact(person.getFullName(), person.getPhoneNumber());
                log.info("Created contact with receiverId: {}", receiverId);

                glificService.optIn(person.getPhoneNumber());
                log.info("Opt-in successful for {}", person.getPhoneNumber());

                glificService.sendWelcomeHsm(receiverId);
                log.info("Welcome HSM sent to receiverId: {}", receiverId);

                person.setWelcomeSent(true);
                personRepository.save(person);
                log.info("Marked welcomeSent=true for {}", person.getPhoneNumber());

            } catch (Exception e) {
                log.error("Welcome HSM failed for {}: {}", person.getPhoneNumber(), e.getMessage(), e);
            }
        }
    }
}
