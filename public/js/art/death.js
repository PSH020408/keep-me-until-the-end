/* ---------- how a life ends, drawn ----------
   Bad endings are shown as they are: the starved body is skin and bone beside a bowl with a
   cobweb, the fish that jumped flaps on the floor and then dries like an anchovy, the road
   leaves a pancake with tyre tracks. No blood; the cartoon does the rest.
   Stage space 260×200. */
const O='#4A3428';
const st=`stroke="${O}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
const dTxt=(t,x,y,c,sz,cls)=>`<text x="${x}" y="${y}" font-family="Nanum Pen Script,cursive" font-size="${sz||26}" fill="${c||'#C4301F'}" text-anchor="middle" stroke="#FFF9EF" stroke-width="3" paint-order="stroke"${cls?` class="${cls}"`:''}>${t}</text>`;
const FLOOR={home:160,yard:172,box:168,tank:180,river:186,lake:186,park:172,mountain:168,sky:178,street:170,shelter:168,cafe:168,facility:168,suitcase:176};
const sideBody=()=>['fish','cricket'].includes((LOOK[S.sp.id]||{}).t);
/* creature placed in stage space */
const dPet=(x,y,sc,m,o,tf)=>{const s=creature(m,o||{});return `<g transform="translate(${pN(x)} ${pN(y)}) ${tf||''} scale(${pN(sc)})">${s}</g>`};
/* lying on its side so it rests on the floor */
const LIE={turtle:'flip',tortoise:'flip',snake:'stay',bug:'stay',crab:'stay',gecko:'stay',axo:'stay'};
const isRaster=()=>(LOOK[S.sp.id]||{}).t==='raster'&&!!RASTER[S.sp.id];
const dLie=(x,floor,sc,m,o)=>{const lt=LIE[(LOOK[S.sp.id]||{}).t];
  if(isRaster()) return dPet(x,floor-34*sc,sc,m,o);
  if(lt==='flip') return dPet(x,floor-16*sc,sc,m,o,'rotate(180)');
  if(lt==='stay') return dPet(x,floor-34*sc,sc,m,o,'rotate(-6)');
  return dLie0(x,floor,sc,m,o)};
const dLie0=(x,floor,sc,m,o)=>sideBody()?dPet(x,floor-(LOOK[S.sp.id].t==='fish'?16:8)*sc,sc,m,o,LOOK[S.sp.id].t==='cricket'?'rotate(180)':'rotate(8)'):dPet(x,floor-24*sc,sc,m,Object.assign({noPerch:1},o||{}),'rotate(90)');
const fly=(cx,cy,rx,ry,n)=>orbit(cx,cy,rx,ry,2.6,Array.from({length:n},()=>`<g class="a-buzz"><ellipse cx="-1.2" cy="-2" rx="2" ry="1" fill="#DCE8F0" opacity=".85" stroke="#8A9AA8" stroke-width=".3"/><ellipse cx="1.2" cy="-2" rx="2" ry="1" fill="#DCE8F0" opacity=".85" stroke="#8A9AA8" stroke-width=".3"/><ellipse cx="0" cy="0" rx="2.2" ry="1.6" fill="#1E2A22"/><circle cx="1.6" cy="-.4" r=".7" fill="#7A1E1E"/></g>`));
const bowl=(x,y,cob)=>`<path d="M${x-15} ${y-7}h30l-4 8h-22z" fill="${Pt.rg('#B9B2A8',{hi:.4})}" stroke="#6A625A" stroke-width="1"/><ellipse cx="${x}" cy="${y-7}" rx="15" ry="3" fill="#8A847C" stroke="#6A625A" stroke-width=".8"/>`+(cob?`<path d="M${x-15} ${y-7}L${x-26} ${y+1}M${x-15} ${y-7}L${x-24} ${y-14}M${x-15} ${y-7}L${x-29} ${y-6}M${x-20} ${y-3}q-2 -4 -1 -7M${x-23} ${y-3}q-2 -6 0 -9M${x+15} ${y-7}L${x+24} ${y-16}M${x+15} ${y-7}L${x+27} ${y-5}M${x+19} ${y-11}q3 2 4 5" stroke="#E8E4DC" stroke-width=".6" fill="none" opacity=".9"/>`:'');
/* cartoon skeleton built from the creature's anchors (for the x-ray flash and the fish bones) */
function skeleton(a,fish){
  const bone='#F4EEE2',ln='#8A8070';
  if(fish||a.side){
    const [bx,by]=a.body,w=(a.bw||14)*1.25;let d=`M${pN(bx-w*1.3)} ${pN(by)}L${pN(bx+w*.7)} ${pN(by)}`;
    for(let i=0;i<6;i++){const x=bx-w*.9+i*w*.28;d+=`M${pN(x)} ${pN(by)}l${pN(-w*.12)} ${pN(-a.bh*.9)}M${pN(x)} ${pN(by)}l${pN(-w*.12)} ${pN(a.bh*.9)}`}
    d+=`M${pN(bx-w*1.3)} ${pN(by)}l-6 -8M${pN(bx-w*1.3)} ${pN(by)}l-6 8`;
    return `<path d="${d}" stroke="${bone}" stroke-width="2" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${ln}" stroke-width=".5" fill="none"/><circle cx="${pN(a.head[0]+2)}" cy="${pN(a.head[1]+2)}" r="${pN(a.hr*.9)}" fill="${bone}" stroke="${ln}" stroke-width=".7"/><circle cx="${pN(a.eyes[0][0])}" cy="${pN(a.eyes[0][1])}" r="${pN(a.er*.9)}" fill="#1E1A18"/>`;
  }
  const [hx,hy]=a.head,hr=a.hr,[bx,by]=a.body,bw=a.bw,bh=a.bh;
  let d=`M${pN(hx)} ${pN(hy+hr*.6)}L${pN(bx)} ${pN(by+bh)}`;
  for(let i=0;i<4;i++){const y=by-bh*.5+i*bh*.3;d+=`M${pN(bx)} ${pN(y)}q${pN(-bw*.7)} ${pN(-2)} ${pN(-bw*.8)} ${pN(bh*.2)}M${pN(bx)} ${pN(y)}q${pN(bw*.7)} ${pN(-2)} ${pN(bw*.8)} ${pN(bh*.2)}`}
  const [lx,ly]=a.leg;d+=`M${pN(lx)} ${pN(by-bh*.4)}L${pN(lx)} ${pN(a.feet-1)}M${pN(-lx)} ${pN(by-bh*.4)}L${pN(-lx)} ${pN(a.feet-1)}M${pN(bx-bw*.7)} ${pN(by+bh*.6)}L${pN(bx-bw*1.1)} ${pN(a.feet-1)}M${pN(bx+bw*.7)} ${pN(by+bh*.6)}L${pN(bx+bw*1.1)} ${pN(a.feet-1)}`;
  let s=`<path d="${d}" stroke="${bone}" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${ln}" stroke-width=".5" fill="none" opacity=".6"/>`;
  s+=`<ellipse cx="${pN(hx)}" cy="${pN(hy)}" rx="${pN(hr*.82)}" ry="${pN(hr*.72)}" fill="${bone}" stroke="${ln}" stroke-width=".7"/><path d="M${pN(hx-hr*.35)} ${pN(hy+hr*.55)}h${pN(hr*.7)}v${pN(hr*.25)}h${pN(-hr*.7)}z" fill="${bone}" stroke="${ln}" stroke-width=".6"/><path d="M${pN(hx-hr*.2)} ${pN(hy+hr*.55)}v${pN(hr*.25)}M${pN(hx)} ${pN(hy+hr*.55)}v${pN(hr*.25)}M${pN(hx+hr*.2)} ${pN(hy+hr*.55)}v${pN(hr*.25)}" stroke="${ln}" stroke-width=".5"/>`;
  s+=a.eyes.map(e=>`<ellipse cx="${pN(e[0])}" cy="${pN(e[1])}" rx="${pN(a.er*1.2)}" ry="${pN(a.er*1.3)}" fill="#1E1A18"/>`).join('')+`<path d="M${pN(a.nose[0]-1.4)} ${pN(a.nose[1]+1)}l1.4 -2.4l1.4 2.4z" fill="#1E1A18"/>`;
  return s;
}

