/* ===================== BotMotors · game ===================== */
const G={mode:'title', you:null, slick:null, mb:null, near:null, keys:new Set(), pad:{}, cash:YOU.savings, known:{}, preapproved:false, deal:null, drive:null, t:0, notes:[]};
const LOT_SPOTS={rattler:[-15,-6.5,0], commuter:[-9,-6.5,0], volt:[-3,-6.5,0], echo:[3,-6.5,0], thunder:[9,-6.5,0], titan:[15,-6.5,0], nova:[-9,6.5,Math.PI]};
const carById=id=>CARS.find(c=>c.id===id);
const info=id=>G.known[id]||(G.known[id]={inspected:false, fair:false, noticed:false, drove:false});

/* ---------- small UI helpers ---------- */
function toast(html,type){ const e=document.createElement('div'); e.className='toast '+(type||''); e.innerHTML=html; $('#toasts').appendChild(e); while($('#toasts').children.length>3) $('#toasts').firstChild.remove(); setTimeout(()=>{ e.style.transition='opacity .4s'; e.style.opacity=0; setTimeout(()=>e.remove(),400); },3600); }
let advT=0; function advise(html,ms=7000){ $('#aText').innerHTML=html; $('#advisor').classList.remove('hide'); clearTimeout(advT); advT=setTimeout(()=>$('#advisor').classList.add('hide'),ms); }
let slT=0; function slick(text,ms=4200){ const e=$('#slickSays'); e.querySelector('p').textContent=text; e.classList.remove('hide'); clearTimeout(slT); slT=setTimeout(()=>e.classList.add('hide'),ms); if(G.slick) rigPlay(G.slick,pick(['RightHand','LeftHand','UpPoint']),true); }
function modal(html,wide){ $('#modalCard').className=wide?'wide':''; $('#modalCard').innerHTML=html; $('#modal').hidden=false; G.modal=true; return $('#modalCard'); }
function closeModal(){ $('#modal').hidden=true; G.modal=false; }
function stars(n){ return '<span class="stars">'+'★'.repeat(n)+'<i>'+'★'.repeat(5-n)+'</i></span>'; }
function fade(fn){ $('#fade').style.opacity=1; setTimeout(()=>{ fn(); setTimeout(()=>$('#fade').style.opacity=0,80); },460); }
function note(t){ if(!G.notes.includes(t)) G.notes.push(t); }
function hud(){ $('#hSave').textContent=fmt(G.cash); $('#hPay').textContent=fmt(YOU.takeHome)+'/mo'; $('#hCredit').textContent=YOU.credit+(G.preapproved?' ✓':''); $('#hBudget').textContent=fmt(Math.round(YOU.takeHome*GOOD_PCT))+'/mo'; }

/* ---------- sound ---------- */
let AC=null, eng=null;
function audio(){ if(AC) return; try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
function tone(f,d=.12,type='triangle',v=.05,slide){ if(!AC) return; const t=AC.currentTime, o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(slide,t+d); g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(v,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+d+.02); }
const sfx={tick:()=>tone(900,.05,'sine',.04), good:()=>{ tone(660,.12); tone(990,.18,'triangle',.05); }, bad:()=>tone(180,.25,'sawtooth',.04,90), cash:()=>{ tone(1320,.08,'square',.025); tone(1760,.12,'square',.02); }, thud:()=>tone(90,.2,'sine',.12,40)};
function engineOn(on){ if(!AC) return; if(on && !eng){ const o=AC.createOscillator(), f=AC.createBiquadFilter(), g=AC.createGain(); o.type='sawtooth'; f.type='lowpass'; f.frequency.value=520; g.gain.value=.0; o.connect(f); f.connect(g); g.connect(AC.destination); o.start(); eng={o,g,f}; } if(!on && eng){ eng.g.gain.setTargetAtTime(0,AC.currentTime,.1); const e=eng; setTimeout(()=>e.o.stop(),400); eng=null; } }

/* ---------- boot ---------- */
async function boot(){
  initThree(); setupMaterials();
  ['tLogo','hLogo','aLogo'].forEach(id=>$('#'+id).src=MB_ASSETS.logo);
  buildWorld();
  GLTF.crowd=await parseGLB(MB_ASSETS.crowd); GLTF.hero=await parseGLB(MB_ASSETS.hero);
  CARS.forEach(c=>{ const g=makeCar(c), [x,z,r]=LOT_SPOTS[c.id]; g.position.set(x,0,z); g.rotation.y=r; scene.add(g); W.lotCars.set(c.id,g);
    const tag=sign(scene,[{t:c.year+' '+c.name,size:40,color:'#0B1220'},{t:fmt(c.price),size:64,color:c.used?'#B45309':'#047857'}],2.6,1.1,x,2.75+(c.style==='truck'?.5:0),z,{bg:'#FFFFFF',r:18,w:512,h:216}); tag.userData.bill=true; g.userData.tag=tag; });
  /* Nova on a turntable */
  const tt=new THREE.Mesh(new THREE.CylinderGeometry(3,3,.18,40), mat('#E2E8F0',{metalness:.5,roughness:.3})); tt.position.set(-9,0,6.5); scene.add(tt); W.anim.push(t=>{ W.lotCars.get('nova').rotation.y=t*.25; tt.rotation.y=t*.25; });
  sign(scene,[{t:'LEASE SPECIAL',size:40,color:'#FBBF24'},{t:'$299/mo',size:64}],2.4,1,-9,.9,10.2,{bg:'#0B1220',r:16,w:512,h:216});
  G.you=makeRig(GLTF.crowd, MB.you, .9,'g'); G.you.root.position.set(0,0,10); G.you.root.add(blob(1.1)); scene.add(G.you.root);
  G.slick=makeRig(GLTF.crowd, MB.slick, .95,'y'); G.slick.root.position.set(4,0,-12); G.slick.root.add(blob(1.1)); scene.add(G.slick.root);
  G.mech=makeRig(GLTF.crowd, MB.mech, .85,'g'); G.mech.root.position.set(-20,0,11.6); scene.add(G.mech.root);
  G.cuBot=makeRig(GLTF.crowd, MB.cu, .85,'g'); G.cuBot.root.position.set(19,0,10.6); scene.add(G.cuBot.root);
  G.mb=makeRig(GLTF.hero, MB.hero, 1.0,'g'); G.mb.root.position.set(-1.5,1.4,10); scene.add(G.mb.root);
  camera.position.set(30,24,34); camera.lookAt(0,0,0);
  $('#btnStart').disabled=false; $('#btnStart').textContent='Start shopping';
  requestAnimationFrame(loop);
}
$('#btnStart').onclick=()=>{ audio(); $('#title').hidden=true; startLot(true); };
function startLot(first){ G.mode='lot'; $('#hud').hidden=false; hud(); document.body.classList.remove('driving'); $('#dhud').hidden=true; $('#pads').hidden=true;
  if(first){ setTimeout(()=>advise('Hey! I\'m MoneyBot. You take home <b>'+fmt(YOU.takeHome)+' a month</b> and have <b>'+fmt(YOU.savings)+'</b> saved. Try to keep <b>everything</b> the car costs (payment, insurance, gas, repairs) under <b>'+fmt(YOU.takeHome*GOOD_PCT)+'/month</b>. Walk up to any car to check it out.',12000),600);
    setTimeout(()=>slick(pick(SLICK.hello)),3500); } }

/* ---------- input ---------- */
addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); G.keys.add(k); if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault(); if((k==='e'||k==='enter') && G.mode==='lot' && G.near && !G.modal) openCard(G.near); if(k==='escape'){ if(G.modal&&G.modalClose) G.modalClose(); else closeCard(); } });
addEventListener('keyup',e=>G.keys.delete(e.key.toLowerCase()));
addEventListener('blur',()=>G.keys.clear());
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2(), ground=new THREE.Plane(new THREE.Vector3(0,1,0),0);
$('#gl').addEventListener('pointerdown',e=>{ audio(); if(G.mode!=='lot'||G.modal) return; ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1); ray.setFromCamera(ndc,camera);
  const hits=ray.intersectObjects([...W.lotCars.values()],true); if(hits.length){ let o=hits[0].object; while(o&&!o.userData.spec) o=o.parent; if(o){ G.walkTo={x:o.position.x, z:o.position.z+(o.position.z<0?3.2:-3.2), car:o.userData.spec.id}; return; } }
  const p=new THREE.Vector3(); if(ray.ray.intersectPlane(ground,p)) G.walkTo={x:p.x, z:p.z}; });
