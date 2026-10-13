/* ---------- v0.12: playtest fixes (docs/PLAYTEST_v0.11.md) ----------
   Loaded last of the fev_* files.
   1. training: fewer sessions, prompts that follow the life, mastery levels, special (comic) trainings
      that open as the training level rises
   2. stat routes measured against the species cap, led by what the player trained; a climax for each route
      that can end the life either way
   3. diseases: no endless relapses, four more diseases, a different mark left by each one that heals
   4. the common old endings get several versions each; one more predator; the owner's last line varies
   5. small consistency fixes (non-jumpers do not jump out, a leaking stand and dried filter media follow up) */

/* ---------- helpers ---------- */
const z_rel=k=>{const s=fst();return (s[k]||0)/Math.max(1,capOf(k))};
/* the stat the player built: what the training went into, then how close each stat is to the cap */
function z_primary(){const inv=(S.f&&S.f.tinv)||{};let best='g',bv=-1;
  ['p','g','w','c'].forEach(k=>{const v=(inv[k]||0)+z_rel(k)*12;if(v>bv){bv=v;best=k}});return best}
const z_hasMates=()=>S.f&&S.f.mates&&S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id);
const z_casualOwner=()=>['casual','gift'].includes(S.f.own)||isKind('casual','gift','neglect','decor','shared','unbox','breakup');

/* ======================= 1. training ======================= */
/* special trainings: tier 1 opens after 2 successful sessions, tier 2 after 4, tier 3 after 7 */
const Z_TIER=[0,2,4,7];
const z_tier=()=>{const n=(S.f&&S.f.tsum)||0;return n>=Z_TIER[3]?3:n>=Z_TIER[2]?2:n>=Z_TIER[1]?1:0};
const z_jumpFail=(hit)=>()=>{addFl('jumpy');if(lidOpen()&&!S.waiting)q(null,null,()=>fCr('jump'));else{addLog(T(hit),'bad');S.health-=10}};
const Z_SPX=[
 /* tier 1 */
 {id:'glare',tier:1,l:'옆 물고기를 정면에서 째려본다',need:()=>z_hasMates(),gain:{w:6,c:3},d:'지능 ↑ · 매력 ↑ · 싸움이 날지도',
  ok:['{n}은 옆 물고기 앞에 멈춰 서서 오래 노려보는 법을 익혔습니다. 물고기에게는 눈꺼풀이 없어서 먼저 눈을 돌리는 쪽이 졌습니다. 상대가 먼저 돌아섰습니다.',X({st:-.03})],
  fail:[['상대도 눈꺼풀이 없었습니다. 둘은 사흘 동안 서로를 노려보다 먹이 시간을 두 번 놓쳤습니다.',X({h:-5})],
        ['노려보던 상대가 먼저 달려들었습니다. {n}은 꼬리 끝을 한 입 뜯겼고, 뜯긴 자리에서 피가 실처럼 풀렸습니다.',X({h:-8,fin:.1})]]},
 {id:'stare',tier:1,l:'먹이 시간 전부터 주인을 째려본다',need:()=>S.f.tank!=='pond',gain:{c:6,w:3},d:'매력 ↑ · 지능 ↑ · 과식 주의',
  ok:['{n}은 먹이 시간 십 분 전부터 유리 앞에 붙어 주인을 노려보았습니다. 주인은 "왜 쳐다봐" 하며 버티다가 결국 사료통을 열었습니다.',X({i:.05})],
  fail:[['주인은 그 눈빛을 "배고픈가 보다"로 읽었습니다. 사료가 하루 네 번 들어왔고, 물이 뿌옇게 흐려졌습니다.',X({wq:-12,fat:.2})]]},
 {id:'sound',tier:1,l:'사료통 소리와 약병 소리를 구분한다',need:()=>S.f.tank!=='pond',gain:{w:7},d:'지능 ↑↑',
  ok:['{n}은 사료통 뚜껑이 돌아가는 소리와 약병 뚜껑이 돌아가는 소리를 구분하게 되었습니다. 약병 소리가 나면 {n}은 이미 수초 뒤에 있었습니다.',()=>addFl('medwise')],
  fail:[['두 소리는 비슷했습니다. {n}은 약병 소리에 수면으로 달려 나갔다가 약이 쏟아지는 자리에 있었습니다. 아가미가 한나절 따끔거렸습니다.',X({h:-6,st:.05})]]},
 {id:'dead',tier:1,l:'바닥에 옆으로 누워 죽은 척을 연습한다',need:()=>!isSp('clownloach'),gain:{w:5,c:4},d:'지능 ↑ · 매력 ↑ · 주인이 오해할지도',
  ok:['{n}이 바닥에 옆으로 눕자 주인이 유리에 얼굴을 바짝 댔습니다. 그 순간 {n}이 몸을 뒤집어 수면으로 올라갔습니다. 놀란 주인은 그날 먹이를 두 번 주었습니다.',()=>{addFl('playdead');X({i:.06})()}],
  fail:[['주인이 뜰채를 들고 왔습니다.',()=>{addFl('playdead');
    if(z_casualOwner()&&R()<.35&&!S.waiting){addLog(T('{n}은 너무 오래 누워 있었습니다. 연습한 대로였습니다.'),'bad');q(null,null,()=>{render();fEnd('flushalive','act')});return}
    addLog(T('뜰채 테두리가 닿기 직전 {n}이 몸을 뒤집었고, 주인이 비명을 질렀습니다. 뜰채 테두리가 옆구리를 긁고 지나가 비늘 몇 장이 떨어졌습니다.'),'bad');S.health-=6;S.f.stress+=.1}]]},
 /* tier 2 */
 {id:'double',tier:2,l:'수면을 두 번 차고 오르는 2단 점프를 연습한다',need:()=>(fx_().jump||0)>=.15&&S.f.tank!=='pond',gain:{p:9,w:2},d:'힘 ↑↑ · 뚜껑이 없으면…',
  ok:[()=>lidOpen()?'{n}이 수면을 한 번 차고, 떨어지기 직전 꼬리로 수면을 한 번 더 차서 더 높이 올랐습니다. 그 영상을 느린 화면으로 돌려 보던 주인은 그날 밤 뚜껑을 주문했습니다.'
     :'{n}이 수면을 한 번 차고, 떨어지기 직전 한 번 더 차 올랐습니다. 뚜껑에 정수리가 닿는 소리가 났습니다. 주인은 그 소리를 "노크"라고 불렀습니다.',()=>{addFl('jumpy');if(lidOpen()){S.f.lid=1;S.f.lidShift=0}}],
  fail:[['두 번째 도약이 너무 높았습니다.',z_jumpFail('{n}이 두 번째 도약에서 뚜껑 모서리에 머리를 박았습니다. 정수리 비늘이 벗겨지고 피가 맺혔습니다.')]]},
 {id:'surf',tier:2,l:'여과기 배출구 물살을 타고 미끄러진다',need:()=>S.f.filter!=='없음'&&S.f.tank!=='pond',gain:{p:6,g:5},d:'힘 ↑ · 근성 ↑ · 흡입구 주의',
  ok:['{n}은 여과기 배출구 물살에 몸을 싣고 수조 끝까지 미끄러졌다가, 다시 헤엄쳐 올라가 또 탔습니다. 하루에 마흔 번쯤이었습니다.'],
  fail:[['물살에 실린 {n}이 반대편 흡입구 쪽으로 끌려갔습니다. 흡입구에 꼬리지느러미가 빨려 붙었다가 찢겨 나왔습니다.',()=>{S.f.fin+=.15;S.health-=8;fevNear('intake_guard')}]]},
 {id:'cat',tier:2,l:'유리 너머 고양이와 눈싸움을 한다',need:()=>!!S.f.cat&&S.f.tank!=='pond',gain:{g:8,c:2},d:'근성 ↑↑ · 뚜껑이 없으면…',
  ok:['{n}이 지느러미를 끝까지 펴고 유리 앞에서 버텼습니다. 고양이가 먼저 하품을 하고 돌아섰습니다. 그 뒤로 고양이는 수조 위에 잘 올라가지 않았습니다.',()=>setFl('catwise',1)],
  fail:[['고양이 앞발이 유리를 쳤습니다.',()=>{if(lidOpen()&&!S.waiting){q(null,null,()=>fCr('cat'));return}addLog(T('놀란 {n}이 장식물에 부딪혀 옆구리 비늘이 벗겨졌습니다.'),'bad');S.health-=7}]]},
 {id:'selfie',tier:2,l:'휴대폰 렌즈에 맞춰 몸의 각도를 잡는다',need:()=>S.interest>.3&&S.f.tank!=='pond',gain:{c:9},d:'매력 ↑↑ · 유명해질지도',
  ok:['{n}은 휴대폰이 다가오면 몸을 비스듬히 틀어 지느러미가 가장 넓게 보이게 했습니다. 주인은 그 사진을 프로필로 바꿨습니다.',()=>{S.f.fame=(S.f.fame||0)+.6}],
  fail:[['플래시가 연달아 터졌습니다. {n}은 유리에 머리를 박고 한동안 수초 뒤에서 나오지 않았습니다.',X({h:-6,st:.1})]]},
 {id:'fast',tier:2,l:'사료가 코앞에 떨어져도 움직이지 않고 버틴다',gain:{g:9},d:'근성 ↑↑ · 주인이 걱정할지도',
  ok:['{n}은 사료 알갱이가 코앞에 떨어져도 사흘 동안 지느러미 하나 움직이지 않았습니다. 주인은 수족관에 전화를 걸었습니다. 사장은 "가끔 그래요"라고 했습니다.',X({i:.04})],
  fail:[['사흘째 {n}의 배가 안쪽으로 꺼졌습니다. 바닥에서 불어 터진 사료가 물을 흐렸습니다.',X({h:-8,wq:-8})]]},
 {id:'lead',tier:2,l:'무리 맨 앞에서 방향을 정한다',need:()=>fSameCount()>=3,gain:{c:6,w:5},d:'매력 ↑ · 지능 ↑',
  ok:['{n}이 방향을 틀면 무리 전체가 따라 틀었습니다. 아무도 {n}을 뽑지 않았지만 다들 따랐습니다.'],
  fail:[['{n}이 튼 방향은 여과기 흡입구 쪽이었습니다. 무리 몇 마리가 흡입구에 부딪혔고, 그날부터 무리는 {n}을 따르지 않았습니다.',X({st:.08})]]},
 /* tier 3 */
 {id:'door',tier:3,l:'현관 비밀번호 소리로 누가 왔는지 맞힌다',need:()=>S.f.tank!=='pond',gain:{w:10,c:3},d:'지능 ↑↑ · 주인 관심 ↑',
  ok:['{n}은 현관 비밀번호를 누르는 박자로 주인과 다른 사람을 구분했습니다. 주인이 올 때만 유리 앞에 나왔고, 택배 기사에게는 등을 돌렸습니다.',X({i:.08})],
  fail:[['{n}이 마중을 나간 사람은 주인이 아니라 집을 보러 온 부동산 중개인이었습니다. 중개인이 유리를 손가락으로 두드렸습니다.',X({st:.08})]]},
 {id:'tower',tier:3,l:'자갈을 물어다 탑을 쌓는다',need:()=>isSp('oscar','@gold','koi','channa','apisto','altum')&&S.f.tank!=='pond',gain:{p:6,w:6},d:'힘 ↑ · 지능 ↑ · 히터 주의',
  ok:['{n}이 자갈을 하나씩 물어다 수조 한쪽에 탑을 쌓았습니다. 탑은 주인이 물을 갈 때마다 무너졌고, {n}은 다음 날 다시 쌓았습니다.'],
  fail:[['{n}이 쌓은 탑이 히터 유리관 쪽으로 무너졌습니다.',()=>{if(S.f.heater&&R()<.45){addLog(T('히터 유리관에 금이 갔습니다. 아무도 보지 못했습니다.'),'bad');setFl('heater_crack',1)}}]]},
 {id:'splash',tier:3,l:'꼬리로 수면을 쳐서 물을 튀긴다',need:()=>isSp('oscar','arowana','gar','channa','koi','betta','comet')&&S.f.tank!=='pond',gain:{c:7,p:4},d:'매력 ↑ · 힘 ↑ · 전기 주의',
  ok:['{n}이 꼬리로 수면을 쳐서 주인 얼굴에 물을 튀겼습니다. 주인은 그걸 "아침 인사"라고 불렀고, 수조 앞 바닥에는 수건이 깔렸습니다.',X({i:.05})],
  fail:[['{n}이 너무 세게 쳤습니다. 튄 물이 멀티탭에 떨어져 차단기가 내려갔고, 여과기와 히터가 반나절 멈췄습니다.',X({wq:-10,st:.05})]]},
 {id:'map',tier:3,l:'뚜껑의 틈을 하나하나 재어 본다',need:()=>isSp('@escaper','pleco','bichir','channa')&&S.f.tank!=='pond',gain:{w:9},d:'지능 ↑↑ · 밖으로 나갈 길을 알게 됨',
  ok:['{n}은 밤마다 뚜껑 가장자리를 주둥이로 밀어 틈의 넓이를 재어 보았습니다. 전선 구멍이 가장 넓었습니다.',()=>{addFl('escapey');setFl('mapped',1)}],
  fail:[['틈에 머리를 넣었다가 빠지지 않았습니다. 아침에 주인이 뚜껑을 들어 올려 {n}을 빼냈습니다. 주둥이 피부가 벗겨져 있었습니다.',X({h:-8})]]},
 {id:'wake',tier:3,l:'주인이 늦잠을 자면 유리를 두드려 깨운다',need:()=>S.f.tank!=='pond'&&S.interest>.25,gain:{w:6,c:6},d:'지능 ↑ · 매력 ↑',
  ok:['{n}은 알람이 울리고 오 분이 지나도 방이 조용하면 주둥이로 유리를 두드렸습니다. 주인은 그 소리에 일어나 출근했습니다.',X({i:.06})],
  fail:[['{n}이 두드린 건 새벽 네 시였습니다. 주인은 수조에 담요를 덮었습니다. 담요 아래 물은 사흘 동안 어두웠습니다.',X({st:.1})]]}
];
Z_SPX.forEach(s=>{s.l='★ '+s.l});

