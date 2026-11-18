/* ===================== BotMotors · Story mode =====================
   Prologue: you get played buying a car. Chapters 1-5: you run BotCity Motors.
   Every trick is in the Tactic Codex. Every customer comes back a year later. */

const TACTICS=[
 {id:'urgency', name:'Fake urgency', icon:'⏰', how:'"Another buyer is coming at 3. Decide now."', hurts:'Rushed buyers skip research and pay more.', beat:'A real deal is still there tomorrow. Say "then they can have it."'},
 {id:'manager', name:'The manager trip', icon:'🚶', how:'"Let me ask my manager." A small discount comes back dressed as a miracle.', hurts:'Makes you feel you won, so you stop negotiating.', beat:'Keep negotiating the total. The manager is theater.'},
 {id:'markup_fee', name:'Market adjustment', icon:'🏷️', how:'An extra line on the sticker for "high demand".', hurts:'Pure profit, often $1,000+.', beat:'Refuse to pay it. Other dealers will sell without it.'},
 {id:'payment_pack', name:'Payment packing', icon:'📦', how:'"What monthly payment works for you?" then stretch the loan and stuff in extras.', hurts:'You agree to a payment and never see the total.', beat:'Negotiate the out-the-door price first. Payment last.'},
 {id:'long_term', name:'The 84-month loan', icon:'📅', how:'Stretch the loan to 7 years so the payment looks small.', hurts:'Way more interest, and you owe more than the car is worth for years.', beat:'Pick the shortest term you can afford. 48–60 months max.'},
 {id:'rate_markup', name:'Rate markup', icon:'📈', how:'The lender approves you at 7%. The dealer writes 10% and keeps the difference.', hurts:'3% more on a $15,000 loan is about $1,200 over 5 years.', beat:'Get pre-approved at a credit union before you shop.'},
 {id:'junk_addons', name:'Junk add-ons', icon:'🧴', how:'Paint sealant, VIN etching, nitrogen tires: pre-checked on the paperwork.', hurts:'Hundreds to thousands for things worth almost nothing.', beat:'Read every line. Say no. They are optional.'},
 {id:'yoyo', name:'Yo-yo financing', icon:'🪀', how:'"Take it home today!" A week later: "Your financing fell through, sign this worse loan."', hurts:'You already sold your old car. You feel trapped into a higher rate.', beat:'Don\'t drive off until the financing is final and signed.'},
 {id:'hide_issue', name:'Hiding a known problem', icon:'🙈', how:'The dealer knows about the bad transmission. Nobody mentions it.', hurts:'You find out after the sale, with no warranty.', beat:'Pay for an independent inspection before you buy.'},
 {id:'bait', name:'Bait and switch', icon:'🎣', how:'Advertise a $1,999 car. When you arrive: "Just sold! But look at this one…"', hurts:'You came for a cheap car and leave with an expensive one.', beat:'Call ahead. If the ad car is "gone", walk out.'},
 {id:'trade_low', name:'Trade-in lowball', icon:'🔻', how:'Offer far less than your old car is worth and hope you don\'t check.', hurts:'Thousands lost before the new deal even starts.', beat:'Look up your car\'s value and get a second offer first.'},
 {id:'rollover', name:'Negative equity rollover', icon:'🌀', how:'You owe more than your trade is worth. "No problem! We\'ll roll it into the new loan."', hurts:'You start the new loan already underwater.', beat:'Pay down the old loan or keep the old car longer.'}
];
const CUSTOMERS=[
 {id:'maya', name:'Maya', age:22, col:'#F9A8D4', job:'Nursing assistant, night shifts', takeHome:2800, savings:2500, credit:640, savvy:.3, need:'reliable', likes:['commuter','volt'], line:'I just need something that starts at 2 a.m. The bus stops at midnight.'},
 {id:'dre', name:'Dre', age:19, col:'#FDBA74', job:'Cook at Pixel Pizza', takeHome:1900, savings:1200, credit:600, savvy:.1, need:'fun', likes:['thunder'], line:'Yo, the red one. The V8. I gotta have it.'},
 {id:'priya', name:'Priya', age:28, col:'#A7F3D0', job:'Software tester', takeHome:4800, savings:12000, credit:765, savvy:.85, need:'ev', likes:['echo'], line:'I\'m pre-approved at 5.9% and I know what this car sells for.', ch:2},
 {id:'luis', name:'Luis', age:35, col:'#FDE68A', job:'Runs a landscaping crew', takeHome:3900, savings:4000, credit:615, savvy:.35, need:'cargo', likes:['workhorse','titan'], line:'My old truck died. I still owe $4,500 on it. Can you help?', trade:{value:3000, owe:4500}, ch:4},
 {id:'bea', name:'Grandma Bea', age:68, col:'#E2E8F0', job:'Retired teacher, fixed income', takeHome:2400, savings:15000, credit:790, savvy:.55, need:'reliable', likes:['volt','nova'], line:'Something safe. And please, dear, no funny business.', cash:true},
 {id:'jaylen', name:'Jaylen', age:20, col:'#93C5FD', job:'College student + delivery driver', takeHome:2200, savings:1800, credit:650, savvy:.3, need:'mpg', likes:['commuter','volt'], line:'I drive 1,500 miles a month delivering food. Gas is killing me.', miles:1500},
 {id:'tasha', name:'Tasha', age:31, col:'#C4B5FD', job:'Nurse, single mom of two', takeHome:3600, savings:3000, credit:605, savvy:.4, need:'reliable', likes:['volt','nova'], line:'Two car seats and a 6 a.m. shift. It cannot break down.', ch:2},
 {id:'kev', name:'Kev', age:24, col:'#FCA5A5', job:'Influencer (some months)', takeHome:3000, savings:500, credit:580, savvy:.05, need:'fun', likes:['titan','thunder'], line:'The truck. For the content. Followers love a truck.', ch:2},
 {id:'okafor', name:'Mr. Okafor', age:45, col:'#86EFAC', job:'Middle-school math teacher', takeHome:4200, savings:9000, credit:725, savvy:.75, need:'reliable', likes:['nova','volt'], line:'I ran the numbers on my trade-in. Let\'s be fair to each other.', trade:{value:6000, owe:0}, ch:3},
 {id:'sofia', name:'Sofia', age:18, col:'#FBCFE8', job:'First job at Bolt Cafe', takeHome:1600, savings:3000, credit:0, savvy:.2, need:'cheap', likes:['rattler','commuter'], line:'My first car ever! My mom said not to sign anything weird.'},
 {id:'ray', name:'Ray', age:52, col:'#CBD5E1', job:'Back at work after a layoff', takeHome:2600, savings:800, credit:555, savvy:.2, need:'cheap', likes:['commuter','rattler'], line:'New job starts Monday, 20 miles away. I need anything that runs.', ch:3},
 {id:'ana', name:'Ana & Ben', age:27, col:'#FDE047', job:'Newlyweds, both working', takeHome:5200, savings:8000, credit:705, savvy:.5, need:'reliable', likes:['nova','echo'], line:'Our first new car together! We saw a lease special?', ch:3}
];
const CHAPTERS=[
 {n:1, title:'Keys to the Lot', intro:'BotBank lent you $20,000 to run BotCity Motors. Rent is due every week. Buy a few cars at auction, then sell them. Your way.', goal:'Sell 2 cars', check:(w)=>w.sold>=2, cust:2},
 {n:2, title:'Busy Saturday', intro:'Word is out: the lot is open again. More customers, more pressure. Some of them really can\'t afford what they want.', goal:'Make $2,500 profit this week', check:(w)=>w.profit>=2500, cust:3},
 {n:3, title:'The Rival', intro:'Rusty opened ScrapCo Auto right across the street, and he\'s cutting prices. Your reputation is your edge… or your weakness.', goal:'Keep reputation at 3.5★ or higher', check:(w)=>S.rep>=3.5, cust:3, rival:true},
 {n:4, title:'Trade-Ins', intro:'Customers are bringing old cars. Some still owe money on them. This is where buyers lose the most without noticing.', goal:'Sell 3 cars', check:(w)=>w.sold>=3, cust:3, trades:true},
 {n:5, title:'The Audit', intro:'A letter from the Bot City Consumer Protection Office: "We\'ve received complaints." One final week. Then they open your files.', goal:'Pay back BotBank\'s $20,000 and pass the audit', check:()=>S.cash>=20000&&S.heat<8, cust:3, audit:true}
];
const UPGRADES=[
 {id:'bay', name:'Service bay', icon:'🔧', cost:3000, what:'Mike inspects every auction car for free. You always know about hidden problems.'},
 {id:'lot', name:'Bigger lot', icon:'🅿️', cost:4000, what:'+2 parking spots for inventory.'},
 {id:'board', name:'Billboard', icon:'📣', cost:2500, what:'+1 customer every chapter.'},
 {id:'cu', name:'Credit union partner', icon:'🏦', cost:2000, what:'Send buyers to BotBank\'s low rates and earn a $300 referral per loan. Honest money.'},
 {id:'detail', name:'Detail shop', icon:'✨', cost:1500, what:'Every car looks its best: customers like your cars more.'}
];
const RANKS=[[0,'Lot Rookie'],[500,'Deal Maker'],[1200,'Lot Boss'],[2200,'Auto Mogul'],[3500,'Bot City Legend']];
const DEAL_ADDONS=[{id:'warranty',name:'Extended warranty',price:1995,cost:650,junk:false},{id:'gap',name:'GAP insurance',price:895,cost:150,junk:false},{id:'paint',name:'Paint protection',price:599,cost:40,junk:true},{id:'etch',name:'VIN etching',price:299,cost:20,junk:true},{id:'nitro',name:'Nitrogen tires',price:199,cost:10,junk:true}];

