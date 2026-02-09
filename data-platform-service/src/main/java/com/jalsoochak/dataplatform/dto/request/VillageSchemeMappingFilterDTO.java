package com.jalsoochak.dataplatform.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VillageSchemeMappingFilterDTO {
    
    private Long villageId;
    private Long schemeId;
    
}
