/* ===================== BotMotors · plus: lives, living city, juice, choices ===================== */
const store={ get(k,d){ try{ const v=localStorage.getItem('bm_'+k); return v==null?d:JSON.parse(v); }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem('bm_'+k,JSON.stringify(v)); }catch(e){} } };
let PROFILE=PROFILES[0], PICK=PROFILES[0];
G.medals=store.get('medals',{}); G.fov=50;

/* ---------- three lives ---------- */
function applyProfile(p){ PROFILE=p; Object.assign(YOU,{name:p.name, age:p.age, job:p.job, takeHome:p.takeHome, gross:p.gross, living:p.living, savings:p.savings, credit:p.credit, milesMonth:p.milesMonth});
  const adj=(670-p.credit)*.0006; for(const k of ['dealer','cu']) for(const t of ['used','new']) RATES[k][t]=+(RATES0[k][t]+adj).toFixed(4);
  CARS.forEach(c=>c.ins=Math.round(c.ins0*p.insMul)); G.cash=YOU.savings; if(MB.you) MB.you.color.set(p.col); }
function toolCost(c){ return PROFILE.needsCargo && c.id!=='bus' && !c.cargo ? 45 : 0; }
function livesHTML(sel){ return PROFILES.map(p=>{ const b=store.get('best_'+p.id,0); return `<button class="life ${p.id===sel.id?'on':''}" data-life="${p.id}" type="button"><i style="background:${p.col}"></i><div><b>${p.name}, ${p.age}</b><span class="diff d${p.diff}">${p.diff}</span><small>${p.job}</small><small class="mono">${fmt(p.takeHome)}/mo take-home · ${fmt(p.savings)} saved · credit ${p.credit}</small><small>${p.need}</small>${b?`<small class="best">Best score ${b}</small>`:''}</div></button>`; }).join(''); }
function wireLives(root, onPick){ root.querySelectorAll('[data-life]').forEach(b=>b.onclick=()=>{ PICK=PROFILES.find(p=>p.id===b.dataset.life); root.querySelectorAll('[data-life]').forEach(x=>x.classList.toggle('on',x===b)); sfx.tick(); onPick&&onPick(); }); }
(function(){ const box=$('#lives'); if(box){ box.innerHTML=livesHTML(PICK); wireLives(box); } })();
function pickLife(){ clearConfetti(); const m=modal(`<div class="eyebrow">Same lot, different life</div><h2>Who are you this time?</h2><p>Each life has different pay, savings and needs, so the smart car changes too.</p><div class="lives">${livesHTML(PICK)}</div><div class="mact"><button class="btn pri" id="lifeGo">Start shopping</button></div>`, true);
  wireLives(m); m.querySelector('#lifeGo').onclick=()=>{ applyProfile(PICK); G.medals=store.get('medals',{}); resetRun(); }; }

/* ---------- bus stop: the no-car option ---------- */
function busStop(){ const run=70+40, ok=PROFILE.busOk;
  const m=modal(`<button class="x" onclick="closeModal()">×</button><div class="eyebrow">Route 7 · Bot City Transit</div><h2>Skip the car this year?</h2>
   <p>A monthly bus pass is <b>${fmt(70)}</b>. Add about <b>${fmt(40)}</b> of rideshares for late nights. No loan, no insurance, no repairs.</p>
   <div class="specs"><div><em>Monthly cost</em><b>${fmt(run)}</b></div><div><em>Your budget</em><b>${fmt(YOU.takeHome*GOOD_PCT)}</b></div><div><em>Your commute</em><b>${ok?'Same as driving':'+70 min each way'}</b></div><div><em>Fun</em><b>${stars(1)}</b></div></div>
   <div class="lesson">${ok?'Your classes and job are right on the bus line. The cheapest car is no car.':'The bus is cheap, but your job is far from the line. Late buses can cost you shifts. Time has a price too.'}</div>
   <div class="mact"><button class="btn" onclick="closeModal()">Keep shopping</button><button class="btn gold" id="busGo">Ride the bus for a year</button></div>`);
  m.querySelector('#busGo').onclick=()=>{ G.deal={id:'bus', c:BUS, price:0, saved:0, method:'bus', addList:[], addTotal:0, r:{upfront:0, loan:0, pay:0, interest:0, apr:0, n:0, ins:0, full:false, run, all:run, total:0}}; sfx.good(); yearOne(); }; }