$$('#pads button').forEach(b=>{ const k=b.dataset.k; b.addEventListener('pointerdown',e=>{ e.preventDefault(); G.pad[k]=1; }); ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>G.pad[k]=0)); });
$('#btnNotes').onclick=()=>{ const n=G.notes.length?G.notes:['Nothing yet. Inspect a car, check a fair price, or talk to the credit union.']; modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">Your notes</div><h2>What you've learned</h2><ul class="notes">${n.map(x=>'<li>'+x+'</li>').join('')}</ul>`); };

/* ---------- lot: walking + proximity ---------- */
function lotTick(dt){
  const r=G.you.root; let mx=0, mz=0; const k=G.keys;
  if(k.has('w')||k.has('arrowup')) mz-=1; if(k.has('s')||k.has('arrowdown')) mz+=1; if(k.has('a')||k.has('arrowleft')) mx-=1; if(k.has('d')||k.has('arrowright')) mx+=1;
  if(mx||mz) G.walkTo=null; else if(G.walkTo){ const dx=G.walkTo.x-r.position.x, dz=G.walkTo.z-r.position.z, d=Math.hypot(dx,dz); if(d<.3){ const c=G.walkTo.car; G.walkTo=null; if(c){ openCard(c); } } else { mx=dx/d; mz=dz/d; } }
  const L=Math.hypot(mx,mz); if(L>0 && !G.modal && $('#card').hidden){ mx/=L; mz/=L; const sp=6.2*dt, nx=r.position.x+mx*sp, nz=r.position.z+mz*sp;
    const blocked=[...W.lotCars.values()].some(g=>Math.abs(nx-g.position.x)<1.25 && Math.abs(nz-g.position.z)<2.6);
    if(!blocked && nx>LOT.x0+.6 && nx<LOT.x1-.6 && nz>LOT.z0+.8 && nz<LOT.z1-.4){ r.position.x=nx; r.position.z=nz; }
    r.rotation.y=Math.atan2(mx,mz); r.position.y=Math.abs(Math.sin(G.t*11))*.05; if(G.you.cur!=='Idle') rigPlay(G.you,'Idle'); }
  /* nearest car / kiosk */
  let best=null, bd=4.2; for(const [id,g] of W.lotCars){ const d=Math.hypot(g.position.x-r.position.x, g.position.z-r.position.z); if(d<bd){ bd=d; best=id; } }
  if(Math.hypot(W.cu.x-r.position.x, W.cu.z-r.position.z)<4.2) best='@cu'; if(Math.hypot(W.mech.x-r.position.x, W.mech.z+3-r.position.z)<4.5) best='@mech';
  if(best!==G.near){ G.near=best; const p=$('#prompt'); if(best && $('#card').hidden){ p.hidden=false; p.innerHTML=(MOBILE?'Tap to ':'<kbd>E</kbd> ')+(best==='@cu'?'Talk to the credit union':best==='@mech'?'Talk to Mike the mechanic':'Look at the '+carById(best).name); p.onclick=()=>openCard(best); } else p.hidden=true; if(best && best[0]!=='@' && Math.random()<.5) slick(pick(SLICK.pitch[best])); }
  /* Slick drifts toward you; MoneyBot hovers nearby */
  const s=G.slick.root, tx=r.position.x+2.2, tz=r.position.z-1.4, dd=Math.hypot(tx-s.position.x,tz-s.position.z); if(dd>3){ s.position.x+=(tx-s.position.x)/dd*4.2*dt; s.position.z+=(tz-s.position.z)/dd*4.2*dt; s.rotation.y=Math.atan2(tx-s.position.x,tz-s.position.z); } else s.rotation.y=Math.atan2(r.position.x-s.position.x,r.position.z-s.position.z);
  const m=G.mb.root; m.position.x+=(r.position.x-1.6-m.position.x)*dt*1.5; m.position.z+=(r.position.z+.8-m.position.z)*dt*1.5; m.position.y=1.5+Math.sin(G.t*2)*.12; m.rotation.y=Math.atan2(camera.position.x-m.position.x,camera.position.z-m.position.z);
  /* camera */
  const cx=r.position.x*.75, cz=r.position.z; camera.position.x+=(cx+11-camera.position.x)*dt*2.5; camera.position.y+=(13-camera.position.y)*dt*2.5; camera.position.z+=(cz+17-camera.position.z)*dt*2.5; camera.lookAt(camera.position.x-11, 0, camera.position.z-17);
  sun.position.set(r.position.x+30,50,r.position.z+25); sun.target.position.set(r.position.x,0,r.position.z);
}

/* ---------- car card ---------- */
function monthlyFuel(c){ return c.fuel==='electric' ? YOU.milesMonth*KWH_MILE : YOU.milesMonth/c.mpg*(c.fuel==='premium'?PREMIUM:GAS); }
function openCard(id){ G.walkTo=null; $('#prompt').hidden=true;
  if(id==='@cu') return creditUnion(); if(id==='@mech') return mechanic();
  const c=carById(id), I=info(id), fuel=monthlyFuel(c), estPay=pmt(c.price*(1+TAX)+DOC_FEE+TITLE_FEE-1500, c.used?RATES.dealer.used:RATES.dealer.new, 60), ins=c.ins+(c.ins<150?70:0), tot=estPay+ins+fuel+c.maint;
  const card=$('#card'); card.hidden=false; G.cardId=id; G.slick&&rigPlay(G.slick,'UpPoint',true);
  card.innerHTML=`<button class="x" onclick="closeCard()">×</button><div class="eyebrow">${c.used?'Used':'Brand new'} · ${c.year}</div><h2>${c.name}</h2><div class="sub">${c.blurb}</div>
   <div class="price">${fmt(c.price)} <small>sticker price${c.markup?' (includes '+fmt(c.markup)+' dealer markup)':''}</small></div>
   <div class="specs"><div><em>Miles</em><b>${c.miles.toLocaleString()}</b></div><div><em>${c.fuel==='electric'?'Energy':'Fuel economy'}</em><b>${c.fuel==='electric'?'≈5¢ / mile':c.mpg+' mpg'+(c.fuel==='premium'?' · premium':'')}</b></div>
   <div><em>Reliability</em><b>${stars(c.rel)}</b></div><div><em>Fun</em><b>${stars(c.fun)}</b></div></div>
   ${I.fair?`<div class="note good">📱 <b>Fair price check:</b> cars like this sell for about <b>${fmt(Math.round(c.floor*1.01/100)*100)} – ${fmt(Math.round(c.floor*1.07/100)*100)}</b>. The sticker is the opening bid, not the price.</div>`:''}
   ${I.inspected?(c.issue&&I.found?`<div class="note bad">🔧 <b>Mike found a problem:</b> ${c.issue.what}. Fixing it costs about <b>${fmt(c.issue.cost)}</b>. Use that when you negotiate.</div>`:`<div class="note good">🔧 <b>Mike's inspection:</b> No major problems found.</div>`):''}
   ${I.noticed&&c.issue&&c.issue.tell?`<div class="note bad">👀 <b>On the test drive:</b> ${c.issue.tell}</div>`:''}
   ${c.asis?'<div class="note bad">⚠️ <b>Sold as-is.</b> If it breaks the day after you buy it, that\'s on you.</div>':''}
   <div class="est"><div class="eyebrow" style="margin-bottom:6px">Rough monthly cost</div>
    <div class="row"><span>Loan payment <small>(60 mo, ${fmt(1500)} down)</small></span><span>${fmt(estPay)}</span></div>
    <div class="row"><span>Insurance <small>(age 18${c.ins<150?', full coverage':''})</small></span><span>${fmt(ins)}</span></div>
    <div class="row"><span>${c.fuel==='electric'?'Charging':'Gas'} <small>(${YOU.milesMonth} mi)</small></span><span>${fmt(fuel)}</span></div>
    <div class="row"><span>Upkeep &amp; repairs</span><span>${fmt(c.maint)}</span></div>
    <div class="row tot"><span>All in</span><span style="color:${tot<=YOU.takeHome*GOOD_PCT?'var(--green)':'var(--red)'}">${fmt(tot)}/mo</span></div></div>
   <div class="acts">
    <button class="btn pri" data-a="drive"><span>🚗 Test drive</span><small>Free</small></button>
    ${c.used?`<button class="btn" data-a="inspect" ${I.inspected?'disabled':''}><span>🔧 Pre-purchase inspection</span><small>${I.inspected?'Done':fmt(INSPECT_FEE)}</small></button>`:'<button class="btn" disabled><span>🔧 Inspection</span><small>New, under warranty</small></button>'}
    <button class="btn" data-a="fair" ${I.fair?'disabled':''}><span>📱 Check the fair price</span><small>${I.fair?'Done':'Free app'}</small></button>
    <button class="btn gold" data-a="deal"><span>🤝 Talk numbers with Slick</span><small>Negotiate</small></button>
   </div>`;
  card.querySelector('[data-a=drive]').onclick=()=>startDrive(id);
  const ins_=card.querySelector('[data-a=inspect]'); if(ins_) ins_.onclick=()=>inspect(id);
  card.querySelector('[data-a=fair]').onclick=()=>{ I.fair=true; sfx.tick(); note('The sticker price is just the opening offer. A fair-price app shows what similar cars actually sell for.'); openCard(id); advise('Free research is the best deal on the lot. Now you know what this car is <b>actually</b> worth.'); };
  card.querySelector('[data-a=deal]').onclick=()=>negotiate(id);
  if(!I.seen){ I.seen=true; if(c.id==='rattler') advise('Cheapest car on the lot, but it\'s sold <b>as-is</b>. An inspection costs '+fmt(INSPECT_FEE)+' and can save you thousands.'); else if(c.id==='thunder') advise('Fun! But check that <b>insurance</b> line. Insurers charge 18-year-olds a lot more for fast cars.'); else if(c.id==='titan') advise('Look at that all-in monthly cost next to your budget. A dream car can eat your whole paycheck.'); else if(c.id==='nova') advise('New cars come with a warranty, but they lose around <b>20% of their value</b> in the first year.'); }
}
function closeCard(){ $('#card').hidden=true; G.cardId=null; G.near=null; }
function inspect(id){ const c=carById(id), I=info(id); if(G.cash<INSPECT_FEE) return toast('Not enough cash.','bad'); G.cash-=INSPECT_FEE; I.inspected=true; I.found=!!(c.issue && Math.random()<Math.min(1,c.issue.p+.25)); G.spentResearch=(G.spentResearch||0)+INSPECT_FEE; hud(); sfx.cash();
  rigPlay(G.mech,'UpPoint',true); note('A '+fmt(INSPECT_FEE)+' pre-purchase inspection can uncover repairs that cost thousands. It also gives you a reason to ask for a lower price.'); openCard(id);
  advise(I.found?'Mike found something. That repair estimate is <b>leverage</b>. Bring it up when you negotiate.':'Clean bill of health. Now you can buy with confidence.'); }
function creditUnion(){ const c=modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">BotBank Credit Union</div><h2>Get pre-approved before you shop</h2>
  <p>A credit union is owned by its members, so loans usually cost less than dealer financing. With a <b>${YOU.credit}</b> credit score and a steady job, here's what we can offer:</p>
  <div class="specs"><div><em>Used car APR</em><b>${(RATES.cu.used*100).toFixed(1)}%</b></div><div><em>New car APR</em><b>${(RATES.cu.new*100).toFixed(1)}%</b></div><div><em>Dealer's usual rate</em><b>${(RATES.dealer.used*100).toFixed(1)}% / ${(RATES.dealer.new*100).toFixed(1)}%</b></div><div><em>Max term</em><b>60 months</b></div></div>
  <div class="lesson">Walking into a dealership already approved means the salesperson can't hide extra profit in your interest rate.</div>
  <div class="mact"><button class="btn" onclick="closeModal()">Maybe later</button><button class="btn pri" id="cuYes" ${G.preapproved?'disabled':''}>${G.preapproved?'You\'re pre-approved ✓':'Get pre-approved (free)'}</button></div>`);
  const b=c.querySelector('#cuYes'); if(b) b.onclick=()=>{ G.preapproved=true; sfx.good(); hud(); rigPlay(G.cuBot,'TwistJump',true); note('Credit union pre-approval: '+(RATES.cu.used*100).toFixed(1)+'% APR used, '+(RATES.cu.new*100).toFixed(1)+'% new, vs the dealer\'s '+(RATES.dealer.used*100).toFixed(1)+'% / '+(RATES.dealer.new*100).toFixed(1)+'%.'); closeModal(); toast('✓ Pre-approved at BotBank Credit Union','good'); }; }
