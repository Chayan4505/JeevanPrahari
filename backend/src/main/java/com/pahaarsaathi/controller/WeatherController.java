package com.pahaarsaathi.controller;

import com.pahaarsaathi.model.District;
import com.pahaarsaathi.model.WeatherData;
import com.pahaarsaathi.repository.DistrictRepository;
import com.pahaarsaathi.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@Tag(name = "Weather & Rainfall Telemetry", description = "Rainfall telemetry from Open-Meteo with swappable IMD adapter")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private DistrictRepository districtRepository;

    @GetMapping("/current/{districtId}")
    @Operation(summary = "Get live rainfall and telemetry for a specific district")
    public ResponseEntity<WeatherData> getLiveWeather(@PathVariable String districtId) {
        WeatherData data = weatherService.fetchLiveWeatherForDistrict(districtId);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/districts")
    @Operation(summary = "Get all registered NER districts with summary telemetry")
    public ResponseEntity<List<District>> getAllDistricts() {
        return ResponseEntity.ok(districtRepository.findAll());
    }
}
