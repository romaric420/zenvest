import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import ModuleList from '../../components/ModuleList/ModuleList';
import ModuleContent from '../../components/ModuleContent/ModuleContent';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Footer from '../../components/Footer/Footer';
import './CoursePage.css';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { getProgress, isUnlocked } = useProgress();

  const course = translations.courses?.[courseId];
  const [activeModuleId, setActiveModuleId] = useState(null);

  useEffect(() => {
    if (course && course.modules.length > 0) {
      setActiveModuleId(course.modules[0].id);
    }
  }, [course, courseId]);

  if (!course) {
    return (
      <div className="course-page">
        <p>Course not found.</p>
      </div>
    );
  }

  const activeModule = course.modules.find(m => m.id === activeModuleId);
  const progress = getProgress(course.modules);
  const unlocked = activeModule ? isUnlocked(activeModule.id, course.modules) : false;

  return (
    <div>
      <div className="course-page">
        <div className="course-page__header">
          <div className="course-page__breadcrumb">
            <a onClick={() => navigate('/')}>Home</a>
            <ChevronRight size={14} />
            <span>{course.title}</span>
          </div>
          <h1 className="course-page__title" style={{ color: course.color }}>
            {course.title}
          </h1>
          <p className="course-page__desc">{course.description}</p>
          <div className="course-page__progress">
            <ProgressBar
              percent={progress.percent}
              label={`${progress.done}/${progress.total} modules`}
              variant={courseId === 'trading' ? 'orange' : 'green'}
            />
          </div>
        </div>

        <div className="course-page__layout">
          <aside className="course-page__sidebar">
            <div className="course-page__sidebar-title">Modules</div>
            <ModuleList
              modules={course.modules}
              activeModuleId={activeModuleId}
              onSelect={setActiveModuleId}
            />
          </aside>

          <main className="course-page__main">
            {activeModule && unlocked ? (
              <ModuleContent
                module={activeModule}
                modules={course.modules}
                onNavigate={setActiveModuleId}
              />
            ) : (
              <div className="course-page__locked">
                <div className="course-page__locked-icon">
                  <Lock size={28} />
                </div>
                <p className="course-page__locked-text">
                  {translations.module?.locked || 'Complete the previous module to unlock this one.'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