/* ---------- world dressing ---------- */
function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function worldPlus(){ const R=ROAD;
  scene.background=canvasTex(4,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#3E92D6'); gr.addColorStop(.5,'#8FCBF2'); gr.addColorStop(1,'#DDF0FA'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  /* clouds that drift */
  const cm=mat('#FFFFFF',{roughness:1, emissive:'#F1F5F9', emissiveIntensity:.35});
  for(let i=0;i<11;i++){ const c=new THREE.Group(); for(let k=0;k<5;k++){ const b=new THREE.Mesh(SPH,cm); b.scale.set(rand(4,7),rand(1.6,2.6),rand(3,5)); b.position.set(k*4-8+rand(-1,1),rand(-.5,.8),rand(-2,2)); c.add(b); }
    c.position.set(rand(-160,160),rand(48,66),rand(-150,60)); scene.add(c); const v=rand(.6,1.4); W.anim.push(()=>{ c.position.x+=v*.016; if(c.position.x>190) c.position.x=-190; }); }
  /* street lights */
  const pole=mat('#475569',{metalness:.6, roughness:.4}), lamp=mat('#FEF3C7',{emissive:'#FDE68A', emissiveIntensity:.5});
  const light=(x,z,ry)=>{ const g=new THREE.Group(); g.position.set(x,0,z); g.rotation.y=ry; cy(g,.09,6,0,0,0,pole); bx(g,.12,.12,2,0,6,.9,pole,false); bx(g,.5,.18,.7,0,5.85,1.8,lamp,false); scene.add(g); };
  for(let x=R.x0+6;x<R.x1;x+=18){ if(Math.abs(x)>8) light(x,R.z1-R.w/2-.8,0); light(x,R.z0+R.w/2+.8,Math.PI); }
  for(let z=R.z0+12;z<R.z1-6;z+=18){ light(R.x0+R.w/2+.8,z,Math.PI/2); light(R.x1-R.w/2-.8,z,-Math.PI/2); }
  /* crosswalks */
  const zeb=mat('#F8FAFC',{roughness:.9});
  [[-32,R.z1,0],[32,R.z1,0],[0,R.z0,0],[R.x0,-12,1],[R.x1,-12,1]].forEach(([x,z,v])=>{ for(let i=-4;i<=4;i++){ const m=new THREE.Mesh(new THREE.PlaneGeometry(v?R.w-1:.55,v?.55:R.w-1),zeb); m.rotation.x=-Math.PI/2; m.position.set(x+(v?0:i*1.1),.03,z+(v?i*1.1:0)); m.receiveShadow=true; scene.add(m); } });
  /* billboards for the rest of the MoneyVerse */
  const bill=(x,z,ry,lines,bg)=>{ const g=new THREE.Group(); g.position.set(x,0,z); g.rotation.y=ry; [-3,3].forEach(s=>cy(g,.18,7,s,0,0,pole)); bx(g,13,5.2,.3,0,6.6,-.2,mat('#1E293B')); sign(g,lines,12.4,4.6,0,9.2,0,{bg,w:1024,h:380,r:20}); scene.add(g); };
  bill(44,-8,0,[{t:'BotBank',size:120,color:'#FFFFFF'},{t:'Save first. Then buy.',size:64,weight:700,color:'#BFDBFE'}],'#1D4ED8');
  bill(-44,-8,0,[{t:'BOT U',size:120,color:'#0B1220'},{t:'Learn it before you earn it',size:58,weight:700,color:'#3A2400'}],'#FBBF24');
  bill(28,-31,Math.PI,[{t:'BotMarket',size:120,color:'#052E16'},{t:'Invest in what you know',size:60,weight:700,color:'#065F46'}],'#00E676');
  bill(-30,-31,Math.PI,[{t:'DRIVE SAFE',size:120,color:'#FFFFFF'},{t:'Tickets raise insurance for 3 years',size:52,weight:700,color:'#FECACA'}],'#B91C1C');
  /* pennant strings along the lot edges */
  const pc=['#00E676','#FBBF24','#3B82F6','#EF4444'].map(c=>new THREE.MeshStandardMaterial({color:c, side:THREE.DoubleSide, roughness:.6})), tri=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.3,0,0),new THREE.Vector3(.3,0,0),new THREE.Vector3(0,-.6,0)]); tri.computeVertexNormals();
  [-23.6,23.6].forEach(x=>{ for(let z=-14,i=0;z<=12.5;z+=1,i++){ const sag=3.9-Math.sin((z+14)/26.5*Math.PI)*.6, m=new THREE.Mesh(tri,pc[i%4]); m.position.set(x,sag,z); m.rotation.y=Math.PI/2; scene.add(m); W.anim.push(t=>{ m.rotation.x=Math.sin(t*3+z)*.25; }); } });
  /* bus stop */
  const bs=new THREE.Group(); bs.position.set(22.3,0,-1); bs.rotation.y=-Math.PI/2; scene.add(bs);
  bx(bs,4,.12,1.8,0,2.6,0,mat('#0F766E')); [-1.9,1.9].forEach(x=>cy(bs,.07,2.6,x,0,.7,pole)); const gl=new THREE.Mesh(BOX,new THREE.MeshStandardMaterial({color:'#A5F3FC',transparent:true,opacity:.35,roughness:.1})); gl.scale.set(4,2.2,.05); gl.position.set(0,1.4,-.85); bs.add(gl); bx(bs,3,.12,.5,0,.5,-.4,mat('#334155'));
  sign(bs,[{t:'🚌 ROUTE 7',size:56},{t:'Pass $70/mo',size:44,weight:600}],1.8,1,0,3.4,.9,{bg:'#0F766E',r:14}); W.bus={x:21,z:-1};
  /* showroom: lit display car on a turntable */
  const disp=makeCar({id:'disp', style:'coupe', color:'#F59E0B'}); disp.position.set(-7,.25,-21); scene.add(disp); const pod=new THREE.Mesh(new THREE.CylinderGeometry(3,3.2,.25,40), mat('#CBD5E1',{metalness:.6, roughness:.25})); pod.position.set(-7,.12,-21); scene.add(pod);
  W.anim.push(t=>{ disp.rotation.y=t*.4; }); for(let x=-12;x<=12;x+=6) bx(scene,3,.06,.6,x,5.85,-21,mat('#FFFFFF',{emissive:'#FFFFFF', emissiveIntensity:1}),false);
}

