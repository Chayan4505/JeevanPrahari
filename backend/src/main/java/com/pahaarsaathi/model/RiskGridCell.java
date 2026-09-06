package com.pahaarsaathi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_grid_cells")
public class RiskGridCell {

    @Id
    private String id; // cell-ekh-001

    @Column(nullable = false)
    private String districtId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double slopeAngleDeg;

    @Column
    private Double slopeAspectDeg;

    @Column
    private Double elevationM;

    @Column
    private Double distToRoadCutM;

    @Column
    private Integer landCoverCode; // 1 to 5

    @Column
    private Integer lithologyClass; // 1 to 4

    @Column
    private Double staticScore; // 0.0 - 1.0

    @Column
    private String staticClass; // Low, Moderate, High, Very High

    @Column
    private Double compositeRiskScore;

    @Column
    private String compositeRiskLevel; // LOW, MODERATE, HIGH, VERY_HIGH

    @Column
    private String dynamicTriggerLevel; // NORMAL, WATCH, WARNING, ALERT

    @Column
    private Double rainfall1dMm = 0.0;

    @Column
    private Double rainfall3dMm = 0.0;

    @Column
    private Double rainfall7dMm = 0.0;

    @Column
    private LocalDateTime lastEvaluatedAt = LocalDateTime.now();

    public RiskGridCell() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getSlopeAngleDeg() { return slopeAngleDeg; }
    public void setSlopeAngleDeg(Double slopeAngleDeg) { this.slopeAngleDeg = slopeAngleDeg; }

    public Double getSlopeAspectDeg() { return slopeAspectDeg; }
    public void setSlopeAspectDeg(Double slopeAspectDeg) { this.slopeAspectDeg = slopeAspectDeg; }

    public Double getElevationM() { return elevationM; }
    public void setElevationM(Double elevationM) { this.elevationM = elevationM; }

    public Double getDistToRoadCutM() { return distToRoadCutM; }
    public void setDistToRoadCutM(Double distToRoadCutM) { this.distToRoadCutM = distToRoadCutM; }

    public Integer getLandCoverCode() { return landCoverCode; }
    public void setLandCoverCode(Integer landCoverCode) { this.landCoverCode = landCoverCode; }

    public Integer getLithologyClass() { return lithologyClass; }
    public void setLithologyClass(Integer lithologyClass) { this.lithologyClass = lithologyClass; }

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

    public Double getRainfall3dMm() { return rainfall3dMm; }
    public void setRainfall3dMm(Double rainfall3dMm) { this.rainfall3dMm = rainfall3dMm; }

    public Double getRainfall7dMm() { return rainfall7dMm; }
    public void setRainfall7dMm(Double rainfall7dMm) { this.rainfall7dMm = rainfall7dMm; }

    public LocalDateTime getLastEvaluatedAt() { return lastEvaluatedAt; }
    public void setLastEvaluatedAt(LocalDateTime lastEvaluatedAt) { this.lastEvaluatedAt = lastEvaluatedAt; }
}
