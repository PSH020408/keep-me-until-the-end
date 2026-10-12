/* ---------- v0.10 catalogue: Stage 3 — 가정 장비·사고 (events/03_home.md, EV-HOM-01 ~ 45) ----------
   HOM-LID in fev_core.js is the plain "no lid, night" scene. HOM-01 (a gap in a closed lid) and HOM-02 (lid off while
   refilling) are different scenes and are kept here; HOM-02 overlaps the engine's jump, so it carries w .5.
   Every top-level name starts with hom_. Home flags are rolled per owner kind when an owner is set up (hom_setup). */

/* ---------- helpers ---------- */
/* how likely this owner is at home / looks in time */
const hom_find=()=>{const m={expert:.75,staff:.75,techbro:.6,learner:.5,grandma:.55,breeder:.5,eager:.35,content:.35,alchemist:.35,unbox:.3,gift:.25,casual:.25,decor:.25,shared:.2,touch:.2,relay:.15,breakup:.15,cult:.1,release:.1,bait:.1,mill:.1,neglect:0};const v=m[kindOf()];return v===undefined?.25:v};
const hom_r=p=>R()<p?1:0;
const hom_kp=(m,d)=>{const v=m[kindOf()];return v===undefined?d:v};
const hom_small=()=>fx_().cm<10;
/* the higher of two hidden checks the species can still reach (e.g. 영리함 40 or 애교 50) */
const hom_best=(...cs)=>{const s=fst(),open=cs.filter(c=>c[1]<=capOf(c[0]));if(!open.length)return cs[0];return open.sort((x,y)=>s[y[0]]/y[1]-s[x[0]]/x[1])[0]};
/* damage in three steps: light · medium · heavy (no ending) */
function hom_lv(lv,t0,t1,t2,extra){
  lv=clamp(lv,0,2);
  const o=[{t:t0,fx:{h:-5,st:.04}},{t:t1,c:'bad',fx:{h:-16,st:.1}},{t:t2||t1,c:'bad',fx:{h:-28,st:.18}}][lv];
  return Object.assign(o,extra||{});
}
/* a hidden roll inside a passive option (the option itself shows no check) */
const hom_roll=(k,need,a,b)=>R()<clamp(Math.pow(fst()[k]/need,2),.05,.95)?valOf(a):valOf(b);
/* 버티기: 근성 (and a little owner skill) decides; failure is the ending */
function hom_endure(need,end,t,extra){
  const ch=clamp(Math.pow(fst().g/need,2),.05,.93)*(.75+S.r*.5);
  if(R()<ch)return Object.assign({t,c:'bad',fx:{h:-22,st:.16}},extra||{});
  return {end};
}
/* 물 밖 결과: 근성 vs need, helped by air breathing and an owner who finds the fish in time */
function hom_dry(need,end,saved,extra){
  const ch=clamp(Math.pow(fst().g/need,2),.05,.95)*(.45+hom_find()*.8)+(fx_().air?.15:0);
  if(R()<ch)return Object.assign({t:saved,c:'bad',fx:{h:-22,st:.16},set:{slime_loss:1}},extra||{});
  return {end};
}
/* the catalogue's owner lessons (owner_learned): key → [fix, line] */
const HOM_FIX={
 gap:[()=>setFl('lid_gap',0),'주인은 뚜껑 뒤 전선 자리의 틈을 스펀지와 케이블 덮개로 막았습니다.'],
 wclid:[()=>setFl('l_wclid',1),'주인은 물을 채우는 동안에도 뚜껑을 덮어 두기로 했습니다.'],
 hctrl:[()=>setFl('l_hctrl',1),'주인은 과열 차단 기능이 있는 온도 조절기를 히터에 따로 달았습니다.'],
 heatoff:[()=>setFl('l_heatoff',1),'주인은 물을 빼기 전에 히터 전원부터 뽑게 되었습니다. 수조 전용 멀티탭도 따로 샀습니다.'],
 battery:[()=>setFl('battery_air',1),'주인은 건전지로 도는 휴대용 기포기를 사서 수조 옆 서랍에 넣어 두었습니다.'],
 rinse:[()=>setFl('l_rinse',1),'주인은 여과기가 오래 멈췄던 날에는 여과통을 먼저 헹구고 다시 켜게 되었습니다.'],
 media:[()=>setFl('l_media',1),'주인은 여과기 스펀지를 수조에서 뺀 물에만 헹구게 되었습니다.'],
 filter24:[()=>{setFl('l_filter24',1);if(S.f.filter!=='없음')S.f.filter='스펀지 여과기'},'주인은 조용한 스펀지 여과기로 바꾸고, 밤에도 끄지 않았습니다.'],
 flow:[()=>setFl('strong_flow',0),'주인은 출수구에 스프레이바를 달아 물살을 나눴습니다.'],
 gravel:[()=>{setFl('gravel_sharp',0);S.f.sand=1},'주인은 각진 색 자갈을 걷어 내고 고운 모래를 깔았습니다.'],
 sand:[()=>setFl('sand_deep',0),'주인은 모래층을 구역을 나눠 조금씩 뒤집어 청소하기 시작했습니다.'],
 hole:[()=>setFl('decor_hole',0),'주인은 입구가 좁은 장식을 빼고 몸에 맞는 굴을 넣었습니다.'],
 sharp:[()=>setFl('decor_sharp',0),'주인은 플라스틱 조화를 빼고 실크 조화와 수초를 넣었습니다.'],
 metal:[()=>setFl('metal_decor',0),'주인은 두꺼비 장식과 동전을 모두 건져 냈습니다.'],
 shells:[()=>setFl('shells',0),'주인은 물의 경도를 재 보고 조개껍데기를 꺼냈습니다.'],
 light:[()=>setFl('light24',0),'주인은 조명에 타이머를 달았습니다. 밤이 다시 왔습니다.'],
 sun:[()=>setFl('sun',0),'주인은 창가의 수조를 볕이 들지 않는 벽 쪽으로 옮겼습니다.'],
 co2:[()=>setFl('l_co2',1),'주인은 CO2에 타이머와 드롭체커를 달았습니다.'],
 valve:[()=>setFl('check_valve',1),'주인은 기포기 줄에 역류 방지 밸브를 끼웠습니다.'],
 feeder:[()=>setFl('l_feeder',1),'주인은 자동 급여기를 쓰기 전에 양을 재고, 습기를 확인하고, 지인에게 들러 달라고 부탁하게 되었습니다.'],
 tank:[()=>setFl('tank_old',0),'주인은 새 수조를 들였습니다.'],
 rock:[()=>setFl('rockwork',0),'주인은 돌을 바닥 유리에 먼저 놓고 그 위에 모래를 덮었습니다.'],
 stand:[()=>setFl('stand_ok',1),'주인은 수조 전용 받침대를 샀습니다.'],
 siphon:[()=>setFl('l_siphon',1),'주인은 사이펀 입구에 망을 씌우고, 물을 버리기 전에 양동이를 들여다보게 되었습니다.'],
 bucket:[()=>setFl('l_bucket',1),'주인은 수조 전용 양동이에 매직으로 "물고기"라고 썼습니다. 세제는 근처에 두지 않았습니다.'],
 spray:[()=>setFl('l_spray',1),'주인은 수조가 있는 방에서는 스프레이를 뿌리지 않게 되었습니다.'],
 wtemp:[()=>setFl('l_wtemp',1),'주인은 새 물을 넣기 전에 온도계로 수온을 맞추게 되었습니다.'],
 ro:[()=>setFl('ro_water',0),'주인은 정수기 물 대신 수돗물에 염소 중화제를 타서 쓰게 되었습니다.'],
 bowl:[()=>setFl('bowl_low',0),'주인은 어항을 높은 선반 위로 옮겨 고정했습니다.'],
 food:[()=>setFl('l_foodhigh',1),'주인은 먹이 통을 아이 손이 닿지 않는 높은 곳에 올려 두었습니다.'],
 hand:[()=>{setFl('l_nohand',1);S.f.lid=1},'주인은 뚜껑에 잠금 고리를 달고 "손 넣지 마세요"를 붙였습니다.'],
 move:[()=>setFl('l_move',1),'주인은 이사할 때 여과재를 수조 물에 담근 채 옮겨야 한다는 걸 적어 두었습니다.'],
 fan:[()=>setFl('l_fan',1),'주인은 여름마다 수조에 냉각 팬을 달게 되었습니다.'],
 winter:[()=>setFl('l_winter',1),'주인은 겨울에 집을 비울 때 수조에 보온 덮개를 씌우고 지인에게 보일러를 부탁하게 되었습니다.'],
 otter:[()=>setFl('otter_fence',1),'주인은 연못 둘레에 높은 울타리를 쳤습니다.'],
 pondwin:[()=>setFl('pond_shallow',0),'주인은 겨울이 오기 전에 깊은 곳으로 물고기를 옮기게 되었습니다.'],
 overflow:[()=>setFl('overflow_guard',1),'주인은 연못에 넘침 배수구를 내고 망을 씌웠습니다.']
};
/* an owner may learn after a near miss; the chance depends on the kind (KIND[].learn), mod adjusts it */
function hom_learn(k,mod){
  const f=S.f;if(S.preOwner||!f||!f.own)return;
  const fx=HOM_FIX[k];if(!fx)return;
  const K=KIND[kindOf()]||{learn:.3};let p=K.learn*(mod===undefined?1:mod);if(f.lazy)p*=.4;if(f.stubborn)p=0;
  if(p<0){addLog(T('주인은 이번 일로 약을 하나 더 사 두었습니다.'),'bad');addFl('meds');return}
  if(R()<p){fx[0]();addLog(T(fx[1]),'good');f.lessons=(f.lessons||0)+1;S.r=clamp(S.r+.02,0,.97)}
  else if(R()<.4)addLog(T(pick(LAZY_NEAR)),'bad');
}
/* home flags of this catalogue, rolled when an owner is set up */
function hom_setup(){
  const f=S.f;if(!f)return;const pond=f.tank==='pond',lay=f.lay||{},L=tankL(),filt=f.filter;
  setFl('lid_gap',f.lid&&!pond?hom_r(hom_kp({eager:.6,casual:.55,decor:.6,expert:.08,staff:.1,techbro:.15},.35)):0);
  setFl('cat_home',f.cat?1:0);
  setFl('child',(S.o&&S.o.fam==='아이 있는 가족')||isKind('touch')||(isKind('grandma','shared','gift')&&R()<.45)?1:0);
  setFl('dog',hom_r(.12));setFl('bowl_low',fl('dog')&&!pond&&L<=60&&R()<.6?1:0);
  setFl('gravel_sharp',!pond&&(lay.sub==='color'||(lay.sub==='gravel'&&R()<.5))?1:0);
  setFl('sand_deep',!pond&&f.sand?hom_r(hom_kp({cult:.8,neglect:.7,casual:.4,decor:.4},.12)):0);
  setFl('decor_hole',!pond&&(['kitsch','pipe'].includes(lay.deco)||isKind('content','eager','decor','gift'))?hom_r(.45):0);
  setFl('decor_sharp',!pond&&(['kitsch','fake'].includes(lay.deco)?R()<.7:isKind('decor','grandma')&&R()<.6)?1:0);
  setFl('metal_decor',pond?0:hom_r(hom_kp({decor:.7,grandma:.4,release:.3},.03)));
  setFl('shells',pond?0:hom_r(hom_kp({gift:.2,grandma:.3,eager:.2,content:.15},.04)));
  setFl('light24',pond?0:hom_r(hom_kp({decor:.4,techbro:.15,content:.35,shared:.3,staff:.2},.03)));
  setFl('sun',pond?0:hom_r(hom_kp({gift:.3,casual:.25,decor:.3,grandma:.4,shared:.3},.08)));
  setFl('co2',pond||fx_().big?0:hom_r(hom_kp({techbro:.5,eager:.25,expert:.35,content:.4},.03)));
  setFl('autofeeder',pond?0:hom_r(hom_kp({techbro:.7,casual:.15,content:.3,breakup:.3},.05)));
  setFl('aironly',!pond&&(filt==='없음'||filt==='스펀지 여과기')&&R()<.7?1:0);
  setFl('check_valve',isKind('expert','staff','techbro')||R()<.3?1:0);
  setFl('strong_flow',!pond&&(isKind('eager','techbro','decor')?R()<.55:filt==='외부 여과기'&&R()<.15)?1:0);
  setFl('tank_old',pond?0:hom_r(hom_kp({relay:.8,breakup:.4,casual:.2,decor:.2,content:.2},.05)));
  setFl('stand_ok',pond||R()<hom_kp({expert:.95,staff:.9,learner:.6,content:.8,techbro:.85,breeder:.8},.35)?1:0);
  setFl('rockwork',!pond&&L>=54?hom_r(hom_kp({content:.4,eager:.3,decor:.3,expert:.1},.05)):0);
  setFl('ro_water',pond?0:hom_r(hom_kp({eager:.25,grandma:.3,decor:.2,content:.15},.03)));
  setFl('basement',pond?0:hom_r(hom_kp({casual:.12,breakup:.15,relay:.15,learner:.08,gift:.08},.02)));
  setFl('ac',hom_r(hom_kp({casual:.5,gift:.5,neglect:.2,shared:.4,breakup:.5,eager:.6},.85)));
  setFl('river_near',pond?hom_r(.3):0);setFl('otter_fence',0);
  setFl('pond_shallow',pond?hom_r(isKind('expert','breeder')?.05:.35):0);
  setFl('overflow_guard',pond&&isKind('expert','breeder')&&R()<.7?1:0);
}
(()=>{const _s=setupOwner;setupOwner=function(own){_s(own);try{hom_setup()}catch(err){}}})();

/* ================= A. 뚜껑과 탈출 ================= */

/* EV-HOM-01 뚜껑 뒤쪽의 틈 — [출처: 레인보우 스네이크헤드·폴립테루스·블랙 고스트의 수조 탈출 사례와 공기 중 생존 시간] */
fev([{id:'HOM-01',tier:'fact',sp:['@escaper'],need:{lid:1,lid_gap:1,pond:0},cd:30,
  w:()=>(isSp('channa','bichir')?1.4:.8)*(isKind('eager','casual','decor')?1.4:1)*(1+.5*Math.min(2,fl('gap_mem'))),
  p:'뚜껑 뒤쪽 모서리, 여과기 호스가 지나가는 자리에 손가락 두 개만 한 틈이 있습니다. 그 틈 아래 수면만 바깥 공기에 닿아 물결이 다르게 흔들립니다. 불이 꺼진 뒤에도 틈 너머에서 냉장고 소리가 들립니다. {n}은…',
  o:[
   {l:'호스를 따라 머리를 틈 쪽으로 밀어 올린다',chk:['w',50],
    ok:{t:'{n}은 틈 끝까지 머리를 밀어 올렸다가 몸을 되돌렸습니다. 틈 너머의 마른 공기가 아가미 뚜껑에 닿았습니다.',fx:{w:2,st:.04},add:{gap_mem:1}},
    no:()=>hom_out01()},
   {l:'틈 아래를 몇 번 지나가며 물결을 느껴 본다',chk:['w',30],
    ok:{t:'{n}은 틈 아래 물결이 어디서 다르게 흔들리는지 익혔습니다.',fx:{w:2},add:{gap_mem:1}},
    no:{t:'{n}은 틈 아래를 몇 번 지나가다 유목 쪽으로 돌아갔습니다.'}},
   {l:'유목 밑에 몸을 넣고 가만히 있는다',ok:{t:'{n}은 유목 밑에서 밤을 보냈습니다.',fx:{g:1}}}
  ]}]);
/* 「바닥 결과」: channa·bichir breathe air and crawl (근성 70); ghost cannot — only an owner who finds it in time */
function hom_out01(){
  if(isSp('ghost')){
    if(R()<hom_find()*.8)return {t:'{n}은 틈을 빠져나와 수조 뒤 바닥으로 떨어졌습니다. 물 마시러 나온 주인이 바닥에서 몸을 접었다 펴는 {n}을 발견해 수조에 넣었습니다. 한쪽 옆구리의 점막이 벗겨지고 작은 비늘이 쓸려 나갔습니다.',c:'bad',fx:{h:-24,st:.18},set:{slime_loss:1},sick:R()<.35?'fungus':null,mem:'마른 바닥. 먼지. 다시 물.',run:()=>hom_learn('gap')};
    return {end:'HOM-01-D'};
  }
  return hom_crawl('{n}은 틈을 빠져나와 바닥으로 떨어졌습니다.',()=>hom_learn('gap'));
}
function hom_crawl(first,learn){
  const g=fst().g,ch=clamp(Math.pow(g/70,2),.05,.95);
  if(R()<ch){
    if(g>=capOf('g')*.9&&R()<.35)return {end:'HOM-01-H'};
    return {t:first+' 공기를 삼키며 바닥을 기어가 소파 근처에서 멈췄습니다. 아침에 주인이 먼지투성이가 된 {n}을 찾아 수조에 넣었습니다.',c:'bad',fx:{h:-18,st:.15},set:{slime_loss:1},sick:R()<.3?'columnaris':null,mem:'마른 바닥. 먼지. 다시 물.',run:learn};
  }
  return {end:'HOM-01-M'};
}
fevEnd({
 'HOM-01-D':{kind:'bad',cat:'탈출',tier:'fact',fx:'f-escape',pl:[[3,'뚜껑 틈을 막지 않음']],
   l:['{n}은 호스를 따라 틈을 빠져나와 수조 뒤 바닥으로 떨어집니다.','공기 중에서 아가미 새엽이 서로 달라붙어 산소를 받아들이는 면이 사라집니다.','{n}은 몸을 S자로 접었다 펴며 바닥을 미끄러집니다. 피부 점액에 먼지와 머리카락이 달라붙습니다.','움직일 때마다 작은 비늘이 덮인 상피가 바닥에 쓸려 벗겨집니다.','꼬리 끝부터 마르며 굳어 갑니다. 아가미 뚜껑이 몇 번 더 열렸다 닫히고 멈춥니다.']},
 'HOM-01-M':{kind:'bad',cat:'탈출',tier:'fact',fx:'f-escape',pl:[[3,'수조 밖으로 나감']],
   l:['{n}은 수조 밖 바닥을 기어 소파 밑으로 들어갑니다. 공기를 삼켜 숨은 이어집니다.','몸 표면의 점액이 마르기 시작합니다. 마른 점액 위에 먼지가 엉겨 붙고 피부가 갈라집니다.','{n}은 물 냄새를 찾아 몇 번 더 기어갑니다. 지느러미 막이 말라 기조에 달라붙습니다.','공기를 삼키는 간격이 점점 길어집니다.','몇 주 뒤 소파를 옮기던 주인이 먼지와 함께 굳어 있는 {n}을 찾습니다.']},
 'HOM-01-H':{kind:'happy',cat:'소파 밑의 사흘',tier:'story',fx:'f-rest',
   l:['사흘 뒤, 청소기를 돌리던 주인이 소파 밑에서 먼지를 뒤집어쓴 {n}을 꺼냈습니다. 아가미 뚜껑이 아직 움직이고 있었습니다.','공기로 숨을 쉬는 몸이 {n}을 살렸습니다. 주인은 그 이야기를 물생활 카페에 올렸고, 댓글이 백 개 넘게 달렸습니다.','그 글에는 사진이 열 장 있었습니다. 뚜껑 틈을 막았다는 말은 없었습니다.']}
});

/* EV-HOM-02 물 채우는 동안 열린 뚜껑 — overlaps the engine's jump (w .5)
   [출처: 실버 아로와나 점프 습성과 수조 밖 점프 사고 빈도] */
fev([{id:'HOM-02',tier:'fact',sp:['arowana','channa','betta','wildbetta','comet','gar','oscar','koi'],need:{pond:0,l_wclid:0},cd:30,
  when:()=>!isKind('neglect'),
  w:()=>.5*(isSp('arowana')?2:isSp('channa','betta','wildbetta','comet')?1.3:isSp('gar')?.8:.4)*sideK('jumpy'),
  p:'호스에서 물이 쏟아져 들어옵니다. 수면이 수조 위 가장자리까지 차오릅니다. 주인의 발소리가 현관 쪽으로 멀어집니다. 수면 위로는 천장 조명만 보입니다. {n}은…',
  o:[
   {l:'쏟아지는 물줄기를 피해 수면 바로 아래로 빠르게 올라간다',chk:()=>isSp('comet')?null:['w',45],
    ok:()=>isSp('comet')?hom_jump02():{t:'{n}은 수면 바로 아래에서 몸을 돌렸습니다. 주인이 돌아와 물을 잠갔습니다.',c:'good',fx:{w:2}},
    no:()=>hom_jump02()},
   {l:'물줄기 가장자리에서 흩어지는 거품을 따라 돈다',chk:['g',40],
    ok:{t:'{n}은 거품을 따라 수조를 몇 바퀴 돌았습니다.',fx:{g:1,p:1}},
    no:{t:'{n}이 물줄기에 휩쓸려 유리에 옆구리를 부딪쳤습니다.',c:'bad',fx:{h:-8,st:.06},set:{scar:1}}},
   {l:'바닥 구석에 몸을 붙이고 있는다',ok:{t:'{n}은 물이 다 찰 때까지 바닥에서 움직이지 않았습니다.'}}
  ]}]);
/* 점프 결과표 by strength within the species cap */
function hom_jump02(){
  const p=fst().p,cap=capOf('p');
  if(isSp('arowana')){
    if(p>=cap*.9)return {t:'{n}이 수면을 박차고 타일 위에 떨어지자마자 몸을 튕겨 수조로 되돌아갔습니다. 돌아온 주인은 타일 위의 물자국과 비늘 세 장을 보고 사태를 파악했습니다. 그날 저녁 뚜껑을 주문했고, 뚜껑이 오기 전 이틀 동안은 물을 갈지 않았습니다.',c:'good',fx:{h:-6,wq:-6},set:{l_wclid:1},mem:'타일 바닥. 그리고 다시 물.'};
    if(p>=cap*.6&&R()<.5)return {t:'{n}이 타일 위에서 크게 몸을 휘다 수조 받침을 차고 물속으로 되떨어졌습니다. 옆구리 비늘이 한 줄로 떨어져 나갔습니다.',c:'bad',fx:{h:-22,st:.15},set:{scar:1},run:()=>hom_learn('wclid')};
    return {end:'HOM-02-D'};
  }
  if(isSp('channa'))return hom_crawl('{n}은 수조 가장자리를 넘어 타일 위로 떨어졌습니다.',()=>hom_learn('wclid'));
  if(isSp('betta','wildbetta'))return R()<.55+fst().w/300?{t:'{n}이 수조 밖 타일에 떨어졌습니다. 돌아온 주인이 손으로 {n}을 떠서 물에 넣었습니다. 바닥에 달라붙었던 긴 지느러미 막이 찢어져 있었습니다.',c:'bad',fx:{h:-12,fin:.3,st:.12},run:()=>hom_learn('wclid')}:{end:'HOM-02-F'};
  if(isSp('comet'))return p>=cap*.6&&R()<.55?{t:'{n}이 타일 위에서 두어 번 퍼덕이다 받침을 차고 물속으로 떨어졌습니다. 옆구리 비늘 몇 장이 바닥에 남았습니다.',c:'bad',fx:{h:-14,st:.1},run:()=>hom_learn('wclid')}:{end:'HOM-02-F'};
  /* gar · oscar · koi: big bodies catch on the rim half the time */
  return R()<.5||(p>=cap*.6&&R()<.4)?{t:'{n}의 큰 몸이 수조 모서리에 걸렸다가 물속으로 다시 떨어졌습니다. 모서리에 쓸린 옆구리가 벗겨졌습니다.',c:'bad',fx:{h:-14,st:.1},set:{scar:1},run:()=>hom_learn('wclid')}:{end:'HOM-02-F'};
}
fevEnd({
 'HOM-02-D':{kind:'bad',cat:'점프사',tier:'fact',fx:'f-floor',pl:[[3,'물 채우는 동안 뚜껑을 열어 둠']],fact:'fJumpF',
   l:['{n}은 수면 위로 몸을 던지고 수조 가장자리를 넘어 타일 위에 떨어집니다.','옆구리 비늘이 한 줄로 떨어져 나가고 그 아래 진피가 드러납니다.','{n}은 몸을 크게 휘어 튀어 오르고, 받침대 모서리에 머리를 부딪칩니다. 눈 흰자 쪽 결막 아래로 피가 번집니다.','공기 중에서 아가미 새엽이 무너져 붙습니다. 퍼덕임이 점점 짧아집니다.','주인이 돌아왔을 때 {n}의 아래턱 수염 두 가닥은 타일에 말라붙어 있습니다.']},
 'HOM-02-F':{kind:'bad',cat:'점프사',tier:'fact',fx:'f-floor',pl:[[3,'물 채우는 동안 뚜껑을 열어 둠']],fact:'fJumpF',
   l:['{n}은 차오른 수면을 넘어 타일 위로 떨어집니다. 현관 쪽에서 주인의 통화 소리가 들립니다.','{n}은 몸을 튕기며 물을 찾습니다. 퍼덕일 때마다 비늘과 점막이 타일에 묻어 떨어집니다.','공기 중에서 아가미 새엽이 서로 들러붙어 마릅니다. 아가미 뚜껑이 점점 느려집니다.','주인이 돌아왔을 때 수조는 가득 차 있고, {n}은 그 아래 타일에 붙어 있습니다.']}
});

