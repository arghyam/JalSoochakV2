package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.VillageResponseDTO;
import com.jalsoochak.analyticsetlservice.mapper.VillageMapper;
import com.jalsoochak.analyticsetlservice.repository.DimVillageRepository;
import com.jalsoochak.analyticsetlservice.service.VillageService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Village operations
 */
@Service
public class VillageServiceImpl implements VillageService {

    private final DimVillageRepository repository;
    private final VillageMapper mapper;

    public VillageServiceImpl(DimVillageRepository repository, VillageMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<VillageResponseDTO> getAllVillages() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<VillageResponseDTO> getVillageById(Integer id) {
        return repository.findById(id)
                .map(mapper::toDTO);
    }

    @Override
    public List<VillageResponseDTO> getVillagesByTenant(Integer tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VillageResponseDTO> getVillagesByLgdLocation(Integer tenantId, Integer lgdLocationId) {
        return repository.findByTenantIdAndLgdLocationId(tenantId, lgdLocationId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VillageResponseDTO> getVillagesByAdminLocation(Integer tenantId, Integer adminLocationId) {
        return repository.findByTenantIdAndAdminLocationId(tenantId, adminLocationId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
