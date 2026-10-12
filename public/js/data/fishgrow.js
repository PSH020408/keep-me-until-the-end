/* ---------- raising the fish (v0.9.21) ----------
   Three things were added here:
   1. The fish's own stats, 근성 (guts) · 영리함 (wits) · 애교 (charm), 0–100, raised by a schedule
      chosen every few months ("이번 시기, {n}은 어떻게 지낼까?") and a little by every choice.
      - guts makes the surviving outcomes of a crisis likelier,
      - wits lowers the hazards where the fish's own behaviour matters (jumping, being eaten, the cat, the siphon…),
      - charm slows the owner's loss of interest and makes giving the fish away less likely.
   2. How each species breeds (FX[id].brood), so a guppy gives birth and a goldfish scatters eggs.
   3. Owners who learn from a mistake, owners who know and do not bother, and owners who never notice.
   Small surprises ("twists") follow some choices, so the same choice does not always end the same way. */

/* ---------- 1. breeding ---------- */
const BROOD={
  live:{l:'난태생',egg:0}, mouth:{l:'입에 알을 품음',egg:1}, bubble:{l:'거품 둥지',egg:1},
  guard:{l:'알을 지킴',egg:1}, cave:{l:'굴에 알을 낳음',egg:1}, scatter:{l:'알을 흩뿌림',egg:1},
  stick:{l:'알을 붙임',egg:1}, farm:{l:'호르몬으로만 번식',egg:1}, rare:{l:'번식이 드묾',egg:1}
};
Object.entries({oranda:'scatter',comet:'scatter',ryukin:'scatter',koi:'scatter',neon:'scatter',peapuffer:'scatter',bichir:'scatter',gar:'scatter',
  betta:'bubble',wildbetta:'mouth',channa:'mouth',arowana:'mouth',guppy:'live',platy:'live',motoro:'live',
  altum:'guard',oscar:'guard',fig8:'rare',apisto:'cave',pleco:'cave',cory:'stick',clownloach:'farm',ghost:'farm'}).forEach(([k,v])=>{if(FX[k])FX[k].brood=v});
const brood=()=>fx_().brood||'scatter';
const isLive=()=>brood()==='live';
/* the words that change: 알/새끼, 산란/출산 */
const BW=()=>isLive()?{one:'새끼',lay:'낳았습니다',spawn:'출산',many:S.sp.id==='motoro'?'새끼 몇 마리':'새끼 수십 마리'}:{one:'알',lay:'낳았습니다',spawn:'산란',many:'알 수백 개'};

/* breeding texts in the older tables that assumed eggs */
(()=>{
  const e=FCH.find(c=>c.id==='eggs');
  if(e){e.when=()=>['guard','cave'].includes(brood())&&fSameCount()>=1&&S.ageM>S.sp.life*.12;
    Object.defineProperty(e,'p',{get:()=>brood()==='cave'?'굴 안 천장에 알이 붙어 있다. 다른 물고기들이 굴 입구를 기웃거린다. 나는…':'닦아 둔 돌 위에 알이 붙어 있다. 다른 물고기들이 다가온다. 나는…',enumerable:true})}
  const m=FSIT.find(c=>c.id==='g-mate');
  if(m)m.o.forEach(o=>{
    if(o.l==='상대를 따라다니며 구애한다')o.out[0][1]=()=>isLive()?'한 달쯤 뒤, 수조 구석에서 눈만 까만 새끼들이 헤엄치고 있었습니다.':brood()==='stick'?'며칠 뒤 유리벽에 좁쌀만 한 알이 줄지어 붙었습니다.':brood()==='bubble'?'둥지 아래에서 알이 떨어졌습니다. {n}은 알을 하나씩 물어 거품 속에 붙였습니다.':'며칠 뒤 수초 사이에 알이 붙었습니다.';
    if(o.l==='알을 먹는다'){Object.defineProperty(o,'l',{get:()=>isLive()?'갓 태어난 새끼를 먹는다':'알을 먹는다',enumerable:true});o.out[0][1]=()=>isLive()?'{n}이 수초 사이로 숨던 새끼들을 하나씩 삼켰습니다. 제 새끼인지는 상관없었습니다.':'{n}이 수초에 붙은 알을 먹어 치웠습니다.'}
  });
  const fix=(re,fn)=>FFL.filter(e=>re.test(e.t)).forEach(e=>{const t0=e.t;Object.defineProperty(e,'t',{get:()=>fn(t0),enumerable:true})});
  fix(/^알을 더 받기 위해/,t=>isLive()?'새끼를 더 받기 위해 주인이 수온을 올리고 암컷마다 수컷 셋을 붙였습니다. {n}은 쉴 틈이 없었습니다.':t);
})();
FEND.breedout.l=()=>{const w=BW();return fem()?[isLive()?'{n}은 한 달마다 새끼를 낳았습니다. 낳고 나면 며칠 만에 배가 다시 불러 왔습니다.':'{n}은 몇 달마다 알을 낳았고, 쉬는 기간은 없었습니다.','배는 늘 부풀었다 꺼졌고, 몸은 점점 말라 갔습니다.',(S.f.spawns||4)+'번째 '+w.spawn+' 뒤, {n}은 '+(isLive()?'산란통':'산란 상자')+' 바닥에서 일어나지 못했습니다.']
  :brood()==='mouth'?['{n}은 수컷이었고, 알을 입에 품는 쪽이었습니다.','한 번 품으면 몇 주 동안 아무것도 먹지 못했습니다. 주인은 새끼를 받아 내자마자 다음 암컷을 넣었습니다.','{n}은 입을 다문 채 바닥에 가라앉았습니다. 입안에는 아직 알이 있었습니다.']
  :['{n}은 수컷 한 마리로 여러 암컷과 차례로 짝지어졌습니다.','짝짓기 때마다 지느러미가 찢기고 몸에 상처가 늘었습니다.','더 이상 쓸모가 없어진 {n}은 대형어 수조의 먹이로 넘겨졌습니다.']};
FEND.millcull.l=p=>[isLive()?'새끼를 덜 낳기 시작한 어미들은 번식장에서 쓸모가 없었습니다.':'알을 덜 낳기 시작한 어미들은 번식장에서 쓸모가 없었습니다.','주인은 뜰채로 {n}을 건져 '+fPredName(p)+'의 수조 위에서 기울였습니다. {n}은 몇 달 동안 '+(isLive()?'새끼 수백 마리를':'수천 개의 알을')+' 낳았습니다.','다음 날 아침, 그 수조에는 {n}의 흔적이 없었습니다.'];

/* ---------- 2. stats ---------- */
function fst(){const f=S.f;if(!f.st){const t=S.temper,g=k=>FGROUP[k]&&FGROUP[k]()?1:0;
  f.st={p:18+R()*12+(t==='feisty'?10:t==='glutton'?8:0)+g('PRED')*10+(fx_().big?8:0)-(fx_().cm<5?6:0),
        g:18+R()*12+(t==='feisty'?15:t==='glutton'?10:0)+g('PRED')*10+g('LAB')*8+g('AIR')*8,
        w:18+R()*12+(t==='curious'?15:t==='shy'?10:0)+g('NIGHT')*10+g('SMALL')*5,
        c:18+R()*12+(t==='friendly'?15:t==='glutton'?5:0)+g('GOLD')*10+g('LAB')*5};
  for(const k in f.st)f.st[k]=Math.round(clamp(f.st[k],0,100))}return f.st}
const fStat=(k,v)=>{const s=fst();s[k]=clamp(s[k]+v,0,100)};
/* multipliers used by the hazards and the owner */
const fGutsK=()=>S.f?.7+fst().g/100*.6+fst().p/100*.3:1;   // crisis: weight of the surviving outcomes (guts, then strength)
const fPowK=()=>S.f?1.2-fst().p/100*.6:1;          // fin damage, bullying, fights
const fEndureK=()=>S.f?1.12-fst().g/100*.3:1;      // how fast health drains
const fWitsK=()=>S.f?1.25-fst().w/100*.6:1;        // hazards the fish's own behaviour can avoid
const fCharmK=()=>S.f?1.2-fst().c/100*.5:1;        // owner's loss of interest
const STAT_L={p:'힘',g:'근성',w:'지능',c:'매력'};

/* water temperature, for the meter: derived from the same conditions the hazards use (season, heater, bowl size, window, pond) */
const TEMP_OK={cold:[18,24],cool:[22,26],trop:[24,28],warm:[22,30]};
function fTempNow(){
  const f=S.f,x=fx_(),ss=season();let ok=TEMP_OK[x.temp]||[22,27],c;
  /* goldfish and koi outdoors follow the seasons: a cold winter pond is rest, not harm, as long as it does not freeze through */
  if(x.temp==='cold'&&(f.tank==='pond'||S.wild))ok=[ss==='winter'?2:12,26];
  if(S.wild){c=f.warm?24:{winter:4,spring:14,summer:25,autumn:15}[ss]}
  else if(f.tank==='pond')c={winter:4,spring:15,summer:27,autumn:15}[ss];
  else{c={winter:18,spring:21,summer:28,autumn:21}[ss];
    if(f.heater)c=Math.max(c,26);
    if(!f.heater&&ss==='winter'&&tankL()<30)c-=2;
    if(ss==='summer'&&!f.fan&&tankL()<30)c+=3;
    if(ss==='summer'&&f.window)c+=5;
    if(S.waiting&&f.ck==='cook')c=38;if(S.waiting&&f.ck==='sun')c=35;if(S.waiting&&f.ck==='cold')c=14}
  c+=((S.tick*7)%5-2)*.2;
  /* a line that names a temperature ("수온계가 31도") and the meter must agree */
  if(!S.wild&&f.tempEvt&&f.tempEvt.until>S.tick)c=f.tempEvt.c;
  const mid=(ok[0]+ok[1])/2,out=Math.max(0,ok[0]-c,c-ok[1]);
  return {c,lo:ok[0],hi:ok[1],fit:clamp(100-out*13-Math.abs(c-mid)*2,0,100)}}

/* the schedule: every few months the player decides how the fish spends the coming weeks.
   gain: stats raised; fail: what happens when it goes wrong (likelier when stressed or weak) */
