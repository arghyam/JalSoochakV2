package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.TenantResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimTenant;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting DimTenant entity to DTO
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
}
