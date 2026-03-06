import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './StatsSection.css';

const STATS = {
  fr: [
    { value: '+de 4', label: "classes d'actifs en simulation", color: '#59A52C' },
    { value: '4', label: 'Parcours complets', color: '#F5793B' },
    { value: '21+', label: 'Modules de formation', color: '#f1580c' },
    { value: '∞', label: 'Pratique illimitée', color: '#6fca3a' },
  ],
  en: [
    { value: '4+', label: 'Asset classes in simulation mode', color: '#59A52C' },
    { value: '4', label: 'Complete paths', color: '#F5793B' },
    { value: '21+', label: 'Training modules', color: '#f1580c' },
    { value: '∞', label: 'Unlimited practice', color: '#6fca3a' },
  ],
};

export default function StatsSection() {
  const { lang } = useLanguage();
  const stats = STATS[lang] || STATS.fr;

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-item__value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-item__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
