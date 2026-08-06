import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaWhatsapp, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-scroll';
import './Header.css';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const toggleLang = () => setLangOpen(!langOpen);
  const selectLang = (lang) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  const langs = ['ru', 'kg', 'en'];
  const activeLang = language;
  const otherLangs = langs.filter(l => l !== activeLang);

  return (
    <header className="header glass">
      <div className="container header-content">
        <div className="logo" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
          <img src="./logo-v4.png" alt="Cardinal Education" className="header-logo-img" />
        </div>
        
        <nav className="nav-menu">
          <Link to="about" smooth={true} offset={-100} duration={800}>{t('nav.about')}</Link>
          <Link to="services" smooth={true} offset={-100} duration={800}>{t('nav.services')}</Link>
          <Link to="reviews" smooth={true} offset={-100} duration={800}>{t('nav.reviews')}</Link>
          <Link to="contacts" smooth={true} offset={-100} duration={800}>{t('nav.contacts')}</Link>
        </nav>

        <div className="header-actions">
          <div className="lang-dropdown">
            <div className="lang-active" onClick={toggleLang}>
              {activeLang.toUpperCase()} <FaChevronDown size={12} />
            </div>
            {langOpen && (
              <div className="lang-menu">
                {otherLangs.map(lang => (
                  <div key={lang} className="lang-item" onClick={() => selectLang(lang)}>
                    {lang.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
          <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            <FaWhatsapp size={20} color="#2C1C08" />
            <span className="hide-mobile">{t('nav.contacts')}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
