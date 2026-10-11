/* ---------- cartoon gags: injuries and moods drawn over the creature ----------
   An old-cartoon layer on top of the painted animal: a bump with stars, a cast and a sulk,
   a soot-black face with blinking white eyes, a cone of shame, fleas, a personal rain cloud.
   The gag comes from the story line that was just logged (gagFrom), lasts a few ticks,
   and is drawn in the creature's own coordinates using its anchors (CREA). */
const GAGS=[
 ['cone',/중성화|개복|실밥|봉합|수술을 받|수술했|수술이 끝/],
 ['soot',/그을|화상|불꽃|연기|감전|파직|데었/],
 ['cast',/골절|다리를 다|다리 하나|절뚝|슬개골|깁스|발바닥이|발톱을 깎다|깡충깡충 걷/],
 ['bump',/부딪|쾅|떨어지|떨어졌|추락|굴러|넘어지|횃대에서 떨어/],
 ['band',/물려|물렸|싸움|상처|꼬리 끝이 잘|뿔싸움|꼬리를 갉|쪼였|다툼/],
 ['itch',/벼룩|진드기|박박 긁|피부가 벌겋|피부병|가려/],
 ['queasy',/토하|토를|토했|설사|게워|헤어볼|침을 흘|배탈|비린내/],
 ['fever',/기침|콧물|재채기|감기|열이 나|눈곱|호흡기|폐렴/],
 ['cold',/얼었|꽁꽁|추위|한겨울|히터가 고장|눈보라|덜덜|찬 바람/],
 ['hot',/폭염|땡볕|사우나|31도|헐떡|뜨거워|뜨거운|열사병|50도/],
 ['wet',/비가|빗물|목욕|젖었|젖은|흠뻑|장마|떠밀려|물에 빠/],
 ['angry',/소리를 지르|밀쳤|쫓아다|인형처럼|플래시|사진을 찍|목에 감고|약만 정확히|깨워/],
 ['stuffed',/너무 많이|한 움큼|살이 쪘|비만|실컷 먹|배불리|다 먹었/],
];
function gagFrom(text){
  if(!S||S.done||!text) return;
  for(const [k,re] of GAGS) if(re.test(text)){S.gag={k,t:k==='cone'?7:4};return}
  if(/백내장|뿌옇게/.test(text)) S.flags.cloudy=1;
}
const GAG_MOOD={bump:'dizzy',cast:'grumpy',band:'grumpy',cold:'sad',hot:'sick',wet:'grumpy',itch:'grumpy',queasy:'sick',cone:'grumpy',fever:'sick',angry:'angry',stuffed:'happy'};
const gagMood=(k,m)=>m==='dead'||m==='peace'?m:(GAG_MOOD[k]||m);

const star=(x,y,r,c)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;d+=(i?'L':'M')+pN(x+Math.cos(a)*rr)+' '+pN(y+Math.sin(a)*rr)}return `<path d="${d}Z" fill="${c||'#FFD84A'}" stroke="#8A5A10" stroke-width=".6" stroke-linejoin="round"/>`};
const orbit=(cx,cy,rx,ry,dur,items)=>items.map((it,i)=>`<g transform="translate(${pN(cx)} ${pN(cy)})"><g><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${pN(-dur*i/items.length)}s" path="M${pN(-rx)} 0a${pN(rx)} ${pN(ry)} 0 1 0 ${pN(rx*2)} 0a${pN(rx)} ${pN(ry)} 0 1 0 ${pN(-rx*2)} 0"/>${it}</g></g>`).join('');
const word=(t,x,y,c,sz,rot)=>`<text x="${pN(x)}" y="${pN(y)}" font-family="Nanum Pen Script,cursive" font-size="${sz||10}" fill="${c||'#C4301F'}" text-anchor="middle"${rot?` transform="rotate(${rot} ${pN(x)} ${pN(y)})"`:''} stroke="#FFF9EF" stroke-width="2.2" paint-order="stroke">${t}</text>`;
const drop=(x,y,s,c)=>`<path d="M${pN(x)} ${pN(y)}q${pN(-2.2*s)} ${pN(3.4*s)} 0 ${pN(4.6*s)}q${pN(2.2*s)} ${pN(-1.2*s)} 0 ${pN(-4.6*s)}Z" fill="${c||'#9FD8F4'}" stroke="#4A88A8" stroke-width=".5"/>`;
const puff=(x,y,r,c)=>`<path d="${Pt.blob(x,y,r,r*.8,{j:.12,np:9})}" fill="${c||'#F4F1EC'}" stroke="#9A9088" stroke-width=".5"/>`;

