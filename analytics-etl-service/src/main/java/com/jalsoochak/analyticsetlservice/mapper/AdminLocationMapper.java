package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.AdminLocationResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimAdminLocation;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting DimAdminLocation entity to DTO
 */
@Component
public class AdminLocationMapper {

    public AdminLocationResponseDTO toDTO(DimAdminLocation entity) {
        if (entity == null) {
            return null;
        }

        return AdminLocationResponseDTO.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .sourceAdminId(entity.getSourceAdminId())
                .title(entity.getTitle())
                .locationType(entity.getLocationType())
                .adminZoneId(entity.getAdminZoneId())
                .adminZoneName(entity.getAdminZoneName())
                .adminCircleId(entity.getAdminCircleId())
                .adminCircleName(entity.getAdminCircleName())
                .adminDivisionId(entity.getAdminDivisionId())
                .adminDivisionName(entity.getAdminDivisionName())
                .adminSubDivisionId(entity.getAdminSubDivisionId())
                .adminSubDivisionName(entity.getAdminSubDivisionName())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
