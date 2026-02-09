package com.jalsoochak.dataplatform.dto.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BfmReadingFilterDTO {
    
    private String tenantId;
    private String correlationId;
    private Long schemeId;
    private Long personId;
    private LocalDateTime readingDateTimeStart;
    private LocalDateTime readingDateTimeEnd;
    
}
