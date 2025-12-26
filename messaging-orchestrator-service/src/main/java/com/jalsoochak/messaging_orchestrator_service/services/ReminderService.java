package com.jalsoochak.messaging_orchestrator_service.services;

import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import com.jalsoochak.messaging_orchestrator_service.repositories.BfmReadingRepository;
import com.jalsoochak.messaging_orchestrator_service.repositories.PersonRepository;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class ReminderService {

    private final PersonRepository personRepository;
    private final GlificService glificService;
    private final BfmReadingRepository bfmReadingRepository;

    public ReminderService(PersonRepository personRepository,
                           GlificService glificService,
                           BfmReadingRepository bfmReadingRepository) {
        this.personRepository = personRepository;
        this.glificService = glificService;
        this.bfmReadingRepository = bfmReadingRepository;
    }

    @Scheduled(cron = "0 0 6 * * *", zone = "Asia/Kolkata")
    @SchedulerLock(name = "dailyMeterReadingReminder", lockAtMostFor = "10m", lockAtLeastFor = "5m")
    public void sendDailyMeterReadingReminders() {
        List<PersonMaster> operators = personRepository.findAllOperators("Jal Mitra");

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        for (PersonMaster operator : operators) {
            boolean alreadySubmitted = bfmReadingRepository.existsReadingForPersonOnDate(
                    operator.getId(),
                    startOfDay,
                    endOfDay
            );

            if (alreadySubmitted) continue;

            String phone = operator.getPhoneNumber();
            String message = "Good morning! Please send today’s meter reading.";

            glificService.sendWhatsAppMessage(phone, message);
        }
    }
}
