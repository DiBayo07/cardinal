import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationFormSection from '../components/ApplicationFormSection';
import './CountryLanding.css';

const countryData = {
  italy: {
    name: 'Италии',
    title: 'Учеба в Италии 🇮🇹',
    subtitle: 'Получите высшее образование в колыбели европейской культуры. Заполните анкету для бесплатной консультации!',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&q=80")',
  },
  usa: {
    name: 'США',
    title: 'Учеба в США 🇺🇸',
    subtitle: 'Откройте двери в лучшие университеты мира. Заполните анкету для бесплатной консультации!',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80")',
  },
  china: {
    name: 'Китае',
    title: 'Учеба в Китае 🇨🇳',
    subtitle: 'Получите грант на обучение в одной из самых быстроразвивающихся стран мира. Оставьте заявку!',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1508804185872-d7bad6758715?auto=format&fit=crop&q=80")',
  },
  korea: {
    name: 'Южной Корее',
    title: 'Учеба в Южной Корее 🇰🇷',
    subtitle: 'Современные технологии и богатая культура. Сделай первый шаг к обучению в Корее!',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80")',
  }
};

const CountryLanding = () => {
  const { countryId } = useParams();
  
  const country = countryData[countryId?.toLowerCase()];

  const currentCountry = country || {
    name: 'За рубежом',
    title: 'Обучение за рубежом 🌍',
    subtitle: 'Заполните анкету, и мы подберем для вас идеальную страну и университет.',
    bg: 'var(--color-bg-dark)'
  };

  return (
    <>
      <Header />
      <section className="country-landing-hero" style={{ background: currentCountry.bg, backgroundSize: 'cover', backgroundPosition: 'center', paddingBottom: '40px' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '800px', margin: '0 auto', marginTop: '100px', textAlign: 'center' }}
          >
            <h1 className="gold-text" style={{fontSize: '3rem', marginBottom: '20px'}}>{currentCountry.title}</h1>
            <p style={{fontSize: '1.2rem', marginBottom: '40px'}}>{currentCountry.subtitle}</p>
          </motion.div>
        </div>
      </section>
      
      {/* Используем оригинальную форму из сайта */}
      <ApplicationFormSection />
      
      <Footer />
    </>
  );
};

export default CountryLanding;
