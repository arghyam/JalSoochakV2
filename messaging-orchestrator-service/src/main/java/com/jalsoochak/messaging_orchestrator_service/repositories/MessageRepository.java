package com.jalsoochak.messaging_orchestrator_service.repositories;

import com.jalsoochak.messaging_orchestrator_service.enums.MessageStatus;
import com.jalsoochak.messaging_orchestrator_service.enums.MessageType;
import com.jalsoochak.messaging_orchestrator_service.models.entities.Message;
import com.jalsoochak.messaging_orchestrator_service.models.entities.PersonMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByPersonAndType(PersonMaster person, MessageType type);

    boolean existsByPersonAndTypeAndStatusIn(PersonMaster person, MessageType type, List<MessageStatus> statuses);

    @Query("SELECT m FROM Message m WHERE m.person.id = :personId AND m.type = :type AND m.status = :status")
    List<Message> findByPersonIdAndTypeAndStatus(
            @Param("personId") Long personId,
            @Param("type") MessageType type,
            @Param("status") MessageStatus status
    );

    @Query("""
        SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
        FROM Message m
        WHERE m.person.id = :personId
          AND m.type = 'BFM_REMINDER'
          AND m.status = 'SENT'
          AND DATE(m.sentAt) = CURRENT_DATE
    """)
    boolean existsBfmReminderSentToday(@Param("personId") Long personId);

    @Query("""
        SELECT m.receiverId
        FROM Message m
        WHERE m.person.id = :personId
          AND m.receiverId IS NOT NULL
          AND m.status = 'SENT'
        ORDER BY m.sentAt DESC
        LIMIT 1
    """)
    Long findLatestReceiverId(@Param("personId") Long personId);
}
