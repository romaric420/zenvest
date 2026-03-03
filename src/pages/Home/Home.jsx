import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Hero from '../../components/Hero/Hero';
import CourseCard from '../../components/CourseCard/CourseCard';
import Footer from '../../components/Footer/Footer';
import { COURSES_DATA } from '../Courses/courseData';
import './Home.css';

const COURSE_IDS = ['investing', 'trading', 'simulator', 'fundamental'];

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div>
      <Hero />
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
      <Footer />
    </div>
  );
}
