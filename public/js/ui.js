/* ---------- pledge sheet ---------- */
function drawPledges(el,live){
  el.innerHTML='';
  const one=t=>{const li=document.createElement('li');li.innerHTML='<span class="no">—</span><span class="tx"></span>';li.lastChild.textContent=t;el.appendChild(li)};
  if(live&&S.noPledge) return one('서약서 없음 · 먹이로 구매되었습니다');
  if(live&&S.preOwner) return one('서약서 없음 · 아직 주인이 없는 생명입니다');
  if(live&&S.flags.fac) return one('보호시설 보호 중 · 개인 서약서 없음');
  pledgeList(!live).forEach((p,i)=>{
    const li=document.createElement('li');
    li.innerHTML='<span class="no">0'+(i+1)+'</span><span><span class="tx"></span></span>';
    li.querySelector('.tx').textContent=p;
    if(live&&S.pl[i]){li.classList.add('broken');const mended=typeof plKept==='function'&&plKept(S.pl[i]);if(mended)li.classList.add('mended');
      /* every reason the promise was broken, grouped by the age it happened */
      const by=[];[S.pl[i]].concat(S.pl[i].more||[]).forEach(r=>{const a=ageLabel(r.age),g=by.find(g=>g.a===a);if(g)g.n.push(r.note);else by.push({a,n:[r.note]})});
      by.forEach(g=>{const n=document.createElement('span');n.className='note';n.textContent=g.a+' — '+g.n.join(' · ');li.lastChild.appendChild(n)});
      [S.pl[i]].concat(S.pl[i].more||[]).filter(r=>r.mended).forEach(r=>{const n=document.createElement('span');n.className='note fix';n.textContent='↳ '+ageLabel(r.mended.age)+' — '+r.mended.label;li.lastChild.appendChild(n)});
      if(mended){const n=document.createElement('span');n.className='note fix';n.textContent='다시 지켰습니다';li.lastChild.appendChild(n)}}
    el.appendChild(li);
  });
}
function breakP(i,note){if(S.preOwner||S.noPledge||S.flags.fac||S.wild)return;const p=S.pl[i];
  if(p){if(p.note===note||(p.more||[]).some(r=>r.note===note)||(p.more||[]).length>=4)return;(p.more=p.more||[]).push({age:S.ageM,note})}
  else S.pl[i]={age:S.ageM,note};
  drawPledges($('gamePledges'),true)}
drawPledges($('introPledges'),false);

/* ---------- queue & log ---------- */
const q=(text,cls,fn)=>S.queue.push({text,cls,fn});
function addLog(text,cls){
  if(typeof pondify==='function') text=pondify(text);
  if(typeof gagFrom==='function') gagFrom(text);
  const li=document.createElement('li');li.className=cls||'';
  li.innerHTML='<span class="t"></span><p></p>';
  li.querySelector('.t').textContent=ageLabel(S.ageM);
  li.querySelector('p').textContent=text;
  $('log').prepend(li);
  if(S&&S.story&&text) S.story.push({a:ageLabel(S.ageM),t:text,c:cls||''});
  if(!skipping&&typeof fInner==='function') fInner(text,cls);
}
const say=(t,c)=>addLog(T(t),c);
/* after a choice: what it changed, as small chips in the log, and a short flash on the meters */
const DLAB=[['h','건강',1,'mHealth'],['p','힘',1,'mPow'],['g','근성',1,'mGuts'],['w','지능',1,'mWits'],['c','매력',1,'mCharm'],['wq','수질',1,'mWq'],['i','보살핌',1,'mCare'],['st','스트레스',-1],['fin','상처',-1],['fat','과식',-1],['r','주인 실력',1,'mSkill']];
function statSnap(){if(!S)return {};const f=S.f,o={h:clamp(S.health,0,100),i:clamp(S.interest,0,1)*100,r:S.r*100};
  if(f){o.wq=clamp(f.wq,0,100);o.st=clamp(f.stress,0,1.2)*100;o.fin=Math.max(0,f.fin)*100;o.fat=(f.fat||0)*100;o.ill=f.ill?f.ill.id:'';if(f.st){o.p=f.st.p;o.g=f.st.g;o.w=f.st.w;o.c=f.st.c}}return o}
