package com.pahaarsaathi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "villages")
public class Village {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String districtId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column
    private Integer population = 500;

    @Column
    private Double vulnerabilityIndex = 0.5; // 0.0 - 1.0 based on slope, housing type

    @Column
    private String nearestShelterName;

    @Column
    private Double nearestShelterDistKm;

    @Column
    private String evacuationRoute;

    @Column
    private Double compositeRiskScore = 0.2;

    @Column
    private String riskLevel = "LOW";

    @Column
    private Double priorityScore = 100.0; // Risk * Population * Criticality

    public Village() {}

    public Village(String name, String districtId, Double latitude, Double longitude, Integer population, Double vulnerabilityIndex, String nearestShelterName, Double nearestShelterDistKm) {
        this.name = name;
        this.districtId = districtId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.population = population;
        this.vulnerabilityIndex = vulnerabilityIndex;
        this.nearestShelterName = nearestShelterName;
        this.nearestShelterDistKm = nearestShelterDistKm;
    }

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

    public Double getVulnerabilityIndex() { return vulnerabilityIndex; }
    public void setVulnerabilityIndex(Double vulnerabilityIndex) { this.vulnerabilityIndex = vulnerabilityIndex; }

    public String getNearestShelterName() { return nearestShelterName; }
    public void setNearestShelterName(String nearestShelterName) { this.nearestShelterName = nearestShelterName; }

    public Double getNearestShelterDistKm() { return nearestShelterDistKm; }
    public void setNearestShelterDistKm(Double nearestShelterDistKm) { this.nearestShelterDistKm = nearestShelterDistKm; }

    public String getEvacuationRoute() { return evacuationRoute; }
    public void setEvacuationRoute(String evacuationRoute) { this.evacuationRoute = evacuationRoute; }

    public Double getCompositeRiskScore() { return compositeRiskScore; }
    public void setCompositeRiskScore(Double compositeRiskScore) { this.compositeRiskScore = compositeRiskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }
}
