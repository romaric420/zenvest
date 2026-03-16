import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Lock, Zap, Crown, TrendingUp, Globe, BarChart3, Gem, LineChart, CandlestickChart, Activity, PieChart, Wallet, Shield, Terminal, BarChart2, Landmark, Layers, Calendar, Clock, Search, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import Footer from '../../components/Footer/Footer';
import MarketCalendar from './MarketCalendar';
import MarketSessions from './MarketSessions';
import { ALPHA_VANTAGE_KEY } from '../../config';
import { fetchStockQuote, fetchCommodityPrice, fetchIndexQuote, fetchCommodityEndpoint, fetchTreasuryYield, getRateLimitInfo, getCachedPrice, STOCK_AV_MAP, COMMODITY_AV_MAP, INDEX_AV_MAP, COMMODITY_ENDPOINT_MAP, TREASURY_YIELD_MAP } from '../../services/alphaVantageService';
import './Simulator.css';

const FEE = 0.0016;
const STORE_SIMPLE = 'zv_sim_simple_v2';
const STORE_ADV = 'zv_sim_adv_v3';
const TOP = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'LINK', 'AVAX', 'DOGE', 'SHIB', 'ATOM', 'UNI', 'AAVE', 'LTC', 'BCH', 'MATIC', 'ALGO', 'APT', 'ARB', 'OP', 'SUI', 'NEAR', 'INJ', 'SEI', 'FET', 'MKR', 'GRT', 'SAND', 'AXS', 'MANA', 'CRV', 'SNX', 'COMP', 'FIL', 'RUNE', 'PEPE', 'RENDER', 'TIA', 'STX', 'IMX'];
const SIMPLE_ASSETS = [{ k: 'btc', l: 'Bitcoin (BTC/EUR)' }, { k: 'eth', l: 'Ethereum (ETH/EUR)' }, { k: 'sol', l: 'Solana (SOL/EUR)' }, { k: 'dot', l: 'Polkadot (DOT/EUR)' }, { k: 'link', l: 'Chainlink (LINK/EUR)' }];
const STOCK_SYMBOLS = [
  // US TECH
  { s: 'AAPL', l: 'Apple', base: 238, fh: true }, { s: 'MSFT', l: 'Microsoft', base: 409, fh: true }, { s: 'GOOGL', l: 'Google', base: 175, fh: true }, { s: 'AMZN', l: 'Amazon', base: 213, fh: true }, { s: 'TSLA', l: 'Tesla', base: 280, fh: true }, { s: 'NVDA', l: 'NVIDIA', base: 135, fh: true }, { s: 'META', l: 'Meta', base: 590, fh: true }, { s: 'NFLX', l: 'Netflix', base: 960, fh: true }, { s: 'AVGO', l: 'Broadcom', base: 235, fh: true }, { s: 'ORCL', l: 'Oracle', base: 155, fh: true }, { s: 'ADBE', l: 'Adobe', base: 390, fh: true }, { s: 'QCOM', l: 'Qualcomm', base: 165, fh: true }, { s: 'TXN', l: 'Texas Instruments', base: 190, fh: true }, { s: 'AMD', l: 'AMD', base: 115, fh: true }, { s: 'INTC', l: 'Intel', base: 20, fh: true }, { s: 'CRM', l: 'Salesforce', base: 315, fh: true }, { s: 'CSCO', l: 'Cisco', base: 55, fh: true }, { s: 'IBM', l: 'IBM', base: 225, fh: true }, { s: 'UBER', l: 'Uber', base: 72, fh: true }, { s: 'SPOT', l: 'Spotify', base: 500, fh: true }, { s: 'NET', l: 'Cloudflare', base: 120, fh: true }, { s: 'SNOW', l: 'Snowflake', base: 170, fh: true }, { s: 'PLTR', l: 'Palantir', base: 80, fh: true }, { s: 'COIN', l: 'Coinbase', base: 250, fh: true }, { s: 'RBLX', l: 'Roblox', base: 45, fh: true }, { s: 'ABNB', l: 'Airbnb', base: 140, fh: true }, { s: 'BKNG', l: 'Booking Holdings', base: 4800, fh: true }, { s: 'DIS', l: 'Disney', base: 102, fh: true }, { s: 'PYPL', l: 'PayPal', base: 78, fh: true }, { s: 'SQ', l: 'Block', base: 90, fh: true }, { s: 'MSTR', l: 'MicroStrategy', base: 320, fh: true }, { s: 'V', l: 'Visa', base: 340, fh: true }, { s: 'MA', l: 'Mastercard', base: 550, fh: true }, { s: 'SHOP', l: 'Shopify', base: 115, fh: true }, { s: 'DDOG', l: 'Datadog', base: 148, fh: true }, { s: 'ZM', l: 'Zoom', base: 76, fh: true }, { s: 'DOCU', l: 'DocuSign', base: 85, fh: true },
  // US FINANCE
  { s: 'JPM', l: 'JP Morgan', base: 248, fh: true }, { s: 'BAC', l: 'Bank of America', base: 46, fh: true }, { s: 'WFC', l: 'Wells Fargo', base: 76, fh: true }, { s: 'GS', l: 'Goldman Sachs', base: 590, fh: true }, { s: 'MS', l: 'Morgan Stanley', base: 130, fh: true }, { s: 'BLK', l: 'BlackRock', base: 1020, fh: true }, { s: 'C', l: 'Citigroup', base: 78, fh: true }, { s: 'AXP', l: 'American Express', base: 310, fh: true }, { s: 'SCHW', l: 'Charles Schwab', base: 75, fh: true }, { s: 'CME', l: 'CME Group', base: 240, fh: true },
  // US HEALTHCARE
  { s: 'JNJ', l: 'Johnson & Johnson', base: 155, fh: true }, { s: 'LLY', l: 'Eli Lilly', base: 830, fh: true }, { s: 'UNH', l: 'UnitedHealth', base: 490, fh: true }, { s: 'PFE', l: 'Pfizer', base: 25, fh: true }, { s: 'ABBV', l: 'AbbVie', base: 190, fh: true }, { s: 'AMGN', l: 'Amgen', base: 280, fh: true }, { s: 'GILD', l: 'Gilead Sciences', base: 100, fh: true }, { s: 'TMO', l: 'Thermo Fisher', base: 500, fh: true }, { s: 'MRK', l: 'Merck', base: 115, fh: true }, { s: 'BMY', l: 'Bristol-Myers', base: 60, fh: true },
  // US CONSUMER / RETAIL
  { s: 'WMT', l: 'Walmart', base: 100, fh: true }, { s: 'COST', l: 'Costco', base: 1000, fh: true }, { s: 'HD', l: 'Home Depot', base: 405, fh: true }, { s: 'NKE', l: 'Nike', base: 74, fh: true }, { s: 'MCD', l: "McDonald's", base: 295, fh: true }, { s: 'SBUX', l: 'Starbucks', base: 89, fh: true }, { s: 'KO', l: 'Coca-Cola', base: 64, fh: true }, { s: 'PEP', l: 'PepsiCo', base: 158, fh: true }, { s: 'TGT', l: 'Target', base: 128, fh: true }, { s: 'LOW', l: "Lowe's", base: 270, fh: true }, { s: 'CMG', l: 'Chipotle', base: 55, fh: true },
  // US ENERGY / INDUSTRIAL
  { s: 'XOM', l: 'ExxonMobil', base: 112, fh: true }, { s: 'CVX', l: 'Chevron', base: 155, fh: true }, { s: 'BA', l: 'Boeing', base: 185, fh: true }, { s: 'GE', l: 'GE Aerospace', base: 218, fh: true }, { s: 'CAT', l: 'Caterpillar', base: 375, fh: true }, { s: 'HON', l: 'Honeywell', base: 220, fh: true }, { s: 'UPS', l: 'UPS', base: 132, fh: true }, { s: 'LMT', l: 'Lockheed Martin', base: 490, fh: true }, { s: 'RTX', l: 'RTX Corp', base: 126, fh: true }, { s: 'DE', l: 'Deere & Co', base: 430, fh: true }, { s: 'FDX', l: 'FedEx', base: 280, fh: true },
  // FRANCE
  { s: 'MC.PA', l: 'LVMH', base: 870 }, { s: 'OR.PA', l: "L'Oréal", base: 380 }, { s: 'TTE.PA', l: 'TotalEnergies', base: 58 }, { s: 'BN.PA', l: 'Danone', base: 68 }, { s: 'AIR.PA', l: 'Airbus', base: 175 }, { s: 'SAN.PA', l: 'Sanofi', base: 102 }, { s: 'BNP.PA', l: 'BNP Paribas', base: 65 }, { s: 'AI.PA', l: 'Air Liquide', base: 168 }, { s: 'RI.PA', l: 'Pernod Ricard', base: 87 }, { s: 'DG.PA', l: 'Vinci', base: 125 }, { s: 'CAP.PA', l: 'Capgemini', base: 175 }, { s: 'ORA.PA', l: 'Orange', base: 10.5 }, { s: 'KER.PA', l: 'Kering', base: 250 }, { s: 'STE.PA', l: 'Stellantis', base: 12 }, { s: 'ACA.PA', l: 'Crédit Agricole', base: 14.5 }, { s: 'CS.PA', l: 'AXA', base: 32 },
  // ALLEMAGNE
  { s: 'SAP.DE', l: 'SAP', base: 260 }, { s: 'SIE.DE', l: 'Siemens', base: 235 }, { s: 'BAYN.DE', l: 'Bayer', base: 18 }, { s: 'BMW.DE', l: 'BMW', base: 80 }, { s: 'ADS.DE', l: 'Adidas', base: 222 }, { s: 'BAS.DE', l: 'BASF', base: 42 }, { s: 'ALV.DE', l: 'Allianz', base: 320 }, { s: 'DTE.DE', l: 'Deutsche Telekom', base: 28 }, { s: 'VOW.DE', l: 'Volkswagen', base: 82 }, { s: 'DB.DE', l: 'Deutsche Bank', base: 18 },
  // UK
  { s: 'SHEL.L', l: 'Shell', base: 26.5 }, { s: 'BP.L', l: 'BP', base: 4.1 }, { s: 'HSBA.L', l: 'HSBC', base: 8.5 }, { s: 'AZN.L', l: 'AstraZeneca', base: 118 }, { s: 'ULVR.L', l: 'Unilever', base: 44 }, { s: 'GSK.L', l: 'GSK', base: 17.5 }, { s: 'RIO.L', l: 'Rio Tinto', base: 48 }, { s: 'BATS.L', l: 'BAT', base: 28 },
];
const INDEX_SYMBOLS = [
  // AMÉRIQUES
  { s: '^GSPC', l: 'S&P 500', base: 5680 }, { s: '^DJI', l: 'Dow Jones', base: 42100 }, { s: '^IXIC', l: 'NASDAQ Composite', base: 17800 }, { s: '^NDX', l: 'NASDAQ 100', base: 19800 }, { s: '^RUT', l: 'Russell 2000', base: 2080 }, { s: '^MID', l: 'S&P 400 MidCap', base: 3100 }, { s: '^BVSP', l: 'Bovespa (Brésil)', base: 124000 }, { s: '^MXX', l: 'IPC Mexico', base: 53000 },
  // EUROPE
  { s: '^FCHI', l: 'CAC 40 (Paris)', base: 8104 }, { s: '^GDAXI', l: 'DAX 40 (Frankfurt)', base: 24340 }, { s: '^FTSE', l: 'FTSE 100 (Londres)', base: 8680 }, { s: '^STOXX50E', l: 'Euro Stoxx 50', base: 5746 }, { s: '^IBEX', l: 'IBEX 35 (Madrid)', base: 13200 }, { s: '^FTSEMIB', l: 'FTSE MIB (Milan)', base: 38000 }, { s: '^AEX', l: 'AEX (Amsterdam)', base: 920 }, { s: '^SSMI', l: 'SMI (Zurich)', base: 12500 }, { s: '^OMXS30', l: 'OMX Stockholm 30', base: 2650 }, { s: '^BFX', l: 'BEL 20 (Bruxelles)', base: 4200 }, { s: '^PSI20', l: 'PSI 20 (Lisbonne)', base: 6700 }, { s: '^ATX', l: 'ATX (Vienne)', base: 3900 },
  // ASIE-PACIFIQUE
  { s: '^N225', l: 'Nikkei 225 (Tokyo)', base: 38500 }, { s: '^HSI', l: 'Hang Seng (HK)', base: 21000 }, { s: '^KS11', l: 'KOSPI (Séoul)', base: 2450 }, { s: '^AXJO', l: 'ASX 200 (Sydney)', base: 8400 }, { s: '^TWII', l: 'TAIEX (Taiwan)', base: 23000 }, { s: '^STI', l: 'Straits Times (SG)', base: 3900 }, { s: '^SENSEX', l: 'BSE Sensex (Inde)', base: 75000 }, { s: '^NSEI', l: 'Nifty 50 (Inde)', base: 22800 }, { s: '^KLCI', l: 'KLCI (Malaisie)', base: 1580 }, { s: '^SET', l: 'SET (Thaïlande)', base: 1380 },
  // MOYEN-ORIENT / AFRIQUE
  { s: '^TA125', l: 'TA-125 (Tel Aviv)', base: 2800 }, { s: '^TASI', l: 'Tadawul (Arabie)', base: 12500 },
];
const ETF_SYMBOLS = [
  // US BROAD MARKET
  { s: 'SPY', l: 'SPDR S&P 500', base: 580, fh: true }, { s: 'QQQ', l: 'Invesco NASDAQ 100', base: 490, fh: true }, { s: 'IWM', l: 'iShares Russell 2000', base: 215, fh: true }, { s: 'VTI', l: 'Vanguard Total Market', base: 275, fh: true }, { s: 'VOO', l: 'Vanguard S&P 500', base: 530, fh: true }, { s: 'IVV', l: 'iShares Core S&P 500', base: 582, fh: true }, { s: 'VEA', l: 'Vanguard Dev Markets', base: 52, fh: true }, { s: 'VXUS', l: 'Vanguard Total Intl', base: 62, fh: true }, { s: 'MGK', l: 'Vanguard Mega Cap Gr', base: 340, fh: true }, { s: 'VUG', l: 'Vanguard Growth', base: 390, fh: true }, { s: 'VTV', l: 'Vanguard Value', base: 165, fh: true }, { s: 'SCHB', l: 'Schwab US Broad Mkt', base: 62, fh: true },
  // SECTORIELS US
  { s: 'XLF', l: 'Financial Select', base: 50, fh: true }, { s: 'XLE', l: 'Energy Select', base: 95, fh: true }, { s: 'XLK', l: 'Technology Select', base: 235, fh: true }, { s: 'XLV', l: 'Health Care Select', base: 148, fh: true }, { s: 'XLU', l: 'Utilities Select', base: 68, fh: true }, { s: 'XLC', l: 'Comm Services Select', base: 98, fh: true }, { s: 'XLI', l: 'Industrials Select', base: 130, fh: true }, { s: 'XLB', l: 'Materials Select', base: 90, fh: true }, { s: 'XLP', l: 'Consumer Staples', base: 78, fh: true }, { s: 'XLY', l: 'Consumer Disc Select', base: 210, fh: true }, { s: 'XLRE', l: 'Real Estate Select', base: 40, fh: true },
  // OBLIGATAIRES
  { s: 'TLT', l: 'iShares 20+ Yr Bond', base: 88, fh: true }, { s: 'AGG', l: 'iShares Core US Bond', base: 95, fh: true }, { s: 'BND', l: 'Vanguard Total Bond', base: 73, fh: true }, { s: 'IEF', l: 'iShares 7-10yr Bond', base: 93, fh: true }, { s: 'SHY', l: 'iShares 1-3yr Bond', base: 82, fh: true }, { s: 'LQD', l: 'iShares Corp Bond', base: 108, fh: true }, { s: 'HYG', l: 'iShares High Yield', base: 76, fh: true }, { s: 'EMB', l: 'iShares EM Bond', base: 90, fh: true }, { s: 'MUB', l: 'iShares Muni Bond', base: 106, fh: true },
  // MATIÈRES PREMIÈRES
  { s: 'GLD', l: 'SPDR Gold Trust', base: 280, fh: true }, { s: 'IAU', l: 'iShares Gold', base: 56, fh: true }, { s: 'SLV', l: 'iShares Silver', base: 32, fh: true }, { s: 'GDX', l: 'VanEck Gold Miners', base: 40, fh: true }, { s: 'GDXJ', l: 'VanEck Jr Gold Miners', base: 48, fh: true }, { s: 'USO', l: 'US Oil Fund', base: 78, fh: true }, { s: 'UNG', l: 'US Natural Gas Fund', base: 15, fh: true }, { s: 'PDBC', l: 'Invesco Commodity', base: 14, fh: true },
  // INTERNATIONAUX
  { s: 'EEM', l: 'iShares Emerging Mkts', base: 46, fh: true }, { s: 'VGK', l: 'Vanguard FTSE Europe', base: 72, fh: true }, { s: 'IEMG', l: 'iShares Core EM', base: 58, fh: true }, { s: 'EWJ', l: 'iShares Japan', base: 68, fh: true }, { s: 'EWZ', l: 'iShares Brazil', base: 28, fh: true }, { s: 'FXI', l: 'iShares China Large', base: 30, fh: true }, { s: 'EWT', l: 'iShares Taiwan', base: 58, fh: true }, { s: 'EWY', l: 'iShares South Korea', base: 58, fh: true }, { s: 'EWA', l: 'iShares Australia', base: 26, fh: true }, { s: 'INDA', l: 'iShares India', base: 52, fh: true }, { s: 'MCHI', l: 'iShares MSCI China', base: 50, fh: true },
  // THÉMATIQUES / TECH
  { s: 'ARKK', l: 'ARK Innovation', base: 55, fh: true }, { s: 'ARKG', l: 'ARK Genomic Rev', base: 28, fh: true }, { s: 'ARKF', l: 'ARK Fintech', base: 22, fh: true }, { s: 'SOXX', l: 'iShares Semiconductors', base: 240, fh: true }, { s: 'SMH', l: 'VanEck Semiconductors', base: 265, fh: true }, { s: 'BOTZ', l: 'Global Robotics/AI', base: 32, fh: true }, { s: 'CIBR', l: 'ETFMG Cybersecurity', base: 32, fh: true }, { s: 'CLOU', l: 'Global Cloud Comp', base: 26, fh: true }, { s: 'FINX', l: 'Global FinTech', base: 30, fh: true }, { s: 'KBWB', l: 'Invesco KBW Banking', base: 72, fh: true },
];
const COMMODITY_SYMBOLS = [
  // MÉTAUX PRÉCIEUX (prix réels via AV)
  { s: 'XAU', l: 'Or (Gold)', base: 3100, unit: '$/oz' }, { s: 'XAG', l: 'Argent (Silver)', base: 35, unit: '$/oz' }, { s: 'PLATINUM', l: 'Platine', base: 1000, unit: '$/oz' }, { s: 'PALLADIUM', l: 'Palladium', base: 950, unit: '$/oz' },
  // MÉTAUX INDUSTRIELS
  { s: 'COPPER', l: 'Cuivre', base: 4.6, unit: '$/lb' }, { s: 'ALUMINUM', l: 'Aluminium', base: 2550, unit: '$/t' }, { s: 'ZINC', l: 'Zinc', base: 2900, unit: '$/t' }, { s: 'NICKEL', l: 'Nickel', base: 16500, unit: '$/t' }, { s: 'LEAD', l: 'Plomb', base: 2100, unit: '$/t' }, { s: 'TIN', l: 'Étain', base: 32000, unit: '$/t' }, { s: 'IRON', l: 'Minerai de Fer', base: 108, unit: '$/t' },
  // ÉNERGIE
  { s: 'BRENT', l: 'Pétrole Brent', base: 78, unit: '$/bbl' }, { s: 'WTI', l: 'Pétrole WTI', base: 74, unit: '$/bbl' }, { s: 'NATGAS', l: 'Gaz Naturel (US)', base: 2.5, unit: '$/MMBtu' }, { s: 'GASOLINE', l: 'Essence (RBOB)', base: 2.3, unit: '$/gal' }, { s: 'HEATING_OIL', l: 'Fioul', base: 2.6, unit: '$/gal' }, { s: 'URANIUM', l: 'Uranium', base: 95, unit: '$/lb' },
  // AGRI — CÉRÉALES
  { s: 'WHEAT', l: 'Blé', base: 550, unit: '¢/bu' }, { s: 'CORN', l: 'Maïs', base: 430, unit: '¢/bu' }, { s: 'SOYBEAN', l: 'Soja', base: 1000, unit: '¢/bu' }, { s: 'RICE', l: 'Riz', base: 550, unit: '¢/cwt' }, { s: 'OATS', l: 'Avoine', base: 380, unit: '¢/bu' }, { s: 'CANOLA', l: 'Canola', base: 650, unit: '¢/bu' },
  // AGRI — SOFT
  { s: 'COFFEE', l: 'Café', base: 380, unit: '¢/lb' }, { s: 'SUGAR', l: 'Sucre', base: 20, unit: '¢/lb' }, { s: 'COCOA', l: 'Cacao', base: 10000, unit: '$/t' }, { s: 'COTTON', l: 'Coton', base: 72, unit: '¢/lb' }, { s: 'OJ', l: 'Jus d\'Orange', base: 480, unit: '¢/lb' }, { s: 'LUMBER', l: 'Bois de Construction', base: 520, unit: '$/Mbf' },
  // AGRI — BÉTAIL
  { s: 'LIVE_CATTLE', l: 'Bétail Vivant', base: 195, unit: '¢/lb' }, { s: 'LEAN_HOGS', l: 'Porcs', base: 88, unit: '¢/lb' },
];
const BOND_SYMBOLS = [
  // US TREASURIES
  { s: 'US1Y', l: 'US Treasury 1Y', base: 4.55, unit: '%' }, { s: 'US2Y', l: 'US Treasury 2Y', base: 4.28, unit: '%' }, { s: 'US3Y', l: 'US Treasury 3Y', base: 4.20, unit: '%' }, { s: 'US5Y', l: 'US Treasury 5Y', base: 4.18, unit: '%' }, { s: 'US7Y', l: 'US Treasury 7Y', base: 4.25, unit: '%' }, { s: 'US10Y', l: 'US Treasury 10Y', base: 4.35, unit: '%' }, { s: 'US20Y', l: 'US Treasury 20Y', base: 4.58, unit: '%' }, { s: 'US30Y', l: 'US Treasury 30Y', base: 4.62, unit: '%' },
  // EUROPE
  { s: 'DE2Y', l: 'Bund Allemand 2Y', base: 2.42, unit: '%' }, { s: 'DE10Y', l: 'Bund Allemand 10Y', base: 2.78, unit: '%' }, { s: 'FR10Y', l: 'OAT France 10Y', base: 3.45, unit: '%' }, { s: 'UK10Y', l: 'Gilt UK 10Y', base: 4.60, unit: '%' }, { s: 'IT10Y', l: 'BTP Italie 10Y', base: 3.85, unit: '%' }, { s: 'ES10Y', l: 'Bonos Espagne 10Y', base: 3.38, unit: '%' }, { s: 'CH10Y', l: 'OIS Suisse 10Y', base: 0.82, unit: '%' }, { s: 'NL10Y', l: 'DSL Pays-Bas 10Y', base: 2.90, unit: '%' }, { s: 'AT10Y', l: 'RAGB Autriche 10Y', base: 3.10, unit: '%' }, { s: 'BE10Y', l: 'OLO Belgique 10Y', base: 3.20, unit: '%' }, { s: 'PT10Y', l: 'OT Portugal 10Y', base: 3.15, unit: '%' }, { s: 'SE10Y', l: 'SGB Suède 10Y', base: 2.35, unit: '%' }, { s: 'NO10Y', l: 'NGB Norvège 10Y', base: 3.80, unit: '%' },
  // ASIE / ÉMERGENTS
  { s: 'JP10Y', l: 'JGB Japon 10Y', base: 1.48, unit: '%' }, { s: 'AU10Y', l: 'ACGB Australie 10Y', base: 4.35, unit: '%' }, { s: 'CN10Y', l: 'CGB Chine 10Y', base: 2.10, unit: '%' }, { s: 'IN10Y', l: 'Inde Govt 10Y', base: 6.85, unit: '%' }, { s: 'BR10Y', l: 'NTN-F Brésil 10Y', base: 13.5, unit: '%' }, { s: 'MX10Y', l: 'Mbono Mexique 10Y', base: 10.2, unit: '%' },
];

