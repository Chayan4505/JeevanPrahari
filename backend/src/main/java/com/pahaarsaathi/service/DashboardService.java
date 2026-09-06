package com.pahaarsaathi.service;

import com.pahaarsaathi.dto.DashboardDTOs.*;
import com.pahaarsaathi.model.*;
import com.pahaarsaathi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private VillageRepository villageRepository;

    @Autowired
    private RoadSegmentRepository roadSegmentRepository;

    @Autowired
    private LandslideReportRepository landslideReportRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private WeatherService weatherService;

    public OverviewStatsResponse getOverviewStats(String districtId) {
        String targetDistrictId = (districtId != null && !districtId.isEmpty() && !districtId.equalsIgnoreCase("ALL"))
                ? districtId : "IN-ML-EKH";

        District district = districtRepository.findById(targetDistrictId)
                .orElseGet(() -> districtRepository.findAll().stream().findFirst().orElse(null));

        OverviewStatsResponse stats = new OverviewStatsResponse();

        if (district != null) {
            stats.setDistrictId(district.getId());
            stats.setDistrictName(district.getName());
            stats.setState(district.getState());
            stats.setCurrentRiskLevel(district.getCurrentRiskLevel());
            stats.setTriggerStatus(district.getTriggerStatus());
            stats.setRainfall24hMm(district.getCurrentRainfall24h());
            stats.setRainfall3dMm(district.getCumulativeRainfall3d());
            stats.setRainfall7dMm(district.getCumulativeRainfall7d());
            stats.setEmergencyHelpline(district.getEmergencyHelpline());
        }

        List<Village> villages = villageRepository.findByDistrictId(targetDistrictId);
        long highRiskVillages = villages.stream()
                .filter(v -> "HIGH".equalsIgnoreCase(v.getRiskLevel()) || "VERY_HIGH".equalsIgnoreCase(v.getRiskLevel()))
                .count();
        stats.setHighRiskVillagesCount((int) highRiskVillages);

        List<RoadSegment> roads = roadSegmentRepository.findByDistrictId(targetDistrictId);
        long blockedRoads = roads.stream()
                .filter(r -> "BLOCKED".equalsIgnoreCase(r.getStatus()) || "CRITICAL".equalsIgnoreCase(r.getStatus()))
                .count();
        stats.setBlockedRoadsCount((int) blockedRoads);

        List<LandslideReport> reports = landslideReportRepository.findByDistrictId(targetDistrictId);
        long pendingReports = reports.stream()
                .filter(r -> "PENDING_VERIFICATION".equalsIgnoreCase(r.getStatus()))
                .count();
        stats.setPendingIncidentReportsCount((int) pendingReports);

        List<Alert> alerts = alertRepository.findByDistrictIdOrderBySentAtDesc(targetDistrictId);
        stats.setActiveAlertsCount(alerts.size());

        stats.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + " IST");
        return stats;
    }

    public List<PriorityVillageItem> getPriorityVillages(String districtId) {
        List<Village> villages;
        if (districtId != null && !districtId.isEmpty() && !districtId.equalsIgnoreCase("ALL")) {
            villages = villageRepository.findPrioritizedByDistrict(districtId);
        } else {
            villages = villageRepository.findTopPrioritizedVillages();
        }

        return villages.stream().map(v -> {
            PriorityVillageItem item = new PriorityVillageItem();
            item.setId(v.getId());
            item.setName(v.getName());
            item.setDistrictId(v.getDistrictId());
            item.setLatitude(v.getLatitude());
            item.setLongitude(v.getLongitude());
            item.setPopulation(v.getPopulation());
            item.setCompositeRiskScore(v.getCompositeRiskScore());
            item.setRiskLevel(v.getRiskLevel());
            item.setPriorityScore(v.getPriorityScore());
            item.setNearestShelterName(v.getNearestShelterName());
            item.setNearestShelterDistKm(v.getNearestShelterDistKm());
            item.setEvacuationRoute(v.getEvacuationRoute());
            return item;
        }).collect(Collectors.toList());
    }

    public List<RoadConnectivitySummary> getRoadConnectivity(String districtId) {
        List<RoadSegment> roads;
        if (districtId != null && !districtId.isEmpty() && !districtId.equalsIgnoreCase("ALL")) {
            roads = roadSegmentRepository.findByDistrictId(districtId);
        } else {
            roads = roadSegmentRepository.findAll();
        }

        return roads.stream().map(r -> {
            RoadConnectivitySummary summary = new RoadConnectivitySummary();
            summary.setId(r.getId());
            summary.setRoadNumber(r.getRoadNumber());
            summary.setSegmentName(r.getSegmentName());
            summary.setDistrictId(r.getDistrictId());
            summary.setStatus(r.getStatus());
            summary.setCriticalityIndex(r.getCriticalityIndex());
            summary.setCurrentHazardScore(r.getCurrentHazardScore());
            summary.setBlockageCause(r.getBlockageCause());
            summary.setAlternateRouteAdvisory(r.getAlternateRouteAdvisory());
            return summary;
        }).collect(Collectors.toList());
    }
}
