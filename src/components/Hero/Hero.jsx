import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Conteneur Vidéo */}
      <div className="hero__video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero__video"
        >
          <source src="/Accueil.mp4" type="video/mp4" />
        </video>
        {/* L'overlay avec flou sombre prononcé */}
        <div className="hero__overlay" />
      </div>

      {/* Halos très discrets pour la profondeur */}
      <div className="hero__blur hero__blur--1" />
      <div className="hero__blur hero__blur--2" />

      <div className="hero__content">
        <span className="hero__badge">{t('hero.badge')}</span>
        <h1 className="hero__title">
          {t('hero.title')}<br />
          <span className="hero__title-accent">{t('hero.subtitle')}</span>
        </h1>
        <p className="hero__desc">{t('hero.desc')}</p>

        <div className="hero__actions">
          <button className="hero__cta" onClick={() => navigate('/courses')}>
            {t('hero.cta')} →
          </button>
          <button className="hero__cta hero__cta--ghost" onClick={() => navigate('/simulator')}>
            {t('hero.ctaSim')}
          </button>
        </div>
      </div>
    </section>
  );
}