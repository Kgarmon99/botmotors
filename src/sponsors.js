/* ===================== BotMotors · sponsor slots ======================
   Real company names never show in the live game until a deal is signed.
   ?slots            -> every slot shows "YOUR BRAND HERE"
   ?sponsor=Name&color=%23hex&tagline=...  -> preview one company everywhere
   ?pitch            -> build a demo link for a meeting
   ?sponsor=...&demo -> 60-second cinematic tour, then "This could be you" */
const SPONSORS={presenting:null, creditunion:null, insurance:null, service:null, billboard:null, career:null};   /* fill in after a deal is signed: {name,color,tagline} */
const SLOT_INFO={presenting:'Presenting partner (title screen)', creditunion:'Credit union booth + loan offers', insurance:'Insurance office + quotes', service:'Service partner at the mechanic', billboard:'City billboard', career:'Career cards'};
const SPONSOR_MODE=(()=>{const q=new URLSearchParams(location.search),n=q.get('sponsor');if(n)return {kind:'preview',s:{name:n.slice(0,40),color:q.get('color')||'#00E676',tagline:(q.get('tagline')||'').slice(0,60)}};if(q.has('slots'))return {kind:'slots',s:{name:'Your brand here',color:'#FACC15',tagline:'This spot is available'}};return {kind:'live'};})();
function slotFill(slot){if(SPONSOR_MODE.kind!=='live')return SPONSOR_MODE.s;return SPONSORS[slot]||null;}
const escS=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CU_NAME=()=>{const s=slotFill('creditunion');return s?s.name:'BotBank Credit Union';};
const INS_NAME=()=>{const s=slotFill('insurance');return s?s.name:'Shield Bot Insurance';};
function spBadge(slot,label){const s=slotFill(slot);return s?`<span class="spb" style="--sc:${escS(s.color)}">${label||'Partner'} · <b>${escS(s.name)}</b></span>`:'';}
function spTitle(){const s=slotFill('presenting'),el=$('#tSpons');if(!el)return;el.innerHTML=s?`<div class="note" style="border-left-color:${escS(s.color)}">Presented by <b style="color:${escS(s.color)}">${escS(s.name)}</b>${s.tagline?' · '+escS(s.tagline):''}</div>`:'';}

