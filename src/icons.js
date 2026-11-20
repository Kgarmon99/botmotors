/* =====================================================================
   BOTFACTORY · icon set (24×24 line icons) + emoji → icon converter
   Used in HTML (ic / iconize) and drawn into 3D signs (drawIc).
   ===================================================================== */
const C=(cx,cy,r)=>`M${cx-r} ${cy}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`;
const IC={clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',target:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',wheel:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 3v6 M12 15v6 M3 12h6 M15 12h6',phone:'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M11 18h2',bank:'M3 10l9-6 9 6 M5 10v8 M9.5 10v8 M14.5 10v8 M19 10v8 M3 21h18 M3 18h18',bus:'M5 4h14a1 1 0 0 1 1 1v12H4V5a1 1 0 0 1 1-1z M4 11h16 M7 17v3 M17 17v3 M7 14h.01 M17 14h.01',tag:'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z M7.5 7.5h.01',book:'M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z M4 17a3 3 0 0 1 3-3h11 M8 8h6',shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',key:'M8 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z M11 10h10 M17 10v3 M20 10v2',mega:'M3 10v4h4l8 5V5L7 10z M18 9a4 4 0 0 1 0 6',cal:'M4 5h16v15H4z M4 10h16 M8 3v4 M16 3v4',down:'M3 7l6 6 4-4 8 8 M21 11v6h-6',heart:'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',spark:'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',question:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14 M12 17h.01',ban:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M5.6 5.6l12.8 12.8',checkc:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8 12l3 3 5-6',loop:'M12 4a8 8 0 1 0 8 8 M20 4v4h-4',walk:'M12 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z M9 22l2-7 3 3v4 M8 12l2-4h3l3 4 M11 8l-1 7',hook:'M12 3v11a4 4 0 1 1-8 0 M12 3l3 3',eyeoff:'M3 3l18 18 M10.6 6.1A10 10 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-3 3.5 M6.6 7.6C4.2 9.3 3 12 3 12s4 6 9 6a9 9 0 0 0 4.2-1',bottle:'M10 3h4v3l2 3v12H8V9l2-3z M8 13h8',burst:'M12 2l2 6 6-3-3 6 6 1-6 3 3 6-6-3-2 6-2-6-6 3 3-6-6-3 6-1-3-6 6 3z',fuel:'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16 M3 21h12 M7 8h4 M14 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3',medal:'M12 13a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z M8 2l3 8 M16 2l-3 8 M7 2h4 M13 2h4',scan:'M4 8V4h4 M16 4h4v4 M20 16v4h-4 M8 20H4v-4 M7 12h10',notes:'M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h4',calc:'M5 3h14v18H5z M8 7h8 M8 11h.01 M12 11h.01 M16 11h.01 M8 15h.01 M12 15h.01 M16 15h.01 M8 18h8',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',road:'M8 3L5 21 M16 3l3 18 M12 4v3 M12 10v3 M12 16v3',grad:'M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5 M22 9v6',fhappy:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 10h.01 M15.5 10h.01 M8 14.5a5 5 0 0 0 8 0',fok:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 10h.01 M15.5 10h.01 M8.5 14.5c1 1 2.2 1.4 3.5 1.4s2.5-.4 3.5-1.4',fmeh:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 10h.01 M15.5 10h.01 M8.5 15h7',fsad:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 10h.01 M15.5 10h.01 M8 16.5a5 5 0 0 1 8 0',fmad:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 10h.01 M15.5 10h.01 M8 16.5a5 5 0 0 1 8 0 M7.5 8l3 1.5 M16.5 8l-3 1.5',fworry:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 10h.01 M15.5 10h.01 M8.5 14.5h7v2h-7z',fcool:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M5.5 9.5h13 M6.5 9.5v1.5a2 2 0 0 0 4 0V9.5 M13.5 9.5v1.5a2 2 0 0 0 4 0V9.5 M9 15.5a4 4 0 0 0 6 0',
  laser:'M8 2h8v5l-2.5 3h-3L8 7z M12 10v7 M7 21h10 M5.5 16.5l3-1 M18.5 16.5l-3-1 M12 3.5v2',
  flame:'M12 2.5c1 3 5.5 5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.5 1.2-3.8 2.2-4.8 0 2 .8 3.3 2.3 3.3-1-3.3.2-6.3 1-9z',
  gear:C(12,12,3.2)+' M12 2.5v3 M12 18.5v3 M4.6 4.6l2.1 2.1 M17.3 17.3l2.1 2.1 M2.5 12h3 M18.5 12h3 M4.6 19.4l2.1-2.1 M17.3 6.7l2.1-2.1',
  bolt:'M13 2L4.5 13.5h6.5l-1 8.5 8.5-11.5h-6.5z',
  spray:'M3 8h9v4.5H3z M12 9.5h3 M7 12.5v6h3.5 M18 6.5l3-1 M18 10l3 1.2 M18 8.2h3.2',
  scan:C(10.5,10.5,6)+' M15 15l6 6 M7.5 10.5h6',
  robot:'M6 8h12v10H6z M12 4.5V8 M12 3.5v.01 M9.5 12v1 M14.5 12v1 M9.5 15.5h5 M3.5 11v4 M20.5 11v4',
  kart:'M2.5 15h19 M5 15l2-5h6l2.5 3H20 M9 10V7h3'+' '+C(7,18,2)+' '+C(17,18,2),
  drone:'M9.5 10h5v4h-5z M5 6l4.5 4 M19 6l-4.5 4 M5 18l4.5-4 M19 18l-4.5-4 M2.5 6h5 M16.5 6h5 M2.5 18h5 M16.5 18h5',
  scooter:C(6,18,2)+' '+C(18,18,2)+' M8 18h8 M18 16L15.5 5H19',
  dog:'M4 11h11v5H4z M15 9h4l1.5 3H15 M5 16v4.5 M8.5 16v4.5 M11.5 16v4.5 M14 16v4.5 M4 11L2 8.5',
  car:'M3 16v-3.5L5 8h14l2 4.5V16z M6.5 8.5l1-3h9l1 3 M5 16v2.5 M19 16v2.5 M6.5 12.5h1 M16.5 12.5h1',
  agv:'M2.5 11h19v5h-19z M5.5 16v2.5 M18.5 16v2.5 M7.5 11V7h9v4 M10 5h4',
  monitor:'M2.5 4h19v12h-19z M8 20.5h8 M12 16v4.5 M6.5 12l3.5-3.5 3 2.5 4.5-4.5',
  cube:'M12 2l9 5v10l-9 5-9-5V7z M12 22V12 M21 7l-9 5-9-5',
  truck:'M1.5 6.5h12v9.5h-12z M13.5 10h4l3.5 3.5V16h-7.5 '+C(6,18,2)+' '+C(17,18,2),
  forklift:'M3 10h7l2 4v4H3z M12.5 4v14 M12.5 18h8 M16 4v14 M5 10V6h4 '+C(6,19.5,1.6),
  warn:'M12 2.5l10 18.5H2z M12 9.5v5.5 M12 18v.5',
  wrench:'M15 2.5a5.5 5.5 0 0 0-5 7L2.5 17v4.5H7l7.5-7.5a5.5 5.5 0 0 0 7-5l-3.2 2.2-3.5-3.5 2.2-3.2z',
  worker:'M6.5 11a5.5 5.5 0 0 1 11 0z M5 11h14 M12 5.5V3.5 M9 14a3 3 0 0 0 6 0 M5.5 21.5a6.5 6.5 0 0 1 13 0',
  contract:'M8 3h8v3.5H8z M6 4.5H4.5v17h15v-17H18 M8 11h8 M8 15h6',
  chart:'M4.5 20V10 M10.5 20V4 M16.5 20v-7 M2.5 20.5h19',
  trend:'M3 17l6-6 4 4 8-8 M15 7h6v6',
  upgrade:'M12 18V4 M6 10l6-6 6 6 M5 21h14',
  crane:'M5 21V4.5 M5 4.5h15 M5 9l4.5-4.5 M17 4.5V11 M15 11h4v4h-4z M2 21h8',
  factory:'M2.5 21V11l5 3v-3l5 3v-3l5 3V4h3.5v17z M6.5 18h2 M11.5 18h2 M16.5 18h2',
  cash:'M2.5 6h19v12h-19z '+C(12,12,3)+' M5.5 9v.01 M18.5 15v.01',
  crate:'M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10',
  lock:'M5.5 11h13v10h-13z M8 11V7.5a4 4 0 0 1 8 0V11',
  clock:C(12,12,9)+' M12 7v5l3.5 2',
  pause:'M8 5v14 M16 5v14',
  eye:'M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12z '+C(12,12,3),
  target:C(12,12,9)+' '+C(12,12,4.5)+' M12 11.5v1',
  bulb:'M9 18h6 M10 21h4 M12 2.5a6.2 6.2 0 0 0-4 11c1 1 1 2 1 3h6c0-1 0-2 1-3a6.2 6.2 0 0 0-4-11z',
  magnet:'M4.5 3.5h4.5v8.5a3 3 0 0 0 6 0V3.5h4.5V12a7.5 7.5 0 0 1-15 0z M4.5 8h4.5 M15 8h4.5',
  molten:'M12 2.5c3 4 6.5 7.5 6.5 11.5a6.5 6.5 0 0 1-13 0c0-4 3.5-7.5 6.5-11.5z M9 15a3 3 0 0 0 3 3',
  home:'M3 11l9-8 9 8 M5 9.5V21h14V9.5 M10 21v-6h4v6',
  pin:'M12 21.5s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z '+C(12,9.5,2.8),
  handshake:'M2 10.5l4-3.5 4 2 4-2 4 3.5 4-1 M6 12.5l4 4 2-1 2 2 2-1.5 2 1 3.5-3.5 M2 10.5l4.5 6',
  battery:'M2.5 7h16v10h-16z M21 10v4 M6.5 10v4 M10.5 10v4',
  plug:'M9 2v6 M15 2v6 M5.5 8h13v4a6.5 6.5 0 0 1-13 0z M12 18.5v3.5',
  chip:'M7 7h10v10H7z M10 3v4 M14 3v4 M10 17v4 M14 17v4 M3 10h4 M3 14h4 M17 10h4 M17 14h4',
  wheel:C(12,12,9)+' '+C(12,12,3)+' M12 3v6 M12 15v6 M3 12h6 M15 12h6',
  seat:'M7 3.5h6v9.5H7z M5 13h12v3H5z M7 16v5 M15 16v5',
  camera:'M2.5 7h4.5l2-3h6l2 3h4.5v13h-19z '+C(12,13.5,4),
  recycle:'M7 19.5H3.5L7 14 M17 19.5h3.5L17 14 M9 5l3-2.5 3 2.5 M8 13l4-7 4 7 M7 19.5h10',
  trophy:'M7 3.5h10V9a5 5 0 0 1-10 0z M7 5.5H4a3 3 0 0 0 3 4 M17 5.5h3a3 3 0 0 1-3 4 M12 14v4 M8 21h8',
  ruler:'M3 17L17 3l4 4L7 21z M7 13l2 2 M10 10l2 2 M13 7l2 2',
  flask:'M9 2.5h6 M10 2.5V9L4 19a2 2 0 0 0 2 2.5h12A2 2 0 0 0 20 19L14 9V2.5 M7 15h10',
  map:'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15',
  gear:'M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z M12 2.5v3 M12 18.5v3 M2.5 12h3 M18.5 12h3 M5.3 5.3l2.1 2.1 M16.6 16.6l2.1 2.1 M5.3 18.7l2.1-2.1 M16.6 7.4l2.1-2.1',washer:'M5 3h14v18H5z M5 7h14 M8 5h1 M12 14m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M10.5 13.5c.8.8 2.2.8 3 0',jet:'M21 15.5L13 11V5.5a1.5 1.5 0 0 0-3 0V11l-8 4.5V17l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4.5l8 2.5z',music:'M9 18V5l11-2v13 M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z M20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z M9 9l11-2',sound:'M3.5 9h4l5.5-4.5v15L7.5 15h-4z M16.5 9a4 4 0 0 1 0 6 M19 6a8 8 0 0 1 0 12',
  mute:'M3.5 9h4l5.5-4.5v15L7.5 15h-4z M16.5 9.5l5 5 M21.5 9.5l-5 5',
  play:'M7 4l13 8-13 8z',
  fan:C(12,12,2)+' M12 10c0-4 2-7 5-7 M14 12c4 0 7 2 7 5 M12 14c0 4-2 7-5 7 M10 12c-4 0-7-2-7-5',
  coil:C(12,12,9)+' '+C(12,12,5)+' '+C(12,12,1.5),
  steel:'M3 8l9-4 9 4-9 4z M3 12l9 4 9-4 M3 16l9 4 9-4',
  star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  check:'M4 12.5l5 5L20 6.5',
  x:'M5 5l14 14 M19 5L5 19',
  doc:'M6 2.5h8l4 4v15H6z M14 2.5v4h4 M9 12h6 M9 16h6',
  skull:'M12 3a7 7 0 0 0-7 7v4l2 2v3h10v-3l2-2v-4a7 7 0 0 0-7-7z M9 11v1 M15 11v1 M10.5 19v-2 M13.5 19v-2'
};
const FILL=new Set(['play','bolt','star']);
/* emoji → icon (the codebase writes emojis; the player sees icons) */
const EMO={'📱':'phone','🏦':'bank','🚌':'bus','🏷':'tag','📕':'book','📒':'notes','📋':'doc','🛡':'shield','🔑':'key','📣':'mega','📅':'cal','📉':'down','💸':'cash','❤':'heart','✨':'spark','❔':'question','❓':'question','❌':'x','🚫':'ban','✅':'checkc','🪀':'loop','🚶':'walk','🎣':'hook','🙈':'eyeoff','🧴':'bottle','🦝':'eyeoff','💥':'burst','🎧':'music','⛽':'fuel','📸':'camera','🥇':'medal','🥈':'medal','🥉':'medal','😄':'fhappy','🙂':'fok','😐':'fmeh','😕':'fsad','😠':'fmad','😎':'fcool','😤':'fmad','😬':'fworry','😏':'fok','🔻':'down','🚙':'car','🎵':'music','🧮':'calc','🎓':'grad','🛣':'road','🔦':'laser','⚡':'bolt','🔥':'flame','🔩':'gear','⚙':'gear','🎨':'spray','🔍':'scan','🤖':'robot','🏎':'kart','🛸':'drone','🚁':'drone','🌀':'fan','🛴':'scooter','🐕':'dog','🚗':'car','🧺':'washer','✈':'jet','✈️':'jet','🛻':'agv','🖥':'monitor','💻':'monitor','🧿':'cube','🚚':'truck','🚜':'forklift',
  '⚠':'warn','⏰':'clock','⏳':'clock','⏸':'pause','🔧':'wrench','🛠':'wrench','🧰':'wrench','👷':'worker','🧑‍🏭':'worker','🧑':'worker','📄':'contract','📊':'chart','📈':'trend','⬆':'upgrade','🏗':'crane','🏭':'factory','💵':'cash','💰':'cash','📦':'crate','🔒':'lock',
  '👀':'eye','🎯':'target','💡':'bulb','🧲':'magnet','🌋':'molten','🏠':'home','📍':'pin','🤝':'handshake','🔋':'battery','🔌':'plug','🧠':'chip','🛞':'wheel','🪑':'seat','📷':'camera','♻':'recycle','🏆':'trophy','📐':'ruler','🧪':'flask','🗺':'map','🔊':'sound','🔇':'mute','▶':'play','🔩️':'gear','😱':'warn','😵':'x','🕶':'eye','🦾':'robot'};
