package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.LgdLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationTypeMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface LgdLocationTypeMapper {
    
    LgdLocationTypeResponseDTO toResponseDTO(LgdLocationTypeMaster locationType);
    
}
