/* ---------- v0.10 catalogue 02: trade & transport (events/02_trade.md, TRD-01 … TRD-37) ----------
   export holding → packing → air cargo → customs → wholesale → shop / mart / stall → parcel →
   the way home → acclimation → every later handover.
   Hidden rule of every bag event: the more the fish moves, the more oxygen it uses and the more waste it makes,
   so the passive option is rarely a loss. A passive option whose catalogue need is above the species cap stays open;
   its chance tops out at (cap/need)² (trd_r below). */

/* ---------- helpers ---------- */
/* a hidden roll the engine would grey out: always open, chance = ((stat+bonus)/need)², 5–95% */
const trd_r=(k,need,b)=>R()<clamp(Math.pow(Math.max(0,(fst()[k]||0)+(b||0))/need,2),.05,.95);
/* where it is sold (the prologue knows the shop before the fish gets there) */
const trd_shop=()=>S.f&&(S.f.shop||S.f.preShop);
/* the first weeks with a new owner (carrying home, the parcel, acclimation) */
const trd_fresh=()=>!S.preOwner&&S.f&&(S.ageM-(S.f.buyAge||0))<Math.max(.6,S.sp.life*.08);
const trd_ship=()=>trd_shop()==='online';
const trd_spiny=()=>isSp('pleco','cory','clownloach','bichir');
const trd_sens=()=>isSp('@scaleless','altum','neon');
const trd_tough=()=>isSp('@big','@koi','@gold');
const trd_carry=id=>{if(!S.f.carrier)S.f.carrier=id};
/* owner learns a transport lesson (flags in S.f.fl) */
function trd_learn(flag,kinds,p,line){if(S.preOwner||fl(flag))return;if(isKind(kinds)&&R()<p){setFl(flag,1);addLog(T(line),'good');S.r=clamp(S.r+.02,0,.97)}}

/* ======================= TRADE (box moment: holding, export, air cargo, customs, wholesale) ======================= */

/* EV-TRD-01 출하 전 굶기기 — [출처: 관상어 운송 전 1–2일 절식 관행] */
function trd01(o){return ()=>{const r=Object.assign({},valOf(o));r.set=Object.assign({fasted:1},r.set||{});
  if(isSp('neon','guppy','apisto')&&R()<.4){r.t=(r.t?r.t+' ':'')+'출하 날 아침, {n}의 배는 등 쪽으로 붙어 있었습니다.';r.fx=Object.assign({},r.fx,{h:((r.fx&&r.fx.h)||0)-6});r.set.thin=1}
  else if(isSp('oscar','arowana','gar','channa','koi'))r.t=(r.t?r.t+' ':'')+'이틀 굶어도 {n}의 몸은 그대로였습니다. 봉지 속 물만 덜 더러워졌습니다.';
  return r}}
fev([{id:'TRD-01',stage:'trade',tier:'fact',once:1,
  p:'이틀째 먹이가 떨어지지 않습니다. 수조 위로 사람 그림자가 지나가도 아무것도 내려오지 않습니다. 옆 칸의 물고기들은 바닥을 입으로 훑고 있습니다. {n}은…',
  o:[
   {l:'바닥을 뒤져 남은 부스러기를 찾는다',chk:()=>['w',isSp('cory','pleco','clownloach')?25:30],
    ok:trd01({t:'{n}은 돌 틈에서 사료 부스러기 몇 알을 찾아냈습니다.',c:'good',fx:{w:2}}),
    no:trd01({t:'바닥에는 아무것도 없었습니다. 헤엄친 만큼 몸이 축났습니다.',c:'bad',fx:{h:-6}})},
   {l:'옆 물고기의 지느러미 끝을 쪼아 본다',chk:['p',30],
    ok:trd01(()=>isSp('@puffer')?{t:'{n}이 문 자리에서 옆 물고기의 지느러미가 찢어졌습니다. 출하 검품표의 {n} 칸에 "공격적"이라는 글자가 적혔고, {n}은 혼자 따로 포장되었습니다.',fx:{p:2},set:{nipper:1}}
      :{t:'{n}은 옆 물고기의 지느러미 끝을 조금 뜯어 먹었습니다. 상대는 구석으로 달아났습니다.',fx:{p:2}}),
    no:trd01({t:'옆 물고기가 몸을 틀어 {n}을 밀어냈습니다. 비늘 몇 장이 떨어졌습니다.',c:'bad',fx:{h:-5}})},
   {l:'움직이지 않고 물 한가운데 떠 있는다',
    ok:trd01({t:'굶긴 덕에 봉지 속 배설물은 줄었습니다. 사람의 편의였지만, 이번만은 {n}에게도 이득이었습니다.',fx:{g:1}})}
  ]}]);

/* EV-TRD-02 봉지 모서리 — [출처: 소형어 포장 시 봉지 모서리 끼임 방지(모서리 묶기·원형 봉지) 관행] */
function trd02corner(){
  if(isSp('peapuffer'))return {t:'겁에 질린 {n}이 물을 삼켜 몸을 부풀렸습니다. 둥글어진 몸은 틈에 들어가지 않았습니다.',c:'sub',fx:{h:-5,st:.1}};
  if(isSp('guppy','platy')&&S.f.len>fx_().cm*.5&&R()<.5)return {t:'{n}의 몸은 틈보다 두꺼웠습니다. 머리만 들어갔다가 빠져나왔습니다.',c:'sub',fx:{h:-4}};
  return {end:'TRD-02-D'};
}
const trd02ok={t:'봉지가 열릴 때까지 {n}은 가운데에서 버텼습니다. 같은 봉지의 두 마리는 모서리에서 납작하게 나왔습니다.',c:'good',add:{bag_nh3:1},mem:'좁은 틈이 있었다. 들어가지 않았다.'};
fev([{id:'TRD-02',stage:'trade',tier:'fact',sp:['neon','guppy','platy','peapuffer','apisto','cory'],
  p:'비닐봉지가 고무줄로 묶이고 상자에 눕혀집니다. 봉지 아래쪽 양 끝에 좁고 뾰족한 틈이 생깁니다. 상자가 흔들릴 때마다 물이 그쪽으로 쏠립니다. {n}은…',
  o:[
   {l:'쏠리는 물을 거슬러 봉지 가운데로 헤엄친다',chk:['g',30],ok:Object.assign({},trd02ok,{fx:{g:2}}),no:()=>trd02corner()},
   {l:'어두운 모서리 틈으로 들어가 몸을 붙인다',chk:['w',40],ok:{t:'{n}은 틈 입구에서 몸을 돌려 빠져나왔습니다. 그 안은 너무 좁았습니다.',fx:{w:2}},no:()=>trd02corner()},
   {l:'물살에 몸을 맡기고 지느러미만 편다',ok:()=>trd_r('g',20)?trd02ok:trd02corner()}
  ]}]);

/* EV-TRD-03 가시가 봉지를 뚫다 — [출처: 플레코·코리 가시의 봉지 천공, 이중 포장 권장]
   spined fish make the hole; small fish in the same bag only lose the water */
function trd03leak(p){
  const sp=isSp('pleco','cory','clownloach','@puffer');
  if(sp&&R()>p)return {t:'상자가 열렸을 때 봉지는 멀쩡했습니다. 새던 물은 옆 봉지의 것이었습니다.',c:'good'};
  if(isSp('pleco'))return trd_r('g',40)?{t:'물이 다 빠진 봉지 속에서 {n}은 젖은 비닐에 배를 붙이고 하루를 버텼습니다. 수입업자는 "물 없는 봉지에서 산 놈"이라며 {n}을 따로 표시해 두었습니다. 함께 봉지에 있던 네온 여섯 마리는 마른 채 바닥에 붙어 있었습니다.',c:'good',fx:{h:-10,g:2},set:{slime_loss:1},mem:'물이 없었다. 젖은 비닐에 붙어 버텼다.'}:{end:'TRD-03-D'};
  if(isSp('cory'))return trd_r('g',40,10)?{t:'물이 반 넘게 빠졌습니다. {n}은 남은 물 위로 입을 내밀어 공기를 삼키며 버텼습니다.',c:'sub',fx:{h:-12},set:{slime_loss:1}}:{end:'TRD-03-D'};
  if(isSp('clownloach'))return trd_r('g',55)?{t:'눈 밑 가시가 비닐에 걸린 채 {n}은 남은 물에 몸을 담그고 버텼습니다.',c:'sub',fx:{h:-15,fin:.05}}:{end:'TRD-03-D'};
  return trd_r('g',40)?{t:'수위가 몸높이 가까이 내려갔지만, 상자는 그 전에 열렸습니다.',c:'sub',fx:{h:-10}}:{end:'TRD-03-D'};
}
fev([{id:'TRD-03',stage:'trade',tier:'fact',sp:['pleco','cory','clownloach','@puffer','neon','guppy','platy'],
  w:()=>isSp('pleco','cory','clownloach','@puffer')?1:.5,
  p:()=>isSp('pleco','cory','clownloach','@puffer')?'상자 안이 흔들립니다. {n}의 몸이 비닐 벽에 몇 번 부딪힙니다. 바닥 쪽 어딘가에서 아주 가는 물줄기가 상자 스티로폼으로 스며듭니다. {n}은…'
    :'같은 봉지에 가시 돋친 물고기가 함께 담겼습니다. 상자가 흔들리고, 바닥 쪽 어딘가에서 아주 가는 물줄기가 스티로폼으로 스며듭니다. 수위가 조금씩 내려갑니다. {n}은…',
  o:[
   {l:()=>isSp('@puffer')?'몸을 부풀리고 비닐 벽을 문다':'몸을 접고 가시를 세운 채 벽에 기댄다',when:()=>isSp('pleco','cory','clownloach','@puffer'),ok:()=>trd03leak(.75)},
   {l:'지느러미를 눕히고 봉지 가운데에 떠 있는다',when:()=>isSp('pleco','cory','clownloach','@puffer'),chk:['w',45],
    ok:{t:'{n}의 가시는 비닐에 닿지 않았습니다.',c:'good',fx:{w:2}},no:()=>trd03leak(.5)},
   {l:'바닥 쪽에 배를 대고 가만히 있는다',ok:()=>trd03leak(isSp('pleco','cory','clownloach','@puffer')?.35:1)}
  ]}]);

/* EV-TRD-04 뜰채 위의 복어 — [출처: 복어류 물 밖 공기 흡입 팽창의 위험, 컵 이동 권장] */
function trd04gulp(){
  addFl('air_gulp');
  const need=(isSp('peapuffer')?50:60)+(fl('air_gulp')>1?10:0);
  if(trd_r('w',need)){
    const r={t:'부푼 {n}이 한참 떠 있다가 공기 방울 하나를 내보내고 쑥 가라앉았습니다. 그걸 본 사람은 웃으며 영상을 찍었고, 다음 복어도 뜰채로 떴습니다.',c:'good',fx:{h:-6,w:2},mem:'몸이 공기로 부풀었다. 한참 뒤에야 가라앉았다.'};
    r.run=()=>trd_learn('cup_puffer',['expert','learner','staff'],.6,'주인은 "복어는 컵으로 옮긴다"는 글을 찾아 읽었습니다. 그 뒤로 뜰채는 쓰지 않았습니다.');
    return r}
  return {end:'TRD-04-D'};
}
fev([{id:'TRD-04',stage:['shop','home'],tier:'fact',sp:['@puffer'],cd:50,
  when:()=>!fl('cup_puffer')&&!isKind('expert'),w:()=>S.preOwner?1:.5,
  p:'그물이 몸 아래를 받치고 위로 올라갑니다. 물이 그물코로 빠져나갑니다. 머리 위로 공기가 닿습니다. 배 쪽이 저절로 팽팽해지려 합니다. {n}은…',
  o:[
   {l:'그물 바닥을 꼬리로 쳐서 물로 돌아가려 한다',chk:['p',30],
    ok:{t:'{n}이 그물 테두리를 넘어 물로 떨어졌습니다. 비늘 없는 옆구리가 그물에 쓸렸습니다.',c:'sub',fx:{h:-6,p:2},set:{inj_skin:1}},no:()=>trd04gulp()},
   {l:'몸을 크게 부풀린다',ok:()=>trd04gulp()},
   {l:'지느러미를 붙이고 그물 위에 가만히 놓여 있는다',ok:()=>trd_r('g',35)?{t:'{n}은 부풀지 않은 채 새 물로 옮겨졌습니다.',c:'good',fx:{g:2}}:trd04gulp()}
  ]}]);

/* EV-TRD-05 봉지 안의 독 — 코리 — [출처: 코리도라스 스트레스 시 피부 분비물의 독성, 단독 포장 권장] */
function trd05(){
  if(isSp('cory'))return trd_r('g',45)?{t:'봉지가 열렸을 때 {n}은 살아 있었습니다. 손님은 "코리는 튼튼하네요"라고 말했습니다. 같은 봉지의 네온은 두 마리가 줄어 있었습니다.',c:'sub',fx:{h:-8},set:{toxin:'cory_mucus'},add:{bag_nh3:1}}:{end:'TRD-05-D'};
  return trd_r('g',45,isSp('ghost','clownloach')?-15:0)?{t:'봉지가 열렸을 때 {n}은 아가미가 부은 채 살아 있었습니다. 같은 봉지의 다른 몇 마리는 바닥에 누워 있었습니다.',c:'bad',fx:{h:-15},add:{bag_nh3:1}}:{end:'TRD-05-D'};
}
fev([{id:'TRD-05',stage:'trade',tier:'fact',sp:['cory','neon','guppy','apisto','altum','ghost','clownloach','platy'],w:()=>isSp('cory')?1.2:.6,
  p:()=>isSp('cory')?'봉지가 좁습니다. 다른 물고기의 꼬리가 계속 얼굴에 닿습니다. 물이 조금씩 뿌옇게 흐려집니다. {n}은…'
    :'같은 봉지에 코리도라스 몇 마리가 함께 담겼습니다. 좁은 봉지에서 다른 꼬리가 계속 얼굴에 닿습니다. 물이 조금씩 뿌옇게 흐려지고, 아가미가 따끔거립니다. {n}은…',
  o:[
   {l:'가슴 가시를 세우고 봉지 벽 쪽으로 몸을 밀어붙인다',when:()=>isSp('cory'),ok:{t:'{n}의 피부에서 점액이 더 나왔습니다. 물이 희뿌옇게 변했습니다.',c:'bad',run:()=>q(null,null,()=>fevOut(trd05()))}},
   {l:'수면 쪽으로 올라가 공기를 한 모금 삼킨다',when:()=>isSp('cory'),chk:['g',40],
    ok:{t:'{n}은 장으로 공기를 삼키며 버텼습니다. 봉지가 열렸을 때 {n}은 움직이고 있었습니다. 같은 봉지의 네온은 두 마리가 줄어 있었습니다.',c:'sub',fx:{h:-6,g:2},set:{toxin:'cory_mucus'}},no:()=>trd05()},
   {l:'수면 쪽으로 올라가 입을 벌린다',when:()=>!isSp('cory'),ok:()=>trd_r('g',40,isSp('ghost','clownloach')?-15:0)?{t:'수면 쪽 물은 조금 덜 뿌옜습니다. 봉지가 열릴 때까지 {n}은 거기서 버텼습니다.',c:'sub',fx:{h:-12}}:{end:'TRD-05-D'}},
   {l:()=>isSp('cory')?'봉지 바닥에 배를 붙이고 수염만 움직인다':'봉지 바닥 가까이에서 지느러미를 접는다',
    ok:()=>isSp('cory')?(trd_r('g',50)?{t:'{n}은 끝까지 가만히 있었습니다. 점액은 나오지 않았고, 봉지 물은 맑았습니다.',c:'good',fx:{g:2}}:trd05()):trd05()}
  ]}]);

/* EV-TRD-06 운송용 물에 탄 약 — no choice, the drug is in all the water
   [출처: 관상어 운송 시 진정제(MS-222·정향유 등)·약제 첨가 관행과 과량 위험 — 약품명은 출처 확인 전 화면 표기 안 함] */
