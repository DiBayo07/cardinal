import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationFormSection from '../components/ApplicationFormSection';
import { useLanguage } from '../context/LanguageContext';
import './CountryLanding.css';

const countryData = {
  italy: {
    formCountry: 'Италия',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&q=80")',
    ru: {
      title: 'Учеба в Италии',
      subtitle: 'Получите высшее образование в колыбели европейской культуры. Заполните анкету для бесплатной консультации!'
    },
    kg: {
      title: 'Италияда билим алуу',
      subtitle: 'Европа маданиятынын бешиги болгон өлкөдө жогорку билим алыңыз. Акысыз консультация үчүн анкетаны толтуруңуз!'
    }
  },
  usa: {
    formCountry: 'США',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80")',
    ru: {
      title: 'Учеба в США',
      subtitle: 'Откройте двери в лучшие университеты мира. Заполните анкету для бесплатной консультации!'
    },
    kg: {
      title: 'АКШда билим алуу',
      subtitle: 'Дүйнөнүн эң мыкты университеттерине эшик ачыңыз. Акысыз консультация үчүн анкетаны толтуруңуз!'
    }
  },
  china: {
    formCountry: 'Китай',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1508804185872-d7bad6758715?auto=format&fit=crop&q=80")',
    ru: {
      title: 'Учеба в Китае',
      subtitle: 'Получите грант на обучение в одной из самых быстроразвивающихся стран мира. Оставьте заявку!'
    },
    kg: {
      title: 'Кытайда билим алуу',
      subtitle: 'Дүйнөдөгү эң тез өнүгүп жаткан өлкөлөрдүн биринде окуу үчүн грант алыңыз. Арыз калтырыңыз!'
    }
  },
  korea: {
    formCountry: 'Южная Корея',
    bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80")',
    ru: {
      title: 'Учеба в Южной Корее',
      subtitle: 'Современные технологии и богатая культура. Сделай первый шаг к обучению в Корее!'
    },
    kg: {
      title: 'Түштүк Кореяда билим алуу',
      subtitle: 'Заманбап технологиялар жана бай маданият. Кореяда окуу үчүн биринчи кадамды таштаңыз!'
    }
  }
};

const CountryLanding = () => {
  const { countryId } = useParams();
  const { language } = useLanguage();
  
  const country = countryData[countryId?.toLowerCase()];

  const defaultContent = {
    formCountry: '',
    bg: 'var(--color-bg-dark)',
    ru: {
      title: 'Обучение за рубежом',
      subtitle: 'Заполните анкету, и мы подберем для вас идеальную страну и университет.'
    },
    kg: {
      title: 'Чет өлкөдө билим алуу',
      subtitle: 'Анкетаны толтуруңуз, биз сизге эң ылайыктуу өлкөнү жана университетти тандап беребиз.'
    }
  };

  const currentCountry = country || defaultContent;
  const langKey = language === 'kg' ? 'kg' : 'ru';
  const content = currentCountry[langKey];

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
            <h1 className="gold-text" style={{fontSize: '3rem', marginBottom: '20px'}}>{content.title}</h1>
            <p style={{fontSize: '1.2rem', marginBottom: '40px'}}>{content.subtitle}</p>
          </motion.div>
        </div>
      </section>
      
      {/* Используем оригинальную форму из сайта с фиксацией страны */}
      <ApplicationFormSection fixedCountry={currentCountry.formCountry} />
      
      <Footer />
    </>
  );
};

export default CountryLanding;
