package com.jalsoochak.ManagementService.services.impl;

import com.jalsoochak.ManagementService.models.app.response.SchemeFilterDTO;
import com.jalsoochak.ManagementService.models.entity.SchemeOfficersLocationsMV;
import com.jalsoochak.ManagementService.repositories.CustomSchemeRepository;
import java.util.List;

public class CustomSchemeRepositoryImpl implements CustomSchemeRepository {


    @Override
    public List<SchemeOfficersLocationsMV> findByDynamicFilters(SchemeFilterDTO filter) {
        return List.of();
    }
}
