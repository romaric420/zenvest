# ZENVEST — Plateforme de Formation Boursière & Simulateur de Trading

## 🚀 Installation

```bash
cd trading-academy
npm install
npm start
```

L'app se lance sur `http://localhost:3000`

## 📁 Structure

```
src/
├── components/     (Header, Hero, CourseCard, ModuleList, ModuleContent, ProgressBar, Footer)
├── pages/          (Home, CoursePage, ProgressPage, Simulator)
├── context/        (LanguageContext, ProgressContext)
├── i18n/           (fr.json, en.json)
└── styles/         (index.css)
```

## 🎯 Fonctionnalités

### Formations
- **8 modules Investissement** : Bases, construction portefeuille, gestion active/passive, stratégies, classes d'actifs, ETFs, frais, analyse macro
- **7 modules Trading** : Analyse technique, chandeliers, price action, indicateurs, stratégies, patterns, analyse graphique
- Exercices avec corrections déblocables
- Progression sauvegardée (localStorage)
- Bilingue FR/EN

### Simulateur de Trading
- **600+ cryptomonnaies** Kraken en temps réel (toutes les paires EUR)
- Recherche instantanée d'actifs
- Trades LONG & SHORT avec prix d'entrée auto ou custom
- **Stop Loss & Take Profit** automatiques
- Frais Kraken réalistes (0.16% entrée + 0.16% sortie)
- Calcul P&L net en temps réel
- Répartition du capital avec barres visuelles
- Graphique de performance Chart.js
- Actualités marchés live (Google News RSS)
- Alertes prix personnalisées
- Historique des trades fermés (avec raison: Manual/SL/TP)
- Gestion de compte (modifier capital, reset)
- Persistence localStorage

## 🖼️ Logo

1. Placez votre logo dans `/public/logo.png`
2. Dans `Header.jsx`, modifiez : `const LOGO_SRC = "/logo.png";`
3. Le nom du site est défini par : `const SITE_NAME = "ZENVEST";`

## ⚡ APIs utilisées

- **Kraken Public API** — Prix temps réel (pas de clé requise)
- **rss2json.com** — Conversion flux RSS Google News
- **Chart.js 4.4** — Graphiques (chargé dynamiquement)

## 📱 Responsive

Breakpoints : 1200px, 1024px, 768px, 480px
"# zenvest" 
