import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  TrendingUp, BarChart3, CandlestickChart, LineChart, PieChart,
  Activity, Globe, Wallet, Shield, Landmark, Gem, Layers,
  DollarSign, Percent, ArrowUpRight, ArrowDownRight, Zap, Target
} from 'lucide-react';
import './Hero.css';

const ICONS = [
  { Icon: TrendingUp, size: 38, x: 6, y: 12, delay: 0 },
  { Icon: BarChart3, size: 44, x: 82, y: 8, delay: 0.8 },
  { Icon: CandlestickChart, size: 36, x: 18, y: 65, delay: 1.5 },
  { Icon: LineChart, size: 50, x: 75, y: 60, delay: 2.2 },
  { Icon: PieChart, size: 32, x: 42, y: 80, delay: 3 },
  { Icon: Activity, size: 34, x: 90, y: 35, delay: 0.4 },
  { Icon: Globe, size: 40, x: 3, y: 40, delay: 1.8 },
  { Icon: Wallet, size: 30, x: 55, y: 15, delay: 2.6 },
  { Icon: Shield, size: 28, x: 30, y: 30, delay: 3.4 },
  { Icon: Landmark, size: 36, x: 65, y: 82, delay: 0.6 },
  { Icon: Gem, size: 26, x: 48, y: 45, delay: 1.2 },
  { Icon: Layers, size: 32, x: 12, y: 85, delay: 2.8 },
  { Icon: DollarSign, size: 28, x: 88, y: 72, delay: 1 },
  { Icon: Percent, size: 24, x: 35, y: 55, delay: 3.2 },
  { Icon: ArrowUpRight, size: 22, x: 22, y: 18, delay: 2 },
  { Icon: ArrowDownRight, size: 22, x: 70, y: 28, delay: 2.4 },
  { Icon: Zap, size: 30, x: 58, y: 50, delay: 0.2 },
  { Icon: Target, size: 26, x: 95, y: 55, delay: 1.6 },
];

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__icons-container">
        {ICONS.map(({ Icon, size, x, y, delay }, i) => (
          <div
            key={i}
            className="hero__float-icon"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${8 + (i % 5) * 2}s`,
            }}
          >
            <Icon size={size} strokeWidth={1.2} />
          </div>
        ))}
      </div>
      <div className="hero__blur hero__blur--green" />
      <div className="hero__blur hero__blur--orange" />
      <div className="hero__blur hero__blur--blue" />
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
