/* ---------- v0.10 catalogue: core examples (FISH_REWORK.md §3, decisions 1–21) ---------- */

/* 뚜껑 없는 수조, 밤 — jump results by strength; at the cap a comeback */
fev([{id:'HOM-LID',stage:'home',tier:'fact',need:{lid:0,pond:0},w:()=>.4+((fx_().jump||0)*2)*sideK('jumpy'),cd:14,
  p:'불이 꺼졌습니다. 수면 위가 이상하게 넓어 보입니다. 천장 쪽에서 작은 날벌레 하나가 맴돕니다. {n}은…',
  o:[
   {l:'수면 아래에서 벌레를 계속 올려다본다',chk:()=>(fx_().jump||0)>=.15?['w',30]:null,
    ok:()=>(fx_().jump||0)>=.15?{t:'{n}은 끝까지 뛰어오르지 않았습니다. 벌레는 전등 쪽으로 날아갔습니다.',c:'good',fx:{w:3}}:{t:'벌레는 한참 맴돌다 사라졌습니다. 밤은 그냥 지나갔습니다.',fx:{w:1}},
    no:()=>fevJump()},
   {l:'지느러미를 접고 몸을 낮춘다',ok:[[3,{t:'{n}은 몸을 낮춘 채 밤을 보냈습니다.',fx:{g:2}}],[1,{t:'수면 쪽에서 무언가가 들여다보았습니다. 초록색 눈이었습니다.',c:'bad',set:{cat_seen:1},run:()=>{if(S.f.cat&&!S.waiting)q(null,null,()=>fCr('cat'))}}]]},
   {l:'바닥 돌 틈으로 내려간다',ok:{t:'{n}은 돌 틈에 몸을 끼우고 아침을 기다렸습니다.'}}
  ]}]);
/* what a jump does, by strength within the species cap */
function fevJump(){
  const p=fst().p,cap=capOf('p'),big=fx_().cm>=40;
  if(p>=cap*.92&&cap>=60) return {t:'{n}이 수면을 박차고 올랐습니다. 마룻바닥에 떨어지자마자 몸을 한 번 튕겨, 그대로 수조 안으로 되돌아 떨어졌습니다. 너무 세게 튀어 반대편 유리에 머리를 부딪쳤습니다. 다음 날 주인은 바닥에 떨어진 비늘 한 장을 보았습니다.',c:'good',fx:{h:-8},mem:'바닥에 떨어졌다. 다시 물로 돌아왔다.',near:'lid'};
  if(p>=cap*.6) return R()<.55?{t:'{n}이 바닥에서 두어 번 퍼덕이다 수조 받침을 차고 올라 물속으로 떨어졌습니다. 옆구리 비늘 몇 장이 바닥에 남았습니다.',c:'bad',fx:{h:-12,st:.1},near:'lid'}
    :isSp('@airbreather')&&isSp('@escaper')?{t:'{n}은 바닥을 미끄러져 소파 밑으로 들어갔습니다.',c:'bad',end:R()<fst().g/120?'HAP-SOFA':'HOM-LID-DRY'}
    :{t:'새벽에 물 마시러 나온 주인이 바닥의 {n}을 발견하고 손으로 집어 수조에 넣었습니다. 손이 닿은 자리의 점막이 벗겨졌습니다.',c:'bad',fx:{h:-15,st:.15},near:'lid'};
  return {end:big?'HOM-LID-BIG':'HOM-LID-DRY'};
}
fevEnd({
 'HOM-LID-DRY':{kind:'bad',cat:'점프사',tier:'fact',fx:'f-floor',pl:[[3,'수조 뚜껑 없음']],fact:'fJumpF',
   l:['{n}이 수면 위로 몸을 날렸습니다. 뚜껑은 없었습니다.','마룻바닥에 떨어진 {n}은 몸을 튕기며 물을 찾습니다. 퍼덕일 때마다 몸에 먼지가 들러붙습니다.','공기 중에서 아가미 새엽이 서로 들러붙어 마릅니다. 아가미 뚜껑이 점점 느려집니다.','아침에 주인이 본 {n}은 마룻바닥에 눌어붙어 있었습니다. 떼어 내자 옆구리 비늘이 바닥에 남았습니다.']},
 'HOM-LID-BIG':{kind:'bad',cat:'점프사',tier:'fact',fx:'f-floor',pl:[[3,'수조 뚜껑 없음']],fact:'fJumpF',
   l:['{n}이 수면을 박차고 수조 밖으로 튀어 나갔습니다.','큰 몸이 마룻바닥에 떨어지며 배 쪽부터 부딪칩니다. 충격으로 복강 안의 장기가 터집니다.','{n}은 몇 번 몸을 튕기다 멈춥니다. 입과 아가미 틈으로 피가 배어 나와 바닥에 번집니다.']},
 'HAP-SOFA':{kind:'happy',cat:'소파 밑 3일',tier:'story',fx:'f-rest',
   l:['사흘 뒤, 소파를 옮기던 주인이 비명을 질렀습니다. 먼지를 뒤집어쓴 {n}이 아직 아가미를 움직이고 있었습니다.','공기로 숨을 쉬는 몸이 {n}을 살렸습니다. 주인은 그날 바로 더 큰 수조를 들였습니다.','새 수조의 뚜껑은 세 겹이었습니다.']}
});

