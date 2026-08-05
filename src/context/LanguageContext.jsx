import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ru';
  });
  
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Fetch translation dynamically
    setLoading(true);
    fetch(`./data/i18n/${language}.json?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => {
        setTranslations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load translation:", err);
        setLoading(false);
      });
  }, [language]);

  const t = (key) => {
    if (!translations) return '';
    const keys = key.split('.');
    let current = translations;
    for (let i = 0; i < keys.length; i++) {
      if (!current[keys[i]]) return key; // return key if missing
      current = current[keys[i]];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, setTranslations, loading }}>
      {!loading && children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
