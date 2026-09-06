package com.pahaarsaathi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pahaarsaathi.model.District;
import com.pahaarsaathi.model.WeatherData;
import com.pahaarsaathi.repository.DistrictRepository;
import com.pahaarsaathi.repository.WeatherDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WeatherService {

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    @Autowired
    private DistrictRepository districtRepository;

    // @Autowired(required = false)
    // private RiskService riskService;

    @Value("${pahaarsaathi.external-apis.open-meteo.base-url:https://api.open-meteo.com/v1}")
    private String openMeteoBaseUrl;

    @Value("${pahaarsaathi.external-apis.imd.enabled:false}")
    private boolean imdEnabled;

    @Value("${pahaarsaathi.external-apis.imd.base-url:https://api.imd.gov.in}")
    private String imdBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Primary live weather fetcher.
     * Uses Open-Meteo API as working default fallback.
     * Uses IMD API when enabled and whitelisted.
     */
    public WeatherData fetchLiveWeatherForDistrict(String districtId) {
        District district = districtRepository.findById(districtId).orElse(null);
        if (district == null) {
            return null;
        }

        if (imdEnabled) {
            // TODO: needs IMD IP whitelisting approval from user. Swappable adapter path:
            WeatherData imdData = fetchFromIMDAdapter(district);
            if (imdData != null) {
                return imdData;
            }
        }

        return fetchFromOpenMeteo(district);
    }

    private WeatherData fetchFromOpenMeteo(District district) {
        try {
            // Fetch past 7 days + current daily and hourly precipitation
            String url = String.format(
                    "%s/forecast?latitude=%.4f&longitude=%.4f&daily=precipitation_sum&current=temperature_2m,relative_humidity_2m,precipitation&past_days=7&timezone=Asia/Kolkata",
                    openMeteoBaseUrl, district.getLatitude(), district.getLongitude());

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());

                double currentRainfall = 0.0;
                double tempC = 22.0;
                double humidity = 85.0;

                if (root.has("current")) {
                    JsonNode current = root.get("current");
                    currentRainfall = current.has("precipitation") ? current.get("precipitation").asDouble() * 24.0
                            : 5.0;
                    tempC = current.has("temperature_2m") ? current.get("temperature_2m").asDouble() : 22.0;
                    humidity = current.has("relative_humidity_2m") ? current.get("relative_humidity_2m").asDouble()
                            : 85.0;
                }

                double rain3d = currentRainfall;
                double rain7d = currentRainfall;
                double rateChange = 1.5;

                if (root.has("daily") && root.get("daily").has("precipitation_sum")) {
                    JsonNode dailyPrecip = root.get("daily").get("precipitation_sum");
                    int size = dailyPrecip.size();
                    if (size >= 3) {
                        rain3d = 0.0;
                        for (int i = Math.max(0, size - 3); i < size; i++) {
                            rain3d += dailyPrecip.get(i).asDouble();
                        }
                    }
                    if (size >= 7) {
                        rain7d = 0.0;
                        for (int i = Math.max(0, size - 7); i < size; i++) {
                            rain7d += dailyPrecip.get(i).asDouble();
                        }
                    }
                }

                WeatherData data = new WeatherData();
                data.setDistrictId(district.getId());
                data.setLatitude(district.getLatitude());
                data.setLongitude(district.getLongitude());
                data.setCurrentRainfallMm(Math.round(currentRainfall * 10.0) / 10.0);
                data.setRainfall3dCumulativeMm(Math.round(rain3d * 10.0) / 10.0);
                data.setRainfall7dCumulativeMm(Math.round(rain7d * 10.0) / 10.0);
                data.setRainfallRateChange(rateChange);
                data.setTemperatureC(tempC);
                data.setRelativeHumidityPct(humidity);
                data.setDataSource("OPEN_METEO");
                data.setFetchedAt(LocalDateTime.now());

                WeatherData saved = weatherDataRepository.save(data);

                // Update district summary cache
                district.setCurrentRainfall24h(saved.getCurrentRainfallMm());
                district.setCumulativeRainfall3d(saved.getRainfall3dCumulativeMm());
                district.setCumulativeRainfall7d(saved.getRainfall7dCumulativeMm());
                districtRepository.save(district);

                return saved;
            }
        } catch (Exception e) {
            System.err.println("[PahaarSaathi Weather] Error fetching from Open-Meteo for " + district.getName() + ": "
                    + e.getMessage());
        }

        // Return latest recorded data if live network fetch encounters an issue
        return weatherDataRepository.findTopByDistrictIdOrderByFetchedAtDesc(district.getId())
                .orElseGet(() -> createSyntheticFallback(district));
    }

    private WeatherData fetchFromIMDAdapter(District district) {
        // TODO: needs IMD IP whitelisting approval from user before live activation
        System.out.println(
                "[PahaarSaathi IMD Adapter] IMD adapter inactive pending IP whitelist. Falling back to Open-Meteo.");
        return null;
    }

    private WeatherData createSyntheticFallback(District district) {
        WeatherData fallback = new WeatherData();
        fallback.setDistrictId(district.getId());
        fallback.setLatitude(district.getLatitude());
        fallback.setLongitude(district.getLongitude());
        fallback.setCurrentRainfallMm(35.0);
        fallback.setRainfall3dCumulativeMm(110.0);
        fallback.setRainfall7dCumulativeMm(240.0);
        fallback.setRainfallRateChange(2.5);
        fallback.setTemperatureC(21.5);
        fallback.setRelativeHumidityPct(88.0);
        fallback.setDataSource("DEMO_FALLBACK");
        fallback.setFetchedAt(LocalDateTime.now());
        return weatherDataRepository.save(fallback);
    }

    public Optional<WeatherData> getLatestWeatherForDistrict(String districtId) {
        return weatherDataRepository.findTopByDistrictIdOrderByFetchedAtDesc(districtId);
    }

    /**
     * Periodic telemetry update every 30 minutes.
     */
    @Scheduled(fixedRate = 1800000, initialDelay = 10000)
    public void scheduleWeatherTelemetryPoll() {
        System.out.println(
                "[PahaarSaathi Weather] Triggering scheduled rainfall telemetry update across NER districts...");
        List<District> districts = districtRepository.findAll();
        for (District d : districts) {
            try {
                fetchLiveWeatherForDistrict(d.getId());
            } catch (Exception ignored) {
            }
        }
    }
}
