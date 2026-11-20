/* ===================== BotMotors · teaching: insurance office, true-cost calculator, careers, report card add-ons ===================== */

/* ---------- insurance office ---------- */
function insQuote(c){const age=YOU.age<21?1.25:YOU.age<25?1.1:1,sporty=c.fun>=5?1.35:1,mul=(PROFILE.insMul||1)*age*sporty;
  const full=Math.round((c.ins+(c.ins0<150?70:0))*(PROFILE.insMul||1)),liab=Math.round(full*.48);return {full,liab,full1k:Math.round(full*.86),why:[YOU.age<25?`Drivers under 25 pay more because they crash more often`:null,c.fun>=5?'Fast, powerful cars cost more to insure':null,(PROFILE.insMul||1)<1?'Your good-student or job discount lowers the price':null,c.price>20000?'Pricier cars cost more to repair or replace':null].filter(Boolean)};}
function insuranceOffice(){const name=INS_NAME(),rows=CARS.map(c=>{const q=insQuote(c);return `<div class="row"><span>${c.year} ${c.name}</span><span>${fmt(q.liab)} <small style="color:var(--txt3)">liability</small> · <b>${fmt(q.full)}</b> <small style="color:var(--txt3)">full</small></span></div>`;}).join('');
  const C=modal(`<button class="x" id="ix">×</button><div class="eyebrow">${escS(name)}</div>${spBadge('insurance','Insurance partner')}<h2>Get a quote before you buy</h2>
   <p>Insurance is part of what a car really costs. Here's what <b>${YOU.name}, ${YOU.age}</b> would pay each month:</p>
   <div class="tco"><div class="out kyfees">${rows}</div><div>
    <div class="note"><b>Liability</b> pays for damage you cause to <b>other</b> people. Kentucky requires it to drive.</div>
    <div class="note"><b>Full coverage</b> adds collision and comprehensive, which fix <b>your</b> car. If you have a car loan, the lender will require it.</div>
    <div class="note"><b>Deductible:</b> what you pay before insurance kicks in. Raising it from $500 to $1,000 lowers your monthly price, but keep that $1,000 in savings.</div></div></div>
   <div class="lesson">Quote insurance <b>before</b> you sign. A cheap car with a huge insurance bill isn't cheap.</div>
   <div class="mact"><button class="btn pri" id="iOk">Thanks</button></div>`,true);const c=()=>closeModal();G.modalClose=c;C.querySelector('#ix').onclick=c;C.querySelector('#iOk').onclick=c;
  rigPlay(G.insBot,'UpPoint',true);note('Insurance quote: liability covers other people; full coverage fixes your car too, and lenders require it on a loan. Under 25 and fast cars cost more.');}
function buildInsOffice(){const g=new THREE.Group();g.position.set(-20,0,-4);scene.add(g);const wall=mat('#F1F5F9'),blue=mat('#0F766E');
  bx(g,5.5,3.2,4,0,0,0,wall);bx(g,6,.3,4.5,0,3.2,0,blue);bx(g,2.2,2.2,.1,0,0,2.02,mat('#7DD3FC',{metalness:.6,roughness:.08,transparent:true,opacity:.6}));
  const s=slotFill('insurance');sign(g,[s?s.name:'SHIELD BOT',{t:s?'Insurance':'INSURANCE',size:40,weight:600}],4.6,1.1,0,2.75,2.04,{bg:s?s.color:'#0F766E',color:'#fff',size:56});
  W.ins=g.position.clone();G.insBot=makeRig(GLTF.crowd,mat('#5EEAD4',{roughness:.3}),.85,'g');G.insBot.root.position.set(-18.5,0,-1.4);scene.add(G.insBot.root);
  return g;}
/* hook the office into the lot's "walk up and press E" system */
const _nearHook=nearHook;nearHook=function(r,best){best=_nearHook(r,best);if(!G.dealer&&W.ins&&Math.hypot(W.ins.x-r.position.x,W.ins.z+2.6-r.position.z)<3.6)best='@ins';return best;};
const _nearLabel=nearLabel;nearLabel=function(b){if(b==='@ins')return 'Get an insurance quote';return _nearLabel(b);};
const _openCard=openCard;openCard=function(id){if(id==='@ins'){G.walkTo=null;$('#prompt').hidden=true;return insuranceOffice();}return _openCard(id);};

/* ---------- true cost of ownership ---------- */
function tcoCompute(o){const tax=o.price*KY.usage,fees=DOC_FEE+KY.title+KY.notary+(o.loanOn?KY.lien:0),months=o.years*12,financed=o.loanOn?Math.max(0,o.price+tax+fees-o.down):0,pay=o.loanOn?pmt(financed,o.apr,o.term):0,paid=Math.min(o.term,months);
  let bal=financed;const r=o.apr/12;for(let m=0;m<paid;m++){bal=bal*(1+r)-pay;}bal=Math.max(0,bal);const interest=pay*paid-(financed-bal);
  const fuel=o.fuelMo*months,ins=o.ins*months,upkeep=o.maint*months+KY.reg*o.years,value=Math.round(o.price*Math.pow(1-o.dep,o.years));
  const cashOut=(o.loanOn?o.down:o.price+tax+fees)+pay*paid+fuel+ins+upkeep,trueCost=cashOut+bal-value;
  return {tax,fees,financed,pay,paid,bal,interest,fuel,ins,upkeep,value,cashOut,trueCost,perMo:trueCost/months,perMile:trueCost/(o.miles*months),lost:o.price-value};}
