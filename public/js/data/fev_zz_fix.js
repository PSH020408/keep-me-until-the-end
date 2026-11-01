/* ---------- v0.26: no more lives that stop in the middle ----------
   Happy catalogue endings were written as epilogues ("…and it lived on for years"). Mid-career they ended the
   game on the spot: a fish that played dead and got rescued at age 3 was shown as 「끝까지 생존!」 with an S.
   Now, while a career is running and less than 80 % of the lifespan is lived, a happy ending in which the fish
   stays where it is becomes a 해피 이벤트: its lines are told, it pays (SP, bond, health, mood), and life goes on.
   Happy endings in which the fish leaves for somewhere else (a river, the sea, a new owner) still end the life. */
const FIX_STAY=new Set(['HAP-SOFA','HLT-08-H','HLT-16-H','HLT-25-H','HLT-29-H','HLT-34-H','HLT-40-H','HLT-45-H','HOM-01-H','HOM-07-H','HOM-25-H','HOM-33-H','HOM-44-H',
  'MAT-01-H','MAT-02-H','MAT-08-H','MAT-16-H','MAT-21-H','MAT-26-H','MAT-29-H','MAT-31-H','HAP-03','HAP-06','HAP-08','HAP-13','HAP-18','HAP-24','HAP-29','HAP-30',
  'HAP-32','HAP-33','HAP-35','HAP-36','HAP-38','STAR-H','TYR-H','HAP-01','HAP-05','HAP-09','HAP-21','HAP-26','HAP-27','HAP-28','HAP-31','HAP-39','HAP-42']);
const fixMid=()=>!!(S&&S.f&&S.f.car&&S.f.car.turn>0&&!S.preOwner&&!S.wild&&S.ageM/S.sp.life<.8);
(()=>{const _f=fevFinish;fevFinish=function(ref){
  const id=typeof ref==='string'?ref:ref&&ref.id,E=typeof ref==='string'?FEVEND[ref]:ref;
  if(E&&E.kind==='happy'&&FIX_STAY.has(id)&&fixMid()&&!S.ending){
    const c=S.f.car,lines=valOf(E.l).map(t=>T(valOf(t)));
    S.f.happyMid=(S.f.happyMid||0)+1;
    addLog(T('★ 해피 이벤트 「'+(E.cat||'좋은 일')+'」! 이번 화는 아무도 안 죽는다. 진짜다.'),'star');
    lines.slice(0,3).forEach(l=>addLog(l,'good'));
    c.sp+=15;c.bond.owner=clamp(c.bond.owner+8,0,100);c.mood=Math.min(4,c.mood+1);
    S.health=clamp(S.health+10,0,S.hMax||100);S.interest=clamp(S.interest+.08,0,1);
    addLog(T('(SP +15 · 주인 인연 ↑ · 체력 ↑) 그리고 {n}의 생은 계속된다. 아직 연재 중이다.'),'good');
    if(typeof remember==='function')remember(T(lines[0]||'좋은 날이었다.'),1.3);
    return}
  return _f.apply(this,arguments)}})();
/* the same epilogues are not rolled at all early in a career (they would only be cut short above) */
(()=>{const _p=fevPool;fevPool=function(stage,hap){const r=_p(stage,hap);if(!hap||!fixMid())return r;
  /* epilogues that take the fish away (a new owner, a pond, the river) wait for the last fifth of the life */
  return r.map(([e,w])=>[e,FIX_STAY.has(e.id)?w*.35:/^GIN-/.test(e.id)?w:0]).filter(z=>z[1]>0)}})();
/* a fish outgrowing its tank is given to a public aquarium: mid-career that is a move, not the end */
(()=>{const _e=fEnd;fEnd=function(key,arg){
  if(key==='donate'&&fixMid()&&typeof fRehome==='function'){
    fRehome('주인은 수십 곳에 전화를 돌린 끝에 {n}을 받아 줄 공공 수족관을 찾았다. 이사다. 대형 이사다. {n}의 육성은 새 수조에서 이어진다. 시즌 2 개막.',{own:'expert',tank:'pond',note:'공공 수족관에 기증'});return}
  return _e.apply(this,arguments)}})();

/* ---------- 벼랑 끝 승부: a sudden ending at good health gets one fight first ----------
   Deaths that come out of nowhere (poison, the toilet, the freezer, a bigger mouth…) at good health used to end a
   career in one line. While a career runs and the fish has at least 45 health, such an ending is first put to a
   last stand: the player picks how the fish fights it, the stat decides. Only where the career's own 벼랑 끝
   (fev_zz_career.js) has no scene — being flushed alive, the freezer, the trash, a catalogue ending of another kind. Win and the fish lives, badly hurt; lose
   and the ending plays. At most twice a life, and not twice in a row. */
