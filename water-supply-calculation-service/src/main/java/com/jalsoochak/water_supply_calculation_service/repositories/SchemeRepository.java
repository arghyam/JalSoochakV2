package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.SchemeMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchemeRepository extends JpaRepository<SchemeMaster, Long> {
    Optional<SchemeMaster> findByIdAndTenantId(Long schemeId, String tenantId);

    Optional<SchemeMaster> findByCentreSchemeIdAndTenantId(Long centreSchemeId, String tenantId);
}
