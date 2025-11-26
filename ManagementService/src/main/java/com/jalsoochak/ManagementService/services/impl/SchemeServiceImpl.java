package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.models.app.response.ApiResponseDTO;
import com.jalsoochak.ManagementService.models.app.response.SchemeFilterDTO;
import com.jalsoochak.ManagementService.models.app.response.SchemeResponseDTO;
import com.jalsoochak.ManagementService.services.service.SchemeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly= true)
public class SchemeServiceImpl implements SchemeService {

    @Override
    public ApiResponseDTO<List<SchemeResponseDTO>> getAllSchemes(SchemeFilterDTO filter) {
        return null;
    }

    @Override
    public ApiResponseDTO<SchemeResponseDTO> getSchemeByCentreId(Integer centreSchemeId) {
        return null;
    }
}