/* prompts: what the coming weeks look like, from the life itself; each one once before any repeats */
const Z_PROMPTS=[
 [()=>season()==='winter','창밖이 일찍 어두워집니다. 수조 불빛만 방 안에 남아 있습니다. 이번 몇 주, {n}은…'],
 [()=>season()==='summer','물이 미지근하게 데워진 오후가 이어집니다. 매미 소리가 유리를 타고 들어옵니다. {n}은…'],
 [()=>season()==='spring','창문이 열리고 바깥 냄새가 방에 들어옵니다. 주인의 옷이 얇아졌습니다. {n}은…'],
 [()=>season()==='autumn','해가 비스듬히 들어와 수조 바닥에 긴 그림자를 만듭니다. {n}은…'],
 [()=>S.interest>.6,'주인이 수조 앞 의자에 앉아 있는 시간이 늘었습니다. {n}은…'],
 [()=>S.interest<.3,'수조 조명이 며칠째 켜지지 않았습니다. 사료통에는 먼지가 앉았습니다. {n}은…'],
 [()=>z_hasMates(),'합사어들이 먹이 자리를 두고 매일 같은 다툼을 합니다. {n}은…'],
 [()=>!z_hasMates()&&S.f.tank!=='pond','수조 안에서 움직이는 것은 {n}과 여과기 물살뿐입니다. {n}은…'],
 [()=>S.f.tank==='pond','연못 위로 잠자리가 낮게 지나갑니다. 물가 돌 위에 누군가의 그림자가 앉았다 갑니다. {n}은…'],
 [()=>S.health<55,'몸이 아직 무겁습니다. 지난 몇 주가 지느러미 끝에 남아 있습니다. {n}은…'],
 [()=>S.ageM/S.sp.life>.7,'지느러미가 예전처럼 활짝 펴지지 않습니다. 먹이를 쫓는 데 조금 더 오래 걸립니다. {n}은…'],
 [()=>(S.f.fame||0)>=1,'휴대폰 카메라가 하루에도 몇 번씩 유리 앞으로 다가옵니다. {n}은…'],
 [()=>S.f.cat,'수조 위 선반에서 고양이 꼬리가 늘어져 흔들립니다. {n}은…'],
 [()=>z_tier()>=2,'{n}의 몸은 이제 훈련에 익숙합니다. 해 보지 않은 것이 아직 남아 있습니다. {n}은…'],
 [()=>true,'앞으로 몇 주가 흘러갑니다. {n}은…'],
 [()=>true,'수조의 하루가 또 시작됩니다. {n}은…'],
 [()=>true,'주인의 발소리가 하루에도 몇 번씩 지나갑니다. {n}은…']
];
function z_prompt(){const f=S.f;f.tpUsed=f.tpUsed||{};
  const ok=Z_PROMPTS.map((p,i)=>[p,i]).filter(([p])=>{try{return p[0]()}catch(e){return false}});
  let fresh=ok.filter(([,i])=>!f.tpUsed[i]);if(!fresh.length){f.tpUsed={};fresh=ok}
  /* situational prompts before the plain ones */
  const sit=fresh.filter(([,i])=>i<14),[p,i]=pick(sit.length?sit:fresh);f.tpUsed[i]=1;return p[1]}
