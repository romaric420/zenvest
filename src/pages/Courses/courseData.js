/* ═══════════════════════════════════════════
   ZENVEST — Complete Course Data
   Rich pedagogical content with exercises,
   illustrations, schemas, and tips
   ═══════════════════════════════════════════ */

const TIP = (text) => `<div style="background:#f0fdf4;border-left:4px solid #59A52C;padding:16px 20px;border-radius:0 12px 12px 0;margin:20px 0"><strong>💡 Conseil :</strong> ${text}</div>`;
const WARN = (text) => `<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 12px 12px 0;margin:20px 0"><strong>⚠️ Attention :</strong> ${text}</div>`;
const INFO = (text) => `<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 12px 12px 0;margin:20px 0"><strong>📘 Info :</strong> ${text}</div>`;
const DATA = (text) => `<div style="background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:20px;border-radius:12px;margin:20px 0">${text}</div>`;
const EXER = (title, body) => `<div style="background:#fefce8;border:2px dashed #f59e0b;padding:20px;border-radius:12px;margin:24px 0"><strong>✏️ Exercice : ${title}</strong><br/><br/>${body}</div>`;
const SCHEMA = (title, items) => `<div style="background:var(--zv-bg,#f0f4f8);padding:24px;border-radius:12px;margin:20px 0;border:1px solid #e2e8f0"><h4 style="margin:0 0 12px;font-size:1rem;color:#0f172a">${title}</h4>${items.map((it,i) => `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;padding:8px 12px;background:#fff;border-radius:8px;border:1px solid #e2e8f0"><span style="background:linear-gradient(135deg,#59A52C,#6fca3a);color:#fff;font-weight:800;font-size:.75rem;padding:3px 8px;border-radius:6px;white-space:nowrap">${String(i+1).padStart(2,'0')}</span><div><strong>${it.t}</strong><br/><span style="color:#64748b;font-size:.88rem">${it.d}</span></div></div>`).join('')}</div>`;
const IMG = (url, alt) => `<img src="${url}" alt="${alt}" style="width:100%;border-radius:12px;margin:20px 0;box-shadow:0 8px 24px rgba(0,0,0,0.08)"/>`;

