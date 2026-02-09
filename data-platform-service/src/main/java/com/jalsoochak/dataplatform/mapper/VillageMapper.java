package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.VillageResponseDTO;
import com.jalsoochak.dataplatform.entity.VillageMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VillageMapper {
    
    @Mapping(source = "parentAdministrativeLocation.id", target = "parentAdministrativeLocationId")
    @Mapping(source = "parentLgdLocation.id", target = "parentLgdLocationId")
    VillageResponseDTO toResponseDTO(VillageMaster village);
    
}
