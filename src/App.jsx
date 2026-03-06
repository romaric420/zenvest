import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import Header from './components/Header/Header';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import SimulatorPage from './pages/Simulator/Simulator';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <Router>
      <ScrollToTop />
      <WelcomeModal />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<Courses />} />
        <Route path="/simulator" element={<SimulatorPage />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </LanguageProvider>
  );
}
