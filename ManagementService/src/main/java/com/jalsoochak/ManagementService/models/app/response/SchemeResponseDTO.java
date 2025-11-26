package com.jalsoochak.ManagementService.models.app.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeResponseDTO {
    private Integer stateSchemeId;
    private Integer centreSchemeId;
    private String schemeName;
    private LocationDTO location;
    private List<VillageInfoDTO> villages;
    private List<ContactDTO> jmContacts;
    private List<ContactDTO> soContacts;
    private List<ContactDTO> sdmContacts;
}
