package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.CreatePersonSchemeMappingRequestDTO;
import com.jalsoochak.dataplatform.dto.request.PersonSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonSchemeMappingResponseDTO;

public interface PersonSchemeMappingService {

    ApiResponseDTO<List<PersonSchemeMappingResponseDTO>> getAllMappings(PersonSchemeMappingFilterDTO filter);
    
    ApiResponseDTO<PersonSchemeMappingResponseDTO> getMappingById(Long id);
    
    ApiResponseDTO<PersonSchemeMappingResponseDTO> createMapping(CreatePersonSchemeMappingRequestDTO request, Long userId);
    
    ApiResponseDTO<Void> deleteMapping(Long id, Long userId);
    
}
