import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LOGO_PATH } from '../../config';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="ftr">
      {/* Watermark ZENVEST — lettres découpées en fond */}
      <div className="ftr__watermark" aria-hidden="true">
        {'ZENVEST'.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>{ch}</span>
        ))}
      </div>

      {/* Ligne décorative en haut */}
      <div className="ftr__topline">
        <div className="ftr__topline-fill" />
      </div>

      <div className="ftr__inner">
        {/* ROW PRINCIPALE — tout sur une ligne */}
        <div className="ftr__row">
          {/* Logo + Desc */}
          <div className="ftr__brand">
            <div className="ftr__logo">
              <img
                src={LOGO_PATH}
                alt="ZENVEST"
                className="ftr__logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="ftr__logo-fallback" style={{ display: 'none' }}>
                <div className="ftr__logo-icon">Z</div>
                <span>ZENVEST</span>
              </div>
            </div>
            <p className="ftr__desc">{t('footer.desc')}</p>
          </div>

          {/* Liens — groupés horizontalement */}
          <nav className="ftr__nav">
            <div className="ftr__col">
              <h4>{t('footer.formation')}</h4>
              <a onClick={() => navigate('/courses')}>{t('footer.investing')}</a>
              <a onClick={() => navigate('/courses')}>{t('footer.trading')}</a>
              <a onClick={() => navigate('/courses')}>{t('footer.fundamental')}</a>
            </div>
            <div className="ftr__col">
              <h4>{t('footer.tools')}</h4>
              <a onClick={() => navigate('/simulator')}>{t('footer.simBasic')}</a>
              <a onClick={() => navigate('/simulator')}>{t('footer.simAdvanced')}</a>
            </div>
            <div className="ftr__col">
              <h4>{t('footer.legal')}</h4>
              <a href="#">{t('footer.cgu')}</a>
              <a href="#">{t('footer.privacy')}</a>
            </div>
          </nav>
        </div>

        {/* BOTTOM BAR */}
        <div className="ftr__bottom">
          <span className="ftr__copy">© {new Date().getFullYear()} ZENVEST. {t('footer.rights')}</span>
          <span className="ftr__disc">{t('footer.disclaimer')}</span>
        </div>
      </div>
    </footer>
  );
}