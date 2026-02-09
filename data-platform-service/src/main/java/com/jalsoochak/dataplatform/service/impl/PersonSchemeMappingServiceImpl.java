package com.jalsoochak.dataplatform.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.CreatePersonSchemeMappingRequestDTO;
import com.jalsoochak.dataplatform.dto.request.PersonSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonSchemeMappingResponseDTO;
import com.jalsoochak.dataplatform.entity.PersonMaster;
import com.jalsoochak.dataplatform.entity.PersonSchemeMapping;
import com.jalsoochak.dataplatform.entity.SchemeMaster;
import com.jalsoochak.dataplatform.exception.PersonNotFoundException;
import com.jalsoochak.dataplatform.exception.PersonSchemeMappingNotFoundException;
import com.jalsoochak.dataplatform.exception.SchemeNotFoundException;
import com.jalsoochak.dataplatform.mapper.PersonSchemeMappingMapper;
import com.jalsoochak.dataplatform.repo.PersonRepository;
import com.jalsoochak.dataplatform.repo.PersonSchemeMappingRepository;
import com.jalsoochak.dataplatform.repo.SchemeRepository;
import com.jalsoochak.dataplatform.service.PersonSchemeMappingService;
import com.jalsoochak.dataplatform.specification.PersonSchemeMappingSpecification;

@Service
public class PersonSchemeMappingServiceImpl implements PersonSchemeMappingService {
    
    private final PersonSchemeMappingRepository mappingRepository;
    private final PersonRepository personRepository;
    private final SchemeRepository schemeRepository;
    private final PersonSchemeMappingMapper personSchemeMappingMapper;
    
    public PersonSchemeMappingServiceImpl(PersonSchemeMappingRepository mappingRepository,
                                         PersonRepository personRepository,
                                         SchemeRepository schemeRepository,
                                         PersonSchemeMappingMapper personSchemeMappingMapper) {
        this.mappingRepository = mappingRepository;
        this.personRepository = personRepository;
        this.schemeRepository = schemeRepository;
        this.personSchemeMappingMapper = personSchemeMappingMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<PersonSchemeMappingResponseDTO>> getAllMappings(PersonSchemeMappingFilterDTO filter) {
        try {
            List<PersonSchemeMapping> mappings;
            
            if (filter == null || isFilterEmpty(filter)) {
                mappings = mappingRepository.findAll((root, query, cb) -> 
                    cb.isNull(root.get("deletedAt"))
                );
            } else {
                Specification<PersonSchemeMapping> spec = PersonSchemeMappingSpecification.withFilters(filter);
                mappings = mappingRepository.findAll(spec);
            }
            
            List<PersonSchemeMappingResponseDTO> responseDTOs = mappings.stream()
                    .map(personSchemeMappingMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<PersonSchemeMappingResponseDTO> getMappingById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Mapping ID cannot be null");
        }
        
        PersonSchemeMapping mapping = mappingRepository.findById(id)
                .orElseThrow(() -> new PersonSchemeMappingNotFoundException(id));
        
        if (mapping.getDeletedAt() != null) {
            throw new PersonSchemeMappingNotFoundException(id);
        }
        
        PersonSchemeMappingResponseDTO responseDTO = personSchemeMappingMapper.toResponseDTO(mapping);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<PersonSchemeMappingResponseDTO> createMapping(CreatePersonSchemeMappingRequestDTO request, Long userId) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        PersonMaster person = personRepository.findById(request.getPersonId())
                .orElseThrow(() -> new PersonNotFoundException(request.getPersonId()));
        
        SchemeMaster scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new SchemeNotFoundException(request.getSchemeId()));
        
        PersonSchemeMapping mapping = PersonSchemeMapping.builder()
                .person(person)
                .scheme(scheme)
                .build();
        
        mapping.setCreatedBy(userId);
        mapping.setCreatedAt(LocalDateTime.now());
        
        PersonSchemeMapping savedMapping = mappingRepository.save(mapping);
        PersonSchemeMappingResponseDTO responseDTO = personSchemeMappingMapper.toResponseDTO(savedMapping);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<Void> deleteMapping(Long id, Long userId) {
        if (id == null) {
            throw new IllegalArgumentException("Mapping ID cannot be null");
        }
        
        PersonSchemeMapping mapping = mappingRepository.findById(id)
                .orElseThrow(() -> new PersonSchemeMappingNotFoundException(id));
        
        if (mapping.getDeletedAt() != null) {
            throw new PersonSchemeMappingNotFoundException("Mapping already deleted");
        }
        
        mapping.setDeletedAt(LocalDateTime.now());
        mapping.setDeletedBy(userId);
        mappingRepository.save(mapping);
        
        return ApiResponseDTO.success(null);
    }
    
    private boolean isFilterEmpty(PersonSchemeMappingFilterDTO filter) {
        return filter.getPersonId() == null && filter.getSchemeId() == null;
    }
    
}
