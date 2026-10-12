/* ---------- fish on stage (관상어 데이, v0.9) ----------
   The painted fish (Gemini sheets, all facing left) swim in a tank drawn to scale: a 35cm oscar
   in a 60cm tank fills it. Water colour follows water quality. Disease is painted on the body
   (white spots, gold dust, cotton, raised scales, eaten fins, pits, a bent spine).
   Deaths are drawn plainly, without cartoon words: floating belly-up, dried on the floor,
   in the bag, in the bucket, in the freezer. No blood. */
let FISH_BASE='img/fish/';
const FISHART={"oranda":{"swim":[420,323],"young":[420,296],"sick":[420,313],"dead":[420,186]},"comet":{"swim":[420,235],"young":[420,236],"sick":[420,271],"dead":[420,243]},"ryukin":{"swim":[390,350],"young":[420,339],"sick":[327,350],"dead":[420,260]},"betta":{"swim":[420,345],"young":[420,281],"sick":[249,350],"dead":[420,204]},"wildbetta":{"swim":[420,192],"young":[420,150],"sick":[420,176],"dead":[420,114]},"guppy":{"swim":[420,295],"young":[420,162],"sick":[420,309],"dead":[420,154]},"neon":{"swim":[420,201],"young":[420,177],"sick":[420,198],"dead":[420,103]},"platy":{"swim":[420,232],"young":[420,216],"sick":[420,194],"dead":[420,155]},"cory":{"swim":[420,237],"young":[420,245],"sick":[420,192],"dead":[420,116]},"altum":{"swim":[227,350],"young":[286,350],"sick":[251,350],"dead":[420,243]},"oscar":{"swim":[420,255],"young":[420,276],"sick":[420,297],"dead":[420,191]},"pleco":{"swim":[420,222],"young":[420,225],"sick":[420,152],"dead":[420,125]},"arowana":{"swim":[420,139],"young":[420,135],"sick":[420,136],"dead":[420,88]},"koi":{"swim":[420,232],"young":[420,224],"sick":[420,257],"dead":[420,146]},"channa":{"swim":[420,119],"young":[420,118],"sick":[420,125],"dead":[420,90]},"peapuffer":{"swim":[420,212],"young":[420,189],"sick":[420,202],"dead":[420,139],"puff":[420,338]},"fig8":{"swim":[420,214],"young":[420,235],"sick":[420,258],"dead":[420,153],"puff":[420,328]},"clownloach":{"swim":[420,202],"young":[420,191],"sick":[420,205],"dead":[420,131]},"bichir":{"swim":[420,132],"young":[420,122],"sick":[420,107],"dead":[420,89]},"ghost":{"swim":[420,100],"young":[420,102],"sick":[420,113],"dead":[420,79]},"motoro":{"swim":[420,239],"young":[420,232],"sick":[420,254],"dead":[420,238]},"apisto":{"swim":[412,350],"young":[420,214],"sick":[420,274],"dead":[420,141]},"gar":{"swim":[420,112],"young":[420,109],"sick":[420,93],"dead":[420,76]}};
function preloadFish(){if(typeof Image==='undefined')return;const a=FISHART[S.sp.id];if(!a)return;Object.keys(a).forEach(p=>{const i=new Image();i.src=FISH_BASE+S.sp.id+'-'+p+'.webp'})}
const fq=v=>Pt.n(v);
/* fish are drawn 1.45× their true scale against the tank so small fish stay visible; the ratio between fish and tank is kept */
const FZ=1.45;
let FUID=0;
function fishDefs(){
  rasterFilters();
  Pt.def('f-pale','<filter id="f-pale"><feColorMatrix type="saturate" values=".25"/><feComponentTransfer><feFuncR type="linear" slope=".7" intercept=".28"/><feFuncG type="linear" slope=".7" intercept=".28"/><feFuncB type="linear" slope=".7" intercept=".27"/></feComponentTransfer></filter>');
  Pt.def('f-dark','<filter id="f-dark"><feComponentTransfer><feFuncR type="linear" slope=".45"/><feFuncG type="linear" slope=".45"/><feFuncB type="linear" slope=".5"/></feComponentTransfer></filter>');
  Pt.def('f-blur','<filter id="f-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>');
  Pt.def('f-soft','<filter id="f-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".6"/></filter>');
}
/* one painted fish. px = body length on stage. Returns svg centred on 0,0 (facing left).
   o: {ov: disease overlay, fin: 0–1 eaten fins, filter, thin, bent, flipV} */
