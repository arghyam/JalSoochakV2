package com.jalsoochak.dataplatform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lgd_location_master")
public class LgdLocationMaster extends AuditEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "lgd_code")
    private Integer lgdCode;

    @ManyToOne
    @JoinColumn(name = "lgd_location_type_id", referencedColumnName = "id")
    private LgdLocationTypeMaster lgdLocationType;

    @ManyToOne
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private LgdLocationMaster parent;
    
}