/* ---------- the city is alive: traffic, pedestrians, other shoppers ---------- */
function rectPath(x0,x1,z0,z1){ const P=[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]], segs=[]; let s=0; for(let i=0;i<4;i++){ const [a,b]=P[i],[c,d]=P[i+1], L=Math.hypot(c-a,d-b); segs.push({a,b,L,s0:s,dx:(c-a)/L,dz:(d-b)/L}); s+=L; }
  return {len:s, at(q){ q=((q%s)+s)%s; for(const g of segs) if(q<=g.s0+g.L){ const u=q-g.s0; return {x:g.a+g.dx*u, z:g.b+g.dz*u, dx:g.dx, dz:g.dz}; } return {x:x0,z:z0,dx:1,dz:0}; }}; }
const BODY_COLS=['#FCA5A5','#93C5FD','#FDE68A','#C4B5FD','#A7F3D0','#FDBA74','#F9A8D4','#E2E8F0'];
function livePlus(){ const R=ROAD; W.amb=[]; W.peds=[]; W.shop=[];
  const cols=['#F59E0B','#22C55E','#A855F7','#E11D48','#0EA5E9','#F8FAFC','#334155'], n=MOBILE?5:7;
  for(let i=0;i<n;i++){ const dir=i%2?-1:1, g=makeCar({id:'t'+i, style:pick(['sedan','hatch','ev','sedan','truck']), color:cols[i%cols.length]}); scene.add(g); W.amb.push({g, s:i*LOOP.len/n, v:rand(8.5,11.5), v0:0, dir}); }
  W.amb.forEach(t=>t.v0=t.v);
  const outer=rectPath(R.x0-R.w/2-2.2, R.x1+R.w/2+2.2, R.z0-R.w/2-2.2, R.z1+R.w/2+2.2), inner=rectPath(R.x0+R.w/2+2.4, R.x1-R.w/2-2.4, R.z0+R.w/2+2.4, R.z1-R.w/2-2.4);
  for(let i=0;i<(MOBILE?4:9);i++){ const path=i%3?outer:inner, mtl=mat(BODY_COLS[i%BODY_COLS.length],{roughness:.3}); const rig=makeRig(GLTF.crowd, mtl, rand(.75,.95), pick(['g','y','g'])); rig.root.add(blob(1)); scene.add(rig.root); W.peds.push({rig, path, s:rand(0,path.len), v:rand(1.1,1.7)*(Math.random()<.5?-1:1)}); }
  for(let i=0;i<(MOBILE?1:3);i++){ const rig=makeRig(GLTF.crowd, mat(BODY_COLS[(i+3)%8],{roughness:.3}), .88,'g'); rig.root.add(blob(1)); rig.root.position.set(rand(-18,18),0,rand(-2,2)); scene.add(rig.root); W.shop.push({rig, tx:rig.root.position.x, tz:rig.root.position.z, wait:rand(1,4)}); }
  W.marker=new THREE.Mesh(new THREE.RingGeometry(.32,.46,28), new THREE.MeshBasicMaterial({color:'#00E676', transparent:true, depthWrite:false})); W.marker.rotation.x=-Math.PI/2; W.marker.visible=false; scene.add(W.marker);
}
function trafficTick(dt){ const D=G.drive, ps=D?nearestOnLoop(D.x,D.z):null;
  W.amb.forEach(t=>{ let want=t.v0; const lane=t.dir>0?-2.6:2.6;
    if(D && ps.d<ROAD.w){ let gap=(ps.s-t.s)*t.dir; gap=((gap%LOOP.len)+LOOP.len)%LOOP.len; const p=loopAt(ps.s), lat=(D.x-p.x)*-p.dz+(D.z-p.z)*p.dx; if(gap<9 && Math.abs(lat-lane)<2.4){ want=gap<4.5?0:Math.min(want,Math.abs(D.v)*.9); if(gap<6 && !t.honk){ t.honk=3; hornAt(.5); } } }
    if(t.honk) t.honk=Math.max(0,t.honk-dt);
    t.v+=(want-t.v)*Math.min(1,dt*2.5); t.s=((t.s+t.v*dt*t.dir)%LOOP.len+LOOP.len)%LOOP.len; const p=loopAt(t.s);
    t.g.position.set(p.x-p.dz*lane, 0, p.z+p.dx*lane);
    t.g.rotation.y=Math.atan2(p.dx*t.dir,p.dz*t.dir); t.g.userData.wheels.forEach(w=>w.children.forEach(m=>m.rotation.y+=t.v*dt/t.g.userData.r));
    t.g.userData.tail.emissiveIntensity=t.v<t.v0*.7?2.5:.5; }); }
