/* ---------- what each species looks like ----------
   t = drawing template; the rest are colours and features read by that template.
   Kept apart from species.js so the simulation data stays free of art. */
const LOOK={
 mix:{t:'raster',coat:'short',ear:'flop',c:'#C68C55',ec:'#8E5D33',chest:'#F5E7D3',muz:'#F2DFC8',nose:'#2B1C16',iris:'#6B3E1E',tail:'wag'},
 maltese:{t:'raster',coat:'long',ear:'long',c:'#F8F5F0',ec:'#EFE8DE',chest:'#FFFFFF',muz:'#FFFFFF',nose:'#1E1614',iris:'#2E1C14',tail:'plume',bow:'#F28BAA'},
 poodle:{t:'raster',coat:'curly',ear:'curly',c:'#BA7748',ec:'#A5653B',chest:'#C4835A',muz:'#C88E66',nose:'#4A2A1E',iris:'#4E2A1A',tail:'pom'},
 pome:{t:'raster',coat:'fluffy',ear:'small',c:'#EDA54E',ec:'#D88B36',chest:'#F8D29C',muz:'#F5C68A',nose:'#241814',iris:'#3A2216',tail:'plume',ruff:1},
 jindo:{t:'raster',coat:'short',ear:'prick',c:'#ECDDC2',ec:'#DCC8A4',chest:'#FBF6EC',muz:'#FBF5EA',nose:'#2B2220',iris:'#5A3A22',tail:'curl'},
 shihtzu:{t:'raster',coat:'long',ear:'long',c:'#E9DCC4',ec:'#C9A877',chest:'#FFFFFF',muz:'#FFFFFF',nose:'#2A1E1A',iris:'#2E1C14',tail:'plume'},
 bichon:{t:'raster',coat:'curly',ear:'curly',c:'#FAF8F4',ec:'#F2EEE8',chest:'#FFFFFF',muz:'#FFFFFF',nose:'#1E1614',iris:'#2E1C14',tail:'pom'},
 shiba:{t:'raster',coat:'short',ear:'prick',c:'#C9662E',ec:'#B85A28',chest:'#FBF3E6',muz:'#FBF3E6',nose:'#2B2220',iris:'#4A2A18',tail:'curl'},
 corgi:{t:'raster',coat:'short',ear:'prick',c:'#D9783A',ec:'#C96A30',chest:'#FFF8EE',muz:'#FFF8EE',nose:'#2B2220',iris:'#4A2A18',tail:'wag'},
 frenchie:{t:'raster',coat:'short',ear:'prick',c:'#D6B48A',ec:'#C9A27A',chest:'#E6CCA8',muz:'#4A3A32',nose:'#1E1614',iris:'#3A2418',tail:'wag'},
 retriever:{t:'raster',coat:'long',ear:'flop',c:'#E2B26A',ec:'#D6A258',chest:'#F2D29A',muz:'#F2D29A',nose:'#2B1C16',iris:'#4A2A18',tail:'plume'},
 husky:{t:'raster',coat:'fluffy',ear:'prick',c:'#8A9098',ec:'#6E747C',chest:'#FAFAF8',muz:'#FAFAF8',nose:'#1E1A18',iris:'#6EA8DC',tail:'plume'},
 collie:{t:'raster',coat:'long',ear:'small',c:'#2A2624',ec:'#1E1A18',chest:'#FAFAF8',muz:'#FAFAF8',nose:'#1E1A18',iris:'#5A3A22',tail:'plume'},
 greyhound:{t:'raster',coat:'short',ear:'flop',c:'#8E9298',ec:'#7A7E84',chest:'#A6AAB0',muz:'#A6AAB0',nose:'#2A2A2C',iris:'#4A3A2A',tail:'wag'},
 shepherd:{t:'raster',coat:'short',ear:'prick',c:'#B07A3E',ec:'#2A2220',chest:'#C9944E',muz:'#2A2220',nose:'#1E1614',iris:'#5A3A22',tail:'plume'},
 kshort:{t:'cat',c:'#E9A458',stripe:'#B8702E',chest:'#FBECD8',muz:'#FCF0E0',nose:'#E28A8A',iris:'#B7A23A',ear:'cat'},
 russian:{t:'cat',c:'#8D9AA8',chest:'#9CA8B4',muz:'#A9B4BF',nose:'#6C7884',iris:'#62A85C',ear:'cat',sheen:1},
 fold:{t:'cat',c:'#E3D3BA',stripe:'#C6AF8C',chest:'#F8EFE0',muz:'#FBF4E8',nose:'#E6A2A0',iris:'#D0892C',ear:'fold',round:1},
 golden:{t:'hamster',c:'#E3A563',belly:'#FBF1E2',ear:'#F2B4AE'},
 dwarf:{t:'hamster',c:'#B9B3AB',belly:'#FBF8F3',ear:'#E9C2C0',stripe:'#5E5852'},
 guinea:{t:'guinea',c:'#B9773F',belly:'#FFF6EA',dark:'#3E2C22'},
 fmouse:{t:'mouse',c:'#F4F1EB',ear:'#F4B1BC',iris:'#C2283A',tail:'#F2B7C0'},
 rabbit:{t:'rabbit',c:'#F3EFE9',ear:'#F0B6BE',iris:'#3A2A22'},
 hedgehog:{t:'hedgehog',c:'#F2E6D2',spine:'#7E6A55'},
 ferret:{t:'ferret',c:'#EADBBE',dark:'#5E4A38'},
 fennec:{t:'fennec',c:'#ECCB9C',inner:'#FFF5E6'},
 loris:{t:'loris',c:'#C29A72',dark:'#5C4128'},
 raccoon:{t:'raccoon',c:'#8F8B85',dark:'#2E2B28',light:'#EEEAE4'},
 meerkat:{t:'meerkat',c:'#D5B688',dark:'#4E3D2A'},
 budgie:{t:'bird',c:'#79C94A',belly:'#A8DC5C',face:'#F7E36A',bars:'#2E2A20',cheek:'#4A5FC8',beak:'#C9B79E',cere:'#5A7FD8',tail:'#2E4E9E',wing:'#5CA43A',scallop:1,hook:1},
 lovebird:{t:'bird',c:'#78C552',belly:'#9FD86C',face:'#F48A5C',cap:'#E5503A',ring:'#FFFFFF',beak:'#E2503E',tail:'#3E7AC8',wing:'#4E9C37',hook:1},
 cockatiel:{t:'bird',c:'#B9B4AA',belly:'#CBC6BC',face:'#F7E36A',cheek:'#F0883A',crest:'#F2DC5A',beak:'#8C8478',wingbar:'#F6F4EE',tail:'#8E887E',wing:'#A39E94',hook:1,ltail:1},
 java:{t:'bird',c:'#8F98A3',belly:'#DCC7C8',cap:'#1E1E22',face:'#FFFFFF',beak:'#EA5560',ring:'#EA5560',tail:'#1E1E22',wing:'#808893',cone:1,small:1},
 canary:{t:'bird',c:'#F6D13A',belly:'#FAE37E',beak:'#E8B48E',wing:'#E8BB20',tail:'#E3B21C',cone:1,small:1},
 grey:{t:'bird',c:'#9CA2A8',belly:'#B1B6BB',face:'#E7E9EB',beak:'#1E1E20',iris:'#F2E8B0',tail:'#D9342B',wing:'#8A9097',scallop:1,hook:2,big:1},
 macaw:{t:'bird',c:'#D9342B',belly:'#D63A2E',face:'#F7F2EC',beak:'#EEE6D6',jaw:'#1E1E20',iris:'#F2E8B0',tail:'#D9342B',wing:'#F2C230',wing2:'#2F6BD1',hook:2,big:1,ltail:2},
 chick:{t:'chick',c:'#F8D84C',beak:'#F2A33A',leg:'#F29A2E'},
 duck:{t:'chick',c:'#F5D560',beak:'#F29A2E',leg:'#F29A2E',bill:1},
 quail:{t:'chick',c:'#9E7C56',beak:'#4A3A2A',leg:'#D8A27A',quail:1,dark:'#5E4630',light:'#EBD9B2'},
 goldfish:{t:'fish',kind:'gold',c:'#F06A26',c2:'#F8B04A',belly:'#FCE6B8',fin:'#F6A04A'},
 betta:{t:'fish',kind:'betta',k:.8,c:'#3552C8',c2:'#C22F4E',belly:'#5C7BE0',fin:'#C2334A'},
 guppy:{t:'fish',kind:'guppy',k:1.2,c:'#B9C4C8',c2:'#F29A2E',belly:'#E8EEF0',fin:'#F29A2E'},
 axolotl:{t:'axo',c:'#F5B9C5',gill:'#E2607E'},
 slider:{t:'turtle',c:'#5E8A3A',skin:'#6E8E3E',line:'#E9D85A',ear:'#D9402E'},
 star:{t:'tortoise',c:'#2E2820',ray:'#EBC64E',skin:'#B7924E'},
 leo:{t:'gecko',c:'#F2D25C',spot:'#3A2E22',belly:'#FBF0D2',band:'#F6EEDC',kind:'leo'},
 crested:{t:'gecko',c:'#C98A4B',spot:'#8A5428',belly:'#E9B577',band:'#D99A5A',kind:'crested'},
 python:{t:'snake',c:'#5E4228',spot:'#C9A26A',belly:'#E9DCC2'},
 beetle:{t:'bug',kind:'beetle',c:'#5A2E18',c2:'#3A1C0E'},
 stag:{t:'bug',kind:'stag',c:'#2A211B',c2:'#14100D'},
 hermit:{t:'crab',c:'#D9583B',shell:'#E8D3AE',claw:'#9A3A5A'},
 cricket:{t:'cricket',c:'#3E2C1F',spot:'#E2B85A'},
};
const DRAW={};
/* shorthand for the template files (classic scripts share one global scope, so names are prefixed) */
const pF=Pt.fill,pB=Pt.blob,pT=Pt.taper,pA=Pt.anim,pS=Pt.strokes,pD=Pt.dots,pE=Pt.ell,pN=Pt.n,pDk=Pt.dk,pLt=Pt.lt;
let TH=0; // 0 healthy … 1 skin and bone
const thin=k=>k*(1-.42*TH);