/* ================= B. 히터 ================= */

/* EV-HOM-03 히터 없는 첫 추위 — overlaps the engine's cold (w .5)
   [출처: 알텀 엔젤·모토로·블랙 고스트 적정 수온 범위; Channa bleheri 저수온 내성; 저수온과 어류 면역 저하 관계] */
const hom_coldHigh=()=>isSp('altum','motoro','ghost','clownloach','arowana','bichir','peapuffer','betta');
fev([{id:'HOM-03',tier:'fact',sp:['@tropical','gar'],own:['casual','gift','eager','shared','decor','cult','neglect'],need:{heater:0,pond:0,season:'autumn'},once:1,w:.5,
  p:'아침 햇빛이 짧아졌습니다. 물이 서늘합니다. 먹이가 떨어져도 몸이 느리게 반응합니다. 수조 위 조명 바로 아래 수면만 조금 덜 차갑습니다. {n}은…',
  o:[
   {l:'조명 바로 아래 수면 쪽 물에 머문다',chk:()=>isSp('channa','gar')?null:['w',40],ok:()=>hom_cold03(hom_coldHigh()?1:0),no:()=>hom_cold03(2)},
   {l:'지느러미를 접은 채 주인이 오는 쪽 유리 앞에 떠 있는다',chk:()=>isSp('channa','gar')?null:['c',50],
    ok:()=>isSp('channa','gar')?hom_cold03(0):R()<.45+S.r*.6?{t:'"지느러미를 접고 있다"를 검색하던 주인이 그날 저녁 히터를 사 왔습니다. 주인은 "물고기도 추위를 탄다"는 걸 처음 알았습니다.',c:'good',fx:{c:2},run:()=>{S.f.heater=1;S.f.coldShock=0}}:hom_cold03(1),
    no:()=>hom_cold03(2)},
   {l:'바닥 구석에서 움직이지 않는다',ok:()=>isSp('channa','gar')?hom_cold03(0):hom_roll('g',25,()=>hom_cold03(hom_coldHigh()?1:0),()=>hom_cold03(2))}
  ]}]);
function hom_cold03(lv){
  if(isSp('channa'))return {t:'{n}은 서늘한 물에서도 평소처럼 헤엄쳤습니다. 주인은 "얘는 튼튼하네"라며 이듬해에도 히터를 사지 않았습니다.',fx:{g:1},set:{no_heater:1}};
  if(isSp('gar'))return {t:'물이 차가워지자 {n}은 먹는 양을 줄였습니다. 몸이 자라는 속도가 느려졌습니다.',fx:{fat:-.1}};
  if(lv>=2&&isSp('altum'))return {end:'HOM-03-D'};
  const sick=isSp('clownloach','neon','guppy')?'ich':isSp('altum')?'fungus':isSp('betta')&&R()<.5?'finrot':R()<.3?'ich':null;
  const extra={sick:lv>=1?sick:null,set:lv>=1&&isSp('altum','motoro')?{thin:1}:{}};
  return hom_lv(lv,'{n}은 차가운 물에서 느리게 버텼습니다.',
    isSp('motoro')?'{n}의 원반 가장자리가 위로 말려 올라갔습니다. 먹이를 받아먹지 않았습니다.':isSp('betta')?'{n}은 지느러미를 접고 바닥에 누워 지냈습니다.':'{n}은 며칠 동안 먹이를 거의 먹지 않았습니다. 몸이 차가운 물을 이기지 못했습니다.',
    '{n}은 차가운 물에서 거의 움직이지 못했습니다. 피부의 윤기가 빠지고 몸 색이 어두워졌습니다.',extra);
}
fevEnd({'HOM-03-D':{kind:'bad',cat:'저수온',tier:'fact',fx:'f-thin',pl:[[2,'열대어에게 히터를 사 주지 않음']],fact:'fTemp',
  l:['{n}은 열흘째 먹이를 받아먹지 않습니다. 몸속 지방이 줄어 등 뒤 근육이 얇아집니다.','차가운 물에서 면역 반응이 느려진 피부 위로 수생 곰팡이 포자가 내려앉습니다.','지느러미 끝 상처 자리에서 흰 균사가 자라 상피 아래로 파고듭니다.','{n}은 수초 사이에 몸을 세우고 지느러미를 펴려 합니다. 균사가 덮인 등지느러미는 펴지지 않습니다.','사흘 뒤 균사는 아가미 뚜껑 가장자리까지 번집니다.']}});

/* EV-HOM-04 꺼지지 않는 히터 — overlaps the engine's cook (w .5)
   [출처: 수중 히터 바이메탈 온도조절기 고착 고장 사례; 수온별 용존 산소량(물리 상수표); 오스카 고온 한계] */
fev([{id:'HOM-04',tier:'fact',sp:['@tropical','@gold','gar'],need:{heater:1,pond:0},cd:60,
  w:()=>.5*(fl('l_hctrl')?.2:1)*(isKind('techbro')?1.5:1),
  log:()=>isKind('techbro')?'스마트 플러그 앱에는 "히터 OFF"가 떠 있었습니다. 플러그 안의 릴레이 접점은 붙어 있었습니다.':'히터 안의 온도조절기 접점이 붙은 채 떨어지지 않았습니다.',
  p:'밤새 물이 점점 따뜻해집니다. 히터의 주황색 불빛이 꺼지지 않습니다. 숨을 쉬어도 아가미로 들어오는 것이 모자랍니다. 여과기 출수구 아래 수면만 거품이 일어 조금 낫습니다. {n}은…',
  o:[
   {l:'출수구 아래 거품이 이는 수면으로 올라간다',chk:['w',40],ok:()=>hom_heat04(0),no:()=>hom_heat04(1)},
   {l:'주인 발소리가 들릴 때마다 유리 앞 수면에서 입을 벌린다',chk:()=>['c',isSp('channa')?65:55],
    ok:()=>isKind('techbro')?{t:'스마트 컨트롤러 앱에는 "수온 정상 26.0°C"가 떠 있었습니다. 주인은 유리 앞에서 입을 벌리는 {n}을 영상으로 찍다가 손이 뜨거워서 히터를 뽑았습니다. 다음 날 주인은 온도 센서를 하나 더 달았습니다. 두 센서는 서로 다른 값을 보여 주었습니다.',c:'good',fx:{h:-6},set:{sensor:1},run:()=>hom_learn('hctrl')}
      :R()<.5+S.r*.5?{t:'주인이 유리에 손을 대 보고 놀라 히터 플러그를 뽑았습니다. 찬물을 조금씩 섞어 수온을 내렸습니다.',c:'good',fx:{h:-6,c:2},run:()=>hom_learn('hctrl')}:hom_heat04(1),
    no:()=>hom_heat04(1)},
   {l:'바닥에서 움직임을 줄이고 가만히 있는다',ok:()=>hom_roll('g',isSp('channa')?35:25,()=>hom_heat04(0),()=>hom_heat04(2))}
  ]}]);
function hom_heat04(lv){
  if(isSp('@gold','koi','arowana','oscar','channa','neon','altum'))lv++;
  if(isSp('@airbreather')&&!isSp('channa')&&R()<.5)lv--;          // 오래 버팀 = 주인이 알아챌 시간
  if(isSp('arowana','oscar')&&R()<.35)lv--;                       // big tanks warm slowly
  if(lv>=3||(lv>=2&&R()<.6))return {end:'HOM-04-D'};
  return hom_lv(lv,'아침에 주인이 히터 불빛이 이상하다는 걸 보고 플러그를 뽑았습니다. {n}은 수면에서 숨을 고르고 있었습니다.',
    '아침에 주인이 히터를 뽑았을 때 {n}의 아가미는 짙은 붉은색으로 부어 있었습니다.','물이 식은 뒤에도 {n}은 한동안 몸을 똑바로 세우지 못했습니다. 아가미가 상해 숨이 가빴습니다.',
    {set:{inj_gill:1},sick:lv>=1&&R()<.3?(isSp('@gold')?'swimb':'fungus'):null,run:()=>hom_learn('hctrl',isKind('expert')?1.2:1)});
}
fevEnd({'HOM-04-D':{kind:'bad',cat:'과열',tier:'fact',fx:'f-cook',pl:[[2,'히터 고장을 확인하지 않음']],fact:'fTemp',
  l:['수온이 38도를 넘자 {n}의 몸이 쓰는 산소가 물이 줄 수 있는 산소를 넘어섭니다.','{n}은 수면에 입을 대고 아가미 뚜껑을 크게 열었다 닫습니다. 아가미 새엽의 모세혈관이 늘어나 새엽이 짙은 붉은색으로 부풀어 오릅니다.','{n}은 유리 쪽으로 몸을 돌려 주인이 늘 서 있던 자리를 향해 입을 벌립니다.','근육 단백질이 굳기 시작해 몸통이 한쪽으로 휜 채 펴지지 않습니다. {n}은 휜 몸으로 몇 번 더 수면을 향해 올라가다 바닥으로 기울어집니다.','아침에 주인이 본 {n}의 눈은 하얗게 흐려져 있습니다.']}});

/* EV-HOM-05 공기 중에 드러난 히터
   [출처: 수족관 히터 제조사 설명서의 "물 밖에서 작동 금지·전원 끄고 30분 뒤 꺼내기" 경고; 저수온이 어류 심박·평형에 미치는 영향] */
fev([{id:'HOM-05',tier:'fact',sp:['@tropical'],own:['eager','casual','gift','learner'],need:{heater:1,pond:0,l_heatoff:0},cd:50,
  log:'주인이 물을 갈기 시작했습니다. 히터 전원은 켜져 있었습니다.',
  p:'물이 절반쯤 빠져나갑니다. 수면 위로 드러난 히터 유리관에서 열기가 올라옵니다. 이어 차가운 수돗물이 쏟아져 들어옵니다. 짧게 \'틱\' 소리가 나고, 여과기 소리와 조명이 한꺼번에 꺼집니다. {n}은…',
  o:[
   {l:'소리가 난 히터 쪽으로 다가가 본다',chk:['w',35],
    ok:()=>hom_after05({t:'{n}은 금이 간 유리관 둘레를 맴돌다 물러났습니다.',fx:{w:1}}),
    no:()=>hom_after05({t:'아직 뜨거운 유리관에 {n}의 옆구리가 닿았습니다. 닿은 자리의 비늘이 하얗게 들떴습니다.',c:'bad',fx:{h:-10,st:.06},set:{inj_burn:1}})},
   {l:'차가운 물줄기 반대편 구석으로 간다',chk:['g',40],
    ok:()=>hom_after05({t:'{n}은 찬물이 섞이는 동안 반대편 구석에서 버텼습니다.',fx:{g:1}}),
    no:()=>hom_after05({t:'찬물이 {n}의 몸을 훑고 지나갔습니다. {n}은 한동안 몸을 떨었습니다.',c:'bad',fx:{h:-8,st:.08},sick:R()<.4?'ich':null})},
   {l:'바닥 수초 사이에 몸을 낮춘다',ok:()=>hom_after05({t:'{n}은 수초 사이에서 물이 다 찰 때까지 기다렸습니다.'})}
  ]}]);
/* what happens next depends on whether the owner notices the cracked heater */
function hom_after05(first){
  return Object.assign({},first,{run:()=>q(null,null,()=>{
    setFl('fstop',1);
    if(isKind('learner')&&R()<.6||R()<S.r*.5){fevOut({t:'주인은 차단기를 올리다 히터 유리관의 금을 발견했습니다. 그날 저녁 새 히터를 달았습니다.',c:'good'});hom_learn('heatoff');return}
    S.f.heater=0;setFl('heater_broken',1);
    if(season()!=='winter'){fevOut({t:'주인은 차단기만 올렸습니다. 히터가 깨진 줄은 몰랐습니다.',c:'bad'});return}
    if(R()<.5){fevOut({t:'주인은 차단기만 올렸습니다. 히터가 깨진 줄은 몰랐습니다. 겨울 물이 하루하루 식어 갔습니다.',c:'bad',fx:{h:-10},sick:'ich'});return}
    const ch=clamp(Math.pow(fst().g/(isSp('clownloach','altum','motoro','ghost')?55:40),2),.05,.9);
    fevOut(R()<ch?{t:'차단기가 내려간 채 밤이 지났습니다. 다음 날 저녁 돌아온 주인이 차단기를 올렸습니다. {n}은 바닥에서 느리게 아가미를 움직이고 있었습니다.',c:'bad',fx:{h:-22,st:.15},sick:'ich'}:{end:'HOM-05-D'});
  })});
}
fevEnd({'HOM-05-D':{kind:'bad',cat:'저수온',tier:'fact',fx:'f-ice',pl:[[2,'환수 중 히터를 끄지 않음']],fact:'fTemp',
  l:['수온이 하룻밤 사이 17도까지 내려갑니다. {n}의 심장 박동이 느려지고 근육에 닿는 혈류가 줄어듭니다.',()=>isSp('clownloach','neon','cory')?'{n}은 무리와 함께 바닥 유목 아래로 모여 몸을 붙입니다. 아가미 뚜껑의 움직임이 느려집니다.':'{n}은 바닥 유목 아래로 들어가 몸을 붙입니다. 아가미 뚜껑의 움직임이 느려집니다.','균형을 잡는 근육이 제때 반응하지 못해 몸이 옆으로 넘어갑니다.','{n}은 넘어진 채 가슴지느러미를 저어 다시 몸을 세우려 합니다.',()=>isSp('clownloach')?'다음 날 저녁 주인은 옆으로 누운 {n}을 보고 "또 자네"라고 말한 뒤 차단기를 올립니다.':'다음 날 저녁 주인은 바닥에 누운 {n}을 보지 못하고 차단기를 올립니다.']}});

/* EV-HOM-06 히터에 몸을 붙이고 잔 밤 (§3-4 심화) — [출처: 수족관 히터에 의한 저서성 어류(플레코·가오리) 화상 사례; 열 손상 후 2차 세균 감염] */
const hom_noLeave06=()=>isSp('neon','comet','pleco','oranda','ryukin','guppy','platy');
fev([{id:'HOM-06',tier:'fact',need:{heater:1,heater_cover:0,pond:0},cd:40,
  w:()=>isSp('@bottom','ghost','gar')?2:isSp('neon','guppy','platy')?.6:isSp('@gold','koi')?.4:.8,
  p:'밤이 되자 수조 한쪽 유리관 주변만 물이 따뜻합니다. 유리관 표면은 손바닥만 한 자리만큼 매끄럽고 따뜻합니다. 바닥 쪽 다른 자리는 모래가 차갑습니다. {n}은…',
  o:[
   {l:'따뜻한 유리관에 몸을 붙이고 쉰다',chk:()=>hom_noLeave06()?null:['w',45],
    ok:()=>hom_noLeave06()?hom_burn06():{t:'유리관이 뜨거워지기 전에 {n}은 몸을 뗐습니다.',fx:{w:2}},no:()=>hom_burn06()},
   {l:'유리관 둘레를 몇 바퀴 돌다가 수초 그늘로 간다',chk:['w',25],ok:{t:'{n}은 수초 그늘에서 밤을 보냈습니다.',fx:{w:1}},no:{t:'{n}은 유리관 둘레를 맴돌다 날이 밝았습니다.'}},
   {l:'늘 쉬던 유목 밑으로 들어간다',ok:{t:'{n}은 유목 밑에서 밤을 보냈습니다.',fx:{g:1}}}
  ]}]);
function hom_burn06(){
  if(isSp('neon','guppy','platy')){   // 끼임 변형: cannot push out (힘 30 locked) — only endure
    const ch=clamp(Math.pow(fst().g/40,2),.05,.9);
    return R()<ch?{t:'{n}이 히터와 유리 사이 틈에 끼었습니다. 밤새 버둥거리다 아침에 주인이 히터를 들어 올리자 빠져나왔습니다. 옆구리가 하얗게 데어 있었습니다.',c:'bad',fx:{h:-20,st:.15},set:{inj_burn:1},near:'heater_cover'}:{end:'HOM-06-S'};
  }
  if(isSp('motoro')){const ch=clamp(Math.pow(fst().g/60,2),.05,.9);
    return R()<ch?{t:'{n}의 원반 아랫면이 히터 모양으로 하얗게 데었습니다. {n}은 모래 속에서 며칠을 버텼습니다.',c:'bad',fx:{h:-25,st:.15},set:{inj_burn:1,scar:1},sick:R()<.4?'columnaris':null,near:'heater_cover'}:{end:'HOM-06-D'}}
  if(isSp('pleco'))return {t:'{n}의 배 쪽 피부가 히터 모양 그대로 하얗게 변했습니다. 상처는 흉터를 남기고 아물었습니다.',c:'bad',fx:{h:-12},set:{scar:1},near:'heater_cover'};
  if(isSp('bichir','gar'))return {t:'두꺼운 비늘 덕에 {n}의 화상은 작았습니다. 대신 큰 몸에 눌린 히터의 흡착판이 떨어져 히터가 바닥재에 묻혔습니다.',c:'bad',fx:{h:-6},set:{heater_crack:1},near:'heater_cover'};
  if(isSp('clownloach','cory'))return {t:'옆으로 붙어 잔 {n}의 옆구리가 데었습니다. 몸 옆을 따라 이어진 측선 일부가 하얗게 상했습니다.',c:'bad',fx:{h:-15,st:.08},set:{inj_burn:1},sick:R()<.35?'fungus':null,near:'heater_cover'};
  return {t:'유리관에 닿았던 {n}의 몸에 비늘 몇 장 크기의 하얀 자국이 생겼습니다.',c:'bad',fx:{h:-10},set:{inj_burn:1},near:'heater_cover'};
}
fevEnd({
 'HOM-06-D':{kind:'bad',cat:'화상',tier:'fact',fx:'f-cook',pl:[[3,'히터에 덮개를 씌우지 않음']],
   l:['{n}은 원반 아랫면을 유리관에 붙인 채 밤을 보냅니다. 닿은 자리의 상피와 진피 단백질이 열에 굳어 하얀 띠가 생깁니다.','이틀 뒤 하얀 띠의 조직이 죽어 가장자리부터 들뜹니다.','{n}은 모래에 몸을 묻으려고 원반을 흔듭니다. 모래알이 들뜬 상처 안으로 들어가 괴사 조직을 더 벗겨 냅니다.','드러난 근육 위로 세균이 번식해 상처 둘레가 붉게 부풉니다.','감염이 원반 가장자리를 따라 번지는 동안 {n}은 계속 모래 속으로 파고듭니다.']},
 'HOM-06-S':{kind:'bad',cat:'화상',tier:'fact',fx:'f-cook',pl:[[3,'히터에 덮개를 씌우지 않음']],
   l:['{n}은 히터와 유리 사이 좁은 틈으로 들어갔다가 몸이 끼입니다.','유리관에 닿은 옆구리의 상피 단백질이 열에 굳어 하얗게 변합니다.','{n}은 꼬리를 저어 빠져나오려 합니다. 움직일 때마다 데인 자리가 유리관에 다시 눌립니다.','밤이 깊어지자 꼬리 젓는 간격이 길어집니다. 지친 몸이 유리관 쪽으로 기웁니다.','아침에 주인이 히터를 들어 올리자 {n}이 틈에서 떨어져 바닥으로 가라앉습니다.']}
});

/* ================= C. 여과기와 물의 흐름 ================= */

/* EV-HOM-07 흡입구 (§3-3 심화) — overlaps the engine's intake (w .5)
   [출처: 여과기 흡입구 스펀지(프리필터) 권장 근거, 소형어·장지느러미어 흡입 사고 사례] */
fev([{id:'HOM-07',tier:'fact',sp:['neon','guppy','peapuffer','apisto','betta','oranda','ryukin','ghost'],need:{intake_guard:0,pond:0},cd:40,
  when:()=>['hob','canister'].includes(fl('filter')),w:()=>.5*(isKind('eager')?2:1),
  p:'수조 구석 관 아래에서 물이 한 방향으로 끌려 들어갑니다. 그 근처를 지나면 몸이 저절로 관 쪽으로 기웁니다. 관 표면에 먹이 부스러기가 붙어 있습니다. {n}은…',
  o:[
   {l:'끌려가는 물을 거슬러 관 앞 부스러기를 쪼아 먹는다',chk:['p',30],ok:{t:'{n}은 물살을 버티며 관 앞 부스러기를 다 먹었습니다.',fx:{p:2}},no:()=>hom_suck07()},
   {l:'관 옆 수초 줄기에 몸을 기대 부스러기가 떨어지길 기다린다',chk:['w',35],ok:{t:'부스러기가 하나씩 떨어져 {n} 앞으로 흘러왔습니다.',fx:{w:2}},no:()=>hom_fin07()},
   {l:'관에서 가장 먼 구석으로 간다',ok:()=>isSp('apisto')?{t:'{n}은 구석으로 갔다가, 굴 앞이 마음에 걸려 금세 관 근처로 돌아왔습니다.'}:{t:'{n}은 구석에서 끌리는 물을 피했습니다.'}}
  ]}]);
function hom_suck07(){
  if(isSp('neon','guppy','peapuffer')){
    if(fl('filter')==='hob')return R()<.5?{end:'HOM-07-H'}:{t:'{n}이 흡입관 입구에 빨려 붙었다가 주인이 여과기를 끄자 떨어져 나왔습니다. 비늘 몇 장이 관 안으로 사라졌습니다.',c:'bad',fx:{h:-15,st:.12},near:'intake_guard'};
    return {end:'HOM-07-I'};
  }
  return hom_fin07();
}
function hom_fin07(){
  if(isSp('ghost'))return {t:'{n}의 가는 꼬리 끝이 흡입구 틈에 끼었다 빠졌습니다. 꼬리지느러미 끝이 찢어졌습니다.',c:'bad',fx:{h:-8,fin:.2},near:'intake_guard'};
  if(isSp('apisto','neon','peapuffer'))return {t:'{n}의 몸이 흡입구 망에 잠시 붙었다 떨어졌습니다.',c:'bad',fx:{h:-8,fin:.12},near:'intake_guard'};
  /* long fins: stuck on the mesh all night — 힘 30 (oranda locked) or else 근성 */
  const c=fst().p>=30&&capOf('p')>=30?['p',30]:['g',55],ch=clamp(Math.pow(fst()[c[0]]/c[1],2),.05,.9);
  return R()<ch?{t:'{n}의 지느러미가 흡입구 망에 붙었습니다. 밤새 당긴 끝에 지느러미 막이 찢어지며 떨어져 나왔습니다.',c:'bad',fx:{h:-12,fin:.35,st:.1},sick:R()<.35?'finrot':null,near:'intake_guard'}:{end:'HOM-07-D'};
}
fevEnd({
 'HOM-07-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-intake',pl:[[3,'흡입구에 스펀지를 씌우지 않음']],
   l:['{n}의 꼬리지느러미 끝이 흡입구 망에 붙습니다. {n}은 앞으로 헤엄쳐 지느러미를 떼려 합니다.','당길 때마다 지느러미 기조 사이의 얇은 막이 망 구멍마다 갈라집니다. 갈라진 막이 더 깊이 빨려 들어가 기조 두 개가 부러집니다.','밤새 몸을 당기는 동안 꼬리자루 근육이 지쳐 떨리기 시작합니다.',()=>isSp('betta')?'새벽에 {n}은 망에 매달린 채 수면으로 숨을 쉬러 올라가지 못합니다. 라비린스 기관에 공기를 채우지 못한 몸이 망 앞에서 천천히 기울어집니다.':'새벽이 되자 {n}의 아가미 뚜껑이 망 앞에서 느려집니다. 매달린 몸이 물살 쪽으로 천천히 기울어집니다.']},
 'HOM-07-I':{kind:'bad',cat:'사고',tier:'fact',fx:'f-intake',pl:[[3,'흡입구에 스펀지를 씌우지 않음']],fact:'외부 여과기 흡입관으로 빨려 들어간 작은 물고기는 안쪽의 임펠러(물을 돌리는 날개)에 닿습니다.',
   l:['{n}은 흡입관 입구로 통째로 빨려 들어갑니다. 관 안에서 몸이 앞뒤로 뒤집히며 비늘이 벗겨집니다.','관을 지나 여과통 안 임펠러에 닿습니다. 빠르게 도는 날개가 몸통을 칩니다.','배 쪽이 갈라지고 척추가 꺾입니다. 잘린 지느러미 조각이 여과재 사이로 흩어집니다.','출수구에서는 평소와 같은 물이 나옵니다. 주인은 수조에서 {n}이 보이지 않는다는 걸 며칠 뒤에 알아챕니다.']},
 'HOM-07-H':{kind:'happy',cat:'여과조 속 석 달',tier:'story',fx:'f-rest',
   l:['{n}은 흡입관을 지나 여과조 안 스펀지 위에 떨어졌습니다. 그곳에는 먹이 부스러기가 계속 흘러 들어오고 아무도 쫓아오지 않았습니다.','석 달 뒤 여과재를 갈던 주인이 통통해진 {n}을 발견했습니다.','주인은 그동안 {n}이 죽은 줄 알고 같은 물고기를 두 마리 더 사 두었습니다.']}
});

