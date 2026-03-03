import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

const ICONS = [
  '\u20BF','\u039E','\u{1F4CA}','\u{1F4B9}','\u{1F4B0}','\u{1F4C8}','\u{1F4C9}','\u2B50',
  '\u{1F4B3}','\u{1F3E6}','\u{1F30D}','\u26A1','\u{1FA99}','\u{1F48E}','\u{1F517}',
  '\u{1F4B5}','\u{1F4B6}','\u{1F4B7}','\u{1F4B8}','\u{1F4E6}','\u{1F50D}','\u{1F680}',
  '\u{1F4F1}','\u{1F4BB}','\u{1F5C4}','\u{1F4A1}','\u{2699}\uFE0F','\u{1F4C4}','\u{1F4DD}','\u{1F3C6}'
];

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__icons">
        {ICONS.map((ic, i) => (
          <span key={i} className={`hero__icon hero__icon--${(i % 3) + 1}`}
            style={{
              left: `${2 + (i * 3.2) % 94}%`,
              top: `${5 + (i * 11.3) % 82}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${0.9 + (i % 4) * 0.35}rem`,
              opacity: 0.12 + (i % 3) * 0.06
            }}>{ic}</span>
        ))}
      </div>
      <div className="hero__blur hero__blur--1" />
      <div className="hero__blur hero__blur--2" />
      <div className="hero__blur hero__blur--3" />
      <div className="hero__watermark">ZENVEST</div>
      <div className="container hero__content">
        <h1 className="hero__title">
          {t('hero.title')} <span className="hero__highlight">ZENVEST</span>
        </h1>
        <p className="hero__sub">{t('hero.subtitle')}</p>
        <div className="hero__actions">
          <button className="hero__btn hero__btn--primary" onClick={() => navigate('/courses')}>{t('hero.cta')}</button>
          <button className="hero__btn hero__btn--secondary" onClick={() => navigate('/simulator')}>{t('hero.ctaSim')}</button>
        </div>
      </div>
    </section>
  );
}
