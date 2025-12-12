package com.jalsoochak.ManagementService.services.service;


import com.jalsoochak.ManagementService.models.app.request.CreateBfmReadingRequestDTO;
import com.jalsoochak.ManagementService.models.app.response.CreateBfmReadingResponseDTO;

public interface BfmReadingService {

    CreateBfmReadingResponseDTO createBfmReading(
            String tenantId,
            CreateBfmReadingRequestDTO request);
}
