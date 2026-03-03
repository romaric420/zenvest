import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { COURSES_DATA } from './courseData';
import CourseCard from '../../components/CourseCard/CourseCard';
import Footer from '../../components/Footer/Footer';
import './Courses.css';

const COURSE_IDS = ['investing', 'trading', 'fundamental'];

export default function Courses() {
  const { courseId } = useParams();
  const { t, lang } = useLanguage();
  const { isCompleted, markComplete, isUnlocked, unlock, canAccess } = useProgress();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Course list view
  if (!courseId) {
    return (
      <div>
        <div className="courses-hero">
          <div className="courses-hero__bg" />
          <div className="container">
            <button className="courses__back" onClick={() => navigate('/')}><ArrowLeft size={18} /> {t('nav.home')}</button>
            <h1 className="courses-hero__title">{t('home.section')}</h1>
            <p className="courses-hero__sub">{t('home.sectionSub')}</p>
          </div>
        </div>
        <div className="container">
          <div className="courses-grid">
            {COURSE_IDS.map((id, i) => (
              <div key={id} style={{ animationDelay: `${i * 0.1}s` }} className="courses-grid__item">
                <CourseCard courseId={id} modules={COURSES_DATA[id]?.modules || []} onClick={() => navigate(`/courses/${id}`)} />
              </div>
            ))}
            <div className="courses-grid__item" style={{ animationDelay: '0.3s' }}>
              <CourseCard courseId="simulator" modules={[]} onClick={() => navigate('/simulator')} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Single course view
  const course = COURSES_DATA[courseId];
  if (!course || !course.modules?.length) {
    return <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}><h2>Course not found</h2><button onClick={() => navigate('/courses')}>← Back</button></div>;
  }

  const modules = course.modules;
  const unlocked = isUnlocked('courses');

  const handleUnlock = () => {
    const ok = unlock('courses', code);
    if (!ok) { setCodeError(true); setTimeout(() => setCodeError(false), 2000); }
  };

  // Module content view
  if (activeModule !== null) {
    const mod = modules[activeModule];
    const modId = `${courseId}-${mod.id}`;
    const completed = isCompleted(modId);
    const hasNext = activeModule < modules.length - 1;
    const hasPrev = activeModule > 0;
    const content = mod.content?.[lang] || mod.content?.fr || '';

    return (
      <div>
        <div className="mod-header">
          <div className="container">
            <button className="courses__back" onClick={() => setActiveModule(null)}><ArrowLeft size={18} /> {t(`home.courses.${courseId}.title`)}</button>
            <h1 className="mod-header__title">{mod.title[lang] || mod.title.fr}</h1>
            {completed && <span className="mod-header__done"><CheckCircle size={16} /> {t('course.completed')}</span>}
          </div>
        </div>
        <div className="container">
          <div className="mod-content" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="mod-actions">
            {hasPrev && <button className="mod-btn mod-btn--ghost" onClick={() => setActiveModule(activeModule - 1)}><ChevronLeft size={18} /> {t('course.prev')}</button>}
            {!completed && <button className="mod-btn mod-btn--primary" onClick={() => markComplete(modId)}><CheckCircle size={18} /> {t('course.markDone')}</button>}
            {hasNext && canAccess(courseId, activeModule + 1, modules) && (
              <button className="mod-btn mod-btn--next" onClick={() => setActiveModule(activeModule + 1)}>{t('course.next')} <ChevronRight size={18} /></button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Module list view
  return (
    <div>
      <div className="courses-hero courses-hero--compact">
        <div className="courses-hero__bg" />
        <div className="container">
          <button className="courses__back" onClick={() => navigate('/courses')}><ArrowLeft size={18} /> {t('nav.courses')}</button>
          <h1 className="courses-hero__title">{t(`home.courses.${courseId}.title`)}</h1>
          <p className="courses-hero__sub">{t(`home.courses.${courseId}.desc`)}</p>
        </div>
      </div>
      <div className="container">
        {/* Unlock card */}
        {!unlocked && (
          <div className="unlock-card">
            <div className="unlock-card__icon"><Lock size={28} /></div>
            <h3>{t('course.unlockTitle')}</h3>
            <p>{t('course.unlockDesc')}</p>
            <div className="unlock-card__form">
              <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder={t('course.unlockPlaceholder')}
                className={`unlock-card__input ${codeError ? 'unlock-card__input--error' : ''}`}
                onKeyDown={e => e.key === 'Enter' && handleUnlock()} />
              <button className="unlock-card__btn" onClick={handleUnlock}>{t('course.unlockBtn')}</button>
            </div>
            {codeError && <span className="unlock-card__error">{t('course.unlockError')}</span>}
          </div>
        )}

        {/* Module list */}
        <div className="modules-list">
          {modules.map((mod, i) => {
            const modId = `${courseId}-${mod.id}`;
            const done = isCompleted(modId);
            const accessible = i === 0 || (unlocked && canAccess(courseId, i, modules));
            const isFreeIntro = i === 0;

            return (
              <div key={mod.id} className={`module-item ${done ? 'module-item--done' : ''} ${!accessible ? 'module-item--locked' : ''}`}
                onClick={() => accessible && setActiveModule(i)} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="module-item__num">{String(i + 1).padStart(2, '0')}</div>
                <div className="module-item__info">
                  <h4>{mod.title[lang] || mod.title.fr}</h4>
                  {isFreeIntro && <span className="module-item__free">{t('course.introFree')}</span>}
                  {!accessible && !isFreeIntro && <span className="module-item__locked-text">{!unlocked ? t('course.locked') : t('course.mustComplete')}</span>}
                </div>
                <div className="module-item__status">
                  {done ? <CheckCircle size={20} className="module-item__check" /> :
                    !accessible ? <Lock size={18} className="module-item__lock" /> :
                    <ChevronRight size={20} className="module-item__arrow" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
