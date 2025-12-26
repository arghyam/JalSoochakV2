package com.jalsoochak.water_supply_calculation_service.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scheme_master")
public class SchemeMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "state_scheme_id")
    private Long stateSchemeId;

    @Column(name = "centre_scheme_id")
    private Long centreSchemeId;

    @Column(name = "scheme_name", length = 200)
    private String schemeName;

    @Column(name = "fhtc_count")
    private Integer fhtcCount;

    @Column(name = "house_hold_count")
    private Integer houseHoldCount;

    @Column(columnDefinition = "GEOMETRY")
    private String geolocation;

    @Column(name = "scheme_type_id", nullable = false)
    private Long schemeTypeId;

    @Column(name = "village_id", nullable = false)
    private Long villageId;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

}