function fishSprite(id,pose,px,o){
  o=o||{};const A=FISHART[id];if(!A)return '';
  if(!A[pose]) pose=pose==='puff'?'swim':pose==='young'?'swim':'dead';
  const [iw,ih]=A[pose];
  let w=px,h=px*ih/iw; if(ih>iw*1.2){h=px*.95;w=h*iw/ih}
  const x0=-w/2,y0=-h/2,href=FISH_BASE+id+'-'+pose+'.webp',uid='fs'+(FUID++);
  let filt=o.filter||'';
  const ov=o.ov||'';
  if(!filt){if(ov==='pale'||ov==='sunken')filt='f-pale';else if(ov==='dark')filt='f-dark'}
  const img=`<image href="${href}" x="${fq(x0)}" y="${fq(y0)}" width="${fq(w)}" height="${fq(h)}"${filt?` filter="url(#${filt})"`:''}/>`;
  let defs='',clip='';
  const fin=clamp(o.fin||0,0,1);
  if(fin>.05||ov==='finrot'){
    const k=Math.max(fin,ov==='finrot'?.45:0),xe=x0+w*(1-.3*k);
    let d=`M${fq(x0-2)} ${fq(y0-2)}L${fq(xe)} ${fq(y0-2)}`;for(let i=0;i<=8;i++){const y=y0+h*i/8;d+=`L${fq(xe-(i%2?w*.05*k:0)-w*.04*k*Math.sin(i*1.7))} ${fq(y)}`}d+=`L${fq(x0-2)} ${fq(y0+h+2)}Z`;
    defs+=`<clipPath id="${uid}c"><path d="${d}"/></clipPath>`;clip=` clip-path="url(#${uid}c)"`;
  }
  defs+=`<mask id="${uid}m" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="${fq(x0-4)}" y="${fq(y0-4)}" width="${fq(w+8)}" height="${fq(h+8)}">${img.replace(/ filter="[^"]*"/,'')}</mask>`;
  let over='';
  const cx=x0+w*.5,cy=y0+h*.52,rx=w*.42,ry=h*.38;
  const seed=n=>{let s=n;return ()=>{s=(s*9301+49297)%233280;return s/233280}};
  if(ov==='ich'||ov==='velvet'){const rnd=seed(id.length*31+7);let dots='';const n=ov==='ich'?28:70,r=Math.max(.6,w*(ov==='ich'?.011:.006));
    for(let i=0;i<n;i++){const a=rnd()*6.283,d=Math.sqrt(rnd());dots+=`<circle cx="${fq(cx+Math.cos(a)*rx*d)}" cy="${fq(cy+Math.sin(a)*ry*d)}" r="${fq(r*(.7+rnd()*.6))}"/>`}
    over+=ov==='velvet'?`<rect x="${fq(x0)}" y="${fq(y0)}" width="${fq(w)}" height="${fq(h)}" fill="#C9A846" opacity=".38"/><g fill="#E8D27A" opacity=".8">${dots}</g>`:`<g fill="#FBFAF4" opacity=".95">${dots}</g>`}
  if(ov==='cotton') over+=`<g fill="#F4F2EC" opacity=".85" filter="url(#f-blur)"><ellipse cx="${fq(x0+w*.1)}" cy="${fq(y0+h*.5)}" rx="${fq(w*.07)}" ry="${fq(h*.1)}"/><ellipse cx="${fq(x0+w*.48)}" cy="${fq(y0+h*.22)}" rx="${fq(w*.1)}" ry="${fq(h*.08)}"/><ellipse cx="${fq(x0+w*.7)}" cy="${fq(y0+h*.6)}" rx="${fq(w*.06)}" ry="${fq(h*.07)}"/></g>`;
  if(ov==='dropsy'){let d='';for(let i=0;i<7;i++)for(let j=0;j<4;j++){const x=x0+w*(.25+i*.075),y=y0+h*(.3+j*.12);d+=`M${fq(x)} ${fq(y)}q${fq(w*.02)} ${fq(-h*.04)} ${fq(w*.04)} 0`}over+=`<path d="${d}" stroke="#5A4A3A" stroke-width="${fq(Math.max(.4,w*.006))}" fill="none" opacity=".5"/>`}
  if(ov==='pits') over+=`<g fill="#3A2A20" opacity=".7">${[[.12,.3],[.18,.24],[.24,.33],[.3,.27],[.36,.36]].map(p=>`<ellipse cx="${fq(x0+w*p[0])}" cy="${fq(y0+h*p[1])}" rx="${fq(w*.012)}" ry="${fq(w*.009)}"/>`).join('')}</g>`;
  if(ov==='popeye'||ov==='sunken') over+=`<circle cx="${fq(x0+w*.12)}" cy="${fq(y0+h*.42)}" r="${fq(w*.05)}" fill="${ov==='popeye'?'#E8E4DA':'#2A2420'}" opacity="${ov==='popeye'?.6:.35}"/>`;
  if(ov==='finrot'||fin>.05) over+=`<rect x="${fq(x0+w*.62)}" y="${fq(y0)}" width="${fq(w*.4)}" height="${fq(h)}" fill="#F2EEE4" opacity=".35"/>`;
  Pt.def(uid,defs);
  let t='';
  if(ov==='dropsy') t+=' scale(1 1.14)';
  if(ov==='thin'||o.thin) t+=` scale(1 ${fq(1-.22*(o.thin||1))})`;
  if(ov==='bent'||o.bent) t+=' skewY(-9) scale(.92 1)';
  if(o.flipV) t+=' scale(1 -1)';
  return `<g${t?` transform="${t.trim()}"`:''}><g${clip}>${img}${over?`<g mask="url(#${uid}m)">${over}</g>`:''}</g></g>`;
}
/* animated swimmer: back and forth over range, flipping at the ends */
function swimmer(svg,x,y,range,dur,opt){
  opt=opt||{};
  if(opt.still||range<2) return `<g transform="translate(${fq(x)} ${fq(y)})"><g>${opt.tilt?`<g transform="rotate(${opt.tilt})">`:''}${svg}${opt.tilt?'</g>':''}${opt.bob?`<animateTransform attributeName="transform" type="translate" values="0 0;0 ${opt.bob};0 0" dur="3.4s" repeatCount="indefinite"/>`:''}</g></g>`;
  /* the phase comes from the clock, so a redraw (every step at high speed) continues the stroke instead of restarting it */
  const d=fq(dur),r=fq(range),bob=opt.bob||1.5,clk=(typeof performance!=='undefined'&&performance.now?performance.now():Date.now())/1000,bg=fq((opt.delay||0)-(clk%dur));
  return `<g transform="translate(${fq(x)} ${fq(y)})"><g><animateTransform attributeName="transform" type="translate" values="${r} 0;${-r} ${bob};${r} 0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${d}s" begin="${bg}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="1 1;-1 1" keyTimes="0;.5" calcMode="discrete" dur="${d}s" begin="${bg}s" repeatCount="indefinite"/>${opt.tilt?`<g transform="rotate(${opt.tilt})">`:''}${svg}${opt.tilt?'</g>':''}</g></g></g>`;
}
/* water colour by quality: clear → green → brown, plus milkiness while a new tank cycles */
function waterCol(wq){
  const a=[[100,'#A9D6E4'],[60,'#A9CDB8'],[35,'#AFB98C'],[0,'#857F55']];
  for(let i=0;i<a.length-1;i++) if(wq>=a[i+1][0]){const k=(a[i][0]-wq)/(a[i][0]-a[i+1][0]);return Pt.mix(a[i][1],a[i+1][1],k)}
  return a[a.length-1][1];
}
/* geometry of each vessel: inner water box and the length in cm it stands for */
function vesselGeo(k){
  switch(k){
  /* small vessels: the box is the water (its top is the surface); vesselPath draws the glass around it */
  case 'cup': return {x:98,y:78,w:64,h:86,len:8,shape:'cup'};
  case 'vase': return {x:82,y:84,w:96,h:80,len:12,shape:'vase'};
  case 'bowl': return {x:54,y:70,w:152,h:94,len:20,shape:'bowl'};
  case 't20': return {x:82,y:72,w:96,h:88,len:20};
  case 't30': return {x:66,y:62,w:128,h:98,len:30};
  case 't45': return {x:50,y:54,w:160,h:106,len:45};
  case 'pond': return {x:10,y:78,w:240,h:92,len:300,shape:'pond'};
  default: return {x:22,y:40,w:216,h:122,len:tankOf(k).len};
  }
}
const SANDY={t:'#D8C49A',g:'#9A8E7A',b:'#C9D2D6'};
/* the inside of the glass of a cup, a flower vase or a round bowl */
function vesselPath(g){
  const {x,y,w,h}=g;
  if(g.shape==='cup') return `M${x-6} ${y-14}L${x+w+6} ${y-14}L${x+w-1} ${y+h}L${x+1} ${y+h}Z`;
  if(g.shape==='vase'){const nl=x+w*.32,nr=x+w*.68,t=y-44;
    return `M${nl} ${t}L${nr} ${t}L${nr} ${y-26}Q${x+w} ${y-18} ${x+w} ${y+14}L${x+w} ${y+h-14}Q${x+w} ${y+h} ${x+w-14} ${y+h}L${x+14} ${y+h}Q${x} ${y+h} ${x} ${y+h-14}L${x} ${y+14}Q${x} ${y-18} ${nl} ${y-26}Z`}
  const cx=x+w/2,cy=y+h/2-12,rx=w/2+4,ry=h/2+16;
  return `M${cx-rx*.62} ${cy-ry*.78}A${rx} ${ry} 0 1 0 ${cx+rx*.62} ${cy-ry*.78}Z`;
}
const vClip=g=>g.shape&&g.shape!=='pond';
let VCID=0;
function vesselBack(g,wcol,f){
  const {x,y,w,h}=g;let s='';
  if(vClip(g)){
    const d=vesselPath(g);
    g.cid='vclip'+(VCID++);
    s+=`<defs><clipPath id="${g.cid}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="#EEF3F3" opacity=".55"/>`;
    s+=`<g clip-path="url(#${g.cid})"><rect x="0" y="${y}" width="260" height="${200-y}" fill="${wcol}"/><path d="M0 ${y}H260" stroke="#FFFFFF" stroke-width="1.4" opacity=".55"/>`;
    if(g.shape==='bowl') s+=`<path d="M${x} ${y+h-6}Q${x+w/2} ${y+h+4} ${x+w} ${y+h-6}L${x+w} ${y+h+20}L${x} ${y+h+20}Z" fill="#B9A27E"/>`;
    s+=`</g>`;
    if(g.shape==='vase'){const nl=x+w*.32,nr=x+w*.68,t=y-44;
      /* a peace lily sits in the neck: leaves above, roots hanging down into the water, covering the surface */
      s+=`<path d="M${nl+8} ${t+2}q-4 30 -10 60M${nl+16} ${t+2}q2 34 -2 70M${nr-14} ${t+2}q6 28 12 56M${nr-8} ${t+2}q-2 24 4 50" stroke="#D8CBA8" stroke-width="1.6" fill="none" opacity=".9"/>`;
      s+=`<ellipse cx="${x+w/2}" cy="${t}" rx="${(nr-nl)/2+2}" ry="5" fill="#6E5A3E"/><path d="M${x+w/2-6} ${t}q-14 -30 -34 -46q24 6 34 40M${x+w/2+2} ${t}q4 -40 -6 -62q16 22 10 60M${x+w/2+8} ${t}q20 -24 40 -30q-18 14 -36 32" fill="#4E8A3A" stroke="#3E6E2E" stroke-width="1"/>`;
    }
    return s;
  }
  if(g.shape==='pond') return `<rect width="260" height="200" fill="#B7C4A6"/><path d="M0 70Q60 60 130 66T260 64L260 200L0 200Z" fill="#7C8A6A"/><path d="M8 78Q130 68 252 78L250 176Q130 186 10 176Z" fill="${wcol}" stroke="#5E6656" stroke-width="3"/>${[[18,74,10],[60,70,8],[200,70,12],[240,76,9]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[2]*.55}" fill="#8E8A80" stroke="#5E5A52" stroke-width="1"/>`).join('')}`;
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wcol}"/>`;
  return s;
}
function tankScene(){
  const f=S.f,x=fx_(),g=vesselGeo(f.tank),wq=f.wq;
  const winter=season()==='winter';
  let wall=`<rect width="260" height="200" fill="#E4DED2"/><rect y="168" width="260" height="32" fill="#9C8466"/><rect y="164" width="260" height="6" fill="#7E6A52"/>`;
  if(g.shape==='pond') wall='';
  const wcol=waterCol(wq);
  let s=wall+vesselBack(g,wcol,f);
  const bottom=g.y+g.h;
  /* layout: background, substrate and decoration, by how the owner furnished the tank (f.lay) */
  if(!g.shape) s+=drawLayout(g,f,bottom);
  if(g.shape==='bowl'&&f.lay&&f.lay.sub==='color') s+=`<g clip-path="url(#${g.cid})">${Array.from({length:22},(_,i)=>`<circle cx="${g.x+6+(i*29)%(g.w-12)}" cy="${bottom-3-(i*5)%7}" r="3.2" fill="${['#E86A8A','#5AA8E8','#F2C84A','#7AD08A','#F2F2F2'][i%5]}" stroke="#00000022" stroke-width=".6"/>`).join('')}</g>`;
  if(g.shape==='pond'){s+=`<path d="M30 176q-4 -30 8 -56M40 176q6 -24 0 -44M224 176q-8 -26 4 -50" stroke="#3E6A30" stroke-width="5" fill="none"/>`}
  /* dirty water: haze, floating debris, algae */
  const haze=wq<80?(80-wq)/80*.55:0;
  const clip=g.shape?'':`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}"`;
  if(haze>.02&&!g.shape) s+=`${clip} fill="#EDE8D6" opacity="${fq(haze*(f.cycled?.6:1))}"/>`;
  if(wq<55&&!g.shape) s+=`<g fill="#6E6444" opacity=".55">${Array.from({length:Math.round((55-wq)/4)},(_,i)=>`<circle cx="${g.x+8+(i*37)%(g.w-16)}" cy="${g.y+6+(i*23)%18}" r="${1+(i%3)*.5}"/>`).join('')}</g>`;
  if(f.algae&&!g.shape) s+=`${clip} fill="#5E8A3A" opacity=".18"/>`;
  return {s,g,bottom};
}
/* what the tank looks like inside: a background sheet, the substrate and the decoration */
function drawLayout(g,f,b){
  const L=f.lay||{sub:f.sand?'sand':'gravel',deco:f.hides?'nature':'none',bg:'none'},X0=g.x,W=g.w;let s='';
  // background
  if(L.bg==='black') s+=`<rect x="${X0}" y="${g.y}" width="${W}" height="${g.h}" fill="#141A1E" opacity=".42"/>`;
  if(L.bg==='blue') s+=`<rect x="${X0}" y="${g.y}" width="${W}" height="${g.h}" fill="#2E5E8E" opacity=".28"/>`;
  if(L.bg==='print') s+=`<rect x="${X0}" y="${g.y}" width="${W}" height="${g.h}" fill="#2E7EA6" opacity=".22"/>`+[0,1,2,3,4].map(i=>`<path d="M${X0+12+i*W/5} ${b}q-6 -${30+i%3*12} 4 -${50+i%2*20}q8 18 2 ${40+i%3*10}" fill="${['#E88A6A','#F2C84A','#C86AB8','#E86A8A','#6AC8B8'][i]}" opacity=".35"/>`).join('');
  // substrate
  const base=`M${X0} ${b-10}Q${X0+W*.3} ${b-16} ${X0+W*.6} ${b-11}T${X0+W} ${b-12}L${X0+W} ${b}L${X0} ${b}Z`;
  if(L.sub==='sand') s+=`<path d="${base}" fill="#D8C49A"/>`;
  else if(L.sub==='soil') s+=`<path d="M${X0} ${b-14}Q${X0+W*.25} ${b-24} ${X0+W*.55} ${b-16}T${X0+W} ${b-10}L${X0+W} ${b}L${X0} ${b}Z" fill="#4A3828"/><g fill="#6A5038" opacity=".6">${Array.from({length:22},(_,i)=>`<circle cx="${X0+5+i*(W-10)/21}" cy="${b-4-(i*5)%8}" r="1.1"/>`).join('')}</g>`;
  else if(L.sub==='color') s+=`<path d="${base}" fill="#C9D2D6"/>`+`<g>${Array.from({length:34},(_,i)=>`<circle cx="${X0+4+i*(W-8)/33}" cy="${b-3-(i*7)%9}" r="2.2" fill="${['#E86A8A','#5AA8E8','#F2C84A','#7AD08A','#B88AE8'][i%5]}"/>`).join('')}</g>`;
  else if(L.sub==='bare') s+=`<rect x="${X0}" y="${b-3}" width="${W}" height="3" fill="#B8C4C8" opacity=".6"/>`;
  else if(L.sub!=='none') s+=`<path d="${base}" fill="#9A8E7A"/><g fill="#6E6656" opacity=".5">${Array.from({length:18},(_,i)=>`<circle cx="${X0+6+i*(W-12)/17}" cy="${b-4-(i*7)%6}" r="1.4"/>`).join('')}</g>`;
  // decoration
  const plants=(n,col)=>Array.from({length:n},(_,i)=>{const px=X0+12+((i*53)%Math.max(20,W-24)),h=40+(i*17)%40;return `<path d="M${px} ${b-8}q${i%2?-8:8} -${h/2} ${i%2?2:-2} -${h}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>`}).join('');
  const d=L.deco==='none'&&f.hides?'nature':L.deco;
  if(d==='nature') s+=plants(5,'#3E7A34')+`<path d="M${X0+W*.5} ${b-8}l22 -26l8 4l-10 22z" fill="#6A4E34" stroke="#4A3424" stroke-width="1.2"/>`;
  if(d==='wood') s+=`<path d="M${X0+W*.2} ${b-6}C${X0+W*.35} ${b-30} ${X0+W*.5} ${b-40} ${X0+W*.72} ${b-62}M${X0+W*.45} ${b-34}l-16 -22M${X0+W*.6} ${b-48}l14 -14" stroke="#5A4028" stroke-width="7" fill="none" stroke-linecap="round"/>`+plants(2,'#4E8A3A');
  if(d==='rock') s+=`<g fill="#8A8A82" stroke="#5E5E58" stroke-width="1.2"><path d="M${X0+W*.18} ${b-6}l8 -26l22 -6l14 18l-4 14z"/><path d="M${X0+W*.42} ${b-6}l6 -18l18 -4l10 22z"/><path d="M${X0+W*.66} ${b-6}l4 -34l20 -8l16 22l-6 20z"/></g>`;
  if(d==='kitsch') s+=`<g transform="translate(${X0+W*.62} ${b-8})"><rect x="-18" y="-34" width="36" height="34" fill="#C9A87A" stroke="#7E6440" stroke-width="1.2"/><rect x="-22" y="-44" width="10" height="14" fill="#C9A87A" stroke="#7E6440"/><rect x="12" y="-44" width="10" height="14" fill="#C9A87A" stroke="#7E6440"/><path d="M-6 0v-14a6 6 0 0 1 12 0v14z" fill="#3A2A1A"/><path d="M-22 -44h4v-4h2v4h4M12 -44h4v-4h2v4h4" stroke="#7E6440" fill="none"/></g><g transform="translate(${X0+W*.25} ${b-10})"><ellipse rx="6" ry="7" cy="-18" fill="#E8C84A"/><circle cy="-18" r="4" fill="#9AC8E8"/><rect x="-5" y="-12" width="10" height="12" fill="#E8A040"/></g>`+[0,1,2].map(i=>`<circle cx="${X0+W*.25}" cy="${b-36-i*12}" r="${1.6+i*.6}" fill="none" stroke="#fff" stroke-width=".8" class="a-bubble" style="animation-delay:${i*.5}s"/>`).join('');
  if(d==='fake') s+=Array.from({length:4},(_,i)=>{const px=X0+18+i*(W-36)/3;return `<path d="M${px} ${b-8}q-10 -30 0 -54q10 24 0 54z" fill="${['#E86AB8','#6AE8A8','#E8D86A','#8A6AE8'][i]}" opacity=".85"/>`}).join('');
  if(d==='pipe') s+=`<g><rect x="${X0+W*.3}" y="${b-20}" width="${W*.34}" height="16" rx="8" fill="#8A9296" stroke="#5E666A" stroke-width="1.2"/><ellipse cx="${X0+W*.3}" cy="${b-12}" rx="4" ry="8" fill="#2E3438"/></g>`;
  if(d==='mop') s+=`<g transform="translate(${X0+W*.7} ${g.y+8})"><path d="M0 0v6" stroke="#4A4A4A" stroke-width="2"/>${Array.from({length:9},(_,i)=>`<path d="M0 6q${(i-4)*3} 30 ${(i-4)*5} 60" stroke="#3E6A5A" stroke-width="2" fill="none"/>`).join('')}</g>`;
  return s;
}
function tankFront(g){
  const f=S.f;let s='';
  if(vClip(g)) return `<path d="${vesselPath(g)}" fill="none" stroke="#7FA0A8" stroke-width="2"/><path d="M${g.x+(g.shape==='bowl'?14:6)} ${g.y+6}q-4 ${g.h*.35} 2 ${g.h*.65}" stroke="#fff" stroke-width="3" opacity=".35" fill="none" stroke-linecap="round"/>`;
  if(g.shape==='pond') return f.net?`<path d="${Array.from({length:14},(_,i)=>`M${10+i*18} 74L${10+i*18} 178`).join('')}${Array.from({length:6},(_,i)=>`M8 ${78+i*18}L252 ${78+i*18}`).join('')}" stroke="#2E2E2E" stroke-width=".5" opacity=".28"/>`:'';
  s+=`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="none" stroke="#4A5458" stroke-width="2.6"/><path d="M${g.x+8} ${g.y+10}l14 42" stroke="#fff" stroke-width="3" opacity=".3" stroke-linecap="round"/>`;
  if(f.lid) s+=`<rect x="${g.x-3}" y="${g.y-7}" width="${g.w+6}" height="7" fill="#2E3438"/>`;
  if(f.filter==='걸이식 여과기') s+=`<rect x="${g.x+g.w-34}" y="${g.y-14}" width="24" height="30" rx="2" fill="#2E3438"/><path d="M${g.x+g.w-30} ${g.y+16}q-3 10 2 20" stroke="#EAF6FA" stroke-width="4" fill="none" opacity=".7"/>`;
  if(f.filter==='스펀지 여과기') s+=`<rect x="${g.x+g.w-22}" y="${g.y+g.h-40}" width="14" height="28" rx="3" fill="#2E2E2E"/>`+[0,1,2].map(i=>`<circle cx="${g.x+g.w-15}" cy="${g.y+g.h-48}" r="2.6" fill="none" stroke="#fff" stroke-width="1" class="a-bubble" style="animation-delay:${i*.8}s"/>`).join('');
  if(f.filter==='외부 여과기') s+=`<path d="M${g.x+g.w-14} ${g.y-6}V${g.y+g.h-30}M${g.x+g.w-6} ${g.y-6}V${g.y+40}" stroke="#5F6A72" stroke-width="3"/><rect x="${g.x+g.w-10}" y="168" width="20" height="28" rx="3" fill="#2E3438"/>`;
  if(f.filter==='상면 여과기') s+=`<rect x="${g.x+4}" y="${g.y-16}" width="${g.w*.62}" height="14" rx="2" fill="#3A4046"/><rect x="${g.x+10}" y="${g.y-13}" width="${g.w*.5}" height="4" fill="#5E666C"/><path d="M${g.x+g.w*.6} ${g.y-2}v10" stroke="#EAF6FA" stroke-width="5" opacity=".7"/>`;
  if(f.filter==='측면 여과기') s+=`<rect x="${g.x+g.w-20}" y="${g.y+10}" width="16" height="${g.h-26}" fill="#2E3438" opacity=".9"/><path d="M${g.x+g.w-12} ${g.y+14}h-10" stroke="#EAF6FA" stroke-width="3" opacity=".7"/>`;
  if(f.filter==='저면 여과기') s+=`<rect x="${g.x+g.w-18}" y="${g.y+12}" width="5" height="${g.h-20}" fill="#C9D2D6" opacity=".9"/>`+[0,1,2].map(i=>`<circle cx="${g.x+g.w-15.5}" cy="${g.y+10}" r="2.2" fill="none" stroke="#fff" stroke-width=".9" class="a-bubble" style="animation-delay:${i*.7}s"/>`).join('');
  if(f.filter==='섬프 여과기') s+=`<path d="M${g.x+g.w-12} ${g.y+4}V${g.y+g.h+30}M${g.x+g.w-22} ${g.y+g.h}V${g.y+g.h+30}" stroke="#5F6A72" stroke-width="3"/><rect x="${g.x+g.w-60}" y="${g.y+g.h+14}" width="56" height="18" fill="#2E3438" opacity=".85"/>`;
  if(f.heater) s+=`<rect x="${g.x+8}" y="${g.y+14}" width="5" height="50" rx="2.5" fill="#C9D2D6" stroke="#7A868C" stroke-width=".8" transform="rotate(-12 ${g.x+10} ${g.y+40})"/><circle cx="${g.x+12}" cy="${g.y+18}" r="1.6" fill="${S.done&&S.fx==='f-cook'?'#E2502A':'#E2A02A'}"/>`;
  return s;
}
/* drawn tankmates */
function mateSvg(m,g,i){
  /* every fish stays inside the glass: width and height are capped by the tank, and so is its lane */
  const A=FISHART[m.id]&&(FX[m.id]&&m.cm<FX[m.id].cm*.35&&FISHART[m.id].young||FISHART[m.id].swim),ar=A?A[1]/A[0]:.5;
  const px=Math.max(8,Math.min(g.w*m.cm/g.len*FZ,g.w*.6,g.h*.42/ar));
  const hh=px*ar,top=g.y+hh/2+6,bot=g.y+g.h-hh/2-14;
  const y=bot>top?top+((i*41)%Math.max(1,bot-top)):g.y+g.h/2;
  const range=Math.max(0,(g.w-px)/2-6);
  const mp=FX[m.id]&&m.cm<FX[m.id].cm*.35&&FISHART[m.id]&&FISHART[m.id].young?'young':'swim';
  if(FISHART[m.id]) return swimmer(fishSprite(m.id,mp,px),g.x+g.w/2,y,range*(.5+((i*13)%10)/20),7+(i%4)*2.3,{delay:-i*1.7});
  return '';
}
function fishPose(){
  const f=S.f,x=fx_();
  if(fishIs('puff')&&(f.puffT>0||S.scaredT>0)) return 'puff';
  if(S.health<35||(f.ill&&f.ill.sev>.5)||(f.refuse&&S.health<60)) return 'sick';
  if(f.len<x.cm*.35) return 'young';
  return 'swim';
}
/* the living stage */
function fishLiveStage(){
  const f=S.f,x=fx_(),env=S.env;
  if(env==='tank'||env==='pond'){
    const {s,g,bottom}=tankScene();
    let body=s,inner='';
    const shown=f.mates.filter(m=>m.n>0);let k=0;
    shown.forEach(m=>{for(let j=0;j<Math.min(m.n,m.cm<6?6:3);j++)inner+=mateSvg(m,g,k++)});
    const pose=fishPose(),asp=(FISHART[S.sp.id][pose]||FISHART[S.sp.id].swim),px=Math.min(clamp(g.w*f.len/g.len*FZ,18,g.w*.97),g.h*.82*asp[0]/asp[1]);
    const ov=f.ill?DZ[f.ill.id].ov:'';
    const spr=fishSprite(S.sp.id,pose,px,{ov:ov==='flip'||ov==='thin'&&!f.ill?'':ov,fin:f.fin,thin:f.refuse||ov==='thin'?.7:0,bent:(f.stunt||0)>.6,flipV:ov==='flip'});
    const range=Math.max(0,(g.w-px)/2-4);
    /* in a crowded tank, the red pen of the pledge sheet circles our fish */
    const ring=shown.length&&px<g.w*.4?`<ellipse rx="${fq(px*.62+3)}" ry="${fq(Math.max(7,px*asp[1]/asp[0]*.62+3))}" fill="none" stroke="#C4301F" stroke-width="1.3" stroke-dasharray="${fq(px*2.6)} 6" opacity=".75" transform="rotate(-4)"/>`:'';
    const sick=pose==='sick', gasp=f.wq<35||S.health<25;
    const hh=px*asp[1]/asp[0];
    const y=clamp(ov==='flip'?g.y+12:gasp?g.y+hh/2+4:sick?bottom-10-hh/2:g.y+g.h*.45,g.y+hh/2+3,bottom-hh/2-6);
    const dur=clamp(5+range/9,5,16)*(sick?2:1);
    inner+=swimmer(spr+ring,g.x+g.w/2,y,sick||ov==='flip'?range*.25:range,dur,{tilt:sick&&!gasp?10:0,bob:gasp?1:2});
    if(gasp&&!S.done) inner+=[0,1,2].map(i=>`<circle class="a-bubble" style="animation-delay:${i*.6}s" cx="${g.x+g.w/2-px*.4}" cy="${y-4}" r="${1+i*.4}" fill="none" stroke="#fff" stroke-width=".8"/>`).join('');
    body+=vClip(g)?`<g clip-path="url(#${g.cid})">${inner}</g>`:inner;
    if(f.tank==='pond'&&season()==='winter') body+=`<path d="M10 78Q130 70 250 78L250 88Q130 82 10 88Z" fill="#EAF4F8" opacity=".75"/>`;
    return body+tankFront(g);
  }
  return fishChainScene(env);
}
/* scenes before the owner */
function fishChainScene(env){
  const f=S.f,x=fx_(),id=S.sp.id,pose=S.health<40?'sick':f.len<x.cm*.35?'young':'swim';
  const black=['altum','apisto','ghost','arowana','oscar','motoro','cory','neon','wildbetta'].includes(id);
  switch(env){
  case 'wildriver':{
    const col=black?'#6E5434':'#6E9A8A';
    let s=`<rect width="260" height="200" fill="${black?'#3A2E20':'#2E4A42'}"/><rect y="0" width="260" height="34" fill="${black?'#5A6A4A':'#8AAA8A'}"/><rect y="30" width="260" height="170" fill="${col}"/>`;
    s+=[0,1,2].map(i=>`<path d="M${40+i*80} 30L${20+i*80} 200L${70+i*80} 200Z" fill="#FFF8E0" opacity=".08"/>`).join('');
    s+=`<path d="M0 176Q60 166 130 174T260 170L260 200L0 200Z" fill="${black?'#3A2A1A':'#5A5040'}"/><path d="M14 200q-4 -60 10 -120M26 200q6 -50 -4 -90M232 200q-6 -50 8 -110M246 200q4 -40 -6 -70" stroke="#3E5A2A" stroke-width="4" fill="none"/>`;
    s+=[0,1,2,3].map(i=>swimmer(fishSprite(id,'young',Math.max(12,30-i*4)),70+i*40,70+i*22,30,8+i*2,{delay:-i*2})).join('');
    return s+swimmer(fishSprite(id,pose,clamp(x.cm*3,26,90)),130,110,50,9);}
  case 'catch':{
    let s=`<rect width="260" height="200" fill="#3A3226"/><rect y="40" width="260" height="160" fill="#6E5A3A"/><path d="M0 40L260 40" stroke="#8A7A5A" stroke-width="2"/>`;
    s+=[0,1,2,3,4].map(i=>`<g transform="translate(${60+i*34} ${120+(i%2)*14}) rotate(${i*30})">${fishSprite(id,'young',22)}</g>`).join('');
    s+=`<g transform="translate(130 112)">${fishSprite(id,pose,clamp(x.cm*3,30,90),{})}<animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur=".6s" repeatCount="indefinite" additive="sum"/></g>`;
    s+=`<path d="${Array.from({length:16},(_,i)=>`M${20+i*15} 60Q${30+i*15} 120 ${20+i*15} 180`).join('')}${Array.from({length:8},(_,i)=>`M14 ${62+i*16}Q130 ${74+i*16} 246 ${62+i*16}`).join('')}" stroke="#D8D0B8" stroke-width=".9" fill="none" opacity=".75"/>`;
    return s;}
  case 'holding':{
    let s=`<rect width="260" height="200" fill="#5A544A"/><rect y="150" width="260" height="50" fill="#4A443C"/>`;
    [[50,150],[130,156],[210,150]].forEach((p,i)=>{s+=`<ellipse cx="${p[0]}" cy="${p[1]}" rx="40" ry="12" fill="#3A6A8A" stroke="#2A4A6A" stroke-width="2"/><path d="M${p[0]-40} ${p[1]}L${p[0]-34} ${p[1]+30}L${p[0]+34} ${p[1]+30}L${p[0]+40} ${p[1]}" fill="#4A7AA0" stroke="#2A4A6A" stroke-width="2"/><ellipse cx="${p[0]}" cy="${p[1]}" rx="36" ry="9" fill="#8A9A7A"/>`;
      s+=[0,1,2].map(j=>`<g transform="translate(${p[0]-18+j*16} ${p[1]-1}) scale(1 .45)">${fishSprite(id,j===1&&i===1?pose:'young',i===1&&j===1?28:18)}</g>`).join('')});
    s+=`<rect x="20" y="40" width="70" height="44" fill="#E8E4D8" opacity=".85"/><path d="M28 52h54M28 60h44M28 68h50" stroke="#8A8478" stroke-width="2"/>`;
    return s;}
  case 'box': return chainBox(id,pose,false);
  case 'bottles':{
    let s=`<rect width="260" height="200" fill="#5E5A50"/><rect y="120" width="260" height="80" fill="#4A463E"/>`;
    for(let r=0;r<3;r++)for(let c=0;c<9;c++){const bx=14+c*28+(r%2)*8,by=86+r*36;s+=`<rect x="${bx}" y="${by}" width="18" height="28" rx="4" fill="#BFD8E0" opacity=".55" stroke="#7FA0A8" stroke-width=".8"/><g transform="translate(${bx+9} ${by+16})">${fishSprite(id,'swim',13,{})}</g>`}
    return s+`<g transform="translate(130 60)"><rect x="-22" y="-30" width="44" height="62" rx="8" fill="#CFE4EA" opacity=".6" stroke="#7FA0A8" stroke-width="1.4"/>${fishSprite(id,pose,34)}</g>`;}
  case 'farm':{
    let s=`<rect width="260" height="200" fill="#A9B08A"/><path d="M0 60Q130 46 260 60L260 200L0 200Z" fill="#6E7A4A"/><rect y="66" width="260" height="134" fill="#7E8A5A" opacity=".6"/>`;
    s+=Array.from({length:16},(_,i)=>swimmer(fishSprite(id,'young',14),20+(i*53)%220,80+(i*29)%100,14,5+(i%4),{delay:-i})).join('');
    return s;}
  case 'quarantine':{
    let s=`<rect width="260" height="200" fill="#C9CCCC"/><rect y="164" width="260" height="36" fill="#8E9294"/>`;
    [[16,60],[96,60],[176,60]].forEach((p,i)=>{s+=`<rect x="${p[0]}" y="${p[1]}" width="70" height="90" fill="${i===1?'#7FA6D6':'#9FC0E0'}" stroke="#5A6268" stroke-width="2"/><rect x="${p[0]+8}" y="${p[1]+6}" width="30" height="10" fill="#fff"/>`;
      if(i!==1) s+=[0,1].map(j=>`<g transform="translate(${p[0]+22+j*26} ${p[1]+40+j*18})">${fishSprite(id,'young',18)}</g>`).join('')});
    const [qp,qr]=fitBox(id,pose,clamp(f.len*2.6,18,60),70,90);
    return s+swimmer(fishSprite(id,pose,qp),131,108,qr,6);}
  case 'shop':{
    let s=`<rect width="260" height="200" fill="#2A3238"/><rect y="168" width="260" height="32" fill="#1E2428"/>`;
    for(let r=0;r<2;r++)for(let c=0;c<3;c++){const tx=10+c*84,ty=20+r*76;s+=`<rect x="${tx}" y="${ty}" width="74" height="64" fill="${(r+c)%2?'#5E8EA6':'#6E9EB6'}" stroke="#141A1E" stroke-width="3"/>`;
      if(!(r===1&&c===1)) s+=[0,1,2].map(j=>`<g transform="translate(${tx+16+j*20} ${ty+20+(j%2)*18})">${fishSprite(pick(['neon','guppy','platy','comet','betta']),'swim',12)}</g>`).join('')}
    s+=`<rect x="98" y="150" width="58" height="14" fill="#F4E8C8"/><text x="127" y="160.5" text-anchor="middle" font-size="8.4" font-family="Jua,Gowun Dodum,sans-serif" fill="#C4301F">특가</text>`;
    const [sp_,sr]=fitBox(id,pose,clamp(f.len*2.4,16,58),74,64);
    return s+swimmer(fishSprite(id,pose,sp_),131,126,sr,6);}
  case 'stall': return stallScene(false);
  case 'river': case 'lake': return riverLive();
  default: return chainBox(id,pose,false);
  }
}
/* the largest width a sprite can have inside a w×h tank (10% margin), and how far it may swim side to side */
function fitBox(id,pose,want,w,h){const A=(FISHART[id]||{})[pose]||(FISHART[id]||{}).swim||[2,1],ar=A[1]/A[0];
  const px=Math.max(8,Math.min(want,w*.8,h*.7/ar));return [px,Math.max(0,(w-px)/2-5)]}
