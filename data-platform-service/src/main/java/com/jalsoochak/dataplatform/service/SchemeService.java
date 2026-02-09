package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.SchemeFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.SchemeResponseDTO;

public interface SchemeService {

    ApiResponseDTO<List<SchemeResponseDTO>> getAllSchemes(SchemeFilterDTO filter);
    
    ApiResponseDTO<SchemeResponseDTO> getSchemeById(Long id);
    
}
