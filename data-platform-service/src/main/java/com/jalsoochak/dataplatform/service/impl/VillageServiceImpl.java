package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.VillageFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageResponseDTO;
import com.jalsoochak.dataplatform.entity.VillageMaster;
import com.jalsoochak.dataplatform.exception.VillageNotFoundException;
import com.jalsoochak.dataplatform.mapper.VillageMapper;
import com.jalsoochak.dataplatform.repo.VillageRepository;
import com.jalsoochak.dataplatform.service.VillageService;
import com.jalsoochak.dataplatform.specification.VillageSpecification;

@Service
public class VillageServiceImpl implements VillageService {
    
    private final VillageRepository villageRepository;
    
    public VillageServiceImpl(VillageRepository villageRepository) {
        this.villageRepository = villageRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<VillageResponseDTO>> getAllVillages(VillageFilterDTO filter) {
        try {
            List<VillageMaster> villages;
            
            if (filter == null || isFilterEmpty(filter)) {
                villages = villageRepository.findAll();
            } else {
                Specification<VillageMaster> spec = VillageSpecification.withFilters(filter);
                villages = villageRepository.findAll(spec);
            }
            
            List<VillageResponseDTO> responseDTOs = villages.stream()
                    .map(VillageMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<VillageResponseDTO> getVillageById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Village ID cannot be null");
        }
        
        VillageMaster village = villageRepository.findById(id)
                .orElseThrow(() -> new VillageNotFoundException(id));
        
        VillageResponseDTO responseDTO = VillageMapper.toResponseDTO(village);
        return ApiResponseDTO.success(responseDTO);
    }
    
    private boolean isFilterEmpty(VillageFilterDTO filter) {
        return (filter.getTitle() == null || filter.getTitle().isEmpty()) &&
               filter.getLgdCode() == null &&
               filter.getSchemeId() == null &&
               filter.getParentAdministrativeLocationId() == null &&
               filter.getParentLgdLocationId() == null;
    }
    
}
