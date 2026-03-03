import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import Footer from '../../components/Footer/Footer';
import { COURSES_DATA } from './courseData';
import './Courses.css';

const COURSE_LIST = [
  { id: 'investing', img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=280&fit=crop&q=80', icon: '\u{1F4C8}' },
  { id: 'trading', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=280&fit=crop&q=80', icon: '\u{1F4CA}' },
  { id: 'fundamental', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=280&fit=crop&q=80', icon: '\u{1F30D}' },
];

export default function Courses() {
  const { courseId } = useParams();
  const { t, lang } = useLanguage();
  const { isUnlocked, unlock, isCompleted, markComplete, canAccess, getProgress, getUserName } = useProgress();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  const tryUnlock = () => {
    const ok = unlock('courses', code);
    if (!ok) { setCodeErr(true); setTimeout(() => setCodeErr(false), 2000); }
  };

  /* No courseId => Show course list */
  if (!courseId) {
    return (
      <div>
        <div className="courses-hdr">
          <div className="container">
            <button className="courses__back" onClick={() => navigate('/')}><ArrowLeft size={18}/> {t('nav.home')}</button>
            <h1 className="courses-hdr__title">{t('course.title')}</h1>
            <p className="courses-hdr__sub">{t('course.subtitle')}</p>
          </div>
        </div>
        <div className="container">
          <div className="courses-list">
            {COURSE_LIST.map((c, i) => {
              const data = COURSES_DATA[c.id];
              const modules = data?.modules || [];
              const prog = getProgress(c.id, modules);
              return (
                <div key={c.id} className="courses-card" onClick={() => navigate(`/courses/${c.id}`)} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="courses-card__img">
                    <img src={c.img} alt="" />
                    <div className="courses-card__badge">{c.icon} {t('course.pack')}</div>
                  </div>
                  <div className="courses-card__body">
                    <h3>{t(`course.${c.id}`)}</h3>
                    <span className="courses-card__author">{getUserName() || 'ZENVEST'}</span>
                    <div className="courses-card__progress">
                      <div className="courses-card__bar"><div className="courses-card__fill" style={{ width: `${prog}%` }} /></div>
                      <span className="courses-card__pct">{prog}%</span>
                    </div>
                    <div className="courses-card__foot">
                      <span><BookOpen size={14}/> {modules.length} {t('course.modules')}</span>
                      <span className="courses-card__open">{t('course.open')} &rarr;</span>
                    </div>
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

  /* courseId present => Module list or content */
  const data = COURSES_DATA[courseId];
  if (!data) return <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>Course not found</div>;
  const modules = data.modules;

  if (activeModule !== null) {
    const mod = modules[activeModule];
    const content = mod?.content?.[lang] || mod?.content?.fr || '';
    return (
      <div>
        <div className="courses-hdr">
          <div className="container">
            <button className="courses__back" onClick={() => setActiveModule(null)}><ArrowLeft size={18}/> {lang === 'fr' ? 'Retour aux modules' : 'Back to modules'}</button>
          </div>
        </div>
        <div className="container">
          <div className="mod-content">
            <h1 className="mod-content__title">{mod.title[lang] || mod.title.fr}</h1>
            <div className="mod-content__body" dangerouslySetInnerHTML={{ __html: content }} />
            {!isCompleted(mod.id) && (
              <button className="mod-content__complete" onClick={() => { markComplete(mod.id); setActiveModule(null); }}>
                <CheckCircle size={18}/> {lang === 'fr' ? 'Marquer comme termine' : 'Mark as complete'}
              </button>
            )}
            {isCompleted(mod.id) && (
              <div className="mod-content__done">
                <CheckCircle size={18}/> {lang === 'fr' ? 'Module termine !' : 'Module completed!'}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* Module List */
  const prog = getProgress(courseId, modules);
  return (
    <div>
      <div className="courses-hdr">
        <div className="container">
          <button className="courses__back" onClick={() => navigate('/courses')}><ArrowLeft size={18}/> {t('course.title')}</button>
          <h1 className="courses-hdr__title">{t(`course.${courseId}`)}</h1>
          <div className="courses-hdr__bar"><div className="courses-hdr__fill" style={{ width: `${prog}%` }} /><span>{prog}%</span></div>
        </div>
      </div>
      <div className="container">
        {/* Unlock Card */}
        {!isUnlocked('courses') && (
          <div className="unlock-card">
            <Lock size={24}/>
            <div>
              <h3>{lang === 'fr' ? 'Contenu verrouille' : 'Content locked'}</h3>
              <p>{lang === 'fr' ? "L'introduction est gratuite. Entrez le code pour debloquer tous les modules." : 'Introduction is free. Enter the code to unlock all modules.'}</p>
            </div>
            <div className="unlock-card__input">
              <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder={t('sim.accessCode')}
                className={codeErr ? 'unlock-card__err' : ''} onKeyDown={e => e.key === 'Enter' && tryUnlock()} />
              <button onClick={tryUnlock}>{t('sim.unlock')}</button>
            </div>
            {codeErr && <span className="unlock-card__msg">{t('sim.wrongCode')}</span>}
          </div>
        )}

        {/* Modules */}
        <div className="mod-list">
          {modules.map((mod, idx) => {
            const accessible = canAccess(courseId, idx, modules);
            const completed = isCompleted(mod.id);
            const free = idx === 0;
            return (
              <div key={mod.id} className={`mod-item ${accessible ? 'mod-item--ok' : 'mod-item--locked'} ${completed ? 'mod-item--done' : ''}`}
                style={{ animationDelay: `${idx * 0.06}s` }}
                onClick={() => accessible && setActiveModule(idx)}>
                <div className="mod-item__num">{String(idx + 1).padStart(2, '0')}</div>
                <div className="mod-item__info">
                  <h4>{mod.title[lang] || mod.title.fr}</h4>
                  {free && !isUnlocked('courses') && <span className="mod-item__badge mod-item__badge--free">{lang === 'fr' ? 'Introduction gratuite' : 'Free introduction'}</span>}
                  {completed && <span className="mod-item__badge mod-item__badge--done"><CheckCircle size={12}/> {lang === 'fr' ? 'Termine' : 'Completed'}</span>}
                  {!accessible && !free && <span className="mod-item__badge mod-item__badge--lock"><Lock size={12}/> {lang === 'fr' ? 'Verrouille' : 'Locked'}</span>}
                </div>
                <div className="mod-item__arrow">{accessible ? '\u2192' : '\u{1F512}'}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