/* EV-HOM-08 태풍 밤의 정전 — overlaps the engine's oxygen (w .5)
   [출처: 정전 시 수조 용존 산소 감소 속도; 어류 저산소 반응(수면 호흡, 서맥); 국내 태풍 정전 통계는 화면에 쓰지 않음] */
fev([{id:'HOM-08',tier:'fact',need:{pond:0,season:['summer','autumn']},cd:60,w:.5,
  p:'창밖에서 바람이 유리를 흔듭니다. 여과기 소리가 멎고 조명이 꺼집니다. 물이 움직이지 않습니다. 몇 시간이 지나자 숨을 쉬어도 가슴이 답답할 만큼 물이 무거워집니다. {n}은…',
  o:[
   {l:'수면으로 올라가 물 표면에 입을 대고 숨을 쉰다',chk:()=>fx_().air?null:['g',25],ok:()=>hom_out08(0),no:()=>hom_out08(1)},
   {l:'지느러미 움직임을 줄이고 물 가운데에 떠 있는다',chk:['g',40],ok:()=>hom_out08(0),no:()=>hom_out08(1)},
   {l:'바닥 구석에 가만히 엎드린다',ok:()=>isSp('cory','pleco','bichir')?hom_out08(0):hom_roll('g',25,()=>hom_out08(1),()=>hom_out08(2))}
  ]}]);
function hom_out08(lv){
  if(isSp('@gold','koi','arowana','oscar','altum'))lv++;
  if(fx_().air)lv--;
  if(fl('battery_air'))lv-=2;
  setFl('fstop',1);
  if(lv<=0&&fx_().air&&S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id)&&R()<.4)
    return {t:'아침에 전기가 들어왔을 때 다른 물고기들은 수면에 떠 있었습니다. 수면 공기를 마신 {n}만 멀쩡했습니다. 주인은 {n}을 "제일 튼튼한 물고기"라고 불렀습니다.',c:'bad',fx:{st:.1},run:()=>{S.f.mates.forEach(m=>{if(m.id!==S.sp.id)m.n=Math.floor(m.n/3)});hom_learn('battery')}};
  if(lv>=2)return R()<.6?{end:'HOM-08-D'}:{t:'전기가 들어왔을 때 {n}은 수면 바로 아래에서 옆으로 기운 채 아가미를 움직이고 있었습니다.',c:'bad',fx:{h:-30,st:.2},set:{inj_gill:1},run:()=>hom_learn('battery')};
  return hom_lv(lv,'새벽에 전기가 돌아왔습니다. {n}은 수면 가까이에서 숨을 고르고 있었습니다.','전기가 돌아왔을 때 {n}의 아가미 새엽은 짙은 색으로 부어 있었습니다.',null,{set:lv>=1?{inj_gill:1}:{},run:()=>hom_learn('battery',isKind('techbro')?1.2:1)});
}
fevEnd({'HOM-08-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-float',pl:[[2,'정전 대비 없음']],fact:'fO2',
  l:['정전 일곱 시간째, 수조의 물은 움직이지 않습니다. {n}은 수면에 입을 대고 아가미 뚜껑을 빠르게 움직입니다.','산소가 모자란 심장은 오히려 박동을 늦춥니다. 아가미 새엽의 상피 아래 혈관에 피가 고여 새엽이 짙은 색으로 변합니다.','{n}은 수면을 따라 수조를 몇 바퀴 돌며 입을 벌립니다. 몸의 색이 군데군데 어둡게 변합니다.','전기가 들어와 여과기가 다시 돌기 시작했을 때 {n}은 수면 바로 아래에서 배를 위로 돌린 채 떠 있습니다.']}});

/* EV-HOM-09 전기가 돌아온 뒤 (재가동)
   [출처: 외부 여과기 장시간 정지 후 혐기화와 재가동 시 주의(제조사 설명서·사육 지침); 황화수소의 어류 아가미 독성 기전
    — 수조 재가동 사고의 실제 원인 물질이 확인되지 않으면 문장에서 "황화수소"를 빼고 "고인 물의 암모니아"만 남긴다] */
fev([{id:'HOM-09',tier:'fact',need:{fstop:1,pond:0,l_rinse:0},cd:20,
  when:()=>fl('filter')!=='none',
  p:'전기가 들어오고 여과기가 다시 돕니다. 출수구에서 검은 물과 찌꺼기가 한꺼번에 쏟아져 나옵니다. 물에서 썩은 냄새가 납니다. {n}은…',
  o:[
   {l:'출수구 앞에서 쏟아지는 찌꺼기를 받아먹는다',chk:()=>capOf('g')<60?null:['g',60],
    ok:()=>capOf('g')<60?hom_out09(2):{t:'{n}은 검은 물을 맞으면서도 찌꺼기를 받아먹었습니다.',fx:{g:2,h:-6}},no:()=>hom_out09(2)},
   {l:'출수구 반대편 끝으로 헤엄쳐 간다',chk:['w',40],ok:{t:'{n}은 물이 섞이기 전 몇 분을 반대편 끝에서 피했습니다.',fx:{w:2,h:-3},set:{fstop:0}},no:()=>hom_out09(1)},
   {l:'바닥 수초 사이에 가만히 있는다',ok:()=>hom_out09(1)}
  ]}]);
function hom_out09(lv){
  if(isKind('expert','staff'))return {t:'주인은 여과기를 켜기 전에 여과통을 열어 고인 물을 버리고 헹궜습니다. 출수구에서는 맑은 물이 나왔습니다.',c:'good',set:{fstop:0}};
  if(isSp('@scaleless','altum','neon'))lv++;
  if(isSp('@gold','koi','pleco','gar'))lv--;
  setFl('fstop',0);
  if(lv>=3||(lv>=2&&isSp('@scaleless','altum','neon')&&R()<.6))return {end:'HOM-09-D'};
  return hom_lv(lv,'{n}은 탁한 물이 맑아질 때까지 버텼습니다.','{n}의 아가미가 따끔거리며 부었습니다. 주인이 그날 저녁 물을 반쯤 갈았습니다.','{n}의 아가미 새엽이 상하고 피부가 뿌옇게 흐려졌습니다.',
    {set:{inj_gill:1},fx:{h:lv>=2?-26:lv>=1?-15:-4,wq:-12,st:.08},run:()=>{S.f.wq-=8;hom_learn('rinse',isKind('techbro')?.5:1)}});
}
fevEnd({'HOM-09-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',pl:[[2,'멈췄던 여과기를 헹구지 않고 켬']],fact:'fWater',
  l:['여과통 안에 고였던 물이 수조로 한꺼번에 밀려 나옵니다. 물에 섞인 황화수소와 암모니아가 {n}의 아가미 새엽에 닿습니다.','새엽 상피세포의 호흡이 막혀 세포가 부풀고 떨어져 나갑니다.',()=>isSp('clownloach','neon','cory')?'{n}은 무리와 함께 수조 끝으로 달아나 유리면을 위아래로 오르내립니다.':'{n}은 수조 끝으로 달아나 유리면을 위아래로 오르내립니다.',()=>isSp('@scaleless')?'비늘이 거의 없는 피부에서 점액이 두껍게 흘러나와 몸이 뿌옇게 흐려집니다.':'피부에서 점액이 두껍게 흘러나와 몸이 뿌옇게 흐려집니다.','{n}은 옆으로 누운 채 아가미 뚜껑만 빠르게 움직입니다.']}});

/* EV-HOM-10 수돗물로 빤 여과재 — [출처: 여과 박테리아(질산화 세균)와 염소·고온 세척에 의한 사멸; 암모니아에 의한 아가미·지느러미 손상 소견] */
fev([{id:'HOM-10',tier:'fact',own:['eager','gift','casual','grandma','shared'],need:{cycled:1,pond:0,l_media:0},cd:50,
  w:()=>isKind('eager')?2:1,
  log:'주인이 여과기 속 스펀지를 꺼내 싱크대에서 뜨거운 수돗물로 빨았습니다.',
  p:'돌아온 스펀지는 새것처럼 하얗고 수돗물 냄새가 납니다. 다음 날부터 물이 깨끗해 보이는데 아가미가 따끔거립니다. {n}은…',
  o:[
   {l:'먹이를 주러 온 주인 앞에서 지느러미를 흔들며 조른다',chk:['c',40],
    ok:{t:'"배고프구나." 주인은 먹이를 한 숟가락 더 넣었습니다.',c:'bad',fx:{wq:-10,c:1},run:()=>q(null,null,()=>fevOut(hom_out10(1)))},
    no:()=>hom_out10(0)},
   {l:'아가미를 크게 움직이며 수면 가까이 천천히 돈다',chk:()=>hom_best(['w',40],['c',40]),
    ok:{t:'"숨을 헐떡인다"를 검색한 주인이 그날 물을 절반 갈았습니다. 다음 날 또 갈았습니다.',c:'good',fx:{wq:20,h:-5},run:()=>hom_learn('media')},
    no:()=>hom_out10(0)},
   {l:'바닥 구석에서 움직이지 않는다',ok:()=>hom_roll('g',25,()=>hom_out10(isSp('@scaleless','neon','altum')?1:0),()=>hom_out10(1))}
  ]}]);
function hom_out10(lv){
  S.f.cycled=0;
  if(isSp('oscar','arowana','koi','@gold','pleco','gar'))lv++;
  if(isSp('@scaleless','neon','altum'))lv++;
  if(isSp('@livebearer')&&R()<.4)return {t:'치어들이 먼저 바닥에 떠오르자 주인이 이상하다는 걸 알았습니다. 물을 크게 갈았습니다.',c:'bad',fx:{h:-8,wq:15},run:()=>hom_learn('media')};
  if(lv>=2)return hom_endure(isSp('@scaleless','neon','altum')?60:50,'HOM-10-D','{n}의 아가미와 지느러미가 붉게 상했습니다. 몇 주 뒤 박테리아가 다시 자리 잡을 때까지 {n}은 버텼습니다.',{fx:{h:-24,st:.15,wq:-10},sick:R()<.4?'finrot':null});
  return hom_lv(lv,'{n}은 따끔거리는 물에서 며칠을 지냈습니다.','{n}의 지느러미 기조를 따라 붉은 줄이 생겼습니다.',null,{fx:{h:lv?-14:-5,wq:-12},sick:lv&&R()<.3?'finrot':null});
}
fevEnd({'HOM-10-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',pl:[[2,'여과재를 수돗물로 빪']],fact:'fCycle',
  l:['여과 박테리아가 사라진 물에 암모니아가 하루하루 쌓입니다. 암모니아가 {n}의 아가미와 피부 상피를 상하게 합니다.','지느러미 기조를 따라 실핏줄이 터져 붉은 줄이 생깁니다.',()=>isSp('oranda')?'육혹 아래 아가미 새엽이 부어 서로 붙습니다.':'아가미 새엽이 부어 서로 붙습니다.','{n}은 수면에서 입을 벌리며 느리게 헤엄칩니다. 혈중 암모니아가 높아지자 몸이 기울고 한쪽으로 원을 그리며 돕니다.','주인은 물이 탁해졌다며 스펀지를 다시 수돗물에 빱니다.']}});

/* EV-HOM-11 밤마다 끄는 여과기 — [출처: 여과기 정지 시 질산화 세균 활성 저하; 과밀 수조 야간 저산소] */
fev([{id:'HOM-11',tier:'fact',own:['casual','gift','eager','breakup','shared','decor'],need:{pond:0,l_filter24:0},cd:15,
  when:()=>fl('filter')!=='none',
  log:()=>S.f.place==='office'?'퇴근하던 직원이 수조 멀티탭 스위치를 내렸습니다.':'"소리 때문에 잠을 못 자겠어." 주인이 여과기 플러그를 뽑았습니다.',
  p:'밤 열두 시쯤 여과기가 꺼집니다. 물이 멈추고 방이 조용해집니다. 새벽이 가까워지면 물이 답답하고 바닥 쪽에서 냄새가 올라옵니다. 아침이 되면 다시 물이 돌기 시작합니다. {n}은…',
  o:[
   {l:'새벽마다 수면 가까이 올라가 기다린다',chk:['g',40],ok:()=>hom_out11(0),no:()=>hom_out11(1)},
   {l:'여과기가 다시 돌 때 출수구 쪽으로 가서 물살을 맞는다',ok:()=>hom_out11(R()<clamp(Math.pow(fst().g/40,2),.05,.95)?0:1,'아침마다 출수구에서 밤새 고인 물이 먼저 나왔습니다. ')},
   {l:'밤새 바닥에 가만히 있는다',chk:['g',25],ok:()=>hom_out11(1),no:()=>hom_out11(2)}
  ]}]);
function hom_out11(lv,pre){
  addFl('night_off');const n=fl('night_off');
  if(n>=3&&S.f.cycled){S.f.cycled=0;addLog(T('밤마다 멈추는 여과기 안에서 여과 박테리아가 줄었습니다. 물이 점점 탁해졌습니다.'),'bad')}
  if(isSp('betta','wildbetta')&&lv<=1)return {t:(pre||'')+'물살이 멈춘 밤, {n}은 오히려 편해 보였습니다. 주인은 "얘는 이게 좋대"라고 확신했습니다.',fx:{wq:-4},set:{cult_tilt:1}};
  if(isSp('@gold','koi','oscar')){lv++;if(n>=3&&lv>=2&&R()<.5)return {end:'HOM-11-D'}}
  if(isSp('neon')&&R()<.4)return {t:(pre||'')+'아침에 주인은 수면에 모여 입을 벌리는 {n}의 무리를 보았습니다. "밤에 산소가 부족한가?"',c:'bad',fx:{h:-8},run:()=>hom_learn('filter24',1.3)};
  return hom_lv(lv,(pre||'')+'{n}은 아침까지 버텼습니다.',(pre||'')+'새벽마다 숨이 가빴습니다. {n}의 아가미 새엽 끝이 하얗게 상했습니다.',null,{fx:{h:lv?-14:-4,wq:-5},set:lv?{inj_gill:1}:{},run:()=>hom_learn('filter24',isKind('breakup')?0:.6)});
}
fevEnd({'HOM-11-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-float',pl:[[2,'밤마다 여과기를 끔']],fact:'fO2',
  l:[()=>isSp('@gold')?'여과기가 꺼진 지 다섯 시간, 물속 산소는 일곱 마리가 나눠 쓰기에 모자랍니다. {n}은 수면에서 입을 벌리며 다른 금붕어들과 자리를 다툽니다.':'여과기가 꺼진 지 다섯 시간, 물속 산소가 모자랍니다. {n}은 수면에서 입을 벌리며 자리를 찾습니다.','밀려난 {n}은 수면 바로 아래에서 아가미 뚜껑을 빠르게 움직입니다. 아가미 새엽 끝이 산소 부족으로 상해 하얗게 변합니다.','지칠수록 {n}은 더 자주 수면으로 올라갑니다.','아침 일곱 시, 알람이 울리고 여과기가 켜집니다. {n}은 그 물살에 밀려 수조 구석으로 떠갑니다.']}});

/* EV-HOM-12 거센 물살 — [출처: 장지느러미 베타·팬시 금붕어 사육 시 약한 수류 권장 근거] */
fev([{id:'HOM-12',tier:'fact',need:{strong_flow:1,pond:0},cd:30,
  w:()=>isSp('@longfin')?2:isSp('wildbetta','altum','apisto')?1.3:.6,
  p:'출수구에서 나온 물이 수조를 한 바퀴 돌며 밀어붙입니다. 가만히 있으면 몸이 유리 쪽으로 떠밀립니다. 먹이는 물살을 타고 순식간에 반대편으로 날아갑니다. {n}은…',
  o:[
   {l:'물살을 거슬러 헤엄쳐 날아가는 먹이를 쫓는다',chk:()=>isSp('comet','koi','clownloach','gar')?null:['p',isSp('betta')?55:50],
    ok:()=>isSp('comet','koi','clownloach','gar')?hom_swim12():{t:'{n}은 물살을 거슬러 먹이를 따라잡았습니다.',fx:{p:2}},no:()=>hom_flow12()},
   {l:'큰 수초 잎 뒤 물살이 약한 자리를 찾아 들어간다',chk:()=>isSp('comet','koi','clownloach','gar')?null:['w',35],
    ok:()=>isSp('comet','koi','clownloach','gar')?hom_swim12():{t:'{n}은 수초 잎 뒤에서 물살을 피했습니다. 떠내려오는 먹이를 거기서 받아먹었습니다.',fx:{w:2}},no:()=>hom_flow12()},
   {l:'물살이 닿지 않는 바닥 모서리에 가라앉는다',ok:()=>isSp('comet','koi','clownloach','gar')?hom_swim12():{t:'{n}은 바닥 모서리에서 물살을 피했습니다. 먹이는 거의 먹지 못했습니다.',fx:{h:-4},set:R()<.4?{thin:1}:{}}}
  ]}]);
const hom_swim12=()=>({t:'{n}은 거센 물살 속을 신나게 헤엄쳤습니다.',c:'good',fx:{p:2}});
function hom_flow12(){
  if(isSp('betta')){addFl('flowhit');if(fl('flowhit')>=2||R()<.3)return {end:'HOM-12-D'};
    return {t:'{n}의 지느러미가 물살을 받아 유리에 쓸렸습니다. 지느러미 막 가장자리가 갈라졌습니다.',c:'bad',fx:{fin:.3,h:-8,st:.08},sick:R()<.4?'finrot':null,run:()=>hom_learn('flow',isKind('eager','techbro')?.4:1)}}
  if(isSp('oranda','ryukin'))return {t:'짧고 둥근 몸이 물살에 뒤집혔다 돌아오기를 되풀이했습니다.',c:'bad',fx:{h:-10,st:.1},sick:R()<.35?'swimb':null,run:()=>hom_learn('flow',isKind('eager','techbro')?.4:1)};
  if(isSp('guppy'))return {t:'{n}의 꼬리가 물살에 접혀 유리에 쓸렸습니다.',c:'bad',fx:{fin:.2,h:-5},run:()=>hom_learn('flow')};
  if(isSp('altum'))return {t:'키 큰 몸이 물살을 받아 계속 떠밀렸습니다. {n}은 먹이를 받아먹지 않았습니다.',c:'bad',fx:{h:-10,st:.12},set:{thin:1},run:()=>hom_learn('flow')};
  return {t:'{n}은 물살에 떠밀려 유리에 몸을 부딪쳤습니다.',c:'bad',fx:{h:-6,st:.06},run:()=>hom_learn('flow')};
}
fevEnd({'HOM-12-D':{kind:'bad',cat:'지느러미 썩음',tier:'fact',fx:'f-bottom',pl:[[2,'긴 지느러미 물고기에게 센 물살']],
  l:['{n}의 지느러미가 물살을 받아 몸이 계속 유리 쪽으로 밀립니다. 수면으로 숨을 쉬러 올라갈 때마다 꼬리를 세게 저어야 합니다.','지느러미 막 가장자리가 물살과 유리에 쓸려 갈라집니다. 갈라진 가장자리의 조직이 죽어 검게 변하고, 세균이 기조를 따라 안쪽으로 번집니다.','{n}은 찢어진 지느러미로 계속 수면을 향해 올라갑니다. 지느러미 막이 녹아 기조만 남은 꼬리가 물살에 흔들립니다.','결국 {n}은 수면에 닿기 전에 바닥 모서리로 떠밀려 내려갑니다.']}});

/* ================= D. 바닥재와 장식 ================= */

/* EV-HOM-13 날카로운 자갈 (§3-17 심화) — [출처: 코리도라스 날카로운 바닥재와 수염 손상; 금붕어 입에 자갈이 끼는 사고 사례] */
fev([{id:'HOM-13',tier:'fact',sp:['cory','clownloach','bichir','motoro','oranda','ryukin','comet'],need:{gravel_sharp:1,pond:0},cd:30,
  p:'바닥에는 모서리가 각진 색 자갈이 깔려 있습니다. 자갈 틈 사이로 가라앉은 먹이 냄새가 올라옵니다. 몸을 바닥에 대면 자갈 모서리가 피부를 긁습니다. {n}은…',
  o:[
   {l:'자갈 사이에 입을 깊이 넣어 먹이를 뒤진다',ok:()=>hom_dig13()},
   {l:'자갈 표면에 얹힌 먹이만 골라 먹는다',chk:['w',40],ok:{t:'{n}은 자갈 위의 먹이만 골라 먹었습니다.',fx:{w:2}},no:()=>hom_dig13()},
   {l:'바닥에서 떨어져 떠 있는 채로 먹이가 내려오길 기다린다',ok:()=>isSp('motoro')?{t:'쉬는 동안 {n}의 원반 아랫면이 자갈에 쓸렸습니다.',c:'bad',fx:{h:-8},set:{inj_skin:1}}:{t:'{n}은 바닥 먹이를 거의 먹지 못했습니다.',fx:{h:-3},set:R()<.35?{thin:1}:{}}}
  ]}]);
function hom_dig13(){
  if(isSp('cory')){addFl('barbel');return fl('barbel')>=3?{t:'{n}의 수염이 닳아 없어졌습니다. 바닥에서 먹이를 찾는 일이 점점 어려워졌습니다.',c:'bad',fx:{h:-12},set:{thin:1},run:()=>hom_learn('gravel')}
    :{t:'{n}은 먹이를 많이 찾았습니다. 수염 끝이 자갈에 닳아 붉어졌습니다.',c:'bad',fx:{h:-5}}}
  if(isSp('clownloach'))return {t:'{n}의 수염과 눈 밑 가시 둘레 피부가 자갈에 긁혔습니다.',c:'bad',fx:{h:-8},sick:R()<.35?'ich':null,run:()=>hom_learn('gravel')};
  if(isSp('motoro'))return {t:'{n}의 원반 아랫면이 자갈에 쓸려 붉어졌습니다.',c:'bad',fx:{h:-10},set:{inj_skin:1},sick:fl('inj_skin')&&R()<.3?'columnaris':null,run:()=>hom_learn('gravel')};
  if(isSp('bichir'))return {t:'두꺼운 배 비늘 덕에 {n}은 자갈 사이를 뒤지고도 멀쩡했습니다.',fx:{g:1}};
  /* goldfish take gravel in the mouth and spit it out */
  if(R()>.4)return {t:'{n}은 자갈을 머금었다 뱉으며 먹이를 찾았습니다.',fx:{g:1}};
  if(isSp('comet')&&R()<clamp(Math.pow(fst().p/40,2),.05,.95))return {t:'입에 걸린 자갈을 {n}이 머리를 세게 흔들어 뱉어 냈습니다.',c:'good',fx:{p:1,h:-4}};
  if(isKind('expert','staff','learner')&&R()<.6)return {t:'입을 벌린 채 다니는 {n}을 본 주인이 핀셋으로 자갈을 빼냈습니다.',c:'good',fx:{h:-8},run:()=>hom_learn('gravel',1.5)};
  return {end:'HOM-13-D'};
}
fevEnd({'HOM-13-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-thin',pl:[[2,'금붕어 입 크기의 자갈']],
  l:['{n}은 자갈을 머금었다 뱉기를 되풀이하며 먹이를 찾습니다. 입 크기와 거의 같은 자갈 하나가 입안 깊숙이 들어가 인두 앞에 걸립니다.','{n}은 입을 크게 벌리고 머리를 흔듭니다. 자갈 모서리가 입천장 점막을 긁어 피가 배어 나옵니다.','입을 닫지 못해 먹이를 삼킬 수 없습니다. {n}은 먹이가 떨어질 때마다 다가가 입을 벌린 채 머뭅니다.','열흘 뒤 {n}의 배는 안쪽으로 꺼져 있고, 자갈은 여전히 입안에 있습니다.']}});

