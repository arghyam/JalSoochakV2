package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.InviteToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InviteTokenRepository extends JpaRepository<InviteToken, Long> {
    Optional<InviteToken> findByToken(String token);
}
