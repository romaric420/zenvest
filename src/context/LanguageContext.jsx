import React, { createContext, useContext, useState } from 'react';
import fr from '../i18n/fr.json';
import en from '../i18n/en.json';
const translations = { fr, en };
const LanguageContext = createContext();
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const toggleLang = () => setLang(l => l === 'fr' ? 'en' : 'fr');
  const t = (key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) { val = val?.[k]; }
    return val || key;
  };
  return <LanguageContext.Provider value={{ lang, toggleLang, t }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
