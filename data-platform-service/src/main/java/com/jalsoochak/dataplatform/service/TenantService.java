package com.jalsoochak.dataplatform.service;

import java.util.List;

import com.jalsoochak.dataplatform.dto.request.TenantFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.TenantResponseDTO;

public interface TenantService {

    ApiResponseDTO<List<TenantResponseDTO>> getAllTenants(TenantFilterDTO filter);
    
    ApiResponseDTO<TenantResponseDTO> getTenantById(Long id);
    
}
