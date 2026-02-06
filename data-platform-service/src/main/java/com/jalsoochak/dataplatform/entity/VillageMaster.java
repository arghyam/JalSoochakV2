package com.jalsoochak.dataplatform.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "village_master")
public class VillageMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "lgd_code")
    private Integer lgdCode;

    @Column(name = "house_hold_count")
    private Integer houseHoldCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_administrative_location_id")
    private AdministrativeLocationMaster parentAdministrativeLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_lgd_location_id")
    private LgdLocationMaster parentLgdLocation;

    @OneToMany(mappedBy = "village", fetch = FetchType.LAZY)
    private List<SchemeMaster> schemes;
}









