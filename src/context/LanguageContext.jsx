import React, { createContext, useState, useContext, useEffect } from 'react';
import ru from '../i18n/ru.json';
import kg from '../i18n/kg.json';
import en from '../i18n/en.json';

const LanguageContext = createContext();

export const translations = { ru, kg, en };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let current = translations[language];
    for (let i = 0; i < keys.length; i++) {
      if (!current[keys[i]]) return key;
      current = current[keys[i]];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
