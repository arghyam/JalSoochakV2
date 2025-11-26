package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.app.response.SchemeFilterDTO;
import com.jalsoochak.ManagementService.models.entity.SchemeOfficersLocationsMV;

import java.util.List;

public interface CustomSchemeRepository {
    List<SchemeOfficersLocationsMV> findByDynamicFilters(SchemeFilterDTO filter);
}
