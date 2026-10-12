/* ---------- v0.10 catalogue: 야생 한국 (WLD-01…28) and 블랙 코미디 해피엔딩 (H1–H13, HAP-14…44) ----------
   events/08_wild_happy.md · FISH_REWORK.md §5. The engine's wildTick already handles winter, herons and the
   warm outflow; these events add to it. Every happy ending has a trigger (an event whose sp/own/need encode
   the catalogue's species, owner and place, and whose hidden check is the stat gate within the species cap). */

/* ---------- helpers ---------- */
/* the place in the wild: the engine's warm outflow counts as 'outflow'; a released fish with no place yet is in a river */
FLAG.wild_place=()=>S.f&&S.f.warm?'outflow':(S.f&&S.f.fl&&S.f.fl.wild_place)||(S&&S.wild?'river':0);
/* the same hidden check as an option's chk, for a second stat inside an outcome; a need above the cap always fails */
const wld_pass=(k,n)=>n<=capOf(k)&&R()<clamp(Math.pow(fst()[k]/n,2)*((MODES[S.mode]||{}).chk||1),.05,.95);
/* a happy ending's stat gate never asks more than this species can reach */
const wld_need=(k,n)=>[k,Math.min(n,capOf(k))];
/* size class for predators (catalogue §0.3): 0 small · 1 medium · 2 large */
const wld_size=()=>{const x=fx_(),L=S.f.len||0;
  if(isSp('neon','peapuffer','guppy','platy','apisto','cory','altum','betta','wildbetta'))return 0;
  if(isSp('oscar','arowana','gar'))return 2;
  if(isSp('koi','comet','pleco','motoro'))return L>=x.cm*.5?2:1;
  return 1};
/* a tropical fish in a Korean winter outside warm water: no other WLD event, only WLD-02 */
const wld_cold=()=>season()==='winter'&&isSp('@tropical')&&fl('wild_place')!=='outflow';
const wld_warm=()=>!wld_cold();
/* colours that show on a brown river bottom */
const wld_bright=()=>isSp('@gold','koi','neon')||(isSp('guppy')&&!fem());
const wld_drab=()=>isSp('cory','pleco','bichir','channa','wildbetta','motoro','ghost')||(isSp('apisto')&&fem());
/* run another WLD event next (a chain the catalogue names) */
const wld_q=id=>q(null,null,()=>{const e=FEV.find(x=>x.id===id);if(e&&S.wild&&!S.ending&&!S.done&&!(e.sp&&!isSp(e.sp)))fevRun(e)});
/* the person who let the fish go never sees the end */
const wld_after=()=>isKind('release')?AFTER.release:'{n}을 물에 놓아 보낸 사람은 이 일을 끝내 알지 못했습니다.';
const wld_bad=(cat,fx,l,o)=>Object.assign({kind:'bad',cat,tier:'likely',fx,after:wld_after,l},o||{});
const wld_hap=(cat,l,o)=>Object.assign({kind:'happy',cat,tier:'story',fx:'f-rest',l},o||{});
/* late in life the happy endings come more often */
const wld_late=(b)=>()=>(b||1)*(.25+fl('age')*1.6);
/* a new place after being carried off */
const wld_newPlace=()=>pick(['reservoir','river','river','ditch']);
/* survived a winter outdoors */
const wld_winter={add:{winter_survived:1},mem:'얼음 아래에서 겨울을 버텼다.'};
/* H4 lives in fev_core.js */
const wld_SOFA='HAP-SOFA';

/* ================= PART 1 — 야생 한국 (WLD) ================= */

/* WLD-01 봉지가 뒤집히는 순간 [출처: 관상어 방류 시 수온·수질 급변 스트레스, 국내 방생 행사 외래종 방류 사례] */
function wld01Side(o){
  const extra=[];
  if(isSp('@gold'))extra.push('주황색 몸이 갈색 바닥 위에서 또렷하게 드러났습니다.');
  if(isSp('oranda','ryukin')){o.fx=Object.assign({},o.fx,{fin:.1});o.set=Object.assign({},o.set,{inj_fin:1});extra.push('긴 지느러미 끝이 물살에 찢겼습니다.')}
  if(isSp('altum')){o.fx=Object.assign({},o.fx,{h:-10});o.set=Object.assign({},o.set,{slime_loss:1});extra.push('물의 맛이 달랐습니다. 다음 날 {n}의 몸에서 점액이 벗겨져 나왔습니다.')}
  if(isSp('fig8'))o.set=Object.assign({},o.set,{fresh:1});
  if(isSp('motoro'))o.set=Object.assign({},o.set,{buried:1});
  if(extra.length)o.t=[o.t].concat(extra).join(' ');
  return o}
fev([{id:'WLD-01',stage:'wild',tier:'likely',once:1,w:4,need:{released:1},when:wld_warm,
  p:'봉지 매듭이 풀리고 물이 한꺼번에 쏟아집니다. 수조 물보다 차갑고 흙냄새가 섞인 물입니다. 물살이 몸을 옆으로 밉니다. 수면 위로 사람들의 그림자가 흔들리고, 바닥 쪽은 어둡습니다. {n}은…',
  o:[
   {l:'물살을 거슬러 사람들 그림자 아래로 돌아간다',chk:['p',50],
    ok:()=>wld01Side({t:'{n}은 물가 얕은 곳에 머물렀습니다. 사람들이 던지는 과자 부스러기가 머리 위로 떨어졌습니다.',set:{wild_place:'river',shallow:1},fx:{h:-3}}),
    no:()=>wld01Side(Object.assign(wld01Drift(),{t:'{n}은 물살을 거스르다 힘이 빠졌습니다. 몸이 넓은 물 쪽으로 밀려갔습니다.'}))},
   {l:'물살을 따라 넓은 물 쪽으로 흘러간다',chk:()=>capOf('g')<40?null:['g',40],
    ok:()=>capOf('g')<40?(R()<.35?wld01Side(wld01Drift()):{end:'WLD-01-D'}):wld01Side(wld01Drift()),
    no:()=>wld_size()<2?{end:'WLD-01-D'}:wld01Side({t:'{n}은 바위에 옆구리를 부딪치며 하류 소까지 떠밀려 갔습니다.',c:'bad',fx:{h:-15},set:{wild_place:'river',inj_skin:1}})},
   {l:'가장 가까운 돌 밑으로 들어가 움직이지 않는다',
    ok:()=>wld01Side({t:'{n}은 돌 밑에 몸을 끼우고 첫날을 넘겼습니다. 사람들의 목소리가 멀어졌습니다.',set:{wild_place:wld_newPlace(),hid:1},mem:'돌 밑. 처음 보는 물.'})}
  ]}]);
function wld01Drift(){const pl=pick(['river','reservoir','reservoir','pond']);
  return {t:{river:'{n}은 하류의 깊은 소에 닿았습니다.',reservoir:'{n}은 물살을 따라 저수지까지 흘러갔습니다.',pond:'{n}은 물길을 따라 공원 연못으로 들어갔습니다.'}[pl],set:{wild_place:pl},fx:{g:2},
    run:()=>{if(isSp('@small')&&R()<.5)setFl('seen_small',1)}}}

/* WLD-02 첫 겨울 [출처: 열대어 하한 수온, 한국 겨울 하천 수온 범위] — tropical fish: no choice, no check */
fev([{id:'WLD-02',stage:'wild',tier:'fact',w:3,cd:30,need:{season:'winter'},when:()=>fl('wild_place')!=='outflow',
  p:'물이 하루하루 차가워집니다. 수면 쪽 물이 먼저 굳어 가고, 먹이가 될 만한 것이 거의 떠다니지 않습니다. 깊은 웅덩이 바닥 쪽 물이 조금 덜 차갑습니다. {n}은…',
  o:[
   {l:'깊은 소 바닥까지 내려가 머문다',when:()=>!isSp('@tropical'),chk:['g',50],
    ok:()=>Object.assign({t:isSp('koi')?'{n}은 깊은 물 바닥에서 거의 움직이지 않고 겨울을 났습니다.':'{n}은 깊은 소 바닥에서 겨울을 넘겼습니다. 몸이 홀쭉해졌습니다.',c:'good',fx:{h:-10},set:{weight:'thin',swimb_risk:isSp('oranda','ryukin')?1:0}},wld_winter),
    no:()=>wld02Still()},
   {l:'볕이 드는 얕은 물가에서 먹이를 찾는다',when:()=>!isSp('@tropical'),chk:['w',30],
    ok:{t:'{n}은 한낮 얕은 물가에서 가라앉은 벌레를 조금 찾아 먹었습니다. 물가 갈대 사이에 회색 새가 서 있었습니다.',fx:{h:3},add:{heron_up:1}},
    no:{t:'밤사이 얕은 물이 얼기 시작했습니다.',c:'bad',fx:{h:-6},run:()=>wld_q('WLD-03')}},
   {l:'지금 있는 곳 낙엽 밑에서 움직이지 않는다',when:()=>!isSp('@tropical'),ok:()=>wld02Still()}
  ],
  auto:()=>isSp('@tropical')?{t:'물이 하루하루 차가워집니다. {n}의 움직임이 느려집니다.',c:'bad',end:'WLD-02-D'}:wld02Still()}]);
function wld02Still(){
  if(['pond','ditch'].includes(fl('wild_place'))&&R()<.5)return {t:'얕은 물 위로 얼음이 덮였습니다.',c:'bad',fx:{h:-8},run:()=>wld_q('WLD-03')};
  return Object.assign({t:'{n}은 낙엽 밑에서 겨울을 버텼습니다. 봄이 왔을 때 몸은 한 줌이 줄어 있었습니다.',fx:{h:-14,g:2},set:{weight:'thin'}},wld_winter)}

/* WLD-03 얼음 아래 [출처: 결빙기 산소 고갈에 의한 겨울 집단 폐사(winterkill)] */
fev([{id:'WLD-03',stage:'wild',tier:'fact',sp:['@gold','koi','gar'],cd:30,need:{season:'winter'},when:()=>fl('wild_place')!=='outflow',w:()=>['pond','ditch'].includes(fl('wild_place'))?2:.6,
  p:'수면이 하얗게 덮였습니다. 위에서 들어오던 빛이 흐려집니다. 물에서 썩은 잎 냄새가 짙어지고, 숨을 쉴 때마다 아가미가 더 빨리 움직입니다. 얼음 아래 한쪽에 물이 조금 흐르는 곳이 있습니다. {n}은…',
  o:[
   {l:'물이 흐르는 쪽을 찾아 얼음 밑을 헤엄쳐 간다',chk:['w',30],
    ok:()=>(isSp('oranda')&&R()<.3)||!wld_pass('g',isSp('ryukin')?55:50)?wld03Still():Object.assign({t:'{n}은 얼음 밑을 따라 물이 들어오는 곳까지 갔습니다. 그곳 물은 숨쉬기가 조금 나았습니다.',c:'good',fx:{h:-6}},wld_winter),
    no:()=>wld03Still()},
   {l:'얼음 바로 아래에 붙어 물을 들이마신다',
    ok:[[3,Object.assign({t:'얼음 바로 아래 물에는 숨이 조금 더 있었습니다. 대신 등이 얼음에 닿은 자리의 피부가 허옇게 벗겨졌습니다.',c:'bad',fx:{h:-12},set:{inj_skin:1}},wld_winter)],[2,{end:'WLD-03-D'}]]},
   {l:'바닥에서 움직이지 않는다',chk:()=>['g',isSp('ryukin')?65:60],
    ok:Object.assign({t:'{n}은 바닥에서 몸의 움직임을 줄였습니다. 아가미 뚜껑만 느리게 움직였습니다. 얼음이 녹을 때까지 그랬습니다.',c:'good',fx:{h:-10,g:2}},wld_winter),
    no:{end:'WLD-03-D'}}
  ]}]);
function wld03Still(){return wld_pass('g',isSp('ryukin')?65:60)?Object.assign({t:'{n}은 지쳐 바닥에 내려앉았습니다. 그대로 봄까지 버텼습니다.',fx:{h:-15}},wld_winter):{end:'WLD-03-D'}}

/* WLD-04 따뜻한 물이 나오는 곳 [출처: 하수처리장 방류수·발전소 온배수의 겨울 수온, 국내 온수 구간 열대어 정착 사례] */
const wld_outflowFits=()=>isSp('guppy','platy')?'H11':isSp('neon','altum','peapuffer','apisto')?'weak':'ok';
function wld04In(t){return {t:t+(wld_outflowFits()==='H11'?' 미지근한 물가에는 {n}과 같은 모양의 작은 물고기들이 이미 몇 마리 있었습니다.':''),c:'good',set:{wild_place:'outflow',guppy_kingdom:isSp('guppy','platy')?1:0},
  run:()=>{S.f.warm=1;if(wld_outflowFits()==='weak')q(null,null,()=>{if(!S.ending&&!wld_pass('g',30))fevFinish('WLD-04-D')})},mem:'겨울인데도 물이 따뜻했다.'}}
fev([{id:'WLD-04',stage:'wild',tier:'likely',once:1,w:.6,need:{wild_place:['river']},when:()=>wld_warm()&&!S.f.warm,
  p:'물살 한쪽에서 미지근한 물이 섞여 들어옵니다. 물에서 비누 같은 냄새와 비린내가 함께 납니다. 그쪽 물가에는 작은 물고기들이 모여 있고, 머리 위로 하얀 새의 그림자가 오갑니다. {n}은…',
  o:[
   {l:'미지근한 물이 가장 진한 배출구 바로 앞으로 간다',chk:['g',50],
    ok:()=>wld04In('{n}은 배출구 바로 앞 물살에 자리를 잡았습니다.'),
    no:()=>wld_pass('w',30)?Object.assign(wld04In('{n}의 아가미가 따끔거렸습니다. {n}은 가장자리 수초 사이로 물러났습니다.'),{fx:{h:-8},c:'bad'}):wld_size()===0?{end:'WLD-04-D'}:{t:'{n}은 가장자리 얕은 물로 밀려났습니다.',c:'bad',fx:{h:-8},set:{inj_gill:1},run:()=>wld_q('WLD-16')}},
   {l:'미지근한 물 가장자리 수초 사이에 머문다',chk:['w',30],
    ok:()=>wld04In('{n}은 미지근한 물 가장자리 수초 사이에 머물렀습니다.'),
    no:{t:'{n}은 수초 바깥 얕은 물로 나왔습니다.',c:'bad',run:()=>wld_q('WLD-16')}},
   {l:'원래 있던 차가운 물 바닥에 가만히 있는다',ok:{t:'{n}은 차가운 물 바닥으로 돌아갔습니다. 미지근한 물 냄새는 곧 사라졌습니다.'}}
  ]}]);

/* WLD-05 방류구가 멈춘 날 [출처: 온배수 중단 시 열대어 집단 폐사 사례(국외 사례 포함 확인)] */
const wld05Live=()=>Object.assign({t:'며칠 뒤 배출구에서 다시 미지근한 물이 흘러나왔습니다. {n}은 아직 움직이고 있었습니다.',c:'good',fx:{h:-15}},wld_winter);
fev([{id:'WLD-05',stage:'wild',tier:'likely',sp:['@tropical'],cd:60,w:2,need:{wild_place:'outflow',season:'winter'},
  p:'따뜻한 물이 가늘어집니다. 배출구에서 나오던 물소리가 끊깁니다. 몇 시간 사이에 물이 강물만큼 차가워집니다. 배출구 관 안쪽 깊은 곳에서 아직 미지근한 물이 고여 있는 냄새가 납니다. {n}은…',
  o:[
   {l:'배출구 관 안쪽 어두운 곳으로 거슬러 들어간다',when:()=>isSp('oscar','arowana','pleco'),chk:['w',999],lockText:'{n}의 몸이 관 속으로 들어가지 않는다',ok:{}},
   {l:'배출구 관 안쪽 어두운 곳으로 거슬러 들어간다',when:()=>!isSp('oscar','arowana','pleco'),chk:()=>capOf('p')<25?['p',25]:['w',50],
    ok:()=>wld_pass('p',25)||(isSp('@airbreather')&&R()<.3)?Object.assign(wld05Live(),{t:'{n}은 관 속 고인 물에서 며칠을 버텼습니다. 배출구에서 다시 미지근한 물이 흘러나왔습니다.'}):{end:'WLD-05-D'},
    no:{end:'WLD-05-D'}},
   {l:'무리가 몰려 있는 곳 한가운데로 파고든다',
    ok:()=>isSp('guppy','platy')?(wld_pass('g',60)?Object.assign(wld05Live(),{t:'무리의 절반이 바닥에 가라앉았습니다. 남은 절반 사이에 {n}이 있었습니다.'}):{set:{guppy_kingdom:0},end:'WLD-05-D'}):(R()<.4?wld05Live():{end:'WLD-05-D'})},
   {l:'바닥 진흙에 몸을 붙이고 가만히 있는다',chk:['g',60],ok:()=>wld05Live(),no:{end:'WLD-05-D'}}
  ]}]);

/* WLD-06 마른 웅덩이 [출처: 가뭄기 고립 웅덩이 집단 폐사(용존산소·수온), 공기 호흡 어종의 저산소 내성, 베타 서식지 — 논·습지] */
const wld06Rain={t:'며칠 뒤 비가 내렸습니다. 웅덩이가 다시 물길과 이어졌습니다. {n}은 살아 있었습니다.',c:'good',set:{weight:'thin',near_miss:1},fx:{h:-8}};
fev([{id:'WLD-06',stage:'wild',tier:'fact',w:.8,cd:40,need:{season:'summer',wild_place:['ditch','river']},
  p:'물이 하루가 다르게 줄어듭니다. 흐르던 물이 끊기고, 남은 곳은 무릎 높이도 안 되는 웅덩이 하나입니다. 물이 미지근하고 탁합니다. 웅덩이 가장자리에 긴 다리를 가진 새가 서 있습니다. {n}은…',
  o:[
   {l:'물이 가장 깊은 가운데 바닥에 머문다',chk:['g',60],ok:wld06Rain,no:{end:'WLD-06-D'}},
   {l:'수면으로 올라가 공기를 마신다',chk:()=>isSp('@airbreather')?['g',isSp('betta','wildbetta')?30:40]:['g',999],lockText:'{n}은 공기로 숨을 쉴 수 없다',
    ok:()=>Object.assign({},wld06Rain,{t:'{n}은 수면에서 공기를 마시며 웅덩이를 버텼습니다. 수면에 올라갈 때마다 새의 그림자가 가까웠습니다.',run:()=>{if(R()<.5)wld_q('WLD-16')}}),
    no:{end:'WLD-06-D'}},
   {l:'가장자리 진흙과 돌 틈에 몸을 붙인다',
    ok:()=>R()<clamp(Math.pow(Math.max(0,fst().g-10)/60,2),.05,.95)?wld06Rain:{end:'WLD-06-D'}},
   {l:'진흙 위를 기어 다음 웅덩이를 찾아간다',when:()=>isSp('bichir','channa'),chk:['g',70],
    ok:()=>wld_pass('p',40)?{t:'{n}은 젖은 진흙 위를 몸을 비틀며 건너 다른 웅덩이에 닿았습니다.',c:'good',fx:{h:-6,p:2},run:()=>{if(R()<.5)wld_q(R()<.5?'WLD-16':'WLD-20')}}:{t:'{n}은 진흙 위에서 지쳐 원래 웅덩이로 돌아왔습니다.',c:'bad',fx:{h:-12}},
    no:{end:'WLD-06-D'}}
  ]}]);

/* WLD-07 장마 [출처: 집중호우 시 둔치·논 고립 어류 폐사, 홍수 시 관상어 연못 유출] */
function wld07Swept(){
  const s=wld_size();
  if(s===0)return {end:'WLD-07-S'};
  if(s===1){const pl=R()<.12?'outflow':wld_newPlace();return {t:'{n}은 흙탕물에 실려 한참을 떠내려갔습니다. 물이 빠졌을 때 {n}은 낯선 물에 있었습니다.',c:'bad',fx:{h:-12},set:{wild_place:pl,inj_gill:1},run:()=>{if(pl==='outflow')S.f.warm=1}}}
  return {t:'{n}의 큰 몸이 물살에 떠밀려 하류의 보 쪽으로 내려갔습니다.',c:'bad',fx:{h:-8},run:()=>wld_q('WLD-08')}}
