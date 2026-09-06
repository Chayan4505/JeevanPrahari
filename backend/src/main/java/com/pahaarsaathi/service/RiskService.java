package com.pahaarsaathi.service;

import com.pahaarsaathi.dto.RiskDTOs.*;
import com.pahaarsaathi.model.*;
import com.pahaarsaathi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RiskService {

    @Autowired
    private RiskGridCellRepository riskGridCellRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private VillageRepository villageRepository;

    @Autowired
    private RoadSegmentRepository roadSegmentRepository;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private MLClientService mlClientService;

    public HeatmapResponse getHeatmapForDistrict(String districtId) {
        List<RiskGridCell> cells;
        if (districtId != null && !districtId.isEmpty() && !districtId.equalsIgnoreCase("ALL")) {
            cells = riskGridCellRepository.findByDistrictId(districtId);
        } else {
            cells = riskGridCellRepository.findAll();
        }

        int highCount = 0;
        int vhighCount = 0;
        List<RiskHeatmapPoint> points = new ArrayList<>();

        for (RiskGridCell cell : cells) {
            if ("HIGH".equalsIgnoreCase(cell.getCompositeRiskLevel())) highCount++;
            if ("VERY_HIGH".equalsIgnoreCase(cell.getCompositeRiskLevel())) vhighCount++;

            RiskHeatmapPoint p = new RiskHeatmapPoint();
            p.setCellId(cell.getId());
            p.setLatitude(cell.getLatitude());
            p.setLongitude(cell.getLongitude());
            p.setStaticScore(cell.getStaticScore());
            p.setStaticClass(cell.getStaticClass());
            p.setCompositeRiskScore(cell.getCompositeRiskScore());
            p.setCompositeRiskLevel(cell.getCompositeRiskLevel());
            p.setDynamicTriggerLevel(cell.getDynamicTriggerLevel());
            p.setRainfall1dMm(cell.getRainfall1dMm());
            p.setSlopeAngleDeg(cell.getSlopeAngleDeg());
            points.add(p);
        }

        return new HeatmapResponse(districtId, points.size(), highCount, vhighCount, points);
    }

    @Transactional
    public void recomputeRiskForDistrict(String districtId) {
        District district = districtRepository.findById(districtId).orElse(null);
        if (district == null) return;

        WeatherData weather = weatherService.getLatestWeatherForDistrict(districtId)
                .orElseGet(() -> weatherService.fetchLiveWeatherForDistrict(districtId));

        double rain1d = weather != null ? weather.getCurrentRainfallMm() : district.getCurrentRainfall24h();
        double rain3d = weather != null ? weather.getRainfall3dCumulativeMm() : district.getCumulativeRainfall3d();
        double rain7d = weather != null ? weather.getRainfall7dCumulativeMm() : district.getCumulativeRainfall7d();
        double rateChange = weather != null ? weather.getRainfallRateChange() : 1.0;

        List<RiskGridCell> cells = riskGridCellRepository.findByDistrictId(districtId);
        int highCount = 0;
        int vhighCount = 0;
        double maxScore = 0.0;
        String maxTrigger = "NORMAL";

        for (RiskGridCell cell : cells) {
            cell.setRainfall1dMm(rain1d);
            cell.setRainfall3dMm(rain3d);
            cell.setRainfall7dMm(rain7d);

            Map<String, Object> rainMap = new HashMap<>();
            rainMap.put("rainfall_1d_mm", rain1d);
            rainMap.put("rainfall_3d_mm", rain3d);
            rainMap.put("rainfall_7d_mm", rain7d);
            rainMap.put("rainfall_rate_change", rateChange);

            Map<String, Object> dynRes = mlClientService.predictDynamicTrigger(
                    cell.getId(), cell.getLatitude(), cell.getLongitude(),
                    cell.getStaticScore(), cell.getStaticClass(), rainMap
            );

            double compScore = ((Number) dynRes.getOrDefault("composite_risk_score", 0.3)).doubleValue();
            String compLevel = (String) dynRes.getOrDefault("composite_risk_level", "LOW");
            String dynTrigger = (String) dynRes.getOrDefault("dynamic_trigger_level", "NORMAL");

            cell.setCompositeRiskScore(compScore);
            cell.setCompositeRiskLevel(compLevel);
            cell.setDynamicTriggerLevel(dynTrigger);
            cell.setLastEvaluatedAt(LocalDateTime.now());

            if (compScore > maxScore) maxScore = compScore;
            if ("ALERT".equalsIgnoreCase(dynTrigger) || "WARNING".equalsIgnoreCase(dynTrigger)) {
                maxTrigger = dynTrigger;
            }
            if ("HIGH".equalsIgnoreCase(compLevel)) highCount++;
            if ("VERY_HIGH".equalsIgnoreCase(compLevel)) vhighCount++;
        }

        riskGridCellRepository.saveAll(cells);

        // Update District Aggregation
        district.setCurrentRiskLevel(maxScore > 0.75 ? "VERY_HIGH" : (maxScore > 0.55 ? "HIGH" : (maxScore > 0.30 ? "MODERATE" : "LOW")));
        district.setTriggerStatus(maxTrigger);
        districtRepository.save(district);

        // Recalculate Village Emergency Prioritization Scores
        // Prioritization = CompositeRisk * Population * (Vulnerability + RoadCriticalityProxy)
        List<Village> villages = villageRepository.findByDistrictId(districtId);
        for (Village v : villages) {
            double vRisk = calculateSpatialRiskForLocation(v.getLatitude(), v.getLongitude(), cells);
            v.setCompositeRiskScore(Math.round(vRisk * 100.0) / 100.0);
            v.setRiskLevel(vRisk > 0.75 ? "VERY_HIGH" : (vRisk > 0.55 ? "HIGH" : (vRisk > 0.30 ? "MODERATE" : "LOW")));
            
            // Priority formula: Risk * Population * VulnerabilityFactor
            double pScore = vRisk * v.getPopulation() * (v.getVulnerabilityIndex() != null ? v.getVulnerabilityIndex() : 1.0);
            v.setPriorityScore(Math.round(pScore * 10.0) / 10.0);
        }
        villageRepository.saveAll(villages);

        // Recheck Mountain Road Segments
        List<RoadSegment> roads = roadSegmentRepository.findByDistrictId(districtId);
        for (RoadSegment road : roads) {
            double midLat = (road.getStartLat() + road.getEndLat()) / 2.0;
            double midLon = (road.getStartLon() + road.getEndLon()) / 2.0;
            double roadRisk = calculateSpatialRiskForLocation(midLat, midLon, cells);
            road.setCurrentHazardScore(Math.round(roadRisk * 100.0) / 100.0);

            if (roadRisk > 0.82) {
                road.setStatus("CRITICAL");
                road.setBlockageCause("High probability of debris flow across cut-slopes.");
            } else if (roadRisk > 0.60) {
                road.setStatus("CAUTION");
                road.setBlockageCause("Heavy seepage and soil saturation along hillsides.");
            } else if (!"BLOCKED".equalsIgnoreCase(road.getStatus())) {
                road.setStatus("PASSABLE");
            }
        }
        roadSegmentRepository.saveAll(roads);
    }

    private double calculateSpatialRiskForLocation(Double lat, Double lon, List<RiskGridCell> cells) {
        if (cells.isEmpty()) return 0.35;
        // Nearest neighbor distance weighting
        RiskGridCell nearest = cells.get(0);
        double minDistance = Double.MAX_VALUE;

        for (RiskGridCell cell : cells) {
            double dLat = cell.getLatitude() - lat;
            double dLon = cell.getLongitude() - lon;
            double distSq = dLat * dLat + dLon * dLon;
            if (distSq < minDistance) {
                minDistance = distSq;
                nearest = cell;
            }
        }
        return nearest.getCompositeRiskScore() != null ? nearest.getCompositeRiskScore() : 0.35;
    }
}