const Z_REST=['푹 쉰다','수초 그늘에서 지느러미를 접고 쉰다','바닥에 배를 대고 아무것도 하지 않는다'];
const Z_LV=['Lv.1','Lv.2','Lv.3'];
const Z_LVUP={2:['{n}은 이제 이 일에 몸이 익었습니다.','같은 연습을 몇 번 하자 {n}의 몸이 먼저 움직였습니다.'],3:['{n}에게 이 일은 이제 연습이 아니었습니다.','{n}은 이 일만큼은 수조에서 누구보다 잘했습니다.']};
const z_lv=x=>{const c=(S.f.tlv||{})[x.id||x.l]||0;return c>=4?3:c>=2?2:1};

/* every session: up to five cards — temperament, species, a stat special, a ★ special, rest, the rest at random */
fTrain=function(){
  const f=S.f;f.trainAt=S.tick+15+Math.floor(R()*6);
  f.tlv=f.tlv||{};f.tsum=f.tsum||0;f.tinv=f.tinv||{p:0,g:0,w:0,c:0};
  const shuf=a=>a.map(x=>[R(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
  const pool=TRAIN.filter(trainOk);
  const tier=z_tier();
  const spx=Z_SPX.filter(s=>s.tier<=tier&&(!s.need||s.need()));
  /* the ★ card the fish has done least comes first */
  const spxPick=spx.sort((a,b)=>((f.tlv[a.id]||0)-(f.tlv[b.id]||0))||(R()-.5)).slice(0,tier>=3?2:1);
  let o=shuf(pool.filter(x=>x.t)).slice(0,1).concat(shuf(pool.filter(x=>x.g)).slice(0,1)).concat(shuf(pool.filter(x=>x.sp)).slice(0,1)).concat(spxPick);
  const rs=pool.find(x=>x.rest);if(rs&&!o.some(x=>x.rest))o.push(rs);
  o=o.concat(shuf(pool.filter(x=>!x.t&&!x.g&&!x.rest&&!x.sp)).slice(0,Math.max(0,5-o.length))).slice(0,6);
  const tired=clamp(.06+f.stress*.4+(S.health<40?.15:0)+(f.ill?.1:0),0,.7);
  const restL=pick(Z_REST);
  askChoice({who:'육성 — 이번 시기 · 훈련 레벨 '+(tier+1),p:z_prompt(),o:shuf(o).map(x=>{const lv=z_lv(x),risk=tired+(x.t||x.g||x.tier?.06:0)+(x.tier?.04:0);
    return {l:x.rest?restL:valOf(x.l)+(lv>1?' · '+Z_LV[lv-1]:''),d:x.d+(x.rest?'':' · 실패 위험 '+(risk<.12?'낮음':risk<.25?'보통':'높음')),c:'neutral',r:'',
    fx:()=>{
      const fail=!x.rest&&R()<risk, great=!fail&&R()<(S.happyT>0?.25:.14);
      if(fail){const fs=x.fail.filter(failFits),z=fs.length?pick(fs):['{n}은 무리하다 몸을 다쳤습니다. 한동안 지느러미를 접고 바닥에 붙어 있었습니다.',X({h:-6,st:.05})];addLog(T(z[0]),'bad');if(z[1])z[1]();return}
      const k=(great?2:.6+R()*.8)*[1,1.25,1.5][lv-1]*(x.tier?1.2:1);
      for(const s in x.gain){const g=Math.round(x.gain[s]*k);fStat(s,g);f.tinv[s]=(f.tinv[s]||0)+g}
      const ok0=typeof x.ok[0]==='function'?x.ok[0]():x.ok[0];
      addLog(T((great?'대성공! ':'')+ok0),great?'good':'neutral');if(x.ok[1])x.ok[1]();
      if(!x.rest){const key=x.id||x.l;f.tlv[key]=(f.tlv[key]||0)+1;f.tsum++;
        const nl=z_lv(x);if(nl>lv&&Z_LVUP[nl])addLog(T(pick(Z_LVUP[nl])+' ('+Z_LV[nl-1]+')'),'good');
        const nt=z_tier();if(nt>tier)addLog(T('{n}의 훈련 레벨이 '+['','1이','2가','3이','4가'][nt+1]+' 되었습니다. 해 볼 수 있는 일이 늘었습니다.'),'star')}
      if(great)remember(x.rest?'푹 잤다. 몸이 가벼웠다.':'해냈다. 조금 강해졌다.',1.1);
      if(!x.rest)f.stress+=.02;
      if(R()<.12)fTwist();
    }}})});
};
/* a fish that played dead too well, flushed alive */
(()=>{const fl0=FEND.flushalive.l;FEND.flushalive.l=p=>{const L=fl0(p);
  if(p==='act')L[0]='{n}이 바닥에 옆으로 누워 꼼짝하지 않았습니다. 연습한 대로였습니다. 주인은 죽은 줄 알았습니다.';return L}})();

/* ======================= 2. stat routes ======================= */
/* the everyday route lines (FFL3) open by share of the species cap and by what the player built */
(()=>{const by=o=>FFL.find(e=>e.once===o);
  const set=(o,fn,w)=>{const e=by(o);if(!e)return;e.when=fn;if(w)e.w=w};
  const lead=(...ks)=>ks.includes(z_primary());
  set('star1',()=>z_rel('c')>=.55&&z_rel('w')>=.35&&S.interest>.3&&lead('c','w')&&S.f.tank!=='pond',4);
  set('star2',()=>(S.f.fame||0)>=1&&z_rel('c')>=.7,4);
  set('star3',()=>(S.f.fame||0)>=2&&z_rel('c')+z_rel('w')>=1.4,4);
  set('tyr1',()=>z_rel('p')>=.55&&z_rel('g')>=.35&&z_hasMates()&&lead('p','g'),6);
  const t2=by('tyr2');if(t2){const w0=t2.when;t2.when=()=>(S.f.tyr||0)>=1&&z_rel('p')>=.72&&z_hasMates()&&(!w0||w0()||true)}
  const t3=by('tyr3');if(t3){t3.when=()=>(S.f.tyr||0)>=2&&z_rel('p')>=.82&&!!weakMate()&&(typeof ofx_hostile!=='function'||ofx_hostile())}
  set('gen1',()=>z_rel('w')>=.75&&S.interest>.3&&lead('w')&&S.f.tank!=='pond',3);
  set('gen2',()=>z_rel('w')>=.65&&S.interest>.3,2);
  set('gen3',()=>z_rel('w')>=.75&&!S.f.lid&&S.f.tank!=='pond'&&(fx_().jump||0)>=.2,3);
  const g4=by('gen4');if(g4){const w0=g4.when;g4.when=()=>z_rel('w')>=.6&&(fGroup('CICH')||tm('curious'))&&S.f.tank!=='pond'}
  set('surv1',()=>S.interest<.45&&fx_().hardy>=.6&&z_rel('g')>=.55&&z_primary()==='g',5);
  set('surv2',()=>S.interest<.5&&z_rel('g')>=.55,4);
  set('charm1',()=>z_rel('c')>=.75&&S.f.tank!=='pond'&&tankL()<=64,2);
})();
/* the end of a long life says what kind of fish it was — what the player built */
fStatLine=function(){if(!S.f||!S.f.st)return null;const k=z_primary();if(z_rel(k)<.7)return null;
  const pond=S.f.tank==='pond';
  return pick({
   p:['{n}은 수조에서 가장 힘이 센 물고기였습니다. 물살을 거슬러 오르던 꼬리 힘은 마지막 해까지 남아 있었습니다.','{n}이 지나가면 다른 물고기들이 길을 비켰습니다. 그 길은 끝까지 {n}의 것이었습니다.'],
   g:['{n}은 끝까지 지지 않는 물고기였습니다. 고비마다 다시 지느러미를 폈습니다.','{n}은 아무도 보지 않는 몇 달도 버텨 낸 물고기였습니다.'],
   w:['{n}은 위험을 먼저 알아채는 물고기였습니다. 그림자가 지나가기 전에 이미 숨어 있었습니다.','{n}은 수조의 모든 틈과 모든 소리를 알고 있었습니다.'],
   c:[pond?'주인은 오래도록, 연못가에 쪼그려 앉으면 {n}이 제일 먼저 수면으로 올라오던 모습을 기억했습니다.':'주인은 오래도록 {n}이 유리 앞에 나와 기다리던 모습을 기억했습니다.','주인의 휴대폰 사진첩에는 {n}의 사진이 천 장 넘게 남았습니다.']}[k])};

/* the climax of each route: a choice that can end the life well or badly */
const z_hap=(cat,l)=>({kind:'happy',cat,tier:'story',fx:'f-home',l});
const z_lifeLeft=()=>ageLabel(Math.max(S.ageM+2,S.sp.life*(.7+R()*.25)));
fev([
 {id:'STAR-C',stage:'home',tier:'story',once:1,w:5,when:()=>(S.f.fame||0)>=2&&S.f.tank!=='pond',
  p:'수조 앞에 조명 네 개와 카메라 두 대가 섰습니다. 방송국 사람들이 "한 번만 더"를 되풀이합니다. 조명 아래에서 물이 조금씩 데워집니다. {n}은…',
  o:[
   {l:'조명 한가운데로 나가 지느러미를 끝까지 편다',chk:()=>['c',Math.round(capOf('c')*.8)],ok:{end:'STAR-H'},
    no:[[1,{end:'STAR-D'}],[2,{t:'{n}은 조명 아래에서 몇 번 지느러미를 폈다가 바닥으로 내려갔습니다. 아가미가 한참 동안 빨랐습니다. 방송에는 3초가 나갔습니다.',c:'bad',fx:{h:-14,st:.15}}]]},
   {l:'조명이 꺼지는 짧은 순간에만 나온다',chk:()=>['w',Math.round(capOf('w')*.75)],
    ok:{t:'촬영 감독은 {n}이 조명이 꺼질 때만 나온다는 걸 알아채고 조명을 반으로 줄였습니다. 그 장면이 방송의 마지막을 장식했습니다.',c:'good',fx:{c:3,i:.1},run:()=>{S.f.fame=3}},
    no:{t:'{n}이 나오는 순간 조명이 다시 켜졌습니다. 놀란 {n}이 유리에 부딪혔습니다.',c:'bad',fx:{h:-8,st:.1}}},
   {l:'수초 뒤로 들어가 나오지 않는다',ok:{t:'촬영은 두 시간 늦게 끝났습니다. 방송에는 {n} 대신 옆집 수조의 물고기가 나갔습니다. 주인은 한동안 {n}에게 말을 걸지 않았습니다.',c:'sub',fx:{i:-.12},run:()=>{S.f.fame=1}}}
  ]},
 {id:'TYR-C',stage:'home',tier:'likely',once:1,w:5,when:()=>(S.f.tyr||0)>=1&&z_rel('p')>=.7&&z_hasMates(),
  p:()=>'주인이 새 물고기를 들였습니다. '+(fx_().cm>=40?'{n}과 몸길이가 비슷한':'{n}보다 한 뼘 큰')+' 몸이 수조 한가운데를 차지하고, {n}이 늘 머물던 자리를 봅니다. {n}은…',
  o:[
   {l:'정면으로 들이받는다',chk:()=>['p',Math.round(capOf('p')*.85)],ok:{end:'TYR-H'},
    no:[[1,{end:'TYR-D'}],[2,{t:'{n}이 들이받은 순간 상대의 턱이 {n}의 옆구리를 물었습니다. 비늘 한 줄이 뜯겨 나가고 분홍색 근육이 드러났습니다. 주인이 칸막이를 꽂았습니다.',c:'bad',fx:{h:-22,st:.2},run:()=>{S.f.tyr=1}}]]},
   {l:'은신처를 지키며 상대가 지칠 때를 기다린다',chk:()=>['w',Math.round(capOf('w')*.7)],
    ok:{t:'{n}은 은신처 입구만 지켰습니다. 상대는 며칠 동안 수조를 돌다 지쳐 구석에 자리를 잡았습니다. 수조는 둘로 나뉘었습니다.',c:'good',fx:{w:3}},
    no:{t:'상대가 은신처 안까지 들어왔습니다. {n}은 꼬리지느러미 절반을 뜯기고 밖으로 밀려났습니다.',c:'bad',fx:{h:-15,fin:.3},run:()=>{S.f.tyr=0}}},
   {l:'수조 구석에서 지느러미를 접는다',ok:{t:'{n}은 수조의 가장 좋은 자리를 내주었습니다. 그날부터 {n}은 남은 부스러기를 먹었습니다.',c:'bad',fx:{st:.15},run:()=>{S.f.tyr=0}}}
  ]},
 {id:'GEN-C',stage:'home',tier:'story',once:1,w:1.5,when:()=>z_rel('w')>=.85&&z_primary()==='w'&&(S.once.ffgen1||fl('mapped'))&&S.f.tank!=='pond',
  p:'주인이 휴대폰 화면에 손가락으로 그림을 그려 유리에 댑니다. 동그라미, 세모, 지그재그. "따라 해 봐." 방 안에는 카메라가 켜져 있습니다. {n}은…',
  o:[
   {l:'손가락이 그린 모양대로 헤엄친다',chk:()=>['w',Math.round(capOf('w')*1.05)],ok:()=>R()<.6?{end:'GEN-H'}:{t:'{n}은 동그라미와 세모를 따라 그렸습니다. 영상은 조회수 이백을 넘기지 못했고, 주인은 다음 날 출근했습니다.',c:'sub',fx:{w:2}},
    no:{t:'{n}은 동그라미까지는 따라 했습니다. 세모에서 유리벽에 부딪혔습니다. 영상은 "물고기 실패 모음"에 실렸습니다.',c:'bad',fx:{h:-5,st:.05}}},
   {l:'틈을 알고 있는 뚜껑 쪽으로 간다',when:()=>fl('mapped')||fl('escapey'),chk:()=>['w',Math.round(capOf('w')*.8)],
    ok:()=>isSp('@airbreather')?{end:'GEN-E'}:{end:'GEN-D'},no:{t:'{n}은 틈 앞에서 멈췄습니다. 주인이 그 장면을 보고 뚜껑 틈을 테이프로 막았습니다.',c:'sub',fx:{w:2}}},
   {l:'유리 앞에서 가만히 주인을 본다',ok:{t:'주인은 한참 기다리다 휴대폰을 내렸습니다. "그래, 너는 물고기지." 그날 저녁 먹이는 조금 많았습니다.',c:'sub',fx:{i:.03}}}
  ]},
 {id:'SURV-C',stage:'home',tier:'likely',once:1,w:6,when:()=>z_rel('g')>=.7&&S.interest<.45&&(S.once.ffsurv1||S.once.ffsurv2)&&S.f.tank!=='pond',
  p:'주인이 몇 주째 수조를 보지 않습니다. 물은 초록색이고 바닥에는 녹은 사료가 쌓였습니다. 오늘은 현관에서 낯선 사람들 목소리와 짐 옮기는 소리가 납니다. {n}은…',
  o:[
   {l:'초록 물속 이끼를 갉으며 버틴다',chk:()=>['g',Math.round(capOf('g')*.85)],ok:{end:'SURV-H'},no:{run:()=>{render();fEnd('left')}}},
   {l:'유리 앞에서 몸을 크게 튕긴다',chk:()=>['c',Math.round(capOf('c')*.65)],
    ok:{t:'짐을 나르던 사람이 수조 앞에서 멈췄습니다. "여기 살아 있는데요?" 주인은 한참 머뭇거리다 대답했습니다. "가져가실래요?"',c:'sub',run:()=>fRehome('{n}은 이삿짐 센터 직원의 집으로 갔습니다.',{own:'casual',note:'이사하며 남에게 줌'})},
    no:{run:()=>{render();fEnd('left')}}},
   {l:'바닥에 가만히 있는다',ok:()=>R()<.35*z_rel('g')?{end:'SURV-H'}:{run:()=>{render();fEnd('left')}}}
  ]}
]);
fevEnd({
 'STAR-H':z_hap('방송 스타',()=>['방송이 나간 뒤 {n}의 영상은 몇 주 동안 추천 목록 맨 위에 있었습니다.','주인은 {n}의 이름으로 굿즈를 만들고, 수조를 거실 한가운데로 옮겼습니다. 수조는 두 배로 커졌고 물은 늘 맑았습니다.',
   '{n}은 '+josa(z_lifeLeft(),'을')+' 살았습니다. 마지막 영상의 제목은 "고마웠어"였고, 조회수는 첫 영상의 백분의 일이었습니다.']),
 'STAR-D':{kind:'bad',cat:'촬영',tier:'likely',fx:'f-float',pl:[[0,'촬영 조명 아래 몇 시간 둠']],fact:'fTemp',
   l:['조명 네 개가 몇 시간 동안 작은 수조 위를 비췄습니다. 물이 한 시간에 한 도씩 오릅니다.','수온이 오를수록 물에 녹는 산소는 줄고, {n}의 몸이 쓰는 산소는 늘어납니다. {n}은 아가미 뚜껑을 쉬지 않고 움직이며 조명 아래에서 지느러미를 폅니다.',
     '촬영 감독이 "지금 좋다"고 말한 순간 {n}의 몸이 기울어집니다. 아가미 새엽에 피가 몰려 검붉게 부풀고, 몸통 근육이 잘게 떨립니다.','{n}은 수면 바로 아래에서 옆으로 누운 채 떠오릅니다. 그 장면은 편집되었습니다.']},
 'TYR-H':z_hap('수조의 왕',()=>['{n}이 정면으로 들이받자 새로 온 물고기가 수조 구석까지 밀려났습니다. 사흘 뒤 주인은 새 물고기를 가게에 되돌려 보냈습니다.','"우리 애는 혼자 키워야 하나 봐." 수조는 다시 {n} 혼자의 것이 되었습니다.',
   '{n}은 그 수조에서 '+josa(z_lifeLeft(),'을')+' 살았습니다. 가게로 돌아간 물고기는 그 주에 다른 집으로 팔려 갔고, 그 집 수조에는 작은 물고기가 열 마리 있었습니다.']),
 'TYR-D':{kind:'bad',cat:'싸움',tier:'likely',fx:'f-eaten',pl:[[2,'덩치 큰 새 물고기와 합사']],fact:'fChain',
   l:()=>['{n}이 들이받은 순간 상대가 몸을 틀어 {n}의 옆구리를 물었습니다.','상대의 이빨이 비늘 밑 근육까지 들어갔다가 빠집니다. 뜯긴 자리에서 피가 물에 풀리고, 상대는 그 냄새를 따라 다시 덤빕니다.',
     '{n}은 은신처로 들어가려 하지만 은신처 입구는 이미 상대의 자리입니다. 두 번째, 세 번째 물린 자리에서 꼬리자루 근육이 찢겨 척추가 드러납니다.','아침에 주인이 본 것은 바닥에 누운 {n}과, 그 옆에서 지느러미를 펴고 있는 새 물고기였습니다.']},
 'GEN-H':z_hap('개체 7',()=>['영상이 퍼지고 열흘 뒤, 한 대학 연구실에서 연락이 왔습니다. "물고기 학습 실험에 협조해 주실 수 있을까요?"','{n}은 연구실의 큰 수조로 옮겨졌습니다. 물은 매일 검사되었고, 먹이는 정해진 시간에 정해진 양만큼 들어왔습니다.',
   '{n}은 '+josa(z_lifeLeft(),'을')+' 그곳에서 살았습니다. 논문 그림 3에 {n}이 실렸습니다. 이름은 "개체 7"이었습니다.']),
 'GEN-E':z_hap('탈출 성공',()=>['{n}은 전선 구멍으로 몸을 밀어 넣고 바닥으로 떨어졌습니다. 공기로 숨을 쉴 수 있는 몸이었습니다.','{n}은 젖은 바닥을 따라 욕실까지 기어갔고, 물이 반쯤 찬 빨래 대야에 들어갔습니다.',
   '다음 날 아침 주인은 대야 속 {n}을 보고 소리를 질렀습니다. 그 뒤로 {n}은 대야만 한 수조가 아니라 대야 두 개만 한 수조에서 '+josa(z_lifeLeft(),'을')+' 살았습니다. 뚜껑은 나사로 박혀 있었습니다.']),
 'GEN-D':{kind:'bad',cat:'탈출',tier:'fact',fx:'f-floor',pl:[[3,'뚜껑 틈을 막지 않음']],fact:'fJumpF',
   l:()=>['{n}은 알고 있던 전선 구멍으로 몸을 밀어 넣었습니다. 틈은 몸통보다 조금 좁았습니다.','틈을 지나며 옆구리 비늘이 긁혀 떨어지고, {n}은 수조 받침 뒤 마룻바닥으로 떨어집니다.'].concat(oe_dry('받침 뒤 먼지 속에서'),['주인은 사흘 뒤에야 냄새를 따라 받침을 들어냈습니다.'])},
 'SURV-H':z_hap('남겨진 수조',()=>['이삿짐이 다 나가고 집이 비었습니다. 수조만 남았습니다. 전기가 끊기고 여과기가 멈췄지만, 초록 물에는 이끼가 가득했습니다.','{n}은 이끼를 갉으며 열이틀을 버텼습니다. 열사흘째, 새로 이사 온 사람이 수조를 보고 그 자리에 주저앉았습니다.',
   '새 주인은 물을 갈고 수조를 거실로 옮겼습니다. {n}은 '+josa(z_lifeLeft(),'을')+' 그 집에서 살았습니다. 앞의 주인은 끝내 연락하지 않았습니다.']),
 'KEEP-BIG-E':{kind:'release',cat:'보내 줌',tier:'fact',fx:'f-euth',fact:'fEuth',
   l:()=>['받아 줄 곳은 끝내 없었습니다. 주인은 {n}을 강에 놓아줄 수 없다는 것을 알고 있었습니다.','주인은 {n}을 대형어를 보는 동물병원에 데려갔습니다. 수의사가 마취제를 푼 물에 {n}을 옮겼습니다.',
     '마취제가 아가미로 들어가 먼저 감각을, 그다음 움직임을 멈춥니다. {n}의 아가미 뚜껑이 느려지다 멈춘 뒤에도 수의사는 한참을 기다렸다가 두 번째 약을 넣었습니다.','주인은 빈 수조를 몇 달 동안 치우지 않았습니다.']}
});

/* ======================= 3. diseases ======================= */
/* a fish that has had a disease is less likely to get it again, and each bout makes the next one rarer */
(()=>{const _s=fSick;fSick=function(id){const f=S.f;
  if(f&&!f.ill&&DZ[id]&&!S.done&&!S.ending){f.dzHad=f.dzHad||{};f.dzN=(f.dzN||0)+1;f.dzHad[id]=(f.dzHad[id]||0)+1}
  return _s(id)}})();
(()=>{const _p=fPickDz;fPickDz=function(){const f=S.f,had=f.dzHad||{};
  const w=fx_().dz.map(([id,wt])=>[id,wt*(had[id]?.2:1)]).concat(Z_DZADD.filter(a=>a.sp()).map(a=>[a.id,a.w()*(had[a.id]?.2:1)]));
  return w.length?wpick(w):_p()}})();
/* fewer bouts: the background chance falls with each disease already had (the rate is read in fishTick) */
const Z_DZ_DAMP=.6;
Object.assign(DZ,{
 lernaea:{n:'닻벌레',sym:'{n}의 옆구리에 가는 실 같은 것이 박혀 꼬리를 흔듭니다. 박힌 자리가 붉게 부었습니다.',ov:'pits',prog:.25,cure:.65,fact:'fLernaea'},
 argulus:{n:'물이',sym:'{n}의 몸에 납작하고 투명한 것이 붙어 기어 다닙니다. 붙었던 자리마다 붉은 점이 남았습니다.',ov:'pits',prog:.3,cure:.7,fact:'fLernaea'},
 lympho:{n:'림프낭포병',sym:'{n}의 지느러미 끝과 입가에 하얀 좁쌀 같은 덩어리가 돋았습니다.',ov:'ich',prog:.1,cure:.45,fact:'fLympho'},
 gasb:{n:'가스병',sym:'{n}의 지느러미 막 사이에 작은 기포가 줄지어 맺혔습니다. 눈이 조금 밀려 나왔습니다.',ov:'popeye',prog:.6,cure:.6,fact:'fGas'}
});
const Z_DZADD=[
 {id:'lernaea',sp:()=>isSp('@gold','koi')||S.f.wild,w:()=>S.f.tank==='pond'?3:1},
 {id:'argulus',sp:()=>isSp('@gold','koi'),w:()=>S.f.tank==='pond'?3:.7},
 {id:'lympho',sp:()=>isSp('altum','oscar','apisto','fig8','peapuffer','betta','wildbetta'),w:()=>1},
 {id:'gasb',sp:()=>true,w:()=>.35}
];
Object.assign(F,{
 fLernaea:'닻벌레와 물이는 물고기 몸에 붙어 사는 갑각류 기생충입니다. 연못이나 야생에서 온 물고기, 살아 있는 먹이를 따라 수조에 들어오고, 붙었던 상처로 세균 감염이 뒤따릅니다.',
 fLympho:'림프낭포병은 이리도바이러스가 피부 세포를 비정상적으로 키워 생기는 병입니다. 치료약은 없고 대개 저절로 사라지지만, 입 주변에 생기면 먹이를 먹지 못하게 됩니다.',
 fGas:'가스병은 기체가 지나치게 녹아 있는 물에서 생깁니다. 차가운 수돗물을 갑자기 데우거나 압력이 높은 물을 그대로 넣으면, 물에 녹은 질소가 핏속에서 기포가 됩니다.'
});
Object.assign(oe_DZ,{
 lernaea:['닻벌레 암컷이 머리의 닻 모양 돌기를 {n}의 근육 속에 박아 넣습니다. 박힌 자리 둘레의 비늘이 일어나고, 피부가 붉게 부어 궤양이 됩니다.',
  '궤양 가장자리로 세균과 물곰팡이가 파고듭니다. 몸 밖에 매달린 닻벌레 몸통 끝에서 하얀 알주머니 두 개가 흔들립니다.',
  '박힌 구멍마다 진물이 흐릅니다. {n}은 바닥 돌에 옆구리를 문지르다 그 자리에 기울어 멈춥니다.'],
 argulus:['물이가 {n}의 피부에 납작하게 붙어 입침을 꽂고 피를 빨아들입니다. 침과 함께 들어간 소화 효소가 피부를 붉게 붓게 합니다.',
  '물린 자리마다 점막이 벗겨지고 작은 출혈점이 번집니다. {n}은 몸을 비틀어 유리와 돌에 부딪히며 털어 내려 합니다.',
  '상처로 세균이 들어가 핏속으로 퍼집니다. 피를 잃은 아가미가 하얗게 질리고, {n}은 수면 아래에서 비스듬히 멈춥니다.'],
 lympho:['바이러스가 피부 섬유모세포를 수십 배 크기로 키웁니다. 지느러미와 입가에 하얀 콜리플라워 모양의 덩어리가 자랍니다.',
  '입가의 덩어리가 커지자 {n}은 입을 다물지 못하고 먹이를 삼키지 못합니다. 몸은 간의 지방과 근육을 분해해 버팁니다.',
  '덩어리 표면이 터진 자리로 세균이 들어갑니다. {n}은 등이 칼날처럼 얇아진 몸으로 바닥에 기웁니다.'],
 gasb:['물에 녹을 수 있는 양보다 많은 기체가 녹아 있습니다. 아가미를 지나 핏속에 들어간 질소가 혈관 안에서 기포가 됩니다.',
  '지느러미 막과 눈 뒤에 작은 기포가 맺힙니다. 눈알이 밀려 나오고, 지느러미 막 사이에 투명한 물방울이 줄지어 섭니다.',
  '아가미 혈관 속 기포가 피의 흐름을 막습니다. {n}은 수면 근처에서 균형을 잃고 돌다 멈춥니다.']
});
/* species that meet these diseases get them in their own list too (catalogue and art read DZ) */
/* what each healed disease leaves behind */
const Z_HEAL={
 ich:'백점병이 나았습니다. 하얀 점이 빠진 자리마다 작은 흉이 남았습니다. 한 번 이겨 낸 몸은 같은 기생충을 조금 더 빨리 알아봅니다.',
 velvet:'벨벳병이 나았습니다. 금빛 가루가 걷힌 자리의 피부는 한동안 거칠었습니다.',
 columnaris:'솜병이 나았습니다. 녹았던 입술 가장자리는 다시 붙지 않아 입 모양이 조금 비뚤어졌습니다.',
 aero:'솔방울병이 가라앉았습니다. 일어섰던 비늘이 눕기까지 한 달이 걸렸고, 몇 장은 끝내 빠졌습니다.',
 finrot:'지느러미썩음병이 멈췄습니다. 지느러미는 다시 자랐지만 줄기가 휘어 예전 모양이 아니었습니다.',
 fungus:'물곰팡이가 걷혔습니다. 솜뭉치가 있던 자리는 비늘 없이 매끈하게 아물었습니다.',
 hex:'구멍병이 멈췄습니다. 머리의 구멍들은 메워졌지만 흉터는 평생 남았습니다.',
 tetra:'테트라히메나를 이겨 냈습니다. 하얗게 벗겨졌던 자리의 근육이 조금 움푹 꺼진 채 아물었습니다.',
 swimb:'부레병이 나았습니다. {n}은 그 뒤로도 배불리 먹은 날이면 몸이 조금 기울었습니다.',
 skinny:'마름병이 나았습니다. 꺼졌던 배가 다시 차오르기까지 몇 주가 걸렸습니다.',
 worms:'내부 기생충이 빠져나갔습니다. 꺼졌던 배가 다시 차오르기까지 몇 주가 걸렸습니다.',
 lernaea:'닻벌레를 핀셋으로 뽑아낸 자리에 작은 구멍이 남았고, 몇 주 뒤 아물었습니다.',
 argulus:'물이가 사라졌습니다. 붉은 점들은 한동안 남았다가 옅어졌습니다.',
 lympho:'하얀 덩어리들이 몇 주에 걸쳐 저절로 떨어져 나갔습니다.',
 gasb:'물을 천천히 맞추자 기포가 빠졌습니다. 한쪽 눈은 조금 밀려 나온 채로 남았습니다.'
};
/* catalogue health events: each one seen makes the next a little rarer, so a life is not a list of illnesses */
(()=>{const _pool=fevPool;fevPool=function(stage,hap){
  const hn=S&&S.seen?Object.keys(S.seen).filter(k=>/^evHLT-/.test(k)).length:0;
  return _pool(stage,hap).map(([e,w])=>[e,w*(/^HLT-/.test(e.id)?Math.pow(.55,hn):1)*(e.id==='HAP-13'?(fl('playdead')?1.4:.6):1)]).filter(z=>z[1]>0)}})();

/* ======================= 4. endings: more than one version ======================= */
const Z_VAR={
 neglect:[
  {when:()=>S.f.tank!=='pond'&&tankL()>=30,l:()=>['수조 유리 안쪽이 초록 이끼로 덮여 바깥이 보이지 않게 되었습니다. 주인도 안을 보지 않았습니다.',
   '여과기 스펀지가 찌꺼기로 막혀 물이 돌지 않습니다. 바닥 모래 속에서 썩은 사료가 검게 변하고, 달걀 썩는 냄새가 올라옵니다.',
   '모래를 뒤적이던 {n}의 아가미로 검은 물이 들어갑니다. 아가미 새엽 끝이 검게 상하고, 새엽 사이에 낀 찌꺼기가 빠지지 않습니다.',
   '{n}은 수면 가까이에서 지느러미를 접고 버팁니다. 몇 주 뒤 주인이 이끼를 닦아 냈을 때, {n}은 이끼 아래 유리에 기댄 채 굳어 있었습니다.']},
  {when:()=>S.f.tank==='pond',l:()=>['연못에 낙엽이 쌓여 수면을 덮었습니다. 아무도 걷어 내지 않았습니다.',
   '물에 잠긴 낙엽이 썩으며 물속 산소를 씁니다. 바닥 쪽 물부터 산소가 사라집니다.',
   '{n}은 수면으로 올라가 낙엽 사이 작은 틈에 입을 댑니다. 산소를 찾지 못한 아가미 새엽이 검붉게 부풉니다.',
   '봄이 되어 주인이 연못을 치울 때, 썩은 낙엽 더미 속에서 {n}의 하얀 등뼈가 나왔습니다.']},
  {l:()=>['주인은 먹이를 일주일에 한 번, 생각날 때만 주었습니다. 줄 때는 통째로 쏟았습니다.',
   '굶은 몸이 쏟아진 사료를 한꺼번에 삼킵니다. 불어난 사료가 장을 막고, 남은 사료는 바닥에서 썩어 암모니아가 됩니다.',
   '장이 막힌 배가 부풀고, 암모니아가 아가미 새엽을 붓게 합니다. {n}은 배를 위로 한 채 떠올랐다가 지느러미로 몸을 뒤집기를 되풀이합니다.',
   '사흘째 아침, {n}은 다시 몸을 뒤집지 못했습니다.']}],
 cycle:[
  {when:()=>tankL()<30,l:()=>['새 어항에 수돗물을 받아 바로 {n}을 넣었습니다. "물이 맑으니까 괜찮아."',
   '첫 사흘은 아무 일도 없었습니다. 나흘째부터 배설물에서 나온 암모니아가 걸러지지 않고 쌓입니다.',
   '암모니아가 아가미 새엽의 상피를 녹입니다. 새엽 끝이 붉게 부어오르고, 옆 새엽과 서로 들러붙습니다.',
   '{n}은 수면에서 입을 뻐끔거리다 바닥으로 내려가기를 되풀이합니다. 일주일째 아침, {n}의 아가미 뚜껑 가장자리는 붉게 물들어 있었습니다.']},
  {l:()=>['주인은 "박테리아제 한 병이면 물잡이 끝"이라는 광고를 믿었습니다.',
   '여과재에 자리 잡은 세균은 아직 거의 없었습니다. 암모니아가 그대로 쌓이고, 아질산이 뒤따라 오릅니다.',
   '아질산이 핏속 헤모글로빈을 메트헤모글로빈으로 바꿉니다. {n}의 아가미가 초콜릿색으로 변하고, 피가 산소를 싣지 못합니다.',
   '{n}은 여과기 물살 앞에서 입을 벌린 채 버티다 물살에 밀려 유리벽에 붙습니다. 주인은 박테리아제를 한 병 더 넣었습니다.']}],
 poison:[
  {when:p=>!p||p==='med',l:()=>['주인이 수조 장식으로 놋쇠 동전과 오래된 수도 부품을 넣었습니다. "녹색 빛이 예쁘잖아."',
   '물에 녹아 나온 구리가 아가미 새엽에 쌓여 상피를 부풀립니다. 점액이 늘어 새엽 사이를 메웁니다.',
   '구리는 콩팥과 간에도 쌓입니다. {n}의 몸 색이 어두워지고, 균형을 잃고 비스듬히 헤엄칩니다.',
   '{n}은 동전 옆 바닥에 옆으로 누워 아가미만 움직이다 멈춥니다.']},
  {when:p=>(!p||p==='med')&&fx_().water!=='brack',l:()=>['"소금욕이 만병통치"라는 글을 본 주인이 수조에 굵은 소금을 한 컵 부었습니다.',
   '갑자기 짜진 물이 {n}의 몸에서 물을 빨아냅니다. 아가미 새엽 세포가 쪼그라들고, 점막이 하얗게 일어납니다.',
   '{n}은 몸을 비틀며 수면과 바닥 사이를 빠르게 오르내립니다. 오를 때마다 아가미 뚜껑이 끝까지 벌어집니다.',
   '몇 시간 뒤 {n}은 바닥에 눕고, 말라 쪼그라든 지느러미가 몸에 붙었습니다.']}],
 cull:[
  {when:()=>!S.f.wild,l:()=>['선별에서 떨어진 치어들이 대야째 옆 연못으로 옮겨졌습니다. 그 연못에는 사료 대신 치어를 먹여 키우는 대형어들이 있었습니다.'].concat(oe_eat('oscar'))},
  {when:()=>!S.f.wild,l:()=>['"팔 수 없는" 치어들은 하얀 쟁반째 햇볕 드는 작업대 끝으로 밀려났습니다. 물은 몸 두께만큼만 있었습니다.',
   '한낮의 볕에 쟁반의 물이 데워지고 줄어듭니다. 드러난 등 피부의 점막이 마르고, 등지느러미 막이 갈라집니다.',
   '{n}은 남은 물에 아가미를 담그려 몸을 옆으로 눕힙니다. 바닥에 닿은 쪽 비늘이 쟁반에 들러붙습니다.',
   '저녁에 작업자가 쟁반을 기울여 비웠을 때, {n}의 몸은 쟁반 바닥에 붙어 떨어지지 않았습니다.']}],
 flushalive:[
  {when:p=>p!=='act'&&p!=='swimb'&&p!=='rest',l:()=>['주인은 움직임이 느려진 {n}을 보고 "이제 끝났나 봐"라고 말했습니다.',
   '{n}은 휴지에 싸여 변기 위로 옮겨졌습니다. 휴지가 젖자 {n}의 꼬리가 휴지 밖으로 나와 움직였습니다.',
   '물 내리는 소리와 함께 {n}은 소용돌이에 감겨 배수구로 들어갑니다. 좁은 관을 지나며 몸이 접히고, 옆구리 비늘이 관 벽에 긁혀 떨어집니다.',
   '하수관의 물에는 산소가 거의 없습니다. 황화수소가 아가미 세포의 호흡을 멈춥니다. {n}은 오물 사이에서 아가미 뚜껑을 벌린 채 떠내려갑니다.']}],
 euth:[
  {l:()=>['주인은 {n}을 작은 통에 담아 이국동물을 보는 동물병원에 데려갔습니다. 진료비는 {n}의 몸값보다 비쌌습니다.',
   '수의사가 마취제를 푼 물에 {n}을 옮겼습니다. 아가미로 들어간 마취제가 먼저 감각을, 그다음 움직임을 멈춥니다.',
   '{n}의 아가미 뚜껑이 느려지다 멈춘 뒤에도 수의사는 한참을 기다렸다가 두 번째 약을 넣었습니다.',
   '주인은 빈 통을 들고 버스를 탔습니다.']},
  {when:()=>S.ageM/S.sp.life>.7,l:()=>['{n}은 늙었습니다. 지느러미는 접힌 채 펴지지 않았고, 먹이를 쫓아 올라가지 못했습니다.',
   '주인은 오래 고민한 끝에 정향유를 샀습니다. 수조 물을 담은 통에 정향유를 풀어 몇 방울씩 떨어뜨렸습니다.',
   '유게놀이 아가미로 흡수되어 감각을 먼저 둔하게 만듭니다. {n}은 천천히 기울어 통 바닥에 눕습니다. 아가미 뚜껑이 점점 느려지다 멈춥니다.',
   '주인은 빈 수조를 한동안 치우지 않았습니다.']}],
 stress:[
  {when:()=>z_hasMates(),l:()=>['같은 수조의 물고기들이 {n}을 먹이 자리에서 밀어냈습니다. {n}은 몇 달 동안 남은 부스러기만 먹었습니다.',
   '계속된 스트레스 호르몬이 면역을 누르고, 물린 자리마다 지느러미 끝이 하얗게 짓무릅니다.',
   '짓무른 자리에서 세균이 핏속으로 들어갑니다. 배와 지느러미 밑동에 붉은 출혈 반점이 번집니다.',
   '{n}은 히터 뒤 좁은 틈에 몸을 끼운 채 멈춰 있었습니다. 주인은 히터를 꺼내다 그것을 발견했습니다.']},
  {when:()=>S.f.tank!=='pond',l:()=>['수조는 텔레비전 스피커 바로 옆이었습니다. 저녁마다 유리가 울렸습니다.',
   '물고기의 옆줄은 물의 진동을 느낍니다. 그치지 않는 진동 속에서 {n}은 숨을 곳을 찾아 수조를 맴돕니다.',
   '먹이를 거르는 날이 늘고, 색소가 빠진 몸 위로 물곰팡이 균사가 하얗게 자리를 잡습니다.',
   '어느 저녁, 축구 중계가 끝났을 때 {n}은 수조 바닥에 옆으로 누워 있었습니다.']}],
 stunt:[
  {l:()=>['{n}은 몸이 겨우 들어갈 만한 수조에서 자랐습니다. 자라는 대신 굳었습니다.',
   '등뼈가 휘고, 눌린 아가미 뚜껑이 완전히 닫히지 않습니다. 열린 틈으로 드러난 아가미 새엽 끝이 하얗게 상합니다.',
   '{n}은 수조 벽에 한쪽 몸을 기댄 채 지냅니다. 기댄 쪽 비늘이 닳아 없어지고 그 아래 피부가 붉게 짓무릅니다.',
   '어느 아침 {n}은 기댄 자세 그대로 아가미를 멈췄습니다. 주인은 "원래 이 정도 크는 물고기"라고 생각했습니다.']}],
 quarantine:[
  {l:()=>['수입업체 검역 수조 수십 개는 한 여과 계통으로 이어져 있었습니다. 한 수조에서 시작된 병이 배관을 따라 퍼졌습니다.',
   '{n}의 아가미 새엽에 흡충이 갈고리를 박습니다. 상피가 두꺼워지고 점액이 새엽 사이를 메웁니다.',
   '작업자는 약을 두 배로 넣었습니다. 흡충은 떨어졌지만 상처 난 새엽 상피도 함께 벗겨집니다.',
   '다음 날 아침 작업자는 뜰채로 바닥을 훑어 죽은 것들을 한 양동이에 담았습니다. {n}도 그 안에 있었습니다.']}]
};
Object.keys(Z_VAR).forEach(k=>{const e=FEND[k];if(!e)return;const orig=e.l;
  e.l=function(a){const vs=Z_VAR[k].filter(v=>{try{return !v.when||v.when(a)}catch(err){return false}});
    if(vs.length&&R()<vs.length/(vs.length+1))return pick(vs).l(a);return orig(a)}});
/* the disease ending: how it starts and how it stops differ */
(()=>{const d0=FEND.disease.l;FEND.disease.l=a=>{const L=d0(a),ill=S.f.ill||{},d=DZ[ill.id]||{n:'병'};
  if(!ill.noticed&&R()<.5)L[0]=pick(['주인은 {n}이 요즘 조금 덜 먹는다고만 생각했습니다.','{n}이 아프다는 건 수조 앞을 지나가던 손님이 먼저 말했습니다. 주인은 "원래 저래요"라고 했습니다.']);
  if(R()<.6)L[L.length-1]=pick(['{n}은 '+josa(d.n,'을')+' 이기지 못했습니다. 주인이 아침 먹이를 넣었을 때 {n}은 수면으로 올라오지 않았습니다.',
    '{n}은 '+josa(d.n,'을')+' 이기지 못했습니다. 여과기 흡입구 쪽으로 밀려가 몸이 붙은 채 아가미 뚜껑을 벌리고 멈춥니다.',
    '{n}은 '+josa(d.n,'을')+' 이기지 못했습니다. 수초 사이에 기울어진 채 지느러미 끝만 떨리다 멈춥니다.']);
  return L}})();
/* the owner's last line after a catalogue death: a few for each kind of owner */
const Z_AFTER={
 expert:['그날 밤 주인은 수조를 비우고, 원인을 노트에 적었습니다.','주인은 같은 수조에 다시 물고기를 들이기까지 반년을 기다렸습니다.','주인은 사진을 정리하다 마지막 사진의 날짜를 오래 보았습니다.'],
 learner:['주인은 커뮤니티에 사진을 올리고 "왜 죽었을까요"라고 물었습니다.','댓글 열두 개가 각자 다른 원인을 말했습니다. 주인은 그중 하나를 믿기로 했습니다.'],
 eager:['주인은 다음 날 같은 가게에 가서 "이번엔 잘 키워 보겠다"고 말했습니다.','주인은 수조를 닦고 같은 자리에 새 물고기를 넣었습니다. 이번에는 이름을 먼저 지었습니다.'],
 casual:['다음 날 주인은 같은 가게에서 같은 물고기를 열 마리 더 샀습니다.','주인은 빈 어항을 베란다에 내놓았습니다. 겨울이 지나도록 그대로였습니다.','"물고기는 원래 금방 죽어." 주인은 그 말을 두 번 했습니다.'],
 gift:['주인은 선물한 사람에게 아무 말도 하지 않았습니다.','선물한 사람이 "물고기는 잘 있어?"라고 물었을 때, 주인은 "응"이라고 대답했습니다.'],
 techbro:['주인은 로그 파일을 열어 버그를 고쳤습니다. 커밋 메시지는 "fix"였습니다.','주인은 수조 센서 대시보드를 지웠습니다. 마지막 그래프의 선은 평평했습니다.','주인은 "다음 버전에서는 자동 급여기를 이중화한다"고 적었습니다.'],
 relay:['주인은 빈 어항을 "어항 세트 무료 나눔"으로 올렸습니다.','"어항 가져가실 분" 글에 댓글이 금방 달렸습니다. 물고기에 대해 묻는 사람은 없었습니다.'],
 decor:['주인은 같은 색 물고기를 사 와 숫자를 맞췄습니다. 아무도 눈치채지 못했습니다.','주인은 풍수 책을 펴고, 다음 물고기는 몇 마리여야 하는지 다시 세었습니다.'],
 content:['주인은 추모 영상을 올렸습니다. 조회수는 생전 영상보다 높았습니다.','주인은 썸네일에 우는 얼굴을 넣었습니다. 영상 끝에는 새 물고기 언박싱이 붙어 있었습니다.'],
 grandma:['할머니는 한동안 어항 앞 의자에 앉아 계셨습니다.','할머니는 자식에게 전화해 "물고기가 갔다"고만 말했습니다. 자식은 "또 사 드릴게요"라고 했습니다.'],
 neglect:['주인은 {n}이 죽은 걸 일주일 뒤에 알았습니다.','주인은 수조 물을 통째로 버리고, 빈 수조를 침대 밑에 밀어 넣었습니다.'],
 staff:['주인은 다음 날 출근해 판매 수조에서 같은 종을 한 마리 골랐습니다.','주인은 다음 날 판매 수조의 같은 종 가격표를 고쳐 붙였습니다.']
};
Object.keys(Z_AFTER).forEach(k=>{AFTER[k]=()=>pick(Z_AFTER[k])});

/* one more predator in the house: a "순한" tankmate from the shop */
fev([{id:'HOM-PRED12',stage:'home',tier:'fact',w:()=>fx_().cm<=12?.6:0,cd:60,once:1,
  when:()=>S.f.tank!=='pond'&&fx_().cm<=12&&!isKind('expert'),
  log:()=>'주인이 수족관에서 "순해요, 같이 키워도 돼요"라는 말을 듣고 '+josa(z_predPick().n,'을')+' 한 마리 들였습니다. 아직 {n}보다 조금 큰 크기였습니다.',
  p:'새로 온 물고기가 수조를 천천히 돕니다. 지나갈 때마다 눈이 {n}을 따라 움직입니다. 밤마다 그 물고기의 입이 조금씩 커지는 것 같습니다. {n}은…',
  o:[
   {l:'은신처 가장 깊은 곳에 몸을 끼운다',chk:()=>['w',30],ok:{t:'{n}은 낮에도 은신처에서 나오지 않았습니다. 몇 주 뒤 새 물고기가 다른 물고기를 삼키는 걸 본 주인이 그것을 가게에 돌려보냈습니다.',c:'good',fx:{w:2,st:.1}},
    no:()=>({end:'HOM-PRED12-D'})},
   {l:'주인이 볼 때마다 유리 앞에서 맴돈다',chk:()=>['c',35],ok:{t:'주인이 {n}과 새 물고기 사이를 오래 보다가 검색을 했습니다. 그날 밤 새 물고기는 다른 수조로 옮겨졌습니다.',c:'good',fx:{c:2},near:'mates'},
    no:()=>({end:'HOM-PRED12-D'})},
   {l:'평소처럼 지낸다',ok:()=>R()<.6?{end:'HOM-PRED12-D'}:{t:'새 물고기는 {n} 대신 다른 작은 물고기를 먼저 삼켰습니다. 주인은 그제야 그것을 다른 수조로 옮겼습니다.',c:'bad',fx:{st:.15}}}
  ]}]);
const Z_PREDS=[{id:'oscar',n:'타이거 오스카'},{id:'channa',n:'레인보우 스네이크헤드'},{id:'arowana',n:'아로와나'},{id:'bichir',n:'폴립테루스'}];
function z_predPick(){if(!S.f.z_pred||!Z_PREDS.find(p=>p.id===S.f.z_pred))S.f.z_pred=pick(Z_PREDS.filter(p=>p.id!==S.sp.id)).id;return Z_PREDS.find(p=>p.id===S.f.z_pred)}
fevEnd({'HOM-PRED12-D':{kind:'bad',cat:'잡아먹힘',tier:'fact',fx:'f-eaten',pl:[[2,'"순하다"는 육식어와 합사']],fact:'fChain',
  l:()=>['석 달 사이 '+josa(z_predPick().n,'은')+' {n}의 두 배가 되었습니다.'].concat(oe_eat(z_predPick().id,'어느 밤, 수조 불이 꺼지자 '+josa(z_predPick().n,'이')+' 은신처 입구 앞에 멈췄습니다.'),['아침에 주인은 비늘 몇 장과, 배가 불룩한 '+josa(z_predPick().n,'을')+' 보았습니다.'])}});
/* a free give-away more often goes to a predator owner */
(()=>{const _r=fRehome;fRehome=function(text,opt){
  if((!opt||!opt.own)&&/무료 분양/.test(text)&&fx_().cm<=12&&R()<.1){const p=z_predPick();
    q(T(text),'bad',()=>breakP(0,(opt&&opt.note)||'파양'));q(T('{n}을 데려간 사람은 "잘 키울게요"라고 했습니다. 그 사람의 수조에는 '+p.n+'가 있었습니다.'),'sub');q(null,null,()=>fEnd('feeder',p.id));return}
  return _r(text,opt)}})();

/* ======================= 5. consistency ======================= */
/* a breeder's escape that is a jump: only for fish that jump; the rest go down the siphon hose */
FEV.filter(e=>/^TRK-B/.test(e.id)).forEach(e=>(e.o||[]).forEach(o=>{if(o.chk!==trk_jc)return;
  const L=o.l,OK=o.ok,NO=o.no,jumper=()=>(fx_().jump||0)>=.1;
  o.l=()=>jumper()?valOf(L):'물을 빼는 호스 입구 쪽으로 다가간다';
  o.chk=()=>jumper()?trk_jc():['w',35];
  o.ok=()=>jumper()?valOf(OK):trk_esc('{n}은 호스 입구로 빨려 들어갔습니다. 양동이에 쏟아진 물은 그대로 욕실 배수구로 부어졌고, {n}도 함께 쓸려 내려갔습니다.','호스가 물을 빨았다. 함께 빨려 갔다.');
  o.no=()=>jumper()?valOf(NO):{t:'호스 입구가 {n}의 옆구리를 빨아들였다가 놓았습니다. 비늘 몇 장과 점막이 호스 안으로 사라졌습니다.',c:'bad',fx:{h:-8}}}));
/* things that were set up get a follow-up */
FFL.push(
 {t:'수조 받침 아래 마룻바닥에 물자국이 번졌습니다. 실리콘 이음매에 맺히던 물방울이 이제는 가늘게 흘러내립니다.',c:'bad',once:'leak2',w:3,when:()=>!!S.f.leak&&S.f.tank!=='pond',
  fx:()=>{if(S.r>.45&&R()<.6){q(T('주인이 젖은 바닥을 밟고서야 수조를 보았습니다. 그 주에 물고기들을 큰 통으로 옮기고 수조를 새로 들였습니다.'),'good',()=>{S.f.leak=0;S.f.stress+=.1});return}
   S.f.leak=2;S.f.wq-=6;if(R()<.35)q(null,null,()=>{if(!S.waiting&&!S.ending)fCr('burst')})}},
 {t:'새 집에서 일주일, 수조 물이 뿌옇게 흐려지고 비린내가 났습니다. 말랐던 여과재 속 세균이 다시 자라는 동안 암모니아가 쌓였습니다.',c:'bad',once:'drymedia',w:4,when:()=>!!fl('drymedia'),
  fx:()=>{S.f.wq-=12;S.f.stress+=.08;S.health-=6;setFl('drymedia',0)}}
);
FFL.forEach((e,i)=>{if(e.i===undefined)e.i=i});

/* fewer diseases in the background: the rate in fishTick reads S.f.dzN through this factor */
const z_dzK=()=>Math.pow(Z_DZ_DAMP,(S.f&&S.f.dzN)||0);
