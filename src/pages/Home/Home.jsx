import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { Layers, PenTool, Target, Trophy, ShieldCheck, BookOpen, BarChart3, Users } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import CourseCard from '../../components/CourseCard/CourseCard';
import Footer from '../../components/Footer/Footer';
import { COURSES_DATA } from '../Courses/courseData';
import './Home.css';

const COURSE_IDS = ['investing', 'trading', 'simulator', 'fundamental'];

const FEATURES = {
  fr: [
    { Icon: Layers, color: '#59A52C', title: 'Progression Guidée', desc: 'Modules débloqués progressivement pour un apprentissage structuré et efficace.' },
    { Icon: PenTool, color: '#F5793B', title: 'Exercices Pratiques', desc: 'Mettez en pratique chaque concept avec des exercices corrigés et cas concrets.' },
    { Icon: Target, color: '#f1580c', title: 'Contenu Expert', desc: "Rédigé par des professionnels avec +10 ans d'expérience sur les marchés." },
    { Icon: Trophy, color: '#6fca3a', title: 'Multi-niveaux', desc: 'Chaque niveau est couvert en profondeur, du débutant au trader confirmé.' },
  ],
  en: [
    { Icon: Layers, color: '#59A52C', title: 'Guided Progression', desc: 'Modules unlocked progressively for structured and effective learning.' },
    { Icon: PenTool, color: '#F5793B', title: 'Practical Exercises', desc: 'Practice each concept with corrected exercises and real case studies.' },
    { Icon: Target, color: '#f1580c', title: 'Expert Content', desc: 'Written by professionals with 10+ years of market experience.' },
    { Icon: Trophy, color: '#6fca3a', title: 'Multi-level', desc: 'Every level covered in depth, from beginner to experienced trader.' },
  ],
};

const LEVELS = {
  fr: [
    { num: '01', color: '#59A52C', title: 'Débutant', desc: 'Les fondamentaux pour démarrer sereinement et comprendre les marchés', Icon: BookOpen },
    { num: '02', color: '#F5793B', title: 'Intermédiaire', desc: 'Approfondissez vos stratégies, analyses techniques et gestion de risques', Icon: BarChart3 },
    { num: '03', color: '#f1580c', title: 'Avancé', desc: 'Techniques professionnelles, gestion avancée et optimisation de portefeuille', Icon: ShieldCheck },
  ],
  en: [
    { num: '01', color: '#59A52C', title: 'Beginner', desc: 'The fundamentals to start with confidence and understand the markets', Icon: BookOpen },
    { num: '02', color: '#F5793B', title: 'Intermediate', desc: 'Deepen your strategies, technical analysis and risk management', Icon: BarChart3 },
    { num: '03', color: '#f1580c', title: 'Advanced', desc: 'Professional techniques, advanced management and portfolio optimization', Icon: ShieldCheck },
  ],
};

const STATS = {
  fr: [
    { value: '+de 4 classes', label: "d'actifs disponibles en simulation", color: '#59A52C' },
    { value: '4', label: 'Parcours complets', color: '#F5793B' },
    { value: '21+', label: 'Modules de formation', color: '#f1580c' },
    { value: '∞', label: 'Pratique illimitée', color: '#6fca3a', fontSize: '5rem' },
  ],
  en: [
    { value: '4+ asset classes', label: 'available in simulation mode', color: '#59A52C' },
    { value: '4', label: 'Complete paths', color: '#F5793B' },
    { value: '21+', label: 'Training modules', color: '#f1580c' },
    { value: '∞', label: 'Unlimited practice', color: '#6fca3a', fontSize: '5rem' },
  ],
};

export default function Home() {
  const { t, lang } = useLanguage();
  const { getUserName } = useProgress();
  const navigate = useNavigate();
  const features = FEATURES[lang] || FEATURES.fr;
  const levels = LEVELS[lang] || LEVELS.fr;
  const stats = STATS[lang] || STATS.fr;
  const userName = getUserName();
  const scrollRef = useRef(null);

  /* Auto-scroll for why-cards on mobile */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0, dir = 1, paused = false, timer;
    const step = () => {
      if (paused || !el) return;
      pos += dir * 0.6;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (pos >= max) { pos = max; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      el.scrollLeft = pos;
    };
    timer = setInterval(step, 30);
    const pause = () => { paused = true; };
    const resume = () => { paused = false; pos = el.scrollLeft; };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('mousedown', pause);
    el.addEventListener('mouseup', resume);
    return () => {
      clearInterval(timer);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('mousedown', pause);
      el.removeEventListener('mouseup', resume);
    };
  }, []);

  return (
    <div>
      <Hero />

      {userName && (
        <div className="home-greeting">
          <div className="container">
            <span>{lang === 'fr' ? `Bienvenue ${userName}, prêt à apprendre ?` : `Welcome ${userName}, ready to learn?`}</span>
          </div>
        </div>
      )}

      {/* ═══ Stats bar ═══ */}
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

      {/* ═══ Pourquoi notre formation ═══ */}
      <section className="why-section">
        <div className="container">
          <h2 className="sec-title">{lang === 'fr' ? 'Pourquoi ZENVEST ?' : 'Why ZENVEST?'}</h2>
          <p className="sec-sub">{lang === 'fr' ? 'Une approche structurée et progressive pour des résultats concrets sur les marchés.' : 'A structured and progressive approach for concrete market results.'}</p>
        </div>
        <div className="why-scroll" ref={scrollRef}>
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

      {/* ═══ Trois niveaux ═══ */}
      <section className="levels-section">
        <div className="container">
          <h2 className="sec-title">{lang === 'fr' ? "Trois niveaux d'apprentissage" : 'Three learning levels'}</h2>
          <p className="sec-sub">{lang === 'fr' ? "Progressez à votre rythme. Chaque niveau vous rapproche de l'expertise." : 'Progress at your own pace. Every level brings you closer to expertise.'}</p>
          <div className="levels-grid">
            {levels.map((l, i) => {
              const LIcon = l.Icon;
              return (
                <div key={i} className="level-card" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="level-card__head">
                    <span className="level-card__num" style={{ color: l.color }}>{l.num}</span>
                    <LIcon size={22} color={l.color} strokeWidth={2} />
                  </div>
                  <h3>{l.title}</h3>
                  <p>{l.desc}</p>
                  <div className="level-card__line" style={{ background: l.color }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Formations ═══ */}
      <section className="home-courses">
        <div className="container">
          <div className="home-courses__header">
            <h2 className="home-courses__title">{t('home.section')}</h2>
            <p className="home-courses__sub">{t('home.sectionSub')}</p>
          </div>
          <div className="home-courses__grid">
            {COURSE_IDS.map((id, i) => (
              <div key={id} className="home-courses__card-wrap" style={{ animationDelay: `${i * 0.12}s` }}>
                <CourseCard
                  courseId={id}
                  modules={COURSES_DATA[id]?.modules || []}
                  onClick={() => {
                    if (id === 'simulator') navigate('/simulator');
                    else navigate(`/courses/${id}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