const TRAIN=[
 {l:'물살을 거슬러 헤엄친다',need:()=>S.f.filter!=='없음',gain:{p:6,g:2},d:'힘 ↑ · 근성 ↑ · 지느러미가 찢길 수 있음',ok:['{n}은 여과기 물살 앞에서 버티는 연습을 했습니다. 처음엔 밀려나던 몸이 이제 제자리를 지켰습니다.'],fail:[['{n}은 물살에 밀려 유리벽에 몇 번이고 부딪쳤습니다. 지느러미 끝이 너덜너덜해졌습니다.',X({fin:.12,h:-6})],['지친 {n}은 물살에 휩쓸려 여과기 흡입구에 꼬리가 빨려 들어갔다가 겨우 빠져나왔습니다.',X({fin:.2,h:-10,st:.08})]]},
 {l:'수조 끝에서 끝까지 왕복한다',need:()=>S.f.filter==='없음'||tankL()>=60,gain:{p:4,g:3},d:'힘 ↑ · 근성 ↑',ok:['{n}은 하루에도 수백 번 수조를 왕복했습니다. 몸통에 단단한 근육이 붙었습니다.'],fail:[['너무 오래 헤엄친 {n}이 바닥에 누워 한참 숨만 쉬었습니다.',X({h:-7,st:.05})]]},
 {l:'주인 얼굴을 외운다',gain:{c:7},d:'매력 ↑ · 주인 관심 ↑',ok:['{n}은 주인 얼굴이 보이면 유리 앞으로 나오는 법을 익혔습니다. 주인이 "얘가 나를 알아본다"며 웃었습니다.',X({i:.06})],fail:[['{n}이 유리 앞에서 기다렸지만, 주인은 한 번도 수조를 보지 않았습니다.',X({i:-.03,st:.04})],['{n}이 너무 반가워 유리에 몸을 부딪쳤습니다. 주인은 "왜 저래" 하고 지나갔습니다.',X({h:-3})]]},
 {l:'수조 구석구석을 살핀다',gain:{w:7},d:'지능 ↑',ok:['{n}은 수조의 틈과 굴, 물살이 약한 곳을 하나하나 외웠습니다.'],fail:[['장식물 틈에 머리를 넣었다가 빠지지 않았습니다. 빠져나오며 비늘이 몇 장 벗겨졌습니다.',X({h:-8,fin:.08})],['여과기 뒤를 살피던 {n}이 히터 유리관에 옆구리를 댔습니다. 하얀 화상 자국이 남았습니다.',X({h:-9,st:.05})]]},
 {l:'먹이 시간을 외운다',gain:{w:4,c:3},d:'지능 ↑ · 매력 ↑',ok:['{n}은 주인 발소리만 들려도 수면으로 올라왔습니다.',X({i:.03})],fail:[['{n}이 수면에서 조르자 주인이 사료를 세 번이나 더 넣었습니다. 물이 뿌옇게 흐려졌습니다.',X({wq:-10,fat:.2})]]},
 {l:'푹 쉰다',rest:1,gain:{},d:'건강 ↑ · 스트레스 ↓',ok:['{n}은 수초 그늘에서 지느러미를 접고 오래 쉬었습니다.',X({h:10,st:-.2})],fail:[['쉬려고 해도 쉴 곳이 없었습니다. 머리 위로 그림자가 자꾸 지나갔습니다.',X({h:3,st:-.05})]]},
 {l:'숨는 법을 익힌다',gain:{w:5,g:1},d:'지능 ↑',need:()=>S.f.hides,ok:['{n}은 그림자가 지나가면 0.5초 만에 은신처로 들어가는 법을 익혔습니다.'],fail:[['은신처 안으로 급히 들어가다 날카로운 돌에 몸을 긁혔습니다.',X({h:-6,fin:.05})]]},
 {l:'같은 종과 어울린다',gain:{c:4,w:2},d:'매력 ↑ · 스트레스 ↓',need:()=>fSameCount()>=1,ok:['{n}은 같은 종 곁에서 헤엄치는 법을 배웠습니다. 몸 색이 한층 진해졌습니다.',X({st:-.06})],fail:[['서열 싸움이 붙었습니다. {n}은 꼬리를 물리고 구석으로 밀려났습니다.',X({fin:.15,st:.1})]]},
 /* temperament */
 {l:'그림자를 피하는 법을 익힌다',t:'shy',gain:{w:8},d:'지능 ↑↑',ok:['{n}은 그림자의 모양만 보고도 손인지, 고양이인지, 뜰채인지 구분하게 되었습니다.'],fail:[['그림자만 지나가도 놀라 숨는 바람에 {n}은 며칠 동안 거의 먹지 못했습니다.',X({h:-8,st:.12})]]},
 {l:'수면 위 세상을 구경한다',t:'curious',gain:{w:6,g:3},d:'지능 ↑ · 근성 ↑ · 뛰쳐나갈지도',ok:[()=>S.f.tank==='pond'?'{n}은 수면 바로 밑에서 연못 위를 구경했습니다. 지나가는 구름, 잠자리, 처마 끝의 빗물까지.':'{n}은 수면 바로 밑에서 방 안을 구경했습니다. 창밖의 새, 텔레비전 불빛'+(S.f.cat?', 고양이의 꼬리까지.':', 주인의 휴대폰 불빛까지.')],fail:[['수면 위가 너무 궁금했습니다.',()=>{if(lidOpen()&&!S.waiting)q(null,null,()=>fCr('jump'));else{addLog(T('{n}이 뛰어올랐다가 뚜껑에 머리를 부딪쳤습니다.'),'bad');S.health-=7}}]]},
 {l:'먹이 경쟁에서 이기는 법을 익힌다',t:'glutton',gain:{p:5,g:4},d:'힘 ↑ · 근성 ↑ · 배탈 주의',ok:['{n}은 알갱이가 떨어지는 자리를 미리 차지하는 법을 익혔습니다.',X({h:3})],fail:[['{n}은 남의 몫까지 먹고 배가 터질 듯 부풀었습니다.',both(X({fat:.3}),sickIf(.45,['swimb']))]]},
 {l:'유리 앞에서 재롱을 부린다',t:'friendly',gain:{c:9},d:'매력 ↑↑',ok:['{n}이 손가락을 따라 유리 앞을 이리저리 헤엄쳤습니다. 주인은 그 영상을 친구들에게 보냈습니다.',X({i:.08})],fail:[['재롱을 본 주인 친구가 유리를 손바닥으로 쾅쾅 두드렸습니다. "얘 왜 안 해?"',X({st:.12,h:-3})]]},
 {l:'유리에 비친 나와 싸운다',t:'feisty',gain:{p:5,g:5},d:'힘 ↑ · 근성 ↑ · 머리를 박을지도',ok:['{n}은 유리 속 상대에게 하루 종일 지느러미를 폈습니다. 한 번도 지지 않았습니다.'],fail:[['{n}은 유리 속 상대를 몇 번이고 들이받았습니다. 주둥이가 하얗게 짓물렀습니다.',X({h:-8,st:.1})]]},
 /* kind of fish */
 {l:'거품 둥지를 짓는 연습을 한다',g:'LAB',gain:{c:4,g:4},d:'매력 ↑ · 근성 ↑',ok:['{n}이 수면 구석에 손바닥만 한 거품 둥지를 지었습니다. 주인이 "얘 기분 좋은가 봐"라고 했습니다.',X({i:.04})],fail:[['주인이 물을 갈면서 둥지를 통째로 걷어 냈습니다. {n}은 하루 종일 같은 자리를 맴돌았습니다.',X({st:.08})]]},
 {l:'사냥 연습을 한다',g:'PRED',gain:{p:8,w:2},d:'힘 ↑↑ · 합사어가 위험',ok:['{n}은 바닥의 그림자에 숨어 있다가 순식간에 튀어 나가는 연습을 했습니다.',()=>{if(mateSmall().length&&R()<.6)eatMate()}],fail:[['{n}이 덮친 것은 유리벽이었습니다. 주둥이가 찢어졌습니다.',X({h:-9})],['{n}보다 큰 합사어가 되받아 물었습니다.',X({h:-10,fin:.12})]]},
 {l:'자갈을 뒤집어 먹이를 찾는다',g:'GOLD',gain:{w:4,c:3},d:'지능 ↑ · 물이 흐려짐',ok:['{n}은 자갈을 입에 넣었다 뱉으며 숨은 먹이를 찾는 법을 익혔습니다.',X({wq:-3})],fail:[['자갈 하나가 {n}의 입에 끼었습니다. 이틀 뒤에야 빠졌습니다.',X({h:-10,st:.06})]]},
 {l:'바닥을 청소한다',g:'BOT',gain:{w:4,c:4},d:'지능 ↑ · 수질 ↑',ok:['{n}이 바닥과 유리를 깨끗이 훑었습니다. 주인이 "청소부가 일을 잘하네"라고 했습니다.',X({wq:5,i:.03})],fail:[['바닥 모래가 날카로웠습니다. {n}의 수염이 닳아 없어졌습니다.',X({h:-7})]]},
 {l:'무리와 함께 방향 바꾸기를 연습한다',g:'SCHOOL',gain:{w:4,c:4},d:'지능 ↑ · 매력 ↑',ok:['무리 전체가 한 몸처럼 방향을 틀었습니다. 주인이 넋을 놓고 보았습니다.',X({i:.05,st:-.04})],fail:[['{n}만 반대쪽으로 꺾었습니다. 무리의 맨 끝으로 밀려났습니다.',X({st:.06})]]},
 {l:'밤마다 수조를 순찰한다',g:'NIGHT',gain:{w:7},d:'지능 ↑↑',ok:['불이 꺼지면 {n}은 수조 바닥을 한 바퀴씩 돌았습니다. 모든 틈을 알게 되었습니다.'],fail:[['한밤중 순찰을 나간 {n}이 히터 줄에 몸이 감겼습니다.',X({h:-8,fin:.1})]]},
 {l:'몸을 부풀리는 연습을 한다',g:'PUFF',gain:{g:6,p:2},d:'근성 ↑ · 몸에 무리',ok:['{n}이 몸을 동그랗게 부풀렸다가 천천히 꺼뜨렸습니다.'],fail:[['{n}이 물 대신 공기를 삼켰습니다. 한나절 동안 수면에 배를 뒤집은 채 떠 있었습니다.',X({h:-14,st:.1})]]},
 {l:'숨을 오래 참는다',g:'AIR',gain:{g:6},d:'근성 ↑',ok:['{n}은 수면에 올라가지 않고 오래 버티는 법을 익혔습니다.'],fail:[['너무 오래 참았습니다. {n}이 수면으로 올라가다 비틀거렸습니다.',X({h:-6})]]},
 {l:'점프 연습을 한다',g:'JUMP',gain:{p:6,w:2},d:'힘 ↑ · 뚜껑이 없으면…',ok:['{n}은 수면을 박차고 올라 떠다니는 벌레를 낚아챘습니다.',X({h:2})],fail:[['너무 높이 뛰었습니다.',()=>{if(lidOpen()&&!S.waiting)q(null,null,()=>fCr('jump'));else{addLog(T('{n}이 뚜껑에 머리를 세게 부딪치고 가라앉았습니다.'),'bad');S.health-=10}}]]},
];
const trainOk=o=>(!o.t||[].concat(o.t).includes(S.temper))&&(!o.g||fGroup(o.g))&&(!o.need||o.need())&&pondOK(o.l,o.d,o.ok.filter(x=>typeof x==='string'));
/* a failure has to fit the tank it happens in: no heater burn without a heater, no filter without a filter */
const failFits=z=>(!/히터/.test(z[0])||S.f.heater)&&(!/여과기/.test(z[0])||S.f.filter!=='없음')&&(!/합사어|다른 물고기/.test(z[0])||S.f.mates.some(m=>m.n>0))&&pondOK(z[0]);
const TRAIN_P=['살아남아, {n}. 이번 시기엔 무엇을 할까?','이번 시기, {n}은 어떻게 지낼까?','이 수조에서 버티려면 강해져야 한다. {n}은…','앞으로 몇 주, {n}은 무엇을 하며 지낼까?','계절이 바뀐다. {n}은 이번에 무엇을 익힐까?','오늘부터 한동안, {n}의 하루는…'];
function fTrainDue(){const f=S.f;return f&&!S.preOwner&&!S.wild&&f.own&&!S.waiting&&S.tick>=(f.trainAt||1e9)}
function fTrain(){
  const f=S.f;f.trainAt=S.tick+8+Math.floor(R()*4);
  const shuf=a=>a.map(x=>[R(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
  const pool=TRAIN.filter(trainOk);
  let o=shuf(pool.filter(x=>x.t)).slice(0,1).concat(shuf(pool.filter(x=>x.g)).slice(0,1));
  const rs=pool.find(x=>x.rest);if(rs&&!o.some(x=>x.rest))o.push(rs);
  o=o.concat(shuf(pool.filter(x=>!x.t&&!x.g&&!x.rest)).slice(0,Math.max(0,4-o.length))).slice(0,4);
  const st=fst(),tired=clamp(.06+f.stress*.4+(S.health<40?.15:0)+(f.ill?.1:0),0,.7);
  askChoice({who:'육성 — 이번 시기',p:pick(TRAIN_P),o:shuf(o).map(x=>({l:x.l,d:x.d+(x.rest?'':(r=>' · 실패 위험 '+(r<.12?'낮음':r<.25?'보통':'높음'))(tired+(x.t||x.g?.06:0))),c:'neutral',r:'',
    fx:()=>{
      const fail=!x.rest&&R()<tired+(x.t||x.g?.06:0), great=!fail&&R()<(S.happyT>0?.25:.14);
      if(fail){const fs=x.fail.filter(failFits),z=fs.length?pick(fs):['{n}은 무리하다 몸을 다쳤습니다. 한동안 지느러미를 접고 바닥에 붙어 있었습니다.',X({h:-6,st:.05})];addLog(T(z[0]),'bad');if(z[1])z[1]();return}
      const k=great?2:.6+R()*.8;
      for(const s in x.gain)fStat(s,Math.round(x.gain[s]*k));
      addLog(T((great?'대성공! ':'')+(typeof x.ok[0]==='function'?x.ok[0]():x.ok[0])),great?'good':'neutral');if(x.ok[1])x.ok[1]();
      if(great)remember(x.rest?'푹 잤다. 몸이 가벼웠다.':'해냈다. 조금 강해졌다.',1.1);
      if(!x.rest)f.stress+=.02;
      if(R()<.12)fTwist();
    }}))});
}

/* small surprises after a choice: the room, the owner and the tank go on without asking the fish */
const TWIST=[
 [3,'마침 주인이 그 모습을 보고 있었습니다. "오늘 왜 이렇게 귀엽지?"',()=>S.interest>.25,X({i:.08})],
 [2,'그날 오후 정전이 됐습니다. 여과기가 반나절 멈춰 있었습니다.',null,X({wq:-12,st:.05})],
 [2,'주인 동생이 몰래 사료를 한 줌 더 넣고 갔습니다.',()=>S.o.fam!=='1인 가구',X({wq:-8,fat:.15})],
 [2,'주인이 그 장면을 찍어 SNS에 올렸습니다. "좋아요"가 세 개 달렸습니다.',null,X({i:.05})],
 [2,'주인이 수조 앞에서 한숨을 쉬었습니다. "요즘 돈 들어갈 데가 많네…"',null,X({i:-.08})],
 [1,'아무도 몰랐지만, 그날 수조 유리 모서리에 가는 금이 갔습니다.',()=>S.f.tank!=='pond'&&tankL()>=27&&!S.f.leak,()=>{S.f.leak=1}],
 [2,'옆 물고기가 그 모습을 보고 덤벼들었습니다. 지느러미 끝이 뜯겼습니다.',()=>S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id),X({fin:.08,st:.05})],
 [1,'선반 위 고양이가 그 장면을 오래 지켜보았습니다.',()=>S.f.cat,X({st:.08})],
 [2,'주인이 손을 씻지 않은 채 수조에 손을 넣어 {n}을 만지려 했습니다. 핸드크림 냄새가 물에 퍼졌습니다.',()=>S.r<.6,X({h:-6,st:.05,wq:-4})],
 [2,'{n}의 몸 색이 한층 진해졌습니다.',null,()=>fStat('c',3)],
 [2,'그날따라 물이 맑았습니다. 햇빛이 바닥까지 닿았습니다.',null,X({wq:5,st:-.03})],
 [1,'주인이 사료를 새 봉지로 바꿨습니다. 유통기한이 지난 할인 상품이었습니다.',()=>S.r<.55,both(X({h:-4}),sickIf(.25,['aero']))],
 [1,'주인이 수조 옆에서 모기향을 피웠습니다.',()=>season()==='summer'&&S.r<.6,X({h:-8,st:.06})],
 [2,'주인이 물생활 카페 글을 읽다가 {n}의 종 이름을 검색했습니다.',()=>S.f.grow&&!S.f.lazy,()=>{S.r=clamp(S.r+.03,0,.95)}],
];
function fTwist(){const p=TWIST.filter(t=>(!t[2]||t[2]())&&failFits([t[1]]));if(!p.length)return;const t=wpick(p.map(x=>[x,x[0]]));addLog(T('뜻밖에 — '+t[1]),'sub');if(t[3])t[3]()}

/* ---------- 3. owners who learn, owners who do not bother ---------- */
/* which owner mistake a crisis or ending comes from */
const MKEY={jump:'lid',escape:'lid',cat:'lid',tapwater:'tap',poison:'poison',siphon:'siphon',sun:'sun',bread:'kids',squeeze:'kids',burst:'level',cook:'heater',cold:'heater',oxygen:'power',cycle:'cycle',neglect:'cycle',intake:'intake',eaten:'mates',vacation:'vacation',starve:'vacation'};
const MFIX={
  lid:['주인은 그날 밤 수조 크기에 맞는 뚜껑을 주문했습니다. 전선이 지나는 틈까지 스펀지로 막았습니다.',()=>{S.f.lid=1}],
  lidpond:['주인은 연못 위에 그물을 쳤습니다. 왜가리도 고양이도 더는 수면에 닿지 못했습니다.',()=>{S.f.net=1}],
  tap:['주인은 물갈이 양동이 옆에 염소 중화제를 두고, 병에 매직으로 "꼭!"이라고 적었습니다.'],
  poison:['주인은 수조가 있는 방에서 스프레이를 쓰지 않기로 했습니다. 수조 전용 양동이에는 "세제 금지"라고 적었습니다.'],
  siphon:['주인은 사이펀 입구에 망을 씌우고, 청소할 때는 {n}이 어디 있는지 먼저 확인했습니다.'],
  sun:['주인은 어항을 창가에서 치우고 수온계를 붙였습니다.',()=>{S.f.window=0}],
  kids:['주인은 수조를 아이 손이 닿지 않는 곳으로 옮기고, "물고기한테는 아무것도 주면 안 돼"라고 몇 번이고 말했습니다.'],
  level:['주인은 수평계를 사서 받침을 다시 맞추고, 수조 밑에 매트를 깔았습니다.',()=>{S.f.leak=0}],
  heater:['주인은 온도 조절기를 따로 달고, 매일 아침 수온계를 보기로 했습니다.',()=>{if(fx_().temp==='trop')S.f.heater=1}],
  power:['주인은 건전지 에어펌프를 사서 수조 옆 서랍에 넣어 두었습니다.'],
  cycle:['주인은 "물잡이"를 처음부터 다시 공부했습니다. 테스트 키트를 사서 매주 물을 쟀습니다.',()=>{S.f.testKit=1;S.f.wq+=12}],
  intake:['주인은 여과기 흡입구에 스펀지를 씌웠습니다.'],
  mates:['주인은 큰 물고기를 다른 수조로 옮겼습니다.',()=>{const p=fPredMate();if(p)p.n=0}],
  vacation:['주인은 다음 여행부터 자동 급여기를 달고, 이웃에게 열쇠를 맡기기로 했습니다.'],
};
const LAZY=['"다음부턴 조심해야지." 주인은 그렇게 말했습니다. 그뿐이었습니다.','주인은 해결 방법을 검색해서 찾았습니다. 필요한 물건을 장바구니에 넣어 두고, 결제는 하지 않았습니다.','"알아, 아는데…" 주인은 휴대폰을 내려놓고 누웠습니다.','주인은 카페에 "물고기가 또 이래요ㅠ"라고 글을 올렸습니다. 달린 댓글은 읽지 않았습니다.'];
const LAZY2=['같은 일이 또 일어났습니다. 주인은 이번에도 "다음부턴"이라고 했습니다.','지난번과 똑같은 실수였습니다. 장바구니의 물건은 그대로였습니다.','주인은 이번에도 "물고기가 원래 약하대"라고 말했습니다. 약한 건 물고기가 아니었습니다.'];
/* how much a hazard is reduced: learnt 1 → ×0.1, half-learnt (lazy) → ×0.65 */
const fL=k=>{const l=S.f&&S.f.learnt&&S.f.learnt[k];return l>=1?.1:l?.65:1};
function fMistake(k){
  const f=S.f;if(!f||S.done||S.ending)return;k=MKEY[k]||k;if(!MFIX[k])return;
  if(k==='lid'&&S.f.tank==='pond'){k='lidpond';MKEY.lidpond='lidpond'}
  f.mist=f.mist||{};f.learnt=f.learnt||{};const n=f.mist[k]=(f.mist[k]||0)+1;
  if(f.learnt[k]>=1)return;
  if(f.grow&&!f.stubborn&&!f.lazy&&R()<(f.own==='expert'?.95:.8)){f.learnt[k]=1;
    say(MFIX[k][0],'good');if(MFIX[k][1])MFIX[k][1]();S.r=clamp(S.r+.04,0,.95);f.lessons=(f.lessons||0)+1;
    if(n===1)remember('그 일이 있은 뒤로, 같은 일은 다시 없었다.',1.2);return}
  if(f.grow&&f.lazy){f.learnt[k]=.5;say(n>=2?pick(LAZY2):pick(LAZY),'bad');S.interest=clamp(S.interest-(n>=2?.06:.02),.02,1);return}
  if(f.stubborn){if(R()<.5)say('"물고기는 원래 잘 죽어." 주인은 그 말로 넘어갔습니다.','sub');return}
  if(R()<.5)say(n>=2?'같은 일이 또 일어났습니다. 주인은 무엇이 잘못됐는지 이번에도 몰랐습니다.':'주인은 무엇이 잘못됐는지 몰랐습니다. 아무것도 바뀌지 않았습니다.','sub');
}
/* the last line of an ending, when the same mistake killed the fish a second time */
function fRepeatLine(key){const f=S.f,k=MKEY[key];if(!k||!f.mist||!f.mist[k])return null;
  if(f.lazy)return '같은 일은 처음이 아니었습니다. 주인은 지난번에도 "다음부턴 조심해야지"라고 했습니다.';
  if(!f.grow)return '같은 일은 처음이 아니었습니다. 주인은 그때도, 이번에도, 무엇이 잘못됐는지 몰랐습니다.';
  return null}
/* the fish's character in the last lines of a long life */
function fStatLine(){const s=S.f&&S.f.st;if(!s)return null;const top=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];if(top[1]<60)return null;
  return {g:'{n}은 끝까지 지지 않는 물고기였습니다. 고비마다 다시 지느러미를 폈습니다.',w:'{n}은 위험을 먼저 알아채는 물고기였습니다. 그림자가 지나가기 전에 이미 숨어 있었습니다.',c:S.f.tank==='pond'?'주인은 오래도록, 연못가에 쪼그려 앉으면 {n}이 제일 먼저 수면으로 올라오던 모습을 기억했습니다.':'주인은 오래도록 {n}이 유리 앞에 나와 기다리던 모습을 기억했습니다.'}[top[0]]}

/* ---------- 4. more situations: finer choices, uncertain outcomes, cruel rooms ---------- */
const fKids=()=>S.o&&S.o.fam==='아이 있는 가족';
FSIT.push(
 {id:'g-brood',p:'',when:()=>fem()&&fSameCount()>=1&&S.ageM>S.sp.life*.15&&!['farm','rare'].includes(brood())&&!(S.f.broodT>S.tick),o:[]},
 {id:'g-mouth',p:'입안에 알이 가득하다. 배가 고프다. 몇 주째 아무것도 먹지 못했다. 나는…',when:()=>!fem()&&brood()==='mouth'&&fSameCount()>=1&&S.ageM>S.sp.life*.15,o:[
  {l:'끝까지 입을 다물고 버틴다',out:[[3,'{n}은 3주 동안 입을 열지 않았습니다. 마침내 입에서 새끼들이 헤엄쳐 나왔습니다.','good',both(X({h:-14}),()=>{S.f.spawns=(S.f.spawns||0)+1;fStat('g',6)}),'입에서 새끼들이 헤엄쳐 나왔다.'],[1,'버티던 {n}이 기운이 빠져 바닥에 가라앉았습니다. 알은 입안에서 하얗게 상했습니다.','bad',X({h:-18,st:.1})]]},
  {l:'몰래 조금씩 삼킨다',t:'glutton',out:[[2,'{n}은 배고픔을 못 이기고 알을 하나둘 삼켰습니다. 마지막엔 하나도 남지 않았습니다.','neutral',X({h:4})],[1,'삼키다 사레가 들린 듯 {n}이 알을 한꺼번에 뱉었습니다. 합사어들이 몰려들었습니다.','bad',X({st:.06})]]},
  {l:'은신처에 숨어 아무도 못 오게 한다',t:'shy',out:[[2,'{n}은 은신처 안에서 홀로 알을 품었습니다.','good',both(X({h:-10}),()=>{S.f.spawns=(S.f.spawns||0)+1})],[1,'주인이 "왜 안 나오지?" 하며 은신처를 들어 올렸습니다. 놀란 {n}이 알을 다 뱉었습니다.','bad',X({st:.12})]]},
  {l:'알을 뱉어 버린다',out:[[1,'{n}이 알을 바닥에 뱉었습니다. 몇 분 만에 아무것도 남지 않았습니다.','neutral',X({h:2,st:-.03})]]},
 ]},
 {id:'g-overfeed',p:'주인이 사료 통을 통째로 기울였다. 알갱이가 비처럼 쏟아진다. 나는…',when:()=>S.r<.6&&S.interest>.3,o:[
  {l:'먹을 만큼만 먹는다',out:[[2,'{n}은 몇 알만 먹고 물러났습니다. 남은 사료는 바닥에서 불어 갔습니다.','neutral',X({wq:-10})],[1,'남은 사료가 바닥에서 썩어 물에서 비린내가 났습니다.','bad',X({wq:-18,st:.05})]]},
  {l:'눈앞의 것은 다 먹는다',t:'glutton',out:[[1,'{n}의 배가 동그랗게 부풀었습니다. 밤새 옆으로 기울어 헤엄쳤습니다.','bad',both(X({fat:.35,h:-4}),sickIf(.5,['swimb']))],[1,'{n}은 다 먹고도 멀쩡했습니다. 근성 하나는 대단했습니다.','neutral',both(X({h:2,fat:.2}),()=>fStat('g',3))]]},
  {l:'바닥에 가라앉은 사료를 치운다',g:'BOT',out:[[2,'{n}이 바닥을 쓸고 다니며 남은 사료를 먹어 치웠습니다.','good',X({wq:-3,h:2})],[1,'너무 많았습니다. {n}의 배가 터질 듯 불렀습니다.','bad',X({fat:.3})]]},
  {l:'유리 앞에서 "그만"이라고 지느러미를 흔든다',t:'friendly',out:[[1,'주인은 그 모습을 "더 달라"는 뜻으로 읽었습니다. 한 숟갈이 더 들어왔습니다.','bad',X({wq:-14,fat:.1})],[()=>S.r>.4?1:0,'주인이 멈칫하더니 사료 통을 닫았습니다. "너무 많았나?"','good',X({wq:-5,i:.04}),'주인이 멈췄다.']]},
 ]},
 {id:'g-medicine',p:'물에서 이상한 냄새가 난다. 주인이 파란 약을 병째 들이부었다. 나는…',when:()=>S.r<.65&&S.interest>.3&&(S.f.ill||S.f.wq<55),o:[
  {l:'바닥에서 견딘다',out:[[2,'눈이 따가웠지만 {n}은 버텼습니다.','neutral',both(X({h:-8}),()=>{if(S.f.ill)S.f.ill.sev=Math.max(0,S.f.ill.sev-.15)})],[1,'약은 정량의 세 배였습니다. 아가미가 하얗게 질렸습니다.','bad',X({h:-18,st:.1})]]},
  {l:'여과기 물살 쪽으로 피한다',t:['curious','feisty'],out:[[2,'물살 근처는 약이 조금 옅었습니다.','neutral',X({h:-5})],[1,'여과기 활성탄이 약을 빨아들였습니다. 약은 아무 효과도 없었습니다.','neutral',X({h:-3})]]},
  {l:'은신처 깊숙이 숨는다',t:'shy',out:[[1,'은신처 안까지 약 냄새가 스며들었습니다.','bad',X({h:-10,st:.05})]]},
  {l:'수면에서 숨을 쉰다',g:'AIR',out:[[3,'{n}은 수면 공기로 숨을 쉬며 독한 물을 버텼습니다.','good',X({h:-3})]]},
 ]},
 {id:'g-redecor',p:'주인이 수조를 통째로 뒤엎어 새로 꾸몄다. 내가 알던 굴이 없다. 나는…',when:()=>S.interest>.5&&S.f.tank!=='pond',o:[
  {l:'새 은신처를 찾는다',out:[[2,'{n}은 새 유목 밑에 자리를 잡았습니다.','good',both(X({st:-.03}),()=>{S.f.hides=1;fStat('w',2)})],[1,'새 돌 사이에 몸이 끼었습니다. 빠져나오며 지느러미가 찢겼습니다.','bad',X({fin:.12,h:-5})]]},
  {l:'예전 굴 자리를 맴돈다',t:'shy',out:[[1,'{n}은 굴이 있던 자리를 며칠 동안 맴돌았습니다.','bad',X({st:.12})]]},
  {l:'새 장식을 하나하나 들이받아 본다',t:'feisty',out:[[2,'{n}이 새 수조를 다시 자기 영역으로 만들었습니다.','neutral',()=>fStat('g',3)],[1,'바위 모서리에 눈 옆을 긁혔습니다.','bad',X({h:-6})]]},
  {l:'새 모래를 파 본다',g:['CICH','BOT','GOLD'].map(g=>FGROUP[g]).reduce((a,b)=>()=>a()||b()),out:[[2,'새 모래 밑에서 오래된 사료 조각이 나왔습니다. 물이 뿌옇게 흐려졌습니다.','neutral',X({wq:-6,h:1})],[1,'주인이 씻지 않은 새 모래를 그대로 부었습니다. 물이 하루 종일 흙탕물이었습니다.','bad',X({wq:-14,st:.06})]]},
 ]},
 {id:'g-pencil',p:'작은 얼굴이 유리에 붙었다. 손에 연필을 들고 있다. 뚜껑이 열려 있다. 나는…',log:'아이가 연필을 쥐고 뚜껑 없는 수조 위로 손을 뻗었습니다.',when:()=>fKids()&&S.f.tank!=='pond'&&!S.f.lid,o:[
  {l:'바닥 깊이 숨는다',out:[[2,'연필은 수초만 찌르다 나갔습니다.','neutral',X({st:.05})],[1,'연필 끝이 {n}의 등을 찔렀습니다.','bad',X({h:-12,st:.1})]]},
  {l:'연필 끝을 따라 헤엄친다',t:['curious','friendly'],out:[[2,'아이가 깔깔 웃었습니다. "엄마, 물고기가 따라와!"','good',both(X({i:.06}),()=>fStat('c',3))],[2,'아이는 신이 나서 연필로 {n}을 이리저리 몰았습니다. 한참 뒤에야 엄마가 말렸습니다.','bad',X({h:-8,st:.12})]]},
  {l:'연필을 문다',t:'feisty',out:[[2,'{n}이 연필 끝을 물자 아이가 놀라 손을 뺐습니다.','neutral',()=>fStat('g',2)],[1,'아이가 화가 나서 연필로 수면을 마구 내리쳤습니다.','bad',X({h:-10,st:.15})]]},
  {l:'연필에서 떨어진 지우개 가루를 먹는다',t:'glutton',out:[[1,'{n}이 지우개 가루를 삼켰습니다. 사흘 동안 배설을 못 했습니다.','bad',X({h:-14})]]},
 ]},
 {id:'g-party',p:'거실에 사람이 가득하다. 음악이 쿵쿵 울린다. 누가 수조 위에서 잔을 기울인다. 나는…',log:'주인이 거실에서 밤새 술자리를 벌였습니다. 수조 옆까지 손님들이 서 있었습니다.',when:()=>S.o.age<40&&['casual','gift','content'].includes(S.f.own)&&S.f.tank!=='pond',o:[
  {l:'바닥 구석에서 밤이 끝나길 기다린다',out:[[3,'{n}은 바닥에서 밤새 쿵쿵거리는 진동을 견뎠습니다.','neutral',X({st:.12})],[1,'새벽에 누가 수조 위에서 담배를 비벼 껐습니다. 재가 물 위에 떠다녔습니다.','bad',X({wq:-12,h:-6})]]},
  {l:'수면 근처를 피해 다닌다',t:'shy',out:[[2,'{n}은 수초 사이에서 나오지 않았습니다.','neutral',X({st:.08})],[1,'누군가 "이 물고기 살아 있어?" 하며 수조를 흔들었습니다.','bad',X({st:.15,h:-4})]]},
  {l:'떨어지는 것을 받아먹는다',t:'glutton',out:[[1,'안주 부스러기였습니다. 짰습니다.','bad',X({h:-8,wq:-8})],[1,'떨어진 것은 맥주였습니다.','bad',()=>{if(!S.waiting)q(null,null,()=>fCr('poison','soju'))}]]},
  {l:'유리 앞에서 손님들을 구경한다',t:['curious','friendly'],out:[[2,'손님들이 {n}에게 이름을 지어 부르며 사진을 찍었습니다.','good',both(X({i:.06,st:.05}),()=>fStat('c',3))],[1,'손님 하나가 "회 떠 먹자"며 뜰채를 들었습니다. 다들 웃었습니다. {n}은 뜰채에 담겨 한참 들려 있다가 돌아왔습니다.','bad',X({h:-10,st:.2})]]},
 ]},
 {id:'g-corpse',p:'함께 살던 물고기가 며칠째 바닥에 누워 있다. 아무도 치우지 않는다. 나는…',when:()=>S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id)&&S.interest<.55,o:[
  {l:'멀리 피해 다닌다',out:[[2,'시체는 점점 하얗게 부풀었습니다. 물에서 비린내가 났습니다.','bad',X({wq:-14})],[1,'사흘 만에 주인이 젓가락으로 그것을 건져 변기에 버렸습니다.','neutral',X({wq:-6})]]},
  {l:'쪼아 먹는다',t:['glutton','feisty'],out:[[2,'{n}은 배를 채웠습니다. 수조 안에서는 흔한 일이었습니다.','neutral',X({h:3})],[1,'썩은 살에 병이 있었습니다.','bad',sickIf(.8,['aero','columnaris','tb'])]]},
  {l:'곁에 머문다',t:'friendly',out:[[1,'{n}은 그 곁을 떠나지 않았습니다. 주인은 "사이가 좋았나 봐"라고 말만 했습니다.','sub',X({st:.1,wq:-10}),'곁을 떠나지 못했다.']]},
  {l:'유리 앞을 맴돌며 주인을 부른다',t:['curious','friendly'],out:[[()=>S.interest*4,'주인이 그제야 바닥을 보고 시체를 건져 냈습니다. 물도 반쯤 갈았습니다.','good',X({wq:12,i:.05})],[2,'주인은 "밥 달라는구나" 하고 사료를 넣었습니다.','bad',X({wq:-10})]]},
  {l:'다 먹어 치운다',g:'PRED',out:[[1,'{n}은 남은 것을 다 삼켰습니다. 수조는 다시 깨끗해 보였습니다.','neutral',X({h:4})]]},
 ]},
 {id:'g-sell',p:'주인이 수조를 찍으며 통화한다. "그냥 가져가실래요? 수조째 드릴게요." 나는…',when:()=>S.interest<.45&&['casual','learner','gift','content'].includes(S.f.own)&&!S.f.place,o:[
  {l:'평소처럼 지낸다',out:[[2,'통화는 흐지부지 끝났습니다.','neutral'],[1,'다음 날, 낯선 사람이 수조를 보러 왔습니다.','bad',()=>{q(null,null,()=>fRehome('주인은 중고거래 앱으로 {n}을 수조째 넘겼습니다. 받은 돈은 만 원이었습니다.'))}]]},
  {l:'유리 앞에서 지느러미를 활짝 편다',t:['friendly','curious'],out:[[()=>fst().c/25,'통화하던 주인이 {n}을 한참 보더니 말했습니다. "…아니에요, 그냥 제가 키울게요."','good',both(X({i:.15}),()=>fStat('c',4)),'주인이 나를 다시 봤다.'],[1,'"보세요, 이렇게 예뻐요." 주인은 그 영상을 판매 글에 올렸습니다.','bad',()=>{q(null,null,()=>fRehome('주인은 "건강하고 예쁜 아이"라는 글과 함께 {n}을 넘겼습니다.'))}]]},
  {l:'은신처 깊숙이 숨는다',t:'shy',out:[[2,'사러 온 사람은 "물고기가 없는데요?" 하고 돌아갔습니다.','neutral',X({i:-.04})],[1,'주인이 은신처를 들어 올려 뜰채로 {n}을 떠냈습니다.','bad',()=>{q(null,null,()=>fRehome('주인은 {n}을 비닐봉지에 담아 지하철역 앞에서 낯선 사람에게 건넸습니다.'))}]]},
  {l:'사러 온 사람의 손가락을 문다',t:'feisty',out:[[1,'"얘 성질 있네요." 사러 온 사람은 그냥 돌아갔습니다. 주인은 {n}을 다시 보았습니다.','good',X({i:.05})],[1,'"이런 건 공짜로도 안 가져가요." 주인의 얼굴이 굳었습니다.','bad',X({i:-.12})]]},
 ]},
 {id:'g-heater',p:'히터 유리관이 따뜻하다. 몸을 대면 기분이 좋다. 나는…',when:()=>S.f.heater&&!S.f.heaterGuard&&season()!=='summer',o:[
  {l:'조금 떨어져서 쉰다',out:[[1,'{n}은 따뜻한 물살이 닿는 자리에서 쉬었습니다.','good',X({st:-.03})]]},
  {l:'히터에 몸을 붙인다',t:['friendly','glutton'],out:[[1,'따뜻했습니다.','neutral'],[2,'{n}의 옆구리에 하얀 화상 자국이 생겼습니다. 며칠 뒤 그 자리에 솜 같은 곰팡이가 피었습니다.','bad',both(X({h:-10}),sickIf(.6,['fungus']))]]},
  {l:'히터 뒤 좁은 틈에 들어간다',t:['shy','curious'],out:[[2,'아늑했습니다.','neutral',X({st:-.03})],[1,'틈에 끼어 히터에 몸이 눌렸습니다. 밤새 빠져나오지 못했습니다.','bad',X({h:-20,st:.15})]]},
  {l:'수면 쪽 시원한 물로 간다',g:'AIR',out:[[1,'{n}은 수면에서 공기를 마시며 쉬었습니다.','good',X({h:2})]]},
 ]},
 {id:'g-light',p:'주인이 조명을 며칠째 끄지 않는다. 밤이 오지 않는다. 나는…',when:()=>S.interest<.6&&S.f.tank!=='pond'&&S.r<.6,o:[
  {l:'수초 그늘에서 눈을 붙인다',out:[[2,'{n}은 그늘에서 겨우 잠들었습니다.','neutral',X({st:.04})],[1,'이끼가 수조 가득 번졌습니다.','bad',both(X({st:.06,wq:-6}),()=>{S.f.algae=1})]]},
  {l:'계속 헤엄친다',t:['feisty','curious'],out:[[1,'{n}은 사흘 밤낮을 헤엄쳤습니다. 몸이 버티지 못했습니다.','bad',X({h:-12,st:.15})],[1,'{n}은 지치지 않았습니다.','neutral',()=>fStat('g',3)]]},
  {l:'은신처에 틀어박힌다',t:'shy',need:()=>S.f.hides,out:[[1,'은신처 안은 어두웠습니다. {n}은 그 안에서 나오지 않았습니다.','good',X({st:-.02})]]},
  {l:'바닥 그림자에서 밤인 척한다',g:'NIGHT',out:[[2,'{n}은 바닥 그림자에서 쉬었습니다.','neutral'],[1,'밝은 빛 때문에 {n}은 며칠 동안 먹이를 찾지 못했습니다.','bad',X({h:-10})]]},
 ]},
 {id:'g-coldwater',p:'새로 부은 물이 얼음장 같다. 수온이 한순간에 떨어졌다. 나는…',when:()=>fx_().temp==='trop'&&S.r<.6&&S.f.tank!=='pond',o:[
  {l:'바닥에서 몸을 웅크린다',out:[[2,'{n}은 한나절 동안 떨며 버텼습니다.','neutral',X({h:-6,st:.06})],[2,'다음 날, {n}의 몸에 하얀 점이 돋기 시작했습니다.','bad',sickIf(.85,['ich'])]]},
  {l:'히터 쪽으로 간다',need:()=>S.f.heater,out:[[3,'히터 곁은 따뜻했습니다.','good',X({h:-2})],[1,'히터 곁에 몰려든 다른 물고기들에게 밀려났습니다.','bad',both(X({h:-6}),sickIf(.5,['ich']))]]},
  {l:'헤엄쳐서 몸을 데운다',t:['feisty','glutton'],out:[[1,'{n}은 미친 듯이 헤엄쳤습니다. 조금 나았습니다.','neutral',both(X({h:-4}),()=>fStat('g',2))],[1,'지쳐서 가라앉았습니다.','bad',both(X({h:-10}),sickIf(.6,['ich']))]]},
 ]},
);
/* the brood situation is built when it is chosen, from how this kind of fish breeds */
(()=>{const g=FSIT.find(c=>c.id==='g-brood');g.gen=1;
  Object.defineProperty(g,'p',{get:()=>({live:'배가 무겁다. 몸 안에서 무언가 꿈틀거린다. 수컷들은 여전히 쫓아온다. 나는…',scatter:'배가 알로 부풀었다. 수컷들이 꼬리를 물듯 쫓아온다. 나는…',stick:'배가 알로 부풀었다. 수컷이 내 머리 옆에 몸을 붙인다. 나는…',bubble:'수면에 거품 둥지가 있다. 수컷이 둥지 아래에서 나를 부른다. 나는…',mouth:'배가 알로 부풀었다. 수컷이 입을 벌리고 기다린다. 나는…',guard:'평평한 돌 위가 깨끗하다. 알을 낳을 때다. 나는…',cave:'굴 안이 조용하다. 알을 낳을 때다. 나는…'})[brood()]||'몸이 무겁다. 나는…',enumerable:true});
  const sp=()=>{S.f.spawns=(S.f.spawns||0)+1;S.f.broodT=S.tick+(isLive()?6:10)};
  const L=b=>()=>[].concat(b).includes(brood());
  g.o=[
   /* livebearers */
   {l:'빽빽한 수초 사이에 숨어 낳는다',g:L('live'),out:[[()=>S.f.hides?3:1,'{n}은 수초 사이에서 '+'새끼를 낳았습니다. 몇 마리는 수초 틈으로 숨어 살아남았습니다.','good',both(X({h:-8}),sp),'새끼들이 수초 속으로 흩어졌다.'],[2,'수초는 듬성듬성했습니다. 태어나자마자 새끼들은 합사어들의 입으로 사라졌습니다.','bad',both(X({h:-8,st:.06}),sp)]]},
   {l:'바닥 가까이에서 천천히 낳는다',g:L('live'),out:[[2,'{n}은 하룻밤에 걸쳐 새끼 스무 마리를 낳았습니다. 아침까지 남은 건 여섯 마리였습니다.','neutral',both(X({h:-7}),sp)],[1,'출산이 끝나지 않았습니다. 새끼 하나가 몸에서 빠져나오지 못한 채 이틀이 지났습니다.','bad',both(X({h:-18,st:.12}),sp)]]},
   {l:'여과기 뒤 좁은 틈으로 숨어 낳는다',g:L('live'),t:'curious',out:[[2,'틈 속에서 태어난 새끼들은 아무도 찾지 못했습니다. 주인은 한 달 뒤에야 새끼들을 발견했습니다.','good',both(X({h:-6,i:.06}),sp)],[1,'새끼들이 여과기 흡입구로 빨려 들어갔습니다.','bad',both(X({h:-6,st:.05}),sp)]]},
   {l:'아무 데서나 낳는다',g:L('live'),out:[[1,'새끼들이 떨어지는 족족 다른 물고기들이 받아먹었습니다. {n}은 그 모습을 보며 다음 새끼를 낳았습니다.','bad',both(X({h:-6}),sp)]]},
   {l:'낳자마자 새끼를 먹는다',g:L('live'),t:'glutton',out:[[1,'{n}은 제 새끼를 먹었습니다. 배는 다시 불러 왔습니다.','neutral',both(X({h:3}),sp)]]},
   {l:'주인이 산란통에 넣어 주길 기다린다',g:L('live'),t:'friendly',out:[[()=>S.interest*3,'주인이 {n}을 플라스틱 산란통에 넣었습니다. 손바닥만 한 통 속에서 {n}은 이틀 동안 새끼를 낳았습니다.','good',both(X({h:-10,st:.1,i:.05}),sp)],[1,'주인은 배가 부른 {n}을 보고 "살쪘네" 했습니다.','neutral',X({st:.04})]]},
   {l:'쫓아오는 수컷들을 피해 숨는다',g:L(['live','scatter','stick']),t:'shy',out:[[2,'{n}은 은신처에서 숨을 골랐습니다.','neutral',X({st:-.03})],[1,'수컷들은 은신처 앞을 지키고 있었습니다. {n}은 꼬박 사흘을 쫓겨 다녔습니다.','bad',X({h:-10,fin:.1,st:.12})]]},
   /* egg scatterers */
   {l:'수초 사이에 알을 흩뿌린다',g:L('scatter'),out:[[2,'{n}이 수초 사이에 알 수백 개를 흩뿌렸습니다. 하룻밤 사이 대부분은 하얗게 곰팡이가 피거나 다른 물고기의 먹이가 되었습니다.','neutral',both(X({h:-8,wq:-6}),sp)],[1,'수컷들이 밤새 {n}을 수조 벽에 밀어붙였습니다. 비늘이 여러 장 떨어졌습니다.','bad',both(X({h:-14,fin:.1}),sp)]]},
   {l:'알을 낳지 않고 버틴다',g:L(['scatter','stick']),out:[[2,'알은 몸속에서 흡수되었습니다.','neutral',X({h:-3})],[1,'알이 몸속에서 굳었습니다. 배가 딱딱하게 부풀어 내려가지 않았습니다.','bad',both(X({h:-16,st:.1}),sickIf(.4,['dropsy']))]]},
   {l:'자기 알을 먹어 치운다',g:L(['scatter','stick']),t:'glutton',out:[[1,'{n}은 막 낳은 알을 도로 먹었습니다. 배는 금방 꺼졌습니다.','neutral',both(X({h:2}),sp)]]},
   /* corydoras */
   {l:'배지느러미에 알을 품어 유리벽에 붙인다',g:L('stick'),out:[[3,'{n}은 알을 하나씩 품어 유리벽에 붙였습니다. 유리벽에 좁쌀 같은 알이 줄지어 섰습니다.','good',both(X({h:-6}),sp),'유리벽에 알을 하나씩 붙였다.'],[1,'주인이 유리를 닦으며 알을 전부 긁어 냈습니다. "뭐가 이렇게 붙었지."','bad',both(X({st:.05}),sp)]]},
   /* bubble nest */
   {l:'둥지 아래에서 알을 낳는다',g:L('bubble'),out:[[2,'산란이 끝나자 수컷이 {n}을 둥지에서 쫓아냈습니다. 지느러미가 너덜너덜해졌습니다.','bad',both(X({h:-8,fin:.25}),sp)],[1,'산란이 끝나자 주인이 {n}을 바로 건져 냈습니다.','good',both(X({h:-4}),sp)]]},
   {l:'둥지를 부순다',g:L('bubble'),t:'feisty',out:[[1,'{n}이 둥지를 들이받아 거품을 흩뜨렸습니다. 수컷이 미친 듯이 덤볐습니다.','bad',X({fin:.2,h:-6})]]},
   /* mouthbrooders (the female lays, the male holds) */
   {l:'알을 낳아 수컷의 입에 넘긴다',g:L('mouth'),out:[[2,'{n}이 알을 낳자 수컷이 하나도 남김없이 입에 담았습니다.','good',both(X({h:-6}),sp)],[1,'수컷은 알을 품지 않고 삼켜 버렸습니다.','bad',both(X({h:-6}),sp)]]},
   /* guarding cichlids */
   {l:'알을 낳고 끝까지 지킨다',g:L(['guard','cave']),out:[[2,'{n}은 알 앞을 막고 지느러미로 물을 부쳤습니다. 사흘 뒤 알이 깨었습니다.','good',both(X({h:-6,st:.06}),sp,()=>fStat('g',4)),'알을 지켰다. 끝까지.'],[1,'주인이 "알이 생겼네!" 하며 손을 넣었습니다. 놀란 {n}이 알을 전부 먹어 버렸습니다.','bad',both(X({st:.12}),sp)]]},
   {l:'알을 내버려 둔다',g:L(['guard','cave']),out:[[1,'다음 날 아침 돌 위는 비어 있었습니다.','neutral',sp]]},
   {l:'다가오는 것은 다 문다',g:L(['guard','cave']),t:'feisty',out:[[1,'{n}이 합사어를 몰아붙였습니다. 그 물고기는 다음 날 아침 떠올랐습니다.','neutral',both(sp,()=>{const m=S.f.mates.find(m=>m.n>0&&m.id!==S.sp.id);if(m){m.n--;S.f.mates=S.f.mates.filter(m=>m.n>0)}})]]},
  ];
})();

