package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.LgdLocationResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationMaster;

public class LgdLocationMapper {
    
    public static LgdLocationResponseDTO toResponseDTO(LgdLocationMaster location) {
        if (location == null) {
            return null;
        }
        
        LgdLocationTypeResponseDTO locationTypeDTO = null;
        if (location.getLgdLocationType() != null) {

            LgdLocationTypeResponseDTO.ParentTypeResponseDTO parentTypeDTO = null;
            if (location.getLgdLocationType().getParent() != null) {
                parentTypeDTO = LgdLocationTypeResponseDTO.ParentTypeResponseDTO.builder()
                        .id(location.getLgdLocationType().getParent().getId())
                        .cName(location.getLgdLocationType().getParent().getCName())
                        .title(location.getLgdLocationType().getParent().getTitle())
                        .build();
            }
            
            locationTypeDTO = LgdLocationTypeResponseDTO.builder()
                    .id(location.getLgdLocationType().getId())
                    .cName(location.getLgdLocationType().getCName())
                    .title(location.getLgdLocationType().getTitle())
                    .parent(parentTypeDTO)
                    .build();
        }
        
        LgdLocationResponseDTO.ParentLocationResponseDTO parentDTO = null;
        if (location.getParent() != null) {
            parentDTO = LgdLocationResponseDTO.ParentLocationResponseDTO.builder()
                    .id(location.getParent().getId())
                    .title(location.getParent().getTitle())
                    .build();
        }
        
        return LgdLocationResponseDTO.builder()
                .id(location.getId())
                .title(location.getTitle())
                .lgdCode(location.getLgdCode())
                .lgdLocationType(locationTypeDTO)
                .parent(parentDTO)
                .build();
    }
    
}
