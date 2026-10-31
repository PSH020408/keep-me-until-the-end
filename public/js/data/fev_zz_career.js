/* ---------- v0.13: career mode (육성) — a raising game in the manner of Uma Musume and Princess Maker ----------
   From the day the fish has an owner, every second step is a turn on the 육성 card:
     · four trainings (힘 · 근성 · 지능 · 매력), each with a facility level that rises with use,
       an energy cost (기력) and a failure rate that climbs as energy runs low
     · rest, play (컨디션), signalling sickness, buying skills with skill points (SP)
     · companions (주인, 합사어, 수조 달팽이 느림보, 유리 속의 나) appear on trainings; training with them builds a bond,
       and a full bond on a companion's favourite training is a 우정 훈련
     · six scheduled 고비 (goals) with a visible stat requirement; passing pays, failing hurts
     · skills that turn some of the house's unfairness (억까) — a jump with no lid, the cat, the intake, a dose of
       medicine — into something the fish can live through, once it has grown enough to have them
     · at the end: a grade (G → SS) and a title, Princess Maker style
   Everything else (hazards, catalogue events, endings) keeps running between turns. */

const CAR_STATS={p:'힘',g:'근성',w:'지능',c:'매력'};
const CAR_MOOD=['최악','나쁨','보통','좋음','최고'],CAR_MOODK=[.8,.9,1,1.1,1.2];
const car=()=>S&&S.f&&S.f.car;
/* stats are shown ×10 so growth reads like a raising game (internally they stay on the 0–100 scale the checks use) */
const carD=v=>Math.round(v*10);
const carHas=k=>{const c=car();return !!(c&&c.sk&&c.sk[k])};
const carOn=()=>!!(S&&S.f&&S.f.own&&!S.preOwner&&!S.wild);

/* ---------- the four trainings ---------- */
const CAR_TR={
 p:{n:'힘 훈련',gain:{p:3,g:1},vit:-21,
   lv:['여과기 물살 거슬러 헤엄치기','수조 끝에서 끝까지 전력 왕복','출수구 급류 정면 돌파','물살 속 제자리 버티기 30분','여과기를 최대로 틀어 놓은 날의 사투'],
   ok:['{n}은 물살 앞에서 꼬리를 쉬지 않고 저었습니다. 처음엔 밀려나던 몸이 이제 제자리를 지켰습니다.','{n}이 수조를 끝에서 끝까지 왕복했습니다. 몸통 옆 근육이 단단해졌습니다.','{n}은 출수구 바로 앞까지 거슬러 올라가 한참을 버텼습니다.']},
 g:{n:'근성 훈련',gain:{g:3,p:1},vit:-19,
   lv:['배고픔 참고 먹이 기다리기','숨 아끼며 바닥에 붙어 있기','조명 꺼진 밤 혼자 버티기','물 갈기 전날의 탁한 물 견디기','"물고기는 원래 아무것도 안 해도 돼"라는 말 견디기'],
   ok:['{n}은 먹이가 떨어지기 전까지 움직이지 않고 기다렸습니다.','{n}은 바닥에 배를 대고 숨을 아꼈습니다. 오래 버티는 법을 몸이 익혔습니다.','{n}은 불 꺼진 수조에서 지느러미 하나 흔들리지 않고 밤을 넘겼습니다.']},
 w:{n:'지능 훈련',gain:{w:3,c:1},vit:4,
   lv:['수조 구석구석 지도 그리기','그림자 모양 구분하기','먹이 시간 외우기','주인 발소리와 남의 발소리 구분하기','여과기 소리로 고장 미리 알아채기'],
   ok:['{n}은 수조의 틈과 굴, 물살이 약한 곳을 하나하나 외웠습니다.','{n}은 손 그림자, 뜰채 그림자, 고양이 그림자를 구분하게 되었습니다.','{n}은 주인이 사료통을 집기 전에 이미 수면에 가 있었습니다.']},
 c:{n:'매력 훈련',gain:{c:3,w:1},vit:-15,
   lv:['유리 앞에서 재롱 부리기','주인 손가락 따라가기','지느러미 활짝 펴고 멈추기','카메라 쪽으로 정확히 돌아보기','주인이 우울한 날을 알아보고 유리 앞에 나와 있기'],
   ok:['{n}이 유리 앞에서 주인 손가락을 따라 이리저리 헤엄쳤습니다. 주인이 웃었습니다.','{n}은 지느러미를 끝까지 펴고 주인 앞에서 멈췄습니다.','{n}은 주인이 수조 앞에 앉으면 제일 먼저 나와 있었습니다.']}
};
const CAR_FACK=[1,1.15,1.3,1.45,1.6];

/* ---------- companions ---------- */
const CAR_PAL={
 owner:{n:'주인',fav:'c',when:()=>true,
   fr:['주인이 유리에 손가락을 대자 {n}이 그 손가락을 따라 수조를 한 바퀴 돌았습니다. 주인은 그날 처음으로 {n}에게 "잘했어"라고 말했습니다.','주인이 수조 앞에 의자를 당겨 앉았습니다. {n}은 주인이 일어설 때까지 유리 앞을 떠나지 않았습니다. 주인은 그날 물을 갈고 사진을 서른 장 찍었습니다.']},
 mate:{n:()=>{const m=S.f.mates.find(m=>m.n>0&&m.id!==S.sp.id);return m?'합사어 '+(FX[m.id]&&SP.find(s=>s.id===m.id)?SP.find(s=>s.id===m.id).name:'친구'):'합사어'},fav:'p',
   when:()=>S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id),
   fr:['{n}과 합사어가 나란히 물살을 거슬러 올랐습니다. 먼저 지친 쪽은 없었습니다.','합사어가 앞에서 물살을 갈라 주었고, {n}은 그 뒤에서 한 번도 밀리지 않았습니다.']},
 snail:{n:'수조 달팽이 「느림보」',fav:'g',when:()=>S.f.tank!=='pond',
   fr:['달팽이 느림보가 유리를 한 칸 오르는 동안 {n}은 물살 앞에서 버텼습니다. 느림보는 그날 유리 끝까지 올라갔습니다. 둘 다 처음이었습니다.','느림보가 껍데기 속으로 들어가 사흘을 버티는 동안 {n}도 사흘을 버텼습니다. 사흘째 저녁, 둘은 동시에 고개를 내밀었습니다.']},
 mirror:{n:'유리 속의 나',fav:'w',when:()=>S.f.tank!=='pond',
   fr:['유리 속의 {n}이 먼저 방향을 틀었습니다. {n}은 그보다 먼저 틀었습니다. 처음으로 이겼습니다.','유리 속의 {n}과 마주 보던 {n}이 한쪽 지느러미만 접었습니다. 유리 속의 {n}도 그랬습니다. 서로를 완전히 이해한 순간이었습니다.']}
};
const carPalName=k=>valOf(CAR_PAL[k].n);

/* ---------- skills ---------- */
const CAR_SK=[
 {k:'safe',n:'부상 방지',cost:25,d:'훈련 실패율 -6%p'},
 {k:'nap',n:'꿀잠',cost:25,d:'휴식으로 회복하는 기력 +15'},
 {k:'intake',n:'흡입구 회피',cost:35,d:'여과기 흡입구 사고를 70% 확률로 피함'},
 {k:'dead',n:'죽은 척 장인',cost:40,d:'죽은 척을 들켜 변기에 버려지는 일을 70% 피함 · 기절 연기 구출 엔딩 확률 ↑'},
 {k:'cat',n:'고양이 무시',cost:40,d:'고양이 습격을 60% 확률로 피함'},
 {k:'charm',n:'애교 장인',cost:45,d:'주인의 관심이 식는 속도 30% 감소'},
 {k:'med',n:'약 냄새 감지',cost:50,d:'약·세제·살충제 중독을 55% 확률로 버팀'},
 {k:'p',n:'괴력',cost:50,d:'힘을 쓰는 선택의 성공률 ↑'},
 {k:'g',n:'맷집',cost:50,d:'근성을 쓰는 선택의 성공률 ↑'},
 {k:'w',n:'눈치',cost:50,d:'지능을 쓰는 선택의 성공률 ↑'},
 {k:'c',n:'아이컨택',cost:50,d:'매력을 쓰는 선택의 성공률 ↑'},
 {k:'cold',n:'겨울잠 체질',cost:55,d:'추위로 죽는 일을 45% 확률로 버팀'},
 {k:'oxy',n:'산소 절약',cost:55,d:'산소 부족을 55% 확률로 버팀'},
 {k:'land',n:'점프 착지술',cost:60,d:'수조 밖으로 떨어져도 50% 확률로 스스로 되돌아옴'},
 {k:'hide',n:'숨바꼭질 고수',cost:60,d:'포식자에게 잡아먹히는 결말을 35% 확률로 피함'},
 {k:'gill',n:'강철 아가미',cost:70,d:'더러운 물·암모니아로 잃는 체력 30% 감소 · 물 사고를 35% 확률로 버팀'},
 {k:'immune',n:'면역력',cost:55,d:'병이 진행되는 속도 35% 감소 · 병으로 죽는 일을 40% 확률로 버팀'},
 {k:'tough',n:'버티는 몸',cost:55,d:'방치·굶주림·스트레스로 죽는 일을 40% 확률로 버팀 · 아무도 안 볼 때 체력이 덜 깎임'},
 {k:'revive',n:'기사회생',cost:150,d:'생에 한 번, 죽음의 문턱에서 버팀 (자연사 제외)'}
];
const carSkill=k=>CAR_SK.find(s=>s.k===k);

