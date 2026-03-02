import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../../components/Footer/Footer';
import './Simulator.css';

// ─── CONSTANTS ──────────────────────────────────────
const STORAGE_KEY = 'zenvest_sim_v3';
const FEE_RATE = 0.0016;
const TOP_PAIRS = ['BTC','ETH','SOL','XRP','ADA','DOT','LINK','AVAX','DOGE','SHIB','ATOM','UNI','AAVE','LTC','BCH','MATIC','ALGO','APT','ARB','OP','SUI','NEAR','INJ','SEI','FET','MKR','GRT','SAND','AXS','MANA','CRV','SNX','COMP','FIL','RUNE','PEPE','RENDER','TIA','STX','IMX','LDO','ENS','RPL','BONK','WIF','JUP','PYTH','ONDO','TAO','KAS'];

// ─── HELPERS ────────────────────────────────────────
function calcMetrics(trade, currentPrice) {
  if (!currentPrice || currentPrice <= 0) return { net: 0, pct: 0, fees: 0, val: trade.amount, qty: 0, gross: 0 };
  const qty = trade.amount / trade.entry;
  const rawPnL = trade.type === 'long'
    ? (currentPrice - trade.entry) * qty
    : (trade.entry - currentPrice) * qty;
  const entryFee = trade.amount * FEE_RATE;
  const exitVal = trade.amount + rawPnL;
  const exitFee = Math.abs(exitVal) * FEE_RATE;
  const totalFees = entryFee + exitFee;
  const net = rawPnL - totalFees;
  const pct = (net / trade.amount) * 100;
  return { net, pct, fees: totalFees, val: trade.amount + net, qty, gross: rawPnL };
}

function fmtPrice(v, decimals) {
  if (v === undefined || v === null) return '—';
  const d = decimals !== undefined ? decimals : (Math.abs(v) < 0.01 ? 6 : Math.abs(v) < 1 ? 4 : Math.abs(v) < 100 ? 3 : 2);
  return v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtEur(v) { return fmtPrice(v, 2) + ' €'; }
function fmtSign(v, suffix = '€') {
  const s = v >= 0 ? '+' : '';
  return s + fmtPrice(v, 2) + (suffix ? ' ' + suffix : '');
}
function getNewsBadge(title) {
  const t = title.toLowerCase();
  if (/crypto|bitcoin|btc|eth(?:ereum)?|sec |binance|coinbase|blockchain/.test(t)) return { cat: 'CRYPTO', color: '#8b5cf6' };
  if (/geo|war|conflict|china|russia|iran|tariff|sanction/.test(t)) return { cat: 'GEO', color: '#f59e0b' };
  if (/fed |inflation|rates?|powell|central bank|gdp|recession/.test(t)) return { cat: 'URGENT', color: '#ef4444' };
  if (/tech|ai |intelligence|nvidia|apple|google|microsoft|openai/.test(t)) return { cat: 'TECH', color: '#3b82f6' };
  return { cat: 'MACRO', color: '#10b981' };
}
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return { initCap: 10000, cash: 10000, trades: [], closedTrades: [], alerts: [], history: [], nextId: 1 };
}