fev([{id:'WLD-07',stage:'wild',tier:'likely',cd:40,need:{season:'summer'},
  p:'하늘에서 쏟아지는 비로 물이 갈색이 됩니다. 물살이 갑자기 세지고, 나뭇가지와 비닐이 몸 옆을 지나갑니다. 물가가 넓어지고, 평소에는 땅이던 곳까지 물이 들어옵니다. {n}은…',
  o:[
   {l:'물살이 약한 큰 바위 뒤로 들어간다',chk:['p',50],ok:{t:'{n}은 바위 뒤에서 물살이 지나가기를 기다렸습니다.',c:'good',fx:{p:2}},no:()=>wld07Swept()},
   {l:'넓어진 물을 따라 새로 생긴 얕은 곳으로 간다',chk:['w',40],
    ok:{t:'{n}은 얕은 물에서 먹이를 찾다가 물이 빠지기 전에 본류로 돌아왔습니다.',c:'good',fx:{h:4}},
    no:()=>isSp('bichir','channa','pleco')&&wld_pass('g',70)?{t:'물이 빠졌습니다. {n}은 풀뿌리 사이를 몸을 비틀며 기어 본류로 돌아왔습니다.',c:'good',fx:{h:-10}}:{end:'WLD-07-D'}},
   {l:'바닥에 몸을 붙이고 물살이 지나가기를 기다린다',
    ok:()=>wld_pass('g',isSp('motoro')?55:50)?{t:'{n}은 바닥에 붙은 채 장마를 넘겼습니다.',c:'good',fx:{g:2}}:wld07Swept()}
  ]}]);
/* the same rain at home: an outdoor pond overflows (pond_net stops it) */
fev([{id:'WLD-07B',stage:'home',tier:'likely',sp:['@gold','koi'],cd:40,need:{season:'summer',pond:1},when:()=>!S.f.net,w:.5,
  p:'하늘에서 쏟아지는 비로 물이 갈색이 됩니다. 물이 연못 둑을 넘어 마당으로 흘러넘칩니다. 넘친 물이 낮은 쪽으로 빠르게 빠져나갑니다. {n}은…',
  o:[
   {l:'넘쳐흐르는 물을 거슬러 연못 깊은 쪽으로 간다',chk:['p',50],ok:{t:'{n}은 연못 깊은 쪽에서 비가 그치기를 기다렸습니다.',c:'good',near:'net'},
    no:{t:'{n}은 넘친 물에 실려 연못 밖 도랑으로 쓸려 나갔습니다.',c:'bad',set:{escaped:1},pl:[[3,'연못이 넘쳐 유실']],run:()=>{S.f.released=1;q(null,null,()=>goWild('river'))}}},
   {l:'연못 바닥 돌 사이에 몸을 붙인다',ok:[[3,{t:'{n}은 돌 사이에 몸을 붙인 채 비가 그칠 때까지 버텼습니다.',near:'net'}],[1,{t:'{n}은 넘친 물에 실려 연못 밖 도랑으로 쓸려 나갔습니다.',c:'bad',set:{escaped:1},pl:[[3,'연못이 넘쳐 유실']],run:()=>{S.f.released=1;q(null,null,()=>goWild('river'))}}]]}
  ]}]);

/* WLD-08 보(洑) 수문이 열리는 날 [출처: 보·댐 방류 하류 어류 피해, 가스 과포화에 의한 기포병(gas bubble disease) 병리] */
function wld08Gate(){
  if(wld_size()===0)return {t:'{n}은 수문 아래 틈으로 빨려 들어갔다가 작은 몸 그대로 하류 소에 떨어졌습니다. 소에는 은빛 물고기들이 모여 있었습니다.',c:'bad',run:()=>wld_q('WLD-14')};
  return wld_pass('g',50)?{t:'{n}은 수문 아래로 휩쓸려 콘크리트 턱에 몸을 부딪쳤습니다. 등뼈 한쪽이 욱신거렸지만 하류에서 다시 헤엄쳤습니다.',c:'bad',fx:{h:-22},set:{inj_spine:1,inj_skin:1}}:{end:'WLD-08-D'}}
fev([{id:'WLD-08',stage:'wild',tier:'fact',w:.5,cd:40,need:{wild_place:['river','reservoir']},when:wld_warm,
  p:'물이 한 방향으로 강하게 빨려 갑니다. 앞쪽에서 낮게 울리는 소리가 들립니다. 물 아래로 콘크리트 벽과 철문이 보이고, 그 아래 틈으로 물이 쏟아져 나갑니다. {n}은…',
  o:[
   {l:'물살을 거슬러 위쪽 얕은 곳으로 헤엄쳐 간다',chk:['p',65],ok:{t:'{n}은 수문에서 멀어질 때까지 꼬리를 저었습니다.',c:'good',fx:{p:2}},no:()=>wld08Gate()},
   {l:'벽 옆 물살이 소용돌이치는 곳에서 버틴다',chk:['g',60],ok:{t:'{n}은 소용돌이 가장자리에서 수문이 닫힐 때까지 버텼습니다.',c:'good',fx:{h:-5}},no:()=>wld08Gate()},
   {l:'벽에서 먼 바닥으로 내려가 몸을 붙인다',
    ok:()=>R()<.3?(wld_pass('g',isSp('motoro')?30:40)?{t:'수문 아래 물에 잔거품이 가득했습니다. {n}의 지느러미에 작은 기포가 맺혔다가 사라졌습니다.',c:'bad',fx:{h:-10},set:{gbd:1}}:{end:'WLD-08-B'}):{t:'{n}은 바닥에 붙어 수문 소리가 멎을 때까지 기다렸습니다.'}}
  ]}]);

/* WLD-09 녹조 [출처: 남조류 대발생 시 야간 용존산소 고갈, 마이크로시스틴의 어류 간 독성] */
function wld09Toxin(o){
  return ()=>{const r=valOf(o);if(r.end)return r;
    if(fl('algae')>=1&&!wld_pass('g',isSp('@scaleless')?50:40))return {end:'WLD-09-T'};
    return Object.assign({},r,{add:{algae:1},set:Object.assign({},r.set,{toxin:fl('algae')>=1?'microcystin':0,weight:'thin'})})}}
fev([{id:'WLD-09',stage:'wild',tier:'fact',cd:25,need:{season:'summer',wild_place:['reservoir','river','pond']},
  p:'물빛이 짙은 초록입니다. 수면에 초록 막이 엉겨 있고, 비린 풀 냄새가 납니다. 낮에는 숨쉬기가 편한데, 밤이 되면 물이 답답해집니다. 새벽에는 다른 물고기들이 모두 수면에 입을 대고 있습니다. {n}은…',
  o:[
   {l:'초록 막이 없는 물살 쪽을 찾아 멀리 헤엄쳐 간다',chk:['g',60],
    ok:()=>wld_pass('w',30)?{t:'{n}은 초록 막이 끝나는 곳까지 헤엄쳐 갔습니다. 물이 다시 투명했습니다.',c:'good',set:{algae:0,wild_place:'river'}}:wld09Toxin(wld09Surface)(),
    no:()=>wld09Toxin(wld09Surface)()},
   {l:'새벽마다 수면에 올라가 입을 댄다',ok:()=>wld09Toxin(wld09Surface)()},
   {l:'바닥 그늘에서 움직임을 줄인다',chk:['g',40],ok:()=>wld09Toxin({t:'{n}은 바닥 그늘에서 몸의 움직임을 줄인 채 새벽을 넘겼습니다.',fx:{h:-6}})(),no:{end:'WLD-09-D'}}
  ]}]);
function wld09Surface(){
  if(isSp('@airbreather'))return {t:'{n}은 새벽마다 수면에서 공기를 마셨습니다. 다른 물고기들 사이에서 숨은 막히지 않았습니다.',fx:{h:-4}};
  return wld_pass('g',50)?{t:'{n}은 새벽마다 수면 바로 아래에서 입을 벌리고 해가 뜨기를 기다렸습니다.',c:'bad',fx:{h:-10}}:{end:'WLD-09-D'}}

/* WLD-10 논물이 흘러드는 철 [출처: 유기인계·카바메이트계 살충제의 어류 아세틸콜린에스테라아제 저해·척추 변형, 국내 농약 유입 어류 폐사 사례] */
function wld10Exposed(){
  const need=60+(isSp('@scaleless')?15:0)-(isSp('@airbreather')?5:0)+(wld_size()===0?5:0);
  if(!wld_pass('g',need))return {end:'WLD-10-D'};
  const bent=isSp('koi','comet')&&R()<.4;
  return {t:bent?'{n}은 며칠 동안 몸을 떨다 살아남았습니다. 꼬리 쪽 등뼈가 옆으로 조금 휘었습니다.':'{n}은 며칠 동안 몸을 떨다가 살아남았습니다.',c:'bad',fx:{h:-20},set:{toxin:'pesticide',near_miss:1,inj_spine:bent?1:fl('inj_spine')}}}
fev([{id:'WLD-10',stage:'wild',tier:'fact',cd:40,need:{season:['spring','summer'],wild_place:['ditch','river','reservoir']},when:wld_warm,w:()=>fl('paddy')?2.5:1,
  p:'논 쪽에서 흙탕물이 흘러듭니다. 물에서 쓴맛과 기름 같은 냄새가 납니다. 물가 개구리 소리가 갑자기 줄어듭니다. 물살이 오는 쪽에서 작은 물고기들이 배를 위로 하고 떠내려옵니다. {n}은…',
  o:[
   {l:'흙탕물이 오는 반대쪽으로 거슬러 올라간다',chk:['p',50],ok:{t:'{n}은 냄새가 옅어질 때까지 물을 거슬러 올라갔습니다.',c:'good',set:{near_miss:1}},no:()=>wld10Exposed()},
   {l:'맑은 물이 솟는 바닥 쪽을 찾아 머문다',chk:['w',50],ok:{t:'{n}은 바닥에서 차가운 물이 솟는 자리를 찾아 그 위에 머물렀습니다.',c:'good',set:{near_miss:1}},no:()=>wld10Exposed()},
   {l:'지금 있는 수초 사이에 가만히 있는다',ok:()=>wld10Exposed()}
  ]}]);

/* WLD-11 수초 그늘의 가물치 [출처: 가물치 섭식 생태(매복·흡입 섭식)] */
fev([{id:'WLD-11',stage:'wild',tier:'likely',cd:30,need:{wild_place:['reservoir','ditch','river']},when:()=>season()!=='winter',
  p:'수초가 빽빽한 물가입니다. 물이 고요합니다. 수초 사이에 통나무 같은 어두운 무늬가 움직이지 않고 떠 있습니다. 그 앞을 지나가던 붕어 한 마리가 사라집니다. {n}은…',
  o:[
   {l:'수초를 벗어나 탁 트인 물로 빠르게 헤엄쳐 나간다',when:()=>wld_size()<2,chk:['p',50],ok:{t:'{n}은 수초를 벗어나 넓은 물로 빠져나갔습니다.',c:'good',set:{near_miss:1}},no:{end:'WLD-11-D'}},
   {l:'어두운 무늬에서 눈을 떼지 않고 천천히 뒤로 물러난다',when:()=>wld_size()<2,chk:()=>['w',isSp('channa')?45:50],ok:{t:'{n}은 어두운 무늬와 거리를 유지한 채 수초 밖으로 물러났습니다.',c:'good',fx:{w:3},set:{near_miss:1}},no:{end:'WLD-11-D'}},
   {l:'몸을 부풀린다',when:()=>isSp('fig8'),chk:['w',40],
    ok:{t:'가물치가 {n}을 입에 넣었다가 뱉었습니다. 공처럼 부푼 {n}은 수면으로 떠올라 한참을 그대로 떠 있었습니다.',c:'bad',fx:{h:-10},set:{near_miss:1},run:()=>wld_q('WLD-16')},no:{end:'WLD-11-D'}},
   {l:'바닥 진흙 가까이에서 움직이지 않는다',when:()=>wld_size()<2,
    ok:()=>{let p=wld_size()===0?.6:.4;if(isSp('@gold'))p=.25;if(isSp('pleco'))p+=.2;if(isSp('cory'))p+=.15;
      return R()<p?{t:isSp('cory')?'가물치가 {n}을 삼키려다 가슴 가시에 걸려 뱉었습니다. 가시 옆 지느러미가 찢어졌습니다.':'어두운 무늬는 {n}을 지나쳐 다른 쪽으로 떠갔습니다.',c:isSp('cory')?'bad':'sub',fx:isSp('cory')?{fin:.1}:{},set:{near_miss:1}}:{end:'WLD-11-D'}}}
  ],
  auto:()=>({t:'어두운 무늬가 {n}을 보고 수초 속으로 물러났습니다.',add:isSp('gar')?{gar_comp:1}:{}})}]);

/* WLD-12 밤의 메기 [출처: 메기 야간 섭식 생태] */
fev([{id:'WLD-12',stage:'wild',tier:'likely',cd:30,when:()=>season()!=='winter',
  p:'밤입니다. 물속이 거의 보이지 않습니다. 바닥 쪽에서 수염이 물을 쓸고 지나가는 진동이 옆구리에 닿습니다. 진동이 천천히 가까워집니다. {n}은…',
  o:[
   {l:'진동 반대쪽으로 수면 가까이 헤엄쳐 올라간다',when:()=>wld_size()<2,chk:['p',40],ok:{t:'{n}은 수면 가까이에서 진동이 멀어질 때까지 머물렀습니다.',c:'good',set:{near_miss:1}},no:{end:'WLD-12-D'}},
   {l:'진동이 지나가는 길을 감지하고 비켜선다',when:()=>wld_size()<2,chk:()=>['w',isSp('ghost')?50:60],ok:{t:'{n}은 진동이 지나가는 길에서 한 뼘 비켜섰습니다. 수염이 꼬리 끝을 스치고 지나갔습니다.',c:'good',fx:{w:3},set:{near_miss:1}},no:{end:'WLD-12-D'}},
   {l:'돌 틈에 몸을 끼우고 움직이지 않는다',when:()=>wld_size()<2,
    ok:()=>{let p=isSp('cory','clownloach','ghost','bichir','apisto','peapuffer')?.7:.4;if(isSp('clownloach'))p+=.1;if(isSp('@gold'))p-=.1;
      return R()<p?(isSp('clownloach')&&R()<.4?{t:'메기가 {n}을 입에 넣었다가 눈 밑 가시에 찔려 뱉었습니다. 옆구리가 긁혔습니다.',c:'bad',fx:{h:-8},set:{inj_skin:1,near_miss:1}}:{t:'진동은 돌 틈 앞을 지나 멀어졌습니다.',set:{near_miss:1}}):{end:'WLD-12-D'}}}
  ],
  auto:{t:'밤새 바닥에서 무언가가 {n} 옆을 지나갔습니다. {n}은 그것의 입보다 컸습니다.'}}]);

/* WLD-13 여울 바위 밑의 쏘가리 [출처: 쏘가리·꺽지 서식지와 섭식, 코리도라스 가슴 가시 고정 구조] */
const wld13Eaten=()=>({end:isSp('cory')?'WLD-13-C':'WLD-13-D'});
fev([{id:'WLD-13',stage:'wild',tier:'likely',cd:30,sp:['@small','@gold','clownloach','fig8','ghost'],need:{wild_place:'river'},when:()=>wld_warm()&&wld_size()<2,
  w:()=>wld_size()===0?1.2:.4,
  p:'물이 맑고 빠릅니다. 큰 바위들 사이로 물살이 갈라집니다. 바위 밑 그늘에 얼룩무늬가 섞여 잘 보이지 않습니다. 피라미 무리가 그 바위를 크게 돌아서 지나갑니다. {n}은…',
  o:[
   {l:'피라미 무리 한가운데로 들어가 같이 헤엄친다',chk:['g',30],
    ok:()=>(isSp('neon','@gold')||(isSp('guppy')&&!fem())||isSp('platy'))&&R()<.5?wld13Eaten():{t:'{n}은 피라미 무리에 섞여 바위 옆을 지나갔습니다.',c:'good',set:{schooling_ok:1,near_miss:1}},
    no:()=>wld13Eaten()},
   {l:'바위를 피해 물살 가운데로 지나간다',chk:['p',40],ok:{t:'{n}은 물살 한가운데를 타고 바위를 지나쳤습니다.',c:'good',set:{near_miss:1}},no:()=>wld13Eaten()},
   {l:'자갈 사이 작은 틈에 몸을 넣는다',ok:()=>R()<(isSp('neon','peapuffer','guppy','apisto')?.6:.4)?{t:'{n}은 자갈 틈에서 얼룩무늬가 바위 밑으로 돌아갈 때까지 기다렸습니다.',set:{near_miss:1}}:wld13Eaten()}
  ]}]);

/* WLD-14 수면을 가르는 무리 [출처: 끄리·강준치 표층 포식 생태, 보 하류 포식어 집결] */
fev([{id:'WLD-14',stage:'wild',tier:'likely',cd:30,need:{wild_place:['river','reservoir']},when:()=>season()!=='winter',
  p:'수면 바로 아래가 반짝입니다. 은빛 몸들이 한 방향으로 빠르게 몰려옵니다. 수면 위로 작은 물고기들이 튀어 오릅니다. 물이 갈라지는 소리가 가까워집니다. {n}은…',
  o:[
   {l:'튀어 오른 작은 물고기들을 따라 수면 위로 뛰어오른다',when:()=>wld_size()<2&&isSp('pleco','bichir','motoro'),chk:['p',999],lockText:'{n}은 물 밖으로 뛰어오르는 몸이 아니다',ok:{}},
   {l:'튀어 오른 작은 물고기들을 따라 수면 위로 뛰어오른다',when:()=>wld_size()<2&&!isSp('pleco','bichir','motoro'),chk:['p',55],
    ok:()=>isSp('betta')&&R()<.15?{end:'WLD-14-D'}:{t:'{n}은 수면 위로 튀어 올라 은빛 무리가 지나가는 길 밖으로 떨어졌습니다.',c:'good',set:{near_miss:1}},no:{end:'WLD-14-D'}},
   {l:'아래로 깊이 잠수한다',when:()=>wld_size()<2,chk:['g',40],ok:{t:'{n}은 깊은 곳으로 내려갔습니다. 은빛 무리는 수면 쪽을 훑고 지나갔습니다.',c:'good',set:{near_miss:1}},
    no:()=>R()<.5?{t:'은빛 몸 하나가 {n}의 옆구리를 스쳤습니다. 비늘 몇 장이 물에 흩어졌습니다.',c:'bad',fx:{h:-10},set:{scar:1}}:{end:'WLD-14-D'}},
   {l:'가장자리 수초에 몸을 붙이고 가만히 있는다',when:()=>wld_size()<2,ok:()=>R()<(isSp('@gold')?.35:.5)?{t:'은빛 무리는 수초 앞을 지나 하류로 내려갔습니다.',set:{near_miss:1}}:{end:'WLD-14-D'}}
  ],
  auto:{t:'은빛 무리가 {n}의 큰 몸을 피해 갈라져 지나갔습니다.'}}]);

/* WLD-15 배스가 사는 저수지 [출처: 블루길·배스 생태계교란 생물 지정과 섭식 생태] */
function wld15Nip(){const n=fl('fin_nip')+1;
  if(n>=2&&isSp('@longfin')||n>=3)return {end:'WLD-15-D'};
  return {t:'납작한 물고기들이 {n}의 지느러미 끝을 조금씩 뜯어 갔습니다.',c:'bad',fx:{fin:.12,h:-4},add:{fin_nip:1},set:{inj_fin:1}}}
