package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.VillageFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageResponseDTO;

public interface VillageService {

    ApiResponseDTO<List<VillageResponseDTO>> getAllVillages(VillageFilterDTO filter);
    
    ApiResponseDTO<VillageResponseDTO> getVillageById(Long id);
    
}