fev([{id:'TRD-06',stage:'trade',tier:'likely',w:.7,
  log:'봉지에 물이 채워지기 전, 사람이 통에 작은 병의 액체를 붓고 휘저었습니다. 물에서 약간 쓴 냄새가 났습니다.',
  auto:()=>{
    if(isSp('@big','@koi','@gold'))return {t:'{n}의 몸이 조금 무거워졌습니다. {n}은 이틀 내내 거의 움직이지 않은 채 도착했습니다. 수입업자의 기록에는 "상태 양호"라고 적혔습니다.',c:'sub',set:{sedated:1}};
    const b=(trd_sens()?-20:0)+(isSp('@labyrinth','@airbreather')?10:0)+(isSp('@small','@schooling')?-5:0);
    if(!trd_r('g',40,b))return {end:'TRD-06-D'};
    return {t:'{n}은 이틀 내내 거의 움직이지 않은 채 도착했습니다. 수입업자의 기록에는 "상태 양호"라고 적혔습니다.'+(isSp('@scaleless')?' {n}의 피부 점막은 군데군데 벗겨져 있었습니다.':''),c:'sub',fx:{h:isSp('@scaleless')?-15:-6},set:{sedated:1,slime_loss:isSp('@scaleless')?1:0}};
  }}]);

/* EV-TRD-07 활주로 위의 상자 — [출처: 관상어 항공 운송 지연·온도에 따른 폐사율 — 화면 수치 표기 시 필요] */
function trd07(b){
  const s=season(),hot=s==='summer',cold=s==='winter';
  b=(b||0)+(cold&&isSp('@koi','@gold','gar')?20:0)+(cold&&isSp('@tropical')?-10:0)+(!hot&&!cold?20:0)+(hot&&isSp('@schooling','@small')?-5:0);
  if(!trd_r('g',35,b))return {end:cold&&isSp('@tropical')?'TRD-07-W':'TRD-07-S'};
  return {t:'상자는 예정보다 열네 시간 늦게 도착했습니다. 송장에는 "지연 사유: 없음"이라고 적혀 있었습니다.',c:'sub',fx:{h:-8},add:{transit_delay:1,bag_nh3:1},run:()=>{if(hot||cold)S.f.coldShock=1}};
}
fev([{id:'TRD-07',stage:'trade',tier:'fact',
  p:()=>'상자가 한참 움직이지 않습니다. 스티로폼 벽 너머로 엔진 소리가 멀어졌다 가까워집니다. '+(season()==='winter'?'봉지 속 물이 조금씩 식어 갑니다.':'봉지 속 물이 조금씩 데워집니다.')+' 공기층이 점점 얇게 느껴집니다. {n}은…',
  o:[
   {l:'봉지 위쪽 공기층 바로 아래까지 올라간다',chk:()=>['g',isSp('@labyrinth','@airbreather')?25:40],
    ok:{t:'{n}은 공기층 바로 아래에서 지연을 버텼습니다. 상자는 예정보다 열네 시간 늦게 도착했습니다.',c:'good',fx:{g:2},add:{transit_delay:1}},no:()=>trd07(-10)},
   {l:'봉지 안을 천천히 돌며 물을 휘젓는다',ok:()=>trd07(-10)},
   {l:'바닥에 내려가 지느러미를 접는다',ok:()=>trd07(5)}
  ]}]);

/* EV-TRD-08 검역 대기 — [출처: 수입 관상어(잉어과) 검역 절차 — 국립수산물품질관리원 수산생물 검역 대상 질병·표본 검사 방식. 실제 표본 수·처분 기준 확인 필요] */
const trd08pass={t:'{n}은 통관 서류의 한 줄이 되었습니다. 품목: 관상어. 수량: 1.',c:'good',set:{quarantined:1}};
function trd08sample(){
  if(isSp('koi','@gold'))return R()<.25?{end:'TRD-08-C'}:{end:'TRD-08-B'};
  return {t:'{n}은 표본 통에 옮겨졌다가 서류 확인 뒤 봉지로 돌아왔습니다. 그동안 봉지 물은 더 탁해졌습니다.',c:'sub',fx:{h:-5},add:{bag_nh3:1,transit_delay:1}};
}
fev([{id:'TRD-08',stage:'trade',tier:'fact',w:()=>isSp('koi','@gold')?1.5:.2,
  p:'상자 뚜껑이 잠깐 열리고, 장갑 낀 손이 봉지 하나를 꺼내 들어 빛에 비춰 봅니다. 몇 마리가 다른 통으로 옮겨집니다. 뚜껑이 다시 닫힙니다. {n}은…',
  o:[
   {l:'빛 쪽으로 몸을 돌려 지느러미를 넓게 편다',chk:['c',50],ok:{t:'{n}의 상자는 "상태 양호"로 분류되어 그날 통관되었습니다.',c:'good',fx:{c:2},set:{quarantined:1}},no:()=>trd08sample()},
   {l:'봉지 구석으로 몸을 숨긴다',chk:['w',40],ok:{t:'{n}은 표본에서 빠졌습니다. 대기는 길어졌습니다.',c:'sub',add:{transit_delay:1,bag_nh3:1},set:{quarantined:1}},no:()=>trd08sample()},
   {l:'가만히 바닥에 머문다',ok:()=>{
     if(isSp('koi','@gold')&&R()<.12)return {end:'TRD-08-C'};
     return trd_r('g',40)?trd08pass:{t:'검역 창고에서의 대기는 이틀이 되었습니다. {n}은 버텼지만 몸이 축났습니다.',c:'bad',fx:{h:-10},add:{bag_nh3:1,transit_delay:1}}}}
  ]}]);

/* EV-TRD-09 봉지를 여는 순간 — [출처: 운송 봉지 개봉 후 pH 상승·비이온 암모니아 독성, 봉지 물 섞지 않기 권장] */
function trd09(b){
  b=(b||0)+(isSp('betta','wildbetta','channa','bichir','gar')?15:0)+(isSp('oscar','koi','@gold','pleco')?15:0)-(fl('sedated')?10:0)
    -(fl('bag_nh3')>=2&&isSp('neon','altum','ghost','clownloach')?20:0)-(fl('bag_nh3')||0)*3;
  if(!trd_r('g',45,b))return {end:'TRD-09-D'};
  const gill=R()<.3;
  return {t:'{n}은 새 물로 옮겨졌습니다. 같은 봉지에서 함께 온 것들 중 절반은 건져지지 않았습니다.'+(gill?' {n}의 아가미 새엽 끝은 부어 있었습니다.':''),c:'sub',fx:{h:gill?-14:-6},set:{inj_gill:gill?1:0}};
}
fev([{id:'TRD-09',stage:'trade',tier:'fact',
  p:'고무줄이 끊기고 봉지 입구가 열립니다. 갇혀 있던 공기가 빠져나갑니다. 몇 분 뒤 물 맛이 달라집니다. 아가미가 따끔거립니다. {n}은…',
  o:[
   {l:'열린 입구 쪽으로 올라가 새 물 냄새를 찾는다',chk:['w',45],ok:{t:'입구 쪽에서 움직이는 {n}이 직원 눈에 띄었습니다. {n}이 가장 먼저 새 물로 건져졌습니다.',c:'good',fx:{w:2}},no:()=>trd09(0)},
   {l:'봉지 안을 빠르게 돌며 출구를 찾는다',chk:['p',40],ok:{t:'{n}이 봉지 입구까지 몸을 밀어 올렸고, 직원이 뜰채로 받아 냈습니다.',c:'good',fx:{p:2,h:-3}},no:()=>trd09(-10)},
   {l:'아가미를 크게 움직이지 않고 바닥에 머문다',ok:()=>trd09(0)}
  ]}]);

/* EV-TRD-10 도착 사망 분류 — [출처: 수입 관상어 도착 사망(DOA) 보상 관행] */
function trd10bucket(){
  if(isSp('clownloach'))return trd_r('g',40)?{t:'양동이에 던져진 {n}이 사체 더미 위로 펄쩍 튀어 올랐습니다. 직원이 비명을 지르고 {n}을 다시 수조로 돌려놓았습니다. 보상 청구서의 "도착 사망" 숫자는 고쳐지지 않았습니다.',c:'good',fx:{h:-8,g:2},set:{doa_survivor:1},mem:'죽은 것들 사이에 던져졌다. 뛰어올라 돌아왔다.'}:{end:'TRD-10-D'};
  return trd_r('g',85)?{t:'양동이를 비우기 직전, 직원이 아가미를 움직이는 {n}을 보고 건져 냈습니다.',c:'sub',fx:{h:-12}}:{end:'TRD-10-D'};
}
fev([{id:'TRD-10',stage:'trade',tier:'fact',w:()=>fl('sedated')?1.5:1,
  p:'물통 위로 그물이 하나씩 지나갑니다. 움직이지 않는 것들이 다른 양동이로 옮겨집니다. 그물이 {n}의 위에서 멈춥니다. {n}은…',
  o:[
   {l:'꼬리를 세게 쳐서 그물 아래로 빠져나간다',chk:['p',35],ok:{t:'{n}이 그물 아래로 빠져나갔습니다. 직원은 "살아 있네" 하고 다음 칸으로 넘어갔습니다.',c:'good',fx:{p:2}},no:()=>trd10bucket()},
   {l:'그물 쪽으로 몸을 돌려 지느러미를 편다',chk:['c',45],ok:{t:'그물이 {n}을 들었다가 다시 놓았습니다.',c:'good',fx:{c:2}},
    no:()=>fl('sedated')?trd10bucket():{t:'그물이 {n}을 툭 건드리고 지나갔습니다. {n}은 수조 구석으로 밀려났습니다.',c:'sub',fx:{h:-3}}},
   {l:'바닥에 옆으로 누운 채 가만히 있는다',ok:()=>{
     if(isSp('clownloach'))return trd_r('w',50)?{t:'직원이 "얘는 원래 이래" 하고 {n}을 그냥 두었습니다.',c:'good',fx:{w:2}}:trd10bucket();
     return R()<(isSp('altum','ghost')||fl('sedated')?.7:.5)?trd10bucket():{t:'그물이 {n} 옆의 다른 몸을 떠 갔습니다.',c:'sub'}}}
  ]}]);

/* EV-TRD-11 도매상의 약욕 — the drug spreads anyway; only a staff member who notices can take the fish out
   [출처: 관상어 도매 예방 약욕(포르말린·말라카이트 그린·구리) 관행과 무비늘어 민감도, 포르말린의 용존산소 감소] */
function trd11(){
  const b=(isSp('motoro','ghost','clownloach','cory')?-25:0)+(isSp('altum','neon','peapuffer')?-15:0)+(isSp('koi','@gold','oscar','arowana','gar')?20:0)+(isSp('@airbreather')?10:0);
  if(!trd_r('g',40,b))return {end:'TRD-11-D'};
  return {t:'{n}의 피부는 몇 주에 걸쳐 다시 덮였습니다. 그 사이에 가게로 출고되었습니다.',c:'sub',fx:{h:isSp('@scaleless')?-15:-8},set:{slime_loss:1},run:()=>trd_carry(R()<.5?'fungus':'columnaris')};
}
const trd11save=()=>R()<.55?{t:'직원이 "얘들은 약에 약한 애들"이라며 {n}을 다른 통으로 뺐습니다.',c:'good',fx:{h:-3}}:{t:'직원은 유리 앞의 {n}을 한 번 보고 지나갔습니다.',c:'sub',run:()=>q(null,null,()=>fevOut(trd11()))};
fev([{id:'TRD-11',stage:'trade',tier:'fact',w:()=>trd_sens()?1.3:1,
  p:'수조 물이 푸르스름하게 물듭니다. 피부가 따끔거리고, 숨이 조금 가빠집니다. 유리 너머로 직원이 지나갑니다. {n}은…',
  o:[
   {l:'직원이 지날 때마다 유리 앞으로 나와 몸을 붙인다',chk:['c',55],ok:trd11save,no:()=>trd11()},
   {l:'수면 근처를 빙빙 돈다',chk:['w',55],ok:trd11save,no:()=>trd11()},
   {l:'구석에 가만히 있는다',ok:()=>trd11()}
  ]}]);

/* EV-TRD-30 넓은 상자 속의 가오리 — trade and, after purchase, the trip home
   [출처: 담수 가오리 운송 시 독침 보호(튜브 씌우기)·넓은 운송 용기 권장, 가오리 숨구멍(분수공) 위치] */
function trd30leak(){return trd_r('g',40,-20)?{t:'봉지의 물이 독침 구멍으로 조금씩 빠져나갔습니다. 상자가 열렸을 때 {n}의 등 피부는 군데군데 말라 있었습니다.',c:'bad',fx:{h:-20},set:{slime_loss:1}}:{end:'TRD-30-D'}}
function trd30fold(){return R()<.3?trd30leak():{t:'몸이 말린 채 아래쪽 아가미구멍이 비닐에 눌렸습니다. {n}은 숨을 얕게 쉬며 버텼습니다.',c:'bad',fx:{h:-12}}}
const trd30ok={t:'{n}은 원반을 반쯤 접은 채 도착했습니다. 물에 넣자 몇 분 동안 가장자리를 펴지 못했습니다. 이튿날 {n}은 모래를 덮고 숨었습니다.',c:'sub',fx:{h:-5}};
fev([{id:'TRD-30',stage:['trade','home'],tier:'fact',sp:['motoro'],cd:60,w:()=>S.preOwner?1.5:2,
  when:()=>S.preOwner||trd_fresh(),
  p:'봉지가 넓은 상자 바닥에 눕혀집니다. 몸을 다 펴기에는 바닥이 조금 좁습니다. 상자가 기울 때마다 봉지가 접히고, 몸 가장자리가 위로 말립니다. 꼬리가 비닐을 누릅니다. {n}은…',
  o:[
   {l:'꼬리를 들어 상자 벽을 친다',ok:()=>{
     if(fl('barb_cut'))return {t:'잘린 독침 자리가 비닐에 쓸렸습니다. 아물던 상처가 다시 벌어졌습니다.',c:'bad',fx:{h:-8},run:()=>trd_carry('fungus')};
     return R()<(R()<.35?.1:.6)?trd30leak():trd30ok}},
   {l:'몸 가장자리를 물결처럼 움직여 봉지 바닥에 몸을 펴려 한다',chk:['g',40],ok:Object.assign({},trd30ok,{fx:{g:2}}),no:()=>trd30fold()},
   {l:'말린 채로 움직이지 않는다',ok:()=>trd_r('g',35)?trd30ok:trd30fold()}
  ]}]);

/* EV-TRD-20 금붕어 잡기 노점 — fish bound for a fair stall, at the box moment before the stall
   [출처: 축제 금붕어 잡기 노점 운영 실태 — 국내 보도·동물단체 자료] */
function trd20(){
  return trd_r('g',40,isSp('guppy')?-10:0)?{t:'{n}은 다섯 번째 뜰채에 떠졌습니다. 아이는 환호했고, 부모는 "집에 어항 없잖아"라고 말했습니다.',c:'sub',fx:{h:-8},set:{carry_bag:1,slime_loss:1}}:{end:'TRD-20-D'};
}
fev([{id:'TRD-20',stage:'trade',tier:'fact',sp:['comet','ryukin'],w:.5,when:()=>trd_shop()==='fair',
  log:'{n}이 담긴 상자는 도매상이 아니라 축제장 천막으로 갔습니다. 낮 장터에도 대야가 하나 놓였습니다.',
  p:'얕은 대야 위로 종이 뜰채 수십 개가 동시에 내려옵니다. 물 깊이는 손가락 두 마디입니다. 종이 뜰채가 찢어지면 같은 손이 다시 들어옵니다. 하루 종일 그렇습니다. {n}은…',
  o:[
   {l:'뜰채가 닿기 직전에 꼬리를 쳐 빠져나간다',chk:['p',35],ok:{t:'{n}은 하루 종일 뜰채를 피했습니다. 뜰채 테두리가 닿은 자리마다 점막이 벗겨졌습니다.',c:'sub',fx:{h:-8,p:2},set:{slime_loss:1}},no:()=>trd20()},
   {l:'대야 가장자리 그늘진 곳에 몸을 붙인다',chk:['w',35],ok:{t:'{n}은 그늘에서 낮을 넘겼습니다. 해가 지자 대야의 물은 미지근했습니다.',c:'sub',fx:{w:2,h:-4}},no:()=>trd20()},
   {l:'대야 가운데에서 움직이지 않는다',ok:()=>R()<.6?{t:'움직이지 않는 {n}은 종이 뜰채에 쉽게 떠졌습니다. 아이는 환호했고, 부모는 "집에 어항 없잖아"라고 말했습니다.',c:'sub',fx:{g:1},set:{carry_bag:1}}:trd20()}
  ]}]);

