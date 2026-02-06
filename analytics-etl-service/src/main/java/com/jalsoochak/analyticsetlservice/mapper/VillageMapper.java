package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.VillageResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimVillage;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting DimVillage entity to DTO
 */
@Component
public class VillageMapper {

    public VillageResponseDTO toDTO(DimVillage entity) {
        if (entity == null) {
            return null;
        }

        return VillageResponseDTO.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .sourceVillageId(entity.getSourceVillageId())
                .title(entity.getTitle())
                .lgdCode(entity.getLgdCode())
                .householdCount(entity.getHouseholdCount())
                .lgdLocationId(entity.getLgdLocationId())
                .adminLocationId(entity.getAdminLocationId())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