function pedTick(dt,t){ W.peds.forEach(p=>{ p.s+=p.v*dt; const q=p.path.at(p.s); p.rig.root.position.set(q.x+(-q.dz)*.0,Math.abs(Math.sin(t*7+p.s))*.05,q.z); p.rig.root.rotation.y=Math.atan2(q.dx*Math.sign(p.v),q.dz*Math.sign(p.v)); p.rig.mixer.update(dt); });
  if(G.mode!=='lot'&&G.mode!=='title') return;
  W.shop.forEach(s=>{ s.rig.root.visible=!G.dealer; if(G.dealer) return; const r=s.rig.root, dx=s.tx-r.position.x, dz=s.tz-r.position.z, d=Math.hypot(dx,dz);
    if(d>.2){ r.position.x+=dx/d*2.2*dt; r.position.z+=dz/d*2.2*dt; r.rotation.y=Math.atan2(dx,dz); r.position.y=Math.abs(Math.sin(G.t*9))*.05; }
    else { s.wait-=dt; r.position.y=0; if(s.wait<0){ const ids=[...W.lotCars.keys()], c=W.lotCars.get(pick(ids)); s.tx=c.position.x+rand(-1.6,1.6); s.tz=c.position.z+(c.position.z<0?3:-3); s.wait=rand(3,7); if(Math.random()<.5) rigPlay(s.rig,pick(['UpPoint','LeftHand']),true); } }
    s.rig.mixer.update(dt); }); }