fev([{id:'WLD-15',stage:'wild',tier:'likely',cd:25,need:{wild_place:['reservoir','pond']},when:()=>season()!=='winter',
  p:'물가 돌 틈 사이로 납작하고 둥근 물고기들이 떼 지어 다닙니다. 그 물고기들이 {n}의 지느러미 끝을 툭툭 칩니다. 조금 떨어진 곳에서 큰 입을 가진 그림자가 천천히 돌고 있습니다. {n}은…',
  o:[
   {l:'둥근 물고기들을 피해 넓은 물로 나간다',when:()=>wld_size()<2,chk:['p',50],
    ok:()=>R()<.5&&!wld_pass('w',50)?{end:'WLD-15-D'}:{t:'{n}은 납작한 물고기 떼를 떼어 내고 넓은 물로 나갔습니다. 큰 입의 그림자는 다른 쪽을 돌았습니다.',c:'good',set:{near_miss:1}},
    no:()=>wld15Nip()},
   {l:'돌 틈 안쪽 깊은 곳으로 들어간다',when:()=>wld_size()<2,chk:()=>['w',isSp('apisto')?35:40],ok:{t:'{n}은 돌 틈 안쪽에서 납작한 물고기들이 지나가기를 기다렸습니다.',c:'good'},no:()=>wld15Nip()},
   {l:'지금 자리에서 지느러미를 접고 버틴다',when:()=>wld_size()<2,ok:()=>R()<.3?{end:'WLD-15-D'}:wld15Nip()}
  ],
  auto:()=>({t:'납작한 물고기들은 {n}의 큰 몸 둘레를 돌다 흩어졌습니다.',add:isSp('gar')?{gar_comp:1}:{}})}]);

/* WLD-16 긴 다리의 새 [출처: 왜가리·백로 섭식 생태(머리부터 통째로 삼킴), 관상용 체색과 조류 포식 위험] */
const wld16Big=()=>wld_size()===2&&!isSp('arowana');
fev([{id:'WLD-16',stage:'wild',tier:'likely',cd:20,when:()=>wld_warm()&&(season()!=='winter'||isSp('@gold','koi')),
  w:()=>(isSp('@gold','koi')?2:1)*(1+fl('heron_up')*.5)*(['ditch','pond','outflow'].includes(fl('wild_place'))?1.4:1),
  p:'물이 발목 높이밖에 되지 않습니다. 물가에 회색·하얀 새가 한쪽 다리로 서 있습니다. 새는 움직이지 않습니다. 새의 그림자가 수면에 길게 걸쳐 있습니다. {n}은…',
  o:[
   {l:'그림자 반대쪽 깊은 물로 한 번에 내달린다',when:()=>!wld16Big(),chk:['p',50],ok:{t:'{n}은 깊은 물까지 단숨에 내달렸습니다.',c:'good',set:{near_miss:1}},no:{end:'WLD-16-D'}},
   {l:'새가 고개를 돌릴 때를 기다렸다가 천천히 움직인다',when:()=>!wld16Big(),chk:['w',50],ok:{t:'새가 고개를 돌린 사이 {n}은 깊은 쪽으로 미끄러져 갔습니다.',c:'good',fx:{w:2},set:{near_miss:1}},
    no:()=>R()<.5?{t:'새의 부리가 {n} 바로 옆 물을 찍었습니다. {n}은 흙탕물 속으로 빠져나갔습니다.',c:'bad',set:{near_miss:1}}:{end:'WLD-16-D'}},
   {l:'바닥 진흙 색에 몸을 붙이고 움직이지 않는다',when:()=>!wld16Big(),
    ok:()=>{let p=wld_drab()?.7:wld_bright()?.25:.5;if(isSp('motoro'))p+=.2;return R()<p?{t:'새는 한참 서 있다가 다른 물가로 날아갔습니다.',set:{near_miss:1}}:{end:'WLD-16-D'}}}
  ],
  auto:()=>isSp('koi','comet')?{t:'회색 새가 {n}의 등을 몇 번 쪼다가 포기했습니다. 쪼인 자리의 비늘이 떨어졌습니다.',c:'bad',fx:{h:-8},set:{inj_skin:1,scar:1}}:{t:'회색 새는 {n}의 큰 몸을 내려다보다 다른 물가로 날아갔습니다.'}}]);

/* WLD-17 물속으로 들어오는 검은 새 [출처: 민물가마우지 텃새화·유해야생동물 지정(2024년 환경부, 확인 필요), 잠수 추격 사냥 생태] */
fev([{id:'WLD-17',stage:'wild',tier:'likely',cd:30,need:{wild_place:['river','reservoir']},when:wld_warm,
  p:'수면 위로 검은 새 여러 마리가 떠 있습니다. 한 마리가 머리를 물속에 넣더니 몸 전체가 물속으로 들어옵니다. 새는 날개를 접고 발로 물을 차며 물고기처럼 빠르게 나아갑니다. 다른 새들도 하나씩 물속으로 들어옵니다. {n}은…',
  o:[
   {l:'새보다 빠르게 깊은 쪽으로 헤엄쳐 간다',when:()=>wld_size()<2,chk:['p',65],ok:{t:'{n}은 검은 새들보다 먼저 깊은 곳에 닿았습니다.',c:'good',set:{near_miss:1}},no:{end:'WLD-17-D'}},
   {l:'바닥 돌 사이로 파고든다',when:()=>wld_size()<2,chk:()=>['w',wld_size()===0||isSp('@bottom')?50:60],ok:{t:'{n}은 돌 사이 깊숙이 몸을 밀어 넣었습니다. 부리가 돌 틈 앞에서 몇 번 헛돌았습니다.',c:'good',set:{near_miss:1}},no:{end:'WLD-17-D'}},
   {l:'무리 속에 섞여 가만히 있는다',when:()=>wld_size()<2,
    ok:()=>R()<(isSp('cory','clownloach')?.5:.4)?(isSp('cory','clownloach')&&R()<.5?{t:'검은 새가 {n}을 삼키다 가시에 걸려 토해 냈습니다. 옆구리에 부리 자국이 남았습니다.',c:'bad',fx:{h:-10},set:{inj_skin:1}}:{t:'검은 새들은 무리의 다른 쪽을 몰아갔습니다.',set:{near_miss:1}}):{end:'WLD-17-D'}}
  ],
  auto:()=>R()<.3?{t:'검은 새의 부리가 {n}의 등을 찍고 지나갔습니다. 삼키기에는 몸이 너무 컸습니다.',c:'bad',fx:{h:-6},set:{inj_skin:1}}:{t:'검은 새들은 {n}의 큰 몸을 지나쳐 작은 물고기들을 쫓아갔습니다.'}}]);

/* WLD-18 물가의 수달 [출처: 수달 천연기념물·멸종위기 지정, 수달 섭식(잉어 등 대형 어류 포함)] */
function wld18Caught(){
  if(isSp('gar','pleco')&&wld_pass('g',80))return {t:'수달의 이빨이 {n}의 단단한 비늘에 미끄러졌습니다. 수달은 {n}을 놓고 다른 쪽으로 헤엄쳐 갔습니다.',c:'bad',fx:{h:-15},set:{inj_skin:1,near_miss:1}};
  if(isSp('motoro')&&R()<.3)return {t:'수달이 {n}을 뒤집어 잡는 순간 꼬리가 휘었습니다. 수달이 {n}을 놓고 물가로 물러났습니다.',c:'bad',fx:{h:-12},set:{inj_skin:1,near_miss:1}};
  return {end:'WLD-18-D'}}
fev([{id:'WLD-18',stage:'wild',tier:'likely',cd:40,w:.4,need:{wild_place:['river','reservoir']},when:wld_warm,
  p:'새벽입니다. 물가 바위 위에서 무언가가 미끄러지듯 물속으로 들어옵니다. 물속에서 몸을 크게 굽히며 빠르게 방향을 바꿉니다. 수염이 난 얼굴이 {n} 쪽을 향합니다. {n}은…',
  o:[
   {l:'전속력으로 깊은 물로 달아난다',chk:['p',65],ok:{t:'{n}이 깊은 물로 달아나자 수달은 다른 쉬운 먹이 쪽으로 방향을 바꿨습니다.',c:'good',set:{near_miss:1}},no:()=>wld18Caught()},
   {l:'바위 틈 안쪽으로 몸을 밀어 넣는다',when:()=>wld_size()===2,chk:['w',999],lockText:'{n}의 몸이 들어갈 틈이 없다',ok:{}},
   {l:'바위 틈 안쪽으로 몸을 밀어 넣는다',when:()=>wld_size()<2,chk:['w',50],ok:{t:'수달의 앞발이 바위 틈 앞을 몇 번 더듬다 멀어졌습니다.',c:'good',set:{near_miss:1}},no:()=>wld18Caught()},
   {l:'바닥에 붙어 움직이지 않는다',ok:()=>R()<.3?{t:'수달은 바닥을 뒤지다 다른 물고기를 물고 올라갔습니다.',set:{near_miss:1}}:wld18Caught()}
  ]}]);

/* WLD-19 물풀 속의 침 [출처: 잠자리 유충 포식 구조(아랫입술), 물장군 체외 소화·멸종위기 야생생물 II급 지정] */
const wld19Eaten=()=>Object.assign({end:R()<.1?'WLD-19-W':'WLD-19-D'},isSp('guppy','platy')?{add:{guppy_kingdom:0}}:{});
fev([{id:'WLD-19',stage:'wild',tier:'likely',cd:30,sp:['neon','peapuffer','guppy','platy','apisto'],need:{season:['spring','summer'],wild_place:['ditch','pond','reservoir']},
  p:'물풀 줄기 사이가 고요합니다. 줄기에 붙은 갈색 덩어리가 아주 천천히 자리를 옮깁니다. 덩어리 앞쪽이 접혔다 펴집니다. {n} 옆에 있던 작은 올챙이가 사라집니다. {n}은…',
  o:[
   {l:'물풀 밖으로 빠르게 빠져나간다',chk:['p',15],ok:{t:'{n}은 물풀 밖 트인 물로 빠져나왔습니다.',c:'good',set:{near_miss:1}},no:()=>wld19Eaten()},
   {l:'덩어리 움직임을 지켜보며 거리를 둔다',chk:['w',35],ok:{t:'{n}은 갈색 덩어리와 한 뼘 거리를 유지했습니다. 덩어리는 다른 줄기로 옮겨 갔습니다.',c:'good',fx:{w:2},set:{near_miss:1}},no:()=>R()<.5?{t:'갈색 덩어리 앞쪽이 펴졌다가 {n}의 꼬리 앞에서 헛돌았습니다.',c:'bad'}:wld19Eaten()},
   {l:'물풀 뿌리 사이에 가만히 있는다',ok:()=>R()<.5?{t:'갈색 덩어리는 {n}을 지나 다른 줄기로 올라갔습니다.'}:wld19Eaten()}
  ]}]);

/* WLD-20 족대와 통발 [출처: 천렵·통발 관행, 담수 가오리 독침 사고] */
function wld20Caught(){
  if(isSp('motoro'))return {end:'WLD-20-M'};
  if(isSp('gar'))return {t:'"이거 악어 아니야?" 사람들이 {n}의 사진을 찍고 어딘가에 전화를 걸었습니다. 그사이 {n}은 족대 틈으로 빠져나갔습니다.',c:'bad',fx:{h:-8},set:{reported:1,viral:1}};
  if(isSp('@gold','koi')){const r=R();
    if(r<.5)return {t:'"누가 버렸네." 사람이 {n}을 다시 물에 놓아 주었습니다. 손이 닿은 자리의 점막이 벗겨졌습니다.',c:'bad',fx:{h:-6},set:{slime_loss:1}};
    if(r<.8)return {t:'"집에 가져가자." {n}은 양동이째 차에 실렸습니다.',c:'bad',run:()=>{S.wild=false;S.f.released=0;fRehome('{n}은 냇가에서 건져진 물고기로 새 집에 들어갔습니다.',{own:'casual',note:'냇가에서 주워 옴'})}};
    return {end:'WLD-20-D'}}
  if(isSp('betta','guppy','platy','cory')&&wld_pass('c',60))return {end:'HAP-43'};
  if(isSp('cory','clownloach'))return R()<.5?{t:'족대 그물에 가시가 걸렸습니다. 사람이 그물째 털어 내자 {n}은 지느러미가 찢긴 채 물로 떨어졌습니다.',c:'bad',fx:{fin:.15,h:-8},set:{inj_fin:1,inj_skin:1}}:{end:'WLD-20-D'};
  if(isSp('@tropical')&&R()<.4)return {t:'"열대어가 왜 여기 있지?" {n}은 페트병에 담겨 누군가의 집으로 갔습니다.',c:'sub',run:()=>{S.wild=false;S.f.released=0;fRehome('{n}은 냇가에서 건져진 열대어로 새 집에 들어갔습니다.',{note:'냇가에서 주워 옴'})}};
  return {end:'WLD-20-D'}}
fev([{id:'WLD-20',stage:'wild',tier:'likely',cd:40,need:{season:'summer',wild_place:['river','ditch']},
  p:'물가에 사람 발이 여럿 들어옵니다. 바닥 돌이 뒤집히고 흙탕물이 일어납니다. 앞쪽에 그물이 펼쳐져 있고, 다른 쪽 돌 틈에는 미끼 냄새가 나는 원통이 놓여 있습니다. {n}은…',
  o:[
   {l:'사람 발 사이로 빠져나가 하류로 내려간다',chk:['p',40],ok:{t:'{n}은 사람 발 사이를 빠져나가 하류로 내려갔습니다.',c:'good',set:{near_miss:1}},no:()=>wld20Caught()},
   {l:()=>fst().w>=50?'미끼 냄새가 나는 원통 쪽으로 간다 — 원통 입구가 안쪽으로 좁아진다':'미끼 냄새가 나는 원통 쪽으로 간다',
    ok:()=>wld_size()===2?{t:'원통 입구가 {n}의 머리보다 좁았습니다. {n}은 미끼 냄새만 맡고 돌아섰습니다.'}:wld20Caught()},
   {l:'흙탕물 속 돌 밑에 그대로 있는다',ok:()=>R()<.4?{t:'사람들은 {n}이 숨은 돌을 뒤집지 않고 지나갔습니다.',set:{near_miss:1}}:wld20Caught()}
  ]}]);

/* WLD-21 낚싯바늘 [출처: 국내 저수지 대형 관상어(아로와나·레드파쿠 등) 낚시 포획 보도, 생태계교란 생물 재방류 금지 규정 적용 범위] */
function wld21Landed(){
  if(isSp('koi','comet'))return R()<.6?{t:'낚시꾼은 {n}의 입에서 바늘을 빼고 물에 다시 넣었습니다. 위턱에 구멍이 남았습니다.',c:'bad',fx:{h:-8},set:{slime_loss:1}}
    :{t:'"이건 가져가야겠다." {n}은 낚시꾼의 살림망에 들어갔습니다.',c:'bad',run:()=>{S.wild=false;S.f.released=0;fRehome('{n}은 저수지 낚시꾼의 집 마당 고무 대야로 갔습니다.',{own:'casual',note:'낚시로 잡혀 감'})}};
  if(isSp('gar'))return fl('gar_size')>=3?{end:'HAP-12'}:{t:'낚시꾼은 {n}을 다시 넣지 않고 사진을 찍어 신고했습니다. 신고가 접수되는 사이 {n}은 물가 웅덩이에서 미끄러져 저수지로 돌아갔습니다.',c:'bad',fx:{h:-15},set:{reported:1,viral:1}};
  return {set:{viral:isSp('oscar','arowana','channa')?1:0},end:'WLD-21-D'}}
fev([{id:'WLD-21',stage:'wild',tier:'likely',cd:30,need:{wild_place:['reservoir','river']},when:()=>season()!=='winter'&&wld_warm(),
  w:()=>isSp('comet','koi','oscar','arowana','channa','gar','bichir')?1:isSp('pleco')?.4:.15,
  p:'물속에 반짝이는 작은 것이 떨어집니다. 떨어진 것이 흔들리며 다가오고, 지렁이 냄새가 납니다. 위쪽으로 아주 가는 실 하나가 수면까지 이어져 있습니다. {n}은…',
  o:[
   {l:'단숨에 물고 깊은 곳으로 끌고 간다',chk:()=>capOf('p')>=65?['p',65]:null,
    ok:()=>capOf('p')<65?wld21Landed():{t:'줄이 팽팽해졌다가 끊어졌습니다. {n}의 입가에 바늘이 남았습니다.',c:'bad',fx:{h:-6},set:{hooked:1,near_miss:1}},
    no:()=>wld21Landed()},
   {l:'몇 번 건드려 보고 냄새만 맡는다',chk:()=>capOf('w')>=50?['w',50]:null,
    ok:()=>capOf('w')<50&&R()<.5?wld21Landed():{t:'{n}은 바늘 끝에 걸린 미끼만 뜯어 먹었습니다.',c:'good',fx:{h:4},set:{weight:'ok'}},
    no:()=>wld21Landed()},
   {l:'무시하고 바닥에 있는다',ok:{t:'반짝이는 것은 한참 흔들리다 위로 올라갔습니다.'}}
  ]}]);

/* WLD-22 퇴치 작업 [출처: 2015년 강원 횡성 저수지 피라냐·레드파쿠 발견 후 물 빼기 수색, 국내 저수지 앨리게이터 가아 포획 사례, 전기충격 어구 조사·퇴치 방식] */
const wld22Target=()=>isSp('gar','oscar','arowana','channa','pleco');
/* a target is always caught in the end (no escape the real world does not have); how long it lasted decides gar's fate */
function wld22Catch(lasted){
  if(isSp('gar')){if(lasted&&fl('gar_size')>=3&&wld_pass('p',85))return {end:'HAP-37'};if(fst().p>=90*.9||fl('gar_size')>=4)return {end:'HAP-12'}}
  return {end:'WLD-22-D'}}
function wld22Spare(){return R()<.5?{t:'작업자들이 그물에 걸린 토종 물고기들과 함께 {n}을 다른 저수지로 옮겼습니다.',c:'bad',fx:{h:-12},set:{wild_place:wld_newPlace(),reported:0}}:{t:'물이 다시 차올랐습니다. {n}은 바닥에서 몸을 떨며 살아남았습니다.',c:'bad',fx:{h:-18},set:{reported:0}}}
fev([{id:'WLD-22',stage:'wild',tier:'fact',cd:40,w:2.5,need:{reported:1,wild_place:['reservoir','pond']},
  p:'물가에 사람이 많아지고 큰 기계 소리가 납니다. 물이 하루하루 빠집니다. 물속에 들어온 사람들이 막대를 휘두르고, 막대 근처의 물고기들이 갑자기 몸을 뻣뻣하게 펴고 떠오릅니다. {n}은…',
  o:[
   {l:'남은 물 중 가장 깊은 곳으로 내려간다',chk:()=>['g',wld22Target()?80:60],
    ok:()=>wld22Target()?Object.assign(wld22Catch(true),{t:'{n}은 남은 물이 무릎 깊이가 될 때까지 버텼습니다.'}):{t:'{n}은 가장 깊은 웅덩이 바닥에서 물이 다시 찰 때까지 버텼습니다.',c:'good',set:{reported:0}},
    no:()=>wld22Target()?wld22Catch(false):wld22Spare()},
   {l:'진흙 속으로 파고든다',chk:()=>isSp('@airbreather')?['g',60]:['g',999],lockText:'{n}은 공기로 숨을 쉴 수 없다',
    ok:()=>wld22Target()?Object.assign(wld22Catch(true),{t:'{n}은 진흙 속에서 공기를 마시며 며칠을 버텼습니다.'}):{t:'{n}은 진흙 속에서 공기를 마시며 작업이 끝날 때까지 버텼습니다.',c:'good',set:{reported:0}},
    no:()=>wld22Target()?wld22Catch(false):wld22Spare()},
   {l:'물가 수초 사이에 가만히 있는다',ok:()=>wld22Target()?wld22Catch(false):R()<.4?{t:'막대는 {n}이 숨은 수초를 지나쳐 갔습니다.',set:{reported:0}}:wld22Spare()}
  ]}]);

