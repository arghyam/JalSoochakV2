package com.jalsoochak.dataplatform.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.VillageMaster;

@Repository
public interface VillageRepository extends JpaRepository<VillageMaster, Long>, JpaSpecificationExecutor<VillageMaster> {
    
}
