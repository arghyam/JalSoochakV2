package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.models.app.response.GlificSendMessageDto;
import com.jalsoochak.ManagementService.models.entity.Message;
import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.enums.Channel;
import com.jalsoochak.ManagementService.models.enums.Direction;
import com.jalsoochak.ManagementService.repositories.MessageRepository;
import com.jalsoochak.ManagementService.repositories.PersonMasterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class GlificService {
    private final MessageRepository messageRepository;
    private final PersonMasterRepository personMasterRepository;

    public GlificService(MessageRepository messageRepository, PersonMasterRepository personMasterRepository) {
        this.messageRepository = messageRepository;
        this.personMasterRepository = personMasterRepository;
    }

    @Transactional
    public void handleInboundMessage(GlificSendMessageDto glificSendMessageDto) {
        PersonMaster person = personMasterRepository.findByPhoneNumber(glificSendMessageDto.getFrom()).orElse(null);
        Message message = new Message();
        message.setDirection(Direction.INBOUND);
        message.setChannel(Channel.WHATSAPP);
        message.setContent(glificSendMessageDto.getMessage());
        message.setTimestamp(
                glificSendMessageDto.getTimestamp() != null ? glificSendMessageDto.getTimestamp() : Instant.now()
        );
        message.setProcessed(false);

        if (person != null) {
            message.setUserId(person.getId());
            message.setTenantId(person.getTenantId());
        }

        if (glificSendMessageDto.getProviderMetaData() != null) {
            Object msgId = glificSendMessageDto.getProviderMetaData().get("messageId");
            if (msgId != null) {
                message.setProviderMessageId(msgId.toString());
            }
        }
        messageRepository.save(message);
    }
}
