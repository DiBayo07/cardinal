import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer" id="contacts">
      <div className="container footer-content">
        <div className="footer-col">
          <div className="logo footer-logo">
            <span className="logo-text" style={{color: 'white'}}>Cardinal Education</span>
            <span className="logo-badge">KG</span>
          </div>
          <p className="footer-copyright">{t('footer.copyright')}</p>
        </div>
        
        <div className="footer-col">
          <div className="footer-contact-item">
            <FaWhatsapp size={24} color="var(--color-accent)" />
            <div>
              <strong>WhatsApp:</strong>
              <br />
              <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer">+996 222 322 632</a>
            </div>
          </div>
          <div className="footer-contact-item">
            <FaMapMarkerAlt size={24} color="var(--color-accent)" />
            <div>
              <strong>Адрес:</strong>
              <br />
              {t('footer.address')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
