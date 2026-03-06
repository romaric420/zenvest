import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Layers, PenTool, Target, Trophy } from 'lucide-react';
import './WhyZenvest.css';

// Palette exacte maintenue
const COLORS = {
  greenDark: '#59A52C',
  orangeMed: '#F5793B',
  orangeDeep: '#f1580c',
  greenLight: '#6fca3a',
};

const FEATURES = {
  fr: [
    { Icon: Layers, color: COLORS.greenDark, title: 'Progression Guidée', desc: 'Modules débloqués progressivement pour un apprentissage structuré et efficace.' },
    { Icon: PenTool, color: COLORS.orangeMed, title: 'Exercices Pratiques', desc: 'Mettez en pratique chaque concept avec des exercices corrigés et cas concrets.' },
    { Icon: Target, color: COLORS.orangeDeep, title: 'Contenu Expert', desc: "Rédigé par des professionnels avec +10 ans d'expérience sur les marchés." },
    { Icon: Trophy, color: COLORS.greenLight, title: 'Multi-niveaux', desc: 'Chaque niveau est couvert en profondeur, du débutant au trader confirmé.' },
  ],
  en: [
    { Icon: Layers, color: COLORS.greenDark, title: 'Guided Progression', desc: 'Modules unlocked progressively for structured and effective learning.' },
    { Icon: PenTool, color: COLORS.orangeMed, title: 'Practical Exercises', desc: 'Practice each concept with corrected exercises and real case studies.' },
    { Icon: Target, color: COLORS.orangeDeep, title: 'Expert Content', desc: 'Written by professionals with 10+ years of market experience.' },
    { Icon: Trophy, color: COLORS.greenLight, title: 'Multi-level', desc: 'Every level covered in depth, from beginner to experienced trader.' },
  ],
};

export default function WhyZenvest() {
  const { lang } = useLanguage();
  const features = FEATURES[lang] || FEATURES.fr;

  return (
    <section className="why-section-pro">
      {/* 1. BACKGROUND DÉGRADÉ COMPLEXE & "CREAMY" */}
      <div className="why-bg-gradient">
        <div className="blob-pro blob-1"></div>
        <div className="blob-pro blob-2"></div>
      </div>

      <div className="container-pro">
        {/* EN-TÊTE */}
        <div className="why-header-pro">
          <h2 className="sec-title-pro">
            {lang === 'fr' ? 'Pourquoi ZENVEST ?' : 'Why ZENVEST?'}
          </h2>
          <p className="sec-sub-pro">
            {lang === 'fr'
              ? 'Une approche structurée et progressive pour des résultats concrets sur les marchés.'
              : 'A structured and progressive approach for concrete market results.'}
          </p>
        </div>

        {/* GRILLE DE 4 BLOCS (Fixe et animée) */}
        <div className="why-grid-pro">
          {features.map((f, i) => {
            const { Icon } = f;
            return (
              <div
                key={i}
                className="why-card-pro"
                // Animation stagger: délai différent pour chaque carte
                style={{ '--card-color': f.color, animationDelay: `${0.2 + i * 0.15}s` }}
              >
                {/* Reflet type miroir/verre */}
                <div className="card-glare-pro"></div>

                <div className="card-content-pro">
                  <div className="why-icon-wrap-pro">
                    {/* strokeWidth fin pour le look pro */}
                    <Icon size={28} color={f.color} strokeWidth={1.5} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>

                {/* Petite ligne de décoration animée au hover */}
                <div className="card-deco-line-pro"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}