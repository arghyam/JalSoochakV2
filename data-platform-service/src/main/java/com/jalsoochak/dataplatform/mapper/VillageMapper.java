package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.VillageResponseDTO;
import com.jalsoochak.dataplatform.entity.VillageMaster;

public class VillageMapper {
    
    public static VillageResponseDTO toResponseDTO(VillageMaster village) {
        if (village == null) {
            return null;
        }
        
        return VillageResponseDTO.builder()
                .id(village.getId())
                .title(village.getTitle())
                .lgdCode(village.getLgdCode())
                .houseHoldCount(village.getHouseHoldCount())
                .parentAdministrativeLocationId(
                    village.getParentAdministrativeLocation() != null 
                        ? village.getParentAdministrativeLocation().getId() 
                        : null
                )
                .parentLgdLocationId(
                    village.getParentLgdLocation() != null 
                        ? village.getParentLgdLocation().getId() 
                        : null
                )
                .build();
    }
    
}