/* a night-market scooping pool: string lights, a blue plastic pool, hundreds of small goldfish, paper scoops */
function stallScene(dead){
  const id=S.sp.id,f=S.f;
  let s=`<rect width="260" height="200" fill="#161A26"/><path d="M0 22Q130 50 260 22" stroke="#3A3A3A" stroke-width="1" fill="none"/>`;
  s+=Array.from({length:11},(_,i)=>{const x=10+i*24,y=22+Math.sin(i/10*Math.PI)*24;return `<circle cx="${x}" cy="${y+4}" r="3.4" fill="#FFD27A" opacity="${dead?.45:.95}"/><circle cx="${x}" cy="${y+4}" r="9" fill="#FFD27A" opacity=".12"/>`}).join('');
  s+=`<rect x="150" y="54" width="96" height="22" rx="2" fill="#E8D9B0"/><text x="198" y="69" text-anchor="middle" font-size="9.4" font-weight="700" font-family="Jua,Gowun Dodum,sans-serif" fill="#C4301F">금붕어 뜰채 · 3,000원</text>`;
  s+=`<rect x="14" y="96" width="232" height="86" rx="10" fill="#2E6FB0" stroke="#1E4A80" stroke-width="4"/><rect x="22" y="104" width="216" height="70" rx="6" fill="${dead?'#8E9A7A':'#7FB0C8'}"/>`;
  const n=dead?10:18;
  for(let i=0;i<n;i++){const x=34+(i*47)%196,y=112+(i*23)%56;
    s+=dead&&i%3===0?`<g transform="translate(${x} ${108+(i%2)*3}) scale(1 .7)">${fishSprite(id,'dead',16,{flipV:1,filter:'f-pale'})}</g>`:swimmer(fishSprite(id,'young',15),x,y,dead?3:14,3+(i%4)*.8,{delay:-i*.7})}
  if(!dead){
    s+=swimmer(fishSprite(id,'swim',clamp((f.len||3)*3.4,18,30)),130,140,26,2.6);
    s+=`<g transform="translate(176 120) rotate(-30)"><circle r="13" fill="#F4F0E6" opacity=".75" stroke="#C9B48A" stroke-width="2"/><path d="M0 13V46" stroke="#C9B48A" stroke-width="4" stroke-linecap="round"/><animateTransform attributeName="transform" type="translate" values="0 0;-30 6;0 0" dur="2.4s" repeatCount="indefinite" additive="sum"/></g>`;
    s+=[0,1,2,3].map(i=>`<ellipse cx="${30+i*62}" cy="94" rx="9" ry="6" fill="#E8C8A8"/>`).join('');
  } else {
    s+=`<g transform="translate(130 150)">${fishSprite(id,'dead',clamp((f.len||3)*3.4,18,30),{flipV:1,filter:'f-pale'})}</g><path d="M200 120Q214 60 240 70L236 190L196 190Z" fill="#2A2A2A" opacity=".9"/>`;
  }
  return s;
}
function chainBox(id,pose,dead,many){
  let s=`<rect width="260" height="200" fill="#3E3A34"/><path d="M30 80L230 80L220 190L40 190Z" fill="#F2F0EA" stroke="#C9C4BA" stroke-width="3"/><path d="M42 92L218 92L210 182L50 182Z" fill="#E2DED4"/>`;
  [[80,140],[180,140]].forEach(p=>{s+=`<path d="M${p[0]-30} ${p[1]-40}Q${p[0]} ${p[1]-60} ${p[0]+30} ${p[1]-40}L${p[0]+34} ${p[1]+30}Q${p[0]} ${p[1]+40} ${p[0]-34} ${p[1]+30}Z" fill="#DCEAF0" opacity=".55" stroke="#9AAAB2" stroke-width="1.2"/><g transform="translate(${p[0]} ${p[1]+14})">${fishSprite(id,many?'dead':'young',22,{flipV:!!many})}</g>`});
  s+=`<g transform="translate(130 128)"><path d="M-44 -54Q0 -78 44 -54L50 40Q0 56 -50 40Z" fill="#E4F0F4" opacity=".6" stroke="#8AA0A8" stroke-width="1.6"/><rect x="-46" y="0" width="92" height="44" fill="${dead?'#B9B48A':'#A9CCD8'}" opacity=".7"/><g transform="translate(0 ${dead?30:18})">${fishSprite(id,dead?'dead':pose,Math.min(72,clamp(fx_().cm*2.4,28,80)),{flipV:!!dead})}</g><path d="M-10 -70q10 -10 20 0" stroke="#C9A04A" stroke-width="3" fill="none"/></g>`;
  return s;
}
function riverLive(){
  const id=S.sp.id,winter=season()==='winter';
  let s=`<rect width="260" height="200" fill="#C9D8DE"/><path d="M0 50Q60 42 130 50T260 48L260 200L0 200Z" fill="${winter?'#7E98A6':'#6A8C86'}"/><path d="M0 178Q80 168 160 176T260 172L260 200L0 200Z" fill="#5A4E40"/>`;
  if(winter) s+=`<path d="M0 46L260 46L260 58L0 58Z" fill="#EAF2F4" opacity=".85"/>`;
  s+=`<path d="M14 200q-4 -70 10 -140M28 200q6 -60 -4 -100M236 200q-6 -60 8 -120" stroke="#4E6A3A" stroke-width="4" fill="none"/><ellipse cx="190" cy="184" rx="30" ry="9" fill="#6E6A62"/>`;
  const pose=S.health<35?'sick':'swim';
  return s+swimmer(fishSprite(id,pose,clamp(S.f.len*2.2,22,120),{filter:winter&&fx_().temp!=='cold'?'f-cold':''}),130,winter?150:116,60,winter?16:9);
}