function mechanic(){ modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">Mike's Garage</div><h2>"Bring me any used car first."</h2><p>For ${fmt(INSPECT_FEE)} I'll put it on the lift and tell you what's wrong before you buy it. Open a used car's card and pick <b>Pre-purchase inspection</b>.</p><div class="lesson">Dealers aren't required to tell you everything. An independent mechanic works for you, not for the seller.</div><div class="mact"><button class="btn pri" onclick="closeModal()">Got it</button></div>`); rigPlay(G.mech,'RightHand',true); }

/* ---------- test drive ---------- */
const CPS=[60,160,250,345];
function startDrive(id){ closeCard(); const c=carById(id); fade(()=>{
  G.mode='drive'; document.body.classList.add('driving'); $('#dhud').hidden=false; $('#pads').hidden=!MOBILE; $('#prompt').hidden=true;
  const car=W.lotCars.get(id); car.visible=false; const g=makeCar(c); scene.add(g);
  G.drive={id, c, g, x:0, z:LOT.z1-2, h:0, v:0, t:0, cp:0, bumps:0, cones:0, top:0, speedT:0, ticket:false, told:false, steer:0, lastS:0, laps:0};
  g.position.set(G.drive.x,0,G.drive.z); spawnCones(); spawnTraffic(); [G.you.root,G.slick.root,G.mb.root].forEach(o=>o.visible=false);
  engineOn(true); slick('Buckle up! Out the gate, take a right, and follow the arches around the block.',5000); }); }
function spawnCones(){ W.cones.forEach(c=>scene.remove(c.m)); W.cones=[]; const cm=mat('#F97316',{roughness:.6});
  for(let i=0;i<8;i++){ const s=262+i*7, p=loopAt(s), side=(i%2?1:-1)*1.6; const m=new THREE.Group(); const cn=new THREE.Mesh(new THREE.ConeGeometry(.28,.7,12),cm); cn.position.y=.35; cn.castShadow=true; m.add(cn); bx(m,.6,.05,.6,0,0,0,mat('#111827'),false); m.position.set(p.x-p.dz*side,0,p.z+p.dx*side); scene.add(m); W.cones.push({m,vx:0,vy:0,vz:0,hit:false}); } }
function spawnTraffic(){ W.traffic.forEach(t=>scene.remove(t.g)); W.traffic=[]; ['#F59E0B','#22C55E','#A855F7'].forEach((col,i)=>{ const g=makeCar({id:'t'+i, style:pick(['sedan','hatch','ev']), color:col}); scene.add(g); W.traffic.push({g, s:90+i*110, v:10+i*1.5}); }); }
function arches(){ if(W.arch) return; W.arch=CPS.map((s,i)=>{ const p=loopAt(s), g=new THREE.Group(); const m=mat(i===CPS.length-1?'#FBBF24':'#00E676',{emissive:i===CPS.length-1?'#FBBF24':'#00E676',emissiveIntensity:.6}); [-1,1].forEach(sd=>bx(g,.3,4,.3,sd*(ROAD.w/2-.4),0,0,m)); bx(g,ROAD.w-.4,.4,.3,0,4,0,m); g.position.set(p.x,0,p.z); g.rotation.y=Math.atan2(p.dx,p.dz); scene.add(g); return g; }); }
function driveTick(dt){ const D=G.drive; if(!D) return; arches(); D.t+=dt; const c=D.c, sp=c.drive, k=G.keys, P=G.pad;
  const gas=(k.has('w')||k.has('arrowup')||P.gas)?1:0, brk=(k.has('s')||k.has('arrowdown')||P.brake)?1:0, st=((k.has('a')||k.has('arrowleft')||P.left)?1:0)-((k.has('d')||k.has('arrowright')||P.right)?1:0);
  if(gas) D.v+=sp.acc*dt*(1-Math.max(0,D.v)/sp.top); if(brk) D.v-= (D.v>0?16:6)*dt; D.v-=D.v*.12*dt+(gas||brk?0:Math.sign(D.v)*1.2*dt); D.v=clamp(D.v,-6,sp.top);
  D.steer+=(st-D.steer)*Math.min(1,dt*8); const turn=D.steer*1.9*sp.grip*Math.min(1,Math.abs(D.v)/5)*(1-.3*Math.abs(D.v)/sp.top)*Math.sign(D.v||1);
  D.h+=turn*dt; if(sp.wobble && gas && D.v>4){ D.h+=(Math.random()-.5)*sp.wobble*dt*1.6; }
  if(c.id==='commuter' && brk && D.v>6){ D.h+=.25*dt; if(Math.random()<dt*3) tone(2400,.15,'sine',.012); }
  const nx=D.x+Math.sin(D.h)*D.v*dt, nz=D.z+Math.cos(D.h)*D.v*dt;
  if(onRoad(nx,nz)||onLot(nx,nz)){ D.x=nx; D.z=nz; } else { D.v*=-.25; D.bumps++; sfx.thud(); shake=.35; if(Math.random()<.4) slick(pick(['Whoa! Easy on my car!','That\'s gonna leave a mark. Heh.','Curb! CURB!'])); }
  /* traffic */
  W.traffic.forEach(t=>{ t.s=(t.s+t.v*dt)%LOOP.len; const p=loopAt(t.s); const lane=2.6; t.g.position.set(p.x-p.dz*lane*-1,0,p.z+p.dx*lane*-1); t.g.rotation.y=Math.atan2(p.dx,p.dz); t.g.userData.wheels.forEach(w=>w.children[0].rotation.y+=t.v*dt);
    if(Math.hypot(t.g.position.x-D.x,t.g.position.z-D.z)<2.4 && !t.cool){ t.cool=1.2; D.v*=.2; D.bumps++; sfx.thud(); shake=.5; slick('You hit someone! That\'s how insurance rates go UP.'); } if(t.cool) t.cool=Math.max(0,t.cool-dt); });
  /* cones */
  W.cones.forEach(o=>{ if(!o.hit && Math.hypot(o.m.position.x-D.x,o.m.position.z-D.z)<1.2){ o.hit=true; D.cones++; o.vx=Math.sin(D.h)*D.v*.6+rand(-2,2); o.vz=Math.cos(D.h)*D.v*.6+rand(-2,2); o.vy=4; tone(320,.08,'square',.03); } if(o.hit){ o.vy-=12*dt; o.m.position.x+=o.vx*dt; o.m.position.z+=o.vz*dt; o.m.position.y=Math.max(0,o.m.position.y+o.vy*dt); o.m.rotation.x+=dt*6; if(o.m.position.y===0){ o.vx*=.9; o.vz*=.9; } } });
  /* checkpoints + finish */
  const n=nearestOnLoop(D.x,D.z); if(n.d<ROAD.w){ if(D.cp<CPS.length && Math.abs(n.s-CPS[D.cp])<6){ D.cp++; sfx.good(); W.arch[D.cp-1].visible=false; if(D.cp===2) slick(pick(SLICK.drive)); if(D.cp===CPS.length) slick('Bring her back into the lot and we\'ll talk numbers!'); } }
  if(D.cp>=CPS.length && onLot(D.x,D.z) && D.z<LOT.z1-1) return endDrive(true);
  /* speed, speed camera, issue tell */
  const mph=Math.abs(D.v)*2.237; D.top=Math.max(D.top,mph); if(mph>45){ D.speedT+=dt; } if(!D.ticket && mph>45 && Math.hypot(D.x-W.speedCam.x, D.z-W.speedCam.z)<9){ D.ticket=true; $('#flash').style.opacity=.85; setTimeout(()=>$('#flash').style.opacity=0,120); toast('📸 Speed camera! A ticket is coming in the mail.','bad'); slick('Ha! Hope you like paying tickets.'); }
  if(!D.told && c.issue && c.issue.tell && D.t>14 && gas && D.v>8){ D.told=true; info(c.id).noticed=true; toast('👀 You notice: '+c.issue.tell,'bad'); advise('Did you feel that? <b>'+c.issue.tell+'</b> A test drive is your first inspection.'); note('Test drives can reveal problems: '+c.name+': '+c.issue.tell); }
  if(D.t%18<dt) slick(pick(SLICK.drive));
  /* car + camera */
  const g=D.g; g.position.set(D.x,0,D.z); g.rotation.y=D.h; g.userData.wheels.forEach((w,i)=>{ w.children.forEach(m=>m.rotation.y+=D.v*dt/g.userData.r); if(i<2) w.rotation.y=D.steer*.4; }); g.children[0].rotation.z=-D.steer*Math.min(1,Math.abs(D.v)/20)*.04;
  const fx=Math.sin(D.h), fz=Math.cos(D.h), back=7.5+Math.abs(D.v)*.06; const tx=D.x-fx*back, tz=D.z-fz*back; camera.position.x+=(tx-camera.position.x)*Math.min(1,dt*4); camera.position.z+=(tz-camera.position.z)*Math.min(1,dt*4); camera.position.y+=(3.2-camera.position.y)*Math.min(1,dt*4);
  if(shake>0){ camera.position.x+=(Math.random()-.5)*shake; camera.position.y+=(Math.random()-.5)*shake*.5; shake=Math.max(0,shake-dt*1.5); } if(sp.wobble && gas && D.v>4) camera.position.y+=(Math.random()-.5)*sp.wobble*.05;
  camera.lookAt(D.x+fx*4,1,D.z+fz*4); sun.position.set(D.x+30,50,D.z+25); sun.target.position.set(D.x,0,D.z);
  if(eng){ eng.o.frequency.value=55+Math.abs(D.v)*4.2*(c.fuel==='electric'?2.2:1)+(gas?10:0); eng.g.gain.value=c.fuel==='electric'?.012:.03+gas*.015; eng.f.frequency.value=c.fuel==='electric'?1800:420+Math.abs(D.v)*14; }
  $('#dMph').textContent=Math.round(mph); $('#dMph').parentElement.classList.toggle('fast',mph>45); $('#dCp').textContent=D.cp+'/'+CPS.length; $('#dTime').textContent=Math.floor(D.t/60)+':'+String(Math.floor(D.t%60)).padStart(2,'0'); $('#dBump').textContent=D.bumps+D.cones;
}
let shake=0;
$('#btnEndDrive').onclick=()=>endDrive(false);
function endDrive(done){ const D=G.drive; if(!D) return; engineOn(false); G.drive=null; info(D.id).drove=true; G.drove=(G.drove||0)+1;
  G.habits={bumps:(G.habits?G.habits.bumps:0)+D.bumps+D.cones, ticket:(G.habits&&G.habits.ticket)||D.ticket, speedT:((G.habits&&G.habits.speedT)||0)+D.speedT};
  fade(()=>{ scene.remove(D.g); W.lotCars.get(D.id).visible=true; W.traffic.forEach(t=>scene.remove(t.g)); W.traffic=[]; W.cones.forEach(c=>scene.remove(c.m)); W.cones=[]; if(W.arch){ W.arch.forEach(a=>scene.remove(a)); W.arch=null; }
    [G.you.root,G.slick.root,G.mb.root].forEach(o=>o.visible=true); const sp=W.lotCars.get(D.id).position; G.you.root.position.set(sp.x, 0, sp.z+(sp.z<0?3.2:-3.2)); startLot(false);
    const c=D.c; modal(`<div class="eyebrow">Test drive · ${c.name}</div><h2>${done?'Back on the lot':'Test drive over'}</h2>
     <div class="specs"><div><em>Top speed</em><b>${Math.round(D.top)} mph</b></div><div><em>Time</em><b>${Math.floor(D.t/60)}:${String(Math.floor(D.t%60)).padStart(2,'0')}</b></div><div><em>Bumps &amp; cones</em><b>${D.bumps+D.cones}</b></div><div><em>Speed camera</em><b>${D.ticket?'📸 Flashed':'Clean'}</b></div></div>
     ${info(c.id).noticed&&c.issue?`<div class="note bad">👀 You noticed: ${c.issue.tell}</div>`:''}
     ${D.ticket||D.bumps>2?'<div class="lesson">How you drive is part of what a car costs. Tickets and accidents raise your insurance for years.</div>':'<div class="lesson">Fun matters too. Just make sure the car still fits your budget once the excitement wears off.</div>'}
     <div class="mact"><button class="btn" id="tdBack">Keep shopping</button><button class="btn gold" id="tdDeal">Talk numbers on this car</button></div>`);
    $('#tdBack').onclick=()=>{ closeModal(); openCard(c.id); }; $('#tdDeal').onclick=()=>{ closeModal(); negotiate(c.id); }; }); }

/* ---------- negotiation ---------- */
function negotiate(id){ closeCard(); const c=carById(id), I=info(id); const N=G.neg={id, c, ask:c.price, offer:Math.round(c.price*.85/100)*100, patience:100, hist:[], used:{}, done:false, final:false, walked:0};
  [G.you.root.position.set(3.2,0,-19.6), G.slick.root.position.set(4.6,0,-23.6)]; G.you.root.rotation.y=Math.PI; G.slick.root.rotation.y=0; G.mode='office';
  renderNeg(); slick(pick(['Great choice! Let\'s make a deal.','I can tell you\'re serious. Let\'s talk.'])); }
function renderNeg(){ const N=G.neg, c=N.c, I=info(c.id), fairLo=Math.round(c.floor*1.01/100)*100;
  const m=modal(`<button class="x" id="negX">×</button><div class="eyebrow">Slick's desk · ${c.year} ${c.name}</div><h2>Let's make a deal</h2>
   <div class="neg"><div>
     <div class="bigrow"><span>Slick's price</span><b>${fmt(N.ask)}</b></div>
     ${c.markup&&!N.used.markup?`<div class="bigrow bad"><span>includes "market adjustment"</span><b>${fmt(c.markup)}</b></div>`:''}
     ${I.fair?`<div class="bigrow ok"><span>Fair price (your research)</span><b>${fmt(fairLo)}+</b></div>`:''}
     <div style="margin:14px 0 4px;color:var(--txt3);font-size:13px">Your offer</div><div class="offer" id="offV">${fmt(N.offer)}</div>
     <input type="range" id="offR" min="${Math.round(c.price*.55/100)*100}" max="${N.ask}" step="100" value="${Math.min(N.offer,N.ask)}">
     <div class="mact" style="justify-content:flex-start"><button class="btn pri" id="offGo" ${N.done?'disabled':''}>Make offer</button><button class="btn" id="offAcc" ${N.done?'disabled':''}>Accept ${fmt(N.ask)}</button><button class="btn danger" id="offWalk" ${N.done?'disabled':''}>Walk away</button></div>
     <div class="lever">${c.markup&&!N.used.markup?'<button class="btn sm" data-l="markup">"I\'m not paying a market adjustment."</button>':''}
      ${I.inspected&&I.found&&!N.used.repair?'<button class="btn sm" data-l="repair">"Your car needs '+fmt(c.issue.cost)+' of repairs. Mike checked it."</button>':''}
      ${!I.inspected&&I.noticed&&!N.used.notice?'<button class="btn sm" data-l="notice">"I noticed a problem on the test drive."</button>':''}
      ${I.fair&&!N.used.fair?'<button class="btn sm" data-l="fair">"Similar cars sell for '+fmt(fairLo)+'."</button>':''}
      ${G.preapproved&&!N.used.pre?'<button class="btn sm" data-l="pre">"I already have financing from my credit union."</button>':''}</div>
   </div><div>
     <div style="font-size:13px;color:var(--txt3)">Slick's patience</div><div class="pbar"><i style="width:${N.patience}%"></i></div>
     <ul class="hist">${N.hist.map(h=>'<li>'+h+'</li>').join('')||'<li>Slick leans back and smiles. "So, what are you thinking?"</li>'}</ul>
     <div class="lesson">Tip: the first price is the seller's wish, not the rule. Make an offer below what you're willing to pay, and be ready to walk away.</div>
   </div></div>`, true);
  G.modalClose=()=>leaveOffice();
  const R=m.querySelector('#offR'); R.oninput=()=>{ N.offer=+R.value; m.querySelector('#offV').textContent=fmt(N.offer); };
  m.querySelector('#negX').onclick=leaveOffice;
  m.querySelector('#offGo').onclick=()=>makeOffer(N.offer); m.querySelector('#offAcc').onclick=()=>closeDeal(N.ask); m.querySelector('#offWalk').onclick=walkAway;
  m.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>lever(b.dataset.l)); }