/* WLD-23 붕어 무리 속의 금붕어 [출처: 금붕어·붕어 동일 종 교잡과 체색 회귀, 관상 잉어 방류에 의한 잉어 유전자 교란] */
fev([{id:'WLD-23',stage:'wild',tier:'fact',cd:30,sp:['@gold','koi'],when:()=>fl('winter_survived')>=1||season()==='spring',
  p:'같은 모양의 몸을 가진 물고기 무리가 물가를 지나갑니다. 무리의 몸은 모두 갈색이고, {n}만 다른 색입니다. 무리에서 나는 냄새가 낯설지 않습니다. 봄 물풀 사이로 무리가 몰려 들어갑니다. {n}은…',
  o:[
   {l:'무리를 따라 물풀 사이로 들어간다',chk:['g',50],
    ok:()=>isSp('koi','comet')&&fst().g>=80&&fl('winter_survived')>=3?{end:'WLD-23-E'}
      :isSp('oranda','ryukin')&&R()<.5?{t:'{n}은 무리를 따라가다 뒤처졌습니다. 갈색 무리는 물풀 너머로 사라졌습니다.',c:'bad',add:{heron_up:1}}
      :{t:'{n}은 갈색 무리에 섞여 물풀 사이에 알을 흩뿌렸습니다.',c:'good',set:{schooling_ok:1,hybrid:1},mem:'갈색 무리. 낯설지 않은 냄새.'},
    no:{t:'{n}은 무리의 속도를 따라가지 못했습니다.',add:{heron_up:1}}},
   {l:'무리에서 조금 떨어져 따라간다',chk:['w',30],ok:{t:'{n}은 무리 가장자리를 따라다녔습니다.',set:{schooling_ok:1}},no:{t:'무리는 {n}을 두고 멀어졌습니다.',add:{heron_up:1}}},
   {l:'혼자 원래 자리에 남는다',ok:{t:'{n}은 혼자 남았습니다. 주황색 몸이 물가에서 또렷했습니다.',add:{heron_up:1}}}
  ]}]);

/* WLD-24 몸에 박힌 닻 [출처: 닻벌레(Lernaea)·물이(Argulus) 기생 병리, 국내 담수어 감염] */
const wld24Hurt=()=>fl('inj_skin')||fl('inj_fin')||fl('slime_loss')||fl('scar')||fl('hooked');
fev([{id:'WLD-24',stage:'wild',tier:'fact',cd:40,need:{season:['spring','summer']},when:wld_warm,
  w:()=>(wld24Hurt()?2:1)*(isSp('@gold','koi')?1.6:isSp('gar','pleco')?.4:1),
  p:'물이 따뜻해집니다. 옆구리에 작은 따끔거림이 생기고 사라지지 않습니다. 몸을 바위에 문질러도 따끔거림이 남습니다. 몸 여기저기에 가는 실 같은 것이 붙어 하늘거립니다. {n}은…',
  o:[
   {l:'바닥 자갈에 몸을 세게 문지른다',chk:['p',30],ok:{t:'납작한 벌레 몇 마리가 떨어져 나갔습니다. 근육에 머리를 박은 실 같은 것은 그대로 남았고, 문지른 자리가 벌겋게 쓸렸습니다.',c:'bad',fx:{h:-6},set:{inj_skin:1,parasite_ext:1}},no:()=>wld24Endure()},
   {l:'물살이 센 곳으로 가서 몸을 씻는다',chk:['g',50],ok:{t:'센 물살에 몸에 붙은 것 일부가 떨어져 나갔습니다.',c:'good',fx:{h:-3},set:{scar:1}},no:()=>wld24Endure()},
   {l:'그늘에 가만히 있는다',ok:()=>wld24Endure()}
  ]}]);
function wld24Endure(){return wld_pass('g',40+(isSp('@scaleless')||wld_size()===0?10:0))?{t:'몸에 박힌 것들 둘레가 붉게 부었다가 가라앉았습니다. 흉터가 남았습니다.',c:'bad',fx:{h:-12},set:{scar:1,parasite_ext:1}}:{end:'WLD-24-D'}}

/* WLD-25 변기 아래로 — no choice inside the pipe [출처: 변기 배출 관상어의 생존 가능성 — '하수구에서 살아남는다'는 통념 반박 자료] */
fev([{id:'WLD-25',stage:'home',tier:'fact',notSp:['@big'],own:['casual','neglect','eager','gift','breakup','relay','alchemist'],cd:60,
  w:()=>S.f.ill||S.health<40?.6:fl('playdead')?.3:.03,
  log:()=>S.f.ill||S.health<40?'주인이 바닥에 가라앉은 {n}을 보고 "죽었나 봐" 하며 뜰채를 들었습니다.':'이삿짐을 싸던 주인이 수조를 보며 "얘는 데려갈 수가 없네"라고 말했습니다.',
  auto:{t:'주인은 {n}을 뜰채째 변기에 털어 넣고 물을 내렸습니다.',c:'bad',set:{flushed:1},end:'WLD-25-D'}}]);

/* WLD-26 저수지에서 자라는 몸 [출처: 앨리게이터 가아 최대 크기·수명, 국내 저수지 가아 발견·포획 보도, 국내 법적 지위] */
fev([{id:'WLD-26',stage:'wild',tier:'likely',sp:['gar'],cd:20,need:{wild_place:['reservoir','river','outflow']},
  w:()=>fl('winter_survived')>=1||S.flags.wintered||S.f.warm?2+fl('gar_comp')*.3:.3,
  p:'저수지 물이 예전보다 좁게 느껴집니다. 수면 근처를 지나가던 붕어 무리가 {n}의 그림자를 보고 흩어집니다. 물가 낚싯대 끝이 {n} 쪽을 향합니다. 수면에 올라가 공기를 마실 때마다 물가에서 사람 목소리가 커집니다. {n}은…',
  o:[
   {l:'수면 가까이에서 붕어 무리를 매복한다',chk:['p',85],
    ok:()=>fl('gar_size')>=4&&wld_pass('p',90)?{end:'HAP-12'}:{t:'{n}은 붕어 무리를 한입에 삼켰습니다. 몸이 또 한 뼘 길어졌습니다.',c:'sub',fx:{p:5,h:6},add:{gar_size:1},set:{reported:R()<.35?1:fl('reported')}},
    no:{t:'{n}이 덮친 붕어 옆에 반짝이는 것이 매달려 있었습니다.',c:'bad',run:()=>wld_q('WLD-21')}},
   {l:'사람 목소리가 없는 깊은 쪽으로 옮긴다',chk:['w',40],ok:{t:'{n}은 깊은 물로 내려가 한동안 수면에 오르지 않았습니다.',c:'good',add:{gar_size:.5}},no:{t:'깊은 쪽에도 낚시꾼이 있었습니다. 누군가 {n}의 등을 사진으로 찍었습니다.',set:{reported:1,viral:1}}},
   {l:'갈대 그늘에 길게 떠서 움직이지 않는다',ok:()=>R()<.3?{t:'{n}이 공기를 마시러 수면에 오른 순간, 물가에서 누군가 소리를 질렀습니다.',set:{reported:1},add:{gar_size:.5}}:{t:'{n}은 갈대 그늘에서 통나무처럼 떠 있었습니다.',add:{gar_size:.5}}}
  ]}]);

/* WLD-27 여름 논의 베타 [출처: 베타 원서식지(논·습지), 논 중간 물떼기 시기] */
fev([{id:'WLD-27',stage:'wild',tier:'likely',cd:15,sp:['betta','wildbetta','guppy','platy','cory'],need:{season:'summer',wild_place:['ditch']},
  w:()=>isSp('betta','wildbetta')?2:.6,
  p:'물이 얕고 따뜻합니다. 벼 줄기 사이로 햇빛이 비칩니다. 물이 탁하지만, 수면에 올라가 공기를 마시면 숨이 편합니다. 벼 사이에 모기 유충이 많습니다. {n}은…',
  o:[
   {l:'벼 줄기 사이를 돌아다니며 유충을 잡아먹는다',chk:['w',40],
    ok:()=>{const n=fl('rice')+1;return {t:isSp('betta')&&n>=3?'{n}은 벼 사이 수면 아래 거품집을 지었습니다. 거품집은 아무도 찾아오지 않은 채 며칠 뒤 꺼졌습니다. 벼가 누렇게 익을 무렵 논물이 빠졌습니다.':'{n}은 유충을 배불리 먹었습니다.',c:'good',fx:{g:3,h:6},set:{weight:'ok',paddy:1},add:{rice:1}}},
    no:{t:'{n}이 벼 사이로 나온 순간 하얀 새의 다리가 물에 들어왔습니다.',c:'bad',set:{paddy:1},run:()=>wld_q('WLD-16')}},
   {l:'물이 가장 깊은 배수구 쪽에 머문다',chk:['g',40],ok:()=>R()<.3?{t:'논물을 빼는 날이었습니다. {n}은 배수로로 함께 빠져나갔습니다.',c:'bad',set:{paddy:1},run:()=>wld_q('WLD-06')}:{t:'{n}은 배수구 옆 깊은 물에서 여름을 났습니다.',set:{paddy:1}},no:{t:'{n}은 배수구 물살에 지쳤습니다.',fx:{h:-6}}},
   {l:'벼 그늘 수면 아래에 가만히 떠 있는다',ok:{t:'{n}은 벼 그늘 아래에서 수면 공기를 마시며 하루를 보냈습니다.',set:{paddy:1}}}
  ]}]);

/* WLD-28 생태공원 연못의 빵 부스러기 [출처: 공원 연못 과도한 빵 급여와 수질·어류 건강] */
fev([{id:'WLD-28',stage:'wild',tier:'likely',cd:20,need:{wild_place:'pond'},when:()=>isSp('@gold','koi')||season()==='summer',w:()=>isSp('@gold','koi')?1.5:.5,
  p:'물가 난간에 사람들이 모여 있습니다. 수면 위로 하얀 조각들이 떨어집니다. 다른 잉어들이 입을 벌리고 서로 몸을 밀며 모여듭니다. 떨어지는 조각에서 달고 기름진 냄새가 납니다. {n}은…',
  o:[
   {l:'잉어 무리 사이를 비집고 조각을 받아먹는다',chk:['p',50],
    ok:()=>isSp('oranda','ryukin')&&fl('bread')>=1?{end:'WLD-28-D'}:{t:'{n}은 하얀 조각을 배가 불룩해질 때까지 받아먹었습니다.',c:'sub',fx:{fat:.2,h:3},set:{weight:'fat'},add:{bread:1}},
    no:{t:'더 큰 잉어들이 {n}을 밀쳐 냈습니다. 지느러미 끝이 찢겼습니다.',c:'bad',fx:{fin:.1},set:{inj_fin:1}}},
   {l:'무리 가장자리에서 가라앉는 조각만 주워 먹는다',chk:['w',30],
    ok:()=>isSp('oranda','ryukin')&&fl('bread')>=2?{end:'WLD-28-D'}:{t:'{n}은 가라앉는 조각을 몇 개 주워 먹었습니다.',fx:{h:3},add:{bread:isSp('oranda','ryukin')?1:0}},
    no:{t:'가라앉는 조각은 다른 물고기들이 먼저 먹었습니다.',fx:{h:-2}}},
   {l:'연못 바닥에 남는다',ok:{t:'{n}은 바닥에 남았습니다. 그날 먹은 것은 거의 없었습니다.',fx:{h:-4},set:{weight:'thin'}}}
  ]}]);