/* ======================= SHOP (shop · mart · wholesale tanks) ======================= */

/* EV-TRD-12 격리 없이 섞이다 — [출처: 신규 입고어 격리 권장 기간, 네온병(Pleistophora) 치료 불가, 클라운로치 백점병 감수성] */
function trd12dz(){return isSp('neon')?(R()<.5?'neond':'ich'):isSp('clownloach','altum')?'ich':isSp('guppy')?'tetra':isSp('koi')?'khv':isSp('@gold')?'cyhv2':isSp('wildbetta')?'velvet':isSp('@predator','@big')?'worms':'ich'}
function trd12(b){
  if(trd_r('g',45,b))return {t:'{n}의 몸에는 아무것도 붙지 않았습니다. 하얀 점은 다른 물고기들 사이에서 번졌습니다.',c:'good',fx:{g:1}};
  const dz=trd12dz();
  if(dz==='neond'&&R()<.35)return {end:'TRD-12-N'};
  if(dz==='ich'&&isSp('clownloach')&&R()<.35)return {end:'TRD-12-I'};
  return {t:isSp('@predator','@big')?'{n}은 새로 들어온 작은 물고기 몇 마리를 삼켰습니다. 그 몸속에 있던 것도 함께 삼켰습니다.':'{n}은 하얀 점이 퍼지기 전에 팔려 나갔습니다. 질병은 {n}보다 하루 늦게 새 집에 도착했습니다.',c:'bad',run:()=>trd_carry(dz)};
}
fev([{id:'TRD-12',stage:'shop',tier:'fact',notSp:['betta'],when:()=>!fl('quarantined'),
  p:'그물에 담긴 낯선 물고기 열 마리가 수조에 쏟아집니다. 몇 마리는 몸에 하얀 점이 있습니다. 낯선 물고기들이 {n}의 옆을 스치고 지나갑니다. {n}은…',
  o:[
   {l:'새로 온 무리 쪽으로 다가가 냄새를 맡는다',ok:()=>trd12(isSp('@schooling')?-20:-15)},
   {l:'수초 뒤 가장 먼 구석으로 옮겨 간다',chk:['w',40],ok:{t:'{n}은 구석에서 지냈습니다. 하얀 점은 다른 물고기들에게 먼저 번졌습니다.',c:'good',fx:{st:.05,w:2}},no:()=>trd12(0)},
   {l:'원래 있던 자리에 그대로 있는다',ok:()=>trd12(0)}
  ]}]);

/* EV-TRD-13 같은 물을 쓰는 수조들 — [출처: 공용 여과(섬프) 매장 수조 간 질병 확산] */
function trd13(b){
  const col=isSp('@gold','koi','guppy','platy','betta'),dz=col?'columnaris':isSp('betta','wildbetta')?'velvet':'ich';
  b=(b||0)+(isSp('pleco','bichir','gar')?15:0)+(col&&season()==='summer'?-10:0);
  const slime=isSp('@scaleless')?' 다른 수조에 부은 약이 섬프를 타고 섞여 들어와, 비늘 없는 {n}의 피부가 따끔거렸습니다.':'';
  if(trd_r('g',45,b))return {t:'{n}의 수조는 병이 돌기 직전에 비워졌습니다. {n}은 할인 스티커와 함께 팔려 갔습니다.'+slime,c:'sub',fx:{h:slime?-8:0},set:{shared_system:1}};
  if(col&&R()<.4)return {end:'TRD-13-D'};
  return {t:'며칠 뒤 {n}의 수조에도 병이 돌기 시작했습니다. {n}은 그 전에 팔려 나갔습니다.'+slime,c:'bad',fx:{h:slime?-8:-3},set:{shared_system:1},run:()=>trd_carry(dz)};
}
fev([{id:'TRD-13',stage:'shop',tier:'fact',when:()=>['mart','shop','bigshop'].includes(trd_shop()),
  p:'아래층 어딘가에서 물이 돌아와 수조로 쏟아집니다. 다른 수조의 냄새가 섞여 있습니다. 맞은편 수조에서 몇 마리가 수면에 떠 있습니다. 직원이 그 수조에만 약을 붓습니다. {n}은…',
  o:[
   {l:'물이 쏟아지는 입구 쪽 거품 속에 머문다',ok:()=>{const r=trd13(-15);r.fx=Object.assign({},r.fx,isSp('@airbreather')?{}:{g:3});return r}},
   {l:'물살이 닿지 않는 뒤쪽 유리벽에 붙는다',chk:['w',40],ok:{t:'{n}이 붙어 있던 뒤쪽 유리벽까지는 병이 오지 않았습니다.',c:'good',fx:{w:2},set:{shared_system:1}},no:()=>trd13(0)},
   {l:'바닥 가까이에서 움직임을 줄인다',ok:()=>trd13(0)}
  ]}]);

/* EV-TRD-14 뜰채가 들어온다 — [출처: 플레코·코리·클라운로치 가시의 그물 걸림, 그물 대신 용기 사용 권장] */
function trd14caught(jump){
  if(trd_spiny()){
    if(trd_r('g',40))return {t:'가시가 그물코에 걸렸습니다. 직원이 손으로 떼어 냈고, {n}은 봉지로 옮겨졌습니다.',c:'sub',fx:{h:-4}};
    return R()<.5?{end:'TRD-14-D'}:{t:'직원이 그물코에 걸린 {n}을 잡아당겼습니다. 가슴지느러미 가시의 기조가 부러졌습니다.',c:'bad',fx:{h:-12,fin:.2},set:{inj_fin:1}};
  }
  if(jump&&isSp('arowana','channa','comet','betta','wildbetta'))return trd15jump();
  if(isSp('@longfin')&&R()<.5)return {t:'{n}은 그물에 담겨 봉지로 옮겨졌습니다. 그물에 쓸린 지느러미 끝이 갈라졌습니다.',c:'sub',fx:{fin:.12}};
  return {t:'{n}은 그물에 담겨 봉지로 옮겨졌습니다.',c:'sub'};
}
fev([{id:'TRD-14',stage:'shop',tier:'fact',notSp:['koi','oscar','motoro','gar','@puffer'],
  p:'초록 그물이 물속으로 들어옵니다. 손님 손가락이 유리를 톡톡 칩니다. 그물이 수조를 한 바퀴 돌고 {n}의 뒤에서 다가옵니다. {n}은…',
  o:[
   {l:'수초와 장식 사이로 빠르게 빠져나간다',chk:['p',40],ok:{t:'{n}은 그물을 세 번 따돌렸습니다. 직원은 숨을 몰아쉬며 다른 물고기를 떴습니다.',c:'good',fx:{h:-4,p:2}},no:()=>trd14caught(1)},
   {l:'그물 쪽으로 몸을 돌려 지느러미를 쫙 편다',chk:['c',50],
    ok:()=>fst().c>=capOf('c')*.9?{t:'{n}이 그물 앞에서 지느러미를 펴고 정면으로 다가갔습니다. 손님은 "얘가 저를 골랐네요"라며 {n}을 샀습니다. 손님이 처음에 가리킨 물고기는 다음 손님에게 같은 그물로 떠졌습니다.',c:'good',fx:{c:2},run:()=>{S.f.shopMood='front'}}
      :{t:'손님이 마음을 바꿨습니다. "그 옆에 거요." 그물은 {n}을 지나쳐 갔습니다.',c:'good',fx:{c:2},add:{unsold:1}},
    no:()=>trd14caught(0)},
   {l:'그대로 멈춰 그물이 몸을 감싸게 둔다',ok:()=>trd14caught(0)}
  ]}]);

/* EV-TRD-15 판매 수조 밖으로 — [출처: 아로와나·가물치류 점프·탈출 습성] */
function trd15jump(){
  const p=fst().p,cap=capOf('p');
  if(p>=cap*.92&&cap>=60)return {t:'{n}은 틈으로 튀어 나와 두 칸 옆 수조에 정확히 떨어졌습니다. 그 수조의 가격표는 {n}보다 세 배 비쌌습니다. 아침에 직원은 그 수조에서 {n}을 찾아냈고, 가격표를 바꾸지 않았습니다.',c:'good',fx:{h:-5},mem:'유리벽을 넘었다. 다른 물에 떨어졌다.'};
  if(isSp('channa','bichir'))return trd_r('g',50)?{t:'{n}은 진열대 뒤 바닥에 떨어졌습니다. 공기로 숨을 쉬며 밤을 버텼고, 아침에 출근한 직원이 {n}을 주워 수조에 넣었습니다.',c:'sub',fx:{h:-15},set:{inj_skin:1}}:{end:'TRD-15-D'};
  if(p>=cap*.6){
    if(R()<.5)return {t:'{n}은 옆 수조 뚜껑 위에 떨어져 퍼덕이다 원래 수조로 미끄러져 들어갔습니다.'+(isSp('arowana')?' 아래턱이 먼저 부딪혔습니다.':''),c:'bad',fx:{h:-10},set:{inj_skin:1}};
    if(fx_().cm<15)return {t:'{n}은 옆 수조로 떨어졌습니다. 그 수조에는 큰 물고기들이 있었습니다.',c:'bad',run:()=>q(null,null,()=>fEnd('shopmate',pick(['oscar','arowana','channa'].filter(s=>s!==S.sp.id))))};
    return {t:'{n}은 옆 수조로 떨어졌습니다. 아침에 직원이 {n}을 원래 수조로 옮겼습니다.',c:'bad',fx:{h:-8}};
  }
  return {end:'TRD-15-D'};
}
fev([{id:'TRD-15',stage:'shop',tier:'fact',sp:['@jumper','@escaper','guppy','platy'],w:()=>isSp('guppy','platy')?.2:1,
  p:'매장 불이 꺼집니다. 위쪽 형광등 하나만 깜빡입니다. 뚜껑과 유리 사이에 손가락 두 개만 한 틈이 있습니다. 그 틈으로 바깥 공기가 들어옵니다. {n}은…',
  o:[
   {l:'틈 아래에서 수면을 향해 몸을 띄운다',chk:['w',50],ok:{t:'{n}은 수면 아래에서 밤을 보냈습니다. 틈으로는 형광등 불빛만 들어왔습니다.',c:'good',fx:{w:2}},no:()=>trd15jump()},
   {l:'틈 쪽 유리벽을 따라 천천히 헤엄친다',when:()=>isSp('@escaper'),chk:['w',50],ok:{t:'{n}은 틈을 지나쳐 다시 아래로 내려갔습니다.',c:'good',fx:{w:2}},
    no:()=>isSp('channa','bichir')?trd15jump():{end:'TRD-15-D'}},
   {l:'바닥 장식 뒤로 내려간다',ok:{t:'{n}은 장식 뒤에서 아침을 기다렸습니다.',fx:{g:1}}}
  ]}]);

/* EV-TRD-16 먹이용 수조 — [출처: 먹이용 금붕어(feeder) 사육 밀도·질병 운반 위험] */
function trd16stay(){
  if(isSp('comet')&&fst().g>=capOf('g')*.85)return {t:'{n}은 먹이 수조에서 석 달을 살았습니다. 너무 커진 {n}은 "관상용 코메트" 수조로 옮겨졌고 가격이 서른 배 올랐습니다. 같은 날 같은 수조에서 온 동기들은 모두 누군가의 저녁이 되었습니다.',c:'good',fx:{g:2},mem:'먹이 수조에서 살아남았다. 너무 커져서.'};
  if(isSp('guppy')&&trd_r('c',60))return {t:'{n}의 꼬리 색이 직원 눈에 띄었습니다. {n}은 일반 판매 수조로 옮겨졌습니다.',c:'good',fx:{c:2}};
  return {t:'{n}은 먹이 수조에서 하루를 더 넘겼습니다. 몸은 더 홀쭉해졌습니다.',c:'sub',fx:{h:-5},set:{thin:1},run:()=>{if(R()<.3)trd_carry('worms')}};
}
fev([{id:'TRD-16',stage:'shop',tier:'fact',sp:['comet','guppy','platy','oranda'],w:()=>isSp('comet','guppy')?1.2:.2,
  when:()=>['mart','shop'].includes(trd_shop()),
  p:'수조 안이 몸으로 가득합니다. 헤엄칠 공간보다 다른 물고기의 몸이 더 많습니다. 바닥에는 움직이지 않는 몸들이 깔려 있습니다. 하루에 몇 번, 그물이 들어와 한 움큼씩 떠 갑니다. {n}은…',
  o:[
   {l:'그물이 들어올 때 무리 가장 안쪽으로 파고든다',chk:['w',35],ok:()=>trd16stay(),no:{end:'TRD-16-D'}},
   {l:'수면 가까이 산소가 많은 곳을 차지한다',chk:['p',40],ok:()=>trd16stay(),no:()=>R()<.5?{end:'TRD-16-D'}:{t:'자리 싸움에서 밀린 {n}은 옆구리 비늘이 벗겨졌습니다.',c:'bad',fx:{h:-8}}},
   {l:'바닥 가까이 사체들 사이에 머문다',ok:()=>trd_r('g',50)?trd16stay():{t:'사체가 썩는 물이 {n}의 아가미를 붓게 했습니다.',c:'bad',fx:{h:-15},run:()=>trd_carry('worms')}}
  ]}]);

/* EV-TRD-17 마트 수족관 코너 — [출처: 대형마트 관상어 판매 관리 실태 — 보도·조사 자료 확인 필요] (tier likely until sourced) */
function trd17night(b){
  if(!trd_r('g',35,b))return R()<.5?{end:'TRD-17-D'}:{t:'밤사이 물이 나빠졌습니다. {n}의 아가미는 붉게 부었지만, 아침 청소 때 {n}은 움직이고 있었습니다.',c:'bad',fx:{h:-15}};
  const x=isSp('peapuffer')?' 마트는 달팽이나 냉동 장구벌레를 주지 않았습니다. {n}의 배가 꺼지고, 부리가 길어졌습니다.':isSp('oscar')?' 작은 수조에서 {n}의 몸은 더 자라지 않았습니다.':'';
  return {t:'{n}은 마트 수조에서 몇 주를 버텼습니다. 장 보러 온 가족이 아이 손에 이끌려 {n}을 장바구니에 넣었습니다. 계산대에서 {n}은 두부 옆에 놓였습니다.'+x,c:'sub',set:{thin:isSp('peapuffer')?1:0,stunted:isSp('oscar')?1:0}};
}
fev([{id:'TRD-17',stage:'shop',tier:'likely',sp:['@gold','guppy','platy','neon','cory','pleco','oscar','peapuffer'],when:()=>trd_shop()==='mart',
  p:'계산대 음악이 수조 유리까지 울립니다. 사료가 한 번 떨어지고, 한 시간 뒤 다른 직원이 또 떨어뜨립니다. 바닥에 하루 지난 사체 하나가 하얗게 부풀어 있습니다. 다른 물고기들이 그것을 쪼고 있습니다. {n}은…',
  o:[
   {l:'떨어지는 사료를 모두 먹는다',ok:()=>{const r=trd17night(-5);r.fx=Object.assign({},r.fx,{fat:.2});if(isSp('oranda','ryukin')&&!r.end)r.run=()=>trd_carry('swimb');return r}},
   {l:'사체 쪽으로 가서 같이 쪼아 본다',ok:()=>{const r=trd17night(0);if(!r.end)r.run=()=>trd_carry(pick(['aero','worms','columnaris']));return r}},
   {l:'사료도 사체도 피해 수조 뒤편에 머문다',ok:()=>{
     if(isSp('cory','pleco')&&R()<.5){const r=trd17night(0);r.t='바닥에 가라앉은 것은 무엇이든 입에 넣는 몸이었습니다. {n}은 사체 옆 사료를 먹었습니다. '+(r.t||'');if(!r.end)r.run=()=>trd_carry('aero');return r}
     return trd_r('g',40)?{t:'{n}은 수조 뒤편에서 지냈습니다. 몇 주 뒤, 장 보러 온 가족이 {n}을 장바구니에 넣었습니다.',c:'good',fx:{g:2}}:trd17night(0)}}
  ]}]);

