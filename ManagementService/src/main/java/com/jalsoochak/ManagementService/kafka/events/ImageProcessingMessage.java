package com.jalsoochak.ManagementService.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageProcessingMessage {
    private String readingUrl;
}
