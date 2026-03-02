import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Footer from '../../components/Footer/Footer';
import './ProgressPage.css';

export default function ProgressPage() {
  const { t, translations } = useLanguage();
  const { getProgress, resetProgress } = useProgress();

  const courses = translations.courses;
  const investProgress = getProgress(courses.investing.modules);
  const tradingProgress = getProgress(courses.trading.modules);
  const totalModules = courses.investing.modules.length + courses.trading.modules.length;
  const totalDone = investProgress.done + tradingProgress.done;
  const totalPercent = Math.round((totalDone / totalModules) * 100);

  const handleReset = () => {
    if (window.confirm('Reset all progress?')) {
      resetProgress();
    }
  };

  return (
    <div>
      <div className="progress-page">
        <h1 className="progress-page__title">{t('progress.title')}</h1>

        <div className="progress-page__section">
          <div className="progress-page__section-title">
            {t('progress.overall')}
          </div>
          <ProgressBar percent={totalPercent} label={`${totalDone}/${totalModules}`} />
          <div className="progress-page__stats">
            <div className="progress-page__stat">
              <div className="progress-page__stat-value">{totalDone}</div>
              <div className="progress-page__stat-label">{t('progress.completed')}</div>
            </div>
            <div className="progress-page__stat">
              <div className="progress-page__stat-value" style={{ color: 'var(--color-text-muted)' }}>
                {totalModules - totalDone}
              </div>
              <div className="progress-page__stat-label">{t('progress.remaining')}</div>
            </div>
          </div>
        </div>

        <div className="progress-page__section">
          <div className="progress-page__section-title">
            <span className="dot" style={{ background: courses.investing.color }}></span>
            {t('progress.investing')}
          </div>
          <ProgressBar
            percent={investProgress.percent}
            label={`${investProgress.done}/${investProgress.total} modules`}
          />
        </div>

        <div className="progress-page__section">
          <div className="progress-page__section-title">
            <span className="dot" style={{ background: courses.trading.color }}></span>
            {t('progress.trading')}
          </div>
          <ProgressBar
            percent={tradingProgress.percent}
            label={`${tradingProgress.done}/${tradingProgress.total} modules`}
            variant="orange"
          />
        </div>

        <button className="progress-page__reset" onClick={handleReset}>
          <RotateCcw size={16} /> {t('progress.reset')}
        </button>
      </div>
      <Footer />
    </div>
  );
}
