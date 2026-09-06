package com.pahaarsaathi.controller;

import com.pahaarsaathi.dto.RiskDTOs.HeatmapResponse;
import com.pahaarsaathi.service.MLClientService;
import com.pahaarsaathi.service.RiskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/risk")
@Tag(name = "Landslide Risk GIS", description = "Endpoints for risk heatmaps, calculations, and ML metrics")
public class RiskController {

    @Autowired
    private RiskService riskService;

    @Autowired
    private MLClientService mlClientService;

    @GetMapping("/heatmap")
    @Operation(summary = "Get spatial risk heatmap points for district or all NER")
    public ResponseEntity<HeatmapResponse> getHeatmap(@RequestParam(required = false, defaultValue = "ALL") String districtId) {
        HeatmapResponse response = riskService.getHeatmapForDistrict(districtId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recompute/{districtId}")
    @Operation(summary = "Recompute dynamic risk across grid cells for a district")
    public ResponseEntity<Map<String, String>> recomputeDistrictRisk(@PathVariable String districtId) {
        riskService.recomputeRiskForDistrict(districtId);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Risk recomputed for " + districtId));
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get ML model performance metrics evaluated on spatial holdout datasets")
    public ResponseEntity<Map<String, Object>> getModelMetrics() {
        Map<String, Object> metrics = mlClientService.getModelMetrics();
        return ResponseEntity.ok(metrics);
    }
}
