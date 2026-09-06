package com.pahaarsaathi.controller;

import com.pahaarsaathi.dto.DashboardDTOs.*;
import com.pahaarsaathi.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "District Dashboard", description = "Aggregated decision support metrics for district disaster managers")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(summary = "Get aggregated district overview stats and trigger status")
    public ResponseEntity<OverviewStatsResponse> getOverviewStats(@RequestParam(required = false, defaultValue = "IN-ML-EKH") String districtId) {
        return ResponseEntity.ok(dashboardService.getOverviewStats(districtId));
    }

    @GetMapping("/priority-list")
    @Operation(summary = "Get emergency response prioritization list (Risk * Population * Road Criticality)")
    public ResponseEntity<List<PriorityVillageItem>> getPriorityVillages(@RequestParam(required = false) String districtId) {
        return ResponseEntity.ok(dashboardService.getPriorityVillages(districtId));
    }

    @GetMapping("/road-status")
    @Operation(summary = "Get road connectivity and arterial highway status")
    public ResponseEntity<List<RoadConnectivitySummary>> getRoadConnectivity(@RequestParam(required = false) String districtId) {
        return ResponseEntity.ok(dashboardService.getRoadConnectivity(districtId));
    }
}
