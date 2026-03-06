import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import CourseCard from '../CourseCard/CourseCard';
import { COURSES_DATA } from '../../pages/Courses/courseData';

const COURSE_IDS = ['investing', 'trading', 'simulator', 'fundamental'];

export default function HomeCourses() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
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
  );
}
