/* ---------- settings + saves (loaded first so everything can use them) ---------- */
const VERSION='1.1.0';
const PARAMS=new URLSearchParams(location.search);
var BOOT_TIPS=['The sticker price is the opening offer, not the price.','Get pre-approved at a credit union before you shop. Then the dealer can\'t hide profit in your rate.',
  'Keep everything a car costs (payment, insurance, gas, repairs) under about 15% of take-home pay.','A $120 inspection can uncover a $2,400 repair.','Negotiate the out-the-door price first. Talk monthly payments last.',
  'Longer loans mean smaller payments, but way more interest.','In Kentucky, a 6% usage tax is added when you buy a car.','Paint protection and VIN etching are almost never worth it.','Insurance for a fast car at 18 can cost more than the payment.'];
var BOOT_MSG=[[0,'Paving the lot…'],[18,'Washing the cars…'],[40,'Pumping up the tires…'],[60,'Waking up Slick…'],[90,'Opening the gates…']];

const SET=(()=>{const d={vol:.9,gfx:-1,shake:true,tips:true};try{return Object.assign(d,JSON.parse(localStorage.getItem('bm_settings')||'{}'));}catch(e){return d;}})();
function saveSet(){try{localStorage.setItem('bm_settings',JSON.stringify(SET));}catch(e){}}
let STORY_SLOT=(()=>{try{return +(JSON.parse(localStorage.getItem('bm_storySlot'))||1)||1;}catch(e){return 1;}})();
const storyKey=n=>(n||STORY_SLOT)===1?'story':'story_s'+(n||STORY_SLOT);
function aOut(){if(!AC.__m){AC.__m=AC.createGain();AC.__m.gain.value=SET.vol;AC.__m.connect(AC.destination);}return AC.__m;}
/* ===================== BotMotors · data =====================
   All money is per month unless it says otherwise. Fictional brands. */
