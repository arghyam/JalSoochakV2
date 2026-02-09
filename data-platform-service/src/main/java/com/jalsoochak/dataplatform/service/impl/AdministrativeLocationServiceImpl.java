package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.AdministrativeLocationFilterDTO;
import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationResponseDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationMaster;
import com.jalsoochak.dataplatform.exception.AdministrativeLocationNotFoundException;
import com.jalsoochak.dataplatform.mapper.AdministrativeLocationMapper;
import com.jalsoochak.dataplatform.repo.AdministrativeLocationRepository;
import com.jalsoochak.dataplatform.service.AdministrativeLocationService;
import com.jalsoochak.dataplatform.specification.AdministrativeLocationSpecification;

@Service
public class AdministrativeLocationServiceImpl implements AdministrativeLocationService {

    private final AdministrativeLocationRepository administrativeLocationRepository;
    private final AdministrativeLocationMapper administrativeLocationMapper;

    public AdministrativeLocationServiceImpl(AdministrativeLocationRepository administrativeLocationRepository,
                                            AdministrativeLocationMapper administrativeLocationMapper) {
        this.administrativeLocationRepository = administrativeLocationRepository;
        this.administrativeLocationMapper = administrativeLocationMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<AdministrativeLocationResponseDTO>> getAllAdministrativeLocations(AdministrativeLocationFilterDTO filter) {
        try {
            List<AdministrativeLocationMaster> locations;
            
            if (filter == null || isFilterEmpty(filter)) {
                locations = administrativeLocationRepository.findAll();
            } else {
                Specification<AdministrativeLocationMaster> spec = AdministrativeLocationSpecification.withFilters(filter);
                locations = administrativeLocationRepository.findAll(spec);
            }
            
            List<AdministrativeLocationResponseDTO> responseDTOs = locations.stream()
                    .map(administrativeLocationMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<AdministrativeLocationResponseDTO> getAdministrativeLocationById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Administrative Location ID cannot be null");
        }
        AdministrativeLocationMaster location = administrativeLocationRepository.findById(id)
                .orElseThrow(() -> new AdministrativeLocationNotFoundException(id));
        
        AdministrativeLocationResponseDTO responseDTO = administrativeLocationMapper.toResponseDTO(location);
        return ApiResponseDTO.success(responseDTO);
    }

    /**
     * Checks if the filter is empty
     */
    private boolean isFilterEmpty(AdministrativeLocationFilterDTO filter) {
        return (filter.getTitle() == null || filter.getTitle().isEmpty()) &&
               filter.getAdministrativeLocationTypeId() == null &&
               filter.getParentId() == null;
    }

}
