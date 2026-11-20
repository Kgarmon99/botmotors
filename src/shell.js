/* ===================== BotMotors · shell: boot, menu, slots, settings, pause, credits, coach ===================== */
var bootTipT=null;
function bootProg(p){$('#bootFill').style.width=p+'%';$('#bootPct').textContent=Math.round(p)+'%';$('#bootMsg').textContent=BOOT_MSG.filter(x=>x[0]<=p).pop()[1];}
function bootTips(){const el=$('#bootTip');if(MB_ASSETS&&MB_ASSETS.logo)$('#bLogo').src=MB_ASSETS.logo;let i=Math.floor(Math.random()*BOOT_TIPS.length);const f=()=>{el.style.opacity=0;setTimeout(()=>{el.textContent=BOOT_TIPS[i++%BOOT_TIPS.length];el.style.opacity=1;},260);};f();bootTipT=setInterval(f,3800);}
function bootDone(){clearInterval(bootTipT);bootProg(100);const b=$('#boot');setTimeout(()=>{b.classList.add('out');setTimeout(()=>b.remove(),800);},Math.max(250,(PARAMS.has('test')?0:1500)-performance.now()));}


/* ---------- main menu ---------- */
function page(id){$$('#title .tpage').forEach(p=>p.hidden=p.id!==id);}
function slotInfo(n){const s=store.get(storyKey(n),null);if(!s)return null;return {done:s.done,t:s.done?'Finished':s.ch>0?'Chapter '+s.ch:'Prologue',sub:s.done?'Ending: '+(s.ending||'—'):s.ch>0?fmt(s.cash||0)+' cash · '+(s.rep!=null?(+s.rep).toFixed(1)+'★':''):'Buying your first car'};}
function storyTitle(){const b=$('#btnStory');if(!b)return;const cur=[STORY_SLOT,1,2,3].find(n=>{const i=slotInfo(n);return i&&!i.done;});
  const c=$('#btnCont');if(cur){const i=slotInfo(cur);c.hidden=false;$('#contInfo').textContent=`Slot ${cur} · ${i.t}${i.sub?' · '+i.sub:''}`;c.onclick=()=>storyStart(cur);}else c.hidden=true;
  b.onclick=()=>{page('pgSlots');SLOTPICK=[1,2,3].find(n=>!slotInfo(n))||STORY_SLOT;renderSlots();};}
let SLOTPICK=1,SLOTARM=false;
function renderSlots(){$('#slots').innerHTML=[1,2,3].map(n=>{const i=slotInfo(n);return `<button class="slot${n===SLOTPICK?' on':''}${i?'':' empty'}" data-n="${n}"><em>Slot ${n}</em><b>${i?i.t:'Empty'}</b><span>${i?i.sub:'Start a new story'}</span></button>`;}).join('');
  $$('#slots .slot').forEach(b=>b.onclick=()=>{SLOTPICK=+b.dataset.n;SLOTARM=false;renderSlots();});
  const i=slotInfo(SLOTPICK),go=$('#btnSlotGo');go.textContent=!i?'Start new story':i.done?(SLOTARM?'Yes, erase and start over':'Start over in this slot…'):'Continue · '+i.t;
  go.onclick=()=>{const j=slotInfo(SLOTPICK);if(j&&j.done&&!SLOTARM){SLOTARM=true;renderSlots();return;}if(j&&j.done)store.set(storyKey(SLOTPICK),null);storyStart(SLOTPICK);};}
function storyStart(n){STORY_SLOT=n;store.set('storySlot',n);const saved=store.get(storyKey(),null);audio();musicStart();$('#title').hidden=true;
  S=saved&&!saved.done?saved:newStory();if(S.ch>0){applyProfile(PROFILES[0]);enterDealer();hub();}else startPrologue();}
function initMenu(){$('#tVer').textContent=`v${VERSION} · A MoneyBot game · No accounts, no ads`;storyTitle();
  $('#btnStory').disabled=false;$('#btnFree').onclick=()=>page('pgFree');$$('[data-back]').forEach(b=>b.onclick=()=>page('pgMain'));
  $('#btnCalc').onclick=()=>tcoCalc();$('#btnSet').onclick=openSettings;$('#btnHow').onclick=howTo;$('#btnCred').onclick=credits;
  $('#btnCalcH').onclick=()=>tcoCalc(G.cardId||null);$('#btnPause').innerHTML=ic('gear');$('#btnPause').onclick=openPause;
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!G.modal&&$('#card').hidden&&G.mode!=='title'&&G.mode!=='tour'){e.stopImmediatePropagation();e.preventDefault();openPause();}},true);
  spTitle();watchIcons();if(PARAMS.has('pitch')||PARAMS.has('demo'))initPitch();}

