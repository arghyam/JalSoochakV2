package com.jalsoochak.messaging_orchestrator_service.repositories;

import com.jalsoochak.messaging_orchestrator_service.models.entities.BfmReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BfmReadingRepository extends JpaRepository<BfmReading, Long> {

    @Query("""
        SELECT COUNT(r) > 0
        FROM BfmReading r
        WHERE r.person.id = :personId
          AND r.readingDateTime >= :startOfDay
          AND r.readingDateTime < :endOfDay
          AND r.deletedAt IS NULL
    """)
    boolean existsReadingForPersonOnDate(
            @Param("personId") Long personId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}
