import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageMeta } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentMeta: LanguageMeta;
  languages: LanguageMeta[];
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('zinachi_lang') as Language;
    return saved && TRANSLATIONS[saved] ? saved : 'uz';
  });

  const currentMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRtl = currentMeta.dir === 'rtl';

  useEffect(() => {
    localStorage.setItem('zinachi_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = currentMeta.dir;
  }, [language, currentMeta.dir]);

  const setLanguage = (lang: Language) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
    }
  };

  const t = (key: string): string => {
    if (TRANSLATIONS[language]?.[key]) {
      return TRANSLATIONS[language][key];
    }
    // Fallback to Uzbek or English
    if (TRANSLATIONS.uz?.[key]) {
      return TRANSLATIONS.uz[key];
    }
    if (TRANSLATIONS.en?.[key]) {
      return TRANSLATIONS.en[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentMeta, languages: SUPPORTED_LANGUAGES, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