const EMO_RE=/(?:\p{Extended_Pictographic}(?:️)?(?:‍\p{Extended_Pictographic}(?:️)?)*)|[▶⬆]️?/gu;
function ic(n,c){const d=IC[n];if(!d)return '';return `<svg class="ic ${FILL.has(n)?'fill':''} ${c||''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;}
function emoName(e){e=e.replace(/️/g,'');return EMO[e]||EMO[e.split('‍')[0]]||null;}
function iconize(html){if(html==null)return '';return String(html).replace(EMO_RE,m=>{const n=emoName(m);return n?ic(n):'';});}
/* canvas: pull a leading emoji off a label so we can draw a real icon instead */
function leadIcon(t){t=String(t);const m=t.match(/^\s*((?:\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*)|[▶⬆]️?)\s*/u);if(!m)return {n:null,t:t.replace(EMO_RE,'').trim()};return {n:emoName(m[1]),t:t.slice(m[0].length).replace(EMO_RE,'').trim()};}
const P2D={};
function drawIc(g,n,x,y,s,color,lw){const d=IC[n];if(!d)return;const p=P2D[n]||(P2D[n]=new Path2D(d));g.save();g.translate(x,y);g.scale(s/24,s/24);g.lineCap='round';g.lineJoin='round';g.lineWidth=lw||2.2;g.strokeStyle=color||'#fff';
  if(FILL.has(n)){g.fillStyle=color||'#fff';g.fill(p);}else g.stroke(p);g.restore();}

/* swap emoji in any text that lands in the page for drawn icons */
function iconizeNode(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),hits=[];let n;while(n=w.nextNode()){if(n.parentNode&&/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(n.parentNode.nodeName))continue;EMO_RE.lastIndex=0;if(EMO_RE.test(n.nodeValue))hits.push(n);}
  hits.forEach(t=>{const tpl=document.createElement('template');tpl.innerHTML=iconize(t.nodeValue.replace(/&/g,'&amp;').replace(/</g,'&lt;'));t.replaceWith(tpl.content);});}
function watchIcons(){iconizeNode(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData'){if(m.target.parentNode)iconizeNode(m.target.parentNode);}else m.addedNodes.forEach(a=>{if(a.nodeType===1)iconizeNode(a);else if(a.nodeType===3&&a.parentNode)iconizeNode(a.parentNode);});}}).observe(document.body,{childList:true,subtree:true,characterData:true});}
