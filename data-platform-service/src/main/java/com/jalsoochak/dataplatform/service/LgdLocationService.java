package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.LgdLocationFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationResponseDTO;

public interface LgdLocationService {

    ApiResponseDTO<List<LgdLocationResponseDTO>> getAllLgdLocations(LgdLocationFilterDTO filter);

    ApiResponseDTO<LgdLocationResponseDTO> getLgdLocationById(Long id);

}
