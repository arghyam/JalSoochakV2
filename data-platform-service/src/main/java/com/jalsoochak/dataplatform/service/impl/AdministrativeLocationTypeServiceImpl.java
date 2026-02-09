package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.response.AdministrativeLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationTypeMaster;
import com.jalsoochak.dataplatform.exception.AdministrativeLocationTypeNotFoundException;
import com.jalsoochak.dataplatform.mapper.AdministrativeLocationTypeMapper;
import com.jalsoochak.dataplatform.repo.AdministrativeLocationTypeRepository;
import com.jalsoochak.dataplatform.service.AdministrativeLocationTypeService;

@Service
public class AdministrativeLocationTypeServiceImpl implements AdministrativeLocationTypeService{
    
    private final AdministrativeLocationTypeRepository administrativeLocationTypeRepository;

    public AdministrativeLocationTypeServiceImpl(AdministrativeLocationTypeRepository administrativeLocationTypeRepository) {
        this.administrativeLocationTypeRepository = administrativeLocationTypeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<AdministrativeLocationTypeResponseDTO>> getAllAdministrativeLocationTypes() {
        List<AdministrativeLocationTypeMaster> locationTypes = administrativeLocationTypeRepository.findAll();
        
        List<AdministrativeLocationTypeResponseDTO> responseDTOs = locationTypes.stream()
                .map(AdministrativeLocationTypeMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        return ApiResponseDTO.success(responseDTOs);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<AdministrativeLocationTypeResponseDTO> getAdministrativeLocationTypeById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Administrative Location Type ID cannot be null");
        }
        AdministrativeLocationTypeMaster locationType = administrativeLocationTypeRepository.findById(id)
                .orElseThrow(() -> new AdministrativeLocationTypeNotFoundException(id));
        
        AdministrativeLocationTypeResponseDTO responseDTO = AdministrativeLocationTypeMapper.toResponseDTO(locationType);
        return ApiResponseDTO.success(responseDTO);
    }
    
}
