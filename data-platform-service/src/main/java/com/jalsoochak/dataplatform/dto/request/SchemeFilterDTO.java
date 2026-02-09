package com.jalsoochak.dataplatform.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeFilterDTO {
    
    private Integer stateSchemeId;
    private Integer centreSchemeId;
    private String tenantId;
    private Long villageId;
    private Long personId;
    private String schemeName;
    private Boolean isActive;
    
}