/* ---------- goals (고비) ---------- */
const CAR_GOAL=[
 {n:'첫 달 — 새 물 버티기',at:.05,k:'g',r:.3,
  p:'새 수조에 온 지 한 달. 물이 아직 자리를 잡지 못했습니다. 아가미가 따끔거리고 숨이 가쁩니다. 이 달을 넘기면 이 물이 {n}의 물이 됩니다. {n}은…',
  o:[['g','바닥에 붙어 숨을 아끼며 버틴다'],['c','주인이 볼 때마다 수면에서 뻐끔거려 물갈이를 조른다'],['w','출수구 아래, 산소가 섞이는 자리를 찾아낸다']],
  pass:'{n}은 첫 달을 넘겼습니다. 물에서 나던 냄새가 사라졌습니다. 이 물이 {n}의 물이 되었습니다.',
  fail:()=>{S.f.wq-=25;S.health-=18;return '첫 달의 물이 {n}의 아가미를 붉게 부풀렸습니다. 새엽 끝이 상해 한동안 숨이 얕았습니다.'}},
 {n:'첫 계절의 변화',at:.15,k:'w',r:.42,
  p:'창밖의 계절이 바뀌었습니다. 물 온도가 하루에도 몇 번씩 오르내립니다. {n}은…',
  o:[['w','수조에서 온도가 가장 덜 변하는 자리를 찾는다'],['g','몸을 낮추고 바뀌는 물에 천천히 몸을 맞춘다'],['c','히터 쪽을 맴돌아 주인이 온도계를 보게 만든다']],
  pass:'{n}은 첫 계절의 변화를 넘겼습니다. 바뀐 물에도 몸이 금방 맞춰졌습니다.',
  fail:()=>{S.health-=22;S.f.coldShock=1;return '바뀐 물이 {n}의 몸을 흔들었습니다. 며칠 동안 지느러미를 몸에 붙인 채 바닥에 있었습니다.'}},
 {n:'다 자란 몸 — 수조가 좁아질 때',at:.27,k:'c',r:.55,
  p:'{n}의 몸이 커졌습니다. 돌아설 때마다 꼬리가 유리에 닿기 시작합니다. 주인은 아직 모릅니다. {n}은…',
  o:[['c','주인 앞에서 몸을 끝까지 펴고 유리 끝에서 끝까지 헤엄친다'],['w','주인이 수조 사진을 찍을 때마다 정확히 몸 길이가 보이게 선다'],['p','유리벽을 꼬리로 쳐서 소리를 낸다']],
  pass:()=>{if(typeof tankUp==='function'&&tankL()<fx_().minL)tankUp();return '주인이 {n}과 수조를 번갈아 보았습니다. "너 이렇게 컸어?"'},
  fail:()=>{S.f.stunt=(S.f.stunt||0)+.3;S.f.stress+=.15;return '주인은 눈치채지 못했습니다. {n}의 몸은 그 수조에 맞춰 자라기를 멈추기 시작했습니다.'}},
 {n:'주인의 권태기',at:.42,k:'c',r:.7,
  p:'주인이 수조 앞에 앉는 시간이 줄었습니다. 휴대폰 화면만 봅니다. 사료는 생각날 때 들어옵니다. {n}은…',
  o:[['c','주인이 지나갈 때마다 유리 앞에 나와 기다린다'],['w','주인이 오는 시간을 외워 미리 수면에 가 있는다'],['g','아무것도 바라지 않고 이끼를 갉으며 버틴다']],
  pass:()=>{S.interest=clamp(S.interest+.3,0,1);return '어느 저녁, 주인이 휴대폰을 내려놓고 수조 앞에 다시 앉았습니다. "미안. 요즘 정신이 없었어."'},
  fail:()=>{S.interest=clamp(S.interest-.25,.02,1);if(R()<.35&&typeof fDispose==='function'&&!S.waiting)q(null,null,()=>fDispose());return '주인의 의자는 수조 앞에서 침대 옆으로 옮겨졌습니다.'}},
 {n:'한여름 밤의 정전',at:.58,k:'g',r:.8,
  p:'열대야가 이어지던 밤, 집 안의 모든 소리가 한꺼번에 멎었습니다. 여과기가 멈추고 물이 미지근하게 고입니다. 아침까지 여섯 시간입니다. {n}은…',
  o:[['g','움직임을 최소로 줄이고 바닥에서 버틴다'],['w','수면의 가장 얇은 물층을 찾아 입을 댄다'],['p','꼬리로 수면을 쳐서 물을 섞는다']],
  pass:'전기가 들어왔을 때 {n}은 수면 아래에서 아가미를 천천히 움직이고 있었습니다. 주인은 그날 무정전 전원장치를 샀습니다.',
  fail:()=>{if(!S.waiting&&typeof fCr==='function'){q(null,null,()=>fCr('oxygen'));return '아침이 오기 전에 물속 산소가 먼저 바닥났습니다.'}S.health-=30;return '아침까지 {n}은 수면에서 입을 벌리고 있었습니다. 아가미 새엽이 검붉게 부었습니다.'}},
 {n:'노년의 겨울',at:.78,k:'g',r:.9,
  p:'{n}은 늙었습니다. 지느러미가 예전처럼 펴지지 않습니다. 올겨울은 유난히 깁니다. {n}은…',
  o:[['g','먹이를 조금씩, 그래도 매일 먹는다'],['c','주인이 유리 앞에 올 때마다 마지막 힘으로 나간다'],['w','따뜻한 물이 도는 자리에 몸을 붙이고 힘을 아낀다']],
  pass:()=>{S.health=clamp(S.health+20,0,S.hMax||100);return '{n}은 그 겨울을 넘겼습니다. 봄이 오자 주인은 {n}의 사진을 휴대폰 배경으로 바꿨습니다.'},
  fail:()=>{S.health-=30;return '겨울은 {n}의 몸에서 많은 것을 가져갔습니다. 봄이 와도 {n}은 바닥 가까이에서 지냈습니다.'}}
];
/* v0.15: a low stat grows faster (the first ranks come quickly, the U ranks slowly) */
const carCatch=s=>1+Math.max(0,.5-fst()[s]/Math.max(1,statCap(s)))*1.6;
const carNeed=g=>Math.max(8,Math.round(statCap(g.k)*g.r));
const carNextGoal=()=>{const c=car();return c?CAR_GOAL[c.gi]:null};
const carGoalTurn=i=>{const c=car();return c.goalAt[i]};
const carChance=(k,need)=>{const c=car(),s=fst()[k];return clamp(Math.pow(s/Math.max(1,need),2.5)*CAR_MOODK[c.mood]*(carHas(k)?1.15:1)*(S.mode==='story'?1.25:1)-.05,.05,.92)};
const carChanceL=x=>x>=.8?'가능성 높음':x>=.55?'가능성 보통':x>=.3?'가능성 낮음':'가능성 희박';

/* ---------- setting up the career ---------- */
function carInit(){
  const f=S.f;if(f.car)return f.car;
  /* twice as many steps at home, a turn every second step: about twice the turns of v0.13.0 */
  if(!f.dt0){f.dt0=S.dt;S.dt=S.dt/2}
  const turnsLeft=Math.max(8,Math.round((S.sp.life-S.ageM)/(S.dt*2)));
  const startBond={expert:30,breeder:20,learner:25,content:15,casual:10,gift:5,mill:0}[f.own]||10;
  f.car={turn:0,vit:100,mood:2,sp:0,fac:{p:1,g:1,w:1,c:1},facN:{p:0,g:0,w:0,c:0},bond:{owner:startBond,mate:0,snail:0,mirror:0},
    sk:{},gi:0,gpass:0,gfail:0,goalAt:CAR_GOAL.map(g=>Math.round((g.at*S.sp.life-S.ageM)/(S.dt*2))),total:turnsLeft,fr:0};
  /* a goal already past by age (a fish bought old) is skipped */
  f.car.goalAt=f.car.goalAt.map(t=>t<0?-1:Math.max(2,t));
  while(f.car.gi<CAR_GOAL.length&&f.car.goalAt[f.car.gi]<0)f.car.gi++;
  /* the trip and the new water leave the fish at the bottom: the career builds it up again, toward the species ceiling */
  const st=fst();for(const k of ['p','g','w','c'])st[k]=Math.max(Math.round(statCap(k)*.1),Math.round(Math.min(st[k],statCap(k))*.9));
  carHookEnd();
  addLog(T('새 집에 온 {n}은 몸도 마음도 바닥이었습니다. 처음부터 다시 쌓아야 합니다.'),'sub');
  addLog(T('★ 육성이 시작되었습니다. {n}의 하루하루는 이제 당신이 정합니다. 억까는 계속됩니다. 이겨 내려면 자라야 합니다.'),'star');
  return f.car;
}
fTrainDue=function(){const f=S.f;return f&&!S.preOwner&&!S.wild&&f.own&&!S.waiting&&!S.ending&&S.tick>=(f.trainAt||1e9)};

