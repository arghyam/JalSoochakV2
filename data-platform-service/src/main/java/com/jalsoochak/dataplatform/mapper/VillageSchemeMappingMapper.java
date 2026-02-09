package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.VillageSchemeMappingResponseDTO;
import com.jalsoochak.dataplatform.entity.VillageSchemeMapping;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VillageSchemeMappingMapper {
    
    @Mapping(source = "village.id", target = "villageId")
    @Mapping(source = "scheme.id", target = "schemeId")
    VillageSchemeMappingResponseDTO toResponseDTO(VillageSchemeMapping mapping);
    
}
