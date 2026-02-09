package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationTypeMaster;

public class AdministrativeLocationTypeMapper {
    
    public static AdministrativeLocationTypeResponseDTO toResponseDTO(AdministrativeLocationTypeMaster locationType) {
        if (locationType == null) {
            return null;
        }
        
        AdministrativeLocationTypeResponseDTO.ParentTypeResponseDTO parentDTO = null;
        if (locationType.getParent() != null) {
            parentDTO = AdministrativeLocationTypeResponseDTO.ParentTypeResponseDTO.builder()
                    .id(locationType.getParent().getId())
                    .cName(locationType.getParent().getCName())
                    .title(locationType.getParent().getTitle())
                    .build();
        }
        
        return AdministrativeLocationTypeResponseDTO.builder()
                .id(locationType.getId())
                .cName(locationType.getCName())
                .title(locationType.getTitle())
                .parent(parentDTO)
                .build();
    }
    
}
