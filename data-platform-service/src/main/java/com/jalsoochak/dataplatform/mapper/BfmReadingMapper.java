package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.BfmReadingResponseDTO;
import com.jalsoochak.dataplatform.entity.BfmReading;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BfmReadingMapper {
    
    @Mapping(source = "scheme.id", target = "schemeId")
    @Mapping(source = "person.id", target = "personId")
    BfmReadingResponseDTO toResponseDTO(BfmReading bfmReading);
    
}