/* everyday lines: the lazy, the growing, and cruelty without blood */
const FFL2=[
 {t:'주인은 물을 갈려고 양동이를 꺼냈다가, 드라마 한 편만 보고 하기로 했습니다. 양동이는 사흘 동안 거기 서 있었습니다.',c:'bad',when:()=>S.f.lazy,fx:()=>{S.f.wq-=10}},
 {t:'"이번 주는 바빠서." 주인은 지난주에도 같은 말을 했습니다.',c:'bad',when:()=>S.f.lazy,fx:()=>{S.f.wq-=8;S.interest-=.04}},
 {t:'수질 테스트 키트는 서랍 안에서 유통기한이 지났습니다. 한 번도 열지 않았습니다.',c:'bad',when:()=>S.f.lazy&&S.f.testKit,once:'lazykit',fx:()=>{S.f.testKit=0}},
 {t:'주인은 여과기 소리가 시끄럽다며 밤마다 플러그를 뽑았습니다. 아침에 꽂는 걸 자주 잊었습니다.',c:'bad',when:()=>(S.f.lazy||S.f.own==='casual')&&S.f.filter!=='없음',fx:()=>{S.f.wq-=12;S.f.pumpOff=1}},
 {t:'주인이 수조 옆에 물갈이 기록표를 붙였습니다. 날짜마다 체크 표시가 늘어 갔습니다.',c:'good',when:()=>S.f.grow&&!S.f.lazy,once:'chart',fx:()=>{S.f.wq+=8;S.r=clamp(S.r+.03,0,.95)}},
 {t:'주인이 물생활 카페에서 {n}과 같은 종을 오래 키운 사람에게 쪽지를 보내 먹이를 물었습니다. 답장은 길었습니다.',c:'good',when:()=>S.f.grow&&!S.f.lazy,fx:()=>{S.health+=3;S.r=clamp(S.r+.02,0,.95)}},
 {t:'주인은 바닥에 죽은 합사어를 사흘째 건지지 않았습니다. 물이 비릿해졌습니다.',c:'bad',when:()=>S.f.mates.some(m=>m.n>0)&&S.interest<.5,nm:1,fx:()=>{S.f.wq-=15;const m=S.f.mates.find(m=>m.n>0);if(m){m.n--;S.f.mates=S.f.mates.filter(m=>m.n>0)}}},
 {t:'주인이 유리를 손톱으로 두드리며 "죽었나?" 하고 확인했습니다. {n}은 숨어 있었을 뿐입니다.',c:'bad',when:()=>S.f.tank!=='pond'&&S.r<.6,fx:()=>{S.f.stress+=.08}},
 {t:'주인이 "물고기도 운동해야지"라며 뜰채로 {n}을 쫓아다녔습니다.',c:'bad',when:()=>['casual','gift'].includes(S.f.own),fx:()=>{S.f.stress+=.12;S.f.fin+=.05}},
 {t:'주인 친구가 "얘도 과자 먹어?" 하며 새우깡을 부숴 넣었습니다.',c:'bad',when:()=>S.o.age<45&&S.r<.6,fx:()=>{S.f.wq-=10}},
 {t:'주인이 물갈이를 하며 {n}을 잠깐 컵에 옮겨 두었습니다. 그대로 저녁을 먹으러 나갔습니다. 컵 속 물은 두 시간 만에 미지근해졌습니다.',c:'bad',when:()=>S.f.len<10&&S.r<.6,fx:()=>{S.health-=12;S.f.stress+=.1}},
 {t:'주인은 "물고기는 3초밖에 기억 못 한대"라며 웃었습니다. {n}은 주인이 손을 넣을 때마다 같은 구석으로 숨었습니다.',c:'sub',when:()=>S.f.tank!=='pond'&&S.r<.55},
 {t:'아이가 {n}에게 "뽀삐"라는 이름을 붙였다가, 일주일 뒤 "재미없다"며 다시는 수조를 보지 않았습니다.',c:'bad',when:()=>fKids()&&!S.name,once:'kidbored',fx:()=>{S.interest-=.1;S.name='뽀삐';S.disp=S.name}},
 {t:'아이가 일주일 내내 수조 앞에 붙어 {n}의 이름을 불렀습니다. 그다음 주에는 "재미없다"며 다시는 수조를 보지 않았습니다.',c:'bad',when:()=>fKids()&&!!S.name,once:'kidbored',fx:()=>{S.interest-=.1}},
 {t:'주인이 수조 유리에 "물고기 만지지 마시오"라고 쓴 종이를 붙였습니다.',c:'good',when:()=>fKids()&&S.f.grow&&!S.f.lazy,once:'kidsign',fx:()=>{(S.f.learnt=S.f.learnt||{}).kids=1}},
];
FFL2.forEach(e=>{e.i=FFL.length;if(e.nm){const w=e.when;e.when=()=>!S.f.noMates&&(!w||w())}FFL.push(e)});

