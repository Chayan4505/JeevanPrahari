package com.pahaarsaathi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MLClientService {

    @Value("${pahaarsaathi.ml-service.base-url:http://localhost:8000}")
    private String mlServiceBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> predictStaticRisk(String cellId, Double lat, Double lon, Map<String, Object> features) {
        try {
            String url = mlServiceBaseUrl + "/predict/static-risk";
            Map<String, Object> request = new HashMap<>();
            request.put("cell_id", cellId);
            request.put("latitude", lat);
            request.put("longitude", lon);
            request.put("features", features);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }
        } catch (Exception e) {
            System.err.println("[PahaarSaathi MLClient] Error calling /predict/static-risk: " + e.getMessage());
        }

        // Fallback calculation if ML service is unreachable
        return fallbackStaticRisk(features);
    }

    public Map<String, Object> predictDynamicTrigger(String cellId, Double lat, Double lon, Double staticScore, String staticClass, Map<String, Object> rainfall) {
        try {
            String url = mlServiceBaseUrl + "/predict/dynamic-trigger";
            Map<String, Object> request = new HashMap<>();
            request.put("cell_id", cellId);
            request.put("latitude", lat);
            request.put("longitude", lon);
            request.put("static_score", staticScore);
            request.put("static_class", staticClass);
            request.put("rainfall", rainfall);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }
        } catch (Exception e) {
            System.err.println("[PahaarSaathi MLClient] Error calling /predict/dynamic-trigger: " + e.getMessage());
        }

        return fallbackDynamicTrigger(staticScore, rainfall);
    }

    public Map<String, Object> getModelMetrics() {
        try {
            String url = mlServiceBaseUrl + "/model/metrics";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }
        } catch (Exception e) {
            System.err.println("[PahaarSaathi MLClient] Error fetching /model/metrics: " + e.getMessage());
        }
        return Map.of("error", "ML service metrics unreachable");
    }

    private Map<String, Object> fallbackStaticRisk(Map<String, Object> f) {
        double slope = ((Number) f.getOrDefault("slope_angle_deg", 25.0)).doubleValue();
        double distRoad = ((Number) f.getOrDefault("dist_to_road_cut_m", 500.0)).doubleValue();
        
        double score = Math.min(1.0, Math.max(0.0, (slope / 60.0) * 0.7 + (distRoad < 100 ? 0.3 : 0.1)));
        String level = score > 0.75 ? "Very High" : (score > 0.55 ? "High" : (score > 0.30 ? "Moderate" : "Low"));

        Map<String, Object> res = new HashMap<>();
        res.put("static_score", score);
        res.put("static_class", level);
        res.put("model_version", "1.2.0-fallback-heuristic");
        return res;
    }

    private Map<String, Object> fallbackDynamicTrigger(Double staticScore, Map<String, Object> rain) {
        double rain1d = ((Number) rain.getOrDefault("rainfall_1d_mm", 0.0)).doubleValue();
        double rain3d = ((Number) rain.getOrDefault("rainfall_3d_mm", 0.0)).doubleValue();
        double saturation = (rain1d * 0.5) + (rain3d * 0.3);

        String triggerLevel = saturation > 100 ? "ALERT" : (saturation > 60 ? "WARNING" : (saturation > 30 ? "WATCH" : "NORMAL"));
        double multiplier = saturation > 100 ? 2.0 : (saturation > 60 ? 1.6 : (saturation > 30 ? 1.25 : 1.0));
        double composite = Math.min(1.0, (staticScore != null ? staticScore : 0.4) * (0.6 + 0.4 * multiplier));
        String compositeLevel = composite > 0.75 ? "VERY_HIGH" : (composite > 0.55 ? "HIGH" : (composite > 0.30 ? "MODERATE" : "LOW"));

        Map<String, Object> res = new HashMap<>();
        res.put("composite_risk_score", composite);
        res.put("composite_risk_level", compositeLevel);
        res.put("dynamic_trigger_level", triggerLevel);
        res.put("dynamic_multiplier", multiplier);
        res.put("antecedent_saturation_index", saturation);
        res.put("recommended_action", "Heightened vigilance for slope cut sectors.");
        res.put("model_version", "1.2.0-fallback-heuristic");
        return res;
    }
}