/* EV-TRD-18 팔리지 않은 것 — [출처: 대형 관상어 성장 크기와 소형 수조 사육 시 기형(stunting)] */
fev([{id:'TRD-18',stage:'shop',tier:'fact',w:()=>isSp('@big')||fl('unsold')?2:.4,
  p:'수조가 점점 작게 느껴집니다. 몸을 돌릴 때 꼬리가 유리에 닿습니다. 가격표 위에 노란 스티커가 한 장 더 붙습니다. {n}은…',
  o:[
   {l:'손님이 지나갈 때마다 유리 앞으로 나온다',chk:['c',55],
    ok:()=>fst().c>=capOf('c')*.9?{t:'노란 스티커가 세 장 붙은 날, {n}은 손님 눈을 따라 유리를 오갔습니다. 그 손님은 집에 큰 수조가 있는 사람이었습니다. 가게 사장은 "역시 마지막에 팔리는 놈이 운이 좋다"고 말했습니다. 그 말은 먹이 붕어 수조 옆에서 나왔습니다.',c:'good',fx:{c:2},run:()=>{S.f.shopMood='hide'}}
      :{t:'{n}은 그날 팔렸습니다.',c:'good',fx:{c:2},run:()=>{S.f.shopMood='friendly'}},
    no:{t:'손님들은 {n} 앞에서 멈추지 않았습니다.',c:'sub',fx:{st:.05},add:{unsold:1}}},
   {l:'수조 장식을 밀어내 자리를 넓힌다',chk:['p',60],ok:{t:'장식이 넘어지며 히터 유리관을 쳤습니다. 직원은 히터를 갈았고, {n}의 자리는 조금 넓어졌습니다.',c:'sub',fx:{p:2}},no:{t:'장식은 꿈쩍하지 않았습니다. 주둥이가 쓸렸습니다.',c:'bad',fx:{h:-6}}},
   {l:'구석에 몸을 접고 가만히 있는다',ok:()=>{
     if(isSp('oscar','arowana')&&R()<.3)return {end:'TRD-18-D'};
     if(isSp('@big')&&R()<.2)return {t:'석 달이 지났습니다. 직원은 {n}을 대형어 수조로 옮겼습니다.',c:'bad',run:()=>q(null,null,()=>fEnd('unsoldfeed',pick(['arowana','channa','gar'].filter(s=>s!==S.sp.id))))};
     return trd_r('g',40)?{t:'{n}은 구석에서 버텼습니다. 몸은 더 자라지 않았습니다.',c:'sub',set:{stunted:1},add:{unsold:1}}
       :{t:isSp('@big')?'{n}의 등뼈가 조금씩 휘기 시작했습니다.':'{n}은 "재고 정리" 가격표와 함께 한 봉지에 열 마리씩 팔려 나갔습니다.',c:'bad',fx:{h:-8},set:{stunted:isSp('@big')?1:0}}}}
  ]}]);

/* EV-TRD-19 컵 속의 베타 — [출처: 베타 컵 진열 판매 관행과 수질·온도 문제] */
function trd19(){return R()<.5?{end:'TRD-19-D'}:{t:'컵 물에 녹은 사료가 쌓였습니다. {n}의 지느러미 가장자리가 검게 녹기 시작했습니다.',c:'bad',fx:{h:-10,fin:.15},run:()=>trd_carry('finrot')}}
fev([{id:'TRD-19',stage:'shop',tier:'fact',sp:['@labyrinth'],when:()=>['mart','shop','online'].includes(trd_shop()),
  p:'컵은 몸을 한 번 돌리면 벽입니다. 바로 옆 컵에 다른 수컷이 보입니다. 둘 사이에 종이 한 장이 끼워져 있다가, 손님이 올 때만 빠집니다. 물에 지난주 사료 알갱이가 그대로 가라앉아 있습니다. {n}은…',
  o:[
   {l:'종이가 빠질 때마다 옆 컵의 수컷에게 지느러미를 활짝 편다',chk:['c',60],
    ok:()=>{if(isSp('wildbetta')&&R()<.4)return {t:'{n}의 빛깔은 옆 컵의 베타만큼 화려하지 않았습니다. 손님은 옆 컵을 집었습니다.',c:'sub',fx:{h:-3}};
      return fst().c>=capOf('c')*.9?{t:'{n}은 옆 컵의 수컷에게 하루 마흔 번 지느러미를 폈습니다. 한 손님이 "얘가 제일 화났어요"라며 {n}을 샀습니다. 손님은 집에 가서 {n}을 같은 크기의 유리컵에 옮겼습니다.',c:'good',fx:{c:2,fin:.05},run:()=>{S.f.shopMood='show'}}
        :{t:'손님 눈에 띈 {n}은 그날 팔렸습니다. 지느러미 끝은 조금 녹아 있었습니다.',c:'good',fx:{c:2,fin:isSp('betta')&&R()<.4?.08:0}}},
    no:{t:'지느러미를 펴느라 힘이 빠졌습니다. 지느러미 끝이 갈라졌습니다.',c:'bad',fx:{h:-5,fin:.08}}},
   {l:'수면에서 공기를 마시며 컵 바닥의 사료를 무시한다',chk:['g',45],ok:{t:'{n}은 수면 공기로 버텼습니다.',c:'good',fx:{g:2}},no:()=>trd19()},
   {l:'컵 바닥에 지느러미를 접고 가만히 있는다',ok:()=>trd_r('g',35,(season()==='winter'?-15:0)+(isSp('wildbetta')?10:0))?{t:'{n}은 컵 바닥에서 다음 손님을 기다렸습니다.',c:'sub',fx:{g:1}}:trd19()}
  ]}]);

/* ======================= HOME (carrying home, parcels, acclimation, moving, handovers) ======================= */

/* EV-TRD-21 하루 종일 들고 다닌 봉지 — [출처: 없음 — 메커니즘만 사용(산소·온도)] */
function trd21(b){
  if(isSp('oranda','ryukin')&&R()<.2)return {t:'짧은 몸이 흔들림에 몇 번 뒤집혔습니다. 집에 도착한 {n}은 몸이 한쪽으로 기울어 있었습니다.',c:'bad',sick:'swimb'};
  if(!trd_r('g',38,(b||0)+(isSp('guppy')?-10:0)))return {end:'TRD-21-D'};
  return {t:'{n}은 집에 도착했습니다. 집에는 어항이 없어서, 그날 밤 {n}은 국그릇에서 잤습니다.',c:'sub',fx:{h:-8},pl:[[2,'어항 없이 데려옴']]};
}
fev([{id:'TRD-21',stage:'home',tier:'likely',once:1,w:2,own:['gift','casual','eager','breakup','shared'],sp:['comet','oranda','ryukin','guppy'],
  when:()=>trd_fresh()&&(fl('carry_bag')||['fair','mart','friend'].includes(trd_shop())),
  p:'봉지가 손끝에서 흔들립니다. 해가 봉지를 통과해 물을 데웁니다. 봉지는 가끔 꽉 쥐어지고, 한 번은 바닥에 떨어졌다가 다시 들립니다. {n}은…',
  o:[
   {l:'흔들릴 때마다 반대 방향으로 헤엄쳐 균형을 잡는다',chk:['g',45],ok:{t:'{n}은 끝까지 몸을 세우고 버텼습니다. 그날 밤 {n}은 국그릇에서 잤습니다.',c:'sub',fx:{g:2,h:-4}},no:()=>trd21(-10)},
   {l:'봉지 위쪽 공기에 입을 대고 숨을 쉰다',ok:()=>trd21(0)},
   {l:'봉지 바닥에 몸을 붙이고 흔들림에 맡긴다',ok:()=>trd21(5)}
  ]}]);

/* EV-TRD-22 여름 생물 택배 — [출처: 국내 관상어 택배 발송 관행(폭염·한파 발송 중지, 아이스팩·핫팩 동봉) — 쇼핑몰 공지 예시] */
const trd_shipLog='{n}이 이 집에 오기까지, 택배 상자 안에서 보낸 하루가 있었습니다.';
function trd22(b){
  b=(b||0)+(isSp('@gold','koi','gar')?15:0)+(isSp('@labyrinth')?10:0)-(R()<.2?10:0);
  if(!trd_r('g',35,b))return {end:'TRD-22-D'};
  return {t:'{n}은 도착했습니다. 판매자는 "여름 발송은 책임지지 않습니다"라는 문구를 상세페이지 맨 아래에 적어 두었습니다.',c:'sub',fx:{h:-8},
    run:()=>trd_learn('shipping_season',['expert','learner','techbro'],.7,'주인은 다음부터 한여름과 한겨울에는 생물 택배를 주문하지 않기로 했습니다.')};
}
fev([{id:'TRD-22',stage:'home',tier:'fact',once:1,w:2,need:{season:'summer'},when:()=>trd_fresh()&&trd_ship(),log:trd_shipLog,
  p:'스티로폼 상자 안이 깜깜합니다. 트럭 짐칸이 멈출 때마다 상자가 다른 상자 사이에 눌립니다. 시간이 지날수록 물이 미지근해집니다. 한쪽 구석은 이상하게 차갑습니다. {n}은…',
  o:[
   {l:'차가운 쪽 봉지 벽에 몸을 붙인다',ok:()=>{
     if(isSp('@gold','koi','gar'))return {t:'아이스팩 쪽 물은 시원했습니다. {n}은 거기서 하루를 넘겼습니다.',c:'good',fx:{g:1}};
     if(trd_r('g',40,isSp('neon','altum','apisto')?-10:0))return trd22(5);
     return {t:'아이스팩이 닿은 벽 쪽 물은 너무 찼습니다. {n}의 몸이 떨리고 지느러미가 접혔습니다.',c:'bad',fx:{h:-15},run:()=>{S.f.coldShock=1}}}},
   {l:'봉지 한가운데에 떠서 천천히 숨을 쉰다',chk:()=>['g',isSp('@labyrinth')?35:45],ok:()=>trd22(30),no:()=>trd22(0)},
   {l:'바닥으로 내려가 움직임을 멈춘다',ok:()=>trd22(5)}
  ]}]);

/* EV-TRD-23 겨울 택배와 핫팩 — [출처: 동절기 관상어 택배 핫팩 사용과 직접 접촉 금지 안내] */
function trd23cold(b){
  if(!isSp('@tropical'))return {t:'{n}은 차가운 상자 안에서 하루를 넘겼습니다. 추위는 {n}의 몸에 익숙한 것이었습니다.',c:'good'};
  if(!trd_r('g',40,b))return {end:'TRD-23-C'};
  return {t:'{n}은 미지근한 상태로 도착했습니다. 주인은 상자 사진을 찍어 후기에 "꼼꼼한 포장 감사합니다"라고 남겼습니다.',c:'sub',fx:{h:-10},run:()=>{S.f.coldShock=1;trd_learn('shipping_season',['expert','learner','techbro'],.7,'주인은 다음부터 한겨울에는 생물 택배를 주문하지 않기로 했습니다.')}};
}
fev([{id:'TRD-23',stage:'home',tier:'fact',once:1,w:2,need:{season:'winter'},when:()=>trd_fresh()&&trd_ship(),log:trd_shipLog,
  p:()=>{setFl('trd_hp',R()<.75?1:0);return fl('trd_hp')?'상자 안 공기가 차갑습니다. 한쪽 봉지 벽만 따뜻합니다. 그 벽에 무언가 납작한 것이 붙어 있습니다. 따뜻한 쪽은 점점 뜨거워집니다. {n}은…':'상자 안 공기가 차갑습니다. 복도 바람이 상자 틈으로 들어옵니다. 봉지 속 물이 시간마다 조금씩 식어 갑니다. {n}은…'},
  o:[
   {l:'따뜻한 벽 쪽으로 다가간다',when:()=>fl('trd_hp'),ok:()=>{
     if(trd_r('w',45))return {t:'벽이 너무 뜨거워지자 {n}은 몸을 떼고 한 뼘 물러났습니다. 그 자리가 가장 알맞은 온도였습니다.',c:'good',fx:{w:2}};
     if(isSp('@scaleless')||R()<.5)return {end:'TRD-23-B'};
     return {t:'핫팩이 닿은 쪽 피부가 하얗게 변했습니다. 주인은 상자 사진을 찍어 후기에 "꼼꼼한 포장 감사합니다"라고 남겼습니다. 핫팩 자국은 다음 주에 나타났습니다.',c:'bad',fx:{h:-15},set:{inj_burn:1},run:()=>trd_carry('fungus')}}},
   {l:'봉지의 반대쪽 차가운 구석으로 간다',when:()=>fl('trd_hp'),ok:()=>trd23cold(-10)},
   {l:'봉지 벽을 따라 천천히 돌며 몸을 데운다',when:()=>!fl('trd_hp'),ok:()=>trd23cold(-10)},
   {l:'봉지 한가운데에서 움직임을 줄인다',ok:()=>trd23cold(0)}
  ]}]);

/* EV-TRD-24 명절 연휴 택배 — [출처: 국내 택배 명절 연휴 배송 중단 기간] */
function trd24(b){
  const d=Math.floor(R()*3)*5;
  b=(b||0)+(fl('fasted')?10:0)+(isSp('koi','oscar','arowana')?-10:0);
  if(!trd_r('g',50+d,b))return {end:'TRD-24-D'};
  return {t:isSp('@schooling','@small')?'{n}은 나흘 만에 도착했습니다. 같은 봉지의 다섯 마리 중 {n}만 움직였습니다. 판매자는 "연휴 기간은 생존 보장 불가"라고 답장했습니다. 주문하기 전에 적혀 있던 문장입니다.'
    :'{n}은 나흘 만에 도착했습니다. 아가미 끝이 하얗게 엉겨 있었습니다. 판매자는 "연휴 기간은 생존 보장 불가"라고 답장했습니다. 주문하기 전에 적혀 있던 문장입니다.',c:'bad',fx:{h:-15},set:{slime_loss:1,inj_gill:1},
    run:()=>trd_learn('shipping_season',['expert','learner','breeder'],.6,'주인은 다음부터 연휴 앞에는 생물 택배를 주문하지 않기로 했습니다.')};
}
fev([{id:'TRD-24',stage:'home',tier:'fact',once:1,w:.8,when:()=>trd_fresh()&&trd_ship(),log:trd_shipLog,
  p:'상자가 움직이지 않습니다. 하루가 지나고, 또 하루가 지납니다. 봉지 속 물이 점점 탁해지고, 공기층이 얇아집니다. {n}은…',
  o:[
   {l:'다른 물고기 쪽에서 멀어져 봉지 벽에 붙는다',when:()=>isSp('@schooling','@small'),chk:['w',40],ok:()=>trd24(10),no:()=>trd24(-5)},
   {l:'공기층 바로 아래에서 짧게 숨을 쉰다',chk:()=>['g',isSp('@labyrinth','@airbreather')?35:55],ok:()=>trd24(25),no:()=>trd24(0)},
   {l:'바닥에서 거의 움직이지 않는다',ok:()=>trd24(0)}
  ]}]);

