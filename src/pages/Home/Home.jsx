import React from 'react';
import Hero from '../../components/Hero/Hero';
import HomeGreeting from '../../components/HomeGreeting/HomeGreeting';
import StatsSection from '../../components/StatsSection/StatsSection';
import WhyZenvest from '../../components/WhyZenvest/WhyZenvest';
import LevelsSection from '../../components/LevelsSection/LevelsSection';
import HomeCourses from '../../components/HomeCourses/HomeCourses';
import Footer from '../../components/Footer/Footer';
import './Home.css';

export default function Home() {
  return (
    <div>
      <Hero />
      <HomeGreeting />
      <StatsSection />
      <WhyZenvest />
      <LevelsSection />
      <HomeCourses />
      <Footer />
    </div>
  );
}
