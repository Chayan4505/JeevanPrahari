package com.pahaarsaathi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "districts")
public class District {

    @Id
    private String id; // e.g. "IN-ML-EKH" (East Khasi Hills), "IN-AS-DH" (Dima Hasao)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String state; // Meghalaya, Assam, Sikkim, Mizoram, Nagaland, Arunachal Pradesh, Manipur, Tripura

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column
    private Integer population;

    @Column
    private Double areaSqKm;

    @Column
    private String emergencyHelpline; // e.g. "1077 / 0364-2222277"

    @Column
    private String dmaControlRoomContact;

    @Column
    private Double currentRainfall24h = 0.0;

    @Column
    private Double cumulativeRainfall3d = 0.0;

    @Column
    private Double cumulativeRainfall7d = 0.0;

    @Column
    private String currentRiskLevel = "LOW"; // LOW, MODERATE, HIGH, VERY_HIGH

    @Column
    private String triggerStatus = "NORMAL"; // NORMAL, WATCH, WARNING, ALERT

    public District() {}

    public District(String id, String name, String state, Double latitude, Double longitude, Integer population, Double areaSqKm, String emergencyHelpline) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.population = population;
        this.areaSqKm = areaSqKm;
        this.emergencyHelpline = emergencyHelpline;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getPopulation() { return population; }
    public void setPopulation(Integer population) { this.population = population; }

    public Double getAreaSqKm() { return areaSqKm; }
    public void setAreaSqKm(Double areaSqKm) { this.areaSqKm = areaSqKm; }

    public String getEmergencyHelpline() { return emergencyHelpline; }
    public void setEmergencyHelpline(String emergencyHelpline) { this.emergencyHelpline = emergencyHelpline; }

    public String getDmaControlRoomContact() { return dmaControlRoomContact; }
    public void setDmaControlRoomContact(String dmaControlRoomContact) { this.dmaControlRoomContact = dmaControlRoomContact; }

    public Double getCurrentRainfall24h() { return currentRainfall24h; }
    public void setCurrentRainfall24h(Double currentRainfall24h) { this.currentRainfall24h = currentRainfall24h; }

    public Double getCumulativeRainfall3d() { return cumulativeRainfall3d; }
    public void setCumulativeRainfall3d(Double cumulativeRainfall3d) { this.cumulativeRainfall3d = cumulativeRainfall3d; }

    public Double getCumulativeRainfall7d() { return cumulativeRainfall7d; }
    public void setCumulativeRainfall7d(Double cumulativeRainfall7d) { this.cumulativeRainfall7d = cumulativeRainfall7d; }

    public String getCurrentRiskLevel() { return currentRiskLevel; }
    public void setCurrentRiskLevel(String currentRiskLevel) { this.currentRiskLevel = currentRiskLevel; }

    public String getTriggerStatus() { return triggerStatus; }
    public void setTriggerStatus(String triggerStatus) { this.triggerStatus = triggerStatus; }
}
