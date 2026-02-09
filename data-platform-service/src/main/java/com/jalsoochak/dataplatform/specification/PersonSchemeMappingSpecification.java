package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.PersonSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.entity.PersonSchemeMapping;

import jakarta.persistence.criteria.Predicate;

public class PersonSchemeMappingSpecification {
    
    public static Specification<PersonSchemeMapping> withFilters(PersonSchemeMappingFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getPersonId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("person").get("id"), filter.getPersonId()));
            }
            
            if (filter.getSchemeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("scheme").get("id"), filter.getSchemeId()));
            }
            
            predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
