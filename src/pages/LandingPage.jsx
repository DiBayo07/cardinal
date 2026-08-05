import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaGraduationCap, FaGlobeEurope, FaLeaf, FaMap } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from local JSON (or GitHub in production)
    fetch('./data/reviews.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error loading reviews:", err));
  }, []);

  const serviceIcons = [
    <FaGraduationCap size={40} color="var(--color-accent)" />,
    <FaGlobeEurope size={40} color="var(--color-accent)" />,
    <FaLeaf size={40} color="var(--color-accent)" />,
    <FaMap size={40} color="var(--color-accent)" />
  ];
  
  const servicesKeys = ['usa', 'europe', 'canada', 'asia'];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text-box glass">
            <h1>{t('hero.title')}</h1>
            <p>{t('hero.subtitle')}</p>
            <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer" className="btn btn-primary mt-4">
              {t('hero.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="about-section">
        <div className="container text-center">
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="about-text">{t('about.text')}</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-title">{t('services.title')}</h2>
          <div className="services-grid">
            {servicesKeys.map((key, index) => (
              <div className="service-card glass" key={key}>
                <div className="service-icon">{serviceIcons[index]}</div>
                <h3>{t(`services.${key}.title`)}</h3>
                <p>{t(`services.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section">
        <div className="container">
          <h2 className="section-title">{t('reviews.title')}</h2>
          <div className="reviews-grid">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div className="review-card glass" key={review.id}>
                  <div className="video-wrapper">
                    <iframe 
                      src={review.videoUrl} 
                      title={`Review by ${review.name}`} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="review-info">
                    <h4>{review.name}</h4>
                    <p>{review.university}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Загрузка отзывов...</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center cta-content dark-glass">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.text')}</p>
          <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer" className="btn btn-primary mt-4">
            {t('cta.btn')}
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