/* ═══ ALPHA VANTAGE — Prix réels actions, ETFs & matières premières ═══ */
const AV_ENABLED = ALPHA_VANTAGE_KEY && ALPHA_VANTAGE_KEY !== 'YOUR_AV_KEY_HERE';

function initFromCache(symbols) {
  const d = {};
  symbols.forEach(sym => {
    const cached = getCachedPrice(sym.s) || getCachedPrice(STOCK_AV_MAP[sym.s]);
    if (cached && cached.price) {
      const pct = cached.changePct || (cached.change ? (cached.change / (cached.price - cached.change)) * 100 : 0);
      d[sym.s] = { price: cached.price, move: pct, name: sym.l, unit: sym.unit || '', source: 'cache', lastUpdate: cached.cachedAt };
    } else {
      const v = (Math.random() - .48) * 1.8;
      const dec = sym.base < 10 ? 3 : 2;
      d[sym.s] = { price: +(sym.base * (1 + v / 100)).toFixed(dec), move: +v.toFixed(2), name: sym.l, unit: sym.unit || '', source: 'simulated' };
    }
  });
  return d;
}

async function fetchAVPrices(symbols, setter) {
  if (!AV_ENABLED) return;
  for (const sym of symbols) {
    const avSym = STOCK_AV_MAP[sym.s] || sym.s;
    if (!avSym || !getRateLimitInfo().canCall) break;
    try {
      const quote = await fetchStockQuote(avSym);
      if (quote && quote.price) {
        setter(prev => ({ ...prev, [sym.s]: { ...prev[sym.s], price: quote.price, move: quote.changePct || 0, high: quote.high, low: quote.low, volume: quote.volume, lastDay: quote.lastDay, source: quote.source === 'live' ? 'live' : 'cache', lastUpdate: Date.now() } }));
      }
    } catch (e) { console.warn('[AV]', sym.s, e); }
  }
}

