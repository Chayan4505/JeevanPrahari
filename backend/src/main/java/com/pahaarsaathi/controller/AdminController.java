package com.pahaarsaathi.controller;

import com.pahaarsaathi.model.AuditLog;
import com.pahaarsaathi.model.District;
import com.pahaarsaathi.model.LandslideReport;
import com.pahaarsaathi.repository.DistrictRepository;
import com.pahaarsaathi.repository.LandslideReportRepository;
import com.pahaarsaathi.service.AuditService;
import com.pahaarsaathi.service.AiImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.security.PermitAll;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administration & Audit", description = "Audit trail and district administrative management")
public class AdminController {

    @Autowired
    private AuditService auditService;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private LandslideReportRepository landslideReportRepository;

    @Autowired
    private AiImageService aiImageService;

    @GetMapping("/audit-logs")
    @PreAuthorize("hasAnyRole('DISTRICT_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get audit logs of all alert dispatches, verifications, and system events")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getRecentLogs());
    }

    @GetMapping("/districts")
    @PreAuthorize("hasAnyRole('DISTRICT_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get district management registry")
    public ResponseEntity<List<District>> getDistricts() {
        return ResponseEntity.ok(districtRepository.findAll());
    }

    @PostMapping("/seed-reports")
    @PermitAll
    @Operation(summary = "Generate sample landslide reports for demo and testing (PUBLIC - DEMO ONLY)")
    public ResponseEntity<Map<String, Object>> seedSampleReports() {
        List<LandslideReport> generatedReports = new ArrayList<>();
        Random rand = new Random();

        // Sample data
        String[] locations = {
            "NH-6 Km 45 near Cherrapunji, Meghalaya",
            "State Road 1 Dima Hasao, Assam",
            "Village Road Gangtok, Sikkim",
            "NH-27 Aizawl Junction, Mizoram",
            "Mountain Pass Kohima, Nagaland",
            "Road Cut Shillong, Meghalaya",
            "Hill Slope Lumding, Assam",
            "Arterial Road Imphal, Manipur",
            "Highway Cut Agartala, Tripura",
            "Village Track Arunachal Pradesh",
            "Steep Bank Jowai, Meghalaya",
            "Monsoon Zone Silchar, Assam",
            "Tension Zone Gangtok, Sikkim",
            "Rock Fall Zone Aizawl, Mizoram",
            "Debris Area Dimapur, Nagaland"
        };

        String[] districts = {
            "IN-ML-EKH", "IN-AS-DH", "IN-SK-GT", "IN-MZ-AZ", "IN-NL-KM",
            "IN-ML-EWK", "IN-AS-NC", "IN-MN-IMP", "IN-TR-AG", "IN-AR-PP"
        };

        String[] landslideTypes = {
            "SOIL_SLIDE", "ROCK_FALL", "DEBRIS_FLOW", "EARTH_FLOW", "MUDFLOW", "SLUMP"
        };

        String[] severities = {
            "CATASTROPHIC", "SEVERE", "SEVERE", "MODERATE", "MODERATE", "MODERATE", "MINOR", "MINOR"
        };

        String[] reporters = {
            "Raj Kumar Singh", "Priya Sharma", "Amit Patel", "Maria Das", "Rohan Gupta",
            "Neha Singh", "Vikram Reddy", "Aisha Khan", "Sanjay Verma", "Divya Nair"
        };

        String[] descriptions = {
            "Significant soil movement observed on steep slope, trees tilted",
            "Multiple tension cracks detected on roadside embankment",
            "Fresh debris scattered across road after heavy rainfall",
            "Water seepage observed, slope unstable after 72h rain",
            "Minor rock fragments falling, slope gradually degrading",
            "Vegetation uprooted, surface cracks visible on hillside",
            "Small soil displacement, limited impact on road",
            "Loose material on slope, recommend monitoring",
            "Signs of previous activity, current conditions stable",
            "Minor surface erosion, no immediate threat",
            "Significant water flow making slope slippery",
            "Deep cracks with 10cm displacement observed",
            "Debris blocking 50% of road width",
            "Active slope failure with ongoing movement",
            "Critical instability, immediate evacuation recommended"
        };

        String[] mediaUrls = {
            // Real Unsplash URLs for landslide/disaster images
            "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400&q=80", // Mountain landslide
            "https://images.unsplash.com/photo-1574263867373-992043d548de?w=400&q=80", // Rocky mountain
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Mountain terrain
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Steep terrain
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Mountain slope
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80", // Mountain disaster
            "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400&q=80", // Landslide
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Rocky area
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Terrain
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80", // Mountain
            "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400&q=80", // Rock fall
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Mountain
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", // Slope
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80", // Terrain
            "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400&q=80"  // Disaster
        };

        // Generate 15 sample reports
        for (int i = 0; i < 15; i++) {
            LandslideReport report = new LandslideReport();

            // Random basic info
            report.setLocationDescription(locations[rand.nextInt(locations.length)]);
            String districtId = districts[rand.nextInt(districts.length)];
            report.setDistrictId(districtId);
            String landslideType = landslideTypes[rand.nextInt(landslideTypes.length)];
            report.setLandslideType(landslideType);
            report.setSeverity(severities[rand.nextInt(severities.length)]);
            String description = descriptions[rand.nextInt(descriptions.length)];
            report.setDescription(description);

            // Generate AI image or use fallback
            String mediaUrl = null;
            try {
                // Try to generate AI image from description
                String aiImage = aiImageService.generateDisasterImage(
                    description,
                    report.getLocationDescription(),
                    landslideType
                );
                if (aiImage != null) {
                    mediaUrl = aiImage;
                    System.out.println("✅ Generated AI image for report: " + report.getLocationDescription());
                }
            } catch (Exception e) {
                System.err.println("⚠️ AI image generation failed, using fallback: " + e.getMessage());
            }

            // Fallback to Unsplash if AI generation failed or disabled
            if (mediaUrl == null) {
                mediaUrl = mediaUrls[rand.nextInt(mediaUrls.length)];
            }
            
            report.setMediaUrl(mediaUrl);

            // Random coordinates within NER region
            report.setLatitude(25.0 + (rand.nextDouble() * 5)); // Lat between 25-30
            report.setLongitude(88.0 + (rand.nextDouble() * 5)); // Long between 88-93

            // Reporter info
            report.setReporterName(reporters[rand.nextInt(reporters.length)]);
            report.setReporterRole(rand.nextBoolean() ? "FIELD_OFFICER" : "CITIZEN");
            report.setReporterPhone("+91" + (rand.nextInt(9000000) + 1000000));

            // Status - 70% verified, 30% pending
            if (rand.nextDouble() < 0.7) {
                report.setStatus("VERIFIED");
                report.setVerifiedBy(reporters[rand.nextInt(reporters.length)]);
            } else {
                report.setStatus("PENDING_VERIFICATION");
            }

            // Casualties and road impact
            report.setCasualtiesReported(rand.nextInt(5)); // 0-4 casualties
            report.setRoadBlocked(rand.nextDouble() < 0.4); // 40% chance road blocked

            // Timestamp - spread over last 7 days
            long daysAgo = rand.nextLong() % (7 * 24 * 60 * 60 * 1000);
            report.setTimestamp(LocalDateTime.now().minusSeconds(daysAgo / 1000));

            // Save to database
            LandslideReport saved = landslideReportRepository.save(report);
            generatedReports.add(saved);

            // Log action
            auditService.log("SEED_DATA", "ADMIN", "REPORT:" + saved.getId(), null, 
                "Sample report generated: " + saved.getLocationDescription());
        }

        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "message", "Generated 15 sample landslide reports",
            "count", generatedReports.size(),
            "reports", generatedReports
        ));
    }
}
