package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.LgdLocationResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimLgdLocation;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting DimLgdLocation entity to DTO
 */
@Component
public class LgdLocationMapper {

    public LgdLocationResponseDTO toDTO(DimLgdLocation entity) {
        if (entity == null) {
            return null;
        }

        return LgdLocationResponseDTO.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .sourceLgdId(entity.getSourceLgdId())
                .parentId(entity.getParentId())
                .title(entity.getTitle())
                .lgdCode(entity.getLgdCode())
                .locationType(entity.getLocationType())
                .lgdStateId(entity.getLgdStateId())
                .lgdStateName(entity.getLgdStateName())
                .lgdDistrictId(entity.getLgdDistrictId())
                .lgdDistrictName(entity.getLgdDistrictName())
                .lgdBlockId(entity.getLgdBlockId())
                .lgdBlockName(entity.getLgdBlockName())
                .lgdGramPanchayatId(entity.getLgdGramPanchayatId())
                .lgdGramPanchayatName(entity.getLgdGramPanchayatName())
                .householdCount(entity.getHouseholdCount())
                .adminLocationId(entity.getAdminLocationId())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
