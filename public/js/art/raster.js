/* hand-marked anchors for the painted dogs: m = [left eye, right eye, nose] as fractions of the image; H = sitting height */
const RASTER={"mix":{"H":74,"sit":{"w":405,"h":420,"m":[[0.14,0.105],[0.3,0.105],[0.185,0.21]]},
 "puppy":{"w":378,"h":420,"m":[[0.18,0.204],[0.4,0.21],[0.26,0.318]]},
 "tired":{"w":778,"h":300,"m":[[0.75,0.6],[0.86,0.57],[0.88,0.78]]},
 "lie":{"w":761,"h":300}},
 "maltese":{"H":60,"sit":{"w":399,"h":420,"m":[[0.2,0.24],[0.37,0.24],[0.28,0.29]]},
 "puppy":{"w":363,"h":420,"m":[[0.5,0.324],[0.76,0.288],[0.68,0.384]]},
 "tired":{"w":714,"h":300,"m":[[0.22,0.7],[0.35,0.72],[0.25,0.86]]},
 "lie":{"w":724,"h":300}},
 "poodle":{"H":62,"sit":{"w":286,"h":420,"m":[[0.5,0.23],[0.73,0.23],[0.63,0.29]]},
 "puppy":{"w":338,"h":420,"m":[[0.49,0.33],[0.75,0.288],[0.65,0.414]]},
 "tired":{"w":723,"h":300,"m":[[0.22,0.66],[0.35,0.66],[0.26,0.82]]},
 "lie":{"w":760,"h":300}},
 "pome":{"H":56,"sit":{"w":468,"h":420,"m":[[0.26,0.255],[0.35,0.255],[0.31,0.32]]},
 "puppy":{"w":352,"h":420,"m":[[0.49,0.378],[0.73,0.324],[0.63,0.42]]},
 "tired":{"w":643,"h":300,"m":[[0.15,0.74],[0.26,0.72],[0.17,0.83]]},
 "lie":{"w":437,"h":300}},
 "jindo":{"H":80,"sit":{"w":328,"h":420,"m":[[0.66,0.22],[0.82,0.22],[0.76,0.28]]},
 "puppy":{"w":402,"h":420,"m":[[0.66,0.24],[0.87,0.21],[0.83,0.312]]},
 "tired":{"w":790,"h":300,"m":[[0.7,0.64],[0.82,0.64],[0.78,0.85]]},
 "lie":{"w":726,"h":300}},
 "shihtzu":{"H":60,"sit":{"w":407,"h":420,"m":[[0.63,0.27],[0.82,0.265],[0.73,0.31]]},
 "puppy":{"w":361,"h":420,"m":[[0.55,0.336],[0.79,0.306],[0.69,0.378]]},
 "tired":{"w":709,"h":300,"m":[[0.21,0.72],[0.36,0.7],[0.27,0.82]]},
 "lie":{"w":905,"h":300}},
 "bichon":{"H":60,"sit":{"w":378,"h":420,"m":[[0.23,0.25],[0.38,0.25],[0.3,0.31]]},
 "puppy":{"w":391,"h":420,"m":[[0.58,0.276],[0.73,0.27],[0.73,0.336]]},
 "tired":{"w":728,"h":300,"m":[[0.12,0.68],[0.26,0.68],[0.17,0.8]]},
 "lie":{"w":685,"h":300}},
 "shiba":{"H":72,"sit":{"w":367,"h":420,"m":[[0.71,0.245],[0.86,0.245],[0.82,0.315]]},
 "puppy":{"w":349,"h":420,"m":[[0.59,0.276],[0.79,0.246],[0.73,0.348]]},
 "tired":{"w":792,"h":300,"m":[[0.72,0.6],[0.8,0.6],[0.78,0.84]]},
 "lie":{"w":598,"h":300}},
 "corgi":{"H":64,"sit":{"w":346,"h":420,"m":[[0.6,0.315],[0.78,0.315],[0.7,0.4]]},
 "puppy":{"w":307,"h":420,"m":[[0.5,0.378],[0.76,0.348],[0.69,0.444]]},
 "tired":{"w":778,"h":300,"m":[[0.71,0.6],[0.82,0.63],[0.85,0.82]]},
 "lie":{"w":700,"h":300}},
 "frenchie":{"H":64,"sit":{"w":263,"h":420,"m":[[0.45,0.28],[0.82,0.28],[0.65,0.35]]},
 "puppy":{"w":283,"h":420,"m":[[0.46,0.42],[0.85,0.36],[0.69,0.45]]},
 "tired":{"w":623,"h":300,"m":[[0.66,0.62],[0.85,0.64],[0.76,0.76]]},
 "lie":{"w":700,"h":300}},
 "retriever":{"H":90,"sit":{"w":298,"h":420,"m":[[0.66,0.165],[0.82,0.165],[0.76,0.23]]},
 "puppy":{"w":306,"h":420,"m":[[0.53,0.204],[0.76,0.192],[0.67,0.294]]},
 "tired":{"w":864,"h":300,"m":[[0.15,0.64],[0.26,0.6],[0.13,0.78]]},
 "lie":{"w":876,"h":300}},
 "husky":{"H":86,"sit":{"w":280,"h":420,"m":[[0.7,0.26],[0.86,0.26],[0.78,0.32]]},
 "puppy":{"w":327,"h":420,"m":[[0.55,0.3],[0.76,0.276],[0.68,0.36]]},
 "tired":{"w":745,"h":300,"m":[[0.14,0.67],[0.3,0.66],[0.16,0.87]]},
 "lie":{"w":710,"h":300}},
 "collie":{"H":82,"sit":{"w":349,"h":420,"m":[[0.22,0.17],[0.4,0.17],[0.3,0.25]]},
 "puppy":{"w":354,"h":420,"m":[[0.55,0.234],[0.76,0.216],[0.68,0.3]]},
 "tired":{"w":788,"h":300,"m":[[0.7,0.7],[0.84,0.68],[0.81,0.88]]},
 "lie":{"w":827,"h":300}},
 "greyhound":{"H":92,"sit":{"w":219,"h":420,"m":[[0.73,0.12],[0.83,0.12],[0.78,0.17]]},
 "puppy":{"w":276,"h":420,"m":[[0.56,0.144],[0.73,0.144],[0.66,0.216]]},
 "tired":{"w":832,"h":300,"m":[[0.2,0.69],[0.31,0.66],[0.2,0.86]]},
 "lie":{"w":696,"h":300}},
 "shepherd":{"H":94,"sit":{"w":187,"h":420,"m":[[0.57,0.26],[0.78,0.26],[0.68,0.325]]},
 "puppy":{"w":345,"h":420,"m":[[0.58,0.228],[0.78,0.228],[0.72,0.312]]},
 "tired":{"w":762,"h":300,"m":[[0.73,0.71],[0.86,0.7],[0.78,0.89]]},
 "lie":{"w":784,"h":300}}};

