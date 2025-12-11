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
    private Long stateSchemeId;

    @Column(name = "centre_scheme_id")
    private Long centreSchemeId;

    @Column(name = "scheme_name")
    private Long schemeName;

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
    private Long panchayatId;

    @Column(name = "block_id")
    private Long blockId;

    @Column(name = "district_id")
    private Long districtId;

    @Column(name = "state_id")
    private Long stateId;

    @Column(name = "subdivision_id")
    private Long subdivisionId;

    @Column(name = "division_id")
    private Long divisionId;

    @Column(name = "circle_id")
    private Long circleId;

    @Column(name = "zone_id")
    private Long zoneId;

    @Column(name = "jm_id")
    private Long jmId;

    @Column(name = "so_id")
    private Long soId;

    @Column(name = "sdm_id")
    private Long sdmId;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}