/* EV-TRD-25 문 앞의 상자 — [출처: 없음 — 메커니즘만] */
function trd25(b){
  b=(b||0)+(isKind('neglect')?-15:isKind('expert','learner','techbro')?15:isKind('casual','breakup')?-5:0)+(isSp('@small')?-10:0);
  if(!trd_r('g',40,b))return {end:'TRD-25-D'};
  return {t:'주인은 밤 열한 시에 상자를 열었습니다. {n}은 살아 있었습니다. 주인은 "역시 튼튼하네"라고 말했습니다.'+(isSp('arowana')?' 고속버스 짐칸에서 몸을 튕긴 {n}의 옆구리 비늘이 몇 장 빠져 있었습니다.':''),c:'sub',fx:{h:isSp('arowana')?-12:-6},add:{bag_nh3:1},
    run:()=>trd_learn('parcel_home',['expert','learner'],.7,'주인은 다음부터 택배 받는 날에는 집에 있기로 했습니다.')};
}
fev([{id:'TRD-25',stage:'home',tier:'likely',once:1,w:1.2,when:()=>trd_fresh()&&(trd_ship()||(trd_shop()==='bigshop'&&isSp('@big'))),log:trd_shipLog,
  p:()=>(isSp('@big')&&trd_shop()==='bigshop'?'상자가 고속버스 터미널 수화물 보관소 바닥에 놓입니다. 찾으러 오는 사람은 없습니다. ':'상자가 바닥에 놓이고 초인종이 한 번 울립니다. 아무도 나오지 않습니다. ')+(season()==='winter'?'복도 바람이 상자 틈으로 들어옵니다.':'상자 위로 햇볕이 들어옵니다.')+' {n}은…',
  o:[
   {l:'봉지 안을 돌며 바깥 소리 쪽으로 몸을 돌린다',ok:()=>trd_r('c',40)?{t:'봉지 안의 움직임이 상자를 흔들었습니다. 지나가던 이웃이 상자를 그늘로 옮겨 주었습니다. 주인은 저녁에 상자를 열었습니다.',c:'good',fx:{c:1,h:-4}}:trd25(-10)},
   {l:'공기층 아래에서 천천히 숨을 쉰다',chk:['g',45],ok:()=>trd25(25),no:()=>trd25(0)},
   {l:'바닥에 몸을 낮추고 움직이지 않는다',ok:()=>trd25(0)}
  ]}]);

/* EV-TRD-26 언박싱 — [출처: 없음 — 메커니즘만. 공기 노출 시 아가미 새엽 붕괴는 어병학 교재로 확인] */
function trd26grab(){
  if(isSp('@puffer'))return trd04gulp();
  if(isSp('motoro'))return trd_r('g',45)?{t:'손에 잡히는 순간 {n}의 꼬리가 반사적으로 휘었습니다. 독침이 주인 손등에 박혔습니다. 주인이 비명을 지르며 {n}을 수조 위로 떨어뜨렸습니다. 영상은 올라가지 않았습니다.',c:'bad',fx:{h:-15},set:{stung_owner:1}}:{end:'TRD-26-D'};
  if(isSp('arowana','channa'))return trd_r('g',45)?{t:'{n}은 손 안에서 몸을 튕겨 빠져나갔고, 바닥에 떨어졌다가 다시 주워져 수조에 들어갔습니다. 비늘 몇 장이 바닥에 남았습니다.',c:'bad',fx:{h:-15},set:{inj_skin:1}}:{end:'TRD-26-D'};
  return trd_r('g',45)?{t:'30초 뒤 물에 돌아간 {n}은 한참 바닥에 옆으로 누워 있다가 다시 헤엄쳤습니다. 영상의 제목에는 "기절"이라는 단어가 들어갔습니다.',c:'bad',fx:{h:-15},set:{slime_loss:1}}:{end:'TRD-26-D'};
}
fev([{id:'TRD-26',stage:'home',tier:'likely',once:1,own:['unbox','content'],
  w:()=>(isKind('unbox')?5:1.5)*(isSp('betta','@puffer','motoro','arowana','channa')?1:.4),when:()=>trd_fresh(),
  p:'상자가 열리기 전에 밝은 조명이 켜집니다. 사람이 상자 앞에서 한참 말을 합니다. 봉지가 들어 올려져 카메라 앞에서 이리저리 기울어집니다. 그다음 손이 봉지 안으로 들어옵니다. {n}은…',
  o:[
   {l:'손을 피해 봉지 바닥으로 빠르게 내려간다',chk:['p',40],ok:{t:'{n}은 손을 끝내 피했습니다. 주인은 봉지째 수조에 부었습니다.',c:'good',fx:{p:2}},no:()=>trd26grab()},
   {l:'손가락 쪽으로 다가가 주둥이로 건드린다',chk:['c',60],
    ok:{t:'{n}은 손가락을 따라 봉지 안을 한 바퀴 돌았습니다. 주인은 "와, 얘 저 알아보는 것 같아요"라고 말했습니다. 그 영상은 조회수 백만을 넘겼습니다. 다음 주에 주인은 같은 종을 세 마리 더 주문했습니다. 세 마리는 손 위에서 촬영되었습니다.',c:'good',fx:{c:2,i:.15},set:{viral:1}},
    no:()=>trd26grab()},
   {l:'지느러미를 접고 몸을 낮춘다',ok:()=>trd26grab()}
  ]}]);

/* EV-TRD-27 큰 봉지, 긴 귀갓길 — [출처: 없음 — 메커니즘만] */
function trd27(b){
  b=(b||0)+(isSp('oscar','koi')?-15:0)+(isSp('betta')?20:0)-(R()<.5?10:0);
  if(!trd_r('g',40,b))return {end:'TRD-27-D'};
  return {t:'{n}은 집에 도착했습니다. 주인은 피곤해서 봉지를 수조 옆에 둔 채 씻으러 갔습니다.',c:'sub',fx:{h:-6},set:{acclimation:'float'},add:{bag_nh3:1},
    run:()=>trd_learn('o2_bag',['learner','expert'],.6,'주인은 다음부터 가게에 아이스박스를 들고 가서 산소 포장을 부탁하기로 했습니다.')};
}
fev([{id:'TRD-27',stage:'home',tier:'likely',once:1,own:['casual','eager','gift','learner'],w:()=>isSp('@big')?2:1,
  when:()=>trd_fresh()&&['mart','shop','bigshop'].includes(trd_shop())&&!fl('o2_bag'),
  p:'봉지는 검은 비닐봉지에 한 번 더 싸입니다. 안은 깜깜합니다. 봉지가 무릎 위에서, 손잡이에서, 걸음마다 흔들립니다. 몸을 펴면 꼬리가 비닐에 닿습니다. {n}은…',
  o:[
   {l:'몸을 곧게 펴서 봉지 모양을 넓힌다',chk:['p',50],
    ok:()=>isSp('arowana','channa')&&R()<.4?{t:'{n}이 몸을 펴다 봉지 안에서 튀어 올랐습니다. 아래턱이 비닐 매듭에 부딪혔고, 비늘 몇 장이 떨어졌습니다.',c:'bad',fx:{h:-10},set:{inj_skin:1}}:{t:'{n}은 몸으로 비닐을 밀어 버텼습니다. 집까지 봉지는 찌그러지지 않았습니다.',c:'good',fx:{p:2}},
    no:()=>trd27(-5)},
   {l:'몸을 둥글게 말아 봉지 안에 맞춘다',chk:()=>['w',isSp('arowana')?50:40],
    ok:()=>isSp('pleco')&&R()<.3?{t:'{n}의 몸 돌기가 비닐에 걸려 지느러미가 갈라졌습니다. 그래도 {n}은 집까지 버텼습니다.',c:'sub',fx:{fin:.1}}:{t:'{n}은 몸을 말고 집까지 버텼습니다.',c:'good',fx:{w:2}},
    no:()=>trd27(0)},
   {l:'흔들림에 몸을 맡기고 숨만 쉰다',ok:()=>trd27(isSp('neon')?5:0)}
  ]}]);

/* EV-TRD-28 봉지째 쏟기 — overlaps the arrival line in fishBuy (w .5)
   [출처: 물맞이(수온 맞추기·점적) 권장, 봉지 물 수조 투입 금지 권장] */
function trd28(b){
  const need=45+(fl('bag_nh3')||0)*5+(S.f.coldShock?15:0);
  b=(b||0)+(isSp('neon','altum','ghost','apisto','clownloach')?-15:0)+(isSp('@gold','koi','gar','pleco')?20:0);
  const learn=()=>trd_learn('acclimation_ok',['learner'],.7,'주인은 "물맞이"를 검색했습니다. 다음부터는 봉지를 띄워 온도를 맞추고, 물을 조금씩 섞기로 했습니다.');
  if(!trd_r('g',need,b))return R()<.5?{end:'TRD-28-D'}:{t:'이틀 뒤 {n}의 몸에 하얀 점이 돋기 시작했습니다.',c:'bad',fx:{h:-10,st:.15},set:{acclimation:'dump'},run:()=>{fSick('ich');learn()}};
  const m=S.f.carrier&&S.f.mates.some(x=>x.n>0);
  return {t:m?'{n}은 쏟아진 다음 날 아침에도 헤엄쳤습니다. 수조에 원래 있던 물고기 두 마리는 일주일 뒤 하얀 점을 달고 떠올랐습니다. 주인은 그 두 마리가 왜 죽었는지 몰랐습니다.':'{n}은 쏟아진 다음 날 아침에도 헤엄쳤습니다.',c:'sub',fx:{st:.1},set:{acclimation:'dump'},run:learn};
}
fev([{id:'TRD-28',stage:'home',tier:'fact',once:1,w:.5,when:()=>trd_fresh()&&!isKind('expert','staff','breeder')&&!fl('acclimation_ok'),
  p:'봉지가 기울어집니다. 물과 함께 몸이 넓은 곳으로 쏟아져 나갑니다. 물의 온도가 갑자기 다릅니다. 맛도 냄새도 다릅니다. {n}은…',
  o:[
   {l:'낯선 물 속을 빠르게 헤엄쳐 숨을 곳을 찾는다',chk:['w',40],ok:()=>{const r=trd28(10);if(!r.end)r.t='{n}은 수초 뒤를 찾아 들어갔습니다. '+r.t;return r},no:()=>trd28(-5)},
   {l:'쏟아진 자리에서 수면 쪽으로 올라간다',ok:()=>trd28(0)},
   {l:'바닥에 닿은 자리에 그대로 머문다',ok:()=>trd28(0)}
  ]}]);

/* EV-TRD-29 띄워 둔 채 잊힌 봉지 — [출처: 봉지 띄우기 물맞이 권장 시간과 조명 아래 과열 주의] */
function trd29(b){
  b=(b||0)+(isSp('oscar','koi','arowana')?-20:0)+(isSp('neon','altum','apisto')?-10:0)+(isSp('@labyrinth')?15:0);
  if(!trd_r('g',40,b))return {end:'TRD-29-D'};
  return {t:'주인은 40분 만에 돌아와 봉지를 열었습니다. 인터넷에서 읽은 "15분"보다 길었지만, {n}은 살아 있었습니다.',c:'sub',fx:{h:-6},set:{acclimation:'float'},
    run:()=>trd_learn('float_timer',['learner','expert','techbro'],.6,'주인은 다음부터 봉지를 띄울 때 휴대폰 타이머를 맞춰 두었습니다.')};
}
fev([{id:'TRD-29',stage:'home',tier:'fact',once:1,own:['learner','eager','casual','gift','techbro'],when:()=>trd_fresh()&&!fl('float_timer'),
  w:()=>fl('acclimation')==='float'?3:1,
  p:'봉지가 수조 위에 떠 있습니다. 비닐 너머로 넓은 물이 보입니다. 바로 위에서 조명이 켜져 있습니다. 봉지 속 물은 점점 따뜻해지고, 입구는 아직 묶여 있습니다. {n}은…',
  o:[
   {l:'비닐 벽 너머 넓은 물 쪽으로 계속 몸을 부딪친다',ok:()=>{
     if(isSp('@puffer'))return {t:'{n}이 물을 삼켜 몸을 부풀렸다가 천천히 돌아왔습니다. 그 모습을 본 주인이 봉지를 열었습니다.',c:'good',fx:{h:-3}};
     return trd_r('c',50)?{t:'봉지 속 {n}의 움직임이 주인 눈에 띄었습니다. 주인이 서둘러 봉지를 열었습니다.',c:'good',fx:{c:2,h:-3}}:Object.assign(trd29(-10),{fx:{h:-6}})}},
   {l:'봉지 위쪽 공기층 아래에 머문다',chk:()=>['g',isSp('@labyrinth')?25:45],ok:{t:'{n}은 공기층 아래에서 버텼습니다. 주인은 한 시간 뒤에 돌아와 봉지를 열었습니다.',c:'good',fx:{g:2}},no:()=>trd29(0)},
   {l:'봉지 바닥에서 움직이지 않는다',ok:()=>trd29(5)}
  ]}]);

/* EV-TRD-31 이사 날 — overlaps the engine's moving and left-behind events (w .5)
   [출처: 수조 이사 시 여과재 보존(질화세균 생존), 대형어 운반 용기 권장] */
function trd31(b){
  const s=season();b=(b||0)+(s==='summer'||s==='winter'?-10:0)+(isSp('pleco')?20:0);
  if(!trd_r('g',35,b))return {end:'TRD-31-D'};
  const big=isSp('gar','koi')?' 대야가 몸보다 작아 등이 반쯤 물 밖으로 나왔습니다. 등 피부의 점막이 말랐습니다.':'';
  return {t:'트럭은 새 집에 도착했습니다.'+big+(isKind('expert')?' 주인은 여과재를 물에 담가 따로 옮겨 왔습니다.':' 짐 사이에서 여과재는 말라 있었습니다.'),c:big?'bad':'sub',fx:{h:big?-12:-5,st:.1},
    run:()=>{if(!isKind('expert')){S.f.cycled=0;S.f.wq-=10}}};
}
fev([{id:'TRD-31',stage:'home',tier:'fact',once:1,w:.5,
  p:'수조의 물이 호스로 빠져나갑니다. 바닥이 가까워지고, 그물이 들어옵니다. {n}은 뚜껑 없는 대야로 옮겨집니다. 대야는 상자들 사이에 놓이고, 사람들이 무거운 것을 들고 그 위를 지나갑니다. {n}은…',
  o:[
   {l:'대야 가장자리를 따라 빠르게 돈다',ok:()=>{const r=trd31(-10);r.fx=Object.assign({},r.fx,{st:.15});return r}},
   {l:'대야 바닥 가운데에서 몸을 낮춘다',ok:()=>trd31(0)},
   {l:'수면 쪽에서 위를 올려다본다',when:()=>isSp('@jumper','@escaper'),chk:['w',50],ok:()=>{const r=trd31(5);r.t='{n}은 끝까지 뛰지 않았습니다. '+(r.t||'');return r},
    no:()=>{
      if(isSp('channa','bichir'))return trd_r('g',70)?{t:'새 집에서 짐을 풀던 주인이 "주방" 상자를 열었습니다. 냄비 사이에서 먼지를 뒤집어쓴 {n}이 아가미를 움직이고 있었습니다. 주인은 그날 저녁 뚜껑 있는 수조를 주문했습니다. 이사 업체 견적서에는 "생물 운송 불가"라고 적혀 있었습니다.',c:'good',fx:{h:-15},set:{lid:1},mem:'상자 속 어둠. 냄비 사이에서 버텼다.'}:{end:'TRD-31-D'};
      return R()<.5?{t:'{n}이 대야 밖으로 튀어 장판 위에 떨어졌습니다. 이삿짐센터 직원이 맨손으로 {n}을 집어 대야에 던져 넣었습니다.',c:'bad',fx:{h:-15},near:'lid'}:{end:'TRD-31-D'}}},
   {l:'수면 쪽에서 위를 올려다본다',when:()=>!isSp('@jumper','@escaper'),ok:()=>trd31(0)}
  ]}]);

