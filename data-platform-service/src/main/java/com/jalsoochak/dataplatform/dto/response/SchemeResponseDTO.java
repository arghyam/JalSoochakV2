package com.jalsoochak.dataplatform.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeResponseDTO {
    
    private Long id;
    private Integer stateSchemeId;
    private Integer centreSchemeId;
    private String schemeName;
    private Integer fhtcCount;
    private Integer plannedFhtc;
    private Integer houseHoldCount;
    private BigDecimal latitude;
    private Double longitude;
    private String geolocation;
    private Boolean isActive;
    private String tenantId;
    private VillageResponseDTO village;
    
}
