import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import SimulatorPage from './pages/Simulator/Simulator';

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<Courses />} />
            <Route path="/simulator" element={<SimulatorPage />} />
          </Routes>
        </Router>
      </ProgressProvider>
    </LanguageProvider>
  );
}