/* EV-TRD-32 당근 나눔 — 생수병 운송 — [출처: 없음 — 메커니즘만. 당근 나눔 운송 방식은 실제 거래글 예시로 확인] */
function trd32go(dmg){
  if(isSp('@puffer'))return trd04gulp();
  if(isSp('pleco','oscar','gar','koi')&&!trd_r('g',45,-20))return {end:'TRD-32-D'};
  if(dmg&&isSp('@longfin')&&R()<.4)return {end:'TRD-32-D'};
  return {t:dmg?'병 입구에 걸린 지느러미가 찢어졌습니다. 거래 후기에는 "친절하세요, 물고기 상태 좋아요"라고 적혔습니다.':'{n}은 무사히 병을 통과했습니다. 거래 후기에는 "친절하세요, 물고기 상태 좋아요"라고 적혔습니다. 병뚜껑은 거래하는 동안 닫혀 있었습니다.',
    c:dmg?'bad':'sub',fx:{fin:dmg?.2:0,h:dmg?-8:-3},run:()=>{if(dmg&&isSp('@longfin'))trd_carry('finrot');fRehome('주인은 중고거래 앱에 "물고기 나눔" 글을 올렸습니다. {n}은 생수병에 담겨 지하철을 탔습니다.',{note:'생수병에 담아 나눔'})}};
}
fev([{id:'TRD-32',stage:'home',tier:'likely',own:['relay'],w:3,cd:30,
  p:()=>isSp('pleco','oscar','gar','koi')?'페트병 입구는 {n}의 몸에 맞지 않습니다. 주인이 김장 비닐을 꺼내 와 입구를 벌립니다. 손이 수조를 기울이고, 물과 함께 {n}이 비닐 쪽으로 쏠립니다. {n}은…'
    :'페트병 입구가 수면 쪽으로 다가옵니다. 입구는 {n}의 몸보다 조금 넓습니다. 손이 병을 기울이고, 물과 함께 {n}이 좁은 입구 쪽으로 쏠립니다. {n}은…',
  o:[
   {l:'입구 반대쪽으로 헤엄쳐 버틴다',chk:['p',30],ok:{t:'{n}이 버티자 주인이 손을 넣어 {n}을 움켜쥐고 넣었습니다. 손이 닿은 자리의 점막이 벗겨졌습니다.',c:'bad',fx:{h:-8,p:2},run:()=>q(null,null,()=>fevOut(trd32go(0)))},no:()=>trd32go(1)},
   {l:'몸을 길게 펴서 입구로 들어간다',chk:['w',35],ok:()=>trd32go(0),no:()=>trd32go(1)},
   {l:'물살에 그대로 맡긴다',ok:()=>isSp('@longfin')?trd32go(R()<.5?1:0):trd32go(trd_r('g',30)?0:1)}
  ]}]);

/* EV-TRD-33 리본 단 어항 — [출처: 없음 — 메커니즘만(밀폐 소형 용기 산소 고갈)] */
function trd33(b){
  const h=Math.floor(R()*3)*5;
  b=(b||0)+(isSp('comet','guppy')?-10:0)+(isSp('@labyrinth')?15:0);
  if(!trd_r('g',40+h,b))return {end:'TRD-33-D'};
  return {t:'{n}은 리본을 단 채 새 집에 도착했습니다. 받은 사람은 "어떻게 키우는 거야?"라고 물었고, 준 사람은 "물만 갈아 주면 돼"라고 답했습니다.',c:'sub',fx:{h:-8}};
}
fev([{id:'TRD-33',stage:'home',tier:'likely',once:1,own:['gift'],w:()=>isSp('betta','comet','oranda','guppy')?3:.3,when:()=>trd_fresh(),
  p:'어항 위가 반짝이는 비닐로 덮입니다. 위에서 리본이 조여집니다. 비닐 안쪽에 물방울이 맺힙니다. 어항은 쇼핑백 안에 들어가고, 쇼핑백은 식당 의자 밑에 놓입니다. 위에서 사람들이 웃습니다. {n}은…',
  o:[
   {l:'수면에 입을 대고 비닐 아래 공기를 마신다',ok:()=>isSp('@labyrinth')&&trd_r('g',40)?{t:'{n}은 비닐 아래의 얇은 공기를 마시며 모임이 끝날 때까지 버텼습니다.',c:'good',fx:{g:2}}:trd33(-5)},
   {l:'어항 벽을 따라 바깥 빛을 찾는다',chk:['c',55],ok:{t:'누군가 쇼핑백을 들여다보고 "숨 막히겠다"며 비닐을 풀었습니다.',c:'good',fx:{c:2}},no:()=>trd33(-10)},
   {l:'바닥에 내려가 움직임을 줄인다',ok:()=>trd33(0)}
  ]}]);

/* EV-TRD-34 수조째 넘겨받기 — [출처: 물 채운 수조 운반 금지(이음새 파손) 권장] */
function trd34(){
  const pb=.12*(isSp('oscar','arowana','koi','gar')?2:1)*(isKind('relay','breakup')?1.5:1);
  if(R()<pb)return {end:'TRD-34-D'};
  return {t:'수조는 새 집에 도착했습니다. 물은 절반이 계단에 남았습니다.',c:'sub',run:()=>{
    fRehome('수조째 넘겨받은 사람은 비어 있는 절반을 수돗물로 채웠습니다.',{note:'수조째 넘김'});
    q(null,null,()=>{if(!isKind('expert','learner','staff')){addLog(T('수돗물의 염소가 아가미를 따끔거리게 했습니다.'),'bad');S.health-=8}})}};
}
fev([{id:'TRD-34',stage:'home',tier:'likely',once:1,own:['relay','breakup','grandma','shared'],w:2,
  p:'수조가 통째로 들립니다. 물이 한쪽으로 쏠리고, 바닥 자갈이 미끄러집니다. 계단을 한 칸 내려갈 때마다 물이 유리벽을 치고 넘칩니다. 어디선가 낮게 \'딱\' 하는 소리가 납니다. {n}은…',
  o:[
   {l:'물이 쏠리는 반대쪽으로 헤엄쳐 버틴다',chk:['g',45],ok:{t:'{n}은 쏠리는 물을 거슬러 버텼습니다.',c:'good',fx:{g:2},run:()=>q(null,null,()=>fevOut(trd34()))},
    no:{t:'물살에 밀린 {n}이 유리벽에 부딪혔습니다.',c:'bad',fx:{h:-8},run:()=>q(null,null,()=>fevOut(trd34()))}},
   {l:'수초·장식 틈으로 들어간다',chk:['w',40],ok:{t:'{n}은 장식 틈에 몸을 끼우고 버텼습니다.',c:'good',fx:{w:2},run:()=>q(null,null,()=>fevOut(trd34()))},
    no:()=>trd_r('p',35)?{t:'쏠린 장식이 틈을 좁혔습니다. {n}은 몸을 비틀어 빠져나왔습니다.',c:'bad',fx:{h:-6},run:()=>q(null,null,()=>fevOut(trd34()))}
      :{t:'쏠린 장식에 {n}의 몸이 끼었습니다. 옆구리 비늘이 벗겨졌습니다.',c:'bad',fx:{h:-18},run:()=>q(null,null,()=>fevOut(trd34()))}},
   {l:'바닥 가까이 몸을 낮춘다',ok:()=>({t:isSp('cory','pleco','clownloach')?'미끄러지는 자갈에 {n}의 배가 쓸렸습니다.':'{n}은 바닥에 몸을 붙였습니다. 자갈이 옆구리를 스쳤습니다.',c:'sub',fx:{h:-4,g:1},set:{inj_barbel:isSp('cory')?1:0},run:()=>q(null,null,()=>fevOut(trd34()))})}
  ]}]);

/* EV-TRD-35 가게에 돌려주러 간 날 — a winter river kills a tropical fish without a check (rule 7)
   [출처: 국내 대형 관상어(앨리게이터 가아·플레코 등) 하천 유기 사례, 겨울 하천 수온] */
function trd35refuse(){
  if(isSp('@tropical')&&season()==='winter'&&R()<.6)return {t:'가게는 {n}을 받지 않았습니다. 집에 가는 길, 주인이 다리 위에서 멈췄습니다.',c:'bad',end:'TRD-35-D'};
  if(isSp('motoro')&&isKind('content'))return {t:'가게는 {n}을 받지 않았습니다. 주인은 "분양합니다" 영상을 올렸습니다.',c:'bad',run:()=>fRehome('영상을 본 사람이 {n}을 데려갔습니다.',{note:'감당 못 해 분양'})};
  if(R()<.5)return {t:'가게는 {n}을 받지 않았습니다. 주인은 "강에 놓아주자"고 말했습니다.',c:'bad',run:()=>q(null,null,()=>fRelease())};
  return {t:'가게는 {n}을 받지 않았습니다. 주인은 {n}을 다시 집으로 데려왔습니다. 수조는 그대로였습니다.',c:'bad',fx:{st:.1,h:-5}};
}
fev([{id:'TRD-35',stage:'home',tier:'fact',once:1,w:2,own:['casual','eager','gift','relay','content'],sp:['@big','comet','bichir'],
  when:()=>tankL()<fx_().minL||S.interest<.3,
  p:'다시 큰 봉지에 담깁니다. 이번에는 봉지가 몸보다 작습니다. 꼬리가 접힌 채 묶입니다. 처음 왔던 가게의 냄새가 납니다. 사람 둘이 봉지를 사이에 두고 오래 이야기합니다. {n}은…',
  o:[
   {l:'봉지 안에서 몸을 펴려고 힘을 준다',ok:()=>{const r=trd35refuse();r.fx=Object.assign({fin:.1,h:-8},r.fx);return r}},
   {l:'가게 직원이 들여다볼 때 비닐 쪽으로 다가간다',chk:['c',60],
    ok:{t:'가게 사장은 {n}을 받아 주었습니다. "대신 돈은 못 드려요." 주인은 오히려 고맙다고 말했습니다. {n}은 진열 수조로 돌아갔고, 가격표에는 "대형 개체 · 협의"라고 적혔습니다.',c:'sub',fx:{c:2},
      run:()=>fRehome('몇 주 뒤, 다른 사람이 "대형 개체 · 협의" 가격표를 보고 {n}을 사 갔습니다.',{note:'가게에 되돌려 줌'})},
    no:()=>trd35refuse()},
   {l:'접힌 채로 가만히 있는다',ok:()=>{const r=trd35refuse();if(!trd_r('g',50))r.fx=Object.assign({h:-10},r.fx);return r}}
  ]}]);

/* EV-TRD-36 품평회 가는 길 — 비단잉어 — [출처: 코이 헤르페스바이러스(KHV) 증상·발병 수온, 품평회·딜러 거래를 통한 전파] */
function trd36inf(b){
  if(trd_r('g',50,b))return {t:'{n}은 품평회 물에서 아무것도 묻혀 오지 않았습니다.',c:'good',near:'qt'};
  if(isSp('koi'))return R()<.4?{end:'TRD-36-D'}:{t:'품평회에서 돌아온 지 열흘 뒤, {n}의 아가미 색이 얼룩덜룩해졌습니다.',c:'bad',sick:'khv',near:'qt'};
  return {t:'품평회에서 돌아온 뒤 {n}의 아가미가 부어올랐습니다.'+(isSp('oranda','ryukin')?' 비닐 통으로 옮겨질 때 쓸린 지느러미도 낫지 않았습니다.':''),c:'bad',sick:'cyhv2',fx:{fin:isSp('oranda','ryukin')?.1:0},near:'qt'};
}
fev([{id:'TRD-36',stage:'home',tier:'fact',cd:60,own:['expert','breeder','decor','grandma'],sp:['koi','@gold'],need:{season:['spring','autumn']},
  w:()=>isSp('koi')?2:.5,
  p:'파란 임시 수조에 여러 연못의 물고기들이 모입니다. 낯선 냄새가 섞인 물이 계속 순환합니다. 사람들이 위에서 그물을 넣어 몸을 들어 올리고, 비닐 통에 담아 무늬를 들여다봅니다. {n}은…',
  o:[
   {l:'사람 쪽으로 떠올라 몸을 보여 준다',chk:()=>['c',isSp('koi')?70:60],
    ok:()=>fst().c>=capOf('c')*.9?{t:'{n}은 그물에 들리자마자 사람 쪽으로 주둥이를 내밀었습니다. 심사위원은 "사람을 무서워하지 않는다"고 적었습니다. {n}은 상을 받고, 그날 바로 비싼 값에 팔렸습니다. 함께 출품된 같은 연못의 친구들은 무늬 점수 미달로 그 자리에서 헐값에 넘겨졌습니다.',c:'good',fx:{c:2},
        run:()=>fRehome('{n}을 산 사람은 품평회장에서 바로 {n}을 실어 갔습니다.',{own:R()<.6?'expert':'casual',tank:'pond',note:'품평회에서 팔림'})}
      :{t:'{n}은 상을 받았습니다. 주인은 트로피를 거실 장식장에 올려 두었습니다.',c:'good',fx:{c:2,i:.08},run:()=>q(null,null,()=>fevOut(trd36inf(15)))},
    no:()=>trd36inf(0)},
   {l:'다른 연못 물고기들 사이로 섞여 든다',ok:()=>trd36inf(-15)},
   {l:'임시 수조 구석 바닥에 머문다',ok:()=>trd36inf(0)}
  ]}]);

/* EV-TRD-37 무리에서 한 마리만 — [출처: 네온테트라·클라운로치·코리도라스 무리 사육 권장 수(최소 6마리 내외)] */
function trd37(){
  addFl('lonely');
  if(isSp('cory'))setFl('thin',1);
  if(fl('lonely')>=2&&R()<.35)return {end:'TRD-37-D'};
  if(fl('lonely')>=2&&!S.f.ill)return {t:'{n}의 몸 색이 흐려졌습니다.',c:'bad',fx:{st:.1},sick:isSp('neon')&&R()<.3?'neond':'ich'};
  return {t:isSp('clownloach')?'{n}은 수초 뒤에서 나오지 않았습니다. 주인은 {n}을 며칠째 보지 못했습니다.':'{n}의 몸 색이 조금 바랬습니다. 먹이에 다가오는 것도 늦어졌습니다.',c:'sub',fx:{st:.08,h:-4}};
}
fev([{id:'TRD-37',stage:'home',tier:'fact',sp:['neon','clownloach','cory','altum'],own:['casual','gift','eager','decor','shared'],cd:30,w:2,
  when:()=>fSameCount()<=1&&!fl('school'),
  p:'그물이 무리 한가운데에서 {n} 하나만 떠 올렸습니다. 새 수조에는 같은 모양의 몸이 하나도 없습니다. 다른 종 물고기가 지나갈 때마다 몸이 움찔합니다. {n}은…',
  o:[
   {l:'다른 종 물고기 무리 뒤를 따라다닌다',chk:['c',50],ok:{t:'{n}은 다른 종 물고기들 뒤에 붙어 다녔습니다. 쫓아내는 물고기는 없었습니다.',c:'good',fx:{st:-.1,c:2}},
    no:()=>fl('bully')?{t:'앞서 가던 물고기가 돌아서서 {n}의 지느러미를 물었습니다.',c:'bad',fx:{fin:.08,st:.1}}:{t:'다른 종 물고기들은 {n}을 기다려 주지 않았습니다.',c:'sub',fx:{st:.08}}},
   {l:'수초 가장 깊은 곳에 몸을 숨긴다',chk:['g',40],ok:{t:'{n}은 수초 속에서 지냈습니다.',c:'sub',fx:{st:.03,g:2}},no:()=>trd37()},
   {l:'유리에 비친 자기 모습 옆에 머문다',ok:()=>{addFl('mirror');
     if(fl('mirror')>=2)return {t:'{n}은 매일 유리에 비친 자기 모습 옆을 헤엄쳤습니다. 주인은 "쟤는 혼자서도 잘 놀아"라고 말했습니다. 조명이 꺼지면 유리에는 아무것도 비치지 않았습니다.',c:'sub',fx:{g:1},run:()=>trd_learn('school',['eager','casual'],.12,'주인은 같은 물고기를 다섯 마리 더 사 왔습니다.')};
     const r=trd37();r.fx=Object.assign({g:1},r.fx);return r}}
  ]}]);

