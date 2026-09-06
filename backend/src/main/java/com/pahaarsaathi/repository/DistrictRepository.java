package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, String> {
    List<District> findByState(String state);
    List<District> findByCurrentRiskLevel(String riskLevel);
}
