package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationResponseDTO;
import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationMaster;

public class AdministrativeLocationMapper {
    
    public static AdministrativeLocationResponseDTO toResponseDTO(AdministrativeLocationMaster location) {
        if (location == null) {
            return null;
        }
        
        AdministrativeLocationTypeResponseDTO locationTypeDTO = null;
        if (location.getAdministrativeLocationType() != null) {
            
            AdministrativeLocationTypeResponseDTO.ParentTypeResponseDTO parentTypeDTO = null;
            if (location.getAdministrativeLocationType().getParent() != null) {
                parentTypeDTO = AdministrativeLocationTypeResponseDTO.ParentTypeResponseDTO.builder()
                        .id(location.getAdministrativeLocationType().getParent().getId())
                        .cName(location.getAdministrativeLocationType().getParent().getCName())
                        .title(location.getAdministrativeLocationType().getParent().getTitle())
                        .build();
            }

            locationTypeDTO = AdministrativeLocationTypeResponseDTO.builder()
                    .id(location.getAdministrativeLocationType().getId())
                    .cName(location.getAdministrativeLocationType().getCName())
                    .title(location.getAdministrativeLocationType().getTitle())
                    .parent(parentTypeDTO)
                    .build();
        }
        
        AdministrativeLocationResponseDTO.ParentLocationResponseDTO parentDTO = null;
        if (location.getParent() != null) {
            parentDTO = AdministrativeLocationResponseDTO.ParentLocationResponseDTO.builder()
                    .id(location.getParent().getId())
                    .title(location.getParent().getTitle())
                    .build();
        }
        
        return AdministrativeLocationResponseDTO.builder()
                .id(location.getId())
                .title(location.getTitle())
                .administrativeLocationType(locationTypeDTO)
                .parent(parentDTO)
                .build();
    }
    
}
