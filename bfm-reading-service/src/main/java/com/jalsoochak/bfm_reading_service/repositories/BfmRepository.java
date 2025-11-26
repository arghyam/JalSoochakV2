package com.jalsoochak.bfm_reading_service.repositories;

import com.jalsoochak.bfm_reading_service.models.entity.BfmReading;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BfmRepository extends JpaRepository<BfmReading, Long> {
}
