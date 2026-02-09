package com.jalsoochak.dataplatform.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantFilterDTO {
    
    private String tenantCode;
    private String tenantName;
    
}
