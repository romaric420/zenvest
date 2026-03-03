import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Lock, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import Footer from '../../components/Footer/Footer';
import './Simulator.css';

/* ═══════ CONSTANTS ═══════ */
const FEE=0.0016;
const STORE_SIMPLE='zv_sim_simple_v1';
const STORE_ADV='zv_sim_adv_v2';
const TOP=['BTC','ETH','SOL','XRP','ADA','DOT','LINK','AVAX','DOGE','SHIB','ATOM','UNI','AAVE','LTC','BCH','MATIC','ALGO','APT','ARB','OP','SUI','NEAR','INJ','SEI','FET','MKR','GRT','SAND','AXS','MANA','CRV','SNX','COMP','FIL','RUNE','PEPE','RENDER','TIA','STX','IMX'];
const SIMPLE_ASSETS=[{k:'btc',l:'Bitcoin (BTC/EUR)'},{k:'eth',l:'Ethereum (ETH/EUR)'},{k:'sol',l:'Solana (SOL/EUR)'},{k:'dot',l:'Polkadot (DOT/EUR)'},{k:'link',l:'Chainlink (LINK/EUR)'}];
function fmt(v,d){if(v==null)return'—';const dd=d!==undefined?d:Math.abs(v)<.01?6:Math.abs(v)<1?4:Math.abs(v)<100?3:2;return v.toLocaleString('fr-FR',{minimumFractionDigits:dd,maximumFractionDigits:dd})}
function fE(v){return fmt(v,2)+' €'}
function fS(v,s='€'){return(v>=0?'+':'')+fmt(v,2)+(s?' '+s:'')}
function calc(t,p){if(!p)return{net:0,pct:0,fees:0,val:t.amount,qty:0};const q=t.amount/t.entry;const r=t.type==='long'?(p-t.entry)*q:(t.entry-p)*q;const ef=t.amount*FEE;const xf=Math.abs(t.amount+r)*FEE;const f=ef+xf;const n=r-f;return{net:n,pct:(n/t.amount)*100,fees:f,val:t.amount+n,qty:q}}
function cleanK(n){if(n.includes('XBT'))return'btc';return n.replace(/EUR$/i,'').replace(/^X{1,2}/,'').replace(/^Z/,'').toLowerCase()}
function badge(title){const t=title.toLowerCase();if(/crypto|bitcoin|btc|eth|sec |binance|coinbase|blockchain/.test(t))return{c:'CRYPTO',bg:'#8b5cf6'};if(/geo|war|conflict|china|russia|iran|tariff/.test(t))return{c:'GEO',bg:'#f59e0b'};if(/fed |inflation|rates?|powell|central bank/.test(t))return{c:'URGENT',bg:'#ef4444'};if(/tech|ai |intelligence|nvidia|apple|google/.test(t))return{c:'TECH',bg:'#3b82f6'};return{c:'MACRO',bg:'#10b981'}}

