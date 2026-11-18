/* ===================== BotMotors · data =====================
   All money is per month unless it says otherwise. Fictional brands. */
const YOU = { name:'You', age:18, job:'Crew lead at Byte Burger', takeHome:3000, gross:3700, living:1650, savings:6500, credit:670, milesMonth:750 };
const GAS = 3.40, PREMIUM = 3.95, KWH_MILE = .055;
const TAX = .06, DOC_FEE = 399, TITLE_FEE = 150, INSPECT_FEE = 120;
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
   blurb:'The dream truck. Slick\'s favorite car to sell.', drive:{top:42, acc:10, grip:1, wobble:0}, issue:null }
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
    titan:['Now THIS is a vehicle. You\'ll need it for... stuff!','Tow anything! Do you tow things? You could!'] },
  drive:['Feel that? Go on, give it some gas!','Picture yourself driving this every day.','I can get you into this for a great monthly payment.','The speed limit is 35, by the way. Heh.'],
  counter:['Ooh, you\'re killing me. How about {p}?','My manager would fire me! Best I can do is {p}.','We\'re close! Meet me at {p}?'],
  lowball:['That\'s an insult to this beautiful machine!','Come on now. Be serious.'],
  accept:['You drive a hard bargain. Deal!','Ugh, fine. Shake on it!'],
  walk:['Wait wait wait! Come back. I talked to my manager...'],
  final:['That\'s my final offer. Take it or leave it.'],
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