/* ---------- WLD endings ---------- */
fevEnd({
 'WLD-01-D':wld_bad('방류','f-float',['{n}은 꼬리를 저어 물살을 버팁니다. 물살이 {n}을 바위 모서리로 밀어붙입니다.','옆구리 비늘이 떨어지고 그 아래 표피가 벗겨져 하얀 진피가 드러납니다. {n}은 다시 헤엄쳐 나오고, 같은 바위에 한 번 더 부딪힙니다.','벗겨진 자리에서 점액이 빠져나가고, 그 자리로 물이 스며들어 몸의 염분이 빠집니다.','저녁 무렵 {n}은 물가 수초 뿌리에 걸린 채 아가미 뚜껑만 느리게 움직입니다.'],{fact:'fRelease'}),
 'WLD-02-D':wld_bad('동사','f-ice',()=>['수온이 내려가자 {n}의 근육이 수축할 때마다 힘이 덜 실립니다. 지느러미 박동이 느려지고, 몸이 물살에 밀려 기웁니다.','{n}은 꼬리를 저어 몸을 바로 세우려 하지만 몸이 다시 옆으로 돌아갑니다.'].concat(isSp('@airbreather')?['{n}은 수면까지 올라가 공기를 마시려 합니다. 몸이 수면에 닿기 전에 다시 가라앉습니다.']:[]).concat(['아가미 뚜껑이 열리고 닫히는 사이가 점점 길어집니다. 심장 박동이 느려지다가 멈춥니다.','물이 차가워서 {n}의 몸은 한동안 썩지 않고 바닥 돌 사이에 그대로 남아 있습니다.']),{tier:'fact',fact:'fTemp'}),
 'WLD-03-D':wld_bad('겨울 폐사','f-ice',['얼음과 그 위에 쌓인 눈이 빛을 막자 물속 수초와 조류가 산소를 만들지 못합니다. 바닥의 낙엽이 썩으면서 남은 산소를 씁니다.','{n}은 얼음 바로 아래까지 올라가 입을 대고, 얼음에 막혀 다시 내려옵니다.','아가미 새엽의 혈관이 넓어지고 아가미 뚜껑이 쉬지 않고 움직입니다. {n}은 얼음 아래를 따라 몇 번 더 헤엄칩니다.','봄에 얼음이 녹자 {n}은 다른 물고기들과 함께 물가에 떠밀려 와 있습니다.'],{tier:'fact',fact:'fO2'}),
 'WLD-04-D':wld_bad('방류수','f-eaten',['배출구 앞 물에는 처리하고 남은 질소 화합물과 세제 성분이 섞여 있습니다.','{n}의 아가미 새엽 상피가 부어오르고, 새엽 사이 틈이 좁아집니다. {n}은 물살이 약한 가장자리로 옮겨 가 아가미 뚜껑을 빠르게 움직입니다.','따뜻한 물에 모인 작은 물고기를 노리던 백로가 가장자리 얕은 물에 서 있습니다.','{n}은 수초 쪽으로 몸을 돌리다 부리에 집혀 물 밖으로 들립니다.']),
 'WLD-05-D':wld_bad('정비 공고','f-ice',['수온이 몇 시간 만에 크게 떨어지자 {n}의 몸은 그 변화를 따라가지 못합니다.','측선을 따라 근육이 떨리고, {n}은 옆으로 기운 채 원을 그리며 헤엄칩니다. 아가미 뚜껑 움직임이 얕아집니다.','따뜻한 물에서 함께 지내던 무리가 하나씩 바닥으로 가라앉습니다.','{n}은 가라앉은 몸들 사이에서 꼬리를 몇 번 더 젓고, 움직이지 않습니다.'],{fact:'fTemp'}),
 'WLD-06-D':wld_bad('가뭄','f-float',['수온이 오를수록 물에 녹을 수 있는 산소는 줄고 {n}이 쓰는 산소는 늘어납니다.','웅덩이에 남은 물고기들이 모두 수면 아래에 입을 대고 모여 있습니다. {n}은 그 사이로 비집고 들어가 입을 벌립니다.','아가미 새엽의 모세혈관이 늘어나 새엽이 짙은 붉은색이 됩니다. 새벽, 산소가 가장 적은 시간에 {n}은 옆으로 기울어 가라앉습니다.','해가 뜨자 왜가리가 물가에 떠오른 몸들을 차례로 집어 삼킵니다.'],{tier:'fact',fact:'fO2'}),
 'WLD-07-D':wld_bad('둔치','f-floor',['물이 빠지는 속도가 {n}이 헤엄치는 속도보다 빠릅니다. {n}은 풀뿌리 사이에 남은 얕은 물에서 몸을 뒤집으며 본류 쪽으로 튑니다.','물이 손바닥 깊이가 되고, 등지느러미와 등이 공기 중에 드러납니다. 햇볕에 피부 점액이 마르면서 하얗게 굳습니다.','아가미 새엽이 서로 들러붙어 물이 남아 있어도 숨을 쉬지 못합니다.','다음 날 산책로를 지나던 사람이 진흙에 박힌 {n}의 사진을 찍습니다.']),
 'WLD-07-S':wld_bad('떠내려감','f-float',['{n}은 꼬리를 저어 물살을 버티지만 몸이 물살보다 가볍습니다.','탁한 물에 떠다니는 모래 알갱이가 아가미 새엽 사이에 끼어 상피를 긁습니다.','{n}은 비닐 조각과 나뭇잎 사이에 섞여 하류로 내려갑니다. 그 뒤로 {n}을 본 사람은 없습니다.']),
 'WLD-08-D':wld_bad('수문','f-bottom',['물살이 {n}을 철문 아래 틈으로 끌고 들어갑니다. 콘크리트 턱에 머리가 부딪히면서 두개골 위 비늘과 피부가 찢어집니다.','물이 떨어지는 아래쪽에서 {n}의 몸이 한 번 더 바닥 콘크리트에 부딪힙니다. 척추 한 마디가 어긋나 꼬리 쪽이 다른 각도로 꺾입니다.','{n}은 가슴지느러미로 물을 저어 하류 쪽으로 나아가지만 몸이 계속 한쪽으로 돕니다.','수문 아래 소용돌이에서 같은 자리를 몇 번 더 돌고, 물살에 실려 내려갑니다.']),
 'WLD-08-B':wld_bad('기포병','f-float',['높은 곳에서 떨어진 물에 공기가 과하게 녹아 있습니다. 그 물을 들이마신 {n}의 혈액 속에서 녹아 있던 기체가 다시 기포로 나옵니다.','지느러미 막 사이와 눈 뒤쪽에 작은 기포가 줄지어 생깁니다. 안구가 앞으로 밀려 나옵니다.','아가미 새엽의 가는 혈관이 기포로 막혀 피가 돌지 않습니다.','{n}은 수면 가까이에서 몸을 기울인 채 헤엄치다 멈춥니다.'],{tier:'fact'}),
 'WLD-09-D':wld_bad('녹조','f-float',['낮 동안 산소를 만들던 남조류가 밤에는 산소를 씁니다. 해 뜨기 직전, 물속 산소가 가장 적어집니다.','{n}은 수면 바로 아래에서 입을 벌리고 다른 물고기들과 부딪힙니다. 아가미 뚜껑이 쉬지 않고 열립니다.','{n}의 몸이 기울며 수면의 초록 막 속으로 떠오릅니다.','아침 햇빛이 비칠 때 초록 막 위에 {n}의 하얀 배가 다른 배들과 나란히 떠 있습니다.'],{tier:'fact',fact:'fO2'}),
 'WLD-09-T':wld_bad('녹조 독소','f-poison',['{n}이 먹이와 함께 삼킨 남조류에서 간독소가 장으로 흡수됩니다.','간세포가 차례로 무너지고, 간이 붓고 색이 옅어집니다. {n}의 배가 조금씩 부풀고, 먹이를 봐도 입을 열지 않습니다.','헤엄칠 때 몸이 한쪽으로 기웁니다.','며칠 뒤 {n}은 물가 그늘에서 아가미 뚜껑을 천천히 두어 번 더 움직이고 멈춥니다.'],{tier:'fact'}),
 'WLD-10-D':wld_bad('농약','f-poison',['물에 섞인 살충 성분이 아가미 상피를 통해 혈액으로 들어옵니다. 신경 끝에서 신호를 끊어 주는 효소가 막히자 근육이 쉬지 못하고 계속 수축합니다.','{n}은 같은 자리에서 몸을 떨다가 갑자기 수면 쪽으로 튀어 오릅니다. 근육이 한쪽으로만 당겨 척추가 옆으로 휩니다.','휜 몸으로 {n}은 계속 헤엄치려 하고, 그때마다 원을 그립니다.','경련이 잦아들 무렵 아가미 뚜껑도 함께 멈춥니다.'],{tier:'fact'}),
 'WLD-11-D':wld_bad('매복','f-eaten',['가물치가 입을 벌리는 순간 주변 물이 입 안으로 빨려 들어갑니다. {n}의 몸이 물과 함께 끌려가고, 안쪽으로 휜 이빨이 옆구리 비늘 사이로 박힙니다.','{n}은 몸을 비틀어 빠져나가려 합니다. 비틀 때마다 이빨이 근육을 더 깊이 가르고, 찢긴 옆구리 사이로 복강이 열립니다.','가물치는 {n}을 한 번 놓았다가 머리 쪽부터 다시 뭅니다.','{n}의 꼬리지느러미가 가물치 입 밖에서 몇 번 더 물을 젓고, 목구멍 안으로 사라집니다.'],{fact:'fWild'}),
 'WLD-12-D':wld_bad('메기','f-eaten',['메기의 넓은 입이 아래에서 {n}을 덮습니다. 위턱과 아래턱의 잔 이빨들이 {n}의 몸을 미끄러지지 않게 붙잡습니다.','{n}은 꼬리를 저어 앞으로 나아가려 하지만 머리는 이미 메기의 목구멍 쪽에 있습니다.','메기가 아가미를 닫고 물을 밀어내자 {n}의 몸이 안쪽으로 한 번 더 들어갑니다. 꼬리지느러미 끝이 잠깐 메기 입술 사이에 보였다가 사라집니다.','메기의 위 속에서 {n}은 한동안 더 움직입니다.'],{fact:'fWild'}),
 'WLD-13-D':wld_bad('여울','f-eaten',['바위 그늘의 쏘가리가 몸을 앞으로 내밀며 입을 엽니다. {n}은 물살과 함께 그 입 앞으로 밀려갑니다.','쏘가리의 턱에 난 날카로운 이빨이 {n}의 머리 뒤쪽 아가미 뚜껑을 꿰뚫습니다. 아가미 새엽이 찢어져 피가 물살에 풀립니다.','{n}은 꼬리를 세차게 젓지만 머리가 이미 입 안에 있습니다.','쏘가리는 바위 그늘로 돌아가 {n}을 천천히 삼킵니다.'],{fact:'fWild'}),
 'WLD-13-C':wld_bad('여울','f-eaten',['쏘가리가 {n}을 머리부터 삼키는 순간 {n}의 가슴 가시가 양옆으로 서서 고정됩니다. 가시 끝이 쏘가리의 입천장 점막에 박힙니다.','쏘가리는 머리를 흔들어 {n}을 뱉으려 하고, {n}은 그때마다 입 안에서 이리저리 부딪힙니다.','가슴 가시 뿌리 쪽 관절이 부러지고 {n}의 몸이 목구멍 안으로 넘어갑니다.','쏘가리는 한동안 입을 다물지 못한 채 바위 밑에 머뭅니다.'],{fact:'fWild'}),
 'WLD-14-D':wld_bad('은빛 무리','f-eaten',['강준치가 {n}의 뒤쪽에서 아래턱을 올려 붙잡습니다. 비스듬히 물린 몸에서 비늘이 한꺼번에 떨어져 물에 흩어집니다.','{n}은 몸을 휘어 빠져나가고, 비늘이 없어진 옆구리로 피가 번집니다. 다른 강준치가 그 피를 따라 방향을 바꿉니다.','두 번째로 물렸을 때 꼬리자루 근육이 끊겨 {n}은 앞으로 나아가지 못합니다.','무리가 지나간 뒤 수면에는 비늘 몇 장만 남습니다.'],{fact:'fWild'}),
 'WLD-15-D':wld_bad('블루길','f-eaten',['블루길들이 {n}의 꼬리지느러미 막을 조금씩 뜯어 갑니다. 지느러미 기조만 남은 꼬리로 {n}은 물을 젓지만 앞으로 잘 나아가지 못합니다.','뜯긴 자리 가장자리가 하얗게 짓무르고 세균이 번집니다.','느려진 {n}에게 배스가 다가옵니다. 배스의 큰 입이 한 번에 {n}의 몸 전체를 빨아들입니다.','배스의 목구멍 안쪽 거친 이빨판이 {n}의 비늘을 긁으며 아래로 넘깁니다.'],{fact:'fWild'}),
 'WLD-16-D':wld_bad('왜가리','f-eaten',['왜가리의 목이 펴지는 순간 부리가 물을 뚫고 {n}의 몸통을 가로로 집습니다.','{n}은 부리 사이에서 몸을 휘어 빠져나가려 합니다. 부리 가장자리가 비늘을 벗겨 내고 옆구리 근육을 누릅니다.','왜가리는 {n}을 물 밖으로 들어 올려 머리가 목구멍 쪽을 향하도록 고쳐 뭅니다. {n}은 공기 중에서 아가미 뚜껑을 크게 벌립니다.','왜가리가 고개를 젖히자 {n}은 머리부터 살아 있는 채로 식도 안으로 들어갑니다.'],{fact:'fWild'}),
 'WLD-17-D':wld_bad('가마우지','f-eaten',['가마우지가 물속에서 {n}을 뒤쫓아 옵니다. 끝이 갈고리처럼 굽은 부리가 {n}의 등지느러미 아래 근육을 꿰어 붙잡습니다.','가마우지는 {n}을 문 채 수면으로 올라갑니다. {n}은 부리 사이에서 몸을 뒤틀고, 갈고리 끝이 근육을 더 깊이 찢습니다.','가마우지는 {n}을 공중으로 한 번 튀겨 머리가 안쪽으로 오도록 다시 뭅니다.','목이 부풀며 {n}이 통째로 내려가고, 가마우지는 다시 물속으로 들어갑니다.'],{fact:'fWild'}),
 'WLD-18-D':wld_bad('수달','f-eaten',['수달의 앞발이 {n}의 몸통을 감싸 쥡니다. 수달은 {n}을 문 채 물가 바위로 올라갑니다.','{n}은 바위 위에서 몸을 튕기며 물 쪽으로 미끄러지려 합니다.','수달의 어금니가 머리 뒤쪽 두개골을 씹어 부숩니다. 두개골이 부서진 뒤에도 {n}의 꼬리는 바위를 몇 번 더 칩니다.','아침에는 바위 위에 꼬리지느러미와 비늘만 남습니다.'],{fact:'fWild'}),
 'WLD-19-D':wld_bad('잠자리 유충','f-eaten',['잠자리 유충의 아랫입술이 앞으로 뻗어 나와 끝의 갈고리로 {n}의 옆구리를 걸어 당깁니다.','{n}은 꼬리를 저어 몸을 빼려 하고, 갈고리가 비늘 아래 근육에 더 깊이 박힙니다.','유충은 {n}을 입 앞으로 끌어와 큰턱으로 등 근육부터 씹습니다. {n}은 몸이 반쯤 뜯긴 상태로 계속 지느러미를 움직입니다.','유충은 다 먹을 때까지 같은 줄기에서 움직이지 않습니다.']),
 'WLD-19-W':wld_bad('물장군','f-eaten',['물장군의 앞다리가 {n}의 몸을 양쪽에서 조입니다. 바늘 같은 주둥이가 아가미 뚜껑 뒤쪽 근육에 꽂힙니다.','주둥이로 들어간 소화액이 근육을 안에서부터 녹입니다.','{n}은 앞다리 사이에서 꼬리를 떨며 빠져나가려 합니다.','녹은 살이 주둥이로 빨려 나가고, 나중에는 껍질과 뼈만 물풀 사이로 떨어집니다.']),
 'WLD-20-D':wld_bad('천렵','f-bucket',['양동이 물은 한 시간 만에 햇볕에 데워집니다. 피라미와 붕어 사이에 {n}이 섞여 있습니다.','좁은 물속 산소가 줄자 물고기들이 모두 수면에 입을 댑니다. {n}은 다른 물고기들 사이로 올라가려다 밀려납니다.','저녁에 사람들이 짐을 챙길 때 양동이는 물가에 엎어지고, {n}은 자갈 위에서 아가미 뚜껑을 몇 번 더 움직입니다.']),
 'WLD-20-M':wld_bad('독침','f-floor',['맨발이 모래 위의 {n}을 밟습니다. {n}의 꼬리가 반사적으로 위로 휘며 독침이 발등을 찌릅니다.','비명과 함께 사람들이 몰려옵니다. 누군가 족대 막대로 {n}을 모래에서 떠냅니다.','막대가 {n}의 원반 가장자리를 여러 번 내리치고, 연골이 꺾인 자리로 피가 번집니다.','{n}은 자갈 위에서 원반 가장자리를 물결치듯 움직이다 멈춥니다.'],{fact:'fMotoro'}),
 'WLD-21-D':wld_bad('낚시','f-angler',['바늘 끝이 {n}의 위턱을 뚫고 미늘이 반대쪽 살에 걸립니다. 줄이 당겨질 때마다 {n}은 머리를 흔들며 깊은 곳으로 내려가려 하고, 뚫린 구멍이 찢어지며 커집니다.','물 밖으로 들려 나온 {n}은 땅 위에서 몸을 튕깁니다. 사람이 사진을 몇 장 찍고 {n}을 풀숲에 던집니다.','공기 중에서 아가미 새엽이 서로 붙어 마르기 시작합니다.','{n}은 풀 사이에서 입을 벌렸다 닫으며 몸을 몇 번 더 튕깁니다.'],{fact:'fRelease'}),
 'WLD-22-D':wld_bad('외래종 퇴치','f-net',['전기충격 막대가 물에 닿자 {n}의 근육이 한꺼번에 수축합니다. {n}은 몸을 뻣뻣하게 편 채 떠오릅니다.','뜰채가 {n}을 들어 올려 물가 상자에 넣습니다. 상자 안에서 근육이 풀리자 {n}은 몸을 휘어 상자 벽을 칩니다.','작업자는 포획 기록표에 길이와 무게를 적습니다.','그날 저녁 {n}은 다른 외래종들과 함께 처리 봉투에 담깁니다.'],{tier:'fact',fact:'fRelease'}),
 'WLD-23-E':{kind:'happy',cat:'갈색 자손',tier:'likely',fx:'f-pond',fact:'fRelease',
   l:['{n}은 저수지에서 몇 해를 더 삽니다. 봄마다 물풀에 알이 붙고, 그해 여름 갈색 치어들이 물가에 모입니다.','그중 주황색은 몇 마리 없고, 그 몇 마리는 가장 먼저 사라집니다.','몇 년 뒤 하천 조사표에는 이 저수지의 붕어·잉어 일부가 "유전자 교란 의심 개체"로 적힙니다.','{n}의 이름은 어디에도 적히지 않았다.']},
 'WLD-28-D':wld_bad('과식','f-float',['빵이 장에서 부풀며 가스가 찹니다. 부풀어 오른 장이 바로 위의 부레를 누릅니다.','{n}의 몸이 앞으로 기울고 꼬리가 수면 쪽으로 들립니다. {n}은 가슴지느러미를 계속 저어 몸을 바로 세우려 하지만 다시 뒤집힙니다.','수면 밖으로 나온 배 피부가 햇볕에 마르고 갈라집니다.','난간의 아이들이 뒤집힌 {n}을 가리키며 빵을 더 던집니다.'],{fact:'fBread'}),
 'WLD-24-D':wld_bad('기생충','f-thin',['닻벌레 암컷의 머리 끝이 닻 모양으로 갈라져 {n}의 근육 안쪽에 박혀 있습니다. 박힌 자리 주변 피부가 붉게 부어오르고 가운데가 패입니다.','패인 자리로 물곰팡이와 세균이 들어와 상처가 동전 크기로 번집니다.','{n}은 바닥 자갈에 몸을 문지르고, 문지를 때마다 상처 가장자리 살이 벗겨집니다. 상처가 여러 곳으로 늘어나며 체액이 빠져나갑니다.','{n}은 물가 그늘에서 비스듬히 떠 있다가 가라앉습니다.'],{tier:'fact'}),
 'WLD-25-D':{kind:'bad',cat:'변기',tier:'fact',fx:'f-toilet',fact:'fFlush',pl:[[0,'살아 있는 채 변기로 보냄']],
   after:()=>isKind('casual','neglect')?'주인은 {n}이 바다로 갔을 거라고 말했습니다.':null,
   l:['물이 소용돌이치며 {n}을 아래로 빨아들입니다. 하얀 벽이 빠르게 지나가고 빛이 사라집니다.','관 속의 물은 산소가 거의 없고 암모니아와 세제 성분이 짙습니다. {n}은 관 벽에 부딪히면서도 꼬리를 저어 앞으로 나아갑니다.','세제 성분이 피부 점액층을 녹이고, 벗겨진 상피 아래로 오수가 닿습니다. 아가미 새엽이 부어오르고 새엽 사이에 오물 찌꺼기가 끼어 빠지지 않습니다.','관이 꺾이는 곳에서 {n}은 다른 찌꺼기들과 함께 고입니다. 처리장 스크린에 걸린 찌꺼기들 사이에서 {n}은 더 이상 움직이지 않습니다.']}
});

/* ================= PART 2 — 블랙 코미디 해피엔딩 ================= */
/* H1–H13 (FISH_REWORK.md §5). Triggers: the species gate is sp, the owner/place is own/need, the stat gate is the hidden check
   (never above this species' cap). H4 is HAP-SOFA in fev_core.js. */
fev([
 /* H1 탕비실의 실세 */
 {id:'HAP-01',stage:'home',tier:'story',sp:['oscar','koi'],own:['shared'],cd:35,w:wld_late(2),
  p:'오후 다섯 시입니다. 박스를 든 사람이 수조 앞에 멈춰 서고, 다른 사람들이 그 둘레에 모입니다. 웃음소리 사이로 냉동 새우 봉지 소리가 납니다. {n}은…',
  o:[{l:'유리 앞으로 나와 입을 크게 벌린다',chk:wld_need('c',70),ok:()=>wld_pass('w',60)?{end:'HAP-01'}:{t:'떠나는 사람이 {n}에게 새우를 한 마리 넣어 주었습니다.',c:'good',fx:{c:2}},no:{t:'사람들은 박스를 들고 엘리베이터 쪽으로 갔습니다.'}},
     {l:'수조 구석에서 지켜본다',ok:{t:'{n}은 사람들이 흩어질 때까지 구석에 있었습니다.'}}]},
 /* H2 채권단의 아로와나 */
 {id:'HAP-02',stage:'home',tier:'story',sp:['arowana'],own:['decor','casual','techbro','content'],cd:35,w:wld_late(1.5),
  p:'낯선 사람들이 와서 가구마다 노란 딱지를 붙입니다. 한 사람이 수조 앞에서 오래 멈춥니다. {n}은…',
  o:[{l:'수면 바로 아래에서 은빛 몸을 길게 편다',chk:wld_need('c',70),ok:{end:'HAP-02'},no:{t:'낯선 사람은 수조 유리에도 딱지를 붙이고 갔습니다.',fx:{st:.05}}},
     {l:'수조 뒤쪽으로 물러난다',ok:{t:'{n}은 수조 뒤쪽 어두운 곳에 머물렀습니다.'}}]},
 /* H3 죽은 척의 달인 */
 {id:'HAP-03',stage:'home',tier:'story',sp:['clownloach'],own:['casual','neglect','eager','gift','relay','breakup'],cd:35,w:()=>(fl('playdead')?3:1)*wld_late()(),
  log:'주인이 수조 바닥에 옆으로 누운 {n}을 보았습니다. "또 죽었네." 주인이 뜰채를 들고 화장실 쪽으로 갔습니다.',
  p:'몸이 뜰채에 담겨 공기 중으로 들립니다. 아래에서 물 내려가는 소리와 함께 하얀 그릇이 보입니다. {n}은…',
  o:[{l:'뜰채 안에서 몸을 크게 튕긴다',chk:wld_need('w',50),ok:{end:'HAP-03'},no:{end:'WLD-25-D'}},
     {l:'옆으로 누운 채 가만히 있는다',ok:[[1,{end:'WLD-25-D'}],[1,{t:'주인은 변기 앞에서 머뭇거리다 {n}을 수조에 도로 넣었습니다. {n}이 몸을 뒤집어 헤엄쳤습니다.',c:'good',fx:{st:.1}}]]}]},
 /* H4 소파 밑 3일 → HAP-SOFA (fev_core.js) */
 {id:'HAP-04',stage:'home',tier:'story',sp:['bichir','channa'],need:{lid:0,pond:0},cd:35,w:wld_late(1.2),
  p:'밤입니다. 수조 가장자리 틈으로 바깥 공기 냄새가 들어옵니다. 바깥 바닥이 어둡고 넓습니다. {n}은…',
  o:[{l:'틈으로 몸을 밀어 넣고 바닥으로 미끄러져 나간다',chk:wld_need('g',70),
      ok:()=>FEVEND[wld_SOFA]?{t:'{n}은 바닥을 기어 소파 밑 어둠으로 들어갔습니다.',c:'bad',end:wld_SOFA}:{t:'{n}은 바닥을 기어 소파 밑까지 갔다가 아침에 주인 손에 들려 돌아왔습니다. 몸이 먼지투성이였습니다.',c:'bad',fx:{h:-10},near:'lid'},
      no:{t:'{n}은 바닥에서 몇 번 몸을 비틀다 지쳐 멈췄습니다. 새벽에 주인이 비명을 지르며 {n}을 수조에 넣었습니다.',c:'bad',fx:{h:-18,st:.15},near:'lid'}},
     {l:'바닥 모래에 배를 붙이고 쉰다',ok:{t:'{n}은 모래 위에서 밤을 보냈습니다.'}}]},
 /* H5 반장보다 오래 산 학생 */
 {id:'HAP-05',stage:'home',tier:'story',sp:['pleco','cory','comet'],own:['shared','gift'],cd:35,w:wld_late(1.5),
  p:'며칠째 아무도 오지 않습니다. 먹이가 떨어지지 않고, 물이 점점 탁해집니다. 벽에 초록 이끼가 자랍니다. {n}은…',
  o:[{l:'벽과 바닥의 이끼를 갉아 먹으며 버틴다',chk:wld_need('g',80),ok:{end:'HAP-05'},no:{t:'방학이 끝났을 때 {n}은 홀쭉해져 있었습니다. 같이 있던 물고기들은 보이지 않았습니다.',c:'bad',fx:{h:-15}}},
     {l:'바닥에 가만히 있는다',ok:{t:'{n}은 바닥에서 사람들이 돌아오기를 기다렸습니다.',fx:{h:-6}}}]},
 /* H6 손가락 무는 먹방 스타 */
 {id:'HAP-06',stage:'home',tier:'story',sp:['oscar','channa'],own:['content','unbox'],cd:35,w:wld_late(1.5),
  p:'수면 위에서 손가락 하나가 흔들립니다. 손가락 뒤에 까만 렌즈가 있습니다. 손가락에서 새우 냄새가 납니다. {n}은…',
  o:[{l:'손가락을 향해 단숨에 튀어 오른다',chk:wld_need('w',60),ok:()=>wld_pass('p',60)?{end:'HAP-06'}:{t:'{n}의 입이 손가락을 스쳤습니다. 주인이 소리를 지르고 웃었습니다.',c:'sub',fx:{i:.05}},no:{t:'{n}은 손가락 대신 수면을 물었습니다.'}},
     {l:'손가락이 사라질 때까지 기다린다',ok:{t:'손가락은 한참 흔들리다 사라졌습니다.'}}]},
 /* H7 풍수 9마리 중 진짜 생존자 */
 {id:'HAP-07',stage:'home',tier:'story',sp:['comet','oranda'],own:['decor'],cd:35,w:wld_late(1.5),
  p:'아침에 같은 색 물고기 한 마리가 또 물에 들어옵니다. 어제 바닥에 누워 있던 한 마리는 없습니다. 새 물고기는 아직 물이 낯선지 구석에 붙어 있습니다. {n}은…',
  o:[{l:'늘 다니던 길을 그대로 헤엄친다',chk:wld_need('g',75),ok:{end:'HAP-07'},no:{t:'{n}도 그날 오후 내내 바닥에 가라앉아 있었습니다.',c:'bad',fx:{h:-10}}},
     {l:'새 물고기 옆 구석에 같이 붙어 있는다',ok:{t:'{n}은 새 물고기와 함께 구석에서 하루를 보냈습니다.'}}]},
 /* H8 주인 역사육 — big comedy (cap check keeps it to the cleverest) */
 {id:'HAP-08',stage:'home',tier:'story',big:1,sp:['oscar','peapuffer','fig8','channa'],cd:35,w:wld_late(1.5),
  p:'창밖이 밝아집니다. 먹이가 떨어지던 시간이 거의 됐습니다. 방 안은 조용하고, 주인은 아직 누워 있습니다. {n}은…',
  o:[{l:'정확히 그 시간에 유리를 두드린다',chk:['w',85],ok:{end:'HAP-08'},no:{t:'{n}이 유리를 두드렸습니다. 주인은 돌아누웠습니다.'}},
     {l:'먹이가 떨어질 때까지 기다린다',ok:{t:'한참 뒤 먹이가 떨어졌습니다.'}}]},
 /* H9 할머니의 금붕어 */
 {id:'HAP-09',stage:'home',tier:'story',sp:['comet','koi'],own:['grandma'],cd:35,w:wld_late(2),
  p:'아침마다 같은 얼굴이 물 위로 다가와 무언가를 말합니다. 오늘도 그 얼굴이 다가옵니다. {n}은…',
  o:[{l:'그 얼굴 쪽으로 헤엄쳐 가 입을 뻐끔거린다',chk:wld_need('c',70),ok:{end:'HAP-09'},no:{t:'할머니가 웃으며 먹이를 조금 넣어 주었습니다.',c:'good',fx:{c:2}}},
     {l:'바닥에서 먹이를 기다린다',ok:{t:'먹이가 천천히 가라앉았습니다.'}}]},
 /* H10 나눔 릴레이 10번째 주인 */
 {id:'HAP-10',stage:'home',tier:'story',sp:['comet','ryukin','betta','guppy','platy','cory','oscar','pleco','koi','channa','bichir','gar'],own:['relay'],cd:35,
  w:()=>(1+Math.min(4,fl('handed_over'))*.6)*wld_late()(),
  p:'또 봉지에 담깁니다. 봉지가 흔들리고, 차 소리가 나고, 낯선 물 냄새가 납니다. 이번 물은 맑고 차분합니다. {n}은…',
  o:[{l:'봉지 안에서 끝까지 몸을 바로 세우고 버틴다',chk:wld_need('g',60),ok:{end:'HAP-10'},no:{t:'{n}은 봉지 안에서 옆으로 기울었습니다. 새 수조에 들어가서도 한동안 바닥에 있었습니다.',c:'bad',fx:{h:-10}}},
     {l:'봉지 바닥에 가라앉아 있는다',ok:{t:'{n}은 새 수조로 옮겨졌습니다.',fx:{st:.05}}}]},
 /* H13 기절 연기 신고 구출 */
 {id:'HAP-13',stage:'home',tier:'story',sp:['oscar','peapuffer','fig8','ghost','channa','wildbetta','clownloach','koi','arowana','apisto'],
  own:['learner','casual','eager','gift','neglect','cult','content','breakup','relay','grandma'],cd:35,w:()=>(S.f.wq<50?2:.6)*wld_late()(),
  p:'물이 탁하고 숨이 찹니다. 주인이 유리 앞을 지나가다 멈춥니다. {n}은…',
  o:[{l:'바닥에 옆으로 누워 움직이지 않는다',chk:wld_need('w',70),ok:{end:'HAP-13'},no:{t:'주인은 "자나 보다" 하고 지나갔습니다.',fx:{st:.05}}},
     {l:'수면에서 숨을 몰아쉰다',ok:{t:'{n}은 수면에서 입을 벌렸습니다. 주인은 먹이를 넣었습니다.',fx:{wq:-4}}}]},
 /* H11 온수 방류구의 구피 왕국 [출처: 국내 하천 온배수 구간 구피 등 열대어 정착 보고] */
 {id:'HAP-11',stage:'wild',tier:'likely',sp:['guppy','platy'],need:{wild_place:'outflow'},cd:30,w:()=>1+fl('winter_survived'),
  p:'미지근한 물가 수초 사이가 작은 물고기들로 붐빕니다. 지난달보다 훨씬 많습니다. 몇 마리는 {n}과 같은 꼬리를 가졌습니다. {n}은…',
  o:[{l:'수초 사이에서 무리와 함께 지낸다',chk:wld_need('g',50),ok:{end:'HAP-11'},no:{t:'{n}은 무리 가장자리로 밀려났습니다.',fx:{h:-5}}},
     {l:'혼자 물가 쪽으로 나간다',ok:{t:'{n}은 무리 바깥 얕은 물에서 먹이를 찾았습니다.',add:{heron_up:1}}}]}
]);

