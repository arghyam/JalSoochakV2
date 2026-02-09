package com.jalsoochak.dataplatform.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.request.BfmReadingFilterDTO;
import com.jalsoochak.dataplatform.dto.request.CreateBfmReadingRequestDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.BfmReadingResponseDTO;
import com.jalsoochak.dataplatform.entity.BfmReading;
import com.jalsoochak.dataplatform.entity.PersonMaster;
import com.jalsoochak.dataplatform.entity.SchemeMaster;
import com.jalsoochak.dataplatform.exception.BfmReadingNotFoundException;
import com.jalsoochak.dataplatform.exception.PersonNotFoundException;
import com.jalsoochak.dataplatform.exception.SchemeNotFoundException;
import com.jalsoochak.dataplatform.mapper.BfmReadingMapper;
import com.jalsoochak.dataplatform.repo.BfmReadingRepository;
import com.jalsoochak.dataplatform.repo.PersonRepository;
import com.jalsoochak.dataplatform.repo.SchemeRepository;
import com.jalsoochak.dataplatform.service.BfmReadingService;
import com.jalsoochak.dataplatform.specification.BfmReadingSpecification;

@Service
public class BfmReadingServiceImpl implements BfmReadingService {
    
    private final BfmReadingRepository bfmReadingRepository;
    private final SchemeRepository schemeRepository;
    private final PersonRepository personRepository;
    private final BfmReadingMapper bfmReadingMapper;
    
    public BfmReadingServiceImpl(BfmReadingRepository bfmReadingRepository,
                                SchemeRepository schemeRepository,
                                PersonRepository personRepository,
                                BfmReadingMapper bfmReadingMapper) {
        this.bfmReadingRepository = bfmReadingRepository;
        this.schemeRepository = schemeRepository;
        this.personRepository = personRepository;
        this.bfmReadingMapper = bfmReadingMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<BfmReadingResponseDTO>> getAllBfmReadings(BfmReadingFilterDTO filter) {
        try {
            List<BfmReading> readings;
            
            if (filter == null || isFilterEmpty(filter)) {
                readings = bfmReadingRepository.findAll((root, query, cb) -> 
                    cb.isNull(root.get("deletedAt"))
                );
            } else {
                Specification<BfmReading> spec = BfmReadingSpecification.withFilters(filter);
                readings = bfmReadingRepository.findAll(spec);
            }
            
            List<BfmReadingResponseDTO> responseDTOs = readings.stream()
                    .map(bfmReadingMapper::toResponseDTO)
                    .collect(Collectors.toList());
            
            return ApiResponseDTO.success(responseDTOs);
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<BfmReadingResponseDTO> getBfmReadingById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("BFM Reading ID cannot be null");
        }
        
        BfmReading reading = bfmReadingRepository.findById(id)
                .orElseThrow(() -> new BfmReadingNotFoundException(id));
        
        if (reading.getDeletedAt() != null) {
            throw new BfmReadingNotFoundException(id);
        }
        
        BfmReadingResponseDTO responseDTO = bfmReadingMapper.toResponseDTO(reading);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<BfmReadingResponseDTO> createBfmReading(CreateBfmReadingRequestDTO request, Long userId) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        // Validate scheme exists
        SchemeMaster scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new SchemeNotFoundException(request.getSchemeId()));
        
        // Validate person exists
        PersonMaster person = personRepository.findById(request.getPersonId())
                .orElseThrow(() -> new PersonNotFoundException(request.getPersonId()));
        
        BfmReading reading = BfmReading.builder()
                .tenantId(request.getTenantId())
                .confirmedReading(request.getConfirmedReading())
                .extractedReading(request.getExtractedReading())
                .readingUrl(request.getReadingUrl())
//                .geolocation(request.getGeolocation())
                .correlationId(request.getCorrelationId())
                .scheme(scheme)
                .person(person)
                .build();
        
        reading.setCreatedBy(userId);
        reading.setCreatedAt(LocalDateTime.now());
        
        BfmReading savedReading = bfmReadingRepository.save(reading);
        BfmReadingResponseDTO responseDTO = bfmReadingMapper.toResponseDTO(savedReading);
        return ApiResponseDTO.success(responseDTO);
    }
    
    @Override
    @Transactional
    public ApiResponseDTO<Void> deleteBfmReading(Long id, Long userId) {
        if (id == null) {
            throw new IllegalArgumentException("BFM Reading ID cannot be null");
        }
        
        BfmReading reading = bfmReadingRepository.findById(id)
                .orElseThrow(() -> new BfmReadingNotFoundException(id));
        
        if (reading.getDeletedAt() != null) {
            throw new BfmReadingNotFoundException("BFM Reading already deleted");
        }
        
        reading.setDeletedAt(LocalDateTime.now());
        reading.setDeletedBy(userId);
        bfmReadingRepository.save(reading);
        
        return ApiResponseDTO.success(null);
    }
    
    private boolean isFilterEmpty(BfmReadingFilterDTO filter) {
        return (filter.getTenantId() == null || filter.getTenantId().isEmpty()) &&
               (filter.getCorrelationId() == null || filter.getCorrelationId().isEmpty()) &&
               filter.getSchemeId() == null &&
               filter.getPersonId() == null &&
               filter.getReadingDateTimeStart() == null &&
               filter.getReadingDateTimeEnd() == null;
    }
    
}
