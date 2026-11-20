/* ===================== BotMotors · 3D world ===================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const MOBILE = matchMedia('(pointer:coarse)').matches || /CrOS/.test(navigator.userAgent) && innerWidth<900;
const QT = SET.gfx>=0?SET.gfx:(MOBILE?1:2);
let renderer, scene, camera, sun, hemi, clock=new THREE.Clock();
const GLTF={}, MB={}, W={cars:[], lotCars:new Map(), cones:[], traffic:[], anim:[], colliders:[]};
const BOX=new THREE.BoxGeometry(1,1,1), SPH=new THREE.SphereGeometry(1,16,12), CYL=new THREE.CylinderGeometry(1,1,1,20);
const mat=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c, roughness:.7, metalness:0},o));
function bx(g,w,h,d,x,y,z,m,cast=true){ const e=new THREE.Mesh(BOX,m); e.scale.set(w,h,d); e.position.set(x,y+h/2,z); e.castShadow=cast; e.receiveShadow=true; g.add(e); return e; }
function cy(g,r,h,x,y,z,m,cast=true){ const e=new THREE.Mesh(CYL,m); e.scale.set(r,h,r); e.position.set(x,y+h/2,z); e.castShadow=cast; g.add(e); return e; }

/* ---------- MoneyBot rigs (shared assets from the other MoneyVerse games) ---------- */
function parseGLB(b64){ const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer; return new Promise((res,rej)=>new THREE.GLTFLoader().parse(bin,'',res,rej)); }
function setupMaterials(){
  MB.face=mat('#05070D',{roughness:.18, metalness:.1}); MB.coin=mat('#FBBF24',{roughness:.35, metalness:.45, emissive:'#F59E0B', emissiveIntensity:.25});
  MB.hero=mat('#F8FAFC',{roughness:.24, metalness:.05}); MB.you=mat('#BBF7D0',{roughness:.3}); MB.slick=mat('#FCA5A5',{roughness:.25, metalness:.25}); MB.mech=mat('#FDBA74',{roughness:.4}); MB.cu=mat('#93C5FD',{roughness:.3});
  MB.eye={g:mat('#16A34A',{emissive:'#22C55E', emissiveIntensity:1, roughness:.6}), y:mat('#D97706',{emissive:'#F59E0B', emissiveIntensity:1, roughness:.6}), r:mat('#B91C1C',{emissive:'#EF4444', emissiveIntensity:1.1, roughness:.6})};
}
function makeRig(gltf, body, height, eye){
  const model=THREE.SkeletonUtils.clone(gltf.scene), eyes=[];
  model.traverse(o=>{ if(!o.isMesh) return; o.frustumCulled=false; o.castShadow=true; const n=(o.material&&o.material.name)||'';
    if(n==='Silver') o.material=body; else if(n==='eyes'){ o.material=MB.eye[eye||'g']; eyes.push(o); } else if(n==='Face'||n==='Hat') o.material=MB.face; else if(n==='Coin') o.material=MB.coin; });
  const holder=new THREE.Group(); holder.add(model); const mixer=new THREE.AnimationMixer(model), acts={};
  gltf.animations.forEach(c=>acts[c.name]=mixer.clipAction(c)); acts.Idle.play(); mixer.update(Math.random()*1.5);
  const box=new THREE.Box3().setFromObject(model), s=height/(box.max.y-box.min.y); model.position.y=-box.min.y; holder.scale.setScalar(s);
  const rig={root:holder, model, mixer, acts, eyes, cur:'Idle'}; mixer.addEventListener('finished',()=>rigPlay(rig,'Idle')); return rig;
}
function rigPlay(rig,name,once){ const a=rig.acts[name]; if(!a||rig.cur===name&&!once) return; const p=rig.acts[rig.cur]; a.reset(); a.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat, once?1:Infinity); a.play(); if(p&&p!==a) p.crossFadeTo(a,.25,false); rig.cur=name; }
let blobTex=null;
function blob(s=1){ if(!blobTex){ const c=document.createElement('canvas'); c.width=c.height=64; const g=c.getContext('2d'); const r=g.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,'rgba(0,0,0,.45)'); r.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=r; g.fillRect(0,0,64,64); blobTex=new THREE.CanvasTexture(c); }
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({map:blobTex, transparent:true, depthWrite:false})); m.rotation.x=-Math.PI/2; m.position.y=.02; m.scale.set(s,s,1); return m; }

