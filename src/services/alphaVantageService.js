/**
 * Alpha Vantage Price Service for ZENVEST
 * Handles real market data with rate limiting, caching & market hours detection
 */
import { ALPHA_VANTAGE_KEY } from '../config';

const AV_BASE = 'https://www.alphavantage.co/query';
const CACHE_PREFIX = 'zv_av_';
const CALL_LOG_KEY = 'zv_av_calls';
const MAX_DAILY_CALLS = 25;
const MIN_CALL_INTERVAL = 13000;

// ── Market Hours ────────────────────────────────────────────────
export function getMarketStatus(symbol) {
  if (!symbol) return { open: false, label: 'Inconnu' };
  const now = new Date();
  const day = now.getUTCDay();
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  if (['BTC','ETH','SOL','XRP','ADA'].includes(symbol) || symbol.includes('/'))
    return { open: true, label: '24/7', market: 'CRYPTO' };
  if (day === 0 || day === 6)
    return { open: false, label: 'Weekend — Marché fermé', market: symbol.includes('.PA') || symbol.includes('.DE') ? 'EU' : 'US' };
  if (symbol.includes('.PA') || symbol.includes('.DE')) {
    const open = utcHour >= 8 && utcHour < 16.5;
    return { open, label: open ? 'Euronext — Ouvert' : 'Euronext — Fermé', market: 'EU' };
  }
  const open = utcHour >= 14.5 && utcHour < 21;
  return { open, label: open ? 'NYSE/NASDAQ — Ouvert' : 'NYSE/NASDAQ — Fermé', market: 'US' };
}

// ── Rate Limiting ───────────────────────────────────────────────
function getCallLog() {
  try {
    const raw = localStorage.getItem(CALL_LOG_KEY);
    if (!raw) return [];
    const log = JSON.parse(raw);
    const today = new Date().toDateString();
    return log.filter(entry => new Date(entry).toDateString() === today);
  } catch { return []; }
}
function logCall() {
  const log = getCallLog(); log.push(Date.now());
  localStorage.setItem(CALL_LOG_KEY, JSON.stringify(log));
}
export function getRateLimitInfo() {
  const log = getCallLog();
  return { used: log.length, remaining: Math.max(0, MAX_DAILY_CALLS - log.length), total: MAX_DAILY_CALLS, canCall: log.length < MAX_DAILY_CALLS };
}

// ── Cache ───────────────────────────────────────────────────────
function getCached(symbol) {
  try { const raw = localStorage.getItem(CACHE_PREFIX + symbol); if (!raw) return null; return JSON.parse(raw); } catch { return null; }
}
function setCache(symbol, data) {
  try { localStorage.setItem(CACHE_PREFIX + symbol, JSON.stringify({ ...data, cachedAt: Date.now() })); } catch {}
}
function isCacheFresh(cached, marketOpen) {
  if (!cached || !cached.cachedAt) return false;
  const age = Date.now() - cached.cachedAt;
  const ttl = marketOpen ? 15 * 60 * 1000 : 6 * 60 * 60 * 1000;
  return age < ttl;
}
export function getCachedPrice(symbol) { return getCached(symbol); }

// ── Fetch Queue ─────────────────────────────────────────────────
let fetchQueue = [];
let isProcessing = false;
let lastCallTime = 0;

async function processQueue() {
  if (isProcessing || fetchQueue.length === 0) return;
  isProcessing = true;
  while (fetchQueue.length > 0) {
    const { url, resolve } = fetchQueue.shift();
    if (!getRateLimitInfo().canCall) { resolve(null); continue; }
    const elapsed = Date.now() - lastCallTime;
    if (elapsed < MIN_CALL_INTERVAL) await new Promise(r => setTimeout(r, MIN_CALL_INTERVAL - elapsed));
    try {
      const response = await fetch(url);
      const data = await response.json();
      lastCallTime = Date.now(); logCall();
      if (data['Note'] || data['Information'] || data['Error Message']) { console.warn('[AV]', data['Note'] || data['Information'] || data['Error Message']); resolve(null); continue; }
      resolve(data);
    } catch (err) { console.error('[AV]', err); resolve(null); }
  }
  isProcessing = false;
}
function queueFetch(url) { return new Promise((resolve) => { fetchQueue.push({ url, resolve }); processQueue(); }); }

