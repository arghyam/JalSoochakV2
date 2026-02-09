package com.jalsoochak.dataplatform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.LgdLocationTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationTypeMaster;
import com.jalsoochak.dataplatform.exception.LgdLocationTypeNotFoundException;
import com.jalsoochak.dataplatform.mapper.LgdLocationTypeMapper;
import com.jalsoochak.dataplatform.repo.LgdLocationTypeRepository;
import com.jalsoochak.dataplatform.service.LgdLocationTypeService;

@Service
public class LgdLocationTypleServiceImpl implements LgdLocationTypeService {

    private final LgdLocationTypeRepository lgdLocationTypeRepository;

    public LgdLocationTypleServiceImpl(LgdLocationTypeRepository lgdLocationTypeRepository) {
        this.lgdLocationTypeRepository = lgdLocationTypeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<LgdLocationTypeResponseDTO>> getAllLgdLocationTypes() {
        List<LgdLocationTypeMaster> locationTypes = lgdLocationTypeRepository.findAll();
        
        List<LgdLocationTypeResponseDTO> responseDTOs = locationTypes.stream()
                .map(LgdLocationTypeMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        return ApiResponseDTO.success(responseDTOs);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<LgdLocationTypeResponseDTO> getLgdLocationTypeById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("LGD Location Type ID cannot be null");
        }
        LgdLocationTypeMaster locationType = lgdLocationTypeRepository.findById(id)
                .orElseThrow(() -> new LgdLocationTypeNotFoundException(id));
        
        LgdLocationTypeResponseDTO responseDTO = LgdLocationTypeMapper.toResponseDTO(locationType);
        return ApiResponseDTO.success(responseDTO);
    }
    
}