/* ---------- text textures ---------- */
function textTex(lines, o={}){ const w=o.w||512, h=o.h||128, c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d');
  if(o.bg){ g.fillStyle=o.bg; if(o.r){ g.beginPath(); g.roundRect(0,0,w,h,o.r); g.fill(); } else g.fillRect(0,0,w,h); }
  if(o.border){ g.strokeStyle=o.border; g.lineWidth=o.bw||8; g.beginPath(); g.roundRect(o.bw/2||4,o.bw/2||4,w-(o.bw||8),h-(o.bw||8),o.r||0); g.stroke(); }
  (Array.isArray(lines)?lines:[lines]).forEach((L,i,arr)=>{ const sz=(L.size||o.size||64); g.font=`${L.weight||o.weight||800} ${sz}px ${o.font||"'Barlow Condensed', system-ui, sans-serif"}`; g.fillStyle=L.color||o.color||'#fff'; g.textAlign='center'; g.textBaseline='middle';
    let t=L.t||L; while(g.measureText(t).width>w*.92 && sz>10){ g.font=`${L.weight||o.weight||800} ${--L.size||(o.size=sz-2)}px ${o.font||"'Barlow Condensed', system-ui, sans-serif"}`; break; }
    g.fillText(L.t||L, w/2, h*(arr.length===1?.53:(i+.6)/arr.length)); });
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; return t; }
function sign(g, lines, w, h, x, y, z, o={}){ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshStandardMaterial({map:textTex(lines,Object.assign({w:Math.round(512*Math.max(1,w/h/4)),h:128},o)), emissive:'#fff', emissiveIntensity:o.glow||0, emissiveMap:null, roughness:.6, transparent:!!o.transparent})); if(o.glow) m.material.emissiveMap=m.material.map; m.position.set(x,y,z); if(o.ry) m.rotation.y=o.ry; g.add(m); return m; }

