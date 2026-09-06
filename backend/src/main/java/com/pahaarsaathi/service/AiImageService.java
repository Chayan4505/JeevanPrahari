package com.pahaarsaathi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiImageService {

    @Value("${stability.api.key:}")
    private String stabilityApiKey;

    @Value("${stability.api.url:https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image}")
    private String stabilityApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generate a realistic image from a disaster/landslide description
     * Uses Stable Diffusion API to create photorealistic images
     */
    public String generateDisasterImage(String description, String location, String landslideType) {
        // If API key is not configured, return null (use fallback)
        if (stabilityApiKey == null || stabilityApiKey.isEmpty()) {
            return null;
        }

        try {
            // Build detailed prompt from components
            String prompt = buildPrompt(description, location, landslideType);

            // Call Stable Diffusion API
            String imageUrl = callStabilityApi(prompt);
            
            return imageUrl;
        } catch (Exception e) {
            System.err.println("Error generating AI image: " + e.getMessage());
            return null; // Return null to use fallback Unsplash images
        }
    }

    /**
     * Build a detailed prompt for the AI model
     */
    private String buildPrompt(String description, String location, String landslideType) {
        String typeDescription = getTypeDescription(landslideType);
        
        return String.format(
            "Realistic documentary photograph of a %s in %s. %s. "
            + "The image shows the actual incident location with visible damage, debris, and geological impact. "
            + "Professional disaster documentation photo, daylight, 4K quality, photorealistic, news-worthy image.",
            typeDescription,
            location,
            description
        );
    }

    /**
     * Get descriptive text for landslide type
     */
    private String getTypeDescription(String landslideType) {
        return switch (landslideType) {
            case "SOIL_SLIDE" -> "soil slide and slope failure";
            case "ROCK_FALL" -> "rockfall and boulder impact";
            case "DEBRIS_FLOW" -> "debris flow and mudslide";
            case "EARTH_FLOW" -> "earth flow and surface erosion";
            case "MUDFLOW" -> "mudflow and earth movement";
            case "SLUMP" -> "slump failure and ground subsidence";
            default -> "landslide and geological disaster";
        };
    }

    /**
     * Call Stability AI API to generate image
     */
    private String callStabilityApi(String prompt) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("text_prompts", new Map[]{
            Map.of(
                "text", prompt,
                "weight", 1.0
            )
        });
        requestBody.put("cfg_scale", 7);
        requestBody.put("height", 512);
        requestBody.put("width", 512);
        requestBody.put("samples", 1);
        requestBody.put("steps", 30);

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + stabilityApiKey);
        headers.set("Accept", "application/json");

        String requestJson = objectMapper.writeValueAsString(requestBody);
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        try {
            // Call API
            String response = restTemplate.postForObject(stabilityApiUrl, entity, String.class);
            
            // Parse response
            JsonNode root = objectMapper.readTree(response);
            if (root.has("artifacts") && root.get("artifacts").isArray() && root.get("artifacts").size() > 0) {
                String base64Image = root.get("artifacts").get(0).get("base64").asText();
                
                // Convert base64 to data URL
                return "data:image/png;base64," + base64Image;
            }
        } catch (Exception e) {
            System.err.println("Stability API call failed: " + e.getMessage());
        }

        return null;
    }
}