let S=null;
const newStory=()=>({ch:0, cash:20000, rep:3, stars:[], heat:0, xp:0, up:{}, inv:[], codex:{}, sold:[], complaints:[], week:null, done:false, ending:null});
function saveS(){ if(S) store.set('story',S); }
function rank(){ let r=RANKS[0][1]; RANKS.forEach(([x,n])=>{ if(S.xp>=x) r=n; }); return r; }
function addXP(n){ const before=rank(); S.xp+=n; if(rank()!==before){ toast('⬆️ Rank up: <b>'+rank()+'</b>','good'); sfx.good(); } }
function codex(id,how){ if(!S) return; const c=S.codex[id]||(S.codex[id]={}); if(c[how]) return; const first=!c.spot&&!c.use; c[how]=1; saveS();
  const t=TACTICS.find(x=>x.id===id); if(first&&t&&how!=='see'){ toast(`📕 Tactic ${how==='use'?'used':'spotted'}: <b>${t.icon} ${t.name}</b>`, how==='use'?'bad':'good'); if(S.ch>0) addXP(25); } }
function spots(){ return 4+(S.up.lot?2:0); }
function say(who,face,text,ms){ const e=$('#slickSays'); e.querySelector('b').textContent=who; e.querySelector('.face').textContent=face; slick(text,ms); }

/* ---------- title buttons ---------- */
function storyTitle(){ const saved=store.get('story',null), b=$('#btnStory'); if(!b) return;
  b.innerHTML=saved&&saved.ch>0&&!saved.done?`Continue story · Chapter ${saved.ch}`:'Story mode';
  b.onclick=()=>{ audio(); musicStart(); $('#title').hidden=true; S=saved&&!saved.done?saved:newStory(); if(S.ch>0){ applyProfile(PROFILES[0]); enterDealer(); hub(); } else startPrologue(); };
  $('#btnStart').textContent='Free play'; }
function startPrologue(){ G.storyMode='prologue'; PICK=PROFILES[0]; applyProfile(PICK); G.you.root.position.set(0,0,10); hud(); startLot(false);
  modal(`<div class="eyebrow">Prologue</div><h2>The Deal</h2><p>You're <b>Jordan</b>, 18, and you just landed a full-time job at Byte Burger. You need a car to get there.</p><p>Bot City Motors has the cheapest lot in town, and its top salesbot, <b>Slick</b>, has never lost a deal.</p><div class="lesson">Watch for Slick's tricks. Every one you spot goes in your <b>📕 Tactic Codex</b>. You'll need them later.</div><div class="mact"><button class="btn pri" id="proGo">Walk onto the lot</button></div>`);
  $('#proGo').onclick=()=>{ closeModal(); advise('Find a car that fits your budget: <b>'+fmt(YOU.takeHome*GOOD_PCT)+'/month</b>, all in. Walk up to any car.',9000); setTimeout(()=>slick(pick(SLICK.hello)),2500); }; }
function prologueEnd(){ clearConfetti(); G.storyMode=null; S.ch=1; saveS();
  modal(`<div class="eyebrow">Three months later</div><h2>Slick is gone.</h2><p>He skipped town with a stack of customer deposits. BotBank now owns Bot City Motors, and nobody wants to run a lot with that reputation.</p><p>Then the bank calls <b>you</b>. "You know every trick Slick pulled, because he pulled them on you. Want to run the place? We'll lend you <b>$20,000</b> to start."</p>
   <div class="lesson">From here on, you're the dealer. Every customer is a real person with a real budget. You can help them, or squeeze them. Both make money. Only one lets you sleep.</div><div class="mact"><button class="btn gold big" id="proOwn">Take the keys</button></div>`);
  $('#proOwn').onclick=()=>{ sfx.good(); enterDealer(); hub(); }; }

/* ---------- dealer mode: the world changes hands ---------- */
function enterDealer(){ G.dealer=true; G.storyMode='dealer'; closeCard(); G.slick.root.visible=false; G.you.root.position.set(4,0,-12);
  const em=$$('#hud .stat em'); em[0].textContent='Business cash'; em[1].textContent='Reputation'; em[2].textContent='Complaints'; em[3].textContent='Rank'; $('#title').hidden=true; $('#hud').hidden=false; syncLot(); dhud(); }
function dhud(){ if(!G.dealer) return; G.cash=S.cash; $('#hPay').textContent='★ '+S.rep.toFixed(1); $('#hCredit').textContent=S.heat?('🔥 '+S.heat):'None'; $('#hBudget').textContent=rank(); }
const _hud2=hud; hud=function(){ _hud2(); dhud(); };
function syncLot(){ for(const [id,g] of W.lotCars){ const it=S&&G.dealer?S.inv.find(x=>x.id===id):true; g.visible=!!it; if(g.userData.tag){ g.userData.tag.visible=!!it; if(G.dealer&&it) setTag(id,it.ask); } } }
function setTag(id,price){ const g=W.lotCars.get(id), c=carById(id), m=g.userData.tag.material; m.map&&m.map.dispose(); m.map=textTex([{t:c.year+' '+c.name,size:40,color:'#0B1220'},{t:fmt(price),size:64,color:'#047857'}],{bg:'#FFFFFF',r:18,w:512,h:216}); m.needsUpdate=true; }

