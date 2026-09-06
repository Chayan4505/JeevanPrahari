package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.LandslideReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandslideReportRepository extends JpaRepository<LandslideReport, Long> {
    List<LandslideReport> findByDistrictId(String districtId);
    List<LandslideReport> findByStatus(String status);
    List<LandslideReport> findAllByOrderByTimestampDesc();
    Optional<LandslideReport> findByOfflineSyncId(String offlineSyncId);
}
