package com.jalsoochak.messaging_orchestrator_service.kafka.consumers;

import com.jalsoochak.messaging_orchestrator_service.enums.MessageStatus;
import com.jalsoochak.messaging_orchestrator_service.enums.MessageType;
import com.jalsoochak.messaging_orchestrator_service.kafka.events.PumpOperatorCreatedEvent;
import com.jalsoochak.messaging_orchestrator_service.models.entities.Message;
import com.jalsoochak.messaging_orchestrator_service.repositories.MessageRepository;
import com.jalsoochak.messaging_orchestrator_service.services.GlificService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WelcomeMessageConsumer {
    private final GlificService glificService;
    private final MessageRepository messageRepository;

    @KafkaListener(topics = "pump-operator-created", groupId = "welcome-message-group")
    @Transactional
    public void handlePumpOperatorCreated(PumpOperatorCreatedEvent event) {
        log.info("Processing welcome message for pump operator: {}", event.getPhoneNumber());
        try {
            Long receiverId = glificService.createContact(event.getFullName(), event.getPhoneNumber());
            log.info("Created contact with receiverId: {}", receiverId);

            glificService.optIn(event.getPhoneNumber());
            log.info("Opt-in successful for {}", event.getPhoneNumber());

            glificService.sendWelcomeHsm(receiverId);
            log.info("Welcome HSM sent to receiverId: {}", receiverId);

            List<Message> pendingMessages = messageRepository.findByPersonIdAndTypeAndStatus(
                    event.getPersonId(),
                    MessageType.WELCOME,
                    MessageStatus.PENDING
            );

            if (!pendingMessages.isEmpty()) {
                Message message = pendingMessages.get(0);
                message.setStatus(MessageStatus.SENT);
                message.setSentAt(Instant.now());
                messageRepository.save(message);
            }
        } catch (Exception e) {
            log.error("Failed to send welcome message for {}: {}",
                    event.getPhoneNumber(), e.getMessage(), e);

            List<Message> pendingMessages = messageRepository.findByPersonIdAndTypeAndStatus(
                    event.getPersonId(),
                    MessageType.WELCOME,
                    MessageStatus.PENDING
            );

            if (!pendingMessages.isEmpty()) {
                Message message = pendingMessages.get(0);
                message.setStatus(MessageStatus.FAILED);
                message.setErrorMessage(e.getMessage());
                messageRepository.save(message);
            }
        }
    }
}