/* ═══════ SIMPLE SIMULATOR COMPONENT ═══════ */
function SimpleSimulator({T}){
  const[st,setSt]=useState(()=>{try{const s=localStorage.getItem(STORE_SIMPLE);if(s)return JSON.parse(s)}catch{}return{initCap:2000,cash:2000,trades:{},alerts:[],history:[]}});
  const[mk,setMk]=useState({});
  const[toast,setToast]=useState('');const[tv,setTv]=useState(false);const timer=useRef(null);
  const chartRef=useRef(null);const chartInst=useRef(null);
  const show=(m)=>{setToast(m);setTv(true);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setTv(false),3000)};
  useEffect(()=>{localStorage.setItem(STORE_SIMPLE,JSON.stringify(st))},[st]);
  const sync=useCallback(async()=>{try{const r=await fetch('https://api.kraken.com/0/public/Ticker?pair=BTCEUR,ETHEUR,SOLEUR,DOTEUR,LINKEUR');const d=await r.json();if(d.result){const nm={};Object.entries(d.result).forEach(([p,i])=>{const k=cleanK(p);nm[k]={price:parseFloat(i.c[0]),move:((parseFloat(i.c[0])-parseFloat(i.o))/parseFloat(i.o))*100}});setMk(nm)}}catch(e){console.error(e)}},[]);
  useEffect(()=>{sync();const i=setInterval(sync,10000);return()=>clearInterval(i)},[sync]);
  // Chart
  useEffect(()=>{if(!chartRef.current||st.history.length<2)return;const render=()=>{if(!window.Chart)return;const ctx=chartRef.current.getContext('2d');if(chartInst.current)chartInst.current.destroy();chartInst.current=new window.Chart(ctx,{type:'line',data:{labels:st.history.map(h=>h.t),datasets:[{data:st.history.map(h=>h.v),borderColor:'#59A52C',fill:true,tension:.3,backgroundColor:'rgba(89,165,44,0.05)',borderWidth:2,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}})};if(!window.Chart){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';s.onload=render;document.head.appendChild(s)}else render();return()=>{if(chartInst.current)chartInst.current.destroy()}},[st.history]);
  // Computed
  let tpv=0;const tc={};Object.keys(st.trades).forEach(k=>{const p=mk[k]?.price||0;const m=calc(st.trades[k],p);tc[k]={m,p};tpv+=m.val});const totalVal=st.cash+tpv;
  // Save history
  useEffect(()=>{if(totalVal>0&&Object.keys(mk).length>0){setSt(prev=>{const now=new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});const last=prev.history[prev.history.length-1];if(last&&last.t===now)return prev;const h=[...prev.history,{t:now,v:totalVal}];if(h.length>30)h.shift();return{...prev,history:h}})}},[mk]);//eslint-disable-line
  const openTrade=()=>{const asset=document.getElementById('s-asset').value;const amount=parseFloat(document.getElementById('s-amount').value);const entryIn=parseFloat(document.getElementById('s-entry').value);const type=document.getElementById('s-type').value;const price=entryIn>0?entryIn:mk[asset]?.price;if(!amount||amount>st.cash)return show('❌ Montant invalide');if(!price)return show('⏳ Prix indisponible');setSt(prev=>({...prev,cash:prev.cash-amount,trades:{...prev.trades,[asset]:{type,amount,entry:price}}}));show(`✅ ${asset.toUpperCase()} ${type} ouvert`)};
  const closeTrade=(k)=>{const m=calc(st.trades[k],mk[k]?.price);setSt(prev=>{const t={...prev.trades};delete t[k];return{...prev,cash:prev.cash+m.val,trades:t}});show('💼 Position fermée')};
  const addAlert=()=>{const target=parseFloat(document.getElementById('s-alert').value);const asset=document.getElementById('s-asset').value;if(target>0){setSt(prev=>({...prev,alerts:[...prev.alerts,{asset,target,id:Date.now()}]}));show('🔔 Alerte créée')}};
  // Check alerts
  useEffect(()=>{if(!mk||st.alerts.length===0)return;const rem=st.alerts.filter(a=>{const p=mk[a.asset]?.price;if(p&&p>=a.target){show(`🚨 ${a.asset.toUpperCase()} @ ${a.target}€`);return false}return true});if(rem.length!==st.alerts.length)setSt(prev=>({...prev,alerts:rem}))},[mk]);//eslint-disable-line

  return(
    <div className="sim-simple">
      {/* Ticker */}
      <div className="ss-ticker">{Object.entries(mk).map(([k,d],i)=><React.Fragment key={k}>{i>0&&<span className="ss-ticker__sep">|</span>}<div className="ss-ticker__item"><span className="ss-ticker__pair">{k.toUpperCase()}</span><span className="ss-ticker__price">{fmt(d.price)}€</span><span className={`ss-ticker__ch ${d.move>=0?'ss-ticker__ch--up':'ss-ticker__ch--dn'}`}>{d.move>=0?'+':''}{d.move.toFixed(2)}%</span></div></React.Fragment>)}</div>
      {/* Header */}
      <div className="ss-header"><span className="ss-header__label">Valeur Portefeuille</span><span className="ss-header__val">{fE(totalVal)}</span></div>
      {/* Body */}
      <div className="ss-grid">
        <div>
          <div className="ss-card"><div className="ss-card__title">Répartition du Capital</div>
            {Object.keys(st.trades).map(k=>{const m=tc[k]?.m;if(!m)return null;const pct=(m.val/(totalVal||1))*100;const up=m.pct>=0;return(<div key={k} className="ss-alloc"><div className="ss-alloc__top"><div><strong>{k.toUpperCase()}</strong><span className="ss-alloc__val">{fE(m.val)} <small>({pct.toFixed(1)}%)</small></span></div><span style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700,fontSize:'.85rem'}}>{fS(m.pct,'%')}</span></div><div className="ss-bar"><div className="ss-bar__fill" style={{width:`${pct}%`}}/></div></div>)})}
            <div className="ss-alloc"><div className="ss-alloc__top"><span style={{color:'var(--zv-text-muted)',fontSize:'.8rem'}}>CASH</span><span style={{fontWeight:700}}>{fE(st.cash)}</span></div><div className="ss-bar"><div className="ss-bar__fill ss-bar__fill--cash" style={{width:`${(st.cash/(totalVal||1))*100}%`}}/></div></div>
          </div>
          <div className="ss-card"><div className="ss-card__title">Performance</div><div style={{height:120}}><canvas ref={chartRef}/></div></div>
          <div className="ss-card"><div className="ss-card__title">Positions Actives</div>
            {Object.keys(st.trades).length===0?<div className="ss-empty">Aucune position</div>:
            <div style={{overflowX:'auto'}}><table className="ss-table"><thead><tr><th>Actif</th><th>Type</th><th>Entrée</th><th>Actuel</th><th>Frais</th><th>P&L</th><th></th></tr></thead><tbody>{Object.keys(st.trades).map(k=>{const m=tc[k]?.m;const up=m?.pct>=0;return(<tr key={k}><td><strong>{k.toUpperCase()}</strong></td><td style={{color:st.trades[k].type==='long'?'var(--zv-green)':'var(--zv-danger)',fontWeight:700}}>{st.trades[k].type.toUpperCase()}</td><td>{fmt(st.trades[k].entry)}€</td><td>{fmt(tc[k]?.p)}€</td><td style={{color:'var(--zv-text-muted)',fontSize:'.7rem'}}>{fmt(m?.fees)}€</td><td style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700}}>{fS(m?.net)}</td><td><button className="ss-btn-close" onClick={()=>closeTrade(k)}>Clôturer</button></td></tr>)})}</tbody></table></div>}
          </div>
        </div>
        <div>
          <div className="ss-card"><div className="ss-card__title">Nouveau Trade</div>
            <div className="ss-form"><label>Paire</label><select id="s-asset">{SIMPLE_ASSETS.map(a=><option key={a.k} value={a.k}>{a.l}</option>)}</select></div>
            <div className="ss-form"><label>Direction</label><select id="s-type"><option value="long">LONG (Achat)</option><option value="short">SHORT (Vente)</option></select></div>
            <div className="ss-form"><label>Prix d'entrée (€)</label><input type="number" id="s-entry" placeholder="Auto" step="any"/></div>
            <div className="ss-form"><label>Allocation (€)</label><input type="number" id="s-amount" placeholder="500"/></div>
            <button className="ss-btn-exec" onClick={openTrade}>Exécuter</button>
            <div className="ss-cash">Cash: {fE(st.cash)}</div>
          </div>
          <div className="ss-card"><div className="ss-card__title">Alertes 🔔</div>
            <div className="ss-form"><input type="number" id="s-alert" placeholder="Prix cible (€)"/></div>
            <button className="ss-btn-alert" onClick={addAlert}>Créer alerte</button>
            {st.alerts.map(a=><div key={a.id} className="ss-alert-item"><span><strong>{a.asset.toUpperCase()}</strong> &gt; {fmt(a.target)}€</span><button onClick={()=>setSt(prev=>({...prev,alerts:prev.alerts.filter(x=>x.id!==a.id)}))}>✕</button></div>)}
          </div>
          <div className="ss-card" style={{borderTop:'3px solid var(--zv-danger)'}}><div className="ss-card__title">Compte</div>
            <div className="ss-form"><label>Capital Initial</label><input type="number" id="s-cap" defaultValue={st.initCap}/></div>
            <button className="ss-btn-update" onClick={()=>{const v=parseFloat(document.getElementById('s-cap').value);if(v>0){setSt(prev=>({...prev,cash:prev.cash+(v-prev.initCap),initCap:v}));show('💰 OK')}}}>Mettre à jour</button>
            <button className="ss-btn-reset" onClick={()=>{if(window.confirm('Effacer?')){localStorage.removeItem(STORE_SIMPLE);window.location.reload()}}}>🗑️ Reset</button>
          </div>
        </div>
      </div>
      <div className={`sim-toast ${tv?'sim-toast--vis':''}`}>{toast}</div>
    </div>
  );
}

