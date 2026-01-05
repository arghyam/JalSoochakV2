package com.jalsoochak.messaging_orchestrator_service.repositories;

import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonRepository extends JpaRepository<PersonMaster, Long> {
    List<PersonMaster> findByDeletedAtIsNullAndPersonType_cName(String cName);
}
