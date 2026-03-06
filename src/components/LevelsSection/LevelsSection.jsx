import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';
import './LevelsSection.css';

// Tes couleurs exactes
const COLORS = {
  white: '#ffffff',
  greenDark: '#59A52C',
  greenLight: '#6fca3a',
  orangeSoft: '#f79a6b',
  orangeMed: '#F5793B',
  orangeDeep: '#f1580c',
};

const LEVELS = {
  fr: [
    { num: 'NIVEAU 01', color: COLORS.greenDark, accent: COLORS.greenLight, title: 'Débutant', desc: 'Maîtrisez les fondamentaux pour démarrer sereinement et comprendre les mécaniques de marché.', Icon: BookOpen },
    { num: 'NIVEAU 02', color: COLORS.orangeMed, accent: COLORS.orangeSoft, title: 'Intermédiaire', desc: 'Passez à la vitesse supérieure avec des analyses techniques poussées et une gestion de risque stricte.', Icon: BarChart3 },
    { num: 'NIVEAU 03', color: COLORS.orangeDeep, accent: COLORS.orangeMed, title: 'Avancé', desc: 'Opérez comme un pro. Optimisation de portefeuille et psychologie de trading de haut niveau.', Icon: ShieldCheck },
  ],
  en: [
    { num: 'LEVEL 01', color: COLORS.greenDark, accent: COLORS.greenLight, title: 'Beginner', desc: 'Master the fundamentals to start with confidence and understand market mechanics.', Icon: BookOpen },
    { num: 'LEVEL 02', color: COLORS.orangeMed, accent: COLORS.orangeSoft, title: 'Intermediate', desc: 'Step up your game with advanced technical analysis and strict risk management.', Icon: BarChart3 },
    { num: 'LEVEL 03', color: COLORS.orangeDeep, accent: COLORS.orangeMed, title: 'Advanced', desc: 'Operate like a pro. Portfolio optimization and high-level trading psychology.', Icon: ShieldCheck },
  ],
};

export default function LevelsSection() {
  const { lang } = useLanguage();
  const levels = LEVELS[lang] || LEVELS.fr;

  return (
    <section className="levels-section-abyssal">

      {/* 1. BACKGROUND FLUIDE "BLUR BLEU SOMBRE" */}
      <div className="mesh-background">
        <div className="mesh-blob mesh-blue-deep"></div>
        <div className="mesh-blob mesh-green-light"></div>
        <div className="mesh-blob mesh-orange-deep"></div>
        <div className="trading-grid-overlay"></div>
      </div>

      <div className="container-abyssal">
        {/* EN-TÊTE */}
        <div className="section-header">
          <div className="badge-pill">
            <TrendingUp size={14} color={COLORS.orangeSoft} />
            <span style={{ color: COLORS.orangeSoft }}>Progression</span>
          </div>
          <h2 className="sec-title-dark">
            {lang === 'fr' ? "Trois niveaux d'apprentissage" : 'Three learning levels'}
          </h2>
          <p className="sec-sub-dark">
            {lang === 'fr'
              ? "Une architecture pensée pour transformer votre vision des marchés, du premier trade à l'indépendance."
              : 'An architecture designed to transform your market vision, from the first trade to independence.'}
          </p>
        </div>

        {/* GRILLE DE CARTES (Statique sur PC, Carousel sur Mobile) */}
        <div className="levels-grid-dark">
          {levels.map((l, i) => {
            const LIcon = l.Icon;
            return (
              <div
                key={i}
                className="glass-card-dark"
                // L'index permet au CSS de calculer le décalage (0s, 5s, 10s)
                style={{
                  '--theme-color': l.color,
                  '--theme-accent': l.accent,
                  '--card-index': i
                }}
              >
                <div className="glass-card-glare"></div>

                <div className="card-content">
                  <div className="icon-container" style={{ background: `linear-gradient(135deg, ${l.accent}33, ${l.color}11)` }}>
                    <LIcon size={36} color={l.accent} strokeWidth={1.5} />
                  </div>

                  <div className="card-num" style={{ color: l.accent }}>
                    {l.num}
                  </div>

                  <h3>{l.title}</h3>
                  <p>{l.desc}</p>
                </div>

                <div className="card-footer">
                  <span className="discover-text" style={{ color: l.accent }}>
                    {lang === 'fr' ? 'Découvrir' : 'Discover'}
                  </span>
                  <div className="arrow-icon" style={{ backgroundColor: l.color }}>
                    →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION MOBILE (Les 3 points animés) */}
        <div className="mobile-pagination">
          <div className="dot" style={{ '--dot-index': 0 }}></div>
          <div className="dot" style={{ '--dot-index': 1 }}></div>
          <div className="dot" style={{ '--dot-index': 2 }}></div>
        </div>

      </div>
    </section>
  );
}