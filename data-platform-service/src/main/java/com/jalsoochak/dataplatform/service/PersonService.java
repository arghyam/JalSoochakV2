package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.CreatePersonRequestDTO;
import com.jalsoochak.dataplatform.dto.request.PersonFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonResponseDTO;

public interface PersonService {

    ApiResponseDTO<List<PersonResponseDTO>> getAllPersons(PersonFilterDTO filter);
    
    ApiResponseDTO<PersonResponseDTO> getPersonById(Long id);
    
    ApiResponseDTO<PersonResponseDTO> createPerson(CreatePersonRequestDTO request);
    
}