/* ---------- the hub between chapters ---------- */
function hub(){ G.mode='lot'; const C=CHAPTERS[S.ch-1]; dhud();
  const owned=Object.values(S.codex).filter(c=>c.spot||c.use).length;
  const m=modal(`<div class="eyebrow">Chapter ${C.n} of 5</div><h2>${C.title}</h2><p>${C.intro}</p>
   <div class="specs" style="grid-template-columns:repeat(4,1fr)"><div><em>Cash</em><b>${fmt(S.cash)}</b></div><div><em>Owe BotBank</em><b>${fmt(20000)}</b></div><div><em>Reputation</em><b>★ ${S.rep.toFixed(1)}</b></div><div><em>Rank</em><b>${rank()}</b></div></div>
   <div class="goalbox">🎯 <b>Goal:</b> ${C.goal}</div>
   <div class="mact"><button class="btn" id="hCodex">📕 Tactic Codex (${owned}/12)</button><button class="btn" id="hUp">🛠️ Upgrades</button><button class="btn pri" id="hGo">Start the week</button></div>`, true);
  m.querySelector('#hCodex').onclick=()=>codexView(hub); m.querySelector('#hUp').onclick=upgrades; m.querySelector('#hGo').onclick=adChoice; }
function upgrades(){ const m=modal(`<div class="eyebrow">Grow the business</div><h2>Upgrades</h2><p>Cash: <b>${fmt(S.cash)}</b>. Remember you owe BotBank $20,000 at the end of Chapter 5.</p>
  <div class="ups">${UPGRADES.map(u=>`<div class="up ${S.up[u.id]?'own':''}"><div class="ic">${u.icon}</div><div><b>${u.name}</b><small>${u.what}</small></div><button class="btn sm ${S.up[u.id]?'':'pri'}" data-u="${u.id}" ${S.up[u.id]||S.cash<u.cost?'disabled':''}>${S.up[u.id]?'Owned':fmt(u.cost)}</button></div>`).join('')}</div>
  <div class="lesson">Upgrades are investments: money now for more money (or trust) later. Will they pay for themselves before the bank wants its $20,000?</div><div class="mact"><button class="btn pri" id="upBack">Back</button></div>`, true);
  m.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{ const u=UPGRADES.find(x=>x.id===b.dataset.u); S.cash-=u.cost; S.up[u.id]=1; addXP(60); saveS(); dhud(); sfx.cash(); upgrades(); }); m.querySelector('#upBack').onclick=hub; }
function codexView(back){ const m=modal(`<div class="eyebrow">📕 Tactic Codex</div><h2>Know every trick</h2><p>Spot a trick as a buyer, or use one as a dealer, to unlock its card. A ✓ means you also saw what it does to people.</p>
  <div class="codex">${TACTICS.map(t=>{ const c=(S&&S.codex[t.id])||{}; const on=c.spot||c.use; return `<div class="cx ${on?'on':''}"><div class="ic">${on?t.icon:'❔'}</div><b>${on?t.name:'Locked'}</b>${on?`<small><i>${t.how}</i></small><small>💸 ${t.hurts}</small><small>🛡️ ${t.beat}</small><div class="tags">${c.spot?'<span>Spotted</span>':''}${c.use?'<span class="u">Used</span>':''}${c.see?'<span class="s">✓ Saw the damage</span>':''}</div>`:'<small>Not found yet.</small>'}</div>`; }).join('')}</div>
  <div class="mact"><button class="btn pri" id="cxBack">Back</button></div>`, true); m.querySelector('#cxBack').onclick=back||closeModal; }
$('#btnNotes').addEventListener('click',e=>{ if(!S) return; e.stopImmediatePropagation(); codexView(()=>closeModal()); },true);

/* ---------- this week's ad: honest or bait ---------- */
function adChoice(){ const m=modal(`<div class="eyebrow">Monday morning</div><h2>What goes in this week's ad?</h2>
  <div class="pay"><label><input type="radio" name="ad" value="honest" checked> <div><b>Honest ad</b> · "Fair prices. Real numbers."<br><small>Normal foot traffic.</small></div></label>
  <label><input type="radio" name="ad" value="bait"> <div><b>"$1,999 CARS!"</b> · there are no $1,999 cars<br><small>+1 customer. When they ask, it "just sold".</small></div></label></div>
  <div class="mact"><button class="btn pri" id="adGo">Run the ad</button></div>`);
  m.querySelector('#adGo').onclick=()=>{ const bait=m.querySelector('[name=ad]:checked').value==='bait'; if(bait){ codex('bait','use'); S.heat+=1; } auction(bait); }; }

/* ---------- wholesale auction ---------- */
function auction(bait,mid){ const owned=new Set(S.inv.map(x=>x.id)), pool=CARS.filter(c=>!owned.has(c.id)).sort(()=>Math.random()-.5).slice(0,5);
  const lots=pool.map(c=>({id:c.id, cost:Math.round(c.floor*rand(.78,.9)/50)*50, issue:!!(c.issue&&Math.random()<c.issue.p), checked:!!S.up.bay}));
  const render=()=>{ const room=spots()-S.inv.length;
    const m=modal(`<div class="eyebrow">Bot City wholesale auction</div><h2>Stock your lot</h2><p>Room for <b>${room}</b> more car${room===1?'':'s'}. Cash: <b>${fmt(S.cash)}</b>. Each unsold car costs <b>$150/week</b> to keep (floor-plan interest).</p>
     <div class="aucs">${lots.map((l,i)=>{ const c=carById(l.id); return `<div class="auc ${l.bought?'own':''}"><div><b>${c.year} ${c.name}</b><small>${c.miles.toLocaleString()} mi · retail sticker ${fmt(c.price)} · fair ${fmt(Math.round(c.floor*1.03/100)*100)}</small>
       <small>${l.checked?(l.issue?'🔧 <span style="color:var(--red)">'+c.issue.what+' ('+fmt(c.issue.cost)+')</span>':'🔧 Clean inspection'):'🔧 Not inspected'}</small></div>
       <div class="ab"><b>${fmt(l.cost)}</b>${l.bought?'<span>Bought</span>':`${!l.checked&&c.used?`<button class="btn sm" data-ins="${i}">Inspect $120</button>`:''}<button class="btn sm pri" data-buy="${i}" ${room<1||S.cash<l.cost?'disabled':''}>Buy</button>`}</div></div>`; }).join('')}</div>
     <div class="lesson">Wholesale price vs. retail price is where a dealer's profit starts. Knowing a car's problems before you buy it is the dealer's version of an inspection.</div>
     <div class="mact">${mid?'<button class="btn" id="aucSkip">Back to the lot</button>':''}<button class="btn pri" id="aucDone" ${S.inv.length?'':'disabled'}>${mid?'Back with':'Open the lot'} (${S.inv.length} car${S.inv.length===1?'':'s'})</button></div>`, true);
    m.querySelectorAll('[data-ins]').forEach(b=>b.onclick=()=>{ const l=lots[+b.dataset.ins]; S.cash-=INSPECT_FEE; l.checked=true; sfx.tick(); dhud(); render(); });
    m.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{ const l=lots[+b.dataset.buy]; S.cash-=l.cost; l.bought=true; S.inv.push({id:l.id, cost:l.cost, issue:l.issue, known:l.checked&&l.issue, ask:carById(l.id).price}); sfx.cash(); dhud(); render(); });
    if(mid) m.querySelector('#aucSkip').onclick=closeModal;
    m.querySelector('#aucDone').onclick=()=>{ closeModal(); if(mid){ syncLot(); rollIn(); } else openWeek(bait); }; };
  render(); }

