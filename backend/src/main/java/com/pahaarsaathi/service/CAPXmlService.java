package com.pahaarsaathi.service;

import com.pahaarsaathi.model.Alert;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class CAPXmlService {

    /**
     * Builds standard OASIS Common Alerting Protocol (CAP) v1.2 XML adhering to NDMA India schema.
     */
    public String buildCapXml(Alert alert) {
        String sentIso = alert.getSentAt().format(DateTimeFormatter.ISO_DATE_TIME) + "+05:30";

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<alert xmlns=\"urn:oasis:names:tc:emergency:cap:1.2\">\n" +
                "  <identifier>" + escapeXml(alert.getIdentifier()) + "</identifier>\n" +
                "  <sender>PahaarSaathi-NDMA-EarlyWarning@ner.gov.in</sender>\n" +
                "  <sent>" + sentIso + "</sent>\n" +
                "  <status>" + escapeXml(alert.getStatus()) + "</status>\n" +
                "  <msgType>" + escapeXml(alert.getMsgType()) + "</msgType>\n" +
                "  <scope>" + escapeXml(alert.getScope()) + "</scope>\n" +
                "  <code valueName=\"profile:NDMA\">v1.2-IN-NER</code>\n" +
                "  <info>\n" +
                "    <language>" + escapeXml(alert.getLanguage()) + "</language>\n" +
                "    <category>" + escapeXml(alert.getCategory()) + "</category>\n" +
                "    <event>" + escapeXml(alert.getEvent()) + "</event>\n" +
                "    <urgency>" + escapeXml(alert.getUrgency()) + "</urgency>\n" +
                "    <severity>" + escapeXml(alert.getSeverity()) + "</severity>\n" +
                "    <certainty>" + escapeXml(alert.getCertainty()) + "</certainty>\n" +
                "    <eventCode>\n" +
                "      <valueName>SAME</valueName>\n" +
                "      <value>LSW</value>\n" +
                "    </eventCode>\n" +
                "    <headline>" + escapeXml(alert.getHeadline()) + "</headline>\n" +
                "    <description>" + escapeXml(alert.getDescription()) + "</description>\n" +
                "    <instruction>" + escapeXml(alert.getInstruction() != null ? alert.getInstruction() : "Seek safe higher ground away from steep cuts and drainage gullies.") + "</instruction>\n" +
                "    <contact>State Disaster Control Room / Helpline: 1077 or 112</contact>\n" +
                "    <area>\n" +
                "      <areaDesc>" + escapeXml(alert.getAffectedAreaName() != null ? alert.getAffectedAreaName() : alert.getDistrictId()) + "</areaDesc>\n" +
                "      <geocode>\n" +
                "        <valueName>DistrictCode</valueName>\n" +
                "        <value>" + escapeXml(alert.getDistrictId()) + "</value>\n" +
                "      </geocode>\n" +
                "    </area>\n" +
                "  </info>\n" +
                "</alert>";
    }

    private String escapeXml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
