import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaWhatsapp } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="header glass">
      <div className="container header-content">
        <div className="logo">
          <span className="logo-text">Cardinal Education</span>
          <span className="logo-badge">KG</span>
        </div>
        
        <nav className="nav-menu">
          <a href="#about">{t('nav.about')}</a>
          <a href="#services">{t('nav.services')}</a>
          <a href="#reviews">{t('nav.reviews')}</a>
          <a href="#contacts">{t('nav.contacts')}</a>
        </nav>

        <div className="header-actions">
          <div className="lang-switcher">
            <button className={language === 'ru' ? 'active' : ''} onClick={() => setLanguage('ru')}>RU</button>
            <button className={language === 'kg' ? 'active' : ''} onClick={() => setLanguage('kg')}>KG</button>
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
          </div>
          <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            <FaWhatsapp size={20} />
            <span className="hide-mobile">{t('nav.contacts')}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
