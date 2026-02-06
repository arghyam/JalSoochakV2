package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.SchemeResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimScheme;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting DimScheme entity to DTO
 */
@Component
public class SchemeMapper {

    public SchemeResponseDTO toDTO(DimScheme entity) {
        if (entity == null) {
            return null;
        }

        return SchemeResponseDTO.builder()
                .id(entity.getId())
                .tenantId(entity.getTenantId())
                .sourceSchemeId(entity.getSourceSchemeId())
                .schemeName(entity.getSchemeName())
                .stateSchemeId(entity.getStateSchemeId())
                .centreSchemeId(entity.getCentreSchemeId())
                .fhtcCount(entity.getFhtcCount())
                .plannedFhtc(entity.getPlannedFhtc())
                .houseHoldCount(entity.getHouseHoldCount())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .villageId(entity.getVillageId())
                .villageName(entity.getVillageName())
                .lgdStateId(entity.getLgdStateId())
                .lgdStateName(entity.getLgdStateName())
                .lgdDistrictId(entity.getLgdDistrictId())
                .lgdDistrictName(entity.getLgdDistrictName())
                .lgdBlockId(entity.getLgdBlockId())
                .lgdBlockName(entity.getLgdBlockName())
                .lgdGramPanchayatId(entity.getLgdGramPanchayatId())
                .lgdGramPanchayatName(entity.getLgdGramPanchayatName())
                .adminZoneId(entity.getAdminZoneId())
                .adminZoneName(entity.getAdminZoneName())
                .adminCircleId(entity.getAdminCircleId())
                .adminCircleName(entity.getAdminCircleName())
                .adminDivisionId(entity.getAdminDivisionId())
                .adminDivisionName(entity.getAdminDivisionName())
                .adminSubDivisionId(entity.getAdminSubDivisionId())
                .adminSubDivisionName(entity.getAdminSubDivisionName())
                .status(entity.getStatus())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