/* food the animal dreams about when hungry */
function foodIcon(g,id){
  if(g==='dog') return `<path d="M-6 -1.4h12v2.8h-12z" fill="#F4EEE2" stroke="#8A7A6A" stroke-width=".6"/><circle cx="-6.4" cy="-2" r="2" fill="#F4EEE2" stroke="#8A7A6A" stroke-width=".6"/><circle cx="-6.4" cy="2" r="2" fill="#F4EEE2" stroke="#8A7A6A" stroke-width=".6"/><circle cx="6.4" cy="-2" r="2" fill="#F4EEE2" stroke="#8A7A6A" stroke-width=".6"/><circle cx="6.4" cy="2" r="2" fill="#F4EEE2" stroke="#8A7A6A" stroke-width=".6"/>`;
  if(g==='cat') return `<path d="M-6 0Q-1 -4.6 4 0Q-1 4.6 -6 0Z" fill="#8FB4C8" stroke="#4A6A7A" stroke-width=".6"/><path d="M4 0L8 -3V3Z" fill="#8FB4C8" stroke="#4A6A7A" stroke-width=".6"/><circle cx="-3.4" cy="-.6" r=".7" fill="#1E1E1E"/>`;
  if(g==='rabbit') return `<path d="M-1.6 -3L1.6 -3L0 7Z" fill="#F28A2E" stroke="#A85A1A" stroke-width=".6"/><path d="M0 -3l-2 -4M0 -3l0 -4.6M0 -3l2 -4" stroke="#4E9C37" stroke-width="1.2" stroke-linecap="round"/>`;
  if(['bird','parrot','chick'].includes(g)) return `<path d="M-6 4Q0 -2 6 -5" stroke="#B89A4A" stroke-width=".8" fill="none"/>`+[-5,-2.6,0,2.4,4.6].map((x,i)=>`<ellipse cx="${x}" cy="${pN(3.4-i*1.9)}" rx="1.6" ry="1.1" fill="#F2D27A" stroke="#B89A4A" stroke-width=".4"/>`).join('');
  if(['fish','amphib','turtle'].includes(g)) return [[-4,-2,'#D9542E'],[0,2,'#F2B23A'],[4,-1,'#6A9A3A'],[-1,-3,'#C9302E'],[3,3,'#D9542E']].map(([x,y,c])=>`<rect x="${x-1.4}" y="${y-1.1}" width="2.8" height="2.2" fill="${c}" transform="rotate(${x*7} ${x} ${y})"/>`).join('');
  if(g==='snake') return `<ellipse cx="0" cy="0" rx="5" ry="3.4" fill="#DAD6CF" stroke="#8A847A" stroke-width=".6"/><circle cx="4.4" cy="-2.6" r="1.6" fill="#E9C2C0" stroke="#8A847A" stroke-width=".5"/><path d="M-5 0q-3 1 -4 3" stroke="#E9C2C0" stroke-width=".8" fill="none"/><circle cx="3.2" cy="-.4" r=".5" fill="#1E1E1E"/>`;
  if(['reptile','feeder'].includes(g)) return `<ellipse cx="0" cy="0" rx="5" ry="2" fill="#5A3E28"/><path d="M4 -1q4 -4 6 -3M-3 1l-3 3M0 1l0 3M3 1l2 3" stroke="#5A3E28" stroke-width=".6" fill="none"/>`;
  if(g==='insect') return `<path d="M-4 -3h8l-1 7h-6z" fill="#F4F0E8" stroke="#8A847A" stroke-width=".5"/><ellipse cx="0" cy="-2.4" rx="3.6" ry="1.2" fill="#C9302E"/>`;
  if(g==='tortoise'||id==='crested') return `<path d="M0 -5Q5 -2 4 3Q0 6 -4 3Q-5 -2 0 -5Z" fill="#E2603A" stroke="#9A3A1A" stroke-width=".6"/><path d="M0 -5q1 -2 3 -2" stroke="#4E9C37" stroke-width="1"/>`;
  if(g==='crab') return `<circle r="3.6" fill="#E8D2A0" stroke="#A88A50" stroke-width=".6"/><circle cx="-1" cy="-1" r="1" fill="#C9A85A"/>`;
  if(['rodent','hedgehog','fmouse'].includes(g)) return `<path d="M-2.4 -4Q0 -7 2.4 -4Q3 2 0 5Q-3 2 -2.4 -4Z" fill="#3A342E"/><path d="M-.8 -5V4M.8 -5V4" stroke="#E9E4DC" stroke-width=".6"/>`;
  return `<path d="M-2 4L-1 -1Q-5 -3 -3 -6Q0 -8 2 -5Q5 -5 4 -1L2 4Z" fill="#C98A5A" stroke="#7A4A2A" stroke-width=".6"/><path d="M-2 4l-1 3M2 4l1 3" stroke="#F4EEE2" stroke-width="1.6" stroke-linecap="round"/>`;
}