/* ---------- the week: customers walk onto the lot ---------- */
function openWeek(bait){ const C=CHAPTERS[S.ch-1]; saveS(); G.mode='lot'; syncLot(); rollIn();
  S.met=S.met||[]; const seen=new Set(S.sold.map(s=>s.cust).concat(S.met)), pool=CUSTOMERS.filter(c=>(c.ch||1)<=S.ch && !seen.has(c.id)), want=C.cust+(S.up.board?1:0)+(bait?1:0)+(S.rep>=4.2?1:0)-(S.rep<2.5?1:0);
  let list=pool.filter(c=>C.trades?c.trade:true).slice(0,2).concat(pool.filter(c=>!(C.trades&&c.trade))).filter((c,i,a)=>a.indexOf(c)===i);
  list=list.sort(()=>Math.random()-.5); if(C.trades) list.sort((a,b)=>(b.trade?1:0)-(a.trade?1:0)); list=list.slice(0,Math.max(1,want));
  if(list.length<want) list=list.concat(CUSTOMERS.filter(c=>!list.includes(c)).sort(()=>Math.random()-.5).slice(0,want-list.length));
  list.forEach(c=>{ if(!S.met.includes(c.id)) S.met.push(c.id); }); S.week={profit:0, sold:0, queue:list.map(c=>c.id), bait, served:0, total:list.length}; W.cust=[];
  advise(`Week ${S.ch}: <b>${list.length} customers</b> are coming. Walk up to each one and press <b>E</b> to talk. Your cars and asking prices are on the lot.`,9000);
  if(C.rival) setTimeout(()=>say('Rusty','🦝','Heh. Customers are coming to MY lot this week. Prices so low it hurts. Mostly them.',6000),2500);
  setTimeout(nextCustomer,1500); }