function tcoCalc(pre,onDone){const c0=carById(pre&&!String(pre).startsWith('@')?pre:'commuter')||CARS[1];
  const C=modal(`<button class="x" id="tx">×</button><div class="eyebrow">Car cost calculator</div><h2>What would this car really cost?</h2>
   <div class="tco"><div>
    <label>Car</label><select id="tcCar">${CARS.map(c=>`<option value="${c.id}"${c===c0?' selected':''}>${c.year} ${c.name} · ${fmt(c.price)}</option>`).join('')}</select>
    <label>Price you pay</label><input type="number" id="tcP" step="100">
    <label>How you pay</label><div class="mtabs" id="tcHow"><button data-h="cu" class="on">Credit union loan</button><button data-h="dealer">Dealer loan</button><button data-h="cash">Cash</button></div>
    <div id="tcLoan"><label>Down payment</label><input type="number" id="tcD" step="100" value="1500"><label>Loan length</label><div class="mtabs" id="tcT">${[36,48,60,72,84].map(n=>`<button data-n="${n}"${n===60?' class="on"':''}>${n} mo</button>`).join('')}</div></div>
    <label>Miles you drive per month</label><input type="number" id="tcM" step="50" value="${YOU.milesMonth}">
    <label>Keep it for</label><div class="mtabs" id="tcY">${[1,3,5].map(n=>`<button data-y="${n}"${n===5?' class="on"':''}>${n} year${n>1?'s':''}</button>`).join('')}</div>
   </div><div class="out" id="tcOut"></div></div>
   <div class="mact"><button class="btn pri" id="tOk">Done</button></div>`,true);
  let how='cu',term=60,years=5;const close=()=>{closeModal();if(onDone)onDone();};G.modalClose=close;C.querySelector('#tx').onclick=close;C.querySelector('#tOk').onclick=close;
  const setCar=()=>{const c=carById($('#tcCar').value);$('#tcP').value=c.price;};setCar();
  const tab=(sel,attr,fn)=>C.querySelectorAll(sel+' button').forEach(b=>b.onclick=()=>{C.querySelectorAll(sel+' button').forEach(x=>x.classList.toggle('on',x===b));fn(b.dataset[attr]);run();});
  tab('#tcHow','h',v=>{how=v;$('#tcLoan').style.display=v==='cash'?'none':'';});tab('#tcT','n',v=>term=+v);tab('#tcY','y',v=>years=+v);
  const run=()=>{const c=carById($('#tcCar').value),kind=c.used?'used':'new',apr=how==='cash'?0:RATES[how][kind],miles=Math.max(0,+$('#tcM').value||0),
     fuelMo=c.fuel==='electric'?miles*KWH_MILE:miles/c.mpg*(c.fuel==='premium'?PREMIUM:GAS),q=insQuote(c);
    const R=tcoCompute({price:Math.max(0,+$('#tcP').value||0),down:Math.max(0,+$('#tcD').value||0),loanOn:how!=='cash',apr,term,years,miles:Math.max(1,miles),fuelMo,ins:how==='cash'?q.liab:q.full,maint:c.maint,dep:c.dep});
    const parts=[['Car (what it lost in value)',R.lost,'#60A5FA'],['Interest',R.interest,'#F87171'],['Usage tax + fees',R.tax+R.fees,'#A78BFA'],['Insurance',R.ins,'#2DD4BF'],[c.fuel==='electric'?'Charging':'Gas',R.fuel,'#FACC15'],['Upkeep + plates',R.upkeep,'#FB923C']],tot=parts.reduce((a,p)=>a+Math.max(0,p[1]),0)||1;
    $('#tcOut').innerHTML=`<small class="eyebrow">True cost over ${years} year${years>1?'s':''}</small><div class="big">${fmt(R.trueCost)}</div><div style="color:var(--txt2)">${fmt(R.perMo)}/month · ${(R.perMile*100).toFixed(0)}¢ per mile</div>
     <div class="tbars">${parts.map(p=>`<i style="width:${Math.max(0,p[1])/tot*100}%;background:${p[2]}" title="${p[0]}"></i>`).join('')}</div>
     ${parts.map(p=>`<div class="row"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${p[2]};margin-right:6px"></i>${p[0]}</span><b>${fmt(p[1])}</b></div>`).join('')}
     ${how!=='cash'?`<div class="row"><span>Monthly payment (${(apr*100).toFixed(1)}% APR)</span><b>${fmt(R.pay)}</b></div>`:''}${R.bal>1?`<div class="row"><span>Still owed after ${years} yr</span><b style="color:var(--red)">${fmt(R.bal)}</b></div>`:''}
     <div class="row"><span>Car is worth after ${years} yr</span><b>${fmt(R.value)}</b></div>
     <p class="set-n">${how==='cash'?'Paying cash means no interest, but keep an emergency fund too.':term>60?'Longer loans shrink the payment but add interest, and you may owe more than the car is worth.':'The monthly payment is only part of the story. Look at the total.'} Kentucky adds a 6% usage tax plus clerk fees when you buy.</p>`;};
  $('#tcCar').onchange=()=>{setCar();run();};['#tcP','#tcD','#tcM'].forEach(s=>$(s).oninput=run);run();}

/* ---------- careers ---------- */
const CAREERS=[
 {t:'Automotive service technician',i:'wrench',what:'Inspects, maintains and repairs cars and light trucks, like Mike at the garage.',path:'An automotive technology program at a community or technical college, or on-the-job training, plus industry certifications.',pay:'National median pay: $49,670 a year (May 2024)'},
 {t:'Car sales consultant',i:'handshake',what:'Helps buyers find the right car. Often paid partly on commission, so the more you sell, the more you make.',path:'Usually on-the-job training at a dealership. People skills and honesty build repeat customers.'},
 {t:'Finance and insurance manager',i:'doc',what:'Sets up the loan and sells add-ons at the dealership. Now you know exactly what that job involves.',path:'Often starts in sales. Needs strong math and knowledge of loans and lending rules.'},
 {t:'Credit union loan officer',i:'bank',what:'Reviews loan applications and helps members get a fair rate on a car.',path:'Usually a business or finance background, plus training on lending rules.'},
 {t:'Insurance agent',i:'shield',what:'Quotes and sells policies and helps drivers pick the right coverage.',path:'Needs a state insurance license. Many start right after high school or college.'},
 {t:'Collision repair technician',i:'car',what:'Fixes body damage after crashes: dents, panels and paint.',path:'A collision repair program or on-the-job training, plus certifications.'},
 {t:'EV technician',i:'battery',what:'Works on electric cars, including high-voltage batteries and charging systems.',path:'Starts with automotive training, then special high-voltage safety certification.'}];
function careers(onDone){const s=slotFill('career');const C=modal(`<button class="x" id="kx">×</button><div class="eyebrow">Car careers</div><h2>Every person on this lot has a real job</h2>${s?`<div class="note" style="border-left-color:${escS(s.color)}">Now hiring: <b style="color:${escS(s.color)}">${escS(s.name)}</b>${s.tagline?' · '+escS(s.tagline):''}</div>`:''}
  <div class="cc">${CAREERS.map(k=>`<div class="car"><b>${ic(k.i)} ${k.t}</b><p>${k.what}</p><small><b style="display:inline;font:inherit;color:var(--txt2)">How to get there:</b> ${k.path}</small>${k.pay?`<p class="set-n">${k.pay}</p>`:''}</div>`).join('')}</div>
  <div class="mact"><button class="btn pri" id="kOk">Close</button></div>`,true);const c=()=>{closeModal();if(onDone)onDone();};G.modalClose=c;C.querySelector('#kx').onclick=c;C.querySelector('#kOk').onclick=c;}

/* ---------- report card add-ons: 5-year cost + calculator + careers ---------- */
const _report=report;report=function(){_report();const D=G.deal;if(!D||D.method==='bus')return;const c=D.c,F=calcDeal(),kind=c.used?'used':'new';
  const R=tcoCompute({price:D.price+(D.addTotal||0),down:D.method==='cash'?0:(D.down||0),loanOn:D.method==='cu'||D.method==='dealer',apr:F.apr||0,term:F.n||60,years:5,miles:YOU.milesMonth,fuelMo:monthlyFuel(c),ins:F.ins,maint:c.maint,dep:c.dep});
  const box=document.createElement('div');box.innerHTML=`<div class="eyebrow" style="margin-top:14px">If you keep it 5 years</div>
   <div class="specs" style="grid-template-columns:repeat(3,1fr)"><div><em>True cost</em><b>${D.method==='lease'?'Lease':fmt(R.trueCost)}</b></div><div><em>Per month</em><b>${D.method==='lease'?fmt(F.all):fmt(R.perMo)}</b></div><div><em>Interest</em><b>${fmt(R.interest)}</b></div></div>`;
  const act=$('#modalCard .mact');if(act){act.parentNode.insertBefore(box,act);const b1=document.createElement('button');b1.className='btn';b1.innerHTML='🧮 Run the numbers';b1.onclick=()=>tcoCalc(c.id,()=>_report());const b2=document.createElement('button');b2.className='btn';b2.innerHTML='Car careers';b2.onclick=()=>careers(()=>_report());act.prepend(b2);act.prepend(b1);}};
