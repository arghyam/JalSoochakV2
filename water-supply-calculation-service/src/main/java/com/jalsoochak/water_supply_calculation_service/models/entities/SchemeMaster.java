package com.jalsoochak.water_supply_calculation_service.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "scheme_master",
        indexes = {
                @Index(name = "idx_scheme_tenant_id", columnList = "tenant_id"),
                @Index(name = "idx_scheme_state_id", columnList = "state_scheme_id")
        }
)
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
    private Integer stateSchemeId;

    @Column(name = "centre_scheme_id")
    private Integer centreSchemeId;

    @Column(name = "scheme_name", length = 200)
    private String schemeName;

    @Column(name = "fhtc_count")
    private Integer fhtcCount;

    @Column(name = "house_hold_count")
    private Integer houseHoldCount;

    @Column(columnDefinition = "GEOMETRY")
    private String geolocation;

    @Column(name = "tenant_id")
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_type_id")
    private SchemeTypeMaster schemeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private VillageMaster village;

    @OneToMany(mappedBy = "scheme", fetch = FetchType.LAZY)
    private List<PersonSchemeMapping> personSchemeMappings;

    @OneToMany(mappedBy = "scheme", fetch = FetchType.LAZY)
    private List<BfmReading> bfmReadings;
}