/* ---------- the stage ---------- */
function fishStageSvg(){
  Pt.reset();FUID=0;fishDefs();
  const body=S.done?fishDeath():(S.wild?riverLive():fishLiveStage());
  const overlay=`<rect width="260" height="200" fill="url(#vig)" pointer-events="none"/>`;
  Pt.def('vig',`<radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#1A1410" stop-opacity="0"/><stop offset="1" stop-color="#1A1410" stop-opacity=".28"/></radialGradient>`);
  return `<svg class="stage" viewBox="0 0 260 200" role="img" aria-label="${(S.disp||'').replace(/[<&>"]/g,'')}의 모습">${Pt.out()}${body}${overlay}</svg>`;
}
function fishChips(){
  const f=S.f,c=[];
  if(S.done) return c;
  if(S.preOwner){c.push([S.status,'']);if(S.health<60)c.push(['굶주림','bad']);return c}
  if(S.wild){if(season()==='winter')c.push(['추위','bad']);if(S.health<55)c.push(['배고픔','bad']);return c.length?c:[['낯선 하천','']]}
  if(f.ill) c.push([DZ[f.ill.id].n,'bad']);
  if(f.wq<45) c.push(['수질 나쁨','bad']);
  if(!f.cycled) c.push(['물잡이 안 됨','bad']);
  if(fLoad()>1.2) c.push(['과밀','bad']);
  if(f.len>tankLen()*.3) c.push(['비좁음','bad']);
  if(fMatePressure()>.3) c.push(['합사 스트레스','bad']);
  if(fx_().social==='school'&&fSameCount()<4) c.push(['무리 없음','bad']);
  if(f.fin>.3) c.push(['지느러미 손상','bad']);
  if(f.refuse) c.push(['먹이 거부','bad']);
  if((f.beak||0)>.5) c.push(['이빨 자람','bad']);
  if(season()==='winter'&&fx_().temp==='trop'&&!f.heater) c.push(['추위','bad']);
  if((f.stunt||0)>.3) c.push(['성장 정체','bad']);
  if(f.puffT>0) c.push(['몸을 부풀림','bad']);
  if(S.happyT>0) c.push(['평온','good']);
  if(!c.length) c.push([f.stress<.25?'평온':'긴장','']);
  return c;
}

