package com.pahaarsaathi.dto;

import java.time.LocalDateTime;

public class ReportDTOs {

    public static class CreateReportRequest {
        private Double latitude;
        private Double longitude;
        private String locationDescription;
        private String districtId;
        private String landslideType; // DEBRIS_FLOW, ROCKFALL, SOIL_SLIDE, ROAD_SUBSIDENCE, TENSION_CRACK
        private String severity; // MINOR, MODERATE, SEVERE, CATASTROPHIC
        private String description;
        private String reporterName;
        private String reporterPhone;
        private String reporterRole;
        private String mediaUrl;
        private String offlineSyncId;
        private Boolean roadBlocked = false;
        private Integer casualtiesReported = 0;

        public CreateReportRequest() {}

        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public String getLocationDescription() { return locationDescription; }
        public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }
        public String getDistrictId() { return districtId; }
        public void setDistrictId(String districtId) { this.districtId = districtId; }
        public String getLandslideType() { return landslideType; }
        public void setLandslideType(String landslideType) { this.landslideType = landslideType; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getReporterName() { return reporterName; }
        public void setReporterName(String reporterName) { this.reporterName = reporterName; }
        public String getReporterPhone() { return reporterPhone; }
        public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
        public String getReporterRole() { return reporterRole; }
        public void setReporterRole(String reporterRole) { this.reporterRole = reporterRole; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public String getOfflineSyncId() { return offlineSyncId; }
        public void setOfflineSyncId(String offlineSyncId) { this.offlineSyncId = offlineSyncId; }
        public Boolean getRoadBlocked() { return roadBlocked; }
        public void setRoadBlocked(Boolean roadBlocked) { this.roadBlocked = roadBlocked; }
        public Integer getCasualtiesReported() { return casualtiesReported; }
        public void setCasualtiesReported(Integer casualtiesReported) { this.casualtiesReported = casualtiesReported; }
    }

    public static class VerifyReportRequest {
        private String status; // VERIFIED, REJECTED, RESOLVED
        private String note;

        public VerifyReportRequest() {}

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }
}