/* ---------- settings ---------- */
function openSettings(back){const C=modal(`<button class="x" id="sx">×</button><div class="set"><div class="eyebrow">Options</div><h2>Settings</h2>
  <h4>Sound</h4><label class="sr"><span>Volume</span><input type="range" min="0" max="1" step="0.05" value="${SET.vol}" id="sVol"><b id="sVolV">${Math.round(SET.vol*100)}%</b></label>
  <button class="tgl${MUS.on?' on':''}" id="sMus"><span><b>Music</b><small>The lot's soundtrack (M)</small></span><i></i></button>
  <h4>Graphics</h4><div class="seg">${[[-1,'Auto'],[0,'Low'],[1,'Medium'],[2,'High']].map(([v,t])=>`<button data-g="${v}"${SET.gfx===v?' class="on"':''}>${t}</button>`).join('')}</div><p class="set-n" id="gfxN">Low is fastest on older Chromebooks. High adds sharper shadows.</p>
  <h4>Comfort</h4><button class="tgl${SET.shake?' on':''}" data-t="shake"><span><b>Camera shake</b><small>Bumps and crashes shake the screen</small></span><i></i></button>
  <button class="tgl${SET.tips?' on':''}" data-t="tips"><span><b>MoneyBot tips</b><small>Hints while you shop</small></span><i></i></button>
  <h4>Progress</h4><p class="set-n">Story progress saves on this device in 3 slots. You're using <b>slot ${STORY_SLOT}</b>.</p></div>
  <div class="mact"><button class="btn pri" id="sOk">Done</button></div>`);
  const done=()=>{closeModal();if(back)openPause();};G.modalClose=done;C.querySelector('#sx').onclick=done;C.querySelector('#sOk').onclick=done;
  C.querySelector('#sVol').oninput=e=>{SET.vol=+e.target.value;saveSet();C.querySelector('#sVolV').textContent=Math.round(SET.vol*100)+'%';if(AC)aOut().gain.setTargetAtTime(SET.vol,AC.currentTime,.05);};
  C.querySelector('#sMus').onclick=e=>{audio();if(!MUS.g)musicStart();toggleMusic();e.currentTarget.classList.toggle('on',MUS.on);};
  C.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{SET.gfx=+b.dataset.g;saveSet();C.querySelectorAll('[data-g]').forEach(x=>x.classList.toggle('on',x===b));C.querySelector('#gfxN').innerHTML='Saved. <button class="btn sm" id="gfxR">Apply now (reloads)</button>';C.querySelector('#gfxR').onclick=()=>{saveS&&saveS();location.reload();};});
  C.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const k=b.dataset.t;SET[k]=!SET[k];saveSet();b.classList.toggle('on',SET[k]);});}

/* ---------- pause ---------- */
function openPause(){if(G.modal)return;G.paused=true;engineOn&&eng&&eng.g&&eng.g.gain.setTargetAtTime(0,AC.currentTime,.05);
  const C=modal(`<div class="eyebrow">${YOU.name}${G.dealer&&S?' · Chapter '+S.ch:''}</div><h2>Paused</h2><div class="pm">
    <button class="tm pri" id="pmR"><b>Resume</b></button><button class="tm" id="pmCalc"><b>Car cost calculator</b></button><button class="tm" id="pmCar"><b>Car careers</b></button>
    <button class="tm" id="pmSet"><b>Settings</b></button><button class="tm" id="pmHow"><b>How to play</b></button><button class="tm" id="pmQ"><b>Save + quit to menu</b><small>${G.dealer?'Story slot '+STORY_SLOT:'Free play runs are not saved'}</small></button></div>`);
  const res=()=>{G.paused=false;closeModal();};G.modalClose=res;C.querySelector('#pmR').onclick=res;
  C.querySelector('#pmSet').onclick=()=>{closeModal();G.paused=false;openSettings(true);};C.querySelector('#pmHow').onclick=()=>{closeModal();G.paused=false;howTo();};
  C.querySelector('#pmCalc').onclick=()=>{closeModal();G.paused=false;tcoCalc(G.cardId||null);};C.querySelector('#pmCar').onclick=()=>{closeModal();G.paused=false;careers();};
  C.querySelector('#pmQ').onclick=()=>{try{saveS();}catch(e){}location.reload();};}

/* ---------- how to play + credits ---------- */
function howTo(){const C=modal(`<button class="x" id="hx">×</button><div class="eyebrow">How to play</div><h2>Buy a car without getting played</h2>
  <div class="cc"><div class="car"><b>1 · Research</b><p>Walk up to any car. Check the fair price, test drive it, and pay Mike for an inspection on used cars.</p></div>
  <div class="car"><b>2 · Get pre-approved</b><p>Visit the blue credit union booth before you talk money. Their rate beats the dealer's.</p></div>
  <div class="car"><b>3 · Negotiate</b><p>Haggle the out-the-door price with Slick. Spot his tricks to fill your Tactic Codex.</p></div>
  <div class="car"><b>4 · Live year one</b><p>Payments, insurance, gas and surprise repairs hit every month. Can you keep it all under 15% of your pay?</p></div></div>
  <div class="note"><b>Controls:</b> WASD or arrow keys to walk or drive, click or tap to walk somewhere, <b>E</b> to interact, <b>H</b> horn, <b>M</b> music, <b>Esc</b> menu. On phones and tablets use the on-screen pedals.</div>
  <div class="mact"><button class="btn pri" id="hOk">Got it</button></div>`,true);const c=()=>closeModal();G.modalClose=c;C.querySelector('#hx').onclick=c;C.querySelector('#hOk').onclick=c;}
