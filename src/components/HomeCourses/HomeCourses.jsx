import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import CourseCard from '../CourseCard/CourseCard';
import { COURSES_DATA } from '../../pages/Courses/courseData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COURSE_IDS = ['investing', 'trading', 'simulator', 'fundamental'];

export default function HomeCourses() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  /* ── Intersection Observer pour l'animation d'entrée ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Auto-scroll mobile ── */
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      if (window.innerWidth <= 1024) {
        setActiveIndex((prev) => (prev === COURSE_IDS.length - 1 ? 0 : prev + 1));
      }
    }, 4500);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === COURSE_IDS.length - 1 ? 0 : prev + 1));
    startTimer();
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? COURSE_IDS.length - 1 : prev - 1));
    startTimer();
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    startTimer();
  };

  return (
    <section className="hc-section" ref={sectionRef}>
      <style>{`
        /* ══════════════════════════════════════════
           BASE & BACKGROUND
        ══════════════════════════════════════════ */
        .hc-section {
          position: relative;
          padding: 100px 24px 110px;
          background: #f8faf6;
          overflow: hidden;
        }

        /* Subtil motif de grille en fond */
        .hc-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(89,165,44,0.045) 1px, transparent 0);
          background-size: 32px 32px;
          pointer-events: none;
        }

        /* Lueur décorative haut-gauche */
        .hc-section::after {
          content: '';
          position: absolute;
          top: -120px;
          left: -120px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(89,165,44,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hc-glow-right {
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(89,165,44,0.06) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        /* ══════════════════════════════════════════
           CONTAINER & HEADER
        ══════════════════════════════════════════ */
        .hc-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hc-header {
          text-align: center;
          margin-bottom: 56px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hc-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hc-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #59A52C;
          background: rgba(89,165,44,0.08);
          padding: 6px 18px;
          border-radius: 100px;
          margin-bottom: 18px;
        }

        .hc-title {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 14px;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .hc-sub {
          font-size: 1.05rem;
          color: #64748b;
          margin: 0;
          max-width: 520px;
          margin-inline: auto;
          line-height: 1.6;
        }

        /* ══════════════════════════════════════════
           GRILLE DESKTOP — Cartes de taille égale
        ══════════════════════════════════════════ */
        .hc-carousel-wrapper {
          width: 100%;
        }

        .hc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .hc-card-wrap {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .hc-card-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Délai d'apparition progressif par carte */
        .hc-card-wrap:nth-child(1) { transition-delay: 0.08s; }
        .hc-card-wrap:nth-child(2) { transition-delay: 0.18s; }
        .hc-card-wrap:nth-child(3) { transition-delay: 0.28s; }
        .hc-card-wrap:nth-child(4) { transition-delay: 0.38s; }

        /* Force les cartes à prendre toute la largeur de la colonne */
        .hc-card-inner {
          width: 100%;
          height: 100%;
        }

        /* S'assure que CourseCard remplit bien son parent */
        .hc-card-inner > * {
          width: 100% !important;
          height: 100% !important;
          display: flex;
          flex-direction: column;
        }

        /* Hover lift sur desktop */
        @media (hover: hover) {
          .hc-card-wrap {
            transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
            border-radius: 16px;
          }
          .hc-card-wrap:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 48px rgba(89,165,44,0.10), 0 4px 12px rgba(0,0,0,0.04);
          }
          .hc-card-wrap.visible:hover {
            transform: translateY(-6px);
          }
        }

        /* Contrôles cachés sur desktop */
        .hc-controls {
          display: none;
        }

        /* ══════════════════════════════════════════
           MOBILE / TABLETTE — Carrousel
        ══════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .hc-section {
            padding: 72px 16px 80px;
          }

          .hc-header {
            margin-bottom: 40px;
          }

          .hc-carousel-wrapper {
            position: relative;
            overflow: hidden;
            padding: 8px 0;
          }

          .hc-grid {
            display: flex;
            flex-wrap: nowrap;
            gap: 0;
            transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
            transform: translateX(calc(-100% * var(--active-index)));
          }

          .hc-card-wrap {
            flex: 0 0 100%;
            min-width: 100%;
            display: flex;
            justify-content: center;
            padding: 0 20px;
            box-sizing: border-box;
          }

          .hc-card-inner {
            width: 100%;
            max-width: 340px;
          }

          /* Sur mobile, pas de hover lift */
          .hc-card-wrap:hover {
            transform: none !important;
            box-shadow: none !important;
          }
          .hc-card-wrap.visible:hover {
            transform: translateY(0) !important;
          }

          /* ── Contrôles ── */
          .hc-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 32px;
          }

          .hc-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            color: #0f172a;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }

          .hc-arrow:active {
            transform: scale(0.92);
            background: #f1f5f9;
          }

          .hc-pagination {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .hc-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #cbd5e1;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .hc-dot.active-dot {
            width: 28px;
            border-radius: 4px;
            background: #59A52C;
          }
        }

        /* ── Tablette intermédiaire ── */
        @media (min-width: 640px) and (max-width: 1024px) {
          .hc-card-inner {
            max-width: 380px;
          }
        }

        /* ── Ajustement 3 colonnes entre 768 et 1024 (optionnel si on veut grille) ── */
      `}</style>

      {/* Lueur décorative bas-droite */}
      <div className="hc-glow-right" />

      <div className="hc-container">
        {/* ── HEADER ── */}
        <div className={`hc-header ${isVisible ? 'visible' : ''}`}>
          <span className="hc-label">{t('home.section') ? 'Formation' : 'Courses'}</span>
          <h2 className="hc-title">{t('home.section')}</h2>
          <p className="hc-sub">{t('home.sectionSub')}</p>
        </div>

        {/* ── CARROUSEL / GRILLE ── */}
        <div className="hc-carousel-wrapper">
          <div className="hc-grid" style={{ '--active-index': activeIndex }}>
            {COURSE_IDS.map((id, index) => (
              <div
                key={id}
                className={`hc-card-wrap ${isVisible ? 'visible' : ''}`}
              >
                <div className="hc-card-inner">
                  <CourseCard
                    courseId={id}
                    modules={COURSES_DATA[id]?.modules || []}
                    onClick={() => {
                      if (id === 'simulator') navigate('/simulator');
                      else navigate(`/courses/${id}`);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTRÔLES MOBILE ── */}
        <div className="hc-controls">
          <button className="hc-arrow" onClick={prevSlide} aria-label="Précédent">
            <ChevronLeft size={22} />
          </button>
          <div className="hc-pagination">
            {COURSE_IDS.map((_, i) => (
              <button
                key={i}
                className={`hc-dot ${activeIndex === i ? 'active-dot' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`Cours ${i + 1}`}
              />
            ))}
          </div>
          <button className="hc-arrow" onClick={nextSlide} aria-label="Suivant">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}