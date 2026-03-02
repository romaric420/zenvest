import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, PenTool, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import './ModuleContent.css';

export default function ModuleContent({ module, modules, onNavigate }) {
  const { t } = useLanguage();
  const { isCompleted, completeModule, isUnlocked } = useProgress();
  const [openCorrections, setOpenCorrections] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const currentIdx = modules.findIndex(m => m.id === module.id);
  const prevModule = currentIdx > 0 ? modules[currentIdx - 1] : null;
  const nextModule = currentIdx < modules.length - 1 ? modules[currentIdx + 1] : null;
  const completed = isCompleted(module.id);

  const toggleCorrection = (id) => {
    setOpenCorrections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuizAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    if (!module.quiz) return;
    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    const score = Math.round((correct / module.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 70) {
      completeModule(module.id);
    }
  };

  const handleComplete = () => {
    completeModule(module.id);
  };

  const handleNavigate = (mod) => {
    if (mod && isUnlocked(mod.id, modules)) {
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setOpenCorrections({});
      onNavigate(mod.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="module-content">
      <div className="module-content__header">
        <span className={`module-content__level-badge module-content__level-badge--${module.level}`}>
          {t('module.level')}: {module.level}
        </span>
        <h1 className="module-content__title">{module.title}</h1>
        <p className="module-content__desc">{module.description}</p>
      </div>

      {/* Content sections */}
      {module.content && module.content.map((section, idx) => (
        <div key={idx} className="module-content__section">
          <h2 className="module-content__section-title">{section.title}</h2>
          <div className="module-content__section-body">{section.body}</div>
        </div>
      ))}

      {/* Key Points */}
      {module.keyPoints && module.keyPoints.length > 0 && (
        <div className="module-content__keypoints">
          <h3><Lightbulb size={20} /> {t('module.keyPoints')}</h3>
          <ul>
            {module.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Exercises */}
      {module.exercises && module.exercises.length > 0 && (
        <div className="module-content__exercises">
          <h2 className="module-content__exercises-title">
            <PenTool size={22} /> {t('module.exerciseTitle')}
          </h2>
          {module.exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <div className="exercise-card__question">{exercise.question}</div>
              <button
                className={`exercise-card__toggle ${openCorrections[exercise.id] ? 'exercise-card__toggle--open' : ''}`}
                onClick={() => toggleCorrection(exercise.id)}
              >
                {openCorrections[exercise.id] ? t('module.hideCorrection') : t('module.showCorrection')}
              </button>
              {openCorrections[exercise.id] && (
                <div className="exercise-card__correction">
                  <div className="exercise-card__correction-label">{t('module.correction')}</div>
                  <div className="exercise-card__correction-body">{exercise.correction}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quiz */}
      {module.quiz && module.quiz.length > 0 && (
        <div className="module-content__quiz">
          <h2 className="module-content__quiz-title">
            <BookOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
            {t('module.quizTitle')}
          </h2>
          {module.quiz.map((q, qIdx) => (
            <div key={qIdx} className="quiz-question">
              <div className="quiz-question__text">{qIdx + 1}. {q.question}</div>
              <div className="quiz-question__options">
                {q.options.map((opt, oIdx) => {
                  let cls = 'quiz-option';
                  if (quizAnswers[qIdx] === oIdx) cls += ' quiz-option--selected';
                  if (quizSubmitted) {
                    if (oIdx === q.correct) cls += ' quiz-option--correct';
                    else if (quizAnswers[qIdx] === oIdx && oIdx !== q.correct) cls += ' quiz-option--wrong';
                  }
                  return (
                    <div key={oIdx} className={cls} onClick={() => handleQuizAnswer(qIdx, oIdx)}>
                      <div className="quiz-option__radio" />
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {!quizSubmitted ? (
            <button
              className="quiz-submit"
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < module.quiz.length}
              style={{ opacity: Object.keys(quizAnswers).length < module.quiz.length ? 0.5 : 1 }}
            >
              {t('module.quizSubmit')}
            </button>
          ) : (
            <div className={`quiz-result ${quizScore >= 70 ? 'quiz-result--pass' : 'quiz-result--fail'}`}>
              {t('module.quizScore')}: {quizScore}% — {quizScore >= 70 ? t('module.quizPass') : t('module.quizFail')}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="module-content__nav">
        <div>
          {prevModule && (
            <button className="module-content__nav-btn module-content__nav-btn--prev" onClick={() => handleNavigate(prevModule)}>
              <ChevronLeft size={18} /> {t('module.prevModule')}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {!completed && (
            <button className="module-content__nav-btn module-content__nav-btn--complete" onClick={handleComplete}>
              <CheckCircle size={18} /> {t('module.markComplete')}
            </button>
          )}
          {nextModule && isUnlocked(nextModule.id, modules) && (
            <button className="module-content__nav-btn module-content__nav-btn--next" onClick={() => handleNavigate(nextModule)}>
              {t('module.nextModule')} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
