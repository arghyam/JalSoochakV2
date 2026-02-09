package com.jalsoochak.dataplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdministrativeLocationTypeResponseDTO {
    
    private Long id;
    private String cName;
    private String title;
    private ParentTypeResponseDTO parent;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParentTypeResponseDTO {
        private Long id;
        private String cName;
        private String title;
    }
    
}
