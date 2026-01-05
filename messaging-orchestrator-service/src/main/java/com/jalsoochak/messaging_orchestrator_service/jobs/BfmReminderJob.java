package com.jalsoochak.messaging_orchestrator_service.jobs;

import com.jalsoochak.messaging_orchestrator_service.enums.MessageStatus;
import com.jalsoochak.messaging_orchestrator_service.enums.MessageType;
import com.jalsoochak.messaging_orchestrator_service.models.entities.Message;
import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import com.jalsoochak.messaging_orchestrator_service.repositories.MessageRepository;
import com.jalsoochak.messaging_orchestrator_service.repositories.PersonRepository;
import com.jalsoochak.messaging_orchestrator_service.services.GlificService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BfmReminderJob {
    private final PersonRepository personRepository;
    private final MessageRepository messageRepository;
    private final GlificService glificService;

//    @Scheduled(
//            cron = "0 0 5 * * ?",
//            zone = "Asia/Kolkata"
//    )
//    @SchedulerLock(
//            name = "BfmReminderJob_sendDailyReminder",
//            lockAtMostFor = "10m",
//            lockAtLeastFor = "1m"
//    )
@Scheduled(
        fixedRate = 60000 // runs every 1 minute
)
@SchedulerLock(
        name = "BfmReminderJob_sendDailyReminder",
        lockAtMostFor = "10m",
        lockAtLeastFor = "1m"
)
@Transactional
    public void sendDailyBfmReminder() {
        log.info("BFM reminder job started");
        List<PersonMaster> pumpOperators =
                personRepository.findByDeletedAtIsNullAndPersonType_cName("pump_operator");

        for (PersonMaster person : pumpOperators) {
//            boolean sentToday =
//                    messageRepository.existsBfmReminderSentToday(person.getId());
//
//            if (sentToday) {
//                continue;
//            }

            Long receiverId =
                    messageRepository.findLatestReceiverId(person.getId());

            log.info("receiverid for job: {}", receiverId);

            if (receiverId == null) {
                log.warn("Skipping personId={} (no receiverId)", person.getId());
                continue;
            }

            Message message = Message.builder()
                    .person(person)
                    .phoneNumber(person.getPhoneNumber())
                    .receiverId(receiverId)
                    .type(MessageType.BFM_REMINDER)
                    .status(MessageStatus.PENDING)
                    .createdAt(Instant.now())
                    .build();

            messageRepository.save(message);

            try {

                glificService.sendBfmReminderHsm(receiverId);

                message.setStatus(MessageStatus.SENT);
                message.setSentAt(Instant.now());
            } catch (Exception e) {
                message.setStatus(MessageStatus.FAILED);
                message.setErrorMessage(e.getMessage());
            }
        }
        log.info("BFM reminder job completed");
    }
}
