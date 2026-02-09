package com.jalsoochak.dataplatform.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.CreatePersonRequestDTO;
import com.jalsoochak.dataplatform.dto.request.PersonFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonResponseDTO;
import com.jalsoochak.dataplatform.entity.PersonMaster;
import com.jalsoochak.dataplatform.entity.PersonTypeMaster;
import com.jalsoochak.dataplatform.exception.DuplicatePhoneNumberException;
import com.jalsoochak.dataplatform.exception.PersonNotFoundException;
import com.jalsoochak.dataplatform.exception.PersonTypeNotFoundException;
import com.jalsoochak.dataplatform.mapper.PersonMapper;
import com.jalsoochak.dataplatform.repo.PersonRepository;
import com.jalsoochak.dataplatform.repo.PersonTypeMasterRepository;
import com.jalsoochak.dataplatform.service.PersonService;
import com.jalsoochak.dataplatform.specification.PersonSpecification;

@Service
public class PersonServiceImpl implements PersonService {
    
    private final PersonRepository personRepository;
    private final PersonTypeMasterRepository personTypeMasterRepository;
    private final PersonMapper personMapper;
    
    public PersonServiceImpl(PersonRepository personRepository, 
                            PersonTypeMasterRepository personTypeMasterRepository,
                            PersonMapper personMapper) {
        this.personRepository = personRepository;
        this.personTypeMasterRepository = personTypeMasterRepository;
        this.personMapper = personMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<PersonResponseDTO>> getAllPersons(PersonFilterDTO filter) {
        try {
            List<PersonMaster> persons;
            
            if (filter == null || isFilterEmpty(filter)) {
                persons = personRepository.findAll();
            } else {
                Specification<PersonMaster> spec = PersonSpecification.withFilters(filter);
                persons = personRepository.findAll(spec);
            }
            
            List<PersonResponseDTO> responseDTOs = persons.stream()
                    .map(personMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<PersonResponseDTO> getPersonById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Person ID cannot be null");
        }
        PersonMaster person = personRepository.findById(id)
                .orElseThrow(() -> new PersonNotFoundException(id));
        
        PersonResponseDTO responseDTO = personMapper.toResponseDTO(person);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<PersonResponseDTO> createPerson(CreatePersonRequestDTO request, Long userId) {
        // Validate phone number uniqueness
        if (personRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicatePhoneNumberException(request.getPhoneNumber());
        }
        
        // Fetch target person type
        PersonTypeMaster targetPersonType = personTypeMasterRepository.findById(request.getPersonTypeId())
                .orElseThrow(() -> new PersonTypeNotFoundException(request.getPersonTypeId()));
        
        // Create person entity
        String fullName = request.getFirstName() + " " + request.getLastName();
        
        PersonMaster person = PersonMaster.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .fullName(fullName)
                .phoneNumber(request.getPhoneNumber())
                .tenantId(request.getTenantId())
                .personType(targetPersonType)
                .isActive(true)
                .build();
        
        person.setCreatedBy(userId);
        person.setCreatedAt(LocalDateTime.now());
        
        PersonMaster savedPerson = personRepository.save(person);
        PersonResponseDTO responseDTO = personMapper.toResponseDTO(savedPerson);
        return ApiResponseDTO.success(responseDTO);
    }
    
    /**
     * Checks if the filter is empty
     */
    private boolean isFilterEmpty(PersonFilterDTO filter) {
        return (filter.getFirstName() == null || filter.getFirstName().isEmpty()) &&
               (filter.getLastName() == null || filter.getLastName().isEmpty()) &&
               (filter.getPhoneNumber() == null || filter.getPhoneNumber().isEmpty()) &&
               filter.getPersonTypeId() == null &&
               (filter.getTenantId() == null || filter.getTenantId().isEmpty()) &&
               filter.getIsActive() == null;
    }
    
}
