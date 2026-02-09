package com.jalsoochak.dataplatform.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonFilterDTO {
    
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Long personTypeId;
    private String tenantId;
    private Boolean isActive;
    
}
