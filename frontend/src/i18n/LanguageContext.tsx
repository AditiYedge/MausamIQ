import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../services/types';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

const dictionaries: Record<Language, Record<string, string>> = {
  en,
  hi,
  mr
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'mr',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('mausamiq_lang') as Language;
    return saved && ['en', 'hi', 'mr'].includes(saved) ? saved : 'mr';
  });

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem('mausamiq_lang', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[language] || dictionaries.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English dictionary
    if (dictionaries.en && dictionaries.en[key]) {
      return dictionaries.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
