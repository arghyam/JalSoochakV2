package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.BfmReading;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BfmReadingRepository extends JpaRepository<BfmReading, Long> {
    Optional<BfmReading> findTopByScheme_IdAndTenantIdOrderByReadingDateTimeDesc(Long schemeId, String tenantId);
    Optional<BfmReading> findByCorrelationIdAndTenantId(
            String correlationId,
            String tenantId
    );
    Optional<BfmReading> findTopByScheme_IdAndTenantIdAndIdNotOrderByReadingDateTimeDesc(
            Long schemeId,
            String tenantId,
            Long excludedId
    );

    @Query("""
    SELECT r FROM BfmReading r
    WHERE r.scheme.id = :schemeId
      AND r.tenantId = :tenantId
      AND r.id <> :excludedId
      AND r.confirmedReading > 0
      AND (r.qualityConfidence IS NULL OR r.qualityConfidence >= 0.7)
    ORDER BY r.readingDateTime DESC
""")
    Optional<BfmReading> findLastValidConfirmedReading(
            @Param("schemeId") Long schemeId,
            @Param("tenantId") String tenantId,
            @Param("excludedId") Long excludedId,
            Pageable pageable
    );


}