/* ---------- lot juice: hover, click marker, footstep dust, car chirps ---------- */
let hoverCar=null, hoverN=0;
$('#gl').addEventListener('pointermove',e=>{ if(G.mode!=='lot'||G.modal||MOBILE||(hoverN++%2)) return; ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1); ray.setFromCamera(ndc,camera);
  const hits=ray.intersectObjects([...W.lotCars.values()].filter(g=>g.visible),true); let o=hits.length?hits[0].object:null; while(o&&!o.userData.spec) o=o.parent; const id=o?o.userData.spec.id:null;
  if(id!==hoverCar){ if(hoverCar){ const g=W.lotCars.get(hoverCar); g.userData.paint.emissive.set('#000'); } hoverCar=id; $('#gl').style.cursor=id?'pointer':''; if(id){ W.lotCars.get(id).userData.paint.emissive.set('#1F2937'); tone(1200,.04,'sine',.015); } } });
$('#gl').addEventListener('pointerdown',()=>{ setTimeout(()=>{ if(G.walkTo&&W.marker){ W.marker.position.set(G.walkTo.x,.05,G.walkTo.z); W.marker.visible=true; W.marker.userData.t=0; } },0); });
let dustT=0; const chirps=[];
function lotPlus(dt,r,moving){ if(moving){ dustT-=dt; if(dustT<0){ dustT=.16; spawnPuff(r.position.x+rand(-.15,.15),.08,r.position.z+rand(-.15,.15),{color:'#CBD5E1',size:.22,grow:1.6,life:.55,vy:.35,op:.5}); } }
  if(W.marker.visible){ W.marker.userData.t+=dt; const k=W.marker.userData.t; W.marker.scale.setScalar(1+Math.sin(k*8)*.12); if(!G.walkTo||k>6) W.marker.visible=false; } }
function chirp(id){ const g=W.lotCars.get(id); if(!g) return; chirps.push({g, t:0}); tone(1560,.06,'square',.012); setTimeout(()=>tone(1560,.06,'square',.012),140); }
function chirpTick(dt){ for(let i=chirps.length-1;i>=0;i--){ const c=chirps[i]; c.t+=dt; const k=c.t, on=(k<.12||k>.24&&k<.36); c.g.userData.head.emissiveIntensity=on?2.4:.6; c.g.userData.tail.emissiveIntensity=on?2:.5; c.g.children[0].position.y=Math.max(0,Math.sin(k*18)*.05*(1-k/.6)); if(k>.6){ c.g.children[0].position.y=0; chirps.splice(i,1); } } }

/* ---------- particles + skid marks ---------- */
const FX={parts:[], skids:[], si:0}; let FXTEX=null;
function spawnPuff(x,y,z,o={}){ if(!FXTEX) FXTEX=canvasTex(64,64,(g)=>{ const r=g.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,'rgba(255,255,255,1)'); r.addColorStop(.6,'rgba(255,255,255,.5)'); r.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=r; g.fillRect(0,0,64,64); });
  let p=FX.parts.find(p=>!p.alive); if(!p){ if(FX.parts.length>=(MOBILE?50:90)) return; const s=new THREE.Sprite(new THREE.SpriteMaterial({map:FXTEX, transparent:true, depthWrite:false})); scene.add(s); p={s}; FX.parts.push(p); }
  Object.assign(p,{alive:true, t:0, life:o.life||.8, vx:o.vx||0, vy:o.vy==null?.6:o.vy, vz:o.vz||0, size:o.size||.5, grow:o.grow==null?1.5:o.grow, op:o.op||.6, g:o.g||0}); p.s.visible=true; p.s.position.set(x,y,z); p.s.material.color.set(o.color||'#DDDDDD'); }