/* ---------- 5. v0.9.22: crueler — endings in the body, and the fish's own voice ----------
   The user lifted the no-blood rule for text (2026-10-11): wounds may bleed. Drawings stay as they are. */
const DZ_END={ich:'하얀 점이 아가미 안까지 뒤덮었습니다. 숨 쉴 자리가 남지 않았습니다.',velvet:'금빛 가루가 아가미를 덮었습니다. {n}은 숨을 쉬려고 바닥 돌에 몸을 긁다가, 긁힌 자리마다 피가 배어 나왔습니다.',
  cotton:'솜뭉치가 입을 막았습니다. 그 밑의 살은 썩어 들어갔습니다.',dropsy:'배는 터질 듯 부풀었고, 일어선 비늘 사이로 진물이 배어 나왔습니다.',
  finrot:'지느러미는 몸통까지 녹아 붉은 살이 드러났습니다.',bent:'등뼈가 활처럼 휘어 똑바로 누울 수도 없었습니다.',pits:'머리에 패인 구멍들이 서로 이어져 살 속까지 파고들었습니다.',
  popeye:'부어오른 눈은 핏발이 서고 하얗게 흐려졌습니다. 앞이 보이지 않았습니다.',pale:'근육이 하얗게 굳어 똑바로 헤엄칠 수 없었습니다.',sunken:'눈이 움푹 꺼지고, 아가미가 얼룩덜룩 썩어 들어갔습니다.',
  dark:'검게 변한 몸으로 같은 자리를 돌고 또 돌았습니다.',flip:'배를 위로 한 채 며칠을 떠 있었습니다. 공기에 닿은 배가 말라 갈라지고 피가 맺혔습니다.',thin:'뼈만 남은 몸에 머리만 커 보였습니다.'};