function lever(k){ const N=G.neg, c=N.c; N.used[k]=1; let drop=0, line='';
  if(k==='markup'){ drop=c.markup; line='Fine, fine. I\'ll take off the market adjustment.'; note('Dealer "market adjustments" are extra profit. You can refuse to pay them.'); }
  if(k==='repair'){ drop=Math.round(c.issue.cost*.6/100)*100; line='A mechanic? Ugh. Okay, I\'ll knock off '+fmt(drop)+'.'; note('An inspection report is negotiation power. Repairs the seller should fix come off the price.'); }
  if(k==='notice'){ drop=Math.round((c.issue?c.issue.cost:300)*.25/100)*100; line='Eh, that\'s normal for this model. But okay, '+fmt(drop)+' off.'; }
  if(k==='fair'){ drop=Math.max(0,Math.round((N.ask-c.floor*1.06)/100)*100); line=drop?'You did your homework. I can come down to '+fmt(N.ask-drop)+'.':'My price is already fair, friend!'; note('Knowing the fair price stops you from overpaying.'); }
  if(k==='pre'){ line='Pre-approved, huh? We can still try to beat that rate.'; N.pre=true; }
  N.ask=Math.max(c.floor, N.ask-drop); N.hist.unshift('<b>Slick:</b> '+line); sfx.tick(); slick(line); renderNeg(); }
