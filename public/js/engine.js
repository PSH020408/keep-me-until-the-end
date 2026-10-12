let S=null,timer=null,speed=1,paused=false,skipping=false,NICK='';
const HZ=.95;

function makeOwner(nick){
  const sur=pick(['김','이','박','최','정','강','조','윤','장','임','한','오','신']);
  const age=19+Math.floor(R()*48);
  const house=wpick([['원룸',22],['아파트',38],['빌라',18],['마당 있는 주택',12],['시골 주택',10]]);
  const fam=wpick([['1인 가구',35],['부부',22],['아이 있는 가족',30],['부모님과 함께',13]]);
  return {name:nick||sur+'○○',age,house,fam};
}
function newLife(force){
  const sp=force?SP.find(s=>s.id===force):wpick(SP.filter(s=>ACTIVE_GROUPS.includes(s.g)).map(s=>[s,s.w]));
  const nm=R()>(NONAME[sp.g]||0)?pick(NAMES):null;
  let origin=wpick(ORIGIN[sp.g]);
  let smuggled=!!sp.wild;
  if(sp.id==='grey'&&R()<.4) smuggled=true;
  if(sp.id==='star'&&R()<.7) smuggled=true;
  if(smuggled) origin='밀렵 · 밀수';
  let r=clamp((R()+R()+R())/3+(R()-.5)*.3,.03,.97);
  if(/축제|학교 앞|기념품|선물|노점|카페/.test(origin)) r=clamp(r-.15,.03,.97);
  if(/보호소|구조/.test(origin)) r=clamp(r+.15,.03,.97);
  const o=makeOwner(NICK);
  S={sp,origin,smuggled,r,o,interest:1,health:100,size:1,temper:null,
     ageM:({dog:2,cat:2,insect:2,feeder:.5,chick:.1,exotic:4,parrot:3})[sp.g]||1,
     target:sp.life*(.85+R()*.25),dt:sp.life/110,name:nm,disp:nm||sp.name,
     sex:R()<.5?'암컷':'수컷',no:String(1000+Math.floor(R()*9000)),month:Math.floor(R()*12),
     flags:{},once:{},cd:{},seen:{},tick:0,pl:Array(sp.g==='fish'?6:5).fill(null),story:[],queue:[],mem:[],ending:false,done:false,
     owners:1,status:'집',env:'home',wild:false,happyT:0,scaredT:0,fx:null,pred:null,calm:false,mode:typeof MODE_NOW!=='undefined'?MODE_NOW:'real',hMax:100};
  const g=sp.g;
  if(WATER.includes(g)) S.env='tank';
  else if(g==='insect'||g==='crab'||g==='feeder'||g==='chick'||g==='fmouse') S.env='box';
  if(g==='dog'&&/마당|시골/.test(o.house)&&(sp.big||sp.id==='mix'||R()<.3)){S.flags.yard=1;S.env='yard'}
  if(g==='cat'&&(r<.35||/마당|시골/.test(o.house))) S.flags.outdoor=1;
  if((g==='turtle'||g==='reptile'||g==='tortoise')&&r<.5) S.flags.noUVB=1;
  if(g==='amphib'){
    const vessel=r<.35?wpick([['볼어항',3],['30cm 어항',1]]):r<.7?wpick([['30cm 어항',2],['45cm 어항',1]]):wpick([['45cm 어항',1],['60cm 수조',2]]);
    const filter=r<.3?'없음':r<.55?'스펀지 여과기':r<.8?'걸이식 여과기':'외부 여과기';
    const crowd=g==='amphib'?1:clamp(Math.round((1-r)*8*R()+1),1,9);
    S.tank={vessel,filter,crowd,lid:r>.55&&R()<.8};
  }
  S.noPledge=g==='feeder'||g==='fmouse';
  if(g==='fish'&&typeof fishInit==='function') fishInit();
}
const tankText=()=>{const t=S.tank;return `${t.vessel} · 여과기 ${t.filter==='없음'?'없음':t.filter.replace(' 여과기','')} · ${t.crowd>1?t.crowd+'마리'+(t.crowd>5?' (과밀)':''):'혼자'} · 뚜껑 ${t.lid?'있음':'없음'}`};
const tankMult=()=>{if(!S.tank)return 1;const t=S.tank;return ({'없음':1.7,'스펀지 여과기':1,'걸이식 여과기':.8,'외부 여과기':.55}[t.filter])*(t.crowd>5?1.5:t.crowd>3?1.2:1)*(t.vessel==='볼어항'?1.3:1)};
const ownerText=()=>S.noPledge?'먹이로 구매':S.flags.fac?'보호시설 사육사':S.wild?'없음':`${S.o.name} · ${S.o.age}세 · ${S.o.house} · ${S.o.fam}`;
function ageLabel(m){
  if(m<2) return '생후 '+Math.max(1,Math.round(m*4.3))+'주';
  if(m<24) return Math.floor(m)+'개월';
  const y=Math.floor(m/12),mm=Math.floor(m%12);return y+'년'+(mm?' '+mm+'개월':'');
}
const has=(g,a)=>a==='*'||a.includes(g);
const sen=()=>S.ageM/S.sp.life;
const kids=()=>S.o.fam==='아이 있는 가족'?2:1;
const fem=()=>S.sex==='암컷';
const remember=(t,w)=>{S.mem.push({age:S.ageM,t:T(t),w:w||1});S.happyT=3};

