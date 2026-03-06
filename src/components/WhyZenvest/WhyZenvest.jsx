import React, { useState, useEffect, useRef } from 'react';
// Assure-toi que le chemin vers ton contexte est correct
import { useLanguage } from '../../context/LanguageContext';
import { TrendingUp, ClipboardCheck, GraduationCap, Network } from 'lucide-react';
import './WhyZenvest.css';

const FEATURES = {
  fr: [
    {
      Icon: TrendingUp,
      colorFrom: '#10b981', colorTo: '#059669', shadow: 'rgba(16, 185, 129, 0.4)',
      title: 'Progression Guidée',
      desc: 'Une approche structurée et progressive pour des résultats concrets sur les marchés.'
    },
    {
      Icon: ClipboardCheck,
      colorFrom: '#6366f1', colorTo: '#4f46e5', shadow: 'rgba(99, 102, 241, 0.4)',
      title: 'Exercices Pratiques',
      desc: 'Des exercices structurés et progressifs pour des résultats concrets sur les marchés.'
    },
    {
      Icon: GraduationCap,
      colorFrom: '#ef4444', colorTo: '#dc2626', shadow: 'rgba(239, 68, 68, 0.4)',
      title: 'Contenu Expert',
      desc: 'Rédigé par des professionnels pour des résultats concrets et des comparaisons précises.'
    },
    {
      Icon: Network,
      colorFrom: '#f59e0b', colorTo: '#d97706', shadow: 'rgba(245, 158, 11, 0.4)',
      title: 'Multi-niveaux',
      desc: 'Une approche adaptée à tous, du débutant au trader confirmé, pour des résultats optimaux.'
    },
  ],
  en: [
    {
      Icon: TrendingUp,
      colorFrom: '#10b981', colorTo: '#059669', shadow: 'rgba(16, 185, 129, 0.4)',
      title: 'Guided Progression',
      desc: 'A structured and progressive approach for concrete market results.'
    },
    {
      Icon: ClipboardCheck,
      colorFrom: '#6366f1', colorTo: '#4f46e5', shadow: 'rgba(99, 102, 241, 0.4)',
      title: 'Practical Exercises',
      desc: 'Structured and progressive exercises for concrete market results.'
    },
    {
      Icon: GraduationCap,
      colorFrom: '#ef4444', colorTo: '#dc2626', shadow: 'rgba(239, 68, 68, 0.4)',
      title: 'Expert Content',
      desc: 'Written by professionals for concrete results and precise comparisons.'
    },
    {
      Icon: Network,
      colorFrom: '#f59e0b', colorTo: '#d97706', shadow: 'rgba(245, 158, 11, 0.4)',
      title: 'Multi-level',
      desc: 'An approach adapted to everyone, from beginner to experienced trader.'
    },
  ],
};

export default function WhyZenvest() {
  const { lang } = useLanguage();
  const features = FEATURES[lang] || FEATURES.fr;

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-slide pour mobile
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth <= 1024) {
        setActiveIndex((current) => (current + 1) % features.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Gestion du swipe tactile (Mobile)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    }
  };

  return (
    <section className="zen-section-wrapper">
      {/* Arrière-plan flou décoratif */}
      <div className="zen-bg-blur">
        <div className="zen-blob zen-blob-1"></div>
        <div className="zen-blob zen-blob-2"></div>
      </div>

      <div className="zen-container">
        <div className="zen-header">
          <h2 className="zen-title">
            {lang === 'fr' ? 'Pourquoi ZENVEST ?' : 'Why ZENVEST?'}
          </h2>
          <p className="zen-subtitle">
            {lang === 'fr'
              ? 'Une approche structurée et progressive pour des résultats concrets sur les marchés.'
              : 'A structured and progressive approach for concrete market results.'}
          </p>
        </div>

        {/* Vue du carrousel avec gestion tactile */}
        <div
          className="zen-carousel-viewport"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndHandler}
        >
          <div
            className="zen-track"
            style={{ '--active-index': activeIndex }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className={`zen-card ${activeIndex === i ? 'is-active' : ''}`}
                style={{ '--card-delay': `${i * 0.15}s` }}
              >
                {/* Icône avec effet 3D / Premium Logo */}
                <div
                  className="zen-icon-3d"
                  style={{
                    '--color-from': f.colorFrom,
                    '--color-to': f.colorTo,
                    '--color-shadow': f.shadow
                  }}
                >
                  <f.Icon size={32} color="#ffffff" strokeWidth={2} />
                </div>

                <h3 className="zen-card-title">{f.title}</h3>
                <p className="zen-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Points de pagination (Mobile uniquement) */}
        <div className="zen-pagination">
          {features.map((_, i) => (
            <button
              key={i}
              className={`zen-dot ${activeIndex === i ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Aller au bloc ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}