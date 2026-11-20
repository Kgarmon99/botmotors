/* ===================== BotMotors · graphics pass: detailed cars, lot + showroom lighting, street props, billboard ===================== */
let PLATE_TEX=null;
function plateTex(){if(PLATE_TEX)return PLATE_TEX;const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');g.fillStyle='#F8FAFC';g.fillRect(0,0,256,128);g.strokeStyle='#1E3A8A';g.lineWidth=8;g.strokeRect(4,4,248,120);
  g.fillStyle='#1E3A8A';g.font="700 22px 'Barlow Condensed', sans-serif";g.textAlign='center';g.fillText('KENTUCKY',128,30);g.fillStyle='#0B1220';g.font="800 64px 'Barlow Condensed', sans-serif";g.fillText('BOT·'+Math.floor(100+Math.random()*900),128,96);
  PLATE_TEX=new THREE.CanvasTexture(c);PLATE_TEX.encoding=THREE.sRGBEncoding;return PLATE_TEX;}
const DET={chrome:null,led:null,red:null,dark:null,caliper:null};
function detMats(){if(DET.chrome)return;DET.chrome=mat('#E5E7EB',{metalness:.95,roughness:.15});DET.led=mat('#F0F9FF',{emissive:'#E0F2FE',emissiveIntensity:1.6,roughness:.2});DET.red=mat('#7F1D1D',{emissive:'#EF4444',emissiveIntensity:.9,roughness:.25});
  DET.dark=mat('#0B0F14',{roughness:.6});DET.caliper=mat('#DC2626',{roughness:.4,metalness:.3});DET.green=mat('#052E16',{emissive:'#22C55E',emissiveIntensity:1.4});DET.glass=new THREE.MeshStandardMaterial({color:'#0B1220',roughness:.05,metalness:.8,envMapIntensity:1.2});}
