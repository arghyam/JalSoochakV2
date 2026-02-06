package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.TenantEventDTO;
import com.jalsoochak.analyticsetlservice.dto.TenantResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimTenant;
import com.jalsoochak.analyticsetlservice.mapper.TenantMapper;
import com.jalsoochak.analyticsetlservice.repository.DimTenantRepository;
import com.jalsoochak.analyticsetlservice.service.TenantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Tenant operations
 */
@Service
public class TenantServiceImpl implements TenantService {

    private static final Logger log = LoggerFactory.getLogger(TenantServiceImpl.class);

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


    // This method is used to upsert a tenant from the event data.
    @Override
    @Transactional 
    public TenantResponseDTO upsertTenant(TenantEventDTO eventDTO) {
        if (eventDTO == null || eventDTO.getTenantCode() == null) {
            throw new IllegalArgumentException("TenantEventDTO and tenant_code must not be null");
        }

        Optional<DimTenant> existingTenant = repository.findByTenantCode(eventDTO.getTenantCode());

        DimTenant tenant;
        if (existingTenant.isPresent()) {
            tenant = existingTenant.get();
            mapper.updateEntity(tenant, eventDTO);
            log.info("Updating existing tenant: {}", eventDTO.getTenantCode());
        } else {
            tenant = mapper.toEntity(eventDTO);
            log.info("Creating new tenant: {}", eventDTO.getTenantCode());
        }

        DimTenant savedTenant = repository.save(tenant);
        return mapper.toDTO(savedTenant);
    }

    // This method is used to delete a tenant by ID from the event data.
    @Override
    @Transactional
    public boolean deleteTenantById(Integer tenantId) {
        if (tenantId == null) {
            throw new IllegalArgumentException("tenant_id must not be null");
        }

        Optional<DimTenant> existingTenant = repository.findById(tenantId);
        if (existingTenant.isPresent()) {
            repository.delete(existingTenant.get());
            log.info("Deleted tenant with id: {}", tenantId);
            return true;
        }

        log.warn("Tenant not found for deletion with id: {}", tenantId);
        return false;
    }

    // This method is used to delete a tenant by code from the event data.
    @Override
    @Transactional
    public boolean deleteTenantByCode(String tenantCode) {
        if (tenantCode == null || tenantCode.isBlank()) {
            throw new IllegalArgumentException("tenant_code must not be null or blank");
        }

        Optional<DimTenant> existingTenant = repository.findByTenantCode(tenantCode);
        if (existingTenant.isPresent()) {
            repository.delete(existingTenant.get());
            log.info("Deleted tenant with code: {}", tenantCode);
            return true;
        }

        log.warn("Tenant not found for deletion with code: {}", tenantCode);
        return false;
    }
}
