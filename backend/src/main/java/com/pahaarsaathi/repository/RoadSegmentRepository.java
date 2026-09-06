package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.RoadSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadSegmentRepository extends JpaRepository<RoadSegment, Long> {
    List<RoadSegment> findByDistrictId(String districtId);
    List<RoadSegment> findByStatus(String status);
    List<RoadSegment> findByStatusNot(String status);
}
