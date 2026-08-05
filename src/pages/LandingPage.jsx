import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaGraduationCap, FaGlobeEurope, FaLeaf, FaMap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { InstagramEmbed, TikTokEmbed } from 'react-social-media-embed';
import './LandingPage.css';

const LandingPage = () => {
  const { t, loading } = useLanguage();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('./data/reviews.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        // filter out hidden reviews and sort by order if available
        const visible = data.filter(r => !r.isHidden);
        visible.sort((a, b) => (a.order || 0) - (b.order || 0));
        setReviews(visible);
      })
      .catch(err => console.error("Error loading reviews:", err));
  }, []);

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>;
  }

  const serviceIcons = [
    <FaGraduationCap size={45} color="var(--color-accent-gold)" />,
    <FaGlobeEurope size={45} color="var(--color-accent-gold)" />,
    <FaLeaf size={45} color="var(--color-accent-gold)" />,
    <FaMap size={45} color="var(--color-accent-gold)" />
  ];
  
  const servicesKeys = ['usa', 'europe', 'canada', 'asia'];

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <motion.div 
          className="container hero-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="hero-text-box glass">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="gold-text"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer" className="btn btn-primary mt-4">
                {t('hero.cta')}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Us */}
      <section id="about" className="about-section">
        <motion.div 
          className="container text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="section-title gold-text">{t('about.title')}</h2>
          <p className="about-text">{t('about.text')}</p>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <motion.h2 
            className="section-title gold-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {t('services.title')}
          </motion.h2>
          
          <motion.div 
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {servicesKeys.map((key, index) => (
              <motion.div className="service-card glass" key={key} variants={fadeUp}>
                <div className="service-icon">{serviceIcons[index]}</div>
                <h3>{t(`services.${key}.title`)}</h3>
                <p>{t(`services.${key}.desc`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section">
        <div className="container">
          <motion.h2 
            className="section-title gold-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {t('reviews.title')}
          </motion.h2>
          
          <motion.div 
            className="reviews-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const isInstagram = review.videoUrl.includes('instagram.com');
                const isTikTok = review.videoUrl.includes('tiktok.com');
                
                return (
                  <motion.div className="review-card glass" key={review.id} variants={fadeUp}>
                    <div className="video-wrapper" style={isInstagram || isTikTok ? { paddingBottom: 0, height: 'auto', display: 'flex', justifyContent: 'center' } : {}}>
                      {isInstagram ? (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                          <InstagramEmbed url={review.videoUrl} width="100%" />
                        </div>
                      ) : isTikTok ? (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                          <TikTokEmbed url={review.videoUrl} width="100%" />
                        </div>
                      ) : (
                        <iframe 
                          src={review.videoUrl} 
                          title={`Review by ${review.name}`} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                    <div className="review-info">
                      <h4 className="gold-text">{review.name}</h4>
                      <p>{review.university}</p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center">Загрузка отзывов...</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="container text-center cta-content glass"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="gold-text">{t('cta.title')}</h2>
          <p>{t('cta.text')}</p>
          <a href="https://wa.me/996222322632" target="_blank" rel="noreferrer" className="btn btn-primary mt-4">
            {t('cta.btn')}
          </a>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
