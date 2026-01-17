package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonMasterRepository extends JpaRepository<PersonMaster, Long> {
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<PersonMaster> findByPhoneNumber(String phoneNumber);
    Optional<PersonMaster> findByEmail(String email);
}