async function fetchAVCommodities(symbols, setter) {
  if (!AV_ENABLED) return;
  for (const sym of symbols) {
    const avInfo = COMMODITY_AV_MAP[sym.s];
    if (!avInfo || !getRateLimitInfo().canCall) break;
    try {
      const quote = await fetchCommodityPrice(avInfo.from, avInfo.to);
      if (quote && quote.price) {
        setter(prev => ({ ...prev, [sym.s]: { ...prev[sym.s], price: quote.price, source: quote.source === 'live' ? 'live' : 'cache', lastUpdate: Date.now() } }));
      }
    } catch (e) { console.warn('[AV]', sym.s, e); }
  }
}

// Indices via GLOBAL_QUOTE AV (^GSPC, ^FCHI, ^N225…)
async function fetchAVIndices(symbols, setter) {
  if (!AV_ENABLED) return;
  for (const sym of symbols) {
    const avSym = INDEX_AV_MAP[sym.s];
    if (!avSym || !getRateLimitInfo().canCall) break;
    try {
      const quote = await fetchIndexQuote(avSym);
      if (quote && quote.price) {
        setter(prev => ({ ...prev, [sym.s]: { ...prev[sym.s], price: quote.price, move: quote.changePct || 0, high: quote.high, low: quote.low, lastDay: quote.lastDay, source: quote.source === 'live' ? 'live' : 'cache', lastUpdate: Date.now() } }));
      }
    } catch (e) { console.warn('[AV-IDX]', sym.s, e); }
  }
}

// Matières via endpoints dédiés AV (WTI, BRENT, WHEAT, CORN…)
async function fetchAVCommodityEP(symbols, setter) {
  if (!AV_ENABLED) return;
  for (const sym of symbols) {
    if (!COMMODITY_ENDPOINT_MAP[sym.s] || !getRateLimitInfo().canCall) continue;
    try {
      const quote = await fetchCommodityEndpoint(sym.s);
      if (quote && quote.price) {
        setter(prev => ({ ...prev, [sym.s]: { ...prev[sym.s], price: quote.price, source: quote.source === 'live' ? 'live' : 'cache', lastUpdate: Date.now() } }));
      }
    } catch (e) { console.warn('[AV-COMMO-EP]', sym.s, e); }
  }
}

// Taux US Treasuries via TREASURY_YIELD AV (US2Y, US5Y, US10Y, US30Y)
async function fetchAVTreasury(symbols, setter) {
  if (!AV_ENABLED) return;
  for (const sym of symbols) {
    if (!TREASURY_YIELD_MAP[sym.s] || !getRateLimitInfo().canCall) break;
    try {
      const quote = await fetchTreasuryYield(sym.s);
      if (quote && quote.price) {
        setter(prev => ({ ...prev, [sym.s]: { ...prev[sym.s], price: quote.price, source: quote.source === 'live' ? 'live' : 'cache', lastUpdate: Date.now() } }));
      }
    } catch (e) { console.warn('[AV-BOND]', sym.s, e); }
  }
}

function MarketStatusBar({ activeTab }) {
  const [info, setInfo] = useState({ used: 0, remaining: 25, total: 25 });
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => { setTime(new Date()); if (AV_ENABLED) setInfo(getRateLimitInfo()); }, 5000);
    if (AV_ENABLED) setInfo(getRateLimitInfo());
    return () => clearInterval(i);
  }, []);
  const getStatus = () => {
    if (activeTab === 'crypto') return { open: true, label: 'Crypto — 24/7', color: '#0ecb81' };
    const day = time.getUTCDay();
    if (day === 0 || day === 6) return { open: false, label: 'Weekend — Marchés fermés', color: '#f6465d' };
    const utcH = time.getUTCHours() + time.getUTCMinutes() / 60;
    if (activeTab === 'forex') {
      // Sessions Forex en heure UTC : Sydney 22h-07h · Tokyo 00h-09h · Londres 08h-17h · New York 13h-22h
      const sessions = [];
      if (utcH >= 22 || utcH < 7) sessions.push('Sydney 22h-07h');
      if (utcH >= 0 && utcH < 9) sessions.push('Tokyo 00h-09h');
      if (utcH >= 8 && utcH < 17) sessions.push('Londres 08h-17h');
      if (utcH >= 13 && utcH < 22) sessions.push('New York 13h-22h');
      return { open: true, label: sessions.length ? `Forex · ${sessions.join(' + ')}` : 'Forex 24/5 — Entre sessions', color: '#0ecb81' };
    }
    if (['stocks', 'etfs', 'indices'].includes(activeTab)) {
      // Bourses en UTC : Tokyo 00h-06h · EU (Euronext/Xetra/LSE) 08h-16h30 · NYSE/NASDAQ 14h30-21h
      const sessions = [];
      if (utcH >= 0 && utcH < 6) sessions.push('Tokyo 00h-06h');
      if (utcH >= 1.5 && utcH < 7) sessions.push('HK/Sydney 01h30-07h');
      if (utcH >= 8 && utcH < 16.5) sessions.push('EU 08h-16h30');
      if (utcH >= 14.5 && utcH < 21) sessions.push('NYSE/NASDAQ 14h30-21h');
      if (sessions.length) return { open: true, label: sessions.join(' · '), color: '#0ecb81' };
      return { open: false, label: 'Actions — Marchés fermés', color: '#f6465d' };
    }
    if (activeTab === 'commodities') {
      // CME/NYMEX : 23h-22h (23h/24, pause 1h) · CBOT agri : 01h30-19h20 UTC
      const pause = utcH >= 22 && utcH < 23;
      const agriOpen = utcH >= 1.5 && utcH < 19.33;
      if (pause) return { open: false, label: 'Matières — Pause 22h-23h UTC', color: '#f59e0b' };
      if (agriOpen) return { open: true, label: 'Métaux/Énergie 23h/24 · Agri 01h30-19h20 UTC', color: '#0ecb81' };
      return { open: true, label: 'Or/Argent/Pétrole ouverts 23h/24 UTC', color: '#0ecb81' };
    }
    if (activeTab === 'bonds') {
      // Obligations : Europe 07h-18h UTC · US Treasuries 12h30-21h UTC
      const euOpen = utcH >= 7 && utcH < 18;
      const usOpen = utcH >= 12.5 && utcH < 21;
      if (euOpen && usOpen) return { open: true, label: 'Oblig EU 07h-18h · US 12h30-21h UTC', color: '#0ecb81' };
      if (euOpen) return { open: true, label: 'Oblig Europe ouvert 07h-18h UTC', color: '#0ecb81' };
      if (usOpen) return { open: true, label: 'US Treasuries ouverts 12h30-21h UTC', color: '#0ecb81' };
      return { open: false, label: 'Obligations — Marchés fermés', color: '#f6465d' };
    }
    return { open: true, label: '', color: '#888' };
  };
  const st = getStatus();
  return (<div className="sa-market-status">
    <div className="sa-market-status__left">{st.open ? <Wifi size={12} /> : <WifiOff size={12} />}<span className="sa-market-status__dot" style={{ background: st.color }} /><span>{st.label}</span></div>
    <div className="sa-market-status__right">
      {AV_ENABLED ? <span className="sa-market-status__api" title={`Alpha Vantage: ${info.used}/${info.total} appels`}><span className="sa-av-badge">AV</span> {info.remaining}/{info.total}</span>
        : <span className="sa-market-status__api sa-market-status__api--sim" title="Configurer Alpha Vantage dans config.js"><span className="sa-av-badge sa-av-badge--sim">SIM</span> Prix simulés</span>}
      <Clock size={11} style={{ opacity: 0.5 }} />
      <span style={{ fontFamily: 'var(--zv-mono)', fontSize: '0.7rem', opacity: 0.6 }}>{time.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} UTC · {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} Local</span>
    </div>
  </div>);
}

function SourceBadge({ source }) {
  if (!source || source === 'simulated') return null;
  const cfg = source === 'live' ? { label: 'LIVE', bg: '#0ecb81' } : source === 'cache' ? { label: 'CACHED', bg: '#f59e0b' } : { label: 'STALE', bg: '#888' };
  return <span className="sa-source-badge" style={{ background: cfg.bg }}>{cfg.label}</span>;
}