/* ======================= ENDINGS ======================= */
fevEnd({
 'TRD-02-D':{kind:'bad',cat:'운송',tier:'fact',fx:'f-bag',fact:'fChain',
   l:()=>['{n}은 봉지 모서리의 좁은 틈으로 머리부터 들어갑니다. 상자가 기울며 물이 반대쪽으로 빠집니다.',
     isSp('cory')?'틈은 납작하게 닫히고, 가슴 가시가 비닐에 걸려 몸이 빠지지 않습니다.':'틈은 납작하게 닫히고 {n}의 몸통이 비닐 두 겹 사이에 눌립니다.',
     '아가미 뚜껑이 비닐에 막혀 열리지 않습니다.','{n}은 꼬리를 쳐서 뒤로 빠져나오려 하고, 그럴수록 몸은 틈 안쪽으로 더 밀려 들어갑니다.','꼬리지느러미가 몇 번 더 떨리고 멈춥니다.']},
 'TRD-03-D':{kind:'bad',cat:'운송',tier:'fact',fx:'f-box',fact:'fChain',
   l:['봉지의 물이 가시 구멍으로 밤새 빠져나갑니다. 수위가 몸높이 아래로 내려가자 {n}은 옆으로 눕습니다.','바닥에 닿은 쪽 아가미 새엽이 공기에 드러나 마르기 시작합니다. 새엽끼리 들러붙으면서 물이 남아 있는 쪽 아가미만 움직입니다.','{n}은 몸을 뒤집어 반대쪽으로 숨을 쉬려 합니다. 뒤집을 때마다 남은 물이 구멍 쪽으로 쏠려 더 빠집니다.','상자가 열렸을 때 {n}의 위쪽 피부는 점막이 말라 종이처럼 굳어 있습니다.']},
 'TRD-04-D':{kind:'bad',cat:'공기 팽창',tier:'fact',fx:'f-float',pl:[[3,'복어를 뜰채로 물 밖에 들어 올림']],
   l:['{n}은 물 밖에서 공기를 삼켜 위를 팽창시킵니다. 물에 다시 넣어졌을 때 {n}의 몸은 둥글게 부푼 채 수면으로 떠오릅니다.','배가 위로 뒤집히고, 공기에 드러난 배 피부가 마르기 시작합니다.','{n}은 가슴지느러미를 빠르게 저어 아래로 내려가려 합니다. 부력 때문에 몸은 계속 수면에 붙어 있습니다.','몇 시간 동안 같은 자리에서 지느러미가 움직입니다. 다음 날 아침 {n}은 부푼 모양 그대로 수면에 떠 있습니다.']},
 'TRD-05-D':{kind:'bad',cat:'운송',tier:'fact',fx:'f-bag',fact:'fChain',
   l:()=>isSp('cory')?['겁먹은 {n}의 피부에서 점액이 계속 나옵니다. 좁은 봉지 안에서 물이 희뿌옇게 변합니다.','같은 봉지의 네온테트라들이 먼저 수면 쪽에서 입을 벌리고, 하나씩 옆으로 기웁니다.','{n}은 수면으로 올라가 공기를 삼키고 다시 내려옵니다. 내려올 때마다 바닥에 깔린 다른 물고기의 몸에 부딪힙니다.','아가미 뚜껑의 움직임이 점점 커지고 느려집니다. 봉지가 열렸을 때 살아 있는 것은 없습니다.']
     :['겁먹은 코리도라스들의 피부에서 점액이 계속 나옵니다. 좁은 봉지 안에서 물이 희뿌옇게 변합니다.','{n}의 아가미 새엽에 그 물이 닿자 상피가 붓고 점액이 엉깁니다.','{n}은 수면 쪽으로 올라가 입을 벌리고, 힘이 빠져 다시 내려옵니다. 내려올 때마다 바닥에 깔린 다른 몸에 부딪힙니다.','{n}은 옆으로 기웁니다. 봉지가 열렸을 때 살아 있는 것은 없습니다.']},
 'TRD-06-D':{kind:'bad',cat:'운송',tier:'likely',fx:'f-box',fact:'fChain',
   l:['약이 아가미를 통해 혈액으로 들어갑니다. {n}의 움직임이 느려지고 몸이 봉지 바닥으로 가라앉습니다.','몸의 크기에 비해 약의 양이 많습니다. 숨골이 둔해지면서 아가미 뚜껑의 움직임이 얕아지고 간격이 벌어집니다.','{n}은 꼬리를 한 번 저어 몸을 세우려 합니다. 몸은 옆으로 다시 눕습니다.','아가미 뚜껑이 반쯤 열린 자리에서 멈춥니다.']},
 'TRD-07-S':{kind:'bad',cat:'항공 운송',tier:'fact',fx:'f-box',fact:'fChain',
   l:['상자 안 온도가 오르면서 봉지 속 물이 산소를 덜 붙잡습니다. 체온이 오른 {n}의 몸은 산소를 더 씁니다.','{n}은 공기층 바로 아래에서 입을 벌리고 아가미 뚜껑을 크게 벌립니다. 아가미 새엽의 모세혈관이 확장되어 짙은 붉은색이 됩니다.','산소가 모자라자 {n}은 봉지 벽을 따라 빠르게 돌고, 그만큼 산소를 더 씁니다.','균형을 잃고 옆으로 떠오릅니다. 입과 아가미 뚜껑이 벌어진 채 굳습니다.']},
 'TRD-07-W':{kind:'bad',cat:'항공 운송',tier:'fact',fx:'f-ice',fact:'fChain',
   l:['화물칸의 냉기에 봉지 속 물이 식어 갑니다. {n}의 근육 수축이 느려지고 지느러미 움직임이 둔해집니다.','심장 박동이 느려지며 아가미로 가는 혈류가 줄어듭니다.','{n}은 봉지 바닥에서 몸을 세우려 가슴지느러미를 젓습니다. 몸은 천천히 옆으로 기웁니다.','도착했을 때 {n}의 몸은 하얀 점막이 덮인 채 굳어 있습니다.']},
 'TRD-08-B':{kind:'bad',cat:'검역 표본',tier:'fact',fx:'f-bucket',
   l:['검사관이 {n}을 봉지에서 꺼내 통에 옮깁니다.','검사를 위해 아가미와 내장 조직을 떼어 냅니다. 이 과정은 수의 절차에 따라 마취 후 이루어집니다.','{n}의 아가미 뚜껑은 마취액 속에서 점점 느려지다 멈춥니다.','같은 상자의 다른 개체들은 그날 오후 통관됩니다.']},
 'TRD-08-C':{kind:'bad',cat:'검역 처분',tier:'fact',fx:'f-box',
   l:['같은 상자에서 나온 표본에서 질병이 확인됩니다.','상자 전체가 반송 또는 폐기 대상으로 분류됩니다.','{n}은 봉지째로 다른 상자들과 함께 처분 절차에 들어갑니다.','{n}의 몸에는 아무 증상도 없습니다.']},
 'TRD-09-D':{kind:'bad',cat:'개봉',tier:'fact',fx:'f-bag',fact:'fChain',
   l:['봉지 안의 이산화탄소가 빠져나가면서 pH가 오릅니다. 봉지 속에 쌓여 있던 암모니아가 독성 형태로 바뀝니다.','암모니아가 아가미 새엽의 상피를 자극해 새엽이 붓고 점액이 엉깁니다.','{n}은 수면으로 올라가 입을 벌립니다. 아가미 뚜껑이 짧고 빠르게 움직입니다. 몸이 갑자기 경련하며 봉지 벽에 부딪힙니다.','직원이 뜰채를 가져왔을 때 {n}은 봉지 바닥에서 옆으로 누워 있습니다.']},
 'TRD-10-D':{kind:'bad',cat:'도착 사망',tier:'fact',fx:'f-bucket',fact:'fChain',
   l:['{n}은 다른 사체들과 함께 양동이에 담깁니다. 양동이 물은 얕고 산소가 없습니다.','{n}은 위에 쌓인 몸들 사이에서 아가미를 움직입니다. 사체들이 분해되며 물이 탁해집니다.','{n}은 몸을 비틀어 위로 올라가려 하고, 그럴 때마다 다른 사체에 눌립니다.','저녁에 양동이는 한꺼번에 비워집니다. 그 수는 보상 청구서에 "도착 사망"으로 적힙니다.']},
 'TRD-11-D':{kind:'bad',cat:'약욕',tier:'fact',fx:'f-poison',fact:'fMed',
   l:()=>['약이 피부와 아가미 상피에 흡수됩니다.',isSp('@scaleless')?'비늘이 없는 {n}의 피부는 약을 막을 층이 얇습니다. 점막이 하얗게 일어나 물에 하늘거립니다.':'약에 약한 {n}의 피부 점막이 하얗게 일어나 물에 하늘거립니다.','아가미 새엽의 상피가 부풀어 오르며 숨 쉬는 면적이 줄어듭니다.','{n}은 수면으로 올라가 입을 벌리고, 다시 바닥으로 내려가 몸을 바닥에 비빕니다. 비빌 때마다 벗겨진 피부 조각이 떨어져 나갑니다.','다음 날 아침 수조에는 다른 종들만 헤엄치고 있습니다.']},
 'TRD-12-I':{kind:'bad',cat:'판매 수조 질병',tier:'fact',fx:'f-shop',fact:'fIch',
   l:['섬모충이 {n}의 피부와 아가미 상피 아래로 파고듭니다. 하루 만에 하얀 점이 온몸에 퍼집니다.','아가미 새엽마다 충체가 박혀 상피가 두꺼워집니다.','{n}은 바닥 모래와 돌에 몸을 문지릅니다. 문지른 자리마다 점막이 벗겨져 붉은 살이 드러납니다.','숨이 가빠지자 {n}은 옆으로 누운 채 아가미 뚜껑만 빠르게 움직입니다. 그 자세는 평소 자는 자세와 같아서, 직원은 이틀 동안 알아채지 못합니다.']},
 'TRD-12-N':{kind:'bad',cat:'판매 수조 질병',tier:'fact',fx:'f-bent',fact:'fNeon',
   l:['포자충이 근육 안에서 자랍니다. 등 쪽의 푸른 띠 아래로 근육이 하얗게 변해 갑니다.','척추가 휘기 시작하고 {n}은 무리에서 뒤처집니다.','{n}은 무리를 따라가려고 꼬리를 젓습니다. 휜 몸 때문에 앞으로 가지 않고 비스듬히 돕니다.','다른 네온들이 그 몸을 쪼기 시작합니다.']},
 'TRD-13-D':{kind:'bad',cat:'판매 수조 질병',tier:'fact',fx:'f-shop',fact:'fWater',
   l:['세균이 등지느러미 아래 피부에 자리 잡습니다. 그 자리가 하얗게 변하며 안장 모양으로 번집니다.','피부와 그 아래 근육이 녹아 비늘이 떨어져 나갑니다. 세균은 아가미로 옮겨 가 새엽 끝을 누렇게 썩게 합니다.','{n}은 수면 가까이에서 입을 벌리고 지느러미를 접습니다. 몸을 뒤척일 때마다 녹은 근육 조각이 물에 떨어집니다.','그날 저녁 직원은 {n}의 수조에 "판매 중지" 종이를 붙입니다.']},
 'TRD-14-D':{kind:'bad',cat:'뜰채',tier:'fact',fx:'f-shop',
   l:['{n}의 가시가 그물코 사이로 빠져나간 뒤 젖혀집니다. 가시 끝의 돌기가 그물실에 걸려 빠지지 않습니다.','직원이 그물을 털어도 {n}은 매달린 채 공기 중에서 몸을 비틉니다.','직원이 손가락으로 몸을 잡아당깁니다. 가시가 붙은 기저부의 근육과 피부가 함께 찢어지고, 가시는 그물에 남습니다.','{n}은 물에 떨어진 뒤 한쪽 가슴지느러미 없이 바닥으로 기웁니다. 찢긴 자리에서 솜 같은 곰팡이가 이틀 만에 피어납니다.']},
 'TRD-15-D':{kind:'bad',cat:'점프사',tier:'fact',fx:'f-floor',fact:'fJumpF',
   l:['{n}은 틈 사이로 몸을 밀어 올리고 수조 밖으로 떨어집니다.','진열대 높이에서 타일 바닥에 옆구리부터 닿습니다. 충격으로 부레가 터지고 늑골 몇 개가 부러집니다.','{n}은 바닥에서 몸을 튕겨 물 쪽으로 가려 합니다. 튕길 때마다 비늘이 타일에 쓸려 떨어지고, 아래쪽 아가미 새엽이 바닥 먼지에 덮입니다.','아침에 출근한 직원이 빗자루로 {n}을 쓸어 담습니다.']},
 'TRD-16-D':{kind:'bad',cat:'먹이',tier:'fact',fx:'f-eaten',fact:'fLive',pred:'oscar',
   l:()=>['그물이 무리 가운데를 퍼 올립니다. {n}은 다른 '+(isSp('guppy','platy')?'구피':'금붕어')+' 스무 마리와 함께 봉지에 담깁니다.','봉지는 손님의 오스카 수조 위에서 거꾸로 뒤집힙니다. {n}은 다른 몸들 사이로 파고들며 바닥으로 내려갑니다.','오스카가 무리 한가운데로 돌진하고, 턱이 {n}의 머리 쪽을 덮습니다. 아래턱 이빨이 아가미 뚜껑을 뚫고 들어가 새궁을 부숩니다.','{n}의 꼬리는 오스카의 입 밖에서 몇 번 더 움직입니다.']},
 'TRD-17-D':{kind:'bad',cat:'마트 수조',tier:'likely',fx:'f-shop',fact:'fUnsold',
   l:['남은 사료와 사체가 바닥에서 분해됩니다. 물의 암모니아가 밤사이 올라갑니다.','{n}의 아가미 새엽이 붉게 부어오르고 서로 들러붙습니다.','{n}은 수면으로 올라가 입을 벌리다가, 갑자기 수조를 가로질러 돌진하고 유리에 부딪힙니다. 경련이 잦아들면서 {n}은 바닥으로 가라앉습니다.','아침 청소 시간에 직원은 뜰채로 {n}과 어제의 사체를 같이 건집니다. 수조 앞 가격표는 그대로 붙어 있습니다.']},
 'TRD-18-D':{kind:'bad',cat:'미판매',tier:'fact',fx:'f-bent',fact:'fOutgrow',
   l:()=>['{n}의 몸은 자라는데 수조는 그대로입니다. 등뼈가 휘어지고 아가미 뚜껑이 짧게 말려 들어갑니다.','몸을 돌릴 공간이 없어 {n}은 같은 자리에서 반쯤 접힌 채 지냅니다.',isSp('oscar')?'좁은 물에 배설물이 쌓여 질산염이 오릅니다. 머리 표면의 감각공 주변이 패이기 시작합니다.':'좁은 물에 배설물이 쌓여 질산염이 오릅니다. 지느러미 끝이 녹아 들어갑니다.','{n}은 손님이 지나갈 때마다 유리로 다가가고, 그때마다 꼬리가 반대편 유리에 부딪힙니다.','어느 날 아침 {n}은 접힌 자세 그대로 바닥에 누워 있습니다.']},
 'TRD-19-D':{kind:'bad',cat:'컵 진열',tier:'fact',fx:'f-shop',fact:'fBetta',
   l:()=>['컵 속 물에 녹은 사료와 배설물이 쌓여 암모니아가 오릅니다. {n}은 수면에서 공기를 마시며 버팁니다.','그동안 지느러미 가장자리의 상피가 세균에 녹아 검게 변하고 실처럼 풀립니다.',season()==='winter'?'겨울 진열대에서 물이 식자 {n}의 움직임이 느려집니다.':'{n}의 움직임이 점점 느려집니다.','{n}은 수면으로 올라가 공기를 마시려 하고, 무거워진 지느러미가 몸을 아래로 끌어당깁니다. 컵 바닥에 닿은 {n}은 다시 올라가려 몸을 비틉니다.','다음 날 직원은 컵째 뚜껑을 닫아 바구니에 넣습니다.']},
 'TRD-20-D':{kind:'bad',cat:'뜰채 체험',tier:'fact',fx:'f-stall',fact:'fFair',
   l:['종이 뜰채가 {n}의 등을 스치고 찢어집니다. 다음 뜰채의 테두리가 {n}의 머리를 누릅니다.','하루 동안 수십 번 반복해서 닿은 자리마다 점막이 벗겨집니다. 오후 햇빛이 얕은 대야 물을 데웁니다.','{n}은 그늘 쪽으로 가려 하지만 다른 몸들이 이미 그 자리를 채우고 있습니다. 벗겨진 피부 위로 곰팡이 균사가 하얗게 자랍니다.','축제가 끝난 밤, 상인은 떠오른 것들을 망으로 걷어 배수구에 털어 냅니다.']},
 'TRD-21-D':{kind:'bad',cat:'봉지',tier:'likely',fx:'f-bag',fact:'fFair',pl:[[2,'산소 없는 봉지로 몇 시간 들고 다님']],
   l:['봉지 안의 물이 햇볕에 데워지고 산소가 줄어듭니다. {n}은 공기층 바로 아래에서 입을 벌립니다.','봉지가 흔들릴 때마다 {n}의 몸이 봉지 벽에 부딪혀 비늘이 몇 장 떨어집니다. 아가미 뚜껑의 움직임이 커지다가 불규칙해집니다.','{n}은 꼬리를 쳐서 몸을 세우려 하지만 다음 흔들림에 다시 뒤집힙니다.','집에 도착해 봉지를 그릇에 쏟았을 때 {n}의 아가미 뚜껑은 벌어진 채 움직이지 않습니다.']},
 'TRD-22-D':{kind:'bad',cat:'택배',tier:'fact',fx:'f-box',fact:'fChain',pl:[[2,'폭염에 생물 택배 주문']],
   l:['상자는 분류 터미널 바닥에서 반나절을 기다립니다. 바깥 기온이 오르며 상자 안 온도도 오릅니다. 녹은 아이스팩의 물이 상자 바닥에 고입니다.','봉지 속 수온이 오르자 {n}은 공기층 바로 아래로 올라가 입을 벌립니다. 아가미 새엽에 피가 몰려 짙은 붉은색이 됩니다.','{n}은 봉지 벽을 따라 돌다가 균형을 잃고 옆으로 기웁니다.','상자는 예정보다 하루 늦게 도착합니다. 송장에는 "생물 — 취급 주의"라고 적혀 있습니다.']},
 'TRD-23-B':{kind:'bad',cat:'택배',tier:'fact',fx:'f-box',fact:'fTemp',pl:[[2,'한겨울에 생물 택배 주문']],
   l:['핫팩이 닿은 쪽 봉지 물이 국소적으로 뜨거워집니다. {n}은 그쪽 벽에 몸을 붙인 채 잠듭니다.','닿은 쪽 피부의 상피와 점막이 익어 하얗게 변합니다.','{n}은 뜨거움에 몸을 비틀어 떨어지지만, 반대쪽 물은 차갑습니다. 다시 따뜻한 쪽으로 돌아갑니다.','도착했을 때 {n}의 몸 한쪽에는 손바닥 모양의 하얀 자국이 있습니다. 그 자리부터 피부가 벗겨지고 사흘 뒤 곰팡이가 덮습니다.']},
 'TRD-23-C':{kind:'bad',cat:'택배',tier:'fact',fx:'f-ice',fact:'fTemp',pl:[[2,'한겨울에 생물 택배 주문']],
   l:['봉지 속 수온이 계속 내려갑니다. {n}의 근육 수축이 느려지고 지느러미가 몸에 붙습니다.','심장 박동이 느려지면서 아가미로 가는 혈류가 줄어듭니다.','{n}은 가슴지느러미만 겨우 움직이며 바닥에서 몸을 세우려 합니다. 몸이 천천히 옆으로 눕습니다.','상자를 연 주인은 {n}이 자는 줄 알고 바로 수조에 넣습니다.']},
 'TRD-24-D':{kind:'bad',cat:'택배',tier:'fact',fx:'f-box',fact:'fChain',pl:[[2,'연휴 직전에 생물 택배 주문']],
   l:['봉지 속 산소가 줄어드는 동안 {n}의 배설물로 암모니아가 쌓입니다. 이산화탄소도 함께 쌓여 물이 산성으로 기웁니다.','{n}의 아가미 새엽은 점액으로 덮여 하얗게 엉겨 붙습니다.','{n}은 공기층 아래로 올라가 입을 벌렸다가, 힘이 빠져 다시 가라앉습니다. 같은 봉지의 다른 몸이 먼저 떠오르고, 그 몸이 분해되며 물이 뿌옇게 됩니다.','{n}의 아가미 뚜껑이 느려지고, 멈춥니다. 연휴가 끝난 날 아침 상자는 정상 배송 완료로 처리됩니다.']},
 'TRD-25-D':{kind:'bad',cat:'택배',tier:'likely',fx:'f-box',pl:[[2,'택배 상자를 문 앞에 방치']],
   l:()=>season()==='winter'?['복도 바람이 스티로폼 상자 틈으로 들어옵니다. 봉지 속 수온이 천천히 내려갑니다.','{n}의 근육 수축이 느려지고 지느러미가 몸에 붙습니다.','{n}은 바닥에서 몸을 세우려 가슴지느러미를 젓습니다. 몸이 천천히 옆으로 기웁니다.','주인이 퇴근해 상자를 들고 들어옵니다. "받으면 바로 열어 주세요"라는 스티커가 상자 옆면에 붙어 있습니다.']
     :['햇볕을 받은 스티로폼 상자 안의 공기가 데워집니다. 봉지 속 수온이 천천히 오릅니다.','{n}은 공기층 바로 아래로 올라가 입을 벌립니다. 체온이 오르면서 몸은 산소를 더 쓰고, 물에 녹아 있는 산소는 줄어듭니다.','{n}은 봉지 벽을 따라 돌다 균형을 잃습니다.','주인이 퇴근해 상자를 들고 들어옵니다. "받으면 바로 열어 주세요"라는 스티커가 상자 옆면에 붙어 있습니다.']},
 'TRD-26-D':{kind:'bad',cat:'언박싱',tier:'likely',fx:'f-hand',fact:'fLive',pl:[[3,'촬영하려고 물 밖에 들어 올림']],
   l:['주인의 손이 {n}을 물 밖으로 들어 올립니다. 카메라가 가까이 다가옵니다.','공기에 닿은 아가미 새엽이 서로 들러붙고, 아가미 뚜껑이 헛돕니다.','{n}은 손바닥 위에서 꼬리를 쳐 몸을 튕깁니다. 손이 미끄러지지 않게 더 세게 쥡니다. 손가락이 닿은 자리의 점막이 벗겨져 손에 묻어납니다.','물에 돌아간 {n}은 바닥에 옆으로 누워 아가미만 움직이다 멈춥니다. 그날 밤 영상의 제목에는 "기절"이라는 단어가 들어갑니다.']},
 'TRD-27-D':{kind:'bad',cat:'귀갓길',tier:'likely',fx:'f-bag',pl:[[2,'몸보다 작은 봉지로 대중교통 귀가']],
   l:()=>isSp('@big')?['봉지 안의 물은 {n}의 몸 부피보다 조금 많을 뿐입니다. {n}의 아가미가 한 번 움직일 때마다 봉지 속 산소가 줄어듭니다.','이산화탄소가 쌓이며 {n}은 아가미 뚜껑을 크게 벌립니다. 몸을 펴려 할 때마다 꼬리와 머리가 동시에 비닐 벽에 눌립니다.','버스가 멈출 때 봉지가 앞으로 쏠리고 {n}의 주둥이가 매듭 쪽 좁은 곳에 끼입니다. {n}은 몸을 비틀어 빠져나오고, 그 사이 아가미 뚜껑의 움직임이 느려집니다.','집에 도착한 주인은 봉지를 열어 수조에 붓습니다. {n}은 수조 바닥으로 그대로 가라앉습니다.']
     :['검은 비닐 속 봉지는 걸음마다 흔들립니다. 산소 없이 묶은 봉지의 공기층이 점점 얇아집니다.','{n}은 공기층 아래에서 아가미 뚜껑을 크게 벌립니다. 흔들릴 때마다 몸이 비닐 벽에 부딪힙니다.','버스가 멈출 때 봉지가 쏠리고, {n}은 매듭 쪽 좁은 곳으로 밀려 들어갑니다.','집에 도착한 주인은 봉지를 열어 수조에 붓습니다. {n}은 수조 바닥으로 그대로 가라앉습니다.']},
 'TRD-28-D':{kind:'bad',cat:'물맞이',tier:'fact',fx:'f-float',fact:'fTemp',pl:[[2,'봉지째 쏟아 넣음']],
   l:['수조 물은 봉지보다 따뜻하고 pH가 높습니다. 봉지 물과 섞인 자리에서 암모니아가 독성 형태로 바뀝니다.','{n}의 아가미 새엽 상피가 자극을 받아 점액이 엉깁니다. 갑작스러운 수온 변화에 {n}은 균형을 잃고 옆으로 기웁니다.','{n}은 꼬리를 쳐서 몸을 세우고 수초 쪽으로 가려 합니다.','이틀 뒤 {n}의 몸에 하얀 점이 돋기 시작합니다. 점은 아가미까지 덮고, {n}은 수면에서 입을 벌리다 가라앉습니다.']},
 'TRD-29-D':{kind:'bad',cat:'물맞이',tier:'fact',fx:'f-bag',fact:'fO2',pl:[[2,'봉지를 띄워 두고 잊음']],
   l:['조명의 열이 봉지 윗면을 데웁니다. 수조 물보다 봉지 물이 먼저 뜨거워집니다. 묶인 입구 때문에 공기층의 산소는 새로 들어오지 않습니다.','{n}은 비닐 너머의 넓은 물을 향해 몸을 계속 부딪칩니다. 부딪힐 때마다 산소를 더 쓰고, 옆구리의 비늘이 비닐에 쓸려 떨어집니다.','아가미 뚜껑이 벌어진 채 느려집니다.','세 시간 뒤 돌아온 주인은 "물맞이 끝"이라며 봉지를 엽니다.']},
 'TRD-30-D':{kind:'bad',cat:'운송',tier:'fact',fx:'f-box',fact:'fMotoro',
   l:['봉지 바닥이 접히면서 {n}의 원반 가장자리가 위로 말려 올라갑니다. 꼬리의 독침이 비닐을 뚫습니다.','물이 상자 바닥으로 천천히 빠져나갑니다. 수위가 낮아지자 등 쪽 숨구멍이 공기에 드러납니다.','{n}은 원반을 물결치며 남은 물 쪽으로 몸을 끌고 가려 합니다. 그 움직임이 독침을 비닐에 더 깊이 걸고 구멍을 넓힙니다. 비늘 없는 등 피부의 점막이 마르며 갈라집니다.','상자를 연 사람이 장갑을 끼고 {n}을 들어 올립니다. {n}의 배 쪽은 혈관이 붉게 비쳐 보입니다.']},
 'TRD-31-D':{kind:'bad',cat:'이사',tier:'fact',fx:'f-floor',pl:[[3,'이사 때 뚜껑 없는 대야에 담아 옮김']],
   l:['대야는 짐칸의 상자와 상자 사이에 끼워집니다. 트럭이 출발하고 대야의 물이 출렁여 반쯤 쏟아집니다.','남은 물은 {n}의 등을 다 덮지 못합니다. 드러난 등 피부의 점막이 마르고, 등지느러미 막이 갈라집니다.','{n}은 몸을 옆으로 눕혀 아가미를 물에 담그려 합니다. 눕힌 쪽 몸통이 대야 바닥에 쓸리며 비늘이 떨어집니다.','새 집에 도착해 대야를 내렸을 때 {n}의 등은 하얗게 굳어 있습니다. 이틀 뒤 그 자리에 솜 같은 균사가 자랍니다.']},
 'TRD-32-D':{kind:'bad',cat:'나눔',tier:'likely',fx:'f-bag',pl:[[0,'생수병에 담아 나눔']],after:'받은 사람은 "원래 이런 상태로 받았다"며 다시 나눔 글을 올렸습니다.',
   l:()=>isSp('pleco','oscar','gar','koi')?['김장 비닐에 담긴 물은 {n}의 몸을 다 덮지 못합니다. 지하철이 흔들릴 때마다 비닐이 몸에 감깁니다.','산소 없이 묶은 비닐 안에서 {n}의 아가미 뚜껑이 점점 크게 벌어집니다.','{n}은 몸을 펴려 하고, 그럴 때마다 꼬리와 머리가 동시에 비닐에 눌립니다.','새 집에서 비닐을 풀었을 때 {n}의 아가미 뚜껑은 벌어진 채 움직이지 않습니다.']
     :['{n}은 병 입구로 쏠려 들어가고, 꼬리지느러미가 플라스틱 테두리에 걸립니다. 손이 병을 흔들자 지느러미 막이 기조 사이로 찢어집니다.','찢긴 지느러미 가장자리에 세균이 자리 잡아 하얗게 녹기 시작합니다.','새 집에서 병을 거꾸로 들어 {n}을 꺼낼 때, 이번에는 가슴지느러미가 입구에 걸립니다. {n}은 꼬리를 쳐서 빠져나오려 하고, 그럴수록 남은 지느러미가 더 찢어집니다.','일주일 뒤 {n}의 지느러미는 기조만 남아 빗살처럼 서 있습니다. {n}은 바닥에 누워 아가미만 움직이다 멈춥니다.']},
 'TRD-33-D':{kind:'bad',cat:'선물',tier:'likely',fx:'f-bag',fact:'fBowlAny',pl:[[2,'비닐로 밀봉한 선물 어항']],
   l:['셀로판이 수면을 덮어 공기와 물 사이의 교환이 막힙니다. 작은 어항 속 산소는 금세 바닥납니다.','{n}은 수면에 입을 대고 비닐 아래의 얇은 공기를 들이마십니다. 비닐 안쪽에 맺힌 물방울이 다시 떨어지고, 공기층은 습해집니다.','{n}은 어항 벽을 따라 돌다 점점 느려집니다. 아가미 뚜껑이 벌어진 채 바닥으로 가라앉습니다.','케이크가 나온 뒤 선물이 개봉됩니다. 축하 노래는 끝까지 불렸습니다.']},
 'TRD-34-D':{kind:'bad',cat:'운반 사고',tier:'likely',fx:'f-burst',fact:'fBurst',pl:[[3,'물 찬 수조째 들어 옮김']],
   l:['유리 아래 모서리의 실리콘 이음새가 비틀린 힘을 버티지 못합니다. 바닥 유리에 금이 가고, 물이 계단으로 쏟아집니다.','{n}은 자갈과 함께 계단 위로 쏟아져 떨어집니다. 계단 모서리에 옆구리가 부딪히며 비늘이 떨어지고 늑골 아래가 패입니다.','{n}은 젖은 계단에서 몸을 튕겨 물이 고인 쪽으로 미끄러집니다. 고인 물은 얕아서 아가미의 절반만 잠깁니다.','사람들이 걸레와 양동이를 찾는 동안 {n}의 아가미 뚜껑이 느려집니다.']},
 'TRD-35-D':{kind:'bad',cat:'방류',tier:'fact',fx:'f-ice',fact:'fRelease',pl:[[5,'겨울 강에 방류'],[0,'감당 못 해 버림']],
   l:['가게에서 거절당한 주인은 집에 가는 길에 다리 위에서 멈춥니다. 봉지가 거꾸로 들립니다.','겨울 강물은 차갑습니다. {n}은 차가운 물에 닿자 근육이 굳어 지느러미가 몸에 붙습니다.','몸은 천천히 가라앉아 강바닥 돌 위에 눕습니다.','아가미 뚜껑이 느려지고, 멈춥니다.']},
 'TRD-36-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-pond',fact:'fKHV',pl:[[1,'품평회 후 격리하지 않음']],
   l:['품평회 물을 통해 들어온 바이러스가 {n}의 아가미와 피부에서 증식합니다.','집 연못에 돌아온 지 열흘 뒤, 아가미 새엽이 썩으며 하얀 부분과 붉은 부분이 얼룩으로 섞입니다. 눈이 안와 속으로 꺼집니다.','피부의 점액이 줄어 몸 표면이 사포처럼 거칠어집니다. {n}은 물이 들어오는 입구 쪽으로 가서 머리를 대고 숨을 쉽니다.','같은 연못의 다른 잉어들도 차례로 그 자리에 모입니다. 사흘 사이에 연못의 잉어가 모두 떠오릅니다.','트로피는 거실 장식장에 있습니다.']},
 'TRD-37-D':{kind:'bad',cat:'혼자',tier:'fact',fx:'f-bottom',fact:'fIch',pl:[[2,'무리 생활하는 물고기를 한 마리만 키움']],
   l:()=>['{n}은 몇 주째 수초 뒤에서 나오지 않습니다. 먹이가 떨어져도 다른 물고기들이 먼저 먹습니다.',isSp('neon')?'몸의 푸른 띠와 붉은 띠가 흐려지고, 배가 안으로 꺼집니다.':'몸 색이 흐려지고, 배가 안으로 꺼집니다.','면역이 떨어진 몸에 섬모충이 붙어 하얀 점이 돋습니다. {n}은 수초 사이에서 몸을 잎에 문지릅니다. 문지른 자리의 점막이 벗겨집니다.','주인은 {n}이 죽고 나서야 "원래 몇 마리였지?" 하고 수조를 다시 셉니다.']}
});
