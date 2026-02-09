package com.jalsoochak.dataplatform.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.PersonSchemeMapping;

@Repository
public interface PersonSchemeMappingRepository extends JpaRepository<PersonSchemeMapping, Long>, JpaSpecificationExecutor<PersonSchemeMapping> {
    
}
