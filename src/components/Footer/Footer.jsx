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
      <div className="ftr__glow" />
      <div className="ftr__watermark">ZENVEST</div>
      <div className="ftr__inner">
        {/* Logo + desc centered */}
        <div className="ftr__brand">
          <div className="ftr__logo">
            <img src={LOGO_PATH} alt="ZENVEST" className="ftr__logo-img"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
          </div>
          <p className="ftr__desc">{t('footer.desc')}</p>
        </div>

        {/* Links centered in row */}
        <div className="ftr__links">
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
        </div>

        {/* Bottom */}
        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} ZENVEST. {t('footer.rights')}</span>
          <p className="ftr__disclaimer">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
