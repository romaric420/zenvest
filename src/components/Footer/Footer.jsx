import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LOGO_PATH } from '../../config';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="ftr-midnight">
      {/* Lueur subtile en haut */}
      <div className="ftr__glow" />

      {/* Watermark géant 3D (Taille réduite) */}
      <div className="ftr__watermark">ZENVEST</div>

      <div className="ftr__inner">
        <div className="ftr__grid">
          {/* Colonne Marque (Logo + Desc) */}
          <div className="ftr__brand-col">
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
              {/* Fallback si l'image échoue */}
              <div className="ftr__logo-fallback" style={{ display: 'none' }}>
                <div className="ftr__logo-icon">Z</div>
                <span>ZENVEST</span>
              </div>
            </div>
            <p className="ftr__desc">{t('footer.desc')}</p>
          </div>

          {/* Colonnes Liens */}
          <div className="ftr__links-group">
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
        </div>

        {/* Ligne du bas */}
        <div className="ftr__bottom">
          <div className="ftr__copyright">
            © {new Date().getFullYear()} ZENVEST. {t('footer.rights')}
          </div>
          <p className="ftr__disclaimer">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}