function burst(pos,color){ for(let i=0;i<22;i++) spawnPuff(pos.x+rand(-4,4),rand(1,4.5),pos.z+rand(-1,1),{color,size:.2,grow:.3,life:rand(.6,1.1),vx:rand(-3,3),vy:rand(2,6),vz:rand(-3,3),g:8,op:1}); }
const SKIDMAT=new THREE.MeshBasicMaterial({color:'#111111', transparent:true, opacity:.42, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2}), SKIDGEO=new THREE.PlaneGeometry(.26,.42);
function skid(x,z,h){ let m; if(FX.skids.length<200){ m=new THREE.Mesh(SKIDGEO,SKIDMAT); m.rotation.x=-Math.PI/2; scene.add(m); FX.skids.push(m); } else m=FX.skids[FX.si++%200]; m.visible=true; m.position.set(x,.036,z); m.rotation.z=h; }
function fxTick(dt){ for(const p of FX.parts){ if(!p.alive) continue; p.t+=dt; const k=p.t/p.life; if(k>=1){ p.alive=false; p.s.visible=false; continue; } p.vy-=p.g*dt; p.s.position.x+=p.vx*dt; p.s.position.y=Math.max(.02,p.s.position.y+p.vy*dt); p.s.position.z+=p.vz*dt; const sz=p.size*(1+p.grow*k); p.s.scale.set(sz,sz,1); p.s.material.opacity=p.op*(1-k); } }

/* ---------- test-drive coins + medals ---------- */
W.coins=[]; const COINGEO=new THREE.CylinderGeometry(.5,.5,.12,22);
function spawnCoins(){ clearCoins(); const n=24; for(let i=0;i<n;i++){ const s=30+i*(LOOP.len-50)/n; if(s>255&&s<318) continue; const p=loopAt(s), side=Math.sin(i*.9)*2.4; const m=new THREE.Mesh(COINGEO,MB.coin); m.rotation.x=Math.PI/2; m.position.set(p.x-p.dz*side,1.1,p.z+p.dx*side); m.castShadow=true; scene.add(m); W.coins.push({m, got:false, t:0}); } if(G.drive) G.drive.nCoins=W.coins.length; }
function clearCoins(){ W.coins.forEach(c=>scene.remove(c.m)); W.coins=[]; }
function coinTick(dt,D){ W.coins.forEach(c=>{ if(c.got){ c.t+=dt; c.m.position.y+=dt*7; c.m.rotation.z+=dt*20; c.m.scale.setScalar(Math.max(.01,1-c.t*2.2)); if(c.t>.5) c.m.visible=false; return; } c.m.rotation.z+=dt*3; c.m.position.y=1.1+Math.sin(G.t*3+c.m.position.x)*.15;
  if(Math.hypot(c.m.position.x-D.x,c.m.position.z-D.z)<1.9){ c.got=true; D.coins++; const k=D.coins; tone(988+k*18,.07,'square',.02); setTimeout(()=>tone(1318+k*18,.12,'square',.018),60); spawnPuff(c.m.position.x,1.2,c.m.position.z,{color:'#FDE68A',size:.6,grow:2,life:.35,vy:1,op:.9}); } }); }
function driveMedal(D,done){ if(!done) return 0; const bad=D.bumps+D.cones, n=D.nCoins||24; if(D.coins>=n*.75&&bad<=1&&!D.ticket) return 3; if(D.coins>=n*.45&&bad<=4) return 2; return 1; }
function clearDriveFx(){ clearCoins(); FX.skids.forEach(m=>m.visible=false); G.fov=50; $('#speedfx').style.opacity=0; }

/* ---------- horn ---------- */
function hornAt(v=1){ if(!AC) return; tone(392,.32,'square',.018*v); tone(494,.32,'square',.016*v); }
addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); if(k==='h'&&G.mode==='drive') hornAt(1.2); if(k==='m') toggleMusic(); });

