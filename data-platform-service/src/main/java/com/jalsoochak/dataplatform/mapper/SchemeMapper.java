package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.SchemeResponseDTO;
import com.jalsoochak.dataplatform.dto.response.VillageResponseDTO;
import com.jalsoochak.dataplatform.entity.SchemeMaster;

public class SchemeMapper {
    
    public static SchemeResponseDTO toResponseDTO(SchemeMaster scheme) {
        if (scheme == null) {
            return null;
        }
        
        VillageResponseDTO villageDTO = null;
        if (scheme.getVillage() != null) {
            villageDTO = VillageResponseDTO.builder()
                    .id(scheme.getVillage().getId())
                    .title(scheme.getVillage().getTitle())
                    .lgdCode(scheme.getVillage().getLgdCode())
                    .houseHoldCount(scheme.getVillage().getHouseHoldCount())
                    .build();
        }
        
        return SchemeResponseDTO.builder()
                .id(scheme.getId())
                .stateSchemeId(scheme.getStateSchemeId())
                .centreSchemeId(scheme.getCentreSchemeId())
                .schemeName(scheme.getSchemeName())
                .fhtcCount(scheme.getFhtcCount())
                .plannedFhtc(scheme.getPlannedFhtc())
                .houseHoldCount(scheme.getHouseHoldCount())
                .latitude(scheme.getLatitude())
                .longitude(scheme.getLongitude())
                .geolocation(scheme.getGeolocation())
                .isActive(scheme.getIsActive())
                .tenantId(scheme.getTenantId())
                .village(villageDTO)
                .build();
    }
    
}
