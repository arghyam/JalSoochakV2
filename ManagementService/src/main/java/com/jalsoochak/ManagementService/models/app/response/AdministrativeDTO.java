package com.jalsoochak.ManagementService.models.app.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdministrativeDTO {
    private String subdivision;
    private String division;
    private String circle;
    private String zone;

}
