package com.jalsoochak.dataplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VillageResponseDTO {
    
    private Long id;
    private String title;
    private Integer lgdCode;
    private Integer houseHoldCount;
    private Long parentAdministrativeLocationId;
    private Long parentLgdLocationId;
    
}
