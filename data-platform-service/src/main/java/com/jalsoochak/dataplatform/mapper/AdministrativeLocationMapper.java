package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationResponseDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AdministrativeLocationMapper {
    
    AdministrativeLocationResponseDTO toResponseDTO(AdministrativeLocationMaster location);
    
}