// ─── MAIN COMPONENT ─────────────────────────────────
export default function Simulator() {
  const { lang } = useLanguage();
  const T = lang === 'fr' ? TEXT_FR : TEXT_EN;

  const [state, setState] = useState(loadState);
  const [market, setMarket] = useState({});
  const [allPairs, setAllPairs] = useState({});
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [search, setSearch] = useState('');

  const [formAsset, setFormAsset] = useState('BTC');
  const [formType, setFormType] = useState('long');
  const [formEntry, setFormEntry] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formSL, setFormSL] = useState('');
  const [formTP, setFormTP] = useState('');
  const [alertAsset, setAlertAsset] = useState('BTC');
  const [alertPrice, setAlertPrice] = useState('');
  const [capInput, setCapInput] = useState('');

  const chartRef = useRef(null);
  const chartInst = useRef(null);
  const toastTimer = useRef(null);
  const marketRef = useRef(market);
  marketRef.current = market;

  // ─── Persist ──────────────
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  // ─── Toast ────────────────
  const showToastMsg = useCallback((msg) => {
    setToast(msg); setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3500);
  }, []);

  // ─── Load all Kraken EUR pairs ─────
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('https://api.kraken.com/0/public/AssetPairs');
        const d = await r.json();
        if (!d.result) return;
        const map = {};
        Object.entries(d.result).forEach(([k, v]) => {
          if (v.wsname && v.wsname.endsWith('/EUR') && !k.includes('.d')) {
            const base = v.wsname.split('/')[0];
            if (base && !map[base]) map[base] = k;
          }
        });
        if (map['XBT'] && !map['BTC']) { map['BTC'] = map['XBT']; delete map['XBT']; }
        setAllPairs(map);
      } catch (e) { console.error('Failed to load pairs', e); }
    })();
  }, []);

  // ─── Sync market prices ────
  const syncMarket = useCallback(async () => {
    if (Object.keys(allPairs).length === 0) return;
    const needed = new Set(TOP_PAIRS);
    state.trades.forEach(t => needed.add(t.asset));
    state.alerts.forEach(a => needed.add(a.asset));

    const krakenPairs = [];
    needed.forEach(sym => { if (allPairs[sym]) krakenPairs.push(allPairs[sym]); });
    if (krakenPairs.length === 0) return;

    const batches = [];
    for (let i = 0; i < krakenPairs.length; i += 30) batches.push(krakenPairs.slice(i, i + 30));

    const newMarket = { ...marketRef.current };
    for (const batch of batches) {
      try {
        const r = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${batch.join(',')}`);
        const d = await r.json();
        if (d.result) {
          Object.entries(d.result).forEach(([pair, info]) => {
            let sym = null;
            for (const [s, p] of Object.entries(allPairs)) {
              if (p === pair) { sym = s; break; }
            }
            if (!sym) {
              if (pair.includes('XBT')) sym = 'BTC';
              else { for (const [s, p] of Object.entries(allPairs)) { if (p === pair) { sym = s; break; } } }
            }
            if (sym) {
              const price = parseFloat(info.c[0]);
              const open = parseFloat(info.o);
              const high = parseFloat(info.h[1]);
              const low = parseFloat(info.l[1]);
              const vol = parseFloat(info.v[1]);
              newMarket[sym] = { price, open, high, low, vol, move: ((price - open) / open) * 100, pair };
            }
          });
        }
      } catch (e) { console.error('Ticker batch error', e); }
    }
    setMarket(newMarket);
  }, [allPairs, state.trades, state.alerts]);

  // ─── SL/TP auto execution ─────
  useEffect(() => {
    if (Object.keys(market).length === 0 || state.trades.length === 0) return;
    let changed = false;
    const remaining = [];
    const newClosed = [...state.closedTrades];
    let cashDelta = 0;

    state.trades.forEach(trade => {
      const p = market[trade.asset]?.price;
      if (!p) { remaining.push(trade); return; }
      let triggered = null;
      if (trade.sl && trade.sl > 0) {
        if (trade.type === 'long' && p <= trade.sl) triggered = 'SL';
        if (trade.type === 'short' && p >= trade.sl) triggered = 'SL';
      }
      if (trade.tp && trade.tp > 0) {
        if (trade.type === 'long' && p >= trade.tp) triggered = 'TP';
        if (trade.type === 'short' && p <= trade.tp) triggered = 'TP';
      }
      if (triggered) {
        const m = calcMetrics(trade, p);
        cashDelta += m.val;
        newClosed.push({ ...trade, exitPrice: p, exitTime: Date.now(), pnl: m.net, pnlPct: m.pct, reason: triggered });
        changed = true;
        showToastMsg(`${triggered === 'SL' ? '🛑' : '🎯'} ${triggered} ${T.triggered}: ${trade.asset} ${fmtSign(m.net)}`);
      } else { remaining.push(trade); }
    });

    if (changed) setState(prev => ({ ...prev, trades: remaining, closedTrades: newClosed, cash: prev.cash + cashDelta }));
  }, [market]); // eslint-disable-line

  // ─── Check alerts ─────
  useEffect(() => {
    if (Object.keys(market).length === 0 || state.alerts.length === 0) return;
    const triggered = [];
    const remaining = state.alerts.filter(a => {
      const p = market[a.asset]?.price;
      if (p && ((a.direction === 'above' && p >= a.target) || (a.direction === 'below' && p <= a.target))) {
        triggered.push(a); return false;
      }
      return true;
    });
    if (triggered.length > 0) {
      triggered.forEach(a => showToastMsg(`🚨 ${a.asset} ${a.direction === 'above' ? '≥' : '≤'} ${fmtPrice(a.target)}€`));
      setState(prev => ({ ...prev, alerts: remaining }));
    }
  }, [market]); // eslint-disable-line

  // ─── Init intervals ────
  useEffect(() => {
    if (Object.keys(allPairs).length === 0) return;
    syncMarket();
    const i1 = setInterval(syncMarket, 8000);
    return () => clearInterval(i1);
  }, [allPairs, syncMarket]);

  // News
  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const q = encodeURIComponent('FED OR inflation OR bitcoin OR crypto OR earnings');
        const rss = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
        const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&t=${Date.now()}`);
        const d = await r.json();
        if (d?.status === 'ok' && d.items) setNews(d.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 15));
      } catch (e) { console.error('News error', e); }
      setNewsLoading(false);
    };
    fetchNews();
    const i = setInterval(fetchNews, 300000);
    return () => clearInterval(i);
  }, []);

  // ─── Chart ────
  useEffect(() => {
    if (!chartRef.current || state.history.length < 2) return;
    const render = () => {
      if (!window.Chart) return;
      const ctx = chartRef.current.getContext('2d');
      if (chartInst.current) chartInst.current.destroy();
      const data = state.history.map(h => h.v);
      const isUp = data.length > 1 && data[data.length - 1] >= data[0];
      chartInst.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: state.history.map(h => h.t),
          datasets: [{ data, borderColor: isUp ? '#59A52C' : '#ef4444', fill: true, tension: 0.35, backgroundColor: isUp ? 'rgba(89,165,44,0.06)' : 'rgba(239,68,68,0.06)', borderWidth: 2.5, pointRadius: 0, pointHitRadius: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => fmtEur(c.raw) } } },
          scales: { x: { display: false }, y: { display: false } },
          interaction: { intersect: false, mode: 'index' },
        }
      });
    };
    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      s.onload = render;
      document.head.appendChild(s);
    } else render();
    return () => { if (chartInst.current) chartInst.current.destroy(); };
  }, [state.history]);

  // ─── Computed ─────
  let totalPositionsVal = 0;
  const tradeCalcs = state.trades.map(trade => {
    const p = market[trade.asset]?.price || 0;
    const m = calcMetrics(trade, p);
    totalPositionsVal += m.val;
    return { trade, price: p, metrics: m };
  });
  const totalVal = state.cash + totalPositionsVal;
  const totalPnl = totalVal - state.initCap;
  const totalPnlPct = state.initCap > 0 ? (totalPnl / state.initCap) * 100 : 0;

  // Save history snapshot
  useEffect(() => {
    if (totalVal > 0 && Object.keys(market).length > 0) {
      setState(prev => {
        const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const last = prev.history[prev.history.length - 1];
        if (last && last.t === now) return prev;
        const hist = [...prev.history, { t: now, v: totalVal }];
        if (hist.length > 60) hist.shift();
        return { ...prev, history: hist };
      });
    }
  }, [market]); // eslint-disable-line

  // ─── Asset list for selector ─────
  const assetList = useMemo(() => {
    const keys = Object.keys(allPairs).sort((a, b) => {
      const ai = TOP_PAIRS.indexOf(a); const bi = TOP_PAIRS.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1; if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
    if (!search) return keys;
    const s = search.toUpperCase();
    return keys.filter(k => k.includes(s));
  }, [allPairs, search]);

  // ─── Ticker display ─────
  const tickerItems = useMemo(() => {
    const entries = Object.entries(market).filter(([k]) => TOP_PAIRS.slice(0, 15).includes(k));
    return entries.sort((a, b) => Math.abs(b[1].move) - Math.abs(a[1].move)).slice(0, 12);
  }, [market]);

  // ─── Actions ──────────────
  const openTrade = () => {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) return showToastMsg(`❌ ${T.invalidAmount}`);
    if (amount > state.cash) return showToastMsg(`❌ ${T.insufficientCash}`);
    const entryIn = parseFloat(formEntry);
    const price = entryIn > 0 ? entryIn : market[formAsset]?.price;
    if (!price) return showToastMsg(`⏳ ${T.priceUnavailable} ${formAsset}`);
    const sl = parseFloat(formSL) || 0;
    const tp = parseFloat(formTP) || 0;
    setState(prev => ({
      ...prev, cash: prev.cash - amount, nextId: prev.nextId + 1,
      trades: [...prev.trades, { id: prev.nextId, asset: formAsset, type: formType, entry: price, amount, sl, tp, time: Date.now() }]
    }));
    setFormEntry(''); setFormAmount(''); setFormSL(''); setFormTP('');
    showToastMsg(`✅ ${formType.toUpperCase()} ${formAsset} @ ${fmtPrice(price)}€ — ${fmtEur(amount)}`);
  };

  const closeTrade = (tradeId) => {
    const trade = state.trades.find(t => t.id === tradeId);
    if (!trade) return;
    const p = market[trade.asset]?.price || trade.entry;
    const m = calcMetrics(trade, p);
    setState(prev => ({
      ...prev, cash: prev.cash + m.val,
      trades: prev.trades.filter(t => t.id !== tradeId),
      closedTrades: [...prev.closedTrades, { ...trade, exitPrice: p, exitTime: Date.now(), pnl: m.net, pnlPct: m.pct, reason: 'manual' }]
    }));
    showToastMsg(`💼 ${trade.asset} ${T.closed} ${fmtSign(m.net)}`);
  };

  const addAlert = () => {
    const target = parseFloat(alertPrice);
    if (!target || target <= 0) return;
    const currentP = market[alertAsset]?.price || 0;
    const direction = target >= currentP ? 'above' : 'below';
    setState(prev => ({ ...prev, alerts: [...prev.alerts, { asset: alertAsset, target, direction, id: Date.now() }] }));
    setAlertPrice('');
    showToastMsg(`🔔 ${T.alertCreated} ${alertAsset} ${direction === 'above' ? '≥' : '≤'} ${fmtPrice(target)}€`);
  };

  const removeAlert = (id) => setState(prev => ({ ...prev, alerts: prev.alerts.filter(a => a.id !== id) }));

  const updateCap = () => {
    const v = parseFloat(capInput);
    if (v > 0) {
      setState(prev => ({ ...prev, cash: prev.cash + (v - prev.initCap), initCap: v }));
      setCapInput(''); showToastMsg(`💰 ${T.capitalUpdated}`);
    }
  };

  const resetAll = () => {
    if (window.confirm(T.resetConfirm)) {
      localStorage.removeItem(STORAGE_KEY);
      setState({ initCap: 10000, cash: 10000, trades: [], closedTrades: [], alerts: [], history: [], nextId: 1 });
      showToastMsg(`🗑️ ${T.dataReset}`);
    }
  };

  // ─── RENDER ───────────────
  return (
    <div>
      {/* ── Ticker ── */}
      <div className="sim-ticker">
        {tickerItems.length === 0 ? (
          <span className="sim-ticker__loading">{T.connecting}...</span>
        ) : tickerItems.map(([sym, d], i) => (
          <React.Fragment key={sym}>
            {i > 0 && <span className="sim-ticker__sep">|</span>}
            <div className="sim-ticker__item">
              <span className="sim-ticker__pair">{sym}</span>
              <span className="sim-ticker__price">{fmtPrice(d.price)}€</span>
              <span className={`sim-ticker__change ${d.move >= 0 ? 'sim-ticker__change--up' : 'sim-ticker__change--down'}`}>
                {d.move >= 0 ? '+' : ''}{d.move.toFixed(2)}%
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="simulator">
        {/* ── Portfolio Bar ── */}
        <div className="sim-portfolio-bar">
          <div>
            <div className="sim-portfolio-bar__label">{T.portfolioValue}</div>
            <div className="sim-portfolio-bar__value">{fmtEur(totalVal)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={`sim-portfolio-bar__pnl ${totalPnl >= 0 ? 'sim-portfolio-bar__pnl--up' : 'sim-portfolio-bar__pnl--down'}`}>
              {fmtSign(totalPnl)} ({fmtSign(totalPnlPct, '%')})
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              {T.initialCap}: {fmtEur(state.initCap)} · Cash: {fmtEur(state.cash)}
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="sim-layout">
          {/* LEFT */}
          <div>
            <div className="sim-top-grid">
              {/* Allocation */}
              <div className="sim-card">
                <div className="sim-card__title">{T.allocation} <span>{state.trades.length} {T.positions}</span></div>
                {tradeCalcs.map(({ trade, metrics }) => {
                  const pct = (metrics.val / (totalVal || 1)) * 100;
                  const up = metrics.pct >= 0;
                  return (
                    <div key={trade.id} className="sim-alloc">
                      <div className="sim-alloc__header">
                        <div>
                          <span className="sim-alloc__name">{trade.asset}</span>
                          <span className={`sim-alloc__badge sim-alloc__badge--${trade.type}`}>{trade.type.toUpperCase()}</span>
                          <span className="sim-alloc__value"> {fmtEur(metrics.val)} <span className="sim-alloc__pct">({pct.toFixed(1)}%)</span></span>
                        </div>
                        <span className="sim-alloc__perf" style={{ color: up ? 'var(--color-green)' : 'var(--color-danger)' }}>{fmtSign(metrics.pct, '%')}</span>
                      </div>
                      <div className="sim-alloc__bar"><div className="sim-alloc__bar-fill" style={{ width: `${Math.max(pct, 0.5)}%` }} /></div>
                    </div>
                  );
                })}
                <div className="sim-alloc">
                  <div className="sim-alloc__header">
                    <span className="sim-alloc__name" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>CASH</span>
                    <span className="sim-alloc__value sim-alloc__value--cash">{fmtEur(state.cash)}</span>
                  </div>
                  <div className="sim-alloc__bar"><div className="sim-alloc__bar-fill sim-alloc__bar-fill--cash" style={{ width: `${(state.cash / (totalVal || 1)) * 100}%` }} /></div>
                </div>
                {state.trades.length === 0 && <div className="sim-empty"><div className="sim-empty__icon">📊</div>{T.noPositions}</div>}
              </div>

              {/* Chart */}
              <div className="sim-card">
                <div className="sim-card__title">{T.performance}</div>
                <div className="sim-chart-wrap">
                  <canvas ref={chartRef} />
                  {state.history.length < 2 && <div className="sim-empty"><div className="sim-empty__icon">📈</div>{T.chartWaiting}</div>}
                </div>
              </div>
            </div>

            {/* News */}
            <div className="sim-card">
              <div className="sim-card__title">{T.news} 🌍 <span>{T.newsLive}</span></div>
              <div className="sim-news-list">
                {newsLoading ? <div className="sim-empty">{T.newsLoading}</div> : news.length === 0 ? <div className="sim-empty">{T.newsError}</div> :
                  news.map((item, i) => {
                    const b = getNewsBadge(item.title);
                    const time = new Date(item.pubDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={i} className="sim-news-item">
                        <div className="sim-news-meta">
                          <span className="sim-news-badge" style={{ background: b.color }}>{b.cat}</span>
                          <span className="sim-news-time">🕒 {time} · {item.author || 'Global'}</span>
                        </div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="sim-news-title">{item.title}</a>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Positions Table */}
            <div className="sim-card">
              <div className="sim-card__title">
                {T.activePositions}
                <button className="sim-btn-history" onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? T.hideHistory : T.showHistory} ({state.closedTrades.length})
                </button>
              </div>
              {!showHistory ? (
                state.trades.length === 0 ? <div className="sim-empty"><div className="sim-empty__icon">💼</div>{T.noTrades}</div> : (
                  <div className="sim-table-wrap">
                    <table className="sim-table">
                      <thead><tr>
                        <th>{T.thAsset}</th><th>{T.thType}</th><th>{T.thQty}</th><th>{T.thEntry}</th>
                        <th>{T.thCurrent}</th><th>SL</th><th>TP</th><th>{T.thFees}</th>
                        <th>{T.thPnl}</th><th>{T.thPnlPct}</th><th></th>
                      </tr></thead>
                      <tbody>
                        {tradeCalcs.map(({ trade, price, metrics }) => {
                          const up = metrics.pct >= 0;
                          return (
                            <tr key={trade.id}>
                              <td className="sim-table__asset">{trade.asset}</td>
                              <td><span className={`sim-table__type sim-table__type--${trade.type}`}>{trade.type.toUpperCase()}</span></td>
                              <td style={{ fontSize: '0.78rem' }}>{metrics.qty.toFixed(4)}</td>
                              <td>{fmtPrice(trade.entry)}€</td>
                              <td><strong>{fmtPrice(price)}€</strong></td>
                              <td className="sim-table__fees">{trade.sl ? fmtPrice(trade.sl) + '€' : '—'}</td>
                              <td className="sim-table__fees">{trade.tp ? fmtPrice(trade.tp) + '€' : '—'}</td>
                              <td className="sim-table__fees">{fmtPrice(metrics.fees)}€</td>
                              <td className={`sim-table__pnl ${up ? 'sim-table__pnl--up' : 'sim-table__pnl--down'}`}><strong>{fmtSign(metrics.net)}</strong></td>
                              <td className={`sim-table__pnl ${up ? 'sim-table__pnl--up' : 'sim-table__pnl--down'}`}><strong>{fmtSign(metrics.pct, '%')}</strong></td>
                              <td><button className="sim-btn-close" onClick={() => closeTrade(trade.id)}>{T.close}</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                state.closedTrades.length === 0 ? <div className="sim-empty">{T.noHistory}</div> : (
                  <div className="sim-table-wrap">
                    <table className="sim-table">
                      <thead><tr>
                        <th>{T.thAsset}</th><th>{T.thType}</th><th>{T.thEntry}</th><th>{T.thExit}</th>
                        <th>{T.thPnl}</th><th>{T.thPnlPct}</th><th>{T.thReason}</th><th>{T.thDate}</th>
                      </tr></thead>
                      <tbody>
                        {[...state.closedTrades].reverse().slice(0, 50).map((t, i) => {
                          const up = t.pnl >= 0;
                          return (
                            <tr key={i}>
                              <td className="sim-table__asset">{t.asset}</td>
                              <td><span className={`sim-table__type sim-table__type--${t.type}`}>{t.type.toUpperCase()}</span></td>
                              <td>{fmtPrice(t.entry)}€</td>
                              <td>{fmtPrice(t.exitPrice)}€</td>
                              <td className={`sim-table__pnl ${up ? 'sim-table__pnl--up' : 'sim-table__pnl--down'}`}><strong>{fmtSign(t.pnl)}</strong></td>
                              <td className={`sim-table__pnl ${up ? 'sim-table__pnl--up' : 'sim-table__pnl--down'}`}><strong>{fmtSign(t.pnlPct, '%')}</strong></td>
                              <td><span className={`sim-reason sim-reason--${t.reason}`}>{t.reason?.toUpperCase()}</span></td>
                              <td style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{new Date(t.exitTime).toLocaleDateString('fr-FR')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            {/* Trade Form */}
            <div className="sim-card">
              <div className="sim-card__title">{T.newTrade}</div>
              <div className="sim-form__group">
                <label className="sim-form__label">{T.asset} ({Object.keys(allPairs).length} {T.available})</label>
                <input className="sim-form__input sim-form__input--search" type="text" placeholder={T.searchAsset}
                  value={search} onChange={e => setSearch(e.target.value)} />
                <select className="sim-form__select" value={formAsset} onChange={e => setFormAsset(e.target.value)} size={1}>
                  {assetList.slice(0, 200).map(a => (
                    <option key={a} value={a}>{a}/EUR {market[a] ? `— ${fmtPrice(market[a].price)}€` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="sim-form__group">
                <label className="sim-form__label">{T.direction}</label>
                <div className="sim-form__direction">
                  <button className={`sim-dir-btn sim-dir-btn--long ${formType === 'long' ? 'sim-dir-btn--active' : ''}`} onClick={() => setFormType('long')}>▲ LONG</button>
                  <button className={`sim-dir-btn sim-dir-btn--short ${formType === 'short' ? 'sim-dir-btn--active' : ''}`} onClick={() => setFormType('short')}>▼ SHORT</button>
                </div>
              </div>
              {market[formAsset] && (
                <div className="sim-market-info">
                  <span>{T.marketPrice}: <strong>{fmtPrice(market[formAsset].price)}€</strong></span>
                  <span>24h: <strong style={{ color: market[formAsset].move >= 0 ? 'var(--color-green)' : 'var(--color-danger)' }}>
                    {market[formAsset].move >= 0 ? '+' : ''}{market[formAsset].move.toFixed(2)}%
                  </strong></span>
                </div>
              )}
              <div className="sim-form__row">
                <div className="sim-form__group sim-form__group--half">
                  <label className="sim-form__label">{T.entryPrice}</label>
                  <input className="sim-form__input" type="number" value={formEntry} onChange={e => setFormEntry(e.target.value)} placeholder={T.auto} step="any" />
                </div>
                <div className="sim-form__group sim-form__group--half">
                  <label className="sim-form__label">{T.amount} (€)</label>
                  <input className="sim-form__input" type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="500" />
                </div>
              </div>
              <div className="sim-form__row">
                <div className="sim-form__group sim-form__group--half">
                  <label className="sim-form__label">Stop Loss (€)</label>
                  <input className="sim-form__input sim-form__input--sl" type="number" value={formSL} onChange={e => setFormSL(e.target.value)} placeholder={T.optional} step="any" />
                </div>
                <div className="sim-form__group sim-form__group--half">
                  <label className="sim-form__label">Take Profit (€)</label>
                  <input className="sim-form__input sim-form__input--tp" type="number" value={formTP} onChange={e => setFormTP(e.target.value)} placeholder={T.optional} step="any" />
                </div>
              </div>
              <button className="sim-btn-execute" onClick={openTrade}>{T.execute}</button>
              <div className="sim-cash-info">{T.available}: <strong>{fmtEur(state.cash)}</strong></div>
            </div>

            {/* Alerts */}
            <div className="sim-card">
              <div className="sim-card__title">{T.alerts} 🔔</div>
              <div className="sim-alert-input-row">
                <select className="sim-form__select" value={alertAsset} onChange={e => setAlertAsset(e.target.value)}>
                  {TOP_PAIRS.map(a => allPairs[a] ? <option key={a} value={a}>{a}</option> : null)}
                </select>
                <input className="sim-form__input" type="number" value={alertPrice} onChange={e => setAlertPrice(e.target.value)} placeholder={T.targetPrice} step="any" />
              </div>
              <button className="sim-btn-alert" onClick={addAlert}>{T.createAlert}</button>
              {state.alerts.map(a => (
                <div key={a.id} className="sim-alert-item">
                  <span><strong>{a.asset}</strong> {a.direction === 'above' ? '≥' : '≤'} {fmtPrice(a.target)}€</span>
                  <button className="sim-alert-item__remove" onClick={() => removeAlert(a.id)}>✕</button>
                </div>
              ))}
            </div>

            {/* Account */}
            <div className="sim-card sim-card--danger">
              <div className="sim-card__title">{T.account}</div>
              <div className="sim-form__group">
                <label className="sim-form__label">{T.initialCap} (€)</label>
                <input className="sim-form__input" type="number" value={capInput} onChange={e => setCapInput(e.target.value)} placeholder={state.initCap.toString()} />
              </div>
              <button className="sim-btn-update" onClick={updateCap}>{T.update}</button>
              <button className="sim-btn-reset" onClick={resetAll}>🗑️ {T.resetAll}</button>
            </div>
          </aside>
        </div>
      </div>

      <div className={`sim-toast ${toastVisible ? 'sim-toast--visible' : ''}`}>{toast}</div>
      <Footer />
    </div>
  );
}

// ─── i18n ────────────────────────────────────────────
const TEXT_FR = {
  portfolioValue:'Valeur du Portefeuille',connecting:'Connexion aux serveurs Kraken',allocation:'Répartition du Capital',
  positions:'positions',performance:'Performance',chartWaiting:'Données après vos premiers trades',
  news:'Actualités Marchés',newsLive:'Flux Live',newsLoading:'Chargement...',newsError:'Flux indisponible',
  activePositions:'Positions Actives',noPositions:'Ouvrez un trade pour voir la répartition',
  noTrades:'Aucune position ouverte',newTrade:'Nouveau Trade',asset:'Actif',searchAsset:'Rechercher un actif...',
  available:'disponibles',direction:'Direction',entryPrice:"Prix d'entrée",amount:'Montant',auto:'Auto (prix marché)',
  optional:'Optionnel',execute:'⚡ Exécuter le Trade',marketPrice:'Prix marché',
  alerts:'Alertes Prix',targetPrice:'Prix cible (€)',createAlert:'Créer alerte',alertCreated:'Alerte créée',
  triggered:'déclenché',account:'Gestion Compte',initialCap:'Capital initial',update:'Mettre à jour',
  resetAll:'RÉINITIALISER',resetConfirm:'Effacer toutes les données ?',capitalUpdated:'Capital mis à jour',
  dataReset:'Données effacées',invalidAmount:'Montant invalide',insufficientCash:'Cash insuffisant',
  priceUnavailable:'Prix indisponible pour',close:'Clôturer',closed:'clôturé',
  showHistory:'Historique',hideHistory:'Positions',noHistory:'Aucun trade clôturé',
  thAsset:'Actif',thType:'Type',thQty:'Qté',thEntry:'Entrée',thCurrent:'Actuel',thFees:'Frais',
  thPnl:'P&L Net',thPnlPct:'P&L %',thExit:'Sortie',thReason:'Raison',thDate:'Date',
};
const TEXT_EN = {
  portfolioValue:'Portfolio Value',connecting:'Connecting to Kraken',allocation:'Capital Allocation',
  positions:'positions',performance:'Performance',chartWaiting:'Data after your first trades',
  news:'Market News',newsLive:'Live Feed',newsLoading:'Loading...',newsError:'Feed unavailable',
  activePositions:'Active Positions',noPositions:'Open a trade to see allocation',
  noTrades:'No open positions',newTrade:'New Trade',asset:'Asset',searchAsset:'Search asset...',
  available:'available',direction:'Direction',entryPrice:'Entry price',amount:'Amount',auto:'Auto (market price)',
  optional:'Optional',execute:'⚡ Execute Trade',marketPrice:'Market price',
  alerts:'Price Alerts',targetPrice:'Target price (€)',createAlert:'Create alert',alertCreated:'Alert created',
  triggered:'triggered',account:'Account',initialCap:'Initial capital',update:'Update',
  resetAll:'RESET ALL',resetConfirm:'Erase all data?',capitalUpdated:'Capital updated',
  dataReset:'Data erased',invalidAmount:'Invalid amount',insufficientCash:'Insufficient cash',
  priceUnavailable:'Price unavailable for',close:'Close',closed:'closed',
  showHistory:'History',hideHistory:'Positions',noHistory:'No closed trades yet',
  thAsset:'Asset',thType:'Type',thQty:'Qty',thEntry:'Entry',thCurrent:'Current',thFees:'Fees',
  thPnl:'Net P&L',thPnlPct:'P&L %',thExit:'Exit',thReason:'Reason',thDate:'Date',
};
