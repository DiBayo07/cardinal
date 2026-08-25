import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationFormSection from '../components/ApplicationFormSection';
import { useLanguage } from '../context/LanguageContext';
import './CountryLanding.css';

const getBg = (url) => `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${url}")`;

const countryData = {
  // EUROPE
  italy: {
    formCountry: 'Италия',
    bg: getBg('https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Италии', subtitle: 'Получите высшее образование в колыбели европейской культуры. Заполните анкету для бесплатной консультации!' },
    kg: { title: 'Италияда билим алуу', subtitle: 'Европа маданиятынын бешиги болгон өлкөдө жогорку билим алыңыз. Акысыз консультация үчүн анкетаны толтуруңуз!' },
    en: { title: 'Study in Italy', subtitle: 'Get higher education in the cradle of European culture. Fill out the form for a free consultation!' }
  },
  uk: {
    formCountry: 'Великобритания',
    bg: getBg('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Великобритании', subtitle: 'Обучение в лучших традициях с мировым признанием. Сделайте шаг к престижному образованию!' },
    kg: { title: 'Улуу Британияда билим алуу', subtitle: 'Дүйнөлүк деңгээлдеги билим берүү. Престиждүү билимге кадам таштаңыз!' },
    en: { title: 'Study in the UK', subtitle: 'Education in the best traditions with global recognition. Take a step towards prestigious education!' }
  },
  germany: {
    formCountry: 'Германия',
    bg: getBg('https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Германии', subtitle: 'Бесплатное высшее образование на английском и немецком языках. Оставьте заявку!' },
    kg: { title: 'Германияда билим алуу', subtitle: 'Англис жана немис тилдеринде акысыз жогорку билим. Арыз калтырыңыз!' },
    en: { title: 'Study in Germany', subtitle: 'Free higher education in English and German. Leave a request!' }
  },
  france: {
    formCountry: 'Франция',
    bg: getBg('https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба во Франции', subtitle: 'Элитарное образование в сердце Европы. Откройте для себя новые возможности!' },
    kg: { title: 'Францияда билим алуу', subtitle: 'Европанын жүрөгүндө элиталык билим. Жаңы мүмкүнчүлүктөрдү ачыңыз!' },
    en: { title: 'Study in France', subtitle: 'Elite education in the heart of Europe. Discover new opportunities!' }
  },
  switzerland: {
    formCountry: 'Швейцария',
    bg: getBg('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Швейцарии', subtitle: 'Безупречное качество жизни и престижное образование. Заполните анкету!' },
    kg: { title: 'Швейцарияда билим алуу', subtitle: 'Жогорку сапаттагы жашоо жана престиждүү билим. Анкетаны толтуруңуз!' },
    en: { title: 'Study in Switzerland', subtitle: 'Impeccable quality of life and prestigious education. Fill out the form!' }
  },
  czech: {
    formCountry: 'Чехия',
    bg: getBg('https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Чехии', subtitle: 'Доступное образование в центре Европы. Начните свой путь к успеху!' },
    kg: { title: 'Чехияда билим алуу', subtitle: 'Европанын борборунда жеткиликтүү билим. Ийгиликке жолуңузду баштаңыз!' },
    en: { title: 'Study in Czechia', subtitle: 'Affordable education in the center of Europe. Start your journey to success!' }
  },
  
  // ASIA
  china: {
    formCountry: 'Китай',
    bg: getBg('https://images.unsplash.com/photo-1508804185872-d7bad6758715?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Китае', subtitle: 'Получите грант на обучение в одной из самых быстроразвивающихся стран мира. Оставьте заявку!' },
    kg: { title: 'Кытайда билим алуу', subtitle: 'Дүйнөдөгү эң тез өнүгүп жаткан өлкөлөрдүн биринде окуу үчүн грант алыңыз!' },
    en: { title: 'Study in China', subtitle: 'Get a scholarship to study in one of the fastest-growing countries in the world!' }
  },
  korea: {
    formCountry: 'Южная Корея',
    bg: getBg('https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Южной Корее', subtitle: 'Современные технологии и богатая культура. Сделай первый шаг к обучению в Корее!' },
    kg: { title: 'Түштүк Кореяда билим алуу', subtitle: 'Заманбап технологиялар жана бай маданият. Кореяда окууга биринчи кадамды таштаңыз!' },
    en: { title: 'Study in South Korea', subtitle: 'Modern technology and rich culture. Take your first step towards studying in Korea!' }
  },
  japan: {
    formCountry: 'Япония',
    bg: getBg('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Японии', subtitle: 'Передовые технологии и уникальные традиции. Поступите в лучшие вузы Японии!' },
    kg: { title: 'Японияда билим алуу', subtitle: 'Алдыңкы технологиялар жана уникалдуу салттар. Мыкты окуу жайларга тапшырыңыз!' },
    en: { title: 'Study in Japan', subtitle: 'Advanced technology and unique traditions. Enroll in the best universities in Japan!' }
  },
  malaysia: {
    formCountry: 'Малайзия',
    bg: getBg('https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Малайзии', subtitle: 'Международное образование по доступным ценам. Откройте для себя Азию!' },
    kg: { title: 'Малайзияда билим алуу', subtitle: 'Жеткиликтүү баада эл аралык билим берүү. Азияны ачыңыз!' },
    en: { title: 'Study in Malaysia', subtitle: 'International education at affordable prices. Discover Asia!' }
  },

  // AMERICA
  usa: {
    formCountry: 'США',
    bg: getBg('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в США', subtitle: 'Откройте двери в лучшие университеты мира. Заполните анкету для бесплатной консультации!' },
    kg: { title: 'АКШда билим алуу', subtitle: 'Дүйнөнүн эң мыкты университеттерине эшик ачыңыз. Акысыз консультация үчүн анкетаны толтуруңуз!' },
    en: { title: 'Study in the USA', subtitle: 'Open the doors to the best universities in the world. Fill out the form!' }
  },
  canada: {
    formCountry: 'Канада',
    bg: getBg('https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&q=80'),
    ru: { title: 'Учеба в Канаде', subtitle: 'Высочайший уровень жизни и качественное образование. Начните свое будущее здесь!' },
    kg: { title: 'Канадада билим алуу', subtitle: 'Жашоонун жогорку деңгээли жана сапаттуу билим. Келечегиңизди ушул жерден баштаңыз!' },
    en: { title: 'Study in Canada', subtitle: 'Highest standard of living and quality education. Start your future here!' }
  }
};

const CountryLanding = () => {
  const { countryId } = useParams();
  const { language } = useLanguage();
  
  const country = countryData[countryId?.toLowerCase()];

  const defaultContent = {
    formCountry: '',
    bg: getBg('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'), // Earth bg
    ru: {
      title: 'Обучение за рубежом',
      subtitle: 'Заполните анкету, и мы подберем для вас идеальную страну и университет.'
    },
    kg: {
      title: 'Чет өлкөдө билим алуу',
      subtitle: 'Анкетаны толтуруңуз, биз сизге эң ылайыктуу өлкөнү жана университетти тандап беребиз.'
    },
    en: {
      title: 'Study Abroad',
      subtitle: 'Fill out the form, and we will find the perfect country and university for you.'
    }
  };

  const currentCountry = country || defaultContent;
  const langKey = language === 'kg' ? 'kg' : language === 'en' ? 'en' : 'ru';
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
