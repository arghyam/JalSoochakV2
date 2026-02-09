package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.LgdLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationTypeMaster;

public class LgdLocationTypeMapper {
    
    public static LgdLocationTypeResponseDTO toResponseDTO(LgdLocationTypeMaster locationType) {
        if (locationType == null) {
            return null;
        }
        
        LgdLocationTypeResponseDTO.ParentTypeResponseDTO parentDTO = null;
        if (locationType.getParent() != null) {
            parentDTO = LgdLocationTypeResponseDTO.ParentTypeResponseDTO.builder()
                    .id(locationType.getParent().getId())
                    .cName(locationType.getParent().getCName())
                    .title(locationType.getParent().getTitle())
                    .build();
        }
        
        return LgdLocationTypeResponseDTO.builder()
                .id(locationType.getId())
                .cName(locationType.getCName())
                .title(locationType.getTitle())
                .parent(parentDTO)
                .build();
    }
    
}
