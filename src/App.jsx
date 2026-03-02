import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import CoursePage from './pages/CoursePage/CoursePage';
import ProgressPage from './pages/ProgressPage/ProgressPage';
import Simulator from './pages/Simulator/Simulator';

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </Router>
      </ProgressProvider>
    </LanguageProvider>
  );
}