const YOU = { name:'You', age:18, job:'Crew lead at Byte Burger', takeHome:3000, gross:3700, living:1650, savings:6500, credit:670, milesMonth:750 };
const GAS = 3.40, PREMIUM = 3.95, KWH_MILE = .055;
const TAX = .06, DOC_FEE = 399, INSPECT_FEE = 120;
/* Kentucky county clerk fees (title $9, yearly registration $21, lien statement $22, notary $2) */
const KY={usage:.06, title:9, reg:21, lien:22, notary:2};
const TITLE_FEE = KY.title+KY.reg+KY.lien+KY.notary;
const GOOD_PCT = .15;          // keep ALL car costs under ~15% of take-home
const RATES = { dealer:{used:.119, new:.089}, cu:{used:.084, new:.069} };   // APR for a 670 score
const CARS = [
 { id:'rattler', name:'ScrapCo Rattler', year:2011, style:'hatch', color:'#8B5E3C', price:3200, floor:2500, miles:168000, mpg:24, fuel:'gas', rel:1, fun:2, ins:110, maint:70, dep:.08, used:true, asis:true,
   blurb:'Rusty traded this one in. Sold as-is: no warranty, no returns.', drive:{top:30, acc:7, grip:.9, wobble:.8},
   issue:{p:.85, what:'Transmission is slipping', cost:2400, from:2, to:5, tell:'It shudders and slips when you speed up.'} },
 { id:'commuter', name:'Zapp Commuter', year:2015, style:'sedan', color:'#64748B', price:7400, floor:6300, miles:118000, mpg:33, fuel:'gas', rel:3, fun:2, ins:120, maint:55, dep:.10, used:true,
   blurb:'Boring, cheap to run, gets you to work.', drive:{top:36, acc:8, grip:1, wobble:.15},
   issue:{p:.6, what:'Worn brakes and tires', cost:780, from:3, to:8, tell:'The brakes squeal and it pulls a little to the left.'} },
 { id:'volt', name:'Volt Hatch', year:2019, style:'hatch', color:'#0EA5E9', price:12900, floor:11400, miles:61000, mpg:36, fuel:'gas', rel:4, fun:3, ins:145, maint:40, dep:.11, used:true,
   blurb:'One owner, service records in the glovebox.', drive:{top:40, acc:9.5, grip:1.1, wobble:0},
   issue:{p:.15, what:'Faulty oxygen sensor', cost:240, from:4, to:11, tell:''} },
 { id:'thunder', name:'Thunder GT V8', year:2017, style:'coupe', color:'#DC2626', price:16900, floor:15200, miles:72000, mpg:19, fuel:'premium', rel:3, fun:5, ins:290, maint:75, dep:.12, used:true,
   blurb:'Loud, fast, and the insurance company knows it.', drive:{top:52, acc:15, grip:1.15, wobble:.1},
   issue:{p:.45, what:'Clutch is worn out', cost:1600, from:3, to:9, tell:'There\'s a hot burning smell when you take off.'} },
 { id:'echo', name:'Echo EV', year:2021, style:'ev', color:'#F8FAFC', price:19500, floor:17600, miles:38000, mpg:0, fuel:'electric', rel:4, fun:4, ins:190, maint:20, dep:.15, used:true,
   blurb:'Battery health 91%. Charge at home for about 5¢ a mile.', drive:{top:44, acc:14, grip:1.2, wobble:0},
   issue:{p:.08, what:'12-volt battery died', cost:220, from:5, to:12, tell:''} },
 { id:'nova', name:'Nova Sedan', year:2026, style:'sedan', color:'#1E3A8A', price:26400, floor:24400, miles:12, mpg:34, fuel:'gas', rel:5, fun:3, ins:210, maint:15, dep:.19, used:false, warranty:true, markup:1200,
   blurb:'Brand new. 3-year warranty. Lease special available.', drive:{top:44, acc:11, grip:1.15, wobble:0},
   lease:{due:2500, mo:299, months:36, milesYr:10000}, issue:null },
 { id:'titan', name:'Titan Pickup', year:2026, style:'truck', color:'#111827', price:43900, floor:41300, miles:8, mpg:20, fuel:'gas', rel:4, fun:4, ins:250, maint:35, dep:.18, used:false, warranty:true, markup:2500,
   blurb:'The dream truck. Slick\'s favorite car to sell.', drive:{top:42, acc:10, grip:1, wobble:0}, issue:null },
 { id:'workhorse', name:'Workhorse 1500', year:2014, style:'truck', color:'#4B5E4A', price:11800, floor:10300, miles:142000, mpg:17, fuel:'gas', rel:3, fun:3, ins:150, maint:70, dep:.09, used:true, cargo:true,
   blurb:'Work truck. Ladder rack, toolbox, a few honest dents.', drive:{top:38, acc:8.5, grip:.95, wobble:.12},
   issue:{p:.5, what:'Rusted brake lines', cost:900, from:2, to:7, tell:'The brake pedal feels soft and sinks a little.'} }
];
CARS.forEach(c=>{ c.ins0=c.ins; if(c.style==='truck'||c.style==='hatch') c.cargo=true; });
const RATES0 = JSON.parse(JSON.stringify(RATES));
/* three lives to play. Same lot, different right answers. */
const PROFILES = [
 { id:'crew', name:'Jordan', age:18, job:'Crew lead at Byte Burger', takeHome:3000, gross:3700, living:1650, savings:6500, credit:670, milesMonth:750, insMul:1, busOk:false, diff:'Normal', col:'#BBF7D0',
   need:'25-minute drive to work. The bus takes 70 minutes each way.' },
 { id:'student', name:'Riley', age:19, job:'Bot U student + part-time at the bookstore', takeHome:2100, gross:2350, living:1150, savings:5200, credit:650, milesMonth:450, insMul:.85, busOk:true, diff:'Hard', col:'#C7D2FE',
   need:'Classes and work are both on the bus line. Good-student insurance discount.' },
 { id:'appr', name:'Sam', age:21, job:'Apprentice electrician', takeHome:3600, gross:4500, living:1900, savings:9000, credit:705, milesMonth:1100, insMul:.8, busOk:false, needsCargo:true, diff:'Easy', col:'#FDE68A',
   need:'Hauls tools to a different job site every day. Needs room for gear.' }
];
const BUS = { id:'bus', name:'Bus pass', year:'', price:0, floor:0, ins:0, ins0:0, maint:0, fun:1, rel:4, dep:0, fuel:'bus', used:false, issue:null, style:'bus' };
/* choices that come up during year one */
const DECISIONS = [
 { id:'shop', best:[0], when:[2,4], q:'Your insurance renews next month. Spend 30 minutes comparing quotes?', a:[
   {t:'Compare quotes', fx:{insMul:.86}, msg:'Found the same coverage for 14% less.', lesson:'Insurers price the same driver differently. Shopping around every year is free money.'},
   {t:'Just auto-renew', fx:{insMul:1.05}, msg:'Auto-renewed with a 5% "loyalty" increase.', lesson:'Auto-renewal often quietly raises your rate.'} ] },
 { id:'rims', best:[1], when:[3,6], q:'A friend is selling custom rims and a sound system for $900. Want them?', a:[
   {t:'Buy them ($900)', fx:{cost:900, joy:1}, msg:'Looks amazing. Your savings, less so.', lesson:'Upgrades feel great for a week. The money is gone for good.'},
   {t:'Pass', fx:{}, msg:'You kept $900 in savings.', lesson:'Saying no to a want protects your emergency fund.'} ] },
 { id:'light', best:[0], when:[4,7], q:'The check-engine light just came on. What do you do?', a:[
   {t:'Get it checked now ($180)', fx:{cost:180}, msg:'Loose sensor. Fixed for $180.', lesson:'Small problems fixed early stay small.'},
   {t:'Ignore it', fx:{risk:{p:.55, cost:950, what:'Ignored warning light became a $950 repair'}}, msg:'Light stays on. Fingers crossed.', lesson:'Ignoring a warning light is a bet. The house usually wins.'} ] },
 { id:'bonus', best:[0,1], when:[6,9], q:'You got a $600 bonus at work! What will you do with it?', a:[
   {t:'Extra car-loan payment', fx:{extraPay:600, needsLoan:true}, msg:'$600 straight to the loan principal.', lesson:'Extra payments cut your balance and every future interest charge.'},
   {t:'Put it in savings', fx:{save:600}, msg:'Emergency fund +$600.', lesson:'Cash in savings is what keeps a repair off a credit card.'},
   {t:'Weekend trip!', fx:{joy:1}, msg:'Great memories. $600 well spent? You decide.', lesson:'Spending on fun is fine when it\'s a choice, not an accident.'} ] },
 { id:'friend', best:[1], when:[5,10], q:'Your friend wants to borrow your car for a road trip.', a:[
   {t:'Sure, take it', fx:{risk:{p:.35, cost:500, what:'Friend backed into a pole · $500 deductible', ins:15}}, msg:'Keys handed over.', lesson:'When someone else drives your car, your insurance pays and your rate can go up.'},
   {t:'Sorry, no', fx:{}, msg:'Awkward, but your car stayed home.', lesson:'Your car, your insurance, your risk.'} ] }
];

