package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    Optional<WeatherData> findTopByDistrictIdOrderByFetchedAtDesc(String districtId);
    List<WeatherData> findByDistrictIdOrderByFetchedAtDesc(String districtId);
}