// ── Public API ──────────────────────────────────────────────────
export async function fetchStockQuote(symbol) {
  const status = getMarketStatus(symbol);
  const cached = getCached(symbol);
  if (cached && isCacheFresh(cached, status.open)) return { ...cached, source: 'cache' };
  if (!status.open && cached) return { ...cached, source: 'cache' };
  const url = `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_KEY}`;
  const data = await queueFetch(url);
  if (data && data['Global Quote']) {
    const q = data['Global Quote'];
    const result = { price: parseFloat(q['05. price']), open: parseFloat(q['02. open']), high: parseFloat(q['03. high']), low: parseFloat(q['04. low']), volume: parseInt(q['06. volume']), change: parseFloat(q['09. change']), changePct: parseFloat(q['10. change percent']), lastDay: q['07. latest trading day'], source: 'live' };
    setCache(symbol, result); return result;
  }
  if (cached) return { ...cached, source: 'stale' };
  return null;
}

export async function fetchCommodityPrice(fromCurrency, toCurrency = 'USD') {
  const key = `${fromCurrency}_${toCurrency}`;
  const cached = getCached(key);
  // Métaux précieux / énergie fermés le weekend (pause 22h-23h UTC en semaine)
  const now = new Date();
  const day = now.getUTCDay();
  const isWeekend = day === 0 || day === 6;
  const utcH = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isPause = !isWeekend && utcH >= 22 && utcH < 23;
  const marketOpen = !isWeekend && !isPause;
  if (cached && isCacheFresh(cached, marketOpen)) return { ...cached, source: 'cache' };
  if ((isWeekend || isPause) && cached) return { ...cached, source: 'cache' };
  const url = `${AV_BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${ALPHA_VANTAGE_KEY}`;
  const data = await queueFetch(url);
  if (data && data['Realtime Currency Exchange Rate']) {
    const r = data['Realtime Currency Exchange Rate'];
    const result = { price: parseFloat(r['5. Exchange Rate']), bid: parseFloat(r['8. Bid Price']), ask: parseFloat(r['9. Ask Price']), source: 'live' };
    setCache(key, result); return result;
  }
  if (cached) return { ...cached, source: 'stale' };
  return null;
}

