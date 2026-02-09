package com.jalsoochak.dataplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LgdLocationResponseDTO {
    
    private Long id;
    private String title;
    private Integer lgdCode;
    private LgdLocationTypeResponseDTO lgdLocationType;
    private ParentLocationResponseDTO parent;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParentLocationResponseDTO {
        private Long id;
        private String title;
    }
    
}
