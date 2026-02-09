package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.CreateVillageSchemeMappingRequestDTO;
import com.jalsoochak.dataplatform.dto.request.VillageSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageSchemeMappingResponseDTO;

public interface VillageSchemeMappingService {

    ApiResponseDTO<List<VillageSchemeMappingResponseDTO>> getAllMappings(VillageSchemeMappingFilterDTO filter);
    
    ApiResponseDTO<VillageSchemeMappingResponseDTO> getMappingById(Long id);
    
    ApiResponseDTO<VillageSchemeMappingResponseDTO> createMapping(CreateVillageSchemeMappingRequestDTO request, Long userId);
    
    ApiResponseDTO<Void> deleteMapping(Long id, Long userId);
    
}
