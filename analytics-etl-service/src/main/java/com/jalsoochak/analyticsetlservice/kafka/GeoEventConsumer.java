package com.jalsoochak.analyticsetlservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Placeholder Kafka consumer for geo events
 * 
 * Currently only logs received messages to demonstrate Kafka wiring.
 * Future implementation will process and store geo events.
 */
@Component
public class GeoEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(GeoEventConsumer.class);

    /**
     * Consume messages from geo.events topic
     * 
     * @param message Raw message payload
     */
    @KafkaListener(topics = "geo.events", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeGeoEvent(String message) {
        log.info("Received geo event: {}", message);
        // TODO: Process and store geo events in future implementation
    }
}