const LS_SKIP=/^(natural|old|euth|calm|donate|release|wildlife|free|apex)/;
const lsOk=()=>!!(S&&S.f&&S.f.car&&S.f.car.turn>0&&!S.preOwner&&!S.wild&&!S.ending&&S.health>=45&&(S.f.lsN||0)<2&&S.tick-(S.f.lsAt||-99)>12);
function lsChance(k){const st=fst(),r=st[k]/Math.max(1,statCap(k));return clamp(.12+r*.75*(.6+.4*S.health/100)+(carHas&&carHas(k)?.08:0),.1,.85)}
function lastStand(label,go){
  const f=S.f;f.lsN=(f.lsN||0)+1;f.lsAt=S.tick;
  const opt=(k,l,ok)=>{const ch=lsChance(k);return {l,d:CAR_STATS[k]+' '+statRank(k)+' · '+carChanceL(ch),c:'neutral',r:'',fx:()=>{
    if(R()<ch){S.health=Math.max(8,S.health-28);f.stress=clamp(f.stress+.15,0,1.2);
      addLog(T('★ 벼랑 끝 승부 — 승리! '+ok+' 이 작품의 주인공은 아직 안 죽는다. (체력 크게 ↓)'),'star');
      if(typeof remember==='function')remember('끝인 줄 알았다. 끝이 아니었다.',1.5)}
    else{addLog(T('✕ 벼랑 끝 승부 — 패배. 할 만큼 했다. 정말로.'),'bad');go()}}}};
  q(null,null,()=>askChoice({who:'⚠ 벼랑 끝 승부 — '+label,p:'이대로 끝인가? …아니, 아직 연재 중이다. {n}은 마지막 힘을 짜낸다. {n}은…',
    o:[opt('p','온몸으로 버틴다 (근육은 배신하지 않는다)','{n}은 몸 하나로 버텨 냈다.'),opt('g','이를 악물고 버틴다 (물고기에게 이가 있던가)','{n}은 끝까지 놓지 않았다. 근성이다.'),
       opt('w','빠져나갈 틈을 찾는다 (머리를 쓴다)','{n}은 아무도 못 본 틈을 찾아 빠져나왔다.'),opt('c','온 힘을 다해 주인을 부른다 (유리 쾅쾅)','주인이 돌아봤다. 이번엔 늦지 않았다.')]}));
}
(()=>{const _f=fevFinish;fevFinish=function(ref){
  const E=typeof ref==='string'?FEVEND[ref]:ref;
  if(E&&E.kind==='bad'&&lsOk()&&!(typeof CAR_STAND_CAT!=='undefined'&&CAR_STAND_CAT[E.cat])){const self=this,args=arguments;lastStand(E.cat||'위기',()=>_f.apply(self,args));return}
  return _f.apply(this,arguments)}})();
(()=>{const _e=fEnd;fEnd=function(key,arg){
  if(!LS_SKIP.test(String(key||''))&&lsOk()&&!S.waiting&&!(typeof CAR_STAND_KEYS!=='undefined'&&CAR_STAND_KEYS[key])){const self=this,args=arguments,fe=typeof FEND!=='undefined'&&FEND[key];
    lastStand(fe&&fe.cat||'위기',()=>_e.apply(self,args));return}
  return _e.apply(this,arguments)}})();

/* ---------- more training lines (three each repeated too often over 60+ turns) ----------
   Lines are not repeated until the others have been used (a shuffled deck per training). */
