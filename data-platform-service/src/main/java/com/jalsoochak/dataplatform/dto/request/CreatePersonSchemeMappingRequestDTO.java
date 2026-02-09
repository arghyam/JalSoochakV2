package com.jalsoochak.dataplatform.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePersonSchemeMappingRequestDTO {
    
    @NotNull(message = "Person ID cannot be null")
    private Long personId;
    
    @NotNull(message = "Scheme ID cannot be null")
    private Long schemeId;
    
}