/* 비늘 없는 종에 정량 투약 — no dodge; tell the owner, then endure */
fev([{id:'HLT-MEDSCALE',stage:'home',tier:'fact',sp:['@scaleless'],cd:60,
  when:()=>!fl('label')&&(S.f.ill||fl('meds')||isKind('alchemist','learner','eager','casual')),w:()=>isKind('alchemist')?3:1,
  log:'주인이 백점병 약을 수조에 탔습니다. 라벨에 적힌 정량이었습니다.',
  p:'물에서 쓴 냄새가 납니다. 피부가 따끔거립니다. {n}은…',
  o:[
   {l:'주인이 다가올 때마다 앞으로 나와 유리에 몸을 붙인다',chk:['c',45],
    ok:{t:'주인이 {n}의 움직임이 이상하다는 걸 알아챘습니다. 검색 끝에 라벨 뒷면의 작은 글씨를 읽고, 그날 물을 절반 갈았습니다.',c:'good',fx:{h:-8},near:'label'},
    no:()=>fevMedEndure()},
   {l:'평소와 다르게 수면을 빙빙 돈다',chk:['w',45],
    ok:{t:'"얘 왜 이러지?" 주인이 수조를 들여다보다 약병 라벨을 다시 읽었습니다. 물을 절반 갈았습니다.',c:'good',fx:{h:-8},near:'label'},
    no:{t:'"배고픈가 보다." 주인은 먹이를 한 꼬집 더 넣었습니다.',c:'bad',fx:{wq:-6},run:()=>{const o=fevMedEndure();q(null,null,()=>fevOut(o))}}},
   {l:'구석에 가만히 있는다',ok:()=>fevMedEndure()}
  ]}]);
function fevMedEndure(){
  const ch=clamp(Math.pow(fst().g/60,2)*(S.r>.6?1.4:1),.05,.9);
  if(R()<ch) return {t:'라벨 뒷면의 작은 글씨 — "비늘 없는 어종에는 1/2 용량" — 는 아무도 읽지 않았습니다. {n}은 피부가 벗겨진 채로 버텼습니다.',c:'bad',fx:{h:-30,st:.2}};
  return {end:'HLT-MEDSCALE-D'};
}
fevEnd({'HLT-MEDSCALE-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[1,'비늘 없는 종에 정량 투약']],fact:'fMed',
  l:['라벨 뒷면의 작은 글씨 — "비늘 없는 어종에는 1/2 용량" — 는 아무도 읽지 않았습니다.','약이 비늘 없는 피부의 점막을 녹입니다. 점막 아래 상피가 드러나고, 얇은 막이 하얗게 일어납니다.','{n}은 바닥에 몸을 비빕니다. 비빌 때마다 벗겨진 피부가 물에 하늘거립니다.','아가미 새엽도 같은 물에 닿아 부어오릅니다. 다음 날 아침, {n}은 바닥에 배를 대고 움직이지 않습니다.']}});

/* 방생 법회 — the basin before the river (EV-OWB-08); a winter river kills tropical fish without a check */
fev([{id:'OWB-08',stage:'home',tier:'likely',own:['release'],once:1,w:6,
  p:'대야 하나에 수백 마리가 겹쳐 담겨 있습니다. 위쪽에서 목탁 소리가 이어집니다. 물이 미지근하고, 아래쪽으로 갈수록 숨이 차오릅니다. {n}은…',
  o:[
   {l:'다른 물고기들 사이를 밀고 수면 쪽으로 올라간다',chk:['p',45],ok:()=>fevBasin(1),no:{t:'{n}은 밀려 내려가며 다른 물고기의 비늘에 옆구리가 긁혔습니다.',c:'bad',fx:{h:-10},run:()=>q(null,null,()=>fevOut(fevBasin(0)))}},
   {l:'대야 가장자리 벽을 따라 물이 조금 움직이는 곳을 찾는다',chk:['w',40],ok:()=>fevBasin(1),no:()=>fevBasin(0)},
   {l:'바닥에 납작하게 가만히 있는다',ok:()=>fevBasin(isSp('cory','pleco')?.5:0)}
  ]}]);
function fevBasin(up){
  const g=fst().g+(isSp('@airbreather')&&up?30:0)+(up?10:0)-(season()==='summer'?10:0);
  if(R()>clamp(Math.pow(g/55,2),.05,.95)) return {end:'OWB-08-D'};
  if(isSp('@tropical')&&season()==='winter') return {t:'법회가 끝나고, 신도들이 대야를 강물 쪽으로 기울였습니다.',c:'bad',end:'OWB-08-W'};
  return {t:'법회가 끝나고, 신도들이 대야를 강물 쪽으로 기울였습니다.',c:'bad',run:()=>q(null,null,()=>fRelease())};
}
fevEnd({
 'OWB-08-D':{kind:'bad',cat:'방생',tier:'likely',fx:'f-bucket',pl:[[5,'방생용으로 팔려 감']],
   l:['위쪽 물고기들이 수면을 막고, 아래쪽 물의 산소가 먼저 바닥납니다.','{n}은 다른 물고기들 배 밑에서 아가미를 크게 벌립니다. 아가미 새엽을 지나가는 물에 산소가 거의 없습니다.','{n}은 위로 올라가려고 꼬리를 칩니다. 옆 물고기들의 비늘과 지느러미에 옆구리가 긁혀 비늘이 떨어집니다.','법회가 끝났을 때 대야 바닥에는 움직이지 않는 물고기들이 한 겹 깔려 있고, 신도들은 그 물도 함께 강에 붓습니다.']},
 'OWB-08-W':{kind:'bad',cat:'방생',tier:'fact',fx:'f-ice',pl:[[5,'겨울 강에 방생']],fact:'fRelease',
   l:['신도들이 염불을 외며 대야를 거꾸로 들었습니다. 강물은 4도였습니다.','열대의 물에서 온 {n}의 근육은 차가운 물에 닿자마자 굳습니다. 지느러미가 접히고, 아가미 뚜껑이 느려집니다.','{n}은 강바닥에 닿기 전에 움직이지 않았습니다.']}
});
