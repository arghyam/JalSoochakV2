package com.jalsoochak.bfm_reading_service.kafka.producer;

import com.jalsoochak.bfm_reading_service.kafka.events.ImageProcessingMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class ImageProcessorProducer {
    private static final Logger logger = LoggerFactory.getLogger(ImageProcessorProducer.class);
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.image-processing:image-processing-topic}")
    private String imageProcessingTopic;

    public void sendImageForProcessing(String readingUrl){
        if (readingUrl == null || readingUrl.trim().isEmpty()) {
            logger.warn("Reading URL is null or empty, skipping Kafka message");
            return;
        }
        ImageProcessingMessage message = new ImageProcessingMessage(readingUrl);
        logger.info("Sending image for processing: readingUrl={}", readingUrl);

        kafkaTemplate.send(imageProcessingTopic, message)
                .whenComplete((result, ex) -> {
                    if (ex == null){
                        logger.info("Successfully sent image processing message for readingUrl: {}", readingUrl);
                    } else {
                        logger.error("Failed to send image processing message for readingUrl: {}", readingUrl, ex);
                    }
                });
    }
}