/* ---------- one turn ---------- */
fTrain=function(){
  const f=S.f,c=carInit();f.trainAt=S.tick+2;c.turn++;
  /* moods drift with the body */
  if(f.stress>.6&&R()<.3)c.mood=Math.max(0,c.mood-1);
  if(S.health<40&&R()<.3)c.mood=Math.max(0,c.mood-1);
  if(S.health>80&&f.stress<.25&&R()<.15)c.mood=Math.min(4,c.mood+1);
  if(c.vit<15){S.health-=1.5}
  /* the owner wakes up once the bond is strong */
  if(c.bond.owner>=70&&!c.awake){c.awake=1;S.r=clamp(S.r+.12,0,.95);f.lazy=0;f.grow=1;
    addLog(T('★ 주인이 {n}을 위해 사육 책을 세 권 샀습니다. 처음으로 끝까지 읽었습니다. (주인 실력 ↑)'),'star')}
  /* a goal on its turn */
  const g=CAR_GOAL[c.gi];
  if(g&&c.goalAt[c.gi]>=0&&c.turn>=c.goalAt[c.gi])return carGoal(g);
  carHub();
};
function carStrip(){
  const c=car(),g=CAR_GOAL[c.gi],left=g&&c.goalAt[c.gi]>=0?Math.max(0,c.goalAt[c.gi]-c.turn):null;
  const st=fst();
  return [['기력',Math.round(c.vit)+'/100',c.vit],['컨디션',CAR_MOOD[c.mood]],['SP',String(c.sp)],
    ['스탯',['p','g','w','c'].map(k=>CAR_STATS[k]+' '+statRank(k)+' '+carD(st[k])+'/'+carD(statCap(k))).join(' · ')],
    ['다음 고비',g&&left!=null?g.n+' · '+(left?left+'턴 뒤':'이번 턴')+' · 필요 '+CAR_STATS[g.k]+' '+carD(carNeed(g)):'남은 고비 없음 — 끝까지'],
    ['인연',Object.keys(CAR_PAL).filter(k=>CAR_PAL[k].when()).map(k=>carPalName(k)+' ♥'+Math.round(c.bond[k])).join(' · ')]];
}
const carFail=k=>{const c=car();return clamp((c.vit<55?(55-c.vit)*1.7:0)+S.f.stress*14+(S.f.ill?10:0)-(carHas('safe')?6:0),0,90)};
function carHub(){
  const f=S.f,c=car();
  /* companions show up on a training this turn */
  const pal={};
  Object.keys(CAR_PAL).forEach(k=>{if(CAR_PAL[k].when()&&R()<.5){const t=pick(['p','g','w','c']);(pal[t]=pal[t]||[]).push(k)}});
  const opts=[];
  ['p','g','w','c'].forEach(k=>{const tr=CAR_TR[k],lv=c.fac[k],fail=Math.round(carFail(k)),ps=pal[k]||[];
    const fr=ps.filter(p=>c.bond[p]>=80&&CAR_PAL[p].fav===k);
    const mul=CAR_FACK[lv-1]*CAR_MOODK[c.mood]*(ps.length?1.1:1)*(fr.length?1.5:1);
    const gs=Object.entries(tr.gain).map(([s,v])=>CAR_STATS[s]+' +'+carD(Math.max(1,Math.round(v*mul*carCatch(s)*statCap(s)/60))*growOf(s)*aptOf(s))).join(' · ');
    opts.push({l:tr.n+' — '+tr.lv[lv-1]+(fr.length?' ★우정':''),d:gs+' · 기력 '+(tr.vit>0?'+':'')+tr.vit+' · 실패율 '+fail+'% · 시설 Lv.'+lv+(ps.length?' · 함께: '+ps.map(p=>carPalName(p)+'♥'+Math.round(c.bond[p])).join(', '):''),c:'neutral',r:'',
      fx:()=>carTrain(k,ps,fr,fail)})});
  /* one special training from the old schedule or the ★ list */
  const sp=carSpecialPick();
  if(sp)opts.push({l:'특별 훈련 — '+valOf(sp.l),d:(sp.d||'')+' · 기력 -18',c:'neutral',r:'',fx:()=>carSpecial(sp)});
  opts.push({l:pick(['휴식 — 수초 그늘에서 푹 쉰다','휴식 — 바닥에 배를 대고 아무것도 안 한다']),d:'기력 +'+(45+(carHas('nap')?15:0))+' 안팎 · 체력 조금 회복',c:'neutral',r:'',fx:carRest});
  opts.push({l:'놀기 — 수조 안에서 하고 싶은 것을 한다',d:'컨디션 ↑ · 기력 +12',c:'neutral',r:'',fx:carPlay});
  if(f.ill)opts.push({l:'아픈 티 내기 — 주인이 알아채도록 유리 앞에 붙는다',d:'주인이 병을 알아챌 확률 ↑ · 기력 +8',c:'neutral',r:'',fx:carSignal});
  const can=CAR_SK.filter(s=>!c.sk[s.k]&&s.cost<=c.sp);
  if(can.length)opts.push({l:'스킬 배우기 — SP '+c.sp,d:'배울 수 있는 스킬 '+can.length+'개 · 턴을 쓰지 않음',c:'neutral',r:'',fx:()=>q(null,null,carShop)});
  askChoice({who:'육성 — '+c.turn+'턴째',p:typeof z_prompt==='function'?z_prompt():'앞으로 몇 주가 흘러갑니다. {n}은…',o:opts,strip:carStrip()});
}
function carTrain(k,ps,fr,fail){
  const f=S.f,c=car(),tr=CAR_TR[k];
  c.vit=clamp(c.vit+(tr.vit>0?tr.vit:tr.vit*(R()*.3+.85)),0,100);
  if(R()*100<fail){
    const pool=TRAIN.filter(t=>t.gain&&t.gain[k]&&t.fail&&t.fail.length&&trainOk(t)).flatMap(t=>t.fail).filter(failFits);
    const z=pool.length?pick(pool):['{n}은 무리하다 몸을 다쳤습니다. 한동안 지느러미를 접고 바닥에 붙어 있었습니다.',X({h:-6})];
    addLog(T('훈련 실패 — '+z[0]),'bad');if(z[1])z[1]();fStat(k,-2);c.mood=Math.max(0,c.mood-1);S.health-=2;
    if(c.vit<20&&R()<.3)f.fin+=.1;
    return}
  const mul=CAR_FACK[c.fac[k]-1]*CAR_MOODK[c.mood]*(ps.length?1.1:1)*(fr.length?1.5:1)*(R()<.12?1.6:1);
  for(const s in tr.gain){const v=Math.max(1,Math.round(tr.gain[s]*mul*carCatch(s)*statCap(s)/60));fStat(s,v);f.tinv=f.tinv||{p:0,g:0,w:0,c:0};f.tinv[s]=(f.tinv[s]||0)+v}
  c.sp+=2+c.fac[k]+(fr.length?4:0);
  if(fr.length){addLog(T('★ 우정 훈련! '+pick(CAR_PAL[fr[0]].fr)),'star');c.fr++;if(fr[0]==='owner')S.interest=clamp(S.interest+.06,0,1)}
  else addLog(T(pick(tr.ok)),'neutral');
  ps.forEach(p=>{c.bond[p]=clamp(c.bond[p]+7+R()*4,0,100);if(p==='owner')S.interest=clamp(S.interest+.03,0,1)});
  c.facN[k]++;if(c.facN[k]>=4&&c.fac[k]<5){c.facN[k]=0;c.fac[k]++;addLog(T('「'+tr.n+'」 시설 레벨이 '+c.fac[k]+'이 되었습니다 — '+tr.lv[c.fac[k]-1]),'good')}
  f.tsum=(f.tsum||0)+1;f.stress=clamp(f.stress+.005,0,1.2);
}
function carSpecialPick(){
  if(R()>.55)return null;
  const pool=TRAIN.filter(t=>(t.t||t.g||t.sp)&&trainOk(t));
  const tier=typeof z_tier==='function'?z_tier():0;
  const spx=typeof Z_SPX!=='undefined'?Z_SPX.filter(s=>s.tier<=tier&&(!s.need||s.need())):[];
  const all=pool.concat(spx,spx);return all.length?pick(all):null;
}
function carSpecial(x){
  const f=S.f,c=car();c.vit=clamp(c.vit-18,0,100);
  if(R()*100<carFail()+6){const fs=x.fail.filter(failFits),z=fs.length?pick(fs):['{n}은 무리하다 몸을 다쳤습니다.',X({h:-6})];addLog(T(z[0]),'bad');if(z[1])z[1]();c.mood=Math.max(0,c.mood-1);return}
  const k=(.8+R()*.6)*CAR_MOODK[c.mood];
  for(const s in x.gain){const v=Math.round(x.gain[s]*k);fStat(s,v);f.tinv=f.tinv||{};f.tinv[s]=(f.tinv[s]||0)+v}
  addLog(T(typeof x.ok[0]==='function'?x.ok[0]():x.ok[0]),'good');if(x.ok[1])x.ok[1]();
  f.tlv=f.tlv||{};const key=x.id||valOf(x.l);f.tlv[key]=(f.tlv[key]||0)+1;f.tsum=(f.tsum||0)+1;c.sp+=5;
}
function carRest(){
  const c=car(),r=R(),nap=carHas('nap')?15:0;
  if(r<.15){c.vit=clamp(c.vit+65+nap,0,100);c.mood=Math.min(4,c.mood+1);S.health=clamp(S.health+8,0,S.hMax||100);addLog(T('{n}은 바닥에 배를 대고 아주 깊이 쉬었습니다. 일어났을 때 몸이 가벼웠습니다.'),'good')}
  else if(r<.25){c.vit=clamp(c.vit+22+nap,0,100);addLog(T(pick(['쉬려 했지만 주인이 밤새 조명을 켜 두었습니다. {n}은 반쯤만 쉬었습니다.','쉬려던 자리에 합사어가 먼저 누워 있었습니다. {n}은 구석에서 대충 쉬었습니다.','주인이 밤새 게임을 했습니다. 모니터 불빛이 수조 유리에서 번쩍였습니다.'])),'sub')}
  else{c.vit=clamp(c.vit+45+nap,0,100);S.health=clamp(S.health+5,0,S.hMax||100);addLog(T(pick(['{n}은 수초 그늘에서 지느러미를 접고 푹 쉬었습니다.','{n}은 아무것도 하지 않고 하루를 보냈습니다. 그것도 실력이었습니다.','{n}은 유목 밑에서 오래 잤습니다.'])),'neutral')}
}
const CAR_PLAY=[
 [3,'{n}은 수면의 거품을 하나씩 터뜨리며 오후를 보냈습니다. 마지막 거품은 여과기가 만든 것이었고, 끝이 없었습니다.',1],
 [3,'{n}은 유목 터널을 열 번 왕복했습니다. 열한 번째에 주인이 박수를 쳤습니다.',1,c=>{c.bond.owner=clamp(c.bond.owner+3,0,100)}],
 [3,'{n}은 수초 사이에 숨었다가 주인이 찾으면 나오는 놀이를 했습니다. 주인은 그게 놀이인 줄 몰랐습니다.',1],
 [2,'{n}이 바닥에 떨어진 사료 알갱이를 굴리며 놀았습니다. 알갱이는 결국 {n}의 배 속으로 들어갔습니다.',1],
 [2,'{n}은 유리에 비친 자기 모습에게 지느러미를 흔들었습니다. 상대도 똑같이 흔들었습니다. 둘은 사이가 좋아졌습니다.',1,c=>{c.bond.mirror=clamp(c.bond.mirror+5,0,100)}],
 [2,'{n}이 기포기 물방울을 타고 수면까지 올라갔다가 내려오기를 반복했습니다. 엘리베이터 같았습니다.',1],
 [2,'달팽이 느림보의 껍데기 위에 잠깐 올라타 보았습니다. 느림보는 화를 내지 않았습니다. 느림보는 화를 낼 줄 몰랐습니다.',1,c=>{c.bond.snail=clamp(c.bond.snail+5,0,100)}],
 [1,'그날 {n}은 수조에서 가장 좋은 하루를 보냈습니다. 아무 일도 일어나지 않았습니다.',2],
 [1,'노는 데 정신이 팔려 {n}은 히터 줄에 몸이 감겼습니다. 금방 빠져나왔지만 기분이 상했습니다.',-1],
 [1,'주인이 놀아 준다며 유리를 손톱으로 계속 두드렸습니다. {n}은 놀고 싶지 않아졌습니다.',-1]
];
function carPlay(){const c=car(),e=wpick(CAR_PLAY.map(z=>[z,z[0]]));c.vit=clamp(c.vit+12,0,100);c.mood=clamp(c.mood+e[2],0,4);S.f.stress=clamp(S.f.stress-.06,0,1.2);
  addLog(T(e[1]+(e[2]>0?' (컨디션 ↑)':' (컨디션 ↓)')),e[2]>0?'good':'bad');if(e[3])e[3](c)}
