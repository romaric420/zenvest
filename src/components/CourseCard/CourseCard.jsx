import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import './CourseCard.css';

const icons = { TrendingUp, BarChart3 };

export default function CourseCard({ course }) {
  const { t } = useLanguage();
  const { getProgress } = useProgress();
  const navigate = useNavigate();
  const progress = getProgress(course.modules);
  const Icon = icons[course.icon] || TrendingUp;

  const exerciseCount = course.modules.reduce((sum, m) => sum + (m.exercises?.length || 0), 0);

  return (
    <div
      className="course-card"
      style={{ '--card-color': course.color }}
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <div className="course-card__icon" style={{ background: course.color }}>
        <Icon size={28} />
      </div>
      <h3 className="course-card__title">{course.title}</h3>
      <p className="course-card__desc">{course.description}</p>

      <div className="course-card__meta">
        <span className="course-card__meta-item">
          <strong>{course.modules.length}</strong> {t('courseCard.modules')}
        </span>
        <span className="course-card__meta-item">
          <strong>{exerciseCount}</strong> {t('courseCard.exercises')}
        </span>
      </div>

      {progress.percent > 0 && (
        <div className="course-card__progress">
          <div className="course-card__progress-bar">
            <div
              className="course-card__progress-fill"
              style={{ width: `${progress.percent}%`, background: course.color }}
            />
          </div>
          <span className="course-card__progress-text">{progress.percent}%</span>
        </div>
      )}

      <button className="course-card__btn" style={{ background: course.color }}>
        {progress.percent === 100 ? t('courseCard.completed') : progress.percent > 0 ? t('courseCard.continue') : t('courseCard.start')}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