const FIX_TR={
 p:['{n}이 출수구 물살에 정면으로 맞섰다. 3초 버텼다. 4초째에 날아갔다. 그래도 어제보다 1초 늘었다.','{n}이 수초 사이를 지그재그로 질주했다. 수초가 다 눕혔다. 정원사(주인)가 울었다.',
  '{n}이 유리벽 끝에서 끝까지 왕복 열 번. 열한 번째에 유리에 박았다. 그것도 훈련이다. (아님)','물살 거스르기 30분. {n}의 꼬리 근육이 터질 것 같다. 터지진 않는다. 물고기다.',
  '{n}이 자갈 한 알을 입에 물고 수조를 한 바퀴 돌았다. 아령이다. 수중 헬스장 개장.','여과기 물살 최강 모드. {n}이 버텼다. 주인이 "얘 왜 저래?" 했다. 훈련이다, 주인아.',
  '{n}이 바닥에서 수면까지 단숨에 치고 올라갔다. 수직 상승. 엘리베이터가 필요 없다.','{n}이 꼬리로 물을 세게 쳤다. 수면에 파도가 일었다. 수조 기준 쓰나미다.'],
 g:['{n}은 사료 한 알을 눈앞에 두고 십 분을 참았다. 인내의 화신. 십일 분째에 먹었다.','{n}은 수조 구석에서 꼼짝 않고 하루를 버텼다. 주인이 죽은 줄 알고 유리를 두드렸다. 살아 있다. 근성이다.',
  '물이 미지근해도, 조명이 꺼져도, {n}은 지느러미를 접지 않았다. 의지가 지느러미보다 단단하다.','{n}은 탁한 물속에서 숨을 아끼며 버텼다. 버티는 것도 재능이다. 그 재능, 지금 만렙을 향해 간다.',
  '주인이 청소기를 돌렸다. 진동이 수조를 흔들었다. {n}은 흔들리지 않았다. 마음만은.','{n}이 여과기 소음 속에서 명상을 했다. 3분 만에 잠들었다. 그래도 수행은 수행이다.',
  '{n}은 먹이 경쟁에서 밀리고도 다시 줄을 섰다. 넘어져도 일어나는 물고기. 넘어진 적은 없다. 헤엄쳤을 뿐.','{n}은 밤새 바닥에 붙어 있었다. 아침에 일어나 보니 근성이 조금 늘어 있었다. 기분 탓이 아니다.'],
 w:['{n}이 수조 장식의 위치를 전부 외웠다. 주인이 장식을 옮겼다. 다시 외웠다. 두뇌 풀가동.','{n}이 먹이가 떨어지는 위치를 계산해 미리 가 있었다. 물리학이다. 물고기 물리학.',
  '{n}이 뜰채 그림자를 보자마자 수초 뒤로 갔다. 학습 완료. 주인은 뜰채를 등 뒤에 숨기는 법을 배워야 한다.','{n}은 유리에 비친 자기를 보고 "저건 나다"라는 결론에 도달했다. 철학의 시작이다.',
  '{n}이 여과기 소리가 평소와 다르다는 걸 알아챘다. 주인은 아직 모른다. 똑똑한 쪽이 누구인지 이제 분명하다.','{n}은 달팽이의 이동 경로를 관찰했다. 결론: 느리다. 학계에 보고할 만한 발견은 아니었다.',
  '{n}이 수조 미로(장식 세 개)를 3초 만에 통과했다. 기록이다. 수조 내 기록이다.','{n}이 주인 휴대폰 화면의 물고기 영상을 한참 봤다. 공부다. 아마.'],
 c:['{n}이 유리 앞에서 지느러미를 쫙 폈다. 주인이 사진을 찍었다. 갤러리가 {n}으로 가득 찼다. 진짜 가족 사진이 밀려났다.','{n}이 주인 손가락을 따라 하트를 그렸다. 하트처럼 보였다. 주인 눈에는.',
  '{n}이 손님 앞에서 한 바퀴 돌았다. 손님이 "와" 했다. 팬이 한 명 늘었다. 팬클럽 회원 수 2명.','{n}이 주인 퇴근 시간에 맞춰 유리 앞에 나와 있었다. 주인이 감동해서 사료를 두 배 줬다. 그건 안 된다.',
  '{n}이 조명 아래에서 비늘을 반짝였다. 무대 체질이다. 조명 감독(주인)이 흐뭇해했다.','{n}이 카메라를 보자 정확히 옆모습을 보여 줬다. 프로다. 매니저가 필요하다.',
  '{n}이 주인 앞에서 뻐끔뻐끔 입을 움직였다. 주인은 "사랑해"라고 알아들었다. 사실은 "밥".','{n}이 수면 가까이 올라와 주인 손끝에 입을 맞췄다. 주인은 그날 하루 종일 웃고 다녔다.']
};
(()=>{if(typeof CAR_TR==='undefined')return;const deck={};
  Object.keys(FIX_TR).forEach(k=>{if(CAR_TR[k])CAR_TR[k].ok=CAR_TR[k].ok.concat(FIX_TR[k])});
  /* training lines come from a deck: no repeat until all have been seen */
  const _t=carTrain;carTrain=function(k){const tr=CAR_TR[k];if(tr&&tr.ok){const all=tr.ok.slice(),orig=tr.ok;
      if(deck.__s!==S){for(const x in deck)delete deck[x];deck.__s=S}
      let d=deck[k];if(!d||!d.length){d=deck[k]=all.map((_,i)=>i).sort(()=>R()-.5)}const i=d.pop();tr.ok=[all[i]];
      try{return _t.apply(this,arguments)}finally{tr.ok=orig}}
    return _t.apply(this,arguments)};
})();

/* ---------- v0.26.1: less of the same ----------
   more friendship lines and contests (both now come from a deck in fev_zz_career.js), and a special training the
   fish has already done this life is offered again only when every other one has been */