/* ---------- endings, branches ---------- */
const stageOf=()=>{const x=S.ageM/S.sp.life;return x<.15?'baby':x>.72?'senior':'adult'};
function newOwner(text,from,rf,opt){
  q(text,'good',()=>{
    S.owners++;S.o=makeOwner();S.r=clamp((R()+R())/2,.05,.95);S.interest=1;S.status='집';S.flags.cafeLife=0;S.wild=false;
    S.env=WATER.includes(S.sp.g)?'tank':'home';S.flags.yard=0;
    if(opt&&opt.yard&&S.sp.g==='dog'){S.flags.yard=1;S.env='yard';S.o.house='시골 주택'}
    S.pl=S.pl.map(()=>null);drawPledges($('gamePledges'),true);
    remember(from||'새 가족이 생겼다. 다시 이름을 불러 주는 사람이 생겼다.',1.5);render();
    if(rf) askReflect(rf);
  });
}
/* 소감: the player writes, in the animal's voice, how an unforgettable moment felt */
function askReflect(rf,cb){
  if(skipping||!rf){if(cb)cb();return}
  stop();S.waiting=true;
  const box=$('choice');box.innerHTML='';box.hidden=false;if(box.classList){box.classList.toggle('crisis',/살아남기/.test(c.who||''));box.classList.toggle('train',/육성/.test(c.who||''))}
  const done=text=>{
    S.pending=null;S.waiting=false;box.hidden=true;
    text=(text||'').trim().slice(0,80);
    if(text){addLog(S.disp+'의 소감: "'+text+'"','good');S.mem.push({age:S.ageM,t:'"'+text+'"',w:2.4,user:true})}
    if(cb)cb();render();if(!skipping)run();
  };
  S.pending={opts:[''],resolve:()=>done('')};
  const who=document.createElement('span');who.className='who';who.textContent='잊을 수 없는 사건 · '+S.disp+'의 소감';
  const p=document.createElement('p');p.className='prompt';p.textContent=T(rf.p);
  const ta=document.createElement('textarea');ta.id='reflectText';ta.maxLength=80;ta.rows=2;ta.placeholder=rf.ph||'한 줄로 남겨 주세요';
  const row=document.createElement('div');row.className='row';
  const ok=document.createElement('button');ok.className='btn';ok.textContent='남기기';ok.onclick=()=>done(ta.value);
  const no=document.createElement('button');no.className='btn ghost';no.textContent='넘어가기';no.onclick=()=>done('');
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();done(ta.value)}});
  row.append(ok,no);box.append(who,p,ta,row);
  if(box.scrollIntoView&&!(document.body&&document.body.classList&&document.body.classList.contains('ingame')))box.scrollIntoView({block:'nearest',behavior:'smooth'});
  if(ta.focus)setTimeout(()=>ta.focus(),50);
}
function familyOutcome(){
  const g=S.sp.g;
  const o=wpick([['keep',40],['sell',25],['shelter',['dog','cat'].includes(g)?15:0],['dump',20]]);
  if(o==='keep') return newOwner(T('유족 중 한 명이 {n}을 맡기로 했습니다. 서약서는 새로 쓰였습니다.'),'주인이 떠난 뒤, 주인의 가족이 나를 데려갔다. 주인 냄새가 조금 남아 있었다.',{p:'주인이 다시는 돌아오지 않는다는 걸 알게 된 날.',ph:'예) 오늘도 현관을 본다'});
  if(o==='sell') return newOwner(T('유족은 {n}을 어떻게 해야 할지 몰라 중고거래 앱에 올렸습니다. 사흘 만에 낯선 사람이 데려갔습니다.'));
  if(o==='shelter'){q(T('유족은 {n}을 보호소에 데려다주었습니다.'),'sub');return toShelter('abandon')}
  q(T(g==='parrot'||g==='bird'?'유족은 "새니까 날아가서 살겠지"라며 창문을 열고 {n}을 내보냈습니다.':g==='turtle'||g==='fish'?'유족은 {n}을 근처 하천에 쏟아 버렸습니다.':'유족은 {n}을 근처 공원 풀숲에 놓고 갔습니다.'),'sub');
  q(null,null,()=>goWild(g==='parrot'||g==='bird'?'sky':g==='turtle'||g==='fish'?'river':g==='dog'||g==='cat'?'street':'park'));
}
function aloneChoice(){
  const g=S.sp.g, loud=g==='dog'?'문을 긁으며 크게 짖는다':g==='cat'?'현관문 앞에서 목이 쉬도록 운다':BIRDS.includes(g)?'목이 터지도록 운다':'케이지를 마구 긁는다';
  return {p:'주인이 사흘째 돌아오지 않는다. 밥그릇은 비었다. 나는…',o:[
    {l:'현관 앞에서 조용히 기다린다',r:'{n}은 현관 앞에 엎드려 열쇠 소리를 기다렸습니다.',c:'neutral',days:9,m:'마지막까지 현관을 지켰다.',mw:1.4},
    {l:loud,r:'{n}의 소리를 들은 옆집 사람이 관리사무소에 연락했습니다.',c:'neutral',days:3},
    {l:'찬장을 뒤져 먹을 걸 찾는다',r:'{n}은 찬장 아래 사료 봉지를 뜯어 조금씩 아껴 먹었습니다.',c:'neutral',days:7,food:1}]};
}
function endLife(lines,cat,fact,pl,calm,fx,pred){
  S.ending=true;
  lines.forEach((l,i)=>q(l,i===lines.length-1?'end':(i===0?(calm?'sub':'bad'):'sub'),i===0&&pl?()=>pl.forEach(p=>breakP(p[0],p[1])):null));
  q(null,null,()=>{S.fx=fx||(calm?'ghost':'sickdead');S.endCat=cat;S.gag=null;S.pred=pred||null;S.calm=!!calm;showEnd(cat,typeof fact==='function'?fact():fact,calm)});
}
function fireEnd(e,bonus){
  if(typeof e==='string') e=ENDS.find(x=>x.id===e);
  if(!e) return;
  if(e.branch){runBranch(e.branch);return}
  const lines=e.text();
  const saveP=e.save?clamp(.12+.6*S.r+(bonus||0),0,.9):0;
  if(R()<saveP){
    S.cd[e.id]=S.tick+15;S.health=clamp(S.health-22,5,100);S.scaredT=2;
    q(lines[0],'bad');q(T(e.save),'good',e.saveFx||null);return;
  }
  if(e.wild){
    lines.forEach((l,i)=>q(l,i===0?'bad':'sub',i===0&&e.pl?()=>e.pl.forEach(p=>breakP(p[0],p[1])):null));
    q(null,null,()=>goWild(e.wild));return;
  }
  endLife(lines,e.cat,e.fact,e.pl,false,e.fx,e.pred);
}
function runBranch(kind){
  const g=S.sp.g;
  if(kind==='flush'){
    q(T('{n}이 지느러미를 접고 바닥에 가라앉아 있었습니다.'),'bad',()=>breakP(1,'산 채로 변기에 버림'));
    q('주인은 어차피 죽을 거라며 뜰채로 건져 변기에 넣고 물을 내렸습니다.','sub');
    if(R()<.06){q(T('빙글빙글 돌며 하수관을 지난 {n}은 며칠 뒤 하수처리장 방류구로 뱉어졌습니다. 기적처럼, 아직 살아 있었습니다.'),'sub');q(null,null,()=>goWild('river'));return}
    return endLife([T('그때 {n}은 아직 아가미를 움직이고 있었습니다. 빙글빙글 도는 물이 {n}을 어둠 속으로 데려갔습니다.')],'학대',F.neglectFish,null,false,'flush');
  }
  if(kind==='rehome'){
    q(T(pick(['주인이 "사정이 생겨서"라며 {n}을 중고거래 앱에 무료 분양 글로 올렸습니다.','주인이 {n}을 SNS 분양 카페에 "책임비 5만 원"으로 내놓았습니다.','주인이 {n}을 펫숍에 되팔았습니다.','주인이 회사 동료에게 {n}을 떠넘기듯 보냈습니다.'])),'bad',()=>breakP(0,'파양'));
    const o=wpick([['good',40],['vanish',16],['hoarder',12],['country',['dog','cat'].includes(g)?14:0],['back',14]]);
    if(o==='vanish'){q(T('{n}을 데려간 사람은 며칠 뒤 연락이 끊겼습니다. 같은 사람이 여러 동물을 "무료로" 데려가고 있었습니다.'),'sub');return endLife([T('{n}의 행방은 끝내 알 수 없었습니다.')],'파양',F.abandon,null,false,'gone')}
    if(o==='hoarder'){q(T('{n}을 데려간 사람의 집에는 이미 개와 고양이가 마흔 마리 넘게 있었습니다.'),'sub');return endLife(['좁은 방에 배설물이 쌓여 갔고, 먹이는 늘 모자랐습니다.',T('몇 달 뒤 구조대가 문을 열었을 때 {n}은 이미 움직이지 않았습니다.')],'방치',F.hoarder,null,false,'starve')}
    if(o==='country') return newOwner(T('{n}은 시골 친척 집으로 보내졌습니다.'),null,null,{yard:1});
    if(o==='back') return newOwner(T('{n}은 펫숍 진열장으로 돌아갔습니다. 몇 주 뒤 다른 사람이 {n}을 사 갔습니다.'));
    return newOwner(T('새 주인이 {n}을 데려갔습니다. 서약서는 새로 쓰였습니다.'),null,{p:'낯선 집, 낯선 냄새. 두 번째 집에 온 첫날.',ph:'예) 이번엔 끝까지일까?'});
  }
  if(kind==='heir'){
    q('주인이 세상을 떠났습니다. 장례식장에서 아무도 '+josa(S.disp,'을')+' 기억하지 못했습니다.','bad');
    return familyOutcome();
  }
  if(kind==='ownergone'){
    const old=S.o.age+S.ageM/12>65;
    q(T(old?'어느 날 아침, 주인이 부엌에서 쓰러졌습니다. 구급차가 왔지만 아무도 {n}을 챙기지 못했습니다.':pick(['어느 날 아침, 출근길에 나선 주인이 교통사고를 당했습니다. 주인은 집으로 돌아오지 못했습니다.','주인이 출장지에서 갑자기 쓰러졌습니다. 주인은 돌아오지 못했습니다.','주인이 등산을 갔다가 실족했습니다. 주인은 돌아오지 못했습니다.'])),'bad');
    q(T('현관문은 잠겨 있었습니다. 집에 남은 건 {n}뿐이었습니다.'),'sub',()=>{S.interest=.05;S.status='홀로 남음'});
    if(!['dog','cat','parrot','bird','rabbit','ferret','exotic'].includes(g)){
      if(R()<.5) return endLife(['며칠, 그리고 몇 주. 아무도 오지 않았습니다.',T('유족이 집을 정리하러 왔을 때 {n}은 이미 숨져 있었습니다.')],'홀로 남음',F.alone,null,false,g==='fish'?'bellyup':'starve');
      q(T('열흘 뒤 집을 정리하러 온 유족이 {n}을 발견했습니다. 물도 먹이도 거의 바닥나 있었습니다.'),'sub',()=>{S.health=Math.max(8,S.health-40)});
      q(null,null,familyOutcome);return;
    }
    q(null,null,()=>askChoice(aloneChoice(),o=>{
      const loss=o.days*(o.food?3:6);
      if(S.health-loss<=0||(o.days>8&&R()<.25)) return endLife([T('아무도 오지 않았습니다. {n}은 현관 쪽을 바라본 채 숨을 거두었습니다.')],'홀로 남음',F.alone,null,false,'starve');
      S.health=clamp(S.health-loss,5,100);
      q(T(o.days+'일째 되는 날, 현관문이 열렸습니다. 주인이 아니라 주인의 가족이었습니다.'),'sub');
      q(null,null,familyOutcome);
    }));
    return;
  }
  if(kind==='cafe'){
    S.flags.cafeDone=1;
    q('야생동물 카페 영업 금지 유예기간이 끝나 갑니다. 카페는 동물들을 처분할 곳을 찾습니다.','bad');
    const o=wpick([['fac',35],['sell',40],['dump',25]]);
    if(o==='fac'){q(T('{n}은 정부 보호시설로 옮겨졌습니다. 좁지만, 더 이상 손님 손에 들리지 않습니다.'),'good',()=>{S.flags.fac=1;S.flags.cafeLife=0;S.r=.85;S.interest=.85;S.status='보호시설';S.env='facility';drawPledges($('gamePledges'),true);render()});return}
    if(o==='sell') return newOwner(T('{n}은 개인에게 헐값에 팔렸습니다.'));
    q(T('카페 주인은 문을 닫던 밤 {n}을 야산에 풀었습니다.'),'sub');q(null,null,()=>goWild('mountain'));return;
  }
  if(kind==='abandon'){
    if(g==='dog'||g==='cat'){
      q(T(pick(['주인은 고속도로 휴게소에서 {n}을 내려놓고 차를 몰고 떠났습니다.','이삿날, {n}은 빈집에 남겨졌습니다.','주인은 공원에서 {n}의 목줄을 풀고 돌아섰습니다.','"좋은 사람 만나." 주인은 시골길에 {n}을 내려 주었습니다.'])),'bad',()=>{breakP(0,'버림');S.env=g==='dog'?'street':'park';S.status='버려짐';render()});
    } else {
      const L={bird:'"새니까 밖에서도 잘 살겠지." 주인은 창문을 열고 {n}을 날려 보냈습니다.',parrot:'주인은 새장 문을 열고 {n}을 베란다 밖으로 내보냈습니다.',reptile:'감당하기 어려워진 주인은 밤에 공원 풀숲에 {n}을 풀어 주었습니다.',snake:'감당하기 어려워진 주인은 밤에 공원 풀숲에 {n}을 풀어 주었습니다.',tortoise:'주인은 {n}을 공원 잔디밭에 두고 갔습니다.',exotic:'주인은 {n}을 야산 입구에 풀었습니다.'}[g]||pick(['주인은 케이지 문을 열고 {n}을 공원 풀밭에 털어 냈습니다.','"자연에서 사는 게 더 행복할 거야." 주인은 공원 풀밭에 {n}을 풀어 주었습니다.']);
      q(T(L),'bad',()=>breakP(0,'버림'));
      q(null,null,()=>goWild(g==='bird'||g==='parrot'?'sky':g==='exotic'?'mountain':'park'));return;
    }
  } else {
    q(T(g==='dog'?'산책 중 목줄이 풀렸습니다. 놀란 {n}이 차도 쪽으로 뛰어갔습니다.':'닫는 걸 잊은 중문 틈으로 {n}이 빠져나갔습니다.'),'bad',()=>{breakP(3,'놓침');S.env='street';S.status='실종';render()});
  }
  const rf=kind==='abandon'?{p:'주인이 떠난 자리. 버려진 날.',ph:'예) 금방 데리러 올 거야'}:null;
  q(null,null,()=>askReflect(rf,()=>askChoice(looseChoice(kind),o=>afterLoose(kind,o))));
}
function looseChoice(kind){
  const g=S.sp.g;
  if(kind==='lost') return {p:'정신없이 달리다 보니 모르는 골목이다. 집 냄새가 나지 않는다. 나는…',o:[
    {l:'냄새를 따라 집을 찾아간다',r:'{n}은 냄새를 따라 밤새 골목을 헤맸습니다.',c:'neutral',homeP:.3,rescue:.6},
    {l:'한자리에 웅크려 기다린다',r:'{n}은 상가 앞 화분 옆에 웅크리고 기다렸습니다.',c:'neutral',rescue:.85},
    {l:'지나가는 사람에게 다가간다',r:'{n}은 지나가는 사람에게 다가가 다리에 몸을 비볐습니다.',c:'neutral',rescue:tm('shy')?.6:.9}]};
  if(g==='cat') return {p:'낯선 곳에 혼자 남았다. 차 소리, 사람 소리. 나는…',o:[
    {l:'자동차 밑으로 숨는다',r:'{n}은 주차된 차 밑에 숨어 며칠을 버텼습니다.',c:'neutral',rescue:.45},
    {l:'크게 울며 사람을 찾는다',r:'{n}은 목이 쉬도록 울었습니다. 근처 주민이 그 소리를 들었습니다.',c:'neutral',rescue:.8},
    {l:'담장을 넘어 멀리 간다',r:'{n}은 담장을 넘어 낯선 동네로 사라졌습니다.',c:'neutral',rescue:.3}]};
  return {p:'차 문이 닫혔다. 엔진 소리가 멀어진다. 나는…',o:[
    {l:'차를 쫓아 달린다',r:'{n}은 멀어지는 차를 따라 도로 위를 달렸습니다. 차는 서지 않았습니다.',c:'bad',rescue:.45,road:1},
    {l:'그 자리에서 주인을 기다린다',r:'{n}은 주인이 내려 준 자리에서 사흘을 기다렸습니다. 주인은 오지 않았습니다.',c:'neutral',rescue:.75},
    {l:'지나가는 사람에게 다가간다',r:'{n}은 지나가는 사람들에게 꼬리를 흔들며 다가갔습니다.',c:'neutral',rescue:tm('shy')?.55:.88}]};
}
function afterLoose(kind,ch){
  if(ch.homeP&&R()<ch.homeP){q(T('사흘 밤낮을 헤맨 끝에 {n}은 집 앞 골목에 도착했습니다. 주인이 맨발로 뛰어나왔습니다.'),'good',()=>{S.status='집';S.env='home';S.interest=1;remember('사흘을 헤매다 집 앞에 도착했다. 주인이 맨발로 뛰어나왔다.',2);render()});return}
  if(ch.road&&R()<.4) return endLife([T('갓길을 달리던 {n} 옆으로 화물차가 지나갔습니다.')],'사고',F.street,null,false,'flat');
  if(R()>ch.rescue){q(T('{n}을 데려가는 사람은 없었습니다. 그날부터 길이 {n}의 집이 되었습니다.'),'sub');q(null,null,()=>goWild('street'));return}
  toShelter(kind);
}
function toShelter(kind){
  q(T('{n}은 구조되어 지자체 동물보호센터에 들어갔습니다. 공고 기간은 10일입니다.'),'sub',()=>{S.status='보호소';S.env='shelter';S.wild=false;render();askChoice(shelterChoice(),s=>shelterRoll(kind,s))});
}
function shelterChoice(){
  const dog=S.sp.g==='dog';
  return {p:'철창 앞에 낯선 사람이 멈춰 섰다. 나는…',o:[
    {l:dog?'꼬리를 흔들며 철창 앞으로 간다':'철창에 몸을 비비며 운다',r:'그 사람은 한참 {n} 앞에 쪼그려 앉아 있었습니다.',c:'neutral',adopt:1.7,euth:1},
    {l:'구석에서 몸을 웅크린다',r:'{n}은 구석에서 얼굴을 묻었습니다. 그 사람은 다음 칸으로 걸어갔습니다.',c:'neutral',adopt:.6,euth:1.1},
    {l:dog?'겁이 나서 짖는다':'하악질을 한다',r:'직원이 {n}의 카드에 "공격성 있음"이라고 적었습니다.',c:'bad',adopt:.35,euth:1.6}]};
}
function shelterRoll(kind,s){
  const g=S.sp.g;
  const back=kind==='lost'?(S.flags.registered?.55:.12):0;
  const ad=s.adopt*(tm('friendly')?1.5:tm('shy')?.7:1), eu=s.euth*(tm('feisty')?1.3:1);
  const o=wpick([['return',back*100],['adopt',25*ad],['natural',27.5],['euth',18.5*eu],['other',g==='cat'?12:6]]);
  if(o==='return'){q(T(S.flags.registered?'등록칩 덕분에 주인에게 연락이 갔습니다. {n}은 집으로 돌아왔습니다.':'주인이 보호센터 공고를 보고 {n}을 찾으러 왔습니다.'),'good',()=>{S.status='집';S.env='home';remember('철창 앞에 익숙한 냄새가 나타났다. 주인이었다.',2);render()});return}
  if(o==='adopt'){S.flags.registered=1;S.flags.neutered=1;return newOwner(T('공고 기간이 끝나 갈 무렵, 한 가족이 {n}을 입양했습니다. 새 서약서에 서명했습니다.'),'철창 밖으로 나를 안아 든 손. 새 가족이 생겼다.',{p:'보호소 철창을 나와 새 집으로 가는 날.',ph:'예) 이번엔 끝까지일까?'})}
  if(o==='natural') return endLife([T('좁은 견사에 전염병이 돌았습니다. {n}은 입양 공고 사진이 올라간 채로 보호소 바닥에서 숨졌습니다.')],'유기',F.abandon,null,false,'sickdead');
  if(o==='euth') return endLife(['공고 기간이 지났고, 보호센터는 이미 정원을 넘었습니다.',T('{n}은 인도적 처리, 곧 안락사되었습니다. 마지막으로 주사를 놓은 직원이 {n}의 머리를 쓰다듬었습니다.')],'유기',F.abandon,null,false,'cage');
  if(g==='cat'){q(T('{n}은 중성화 수술 후 발견된 동네에 다시 방사되었습니다.'),'sub');q(null,null,()=>goWild('street'));return}
  return endLife([T('{n}은 입양되지 못한 채 보호소에서 계속 지내고 있습니다. 그 뒤의 기록은 없습니다.')],'유기',F.abandon,null,false,'cage');
}

