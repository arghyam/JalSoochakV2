package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.SchemeFilterDTO;
import com.jalsoochak.dataplatform.entity.SchemeMaster;

import jakarta.persistence.criteria.Predicate;

public class SchemeSpecification {
    
    public static Specification<SchemeMaster> withFilters(SchemeFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getStateSchemeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("stateSchemeId"), filter.getStateSchemeId()));
            }
            
            if (filter.getCentreSchemeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("centreSchemeId"), filter.getCentreSchemeId()));
            }
            
            if (filter.getTenantId() != null && !filter.getTenantId().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("tenantId"), filter.getTenantId()));
            }
            
            if (filter.getVillageId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("village").get("id"), filter.getVillageId()));
            }
            
            if (filter.getPersonId() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.join("personSchemeMappings").get("person").get("id"), 
                    filter.getPersonId()
                ));
            }
            
            if (filter.getSchemeName() != null && !filter.getSchemeName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("schemeName")), 
                    "%" + filter.getSchemeName().toLowerCase() + "%"
                ));
            }
            
            if (filter.getIsActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), filter.getIsActive()));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
