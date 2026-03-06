import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';

export default function HomeGreeting() {
  const { lang } = useLanguage();
  const { getUserName } = useProgress();
  const userName = getUserName();

  if (!userName) return null;

  return (
    <div className="home-greeting">
      <div className="container">
        <span>{lang === 'fr' ? `Bienvenue ${userName}, prêt à apprendre ?` : `Welcome ${userName}, ready to learn?`}</span>
      </div>
    </div>
  );
}
