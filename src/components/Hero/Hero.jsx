import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__badge">{t('hero.badge')}</div>
        <h1 className="hero__title">
          {t('hero.title')}
        </h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>

        <div className="hero__actions">
          <button className="hero__btn-primary" onClick={() => navigate('/course/investing')}>
            {t('hero.ctaPrimary')}
          </button>
          <button className="hero__btn-secondary" onClick={() => {
            document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            {t('hero.ctaSecondary')}
          </button>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <div className="hero__stat-value">15</div>
            <div className="hero__stat-label">{t('hero.stats.modules')}</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value hero__stat-value--orange">30+</div>
            <div className="hero__stat-label">{t('hero.stats.exercises')}</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">18</div>
            <div className="hero__stat-label">{t('hero.stats.hours')}</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value hero__stat-value--orange">✓</div>
            <div className="hero__stat-label">{t('hero.stats.certificate')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
