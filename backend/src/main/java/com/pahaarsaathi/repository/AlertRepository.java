package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByDistrictIdOrderBySentAtDesc(String districtId);
    List<Alert> findAllByOrderBySentAtDesc();
    List<Alert> findBySeverityInOrderBySentAtDesc(List<String> severities);
    Optional<Alert> findByIdentifier(String identifier);
}
