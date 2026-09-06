import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKeys } from '../i18n/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationKeys;
  languages: { code: string; label: string }[];
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'bodo', label: 'बर\' (Bodo)' },
  { code: 'khasi', label: 'Khasi (Ka Ktien Khasi)' },
  { code: 'garo', label: 'Garo (A·chik)' },
  { code: 'mizo', label: 'Mizo (Mizo ṭawng)' },
  { code: 'manipuri', label: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'nagamese', label: 'Nagamese' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('pahaarsaathi_lang') || 'en';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('pahaarsaathi_lang', lang);
  };

  const t = translations[language] || translations['en'];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
