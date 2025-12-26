package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.BfmReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BfmReadingRepository extends JpaRepository<BfmReading, Long> {
    Optional<BfmReading> findTopByScheme_IdAndTenantIdOrderByReadingDateTimeDesc(Long schemeId, String tenantId);
}
