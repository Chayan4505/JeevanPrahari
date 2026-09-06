package com.pahaarsaathi.dto;

import java.util.List;
import java.util.Map;

public class RiskDTOs {

    public static class RiskHeatmapPoint {
        private String cellId;
        private Double latitude;
        private Double longitude;
        private Double staticScore;
        private String staticClass;
        private Double compositeRiskScore;
        private String compositeRiskLevel;
        private String dynamicTriggerLevel;
        private Double rainfall1dMm;
        private Double slopeAngleDeg;

        public RiskHeatmapPoint() {}

        public String getCellId() { return cellId; }
        public void setCellId(String cellId) { this.cellId = cellId; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public Double getStaticScore() { return staticScore; }
        public void setStaticScore(Double staticScore) { this.staticScore = staticScore; }
        public String getStaticClass() { return staticClass; }
        public void setStaticClass(String staticClass) { this.staticClass = staticClass; }
        public Double getCompositeRiskScore() { return compositeRiskScore; }
        public void setCompositeRiskScore(Double compositeRiskScore) { this.compositeRiskScore = compositeRiskScore; }
        public String getCompositeRiskLevel() { return compositeRiskLevel; }
        public void setCompositeRiskLevel(String compositeRiskLevel) { this.compositeRiskLevel = compositeRiskLevel; }
        public String getDynamicTriggerLevel() { return dynamicTriggerLevel; }
        public void setDynamicTriggerLevel(String dynamicTriggerLevel) { this.dynamicTriggerLevel = dynamicTriggerLevel; }
        public Double getRainfall1dMm() { return rainfall1dMm; }
        public void setRainfall1dMm(Double rainfall1dMm) { this.rainfall1dMm = rainfall1dMm; }
        public Double getSlopeAngleDeg() { return slopeAngleDeg; }
        public void setSlopeAngleDeg(Double slopeAngleDeg) { this.slopeAngleDeg = slopeAngleDeg; }
    }

    public static class HeatmapResponse {
        private String districtId;
        private int totalPoints;
        private int highRiskPoints;
        private int veryHighRiskPoints;
        private List<RiskHeatmapPoint> points;

        public HeatmapResponse() {}
        public HeatmapResponse(String districtId, int totalPoints, int highRiskPoints, int veryHighRiskPoints, List<RiskHeatmapPoint> points) {
            this.districtId = districtId;
            this.totalPoints = totalPoints;
            this.highRiskPoints = highRiskPoints;
            this.veryHighRiskPoints = veryHighRiskPoints;
            this.points = points;
        }

        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public int getTotalPoints() { return totalPoints; }
        public void setTotalPoints(int totalPoints) { this.totalPoints = totalPoints; }
        public int getHighRiskPoints() { return highRiskPoints; }
        public void setHighRiskPoints(int highRiskPoints) { this.highRiskPoints = highRiskPoints; }
        public int getVeryHighRiskPoints() { return veryHighRiskPoints; }
        public void setVeryHighRiskPoints(int veryHighRiskPoints) { this.veryHighRiskPoints = veryHighRiskPoints; }
        public List<RiskHeatmapPoint> getPoints() { return points; }
        public void setPoints(List<RiskHeatmapPoint> points) { this.points = points; }
    }

    public static class MLStaticPredictRequest {
        private String cell_id;
        private Double latitude;
        private Double longitude;
        private Map<String, Object> features;

        public MLStaticPredictRequest() {}
        public MLStaticPredictRequest(String cell_id, Double latitude, Double longitude, Map<String, Object> features) {
            this.cell_id = cell_id;
            this.latitude = latitude;
            this.longitude = longitude;
            this.features = features;
        }

        public String getCell_id() { return cell_id; }
        public void setCell_id(String cell_id) { this.cell_id = cell_id; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public Map<String, Object> getFeatures() { return features; }
        public void setFeatures(Map<String, Object> features) { this.features = features; }
    }
}
