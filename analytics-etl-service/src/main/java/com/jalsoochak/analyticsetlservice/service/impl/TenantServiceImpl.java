package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.TenantResponseDTO;
import com.jalsoochak.analyticsetlservice.mapper.TenantMapper;
import com.jalsoochak.analyticsetlservice.repository.DimTenantRepository;
import com.jalsoochak.analyticsetlservice.service.TenantService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Tenant operations
 */
@Service
public class TenantServiceImpl implements TenantService {

    private final DimTenantRepository repository;
    private final TenantMapper mapper;

    public TenantServiceImpl(DimTenantRepository repository, TenantMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<TenantResponseDTO> getAllTenants() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TenantResponseDTO> getActiveTenants() {
        return repository.findByIsActiveTrue().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TenantResponseDTO> getTenantById(Integer tenantId) {
        return repository.findById(tenantId)
                .map(mapper::toDTO);
    }

    @Override
    public Optional<TenantResponseDTO> getTenantByCode(String tenantCode) {
        return repository.findByTenantCode(tenantCode)
                .map(mapper::toDTO);
    }
}