function carSignal(){const c=car();c.vit=clamp(c.vit+8,0,100);S.interest=clamp(S.interest+.15+(c.bond.owner/400),0,1);
  addLog(T(c.bond.owner>=40?'{n}이 유리 앞에 붙어 움직이지 않자 주인이 한참 들여다보았습니다. "너 어디 아파?"':'{n}이 유리 앞에 붙어 있었습니다. 주인은 "밥 달라고?" 하며 지나갔다가, 조금 뒤 다시 돌아와 들여다보았습니다.'),'sub')}
/* what threatens this fish right now: those skills are recommended first */
function carThreats(){const f=S.f,t={};
  if(f.ill)t.immune='지금 아픔';
  if(S.interest<.4||f.wq<55)t.tough='주인이 소홀함';
  if(f.wq<55||!f.cycled)t.gill='물이 나쁨';
  if(f.tank!=='pond'&&!f.lid&&(fx_().jump||0)>=.1)t.land='뚜껑 없음';
  if(f.cat)t.cat='고양이가 있음';
  if(!f.heater&&isSp('@tropical'))t.cold='히터 없음';
  if(f.mates&&f.mates.some(m=>m.n>0&&FX[m.id]&&FX[m.id].cm>=fx_().cm*2))t.hide='큰 합사어';
  if(isKind('alchemist','learner','casual','grandma'))t.med='약을 잘 쓰는 주인';
  if(fx_().cm<8&&f.filter!=='없음')t.intake='작은 몸 · 여과기';
  if(season()==='summer'||f.tank==='pond')t.oxy='여름 · 정전';
  if(['casual','gift'].includes(f.own))t.dead='변기에 버릴 수 있는 주인';
  if(S.ageM/S.sp.life>.45)t.revive='나이가 듦';
  if(!t.immune)t.immune='가장 흔한 사인: 병';
  return t}
function carShop(){
  const c=car(),can=CAR_SK.filter(s=>!c.sk[s.k]),th=carThreats();
  const rec=can.filter(s=>th[s.k]).sort((a,b)=>b.cost-a.cost),rest=can.filter(s=>!th[s.k]).sort((a,b)=>b.cost-a.cost);
  const buy=s=>({l:(th[s.k]?'추천 · ':'')+s.n+' — SP '+s.cost,d:(th[s.k]?th[s.k]+' · ':'')+s.d,c:'neutral',r:'',fx:()=>{c.sp-=s.cost;c.sk[s.k]=1;addLog(T('★ 스킬 「'+s.n+'」을 익혔습니다. '+s.d),'star');q(null,null,carHub)}});
  const opts=rec.filter(s=>s.cost<=c.sp).map(buy).concat(rest.filter(s=>s.cost<=c.sp).map(buy),
    rec.filter(s=>s.cost>c.sp).slice(0,3).map(s=>({l:'추천 · '+s.n+' — SP '+s.cost,d:th[s.k]+' · SP가 '+(s.cost-c.sp)+' 모자람',dis:1,c:'neutral',r:''})));
  opts.push({l:'그만두고 돌아간다',d:'SP '+c.sp+' 그대로',c:'neutral',r:'',fx:()=>q(null,null,carHub)});
  askChoice({who:'육성 — 스킬',p:'{n}이 지금까지 익힌 것으로 배울 수 있는 기술입니다. 하나를 고르세요.',o:opts,strip:carStrip(),noEcho:0});
}
function carGoal(g){
  const c=car(),need=carNeed(g);
  const opts=g.o.map(([k,l])=>{const ch=carChance(k,need);return {l,d:CAR_STATS[k]+' '+carD(fst()[k])+' / 필요 '+carD(need)+' · '+carChanceL(ch),c:'neutral',r:'',
    fx:()=>{const ok=R()<ch;c.gi++;while(c.gi<CAR_GOAL.length&&c.goalAt[c.gi]<0)c.gi++;
      if(ok){c.gpass++;c.sp+=25+c.gpass*5;c.mood=Math.min(4,c.mood+1);c.bond.owner=clamp(c.bond.owner+8,0,100);fStat(k,3);
        addLog(T('◎ 고비 통과 — '+g.n+'. '+valOf(g.pass)),'star');remember('고비를 넘었다. 몸이 한 뼘 커진 것 같았다.',1.3)}
      else{c.gfail++;c.mood=Math.max(0,c.mood-1);addLog(T('✕ 고비 실패 — '+g.n+'. '+valOf(g.fail)),'bad');
        if(S.health<=0&&!S.ending){render();q(null,null,()=>fEnd(fCause()))}}}}});
  askChoice({who:'고비 — '+g.n,p:g.p,o:opts,strip:carStrip()});
}

/* ---------- skills at work: checks, deaths and the body between turns ---------- */
(()=>{const _c=fevChance;fevChance=function(chk){const v=_c(chk);const k=valOf(chk);if(v>0&&k&&car()&&carHas(k[0]))return clamp(v*1.15,.05,.95);return v}})();
const CAR_SAVE={jump:['land',.5],escape:['land',.4],cat:['cat',.6],intake:['intake',.7],cold:['cold',.45],oxygen:['oxy',.55],
  poison:['med',.55],tapwater:['gill',.35],shock:['gill',.35],cycle:['gill',.35],flushalive:['dead',.7],eaten:['hide',.35],feeder:['hide',.35],mauled:['hide',.35],
  disease:['immune',.4],neglect:['tough',.4],starve:['tough',.4],stress:['tough',.4]};
