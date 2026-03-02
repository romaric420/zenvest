import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

/*
  LOGO: Remplacez le chemin ci-dessous par votre fichier logo.
  Placez votre logo dans le dossier /public (ex: /public/logo.png)
  puis mettez LOGO_SRC = "/logo.png"
*/
const LOGO_SRC = "/logo.png";
const SITE_NAME = "ZENVEST";

export default function Header() {
  const { t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.investing'), path: '/course/investing' },
    { label: t('nav.trading'), path: '/course/trading' },
    { label: t('nav.simulator'), path: '/simulator' },
    { label: t('nav.progress'), path: '/progress' },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo" onClick={() => navigate('/')}>
          {LOGO_SRC ? (
            <img src={LOGO_SRC} alt={SITE_NAME} className="header__logo-img" />
          ) : (
            <div className="header__logo-placeholder">TA</div>
          )}
          <span>{SITE_NAME}</span>
        </div>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`header__nav-link ${location.pathname === item.path ? 'header__nav-link--active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header__actions">
          <button className="header__lang-btn" onClick={toggleLang}>
            {t('nav.language')}
          </button>
          <button className="header__cta" onClick={() => navigate('/course/investing')}>
            {t('nav.cta')}
          </button>
          <button className="header__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