/* EV-HOM-14 한 번도 뒤집지 않은 모래
   [출처: 수조 모래층 혐기성 구역의 황화수소 생성 — 생성 자체는 확인 필요, "모래를 헤집어 방출된 황화수소로 어류가 죽은 실증 사례"는 별도 확인 필요.
    실증이 없으면 배드엔딩 삭제하고 inj_gill·nh3 결과만 유지. 황화수소의 시토크롬 c 산화효소 억제 기전] — ⚠ ending tier 'likely' until sourced */
fev([{id:'HOM-14',tier:'likely',sp:['motoro','cory','clownloach','apisto','oscar'],need:{sand_deep:1,pond:0},cd:30,
  w:()=>isKind('cult','neglect','casual','decor')?1.3:.6,
  p:'모래 아래쪽이 검게 변했습니다. 모래를 조금만 헤집어도 작은 거품이 올라오고 썩은 달걀 냄새가 퍼집니다. 그 아래에는 오래 가라앉은 먹이 찌꺼기가 있습니다. {n}은…',
  o:[
   {l:'검은 층까지 깊이 파고든다',chk:['w',45],ok:{t:'냄새를 맡은 {n}은 검은 층 앞에서 파기를 멈췄습니다.',fx:{w:2}},no:()=>hom_dig14()},
   {l:'모래 표면만 입으로 훑는다',ok:{t:'{n}은 모래 표면의 먹이만 훑어 먹었습니다.'}},
   {l:'유목 위나 수초 위에서 쉰다',ok:()=>isSp('motoro')?Object.assign({t:'{n}은 유목 위에서 쉬다가, 밤이 되자 다시 모래 속으로 몸을 묻었습니다.'},R()<.5?hom_dig14():{}):{t:'{n}은 유목 위에서 쉬었습니다.'}}
  ]}]);
function hom_dig14(){
  if(isSp('motoro'))return R()<.35?{end:'HOM-14-D'}:{t:'{n}이 몸을 묻은 자리에서 검은 물이 풀려 나왔습니다. 원반 아랫면과 아가미구멍이 따갑게 부었습니다.',c:'bad',fx:{h:-15,wq:-8,st:.1},set:{inj_gill:1},run:()=>hom_learn('sand',isKind('cult')?0:1)};
  if(isSp('oscar'))return {t:'{n}이 큰 구덩이를 파자 검은 찌꺼기가 수조 전체로 풀렸습니다. 다른 물고기들도 아가미를 크게 움직였습니다.',c:'bad',fx:{h:-6,wq:-15},run:()=>hom_learn('sand',isKind('cult')?0:1)};
  if(isSp('cory','clownloach'))return {t:'{n}의 수염 끝이 검은 층에 닿아 붉게 짓물렀습니다.',c:'bad',fx:{h:-10,wq:-8},set:{inj_barbel:1},sick:R()<.3?'columnaris':null,run:()=>hom_learn('sand',isKind('cult')?0:1)};
  return {t:'{n}의 아가미에 검은 층의 물이 닿았습니다. 찌꺼기가 물에 풀렸습니다.',c:'bad',fx:{h:-8,wq:-10},set:{inj_gill:1},run:()=>hom_learn('sand',isKind('cult')?0:1)};
}
fevEnd({'HOM-14-D':{kind:'bad',cat:'수질 쇼크',tier:'likely',fx:'f-bottom',pl:[[2,'모래 바닥을 한 번도 청소하지 않음']],
  l:['{n}은 원반 가장자리를 물결치듯 흔들어 모래 속으로 몸을 묻습니다. 검은 층에 갇혀 있던 기체와 고인 물이 원반 아래에서 풀려납니다.','황화수소가 아가미구멍이 있는 원반 아랫면으로 곧장 들어갑니다. 아가미 세포의 세포 호흡 효소가 막혀 산소가 있어도 쓰지 못합니다.','{n}은 모래 밖으로 나와 유리벽을 타고 오르려 합니다. 원반 가장자리가 경련하듯 말려 올라갑니다.','{n}은 뒤집힌 채 바닥으로 떨어집니다.']}});

/* EV-HOM-15 장식 구멍 — [출처: 플레코·코리도라스 가슴 가시 고정과 장식·그물 걸림 사례] */
fev([{id:'HOM-15',tier:'fact',sp:['pleco','cory','clownloach','bichir','ghost','apisto','neon','guppy'],need:{decor_hole:1,pond:0},cd:30,
  w:()=>isSp('pleco')?1.5+Math.min(1,S.f.len/40):1,
  p:'장식 옆구리에 어두운 구멍이 나 있습니다. 안쪽은 물이 고요하고 어둡습니다. 예전에 드나들던 굴인데 입구가 어깨에 닿습니다. {n}은…',
  o:[
   {l:'몸을 비틀어 구멍 안쪽까지 밀고 들어간다',chk:['w',45],ok:{t:'{n}은 몸이 들어갈 만큼만 들어가 쉬었다가 뒤로 빠져나왔습니다.',fx:{w:2}},no:()=>hom_stuck15()},
   {l:'입구에 머리만 넣고 쉰다',chk:['w',25],ok:()=>hom_habit15({t:'{n}은 입구에 머리만 넣고 쉬었습니다.',fx:{w:1}}),no:()=>hom_habit15({t:'{n}의 머리 쪽 피부가 입구에 긁혔습니다.',c:'bad',fx:{h:-5},set:{inj_skin:1}})},
   {l:'장식 바깥 유목 그늘에서 쉰다',ok:()=>hom_habit15({t:'{n}은 유목 그늘에서 쉬었습니다.'})}
  ]}]);
/* a pleco grown bigger than the cave still goes in from habit */
const hom_habit15=o=>isSp('pleco')&&S.f.len>=25&&R()<.25?hom_stuck15():o;
function hom_stuck15(){
  if(isSp('pleco')){const p=hom_kp({expert:.75,staff:.75,learner:.6,techbro:.6,grandma:.4,content:.5,neglect:.05,cult:.05},.3);
    return R()<p?{t:'{n}이 굴 안에 끼어 꼬리만 내놓고 있었습니다. 사흘째 되던 날 주인이 장식을 깨서 {n}을 꺼냈습니다. 갑옷판 사이 피부가 벗겨져 있었습니다.'+(isKind('content')?' 주인은 장식을 깨기 전에 영상부터 찍었습니다.':''),c:'bad',fx:{h:-20,fin:.15,st:.15},set:{scar:1},run:()=>hom_learn('hole',1.4)}:{end:'HOM-15-D'}}
  if(isSp('neon','guppy')){const ch=clamp(Math.pow(fst().w/25,2),.05,.95);
    return R()<ch?{t:'장식 안쪽 공간에 들어갔던 {n}이 한참을 헤매다 들어간 구멍으로 되돌아 나왔습니다.',fx:{w:2,st:.05}}:{end:'HOM-15-D'}}
  const need=isSp('ghost')?45:60,ch=clamp(Math.pow(fst().g/need,2),.05,.95)+(isSp('cory','clownloach')?.15:0);
  return R()<ch?{t:isSp('clownloach')?'{n}의 눈 밑 가시가 입구에 걸렸습니다. 굴 앞에 모인 무리를 이상하게 여긴 주인이 장식을 흔들어 {n}을 빼냈습니다.':'{n}이 굴에 끼었다가 한참 만에 뒤로 빠져나왔습니다. 몸통 피부가 벗겨졌습니다.',c:'bad',fx:{h:-15,st:.1},set:{scar:1},run:()=>hom_learn('hole')}:{end:'HOM-15-D'};
}
fevEnd({'HOM-15-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-bottom',pl:[[2,'몸보다 작은 장식 구멍']],
  l:()=>isSp('pleco')?['{n}은 몸을 비틀어 굴 안으로 들어갑니다. 몸이 반쯤 들어간 자리에서 가슴지느러미 가시가 양옆으로 서서 굴 벽에 걸립니다.','{n}은 앞으로도 뒤로도 움직이지 못합니다. 꼬리를 세게 저을수록 갑옷판 사이 얇은 피부가 굴 입구에 쓸려 벗겨집니다.','굴 안쪽 고인 물에서 아가미 뚜껑이 벽에 눌려 다 열리지 않습니다.','사흘 동안 {n}의 꼬리는 굴 밖에서 간격을 두고 움직입니다. 주인은 {n}이 "굴을 좋아한다"고 생각합니다.']
   :['{n}은 장식 안쪽으로 몸을 밀어 넣습니다. 좁아지는 자리에서 몸통이 벽에 걸립니다.','{n}은 앞뒤로 몸을 비틉니다. 비틀 때마다 옆구리 피부와 점액이 장식 안쪽 모서리에 쓸려 벗겨집니다.','장식 안의 고인 물에서 아가미 뚜껑이 벽에 눌려 다 열리지 않습니다.','며칠 뒤 주인은 수조에서 {n}이 보이지 않는다는 걸 알아챕니다. 장식 안쪽은 들여다보이지 않습니다.']}});

/* EV-HOM-16 날카로운 장식과 조화 — [출처: 베타 플라스틱 조화 지느러미 손상("스타킹 테스트" 권장); 팬시 금붕어(육혹·출목) 눈 외상과 팝아이] */
fev([{id:'HOM-16',tier:'fact',need:{decor_sharp:1,pond:0},cd:30,
  w:()=>isSp('@longfin','altum')?2:.6,
  p:'수조 안에 단단한 플라스틱 잎이 빽빽하게 서 있습니다. 잎 가장자리와 장식의 성 탑 끝이 날카롭습니다. 물이 조용한 자리는 그 잎 사이뿐입니다. {n}은…',
  o:[
   {l:'플라스틱 잎 사이로 들어가 쉰다',chk:()=>isSp('oranda','ryukin')?null:['w',35],ok:()=>isSp('oranda','ryukin')?hom_scr16():{t:'{n}은 잎 가장자리를 피해 잎 사이에서 쉬었습니다.',fx:{w:2}},no:()=>hom_scr16()},
   {l:'성 장식 둘레를 천천히 돌며 탐색한다',chk:()=>capOf('w')<45?null:['w',45],ok:()=>capOf('w')<45?hom_scr16():{t:'{n}은 성 탑 둘레를 다 둘러보았습니다.',fx:{w:2}},no:()=>hom_scr16()},
   {l:'장식이 없는 앞쪽 빈 물에서 가만히 떠 있는다',ok:{t:'{n}은 앞쪽 빈 물에서 지냈습니다.'}}
  ]}]);
function hom_scr16(){
  const L=()=>hom_learn('sharp',isKind('decor','grandma')?.3:1);
  if(isSp('betta','guppy'))return {t:'{n}의 지느러미 막이 플라스틱 잎 가장자리에 찢어졌습니다.',c:'bad',fx:{fin:fl('flare')?.4:.25,h:-5},sick:R()<.35?'finrot':null,run:L};
  if(isSp('oranda','ryukin'))return R()<.35?{end:'HOM-16-D'}:{t:'{n}의 눈이 성 탑 끝에 긁혔습니다. 눈이 며칠 동안 부어 있었습니다.',c:'bad',fx:{h:-12,st:.1},set:{inj_eye:1},run:L};
  if(isSp('altum'))return {t:'{n}의 높은 등지느러미 끝이 찢어졌습니다. {n}은 며칠 동안 먹이를 받아먹지 않았습니다.',c:'bad',fx:{fin:.2,h:-8,st:.1},run:L};
  return {t:'{n}의 비늘 몇 장이 장식에 긁혀 떨어졌습니다.',c:'bad',fx:{h:-4},run:L};
}
fevEnd({'HOM-16-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-bottom',pl:[[1,'눈 상처를 치료하지 않음']],
  l:[()=>isSp('oranda')?'{n}은 육혹에 가려진 눈으로 장식 쪽을 향해 천천히 헤엄칩니다. 수지 성 탑의 뾰족한 끝이 오른쪽 눈 각막을 긁고 지나갑니다.':'{n}은 장식 쪽을 향해 천천히 헤엄칩니다. 수지 성 탑의 뾰족한 끝이 오른쪽 눈 각막을 긁고 지나갑니다.','각막 상피가 벗겨진 자리로 세균이 들어갑니다. 이틀 뒤 눈 뒤쪽에 액체가 차 안구가 바깥으로 밀려 나옵니다.','부어오른 눈은 다시 장식과 유리에 부딪힙니다. 각막이 하얗게 흐려지고 수정체가 보이지 않게 됩니다.','{n}은 남은 한쪽 눈 쪽으로만 원을 그리며 먹이를 찾습니다. 감염은 눈 뒤 조직을 따라 머리 쪽으로 번집니다.']}});

/* EV-HOM-17 금전운 두꺼비 — no dodge (metal spreads through all the water): 알리기 → 버티기
   [출처: 구리·아연의 어류 아가미 독성과 연수에서의 독성 증가; 구리의 측선 유모세포 손상(연어류 연구); 무척추동물의 구리 민감도; 놋쇠 성분] */
fev([{id:'HOM-17',tier:'fact',need:{metal_decor:1,pond:0},cd:40,
  w:()=>isKind('decor','grandma','release')?2:1,
  p:'수조 바닥 가운데에 금빛 두꺼비가 앉아 있습니다. 입에는 동전이 물려 있고, 바닥 여기저기 동전이 흩어져 있습니다. 몇 주가 지나자 두꺼비 표면에 푸른 녹이 앉고, 물에서 쇠 맛이 납니다. 유리벽의 달팽이가 하나씩 떨어져 바닥에 굴러다닙니다. {n}은…',
  o:[
   {l:'주인이 올 때마다 두꺼비 앞을 가로막듯 맴돈다',chk:['c',55],ok:()=>hom_tell17(),no:()=>hom_metal17()},
   {l:'수면 근처에서 아가미를 크게 움직이며 머문다',chk:['w',45],ok:()=>hom_tell17(),no:()=>hom_metal17()},
   {l:'두꺼비에서 가장 먼 구석에 가만히 있는다',ok:()=>hom_metal17()}
  ]}]);
const hom_tell17=()=>isKind('decor')&&R()<.6?{t:'주인은 {n}이 두꺼비 앞을 맴도는 걸 "복이 들어오는 춤"이라고 했습니다. 두꺼비는 그대로였습니다.',c:'bad',run:()=>q(null,null,()=>fevOut(hom_metal17()))}
  :{t:'주인이 바닥의 죽은 달팽이와 푸른 녹을 보고 검색을 했습니다. 그날 두꺼비와 동전을 건져 내고 물을 갈았습니다.',c:'good',fx:{h:-6,wq:10},run:()=>{setFl('metal_decor',0)}};
function hom_metal17(){
  if(isSp('@puffer'))setFl('no_snails',1);
  const need=isSp('@scaleless','altum','neon')?60:isSp('@gold','koi','pleco')?30:45;
  return hom_endure(need,'HOM-17-D','{n}의 아가미에 점액이 두껍게 앉았습니다. 몇 주 뒤 누군가 두꺼비를 치울 때까지 {n}은 버텼습니다.',{set:{inj_gill:1},run:()=>hom_learn('metal',isKind('decor')?.15:isKind('grandma')?.4:1)});
}
fevEnd({'HOM-17-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[2,'수조에 놋쇠 장식과 동전']],
  l:['물에 녹아 나온 구리가 {n}의 아가미 새엽 상피에 쌓입니다. 상피세포가 부풀고 새엽 사이가 점액으로 메워집니다.','몸 옆을 따라 늘어선 측선의 감각세포도 구리에 상합니다.',()=>isSp('ghost')?'{n}은 어둠 속에서 늘 피하던 유리벽과 유목에 몸을 부딪칩니다. {n}은 몸을 앞뒤로 움직이며 숨던 관을 찾습니다.':'{n}은 늘 피하던 유리벽과 장식에 몸을 부딪칩니다.','아가미 뚜껑의 움직임이 빨라졌다가 불규칙해집니다.','두꺼비는 바닥 가운데 그대로 앉아 있습니다.']}});

/* EV-HOM-18 바닷가 조개껍데기 — no bad ending; soft-water fish go thin into the next illness
   [출처: 탄산칼슘(조개·산호)에 의한 경도·pH 상승; 알텀 엔젤·야생 베타·아피스토그라마의 연수·약산성 요구; 팔자복어의 경수·기수 선호] */
fev([{id:'HOM-18',tier:'fact',need:{shells:1,pond:0},cd:60,
  w:()=>isSp('altum','wildbetta','apisto','neon','ghost','motoro','fig8')?1.5:.6,
  p:'주인이 하얀 조개껍데기를 한 줌 넣습니다. 며칠 뒤 물이 미끈하게 느껴지고 유리에 하얀 물때가 생깁니다. 수초 잎 끝이 하얗게 껍질을 씁니다. {n}은…',
  o:[
   {l:'조개껍데기를 입으로 뒤집어 본다',chk:['w',30],ok:()=>{const o=hom_hard18();o.fx=Object.assign({w:1},o.fx||{});return o},no:()=>hom_hard18()},
   {l:'조개 근처를 피해 수초 사이에 머문다',ok:()=>hom_hard18()},
   {l:'평소처럼 가만히 지낸다',ok:()=>hom_hard18()}
  ]}]);
function hom_hard18(){
  const L=()=>{if(isKind('learner','expert','staff'))hom_learn('shells',1.3)};
  setFl('ph_hard',1);
  if(isSp('altum'))return {t:'{n}은 먹이를 거의 받아먹지 않았습니다. 몸 색이 어두워졌습니다.',c:'bad',fx:{h:-10,st:.15},set:{thin:1},sick:R()<.25?'velvet':null,run:L};
  if(isSp('wildbetta','apisto'))return {t:'{n}의 체색이 둔해지고 번식 행동이 사라졌습니다.',c:'bad',fx:{st:.1,c:-1},set:{thin:R()<.4?1:0},run:L};
  if(isSp('neon'))return {t:'{n}의 무리가 전보다 흩어져 헤엄쳤습니다.',c:'bad',fx:{st:.08},sick:R()<.1?'neond':null,run:L};
  if(isSp('fig8'))return {t:'{n}의 피부색이 처음으로 선명해졌습니다. 주인은 "조개가 풍수에 좋다"고 생각했습니다.',c:'good',fx:{h:4,st:-.05,c:1}};
  if(isSp('guppy','platy','@gold'))return {t:'{n}은 단단해진 물에서 오히려 활발해졌습니다.',c:'good',fx:{g:1}};
  return {t:'물이 조금씩 단단해졌습니다. {n}은 별다른 변화 없이 지냈습니다.',run:L};
}

/* ================= E. 조명, CO2, 공기, 자동 급여 ================= */

/* EV-HOM-19 24시간 조명 — [출처: 블랙 고스트 등 야행성 어류의 은신처·암기 필요; 연속 조명이 어류 스트레스·섭식에 미치는 영향] */
const hom_night=()=>isSp('ghost','cory','clownloach','pleco','bichir','motoro','channa');
fev([{id:'HOM-19',tier:'fact',need:{light24:1,pond:0},cd:25,
  w:()=>hom_night()?2:isSp('altum','apisto')?1.3:.6,
  p:'조명이 꺼지지 않습니다. 몇 번째 밤인지 알 수 없습니다. 유리벽과 수초 잎에 초록 이끼가 두껍게 앉습니다. 숨을 곳은 장식 뒤 손바닥만 한 그늘뿐입니다. {n}은…',
  o:[
   {l:'밝은 물에서 평소처럼 헤엄치며 먹이를 찾는다',chk:['g',50],ok:{t:'{n}은 밝은 물에서도 먹이를 찾아 먹었습니다.',fx:{g:2}},no:()=>hom_light19()},
   {l:'장식 뒤 그늘을 차지하려고 자리를 다툰다',chk:['p',40],ok:{t:'{n}이 장식 뒤 그늘을 차지했습니다. 그늘 안에서 낮과 밤을 나눠 쉬었습니다.',fx:{p:2,st:-.03}},
    no:()=>Object.assign(hom_light19(),{t:'그늘을 두고 다투다 {n}의 옆구리가 긁혔습니다. 그늘은 다른 물고기의 차지였습니다.'})},
   {l:'수초 사이에서 움직임을 줄인다',ok:()=>hom_light19()}
  ]}]);
function hom_light19(){
  const L=()=>hom_learn('light',isKind('techbro')?1.2:isKind('content')?0:isKind('decor','shared')?.3:1);
  addFl('l24');
  if(isSp('ghost'))return fl('l24')>=2||R()<.3?{end:'HOM-19-D'}:{t:'숨을 곳이 없자 {n}은 먹이를 먹지 않았습니다. 배 쪽 선이 안으로 들어갔습니다.',c:'bad',fx:{h:-12,st:.12},set:{thin:1},run:L};
  if(isSp('pleco'))return {t:'밤이 오지 않아 {n}은 바닥 먹이를 놓쳤습니다. 대신 유리벽의 이끼를 갉아 먹었습니다.',fx:{st:.05}};
  if(hom_night())return {t:'{n}은 밤에 하던 먹이 찾기를 하지 못했습니다. 몸이 조금 홀쭉해졌습니다.',c:'bad',fx:{h:-8,st:.1},set:{thin:1},run:L};
  if(isSp('altum'))return {t:'놀란 {n}이 유리에 몸을 부딪쳤습니다.',c:'bad',fx:{h:-8,st:.12},set:{inj_skin:1},run:L};
  return {t:'{n}은 밝은 물에서 쉬지 못하고 지냈습니다.',fx:{st:.06,wq:-4},run:L};
}
fevEnd({'HOM-19-D':{kind:'bad',cat:'스트레스',tier:'fact',fx:'f-thin',pl:[[2,'조명을 끄지 않음']],
  l:['{n}은 장식 뒤 그늘을 다른 물고기에게 빼앗깁니다. 밝은 물 한가운데에서 {n}은 몸을 앞뒤로 움직이며 숨을 곳을 찾습니다.','먹이가 떨어져도 {n}은 다가가지 않습니다. 몇 주 사이 배 쪽 근육이 줄어 몸 아래쪽 선이 안으로 들어갑니다.','스트레스 호르몬이 오래 이어지며 피부의 면역 반응이 약해집니다. 얇아진 피부 위로 세균이 번식해 붉은 반점이 퍼집니다.','{n}은 조명 바로 아래에서 옆으로 기운 채 떠 있습니다.']}});

/* EV-HOM-20 창가의 오후 — overlaps the engine's sun (w .5)
   [출처: 식물성 플랑크톤 번성 수체의 주야간 용존 산소 변동; 직사광선에 의한 소형 수조 수온 상승] */
fev([{id:'HOM-20',tier:'fact',need:{sun:1,pond:0},cd:30,w:.5,
  p:'오후마다 햇빛이 수조를 정면으로 비춥니다. 물이 점점 연두색으로 흐려져 맞은편 유리가 보이지 않습니다. 낮에는 물이 미지근해지고, 새벽이면 숨이 짧아집니다. {n}은…',
  o:[
   {l:'햇빛이 비치는 따뜻한 쪽에 머문다',chk:['g',45],ok:()=>hom_sun20(season()==='summer'?1:0),no:()=>hom_sun20(season()==='summer'?2:1)},
   {l:'오후에는 그늘진 수조 뒤쪽으로 옮겨 다닌다',chk:['w',35],ok:()=>hom_sun20(0),no:()=>hom_sun20(1)},
   {l:'바닥에 가만히 있는다',ok:()=>hom_roll('g',25,()=>hom_sun20(0),()=>hom_sun20(1))}
  ]}]);
