import React, { useState, useMemo } from 'react';

/* ═══ DONNÉES CALENDRIER 2026 ═══ */
const EVENTS_2026 = [
  // JANVIER
  { date: '2026-01-02', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-01-08', title: 'ADP Employment (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-01-09', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-01-14', title: 'Inflation CPI (USA) — Données Déc.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-01-15', title: 'PPI — Prix Producteurs (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-01-22', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-01-28', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-01-29', title: 'PIB USA — T4 2025 (1ère estimation)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // FÉVRIER
  { date: '2026-02-02', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-02-05', title: 'BoE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-02-06', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-02-11', title: 'Inflation CPI (USA) — Données Jan.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-02-12', title: 'PPI — Prix Producteurs (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-02-18', title: 'Début saison résultats T4 (USA)', cat: 'earnings', impact: 'high', tag: '#EARNINGS' },
  // MARS
  { date: '2026-03-02', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-03-06', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-03-11', title: 'Inflation CPI (USA) — Données Fév.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-03-12', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-03-18', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-03-19', title: 'BoJ : Décision sur les taux', cat: 'bank', impact: 'medium', tag: '#BANK' },
  { date: '2026-03-20', title: 'Les 4 Sorcières — Expiration contrats', cat: 'stock', impact: 'high', tag: '#STOCK' },
  { date: '2026-03-25', title: 'Stocks de Pétrole brut (EIA)', cat: 'commo', impact: 'low', tag: '#COMMO' },
  { date: '2026-03-26', title: 'PIB USA — T4 2025 (final)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // AVRIL
  { date: '2026-04-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-04-03', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-04-10', title: 'Inflation CPI (USA) — Données Mars', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-04-14', title: 'Début saison résultats T1 (USA)', cat: 'earnings', impact: 'high', tag: '#EARNINGS' },
  { date: '2026-04-16', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-04-29', title: 'PIB USA — T1 2026 (1ère estimation)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // MAI
  { date: '2026-05-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-05-06', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-05-07', title: 'BoE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-05-08', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-05-12', title: 'Inflation CPI (USA) — Données Avr.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-05-28', title: 'Réunion OPEC+', cat: 'commo', impact: 'high', tag: '#COMMO' },
  // JUIN
  { date: '2026-06-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-06-05', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-06-10', title: 'Inflation CPI (USA) — Données Mai', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-06-11', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-06-17', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-06-19', title: 'BoJ : Décision sur les taux', cat: 'bank', impact: 'medium', tag: '#BANK' },
  { date: '2026-06-19', title: 'Les 4 Sorcières — Expiration contrats', cat: 'stock', impact: 'high', tag: '#STOCK' },
  { date: '2026-06-25', title: 'PIB USA — T1 2026 (final)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // JUILLET
  { date: '2026-07-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-07-02', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-07-14', title: 'Inflation CPI (USA) — Données Juin', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-07-16', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-07-20', title: 'Début saison résultats T2 (USA)', cat: 'earnings', impact: 'high', tag: '#EARNINGS' },
  { date: '2026-07-29', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-07-30', title: 'PIB USA — T2 2026 (1ère estimation)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // AOÛT
  { date: '2026-08-06', title: 'BoE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-08-07', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-08-12', title: 'Inflation CPI (USA) — Données Juil.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // SEPTEMBRE
  { date: '2026-09-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-09-04', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-09-10', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-09-11', title: 'Inflation CPI (USA) — Données Août', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-09-16', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-09-18', title: 'BoJ : Décision sur les taux', cat: 'bank', impact: 'medium', tag: '#BANK' },
  { date: '2026-09-18', title: 'Les 4 Sorcières — Expiration contrats', cat: 'stock', impact: 'high', tag: '#STOCK' },
  { date: '2026-09-24', title: 'PIB USA — T2 2026 (final)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // OCTOBRE
  { date: '2026-10-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-10-02', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-10-13', title: 'Inflation CPI (USA) — Données Sept.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-10-19', title: 'Début saison résultats T3 (USA)', cat: 'earnings', impact: 'high', tag: '#EARNINGS' },
  { date: '2026-10-22', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-10-29', title: 'PIB USA — T3 2026 (1ère estimation)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // NOVEMBRE
  { date: '2026-11-04', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-11-05', title: 'BoE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-11-06', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-11-11', title: 'Inflation CPI (USA) — Données Oct.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-11-26', title: 'Réunion OPEC+', cat: 'commo', impact: 'high', tag: '#COMMO' },
  // DÉCEMBRE
  { date: '2026-12-01', title: 'ISM Manufacturing PMI (USA)', cat: 'macro', impact: 'medium', tag: '#MACRO' },
  { date: '2026-12-04', title: 'NFP — Rapport Emploi (USA)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-12-10', title: 'BCE : Décision sur les taux', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-12-11', title: 'Inflation CPI (USA) — Données Nov.', cat: 'macro', impact: 'high', tag: '#MACRO' },
  { date: '2026-12-16', title: 'FED : Décision sur les taux (FOMC)', cat: 'bank', impact: 'high', tag: '#BANK' },
  { date: '2026-12-18', title: 'BoJ : Décision sur les taux', cat: 'bank', impact: 'medium', tag: '#BANK' },
  { date: '2026-12-18', title: 'Les 4 Sorcières — Expiration contrats', cat: 'stock', impact: 'high', tag: '#STOCK' },
  { date: '2026-12-23', title: 'PIB USA — T3 2026 (final)', cat: 'macro', impact: 'high', tag: '#MACRO' },
  // Weekly recurring (EIA)
  ...[...Array(52)].map((_, i) => {
    const d = new Date(2026, 0, 7 + i * 7);
    if (d.getFullYear() !== 2026) return null;
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, title: 'Stocks de Pétrole brut (EIA)', cat: 'commo', impact: 'low', tag: '#COMMO' };
  }).filter(Boolean),
  // Bitcoin Halving countdown (not in 2026 but useful context)
  { date: '2026-04-20', title: 'Bitcoin Halving +2 ans — Cycle haussier historique', cat: 'crypto', impact: 'medium', tag: '#CRYPTO' },
  { date: '2026-01-01', title: 'Ethereum — Prochaine upgrade prévue', cat: 'crypto', impact: 'medium', tag: '#CRYPTO' },
  // Forex
  { date: '2026-03-29', title: 'Changement heure été (Europe) — Impact Forex', cat: 'forex', impact: 'low', tag: '#FOREX' },
  { date: '2026-10-25', title: 'Changement heure hiver (Europe) — Impact Forex', cat: 'forex', impact: 'low', tag: '#FOREX' },
].flat();

const CAT_CONFIG = {
  all: { label: 'Tous', icon: '📋', color: '#94a3b8' },
  bank: { label: 'Banques Centrales', icon: '🏛️', color: '#3b82f6' },
  macro: { label: 'Macro/Éco', icon: '🌐', color: '#10b981' },
  earnings: { label: 'Résultats', icon: '📊', color: '#8b5cf6' },
  stock: { label: 'Actions/Options', icon: '📈', color: '#f59e0b' },
  commo: { label: 'Matières 1ères', icon: '🛢️', color: '#ef4444' },
  crypto: { label: 'Crypto', icon: '₿', color: '#f97316' },
  forex: { label: 'Forex', icon: '💱', color: '#06b6d4' },
};

const IMPACT_CONFIG = {
  high: { label: 'HIGH IMPACT', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  medium: { label: 'MEDIUM', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  low: { label: 'LOW IMPACT', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
};

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function MarketCalendar() {
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showUpcoming, setShowUpcoming] = useState(true);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const events = useMemo(() => {
    let filtered = EVENTS_2026.filter(e => {
      if (filter !== 'all' && e.cat !== filter) return false;
      const month = parseInt(e.date.slice(5, 7)) - 1;
      if (!showUpcoming && month !== selectedMonth) return false;
      if (showUpcoming) return e.date >= today;
      return true;
    });
    // Remove duplicate EIA reports when not filtering commo
    if (filter !== 'commo' && filter !== 'all') {
      filtered = filtered.filter(e => e.cat !== 'commo' || e.impact !== 'low');
    }
    return filtered.sort((a, b) => a.date.localeCompare(b.date));
  }, [filter, selectedMonth, showUpcoming, today]);

  const upcomingCount = useMemo(() => EVENTS_2026.filter(e => e.date >= today && e.impact === 'high').length, [today]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDate().toString().padStart(2, '0');
    const monthShort = MONTHS_FR[d.getMonth()].slice(0, 3).toUpperCase();
    const weekday = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    return { day, monthShort, weekday, isPast: dateStr < today, isToday: dateStr === today };
  };

  return (
    <div className="mcal">
      <div className="mcal__header">
        <div className="mcal__title">
          <span className="mcal__icon">📅</span>
          <span>Agenda des Marchés</span>
          <span className="mcal__count">{upcomingCount} high impact à venir</span>
        </div>
        <div className="mcal__toggle">
          <button className={`mcal__toggle-btn ${showUpcoming ? 'mcal__toggle-btn--act' : ''}`} onClick={() => setShowUpcoming(true)}>À venir</button>
          <button className={`mcal__toggle-btn ${!showUpcoming ? 'mcal__toggle-btn--act' : ''}`} onClick={() => setShowUpcoming(false)}>Par mois</button>
        </div>
      </div>

      {!showUpcoming && (
        <div className="mcal__months">
          {MONTHS_FR.map((m, i) => (
            <button key={i} className={`mcal__month-btn ${selectedMonth === i ? 'mcal__month-btn--act' : ''}`} onClick={() => setSelectedMonth(i)}>
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      <div className="mcal__filters">
        {Object.entries(CAT_CONFIG).map(([key, cfg]) => (
          <button key={key} className={`mcal__filter ${filter === key ? 'mcal__filter--act' : ''}`} onClick={() => setFilter(key)} style={filter === key ? { borderColor: cfg.color, background: cfg.color + '18' } : {}}>
            <span>{cfg.icon}</span> {cfg.label}
          </button>
        ))}
      </div>

      <div className="mcal__list">
        {events.length === 0 ? (
          <div className="mcal__empty">Aucun événement pour cette sélection</div>
        ) : (
          events.slice(0, 25).map((evt, i) => {
            const { day, monthShort, weekday, isPast, isToday } = formatDate(evt.date);
            const imp = IMPACT_CONFIG[evt.impact];
            const catCfg = CAT_CONFIG[evt.cat];
            return (
              <div key={i} className={`mcal__event ${isPast ? 'mcal__event--past' : ''} ${isToday ? 'mcal__event--today' : ''}`}>
                <div className="mcal__event-date" style={{ borderLeftColor: catCfg?.color || '#94a3b8' }}>
                  <span className="mcal__event-day">{day}</span>
                  <span className="mcal__event-month">{monthShort}</span>
                  <span className="mcal__event-weekday">{weekday}</span>
                </div>
                <div className="mcal__event-content">
                  <div className="mcal__event-title">
                    <span>{catCfg?.icon}</span> {evt.title}
                    {isToday && <span className="mcal__today-badge">AUJOURD'HUI</span>}
                  </div>
                  <div className="mcal__event-meta">
                    <span className="mcal__impact" style={{ color: imp.color, background: imp.bg }}>{imp.label}</span>
                    <span className="mcal__tag" style={{ color: catCfg?.color }}>{evt.tag}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {events.length > 25 && <div className="mcal__more">+{events.length - 25} événements supplémentaires</div>}
      </div>
    </div>
  );
}
