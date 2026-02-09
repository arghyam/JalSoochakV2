package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.LgdLocationFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationResponseDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationMaster;
import com.jalsoochak.dataplatform.exception.LgdLocationNotFoundException;
import com.jalsoochak.dataplatform.mapper.LgdLocationMapper;
import com.jalsoochak.dataplatform.repo.LgdLocationRepository;
import com.jalsoochak.dataplatform.service.LgdLocationService;
import com.jalsoochak.dataplatform.specification.LgdLocationSpecification;

@Service
public class LgdLocationServiceImpl implements LgdLocationService {

    private final LgdLocationRepository lgdLocationRepository;

    public LgdLocationServiceImpl(LgdLocationRepository lgdLocationRepository) {
        this.lgdLocationRepository = lgdLocationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<LgdLocationResponseDTO>> getAllLgdLocations(LgdLocationFilterDTO filter) {
        try {
            List<LgdLocationMaster> locations;
            
            if (filter == null || isFilterEmpty(filter)) {
                locations = lgdLocationRepository.findAll();
            } else {
                Specification<LgdLocationMaster> spec = LgdLocationSpecification.withFilters(filter);
                locations = lgdLocationRepository.findAll(spec);
            }
            
            List<LgdLocationResponseDTO> responseDTOs = locations.stream()
                    .map(LgdLocationMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<LgdLocationResponseDTO> getLgdLocationById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("LGD Location ID cannot be null");
        }
        LgdLocationMaster location = lgdLocationRepository.findById(id)
                .orElseThrow(() -> new LgdLocationNotFoundException(id));
        
        LgdLocationResponseDTO responseDTO = LgdLocationMapper.toResponseDTO(location);
        return ApiResponseDTO.success(responseDTO);
    }

    /**
     * Checks if the filter is empty
     */
    private boolean isFilterEmpty(LgdLocationFilterDTO filter) {
        return (filter.getTitle() == null || filter.getTitle().isEmpty()) &&
               filter.getLgdCode() == null &&
               filter.getLgdLocationTypeId() == null &&
               filter.getParentId() == null;
    }

}