function hom_sun20(lv){
  const L=()=>hom_learn('sun',isKind('grandma')?.3:1);
  if(isSp('@gold','koi'))return lv>=2?{t:'한여름 오후 물이 뜨거워졌습니다. {n}은 수면에서 숨을 몰아쉬었습니다.',c:'bad',fx:{h:-12},run:L}
    :{t:'녹색 물에서 {n}의 색이 진해졌습니다. 주인은 "햇볕을 받아서 색이 좋아졌다"며 만족했습니다.',fx:{g:1,c:1}};
  if(fx_().air)lv=Math.min(lv,1);
  if(isSp('neon','altum','peapuffer')&&season()==='summer')lv++;
  if(lv>=2)return hom_endure(45,'HOM-20-D','새벽마다 숨이 짧아졌지만 {n}은 버텼습니다. 아가미 새엽 끝이 상했습니다.',{set:{inj_gill:1},run:L});
  return hom_lv(lv,'{n}은 연두색 물에서 지냈습니다.','새벽에 물속 산소가 모자랐습니다. {n}은 수면에서 입을 벌리며 아침을 기다렸습니다.',null,{fx:{h:lv?-12:-3,wq:-4},run:L});
}
fevEnd({'HOM-20-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-float',pl:[[2,'창가 직사광선 자리']],fact:'fSun',
  l:['낮 동안 수조의 물은 조류로 가득 찹니다. 해가 지자 조류가 산소를 쓰기 시작합니다.',()=>isSp('neon')?'새벽, 물속 산소가 가장 적어집니다. {n}은 무리와 함께 수면 바로 아래에 모여 입을 벌립니다.':'새벽, 물속 산소가 가장 적어집니다. {n}은 수면 바로 아래에서 입을 벌립니다.','아가미 뚜껑이 빠르게 움직이다 점점 고르지 않게 됩니다.',()=>isSp('neon')?'몸의 푸른 줄무늬가 흐려지고 색이 바랩니다.':'몸의 색이 흐려지고 바랩니다.',()=>isSp('neon')?'해가 다시 비칠 무렵 무리의 절반이 바닥에 가라앉아 있습니다.':'해가 다시 비칠 무렵 {n}은 바닥에 가라앉아 있습니다.']}});

/* EV-HOM-21 밤새 켜진 CO2 — [출처: 수초 수조 CO2 과다에 의한 어류 고탄산혈증; 어류 헤모글로빈의 루트 효과(산성에서 산소 결합 저하); 단단 레귤레이터 엔드 덤프 현상] */
fev([{id:'HOM-21',tier:'fact',notSp:['@big'],need:{co2:1,pond:0},cd:40,
  w:()=>fl('l_co2')?.2:1,
  log:()=>isKind('techbro')?'앱에는 "CO2 OFF"가 떠 있었습니다. 솔레노이드 밸브는 열린 채 굳어 있었습니다.':'CO2 타이머가 멈춰 밸브가 밤새 열려 있었습니다.',
  p:'조명이 꺼졌는데도 확산기에서 작은 기포가 계속 올라옵니다. 물이 시큼해지고 숨이 깊어지지 않습니다. 수초 잎에서 기포가 더 이상 맺히지 않습니다. {n}은…',
  o:[
   {l:'수면으로 올라가 물 표면에 입을 댄다',chk:['g',25],ok:()=>hom_co2(0),no:()=>hom_co2(1)},
   {l:'여과기 출수구가 일으키는 물결 아래로 간다',chk:['w',40],ok:()=>hom_co2(0),no:()=>hom_co2(1)},
   {l:'수초 사이에 가만히 있는다',ok:()=>hom_roll('g',25,()=>hom_co2(1),()=>hom_co2(2))}
  ]}]);
function hom_co2(lv){
  if(isSp('neon','altum','apisto','@scaleless'))lv++;
  if(isSp('betta','wildbetta')&&R()<.5)lv--;
  const L=()=>hom_learn('co2',isKind('expert')?1.1:isKind('content')?.4:1);
  if(isSp('neon','altum','apisto')&&lv>=1&&R()<.35)return {t:'아침에 주인이 수면에 모여 입을 벌리는 물고기들을 보고 CO2 밸브를 잠갔습니다.',c:'bad',fx:{h:-10},run:L};
  if(lv>=2)return R()<.6?{end:'HOM-21-D'}:{t:'아침에 조명이 켜지자 수초가 다시 이산화탄소를 쓰기 시작했습니다. {n}은 수초에 걸린 채 겨우 숨을 이었습니다.',c:'bad',fx:{h:-28,st:.2},set:{inj_gill:1},run:L};
  return hom_lv(lv,'아침이 되자 물이 다시 편해졌습니다.','{n}은 밤새 숨이 깊어지지 않았습니다. 아침에 몸이 무거웠습니다.',null,{run:L});
}
fevEnd({'HOM-21-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-float',pl:[[2,'CO2 타이머를 확인하지 않음']],
  l:['밤새 물에 녹은 이산화탄소가 {n}의 혈액으로 들어옵니다. 혈액이 산성으로 기울자 헤모글로빈이 산소를 붙잡는 힘이 떨어집니다.','아가미로 들어오는 물에 산소가 있어도 피가 그것을 싣지 못합니다.',()=>isSp('altum')?'{n}은 수면에 입을 대고 높은 지느러미를 접었다 폈다 합니다.':'{n}은 수면에 입을 대고 지느러미를 접었다 폈다 합니다.','몸이 균형을 잃고 옆으로 기울어 수초에 걸립니다. {n}은 수초에 걸린 채 아가미 뚜껑을 크게 벌립니다.','아침에 조명이 켜지자 수초 잎에서 다시 기포가 맺히기 시작합니다.']}});

/* EV-HOM-22 기포기 줄을 타고 빠지는 물 — [출처: 기포기 역류(백사이펀)와 역류 방지 밸브 사용 권장] */
fev([{id:'HOM-22',tier:'fact',sp:['@gold','betta','wildbetta','guppy','platy','neon','peapuffer'],need:{aironly:1,check_valve:0,pond:0},cd:50,
  w:()=>isKind('casual','gift','cult','shared','grandma')?1.4:.8,
  p:'기포가 멈춥니다. 잠시 뒤 기포기 줄 끝에서 물이 거꾸로 빨려 나가기 시작합니다. 수면이 아주 조금씩 내려갑니다. 수조 아래 바닥에 물이 고이는 소리가 납니다. {n}은…',
  o:[
   {l:'내려가는 수면을 따라 위쪽에 머문다',ok:()=>hom_low22(isSp('@gold')?1:0)},
   {l:'기포석 근처에서 빨려 나가는 물살을 살핀다',chk:['p',30],ok:()=>hom_low22(0),no:()=>Object.assign(hom_low22(0),{fx:{fin:.15,h:-6}})},
   {l:'바닥에 가만히 있는다',ok:()=>hom_low22(0)}
  ]}]);
function hom_low22(lv){
  return {t:'물은 바닥 기포석 높이까지 빠지고 멈췄습니다.',c:'bad',run:()=>q(null,null,()=>{
    S.interest=clamp(S.interest-.1,.02,1);
    if(isSp('betta','wildbetta'))return fevOut({t:'퇴근한 주인이 보니 바닥 1cm 물에서 {n}이 멀쩡히 지느러미를 펴고 있었습니다. 아래층에서는 천장에 물이 샌다는 연락이 왔습니다.',c:'good',fx:{st:.06},run:()=>hom_learn('valve')});
    const home=R()<hom_find()+.1;
    if(home)return fevOut({t:'주인이 여섯 시간 안에 돌아와 물을 다시 채웠습니다. 아래층에서는 천장에 물이 샌다는 연락이 왔습니다.',c:'bad',fx:{h:-10,st:.1},set:{slime_loss:1},run:()=>hom_learn('valve',isKind('cult')?0:1)});
    if(isSp('neon','guppy','platy','peapuffer')&&R()<.7)return fevOut({t:'{n}은 몇 cm 남은 물에서 헤엄치며 버텼습니다. 밤에 돌아온 주인이 물을 다시 채웠습니다. 수온이 크게 흔들렸습니다.',c:'bad',fx:{h:-12,st:.12},run:()=>hom_learn('valve')});
    fevOut(hom_endure(isSp('oranda','ryukin','comet')?45:30,'HOM-22-D','{n}은 반쯤 드러난 몸으로 버텼습니다. 밤에 돌아온 주인이 물을 다시 채웠습니다. 위쪽 몸의 점막이 말라 있었습니다.',{set:{slime_loss:1,inj_gill:1},run:()=>hom_learn('valve')}));
  })};
}
fevEnd({'HOM-22-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-floor',pl:[[2,'기포기에 역류 방지 밸브 없음']],
  l:['수면은 바닥 기포석 높이까지 내려가 멈춥니다. 남은 물은 {n}의 몸높이보다 낮습니다.','{n}은 옆으로 누운 채 꼬리를 저어 몸을 세우려 합니다. 위쪽 아가미 절반이 물 밖으로 드러나 새엽이 마르고 서로 붙습니다.',()=>isSp('oranda')?'공기에 닿은 위쪽 몸통의 점막이 말라 갈라집니다. 육혹 위로 마른 점액이 하얗게 앉습니다.':'공기에 닿은 위쪽 몸통의 점막이 말라 갈라집니다.','{n}은 반쯤 잠긴 아가미로 몇 시간 더 숨을 쉽니다.','수조 아래 바닥에는 수조에서 빠져나온 물이 넓게 고여 있습니다.']}});

/* EV-HOM-23 자동 급여기가 한꺼번에 쏟은 날 — [출처: 자동 급여기 고장 사례; 팬시 금붕어 과식·부레 장애 관계] */
const hom_glut=()=>isSp('@gold','oscar','@puffer','arowana');
fev([{id:'HOM-23',tier:'fact',need:{autofeeder:1,pond:0},cd:50,
  w:()=>fl('l_feeder')?.3:1,
  p:'급여기가 덜컥거리더니 통 속 먹이가 한꺼번에 수면에 쏟아집니다. 수면이 먹이로 덮이고 바닥까지 먹이가 가라앉습니다. 집에는 아무도 없습니다. {n}은…',
  o:[
   {l:'배가 찰 때까지 계속 먹는다',chk:()=>capOf('g')<50||hom_glut()?['g',50]:null,
    ok:()=>hom_glut()?hom_feed23({t:'{n}은 배가 터질 만큼 먹고도 멀쩡했습니다.',fx:{fat:.2}}):hom_feed23({t:'{n}은 배가 찰 때까지 먹었습니다.',fx:{fat:.1}}),
    no:()=>hom_over23()},
   {l:'몇 입만 먹고 수초 사이로 간다',chk:['w',35],ok:()=>hom_feed23({t:'{n}은 몇 입만 먹고 수초 사이로 갔습니다.',fx:{w:1}}),no:()=>hom_glut()?hom_over23():hom_feed23({t:'{n}은 결국 배가 찰 때까지 먹었습니다.',fx:{fat:.1}})},
   {l:'바닥 구석에 가만히 있는다',ok:()=>hom_feed23({t:'{n}은 바닥 구석에서 먹이가 썩어 가는 걸 지켜보았습니다.'})}
  ]}]);
function hom_feed23(o){
  const big=isSp('oscar','arowana')?-8:0,bottom=isSp('cory','pleco','clownloach');
  return Object.assign({},o,{c:o.c||'bad',fx:Object.assign({wq:-20+big+(bottom?10:0)},o.fx||{}),
    run:()=>{if(bottom)addLog(T('바닥에 가라앉은 먹이를 {n}이 쉬지 않고 먹어 치웠습니다. 돌아온 주인은 "청소 물고기 덕분"이라고 했습니다.'),'sub');hom_learn('feeder',isKind('techbro')?.6:1);if(isKind('techbro'))setFl('autofeeder2',1)}});
}
function hom_over23(){
  if(isSp('oranda','ryukin'))return R()<.5?{end:'HOM-23-D'}:hom_feed23({t:'불은 먹이가 {n}의 장을 부풀렸습니다. {n}은 머리를 아래로 한 채 며칠을 떠 있었습니다.',fx:{h:-18,fat:.3},sick:'swimb'});
  if(isSp('@puffer'))return hom_feed23({t:'{n}의 배가 공처럼 부풀었습니다. 며칠 동안 바닥에 엎드려 지냈습니다.',fx:{h:-12,fat:.35}});
  return hom_feed23({t:'{n}은 쉬지 않고 먹었습니다. 배설물이 물을 더 흐렸습니다.',fx:{h:-6,fat:.25,wq:-8}});
}
fevEnd({'HOM-23-D':{kind:'bad',cat:'과식',tier:'fact',fx:'f-float',pl:[[2,'자동 급여기를 점검하지 않음']],
  l:['{n}은 수면에 떠 있는 먹이를 하나도 남기지 않으려는 듯 계속 삼킵니다. 물에 불은 먹이가 장 안에서 부피가 늘어납니다.','부푼 장이 부레를 위에서 누릅니다. {n}은 몸이 앞으로 기울어 머리를 아래로 한 채 떠오르지 못합니다.','바닥에 가라앉은 먹이가 썩으며 물이 뿌옇게 흐려집니다.','이틀째 {n}은 배를 위로 한 채 수면에 떠서 꼬리를 젓습니다. 수면 밖으로 나온 배 쪽 피부가 말라 붉게 갈라집니다.']}});

/* EV-HOM-24 습기에 막힌 급여기 — [출처: 관상어 단기 절식 내성(성어 1–2주); 자동 급여기 습기 뭉침 고장] */
fev([{id:'HOM-24',tier:'fact',need:{autofeeder:1,pond:0},cd:50,
  w:()=>(fl('l_feeder')?.3:1)*(fl('autofeeder2')?1.5:1)*(isKind('techbro','casual','breakup','content')?1.3:.8),
  log:'주인이 열흘 넘게 집을 비웠습니다. 급여기 통 안의 먹이가 습기를 먹고 하얗게 엉겨 붙었습니다.',
  p:'급여기가 매일 같은 시각에 돌아가는 소리가 납니다. 먹이는 떨어지지 않습니다. 일주일째 수조에는 먹을 것이 이끼뿐입니다. {n}은…',
  o:[
   {l:'바닥과 유목을 샅샅이 뒤져 찌꺼기를 찾는다',chk:['w',40],ok:()=>hom_starve24(0),no:()=>hom_starve24(1)},
   {l:'유리벽과 수초 잎의 이끼를 쪼아 먹는다',chk:()=>['g',isSp('@livebearer','@gold','pleco')?30:40],ok:()=>hom_starve24(0),no:()=>hom_starve24(1)},
   {l:'움직임을 줄이고 그늘에 가만히 있는다',ok:()=>hom_roll('g',25,()=>hom_starve24(0),()=>hom_starve24(1))}
  ]}]);
function hom_starve24(lv){
  const back=()=>{if(!S.ending)addLog(T('돌아온 주인은 "굶었겠다"며 먹이를 한꺼번에 많이 넣었습니다.'),'sub');S.f.wq-=8;hom_learn('feeder')};
  if(isSp('pleco'))return {t:'{n}은 유목과 이끼를 갉으며 지냈습니다. 돌아온 주인은 "알아서 사는 물고기"라고 확신했습니다.',fx:{g:1},set:{pleco_self:1}};
  if(isSp('guppy','platy'))return {t:'{n}은 수조 안의 치어를 먹으며 버텼습니다. 치어 수가 줄었습니다.',c:'bad',fx:{g:2},run:back};
  if(isSp('oscar','arowana','channa','gar','koi','bichir'))return {t:'{n}은 굶주림을 버텼습니다.'+(S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id&&FX[m.id]&&FX[m.id].cm<fx_().cm*.4)?' 합사어 몇 마리가 보이지 않았습니다.':''),c:'bad',fx:{h:-6},set:{hunger_pred:1},run:back};
  if(isSp('neon','peapuffer','guppy','platy','apisto')){if(fl('thin')&&lv>=1)return {end:'HOM-24-D'};lv++}
  return hom_lv(lv,'{n}은 이끼를 쪼아 먹으며 버텼습니다. 몸이 조금 홀쭉해졌습니다.','{n}의 배가 안으로 꺼졌습니다.','{n}의 등 근육이 줄어 머리가 커 보였습니다.',{set:{thin:1},fx:{h:lv?-15:-5,g:2},run:back});
}
fevEnd({'HOM-24-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',pl:[[2,'급여기만 믿고 집을 비움']],
  l:['열이틀째 {n}의 몸에는 쓸 지방이 남아 있지 않습니다. 몸은 근육 단백질을 분해해 에너지로 씁니다.','등 쪽 근육이 줄어 머리가 몸에 비해 커 보입니다.','{n}은 급여기가 돌아가는 소리가 날 때마다 수면 아래로 올라와 기다립니다. 먹이는 떨어지지 않습니다.',()=>isSp('peapuffer')?'{n}은 바닥의 빈 달팽이 껍데기를 물었다 놓습니다.':'{n}은 바닥의 모래알을 물었다 뱉습니다.','배 쪽이 안으로 꺼진 채 {n}은 수초 사이에 기대어 움직이지 않습니다.']}});

/* ================= F. 수조와 받침대 ================= */

/* EV-HOM-25 중고 수조의 실리콘 (§3-15 심화) — [출처: 수조 실리콘 수명과 노후 수조 파열 사례; 플레코·폴립테루스 공기 중 생존] */
fev([{id:'HOM-25',tier:'fact',need:{tank_old:1,pond:0},cd:60,
  w:()=>isSp('arowana','oscar','gar','koi','pleco','channa','motoro','bichir')?1.4:.5,
  p:'며칠째 수조 아래 모서리에 물방울이 맺힙니다. 수면이 하루에 손가락 마디 하나만큼씩 낮아집니다. 오늘 새벽, 바닥 유리 쪽에서 낮게 \'끽\' 하는 소리가 들립니다. {n}은…',
  o:[
   {l:'소리가 난 모서리로 가서 살펴본다',ok:()=>hom_burst25(1)},
   {l:'수조 가운데 깊은 곳에 머문다',ok:()=>hom_burst25(0)},
   {l:'늘 쉬던 자리에 가만히 있는다',ok:()=>hom_burst25(0)}
  ]}]);
function hom_burst25(corner){
  const after=()=>{S.interest=clamp(S.interest-.1,.02,1);
    if(isKind('relay'))q(null,null,()=>fRehome('주인은 남은 수조를 "수조째 무료 나눔"으로 올렸습니다. {n}은 그 수조와 함께 다음 사람에게 갔습니다.',{note:'새는 수조째 나눔'}));
    else hom_learn('tank',1.5)};
  if(fx_().cm<20)return {t:'수조 모서리에서 물이 새어 수위가 낮아졌습니다. 주인이 급히 {n}을 다른 통으로 옮겼습니다.',c:'bad',fx:{h:-6,st:.1},run:after};
  const need=isSp('pleco','bichir','channa','gar')?30:isSp('arowana','oscar','koi','motoro')?70:50;
  if(corner&&R()<.3)addLog(T('터진 모서리의 물살이 {n}을 수조 밖으로 끌어냈습니다.'),'bad');
  const r=hom_dry(need,'HOM-25-D','이음새가 터지며 물이 쏟아졌습니다. 주인이 깨어 {n}을 욕조로 옮겼습니다. 비늘 몇 장이 바닥에 남았습니다.',{run:after});
  if(r.end||!isSp('pleco')||R()>.4)return r;
  return {end:'HOM-25-H'};
}
fevEnd({
 'HOM-25-D':{kind:'bad',cat:'수조 파손',tier:'fact',fx:'f-burst',pl:[[3,'오래된 중고 수조']],fact:'fBurst',
   l:['이음새가 터지며 물이 거실 바닥으로 쏟아집니다. 수면이 빠르게 내려가 {n}의 등이 공기 중으로 드러납니다.','{n}은 바닥재 위에서 몸을 크게 휘어 물이 남은 쪽을 찾습니다.','몸무게가 아래쪽 옆구리에 실려 그쪽 아가미 뚜껑이 바닥재에 눌린 채 열리지 않습니다. 위쪽 아가미 새엽은 공기 중에서 마르며 서로 붙습니다.','퍼덕일 때마다 비늘이 바닥재에 걸려 떨어져 나가고 진피가 드러납니다.','아침에 주인이 본 {n}의 비늘 몇 장은 거실 바닥에 말라붙어 있습니다.']},
 'HOM-25-H':{kind:'happy',cat:'냉장고 밑의 갑옷',tier:'story',fx:'f-rest',
   l:['아침에 주인은 물바다가 된 거실에서 냉장고 밑으로 기어 들어간 {n}을 꺼냈습니다.','{n}은 갑옷에 먼지를 붙인 채 살아 있었습니다.','주인은 새 수조를 사면서 "플레코는 원래 물 밖에서도 산다"고 지인들에게 말하고 다녔습니다.']}
});

/* EV-HOM-26 무너진 돌탑 — [출처: 수조 돌 레이아웃 붕괴와 굴 파는 시클리드; 가오리 척추 손상 시 꼬리 마비 소견] */
fev([{id:'HOM-26',tier:'fact',sp:['oscar','clownloach','apisto','bichir','cory','motoro','pleco'],need:{rockwork:1,pond:0},cd:40,
  w:()=>isSp('oscar')?1.6:1,
  p:'큰 돌 세 개가 모래 위에 기대어 쌓여 있습니다. 맨 아래 돌 밑 모래가 조금씩 파여 나갔습니다. 돌 사이 그늘은 수조에서 가장 어둡고 조용한 자리입니다. {n}은…',
  o:[
   {l:'돌 밑 모래를 더 파내 굴을 넓힌다',chk:['w',50],ok:{t:'돌이 기우는 것을 느낀 {n}이 파기를 멈췄습니다.',fx:{w:2}},no:()=>hom_fall26(0)},
   {l:'돌 틈 그늘로 들어가 쉰다',chk:['w',30],ok:{t:'{n}은 돌 틈 그늘에서 쉬었습니다.',fx:{w:1}},no:()=>hom_fall26(1)},
   {l:'돌에서 떨어진 수초 쪽에서 쉰다',ok:{t:'{n}은 수초 쪽에서 쉬었습니다.'}}
  ]}]);
function hom_fall26(under){
  const L=()=>hom_learn('rock',isKind('content')?.3:1);
  if(isSp('oscar')&&!under)return {t:'{n}이 판 구덩이로 돌탑이 무너졌습니다. 떨어진 돌이 바닥 유리를 쳐서 금이 갔습니다.',c:'bad',fx:{st:.1},set:{tank_old:1},run:L};
  if(!under&&R()<.7)return {t:'돌탑이 무너졌습니다. {n}은 돌이 떨어지기 전에 몸을 뺐습니다. 아래 있던 다른 물고기가 깔렸습니다.',c:'bad',fx:{st:.12},run:()=>{const m=S.f.mates.find(m=>m.n>0&&m.id!==S.sp.id);if(m)m.n--;L()}};
  if(isSp('pleco'))return {t:'무너진 돌이 {n}의 등에 떨어졌습니다. 갑옷판이 충격을 받아 냈습니다.',c:'bad',fx:{h:-12},set:{scar:1},run:L};
  if(isSp('bichir')&&R()<clamp(Math.pow(fst().p/40,2),.05,.95))return {t:'{n}은 긴 몸을 비틀어 돌 밑에서 빠져나왔습니다. 꼬리 쪽 비늘이 긁혔습니다.',c:'bad',fx:{h:-10},run:L};
  if(isSp('apisto'))return {t:'{n}의 굴이 무너졌습니다. 그 안의 알도 함께 묻혔습니다.',c:'bad',fx:{h:-8,st:.15},run:L};
  const ch=clamp(Math.pow(fst().g/50,2),.05,.9)*(isSp('motoro')?.6:1);
  return R()<ch?{t:'돌이 {n}의 몸을 스치고 떨어졌습니다. 몸에 깊은 상처가 남았습니다.',c:'bad',fx:{h:-22,st:.15},set:{inj_spine:1,scar:1},run:L}:{end:'HOM-26-D'};
}
fevEnd({'HOM-26-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-bottom',pl:[[3,'모래 위에 돌을 쌓음']],
  l:()=>isSp('motoro')?['{n}은 돌 틈 아래 모래 속에 몸을 묻고 쉽니다. 아래 돌 밑이 파여 나가고, 위의 돌이 미끄러져 {n}의 원반 위로 떨어집니다.','원반 가운데 연골성 척추가 눌려 꺾입니다. {n}은 원반 가장자리를 세게 흔들어 돌 밑에서 빠져나오려 합니다.','움직일 때마다 돌 모서리에 눌린 피부가 찢어지고 그 아래 근육이 드러납니다. 꼬리 쪽 감각과 움직임이 사라져 꼬리가 모래 위에 늘어집니다.','{n}은 원반 앞쪽만으로 모래를 밀며 조금씩 기어 나옵니다. 꼬리는 돌 밑에 그대로 눌려 있습니다.']
   :['{n}이 쉬던 돌 틈 위로 돌이 미끄러져 떨어집니다. 돌의 무게가 {n}의 몸통 가운데를 누릅니다.','척추가 눌려 꺾이고, 그 뒤쪽 몸의 감각과 움직임이 사라집니다.','{n}은 앞쪽 지느러미를 저어 빠져나오려 합니다. 움직일 때마다 돌 모서리에 눌린 피부가 찢어지고 근육이 드러납니다.','{n}의 몸 앞쪽만 돌 밖으로 나와 있습니다. 아가미 뚜껑은 한동안 그대로 움직입니다.']}});

