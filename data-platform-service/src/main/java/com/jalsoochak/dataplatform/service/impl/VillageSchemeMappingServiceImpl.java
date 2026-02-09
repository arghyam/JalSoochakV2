package com.jalsoochak.dataplatform.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.CreateVillageSchemeMappingRequestDTO;
import com.jalsoochak.dataplatform.dto.request.VillageSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageSchemeMappingResponseDTO;
import com.jalsoochak.dataplatform.entity.SchemeMaster;
import com.jalsoochak.dataplatform.entity.VillageMaster;
import com.jalsoochak.dataplatform.entity.VillageSchemeMapping;
import com.jalsoochak.dataplatform.exception.SchemeNotFoundException;
import com.jalsoochak.dataplatform.exception.VillageNotFoundException;
import com.jalsoochak.dataplatform.exception.VillageSchemeMappingNotFoundException;
import com.jalsoochak.dataplatform.mapper.VillageSchemeMappingMapper;
import com.jalsoochak.dataplatform.repo.SchemeRepository;
import com.jalsoochak.dataplatform.repo.VillageRepository;
import com.jalsoochak.dataplatform.repo.VillageSchemeMappingRepository;
import com.jalsoochak.dataplatform.service.VillageSchemeMappingService;
import com.jalsoochak.dataplatform.specification.VillageSchemeMappingSpecification;

@Service
public class VillageSchemeMappingServiceImpl implements VillageSchemeMappingService {
    
    private final VillageSchemeMappingRepository mappingRepository;
    private final VillageRepository villageRepository;
    private final SchemeRepository schemeRepository;
    private final VillageSchemeMappingMapper villageSchemeMappingMapper;
    
    public VillageSchemeMappingServiceImpl(VillageSchemeMappingRepository mappingRepository,
                                          VillageRepository villageRepository,
                                          SchemeRepository schemeRepository,
                                          VillageSchemeMappingMapper villageSchemeMappingMapper) {
        this.mappingRepository = mappingRepository;
        this.villageRepository = villageRepository;
        this.schemeRepository = schemeRepository;
        this.villageSchemeMappingMapper = villageSchemeMappingMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<VillageSchemeMappingResponseDTO>> getAllMappings(VillageSchemeMappingFilterDTO filter) {
        try {
            List<VillageSchemeMapping> mappings;
            
            if (filter == null || isFilterEmpty(filter)) {
                mappings = mappingRepository.findAll((root, query, cb) -> 
                    cb.isNull(root.get("deletedAt"))
                );
            } else {
                Specification<VillageSchemeMapping> spec = VillageSchemeMappingSpecification.withFilters(filter);
                mappings = mappingRepository.findAll(spec);
            }
            
            List<VillageSchemeMappingResponseDTO> responseDTOs = mappings.stream()
                    .map(villageSchemeMappingMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<VillageSchemeMappingResponseDTO> getMappingById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Mapping ID cannot be null");
        }
        
        VillageSchemeMapping mapping = mappingRepository.findById(id)
                .orElseThrow(() -> new VillageSchemeMappingNotFoundException(id));
        
        if (mapping.getDeletedAt() != null) {
            throw new VillageSchemeMappingNotFoundException(id);
        }
        
        VillageSchemeMappingResponseDTO responseDTO = villageSchemeMappingMapper.toResponseDTO(mapping);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<VillageSchemeMappingResponseDTO> createMapping(CreateVillageSchemeMappingRequestDTO request, Long userId) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        VillageMaster village = villageRepository.findById(request.getVillageId())
                .orElseThrow(() -> new VillageNotFoundException(request.getVillageId()));
        
        SchemeMaster scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new SchemeNotFoundException(request.getSchemeId()));
        
        VillageSchemeMapping mapping = VillageSchemeMapping.builder()
                .village(village)
                .scheme(scheme)
                .build();
        
        mapping.setCreatedBy(userId);
        mapping.setCreatedAt(LocalDateTime.now());
        
        VillageSchemeMapping savedMapping = mappingRepository.save(mapping);
        VillageSchemeMappingResponseDTO responseDTO = villageSchemeMappingMapper.toResponseDTO(savedMapping);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<Void> deleteMapping(Long id, Long userId) {
        if (id == null) {
            throw new IllegalArgumentException("Mapping ID cannot be null");
        }
        
        VillageSchemeMapping mapping = mappingRepository.findById(id)
                .orElseThrow(() -> new VillageSchemeMappingNotFoundException(id));
        
        if (mapping.getDeletedAt() != null) {
            throw new VillageSchemeMappingNotFoundException("Mapping already deleted");
        }
        
        mapping.setDeletedAt(LocalDateTime.now());
        mapping.setDeletedBy(userId);
        mappingRepository.save(mapping);
        
        return ApiResponseDTO.success(null);
    }
    
    private boolean isFilterEmpty(VillageSchemeMappingFilterDTO filter) {
        return filter.getVillageId() == null && filter.getSchemeId() == null;
    }
    
}
