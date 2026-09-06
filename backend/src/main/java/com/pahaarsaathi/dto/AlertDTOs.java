package com.pahaarsaathi.dto;

import java.util.List;

public class AlertDTOs {

    public static class DispatchAlertRequest {
        private String districtId;
        private String headline;
        private String description;
        private String instruction;
        private String severity; // Extreme, Severe, Moderate, Minor
        private String urgency = "Immediate";
        private String certainty = "Observed";
        private String language = "en";
        private String templateCode;
        private List<String> channels; // ["SMS", "PUSH", "IN_APP"]
        private String affectedAreaName;

        public DispatchAlertRequest() {}

        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public String getHeadline() { return headline; }
        public void setHeadline(String headline) { this.headline = headline; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getInstruction() { return instruction; }
        public void setInstruction(String instruction) { this.instruction = instruction; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getUrgency() { return urgency; }
        public void setUrgency(String urgency) { this.urgency = urgency; }
        public String getCertainty() { return certainty; }
        public void setCertainty(String certainty) { this.certainty = certainty; }
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
        public String getTemplateCode() { return templateCode; }
        public void setTemplateCode(String templateCode) { this.templateCode = templateCode; }
        public List<String> getChannels() { return channels; }
        public void setChannels(List<String> channels) { this.channels = channels; }
        public String getAffectedAreaName() { return affectedAreaName; }
        public void setAffectedAreaName(String affectedAreaName) { this.affectedAreaName = affectedAreaName; }
    }

    public static class CAPXmlResponse {
        private String identifier;
        private String status;
        private String capXml;

        public CAPXmlResponse() {}
        public CAPXmlResponse(String identifier, String status, String capXml) {
            this.identifier = identifier;
            this.status = status;
            this.capXml = capXml;
        }

        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getCapXml() { return capXml; }
        public void setCapXml(String capXml) { this.capXml = capXml; }
    }
}
