package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;

public interface AdministrativeLocationTypeService {

    ApiResponseDTO<List<AdministrativeLocationTypeResponseDTO>> getAllAdministrativeLocationTypes();
    
    ApiResponseDTO<AdministrativeLocationTypeResponseDTO> getAdministrativeLocationTypeById(Long id);
    
}