/* ---------- wild life ---------- */
const WILD_LABEL={river:'하천',lake:'공원 호수',park:'공원',mountain:'야산',sky:'도시 하늘',street:'길 위'};
function goWild(env){
  const w=wildOf();
  S.wild=true;S.env=env;S.status='야생 · '+WILD_LABEL[env];S.interest=0;S.flags.cafeLife=0;S.cd.pred=S.tick+3;
  const intro={
    river:w.cold<.2?'{n}은 처음 보는 넓은 물에서 이리저리 헤엄쳤습니다. 물은 어항보다 훨씬 차가웠고, 열대에서 온 몸은 벌써 둔해지고 있었습니다.':'{n}은 흙탕물 속에서 처음으로 끝이 보이지 않는 물을 만났습니다. 유리벽은 없었습니다. 그 대신 그림자들이 있었습니다.',
    lake:'{n}은 호수 위를 둥둥 떠다녔습니다. 날개가 있었지만 날 줄은 몰랐습니다.',
    park:'{n}은 풀숲 속에서 처음으로 바람 냄새를 맡았습니다. 밥그릇은 어디에도 없었습니다.',
    mountain:'어두운 산은 조용했습니다. {n}은 낙엽 밑으로 몸을 숨겼습니다.',
    sky:'{n}은 아파트 사이를 날았습니다. 내려앉을 새장은 어디에도 없었습니다.',
    street:'{n}의 첫날 밤은 편의점 불빛 아래 쓰레기봉투 옆이었습니다.'}[env];
  addLog(T(intro),'sub');render();
}
function wildTick(){
  const w=wildOf(),g=S.sp.g,dt=S.dt;
  S.tick++;S.ageM+=dt;
  const prevM=Math.floor(S.month);S.month+=dt;
  if(S.happyT>0)S.happyT--;if(S.scaredT>0)S.scaredT--;if(S.gag&&--S.gag.t<=0)S.gag=null;
  const forage=clamp(w.forage+(tm('curious')?.1:0)+(tm('glutton')?.05:0),0,1);
  S.health=clamp(S.health+(R()<forage?5:-7*(tm('glutton')?.7:1)),0,100);
  if(w.grow>1&&S.size<w.grow) S.size=Math.min(w.grow,S.size+.012*forage*(tm('glutton')?1.3:1)*(110/ (S.sp.life/S.dt)));
  const mo=Math.floor(S.month)%12, winter=[11,0,1].includes(mo);
  if(winter&&(prevM%12===10||!S.flags.winterChecked)&&S.flags.winterYear!==Math.floor(S.month/12)){
    S.flags.winterYear=Math.floor(S.month/12);S.flags.winterChecked=1;
    // the first winter is the real test; animals that got through it are acclimatised
    const base=S.flags.wintered?1-(1-w.cold)*.12:w.cold;
    const p=base*(.55+.45*S.health/100)+(S.flags.wintered&&w.cold>.5?.2:0);
    S.flags.wintered=1;
    if(R()>p){
      const lines=WATER.includes(g)||S.env==='lake'?[T('겨울이 왔습니다. 물이 얼음장처럼 차가워졌습니다.'),T(w.cold<.2?'열대에서 온 {n}의 몸은 점점 굳어 갔습니다. 얼음 아래에서 {n}은 천천히 가라앉았습니다.':'{n}은 얼음 밑 바닥에서 움직이지 않게 되었습니다.')]:[T('첫눈이 내렸습니다.'),T(w.cold<.2?'따뜻한 곳에서 온 {n}에게 한국의 겨울은 너무 길었습니다. {n}은 낙엽 밑에서 꽁꽁 언 채 발견되었습니다.':'{n}은 추위를 피할 곳을 찾지 못했습니다. 아침, 서리가 {n}의 털을 하얗게 덮었습니다.')];
      return endLife(lines,'동사',w.cold<.2?F.tropical:F.release,null,false,'freeze');
    }
    S.health=clamp(S.health-15,5,100);
    addLog(T(WATER.includes(g)?'겨울이 왔습니다. {n}은 바닥 진흙 근처에서 꼼짝 않고 겨울을 버텼습니다.':'겨울이 왔습니다. {n}은 몸을 웅크리고 겨울을 버텼습니다.'),'sub');
    remember(WATER.includes(g)?'얼음 아래에서 첫 겨울을 버텼다.':'첫 겨울을 버텼다. 봄 냄새가 났다.',1.2);
    render();return;
  }
  if(!winter) S.flags.winterChecked=0;
  if(S.health<=0){
    return endLife([T(WATER.includes(g)?'먹이를 찾지 못한 {n}은 점점 가늘어졌습니다.':'며칠째 아무것도 먹지 못했습니다.'),T('{n}은 마지막까지 먹이를 찾다가 멈췄습니다.')],'굶주림',w.cold<.2?F.tropical:F.predator,null,false,'starve');
  }
  if(S.ageM>=S.target) return wildSurvived();
  // street hazards
  if(w.med==='street'){
    if(R()<1-Math.exp(-.012*tmod('road')*dt)) return endLife([T('{n}은 길을 건너다 멈칫했습니다. 헤드라이트가 다가왔습니다.'),T('다음 날 아침 도로 위에는 납작한 털뭉치만 남아 있었습니다.')],'사고',F.street,null,false,'flat');
    if(R()<1-Math.exp(-.02*dt)){q(T('구청 포획 틀에서 고기 냄새가 났습니다. 철컥, 문이 닫혔습니다.'),'bad');toShelter('abandon');render();return}
  }
  // predators
  if(w.pred>0&&!(S.cd.pred>S.tick)){
    const rate=w.pred*(S.size>1.3?.5:1)*(tm('shy')?.8:1);
    if(R()<1-Math.exp(-rate*dt*1.4)){S.cd.pred=S.tick+5;askChoice(predChoice(pick(w.preds)));render();return}
  }
  // rescue
  if(['park','sky','street','lake'].includes(S.env)&&R()<.012*(tm('friendly')?2.2:tm('shy')?.4:1)){
    if(w.med==='street'&&R()<.5){q(T('한 사람이 쪼그려 앉아 손을 내밀었습니다. {n}은 그 손 냄새를 맡았습니다.'),'good');toShelter('abandon');render();return}
    newOwner(T('한 사람이 {n}을 조심스럽게 품에 안아 올렸습니다. 그 사람의 집으로 갔습니다.'),'떨고 있던 나를 누군가 품에 안아 올렸다. 따뜻했다.');render();return;
  }
  if(R()<.38){
    const pool=WILD_FLAV.filter(f=>has(w.med,f.m)&&(!f.when||f.when())&&!(S.cd['w'+f.i]>S.tick)&&(!f.once||!S.once['w'+f.i]));
    if(pool.length){const f=pick(pool);S.cd['w'+f.i]=S.tick+12;if(f.once)S.once['w'+f.i]=1;if(f.fx)f.fx();addLog(T(typeof f.t==='function'?f.t():f.t),f.c);if(f.mm)remember(f.mm,f.mw||1)}
  }
  render();
}
const WILD_FLAV=[
 {m:['water'],t:'장마철 불어난 물에 {n}은 하류까지 떠밀려 갔습니다. 콘크리트 보에 몸을 몇 번이나 부딪쳤습니다.',c:'bad',fx:()=>{S.health-=12}},
 {m:['water'],t:'가뭄으로 물이 줄어 {n}은 작은 웅덩이에 갇혔습니다. 물이 하루하루 줄어듭니다.',c:'bad',fx:()=>{S.health-=10}},
 {m:['water'],t:'물살 느린 여울에서 실지렁이를 실컷 먹었습니다.',c:'good',fx:()=>{S.health+=8},mm:'처음으로 내 힘으로 먹이를 찾아 배불리 먹었다.'},
 {m:['water'],when:()=>S.sp.carassius,t:'토종 붕어 떼 사이에 섞여 헤엄쳤습니다. 아무도 {n}이 금붕어였다는 걸 몰랐습니다.',c:'good',mm:'붕어 떼 사이에 섞여 헤엄쳤다. 처음으로 무리가 생겼다.',mw:1.3},
 {m:['water'],when:()=>S.sp.carassius||S.sp.id==='slider',t:'{n}은 개구리 알 무더기를 먹어 치웠습니다. 그해 그 웅덩이에서는 올챙이가 거의 나오지 않았습니다.',c:'neutral',fx:()=>{S.health+=6}},
 {m:['water'],t:'하수구에서 거품 섞인 물이 흘러나왔습니다. 아가미가 따가웠습니다.',c:'bad',fx:()=>{S.health-=8}},
 {m:['water'],t:'아이들이 뜰채로 {n}을 쫓았습니다.',c:'bad',fx:()=>{S.scaredT=2}},
 {m:['water'],once:1,when:()=>S.sp.carassius&&S.size>1.35,t:'{n}은 어느새 팔뚝만 하게 자랐습니다. 주황색 비늘은 누렇게 바랬고, 이제 왜가리도 쉽게 덤비지 못합니다.',c:'good',mm:'몸이 커졌다. 이제 그림자가 무섭지 않다.',mw:1.2},
 {m:['water'],when:()=>S.sp.id==='slider',t:'햇볕 좋은 바위 위에서 다른 붉은귀거북 열두 마리가 줄지어 일광욕을 하고 있었습니다. {n}도 그 끝에 올라갔습니다.',c:'good',mm:'바위 위 햇볕. 처음 보는 친구들.',mw:1.2},
 {m:['water'],when:()=>S.sp.carassius&&S.size>1.3&&!S.flags.angled,t:'낚싯바늘에 꿴 지렁이가 눈앞에서 흔들립니다.',c:'neutral',fx:()=>{S.flags.angled=1;q(null,null,()=>askChoice(anglerChoice()))}},
 {m:['pond'],t:'공원에 산책 나온 사람들이 {n}에게 빵을 던져 주었습니다.',c:'good',fx:()=>{S.health+=5},mm:'사람들이 던져 준 빵 조각.'},
 {m:['pond'],t:'밤이 되자 호숫가 덤불에서 바스락거리는 소리가 났습니다.',c:'bad',fx:()=>{S.scaredT=2}},
 {m:['land'],t:'벤치 밑 과자 부스러기로 하루를 버텼습니다.',c:'neutral',fx:()=>{S.health+=3}},
 {m:['land'],t:'누군가 길고양이에게 놓아둔 사료 그릇을 몰래 먹었습니다.',c:'good',fx:()=>{S.health+=8},mm:'누군가의 사료 그릇. 오랜만에 배불렀다.'},
 {m:['land','street'],t:'밤새 비가 내렸습니다. 숨을 곳이 없었습니다.',c:'bad',fx:()=>{S.health-=10}},
 {m:['land'],t:'까치 두 마리가 머리 위를 맴돌았습니다.',c:'bad',fx:()=>{S.scaredT=2}},
 {m:['land'],t:'산책하던 아이가 {n}을 가리켰지만, 엄마가 손을 잡아끌었습니다.',c:'neutral'},
 {m:['land'],when:()=>S.sp.id==='raccoon',t:'{n}은 농가 닭장 철망을 뜯고 들어가 달걀을 먹었습니다. 마을에 포획 틀이 설치되었습니다.',c:'neutral',fx:()=>{S.health+=10;S.flags.trap=(S.flags.trap||0)+1;if(S.flags.trap>1&&R()<.5)q(null,null,()=>endLife([T('포획 틀 속 닭고기 냄새를 따라 들어간 {n} 뒤로 철문이 닫혔습니다.'),T('생태계 위해 우려가 있다는 이유로 {n}은 안락사되었습니다.')],'포획',F.raccoon,null,false,'cage'))}},
 {m:['air'],t:'비둘기 무리 틈에 끼어 공원 바닥의 빵조각을 주웠습니다.',c:'neutral',fx:()=>{S.health+=5}},
 {m:['air'],t:'{n}은 유리창에 비친 하늘을 향해 날다 쾅 부딪혔습니다.',c:'bad',fx:()=>{S.health-=20;if(S.health<=0)q(null,null,()=>endLife([T('{n}은 아파트 화단에 떨어진 채 다시 날아오르지 못했습니다.')],'추락',F.predator,null,false,'fall'))}},
 {m:['air'],t:'베란다 난간에 앉아 쉬던 {n}을 한 아이가 발견하고 손을 흔들었습니다.',c:'good',mm:'베란다의 아이가 손을 흔들었다.'},
 {m:['street'],t:'동네 할머니가 매일 같은 시간에 밥을 놓아 주었습니다.',c:'good',fx:()=>{S.health+=10},mm:'매일 같은 시간에 밥을 놓아 주던 할머니.',mw:1.6},
 {m:['street'],t:'편의점 앞 쓰레기봉투를 뒤졌습니다. 닭 뼈가 목에 걸릴 뻔했습니다.',c:'bad',fx:()=>{S.health+=2}},
 {m:['street'],when:()=>S.sp.g==='dog',t:'다른 떠돌이 개들과 무리를 지었습니다. 주민 신고가 늘었습니다.',c:'neutral',mm:'나 같은 개들을 만났다. 혼자가 아니었다.'},
 {m:['street'],when:()=>S.sp.g==='cat'&&[11,0,1].includes(Math.floor(S.month)%12),t:'자동차 보닛 아래가 따뜻합니다.',c:'neutral',fx:()=>{q(null,null,()=>askChoice({p:'자동차 보닛 아래 엔진이 아직 따뜻하다. 나는…',o:[{l:'엔진룸 안으로 들어가 몸을 녹인다',r:'{n}은 엔진룸 깊숙이 몸을 말았습니다.',c:'bad',fx:()=>{if(R()<.5)endLife([T('아침, 차 주인은 보닛을 두드리지 않고 시동을 걸었습니다.'),T('엔진 소리 사이로 짧은 울음이 섞였습니다.')],'사고','겨울철 길고양이는 따뜻한 엔진룸에 자주 들어갑니다. 시동 걸기 전 보닛을 두드리는 것만으로 생명을 구할 수 있습니다.',null,false,'gone');else say('아침에 차 주인이 보닛을 쾅쾅 두드렸습니다. {n}은 화들짝 놀라 뛰쳐나왔습니다.','good')}},{l:'상가 계단 밑으로 간다',r:'{n}은 계단 밑 박스 안에서 몸을 웅크렸습니다.',c:'neutral'}]}))}},
];
WILD_FLAV.forEach((f,i)=>f.i=i);
function predChoice(pred){
  const w=wildOf(),med=w.med==='pond'?'land':w.med;
  const P={heron:'물 위로 길쭉한 그림자가 드리운다. 부리 끝이 반짝인다.',catfish:'바닥 진흙이 꿈틀거린다. 수염 달린 커다란 입이 다가온다.',bass:'커다란 입을 가진 물고기가 빠르게 다가온다.',cat:'덤불 너머에서 노란 눈 두 개가 나를 본다.',straydog:'낮게 으르렁거리는 소리. 떠돌이 개들이 다가온다.',magpie:'까치 떼가 시끄럽게 몰려온다.',hawk:'하늘 높이 날개 그림자가 빙빙 돈다.'}[pred];
  let o;
  if(med==='water') o=[
    {l:'수초 사이로 숨는다',p:{heron:.7,catfish:.5,bass:.55}[pred],hide:1},
    {l:'바닥 돌 틈으로 파고든다',p:{heron:.75,catfish:.3,bass:.6}[pred],hide:1},
    {l:'재빨리 반대쪽으로 헤엄쳐 달아난다',p:{heron:.3,catfish:.7,bass:.4}[pred]}];
  else if(med==='air') o=[
    {l:'건물 틈으로 숨는다',p:.6,hide:1},
    {l:'더 높이 날아오른다',p:pred==='hawk'?.2:.55},
    {l:'사람 곁으로 내려앉는다',p:.5,human:1}];
  else o=[
    {l:'덤불 속으로 숨는다',p:.55,hide:1},
    {l:'죽은 척한다',p:pred==='cat'?.25:.5},
    {l:'있는 힘껏 달아난다',p:.45}];
  if(tm('feisty')) o.push({l:'맞서 싸운다',p:.2+(S.size-1)*.6+(S.sp.big?.3:0),fight:1});
  o.forEach(x=>{x.c='neutral';x.r='';x.fx=()=>{
    let p=x.p+(S.size-1)*.35+(x.hide?(tm('shy')?.12:tm('curious')?-.08:0):(tm('glutton')?-.05:0))+(x.fight&&tm('feisty')?.05:0)-(S.health<40?.1:0);
    if(R()<clamp(p,.05,.92)){
      S.scaredT=2;
      say(x.fight?'{n}이 털을 세우고 맞서자 상대가 물러났습니다.':x.human?'{n}이 사람 곁에 내려앉자 포식자는 다가오지 못했습니다.':'{n}은 숨을 죽였습니다. 그림자가 지나갔습니다.','good');
      remember({heron:'왜가리의 부리를 피했다.',catfish:'메기의 입을 피했다.',bass:'배스를 따돌렸다.',cat:'고양이 발톱을 피했다.',straydog:'떠돌이 개들을 따돌렸다.',magpie:'까치 떼를 피했다.',hawk:'매의 발톱을 피했다.'}[pred],.6);
      if(x.human&&R()<.35) newOwner(T('그 사람은 {n}을 조심스럽게 손에 올려 집으로 데려갔습니다.'),'사람 손바닥 위로 내려앉았다. 그 손이 나를 집으로 데려갔다.');
    } else predDeath(pred);
  }});
  return {p:P+' 나는…',o,who:'위험!'};
}
function predDeath(pred){
  const L={
    heron:[['왜가리의 긴 부리가 물속으로 꽂혔습니다.','{n}은 통째로 들려 올라갔습니다. 목구멍으로 넘어가는 동안 {n}이 마지막으로 본 건 하늘이었습니다.'],'eaten'],
    catfish:[['진흙 속에서 메기가 입을 쩍 벌렸습니다.','메기는 {n}의 뒤쪽 절반을 삼켰습니다. 남은 앞쪽 절반은 하류로 천천히 떠내려갔습니다.'],'bite'],
    bass:[['배스가 번개처럼 달려들었습니다.','{n}은 한입에 사라졌습니다. 배스는 이 하천의 토종 물고기도 그렇게 먹어 치우고 있었습니다.'],'eaten'],
    cat:[['노란 눈의 고양이가 덮쳤습니다.','고양이는 {n}을 한참 굴리며 가지고 놀다가, 반쯤 남긴 채 덤불 속으로 사라졌습니다.'],'bite'],
    straydog:[['떠돌이 개들이 {n}을 둘러쌌습니다.','도망칠 틈은 없었습니다. 개들이 흩어진 자리에는 {n}의 반쪽만 남았습니다.'],'bite'],
    magpie:[['까치 떼가 몰려들었습니다.','까치들은 {n}을 번갈아 쪼았습니다. 반짝이던 털과 깃털이 바닥에 흩어졌습니다.'],'bite'],
    hawk:[['하늘에서 그림자가 내리꽂혔습니다.','매는 {n}을 발톱에 움켜쥐고 높이, 아주 높이 올라갔습니다. 아파트 옥상보다 높이.'],'eaten'],
  }[pred];
  endLife(L[0].map(T),'잡아먹힘',F.predator,null,false,L[1],pred);
}
function anglerChoice(){
  return {p:'눈앞에서 통통한 지렁이가 흔들린다. 배가 고프다. 나는…',o:[
    {l:'덥석 문다',r:'{n}이 지렁이를 무는 순간 입 안이 뜨끔했습니다. 몸이 물 밖으로 끌려 올라갔습니다.',c:'bad',fx:()=>{
      if(R()<.5){say('"금붕어가 이렇게 커?" 낚시꾼은 사진을 찍어 커뮤니티에 올리고, {n}을 물에 돌려보냈습니다.','good');remember('물 밖 세상을 잠깐 봤다. 사람이 나를 다시 물에 놓아주었다.',1);S.health-=10}
      else endLife([T('"금붕어 매운탕은 처음 먹어 보네." 낚시꾼은 {n}을 양동이에 넣었습니다.'),T('그날 저녁, 강가 텐트에서 매운 냄새가 피어올랐습니다.')],'식용',F.goldfishWild,null,false,'plate');}},
    {l:'수상한 냄새가 나서 지나친다',r:'{n}은 지렁이를 지나쳐 깊은 곳으로 내려갔습니다.',c:'neutral'}]};
}
function wildSurvived(){
  const id=S.sp.id,w=wildOf();
  const lines=S.f?fishSurvivedLines():id==='goldfish'?[T('{n}은 그 하천에서 '+ageLabel(S.ageM)+'을 살았습니다.'),T('마지막에는 팔뚝만 한 누런 몸으로 바닥 진흙 속에 조용히 누웠습니다. 그 하천에는 {n}을 닮은 누런 붕어들이 남았습니다.')]
   :id==='slider'?[T('{n}은 하천에서 수십 년을 살았습니다.'),'그동안 그 하천의 토종 남생이는 한 마리도 보이지 않게 되었습니다.']
   :id==='raccoon'?[T('{n}은 야산에서 살아남았습니다.'),'이듬해 봄, 그 산에서 새끼 라쿤 네 마리가 목격되었습니다.']
   :w.med==='street'?[T('{n}은 길 위에서 늙었습니다.'),T('어느 겨울 아침, 할머니의 밥그릇 옆에서 {n}은 깨어나지 않았습니다.')]
   :[T('{n}은 끝내 살아남아 수명을 다했습니다.'),'원래 살 곳은 아니었지만, 끝까지 버텼습니다.'];
  endLife(lines,'야생 생존',S.f?(S.sp.carassius?F.goldfishWild:F.fRelease):id==='goldfish'?F.goldfishWild:id==='slider'?F.slider:id==='raccoon'?F.raccoon:w.med==='street'?F.street:F.release,null,true,'ghost');
}