/* ---------- deaths ---------- */
function fishDeath(){
  const f=S.f,id=S.sp.id,x=fx_(),fx=S.fx||'f-bottom';
  const big=clamp(x.cm*2.2,30,150);
  const dead=(px,o)=>fishSprite(id,'dead',px,o);
  const ovEnd=f.endKey==='disease'&&f.ill?DZ[f.ill.id].ov:'';
  const inTank=(fn)=>{const {s,g,bottom}=tankScene();const inner=fn(g,bottom);return s+(vClip(g)?`<g clip-path="url(#${g.cid})">${inner}</g>`:inner)+tankFront(g)};
  const da=FISHART[id].dead,pxT=g=>Math.min(clamp(g.w*f.len/g.len*FZ,22,g.w*.95),g.h*.6*da[0]/da[1]),fh=px=>px*da[1]/da[0];
  switch(fx){
  /* got away from the net: the river it was born in, as it was */
  case 'f-home': return fishChainScene('wildriver');
  case 'f-float': case 'bellyup':
    if(!f.tank||S.wild) return riverDead('float');
    return inTank((g)=>{const px=pxT(g);let s=`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="4" fill="#C9C29A" opacity=".8"/>`;
      s+=`<g transform="translate(${g.x+g.w/2+Math.min(10,(g.w-px)/2)} ${g.y+fh(px)/2+2}) rotate(-3)">${dead(px,{flipV:1,filter:'f-pale'})}<animateTransform attributeName="transform" type="translate" values="0 0;3 1;0 0" dur="7s" repeatCount="indefinite" additive="sum"/></g>`;
      f.mates.filter(m=>m.n>0&&FISHART[m.id]).slice(0,2).forEach((m,i)=>{s+=`<g transform="translate(${g.x+30+i*40} ${g.y+8})">${fishSprite(m.id,'dead',Math.max(8,g.w*m.cm/g.len),{flipV:1,filter:'f-pale'})}</g>`});
      return s});
  case 'f-bottom': case 'sickdead':
    if(!f.tank||S.wild) return riverDead('bottom');
    return inTank((g,b)=>`<g transform="translate(${g.x+g.w*.5} ${b-6-fh(pxT(g))/2}) rotate(3)">${dead(pxT(g),{ov:ovEnd==='flip'?'':ovEnd,fin:f.fin,bent:ovEnd==='bent'})}</g>`);
  case 'f-nipped':
    return inTank((g,b)=>`<g transform="translate(${g.x+g.w*.45} ${b-6-fh(pxT(g))/2})">${dead(pxT(g),{fin:1,filter:'f-pale'})}</g>`+f.mates.filter(m=>m.n>0).slice(0,2).map((m,i)=>mateSvg(m,g,i)).join(''));
  case 'f-bent':
    return inTank((g,b)=>`<g transform="translate(${g.x+g.w*.5} ${b-14})">${dead(Math.min(g.w*.95,pxT(g)),{bent:1,filter:'f-dull'})}</g>`);
  case 'f-thin': case 'starve':
    if(!f.tank||S.wild) return riverDead('bottom',{thin:1});
    return inTank((g,b)=>`<g fill="#8A6A3A">${Array.from({length:14},(_,i)=>`<circle cx="${g.x+20+(i*29)%(g.w-40)}" cy="${b-8-(i%3)}" r="1.6"/>`).join('')}</g><g transform="translate(${g.x+g.w*.5} ${b-6-fh(pxT(g))*.4})">${dead(pxT(g),{thin:1,filter:'f-dull'})}</g>`);
  case 'f-curl':
    return inTank((g,b)=>`<g transform="translate(${g.x+g.w*.5} ${b-20})">${dead(pxT(g),{thin:.5,filter:'f-dull'})}</g>`);
  case 'f-cook':
    return inTank((g)=>`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="#F2E8D2" opacity=".45"/><g transform="translate(${g.x+g.w/2} ${g.y+fh(pxT(g))/2+2})">${dead(pxT(g),{flipV:1,filter:'f-pale'})}</g>${f.heater?`<rect x="${g.x+8}" y="${g.y+14}" width="5" height="50" rx="2.5" fill="#E2804A" opacity=".7" transform="rotate(-12 ${g.x+10} ${g.y+40})"/>`:''}`);
  case 'f-ice': case 'freeze':{
    if(f.tank==='pond'||S.wild||!f.tank) return riverDead('ice');
    return inTank((g,b)=>`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="#DCEAF0" opacity=".35"/><g transform="translate(${g.x+g.w*.5} ${b-6-fh(pxT(g))/2})">${dead(pxT(g),{filter:'f-cold'})}</g>`)+`<rect x="196" y="20" width="44" height="18" fill="#F4F2EC" stroke="#9A9488" stroke-width=".8"/><text x="218" y="32.4" text-anchor="middle" font-size="9" font-family="IBM Plex Mono,monospace" fill="#2F6BD1">14℃</text>`;}
  case 'f-intake':
    return inTank((g)=>`<g transform="translate(${g.x+g.w-30} ${g.y+60}) rotate(-80)">${dead(Math.min(30,pxT(g)),{filter:'f-pale'})}</g><rect x="${g.x+g.w-34}" y="${g.y+30}" width="8" height="70" fill="#2E3438" opacity=".85"/><path d="${Array.from({length:8},(_,i)=>`M${g.x+g.w-34} ${g.y+34+i*8}h8`).join('')}" stroke="#7A868C" stroke-width=".8"/>`);
  case 'f-floor': case 'jump':{
    const px=Math.min(120,big*.9);
    return `<rect width="260" height="200" fill="#D8CFC0"/><rect y="120" width="260" height="80" fill="#A07A52"/>${Array.from({length:6},(_,i)=>`<path d="M0 ${130+i*12}L260 ${126+i*12}" stroke="#7E5E3E" stroke-width=".8" opacity=".6"/>`).join('')}`+
      `<rect x="0" y="20" width="90" height="100" fill="#8A7A66"/><rect x="6" y="26" width="78" height="60" fill="#9FC8D6" opacity=".7"/>`+
      `<g transform="translate(150 150)"><g opacity="1">${fishSprite(id,'swim',px*.9)}<animateTransform attributeName="transform" type="rotate" values="-14;16;-14" dur=".5s" repeatCount="6"/><animate attributeName="opacity" values="1;0" begin="2.9s" dur=".6s" fill="freeze"/></g><g opacity="0">${dead(px,{filter:'f-dry',thin:.6})}<animate attributeName="opacity" values="0;1" begin="3s" dur=".8s" fill="freeze"/></g></g>`+
      `<g fill="#6E5E4E" opacity=".6">${[[-30,6],[22,8],[40,2],[-12,10]].map(p=>`<circle cx="${150+p[0]}" cy="${152+p[1]}" r="1"/>`).join('')}</g>`;}
  case 'f-escape':{
    const px=Math.min(130,big);
    return `<rect width="260" height="200" fill="#CFC6B6"/><rect y="132" width="260" height="68" fill="#9A7650"/><rect x="0" y="40" width="260" height="96" fill="#5E4A36"/><rect x="0" y="128" width="260" height="10" fill="#3A2C20"/><rect x="0" y="136" width="260" height="20" fill="#1E1812" opacity=".7"/>`+
      `<g transform="translate(140 160)">${dead(px,{filter:'f-dry'})}</g><g fill="#B8B0A2" opacity=".8" filter="url(#f-blur)"><ellipse cx="96" cy="164" rx="8" ry="3"/><ellipse cx="200" cy="168" rx="10" ry="3.4"/></g><path d="M20 156q60 -4 110 2" stroke="#2E2E2E" stroke-width="2" fill="none"/>`;}
  case 'f-stall': return stallScene(true);
  case 'apex': return riverLive();
  case 'f-angler':{const px=clamp((f.len||10)*2.4,40,120);
    return `<rect width="260" height="200" fill="#C9D8DE"/><path d="M0 120Q80 112 160 118T260 116L260 200L0 200Z" fill="#7E9A5A"/><path d="M0 104Q70 98 130 104T260 100L260 122Q130 128 0 122Z" fill="#6A8C86"/>${Array.from({length:14},(_,i)=>`<path d="M${10+i*18} 200l2 -${20+(i*7)%16}M${16+i*18} 200l-2 -${16+(i*5)%14}" stroke="#4E6A30" stroke-width="2"/>`).join('')}<path d="M220 20L120 150" stroke="#3A3A3A" stroke-width="1"/><g transform="translate(120 158) rotate(8)">${dead(px,{filter:'f-dry'})}</g>`;}
  case 'f-bag': return chainBox(id,'dead',true,true);
  case 'f-box': case 'bottle': return chainBox(id,'dead',true,true);
  case 'f-net':{
    let s=`<rect width="260" height="200" fill="#6A6050"/><ellipse cx="130" cy="150" rx="90" ry="26" fill="#3A6A8A"/><path d="M40 150Q50 196 130 196Q210 196 220 150" fill="#4A7AA0" stroke="#2A4A6A" stroke-width="2"/><ellipse cx="130" cy="150" rx="84" ry="20" fill="#8A8A6A"/>`;
    s+=[0,1,2,3].map(i=>`<g transform="translate(${80+i*30} ${150+(i%2)*4}) scale(1 .5)">${fishSprite(id,'dead',26,{flipV:i%2})}</g>`).join('');
    return s+`<g transform="translate(130 146) scale(1 .5)">${dead(Math.min(80,big),{flipV:1})}</g>`;}
  case 'f-bucket':{
    let s=`<rect width="260" height="200" fill="#5A564C"/><rect y="150" width="260" height="50" fill="#45413A"/>`;
    if(id==='betta') for(let c=0;c<9;c++) s+=`<rect x="${10+c*28}" y="40" width="18" height="28" rx="4" fill="#BFD8E0" opacity=".45" stroke="#7FA0A8" stroke-width=".8"/><g transform="translate(${19+c*28} 56)">${fishSprite('betta','swim',12)}</g>`;
    s+=`<path d="M60 90L200 90L186 190L74 190Z" fill="#3A6EA8" stroke="#1E3A5A" stroke-width="3"/><ellipse cx="130" cy="90" rx="70" ry="14" fill="#7A8A6A" stroke="#1E3A5A" stroke-width="3"/>`;
    s+=[0,1,2,3,4,5].map(i=>`<g transform="translate(${80+i*18} ${88+(i%2)*4}) rotate(${(i*47)%60-30}) scale(1 .6)">${fishSprite(id,i%2?'dead':'young',22,{flipV:i%3===0})}</g>`).join('');
    return s+`<g transform="translate(130 86) scale(1 .6)">${dead(Math.min(54,big*.6))}</g>`;}
  case 'f-shop':{
    let s=`<rect width="260" height="200" fill="#2A3238"/><rect x="40" y="40" width="180" height="120" fill="#7E9EA6" stroke="#141A1E" stroke-width="3"/><rect x="40" y="150" width="180" height="10" fill="#C9C2AE"/>`;
    s+=[0,1,2].map(i=>`<g transform="translate(${80+i*40} 148)">${fishSprite(id,'dead',22,{filter:'f-pale'})}</g>`).join('');
    s+=`<g transform="translate(150 146)">${dead(Math.min(70,big*.7),{ov:f.carrier&&DZ[f.carrier]?DZ[f.carrier].ov:''})}</g><rect x="100" y="166" width="60" height="14" fill="#F4E8C8"/><text x="130" y="176.5" text-anchor="middle" font-size="8.4" font-family="Jua,Gowun Dodum,sans-serif" fill="#C4301F">특가</text>`;
    return s+`<g transform="translate(70 90) rotate(-20)"><path d="M0 0L40 -40" stroke="#5A6268" stroke-width="2.4"/><ellipse cx="44" cy="-46" rx="12" ry="8" fill="none" stroke="#5A6268" stroke-width="1.4"/></g>`;}
  /* a sales tank in a shop: the same dark aisle as f-shop */
  case 'f-unsold': case 'f-shopeaten': case 'f-shopnip':{
    const g={x:30,y:34,w:200,h:124,len:200/FZ};
    let s=`<rect width="260" height="200" fill="#2A3238"/><rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="#7E9EA6" stroke="#141A1E" stroke-width="3"/><rect x="${g.x}" y="${g.y+g.h-12}" width="${g.w}" height="12" fill="#C9C2AE"/><rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="#4A5A3A" opacity=".18"/>`;
    const b=g.y+g.h-12, px=clamp(x.cm*4.4,40,90);
    if(fx==='f-unsold'){
      /* alone on the bottom, its own kind picking at it; two price tags, the old one crossed out */
      s+=`<g transform="translate(${g.x+g.w*.42} ${b-fh(px)/2+2}) rotate(4)">${dead(px,{filter:'f-dull',fin:.6})}</g>`;
      s+=[0,1].map(i=>`<g transform="translate(${g.x+g.w*.42+(i?-px*.45:px*.42)} ${b-fh(px)*.6-4}) ${i?'':'scale(-1 1)'}">${swimmer(fishSprite(id,'swim',Math.min(38,px*.55)),0,0,4,1.6,{delay:-i})}</g>`).join('');
      s+=`<g transform="translate(${g.x+12} ${g.y+g.h+6})"><rect width="58" height="18" fill="#F4E8C8"/><text x="29" y="12.6" text-anchor="middle" font-size="8.6" font-family="Jua,Gowun Dodum,sans-serif" fill="#5A5248">특가</text><path d="M4 9H54" stroke="#C4301F" stroke-width="1.6"/></g><g transform="translate(${g.x+76} ${g.y+g.h+6}) rotate(-4)"><rect width="58" height="18" fill="#F7E04A"/><text x="29" y="12.8" text-anchor="middle" font-size="9.4" font-weight="700" font-family="Jua,Gowun Dodum,sans-serif" fill="#C4301F">떨이</text></g>`;
      return s+`<g transform="translate(${g.x+g.w-18} ${g.y-2}) rotate(28)"><path d="M0 0L0 -26" stroke="#5A6268" stroke-width="2.4"/><ellipse cx="0" cy="4" rx="9" ry="6" fill="none" stroke="#5A6268" stroke-width="1.4"/></g>`;}
    if(fx==='f-shopnip'){
      const n=S.pred&&FISHART[S.pred]?S.pred:'peapuffer';
      s+=`<g transform="translate(${g.x+g.w*.5} ${b-fh(px)/2+2})">${dead(px,{fin:1,filter:'f-pale',ov:'fungus'})}</g>`;
      s+=[0,1,2].map(i=>swimmer(fishSprite(n,'swim',Math.min(40,(FX[n]||{cm:5}).cm*3.4)),g.x+g.w*(.3+i*.2),g.y+26+i*22,30,5+i*1.3,{delay:-i*1.4})).join('');
      return s+`<rect x="${g.x+70}" y="${g.y+g.h+6}" width="60" height="18" fill="#F4E8C8"/><text x="${g.x+100}" y="${g.y+g.h+18.6}" text-anchor="middle" font-size="8.6" font-family="Jua,Gowun Dodum,sans-serif" fill="#5A5248">판매 중</text>`;}
    /* f-shopeaten: the big fish, with the tail still showing */
    const p=S.pred&&FISHART[S.pred]?S.pred:'oscar';
    const ppx=Math.min(170,Math.max(110,(FX[p]||{cm:35}).cm*2.6)), tailPx=Math.min(ppx*.4,big*.8), cx=g.x+g.w*.56, cy=g.y+g.h*.46;
    const tp=clamp(x.cm*3.6,30,ppx*.5),mx=cx-ppx*.44,my=cy+ppx*.06;
    s+=`<g transform="translate(${cx} ${cy})">${fishSprite(p,'swim',ppx)}</g><defs><clipPath id="tailshop"><rect x="-300" y="-100" width="${300+tp*.08}" height="200"/></clipPath></defs><g transform="translate(${mx} ${my})" clip-path="url(#tailshop)"><g transform="translate(${-tp*.42} 0) rotate(-6) scale(-1 1)">${fishSprite(id,'dead',tp,{filter:'f-pale'})}</g></g>`;
    s+=[0,1,2].map(i=>`<circle cx="${cx-ppx*.4+i*7}" cy="${cy+10+i*12}" r="1.4" fill="#E8E4DA" opacity=".8"><animate attributeName="cy" values="${cy+10+i*12};${b}" dur="${5+i}s" repeatCount="indefinite"/></circle>`).join('');
    return s+`<rect x="${g.x+70}" y="${g.y+g.h+6}" width="60" height="18" fill="#F4E8C8"/><text x="${g.x+100}" y="${g.y+g.h+18.6}" text-anchor="middle" font-size="8.6" font-family="Jua,Gowun Dodum,sans-serif" fill="#5A5248">${f.endKey==='unsoldfeed'?'전시 수조':'혼합 수조'}</text>`;}
  /* the absurd ones */
  case 'f-burst':{
    const px=clamp(x.cm*3.4,40,120);
    let s=`<rect width="260" height="200" fill="#D8CFC0"/><rect y="120" width="260" height="80" fill="#A07A52"/>${Array.from({length:6},(_,i)=>`<path d="M0 ${130+i*12}L260 ${126+i*12}" stroke="#7E5E3E" stroke-width=".8" opacity=".6"/>`).join('')}`;
    s+=`<path d="M20 116L34 66L120 66L132 118Z" fill="#6E5A44"/><path d="M30 120l-6 10M126 120l8 12" stroke="#5A4634" stroke-width="5"/>`;
    s+=`<path d="M36 70L118 70L116 112L40 112Z" fill="none" stroke="#5A6268" stroke-width="2.4"/><path d="M118 70L104 96L116 112" fill="#D8CFC0" stroke="#5A6268" stroke-width="1.6"/>`;
    s+=`<ellipse cx="150" cy="160" rx="110" ry="26" fill="#9FC0CC" opacity=".55"/><ellipse cx="170" cy="164" rx="70" ry="14" fill="#C9E0E8" opacity=".5"/>`;
    s+=[[120,150,-20],[200,170,30],[90,176,10],[228,150,-40],[150,184,60]].map(p=>`<path d="M${p[0]} ${p[1]}l12 -4l-4 9z" fill="#E8F4F8" stroke="#8AA6B0" stroke-width=".8" opacity=".9" transform="rotate(${p[2]} ${p[0]} ${p[1]})"/>`).join('');
    return s+`<g transform="translate(165 160) rotate(6)">${dead(px,{filter:'f-pale'})}</g>`;}
  case 'f-cat':{
    const px=clamp(x.cm*3,34,90);
    let s=`<rect width="260" height="200" fill="#D8CFC0"/><rect y="120" width="260" height="80" fill="#A07A52"/>${Array.from({length:6},(_,i)=>`<path d="M0 ${130+i*12}L260 ${126+i*12}" stroke="#7E5E3E" stroke-width=".8" opacity=".6"/>`).join('')}`;
    s+=`<rect x="0" y="70" width="120" height="58" rx="10" fill="#6E5E7A"/><rect x="0" y="118" width="130" height="16" fill="#3A2E3E"/><rect x="0" y="134" width="130" height="10" fill="#1E1820" opacity=".7"/>`;
    const paw=(x0,y0,r)=>`<g transform="translate(${x0} ${y0}) rotate(${r})" fill="#7E6448" opacity=".55"><ellipse rx="4.4" ry="3.6"/><circle cx="-4" cy="-5" r="1.6"/><circle cx="0" cy="-6.4" r="1.6"/><circle cx="4" cy="-5" r="1.6"/></g>`;
    s+=[[250,150,-80],[228,160,-70],[206,152,-80],[184,163,-70]].map(p=>paw(...p)).join('');
    return s+`<g transform="translate(150 146) rotate(-8)">${dead(px,{filter:'f-dry',thin:.3})}</g><g fill="#B8B0A2" opacity=".7"><ellipse cx="176" cy="150" rx="5" ry="2"/></g>`;}
  case 'f-siphon':{
    let s=`<rect width="260" height="200" fill="#E4DED2"/><rect y="168" width="260" height="32" fill="#9C8466"/>`;
    s+=`<rect x="20" y="40" width="130" height="92" fill="${waterCol(f.wq)}" stroke="#4A5458" stroke-width="2.4"/><path d="M60 128Q62 60 120 30Q170 10 196 120" stroke="#5E8A6A" stroke-width="5" fill="none" opacity=".85"/>`;
    s+=`<path d="M170 120L222 120L216 192L176 192Z" fill="#3A6EA8" stroke="#1E3A5A" stroke-width="2.4"/><ellipse cx="196" cy="122" rx="26" ry="5" fill="#7A7A5A"/>`;
    return s+`<g transform="translate(196 180) scale(1 .7)">${dead(Math.min(30,clamp(x.cm*4,16,30)),{filter:'f-pale',flipV:1})}</g><path d="M178 132q8 4 14 0M200 140q6 5 12 0" stroke="#5A5A3A" stroke-width="1.4" fill="none" opacity=".6"/>`;}
  case 'f-sun':{
    let s=`<rect width="260" height="200" fill="#E9DCC0"/><rect x="40" y="10" width="180" height="120" fill="#FFF4D2" stroke="#C9B48A" stroke-width="4"/><path d="M130 10V130M40 70H220" stroke="#C9B48A" stroke-width="3"/>`;
    s+=[0,1,2,3].map(i=>`<path d="M${60+i*40} 14L${40+i*44} 130" stroke="#FFE69A" stroke-width="18" opacity=".35"/>`).join('');
    s+=`<rect x="20" y="132" width="220" height="14" fill="#B89A72"/><rect y="146" width="260" height="54" fill="#C9B08A"/>`;
    s+=`<ellipse cx="130" cy="102" rx="44" ry="34" fill="#C8D49A" opacity=".85" stroke="#A9B48A" stroke-width="2.4"/><path d="M98 80Q130 70 162 80" stroke="#7E8A3A" stroke-width="5" opacity=".5" fill="none"/>`;
    return s+`<g transform="translate(130 82)">${dead(clamp(x.cm*2.6,26,58),{flipV:1,filter:'f-pale'})}</g>`;}
  case 'f-eaten':{
    const p=S.pred&&FISHART[S.pred]?S.pred:'oscar';
    const ppx=Math.min(210,Math.max(120,(FX[p]||{cm:35}).cm*3.2));
    const tailPx=Math.min(ppx*.4,big*.8);
    if(f.tank&&f.tank!=='pond') return inTank((g)=>{const cx=g.x+g.w*.58,cy=g.y+g.h*.48;
      return `<defs><clipPath id="tailc"><rect x="0" y="-60" width="200" height="120"/></clipPath></defs><g transform="translate(${cx-ppx*.5+tailPx*.15} ${cy}) rotate(-8)"><g clip-path="url(#tailc)">${fishSprite(id,'dead',tailPx)}</g></g><g transform="translate(${cx} ${cy})">${fishSprite(p,'swim',ppx)}</g>`+[0,1,2,3].map(i=>`<circle cx="${cx-ppx*.4+i*7}" cy="${cy+10+i*12}" r="1.4" fill="#E8E4DA" opacity=".8"><animate attributeName="cy" values="${cy+10+i*12};${g.y+g.h-12}" dur="${5+i}s" repeatCount="indefinite"/></circle>`).join('')});
    return riverDead('eaten');}
  case 'eaten': case 'bite': return riverDead('eaten');
  case 'f-pond':
    return `<rect width="260" height="200" fill="#B7C4A6"/><path d="M8 78Q130 68 252 78L250 176Q130 186 10 176Z" fill="#7A9A92" stroke="#5E6656" stroke-width="3"/><g transform="translate(200 40)"><path d="M-6 30L-10 76M6 30L8 76" stroke="#3E3A34" stroke-width="2.4"/><ellipse cx="0" cy="18" rx="20" ry="13" fill="#9AA4AC"/><path d="M12 10Q22 -6 14 -20Q8 -30 18 -34" stroke="#7E868E" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="19" cy="-36" r="6" fill="#B8C0C6"/><path d="M24 -36L52 -30L24 -32Z" fill="#C9A23A"/></g><g fill="#E8E2D2">${[[60,76],[66,79],[72,75]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="2.6" ry="1.8"/>`).join('')}</g>`;
  case 'f-toilet': case 'flush':
    return `<rect width="260" height="200" fill="#E6EAEC"/><ellipse cx="130" cy="112" rx="88" ry="62" fill="#F8F8F6" stroke="#A9B0B4" stroke-width="3"/><ellipse cx="130" cy="118" rx="58" ry="38" fill="#C9DCE2" stroke="#A9B0B4" stroke-width="2"/><g transform="translate(130 120)"><g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="2.4s" repeatCount="indefinite"/><path d="M0 0m-6 0a6 6 0 1 1 12 0a14 14 0 1 1 -28 0a22 22 0 1 1 44 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/><g transform="translate(18 0)">${fishSprite(id,f.len<x.cm*.35?'young':'swim',Math.min(48,big*.5))}</g></g><animateTransform attributeName="transform" type="scale" values="1;.2" begin="1.5s" dur="2.6s" fill="freeze" additive="sum"/></g>`;
  case 'f-trash':
    return `<rect width="260" height="200" fill="#D6D2C8"/><rect y="160" width="260" height="40" fill="#A8A296"/><path d="M80 60L180 60L172 176L88 176Z" fill="#5E6A72" stroke="#3A444A" stroke-width="3"/><rect x="72" y="50" width="116" height="14" rx="3" fill="#4A545A"/><path d="M96 70Q130 60 164 72L160 150Q130 160 100 150Z" fill="#E8ECEE" opacity=".55" stroke="#B8C0C4" stroke-width="1"/><rect x="100" y="128" width="58" height="18" fill="#B8C4C8" opacity=".6"/><g transform="translate(130 136) rotate(-6)">${dead(Math.min(54,big*.6))}</g><path d="M110 90l8 4M140 84l10 6" stroke="#8A8478" stroke-width="2"/>`;
  case 'f-freezer':
    return `<rect width="260" height="200" fill="#E4EEF2"/><rect x="20" y="20" width="220" height="160" rx="6" fill="#F4F8FA" stroke="#B4C4CC" stroke-width="3"/><path d="M20 70H240M20 130H240" stroke="#C4D4DC" stroke-width="2"/><rect x="40" y="36" width="50" height="30" fill="#E8D8C8"/><rect x="170" y="140" width="56" height="34" fill="#D8C8B8"/>`+
      `<g transform="translate(130 100)"><path d="M-56 -26H56V26H-56Z" fill="#EAF4F8" stroke="#9AB8C8" stroke-width="1.6" opacity=".9"/><path d="M-56 -22H56" stroke="#5A8AB8" stroke-width="2"/>${fishSprite(id,'swim',Math.min(90,big*.8),{filter:'f-cold'})}<rect x="-54" y="-20" width="108" height="44" fill="#F4FAFC" opacity=".45"/></g>`+
      Array.from({length:10},(_,i)=>`<path d="M${30+i*22} 22l3 6l3 -6" stroke="#fff" stroke-width="1.4" fill="none"/>`).join('');
  case 'f-poison':{
    const p=f.endArg;
    return inTank((g)=>`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="${p==='soap'?'#F4F6F0':p==='spray'?'#E8EAD8':'#F2F2EA'}" opacity=".5"/>${p==='soap'?`<g fill="#fff" opacity=".8">${Array.from({length:12},(_,i)=>`<circle cx="${g.x+10+i*16}" cy="${g.y+4+(i%2)*3}" r="${3+(i%3)}"/>`).join('')}</g>`:''}<g transform="translate(${g.x+g.w*.5} ${g.y+fh(pxT(g))/2+2})">${dead(pxT(g),{flipV:1,filter:'f-pale'})}</g>`)+
      (p==='soju'?`<g transform="translate(222 150)"><rect x="-9" y="-26" width="18" height="40" rx="3" fill="#7EC08A" opacity=".85" stroke="#3A6A44" stroke-width="1"/><rect x="-5" y="-34" width="10" height="9" fill="#3A6A44"/></g>`:p==='spray'?`<g transform="translate(222 150) rotate(10)"><rect x="-8" y="-28" width="16" height="40" rx="3" fill="#E2C93A" stroke="#8A7A1A" stroke-width="1"/><rect x="-5" y="-34" width="10" height="7" fill="#C4301F"/></g>`:p==='med'?`<g transform="translate(222 152)"><rect x="-7" y="-20" width="14" height="28" rx="2" fill="#5A7AB8" stroke="#2A3A6A" stroke-width="1"/><rect x="-5" y="-25" width="10" height="6" fill="#fff"/></g>`:`<g transform="translate(222 152)"><rect x="-9" y="-24" width="18" height="34" rx="4" fill="#F2E26A" stroke="#9A8A2A" stroke-width="1"/><rect x="-4" y="-30" width="8" height="7" fill="#2F6BD1"/></g>`);}
  case 'f-hand':
    return `<rect width="260" height="200" fill="#DCD4C6"/><rect y="130" width="260" height="70" fill="#C9B89A"/>${Array.from({length:5},(_,i)=>`<path d="M0 ${138+i*14}L260 ${136+i*14}" stroke="#A8987A" stroke-width=".7"/>`).join('')}<rect x="0" y="30" width="80" height="96" fill="#8A7A66"/><rect x="6" y="36" width="68" height="56" fill="#9FC8D6" opacity=".7"/><g transform="translate(140 158) rotate(-8)">${dead(Math.min(46,big*.7),{filter:'f-pale',bent:1})}</g><g transform="translate(200 160)"><ellipse rx="14" ry="5" fill="#E2602A"/><rect x="-14" y="-16" width="28" height="16" rx="3" fill="#E2602A" opacity=".8"/></g>`;
  case 'f-glass':
    return `<rect width="260" height="200" fill="#3A322A"/><rect y="120" width="260" height="80" fill="#6E5640"/><g transform="translate(130 126)"><path d="M-14 -30L14 -30L11 4L-11 4Z" fill="#E8F0F2" opacity=".5" stroke="#C9D6DA" stroke-width="1.4"/><ellipse cx="0" cy="2" rx="11" ry="2.6" fill="#C9D6DA" opacity=".6"/></g><g transform="translate(200 116)"><rect x="-9" y="-30" width="18" height="44" rx="3" fill="#7EC08A" opacity=".85"/><rect x="-5" y="-38" width="10" height="9" fill="#3A6A44"/></g><g transform="translate(60 108) rotate(-12)"><rect x="-16" y="-28" width="32" height="56" rx="4" fill="#1E1E22"/><rect x="-13" y="-24" width="26" height="44" fill="#4A5A7A"/><circle cx="0" cy="0" r="5" fill="#C4301F"/></g>`;
  case 'f-euth':
    return `<rect width="260" height="200" fill="#E8E2D6"/><rect y="140" width="260" height="60" fill="#B8A486"/><g transform="translate(110 120)"><rect x="-50" y="-26" width="100" height="44" rx="6" fill="#DCEAF0" opacity=".7" stroke="#9AB0B8" stroke-width="1.6"/><g transform="translate(0 4)">${dead(Math.min(80,big*.7))}</g></g><g transform="translate(196 132)"><rect x="-8" y="-24" width="16" height="30" rx="2" fill="#8A5A2A" opacity=".85"/><rect x="-5" y="-30" width="10" height="7" fill="#2E2E2E"/></g><g transform="translate(222 150)"><path d="M-16 -2h32l-4 28h-24z" fill="#B8704A"/><rect x="-18" y="-6" width="36" height="6" fill="#9A5A3A"/><path d="M0 -6v-26" stroke="#C9A06A" stroke-width="3"/></g>`;
  case 'f-rest': case 'ghost':{
    if(S.wild||!f.tank) return riverDead('rest');
    return inTank((g,b)=>`<g transform="translate(${g.x+g.w*.5} ${b-6-fh(pxT(g))/2})">${dead(pxT(g))}</g>`)+`<path d="M0 0L60 200" stroke="#FFF8E0" stroke-width="30" opacity=".08"/><g transform="translate(232 178)"><path d="M-16 -2h32l-4 22h-24z" fill="#B8704A"/><rect x="-18" y="-6" width="36" height="6" fill="#9A5A3A"/><path d="M0 -6v-22" stroke="#C9A06A" stroke-width="3"/><path d="M-4 -6l-6 -10M4 -6l6 -12" stroke="#4E8A3A" stroke-width="1.6"/><circle cx="-10" cy="-17" r="3" fill="#F2E26A"/></g>`;}
  case 'f-aquarium':{
    let s=`<rect width="260" height="200" fill="#0E2A3A"/><rect x="0" y="0" width="260" height="170" fill="#1E5A7A"/>${[0,1,2,3].map(i=>`<path d="M${30+i*60} 0L${10+i*60} 170L${60+i*60} 170Z" fill="#AEE0F0" opacity=".07"/>`).join('')}<path d="M0 150Q130 140 260 152L260 170L0 170Z" fill="#C9B88A"/>`;
    s+=swimmer(fishSprite(id,'swim',Math.min(150,big)),130,90,60,16);
    return s+`<rect y="170" width="260" height="30" fill="#141A1E"/><g transform="translate(40 190)"><circle r="7" fill="#3A3A3A"/><rect x="-6" y="6" width="12" height="16" fill="#3A3A3A"/></g>`;}
  case 'plate': return deathScene(130,112,1.2);
  default:
    if(S.wild||!f.tank) return riverDead('bottom');
    return inTank((g,b)=>`<g transform="translate(${g.x+g.w*.5} ${b-12})">${dead(pxT(g))}</g>`);
  }
}
/* deaths in the river after release */
function riverDead(kind,o){
  const id=S.sp.id,x=fx_(),winter=season()==='winter',px=clamp((S.f.len||x.cm*.4)*2.2,24,130);
  let s=`<rect width="260" height="200" fill="#C9D2D2"/><path d="M0 50Q60 42 130 50T260 48L260 200L0 200Z" fill="${winter||kind==='ice'?'#8EA4AE':'#6A8478'}"/><path d="M0 178Q80 168 160 176T260 172L260 200L0 200Z" fill="#5A4E40"/><path d="M14 200q-4 -70 10 -140M28 200q6 -60 -4 -100M236 200q-6 -60 8 -120" stroke="#4E6A3A" stroke-width="4" fill="none"/>`;
  if(kind==='ice') return s+`<path d="M0 44L260 44L260 70L0 70Z" fill="#EEF6F8" opacity=".92"/><path d="M30 52l20 10M120 50l-14 12M200 54l18 8" stroke="#B8D0DA" stroke-width="1.4"/><g transform="translate(130 92)">${fishSprite(id,'dead',px,{filter:'f-cold',flipV:1})}</g>`;
  if(kind==='float') return s+`<g transform="translate(140 56)">${fishSprite(id,'dead',px,{flipV:1,filter:'f-pale'})}</g>`;
  if(kind==='eaten'){
    const pr=S.pred||'heron';
    if(pr==='heron') return s+`<g transform="translate(150 20)"><path d="M-6 50L-10 120M8 50L10 120" stroke="#3E3A34" stroke-width="2.6"/><ellipse cx="0" cy="36" rx="22" ry="15" fill="#9AA4AC"/><path d="M14 28Q26 10 16 -6Q10 -16 22 -20" stroke="#7E868E" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="23" cy="-22" r="7" fill="#B8C0C6"/><path d="M28 -22L60 -16L28 -18Z" fill="#C9A23A"/><g transform="translate(58 -12) rotate(80)">${fishSprite(id,'dead',Math.min(46,px*.6))}</g></g>`;
    return s+`<g transform="translate(150 130)" opacity=".85">${fishSprite('oscar','swim',140,{filter:'f-dark'})}</g>`+[0,1,2].map(i=>`<circle cx="${110+i*8}" cy="${130+i*6}" r="1.4" fill="#E8E4DA"/>`).join('');
  }
  if(kind==='rest') return s+`<g transform="translate(130 172)">${fishSprite(id,'dead',px)}</g>`;
  return s+`<g transform="translate(130 172)">${fishSprite(id,'dead',px,{thin:o&&o.thin?1:0,filter:'f-dull'})}</g>`;
}
/* the generic creature() (used by a few shared scenes such as the angler's pot) draws painted fish too */
Object.keys(FX).forEach(id=>{LOOK[id]={t:'rfish'}});
DRAW.rfish=(L,m,o,sp)=>({s:`<g transform="translate(0 22)">${fishSprite(sp.id,m==='dead'||m==='peace'?'dead':'swim',62,{filter:o.dull?'f-dull':o.char?'f-char':''})}</g>`,
  a:{side:1,head:[-24,20],hr:9,eyes:[[-26,18]],er:2,nose:[-31,22],mouth:[-31,24],top:6,leg:[0,32],body:[0,22],bw:22,bh:9,feet:34,ear:[-20,12]}});
