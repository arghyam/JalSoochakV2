package com.jalsoochak.analyticsetlservice.mapper;

import com.jalsoochak.analyticsetlservice.dto.DimGeoResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimGeo;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting DimGeo entity to DTO
 */
@Component
public class GeoMapper {

    /**
     * Convert DimGeo entity to DimGeoResponseDTO
     *
     * @param entity DimGeo entity
     * @return DimGeoResponseDTO
     */
    public DimGeoResponseDTO toDTO(DimGeo entity) {
        if (entity == null) {
            return null;
        }

        return DimGeoResponseDTO.builder()
                .geoId(entity.getGeoId())
                .tenantId(entity.getTenantId())
                .type(entity.getType())
                .name(entity.getName())
                .geoStateId(entity.getGeoStateId())
                .geoDistrictId(entity.getGeoDistrictId())
                .geoBlockId(entity.getGeoBlockId())
                .geoGpId(entity.getGeoGpId())
                .geoVillageId(entity.getGeoVillageId())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
