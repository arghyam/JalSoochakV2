package com.jalsoochak.ManagementService.models.app.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeFilterDTO {
    private String schemeName;
    private Integer stateSchemeId;
    private Integer centreSchemeId;
    private String zone;
    private String circle;
    private String division;
    private String subdivision;
    private String district;
    private String block;
    private String panchayat;
    private String village;
    private String sdmPhone;
    private String soPhone;
    private String jmPhone;
    private String sdmName;
    private String soName;
    private String jmName;
    private Integer page = 1;
    private Integer limit = 10;

    public Integer getPage() {
        return page;
    }

    public Integer getLimit() {
        return limit;
    }
}