(()=>{if(typeof CAR_PAL==='undefined')return;
  const more={
   owner:['주인이 휴대폰을 내려놓고 {n}과 눈높이를 맞췄다. 둘이 동시에 고개를 갸웃했다. 싱크로율 100%.','주인이 손가락으로 8자를 그렸다. {n}이 정확히 따라 그렸다. 주인이 소리를 질렀다. 옆집도 소리를 질렀다. (시끄러워서)',
     '주인이 "하나, 둘, 셋!" 하자 {n}이 수면으로 튀어 올랐다. 연습한 적 없다. 마음이 통한 거다.'],
   mate:['{n}과 합사어가 수조 끝에서 끝까지 경주했다. 동시에 들어왔다. 사진 판독 결과, 무승부. 우정 승.','합사어가 지쳐서 처지자 {n}이 속도를 맞춰 줬다. 아무도 안 봤다. 그래서 더 진짜다.',
     '{n}과 합사어가 먹이 하나를 두고 서로 양보하다가 둘 다 놓쳤다. 먹이는 달팽이가 먹었다. 우정은 남았다.'],
   snail:['느림보가 유리 한 칸을 오르는 동안 {n}은 열 바퀴를 돌았다. 속도는 달라도 목표는 같았다. 유리 꼭대기.','{n}이 느림보 옆에 붙어 천천히 헤엄치는 연습을 했다. 느림의 미학. 30초 만에 포기했다.',
     '느림보가 껍데기 밖으로 촉수를 내밀어 {n}을 톡 건드렸다. 응원이다. 아마도.'],
   mirror:['유리 속의 {n}이 먼저 웃었다. 물고기가 웃는다고? {n}도 따라 웃었다. 그런 걸로 하자.','{n}과 유리 속의 {n}이 동시에 지느러미를 폈다. 완벽한 대칭. 거울이라서 당연하다. 그래도 감동이다.',
     '{n}이 유리 속의 자기에게 등을 보였다. 유리 속의 {n}도 등을 보였다. 서로를 믿는다는 뜻이다. (해석은 자유)']};
  Object.keys(more).forEach(k=>{if(CAR_PAL[k])CAR_PAL[k].fr=CAR_PAL[k].fr.concat(more[k])});
  if(typeof CAR_CONTEST!=='undefined')CAR_CONTEST.push(
   {n:'수족관 오픈 기념 수조 횡단 레이스',k:'p',r:.55,win:'출발 신호와 동시에 {n}이 튀어 나갔다. 2등과 반 몸 차이. 상품은 대형 수초 화분. 주인이 더 기뻐했다.',lose:'{n}은 출발 신호에 놀라 반대 방향으로 갔다. 역주행 1등. 그런 부문은 없다.'},
   {n:'방송 "물고기 IQ 테스트"',k:'w',r:.55,win:'미로 수조를 {n}이 12초 만에 통과했다. 패널들이 "사람보다 빠르다"고 했다. 방송 자막: 천재 물고기.',lose:'{n}은 미로 입구에서 30분 동안 생각했다. 생각만 했다. 철학자 엔딩.'},
   {n:'동네 하천 정화 캠페인 홍보 모델',k:'c',r:.5,win:'포스터 속 {n}이 동네 게시판마다 붙었다. 주인은 포스터 앞에서 셀카를 찍었다. 다섯 장.',lose:'포스터 모델은 옆집 금붕어가 됐다. 주인은 그 포스터 앞을 지날 때마다 고개를 돌렸다.'});
  const _sp=carSpecialPick;carSpecialPick=function(){let x=null;for(let i=0;i<6;i++){x=_sp.apply(this,arguments);if(!x)return x;const k=x.id||valOf(x.l);if(!(S.f.tlv&&S.f.tlv[k]))return x}return x};
})();

/* ---- v0.26.1: the owner's age fits the portrait the player sees ----
   Ages were rolled before the owner kind was known, so a 66-year-old could wear a student's face.
   Each portrait has an apparent age range; once the kind is set, the age is moved into it. */
const OWN_AGE={expert:[28,38],learner:[19,24],eager:[19,24],casual:[21,30],gift:[22,30],breeder:[40,55],content:[20,27],
 mill:[40,55],cult:[30,45],neglect:[28,40],alchemist:[40,55],techbro:[25,35],relay:[22,30],release:[65,80],shared:[28,38],
 decor:[45,60],unbox:[19,26],staff:[20,28],bait:[55,68],touch:[24,32],grandma:[70,85],breakup:[23,30]};
function ownAgeFit(){if(!S||!S.o||!S.f||S.preOwner||S.wild)return;const k=S.f.kind||S.f.own;if(!k||S.o.ageK===k)return;S.o.ageK=k;
  const r=OWN_AGE[k]||OWN_AGE[S.f.own];if(r&&(S.o.age<r[0]||S.o.age>r[1]))S.o.age=r[0]+Math.floor(R()*(r[1]-r[0]+1))}
{const _rt=fRankTick;fRankTick=function(){ownAgeFit();return _rt.apply(this,arguments)}}