/* ═══════ ADVANCED SIMULATOR ═══════ */
function AdvancedSimulator({T}){
  const[st,setSt]=useState(()=>{try{const s=localStorage.getItem(STORE_ADV);if(s)return JSON.parse(s)}catch{}return{initCap:10000,cash:10000,trades:[],closedTrades:[],alerts:[],history:[],nextId:1}});
  const[mk,setMk]=useState({});const[allPairs,setAllPairs]=useState({});
  const[news,setNews]=useState([]);const[newsL,setNewsL]=useState(true);
  const[toast,setToast]=useState('');const[tv,setTv]=useState(false);
  const[showHist,setShowHist]=useState(false);const[search,setSearch]=useState('');
  const[fAsset,setFA]=useState('BTC');const[fType,setFT]=useState('long');
  const[fEntry,setFE]=useState('');const[fAmt,setFAm]=useState('');
  const[fSL,setFSL]=useState('');const[fTP,setFTP]=useState('');
  const[aAsset,setAA]=useState('BTC');const[aPrice,setAP]=useState('');const[capIn,setCI]=useState('');
  const chartRef=useRef(null);const chartInst=useRef(null);const tTimer=useRef(null);const mkRef=useRef(mk);mkRef.current=mk;
  const show=(m)=>{setToast(m);setTv(true);if(tTimer.current)clearTimeout(tTimer.current);tTimer.current=setTimeout(()=>setTv(false),3500)};
  useEffect(()=>{localStorage.setItem(STORE_ADV,JSON.stringify(st))},[st]);
  // Load pairs
  useEffect(()=>{(async()=>{try{const r=await fetch('https://api.kraken.com/0/public/AssetPairs');const d=await r.json();if(!d.result)return;const map={};Object.entries(d.result).forEach(([k,v])=>{if(v.wsname&&v.wsname.endsWith('/EUR')&&!k.includes('.d')){const base=v.wsname.split('/')[0];if(base&&!map[base])map[base]=k}});if(map['XBT']&&!map['BTC']){map['BTC']=map['XBT'];delete map['XBT']}setAllPairs(map)}catch(e){console.error(e)}})()},[]);
  // Sync prices
  const syncMk=useCallback(async()=>{if(!Object.keys(allPairs).length)return;const need=new Set(TOP);st.trades.forEach(t=>need.add(t.asset));st.alerts.forEach(a=>need.add(a.asset));const kp=[];need.forEach(s=>{if(allPairs[s])kp.push(allPairs[s])});if(!kp.length)return;const batches=[];for(let i=0;i<kp.length;i+=30)batches.push(kp.slice(i,i+30));const nm={...mkRef.current};for(const b of batches){try{const r=await fetch(`https://api.kraken.com/0/public/Ticker?pair=${b.join(',')}`);const d=await r.json();if(d.result){Object.entries(d.result).forEach(([pair,info])=>{let sym=null;for(const[s,p]of Object.entries(allPairs)){if(p===pair){sym=s;break}}if(!sym&&pair.includes('XBT'))sym='BTC';if(sym){const price=parseFloat(info.c[0]);const open=parseFloat(info.o);nm[sym]={price,open,high:parseFloat(info.h[1]),low:parseFloat(info.l[1]),vol:parseFloat(info.v[1]),move:((price-open)/open)*100,pair}}})}}catch(e){}}setMk(nm)},[allPairs,st.trades,st.alerts]);
  useEffect(()=>{if(!Object.keys(allPairs).length)return;syncMk();const i=setInterval(syncMk,8000);return()=>clearInterval(i)},[allPairs,syncMk]);
  // SL/TP
  useEffect(()=>{if(!Object.keys(mk).length||!st.trades.length)return;let ch=false;const rem=[];const nc=[...st.closedTrades];let cd=0;st.trades.forEach(trade=>{const p=mk[trade.asset]?.price;if(!p){rem.push(trade);return}let trig=null;if(trade.sl>0){if(trade.type==='long'&&p<=trade.sl)trig='SL';if(trade.type==='short'&&p>=trade.sl)trig='SL'}if(trade.tp>0){if(trade.type==='long'&&p>=trade.tp)trig='TP';if(trade.type==='short'&&p<=trade.tp)trig='TP'}if(trig){const m=calc(trade,p);cd+=m.val;nc.push({...trade,exitPrice:p,exitTime:Date.now(),pnl:m.net,pnlPct:m.pct,reason:trig});ch=true;show(`${trig==='SL'?'🛑':'🎯'} ${trig}: ${trade.asset} ${fS(m.net)}`)}else rem.push(trade)});if(ch)setSt(prev=>({...prev,trades:rem,closedTrades:nc,cash:prev.cash+cd}))},[mk]);//eslint-disable-line
  // Alerts
  useEffect(()=>{if(!Object.keys(mk).length||!st.alerts.length)return;const trig=[];const rem=st.alerts.filter(a=>{const p=mk[a.asset]?.price;if(p&&((a.direction==='above'&&p>=a.target)||(a.direction==='below'&&p<=a.target))){trig.push(a);return false}return true});if(trig.length){trig.forEach(a=>show(`🚨 ${a.asset} ${a.direction==='above'?'≥':'≤'} ${fmt(a.target)}€`));setSt(prev=>({...prev,alerts:rem}))}},[mk]);//eslint-disable-line
  // News
  useEffect(()=>{const fn=async()=>{setNewsL(true);try{const q=encodeURIComponent('FED OR inflation OR bitcoin OR crypto OR earnings');const rss=`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;const r=await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&t=${Date.now()}`);const d=await r.json();if(d?.status==='ok'&&d.items)setNews(d.items.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate)).slice(0,12))}catch(e){}setNewsL(false)};fn();const i=setInterval(fn,300000);return()=>clearInterval(i)},[]);
  // Chart
  useEffect(()=>{if(!chartRef.current||st.history.length<2)return;const render=()=>{if(!window.Chart)return;const ctx=chartRef.current.getContext('2d');if(chartInst.current)chartInst.current.destroy();const data=st.history.map(h=>h.v);const up=data.length>1&&data[data.length-1]>=data[0];chartInst.current=new window.Chart(ctx,{type:'line',data:{labels:st.history.map(h=>h.t),datasets:[{data,borderColor:up?'#59A52C':'#ef4444',fill:true,tension:.35,backgroundColor:up?'rgba(89,165,44,0.06)':'rgba(239,68,68,0.06)',borderWidth:2.5,pointRadius:0,pointHitRadius:8}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>fE(c.raw)}}},scales:{x:{display:false},y:{display:false}},interaction:{intersect:false,mode:'index'}}})};if(!window.Chart){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';s.onload=render;document.head.appendChild(s)}else render();return()=>{if(chartInst.current)chartInst.current.destroy()}},[st.history]);
  // Computed
  let tpv=0;const trC=st.trades.map(trade=>{const p=mk[trade.asset]?.price||0;const m=calc(trade,p);tpv+=m.val;return{trade,price:p,m}});const totalVal=st.cash+tpv;const totalPnl=totalVal-st.initCap;const totalPnlPct=st.initCap>0?(totalPnl/st.initCap)*100:0;
  useEffect(()=>{if(totalVal>0&&Object.keys(mk).length>0){setSt(prev=>{const now=new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});const last=prev.history[prev.history.length-1];if(last&&last.t===now)return prev;const h=[...prev.history,{t:now,v:totalVal}];if(h.length>60)h.shift();return{...prev,history:h}})}},[mk]);//eslint-disable-line
  const assetList=useMemo(()=>{const keys=Object.keys(allPairs).sort((a,b)=>{const ai=TOP.indexOf(a),bi=TOP.indexOf(b);if(ai!==-1&&bi!==-1)return ai-bi;if(ai!==-1)return-1;if(bi!==-1)return 1;return a.localeCompare(b)});if(!search)return keys;const s=search.toUpperCase();return keys.filter(k=>k.includes(s))},[allPairs,search]);
  const tickerItems=useMemo(()=>Object.entries(mk).filter(([k])=>TOP.slice(0,12).includes(k)).sort((a,b)=>Math.abs(b[1].move)-Math.abs(a[1].move)).slice(0,10),[mk]);
  const openTrade=()=>{const amount=parseFloat(fAmt);if(!amount||amount<=0)return show('❌ Montant invalide');if(amount>st.cash)return show('❌ Cash insuffisant');const eI=parseFloat(fEntry);const price=eI>0?eI:mk[fAsset]?.price;if(!price)return show('⏳ Prix indisponible');const sl=parseFloat(fSL)||0;const tp=parseFloat(fTP)||0;setSt(prev=>({...prev,cash:prev.cash-amount,nextId:prev.nextId+1,trades:[...prev.trades,{id:prev.nextId,asset:fAsset,type:fType,entry:price,amount,sl,tp,time:Date.now()}]}));setFE('');setFAm('');setFSL('');setFTP('');show(`✅ ${fType.toUpperCase()} ${fAsset} @ ${fmt(price)}€`)};
  const closeTrade=(id)=>{const trade=st.trades.find(t=>t.id===id);if(!trade)return;const p=mk[trade.asset]?.price||trade.entry;const m=calc(trade,p);setSt(prev=>({...prev,cash:prev.cash+m.val,trades:prev.trades.filter(t=>t.id!==id),closedTrades:[...prev.closedTrades,{...trade,exitPrice:p,exitTime:Date.now(),pnl:m.net,pnlPct:m.pct,reason:'manual'}]}));show(`💼 ${trade.asset} clôturé ${fS(m.net)}`)};

  return(
    <div className="sim-adv">
      <div className="sa-ticker">{tickerItems.length===0?<span style={{color:'rgba(255,255,255,.4)',fontSize:'.78rem'}}>Connexion Kraken...</span>:tickerItems.map(([sym,d],i)=><React.Fragment key={sym}>{i>0&&<span className="sa-ticker__sep">|</span>}<div className="sa-ticker__item"><span className="sa-ticker__pair">{sym}</span><span className="sa-ticker__price">{fmt(d.price)}€</span><span className={`sa-ticker__ch ${d.move>=0?'sa-ticker__ch--up':'sa-ticker__ch--dn'}`}>{d.move>=0?'+':''}{d.move.toFixed(2)}%</span></div></React.Fragment>)}</div>
      <div className="sa-portfolio"><div><div className="sa-portfolio__label">Portefeuille</div><div className="sa-portfolio__val">{fE(totalVal)}</div></div><div style={{textAlign:'right'}}><div className={`sa-portfolio__pnl ${totalPnl>=0?'sa-portfolio__pnl--up':'sa-portfolio__pnl--dn'}`}>{fS(totalPnl)} ({fS(totalPnlPct,'%')})</div><div style={{fontSize:'.7rem',color:'var(--zv-text-muted)',marginTop:2}}>Capital: {fE(st.initCap)} · Cash: {fE(st.cash)}</div></div></div>
      <div className="sa-layout">
        <div>
          <div className="sa-grid2">
            <div className="sa-card"><div className="sa-card__t">Allocation <span>{st.trades.length} pos.</span></div>{trC.map(({trade,m})=>{const pct=(m.val/(totalVal||1))*100;const up=m.pct>=0;return(<div key={trade.id} className="ss-alloc"><div className="ss-alloc__top"><div><strong>{trade.asset}</strong><span className={`sa-badge sa-badge--${trade.type}`}>{trade.type.toUpperCase()}</span><span className="ss-alloc__val">{fE(m.val)} <small>({pct.toFixed(1)}%)</small></span></div><span style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700,fontSize:'.8rem',fontFamily:'var(--zv-mono)'}}>{fS(m.pct,'%')}</span></div><div className="ss-bar"><div className="ss-bar__fill" style={{width:`${Math.max(pct,.5)}%`}}/></div></div>)})}
              <div className="ss-alloc"><div className="ss-alloc__top"><span style={{color:'var(--zv-text-muted)',fontSize:'.8rem'}}>CASH</span><span style={{fontWeight:700}}>{fE(st.cash)}</span></div><div className="ss-bar"><div className="ss-bar__fill ss-bar__fill--cash" style={{width:`${(st.cash/(totalVal||1))*100}%`}}/></div></div>
              {st.trades.length===0&&<div className="ss-empty">📊 Ouvrez un trade</div>}
            </div>
            <div className="sa-card"><div className="sa-card__t">Performance</div><div style={{height:200}}><canvas ref={chartRef}/>{st.history.length<2&&<div className="ss-empty">📈 En attente</div>}</div></div>
          </div>
          <div className="sa-card"><div className="sa-card__t">News 🌍 <span>Live Feed</span></div><div className="sa-news">{newsL?<div className="ss-empty">Chargement...</div>:news.map((item,i)=>{const b=badge(item.title);const time=new Date(item.pubDate).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});return(<div key={i} className="sa-news-item"><div className="sa-news-meta"><span className="sa-news-badge" style={{background:b.bg}}>{b.c}</span><span className="sa-news-time">🕒 {time} · {item.author||'Global'}</span></div><a href={item.link} target="_blank" rel="noopener noreferrer" className="sa-news-title">{item.title}</a></div>)})}</div></div>
          <div className="sa-card"><div className="sa-card__t">Positions <button className="sa-btn-hist" onClick={()=>setShowHist(!showHist)}>{showHist?'Actives':'Historique'} ({st.closedTrades.length})</button></div>
            {!showHist?(st.trades.length===0?<div className="ss-empty">💼 Aucune</div>:<div style={{overflowX:'auto'}}><table className="ss-table"><thead><tr><th>Actif</th><th>Type</th><th>Qté</th><th>Entrée</th><th>Actuel</th><th>SL</th><th>TP</th><th>Frais</th><th>P&L</th><th>%</th><th></th></tr></thead><tbody>{trC.map(({trade,price,m})=>{const up=m.pct>=0;return(<tr key={trade.id}><td><strong>{trade.asset}</strong></td><td><span className={`sa-badge sa-badge--${trade.type}`}>{trade.type.toUpperCase()}</span></td><td style={{fontSize:'.75rem'}}>{m.qty.toFixed(4)}</td><td>{fmt(trade.entry)}€</td><td><strong>{fmt(price)}€</strong></td><td style={{color:'var(--zv-text-muted)',fontSize:'.7rem'}}>{trade.sl?fmt(trade.sl)+'€':'—'}</td><td style={{color:'var(--zv-text-muted)',fontSize:'.7rem'}}>{trade.tp?fmt(trade.tp)+'€':'—'}</td><td style={{color:'var(--zv-text-muted)',fontSize:'.7rem'}}>{fmt(m.fees)}€</td><td style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700}}>{fS(m.net)}</td><td style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700}}>{fS(m.pct,'%')}</td><td><button className="ss-btn-close" onClick={()=>closeTrade(trade.id)}>Clôturer</button></td></tr>)})}</tbody></table></div>)
            :(st.closedTrades.length===0?<div className="ss-empty">Aucun historique</div>:<div style={{overflowX:'auto'}}><table className="ss-table"><thead><tr><th>Actif</th><th>Type</th><th>Entrée</th><th>Sortie</th><th>P&L</th><th>%</th><th>Raison</th></tr></thead><tbody>{[...st.closedTrades].reverse().slice(0,30).map((t,i)=>{const up=t.pnl>=0;return(<tr key={i}><td><strong>{t.asset}</strong></td><td><span className={`sa-badge sa-badge--${t.type}`}>{t.type.toUpperCase()}</span></td><td>{fmt(t.entry)}€</td><td>{fmt(t.exitPrice)}€</td><td style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700}}>{fS(t.pnl)}</td><td style={{color:up?'var(--zv-green)':'var(--zv-danger)',fontWeight:700}}>{fS(t.pnlPct,'%')}</td><td><span className={`sa-reason sa-reason--${t.reason}`}>{t.reason?.toUpperCase()}</span></td></tr>)})}</tbody></table></div>)}
          </div>
        </div>
        <aside>
          <div className="sa-card"><div className="sa-card__t">Nouveau Trade</div>
            <div className="ss-form"><label>Actif ({Object.keys(allPairs).length})</label><input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:6,fontFamily:'inherit'}}/><select value={fAsset} onChange={e=>setFA(e.target.value)}>{assetList.slice(0,200).map(a=><option key={a} value={a}>{a}/EUR {mk[a]?`— ${fmt(mk[a].price)}€`:''}</option>)}</select></div>
            <div className="ss-form"><label>Direction</label><div className="sa-dir"><button className={`sa-dir__btn sa-dir__btn--long ${fType==='long'?'sa-dir__btn--act':''}`} onClick={()=>setFT('long')}>▲ LONG</button><button className={`sa-dir__btn sa-dir__btn--short ${fType==='short'?'sa-dir__btn--act':''}`} onClick={()=>setFT('short')}>▼ SHORT</button></div></div>
            {mk[fAsset]&&<div className="sa-mkinfo"><span>Prix: <strong>{fmt(mk[fAsset].price)}€</strong></span><span>24h: <strong style={{color:mk[fAsset].move>=0?'var(--zv-green)':'var(--zv-danger)'}}>{mk[fAsset].move>=0?'+':''}{mk[fAsset].move.toFixed(2)}%</strong></span></div>}
            <div className="sa-row"><div className="ss-form" style={{flex:1}}><label>Prix entrée</label><input type="number" value={fEntry} onChange={e=>setFE(e.target.value)} placeholder="Auto" step="any"/></div><div className="ss-form" style={{flex:1}}><label>Montant (€)</label><input type="number" value={fAmt} onChange={e=>setFAm(e.target.value)} placeholder="500"/></div></div>
            <div className="sa-row"><div className="ss-form" style={{flex:1}}><label>Stop Loss</label><input type="number" value={fSL} onChange={e=>setFSL(e.target.value)} placeholder="Optionnel" step="any"/></div><div className="ss-form" style={{flex:1}}><label>Take Profit</label><input type="number" value={fTP} onChange={e=>setFTP(e.target.value)} placeholder="Optionnel" step="any"/></div></div>
            <button className="ss-btn-exec" onClick={openTrade}>⚡ Exécuter</button>
            <div className="ss-cash">Cash: <strong>{fE(st.cash)}</strong></div>
          </div>
          <div className="sa-card"><div className="sa-card__t">Alertes 🔔</div>
            <div style={{display:'flex',gap:8,marginBottom:8}}><select value={aAsset} onChange={e=>setAA(e.target.value)} style={{flex:'0 0 90px'}}>{TOP.slice(0,20).map(a=>allPairs[a]?<option key={a} value={a}>{a}</option>:null)}</select><input type="number" value={aPrice} onChange={e=>setAP(e.target.value)} placeholder="Prix cible" step="any" style={{flex:1}}/></div>
            <button className="sa-btn-alert" onClick={()=>{const target=parseFloat(aPrice);if(target>0){const dir=target>=(mk[aAsset]?.price||0)?'above':'below';setSt(prev=>({...prev,alerts:[...prev.alerts,{asset:aAsset,target,direction:dir,id:Date.now()}]}));setAP('');show(`🔔 Alerte ${aAsset}`)}}}>Créer</button>
            {st.alerts.map(a=><div key={a.id} className="ss-alert-item"><span><strong>{a.asset}</strong> {a.direction==='above'?'≥':'≤'} {fmt(a.target)}€</span><button onClick={()=>setSt(prev=>({...prev,alerts:prev.alerts.filter(x=>x.id!==a.id)}))}>✕</button></div>)}
          </div>
          <div className="sa-card" style={{borderTop:'3px solid var(--zv-danger)'}}><div className="sa-card__t">Compte</div>
            <div className="ss-form"><label>Capital (€)</label><input type="number" value={capIn} onChange={e=>setCI(e.target.value)} placeholder={st.initCap.toString()}/></div>
            <button className="ss-btn-update" onClick={()=>{const v=parseFloat(capIn);if(v>0){setSt(prev=>({...prev,cash:prev.cash+(v-prev.initCap),initCap:v}));setCI('');show('💰 OK')}}}>Mettre à jour</button>
            <button className="ss-btn-reset" onClick={()=>{if(window.confirm('Reset?')){localStorage.removeItem(STORE_ADV);window.location.reload()}}}>🗑️ Reset</button>
          </div>
        </aside>
      </div>
      <div className={`sim-toast ${tv?'sim-toast--vis':''}`}>{toast}</div>
    </div>
  );
}