(()=>{const E=FEND,o=k=>E[k]&&E[k].l;
  E.cycle.l=()=>['새 수조에는 아직 물을 맑게 해 줄 박테리아가 없었습니다. 배설물과 남은 사료가 녹아 암모니아가 되어 쌓였습니다.','물은 유리처럼 맑았습니다. 그 맑은 물이 {n}의 아가미를 안쪽부터 태웠습니다. 아가미 끝이 붉게 짓무르고, 숨을 쉴 때마다 아가미 덮개가 찢어질 듯 벌어졌습니다.','주인은 "물이 맑은데 왜 그러지" 하며 사료를 더 넣었습니다. 먹지 못한 사료가 바닥에서 썩었습니다.','{n}은 수면에 입을 박고 버텼습니다. 수조에 온 지 '+durLabel(S.f.tankAge)+' 만에, {n}은 핏발 선 아가미를 벌린 채 배를 뒤집고 떠올랐습니다.'];
  E.neglect.l=()=>[tankL()<10?'좁은 어항의 물은 며칠 만에 썩어 갔습니다.':'물을 갈지 않은 지 오래, 수조 바닥에 찌꺼기가 쌓이고 물에서 냄새가 났습니다.','숨을 쉴 때마다 썩은 물이 아가미로 밀려들었습니다. {n}의 지느러미 끝이 녹아 한 조각씩 떨어져 나갔습니다.','{n}은 수면에서 입을 뻐끔거리다, 어느 날 아침 배를 뒤집었습니다. 눈은 하얗게 흐려져 있었습니다.',['casual','gift'].includes(S.f.own)?'주인은 {n}을 뜰채로 건져 변기에 넣고 물을 내렸습니다.':'주인은 그제야 수조를 들여다보았습니다.'];
  E.disease.l=()=>{const d=DZ[S.f.ill.id];return [S.f.ill.treating?'치료는 너무 늦게 시작되었습니다.':S.f.ill.noticed?'주인은 지켜보기만 했습니다.':'아무도 {n}이 아프다는 걸 알아차리지 못했습니다.',DZ_END[d.ov]||'{n}의 몸은 안에서부터 무너졌습니다.','{n}은 '+josa(d.n,'을')+' 이기지 못했습니다. 수조 바닥, 장식 뒤에서 {n}은 숨을 멈췄습니다.']};
  E.nipped.l=()=>['{n}의 지느러미는 매일 조금씩 뜯겨 나갔습니다. 뜯긴 자리에서 붉은 실 같은 피가 풀리면, 다른 물고기들이 그 냄새를 따라 몰려왔습니다.','뜯긴 자리에 하얀 곰팡이가 피었고, 지느러미는 다시 자라지 않았습니다.','{n}은 지느러미 없는 몸으로 바닥에 누웠습니다. 그래도 그들은 멈추지 않았습니다.'];
  const m0=o('mauled');E.mauled.l=p=>{const a=m0(p);a[1]='지느러미는 실처럼 갈라지고, 옆구리에는 비늘이 뜯겨 나간 붉은 자국이 늘어 갔습니다. 주인은 "물고기끼리 장난치는 것"이라고 했습니다.';return a};
  E.eaten.l=p=>['같은 수조의 '+josa(fPredName(p),'은')+' 하루가 다르게 자랐습니다.','어느 밤, '+josa(fPredName(p),'이')+' 수조를 한 바퀴 돌았습니다. {n}은 머리부터 삼켜졌고, 꼬리는 한참 동안 그 입 밖에서 퍼덕였습니다.','아침에 바닥에는 비늘 몇 장이 흩어져 있었습니다. '+fPredName(p)+'의 아가미 사이로 꼬리지느러미 끝이 비쳤습니다.'];
  E.jump.l=()=>['한밤중, {n}이 수면 위로 몸을 날렸습니다. 뚜껑은 없었습니다.','{n}은 마룻바닥에 떨어져 퍼덕였습니다. 퍼덕일 때마다 비늘이 바닥에 떨어져 붙었고, 마른 아가미로 쉬는 숨은 점점 짧아졌습니다. 집 안의 누구도 깨어나지 않았습니다.','아침에 발견된 {n}은 먼지가 들러붙은 채 말라 있었습니다. 입은 벌어진 채였습니다.'];
  E.tapwater.l=()=>['오랜만에 물을 갈았습니다. 염소를 빼지 않은 수돗물을, 온도도 맞추지 않고 한 번에 다 바꿨습니다.','{n}은 몸을 뒤틀며 유리벽에 머리를 박았습니다. 아가미가 타들어 가 하얗게 질렸고, 그 가장자리에 피가 맺혔습니다.','한 시간 만에 {n}은 수면으로 떠올랐습니다.'];
  E.cull.l=()=>[S.sp.id==='betta'?'{n}의 꼬리 끝이 조금 찢어져 있었습니다.':S.sp.id==='koi'?'{n}의 무늬는 "볼품없다"는 판정을 받았습니다.':'{n}의 지느러미 모양이 기준에 맞지 않았습니다.','"팔 수 없는" 물고기는 산 것과 죽은 것이 뒤섞인 양동이에 쏟아졌습니다. 위로 쏟아진 형제들의 무게에 깔려, 아래쪽 물고기들은 숨을 쉬지 못했습니다.','양동이는 그날 저녁 근처 수로에 비워졌습니다.'];
  E.oxygen.l=()=>{const f=S.f,pond=f.tank==='pond';return [season()==='summer'?'열대야가 이어지던 밤, 정전으로 여과기가 멈췄습니다. 미지근한 물에서 산소가 빠져나갔습니다.':f.heater&&!pond?'한겨울 밤, 정전으로 여과기와 히터가 함께 멈췄습니다.':pond?'한겨울 밤, 연못 물이 얼어붙고 여과기가 멈췄습니다. 얼음 아래로는 공기가 들어오지 않았습니다.':'한겨울 밤, 정전으로 여과기가 멈췄습니다.',fLoad()>1?'비좁은 '+(pond?'연못':'수조')+'의 물고기들이 모두 수면으로 몰려 입을 뻐끔거렸습니다. 아가미가 붉게 부풀었습니다.':'{n}은 수면에서 입을 뻐끔거렸습니다. 아가미가 붉게 부풀었습니다.','전기가 다시 들어왔을 때, {n}은 수면 아래 비스듬히 떠 있었습니다.']};
  E.stress.l=()=>['좁고 붐비는 수조에서 {n}은 하루도 마음 편히 헤엄치지 못했습니다.','색이 바래고, 먹이를 거르고, 지느러미를 접은 채 구석에서 지냈습니다. 다른 물고기와 부딪칠 때마다 비늘이 한 장씩 떨어졌습니다.','어느 날 {n}은 그 구석에서 움직이지 않았습니다. 아무도 한동안 알아채지 못했습니다.'];
})();
/* blood in the training failures and the everyday cruelty */
TRAIN.forEach(t=>t.fail.forEach(z=>{z[0]=z[0]
  .replace('지느러미 끝이 너덜너덜해졌습니다.','지느러미 끝이 너덜너덜하게 찢겨 피가 실처럼 풀렸습니다.')
  .replace('주둥이가 하얗게 짓물렀습니다.','주둥이가 찢어져 피가 맺혔습니다. 다음 날에도 {n}은 같은 자리를 들이받았습니다.')
  .replace('{n}이 덮친 것은 유리벽이었습니다. 주둥이가 찢어졌습니다.','{n}이 덮친 것은 유리벽이었습니다. 주둥이가 찢어져 물에 붉은 연기가 피었습니다.')
  .replace('서열 싸움이 붙었습니다. {n}은 꼬리를 물리고 구석으로 밀려났습니다.','서열 싸움이 붙었습니다. {n}은 꼬리를 물려 한 조각을 뜯기고, 피를 흘리며 구석으로 밀려났습니다.')}));