/* EV-HOM-27 받침대가 내려앉은 날 — unavoidable once the stand fails; the choice is only where the fish is
   [출처: 수조 1L ≈ 1kg(물 무게) — 받침대 하중; 파티클보드 흡수 팽창] */
fev([{id:'HOM-27',tier:'fact',own:['casual','gift','eager','breakup','relay','shared'],need:{stand_ok:0,pond:0},cd:80,once:1,
  w:()=>.4*(tankL()>=60?1.6:1),
  p:'수조가 조금씩 한쪽으로 기울었습니다. 수면이 유리 한쪽 위로만 올라와 있습니다. 밤마다 받침대에서 나무가 눌리는 소리가 납니다. {n}은…',
  o:[
   {l:'물이 깊은 쪽으로 몰려간 물살을 따라 그쪽에 머문다',ok:()=>hom_stand27(1)},
   {l:'수면이 낮은 쪽 얕은 물에 머문다',ok:()=>hom_stand27(-1)},
   {l:'바닥 가운데에 가만히 있는다',ok:()=>hom_stand27(0)}
  ]}]);
function hom_stand27(side){
  return {t:'받침대 한쪽 다리가 꺾이고 수조가 바닥으로 넘어졌습니다.',c:'bad',run:()=>q(null,null,()=>{
    const after=()=>{S.interest=clamp(S.interest-.1,.02,1);if(isKind('relay'))q(null,null,()=>fRehome('주인은 "수조 정리합니다" 글을 올렸습니다. {n}은 양동이째 다음 사람에게 갔습니다.',{note:'수조 정리 나눔'}));else hom_learn('stand',1.4)};
    const c=capOf('w')>=35?['w',35]:['g',25],cut=R()>clamp(Math.pow(fst()[c[0]]/c[1],2),.05,.95)*(side<0?1.2:side>0?.7:1);
    if(cut)addLog(T('{n}이 유리 파편 사이로 쏟아졌습니다. 옆구리가 길게 베였습니다.'),'bad');
    if(cut)S.health-=isSp('arowana','oscar','koi')?18:10;
    if(R()<hom_find()){fevOut({t:'집에 있던 주인이 양동이에 물을 받아 {n}을 담았습니다.',c:'bad',fx:{h:-10,st:.15},set:{scar:1,slime_loss:1},run:after});return}
    if(isSp('neon','guppy','platy')&&R()<.4){fevOut({t:'{n}은 바닥의 물웅덩이에서 버텼습니다. 주인은 파편 사이에서 {n}을 한참 만에 찾았습니다.',c:'bad',fx:{h:-15,st:.15},set:{slime_loss:1},run:after});return}
    fevOut(hom_dry(isSp('pleco','bichir','channa','gar')?30:isSp('arowana','oscar','koi','motoro')?70:50,'HOM-27-D','{n}은 물웅덩이에서 버텼습니다. 돌아온 주인이 {n}을 양동이에 담았습니다.',{run:after}));
  })};
}
fevEnd({'HOM-27-D':{kind:'bad',cat:'수조 파손',tier:'fact',fx:'f-burst',pl:[[3,'전용 받침대가 아닌 가구에 수조']],fact:'fBurst',
  l:['받침대 한쪽 다리가 꺾이고 수조가 바닥으로 넘어집니다. 유리가 깨지며 물과 함께 {n}이 파편 위로 쏟아집니다.','유리 조각이 옆구리를 지나며 비늘과 근육을 길게 가릅니다. {n}은 물이 남은 쪽으로 몸을 휘어 뛰어오릅니다.','다시 떨어질 때 같은 상처가 다른 파편에 닿아 더 깊이 벌어집니다. 몸 옆을 따라 이어진 측선이 상처 자리에서 끊깁니다.','{n}은 물웅덩이 가장자리에서 아가미를 들썩이며 의자 다리 옆으로 몸을 뒤집습니다.','아래층에서 천장에 물이 샌다며 초인종을 누릅니다.']}});

/* ================= G. 청소와 물 갈기 ================= */

/* EV-HOM-28 사이펀 (§3-14 심화) — overlaps the engine's siphon (w .5)
   [출처: 사이펀 청소 중 소형어 흡입 사고와 망 사용 권장] */
fev([{id:'HOM-28',tier:'fact',sp:['@small','betta','wildbetta'],own:['eager','gift','casual','learner','grandma','shared'],need:{pond:0,l_siphon:0},cd:30,w:.5,
  p:'주인이 긴 관을 바닥 모래에 꽂습니다. 관 입구 둘레로 모래와 찌꺼기가 회오리치며 빨려 올라갑니다. 흩어진 먹이 부스러기가 관 입구 근처에 떠다닙니다. {n}은…',
  o:[
   {l:'관 입구 근처에 떠오른 먹이 부스러기를 쫓는다',chk:['p',30],ok:{t:'{n}은 관 입구의 물살을 버티며 부스러기를 먹었습니다.',fx:{p:2}},no:()=>hom_sucked28()},
   {l:'주인의 손과 관이 움직이는 반대편으로 헤엄친다',chk:['w',30],ok:()=>isSp('apisto')&&R()<.5?{t:'{n}은 반대편으로 갔다가 굴이 걱정되어 다시 돌아왔습니다. 관은 그사이 다른 자리로 옮겨 갔습니다.'}:{t:'{n}은 관이 닿지 않는 쪽으로 피했습니다.',fx:{w:1}},no:()=>R()<.3?hom_sucked28():{t:'{n}은 우왕좌왕하다 관 옆을 겨우 지나쳤습니다.',fx:{st:.05}}},
   {l:'바닥 수초 밑으로 들어가 숨는다',ok:()=>R()<.3?(R()<clamp(Math.pow(fst().g/25,2),.05,.95)?{t:'관이 수초 밑까지 훑고 지나갔습니다. {n}은 수초 뿌리를 붙잡고 버텼습니다.',fx:{g:1}}:hom_sucked28()):{t:'{n}은 수초 밑에서 청소가 끝나기를 기다렸습니다.'}}
  ]}]);
function hom_sucked28(){
  if(isSp('cory'))return {t:'{n}이 관 입구로 빨려 들어가다 가슴 가시가 입구에 걸렸습니다. 주인이 관을 들어 올리자 {n}이 빠져나왔습니다.',c:'bad',fx:{h:-10,fin:.15},run:()=>hom_learn('siphon')};
  if(isKind('expert','learner','staff')&&R()<.75)return {t:'{n}은 관을 지나 양동이에 떨어졌습니다. 물을 버리려던 주인이 바닥에서 반짝이는 꼬리를 봤습니다. 뜰채가 없어 국자로 {n}을 떴습니다. 그날 이후 그 국자는 물고기 전용이 되었고, 주인은 국을 다른 국자로 떴습니다.',c:'bad',fx:{h:-10,st:.1},set:{slime_loss:1},run:()=>hom_learn('siphon',isKind('shared')?.3:1.3)};
  return {end:'HOM-28-D'};
}
fevEnd({'HOM-28-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-toilet',pl:[[3,'사이펀 물을 확인하지 않고 버림']],fact:'fFlush',
  l:['{n}은 관 입구로 빨려 들어갑니다. 관 안쪽에서 모래알과 함께 구르며 옆구리 비늘이 벗겨집니다.',()=>isSp('@schooling')?'{n}은 찌꺼기로 탁한 양동이 바닥에 떨어집니다. 어두운 물속에서 {n}은 무리를 찾아 양동이 벽을 따라 돕니다.':'{n}은 찌꺼기로 탁한 양동이 바닥에 떨어집니다. 어두운 물속에서 {n}은 양동이 벽을 따라 돕니다.','양동이가 기울고 물이 화장실 변기로 쏟아집니다.','{n}은 물살에 밀려 하얀 도기 벽을 따라 미끄러져 내려갑니다. 물 내리는 소리가 납니다.']}});

/* EV-HOM-29 세제 냄새가 남은 양동이 — no dodge: 알리기 → 버티기
   [출처: 음이온 계면활성제(LAS 등)의 어류 아가미 독성; 어류 점액층 손상] */
fev([{id:'HOM-29',tier:'fact',own:['eager','gift','grandma','shared','staff','casual'],need:{pond:0,l_bucket:0},cd:50,
  w:()=>isKind('eager')?2:isKind('staff')?.3:1,
  log:'주인이 수조 유리와 양동이를 주방 세제로 뽀득하게 닦았습니다.',
  p:'새 물에서 미끈하고 쓴 냄새가 납니다. 수면에 작은 거품이 오래 남아 꺼지지 않습니다. 아가미가 따갑고 피부가 화끈거립니다. {n}은…',
  o:[
   {l:'주인이 다가올 때마다 앞으로 나와 유리에 몸을 붙인다',chk:['c',55],ok:()=>hom_told29(),no:()=>hom_soap29()},
   {l:'수면 거품 아래를 빠르게 빙빙 돈다',chk:['w',40],ok:()=>hom_told29(),no:()=>hom_soap29()},
   {l:'구석에 가만히 있는다',ok:()=>hom_soap29()}
  ]}]);
const hom_told29=()=>({t:'주인이 꺼지지 않는 거품을 보고 세제를 떠올렸습니다. 그날 물을 몇 번에 걸쳐 크게 갈았습니다.',c:'good',fx:{h:-8,wq:10},set:{slime_loss:1},run:()=>hom_learn('bucket',isKind('eager')?.7:isKind('shared')?.3:1.3)});
function hom_soap29(){
  if(isSp('betta','channa','bichir')&&R()<.3)return Object.assign(hom_told29(),{t:'{n}은 수면 공기로 숨을 이으며 버텼습니다. 다음 날 주인이 거품을 보고 물을 크게 갈았습니다.',c:'bad',fx:{h:-15,wq:10}});
  const need=45+(isSp('@scaleless')?20:0)+(isSp('neon','altum','peapuffer')?15:0);
  return hom_endure(need,'HOM-29-D','{n}의 피부가 하얗게 흐려지고 아가미가 상했습니다. 며칠 뒤 물이 몇 번 갈리고서야 따가움이 가셨습니다.',{set:{inj_gill:1,slime_loss:1},run:()=>hom_learn('bucket',isKind('shared')?.3:1)});
}
fevEnd({'HOM-29-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[2,'세제로 닦은 양동이']],
  l:['세제의 계면활성제가 {n}의 아가미 새엽 표면에 닿습니다. 상피세포막의 기름 성분이 녹아 세포가 터지고 떨어져 나갑니다.','새엽 사이로 점액이 쏟아져 물과 닿는 면을 덮습니다.',()=>isSp('cory')?'{n}은 바닥에서 수면까지 쉬지 않고 오르내리며 공기를 삼킵니다. 장으로 산소를 들여도 아가미에서 새는 염분과 이온은 막지 못합니다.':fx_().air?'{n}은 수면으로 올라가 공기를 삼킵니다. 공기로 산소를 들여도 아가미에서 새는 염분과 이온은 막지 못합니다.':'{n}은 수면으로 올라가 입을 벌립니다. 아가미에서 염분과 이온이 빠져나갑니다.','피부 점액이 벗겨져 몸이 하얗게 흐려집니다.',()=>isSp('cory')?'{n}은 바닥에 배를 대고 가슴지느러미 가시를 세운 채 아가미 뚜껑만 빠르게 움직입니다.':'{n}은 바닥에 배를 대고 아가미 뚜껑만 빠르게 움직입니다.']}});

/* EV-HOM-30 방 안의 스프레이 — no dodge: 알리기 → 버티기; mosquito spray is beyond what a small fish can endure
   [출처: 피레스로이드계 살충제의 어류 급성 독성(LC50 μg/L 수준, 농약 독성 자료)과 나트륨 통로 기전; 유리 세정제 성분(암모니아·알코올); 수생 무척추동물의 높은 민감도] */
fev([{id:'HOM-30',tier:'fact',need:{lid:0,pond:0,l_spray:0},cd:50,
  w:()=>season()==='summer'&&isKind('casual','gift','grandma','shared')?1.8:1,
  log:()=>season()==='summer'?'주인이 모기를 잡으려고 방 안에 살충제를 뿌렸습니다.':isKind('decor')?'가게 직원이 수조 옆에서 방향제를 뿌렸습니다.':'주인이 수조 유리 바깥에 세정제를 뿌리고 닦았습니다.',
  p:'방 안에 뿌연 안개가 퍼집니다. 수면에 아주 얇은 막이 앉고 빛이 무지개색으로 번집니다. 잠시 뒤 수초 위의 새우들이 다리를 떨며 떨어집니다. 몸 옆을 따라 찌릿한 감각이 번집니다. {n}은…',
  o:[
   {l:'주인이 다가올 때마다 앞으로 나와 유리에 몸을 붙인다',chk:['c',55],ok:()=>hom_told30(),no:()=>hom_spray30()},
   {l:'수면의 막 아래를 피해 빠르게 오르내린다',chk:['w',40],ok:()=>hom_told30(),no:()=>hom_spray30()},
   {l:'구석에 가만히 있는다',ok:()=>hom_spray30()}
  ]}]);
const hom_told30=()=>({t:'주인이 바닥에 떨어진 새우들을 보고 원인을 찾았습니다. 그날 물을 크게 갈고 활성탄을 넣었습니다.',c:'good',fx:{h:-10,wq:8},set:{no_snails:1},run:()=>hom_learn('spray',isKind('grandma','shared')?.4:isKind('casual')?.2:1.2)});
function hom_spray30(){
  setFl('no_snails',1);
  if(season()!=='summer')return {t:'수면에 막이 오래 남았습니다. {n}의 아가미가 며칠 동안 따끔거렸습니다.',c:'bad',fx:{h:-6,st:.05},run:()=>hom_learn('spray',.5)};
  const need=isSp('neon','guppy','altum','peapuffer')?999:isSp('@big','pleco')?40:60;
  return hom_endure(need,'HOM-30-D','{n}의 몸통이 한동안 잘게 떨렸습니다. 균형을 잃었다가 며칠 뒤에야 바로 헤엄쳤습니다.',{set:{inj_gill:1},run:()=>hom_learn('spray',isKind('casual')?.2:1)});
}
fevEnd({'HOM-30-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[2,'수조 방에서 살충제를 뿌림']],
  l:['살충제 성분이 수면을 통해 물에 녹아듭니다. 아가미를 통해 들어온 성분이 신경세포의 나트륨 통로를 열린 채로 붙잡아 둡니다.','신경이 멈추지 않고 신호를 보냅니다. {n}의 몸통 근육이 잘게 떨리고 꼬리가 제멋대로 꺾입니다.','{n}은 몸을 세우려 지느러미를 휘젓지만 수면과 바닥 사이를 비스듬히 오르내립니다. 아가미 뚜껑의 움직임이 고르지 않게 됩니다.','{n}은 바닥에 떨어진 새우들 옆에 옆으로 눕습니다.','방 안의 모기는 창문 틈으로 나갔습니다.']}});

/* EV-HOM-31 새 물의 온도 — overlaps the engine's tap water/temperature shock (w .5)
   [출처: 열대어 급격한 수온 하강(냉각 쇼크)과 백점병 유발; 국내 겨울 상수도 수온] */
fev([{id:'HOM-31',tier:'fact',own:['eager','gift','casual','grandma','shared','cult'],need:{pond:0,l_wtemp:0},cd:40,w:.5,
  log:()=>season()==='winter'?'주인이 겨울 수돗물을 그대로 받아 수조를 채웠습니다.':'주인이 보일러 온수를 섞어 물을 받았습니다. 온도는 재지 않았습니다.',
  p:'호스에서 새 물이 쏟아져 들어옵니다. 물줄기가 닿는 쪽만 온도가 크게 다릅니다. 물줄기 주변으로 작은 기포와 먹이 부스러기가 소용돌이칩니다. {n}은…',
  o:[
   {l:'새 물줄기 쪽으로 다가가 부스러기를 쫓는다',chk:['g',50],ok:()=>hom_temp31(0),no:()=>hom_temp31(2)},
   {l:'물줄기를 피해 반대편 구석으로 간다',chk:['w',35],ok:()=>hom_temp31(-1),no:()=>hom_temp31(1)},
   {l:'바닥에 가만히 있는다',ok:()=>hom_roll('g',25,()=>hom_temp31(tankL()<40?1:0),()=>hom_temp31(1))}
  ]}]);
function hom_temp31(lv){
  const L=()=>hom_learn('wtemp',isKind('grandma')?.3:1);
  if(lv<0)return {t:'{n}은 물줄기가 닿지 않는 구석에서 수온이 고르게 섞일 때까지 기다렸습니다.',fx:{w:1},run:L};
  if(season()!=='winter')return lv>=1?{t:'뜨거운 물줄기가 {n}의 옆구리와 지느러미에 닿았습니다. 닿은 자리가 하얗게 데었습니다.',c:'bad',fx:{h:-12,fin:.1},set:{inj_burn:1},run:L}:{t:'물줄기가 지나간 자리만 잠시 뜨거웠습니다.',fx:{h:-2}};
  if(isSp('@gold','koi','channa','gar')||!isSp('@tropical'))return {t:'찬물이 쏟아졌지만 {n}은 금세 몸을 추슬렀습니다.',fx:{g:1}};
  if(isSp('altum')&&lv>=1)return R()<.5?{end:'HOM-31-D'}:{t:'{n}은 그날부터 먹이를 받아먹지 않았습니다. 며칠 뒤 몸에 하얀 점이 돋았습니다.',c:'bad',fx:{h:-15,st:.15},sick:'ich',set:{thin:1},run:L};
  if(isSp('altum','motoro','ghost','clownloach','arowana'))lv++;
  if(lv>=2)return hom_endure(45,'HOM-31-D','{n}의 몸에 하얀 점이 돋았습니다. 몸이 한동안 기울어 있었습니다.',{sick:'ich',run:L});
  return hom_lv(lv,'{n}은 찬물에 잠시 몸을 떨었습니다.','물이 한꺼번에 차가워졌습니다. 며칠 뒤 {n}의 몸에 하얀 점이 돋았습니다.',null,{sick:lv?'ich':null,run:L});
}
fevEnd({'HOM-31-D':{kind:'bad',cat:'수온 쇼크',tier:'fact',fx:'f-ice',pl:[[2,'환수 물 온도를 맞추지 않음']],fact:'fTemp',
  l:['겨울 수돗물이 수조의 절반을 채웁니다. 수온이 한 시간 만에 열 도 넘게 떨어집니다.','{n}의 심장 박동이 느려지고 지느러미 근육이 굳습니다.',()=>isSp('altum')?'{n}은 높은 지느러미를 접은 채 수초 사이로 몸을 숨기려 합니다. 균형을 잡지 못해 몸이 옆으로 기울고 수초에 걸립니다.':'{n}은 지느러미를 접은 채 수초 사이로 몸을 숨기려 합니다. 균형을 잡지 못해 몸이 옆으로 기울고 수초에 걸립니다.','아가미 뚜껑이 느리게 열렸다 닫힙니다.','다음 날 {n}의 몸 위로 하얀 점이 하나둘 돋아납니다. {n}은 수초에 걸린 채 더 이상 몸을 세우지 않습니다.']}});

/* EV-HOM-32 정수기 물 — [출처: 역삼투압 정수의 미네랄·KH 제거; 저pH가 어류 아가미 이온 조절에 미치는 영향; 구피·플래티 경수 선호, 알텀·아피스토 연수 선호] */
fev([{id:'HOM-32',tier:'fact',need:{ro_water:1,pond:0},cd:50,
  w:()=>isSp('guppy','platy','@gold','koi','fig8','altum','wildbetta','apisto')?1.5:.8,
  p:'주인이 정수기에서 받은 물을 페트병으로 날라 붓습니다. 물이 유난히 맑고 가볍습니다. 몇 주가 지나자 물이 시큼해지고, 피부의 미끈한 막이 얇아집니다. {n}은…',
  o:[
   {l:'바닥 돌과 조개 근처에 머물며 그 표면을 쫀다',chk:['w',35],ok:()=>hom_ro32(-.15),no:()=>hom_ro32(0)},
   {l:'수면 가까이에서 아가미를 크게 움직이며 머문다',chk:()=>hom_best(['w',40],['c',50]),
    ok:{t:'"물고기가 헐떡인다"를 검색한 주인이 수돗물에 염소 중화제를 타서 쓰기 시작했습니다.',c:'good',fx:{h:-4},set:{ro_water:0}},no:()=>hom_ro32(0)},
   {l:'평소처럼 가만히 지낸다',ok:()=>hom_ro32(0)}
  ]}]);
function hom_ro32(b){
  const L=()=>hom_learn('ro',isKind('eager')?.5:1);
  if(isSp('altum','wildbetta','apisto')){addFl('ro_long');return fl('ro_long')>=2?{t:'완충 성분이 없는 물의 pH가 계속 떨어졌습니다. {n}의 아가미가 붓고 몸 색이 어두워졌습니다.',c:'bad',fx:{h:-15,st:.1},run:L}
    :{t:'{n}이 처음으로 지느러미를 끝까지 폈습니다. 주인은 정수기 덕분이라 믿고 렌탈을 2년 연장했습니다.',c:'good',fx:{st:-.05,c:1}}}
  if(isSp('guppy','platy'))return R()<clamp(Math.pow(fst().g/55,2)+b,.05,.9)?{t:'{n}은 꼬리를 접은 채 제자리에서 몸을 흔들며 지냈습니다. 지느러미 끝이 짧아졌습니다.',c:'bad',fx:{h:-15,fin:.15,st:.1},run:L}:{end:'HOM-32-D'};
  if(isSp('@gold','koi'))return {t:'{n}의 피부 점막이 얇아졌습니다.',c:'bad',fx:{h:-8},set:{slime_loss:1},run:L};
  if(isSp('fig8'))return {t:'경도도 염분도 없는 물에서 {n}의 몸이 점점 무거워졌습니다.',c:'bad',fx:{h:-12,st:.12},run:L};
  return {t:'물이 조금씩 시큼해졌습니다. {n}은 별다른 일 없이 지냈습니다.',fx:{st:.03},run:L};
}
fevEnd({'HOM-32-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-bottom',pl:[[2,'정수기 물만 사용']],fact:'fWater',
  l:['완충 성분이 없는 물에서 pH가 5 아래로 떨어집니다. 산성 물이 {n}의 아가미 새엽 표면 단백질을 상하게 하고 점액이 두껍게 뭉칩니다.','아가미에서 나트륨과 염화 이온이 빠져나가 혈액의 이온 농도가 떨어집니다.','{n}은 꼬리를 접은 채 제자리에서 몸을 좌우로 흔듭니다. 화려하던 꼬리지느러미 끝이 녹아 짧아집니다.','{n}은 수면 가까이에서 아가미 뚜껑을 크게 열었다 닫습니다.','주인은 정수기 필터를 새것으로 교체합니다.']}});

/* ================= H. 집 안의 다른 생명 ================= */

/* EV-HOM-33 고양이 (§3-5 심화) — overlaps the engine's cat (w .5)
   [출처: 고양이에 의한 관상어 사고 사례; 베타 수면 공기 호흡 빈도] */