const CAR_SAVECAT={'점프사':'land','탈출':'land','중독':'med','약욕':'med','산소 부족':'oxy','동사':'cold','잡아먹힘':'hide','싸움':'hide','물잡이 실패':'gill','수질 쇼크':'gill','과열':'oxy','질병':'immune','기생충':'immune','방치':'tough','굶주림':'tough','스트레스':'tough'};
const CAR_SAVEL={
 land:'「점프 착지술」 — {n}은 바닥에 떨어지자마자 몸을 둥글게 말았다가 튕겨 수조로 되돌아갔습니다. 옆구리 비늘이 바닥에 한 줄 남았습니다.',
 cat:'「고양이 무시」 — 앞발이 수면을 긁는 순간 {n}은 이미 바닥 돌 밑에 있었습니다. 고양이는 젖은 발을 털고 돌아갔습니다.',
 intake:'「흡입구 회피」 — 흡입구가 {n}의 꼬리를 끌어당겼지만 {n}은 몸을 비틀어 빠져나왔습니다. 꼬리지느러미 끝이 조금 뜯겨 나갔습니다.',
 cold:'「겨울잠 체질」 — {n}은 대사를 바닥까지 낮추고 물이 다시 데워질 때까지 버텼습니다. 지느러미 끝이 하얗게 상했습니다.',
 oxy:'「산소 절약」 — {n}은 아가미를 아주 천천히 움직이며 수면의 얇은 물층에서 숨을 이어 갔습니다. 아침까지 버텼습니다.',
 med:'「약 냄새 감지」 — 물에서 쓴 냄새가 나자 {n}은 출수구 바로 아래, 새 물이 섞이는 자리에 붙었습니다. 피부가 따끔거렸지만 버텼습니다.',
 gill:'「강철 아가미」 — 독한 물이 아가미를 태웠지만, 단련된 새엽은 끝까지 숨을 놓지 않았습니다. {n}은 살아남았습니다.',
 dead:'「죽은 척 장인」 — 뜰채가 닿는 순간 {n}이 몸을 뒤집어 헤엄쳤습니다. 주인이 비명을 지르며 뜰채를 놓쳤습니다.',
 hide:'「숨바꼭질 고수」 — 큰 입이 닫히기 직전 {n}은 유목 틈으로 몸을 끼워 넣었습니다. 등지느러미 끝만 물려 나갔습니다.',
 immune:'「면역력」 — 병이 {n}의 몸을 끝까지 밀어붙였지만, 몸이 먼저 버텨 냈습니다. 지느러미가 다시 펴졌습니다.',
 tough:'「버티는 몸」 — 아무도 보지 않는 수조에서 {n}은 움직임을 줄이고 이끼를 갉으며 하루를 더, 또 하루를 더 버텼습니다.',
 revive:'「기사회생」 — 모든 것이 멈추려던 순간, {n}의 아가미가 한 번 더 움직였습니다. 그리고 또 한 번. {n}은 돌아왔습니다.'
};
function carTrySave(sk,p){
  const c=car();if(!c||!carOn()||!c.sk[sk])return false;if(R()>p*(c.mood>=3?1.1:1))return false;
  addLog(T('★ 스킬 발동! '+CAR_SAVEL[sk]),'star');c.saves=(c.saves||0)+1;S.health=clamp(S.health-(18+R()*14),1,S.hMax||100);c.mood=Math.max(0,c.mood-1);
  const near={land:'lid',cat:'lid',intake:'intake_guard',cold:'heater',med:'label',gill:'dechlor',hide:'mates'}[sk];if(near&&typeof fevNear==='function')fevNear(near);
  return true;
}
function carRevive(){const c=car();if(!c||!carOn()||!c.sk.revive||c.revived)return false;c.revived=1;c.saves=(c.saves||0)+1;addLog(T('★ 스킬 발동! '+CAR_SAVEL.revive),'star');S.health=18;S.f.wq=Math.max(S.f.wq,35);if(S.f.ill)S.f.ill.sev=Math.min(S.f.ill.sev,.3);return true}

/* ---------- 벼랑 끝 (last stand): a death the fish could still fight becomes one desperate choice ----------
   Twice a life (three times on 쉬움), never right after another one, never for a deliberate killing or
   for what no fish can fight (winter river, old age, euthanasia). The stat decides; failing is the death. */
const CAR_STAND_KEYS={disease:'body',neglect:'water',cycle:'water',tapwater:'water',shock:'water',poison:'water',stress:'body',starve:'body',stunt:'body',
  oxygen:'air',jump:'floor',escape:'floor',cat:'cat',intake:'intake',eaten:'bite',mauled:'bite',fight:'bite',nipped:'bite',cold:'cold',noair:'air'};
const CAR_STAND_CAT={'질병':'body','기생충':'body','방치':'water','물잡이 실패':'water','중독':'water','수질 쇼크':'water','산소 부족':'air','점프사':'floor','탈출':'floor',
  '잡아먹힘':'bite','싸움':'bite','합사':'bite','동사':'cold','스트레스':'body','성장 정체':'body','굶주림':'body','과열':'air','이사':'water','약욕':'water'};
const CAR_STAND={
 body:{p:'몸이 더는 버티지 못할 것 같습니다. 아가미가 점점 느려지고, 지느러미가 몸에 붙습니다. {n}은…',
   o:[['g','마지막 힘까지 아가미를 움직인다'],['c','주인이 볼 때까지 유리 앞에서 몸을 뒤집지 않고 버틴다'],['w','물이 가장 깨끗한 자리를 찾아 몸을 옮긴다']],
   ok:'{n}은 벼랑 끝에서 버텼습니다. 다음 날 아침에도 아가미가 움직였습니다.',fix:()=>{if(S.f.ill)S.f.ill.sev=Math.min(S.f.ill.sev,.45);S.interest=clamp(S.interest+.15,0,1)}},
 water:{p:'물이 독처럼 변했습니다. 아가미가 타는 것 같고, 숨을 쉴 때마다 더 아픕니다. {n}은…',
   o:[['c','수면에서 크게 뻐끔거려 주인을 부른다'],['w','출수구 바로 아래, 새 물이 섞이는 자리를 찾는다'],['g','숨을 최대한 아끼며 버틴다']],
   ok:'주인이 수면에서 헐떡이는 {n}을 보고 물을 절반 갈았습니다. {n}은 살아남았습니다.',fix:()=>{S.f.wq=Math.max(S.f.wq,50)}},
 air:{p:'물속에 숨이 남아 있지 않습니다. 수면의 얇은 물층마저 미지근합니다. {n}은…',
   o:[['g','움직임을 멈추고 아가미만 아주 천천히 움직인다'],['p','꼬리로 수면을 쳐서 공기를 섞는다'],['w','수면과 유리가 만나는 모서리의 물층을 찾는다']],
   ok:'{n}은 숨을 이어 갔습니다. 아침, 물이 다시 돌기 시작했습니다.',fix:()=>{S.f.wq=Math.max(S.f.wq,40)}},
 floor:{p:'{n}은 마룻바닥 위에 있습니다. 물은 몸 길이 세 개만큼 위에 있습니다. 아가미가 마르기 시작합니다. {n}은…',
   o:[['p','온몸을 튕겨 수조 받침을 향해 뛴다'],['g','아가미를 아끼며 누군가 올 때까지 버틴다'],['w','바닥의 물기를 따라 미끄러진다']],
   ok:'{n}은 다시 물속에 있었습니다. 옆구리 비늘 몇 장이 바닥에 남았습니다. 주인은 그날 뚜껑을 샀습니다.',fix:()=>{if(S.f.tank!=='pond'){S.f.lid=1;S.f.lidShift=0}}},
 cat:{p:'고양이 발톱이 수면을 갈랐습니다. 다음 발톱은 {n}을 향하고 있습니다. {n}은…',
   o:[['w','바닥 돌 밑으로 파고든다'],['p','발톱을 피해 수조 반대편까지 전력으로 헤엄친다'],['c','유리 앞에서 몸을 크게 펴 주인을 부른다']],
   ok:'발톱은 {n}의 등지느러미 끝만 긁고 지나갔습니다. 주인이 달려와 고양이를 들어 올렸습니다.',fix:()=>{if(S.f.tank!=='pond'){S.f.lid=1}}},
 intake:{p:'흡입구가 {n}의 꼬리를 빨아들입니다. 몸이 점점 망 쪽으로 끌려갑니다. {n}은…',
   o:[['p','꼬리를 비틀어 힘으로 빼낸다'],['g','버티며 주인이 여과기를 끌 때까지 기다린다'],['w','몸을 옆으로 눕혀 빨아들이는 힘을 줄인다']],
   ok:'{n}은 꼬리지느러미 끝을 흡입구에 남기고 빠져나왔습니다.',fix:()=>{S.f.fin+=.1;if(typeof setFl==='function')setFl('intake_guard',1)}},
 bite:{p:'큰 입이 바로 뒤에 있습니다. 물살이 뒤에서 당겨집니다. {n}은…',
   o:[['p','몸을 틀어 한 번에 반대쪽으로 튀어 나간다'],['w','좁은 틈으로 몸을 밀어 넣는다'],['g','물려도 놓지 않고 빠져나올 때까지 버틴다']],
   ok:'{n}은 꼬리 끝을 물린 채 빠져나왔습니다. 그날 밤 주인은 수조에 칸막이를 꽂았습니다.',fix:()=>{S.f.fin+=.15;S.f.walled=1}},
 cold:{p:'물이 얼음처럼 차갑습니다. 지느러미가 굳어 가고, 몸이 옆으로 기웁니다. {n}은…',
   o:[['g','대사를 낮추고 바닥에서 버틴다'],['c','유리 앞에서 마지막으로 몸을 흔들어 주인을 부른다'],['w','히터가 있던 자리, 물이 조금이라도 덜 찬 곳을 찾는다']],
   ok:'주인이 굳어 가는 {n}을 보고 그날 밤 히터를 사 왔습니다. {n}은 살아남았습니다.',fix:()=>{S.f.heater=1;S.f.coldShock=0}}
};
const CAR_STAND_NO=['학대','변기','냉동','쓰레기','방생','보내 줌','버려짐','도태','미판매'];
function carStand(scene,die){
  const c=car(),f=S.f;if(!c||!carOn()||S.waiting||S.ending)return false;
  const max=S.mode==='story'?3:2;if((c.stand||0)>=max||(c.standAt||-99)>S.tick-8)return false;
  const sc=CAR_STAND[scene];if(!sc)return false;c.stand=(c.stand||0)+1;c.standAt=S.tick;
  const opts=sc.o.map(([k,l])=>{const need=Math.max(8,Math.round(statCap(k)*.65)),ch=clamp(Math.pow(fst()[k]/need,2.2)*CAR_MOODK[c.mood]*(carHas(k)?1.15:1)*(S.mode==='story'?1.25:1)-.08,.05,.75);
    return {l,d:CAR_STATS[k]+' '+carD(fst()[k])+' / 필요 '+carD(need)+' · '+carChanceL(ch),c:'neutral',r:'',fx:()=>{
      if(R()<ch){S.health=Math.round(10+R()*10);c.vit=clamp(c.vit-30,0,100);c.mood=0;sc.fix();fStat(k,2);
        addLog(T('★ 벼랑 끝 — '+sc.ok),'star');remember('끝인 줄 알았다. 끝이 아니었다.',1.5)}
      else q(null,null,die)}}});
  addLog(T('벼랑 끝입니다.'),'bad');
  askChoice({who:'벼랑 끝 — 살아남기',p:sc.p,o:opts,strip:carStrip()});
  return true;
}
const CAR_NOREV=['natural','euth','free','apex'];
(()=>{const _e=fEnd;fEnd=function(key,arg){
  if(!S.ending&&carOn()&&car()){const sv=CAR_SAVE[key];
    if(sv&&carTrySave(sv[0],sv[1]))return;
    if(!CAR_NOREV.includes(key)&&carRevive())return;
    if(CAR_STAND_KEYS[key]&&carStand(CAR_STAND_KEYS[key],()=>_e(key,arg)))return}
  return _e(key,arg)}})();
