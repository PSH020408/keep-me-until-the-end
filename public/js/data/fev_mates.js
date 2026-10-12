/* ---------- v0.10 catalogue: tankmates, behaviour, breeding, old age (events/05_mates.md, EV-MAT-01 … 40) ----------
   Stage: home. Three catalogue scenes happen before any owner and use the prologue's moments instead:
   MAT-24 (a newborn in the farm pond) and MAT-33 (fry sorting) at the farm sieve, MAT-27 (the wild father) at the net.
   Tankmates are S.f.mates. Trouble that is not among the 23 species (a tiger barb shoal, a second male behind a divider)
   lives in flags. mat_sync() keeps every flag this file reads in step with the tank before each home event draw. */

/* ---------- helpers ---------- */
/* a hidden check inside an outcome (used by the passive option every species can take) */
const mat_roll=(k,n)=>R()<clamp(Math.pow((fst()[k]||0)/n,2)*((MODES[S.mode]||{}).chk||1),.05,.95);
const mat_mates=()=>S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&!m.feed);
const mat_name=id=>id==='tigerbarb'?'타이거 바브':((SP.find(s=>s.id===id)||{}).name||'물고기');
const mat_hit=k=>{addFl(k);return fl(k)};
const mat_isK=(...ks)=>isKind(...ks);
function mat_add(id,n){const f=S.f,m=f.mates.find(m=>m.id===id&&!m.feed);if(m)m.n+=n;else f.mates.push({id,n,cm:id===S.sp.id?f.len:(FX[id]?FX[id].cm*.35:4)})}
/* the owner takes one species out of the tank */
function mat_part(id,line){const f=S.f;f.mates=f.mates.filter(m=>!(m.id===id&&m.id!==S.sp.id&&!m.feed));
  if(f.fl){if(f.fl.mat_npc===id)f.fl.mat_npc=0;if(f.fl.mate_sp===id)f.fl.mate_sp=0}if(line)addLog(T(line),'good')}
/* the owner takes one of our own kind out (a rival male) */
function mat_partSame(line){const f=S.f,m=f.mates.find(m=>m.id===S.sp.id&&m.n>0);if(m){m.n--;f.mates=f.mates.filter(m=>m.n>0)}
  f.fl=f.fl||{};f.fl.divider=0;f.fl.rival=0;if(line)addLog(T(line),'good')}
/* does this owner learn from what just happened? (owner kind's learn chance, lazy owners less) */
function mat_learns(bonus){const K=KIND[kindOf()]||{learn:.3};let p=K.learn+(bonus||0);if(S.f.lazy)p*=.4;if(S.f.stubborn)p=0;
  if(p>0&&R()<p){S.r=clamp(S.r+.02,0,.97);S.f.lessons=(S.f.lessons||0)+1;return true}
  if(!skipping&&R()<.4)addLog(T(pick(LAZY_NEAR)),'bad');return false}
function mat_learn(id,line,bonus){if(mat_learns(bonus)){mat_part(id,line);return true}return false}
/* a good life: few broken promises, fair water, a body that is not wrecked, nobody hounding it */
function mat_good(){const broke=(S.pl||[]).filter(Boolean).length;
  return broke<=1&&S.health>=45&&S.f.wq>=45&&!fl('small_tank')&&!fl('cramped')&&!fBully()}
/* old age: the choice only changes the last scene (variant a/b/c); the life decides happy or bad */
const mat_old=(id,v)=>()=>{setFl('mat_var',v);return {end:mat_good()?id+'-A':id+'-X'}};
/* what made the end of a long life a bad one */
function mat_oldWhy(){const f=S.f;
  if(f.wq<45)return '물은 몇 주째 갈리지 않아 탁합니다. 아가미 새엽 가장자리가 붉게 부어 있습니다.';
  if(fl('small_tank')||fl('cramped'))return '{n}의 몸은 수조 크기에 눌린 채 자라, 등뼈가 한쪽으로 굽어 있습니다.';
  if(fBully())return '노쇠해 느려진 {n}의 지느러미를 다른 물고기들이 쫓아와 뜯습니다. 뜯긴 끝이 하얗게 짓물러 있습니다.';
  if(S.health<45)return '{n}의 몸에는 오래된 상처와 병이 지나간 자국이 겹쳐 있습니다. 근육이 얇아 비늘 아래로 등뼈 모양이 비칩니다.';
  return '서약서에는 빨간 줄이 여러 개 그어져 있습니다. {n}은 그 수조에서 오래 버텼습니다.'}
const mat_last=(map,def)=>map[kindOf()]||def;
const mat_FAST=['comet','koi'],mat_SLOW=['oranda','ryukin'];

/* ---------- flags kept in step with the tank ---------- */
function mat_sync(){
  const f=S.f;if(!f||!f.mates||S.preOwner||S.wild)return;f.fl=f.fl||{};const FL=f.fl,me=S.sp.id;
  const ids=[...new Set(mat_mates().filter(m=>FX[m.id]).map(m=>m.id))];if(FL.mat_npc)ids.push(FL.mat_npc);
  FL.mate_sp=ids.length?pick(ids):0;
  FL.others=ids.length?1:0;
  FL.prey=(fEatable().length||isKind('content','unbox'))?1:0;
  const same=fSameCount(),tot=f.mates.reduce((s,m)=>s+m.n,0);
  FL.newsame=FL.mat_same!==undefined&&same>FL.mat_same?1:0;FL.mat_same=same;
  if(FL.mat_tot!==undefined&&tot<FL.mat_tot&&(S.interest<.55||isKind('casual','shared','neglect','decor','cult')))FL.corpse=1;FL.mat_tot=tot;
  FL.rival=(!fem()&&(same>=1||FL.divider))?1:0;
  FL.lone=same===0?1:0;
  FL.pairable=same>=1?1:0;
  FL.elder=fl('old')||((FL.bentback||(FL.births||0)>=8)&&S.ageM/S.sp.life>.5)?1:0;
  FL.rehomed=S.owners>1?1:0;
  FL.cramped=tankL()<fx_().minL*.5&&S.ageM>S.sp.life*.1?1:0;
  FL.sandbed=(f.sand||FL.buried)?1:0;
  FL.goldmix=(spIn(me,mat_SLOW)&&ids.some(i=>mat_FAST.includes(i)))||(spIn(me,mat_FAST)&&ids.some(i=>mat_SLOW.includes(i)))?1:0;
  FL.bigmate=mat_mates().some(m=>m.cm>=f.len*2.5&&fbOf(m.id).mouth>0)||(me==='gar'&&FL.grudge&&fst().p>=90)?1:0;
  FL.spawnset=isSp('betta','wildbetta')&&S.ageM>S.sp.life*.12&&(same>=1||isKind('breeder','mill','breakup','eager','content'))?1:0;
  FL.chase=isSp('@gold','koi')&&same>=2?1:0;
  if(isSp('@livebearer')){
    FL.males=FL.skew&&same>=2?1:0;
    if(fem()&&same>=1&&!FL.gravid&&R()<.3)FL.gravid=1;
    if(same>=14||(fLoad()>1.2&&same>=6))FL.overpop=Math.max(FL.overpop||0,3);
    FL.crowded=(FL.overpop||0)>=3?1:0}
  if(isSp('wildbetta')&&!fem()&&same>=1&&!FL.brood&&R()<.08)FL.brood='mouth';
  if(isSp('apisto')&&same>=1&&(FL.territory||f.hides)&&!FL.brood&&R()<.08)FL.brood='eggs';
  if(!FL.spawned&&same>=1&&((isSp('@gold','koi')&&season()==='spring'&&R()<.4)||(isSp('neon','cory')&&R()<.08)))FL.spawned=1;
}
(()=>{const _p=fevPool;fevPool=function(st,...a){if(st==='home'){try{mat_sync()}catch(err){}}return _p(st,...a)}})();
/* trouble that comes with the owner: a tiger barb shoal "for colour", two bettas behind one divider, males only */
(()=>{const _s=setupOwner;setupOwner=function(own){_s(own);const f=S.f;if(!f)return;f.fl=f.fl||{};const FL=f.fl;
  FL.mat_npc=0;FL.divider=0;
  if(isKind('eager','gift','casual','shared','decor')&&isSp('betta','guppy','altum','neon','platy')&&R()<.15)FL.mat_npc='tigerbarb';
  if(isKind('breakup','eager','unbox','gift','casual')&&isSp('betta')&&!fem()&&R()<(isKind('breakup')?.6:.2))FL.divider=1;
  if(isSp('@livebearer')&&isKind('casual','gift','shared','eager')&&R()<.5)FL.skew=1;
}})();

/* =====================================================================================
   합사 — 먹히는 쪽, 먹는 쪽
   ===================================================================================== */

/* EV-MAT-01 같이 산 동갑내기 — the oscar that was a fingertip when they were bought together
   [출처: 시클리드 인두악(인두치) 구조와 흡입 포식] [출처: 코리도라스 가시가 포식어 목에 걸린 사례] */
function mat_01fail(fast){
  if(isSp('cory')){if(fst().g>=60&&R()<.5)return {end:'MAT-01-H'};
    return {t:'오스카가 {n}을 입에 넣었다가 곧 뱉어 냈습니다. {n}이 세운 가슴지느러미 가시가 오스카의 입천장에 걸렸던 것입니다. 골판 몇 장이 긁히고, 몸의 점액이 벗겨졌습니다.',c:'bad',fx:{h:-16,st:.15},mem:'큰 입 안이 캄캄했다. 가시를 세웠다. 다시 물 밖이었다.',near:'mates'}}
  if(!fast&&isSp('platy','altum')&&!fl('mat_01_hit')){
    return {t:'오스카가 {n}을 물었지만, 몸 높이 때문에 한 번에 삼키지 못하고 놓았습니다. 옆구리 비늘이 떨어지고 지느러미 끝이 찢겼습니다.',c:'bad',fx:{h:-14,fin:.15,st:.15},set:{mat_01_hit:1},run:()=>{S.cd['evMAT-01']=S.tick+8},near:'mates'}}
  return {end:'MAT-01-D'};
}
fev([{id:'MAT-01',tier:'fact',sp:['neon','guppy','platy','cory','apisto','peapuffer','altum','ghost'],own:['casual','eager','gift','shared','relay','decor'],
  need:{mate_sp:'oscar'},cd:20,w:()=>isSp('neon','guppy')?1.6:isSp('platy','altum','apisto','peapuffer')?1:.5,
  p:'처음 들어왔을 때 손가락 한 마디만 하던 오스카가 이제 수조 한쪽을 다 차지합니다. 먹이 시간이 아닌데 오스카가 {n} 쪽으로 천천히 몸을 돌립니다. 오스카의 눈이 {n}의 움직임을 따라 움직입니다. {n}은…',
  o:[
   {l:'수초 덩어리 깊숙이 파고든다',chk:()=>['w',isSp('apisto')&&fl('hides')?30:40],
    ok:{t:'{n}은 수초 덩어리 깊숙이 몸을 밀어 넣었습니다. 오스카는 한참 수초를 뜯어 대다 돌아섰습니다. 수초 몇 포기가 뿌리째 떠올랐습니다.',c:'good',fx:{w:2},run:()=>{S.cd['evMAT-01']=S.tick+10}},
    no:()=>mat_01fail(0)},
   {l:'오스카의 시선 반대쪽으로 빠르게 헤엄친다',chk:['p',20],
    ok:{t:'{n}은 오스카가 몸을 다 돌리기 전에 수조 반대편 끝까지 헤엄쳤습니다.',c:'good',fx:{p:1}},
    no:()=>mat_01fail(1)},
   {l:'바닥에 붙어 움직이지 않는다',
    ok:()=>mat_roll('g',isSp('ghost')?10:15)?{t:'{n}은 바닥에 붙어 지느러미 하나 움직이지 않았습니다. 오스카는 흥미를 잃고 수면 쪽으로 올라갔습니다.',c:'good',fx:{g:1}}:mat_01fail(0)}
  ]}]);

/* EV-MAT-02 사냥하는 쪽 — the predator's side [출처: 코리도라스·소형 메기 가시로 인한 포식어 질식 사례] [출처: 폴립테루스 후각 의존 야간 포식] */
function mat_02spine(){
  if(R()<.45)return {end:'MAT-02-D'};
  return {t:'코리도라스의 가시가 {n}의 인두 벽에 걸렸습니다. {n}은 사흘 동안 입을 다물지 못하다가, 걸린 것을 겨우 뱉어 냈습니다. 찢긴 점막 자리가 붉게 부었습니다.',c:'bad',fx:{h:-22,st:.2},
    run:()=>{if(isKind('expert','learner','staff')&&mat_learns()){setFl('learned_no_spiny',1);mat_part('cory','주인은 "가시 있는 메기류는 합사 금지"라고 적어 두고 코리도라스를 다른 수조로 옮겼습니다.')}}};
}
fev([{id:'MAT-02',tier:'fact',sp:['oscar','arowana','channa','gar','bichir'],need:{prey:1,learned_no_spiny:0},cd:30,
  w:()=>(isSp('channa')?1.6:isSp('oscar','gar')?1.2:isSp('arowana')?.8:.6)*(isKind('content','unbox','eager')?2:1),
  p:'새로 들어온 작은 물고기들이 수조 위쪽에서 반짝이며 함께 움직입니다. 바닥에는 수염 달린 작은 물고기 몇 마리가 모래를 뒤집습니다. 주인은 "같이 키워도 된대"라고 말하고 불을 끕니다. {n}은…',
  o:[
   {l:'반짝이는 무리를 향해 천천히 다가간다',chk:()=>['p',isSp('channa')?30:isSp('gar')?50:40],
    ok:()=>{
      if(isSp('bichir'))return {t:'{n}은 무리를 눈으로 쫓지 못했습니다. 불이 꺼진 뒤, 콧구멍의 관을 앞세워 바닥에서 잠든 한 마리를 찾아냈습니다.',c:'neutral',fx:{fat:.1},run:()=>fEatOne()};
      if(isSp('arowana')&&!S.f.lid)return {t:'{n}이 무리를 쫓아 수면을 박차고 올랐습니다. 무리는 흩어졌고, {n}의 몸은 수면 위로 반쯤 나가 있었습니다.',c:'bad',fx:{p:2},run:()=>{if(!S.waiting)q(null,null,()=>fCr('jump'))}};
      if(isSp('channa')&&mat_mates().some(m=>m.cm>=S.f.len*.5)&&R()<.3)return {t:'{n}이 제 몸 절반만 한 물고기에게 덤볐습니다. 그 물고기가 몸을 비틀며 되받아 물었습니다. {n}의 옆구리 비늘이 몇 장 떨어졌습니다.',c:'bad',fx:{h:-10,p:1}};
      return {t:'{n}의 입이 열렸다 닫혔습니다. 무리의 숫자가 하나 줄었습니다.',c:'neutral',fx:{p:2,fat:.15,i:isKind('content','unbox')?.08:0},run:()=>fEatOne()}},
    no:{t:'무리는 한꺼번에 흩어졌습니다. {n}은 아무것도 물지 못했습니다.'}},
   {l:'바닥에서 움직이는 작은 것을 입으로 훑는다',chk:()=>isSp('arowana')?null:['w',50],
    ok:()=>isSp('arowana')?{t:'{n}은 바닥까지 내려가지 않았습니다. 수면 아래에서 몸을 돌려 제자리로 돌아갔습니다.'}
      :fst().w>=70&&R()<.35?{end:'MAT-02-H'}
      :{t:'{n}은 수염 달린 물고기를 입에 넣었다가, 가시가 세워지는 순간 뱉어 냈습니다. 그 뒤로 {n}은 바닥의 그 물고기들을 건드리지 않았습니다.',c:'good',fx:{w:3},set:{spine_wise:1}},
    no:()=>isSp('bichir')&&R()<.5?{t:'불이 켜진 동안 {n}은 바닥에서 아무것도 찾지 못했습니다.'}:mat_02spine()},
   {l:'은신처에 들어가 가만히 있는다',ok:{t:'그날 밤 {n}은 사냥하지 않았습니다. 작은 물고기들은 아침까지 그대로였습니다.',fx:{g:1}}}
  ]}]);

/* EV-MAT-03 불이 꺼진 뒤의 바닥 — a bichir hunts by smell at night [출처: 폴립테루스 야간 포식, 합사 주의 문헌] */
function mat_03fail(){
  if(isSp('cory')&&R()<.6)return {t:'폴립테루스가 {n}을 물었다가 놓았습니다. {n}이 세운 가시 때문이었습니다. 꼬리자루가 긁히고 점액이 벗겨졌습니다.',c:'bad',fx:{h:-14,fin:.1,st:.12}};
  if(R()<.3)return {t:'턱이 {n}의 꼬리자루를 긁고 지나갔습니다. {n}은 몸을 휘어 빠져나왔습니다.',c:'bad',fx:{h:-10,fin:.15,st:.12},run:()=>{S.cd['evMAT-03']=S.tick+8}};
  return {end:'MAT-03-D'};
}
const mat_03live=()=>({t:'아침에 주인은 한 마리가 줄었다는 것을 알아채지 못했습니다. {n}은 수면 근처 수초에서 아침을 맞았습니다.',c:'good',fx:{w:2},
  run:()=>{if(isKind('expert','learner','staff'))mat_learn('bichir','주인은 "폴립테루스는 입에 들어가는 건 다 먹는다"는 글을 읽고 폴립테루스를 다른 수조로 옮겼습니다.')}});
fev([{id:'MAT-03',tier:'fact',sp:['neon','guppy','platy','cory','apisto','peapuffer','ghost'],need:{mate_sp:'bichir'},cd:()=>isSp('ghost')?10:20,
  p:'불이 꺼진 뒤 바닥 동굴에서 긴 몸이 미끄러져 나옵니다. 그 물고기는 콧구멍에 달린 짧은 관을 앞세워 바닥을 훑습니다. 그 몸이 {n}이 쉬는 수초 근처로 천천히 다가옵니다. {n}은…',
  o:[
   {l:'수면 가까이 떠올라 잠든다',chk:()=>['w',isSp('cory')?40:isSp('ghost')?20:30],ok:mat_03live,no:mat_03fail},
   {l:'같은 종 무리 한가운데로 끼어든다',chk:()=>['g',isSp('@schooling')&&fSameCount()>0?25:999],lockText:'{n} 곁에는 끼어들 무리가 없다',
    ok:{t:'아침에 무리의 숫자가 하나 줄어 있었습니다. 무리 가장자리에 있던 한 마리였습니다. {n}은 무리 한가운데에 있었습니다.',c:'neutral',fx:{g:1},run:()=>{const m=S.f.mates.find(m=>m.id===S.sp.id&&m.n>0);if(m){m.n--;S.f.mates=S.f.mates.filter(m=>m.n>0)}}},
    no:mat_03fail},
   {l:'그 자리에서 움직이지 않는다',ok:()=>mat_roll('g',isSp('ghost')?5:isSp('apisto')&&fl('hides')?10:isSp('peapuffer')?20:15)?{t:'긴 몸은 {n} 옆을 지나 수조 반대편으로 갔습니다.',c:'good',fx:{g:1}}:mat_03fail()}
  ]}]);

/* EV-MAT-04 수면 아래의 은빛 그림자 — an arowana (or gar) under the surface [출처: 실버 아로와나 수면 포식 습성] */
function mat_04fail(){
  if(R()<(isSp('betta')?.55:.5))return {end:'MAT-04-D'};
  return {t:fx_().longfin?'아래에서 턱이 닫혔습니다. {n}은 꼬리지느러미 절반을 남겨 두고 빠져나왔습니다. 수면에 찢어진 지느러미 조각이 떴습니다.':'아래에서 턱이 닫혔습니다. {n}은 옆구리 비늘 몇 장을 남겨 두고 빠져나왔습니다.',c:'bad',fx:{fin:.35,h:-10,st:.2},
    sick:R()<.35?'finrot':null,mem:'수면은 위험했다. 그래도 올라가야 했다.',
    run:()=>{const pr=fl('mate_sp')==='gar'?'gar':'arowana';
      if(isKind('decor'))addLog(T('주인은 "용이 작은 물고기를 먹으면 재물이 는다"며 먹이용 물고기를 한 봉지 더 사 왔습니다.'),'bad');
      else if(isKind('content','unbox'))addLog(T('주인은 그 장면을 영상으로 올렸습니다. 조회수가 평소의 세 배였습니다.'),'bad');
      else if(isKind('expert','learner','staff'))mat_learn(pr,'주인은 '+mat_name(pr)+'를 다른 수조로 옮겼습니다.')}};
}
fev([{id:'MAT-04',tier:'fact',sp:['betta','wildbetta','guppy','platy','peapuffer'],own:['decor','content','eager','casual'],need:{mate_sp:['arowana','gar']},
  cd:()=>isSp('@labyrinth')?14:30,w:()=>isSp('peapuffer')?.35:isSp('@labyrinth')?1.5:1,
  p:'수면 바로 아래에 길고 은빛인 몸이 떠 있습니다. 그 물고기는 아래턱을 위로 치켜든 채 수면만 봅니다. {n}이 수면에 다가갈 때마다 은빛 몸이 조금씩 따라옵니다. {n}은…',
  o:[
   {l:'수면에 닿자마자 바로 아래로 꺾는다',chk:['p',35],ok:{t:'{n}은 수면을 스치자마자 몸을 꺾어 내려왔습니다. 은빛 턱은 빈 물을 물었습니다.',c:'good',fx:{p:2}},no:mat_04fail},
   {l:'은빛 몸에서 가장 먼 구석의 수면으로 간다',chk:()=>['w',isSp('guppy','platy')&&fSameCount()>=3?25:30],ok:{t:'{n}은 수조 끝 구석에서만 수면에 올라갔습니다. 은빛 몸은 그곳까지 따라오지 않았습니다.',c:'good',fx:{w:2}},no:mat_04fail},
   {l:'중간층에 가만히 머문다',ok:()=>mat_roll('g',isSp('@labyrinth')?50:fl('mate_sp')==='gar'?10:15)?{t:'{n}은 중간층에서 움직이지 않았습니다. 은빛 몸은 수면만 보았습니다.',c:'good',fx:{g:1}}
     :isSp('@labyrinth')?{t:'숨이 차올랐습니다. {n}은 결국 수면으로 올라갔습니다.',c:'bad',run:()=>{const o=mat_04fail();q(null,null,()=>fevOut(o))}}:mat_04fail()}
  ]}]);

