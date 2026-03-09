import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  TrendingUp, BarChart3, CandlestickChart, LineChart, PieChart,
  Activity, Globe, Wallet, Shield, Landmark, Gem, Layers,
  DollarSign, Percent, ArrowUpRight, ArrowDownRight, Zap, Target,
  Bitcoin, Coins, CircleDollarSign, BarChart2, Signal, Flame,
  Crown, Banknote, BadgeDollarSign, ScatterChart
} from 'lucide-react';
import './Hero.css';

const ICONS = [
  { Icon: TrendingUp, size: 44, x: 4, y: 10, delay: 0 },
  { Icon: BarChart3, size: 52, x: 85, y: 6, delay: 0.7 },
  { Icon: CandlestickChart, size: 40, x: 15, y: 62, delay: 1.4 },
  { Icon: LineChart, size: 56, x: 72, y: 58, delay: 2 },
  { Icon: PieChart, size: 38, x: 40, y: 78, delay: 2.8 },
  { Icon: Activity, size: 42, x: 92, y: 32, delay: 0.3 },
  { Icon: Globe, size: 48, x: 2, y: 42, delay: 1.6 },
  { Icon: Wallet, size: 36, x: 55, y: 12, delay: 2.4 },
  { Icon: Shield, size: 34, x: 28, y: 28, delay: 3.2 },
  { Icon: Landmark, size: 42, x: 62, y: 82, delay: 0.5 },
  { Icon: Gem, size: 32, x: 48, y: 42, delay: 1.1 },
  { Icon: Layers, size: 38, x: 10, y: 86, delay: 2.6 },
  { Icon: DollarSign, size: 34, x: 88, y: 70, delay: 0.9 },
  { Icon: Percent, size: 30, x: 33, y: 52, delay: 3 },
  { Icon: ArrowUpRight, size: 28, x: 20, y: 16, delay: 1.8 },
  { Icon: ArrowDownRight, size: 28, x: 68, y: 25, delay: 2.2 },
  { Icon: Zap, size: 36, x: 56, y: 48, delay: 0.1 },
  { Icon: Target, size: 32, x: 95, y: 52, delay: 1.5 },
  { Icon: Bitcoin, size: 46, x: 78, y: 85, delay: 0.6 },
  { Icon: Coins, size: 38, x: 8, y: 30, delay: 3.4 },
  { Icon: CircleDollarSign, size: 40, x: 52, y: 68, delay: 1.3 },
  { Icon: BarChart2, size: 44, x: 38, y: 8, delay: 2.1 },
  { Icon: Signal, size: 30, x: 82, y: 45, delay: 0.8 },
  { Icon: Flame, size: 32, x: 25, y: 75, delay: 3.6 },
  { Icon: Crown, size: 34, x: 65, y: 38, delay: 1.9 },
  { Icon: Banknote, size: 42, x: 45, y: 22, delay: 2.7 },
  { Icon: BadgeDollarSign, size: 36, x: 90, y: 15, delay: 3.1 },
  { Icon: ScatterChart, size: 40, x: 18, y: 48, delay: 0.4 },
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