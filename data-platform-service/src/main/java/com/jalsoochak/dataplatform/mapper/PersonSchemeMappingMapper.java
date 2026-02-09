package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.PersonSchemeMappingResponseDTO;
import com.jalsoochak.dataplatform.entity.PersonSchemeMapping;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PersonSchemeMappingMapper {
    
    @Mapping(source = "person.id", target = "personId")
    @Mapping(source = "scheme.id", target = "schemeId")
    PersonSchemeMappingResponseDTO toResponseDTO(PersonSchemeMapping mapping);
    
}