function makeOffer(o){ const N=G.neg, c=N.c; N.hist.unshift('<b>You:</b> '+fmt(o));
  if(o>=N.ask){ return closeDeal(N.ask); }
  N.patience-= o<c.floor*.88?28:12;
  if(o>=c.floor && (o>=N.ask*.985 || N.patience<40 && Math.random()<.7)){ N.hist.unshift('<b>Slick:</b> '+pick(SLICK.accept)); slick(pick(SLICK.accept)); return closeDeal(o); }
  if(N.patience<=0){ N.final=true; const L=pick(SLICK.final); N.hist.unshift('<b>Slick:</b> '+L+' '+fmt(N.ask)); slick(L); sfx.bad(); N.patience=0; return renderNeg(); }
  if(o<c.floor*.88){ const L=pick(SLICK.lowball); N.hist.unshift('<b>Slick:</b> '+L); slick(L); sfx.bad(); return renderNeg(); }
  const counter=Math.max(c.floor, Math.round((N.ask-(N.ask-o)*rand(.3,.48))/50)*50); N.ask=counter; const L=pick(SLICK.counter).replace('{p}',fmt(counter)); N.hist.unshift('<b>Slick:</b> '+L); slick(L); sfx.tick(); renderNeg(); }
function walkAway(){ const N=G.neg, c=N.c; N.walked++;
  const lastOffer=N.hist.find(h=>h.startsWith('<b>You:</b>')); const o=lastOffer?+lastOffer.replace(/[^0-9]/g,''):0;
  if(o && N.walked<=2 && Math.random()<.8){ const p=Math.max(c.floor, Math.round((N.ask+o)/2/50)*50); N.ask=p; N.patience=Math.max(N.patience,35); const L=pick(SLICK.walk)+' I can do '+fmt(p)+'.'; N.hist.unshift('<b>Slick:</b> '+L); slick(L,5000); sfx.good(); note('Being willing to walk away is your strongest negotiating move.'); return renderNeg(); }
  leaveOffice(); toast('You walked away. You can always come back.'); }
