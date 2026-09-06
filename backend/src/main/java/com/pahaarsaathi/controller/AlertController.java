package com.pahaarsaathi.controller;

import com.pahaarsaathi.auth.UserPrincipal;
import com.pahaarsaathi.dto.AlertDTOs.DispatchAlertRequest;
import com.pahaarsaathi.model.Alert;
import com.pahaarsaathi.model.AlertTemplate;
import com.pahaarsaathi.service.AlertDispatchService;
import com.pahaarsaathi.service.MultilingualService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts & CAP XML", description = "Disaster alert management adhering to NDMA OASIS Common Alerting Protocol (CAP 1.2)")
public class AlertController {

    @Autowired
    private AlertDispatchService alertDispatchService;

    @Autowired
    private MultilingualService multilingualService;

    @GetMapping
    @Operation(summary = "Get all active alerts or filter by district")
    public ResponseEntity<List<Alert>> getActiveAlerts(@RequestParam(required = false) String districtId) {
        if (districtId != null && !districtId.isEmpty() && !districtId.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(alertDispatchService.getAlertsByDistrict(districtId));
        }
        return ResponseEntity.ok(alertDispatchService.getActiveAlerts());
    }

    @PostMapping("/dispatch")
    @PreAuthorize("hasAnyRole('DISTRICT_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Dispatch disaster alert across SMS, Push, and Web channels and generate CAP 1.2 XML")
    public ResponseEntity<Alert> dispatchAlert(
            @RequestBody DispatchAlertRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String createdBy = principal != null ? principal.getEmail() : "district.admin@pahaarsaathi.ner.gov.in";
        Alert alert = alertDispatchService.dispatchAlert(request, createdBy);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alert details by ID")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        return alertDispatchService.getAlertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(value = "/{id}/cap-xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "Download official OASIS CAP 1.2 XML compliant with NDMA schema")
    public ResponseEntity<String> getCapXml(@PathVariable Long id) {
        Alert alert = alertDispatchService.getAlertById(id).orElse(null);
        if (alert == null || alert.getCapXml() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + alert.getIdentifier() + ".xml\"");

        return ResponseEntity.ok().headers(headers).body(alert.getCapXml());
    }

    @GetMapping("/languages")
    @Operation(summary = "Get list of supported North Eastern languages")
    public ResponseEntity<Map<String, String>> getSupportedLanguages() {
        return ResponseEntity.ok(multilingualService.getSupportedLanguages());
    }

    @GetMapping("/templates/{lang}")
    @Operation(summary = "Get pre-translated alert templates for a given language code")
    public ResponseEntity<List<AlertTemplate>> getTemplates(@PathVariable String lang) {
        return ResponseEntity.ok(multilingualService.getTemplatesByLanguage(lang));
    }
}
