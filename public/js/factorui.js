/* ---------- v0.25: 인자 on screen — picking 선배 on the title screen, the factors earned on the result screen ---------- */
function facChip(f){const s=document.createElement('span');s.className='fc';s.dataset.t=f.t;
  s.innerHTML='<b></b><i></i>';s.firstChild.textContent=facName(f);s.lastChild.textContent=facStars(f.s);return s}
const FAC_TNAME={s:'스탯',k:'스킬',u:'고유'};

/* the title screen: up to two 선배 */
function facPickDraw(){if(typeof document==='undefined'||!document.querySelectorAll||typeof facAll!=='function')return;document.querySelectorAll('.inhpick').forEach(facPickInto)}
function facPickInto(box){
  const all=facAll(),sel=facPicked().map(L=>L.id);
  box.innerHTML='';const lab=document.createElement('span');lab.className='label';lab.textContent='계승 — 선배 고르기 (최대 2)';box.appendChild(lab);
  if(!all.length){const p=document.createElement('p');p.className='inh-none';p.textContent='육성을 끝내면 인자가 남습니다. 다음 물고기가 물려받을 수도 있습니다. 운이 좋으면.';box.appendChild(p);return}
  const list=document.createElement('div');list.className='inh-list';
  const shown=all.slice().sort((a,b)=>(sel.includes(b.id)-sel.includes(a.id))||facVal(b)-facVal(a)).slice(0,typeof innerWidth==='number'&&innerWidth<600?4:8);
  shown.forEach(L=>{const b=document.createElement('button');b.type='button';b.className='inh-c';b.setAttribute('aria-pressed',String(sel.includes(L.id)));
    b.innerHTML='<img alt=""><span class="ic-t"><b class="ic-n"></b><span class="ic-r"></span></span><span class="ic-f"></span>';
    b.querySelector('img').src=fishImg(L.sp);b.querySelector('.ic-n').textContent=L.name;
    const r=b.querySelector('.ic-r');r.textContent=L.rank;r.dataset.rg=typeof rankGroup==='function'?rankGroup(L.rank):'';
    const fl=b.querySelector('.ic-f');(L.f||[]).slice().sort((x,y)=>y.s-x.s).slice(0,3).forEach(f=>fl.appendChild(facChip(f)));
    if((L.f||[]).length>3){const m=document.createElement('span');m.className='fc more';m.textContent='+'+(L.f.length-3);fl.appendChild(m)}
    b.title='「'+L.title+'」 '+L.name+' ('+(L.spName||'')+', '+L.rank+') — '+(L.f||[]).map(facLabel).join(', ');
    b.onclick=()=>{let ids=facPicked().map(x=>x.id);
      if(ids.includes(L.id))ids=ids.filter(x=>x!==L.id);else{ids.push(L.id);if(ids.length>2)ids.shift()}
      facSetPick(ids);facPickDraw()};
    list.appendChild(b)});
  box.appendChild(list);
  const n=document.createElement('p');n.className='inh-note';
  n.textContent=sel.length?'육성이 시작될 때와 절반쯤에서, 선배의 인자가 빛나면 물려받습니다. 같은 종이면 조금 더 잘 빛납니다.':'선배를 고르지 않았습니다. 맨몸으로 시작합니다.';
  box.appendChild(n);
}
try{facPickDraw()}catch(e){}

