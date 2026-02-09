package com.jalsoochak.dataplatform.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.AdministrativeLocationTypeMaster;

@Repository
public interface AdministrativeLocationTypeRepository extends JpaRepository<AdministrativeLocationTypeMaster, Long> {

    List<AdministrativeLocationTypeMaster> findAll();

    Optional<AdministrativeLocationTypeMaster> findById(Long id);

}