(()=>{const _c=fCr;fCr=function(k,a){if(!S.ending&&carOn()&&car()){const sv=CAR_SAVE[k];if(sv&&carTrySave(sv[0],sv[1]))return true}return _c(k,a)}})();
(()=>{const _f=fevFinish;fevFinish=function(ref){
  const id=typeof ref==='string'?ref:ref&&ref.id,E=typeof ref==='string'?FEVEND[ref]:ref;
  if(E&&E.kind==='bad'&&!S.ending&&carOn()&&car()){const sk=CAR_SAVECAT[E.cat];if(sk&&carTrySave(sk,.45))return;if(carRevive())return;
    if(!CAR_STAND_NO.some(w=>(E.cat||'').includes(w))&&carStand(CAR_STAND_CAT[E.cat]||'body',()=>_f(ref)))return}
  return _f(ref)}})();
(()=>{const _t=fishTick;fishTick=function(){const h0=S.health,i0=S.interest,c=car(),sev0=S.f&&S.f.ill?S.f.ill.sev:null;const r=_t.apply(this,arguments);
  if(c&&carOn()&&!S.ending){if(c.sk.gill&&S.health<h0&&S.f.wq<55)S.health+=(h0-S.health)*.3;if(c.sk.charm&&S.interest<i0)S.interest+=(i0-S.interest)*.3;
    if(c.sk.immune&&S.f.ill&&sev0!=null&&S.f.ill.sev>sev0)S.f.ill.sev-=(S.f.ill.sev-sev0)*.35;
    if(c.sk.tough&&S.health<h0&&S.interest<.4)S.health+=(h0-S.health)*.25
    /* torn fins grow back over weeks in clean water (they never did before, and a long career wore them away) */
    if(S.f.fin>0&&!S.f.ill&&S.f.wq>50)S.f.fin=Math.max(0,S.f.fin-.05*S.dt)}
  return r}})();
/* playing dead as a skill makes the fake-death rescue likelier */
(()=>{const _p=fevPool;fevPool=function(stage,hap){return _p(stage,hap).map(([e,w])=>[e,w*(e.id==='HAP-13'&&carHas('dead')?2:1)])}})();

/* ---------- the end: grade and title ---------- */
const CAR_RANK=[[0,'G'],[30,'F'],[50,'E'],[75,'D'],[105,'C'],[140,'B'],[180,'A'],[215,'S'],[250,'SS'],[275,'UF'],[295,'UE'],[315,'UD'],[335,'UC'],[355,'UB'],[375,'UA'],[400,'US']];
const carTop=r=>['S','SS'].includes(r)||/^U/.test(r);
const CAR_OWNERKILL=['neglect','cycle','poison','flushalive','tapwater','left','shock','cook','freezer','trash','sink','squeeze','swallow'];
function carGrade(calm){
  const c=car(),st=fst();const rel=k=>st[k]/Math.max(1,statCap(k));
  const score=['p','g','w','c'].reduce((a,k)=>a+rel(k)*12,0)+c.gpass*10-c.gfail*6+Object.keys(c.sk).length*3+clamp(S.ageM/S.sp.life,0,1)*45+c.bond.owner/6+(calm?20:0)+c.fr*3;
  const rank=CAR_RANK.filter(r=>score>=r[0]).pop()[1];
  const key=String(S.f.endKey||''),prim=typeof z_primary==='function'?z_primary():'g',minRel=Math.min(...['p','g','w','c'].map(rel));
  let t;
  if(calm){
    if(c.gpass>=CAR_GOAL.length-1&&carTop(rank))t=['끝까지 해낸 물고기','모든 고비를 넘었습니다. 살아남았습니다. 끝까지.'];
    else if(c.bond.owner>=90)t=['가족이 된 물고기','주인의 휴대폰 배경은 끝까지 {n}이었습니다.'];
    else if(minRel>=.7)t=['만능 물고기','힘, 근성, 지능, 매력. 수조에서 필요한 건 다 가졌습니다. 수조가 좁았을 뿐입니다.'];
    else t={p:['수조의 왕','{n}이 지나가면 물살도 길을 비켰습니다.'],g:['불사조','억까가 올 때마다 {n}은 한 번 더 지느러미를 폈습니다.'],w:['수조의 현자','{n}은 주인보다 먼저 여과기 고장을 알았습니다.'],c:['거실의 아이돌','{n}의 사진첩은 주인 가족 사진보다 두꺼웠습니다.']}[prim];
  }else{
    if(S.ageM/S.sp.life<.12)t=['너무 짧았던 생','육성이 시작되기도 전에 끝났습니다. 이 물고기의 잘못은 아니었습니다.'];
    else if(CAR_OWNERKILL.some(k=>key.startsWith(k)))t=['억까의 증인','{n}은 할 수 있는 것을 다 했습니다. 마지막 한 수는 사람이 두었습니다.'];
    else if(/eaten|feeder|mauled|PRED|TYR-D/.test(key))t=['먹이사슬의 한 칸','더 큰 입은 언제나 있습니다. 그 입을 수조에 넣은 건 사람이었습니다.'];
    else if(/^(disease|HLT|ev:HLT)/.test(key)||/^ev:HLT/.test(key))t=['병과 싸운 물고기','약은 늦었고, 그래도 {n}은 끝까지 수면으로 올라왔습니다.'];
    else if(/^(cold|freeze)|동사/.test(key+S.endCat))t=['겨울을 넘지 못한 물고기','히터 하나 값이었습니다.'];
    else if(/jump|LID|점프/.test(key+S.endCat))t=['뚜껑이 없던 밤','뚜껑 하나 값이었습니다.'];
    else if(key==='euth'||/보내 줌/.test(S.endCat||''))t=['보내진 물고기','마지막에 고통을 줄여 준 사람이 있었습니다.'];
    else if(Object.keys(c.sk).length>=3)t=['끝까지 싸운 물고기','익힌 기술 '+Object.keys(c.sk).length+'개로 여러 번 살아남았습니다. 이번 한 번이 모자랐습니다.'];
    else if(c.gfail>c.gpass)t=['고비를 넘지 못한 물고기','다음 생이 있다면, 더 일찍 자랄 시간이 필요했습니다.'];
    else t=['여기까지 온 물고기','{n}이 넘긴 고비는 '+c.gpass+'개였습니다.'];
  }
  return {score:Math.round(score),rank,title:t[0],desc:T(t[1])};
}
(()=>{const _l=endLife;endLife=function(lines,cat,fact,pl,calm,fx,pred){
  const c=car();if(c&&S.f&&S.f.own&&!S.preOwner&&c.turn>0){const g=carGrade(!!calm);c.result=g;
    lines=lines.concat([T('★ 육성 평가 '+g.rank+' — 칭호 「'+g.title+'」. '+g.desc+' (고비 '+c.gpass+'/'+(c.gpass+c.gfail)+' 통과 · 스킬 '+Object.keys(c.sk).length+'개 · '+c.turn+'턴)')])}
  return _l(lines,cat,fact,pl,calm,fx,pred)}})();
