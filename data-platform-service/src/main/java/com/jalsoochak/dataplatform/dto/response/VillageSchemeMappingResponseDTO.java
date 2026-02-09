package com.jalsoochak.dataplatform.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VillageSchemeMappingResponseDTO {
    
    private Long id;
    private Long villageId;
    private Long schemeId;
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
    private Long deletedBy;
    private LocalDateTime deletedAt;
    
}