fev([{id:'HOM-33',tier:'fact',need:{cat_home:1,lid:0,pond:0},cd:30,w:()=>.5*(isSp('betta','@gold','guppy','neon')?1.5:1),
  p:'수면 위로 커다란 그림자가 드리워집니다. 수면이 톡, 톡 흔들립니다. 그림자 끝에서 무언가가 물속으로 천천히 내려옵니다. {n}은…',
  o:[
   {l:'수면을 건드리는 것에 다가가 입을 대 본다',chk:['p',45],
    ok:()=>isSp('oscar')?{end:'HOM-33-H'}:isSp('arowana')?hom_jump02():{t:'{n}은 발이 닿기 직전 몸을 빼 물속으로 내려갔습니다.',fx:{p:2}},no:()=>hom_paw33()},
   {l:'지느러미를 접고 수초 사이로 빠르게 들어간다',chk:['w',35],ok:()=>isSp('@gold')&&tankL()<30&&R()<.5?hom_paw33():{t:'{n}은 수초 사이에 들어가 그림자가 사라질 때까지 기다렸습니다.',fx:{w:1}},no:()=>hom_paw33()},
   {l:'바닥 돌 틈으로 내려가 움직이지 않는다',ok:()=>fx_().air&&R()<.2?(R()<clamp(Math.pow(fst().w/35,2),.05,.95)?{t:'숨을 쉬러 올라간 순간 그림자가 다시 내려왔습니다. {n}은 공기만 삼키고 곧장 돌 틈으로 돌아갔습니다.',fx:{w:1}}:hom_paw33()):{t:'{n}은 돌 틈에서 움직이지 않았습니다. 그림자는 한참 뒤 사라졌습니다.'}}
  ]}]);
function hom_paw33(){
  if(fx_().cm>=30||isSp('oscar','arowana','koi','gar'))return {t:'고양이 발톱이 {n}의 등을 긁고 지나갔습니다. 몸이 무거워 들리지는 않았습니다. 등 비늘에 발톱 자국이 남았습니다.',c:'bad',fx:{h:-12,st:.12},set:{scar:1},near:'lid'};
  return R()<.6?{end:'HOM-33-D'}:{t:'고양이 발톱에 걸린 {n}이 물 밖으로 들렸다가 수조 안으로 다시 떨어졌습니다. 옆구리가 찢어졌습니다.',c:'bad',fx:{h:-22,st:.18},set:{scar:1,slime_loss:1},near:'lid'};
}
fevEnd({
 'HOM-33-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-cat',pl:[[3,'고양이가 있는 집에 뚜껑 없는 수조']],fact:'fCat',
   l:['{n}은 숨을 쉬러 수면으로 올라갑니다. 고양이 발톱이 옆구리 비늘 사이로 들어가 근육에 걸립니다.','{n}은 물 밖으로 들려 올라가며 몸을 비틉니다. 발톱이 빠지면서 상처가 옆으로 찢어지고 {n}은 마룻바닥에 떨어집니다.','고양이가 앞발로 {n}을 굴립니다. 구를 때마다 바닥 먼지가 찢어진 상처와 아가미 새엽에 달라붙습니다.','{n}은 한참 동안 바닥에서 튀어 오르고, 고양이는 튀어 오를 때마다 다시 앞발을 댑니다.','고양이는 {n}을 먹지 않습니다.']},
 'HOM-33-H':{kind:'happy',cat:'고양이를 문 물고기',tier:'story',fx:'f-home',
   l:['{n}은 물속으로 내려온 고양이 발을 덥석 물었습니다.','고양이는 그날 이후 수조가 있는 방에 들어오지 않았습니다. 주인은 고양이 발을 소독해 주고 병원에 데려갔습니다.','{n}의 뺨에 난 발톱 자국은 아무도 보지 않았습니다.']}
});

/* EV-HOM-34 개의 꼬리 — falls are unavoidable until the bowl is moved up
   [출처: 반려견에 의한 어항 전도 사고 사례 — 확인 안 되면 일반 "어항 낙하" 사고로만 서술] */
fev([{id:'HOM-34',tier:'likely',sp:['@gold','betta','wildbetta','guppy','platy','neon','peapuffer'],need:{dog:1,bowl_low:1,pond:0},cd:20,
  p:'탁자가 쿵, 쿵 흔들립니다. 거대한 코가 유리에 닿았다 떨어지며 김이 서립니다. 어항 물이 한쪽으로 쏠렸다가 돌아옵니다. {n}은…',
  o:[
   {l:'유리에 닿은 코 쪽으로 다가가 본다',ok:()=>hom_dog34({t:'{n}이 개와 눈을 맞췄습니다. 주인이 귀엽다며 사진을 찍었습니다.',fx:{c:1,i:.03}})},
   {l:'어항 가운데에서 몸을 낮춘다',ok:()=>hom_dog34({t:'{n}은 어항 가운데에서 흔들림을 버텼습니다.',fx:{g:1}})},
   {l:'바닥 자갈에 배를 대고 가만히 있는다',ok:()=>hom_dog34({t:'{n}은 자갈에 배를 대고 흔들림이 멎기를 기다렸습니다.'})}
  ]}]);
function hom_dog34(o){
  addFl('dog_n');
  if(fl('dog_n')<2&&R()<.5)return Object.assign({},o,{fx:Object.assign({st:.06},o.fx)});
  return Object.assign({},o,{run:()=>q(null,null,()=>{
    addLog(T('개의 꼬리가 탁자 위 어항을 쳤습니다. 어항이 바닥으로 떨어졌습니다.'),'bad');
    const L=()=>hom_learn('bowl',isKind('grandma')?.3:1.4);
    if(R()<hom_find()){fevOut({t:'집에 있던 주인이 바닥의 {n}을 컵에 담았습니다.',c:'bad',fx:{h:-12,st:.15},set:{slime_loss:1},run:L});return}
    if(isSp('guppy','platy','neon'))S.health-=6;
    const ch=clamp(Math.pow(fst().g/25,2),.05,.95)*(isSp('betta','wildbetta')?.8:isSp('oranda','ryukin')?.3:isSp('comet')?.25:.5);
    fevOut(R()<ch?{t:'{n}은 바닥의 물웅덩이에서 버텼습니다. 돌아온 주인이 {n}을 컵에 담았습니다.',c:'bad',fx:{h:-18,st:.15},set:{slime_loss:1},run:L}:{end:'HOM-34-D'});
  })});
}
fevEnd({'HOM-34-D':{kind:'bad',cat:'사고',tier:'likely',fx:'f-floor',pl:[[3,'개 꼬리가 닿는 낮은 탁자에 어항']],
  l:['어항이 바닥으로 떨어져 깨지고 물이 퍼집니다. {n}은 마룻바닥 위에 남습니다.','{n}은 몸을 휘었다 펴며 그 자리에서 파닥입니다. 개가 코를 대고 냄새를 맡은 뒤 혀로 {n}을 핥습니다.','핥을 때마다 몸 표면의 점막이 혀에 묻어 벗겨집니다. 개가 {n}을 입에 물었다가 바닥에 뱉습니다.','송곳니가 지나간 자리로 복강에 구멍이 나고 장이 상처 밖으로 비어져 나옵니다.','{n}의 아가미 뚜껑은 그 뒤에도 몇 분 동안 움직입니다.']}});

/* EV-HOM-35 아이가 부어 준 것들 — overlaps the engine's bread (w .5)
   [출처: 유기물(당분) 유입에 따른 세균 번식과 수중 산소 소비(BOD); 아동 과급여 사례] */
fev([{id:'HOM-35',tier:'fact',need:{child:1,pond:0,l_foodhigh:0},cd:30,w:()=>isKind('shared','grandma')?.8:.5,
  p:'유리 너머로 작은 얼굴이 바짝 붙습니다. 수면 위로 먹이가 한꺼번에 쏟아지고, 이어서 달고 끈적한 물이 쏟아져 내립니다. 물이 금세 뿌옇게 흐려집니다. {n}은…',
  o:[
   {l:'쏟아진 먹이를 배가 찰 때까지 먹는다',chk:()=>capOf('g')<50||isSp('@gold','@puffer','oscar')?['g',50]:null,
    ok:()=>isSp('@gold','@puffer','oscar')?hom_cloud35({t:'{n}은 배가 찰 때까지 먹고도 멀쩡했습니다.',fx:{fat:.2}}):hom_cloud35({t:'{n}은 배가 찰 때까지 먹었습니다.',fx:{fat:.1}}),
    no:()=>hom_cloud35(isSp('@puffer')?{t:'{n}이 과자 부스러기까지 삼켰습니다. 배가 단단하게 부풀었습니다.',c:'bad',fx:{fat:.35,h:-10}}:isSp('@gold')?{t:'{n}이 먹이를 쉬지 않고 삼켰습니다. 몸이 기울어 떴습니다.',c:'bad',fx:{fat:.3,h:-10},sick:'swimb'}:{t:'{n}이 쉬지 않고 먹었습니다.',c:'bad',fx:{fat:.3,h:-6}})},
   {l:'아이 얼굴이 붙어 있는 유리 앞으로 가서 지느러미를 흔든다',chk:['c',50],
    ok:{t:'"물고기가 날 봐!" 아이가 부모를 끌고 왔습니다. 부모는 뿌연 물을 보고 그날 물을 갈았습니다.',c:'good',fx:{c:2,wq:10},run:()=>hom_learn('food',isKind('grandma')?.3:1.3)},
    no:()=>hom_cloud35({t:'아이는 {n}에게 손을 흔들고 방을 나갔습니다.'})},
   {l:'수초 사이에 가만히 있는다',ok:()=>hom_cloud35({t:'{n}은 수초 사이에서 물이 흐려지는 걸 지켜보았습니다.'})}
  ]}]);
function hom_cloud35(o){
  return Object.assign({},o,{fx:Object.assign({wq:-18},o.fx||{}),run:()=>q(null,null,()=>{
    if(S.ending)return;
    if(fx_().air&&R()<.7){fevOut({t:'다음 날 새벽 물이 우윳빛으로 흐려졌습니다. {n}은 수면 공기를 마시며 버텼습니다.',c:'bad',fx:{h:-8},run:()=>hom_learn('food')});return}
    fevOut(hom_endure(40+(tankL()<30?10:0),'HOM-35-D','다음 날 새벽 물이 우윳빛으로 흐려졌습니다. {n}은 수면에 입을 대고 아침까지 버텼습니다.',{set:{inj_gill:1},run:()=>hom_learn('food',isKind('grandma')?.3:1)}));
  })});
}
fevEnd({'HOM-35-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-float',pl:[[3,'먹이 통을 아이 손에 닿는 곳에 둠']],fact:'fBread',
  l:['물에 녹은 당분을 먹고 세균이 하룻밤 사이 크게 늘어납니다. 물이 우윳빛으로 흐려지고 세균이 물속 산소를 써 버립니다.','{n}은 수면에 입을 대고 숨을 쉽니다. 바닥에 가라앉은 먹이가 썩으며 암모니아가 함께 올라옵니다.','아가미 새엽이 붓고 끝이 하얗게 상합니다.','{n}은 수면 아래에서 점점 느리게 몸을 기울입니다.','아침에 아이는 어항 앞에 서서 "물고기가 자요"라고 말합니다.']}});

/* EV-HOM-36 아이의 손 — overlaps the engine's squeeze (w .5)
   [출처: 코리도라스 가시 자상; 담수 가오리 독침 사람 부상(의학 사례); 소형어 손 압박에 의한 내장 손상] */
fev([{id:'HOM-36',tier:'fact',need:{child:1,lid:0,pond:0,l_nohand:0},cd:30,w:()=>isKind('touch')?2:.5,
  p:'작은 손이 물속으로 들어옵니다. 손가락이 넓게 펴졌다 오므라들며 이리저리 휘젓습니다. 물이 출렁이고 바닥 모래가 일어납니다. {n}은…',
  o:[
   {l:'손가락 사이를 빠르게 빠져나간다',chk:['p',30],ok:{t:'{n}은 손가락 사이를 빠져나가 수조 반대편으로 갔습니다.',fx:{p:2}},no:()=>hom_grab36()},
   {l:'손 근처를 맴돌며 손가락을 쪼아 본다',chk:['c',40],
    ok:()=>isSp('oscar')?{t:'{n}이 아이 손가락을 물었습니다. 아이는 울다가 금세 웃었습니다. 그날부터 아이는 {n}에게 손가락으로 먹이를 주었습니다.',c:'good',fx:{c:3},set:{finger_star:1}}:{t:'"간지러워!" 아이가 손을 빼고 웃었습니다.',c:'good',fx:{c:3}},no:()=>hom_grab36()},
   {l:'장식 뒤에 몸을 붙이고 숨는다',
    ok:()=>isSp('oranda','ryukin')?hom_roll('g',25,{t:'숨을 자리를 찾지 못한 {n}을 손이 스쳐 지나갔습니다.',fx:{st:.06}},()=>hom_grab36()):hom_roll('w',30,{t:'{n}은 장식 뒤에서 손이 나갈 때까지 기다렸습니다.',fx:{w:1}},()=>hom_grab36())}
  ]}]);
function hom_grab36(){
  const L=()=>hom_learn('hand',isKind('touch')?0:1.2);
  if(isSp('oscar','arowana','gar'))return {t:'아이 손은 {n}을 잡지 못했습니다. 물만 바닥에 흘렀습니다.',fx:{st:.05}};
  if(isSp('neon','guppy','platy','peapuffer'))return R()<clamp(Math.pow(fst().g/25,2),.05,.95)*.5?{t:'아이 손에 잡혔던 {n}이 손가락 틈으로 빠져 물에 떨어졌습니다. 비늘 몇 장이 손바닥에 남았습니다.',c:'bad',fx:{h:-18,st:.15},set:{slime_loss:1},run:L}:{end:'HOM-36-D'};
  if(isSp('cory'))return {t:'아이는 손바닥의 작은 상처를 보여 주며 "물고기가 찔렀어"라고 울었습니다. 부모는 그날 저녁 수조 앞에 "손 넣지 마세요" 쪽지를 붙였습니다. 그 전에 같은 수조에서 꺼내졌던 구피 두 마리 때는 아무도 쪽지를 붙이지 않았습니다.',c:'bad',fx:{h:-8,st:.1},run:()=>{setFl('l_nohand',1);if(R()<.5)q(null,null,()=>fRehome('"위험한 물고기"라며 부모가 {n}을 물생활 카페에 분양 글로 올렸습니다.',{note:'아이가 찔려 분양'}))}};
  if(isSp('motoro'))return {t:'손을 넣은 아이가 {n}의 꼬리 독침에 찔렸습니다. 아이는 응급실에 갔습니다.',c:'bad',fx:{st:.2},run:()=>q(null,null,()=>fRehome('주인은 그 주에 {n}을 대형어 숍에 넘겼습니다.',{note:'아이가 쏘여 분양',own:'expert'}))};
  if(isSp('betta','oranda','ryukin'))return {t:'아이가 {n}을 꺼내 들고 뽀뽀를 했습니다. 다시 물에 넣었을 때 지느러미가 찢어지고 점막이 벗겨져 있었습니다.',c:'bad',fx:{h:-15,fin:.2,st:.15},set:{slime_loss:1},run:L};
  return {t:'아이 손에 잡혔던 {n}이 바둥거리다 물에 떨어졌습니다.',c:'bad',fx:{h:-10,st:.12},run:L};
}
fevEnd({'HOM-36-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-hand',pl:[[3,'아이 손이 닿는 수조']],fact:'fLaw',
  l:['아이의 손가락이 {n}을 감싸고 오므라듭니다. {n}은 손바닥 안에서 몸을 좌우로 비틀며 빠져나오려 합니다.','손가락의 압력이 얇은 배를 눌러 복강 안의 장기가 짓눌립니다. 비늘이 손바닥에 묻어 떨어지고 점액층이 함께 벗겨집니다.','아이는 {n}을 엄마에게 보여 주려고 손을 쥔 채 거실로 달려갑니다.',()=>isSp('neon')?'손이 펴졌을 때 {n}의 푸른 줄무늬 아래 배가 붉게 비쳐 보입니다.':'손이 펴졌을 때 {n}의 배가 붉게 비쳐 보입니다.','{n}은 아이 손바닥 위에서 꼬리를 두 번 칩니다.']}});

/* ================= I. 이사와 계절 ================= */

/* EV-HOM-37 이사 다음 날 (§3-19 심화) — [출처: 이동·이사 시 여과재 건조에 의한 질산화 세균 손실; 암모니아에 의한 아가미·각막 손상] */
fev([{id:'HOM-37',tier:'fact',need:{pond:0,l_move:0},once:1,w:()=>isKind('relay','breakup','casual')?1:.5,
  log:'주인이 이사를 했습니다. 수조 물은 다 버렸고, 여과재는 마른 채로 옮겨졌습니다.',
  p:'하루 종일 봉지 속에서 흔들렸습니다. 새 수조의 물은 차갑고 낯선 냄새가 납니다. 여과기 스펀지는 하얗게 말라 있습니다. 며칠이 지나자 아가미가 화끈거립니다. {n}은…',
  o:[
   {l:'낯선 수조를 구석구석 헤엄치며 살핀다',chk:['w',40],ok:()=>hom_move37(0),no:()=>hom_move37(1)},
   {l:'주인이 보일 때마다 수면에서 아가미를 크게 움직인다',chk:()=>hom_best(['w',40],['c',50]),
    ok:{t:'주인이 수질 검사 키트를 꺼냈습니다. 그 주 내내 이틀에 한 번씩 물을 갈았습니다.',c:'good',fx:{h:-6,wq:15},run:()=>hom_learn('move',1.3)},no:()=>hom_move37(1)},
   {l:'새 장식 뒤에 숨어 움직이지 않는다',ok:()=>hom_roll('g',25,()=>hom_move37(isSp('@scaleless','altum','neon')?1:0),()=>hom_move37(2))}
  ]}]);
function hom_move37(lv){
  if(isKind('expert','staff')||(isKind('learner')&&R()<.5))return {t:'주인은 기존 수조 물과 젖은 여과재를 통에 담아 함께 옮겼습니다. 새 수조의 물은 금세 익숙해졌습니다.',c:'good'};
  S.f.cycled=0;
  if(isSp('oscar','arowana','koi','@gold','pleco','gar'))lv++;
  if(isSp('@scaleless','altum','neon'))lv++;
  if(lv>=2)return hom_endure(isSp('@scaleless','altum','neon')?60:55,'HOM-37-D','{n}의 아가미가 붓고 눈 표면이 뿌옇게 흐려졌습니다. 몇 주 뒤 물이 자리를 잡았습니다.',{fx:{h:-24,wq:-12},set:{inj_gill:1,inj_eye:1},run:()=>hom_learn('move')});
  return hom_lv(lv,'{n}은 낯선 물에 차츰 익숙해졌습니다.','새 물에 암모니아가 쌓여 {n}의 아가미가 화끈거렸습니다.',null,{fx:{h:lv?-15:-5,wq:-12},run:()=>hom_learn('move')});
}
fevEnd({'HOM-37-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',pl:[[2,'이사 때 여과재를 말림']],fact:'fCycle',
  l:['마른 여과재에서는 암모니아를 바꿀 세균이 살아 있지 않습니다. {n}이 내놓은 암모니아가 사흘 만에 물에 쌓입니다.','아가미 새엽 상피가 부풀어 이웃한 새엽끼리 붙습니다. {n}은 넓어진 새 수조를 따라 쉬지 않고 왕복합니다.',()=>isSp('arowana')?'눈 표면이 뿌옇게 흐려지고 턱 수염 끝이 붉게 짓무릅니다.':'눈 표면이 뿌옇게 흐려지고 지느러미 끝이 붉게 짓무릅니다.','혈중 암모니아가 높아지자 {n}은 갑자기 유리벽으로 돌진합니다.','이삿짐 상자는 아직 반도 풀리지 않았습니다.']}});

/* EV-HOM-38 에어컨 없는 여름 — [출처: 수온별 용존 산소량(물리 상수표); Channa bleheri 적정 수온(서늘한 물); 증발 냉각 팬 효과; 수족관 얼음 투입에 의한 급격한 수온 하강] */
fev([{id:'HOM-38',tier:'fact',own:['casual','gift','neglect','shared','breakup','eager','grandma'],need:{season:'summer',ac:0,pond:0},cd:40,
  w:()=>fl('l_fan')?.4:1,
  p:'창문이 닫힌 방에 한낮의 열기가 가득합니다. 물이 미지근해지고, 숨을 아무리 쉬어도 모자랍니다. 문이 열리고 주인이 얼음 봉지를 들고 들어옵니다. {n}은…',
  o:[
   {l:'여과기 출수구 아래 물결치는 수면으로 올라간다',chk:['w',40],ok:()=>hom_heat38(0),no:()=>hom_heat38(1)},
   {l:'움직임을 줄이고 수조 가운데에 떠 있는다',chk:['g',40],ok:()=>hom_heat38(0),no:()=>hom_heat38(1)},
   {l:'바닥 그늘에 가만히 있는다',ok:()=>hom_roll('g',25,()=>hom_heat38(1),()=>hom_heat38(2))}
  ]}]);
function hom_heat38(lv){
  const L=()=>hom_learn('fan',isKind('neglect')?0:1);
  if(isSp('channa','koi','neon','cory','peapuffer')||(isSp('@gold')&&S.f.mates.reduce((s,m)=>s+m.n,0)>4))lv++;
  if(isSp('altum','arowana','oscar','betta','wildbetta','gar'))lv--;
  if(fl('l_fan'))lv--;
  if(isSp('altum')&&lv<=0)return {t:'{n}이 처음으로 먹이를 잘 받아먹었습니다. 주인은 "에어컨이 필요 없는 물고기"라고 기억해 두었습니다.',c:'good',fx:{h:3},set:{no_heater:1}};
  const ice=isKind('eager','gift','grandma');
  if(lv>=2)return R()<.6?{end:'HOM-38-D'}:{t:'저녁이 되어서야 물이 식었습니다. {n}의 아가미가 붉게 부어 있었습니다.',c:'bad',fx:{h:-26,st:.18},set:{inj_gill:1},run:L};
  return hom_lv(lv,ice?'주인이 얼음을 수조에 쏟았습니다. 물이 갑자기 차가워졌습니다.':'저녁이 되자 물이 조금 식었습니다.',ice?'주인이 얼음을 수조에 그대로 쏟았습니다. 데워졌던 물이 갑자기 차가워져 {n}이 몸을 떨었습니다.':'{n}은 오후 내내 수면에서 숨을 몰아쉬었습니다.',null,{sick:ice&&isSp('@tropical')&&R()<.5?'ich':null,run:L});
}
fevEnd({'HOM-38-D':{kind:'bad',cat:'과열',tier:'fact',fx:'f-cook',pl:[[2,'여름 수온 관리 안 함']],fact:'fTemp',
  l:['수온이 34도에 이릅니다. 물에 녹아 있을 수 있는 산소가 줄어든 만큼 {n}의 몸은 더 많은 산소를 요구합니다.',()=>fx_().air?'{n}은 수면으로 올라가 공기를 삼키고 다시 내려가기를 점점 짧은 간격으로 되풀이합니다.':'{n}은 수면으로 올라가 입을 벌리고 다시 내려가기를 점점 짧은 간격으로 되풀이합니다.','근육이 열에 지쳐 내려가는 동작이 느려집니다. {n}은 수면에 입을 댄 채 몸을 비스듬히 늘어뜨립니다.','아가미 새엽의 혈관이 늘어나 새엽이 붉게 부풉니다.','저녁에 주인이 쏟아부은 얼음이 {n}의 등 위로 떨어집니다.']}});

/* EV-HOM-39 설 연휴, 꺼진 보일러 — overlaps the engine's cold (w .5)
   [출처: 수족관 히터 용량 기준(물 1L당 W); 저수온과 백점병; Channa bleheri 저수온 내성] */
