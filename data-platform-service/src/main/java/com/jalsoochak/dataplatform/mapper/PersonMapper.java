package com.jalsoochak.dataplatform.mapper;

import com.jalsoochak.dataplatform.dto.response.PersonResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonTypeResponseDTO;
import com.jalsoochak.dataplatform.entity.PersonMaster;

public class PersonMapper {
    
    public static PersonResponseDTO toResponseDTO(PersonMaster person) {
        if (person == null) {
            return null;
        }
        
        PersonTypeResponseDTO personTypeDTO = null;
        if (person.getPersonType() != null) {
            personTypeDTO = PersonTypeResponseDTO.builder()
                    .id(person.getPersonType().getId())
                    .cName(person.getPersonType().getCName())
                    .title(person.getPersonType().getTitle())
                    .build();
        }
        
        return PersonResponseDTO.builder()
                .id(person.getId())
                .firstName(person.getFirstName())
                .lastName(person.getLastName())
                .fullName(person.getFullName())
                .phoneNumber(person.getPhoneNumber())
                .tenantId(person.getTenantId())
                .isActive(person.getIsActive())
                .personType(personTypeDTO)
                .build();
    }
    
}
