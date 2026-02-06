package com.jalsoochak.analyticsetlservice.service.impl;

import com.jalsoochak.analyticsetlservice.dto.DimGeoResponseDTO;
import com.jalsoochak.analyticsetlservice.entity.DimGeo;
import com.jalsoochak.analyticsetlservice.mapper.GeoMapper;
import com.jalsoochak.analyticsetlservice.repository.DimGeoRepository;
import com.jalsoochak.analyticsetlservice.service.GeoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Geo operations
 */
@Service
public class GeoServiceImpl implements GeoService {

    private final DimGeoRepository dimGeoRepository;
    private final GeoMapper geoMapper;

    public GeoServiceImpl(DimGeoRepository dimGeoRepository, GeoMapper geoMapper) {
        this.dimGeoRepository = dimGeoRepository;
        this.geoMapper = geoMapper;
    }

    @Override
    public List<DimGeoResponseDTO> getAllGeo() {
        List<DimGeo> entities = dimGeoRepository.findAll();
        return entities.stream()
                .map(geoMapper::toDTO)
                .collect(Collectors.toList());
    }
}
