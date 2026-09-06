package com.pahaarsaathi.dto;

import java.util.List;
import java.util.Map;

public class DashboardDTOs {

    public static class OverviewStatsResponse {
        private String districtId;
        private String districtName;
        private String state;
        private String currentRiskLevel;
        private String triggerStatus;
        private Double rainfall24hMm;
        private Double rainfall3dMm;
        private Double rainfall7dMm;
        private int highRiskVillagesCount;
        private int blockedRoadsCount;
        private int pendingIncidentReportsCount;
        private int activeAlertsCount;
        private String emergencyHelpline;
        private String lastUpdated;

        public OverviewStatsResponse() {}

        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public String getDistrictName() { return districtName; }
        public void setDistrictName(String districtName) { this.districtName = districtName; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getCurrentRiskLevel() { return currentRiskLevel; }
        public void setCurrentRiskLevel(String currentRiskLevel) { this.currentRiskLevel = currentRiskLevel; }
        public String getTriggerStatus() { return triggerStatus; }
        public void setTriggerStatus(String triggerStatus) { this.triggerStatus = triggerStatus; }
        public Double getRainfall24hMm() { return rainfall24hMm; }
        public void setRainfall24hMm(Double rainfall24hMm) { this.rainfall24hMm = rainfall24hMm; }
        public Double getRainfall3dMm() { return rainfall3dMm; }
        public void setRainfall3dMm(Double rainfall3dMm) { this.rainfall3dMm = rainfall3dMm; }
        public Double getRainfall7dMm() { return rainfall7dMm; }
        public void setRainfall7dMm(Double rainfall7dMm) { this.rainfall7dMm = rainfall7dMm; }
        public int getHighRiskVillagesCount() { return highRiskVillagesCount; }
        public void setHighRiskVillagesCount(int highRiskVillagesCount) { this.highRiskVillagesCount = highRiskVillagesCount; }
        public int getBlockedRoadsCount() { return blockedRoadsCount; }
        public void setBlockedRoadsCount(int blockedRoadsCount) { this.blockedRoadsCount = blockedRoadsCount; }
        public int getPendingIncidentReportsCount() { return pendingIncidentReportsCount; }
        public void setPendingIncidentReportsCount(int pendingIncidentReportsCount) { this.pendingIncidentReportsCount = pendingIncidentReportsCount; }
        public int getActiveAlertsCount() { return activeAlertsCount; }
        public void setActiveAlertsCount(int activeAlertsCount) { this.activeAlertsCount = activeAlertsCount; }
        public String getEmergencyHelpline() { return emergencyHelpline; }
        public void setEmergencyHelpline(String emergencyHelpline) { this.emergencyHelpline = emergencyHelpline; }
        public String getLastUpdated() { return lastUpdated; }
        public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
    }

    public static class PriorityVillageItem {
        private Long id;
        private String name;
        private String districtId;
        private Double latitude;
        private Double longitude;
        private Integer population;
        private Double compositeRiskScore;
        private String riskLevel;
        private Double priorityScore; // Risk * Population * Criticality
        private String nearestShelterName;
        private Double nearestShelterDistKm;
        private String evacuationRoute;

        public PriorityVillageItem() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public Integer getPopulation() { return population; }
        public void setPopulation(Integer population) { this.population = population; }
        public Double getCompositeRiskScore() { return compositeRiskScore; }
        public void setCompositeRiskScore(Double compositeRiskScore) { this.compositeRiskScore = compositeRiskScore; }
        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
        public Double getPriorityScore() { return priorityScore; }
        public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }
        public String getNearestShelterName() { return nearestShelterName; }
        public void setNearestShelterName(String nearestShelterName) { this.nearestShelterName = nearestShelterName; }
        public Double getNearestShelterDistKm() { return nearestShelterDistKm; }
        public void setNearestShelterDistKm(Double nearestShelterDistKm) { this.nearestShelterDistKm = nearestShelterDistKm; }
        public String getEvacuationRoute() { return evacuationRoute; }
        public void setEvacuationRoute(String evacuationRoute) { this.evacuationRoute = evacuationRoute; }
    }

    public static class RoadConnectivitySummary {
        private Long id;
        private String roadNumber;
        private String segmentName;
        private String districtId;
        private String status; // PASSABLE, CAUTION, CRITICAL, BLOCKED
        private Integer criticalityIndex;
        private Double currentHazardScore;
        private String blockageCause;
        private String alternateRouteAdvisory;

        public RoadConnectivitySummary() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getRoadNumber() { return roadNumber; }
        public void setRoadNumber(String roadNumber) { this.roadNumber = roadNumber; }
        public String getSegmentName() { return segmentName; }
        public void setSegmentName(String segmentName) { this.segmentName = segmentName; }
        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Integer getCriticalityIndex() { return criticalityIndex; }
        public void setCriticalityIndex(Integer criticalityIndex) { this.criticalityIndex = criticalityIndex; }
        public Double getCurrentHazardScore() { return currentHazardScore; }
        public void setCurrentHazardScore(Double currentHazardScore) { this.currentHazardScore = currentHazardScore; }
        public String getBlockageCause() { return blockageCause; }
        public void setBlockageCause(String blockageCause) { this.blockageCause = blockageCause; }
        public String getAlternateRouteAdvisory() { return alternateRouteAdvisory; }
        public void setAlternateRouteAdvisory(String alternateRouteAdvisory) { this.alternateRouteAdvisory = alternateRouteAdvisory; }
    }
}
