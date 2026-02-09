package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.SchemeResponseDTO;
import com.jalsoochak.dataplatform.entity.SchemeMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SchemeMapper {
    
    SchemeResponseDTO toResponseDTO(SchemeMaster scheme);
    
}
