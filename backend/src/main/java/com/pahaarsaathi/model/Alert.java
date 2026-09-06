package com.pahaarsaathi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String identifier; // CAP-2026-IN-NER-XXXXX

    @Column(nullable = false)
    private String sender = "JeevanPrahari Early Warning System";

    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    @Column(nullable = false)
    private String status = "Actual"; // Actual, Exercise, Draft

    @Column(nullable = false)
    private String msgType = "Alert"; // Alert, Update, Cancel

    @Column(nullable = false)
    private String scope = "Public";

    @Column(nullable = false)
    private String category = "Geo"; // Geo, Met

    @Column(nullable = false)
    private String event = "Landslide Hazard Warning";

    @Column(nullable = false)
    private String urgency = "Immediate"; // Immediate, Expected, Future, Past

    @Column(nullable = false)
    private String severity = "Severe"; // Extreme, Severe, Moderate, Minor

    @Column(nullable = false)
    private String certainty = "Observed"; // Observed, Likely, Possible

    @Column(nullable = false)
    private String headline;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String instruction;

    @Column(nullable = false)
    private String districtId;

    @Column
    private String affectedAreaName;

    @Column
    private String language = "en";

    @Column
    private String dispatchedChannels = "SMS,PUSH,IN_APP";

    @Column
    private Integer recipientsCount = 0;

    @Column(columnDefinition = "TEXT")
    private String capXml; // Standard NDMA OASIS CAP v1.2 XML payload

    @Column
    private String createdBy;

    public Alert() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMsgType() { return msgType; }
    public void setMsgType(String msgType) { this.msgType = msgType; }

    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEvent() { return event; }
    public void setEvent(String event) { this.event = event; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getCertainty() { return certainty; }
    public void setCertainty(String certainty) { this.certainty = certainty; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getAffectedAreaName() { return affectedAreaName; }
    public void setAffectedAreaName(String affectedAreaName) { this.affectedAreaName = affectedAreaName; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getDispatchedChannels() { return dispatchedChannels; }
    public void setDispatchedChannels(String dispatchedChannels) { this.dispatchedChannels = dispatchedChannels; }

    public Integer getRecipientsCount() { return recipientsCount; }
    public void setRecipientsCount(Integer recipientsCount) { this.recipientsCount = recipientsCount; }

    public String getCapXml() { return capXml; }
    public void setCapXml(String capXml) { this.capXml = capXml; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