/* EV-MAT-05 유목 아래의 무지갯빛 — a rainbow snakehead's territory, both sides [출처: Channa bleheri 공격성·단독 사육 권장] */
function mat_05fail(){
  if(isSp('pleco'))return {t:'스네이크헤드가 {n}을 물었지만 갑옷 같은 비늘을 뚫지 못했습니다. 대신 등지느러미가 뜯겨 나갔습니다.',c:'bad',fx:{fin:.25,h:-6}};
  if(isSp('bichir'))return {t:'단단한 비늘이 이빨을 막았습니다. {n}은 지느러미 끝을 잃고 빠져나왔습니다.',c:'bad',fx:{fin:.2,h:-8}};
  if(isSp('clownloach'))return {t:'물린 순간 {n}이 눈 밑 가시를 세웠습니다. 가시가 스네이크헤드의 입가를 찢었고, 스네이크헤드는 {n}을 놓았습니다. {n}의 옆구리에도 이빨 자국이 남았습니다.',c:'bad',fx:{h:-12,st:.1}};
  if(R()<(isSp('ghost','altum')?.65:.4))return {end:'MAT-05-D'};
  return {t:'스네이크헤드가 {n}의 옆구리를 물고 놓았습니다. 상처 가장자리의 피부가 하얗게 들떴습니다.',c:'bad',fx:{h:-18,st:.15},sick:R()<.4?'fungus':null,
    run:()=>{if(isKind('relay'))mat_part('channa','주인은 스네이크헤드를 "합사 불가" 나눔 글로 다른 집에 보냈습니다.');
      else if(isKind('casual')&&R()<.25)q(T('주인은 상처 난 {n}을 "병 옮기겠다"며 건져 냈습니다.'),'bad',()=>fEnd('flushalive'));
      else mat_learn('channa','주인은 "스네이크헤드는 단독 사육"이라는 글을 보고 스네이크헤드를 따로 옮겼습니다.')}};
}
fev([{id:'MAT-05',tier:'fact',sp:['clownloach','ghost','bichir','pleco','oscar','motoro','altum','cory','channa'],own:['eager','content','casual','relay','gift','learner'],
  need:{mate_sp:['channa','clownloach','ghost','bichir','pleco','oscar','motoro','altum','cory','neon','guppy','platy','comet','koi','gar','arowana','tigerbarb']},
  when:()=>isSp('channa')?fl('mate_sp')!=='channa':fl('mate_sp')==='channa',cd:25,
  p:()=>isSp('channa')?'유목 아래에서 {n}의 등지느러미가 곧게 섭니다. 다른 물고기 하나가 유목 앞을 지나갑니다. 그 물고기의 꼬리가 {n}의 영역 안으로 들어옵니다. {n}은…'
    :'수조 뒤쪽 유목 아래에 무지갯빛 몸이 머리만 내밀고 있습니다. {n}이 그 앞을 지날 때마다 그 물고기의 등지느러미가 곧게 섭니다. 어제 지나간 자리의 모래에는 비늘 한 장이 떨어져 있습니다. {n}은…',
  o:[
   /* the snakehead itself */
   {l:'다가오는 것을 문다',when:()=>isSp('channa'),chk:['p',30],
    ok:()=>({t:'{n}이 유목 아래에서 튀어나가 그 물고기의 옆구리를 물었습니다. 며칠 뒤 그 물고기는 수면에 떠올랐습니다.',c:'neutral',fx:{p:2},
      run:()=>{addFl('mat_05_bites');const m=mat_mates().find(m=>m.cm<=S.f.len*1.3);if(m){m.n--;S.f.mates=S.f.mates.filter(m=>m.n>0)}
        if(isKind('relay')&&R()<.4+fl('mat_05_bites')*.15)fRehome('주인은 {n}을 "성격 있음, 단독 사육"이라고 적어 나눔에 올렸습니다.');
        else if(mat_learns(fl('mat_05_bites')*.1)){S.f.mates=S.f.mates.filter(m=>m.id===S.sp.id);S.f.noMates=1;S.f.fl.mat_npc=0;addLog(T('주인은 "합사가 안 되는 물고기구나" 하며 {n}만 남기고 다른 물고기들을 옮겼습니다.'),'good')}}}),
    no:{t:'그 물고기는 {n}의 이빨이 닿기 전에 수조 반대편으로 달아났습니다.'}},
   {l:'유목 아래에서 지켜본다',when:()=>isSp('channa'),chk:['w',35],ok:{t:'{n}은 그 물고기가 지나갈 때까지 유목 아래에서 눈만 움직였습니다.',c:'good',fx:{w:2}},no:{t:'{n}은 참지 못하고 한 번 몸을 내밀었다가 돌아왔습니다.',fx:{st:.05}}},
   /* everyone else */
   {l:'유목 앞을 피해 반대쪽 길로만 다닌다',when:()=>!isSp('channa'),chk:['w',35],ok:{t:'{n}은 유목 앞을 지나지 않는 길을 익혔습니다.',c:'good',fx:{w:2}},no:mat_05fail},
   {l:()=>isSp('motoro')?'꼬리를 등 위로 휘어 올린다':'그 앞에서 몸을 크게 펼치고 버틴다',when:()=>!isSp('channa'),chk:['p',50],
    ok:()=>isSp('motoro')?{t:'스네이크헤드가 덤벼든 순간 {n}의 꼬리가 휘었습니다. 독침이 스네이크헤드의 몸에 박혔습니다. 다음 날 스네이크헤드는 유목 아래에서 움직이지 않았고, 아무도 건지지 않은 물이 비려졌습니다.',c:'neutral',fx:{p:2,wq:-15},run:()=>mat_part('channa')}
      :{t:'{n}이 몸을 펼치고 물러서지 않자 스네이크헤드가 유목 아래로 들어갔습니다.',c:'good',fx:{p:2},set:isSp('oscar')?{reverse:1}:{}},
    no:mat_05fail},
   {l:'바닥 구석에 붙어 지낸다',when:()=>!isSp('channa'),ok:()=>mat_roll('g',20)?{t:'{n}은 구석에서 하루를 버텼습니다. 스네이크헤드는 나오지 않았습니다.',fx:{g:1}}:mat_05fail()},
   {l:'바닥 구석에 가만히 있는다',when:()=>isSp('channa'),ok:{t:'{n}은 그날 아무도 물지 않았습니다.',fx:{g:1}}}
  ]}]);

/* EV-MAT-06 작은 복어의 부리 — pea puffers nip, both sides [출처: 피퍼퍼 지느러미 뜯기 습성, 단종 사육 권장] [출처: 피퍼퍼 수컷 간 공격] */
function mat_06nip(){
  if(isSp('neon','cory'))return {t:isSp('cory')?'복어가 {n}의 수염 끝을 쪼았습니다. 수염이 짧아졌습니다.':'복어가 {n}의 눈 가장자리를 쪼았습니다.',c:'bad',fx:{h:-10,st:.1}};
  if(isSp('guppy')&&fem())return {t:'복어들은 {n}의 짧은 꼬리에는 별 관심이 없었습니다. 그래도 몇 번 쪼였습니다.',c:'bad',fx:{fin:.05}};
  const k=mat_hit('mat_06');
  if(k>=2&&fx_().longfin)return {end:'MAT-06-D'};
  if(isSp('altum'))return {t:'복어가 {n}의 배지느러미 끝 실을 잘라 냈습니다. {n}은 그날 먹이를 먹지 않았습니다.',c:'bad',fx:{fin:.15,h:-6,st:.15},add:{thin:1}};
  return {t:'작은 부리가 {n}의 꼬리지느러미 끝을 반달 모양으로 잘라 냈습니다.',c:'bad',fx:{fin:.2,st:.1},sick:k>=2&&R()<.4?'finrot':null};
}
function mat_06eye(){
  if(mat_hit('mat_06e')>=2)return {end:'MAT-06-E'};
  return {t:'다른 수컷이 정면에서 {n}의 눈 가장자리를 물었습니다. 각막에 하얀 줄이 생겼습니다.',c:'bad',fx:{h:-15,st:.15}};
}
const mat_06rival=()=>(fSameCount()>=1&&!fem())||fl('mate_sp')==='betta';
fev([{id:'MAT-06',tier:'fact',sp:['peapuffer','guppy','betta','neon','platy','altum','cory'],own:['eager','gift','casual','decor'],
  need:{mate_sp:['peapuffer','guppy','betta','neon','platy','altum','cory','oranda','ryukin']},
  when:()=>isSp('peapuffer')?!!fl('mate_sp')||fSameCount()>0:fl('mate_sp')==='peapuffer',cd:20,
  w:()=>isSp('betta','guppy','altum','peapuffer')?1.3:.7,
  p:()=>isSp('peapuffer')?'옆에서 넓은 꼬리지느러미가 천천히 흔들립니다. {n}의 두 눈이 따로따로 움직이며 그 끝을 따라갑니다. 바닥에는 작은 달팽이가 한 마리 기어갑니다. {n}은…'
    :'콩알만 한 복어 몇 마리가 수초 사이에서 떠 있습니다. 복어의 두 눈이 따로따로 움직이다가 {n}의 꼬리지느러미 끝에서 함께 멈춥니다. 지느러미 끝이 톡 하고 당겨집니다. {n}은…',
  o:[
   /* the puffer */
   {l:'흔들리는 지느러미 끝을 쪼아 본다',when:()=>isSp('peapuffer'),
    ok:()=>mat_06rival()&&R()<.35?mat_06eye():{t:'{n}이 그 지느러미 끝을 물어 당겼습니다. 찢어진 조각이 물에 떠다녔습니다.',c:'neutral',fx:{p:1},
      run:()=>{if(isKind('relay','casual')&&R()<.45*(1-fst().c/120))fRehome('주인은 찢어진 지느러미들을 보고 {n}을 "작은 복어 분양" 글로 올렸습니다.');
        else if(isKind('learner','expert')&&mat_learns()){S.f.mates=S.f.mates.filter(m=>m.id===S.sp.id);S.f.fl.mat_npc=0;addLog(T('주인은 "피퍼퍼는 단독 종 수조"라는 글을 읽고 다른 물고기들을 옮겼습니다.'),'good')}
        else if(isKind('eager'))addLog(T('주인은 "친구가 필요한가 봐" 하며 작은 복어를 두 마리 더 사 왔습니다.'),'bad')}}},
   {l:'바닥의 달팽이를 깨 먹는다',when:()=>isSp('peapuffer'),chk:['w',30],
    ok:{t:'{n}이 달팽이 껍데기를 부리로 깨뜨렸습니다. 딱딱한 껍데기가 자라는 부리 끝을 갈아 냈습니다.',c:'good',fx:{w:2},set:{snails:1,beak_worn:1}},
    no:{t:'{n}은 달팽이 껍데기를 몇 번 쪼다 그만두었습니다.'}},
   {l:'수초 사이에 가만히 떠 있는다',when:()=>isSp('peapuffer'),ok:()=>mat_roll('g',15)||!mat_06rival()?{t:'{n}은 수초 사이에서 두 눈만 굴렸습니다.',fx:{g:1}}:mat_06eye()},
   /* the bitten */
   {l:'지느러미를 접고 빠르게 수조를 가로지른다',when:()=>!isSp('peapuffer'),chk:()=>['p',isSp('cory','betta')?40:30],
    ok:{t:'{n}은 지느러미를 몸에 붙이고 복어들 사이를 빠져나갔습니다.',c:'good',fx:{p:1}},
    no:()=>isSp('betta')&&R()<.3?{t:'{n}이 몸을 돌려 쫓아오던 복어 한 마리를 물었습니다. 그 복어는 다음 날 아침 수초 아래에 누워 있었습니다. {n}의 꼬리도 짧아져 있었습니다.',c:'bad',fx:{fin:.15},run:()=>{const m=S.f.mates.find(m=>m.id==='peapuffer'&&m.n>0);if(m){m.n--;S.f.mates=S.f.mates.filter(m=>m.n>0)}}}:mat_06nip()},
   {l:'복어들이 없는 수면 쪽 구석에 머문다',when:()=>!isSp('peapuffer'),chk:['w',30],ok:{t:'{n}은 수면 쪽 구석에서 하루를 보냈습니다. 복어들은 수초 사이에 머물렀습니다.',c:'good',fx:{w:2}},no:mat_06nip},
   {l:'수초 사이에 가만히 있는다',when:()=>!isSp('peapuffer'),ok:()=>mat_roll('g',15)?{t:'복어들은 {n}을 지나쳐 갔습니다.',fx:{g:1}}:mat_06nip()}
  ]}]);

/* EV-MAT-07 소금을 넣는 날 — a figure-8 puffer needs brackish water; its tankmates do not
   [출처: 팔자복어(Dichotomyctere biocellatus) 기수 요구 조건] [출처: 무비늘 메기류·가오리 염분 민감도] */
function mat_07salt(){
  if(isSp('guppy','platy'))return {t:'소금이 녹은 물에서도 {n}은 평소처럼 헤엄쳤습니다.',fx:{g:1},set:{salt:'mid'}};
  if(isSp('neon'))return {t:'짜진 물에서 {n}의 파란 줄이 낮에도 흐려졌습니다. 먹이 시간에도 수초 사이에서 나오지 않았습니다.',c:'bad',fx:{st:.2,h:-8},add:{thin:1},set:{salt:'mid'}};
  const ch=clamp(Math.pow(fst().g/40,2)*(S.r>.6?1.4:1),.05,.9);
  if(R()<ch)return {t:'{n}의 피부 점액이 두꺼워지고 하얗게 엉겼습니다. 며칠 뒤 주인이 물을 갈았고, {n}은 들뜬 점액을 달고 버텼습니다.',c:'bad',fx:{h:-22,st:.2},set:{salt:'mid'}};
  return {end:'MAT-07-D'};
}
const mat_07apart=()=>{S.f.mates=S.f.mates.filter(m=>m.id===S.sp.id);S.f.fl.mat_npc=0;S.f.noMates=1};
fev([{id:'MAT-07',tier:'fact',sp:['fig8','cory','neon','clownloach','ghost','motoro','guppy','platy'],own:['learner','eager','alchemist','casual'],
  need:{mate_sp:['fig8','cory','neon','clownloach','ghost','motoro','guppy','platy','betta'],salt:0},
  when:()=>isSp('fig8')?!!fl('mate_sp'):fl('mate_sp')==='fig8',once:1,
  log:()=>isSp('fig8')?'주인이 "팔자복어는 기수어"라는 글을 읽었습니다.':'주인이 수조에 소금을 풀었습니다. 같은 수조의 팔자복어 때문이었습니다. 물이 조금씩 짜집니다. 피부가 당기는 느낌이 납니다.',
  p:'수조 안의 다른 물고기들은 {n}보다 작고 느립니다. {n}이 다가가면 그 물고기들은 수초 쪽으로 흩어집니다. 주인이 수조 앞에 소금 봉지를 들고 서서 한참 휴대폰을 봅니다. {n}은…',
  auto:()=>mat_07salt(),
  o:[
   {l:'흩어지는 물고기를 쫓아간다',when:()=>isSp('fig8'),chk:['p',30],
    ok:()=>R()<.5?{t:'{n}이 쫓아간 물고기들의 지느러미가 뜯겨 있었습니다. 주인은 그날 {n}을 위한 작은 수조를 따로 샀습니다. 그 물에는 소금이 들어갔습니다.',c:'good',fx:{p:1},set:{salt:1,learned_brackish:1},run:mat_07apart}
      :{t:'{n}이 다른 물고기들의 지느러미를 뜯었습니다. 주인은 소금을 조금만 넣었습니다.',c:'bad',set:{salt:'mid'}},
    no:{t:'다른 물고기들은 수초 사이로 숨었습니다. 주인은 소금을 조금만 넣었습니다.',set:{salt:'mid'}}},
   {l:'유리 앞에서 주인을 보며 위아래로 헤엄친다',when:()=>isSp('fig8'),chk:['c',60],
    ok:{t:'주인은 {n}만 따로 기수 수조로 옮겼습니다. 소금물 속에서 {n}의 몸 색이 며칠 사이 짙어졌습니다.',c:'good',fx:{h:8,st:-.1},set:{salt:1,learned_brackish:1},run:mat_07apart},
    no:{t:'"배고프구나." 주인은 먹이를 주고, 소금은 "중간쯤"만 넣었습니다.',c:'bad',set:{salt:'mid'}}},
   {l:'장식 뒤에 가만히 있는다',when:()=>isSp('fig8'),
    ok:()=>isKind('alchemist')?{t:'주인은 소금에 더해 수질 안정제와 백점병 약까지 넣었습니다. 모두 "중간쯤"이었습니다.',c:'bad',fx:{h:-6},set:{salt:'mid'},add:{meds:1}}
      :{t:'주인은 양쪽 다 괜찮을 거라며 "중간 염도"로 맞췄습니다. 어느 쪽에게도 맞지 않는 물이었습니다.',c:'bad',fx:{h:-5},set:{salt:'mid'}}}
  ]}]);

/* EV-MAT-08 줄무늬 이웃 — a tiger barb shoal [출처: 타이거 바브 지느러미 뜯기 습성 — 장지느러미 종 합사 금지 권장] */
function mat_08fail(){
  if(isSp('neon','platy'))return {t:'바브 무리가 {n}을 수조 끝까지 쫓아갔습니다. {n}은 하루 종일 쫓겨 다녔습니다.',c:'bad',fx:{g:-3,st:.12}};
  const k=mat_hit('mat_08');
  if(isSp('altum')){if(k>=2)return {end:'MAT-08-D'};return {t:'바브 무리가 지나간 뒤 {n}의 배지느러미 실 끝이 한 마디 짧아졌습니다. {n}은 그날 먹이를 먹지 않았습니다.',c:'bad',fx:{fin:.15,st:.15,h:-6},add:{thin:1}}}
  return {t:'무리가 지나갈 때마다 {n}의 꼬리지느러미 끝이 조금씩 짧아졌습니다.',c:'bad',fx:{fin:.2,st:.08},set:isSp('guppy')&&!fem()?{tail_short:1}:{},sick:k>=2&&R()<.35?'finrot':null,
    run:()=>{if(isKind('learner','expert')||(isKind('content')&&R()<.4))mat_learn('tigerbarb','주인은 타이거 바브 무리를 다른 수조로 옮겼습니다.')}};
}
fev([{id:'MAT-08',tier:'fact',sp:['betta','guppy','altum','neon','platy'],own:['eager','gift','casual','shared','decor','content','learner'],need:{mate_sp:'tigerbarb'},cd:18,
  w:()=>isSp('neon','platy')?.4:1.2,
  p:'주황색 바탕에 검은 줄이 있는 작은 물고기 여섯 마리가 수조 안을 함께 몰려다닙니다. 그 무리가 {n} 옆을 지나갈 때마다 지느러미 끝에 무언가 톡 닿습니다. 오늘 아침 꼬리지느러미 끝이 어제보다 짧습니다. {n}은…',
  o:[
   {l:'지느러미를 몸에 붙이고 빠르게 지나간다',chk:['p',30],ok:{t:'{n}은 무리가 돌아서기 전에 지나갔습니다.',c:'good',fx:{p:1}},no:mat_08fail},
   {l:'수초 깊숙이 들어가 지낸다',chk:()=>['w',isSp('altum')?40:30],ok:{t:'{n}은 수초 깊숙한 곳에서 하루를 보냈습니다. 무리는 들어오지 않았습니다.',c:'good',fx:{w:1}},no:mat_08fail},
   {l:'그 자리에서 움직이지 않는다',ok:()=>mat_roll('g',15)?{t:'무리는 {n}을 지나쳐 갔습니다.',fx:{g:1}}:mat_08fail()},
   {l:'몸을 크게 펼쳐 무리에 맞선다',when:()=>isSp('betta'),chk:['c',50],
    ok:()=>fst().c>=80&&R()<.4?{end:'MAT-08-H'}:{t:'{n}이 지느러미를 활짝 펼쳤습니다. 바브 무리는 물러서지 않았습니다. 넓게 펼친 지느러미 끝을 여섯 마리가 번갈아 물었습니다.',c:'bad',fx:{fin:.18,c:2}},
    no:{t:'{n}이 지느러미를 펼친 사이 바브 무리가 한 바퀴 돌며 끝을 물었습니다.',c:'bad',fx:{fin:.2}}}
  ]}]);

