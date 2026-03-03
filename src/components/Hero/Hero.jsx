import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

const ICONS = ['₿','Ξ','◈','📊','📈','💹','🏦','⚡','🔗','💎','🪙','📉','🌐','💰','🔒'];

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero__gradient" />
      <div className="hero__icons">
        {ICONS.map((ic, i) => (
          <span key={i} className={`hero__icon hero__icon--${(i % 3) + 1}`}
            style={{ left: `${5 + (i * 6.2) % 90}%`, top: `${10 + (i * 17) % 75}%`, animationDelay: `${i * 0.7}s`, fontSize: `${1.2 + (i % 4) * 0.4}rem` }}>
            {ic}
          </span>
        ))}
      </div>
      <div className="hero__blur hero__blur--1" />
      <div className="hero__blur hero__blur--2" />
      <div className="hero__blur hero__blur--3" />
      <div className="hero__content">
        <span className="hero__badge">{t('hero.badge')}</span>
        <h1 className="hero__title">{t('hero.title')}<br/><span className="hero__title-accent">{t('hero.subtitle')}</span></h1>
        <p className="hero__desc">{t('hero.desc')}</p>
        <div className="hero__actions">
          <button className="hero__cta" onClick={() => navigate('/courses')}>{t('hero.cta')} →</button>
          <button className="hero__cta hero__cta--ghost" onClick={() => navigate('/simulator')}>{t('hero.ctaSim')}</button>
        </div>
      </div>
    </section>
  );
}