/* ---------- soft music bed (filtered, low, no buzz) ---------- */
const MUS={on:store.get('music',true), g:null, next:0, step:0, timer:0};
const CHORDS=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,59]], ARP=[0,2,1,3,2,1,3,2];
const mtof=m=>440*Math.pow(2,(m-69)/12);
function mnote(m,t,d,v,type,att=.02){ const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=mtof(m); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+att); g.gain.setTargetAtTime(0,t+d*.6,d*.25); o.connect(g); g.connect(MUS.g); o.start(t); o.stop(t+d+.6); }
function musicStart(){ if(!AC||MUS.g) return; const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1600; MUS.g=AC.createGain(); MUS.g.gain.value=MUS.on?.9:0; MUS.g.connect(lp); lp.connect(aOut()); MUS.next=AC.currentTime+.15;
  MUS.timer=setInterval(()=>{ const b=60/88; while(MUS.next<AC.currentTime+.35){ const st=MUS.step, ch=CHORDS[Math.floor(st/8)%4];
    if(st%8===0) ch.forEach(m=>mnote(m+12,MUS.next,b*3.8,.011,'triangle',.35));
    if(st%4===0) mnote(ch[0]-12,MUS.next,b*1.6,.05,'sine',.01); if(st%4===3) mnote(ch[0]-5,MUS.next,b*.5,.03,'sine',.01);
    if(st%2===0||st%8===7) mnote(ch[ARP[st%8]]+24,MUS.next,b*.4,.008,'sine',.005);
    MUS.next+=b/2; MUS.step++; } },100); updMute(); }
function duck(v){ if(MUS.g&&MUS.on) MUS.g.gain.setTargetAtTime(.9*v,AC.currentTime,.3); }
function toggleMusic(){ MUS.on=!MUS.on; store.set('music',MUS.on); if(MUS.g) MUS.g.gain.setTargetAtTime(MUS.on?(G.drive?.32:.9):0,AC.currentTime,.1); updMute(); }
function updMute(){ const b=$('#btnMute'); if(b) b.textContent=MUS.on?'🎵':'🔇'; }
$('#btnMute').onclick=()=>{ audio(); musicStart(); toggleMusic(); };

/* ---------- Slick's pressure tactics ---------- */
function startTactic(N){ setTimeout(()=>proSpot(N.tactic==='rival'?'urgency':N.tactic==='manager'?'manager':'payment_pack'),50); const opts=['rival','manager']; if(!G.preapproved||true) opts.push('payment'); N.tactic=pick(opts); const L=SLICK.tactics[N.tactic]; N.hist.unshift('<b>Slick:</b> '+L); slick(L,6000); sfx.bad();
  if(N.tactic==='manager'){ N.waiting=true; renderNeg(); const s=G.slick.root, home=s.position.clone(); s.position.set(9,0,-24); setTimeout(()=>{ if(G.neg!==N) return; s.position.copy(home); N.waiting=false; const drop=Math.min(N.ask-N.c.floor, Math.round(rand(150,350)/50)*50); N.ask-=drop; const L2='Good news! My manager says I can do '+fmt(N.ask)+'. He NEVER does this.'; N.hist.unshift('<b>Slick:</b> '+L2); slick(L2); note('"Let me ask my manager" is often theater. It makes a small discount feel like a big win.'); N.tDone=true; sfx.tick(); renderNeg(); },2600); return; }
  renderNeg(); }
function tacticBox(N){ if(N.tDone) return '';
  if(N.tactic==='manager') return `<div class="tactic"><b>⏳ Slick went to "talk to his manager"…</b><small>Classic move. Sit tight.</small></div>`;
  if(N.tactic==='rival') return `<div class="tactic"><b>⚠️ Pressure tactic: "Someone else wants this car!"</b><div class="decb"><button class="btn sm pri" data-tc="calm">Stay calm: "Then they can have it."</button><button class="btn sm danger" data-tc="panic">Panic and pay ${fmt(N.ask)}</button></div></div>`;
  return `<div class="tactic"><b>⚠️ Pressure tactic: "What monthly payment do you want?"</b><div class="decb"><button class="btn sm pri" data-tc="total">"Let's agree on the total price first."</button><button class="btn sm danger" data-tc="monthly">"Um, about $300 a month?"</button></div></div>`; }