export const COURSES_DATA = {
  investing: {
    modules: [
      { id:'inv-01', title:{fr:'Introduction à l\'investissement',en:'Introduction to Investing'},
        content:{
          fr:`<h2>Bienvenue dans le monde de l'investissement</h2>
<p>L'investissement est l'art de faire travailler votre argent pour vous. Ce module introductif vous donnera les bases essentielles pour comprendre les marchés financiers et prendre vos premières décisions d'investissement éclairées.</p>
${IMG('https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&h=350&fit=crop&q=80','Marchés financiers')}
<h3>Les 3 piliers de l'investissement</h3>
${SCHEMA('Les 3 piliers fondamentaux',[
  {t:'Le Rendement',d:'Le gain espéré : dividendes, intérêts ou plus-values. Historiquement ~7-10% par an pour les actions.'},
  {t:'Le Risque',d:'Tout investissement comporte un risque de perte. Plus le rendement potentiel est élevé, plus le risque l\'est généralement.'},
  {t:'La Liquidité',d:'La facilité avec laquelle vous pouvez convertir votre investissement en cash sans perte significative.'}
])}
${TIP('Ne jamais investir de l\'argent dont vous pourriez avoir besoin à court terme. L\'investissement est un marathon, pas un sprint.')}
<h3>Types d'actifs financiers</h3>
<p>Les principaux types d'actifs sont :</p>
${SCHEMA('Les 5 grandes classes d\'actifs',[
  {t:'Actions',d:'Parts de propriété dans une entreprise. Rendement historique : ~7-10%/an. Risque : élevé.'},
  {t:'Obligations',d:'Prêts aux entreprises ou gouvernements. Rendement : ~2-5%/an. Risque : faible à modéré.'},
  {t:'Immobilier',d:'Investissement dans la pierre (SCPI, REIT). Rendement : ~3-6%/an. Risque : modéré.'},
  {t:'Matières premières',d:'Or, pétrole, argent... Couverture contre l\'inflation. Rendement variable.'},
  {t:'Cryptomonnaies',d:'Actifs numériques décentralisés. Rendement potentiel très élevé. Risque : très élevé.'}
])}
${IMG('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=300&fit=crop&q=80','Graphiques boursiers')}
<h3>L'effet des intérêts composés</h3>
<p>Albert Einstein aurait qualifié les intérêts composés de « huitième merveille du monde ». C'est le principe qui fait que vos gains génèrent eux-mêmes des gains.</p>
${DATA('<strong>📊 Simulation : 10 000€ investis à 8%/an</strong><br/><br/>Après 10 ans : 21 589€<br/>Après 20 ans : 46 610€<br/>Après 30 ans : 100 627€<br/><br/><em>Votre argent a été multiplié par 10 simplement en le laissant travailler !</em>')}
${EXER('Calcul de rendement','Un investisseur achète une action à 50€. Elle verse un dividende annuel de 2€ et le cours monte à 60€ après 1 an.<br/><br/>1. Quel est le rendement en dividendes ? <br/>2. Quel est le rendement en plus-value ?<br/>3. Quel est le rendement total ?<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Voir la correction</summary><br/>1. Dividende : 2€/50€ = <strong>4%</strong><br/>2. Plus-value : (60-50)/50 = <strong>20%</strong><br/>3. Total : 4% + 20% = <strong>24%</strong></details>')}`,
          en:`<h2>Welcome to the world of investing</h2><p>Investing is the art of making your money work for you.</p>`
        }},
      { id:'inv-02', title:{fr:'Les classes d\'actifs en détail',en:'Asset Classes in Detail'},
        content:{
          fr:`<h2>Comprendre les classes d'actifs</h2>
<p>Une classe d'actifs est un ensemble d'instruments financiers partageant des caractéristiques similaires. Comprendre chaque classe est fondamental pour construire un portefeuille diversifié.</p>
${IMG('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=350&fit=crop&q=80','Asset Classes')}
<h3>1. Les Actions (Equities)</h3>
<p>Acheter une action, c'est devenir copropriétaire d'une entreprise. Vous participez à ses bénéfices via les dividendes et la hausse du cours.</p>
${DATA('<strong>📊 Performance historique S&P 500</strong><br/>Rendement annualisé moyen sur 30 ans : ~10.7%<br/>Pire année : -38.5% (2008) | Meilleure : +34.1% (1995)<br/>Années positives : ~73% du temps')}
${SCHEMA('Types d\'actions',[
  {t:'Large Cap (Blue Chips)',d:'Apple, Microsoft, LVMH — Entreprises géantes, stables, versent souvent des dividendes.'},
  {t:'Mid Cap',d:'Entreprises moyennes en croissance. Plus de potentiel mais plus de risque.'},
  {t:'Small Cap',d:'Petites entreprises. Fort potentiel mais très volatiles.'},
  {t:'Growth vs Value',d:'Growth = forte croissance attendue. Value = sous-évaluées par le marché.'}
])}
<h3>2. Les Obligations (Bonds)</h3>
<p>Les obligations sont des prêts que vous faites à un gouvernement ou une entreprise. En échange, vous recevez des intérêts réguliers (coupons) et le remboursement du capital à l'échéance.</p>
${INFO('Quand les taux d\'intérêt montent, le prix des obligations baisse (et inversement). C\'est la relation fondamentale taux-prix.')}
<h3>3. L'Immobilier</h3>
<p>L'immobilier offre des revenus locatifs réguliers et une protection contre l'inflation. Accessible via les SCPI (Sociétés Civiles de Placement Immobilier) ou les REITs en bourse.</p>
<h3>4. Matières Premières</h3>
<p>L'or est la valeur refuge historique. Le pétrole est lié aux cycles économiques. Les matières premières servent de couverture contre l'inflation.</p>
${IMG('https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=800&h=300&fit=crop&q=80','Or - valeur refuge')}
<h3>5. Cryptomonnaies</h3>
<p>Bitcoin, Ethereum et les altcoins représentent une nouvelle classe d'actifs numériques. Extrêmement volatile mais avec un potentiel de croissance important.</p>
${WARN('Les cryptomonnaies sont un investissement à très haut risque. Ne jamais investir plus que ce que vous êtes prêt à perdre totalement.')}
${EXER('Classification d\'actifs','Classez ces investissements par niveau de risque croissant :<br/>A) Obligation d\'État français 10 ans<br/>B) Action Tesla<br/>C) Bitcoin<br/>D) SCPI diversifiée<br/>E) ETF S&P 500<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Voir la correction</summary><br/>Risque croissant : <strong>A → D → E → B → C</strong><br/><br/>L\'obligation d\'État est la plus sûre, la SCPI est relativement stable, l\'ETF diversifie le risque actions, Tesla est une action volatile, et Bitcoin est l\'actif le plus volatil.</details>')}`,
          en:`<h2>Understanding asset classes</h2><p>An asset class is a group of financial instruments sharing similar characteristics.</p>`
        }},
      { id:'inv-03', title:{fr:'Construction de portefeuille',en:'Portfolio Construction'},
        content:{
          fr:`<h2>Construire un portefeuille solide</h2>
<p>La construction de portefeuille est l'art de combiner différents actifs pour optimiser le rapport rendement/risque. C'est la décision la plus importante en investissement.</p>
${IMG('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=350&fit=crop&q=80','Portfolio Construction')}
<h3>La diversification : votre bouclier</h3>
<p>Ne mettez pas tous vos œufs dans le même panier. La diversification réduit le risque spécifique sans nécessairement réduire le rendement attendu.</p>
${INFO('Harry Markowitz (Prix Nobel 1990) a démontré qu\'en combinant des actifs non corrélés, on obtient un portefeuille avec un meilleur rendement ajusté au risque. C\'est le concept de la « frontière efficiente ».')}
${SCHEMA('Portefeuilles types selon le profil',[
  {t:'Profil Prudent (60/40)',d:'60% Obligations + 30% Actions + 10% Monétaire — Rendement attendu : ~4-5%/an. Volatilité faible.'},
  {t:'Profil Équilibré',d:'50% Actions + 25% Obligations + 15% Immobilier + 10% Or — Rendement attendu : ~6-7%/an.'},
  {t:'Profil Dynamique',d:'70% Actions + 15% Immobilier + 10% Crypto + 5% Or — Rendement attendu : ~8-10%/an.'},
  {t:'Profil Agressif',d:'85% Actions (dont small caps) + 15% Crypto — Rendement potentiel : >10%/an. Volatilité très élevée.'}
])}
<h3>Corrélation entre actifs</h3>
<p>Deux actifs avec une corrélation faible ou négative se compensent mutuellement. Quand l'un baisse, l'autre tend à monter.</p>
${DATA('<strong>📊 Corrélations moyennes historiques</strong><br/><br/>Actions US vs Obligations US : <strong>-0.2</strong> (inversement corrélés)<br/>Actions US vs Or : <strong>0.0</strong> (non corrélés)<br/>Actions US vs Actions Europe : <strong>+0.8</strong> (fortement corrélés)<br/>Bitcoin vs S&P 500 : <strong>+0.3</strong> (faiblement corrélé)')}
${EXER('Construisez votre portefeuille','Vous avez 50 000€ à investir. Votre horizon est de 15 ans et votre tolérance au risque est modérée.<br/><br/>Construisez votre allocation idéale en pourcentage :<br/>— Actions : ___% <br/>— Obligations : ___%<br/>— Immobilier : ___%<br/>— Or/Matières premières : ___%<br/>— Crypto : ___%<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Suggestion</summary><br/>Pour un profil modéré sur 15 ans :<br/>Actions : <strong>55%</strong> (27 500€)<br/>Obligations : <strong>20%</strong> (10 000€)<br/>Immobilier : <strong>15%</strong> (7 500€)<br/>Or : <strong>5%</strong> (2 500€)<br/>Crypto : <strong>5%</strong> (2 500€)</details>')}`,
          en:`<h2>Building a solid portfolio</h2><p>Portfolio construction is the art of combining assets to optimize risk/return.</p>`
        }},
      { id:'inv-04', title:{fr:'ETFs et gestion passive',en:'ETFs & Passive Management'},
        content:{
          fr:`<h2>Les ETFs : la révolution de l'investissement</h2>
<p>Les ETFs (Exchange-Traded Funds) sont des fonds indiciels cotés en bourse qui répliquent la performance d'un indice. Ils ont démocratisé l'accès aux marchés financiers.</p>
${IMG('https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=350&fit=crop&q=80','ETFs')}
${SCHEMA('Avantages des ETFs',[
  {t:'Frais ultra-bas',d:'0.03% à 0.5% par an vs 1-2% pour les fonds actifs traditionnels.'},
  {t:'Diversification instantanée',d:'Un seul ETF S&P 500 = investir dans 500 entreprises en un clic.'},
  {t:'Transparence',d:'Composition connue et mise à jour quotidiennement.'},
  {t:'Liquidité',d:'Achetable et vendable en bourse comme une action ordinaire.'},
  {t:'Fiscalité avantageuse',d:'Les ETFs capitalisant réinvestissent les dividendes sans taxation immédiate.'}
])}
${DATA('<strong>⚡ Le saviez-vous ?</strong><br/><br/>Warren Buffett a recommandé à sa famille d\'investir 90% de leur héritage dans un simple ETF S&P 500.<br/><br/>Sur 15 ans, les ETFs battent <strong>~85%</strong> des gérants professionnels.<br/>Sur 20 ans, c\'est <strong>~92%</strong> des gérants qui sous-performent.')}
<h3>Les ETFs incontournables</h3>
${SCHEMA('Top ETFs pour débuter',[
  {t:'MSCI World (CW8)',d:'1 500+ actions dans 23 pays développés. Le couteau suisse de l\'investisseur.'},
  {t:'S&P 500 (SPY/VOO)',d:'Les 500 plus grandes entreprises américaines. Le benchmark mondial.'},
  {t:'MSCI Emerging Markets',d:'Actions des pays émergents (Chine, Inde, Brésil). Diversification géographique.'},
  {t:'Euro Stoxx 50',d:'Les 50 plus grandes entreprises de la zone euro.'}
])}
${TIP('La stratégie la plus simple et efficace : investir régulièrement dans un ETF MSCI World via un DCA (Dollar Cost Averaging). C\'est ce que font 90% des investisseurs éduqués.')}
${EXER('Comparaison de frais','Comparez l\'impact des frais sur 30 ans pour 100 000€ à 8% brut :<br/><br/>a) ETF avec 0.2% de frais annuels<br/>b) Fonds actif avec 1.5% de frais annuels<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Voir la correction</summary><br/>a) ETF : 100 000 × (1.078)^30 = <strong>~916 000€</strong><br/>b) Fonds actif : 100 000 × (1.065)^30 = <strong>~661 000€</strong><br/><br/><strong>Différence : 255 000€</strong> perdus uniquement en frais ! C\'est pourquoi les ETFs sont si populaires.</details>')}`,
          en:`<h2>ETFs: the investment revolution</h2><p>ETFs are exchange-traded funds that replicate index performance.</p>`
        }},
      { id:'inv-05', title:{fr:'Gestion active vs passive',en:'Active vs Passive Management'},
        content:{
          fr:`<h2>Le grand débat : actif vs passif</h2><p>Faut-il essayer de battre le marché ou simplement le suivre ?</p>
${SCHEMA('Comparaison',[
  {t:'Gestion Passive',d:'Suit un indice via ETFs. Frais : 0.1-0.5%. Rendement : celui du marché. Temps requis : minimal.'},
  {t:'Gestion Active',d:'Stock picking. Frais : 1-2%+. Rendement : variable (souvent inférieur au marché). Temps : important.'}
])}
${DATA('<strong>📊 Statistiques SPIVA 2023</strong><br/>% de fonds actifs qui sous-performent leur indice :<br/><br/>Sur 1 an : 60%<br/>Sur 5 ans : 75%<br/>Sur 10 ans : 85%<br/>Sur 20 ans : 92%')}
${TIP('Pour 90% des investisseurs, la gestion passive via ETFs est la meilleure stratégie. Réservez la gestion active à une petite portion (10-20%) de votre portefeuille si vous en avez envie.')}`,
          en:`<h2>The great debate: active vs passive</h2><p>Should you try to beat the market or simply follow it?</p>`
        }},
      { id:'inv-06', title:{fr:'Les frais : l\'ennemi silencieux',en:'Fees: The Silent Killer'},
        content:{
          fr:`<h2>L'ennemi silencieux de vos rendements</h2><p>Les frais d'investissement semblent minimes mais leur impact cumulé sur le long terme est dévastateur.</p>
${WARN('Un écart de 1% de frais annuels peut représenter des dizaines de milliers d\'euros perdus sur 20-30 ans.')}
${SCHEMA('Types de frais à surveiller',[
  {t:'Frais de gestion (TER)',d:'Prélevés annuellement sur l\'encours. ETFs : 0.1-0.5%. Fonds actifs : 1-2.5%.'},
  {t:'Frais d\'entrée/sortie',d:'Prélevés à l\'achat ou la vente. Peuvent atteindre 3-5% pour certains fonds.'},
  {t:'Frais de courtage',d:'Commission du broker à chaque transaction. De 0€ (néo-brokers) à 10€+.'},
  {t:'Spread bid-ask',d:'Différence entre prix d\'achat et de vente. Coût caché souvent négligé.'}
])}
${DATA('<strong>🚨 Impact sur 30 ans — 100 000€ à 8% brut</strong><br/><br/>Frais 0.2% → <strong>936 000€</strong><br/>Frais 1.0% → <strong>761 000€</strong><br/>Frais 2.0% → <strong>574 000€</strong><br/><br/>Différence 0.2% vs 2% = <strong>362 000€ perdus en frais !</strong>')}`,
          en:`<h2>The silent killer of your returns</h2><p>Fees seem small but compound devastatingly over time.</p>`
        }},
      { id:'inv-07', title:{fr:'Stratégies d\'investissement',en:'Investment Strategies'},
        content:{
          fr:`<h2>Les grandes stratégies d'investissement</h2>
${SCHEMA('Stratégies principales',[
  {t:'DCA (Dollar Cost Averaging)',d:'Investir un montant fixe à intervalles réguliers. Élimine le stress du timing. La stratégie reine pour 90% des gens.'},
  {t:'Value Investing',d:'Acheter des actions sous-évaluées (PER bas, P/B bas). La philosophie de Warren Buffett et Benjamin Graham.'},
  {t:'Growth Investing',d:'Miser sur les entreprises à forte croissance (tech). Accepter de payer cher pour de la croissance future.'},
  {t:'Income Investing',d:'Construire un portefeuille de dividendes pour des revenus passifs réguliers.'},
  {t:'Momentum',d:'Acheter ce qui monte, vendre ce qui baisse. Suit la tendance du marché.'}
])}
${TIP('Le DCA est la stratégie la plus simple et prouvée. Exemple : investir 500€/mois dans un ETF MSCI World pendant 20 ans.')}
${EXER('Simulation DCA','Calculez le résultat de 300€/mois investis pendant 25 ans à 7% annuel.<br/><br/>Formule : VF = PMT × [((1+r)^n - 1) / r]<br/>Avec r = 0.07/12 et n = 25×12 = 300 mois<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Voir la correction</summary><br/>Capital investi : 300 × 300 = <strong>90 000€</strong><br/>Valeur finale : <strong>~243 000€</strong><br/>Gains : <strong>153 000€</strong> grâce aux intérêts composés !</details>')}`,
          en:`<h2>Major investment strategies</h2><p>DCA, Value, Growth, Income, Momentum...</p>`
        }},
      { id:'inv-08', title:{fr:'Comprendre l\'environnement macro',en:'Macroeconomic Environment'},
        content:{
          fr:`<h2>L'environnement macroéconomique</h2><p>Les marchés sont profondément influencés par les conditions économiques globales.</p>
${SCHEMA('Indicateurs clés à surveiller',[
  {t:'PIB (Produit Intérieur Brut)',d:'Mesure de la production économique. 2 trimestres négatifs = récession technique.'},
  {t:'Inflation (CPI)',d:'Hausse générale des prix. Cible BCE/FED : ~2%. Au-dessus = resserrement monétaire.'},
  {t:'Taux directeurs',d:'Décisions des banques centrales. Hausse des taux = frein pour les actions, boost pour les obligations.'},
  {t:'Chômage (NFP)',d:'Non-Farm Payrolls (US). Publié le 1er vendredi du mois. Indicateur majeur.'},
  {t:'PMI (Purchasing Managers Index)',d:'Au-dessus de 50 = expansion. En dessous de 50 = contraction.'}
])}
${TIP('Suivez le calendrier économique (investing.com, tradingeconomics.com) pour anticiper les mouvements de marché.')}`,
          en:`<h2>The macroeconomic environment</h2><p>Markets are deeply influenced by global economic conditions.</p>`
        }}
    ]
  },
  trading: {
    modules: [
      { id:'trd-01', title:{fr:'Introduction au trading',en:'Introduction to Trading'},
        content:{
          fr:`<h2>Le Trading : Art et Science</h2><p>Le trading consiste à acheter et vendre des actifs financiers sur des périodes courtes pour profiter des variations de prix.</p>
${IMG('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=350&fit=crop&q=80','Trading')}
${WARN('Le trading comporte des risques significatifs. Environ 70-80% des traders particuliers perdent de l\'argent. Formez-vous avant de risquer du capital réel.')}
${SCHEMA('Types de trading',[
  {t:'Scalping',d:'Trades de quelques secondes à minutes. Objectif : petits gains répétés. Nécessite une grande réactivité.'},
  {t:'Day Trading',d:'Positions ouvertes et fermées dans la journée. Pas de risque overnight. 2-10 trades/jour.'},
  {t:'Swing Trading',d:'Positions de quelques jours à semaines. Suit les mouvements de tendance. 2-5 trades/semaine.'},
  {t:'Position Trading',d:'Semaines à mois. Se rapproche de l\'investissement. Peu de stress quotidien.'}
])}
<h3>Les marchés du trading</h3>
${SCHEMA('Marchés accessibles',[
  {t:'Forex (Devises)',d:'EUR/USD, GBP/JPY... Le plus grand marché au monde. Ouvert 24h/5j. Très liquide.'},
  {t:'Actions',d:'Apple, Tesla, LVMH... Horaires de bourse fixes. Analysable fondamentalement.'},
  {t:'Cryptomonnaies',d:'Bitcoin, Ethereum... Ouvert 24h/7j. Très volatile. Idéal pour apprendre.'},
  {t:'Indices',d:'S&P 500, CAC 40, DAX... Représentent l\'économie globale d\'un pays.'},
  {t:'Matières premières',d:'Or, pétrole, gaz... Influencés par la géopolitique et l\'offre/demande.'}
])}
${EXER('Identifiez votre profil','Répondez honnêtement :<br/>1. Combien d\'heures/jour pouvez-vous consacrer au trading ?<br/>2. Êtes-vous patient ou impulsif ?<br/>3. Supportez-vous de voir -500€ sur votre écran sans paniquer ?<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Analyse</summary><br/>Si <2h/jour → <strong>Swing Trading</strong><br/>Si patient + temps → <strong>Day Trading</strong><br/>Si très réactif → <strong>Scalping</strong> (déconseillé aux débutants)<br/>Si vous paniquez facilement → <strong>Commencez en simulateur !</strong></details>')}`,
          en:`<h2>Trading: Art and Science</h2><p>Trading involves buying and selling assets over short periods.</p>`
        }},
      { id:'trd-02', title:{fr:'Chandeliers japonais',en:'Japanese Candlesticks'},
        content:{
          fr:`<h2>Lire les chandeliers japonais</h2>
<p>Les chandeliers japonais sont la méthode la plus populaire pour visualiser l'évolution des prix. Inventés au Japon au XVIIIe siècle par Munehisa Homma, un trader de riz.</p>
${IMG('https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=350&fit=crop&q=80','Chandeliers japonais')}
<h3>Anatomie d'un chandelier</h3>
<p>Chaque chandelier affiche 4 données : <strong>Ouverture, Plus Haut, Plus Bas, Clôture (OHLC)</strong>.</p>
${SCHEMA('Structure du chandelier',[
  {t:'Corps (Body)',d:'Partie épaisse. Vert/Blanc = clôture > ouverture (haussier). Rouge/Noir = clôture < ouverture (baissier).'},
  {t:'Mèche haute (Upper shadow)',d:'Trait fin au-dessus du corps. Indique le plus haut atteint pendant la période.'},
  {t:'Mèche basse (Lower shadow)',d:'Trait fin sous le corps. Indique le plus bas atteint pendant la période.'}
])}
<h3>Patterns de retournement essentiels</h3>
${SCHEMA('Patterns à connaître absolument',[
  {t:'Doji ✚',d:'Corps quasi inexistant. Indécision du marché. Signal potentiel de retournement si après une tendance forte.'},
  {t:'Marteau 🔨',d:'Petit corps en haut, longue mèche basse. Signal haussier après une baisse. Les acheteurs reprennent le contrôle.'},
  {t:'Étoile filante ⭐',d:'Petit corps en bas, longue mèche haute. Signal baissier après une hausse. Les vendeurs prennent la main.'},
  {t:'Englobante haussière',d:'Un grand chandelier vert "avale" le précédent rouge. Forte conviction acheteuse.'},
  {t:'Englobante baissière',d:'Un grand chandelier rouge "avale" le précédent vert. Forte pression vendeuse.'}
])}
${TIP('Un pattern de chandelier seul ne suffit jamais. Confirmez toujours avec le contexte (tendance, volume, niveau de support/résistance).')}
${EXER('Identification de patterns','Un actif est en baisse depuis 5 jours. Le 6ème jour, vous observez un chandelier avec un petit corps vert en haut et une très longue mèche basse (3x le corps).<br/><br/>1. Comment s\'appelle ce pattern ?<br/>2. Que signifie-t-il ?<br/>3. Devez-vous acheter immédiatement ?<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Voir la correction</summary><br/>1. C\'est un <strong>Marteau (Hammer)</strong><br/>2. Il signifie que les vendeurs ont poussé le prix très bas mais les acheteurs l\'ont ramené en haut → signal de <strong>retournement haussier potentiel</strong><br/>3. <strong>Non !</strong> Attendez une confirmation le jour suivant (chandelier vert qui clôture au-dessus du marteau). Un pattern seul n\'est pas un signal d\'entrée.</details>')}`,
          en:`<h2>Reading Japanese candlesticks</h2><p>Japanese candlesticks are the most popular way to visualize price.</p>`
        }},
      { id:'trd-03', title:{fr:'Price Action & Structures',en:'Price Action & Structures'},
        content:{
          fr:`<h2>Le Price Action</h2><p>Le price action est l'étude du mouvement des prix "nus", sans indicateurs techniques. C'est la compétence fondamentale de tout trader.</p>
<h3>Supports et Résistances</h3>
<p>Ce sont les niveaux de prix où le marché a tendance à réagir. Un support est un plancher, une résistance est un plafond.</p>
${SCHEMA('Règles des supports/résistances',[
  {t:'Plus un niveau est testé, plus il est fort',d:'Un support testé 4 fois est plus fiable qu\'un support testé 1 fois.'},
  {t:'Un support cassé devient résistance',d:'Et inversement. C\'est le principe de polarité.'},
  {t:'Les chiffres ronds sont des niveaux psychologiques',d:'Bitcoin à 100 000$, EUR/USD à 1.1000... Les traders placent des ordres sur ces niveaux.'},
  {t:'Le volume confirme la cassure',d:'Une cassure avec un fort volume est plus fiable qu\'une cassure avec un faible volume.'}
])}
<h3>Les tendances</h3>
${SCHEMA('Structure des tendances',[
  {t:'Tendance haussière (Uptrend)',d:'Séquence de Higher Highs (HH) et Higher Lows (HL). Tant que cette structure est intacte, la tendance est haussière.'},
  {t:'Tendance baissière (Downtrend)',d:'Séquence de Lower Highs (LH) et Lower Lows (LL). La tendance baissière reste valide tant que cette structure tient.'},
  {t:'Range (Consolidation)',d:'Prix oscillant entre un support et une résistance horizontaux. Le marché accumule avant un mouvement directionnel.'}
])}
${TIP('"The trend is your friend" — Tradez toujours dans le sens de la tendance dominante. Les retournements de tendance sont rares et difficiles à anticiper.')}`,
          en:`<h2>Price Action</h2><p>Price action studies raw price movement without indicators.</p>`
        }},
      { id:'trd-04', title:{fr:'Indicateurs techniques',en:'Technical Indicators'},
        content:{
          fr:`<h2>Les indicateurs techniques essentiels</h2><p>Les indicateurs techniques transforment les données de prix brutes en signaux visuels et mathématiques.</p>
${SCHEMA('Les 5 indicateurs à maîtriser',[
  {t:'Moyennes Mobiles (MA)',d:'SMA 20 : tendance court terme. SMA 50 : moyen terme. SMA 200 : long terme. Croisement SMA 50/200 = "Golden Cross" (signal d\'achat).'},
  {t:'RSI (Relative Strength Index)',d:'Oscille de 0 à 100. >70 = suracheté (vente possible). <30 = survendu (achat possible). Divergences RSI/prix = signaux puissants.'},
  {t:'MACD',d:'Mesure la convergence/divergence de 2 moyennes mobiles. Croisement signal = entrée. Histogramme = force du momentum.'},
  {t:'Bandes de Bollinger',d:'Enveloppe de volatilité autour d\'une SMA 20. Prix touchant la bande haute = possible excès. Squeeze = explosion imminente.'},
  {t:'Volume',d:'Confirme les mouvements de prix. Hausse + volume = mouvement sain. Hausse sans volume = mouvement suspect.'}
])}
${WARN('N\'utilisez jamais plus de 2-3 indicateurs en même temps. Trop d\'indicateurs créent de la confusion et des signaux contradictoires (paralysis by analysis).')}
${EXER('Lecture d\'indicateurs','Le RSI d\'une action est à 78 et le prix vient de toucher la bande supérieure de Bollinger après 5 jours de hausse consécutifs.<br/><br/>1. Le RSI indique quoi ?<br/>2. Les bandes de Bollinger confirment quoi ?<br/>3. Quelle décision prenez-vous ?<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Correction</summary><br/>1. RSI à 78 = <strong>zone de surachat</strong> (>70)<br/>2. Prix sur bande haute = <strong>excès potentiel</strong><br/>3. <strong>NE PAS acheter</strong>. Attendre un pullback ou un signal de retournement. Possible opportunité de prise de profits si vous êtes en position.</details>')}`,
          en:`<h2>Essential technical indicators</h2><p>Indicators transform raw price data into visual signals.</p>`
        }},
      { id:'trd-05', title:{fr:'Stratégies de trading',en:'Trading Strategies'},
        content:{
          fr:`<h2>Stratégies de trading professionnelles</h2><p>Une stratégie complète définit clairement : quand entrer, quand sortir, combien risquer, et quels actifs trader.</p>
${SCHEMA('Stratégies éprouvées',[
  {t:'Breakout Trading',d:'Entrer quand le prix casse un niveau clé (support/résistance) avec du volume. Stop sous le niveau cassé.'},
  {t:'Trend Following',d:'Utiliser les moyennes mobiles et le momentum pour surfer les tendances. Acheter les pullbacks dans une tendance haussière.'},
  {t:'Mean Reversion',d:'Parier sur le retour à la moyenne quand le prix s\'en éloigne excessivement (RSI extrême, Bollinger).'},
  {t:'Support/Résistance Bounce',d:'Acheter sur support avec confirmation chandelier. Vendre sur résistance avec confirmation.'}
])}
${DATA('<strong>📋 Template de plan de trading</strong><br/><br/>1. <strong>Setup</strong> : Conditions précises d\'entrée (ex: pullback sur SMA 20 + RSI >40)<br/>2. <strong>Entrée</strong> : Chandelier de confirmation (englobante haussière)<br/>3. <strong>Stop Loss</strong> : Sous le dernier swing low (-1 ATR)<br/>4. <strong>Take Profit</strong> : Ratio R:R minimum 1:2<br/>5. <strong>Taille de position</strong> : Max 1-2% du capital risqué')}`,
          en:`<h2>Professional trading strategies</h2><p>A complete strategy defines entry, exit, and risk.</p>`
        }},
      { id:'trd-06', title:{fr:'Gestion du risque (Money Management)',en:'Risk Management'},
        content:{
          fr:`<h2>La gestion du risque : clé de la survie</h2><p>La gestion du risque est ce qui sépare les traders rentables des perdants. Même avec un taux de réussite de 50%, vous pouvez être profitable avec un bon money management.</p>
${WARN('Sans money management, même la meilleure stratégie vous ruinera. C\'est la compétence #1 à maîtriser.')}
${SCHEMA('Règles d\'or du Money Management',[
  {t:'Règle du 1%',d:'Ne risquez jamais plus de 1-2% de votre capital total sur un seul trade. 10 000€ → max 100-200€ de risque par trade.'},
  {t:'Ratio Risk/Reward minimum 1:2',d:'Si vous risquez 100€, votre objectif doit être au minimum 200€. Même avec 40% de trades gagnants, vous êtes profitable.'},
  {t:'Taille de position',d:'Position = (Capital × Risque%) / Distance Stop Loss. Ex: (10 000 × 1%) / 50 pips = 2 lots.'},
  {t:'Maximum de perte journalière',d:'Arrêtez de trader après -3% dans la journée. Protégez votre capital ET votre mental.'}
])}
${DATA('<strong>📊 Simulation : Win Rate 45%, R:R 1:2</strong><br/><br/>100 trades, risque 100€ par trade :<br/>55 trades perdants : -5 500€<br/>45 trades gagnants (×2) : +9 000€<br/><br/><strong>Profit net : +3 500€</strong> avec seulement 45% de trades gagnants !')}
${EXER('Calcul de taille de position','Votre capital est de 5 000€. Vous tradez EUR/USD et votre stop loss est à 30 pips. Vous ne voulez risquer que 1% de votre capital.<br/><br/>Calculez la taille de votre position.<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Correction</summary><br/>Risque max = 5 000 × 1% = <strong>50€</strong><br/>Valeur par pip (1 lot standard) = 10€<br/>Taille = 50€ / (30 pips × 10€) = <strong>0.17 lot</strong> ≈ 0.15 mini-lot<br/><br/>C\'est la taille maximum que vous pouvez prendre pour respecter votre règle du 1%.</details>')}`,
          en:`<h2>Risk management: key to survival</h2><p>Money management separates profitable from losing traders.</p>`
        }},
      { id:'trd-07', title:{fr:'Psychologie du trading',en:'Trading Psychology'},
        content:{
          fr:`<h2>La psychologie du trader</h2><p>Le plus grand ennemi du trader, c'est lui-même. Les émotions sont responsables de 80% des pertes.</p>
${SCHEMA('Les 4 émotions destructrices',[
  {t:'FOMO (Fear Of Missing Out)',d:'Entrer en position trop tard par peur de rater le mouvement. Résultat : achat au sommet.'},
  {t:'Avidité (Greed)',d:'Ne pas prendre ses profits, vouloir toujours plus. Le marché finit toujours par reprendre ce qu\'il a donné.'},
  {t:'Peur',d:'Couper ses gains trop tôt ou ne pas entrer malgré un signal valide. Paralysie décisionnelle.'},
  {t:'Revenge Trading',d:'Après une perte, vouloir "se refaire" immédiatement en prenant des risques excessifs. Cercle vicieux.'}
])}
${TIP('Tenez un journal de trading. Notez chaque trade : setup, entrée, sortie, émotion ressentie, résultat. Relisez-le chaque semaine. C\'est l\'outil d\'amélioration le plus puissant.')}
${DATA('<strong>🧠 Les règles d\'un trader discipliné</strong><br/><br/>1. Suivre son plan de trading à la lettre<br/>2. Ne jamais déplacer un stop loss dans le mauvais sens<br/>3. Accepter les pertes comme des coûts normaux du business<br/>4. Ne pas trader quand on est fatigué, en colère ou euphorique<br/>5. Prendre des pauses régulières<br/>6. Se féliciter pour les trades bien exécutés (même perdants)')}`,
          en:`<h2>Trading Psychology</h2><p>A trader's biggest enemy is themselves.</p>`
        }}
    ]
  },
  fundamental: {
    modules: [
      { id:'fun-01', title:{fr:'Introduction à l\'analyse fondamentale',en:'Introduction to Fundamental Analysis'},
        content:{
          fr:`<h2>L'analyse fondamentale</h2><p>L'analyse fondamentale évalue la valeur intrinsèque d'un actif en étudiant les facteurs économiques, financiers et qualitatifs qui influencent son prix.</p>
${IMG('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=350&fit=crop&q=80','Analyse fondamentale')}
${SCHEMA('Analyse fondamentale vs technique',[
  {t:'Analyse Fondamentale',d:'Étudie les CAUSES : résultats financiers, économie, gouvernance. Répond à "QUOI acheter".'},
  {t:'Analyse Technique',d:'Étudie les GRAPHIQUES de prix et volumes. Répond à "QUAND acheter".'},
  {t:'Approche combinée',d:'Les meilleurs investisseurs utilisent les deux. Fondamentale pour la sélection, technique pour le timing.'}
])}
${TIP('Warren Buffett utilise l\'analyse fondamentale pour sélectionner des entreprises de qualité à prix raisonnable. Son approche a généré ~20%/an pendant 50 ans.')}`,
          en:`<h2>Fundamental Analysis</h2><p>Evaluates intrinsic value by studying economic and financial factors.</p>`
        }},
      { id:'fun-02', title:{fr:'Lecture des états financiers',en:'Reading Financial Statements'},
        content:{
          fr:`<h2>Comprendre les états financiers</h2><p>Les trois documents fondamentaux que tout investisseur doit savoir lire.</p>
${SCHEMA('Les 3 états financiers',[
  {t:'Bilan (Balance Sheet)',d:'Photo instantanée : Actifs = Passifs + Capitaux Propres. Ce que l\'entreprise possède et doit.'},
  {t:'Compte de Résultat (Income Statement)',d:'Film sur une période : Chiffre d\'affaires - Charges = Bénéfice net. La rentabilité.'},
  {t:'Tableau des Flux de Trésorerie (Cash Flow)',d:'Les mouvements de cash réels. Plus fiable que le bénéfice car non manipulable.'}
])}
<h3>Ratios financiers essentiels</h3>
${SCHEMA('Les ratios à connaître',[
  {t:'PER (Price/Earnings)',d:'Cours / Bénéfice par action. PER 15 = vous payez 15€ pour chaque 1€ de bénéfice. Moins = "pas cher".'},
  {t:'ROE (Return on Equity)',d:'Bénéfice net / Capitaux propres. Mesure la rentabilité. >15% = excellent.'},
  {t:'Dette nette / EBITDA',d:'Mesure l\'endettement. <2x = sain. >4x = inquiétant.'},
  {t:'Marge nette',d:'Bénéfice net / Chiffre d\'affaires. >20% = très rentable.'},
  {t:'FCF Yield (Free Cash Flow)',d:'FCF / Capitalisation boursière. >5% = potentiellement sous-évalué.'}
])}
${EXER('Analyse de ratios','Une entreprise a : PER = 8, ROE = 22%, Dette/EBITDA = 1.5, Marge nette = 18%<br/><br/>1. L\'action est-elle chère ou pas chère ?<br/>2. L\'entreprise est-elle rentable ?<br/>3. L\'endettement est-il raisonnable ?<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Correction</summary><br/>1. PER 8 = <strong>pas cher</strong> (moyenne du marché ~15-20)<br/>2. ROE 22% + Marge 18% = <strong>très rentable</strong><br/>3. Dette/EBITDA 1.5x = <strong>endettement sain</strong><br/><br/>→ C\'est un candidat intéressant pour une analyse approfondie !</details>')}`,
          en:`<h2>Understanding financial statements</h2><p>The three fundamental documents every investor must know.</p>`
        }},
      { id:'fun-03', title:{fr:'Politique monétaire',en:'Monetary Policy'},
        content:{
          fr:`<h2>La politique monétaire et ses impacts</h2><p>Les banques centrales (BCE, FED, BoJ, BoE) sont les acteurs les plus influents des marchés financiers.</p>
${SCHEMA('Outils des banques centrales',[
  {t:'Taux directeurs',d:'Le prix de l\'argent. Hausse des taux → crédit plus cher → économie ralentit → actions baissent. Baisse des taux → inverse.'},
  {t:'Quantitative Easing (QE)',d:'La banque centrale achète des obligations pour injecter de la liquidité. Fait monter les actifs financiers.'},
  {t:'Quantitative Tightening (QT)',d:'L\'inverse du QE. La banque centrale réduit son bilan. Retire de la liquidité des marchés.'},
  {t:'Forward Guidance',d:'Communication sur les intentions futures. Les marchés réagissent souvent plus aux mots qu\'aux actions.'}
])}
${DATA('<strong>📊 Impact historique des cycles de taux FED</strong><br/><br/>2020-2021 : Taux à 0% + QE massif → S&P 500 <strong>+100%</strong><br/>2022-2023 : Hausse agressive 0→5.5% → S&P 500 <strong>-25%</strong> puis recovery<br/>2024-2025 : Baisse graduelle → <strong>Rally</strong> des marchés')}
${TIP('"Don\'t fight the Fed" — Ne combattez jamais la banque centrale. Si la FED injecte de la liquidité, les marchés montent. Si elle resserre, soyez prudent.')}`,
          en:`<h2>Monetary policy and impacts</h2><p>Central banks are the most influential market actors.</p>`
        }},
      { id:'fun-04', title:{fr:'Indicateurs macroéconomiques',en:'Macroeconomic Indicators'},
        content:{
          fr:`<h2>Les indicateurs macro qui bougent les marchés</h2><p>Savoir interpréter ces données vous donne un avantage considérable.</p>
${SCHEMA('Calendrier des publications majeures',[
  {t:'NFP (Non-Farm Payrolls)',d:'1er vendredi du mois. Emplois créés aux US. >200K = économie forte. <100K = inquiétant. Impact : MAJEUR.'},
  {t:'CPI (Consumer Price Index)',d:'Milieu de mois. Mesure l\'inflation. Si supérieur aux attentes → taux montent → dollar monte → actions baissent.'},
  {t:'Décisions taux FED/BCE',d:'8 fois par an. Le marché réagit au ton (hawkish/dovish) plus qu\'à la décision elle-même.'},
  {t:'PIB',d:'Publication trimestrielle. 2 trimestres négatifs = récession technique. Impact : fort.'},
  {t:'PMI (ISM)',d:'>50 = expansion. <50 = contraction. Le PMI manufacturier est le plus surveillé. Publication mensuelle.'}
])}
${EXER('Analyse d\'un scénario macro','Le CPI US sort à +4.5% (attendu +4.0%). Le marché actions chute de -2% dans l\'heure.<br/><br/>Expliquez la chaîne causale.<br/><br/><details><summary style="cursor:pointer;font-weight:700;color:#59A52C">Explication</summary><br/>1. Inflation plus forte que prévu (+4.5% vs +4.0%)<br/>2. → La FED devra maintenir des taux élevés plus longtemps<br/>3. → Taux obligataires montent (obligations attirent du capital)<br/>4. → Les actions deviennent relativement moins attractives<br/>5. → Les investisseurs vendent → <strong>le marché baisse</strong><br/><br/>C\'est le mécanisme classique inflation → taux → actions.</details>')}`,
          en:`<h2>Macro indicators that move markets</h2><p>Knowing these gives you a significant edge.</p>`
        }},
      { id:'fun-05', title:{fr:'Valorisation d\'entreprise',en:'Company Valuation'},
        content:{
          fr:`<h2>Méthodes de valorisation</h2><p>Comment déterminer si une action est surévaluée ou sous-évaluée ?</p>
${SCHEMA('Méthodes principales',[
  {t:'DCF (Discounted Cash Flow)',d:'Projeter les flux de trésorerie futurs et les actualiser. La méthode la plus rigoureuse. Utilisée par les analystes professionnels.'},
  {t:'Comparaison par multiples',d:'Comparer le PER, EV/EBITDA, P/S d\'une entreprise avec ses concurrents. Rapide mais imprécis.'},
  {t:'Valeur comptable (Book Value)',d:'Actifs - Passifs. Le prix plancher théorique. P/B < 1 = potentiellement sous-évalué.'},
  {t:'Sum of the Parts',d:'Valoriser chaque division séparément puis additionner. Utile pour les conglomérats.'}
])}
${DATA('<strong>📊 Multiples moyens par secteur (2024)</strong><br/><br/>Tech (croissance) : PER ~30x | EV/EBITDA ~20x<br/>Finance (banques) : PER ~10x | P/B ~1.2x<br/>Énergie : PER ~8x | EV/EBITDA ~5x<br/>Santé : PER ~20x | EV/EBITDA ~15x<br/>Consommation : PER ~22x | EV/EBITDA ~14x')}`,
          en:`<h2>Valuation methods</h2><p>How to determine if a stock is over or undervalued.</p>`
        }},
      { id:'fun-06', title:{fr:'Géopolitique et marchés',en:'Geopolitics and Markets'},
        content:{
          fr:`<h2>L'impact géopolitique sur les marchés</h2><p>Les tensions internationales, guerres commerciales et crises diplomatiques provoquent des mouvements violents et soudains sur les marchés.</p>
${SCHEMA('Événements géopolitiques majeurs récents',[
  {t:'2022 — Guerre en Ukraine',d:'Envolée énergie (+300% gaz). Inflation record en Europe. Sanctions Russie → réorganisation des flux commerciaux mondiaux.'},
  {t:'2018-2020 — Guerre commerciale US-Chine',d:'Tarifs douaniers réciproques. Volatilité accrue sur les marchés asiatiques et tech US.'},
  {t:'2020 — Pandémie Covid-19',d:'Krach de -35% en 1 mois puis recovery record grâce aux stimulus massifs. V-shape recovery.'},
  {t:'2023-2025 — Tensions Taiwan/Semi-conducteurs',d:'Risque de conflit sur Taiwan = risque sur l\'approvisionnement mondial en puces (TSMC).'}
])}
${INFO('Les actifs refuges lors de crises géopolitiques : Or, Dollar US, Franc Suisse, obligations d\'État (Treasuries US), Yen japonais.')}
${TIP('En période de crise, ne paniquez pas. La plupart des crises géopolitiques créent des opportunités d\'achat pour les investisseurs patients. Le S&P 500 a TOUJOURS récupéré ses pertes historiquement.')}`,
          en:`<h2>Geopolitical impact on markets</h2><p>International tensions cause violent market moves.</p>`
        }}
    ]
  },
  simulator: { modules: [] }
};