function carHookEnd(){if(typeof showEnd!=='function'||showEnd.__car)return;const _s=showEnd;showEnd=function(cat,fact,calm){const r=_s(cat,fact,calm);
  try{const c=car();if(c&&c.result){const E=$('ending'),h=E&&E.querySelector('h2');const d=document.createElement('div');d.className='grade';
    d.innerHTML='<span class="rk"></span><div><b class="tt"></b><p class="ds"></p><p class="mt"></p></div>';
    d.querySelector('.rk').textContent=c.result.rank;d.dataset.rg=rankGroup(c.result.rank);d.querySelector('.tt').textContent='「'+c.result.title+'」';d.querySelector('.ds').textContent=c.result.desc;
    const st=fst();d.querySelector('.mt').textContent='힘 '+statRank('p')+' '+carD(st.p)+' · 근성 '+statRank('g')+' '+carD(st.g)+' · 지능 '+statRank('w')+' '+carD(st.w)+' · 매력 '+statRank('c')+' '+carD(st.c)+' · 고비 '+c.gpass+'/'+(c.gpass+c.gfail)+' · 스킬 '+Object.keys(c.sk).map(k=>carSkill(k).n).join(', ')+(Object.keys(c.sk).length?'':'없음')+' · 우정 훈련 '+c.fr+'회';
    if(h&&h.nextSibling)E.insertBefore(d,h.nextSibling);else if(E)E.appendChild(d)}}catch(e){}
  return r};showEnd.__car=1}

/* ---------- v0.14: time, events, bonds, contests, legacy ---------- */
/* the home's finer steps end when the fish leaves for a river: the wild keeps its own pace */
(()=>{const _tk=tick;tick=function(){if(S&&S.wild&&S.f&&S.f.dt0&&S.dt!==S.f.dt0)S.dt=S.f.dt0;return _tk.apply(this,arguments)}})();
/* with twice the steps at home, catalogue events roll on half of them, so a life holds about as many as before */
(()=>{const _t=fevTry,_h=fevHappyTry;
  fevTry=function(st,p){if(st==='home'&&car()&&carOn()&&R()<.5)return false;return _t(st,p)};
  fevHappyTry=function(st){if(st==='home'&&car()&&carOn()&&R()<.5)return false;return _h(st)}})();

/* ---------- bond stories: each companion has three chapters, at bond 30, 60 and 90 ---------- */
const CAR_STORY={
 owner:[
  {p:'주인이 수조 앞에 앉아 처음으로 {n}의 이름을 소리 내어 불렀습니다. 대답을 기다리는 얼굴입니다. {n}은…',
   o:[['c','이름이 들린 쪽으로 곧장 헤엄쳐 간다','주인이 "알아듣네?" 하고 웃었습니다. 그날부터 주인은 퇴근하면 이름부터 불렀습니다.',{c:2}],['w','두 번째로 불릴 때 나간다. 첫 번째는 그냥 흘려 둔다','주인이 한 번 더 불렀습니다. 그리고 한 번 더. 주인은 그날 {n}의 이름을 열한 번 불렀습니다.',{w:2}]]},
  {p:'주인이 휴대폰으로 "물고기도 주인을 알아볼까?"를 검색하고 있습니다. 화면 불빛이 유리에 비칩니다. {n}은…',
   o:[['c','주인이 고개를 들 때 정확히 유리 앞에 있는다','검색 결과보다 {n}이 먼저 대답했습니다. 주인은 휴대폰을 내려놓았습니다.',{c:3}],['g','평소처럼 바닥에서 지낸다','주인은 검색 결과를 끝까지 읽었습니다. "알아본대." 그날 밤 주인은 수조 앞에서 잠들었습니다.',{g:2}]]},
  {p:'주인이 이사를 앞두고 있습니다. 새 집 도면에 수조 자리가 먼저 그려져 있습니다. 주인이 그 도면을 유리에 대고 보여 줍니다. {n}은…',
   o:[['c','도면 앞에서 지느러미를 끝까지 편다','주인은 그 사진을 새 집 현관에 걸었습니다. "우리 집 첫 번째 가족."',{c:3}],['w','도면의 수조 자리를 따라 헤엄친다','주인은 웃다가 조금 울었습니다. 새 집 수조는 거실에서 가장 해가 잘 들지 않는, 가장 좋은 자리에 놓였습니다.',{w:3}]]}],
 mate:[
  {p:'합사어가 먹이 시간마다 {n}의 몫을 조금씩 남겨 둡니다. 오늘도 알갱이 두 개가 남아 있습니다. {n}은…',
   o:[['c','남긴 알갱이를 먹고 합사어 옆에서 헤엄친다','둘은 그날부터 같은 자리에서 잤습니다.',{c:2}],['p','알갱이 하나를 밀어 돌려준다','합사어는 알갱이를 먹지 않고 다시 밀었습니다. 알갱이는 여과기로 빨려 갔습니다.',{p:1,g:1}]]},
  {p:'밤에 정전이 되자 합사어가 {n} 쪽으로 다가와 나란히 바닥에 붙습니다. {n}은…',
   o:[['g','같이 숨을 아끼며 아침을 기다린다','둘은 서로의 아가미 소리를 들으며 아침까지 버텼습니다.',{g:3}],['w','물살이 남아 있는 구석으로 합사어를 이끈다','{n}이 찾은 구석에서 둘 다 아침을 맞았습니다.',{w:3}]]},
  {p:'합사어가 늙었습니다. 먹이 경쟁에서 자꾸 밀립니다. {n}은…',
   o:[['p','먹이가 떨어지는 자리를 지켜 합사어 몫을 만든다','{n}이 자리를 지키는 동안 합사어는 천천히 먹었습니다. 그 자리는 끝까지 둘의 것이었습니다.',{p:3}],['c','주인 앞에서 합사어 쪽을 오가며 신호를 보낸다','주인이 알아채고 핀셋으로 합사어에게 따로 먹이를 주기 시작했습니다.',{c:3}]]}],
 snail:[
  {p:'달팽이 느림보가 유리 한가운데에서 멈췄습니다. 껍데기에 이끼가 끼었습니다. {n}은…',
   o:[['g','느림보 껍데기의 이끼를 조금씩 갉아 준다','느림보의 껍데기가 반짝였습니다. 느림보는 그날 유리 끝까지 올라갔습니다.',{g:2}],['w','느림보가 가던 길의 장애물을 치운다','느림보는 아무 일도 없었다는 듯 지나갔습니다. 그게 느림보식 감사였습니다.',{w:2}]]},
  {p:'주인이 "달팽이 너무 많다"며 핀셋을 들었습니다. 핀셋이 느림보 쪽으로 갑니다. {n}은…',
   o:[['p','느림보 앞을 몸으로 막는다','핀셋이 멈췄습니다. "얘네 친구야?" 느림보는 살았습니다.',{p:2,c:1}],['c','주인 앞에서 느림보 주위를 빙빙 돈다','주인은 느림보 껍데기에 매니큐어로 점을 찍었습니다. "얘는 빼고."',{c:3}]]},
  {p:'느림보가 오랫동안 움직이지 않습니다. 껍데기 입구가 닫혀 있습니다. {n}은…',
   o:[['g','느림보 옆에서 하루 종일 기다린다','사흘째 아침, 느림보가 고개를 내밀었습니다. {n}은 그 자리에 있었습니다.',{g:3}],['w','물살을 느림보 쪽으로 보내 깨운다','느림보가 천천히 촉수를 폈습니다. 둘의 속도는 여전히 달랐지만, 방향은 같았습니다.',{w:3}]]}],
 mirror:[
  {p:'유리 속의 {n}이 오늘따라 지느러미를 크게 폅니다. {n}은…',
   o:[['c','똑같이 지느러미를 편다','둘은 똑같이 아름다웠습니다. 주인이 그 장면을 찍었습니다.',{c:2}],['w','먼저 지느러미를 접어 본다','유리 속의 {n}도 접었습니다. {n}은 그게 자기라는 걸 조금 알게 되었습니다.',{w:3}]]},
  {p:'조명 각도가 바뀌어 유리 속의 {n}이 두 마리로 보입니다. {n}은…',
   o:[['p','둘 다 이기려고 들이받는다','유리가 쿵 울렸습니다. 둘 다 물러서지 않았습니다. 무승부였습니다.',{p:2}],['g','둘이 지칠 때까지 노려본다','셋은 오래 버텼습니다. 마지막까지 남은 건 진짜 {n}이었습니다.',{g:3}]]},
  {p:'유리 속의 {n}이 늙어 보입니다. 지느러미 끝이 해졌습니다. {n}은…',
   o:[['c','그래도 지느러미를 끝까지 편다','유리 속의 {n}도 끝까지 폈습니다. 해진 지느러미도 지느러미였습니다.',{c:3}],['w','오래 바라보다 돌아선다','{n}은 유리 속의 자기를 다시 들이받지 않았습니다. 그럴 필요가 없었습니다.',{w:3}]]}]
};
function carStoryDue(){const c=car();for(const k of Object.keys(CAR_STORY)){if(!CAR_PAL[k].when())continue;const done=(c.story&&c.story[k])||0;if(done<3&&c.bond[k]>=[30,60,90][done])return k}return null}
function carStory(k){
  const c=car();c.story=c.story||{};const i=c.story[k]||0;const st=CAR_STORY[k][i];c.story[k]=i+1;
  askChoice({who:'인연 — '+carPalName(k)+' '+(i+1)+'화',p:st.p,strip:carStrip(),o:st.o.map(([sk,l,res,gain])=>({l,d:CAR_STATS[sk]+' ↑ · SP +12 · 인연 ↑',c:'neutral',r:'',fx:()=>{
    for(const s in gain)fStat(s,Math.max(1,Math.round(gain[s]*statCap(s)/50)));c.sp+=12;c.bond[k]=clamp(c.bond[k]+5,0,100);c.mood=Math.min(4,c.mood+1);
    if(k==='owner')S.interest=clamp(S.interest+.08,0,1);
    addLog(T('♥ '+carPalName(k)+' '+(i+1)+'화 — '+res),'star');if(i===2)remember('함께였다. 끝까지.',1.6)}}))});
}

