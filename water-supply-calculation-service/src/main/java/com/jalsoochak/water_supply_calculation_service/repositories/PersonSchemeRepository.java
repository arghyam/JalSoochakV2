package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.PersonSchemeMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonSchemeRepository extends JpaRepository<PersonSchemeMapping, Long> {
    Optional<PersonSchemeMapping> findByPerson_IdAndScheme_Id(Long personId, Long schemeId);
    Optional<PersonSchemeMapping> findFirstByPerson_Id(Long personId);
}