/* HAP-14…44 (events/08_wild_happy.md PART 2) */
fev([
 {id:'HAP-14',stage:'home',tier:'story',sp:['betta'],own:['breakup'],cd:35,w:wld_late(2),
  p:'작은 플라스틱 컵 안입니다. 컵이 손에서 손으로 넘어갑니다. 컵 너머로 커피 냄새와 낯선 사람들의 얼굴이 보입니다. {n}은…',
  o:[{l:'카운터 쪽을 향해 지느러미를 활짝 편다',chk:wld_need('c',70),ok:{end:'HAP-14'},no:{t:'컵은 다시 한 사람의 가방으로 들어갔습니다.',fx:{st:.06}}},
     {l:'컵 바닥에 가만히 있는다',ok:{t:'{n}은 컵 바닥에서 흔들림이 멎기를 기다렸습니다.',fx:{st:.04}}}]},
 {id:'HAP-15',stage:'home',tier:'story',sp:['comet'],own:['bait'],cd:30,w:3,
  p:'뜰채가 미끼 통을 휘젓습니다. 다른 금붕어들이 뜰채에 담겨 나갑니다. 차 소리, 물 냄새, 그리고 등에 날카로운 것이 닿습니다. {n}은…',
  o:[{l:'물에 떨어지자마자 줄을 끌고 수초 쪽으로 달린다',chk:wld_need('g',70),ok:()=>wld_pass('p',50)?{end:'HAP-15'}:{t:'{n}은 줄을 끌다 지쳤습니다. 낚시꾼은 {n}을 다시 통에 던졌습니다.',c:'bad',fx:{h:-15}},no:{t:'{n}은 미끼 통으로 돌아왔습니다. 등에 구멍이 남았습니다.',c:'bad',fx:{h:-12}}},
     {l:'통 바닥 구석에 붙어 있는다',ok:{t:'뜰채는 {n} 옆 금붕어를 떠 갔습니다.'}}]},
 {id:'HAP-16',stage:'home',tier:'story',sp:['koi'],own:['touch'],cd:30,w:()=>(fl('tame')?.3:2)*wld_late()(),
  p:'얕은 풀에 작은 손들이 한꺼번에 들어옵니다. 손 그림자가 사방에서 다가옵니다. {n}은…',
  o:[{l:'손 그림자 반대편으로 몸을 틀어 손 사이로 빠져나간다',chk:wld_need('w',55),ok:()=>wld_pass('p',60)?{end:'HAP-16'}:{t:'{n}은 손 사이로 빠져나갔습니다. 아이들이 소리를 질렀습니다.',c:'good',fx:{w:2}},no:{t:'작은 손이 {n}을 움켜쥐었다 놓쳤습니다. 손이 지나간 자리의 점막이 벗겨졌습니다.',c:'bad',fx:{h:-6}}},
     {l:'풀 바닥에 붙어 있는다',ok:{t:'손 몇 개가 {n}의 등을 쓸고 지나갔습니다.',fx:{h:-4,st:.06}}}]},
 /* [출처: 담수 가오리 독침 사고 증상(심한 통증·조직 괴사)] */
 {id:'HAP-17',stage:'home',tier:'story',sp:['motoro'],own:['unbox'],when:()=>!fl('barb_cut'),cd:35,w:wld_late(2),
  p:'밝은 조명 아래에서 맨손이 물속으로 들어와 원반 아래를 받칩니다. 몸이 물 밖으로 들립니다. {n}은…',
  o:[{l:'꼬리를 위로 휘어 올린다',chk:wld_need('c',60),ok:()=>wld_pass('g',40)?{end:'HAP-17'}:{t:'{n}의 꼬리가 손목을 스쳤습니다. 손이 {n}을 물에 떨어뜨렸습니다.',c:'bad',fx:{h:-8}},no:{t:'꼬리가 허공을 갈랐습니다. 손은 30초 뒤에 {n}을 물에 내려놓았습니다.',c:'bad',fx:{h:-6,st:.1}}},
     {l:'원반을 납작하게 펴고 가만히 있는다',ok:{t:'30초 뒤 {n}은 물로 돌아갔습니다. 배 쪽 점막에 손자국이 남았습니다.',fx:{h:-5}}}]},
 /* [출처: 팔자복어 기수 사육 필요, 복어 부풀리기의 스트레스성] */
 {id:'HAP-18',stage:'home',tier:'story',sp:['fig8'],own:['unbox'],cd:35,w:wld_late(2),
  p:'봉지가 열리고 손가락이 몸을 건드립니다. 렌즈가 가까이 다가옵니다. {n}은…',
  o:[{l:'몸을 한껏 부풀린다',chk:wld_need('c',75),ok:()=>wld_pass('w',60)?{end:'HAP-18'}:{t:'부푼 {n}이 화면 가득 찍혔습니다. 몸이 다시 줄어드는 데 한참 걸렸습니다.',c:'bad',fx:{h:-6,st:.1}},no:{t:'{n}은 반쯤 부풀었다가 줄었습니다.',fx:{st:.06}}},
     {l:'봉지 구석으로 숨는다',ok:{t:'{n}은 봉지 구석에 몸을 붙였습니다.'}}]},
 /* [출처: 알텀 엔젤 수입 후 적응기 폐사율이 높다는 자료] */
 {id:'HAP-19',stage:'home',tier:'likely',sp:['altum'],own:['staff'],cd:35,w:wld_late(2.5),
  p:'물이 부드럽고 따뜻해졌습니다. 수초 사이에 서 있으면 물살이 거의 느껴지지 않습니다. 앞에 작은 먹이가 천천히 떨어집니다. {n}은…',
  o:[{l:'수초 사이에서 나와 먹이를 받아먹는다',chk:wld_need('c',70),ok:()=>wld_pass('g',25)?{end:'HAP-19'}:{t:'{n}은 먹이 하나를 먹고 다시 수초 사이로 돌아갔습니다.',fx:{h:3}},no:{t:'{n}은 수초 사이에 그대로 서 있었습니다.'}},
     {l:'수초 사이에 서 있는다',ok:{t:'{n}은 하루 종일 같은 자리에 서 있었습니다.'}}]},
 {id:'HAP-20',stage:'home',tier:'story',sp:['ghost'],own:['staff'],cd:35,w:wld_late(2),
  p:'물살이 한쪽으로 빨려 갑니다. 그쪽에 좁고 어두운 관 입구가 있고, 아래에서 물 떨어지는 소리가 납니다. {n}은…',
  o:[{l:'관을 따라 어둠 속으로 내려간다',chk:wld_need('w',60),ok:()=>wld_pass('g',35)?{end:'HAP-20'}:{t:'{n}은 관 중간에서 몸을 돌려 다시 올라왔습니다. 옆구리가 쓸렸습니다.',c:'bad',fx:{h:-8}},no:{t:'{n}은 관 입구에서 망설이다 돌아섰습니다.'}},
     {l:'수조 바닥 그늘로 돌아간다',ok:{t:'{n}은 바닥 그늘에 몸을 붙였습니다.'}}]},
 /* [출처: 저밀도 수초 수조(무여과)에서 수초의 질소 흡수] */
 {id:'HAP-21',stage:'home',tier:'likely',sp:['wildbetta'],own:['cult'],cd:35,w:()=>(fl('tank_planted')?3:1)*(fSameCount()===0&&!fl('mates')?1.5:.5)*wld_late()(),
  p:'물풀이 물 높이까지 빽빽합니다. 물은 흐르지 않지만 맑습니다. 수면에 공기가 닿아 있습니다. {n}은…',
  o:[{l:'수초 사이를 천천히 지나며 수면에서 공기를 마신다',chk:wld_need('g',50),ok:()=>wld_pass('w',50)?{set:{tank_planted:1},end:'HAP-21'}:{t:'{n}은 수초 사이에서 하루를 보냈습니다.',set:{tank_planted:1}},no:{t:'물이 답답했습니다. {n}은 수면에 오래 머물렀습니다.',fx:{h:-6}}},
     {l:'수초 뿌리 사이에 숨는다',ok:{t:'{n}은 수초 뿌리 사이에 몸을 숨겼습니다.'}}]},
 {id:'HAP-22',stage:'home',tier:'story',sp:['comet'],own:['neglect'],cd:35,w:wld_late(2),
  p:'빗물이 떨어지고 대야 벽에 이끼가 끼었습니다. 수면에 모기 유충이 꼬물거립니다. 같이 있던 물고기들이 하나씩 보이지 않습니다. {n}은…',
  o:[{l:'이끼와 유충을 먹으며 계절을 버틴다',chk:wld_need('g',80),ok:{end:'HAP-22'},no:{t:'겨울 얼음 아래에서 {n}은 홀쭉해졌습니다.',c:'bad',fx:{h:-15}}},
     {l:'대야 바닥에 가만히 있는다',ok:{t:'{n}은 대야 바닥에서 하루를 보냈습니다.',fx:{h:-4}}}]},
 {id:'HAP-23',stage:'home',tier:'story',sp:['oranda'],own:['grandma'],cd:35,w:wld_late(2),
  p:'유리 너머에서 주름진 손가락 하나가 천천히 움직입니다. 방이 바뀌었습니다. 손가락이 여러 개로 늘어납니다. {n}은…',
  o:[{l:'손가락을 따라 이리저리 헤엄친다',chk:wld_need('c',80),ok:{end:'HAP-23'},no:{t:'손가락은 한참 유리에 머물다 떨어졌습니다.'}},
     {l:'수초 아래에서 쉰다',ok:{t:'{n}은 수초 아래에서 쉬었습니다.'}}]},
 /* [출처: 금붕어 부레 문제의 급여 조절·단식 관리 권고] */
 {id:'HAP-24',stage:'home',tier:'likely',sp:['ryukin'],own:['eager'],cd:35,w:()=>(fl('swimb_near')||S.f.ill&&S.f.ill.id==='swimb'?3:1)*wld_late()(),
  p:'배가 부풀어 몸이 자꾸 앞으로 기웁니다. 꼬리가 수면 쪽으로 들립니다. 먹이가 또 떨어집니다. {n}은…',
  o:[{l:'몸을 바로 세우려고 가슴지느러미를 계속 젓는다',chk:wld_need('g',55),ok:{end:'HAP-24'},no:{t:'{n}은 하루 종일 옆으로 기운 채 떠 있었습니다. 주인은 먹이를 더 넣었습니다.',c:'bad',fx:{h:-10},set:{swimb_near:1}}},
     {l:'먹이를 받아먹는다',ok:{t:'{n}은 떨어진 먹이를 먹었습니다. 배가 더 불렀습니다.',fx:{fat:.15},set:{swimb_near:1}}}]},
 {id:'HAP-25',stage:'home',tier:'story',sp:['guppy'],own:['mill'],cd:35,w:wld_late(2),
  p:'뜰채가 몸을 떠서 밝은 쪽으로 들어 올립니다. 여러 개의 눈이 몸의 색을 들여다봅니다. {n}은…',
  o:[{l:'뜰채 안에서 꼬리를 활짝 편다',chk:wld_need('c',70),ok:()=>wld_pass('g',55)?{end:'HAP-25'}:{t:'작업자는 {n}을 원래 통으로 돌려보냈습니다.'},no:{t:'작업자는 고개를 젓고 {n}을 다른 통으로 옮겼습니다.',c:'bad',fx:{st:.1}}},
     {l:'뜰채 바닥에 몸을 접는다',ok:{t:'{n}은 원래 통으로 돌아갔습니다.'}}]},
 /* [출처: 네온테트라 사육 수명 범위] */
 {id:'HAP-26',stage:'home',tier:'likely',sp:['neon'],own:['decor'],cd:35,w:()=>(fSameCount()>=5?2:.4)*wld_late()(),
  p:'긴 수초 수조 안에서 같은 빛을 띤 몸들이 한 방향으로 돕니다. 오늘도 낯선 몇 마리가 무리에 섞여 들어옵니다. {n}은…',
  o:[{l:'무리 한가운데에서 같이 돈다',chk:wld_need('g',30),ok:{set:{schooling_ok:1},end:'HAP-26'},no:{t:'{n}은 무리 가장자리로 밀려났습니다.',fx:{st:.06}}},
     {l:'수초 그늘에 혼자 머문다',ok:{t:'{n}은 수초 그늘에서 무리가 지나가는 것을 보았습니다.',fx:{st:.04}}}]},
 {id:'HAP-27',stage:'home',tier:'story',sp:['platy'],own:['gift'],cd:35,w:wld_late(2),
  p:'작은 얼굴이 매일 같은 시간에 유리 앞에 붙어 무언가를 그립니다. 물이 탁하고, 같이 온 물고기가 하나 줄었습니다. {n}은…',
  o:[{l:'탁한 물에서도 바닥을 쪼며 버틴다',chk:wld_need('g',60),ok:{end:'HAP-27'},no:{t:'{n}은 수면 쪽에 오래 머물렀습니다.',c:'bad',fx:{h:-8}}},
     {l:'작은 얼굴 쪽으로 헤엄쳐 간다',ok:{t:'아이가 {n}을 그림에 하나 더 그렸습니다.',fx:{c:1}}}]},
 /* [출처: 코리도라스 사육 수명(10~20년 보고)] */
 {id:'HAP-28',stage:'home',tier:'likely',sp:['cory'],own:['expert'],cd:35,w:wld_late(2),
  p:'바닥 모래가 부드럽습니다. 같이 모래를 뒤지던 무리가 예전보다 적습니다. {n}은…',
  o:[{l:'수염으로 모래를 뒤지며 하루를 보낸다',chk:wld_need('g',70),ok:()=>wld_pass('w',45)?{end:'HAP-28'}:{t:'{n}은 모래 속에서 먹이를 찾았습니다.',fx:{h:3}},no:{t:'{n}은 오늘 조금 느렸습니다.',fx:{h:-4}}},
     {l:'유목 그늘에서 쉰다',ok:{t:'{n}은 유목 그늘에서 쉬었습니다.'}}]},
 {id:'HAP-29',stage:'home',tier:'likely',sp:['oscar'],own:['alchemist'],cd:35,w:()=>(1+Math.min(3,fl('meds'))*.5)*wld_late()(),
  p:'이번 주 물은 또 다른 색입니다. 피부가 따끔거리고 지느러미 끝이 얇아졌습니다. 그래도 물 가는 소리가 들립니다. {n}은…',
  o:[{l:'따끔거림을 참으며 버틴다',chk:wld_need('g',70),ok:{end:'HAP-29'},no:{t:'{n}의 머리에 작은 구멍이 하나 더 생겼습니다.',c:'bad',fx:{h:-10}}},
     {l:'주인 쪽으로 다가가 입을 벌린다',ok:{t:'주인은 약을 한 스푼 더 넣었습니다.',c:'bad',fx:{h:-5},add:{meds:1}}}]},
 {id:'HAP-30',stage:'home',tier:'story',sp:['pleco'],own:['techbro'],cd:35,w:wld_late(2),
  p:'밤사이 물이 차가워졌습니다. 먹이가 떨어지던 기계는 며칠째 조용합니다. 다른 물고기들이 바닥에 누워 있습니다. {n}은…',
  o:[{l:'유목에 붙어 갉으며 수면 공기를 마신다',chk:wld_need('g',90),ok:{end:'HAP-30'},no:{t:'{n}은 유목에 붙은 채 몸이 홀쭉해졌습니다.',c:'bad',fx:{h:-14}}},
     {l:'바닥 그늘에 붙어 있는다',ok:{t:'아침에 기계가 다시 소리를 냈습니다.',fx:{h:-5}}}]},
 {id:'HAP-31',stage:'home',tier:'story',sp:['arowana'],own:['decor'],need:{lid:1},cd:35,w:wld_late(2),
  p:'수면 바로 아래로 낯선 얼굴이 다가옵니다. 손에 먹이를 쥐고 있습니다. 뒤에서 다른 사람들이 고개를 숙이고 있습니다. {n}은…',
  o:[{l:'수면 아래에서 천천히 몸을 돌려 먹이를 받는다',chk:wld_need('c',70),ok:()=>wld_pass('g',55)?{end:'HAP-31'}:{t:'{n}은 먹이를 받아먹었습니다. 사람들이 박수를 쳤습니다.',fx:{i:.05}},no:{t:'{n}은 먹이를 놓쳤습니다. 누군가 헛기침을 했습니다.'}},
     {l:'수조 끝으로 미끄러져 간다',ok:{t:'{n}은 수조 끝에서 몸을 돌렸습니다.'}}]},
 {id:'HAP-32',stage:'home',tier:'story',sp:['channa'],own:['casual'],cd:35,w:()=>(1+Math.min(4,fl('escapey'))*.5)*wld_late()(),
  p:'뚜껑 가장자리에 무거운 것이 하나 더 얹혔습니다. 틈이 좁아졌습니다. 바깥 바닥 냄새는 그대로입니다. {n}은…',
  o:[{l:'좁아진 틈을 밤새 주둥이로 밀어 본다',chk:wld_need('g',75),ok:()=>wld_pass('w',60)?{end:'HAP-32'}:{t:'{n}은 틈으로 빠져나가 아침에 신발장 밑에서 발견되었습니다.',c:'bad',fx:{h:-10},add:{escapey:1}},no:{t:'{n}은 주둥이가 쓸린 채 바닥으로 내려왔습니다.',fx:{h:-5}}},
     {l:'수조 바닥에 몸을 길게 누인다',ok:{t:'{n}은 바닥에서 밤을 보냈습니다.'}}]},
 /* [출처: 복어류 부리 과성장과 단단한 먹이의 관계] */
 {id:'HAP-33',stage:'home',tier:'likely',sp:['peapuffer'],own:['learner'],cd:35,w:wld_late(2),
  p:'입이 다 닫히지 않습니다. 앞에 작고 딱딱한 껍데기를 가진 것이 기어갑니다. 유리 너머 주인의 눈이 보입니다. {n}은…',
  o:[{l:'주인과 눈을 맞춘 뒤 껍데기를 깨문다',chk:wld_need('w',60),ok:()=>wld_pass('c',70)?{end:'HAP-33'}:{t:'{n}이 껍데기를 깨물었습니다. 껍데기가 깨지지 않았습니다.',fx:{h:-3}},no:{t:'{n}은 껍데기 둘레를 돌기만 했습니다.'}},
     {l:'부드러운 먹이를 기다린다',ok:{t:'냉동 장구벌레가 떨어졌습니다. 부리는 더 길어졌습니다.',fx:{h:-2}}}]},
 {id:'HAP-34',stage:'home',tier:'story',sp:['clownloach'],own:['relay'],cd:35,w:()=>(fSameCount()>=2?2:.5)*(1+Math.min(4,fl('handed_over'))*.5)*wld_late()(),
  p:'다시 봉지 안입니다. 같은 무늬의 몸들이 봉지 안에서 서로 부딪힙니다. 지난번보다 수가 적습니다. {n}은…',
  o:[{l:'다른 로치들 사이에 몸을 끼우고 버틴다',chk:wld_need('g',50),ok:{set:{schooling_ok:1},end:'HAP-34'},no:{t:'새 수조에 도착했을 때 {n}은 옆으로 누워 있었습니다. 한참 뒤에 일어났습니다.',c:'bad',fx:{h:-8}}},
     {l:'봉지 바닥에 옆으로 눕는다',ok:{t:'{n}은 봉지 바닥에 누워 흔들림을 견뎠습니다.',set:{playdead:1}}}]},
 /* [출처: 폴립테루스 사육 수명(10~15년 이상 보고)] */
 {id:'HAP-35',stage:'home',tier:'story',sp:['bichir'],own:['eager'],cd:35,w:wld_late(2),
  p:'먹이가 너무 많이 떨어지고, 물이 자주 흐려집니다. 유리 앞에 앉아 있던 작은 얼굴은 오래전부터 오지 않습니다. {n}은…',
  o:[{l:'수면에 올라가 공기를 마시며 버틴다',chk:wld_need('g',80),ok:{end:'HAP-35'},no:{t:'{n}은 탁한 물 바닥에서 한동안 움직이지 않았습니다.',c:'bad',fx:{h:-10}}},
     {l:'바닥을 기어 다닌다',ok:{t:'{n}은 가슴지느러미로 바닥을 짚고 기어 다녔습니다.'}}]},
 {id:'HAP-36',stage:'home',tier:'story',sp:['apisto'],own:['breeder'],cd:35,w:wld_late(2),
  p:'굴 앞에 작은 치어들이 구름처럼 모여 있습니다. 위에서 커다란 얼굴이 치어들을 오래 들여다봅니다. {n}은…',
  o:[{l:'굴 앞을 지키며 치어 떼를 몰고 다닌다',chk:wld_need('c',70),ok:()=>wld_pass('p',30)?{end:'HAP-36'}:{t:'{n}은 치어 떼를 몰다 지쳤습니다.',fx:{h:-4}},no:{t:'치어 떼가 흩어졌습니다.',fx:{st:.05}}},
     {l:'굴 안으로 들어간다',ok:{t:'{n}은 굴 안에서 치어들을 불러들였습니다.'}}]},
 /* [출처: 금붕어 육혹(wen) 절제술 시행 사례·마취 방법] */
 {id:'HAP-38',stage:'home',tier:'story',sp:['oranda'],own:['content'],cd:35,w:wld_late(2),
  p:'머리 혹이 눈을 덮어 앞이 흐립니다. 먹이 냄새는 나는데 먹이가 어디 있는지 보이지 않습니다. 렌즈가 가까이 옵니다. {n}은…',
  o:[{l:'먹이 냄새 쪽으로 몇 번이고 다시 헤엄쳐 간다',chk:wld_need('g',50),ok:()=>wld_pass('c',70)?{set:{wen_trim:1},end:'HAP-38'}:{t:'{n}은 먹이 옆을 지나쳤습니다. 주인이 그 장면을 찍었습니다.',fx:{h:-3}},no:{t:'{n}은 먹이를 찾지 못했습니다.',fx:{h:-5}}},
     {l:'바닥에서 기다린다',ok:{t:'먹이는 바닥에 닿기 전에 다른 물고기가 먹었습니다.',fx:{h:-3}}}]},
 {id:'HAP-39',stage:'home',tier:'story',sp:['comet','platy','cory'],own:['shared'],cd:35,w:wld_late(2),
  p:'불이 꺼지고 손전등 빛이 수조를 훑습니다. 낮에 떨어진 먹이가 바닥에 쌓여 냄새가 납니다. 빛이 멈춥니다. {n}은…',
  o:[{l:'빛 쪽으로 다가가 머문다',chk:wld_need('g',60),ok:{end:'HAP-39'},no:{t:'{n}은 바닥 먹이 사이에서 밤을 보냈습니다.',c:'bad',fx:{h:-6}}},
     {l:'바닥 구석으로 숨는다',ok:{t:'빛은 다른 쪽으로 지나갔습니다.'}}]},
 {id:'HAP-40',stage:'home',tier:'story',sp:['koi'],own:['release'],cd:30,w:3,
  p:'봉지가 흔들립니다. 목탁 소리가 멀어지고, 발소리와 함께 봉지가 어딘가로 옮겨집니다. 돌 냄새와 고인 물 냄새가 납니다. {n}은…',
  o:[{l:'봉지 안에서 몸을 크게 튕긴다',chk:wld_need('g',70),ok:()=>wld_pass('c',60)?{end:'HAP-40'}:{t:'봉지는 다시 강가로 돌아갔습니다.',run:()=>q(null,null,()=>fRelease())},no:{t:'봉지는 다른 봉지들과 함께 강가로 옮겨졌습니다.',run:()=>q(null,null,()=>fRelease())}},
     {l:'봉지 바닥에 가만히 있는다',ok:{t:'{n}은 봉지 바닥에서 흔들림을 견뎠습니다.'}}]},
 {id:'HAP-41',stage:'home',tier:'story',sp:['guppy','platy'],own:['breakup'],cd:35,w:wld_late(2),
  p:'뜰채가 물속을 오갑니다. 같은 수조 물고기들이 한 마리씩 두 개의 봉지로 나뉘어 담깁니다. 뜰채가 다가옵니다. {n}은…',
  o:[{l:'뜰채를 피해 수초 뒤로 돈다',chk:wld_need('g',55),ok:()=>wld_pass('c',55)?{end:'HAP-41'}:{t:'{n}은 뜰채를 두 번 피한 끝에 한쪽 봉지에 담겼습니다.',fx:{st:.06}},no:{t:'{n}은 첫 번째 뜰채에 담겼습니다.',fx:{st:.06}}},
     {l:'가만히 떠 있는다',ok:{t:'{n}은 한쪽 봉지에 담겼습니다.'}}]},
 /* [출처: 금붕어 수명(10년 이상 보고), 축제 금붕어 사육 실태] */
 {id:'HAP-42',stage:'home',tier:'likely',sp:['comet'],own:['gift'],cd:35,w:()=>(S.f.shop==='fair'?2:1)*wld_late()(),
  p:'몸을 돌리면 머리와 꼬리가 벽에 닿습니다. 물이 금방 흐려집니다. 작은 얼굴이 어른 얼굴을 데려와 유리를 가리킵니다. {n}은…',
  o:[{l:'좁은 물에서도 몸을 바로 세우고 헤엄친다',chk:wld_need('g',75),ok:{end:'HAP-42'},no:{t:'{n}은 좁은 물에서 숨을 몰아쉬었습니다.',c:'bad',fx:{h:-8}}},
     {l:'바닥에 가라앉아 있는다',ok:{t:'어른 얼굴은 "다음에" 하고 돌아갔습니다.',fx:{h:-4}}}]}
]);
/* HAP-44 법회 다음 날의 뜰채 — summer release only (winter keeps WLD-02's no-choice rule) */
fev([{id:'HAP-44',stage:'wild',tier:'likely',sp:['guppy','platy','cory','betta','wildbetta','apisto','clownloach','ghost','motoro','fig8','channa','bichir'],own:['release'],once:1,w:3,need:{season:'summer',released:1},
  p:'아침입니다. 어제 숨어든 돌 밑은 아직 어둡습니다. 물가 쪽에서 장화 발소리가 가까워지고, 돌이 하나씩 들립니다. {n}은…',
  o:[{l:'물살을 따라 하류로 떠난다',ok:{t:'{n}은 하류로 내려갔습니다. 발소리가 멀어졌습니다.',set:{wild_place:'river'}}},
     {l:'어제 숨은 돌 밑에 그대로 있는다',chk:wld_need('g',40),ok:{end:'HAP-44'},no:{t:'돌이 들렸을 때 {n}은 이미 지쳐 물살에 밀려 나갔습니다.',c:'bad',fx:{h:-10}}}]}]);