function rollIn(){ S.inv.forEach((it,i)=>{ const g=W.lotCars.get(it.id), [x,z,r]=LOT_SPOTS[it.id]; if(g.userData.rolled) return; g.userData.rolled=1; tween(g,{x:0,z:ROAD.z1-2},{x,z},1.8+i*.4,()=>{ g.rotation.y=r; }); }); }
const TW=[]; function tween(g,a,b,dur,done){ g.position.set(a.x,0,a.z); TW.push({g,a,b,t:0,dur,done}); }
function tweenTick(dt){ for(let i=TW.length-1;i>=0;i--){ const w=TW[i]; w.t+=dt; const k=Math.min(1,w.t/w.dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; w.g.position.x=w.a.x+(w.b.x-w.a.x)*e; w.g.position.z=w.a.z+(w.b.z-w.a.z)*e; const dx=w.b.x-w.a.x, dz=w.b.z-w.a.z; if(k<1) w.g.rotation.y=Math.atan2(dx,dz); if(k>=1){ TW.splice(i,1); w.done&&w.done(); } } }
function nextCustomer(){ const Wk=S.week; if(!Wk) return; if(!Wk.queue.length){ if(!W.cust.length) setTimeout(endWeek,1200); return; } if(W.cust.length>=2) return;
  const qid=Wk.queue.shift(), cu=CUSTOMERS.find(c=>c.id===qid); const rig=makeRig(GLTF.crowd, mat(cu.col,{roughness:.3}), .9,'g'); rig.root.add(blob(1.1)); rig.root.position.set(0,0,ROAD.z1-3); scene.add(rig.root);
  const tag=sign(scene,[{t:cu.name,size:58,color:'#0B1220'}],1.5,.42,0,0,0,{bg:'#FDE68A',r:22,w:384,h:108}); const like=S.inv.find(x=>cu.likes.includes(x.id))||S.inv[0]; const g=like?W.lotCars.get(like.id):null;
  const o={cu, rig, tag, tx:g?g.position.x+1.8:0, tz:g?g.position.z+(g.position.z<0?3:-3):0, mood:'😐'}; W.cust.push(o); tone(880,.08,'sine',.03); setTimeout(()=>tone(1175,.12,'sine',.03),90);
  toast(`🚶 <b>${cu.name}</b> just walked onto the lot.`); setTimeout(nextCustomer, 9000); }
function custTick(dt){ if(!W.cust) return; W.cust.forEach(o=>{ const r=o.rig.root, dx=o.tx-r.position.x, dz=o.tz-r.position.z, d=Math.hypot(dx,dz); if(o.leaving&&d<.4){ o.gone=true; return; }
  if(d>.25){ const sp=o.leaving?3:2.4; r.position.x+=dx/d*sp*dt; r.position.z+=dz/d*sp*dt; r.rotation.y=Math.atan2(dx,dz); r.position.y=Math.abs(Math.sin(G.t*9))*.05; } else { r.position.y=0; r.rotation.y=Math.atan2(G.you.root.position.x-r.position.x,G.you.root.position.z-r.position.z); }
  if(!o.leaving&&!o.done&&!(G.desk&&G.desk.o===o)&&G.mode==='lot'&&!G.modal){ o.t=(o.t||0)+dt; if(o.t>80){ o.done=true; custLeave(o); toast(o.cu.name+' got tired of waiting and left.','bad'); } }
  o.rig.mixer.update(dt); o.tag.position.set(r.position.x,r.position.y+1.55,r.position.z); o.tag.lookAt(camera.position.x,o.tag.position.y,camera.position.z); });
  for(let i=W.cust.length-1;i>=0;i--){ const o=W.cust[i]; if(o.gone){ scene.remove(o.rig.root); scene.remove(o.tag); W.cust.splice(i,1); S.week.served++; nextCustomer(); } } }
function nearHook(r,best){ if(!G.dealer||!W.cust) return best; let bd=3.2, b=best; W.cust.forEach((o,i)=>{ if(o.leaving||o.done) return; const d=Math.hypot(o.rig.root.position.x-r.position.x,o.rig.root.position.z-r.position.z); if(d<bd){ bd=d; b='@c'+o.cu.id; } }); return b; }
function nearLabel(best){ if(best.startsWith('@c')){ const o=W.cust.find(x=>'@c'+x.cu.id===best); return 'Talk to '+(o?o.cu.name:'customer'); } return null; }
function custLeave(o){ o.leaving=true; o.tx=0; o.tz=ROAD.z1-1; }

function dealerCard(id){ if(id==='@cu'){ return modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">BotBank</div><h2>Your business loan</h2><p>You owe <b>${fmt(20000)}</b>, due after Chapter 5. Cash right now: <b>${fmt(S.cash)}</b>.</p><div class="lesson">${S.up.cu?'You\'re a credit-union partner: honest low-rate loans earn you $300 each.':'Buy the Credit union partner upgrade to earn $300 for every honest low-rate loan you send us.'}</div>`); }
  if(id==='@mech') return modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">Mike's Garage</div><h2>"Now you're the one selling."</h2><p>${S.up.bay?'Your service bay checks every auction car. You always know what\'s wrong with your inventory.':'Inspect cars at the auction before you buy, or buy the Service bay upgrade.'}</p><div class="lesson">Knowing a car's problem gives you a choice: tell the buyer, or don't. That choice is the whole game.</div>`);
  if(id==='@bus') return modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">Route 7</div><h2>The honest answer is sometimes "no car".</h2><p>If a customer can't afford any car on your lot, the kindest deal is no deal.</p>`);
  const it=S.inv.find(x=>x.id===id), c=carById(id); if(!it) return; const card=$('#card'); card.hidden=false; G.cardId=id;
  card.innerHTML=`<button class="x" onclick="closeCard()">×</button><div class="eyebrow">Your inventory · ${c.year}</div><h2>${c.name}</h2><div class="sub">${c.blurb}</div>
   <div class="specs"><div><em>You paid</em><b>${fmt(it.cost)}</b></div><div><em>Fair retail</em><b>${fmt(Math.round(c.floor*1.03/100)*100)}</b></div><div><em>Sticker</em><b>${fmt(c.price)}</b></div><div><em>Reliability</em><b>${stars(c.rel)}</b></div></div>
   ${it.known?`<div class="note bad">🔧 <b>You know:</b> ${c.issue.what} (${fmt(c.issue.cost)} to fix). Customers don't… unless you tell them.</div>`:c.used?'<div class="note">🔧 Not inspected. Could be hiding something.</div>':''}
   <div style="font-size:13px;color:var(--txt3);margin-top:8px">Asking price on the tag</div><div class="offer" id="askV">${fmt(it.ask)}</div><input type="range" id="askR" min="${Math.round(it.cost/100)*100}" max="${Math.round(c.price*1.1/100)*100}" step="100" value="${it.ask}">
   <div class="lesson">The tag is your opening number. Higher tags leave room to "discount". Savvy customers know the fair price anyway.</div>`;
  const R=card.querySelector('#askR'); R.oninput=()=>{ it.ask=+R.value; card.querySelector('#askV').textContent=fmt(it.ask); }; R.onchange=()=>{ setTag(id,it.ask); saveS(); }; }
/* ---------- talking to a customer ---------- */
function budgetOf(cu){ return Math.round(cu.takeHome*GOOD_PCT); }
function custCard(id){ const o=W.cust.find(x=>x.cu.id===id); if(!o) return; const cu=o.cu; G.walkTo=null; $('#prompt').hidden=true; rigPlay(o.rig,'RightHand',true);
  const m=modal(`<button class="x" id="ccX">×</button><div class="eyebrow">Customer</div><div class="cust"><i style="background:${cu.col}"></i><div><h2 style="margin:0">${cu.name}, ${cu.age}</h2><small>${cu.job}</small></div></div>
   <p class="quote">"${S.week.bait&&!o.baited?'I saw the ad! The $1,999 car? '+cu.line:cu.line}"</p>
   <div class="specs" style="grid-template-columns:repeat(4,1fr)"><div><em>Take-home</em><b>${fmt(cu.takeHome)}/mo</b></div><div><em>Savings</em><b>${fmt(cu.savings)}</b></div><div><em>Credit</em><b>${cu.credit||'No history'}</b></div><div><em>Safe car budget</em><b>${fmt(budgetOf(cu))}/mo</b></div></div>
   ${cu.trade?`<div class="note">🚙 Trade-in: worth about <b>${fmt(cu.trade.value)}</b>${cu.trade.owe?`, still owes <b>${fmt(cu.trade.owe)}</b>`:', paid off'}.</div>`:''}
   ${S.week.bait&&!o.baited?`<div class="note bad">🎣 They came for the $1,999 car from your ad. It doesn't exist. You'll have to "explain".</div>`:''}
   <div class="eyebrow" style="margin-top:12px">Show them a car</div><div class="pick">${S.inv.map(it=>{ const c=carById(it.id), fit=fitOf(cu,c); return `<button class="btn" data-car="${it.id}"><span><b>${c.name}</b> · ${fmt(it.ask)}</span><small class="${fit.cls}">${fit.t}</small></button>`; }).join('')||'<p>Your lot is empty!</p>'}</div>${S.inv.length<spots()?`<button class="btn sm" id="ccRestock" style="margin-top:8px">🚚 Restock at the auction (${spots()-S.inv.length} open spot${spots()-S.inv.length===1?'':'s'})</button>`:''}
   <div class="mact"><button class="btn danger" id="ccBye">"Sorry, nothing for you today."</button></div>`, true);
  m.querySelector('#ccX').onclick=closeModal; const rs=m.querySelector('#ccRestock'); if(rs) rs.onclick=()=>auction(false,true); m.querySelector('#ccBye').onclick=()=>{ closeModal(); o.done=true; custLeave(o); if(fitAll(cu)) note(cu.name+' left without a car.'); };
  m.querySelectorAll('[data-car]').forEach(b=>b.onclick=()=>{ if(S.week.bait&&!o.baited){ o.baited=true; codex('bait','use'); } deskOpen(o, b.dataset.car); }); }
function fitOf(cu,c){ const n=cu.need; if(n==='cargo'&&!c.cargo) return {t:'No room for gear',cls:'no'}; if(n==='ev'&&c.fuel!=='electric') return {t:'Wants electric',cls:'no'}; if(n==='mpg'&&c.mpg&&c.mpg<30&&c.fuel!=='electric') return {t:'Thirsty on gas',cls:'meh'}; if(n==='reliable'&&c.rel<3) return {t:'Unreliable',cls:'no'};
  if(cu.likes.includes(c.id)) return {t:'❤️ They love it',cls:'ok'}; return {t:'Could work',cls:'meh'}; }
function fitAll(cu){ return S.inv.some(it=>fitOf(cu,carById(it.id)).cls!=='no'); }

/* ---------- the deal desk ---------- */
function buyRate(cr){ return cr>=750?.059:cr>=700?.072:cr>=650?.089:cr>=600?.119:cr>0?.169:.139; }
function deskOpen(o,carId){ const it=S.inv.find(x=>x.id===carId), c=carById(carId), cu=o.cu;
  const D=G.desk={o, cu, it, c, price:it.ask, markup:0, term:60, add:{}, tac:{}, honest:{}, trade:cu.trade?cu.trade.value:0};
  [G.you.root.position.set(4.6,0,-23.6)]; G.you.root.rotation.y=0; o.rig.root.position.set(3.2,0,-19.6); o.tx=3.2; o.tz=-19.6; G.mode='office'; renderDesk(); }
function dealMath(D){ const {cu,c,it}=D, adds=DEAL_ADDONS.filter(a=>D.add[a.id]), addP=adds.reduce((s,a)=>s+a.price,0), addC=adds.reduce((s,a)=>s+a.cost,0);
  const owe=cu.trade?cu.trade.owe:0, equity=cu.trade?D.trade-owe:0, roll=equity<0;
  const tax=(D.price+addP)*TAX, fees=DOC_FEE+TITLE_FEE, down=cu.cash?0:Math.round(Math.min(cu.savings*.45,4000)/100)*100;
  const total=D.price+addP+tax+fees-(equity>0?equity:0)+(roll?-equity:0);
  const cash=!!cu.cash; const buy=buyRate(cu.credit), apr=D.honest.cu?Math.max(.049,buy-.012):buy+D.markup, n=D.term, loan=cash?0:Math.max(0,total-down), pay=cash?0:pmt(loan,apr,n);
  const miles=cu.miles||800, ins=Math.round(c.ins0*(cu.age<25?1.15:cu.age>60?.85:1))+(c.ins0<150&&!cash?70:0), run=(c.fuel==='electric'?miles*KWH_MILE:miles/c.mpg*(c.fuel==='premium'?PREMIUM:GAS))+c.maint+(cu.need==='cargo'&&!c.cargo?45:0);
  const all=pay+ins+run, interest=pay*n-loan;
  const reserve=D.honest.cu?(S.up.cu?300:0):loan*D.markup*n/12*.45, tradeGain=cu.trade?cu.trade.value-D.trade:0;
  const profit=D.price-it.cost+(addP-addC)+DOC_FEE+reserve+tradeGain+(D.tac.yoyo?900:0);
  /* how the customer feels about it */
  const fair=c.floor*1.03, sv=cu.savvy, want=cu.takeHome*(sv>.6?.16:.13+(1-sv)*.12), felt=(D.honest.total||sv>.6)?all:pay+(cash?0:0), shown=cash?(D.price+addP+tax+fees)/36:felt;
  let sc=.55; const why=[];
  const over=Math.max(0,(shown-want)/want); if(over>0){ sc-=over*2.2; why.push(over>.2?'Way over what they can pay':'A bit over their budget'); }
  const pOver=Math.max(0,(D.price-fair)/fair); sc-=pOver*(1+sv*7); if(pOver>.06) why.push(sv>.5?'Knows the price is high':'Price feels high');
  if(D.markup>0&&!cash){ sc-=sv*D.markup*30; if(sv>.5) why.push('Spotted the rate markup'); }
  const junk=adds.filter(a=>a.junk).length; sc-=junk*sv*.18; if(junk&&sv>.5) why.push('Doesn\'t want junk add-ons');
  const fit=fitOf(cu,c); if(fit.cls==='no'){ sc-=.6; why.push(fit.t); } if(fit.cls==='ok') sc+=.25;
  if(D.tac.urgency){ sc+=sv<.5?.2:-.35; if(sv>=.5) why.push('Annoyed by the pressure'); }
  if(D.tac.packing){ sc+=(1-sv)*.25; }
  if(D.honest.total) sc+=.08+sv*.1; if(D.honest.cu) sc+=.15; if(D.honest.disclose) sc+=.12;
  if(D.o.baited) sc-=.12; if(S.up.detail) sc+=.06; if(CHAPTERS[S.ch-1].rival) sc-=.05;
  if(cu.trade&&D.trade<cu.trade.value*.85){ sc-=sv*.6; if(sv>.5) why.push('Knows the trade is worth more'); }
  if(!cash&&pay>cu.takeHome*.3&&!D.tac.yoyo){ sc=Math.min(sc,-.01); why.unshift('Lender says no: payment too high'); }
  return {adds, addP, tax, fees, down, total, apr, n, loan, pay, ins, run, all, interest, profit, sc, why, equity, roll, stress:all/cu.takeHome, cash}; }
function renderDesk(){ const D=G.desk, {cu,c,it}=D, r=dealMath(D), safe=budgetOf(cu), mood=r.sc>.35?'😄':r.sc>=0?'🙂':r.sc>-.3?'😕':'😠';
  const m=modal(`<button class="x" id="dkX">×</button><div class="eyebrow">Your desk · ${cu.name} · ${c.year} ${c.name}</div>
   <div class="neg"><div>
     <div class="bigrow"><span>Your cost (auction)</span><b>${fmt(it.cost)}</b></div>
     <div style="margin:10px 0 2px;font-size:13px;color:var(--txt3)">Sale price <small>(fair ≈ ${fmt(Math.round(c.floor*1.03/100)*100)})</small></div><div class="offer" id="dkP">${fmt(D.price)}</div>
     <input type="range" id="dkPR" min="${Math.round(it.cost/100)*100}" max="${Math.round(c.price*1.08/100)*100}" step="100" value="${D.price}">
     ${r.cash?'<div class="note">💵 Paying cash. No loan.</div>':`<div style="margin:8px 0 2px;font-size:13px;color:var(--txt3)">Interest rate: lender's buy rate ${(buyRate(cu.credit)*100).toFixed(1)}% ${D.honest.cu?'· <b>credit union rate</b>':'+ your markup <b id="dkMv">'+(D.markup*100).toFixed(1)+'%</b>'}</div>
     ${D.honest.cu?'':`<input type="range" id="dkMR" min="0" max="3" step=".5" value="${D.markup*100}">`}
     <div class="terms" style="margin-top:6px">${[36,48,60,72,84].map(t=>`<button data-t="${t}" class="${D.term===t?'on':''}">${t} mo</button>`).join('')}</div>`}
     ${cu.trade?`<div style="margin:10px 0 2px;font-size:13px;color:var(--txt3)">Trade-in offer (worth ${fmt(cu.trade.value)}${cu.trade.owe?', they owe '+fmt(cu.trade.owe):''})</div><input type="range" id="dkTR" min="${Math.round(cu.trade.value*.5/100)*100}" max="${cu.trade.value}" step="100" value="${D.trade}"><div><b id="dkTv">${fmt(D.trade)}</b></div>`:''}
     <div class="eyebrow" style="margin-top:12px">Add-ons on the paperwork</div><div class="adds">${DEAL_ADDONS.map(a=>`<label><input type="checkbox" data-ad="${a.id}" ${D.add[a.id]?'checked':''}> ${a.name} <small>${fmt(a.price)} · costs you ${fmt(a.cost)}</small></label>`).join('')}</div>
     <div class="eyebrow" style="margin-top:12px">Moves</div>
     <div class="moves">
      <button class="mv shady ${D.tac.urgency?'on':''}" data-tc="urgency">⏰ "Another buyer is coming at 3"</button>
      ${r.cash?'':`<button class="mv shady ${D.tac.packing?'on':''}" data-tc="packing">📦 "What monthly payment works?"</button>`}
      ${!r.cash&&cu.credit<660?`<button class="mv shady ${D.tac.yoyo?'on':''}" data-tc="yoyo">🪀 Spot delivery: "Take it home today!"</button>`:''}
      <button class="mv good ${D.honest.total?'on':''}" data-hn="total">📋 Show the total cost, all in</button>
      ${r.cash?'':`<button class="mv good ${D.honest.cu?'on':''}" data-hn="cu">🏦 Send them to the credit union rate</button>`}
      ${it.known?`<button class="mv good ${D.honest.disclose?'on':''}" data-hn="disclose">🔧 Tell them about the ${c.issue.what.toLowerCase()}</button>`:''}
     </div>
   </div><div>
     <div class="custmood"><div class="mood">${mood}</div><div><b>${cu.name}</b><small>${r.sc>=0?'Ready to sign':'Not signing yet'}</small></div></div>
     <ul class="hist">${r.why.length?r.why.map(w=>'<li>'+w+'</li>').join(''):'<li>Listening…</li>'}</ul>
     <div class="bigrow"><span>Your profit</span><b style="color:var(--gold)">${fmt(r.profit)}</b></div>
     ${r.cash?`<div class="bigrow"><span>They pay today</span><b>${fmt(r.total)}</b></div>`:`<div class="bigrow"><span>Loan · ${(r.apr*100).toFixed(1)}% · ${r.n} mo</span><b>${fmt(r.loan)}</b></div><div class="bigrow"><span>Their payment</span><b>${fmt(r.pay)}/mo</b></div><div class="bigrow"><span>Interest they'll pay</span><b style="color:var(--red)">${fmt(r.interest)}</b></div>`}
     <div class="bigrow ${r.all<=safe?'ok':'bad'}"><span>Their real monthly cost<br><small>payment + insurance + gas + upkeep · safe: ${fmt(safe)}</small></span><b>${fmt(r.all)}</b></div>
     ${r.roll?`<div class="note bad">🌀 Their trade is underwater by ${fmt(-r.equity)}. Closing rolls that debt into the new loan.</div>`:''}
     <div class="mact"><button class="btn danger" id="dkNo">Let them walk</button><button class="btn pri" id="dkGo" ${r.sc<0?'disabled':''}>Close the deal</button></div>
   </div></div>`, true);
  G.modalClose=()=>deskBack();
  const re=()=>renderDesk(); m.querySelector('#dkX').onclick=deskBack;
  const P=m.querySelector('#dkPR'); P.oninput=()=>{ D.price=+P.value; renderDeskSoft(); }; P.onchange=re;
  const M=m.querySelector('#dkMR'); if(M){ M.oninput=()=>{ D.markup=+M.value/100; }; M.onchange=re; }
  const T=m.querySelector('#dkTR'); if(T){ T.oninput=()=>{ D.trade=+T.value; m.querySelector('#dkTv').textContent=fmt(D.trade); }; T.onchange=re; }
  m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ D.term=+b.dataset.t; re(); });
  m.querySelectorAll('[data-ad]').forEach(i=>i.onchange=()=>{ D.add[i.dataset.ad]=i.checked; re(); });
  m.querySelectorAll('[data-tc]').forEach(b=>b.onclick=()=>{ const k=b.dataset.tc; D.tac[k]=!D.tac[k]; if(k==='packing'&&D.tac.packing){ D.term=84; D.add.paint=D.add.etch=true; } sfx.tick(); re(); });
  m.querySelectorAll('[data-hn]').forEach(b=>b.onclick=()=>{ const k=b.dataset.hn; D.honest[k]=!D.honest[k]; if(k==='cu'&&D.honest.cu) D.markup=0; sfx.tick(); re(); });
  m.querySelector('#dkNo').onclick=()=>{ closeModal(); G.modalClose=null; const o=D.o; o.done=true; custLeave(o); G.desk=null; G.mode='lot'; G.you.root.position.set(3,0,-12); };
  m.querySelector('#dkGo').onclick=closeSale; }
function renderDeskSoft(){ const e=$('#dkP'); if(e) e.textContent=fmt(G.desk.price); }
function deskBack(){ closeModal(); G.modalClose=null; const D=G.desk; G.desk=null; G.mode='lot'; G.you.root.position.set(3,0,-12); if(D){ const o=D.o; o.tx=o.rig.root.position.x=3+1.5; o.tz=o.rig.root.position.z=-10.5; } }
function closeSale(){ const D=G.desk, r=dealMath(D), {cu,c,it,o}=D;
  const used=[]; if(D.tac.urgency) used.push('urgency'); if(D.tac.packing) used.push('payment_pack'); if(!r.cash&&D.term>=84) used.push('long_term'); if(D.markup>0&&!D.honest.cu) used.push('rate_markup'); if(r.adds.some(a=>a.junk)) used.push('junk_addons'); if(D.tac.yoyo) used.push('yoyo'); if(it.known&&!D.honest.disclose) used.push('hide_issue'); if(cu.trade&&D.trade<cu.trade.value*.9) used.push('trade_low'); if(r.roll) used.push('rollover'); if(o.baited) used.push('bait');
  used.forEach(t=>codex(t,'use'));
  S.cash+=r.profit+it.cost; S.inv=S.inv.filter(x=>x!==it); S.week.profit+=r.profit; S.week.sold++;
  S.sold.push({cust:cu.id, name:cu.name, car:c.id, ch:S.ch, price:D.price, all:Math.round(r.all), pay:Math.round(r.pay), take:cu.takeHome, stress:r.stress, used, issue:it.issue, disclosed:!!D.honest.disclose, fit:fitOf(cu,c).cls, honest:Object.keys(D.honest).filter(k=>D.honest[k]), interest:Math.round(r.interest), profit:Math.round(r.profit), rolled:r.roll?-r.equity:0, seen:false});
  addXP(100); saveS(); dhud(); closeModal(); G.modalClose=null; G.desk=null; G.mode='lot'; G.you.root.position.set(3,0,-12);
  sfx.cash(); setTimeout(()=>tone(1568,.18,'triangle',.04),120); toast(`🤝 Sold! ${cu.name} drives off in the ${c.name}. <b>+${fmt(r.profit)}</b> profit.`,'good');
  if(used.length>=3) advise(`That deal made <b>${fmt(r.profit)}</b>. ${cu.name}'s real monthly cost is <b>${fmt(r.all)}</b> on a ${fmt(cu.takeHome)} paycheck. Let's see how that goes…`,8000);
  else if(r.all<=budgetOf(cu)) advise(`Clean deal. ${cu.name} can actually afford this. That's the kind of customer who comes back.`,6000);
  scene.remove(o.rig.root); scene.remove(o.tag); W.cust=W.cust.filter(x=>x!==o); S.week.served++;
  const g=W.lotCars.get(c.id); g.userData.rolled=0; g.userData.tag.visible=false; tween(g,{x:g.position.x,z:g.position.z},{x:0,z:ROAD.z1+1},2.2,()=>{ g.visible=false; });
  setTimeout(nextCustomer,1200); }

