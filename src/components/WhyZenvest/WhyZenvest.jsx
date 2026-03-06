import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Layers, PenTool, Target, Trophy } from 'lucide-react';
import './WhyZenvest.css';

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
      {/* BACKGROUND EFFECTS */}
      <div className="why-bg-gradient">
        <div className="blob-pro blob-1"></div>
        <div className="blob-pro blob-2"></div>
      </div>

      <div className="container-pro">
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

        <div className="why-grid-pro">
          {features.map((f, i) => (
            <div
              key={i}
              className="why-card-pro"
              style={{
                '--card-color': f.color,
                '--card-index': i
              }}
            >
              <div className="why-icon-wrap-pro">
                <f.Icon size={28} color={f.color} strokeWidth={2} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}