/* EV-MAT-09 밤에 붙는 입 — a pleco rasps the slime of slow goldfish, both sides
   [출처: 플레코·이끼 먹는 메기류가 느린 금붕어·디스커스의 점액을 먹는 사례] */
function mat_09fail(){
  const cold=season()==='winter'&&!S.f.heater;
  if(cold)return {t:'추운 밤이라 붙은 입은 금방 떨어졌습니다. 옆구리가 조금 쓸렸습니다.',c:'bad',fx:{h:-4}};
  if(isSp('comet'))return {t:'{n}은 몸을 한 번 튕겨 붙은 것을 떼어 냈습니다.',fx:{h:-2}};
  const k=mat_hit('mat_09');
  if(k>=(isSp('oranda')?2:3))return {end:'MAT-09-D'};
  return {t:'아침에 {n}의 옆구리에 비늘이 빠진 둥근 붉은 자국이 하나 있었습니다.',c:'bad',fx:{h:-10,st:.1},sick:k>=2&&R()<.3?'aero':null,
    run:()=>{if(isKind('learner','expert'))mat_learn('pleco','주인은 "플레코는 열대어, 금붕어와 따로"라는 글을 읽고 플레코를 옮겼습니다.');
      else if(isKind('grandma')&&R()<.3)mat_part('pleco','주말에 온 손주가 검색을 해 주었습니다. 할머니는 플레코를 수족관에 돌려보냈습니다.');
      else if(isKind('casual')&&R()<.4)addLog(T('주인은 {n}의 상처를 병인 줄 알고 약을 넣었습니다.'),'bad')}};
}
fev([{id:'MAT-09',tier:'fact',sp:['oranda','ryukin','comet','pleco'],own:['eager','casual','gift','shared','grandma'],need:{mate_sp:['pleco','oranda','ryukin','comet']},
  when:()=>isSp('pleco')?mat_SLOW.concat('comet').includes(fl('mate_sp')):fl('mate_sp')==='pleco',cd:16,w:()=>isSp('comet')?.4:1,
  p:()=>isSp('pleco')?'붙어 있던 초록 이끼가 더 이상 없습니다. 밤이 되자 둥근 몸들이 가운데에 느리게 떠 있습니다. 그 몸 표면에서 미끈한 냄새가 납니다. {n}은…'
    :'밤입니다. {n}은 물 가운데에 떠서 쉽니다. 옆구리에 무언가 납작하고 단단한 것이 달라붙습니다. 그 자리가 쓸리는 느낌이 납니다. {n}은…',
  o:[
   /* the pleco */
   {l:'유목을 갉는다',when:()=>isSp('pleco'),chk:()=>['g',fl('hides')?30:999],lockText:'갉을 유목이 없다',ok:{t:'{n}은 밤새 유목을 갉았습니다. 배가 조금 찼습니다.',c:'good',fx:{g:2,h:3,wq:-3}},no:{t:'유목은 딱딱했습니다. {n}은 배가 고팠습니다.',fx:{h:-3}}},
   {l:'둥근 몸에 붙는다',when:()=>isSp('pleco'),
    ok:()=>({t:'{n}이 금붕어의 옆구리에 입을 붙였습니다. 미끈한 점액이 배를 채웠습니다.',c:'neutral',fx:{h:5},
      run:()=>{if(R()<.4){if(isKind('relay'))fRehome('주인은 금붕어 옆구리의 둥근 상처를 보고 {n}을 당근 나눔에 올렸습니다.');
        else if(isKind('casual')&&R()<.5)q(T('주인은 금붕어 옆구리의 상처를 보고 범인을 찾았습니다. 그날 저녁 {n}은 변기 앞에 있었습니다.'),'bad',()=>fEnd('flushalive'));
        else if(isKind('learner','grandma','gift'))fRehome('주인은 "청소 물고기가 금붕어를 먹는다"며 {n}을 수족관에 돌려보냈습니다.')}}})},
   {l:'바닥에 붙어 가만히 있는다',when:()=>isSp('pleco'),ok:()=>mat_roll('g',30)?{t:'{n}은 바닥에 붙어 밤을 넘겼습니다.',fx:{g:1}}:{t:'먹을 것이 없는 밤이 이어졌습니다. {n}의 배가 안쪽으로 꺼지기 시작했습니다.',c:'bad',fx:{h:-8},add:{thin:1}}},
   /* the goldfish */
   {l:'몸을 크게 흔들어 떼어 낸다',when:()=>!isSp('pleco'),chk:['p',30],ok:{t:'{n}이 몸을 크게 흔들자 붙은 것이 떨어져 바닥으로 내려갔습니다.',c:'good',fx:{p:1}},no:mat_09fail},
   {l:'수면 가까이 올라가 쉰다',when:()=>!isSp('pleco'),chk:['w',25],ok:{t:'{n}은 수면 가까이에서 밤을 보냈습니다. 바닥에 붙어 지내는 그것은 수면까지 올라오지 않았습니다.',c:'good',fx:{w:2}},no:mat_09fail},
   {l:'가만히 떠 있는다',when:()=>!isSp('pleco'),ok:()=>mat_roll('g',15)?{t:'그날 밤은 아무것도 붙지 않았습니다.',fx:{g:1}}:mat_09fail()}
  ]}]);

/* =====================================================================================
   서열·괴롭힘
   ===================================================================================== */

/* EV-MAT-10 칸막이가 사라진 날 — two male bettas [출처: 베타 스플렌덴스 수컷 간 공격성] [출처: 구강포란 야생 베타 수컷 간 입 맞물기] */
const mat_10split=()=>{if(mat_learns(isKind('breakup')?-.1:0))mat_partSame(isKind('eager')?'주인은 칸막이를 다시 넣었습니다. 투명한 칸막이였습니다.':'주인은 두 수컷을 다른 수조로 나눴습니다.')};
function mat_10fail(){
  if(isSp('wildbetta'))return {t:'두 수컷이 입을 맞물고 한참 밀어냈습니다. 먼저 입을 놓은 것은 {n}이었습니다. {n}은 그 뒤로 수조 구석에서 지냈습니다.',c:'bad',fx:{h:-6,st:.15},set:{subordinate:1},run:mat_10split};
  if(R()<.5)return {end:'MAT-10-D'};
  return {t:'저녁에 주인이 둘을 발견해 떼어 놓았습니다. {n}의 꼬리지느러미는 기조 사이로 갈라져 있었고, 한쪽 눈에 하얀 줄이 생겨 있었습니다.',c:'bad',fx:{fin:.35,h:-15,st:.2},sick:R()<.4?'finrot':null,
    run:()=>mat_partSame()};
}
fev([{id:'MAT-10',tier:'fact',sp:['betta','wildbetta'],own:['breakup','eager','gift','casual','unbox','learner','expert'],need:{rival:1},when:()=>!fem(),cd:16,
  w:()=>isKind('breakup')?4:1.2,
  p:'투명한 칸막이가 사라졌습니다. 맞은편의 붉은 수컷이 아가미 뚜껑을 펼치고 몸을 비스듬히 세웁니다. {n}의 지느러미가 저절로 펴지고 몸 색이 짙어집니다. {n}은…',
  o:[
   {l:'몸을 크게 펼치고 마주 선다',chk:['p',45],
    ok:{t:'{n}이 상대의 옆구리를 물어 비늘 몇 장을 뜯어 냈습니다. 상대가 수초 뒤로 물러났습니다. {n}의 지느러미도 군데군데 찢겨 있었습니다.',c:'neutral',fx:{p:2,fin:.15},sick:R()<.25?'finrot':null,run:mat_10split,near:'hides'},
    no:mat_10fail},
   {l:'수조 반대편 수초 뒤로 물러난다',chk:()=>['w',tankL()>=40&&S.f.hides?25:35],
    ok:()=>({t:'{n}은 수초 뒤로 들어갔습니다. 상대는 그날 더 쫓아오지 않았습니다.',c:'good',fx:{w:2},run:()=>{if(tankL()<20)S.cd['evMAT-10']=S.tick+6;else mat_10split()}}),
    no:mat_10fail},
   {l:'바닥 쪽에서 지느러미를 접고 있는다',ok:()=>mat_roll('g',15)?{t:'상대는 한참 지느러미를 펼치다 지쳐 수면으로 올라갔습니다.',c:'good',fx:{g:1},run:mat_10split}:mat_10fail()}
  ]}]);

/* EV-MAT-11 화려한 꼬리 — a betta among guppies, both sides [출처: 베타–구피 합사 시 공격 사례] */
function mat_11fail(){
  if(fem())return {t:'그 물고기는 {n}의 짧은 꼬리를 지나쳐 갔습니다.',fx:{g:1}};
  if(mat_hit('mat_11')>=2)return {end:'MAT-11-D'};
  return {t:'큰 지느러미의 물고기가 {n}의 꼬리 끝을 물고 머리를 흔들었습니다. 꼬리지느러미 한쪽이 떨어져 나갔습니다.',c:'bad',fx:{fin:.25,st:.12},set:{tail_short:1},
    run:()=>{if(isKind('learner','expert'))mat_learn('betta','주인은 베타를 다른 수조로 옮겼습니다.');else if(isKind('shared'))addLog(T('누군가 수조에 "베타 건들지 마세요"라고 붙였습니다.'),'bad')}};
}
fev([{id:'MAT-11',tier:'fact',sp:['guppy','betta','wildbetta'],own:['eager','gift','shared','decor','breakup','casual'],need:{mate_sp:['betta','guppy']},
  when:()=>isSp('guppy')?fl('mate_sp')==='betta':fl('mate_sp')==='guppy',cd:20,w:()=>isSp('wildbetta')?.3:isSp('guppy')&&fem()?.4:1,
  p:()=>isSp('guppy')?'새로 들어온 큰 지느러미의 물고기가 수조 가운데를 천천히 돕니다. 그 물고기가 {n}의 꼬리를 보자 아가미 뚜껑을 펼칩니다. 그 물고기가 몸을 틀어 {n} 쪽으로 옵니다. {n}은…'
    :'작고 화려한 꼬리들이 {n}의 거품집 근처를 오갑니다. 그중 몇 마리가 {n}의 긴 지느러미 끝을 스치고 지나갑니다. {n}은…',
  o:[
   {l:'다른 구피들 사이로 섞여 들어간다',when:()=>isSp('guppy'),chk:['w',25],ok:{t:'{n}은 다른 구피들 사이에 섞였습니다. 큰 지느러미의 물고기는 {n}을 놓쳤습니다.',c:'good',fx:{w:1}},no:mat_11fail},
   {l:'수면 쪽으로 빠르게 달아난다',when:()=>isSp('guppy'),chk:['p',20],ok:{t:'{n}은 수면을 따라 달아났습니다.',c:'good',fx:{p:1}},no:mat_11fail},
   {l:'수초 뒤에 가만히 있는다',when:()=>isSp('guppy'),ok:()=>mat_roll('g',15)||fem()?{t:'그 물고기는 {n}을 지나쳐 갔습니다.',fx:{g:1}}:mat_11fail()},
   {l:'화려한 꼬리를 쫓아간다',when:()=>!isSp('guppy'),chk:['p',30],
    ok:()=>isSp('wildbetta')?{t:'{n}은 꼬리 대신 수초 사이에 숨어 있던 구피 새끼들을 하나씩 삼켰습니다.',c:'neutral',fx:{p:1,h:2}}
      :{t:'{n}이 구피 수컷의 꼬리를 물어뜯었습니다. 꼬리 조각이 수면에 떴습니다.',c:'neutral',fx:{p:2},
        run:()=>{if(isKind('casual','relay','gift')&&R()<.35)fRehome('주인은 {n}을 "사나운 물고기"라며 당근에 올렸습니다.');
          else if(isKind('learner','expert','breakup')&&mat_learns()){mat_part('guppy','주인은 {n}을 혼자 지내는 작은 수조로 옮겼습니다.')}}},
    no:{t:'구피들은 {n}보다 빨랐습니다.'}},
   {l:'거품집 아래에 머문다',when:()=>!isSp('guppy'),chk:['g',25],ok:{t:'구피들은 거품집 근처를 몇 번 오가다 흩어졌습니다.',fx:{g:1}},
    no:{t:'구피 몇 마리가 {n}의 긴 지느러미 끝을 쪼았습니다. 끝이 갈라졌습니다.',c:'bad',fx:{fin:.12}}},
   {l:'수초 잎 위에서 쉰다',when:()=>!isSp('guppy'),ok:()=>(S.f.mates.find(m=>m.id==='guppy')||{n:0}).n>=6&&!mat_roll('g',15)?{t:'잎 위에서 쉬는 {n}의 지느러미를 구피들이 번갈아 쪼았습니다.',c:'bad',fx:{fin:.12}}:{t:'{n}은 잎 위에서 쉬었습니다.',fx:{g:1}}}
  ]}]);

/* EV-MAT-12 굴 하나, 수컷 둘 — apistogramma males and one cave [출처: 아피스토그라마 수컷 영역성] */
function mat_12fail(){
  if(fl('subordinate')&&tankL()<60&&R()<.6)return {end:'MAT-12-D'};
  return {t:'굴을 차지한 수컷이 {n}을 수조 끝까지 쫓아갔습니다. {n}의 몸 색이 옅어졌습니다.',c:'bad',fx:{h:-8,st:.15},set:{subordinate:1},
    run:()=>{if(isKind('breeder','expert')&&mat_learns())mat_partSame('주인은 수컷 한 마리를 다른 수조로 옮겼습니다.');else if(isKind('eager'))addLog(T('주인은 굴을 하나 더 넣었습니다. 수조는 그대로였습니다.'),'bad')}};
}
fev([{id:'MAT-12',tier:'fact',sp:['apisto'],own:['breeder','eager','learner','expert'],need:{rival:1},when:()=>!fem(),cd:18,
  p:'수조 구석의 코코넛 껍질 굴 앞에서 {n}의 등지느러미가 저절로 섭니다. 맞은편에서 같은 무늬의 다른 수컷이 같은 굴을 향해 다가옵니다. 그 수컷의 몸 옆 검은 줄이 짙어집니다. {n}은…',
  o:[
   {l:'굴 앞에서 몸을 옆으로 세우고 입을 벌린다',chk:['p',30],ok:{t:'상대가 먼저 몸을 돌렸습니다. 굴은 {n}의 것이 되었습니다.',c:'good',fx:{p:2},set:{territory:1,subordinate:0}},no:mat_12fail},
   {l:'수조 다른 구석에 자기 자리를 만든다',chk:['w',40],ok:()=>tankL()>=60?{t:'{n}은 반대편 유목 아래에 자리를 잡았습니다. 두 수컷은 서로의 구석을 넘지 않았습니다.',c:'good',fx:{w:2}}:mat_12fail(),no:mat_12fail},
   {l:'수초 뒤에서 가만히 있는다',ok:()=>mat_roll('g',15)?{t:'상대는 굴로 들어갔고, {n}은 수초 뒤에서 하루를 보냈습니다.',fx:{g:1}}:mat_12fail()}
  ]}]);
fev([{id:'MAT-12B',tier:'likely',sp:['cory','neon'],need:{mate_sp:'apisto'},cd:30,w:.6,
  p:'수조 구석의 굴 앞을 지나갈 때마다 작은 물고기 하나가 등지느러미를 세우고 튀어나옵니다. {n}은…',
  o:[
   {l:'굴 앞을 빠르게 지나간다',chk:['p',20],ok:{t:'{n}은 굴 앞을 빠르게 지나갔습니다.',fx:{p:1}},no:{t:'{n}은 굴 앞을 지날 때마다 쫓겼습니다.',c:'bad',fx:{g:-2,st:.06}}},
   {l:'굴에서 먼 쪽 바닥에서 지낸다',ok:{t:'{n}은 굴에서 먼 쪽에서 지냈습니다. 그쪽 바닥에는 먹이가 덜 떨어졌습니다.',fx:{h:-2}}}
  ]}]);

/* EV-MAT-13 혼자 누운 물고기 — one clown loach "as an accent" [출처: 클라운 로치 군집성, 스트레스와 백점병 감수성] */
function mat_13fail(){
  const k=mat_hit('mat_13');
  if(k>=2||(fl('playdead')&&k>=1&&R()<.5))return {end:'MAT-13-D'};
  return {t:'{n}은 며칠째 유목 틈에서 나오지 않았습니다. 몸에 흰 점이 하나둘 생겼습니다.',c:'bad',fx:{st:.2,h:-6},sick:'ich',
    run:()=>{if(isKind('learner','expert')&&mat_learns()){mat_add('clownloach',4);setFl('lone',0);addLog(T('주인은 "클라운 로치는 다섯 마리 이상"이라는 글을 읽고 네 마리를 더 사 왔습니다.'),'good');if(R()<.4&&!S.f.ill)fSick('ich')}}};
}
fev([{id:'MAT-13',tier:'fact',sp:['clownloach'],own:['casual','gift','decor','eager','content'],need:{lone:1},cd:22,
  p:'수조에 같은 무늬의 물고기가 하나도 없습니다. {n}은 하루 대부분을 유목 틈에 들어가 지냅니다. 먹이가 떨어져도 바로 나가지 않습니다. {n}은…',
  o:[
   {l:'다른 종 무리 옆에 붙어 다닌다',chk:['c',40],ok:{t:'{n}은 다른 물고기 무리 끝에 붙어 다녔습니다. 무리는 {n}을 쫓아내지 않았습니다.',c:'good',fx:{c:2,st:-.08}},no:mat_13fail},
   {l:'불이 꺼진 뒤에만 나와 먹는다',chk:['w',30],ok:{t:'{n}은 밤마다 바닥에 남은 먹이를 찾아 먹었습니다.',c:'good',fx:{w:1,h:2}},no:mat_13fail},
   {l:'유목 틈에 계속 있는다',ok:()=>mat_roll('g',15)?{t:'{n}은 유목 틈에서 버텼습니다.',fx:{g:1}}:mat_13fail()}
  ]}]);

/* EV-MAT-14 마지막 네온 [출처: 네온테트라 스트레스 시 체색 변화] [출처: 네온테트라 군영 권장 개체 수] */
function mat_14fail(){
  if(mat_hit('mat_14')>=2)return {end:'MAT-14-D'};
  return {t:'{n}의 파란 줄이 낮에도 흐렸습니다. 먹이 시간을 몇 번 놓쳤습니다.',c:'bad',fx:{h:-6,st:.12},add:{thin:1},
    run:()=>{if(isKind('learner','expert')&&mat_learns()){mat_add('neon',6);setFl('lone',0);addLog(T('주인은 네온테트라 여섯 마리를 더 사 왔습니다.'),'good');if(R()<.2&&!S.f.ill)fSick('neond')}
      else if(isKind('decor'))addLog(T('주인은 파란색 물고기 몇 마리를 사 와 숫자를 맞췄습니다. 네온은 아니었습니다.'),'bad')}};
}
fev([{id:'MAT-14',tier:'fact',sp:['neon'],own:['casual','shared','gift','eager','decor'],need:{lone:1},cd:20,
  p:'처음에는 일곱 마리였습니다. 지금 수조에서 파랗고 빨간 줄을 가진 것은 {n}뿐입니다. {n}은 다른 종 무리의 끝에 붙어 헤엄치다가 쫓겨납니다. {n}은…',
  o:[
   {l:'다른 작은 물고기 무리를 계속 따라다닌다',chk:['c',40],ok:{t:'{n}은 구피 무리에 섞여 헤엄쳤습니다. 몸 색이 조금 돌아왔습니다.',c:'good',fx:{c:2,st:-.08}},no:{t:'무리 끝의 한 마리가 돌아서서 {n}의 지느러미를 물었습니다.',c:'bad',fx:{fin:.12,st:.05}}},
   {l:'수초 깊숙이 들어가 지낸다',chk:['w',30],ok:{t:'{n}은 수초 깊숙한 곳에서 지냈습니다. 대신 먹이 시간을 놓쳤습니다.',fx:{w:1,h:-2}},no:mat_14fail},
   {l:'수조 구석 바닥 가까이에 머문다',ok:()=>mat_roll('g',15)?{t:'{n}은 구석에서 버텼습니다.',fx:{g:1}}:mat_14fail()}
  ]}]);