/* ---------- end of the week: bills, then the flash-forward ---------- */
function endWeek(){ if(!S.week||S.week.ended) return; S.week.ended=1; const C=CHAPTERS[S.ch-1], Wk=S.week; const rent=1500, floor=S.inv.length*150; S.cash-=rent+floor;
  W.cust.forEach(o=>{ scene.remove(o.rig.root); scene.remove(o.tag); }); W.cust=[];
  const cards=S.sold.filter(s=>s.ch===S.ch).map(outcome), stars=cards.map(x=>x.stars); S.stars=S.stars.concat(stars); const recent=S.stars.slice(-8); if(recent.length) S.rep=recent.reduce((a,b)=>a+b,0)/recent.length*.85+3*.15;
  cards.forEach(x=>{ if(x.complaint){ S.heat+=x.heat; S.complaints.push(x.complaint); } if(x.stars===5) addXP(80); });
  const passed=C.check(Wk); if(passed){ addXP(150); S.cash+=500; }
  Wk.res={cards, rent:rent+floor, passed}; saveS(); dhud(); showWeekEnd(true); }
function showWeekEnd(first){ const C=CHAPTERS[S.ch-1], Wk=S.week, R=Wk.res;
  const m=modal(`<div class="eyebrow">End of week ${S.ch} · flash-forward one year</div><h2>How are your customers doing?</h2>
   <div class="reviews">${R.cards.map(x=>`<div class="rv s${x.stars}"><div class="rh"><b>${x.name}</b><span>${'★'.repeat(x.stars)}<i>${'★'.repeat(5-x.stars)}</i></span></div><p>"${x.quote}"</p><small>${x.fact}</small>${x.lesson?`<div class="lesson">${x.lesson}</div>`:''}</div>`).join('')||'<p>You didn\'t sell any cars this week.</p>'}</div>
   <div class="specs" style="grid-template-columns:repeat(4,1fr)"><div><em>Week profit</em><b>${fmt(Wk.profit)}</b></div><div><em>Rent + floor plan</em><b style="color:var(--red)">-${fmt(R.rent)}</b></div><div><em>Reputation</em><b>★ ${S.rep.toFixed(1)}</b></div><div><em>Complaints</em><b>${S.heat?'🔥 '+S.heat:'None'}</b></div></div>
   <div class="goalbox ${R.passed?'ok':'no'}">${R.passed?'✅':'❌'} <b>Goal:</b> ${C.goal}${R.passed?' · +$500 bonus':''}</div>
   <div class="mact"><button class="btn" id="ewCx">📕 Codex</button><button class="btn pri" id="ewGo">${C.audit?'Open the audit':'Next chapter'}</button></div>`, true);
  const avg=R.cards.length?R.cards.reduce((a,x)=>a+x.stars,0)/R.cards.length:0; if(first&&avg>=3.5) setTimeout(confetti,300); else if(first&&R.cards.length) setTimeout(()=>sfx.bad(),300);
  m.querySelector('#ewCx').onclick=()=>codexView(()=>showWeekEnd(false));
  m.querySelector('#ewGo').onclick=()=>{ clearConfetti(); S.week=null; if(C.audit) return audit(); S.ch++; saveS(); hub(); }; }
