package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.SchemeResponseDTO;
import com.jalsoochak.analyticsetlservice.mapper.SchemeMapper;
import com.jalsoochak.analyticsetlservice.repository.DimSchemeRepository;
import com.jalsoochak.analyticsetlservice.service.SchemeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Scheme operations
 */
@Service
public class SchemeServiceImpl implements SchemeService {

    private final DimSchemeRepository repository;
    private final SchemeMapper mapper;

    public SchemeServiceImpl(DimSchemeRepository repository, SchemeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<SchemeResponseDTO> getAllSchemes() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SchemeResponseDTO> getSchemeById(Integer id) {
        return repository.findById(id)
                .map(mapper::toDTO);
    }

    @Override
    public List<SchemeResponseDTO> getSchemesByTenant(Integer tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchemeResponseDTO> getActiveSchemesByTenant(Integer tenantId) {
        return repository.findByTenantIdAndStatus(tenantId, "ACTIVE").stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchemeResponseDTO> getSchemesByDistrict(Integer tenantId, Integer districtId) {
        return repository.findByTenantIdAndLgdDistrictId(tenantId, districtId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchemeResponseDTO> getSchemesByVillage(Integer tenantId, Integer villageId) {
        return repository.findByTenantIdAndVillageId(tenantId, villageId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchemeResponseDTO> getSchemesByAdminDivision(Integer tenantId, Integer divisionId) {
        return repository.findByTenantIdAndAdminDivisionId(tenantId, divisionId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
