package com.jalsoochak.dataplatform.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.BfmReading;

@Repository
public interface BfmReadingRepository extends JpaRepository<BfmReading, Long>, JpaSpecificationExecutor<BfmReading> {
    
}