function outcome(s){ if(s.out) return s.out; const sh=s.used.length, st=s.stress; let stars, quote, fact, lesson='', heat=0, complaint=null;
  const broke=s.issue&&Math.random()<.75;
  if(s.used.includes('yoyo')){ stars=1; quote='A week after I drove it home they called: "financing fell through", sign at a higher rate. I had already sold my old car. I felt trapped.'; fact='Rate went up 3 points. Complaint filed.'; heat=3; complaint=s.name+': yo-yo financing'; codex('yoyo','see'); lesson='Yo-yo financing is illegal in many states when done this way.'; }
  else if(st>.3){ stars=1; quote='I missed three payments. They took the car back. Now I have no car and my credit is wrecked.'; fact=`Real cost ${fmt(s.all)}/mo on ${fmt(s.take)} take-home (${Math.round(st*100)}%). Repossessed.`; heat=sh>=2?2:1; complaint=s.name+': repossessed after an unaffordable deal'; lesson='When a car eats 30%+ of a paycheck, one bad month means repossession.'; s.used.forEach(t=>codex(t,'see')); }
  else if(broke&&!s.disclosed){ stars=1; quote=`The ${carById(s.car).issue.what.toLowerCase()} two months later. ${fmt(carById(s.car).issue.cost)}. ${s.used.includes('hide_issue')?'They KNEW. The dealer knew.':'Nobody checked it.'}`; fact='Repair bill the buyer didn\'t see coming.'; heat=s.used.includes('hide_issue')?3:1; complaint=s.name+': '+(s.used.includes('hide_issue')?'hidden known defect':'car broke soon after sale'); codex('hide_issue','see'); lesson='Hiding a known defect can be fraud. Inspections protect buyers and honest dealers.'; }
  else if(st>.22){ stars=2; quote='I can make the payments, barely. No savings left. Every month is scary.'; fact=`Real cost ${fmt(s.all)}/mo (${Math.round(st*100)}% of pay). Interest: ${fmt(s.interest)} over the loan.`; heat=sh>=2?1:0; if(heat) complaint=s.name+': pressured into a bad loan'; s.used.forEach(t=>codex(t,'see')); lesson='Over ~20% of take-home on a car leaves no room for emergencies.'; }
  else if(s.rolled){ stars=3; quote='Love the truck. Then I learned I owe way more than it\'s worth. If I ever need to sell it, I\'m stuck.'; fact=`Started the loan ${fmt(s.rolled)} underwater.`; codex('rollover','see'); lesson='Rolling old debt into a new loan feels like help. It\'s a deeper hole.'; }
  else if(sh>=2){ stars=3; quote='It\'s fine. I found out later I paid for a bunch of stuff I didn\'t need.'; fact=`Tricks used: ${s.used.map(t=>TACTICS.find(x=>x.id===t).name).join(', ')}.`; s.used.forEach(t=>codex(t,'see')); }
  else if(s.fit==='no'){ stars=2; quote='Honestly? Wrong car for my life. Should have asked more questions.'; fact='Didn\'t fit their needs.'; }
  else { stars=st<=.17?5:4; quote=pick(['Best car decision I ever made. I still have savings!','They showed me the real numbers. I\'m telling all my friends.','Two shifts a week pay for the whole car. Zero stress.']); fact=`Real cost ${fmt(s.all)}/mo (${Math.round(st*100)}% of pay).${stars===5?' Sent you a referral!':''}`; }
  s.out={name:s.name, stars, quote, fact, lesson, heat, complaint}; return s.out; }

