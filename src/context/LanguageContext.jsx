import React, { createContext, useContext, useState } from 'react';
import { APP_VERSION } from '../config';
import fr from '../i18n/fr.json';
import en from '../i18n/en.json';

const LanguageContext = createContext();
const LANGS = { fr, en };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const toggleLang = () => setLang(prev => prev === 'fr' ? 'en' : 'fr');
  const t = (key) => {
    const keys = key.split('.');
    let val = LANGS[lang];
    for (const k of keys) { val = val?.[k]; }
    return val || key;
  };
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, version: APP_VERSION }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