/* smuggling prologue */
function smugglePrologue(){
  const sp=S.sp;
  const place=sp.wild||(sp.id==='grey'?'콩고 분지의 숲':'인도 남부의 관목 숲');
  S.env='suitcase';
  q(T(`${place}. {n}은 밀렵꾼의 그물에 걸렸습니다. 어미는 새끼를 지키려다 그 자리에서 죽었습니다.`),'bad',()=>{S.scaredT=4});
  const vessel=sp.g==='parrot'?'다리를 테이프로 묶인 채 플라스틱 관에 넣어져':sp.g==='tortoise'?'양말에 하나씩 싸여':'구멍 뚫린 생수병에 담겨';
  q(T(`{n}은 다른 수십 마리와 함께 ${vessel} 여행 가방 속에 실렸습니다.`),'sub');
  if(R()<.12) return endLife([T('도착했을 때 가방 속에서 움직이는 건 절반이 안 됐습니다. {n}은 그 절반에 들지 못했습니다.')],'밀수',F.smuggle,null,false,'bottle');
  if(R()<.22){
    q('인천공항 세관 엑스레이에 가방 속 그림자가 잡혔습니다. 밀수범은 현장에서 체포되었습니다.','good');
    q(T('압수된 {n}은 멸종위기종 보호시설로 옮겨졌습니다. 다시 숲으로 돌아갈 수는 없습니다.'),'sub',()=>{S.flags.fac=1;S.r=.85;S.status='보호시설';S.env='facility';drawPledges($('gamePledges'),true);render()});
    return;
  }
  if(sp.id==='loris') q(T('판매자는 물리지 않게 하려고 {n}의 송곳니를 펜치로 잘라 냈습니다.'),'bad',()=>{S.health-=20});
  q(T(`{n}은 SNS 비공개 계정을 통해 ${sp.g==='parrot'?'300':sp.g==='tortoise'?'80':'150'}만 원에 팔렸습니다. 서류는 없었습니다.`),'bad',()=>{breakP(4,'밀수 동물을 삼');S.env='home';render()});
}

