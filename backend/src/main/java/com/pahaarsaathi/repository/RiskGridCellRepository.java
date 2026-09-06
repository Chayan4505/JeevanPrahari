package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.RiskGridCell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskGridCellRepository extends JpaRepository<RiskGridCell, String> {
    List<RiskGridCell> findByDistrictId(String districtId);
    List<RiskGridCell> findByCompositeRiskLevel(String compositeRiskLevel);
    List<RiskGridCell> findByDistrictIdAndCompositeRiskLevel(String districtId, String compositeRiskLevel);
}
