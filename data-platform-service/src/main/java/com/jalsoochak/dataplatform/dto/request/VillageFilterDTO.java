package com.jalsoochak.dataplatform.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VillageFilterDTO {
    
    private String title;
    private Integer lgdCode;
    private Long schemeId;
    private Long parentAdministrativeLocationId;
    private Long parentLgdLocationId;
    
}
