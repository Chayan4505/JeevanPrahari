package com.pahaarsaathi.service;

import com.pahaarsaathi.model.AuditLog;
import com.pahaarsaathi.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Async
    public void log(String action, String performedBy, String targetEntity, String ipAddress, String details) {
        try {
            AuditLog log = new AuditLog(action, performedBy, targetEntity, ipAddress, details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("[PahaarSaathi AuditLog] Failed to record audit log: " + e.getMessage());
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