/* the fish's own voice: a short first-person line after some of what happens to it */
const INNER=[
 [/암모니아|물잡이|독한 물|숨이 가빠|뻐끔|헐떡|아가미가 (거칠|하얗|타|얼룩)|산소가 모자/,['숨이… 숨이 안 쉬어져.','아가미가 뜨거워. 숨을 쉴수록 더 타.','물이 나를 태우고 있어.','공기. 공기가 필요해. 위로, 위로.']],
 [/염소를 빼지 않|수돗물을 그대로|소독약|세제|무지갯빛|스프레이|모기향/,['눈이 따가워. 물에서 쓴맛이 나.','살갗이 벗겨지는 것 같아.']],
 [/온도가 달랐|얼음장|살얼음|차가워졌|차가운 바닥|히터가 고장|히터가 없/,['차가워. 몸이 말을 안 들어.','지느러미가 굳어 가. 움직여야 하는데.']],
 [/폭염|목욕물처럼|데워졌|김이 올/,['뜨거워. 물이 끓는 것 같아.','숨을 쉴 때마다 뜨거운 게 들어와.']],
 [/봉지 바닥|봉지에 담|봉지 속|상자 안|상자가|짐칸/,['좁아. 어두워. 숨이 차.','언제 끝나? 이 흔들림은 언제 끝나?','옆의 형제가 움직이지 않아.']],
 [/먹이가 끊|굶었|굶주|배가 꺼|배를 곯|먹이를 찾지 못/,['배고파. 배가 등에 붙었어.','뭐라도. 뭐라도 먹고 싶어.']],
 [/뜯어 갔|뜯겨|찢겨|찢어졌|찢겼|물어뜯|쫓아가 물|물린 자리|물려|피가|피를|비늘이 .*(떨어|벗겨)/,['아파. 아파. 꼬리가 없어진 것 같아.','도망쳐야 해. 어디로든.','물속에 내 피 냄새가 퍼져. 다들 이쪽을 봐.']],
 [/금가루|하얀 점이|솜 같은|솜뭉치|솔방울|구멍이 패|하얗게 벗겨|녹아내리/,['가려워. 살갗 아래에 뭔가 있어.','몸이 무거워. 바닥에 비비면 조금 나아.','내 몸이 내 것 같지 않아.']],
 [/체에 걸러|선별 작업자|"팔 수 없는"/,['나를 봐. 나 아직 살아 있어.','저 양동이로 가면 끝이야.']],
 [/사료를 더 넣|한 줌 더|먹이 블록|숟갈이 더/,['밥이 아니야. 물을 갈아 줘.','먹을 수가 없어. 목이 막혀.']],
 [/뜰채로|커다란 손이|맨손으로 잡/,['큰 손이다. 숨어야 해.','잡히면 끝이야.']],
 [/고양이가|앞발/,['초록 눈. 움직이면 안 돼.']],
 [/마룻바닥|바닥에 떨어져|바닥에 놓고|세면대/,['숨이… 물이 없어.','차가운 바닥. 물. 물은 어디 있어?']],
 [/왜가리|부리가/,['그림자다. 깊이, 더 깊이.']],
];
/* a few good moments get a voice too; matched only on good lines */
const INNER_GOOD=[
 [/물을 .{0,8}갈아|물을 갈았|새 물/,['물이 시원해. 숨이 편해.']],
 [/손가락 끝에서|받아먹었|받아먹기/,['맛있어. 저 손은 좋은 손이야.']],
 [/나았습니다|다시 지느러미를 폈/,['몸이 가벼워. 다시 헤엄칠 수 있어.']],
 [/햇볕을 쬐|숨을 곳|새 굴|은신처 안/,['여기라면 괜찮아.']],
];
function fInner(text,cls){
  if(!S||!S.f||S.done||!text||!S.story)return;
  const bad=cls==='bad'||cls==='end'||(S.ending&&cls==='sub'),good=cls==='good'&&!S.ending;
  if(!bad&&!good)return;
  if(S.story.length-(S.innerAt||-9)<3)return;
  const hit=(bad?INNER:INNER_GOOD).find(([re])=>re.test(text));if(!hit||R()>(bad?.7:.45))return;
  const lines=hit[1].filter(l=>pondOK(l));if(!lines.length)return;
  const line='「'+pick(lines)+'」';
  /* written under the line it answers, inside the same log row, so the log keeps its grid */
  const li=typeof document!=='undefined'&&document.getElementById('log')&&document.getElementById('log').firstElementChild,p=li&&li.querySelector('p');
  if(p){const sp=document.createElement('span');sp.className='inner';sp.textContent=line;p.appendChild(sp)}
  S.story.push({a:ageLabel(S.ageM),t:line,c:'inner'});S.innerAt=S.story.length;
}