// US stocks — même symbole pour AV
export const STOCK_AV_MAP = {
  'AAPL': 'AAPL', 'MSFT': 'MSFT', 'GOOGL': 'GOOGL', 'AMZN': 'AMZN', 'TSLA': 'TSLA', 'NVDA': 'NVDA', 'META': 'META', 'NFLX': 'NFLX',
  'AVGO': 'AVGO', 'ORCL': 'ORCL', 'ADBE': 'ADBE', 'QCOM': 'QCOM', 'TXN': 'TXN', 'AMD': 'AMD', 'INTC': 'INTC', 'CRM': 'CRM',
  'CSCO': 'CSCO', 'IBM': 'IBM', 'UBER': 'UBER', 'SPOT': 'SPOT', 'NET': 'NET', 'SNOW': 'SNOW', 'PLTR': 'PLTR', 'COIN': 'COIN',
  'RBLX': 'RBLX', 'ABNB': 'ABNB', 'BKNG': 'BKNG', 'DIS': 'DIS', 'PYPL': 'PYPL', 'SQ': 'SQ', 'V': 'V', 'MA': 'MA',
  'SHOP': 'SHOP', 'DDOG': 'DDOG', 'ZM': 'ZM', 'DOCU': 'DOCU', 'MSTR': 'MSTR',
  'JPM': 'JPM', 'BAC': 'BAC', 'WFC': 'WFC', 'GS': 'GS', 'MS': 'MS', 'BLK': 'BLK', 'C': 'C', 'AXP': 'AXP', 'SCHW': 'SCHW', 'CME': 'CME',
  'JNJ': 'JNJ', 'LLY': 'LLY', 'UNH': 'UNH', 'PFE': 'PFE', 'ABBV': 'ABBV', 'AMGN': 'AMGN', 'GILD': 'GILD', 'TMO': 'TMO', 'MRK': 'MRK', 'BMY': 'BMY',
  'WMT': 'WMT', 'COST': 'COST', 'HD': 'HD', 'NKE': 'NKE', 'MCD': 'MCD', 'SBUX': 'SBUX', 'KO': 'KO', 'PEP': 'PEP', 'TGT': 'TGT', 'LOW': 'LOW', 'CMG': 'CMG',
  'XOM': 'XOM', 'CVX': 'CVX', 'BA': 'BA', 'GE': 'GE', 'CAT': 'CAT', 'HON': 'HON', 'UPS': 'UPS', 'LMT': 'LMT', 'RTX': 'RTX', 'DE': 'DE', 'FDX': 'FDX',
  // France (Euronext Paris)
  'MC.PA': 'MC.PAR', 'OR.PA': 'OR.PAR', 'TTE.PA': 'TTE.PAR', 'BN.PA': 'BN.PAR', 'AIR.PA': 'AIR.PAR', 'SAN.PA': 'SAN.PAR',
  'BNP.PA': 'BNP.PAR', 'AI.PA': 'AI.PAR', 'RI.PA': 'RI.PAR', 'DG.PA': 'DG.PAR', 'CAP.PA': 'CAP.PAR', 'ORA.PA': 'ORA.PAR',
  'KER.PA': 'KER.PAR', 'STE.PA': 'STLAM.PAR', 'ACA.PA': 'ACA.PAR', 'CS.PA': 'CS.PAR',
  // Allemagne (Xetra)
  'SAP.DE': 'SAP.DEX', 'SIE.DE': 'SIE.DEX', 'BAYN.DE': 'BAYN.DEX', 'BMW.DE': 'BMW.DEX',
  'ADS.DE': 'ADS.DEX', 'BAS.DE': 'BAS.DEX', 'ALV.DE': 'ALV.DEX', 'DTE.DE': 'DTE.DEX', 'VOW.DE': 'VOW.DEX', 'DB.DE': 'DB.DEX',
  // ETFs US
  'SPY': 'SPY', 'QQQ': 'QQQ', 'IWM': 'IWM', 'VTI': 'VTI', 'VOO': 'VOO', 'IVV': 'IVV', 'VEA': 'VEA', 'VXUS': 'VXUS', 'MGK': 'MGK', 'VUG': 'VUG', 'VTV': 'VTV', 'SCHB': 'SCHB',
  'GLD': 'GLD', 'IAU': 'IAU', 'SLV': 'SLV', 'GDX': 'GDX', 'GDXJ': 'GDXJ', 'USO': 'USO', 'UNG': 'UNG', 'PDBC': 'PDBC',
  'TLT': 'TLT', 'AGG': 'AGG', 'BND': 'BND', 'IEF': 'IEF', 'SHY': 'SHY', 'LQD': 'LQD', 'HYG': 'HYG', 'EMB': 'EMB', 'MUB': 'MUB',
  'XLF': 'XLF', 'XLE': 'XLE', 'XLK': 'XLK', 'XLV': 'XLV', 'XLU': 'XLU', 'XLC': 'XLC', 'XLI': 'XLI', 'XLB': 'XLB', 'XLP': 'XLP', 'XLY': 'XLY', 'XLRE': 'XLRE',
  'EEM': 'EEM', 'VGK': 'VGK', 'IEMG': 'IEMG', 'EWJ': 'EWJ', 'EWZ': 'EWZ', 'FXI': 'FXI', 'EWT': 'EWT', 'EWY': 'EWY', 'EWA': 'EWA', 'INDA': 'INDA', 'MCHI': 'MCHI',
  'ARKK': 'ARKK', 'ARKG': 'ARKG', 'ARKF': 'ARKF', 'SOXX': 'SOXX', 'SMH': 'SMH', 'BOTZ': 'BOTZ', 'CIBR': 'CIBR', 'CLOU': 'CLOU', 'FINX': 'FINX', 'KBWB': 'KBWB',
};

// Indices boursiers — AV supporte GLOBAL_QUOTE avec le préfixe ^
export const INDEX_AV_MAP = {
  '^GSPC': '^GSPC', '^DJI': '^DJI', '^IXIC': '^IXIC', '^NDX': '^NDX', '^RUT': '^RUT',
  '^FCHI': '^FCHI', '^GDAXI': '^GDAXI', '^FTSE': '^FTSE', '^STOXX50E': '^STOXX50E',
  '^IBEX': '^IBEX', '^N225': '^N225', '^HSI': '^HSI', '^KS11': '^KS11', '^AXJO': '^AXJO',
};

