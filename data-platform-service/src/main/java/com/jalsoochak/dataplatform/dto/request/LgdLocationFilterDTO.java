package com.jalsoochak.dataplatform.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LgdLocationFilterDTO {
    
    private String title;
    private Integer lgdCode;
    private Long lgdLocationTypeId;
    private Long parentId;
    
}