/* ---------- the car builder ---------- */
const STYLES={
  sedan:{L:4.5, W:1.82, low:[[-2.2,.34],[-2.25,.78],[-2.0,.98],[2.0,.92],[2.25,.62],[2.2,.34]], cab:[[-1.55,.97],[-1.05,1.42],[.55,1.42],[1.2,.95]]},
  hatch:{L:3.95,W:1.75, low:[[-1.95,.34],[-2.0,.98],[1.75,.92],[1.98,.6],[1.92,.34]], cab:[[-1.98,.97],[-1.8,1.47],[.35,1.5],[.98,.95]]},
  coupe:{L:4.6, W:1.88, low:[[-2.3,.32],[-2.35,.74],[-2.05,.9],[2.05,.84],[2.32,.56],[2.27,.3]], cab:[[-1.4,.89],[-.6,1.27],[.35,1.29],[1.15,.85]]},
  ev:   {L:4.4, W:1.85, low:[[-2.15,.34],[-2.2,.82],[-1.9,.98],[2.0,.88],[2.22,.55],[2.17,.34]], cab:[[-1.75,.97],[-.85,1.46],[.5,1.46],[1.4,.9]]},
  truck:{L:5.5, W:2.0,  low:[[-2.75,.48],[-2.75,1.1],[2.55,1.16],[2.75,.82],[2.7,.48]], cab:[[-.45,1.1],[-.45,1.92],[.95,1.92],[1.6,1.12]]}
};
function profileGeo(pts, depth, bevel){ const s=new THREE.Shape(); pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth, bevelEnabled:true, bevelThickness:bevel, bevelSize:bevel, bevelSegments:3, curveSegments:6}); g.translate(0,0,-depth/2); g.computeVertexNormals(); return g; }
const GLASS=new THREE.MeshStandardMaterial({color:'#0B1220', roughness:.08, metalness:.6, envMapIntensity:1});
const PLATE=new THREE.MeshStandardMaterial({color:'#F8FAFC',roughness:.5}), SEAM=mat('#000',{roughness:1,transparent:true,opacity:.35}), ARCH=new THREE.TorusGeometry(1,.06,6,16,Math.PI);
const TIRE=mat('#111318',{roughness:.85}), RIM=mat('#CBD5E1',{metalness:.85, roughness:.25}), CHROME=mat('#E2E8F0',{metalness:.9, roughness:.18}), BLACK=mat('#0F172A',{roughness:.5});
function makeCar(spec){
  const S=STYLES[spec.style], g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  const paint=new THREE.MeshPhysicalMaterial({color:spec.color, metalness:.12, roughness:.38, clearcoat:MOBILE?0:.8, clearcoatRoughness:.15, envMap:W.env||null, envMapIntensity:.3});
  if(spec.id==='rattler'){ paint.roughness=.75; paint.metalness=.1; paint.clearcoat=0; }
  const low=new THREE.Mesh(profileGeo(S.low,S.W-.12,.06),paint); low.castShadow=true; body.add(low);
  const cab=new THREE.Mesh(profileGeo(S.cab,S.W*.84,.05),GLASS); cab.castShadow=true; body.add(cab);
  /* painted roof + pillars over the glass */
  const ys=S.cab.map(p=>p[1]), top=Math.max(...ys), roofPts=S.cab.filter(p=>p[1]>top-.05);
  const rx0=Math.min(...roofPts.map(p=>p[0])), rx1=Math.max(...roofPts.map(p=>p[0]));
  const roof=new THREE.Mesh(BOX,paint); roof.scale.set(rx1-rx0+.12,.07,S.W*.86); roof.position.set((rx0+rx1)/2,top+.03,0); roof.castShadow=true; body.add(roof);
  const bp=new THREE.Mesh(BOX,paint); bp.scale.set(.1,top-S.cab[0][1]+.02,S.W*.86); const a=S.cab[1], b=S.cab[0]; bp.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,0); bp.rotation.z=Math.atan2(a[1]-b[1],a[0]-b[0])-Math.PI/2; body.add(bp);
  if(spec.style==='truck'){ const bed=new THREE.Mesh(BOX,BLACK); bed.scale.set(2.9,.05,S.W-.3); bed.position.set(-1.25,1.14,0); body.add(bed); [[-1.25,S.W/2-.1],[-1.25,-S.W/2+.1]].forEach(([x,z])=>{ const w=new THREE.Mesh(BOX,paint); w.scale.set(2.95,.28,.08); w.position.set(x,1.25,z); body.add(w); }); const tg=new THREE.Mesh(BOX,paint); tg.scale.set(.08,.28,S.W-.2); tg.position.set(-2.72,1.25,0); body.add(tg); }
  /* lights, grille, mirrors */
  const wx=S.L/2-(spec.style==='truck'?.95:.78), r=spec.style==='truck'?.44:.36;
  const front=S.low.reduce((m,p)=>p[0]>m[0]?p:m), back=S.low.reduce((m,p)=>p[0]<m[0]?p:m);
  const hl=mat('#FFFBEB',{emissive:'#FFF7D6', emissiveIntensity:.6, roughness:.2}), tl=mat('#7F1D1D',{emissive:'#EF4444', emissiveIntensity:.5, roughness:.3});
  [-1,1].forEach(s=>{ const h=new THREE.Mesh(BOX,hl); h.scale.set(.08,.12,.42); h.position.set(front[0]-.05,.66,s*(S.W/2-.32)); body.add(h);
    const t=new THREE.Mesh(BOX,tl); t.scale.set(.08,.12,.38); t.position.set(back[0]+.04,.76,s*(S.W/2-.3)); body.add(t);
    const mr=new THREE.Mesh(BOX,paint); mr.scale.set(.18,.12,.14); mr.position.set(S.cab[S.cab.length-1][0]-.12,S.cab[0][1]+.08,s*(S.W/2+.06)); body.add(mr); });
  if(spec.style==='ev'){ const lb=new THREE.Mesh(BOX,hl); lb.scale.set(.06,.05,S.W-.4); lb.position.set(front[0]-.03,.78,0); body.add(lb); }
  else { const gr=new THREE.Mesh(BOX,spec.style==='truck'?CHROME:BLACK); gr.scale.set(.06,spec.style==='truck'?.36:.18,S.W*.42); gr.position.set(front[0]-.02,spec.style==='truck'?.72:.5,0); body.add(gr); }
  /* wheels */
  const wheels=[];
  [[wx,1],[wx,-1],[-wx,1],[-wx,-1]].forEach(([x,s])=>{ const w=new THREE.Group(); const t=new THREE.Mesh(CYL,TIRE); t.scale.set(r,.26,r); t.rotation.x=Math.PI/2; t.castShadow=true; w.add(t); const rim=new THREE.Mesh(CYL,RIM); rim.scale.set(r*.62,.27,r*.62); rim.rotation.x=Math.PI/2; w.add(rim);
    w.position.set(x,r,s*(S.W/2-.1)); body.add(w); wheels.push(w); });
  /* bumpers, skirts, plates, door seams */
  const by=spec.style==='truck'?.5:.3;
  [front[0]+.02, back[0]-.02].forEach((x,i)=>{ const b=new THREE.Mesh(BOX,BLACK); b.scale.set(.16,.2,S.W-.1); b.position.set(x,by+.06,0); body.add(b);
    const pl=new THREE.Mesh(BOX,PLATE); pl.scale.set(.03,.17,.52); pl.position.set(x+(i?-.09:.09),by+.3,0); body.add(pl); });
  [-1,1].forEach(s=>{ const k=new THREE.Mesh(BOX,BLACK); k.scale.set(S.L*.62,.1,.06); k.position.set(0,by+.04,s*(S.W/2-.03)); body.add(k);
    const sm=new THREE.Mesh(BOX,SEAM); sm.scale.set(.02,.5,.02); sm.position.set(spec.style==='truck'?.2:-.15,.58+(spec.style==='truck'?.2:0),s*(S.W/2-.05)); body.add(sm);
    [wx,-wx].forEach(x=>{ const arch=new THREE.Mesh(ARCH,BLACK); arch.scale.set(r*1.18,r*1.18,1); arch.position.set(x,r,s*(S.W/2-.06)); body.add(arch); }); });
  if(spec.id==='rattler'){ const rust=mat('#7C2D12',{roughness:1}); [[.6,.5,1],[-1.2,.42,-1],[1.3,.7,-1]].forEach(([x,y,s])=>{ const p=new THREE.Mesh(BOX,rust); p.scale.set(.5,.22,.02); p.position.set(x,y,s*(S.W/2-.03)); body.add(p); }); }
  body.rotation.y=-Math.PI/2;    /* length runs along +z, front at +z */
  const sh=blob(1); sh.scale.set(S.W+.9,S.L+.9,1); g.add(sh);
  g.userData={spec, wheels, paint, len:S.L, wid:S.W, r, tail:tl, head:hl}; return g;
}

