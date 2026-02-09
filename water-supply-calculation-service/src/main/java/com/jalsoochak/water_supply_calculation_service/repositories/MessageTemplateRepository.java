package com.jalsoochak.water_supply_calculation_service.repositories;

import com.jalsoochak.water_supply_calculation_service.models.entities.MessageTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, Long> {
    Optional<MessageTemplate> findByFlowNameAndLanguageCode(
            String flowName,
            String languageCode
    );
}
