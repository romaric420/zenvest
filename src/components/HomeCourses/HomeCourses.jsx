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

  // Utilisation d'une référence pour contrôler le chronomètre du défilement
  const timerRef = useRef(null);

  // Fonction pour démarrer le défilement automatique
  const startTimer = () => {
    stopTimer(); // On nettoie l'ancien chrono pour éviter les bugs
    timerRef.current = setInterval(() => {
      if (window.innerWidth <= 1024) {
        setActiveIndex((prev) => (prev === COURSE_IDS.length - 1 ? 0 : prev + 1));
      }
    }, 4000); // Défilement toutes les 4 secondes
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Lance le défilement au chargement
  useEffect(() => {
    startTimer();
    return () => stopTimer(); // Nettoyage quand on quitte la page
  }, []);

  // Quand on clique sur "Suivant"
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === COURSE_IDS.length - 1 ? 0 : prev + 1));
    startTimer(); // Relance le chrono proprement après le clic
  };

  // Quand on clique sur "Précédent"
  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? COURSE_IDS.length - 1 : prev - 1));
    startTimer(); // Relance le chrono proprement après le clic
  };

  // Quand on clique sur un point de pagination
  const goToSlide = (index) => {
    setActiveIndex(index);
    startTimer();
  };

  return (
    <section className="hc-section">
      <style>{`
        .hc-section {
          padding: 80px 24px;
          background: #ffffff;
          overflow: hidden;
        }
        .hc-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .hc-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .hc-title {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }
        .hc-sub {
          font-size: 1.1rem;
          color: #64748b;
        }
        
        /* ═════════ TAILLE FIXE UNIVERSELLE ═════════ */
        .hc-card-inner {
          width: 280px; /* Taille exacte pour PC et Mobile */
          margin: 0 auto;
        }

        /* ═════════ BUREAU (GRAND ÉCRAN) ═════════ */
        .hc-carousel-wrapper {
          width: 100%;
        }
        .hc-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
        }
        .hc-controls {
          display: none; /* Flèches et points cachés sur PC */
        }

        /* ═════════ MOBILE & TABLETTE (CARROUSEL NON-STOP) ═════════ */
        @media (max-width: 1024px) {
          .hc-section {
            padding: 60px 16px;
          }
          
          .hc-carousel-wrapper {
            position: relative;
            overflow: hidden; /* Cache proprement les cartes hors écran */
            padding: 10px 0; /* Espace pour les ombres */
          }

          /* La ligne glissante du carrousel */
          .hc-grid {
            flex-wrap: nowrap;
            justify-content: flex-start;
            gap: 0; 
            /* Transition fluide et douce pour un effet naturel */
            transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
            transform: translateX(calc(-100% * var(--active-index)));
          }

          .hc-card-wrap {
            /* Chaque conteneur prend exactement la largeur de l'écran */
            flex: 0 0 100%;
            min-width: 100%;
            display: flex;
            justify-content: center;
          }

          /* Contrôles: Flèches et Points */
          .hc-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 30px;
          }

          .hc-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #0f172a;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .hc-arrow:active {
            transform: scale(0.9);
            background-color: #e2e8f0;
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
            background-color: #cbd5e1;
            border: none;
            padding: 0;
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            cursor: pointer;
          }

          .hc-dot.active-dot {
            width: 24px;
            border-radius: 4px;
            background-color: #59A52C; /* Couleur d'accentuation ZENVEST */
          }
        }
      `}</style>

      <div className="hc-container">
        <div className="hc-header">
          <h2 className="hc-title">{t('home.section')}</h2>
          <p className="hc-sub">{t('home.sectionSub')}</p>
        </div>

        {/* CONTENEUR DU CARROUSEL / GRILLE */}
        <div className="hc-carousel-wrapper">
          <div
            className="hc-grid"
            style={{ '--active-index': activeIndex }}
          >
            {COURSE_IDS.map((id) => (
              <div key={id} className="hc-card-wrap">
                {/* La carte garde strictement la même taille (280px) partout */}
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

        {/* CONTRÔLES (Visibles uniquement sur mobile grâce au CSS) */}
        <div className="hc-controls">
          <button className="hc-arrow" onClick={prevSlide} aria-label="Précédent">
            <ChevronLeft size={24} />
          </button>

          <div className="hc-pagination">
            {COURSE_IDS.map((_, i) => (
              <button
                key={i}
                className={`hc-dot ${activeIndex === i ? 'active-dot' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`Aller au cours ${i + 1}`}
              />
            ))}
          </div>

          <button className="hc-arrow" onClick={nextSlide} aria-label="Suivant">
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </section>
  );
}