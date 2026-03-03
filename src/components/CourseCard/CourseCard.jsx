import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import './CourseCard.css';

const COURSE_IMAGES = {
  investing: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80',
  trading: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop&q=80',
  simulator: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
  fundamental: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80',
};

export default function CourseCard({ courseId, onClick, modules = [] }) {
  const { t } = useLanguage();
  const { getProgress } = useProgress();
  const progress = getProgress(courseId, modules);
  const total = courseId === 'simulator' ? t(`home.courses.${courseId}.modules`) : modules.length;
  const done = modules.filter((_, i) => false).length; // Simplified

  return (
    <div className="cc" onClick={onClick}>
      <div className="cc__img-wrap">
        <img src={COURSE_IMAGES[courseId]} alt="" className="cc__img" loading="lazy" />
        <div className="cc__img-overlay" />
        <span className="cc__badge">📁 {t('home.packLabel')}</span>
      </div>
      <div className="cc__body">
        <h3 className="cc__title">{t(`home.courses.${courseId}.title`)}</h3>
        <p className="cc__author">{t(`home.courses.${courseId}.author`)}</p>
        <div className="cc__progress">
          <div className="cc__progress-bar">
            <div className="cc__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="cc__progress-label">{progress}%</span>
        </div>
        <div className="cc__footer">
          <span className="cc__modules">📄 {typeof total === 'number' ? `0/${total} Formations` : total}</span>
          <button className="cc__open">{t('home.open')} →</button>
        </div>
      </div>
    </div>
  );
}
