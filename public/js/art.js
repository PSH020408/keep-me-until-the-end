/* ---------- picture-book stage ----------
   Backgrounds, the living creature with its idle animation and cartoon gags, and the ending scene.
   The creature itself is drawn by js/art/*.js (painterly templates per body type). */
/* backgrounds */
function scene(env){
  const winter=[11,0,1].includes(Math.floor(S.month)%12);
  const snow=winter&&['river','lake','park','mountain','sky','street','yard'].includes(env)?Array.from({length:14},(_,i)=>`<circle cx="${(i*37)%260}" cy="${(i*53)%150}" r="${1.5+(i%3)}" fill="#fff" opacity=".85"/>`).join(''):'';
  switch(env){
  case 'tank':{
    const t=S.tank, murky=S.health<55;
    let s=`<rect width="260" height="200" fill="#EDE3D2"/><rect y="168" width="260" height="32" fill="#B08A5E"/><rect x="34" y="40" width="192" height="130" rx="6" fill="${murky?'#A9B98A':'#9FD3E6'}" stroke="${O}" stroke-width="3"/><path d="M38 160Q80 150 130 160T222 158L222 166L38 166Z" fill="#C9B38A"/>`;
    s+=`<path d="M60 160Q54 120 66 96M66 160Q76 130 70 110" stroke="#4E9C37" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if(t){
      if(t.filter==='걸이식 여과기') s+=`<rect x="190" y="30" width="26" height="30" rx="3" fill="#3A3F44" ${st}/><path d="M194 60q-4 14 2 26" stroke="#E8F6FB" stroke-width="5" fill="none"/>`;
      if(t.filter==='스펀지 여과기') s+=`<rect x="194" y="128" width="18" height="30" rx="4" fill="#3B3B3B" ${st}/>`+[0,1,2].map(i=>`<circle cx="203" cy="${118-i*24}" r="4" fill="none" stroke="#fff" stroke-width="1.6" class="rise" style="animation-delay:${i*.8}s"/>`).join('');
      if(t.filter==='외부 여과기') s+=`<path d="M210 40L210 100M220 40L220 150" stroke="#5F6A72" stroke-width="4"/><rect x="232" y="140" width="22" height="30" rx="3" fill="#2E3438" ${st}/>`;
      if(t.lid) s+=`<rect x="30" y="34" width="200" height="8" rx="2" fill="#3A3F44" ${st}/>`;
      const others=Math.min(Math.max(0,t.crowd-1),7);
      for(let i=0;i<others;i++){const x=60+((i*47)%140),y=70+((i*29)%70);s+=`<g transform="translate(${x} ${y}) scale(.32)"><path d="M-26 0L-44 -14L-44 14Z" fill="${S.sp.c2}" ${st}/><ellipse rx="28" ry="16" fill="${S.sp.c1}" ${st}/><circle cx="14" cy="-3" r="4" fill="${O}"/></g>`}
    }
    return s;}
  case 'box': return `<rect width="260" height="200" fill="#EFE5D3"/><rect y="170" width="260" height="30" fill="#B08A5E"/><rect x="40" y="60" width="180" height="114" rx="6" fill="#F7FBFD" fill-opacity=".55" stroke="${O}" stroke-width="3"/><path d="M42 150Q100 140 180 150L218 148L218 172L42 172Z" fill="${S.sp.g==='crab'?'#E6D3A3':S.sp.g==='chick'?'#D9C3A0':'#7B5A3A'}"/><rect x="36" y="54" width="188" height="10" rx="3" fill="#6B8E9E" ${st}/>`;
  case 'yard': return `<rect width="260" height="200" fill="#CFE6F2"/><rect y="140" width="260" height="60" fill="#9CC56B"/><path d="M190 140L190 96L215 76L240 96L240 140Z" fill="#B5733F" ${st}/><rect x="205" y="112" width="20" height="28" rx="10" fill="#3A2A1C"/><rect x="60" y="100" width="6" height="48" fill="#6E5236" stroke="${O}" stroke-width="2"/>${snow}`;
  case 'river': case 'lake':{
    const winter2=[11,0,1].includes(Math.floor(S.month)%12);
    return `<rect width="260" height="200" fill="${env==='lake'?'#D6EAF4':'#CDE3EC'}"/><path d="M0 64Q60 54 130 64T260 62L260 200L0 200Z" fill="${winter2?'#8DB4C8':'#6FA3C2'}"/><path d="M0 64Q60 54 130 64T260 62" stroke="#E8F4FA" stroke-width="3" fill="none"/>${winter2?'<path d="M0 60L260 60L260 70L0 70Z" fill="#E9F4F9" opacity=".9"/>':''}<path d="M18 200Q14 130 26 70M30 200Q34 140 24 90M236 200Q232 130 244 76" stroke="#4E7A3A" stroke-width="4" fill="none"/><ellipse cx="200" cy="186" rx="34" ry="12" fill="#6E6A62" ${st}/><ellipse cx="70" cy="190" rx="22" ry="9" fill="#7E796F" ${st}/>${snow}`;}
  case 'park': return `<rect width="260" height="200" fill="#D8ECF4"/><rect y="138" width="260" height="62" fill="${[11,0,1].includes(Math.floor(S.month)%12)?'#EEF3F2':'#A8CC74'}"/><rect x="200" y="70" width="10" height="72" fill="#6E5236"/><circle cx="205" cy="62" r="30" fill="#5E9A44" ${st}/><rect x="20" y="126" width="70" height="8" fill="#A0703F" ${st}/><path d="M26 134l0 14M84 134l0 14" stroke="${O}" stroke-width="3"/>${snow}`;
  case 'mountain': return `<rect width="260" height="200" fill="#26304A"/><circle cx="210" cy="38" r="16" fill="#F2EBC8"/><path d="M0 150L40 70L80 150ZM60 150L110 50L160 150ZM150 150L200 80L250 150Z" fill="#1E3A2E" ${st}/><rect y="150" width="260" height="50" fill="#2E4A34"/>${snow}`;
  case 'sky': return `<rect width="260" height="200" fill="#BFE0F2"/><ellipse cx="60" cy="40" rx="30" ry="12" fill="#fff"/><ellipse cx="190" cy="60" rx="38" ry="14" fill="#fff"/><path d="M0 200L0 150L30 150L30 120L60 120L60 160L90 160L90 130L130 130L130 170L170 170L170 110L210 110L210 150L260 150L260 200Z" fill="#7C8796" ${st}/>${snow}`;
  case 'street': return `<rect width="260" height="200" fill="#2E3442"/><rect y="140" width="260" height="60" fill="#4A4F57"/><path d="M0 170L260 170" stroke="#E8D46A" stroke-width="4" stroke-dasharray="18 14"/><rect y="132" width="260" height="10" fill="#8B8F96"/><rect x="214" y="40" width="5" height="94" fill="#5F646C"/><circle cx="216" cy="40" r="8" fill="#F2D88A"/>${snow}`;
  case 'shelter': return `<rect width="260" height="200" fill="#C9CCCF"/><rect y="160" width="260" height="40" fill="#9EA3A8"/><rect x="190" y="20" width="56" height="30" fill="#fff" stroke="${O}" stroke-width="2"/><text x="218" y="40" text-anchor="middle" font-size="10" font-family="IBM Plex Mono,monospace" fill="${O}">공고 D-${Math.max(0,10-((S.tick*3)%11))}</text>`;
  case 'cafe': return `<rect width="260" height="200" fill="#F6D9E1"/><rect y="160" width="260" height="40" fill="#D9A9B6"/>${[[40,40],[220,30],[200,90]].map(p=>`<path d="M${p[0]} ${p[1]}l4 10l10 4l-10 4l-4 10l-4 -10l-10 -4l10 -4z" fill="#fff" class="blink"/>`).join('')}`;
  case 'facility': return `<rect width="260" height="200" fill="#D7D9D6"/><rect y="160" width="260" height="40" fill="#A8AEA6"/><rect x="14" y="14" width="232" height="150" fill="none" stroke="#7D8A90" stroke-width="5"/><rect x="20" y="20" width="70" height="16" fill="#fff" stroke="${O}" stroke-width="1.5"/><text x="55" y="32" text-anchor="middle" font-size="9" font-family="IBM Plex Mono,monospace" fill="${O}">압수 개체</text>`;
  case 'suitcase': return `<rect width="260" height="200" fill="#5A3E28"/><rect x="10" y="10" width="240" height="180" rx="10" fill="#6E4C30" stroke="#3A2616" stroke-width="4"/><path d="M10 100L250 100" stroke="#C9A24A" stroke-width="3" stroke-dasharray="4 3"/>`;
  default: return `<rect width="260" height="200" fill="#F3E7D3"/><rect y="160" width="260" height="40" fill="#D2AE82"/><rect x="180" y="24" width="56" height="50" fill="#CFE6F2" stroke="${O}" stroke-width="3"/><path d="M208 24L208 74M180 49L236 49" stroke="${O}" stroke-width="2"/><rect x="18" y="128" width="40" height="34" rx="3" fill="#A97C50" ${st}/>`;
  }
}

function petScale(){
  const g=Math.min(1,S.ageM/(S.sp.life*.22));
  return clamp((.6+.4*g)*S.size*(tm('glutton')?1.08:1)*1.25,.55,2.1);
}
function moodOf(){
  if(S.done) return S.calm?'peace':'dead';
  if(S.health<30) return 'sick';
  if(S.scaredT>0) return 'scared';
  if(S.happyT>0) return 'happy';
  if(S.health<55) return 'hungry';
  if(!S.wild&&S.interest<.3) return 'sad';
  return 'normal';
}
function chips(){
  const c=[];const m=moodOf();
  if(S.done) return c;
  if(S.happyT>0) c.push(['행복','good']);
  if(S.health<55) c.push(['배고픔','bad']);
  if(S.health<30||S.flags.untreated) c.push(['아픔','bad']);
  if(!S.wild&&S.interest<.3&&!S.noPledge) c.push(['외로움','bad']);
  if(S.scaredT>0) c.push(['겁먹음','bad']);
  if(S.wild&&[11,0,1].includes(Math.floor(S.month)%12)) c.push(['추위','bad']);
  if(S.size>1.15) c.push(['몸이 커짐','']);
  else if(S.ageM<S.sp.life*.22) c.push(['자라는 중','']);
  if(S.tank&&!S.wild&&S.tank.crowd>5) c.push(['과밀','bad']);
  if(S.gag&&GAG_LABEL[S.gag.k]) c.unshift([GAG_LABEL[S.gag.k],'bad']);
  if(S.flags.cloudy) c.push(['백내장','bad']);
  if(!c.length) c.push([m==='normal'?'평온':'','']);
  return c.filter(x=>x[0]);
}

const GAG_LABEL={bump:'혹 났음',cast:'깁스',band:'반창고',soot:'그을림',cold:'꽁꽁',hot:'헉헉',wet:'홀딱 젖음',itch:'가려움',queasy:'속이 안 좋음',cone:'넥카라',fever:'열남',angry:'뿔남',stuffed:'배 터질 듯'};
let stageKey='';
/* Chromium leaves SMIL frozen in an <svg> that replaces another through innerHTML until its clock is touched;
   nudging the clock a moment later starts the swimmers (this is why a new scene sat still at high speed) */
function kickSmil(el){if(typeof setTimeout!=='function'||!el||!el.querySelector)return;
  setTimeout(()=>{const s=el.querySelector(':scope > svg');if(s&&typeof s.setCurrentTime==='function')try{s.setCurrentTime(s.getCurrentTime()+.001)}catch(e){}},40)}
function drawStage(force){
  if(typeof skipping!=='undefined'&&skipping&&!force) return;
  if(S.f&&typeof fishStageSvg==='function'){
    const f=S.f,k=['F',S.env,S.done,S.fx,S.wild,f.tank,S.preOwner,fishPose(),f.mates.map(m=>m.id+m.n).join(),Math.round(f.wq/12),Math.round(f.len),f.ill&&f.ill.id,Math.round(f.fin*4),season(),f.lid,f.filter,f.heater,f.hides,f.algae,f.stunt>.6,Math.round(S.health/25)].join('|');
    if(k===stageKey&&!force) return; stageKey=k;
    /* a new place (shop, tank, river, the end) fades in over the old one instead of cutting */
    const st=$('stage'),major=[S.env,S.done,S.wild,f.tank,S.preOwner].join('|'),old=st.dataset&&st.dataset.major&&st.dataset.major!==major&&!skipping?st.querySelector&&st.querySelector(':scope > svg'):null;
    const prev=old&&typeof old.outerHTML==="string"?old.outerHTML.replace(/id="([^"]+)"/g,'id="g_$1"').replace(/url\(#([^)]+)\)/g,'url(#g_$1)').replace(/href="#([^"]+)"/g,'href="#g_$1"'):'';
    st.innerHTML=fishStageSvg();if(st.dataset)st.dataset.major=major;kickSmil(st);
    if(prev){const gh=document.createElement('div');gh.className='ghost';gh.innerHTML=prev;st.appendChild(gh);setTimeout(()=>gh.remove(),650)}
    const ch=$('chips');ch.innerHTML='';
    fishChips().forEach(([tx,kk])=>{const sp=document.createElement('span');sp.className='chip '+kk;sp.textContent=tx;ch.appendChild(sp)});
    return;
  }
  const m0=moodOf(), gag=S.gag&&!S.done?S.gag.k:null, m=gag?gagMood(gag,m0):m0, sc=petScale();
  const winter=[11,0,1].includes(Math.floor(S.month)%12);
  const thinK=!S.done&&S.health<35?Math.round((35-S.health)/35*6)/10:0;
  const key=[S.ageM<S.sp.life*.14,S.env,m,gag,sc.toFixed(2),S.done,S.fx,S.tank&&JSON.stringify(S.tank),winter,S.health<55,thinK,S.flags.cloudy,S.flags.cafeLife,S.wild].join('|');
  if(key===stageKey&&!force) return; stageKey=key;
  Pt.reset();
  const env=S.env, t=(LOOK[S.sp.id]||{}).t;
  const swimmer=['fish','axo','turtle'].includes(t)||S.sp.id==='duck';
  const water=['tank','river','lake'].includes(env)&&swimmer;
  const fl=FLOOR[env]||160;
  const cx=130, cy=water?(S.sp.id==='duck'?(env==='tank'?70:58):env==='tank'?112:120):fl-34*sc;
  let body='';
  if(!S.done){
    const shiver=(S.wild&&winter)||m==='scared'||gag==='cold'?'a-shake':'';
    const creatureSvg=creature(m,{thin:thinK,gag});
    const over=gagLayer(m,{gag});
    let pet=`<g transform="translate(${cx} ${pN(cy)}) scale(${pN(sc)})"><g class="a-breathe" style="transform-origin:0px 34px">${creatureSvg}</g>${over}</g>`;
    if(shiver) pet=`<g class="${shiver}">${pet}</g>`;
    if(m==='scared') pet=`<g class="a-jolt" style="transform-origin:${cx}px ${pN(cy+34*sc)}px">${pet}</g>`;
    if(water) pet=`<g class="a-swim" style="transform-origin:${cx}px ${pN(cy)}px">${pet}</g>`+(t==='fish'||t==='axo'?[0,1].map(i=>`<circle class="a-bubble" style="animation-delay:${i*1.4}s" cx="${cx+22*sc}" cy="${pN(cy-6)}" r="${1.6+i}" fill="none" stroke="#fff" stroke-width="1"/>`).join(''):'');
    else if(t==='rabbit'||t==='chick') pet=`<g class="a-hop">${pet}</g>`;
    if(!water) body+=`<ellipse cx="${cx}" cy="${pN(fl+1)}" rx="${pN(26*sc)}" ry="${pN(3.4*sc)}" fill="#3A2A1C" opacity=".16"/>`;
    if(env==='yard'&&!S.wild) body+=`<path d="M66 104Q100 150 ${cx-10} ${pN(cy+10)}" stroke="#5F646C" stroke-width="3" fill="none" stroke-dasharray="4 3"/>`;
    body+=pet;
    if(S.flags.cafeLife) body+=`<rect width="260" height="200" fill="#fff" class="a-flash"/>`+dTxt('찰칵 찰칵',48,190,'#C4301F',18);
  } else body=deathScene(cx,cy,sc);
  let front='';
  if(env==='shelter'||(S.done&&S.fx==='cage'&&env!=='home')) front=Array.from({length:12},(_,i)=>`<rect x="${8+i*22}" y="0" width="5" height="200" fill="#5F646C" stroke="${O}" stroke-width="1"/>`).join('')+`<rect y="0" width="260" height="6" fill="#5F646C"/>`;
  if(env==='tank') front+=`<rect x="34" y="40" width="192" height="130" rx="6" fill="none" stroke="${O}" stroke-width="3"/><path d="M44 50L60 90" stroke="#fff" stroke-width="4" opacity=".5" stroke-linecap="round"/>`;
  Pt.def('paper',`<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .27  0 0 0 0 .2  0 0 0 -1.6 1.1"/></filter>`);
  Pt.def('vig',`<radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#3A2A1C" stop-opacity="0"/><stop offset="1" stop-color="#3A2A1C" stop-opacity=".22"/></radialGradient>`);
  const sceneSvg=scene(env);
  const overlay=`<rect width="260" height="200" filter="url(#paper)" opacity=".22" pointer-events="none"/><rect width="260" height="200" fill="url(#vig)" pointer-events="none"/>`;
  $('stage').innerHTML=`<svg class="stage" viewBox="0 0 260 200" role="img" aria-label="${S.disp}의 모습">${Pt.out()}${sceneSvg}${body}${front}${overlay}</svg>`;kickSmil($('stage'));
  const ch=$('chips');ch.innerHTML='';
  chips().forEach(([tx,k])=>{const s=document.createElement('span');s.className='chip '+k;s.textContent=tx;ch.appendChild(s)});
}
