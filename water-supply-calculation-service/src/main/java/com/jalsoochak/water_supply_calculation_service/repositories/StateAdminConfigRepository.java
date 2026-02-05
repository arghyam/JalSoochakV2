package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.MessageTemplate;
import com.jalsoochak.water_supply_calculation_service.models.entities.PersonMaster;
import com.jalsoochak.water_supply_calculation_service.models.entities.StateAdminConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StateAdminConfigRepository extends JpaRepository<StateAdminConfig, Long> {
    Optional<StateAdminConfig> findByPhoneNumber(String phoneNumber);
}
