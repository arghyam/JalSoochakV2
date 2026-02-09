package com.jalsoochak.dataplatform.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.LgdLocationMaster;

@Repository
public interface LgdLocationRepository extends JpaRepository<LgdLocationMaster, Long>, JpaSpecificationExecutor<LgdLocationMaster> {

    Optional<LgdLocationMaster> findById(Long id);

}
