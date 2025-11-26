package com.jalsoochak.imageprocessing.services;

import com.jalsoochak.imageprocessing.handlers.ImageProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageProcessingServiceImpl implements ImageProcessingService {
    @Override
    public void processImage(String imageUrl) {
        log.info("It has hit the image service");
    }
}
