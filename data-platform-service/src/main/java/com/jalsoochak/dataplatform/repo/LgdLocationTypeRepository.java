package com.jalsoochak.dataplatform.repo;

import com.jalsoochak.dataplatform.entity.LgdLocationTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LgdLocationTypeRepository extends JpaRepository<LgdLocationTypeMaster, Long> {

    List<LgdLocationTypeMaster> findAll();

    Optional<LgdLocationTypeMaster> findById(Long id);
    
}
