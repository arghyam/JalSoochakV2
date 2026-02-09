package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.BfmReadingFilterDTO;
import com.jalsoochak.dataplatform.entity.BfmReading;

import jakarta.persistence.criteria.Predicate;

public class BfmReadingSpecification {
    
    public static Specification<BfmReading> withFilters(BfmReadingFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getTenantId() != null && !filter.getTenantId().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("tenantId"), filter.getTenantId()));
            }
            
            if (filter.getCorrelationId() != null && !filter.getCorrelationId().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("correlationId")), 
                    "%" + filter.getCorrelationId().toLowerCase() + "%"
                ));
            }
            
            if (filter.getSchemeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("scheme").get("id"), filter.getSchemeId()));
            }
            
            if (filter.getPersonId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("person").get("id"), filter.getPersonId()));
            }
            
            if (filter.getReadingDateTimeStart() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("readingDateTime"), 
                    filter.getReadingDateTimeStart()
                ));
            }
            
            if (filter.getReadingDateTimeEnd() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("readingDateTime"), 
                    filter.getReadingDateTimeEnd()
                ));
            }
            
            // Only include non-deleted records (soft delete)
            predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
