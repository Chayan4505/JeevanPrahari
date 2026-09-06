package com.pahaarsaathi.controller;

import com.pahaarsaathi.auth.UserPrincipal;
import com.pahaarsaathi.dto.ReportDTOs.*;
import com.pahaarsaathi.model.LandslideReport;
import com.pahaarsaathi.repository.LandslideReportRepository;
import com.pahaarsaathi.service.AuditService;
import com.pahaarsaathi.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Landslide Incident Reporting", description = "Citizen & field officer crowd-sourced incident reporting with offline sync and photo uploads")
public class LandslideReportController {

    @Autowired
    private LandslideReportRepository landslideReportRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private AuditService auditService;

    @PostMapping
    @Operation(summary = "Submit a citizen or field-officer landslide incident report (supports offline sync UUID)")
    public ResponseEntity<LandslideReport> createReport(
            @RequestBody CreateReportRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {

        // Check if report with same offlineSyncId already exists to avoid duplicates from PWA retry sync
        if (req.getOfflineSyncId() != null && !req.getOfflineSyncId().isEmpty()) {
            Optional<LandslideReport> existing = landslideReportRepository.findByOfflineSyncId(req.getOfflineSyncId());
            if (existing.isPresent()) {
                return ResponseEntity.ok(existing.get());
            }
        }

        LandslideReport report = new LandslideReport();
        report.setLatitude(req.getLatitude());
        report.setLongitude(req.getLongitude());
        report.setLocationDescription(req.getLocationDescription());
        report.setDistrictId(req.getDistrictId() != null ? req.getDistrictId() : "IN-ML-EKH");
        report.setLandslideType(req.getLandslideType() != null ? req.getLandslideType() : "SOIL_SLIDE");
        report.setSeverity(req.getSeverity() != null ? req.getSeverity() : "MODERATE");
        report.setDescription(req.getDescription());
        report.setMediaUrl(req.getMediaUrl());
        report.setOfflineSyncId(req.getOfflineSyncId());
        report.setRoadBlocked(req.getRoadBlocked() != null ? req.getRoadBlocked() : false);
        report.setCasualtiesReported(req.getCasualtiesReported() != null ? req.getCasualtiesReported() : 0);
        report.setTimestamp(LocalDateTime.now());

        if (principal != null) {
            report.setReporterName(principal.getName());
            report.setReporterRole(principal.getRole().name().replace("ROLE_", ""));
        } else {
            report.setReporterName(req.getReporterName() != null ? req.getReporterName() : "Anonymous Citizen");
            report.setReporterPhone(req.getReporterPhone());
            report.setReporterRole(req.getReporterRole() != null ? req.getReporterRole() : "CITIZEN");
        }

        // Auto-verify if reported by Field Officer
        if ("FIELD_OFFICER".equalsIgnoreCase(report.getReporterRole()) || "DISTRICT_ADMIN".equalsIgnoreCase(report.getReporterRole())) {
            report.setStatus("VERIFIED");
            report.setVerifiedBy(report.getReporterName());
        } else {
            report.setStatus("PENDING_VERIFICATION");
        }

        LandslideReport saved = landslideReportRepository.save(report);
        auditService.log("REPORT_SUBMISSION", report.getReporterName(), "REPORT:" + saved.getId(), null, "Landslide incident reported at " + report.getLocationDescription());

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/upload-media")
    @Operation(summary = "Upload photo or video file for incident report to MinIO S3 storage")
    public ResponseEntity<Map<String, String>> uploadMedia(@RequestParam("file") MultipartFile file) {
        String mediaUrl = storageService.uploadReportMedia(file);
        return ResponseEntity.ok(Map.of("mediaUrl", mediaUrl, "status", "SUCCESS"));
    }

    @GetMapping
    @Operation(summary = "List incident reports with optional district filter")
    public ResponseEntity<List<LandslideReport>> getAllReports(
            @RequestParam(required = false) String districtId,
            @RequestParam(required = false) String status) {
        if (districtId != null && !districtId.isEmpty() && !districtId.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(landslideReportRepository.findByDistrictId(districtId));
        }
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(landslideReportRepository.findByStatus(status));
        }
        return ResponseEntity.ok(landslideReportRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get unverified pending incident reports for field officer review")
    public ResponseEntity<List<LandslideReport>> getPendingReports() {
        return ResponseEntity.ok(landslideReportRepository.findByStatus("PENDING_VERIFICATION"));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'DISTRICT_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Verify or reject an incident report")
    public ResponseEntity<LandslideReport> verifyReport(
            @PathVariable Long id,
            @RequestBody VerifyReportRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        LandslideReport report = landslideReportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + id));

        report.setStatus(req.getStatus() != null ? req.getStatus() : "VERIFIED");
        report.setVerifiedBy(principal != null ? principal.getEmail() : "Field Officer");
        LandslideReport updated = landslideReportRepository.save(report);

        auditService.log("REPORT_VERIFICATION", principal != null ? principal.getEmail() : "Officer", "REPORT:" + id, null, "Report status changed to " + report.getStatus());

        return ResponseEntity.ok(updated);
    }
}
