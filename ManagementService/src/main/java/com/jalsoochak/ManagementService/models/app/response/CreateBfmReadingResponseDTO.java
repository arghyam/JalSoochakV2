package com.jalsoochak.ManagementService.models.app.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBfmReadingResponseDTO {

    private String submissionId;
    private BigDecimal computedQuantityLitre;
}