/* ---------- world: lot, showroom, city loop ---------- */
const ROAD={x0:-62, x1:62, z0:-44, z1:22, w:11};          // loop centerline rectangle, counter-clockwise from the lot exit
const LOT={x0:-24, x1:24, z0:-15, z1:13};
function facadeTex(base, lit){ const c=document.createElement('canvas'); c.width=128; c.height=256; const g=c.getContext('2d'); g.fillStyle=base; g.fillRect(0,0,128,256);
  for(let y=10;y<250;y+=22) for(let x=8;x<124;x+=20){ g.fillStyle=Math.random()<.3?'#FDE68A':pick(['#1E293B','#334155','#3B4A63']); g.fillRect(x,y,13,14); }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.encoding=THREE.sRGBEncoding; return t; }
function lotTex(){ const c=document.createElement('canvas'); c.width=1024; c.height=640; const g=c.getContext('2d'); g.fillStyle='#3A3F48'; g.fillRect(0,0,1024,640);
  for(let i=0;i<4000;i++){ g.fillStyle=`rgba(255,255,255,${Math.random()*.04})`; g.fillRect(Math.random()*1024,Math.random()*640,2,2); }
  g.strokeStyle='#F8FAFC'; g.lineWidth=5; const px=x=>(x-LOT.x0)/(LOT.x1-LOT.x0)*1024, pz=z=>(z-LOT.z0)/(LOT.z1-LOT.z0)*640;
  for(let x=-18;x<=18;x+=6){ [[-10,-3],[3,10]].forEach(([a,b])=>{ g.beginPath(); g.moveTo(px(x),pz(a)); g.lineTo(px(x),pz(b)); g.stroke(); }); }
  g.fillStyle='#FBBF24'; g.font="900 46px 'Barlow Condensed', system-ui, sans-serif"; g.textAlign='center'; g.fillText('BOT CITY MOTORS', 512, pz(0)+16);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; return t; }
