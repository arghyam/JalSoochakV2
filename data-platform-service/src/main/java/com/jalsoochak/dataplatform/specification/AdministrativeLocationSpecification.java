package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.AdministrativeLocationFilterDTO;
import com.jalsoochak.dataplatform.entity.AdministrativeLocationMaster;

import jakarta.persistence.criteria.Predicate;

public class AdministrativeLocationSpecification {
    
    public static Specification<AdministrativeLocationMaster> withFilters(AdministrativeLocationFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getTitle() != null && !filter.getTitle().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), 
                    "%" + filter.getTitle().toLowerCase() + "%"
                ));
            }
            
            if (filter.getAdministrativeLocationTypeId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("administrativeLocationType").get("id"), 
                    filter.getAdministrativeLocationTypeId()
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