/* EV-MAT-15 청소부라고 불린 물고기 [출처: 코리도라스가 '청소부'가 아니라 별도 급여가 필요하다는 사육 문헌] */
function mat_15fail(){
  if(mat_hit('mat_15')>=2)return {end:'MAT-15-D'};
  return {t:'바닥까지 내려온 먹이는 부스러기 몇 개였습니다. {n}의 배가 홀쭉해졌습니다.',c:'bad',fx:{h:-7},add:{thin:1},
    run:()=>{if(isKind('learner','expert')&&mat_learns()){setFl('learned_sinking',1);mat_add('cory',5);setFl('lone',0);addLog(T('주인은 가라앉는 사료를 사 오고, 코리도라스 다섯 마리를 더 들였습니다.'),'good')}
      else if(isKind('grandma')&&R()<.3){setFl('learned_sinking',1);addLog(T('주말에 온 손주가 "얘는 바닥 먹이를 줘야 해"라고 알려 주었습니다.'),'good')}}};
}
fev([{id:'MAT-15',tier:'fact',sp:['cory'],own:['casual','eager','gift','shared','grandma'],need:{lone:1,learned_sinking:0},cd:20,
  p:'수면에 뜬 사료는 위쪽 물고기들이 다 먹습니다. 바닥까지 내려오는 것은 부스러기 몇 개뿐입니다. 같은 무늬의 물고기는 어디에도 없습니다. {n}은…',
  o:[
   {l:'수면까지 올라가 사료를 낚아챈다',chk:()=>['p',fl('lone')?25:15],ok:{t:'{n}이 수면까지 올라가 사료 한 알을 물고 내려왔습니다.',c:'good',fx:{p:1,h:3}},no:{t:'{n}은 위쪽 물고기들에게 밀려 바닥으로 돌아왔습니다.',fx:{h:-2}}},
   {l:'수염으로 바닥 구석구석을 뒤진다',chk:['w',35],ok:()=>({t:'{n}은 바닥 구석에서 부스러기를 찾아냈습니다.',c:'good',fx:{w:2,h:2,...(fl('gravel_sharp')?{h:-3}:{})}}),no:mat_15fail},
   {l:'유목 아래에 가만히 있는다',ok:()=>mat_roll('g',15)?{t:'{n}은 유목 아래에서 하루를 버텼습니다.',fx:{g:1}}:mat_15fail()}
  ]}]);

/* EV-MAT-16 모래 속의 꼬리 — a hand in the sand above a stingray
   [출처: 담수 가오리 자상 응급처치(온수 침수)] [출처: 담수 가오리 독침 자연 탈락·재생, 자상 증상] */
function mat_16cut(){setFl('barb_cut',1);
  if(mat_roll('g',35))return {t:'잘린 자리의 피부가 하얗게 들떴다가, 몇 주에 걸쳐 아물었습니다.',c:'bad',fx:{h:-25,st:.2}};
  return {end:'MAT-16-D'};
}
function mat_16sting(){setFl('sting_owner',1);
  const base={t:'꼬리가 휘었습니다. 독침이 주인의 손등에 박혔습니다. 주인이 비명을 지르며 손을 뺐습니다.',c:'bad'};
  if(isKind('expert','staff'))return {...base,run:()=>{setFl('learned_gloves',1);addLog(T('주인은 뜨거운 물에 손을 담근 뒤 병원에 갔습니다. 다음부터 모래는 집게와 장갑으로만 만졌습니다.'),'good')}};
  if(isKind('learner','techbro','grandma'))return {...base,run:()=>{if(mat_learns(.1)){setFl('learned_gloves',1);addLog(T('주인은 병원에 다녀와 커뮤니티에 글을 올렸고, 다음 날 긴 장갑을 샀습니다.'),'good')}}};
  if(isKind('relay'))return {...base,run:()=>fRehome('"독 있는 가오리 무료 나눔" 글이 올라왔습니다.')};
  if(isKind('release'))return {...base,run:()=>fRelease()};
  if(isKind('content','unbox'))return {...base,fx:{i:.1},run:()=>{addLog(T('주인은 부은 손을 찍어 올렸습니다. 다음 영상의 제목은 "가오리 독침 제거"였습니다.'),'bad');const o=mat_16cut();q(T('주인이 손톱깎이를 들고 카메라를 켰습니다.'),'bad',()=>fevOut(o))}};
  return {...base,fx:{i:-.08},run:()=>{const o=mat_16cut();q(T('"또 쏘이면 안 되니까." 주인이 손톱깎이를 들고 왔습니다.'),'bad',()=>fevOut(o))}};
}
fev([{id:'MAT-16',tier:'fact',sp:['motoro'],need:{sandbed:1,barb_cut:0,learned_gloves:0},cd:25,w:()=>isKind('casual','eager','content','unbox')?1.5:1,
  p:'주인의 손이 모래 위를 더듬으며 다가옵니다. {n}은 모래 속에 몸을 묻고 눈만 내놓고 있습니다. 손가락 끝이 {n}의 등 가장자리에 닿습니다. {n}은…',
  o:[
   {l:'모래를 털고 미끄러지듯 빠져나간다',chk:['p',40],ok:{t:'{n}은 모래를 털며 미끄러져 나갔습니다. 손은 빈 모래를 쓸었습니다.',c:'good',fx:{p:1}},no:mat_16sting},
   {l:'꼬리를 등 위로 휘어 올린다',ok:mat_16sting},
   {l:'모래 속에서 움직이지 않는다',ok:()=>mat_roll('g',20)?(fst().g>=50&&R()<.3?{end:'MAT-16-H'}:{t:'손은 {n}의 등 위를 지나갔습니다. 아무 일도 없었습니다.',fx:{g:1}}):mat_16sting()}
  ]}]);

/* EV-MAT-17 너무 커진 몸 — "안 받아요?" [출처: 공공 아쿠아리움 대형 관상어 기증 거절 사례, 종별 성체 크기]
   [출처: 국내 생태계교란종 지정(앨리게이터 가아) 및 방류 금지] */
function mat_17big(){const t=TANKS.find(t=>t.k!=='pond'&&t.L>=fx_().minL)||TANKS.find(t=>t.k==='t240');S.f.tank=isSp('koi')&&R()<.5?'pond':t.k;setFl('cramped',0);S.f.outgrown=0}
function mat_17fate(){
  if(isSp('gar')&&(isKind('release')||R()<.6))return {t:'수족관도, 아쿠아리움도 {n}을 받지 않았습니다. 주인은 밤에 {n}을 큰 통에 담아 차에 실었습니다.',c:'bad',run:()=>fRelease()};
  if(isKind('release'))return {t:'주인은 "넓은 데서 살라"며 {n}을 강으로 데려갔습니다.',c:'bad',run:()=>fRelease()};
  if(isKind('expert','learner','content','staff')&&R()<.6)return {t:isKind('content')?'주인은 "1,000L 수조 만들기" 영상을 찍기 시작했습니다. 새 수조가 들어왔습니다.':'주인은 거실 한쪽을 비우고 큰 수조를 들였습니다.',c:'good',fx:{st:-.1,i:.08},run:mat_17big};
  if(isSp('koi')&&R()<.4)return {t:'{n}은 마당에 연못이 있는 집으로 갔습니다.',c:'neutral',run:()=>fRehome('주인은 {n}을 연못 있는 집에 분양했습니다.',{tank:'pond',own:'gift'})};
  if(isSp('channa','bichir'))return {t:'몸을 돌릴 자리가 없는 밤마다 {n}은 뚜껑 가장자리를 주둥이로 밀었습니다.',c:'bad',fx:{h:-6},add:{escapey:1}};
  if(R()<.45)return {end:'MAT-17-D'};
  return {t:'"원래 손가락만 했는데요." 주인은 {n}의 사진을 당근 나눔에 올렸습니다.',c:'bad',run:()=>fRehome('{n}은 당근 나눔 글과 함께 다음 집으로 갔습니다.')};
}
fev([{id:'MAT-17',tier:'fact',sp:['oscar','arowana','gar','pleco','channa','koi','motoro','bichir'],own:['casual','eager','gift','content','relay','decor','release','learner'],
  need:{cramped:1},cd:30,w:()=>(isSp('gar')?2:isSp('arowana')?1.5:1)*(fl('growfast')?1.5:1),
  p:'{n}이 몸을 돌리면 꼬리가 유리에 닿습니다. 주인이 수조 앞에서 휴대폰으로 "대형어 분양"을 검색합니다. 수족관에 전화하는 목소리가 들립니다. "안 받아요?" {n}은…',
  o:[
   {l:'주인 손가락을 따라 유리 앞을 오간다',chk:['c',60],
    ok:()=>isKind('expert','learner','content','staff','grandma','gift')?{t:'주인은 유리 앞의 {n}을 한참 보다가 휴대폰을 내려놓았습니다. 일주일 뒤 큰 수조가 들어왔습니다.',c:'good',fx:{c:2,st:-.1},run:mat_17big}
      :{t:'사진 속 {n}이 예뻤습니다. 대형어 동호회의 한 회원이 데려가겠다고 연락해 왔습니다.',c:'good',run:()=>fRehome('{n}은 대형어 동호회 회원의 집으로 갔습니다.',{own:'expert'})},
    no:mat_17fate},
   {l:'몸을 접고 구석에서 지낸다',chk:['g',40],ok:{t:'주인은 결정을 미뤘습니다. {n}은 몸을 접은 채 한 계절을 더 지냈습니다.',fx:{g:1},run:()=>{S.cd['evMAT-17']=S.tick+12}},
    no:{t:'몸을 돌릴 때마다 주둥이와 꼬리가 유리에 쓸렸습니다. 주둥이 끝 피부가 벗겨졌습니다.',c:'bad',fx:{h:-10,st:.1},set:{stunted:1}}},
   {l:'바닥에 가만히 있는다',ok:mat_17fate}
  ]}]);

/* EV-MAT-18 같은 종 두 마리 [출처: 대형 시클리드 짝 형성 후 공격성] [출처: 블랙 고스트 동종 영역성, 실버 아로와나 동종 공격] */
const mat_18calm=()=>fbOf(S.sp.id).terr<.2&&fbOf(S.sp.id).hostile<.2;
function mat_18fail(){
  if(isSp('clownloach'))return {t:'두 로치는 딸깍거리는 소리를 내며 서로 밀쳐 냈습니다. 그러고는 같은 유목 아래에 나란히 누웠습니다.',c:'good',fx:{st:-.08},set:{subordinate:0}};
  if(mat_18calm())return {t:'새로 온 물고기는 {n} 옆에 자리를 잡았습니다. 싸움은 없었습니다.',c:'good',fx:{g:1,st:-.05}};
  if(fl('subordinate')&&isSp('oscar','arowana','ghost')&&R()<(isSp('oscar')&&fSameCount()>=2?.6:.4))return {end:'MAT-18-D'};
  return {t:isSp('ghost')?'상대가 {n}을 은신관에서 밀어냈습니다. 꼬리 끝을 물렸습니다.':'상대가 {n}의 자리를 차지했습니다. {n}은 위쪽 구석으로 밀려났습니다.',c:'bad',fx:{h:-8,fin:isSp('ghost','arowana')?.12:.05,st:.12},set:{subordinate:1},
    run:()=>{if(isKind('expert')&&mat_learns())mat_partSame('주인은 수조를 칸막이로 나눴습니다.');
      else if(isKind('learner')){setFl('learned_hides',1);S.f.hides=1;addLog(T('주인은 "은신처를 늘리세요"라는 댓글을 보고 유목을 더 넣었습니다.'),'good')}
      else if(isKind('casual')&&R()<.3)fRehome('주인은 맞기만 하는 {n}을 "약한 놈"이라며 분양 보냈습니다.')}};
}
fev([{id:'MAT-18',tier:'fact',notSp:['betta','apisto'],need:{newsame:1},cd:25,
  p:()=>inPond()?'같은 종 한 마리가 새로 들어왔습니다. 그 물고기가 {n}이 늘 쉬던 바위 앞에 멈춥니다. 그 물고기가 몸 색을 짙게 바꿉니다. {n}은…'
    :'같은 종 한 마리가 새로 들어왔습니다. 그 물고기가 {n}이 늘 쉬던 자리 앞에 멈춥니다. 그 물고기가 몸 색을 짙게 바꿉니다. {n}은…',
  o:[
   {l:'쉬던 자리 앞에서 물러서지 않는다',chk:['p',40],
    ok:()=>mat_18calm()?{t:'새로 온 물고기는 {n} 옆에 자리를 잡았습니다. 싸움은 없었습니다.',c:'good',fx:{p:1}}
      :{t:'상대가 먼저 몸을 돌렸습니다. 자리는 {n}의 것으로 남았습니다.',c:'good',fx:{p:2,fin:isSp('arowana')?.1:0},set:{subordinate:0}},
    no:mat_18fail},
   {l:'다른 쉴 자리를 찾는다',chk:()=>['w',fl('learned_hides')?20:30],
    ok:()=>fl('small_tank')&&!mat_18calm()?mat_18fail():{t:'{n}은 다른 자리를 찾았습니다. 둘은 서로의 자리를 넘지 않았습니다.',c:'good',fx:{w:2}},no:mat_18fail},
   {l:'그 자리에서 몸을 낮춘다',ok:()=>mat_18calm()||isSp('clownloach')?mat_18fail():{t:'{n}은 몸을 낮췄습니다. 싸움은 없었습니다. 그날부터 {n}은 그 자리에 가지 않았습니다.',fx:{g:1},set:{subordinate:1}}}
  ]}]);

/* EV-MAT-19 가장 늦게 먹는 금붕어 — single-tail and fancy goldfish in one tank [출처: 외꼬리 금붕어와 팬시 금붕어 혼합 사육 시 먹이 경쟁] */
function mat_19fail(){
  if(mat_hit('mat_19')>=2)return {end:'MAT-19-D'};
  return {t:'이번에도 {n}은 늦었습니다. 몸통이 조금 가늘어졌습니다.',c:'bad',fx:{h:-7},add:{thin:1},
    run:()=>{if(isKind('learner','expert')&&mat_learns()){mat_FAST.forEach(id=>mat_part(id));addLog(T('주인은 "외꼬리와 둥근 금붕어는 따로"라는 글을 읽고 날렵한 금붕어들을 다른 수조로 옮겼습니다.'),'good')}
      else if(isKind('grandma'))addLog(T('"얘가 제일 못 먹네." 할머니는 {n} 앞에만 먹이를 따로 떨어뜨리기 시작했습니다.'),'good')}};
}
fev([{id:'MAT-19',tier:'fact',sp:['oranda','ryukin','comet','koi'],own:['casual','gift','grandma','shared','decor'],need:{goldmix:1},cd:20,
  p:()=>spIn(S.sp.id,mat_SLOW)?'먹이가 수면에 떨어지자 날렵한 몸들이 먼저 치고 올라옵니다. {n}이 수면에 닿았을 때 남은 것은 가라앉는 부스러기 몇 알입니다. 그마저 날렵한 몸이 다시 내려와 가져갑니다. {n}은…'
    :'먹이가 떨어지는 소리가 납니다. 옆에서 둥근 몸이 천천히 위로 올라옵니다. {n}은…',
  o:[
   /* slow */
   {l:'바닥에 가라앉은 부스러기를 뒤진다',when:()=>spIn(S.sp.id,mat_SLOW),chk:()=>['g',isSp('oranda')?45:inPond()?25:35],
    ok:()=>({t:'{n}은 바닥의 부스러기를 하나씩 찾아 먹었습니다.',c:'good',fx:{h:2,g:1},sick:isSp('ryukin')&&R()<.15?'swimb':null}),no:mat_19fail},
   {l:'주인 손가락이 다가오는 쪽으로 먼저 간다',when:()=>spIn(S.sp.id,mat_SLOW),chk:()=>['c',isKind('grandma')?35:50],
    ok:{t:'주인이 손가락 옆에 먹이를 따로 떨어뜨렸습니다. {n}이 먼저 먹었습니다.',c:'good',fx:{c:2,h:2},add:{hands:1}},no:mat_19fail},
   {l:'수초 옆에 가만히 있는다',when:()=>spIn(S.sp.id,mat_SLOW),ok:()=>mat_roll('g',15)?{t:'수초 옆까지 흘러온 부스러기 몇 알이 {n}의 몫이었습니다.',fx:{g:1}}:mat_19fail()},
   /* fast */
   {l:'가장 먼저 수면으로 치고 올라간다',when:()=>!spIn(S.sp.id,mat_SLOW),chk:['p',30],
    ok:()=>({t:'{n}이 가장 먼저 먹이를 삼켰습니다. 둥근 몸이 올라왔을 때 수면에는 아무것도 없었습니다.',c:'neutral',fx:{p:1,fat:.15},add:{growfast:.5},set:tankL()<fx_().minL?{cramped:1}:{}}),
    no:{t:'{n}보다 다른 날렵한 몸이 먼저였습니다.'}},
   {l:'바닥으로 내려가 흘린 것을 먹는다',when:()=>!spIn(S.sp.id,mat_SLOW),chk:['g',20],ok:{t:'{n}이 바닥에서 먹는 동안 둥근 몸이 수면의 먹이를 조금 더 먹었습니다.',c:'good',fx:{g:1}},no:{t:'바닥에는 남은 것이 없었습니다.'}},
   {l:'그 자리에 있는다',when:()=>!spIn(S.sp.id,mat_SLOW),ok:{t:'{n}은 그 자리에서 먹이를 기다렸습니다.',fx:{g:1}}}
  ]}]);

/* EV-MAT-20 불이 켜진 동안의 먹이 — nocturnal fish fed only by day [출처: 블랙 고스트 야행성 급여 권장] */
function mat_20fail(){
  if(isSp('ghost')&&mat_hit('mat_20')>=2)return {end:'MAT-20-D'};
  return {t:'어둠 속 모래 위에는 걸리는 것이 거의 없었습니다. {n}의 몸이 얇아졌습니다.',c:'bad',fx:{h:-6},add:{thin:1,...(isSp('bichir')?{nighthunt:1}:{})},
    run:()=>{if(isKind('learner','expert')&&mat_learns()){setFl('learned_night',1);addLog(T('주인은 불을 끈 뒤에 냉동 먹이를 넣어 주기 시작했습니다.'),'good')}
      else if(isKind('techbro')){setFl('learned_night',1);addFl('gadgets');addLog(T('주인은 자동 급여기를 밤 11시로 설정했습니다. 앱 알림도 켰습니다.'),'good')}}};
}
fev([{id:'MAT-20',tier:'fact',sp:['ghost','bichir','pleco','clownloach'],own:['casual','eager','gift','decor','content','techbro','learner'],need:{others:1,learned_night:0},cd:22,
  w:()=>isSp('ghost')?1.5:(isSp('pleco')&&S.f.hides)||(isSp('clownloach')&&fSameCount()>=3)?.3:.7,
  p:'불이 켜져 있는 동안 {n}은 은신처 안에 있습니다. 먹이는 불이 켜진 동안 떨어지고, 불이 꺼질 무렵에는 남은 것이 없습니다. 어둠 속에서 {n}은 모래 위를 천천히 훑지만 걸리는 것이 거의 없습니다. {n}은…',
  o:[
   {l:'불이 켜져 있어도 먹이 냄새를 따라 밖으로 나간다',chk:['w',50],
    ok:()=>R()<.35?{t:'{n}은 먹이를 찾았습니다. 돌아오는 길에 다른 물고기에게 꼬리 끝을 물렸습니다.',c:'neutral',fx:{h:3,fin:.1}}:{t:'{n}은 낮에 나가 먹이를 찾아 먹었습니다.',c:'good',fx:{w:2,h:3}},no:mat_20fail},
   {l:'불이 꺼진 뒤 모래 틈을 끝까지 뒤진다',chk:()=>['g',isSp('ghost','bichir')?20:30],ok:{t:'{n}은 모래 틈의 부스러기로 버텼습니다.',c:'good',fx:{g:1,h:1}},no:mat_20fail},
   {l:'은신처 안에 가만히 있는다',ok:()=>mat_roll('g',15)?{t:'{n}은 은신처에서 하루를 버텼습니다.',fx:{g:1}}:mat_20fail()}
  ]}]);

/* EV-MAT-21 아직 작을 때 — a young predator dropped into a tank with a big fish [출처: 대형 포식어 성장 속도 비교] */
function mat_21fail(){
  if(R()<.45)return {end:'MAT-21-D'};
  return {t:'큰 물고기의 턱이 {n}의 꼬리자루를 스쳤습니다. {n}은 비늘 몇 장과 지느러미 끝을 남기고 빠져나왔습니다.',c:'bad',fx:{h:-15,fin:.15,st:.2},set:{grudge:1},
    run:()=>{if(isKind('learner','expert')&&mat_learns()){const b=mat_mates().find(m=>m.cm>=S.f.len*2.5);if(b)mat_part(b.id,'주인은 {n}을 따로 지낼 수조로 옮겼습니다.')}}};
}
const mat_21grown=()=>isSp('gar')&&fl('grudge')&&fst().p>=90;
fev([{id:'MAT-21',tier:'fact',sp:['oscar','arowana','gar','channa','bichir'],own:['eager','casual','content','gift'],need:{bigmate:1},when:()=>S.ageM<S.sp.life*.3||mat_21grown(),cd:15,
  p:()=>mat_21grown()?'그때 그 큰 물고기가 지금은 {n}의 절반만 합니다. {n}이 수면 아래에 통나무처럼 떠 있을 때, 그 물고기가 아래를 지나갑니다. {n}은…'
    :'{n}은 손가락 길이밖에 되지 않습니다. 이 수조에는 이미 손바닥보다 큰 물고기가 있습니다. 그 물고기가 {n}이 들어온 봉지 쪽으로 다가옵니다. {n}은…',
  o:[
   {l:'유목 그늘 틈에 붙는다',chk:()=>['w',isSp('channa','bichir')?30:40],ok:()=>mat_21grown()?{end:'MAT-21-H'}:{t:'{n}은 유목 틈에 몸을 붙였습니다. 큰 물고기는 봉지 쪽만 맴돌다 돌아갔습니다.',c:'good',fx:{w:2},set:{grudge:1}},no:mat_21fail},
   {l:'몸을 옆으로 세워 크게 보이게 한다',chk:()=>['p',isSp('arowana')?45:35],ok:()=>mat_21grown()?{end:'MAT-21-H'}:{t:'큰 물고기가 멈칫하고 물러났습니다.',c:'good',fx:{p:2},set:{grudge:1}},no:mat_21fail},
   {l:'바닥에 가만히 있는다',ok:()=>mat_21grown()?{end:'MAT-21-H'}:mat_roll('g',15)?{t:'큰 물고기는 {n}을 지나쳐 갔습니다.',fx:{g:1},set:{grudge:1},run:()=>{if(isSp('gar'))S.cd['evMAT-21']=S.tick+6}}:mat_21fail()}
  ]}]);

