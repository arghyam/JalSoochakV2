package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.LgdLocationResponseDTO;
import com.jalsoochak.analyticsetlservice.mapper.LgdLocationMapper;
import com.jalsoochak.analyticsetlservice.repository.DimLgdLocationRepository;
import com.jalsoochak.analyticsetlservice.service.LgdLocationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for LGD Location operations
 */
@Service
public class LgdLocationServiceImpl implements LgdLocationService {

    private final DimLgdLocationRepository repository;
    private final LgdLocationMapper mapper;

    public LgdLocationServiceImpl(DimLgdLocationRepository repository, LgdLocationMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<LgdLocationResponseDTO> getAllLocations() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<LgdLocationResponseDTO> getLocationById(Integer id) {
        return repository.findById(id)
                .map(mapper::toDTO);
    }

    @Override
    public List<LgdLocationResponseDTO> getLocationsByTenant(Integer tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LgdLocationResponseDTO> getLocationsByTenantAndType(Integer tenantId, String locationType) {
        return repository.findByTenantIdAndLocationType(tenantId, locationType).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LgdLocationResponseDTO> getChildLocations(Integer tenantId, Integer parentId) {
        return repository.findByTenantIdAndParentId(tenantId, parentId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LgdLocationResponseDTO> getLocationsByDistrict(Integer tenantId, Integer districtId) {
        return repository.findByTenantIdAndLgdDistrictId(tenantId, districtId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