/* predators, drawn big */
function predator(p){
  switch(p){
  case 'catfish': return `<path d="M-50 0L-78 -20Q-70 0 -78 20Z" fill="#4E5452" ${st}/><ellipse rx="56" ry="22" fill="${Pt.rg('#5E6563')}" ${st}/><ellipse cx="0" cy="8" rx="44" ry="10" fill="#8A918E" opacity=".6"/><path d="M48 6q22 4 30 18M50 2q20 -6 30 -16M44 8q10 14 4 26" stroke="${O}" stroke-width="2" fill="none"/><circle cx="34" cy="-6" r="3.5" fill="#fff" stroke="${O}" stroke-width="1.5"/><circle cx="35" cy="-6" r="1.6" fill="${O}"/><path d="M40 6Q50 10 56 4" stroke="${O}" stroke-width="2.5" fill="none"/>`;
  case 'bass': return `<path d="M-46 0L-72 -22Q-64 0 -72 22Z" fill="#5C7A3A" ${st}/><path d="M-20 -20Q0 -40 20 -20Z" fill="#5C7A3A" ${st}/><ellipse rx="50" ry="24" fill="${Pt.rg('#7E9C52')}" ${st}/><path d="M-40 0L40 0" stroke="#3E5424" stroke-width="5" stroke-dasharray="8 5"/><ellipse cx="0" cy="12" rx="36" ry="8" fill="#E8E6C8" opacity=".7"/><path d="M36 -4L54 -10L54 14L36 8Z" fill="#7A2A2A" ${st}/><circle cx="30" cy="-10" r="4" fill="#F2D24A" stroke="${O}" stroke-width="1.5"/><circle cx="31" cy="-10" r="1.8" fill="${O}"/>`;
  case 'heron': return `<path d="M-10 26L-12 70M6 26L8 70" stroke="#C9A24A" stroke-width="3"/><ellipse cx="-4" cy="14" rx="30" ry="18" fill="${Pt.rg('#B9C0C7')}" ${st}/><path d="M-30 10L-52 20L-28 22Z" fill="#7D858D" ${st}/><path d="M16 4Q34 -10 22 -30Q14 -44 28 -50" stroke="${O}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M16 4Q34 -10 22 -30Q14 -44 28 -50" stroke="#D9DEE2" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="30" cy="-52" r="9" fill="#E9EDF0" ${st}/><path d="M26 -58L12 -62" stroke="${O}" stroke-width="3"/><path d="M37 -54L70 -48L37 -48Z" fill="#E2B33A" ${st}/><circle cx="31" cy="-54" r="2" fill="${O}"/>`;
  case 'cat': return `<path d="M-30 -20L-24 -52L-6 -30ZM30 -20L24 -52L6 -30Z" fill="#6F6A66" ${st}/><ellipse rx="38" ry="32" fill="${Pt.rg('#7E7974')}" ${st}/><ellipse cx="-14" cy="-6" rx="8" ry="9" fill="#F2D24A" stroke="${O}" stroke-width="2"/><ellipse cx="14" cy="-6" rx="8" ry="9" fill="#F2D24A" stroke="${O}" stroke-width="2"/><ellipse cx="-14" cy="-6" rx="2" ry="7" fill="${O}"/><ellipse cx="14" cy="-6" rx="2" ry="7" fill="${O}"/><path d="M-12 12Q0 22 12 12" stroke="${O}" stroke-width="2.5" fill="#fff"/><path d="M-6 14l2 5l2 -5M2 14l2 5l2 -5" stroke="${O}" stroke-width="1.2" fill="#fff"/><path d="M-10 6l-22 -4M-10 9l-22 4M10 6l22 -4M10 9l22 4" stroke="${O}" stroke-width="1.3"/>`;
  case 'straydog': return `<ellipse cx="-32" cy="-4" rx="11" ry="20" fill="#5E4630" ${st} transform="rotate(20 -32 -4)"/><ellipse cx="32" cy="-4" rx="11" ry="20" fill="#5E4630" ${st} transform="rotate(-20 32 -4)"/><ellipse rx="34" ry="30" fill="${Pt.rg('#8C6A48')}" ${st}/><circle cx="-12" cy="-8" r="5" fill="#fff" stroke="${O}" stroke-width="2"/><circle cx="12" cy="-8" r="5" fill="#fff" stroke="${O}" stroke-width="2"/><circle cx="-12" cy="-7" r="2.4" fill="${O}"/><circle cx="12" cy="-7" r="2.4" fill="${O}"/><path d="M-18 -16L-6 -12M18 -16L6 -12" stroke="${O}" stroke-width="2.5"/><path d="M-14 10Q0 24 14 10Z" fill="#7A2A2A" ${st}/><path d="M-10 11l2 5l2 -5M6 11l2 5l2 -5" fill="#fff" stroke="${O}" stroke-width="1"/><ellipse cx="0" cy="4" rx="5" ry="3.5" fill="${O}"/>`;
  case 'magpie': return `<path d="M-20 10L-60 26L-56 18Z" fill="#1E2A3A" ${st}/><ellipse rx="26" ry="18" fill="#1C1C1E" ${st}/><ellipse cx="2" cy="6" rx="16" ry="9" fill="#F4F4F2"/><path d="M-6 -4Q-18 -14 -30 -2" fill="#2F4F7A" ${st}/><circle cx="22" cy="-12" r="11" fill="#1C1C1E" ${st}/><path d="M30 -14L46 -10L30 -8Z" fill="#2B2B2B" ${st}/><circle cx="25" cy="-14" r="2.5" fill="#fff"/>`;
  case 'hawk': return `<path d="M-6 0Q-50 -40 -80 -20Q-50 -10 -10 10Z" fill="#7A5634" ${st}/><path d="M6 0Q50 -40 80 -20Q50 -10 10 10Z" fill="#7A5634" ${st}/><ellipse rx="16" ry="24" fill="${Pt.rg('#A9784A')}" ${st}/><circle cx="0" cy="-26" r="11" fill="#C99A6A" ${st}/><path d="M-4 -22L0 -14L4 -22Z" fill="#E2B33A" ${st}/><circle cx="-4" cy="-28" r="2" fill="${O}"/><circle cx="4" cy="-28" r="2" fill="${O}"/><path d="M-6 24l-4 10M6 24l4 10" stroke="#E2B33A" stroke-width="3"/>`;
  case 'snake': return `<ellipse cx="0" cy="30" rx="60" ry="14" fill="#6B4E2E" ${st}/><ellipse cx="0" cy="14" rx="48" ry="12" fill="#6B4E2E" ${st}/><path d="M10 0Q40 -6 46 -26Q50 -44 30 -46" stroke="${O}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M10 0Q40 -6 46 -26Q50 -44 30 -46" stroke="#6B4E2E" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M22 -46Q36 -62 50 -52L46 -40Z" fill="#7A2A2A" ${st}/><circle cx="34" cy="-54" r="3" fill="#F2D24A" stroke="${O}" stroke-width="1.5"/>`;
  case 'gecko': return `<ellipse rx="56" ry="38" fill="${Pt.rg('#F2D25C')}" ${st}/><circle cx="-24" cy="-12" r="13" fill="#fff" stroke="${O}" stroke-width="2.5"/><circle cx="24" cy="-12" r="13" fill="#fff" stroke="${O}" stroke-width="2.5"/><ellipse cx="-24" cy="-12" rx="3" ry="10" fill="${O}"/><ellipse cx="24" cy="-12" rx="3" ry="10" fill="${O}"/><path d="M-36 14Q0 34 36 14Q0 22 -36 14Z" fill="#7A2A2A" ${st}/><circle cx="-14" cy="-28" r="3" fill="#5A4A2E"/><circle cx="14" cy="-30" r="3" fill="#5A4A2E"/>`;
  default: return '';
  }
}
const PRED_POS={catfish:[180,120],bass:[180,115],heron:[175,110],cat:[175,105],straydog:[175,105],magpie:[180,90],hawk:[170,80],snake:[160,110],gecko:[150,115]};
const MOUTH={catfish:[54,6],bass:[54,4],heron:[68,-50],cat:[0,18],straydog:[0,18],magpie:[46,-11],hawk:[0,36],snake:[48,-48],gecko:[0,22]};

