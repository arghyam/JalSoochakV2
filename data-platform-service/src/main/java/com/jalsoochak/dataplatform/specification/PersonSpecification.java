package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.PersonFilterDTO;
import com.jalsoochak.dataplatform.entity.PersonMaster;

import jakarta.persistence.criteria.Predicate;

public class PersonSpecification {
    
    public static Specification<PersonMaster> withFilters(PersonFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getFirstName() != null && !filter.getFirstName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("firstName")), 
                    "%" + filter.getFirstName().toLowerCase() + "%"
                ));
            }
            
            if (filter.getLastName() != null && !filter.getLastName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("lastName")), 
                    "%" + filter.getLastName().toLowerCase() + "%"
                ));
            }
            
            if (filter.getPhoneNumber() != null && !filter.getPhoneNumber().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("phoneNumber"), filter.getPhoneNumber()));
            }
            
            if (filter.getPersonTypeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("personType").get("id"), filter.getPersonTypeId()));
            }
            
            if (filter.getTenantId() != null && !filter.getTenantId().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("tenantId"), filter.getTenantId()));
            }
            
            if (filter.getIsActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), filter.getIsActive()));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