/* =====================================================================================
   번식
   ===================================================================================== */

/* EV-MAT-22 다섯 마리 수컷 — livebearer sex ratio, both sides [출처: 구피 수컷 성적 괴롭힘과 권장 성비] */
function mat_22fail(){
  const k=mat_hit('mat_22');
  if(k>=(isSp('platy')?3:2))return {end:'MAT-22-D'};
  return {t:'수컷들은 하루 종일 {n}을 따라다녔습니다. {n}은 먹이를 삼킬 틈이 없었습니다.',c:'bad',fx:{h:-6,g:-3,st:.15},add:{thin:1},set:{gravid:1},
    run:()=>{if(isKind('learner','breeder','expert')&&mat_learns()){setFl('learned_sexratio',1);setFl('skew',0);addLog(T('주인은 수컷 몇 마리를 다른 수조로 옮기고 암컷을 더 들였습니다.'),'good')}}};
}
fev([{id:'MAT-22',tier:'fact',sp:['guppy','platy'],own:['casual','gift','shared','eager','breeder'],need:{males:1,learned_sexratio:0},cd:18,w:()=>fem()?1.4:.8,
  p:()=>fem()?'수컷 다섯 마리가 {n}의 뒤를 번갈아 따라옵니다. {n}이 멈추면 수컷들이 몸을 S자로 구부려 옆에 섭니다. 먹이를 삼키기도 전에 배 뒤쪽에 무언가가 계속 닿습니다. {n}은…'
    :'암컷 한 마리가 수초 옆을 지나갑니다. 다른 수컷 네 마리도 같은 방향으로 몸을 틉니다. {n}은…',
  o:[
   {l:'빽빽한 수초 속으로 들어간다',when:()=>fem(),chk:['w',30],ok:{t:'{n}은 수초 속에서 잠시 쉬었습니다. 수컷들은 들어오지 못했습니다.',c:'good',fx:{w:1,st:-.06},set:{gravid:1}},no:mat_22fail},
   {l:'수면 근처를 계속 헤엄친다',when:()=>fem(),chk:()=>['g',isSp('platy')?35:45],ok:{t:'{n}은 쫓기면서도 버텼습니다.',fx:{g:1},set:{gravid:1}},no:mat_22fail},
   {l:'구석에서 가만히 있는다',when:()=>fem(),ok:()=>mat_roll('g',15)?{t:'수컷들은 한참 뒤 흩어졌습니다.',fx:{g:1},set:{gravid:1}}:mat_22fail()},
   {l:'지느러미를 펼치고 암컷 옆으로 간다',when:()=>!fem(),chk:()=>['c',fl('tail_short')?55:40],ok:{t:'암컷이 {n} 쪽으로 몸을 기울였습니다.',c:'good',fx:{c:1},add:{overpop:1}},no:{t:'짧아진 꼬리로는 다른 수컷들보다 눈에 띄지 않았습니다.'}},
   {l:'다른 수컷을 밀어낸다',when:()=>!fem(),chk:['p',20],ok:{t:'{n}이 다른 수컷을 밀어냈습니다.',c:'good',fx:{p:1}},no:{t:'밀려난 것은 {n}이었습니다.',fx:{st:.05}}},
   {l:'수초 아래에서 쉰다',when:()=>!fem(),ok:{t:'{n}은 수초 아래에서 쉬었습니다.',fx:{st:-.05}}}
  ]}]);

/* EV-MAT-23 한 번의 짝짓기, 여러 번의 출산 [출처: 구피·플래티 암컷 정자 저장과 반복 출산] [출처: 산란통 스트레스와 조산]
   [출처: 구피 임신 기간과 1회 산자수, 생식공 탈출 사례] */
function mat_23birth(t){return {t:t||'{n}은 수초 사이에서 새끼 수십 마리를 낳았습니다.',c:'neutral',fx:{g:isSp('guppy')?-3:-1},add:{births:1,fry_count:30,overpop:1},set:{gravid:R()<.6?1:0},
  run:()=>{if(isKind('learner','expert')&&mat_learns()){setFl('learned_sexsep',1);addLog(T('주인은 암수를 나눠 키우기 시작했습니다.'),'good')}}}}
function mat_23hard(){
  if(!mat_roll('g',15+(fl('births')||0)*3+(isKind('mill')?10:0)))return {end:'MAT-23-D'};
  return mat_23birth('출산이 길어졌습니다. {n}은 몸을 떨며 한 마리씩 새끼를 내보냈고, 끝났을 때는 바닥에 기대어 숨을 몰아쉬었습니다.');
}
fev([{id:'MAT-23',tier:'fact',sp:['guppy','platy'],own:['casual','gift','shared','breeder','mill','eager','learner'],need:{gravid:1,learned_sexsep:0},when:()=>fem(),cd:14,w:()=>isKind('mill')?3:1.2,
  p:'{n}의 배가 다시 네모나게 부풀어 오릅니다. 지난번에 낳은 지 한 달도 되지 않았습니다. 배 뒤쪽의 검은 반점이 짙어지고, 그 안에서 작은 눈들이 비칩니다. {n}은…',
  o:[
   {l:'수초가 빽빽한 구석을 찾아간다',chk:()=>['w',isKind('mill')?40:30],ok:()=>mat_23birth(),no:mat_23hard},
   {l:'평소처럼 수조 가운데를 헤엄친다',chk:()=>['g',isKind('mill')?50:40],ok:()=>mat_23birth(),
    no:()=>({t:'주인이 {n}을 작은 산란통에 넣었습니다. 좁은 통 안에서 {n}은 벽에 몸을 부딪치며 돌았습니다.',c:'bad',fx:{h:-10,st:.2},run:()=>{const o=mat_23hard();q(null,null,()=>fevOut(o))}})},
   {l:'바닥 구석에 가만히 있는다',ok:mat_23hard}
  ]}]);

/* EV-MAT-24 태어나자마자 — a newborn livebearer in the farm pond (origin, the sieve moment) [출처: 난태생어 성어의 치어 포식] */
fev([{id:'MAT-24',stage:'origin',tier:'fact',sp:['guppy','platy'],when:()=>!fl('wild'),once:1,
  p:'{n}은 방금 태어났습니다. 몸이 펴지자마자 지느러미를 젓습니다. 바로 위에서 큰 물고기들이 떨어지는 작은 것들을 하나씩 입에 넣고 있습니다. {n}은…',
  o:[
   {l:'수면의 뜬 수초 뿌리 사이로 올라간다',chk:()=>['w',isSp('platy')?10:15],ok:{t:'{n}은 뜬 수초 뿌리 사이에 몸을 끼웠습니다. 큰 입들은 그 아래를 지나갔습니다.',c:'good',fx:{w:1}},no:{end:'MAT-24-D'}},
   {l:'바닥 자갈 틈으로 내려간다',chk:()=>['g',isSp('platy')?10:15],ok:{t:'{n}은 자갈 틈으로 내려갔습니다. 그 틈은 큰 입이 들어오기에는 좁았습니다.',c:'good',fx:{g:1}},no:{end:'MAT-24-D'}},
   {l:'그 자리에서 움직이지 않는다',ok:()=>mat_roll('g',isSp('platy')?7:10)?{t:'큰 물고기는 {n} 바로 옆의 다른 새끼를 삼키고 지나갔습니다.',fx:{g:1}}:{end:'MAT-24-D'}}
  ]}]);

/* EV-MAT-25 거품집 — the bubble nest, both sexes [출처: 베타 암컷 산란 준비 시 세로 줄무늬] [출처: 베타 번식 시 수컷의 암컷 공격, 산란 후 분리 권장] */
const mat_25ready=()=>!!fl('mat_ready');
function mat_25after(){
  if(isKind('breeder','expert','mill')||fl('learned_remove_female'))return {t:'산란이 끝나자 주인이 바로 {n}을 건져 냈습니다.',c:'good',fx:{st:-.05}};
  if(isSp('wildbetta')&&R()<.4)return {t:'수컷은 {n}을 몇 번 쫓아냈을 뿐이었습니다.',c:'bad',fx:{fin:.1}};
  if(R()<.55)return {end:'MAT-25-D'};
  return {t:'수컷이 {n}을 거품집 아래에서 몰아냈습니다. 지느러미가 찢긴 {n}을 저녁에 주인이 건져 냈습니다.',c:'bad',fx:{fin:.3,h:-12},
    run:()=>{if(isKind('content')&&R()<.4){setFl('learned_remove_female',1);addLog(T('영상에 "암컷 빼세요" 댓글이 수백 개 달렸습니다. 주인은 다음엔 빼겠다고 답했습니다.'),'sub')}}};
}
fev([{id:'MAT-25',tier:'fact',sp:['betta','wildbetta'],own:['breeder','eager','content','mill','breakup','expert'],need:{spawnset:1,brood:0},cd:30,w:()=>isKind('breeder','mill')?3:1,
  p:()=>{setFl('mat_ready',R()<.5?1:0);
    return fem()?'커다란 지느러미의 수컷이 몸을 펼치고 수면의 거품 아래로 갑니다. 수컷이 돌아볼 때마다 {n} 쪽으로 다가옵니다. {n}은…'
      :'수면 한쪽에 {n}이 만든 거품이 손바닥만큼 모였습니다. 주인이 작은 컵을 기울여 다른 베타 한 마리를 넣습니다. 그 물고기의 몸에 '+(mat_25ready()?'세로 줄무늬가 짙게':'가로 줄무늬가 희미하게')+' 떠 있습니다. {n}은…'},
  o:[
   /* male */
   {l:'지느러미를 펼치고 거품집 쪽으로 이끈다',when:()=>!fem(),chk:['c',50],
    ok:()=>mat_25ready()?{t:'암컷이 {n}을 따라 거품 아래로 왔습니다. {n}이 몸을 감자 하얀 알이 떨어지기 시작했습니다.',c:'good',fx:{c:2},set:{brood:'eggs'}}
      :{t:'암컷은 따라오지 않았습니다. {n}이 암컷을 쫓아가 지느러미를 물었습니다. 주인이 암컷을 건져 냈습니다.',c:'bad',fx:{st:.08}},
    no:{t:'암컷은 수초 뒤에서 나오지 않았습니다.'}},
   {l:'거품집 아래에서 거품만 계속 보탠다',when:()=>!fem(),chk:['g',30],
    ok:()=>mat_25ready()?{t:'한참 뒤 암컷이 스스로 거품 아래로 다가왔습니다.',c:'good',fx:{g:1},set:{brood:'eggs'}}:{t:'암컷은 오지 않았습니다. 거품집만 커졌습니다.',fx:{g:1}},
    no:{t:'여과기 물살에 거품집 한쪽이 흩어졌습니다.'}},
   {l:'수초 뒤에서 가만히 있는다',when:()=>!fem(),ok:{t:'아무 일도 없었습니다. 주인이 암컷을 다시 컵으로 떠 갔습니다.'}},
   /* female */
   {l:'수컷을 따라 거품 아래로 간다',when:()=>fem(),chk:['c',40],ok:()=>({t:'{n}은 거품 아래에서 알을 낳았습니다.',c:'neutral',run:()=>{const o=mat_25after();q(null,null,()=>fevOut(o))}}),no:{t:'수컷이 몸을 돌리자 {n}은 멈칫하고 물러났습니다.'}},
   {l:'수초 뒤로 물러나 지켜본다',when:()=>fem(),chk:['w',35],ok:{t:'{n}은 수초 뒤에서 수컷을 지켜보았습니다. 수컷은 따라오지 않았습니다.',c:'good',fx:{w:1}},no:{t:'수컷이 수초 뒤까지 쫓아와 {n}의 지느러미를 물었습니다.',c:'bad',fx:{fin:.15}}},
   {l:'바닥에 가만히 있는다',when:()=>fem(),ok:()=>mat_roll('g',15)?{t:'수컷은 거품집으로 돌아갔습니다.',fx:{g:1}}:{t:'수컷이 내려와 {n}의 꼬리를 물었습니다.',c:'bad',fx:{fin:.12}}}
  ]}]);

/* EV-MAT-26 거품집 아래의 사흘 [출처: 베타 수컷 부화·보육 기간] [출처: 베타 수컷 알 관리 행동] */
const mat_26hatch=()=>fst().g>=55&&R()<.4?{end:'MAT-26-H'}:{t:'사흘 뒤 거품집 아래에 실 같은 새끼들이 매달렸습니다. {n}은 그동안 거의 먹지 않았습니다.',c:'good',fx:{g:2},set:{brood:'fry'},add:{fry_count:200,overpop:1,thin:1}};
const mat_26loss=()=>({t:'알이 하얗게 흐려지고 곰팡이가 번졌습니다. {n}은 남은 알을 모두 삼켰습니다.',c:'bad',fx:{g:-10},set:{brood:0},add:{thin:1}});
fev([{id:'MAT-26',tier:'fact',sp:['betta','wildbetta'],need:{brood:'eggs'},when:()=>!fem(),cd:10,w:4,
  p:'거품집 아래로 하얀 알 하나가 떨어집니다. {n}은 그 알을 입에 물어 다시 거품 속에 붙입니다. 밤새 같은 일을 반복합니다. 주인이 영상을 찍으려고 수조 조명을 켭니다. {n}은…',
  o:[
   {l:'떨어지는 알을 하나도 빼놓지 않고 다시 올린다',chk:['g',50],ok:mat_26hatch,no:mat_26loss},
   {l:'하얗게 흐려진 알을 골라 삼킨다',chk:()=>['w',isKind('content','unbox')?50:40],ok:mat_26hatch,no:{t:'{n}은 흐려진 알과 함께 멀쩡한 알까지 삼켰습니다. 거품집 아래가 비었습니다.',c:'bad',fx:{g:-5},set:{brood:0}}},
   {l:'거품집 아래에 가만히 떠 있다',ok:()=>mat_roll('g',15+(['hob','canister'].includes(fl('filter'))?15:0))?mat_26hatch():mat_26loss()}
  ]}]);

/* EV-MAT-27 아버지의 입 — a male silver arowana holding fry in the flooded forest (origin, the net moment)
   [출처: 실버 아로와나 수컷 구강 보육 기간과 절식] [출처: A-1' 채집 방식과 동일 출처] */
fev([{id:'MAT-27',stage:'origin',tier:'fact',sp:['arowana'],when:()=>fl('wild')&&!fem(),once:1,
  p:'범람한 숲의 물이 높아졌습니다. {n}의 입 안이 꽉 차 있고, 노른자 주머니를 단 새끼들이 그 안에서 움직입니다. 수면 위로 큰 딱정벌레 한 마리가 떨어집니다. 멀리서 노 젓는 소리가 들립니다. {n}은…',
  o:[
   {l:'입을 다문 채 딱정벌레를 그냥 보낸다',chk:()=>['g',fl('thin')?55:45],ok:{t:'딱정벌레는 물살에 떠내려갔습니다. {n}은 입을 열지 않았습니다. 몇 주째 아무것도 먹지 않은 몸이 얇아졌습니다.',c:'good',fx:{g:2},add:{thin:1}},
    no:{t:'{n}의 입이 저절로 열렸습니다. 새끼들이 입 밖으로 흩어졌습니다. 딱정벌레는 이미 떠내려간 뒤였습니다.',c:'bad',fx:{st:.1}}},
   {l:'물에 잠긴 나무뿌리 사이로 들어간다',chk:()=>['w',fl('thin')?50:40],ok:{t:'노 젓는 소리가 나무뿌리 앞을 지나갔습니다. 며칠 뒤 {n}이 입을 열자 새끼들이 흩어져 나갔고, {n}은 다시 사냥을 시작했습니다.',c:'good',fx:{w:2}},
    no:()=>R()<.5?{end:'MAT-27-D'}:{t:'그물이 나무뿌리에 걸려 찢어졌습니다. 채집꾼들은 욕을 하며 다른 쪽으로 갔습니다.',c:'neutral',fx:{st:.1}}},
   {l:'그 자리에 가만히 떠 있다',ok:()=>mat_roll('g',15)?{t:'노 젓는 소리가 멀어졌습니다.',fx:{g:1}}:{end:'MAT-27-D'}}
  ]}]);

/* EV-MAT-28 무지갯빛 부부 [출처: 레인보우 스네이크헤드 번식 행동 문헌]
   (catalogue: Channa bleheri 부성 구강포란 여부 미확인 → '부모가 함께 치어를 지키는' 형태로 씀) */
function mat_28fight(){
  if(tankL()<fx_().minL&&R()<.5)return {end:'MAT-28-D'};
  return {t:'상대가 {n}을 물었습니다. 둘은 수조를 돌며 한참 싸웠습니다.',c:'bad',fx:{h:-14,st:.15},run:()=>{if(isKind('expert','breeder')&&mat_learns())mat_partSame('주인은 둘을 칸막이로 나눠 서로 보게만 두었습니다.')}};
}
fev([{id:'MAT-28',tier:'likely',sp:['channa'],own:['breeder','expert','content','eager'],need:{pairable:1,pair:0},cd:25,
  p:'수조 안의 다른 스네이크헤드가 {n} 옆에서 몸 색을 짙게 바꿉니다. 둘은 몸을 감듯 나란히 수조를 돕니다. 주인이 수조 뚜껑을 열고 손을 넣어 유목을 옮기려 합니다. {n}은…',
  o:[
   {l:'상대와 나란히 유목 아래를 지킨다',chk:['c',40],ok:{t:'둘은 유목 아래에 나란히 자리를 잡았습니다. 며칠 뒤 수면에 노란 알이 떠올랐고, 둘은 번갈아 그 아래를 지켰습니다.',c:'good',fx:{c:2},set:{pair:1,brood:'fry'},add:{fry_count:100,thin:1}},no:mat_28fight},
   {l:'수조에 들어온 손을 향해 돌진한다',chk:['p',40],
    ok:()=>({t:'{n}이 주인의 손가락을 물었습니다. 피가 물에 번졌습니다.',c:'neutral',fx:{p:1},
      run:()=>{if(isKind('expert','breeder'))addLog(T('주인은 웃으며 손가락에 반창고를 붙였습니다.'),'sub');
        else if(isKind('content','unbox')){S.interest+=.1;addFl('viral');addLog(T('주인은 물린 손가락 영상을 올렸습니다. 조회수가 올랐습니다.'),'sub')}
        else if(R()<.5)fRehome('주인은 "사람 무는 물고기"라며 {n}을 분양 보냈습니다.')}}),
    no:{t:'손은 {n}이 닿기 전에 빠져나갔습니다.'}},
   {l:'바닥 구석에 가만히 있는다',ok:{t:'아무 일도 없었습니다.',fx:{g:1}}}
  ]}]);

/* EV-MAT-29 야생 베타의 입 [출처: 구강포란 베타의 스트레스성 알 삼킴] [출처: Betta pugnax 계열 구강포란 기간] */
const mat_29free=()=>fst().g>=55&&R()<.5?{end:'MAT-29-H'}:{t:'며칠 뒤 {n}이 입을 열자 작은 새끼 수십 마리가 쏟아져 나왔습니다.',c:'good',fx:{g:2},set:{brood:0},add:{fry_count:40,thin:1}};
const mat_29lost=()=>({t:'{n}이 입안의 알을 삼켜 버렸습니다.',c:'bad',fx:{g:-5},set:{brood:0},add:{mat_29:1},
  run:()=>{if(fl('mat_29')>=2&&isKind('breeder'))fRehome('주인은 {n}을 "번식 못 하는 개체"로 분양 보냈습니다.')}});
