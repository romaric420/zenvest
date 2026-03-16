import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  TrendingUp, CandlestickChart, LineChart, Globe,
  Bitcoin, Banknote, BarChart3, Gem, Landmark, Activity
} from 'lucide-react';
import './Hero.css';

// 10 icônes espacées, grandes et visibles
const ICONS = [
  { Icon: TrendingUp,       size: 72, x: 3,  y: 8,  delay: 0 },
  { Icon: Bitcoin,          size: 80, x: 88, y: 5,  delay: 0.6 },
  { Icon: CandlestickChart, size: 68, x: 5,  y: 58, delay: 1.4 },
  { Icon: Globe,            size: 76, x: 84, y: 55, delay: 2 },
  { Icon: LineChart,        size: 72, x: 44, y: 80, delay: 2.8 },
  { Icon: Banknote,         size: 68, x: 90, y: 28, delay: 0.3 },
  { Icon: BarChart3,        size: 76, x: 2,  y: 30, delay: 1.6 },
  { Icon: Gem,              size: 64, x: 70, y: 82, delay: 1.1 },
  { Icon: Landmark,         size: 72, x: 68, y: 18, delay: 0.9 },
  { Icon: Activity,         size: 68, x: 22, y: 78, delay: 2.4 },
];

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__icons-container">
        {ICONS.map(({ Icon, size, x, y, delay }, i) => (
          <Icon
            key={i}
            className="hero__icon-svg"
            size={size}
            strokeWidth={1}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      <div className="hero__blur hero__blur--green" />
      <div className="hero__blur hero__blur--orange" />
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