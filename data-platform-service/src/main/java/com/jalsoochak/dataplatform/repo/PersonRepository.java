package com.jalsoochak.dataplatform.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.PersonMaster;

import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<PersonMaster, Long>, JpaSpecificationExecutor<PersonMaster> {

    List<PersonMaster> findAll(Specification<PersonMaster> spec);

    Optional<PersonMaster> findById(Long id);
    
    Optional<PersonMaster> findByPhoneNumber(String phoneNumber);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
}
