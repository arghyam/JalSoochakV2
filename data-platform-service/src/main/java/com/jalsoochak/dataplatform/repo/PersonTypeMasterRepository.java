package com.jalsoochak.dataplatform.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.PersonTypeMaster;

@Repository
public interface PersonTypeMasterRepository extends JpaRepository<PersonTypeMaster, Long> {

    Optional<PersonTypeMaster> findById(Long id);
    
    Optional<PersonTypeMaster> findByCName(String cName);
    
}
