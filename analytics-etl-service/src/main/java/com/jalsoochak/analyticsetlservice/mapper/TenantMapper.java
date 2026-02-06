package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.TenantEventDTO;
import com.jalsoochak.analyticsetlservice.dto.TenantResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimTenant;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

/**
 * Mapper for converting DimTenant entity to/from DTOs
 */
@Component
public class TenantMapper {

    public TenantResponseDTO toDTO(DimTenant entity) {
        if (entity == null) {
            return null;
        }

        return TenantResponseDTO.builder()
                .tenantId(entity.getTenantId())
                .tenantCode(entity.getTenantCode())
                .tenantName(entity.getTenantName())
                .countryCode(entity.getCountryCode())
                .config(entity.getConfig())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public DimTenant toEntity(TenantEventDTO eventDTO) {
        if (eventDTO == null) {
            return null;
        }

        DimTenant entity = new DimTenant();
        entity.setTenantCode(eventDTO.getTenantCode());
        entity.setTenantName(eventDTO.getTenantName());
        entity.setCountryCode(eventDTO.getCountryCode() != null ? eventDTO.getCountryCode() : "IN");
        entity.setConfig(eventDTO.getConfig());
        Boolean isActive = eventDTO.getIsActive();
        entity.setIsActive(isActive != null ? isActive : Boolean.TRUE);

        OffsetDateTime now = OffsetDateTime.now();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);

        return entity;
    }

    public void updateEntity(DimTenant entity, TenantEventDTO eventDTO) {
        if (entity == null || eventDTO == null) {
            return;
        }

        if (eventDTO.getTenantName() != null) {
            entity.setTenantName(eventDTO.getTenantName());
        }
        if (eventDTO.getCountryCode() != null) {
            entity.setCountryCode(eventDTO.getCountryCode());
        }
        if (eventDTO.getConfig() != null) {
            entity.setConfig(eventDTO.getConfig());
        }
        if (eventDTO.getIsActive() != null) {
            entity.setIsActive(eventDTO.getIsActive());
        }
        entity.setUpdatedAt(OffsetDateTime.now());
    }
}
