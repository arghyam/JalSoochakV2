package com.jalsoochak.ManagementService.services.service;

import com.jalsoochak.ManagementService.models.app.response.ApiResponseDTO;
import com.jalsoochak.ManagementService.models.app.response.SchemeFilterDTO;
import com.jalsoochak.ManagementService.models.app.response.SchemeResponseDTO;

import java.util.List;

public interface SchemeService {
    ApiResponseDTO<List<SchemeResponseDTO>> getAllSchemes(SchemeFilterDTO filter);
    ApiResponseDTO<SchemeResponseDTO> getSchemeByCentreId(Integer centreSchemeId);
}
