package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonTypeMasterRepository extends JpaRepository<PersonTypeMaster, Long> {
   Optional<PersonTypeMaster> findBycName(String cName);
}
