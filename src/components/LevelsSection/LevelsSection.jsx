import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';
import './LevelsSection.css';

const COLORS = {
  greenDark: '#59A52C',
  greenLight: '#6fca3a',
  orangeSoft: '#f79a6b',
  orangeMed: '#F5793B',
  orangeDeep: '#f1580c',
};

const LEVELS = {
  fr: [
    { num: '01', label: 'NIVEAU', color: COLORS.greenDark, accent: COLORS.greenLight, title: 'Débutant', desc: 'Maîtrisez les fondamentaux pour démarrer sereinement et comprendre les mécaniques de marché.', Icon: BookOpen },
    { num: '02', label: 'NIVEAU', color: COLORS.orangeMed, accent: COLORS.orangeSoft, title: 'Intermédiaire', desc: 'Passez à la vitesse supérieure avec des analyses techniques poussées et une gestion de risque stricte.', Icon: BarChart3 },
    { num: '03', label: 'NIVEAU', color: COLORS.orangeDeep, accent: COLORS.orangeMed, title: 'Avancé', desc: 'Opérez comme un pro. Optimisation de portefeuille et psychologie de trading de haut niveau.', Icon: ShieldCheck },
  ],
  en: [
    { num: '01', label: 'LEVEL', color: COLORS.greenDark, accent: COLORS.greenLight, title: 'Beginner', desc: 'Master the fundamentals to start with confidence and understand market mechanics.', Icon: BookOpen },
    { num: '02', label: 'LEVEL', color: COLORS.orangeMed, accent: COLORS.orangeSoft, title: 'Intermediate', desc: 'Step up your game with advanced technical analysis and strict risk management.', Icon: BarChart3 },
    { num: '03', label: 'LEVEL', color: COLORS.orangeDeep, accent: COLORS.orangeMed, title: 'Advanced', desc: 'Operate like a pro. Portfolio optimization and high-level trading psychology.', Icon: ShieldCheck },
  ],
};

export default function LevelsSection() {
  const { lang } = useLanguage();
  const levels = LEVELS[lang] || LEVELS.fr;
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeMobile, setActiveMobile] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-rotate mobile
  useEffect(() => {
    if (window.innerWidth > 768) return;
    const timer = setInterval(() => {
      setActiveMobile((p) => (p + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="lvl-section" ref={sectionRef}>
      {/* ══ BACKGROUND LAYERS ══ */}
      <div className="lvl-bg">
        {/* Orbes colorées floues */}
        <div className="lvl-orb lvl-orb--green" />
        <div className="lvl-orb lvl-orb--orange" />
        <div className="lvl-orb lvl-orb--blue" />

        {/* Grille de trading stylisée */}
        <div className="lvl-grid-pattern" />

        {/* Lignes de chandelier décoratives */}
        <svg className="lvl-candles-deco" viewBox="0 0 1400 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Ligne de tendance ascendante */}
          <path d="M0 500 Q200 480 400 420 T800 300 T1200 180 T1400 120" stroke="rgba(89,165,44,0.08)" strokeWidth="2" fill="none" />
          <path d="M0 520 Q250 500 500 440 T900 320 T1300 200 T1400 160" stroke="rgba(245,121,59,0.06)" strokeWidth="1.5" fill="none" />
          {/* Chandeliers abstraits */}
          {[120, 260, 400, 540, 680, 820, 960, 1100, 1240].map((x, i) => (
            <g key={i} opacity={0.06 + (i % 3) * 0.02}>
              <line x1={x} y1={300 - i * 18} x2={x} y2={380 - i * 15} stroke={i % 2 === 0 ? '#59A52C' : '#F5793B'} strokeWidth="1.5" />
              <rect x={x - 6} y={320 - i * 17} width="12" height={30 + (i % 4) * 8} rx="2" fill={i % 2 === 0 ? 'rgba(89,165,44,0.08)' : 'rgba(245,121,59,0.06)'} />
            </g>
          ))}
        </svg>

        {/* Cercles concentriques décoratifs */}
        <div className="lvl-rings lvl-rings--left" />
        <div className="lvl-rings lvl-rings--right" />

        {/* Noise texture overlay */}
        <div className="lvl-noise" />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="lvl-container">
        <div className={`lvl-header ${visible ? 'is-visible' : ''}`}>
          <div className="lvl-badge">
            <TrendingUp size={14} />
            <span>Progression</span>
          </div>
          <h2 className="lvl-title">
            {lang === 'fr' ? "Trois niveaux d'apprentissage" : 'Three learning levels'}
          </h2>
          <p className="lvl-subtitle">
            {lang === 'fr'
              ? "Une architecture pensée pour transformer votre vision des marchés, du premier trade à l'indépendance."
              : 'An architecture designed to transform your market vision, from the first trade to independence.'}
          </p>
        </div>

        {/* ── CARDS ── */}
        <div className="lvl-cards">
          {levels.map((l, i) => {
            const LIcon = l.Icon;
            return (
              <div
                key={i}
                className={`lvl-card ${visible ? 'is-visible' : ''} ${activeMobile === i ? 'mob-active' : ''}`}
                style={{
                  '--card-color': l.color,
                  '--card-accent': l.accent,
                  '--delay': `${i * 0.15}s`,
                }}
              >
                {/* Bord lumineux subtil en haut */}
                <div className="lvl-card-edge" />

                {/* Numéro large en arrière-plan */}
                <span className="lvl-card-bignum">{l.num}</span>

                <div className="lvl-card-body">
                  <div className="lvl-card-icon">
                    <LIcon size={28} strokeWidth={1.8} />
                  </div>

                  <span className="lvl-card-label">{l.label} {l.num}</span>
                  <h3 className="lvl-card-title">{l.title}</h3>
                  <p className="lvl-card-desc">{l.desc}</p>

                  {/* Barre de progression décorative */}
                  <div className="lvl-card-progress">
                    <div className="lvl-card-progress-fill" style={{ width: `${33 * (i + 1)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MOBILE DOTS ── */}
        <div className="lvl-dots">
          {levels.map((_, i) => (
            <button
              key={i}
              className={`lvl-dot ${activeMobile === i ? 'active' : ''}`}
              onClick={() => setActiveMobile(i)}
              aria-label={`Niveau ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}