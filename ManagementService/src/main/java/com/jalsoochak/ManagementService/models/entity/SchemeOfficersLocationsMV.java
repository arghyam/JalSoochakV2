package com.jalsoochak.ManagementService.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scheme_officers_locations_mv")
public class SchemeOfficersLocationsMV {

    @Id
    @Column(name = "scheme_id")
    private Long schemeId;

    @Column(name = "state_scheme_id")
    private Integer stateSchemeId;

    @Column(name = "centre_scheme_id")
    private Integer centreSchemeId;

    @Column(name = "scheme_name")
    private String schemeName;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "village")
    private String village;

    @Column(name = "panchayat")
    private String panchayat;

    @Column(name = "block")
    private String block;

    @Column(name = "district")
    private String district;

    @Column(name = "state")
    private String state;

    @Column(name = "subdivision")
    private String subdivision;

    @Column(name = "division")
    private String division;

    @Column(name = "circle")
    private String circle;

    @Column(name = "zone")
    private String zone;

    @Column(name = "jm_name")
    private String jmName;

    @Column(name = "jm_phone")
    private String jmPhone;

    @Column(name = "so_name")
    private String soName;

    @Column(name = "so_phone")
    private String soPhone;

    @Column(name = "sdm_name")
    private String sdmName;

    @Column(name = "sdm_phone")
    private String sdmPhone;

    @Column(name = "village_id")
    private Integer villageId;

    @Column(name = "panchayat_id")
    private Integer panchayatId;

    @Column(name = "block_id")
    private Integer blockId;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "state_id")
    private Integer stateId;

    @Column(name = "subdivision_id")
    private Integer subdivisionId;

    @Column(name = "division_id")
    private Integer divisionId;

    @Column(name = "circle_id")
    private Integer circleId;

    @Column(name = "zone_id")
    private Integer zoneId;

    @Column(name = "jm_id")
    private Integer jmId;

    @Column(name = "so_id")
    private Integer soId;

    @Column(name = "sdm_id")
    private Integer sdmId;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}