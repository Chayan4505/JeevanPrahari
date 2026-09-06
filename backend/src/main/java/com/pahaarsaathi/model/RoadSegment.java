package com.pahaarsaathi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "road_segments")
public class RoadSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roadNumber; // e.g. "NH-06", "NH-27", "SH-01"

    @Column(nullable = false)
    private String segmentName; // e.g. "Jowai-Ratacherra Cut", "Haflong-Lumding Hill Section"

    @Column(nullable = false)
    private String districtId;

    @Column(nullable = false)
    private Double startLat;

    @Column(nullable = false)
    private Double startLon;

    @Column(nullable = false)
    private Double endLat;

    @Column(nullable = false)
    private Double endLon;

    @Column(nullable = false)
    private Double lengthKm;

    @Column(nullable = false)
    private Integer criticalityIndex = 5; // 1 (low) to 10 (lifeline arterial highway)

    @Column(nullable = false)
    private String status = "PASSABLE"; // PASSABLE, CAUTION, CRITICAL, BLOCKED

    @Column
    private String blockageCause; // "Debris flow at km 42", "Tension cracks across 2 lanes"

    @Column
    private String alternateRouteAdvisory;

    @Column
    private Double currentHazardScore = 0.2;

    public RoadSegment() {}

    public RoadSegment(String roadNumber, String segmentName, String districtId, Double startLat, Double startLon, Double endLat, Double endLon, Double lengthKm, Integer criticalityIndex, String status) {
        this.roadNumber = roadNumber;
        this.segmentName = segmentName;
        this.districtId = districtId;
        this.startLat = startLat;
        this.startLon = startLon;
        this.endLat = endLat;
        this.endLon = endLon;
        this.lengthKm = lengthKm;
        this.criticalityIndex = criticalityIndex;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoadNumber() { return roadNumber; }
    public void setRoadNumber(String roadNumber) { this.roadNumber = roadNumber; }

    public String getSegmentName() { return segmentName; }
    public void setSegmentName(String segmentName) { this.segmentName = segmentName; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public Double getStartLat() { return startLat; }
    public void setStartLat(Double startLat) { this.startLat = startLat; }

    public Double getStartLon() { return startLon; }
    public void setStartLon(Double startLon) { this.startLon = startLon; }

    public Double getEndLat() { return endLat; }
    public void setEndLat(Double endLat) { this.endLat = endLat; }

    public Double getEndLon() { return endLon; }
    public void setEndLon(Double endLon) { this.endLon = endLon; }

    public Double getLengthKm() { return lengthKm; }
    public void setLengthKm(Double lengthKm) { this.lengthKm = lengthKm; }

    public Integer getCriticalityIndex() { return criticalityIndex; }
    public void setCriticalityIndex(Integer criticalityIndex) { this.criticalityIndex = criticalityIndex; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBlockageCause() { return blockageCause; }
    public void setBlockageCause(String blockageCause) { this.blockageCause = blockageCause; }

    public String getAlternateRouteAdvisory() { return alternateRouteAdvisory; }
    public void setAlternateRouteAdvisory(String alternateRouteAdvisory) { this.alternateRouteAdvisory = alternateRouteAdvisory; }

    public Double getCurrentHazardScore() { return currentHazardScore; }
    public void setCurrentHazardScore(Double currentHazardScore) { this.currentHazardScore = currentHazardScore; }
}