/* ---------- pitch builder ---------- */
function pitchURL(n,t,c,demo){const u=new URL(location.href),q=new URLSearchParams();q.set('sponsor',n);if(t)q.set('tagline',t);if(c)q.set('color',c);return u.origin+u.pathname+'?'+q.toString()+(demo?'&demo':'');}
function initPitch(){if(PARAMS.has('pitch')&&SPONSOR_MODE.kind!=='preview')return pitchBuilder();if(PARAMS.has('demo')&&SPONSOR_MODE.kind==='preview')return pitchSplash();}
function pitchBuilder(){$('#title').hidden=true;const sw=['#0EA5E9','#DC2626','#16A34A','#F59E0B','#7C3AED','#1D4ED8','#0F766E','#E11D48'];let col=sw[0];
  const C=modal(`<div class="eyebrow">BotMotors · Sponsor demo kit</div><h2>Build a demo for a company</h2><p>Type their name and brand color. You get a link that plays a 60-second tour with <b>their name on the billboard, the credit union, the insurance office, the service bay and the career cards</b>, then ends on "This could be you."</p>
   <label class="set-n">Company name</label><input id="pkN" maxlength="40" placeholder="e.g. Bluegrass Credit Union" style="width:100%;padding:11px;border-radius:4px;border:1px solid #2F3A46;background:#0B0F14;color:#fff;font:600 17px var(--body)">
   <label class="set-n">Tagline (optional)</label><input id="pkT" maxlength="60" placeholder="e.g. Helping Kentucky drive smarter" style="width:100%;padding:11px;border-radius:4px;border:1px solid #2F3A46;background:#0B0F14;color:#fff;font:600 15px var(--body)">
   <label class="set-n">Brand color</label><div style="display:flex;gap:8px;flex-wrap:wrap">${sw.map((c,i)=>`<button data-c="${c}" style="width:34px;height:34px;border-radius:4px;border:2px solid ${i?'#0B0F14':'#fff'};background:${c}"></button>`).join('')}<input type="color" id="pkC" value="${sw[0]}"></div>
   <div class="note" style="text-align:center;margin-top:14px"><small style="color:var(--txt3)">PREVIEW</small><div id="pkP" style="font:800 36px var(--display);text-transform:uppercase">Your company</div></div>
   <input id="pkL" readonly style="width:100%;padding:9px;border-radius:4px;border:1px solid #2F3A46;background:#0B0F14;color:#9CA3AF;font-size:13px">
   <div class="mact"><a class="btn" href="?slots">Every slot</a><button class="btn" id="pkCopy">Copy demo link</button><button class="btn pri" id="pkGo">Play the demo</button></div>`,true);
  const upd=()=>{const n=$('#pkN').value.trim();$('#pkP').textContent=n||'Your company';$('#pkP').style.color=col;$('#pkL').value=n?pitchURL(n,$('#pkT').value.trim(),col,true):'';$('#pkGo').disabled=$('#pkCopy').disabled=!n;};
  C.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;$('#pkC').value=col;C.querySelectorAll('[data-c]').forEach(x=>x.style.borderColor=x===b?'#fff':'#0B0F14');upd();});
  $('#pkC').oninput=e=>{col=e.target.value;upd();};$('#pkN').oninput=upd;$('#pkT').oninput=upd;$('#pkGo').onclick=()=>location.href=$('#pkL').value;
  $('#pkCopy').onclick=async()=>{let ok=false;try{await navigator.clipboard.writeText($('#pkL').value);ok=true;}catch(e){$('#pkL').select();try{ok=document.execCommand('copy');}catch(_){}}$('#pkCopy').textContent=ok?'Copied!':'Select the link below';};upd();}
function pitchSplash(){const s=SPONSOR_MODE.s;$('#title').hidden=true;const C=modal(`<div style="text-align:center"><div class="eyebrow">A MoneyBot game · private demo</div><h2 style="font-size:58px;margin:8px 0 0">Bot<span style="color:var(--green)">Motors</span></h2><div style="font:700 26px var(--display);color:var(--txt3)">×</div>
  <div style="font:800 44px/1.05 var(--display);text-transform:uppercase;color:${escS(s.color)}">${escS(s.name)}</div><p>The car-buying game that teaches Kentucky students loans, insurance and the true cost of a car.</p>
  <button class="btn pri big" id="tgGo">${ic('play')} Play the 60-second tour</button><p style="font-size:12px;color:var(--txt3)">Turn your sound on</p></div>`);C.querySelector('#tgGo').onclick=()=>{closeModal();audio();musicStart();startTour();};}

