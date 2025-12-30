package com.jalsoochak.messaging_orchestrator_service.repositories;

import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PersonRepository extends JpaRepository<PersonMaster, Long> {
    @Query("SELECT p FROM PersonMaster p WHERE p.personType.title = :title")
    List<PersonMaster> findAllOperators(@Param("title") String title);

    List<PersonMaster> findByWelcomeSentFalseAndDeletedAtIsNull();

    List<PersonMaster> findByWelcomeSentFalseAndDeletedAtIsNullAndPersonType_CName(String cName);
}
