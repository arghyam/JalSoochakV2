package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.PersonSchemeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PersonSchemeRepository extends JpaRepository<PersonSchemeMapping, Long> {
    @Query("SELECT p FROM PersonSchemeMapping p WHERE p.personId = :personId AND p.schemeId = :schemeId")
    Optional<PersonSchemeMapping> findByPersonIdAndSchemeId(
            @Param("personId") Long personId,
            @Param("schemeId") Long schemeId);
}
