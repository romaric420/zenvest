import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { User } from 'lucide-react';
import { LOGO_PATH } from '../../config';
import './Header.css';

export default function Header() {
  const { t, lang, toggleLang, version } = useLanguage();
  const { getUserName, isRegistered } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
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
  const userName = getUserName();
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header className={`hdr ${scrolled ? 'hdr--scrolled' : ''}`}>
        <div className="hdr__inner">
          <div className="hdr__logo" onClick={() => navigate('/')}>
            <img src={LOGO_PATH} alt="ZENVEST" className="hdr__logo-img"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
            <div className="hdr__logo-fb" style={{ display: 'none' }}>Z</div>
          </div>

          <nav className="hdr__nav">
            {navItems.map(item => (
              <button key={item.path} className={`hdr__link ${isActive(item.path) ? 'hdr__link--active' : ''}`}
                onClick={() => navigate(item.path)}>
                {item.label}
                <span className="hdr__link-line" />
              </button>
            ))}
          </nav>

          <div className="hdr__right">
            {isRegistered() && userName && (
              <div className="hdr__user">
                <div className="hdr__user-av"><User size={13} strokeWidth={2.5} /></div>
                <span className="hdr__user-name">{userName}</span>
              </div>
            )}
            <span className="hdr__ver">{version}</span>
            <div className="hdr__toggle" onClick={toggleLang} title="FR / EN">
              <div className={`hdr__tg-track ${lang === 'en' ? 'hdr__tg-track--en' : ''}`}>
                <div className="hdr__tg-thumb" />
                <span className="hdr__tg-l hdr__tg-l--fr">FR</span>
                <span className="hdr__tg-l hdr__tg-l--en">EN</span>
              </div>
            </div>
            <button className={`hdr__burger ${mobileOpen ? 'hdr__burger--open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div className={`hdr-mob ${mobileOpen ? 'hdr-mob--open' : ''}`}>
        <div className="hdr-mob__bg" />
        <div className="hdr-mob__content">
          {isRegistered() && userName && (
            <div className="hdr-mob__user">
              <div className="hdr-mob__user-av"><User size={20} /></div>
              <span>{lang === 'fr' ? 'Bonjour' : 'Hello'}, <strong>{userName}</strong></span>
            </div>
          )}
          {navItems.map((item, i) => (
            <button key={item.path}
              className={`hdr-mob__link ${isActive(item.path) ? 'hdr-mob__link--act' : ''}`}
              style={{ animationDelay: `${0.08 + i * 0.07}s` }}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              {item.label}
            </button>
          ))}
          <div className="hdr-mob__toggle" onClick={() => { toggleLang(); }}>
            {lang === 'fr' ? 'English' : 'Francais'}
          </div>
          <span className="hdr-mob__ver">{version}</span>
        </div>
      </div>
    </>
  );
}