function roadTex(){ const c=document.createElement('canvas'); c.width=256; c.height=256; const g=c.getContext('2d'); g.fillStyle='#2B2F36'; g.fillRect(0,0,256,256); for(let i=0;i<900;i++){ g.fillStyle=`rgba(255,255,255,${Math.random()*.05})`; g.fillRect(Math.random()*256,Math.random()*256,2,2); }
  g.fillStyle='#FBBF24'; g.fillRect(124,0,3,256); g.fillRect(130,0,3,256); g.fillStyle='#E2E8F0'; g.fillRect(6,0,4,256); g.fillRect(246,0,4,256);
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.encoding=THREE.sRGBEncoding; t.anisotropy=8; return t; }
function buildWorld(){
  scene.background=new THREE.Color('#9CD5F5'); scene.fog=new THREE.Fog('#BFE3F7', 90, 230);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600), mat('#4E8B55',{roughness:1})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  /* city loop */
  const rt=roadTex(), R=ROAD;
  const seg=(x0,z0,x1,z1)=>{ const L=Math.hypot(x1-x0,z1-z0), m=new THREE.MeshStandardMaterial({map:rt.clone(), roughness:.92}); m.map.repeat.set(1,L/R.w); m.map.needsUpdate=true; const p=new THREE.Mesh(new THREE.PlaneGeometry(R.w,L),m); p.rotation.x=-Math.PI/2; p.rotation.z=Math.atan2(x1-x0,z1-z0); p.position.set((x0+x1)/2,.02,(z0+z1)/2); p.receiveShadow=true; scene.add(p);
    const cw=new THREE.Mesh(BOX, mat('#CBD5E1',{roughness:.95})); [-1,1].forEach(s=>{ const k=cw.clone(); const nx=(z1-z0)/L, nz=-(x1-x0)/L; k.scale.set(R.w+6,.14,L); k.rotation.y=Math.atan2(x1-x0,z1-z0); k.position.set((x0+x1)/2,.0,(z0+z1)/2); }); };
  const sw=mat('#C7CED8',{roughness:.95}); [[R.x0-R.w/2-3,R.z0-R.w/2-3,R.x1+R.w/2+3,R.z1+R.w/2+3]].forEach(([a,b,c,d])=>{ const p=new THREE.Mesh(new THREE.PlaneGeometry(c-a,d-b),sw); p.rotation.x=-Math.PI/2; p.position.set((a+c)/2,.01,(b+d)/2); p.receiveShadow=true; scene.add(p); });
  const inner=new THREE.Mesh(new THREE.PlaneGeometry(R.x1-R.x0-R.w-6, R.z1-R.z0-R.w-6), mat('#5A9A5F',{roughness:1})); inner.rotation.x=-Math.PI/2; inner.position.set(0,.015,(R.z0+R.z1)/2); inner.receiveShadow=true; scene.add(inner);
  seg(R.x0,R.z1,R.x1,R.z1); seg(R.x1,R.z1,R.x1,R.z0); seg(R.x1,R.z0,R.x0,R.z0); seg(R.x0,R.z0,R.x0,R.z1);
  [[R.x0,R.z0],[R.x1,R.z0],[R.x0,R.z1],[R.x1,R.z1]].forEach(([x,z])=>{ const p=new THREE.Mesh(new THREE.PlaneGeometry(R.w,R.w), mat('#2B2F36',{roughness:.92})); p.rotation.x=-Math.PI/2; p.position.set(x,.025,z); p.receiveShadow=true; scene.add(p); });
  /* lot */
  const lot=new THREE.Mesh(new THREE.PlaneGeometry(LOT.x1-LOT.x0, LOT.z1-LOT.z0), new THREE.MeshStandardMaterial({map:lotTex(), roughness:.9})); lot.rotation.x=-Math.PI/2; lot.position.set(0,.03,(LOT.z0+LOT.z1)/2); lot.receiveShadow=true; scene.add(lot);
  const drv=new THREE.Mesh(new THREE.PlaneGeometry(9,R.z1-LOT.z1-R.w/2+.5), mat('#3A3F48',{roughness:.9})); drv.rotation.x=-Math.PI/2; drv.position.set(0,.028,(LOT.z1+R.z1-R.w/2)/2); drv.receiveShadow=true; scene.add(drv);
  /* showroom */
  const sr=new THREE.Group(); scene.add(sr); const glassM=new THREE.MeshStandardMaterial({color:'#7DD3FC', roughness:.05, metalness:.7, transparent:true, opacity:.55});
  bx(sr,30,.3,10,0,0,-21,mat('#E2E8F0')); bx(sr,30,6,.3,0,0,-26,mat('#F1F5F9')); bx(sr,.3,6,10,-15,0,-21,mat('#F1F5F9')); bx(sr,.3,6,10,15,0,-21,mat('#F1F5F9'));
  const gw=new THREE.Mesh(BOX,glassM); gw.scale.set(29.4,5.6,.1); gw.position.set(0,3.1,-16.1); sr.add(gw); for(let x=-14.5;x<=14.5;x+=4.14) bx(sr,.18,6,.18,x,0,-16,mat('#94A3B8',{metalness:.7, roughness:.3}));
  bx(sr,31,.6,11,0,6,-21,mat('#0B1220')); sign(sr,[{t:'BOT CITY MOTORS',color:'#FBBF24'}],18,1.6,0,7.6,-15.6,{bg:'#0B1220',glow:.9,w:1536,h:136,size:96});
  bx(sr,6,.08,3,4,0,-23,mat('#F8FAFC')); const desk=bx(sr,3.2,1,1.2,4,0,-22.5,mat('#1E293B')); W.desk=new THREE.Vector3(4,0,-22.5);
  /* kiosks: credit union booth, mechanic bay */
  const cu=new THREE.Group(); cu.position.set(19,0,9); scene.add(cu); bx(cu,3.4,2.6,2.4,0,0,0,mat('#1D4ED8')); bx(cu,3.8,.3,2.8,0,2.6,0,mat('#F8FAFC')); {const sp=slotFill('creditunion'); sign(cu,sp?[sp.name,{t:'Car loans',size:44,weight:600}]:['BotBank',{t:'Credit Union',size:44,weight:600}],3.2,1,0,1.7,1.21,{bg:sp?sp.color:'#1E40AF',color:'#fff',size:56}); if(sp) cu.children[0].material=mat(sp.color);} W.cu=cu.position.clone();
  const mg=new THREE.Group(); mg.position.set(-20,0,8); scene.add(mg); bx(mg,6,4,6,0,0,0,mat('#E5E7EB')); bx(mg,4.4,3,.1,0,0,3.01,mat('#475569',{metalness:.5})); for(let y=.3;y<3;y+=.32) bx(mg,4.4,.04,.04,0,y,3.06,mat('#334155'));
  sign(mg,['MIKE\'S GARAGE',{t:'Pre-purchase inspection $120',size:36,weight:600}],5,1.2,0,3.4,3.08,{bg:'#F97316',size:54}); W.mech=mg.position.clone();
  /* sky dancer, flags, balloons */
  const dancer=new THREE.Group(); dancer.position.set(-6,0,12.5); scene.add(dancer); cy(dancer,.5,.4,0,0,0,mat('#334155')); const segs=[]; for(let i=0;i<5;i++){ const s=new THREE.Mesh(CYL,mat(i%2?'#F97316':'#FBBF24',{roughness:.6})); s.scale.set(.32,.9,.32); const p=new THREE.Group(); p.position.y=i?.85:.45; p.add(s); s.position.y=.45; (i?segs[i-1]:dancer).add(p); segs.push(p); }
  const arms=[-1,1].map(sd=>{ const a=new THREE.Mesh(CYL,mat('#FBBF24')); a.scale.set(.12,1.3,.12); const p=new THREE.Group(); p.add(a); a.position.y=.65; p.position.set(sd*.3,.6,0); segs[3].add(p); return [p,sd]; });
  W.anim.push(t=>{ segs.forEach((p,i)=>{ p.rotation.z=Math.sin(t*3.4+i*.9)*.35*(i?1:.2); p.rotation.x=Math.cos(t*2.7+i)*.18; }); arms.forEach(([p,sd])=>p.rotation.z=sd*(1.3+Math.sin(t*6+sd)*.9)); });
  for(let x=-22;x<=22;x+=4){ if(Math.abs(x)<6) continue; const fp=new THREE.Group(); fp.position.set(x,0,13.6); scene.add(fp); cy(fp,.05,4,0,0,0,mat('#CBD5E1',{metalness:.7})); const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.7),new THREE.MeshStandardMaterial({color:pick(['#00E676','#FBBF24','#3B82F6','#EF4444']),side:THREE.DoubleSide})); fl.position.set(.62,3.6,0); fp.add(fl); W.anim.push(t=>{ fl.rotation.y=Math.sin(t*4+x)*.4; }); }
  [[-9,-9],[9,-9],[-3,6],[15,6]].forEach(([x,z])=>{ for(let k=0;k<3;k++){ const b=new THREE.Mesh(SPH,mat(pick(['#EF4444','#FBBF24','#22C55E','#3B82F6','#EC4899']),{roughness:.3})); b.scale.set(.32,.4,.32); const by=2.4+k*.25; b.position.set(x+(k-1)*.35,by,z); scene.add(b); W.anim.push(t=>{ b.position.y=by+Math.sin(t*1.6+k+x)*.12; }); } });
  /* city blocks around and inside the loop */
  const fac=['#E2E8F0','#FDE68A','#FCA5A5','#A7F3D0','#C7D2FE','#FBCFE8','#FED7AA'];
  const place=(x,z,w,d,h,col,label)=>{ const t=facadeTex(col); t.repeat.set(Math.max(1,Math.round(w/3)),Math.max(1,Math.round(h/3))); const m=new THREE.MeshStandardMaterial({map:t, roughness:.8}); const b=new THREE.Mesh(BOX,m); b.scale.set(w,h,d); b.position.set(x,h/2,z); b.castShadow=true; b.receiveShadow=true; scene.add(b); bx(scene,w+.3,.4,d+.3,x,h,z,mat('#475569'));
    if(label){ sign(scene,[label],Math.min(w*.8,9),1.4,x,h*.55+1.5,z+(z<0?d/2+.02:-d/2-.02),{bg:'#0B1220',color:'#fff',size:60,ry:z<0?0:Math.PI}); } };
  const labels=['BYTE BURGER','BotBank','PIXEL PIZZA','BOT U BOOKS','GEAR GYM','SPROCKET SHOES','ZAPP PHONES','BOLT CAFE'];
  let li=0; for(let x=R.x0+4;x<=R.x1-4;x+=14){ if(Math.abs(x)<28) continue; place(x,R.z0+R.w/2+7,10,8,rand(6,14),pick(fac),labels[li++%labels.length]); }
  for(let x=R.x0-6;x<=R.x1+6;x+=13){ place(x,R.z0-R.w/2-8,11,9,rand(8,22),pick(fac),Math.random()<.4?labels[li++%labels.length]:null); place(x,R.z1+R.w/2+8,11,9,rand(6,16),pick(fac),Math.random()<.4?labels[li++%labels.length]:null); }
  for(let z=R.z0;z<=R.z1;z+=13){ place(R.x0-R.w/2-8,z,9,11,rand(8,20),pick(fac)); place(R.x1+R.w/2+8,z,9,11,rand(8,20),pick(fac)); }
  /* trees + street lights */
  const leaf=mat('#2F855A',{roughness:.9}), trunk=mat('#7C4A2D');
  const tree=(x,z)=>{ const g=new THREE.Group(); g.position.set(x,0,z); cy(g,.15,1.4,0,0,0,trunk); const l=new THREE.Mesh(new THREE.IcosahedronGeometry(1.1,1),leaf); l.position.y=2.2; l.castShadow=true; g.add(l); scene.add(g); };
  for(let x=R.x0+8;x<R.x1;x+=10){ if(Math.abs(x)>7) tree(x,R.z1-R.w/2-1.6); tree(x,R.z0+R.w/2+1.6); tree(x,R.z1+R.w/2+1.6); }
  for(let z=R.z0+8;z<R.z1;z+=10){ tree(R.x0+R.w/2+1.6,z); tree(R.x1-R.w/2-1.6,z); }
  /* speed limit + speed camera */
  sign(scene,[{t:'SPEED',size:40},{t:'LIMIT',size:40},{t:'35',size:88}],1.2,1.6,R.x0+R.w/2+1.2,2.4,R.z1-8,{bg:'#fff',color:'#111',border:'#111',bw:8,w:200,h:260,ry:Math.PI/2});
  sign(scene,[{t:'SPEED',size:40},{t:'LIMIT',size:40},{t:'35',size:88}],1.2,1.6,R.x1-R.w/2-1.2,2.4,R.z0+10,{bg:'#fff',color:'#111',border:'#111',bw:8,w:200,h:260,ry:-Math.PI/2});
  const cam=new THREE.Group(); cam.position.set(0,0,R.z0+R.w/2+1.5); scene.add(cam); cy(cam,.08,3,0,0,0,mat('#64748B')); bx(cam,.5,.4,.6,0,3,0,mat('#0F172A')); sign(cam,[{t:'SPEED CAMERA',size:44}],1.8,.4,0,2.5,.32,{bg:'#FBBF24',color:'#111'}); W.speedCam={x:0, z:R.z0};
}
/* ---------- the road loop as a path (for driving, checkpoints, traffic) ---------- */
const LOOP=(()=>{ const R=ROAD, P=[[0,R.z1],[R.x1,R.z1],[R.x1,R.z0],[R.x0,R.z0],[R.x0,R.z1],[0,R.z1]]; const segs=[]; let s=0; for(let i=0;i<P.length-1;i++){ const [x0,z0]=P[i],[x1,z1]=P[i+1], L=Math.hypot(x1-x0,z1-z0); segs.push({x0,z0,x1,z1,L,s0:s,dx:(x1-x0)/L,dz:(z1-z0)/L}); s+=L; } return {segs, len:s}; })();
function loopAt(s){ s=((s%LOOP.len)+LOOP.len)%LOOP.len; for(const g of LOOP.segs){ if(s<=g.s0+g.L) { const u=s-g.s0; return {x:g.x0+g.dx*u, z:g.z0+g.dz*u, dx:g.dx, dz:g.dz}; } } return {x:0,z:ROAD.z1,dx:1,dz:0}; }
function nearestOnLoop(x,z){ let best=null; for(const g of LOOP.segs){ const u=clamp((x-g.x0)*g.dx+(z-g.z0)*g.dz,0,g.L), px=g.x0+g.dx*u, pz=g.z0+g.dz*u, d=Math.hypot(x-px,z-pz); if(!best||d<best.d) best={d, s:g.s0+u, px, pz, g}; } return best; }
function onRoad(x,z){ const R=ROAD, h=R.w/2; const inX=x>R.x0-h&&x<R.x1+h, inZ=z>R.z0-h&&z<R.z1+h; if(!inX||!inZ) return false; return Math.abs(z-R.z1)<h||Math.abs(z-R.z0)<h||Math.abs(x-R.x0)<h||Math.abs(x-R.x1)<h; }
function onLot(x,z){ return x>LOT.x0+.5&&x<LOT.x1-.5&&z>LOT.z0+.5&&z<LOT.z1+.5 || Math.abs(x)<4.3&&z>=LOT.z1-.5&&z<ROAD.z1; }

function initThree(){
  renderer=new THREE.WebGLRenderer({canvas:$('#gl'), antialias:!MOBILE, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, [1,1.25,1.75][QT])); renderer.setSize(innerWidth,innerHeight); renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.92;
  renderer.shadowMap.enabled=QT>0; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(50, innerWidth/innerHeight, .1, 600);
  hemi=new THREE.HemisphereLight('#E0F2FE','#4B5563',.55); scene.add(hemi);
  sun=new THREE.DirectionalLight('#FFF4E0',1.6); sun.position.set(30,50,25); sun.castShadow=true; const sz=QT>=2?2048:1024; sun.shadow.mapSize.set(sz,sz); Object.assign(sun.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:150}); sun.shadow.bias=-.0004; scene.add(sun); scene.add(sun.target);
  const pm=new THREE.PMREMGenerator(renderer); const env=new THREE.Scene(); env.background=new THREE.Color('#BFDBFE'); const l1=new THREE.Mesh(new THREE.PlaneGeometry(40,10),new THREE.MeshBasicMaterial({color:'#FFFFFF'})); l1.position.set(0,12,-10); l1.lookAt(0,0,0); env.add(l1); W.env=pm.fromScene(env,.04).texture; GLASS.envMap=W.env;
  addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });
}
