import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <h3>ZENVEST</h3>
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer__col">
          <h4>{t('footer.courses')}</h4>
          <a onClick={() => navigate('/course/investing')}>{t('footer.investing')}</a>
          <a onClick={() => navigate('/course/trading')}>{t('footer.trading')}</a>
        </div>
        <div className="footer__col">
          <h4>{t('footer.resources')}</h4>
          <a href="#">{t('footer.glossary')}</a>
          <a href="#">{t('footer.faq')}</a>
          <a href="#">{t('footer.blog')}</a>
        </div>
        <div className="footer__col">
          <h4>{t('footer.legal')}</h4>
          <a href="#">{t('footer.terms')}</a>
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.disclaimer')}</a>
        </div>
      </div>
      <div className="footer__disclaimer">
        {t('footer.disclaimerText')}
      </div>
      <div className="footer__bottom">
        © {new Date().getFullYear()} ZENVEST. {t('footer.rights')}
      </div>
    </footer>
  );
}
