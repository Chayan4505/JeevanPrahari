package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.Village;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {
    List<Village> findByDistrictId(String districtId);
    List<Village> findByRiskLevel(String riskLevel);
    
    @Query("SELECT v FROM Village v ORDER BY v.priorityScore DESC")
    List<Village> findTopPrioritizedVillages();

    @Query("SELECT v FROM Village v WHERE v.districtId = :districtId ORDER BY v.priorityScore DESC")
    List<Village> findPrioritizedByDistrict(@Param("districtId") String districtId);
}