function detailCar(g,spec){if(!g||!g.children[0])return g;detMats();const S=STYLES[spec.style],body=g.children[0],u=g.userData,r=u.r,W2=S.W/2,lite=QT===0;
  const add=(m,w,h,d,x,y,z,ry)=>{const e=new THREE.Mesh(BOX,m);e.scale.set(w,h,d);e.position.set(x,y,z);if(ry)e.rotation.y=ry;body.add(e);return e;};
  const front=Math.max(...S.low.map(p=>p[0])),back=Math.min(...S.low.map(p=>p[0])),beltY=S.cab[0][1],truck=spec.style==='truck';
  /* window trim + door handles */
  const cx0=Math.min(...S.cab.map(p=>p[0])),cx1=Math.max(...S.cab.map(p=>p[0]));[-1,1].forEach(s=>{add(DET.dark,cx1-cx0-.1,.05,.03,(cx0+cx1)/2,beltY+.01,s*(S.W*.42+.015));
    [truck?.15:-.35,truck?.75:.55].forEach(x=>add(DET.chrome,.16,.035,.03,x,beltY-.18,s*(W2-.02)));});
  /* wheels: spokes, hub, calipers */
  if(!lite)u.wheels.forEach(w=>{const s=Math.sign(w.position.z)||1,hub=new THREE.Group();hub.position.z=s*.14;w.add(hub);
    for(let k=0;k<5;k++){const sp=new THREE.Mesh(BOX,DET.chrome);sp.scale.set(r*1.05,.07,.03);sp.rotation.z=k*Math.PI*2/5;hub.add(sp);}
    const cap=new THREE.Mesh(CYL,DET.dark);cap.scale.set(r*.18,.04,r*.18);cap.rotation.x=Math.PI/2;hub.add(cap);
    if(spec.fun>=4||spec.style==='ev'){const cal=new THREE.Mesh(BOX,DET.caliper);cal.scale.set(r*.5,r*.35,.06);cal.position.set(r*.25,r*.25,-s*.03);w.add(cal);}});
  /* headlight LED strips + tail-light bars */
  [-1,1].forEach(s=>{add(DET.led,.04,.035,.4,front-.06,.74+(truck?.12:0),s*(W2-.32));add(DET.red,.04,.05,.42,back+.06,.86+(truck?.12:0),s*(W2-.3));});
  if(spec.style==='ev'||spec.id==='nova')add(DET.red,.03,.03,S.W-.5,back+.05,.92,0);
  /* grille slats */
  if(spec.style!=='ev')for(let i=0;i<3;i++)add(truck?DET.chrome:DET.dark,.03,.025,S.W*.4,front+.0,(truck?.6:.42)+i*(truck?.09:.06),0);
  /* plates get Kentucky tags */
  body.children.forEach(m=>{if(m.material===PLATE)m.material=new THREE.MeshStandardMaterial({map:plateTex(),roughness:.5});});
  /* exhaust, spoiler, rack, EV port, antenna, sunroof */
  if(spec.fuel!=='electric'){const n=spec.id==='thunder'?2:1;for(let i=0;i<n;i++){const ex=new THREE.Mesh(CYL,DET.chrome);ex.scale.set(.05,.18,.05);ex.rotation.z=Math.PI/2;ex.position.set(back-.05,.24,(n>1?(i?.45:-.45):-.5));body.add(ex);}}
  if(spec.style==='coupe'){[-1,1].forEach(s=>add(DET.dark,.05,.14,.05,back+.3,S.low[2][1]+.07,s*.55));add(u.paint,.36,.04,S.W-.2,back+.28,S.low[2][1]+.16,0);}
  if(spec.id==='workhorse'){[-1.6,-.6].forEach(x=>add(DET.chrome,.06,.06,S.W-.1,x,2.05,0));[-1,1].forEach(s=>add(DET.chrome,1.4,.05,.05,-1.1,2.05,s*(W2-.08)));[-1,1].forEach(s=>[-1.6,-.6].forEach(x=>add(DET.chrome,.05,.9,.05,x,1.6,s*(W2-.08))));}
  if(spec.style==='ev'){[-1,1].forEach(s=>{});add(DET.green,.12,.08,.02,back+.55,.8,W2-.01);}
  if(!lite){const top=Math.max(...S.cab.map(p=>p[1]));const an=new THREE.Mesh(CYL,DET.dark);an.scale.set(.01,.35,.01);an.position.set(cx0+.25,top+.2,0);body.add(an);
    if(spec.id==='nova'||spec.id==='echo')add(DET.glass,.8,.02,S.W*.5,(cx0+cx1)/2,top+.075,0);}
  return g;}
const _makeCar=makeCar;makeCar=function(spec){return detailCar(_makeCar(spec),spec);};

