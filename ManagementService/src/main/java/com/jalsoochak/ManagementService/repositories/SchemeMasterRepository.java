package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.SchemeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchemeMasterRepository extends JpaRepository<SchemeMaster, Long> {
    Optional<SchemeMaster> findByIdAndDeletedAtIsNull(Long id);
}