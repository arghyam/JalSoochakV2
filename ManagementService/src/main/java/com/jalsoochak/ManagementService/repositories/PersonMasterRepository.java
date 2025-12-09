package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.PersonMaster;
import com.jalsoochak.ManagementService.models.entity.PersonTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonMasterRepository extends JpaRepository<PersonMaster, Long> {
    boolean existsByPhoneNumber(String phoneNumber);
}