function genSimData(symbols, vol = 1.8) { const d = {}; symbols.forEach(sym => { const v = (Math.random() - .48) * vol; const dec = sym.base < 10 ? 3 : 2; d[sym.s] = { price: +(sym.base * (1 + v / 100)).toFixed(dec), move: +v.toFixed(2), name: sym.l, unit: sym.unit || '' } }); return d }
function microTick(prev, vol = 0.4) { const u = {}; Object.entries(prev).forEach(([k, v]) => { const m = (Math.random() - 0.5) * vol; const dec = v.price < 10 ? 3 : 2; u[k] = { ...v, price: +(v.price * (1 + m / 100)).toFixed(dec), move: +(v.move + m * 0.08).toFixed(2) } }); return u }
function fmt(v, d) { if (v == null) return '—'; const dd = d !== undefined ? d : Math.abs(v) < .01 ? 6 : Math.abs(v) < 1 ? 4 : Math.abs(v) < 100 ? 3 : 2; return v.toLocaleString('fr-FR', { minimumFractionDigits: dd, maximumFractionDigits: dd }) }
function fE(v) { return fmt(v, 2) + ' €' }
function fS(v, s = '€') { return (v >= 0 ? '+' : '') + fmt(v, 2) + (s ? ' ' + s : '') }
function calc(t, p) { if (!p) return { net: 0, pct: 0, fees: 0, val: t.amount, qty: 0 }; const q = t.amount / t.entry; const r = t.type === 'long' ? (p - t.entry) * q : (t.entry - p) * q; const ef = t.amount * FEE; const xf = Math.abs(t.amount + r) * FEE; const f = ef + xf; const n = r - f; return { net: n, pct: (n / t.amount) * 100, fees: f, val: t.amount + n, qty: q } }
function cleanK(n) { if (n.includes('XBT')) return 'btc'; const MAP = {'XETHZEUR':'eth','XXRPZEUR':'xrp','XXLMZEUR':'xlm','XXMRZEUR':'xmr','XXDGZEUR':'doge'}; if (MAP[n]) return MAP[n]; return n.replace(/ZEUR$/i, '').replace(/EUR$/i, '').replace(/^X{1,2}/, '').toLowerCase() }
function badge(title) { const t = title.toLowerCase(); if (/crypto|bitcoin|btc|eth|sec |binance|coinbase|blockchain/.test(t)) return { c: 'CRYPTO', bg: '#8b5cf6' }; if (/geo|war|conflict|china|russia|iran|tariff/.test(t)) return { c: 'GEO', bg: '#f59e0b' }; if (/fed |inflation|rates?|powell|central bank/.test(t)) return { c: 'URGENT', bg: '#ef4444' }; if (/tech|ai |intelligence|nvidia|apple|google/.test(t)) return { c: 'TECH', bg: '#3b82f6' }; return { c: 'MACRO', bg: '#10b981' } }

function TickerMarquee({ items }) { if (!items || items.length === 0) return <div className="sa-ticker"><div className="sa-ticker__track" style={{ animation: 'none' }}><span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem' }}>Connexion marché...</span></div></div>; const R = (pfx) => items.map(([sym, d], i) => <React.Fragment key={`${pfx}-${sym}`}>{i > 0 && <span className="sa-ticker__sep">·</span>}<div className="sa-ticker__item"><span className="sa-ticker__pair">{sym}</span><span className="sa-ticker__price">{d.unit === '%' ? d.price.toFixed(2) + '%' : fmt(d.price) + (d.unit ? ' ' + d.unit : '€')}</span><span className={`sa-ticker__ch ${d.move >= 0 ? 'sa-ticker__ch--up' : 'sa-ticker__ch--dn'}`}>{d.move >= 0 ? '+' : ''}{d.move.toFixed(2)}%</span></div></React.Fragment>); return <div className="sa-ticker"><div className="sa-ticker__track">{R('a')}<span className="sa-ticker__sep">·</span>{R('b')}</div></div> }

function SimpleSimulator() {
  const [st, setSt] = useState(() => { try { const s = localStorage.getItem(STORE_SIMPLE); if (s) return JSON.parse(s) } catch { } return { initCap: 2000, cash: 2000, trades: {}, alerts: [], history: [] } }); const [mk, setMk] = useState({}); const [toast, setToast] = useState(''); const [tv, setTv] = useState(false); const timer = useRef(null); const chartRef = useRef(null); const chartInst = useRef(null); const show = (m) => { setToast(m); setTv(true); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setTv(false), 3000) }; useEffect(() => { localStorage.setItem(STORE_SIMPLE, JSON.stringify(st)) }, [st]); const sync = useCallback(async () => { try { const r = await fetch('https://api.kraken.com/0/public/Ticker?pair=BTCEUR,ETHEUR,SOLEUR,DOTEUR,LINKEUR'); const d = await r.json(); if (d.result) { const nm = {}; Object.entries(d.result).forEach(([p, i]) => { const k = cleanK(p); nm[k] = { price: parseFloat(i.c[0]), move: ((parseFloat(i.c[0]) - parseFloat(i.o)) / parseFloat(i.o)) * 100 } }); setMk(nm) } } catch (e) { console.error(e) } }, []); useEffect(() => { sync(); const i = setInterval(sync, 10000); return () => clearInterval(i) }, [sync]);
  useEffect(() => { if (!chartRef.current || st.history.length < 2) return; const render = () => { if (!window.Chart) return; const ctx = chartRef.current.getContext('2d'); if (chartInst.current) chartInst.current.destroy(); chartInst.current = new window.Chart(ctx, { type: 'line', data: { labels: st.history.map(h => h.t), datasets: [{ data: st.history.map(h => h.v), borderColor: '#0ecb81', fill: true, tension: .3, backgroundColor: 'rgba(14,203,129,0.1)', borderWidth: 2, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: true, position: 'right', grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } } } } }) }; if (!window.Chart) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'; s.onload = render; document.head.appendChild(s) } else render(); return () => { if (chartInst.current) chartInst.current.destroy() } }, [st.history]);
  let tpv = 0; const tc = {}; Object.keys(st.trades).forEach(k => { const p = mk[k]?.price || 0; const m = calc(st.trades[k], p); tc[k] = { m, p }; tpv += m.val }); const totalVal = st.cash + tpv;
  useEffect(() => { if (totalVal > 0 && Object.keys(mk).length > 0) { setSt(prev => { const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); const last = prev.history[prev.history.length - 1]; if (last && last.t === now) return prev; const h = [...prev.history, { t: now, v: totalVal }]; if (h.length > 30) h.shift(); return { ...prev, history: h } }) } }, [mk]);//eslint-disable-line
  const openTrade = () => { const asset = document.getElementById('s-asset').value; const amount = parseFloat(document.getElementById('s-amount').value); const entryIn = parseFloat(document.getElementById('s-entry').value); const type = document.getElementById('s-type').value; const price = entryIn > 0 ? entryIn : mk[asset]?.price; if (!amount || amount > st.cash) return show('❌ Montant invalide'); if (!price) return show('⏳ Prix indisponible'); setSt(prev => ({ ...prev, cash: prev.cash - amount, trades: { ...prev.trades, [asset]: { type, amount, entry: price } } })); show(`✅ ${asset.toUpperCase()} ${type} ouvert`) };
  const closeTrade = (k) => { const m = calc(st.trades[k], mk[k]?.price); setSt(prev => { const t = { ...prev.trades }; delete t[k]; return { ...prev, cash: prev.cash + m.val, trades: t } }); show('💼 Position fermée') };
  const addAlert = () => { const target = parseFloat(document.getElementById('s-alert').value); const asset = document.getElementById('s-asset').value; if (target > 0) { setSt(prev => ({ ...prev, alerts: [...prev.alerts, { asset, target, id: Date.now() }] })); show('🔔 Alerte créée') } };
  useEffect(() => { if (!mk || st.alerts.length === 0) return; const rem = st.alerts.filter(a => { const p = mk[a.asset]?.price; if (p && p >= a.target) { show(`🚨 ${a.asset.toUpperCase()} @ ${a.target}€`); return false } return true }); if (rem.length !== st.alerts.length) setSt(prev => ({ ...prev, alerts: rem })) }, [mk]);//eslint-disable-line
  const simpleTickerItems = useMemo(() => Object.entries(mk).sort((a, b) => a[0].localeCompare(b[0])), [mk]);
  return (<div className="sim-simple"><TickerMarquee items={simpleTickerItems} /><div className="ss-header"><span className="ss-header__label">Valeur Portefeuille</span><span className="ss-header__val">{fE(totalVal)}</span></div><div className="ss-grid"><div><div className="ss-card"><div className="ss-card__title">Répartition du Capital</div>{Object.keys(st.trades).map(k => { const m = tc[k]?.m; if (!m) return null; const pct = (m.val / (totalVal || 1)) * 100; const up = m.pct >= 0; return (<div key={k} className="ss-alloc"><div className="ss-alloc__top"><div><strong>{k.toUpperCase()}</strong><span className="ss-alloc__val">{fE(m.val)} <small>({pct.toFixed(1)}%)</small></span></div><span style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700, fontSize: '.85rem' }}>{fS(m.pct, '%')}</span></div><div className="ss-bar"><div className="ss-bar__fill" style={{ width: `${pct}%` }} /></div></div>) })}<div className="ss-alloc"><div className="ss-alloc__top"><span style={{ color: 'var(--zv-text-muted)', fontSize: '.8rem' }}>CASH</span><span style={{ fontWeight: 700 }}>{fE(st.cash)}</span></div><div className="ss-bar"><div className="ss-bar__fill ss-bar__fill--cash" style={{ width: `${(st.cash / (totalVal || 1)) * 100}%` }} /></div></div></div><div className="ss-card"><div className="ss-card__title">Performance</div><div style={{ height: 120 }}><canvas ref={chartRef} /></div></div><div className="ss-card"><div className="ss-card__title">Positions Actives</div>{Object.keys(st.trades).length === 0 ? <div className="ss-empty">Aucune position</div> : <div className="sa-table-scroll"><table className="ss-table"><thead><tr><th>Actif</th><th>Type</th><th>Entrée</th><th>Actuel</th><th>Frais</th><th>P&L</th><th></th></tr></thead><tbody>{Object.keys(st.trades).map(k => { const m = tc[k]?.m; const up = m?.pct >= 0; return (<tr key={k}><td><strong>{k.toUpperCase()}</strong></td><td><span className={`sa-badge sa-badge--${st.trades[k].type}`}>{st.trades[k].type.toUpperCase()}</span></td><td>{fmt(st.trades[k].entry)}€</td><td>{fmt(tc[k]?.p)}€</td><td style={{ color: 'var(--zv-text-muted)', fontSize: '.7rem' }}>{fmt(m?.fees)}€</td><td style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700 }}>{fS(m?.net)}</td><td><button className="ss-btn-close" onClick={() => closeTrade(k)}>✕</button></td></tr>) })}</tbody></table></div>}</div></div><div><div className="ss-card"><div className="ss-card__title">Nouveau Trade</div><div className="ss-form"><label>Paire</label><select id="s-asset">{SIMPLE_ASSETS.map(a => <option key={a.k} value={a.k}>{a.l}</option>)}</select></div><div className="ss-form"><label>Direction</label><select id="s-type"><option value="long">LONG (Achat)</option><option value="short">SHORT (Vente)</option></select></div><div className="ss-form"><label>Prix d'entrée (€)</label><input type="number" id="s-entry" placeholder="Auto" step="any" /></div><div className="ss-form"><label>Allocation (€)</label><input type="number" id="s-amount" placeholder="500" /></div><button className="ss-btn-exec" onClick={openTrade}>Exécuter</button><div className="ss-cash">Cash: {fE(st.cash)}</div></div><div className="ss-card"><div className="ss-card__title">Alertes 🔔</div><div className="ss-form"><input type="number" id="s-alert" placeholder="Prix cible (€)" /></div><button className="ss-btn-alert" onClick={addAlert}>Créer alerte</button>{st.alerts.map(a => <div key={a.id} className="ss-alert-item"><span><strong>{a.asset.toUpperCase()}</strong> &gt; {fmt(a.target)}€</span><button onClick={() => setSt(prev => ({ ...prev, alerts: prev.alerts.filter(x => x.id !== a.id) }))}>✕</button></div>)}</div><div className="ss-card" style={{ borderTop: '3px solid var(--zv-danger)' }}><div className="ss-card__title">Compte</div><div className="ss-form"><label>Capital Initial</label><input type="number" id="s-cap" defaultValue={st.initCap} /></div><button className="ss-btn-update" onClick={() => { const v = parseFloat(document.getElementById('s-cap').value); if (v > 0) { setSt(prev => ({ ...prev, cash: prev.cash + (v - prev.initCap), initCap: v })); show('💰 OK') } }}>Mettre à jour</button><button className="ss-btn-reset" onClick={() => { if (window.confirm('Effacer toutes les données ?')) { localStorage.removeItem(STORE_SIMPLE); setSt({ initCap: 2000, cash: 2000, trades: {}, alerts: [], history: [] }); if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null } show('🗑️ Reset effectué') } }}>🗑️ Reset</button></div></div></div><div className={`sim-toast ${tv ? 'sim-toast--vis' : ''}`}>{toast}</div></div>)
}

