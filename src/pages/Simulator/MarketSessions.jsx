import React, { useState, useEffect } from 'react';

const MARKETS = [
  { name: 'Sydney', tz: 'Australia/Sydney', open: 10, close: 16, flag: '🇦🇺' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', open: 9, close: 15, flag: '🇯🇵' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong', open: 9, close: 16, flag: '🇭🇰' },
  { name: 'Francfort', tz: 'Europe/Berlin', open: 9, close: 17.5, flag: '🇩🇪' },
  { name: 'Paris', tz: 'Europe/Paris', open: 9, close: 17.5, flag: '🇫🇷' },
  { name: 'Londres', tz: 'Europe/London', open: 8, close: 16.5, flag: '🇬🇧' },
  { name: 'New York', tz: 'America/New_York', open: 9.5, close: 16, flag: '🇺🇸' },
  { name: 'Crypto', tz: null, open: 0, close: 24, flag: '₿' },
];

function getMarketStatus(market) {
  if (!market.tz) return { isOpen: true, label: '24/7', localTime: '' };
  try {
    const now = new Date();
    const local = new Date(now.toLocaleString('en-US', { timeZone: market.tz }));
    const h = local.getHours() + local.getMinutes() / 60;
    const isOpen = h >= market.open && h < market.close;
    const day = local.getDay();
    const isWeekend = day === 0 || day === 6;
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: market.tz });
    return { isOpen: isOpen && !isWeekend, label: isOpen && !isWeekend ? 'OUVERT' : 'FERMÉ', localTime: time };
  } catch {
    return { isOpen: false, label: '—', localTime: '' };
  }
}

export default function MarketSessions() {
  const [statuses, setStatuses] = useState({});
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const update = () => {
      setNow(new Date());
      const s = {};
      MARKETS.forEach(m => { s[m.name] = getMarketStatus(m); });
      setStatuses(s);
    };
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, []);

  const openCount = Object.values(statuses).filter(s => s.isOpen).length;
  const parisTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris' });

  return (
    <div className="msess">
      <div className="msess__header">
        <span className="msess__title">🕐 Sessions de Marché</span>
        <span className="msess__time">{parisTime} Paris</span>
      </div>
      <div className="msess__open-count">{openCount} marché{openCount > 1 ? 's' : ''} ouvert{openCount > 1 ? 's' : ''}</div>
      <div className="msess__grid">
        {MARKETS.map(m => {
          const s = statuses[m.name] || {};
          return (
            <div key={m.name} className={`msess__item ${s.isOpen ? 'msess__item--open' : 'msess__item--closed'}`}>
              <div className="msess__flag">{m.flag}</div>
              <div className="msess__info">
                <span className="msess__name">{m.name}</span>
                <span className="msess__local">{s.localTime}</span>
              </div>
              <span className={`msess__status ${s.isOpen ? 'msess__status--open' : 'msess__status--closed'}`}>
                <span className="msess__dot" /> {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
