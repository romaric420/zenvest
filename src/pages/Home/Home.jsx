import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Hero from '../../components/Hero/Hero';
import CourseCard from '../../components/CourseCard/CourseCard';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const featureIcons = ['📈', '✍️', '🎯', '🏆'];

export default function Home() {
  const { t, translations } = useLanguage();
  const courses = translations.courses;

  return (
    <div>
      <Hero />

      <section className="home-courses" id="courses">
        <div className="home-courses__header">
          <h2 className="home-courses__title">{t('home.coursesTitle')}</h2>
          <p className="home-courses__subtitle">{t('home.coursesSubtitle')}</p>
        </div>
        <div className="home-courses__grid">
          {Object.values(courses).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="home-features">
        <div className="home-features__header">
          <h2 className="home-features__title">{t('home.whyTitle')}</h2>
          <p className="home-features__subtitle">{t('home.whySubtitle')}</p>
        </div>
        <div className="home-features__grid">
          {t('home.features').map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-card__icon">{featureIcons[idx]}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-levels">
        <div className="home-levels__header">
          <h2 className="home-levels__title">{t('home.levelsTitle')}</h2>
        </div>
        <div className="home-levels__grid">
          {['beginner', 'intermediate', 'advanced'].map((level, idx) => (
            <div key={level} className="level-card">
              <div className={`level-card__number level-card__number--${level}`}>
                0{idx + 1}
              </div>
              <div className="level-card__label">{t(`home.levels.${level}.label`)}</div>
              <div className="level-card__desc">{t(`home.levels.${level}.desc`)}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