function deathScene(cx,cy,sc){
  let fx=S.fx||'ghost';
  if(fx==='heat'&&S.endCat==='화재') fx='burn';
  const env=S.env, t=LOOK[S.sp.id]||{}, fish=t.t==='fish', pr=S.pred;
  const fl=env==='tank'&&['fish','axo','turtle'].includes(t.t)?164:FLOOR[env]||160;
  const pp=PRED_POS[pr]||[170,110];
  switch(fx){
  case 'starve':{
    if(fish||t.t==='axo') return `<rect x="34" y="40" width="192" height="130" fill="#6E6A3A" opacity=".35"/>`+dPet(cx,70,sc,'dead',{thin:1,dull:1},'scale(1 -1)')+fly(cx,58,26,6,2)+dTxt('텅',cx+64,60,'#5F6878');
    const bx=cx+74;
    return `<ellipse cx="${cx}" cy="${fl+1}" rx="${46*sc}" ry="4" fill="#3A2A1C" opacity=".18"/>`+dLie(cx-6,fl,sc,'dead',{thin:1,dull:1})+bowl(bx,fl,1)+fly(cx-6,fl-34*sc,30,10,3)+dTxt('텅',bx,fl-18,'#5F6878',22);}
  case 'jump':{
    const y=fl+2;
    return `<g class="d-out"><g transform="translate(${cx+50} ${y-12})"><g class="d-flop" style="transform-origin:0px 6px">${dPet(0,0,sc*.55,'scared',{})}</g></g>${dTxt('파닥파닥',cx+50,y-46,'#C4301F',20)}</g>`+
      `<g class="d-in"><g transform="translate(${cx+46} ${y-8}) rotate(-10) scale(1 .7)">${dPet(0,0,sc*.82,'dead',{thin:1,dry:1},'rotate(16) skewX(-14)')}</g><path d="M${cx+28} ${y-12}l3 4M${cx+44} ${y-14}l2 5M${cx+58} ${y-10}l-2 4" stroke="#4A3A28" stroke-width=".7" opacity=".7"/><path d="M${cx+30} ${y-2}q20 -3 40 0" stroke="#8A6A4A" stroke-width=".7" fill="none" opacity=".6"/>${fly(cx+50,y-16,16,5,1)}${dTxt('바삭',cx+50,y-40,'#8A5A2A',24)}</g>`;}
  case 'flat':{
    const ry=env==='street'?172:fl+2;
    const pancake=`<g transform="translate(${cx} ${ry-3}) scale(${pN(sc*1.9)} ${pN(sc*.2)})">${creature('dead',{dull:.4})}</g>`;
    const tread=`<path d="M${cx-60} ${ry-7}h120v7h-120z" fill="#1E1E1E" opacity=".45"/><path d="${Array.from({length:12},(_,i)=>`M${cx-58+i*10} ${ry-7}l4 3.5l-4 3.5`).join('')}" stroke="#4A4A4A" stroke-width="1.6" fill="none"/>`;
    return `<g class="d-before">${dPet(cx,ry-34*sc,sc,'scared',{})}</g>`+
      `<g class="d-after">${pancake}${tread}<g class="a-float">${puff(cx-30,ry-16,3,'#E8DCC8')+puff(cx+26,ry-20,2.4,'#E8DCC8')}</g>${dTxt('납작',cx,ry-40)}</g>`+
      `<g class="d-car"><rect x="-60" y="${ry-46}" width="96" height="34" rx="10" fill="#3E4A5E" stroke="#1E1E1E" stroke-width="2"/><rect x="-40" y="${ry-62}" width="56" height="22" rx="8" fill="#56637A" stroke="#1E1E1E" stroke-width="2"/><circle cx="-38" cy="${ry-10}" r="10" fill="#1E1E1E"/><circle cx="18" cy="${ry-10}" r="10" fill="#1E1E1E"/><path d="M36 ${ry-36}l60 -14v34z" fill="#FFF3B0" opacity=".55"/></g>`;}
  case 'bite':{
    const id='bc'+S.no;const edge='M0 -40L6 -30L0 -20L6 -10L0 0L6 10L0 20L6 30L0 40';
    const bone=`<path d="M3 -6h-14M3 0h-16M3 6h-14" stroke="#F4EEE2" stroke-width="2.6" stroke-linecap="round"/><circle cx="-13" cy="-6" r="1.8" fill="#F4EEE2"/><circle cx="-15" cy="0" r="1.8" fill="#F4EEE2"/><circle cx="-13" cy="6" r="1.8" fill="#F4EEE2"/>`;
    return `<defs><clipPath id="${id}"><path d="${edge}L80 40L80 -40Z"/></clipPath></defs>`+
      (pr&&pr!=='none'?`<g class="d-leave"><g transform="translate(60 ${cy-30}) scale(.55) scale(-1 1)">${predator(pr)}</g>${dTxt('냠',50,cy-70)}</g>`:'')+
      (!['river','lake','tank'].includes(env)?`<g transform="translate(${cx+10} ${fl-14})"><g transform="rotate(${sideBody()||isRaster()?8:80}) scale(${sc})"><g clip-path="url(#${id})">${creature('dead',{noPerch:1})}</g>${bone}</g></g>`+[0,1,2,3].map(i=>`<g class="a-rain" style="animation-duration:${2.6+i*.3}s;animation-delay:${i*.4}s">${puff(cx-20+i*14,fl-40-i*6,2,(LOOK[S.sp.id]||{}).c||'#E8DCC8')}</g>`).join(''):
      `<g transform="translate(${cx+10} ${cy+8})"><g class="d-sink"><g transform="rotate(${sideBody()||isRaster()?8:80}) scale(${sc})"><g clip-path="url(#${id})">${creature('dead',{noPerch:1})}</g>${bone}</g></g></g>`+
      [0,1,2].map(i=>`<circle class="a-bubble" style="animation-delay:${i*.7}s" cx="${cx+4+i*6}" cy="${cy}" r="${2+i}" fill="none" stroke="#fff" stroke-width="1.2"/>`).join(''));}
  case 'eaten':{
    const mo=MOUTH[pr]||[0,0];
    return `<g transform="translate(${pp[0]} ${pp[1]})">${predator(pr)}<ellipse cx="${-8}" cy="${8}" rx="16" ry="10" fill="#000" opacity=".12"/></g><g transform="translate(${pp[0]+mo[0]} ${pp[1]+mo[1]})"><g class="d-gulp">${dPet(0,0,.32*Math.min(sc,1.4),'scared',{noPerch:1},'rotate(28)')}</g></g>`+
      [0,1,2,3].map(i=>`<g class="a-rain" style="animation-duration:${2.4+i*.4}s;animation-delay:${i*.5}s">${puff(pp[0]-30+i*16,pp[1]-30+i*4,2.2,(LOOK[S.sp.id]||{}).c||'#E8DCC8')}</g>`).join('')+dTxt('꿀꺽',60,46);}
  case 'freeze':
    return dPet(cx,cy,sc,'scared',{dull:.3,noPerch:1})+`<rect x="${cx-58}" y="${cy-62}" width="116" height="${fl-cy+64}" rx="8" fill="#CDEBFA" fill-opacity=".62" stroke="#7FB8D8" stroke-width="3"/><path d="M${cx-46} ${cy-50}L${cx-30} ${cy-22}M${cx+40} ${cy-40}l-8 14l6 4l-10 16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`+
      Array.from({length:7},(_,i)=>`<path d="M${cx-50+i*16} ${cy-62}l3 ${8+(i%3)*5}l3 ${-8-(i%3)*5}z" fill="#E6F6FD" stroke="#9AC8E0" stroke-width=".7"/>`).join('')+dTxt('꽁꽁',cx,cy-70,'#2F6BD1');
  case 'heat':
    return `<rect width="260" height="200" fill="#F06A2A" opacity=".2"/><circle cx="222" cy="34" r="16" fill="#FFD24A" opacity=".85"/>`+dLie(cx,fl,sc,'dead',{dull:.2})+bowl(cx+76,fl,0)+
      [0,1,2].map(i=>`<path class="rise" style="animation-delay:${i*.7}s" d="M${cx-24+i*24} ${fl-50}q-6 -10 0 -20t0 -20" stroke="#E88A5A" stroke-width="2.4" fill="none" opacity=".8"/>`).join('')+dTxt(S.sp.g==='dog'&&S.endCat!=='열사'?'50℃':'40℃',cx+70,56);
  case 'burn':
    return `<rect width="260" height="200" fill="#2A2420" opacity=".55"/>`+dLie(cx,fl,sc,'dead',{char:1})+
      [0,1,2,3].map(i=>`<g class="a-smoke" style="animation-delay:${i*.6}s;animation-duration:3.4s">${puff(cx-30+i*20,fl-40,7,'#6E6A66')}</g>`).join('')+[0,1,2].map(i=>`<circle class="rise" style="animation-delay:${i*.9}s" cx="${cx-20+i*22}" cy="${fl-10}" r="1.4" fill="#F28A2A"/>`).join('')+dTxt('콜록',cx+70,52,'#E8E4DC');
  case 'flush':
    return `<rect width="260" height="200" fill="#E9EEF0"/><ellipse cx="130" cy="120" rx="80" ry="54" fill="#fff" stroke="${O}" stroke-width="3"/><ellipse cx="130" cy="120" rx="56" ry="34" fill="#9FD3E6" stroke="${O}" stroke-width="2"/><g transform="translate(130 120)"><g class="a-spin"><path d="M0 0m-6 0a6 6 0 1 1 12 0a12 12 0 1 1 -24 0a18 18 0 1 1 36 0a26 26 0 1 1 -52 0" stroke="#fff" stroke-width="2.5" fill="none"/></g></g><g transform="translate(130 120)"><g class="d-drain">${dPet(0,0,sc*.42,'scared',{noPerch:1})}</g></g>`+dTxt('쏴아아',130,40,'#2F6BD1');
  case 'fall':{
    const y=fl;
    return `<rect x="0" y="${y-2}" width="260" height="${202-y}" fill="#9A9890"/><path d="M${cx-40} ${y}l-14 10M${cx+40} ${y}l16 8M${cx-20} ${y+2}l-6 12M${cx+18} ${y+2}l8 14" stroke="#5E5C56" stroke-width="1.6" fill="none"/>`+
      `<g transform="translate(${cx} ${y-9*sc}) scale(${pN(sc*1.35)} ${pN(sc*.42)})">${creature('dead',{noPerch:1})}</g>`+orbit(cx,y-30*sc,26,6,1.4,[star(0,0,3.4),star(0,0,2.6),star(0,0,3.4)])+
      `<rect x="200" y="0" width="60" height="70" fill="#C9C4BA" stroke="${O}" stroke-width="2"/><rect x="214" y="18" width="30" height="34" fill="#9FD3E6" stroke="${O}" stroke-width="2"/><path d="M214 18l-12 8v34l12 -8z" fill="#E8F4FA" stroke="${O}" stroke-width="1.6"/>`+dTxt('쿵',cx,y-60);}
  case 'poison':{
    const item=S.sp.g==='dog'?`<g transform="translate(${cx+70} ${fl-6}) rotate(-12)"><rect x="-14" y="-6" width="28" height="12" fill="#5A3020" stroke="#2A1810" stroke-width="1"/><path d="M-14 -6h12v12h-12z" fill="#C4301F"/><path d="M6 -6q3 3 0 6q3 3 0 6" stroke="#EFE3CF" stroke-width="2" fill="none"/></g>`:
      S.sp.g==='cat'?`<g transform="translate(${cx+72} ${fl-4}) rotate(80)"><path d="M-6 -18h12l-2 18h-8z" fill="#CDE6F2" stroke="#6A8A9A" stroke-width="1"/><path d="M0 -18q-2 -12 -10 -16M0 -18q6 -10 4 -20" stroke="#4E9C37" stroke-width="1.4" fill="none"/><path d="M-10 -34l-6 -4l4 6l-6 2l7 1z M4 -38l-2 -7l4 5l4 -4l-2 7z" fill="#FFFFFF" stroke="#C9A04A" stroke-width=".6"/></g><circle cx="${cx+46}" cy="${fl-2}" r="1.6" fill="#F2B23A"/><circle cx="${cx+40}" cy="${fl-1}" r="1.2" fill="#F2B23A"/>`:
      `<g transform="translate(${cx+70} ${fl-10}) rotate(70)"><rect x="-6" y="-12" width="12" height="20" rx="3" fill="#7AB84A" stroke="#3A5A2A" stroke-width="1"/><rect x="-4" y="-16" width="8" height="5" fill="#3A3A3A"/></g>`;
    return `<rect width="260" height="200" fill="#7BC94A" opacity=".14"/>`+dLie(cx,fl,sc,'dead',{dull:.25})+item+
      [0,1,2,3].map(i=>`<circle class="rise" style="animation-delay:${i*.5}s;animation-duration:2.4s" cx="${cx-12+i*7}" cy="${fl-26*sc}" r="${2+i%2}" fill="#F4FAF0" stroke="#9AB88A" stroke-width=".6"/>`).join('')+
      [0,1].map(i=>`<path class="rise" style="animation-delay:${i*1.2}s" d="M${cx-10+i*20} ${fl-40}q-5 -8 0 -16t0 -16" stroke="#8ACB5A" stroke-width="2.2" fill="none" opacity=".7"/>`).join('');}
  case 'drown':
    return `<g class="d-drown"><rect y="40" width="260" height="170" fill="#7A6A4E" opacity=".72"/></g>`+
      `<path d="M210 ${fl}l-40 ${-40}" stroke="#5F646C" stroke-width="2.6" stroke-dasharray="4 2"/>`+dPet(cx+20,fl-70,sc,'dead',{dull:.3},'rotate(20)')+
      [0,1,2,3].map(i=>`<circle class="a-bubble" style="animation-delay:${i*.6}s" cx="${cx+10+i*8}" cy="${fl-80}" r="${2+i}" fill="none" stroke="#E8E0CC" stroke-width="1.4"/>`).join('')+dTxt('꼬르륵',70,60,'#E8E0CC');
  case 'sickdead':{
    const paper=`<g transform="translate(${cx+66} ${fl-4}) rotate(-8)"><path d="M-16 -12h30l2 22h-32z" fill="#FBF8F2" stroke="#9A948A" stroke-width=".8"/><text x="0" y="-4" font-size="5.4" text-anchor="middle" fill="#3A3430" font-family="Jua,Gowun Dodum,sans-serif">진료비 견적서</text><path d="M-11 0h22M-11 3h16" stroke="#C9C4BA" stroke-width=".8"/><text x="0" y="8.6" font-size="5" text-anchor="middle" fill="#C4301F" font-family="IBM Plex Mono,monospace">₩3,000,000</text></g>`;
    return `<path d="M${cx-58} ${fl}q58 -10 116 0z" fill="#B8A898" opacity=".7"/>`+dLie(cx-6,fl-2,sc,'dead',{thin:.45,dull:.6})+paper+fly(cx-6,fl-30*sc,22,7,1);}
  case 'bellyup':
    return `<rect x="34" y="40" width="192" height="130" fill="#B7B88A" opacity=".45"/>`+dPet(cx,62,sc,'dead',{dull:.55},'scale(1 -1)')+`<path d="M40 52h180" stroke="#fff" stroke-width="1.4" opacity=".6"/>`+(S.endCat==='사고'?`<path d="M58 6v24h14v-6" stroke="#9AA4AC" stroke-width="6" fill="none" stroke-linejoin="round"/><path class="a-rain" d="M72 28v20" stroke="#BFE6FA" stroke-width="5" stroke-linecap="round"/>`:'')+dTxt('둥둥',cx+70,96,'#5F6878',20);
  case 'plate':{
    const fishy=fish||t.t==='axo';
    const pot=`<ellipse cx="130" cy="150" rx="78" ry="16" fill="#2E2A28" stroke="#1A1614" stroke-width="2"/><path d="M52 132q0 30 78 34q78 -4 78 -34z" fill="${Pt.rg('#3A3430',{hi:.25})}" stroke="#1A1614" stroke-width="2"/><ellipse cx="130" cy="132" rx="78" ry="17" fill="#2A2624" stroke="#1A1614" stroke-width="2"/><ellipse cx="130" cy="133" rx="70" ry="13" fill="${fishy?'#C9442A':'#EFE2C4'}"/>`;
    const meat=fishy?`<g transform="translate(124 126) rotate(-10) scale(1.05 .72)">${creature('dead',{dull:.5})}</g><path d="M86 130l14 -3M150 136l16 -2M120 140l10 2" stroke="#4E9C37" stroke-width="2.4" stroke-linecap="round"/><path d="M162 126q6 -2 10 4" stroke="#C4301F" stroke-width="3" fill="none" stroke-linecap="round"/>`
      :`<ellipse cx="130" cy="128" rx="30" ry="12" fill="${Pt.rg('#F2DDB8',{hi:.4})}" stroke="#B89A6A" stroke-width="1.2"/><path d="M104 124q-10 -8 -6 -16" stroke="#F2DDB8" stroke-width="7" stroke-linecap="round"/><path d="M156 124q10 -8 6 -16" stroke="#F2DDB8" stroke-width="7" stroke-linecap="round"/><circle cx="98" cy="107" r="3.6" fill="#FBF6EC" stroke="#B89A6A" stroke-width=".8"/><circle cx="162" cy="107" r="3.6" fill="#FBF6EC" stroke="#B89A6A" stroke-width=".8"/><circle cx="114" cy="138" r="3" fill="#9A2A2A"/><circle cx="146" cy="138" r="2.6" fill="#9A2A2A"/><circle cx="130" cy="140" r="2.4" fill="#F4EEE2"/>`;
    const flag=`<path d="M150 124l14 -34" stroke="#C9A06A" stroke-width="1.4"/><path d="M163 92l18 -2l-4 7l4 6l-18 1z" fill="#FBF8F2" stroke="#9A948A" stroke-width=".7"/><text x="171" y="99.6" font-size="6" text-anchor="middle" fill="#3A3430" font-family="Jua,Gowun Dodum,sans-serif">${(S.disp||'').replace(/[<&>]/g,'')}</text>`;
    return `<rect width="260" height="200" fill="#EFE3CF"/><rect y="150" width="260" height="50" fill="#B98A5A"/>`+pot+meat+flag+`<path d="M40 176L120 160M44 182L124 166" stroke="#C9A06A" stroke-width="3" stroke-linecap="round"/>`+
      [0,1,2].map(i=>`<path class="rise" style="animation-delay:${i*.7}s" d="M${104+i*26} 104q-6 -10 0 -20t0 -20" stroke="#B9B2A8" stroke-width="3" fill="none"/>`).join('');}
  case 'cage':{
    const yb=fl-4;
    const bars=env!=='shelter';
    return `<rect x="20" y="20" width="220" height="${yb-16}" fill="#2E3238" opacity=".12"/>`+dLie(cx,yb,sc,'dead',{thin:.75,dull:.6})+(!bars?'':
      `<rect x="${cx-62}" y="${yb}" width="124" height="6" fill="none" stroke="#5F646C" stroke-width="1.6"/><path d="${Array.from({length:16},(_,i)=>`M${cx-62+i*8} ${yb}v6`).join('')}" stroke="#5F646C" stroke-width="1.2"/>`+
      `<rect x="${cx-62}" y="30" width="124" height="${yb-30}" fill="none" stroke="#5F646C" stroke-width="2.4"/><path d="${Array.from({length:12},(_,i)=>`M${cx-52+i*10} 30v${yb-30}`).join('')}" stroke="#5F646C" stroke-width="1.6"/>`+
      '')+`<rect x="${cx+30}" y="40" width="26" height="12" fill="#FBF8F2" stroke="#9A948A" stroke-width=".8"/><text x="${cx+43}" y="49" font-size="7" text-anchor="middle" fill="#3A3430" font-family="IBM Plex Mono,monospace">No.${S.no.slice(-2)}</text>`+bowl(cx+44,yb,1);}
  case 'truck':
    return `<g class="d-drive"><rect x="30" y="70" width="170" height="80" fill="#9CA3A8" ${st}/><rect x="200" y="96" width="44" height="54" rx="4" fill="#3E6CA8" ${st}/><circle cx="70" cy="156" r="14" fill="#2B2B2B" ${st}/><circle cx="210" cy="156" r="14" fill="#2B2B2B" ${st}/>`+
      dPet(115,112,sc*.55,'sad',{noPerch:1})+Array.from({length:8},(_,i)=>`<rect x="${36+i*21}" y="72" width="4" height="76" fill="#5F646C"/>`).join('')+`</g>`+[0,1,2].map(i=>`<g class="a-smoke" style="animation-delay:${i*.5}s">${puff(20,140-i*4,5,'#9A948E')}</g>`).join('');
  case 'bottle':
    return [60,200].map(x=>`<rect x="${x-18}" y="70" width="36" height="96" rx="12" fill="#DDEFF5" fill-opacity=".4" stroke="#7FA9BA" stroke-width="2"/>`).join('')+`<rect x="80" y="40" width="100" height="130" rx="22" fill="#DDEFF5" fill-opacity=".55" stroke="#7FA9BA" stroke-width="3"/><rect x="112" y="24" width="36" height="20" rx="4" fill="#2F6BD1" ${st}/>`+dPet(130,120,sc*.5,'dead',{thin:.5,dull:.4,noPerch:1},'rotate(60)')+`<path d="M92 60q-2 40 4 90" stroke="#fff" stroke-width="4" opacity=".5" stroke-linecap="round"/>`;
  case 'zap':{
    const body=creature('dead',{dull:.3,noPerch:1,pose:'sit'}), a=CREA;
    const frizz=`<path d="${Array.from({length:12},(_,i)=>{const an=Math.PI*(1+i/11),x=a.head[0]+Math.cos(an)*a.hr*1.1,y=a.head[1]+Math.sin(an)*a.hr;return `M${pN(x)} ${pN(y)}l${pN(Math.cos(an)*3)} ${pN(Math.sin(an)*3-2)}l1.4 1l${pN(Math.cos(an)*3)} ${pN(Math.sin(an)*3-2)}`}).join('')}" stroke="#3A2A1E" stroke-width="1.2" fill="none"/>`;
    return `<rect width="260" height="200" fill="#1E1E2A" opacity=".18"/><path d="M0 ${fl-6}q60 -6 ${cx-50} 0" stroke="#2E2E2E" stroke-width="3" fill="none"/>`+
      `<g transform="translate(${cx} ${cy}) scale(${sc})"><g class="a-xray">${body}${frizz}</g><g class="a-xray2"><rect x="-40" y="-56" width="80" height="94" fill="#1E2A4A" opacity=".85"/>${skeleton(a)}</g></g>`+
      [[-46,-30],[40,-40],[-38,20],[46,10]].map(p=>`<path class="blink" d="M${cx+p[0]} ${cy+p[1]}l8 -10l-3 8l9 -2l-10 12l3 -8z" fill="#FFE14A" stroke="${O}" stroke-width="1.2"/>`).join('')+dTxt('파직',cx+70,36);}
  case 'gone':{
    const nm=(S.disp||'').replace(/[<&>]/g,'');
    if(!['dog','cat'].includes(S.sp.g)) return `<rect x="168" y="40" width="44" height="30" rx="3" fill="#D8D6D0" stroke="${O}" stroke-width="2"/><path d="M172 47h36M172 53h36M172 59h36M172 65h36" stroke="#6A665E" stroke-width="2"/><path d="M190 70q-6 20 -22 30q-14 8 -20 24" stroke="#C9B89A" stroke-width="3" fill="none" stroke-dasharray="2 2" opacity=".8"/>`+dTxt('?',110,120,'#5F6878',80);
    return `<ellipse cx="${cx}" cy="${fl+2}" rx="28" ry="4" fill="#3A2A1C" opacity=".12"/><ellipse cx="${cx}" cy="${fl-3}" rx="14" ry="4" fill="none" stroke="#C4301F" stroke-width="3"/><circle cx="${cx+2}" cy="${fl+3}" r="4" fill="#E2B33A" stroke="#8A6A1A" stroke-width=".8"/><text x="${cx+2}" y="${fl+4.6}" font-size="3.4" text-anchor="middle" fill="#3A2A10">${nm.slice(0,4)}</text>`+dTxt('?',130,110,'#5F6878',90);}
  case 'ghost': default:{
    const calm=S.calm;
    return (calm?`<path d="M${cx-52} ${fl}q52 -12 104 0z" fill="#E8C9C9" opacity=".8"/>`:'')+dLie(cx,fl-(calm?2:0),sc,calm?'peace':'dead',{noPerch:1})+
      (calm?`<g transform="translate(${cx+56} ${fl-6})"><path d="M0 0v-14M-4 0l-3 -12M4 0l3 -12" stroke="#4E9C37" stroke-width="1.2"/><circle cx="0" cy="-16" r="3.4" fill="#F7E36A"/><circle cx="-7.4" cy="-13" r="3" fill="#F2A0B4"/><circle cx="7.4" cy="-13" r="3" fill="#FFFFFF" stroke="#C9C4BA" stroke-width=".5"/></g>`:'')+
      `<g class="d-rise"><g transform="translate(${cx} ${cy-28}) scale(${sc*.75})" opacity=".55">${creature('peace',{noPerch:1})}</g><ellipse cx="${cx}" cy="${cy-30-46*sc*.75}" rx="12" ry="3.6" fill="none" stroke="#E2B33A" stroke-width="2.4"/></g>`;}
  }
}
