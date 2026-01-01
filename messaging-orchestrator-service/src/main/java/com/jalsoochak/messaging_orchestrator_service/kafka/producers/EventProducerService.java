package com.jalsoochak.messaging_orchestrator_service.kafka.producers;

import com.jalsoochak.messaging_orchestrator_service.enums.MessageStatus;
import com.jalsoochak.messaging_orchestrator_service.enums.MessageType;
import com.jalsoochak.messaging_orchestrator_service.kafka.events.PumpOperatorCreatedEvent;
import com.jalsoochak.messaging_orchestrator_service.models.entities.Message;
import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import com.jalsoochak.messaging_orchestrator_service.repositories.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventProducerService {
    private final KafkaTemplate<String, PumpOperatorCreatedEvent> kafkaTemplate;
    private final MessageRepository messageRepository;

    public void publishPumpOperatorCreated(PersonMaster person) {
        try {
            boolean hasWelcomeMessage = messageRepository.existsByPersonAndTypeAndStatusIn(
                    person,
                    MessageType.WELCOME,
                    java.util.List.of(MessageStatus.PENDING, MessageStatus.SENT)
            );
            if (hasWelcomeMessage) {
                log.info("Welcome message already exists for person: {}", person.getPhoneNumber());
                return;
            }
            Message message = Message.builder()
                    .phoneNumber(person.getPhoneNumber())
                    .person(person)
                    .type(MessageType.WELCOME)
                    .status(MessageStatus.PENDING)
                    .createdAt(Instant.now())
                    .build();
            messageRepository.save(message);

            PumpOperatorCreatedEvent event = new PumpOperatorCreatedEvent(
                    person.getId(),
                    person.getFullName(),
                    person.getPhoneNumber(),
                    Instant.now()
            );
            kafkaTemplate.send("pump-operator-created", person.getPhoneNumber(), event)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish event for person {}: {}",
                                    person.getId(), ex.getMessage());
                            message.setStatus(MessageStatus.FAILED);
                            message.setErrorMessage("Failed to publish event: " + ex.getMessage());
                            messageRepository.save(message);
                        } else {
                            log.info("Published pump operator created event for {}",
                                    person.getPhoneNumber());
                        }
                    });
        } catch (Exception e){
            log.error("Error publishing event for person {}: {}",
                    person.getId(), e.getMessage(), e);
        }
    }
}
