import React, { createContext, useContext, useState, useCallback } from 'react';
import fr from '../i18n/fr.json';
import en from '../i18n/en.json';

const translations = { fr, en };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'fr' ? 'en' : 'fr');
  }, []);

  const t = useCallback((path) => {
    const keys = path.split('.');
    let value = translations[lang];
    for (const key of keys) {
      if (value === undefined) return path;
      value = value[key];
    }
    return value || path;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