/* ---------- painted sprites (Gemini sheets cut by tools/import_art.py) ----------
   Poses: sit (adult), puppy (young), tired (thin or ill, eyes open), lie (dead or peaceful, eyes closed).
   The picture never changes expression; moods and injuries come from the gag layer on top,
   and colour filters stand in for soot, cold, sickness and death. */
let IMG_BASE='img/pets/';
const rasterOf=id=>RASTER[id]||null;
function rasterPose(m,o){
  if(o.pose) return o.pose;
  if(m==='dead'||m==='peace') return 'lie';
  if((o.thin||0)>.15||m==='sick') return 'tired';
  if(S&&S.ageM<S.sp.life*.14) return 'puppy';
  return 'sit';
}
function rasterFilters(){
  Pt.def('f-dull','<filter id="f-dull"><feColorMatrix type="saturate" values=".3"/><feComponentTransfer><feFuncR type="linear" slope=".82"/><feFuncG type="linear" slope=".8"/><feFuncB type="linear" slope=".78"/></feComponentTransfer></filter>');
  Pt.def('f-char','<filter id="f-char"><feColorMatrix values=".12 .1 .05 0 .03  .1 .09 .05 0 .02  .08 .07 .05 0 .02  0 0 0 1 0"/></filter>');
  Pt.def('f-dry','<filter id="f-dry"><feColorMatrix values=".3 .4 .1 0 .06  .26 .36 .1 0 .03  .18 .26 .08 0 0  0 0 0 1 0"/></filter>');
  Pt.def('f-sick','<filter id="f-sick"><feColorMatrix values=".9 .06 0 0 0  .04 .96 .02 0 .015  0 .04 .86 0 0  0 0 0 1 0"/><feColorMatrix type="saturate" values=".75"/></filter>');
  Pt.def('f-hot','<filter id="f-hot"><feColorMatrix values="1 .1 0 0 .08  0 .85 0 0 0  0 0 .8 0 0  0 0 0 1 0"/></filter>');
  Pt.def('f-cold','<filter id="f-cold"><feColorMatrix values=".7 .1 .1 0 0  .1 .8 .1 0 .02  .15 .15 .9 0 .1  0 0 0 1 0"/></filter>');
  Pt.def('f-wet','<filter id="f-wet"><feColorMatrix type="saturate" values="1.15"/><feComponentTransfer><feFuncR type="linear" slope=".82"/><feFuncG type="linear" slope=".84"/><feFuncB type="linear" slope=".9"/></feComponentTransfer></filter>');
}
DRAW.raster=(L,m,o,sp)=>{
  const R=rasterOf(sp.id);
  if(!R) return DRAW.dog(L,m,o,sp);
  rasterFilters();
  let pose=rasterPose(m,o); if(!R[pose]) pose=pose==='puppy'?'sit':'lie';
  const P=R[pose], lying=pose==='lie'||pose==='tired';
  const Hl=lying?R.H*1.3*P.h/P.w:pose==='puppy'?R.H*.72:R.H, Wl=Hl*P.w/P.h;
  const x0=-Wl/2, y0=34-Hl;
  const thinK=o.thin||0;
  let f=o.char?'f-char':o.dry?'f-dry':(o.dull||thinK>.5)?'f-dull':
    o.gag==='soot'?'f-char':o.gag==='cold'?'f-cold':o.gag==='hot'||o.gag==='angry'||m==='angry'?'f-hot':o.gag==='queasy'||o.gag==='fever'||m==='sick'?'f-sick':o.gag==='wet'?'f-wet':'';
  const squash=lying&&thinK>.3?1-.14*thinK:1;
  let s=`<g transform="translate(0 34) scale(1 ${pN(squash)}) translate(0 -34)"><image href="${IMG_BASE}${sp.id}-${pose}.webp" x="${pN(x0)}" y="${pN(y0)}" width="${pN(Wl)}" height="${pN(Hl)}"${f?` filter="url(#${f})"`:''}/></g>`;
  const mk=P.m||[[.4,.3],[.6,.3],[.5,.42]];
  const pt=q=>[x0+q[0]*Wl,y0+q[1]*Hl*squash+(34-y0)*(1-squash)];
  const e1=pt(mk[0]),e2=pt(mk[1]),no=pt(mk[2]);
  const ed=Math.max(3,Math.hypot(e2[0]-e1[0],e2[1]-e1[1]));
  const hx=(e1[0]+e2[0])/2, hy=((e1[1]+e2[1])/2+no[1])/2-ed*.15, hr=ed*1.35;
  const er=ed*.17;
  /* cartoon X eyes when a painted dog dies upright (electrocution, freezing) */
  if(m==='dead'&&!lying) s+=[e1,e2].map(e=>`<path d="M${pN(e[0]-er*1.4)} ${pN(e[1]-er*1.4)}l${pN(er*2.8)} ${pN(er*2.8)}M${pN(e[0]+er*1.4)} ${pN(e[1]-er*1.4)}l${pN(-er*2.8)} ${pN(er*2.8)}" stroke="#1E1410" stroke-width="${pN(er*.9)}" stroke-linecap="round"/>`).join('');
  const a={raster:1,head:[hx,hy],hr,eyes:[e1,e2],er,nose:no,mouth:[no[0],no[1]+ed*.35],top:Math.min(e1[1],e2[1])-ed*1.15,
    leg:lying?[no[0]+(no[0]<0?ed:-ed),34-Hl*.12]:[hx-ed*.35,34-Hl*.14],body:lying?[0,34-Hl*.45]:[hx*.4,34-Hl*.33],
    bw:lying?Wl*.3:Wl*.28,bh:lying?Hl*.3:Hl*.24,feet:34,ear:[hx-hr*.75,hy-hr*.65]};
  return {s,a};
};
/* start fetching the current animal's pictures so pose changes do not flash */
function preloadArt(id){if(!rasterOf(id)||typeof Image==='undefined')return;['sit','puppy','tired','lie'].forEach(p=>{if(RASTER[id][p]){const i=new Image();i.src=IMG_BASE+id+'-'+p+'.webp'}})}
