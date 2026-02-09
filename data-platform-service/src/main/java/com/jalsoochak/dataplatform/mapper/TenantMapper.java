package com.jalsoochak.dataplatform.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.jalsoochak.dataplatform.dto.response.TenantResponseDTO;
import com.jalsoochak.dataplatform.entity.TenantMaster;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TenantMapper {
    
    TenantResponseDTO toResponseDTO(TenantMaster tenant);
    
}