/* ---------- 6. context: a pond is not a room ----------
   Anything that needs a glass tank in a room (the glass, a lid, a heater, the lights, the window, the TV, the shelf,
   the living room, a siphon) is left out when the fish lives in a garden pond; "수조" in a pond log reads "연못". */
const INDOOR=/방 안|유리|뚜껑|히터|조명|창밖|창가|텔레비전|선반|거실|사이펀|어항|받침|콘센트|로봇청소기|수조째|불이 꺼|불 꺼진|수온계|세면대|물멍|에어컨|책상|수조 앞|맨유리/;
const inPond=()=>!!(S&&S.f&&S.f.tank==='pond'&&!S.wild&&!S.preOwner);
const pondOK=(...ts)=>!inPond()||!ts.flat(9).some(t=>typeof t==='string'&&INDOOR.test(t));
/* a tank furnished with stones, an ornament, a pipe or a spawning mop has no plants: "수초" lines name what is there.
   Lines about planting ("수초를 심어…") are left alone; that event furnishes the tank itself. */
const DECO_W={rock:['돌','돌 틈'],kitsch:['장식물','장식물 틈'],pipe:['파이프','파이프 안'],mop:['털실 뭉치','털실 뭉치 사이'],none:['구석','바닥 구석']};
const plantify=t=>{const f=S&&S.f;if(typeof t!=='string'||!f||!f.lay||S.wild||S.preOwner||f.tank==='pond'||!/수초/.test(t)||/수초를 (몇|심|새로)/.test(t))return t;
  const d=f.lay.deco==='none'&&f.hides?'nature':f.lay.deco,w=DECO_W[d];if(!w)return t;
  return t.replace(/빽빽한 수초 사이|수초 사이|수초 깊숙이/g,m=>m.endsWith('깊숙이')?w[1]+' 깊숙이':w[1])
    .replace(/수초 잎 위/g,w[0]+' 위').replace(/수초 그늘/g,w[0]+' 그늘')
    .replace(/수초 뒤(로|에서|에)?/g,(m,j)=>d==='none'?'구석'+(j==='로'?'으로':j||''):w[0]+' 뒤'+(j||''))
    .replace(/수초(?!를)/g,w[0])};