/* face: eyes, brows, blush, mouth for the template's geometry */
function pFace(f){
  let s='';const m=f.m;
  f.eyes.forEach((e,i)=>{s+=Pt.eye(e[0],e[1],f.r,m,{iris:f.iris,pupil:f.pupil,lid:f.lid,side:i?1:-1,cloudy:f.cloudy||(S&&S.flags&&S.flags.cloudy),delay:f.delay||0,white:f.white,blink:f.blink})});
  if(TH>.4&&m!=='dead') f.eyes.forEach(e=>{s=`<ellipse cx="${pN(e[0])}" cy="${pN(e[1])}" rx="${pN(f.r*1.6)}" ry="${pN(f.r*1.5)}" fill="#3A2418" opacity="${.25*TH}"/>`+s});
  if(f.brow!==false) s+=f.eyes.length>1?Pt.brows(m,f.eyes[0][0],f.eyes[1][0],f.eyes[0][1]-f.r*(f.browUp||1.9),f.r,f.browC):Pt.brows(m,null,f.eyes[0][0],f.eyes[0][1]-f.r*(f.browUp||1.9),f.r,f.browC);
  if((m==='happy'||m==='hungry'||f.blushAlways)&&f.cheeks) f.cheeks.forEach(c=>s+=Pt.blush(c[0],c[1],f.br||f.r*1.2));
  if(f.mouth) s+=Pt.mouth(f.mouth[0],f.mouth[1],f.ms||1,m,f.kind,{pant:f.pant});
  return s;
}
/* ribs and hip bones for a starving body; drawn over the torso */
function pRibs(a,k){
  if(k<.25||!a.body) return '';
  const [x,y]=a.body, w=a.bw||14, h=a.bh||14, op=Math.min(.75,(k-.2)*1.1);
  let d='';
  if(a.side){for(let i=0;i<5;i++){const xx=x-w*.45+i*w*.2;d+=`M${pN(xx)} ${pN(y-h*.55)}q${pN(-w*.12)} ${pN(h*.55)} 0 ${pN(h*1.05)}`}}
  else for(let i=0;i<4;i++){const yy=y-h*.45+i*h*.26, ww=w*(.85-i*.06);d+=`M${pN(x-ww*.15)} ${pN(yy)}q${pN(-ww*.5)} ${pN(h*.05)} ${pN(-ww*.82)} ${pN(h*.22)}M${pN(x+ww*.15)} ${pN(yy)}q${pN(ww*.5)} ${pN(h*.05)} ${pN(ww*.82)} ${pN(h*.22)}`}
  return `<path d="${d}" stroke="#4A3022" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="${pN(op)}"/><path d="${d}" stroke="#FFF5E6" stroke-width=".7" fill="none" stroke-linecap="round" opacity="${pN(op*.6)}" transform="translate(-.6 -.6)"/>`;
}
const DULL=c=>Pt.grey(Pt.mix(c,'#9A8A78',.2),.55);