/* ---------- 출전: contests between the goals ---------- */
const CAR_CONTEST=[
 {n:'동네 수족관 사진 콘테스트',k:'c',r:.45,win:'{n}의 사진이 1등을 했습니다. 상품은 사료 한 통과, 가게 벽에 붙은 사진 한 장이었습니다.',lose:'1등은 옆집 금붕어였습니다. 주인은 "사진발이 안 받았어"라고 했습니다.'},
 {n:'물생활 카페 "우리 애 묘기 자랑"',k:'w',r:.5,win:'{n}이 손가락을 따라 원을 그리는 영상이 이달의 영상으로 뽑혔습니다. 댓글 312개.',lose:'{n}은 촬영 내내 수초 뒤에 있었습니다. 영상 제목은 "숨바꼭질 장인"이 되었습니다.'},
 {n:'관상어 품평회',k:'p',r:.55,win:'심사위원이 "체형이 아주 좋다"고 적었습니다. {n}은 장려상 리본과 함께 집에 돌아왔습니다.',lose:'심사 수조에서 {n}은 몸을 다 펴지 못했습니다. 심사표에는 "긴장함"이라고 적혔습니다.'},
 {n:'라이브 방송 "물멍 마라톤"',k:'g',r:.55,win:'열두 시간 방송 동안 {n}은 한 번도 지치지 않았습니다. 시청자들이 {n}을 "철인"이라고 불렀습니다.',lose:'세 시간째 {n}이 바닥에 누워 쉬자 채팅창에 "죽었어?"가 쏟아졌습니다. 주인은 방송을 껐습니다.'},
 {n:'수조 레이아웃 대회 모델',k:'c',r:.6,win:'{n}이 수초 사이 정중앙에 멈춘 사진이 입상했습니다. 상금은 주인이 다 썼습니다. 새 여과기였습니다.',lose:'사진에 {n}이 흐리게 찍혔습니다. 심사평: "물고기가 산만함".'}
];
function carContestDue(){const c=car();return c.turn>=6&&(c.cAt||0)<=c.turn-7&&R()<.5}
function carContestOpt(){
  const c=car(),ct=pick(CAR_CONTEST),need=Math.max(8,Math.round(statCap(ct.k)*ct.r)),ch=carChance(ct.k,need);
  return {l:'출전 — '+ct.n,d:CAR_STATS[ct.k]+' '+carD(fst()[ct.k])+' / 필요 '+carD(need)+' · '+carChanceL(ch)+' · 기력 -25 · 이기면 SP +20',c:'neutral',r:'',fx:()=>{
    c.cAt=c.turn;c.vit=clamp(c.vit-25,0,100);c.contests=(c.contests||0)+1;
    if(R()<ch){c.wins=(c.wins||0)+1;c.sp+=20;c.mood=Math.min(4,c.mood+1);c.bond.owner=clamp(c.bond.owner+6,0,100);S.interest=clamp(S.interest+.08,0,1);fStat(ct.k,1);
      addLog(T('🏆 '+ct.n+' — 우승! '+ct.win),'star');remember('사람들이 박수를 쳤다. 나를 보고.',1.3)}
    else{c.mood=Math.max(0,c.mood-1);S.f.stress=clamp(S.f.stress+.08,0,1.2);addLog(T(ct.n+' — 아쉽게 졌습니다. '+ct.lose),'bad')}}};
}
/* the hub gains the contest option and gives way to a bond story when one is due */
(()=>{const _hub=carHub;carHub=function(){const k=carStoryDue();if(k&&R()<.7)return carStory(k);
  if(carContestDue()){const _ask=askChoice;askChoice=function(ch,cb){askChoice=_ask;if(ch&&ch.o)ch.o.splice(4,0,carContestOpt());return _ask.call(this,ch,cb)}}
  return _hub()}})();

/* ---------- 계승 (legacy): a fish that did well leaves something to the next one ---------- */
const CAR_LEG_KEY='kiwojuseyo-legacy';
/* v0.21: a legacy passes only to the same species (a platy's memory does not belong to a koi); one record per species */
function carLegacyAll(){try{const v=JSON.parse(localStorage.getItem(CAR_LEG_KEY)||'null');return v&&!v.k&&typeof v==='object'?v:{}}catch(e){return {}}}
function carLegacyLoad(){const v=carLegacyAll()[S.sp.id];return v&&v.k&&CAR_STATS[v.k]?v:null}
function carLegacySave(g){try{if(!(['B','A'].includes(g.rank)||carTop(g.rank)))return;const k=typeof z_primary==='function'?z_primary():'g';
  const all=carLegacyAll();all[S.sp.id]={k,rank:g.rank,title:g.title,name:S.disp,sp:S.sp.name};localStorage.setItem(CAR_LEG_KEY,JSON.stringify(all))}catch(e){}}
(()=>{const _i=carInit;carInit=function(){const had=!!S.f.car;const c=_i();if(!had){const L=carLegacyLoad();if(L){
  const b={B:.04,A:.06,S:.08,SS:.1}[L.rank]||(/^U/.test(L.rank)?.12:.04);fStat(L.k,Math.round(statCap(L.k)*b));c.sp+=10;c.legacy=L;
  addLog(T('★ 계승 — 같은 '+L.sp+'였던 선배, 「'+L.title+'」 '+L.name+'('+L.rank+')의 기억이 이어졌습니다. '+CAR_STATS[L.k]+'이 조금 높은 채로 시작합니다. (SP +10)'),'star')}}return c}})();
(()=>{const _g=carGrade;carGrade=function(calm){const g=_g(calm),c=car();
  if(c.wins){g.score+=c.wins*4;g.rank=CAR_RANK.filter(r=>g.score>=r[0]).pop()[1]}
  if(calm&&(c.wins||0)>=3&&!['끝까지 해낸 물고기','가족이 된 물고기'].includes(g.title)){g.title='대회 그랜드슬램';g.desc=T('{n}이 받은 상장은 '+c.wins+'장이었습니다. 수조 옆 벽이 모자랐습니다.')}
  carLegacySave(g);return g}})();

/* ---------- rare events: ~140 catalogue events whose endings were (almost) never reached in 8,000 simulated
   lives (v0.13) are three times as likely, so more of the 480 endings are actually seen ---------- */
const CAR_BOOST=new Set(["OWB-08", "HLT-08", "HLT-10", "HLT-11", "HLT-12", "HLT-13", "HLT-14", "HLT-16", "HLT-17", "HLT-26", "HLT-28", "HLT-33", "HLT-34", "HLT-35", "HLT-40", "HLT-41", "HLT-45", "HOM-01", "HOM-03", "HOM-14", "HOM-19", "HOM-20", "HOM-22", "HOM-25", "HOM-27", "HOM-31", "HOM-33", "HOM-36", "HOM-40", "HOM-43", "HOM-44", "HOM-45", "MAT-01", "MAT-03", "MAT-04", "MAT-05", "MAT-06", "MAT-07", "MAT-08", "MAT-09", "MAT-10", "MAT-11", "MAT-12", "MAT-13", "MAT-14", "MAT-15", "MAT-16", "MAT-17", "MAT-18", "MAT-19", "MAT-20", "MAT-21", "MAT-22", "MAT-23", "MAT-27", "MAT-28", "MAT-30", "MAT-32", "MAT-34", "MAT-35", "MAT-40", "ORG-02", "ORG-04", "ORG-07", "ORG-08", "ORG-10", "ORG-17", "ORG-18", "ORG-20", "ORG-26", "ORG-42", "OWA-01", "OWA-06", "OWA-07", "OWA-09", "OWA-10", "OWA-17", "OWA-18", "OWA-19", "OWA-20", "OWA-23", "OWA-25", "OWA-26", "OWA-27", "OWA-29", "OWA-32", "OWA-33", "OWA-35", "OWA-36", "OWA-38", "OWA-39", "OWA-40", "OWB-04", "OWB-05", "OWB-06", "OWB-07", "OWB-09", "OWB-10", "OWB-12", "OWB-13", "OWB-14", "OWB-16", "OWB-17", "OWB-18", "OWB-20", "OWB-21", "OWB-22", "OWB-26", "OWB-27", "OWB-28", "OWB-29", "OWB-30", "OWB-31", "OWB-33", "OWB-34", "OWB-35", "OWB-36", "OWB-37", "OWB-44", "OWB-45", "TRD-20", "TRD-22", "TRD-23", "TRD-26", "TRD-32", "TRD-33", "TRD-35", "TRD-37", "WLD-02", "WLD-03", "WLD-04", "WLD-06", "WLD-07", "WLD-08", "WLD-09", "WLD-13", "WLD-15", "WLD-19", "WLD-20", "WLD-21", "WLD-22", "WLD-23", "WLD-28"]);
(()=>{const _p=fevPool;fevPool=function(stage,hap){return _p(stage,hap).map(([e,w])=>[e,w*(CAR_BOOST.has(e.id)?3:1)])}})();