// Matières premières — endpoints dédiés AV (gratuit)
export const COMMODITY_ENDPOINT_MAP = {
  'BRENT': { fn: 'BRENT', unit: '$/bbl' },
  'WTI':   { fn: 'WTI',   unit: '$/bbl' },
  'NATGAS':{ fn: 'NATURAL_GAS', unit: '$/MMBtu' },
  'COPPER':{ fn: 'COPPER', unit: '$/metric ton' },
  'ALUMINUM':{ fn: 'ALUMINUM', unit: '$/metric ton' },
  'WHEAT': { fn: 'WHEAT', unit: '¢/bu' },
  'CORN':  { fn: 'CORN',  unit: '¢/bu' },
  'COTTON':{ fn: 'COTTON', unit: '¢/lb' },
  'SUGAR': { fn: 'SUGAR', unit: '¢/lb' },
  'COFFEE':{ fn: 'COFFEE', unit: '¢/lb' },
};

// Taux US Treasuries — endpoint AV TREASURY_YIELD (gratuit)
export const TREASURY_YIELD_MAP = {
  'US2Y': '2year', 'US5Y': '5year', 'US10Y': '10year', 'US30Y': '30year',
};

// Métaux précieux via CURRENCY_EXCHANGE_RATE
export const COMMODITY_AV_MAP = {
  'XAU': { from: 'XAU', to: 'USD', name: 'Or (Gold)', unit: '$/oz' },
  'XAG': { from: 'XAG', to: 'USD', name: 'Argent (Silver)', unit: '$/oz' },
  'PLATINUM': { from: 'XPT', to: 'USD', name: 'Platine', unit: '$/oz' },
  'PALLADIUM': { from: 'XPD', to: 'USD', name: 'Palladium', unit: '$/oz' },
};

// ── Indice boursier via GLOBAL_QUOTE ────────────────────────────────────────
export async function fetchIndexQuote(symbol) {
  return fetchStockQuote(symbol);
}

// ── Matière première via endpoint dédié AV ───────────────────────────────────
export async function fetchCommodityEndpoint(symbol) {
  const info = COMMODITY_ENDPOINT_MAP[symbol];
  if (!info) return null;
  const key = `COMMO_EP_${symbol}`;
  const cached = getCached(key);
  const now = new Date();
  const day = now.getUTCDay();
  const isWeekend = day === 0 || day === 6;
  if (cached && isCacheFresh(cached, !isWeekend)) return { ...cached, source: 'cache' };
  if (isWeekend && cached) return { ...cached, source: 'cache' };
  const url = `${AV_BASE}?function=${info.fn}&interval=daily&apikey=${ALPHA_VANTAGE_KEY}`;
  const data = await queueFetch(url);
  if (data && data.data && data.data.length > 0) {
    const latest = data.data.find(d => d.value !== '.' && d.value !== 'null');
    if (latest) {
      const result = { price: parseFloat(latest.value), date: latest.date, unit: info.unit, source: 'live' };
      setCache(key, result);
      return result;
    }
  }
  if (cached) return { ...cached, source: 'stale' };
  return null;
}

// ── Treasury Yield via TREASURY_YIELD ───────────────────────────────────────
export async function fetchTreasuryYield(symbol) {
  const maturity = TREASURY_YIELD_MAP[symbol];
  if (!maturity) return null;
  const key = `TREASURY_${symbol}`;
  const cached = getCached(key);
  const now = new Date();
  const day = now.getUTCDay();
  const isWeekend = day === 0 || day === 6;
  if (cached && isCacheFresh(cached, !isWeekend)) return { ...cached, source: 'cache' };
  if (isWeekend && cached) return { ...cached, source: 'cache' };
  const url = `${AV_BASE}?function=TREASURY_YIELD&interval=daily&maturity=${maturity}&apikey=${ALPHA_VANTAGE_KEY}`;
  const data = await queueFetch(url);
  if (data && data.data && data.data.length > 0) {
    const latest = data.data.find(d => d.value !== '.' && d.value !== 'null');
    if (latest) {
      const result = { price: parseFloat(latest.value), date: latest.date, unit: '%', source: 'live' };
      setCache(key, result);
      return result;
    }
  }
  if (cached) return { ...cached, source: 'stale' };
  return null;
}

export function clearCache() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && key.startsWith(CACHE_PREFIX)) keys.push(key); }
  keys.forEach(k => localStorage.removeItem(k));
  localStorage.removeItem(CALL_LOG_KEY);
}