/* creature(mood, opts) → svg string, anchors in CREA. opts: {thin, dull, gag, flat} */
let CREA={};
function creature(m,o){
  o=o||{};
  const sp=S.sp, base=LOOK[sp.id]||LOOK.mix;
  let L=base;
  if(o.dry){L={};for(const k in base)L[k]=typeof base[k]==='string'&&base[k][0]==='#'?Pt.mix(Pt.grey(base[k],.85),'#6E5A40',.5):base[k]}
  else if(o.char){L={};for(const k in base)L[k]=typeof base[k]==='string'&&base[k][0]==='#'?Pt.mix(Pt.grey(base[k],.8),'#1A1512',.78):base[k]}
  else if(o.dull||o.thin>.5){L={};for(const k in base)L[k]=typeof base[k]==='string'&&base[k][0]==='#'?DULL(base[k]):base[k]}
  TH=o.thin||0;
  const r=(DRAW[L.t]||DRAW.dog)(L,m,o,sp);
  TH=0;
  if(L.t==='raster'&&!RASTER[sp.id]) L=Object.assign({},L,{t:'dog'});
  if(L.k){const k=L.k,sa=v=>Array.isArray(v)?(Array.isArray(v[0])?v.map(sa):v.map(x=>x*k)):typeof v==='number'?v*k:v;const a={};for(const key in r.a)a[key]=key==='side'?r.a[key]:sa(r.a[key]);r.a=a;r.s=`<g transform="scale(${k})">${r.s}</g>`}
  CREA=r.a;
  return r.s+(r.a.raster?'':pRibs(r.a,o.thin||0));
}