/* overlays for mood (no gag) and for gags, in creature space */
function gagLayer(m,o){
  o=o||{};const a=CREA;if(!a||!a.head) return '';
  const [hx,hy]=a.head, hr=a.hr, top=a.top, E=a.eyes;
  let k=o.gag;
  if(a.side&&(k==='cast'||k==='cone')) k='band';
  let s='';
  if(m==='dead'||m==='peace') return '';
  /* ----- mood marks ----- */
  if(!k){
    if(m==='happy') s+=[0,1,2].map(i=>`<g class="a-tear" style="animation-duration:2.2s;animation-delay:${i*.7}s;animation-direction:reverse"><path d="M${pN(hx-12+i*12)} ${pN(top-6)}c-2 -3 -6 0 0 4.4c6 -4.4 2 -7.4 0 -4.4z" fill="#E8546A" stroke="#8A2A3A" stroke-width=".5"/></g>`).join('')+star(hx+hr*1.1,top+4,2.6)+star(hx-hr*1.15,top+8,2);
    if(m==='sad'){
      s+=`<g class="a-float">${puff(hx-5,top-8,6,'#8C96A6')+puff(hx+4,top-9,7,'#8C96A6')+puff(hx,top-5,5.4,'#9AA4B4')}</g>`;
      s+=[0,1,2,3].map(i=>`<g class="a-rain" style="animation-delay:${i*.18}s"><path d="M${pN(hx-6+i*4)} ${pN(top-2)}l-1 4" stroke="#6E9AD0" stroke-width="1" stroke-linecap="round"/></g>`).join('');
      E.forEach(e=>{s+=`<g class="a-tear" style="animation-delay:${(e[0]>hx?.6:0)}s">${drop(e[0]+a.er*.3,e[1]+a.er*.9,.6,'#BFE6FA')}</g>`});
    }
    if(m==='hungry'){
      const bx=hx+hr*1.2+6,by=top-6;
      s+=`<circle cx="${pN(hx+hr*.7)}" cy="${pN(top+4)}" r="1.4" fill="#fff" stroke="#9A9088" stroke-width=".5"/><circle cx="${pN(hx+hr*.95)}" cy="${pN(top-.6)}" r="2.2" fill="#fff" stroke="#9A9088" stroke-width=".5"/>`;
      s+=`<g class="a-thought">${puff(bx,by,10,'#FFFFFF')}<g transform="translate(${pN(bx)} ${pN(by)}) scale(.9)">${foodIcon(S.sp.g,S.sp.id)}</g></g>`;
      s+=`<g class="a-shake">`+word('꼬르륵',a.body[0]-a.bw-11,a.body[1]+2,'#C4301F',8,-12)+`</g>`;
    }
    if(m==='scared'){
      s+=word('!',hx-hr-4,top+2,'#C4301F',16,-10)+word('!',hx+hr+3,top-2,'#C4301F',12,12);
      s+=`<g class="a-shake"><path d="M${pN(hx-hr*.9)} ${pN(top+3)}l-2 -5l3 1.5l-.6 -5.4l3 2M${pN(hx+hr*.9)} ${pN(top+3)}l2 -5l-3 1.5l.6 -5.4l-3 2" stroke="#3A2418" stroke-width=".9" fill="none" stroke-linejoin="round"/></g>`;
      s+=`<g class="a-drip">${drop(hx+hr*.85,hy-hr*.5,.7)}</g><g class="a-drip" style="animation-delay:.5s">${drop(hx-hr*.9,hy-hr*.3,.6)}</g>`;
    }
    if(m==='sick'){
      if(!a.raster) s+=`<ellipse cx="${pN(hx)}" cy="${pN(hy)}" rx="${pN(hr*.95)}" ry="${pN(hr*.8)}" fill="#8FD86A" opacity=".22"/>`;
      s+=`<g class="a-wobble" style="transform-origin:${pN(hx)}px ${pN(top-4)}px"><path d="M${pN(hx-6)} ${pN(top-4)}q3 -4 6 0t6 0" stroke="#7AA85A" stroke-width="1.2" fill="none"/></g>`+`<g class="a-drip">${drop(hx+hr*.85,hy-hr*.4,.7)}</g>`;
    }
    if(m==='angry') k='angry';
  }
  if(!k) return s;
  /* ----- gags ----- */
  const ex=E[0], er=a.er;
  switch(k){
  case 'bump':
    s+=`<ellipse cx="${pN(hx+hr*.2)}" cy="${pN(top+2)}" rx="${pN(hr*.32)}" ry="${pN(hr*.28)}" fill="#F2B0A0" stroke="#A85A4A" stroke-width=".6"/><ellipse cx="${pN(hx+hr*.12)}" cy="${pN(top+.6)}" rx="${pN(hr*.1)}" ry="${pN(hr*.07)}" fill="#fff" opacity=".7"/>`;
    s+=orbit(hx,top-2,hr*.95,hr*.28,1.3,[star(0,0,3),star(0,0,2.4,'#FFF1A0'),star(0,0,3),`<path d="M-2.4 0q2.4 -3 4.8 0q-2.4 2 -4.8 0Z" fill="#7AB8E8" stroke="#2A5A7A" stroke-width=".5"/><circle cx="1.6" cy="-.6" r=".4"/>`]);
    break;
  case 'cast':{
    const [lx,ly]=a.leg;
    s+=`<g transform="rotate(-8 ${lx} ${ly})"><rect x="${pN(lx-5)}" y="${pN(ly-7)}" width="10" height="15" rx="3.4" fill="#FBFAF6" stroke="#9A948A" stroke-width=".7"/><path d="M${pN(lx-5)} ${pN(ly-3)}h10M${pN(lx-5)} ${pN(ly+1)}h10M${pN(lx-5)} ${pN(ly+5)}h10" stroke="#D8D2C6" stroke-width=".7"/><text x="${pN(lx)}" y="${pN(ly+2)}" font-size="4" text-anchor="middle" fill="#C4301F" font-family="Nanum Pen Script,cursive" transform="rotate(-80 ${pN(lx)} ${pN(ly+2)})">쾌유</text></g>`;
    s+=`<path d="M${pN(hx-hr*.6)} ${pN(top+hr*.35)}l${pN(hr*.5)} ${pN(-hr*.12)}" stroke="#F2D8B8" stroke-width="3.4" stroke-linecap="round"/><path d="M${pN(hx-hr*.45)} ${pN(top+hr*.12)}l${pN(hr*.2)} ${pN(hr*.32)}" stroke="#F2D8B8" stroke-width="3.4" stroke-linecap="round"/>`;
    s+=word('흥',hx+hr+5,top+4,'#5A3A2A',9,10);
    break;}
  case 'band':
    s+=`<g transform="rotate(30 ${pN(a.body[0]+a.bw*.3)} ${pN(a.body[1])})"><rect x="${pN(a.body[0]+a.bw*.3-6)}" y="${pN(a.body[1]-1.8)}" width="12" height="3.6" rx="1.6" fill="#F0C9A0" stroke="#A8805A" stroke-width=".5"/><rect x="${pN(a.body[0]+a.bw*.3-2)}" y="${pN(a.body[1]-1.8)}" width="4" height="3.6" fill="#E3B488"/></g><g transform="rotate(-30 ${pN(a.body[0]+a.bw*.3)} ${pN(a.body[1])})"><rect x="${pN(a.body[0]+a.bw*.3-6)}" y="${pN(a.body[1]-1.8)}" width="12" height="3.6" rx="1.6" fill="#F0C9A0" stroke="#A8805A" stroke-width=".5"/></g>`;
    s+=`<g transform="rotate(-20 ${pN(hx-hr*.55)} ${pN(hy+hr*.35)})"><rect x="${pN(hx-hr*.55-4)}" y="${pN(hy+hr*.35-1.4)}" width="8" height="2.8" rx="1.2" fill="#F0C9A0" stroke="#A8805A" stroke-width=".5"/></g>`;
    break;
  case 'soot':
    if(!a.raster) s+=`<ellipse cx="${pN(hx)}" cy="${pN(hy)}" rx="${pN(hr*1.05)}" ry="${pN(hr*.92)}" fill="#1E1A18" opacity=".86"/><ellipse cx="${pN(a.body[0])}" cy="${pN(a.body[1])}" rx="${pN(a.bw*1.05)}" ry="${pN(a.bh*1.1)}" fill="#2A2420" opacity=".55"/>`;
    { let d='';for(let i=0;i<9;i++){const ang=Math.PI*(1.1+i*.1),x=hx+Math.cos(ang)*hr,y=hy+Math.sin(ang)*hr*.9;d+=`M${pN(x)} ${pN(y)}l${pN(Math.cos(ang)*3-1)} ${pN(Math.sin(ang)*3-1.4)}l${pN(1.6)} ${pN(-.6)}l${pN(Math.cos(ang)*3)} ${pN(Math.sin(ang)*3)}`}s+=`<path d="${d}" stroke="#1E1A18" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`}
    E.forEach((e,i)=>{s+=`<ellipse cx="${pN(e[0])}" cy="${pN(e[1])}" rx="${pN(er*1.05)}" ry="${pN(er*1.25)}" fill="#fff"/><circle cx="${pN(e[0]+(i?-.6:.6))}" cy="${pN(e[1]+.4)}" r="${pN(er*.38)}" fill="#1E1A18"/>`+pA('a-blink',e[0],e[1]-er*1.3,`<ellipse cx="${pN(e[0])}" cy="${pN(e[1])}" rx="${pN(er*1.2)}" ry="${pN(er*1.4)}" fill="#1E1A18"/>`,';animation-duration:2.2s')});
    s+=[0,1,2].map(i=>`<g class="a-smoke" style="animation-delay:${i*.8}s">${puff(hx-6+i*6,top-2,3.4,'#8A847E')}</g>`).join('');
    s+=word('콜록',hx+hr+6,hy,'#3A3430',8,8);
    break;
  case 'cold':
    if(!a.raster) s+=`<ellipse cx="${pN(a.body[0])}" cy="${pN(a.body[1]-6)}" rx="${pN(a.bw*1.15)}" ry="${pN(a.bh*1.5)}" fill="#8EC4F0" opacity=".22"/>`;
    s+=`<path d="M${pN(a.nose[0]-1.2)} ${pN(a.nose[1]+1)}L${pN(a.nose[0])} ${pN(a.nose[1]+8)}L${pN(a.nose[0]+1.2)} ${pN(a.nose[1]+1)}Z" fill="#DFF2FC" stroke="#7FB8D8" stroke-width=".6"/>`;
    s+=`<path d="${Pt.blob(hx,top+3,hr*.6,hr*.2,{j:.2,np:10})}" fill="#FFFFFF" stroke="#BFD8E8" stroke-width=".5"/>`;
    s+=[[-1,0],[1,.6],[0,1.2]].map(([d,dl],i)=>`<g class="a-rain" style="animation-duration:2.4s;animation-delay:${dl}s">${star(hx+d*hr*1.2,top-4-i*3,1.8,'#FFFFFF')}</g>`).join('');
    s+=`<g class="a-shake">`+word('덜덜',hx+hr+7,hy+4,'#2F6BD1',9,8)+`</g>`;
    break;
  case 'hot':
    if(!a.raster) s+=`<ellipse cx="${pN(hx)}" cy="${pN(hy)}" rx="${pN(hr)}" ry="${pN(hr*.85)}" fill="#F25A3A" opacity=".22"/>`;
    s+=[0,1,2].map(i=>`<g class="a-steam" style="animation-delay:${i*.35}s"><path d="M${pN(hx-6+i*6)} ${pN(top)}q-2 -3 0 -6t0 -6" stroke="#E87A5A" stroke-width="1.1" fill="none" opacity=".8"/></g>`).join('');
    s+=`<g class="a-drip">${drop(hx-hr*.95,hy-hr*.2,.8)}</g><g class="a-drip" style="animation-delay:.4s">${drop(hx+hr*.95,hy-hr*.3,.8)}</g><g class="a-drip" style="animation-delay:.8s">${drop(hx+hr*.5,top+4,.6)}</g>`;
    break;
  case 'wet':
    s+=`<g class="a-float">${puff(hx-4,top-8,6,'#7E8898')+puff(hx+5,top-9,6.6,'#7E8898')}</g>`+[0,1,2,3].map(i=>`<g class="a-rain" style="animation-delay:${i*.15}s"><path d="M${pN(hx-5+i*3.6)} ${pN(top-3)}l-1 4" stroke="#5E8AC0" stroke-width="1" stroke-linecap="round"/></g>`).join('');
    s+=`<ellipse cx="${pN(a.body[0])}" cy="${pN(a.body[1])}" rx="${pN(a.bw*1.1)}" ry="${pN(a.bh*1.3)}" fill="#3A5A7A" opacity=".16"/>`;
    s+=[0,1,2].map(i=>`<g class="a-drip" style="animation-delay:${i*.4}s">${drop(a.body[0]-a.bw+i*a.bw,a.body[1]+a.bh,.6)}</g>`).join('');
    s+=`<ellipse cx="${pN(a.body[0])}" cy="${pN(a.feet+.6)}" rx="${pN(a.bw*1.6)}" ry="2" fill="#7FB4D8" opacity=".5"/>`;
    break;
  case 'itch':
    s+=[[0,0],[1,.3],[2,.6],[3,.15]].map(([i,dl])=>`<g class="a-flea" style="animation-delay:${dl}s"><circle cx="${pN(a.body[0]-a.bw*.6+i*a.bw*.4)}" cy="${pN(a.body[1]-a.bh*.6+(i%2)*a.bh*.5)}" r="1" fill="#3A2418"/></g>`).join('');
    s+=`<g class="a-shake"><path d="M${pN(hx+hr*.8)} ${pN(hy-hr*.2)}l4 -2M${pN(hx+hr*.85)} ${pN(hy+hr*.1)}l4.6 0M${pN(hx+hr*.8)} ${pN(hy+hr*.4)}l4 2" stroke="#3A2418" stroke-width=".8" stroke-linecap="round"/></g>`+word('벅벅',hx+hr+9,hy-hr*.4,'#5A3A2A',8,10);
    s+=`<ellipse cx="${pN(a.ear[0])}" cy="${pN(a.ear[1]+2)}" rx="2" ry="1.5" fill="#7A6E62" stroke="#3A2E22" stroke-width=".5"/>`;
    break;
  case 'queasy':
    if(!a.raster) s+=`<ellipse cx="${pN(hx)}" cy="${pN(hy)}" rx="${pN(hr*.95)}" ry="${pN(hr*.8)}" fill="#7CC84A" opacity=".32"/>`;
    s+=E.map(e=>`<ellipse cx="${pN(e[0]+(e[0]<hx?-er*.6:er*.6))}" cy="${pN(e[1]+er*2.4)}" rx="${pN(er*1.3)}" ry="${pN(er*1)}" fill="#9AD86A" opacity=".7"/>`).join('');
    s+=`<g class="a-wobble" style="transform-origin:${pN(hx)}px ${pN(top-5)}px"><path d="M${pN(hx-8)} ${pN(top-4)}q2 -3 4 0t4 0t4 0t4 0" stroke="#5E9A3A" stroke-width="1.1" fill="none"/></g>`;
    break;
  case 'cone':{
    const R1=hr*1.9,R0=hr*1.05;
    s=`<path d="M${pN(hx-R1)} ${pN(hy)}a${pN(R1)} ${pN(R1*.95)} 0 1 0 ${pN(R1*2)} 0a${pN(R1)} ${pN(R1*.95)} 0 1 0 ${pN(-R1*2)} 0ZM${pN(hx-R0)} ${pN(hy+2)}a${pN(R0)} ${pN(R0*.9)} 0 1 1 ${pN(R0*2)} 0a${pN(R0)} ${pN(R0*.9)} 0 1 1 ${pN(-R0*2)} 0Z" fill="#F4FAFF" fill-rule="evenodd" opacity=".62" stroke="#9AB4C8" stroke-width=".8"/>`+
      `<path d="${Array.from({length:10},(_,i)=>{const t=i/10*Math.PI*2;return `M${pN(hx+Math.cos(t)*R0*1.05)} ${pN(hy+2+Math.sin(t)*R0*.95)}L${pN(hx+Math.cos(t)*R1*.98)} ${pN(hy+Math.sin(t)*R1*.93)}`}).join('')}" stroke="#C9DAE6" stroke-width=".7" opacity=".8"/>`;
    s+=`<path d="M${pN(a.body[0]-a.bw*.5)} ${pN(a.body[1]+a.bh*.5)}l${pN(a.bw)} 0" stroke="#7A4A3A" stroke-width=".8" stroke-dasharray="1.6 1.2"/><path d="${Array.from({length:5},(_,i)=>`M${pN(a.body[0]-a.bw*.45+i*a.bw*.22)} ${pN(a.body[1]+a.bh*.5-1.4)}l0 2.8`).join('')}" stroke="#3A2A2A" stroke-width=".7"/>`;
    break;}
  case 'fever':
    s+=`<g transform="rotate(-12 ${pN(hx)} ${pN(top+3)})"><path d="${Pt.blob(hx,top+3,hr*.55,hr*.22,{j:.08})}" fill="#9FD0F2" stroke="#4A7AA8" stroke-width=".7"/><path d="M${pN(hx-hr*.3)} ${pN(top+1)}q${pN(hr*.3)} -2 ${pN(hr*.55)} 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".8"/></g>`;
    s+=`<g transform="rotate(-24 ${pN(a.mouth[0])} ${pN(a.mouth[1])})"><rect x="${pN(a.mouth[0])}" y="${pN(a.mouth[1]-1)}" width="13" height="2.2" rx="1.1" fill="#fff" stroke="#8A8A8A" stroke-width=".5"/><circle cx="${pN(a.mouth[0]+13)}" cy="${pN(a.mouth[1]+.1)}" r="1.8" fill="#D63C4A"/><rect x="${pN(a.mouth[0]+6)}" y="${pN(a.mouth[1]-.4)}" width="7" height="1" fill="#D63C4A"/></g>`;
    s+=E.map(e=>Pt.blush(e[0]+(e[0]<hx?-er*.4:er*.4),e[1]+er*2,er*1.3,.55)).join('');
    break;
  case 'angry':
    if(!a.raster) s+=`<ellipse cx="${pN(hx)}" cy="${pN(hy)}" rx="${pN(hr)}" ry="${pN(hr*.85)}" fill="#F23A2A" opacity=".2"/>`;
    s+=[-1,1].map(d=>[0,1].map(i=>`<g class="a-steam" style="animation-delay:${i*.5+(d>0?.25:0)}s">${puff(hx+d*(hr*.9),top+hr*.25,2.8,'#FFFFFF')}</g>`).join('')).join('');
    s+=`<g class="a-pulse" style="transform-origin:${pN(hx+hr*.55)}px ${pN(top+hr*.3)}px"><path d="M${pN(hx+hr*.55-3)} ${pN(top+hr*.3-1)}q2 1 3 -2M${pN(hx+hr*.55+1)} ${pN(top+hr*.3-3)}q-1 2 2 3M${pN(hx+hr*.55+3)} ${pN(top+hr*.3+1)}q-2 -1 -3 2M${pN(hx+hr*.55-1)} ${pN(top+hr*.3+3)}q1 -2 -2 -3" stroke="#D62A2A" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`;
    break;
  case 'stuffed':
    s+=`<ellipse cx="${pN(a.body[0])}" cy="${pN(a.body[1]+a.bh*.25)}" rx="${pN(a.bw*.95)}" ry="${pN(a.bh*.8)}" fill="${Pt.rg('#F6E2C8',{hi:.5})}" opacity=".55" stroke="#B89A7A" stroke-width=".5"/>`;
    s+=word('끄억',hx+hr+6,hy+2,'#7A5A2A',9,-8)+`<circle cx="${pN(a.mouth[0]+3)}" cy="${pN(a.mouth[1]+3)}" r=".8" fill="#C9A06A"/><circle cx="${pN(a.mouth[0]-3)}" cy="${pN(a.mouth[1]+4)}" r=".7" fill="#C9A06A"/>`;
    break;
  }
  return s;
}
