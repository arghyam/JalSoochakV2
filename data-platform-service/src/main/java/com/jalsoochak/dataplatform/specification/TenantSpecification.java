package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.TenantFilterDTO;
import com.jalsoochak.dataplatform.entity.TenantMaster;

import jakarta.persistence.criteria.Predicate;

public class TenantSpecification {
    
    public static Specification<TenantMaster> withFilters(TenantFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getTenantCode() != null && !filter.getTenantCode().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("tenantCode")), 
                    "%" + filter.getTenantCode().toLowerCase() + "%"
                ));
            }
            
            if (filter.getTenantName() != null && !filter.getTenantName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("tenantName")), 
                    "%" + filter.getTenantName().toLowerCase() + "%"
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
