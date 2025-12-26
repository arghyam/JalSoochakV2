package com.jalsoochak.messaging_orchestrator_service.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bfm_reading")
public class BfmReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "reading_date_time", updatable = false)
    private LocalDateTime readingDateTime;

    @Column(name = "confirmed_reading", precision = 10, scale = 1)
    private BigDecimal confirmedReading;

    @Column(name = "extracted_reading", precision = 10, scale = 1)
    private BigDecimal extractedReading;

    @Column(name = "reading_url", length = 2048)
    private String readingUrl;

    @Column(columnDefinition = "GEOMETRY")
    private String geolocation;

    @Column(name = "correlation_id", length = 36)
    private String correlationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id")
    private SchemeMaster scheme;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    private PersonMaster person;

}