function neglectEnding(){
  const g=S.sp.g;
  const M={
   fish:[[S.tank&&S.tank.filter==='없음'?'여과기 없는 어항의 물은 썩어 가고 있었습니다.':'물을 제때 갈지 않아 어항의 암모니아 농도가 올라갔습니다.','{n}은 수면에서 입을 뻐끔거리다 배를 뒤집었습니다.','주인은 {n}을 변기에 넣고 물을 내렸습니다.'],'flush'],
   dog:[['주인은 점점 집에 늦게 들어왔고, 어떤 날은 들어오지 않았습니다.','물그릇이 말라 있던 여름, {n}은 현관 앞에서 주인을 기다리다 숨졌습니다.'],'starve'],
   cat:[['주인은 사료를 한 번에 잔뜩 부어 두고 며칠씩 집을 비웠습니다.','화장실도 치워지지 않은 방에서 {n}은 방광염이 악화되어 숨졌습니다.'],'sickdead'],
   turtle:[['물을 갈지 않은 지 오래, 수조에서 썩은 냄새가 났습니다.','{n}의 등갑에 곰팡이가 퍼졌고, {n}은 더 이상 물 위로 올라오지 않았습니다.'],'sickdead'],
   reptile:[['먹이 주는 날을 자주 잊었습니다. 사육장 온도계는 몇 달째 같은 자리였습니다.','{n}은 바싹 마른 채 은신처 안에서 발견되었습니다.'],'starve'],
   snake:[['물그릇이 비어 있은 지 몇 주가 지났습니다.','{n}은 탈수로 숨졌습니다.'],'starve'],
   bird:[['모이통 위에 껍질만 수북이 쌓였습니다. 주인은 모이가 있는 줄 알았습니다.','{n}은 횃대 아래 바닥에 떨어져 있었습니다.'],'starve'],
   parrot:[['{n}은 좁은 새장 밖으로 나오지 못한 채 몇 해를 보냈습니다.','먹이를 거부하던 {n}은 결국 횃대에서 떨어졌습니다.'],'starve'],
   insect:[['곤충 젤리가 바싹 말라붙었습니다. 사육통은 책상 밑으로 밀려났습니다.','{n}은 아무도 모르는 사이 숨졌고, 사육통째 쓰레기봉투에 들어갔습니다.'],'starve'],
   crab:[['사육통이 말라붙었습니다.','{n}은 껍데기 속에서 말라 죽었습니다.'],'starve'],
   chick:[['{n}의 울음소리가 점점 작아졌습니다.','다음 날 아침 상자는 조용했습니다.'],'freeze'],
  };
  const e=M[g]||[['밥과 물을 챙기는 날이 점점 줄었습니다.','{n}은 케이지 구석에서 굶어 죽었습니다.'],'starve'];
  return {lines:e[0].map(T),fx:e[1],fact:g==='fish'?F.neglectFish:F.neglect};
}
function naturalEnding(){
  const g=S.sp.g;
  if(g==='feeder') return {lines:['냉장고 뒤에서 살아남은 당신은, 쌍별귀뚜라미로서 주어진 몇 달을 다 살고 조용히 멈췄습니다. 1,000마리 중 이런 끝을 보는 건 몇 마리뿐입니다.'],fact:F.feeder};
  if(g==='fmouse') return {lines:['당신은 번식용으로 남겨졌습니다. 평생 좁은 통 안에서 새끼를 낳았고, 늙어서 숨을 거뒀습니다.'],fact:F.feeder};
  if(S.flags.fac) return {lines:[T('{n}은 보호시설에서 늙어 숨을 거두었습니다.'),'고향을 다시 보지는 못했지만, 마지막까지 돌봐 주는 사람이 있었습니다.'],fact:F.facility};
  if(S.r>.6) return {lines:[T('{n}은 가족의 품에서 조용히 눈을 감았습니다.'),T('기대수명을 다 살았습니다. 가족들은 {n}의 이름을 오래 불렀습니다.')],fact:F.natural};
  return {lines:[T('{n}은 나이가 들어 숨을 거두었습니다.'),'마지막 며칠, 곁에 오래 머문 사람은 없었습니다.'],fact:F.natural};
}