const pondify=t=>{t=plantify(t);return inPond()&&typeof t==='string'?t.replace(/(?<!격리 )수조/g,'연못'):t};
(()=>{const l=FCH.find(c=>c.id==='lid');if(l){const w=l.when;l.when=()=>S.f.tank!=='pond'&&(!w||w())}})();
const optTexts=o=>[o.l,o.d,o.r].concat((o.out||[]).map(z=>z[1]));
TRAIN.push(
 {l:'연못 깊은 곳에 숨는 법을 익힌다',need:()=>S.f.tank==='pond',gain:{w:7},d:'지능 ↑',ok:['{n}은 그림자가 수면에 비치면 곧장 연못 바닥으로 내려가는 법을 익혔습니다.'],fail:[['너무 늦었습니다. 왜가리 부리가 {n}의 등을 스쳤습니다. 비늘이 벗겨진 자리에서 피가 배어 나왔습니다.',X({h:-12,st:.12})]]},
 {l:'주인 손에서 먹이를 받아먹는다',need:()=>S.f.tank==='pond'&&S.interest>.3,gain:{c:7,p:1},d:'매력 ↑ · 주인 관심 ↑',ok:['{n}이 연못가에 쪼그려 앉은 주인 손바닥에서 먹이를 받아먹었습니다.',X({i:.08})],fail:[['다른 물고기들이 몰려들어 {n}을 밀어냈습니다. 주둥이가 돌에 긁혔습니다.',X({h:-5})]]},
 {l:'연못을 크게 돈다',need:()=>S.f.tank==='pond',gain:{p:6,g:2},d:'힘 ↑ · 근성 ↑',ok:['{n}은 연못 가장자리를 따라 몇 바퀴씩 돌았습니다. 몸통이 두꺼워졌습니다.'],fail:[['수면 가까이 너무 오래 있었습니다. 고양이 발톱이 {n}의 옆구리를 긁고 지나갔습니다.',X({h:-12,fin:.1,st:.1})]]},
);

/* ---------- 7. the owner's rank, from 주인 실력 ---------- */
const RANKS=[[0,'왕초보'],[.3,'초보'],[.55,'중수'],[.78,'고수']];
const fRank=r=>RANKS.filter(x=>r>=x[0]).pop()[1];
const RANK_UP={초보:'주인은 이제 물을 갈 때 염소 중화제를 빼먹지 않았습니다. 초보 딱지를 뗐습니다.',중수:'주인은 이제 물을 갈기 전에 온도부터 쟀습니다. 수질 테스트 색만 보고도 무엇을 할지 알았습니다. 주인이 중수가 되었습니다.',고수:'주인은 이제 물 냄새와 {n}의 지느러미 모양만 보고도 이상을 알아챘습니다. 주인이 고수가 되었습니다.'};
function fRankTick(){const f=S.f;if(!f||S.preOwner||S.wild||!f.own)return;const r=fRank(S.r);
  if(!f.rank){f.rank=r;return}
  if(RANKS.findIndex(x=>x[1]===r)>RANKS.findIndex(x=>x[1]===f.rank)){f.rank=r;say(RANK_UP[r]||('주인이 '+r+'가 되었습니다.'),'good');
    /* a keeper this good does not leave a tropical fish without a heater */
    if((r==='중수'||r==='고수')&&fx_().temp==='trop'&&!f.heater&&f.tank!=='pond'){f.heater=1;f.coldShock=0;say('주인은 그날 바로 온도 조절기가 달린 히터를 사 와 수온을 26℃에 맞췄습니다.','good')}
    if(r==='고수'&&f.own==='learner'&&!f.lazy&&(f.lessons||0)>=3){f.own='expert';remember('주인의 손길이 달라졌다. 물이 늘 맑았다.',1.3)}}
  else f.rank=r}

/* velvet: a fish rubs on what is there — glass in a tank, stones in a pond */
(()=>{const v=DZ.velvet;if(v)Object.defineProperty(v,'sym',{get:()=>'{n}의 몸이 금가루를 뿌린 듯 탁한 금빛으로 덮였습니다. 지느러미를 접고 '+(S&&S.f&&S.f.tank==='pond'?'바닥 돌에':'유리벽에')+' 몸을 비볐습니다.',enumerable:true})})();

/* ---------- 8. the "실제로는" fact has to be about this fish ----------
   tools/check_facts.mjs lists which fact each species ends with; these fix the ones that were about another animal. */
const FACT_FISH={
  accident:'사고의 대부분은 미리 알았다면 막을 수 있었던 일입니다. 뚜껑 하나, 흡입구 스펀지 하나, 온도 조절기 하나가 생사를 가릅니다.',
  left:'이사를 하면서 물고기를 두고 가거나 아무에게나 넘기는 일이 흔합니다. 수조를 옮기기 어렵다면, 받아 줄 사람을 미리 찾아 두는 것이 책임입니다.',
  swimb:'부레병은 과식, 변비, 세균 감염 등으로 부레가 눌려 몸이 기울거나 뒤집히는 병입니다. 먹이를 줄이고 수질을 맞추면 낫는 경우도 있습니다.',
  tetra:'테트라히메나는 수질이 나쁠 때 상처로 파고드는 작은 섬모충입니다. 몸속까지 퍼지면 치료가 어렵습니다.',
  pond:'연못 물고기의 가장 큰 위협은 왜가리와 고양이 같은 포식자입니다. 연못 위에 친 그물 하나가 생사를 가릅니다.',
  noair:'가물치와 폴립테루스처럼 공기로 숨 쉬는 물고기는 수면과 뚜껑 사이에 공기층이 있어야 합니다. 물을 가득 채우고 뚜껑을 꽉 닫으면 숨이 막힙니다.',
};
function factFix(key,k,arg){
  const id=S.sp.id,gold=isGold();
  if(k==='accident')return FACT_FISH.accident;
  if(key==='left')return FACT_FISH.left;
  if(key==='fight'&&!['betta','wildbetta'].includes(id))return 'fTemper';
  if(key==='pond'&&id!=='koi')return FACT_FISH.pond;
  if(key==='noair'&&id!=='bichir')return FACT_FISH.noair;
  if(key==='disease'&&S.f.ill){const d=S.f.ill.id;
    if(d==='swimb'&&!gold)return FACT_FISH.swimb;
    if(d==='tetra'&&!['guppy','platy'].includes(id))return FACT_FISH.tetra;
    if(d==='cyhv2'&&!gold)return 'fWater';
    if(d==='khv'&&id!=='koi')return 'fWater';
    if(d==='neond'&&id!=='neon')return 'fWater';
    if(d==='skinny'&&id!=='clownloach')return 'fWild';
    if(d==='hex'&&!['oscar','altum','apisto','channa','arowana'].includes(id))return 'fWater'}
  if(['neglect','stunt'].includes(key)&&k==='fBowl'&&!gold)return 'fBowlAny';
  return k;
}