const ADDONS = [
 { id:'warranty', name:'Extended warranty', price:1995, real:'Covers big repairs on a used car. Only worth it if the car is likely to break and you can\'t cover a repair yourself.', usedOnly:true },
 { id:'paint', name:'Paint protection', price:599, real:'Basically a wax job. You can buy a bottle of sealant for $25.' },
 { id:'etch', name:'VIN window etching', price:299, real:'Etches the VIN on the windows to deter theft. A DIY kit costs about $25.' },
 { id:'nitro', name:'Nitrogen-filled tires', price:199, real:'Regular air is already 78% nitrogen. Almost no benefit.' }
];
const SLICK = {
  hello:['Welcome to Bot City Motors! I\'m Slick. Every car here is a great deal. Trust me.','Looking for wheels? You came to the right lot. I\'m Slick!'],
  pitch:{ rattler:['She\'s got character! And I\'m practically giving her away.','As-is means as-AWESOME.'],
    commuter:['Sensible! Your mom would love this one.','Thirty-three miles a gallon. Your wallet says thank you.'],
    volt:['One owner! Records and everything. A smart buy.','Zippy, right? And cheap to run.'],
    thunder:['FEEL THAT V8! You deserve this.','Imagine pulling up to work in THIS. Only a little more a month!'],
    echo:['Silent and quick! Never buy gas again.','Instant torque, baby!'],
    nova:['Smell that new-car smell! Smells like... payments. I mean SUCCESS.','Brand new, warranty, the works.'],
    workhorse:['Built for work! Look at that toolbox.','A truck that pays for itself. Probably!'],
    titan:['Now THIS is a vehicle. You\'ll need it for... stuff!','Tow anything! Do you tow things? You could!'] },
  drive:['Feel that? Go on, give it some gas!','Picture yourself driving this every day.','I can get you into this for a great monthly payment.','The speed limit is 35, by the way. Heh.'],
  counter:['Ooh, you\'re killing me. How about {p}?','My manager would fire me! Best I can do is {p}.','We\'re close! Meet me at {p}?'],
  lowball:['That\'s an insult to this beautiful machine!','Come on now. Be serious.'],
  accept:['You drive a hard bargain. Deal!','Ugh, fine. Shake on it!'],
  walk:['Wait wait wait! Come back. I talked to my manager...'],
  final:['That\'s my final offer. Take it or leave it.'],
  tactics:{
    rival:'Heads up, that bot by the window asked about this exact car ten minutes ago. If you want it, decide NOW.',
    manager:'Let me go talk to my manager. Wait right here...',
    payment:'Forget the price. What MONTHLY payment works for you? I can make anything fit!' },
  mood:['😤','😬','😏','😎'],
  monthly:['So what monthly payment were you hoping for? I can make ANY car fit!']
};
const EVENTS = [
 { id:'flat', p:.18, what:'Flat tire on the way to work', cost:180 },
 { id:'gasup', p:.12, what:'Gas prices jumped this month', gas:1.25 },
 { id:'ticket', p:0, what:'Speeding ticket', cost:150, insUp:25 },
 { id:'fender', p:0, what:'Fender bender in the parking lot', cost:500 },
 { id:'carwash', p:.1, what:'You treated the car to a detail', cost:60, joy:true }
];
const fmt = (n,d=0)=> (n<0?'-':'')+'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const pmt = (P, apr, n)=>{ if(P<=0) return 0; const r=apr/12; return r? P*r/(1-Math.pow(1+r,-n)) : P/n; };
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rand=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const BUS_RAIN = { id:'rain', best:[1], when:[2,6], q:'Pouring rain all week and your stop has no roof. Rideshare to work instead?', a:[
   {t:'Rideshare all week ($75)', fx:{cost:75}, msg:'Dry and on time. $75 lighter.', lesson:'Rideshares add up fast. Five trips can cost more than a month of bus fare.'},
   {t:'Umbrella and boots', fx:{}, msg:'Soggy socks, full wallet.', lesson:'A $20 umbrella beat $75 of rideshares.'} ] };
const MEDAL=['','🥉','🥈','🥇'];
