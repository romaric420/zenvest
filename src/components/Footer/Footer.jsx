import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { lang } = useLanguage();
  return (
    <footer className="ftr">
      <div className="ftr__watermark">ZENVEST</div>
      <div className="ftr__glow" />
      <div className="container ftr__inner">
        <div className="ftr__grid">
          <div className="ftr__brand">
            <div className="ftr__logo"><span className="ftr__logo-icon">Z</span> ZENVEST</div>
            <p className="ftr__tagline">{lang === 'fr' ? 'Formez-vous. Investissez. Evoluez.' : 'Learn. Invest. Evolve.'}</p>
          </div>
          <div className="ftr__col">
            <h4>{lang === 'fr' ? 'Formation' : 'Training'}</h4>
            <a href="/courses/investing">{lang === 'fr' ? 'Investissement' : 'Investing'}</a>
            <a href="/courses/trading">Trading</a>
            <a href="/courses/fundamental">{lang === 'fr' ? 'Macro-economie' : 'Macroeconomics'}</a>
          </div>
          <div className="ftr__col">
            <h4>{lang === 'fr' ? 'Outils' : 'Tools'}</h4>
            <a href="/simulator">{lang === 'fr' ? 'Simulateur Simple' : 'Basic Simulator'}</a>
            <a href="/simulator">{lang === 'fr' ? 'Simulateur Avance' : 'Advanced Simulator'}</a>
          </div>
          <div className="ftr__col">
            <h4>{lang === 'fr' ? 'Legal' : 'Legal'}</h4>
            <a href="#">{lang === 'fr' ? 'Conditions' : 'Terms'}</a>
            <a href="#">{lang === 'fr' ? 'Confidentialite' : 'Privacy'}</a>
          </div>
        </div>
        <div className="ftr__disclaimer">
          {lang === 'fr'
            ? 'Le trading comporte des risques de perte en capital. Les performances passees ne garantissent pas les resultats futurs. ZENVEST est une plateforme educative et ne fournit pas de conseils financiers.'
            : 'Trading involves risk of capital loss. Past performance does not guarantee future results. ZENVEST is an educational platform and does not provide financial advice.'}
        </div>
        <div className="ftr__bottom">
          <span>&copy; {new Date().getFullYear()} ZENVEST. {lang === 'fr' ? 'Tous droits reserves.' : 'All rights reserved.'}</span>
        </div>
      </div>
    </footer>
  );
}