/* ---------- cinematic tour ---------- */
let TOUR=null;
function tourShots(){const s=SPONSOR_MODE.s,N=escS(s.name),bb=W.billboard||new THREE.Vector3(-30,6,26),ins=W.ins||new THREE.Vector3(-20,0,-4);
  return [{p:[bb.x+16,4,bb.z+18],p2:[bb.x+6,6,bb.z+12],l:[bb.x,bb.y,bb.z],l2:[bb.x,bb.y+.5,bb.z],d:7,cap:`<small>BOTMOTORS × ${N}</small>Your brand, in the game Kentucky students play to learn how to buy a car.`},
    {p:[30,22,34],p2:[16,14,24],l:[0,0,0],l2:[0,0,-2],d:7,cap:'Students walk the lot, test drive, and haggle with Slick the salesbot.'},
    {p:[W.cu.x-6,5.5,W.cu.z+7.5],p2:[W.cu.x-2.5,4.4,W.cu.z+5.6],l:[W.cu.x,1.6,W.cu.z+1],l2:[W.cu.x,1.7,W.cu.z+1],d:7,cap:`They learn to get pre-approved at <b style="color:${escS(s.color)}">${N}</b> before they shop.`},
    {p:[ins.x+9,3,ins.z+8],p2:[ins.x+5,2.6,ins.z+6],l:[ins.x,1.6,ins.z],l2:[ins.x,1.6,ins.z],d:7,cap:'They compare insurance quotes and see why a fast car costs more to insure.'},
    {p:[W.mech.x+5,5.6,W.mech.z+11],p2:[W.mech.x+1.5,4.6,W.mech.z+9],l:[W.mech.x,2.2,W.mech.z+3],l2:[W.mech.x,2.2,W.mech.z+3],d:6.5,cap:'A $120 inspection that saves thousands. Every station can carry your name.'},
    {p:[0,3,30],p2:[-30,5,30],l:[0,1,22],l2:[-30,1,22],d:7,cap:'Then they live through year one: payments, insurance, gas and surprise repairs.'},
    {p:[0,40,60],p2:[0,60,80],l:[0,0,0],l2:[0,0,-6],d:6.5,cap:'Built in Kentucky. Runs on school Chromebooks. Nothing to install.'}];}
function startTour(){$('#title').hidden=true;$('#hud').hidden=true;G.mode='tour';G.you.root.visible=false;TOUR={shots:tourShots(),i:0,t:0};
  let cap=$('#tourCap');if(!cap){cap=document.createElement('div');cap.id='tourCap';document.body.appendChild(cap);}cap.hidden=false;showCap();}
function showCap(){const sh=TOUR.shots[TOUR.i];$('#tourCap').innerHTML=sh.cap;$('#tourCap').classList.remove('in');void $('#tourCap').offsetWidth;$('#tourCap').classList.add('in');}
function tourTick(dt){if(!TOUR)return;const sh=TOUR.shots[TOUR.i];TOUR.t+=dt;const k=Math.min(1,TOUR.t/sh.d),e=k*k*(3-2*k),L=(a,b)=>a.map((v,j)=>v+(b[j]-v)*e);
  camera.position.set(...L(sh.p,sh.p2));const l=L(sh.l,sh.l2);camera.lookAt(l[0],l[1],l[2]);
  if(k>=1){TOUR.i++;TOUR.t=0;if(TOUR.i>=TOUR.shots.length)return endTour();showCap();}}
function endTour(){TOUR=null;G.mode='title';$('#tourCap').hidden=true;const s=SPONSOR_MODE.s,N=escS(s.name);
  const slots=[['tag','Presenting partner','Your name on the title screen'],['bank','Credit union booth','Students get pre-approved with you'],['shield','Insurance office','Every insurance quote comes from you'],['wrench','Service partner','The trusted mechanic bay'],['mega','City billboard','Seen on every test drive'],['user','Career cards','Real car-industry jobs, at your company']];
  const C=modal(`<div class="eyebrow">BotMotors · sponsor placements</div><h2 style="font-size:48px">This could be <span style="color:${escS(s.color)}">${N}</span></h2>
   <div class="rc">${slots.map(([i,t,d])=>`<div class="ok">${ic(i)}<div><b>${t}</b><small>${d}</small></div></div>`).join('')}</div>
   <div class="note"><b>What students learn:</b> fair price research, credit union pre-approval, APR and loan length, insurance, Kentucky usage tax and fees, dealer tricks, and the true monthly cost of a car.</div>
   <div class="mact"><button class="btn" id="teAgain">${ic('play')} Replay tour</button><a class="btn" href="?slots">Every slot</a><a class="btn pri" href="${escS(pitchURL(s.name,s.tagline,s.color,false))}">Play the game with ${N}</a></div><p style="font-size:12px;color:var(--txt3);text-align:center">A MoneyBot game · getmoneybot.com</p>`,true);
  sfx.good();confetti&&confetti();C.querySelector('#teAgain').onclick=()=>{closeModal();clearConfetti&&clearConfetti();startTour();};}