function showDelta(a,b){
  if(!S||S.done||S.ending||!a||!b)return;
  const ch=[];
  DLAB.forEach(([k,l,sg,id])=>{if(a[k]===undefined||b[k]===undefined)return;const d=Math.round(b[k]-a[k]);if(Math.abs(d)<1)return;
    ch.push({t:l+' '+(d>0?'+':'−')+Math.abs(d),good:d*sg>0});
    const el=id&&$(id);if(el&&el.classList){el.classList.remove('up','down');void el.offsetWidth;el.classList.add(d*sg>0?'up':'down');setTimeout(()=>el.classList.remove('up','down'),1400)}});
  if(b.ill&&b.ill!==a.ill&&typeof DZ!=='undefined'&&DZ[b.ill])ch.push({t:'병: '+DZ[b.ill].n,good:false});
  if(!b.ill&&a.ill)ch.push({t:'병이 나음',good:true});
  if(!ch.length)return;
  /* the chips go under the line the choice just wrote */
  const last=$('log').firstElementChild,host=last&&last.querySelector('p');
  const box=document.createElement('span');box.className='dchips';
  ch.forEach(c=>{const s=document.createElement('span');s.className='dchip '+(c.good?'up':'down');s.textContent=c.t;box.appendChild(s)});
  if(host)host.appendChild(box);
}
function meter(el,v){v=Math.round(clamp(v,0,100));el.querySelector('.v').textContent=v;el.querySelector('.fill').style.width=v+'%';el.classList.toggle('low',v<30)}
function fields(){
  const rows=[['이름',S.name||(S.noPledge?'없음':'지어지지 않음')],['온 곳',S.origin],['기질',S.temper?TEMPER.find(t=>t.k===S.temper).l:'—'],['서약인',ownerText()],['현재',S.status+(S.owners>1&&!S.wild?' · '+S.owners+'번째 주인':'')]];
  if(S.tank&&!S.wild) rows.push(['어항',tankText()]);
  if(S.f){rows[3][1]=fishOwnerText();if(S.f.path.length)rows[1][1]=S.f.path.join(' → ');if(!S.preOwner&&!S.wild)rows.push(['수조',fishTankText()]);rows.push(['몸길이',S.f.len.toFixed(S.f.len<10?1:0)+'cm · 다 크면 '+fx_().cm+'cm'])}
  const dl=$('fields');dl.innerHTML='';
  rows.forEach(([k,v])=>{const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');dd.textContent=v;dl.append(dt,dd)});
}
function render(){
  $('ageNow').textContent=ageLabel(S.ageM);
  $('ageFill').style.width=clamp(S.ageM/S.sp.life*100,0,100)+'%';
  stepText();
  meter($('mHealth'),S.health);if(S.f&&S.hMax<100&&!S.done)$('mHealth').querySelector('.v').textContent=Math.round(S.health)+' / '+S.hMax;
  const F=S.f,pre=!!(F&&S.preOwner),wild=!!S.wild;
  if(F&&S.temper&&typeof fst==='function')fst();
  /* the fish's own stats */
  [['mPow','p'],['mGuts','g'],['mWits','w'],['mCharm','c']].forEach(([id,k])=>{const el=$(id);if(!el)return;el.hidden=!(F&&F.st);if(!el.hidden)meter(el,F.st[k])});
  /* what the owner keeps: skill, temperature, water, care (in the wild: the river's temperature and food) */
  const own=$('ownRow');if(own)own.hidden=pre;
  const oh=$('ownHead');if(oh)oh.textContent=wild?'강물':'주인 몫';
  $('careLabel').textContent=wild?'먹이 찾기':'보살핌';
  meter($('mCare'),wild?wildOf().forage*100*(S.health/100*.5+.5):S.interest*100);
  const sk=$('mSkill');if(sk){sk.hidden=!F||wild||pre;if(!sk.hidden){meter(sk,S.r*100);sk.querySelector('.v').textContent=fRank(S.r)+' '+Math.round(S.r*100)}}
  const wq=$('mWq');if(wq){wq.hidden=!(F&&!pre&&!wild);if(!wq.hidden)meter(wq,F.wq)}
  const tp=$('mTemp');if(tp){tp.hidden=!(F&&!pre&&typeof fTempNow==='function');if(!tp.hidden){const t=fTempNow();
    /* the bar is a thermometer (0–36℃) with the species' range as a band; colour says too cold / right / too hot */
    const sc=v=>clamp(v/36*100,0,100),st=t.c<t.lo-.5?'cold':t.c>t.hi+.5?'hot':'ok';
    tp.querySelector('.fill').style.width=sc(t.c)+'%';tp.classList.remove('low');tp.dataset.t=st;
    let band=tp.querySelector('.band');if(!band){band=document.createElement('i');band.className='band';tp.querySelector('.track').appendChild(band)}
    band.style.left=sc(t.lo)+'%';band.style.width=(sc(t.hi)-sc(t.lo))+'%';
    tp.querySelector('.v').textContent=t.c.toFixed(0)+'℃'+(st==='hot'?' ▲':st==='cold'?' ▼':'');tp.title='알맞은 수온 '+t.lo+'~'+t.hi+'℃'}}
  if(document.body&&document.body.classList)document.body.classList.toggle('ingame',!S.done&&!$('game').hidden);
  fields();drawStage();
}

const LAST={
  flat:'마지막으로 본 건 눈부신 불빛이었다.',freeze:'마지막까지 따뜻했던 날을 떠올렸다.',starve:'마지막까지 밥그릇 소리를 기다렸다.',
  eaten:'마지막으로 본 건 커다란 입 안의 어둠이었다.',bite:'반쪽이 된 몸으로, 아직 물살을 느꼈다.',flush:'빙글빙글 도는 물. 그리고 어둠.',
  fall:'잠깐 하늘을 날았다.',poison:'달콤한 냄새였는데.',heat:'물. 물이 마시고 싶었다.',drown:'목줄이 끝까지 놓아주지 않았다.',
  sickdead:'아프다고 말할 수 있었으면 좋았을 텐데.',bellyup:'수면 위 불빛이 점점 흐려졌다.',jump:'저 너머가 궁금했을 뿐이다.',
  plate:'',cage:'철창 너머에서 누군가 내 이름을 불러 주길 바랐다.',truck:'멀어지는 마당을 끝까지 돌아보았다.',bottle:'숲 냄새가 그리웠다.',gone:'',
};
function showEnd(cat,fact,calm){
  S.done=true;stop();if(document.body&&document.body.classList)document.body.classList.remove('ingame');
  if(!calm)S.health=0;
  stageKey='';render();
  const sm=document.createElement('div');sm.className='stamp'+(calm?' calm':'');sm.textContent=cat;$('card').appendChild(sm);
  const lived=S.ageM,pot=S.sp.life,pct=Math.round(clamp(lived/pot,0,1)*100);
  const kept=S.pl.filter(x=>typeof plKept==='function'?plKept(x):!x).length;
  const E=$('ending');E.hidden=false;E.innerHTML='';done=0;barDraw();
  const h=document.createElement('h2');
  const al=ageLabel(lived);
  h.textContent=calm?T('{n}은 '+josa(al,'을')+' 살았습니다.'):T('{n}은 '+al+' 만에 생을 마쳤습니다.');
  E.appendChild(h);
  if(!S.noPledge){const sc=document.createElement('div');sc.className='score'+(kept===S.pl.length||S.flags.fac?' calm':'');sc.textContent=S.f&&S.f.free?'서약서도 주인도 필요 없는 생이었습니다':S.preOwner?'서약서를 쓸 주인을 만나기도 전이었습니다':S.flags.fac?'서약서 대신 보호시설이 끝까지 돌봤습니다':(S.f&&S.f.place?josa(S.o.name,'이'):S.o.name+' 님이')+' 지킨 서약 '+kept+' / '+S.pl.length;E.appendChild(sc);
    if(!S.preOwner&&!S.flags.fac){const ol=document.createElement('ol');ol.className='pledges endpl';drawPledges(ol,true);E.appendChild(ol)}}
  const c=document.createElement('div');c.className='compare';
  c.innerHTML='<div class="cbar"><span>살아낸 시간</span><div class="track"><div class="fill"></div></div><span class="mono a"></span></div><div class="cbar"><span>살 수 있던 시간</span><div class="track"><div class="fill pot" style="width:100%"></div></div><span class="mono b"></span></div>';
  c.querySelector('.fill').style.width=Math.max(pct,1)+'%';c.querySelector('.a').textContent=pct+'%';c.querySelector('.b').textContent=ageLabel(pot);
  E.appendChild(c);
  // 돌아보기
  const look=document.createElement('div');look.className='look';
  const lh=document.createElement('h3');lh.textContent='돌아보기 — '+S.disp+'의 기억';look.appendChild(lh);
  // one line per memory: repeated moments keep their first time
  const uniq=[];S.mem.forEach(mm=>{const ex=uniq.find(u=>u.t===mm.t);if(ex)ex.w=Math.max(ex.w,mm.w)+.15;else uniq.push(Object.assign({},mm))});
  if(uniq.length){
    const best=uniq.reduce((a,b)=>b.w>a.w?b:a,uniq[0]);
    const top=uniq.slice().sort((a,b)=>b.w-a.w).slice(0,5).sort((a,b)=>a.age-b.age);
    const ul=document.createElement('ul');ul.className='mems';
    top.forEach(mm=>{const li=document.createElement('li');if(mm===best)li.className='best';li.innerHTML='<span class="t"></span><p></p>';li.firstChild.textContent=ageLabel(mm.age);li.lastChild.textContent=mm.t;ul.appendChild(li)});
    look.appendChild(ul);
  } else {
    const p=document.createElement('p');p.className='ask';p.textContent=T('{n}에게는 떠올릴 만한 행복한 기억이 없었습니다.');look.appendChild(p);
  }
  const lt=LAST[S.fx];
  if(lt&&!calm){const p=document.createElement('p');p.className='last';p.textContent='"'+lt+'"';look.appendChild(p)}
  if(calm&&S.mem.length){const p=document.createElement('p');p.className='last';p.style.color='var(--calm)';p.textContent='"좋은 날이 더 많았다."';look.appendChild(p)}
  E.appendChild(look);
  // last words: what the animal would say to its person
  if(!S.noPledge){
    const lw=document.createElement('div');lw.className='lastwords';
    const lab=document.createElement('label');lab.htmlFor='lastWords';const noOwner=S.wild||S.preOwner;lab.textContent=S.disp+(noOwner?'이 세상에':'이 주인에게')+' 남기는 마지막 한마디';
    if(!hb(S.disp)) lab.textContent=S.disp+(noOwner?'가 세상에':'가 주인에게')+' 남기는 마지막 한마디';
    const ta=document.createElement('textarea');ta.id='lastWords';ta.rows=2;ta.maxLength=80;ta.placeholder=calm?'예) 고마웠어. 먼저 가서 기다릴게.':'예) 왜 그랬어?';
    const b=document.createElement('button');b.className='btn ghost';b.textContent='남기기';
    const out=document.createElement('p');out.className='last';out.hidden=true;
    b.onclick=()=>{const v=ta.value.trim().slice(0,80);if(!v)return;out.textContent='"'+v+'"';out.hidden=false;ta.hidden=true;b.hidden=true;S.lw=v;const me=mem.find(m=>m.id&&m.id===S.memId);if(me){me.lw=v;storeMem()}};
    lw.append(lab,ta,b,out);E.appendChild(lw);
  }
  const f=document.createElement('div');f.className='fact';f.innerHTML='<span class="label">실제로는</span><span class="tx"></span>';f.querySelector('.tx').textContent=fact;E.appendChild(f);
  const a=document.createElement('p');a.className='ask';
  a.textContent=S.noPledge?'먹이로 태어난 생명도 하나의 생명이었습니다. 무언가를 키우기로 하면, 그 생물이 먹는 생명까지 함께 책임지게 됩니다.':
    S.f&&S.f.free?'이 물고기는 그물을 피해 태어난 물에서 끝까지 살았습니다. 같은 그물에 걸린 형제들은 그날 밤 상자에 담겼습니다. 사는 사람이 없으면, 잡는 사람도 없습니다.':
    S.preOwner?'이 물고기는 누군가의 수조에 닿기도 전에 죽었습니다. 가게 수조에서 헤엄치는 한 마리 뒤에는, 상자 안에서 먼저 죽은 물고기들이 있습니다. 사는 사람이 있어서 잡고, 기르고, 고릅니다.':
    S.f&&S.f.wild&&!calm?'이 물고기는 강에서 태어났습니다. 그 강에서 수조까지 오는 길, 그리고 수조 안의 시간 모두 사람이 정한 것이었습니다.':
    S.smuggled?'이 생물이 집에 오기까지 몇 마리가 길 위에서 죽었는지 아무도 세지 않습니다. 사는 사람이 없으면 밀렵도 없습니다.':
    calm?'지금 곁에 있는 아이가 이 끝을 맞을 수 있도록, 오늘 해 줄 수 있는 일이 하나쯤 있을 겁니다.':
    '이 결말은 게임 속 확률이지만, 같은 일이 오늘도 어딘가에서 일어나고 있습니다. 지금 곁에 있는 아이는 당신이 선택한 생명입니다.';
  E.appendChild(a);
  const row=document.createElement('div');row.className='row';
  const b1=document.createElement('button');b1.className='btn';b1.textContent='다른 생물 보내기';b1.onclick=()=>spin();
  const b2=document.createElement('button');b2.className='btn ghost';b2.textContent='같은 종으로 다시';const sid=S.sp.id;b2.onclick=()=>start(sid);
  row.append(b1,b2);E.appendChild(row);
  /* keep this life? only a kept life goes into 주마등 */
  const keep=document.createElement('div');keep.className='keep';
  keep.innerHTML='<p>이 생을 <b>주마등</b>에 남기시겠습니까?</p><span class="sub">남긴 생은 아래 주마등에서 눌러 다시 볼 수 있습니다. 어떻게 살다 어떻게 끝났는지, 주인이 무엇을 지키지 못했는지.</span>'+(typeof shareOn==='function'&&shareOn()?'<label class="pubchk"><input type="checkbox" checked> 모두의 주마등에도 올리기 <small>서약인 이름, 물고기, 결말, 마지막 한마디가 다른 사람에게 보입니다.</small></label>':'')+'<div class="row"><button class="btn">남기기</button><button class="btn ghost">남기지 않기</button></div>';
  const kb=keep.querySelector('.btn:not(.ghost)'),nb=keep.querySelector('.btn.ghost');
  kb.onclick=()=>{S.memId='m'+Date.now();const rec=lifeRecord(cat,calm,fact,kept,al,pct);saveMem(rec);const ck=keep.querySelector('.pubchk input'),pub=!!(ck&&ck.checked);
    keep.innerHTML='<p class="done">주마등에 남겼습니다.</p>'+(pub?'<span class="sub pubst">모두의 주마등에 올리는 중…</span>':'');
    if(pub)sharePost(rec).then(ok=>{const st=keep.querySelector('.pubst');if(st)st.textContent=ok?'모두의 주마등에도 올렸습니다. 다른 서약인들이 이 생을 다시 볼 수 있습니다.':'모두의 주마등에 올리지 못했습니다. 내 주마등에는 남아 있습니다.'})};
  nb.onclick=()=>{keep.innerHTML='<p class="done muted">남기지 않았습니다.</p>'};
  E.insertBefore(keep,row);
  if(!skipping&&E.scrollIntoView) setTimeout(()=>E.scrollIntoView({behavior:'smooth',block:'start'}),400);
}

function start(force){
  stop();
  NICK=(($('nick').value)||'').trim().slice(0,12);
  try{localStorage.setItem('kiwojuseyo-nick',NICK)}catch(e){}
  newLife(force);done=0;stageKey='';if(typeof preloadArt==='function')preloadArt(S.sp.id);if(S.f&&typeof preloadFish==='function')preloadFish();
  $('intro').hidden=true;$('game').hidden=false;$('log').innerHTML='';$('ending').hidden=true;$('choice').hidden=true;
  const old=document.querySelector('.stamp');if(old)old.remove();
  const sp=S.sp;
  $('spName').textContent=sp.name;$('spSci').textContent=sp.sci+(sp.cites?' · CITES 규제종':'');
  $('cardNo').textContent=(S.noPledge?'먹이 거래 기록':(S.o&&S.o.name?S.o.name+' 님의 ':'')+(S.f?'관상어 입양 서약서':'입양 서약서'))+' No. 2026-'+S.no;
  $('cardSex').textContent=S.sex;
  $('ageMax').textContent='기대수명 '+ageLabel(sp.life);
  drawPledges($('gamePledges'),true);render();
  paused=false;setPlay();
  if(window.scrollTo) window.scrollTo({top:0,behavior:'smooth'});
  askChoice({who:'기질 고르기',p:T(sp.name+(S.name?' {n}':'')+'… 이 아이는 어떤 기질을 타고났을까요?'),o:TEMPER.map(t=>({l:t.l,d:(S.f&&typeof FTEMPER_D!=='undefined'&&FTEMPER_D[t.k])||t.d,c:'neutral',r:'',fx:()=>{S.temper=t.k}}))},()=>{
    if(S.f){fishPrologue();if(!skipping)tick();return}
    if(S.smuggled) smugglePrologue();
    else if(sp.cafe){S.flags.cafeLife=1;S.status='야생동물 카페';S.env='cafe';q(T('{n}은 야생동물 카페에서 태어났습니다. 손님들이 돈을 내고 {n}을 안아 봅니다.'),'neutral')}
    else if(S.noPledge) q(sp.g==='feeder'?'당신은 '+S.origin+'에 담겨 팔렸습니다.':'당신은 '+S.origin+'에서 태어났습니다.','neutral');
    else q(T('{n}이 새 집에 왔습니다. 온 곳은 '+S.origin+'. 서약서에 서명이 끝났습니다.'),'neutral');
    if(S.tank) q(T('{n}의 집은 '+S.tank.vessel+'입니다. '+(S.tank.filter==='없음'?'여과기는 없고':'여과기는 '+S.tank.filter+'이고')+', 함께 사는 물고기는 '+(S.tank.crowd-1)+'마리.'+(S.tank.crowd>5?' 비좁습니다.':'')),'sub');
    if(S.flags.yard&&!S.smuggled) q(T('{n}의 자리는 마당 한쪽, 1미터 목줄 끝입니다.'),'sub');
  });
}
/* Every step of the story ("한 칸") takes a minute at 1×. The bar under the age shows how much
   of the current step has passed; it is driven here (not by CSS) so it keeps its place when the
   speed changes and simply stops while 정지 is on. */
const STEP=30000;
let nextAt=0,stepDur=0,done=0,frame=null;
function stepText(){const st=$('stepLabel');if(!st||!S)return;const d=S.dt*30.4,span=d<10?Math.max(1,Math.round(d))+'일':d<60?Math.round(d/7)+'주':Math.round(S.dt)+'개월';
  const left=timer?Math.max(0,Math.ceil((nextAt-Date.now())/1000)):null;
  st.textContent='한 칸에 약 '+span+(left!=null?' · 다음 칸까지 '+(left>=60?Math.floor(left/60)+'분'+(left%60?' '+left%60+'초':''):left+'초'):paused?' · 정지':S.waiting?' · 선택을 기다리는 중':'')}
function barDraw(){const b=$('tickFill');if(!b||!b.style)return;const share=timer&&stepDur?clamp(1-(nextAt-Date.now())/stepDur,0,1):done;b.style.transform='scaleX('+share.toFixed(4)+')';const t=b.closest&&b.closest('.tick');if(t&&t.classList)t.classList.toggle('held',!timer)}
function barLoop(){barDraw();stepText();frame=timer&&typeof requestAnimationFrame==='function'?requestAnimationFrame(barLoop):null}
/* done = share of the current step already passed; kept across speed changes, 정지 and choices */
function run(){stop();if(paused||!S||S.done||S.waiting){barDraw();stepText();return}
  stepDur=STEP/speed;nextAt=Date.now()+stepDur*(1-done);
  timer=setTimeout(()=>{timer=null;done=0;barDraw();tick();run()},stepDur*(1-done));
  if(!frame)barLoop();
}
function tickBar(){barDraw()}
function setPlay(){$('playBtn').setAttribute('aria-pressed',String(!paused));$('stopBtn').setAttribute('aria-pressed',String(paused))}
function stop(){if(timer){clearTimeout(timer);timer=null;if(stepDur)done=clamp(1-(nextAt-Date.now())/stepDur,0,.99)}if(frame&&typeof cancelAnimationFrame==='function'){cancelAnimationFrame(frame);frame=null}barDraw()}

/* the reel's sprites are fetched when the page opens, and the reel waits (at most .9s) until the ones it shows are decoded,
   otherwise the first spin showed empty frames */
const SLOTIMG={};
function slotPreload(){if(typeof Image==='undefined')return;Object.keys(FISHART).forEach(id=>{if(SLOTIMG[id])return;const i=new Image();i.decoding='async';i.src=FISH_BASE+id+'-swim.webp';SLOTIMG[id]=i})}
function slotReady(seq){slotPreload();if(typeof Promise==='undefined')return{then:f=>f()};
  const ps=[...new Set(seq.map(s=>s.id))].filter(id=>SLOTIMG[id]).map(id=>{const i=SLOTIMG[id];if(i.complete&&i.naturalWidth)return Promise.resolve();return i.decode?i.decode().catch(()=>{}):new Promise(r=>{i.onload=i.onerror=r})});
  return Promise.race([Promise.all(ps),new Promise(r=>setTimeout(r,900))])}
try{slotPreload()}catch(e){}
/* the species slot: the reel spins through the 23 and slows down on the one that was drawn */
let slotBusy=false;
function spin(){
  if(slotBusy)return;
  /* the pledge is signed by the player: no name, no fish */
  const nk=$('nick');if(nk&&!nk.value.trim()&&!(S&&S.o&&S.o.name)){nk.classList.add('need');$('nickMsg').hidden=false;nk.focus();return}
  const pool=SP.filter(s=>ACTIVE_GROUPS.includes(s.g)), sp=wpick(pool.map(s=>[s,s.w]));
  const box=$('slot'),strip=$('slotStrip'),nm=$('slotName');
  const calm=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!box||!strip||typeof requestAnimationFrame!=='function'){start(sp.id);return}
  slotBusy=true;
  let H=132;const N=calm?1:26,seq=[];for(let i=0;i<N;i++)seq.push(pick(pool));seq.push(sp);
  const img=s=>FISHART[s.id]?'<img alt="" src="'+FISH_BASE+s.id+'-swim.webp">':'';
  strip.innerHTML=seq.map(s=>'<div class="it">'+img(s)+'<span></span></div>').join('');
  strip.querySelectorAll('.it span').forEach((e,i)=>e.textContent=seq[i].name);
  strip.style.transition='none';strip.style.transform='translateY(0)';strip.classList.toggle('fast',!calm);
  nm.className='slot-name';nm.innerHTML='&nbsp;';
  box.classList.remove('out');box.hidden=false;
  H=(strip.firstElementChild&&strip.firstElementChild.offsetHeight)||132;
  let ended=false,t1,t2,t3;
  const land=()=>{if(nm.classList.contains('on'))return;strip.classList.remove('fast');nm.textContent=sp.name;nm.classList.add('on')};
  const finish=()=>{if(ended)return;ended=true;clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);
    strip.style.transition='none';strip.style.transform='translateY('+(-N*H)+'px)';land();
    box.classList.add('out');setTimeout(()=>{box.hidden=true;box.classList.remove('out');slotBusy=false;start(sp.id)},calm?0:420)};
  box.onclick=finish;
  const ready=slotReady(seq);
  ready.then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{if(ended)return;
    strip.style.transition=calm?'none':'transform 2.7s cubic-bezier(.12,.62,.14,1)';
    strip.style.transform='translateY('+(-N*H)+'px)';
    t1=setTimeout(()=>strip.classList.remove('fast'),calm?0:1500);
    t2=setTimeout(land,calm?0:2750);
    t3=setTimeout(finish,calm?700:3900);
  })));
}
$('startBtn').onclick=()=>spin();
$('infoBtn').onclick=()=>{const c=$('card'),on=!c.classList.contains('showinfo');c.classList.toggle('showinfo',on);$('infoBtn').setAttribute('aria-expanded',String(on));$('infoBtn').textContent=on?'정보 ▴':'정보 ▾'};
$('playBtn').onclick=()=>{paused=false;setPlay();run()};
$('stopBtn').onclick=()=>{paused=true;setPlay();stop();stepText()};
/* phones: one button cycles the six speeds; the bar with it stays at the bottom of the screen */
$('speedCycle').onclick=()=>{const L=[1,2,4,8,16,32],nx=L[(L.indexOf(speed)+1)%L.length],b=document.querySelector('[data-speed="'+nx+'"]');if(b)b.click()};
document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{speed=+b.dataset.speed;$('speedCycle').textContent=speed+'×';document.querySelectorAll('[data-speed]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(S&&!S.done&&paused){paused=false;setPlay()}run()});
try{$('nick').value=localStorage.getItem('kiwojuseyo-nick')||''}catch(e){}
/* the sheet carries the signer's name as it is typed */
function nickShow(){const v=$('nick').value.trim();$('sheetOwner').textContent=v?v+' 님의 ':'';if(v){$('nick').classList.remove('need');$('nickMsg').hidden=true}}
$('nick').addEventListener('input',nickShow);nickShow();
$('nick').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();spin()}});
$('skipBtn').onclick=()=>{if(!S||S.done)return;skipping=true;stop();if(S.pending)S.pending.resolve(pick(S.pending.opts));let n=0;while(!S.done&&n++<8000){if(S.pending)S.pending.resolve(pick(S.pending.opts));tick()}skipping=false;stageKey='';render();if($('ending').scrollIntoView)$('ending').scrollIntoView({behavior:'smooth',block:'start'})};

