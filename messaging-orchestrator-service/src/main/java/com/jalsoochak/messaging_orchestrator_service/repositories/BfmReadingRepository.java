package com.jalsoochak.messaging_orchestrator_service.repositories;

import com.jalsoochak.messaging_orchestrator_service.models.entities.BfmReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface BfmReadingRepository extends JpaRepository<BfmReading, Long> {
    @Query("""
        SELECT COUNT(r) > 0
        FROM BfmReading r
        WHERE r.person.id = :personId
          AND DATE(r.readingDateTime) = :date
          AND r.deletedAt IS NULL
    """)
    boolean existsReadingForPersonOnDate(
            @Param("personId") Long personId,
            @Param("date") LocalDate date
    );
}