fev([{id:'HOM-39',tier:'fact',sp:['@tropical'],need:{season:'winter',pond:0},cd:80,
  w:()=>.5*(fl('l_winter')?.4:1)*(isKind('casual','breakup','relay','shared')?1.6:1),
  log:'주인이 연휴 동안 집을 비웠습니다. 보일러는 외출 모드였습니다.',
  p:'집이 조용하고 차갑습니다. 창문 안쪽에 성에가 끼었습니다. 히터의 주황 불빛은 계속 켜져 있는데 물은 점점 차가워집니다. {n}은…',
  o:[
   {l:'히터 바로 옆 따뜻한 물줄기에 머문다',chk:['w',35],
    ok:()=>Object.assign(hom_cold39(0),S.f.heater&&!fl('heater_cover')&&R()<.4?{set:{inj_burn:1}}:{}),no:()=>hom_cold39(1)},
   {l:'무리나 다른 물고기 곁에 몸을 붙인다',ok:()=>hom_cold39(isSp('@schooling')&&R()<.5?0:1)},
   {l:'바닥에서 움직임을 줄인다',chk:['g',25],ok:()=>hom_cold39(0),no:()=>hom_cold39(1)}
  ]}]);
function hom_cold39(lv){
  const L=()=>hom_learn('winter',isKind('relay','breakup')?.3:1);
  if(isSp('channa'))return {t:'연휴 뒤 돌아온 주인이 수조 앞에서 멀쩡한 {n}을 보고 "역시 가물치 친척"이라고 했습니다.',fx:{g:1}};
  if(isSp('pleco'))return {t:'{n}은 차가운 물에서 유목에 붙어 연휴를 버텼습니다.',fx:{g:1}};
  if(!S.f.heater)lv++;
  if(isSp('altum','motoro','ghost','arowana','clownloach','bichir'))lv++;
  if(lv>=2)return R()<.55?{end:'HOM-39-D'}:{t:'연휴 셋째 날 돌아온 주인이 보일러를 켰습니다. {n}의 몸에 하얀 점이 돋아 있었습니다.',c:'bad',fx:{h:-25,st:.15},sick:'ich',run:L};
  return hom_lv(lv,'{n}은 차가운 물에서 연휴를 버텼습니다.','물이 차가워졌습니다. 연휴가 끝날 무렵 {n}의 몸에 하얀 점이 돋았습니다.',null,{sick:lv?'ich':null,run:L});
}
fevEnd({'HOM-39-D':{kind:'bad',cat:'동사',tier:'fact',fx:'f-ice',pl:[[2,'겨울에 집을 비우며 보온하지 않음']],fact:'fIch',
  l:['수온이 19도까지 내려갑니다. {n}의 소화가 멈추고 장 속 먹이가 그대로 남습니다.',()=>S.f.heater?'{n}은 히터 옆 따뜻한 물줄기에 머리를 대고 버팁니다.':'{n}은 바닥에서 몸을 웅크리고 버팁니다.','차가운 물에서 면역 반응이 느려진 피부에 하얀 점이 돋기 시작합니다. 아가미 새엽에도 기생충이 자리 잡아 새엽이 부풉니다.',()=>S.f.heater?'{n}은 히터에 몸을 기댄 채 아가미 뚜껑을 빠르게 움직입니다.':'{n}은 바닥에 누운 채 아가미 뚜껑을 빠르게 움직입니다.',()=>S.f.heater?'히터 유리관이 닿은 옆구리 비늘 아래가 하얗게 데어 있습니다.':'연휴 마지막 날, 현관문이 열리는 소리가 납니다.']}});

/* EV-HOM-40 반지하에 들어온 물 — the flood is not the owner's to learn away (housing)
   [출처: 집중호우 시 반지하 주택 침수 피해 — 사건 연출에만 쓰고 피해 수치는 화면에 쓰지 않음; 오수·유류의 어류 아가미 손상] */
fev([{id:'HOM-40',tier:'fact',own:['casual','breakup','relay','learner','gift'],need:{basement:1,season:'summer',pond:0},once:1,
  p:'창문 틈으로 흙탕물이 들어옵니다. 방바닥의 물이 점점 차올라 수조 받침대를 덮습니다. 수조 밖에서 탁한 물이 유리 위쪽 가장자리까지 올라옵니다. 전기가 나갑니다. {n}은…',
  o:[
   {l:'수조 가장자리를 넘어 들어오는 바깥 물 쪽으로 간다',ok:()=>R()<.6?hom_out40():hom_sewage40(1)},
   {l:'수조 안 가장 깊은 곳에 머문다',chk:['g',40],ok:()=>hom_sewage40(0),no:()=>hom_sewage40(1)},
   {l:'장식 뒤에 몸을 붙이고 숨는다',chk:['g',25],ok:()=>hom_sewage40(1),no:()=>hom_sewage40(2)}
  ]}]);
function hom_out40(){
  return {t:'물이 방 밖으로 빠질 때 {n}도 함께 휩쓸려 나갔습니다. 하수구를 지나 도시 하천에 닿았습니다.',c:'bad',pl:[[3,'반지하 침수로 휩쓸려 나감']],
    run:()=>q(null,null,()=>{S.f.released=1;setFl('escaped',1);goWild('river')})};
}
function hom_sewage40(lv){
  if(isSp('@scaleless'))lv++;
  const after=()=>{setFl('basement',0);if(R()<.4)q(null,null,()=>fRehome('반지하 방을 비우게 된 주인은 {n}을 지인에게 맡겼습니다.',{note:'침수로 집을 잃음'}))};
  if(lv>=2)return hom_endure(50,'HOM-40-D','물이 빠진 뒤 사흘 만에 주인이 돌아왔습니다. {n}은 흙탕물 속에서 아가미를 겨우 움직이고 있었습니다.',{set:{inj_gill:1},run:after});
  if(R()<hom_find()*.6+fst().c/300)return {t:'대피하던 주인이 {n}을 통에 담아 함께 나왔습니다.',c:'bad',fx:{h:-8,st:.15},run:after};
  return hom_lv(lv,'물이 빠질 때까지 {n}은 수조 바닥에서 버텼습니다.','오수가 수조에 섞였습니다. {n}의 아가미가 상했습니다.',null,{set:{inj_gill:1},run:after});
}
fevEnd({'HOM-40-D':{kind:'bad',cat:'침수',tier:'fact',fx:'f-float',pl:[[2,'반지하 침수']],
  l:['하수와 흙이 섞인 물이 수조 안으로 넘어 들어옵니다. 물속의 기름 성분과 세제 성분이 {n}의 아가미 새엽 표면을 덮습니다.','흙 입자가 새엽 사이에 끼어 점액과 함께 엉깁니다.','{n}은 수면까지 올라가 숨을 쉬려 하지만, 수면에는 기름 막이 떠 있습니다. {n}은 기름 막 아래에서 입을 벌리고 다시 바닥으로 내려갑니다.',()=>isSp('cory')?'가슴지느러미 가시를 세운 채 바닥 흙탕물 속에서 아가미 뚜껑을 빠르게 움직입니다.':'바닥 흙탕물 속에서 아가미 뚜껑을 빠르게 움직입니다.','사흘 뒤 물이 빠진 방에 주인이 돌아왔을 때 수조는 흙으로 반쯤 차 있습니다.'],after:false}});

/* ================= J. 마당 연못과 노지 ================= */

/* EV-HOM-41 왜가리 — overlaps the engine's pond predators (w .5)
   [출처: 왜가리 도심 하천·연못 서식과 어류 포식(국내 조류 자료); 왜가리 먹이 크기] */
fev([{id:'HOM-41',tier:'fact',sp:['koi','comet','oranda','ryukin','guppy','platy'],need:{pond:1},cd:30,w:.5,
  when:()=>!S.f.net,
  p:'새벽, 연못 가장자리에 긴 다리의 그림자가 서 있습니다. 그림자는 오래도록 움직이지 않습니다. 매일 아침 먹이를 주던 사람의 발소리와는 다른 무게가 물가에 느껴집니다. {n}은…',
  o:[
   {l:'늘 먹이를 받던 물가로 헤엄쳐 간다',chk:()=>capOf('w')<45?null:['w',isSp('koi')&&fl('tame')?55:45],
    ok:()=>capOf('w')<45?hom_beak41():{t:'{n}은 물가 가까이에서 그림자가 사람이 아니라는 걸 알아채고 몸을 돌렸습니다.',fx:{w:2}},no:()=>hom_beak41()},
   {l:'연못 가운데 깊은 곳으로 내려간다',chk:['p',40],ok:{t:'{n}은 깊은 곳에서 그림자가 날아갈 때까지 기다렸습니다.',fx:{p:1}},no:()=>hom_beak41()},
   {l:'연잎 그늘 아래에 몸을 붙이고 있는다',ok:()=>hom_roll('w',25,{t:'{n}은 연잎 그늘 아래에서 움직이지 않았습니다.'},()=>hom_beak41())}
  ]}]);
function hom_beak41(){
  const len=S.f.len||fx_().cm*.5;
  if(isSp('koi')&&len>=30||isSp('comet')&&len>=20&&R()<.6)return {t:'왜가리의 부리가 {n}의 등을 찔렀습니다. 몸이 커서 삼켜지지는 않았습니다. 등에 깊은 상처가 남았습니다.',c:'bad',fx:{h:-25,st:.2},set:{scar:1},sick:R()<.35?'fungus':null,near:'net'};
  return {end:'HOM-41-D'};
}
fevEnd({'HOM-41-D':{kind:'bad',cat:'잡아먹힘',tier:'fact',fx:'f-pond',pl:[[3,'연못에 그물을 치지 않음']],fact:'fKoi',
  l:['{n}은 매일 먹이를 받던 물가로 헤엄쳐 올라갑니다. 왜가리의 부리가 수면을 뚫고 들어와 {n}의 몸통을 옆에서 집습니다.','부리 끝이 옆구리 비늘을 뚫고 복강 쪽 근육에 박힙니다. {n}은 물 밖으로 들려 나와 꼬리를 세게 칩니다.','왜가리는 {n}을 공중에서 한 번 고쳐 물어 머리가 목구멍 쪽을 향하게 돌립니다.','{n}은 머리부터 왜가리의 목 안으로 들어갑니다. 꼬리지느러미가 부리 끝에서 잠시 움직이다 사라집니다.']}});

/* EV-HOM-42 밤의 연못 (길고양이·너구리)
   [출처: 국내 도심 너구리 서식(서울 등 도시 하천·공원 조사 자료); 너구리 잡식성 먹이 목록에 어류 포함 여부; 길고양이 연못 어류 포식 사례] — tier likely until the raccoon part is sourced */
fev([{id:'HOM-42',tier:'likely',sp:['koi','comet','oranda','ryukin','guppy','platy'],need:{pond:1},cd:30,
  when:()=>!S.f.net,w:()=>fl('cat_food')?1.6:1,
  p:'밤, 물가 돌 위에서 작은 발소리가 납니다. 수면에 앞발이 닿았다 떨어지며 물결이 번집니다. 얕은 물가 쪽에서 무언가가 물을 헤치며 들어옵니다. {n}은…',
  o:[
   {l:'물결이 이는 쪽으로 가서 무엇인지 살핀다',chk:['p',40],ok:{t:'{n}은 다가갔다가 앞발이 내려오기 전에 재빨리 빠졌습니다.',fx:{p:2}},no:()=>hom_paw42()},
   {l:'수초 덤불 속으로 들어간다',chk:['w',35],ok:{t:'{n}은 수초 덤불 속에서 밤을 보냈습니다.',fx:{w:1}},no:()=>hom_paw42()},
   {l:'연못 가장 깊은 바닥에 몸을 붙인다',ok:()=>!fl('pond_shallow')?{t:'{n}은 깊은 바닥에서 발소리가 멀어질 때까지 기다렸습니다.'}:R()<clamp(Math.pow(fst().g/25,2),.05,.95)?{t:'얕은 바닥까지 앞발이 훑고 지나갔습니다. {n}은 몸을 붙인 채 버텼습니다.',fx:{st:.08}}:hom_paw42()}
  ]}]);
function hom_paw42(){
  const after=()=>{if(isKind('grandma')&&R()<.5){setFl('cat_food',1);addLog(T('할머니는 "고양이 밥을 따로 주면 된다"며 마당에 고양이 밥을 놓았습니다. 고양이가 더 모였습니다.'),'bad')}};
  if(isSp('koi')&&(S.f.len||30)>=30)return {t:'발톱이 {n}의 옆구리를 할퀴고 지나갔습니다. 큰 몸은 끌려 나가지 않았습니다.',c:'bad',fx:{h:-15,st:.15},set:{scar:1},near:'net',run:after};
  if(!fl('pond_shallow')&&R()<.4)return {t:'발톱이 {n}의 꼬리를 스쳤습니다. {n}은 깊은 곳으로 달아났습니다.',c:'bad',fx:{h:-10,fin:.15},near:'net',run:after};
  return {end:'HOM-42-D'};
}
fevEnd({'HOM-42-D':{kind:'bad',cat:'잡아먹힘',tier:'likely',fx:'f-pond',pl:[[3,'연못에 그물을 치지 않음']],
  l:['너구리가 얕은 물가로 들어와 앞발로 바닥을 훑습니다. 발톱이 {n}의 꼬리자루에 걸려 꼬리지느러미 아래 근육이 찢어집니다.','{n}은 꼬리를 쳐서 달아나려 하지만 찢어진 근육 쪽으로 몸이 기웁니다.','너구리가 앞발로 {n}을 물가 돌 위로 끌어올립니다. 이빨이 등 근육을 지나 척추에 닿습니다.','척수가 끊긴 뒤에도 꼬리지느러미가 돌 위에서 몇 번 떨립니다.','아침에 주인은 돌 위에 남은 비늘 몇 장과 젖은 발자국을 봅니다.']}});

/* EV-HOM-43 수달 — the otter is a protected species, never a villain here
   [출처: 수달(천연기념물·멸종위기 야생생물) 국내 하천 분포 회복과 양어장·연못 어류 피해 사례; 수달의 대형 잉어 포식] */
fev([{id:'HOM-43',tier:'fact',sp:['koi','comet','oranda','ryukin'],need:{pond:1,river_near:1,otter_fence:0},cd:20,
  w:()=>(S.f.net?.5:1)*(1+fl('otter_seen')),
  p:'밤, 연못에 무언가가 소리 없이 들어옵니다. 물속에서 빠르고 유연한 몸이 바닥까지 내려왔다 올라갑니다. 물고기들이 한꺼번에 흩어지며 바닥 흙이 일어납니다. {n}은…',
  o:[
   {l:'연못 가장자리 돌 틈 사이로 파고든다',chk:['w',50],ok:{t:'{n}은 돌 틈 깊숙이 몸을 끼우고 아침을 기다렸습니다.',fx:{w:2}},no:()=>hom_otter43()},
   {l:'무리와 함께 반대편으로 빠르게 헤엄친다',chk:()=>['p',isSp('comet')?50:60],ok:{t:'{n}은 흩어지는 무리에 섞여 반대편 끝까지 달아났습니다.',fx:{p:2}},no:()=>hom_otter43()},
   {l:'흙탕물 속 바닥에 몸을 붙이고 가만히 있는다',ok:()=>hom_roll('g',25,()=>R()<.5?{t:'흙탕물 속에서 {n}은 움직이지 않았습니다. 수염 달린 얼굴이 바로 옆을 지나갔습니다.',fx:{st:.1}}:hom_otter43(),()=>hom_otter43())}
  ]}]);
function hom_otter43(){
  addFl('otter_seen');
  if(R()<.15)return {t:'수달의 이빨이 {n}의 옆구리를 스쳤습니다. {n}은 몸을 비틀어 빠져나왔습니다.',c:'bad',fx:{h:-25,st:.2},set:{scar:1},run:()=>hom_learn('otter',isKind('expert','breeder')?1.5:.5)};
  return {end:'HOM-43-D'};
}
fevEnd({'HOM-43-D':{kind:'bad',cat:'잡아먹힘',tier:'fact',fx:'f-pond',pl:[[3,'하천 가까운 연못에 울타리 없음']],
  l:['수달이 물속에서 {n}의 옆구리를 물고 물가로 끌어올립니다. 이빨이 비늘을 뚫고 등 근육 깊숙이 박힙니다.','{n}은 잔디 위에서 몸을 크게 휘어 연못 쪽으로 튀어 오르려 합니다.','수달이 {n}의 등 쪽 근육부터 먹습니다. 근육이 떨어져 나간 자리로 척추뼈와 늑골이 드러납니다.','{n}은 몸의 절반을 잃은 채 아가미 뚜껑을 한동안 움직입니다.','아침에 주인은 잔디 위에서 머리와 꼬리만 남은 {n}을 찾습니다. 수달은 강으로 돌아갔습니다.']}});

/* EV-HOM-44 얼어붙은 대야 — a basin frozen to the bottom, and tropical fish left outdoors, get no option and no check
   [출처: 물의 최대 밀도 4°C와 연못 바닥 수온; 금붕어·잉어 저온 휴면; 어류 동결 시 세포 손상.
    얼음 깨기 충격 변형은 근거 확인 전이라 넣지 않음] */
fev([{id:'HOM-44',tier:'fact',sp:['@gold','koi','guppy','platy'],need:{pond:1,season:'winter'},cd:60,
  w:()=>fl('pond_shallow')?1.6:1,
  p:'수면이 하얗게 굳어 하늘이 보이지 않습니다. 물이 점점 차가워져 몸이 무겁습니다. 위쪽에서 무언가가 얼음을 두드리는 소리가 울립니다. {n}은…',
  o:[
   {l:'얼음 바로 아래에서 빛이 가장 밝은 쪽으로 간다',when:()=>!isSp('guppy','platy')&&!fl('pond_shallow'),ok:()=>hom_ice44(1)},
   {l:'바닥으로 내려가 몸을 붙이고 움직임을 줄인다',when:()=>!isSp('guppy','platy')&&!fl('pond_shallow'),chk:()=>['g',isSp('oranda','ryukin')?55:40],ok:()=>hom_ice44(0),no:()=>hom_ice44(1)},
   {l:'다른 물고기들 곁에 가만히 있는다',when:()=>!isSp('guppy','platy')&&!fl('pond_shallow'),chk:['g',25],ok:()=>hom_ice44(1),no:()=>hom_ice44(2)}
  ],
  auto:()=>isSp('guppy','platy')?{end:'HOM-44-T'}:{end:'HOM-44-D'}}]);
function hom_ice44(lv){
  const L=()=>hom_learn('pondwin');
  if(isSp('oranda','ryukin'))lv++;
  if(lv>=2)return {end:'HOM-44-D'};
  if(lv===0&&isSp('comet')&&fst().g>=capOf('g')*.85&&R()<.3)return {end:'HOM-44-H'};
  if(isKind('grandma','casual')&&R()<.2)return {t:'주인이 주전자의 뜨거운 물을 부어 얼음에 구멍을 냈습니다. 물이 닿은 자리에 있던 {n}의 등이 하얗게 데었습니다.',c:'bad',fx:{h:-14},set:{inj_burn:1},run:L};
  return hom_lv(lv,'{n}은 바닥에서 겨울을 났습니다. 봄이 되자 다시 헤엄쳤습니다.','{n}은 차가운 물에서 겨울을 버텼습니다. 봄에도 한동안 몸이 기울어 있었습니다.',null,{sick:lv&&isSp('@gold')&&R()<.4?'swimb':null,run:L});
}
fevEnd({
 'HOM-44-D':{kind:'bad',cat:'동사',tier:'fact',fx:'f-ice',pl:[[2,'얕은 노지 용기에서 월동']],
   l:[()=>fl('pond_shallow')?'상자 속 물이 위에서부터 얼어 내려옵니다. {n}은 바닥에 몸을 붙이고 아가미를 아주 느리게 움직입니다.':'연못의 물이 위에서부터 얼어 내려옵니다. {n}은 바닥에 몸을 붙이고 아가미를 아주 느리게 움직입니다.','얼음이 바닥 가까이 내려오자 {n}이 움직일 수 있는 물이 손바닥만큼 남습니다.',()=>isSp('oranda')?'얼음 결정이 {n}의 등지느러미와 육혹 표면에 맺힙니다.':'얼음 결정이 {n}의 등지느러미 표면에 맺힙니다.','몸 바깥쪽 조직부터 세포 안의 물이 얼어 세포막이 찢어집니다. {n}은 남은 물속에서 꼬리를 한 번 더 저은 뒤 얼음 안에 갇힙니다.','봄에 얼음이 녹았을 때 {n}의 몸은 하얗게 물러져 있습니다.']},
 'HOM-44-T':{kind:'bad',cat:'동사',tier:'fact',fx:'f-ice',pl:[[2,'열대어를 노지에 둔 채 겨울']],fact:'fTemp',
   l:['여름에 노지 대야로 옮겨진 {n}은 가을이 지나도록 그대로 있습니다.','열대의 물에서 온 {n}의 근육은 차가운 물에서 굳습니다. 지느러미가 접히고, 아가미 뚜껑이 느려집니다.','{n}은 바닥에 옆으로 누운 채 움직이지 않습니다. 첫 얼음이 그 위를 덮습니다.']},
 'HOM-44-H':{kind:'happy',cat:'얼음 아래의 봄',tier:'story',fx:'f-pond',
   l:['봄에 주인은 죽은 줄 알고 연못을 정리하려다 얼음 아래에서 꼬리를 흔드는 {n}을 봤습니다.','주인은 "금붕어는 얼었다 녹으면 살아난다"고 동네에 소문을 냈습니다.','그해 겨울, 동네의 스티로폼 상자 세 개가 바닥까지 얼었습니다.']}
});

/* EV-HOM-45 장마에 넘친 연못 — [출처: 장마철 연못 범람에 의한 관상어 하천 유출 사례; 국내 도시 하천 금붕어·비단잉어 출현 기록] */
fev([{id:'HOM-45',tier:'fact',sp:['koi','comet','oranda','ryukin','guppy','platy'],need:{pond:1,season:'summer',overflow_guard:0},cd:40,
  p:'며칠째 비가 쏟아집니다. 연못 물이 가장자리 돌을 넘어 마당으로 흘러넘칩니다. 넘치는 물줄기를 따라 물살이 한 방향으로 당깁니다. 물에 흙냄새와 낯선 맛이 섞입니다. {n}은…',
  o:[
   {l:'넘쳐흐르는 물줄기를 따라 새 물 쪽으로 헤엄친다',chk:()=>capOf('w')<45?null:['w',45],
    ok:()=>capOf('w')<45?hom_flood45():{t:'{n}은 물줄기 끝까지 갔다가 몸을 돌려 연못으로 돌아왔습니다.',fx:{w:2}},no:()=>hom_flood45()},
   {l:'물살을 피해 연못 가장 깊은 곳으로 내려간다',chk:['p',40],ok:{t:'{n}은 깊은 곳에서 비가 그칠 때까지 버텼습니다.',fx:{p:1,st:.05}},no:()=>hom_flood45()},
   {l:'연잎과 수초 뿌리 사이에 몸을 붙인다',ok:()=>hom_roll('g',25,{t:'{n}은 수초 뿌리를 붙잡고 버텼습니다. 빗물에 물맛이 바뀌어 며칠 몸이 무거웠습니다.',fx:{h:-5,st:.05}},()=>hom_flood45())}
  ]}]);
function hom_flood45(){
  if(isSp('oranda','ryukin'))return {end:'HOM-45-D'};
  return {t:'{n}은 넘치는 물줄기에 실려 마당 배수구로 들어갔습니다. 빗물관을 따라 도시 하천까지 흘러갔습니다.',c:'bad',pl:[[3,'장마에 연못이 넘침']],
    run:()=>{if(!isKind('release'))hom_learn('overflow');q(null,null,()=>{S.f.released=1;setFl('escaped',1);goWild('river')})}};
}
fevEnd({'HOM-45-D':{kind:'bad',cat:'사고',tier:'fact',fx:'f-floor',pl:[[3,'장마에 연못이 넘침']],
  l:['{n}은 넘치는 물줄기에 실려 연못 가장자리를 넘습니다. 물줄기는 잔디 사이로 흩어지며 얕아집니다.','{n}은 잔디 위 얕은 물에 옆으로 누운 채 꼬리를 저어 물이 깊은 쪽을 찾습니다. 잔디 줄기에 몸이 걸려 점막이 벗겨지고 비늘이 들립니다.','비가 잦아들자 잔디 사이의 물이 땅으로 스며듭니다. {n}의 위쪽 아가미 새엽이 공기 중에 드러나 마르며 붙습니다.','비가 그친 오후, 주인은 잔디를 깎다가 {n}을 발견합니다.']}});