function tacticAnswer(k){ const N=G.neg, c=N.c; N.tDone=true; let L='';
  if(k==='calm'){ N.ask=Math.max(c.floor,N.ask-200); N.patience=Math.min(100,N.patience+10); L='Heh, okay, no rush. Tell you what, '+fmt(N.ask)+'.'; note('"Another buyer is interested" is a pressure tactic. Real deals survive a night to think.'); sfx.good(); }
  if(k==='panic'){ note('Rushing because "someone else wants it" usually means paying too much.'); return closeDeal(N.ask); }
  if(k==='total'){ N.patience=Math.min(100,N.patience+8); L='Smart cookie. Fine, we talk price.'; note('Negotiate the total price, never the monthly payment. A long loan can make any price "fit".'); sfx.good(); }
  if(k==='monthly'){ N.ask+=400; L='$300 a month? Easy! Just stretch it to 84 months... and the price is '+fmt(N.ask)+' now.'; note('When you name a monthly payment, the seller stretches the loan and raises the price to hit it.'); sfx.bad(); }
  N.hist.unshift('<b>Slick:</b> '+L); slick(L); renderNeg(); }

/* ---------- confetti for good grades ---------- */
let CONF=null;
function confetti(){ const cv=$('#confetti'); cv.width=innerWidth; cv.height=innerHeight; const g=cv.getContext('2d'), P=[]; for(let i=0;i<160;i++) P.push({x:innerWidth/2+rand(-80,80), y:innerHeight*.3, vx:rand(-7,7), vy:rand(-14,-4), r:rand(3,7), c:pick(['#00E676','#FBBF24','#60A5FA','#F472B6','#FFFFFF']), a:rand(0,6), va:rand(-.3,.3)});
  sfx.good(); setTimeout(()=>tone(1318,.25,'triangle',.04),160); let f=0; cancelAnimationFrame(CONF);
  const tick=()=>{ g.clearRect(0,0,cv.width,cv.height); P.forEach(p=>{ p.vy+=.35; p.vx*=.99; p.x+=p.vx; p.y+=p.vy; p.a+=p.va; g.save(); g.translate(p.x,p.y); g.rotate(p.a); g.fillStyle=p.c; g.fillRect(-p.r,-p.r/2,p.r*2,p.r); g.restore(); }); if(f++<150) CONF=requestAnimationFrame(tick); else g.clearRect(0,0,cv.width,cv.height); }; tick(); }
function clearConfetti(){ cancelAnimationFrame(CONF); const cv=$('#confetti'); cv.getContext('2d').clearRect(0,0,cv.width,cv.height); }

/* ---------- per-frame extras ---------- */
let cashShown=null;
function plusTick(dt,t){ storyTick(dt); trafficTick(dt); pedTick(dt,t); fxTick(dt); chirpTick(dt);
  const fov=G.mode==='drive'?G.fov:50; if(Math.abs(camera.fov-fov)>.05){ camera.fov+=(fov-camera.fov)*Math.min(1,dt*3); camera.updateProjectionMatrix(); }
  if(cashShown==null) cashShown=G.cash; if(Math.abs(cashShown-G.cash)>.5){ const up=G.cash>cashShown; cashShown+=(G.cash-cashShown)*Math.min(1,dt*7); if(Math.abs(cashShown-G.cash)<1) cashShown=G.cash; const e=$('#hSave'); e.textContent=fmt(cashShown); e.className=up?'up':'down'; } else $('#hSave').className=''; }
/* hud() writes the cash instantly; let the tween own it instead */
const _hud=hud; hud=function(){ _hud(); if(cashShown!=null) $('#hSave').textContent=fmt(cashShown); };
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('.btn,.terms button,.life')) tone(700,.03,'sine',.012); },true);