function leaveOffice(){ closeModal(); G.modalClose=null; G.neg=null; G.you.root.position.set(0,0,-11); G.mode='lot'; }
function closeDeal(price){ const N=G.neg; N.done=true; sfx.good(); rigPlay(G.slick,'TwistJump',true);
  G.deal={id:N.c.id, c:N.c, price, saved:N.c.price-price}; if(G.deal.saved>0) note('You negotiated '+fmt(G.deal.saved)+' off the sticker price.'); addons(); }

/* ---------- add-ons ---------- */
function addons(){ const D=G.deal, list=ADDONS.filter(a=>!a.usedOnly||D.c.used&&!D.c.asis); D.add=D.add||{}; list.forEach(a=>{ if(D.add[a.id]==null) D.add[a.id]=true; });
  const m=modal(`<div class="eyebrow">Deal at ${fmt(D.price)} · the "finance office"</div><h2>Slick added a few things…</h2><p>"Every smart buyer gets these. They're already on the paperwork, just sign here!" Uncheck anything you don't want. Tap <b>Why?</b> to hear what MoneyBot thinks.</p>
   ${list.map(a=>`<label class="addon"><input type="checkbox" data-ad="${a.id}" ${D.add[a.id]?'checked':''}><div><b>${a.name}</b> · ${fmt(a.price)} <button class="btn sm" type="button" data-why="${a.id}" style="margin-left:6px">Why?</button><div class="why" id="why_${a.id}">Slick: "${a.id==='warranty'?'Peace of mind! Breakdowns are expensive!':a.id==='paint'?'Keeps that shine forever!':a.id==='etch'?'Thieves hate this one trick!':'Smoother ride, better mileage!'}"</div></div></label>`).join('')}
   <div class="bigrow"><span>Add-ons total</span><b id="adT"></b></div>
   <div class="mact"><button class="btn pri" id="adGo">Continue to financing</button></div>`, true);
  const sum=()=>{ const t=list.reduce((s,a)=>s+(D.add[a.id]?a.price:0),0); m.querySelector('#adT').textContent=fmt(t); return t; }; sum();
  m.querySelectorAll('[data-ad]').forEach(i=>i.onchange=()=>{ D.add[i.dataset.ad]=i.checked; sum(); if(!i.checked) sfx.tick(); });
  m.querySelectorAll('[data-why]').forEach(b=>b.onclick=e=>{ e.preventDefault(); const a=ADDONS.find(x=>x.id===b.dataset.why), w=m.querySelector('#why_'+a.id); w.innerHTML='<b>MoneyBot:</b> '+a.real; w.classList.add('show'); });
  m.querySelector('#adGo').onclick=()=>{ D.addTotal=sum(); D.addList=list.filter(a=>D.add[a.id]).map(a=>a.id); if(!D.addList.length) note('Dealer add-ons are mostly profit. Saying no is allowed.'); finance(); }; G.modalClose=null; }