/* 주마등 v2: the old automatic memorial (kiwojuseyo-mem) is cleared once; only lives the player chose to keep are stored */
const KEY='kiwojuseyo-lantern';
let mem=[];try{localStorage.removeItem('kiwojuseyo-mem');mem=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
let memAll=false,memSel=null;
/* entries saved before 주마등 had no story and were stored automatically; they stay, but cannot be replayed */
function storeMem(){mem.forEach((m,i)=>{if(i>=40&&m.story){delete m.story}});try{localStorage.setItem(KEY,JSON.stringify(mem))}catch(e){mem.forEach((m,i)=>{if(i>=12)delete m.story});try{localStorage.setItem(KEY,JSON.stringify(mem))}catch(e2){}};drawMem()}
function saveMem(m){mem.unshift(m);mem=mem.slice(0,200);storeMem()}
/* what 주마등 keeps of one life: the story as it was logged, the broken promises, the end */
function lifeRecord(cat,calm,fact,kept,al,pct){
  let st=(S.story||[]).filter(x=>x.t);
  if(st.length>32){const head=st.slice(0,8),tail=st.slice(-14),mid=st.slice(8,-14),k=mid.length/10;st=head.concat(Array.from({length:10},(_,i)=>mid[Math.floor(i*k)]),tail)}
  const pls=S.preOwner||S.noPledge||S.flags.fac?[]:pledgeList().map((p,i)=>S.pl[i]?{p,n:[S.pl[i]].concat(S.pl[i].more||[]).map(r=>r.note+(r.mended?' → '+r.mended.label:'')),a:ageLabel(S.pl[i].age)}:null).filter(Boolean);
  return {id:S.memId,n:S.name?S.name+' · '+S.sp.name:S.sp.name,sp:S.sp.id,lived:al,pot:ageLabel(S.sp.life),pct,cat,calm:!!calm,
    kept:S.noPledge||S.preOwner||S.flags.fac||S.wild&&!pls.length?null:kept,of:S.pl.length,
    own:S.preOwner?null:S.o.name+(S.f?' · '+FOWN[S.f.own].l:''),path:S.f&&S.f.path.length?S.f.path.join(' → '):S.origin,
    pls,prev:(S.prevPl||[]).filter(p=>p.pls.length),story:st,fact,lw:S.lw||'',fx:S.fx,d:new Date().toISOString().slice(0,10)};
}
function drawMem(){
  const ul=$('memList');ul.innerHTML='';const tools=$('memTools');
  if(!mem.length){$('memSummary').textContent='끝난 생을 남기면 여기에 쌓입니다. 누르면 그 생이 주마등처럼 지나갑니다.';if(tools)tools.hidden=true;return}
  const nat=mem.filter(m=>m.calm).length;
  $('memSummary').textContent='남겨 둔 생 '+mem.length+' · 끝까지 산 생 '+nat+' ('+Math.round(nat/mem.length*100)+'%) · 눌러서 다시 보기';
  if(tools){tools.hidden=false;$('memMore').hidden=mem.length<=8;$('memMore').textContent=memAll?'접기':'모두 보기 ('+mem.length+')'}
  (memAll?mem:mem.slice(0,8)).forEach(m=>{const li=document.createElement('li');
    li.innerHTML='<button type="button" class="mrow"><span></span><span class="c"></span></button><button type="button" class="mdel" aria-label="지우기">×</button>';
    const r=li.firstChild;r.firstChild.textContent=m.n+' · '+m.lived+(m.kept!=null?' · 서약 '+m.kept+'/'+(m.of||5):'')+(m.lw?' — "'+m.lw+'"':'');
    const c=r.lastChild;c.textContent=m.cat;if(m.calm)c.classList.add('calm');r.onclick=()=>replay(m);
    const del=li.lastChild;
    if(memSel===m.id){li.classList.add('asking');del.textContent='지우기';del.setAttribute('aria-label','정말 지우기');del.onclick=()=>{mem=mem.filter(x=>x!==m);memSel=null;storeMem()}}
    else del.onclick=()=>{memSel=m.id;drawMem()};
    ul.appendChild(li)});
}
function memClearAll(){const b=$('memClear');if(!b)return;
  if(b.dataset.ask){mem=[];memSel=null;delete b.dataset.ask;b.textContent='모두 지우기';storeMem();return}
  b.dataset.ask='1';b.textContent='정말 모두 지울까요? 한 번 더 누르세요';setTimeout(()=>{if(b.dataset.ask){delete b.dataset.ask;b.textContent='모두 지우기'}},4000)}
if($('memMore'))$('memMore').onclick=()=>{memAll=!memAll;drawMem()};
if($('memClear'))$('memClear').onclick=memClearAll;
drawMem();

/* ---------- 주마등: a saved life passing by, fast ---------- */
let reelT=null;
function replay(m){
  const box=$('lantern'),film=$('lanFilm'),sum=$('lanSum');if(!box)return;
  clearTimeout(reelT);
  const img=k=>FISHART[m.sp]&&FISHART[m.sp][k]?FISH_BASE+m.sp+'-'+k+'.webp':'';
  $('lanImg').src=img('swim')||'';$('lanImg').className='';
  $('lanName').textContent=m.n;$('lanMeta').textContent=m.lived+' · '+m.cat+(m.d?' · '+m.d:'');
  film.innerHTML='';sum.hidden=true;film.hidden=false;box.hidden=false;
  const calm=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* one line at a time, slow enough to read: about 1.6 s plus 45 ms a character (max 5 s); ❚❚ holds, ◀ ▶ step */
  const lines=m.story||[];let i=0,hold=false;
  const draw=()=>{film.innerHTML='';lines.slice(Math.max(0,i-5),i).forEach((l,k,arr)=>{const p=document.createElement('p');p.className='ln '+(l.c||'')+(k===arr.length-1?' new':'');p.innerHTML='<span class="a"></span><span class="t"></span>';p.firstChild.textContent=l.a;p.lastChild.textContent=l.t;p.style.opacity=Math.max(.15,1-(arr.length-1-k)*.2);film.appendChild(p)});
    $('lanPos').textContent=i+' / '+lines.length};
  const step=()=>{clearTimeout(reelT);
    if(i>=lines.length){showSum();return}
    i++;draw();if(hold)return;
    const l=lines[i-1];reelT=setTimeout(step,calm?0:Math.min(5000,1600+l.t.length*45));
  };
  const ctl=$('lanCtl');ctl.hidden=false;
  $('lanPrev').onclick=e=>{e.stopPropagation();clearTimeout(reelT);i=Math.max(1,i-1);draw();if(!hold)reelT=setTimeout(step,3000)};
  $('lanNext').onclick=e=>{e.stopPropagation();step()};
  $('lanHold').onclick=e=>{e.stopPropagation();hold=!hold;$('lanHold').textContent=hold?'▶ 재생':'❚❚ 멈춤';if(hold)clearTimeout(reelT);else step()};
  $('lanSkip').onclick=e=>{e.stopPropagation();showSum()};
  $('lanHold').textContent='❚❚ 멈춤';
  const showSum=()=>{clearTimeout(reelT);film.hidden=true;ctl.hidden=true;
    if(!m.calm&&img('dead')){$('lanImg').src=img('dead');$('lanImg').className='dead'}
    sum.innerHTML='';
    const add=(h,body,cls)=>{const d=document.createElement('div');d.className='blk '+(cls||'');const t=document.createElement('span');t.className='label';t.textContent=h;d.appendChild(t);body.forEach(b=>d.appendChild(b));sum.appendChild(d)};
    const P=(t,c)=>{const p=document.createElement('p');p.textContent=t;if(c)p.className=c;return p};
    add('어떻게 살았나',[P('온 길: '+m.path),P(m.own?'주인: '+m.own:'주인을 만나기 전이었습니다.'),P('살아낸 시간 '+m.lived+' / 살 수 있던 시간 '+m.pot+' ('+m.pct+'%)')]);
    const endL=(m.story||[]).filter(l=>l.c==='end'||l.c==='bad').slice(-2).map(l=>P(l.t));
    add('어떻게 끝났나',[P(m.cat,'cat '+(m.calm?'calm':''))].concat(endL));
    if(m.pls&&m.pls.length) add('주인이 지키지 못한 서약',m.pls.map(x=>{const d=document.createElement('div');d.className='pl';d.appendChild(P(x.p,'tx'));d.appendChild(P(x.a+' — '+x.n.join(' · '),'note'));return d}),'faults');
    else if(m.own) add('주인이 지키지 못한 서약',[P('없습니다. 끝까지 지켰습니다.','cat calm')]);
    (m.prev||[]).forEach((pv,k)=>add('그 전 주인'+((m.prev.length>1)?' '+(k+1):'')+' · '+pv.o,pv.pls.map(x=>{const d=document.createElement('div');d.className='pl';d.appendChild(P(x.p,'tx'));d.appendChild(P(x.a+' — '+x.n.join(' · '),'note'));return d}),'faults'));
    if(m.lw) add('마지막 한마디',[P('"'+m.lw+'"','lw')]);
    if(m.fact) add('실제로는',[P(m.fact)]);
    sum.hidden=false;
  };
  film.onclick=()=>$('lanHold').click();
  $('lanAgain').onclick=()=>replay(m);
  $('lanClose').onclick=closeReel;
  box.onclick=e=>{if(e.target===box)closeReel()};
  step();
}
function closeReel(){clearTimeout(reelT);const b=$('lantern');if(b)b.hidden=true}
if(typeof document!=='undefined'&&document.addEventListener) document.addEventListener('keydown',e=>{if(e.key==='Escape')closeReel()});