/* ---------- lot + showroom lighting, street props, billboard ---------- */
function gfxPlus(){const R=ROAD;detMats();
  /* glossy showroom floor + warm interior lights */
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(29.4,9.4),new THREE.MeshStandardMaterial({color:'#E5E7EB',roughness:.16,metalness:.25,envMap:W.env,envMapIntensity:.9}));fl.rotation.x=-Math.PI/2;fl.position.set(0,.31,-21);fl.receiveShadow=true;scene.add(fl);
  if(QT>=1)[[-8,-21],[8,-21]].forEach(([x,z])=>{const l=new THREE.PointLight('#FFE7C2',.9,18,2);l.position.set(x,5,z);scene.add(l);});
  for(let x=-12;x<=12;x+=6){const lp=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.06,16),DET.led);lp.position.set(x,5.95,-21);scene.add(lp);}
  /* lot light poles */
  [[-23,-14],[23,-14],[-23,12.5],[23,12.5]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);cy(g,.1,7,0,0,0,mat('#64748B',{metalness:.7,roughness:.3}));bx(g,1.4,.2,.5,0,7,0,mat('#1F2937'));const h=new THREE.Mesh(BOX,DET.led);h.scale.set(1.2,.05,.4);h.position.set(0,6.98,0);g.add(h);});
  /* crosswalk at the lot exit + stop line */
  const wm=mat('#F8FAFC',{roughness:.8});for(let i=-4;i<=4;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(.55,4),wm);s.rotation.x=-Math.PI/2;s.position.set(i*1.05,.04,R.z1-R.w/2-2.3);scene.add(s);}
  /* traffic lights at the four corners (they cycle) */
  const TL=[];[[R.x0,R.z0],[R.x1,R.z0],[R.x0,R.z1],[R.x1,R.z1]].forEach(([x,z],i)=>{const g=new THREE.Group();g.position.set(x+(x<0?1:-1)*(R.w/2+1.2),0,z+(z<0?1:-1)*(R.w/2+1.2));scene.add(g);cy(g,.09,4.6,0,0,0,mat('#334155'));
    const box=new THREE.Group();box.position.y=4.6;g.add(box);bx(box,.5,1.3,.45,0,0,0,DET.dark);const ls=['#EF4444','#FACC15','#22C55E'].map((c,k)=>{const m=mat('#111',{emissive:c,emissiveIntensity:0});const s=new THREE.Mesh(SPH,m);s.scale.setScalar(.14);s.position.set(0,1.05-k*.38,.24);box.add(s);return m;});
    box.rotation.y=Math.atan2(-g.position.x,-g.position.z);TL.push({ls,o:i%2});});
  W.anim.push(t=>{TL.forEach(L=>{const ph=((t+L.o*5)%10);const k=ph<4.5?2:ph<5.5?1:0;L.ls.forEach((m,j)=>m.emissiveIntensity=j===k?2.2:0);});});
  /* parked cars on the outer curb */
  if(QT>0){const cols=['#DC2626','#1D4ED8','#F8FAFC','#111827','#059669','#7C3AED','#9CA3AF','#F59E0B'],styles=['sedan','hatch','ev','sedan','coupe','hatch'];
    [[-46,R.z1+R.w/2+1.6,Math.PI/2],[-36,R.z1+R.w/2+1.6,Math.PI/2],[30,R.z1+R.w/2+1.6,Math.PI/2],[44,R.z1+R.w/2+1.6,-Math.PI/2],[-20,R.z0-R.w/2-1.6,-Math.PI/2],[12,R.z0-R.w/2-1.6,Math.PI/2],[R.x1+R.w/2+1.6,-12,0]].forEach(([x,z,ry],i)=>{
      const c=_makeCar({id:'park'+i,style:styles[i%styles.length],color:cols[i%cols.length],fun:2});c.position.set(x,0,z);c.rotation.y=ry;scene.add(c);});}
  /* billboard between the lot and the road: a sponsor slot, or a lesson until one signs */
  const bb=new THREE.Group();bb.position.set(-34,0,-6);bb.rotation.y=.57;scene.add(bb);const pm=mat('#334155',{metalness:.6,roughness:.4});[-4,4].forEach(x=>cy(bb,.22,6,x,0,0,pm));bx(bb,12.6,4.4,.35,0,5.6,-.2,DET.dark);
  const s=slotFill('billboard');sign(bb,s?[{t:s.name.toUpperCase(),size:96,color:'#fff'},{t:s.tagline||'Proud to help Kentucky drive smart',size:46,color:'#fff'}]:[{t:'THE STICKER IS JUST THE START',size:72,color:'#FACC15'},{t:'Payment + insurance + gas + repairs. Run the numbers.',size:40,color:'#fff'}],12,4,0,7.8,0,{bg:s?s.color:'#0B1220',w:1536,h:512,glow:.5});
  W.billboard=new THREE.Vector3(-34,7.8,-6);
  /* service partner plate at Mike's */
  const sv=slotFill('service');if(sv)sign(scene,[{t:'SERVICE PARTNER',size:34,color:'#fff'},{t:sv.name.toUpperCase(),size:58,color:'#fff'}],4,1,W.mech.x,1.2,W.mech.z+3.12,{bg:sv.color,w:768,h:192});
  const cu=slotFill('creditunion');if(cu){}}