/* ---------- the audit + endings ---------- */
function audit(){ const left=S.inv.reduce((a,x)=>a+Math.round(x.cost*.9),0); if(left){ S.cash+=left; S.inv=[]; syncLot(); toast('Sold leftover cars back to the auction for '+fmt(left)); } const fine=S.heat*900, list=S.complaints;
  const m=modal(`<div class="eyebrow">Bot City Consumer Protection Office</div><h2>The Audit</h2>
   <p>"We reviewed every deal you made and every complaint filed."</p>
   ${list.length?`<ul class="notes">${list.map(x=>'<li>⚠️ '+x+'</li>').join('')}</ul>`:'<p class="quote">"No complaints on file. Frankly, that\'s rare for a car lot."</p>'}
   <div class="specs" style="grid-template-columns:repeat(3,1fr)"><div><em>Complaint points</em><b>${S.heat}</b></div><div><em>Fine</em><b style="color:${fine?'var(--red)':''}">${fmt(fine)}</b></div><div><em>Cash before fine</em><b>${fmt(S.cash)}</b></div></div>
   <div class="mact"><button class="btn pri" id="auGo">${S.heat>=12?'Hear the verdict':'Pay and continue'}</button></div>`, true);
  m.querySelector('#auGo').onclick=()=>{ S.cash-=fine; ending(); }; }
function ending(){ const repaid=S.cash>=20000, honestSales=S.sold.filter(s=>s.used.length===0).length, harmed=S.sold.filter(s=>s.out&&s.out.stars<=2).length;
  let E; if(S.heat>=12) E={k:'shut', t:'Shut Down', icon:'🚫', p:'The Consumer Protection Office revoked your dealer license. The lot is boarded up. Somewhere, Slick is laughing.'};
  else if(!repaid) E={k:'broke', t:S.rep>=3.8?'Good Heart, Empty Wallet':'Out of Business', icon:'📉', p:S.rep>=3.8?'Customers loved you, but you couldn\'t pay back BotBank. Honest businesses still need margins, a budget and fewer upgrades than they want.':'You couldn\'t pay back the bank, and your reputation didn\'t help. BotBank takes the keys back.'};
  else if(S.rep>=4&&S.heat<=2) E={k:'legend', t:'Bot City Legend', icon:'🏆', p:'Top-rated lot in the city. Your customers send their kids to you. Slick shows up asking for a job. You tell him to read the Codex first.'};
  else if(S.heat>=6) E={k:'slick', t:'Slick 2.0', icon:'😎', p:'You paid the bank back, mostly with other people\'s money. The audit cost you, and your name is mud. You became the dealer you once hated.'};
  else E={k:'standing', t:'Still Standing', icon:'🔑', p:'You paid back BotBank and kept the doors open. Not perfect, not shady. Room to grow next time.'};
  S.done=true; S.ending=E.k; const seen=store.get('endings',{}); seen[E.k]=1; store.set('endings',seen); store.set('story',S); const got=Object.keys(seen).length, cx=TACTICS.filter(t=>S.codex[t.id]&&(S.codex[t.id].spot||S.codex[t.id].use)).length;
  const m=modal(`<div class="eyebrow">Ending · ${got} of 5 found</div><div class="medalrow"><div class="medal">${E.icon}</div><div><h2 style="margin:0">${E.t}</h2><p style="margin:4px 0 0">Rank: <b>${rank()}</b> · ★ ${S.rep.toFixed(1)} · Cash ${fmt(S.cash)}</p></div></div>
   <p>${E.p}</p>
   <div class="specs" style="grid-template-columns:repeat(4,1fr)"><div><em>Cars sold</em><b>${S.sold.length}</b></div><div><em>Honest deals</em><b>${honestSales}</b></div><div><em>Customers hurt</em><b style="color:${harmed?'var(--red)':''}">${harmed}</b></div><div><em>Codex</em><b>${cx}/12</b></div></div>
   <div class="lesson">Every trick you learned works on you too. The next time you buy a car, you'll be the savviest person in the room.</div>
   <div class="mact"><button class="btn" id="enCx">📕 Codex</button><button class="btn pri" id="enAgain">New story (try another ending)</button></div>`, true);
  if(E.k==='legend'||E.k==='standing') confetti(); else sfx.bad();
  m.querySelector('#enCx').onclick=()=>codexView(ending); m.querySelector('#enAgain').onclick=()=>{ const cxKeep=S.codex; S=newStory(); S.codex=cxKeep; S.ch=1; saveS(); W.lotCars.forEach(g=>{ g.userData.rolled=0; }); enterDealer(); hub(); }; }

/* ---------- prologue: spot Slick's tricks ---------- */
function proSpot(id){ if(G.storyMode==='prologue') codex(id,'spot'); }
function storyTick(dt){ tweenTick(dt); if(G.dealer) custTick(dt); }
storyTitle();
boot().catch(e=>{ console.error(e); $('#btnStart').textContent='Could not load'; });