fev([{id:'MAT-29',tier:'fact',sp:['wildbetta'],need:{brood:'mouth'},when:()=>!fem(),cd:8,w:4,
  p:'{n}의 턱 아래가 둥글게 부풀어 있습니다. 며칠째 먹이가 떨어져도 입을 열지 않습니다. 오늘 주인이 수조 앞에 얼굴을 바짝 대고 휴대폰 플래시를 켭니다. {n}은…',
  o:[
   {l:'유목 뒤 어두운 곳으로 천천히 들어간다',chk:()=>['w',fl('learned_nodisturb')?25:40],ok:()=>({...mat_29free(),run:()=>{if(isKind('expert','breeder')&&mat_learns())setFl('learned_nodisturb',1)}}),no:mat_29lost},
   {l:'입을 꽉 다문 채 그 자리에서 버틴다',chk:()=>['g',fl('thin')?55:45],ok:mat_29free,no:mat_29lost},
   {l:'수조 바닥에 가만히 있는다',ok:()=>mat_roll('g',15)?mat_29free():mat_29lost()}
  ]}]);

/* EV-MAT-30 노란 어미의 굴 [출처: 아피스토그라마 첫 산란 시 알 포식] [출처: 아피스토그라마 암컷 단독 보육과 수컷 축출] */
const mat_30fry=()=>({t:'며칠 뒤 {n}이 새끼 무리를 이끌고 굴 밖으로 나왔습니다.',c:'good',fx:{c:1},set:{brood:'fry'},add:{fry_count:40}});
function mat_30male(){
  if(tankL()<60&&R()<.5)return {end:'MAT-30-D'};
  return {t:'암컷이 {n}을 굴에서 몰아냈습니다. {n}은 수면 가까이에서 지냈습니다.',c:'bad',fx:{h:-8,fin:.08,st:.15},set:{subordinate:1},
    run:()=>{if(isKind('expert','breeder')&&mat_learns())addLog(T('주인은 {n}을 다른 수조로 옮겼습니다.'),'good')}};
}
fev([{id:'MAT-30',tier:'fact',sp:['apisto'],own:['breeder','expert','learner','eager'],need:{brood:'eggs'},cd:12,w:3,
  p:()=>fem()?'{n}의 몸이 노랗게 물들었습니다. 굴 천장에 붉은 알이 줄지어 붙어 있습니다. 굴 입구로 코리도라스 한 마리가 수염을 내밀며 다가옵니다. {n}은…'
    :'노랗게 물든 암컷이 굴 입구에 서 있습니다. {n}이 다가갈 때마다 암컷이 몸을 부딪혀 옵니다. {n}은…',
  o:[
   {l:'굴 밖으로 나가 몸을 부딪혀 쫓아낸다',when:()=>fem(),chk:['p',25],ok:()=>R()<.3?{t:'침입자는 달아났습니다. 그사이 다른 물고기가 굴 안의 알을 먹었습니다.',c:'bad',set:{brood:0}}:mat_30fry(),no:{t:'코리도라스는 꿈쩍하지 않았습니다. 알 몇 개가 사라졌습니다.',c:'bad'}},
   {l:'굴 입구에서 지느러미를 펴고 막아선다',when:()=>fem(),chk:['c',50],ok:()=>({...mat_30fry(),fx:{c:2}}),no:{t:'침입자는 {n}을 지나쳐 굴 안을 훑고 갔습니다.',c:'bad'}},
   {l:'굴 안쪽 알 위에 가만히 떠 있는다',when:()=>fem(),ok:()=>mat_roll('g',30)?mat_30fry():{t:'{n}이 알을 하나씩 먹어 버렸습니다. 처음 낳은 알이었습니다.',c:'bad',set:{brood:0}}},
   {l:'굴 근처로 다시 다가간다',when:()=>!fem(),chk:['p',25],ok:{t:'암컷은 {n}을 굴 앞까지는 들였습니다.',fx:{p:1}},no:mat_30male},
   {l:'수조 반대편 구석에 머문다',when:()=>!fem(),chk:['w',30],ok:{t:'{n}은 반대편 구석에서 지냈습니다. 암컷은 그쪽까지 오지 않았습니다.',c:'good',fx:{w:1}},no:mat_30male},
   {l:'수초 뒤에 가만히 있는다',when:()=>!fem(),ok:()=>mat_roll('g',15)?{t:'암컷은 굴로 돌아갔습니다.',fx:{g:1}}:mat_30male()}
  ]}]);

/* EV-MAT-31 흩뿌려진 알 [출처: 난산(卵散) 어종의 알 포식 습성] */
function mat_31left(){
  if(isSp('neon'))return {t:'남은 알은 며칠 사이 하얗게 곰팡이로 덮였습니다.',set:{spawned:0}};
  if(isSp('cory'))return {t:isKind('breeder','learner','expert')?'주인이 유리에 붙은 알을 발견하고 따로 옮겼습니다.':'유리에 붙은 알은 달팽이와 다른 물고기들이 하나씩 먹었습니다.',set:{spawned:0},add:{fry_count:isKind('breeder','learner','expert')?20:0}};
  if(isSp('comet')&&isKind('casual')&&R()<.4)return {end:'MAT-31-H'};
  return {t:'몇 개의 알이 살아남아 새끼가 되었습니다.',c:'neutral',set:{spawned:0},add:{fry_count:50,overpop:1}};
}
fev([{id:'MAT-31',tier:'likely',sp:['neon','comet','oranda','ryukin','koi','cory'],need:{spawned:1},cd:20,
  p:()=>inPond()?'새벽에 수초와 돌 여기저기에 작고 투명한 알이 붙어 있습니다. 물에서 비린 냄새가 납니다. 다른 물고기들이 알이 붙은 수초를 입으로 훑기 시작합니다. {n}은…'
    :'새벽에 수초와 유리 여기저기에 작고 투명한 알이 붙어 있습니다. 물에서 비린 냄새가 납니다. 다른 물고기들이 알이 붙은 수초를 입으로 훑기 시작합니다. {n}은…',
  o:[
   {l:'함께 수초를 훑어 알을 먹는다',ok:{t:'{n}도 수초를 훑었습니다. 알은 거의 남지 않았습니다.',fx:{h:3},set:{spawned:0}}},
   {l:'알이 붙은 수초에서 멀어진다',chk:['w',25],ok:mat_31left,no:{t:'다른 물고기들이 알을 다 먹었습니다.',set:{spawned:0}}},
   {l:'바닥에 가만히 있는다',ok:()=>mat_roll('g',15)?mat_31left():{t:'알은 하루 만에 사라졌습니다.',set:{spawned:0}}}
  ]}]);

/* EV-MAT-32 봄의 추격 [출처: 금붕어 산란 추격으로 인한 암컷 탈진·부상 사례] [출처: 금붕어 수컷 추성(breeding tubercles)과 백점병 구별] */
function mat_32fail(){
  if(isSp('oranda','ryukin')){if(mat_hit('mat_32')>=2)return {end:'MAT-32-D'};return {t:'추격은 해가 질 때까지 이어졌습니다. {n}은 장식물 모서리에 옆구리를 부딪혀 비늘 몇 장을 잃었습니다.',c:'bad',fx:{h:-12,st:.15},sick:R()<.2?'swimb':null}}
  return {t:inPond()?'{n}은 쫓기다 연못 벽 돌에 옆구리를 쓸렸습니다.':'{n}은 하루 종일 쫓겨 다녔습니다. 옆구리가 장식물에 쓸렸습니다.',c:'bad',fx:{h:-6,st:.1}};
}
const mat_32owner=()=>isKind('alchemist','eager')?{t:'주인은 아가미 뚜껑의 하얀 돌기를 백점병으로 알고 약을 넣었습니다. 비늘이 있는 몸이라 피해는 크지 않았습니다.',c:'bad',fx:{h:-6,st:.08},add:{meds:1}}
  :{t:'{n}은 하루 종일 암컷의 뒤를 따랐습니다.',fx:{st:.03}};
fev([{id:'MAT-32',tier:'fact',sp:['comet','oranda','ryukin','koi'],need:{season:'spring',chase:1},cd:20,w:()=>fem()&&isSp('oranda','ryukin')?1.5:1,
  p:()=>fem()?'물이 조금씩 따뜻해집니다. 아가미 뚜껑과 가슴지느러미에 하얀 좁쌀 같은 돌기가 돋은 물고기들이 {n}의 배 뒤쪽을 주둥이로 밉니다. 아침부터 쉬지 않고 따라옵니다. {n}은…'
    :'물이 조금씩 따뜻해집니다. {n}의 아가미 뚜껑에 하얀 돌기가 돋았습니다. 배가 부푼 물고기 하나가 수초 쪽으로 갑니다. {n}은…',
  o:[
   {l:'수초 덤불 쪽으로 가서 알을 뿌린다',when:()=>fem(),chk:['g',40],ok:{t:'{n}이 수초 덤불에 알을 뿌렸습니다. 추격이 끝났습니다.',c:'good',fx:{g:1},set:{spawned:1}},no:mat_32fail},
   {l:'빠르게 헤엄쳐 떼어 낸다',when:()=>fem(),chk:['p',35],ok:{t:'{n}이 빠르게 빠져나가자 수컷들이 흩어졌습니다.',c:'good',fx:{p:1}},no:mat_32fail},
   {l:'바닥 가까이에 가만히 있는다',when:()=>fem(),ok:()=>mat_roll('g',15)?{t:'수컷들은 한참 뒤 흩어졌습니다.',fx:{g:1}}:mat_32fail()},
   {l:'배가 부푼 물고기를 쫓아간다',when:()=>!fem(),ok:mat_32owner},
   {l:'수초 사이를 맴돈다',when:()=>!fem(),ok:mat_32owner},
   {l:'바닥 가까이에 가만히 있는다',when:()=>!fem(),ok:mat_32owner}
  ]}]);

/* EV-MAT-33 하얀 접시 위의 선별 — fry sorting at the farm (origin, the sieve moment)
   [출처: 팬시 금붕어 치어 선별 도태 관행] [출처: AVMA 안락사 지침 — 사전 마취 없는 냉동의 부적절성, 근친 교배 구피 척추 기형] */
const mat_33cull=()=>({end:R()<.5?'MAT-33-D':'MAT-33-F'});
const mat_33keep=()=>({t:isSp('betta')?'{n}은 "애완용 저가" 칸으로 옮겨졌습니다.':isSp('platy')?'{n}은 마트 판매용 통으로 옮겨졌습니다.':'{n}은 "중간 등급" 통으로 옮겨졌습니다.',c:'neutral',set:isSp('guppy')?{bentback:1}:{}});
fev([{id:'MAT-33',stage:'origin',tier:'fact',sp:['guppy','platy','betta','oranda','ryukin'],when:()=>!fl('wild'),once:1,
  p:()=>'그물이 치어 무리를 한 번에 떠 올립니다. 하얀 접시 위에 쏟아진 치어들 사이로 사람의 눈이 하나씩 훑고 지나갑니다. {n}의 '+(isSp('oranda','ryukin')?'꼬리가 다른 치어보다 한 갈래 적습니다':isSp('guppy')?'등이 조금 휘어 있습니다':isSp('platy')?'무늬가 부모와 다릅니다':'지느러미 끝이 고르지 않습니다')+'. {n}은…',
  o:[
   {l:'접시 위에서 지느러미를 넓게 펼친다',chk:['c',50],ok:mat_33keep,no:mat_33cull},
   {l:'다른 치어들 사이로 파고든다',chk:()=>['w',isSp('oranda','ryukin')?20:25],ok:{t:'선별하는 눈이 {n} 위를 지나갔습니다. 멈추지 않았습니다.',c:'good',fx:{w:1}},no:mat_33cull},
   {l:'접시 물기 위에 그대로 있다',ok:()=>mat_roll('g',10)?{t:'손가락은 {n} 옆의 다른 치어를 집었습니다.',fx:{g:1}}:mat_33cull()}
  ]}]);

/* EV-MAT-34 구피가 너무 많아진 날 [출처: 변기 배출 관상어의 하수 환경(암모니아·황화수소·저산소), 구피 번식력] */
function mat_34caught(){
  if(isKind('relay'))return {t:'주인은 "구피 무료 나눔 50마리" 글을 올렸습니다.',c:'bad',run:()=>fRehome('{n}은 양동이째 다음 집으로 갔습니다.')};
  if(isKind('release'))return {t:'주인은 양동이를 들고 근처 하천으로 갔습니다.',c:'bad',run:()=>fRelease()};
  if(isKind('staff','bait'))return {t:'주인은 양동이째 가게로 가져갔습니다. {n}은 "먹이용" 수조에 들어갔습니다.',c:'bad',run:()=>q(null,null,()=>fEnd('feeder',pick(['oscar','arowana','channa'])))};
  if(isKind('content','unbox'))return {t:'주인은 "구피 무한 증식" 영상을 올리고, 시청자들에게 택배로 팔았습니다.',c:'bad',run:()=>fRehome('{n}은 택배 상자에 담겨 시청자의 집으로 갔습니다.')};
  return {end:'MAT-34-D'};
}
const mat_34thin=()=>{const m=S.f.mates.find(m=>m.id===S.sp.id&&m.n>2);if(m)m.n=Math.ceil(m.n/2);setFl('overpop',0);setFl('crowded',0);S.f.wq=clamp(S.f.wq+8,0,100)};
fev([{id:'MAT-34',tier:'fact',sp:['guppy','platy'],own:['casual','gift','shared','eager','relay','release','content','staff','bait'],need:{crowded:1},cd:20,
  p:'처음에는 세 마리였습니다. 지금은 수면 아래가 작은 몸들로 가득 차 있고, 먹이가 떨어지면 수면 전체가 한꺼번에 흔들립니다. 주인이 그물과 양동이를 들고 옵니다. {n}은…',
  o:[
   {l:'그물을 피해 수초 덩어리 속으로 들어간다',chk:['w',30],ok:{t:'그물은 {n}이 숨은 수초 덩어리를 비켜 갔습니다. 양동이에는 다른 구피들이 담겼습니다.',c:'good',fx:{w:1},run:mat_34thin},no:mat_34caught},
   {l:'그물 가장자리를 따라 빠르게 빠져나간다',chk:()=>['p',isSp('platy')?22:20],ok:{t:'{n}은 그물 가장자리로 빠져나갔습니다.',c:'good',fx:{p:1},run:mat_34thin},no:mat_34caught},
   {l:'그 자리에서 가만히 있는다',ok:()=>mat_roll('g',10)?{t:'그물은 {n} 옆을 지나갔습니다.',fx:{g:1},run:mat_34thin}:mat_34caught()}
  ]}]);

/* EV-MAT-35 바닥에 누운 동료 [출처: Pleistophora hyphessobryconis 전파 경로] [출처: 네온병 감염 사체 섭식 전파] */
function mat_35eat(){
  if(mat_roll('g',40))return {t:'{n}은 별 탈 없이 지나갔습니다.',set:{corpse:0}};
  if(isSp('neon'))return R()<.5?{end:'MAT-35-D'}:{t:'몇 주 뒤 {n}의 파란 줄 아래가 하얗게 흐려지기 시작했습니다.',c:'bad',set:{corpse:0},sick:'neond'};
  if(isSp('@predator'))return {t:'사체와 함께 삼킨 기생충이 {n}의 장에 자리를 잡았습니다.',c:'bad',set:{corpse:0},sick:'worms'};
  return {t:'며칠 뒤 {n}의 입가에 하얀 막이 생겼습니다.',c:'bad',set:{corpse:0},sick:'columnaris'};
}
fev([{id:'MAT-35',tier:'fact',own:['casual','shared','neglect','decor','cult','gift'],need:{corpse:1,learned_remove_dead:0},cd:25,w:()=>isSp('neon')?1.6:1,
  p:()=>isSp('neon')?'바닥에 같은 무늬의 물고기 하나가 옆으로 누워 있습니다. 그 몸의 가운데 줄 아래가 하얗게 바래 있습니다. 다른 물고기들이 그 몸을 조금씩 쪼아 먹기 시작합니다. {n}은…'
    :'바닥에 함께 살던 물고기 하나가 옆으로 누워 있습니다. 며칠째 아무도 건지지 않았습니다. 다른 물고기들이 그 몸을 조금씩 쪼아 먹기 시작합니다. {n}은…',
  o:[
   {l:'함께 다가가 쪼아 먹는다',ok:()=>({...mat_35eat(),fx:{h:3}})},
   {l:'그 근처를 피해 수면 쪽에 머문다',chk:['w',35],ok:{t:'{n}은 수면 쪽에 머물렀습니다. 사체는 사흘 뒤에야 건져졌습니다.',c:'good',fx:{w:1,wq:-5},set:{corpse:0}},no:mat_35eat},
   {l:'수초 사이에 가만히 있는다',ok:()=>({t:'사체가 썩어 물이 비릿해졌습니다.',c:'bad',fx:{wq:-12},set:{corpse:0},
     run:()=>{if(isKind('learner','expert')&&mat_learns()){setFl('learned_remove_dead',1);addLog(T('주인은 그 뒤로 매일 아침 바닥부터 살폈습니다.'),'good')}}})}
  ]}]);

/* =====================================================================================
   노년 — no survival check (old age cannot be dodged); the choice only changes the last scene,
   the life decides whether the end is a calm one (happy) or a bad one
   ===================================================================================== */

/* EV-MAT-36 오래된 금붕어 [출처: 금붕어·비단잉어 사육 수명] [출처: 금붕어 노화 징후(체색 변화·활동 감소)] */
fev([{id:'MAT-36',tier:'fact',sp:['oranda','comet','ryukin','koi'],need:{elder:1},when:()=>!S.f.ill,once:1,w:()=>isKind('grandma','expert','learner','content','shared','gift')?4:2.5,
  p:()=>(isSp('oranda')?'{n}은 주인의 손 그림자를 따라 헤엄칩니다. 머리의 혹이 눈을 거의 덮었습니다. ':'')+'{n}의 몸 색이 몇 해 사이 조금씩 옅어졌습니다. 먹이 시간에 예전보다 천천히 올라옵니다. 오늘은 수면까지 올라오다 중간에서 잠시 쉽니다. {n}은…',
  o:[
   {l:'천천히 수면까지 올라가 먹이를 받는다',chk:()=>['g',isSp('ryukin')?40:30],ok:mat_old('MAT-36','a'),no:mat_old('MAT-36','c')},
   {l:'주인 손가락 쪽으로 다가간다',chk:['c',40],ok:mat_old('MAT-36','b'),no:mat_old('MAT-36','c')},
   {l:'바닥에 가만히 있는다',ok:mat_old('MAT-36','c')}
  ]}]);
/* EV-MAT-37 굽은 등 [출처: 난태생어 노화성 척추 만곡, 어류 마이코박테리아증 감별] [출처: 구피·플래티 평균 수명] */
fev([{id:'MAT-37',tier:'fact',sp:['guppy','platy','neon','cory','peapuffer','apisto','altum'],need:{elder:1},when:()=>!S.f.ill,once:1,w:3,
  p:'{n}의 등이 예전보다 조금 굽어 있습니다. 무리가 수조를 가로지를 때 {n}은 한 박자 늦게 따라갑니다. 먹이는 여전히 먹지만 수면까지 가는 데 오래 걸립니다. {n}은…',
  o:[
   {l:'무리 가장자리에서 끝까지 따라간다',chk:['g',25],ok:mat_old('MAT-37','a'),no:mat_old('MAT-37','c')},
   {l:'수초 잎 위에 올라앉아 쉰다',chk:['w',20],ok:mat_old('MAT-37','b'),no:mat_old('MAT-37','c')},
   {l:'바닥 가까이에 가만히 있는다',ok:mat_old('MAT-37','c')}
  ]}]);
/* EV-MAT-38 잎 위의 베타 [출처: 베타 사육 수명과 노화 징후] */
fev([{id:'MAT-38',tier:'fact',sp:['betta','wildbetta'],need:{elder:1},when:()=>!S.f.ill,once:1,w:()=>isKind('breakup','content','learner')?4:3,
  p:'{n}은 수면 가까이 넓은 잎 위에 몸을 얹고 오래 쉽니다. 지느러미 끝이 예전보다 얇고, 몸 색이 군데군데 옅어졌습니다. 공기를 마시러 올라가는 길이 예전보다 짧아졌는데도 오래 걸립니다. {n}은…',
  o:[
   {l:()=>isSp('wildbetta')?'주인이 다가오면 유목 뒤로 천천히 들어간다':'주인이 다가오면 그래도 지느러미를 펼친다',chk:()=>['c',fl('flare')>=2?60:50],ok:mat_old('MAT-38','a'),no:mat_old('MAT-38','c')},
   {l:'잎 위에서 수면 공기를 마신다',chk:['g',30],ok:mat_old('MAT-38','b'),no:mat_old('MAT-38','c')},
   {l:'바닥 수초 사이에 가만히 있는다',ok:mat_old('MAT-38','c')}
  ]}]);
