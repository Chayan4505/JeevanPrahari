package com.pahaarsaathi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_records")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String districtId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double currentRainfallMm = 0.0;

    @Column(nullable = false)
    private Double rainfall3dCumulativeMm = 0.0;

    @Column(nullable = false)
    private Double rainfall7dCumulativeMm = 0.0;

    @Column
    private Double rainfallRateChange = 0.0;

    @Column
    private Double temperatureC = 22.0;

    @Column
    private Double relativeHumidityPct = 85.0;

    @Column(nullable = false)
    private String dataSource = "OPEN_METEO"; // OPEN_METEO, IMD_API, NASA_POWER

    @Column(nullable = false)
    private LocalDateTime fetchedAt = LocalDateTime.now();

    public WeatherData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getCurrentRainfallMm() { return currentRainfallMm; }
    public void setCurrentRainfallMm(Double currentRainfallMm) { this.currentRainfallMm = currentRainfallMm; }

    public Double getRainfall3dCumulativeMm() { return rainfall3dCumulativeMm; }
    public void setRainfall3dCumulativeMm(Double rainfall3dCumulativeMm) { this.rainfall3dCumulativeMm = rainfall3dCumulativeMm; }

    public Double getRainfall7dCumulativeMm() { return rainfall7dCumulativeMm; }
    public void setRainfall7dCumulativeMm(Double rainfall7dCumulativeMm) { this.rainfall7dCumulativeMm = rainfall7dCumulativeMm; }

    public Double getRainfallRateChange() { return rainfallRateChange; }
    public void setRainfallRateChange(Double rainfallRateChange) { this.rainfallRateChange = rainfallRateChange; }

    public Double getTemperatureC() { return temperatureC; }
    public void setTemperatureC(Double temperatureC) { this.temperatureC = temperatureC; }

    public Double getRelativeHumidityPct() { return relativeHumidityPct; }
    public void setRelativeHumidityPct(Double relativeHumidityPct) { this.relativeHumidityPct = relativeHumidityPct; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public LocalDateTime getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(LocalDateTime fetchedAt) { this.fetchedAt = fetchedAt; }
}
