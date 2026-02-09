package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.BfmReadingFilterDTO;
import com.jalsoochak.dataplatform.dto.request.CreateBfmReadingRequestDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.BfmReadingResponseDTO;

public interface BfmReadingService {

    ApiResponseDTO<List<BfmReadingResponseDTO>> getAllBfmReadings(BfmReadingFilterDTO filter);
    
    ApiResponseDTO<BfmReadingResponseDTO> getBfmReadingById(Long id);
    
    ApiResponseDTO<BfmReadingResponseDTO> createBfmReading(CreateBfmReadingRequestDTO request, Long userId);
    
    ApiResponseDTO<Void> deleteBfmReading(Long id, Long userId);
    
}
