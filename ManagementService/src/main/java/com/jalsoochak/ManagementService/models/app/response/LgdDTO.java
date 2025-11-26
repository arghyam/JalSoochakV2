package com.jalsoochak.ManagementService.models.app.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LgdDTO {
    private String panchayat;
    private String block;
    private String district;
    private String state;
}
