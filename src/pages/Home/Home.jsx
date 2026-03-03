import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { Layers, PenTool, Target, Trophy, TrendingUp, BarChart3, Globe } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const FEATURES = {
  fr: [
    { Icon: Layers, color: '#59A52C', title: 'Progression Guidee', desc: 'Modules debloques progressivement pour un apprentissage structure et coherent.' },
    { Icon: PenTool, color: '#F5793B', title: 'Exercices Pratiques', desc: 'Mettez en pratique chaque concept avec des exercices corriges et des cas reels.' },
    { Icon: Target, color: '#f1580c', title: 'Contenu Expert', desc: "Redige par des professionnels des marches financiers avec +15 ans d'experience." },
    { Icon: Trophy, color: '#6fca3a', title: 'Multi-niveaux', desc: 'Du debutant complet au trader confirme, chaque niveau est couvert en profondeur.' },
  ],
  en: [
    { Icon: Layers, color: '#59A52C', title: 'Guided Progression', desc: 'Modules unlocked progressively for a structured learning path.' },
    { Icon: PenTool, color: '#F5793B', title: 'Practical Exercises', desc: 'Put each concept into practice with corrected exercises and real cases.' },
    { Icon: Target, color: '#f1580c', title: 'Expert Content', desc: 'Written by financial market professionals with 15+ years of experience.' },
    { Icon: Trophy, color: '#6fca3a', title: 'Multi-level', desc: 'From complete beginner to advanced trader, every level is covered in depth.' },
  ],
};

const LEVELS = {
  fr: [
    { num: '01', color: '#59A52C', title: 'Debutant', desc: 'Les fondamentaux pour demarrer sereinement' },
    { num: '02', color: '#F5793B', title: 'Intermediaire', desc: 'Approfondissez vos strategies et analyses' },
    { num: '03', color: '#f1580c', title: 'Avance', desc: 'Techniques professionnelles et gestion avancee' },
  ],
  en: [
    { num: '01', color: '#59A52C', title: 'Beginner', desc: 'The fundamentals to start with confidence' },
    { num: '02', color: '#F5793B', title: 'Intermediate', desc: 'Deepen your strategies and analysis' },
    { num: '03', color: '#f1580c', title: 'Advanced', desc: 'Professional techniques and advanced management' },
  ],
};

const COURSES = {
  fr: [
    { id: 'investing', Icon: TrendingUp, title: 'Investissement & Bourse', desc: "Apprenez les bases de l'investissement : classes d'actifs, ETFs, construction de portefeuille, interets composes et gestion passive. 8 modules complets avec exercices.", modules: 8, img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=280&fit=crop&q=80' },
    { id: 'trading', Icon: BarChart3, title: 'Trading & Analyse Technique', desc: "Maitrisez les chandeliers japonais, le price action, les indicateurs techniques (RSI, MACD, Bollinger), les strategies de trading et la psychologie du trader.", modules: 7, img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=280&fit=crop&q=80' },
    { id: 'fundamental', Icon: Globe, title: 'Finance & Macro-economie', desc: "Comprenez les etats financiers, la politique monetaire, les indicateurs macro (NFP, CPI, PMI), la valorisation d'entreprise et l'impact de la geopolitique.", modules: 6, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=280&fit=crop&q=80' },
  ],
  en: [
    { id: 'investing', Icon: TrendingUp, title: 'Investing & Stock Market', desc: 'Learn investment basics: asset classes, ETFs, portfolio construction, compound interest and passive management. 8 complete modules with exercises.', modules: 8, img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=280&fit=crop&q=80' },
    { id: 'trading', Icon: BarChart3, title: 'Trading & Technical Analysis', desc: 'Master Japanese candlesticks, price action, technical indicators (RSI, MACD, Bollinger), trading strategies and trader psychology.', modules: 7, img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=280&fit=crop&q=80' },
    { id: 'fundamental', Icon: Globe, title: 'Finance & Macroeconomics', desc: 'Understand financial statements, monetary policy, macro indicators (NFP, CPI, PMI), company valuation and geopolitical impact.', modules: 6, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=280&fit=crop&q=80' },
  ],
};

export default function Home() {
  const { lang } = useLanguage();
  const { getUserName } = useProgress();
  const navigate = useNavigate();
  const features = FEATURES[lang] || FEATURES.fr;
  const levels = LEVELS[lang] || LEVELS.fr;
  const courses = COURSES[lang] || COURSES.fr;
  const userName = getUserName();

  return (
    <div>
      <Hero />

      {userName && (
        <div className="home-greeting">
          <div className="container">
            <span>{lang === 'fr' ? `Bienvenue ${userName}, pret a apprendre ?` : `Welcome ${userName}, ready to learn?`}</span>
          </div>
        </div>
      )}

      {/* Why Section */}
      <section className="why-section">
        <div className="container">
          <h2 className="sec-title">{lang === 'fr' ? 'Pourquoi notre formation ?' : 'Why our training?'}</h2>
          <p className="sec-sub">{lang === 'fr' ? 'Une approche structuree et progressive pour des resultats concrets.' : 'A structured and progressive approach for concrete results.'}</p>
        </div>
        <div className="why-scroll">
          <div className="why-scroll__inner">
            {features.map((f, i) => {
              const { Icon } = f;
              return (
                <div key={i} className="why-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="why-card__icon-wrap" style={{ background: `${f.color}12`, border: `2px solid ${f.color}25` }}>
                    <Icon size={24} color={f.color} strokeWidth={2} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="levels-section">
        <div className="container">
          <h2 className="sec-title">{lang === 'fr' ? "Trois niveaux d'expertise" : 'Three expertise levels'}</h2>
          <div className="levels-grid">
            {levels.map((l, i) => (
              <div key={i} className="level-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <span className="level-card__num" style={{ color: l.color }}>{l.num}</span>
                <h3>{l.title}</h3>
                <p>{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="cp-section">
        <div className="container">
          <h2 className="sec-title">{lang === 'fr' ? 'Nos Parcours de Formation' : 'Our Training Paths'}</h2>
          <p className="sec-sub">{lang === 'fr' ? 'Choisissez votre parcours et progressez a votre rythme' : 'Choose your path and progress at your own pace'}</p>
          <div className="cp-grid">
            {courses.map((c, i) => {
              const { Icon } = c;
              return (
                <div key={c.id} className="cp-card" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="cp-card__img"><img src={c.img} alt={c.title} /><div className="cp-card__ov" /></div>
                  <div className="cp-card__body">
                    <div className="cp-card__icon-row"><Icon size={20} color="var(--zv-orange)" strokeWidth={2.5} /><span>{c.modules} modules</span></div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                    <button className="cp-card__btn" onClick={() => navigate(`/courses/${c.id}`)}>
                      {lang === 'fr' ? 'Demarrer le cours' : 'Start course'} <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