/* the result screen: what this fish leaves */
function facResult(){
  const E=$('ending');if(!E||!S||!S.f)return;
  const old=E.querySelector('.facres');if(old)old.remove();
  const c=S.f.car,f=c&&c.factors||[];
  const box=document.createElement('div');box.className='facres';
  box.innerHTML='<span class="fr-who">인자 획득</span><p class="fr-h"></p><div class="fr-list"></div><p class="fr-n"></p>';
  const h=box.querySelector('.fr-h'),list=box.querySelector('.fr-list'),n=box.querySelector('.fr-n');
  if(f.length){h.textContent=T('{n}이 남긴 인자 '+f.length+'개');
    ['s','k','u'].forEach(t=>f.filter(x=>x.t===t).forEach(x=>{const ch=facChip(x);ch.title=FAC_TNAME[t]+' 인자';list.appendChild(ch)}));
    n.textContent=pick(['다음 생, 시작 화면에서 선배로 고르면 물려받을 수 있습니다. 운이 좋으면.','선배로 고르면 다음 물고기가 물려받습니다. 빛날지는 그날의 물 상태에 달렸습니다.'])}
  else{h.textContent='남긴 인자 없음';list.remove();
    n.textContent=S.preOwner?'주인을 만나기 전에 끝난 생은 인자를 남기지 않습니다. 형제들이 대신 기억합니다.':c?'이번 생은 인자 대신 추억만 남겼습니다. 추억은 계승이 안 됩니다. 아쉽습니다.':'육성이 시작되기 전에 끝났습니다. 인자는 키워야 남습니다.'}
  const keep=E.querySelector('.keep'),y=E.querySelector('.yokoku');
  if(y)y.replaceWith(box);else E.insertBefore(box,keep||E.querySelector('.row'));
  /* the next life's 선배 can be picked right here, before 다른 생물 보내기 */
  const pk=document.createElement('div');pk.className='inhpick inline';box.after(pk);
  try{facPickDraw()}catch(e){}
}
(()=>{const _e=showEnd;showEnd=function(){const r=_e.apply(this,arguments);try{facResult()}catch(e){if(typeof console!=='undefined')console.error(e)}return r}})();

/* 물고기 도감: on the records section, and the NEW stamps on the result card */
function dexDraw(){
  const box=$('dex');if(!box||typeof dexAll!=='function'||typeof RIG==='undefined')return;
  const d=dexAll(),ids=Object.keys(RIG),got=ids.filter(id=>d[id]).length,titles=new Set(Object.values(d).flatMap(e=>e.titles||[])).size;
  box.innerHTML='<p class="dx-h"><b>물고기 도감</b> <span></span></p><div class="dx-grid"></div>';
  box.querySelector('.dx-h span').textContent=got+' / '+ids.length+'종 · 모은 칭호 '+titles+'개 · 다음 육성 시작 SP +'+dexBonus();
  const g=box.querySelector('.dx-grid');
  ids.forEach(id=>{const e=d[id],sp=(typeof SP!=='undefined'?SP:[]).find(s=>s.id===id),it=document.createElement('div');it.className='dx-i'+(e?'':' off');
    it.innerHTML='<img alt=""><span class="dx-n"></span><b class="dx-r"></b>';it.querySelector('img').src=fishImg(id);
    it.querySelector('.dx-n').textContent=e?(sp?sp.name:id):'???';
    const r=it.querySelector('.dx-r');if(e&&e.best){r.textContent=e.best;r.dataset.rg=rankGroup(e.best)}else r.remove();
    it.title=e?(sp?sp.name:id)+' — '+e.lives+'번 키움 · 끝까지 '+e.calm+'번'+(e.best?' · 최고 '+e.best+(e.name?' ('+e.name+')':''):'')+(e.titles&&e.titles.length?' · 칭호: '+e.titles.join(', '):''):'아직 키워 보지 않은 물고기';
    g.appendChild(it)});
}
try{dexDraw()}catch(e){}
(()=>{const _d=drawMem;drawMem=function(){const r=_d.apply(this,arguments);try{dexDraw()}catch(e){}return r}})();
function dexStamp(){
  const E=$('ending');if(!E||typeof dexRecord!=='function')return;const n=dexRecord();if(!n)return;
  const card=E.querySelector('.endcard');if(!card)return;
  const add=(t,cls)=>{const s=document.createElement('span');s.className='ec-new '+cls;s.textContent=t;card.appendChild(s)};
  if(n.isNew)add('도감 등록!','dex');
  if(n.better&&!n.isNew)add('NEW 최고 기록!','best');
  dexDraw();
}
(()=>{const _e=showEnd;showEnd=function(){const r=_e.apply(this,arguments);try{dexStamp()}catch(e){}return r}})();
