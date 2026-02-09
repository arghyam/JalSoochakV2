package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.LgdLocationResponseDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface LgdLocationMapper {
    
    LgdLocationResponseDTO toResponseDTO(LgdLocationMaster location);
    
}
