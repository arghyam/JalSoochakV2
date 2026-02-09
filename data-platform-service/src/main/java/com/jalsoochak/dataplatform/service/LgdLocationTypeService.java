package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationTypeResponseDTO;

public interface LgdLocationTypeService {

    ApiResponseDTO<List<LgdLocationTypeResponseDTO>> getAllLgdLocationTypes();
    
    ApiResponseDTO<LgdLocationTypeResponseDTO> getLgdLocationTypeById(Long id);

}
