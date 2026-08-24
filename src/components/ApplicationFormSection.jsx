import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMaskInput } from 'react-imask';
import { useLanguage } from '../context/LanguageContext';
import './ApplicationFormSection.css';

const ApplicationFormSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    whatsapp: '',
    grade: '',
    country: '',
    otherCountry: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, whatsapp: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.city || !formData.whatsapp || !formData.grade || !formData.country) {
      return;
    }

    if (formData.country === 'Другая страна' && !formData.otherCountry) {
      return;
    }

    setStatus('loading');

    const finalCountry = formData.country === 'Другая страна' ? formData.otherCountry : formData.country;

    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnDnq-gZv1xDlxXYTOVOBJJsLu-L16wEmVnFvLbmHfIgf815LMm2_p8Ne6JN7e_74S/exec';

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          city: formData.city,
          whatsapp: "'" + formData.whatsapp,
          grade: formData.grade,
          country: finalCountry
        })
      });
      
      setStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      city: '',
      whatsapp: '',
      grade: '',
      country: '',
      otherCountry: ''
    });
    setStatus('idle');
  };

  return (
    <section id="application-form" className="application-form-section">
      <div className="container">
        <motion.div 
          className="form-wrapper glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {status === 'success' ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Заявка успешно отправлена!</h3>
              <p>Наш эксперт свяжется с вами в ближайшее время для бесплатной консультации.</p>
              <button className="btn btn-primary mt-4" onClick={resetForm}>Отправить еще одну</button>
            </div>
          ) : (
            <div className="form-body">
              <h2 className="form-title gold-text text-center">Оставить заявку</h2>
              <p className="form-subtitle text-center">Заполните форму, и мы свяжемся с вами в ближайшее время</p>
              
              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-group">
                  <label>ФИО *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Например: Иванов Иван"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Город *</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="Например: Бишкек"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>WhatsApp номер *</label>
                  <IMaskInput
                    mask="+{996} 000 000 000"
                    value={formData.whatsapp}
                    unmask={false} 
                    onAccept={(value) => handlePhoneChange(value)}
                    placeholder="+996 XXX XXX XXX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>В каком классе учится? *</label>
                  <select name="grade" value={formData.grade} onChange={handleChange} required>
                    <option value="" disabled>Выберите класс</option>
                    <option value="9 класс">9 класс</option>
                    <option value="10 класс">10 класс</option>
                    <option value="11 класс">11 класс</option>
                    <option value="Gap year">Gap year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>В какую страну хотели бы поступить? *</label>
                  <select name="country" value={formData.country} onChange={handleChange} required>
                    <option value="" disabled>Выберите страну</option>
                    <option value="США">США</option>
                    <option value="Италия">Италия</option>
                    <option value="Китай">Китай</option>
                    <option value="Южная Корея">Южная Корея</option>
                    <option value="Другая страна">Другая страна</option>
                  </select>
                </div>

                <AnimatePresence>
                  {formData.country === 'Другая страна' && (
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    >
                      <label>Укажите страну *</label>
                      <input 
                        type="text" 
                        name="otherCountry" 
                        value={formData.otherCountry} 
                        onChange={handleChange} 
                        placeholder="Например: Германия"
                        required 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="free-consultation-text" style={{ textAlign: 'center', color: 'var(--color-accent-gold)', fontSize: '0.9rem', marginTop: '5px', fontWeight: '500' }}>
                  * Первая консультация бесплатно
                </div>

                {status === 'error' && (
                  <div className="error-message">
                    Произошла ошибка при отправке. Пожалуйста, попробуйте позже.
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary submit-btn mt-3" 
                  disabled={status === 'loading'}
                  style={{ width: '100%' }}
                >
                  {status === 'loading' ? 'Отправка...' : 'ОТПРАВИТЬ ЗАЯВКУ'}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationFormSection;