function credits(){const C=modal(`<button class="x" id="cx">×</button><div class="eyebrow">Credits</div><h2>BotMotors</h2><p>Version ${VERSION}</p>
  <div class="cr-g"><div><em>Made by</em><b>MoneyBot</b><span>getmoneybot.com</span></div><div><em>Made for</em><b>Kentucky students</b><span>Middle + high school</span></div>
  <div><em>3D engine</em><b>three.js</b><span>MIT license</span></div><div><em>Typefaces</em><b>Barlow + Barlow Condensed</b><span>SIL Open Font License</span></div>
  <div><em>Kentucky fees</em><b>County clerk fee schedules</b><span>6% usage tax, title, plate, lien</span></div><div><em>Inspired by</em><b>Real dealer tricks</b><span>so you can spot them</span></div></div>
  <div class="cr-priv">${ic('lock')}<p><b>Privacy:</b> no accounts, no ads and no personal info. Progress saves only on this device. Every car, brand and character is made up.</p></div>
  <div class="mact"><button class="btn pri" id="cOk">Close</button></div>`);const c=()=>closeModal();G.modalClose=c;C.querySelector('#cx').onclick=c;C.querySelector('#cOk').onclick=c;}

/* ---------- guided first minutes (coach marks) ---------- */
const anyKnown=k=>Object.values(G.known).some(i=>i[k]);
const COACH_FREE=[
  {el:'#hud .stat.goal',txt:'This is your <b>car budget</b>: 15% of your take-home pay. Payment, insurance, gas and repairs all have to fit under it.',btn:'Next',dim:1},
  {el:null,txt:'Walk up to any car (or just click it) to see what it would <b>really</b> cost you each month.',until:()=>!!G.cardId},
  {el:'#card .acts',txt:'Do your homework <b>before</b> you talk numbers: check the fair price, take a test drive, and get used cars inspected.',until:()=>anyKnown('fair')||anyKnown('inspected')||G.mode==='drive'},
  {el:null,txt:'Pro move: visit the blue <b>credit union</b> booth on the right and get pre-approved. Then Slick can\'t pad your interest rate.',until:()=>G.preapproved,btn:'Got it'}];
let COACH=null;
function coachStart(list){if(!SET.tips)return;COACH={list,i:0};coachShow();}
function coachShow(){const c=COACH.list[COACH.i];let el=$('#coach');if(!el){el=document.createElement('div');el.id='coach';el.innerHTML='<div class="co-ring"></div><div class="co-bub"><div class="co-t"></div><div class="co-b"><button class="co-skip">Skip tips</button><button class="btn pri sm co-n"></button></div></div>';document.body.appendChild(el);
    el.querySelector('.co-skip').onclick=coachEnd;el.querySelector('.co-n').onclick=coachNext;}
  el.querySelector('.co-t').innerHTML=c.txt;const n=el.querySelector('.co-n');n.hidden=!c.btn;n.textContent=c.btn||'';el.classList.toggle('dim',!!c.dim);sfx.tick();}
function coachNext(){if(!COACH)return;COACH.i++;if(COACH.i>=COACH.list.length)return coachEnd();coachShow();}
function coachEnd(){COACH=null;const e=$('#coach');if(e)e.remove();}
function tickCoach(){if(!COACH)return;const c=COACH.list[COACH.i],el=$('#coach');const hide=G.modal&&!c.modalOk||G.mode==='drive'&&!c.driveOk;el.style.visibility=hide?'hidden':'visible';if(c.until&&c.until())return coachNext();if(hide)return;
  const t=c.el&&$(c.el),r=t&&!t.hidden&&t.getClientRects().length?t.getBoundingClientRect():null,ring=el.querySelector('.co-ring'),bub=el.querySelector('.co-bub');
  if(r){ring.style.display='block';Object.assign(ring.style,{left:r.left-6+'px',top:r.top-6+'px',width:r.width+12+'px',height:r.height+12+'px'});const bw=bub.offsetWidth,below=r.bottom+170<innerHeight;
    bub.style.left=clamp(r.left+r.width/2-bw/2,12,innerWidth-bw-12)+'px';bub.style.top=(below?r.bottom+16:Math.max(12,r.top-16-bub.offsetHeight))+'px';}
  else{ring.style.display='none';bub.style.left=(innerWidth/2-bub.offsetWidth/2)+'px';bub.style.top=(innerHeight*.16)+'px';}}
function shellTick(dt){tickCoach(dt);}
