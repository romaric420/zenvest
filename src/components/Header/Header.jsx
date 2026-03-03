import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.courses'), path: '/courses' },
    { label: t('nav.simulator'), path: '/simulator' },
  ];

  return (
    <>
      <header className={`hdr ${scrolled ? 'hdr--scrolled' : ''}`}>
        <div className="hdr__inner">
          <div className="hdr__logo" onClick={() => navigate('/')}>
            <div className="hdr__logo-icon">Z</div>
            <span className="hdr__logo-text">ZENVEST</span>
          </div>

          <nav className="hdr__nav">
            {navItems.map(item => (
              <button key={item.path} className={`hdr__link ${location.pathname === item.path ? 'hdr__link--active' : ''}`} onClick={() => navigate(item.path)}>
                {item.label}
                <span className="hdr__link-line" />
              </button>
            ))}
          </nav>

          <div className="hdr__right">
            <span className="hdr__version">{t('nav.version')}</span>
            <div className="hdr__toggle" onClick={toggleLang} title="FR / EN">
              <div className={`hdr__toggle-track ${lang === 'en' ? 'hdr__toggle-track--en' : ''}`}>
                <div className="hdr__toggle-thumb" />
                <span className="hdr__toggle-label hdr__toggle-label--fr">FR</span>
                <span className="hdr__toggle-label hdr__toggle-label--en">EN</span>
              </div>
            </div>
            <button className={`hdr__burger ${mobileOpen ? 'hdr__burger--open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div className={`hdr-mobile ${mobileOpen ? 'hdr-mobile--open' : ''}`}>
        <div className="hdr-mobile__bg" />
        <div className="hdr-mobile__content">
          {navItems.map((item, i) => (
            <button key={item.path} className={`hdr-mobile__link ${location.pathname === item.path ? 'hdr-mobile__link--active' : ''}`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              {item.label}
            </button>
          ))}
          <div className="hdr-mobile__toggle" onClick={toggleLang}>
            <span>{lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
