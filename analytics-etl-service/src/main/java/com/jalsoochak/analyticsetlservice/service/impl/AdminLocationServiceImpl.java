package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.AdminLocationResponseDTO;
import com.jalsoochak.analyticsetlservice.mapper.AdminLocationMapper;
import com.jalsoochak.analyticsetlservice.repository.DimAdminLocationRepository;
import com.jalsoochak.analyticsetlservice.service.AdminLocationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Admin Location operations
 */
@Service
public class AdminLocationServiceImpl implements AdminLocationService {

    private final DimAdminLocationRepository repository;
    private final AdminLocationMapper mapper;

    public AdminLocationServiceImpl(DimAdminLocationRepository repository, AdminLocationMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<AdminLocationResponseDTO> getAllLocations() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AdminLocationResponseDTO> getLocationById(Integer id) {
        return repository.findById(id)
                .map(mapper::toDTO);
    }

    @Override
    public List<AdminLocationResponseDTO> getLocationsByTenant(Integer tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminLocationResponseDTO> getLocationsByTenantAndType(Integer tenantId, String locationType) {
        return repository.findByTenantIdAndLocationType(tenantId, locationType).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminLocationResponseDTO> getLocationsByDivision(Integer tenantId, Integer divisionId) {
        return repository.findByTenantIdAndAdminDivisionId(tenantId, divisionId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
