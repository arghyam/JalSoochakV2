package com.jalsoochak.imageprocessing.kafka.consumer;

import com.jalsoochak.imageprocessing.handlers.ImageProcessingService;
import com.jalsoochak.imageprocessing.kafka.events.ImageProcessingMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImageProcessingConsumer {

    private final ImageProcessingService imageProcessingService;

    @KafkaListener(
            topics = "${kafka.topics.image-processing:image-processing-topic}",
            groupId = "${spring.application.name:imageprocessing-service}"
    )
    public void consumeImageProcessingMessage(ImageProcessingMessage message) {
        try {
            log.info("Received image processing message: readingUrl={}", message.getReadingUrl());

            imageProcessingService.processImage(message.getReadingUrl());

            log.info("Successfully processed image for readingUrl: {}", message.getReadingUrl());
        } catch (Exception e) {
            log.error("Error processing image for readingUrl: {}", message.getReadingUrl(), e);
        }
    }
}