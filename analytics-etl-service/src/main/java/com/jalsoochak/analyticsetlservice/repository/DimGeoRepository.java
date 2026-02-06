package com.jalsoochak.analyticsetlservice.repository;

import com.jalsoochak.analyticsetlservice.entity.DimGeo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for DimGeo entity
 */
@Repository
public interface DimGeoRepository extends JpaRepository<DimGeo, UUID> {
}
