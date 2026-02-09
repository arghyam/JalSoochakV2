package com.jalsoochak.dataplatform.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jalsoochak.dataplatform.entity.TenantMaster;

@Repository
public interface TenantRepository extends JpaRepository<TenantMaster, Long>, JpaSpecificationExecutor<TenantMaster> {
    
}
