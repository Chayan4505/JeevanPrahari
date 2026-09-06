package com.pahaarsaathi.repository;

import com.pahaarsaathi.model.AlertTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertTemplateRepository extends JpaRepository<AlertTemplate, Long> {
    Optional<AlertTemplate> findByTemplateCodeAndLanguageCode(String templateCode, String languageCode);
    List<AlertTemplate> findByTemplateCode(String templateCode);
    List<AlertTemplate> findByLanguageCode(String languageCode);
}
