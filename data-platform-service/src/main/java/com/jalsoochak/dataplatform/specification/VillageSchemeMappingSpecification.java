package com.jalsoochak.dataplatform.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jalsoochak.dataplatform.dto.request.VillageSchemeMappingFilterDTO;
import com.jalsoochak.dataplatform.entity.VillageSchemeMapping;

import jakarta.persistence.criteria.Predicate;

public class VillageSchemeMappingSpecification {
    
    public static Specification<VillageSchemeMapping> withFilters(VillageSchemeMappingFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getVillageId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("village").get("id"), filter.getVillageId()));
            }
            
            if (filter.getSchemeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("scheme").get("id"), filter.getSchemeId()));
            }
            
            predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
