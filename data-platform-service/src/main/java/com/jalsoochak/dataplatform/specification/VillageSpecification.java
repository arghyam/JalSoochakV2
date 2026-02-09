package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.VillageFilterDTO;
import com.jalsoochak.dataplatform.entity.VillageMaster;

import jakarta.persistence.criteria.Predicate;

public class VillageSpecification {
    
    public static Specification<VillageMaster> withFilters(VillageFilterDTO filter) {
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
            
            if (filter.getSchemeId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.join("schemes").get("id"), 
                    filter.getSchemeId()
                ));
            }
            
            if (filter.getParentAdministrativeLocationId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("parentAdministrativeLocation").get("id"), 
                    filter.getParentAdministrativeLocationId()
                ));
            }
            
            if (filter.getParentLgdLocationId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("parentLgdLocation").get("id"), 
                    filter.getParentLgdLocationId()
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
