package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
