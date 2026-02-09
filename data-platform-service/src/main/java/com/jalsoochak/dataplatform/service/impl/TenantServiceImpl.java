package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.TenantFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.TenantResponseDTO;
import com.jalsoochak.dataplatform.entity.TenantMaster;
import com.jalsoochak.dataplatform.exception.TenantNotFoundException;
import com.jalsoochak.dataplatform.mapper.TenantMapper;
import com.jalsoochak.dataplatform.repo.TenantRepository;
import com.jalsoochak.dataplatform.service.TenantService;
import com.jalsoochak.dataplatform.specification.TenantSpecification;

@Service
public class TenantServiceImpl implements TenantService {
    
    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;
    
    public TenantServiceImpl(TenantRepository tenantRepository, TenantMapper tenantMapper) {
        this.tenantRepository = tenantRepository;
        this.tenantMapper = tenantMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<TenantResponseDTO>> getAllTenants(TenantFilterDTO filter) {
        try {
            List<TenantMaster> tenants;
            
            if (filter == null || isFilterEmpty(filter)) {
                tenants = tenantRepository.findAll();
            } else {
                Specification<TenantMaster> spec = TenantSpecification.withFilters(filter);
                tenants = tenantRepository.findAll(spec);
            }
            
            List<TenantResponseDTO> responseDTOs = tenants.stream()
                    .map(tenantMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<TenantResponseDTO> getTenantById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Tenant ID cannot be null");
        }
        
        TenantMaster tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundException(id));
        
        TenantResponseDTO responseDTO = tenantMapper.toResponseDTO(tenant);
        return ApiResponseDTO.success(responseDTO);
    }
    
    private boolean isFilterEmpty(TenantFilterDTO filter) {
        return (filter.getTenantCode() == null || filter.getTenantCode().isEmpty()) &&
               (filter.getTenantName() == null || filter.getTenantName().isEmpty());
    }
    
}
