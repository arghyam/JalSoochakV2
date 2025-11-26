package com.jalsoochak.ManagementService.repositories;

import com.jalsoochak.ManagementService.models.entity.SchemeOfficersLocationsMV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SchemeOfficersLocationsMVRepository extends JpaRepository<SchemeOfficersLocationsMV, Long> {
    List<SchemeOfficersLocationsMV> findByCentreSchemeId(Integer centreSchemeId);

    @Query("SELECT s FROM SchemeOfficersLocationsMV s WHERE " +
            "(:schemeName IS NULL OR s.schemeName = :schemeName) AND " +
            "(:stateSchemeId IS NULL OR s.stateSchemeId = :stateSchemeId) AND " +
            "(:centreSchemeId IS NULL OR s.centreSchemeId = :centreSchemeId) AND " +
            "(:zone IS NULL OR s.zone = :zone) AND " +
            "(:circle IS NULL OR s.circle = :circle)")
    List<SchemeOfficersLocationsMV> findByFilters(
            @Param("schemeName") String schemeName,
            @Param("stateSchemeId") Integer stateSchemeId,
            @Param("centreSchemeId") Integer centreSchemeId,
            @Param("zone") String zone,
            @Param("circle") String circle);
//    Todo: I might add more filters based on requirement from company
}
