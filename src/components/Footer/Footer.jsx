import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <footer className="ftr">
      <div className="ftr__glow" />
      <div className="ftr__inner">
        <div className="ftr__grid">
          <div className="ftr__brand">
            <div className="ftr__logo"><div className="ftr__logo-icon">Z</div><span>ZENVEST</span></div>
            <p className="ftr__desc">{t('footer.desc')}</p>
          </div>
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
        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} ZENVEST. {t('footer.rights')}</span>
          <p className="ftr__disclaimer">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
