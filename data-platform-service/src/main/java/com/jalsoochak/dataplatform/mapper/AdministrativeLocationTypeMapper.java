package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationTypeMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AdministrativeLocationTypeMapper {
    
    AdministrativeLocationTypeResponseDTO toResponseDTO(AdministrativeLocationTypeMaster locationType);
    
}
