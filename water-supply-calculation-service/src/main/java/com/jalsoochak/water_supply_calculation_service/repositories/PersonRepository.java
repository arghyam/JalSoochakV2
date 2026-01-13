package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.PersonMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<PersonMaster, Long> {
    Optional<PersonMaster> findByIdAndTenantId(Long personId, String tenantId);
    Optional<PersonMaster> findByPhoneNumber(String phoneNumber);
}