/* EV-MAT-39 주인보다 오래 [출처: 종별 사육 수명] [출처: 오스카 주인 인식·환경 변화 시 거식] */
fev([{id:'MAT-39',tier:'fact',sp:['oscar','arowana','pleco','koi','gar','bichir','channa','clownloach','motoro'],need:{elder:1,rehomed:1},when:()=>!S.f.ill,once:1,w:3,
  p:()=>inPond()?'연못가에 서는 얼굴이 바뀌었습니다. 새 얼굴은 먹이를 다른 시간에, 다른 방식으로 줍니다. {n}은 예전 사람이 서 있던 물가 쪽에 오래 머뭅니다. {n}은…'
    :'수조 앞에 서는 얼굴이 바뀌었습니다. 새 얼굴은 먹이를 다른 시간에, 다른 방식으로 줍니다. {n}은 예전 사람이 서 있던 자리 쪽 유리에 오래 머뭅니다. {n}은…',
  o:[
   {l:'새 얼굴 쪽으로 다가가 먹이를 받는다',chk:()=>['c',isSp('bichir','channa')?55:50],ok:mat_old('MAT-39','a'),no:mat_old('MAT-39','c')},
   {l:()=>inPond()?'예전 사람이 서 있던 쪽에 머문다':'예전 자리 쪽 유리 앞에 머문다',chk:['w',40],ok:mat_old('MAT-39','b'),no:mat_old('MAT-39','c')},
   {l:'은신처에 가만히 있는다',ok:()=>isSp('gar')&&R()<.35?{t:'새 주인은 {n}을 감당하지 못했습니다. 어느 밤, {n}은 큰 통에 담겨 차에 실렸습니다.',c:'bad',run:()=>fRelease()}:mat_old('MAT-39','c')()}
  ]}]);
/* EV-MAT-40 무리의 마지막 한 마리 [출처: 클라운 로치·코리도라스 사육 수명] */
fev([{id:'MAT-40',tier:'fact',sp:['cory','clownloach','neon'],need:{elder:1,lone:1},when:()=>!S.f.ill,cd:30,w:()=>(isSp('neon')?.4:3)*(isKind('expert','learner','content')?1.4:1),
  p:'같은 날 이 수조에 들어온 무리 중 남은 것은 {n}뿐입니다. 주인은 새 무리를 들일지 한참 망설이다가 그만둡니다. {n}은 무리가 쉬던 유목 아래 자리에 혼자 들어갑니다. {n}은…',
  o:[
   {l:'매일 그 자리에서 쉰다',chk:['g',25],ok:mat_old('MAT-40','a'),no:mat_old('MAT-40','c')},
   {l:'수조를 천천히 한 바퀴씩 돈다',chk:['w',30],ok:mat_old('MAT-40','b'),no:mat_old('MAT-40','c')},
   {l:'은신처에 가만히 있는다',ok:()=>isKind('learner')&&!fl('mat_40_young')&&R()<.35
     ?{t:'주인은 결국 어린 무리를 새로 들였습니다. 어린 것들이 {n}의 자리 옆으로 몰려들었습니다.',c:'good',fx:{st:-.1},set:{mat_40_young:1,lone:0},run:()=>{mat_add(S.sp.id,5);if(R()<.3&&!S.f.ill)fSick(isSp('neon')?'neond':'ich')}}
     :mat_old('MAT-40','c')()}
  ]}]);

/* ---------- endings ---------- */
const mat_v=()=>fl('mat_var')||'c';
fevEnd({
 'MAT-01-D':{kind:'bad',cat:'포식',tier:'fact',fx:'f-eaten',fact:'fTemper',pl:[[3,'다 크면 작은 물고기를 먹는 오스카와 합사']],
   l:['{n}은 수초 사이에서 빠져나와 수면 쪽으로 달아납니다. 오스카가 아가미 뚜껑을 벌리며 입을 앞으로 내밉니다.','물과 함께 {n}이 입 안으로 빨려 들어갑니다. 오스카 목 안쪽의 인두치가 {n}의 몸통을 위아래에서 누릅니다.','늑골이 부러지고 부레가 터집니다. {n}은 오스카의 입 안에서도 꼬리지느러미를 계속 흔듭니다.','오스카가 한 번 더 삼키는 동작을 하자 꼬리지느러미도 보이지 않습니다.']},
 'MAT-01-H':{kind:'happy',cat:'가시 돋친 한 입',tier:'story',fx:'f-rest',
   l:['오스카가 {n}을 삼켰다가 곧 뱉어 냅니다. 오스카는 그날 저녁 먹이를 거부합니다.','{n}은 비늘 대신 있는 골판 몇 장이 긁힌 채 바닥 청소를 계속합니다. 오스카는 그 뒤로 바닥 쪽을 보지 않습니다.','주인은 그날 처음으로 "오스카 합사"를 검색했습니다. 수조에는 네온이 한 마리도 남아 있지 않았습니다.']},
 'MAT-02-D':{kind:'bad',cat:'질식',tier:'fact',fx:'f-bottom',fact:'fTemper',pl:[[2,'가시 있는 메기류와 합사']],
   l:['{n}은 바닥의 코리도라스를 머리부터 입에 넣습니다. 코리도라스가 가슴지느러미 가시와 등지느러미 가시를 세워 고정합니다.','가시가 {n}의 인두 벽에 박힙니다. {n}은 삼키려고 턱을 여러 번 움직이고, 움직일 때마다 가시가 점막을 더 깊이 찢습니다.','코리도라스는 {n}의 입 안에서 아가미로 이어지는 물길을 막은 채 죽습니다.','이틀 뒤 {n}은 입을 다물지 못한 채 아가미 뚜껑을 벌리고 바닥에 누워 있습니다.']},
 'MAT-02-H':{kind:'happy',cat:'합사 성공 후기',tier:'story',fx:'f-rest',
   l:()=>['{n}은 일주일 동안 아무도 먹지 않습니다. 작은 물고기들은 {n}의 그림자 밑을 지나 다닙니다.','주인은 커뮤니티에 "'+S.sp.name+'·네온 합사 성공 후기"를 올립니다. 추천이 수백 개 달립니다.','후기 사진을 다시 찍으러 갔을 때 네온은 두 마리 남아 있었습니다. 주인은 글을 지우지 않았습니다.']},
 'MAT-03-D':{kind:'bad',cat:'포식',tier:'fact',fx:'f-eaten',fact:'fBichir',pl:[[3,'밤에 사냥하는 폴립테루스와 합사']],
   l:['{n}은 수초 잎 아래에서 지느러미를 접고 쉽니다. 폴립테루스의 콧구멍 관이 {n}의 옆구리에 닿습니다.','폴립테루스가 머리를 옆으로 틀며 입을 벌리고, 턱의 작은 이빨들이 {n}의 꼬리자루를 붙잡습니다.','{n}은 몸을 휘어 빠져나가려 합니다. 휠 때마다 이빨이 꼬리자루 근육을 더 깊이 긁습니다.','폴립테루스는 턱을 몇 번 다시 물어 {n}을 머리 쪽으로 돌린 뒤 삼킵니다.','아침에 주인은 한 마리가 줄었다는 것을 알아채지 못합니다.']},
 'MAT-04-D':{kind:'bad',cat:'포식',tier:'fact',fx:'f-eaten',fact:'fArowana',pl:[[3,'수면 사냥하는 대형어와 합사']],
   l:()=>fx_().longfin?['{n}은 공기를 마시러 수면으로 올라갑니다. 은빛 물고기가 아래에서 위로 턱을 엽니다.','{n}의 긴 꼬리지느러미가 먼저 입 안으로 들어갑니다. {n}은 앞으로 헤엄쳐 빠져나가려 하고, 지느러미 기조가 하나씩 부러지며 지느러미막이 찢어집니다.','은빛 물고기가 다시 입을 닫자 몸통이 턱 사이에 들어갑니다.','수면에는 찢어진 지느러미 조각만 떠 있습니다.']
     :['{n}은 수면 가까이 올라갑니다. 은빛 물고기가 아래에서 위로 턱을 엽니다.','{n}의 몸통이 옆으로 물립니다. 이빨이 비늘과 옆구리 근육을 함께 뚫습니다.','{n}은 꼬리를 저어 빠져나가려 하고, 그때마다 근육이 길게 찢어집니다.','은빛 물고기가 머리를 한 번 흔든 뒤 {n}을 삼킵니다. 수면에는 비늘 몇 장만 떠 있습니다.']},
 'MAT-05-D':{kind:'bad',cat:'공격',tier:'fact',fx:'f-bottom',fact:'fChanna',pl:[[3,'스네이크헤드와 합사']],
   l:['스네이크헤드가 유목 아래에서 튀어나와 {n}의 옆구리를 뭅니다. 송곳니 모양의 이빨이 피부와 근육을 함께 뚫습니다.','{n}은 몸을 비틀어 빠져나오고, 빠져나오는 동안 이빨이 근육을 길게 찢습니다. 상처 가장자리의 피부가 벗겨져 하얗게 들뜹니다.','사흘 뒤 상처에 솜 같은 균사가 자랍니다.','{n}은 수조 구석에서 옆으로 기운 채 아가미 뚜껑만 빠르게 움직입니다.']},
 'MAT-06-D':{kind:'bad',cat:'지느러미 뜯김',tier:'fact',fx:'f-nipped',fact:'fPea',pl:[[3,'지느러미 뜯는 복어와 합사']],
   l:['작은 복어들이 번갈아 {n}의 꼬리지느러미 끝을 뭅니다. 부리 같은 이빨이 지느러미막을 반달 모양으로 잘라 냅니다.','{n}은 수초 사이로 숨으려 하지만 늘어진 지느러미가 잎에 걸리고, 걸린 자리를 복어가 다시 뭅니다.','일주일 뒤 지느러미 기조 끝이 드러나고 그 가장자리가 하얗게 짓무릅니다.','짓무름이 꼬리자루까지 번지자 {n}은 바닥에 누워 헤엄치지 않습니다. 복어들은 누워 있는 {n}의 남은 지느러미를 계속 쪼습니다.']},
 'MAT-06-E':{kind:'bad',cat:'공격',tier:'fact',fx:'f-thin',fact:'fPea',pl:[[3,'피퍼퍼 수컷 여럿을 한 수조에']],
   l:['다른 수컷이 정면에서 {n}의 눈을 뭅니다. 각막이 찢기고 눈 안의 젤리 같은 내용물이 흘러나옵니다.','{n}은 남은 눈 쪽으로만 몸을 돌리며 헤엄칩니다. 보이지 않는 쪽에서 다시 물립니다.','먹이가 떨어진 위치를 찾지 못한 {n}은 며칠 사이 배가 납작해집니다.','{n}은 수초 잎 사이에 걸린 채 두 눈 중 하나로만 수면을 봅니다. 아가미 뚜껑이 느려지다 멈춥니다.']},
 'MAT-07-D':{kind:'bad',cat:'염분',tier:'fact',fx:'f-bottom',fact:'fMed',pl:[[2,'기수어와 담수어를 한 수조에']],
   l:['소금이 물에 녹을수록 {n}의 피부 점액이 두꺼워집니다. 점액이 하얗게 엉겨 몸에서 실처럼 늘어집니다.','아가미 새엽의 상피세포가 물속 염분을 처리하느라 부풀어 오릅니다.','{n}은 바닥과 수면을 오가며 숨을 몰아쉽니다. 오르내릴 때마다 들뜬 점액이 떨어져 나가고, 그 아래 피부가 붉게 드러납니다.','사흘째 아침, {n}은 바닥에 배를 대고 아가미 뚜껑을 크게 벌린 채 움직이지 않습니다.']},
 'MAT-08-D':{kind:'bad',cat:'지느러미 뜯김',tier:'fact',fx:'f-nipped',fact:'fTemper',pl:[[3,'지느러미 뜯는 바브와 합사']],
   l:['바브 무리가 지나갈 때마다 {n}의 배지느러미 끝이 한 마디씩 짧아집니다. 잘린 끝의 지느러미 기조가 드러나고, 그 주변 조직이 하얗게 짓무릅니다.','{n}은 수초 사이에 몸을 세우고 버티지만 먹이 시간에도 나오지 않습니다. 몸이 얇아지며 등 쪽 근육이 꺼집니다.','짓무름이 몸통 쪽으로 번지자 {n}은 수초 잎에 기대어 비스듬히 떠 있습니다.','바브 무리는 그 옆을 지나가며 남은 지느러미를 다시 뭅니다.']},
 'MAT-08-H':{kind:'happy',cat:'여섯 대 하나',tier:'story',fx:'f-rest',
   l:['{n}은 매일 아침 지느러미를 펼쳐 바브 무리를 맞이합니다. 매일 아침 조금씩 짧아집니다.','짧아진 지느러미로도 {n}은 물러서지 않습니다. 바브 무리가 먼저 지쳐 수초 쪽으로 갑니다.','주인은 "베타가 싸움을 좋아하네"라며 영상을 올립니다.','댓글 첫 줄은 "바브 빼세요"였습니다. 주인은 그 댓글에 하트를 눌렀습니다.']},
 'MAT-09-D':{kind:'bad',cat:'점막 손상',tier:'fact',fx:'f-bottom',fact:'fTemper',pl:[[2,'열대어 플레코를 금붕어 수조에']],
   l:['플레코의 입이 {n}의 옆구리에 달라붙습니다. 입 안의 작은 이빨들이 점액층을 긁어 냅니다. 점액이 사라진 자리의 상피가 함께 벗겨집니다.','{n}은 몸을 흔들지만 둥근 몸통으로는 떼어 내지 못합니다.','아침이면 옆구리에 비늘이 빠진 둥근 붉은 자국이 남고, 같은 자국이 밤마다 하나씩 늘어납니다.','상처로 들어간 세균이 혈류를 따라 퍼지자 {n}의 몸통이 붓고 비늘이 몸에서 들떠 일어섭니다.']},
 'MAT-10-D':{kind:'bad',cat:'싸움',tier:'fact',fx:'f-nipped',fact:'fTemper',pl:[[3,'베타 수컷 둘을 한 수조에']],
   l:['두 수컷이 몸을 맞대고 돕니다. 상대가 {n}의 꼬리지느러미를 물고 머리를 흔들자 지느러미막이 기조 사이로 길게 갈라집니다.','{n}은 상대의 옆구리를 물어 비늘 몇 장을 뜯어 냅니다. 숨을 쉬러 수면에 올라갈 때마다 둘은 다시 부딪힙니다.','저녁 무렵 {n}의 한쪽 눈 각막이 하얗게 찢겨 있습니다.','다음 날 아침 {n}은 남은 지느러미를 펼친 자세 그대로 수면 아래 비스듬히 떠 있고, 아가미 뚜껑은 움직이지 않습니다.']},
 'MAT-11-D':{kind:'bad',cat:'공격',tier:'fact',fx:'f-nipped',fact:'fTemper',pl:[[3,'베타와 구피 수컷을 한 수조에']],
   l:['베타가 {n}의 꼬리지느러미를 물고 옆으로 머리를 흔듭니다. 꼬리지느러미의 절반이 떨어져 나가 수면에 뜹니다.','{n}은 남은 꼬리로 몸을 밀어 수초 쪽으로 갑니다. 꼬리를 잃은 몸은 앞으로 나아가지 못하고 제자리에서 기울어집니다.','베타가 다시 다가와 꼬리자루를 뭅니다.','그날 밤 {n}의 꼬리자루 상처 가장자리가 하얗게 부풀고, 다음 날 {n}은 바닥 자갈 위에 옆으로 누워 있습니다.']},
 'MAT-12-D':{kind:'bad',cat:'서열',tier:'fact',fx:'f-thin',fact:'fTemper',pl:[[2,'작은 수조에 수컷 둘']],
   l:['굴을 차지한 수컷이 {n}을 수조 끝까지 쫓아갑니다. {n}의 몸 색이 옅어지고 지느러미가 몸에 붙습니다.','숨을 곳이 없는 수조에서 {n}은 수면 가까이 히터 옆에 머뭅니다. 상대는 {n}이 먹이를 향해 내려올 때마다 옆구리를 들이받고 뭅니다.','옆구리 비늘이 빠진 자리에 붉은 상처가 줄지어 생깁니다.','먹지 못한 날이 이어지자 {n}은 히터 뒤 틈에 몸을 끼운 채 움직이지 않습니다.']},
 'MAT-13-D':{kind:'bad',cat:'고립',tier:'fact',fx:'f-bottom',fact:'fClown',pl:[[2,'무리어를 한 마리만']],
   l:['{n}은 며칠째 유목 틈에서 나오지 않습니다. 먹지 않은 날이 이어지면서 배가 안쪽으로 꺼집니다.','몸 표면에 흰 점이 하나둘 생기고, 흰 점이 아가미 새엽까지 덮습니다.','{n}은 틈 밖으로 나와 바닥에 옆으로 누운 채 아가미 뚜껑만 빠르게 움직입니다. 주인은 "또 자네"라고 말하고 지나갑니다.','다음 날도 {n}은 같은 자세로 누워 있고, 아가미 뚜껑은 움직이지 않습니다.']},
 'MAT-14-D':{kind:'bad',cat:'고립',tier:'fact',fx:'f-thin',fact:'fCrowd',pl:[[2,'무리어를 한 마리만 남김']],
   l:['{n}은 수초 사이에서 나와 먹이 쪽으로 가다가 다시 돌아갑니다. 큰 물고기들이 수면의 먹이를 먼저 먹습니다.','몇 주 사이 {n}의 배가 안쪽으로 꺼지고 등 근육이 얇아집니다. 파란 줄은 낮에도 흐린 색으로 바래 있습니다.','{n}은 바닥 가까이 수초 줄기 옆에 머리를 약간 아래로 한 채 떠 있습니다.','아가미 뚜껑의 움직임이 점점 느려지다가 멈춥니다.']},
 'MAT-15-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',pl:[[2,'"청소부"라며 먹이를 따로 주지 않음']],
   l:['{n}은 바닥을 뒤지며 수염 끝으로 모래알 사이를 훑습니다. 찾은 것은 다른 물고기의 배설물과 녹은 사료 껍질뿐입니다.','몇 주 사이 {n}의 배가 안쪽으로 꺼집니다. 몸 옆의 골판 사이 피부가 주름처럼 접힙니다.','{n}은 공기를 마시러 수면에 올라가는 횟수가 줄어듭니다.','마지막으로 수면에 올라갔다 내려온 {n}은 바닥에 배를 대고 가슴지느러미를 펼친 채 다시 움직이지 않습니다.']},
 'MAT-16-D':{kind:'bad',cat:'독침 절단',tier:'fact',fx:'f-hand',fact:'fMotoro',pl:[[1,'독침을 손톱깎이로 자름']],
   l:['주인이 {n}을 그물째 들어 올립니다. 손톱깎이가 꼬리 위 독침의 밑동을 자릅니다.','{n}은 그물 안에서 몸 가장자리를 휘저으며 빠져나가려 합니다. 잘린 자리의 진피가 물에 그대로 드러납니다.','며칠 뒤 상처 주변 피부가 하얗게 들뜨고, 들뜬 자리가 꼬리 아래쪽으로 넓어집니다.','비늘이 없는 피부는 번지는 괴사를 막지 못하고, {n}은 모래에 몸을 묻지 못한 채 바닥 위에 떠 있습니다.']},
 'MAT-16-H':{kind:'happy',cat:'기념품',tier:'story',fx:'f-rest',
   l:['몇 달 뒤 주인은 모래를 갈다가 빠져 있는 독침 하나를 발견합니다. {n}의 꼬리에는 이미 새 독침이 자라 있습니다.','주인은 빠진 독침을 액자에 넣어 걸었습니다. 그 뒤로 모래는 긴 집게로만 갈았습니다.','액자 아래에는 "우리 집 가오리의 첫 무기"라고 적혀 있습니다. 주인 손등의 흉터는 액자에 들어가지 않았습니다.']},
 'MAT-17-D':{kind:'bad',cat:'과성장',tier:'fact',fx:'f-glass',fact:'fOutgrow',pl:[[0,'다 큰 몸을 감당하지 못해 넘김'],[2,'성체 크기를 모르고 들임']],
   l:['새 주인의 수조는 이전 것보다 작습니다. {n}은 몸을 다 펴지 못한 채 대각선으로 놓입니다.','몸을 돌릴 때마다 주둥이와 꼬리가 유리에 부딪혀 주둥이 끝 피부가 벗겨집니다.','좁은 물은 {n}의 배설물을 감당하지 못하고, 암모니아가 아가미 새엽을 붓게 합니다. {n}은 수면에 입을 대고 숨을 몰아쉽니다.','벗겨진 주둥이 상처에 균사가 자라 하얀 털처럼 덮입니다.']},
 'MAT-18-D':{kind:'bad',cat:'서열',tier:'fact',fx:'f-thin',fact:'fTemper',pl:[[2,'영역성 있는 종을 좁은 수조에 여럿']],
   l:['{n}은 수조 위쪽 구석에서 지느러미를 몸에 붙인 채 머뭅니다. 상대는 {n}이 구석을 벗어날 때마다 옆구리를 들이받습니다.','먹이 시간에 {n}이 내려오면 상대가 먼저 막아섭니다. 몸 색이 옅어지고 등 근육이 얇아집니다.','옆구리에 이빨 자국이 겹치며 비늘이 듬성듬성 빠집니다.','어느 아침 {n}은 히터와 유리 사이에 몸을 끼운 채, 가슴지느러미만 느리게 움직입니다. 저녁에는 그것도 멈춥니다.']},
 'MAT-19-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',fact:'fOranda',pl:[[2,'먹이 경쟁에서 지는 금붕어를 방치']],
   l:['{n}은 먹이 시간마다 수면으로 올라가지만 언제나 늦습니다. 몇 주가 지나며 머리에 비해 몸통이 가늘어집니다.','몸에 저장된 지방이 다 쓰이자 근육 단백질이 분해되고, 배가 안쪽으로 꺼지며 등뼈 모양이 드러납니다.','부레를 받쳐 주던 몸통이 줄어들자 {n}은 머리를 아래로 한 채 기울어 떠 있습니다. 다른 금붕어들이 {n} 위로 지나가며 수면의 먹이를 먹습니다.','{n}은 바닥 가까이에서 입을 벌렸다 닫는 동작을 몇 번 하고 멈춥니다.']},
 'MAT-20-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',fact:'fGhost',pl:[[2,'야행성 물고기에게 낮에만 먹이']],
   l:['{n}은 밤마다 은신처에서 나와 모래 위를 천천히 오갑니다. 몸 아래 긴 뒷지느러미의 물결 같은 움직임이 점점 느려집니다.','꼬리 쪽부터 근육이 줄어 몸이 얇아집니다. 배가 안쪽으로 꺼지며 내장 위치가 그대로 드러납니다.','{n}은 은신처 입구에 머리를 걸친 채 하루 종일 움직이지 않습니다.','주인은 낮에 {n}이 보이지 않는 것을 늘 있는 일로 여깁니다.']},
 'MAT-21-D':{kind:'bad',cat:'포식',tier:'fact',fx:'f-eaten',fact:'fTemper',pl:[[3,'어린 물고기를 큰 물고기 수조에']],
   l:['큰 물고기가 {n}의 머리 쪽으로 다가와 입을 벌립니다. {n}은 몸을 틀어 피하지만 꼬리자루가 턱 사이에 걸립니다.','이빨이 꼬리자루의 비늘과 근육을 함께 누릅니다. {n}은 꼬리를 흔들어 빠져나가려 하고, 그때마다 근육이 더 길게 찢어집니다.','큰 물고기가 머리를 흔들자 {n}의 척추가 꼬리 쪽에서 꺾입니다.','{n}의 가슴지느러미가 한동안 물을 젓습니다.']},
 'MAT-21-H':{kind:'happy',cat:'복수는 자라서',tier:'story',fx:'f-rest',
   l:['몇 해 뒤 {n}은 그때의 큰 물고기보다 세 배 깁니다.','어느 날 아침 그 물고기가 보이지 않습니다. {n}은 수면 아래에 통나무처럼 떠 있습니다.','주인은 "늙어서 죽었나 보다"라고 했습니다. 수조 바닥에는 아무것도 남아 있지 않았습니다.']},
 'MAT-22-D':{kind:'bad',cat:'괴롭힘',tier:'fact',fx:'f-thin',fact:'fBreed',pl:[[4,'수컷만 여럿 넣어 암컷을 쉬지 못하게 함']],
   l:['수컷들은 하루 종일 {n}의 뒤를 따라다닙니다. {n}은 먹이를 삼키기 전에 다시 자리를 옮깁니다.','몇 주 사이 등 근육이 얇아지고 꼬리지느러미 끝이 갈라집니다. 갈라진 끝이 하얗게 짓무르기 시작합니다.','배 속에는 새끼가 차 있어 몸이 무거워집니다.','어느 날 {n}은 수초 사이에 기대어 아가미 뚜껑만 빠르게 움직이고, 수컷들은 그 옆에서도 몸을 구부립니다.']},
 'MAT-23-D':{kind:'bad',cat:'난산',tier:'fact',fx:'f-bottom',fact:'fBreed',pl:[[4,'쉬지 않고 출산하게 둠']],
   l:()=>[(fl('births')||1)+1+'번째 출산은 길어집니다. {n}은 수초 사이에서 몸을 떨며 한 마리씩 새끼를 내보냅니다.','몇 마리는 노른자 주머니를 단 채 몸을 펴지 못하고 나옵니다. 출산이 멈춘 뒤에도 생식공 주변 조직이 붉게 부어 밖으로 드러나 있습니다.','다른 물고기들이 그 붉은 조직을 쪼고, {n}이 움직일 때마다 드러난 조직이 수초 잎에 쓸립니다.','이틀 뒤 {n}은 수초 뿌리 쪽에 옆으로 누워 있습니다.']},
 'MAT-24-D':{kind:'bad',cat:'첫날',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['{n}은 물속으로 나오자마자 아래로 가라앉다가 꼬리를 젓기 시작합니다.','성어 한 마리가 방향을 틀어 다가옵니다. 입이 열리고 물과 함께 {n}이 빨려 들어갑니다.','손톱보다 작은 몸은 입 안에서 한 번 접힙니다.','성어는 입을 몇 번 오물거린 뒤 다음 새끼를 향해 몸을 돌립니다.']},
 'MAT-25-D':{kind:'bad',cat:'산란 뒤',tier:'fact',fx:'f-nipped',fact:'fBetta',pl:[[4,'산란 뒤 암컷을 꺼내지 않음']],
   l:['산란이 끝나자 수컷이 {n}을 거품집 아래에서 몰아냅니다. {n}은 수조 구석으로 가지만 구석은 거품집에서 한 뼘 거리입니다.','수컷이 {n}의 꼬리지느러미와 뒷지느러미를 번갈아 뭅니다. 지느러미가 기조만 남고, 옆구리 비늘이 줄지어 빠집니다.','숨을 쉬러 수면에 올라갈 때마다 {n}은 다시 물립니다.','다음 날 아침 {n}은 히터 뒤에 끼인 채 움직이지 않습니다.']},
 'MAT-26-H':{kind:'happy',cat:'아버지의 생산성',tier:'story',fx:'f-rest',
   l:['새끼 수백 마리가 거품집 아래에서 헤엄치기 시작합니다. {n}은 사흘 만에 처음으로 먹이를 받아먹습니다.','주인은 {n}을 "번식왕"이라 부르며 매주 새 암컷을 넣습니다. {n}은 매주 거품집을 다시 짓습니다.','수백 마리 중 주인이 끝까지 키운 것은 색이 좋은 열두 마리였습니다.']},
 'MAT-27-D':{kind:'bad',cat:'채집',tier:'fact',fx:'f-net',fact:'fArowana',
   l:['그물이 {n}을 물 밖으로 들어 올립니다. 사람의 손가락이 {n}의 아래턱을 벌립니다. 입 안의 새끼들이 양동이로 쏟아집니다.','{n}은 공기 중에서 아가미 뚜껑을 계속 엽니다. 물이 없는 아가미 새엽은 서로 달라붙어 산소를 받아들이지 못합니다.','몇 주 동안 먹지 않아 얇아진 몸은 오래 버티지 못합니다.','칼이 배를 가르기 전에 {n}의 아가미 뚜껑은 거의 움직이지 않습니다.']},
 'MAT-28-D':{kind:'bad',cat:'싸움',tier:'likely',fx:'f-bottom',fact:'fChanna',pl:[[4,'맞지 않는 짝을 좁은 수조에']],
   l:['상대가 {n}의 머리 옆을 정면으로 뭅니다. 송곳니 같은 이빨이 아가미 뚜껑 가장자리를 뚫습니다.','{n}은 몸을 비틀어 빠져나오고, 아가미 뚜껑이 찢어진 채 벌어집니다. 찢어진 틈으로 붉은 아가미 새엽이 보입니다.','{n}은 수면에 올라가 공기를 삼키며 버팁니다. 상대는 {n}이 수면에 오를 때마다 다시 따라 올라옵니다.','찢긴 새엽에 균이 앉아 하얗게 덮이고, {n}은 수면에 입을 댄 채 움직임을 멈춥니다.']},
 'MAT-29-H':{kind:'happy',cat:'입이 무거운 아버지',tier:'story',fx:'f-rest',
   l:['{n}이 입을 열자 작은 새끼 수십 마리가 한꺼번에 쏟아져 나옵니다. {n}은 몇 주 만에 처음으로 먹이를 삼킵니다.','주인은 플래시를 켠 채 그 장면을 놓쳤습니다.','주인은 다음 번식에서도 플래시를 켰습니다.']},
 'MAT-30-D':{kind:'bad',cat:'서열',tier:'fact',fx:'f-thin',fact:'fBreed',pl:[[2,'번식 쌍을 작은 수조에']],
   l:['노랗게 물든 암컷이 {n}을 굴에서 수조 끝까지 몰아냅니다. {n}은 수면 가까이 히터 옆에 머뭅니다.','암컷은 {n}이 바닥 쪽으로 내려올 때마다 옆구리를 들이받습니다. 지느러미 끝이 찢기고 몸 색이 옅어집니다.','먹이를 먹지 못한 날이 이어지자 근육이 줄어 등뼈 모양이 비칩니다.','{n}은 히터 뒤에 몸을 붙인 채 움직임을 멈춥니다.']},
 'MAT-31-H':{kind:'happy',cat:'봄마다 생기는 동생들',tier:'story',fx:'f-rest',
   l:['살아남은 알 몇 개가 새끼가 되고, 새끼들은 {n}을 따라 헤엄칩니다.','주인은 "금붕어가 새끼를 쳤다"며 동네에 나눠 줍니다. 봄마다 그렇게 합니다.','다음 해 봄, 받아 간 집 중 어항이 남아 있는 곳은 한 집이었습니다.']},
 'MAT-32-D':{kind:'bad',cat:'산란 추격',tier:'fact',fx:'f-float',fact:'fSwim',pl:[[4,'산란기 수컷을 분리하지 않음']],
   l:['수컷 세 마리가 쉬지 않고 {n}의 배를 밉니다. {n}은 둥근 몸으로 수조 벽을 따라 돌다가 장식물 모서리에 옆구리를 부딪히고, 비늘 몇 장이 떨어져 붉은 피부가 드러납니다.','추격은 해가 질 때까지 이어집니다. 지친 {n}은 몸을 똑바로 세우지 못하고 옆으로 기웁니다.','기운 몸에도 수컷들은 계속 주둥이를 밀어 넣습니다.','다음 날 아침 {n}은 배를 위로 한 채 수면에 떠 있습니다.']},
 'MAT-33-D':{kind:'bad',cat:'선별',tier:'fact',fx:'f-freezer',fact:'fFlush',
   l:['사람의 손가락이 {n}을 다른 치어 몇 마리와 함께 작은 컵으로 옮깁니다. 컵은 냉동실 안에 놓이고, 물이 가장자리부터 얼어 들어옵니다.','{n}은 아직 얼지 않은 가운데로 헤엄쳐 갑니다. 수온이 떨어질수록 지느러미 움직임이 느려집니다.','얼음이 몸에 닿자 피부 아래 조직 속에서 얼음 결정이 자라 세포막을 뚫습니다.','{n}은 몸을 비튼 모양 그대로 얼음 속에 굳습니다.']},
 'MAT-33-F':{kind:'bad',cat:'선별',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['접시 위의 {n}과 다른 치어 몇 마리가 숟가락으로 떠집니다. 숟가락은 옆 수조의 큰 물고기 위에서 기울어집니다.','{n}은 물에 떨어지자마자 수초 쪽으로 꼬리를 젓습니다. 손톱보다 작은 몸은 몇 번 젓지 못합니다.','큰 물고기의 입이 열리고 물과 함께 {n}이 빨려 들어갑니다. 입 안에서 몸이 한 번 접힙니다.','큰 물고기는 다음 치어를 향해 몸을 돌립니다.']},
 'MAT-34-D':{kind:'bad',cat:'변기',tier:'fact',fx:'f-toilet',fact:'fFlush',pl:[[0,'번식으로 늘어난 물고기를 산 채로 변기에']],
   l:['양동이 물이 변기 안으로 쏟아집니다. {n}은 변기 바닥의 작은 물웅덩이에서 다른 구피들과 함께 맴돕니다.','물을 내리는 소리와 함께 물살이 {n}을 배수관 안으로 끌어당깁니다. {n}은 꼬리를 저어 거슬러 오르려 하지만 관 벽에 몸이 부딪힙니다.','관 끝에서 물은 하수와 섞이고, 하수 속 암모니아와 황화수소가 아가미 새엽에 닿습니다.','새엽이 붓기 시작하고, {n}의 아가미 뚜껑은 산소가 거의 없는 물속에서 점점 느려집니다.']},
 'MAT-35-D':{kind:'bad',cat:'네온병',tier:'fact',fx:'f-bent',fact:'fNeon',pl:[[1,'죽은 물고기를 건지지 않음']],
   l:['몇 주 뒤 {n}의 몸 가운데 파란 줄 아래 근육이 하얗게 흐려집니다. 근육 속에서 기생충 포자가 자라 근섬유를 대신 채웁니다.','{n}은 무리에서 떨어져 밤에도 혼자 헤엄칩니다. 굳어 가는 근육 때문에 몸이 한쪽으로 휩니다.','{n}은 휜 몸으로 수초 사이를 오가다가 바닥에 내려앉습니다.','다른 네온들이 {n}의 몸을 쪼기 시작합니다.']}
});