/* ═══════ MAIN PAGE ═══════ */
export default function SimulatorPage(){
  const{t,lang}=useLanguage();const{isUnlocked,unlock}=useProgress();const navigate=useNavigate();
  const[codeBasic,setCodeBasic]=useState('');const[codeAdv,setCodeAdv]=useState('');
  const[errBasic,setErrBasic]=useState(false);const[errAdv,setErrAdv]=useState(false);
  const[activeTab,setActiveTab]=useState(null);
  const T=lang==='fr'?{s:'Simulateur'}:{s:'Simulator'};

  const tryUnlock=(type,code)=>{const ok=unlock(type,code);if(!ok){if(type==='simBasic')setErrBasic(true);else setErrAdv(true);setTimeout(()=>{setErrBasic(false);setErrAdv(false)},2000)}else{setActiveTab(type==='simBasic'?'basic':'advanced')}};

  if(activeTab==='basic'&&isUnlocked('simBasic'))return(<div><div className="sim-page-hdr"><div className="container"><button className="courses__back" onClick={()=>setActiveTab(null)} style={{color:'rgba(255,255,255,.5)'}}><ArrowLeft size={18}/> Retour</button></div></div><SimpleSimulator T={T}/><Footer/></div>);
  if(activeTab==='advanced'&&isUnlocked('simAdvanced'))return(<div><div className="sim-page-hdr"><div className="container"><button className="courses__back" onClick={()=>setActiveTab(null)} style={{color:'rgba(255,255,255,.5)'}}><ArrowLeft size={18}/> Retour</button></div></div><AdvancedSimulator T={T}/><Footer/></div>);

  return(
    <div>
      <div className="sim-hero"><div className="sim-hero__bg"/><div className="sim-hero__icons">{['📊','💹','📈','⚡','🪙','📉','💰','🔗','💎'].map((ic,i)=><span key={i} className={`hero__icon hero__icon--${(i%3)+1}`} style={{left:`${5+(i*10)%85}%`,top:`${10+(i*17)%70}%`,animationDelay:`${i*.8}s`,fontSize:`${1+(i%3)*.4}rem`}}>{ic}</span>)}</div><div className="container" style={{position:'relative',zIndex:2}}>
        <button className="courses__back" onClick={()=>navigate('/')} style={{color:'rgba(255,255,255,.5)'}}><ArrowLeft size={18}/> {t('nav.home')}</button>
        <h1 className="sim-hero__title">{t('sim.title')}</h1>
        <p className="sim-hero__sub">{t('sim.subtitle')}</p>
      </div></div>
      <div className="container">
        <div className="sim-packs">
          {/* Basic Pack */}
          <div className="sim-pack sim-pack--basic">
            <div className="sim-pack__head">
              <span className="sim-pack__badge"><Zap size={14}/> {t('sim.basic.badge')}</span>
              <div className="sim-pack__price">{t('sim.basic.price')}</div>
            </div>
            <div className="sim-pack__img"><img src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=300&fit=crop&q=80" alt="" /></div>
            <h3>{t('sim.basic.title')}</h3>
            <p>{t('sim.basic.desc')}</p>
            {isUnlocked('simBasic')?<button className="sim-pack__btn" onClick={()=>setActiveTab('basic')}>Ouvrir →</button>:(
              <div className="sim-pack__unlock">
                <input type="text" value={codeBasic} onChange={e=>setCodeBasic(e.target.value)} placeholder={t('sim.accessCode')}
                  className={errBasic?'sim-pack__input--err':''} onKeyDown={e=>e.key==='Enter'&&tryUnlock('simBasic',codeBasic)}/>
                <button onClick={()=>tryUnlock('simBasic',codeBasic)}><Lock size={16}/> {t('sim.unlock')}</button>
              </div>
            )}
            {errBasic&&<span className="sim-pack__err">{t('sim.wrongCode')}</span>}
          </div>
          {/* Advanced Pack */}
          <div className="sim-pack sim-pack--adv">
            <div className="sim-pack__head">
              <span className="sim-pack__badge sim-pack__badge--pro"><Crown size={14}/> {t('sim.advanced.badge')}</span>
              <div className="sim-pack__price">{t('sim.advanced.price')}</div>
            </div>
            <div className="sim-pack__img"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&q=80" alt="" /></div>
            <h3>{t('sim.advanced.title')}</h3>
            <p>{t('sim.advanced.desc')}</p>
            {isUnlocked('simAdvanced')?<button className="sim-pack__btn sim-pack__btn--pro" onClick={()=>setActiveTab('advanced')}>Ouvrir →</button>:(
              <div className="sim-pack__unlock">
                <input type="text" value={codeAdv} onChange={e=>setCodeAdv(e.target.value)} placeholder={t('sim.accessCode')}
                  className={errAdv?'sim-pack__input--err':''} onKeyDown={e=>e.key==='Enter'&&tryUnlock('simAdvanced',codeAdv)}/>
                <button onClick={()=>tryUnlock('simAdvanced',codeAdv)}><Lock size={16}/> {t('sim.unlock')}</button>
              </div>
            )}
            {errAdv&&<span className="sim-pack__err">{t('sim.wrongCode')}</span>}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
