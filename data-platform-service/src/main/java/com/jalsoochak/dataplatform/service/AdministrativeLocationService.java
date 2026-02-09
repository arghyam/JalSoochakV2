package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.AdministrativeLocationFilterDTO;
import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationResponseDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;

public interface AdministrativeLocationService {
    
    ApiResponseDTO<List<AdministrativeLocationResponseDTO>> getAllAdministrativeLocations(AdministrativeLocationFilterDTO filter);

    ApiResponseDTO<AdministrativeLocationResponseDTO> getAdministrativeLocationById(Long id);

}