/* ---------- finance office ---------- */
function finance(){ const D=G.deal, c=D.c; const kind=c.used?'used':'new';
  D.method=D.method||(c.lease?'lease':'dealer'); D.term=D.term||84; D.down=D.down!=null?D.down:Math.min(1000,G.cash);
  const base=D.price+D.addTotal, tax=base*TAX, fees=DOC_FEE+TITLE_FEE, total=base+tax+fees;
  const canCash=G.cash>=total;
  const m=modal(`<div class="eyebrow">Paying for the ${c.name}</div><h2>How will you pay?</h2>
   <div class="neg"><div>
    <div class="pay">
     <label class="${canCash?'':'dis'}"><input type="radio" name="pm" value="cash" ${D.method==='cash'?'checked':''} ${canCash?'':'disabled'}> <div><b>Pay cash</b><br><small>No loan, no interest${canCash?'':' · you need '+fmt(total)}</small></div></label>
     <label><input type="radio" name="pm" value="dealer" ${D.method==='dealer'?'checked':''}> <div><b>Dealer loan</b> · ${(RATES.dealer[kind]*100).toFixed(1)}% APR<br><small>Slick's financing partner</small></div></label>
     <label class="${G.preapproved?'':'dis'}"><input type="radio" name="pm" value="cu" ${D.method==='cu'?'checked':''} ${G.preapproved?'':'disabled'}> <div><b>Credit union loan</b> · ${(RATES.cu[kind]*100).toFixed(1)}% APR<br><small>${G.preapproved?'Your pre-approval':'Get pre-approved at the BotBank booth first'}</small></div></label>
     ${c.lease?`<label><input type="radio" name="pm" value="lease" ${D.method==='lease'?'checked':''}> <div><b>Lease</b> · ${fmt(c.lease.mo)}/mo for ${c.lease.months} months<br><small>${fmt(c.lease.due)} due at signing · ${c.lease.milesYr.toLocaleString()} miles a year · you don't own it</small></div></label>`:''}
    </div>
    <div id="loanBits"><div style="margin-top:12px;font-size:13px;color:var(--txt3)">Down payment: <b id="dnV"></b></div><input type="range" id="dnR" min="0" max="${Math.max(0,Math.floor(Math.min(G.cash,total)/100)*100)}" step="100" value="${D.down}">
    <div style="margin:10px 0 6px;font-size:13px;color:var(--txt3)">Loan length</div><div class="terms">${[36,48,60,72,84].map(t=>`<button data-t="${t}" class="${D.term===t?'on':''}">${t} mo</button>`).join('')}</div></div>
   </div><div id="fin"></div></div>
   <div class="mact"><button class="btn" id="finBack">Back</button><button class="btn pri" id="finSign">Sign the papers</button></div>`, true);
  const upd=()=>{ const r=calcDeal(); m.querySelector('#dnV').textContent=fmt(D.down); m.querySelector('#loanBits').style.display=(D.method==='cash'||D.method==='lease')?'none':'';
    m.querySelector('#fin').innerHTML=`<div class="bigrow"><span>Car + add-ons</span><b>${fmt(base)}</b></div><div class="bigrow"><span>Sales tax (6%) + fees</span><b>${fmt(tax+fees)}</b></div>
     ${D.method==='lease'?`<div class="bigrow"><span>Due today</span><b>${fmt(r.upfront)}</b></div>`:D.method==='cash'?`<div class="bigrow"><span>Paid today</span><b>${fmt(r.upfront)}</b></div>`:`<div class="bigrow"><span>Amount borrowed</span><b>${fmt(r.loan)}</b></div><div class="bigrow"><span>Interest over ${D.term} months</span><b style="color:var(--red)">${fmt(r.interest)}</b></div>`}
     <div class="bigrow"><span>${D.method==='lease'?'Lease payment':'Monthly payment'}</span><b>${fmt(r.pay)}</b></div>
     <div class="bigrow"><span>Insurance${r.full?' (full coverage required)':''}</span><b>${fmt(r.ins)}</b></div>
     <div class="bigrow"><span>${c.fuel==='electric'?'Charging':'Gas'} + upkeep</span><b>${fmt(r.run)}</b></div>
     <div class="bigrow ${r.all<=YOU.takeHome*GOOD_PCT?'ok':'bad'}"><span><b>All-in per month</b> (budget ${fmt(YOU.takeHome*GOOD_PCT)})</span><b>${fmt(r.all)}</b></div>
     <div class="bigrow"><span>Savings left after today</span><b style="color:${G.cash-r.upfront<1000?'var(--red)':'var(--green)'}">${fmt(G.cash-r.upfront)}</b></div>
     ${D.method==='dealer'&&D.term>=72?'<div class="lesson">Slick picked a long loan to make the payment look small. A longer loan means more interest, and you can owe more than the car is worth.</div>':''}
     ${G.cash-r.upfront<1000?'<div class="lesson">Keep some savings for emergencies. If you spend it all on the car, the first repair goes on a credit card.</div>':''}`; };
  if(!D.slickTerm){ D.slickTerm=1; slick(SLICK.monthly[0],5000); }
  m.querySelectorAll('[name=pm]').forEach(i=>i.onchange=()=>{ D.method=i.value; upd(); });
  m.querySelector('#dnR').oninput=e=>{ D.down=+e.target.value; upd(); };
  m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ D.term=+b.dataset.t; m.querySelectorAll('[data-t]').forEach(x=>x.classList.toggle('on',x===b)); upd(); });
  m.querySelector('#finBack').onclick=addons; m.querySelector('#finSign').onclick=()=>{ const r=calcDeal(); if(r.upfront>G.cash) return toast('Not enough savings for that.','bad'); D.r=r; signPapers(); }; upd(); }
function calcDeal(){ const D=G.deal, c=D.c, kind=c.used?'used':'new', base=D.price+D.addTotal, total=base+base*TAX+DOC_FEE+TITLE_FEE;
  let upfront=0, loan=0, pay=0, interest=0, apr=0, n=0;
  if(D.method==='cash'){ upfront=total; }
  else if(D.method==='lease'){ upfront=c.lease.due; pay=c.lease.mo*(1+TAX); n=c.lease.months; }
  else { apr=D.method==='cu'?RATES.cu[kind]:RATES.dealer[kind]; n=D.method==='cu'?Math.min(D.term,60):D.term; upfront=D.down; loan=Math.max(0,total-D.down); pay=pmt(loan,apr,n); interest=pay*n-loan; }
  const full=D.method!=='cash' || c.ins>=150, ins=c.ins+(c.ins<150&&full?70:0), run=monthlyFuel(c)+c.maint;
  return {upfront, loan, pay, interest, apr, n, ins, full, run, all:pay+ins+run, total}; }
function signPapers(){ const D=G.deal; G.cash-=D.r.upfront; hud(); sfx.cash(); rigPlay(G.you,'TwistJump',true);
  if(D.method==='cu') note('Your credit union loan saved interest compared with dealer financing.');
  modal(`<div class="eyebrow">Keys in hand</div><h2>The ${D.c.name} is yours${D.method==='lease'?' (for 3 years)':''}!</h2><p>Now for the part dealerships don't show you: <b>owning</b> it. Let's fast-forward through your first year: payments, insurance, gas, repairs, and whatever life throws at you.</p><div class="mact"><button class="btn pri big" id="goYear">Fast-forward 12 months</button></div>`);
  $('#goYear').onclick=yearOne; }

/* ---------- year one ---------- */
function yearOne(){ const D=G.deal, c=D.c, r=D.r; let save=G.cash, cc=0, carSpent=r.upfront, extra=0, joy=c.fun, months=[], insUp=0, gasMul=1, issueHit=false, warrantyPaid=0;
  const covered=c.warranty || (D.addList||[]).includes('warranty') && !c.asis;
  const hitMonth=c.issue && Math.random()<c.issue.p ? Math.floor(rand(c.issue.from,c.issue.to+1)) : -1;
  const ticketMonth=G.habits&&G.habits.ticket?Math.floor(rand(1,4)):-1, fenderMonth=G.habits&&G.habits.bumps>=4&&Math.random()<.55?Math.floor(rand(4,11)):-1;
  for(let mo=1;mo<=12;mo++){ let cost=r.pay+r.ins+insUp+c.maint*rand(.6,1.4)+monthlyFuel(c)*gasMul, evs=[]; gasMul=1;
    if(mo===hitMonth){ issueHit=true; if(covered){ evs.push({t:'🔧 '+c.issue.what+' · covered by warranty',good:1}); warrantyPaid+=c.issue.cost; } else { cost+=c.issue.cost; evs.push({t:'🔧 '+c.issue.what+' · '+fmt(c.issue.cost)}); joy--; } }
    if(mo===ticketMonth){ cost+=150; insUp=25; evs.push({t:'📸 Speeding ticket · '+fmt(150)+', insurance +'+fmt(25)+'/mo'}); }
    if(mo===fenderMonth){ cost+=500; evs.push({t:'💥 Fender bender · '+fmt(500)+' deductible'}); }
    EVENTS.filter(e=>e.p).forEach(e=>{ if(Math.random()<e.p){ if(e.gas){ gasMul=e.gas; evs.push({t:'⛽ '+e.what}); } else { cost+=e.cost; evs.push({t:(e.joy?'✨ ':'🛞 ')+e.what+' · '+fmt(e.cost), good:e.joy}); } } });
    carSpent+=cost; const left=YOU.takeHome-YOU.living-cost; save+=left; if(save<0){ cc+=-save; save=0; } if(cc>0){ cc*=1.02; const payBack=Math.min(cc,Math.max(0,save-300)); cc-=payBack; save-=payBack; }
    months.push({mo, cost, evs, save, cc}); }
  const value=Math.round(D.price*(1-c.dep)), months12=D.method==='lease'?0:12, bal=D.method==='lease'||D.method==='cash'?0:loanBalance(r.loan,r.apr,r.n,months12), equity=D.method==='lease'?0:value-bal;
  const avg=(carSpent-r.upfront)/12, pct=avg/YOU.takeHome, interest12=D.method==='dealer'||D.method==='cu'?interestPaid(r.loan,r.apr,r.n,12):0;
  const Y=G.year={months, save, cc, carSpent, avg, pct, value, bal, equity, interest12, issueHit, covered, warrantyPaid, joy};
  const mm=modal(`<div class="eyebrow">Year one with your ${c.name}</div><h2>Fast-forwarding…</h2><div class="months">${months.map(x=>`<div class="mo" id="mo${x.mo}"><b>${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][x.mo-1]}</b>${fmt(x.cost)} car costs${x.evs.map(e=>`<div class="${e.good?'gd':'ev'}">${e.t}</div>`).join('')}</div>`).join('')}</div><div class="bigrow"><span>Savings</span><b id="ySave">${fmt(G.cash)}</b></div><div class="mact"><button class="btn" id="ySkip">Skip</button></div>`, true);
  let i=0; const step=()=>{ if(i>=months.length) return report(); const x=months[i++]; const e=mm.querySelector('#mo'+x.mo); if(e) e.classList.add('on'); mm.querySelector('#ySave').textContent=fmt(x.save)+(x.cc>0?' · card debt '+fmt(x.cc):''); x.evs.length&&!x.evs[0].good?sfx.bad():sfx.tick(); G.yT=setTimeout(step, x.evs.length?1200:650); };
  mm.querySelector('#ySkip').onclick=()=>{ clearTimeout(G.yT); report(); }; G.yT=setTimeout(step,500); }
function loanBalance(P,apr,n,k){ if(!P) return 0; const r=apr/12, p=pmt(P,apr,n); let b=P; for(let i=0;i<k;i++){ b=b*(1+r)-p; } return Math.max(0,b); }
function interestPaid(P,apr,n,k){ if(!P) return 0; const r=apr/12, p=pmt(P,apr,n); let b=P, t=0; for(let i=0;i<k;i++){ const it=b*r; t+=it; b=b+it-p; } return t; }
function report(){ clearTimeout(G.yT); const D=G.deal, c=D.c, Y=G.year, I=info(c.id);
  let score=100; const pctOver=Math.max(0,Y.pct-GOOD_PCT); score-=pctOver*500; if(Y.cc>0) score-=12+Y.cc/150; if(Y.save<1000) score-=12; score-=(D.addList||[]).filter(a=>a!=='warranty').length*4; score-=Y.interest12/120; if(Y.equity<0) score-=8; if(c.issue&&Y.issueHit&&!Y.covered&&!I.inspected) score-=8;
  score+=(I.inspected||!c.used?4:0)+(I.fair?3:0)+(G.preapproved&&D.method==='cu'?5:0)+Math.min(8,(D.saved/c.price)*60)+c.fun*1.2; if(Y.pct>GOOD_PCT) score=Math.min(score,84); if(Y.cc>0) score=Math.min(score,74); score=clamp(Math.round(score),0,100);
  const grade=score>=93?'A+':score>=85?'A':score>=78?'B':score>=70?'C':score>=60?'D':'F', gc=grade[0]==='A'||grade==='B'?'':grade==='C'||grade==='D'?'c':'f';
  const B=[[I.inspected||!c.used,'Got it inspected'],[I.fair,'Checked the fair price'],[D.saved>0,'Negotiated '+(D.saved>0?fmt(D.saved)+' off':'')],[G.preapproved,'Got pre-approved'],[!(D.addList||[]).some(a=>a!=='warranty'),'Said no to junk add-ons'],[Y.pct<=GOOD_PCT,'Stayed under 15%'],[Y.cc===0,'No credit card debt']];
  const lessons=[]; if(Y.pct>GOOD_PCT) lessons.push('Your car took <b>'+Math.round(Y.pct*100)+'%</b> of your take-home pay. Over 15% squeezes everything else: savings, fun, emergencies.');
  if(Y.interest12>0) lessons.push('You paid <b>'+fmt(Y.interest12)+'</b> in interest this year'+(D.method==='dealer'&&G.preapproved?' at the dealer\'s rate, even though your credit union offered less':'')+'.');
  if(Y.equity<0) lessons.push('You owe <b>'+fmt(Y.bal)+'</b> but the car is only worth <b>'+fmt(Y.value)+'</b>. That\'s called being "underwater" on a loan.');
  if(Y.issueHit&&!Y.covered) lessons.push('The '+c.issue.what.toLowerCase()+' cost '+fmt(c.issue.cost)+'. '+(I.inspected?'At least you saw it coming.':'A '+fmt(INSPECT_FEE)+' inspection would have warned you.'));
  if(Y.cc>0) lessons.push('An emergency went on a credit card at 24% APR. Keeping an emergency fund avoids that.');
  if(D.method==='lease') lessons.push('Leasing gave you a new car with a lower payment, but after 3 years you own nothing and start over.');
  if(!lessons.length) lessons.push('You bought a car you can actually afford and still kept saving. That\'s rarer than it sounds.');
  modal(`<div class="eyebrow">Your first year · ${c.year} ${c.name}</div><div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap"><div class="grade ${gc}">${grade}</div><div><h2 style="margin:0">Car money report card</h2><p style="margin:4px 0 0">Score ${score}/100</p></div></div>
   <div class="specs" style="grid-template-columns:repeat(3,1fr)"><div><em>Spent on the car</em><b>${fmt(Y.carSpent)}</b></div><div><em>Average per month</em><b>${fmt(Y.avg)}</b></div><div><em>Savings now</em><b>${fmt(Y.save)}</b></div>
    <div><em>Car is worth</em><b>${D.method==='lease'?'Leased':fmt(Y.value)}</b></div><div><em>Still owed</em><b>${fmt(Y.bal)}</b></div><div><em>Card debt</em><b style="color:${Y.cc?'var(--red)':''}">${fmt(Y.cc)}</b></div></div>
   <div style="font-size:13px;color:var(--txt3)">Car costs as a share of take-home pay</div><div class="cmpbar"><i style="width:${Math.min(100,Y.pct*250)}%;background:${Y.pct<=GOOD_PCT?'var(--green)':'var(--red)'}"></i><em style="left:${GOOD_PCT*250}%"></em><span style="left:${GOOD_PCT*250}%">15% goal</span><span style="left:${Math.min(96,Y.pct*250)}%">${Math.round(Y.pct*100)}%</span></div>
   <div class="badges">${B.map(([ok,t])=>`<span class="${ok?'':'no'}">${ok?'✓':'✗'} ${t}</span>`).join('')}</div>
   ${lessons.map(l=>`<div class="lesson">${l}</div>`).join('')}
   <div class="mact"><button class="btn" id="rpNotes">📒 What I learned</button><button class="btn pri" id="rpAgain">Shop again with a different car</button></div>`, true);
  $('#hSave').textContent=fmt(Y.save); G.best=Math.max(G.best||0,score); $('#rpAgain').onclick=resetRun; $('#rpNotes').onclick=()=>$('#btnNotes').onclick(); }
function resetRun(){ closeModal(); G.cash=YOU.savings; G.deal=null; G.year=null; G.preapproved=false; G.habits=null; for(const k in G.known){ G.known[k].inspected=false; G.known[k].found=false; } G.you.root.position.set(0,0,10); hud(); startLot(false); advise('Same paycheck, same savings. Can you beat a score of <b>'+G.best+'</b>?'); }

/* ---------- main loop ---------- */
function loop(){ requestAnimationFrame(loop); const dt=Math.min(.05,clock.getDelta()); G.t+=dt; const t=G.t;
  W.anim.forEach(f=>f(t)); [G.you,G.slick,G.mech,G.cuBot,G.mb].forEach(r=>r&&r.mixer.update(dt));
  if(G.mode==='title'){ const a=t*.08; camera.position.set(Math.cos(a)*38,22,Math.sin(a)*38+4); camera.lookAt(0,0,0); }
  else if(G.mode==='lot') lotTick(dt);
  else if(G.mode==='drive') driveTick(dt);
  else if(G.mode==='office'){ camera.position.x+=(8.5-camera.position.x)*dt*3; camera.position.y+=(3.6-camera.position.y)*dt*3; camera.position.z+=(-17.6-camera.position.z)*dt*3; camera.lookAt(3.8,1.1,-22.5); }
  scene.traverseVisible?0:0; for(const g of W.lotCars.values()){ const tg=g.userData.tag; if(tg) tg.lookAt(camera.position.x, tg.position.y, camera.position.z); }
  renderer.render(scene,camera); }
boot().catch(e=>{ console.error(e); $('#btnStart').textContent='Could not load'; });
