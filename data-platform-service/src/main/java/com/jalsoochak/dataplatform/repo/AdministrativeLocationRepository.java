package com.jalsoochak.dataplatform.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.AdministrativeLocationMaster;

@Repository
public interface AdministrativeLocationRepository extends JpaRepository<AdministrativeLocationMaster, Long>, JpaSpecificationExecutor<AdministrativeLocationMaster> {

    Optional<AdministrativeLocationMaster> findById(Long id);

}