function askChoice(c,cb){
  const opts=c.o;
  const resolve=o=>{
    S.pending=null;S.waiting=false;$('choice').hidden=true;
    const before=typeof statSnap==='function'&&!skipping?statSnap():null;
    if(o.r)addLog(T(o.r),o.c);
    if(o.m)remember(o.m,o.mw);
    if(o.fx)o.fx();
    if(cb)cb(o);
    S.interest=clamp(S.interest,0,1);S.health=clamp(S.health,0,100);
    if(S.f){S.f.wq=clamp(S.f.wq,0,100);S.f.stress=clamp(S.f.stress,0,1.2);S.f.fin=Math.max(0,S.f.fin)}
    if(before)showDelta(before,statSnap());
    render();if(!skipping)run();
  };
  if(skipping){resolve(pick(opts.filter(o=>!o.dis)));return}
  S.waiting=true;S.pending={opts,resolve};stop();
  const box=$('choice');box.innerHTML='';box.hidden=false;if(box.classList){box.classList.toggle('crisis',/살아남기/.test(c.who||''));box.classList.toggle('train',/육성/.test(c.who||''))}
  const who=document.createElement('span');who.className='who';who.textContent=c.who||((S.noPledge?'당신':S.disp)+'의 선택');
  const p=document.createElement('p');p.className='prompt';const pf=typeof pondify==='function'?pondify:x=>x;p.textContent=pf(T(c.p));
  const list=document.createElement('div');list.className='opts';
  opts.forEach(o=>{const b=document.createElement('button');b.textContent=pf(T(o.l));if(o.d){const sm=document.createElement('small');sm.textContent=pf(T(o.d));b.appendChild(sm)}if(o.dis){b.disabled=true;b.className='dis'}else b.onclick=()=>resolve(o);list.appendChild(b)});
  box.append(who,p,list);
  /* on phones the choice is a bottom sheet, so the page does not need to move */
  const sheetUI=!!(document.body&&document.body.classList&&document.body.classList.contains('ingame'));
  if(box.scrollIntoView&&!sheetUI) box.scrollIntoView({block:'nearest',behavior:'smooth'});
}

