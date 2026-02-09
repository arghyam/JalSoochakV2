package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.PersonResponseDTO;
import com.jalsoochak.dataplatform.entity.PersonMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PersonMapper {
    
    PersonResponseDTO toResponseDTO(PersonMaster person);
    
}