/* old-age endings: -A calm (happy) when the life was good, -X bad otherwise */
const mat_OLD={
 'MAT-36':{cat:'노환',
   a:'{n}은 아침 먹이를 반쯤 먹고 바닥으로 내려갑니다. 마지막까지 스스로 먹은 먹이였습니다.',
   b:()=>(isSp('oranda')?'{n}은 주인의 손 그림자를 따라 유리 앞까지 옵니다. ':'{n}은 주인 손가락 옆까지 와서 멈춥니다. ')+'손가락이 물을 두 번 두드리고, {n}은 그 옆에서 천천히 가라앉습니다.',
   c:'{n}은 아침 먹이가 떨어지는 소리를 듣고도 바닥에 그대로 있습니다.',
   body:()=>['지느러미는 펼쳐져 있고 상처는 없습니다. 오후가 되자 아가미 뚜껑의 움직임이 느려집니다.',inPond()?'{n}은 몸을 바로 세운 채 연못 바닥 돌 위에 배를 대고 있습니다.':'{n}은 몸을 바로 세운 채 모래 위에 배를 대고 있습니다.','해가 질 무렵 아가미 뚜껑이 한 번 더 열리고 닫힌 뒤 멈춥니다.'],
   last:()=>mat_last({grandma:'할머니는 다음 날 아침에도 어항 앞에서 인사를 했습니다.',expert:'주인은 노트에 {n}이 이 집에서 산 햇수를 적었습니다. 같은 줄 아래에는 같은 날 들여온 다른 금붕어들의 날짜가 먼저 적혀 있었습니다.',
     shared:'{n}은 이 교실을 거쳐 간 반장 여섯 명보다 오래 있었습니다. 그중 {n}의 이름을 아는 사람은 없었습니다.',content:'추모 영상의 조회수는 생전 영상보다 높았습니다.'},
     '같은 날 축제에서 받아 온 금붕어들 가운데 {n}만이 여기까지 왔습니다.')},
 'MAT-37':{cat:'노환',
   a:'{n}은 무리 맨 뒤에서 수조를 한 바퀴 돕니다. 무리가 속도를 늦추지는 않습니다.',
   b:'{n}은 수초 앞에서 멈추고 잎 위에 배를 걸칩니다.',
   c:'{n}은 바닥 가까이에서 지느러미만 천천히 젓습니다.',
   body:()=>['아가미 뚜껑이 천천히 움직입니다. 무리가 다시 지나갈 때 {n}은 따라 나서지 않습니다.','저녁이 되자 {n}은 '+(mat_v()==='b'?'잎에서 미끄러져 ':'')+'바닥 모래 위에 내려앉습니다.'],
   last:()=>mat_last({casual:'다음 날 주인은 "'+josa(S.sp.name,'은')+' 원래 금방 죽어"라고 말했습니다. {n}은 이 수조에서 가장 오래 산 물고기였습니다.',breeder:'주인은 {n}이 낳은 새끼가 몇 마리였는지 세어 본 적이 없습니다.',mill:'주인은 {n}이 낳은 새끼가 몇 마리였는지 세어 본 적이 없습니다.'},
     '주인은 {n}이 늙어서 죽었다는 것을 알지 못했습니다. 그만큼 오래 산 '+josa(S.sp.name,'을')+' 본 적이 없었기 때문입니다.')},
 'MAT-38':{cat:'노환',
   a:()=>isSp('wildbetta')?'주인이 다가오자 {n}은 유목 뒤로 천천히 들어갑니다. 끝까지 사람을 경계하는 물고기였습니다.':'주인이 다가오자 {n}은 얇아진 지느러미를 한 번 더 펼칩니다.',
   b:'{n}은 잎 위에 몸을 얹은 채 수면으로 입을 내밀어 공기를 마십니다.',
   c:'{n}은 바닥 수초 사이에 몸을 기댑니다.',
   body:()=>['지느러미는 잎 가장자리로 늘어져 물에 잠겨 있습니다. 숨을 마시는 간격이 길어집니다.','밤사이 {n}은 잎에서 미끄러져 수초 사이에 걸립니다.','아침 햇빛이 수조에 들 때 {n}의 지느러미는 펼쳐진 채 움직이지 않습니다.'],
   last:()=>mat_last({breakup:'남은 사람은 {n}의 사진을 전 애인에게 보낼지 한참 고민했고, 보내지 않았습니다.',learner:'주인은 처음으로 "베타 수명"을 검색했습니다. 평균보다 오래 살았다는 걸 알고 나서야 울었습니다.',
     content:'추모 영상의 조회수는 생전 영상보다 높았습니다.',eager:'주인은 다음 날 같은 가게에 가서 같은 색 베타를 골랐습니다.'},
     '{n}이 처음 왔던 컵은 아직 싱크대 위 선반에 있었습니다.')},
 'MAT-39':{cat:'노환',
   a:'{n}은 새 얼굴이 내민 먹이를 받아먹습니다. 새 주인이 처음으로 {n}의 이름을 부릅니다. 그 이름은 예전 이름과 다릅니다.',
   b:()=>isSp('oscar')?'{n}은 며칠 동안 먹이를 거부하고 예전 자리 쪽 유리만 봅니다. 그 뒤에야 조금씩 먹기 시작합니다.':'{n}은 예전 사람이 서 있던 쪽에 머뭅니다. 먹이가 떨어지자 몸을 돌려 다가가지만 반쯤에서 멈춥니다.',
   c:'{n}은 며칠 동안 은신처 앞에서 시간을 보냅니다.',
   body:()=>['{n}은 가운데에 떠서 천천히 지느러미를 움직입니다.','어느 저녁 {n}은 바닥에 배를 대고 가슴지느러미를 펼친 채 쉽니다.','다음 날 아침 아가미 뚜껑은 움직이지 않습니다.'],
   last:()=>isSp('pleco')?'{n}이 플레코라는 걸 아는 사람은 있었습니다. {n}의 이름을 아는 사람은 없었습니다.':mat_last({grandma:'할머니의 장례식 날, 손주가 처음으로 {n}에게 밥을 줬습니다. {n}은 그 뒤로도 몇 해를 더 살았습니다.',
     relay:'{n}의 주인들 목록에는 이름이 여러 개 있었습니다. {n}의 이름은 집마다 달랐습니다.',casual:'{n}의 주인들 목록에는 이름이 여러 개 있었습니다. {n}의 이름은 집마다 달랐습니다.'},
     '{n}을 처음 데려온 사람은 {n}이 아직 살아 있다는 것을 몰랐습니다.')},
 'MAT-40':{cat:'노환',
   a:()=>isSp('cory')?'{n}은 마지막 날까지 수염으로 바닥을 뒤집니다. 그리고 무리가 쉬던 유목 아래 자리에 몸을 붙입니다.':'{n}은 유목 아래 무리가 쉬던 자리에 몸을 붙입니다.',
   b:'{n}은 수조를 천천히 한 바퀴 돌고, 무리가 쉬던 자리로 돌아옵니다.',
   c:'{n}은 은신처 안쪽에 몸을 붙입니다.',
   body:()=>['아가미 뚜껑이 천천히 움직입니다. 먹이가 떨어져도 {n}은 그 자리에서 나오지 않습니다.','저녁이 되자 {n}의 몸이 조금씩 옆으로 기웁니다.','다음 날 아침 {n}은 같은 자리에 같은 자세로 있습니다.'],
   last:()=>isSp('clownloach')?'주인은 그날 아침에도 "또 자는 거지?" 하고 유리를 두드렸습니다. 이번에는 {n}이 일어나지 않았습니다.'
     :mat_last({expert:'주인은 무리를 들인 날과 마지막 한 마리가 떠난 날을 노트 한 줄에 같이 적었습니다.'},'같은 날 들어온 무리의 이름을 주인은 하나도 지어 주지 않았습니다. {n}의 이름만 있었습니다.')}
};
(()=>{const map={};
  for(const id in mat_OLD){const O=mat_OLD[id];
    const first=()=>valOf(O[mat_v()]);
    map[id+'-A']={kind:'happy',cat:O.cat,tier:'likely',fx:'f-rest',fact:'fNatural',l:()=>[first()].concat(O.body()).concat([valOf(O.last)])};
    map[id+'-X']={kind:'bad',cat:O.cat,tier:'likely',fx:'f-bottom',fact:'fNatural',pl:[[2,'늙은 몸을 돌보지 않음']],l:()=>[mat_oldWhy(),first()].concat(O.body())};
  }
  fevEnd(map);
})();
