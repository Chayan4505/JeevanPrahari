package com.pahaarsaathi.service;

import com.pahaarsaathi.model.AlertTemplate;
import com.pahaarsaathi.repository.AlertTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MultilingualService {

    @Autowired
    private AlertTemplateRepository alertTemplateRepository;

    private static final Map<String, String> LANGUAGE_NAMES = new LinkedHashMap<>();
    static {
        LANGUAGE_NAMES.put("en", "English");
        LANGUAGE_NAMES.put("hi", "हिन्दी (Hindi)");
        LANGUAGE_NAMES.put("as", "অসমীয়া (Assamese)");
        LANGUAGE_NAMES.put("bodo", "बर' (Bodo)");
        LANGUAGE_NAMES.put("khasi", "Khasi (Ka Ktien Khasi)");
        LANGUAGE_NAMES.put("garo", "Garo (A·chik)");
        LANGUAGE_NAMES.put("mizo", "Mizo (Mizo ṭawng)");
        LANGUAGE_NAMES.put("manipuri", "মৈতৈলোন্ (Manipuri/Meitei)");
        LANGUAGE_NAMES.put("nagamese", "Nagamese");
    }

    public Map<String, String> getSupportedLanguages() {
        return LANGUAGE_NAMES;
    }

    public Optional<AlertTemplate> getTemplate(String templateCode, String languageCode) {
        return alertTemplateRepository.findByTemplateCodeAndLanguageCode(templateCode, languageCode != null ? languageCode.toLowerCase() : "en");
    }

    public List<AlertTemplate> getTemplatesByLanguage(String languageCode) {
        return alertTemplateRepository.findByLanguageCode(languageCode != null ? languageCode.toLowerCase() : "en");
    }
}
