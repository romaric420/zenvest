# ZENVEST — Plateforme de Formation Trading & Investissement

## Installation

```bash
cd zenvest
npm install
npm start
```

L'app se lance sur `http://localhost:3000`

## Structure

```
src/
├── components/     Header, Hero, CourseCard, Footer
├── pages/          Home, Courses, Simulator
├── context/        LanguageContext, ProgressContext
├── i18n/           fr.json, en.json
└── styles/         index.css (global)
```

## Fonctionnalités

### Navigation
- 3 liens : Accueil, Cours, Simulateur
- Underline animée au hover
- Toggle FR/EN
- Badge version (v1.0)
- Menu mobile plein écran avec animations

### Hero
- Background gradient animé avec shift
- Icônes crypto/trading flottantes en arrière-plan
- 3 blurs animés (vert, orange, bleu)
- Texte gradient sur "with ZENVEST"

### 4 Parcours de Formation
1. **Investissement & Bourse** — 8 modules
2. **Trading & Analyse Technique** — 7 modules
3. **Apprentissage via Simulateur Réel** — Lien vers simulateur
4. **Finance & Macro-économie** — 6 modules

### Système de Verrouillage
- Introduction de chaque cours : accès gratuit
- Code `Zenvest33` pour débloquer les cours
- Progression séquentielle (doit finir un module pour accéder au suivant)
- Sauvegarde localStorage

### Simulateur de Trading — 2 Packs
| Pack | Prix | Code | Fonctionnalités |
|------|------|------|----------------|
| Essentiel | 15€ | `Zenvest15` | 5 cryptos, interface simple |
| Avancé | 30€ | `Zenvest30` | 600+ cryptos, SL/TP, historique, news, alertes |

### Cours enrichis
- Images Unsplash contextuelles
- Encadrés colorés (tips, alertes, données)
- Schémas explicatifs
- Contenu pédagogique professionnel

## Palette de couleurs
- Vert principal : `#59A52C`
- Orange accent : `#F5793B`
- Navy : `#0f172a`
- Font : Plus Jakarta Sans + Space Mono

## APIs
- Kraken Public API (prix live)
- rss2json (news Google RSS)
- Chart.js 4.4 (graphiques)
