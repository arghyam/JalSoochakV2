package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.BfmReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BfmReadingRepository extends JpaRepository<BfmReading, Long> {

    List<BfmReading> findByTenantIdAndDeletedAtIsNull(String tenantId);

    List<BfmReading> findBySchemeIdAndDeletedAtIsNull(Long schemeId);
}