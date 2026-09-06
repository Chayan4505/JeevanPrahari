package com.pahaarsaathi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "alert_templates")
public class AlertTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String templateCode; // e.g. "LANDSLIDE_RED_ALERT", "LANDSLIDE_ORANGE_WARNING", "ROAD_BLOCKAGE_ADVISORY"

    @Column(nullable = false)
    private String languageCode; // en, hi, as, bodo, khasi, garo, mizo, manipuri, nagamese

    @Column(nullable = false)
    private String languageName; // English, Hindi, Assamese (অসমীয়া), Bodo (बर'), Khasi, Garo, Mizo, Manipuri (মৈতৈলোন্), Nagamese

    @Column(nullable = false)
    private String severity; // Extreme, Severe, Moderate, Minor

    @Column(nullable = false)
    private String headline;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String instruction;

    public AlertTemplate() {}

    public AlertTemplate(String templateCode, String languageCode, String languageName, String severity, String headline, String body, String instruction) {
        this.templateCode = templateCode;
        this.languageCode = languageCode;
        this.languageName = languageName;
        this.severity = severity;
        this.headline = headline;
        this.body = body;
        this.instruction = instruction;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTemplateCode() { return templateCode; }
    public void setTemplateCode(String templateCode) { this.templateCode = templateCode; }

    public String getLanguageCode() { return languageCode; }
    public void setLanguageCode(String languageCode) { this.languageCode = languageCode; }

    public String getLanguageName() { return languageName; }
    public void setLanguageName(String languageName) { this.languageName = languageName; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
}