/* ═══════ ADVANCED SIMULATOR ═══════ */
function AdvancedSimulator() {
  const [st, setSt] = useState(() => { try { const s = localStorage.getItem(STORE_ADV); if (s) return JSON.parse(s) } catch { } return { initCap: 10000, cash: 10000, trades: [], closedTrades: [], alerts: [], history: [], nextId: 1 } });
  const [mk, setMk] = useState({}); const [allPairs, setAllPairs] = useState({}); const [marketTab, setMarketTab] = useState('crypto');
  const [forexData, setForexData] = useState({}); const [stockData, setStockData] = useState(() => AV_ENABLED ? initFromCache(STOCK_SYMBOLS) : genSimData(STOCK_SYMBOLS, 2.5));
  const [indexData, setIndexData] = useState(() => genSimData(INDEX_SYMBOLS, 1.5)); const [etfData, setEtfData] = useState(() => AV_ENABLED ? initFromCache(ETF_SYMBOLS) : genSimData(ETF_SYMBOLS, 1.8));
  const [commodityData, setCommodityData] = useState(() => AV_ENABLED ? initFromCache(COMMODITY_SYMBOLS) : genSimData(COMMODITY_SYMBOLS, 1.8)); const [bondData, setBondData] = useState(() => genSimData(BOND_SYMBOLS, 0.8));
  const [news, setNews] = useState([]); const [newsL, setNewsL] = useState(true); const [toast, setToast] = useState(''); const [tv, setTv] = useState(false);
  const [showHist, setShowHist] = useState(false); const [search, setSearch] = useState('');
  const [fAsset, setFA] = useState('BTC'); const [fType, setFT] = useState('long'); const [fEntry, setFE] = useState(''); const [fAmt, setFAm] = useState('');
  const [fSL, setFSL] = useState(''); const [fTP, setFTP] = useState(''); const [aAsset, setAA] = useState('BTC'); const [aPrice, setAP] = useState(''); const [capIn, setCI] = useState('');
  const [mobileSection, setMobileSection] = useState('trade');
  const chartRef = useRef(null); const chartInst = useRef(null); const tTimer = useRef(null); const mkRef = useRef(mk); mkRef.current = mk;
  const show = (m) => { setToast(m); setTv(true); if (tTimer.current) clearTimeout(tTimer.current); tTimer.current = setTimeout(() => setTv(false), 3500) };
  useEffect(() => { localStorage.setItem(STORE_ADV, JSON.stringify(st)) }, [st]);
  useEffect(() => { (async () => { try { const r = await fetch('https://api.kraken.com/0/public/AssetPairs'); const d = await r.json(); if (!d.result) return; const map = {}; Object.entries(d.result).forEach(([k, v]) => { if (v.wsname && v.wsname.endsWith('/EUR') && !k.includes('.d')) { const base = v.wsname.split('/')[0]; if (base && !map[base]) map[base] = k } }); if (map['XBT'] && !map['BTC']) { map['BTC'] = map['XBT']; delete map['XBT'] } setAllPairs(map) } catch (e) { console.error(e) } })() }, []);
  const syncMk = useCallback(async () => { if (!Object.keys(allPairs).length) return; const need = new Set(TOP); st.trades.forEach(t => need.add(t.asset)); st.alerts.forEach(a => need.add(a.asset)); const kp = []; need.forEach(s => { if (allPairs[s]) kp.push(allPairs[s]) }); if (!kp.length) return; const batches = []; for (let i = 0; i < kp.length; i += 30)batches.push(kp.slice(i, i + 30)); const nm = { ...mkRef.current }; for (const b of batches) { try { const r = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${b.join(',')}`); const d = await r.json(); if (d.result) { Object.entries(d.result).forEach(([pair, info]) => { let sym = null; for (const [s, p] of Object.entries(allPairs)) { if (p === pair) { sym = s; break } } if (!sym && pair.includes('XBT')) sym = 'BTC'; if (sym) { const price = parseFloat(info.c[0]); const open = parseFloat(info.o); nm[sym] = { price, open, high: parseFloat(info.h[1]), low: parseFloat(info.l[1]), vol: parseFloat(info.v[1]), move: ((price - open) / open) * 100, pair } } }) } } catch (e) { } } setMk(nm) }, [allPairs, st.trades, st.alerts]);
  useEffect(() => { if (!Object.keys(allPairs).length) return; syncMk(); const i = setInterval(syncMk, 8000); return () => clearInterval(i) }, [allPairs, syncMk]);
  useEffect(() => { const fn = async () => { try { const r = await fetch('https://open.er-api.com/v6/latest/EUR'); const d = await r.json(); if (d.rates) { const R = d.rates; const rnd = (v) => (Math.random() - .48) * v; setForexData({
    // Paires majeures
    'EUR/USD': { price: R.USD, move: rnd(.6) }, 'GBP/USD': { price: R.USD / R.GBP, move: rnd(.5) }, 'USD/JPY': { price: R.JPY / R.USD, move: rnd(.7) }, 'USD/CHF': { price: R.CHF / R.USD, move: rnd(.4) }, 'AUD/USD': { price: R.AUD ? R.USD / R.AUD : 0.64, move: rnd(.6) }, 'USD/CAD': { price: R.CAD / R.USD, move: rnd(.5) }, 'NZD/USD': { price: R.NZD ? R.USD / R.NZD : 0.60, move: rnd(.6) },
    // Croisements EUR
    'EUR/GBP': { price: R.GBP, move: rnd(.3) }, 'EUR/JPY': { price: R.JPY, move: rnd(.6) }, 'EUR/CHF': { price: R.CHF, move: rnd(.3) }, 'EUR/CAD': { price: R.CAD, move: rnd(.4) }, 'EUR/AUD': { price: R.AUD || 1.66, move: rnd(.5) }, 'EUR/NZD': { price: R.NZD || 1.77, move: rnd(.5) }, 'EUR/SEK': { price: R.SEK || 11.2, move: rnd(.3) }, 'EUR/NOK': { price: R.NOK || 11.8, move: rnd(.4) }, 'EUR/DKK': { price: R.DKK || 7.46, move: rnd(.1) }, 'EUR/PLN': { price: R.PLN || 4.22, move: rnd(.5) }, 'EUR/HUF': { price: R.HUF || 408, move: rnd(.5) }, 'EUR/CZK': { price: R.CZK || 25.2, move: rnd(.4) }, 'EUR/RON': { price: R.RON || 5.0, move: rnd(.4) },
    // Croisements GBP
    'GBP/JPY': { price: R.JPY / R.GBP, move: rnd(.8) }, 'GBP/CHF': { price: R.CHF / R.GBP, move: rnd(.4) }, 'GBP/CAD': { price: R.CAD / R.GBP, move: rnd(.5) }, 'GBP/AUD': { price: R.AUD ? R.AUD / R.GBP : 1.98, move: rnd(.6) }, 'GBP/NZD': { price: R.NZD ? R.NZD / R.GBP : 2.09, move: rnd(.6) },
    // Croisements AUD / NZD
    'AUD/JPY': { price: R.AUD ? R.JPY / R.AUD : 97, move: rnd(.7) }, 'AUD/CAD': { price: R.AUD ? R.CAD / R.AUD : 0.91, move: rnd(.5) }, 'AUD/NZD': { price: R.AUD && R.NZD ? R.NZD / R.AUD : 1.08, move: rnd(.4) }, 'NZD/JPY': { price: R.NZD ? R.JPY / R.NZD : 88, move: rnd(.7) }, 'NZD/CAD': { price: R.NZD ? R.CAD / R.NZD : 0.85, move: rnd(.5) },
    // Croisements CAD / CHF
    'CAD/JPY': { price: R.JPY / R.CAD, move: rnd(.6) }, 'CHF/JPY': { price: R.JPY / R.CHF, move: rnd(.5) },
    // USD — Marchés émergents
    'USD/CNY': { price: R.CNY / R.USD || 7.25, move: rnd(.2) }, 'USD/MXN': { price: R.MXN / R.USD || 17.2, move: rnd(.7) }, 'USD/BRL': { price: R.BRL / R.USD || 5.1, move: rnd(.8) }, 'USD/ZAR': { price: R.ZAR / R.USD || 18.5, move: rnd(1.0) }, 'USD/TRY': { price: R.TRY / R.USD || 32, move: rnd(1.0) }, 'USD/SGD': { price: R.SGD / R.USD || 1.34, move: rnd(.3) }, 'USD/HKD': { price: R.HKD / R.USD || 7.82, move: rnd(.1) }, 'USD/INR': { price: R.INR / R.USD || 84, move: rnd(.3) }, 'USD/KRW': { price: R.KRW / R.USD || 1330, move: rnd(.5) }, 'USD/TWD': { price: R.TWD / R.USD || 32.5, move: rnd(.4) }, 'USD/THB': { price: R.THB / R.USD || 35, move: rnd(.4) }, 'USD/IDR': { price: R.IDR / R.USD || 15600, move: rnd(.5) }, 'USD/PHP': { price: R.PHP / R.USD || 56, move: rnd(.4) }, 'USD/MYR': { price: R.MYR / R.USD || 4.7, move: rnd(.4) },
    // EUR — Émergents
    'EUR/TRY': { price: R.TRY || 34, move: rnd(1.2) }, 'EUR/PLN': { price: R.PLN || 4.22, move: rnd(.5) },
    // Exotiques / Matières
    'USD/NOK': { price: R.NOK / R.USD || 10.6, move: rnd(.4) }, 'USD/SEK': { price: R.SEK / R.USD || 10.5, move: rnd(.4) }, 'USD/DKK': { price: R.DKK / R.USD || 6.9, move: rnd(.2) }, 'USD/AED': { price: R.AED / R.USD || 3.67, move: rnd(.05) }, 'USD/SAR': { price: R.SAR / R.USD || 3.75, move: rnd(.05) },
  }) } } catch (e) { } }; fn(); const i = setInterval(fn, 30000); return () => clearInterval(i) }, []);
  // ── Stocks: AV real prices or simulated ticks ──
  useEffect(() => { if (AV_ENABLED) { fetchAVPrices(STOCK_SYMBOLS.slice(0, 8), setStockData); } }, []);// eslint-disable-line
  useEffect(() => { if (AV_ENABLED) { const i = setInterval(() => { if (getRateLimitInfo().canCall) { const tradeAssets = st.trades.map(t => t.asset); const active = STOCK_SYMBOLS.filter(s => tradeAssets.includes(s.s) || s.s === fAsset); if (active.length > 0) fetchAVPrices(active, setStockData); } }, 300000); return () => clearInterval(i); } else { const i = setInterval(() => setStockData(p => microTick(p, 0.4)), 8000); return () => clearInterval(i); } }, [st.trades, fAsset]);// eslint-disable-line
  // ── Indices: AV GLOBAL_QUOTE pour les principaux, sinon simulated ──
  useEffect(() => { if (AV_ENABLED && getRateLimitInfo().canCall) { fetchAVIndices(INDEX_SYMBOLS.slice(0, 5), setIndexData); } }, []);// eslint-disable-line
  useEffect(() => { const i = setInterval(() => setIndexData(p => microTick(p, 0.3)), 7000); return () => clearInterval(i) }, []);
  // ── ETFs: AV real or simulated ──
  useEffect(() => { if (AV_ENABLED && marketTab === 'etfs' && getRateLimitInfo().canCall) { fetchAVPrices(ETF_SYMBOLS.slice(0, 6), setEtfData); } }, [marketTab]);// eslint-disable-line
  useEffect(() => { if (!AV_ENABLED) { const i = setInterval(() => setEtfData(p => microTick(p, 0.35)), 8500); return () => clearInterval(i); } }, []);
  // ── Commodities: AV métaux précieux + endpoints WTI/BRENT/WHEAT… ──
  useEffect(() => { if (AV_ENABLED && getRateLimitInfo().canCall) { fetchAVCommodities(COMMODITY_SYMBOLS, setCommodityData); fetchAVCommodityEP(COMMODITY_SYMBOLS, setCommodityData); } }, []);// eslint-disable-line
  useEffect(() => { if (!AV_ENABLED) { const i = setInterval(() => setCommodityData(p => microTick(p, 0.5)), 9000); return () => clearInterval(i); } }, []);
  // ── Bonds: AV TREASURY_YIELD pour US Treasuries, reste simulé ──
  useEffect(() => { if (AV_ENABLED && getRateLimitInfo().canCall) { fetchAVTreasury(BOND_SYMBOLS, setBondData); } }, []);// eslint-disable-line
  useEffect(() => { const i = setInterval(() => setBondData(p => microTick(p, 0.15)), 10000); return () => clearInterval(i) }, []);
  // ── Fetch real prices on tab switch ──
  useEffect(() => { if (AV_ENABLED && marketTab === 'stocks' && getRateLimitInfo().canCall) { fetchAVPrices(STOCK_SYMBOLS.slice(0, 6), setStockData); } }, [marketTab]);// eslint-disable-line
  useEffect(() => { if (AV_ENABLED && marketTab === 'indices' && getRateLimitInfo().canCall) { fetchAVIndices(INDEX_SYMBOLS.slice(0, 5), setIndexData); } }, [marketTab]);// eslint-disable-line
  useEffect(() => { if (AV_ENABLED && marketTab === 'commodities' && getRateLimitInfo().canCall) { fetchAVCommodities(COMMODITY_SYMBOLS, setCommodityData); fetchAVCommodityEP(COMMODITY_SYMBOLS, setCommodityData); } }, [marketTab]);// eslint-disable-line
  useEffect(() => { if (AV_ENABLED && marketTab === 'bonds' && getRateLimitInfo().canCall) { fetchAVTreasury(BOND_SYMBOLS, setBondData); } }, [marketTab]);// eslint-disable-line
  const getPrice = useCallback((asset) => mk[asset]?.price || forexData[asset]?.price || stockData[asset]?.price || indexData[asset]?.price || etfData[asset]?.price || commodityData[asset]?.price || bondData[asset]?.price || 0, [mk, forexData, stockData, indexData, etfData, commodityData, bondData]);
  const getMove = (asset) => mk[asset]?.move || forexData[asset]?.move || stockData[asset]?.move || indexData[asset]?.move || etfData[asset]?.move || commodityData[asset]?.move || bondData[asset]?.move || 0;
  useEffect(() => { if (!st.trades.length) return; let ch = false; const rem = []; const nc = [...st.closedTrades]; let cd = 0; st.trades.forEach(trade => { const p = getPrice(trade.asset); if (!p) { rem.push(trade); return } let trig = null; if (trade.sl > 0) { if (trade.type === 'long' && p <= trade.sl) trig = 'SL'; if (trade.type === 'short' && p >= trade.sl) trig = 'SL' } if (trade.tp > 0) { if (trade.type === 'long' && p >= trade.tp) trig = 'TP'; if (trade.type === 'short' && p <= trade.tp) trig = 'TP' } if (trig) { const m = calc(trade, p); cd += m.val; nc.push({ ...trade, exitPrice: p, exitTime: Date.now(), pnl: m.net, pnlPct: m.pct, reason: trig }); ch = true; show(`${trig === 'SL' ? '🛑' : '🎯'} ${trig}: ${trade.asset} ${fS(m.net)}`) } else rem.push(trade) }); if (ch) setSt(prev => ({ ...prev, trades: rem, closedTrades: nc, cash: prev.cash + cd })) }, [mk, forexData, stockData, indexData, etfData, commodityData, bondData]);//eslint-disable-line
  useEffect(() => { if (!Object.keys(mk).length || !st.alerts.length) return; const trig = []; const rem = st.alerts.filter(a => { const p = mk[a.asset]?.price; if (p && ((a.direction === 'above' && p >= a.target) || (a.direction === 'below' && p <= a.target))) { trig.push(a); return false } return true }); if (trig.length) { trig.forEach(a => show(`🚨 ${a.asset} ${a.direction === 'above' ? '≥' : '≤'} ${fmt(a.target)}€`)); setSt(prev => ({ ...prev, alerts: rem })) } }, [mk]);//eslint-disable-line
  useEffect(() => { const fn = async () => { setNewsL(true); try { const q = encodeURIComponent('FED OR inflation OR bitcoin OR crypto OR earnings'); const rss = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`; const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&t=${Date.now()}`); const d = await r.json(); if (d?.status === 'ok' && d.items) setNews(d.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 12)) } catch (e) { } setNewsL(false) }; fn(); const i = setInterval(fn, 30000); return () => clearInterval(i) }, []);
  useEffect(() => { if (!chartRef.current || st.history.length < 2) return; const render = () => { if (!window.Chart) return; const ctx = chartRef.current.getContext('2d'); if (chartInst.current) chartInst.current.destroy(); const data = st.history.map(h => h.v); const up = data.length > 1 && data[data.length - 1] >= data[0]; chartInst.current = new window.Chart(ctx, { type: 'line', data: { labels: st.history.map(h => h.t), datasets: [{ data, borderColor: up ? '#0ecb81' : '#f6465d', fill: true, tension: .35, backgroundColor: up ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)', borderWidth: 2.5, pointRadius: 0, pointHitRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fE(c.raw) } } }, scales: { x: { display: false }, y: { display: true, position: 'right', grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } } }, interaction: { intersect: false, mode: 'index' } } }) }; if (!window.Chart) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'; s.onload = render; document.head.appendChild(s) } else render(); return () => { if (chartInst.current) chartInst.current.destroy() } }, [st.history]);

  let tpv = 0; const trC = st.trades.map(trade => { const p = getPrice(trade.asset); const m = calc(trade, p); tpv += m.val; return { trade, price: p, m } }); const totalVal = st.cash + tpv; const totalPnl = totalVal - st.initCap; const totalPnlPct = st.initCap > 0 ? (totalPnl / st.initCap) * 100 : 0;
  useEffect(() => { if (totalVal > 0 && (Object.keys(mk).length > 0 || Object.keys(forexData).length > 0)) { setSt(prev => { const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); const last = prev.history[prev.history.length - 1]; if (last && last.t === now) return prev; const h = [...prev.history, { t: now, v: totalVal }]; if (h.length > 60) h.shift(); return { ...prev, history: h } }) } }, [mk, forexData, stockData]);//eslint-disable-line

  const tickerItems = useMemo(() => { switch (marketTab) { case 'crypto': return Object.entries(mk).filter(([k]) => TOP.slice(0, 15).includes(k)).sort((a, b) => Math.abs(b[1].move) - Math.abs(a[1].move)).slice(0, 12); case 'forex': return Object.entries(forexData).slice(0, 12); case 'stocks': return Object.entries(stockData).slice(0, 12); case 'indices': return Object.entries(indexData).slice(0, 12); case 'etfs': return Object.entries(etfData).slice(0, 12); case 'commodities': return Object.entries(commodityData).slice(0, 12); case 'bonds': return Object.entries(bondData).slice(0, 10); default: return [] } }, [mk, forexData, stockData, indexData, etfData, commodityData, bondData, marketTab]);

  const assetList = useMemo(() => { let keys = []; switch (marketTab) { case 'crypto': keys = Object.keys(allPairs).sort((a, b) => { const ai = TOP.indexOf(a), bi = TOP.indexOf(b); if (ai !== -1 && bi !== -1) return ai - bi; if (ai !== -1) return -1; if (bi !== -1) return 1; return a.localeCompare(b) }); break; case 'forex': keys = Object.keys(forexData); break; case 'stocks': keys = STOCK_SYMBOLS.map(s => s.s); break; case 'indices': keys = INDEX_SYMBOLS.map(s => s.s); break; case 'etfs': keys = ETF_SYMBOLS.map(s => s.s); break; case 'commodities': keys = COMMODITY_SYMBOLS.map(s => s.s); break; case 'bonds': keys = BOND_SYMBOLS.map(s => s.s); break; default: keys = [] }if (!search) return keys; const s = search.toUpperCase(); return keys.filter(k => { const data = forexData[k] || stockData[k] || indexData[k] || etfData[k] || commodityData[k] || bondData[k]; const label = data?.name || k; return k.toUpperCase().includes(s) || label.toUpperCase().includes(s) }) }, [allPairs, search, forexData, stockData, indexData, etfData, commodityData, bondData, marketTab]);

  useEffect(() => { setSearch(''); switch (marketTab) { case 'crypto': setFA('BTC'); break; case 'forex': setFA('EUR/USD'); break; case 'stocks': setFA('AAPL'); break; case 'indices': setFA('^GSPC'); break; case 'etfs': setFA('SPY'); break; case 'commodities': setFA('XAU'); break; case 'bonds': setFA('US10Y'); break; default: break } }, [marketTab]);

  const getAssetLabel = (a) => { if (marketTab === 'crypto') return a + '/EUR'; if (forexData[a]) return a; const d = stockData[a] || indexData[a] || etfData[a] || commodityData[a] || bondData[a]; return d ? `${d.name} (${a})` : a };
  const getAssetPrice = (a) => { if (forexData[a]) return forexData[a].price.toFixed(4); const p = getPrice(a); if (!p) return ''; if (bondData[a]) return p.toFixed(2) + '%'; return fmt(p) + (a.includes('.PA') || a.includes('.DE') ? '€' : marketTab === 'crypto' ? '€' : '$') };
  // Fetch real price when selecting an asset
  useEffect(() => {
    if (!AV_ENABLED || !fAsset || !getRateLimitInfo().canCall) return;
    if (STOCK_AV_MAP[fAsset]) {
      const sym = STOCK_SYMBOLS.find(s => s.s === fAsset) || ETF_SYMBOLS.find(s => s.s === fAsset);
      if (sym) { const setter = STOCK_SYMBOLS.find(s => s.s === fAsset) ? setStockData : setEtfData; fetchAVPrices([sym], setter); }
    }
  }, [fAsset]);// eslint-disable-line

  const openTrade = () => { const amount = parseFloat(fAmt); if (!amount || amount <= 0) return show('❌ Montant invalide'); if (amount > st.cash) return show('❌ Cash insuffisant'); const eI = parseFloat(fEntry); const price = eI > 0 ? eI : getPrice(fAsset); if (!price) return show('⏳ Prix indisponible'); const sl = parseFloat(fSL) || 0; const tp = parseFloat(fTP) || 0; const cat = mk[fAsset] ? 'crypto' : forexData[fAsset] ? 'forex' : commodityData[fAsset] ? 'commodity' : bondData[fAsset] ? 'bond' : indexData[fAsset] ? 'index' : etfData[fAsset] ? 'etf' : 'stock'; setSt(prev => ({ ...prev, cash: prev.cash - amount, nextId: prev.nextId + 1, trades: [...prev.trades, { id: prev.nextId, asset: fAsset, cat, type: fType, entry: price, amount, sl, tp, time: Date.now() }] })); setFE(''); setFAm(''); setFSL(''); setFTP(''); show(`✅ ${fType.toUpperCase()} ${fAsset} @ ${fmt(price)}`) };
  const closeTrade = (id) => { const trade = st.trades.find(t => t.id === id); if (!trade) return; const p = getPrice(trade.asset) || trade.entry; const m = calc(trade, p); setSt(prev => ({ ...prev, cash: prev.cash + m.val, trades: prev.trades.filter(t => t.id !== id), closedTrades: [...prev.closedTrades, { ...trade, exitPrice: p, exitTime: Date.now(), pnl: m.net, pnlPct: m.pct, reason: 'manual' }] })); show(`💼 ${trade.asset} clôturé ${fS(m.net)}`) };

  const renderMarketGrid = () => { const renderItems = (items) => (<div className="sa-mkt-grid">{items.map(({ sym, d, cur }) => { if (!d) return null; const up = (d.move || 0) >= 0; const sel = fAsset === sym; return (<div key={sym} className={`sa-mkt-item ${sel ? 'sa-mkt-item--sel' : ''}`} onClick={() => setFA(sym)}><div className="sa-mkt-item__name">{d.name || sym}{cur && <small>{cur}</small>}{AV_ENABLED && d.source && <SourceBadge source={d.source} />}</div><div className="sa-mkt-item__price">{d.unit === '%' ? d.price.toFixed(2) + '%' : typeof d.price === 'number' ? (d.price < 10 ? d.price.toFixed(d.price < 1 ? 4 : 3) : d.price.toFixed(2)) + (cur || '') : '...'}</div><div className={`sa-ticker__ch ${up ? 'sa-ticker__ch--up' : 'sa-ticker__ch--dn'}`} style={{ display: 'inline-block', marginTop: 6 }}>{up ? '+' : ''}{(d.move || 0).toFixed(2)}%</div></div>) })}</div>); switch (marketTab) { case 'crypto': return renderItems(TOP.slice(0, 20).map(sym => ({ sym, d: mk[sym], cur: '/EUR' })).filter(x => x.d)); case 'forex': return renderItems(Object.entries(forexData).map(([k, d]) => ({ sym: k, d, cur: '' }))); case 'stocks': return renderItems(STOCK_SYMBOLS.map(s => ({ sym: s.s, d: stockData[s.s], cur: s.s.includes('.PA') || s.s.includes('.DE') ? '€' : '$' }))); case 'indices': return renderItems(INDEX_SYMBOLS.map(s => ({ sym: s.s, d: indexData[s.s], cur: '' }))); case 'etfs': return renderItems(ETF_SYMBOLS.map(s => ({ sym: s.s, d: etfData[s.s], cur: '$' }))); case 'commodities': return renderItems(COMMODITY_SYMBOLS.map(s => ({ sym: s.s, d: commodityData[s.s], cur: '' }))); case 'bonds': return renderItems(BOND_SYMBOLS.map(s => ({ sym: s.s, d: bondData[s.s], cur: '' }))); default: return null } };

  const TABS = [{ id: 'crypto', label: 'Crypto', Icon: BarChart3 }, { id: 'forex', label: 'Forex', Icon: Globe }, { id: 'stocks', label: 'Actions', Icon: TrendingUp }, { id: 'indices', label: 'Indices', Icon: Activity }, { id: 'etfs', label: 'ETFs', Icon: Layers }, { id: 'commodities', label: 'Matières', Icon: Gem }, { id: 'bonds', label: 'Obligations', Icon: Landmark }];

  return (<div className="sim-adv">
    <TickerMarquee items={tickerItems} />
    <MarketStatusBar activeTab={marketTab} />
    <div className="sa-portfolio"><div><div className="sa-portfolio__label">Portefeuille <span className={`sa-data-badge ${AV_ENABLED ? 'sa-data-badge--live' : 'sa-data-badge--sim'}`}>{AV_ENABLED ? '● ALPHA VANTAGE' : '◌ SIMULATION'}</span></div><div className="sa-portfolio__val">{fE(totalVal)}</div></div><div className="sa-portfolio__right"><div className={`sa-portfolio__pnl ${totalPnl >= 0 ? 'sa-portfolio__pnl--up' : 'sa-portfolio__pnl--dn'}`}>{fS(totalPnl)} ({fS(totalPnlPct, '%')})</div><div className="sa-portfolio__meta">Capital: {fE(st.initCap)} · Cash: {fE(st.cash)}</div></div></div>
    <div className="sa-mob-nav"><button className={`sa-mob-nav__btn ${mobileSection === 'trade' ? 'sa-mob-nav__btn--act' : ''}`} onClick={() => setMobileSection('trade')}><Terminal size={16} /> Trade</button><button className={`sa-mob-nav__btn ${mobileSection === 'markets' ? 'sa-mob-nav__btn--act' : ''}`} onClick={() => setMobileSection('markets')}><BarChart3 size={16} /> Marchés</button><button className={`sa-mob-nav__btn ${mobileSection === 'portfolio' ? 'sa-mob-nav__btn--act' : ''}`} onClick={() => setMobileSection('portfolio')}><PieChart size={16} /> Portfolio</button><button className={`sa-mob-nav__btn ${mobileSection === 'agenda' ? 'sa-mob-nav__btn--act' : ''}`} onClick={() => setMobileSection('agenda')}><Calendar size={16} /> Agenda</button><button className={`sa-mob-nav__btn ${mobileSection === 'news' ? 'sa-mob-nav__btn--act' : ''}`} onClick={() => setMobileSection('news')}><Globe size={16} /> News</button></div>
    <div className="sa-layout"><div className="sa-main-col">
      <div className={`sa-card sa-section-markets ${mobileSection !== 'markets' ? 'sa-mob-hidden' : ''}`}><div className="sa-card__t sa-card__t--tabs"><span className="sa-card__t-label">Marchés</span><div className="sa-mkt-tabs">{TABS.map(tab => <button key={tab.id} className={`sa-mkt-tab ${marketTab === tab.id ? 'sa-mkt-tab--act' : ''}`} onClick={() => setMarketTab(tab.id)}><tab.Icon size={13} /> {tab.label}</button>)}</div></div>{renderMarketGrid()}</div>
      <div className={`sa-grid2 sa-section-portfolio ${mobileSection !== 'portfolio' ? 'sa-mob-hidden' : ''}`}><div className="sa-card"><div className="sa-card__t">Allocation <span style={{ fontSize: '0.7rem', color: 'var(--zv-text-muted)', fontWeight: 'normal' }}>{st.trades.length} pos.</span></div>{trC.map(({ trade, m }) => { const pct = (m.val / (totalVal || 1)) * 100; const up = m.pct >= 0; return (<div key={trade.id} className="ss-alloc"><div className="ss-alloc__top"><div><strong>{trade.asset}</strong><span className={`sa-badge sa-badge--${trade.type}`}>{trade.type.toUpperCase()}</span><span className="ss-alloc__val">{fE(m.val)} <small>({pct.toFixed(1)}%)</small></span></div><span style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700, fontFamily: 'var(--zv-mono)' }}>{fS(m.pct, '%')}</span></div><div className="ss-bar"><div className="ss-bar__fill" style={{ width: `${Math.max(pct, .5)}%` }} /></div></div>) })}<div className="ss-alloc"><div className="ss-alloc__top"><span style={{ color: 'var(--zv-text-muted)', fontSize: '.8rem' }}>CASH</span><span style={{ fontWeight: 700, fontFamily: 'var(--zv-mono)' }}>{fE(st.cash)}</span></div><div className="ss-bar"><div className="ss-bar__fill ss-bar__fill--cash" style={{ width: `${(st.cash / (totalVal || 1)) * 100}%` }} /></div></div>{st.trades.length === 0 && <div className="ss-empty">📊 Ouvrez un trade</div>}</div><div className="sa-card"><div className="sa-card__t">Performance</div><div style={{ height: 200 }}><canvas ref={chartRef} />{st.history.length < 2 && <div className="ss-empty">📈 En attente</div>}</div></div></div>
      <div className={`sa-card sa-section-portfolio ${mobileSection !== 'portfolio' ? 'sa-mob-hidden' : ''}`}><div className="sa-card__t">Positions <button className="sa-btn-hist" onClick={() => setShowHist(!showHist)}>{showHist ? 'Actives' : 'Historique'} ({st.closedTrades.length})</button></div>{!showHist ? (st.trades.length === 0 ? <div className="ss-empty">💼 Aucune position ouverte</div> : <div className="sa-table-scroll"><table className="ss-table"><thead><tr><th>Actif</th><th>Type</th><th>Qté</th><th>Entrée</th><th>Actuel</th><th>SL</th><th>TP</th><th>Frais</th><th>P&L</th><th>%</th><th></th></tr></thead><tbody>{trC.map(({ trade, price, m }) => { const up = m.pct >= 0; return (<tr key={trade.id}><td><strong>{trade.asset}</strong></td><td><span className={`sa-badge sa-badge--${trade.type}`}>{trade.type.toUpperCase()}</span></td><td style={{ fontSize: '.75rem' }}>{m.qty.toFixed(4)}</td><td>{fmt(trade.entry)}</td><td><strong>{fmt(price)}</strong></td><td style={{ color: 'var(--zv-text-muted)', fontSize: '.7rem' }}>{trade.sl ? fmt(trade.sl) : '—'}</td><td style={{ color: 'var(--zv-text-muted)', fontSize: '.7rem' }}>{trade.tp ? fmt(trade.tp) : '—'}</td><td style={{ color: 'var(--zv-text-muted)', fontSize: '.7rem' }}>{fmt(m.fees)}</td><td style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700 }}>{fS(m.net)}</td><td style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700 }}>{fS(m.pct, '%')}</td><td><button className="ss-btn-close" onClick={() => closeTrade(trade.id)}>✕</button></td></tr>) })}</tbody></table></div>) : (st.closedTrades.length === 0 ? <div className="ss-empty">Aucun historique</div> : <div className="sa-table-scroll"><table className="ss-table"><thead><tr><th>Actif</th><th>Type</th><th>Entrée</th><th>Sortie</th><th>P&L</th><th>%</th><th>Raison</th></tr></thead><tbody>{[...st.closedTrades].reverse().slice(0, 30).map((t, i) => { const up = t.pnl >= 0; return (<tr key={i}><td><strong>{t.asset}</strong></td><td><span className={`sa-badge sa-badge--${t.type}`}>{t.type.toUpperCase()}</span></td><td>{fmt(t.entry)}</td><td>{fmt(t.exitPrice)}</td><td style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700 }}>{fS(t.pnl)}</td><td style={{ color: up ? 'var(--zv-green)' : 'var(--zv-danger)', fontWeight: 700 }}>{fS(t.pnlPct, '%')}</td><td><span className={`sa-reason sa-reason--${t.reason}`}>{t.reason?.toUpperCase()}</span></td></tr>) })}</tbody></table></div>)}</div>
      <div className={`sa-card sa-section-news ${mobileSection !== 'news' ? 'sa-mob-hidden' : ''}`}><div className="sa-card__t">News 🌍 <span style={{ fontSize: '0.7rem', color: 'var(--zv-text-muted)', fontWeight: 'normal' }}>Live Feed</span></div><div className="sa-news">{newsL ? <div className="ss-empty">Chargement...</div> : news.map((item, i) => { const b = badge(item.title); const time = new Date(item.pubDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); return (<div key={i} className="sa-news-item"><div className="sa-news-meta"><span className="sa-news-badge" style={{ background: b.bg }}>{b.c}</span><span className="sa-news-time">🕒 {time} · {item.author || 'Global'}</span></div><a href={item.link} target="_blank" rel="noopener noreferrer" className="sa-news-title">{item.title}</a></div>) })}</div></div>
      <div className={`sa-section-agenda ${mobileSection !== 'agenda' && mobileSection !== 'markets' ? 'sa-mob-hidden' : ''}`}><MarketSessions /><MarketCalendar /></div>
    </div>
      <aside className={`sa-sidebar ${mobileSection !== 'trade' ? 'sa-mob-hidden' : ''}`}>
        <div className="sa-card"><div className="sa-card__t">Nouveau Trade</div><div className="ss-form"><label>Actif — {TABS.find(t => t.id === marketTab)?.label} ({assetList.length})</label><div className="sa-search-wrap"><Search size={14} className="sa-search-icon" /><input type="text" placeholder="Rechercher un actif..." value={search} onChange={e => setSearch(e.target.value)} className="sa-search-input" />{search && <button className="sa-search-clear" onClick={() => setSearch('')}>✕</button>}</div>{search && assetList.length > 0 && <div className="sa-search-dropdown">{assetList.slice(0, 8).map(a => <div key={a} className={`sa-search-item ${fAsset === a ? 'sa-search-item--sel' : ''}`} onClick={() => { setFA(a); setSearch(''); const p = getPrice(a); if (p > 0) setFE(p.toString()); }}><span className="sa-search-item__name">{getAssetLabel(a)}</span><span className="sa-search-item__price">{getAssetPrice(a)}</span></div>)}</div>}{!search && <select value={fAsset} onChange={e => { setFA(e.target.value); const p = getPrice(e.target.value); if (p > 0) setFE(p.toString()); }}>{assetList.slice(0, 200).map(a => <option key={a} value={a}>{getAssetLabel(a)} {getAssetPrice(a) ? `— ${getAssetPrice(a)}` : ''}</option>)}</select>}</div><div className="ss-form"><label>Direction</label><div className="sa-dir"><button className={`sa-dir__btn sa-dir__btn--long ${fType === 'long' ? 'sa-dir__btn--act' : ''}`} onClick={() => setFT('long')}>▲ LONG</button><button className={`sa-dir__btn sa-dir__btn--short ${fType === 'short' ? 'sa-dir__btn--act' : ''}`} onClick={() => setFT('short')}>▼ SHORT</button></div></div>{getPrice(fAsset) > 0 && <div className="sa-mkinfo"><span>Prix: <strong>{forexData[fAsset] ? forexData[fAsset].price.toFixed(4) : bondData[fAsset] ? bondData[fAsset].price.toFixed(2) + '%' : fmt(getPrice(fAsset))}</strong></span><span>Var: <strong style={{ color: getMove(fAsset) >= 0 ? 'var(--zv-green)' : 'var(--zv-danger)' }}>{getMove(fAsset) >= 0 ? '+' : ''}{getMove(fAsset).toFixed(2)}%</strong></span></div>}<div className="sa-row"><div className="ss-form" style={{ flex: 1 }}><label>Prix entrée</label><input type="number" value={fEntry} onChange={e => setFE(e.target.value)} placeholder="Auto" step="any" /></div><div className="ss-form" style={{ flex: 1 }}><label>Montant (€)</label><input type="number" value={fAmt} onChange={e => setFAm(e.target.value)} placeholder="500" /></div></div><div className="sa-row"><div className="ss-form" style={{ flex: 1 }}><label>Stop Loss</label><input type="number" value={fSL} onChange={e => setFSL(e.target.value)} placeholder="Optionnel" step="any" /></div><div className="ss-form" style={{ flex: 1 }}><label>Take Profit</label><input type="number" value={fTP} onChange={e => setFTP(e.target.value)} placeholder="Optionnel" step="any" /></div></div><button className="ss-btn-exec" onClick={openTrade}>⚡ Exécuter</button><div className="ss-cash">Cash: <strong style={{ color: '#fff' }}>{fE(st.cash)}</strong></div></div>
        <div className="sa-card"><div className="sa-card__t">Alertes 🔔</div><div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><select value={aAsset} onChange={e => setAA(e.target.value)} className="ss-form" style={{ flex: '0 0 90px', padding: '8px' }}>{TOP.slice(0, 20).map(a => allPairs[a] ? <option key={a} value={a}>{a}</option> : null)}</select><input type="number" className="ss-form" value={aPrice} onChange={e => setAP(e.target.value)} placeholder="Prix cible" step="any" style={{ flex: 1, padding: '8px' }} /></div><button className="ss-btn-alert" onClick={() => { const target = parseFloat(aPrice); if (target > 0) { const dir = target >= (mk[aAsset]?.price || 0) ? 'above' : 'below'; setSt(prev => ({ ...prev, alerts: [...prev.alerts, { asset: aAsset, target, direction: dir, id: Date.now() }] })); setAP(''); show(`🔔 Alerte ${aAsset}`) } }}>Créer alerte</button>{st.alerts.map(a => <div key={a.id} className="ss-alert-item"><span><strong>{a.asset}</strong> {a.direction === 'above' ? '≥' : '≤'} {fmt(a.target)}</span><button onClick={() => setSt(prev => ({ ...prev, alerts: prev.alerts.filter(x => x.id !== a.id) }))}>✕</button></div>)}</div>
        <div className="sa-card" style={{ borderTop: '3px solid var(--zv-danger)' }}><div className="sa-card__t">Compte</div><div className="ss-form"><label>Capital (€)</label><input type="number" value={capIn} onChange={e => setCI(e.target.value)} placeholder={st.initCap.toString()} /></div><button className="ss-btn-update" onClick={() => { const v = parseFloat(capIn); if (v > 0) { setSt(prev => ({ ...prev, cash: prev.cash + (v - prev.initCap), initCap: v })); setCI(''); show('💰 OK') } }}>Mettre à jour</button><button className="ss-btn-reset" onClick={() => { if (window.confirm('Effacer toutes les données ?')) { localStorage.removeItem(STORE_ADV); setSt({ initCap: 10000, cash: 10000, trades: [], closedTrades: [], alerts: [], history: [], nextId: 1 }); if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null } show('🗑️ Reset effectué') } }}>🗑️ Reset Data</button></div>
      </aside></div>
    <div className={`sim-toast ${tv ? 'sim-toast--vis' : ''}`}>{toast}</div>
  </div>)
}

const FLOATING_ICONS = [LineChart, CandlestickChart, Activity, PieChart, Wallet, Globe, Shield, BarChart2, Terminal];
export default function SimulatorPage() {
  const { t, lang } = useLanguage(); const { isUnlocked, unlock } = useProgress(); const navigate = useNavigate();
  const [codeBasic, setCodeBasic] = useState(''); const [codeAdv, setCodeAdv] = useState('');
  const [errBasic, setErrBasic] = useState(false); const [errAdv, setErrAdv] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const tryUnlock = (type, code) => { const ok = unlock(type, code); if (!ok) { if (type === 'simBasic') setErrBasic(true); else setErrAdv(true); setTimeout(() => { setErrBasic(false); setErrAdv(false) }, 2000) } else { setActiveTab(type === 'simBasic' ? 'basic' : 'advanced') } };
  if (activeTab === 'basic' && isUnlocked('simBasic')) return (<div className="sim-container"><div className="sim-back-bar"><div className="container"><button className="sim-back-btn" onClick={() => setActiveTab(null)}><ArrowLeft size={16} /> Retour</button></div></div><SimpleSimulator /><Footer /></div>);
  if (activeTab === 'advanced' && isUnlocked('simAdvanced')) return (<div className="sim-container"><div className="sim-back-bar"><div className="container"><button className="sim-back-btn" onClick={() => setActiveTab(null)}><ArrowLeft size={16} /> Retour</button></div></div><AdvancedSimulator /><Footer /></div>);

  const basicPrice = billingCycle === 'monthly' ? t('sim.basic.priceMonthly') : t('sim.basic.priceAnnual');
  const basicLabel = billingCycle === 'monthly' ? t('sim.basic.priceMonthlyLabel') : t('sim.basic.priceAnnualLabel');
  const advPrice = billingCycle === 'monthly' ? t('sim.advanced.priceMonthly') : t('sim.advanced.priceAnnual');
  const advLabel = billingCycle === 'monthly' ? t('sim.advanced.priceMonthlyLabel') : t('sim.advanced.priceAnnualLabel');

  return (<div className="sim-container">
    <div className="sim-hero"><div className="sim-hero__bg" /><div className="sim-hero__icons">{FLOATING_ICONS.map((Icon, i) => <Icon key={i} className="hero__icon-svg" size={32 + (i % 3) * 16} strokeWidth={1} style={{ left: `${5 + (i * 12) % 85}%`, top: `${10 + (i * 15) % 70}%`, animationDelay: `${i * 0.6}s` }} />)}</div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <button className="sim-back-btn" onClick={() => navigate('/')}><ArrowLeft size={16} /> {t('nav.home')}</button>
        <h1 className="sim-hero__title">{t('sim.title')}</h1>
        <p className="sim-hero__sub">{t('sim.subtitle')}</p>
        <div className="sim-billing-toggle">
          <button className={`sim-billing-btn ${billingCycle === 'monthly' ? 'sim-billing-btn--act' : ''}`} onClick={() => setBillingCycle('monthly')}>Mensuel</button>
          <button className={`sim-billing-btn ${billingCycle === 'annual' ? 'sim-billing-btn--act' : ''}`} onClick={() => setBillingCycle('annual')}>Annuel <span className="sim-billing-save">-17%</span></button>
        </div>
      </div>
    </div>
    <div className="container"><div className="sim-packs">
      <div className="sim-pack sim-pack--basic">
        <div className="sim-pack__img"><img src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=300&fit=crop&q=80" alt="Basic" /></div>
        <div className="sim-pack__head"><span className="sim-pack__badge"><Zap size={14} /> {t('sim.basic.badge')}</span>
          <div className="sim-pack__pricing"><span className="sim-pack__price-val">{basicPrice}</span><span className="sim-pack__price-label">{basicLabel}</span></div>
          {billingCycle === 'annual' && <span className="sim-pack__save">{t('sim.basic.priceAnnualSave')}</span>}
        </div>
        <h3>{t('sim.basic.title')}</h3><p>{t('sim.basic.desc')}</p>
        <div className="sim-pack__features"><span className="sim-pack__feat">✓ 5 cryptos majeures</span><span className="sim-pack__feat">✓ Prix live Kraken</span><span className="sim-pack__feat">✓ Graphique performance</span></div>
        {isUnlocked('simBasic') ? <button className="sim-pack__btn" onClick={() => setActiveTab('basic')}>Ouvrir →</button> : (<div className="sim-pack__unlock"><input type="text" value={codeBasic} onChange={e => setCodeBasic(e.target.value)} placeholder={t('sim.accessCode')} className={errBasic ? 'sim-pack__input--err' : ''} onKeyDown={e => e.key === 'Enter' && tryUnlock('simBasic', codeBasic)} /><button className="sim-pack__btn-unlock" onClick={() => tryUnlock('simBasic', codeBasic)}><Lock size={16} /> {t('sim.unlock')}</button></div>)}
        {errBasic && <span className="sim-pack__err">{t('sim.wrongCode')}</span>}
      </div>
      <div className="sim-pack sim-pack--adv">
        <div className="sim-pack__img"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&q=80" alt="Advanced" /></div>
        <div className="sim-pack__head"><span className="sim-pack__badge sim-pack__badge--pro"><Crown size={14} /> {t('sim.advanced.badge')}</span>
          <div className="sim-pack__pricing"><span className="sim-pack__price-val">{advPrice}</span><span className="sim-pack__price-label">{advLabel}</span></div>
          {billingCycle === 'annual' && <span className="sim-pack__save">{t('sim.advanced.priceAnnualSave')}</span>}
        </div>
        <h3>{t('sim.advanced.title')}</h3><p>{t('sim.advanced.desc')}</p>
        <div className="sim-pack__features"><span className="sim-pack__feat"><TrendingUp size={13}/> Crypto</span><span className="sim-pack__feat"><BarChart3 size={13}/> Actions</span><span className="sim-pack__feat"><Globe size={13}/> Indices</span><span className="sim-pack__feat"><Layers size={13}/> ETFs</span><span className="sim-pack__feat"><Gem size={13}/> Matières</span><span className="sim-pack__feat"><Landmark size={13}/> Obligations</span><span className="sim-pack__feat"><Calendar size={13}/> Agenda marchés</span><span className="sim-pack__feat"><Clock size={13}/> Sessions live</span></div>
        {isUnlocked('simAdvanced') ? <button className="sim-pack__btn sim-pack__btn--pro" onClick={() => setActiveTab('advanced')}>Ouvrir →</button> : (<div className="sim-pack__unlock"><input type="text" value={codeAdv} onChange={e => setCodeAdv(e.target.value)} placeholder={t('sim.accessCode')} className={errAdv ? 'sim-pack__input--err' : ''} onKeyDown={e => e.key === 'Enter' && tryUnlock('simAdvanced', codeAdv)} /><button className="sim-pack__btn-unlock" onClick={() => tryUnlock('simAdvanced', codeAdv)}><Lock size={16} /> {t('sim.unlock')}</button></div>)}
        {errAdv && <span className="sim-pack__err">{t('sim.wrongCode')}</span>}
      </div>
    </div></div>
    <Footer />
  </div>)
}