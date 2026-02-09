package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.LgdLocationFilterDTO;
import com.jalsoochak.dataplatform.entity.LgdLocationMaster;

import jakarta.persistence.criteria.Predicate;

public class LgdLocationSpecification {
    
    public static Specification<LgdLocationMaster> withFilters(LgdLocationFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getTitle() != null && !filter.getTitle().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), 
                    "%" + filter.getTitle().toLowerCase() + "%"
                ));
            }
            
            if (filter.getLgdCode() != null) {
                predicates.add(criteriaBuilder.equal(root.get("lgdCode"), filter.getLgdCode()));
            }
            
            if (filter.getLgdLocationTypeId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("lgdLocationType").get("id"), 
                    filter.getLgdLocationTypeId()
                ));
            }
            
            if (filter.getParentId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("parent").get("id"), 
                    filter.getParentId()
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