/* ---------- simulation ---------- */
const MILES=[[.25,'{n}이 다 자랐습니다.'],[.5,'{n}이 기대수명의 절반을 지났습니다.'],[.75,'{n}이 노년기에 들어섰습니다. 움직임이 느려졌습니다.']];
function tick(){
  if(!S||S.done||S.waiting) return;
  if(S.queue.length){const it=S.queue.shift();if(it.text)addLog(it.text,it.cls);if(it.fn)it.fn();if(!S.done)render();return}
  if(S.ending) return;
  if(S.wild) return wildTick();
  if(S.f) return fishTick();
  S.tick++;
  if(S.flags.annoyed>0) S.flags.annoyed--;
  if(S.happyT>0)S.happyT--;if(S.scaredT>0)S.scaredT--;if(S.gag&&--S.gag.t<=0)S.gag=null;
  const dt=S.dt,g=S.sp.g,frac=dt/S.sp.life,prev=S.ageM/S.sp.life;
  S.ageM+=dt;S.month+=dt;
  const dec=tm('friendly')?.65:tm('curious')?.85:tm('feisty')?1.25:tm('shy')?1.1:1;
  S.interest=clamp(S.interest-frac*(.3+(1-S.r)*1.2)*BORE[g]*dec+frac*S.r*1.0,.02,1);
  if(S.interest<.28){S.health-=frac*(.28-S.interest)*300*NEGLECT[g]*tankMult()*(tm('glutton')?.8:1);if(S.interest<.22)breakP(2,'돌봄 소홀')}
  else S.health=clamp(S.health+frac*35,0,100);
  if(S.tank&&S.tank.filter==='없음'&&S.tank.crowd>3) S.health-=frac*25;
  if(S.flags.untreated) S.health-=frac*35;
  if(S.flags.moving>0) S.flags.moving--;
  S.health=clamp(S.health,0,100);
  const now=S.ageM/S.sp.life;
  for(const [m,t] of MILES) if(prev<m&&now>=m&&!S.noPledge){addLog(T(t),'mile');render();return}

  if(S.health<=0&&NEGLECT[g]>0){const e=neglectEnding();endLife(e.lines,'방치',e.fact,[[2,'돌보지 않음']],false,e.fx);render();return}
  if(S.ageM>=S.target){const e=naturalEnding();endLife(e.lines,'자연사',e.fact,null,true,'ghost');render();return}

  const ramp=now<.12?.3:1;
  const order=ENDS.filter(e=>has(g,e.g)&&!(S.cd[e.id]>S.tick)).sort(()=>R()-.5);
  for(const e of order){
    if(S.flags.fac&&!['illness','cold','mbd'].includes(e.id)) continue;
    if(S.flags.cafeLife&&!['cafeban','illness','escape'].includes(e.id)) continue;
    const rate=e.rate*HZ*(e.young?1:ramp)*(e.mod?e.mod():1)*tmod(e.id);
    if(rate<=0) continue;
    if(R()<1-Math.exp(-rate*dt)){fireEnd(e);render();return}
  }
  if(!(S.cd.choice>S.tick)&&R()<.1){
    const st=stageOf();
    const pool=CH.filter(c=>has(g,c.g)&&(!c.once||!S.once['c'+c.id])&&!(S.cd['c'+c.id]>S.tick)&&(!c.stage||c.stage.includes(st))&&(!c.when||c.when()));
    if(pool.length){const c=wpick(pool.map(x=>[x,1/(1+2*(S.seen['c'+x.id]||0))]));S.seen['c'+c.id]=(S.seen['c'+c.id]||0)+1;S.cd.choice=S.tick+8;S.cd['c'+c.id]=S.tick+35;if(c.once)S.once['c'+c.id]=1;askChoice(c);render();return}
  }
  if(R()<.55){
    const st=stageOf();
    const pool=FLAV.filter(f=>has(g,f.g)&&(!f.once||!S.once[f.once])&&(!f.stage||f.stage.includes(st))&&(!f.when||f.when())&&!(S.cd['f'+f.i]>S.tick));
    if(pool.length){
      const f=wpick(pool.map(p=>[p,(p.w||1)/(1+1.6*(S.seen[p.i]||0))]));
      S.seen[f.i]=(S.seen[f.i]||0)+1;
      if(f.once)S.once[f.once]=1;S.cd['f'+f.i]=S.tick+35;
      addLog(T(typeof f.t==='function'?f.t():f.t),f.type);
      if(f.h)S.health+=f.h;if(f.i)S.interest+=f.i;if(f.r)S.r=clamp(S.r+f.r,0,.98);if(f.sc)S.scaredT=2;
      if(f.fx)f.fx();
      S.interest=clamp(S.interest,.02,1);S.health=clamp(S.health,0,100);
      if(f.m)remember(f.m,f.mw);
      if(f.reflect){render();askReflect(f.reflect);return}
    }
  }
  render();
}

