package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.SchemeFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.SchemeResponseDTO;
import com.jalsoochak.dataplatform.entity.SchemeMaster;
import com.jalsoochak.dataplatform.exception.SchemeNotFoundException;
import com.jalsoochak.dataplatform.mapper.SchemeMapper;
import com.jalsoochak.dataplatform.repo.SchemeRepository;
import com.jalsoochak.dataplatform.service.SchemeService;
import com.jalsoochak.dataplatform.specification.SchemeSpecification;

@Service
public class SchemeServiceImpl implements SchemeService {
    
    private final SchemeRepository schemeRepository;
    
    public SchemeServiceImpl(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<SchemeResponseDTO>> getAllSchemes(SchemeFilterDTO filter) {
        try {
            List<SchemeMaster> schemes;
            
            if (filter == null || isFilterEmpty(filter)) {
                schemes = schemeRepository.findAll();
            } else {
                Specification<SchemeMaster> spec = SchemeSpecification.withFilters(filter);
                schemes = schemeRepository.findAll(spec);
            }
            
            List<SchemeResponseDTO> responseDTOs = schemes.stream()
                    .map(SchemeMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<SchemeResponseDTO> getSchemeById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Scheme ID cannot be null");
        }
        
        SchemeMaster scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new SchemeNotFoundException(id));
        
        SchemeResponseDTO responseDTO = SchemeMapper.toResponseDTO(scheme);
        return ApiResponseDTO.success(responseDTO);
    }
    
    /**
     * Checks if the filter is empty
     */
    private boolean isFilterEmpty(SchemeFilterDTO filter) {
        return filter.getStateSchemeId() == null &&
               filter.getCentreSchemeId() == null &&
               (filter.getTenantId() == null || filter.getTenantId().isEmpty()) &&
               filter.getVillageId() == null &&
               filter.getPersonId() == null &&
               (filter.getSchemeName() == null || filter.getSchemeName().isEmpty()) &&
               filter.getIsActive() == null;
    }
    
}