/* ---------- happy endings ---------- */
fevEnd({
 'HAP-01':wld_hap('탕비실의 실세',['{n}은 부장보다 오래 이 사무실에 있었습니다. 송별회가 열릴 때마다 떠나는 사람이 {n}에게 새우를 한 마리씩 넣어 줍니다.','새 직원들은 첫 출근 날 {n}에게 인사하는 법부터 배웁니다.','회사가 이사할 때 이삿짐 목록 1번은 {n}이었다. 직원 명단에는 없었다.'],{fx:'f-home'}),
 'HAP-02':wld_hap('채권단의 아로와나',['회사가 문을 닫고 사무실 집기에 압류 딱지가 붙었습니다. 경매장에서 가장 높은 값이 붙은 물건은 {n}이었습니다.','{n}은 뚜껑이 두 겹인 큰 수조가 있는 집으로 갔습니다.','사장은 {n}의 이름을 끝내 몰랐다. 경매 목록에는 \'은룡 1번\'으로 적혔다.'],{fact:'fArowana'}),
 'HAP-03':wld_hap('죽은 척의 달인',['변기 앞에서 뜰채 속 {n}이 몸을 크게 튕겼습니다. 주인은 비명을 지르며 뜰채를 놓쳤고, {n}은 욕실 바닥에서 퍼덕였습니다.','주인은 {n}을 수조에 도로 넣고 그날 밤 "클라운 로치 옆으로 누워 자요"를 검색했습니다. 다음 날부터 주인은 물고기 공부를 시작했습니다.','주인은 그 전에 변기로 보낸 세 마리가 정말 죽었었는지 아직도 모른다.'],{fact:'fClown'}),
 'HAP-05':wld_hap('반장보다 오래 산 학생',['방학마다 교실은 비었고, {n}은 벽의 이끼를 갉아 먹으며 버텼습니다. 반장이 세 번 바뀌는 동안 {n}은 같은 자리에 있었습니다.','졸업식 날 담임 선생님이 {n}의 수조 앞에 \'명예 졸업장\'을 붙였습니다.','같이 입학한 구피 서른 마리 중 졸업한 건 {n}뿐이었다.'],{fx:'f-home'}),
 'HAP-06':wld_hap('손가락 무는 먹방 스타',['{n}이 주인 손가락을 무는 영상이 조회수 수백만을 넘겼습니다. 댓글은 "또 물어 주세요"로 가득했습니다.','주인은 광고 수익으로 1,000리터 수조를 들였고, {n}은 몸을 다 펴도 벽에 닿지 않는 물에서 지냅니다.','주인 손가락에는 흉터가 열한 개 있다.']),
 'HAP-07':wld_hap('풍수 9마리 중 진짜 생존자',['가게 사장은 "아홉 마리여야 돈이 들어온다"며 한 마리가 죽을 때마다 같은 색을 사 와 숫자를 맞췄습니다.','몇 해가 지나는 동안 수조 속 아홉 마리 가운데 첫날부터 있던 것은 {n} 하나만 남았습니다.','집주인은 9마리가 늘 같은 9마리인 줄 안다.']),
 'HAP-08':wld_hap('주인 역사육',['{n}은 먹이 시간을 정확히 기억했습니다. 그 시간이 되면 유리를 두드렸고, 주인은 일어났습니다.','몇 달 뒤 주인은 알람을 끄고 {n}의 소리에 맞춰 일어났습니다. 출근 시간도, 퇴근 시간도 {n}의 먹이 시간에 맞춰 바뀌었습니다.','주인은 {n}이 자기를 기다린다고 믿었다. {n}이 기다린 것은 먹이였다.'],{big:1}),
 'HAP-09':wld_hap('할머니의 금붕어',['할머니는 매일 아침 자식들보다 {n}에게 먼저 인사했습니다. 그렇게 스무 해가 지났습니다.','{n}은 할머니의 발소리를 들으면 수면으로 올라왔습니다.','장례식 날, 손주가 처음으로 {n}에게 밥을 줬다.']),
 'HAP-10':wld_hap('나눔 릴레이 10번째 주인',['"어항째 무료 나눔" 글은 아홉 번 올라왔습니다. 열 번째로 {n}을 받으러 온 사람은 봉지를 열기 전에 수온부터 쟀습니다.','{n}은 물을 잡아 둔 큰 수조에 들어갔고, 그 뒤로는 봉지에 담기지 않았습니다.','앞의 아홉 집에서 함께 간 친구들은 없었다.']),
 'HAP-11':wld_hap('온수 방류구의 구피 왕국',['방류구 앞 미지근한 물에서 {n}의 새끼들이 새끼를 낳았습니다. 몇 해 뒤 그 물가는 같은 꼬리를 가진 작은 물고기 수천 마리로 반짝였습니다.','지나가던 사람들이 "하천에 구피가 산다"며 사진을 찍었습니다.','그 하천의 송사리는 몇 년 뒤 조사에서 나오지 않았다.'],{tier:'likely',fx:'f-pond',fact:'fRelease'}),
 'HAP-12':wld_hap('저수지의 괴물',['{n}은 저수지에서 2미터 가까이 자랐습니다. "저수지에 악어가 산다"는 신고가 이어졌고, 뉴스 카메라가 물가에 섰습니다.','며칠에 걸친 수색 끝에 {n}은 그물에 걸렸습니다.','결국 포획되어 \'괴물 물고기\'로 박제됐다. 버린 사람은 뉴스를 봤을까.'],{big:1,fx:'apex',fact:'fGar'}),
 'HAP-13':wld_hap('기절 연기 신고 구출',['{n}이 바닥에 옆으로 누워 움직이지 않자 주인은 수족관에 전화를 걸었습니다. 사장은 사진을 보자마자 "여과기 언제 청소했어요?"라고 물었습니다.','주인은 그날 처음으로 물 테스트 키트를 샀습니다. 물을 갈자 {n}이 몸을 뒤집어 헤엄쳤습니다.','그 전 물고기들은 누워 있다가 그대로 일어나지 않았다. 주인은 그때는 전화하지 않았다.']),
 'HAP-14':wld_hap('양육권은 카페 사장에게',['두 사람은 매주 토요일 같은 카페에서 만나 {n}이 든 플라스틱 컵을 건넵니다. 컵을 건넬 때 두 사람은 서로를 보지 않고 {n}만 봅니다.','네 번째 토요일, {n}이 컵 속에서 카운터 쪽을 향해 지느러미를 폅니다. 카페 사장이 다가와 "이 아이, 저희가 키워도 될까요"라고 묻습니다.','그 주부터 {n}은 카운터 옆 60L 수초 수조에서 지냅니다.','두 사람은 그 뒤로 그 카페에 가지 않았다. {n}이 아직 거기 사는지 둘 다 모른다.'],{fact:'fBetta'}),
 'HAP-15':wld_hap('바늘이 빠진 날',['낚시꾼이 {n}의 등지느러미 아래에 바늘을 꿰어 저수지에 던집니다. 수초 쪽에서 가물치가 달려들었다가 줄에 걸린 수초 줄기를 물고 돌아섭니다.','그 사이 낡은 줄이 끊어집니다. {n}은 등에 바늘을 꽂은 채 갈색 붕어 무리 속으로 들어갑니다.','몇 주 뒤 녹슨 바늘이 상처에서 빠져 바닥에 떨어집니다.','같은 통에서 함께 팔려 간 금붕어들은 그날 모두 바늘째 삼켜졌다.'],{fx:'f-pond'}),
 'HAP-16':wld_hap('잡히지 않는 잉어',['아이들의 손이 물에 들어오는 순간 {n}은 손 그림자 반대편으로 몸을 틉니다. 손이 두 개면 두 손 사이로 빠져나갑니다.','카페 사장은 "이 아이를 잡으면 음료 무료"라는 팻말을 세웁니다. 팻말이 선 뒤 다섯 해 동안 {n}을 잡은 사람은 없습니다.','사장은 {n}을 잡기 수조에서 빼서 카운터 옆 큰 통으로 옮깁니다. 팻말이 너무 오래 같은 자리에 있어 손님들이 믿지 않게 됐기 때문입니다.','{n}이 잡히지 않는 동안, 같은 수조의 다른 물고기들이 대신 하루 수백 번씩 잡혔다.'],{fact:'fKoi'}),
 'HAP-17':wld_hap('쏘인 유튜버',['유튜버가 카메라 앞에서 {n}을 맨손으로 들어 올립니다. {n}의 꼬리가 반사적으로 위로 휘고, 독침이 유튜버의 손목을 찌릅니다.','촬영은 응급실에서 끝납니다. 영상 제목은 "가오리에게 쏘였습니다"이고, 댓글 맨 위는 "가오리를 왜 맨손으로 드나요"입니다.','일주일 뒤 유튜버는 {n}을 담수 가오리를 오래 키운 구독자에게 보냅니다. 그 집 수조 바닥에는 고운 모래가 깔려 있습니다.','그 영상은 그해 채널에서 조회수가 가장 높았다. 유튜버는 다음 달 다른 가오리를 주문했다.'],{fact:'fMotoro'}),
 'HAP-18':wld_hap('부풀어 오른 썸네일',['택배 봉지를 연 손이 {n}을 건드리자 {n}이 공처럼 부풀어 오릅니다. 유튜버는 그 장면을 세 번 돌려 보여 주고 썸네일로 씁니다.','댓글에는 "부풀리기는 스트레스 반응입니다", "팔자복어는 민물고기가 아닙니다"가 줄줄이 달립니다.','댓글을 단 사람 중 한 명이 {n}을 데려갑니다. 새 수조의 물에는 비중계로 잰 소금이 들어 있습니다.','부풀어 오른 {n}의 썸네일은 아직도 채널 맨 위에 걸려 있다.'],{fact:'fPea'}),
 'HAP-19':wld_hap('서른아홉 줄의 장부',['같은 상자로 들어온 알텀 마흔 마리가 판매 수조에서 하루에 몇 마리씩 바닥에 눕습니다. 퇴근하던 직원이 아직 헤엄치는 {n}을 봉지에 담아 집으로 가져갑니다.','직원은 집 수조에 정수기 물을 섞어 연수를 만들고 수온을 올립니다.','{n}은 한 달 동안 수초 사이에 서 있다가, 어느 날 아침 먹이를 받아먹습니다. 직원은 그날 {n}에게 이름을 붙입니다.','같은 상자로 온 나머지 서른아홉 마리는 가게 장부에 \'폐사\'로 한 줄씩 적혔다.'],{tier:'likely',fact:'fAltum'}),
 'HAP-20':wld_hap('섬프의 유령',['{n}은 판매 수조의 오버플로 관을 따라 아래층 여과조로 내려갑니다. 여과조 바닥은 어둡고, 여과재 사이에 작은 벌레와 먹이 찌꺼기가 쌓여 있습니다.','가게는 {n}을 \'재고 없음\'으로 처리합니다. 두 해 뒤 여과조 청소 날, 직원의 뜰채에 손바닥 두 개 길이의 검은 물고기가 걸려 나옵니다.','직원은 {n}을 집으로 데려가 수조 바닥에 PVC 관을 하나 넣어 줍니다.','그 두 해 동안 가게는 블랙 고스트를 세 번 더 주문했고, 세 번 다 판매 수조에서 폐사 처리했다.'],{fact:'fGhost'}),
 'HAP-21':wld_hap('무여과 교단의 증거 사진',['주인의 수조는 여과기가 없는 대신 수초가 물 높이까지 빽빽합니다. 물고기는 {n} 한 마리뿐입니다.','수초가 물속 질소를 먹고 자라고, {n}은 수면에서 공기를 마시며 수초 사이를 천천히 지나갑니다.','주인은 3년째 살아 있는 {n}의 사진을 커뮤니티에 올립니다. 제목은 "여과기는 상술입니다"입니다.','그 글을 보고 여과기를 뺀 사람들의 수조에는 수초가 없었고, 물고기는 열 마리씩 있었다.'],{tier:'likely'}),
 'HAP-22':wld_hap('잊힌 고무 대야',['주인은 {n}을 다른 금붕어 네 마리와 함께 옥상 고무 대야에 옮겨 놓고 잊습니다. 빗물이 대야를 채우고, 대야 벽에 이끼가 끼고, 모기가 알을 낳습니다.','{n}은 이끼와 모기 유충을 먹습니다. 겨울마다 대야 위에 얼음이 얼고 봄마다 녹습니다.','다섯 해 뒤 옥상 방수 공사를 하던 인부가 대야를 들어 올리다 안에서 움직이는 {n}을 봅니다.','같이 넣은 네 마리가 언제 사라졌는지 주인은 모른다. 그런 일이 있었다는 것도 모른다.'],{fx:'f-pond'}),
 'HAP-23':wld_hap('요양원 3층 어항',['할머니가 요양원에 들어가던 날, 손주가 {n}의 어항을 3층 휴게실 창가에 둡니다. 할머니가 손가락을 유리에 대면 {n}이 그 손가락을 따라 헤엄칩니다.','다른 어르신들도 손가락을 대기 시작합니다. 요양보호사가 매주 물을 갈고, 어르신들이 돌아가며 먹이를 줍니다.','먹이를 두 번 주는 날이 많아 보호사가 먹이통에 요일을 적어 붙입니다.','할머니가 떠난 뒤에도 {n}은 그 창가에 남았다. 손주는 그 뒤로 요양원에 오지 않았다.']),
 'HAP-24':wld_hap('금붕어 단식원',['사료를 하루 다섯 번 받던 {n}이 어느 날 아침 배를 위로 하고 떠 있습니다. 주인은 밤새 검색하고, 사흘 굶긴 뒤 껍질 벗긴 완두콩을 주라는 글을 찾습니다.','나흘째 {n}이 몸을 바로 세웁니다. 주인은 그날부터 금붕어 다이어트 영상을 찍고, 사료 통에 "하루 한 번"이라고 크게 씁니다.','{n}은 그 뒤로 일곱 해를 더 삽니다.','주인은 그 전에 키운 두 마리도 같은 이유로 뒤집혔다는 걸 그제야 알았다.'],{tier:'likely',fact:'fOranda'}),
 'HAP-25':wld_hap('종어로 은퇴',['선별 날, 작업자가 {n}을 뜰채로 떴다가 색을 보고 \'종어\' 통으로 옮깁니다. 종어 통의 물은 다른 통보다 자주 갈립니다.','{n}은 두 해 동안 한 달에 한 번씩 새끼를 낳습니다. 새끼들은 태어난 날 다른 통으로 옮겨지고 {n}은 그 뒤를 보지 못합니다.','번식장은 {n}이 더 이상 새끼를 낳지 않자 작은 수조 하나를 따로 마련해 둡니다. 작업자들은 {n}을 \'원본\'이라고 부릅니다.','{n}이 낳은 새끼들 대부분은 등급 외로 분류되어, {n}이 한 번도 본 적 없는 배수로로 갔다.'],{fact:'fBreed'}),
 'HAP-26':wld_hap('로비의 마지막 원년 멤버',['호텔 로비의 긴 수초 수조에 네온 쉰 마리가 들어옵니다. 관리 업체 직원이 한 달에 두 번 와서 물을 갈고 죽은 개체 수만큼 새 네온을 넣습니다.','무리는 늘 쉰 마리 언저리입니다. {n}은 그 무리 한가운데에서 다섯 해를 헤엄칩니다.','업체가 바뀌던 날, 새 직원이 무리 중 유난히 색이 바랜 한 마리를 보고 "이건 꽤 오래됐네요"라고 말합니다.','업체 정산서에는 매달 \'네온 보충\'이 한 줄씩 있었다. {n}은 그 줄에 한 번도 들어가지 않은 유일한 한 마리였다.'],{tier:'likely',fact:'fNeon'}),
 'HAP-27':wld_hap('관찰일기 우수상',['아이가 학원 경품으로 받은 플래티 다섯 마리를 작은 어항에 넣고 관찰일기를 씁니다. 일기 셋째 장부터 그림 속 물고기 수가 하나씩 줄어듭니다.','숙제를 봐 주던 엄마가 그림을 세어 보고 다음 날 큰 수조와 여과기를 사 옵니다.','넷째 장부터 {n}이 새끼를 낳고, 그림 속 물고기 수가 다시 늘어납니다. 관찰일기는 학교에서 우수상을 받습니다.','일기 첫 장에 그려진 다섯 마리 중 마지막 장까지 그려진 건 {n}뿐이었다. 상장에는 그 얘기가 없었다.']),
 'HAP-28':wld_hap('혼자 남은 무리어',['주인은 열 마리 무리로 {n}을 들였습니다. 해가 지날 때마다 무리가 한 마리씩 나이 들어 죽습니다. 주인은 그때마다 원인을 노트에 적습니다.','열다섯 해째 수조 바닥에는 {n} 한 마리가 수염으로 모래를 뒤집고 있습니다.','주인의 취미는 그사이 해수어로 바뀌었고, {n}의 수조는 방 구석의 마지막 담수 수조가 됩니다.','주인은 {n}에게 새 무리를 넣어 주지 않았다. 코리도라스가 무리어라는 건 그 방에서 주인이 가장 잘 알았다.'],{tier:'likely',fx:'f-home'}),
 'HAP-29':wld_hap('약값 파산',['주인은 매주 새 약을 사서 {n}의 수조에 넣습니다. 물은 매주 다른 색입니다.','다섯째 달, 주인의 카드가 한도에 걸려 약을 사지 못합니다. 약이 없는 동안 주인은 할 수 있는 일이 물 갈기뿐이라 매주 물만 갑니다.','석 달 뒤 {n}의 지느러미 끝이 다시 자라고 머리의 작은 구멍들이 메워집니다.','주인은 마지막으로 산 약이 늦게 효과를 본 것이라고 믿는다. 카드 한도가 풀린 날, 그 약을 두 병 더 샀다.'],{tier:'likely',fact:'fHole'}),
 'HAP-30':wld_hap('무중단 운영 3년',['주인의 수조에는 센서 일곱 개와 자동 급여기 두 대가 달려 있습니다. 히터 컨트롤러가 업데이트 뒤 멈춘 밤, 다른 물고기들은 아침까지 버티지 못합니다.','{n}은 수면에 올라가 공기를 마시며 유목에 붙어 있습니다. 급여기가 사흘 동안 사료를 쏟지 않은 주에도 {n}은 유목을 갉으며 버팁니다.','주인은 대시보드의 \'생존 개체\' 칸에 늘 1이 떠 있는 것을 보고 시스템이 안정적이라고 결론 냅니다.','주인이 쓴 블로그 글 제목은 "무중단 운영 3년"이었다. 그동안 그 수조에서 바뀐 물고기는 열두 마리였다.']),
 'HAP-31':wld_hap('세 명의 대표이사',['대표이사실 뒤편 수조에서 {n}은 수면 바로 아래를 천천히 오갑니다. 풍수 상담가는 "이 물고기가 죽으면 회사 운이 끝난다"고 말합니다.','그 말 때문에 관리 업체가 일주일에 두 번 옵니다. 대표이사는 세 번 바뀌고, 세 번 모두 첫 출근 날 {n}에게 먹이를 줍니다.','{n}의 수조 앞에는 "만지지 마시오, 회장님 지시"라는 팻말이 붙습니다.','{n}이 사는 동안 회사는 직원 절반을 내보냈다. {n}의 수조 관리 계약은 한 번도 끊긴 적이 없다.'],{fact:'fArowana'}),
 'HAP-32':wld_hap('벽돌 두 장',['{n}은 뚜껑 틈으로 빠져나와 거실 바닥을 기어갑니다. 주인은 아침마다 소파 밑, 신발장 밑, 냉장고 밑에서 {n}을 찾아 다시 넣습니다.','네 번째 탈출 뒤 주인은 뚜껑 위에 벽돌 한 장을 올립니다. 다섯 번째 탈출 뒤 벽돌은 두 장이 됩니다.','{n}은 벽돌 두 장 아래에서 여덟 해를 삽니다.','벽돌은 두 장까지 늘었다. 수조는 끝내 커지지 않았다.'],{fact:'fChanna'}),
 'HAP-33':wld_hap('달팽이 농장',['{n}의 부리가 길어져 입이 덜 닫힙니다. 주인은 커뮤니티에서 "복어는 달팽이를 깨 먹어야 이빨이 닳는다"는 답을 받습니다.','주인은 달팽이 번식용 통을 하나 들입니다. 통은 석 달 사이 일곱 개가 됩니다.','{n}은 매일 아침 유리 앞에서 주인과 눈을 맞추고, 주인이 넣어 주는 작은 달팽이를 깨 먹습니다.','{n} 한 마리를 위해 매일 달팽이가 깨졌다. 주인은 달팽이들에게는 이름을 지어 주지 않았다.'],{tier:'likely',fact:'fBeak'}),
 'HAP-34':wld_hap('다섯 마리 세트',['판매 글 제목은 매번 "클라운 로치 다섯 마리 세트 무료"입니다. 세트는 석 달마다 다른 집으로 갑니다.','여섯 번째 집 주인은 봉지를 열자마자 수를 셉니다. 봉지 안에는 세 마리가 있습니다.','주인은 바로 큰 수조에 은신처를 넉넉히 넣고, 다음 주 같은 종을 두 마리 더 들입니다.','다섯 마리로 출발한 세트는 여섯 번째 집에 세 마리로 도착했다. 글에는 내내 \'다섯 마리\'라고 적혀 있었다.']),
 'HAP-35':wld_hap('공룡이라 불린 물고기',['아빠는 공룡을 좋아하는 아이에게 "공룡 시대부터 살던 물고기"라며 {n}을 사 옵니다. 아이는 일주일 동안 수조 앞에 앉아 있다가 그 뒤로는 오지 않습니다.','수조는 거실 한쪽에서 열두 해 동안 그대로 있습니다.','아이가 대학에 붙어 자취방으로 이사하던 날, 짐 목록에 수조가 들어갑니다. 자취방에서 아이는 처음으로 {n}이 무엇을 먹는지 검색합니다.','아이는 열두 해 동안 {n}의 이름을 몰랐다. {n}에게 이름이 있었는지도 몰랐다.'],{fact:'fBichir'}),
 'HAP-36':wld_hap('등급 외 부모',['{n}은 코코넛 껍질 굴 앞을 지키며 치어 떼를 몰고 다닙니다. 치어들이 자라자 브리더는 색을 보고 고개를 젓습니다.','브리더는 이 혈통을 접고, {n} 부부를 번식 선반에서 내려 거실 수조로 옮깁니다. 거실 수조에는 굴이 세 개 있습니다.','{n}은 그 뒤로도 해마다 굴 앞을 지킵니다.','그해 치어 백여 마리는 \'등급 외\'로 묶여 다른 집 오스카의 먹이로 팔렸다.']),
 'HAP-37':wld_hap('버려진 생물 수조',['물을 다 뺀 저수지 바닥에서 {n}은 진흙에 몸을 반쯤 묻고 공기를 마십니다. 작업자 네 명이 들것으로 {n}을 들어 물차에 싣습니다.','{n}은 생태 시설의 큰 수조로 옮겨집니다. 수조 앞에는 아이들이 줄을 서고, 해설사가 "이 물고기는 사람이 버려서 여기 왔어요"라고 말합니다.','{n}은 수조 바닥에서 거의 움직이지 않고, 가끔 수면에 올라가 공기를 마십니다.','수조 앞 안내판 제목은 \'버려진 생물\'이었다. 버린 사람 이름을 적는 칸은 없었다.'],{fx:'f-aquarium',fact:'fGar'}),
 'HAP-38':wld_hap('육혹 수술 브이로그',['{n}의 머리 혹이 자라 두 눈을 거의 덮습니다. {n}은 먹이가 떨어진 자리 옆을 지나쳐 갑니다.','주인은 특수동물 병원을 찾아가 마취와 혹 절제 장면을 촬영합니다.','마취에서 깬 {n}이 수조 바닥의 먹이를 한 번에 집어 먹습니다. 영상 제목은 "금붕어가 처음으로 세상을 봤습니다"입니다.','주인은 영상 수익으로 새 카메라를 샀다. {n}의 수조는 그대로 20L였다.'],{fact:'fOranda'}),
 'HAP-39':wld_hap('야간 경비원의 어항',['낮에는 지나가는 직원마다 어항에 먹이를 한 줌씩 넣습니다. 밤에는 경비원이 순찰 중에 어항 앞에 멈춰 바닥의 남은 먹이를 뜰채로 건집니다.','경비원은 주말마다 집에서 받아 온 물을 하루 묵혀 반쯤 갈아 줍니다. 회사의 누구도 그 사실을 모릅니다.','용역 계약이 끝나던 날, 경비원은 총무팀에 어항을 가져가도 되는지 묻습니다.','총무팀은 어항이 비품 대장에 없다는 걸 확인하고 반출을 허락했다. {n}은 그 회사 자산이었던 적이 없었다.'],{fx:'f-home'}),
 'HAP-40':wld_hap('절 연못의 터줏대감',['법회가 끝나고 신도 한 명이 남은 봉지 하나를 강 대신 절 마당 연못에 쏟습니다. {n}은 그 연못에서 다른 잉어들과 함께 겨울을 납니다.','해마다 연못 둘레의 돌계단이 닳고, 방문객이 던지는 먹이를 받는 {n}의 몸이 커집니다.','스님은 연못 앞에 "먹이는 하루 한 번, 종무소에서"라고 써 붙입니다. {n}은 그 연못에서 가장 오래된 잉어가 됩니다.','같은 날 강에 부어진 다른 물고기들의 이름은 축원문에만 남았다.'],{fx:'f-pond',fact:'fKoi'}),
 'HAP-41':wld_hap('반씩 나눈 구피',['두 사람은 뜰채로 물고기를 한 마리씩 번갈아 떠서 두 봉지에 나눠 담습니다. {n}은 뜰채를 두 번 피한 끝에 마지막으로 떠집니다.','두 사람은 {n}이 든 봉지를 두고 한참 말이 없다가, {n}을 받는 쪽이 다음 달 치 관리비를 내기로 합니다.','{n}이 간 집 수조는 반년 만에 새끼로 가득 찹니다. 다른 집 수조도 마찬가지입니다.','두 사람은 그 뒤로 서로의 구피 사진에만 \'좋아요\'를 눌렀다. 늘어난 새끼들은 둘 다 당근에 올렸다.'],{fact:'fLive'}),
 'HAP-42':wld_hap('축제 금붕어 열두 살',['아이가 축제 부스에서 종이 뜰채로 {n}을 건져 옵니다. {n}은 처음에 밥공기만 한 어항에서 지냅니다.','{n}의 몸이 어항 폭만큼 자라자 아빠가 큰 수조를 사 옵니다. 아이가 중학생이 되고 고등학생이 되는 동안 {n}은 수조를 두 번 더 바꿉니다.','아이의 졸업식 사진 한 장에 수조 속 {n}이 함께 찍힙니다.','같은 날 같은 부스에서 건져진 금붕어들 가운데 열두 살이 된 게 몇이나 될지, 아무도 세지 않았다.'],{tier:'likely',fact:'fFair',fx:'f-home'}),
 'HAP-43':wld_hap('냇가에서 주운 열대어',['족대를 들어 올린 아이가 붕어와 피라미 사이에서 색이 다른 {n}을 발견합니다. 아이 엄마가 "이건 열대어인데"라며 휴대폰으로 사진을 검색합니다.','그날 저녁 {n}은 페트병에 담겨 아파트로 갑니다. 엄마는 다음 날 히터와 여과기를 사고, 커뮤니티에 "냇가에서 열대어를 주웠어요"라는 글을 올립니다.','글의 첫 댓글은 "그 냇가에 아직 더 있을 수 있어요"입니다.','그 냇가에 남은 다른 열대어들은 그해 11월에 모두 죽었다. 아무도 다시 가 보지 않았다.'],{tier:'likely',fact:'fRelease'}),
 'HAP-44':wld_hap('법회 다음 날의 뜰채',['법회 다음 날 아침, 장화를 신은 사람 두 명이 뜰채와 양동이를 들고 강가에 옵니다. 한 사람은 동네 수족관 직원입니다.','두 사람은 어제 봉지가 뒤집힌 자리부터 돌을 하나씩 들어 봅니다. 세 번째 돌 밑에서 {n}이 뜰채로 들어옵니다.','오후까지 양동이에 담긴 열대어는 손에 꼽을 만큼입니다.','법회 게시판에는 이미 다음 달 방생 일정이 올라와 있었다.'],{tier:'likely',fact:'fRelease'})
});
