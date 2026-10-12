/* ---------- v0.10 catalogue: 01 ORIGIN (events/01_origin.md, EV-ORG-01 … 42) ----------
   Stage 0–1: birth, capture and the first sorting, before any owner.
   origin = the prologue's net (wild fish) or sieve (farm fish); trade = the box moment (holding, export, packing).
   Farm events of species that never pass a sieve (no FX cull: neon, cory, oscar, pleco, gar, clownloach, ghost,
   motoro, bichir, apisto) are also allowed at the box moment so they can happen at all.
   A wild fish that gets away at the net sets S.f.escape → the engine's 'free' ending (자유).
   At the sieve, S.f.odds.cull scales the engine's cull roll that follows (grade A < 1 < grade C). */

/* ---------- helpers ---------- */
const org_roll=(k,need)=>R()<clamp(Math.pow((fst()[k]||0)/need,2),.05,.95);
const org_odds=k=>{S.f.odds=S.f.odds||{};S.f.odds.cull=k};
const org_carry=id=>{if(!S.f.carrier)S.f.carrier=id};
const org_free=(t,more)=>Object.assign({t,c:'good',mem:'그물이 지나갔다. 그 물에 남았다.',run:()=>{S.f.escape=1}},more||{});
const org_wild=()=>fl('wild')===1;
const org_farm=()=>fl('wild')!==1;
const org_nearCap=k=>fst()[k]>=capOf(k)*.9;

/* =====================================================================
   A. 야생 채집 — 아마존·오리노코
   ===================================================================== */

/* EV-ORG-01 범람림의 수컷 — [출처: 은색 아로와나 수컷 포획·살해 후 입속 치어 채집 — Moreau & Coomes 2006/2007, 페루 아마존 아로와나 치어 무역 연구] */
fev([{id:'ORG-01',stage:'origin',tier:'fact',sp:['arowana'],when:org_wild,once:1,w:3,
  p:'밤입니다. 물에 잠긴 숲, 수면 바로 아래에 수컷 아로와나 한 마리가 떠 있습니다. 그 입안에 노른자 주머니를 단 치어 수십 마리가 있습니다. 물 위로 손전등 불빛이 다가옵니다. {n}은…',
  o:[
   {l:'아버지의 입 가장 안쪽, 아가미 쪽으로 파고든다',chk:['p',30],
    ok:{t:'어부가 수컷의 턱을 벌려 치어들을 양동이에 쏟았습니다. {n}은 가장 마지막에, 다른 치어들 위로 떨어졌습니다. 몸에 상처 하나 없었습니다.',c:'good',fx:{g:2}},
    no:[[3,{t:'쏟아지던 {n}이 어부의 바가지 가장자리에 부딪혔습니다. 노른자 주머니 표면이 긁혔습니다.',c:'bad',fx:{h:-8},set:{inj_skin:1},run:()=>org_carry('fungus')}],[1,{end:'ORG-01-D'}]]},
   {l:'입 밖으로 빠져나가 물풀 사이로 흩어진다',chk:['w',35],
    ok:org_free('{n}은 수컷의 입술 사이로 빠져나가 물풀 그늘로 내려갔습니다. 손전등 불빛은 수컷만 따라갔습니다.'),
    no:{t:'노른자 주머니가 무거워 {n}은 멀리 가지 못했습니다. 어부의 바가지가 물풀째 {n}을 떠 올렸습니다.',c:'bad',fx:{h:-4}}},
   {l:'다른 치어들 사이에 그대로 머문다',
    ok:[[9,{t:'{n}은 다른 치어들과 함께 양동이로 쏟아졌습니다. 수컷은 다시 물로 돌아가지 않았습니다.'}],[1,{end:'ORG-01-D'}]]}
  ]}]);

/* EV-ORG-02 노른자 주머니를 단 채 포장 — [출처: 아로와나 치어를 난황 흡수 전 단계로 수출하는 관행 — Moreau & Coomes + 수출업체 자료] */
const org_yolkHurt={t:'다른 치어의 몸이 {n}의 노른자 주머니를 눌렀습니다. 주머니 표면이 쓸려 하얗게 일어났습니다.',c:'bad',fx:{h:-10},set:{inj_skin:1},run:()=>org_carry('fungus')};
fev([{id:'ORG-02',stage:'trade',tier:'fact',sp:['arowana'],once:1,w:3,
  p:'치어 수십 마리가 같은 봉지에 담깁니다. 봉지 윗부분은 산소로 부풀어 있고 물은 손바닥 높이뿐입니다. 배에 달린 노른자 주머니가 서로 부딪힙니다. {n}은…',
  o:[
   {l:'봉지 벽을 따라 위쪽으로 몸을 세운다',chk:['g',30],
    ok:{t:'{n}은 봉지 벽에 몸을 기댄 채 상자가 닫힐 때까지 버텼습니다.',c:'good'},
    no:[[3,org_yolkHurt],[1,{end:'ORG-02-D'}]]},
   {l:'다른 치어 위로 올라탄다',chk:['p',35],
    ok:{t:'{n}은 다른 치어들 위에 자리를 잡았습니다. 아래에 깔린 치어 몇 마리의 노른자 주머니가 납작해졌습니다.',c:'good',fx:{p:1}},
    no:[[3,org_yolkHurt],[1,{end:'ORG-02-D'}]]},
   {l:'바닥에서 노른자 주머니를 깔고 가만히 있는다',
    ok:[[6,{t:'{n}은 봉지 바닥에서 움직이지 않았습니다. 상자가 닫혔습니다.'}],[3,org_yolkHurt],[1,{end:'ORG-02-D'}]]}
  ]}]);

/* EV-ORG-03 노른자가 다 줄기 전에 (첫 먹이) — catalogue gives no source → likely */
const org_thin={t:'{n}은 그날 아무것도 삼키지 못했습니다. 배가 안쪽으로 꺼지기 시작했습니다.',c:'bad',fx:{h:-10},set:{thin:1}};
fev([{id:'ORG-03',stage:'trade',tier:'likely',sp:['arowana'],once:1,w:2,
  p:'배의 노른자 주머니가 거의 사라졌습니다. 수조 위에서 냉동 장구벌레가 떨어집니다. 처음 보는 먹이입니다. {n}은…',
  o:[
   {l:'수면으로 솟구쳐 떨어지는 것을 문다',chk:['p',30],
    ok:{t:'{n}은 수면을 치고 올라 장구벌레를 낚아챘습니다. 그 뒤로 위에서 무언가 떨어지면 몸이 먼저 솟았습니다.',c:'good',fx:{p:2},add:{jumpy:1}},
    no:[[4,org_thin],[1,{end:'ORG-03-D'}]]},
   {l:'다른 치어가 문 먹이를 따라간다',chk:['w',30],
    ok:{t:'{n}은 다른 치어가 먹이를 무는 것을 보고 그대로 따라 물었습니다.',c:'good',fx:{w:2}},
    no:[[4,org_thin],[1,{end:'ORG-03-D'}]]},
   {l:'수조 바닥 쪽에서 기다린다',
    ok:()=>org_roll('g',25)?{t:'{n}은 하루를 굶고 버텼습니다. 다음 날, 바닥으로 가라앉은 장구벌레 하나를 물었습니다.',c:'good',fx:{g:1}}:R()<.25?{end:'ORG-03-D'}:org_thin}
  ]}]);

/* EV-ORG-04 아타바포의 밤 — [출처: 알텀 엔젤 야생 채집 지역(콜롬비아 이니리다·베네수엘라 아타바포)과 야간 채집 방식] */
fev([{id:'ORG-04',stage:'origin',tier:'fact',sp:['altum'],when:org_wild,once:1,w:3,
  p:'물에 잠긴 나뭇가지 사이입니다. 물은 짙은 차 색이고 바닥이 보이지 않습니다. 위에서 강한 불빛이 내려옵니다. 불빛 아래로 손뜰채가 천천히 들어옵니다. {n}은…',
  o:[
   {l:'나뭇가지 더 깊은 틈으로 몸을 옆으로 눕혀 들어간다',chk:['w',30],
    ok:[[1,org_free('{n}은 몸을 옆으로 눕혀 가지 틈 깊숙이 들어갔습니다. 뜰채는 가지에 걸려 들어오지 못했습니다.')],[1,{t:'그날 밤은 넘겼습니다. 이틀 뒤 밤, 불빛이 다시 왔고 {n}은 같은 가지 사이에서 떠 올려졌습니다.'}]],
    no:[[3,{t:'길게 뻗은 등지느러미가 갈라진 가지에 걸렸습니다. 뜰채가 {n}을 들어 올릴 때 지느러미 막이 찢어졌습니다.',c:'bad',fx:{h:-8,fin:.25},set:{inj_fin:1},run:()=>org_carry('fungus')}],[1,{end:'ORG-04-D'}]]},
   {l:'불빛 반대쪽으로 빠르게 헤엄친다',chk:['p',35],
    ok:org_free('{n}은 불빛 반대쪽 어둠으로 헤엄쳐 갔습니다.'),
    no:{t:'{n}은 몇 번 꼬리를 쳤지만 뜰채가 더 빨랐습니다.',c:'bad',fx:{h:-3}}},
   {l:'가지 사이에 멈춰 선다',
    ok:{t:'뜰채가 {n}을 감싸 들어 올렸습니다. 지느러미 하나 다치지 않았습니다.'}}
  ]}]);

/* EV-ORG-05 흑수에서 맑은 물로 — [출처: 흑수 어종 수질 급변 스트레스 · 알텀 야생 개체 수입 초기 폐사율이 높다는 자료] */
const org_05fail=()=>isSp('altum')?(R()<.3?{end:'ORG-05-D'}:{t:'{n}의 입가에 하얀 반점이 돋았습니다. 아가미 뚜껑이 빨라졌습니다.',c:'bad',fx:{h:-12},set:{inj_gill:1},run:()=>org_carry(pick(['columnaris','fungus']))})
  :isSp('cory')?{t:'{n}의 아가미가 따끔거렸지만 금세 가라앉았습니다. 같은 수조의 작은 물고기 몇 마리는 {n} 곁에서 아가미를 크게 벌렸습니다.',c:'sub',fx:{h:-3}}
  :{t:'{n}의 아가미 새엽이 한동안 부어 있었습니다.',c:'bad',fx:{h:-6},set:{inj_gill:1}};
fev([{id:'ORG-05',stage:'trade',tier:'fact',sp:['altum','apisto','cory'],when:org_wild,once:1,w:2,
  p:'흑수에서 올라온 통이 수출장 시멘트 수조에 쏟아집니다. 이곳 물은 맑고 비린 냄새가 덜합니다. 아가미가 따끔거립니다. 수조 안에는 이미 다른 강에서 온 물고기 수백 마리가 있습니다. {n}은…',
  o:[
   {l:'수조 바닥 그늘로 내려가 지느러미를 접는다',chk:['g',20],
    ok:{t:'{n}은 그늘에서 지느러미를 접고 며칠을 버텼습니다. 아가미의 따끔거림이 조금씩 가라앉았습니다.',c:'good',fx:{g:1}},no:org_05fail},
   {l:'먹이가 떨어지는 곳으로 간다',chk:['c',40],
    ok:{t:'작업자가 먹이를 받아먹는 {n}을 눈여겨보고 물이 덜 붐비는 수조로 옮겼습니다.',c:'good',fx:{c:1}},no:org_05fail},
   {l:'수면 근처에서 가만히 떠 있는다',
    ok:()=>R()<.5?{t:'{n}은 수면 근처에서 출하일을 기다렸습니다.'}:org_05fail()}
  ]}]);

/* EV-ORG-06 피아바 낚시꾼의 덫 — [출처: Project Piaba — 리우 네그루 관상어 채집(피아베이루) 방식·도구, 채집이 숲 보전 동기가 된다는 연구] */
const org_06caught=()=>isSp('cory')?{t:'{n}의 가슴 가시가 그물코에 걸렸습니다. 채집인이 그물째 털어 통에 넣었습니다.',c:'bad',fx:{h:-5,fin:.15},set:{inj_fin:1,spine_net:1}}
  :{t:'그물이 {n}을 낙엽째 떠 올렸습니다. 지느러미 끝이 그물코에 쓸렸습니다.',c:'bad',fx:{fin:.12},set:{inj_fin:1}};
fev([{id:'ORG-06',stage:'origin',tier:'fact',sp:['apisto','cory'],when:org_wild,once:1,w:2,
  p:'낙엽이 깔린 얕은 물가입니다. 사람이 막대로 낙엽을 휘저으며 다가옵니다. 반대편에는 작은 그물이 낙엽 바닥에 붙어 있습니다. {n}은…',
  o:[
   {l:'낙엽 더미 아래로 파고든다',chk:['w',30],
    ok:()=>org_nearCap('w')?org_free('{n}은 너무 깊이 숨었습니다. 채집인은 그날 그 물가를 포기하고 돌아갔습니다. 채집인이 오지 않은 해, 그 물가에는 소가 들어왔습니다.')
      :R()<.5?org_free('{n}은 낙엽 더미 아래에서 막대가 지나갈 때까지 움직이지 않았습니다.'):{t:'막대가 지나간 뒤 그물이 한 번 더 왔습니다. 두 번째에 {n}은 낙엽째 떠 올려졌습니다.'},
    no:org_06caught},
   {l:'물살을 따라 그물 옆쪽으로 빠져나간다',chk:['p',25],
    ok:org_free('{n}은 물살에 몸을 맡겨 그물 가장자리를 빠져나갔습니다.'),no:org_06caught},
   {l:'그 자리에서 몸을 낙엽 색으로 붙인다',
    ok:()=>org_roll('g',25)?{t:'그물은 {n}을 상처 없이 떠 올렸습니다.'}:org_06caught()}
  ]}]);

/* EV-ORG-07 건기의 모래톱 — [출처: 민물가오리(Potamotrygonidae) 포획 스트레스에 의한 조산·유산 기록] */
const org_premature=[[4,{t:'{n}은 어미의 몸 밖으로 일찍 밀려 나왔습니다. 배 아래에는 다 흡수되지 않은 난황이 매달려 있었습니다. 어부가 {n}을 어미와 같은 통에 담았습니다.',c:'bad',fx:{h:-10,g:-10},set:{premature:1}}],[1,{end:'ORG-07-D'}]];
fev([{id:'ORG-07',stage:'origin',tier:'fact',sp:['motoro'],when:org_wild,once:1,w:2,
  p:'물이 빠진 강가, 얕은 모래 바닥입니다. 어미의 몸이 갑자기 들어 올려집니다. 어미가 몸을 크게 뒤틉니다. 어미의 배 속이 한꺼번에 조여 옵니다. {n}은…',
  o:[
   {l:'어미 몸속에서 몸을 둥글게 만다',chk:['g',25],
    ok:{t:'{n}은 어미 몸속에서 버텼습니다. 며칠 뒤 수출장 수조에서 형제들과 함께 태어났습니다.',c:'good',fx:{g:2}},no:org_premature},
   {l:'몸을 펴서 밖으로 미끄러져 나간다',ok:org_premature},
   {l:'아무것도 하지 않는다',ok:()=>R()<.5?{t:'어미의 몸이 진정되었습니다. {n}은 며칠 뒤 수출장 수조에서 태어났습니다.'}:valOf(wpick(org_premature.map(z=>[z[1],z[0]])))}
  ]}]);

/* EV-ORG-08 펜치 — [출처: 관상용 민물가오리 독침 절단 관행 · 가오리 독침 탈락·재생] */
const org_deepCut=[[3,{t:'펜치가 가시 기부보다 깊이 들어갔습니다. 꼬리 위쪽 살이 함께 잘려 나갔습니다.',c:'bad',fx:{h:-15},set:{barb_cut:1,inj_skin:1},run:()=>org_carry('columnaris')}],[1,{end:'ORG-08-D'}]];
fev([{id:'ORG-08',stage:'trade',tier:'fact',sp:['motoro'],once:1,w:3,
  p:'작업자가 장갑 낀 손으로 {n}의 꼬리를 잡습니다. 꼬리 위에 뼈처럼 단단한 가시가 있습니다. 쇠붙이가 그 가시에 닿습니다. {n}은…',
  o:[
   {l:'몸판을 세게 쳐서 손에서 빠져나가려 한다',chk:['p',40],
    ok:{t:'{n}이 손에서 미끄러져 나갔습니다. 작업자는 혀를 차고 가시에 고무관을 씌웠습니다.',c:'good',set:{barb_cut:0,barb_tube:1}},no:org_deepCut},
   {l:'꼬리를 위로 휘둘러 손을 찌른다',chk:['p',50],
    ok:{t:'가시가 장갑을 뚫었습니다. 작업자가 비명을 지르고 손을 털었습니다. 다시 돌아온 펜치는 {n}의 가시를 거칠게 잘라 냈습니다. 그날 그 수출장의 다른 가오리들은 모두 깊게 잘렸습니다.',c:'bad',fx:{h:-8,p:1},set:{barb_cut:1,inj_skin:1}},
    no:org_deepCut},
   {l:'몸판을 바닥에 붙이고 움직이지 않는다',
    ok:{t:'펜치가 가시 기부만 잘라 냈습니다. 몇 달 뒤 같은 자리에서 새 가시가 자라기 시작할 것입니다.',set:{barb_cut:1}}}
  ]}]);

/* EV-ORG-09 아시아 양식 가오리 — 무늬 선별 — [출처: 동남아 민물가오리 양식·교잡 무늬 등급 거래] */
fev([{id:'ORG-09',stage:['origin','trade'],tier:'fact',sp:['motoro'],when:org_farm,once:1,w:2,
  p:'시멘트 수조 바닥에 같은 어미에게서 난 새끼 몇 마리가 붙어 있습니다. 위에서 사람이 들여다보며 한 마리씩 손전등으로 등을 비춥니다. 불빛이 {n}의 등 무늬에서 멈춥니다. {n}은…',
  o:[
   {l:'몸판을 펴고 무늬를 드러낸다',chk:['c',40],
    ok:{t:'손전등이 오래 머물렀습니다. {n}은 "A급" 상자로 옮겨졌습니다.',c:'good',set:{grade:'A'},run:()=>org_odds(.3)},
    no:{t:'"무늬가 흐리네." {n}은 대량 묶음 상자로 옮겨졌습니다.',c:'bad',set:{grade:'C'},run:()=>org_odds(1.5)}},
   {l:'모래를 몸판 위로 덮는다',chk:['g',30],
    ok:{t:'손전등은 모래에 덮인 {n}을 건너뛰었습니다. {n}은 중간 등급 상자로 들어갔습니다.',c:'sub',set:{grade:'B'}},
    no:{t:'작업자가 모래째 {n}을 떠서 대량 묶음 상자로 옮겼습니다.',c:'bad',set:{grade:'C'},run:()=>org_odds(1.5)}},
   {l:'수조 구석에 몸을 붙인다',ok:{t:'{n}은 하급 묶음으로 분류되었습니다.',c:'sub',set:{grade:'C'},run:()=>org_odds(1.5)}}
  ]}]);

/* EV-ORG-10 수마트라 우기의 그물 — [출처: 클라운 로치 야생 치어 포획(인도네시아 수마트라·칼리만탄 우기) · 눈 밑 가시가 그물에 걸리는 문제] */
const org_10spine=[[3,{t:'놀란 {n}이 눈 밑 가시를 세웠습니다. 가시가 그물코에 걸려, 작업자가 손가락으로 떼어 냈습니다. 눈 아래 피부가 찢어졌습니다.',c:'bad',fx:{h:-10},set:{inj_eye:1,inj_skin:1},run:()=>org_carry('ich')}],[1,{end:'ORG-10-D'}]];
fev([{id:'ORG-10',stage:'origin',tier:'fact',sp:['clownloach'],when:org_wild,once:1,w:3,
  p:'범람이 끝나고 물이 빠지는 강가입니다. 같은 크기의 줄무늬 치어 수백 마리가 얕은 물에 모여 있습니다. 물살 아래로 그물이 펼쳐집니다. {n}은…',
  o:[
   {l:'무리에서 떨어져 돌 틈으로 들어간다',chk:['w',35],
    ok:[[1,org_free('{n}은 돌 틈 깊숙이 들어가 그물이 걷힐 때까지 나오지 않았습니다.')],[1,{t:'그물은 그해 몇 번 더 왔습니다. 마지막 그물에 {n}이 들어 있었습니다.'}]],no:org_10spine},
   {l:'무리 한가운데로 파고든다',chk:['g',30],
    ok:{t:'{n}은 무리 한가운데에서 그물에 함께 떠 올려졌습니다. 다른 치어들 몸에 둘러싸여 가시가 그물에 닿지 않았습니다.',c:'good'},no:org_10spine},
   {l:'바닥에 옆으로 누운 채 움직이지 않는다',
    ok:()=>org_roll('w',25)?org_free('작업자가 옆으로 누운 {n}을 보고 "죽은 거네" 하며 물가에 털어 냈습니다. {n}은 물살을 따라 돌 틈으로 들어갔습니다.')
      :R()<.35?{end:'ORG-10-D'}:{t:'{n}은 "죽은 개체"로 분류되어 따로 담겼습니다. 다음 날 아침 통 안에서 움직이는 것을 본 작업자가 무리 통에 다시 쏟았습니다.',c:'bad',fx:{h:-10}}}
  ]}]);

/* EV-ORG-11 손가락으로 짜낸 알 — [출처: 클라운 로치 인공 번식 성공(인도네시아, 호르몬 주사 + 복부 압박 채란) · 블랙 고스트 인도네시아 양식 · 폴립테루스 호르몬 유도 번식] */
const org_11hatch=()=>{
  if(isSp('ghost')&&R()<.4) return {t:'{n}은 껍질을 깨고 나왔습니다. 같은 통의 치어들이 서로의 꼬리를 물기 시작했고, {n}의 꼬리 끝도 조금 뜯겼습니다.',c:'bad',fx:{fin:.12},set:{inj_fin:1}};
  if(isSp('bichir')) return {t:'{n}은 껍질을 깨고 나왔습니다. 머리 양옆에 깃털 같은 바깥 아가미가 달려 있었습니다.',c:'good',set:{ext_gill:1}};
  return {t:'{n}은 껍질을 깨고 나왔습니다. 같은 통의 치어 수천 마리가 같은 먹이를 두고 몰려들었습니다.',c:'good'};
};
fev([{id:'ORG-11',stage:['origin','trade'],tier:'fact',sp:['clownloach','ghost','bichir'],when:org_farm,once:1,w:2,
  log:'어미의 배가 사람 손바닥 위에 있었습니다. 엄지가 배를 아래로 쓸어내렸고, 그릇에 떨어진 알 가운데 하나가 {n}이었습니다.',
  p:'부화 통 안, 알껍질이 얇아집니다. 옆의 알 몇 개가 하얗게 변해 있습니다. {n}은…',
  o:[
   {l:'꼬리로 알껍질을 계속 친다',chk:['p',20],ok:org_11hatch,no:[[4,{t:'{n}은 한참 늦게 껍질을 깼습니다. 몸이 다른 치어보다 작았습니다.',c:'bad',fx:{h:-6}}],[1,{end:'ORG-11-D'}]]},
   {l:'껍질 안에서 움직임을 멈추고 기다린다',chk:['g',20],ok:org_11hatch,no:[[4,{t:'{n}은 한참 늦게 껍질을 깼습니다. 몸이 다른 치어보다 작았습니다.',c:'bad',fx:{h:-6}}],[1,{end:'ORG-11-D'}]]},
   {l:'알 속에서 그대로 있는다',ok:()=>R()<.8?org_11hatch():{end:'ORG-11-D'}}
  ]}]);

/* EV-ORG-12 수출장의 하얀 점 — [출처: 클라운 로치 백점병 감수성 · 말라카이트 그린/포르말린 등 예방 약욕의 비늘 작은 어종 독성] */
const org_slime=()=>isSp('@scaleless')?{slime_loss:1,prophylaxis:1}:{prophylaxis:1};
fev([{id:'ORG-12',stage:'trade',tier:'fact',sp:['clownloach','ghost','cory','motoro'],once:1,w:()=>isSp('clownloach')?3:1,
  p:'수조 물이 갑자기 파랗게 변합니다. 냄새가 쓰고 피부가 따끔거립니다. 무리 중 몇 마리의 몸에 소금 알갱이 같은 하얀 점이 박혀 있습니다. {n}은…',
  o:[
   {l:'무리와 함께 수조를 빙빙 돈다',chk:['g',30],
    ok:()=>({t:'{n}은 무리와 함께 돌며 파란 물을 버텼습니다.',c:'good',fx:{h:-5},set:org_slime()}),
    no:()=>isSp('clownloach')&&R()<.3?{end:'ORG-12-D'}:{t:'며칠 뒤 {n}의 지느러미에도 하얀 점이 돋았습니다. 피부가 거칠게 일어났습니다.',c:'bad',fx:{h:-12},set:org_slime(),run:()=>org_carry('ich')}},
   {l:'바닥 모래에 몸을 비빈다',
    ok:()=>({t:'{n}은 모래에 몸을 비볐습니다. 하얀 점 몇 개가 떨어졌고, 그 자리의 피부도 함께 벗겨졌습니다.',c:'sub',fx:{h:-8},set:Object.assign({inj_skin:1},org_slime())})},
   {l:'옆으로 누워 가만히 있는다',chk:['g',25],
    ok:()=>({t:'{n}은 옆으로 누운 채 약이 빠질 때까지 버텼습니다.',c:'sub',fx:{h:-6},set:org_slime()}),
    no:[[1,{end:'ORG-12-D'}],[2,{t:'작업자가 옆으로 누운 {n}을 "죽은 것"으로 건져 냈다가, 아가미가 움직이는 걸 보고 다시 넣었습니다.',c:'bad',fx:{h:-10},set:{prophylaxis:1}}]]}
  ]}]);

/* =====================================================================
   B. 야생 채집 — 아시아·인도·아프리카
   ===================================================================== */

/* EV-ORG-16 공기를 삼킨 복어 — the endure roll, used by ORG-13 too.
   [출처: 복어를 물 밖에서 부풀게 하면 공기를 삼켜 배출하지 못할 수 있다는 사육 자료] */
function org_air(){
  if(org_roll('g',40)) return {t:'몇 시간 뒤, {n}은 삼킨 공기를 조금씩 뱉어 내고 가라앉았습니다.',c:'sub',fx:{h:-5,g:-2}};
  return R()<.35?{end:'ORG-16-D'}:{t:'{n}은 한나절 배를 위로 한 채 떠 있다가 겨우 가라앉았습니다. 그 뒤로도 몸이 자꾸 한쪽으로 기울었습니다.',c:'bad',fx:{h:-15},set:{swimb:1}};
}

/* EV-ORG-13 케랄라 수로의 족대 — [출처: IUCN 레드리스트 Carinotetraodon travancoricus 취약(VU) 지정 사유 — 관상어 남획 · 케랄라 채집 지역] */
fev([{id:'ORG-13',stage:'origin',tier:'fact',sp:['peapuffer'],when:org_wild,once:1,w:3,
  p:'수초가 빽빽한 수로입니다. 사람이 수초 아래로 족대를 밀어 넣고 발로 수초를 찹니다. 수초째 그물이 들어 올려집니다. {n}은…',
  o:[
   {l:'그물코 사이로 몸을 비틀어 빠져나간다',chk:['w',35],
    ok:[[1,org_free('{n}은 그물코 사이로 몸을 비틀어 수로 바닥으로 떨어졌습니다.')],[1,{t:'{n}은 한 번 빠져나갔습니다. 다음 날 같은 수로에 족대가 다시 들어왔습니다.'}]],
    no:{t:'{n}은 수초째 들어 올려졌습니다. 족대 안에는 같은 종 수백 마리가 함께 있었습니다.',c:'bad',set:{crowd:1}}},
   {l:'수초 뿌리에 몸을 붙이고 버틴다',chk:['p',20],
    ok:org_free('{n}은 수초 뿌리에 붙어 끝까지 떨어지지 않았습니다.'),no:{t:'뿌리째 들린 수초와 함께 {n}도 올라왔습니다.',c:'bad'}},
   {l:'몸을 부풀린다',ok:()=>org_air()}
  ]}]);

/* EV-ORG-14 한 통에 수천 마리 — catalogue gives no source → likely */
const org_bitten=()=>isSp('fig8')?{t:'옆 개체가 {n}의 지느러미를 물어뜯었습니다. 몸이 커서 지느러미만 잃었습니다.',c:'bad',fx:{fin:.2},set:{inj_fin:1}}
  :R()<.25?{end:'ORG-14-D'}:R()<.5?{t:'옆 개체의 부리가 {n}의 눈가를 스쳤습니다. 각막에 하얀 흠이 남았습니다.',c:'bad',fx:{h:-10},set:{inj_eye:1}}
  :{t:'옆 개체가 {n}의 꼬리지느러미를 한 조각 뜯어 갔습니다.',c:'bad',fx:{fin:.2,h:-4},set:{inj_fin:1}};
fev([{id:'ORG-14',stage:'trade',tier:'likely',sp:['peapuffer','fig8'],when:org_wild,once:1,w:()=>isSp('peapuffer')?3:1,
  p:'큰 통 안에 같은 종이 빽빽합니다. 바로 옆에 있는 것의 눈이 반짝입니다. 지느러미가 흔들리는 것이 보입니다. 입 안의 이빨이 근질거립니다. {n}은…',
  o:[
   {l:'옆의 지느러미를 먼저 문다',chk:['w',30],
    ok:{t:'{n}은 먼저 물고 재빨리 빠졌습니다. 그 뒤로 흔들리는 지느러미만 보면 입이 먼저 나갔습니다.',c:'sub',fx:{w:2},add:{nippy:1}},no:org_bitten},
   {l:'통 가장자리로 가서 등을 벽에 붙인다',chk:['g',30],
    ok:{t:'{n}은 통 벽에 등을 붙이고 앞만 보았습니다. 뒤에서 물려 오는 것은 없었습니다.',c:'good'},no:org_bitten},
   {l:'통 바닥에 배를 대고 가만히 있는다',ok:()=>R()<.5?{t:'다른 개체들은 위쪽에서 서로를 물었습니다. {n}은 바닥에서 출하일까지 버텼습니다.'}:org_bitten()}
  ]}]);

/* EV-ORG-15 하구의 팔자복어 — [출처: 팔자복어(Tetraodon biocellatus) 서식지 염분 범위와 "민물 복어" 판매 관행] */
const org_15ok={t:'{n}은 소금기 없는 물에서 버텼습니다. 피부가 조금 바랬습니다.',c:'sub',fx:{g:-5},set:{salt:0}};
const org_15no={t:'{n}의 피부 점막이 회색으로 들떴습니다. 소금기 없는 물이 몸으로 계속 스며들었습니다.',c:'bad',fx:{h:-10},set:{salt:0,slime_loss:1}};
fev([{id:'ORG-15',stage:'origin',tier:'fact',sp:['fig8'],when:org_wild,once:1,w:3,
  p:'짠물과 민물이 섞이는 하구입니다. 그물에 걸려 올라와 담수 수조에 쏟아집니다. 물맛이 다릅니다. 피부가 부풀고 무겁습니다. {n}은…',
  o:[
   {l:'수조 바닥에서 몸을 낮추고 숨을 고른다',chk:['g',35],ok:org_15ok,no:org_15no},
   {l:'먹이를 받으러 수면으로 간다',chk:['c',40],
    ok:{t:'작업자가 "잘 먹는 놈"이라며 {n}을 먼저 출하 상자에 넣었습니다. 민물 수조에 있던 날이 짧았습니다.',c:'good',set:{salt:0}},no:org_15no},
   {l:'구석에 가만히 있는다',ok:()=>org_roll('g',25)?org_15ok:org_15no}
  ]}]);

/* EV-ORG-16 공기를 삼킨 복어 (see org_air above) */
fev([{id:'ORG-16',stage:['origin','trade'],tier:'fact',sp:['@puffer'],once:1,w:1.5,
  p:'그물이 물 밖으로 들어 올려집니다. 몸 주변에 물 대신 공기가 있습니다. 배 근육이 저절로 조여 옵니다. {n}은…',
  o:[
   {l:'입을 꾹 다물고 몸을 웅크린다',chk:['w',35],
    ok:{t:'{n}은 입을 다문 채 물로 돌아갔습니다. 몸은 부풀지 않았습니다.',c:'good',fx:{w:1}},no:()=>org_air()},
   {l:'몸을 크게 부풀린다',ok:()=>org_air()},
   {l:'그물 바닥에 몸을 붙인다',chk:['g',25],
    ok:{t:'{n}은 그물 바닥에 붙어 숨을 참았습니다. 다시 물에 닿을 때까지 버텼습니다.',c:'good'},no:()=>org_air()}
  ]}]);

/* EV-ORG-17 이탄 습지의 물 — [출처: 야생 베타(입 부화종) 이탄 습지 서식지 pH · 이탄 습지 배수·화재로 인한 서식지 소실] */
const org_17caught=t=>()=>R()<.15?{end:'ORG-17-D'}:{t:t+(org_roll('g',30)?' {n}은 입에 문 알을 끝까지 놓지 않았습니다.':' 놀란 {n}이 입에 문 알을 뱉어 냈습니다.'),c:'bad',set:{inj_gill:1}};
fev([{id:'ORG-17',stage:'origin',tier:'fact',sp:['wildbetta'],when:org_wild,once:1,w:3,
  p:'검은 물, 썩은 잎이 두껍게 깔린 웅덩이입니다. 물이 시고 차갑습니다. {n}의 입 안에는 알이 있습니다. 위에서 손뜰채가 잎을 헤치고 내려옵니다. {n}은…',
  o:[
   {l:'입을 다문 채 잎 더미 아래로 파고든다',chk:['w',35],
    ok:org_free('{n}은 잎 더미 아래에서 뜰채가 떠날 때까지 기다렸습니다. 며칠 뒤 입 안의 알에서 새끼들이 나왔습니다.',{fx:{g:2}}),
    no:org_17caught('뜰채가 잎째 {n}을 떠 올렸습니다.')},
   {l:'웅덩이 밖 다른 물길로 뛰어오른다',chk:['p',35],
    ok:org_free('{n}은 웅덩이 가장자리를 넘어 옆 물길로 떨어졌습니다.'),
    no:()=>R()<.15?{end:'ORG-17-D'}:{t:'{n}은 젖은 잎 위에 떨어졌습니다. 채집인이 손으로 집어 통에 넣었습니다. 옆구리 비늘이 잎에 쓸렸습니다.',c:'bad',fx:{h:-6},set:{inj_skin:1}}},
   {l:'입을 다문 채 그 자리에 멈춘다',ok:org_17caught('뜰채가 {n}을 떠 올렸습니다.')}
  ]}]);

/* EV-ORG-18 불타는 이탄 숲 — [출처: 동남아 이탄 습지 화재(2015 인도네시아 등)와 이탄 습지 어류 서식지 소실] */
const org_18fail=()=>isSp('wildbetta')?{t:'물이 손가락 한 마디 깊이까지 줄었습니다. {n}은 수면 공기를 마시며 버텼고, 비가 오기 직전 웅덩이를 뒤지던 채집인의 손에 잡혔습니다.',c:'bad',fx:{h:-15}}
  :R()<.5?{end:'ORG-18-D'}:{t:'{n}은 줄어드는 물에서 다른 물고기들 틈에 끼어 버텼습니다. 웅덩이를 퍼 가던 사람들의 양동이에 함께 담겼습니다.',c:'bad',fx:{h:-15}};
fev([{id:'ORG-18',stage:'origin',tier:'fact',sp:['wildbetta','clownloach','fig8'],when:org_wild,once:1,w:()=>isSp('wildbetta')?2:.8,
  p:'물이 평소보다 얕고 미지근합니다. 수면 위 공기에서 탄 냄새가 납니다. 위에서 재가 떨어져 수면을 덮습니다. {n}은…',
  o:[
   {l:'더 깊은 물을 찾아 물길을 따라 내려간다',chk:['g',35],
    ok:{t:'{n}은 물길을 따라 한참 내려갔습니다. 아래 물길에는 그물을 든 채집인들이 기다리고 있었습니다.',c:'sub',fx:{g:1}},no:org_18fail},
   {l:'가장 깊은 웅덩이 바닥으로 내려간다',chk:['w',30],
    ok:org_free('{n}은 웅덩이 바닥에서 비를 기다렸습니다. 그해 첫 비가 왔을 때, 웅덩이에 남은 물고기는 많지 않았습니다.'),no:org_18fail},
   {l:'잎 아래 가만히 있는다',
    ok:()=>R()<(isSp('wildbetta')?.6:.3)?{t:'재가 섞인 물에서 {n}은 며칠을 버텼습니다. 채집인이 웅덩이 바닥을 손으로 훑어 {n}을 꺼냈습니다.',c:'sub',fx:{h:-8}}:org_18fail()}
  ]}]);

/* EV-ORG-19 브라마푸트라의 논 — [출처: 인도 북동부(아삼) 야생 관상어 채집과 Channa bleheri 수출 경로] */
fev([{id:'ORG-19',stage:'origin',tier:'fact',sp:['channa'],when:org_wild,once:1,w:3,
  p:'논 가장자리 얕은 물입니다. 사람이 물을 막고 퍼내기 시작합니다. 물이 줄어들수록 진흙 냄새가 진해집니다. {n}은…',
  o:[
   {l:'진흙 위로 몸을 비틀어 옆 수로로 기어간다',chk:['p',40],
    ok:org_free('{n}은 진흙 위를 몸으로 밀고 옆 수로까지 건너갔습니다.',{add:{escapey:1}}),
    no:{t:'진흙 위를 기던 {n}이 사람 손에 잡혔습니다. 손톱이 옆구리 비늘을 긁었습니다.',c:'bad',fx:{h:-6},set:{inj_skin:1}}},
   {l:'진흙 속으로 파고든다',chk:['g',35],
    ok:org_free('{n}은 진흙 속에서 공기 한 모금으로 버텼습니다. 사람들은 다른 논으로 옮겨 갔습니다.'),
    no:[[3,{t:'삽날이 {n}의 등을 스쳤습니다. 등에 비스듬한 상처가 남았습니다.',c:'bad',fx:{h:-12},set:{inj_skin:1,scar:1}}],[1,{end:'ORG-19-D'}]]},
   {l:'남은 물웅덩이에 가만히 있는다',ok:{t:'물이 다 빠지자 사람의 손이 웅덩이에서 {n}을 건져 올렸습니다.'}}
  ]}]);

/* EV-ORG-20 뚜껑 없는 수집 통 — catalogue gives no source → likely */
fev([{id:'ORG-20',stage:'trade',tier:'likely',sp:['channa','bichir'],when:org_wild,once:1,w:2,
  p:'플라스틱 통에 같은 종 수십 마리가 담겨 있습니다. 물은 얕고 수면 위가 열려 있습니다. 옆의 것이 몸을 비틀자 비늘끼리 긁힙니다. {n}은…',
  o:[
   {l:'통 가장자리를 넘어 바닥으로 뛰어오른다',chk:['p',40],
    ok:()=>org_roll('g',40)?{t:'{n}은 시멘트 바닥을 기어 배수구 앞까지 갔습니다. 아침에 작업자가 {n}을 주워 통에 다시 던졌습니다. 몸의 점막이 바닥에 쓸려 벗겨져 있었습니다.',c:'bad',fx:{h:-12},set:{slime_loss:1},add:{escapey:1}}:{end:'ORG-20-D'},
    no:{t:'{n}은 통 가장자리에 부딪혀 물속으로 떨어졌습니다.',c:'bad',fx:{h:-5}}},
   {l:'옆의 것을 문다',chk:['p',35],
    ok:{t:'{n}이 옆 개체의 옆구리를 물었습니다. 그 뒤로 {n} 주변에는 자리가 생겼습니다.',c:'sub',fx:{p:2}},
    no:{t:'상대가 먼저 {n}의 꼬리를 물었습니다.',c:'bad',fx:{h:-6,fin:.12},set:{inj_fin:1}}},
   {l:'통 바닥에 몸을 낮춘다',ok:{t:'{n}은 통 바닥에서 다른 몸들 밑에 깔린 채 수면 공기를 마시며 버텼습니다.'}}
  ]}]);

/* EV-ORG-21 라고스로 가는 길 — [출처: 서아프리카(나이지리아) 야생 관상어 수출 경로 · Polypterus senegalus 야생 채집] */
fev([{id:'ORG-21',stage:'origin',tier:'fact',sp:['bichir'],when:org_wild,once:1,w:3,
  p:'우기가 끝나 범람원의 물이 빠지고 있습니다. 풀이 무성한 얕은 물에 그물이 끌려옵니다. 바닥 진흙이 일어나 앞이 보이지 않습니다. {n}은…',
  o:[
   {l:'풀뿌리 사이로 몸을 밀어 넣는다',chk:['p',35],
    ok:org_free('{n}은 풀뿌리 사이에 몸을 끼웠습니다. 그물은 풀만 뜯어 갔습니다.'),
    no:{t:'그물이 풀뿌리째 {n}을 끌어냈습니다. 가슴지느러미가 그물코에 걸려 찢어졌습니다.',c:'bad',fx:{fin:.2},set:{inj_fin:1}}},
   {l:'수면으로 올라가 공기를 마시고 다시 바닥으로 간다',chk:['g',30],
    ok:{t:'{n}은 공기를 한 모금 마시고 바닥에 붙었습니다. 그물에 들어갔지만 몸에 상처는 없었습니다.',c:'good'},
    no:{t:'수면에서 내려오던 {n}의 가슴지느러미가 그물에 걸렸습니다.',c:'bad',fx:{fin:.2},set:{inj_fin:1}}},
   {l:'진흙 바닥에 몸을 붙인다',ok:{t:'그물이 진흙째 {n}을 떠 올렸습니다.'}}
  ]}]);

/* =====================================================================
   C. 수출장 공통
   ===================================================================== */

/* EV-ORG-22 출하 이틀 전 — overlaps the prologue's fasting line → w .5
   [출처: 관상어 출하 전 절식(배설물·암모니아 감소 목적) 관행] */
const org_pack=()=>isSp('arowana','gar')?' {n}의 몸은 봉지보다 길었습니다. 몸을 굽힌 채 봉지에 담겼습니다.'
  :isSp('@puffer')?' 서로 물기 때문에 {n}은 몇 마리씩만 따로 담겼습니다.'
  :isSp('@small','@schooling')?' 봉지 하나에 수십 마리가 함께 담겼습니다.'
  :isSp('@airbreather')?' 봉지에는 물이 아주 조금만 담겼습니다.':'';
fev([{id:'ORG-22',stage:'trade',tier:'fact',once:1,w:.5,
  p:'이틀째 먹이가 떨어지지 않습니다. 수조 물이 맑아지고 배가 가벼워집니다. 그물이 내려와 몇 마리씩 떠 갑니다. {n}은…',
  o:[
   {l:'그물이 올 때마다 그물 반대쪽으로 피한다',chk:['p',25],
    ok:()=>({t:'{n}은 이번 출하를 피했습니다. 다음 출하까지 먹이 없는 날이 이틀 더 이어졌습니다.',c:'sub',fx:{h:-6},add:{thin:1},
      run:()=>{if(isSp('gar')&&!org_roll('g',30)){setFl('inj_snout',1);addLog(T('봉지에 몸을 굽혀 넣을 때 {n}의 긴 주둥이 끝이 봉지 모서리에 눌렸습니다.'),'bad')}}}),
    no:()=>({t:'그물이 {n}을 떠 갔습니다.'+org_pack()})},
   {l:'사람 쪽으로 다가와 먹이를 조른다',chk:['c',40],
    ok:()=>({t:'작업자가 조르는 {n}을 먼저 떠서 좋은 거래처 상자에 넣었습니다.'+org_pack(),c:'good',add:{grade_up:1}}),
    no:()=>({t:'작업자는 {n}을 보지 않았습니다.'+org_pack()})},
   {l:'바닥에서 가만히 있는다',ok:()=>({t:'그물이 {n}을 떠 갔습니다.'+org_pack(),set:isSp('gar')&&!org_roll('g',30)?{inj_snout:1}:{}})}
  ]}]);

/* EV-ORG-23 그물에 걸린 가시 — [출처: 코리도라스 가슴 가시가 그물에 걸리는 문제와 컵 이동 권장] */
const org_23shake={t:'작업자가 그물째 흔들어 {n}을 떼어 냈습니다. 가시 둘레 지느러미가 찢어졌습니다.',c:'bad',fx:{fin:.15,h:-4},set:{inj_fin:1}};
fev([{id:'ORG-23',stage:['origin','trade'],tier:'fact',sp:['cory','pleco'],once:1,w:()=>isSp('cory')?2.5:1.2,
  p:'그물이 바닥 모래를 쓸며 다가옵니다. 몸이 그물에 닿습니다. 가슴과 등의 가시가 저절로 곧게 섭니다. {n}은…',
  o:[
   {l:'가시를 접고 몸을 뒤로 뺀다',chk:['w',35],
    ok:{t:'{n}은 가시를 접고 그물에서 몸을 뺐습니다. 작업자가 컵으로 {n}을 떠 옮겼습니다.',c:'good',fx:{w:1}},no:org_23shake},
   {l:'몸을 세게 비틀어 그물에서 빠져나간다',chk:['p',30],
    ok:{t:'{n}은 몸을 비틀어 그물에서 빠져나왔습니다.',c:'good',fx:{p:1}},
    no:()=>isSp('pleco')?(R()<.2?{end:'ORG-23-D'}:{t:'큰 몸이 그물에 감긴 채 한참 들려 있었습니다. 가시 기부가 꺾였습니다.',c:'bad',fx:{h:-10,fin:.15},set:{inj_fin:1}})
      :(R()<.3?{end:'ORG-23-D'}:{t:'비틀수록 가시가 그물코를 더 깊이 감았습니다. 작업자가 가시를 잡아 비틀어 떼어 냈습니다.',c:'bad',fx:{h:-10,fin:.2},set:{inj_fin:1}})},
   {l:'가시를 세운 채 가만히 있는다',ok:[[5,org_23shake],[1,{end:'ORG-23-D'}]]}
  ]}]);

/* EV-ORG-24 예방 약욕 — no dodge (the drug is in all the water)
   [출처: 수출입 단계 예방 약욕(포르말린·말라카이트 그린) 관행 · 블랙 고스트 등 비늘 없는/작은 종의 약품 민감성] */
function org_bath(){
  const k=isSp('clownloach','cory')?1.35:1;
  if(R()<clamp(Math.pow(fst().g/30,2)*k,.05,.95)) return {t:'{n}은 약이 빠질 때까지 버텼습니다. 몸을 감싼 점막이 얇아졌습니다.',c:'sub',fx:{h:-10},set:{slime_loss:1,prophylaxis:1}};
  return R()<.4?{end:'ORG-24-D'}:{t:'{n}의 점막이 회색으로 들떴습니다. 아가미 새엽이 부어 아가미 뚜껑이 빨라졌습니다. 다음 날, 약이 빠진 물에서 {n}은 아직 움직였습니다.',c:'bad',fx:{h:-25},set:{slime_loss:1,inj_gill:1,prophylaxis:1}};
}
fev([{id:'ORG-24',stage:'trade',tier:'fact',sp:['ghost','motoro','clownloach','cory'],once:1,w:()=>isSp('ghost')?3:1,
  p:()=>'수조 물에서 코를 찌르는 냄새가 납니다. 피부가 화끈거리고 몸을 감싼 점막이 끈적하게 일어납니다.'+(isSp('ghost')?' 몸 주위에 퍼져 있던 전기장 안의 감각이 흐려집니다.':'')+' {n}은…',
  o:[
   {l:'유리 쪽으로 나와 몸을 계속 흔든다',chk:['c',40],
    ok:{t:'몸을 흔드는 {n}을 본 작업자가 수조 물을 절반 뺐습니다.',c:'good',fx:{g:-5,h:-5},set:{prophylaxis:1}},no:()=>org_bath()},
   {l:'수조 바닥 관 안으로 들어간다',chk:['g',30],
    ok:{t:'{n}은 관 안에서 약이 옅어질 때까지 버텼습니다.',c:'sub',fx:{h:-8},set:{slime_loss:1,prophylaxis:1}},no:()=>org_bath()},
   {l:'수조 구석에서 가만히 있는다',ok:()=>org_bath()}
  ]}]);

/* EV-ORG-25 야간 뿌리 더미 — [출처: 블랙 고스트 야생 서식(뿌리·틈) · 인도네시아 양식 개체와 야생 개체 공급 비중] */
fev([{id:'ORG-25',stage:'origin',tier:'fact',sp:['ghost'],when:org_wild,once:1,w:3,
  p:'밤입니다. 강가 나무뿌리 아래 좁은 틈에서 몸을 쉬고 있습니다. 주변 전기장 안으로 큰 물체 하나가 들어옵니다. 뿌리 더미가 흔들리고 밖에 그물이 펼쳐집니다. {n}은…',
  o:[
   {l:'그물 가장자리를 더듬어 빈 쪽으로 빠져나간다',chk:['w',40],
    ok:org_free('{n}은 그물 가장자리의 빈틈을 찾아 어둠 속으로 빠져나갔습니다.',{fx:{w:2}}),
    no:{t:'빈 쪽이라고 느낀 곳에 두 번째 그물이 있었습니다.',c:'bad',fx:{h:-4}}},
   {l:'뿌리 더 깊은 곳으로 뒷걸음질한다',chk:['p',30],
    ok:{t:'{n}은 뿌리 깊은 곳까지 물러났습니다. 사람들은 뿌리 더미째 그물로 들어 올렸지만, {n}의 몸은 다치지 않았습니다.',c:'sub'},
    no:{t:'뒷걸음질하던 {n}의 옆구리가 뿌리에 긁혔습니다. 뿌리 더미가 통째로 들어 올려졌습니다.',c:'bad',fx:{h:-8},set:{inj_skin:1}}},
   {l:'틈 안에서 움직이지 않는다',
    ok:[[7,{t:'뿌리 더미가 통째로 들어 올려졌습니다. 작업자가 뿌리를 털자 {n}이 그물 위로 떨어졌습니다.'}],[3,{t:'뿌리째 들어 올려질 때 {n}의 몸이 뿌리 사이에 쓸렸습니다.',c:'bad',fx:{h:-8},set:{inj_skin:1}}]]}
  ]}]);

/* =====================================================================
   D. 양식장 — 선별·도태·호르몬
   ===================================================================== */

/* EV-ORG-26 첫 선별: 토비 — [출처: 비단잉어 치어 단계 "토비"(동족 포식으로 빨리 자란 개체) 제거 관행] */
fev([{id:'ORG-26',stage:'origin',tier:'fact',sp:['koi'],when:org_farm,once:1,w:2,
  p:'같은 날 부화한 치어 수만 마리가 한 연못에 있습니다. 몇 마리는 이미 다른 치어보다 두세 배 큽니다. 그 큰 것들의 입가에 작은 치어의 꼬리가 걸려 있습니다. 위에서 고운 그물이 내려옵니다. {n}은…',
  o:[
   {l:'가장 큰 무리를 따라다니며 먹이를 먼저 문다',chk:['p',30],
    ok:()=>R()<.5?{end:'ORG-26-D'}:{t:'{n}은 먹이를 먼저 물며 빨리 자랐습니다. 그물은 {n}보다 조금 더 큰 것들만 떠 갔습니다.',c:'good',fx:{p:3}},
    no:{t:'큰 치어들이 {n}을 밀쳐 냈습니다. {n}은 무리 가장자리로 밀려났습니다.',c:'sub'}},
   {l:'수초 가장자리로 피한다',chk:['w',30],
    ok:{t:'{n}은 수초 사이에서 큰 치어들의 입을 피했습니다.',c:'good',fx:{w:1}},
    no:[[2,{t:'큰 치어 하나가 {n}의 꼬리를 물었다가 놓쳤습니다. 꼬리지느러미 끝이 뜯겨 나갔습니다.',c:'bad',fx:{fin:.2,h:-6},set:{inj_fin:1}}],[1,{end:'ORG-26-D2'}]]},
   {l:'무리 속에 그대로 섞인다',ok:[[8,{t:'{n}은 수만 마리 속에 섞여 그물을 피했습니다.'}],[1,{end:'ORG-26-D2'}]]}
  ]}]);

/* EV-ORG-27 무늬 선별 (B-4 심화) — [출처: 비단잉어 선별(센베츠) 단계와 도태 비율, 도태어 처리 방식] */
const org_27C=[[3,{t:'{n}은 "C급" 그릇으로 옮겨졌습니다.',c:'bad',set:{grade:'C'},run:()=>org_odds(1.4)}],[1,{end:'ORG-27-D'}]];
fev([{id:'ORG-27',stage:'origin',tier:'fact',sp:['koi'],when:org_farm,once:1,w:3,
  p:'흰 대야에 수백 마리가 쏟아집니다. 사람의 손가락이 물속을 빠르게 지나가며 한 마리씩 다른 그릇으로 옮깁니다. 손이 {n}의 바로 위에서 멈춥니다. {n}은…',
  o:[
   {l:'몸을 수평으로 펴고 등 무늬를 위로 드러낸다',chk:['c',45],
    ok:{t:'손이 {n}을 따로 놓인 작은 그릇으로 옮겼습니다. "이건 남겨서 키워 보자."',c:'good',set:{grade:'A'},run:()=>org_odds(.2)},no:org_27C},
   {l:'손가락 쪽으로 다가가 입을 댄다',chk:['c',35],
    ok:{t:'"얘는 사람을 잘 따르네." {n}은 무늬 등급은 낮았지만 체험 연못과 식당에 넘길 그릇에 들어갔습니다.',c:'sub',set:{grade:'B'},add:{tame:1},run:()=>org_odds(.6)},no:org_27C},
   {l:'대야 가장자리에 붙어 움직이지 않는다',ok:org_27C}
  ]}]);

/* EV-ORG-28 가을 진흙 연못 수확 — [출처: 비단잉어 가을 수확(이케아게) · KHV 검사·전량 처분 방역] */
const org_mud=[[2,{t:'{n}은 진흙 속에서 다음 물이 들어올 때까지 버텼습니다. 아가미에 진흙이 끼어 한동안 숨이 거칠었습니다.',c:'bad',fx:{h:-15}}],[1,{end:'ORG-28-D'}]];
const org_khv=()=>isSp('koi')&&R()<.04?{end:'ORG-28-K'}:null;
fev([{id:'ORG-28',stage:'origin',tier:'fact',sp:['koi','comet'],when:org_farm,need:{season:'autumn'},once:1,w:2,
  p:'연못 물이 빠지기 시작합니다. 남은 물이 진흙과 섞여 탁해집니다. 긴 그물이 연못 끝에서 끝까지 끌려옵니다. 수천 마리가 한쪽으로 몰립니다. {n}은…',
  o:[
   {l:'그물 아래 진흙 바닥으로 파고든다',chk:['g',35],
    ok:()=>org_khv()||{t:'그물이 {n} 위를 지나갔습니다. {n}은 진흙 속에서 버티다 다시 물이 차오른 연못에서 한 해를 더 보냈습니다.',c:'good',fx:{g:2}},no:org_mud},
   {l:'무리 가장자리에서 그물 위로 뛰어넘는다',chk:['p',40],
    ok:()=>org_khv()||(org_roll('g',35)?{t:'{n}은 그물을 넘어 진흙 위에 떨어졌습니다. 몸을 튕겨 남은 물웅덩이로 들어갔습니다.',c:'good',fx:{p:2}}:valOf(wpick(org_mud.map(z=>[z[1],z[0]])))),
    no:{t:'{n}은 그물 가장자리에 걸려 무리 속으로 떨어졌습니다. 옆구리 비늘 몇 장이 떨어졌습니다.',c:'bad',fx:{h:-6},set:{scar:1}}},
   {l:'무리 속에서 같이 밀려간다',
    ok:()=>org_khv()||(R()<.4?{t:'무리에 밀리며 {n}의 옆구리 비늘이 몇 장 떨어졌습니다.',c:'bad',fx:{h:-5},set:{scar:1}}:{t:'{n}은 무리와 함께 수확 통으로 옮겨졌습니다.'+(isSp('koi')?' 통 옆에는 검사를 기다리는 격리 수조가 줄지어 있었습니다.':'')})}
  ]}]);

/* EV-ORG-29 홑꼬리 — tail shape is fixed at birth; no stat changes it.
   [출처: 팬시 금붕어 치어 선별(홑꼬리·기형 도태) 관행] */
const org_single=()=>{if(!fl('tail'))setFl('tail',R()<.3?'single':'double');return fl('tail')==='single'};
fev([{id:'ORG-29',stage:'origin',tier:'fact',sp:['oranda','ryukin'],when:org_farm,once:1,w:3,
  p:'얕은 대야에 치어들이 담깁니다. 사람이 위에서 하나씩 꼬리를 봅니다. 위에서 보면 꼬리가 두 갈래로 펼쳐진 것과 한 갈래인 것이 갈립니다. {n}은…',
  o:[
   {l:'꼬리를 활짝 펴고 천천히 헤엄친다',chk:['c',35],
    ok:()=>org_single()?{end:'ORG-29-D'}:{t:'두 갈래로 펼쳐진 꼬리가 불빛 아래에서 반짝였습니다. {n}은 "A급" 대야로 옮겨졌습니다.',c:'good',set:{grade:'A'},run:()=>org_odds(.3)},
    no:()=>org_single()?{end:'ORG-29-D'}:{t:'꼬리는 두 갈래였지만 펼쳐지지 않았습니다. {n}은 "C급" 대야로 옮겨졌습니다.',c:'sub',set:{grade:'C'},run:()=>org_odds(1.3)}},
   {l:'대야 바닥에서 빠르게 맴돈다',
    ok:()=>org_single()?(R()<.5?{end:'ORG-29-D'}:{t:'{n}이 너무 빨리 돌아 사람은 꼬리를 보지 못했습니다. 다음 대야로 미뤄졌고, 다음 대야에서는 아무도 꼬리를 다시 보지 않았습니다.',c:'good'})
      :{t:'{n}이 너무 빨리 돌아 사람은 꼬리를 보지 못했습니다. {n}은 다음 대야로 미뤄졌습니다.',c:'sub'}},
   {l:'움직이지 않고 가라앉아 있는다',
    ok:()=>org_single()?{end:'ORG-29-D'}:{t:'사람은 가라앉은 {n}의 꼬리를 한 번 보고 지나갔습니다. 두 갈래였습니다.',set:{grade:'B'}}}
  ]}]);

/* EV-ORG-30 먹이 붕어 — [출처: 먹이용 금붕어(피더 골드피시) 대량 양식·무게 단위 판매] */
const org_feeder={t:'{n}은 "먹이용" 통에 남았습니다. 통째로 무게를 달아 팔리는 물고기였습니다.',c:'bad',set:{grade:'feeder',feeder:1},run:()=>org_odds(1.2)};
fev([{id:'ORG-30',stage:'origin',tier:'fact',sp:['comet','guppy'],when:org_farm,once:1,w:2,
  p:'연못에서 퍼 올린 물고기가 무게를 다는 통에 쏟아집니다. 같은 크기, 같은 색이 수천 마리입니다. 통 위에 "먹이용"이라는 글씨가 붙습니다. {n}은…',
  o:[
   {l:'통 위쪽으로 솟구쳐 다른 통으로 넘어간다',chk:['p',40],
    ok:{t:'{n}이 통을 넘어 옆 통으로 떨어졌습니다. 그 통에는 "관상용"이라고 적혀 있었습니다.',c:'good',fx:{p:2},set:{grade:'B'}},no:org_feeder},
   {l:'사람 손가락 쪽으로 다가간다',chk:['c',40],
    ok:{t:'작업자가 손가락을 따라오는 {n}을 보고 웃으며 따로 작은 통에 옮겨 두었습니다.',c:'good',set:{grade:'B'},add:{tame:1}},no:org_feeder},
   {l:'무리 속에 섞인다',ok:org_feeder}
  ]}]);

/* EV-ORG-31 굽은 주둥이 — farm only, packing is the trade moment
   [출처: 앨리게이터 가아 아시아 양식·치어 동족 포식 기록 · 가아 주둥이 손상] */
const org_snout=t=>()=>org_roll('g',30)?{t,c:'good'}:{t:t+' 봉지가 몸보다 짧아 주둥이 끝이 봉지 모서리에 눌린 채 실렸습니다.',c:'bad',fx:{h:-6},set:{inj_snout:1}};
const org_garBit=[[3,{t:'더 큰 치어가 {n}의 꼬리를 물었다가 놓았습니다. 꼬리지느러미에 이빨 자국이 줄지어 남았습니다.',c:'bad',fx:{fin:.15,h:-6},set:{inj_fin:1}}],[1,{end:'ORG-31-D'}]];
fev([{id:'ORG-31',stage:['trade','origin'],tier:'fact',sp:['gar'],when:org_farm,once:1,w:3,
  p:'같은 날 태어난 치어들이 수면 바로 아래에 막대처럼 떠 있습니다. 서로의 길이가 다릅니다. 옆의 작은 치어가 입 앞에 있습니다. 위에서 크기별로 나누는 체가 내려옵니다. {n}은…',
  o:[
   {l:'옆의 작은 치어를 문다',chk:['p',30],
    ok:()=>Object.assign(org_snout('{n}은 옆의 치어를 삼켰습니다. 그 주에 {n}은 누구보다 빨리 자랐습니다.')(),{fx:{p:3},add:{growfast:1}}),no:org_garBit},
   {l:'수면 가장자리로 피한다',chk:['w',30],ok:org_snout('{n}은 가장자리로 비켜 체가 지나갈 때까지 기다렸습니다.'),no:org_garBit},
   {l:'그 자리에 떠 있는다',ok:()=>R()<.2?valOf(wpick(org_garBit.map(z=>[z[1],z[0]]))):org_snout('체가 {n}을 떠서 크기가 비슷한 무리에 넣었습니다.')()}
  ]}]);

/* EV-ORG-32 혈통의 값 — inbreeding table by species
   [출처: 오란다 육혹의 시야 차단·감염 · 유금 등 둥근 체형 금붕어의 부레 질환 경향] */
function org_inbred(lv){
  setFl('inbred',lv);
  if(lv<2) return {t:'같은 배의 형제들보다 {n}의 몸은 조금 더 튼튼했습니다.',c:'sub'};
  if(isSp('oranda')) return R()<.2?{end:'ORG-32-D'}:{t:'{n}의 머리 혹이 형제들보다 빨리 자랐습니다. 혹 가장자리가 눈 위로 내려오기 시작했습니다.',c:'bad',set:{inj_eye:1,deformity:'wen'}};
  if(isSp('ryukin')) return R()<.2?{end:'ORG-32-D2'}:{t:'{n}의 몸통은 형제들보다 짧고 둥글었습니다. 먹이를 먹고 나면 꼬리 쪽이 떠올랐습니다.',c:'bad',set:{swimb:1}};
  return R()<.2?{end:'ORG-36-D'}:{t:'자라면서 {n}의 척추가 조금 옆으로 휘었습니다.',c:'bad',set:{deformity:'spine'}};
}
fev([{id:'ORG-32',stage:'origin',tier:'fact',sp:['oranda','ryukin','guppy'],when:()=>org_farm()&&fl('grade')!=='C'&&fl('grade')!=='feeder',once:1,w:2,
  p:()=>'같은 부모의 자식들끼리 다시 짝이 지어집니다. {n}은 그 세 번째 대에서 태어났습니다. '+(isSp('oranda')?'머리의 혹이 같은 배의 다른 형제보다 큽니다.':isSp('ryukin')?'몸통이 같은 배의 다른 형제보다 짧습니다.':'꼬리 색이 같은 배의 다른 형제보다 진합니다.')+' {n}은…',
  o:[
   {l:'바닥 먹이를 찾아 열심히 헤엄친다',chk:['g',30],ok:()=>org_inbred(1),no:()=>org_inbred(2)},
   {l:'사람 쪽을 향해 머리를 든다',chk:['c',45],
    ok:()=>Object.assign(org_inbred(R()<.5?1:2),{run:()=>org_odds(.4)}),no:()=>org_inbred(2)},
   {l:'수조 중간에 가만히 떠 있는다',ok:()=>org_inbred(R()<.4?1:2)}
  ]}]);

/* EV-ORG-33 베타 농장의 연못에서 병으로 — [출처: 태국 베타 농장(흙 연못 성장 → 수컷 병 분리) 방식] */
const org_33tail=t=>()=>fem()?{t:t+' 암컷인 {n}은 병에 들어가지 않았습니다. 큰 통에 수십 마리씩 담겨 "암컷 혼합"으로 팔렸습니다.',c:'sub',set:{grade:'C',sex:'f'}}:{t,c:'good',set:{sex:'m'}};
const org_33fight=[[3,{t:'다른 수컷이 {n}의 꼬리지느러미를 물고 흔들었습니다. 지느러미 막이 기조를 따라 찢어졌습니다.',c:'bad',fx:{fin:.25,h:-6},set:{inj_fin:1,grade:'C'}}],[1,{end:'ORG-33-D'}]];
fev([{id:'ORG-33',stage:'origin',tier:'fact',sp:['betta'],when:org_farm,once:1,w:3,
  p:'흙 연못에서 형제 수백 마리가 함께 자랐습니다. 이제 수컷들끼리 지느러미를 펴고 서로를 쫓기 시작합니다. 사람의 손이 한 마리씩 떠서 작은 병에 넣습니다. 병은 줄지어 놓이고, 병 사이에 종이가 끼워집니다. {n}은…',
  o:[
   {l:'지느러미를 모두 펴고 옆 수컷을 쫓는다',chk:['p',35],
    ok:()=>Object.assign(org_33tail('{n}은 쫓아온 상대를 먼저 물고 물러났습니다. 지느러미는 무사했습니다.')(),{fx:{p:2}}),no:org_33fight},
   {l:'형제들 아래로 숨는다',chk:['w',30],
    ok:org_33tail('{n}은 형제들 아래에 숨어 가장 늦게 병에 들어갔습니다. 지느러미는 상하지 않았습니다.'),
    no:{t:'숨어 있던 {n}을 다른 수컷이 찾아냈습니다. 지느러미 끝이 조금 뜯겼습니다.',c:'bad',fx:{fin:.1},set:{inj_fin:1}}},
   {l:'수면 근처에서 공기를 마시며 가만히 있는다',
    ok:()=>org_roll('g',25)?org_33tail('{n}은 수면 근처에서 싸움을 비켜 갔습니다.')():valOf(wpick(org_33fight.map(z=>[z[1],z[0]])))}
  ]}]);

/* EV-ORG-34 거울 대신 이웃 — [출처: 베타 농장 병 사이 칸막이와 "플레어링" 촬영 관행] */
fev([{id:'ORG-34',stage:'origin',tier:'fact',sp:['betta'],when:()=>org_farm()&&!fem(),once:1,w:2,
  p:'병 사이에 끼워진 종이가 걷힙니다. 바로 옆 병 안에 다른 수컷이 있습니다. 상대가 아가미 뚜껑을 펼칩니다. {n}은…',
  o:[
   {l:'지느러미와 아가미 뚜껑을 한껏 펼친다',chk:['c',40],
    ok:()=>org_nearCap('c')?{t:'사진이 너무 잘 나와 {n}은 수출 카탈로그 표지에 실렸습니다. 표지 사진의 {n}과 같은 물고기는 그해 몇만 마리가 팔렸습니다. 같은 사진을 보고 산 물고기들이었습니다.',c:'good',fx:{c:2,g:-3},set:{grade:'A',viral:1},run:()=>org_odds(.2)}
      :{t:'{n}의 지느러미가 병 안 가득 펼쳐졌습니다. 작업자가 카메라를 들었습니다.',c:'good',fx:{c:2,g:-3},add:{flare:1,grade_up:1},run:()=>org_odds(.5)},
    no:{t:'{n}이 상대를 향해 돌진하다 병 벽에 부딪혔습니다.',c:'bad',fx:{fin:.06,h:-3}}},
   {l:'병 바닥으로 내려가 몸을 돌린다',chk:['g',30],
    ok:{t:'{n}은 병 바닥에서 상대를 등지고 버텼습니다. 사진은 찍히지 않았습니다.',c:'sub'},
    no:{t:'상대가 보이지 않아도 병 너머의 움직임이 계속 신경을 긁었습니다.',c:'bad',fx:{st:.1}}},
   {l:'상대를 보지 않고 수면에서 공기를 마신다',ok:{t:'{n}은 수면에서 공기를 마셨습니다. 작업자는 {n}의 병을 낮은 등급 줄에 놓았습니다.',c:'sub',run:()=>org_odds(1.2)}}
  ]}]);

/* EV-ORG-35 반달 꼬리 혈통 — [출처: 하프문·로즈테일 베타의 과도한 지느러미 분지와 지느러미 파열(블로아웃)] */
const org_blow=[[3,{t:'여러 번 갈라진 기조 끝이 무게를 못 이기고 세로로 갈라졌습니다.',c:'bad',fx:{fin:.3,h:-6},set:{inj_fin:1},run:()=>org_carry('finrot')}],[1,{end:'ORG-35-D'}]];
fev([{id:'ORG-35',stage:'origin',tier:'fact',sp:['betta'],when:org_farm,once:1,w:2,
  p:'{n}의 꼬리지느러미는 펼치면 반원을 넘습니다. 기조가 여러 번 갈라져 지느러미가 무겁습니다. 헤엄칠 때마다 지느러미가 물을 끌고 갑니다. {n}은…',
  o:[
   {l:'수면 가까이에서 지느러미를 펴고 천천히 머문다',chk:['c',45],
    ok:{t:'사람이 {n}을 "종어"로 골랐습니다. {n}의 새끼들은 {n}의 형제들과 다시 짝지어질 것이었습니다.',c:'sub',add:{inbred:1},run:()=>org_odds(.2)},
    no:{t:'{n}은 판매용 병 줄로 갔습니다.',c:'sub'}},
   {l:'지느러미를 접고 빠르게 헤엄친다',chk:['p',35],
    ok:{t:'{n}의 기조는 무게를 버텼습니다.',c:'good',fx:{p:1}},no:org_blow},
   {l:'바닥 잎 위에 누워 쉰다',ok:()=>org_roll('g',25)?{t:'{n}은 잎 위에서 쉬었습니다. 지느러미는 무사했고, {n}은 판매용 병 줄로 갔습니다.',c:'sub'}:valOf(wpick(org_blow.map(z=>[z[1],z[0]])))}
  ]}]);

/* EV-ORG-36 구피 농장의 굽은 등 — [출처: 팬시 구피 근친 교배에 따른 척추 기형·번식력 저하 · 난태생어 어미의 치어 포식] */
const org_36after=()=>{
  if(isSp('platy')) return {t:'{n}은 형제들 사이에서 튼튼하게 자랐습니다. 색으로만 등급이 매겨졌습니다.',c:'sub'};
  if(R()<.25) return R()<.35?{end:'ORG-36-D'}:{t:'자라면서 {n}의 척추가 조금 옆으로 휘었습니다.',c:'bad',set:{deformity:'spine',inbred:1}};
  return fem()?{t:'암컷인 {n}은 꼬리 색이 수컷만 못했습니다. 대량 판매 통으로 갔습니다.',c:'sub',set:{grade:'feeder',sex:'f'}}:{t:'{n}의 꼬리 색이 진하게 올랐습니다.',c:'good',set:{grade:'A',sex:'m'},run:()=>org_odds(.4)};
};
const org_mom=()=>R()<.15?{end:'ORG-36-D2'}:org_36after();
fev([{id:'ORG-36',stage:'origin',tier:'fact',sp:['guppy','platy'],when:org_farm,once:1,w:()=>isSp('guppy')?2.5:1.2,
  p:'어미의 배에서 막 태어났습니다. 바로 옆에서 어미의 입이 다가옵니다. 수조에는 같은 꼬리 색의 형제들만 있습니다. {n}은…',
  o:[
   {l:'수초 덩어리 안으로 들어간다',chk:['w',25],ok:org_36after,no:org_mom},
   {l:'수면 가장자리로 빠르게 올라간다',chk:['p',15],ok:org_36after,no:org_mom},
   {l:'바닥 구석에서 움직이지 않는다',ok:()=>R()<.25?{end:'ORG-36-D2'}:org_36after()}
  ]}]);

/* EV-ORG-37 노천 양식장의 새 — [출처: 노천 관상어 양식장의 조류 포식 피해와 그물망 설치] */
const org_bird=()=>R()<.3?{end:'ORG-37-D'}:{t:'부리가 수면을 뚫고 들어왔다가 {n}의 옆구리를 스치고 빠져나갔습니다. 비늘 몇 장이 벗겨졌습니다.',c:'bad',fx:{h:-8}};
fev([{id:'ORG-37',stage:['origin','trade'],tier:'fact',sp:['platy','guppy','neon','cory'],when:org_farm,need:{pond_net:0},once:1,w:1.5,
  p:'연못 수면이 햇빛에 반짝입니다. 수면 위로 큰 그림자가 지나갑니다. 연못 가장자리 얕은 물에 다리가 긴 새가 서 있습니다. {n}은…',
  o:[
   {l:'연못 가운데 깊은 쪽으로 내려간다',chk:['p',20],ok:{t:'{n}은 깊은 물로 내려가 새의 부리가 닿지 않는 곳에 있었습니다.',c:'good',fx:{g:1}},no:org_bird},
   {l:'수초 덩어리 밑으로 들어간다',chk:['w',30],ok:{t:'{n}은 수초 밑에서 그림자가 떠날 때까지 기다렸습니다.',c:'good',fx:{g:1}},no:org_bird},
   {l:'무리 속에 섞여 가만히 있는다',ok:()=>R()<(isSp('@schooling')?.75:.6)?{t:'새의 부리는 무리 가장자리의 다른 한 마리를 물고 올라갔습니다.',c:'sub',fx:{g:1}}:org_bird()}
  ]}]);

/* EV-ORG-38 네온병이 나온 수조 — [출처: 네온병(Pleistophora hyphessobryconis) — 치료제가 없어 감염 개체·수조 처분이 권장된다는 자료 · 네온 양식 대부분이 아시아산] */
const org_neonFail=[[1,{end:'ORG-38-D'}],[2,{t:'작업자는 수조를 처분하지 않고 그대로 출하하기로 했습니다. {n}은 병든 무리와 같은 물에서 봉지에 담겼습니다.',c:'bad',set:{neon_dz:1},run:()=>org_carry('neond')}]];
fev([{id:'ORG-38',stage:['origin','trade'],tier:'fact',sp:['neon'],when:org_farm,once:1,w:3,
  p:'수조 안 같은 무리 중 몇 마리의 파란 줄이 끊겨 하얗게 바랬습니다. 그 몇 마리는 무리에서 떨어져 비틀거리며 헤엄칩니다. 사람이 수조 앞에 오래 서 있습니다. {n}은…',
  o:[
   {l:'무리 한가운데에서 무리와 함께 헤엄친다',chk:['g',25],
    ok:{t:'{n}은 무리 한가운데에서 비틀거리는 것들과 몸이 닿지 않게 헤엄쳤습니다.',c:'good',fx:{g:1}},no:org_neonFail},
   {l:'수조 앞 유리로 나와 사람 쪽을 본다',chk:['c',45],
    ok:{t:'작업자가 유리 앞의 {n}을 보고 몇 마리를 다른 수조로 옮겼습니다. {n}도 그중 하나였습니다.',c:'good'},no:org_neonFail},
   {l:'수초 뒤에 가만히 있는다',ok:org_neonFail}
  ]}]);

/* EV-ORG-39 크기 선별 (오스카 양식장) — [출처: 시클리드 치어 크기 선별(그레이딩) — 동족 포식 방지 목적] */
const org_small=()=>org_roll('w',25)?{t:'큰 치어가 {n}을 몰았지만 {n}은 그늘 속 돌 틈으로 빠져나갔습니다.',c:'sub'}
  :R()<.3?{end:'ORG-39-D'}:{t:'큰 치어가 {n}의 등지느러미를 물어뜯었습니다. 기조 몇 개가 떨어져 나갔습니다.',c:'bad',fx:{fin:.2,h:-6},set:{inj_fin:1}};
fev([{id:'ORG-39',stage:['origin','trade'],tier:'fact',sp:['oscar','apisto'],when:org_farm,once:1,w:()=>isSp('oscar')?3:1,
  p:'같은 배에서 난 치어 수천 마리가 연못에 있습니다. 먹이가 떨어지면 큰 것들이 먼저 닿습니다. 큰 치어 하나가 작은 치어를 몰고 다닙니다. 체가 내려와 크기별로 나눕니다. {n}은…',
  o:[
   {l:'먹이가 떨어지는 한가운데로 밀고 들어간다',chk:['p',30],
    ok:{t:'{n}은 먹이를 먼저 물며 큰 쪽 체에 걸렸습니다.',c:'good',fx:{p:3},set:{grade:'A'}},no:()=>org_small()},
   {l:'사람 그림자가 오면 먼저 다가간다',chk:['c',35],
    ok:{t:'작업자가 그림자만 비쳐도 다가오는 {n}을 보고 "사람 따르는 놈"이라고 적었습니다.',c:'good',fx:{c:2},add:{begs:1}},no:()=>org_small()},
   {l:'연못 가장자리 그늘에 있는다',ok:()=>org_small()}
  ]}]);

/* EV-ORG-40 수온이 정한 성비 — sex is decided by the breeding water, not by any choice
   [출처: 아피스토그라마 성비가 수온·pH에 따라 달라짐 — Römer & Beisenherz 1996] */
const org_apSex=()=>fem()?{t:' 암컷인 {n}은 수컷 한 마리와 "짝"으로 묶여 팔리거나, 남으면 대량 묶음으로 갈 것이었습니다.',set:{sex:'f',grade:'C'}}:{t:' 수컷인 {n}의 지느러미에 색이 오르기 시작했습니다.',set:{sex:'m',grade:'A'}};
fev([{id:'ORG-40',stage:['origin','trade'],tier:'fact',sp:['apisto'],when:org_farm,once:1,w:3,
  p:'굴 입구에서 어미가 치어 무리를 지킵니다. 물이 평소보다 따뜻합니다. 사람이 굴을 들어 올려 치어를 다른 수조로 옮깁니다. {n}은…',
  o:[
   {l:'어미 곁에 끝까지 붙어 있는다',chk:['c',30],
    ok:()=>{const s=org_apSex();return {t:'{n}은 어미 곁에 붙어 있다가 가장 마지막에 떠 옮겨졌습니다.'+s.t,c:'sub',set:s.set}},
    no:()=>{const s=org_apSex();return {t:'어미가 {n}을 굴 밖으로 밀어냈습니다.'+s.t,c:'sub',set:s.set}}},
   {l:'무리를 떠나 수초 속을 혼자 탐색한다',chk:['w',35],
    ok:()=>{const s=org_apSex();return org_nearCap('w')?{t:'{n}은 혼자 탐색하다 옆 수조로 넘어가 빈 굴을 차지했습니다. 번식장 주인은 그 굴에서 나온 치어를 "신품종"이라고 팔았습니다. 그냥 다른 수조 암컷이었습니다.',c:'good',fx:{w:2},set:s.set}
      :{t:'{n}은 수초 사이를 혼자 돌아다녔습니다.'+s.t,c:'sub',fx:{w:2},set:s.set}},
    no:()=>{const s=org_apSex();return {t:'{n}은 수초 사이에서 길을 잃었다가 뜰채에 떠 올려졌습니다.'+s.t,c:'sub',set:s.set}}},
   {l:'무리 안에 가만히 있는다',ok:()=>{const s=org_apSex();return {t:'{n}은 무리와 함께 옮겨졌습니다.'+s.t,c:'sub',set:s.set}}}
  ]}]);

/* EV-ORG-41 플로리다 토굴 연못 — [출처: 플로리다 Pterygoplichthys 흙 연못 양식(둑 굴 번식, 연못 물 빼서 수확)] */
fev([{id:'ORG-41',stage:['origin','trade'],tier:'fact',sp:['pleco'],when:org_farm,once:1,w:3,
  p:'{n}은 연못 둑에 뚫린 굴 안에서 태어났습니다. 굴 밖에서 물이 점점 낮아집니다. 굴 입구로 햇빛과 공기가 들어옵니다. {n}은…',
  o:[
   {l:'굴 밖으로 나와 남은 물을 따라간다',chk:['p',35],
    ok:{t:'{n}은 남은 물을 따라 내려가 수확 그물에 들어갔습니다. 상처는 없었습니다.',c:'sub',fx:{p:1}},
    no:{t:'{n}은 진흙 위에서 한참 미끄러지다 그물에 들어갔습니다. 배 쪽이 쓸렸습니다.',c:'bad',fx:{h:-6},set:{inj_skin:1}}},
   {l:'굴 가장 안쪽 젖은 진흙에 몸을 붙인다',chk:['g',40],
    ok:{t:'{n}은 공기를 삼키며 굴 안에서 버텼습니다. 다시 물이 찼을 때 {n}은 이 연못의 어미가 될 몇 마리 중 하나로 남았다가, 다음 수확에 실렸습니다.',c:'good',fx:{g:2}},
    no:[[2,{t:'물이 다시 들어오기 직전에 작업자가 굴을 파헤쳐 {n}을 꺼냈습니다. 몸은 말라 있었습니다.',c:'bad',fx:{h:-15},set:{inj_skin:1}}],[1,{end:'ORG-41-D'}]]},
   {l:'굴 입구에서 가만히 있는다',ok:{t:'작업자가 삽으로 굴을 파서 {n}을 꺼냈습니다. 갑옷 판 사이가 긁혔습니다.',c:'bad',fx:{h:-5},set:{inj_skin:1}}}
  ]}]);

/* EV-ORG-42 호르몬 유도 번식 — 바깥 아가미 — [출처: 폴립테루스 유생의 바깥 아가미 · 사육 하 유생 동족 포식/물기] */
const org_gillBit=[[3,{t:'옆 치어가 {n}의 바깥 아가미 한쪽을 뜯어 갔습니다. {n}은 그 뒤로 다른 치어보다 더디게 자랐습니다.',c:'bad',fx:{h:-10},set:{inj_gill:1,stunted:1}}],[1,{end:'ORG-42-D'}]];
fev([{id:'ORG-42',stage:['origin','trade'],tier:'fact',sp:['bichir'],when:org_farm,once:1,w:3,
  p:'부화한 지 며칠 된 치어입니다. 머리 양옆에 깃털 모양의 바깥 아가미가 달려 있습니다. 같은 통의 다른 치어가 그 아가미를 향해 입을 벌립니다. {n}은…',
  o:[
   {l:'먼저 옆 치어의 아가미를 문다',chk:['p',25],
    ok:{t:'{n}이 먼저 물었습니다. 옆 치어는 바깥 아가미 한쪽을 잃고 물러났습니다.',c:'sub',fx:{p:2}},no:org_gillBit},
   {l:'통 구석 그늘로 기어간다',chk:['w',30],
    ok:{t:'{n}은 구석 그늘에 몸을 숨기고 바깥 아가미가 줄어들 때까지 버텼습니다.',c:'good',fx:{w:1}},no:org_gillBit},
   {l:'바닥에서 가만히 있는다',ok:()=>R()<.4?valOf(wpick(org_gillBit.map(z=>[z[1],z[0]]))):{t:'옆 치어들은 서로를 물었습니다. {n}은 바닥에서 버텼습니다.'}}
  ]}]);

/* =====================================================================
   endings
   ===================================================================== */
fevEnd({
 'ORG-01-D':{kind:'bad',cat:'채집',tier:'fact',fx:'f-bucket',fact:'fArowana',
   l:['어부가 수컷의 아래턱을 손가락으로 벌립니다. 치어들이 양동이로 쏟아집니다. 수컷은 그 자리에서 머리를 맞고 배가 갈립니다.',
      '{n}은 양동이 바닥에서 난황낭을 아래로 늘어뜨린 채 몸을 세우려 합니다.',
      '다른 치어들의 몸이 그 위로 겹쳐 쌓입니다. 아래쪽 치어들의 아가미 새엽에는 산소가 닿지 않습니다.',
      '새벽에 양동이를 비울 때, {n}은 아래층에서 아가미 뚜껑을 벌린 채 움직이지 않습니다.']},
 'ORG-02-D':{kind:'bad',cat:'포장',tier:'fact',fx:'f-bag',fact:'fArowana',
   l:['다른 치어의 몸이 계속 {n}의 난황낭을 누릅니다. 난황낭 표면의 얇은 막이 찢어집니다.',
      '노른자가 물에 풀려 나와 봉지 안이 뿌옇게 흐려집니다. 찢어진 막 가장자리에 물곰팡이 포자가 붙어 하얀 균사를 뻗습니다.',
      '{n}은 영양을 잃은 채 봉지 벽을 따라 계속 헤엄칩니다. 균사가 배에서 아가미 쪽으로 번집니다.',
      '도착한 봉지를 열었을 때, {n}의 배에는 하얀 균사 덩어리만 남아 있습니다.']},
 'ORG-03-D':{kind:'bad',cat:'굶주림',tier:'likely',fx:'f-thin',fact:'fWild',
   l:['노른자를 다 쓴 {n}의 배가 안쪽으로 꺼집니다. {n}은 수면 바로 아래에서 입을 벌렸다 닫습니다.',
      '근육 속 글리코겐과 지방이 먼저 줄어듭니다. 등 근육이 얇아지면서 척추 윤곽이 비늘 위로 드러납니다.',
      '머리가 몸보다 커 보이기 시작합니다.',
      '어느 아침 {n}은 바닥으로 기울어진 채 가슴지느러미만 움직입니다.']},
 'ORG-04-D':{kind:'bad',cat:'채집',tier:'fact',fx:'f-net',fact:'fAltum',
   l:['{n}은 가지 사이로 몸을 밀어 넣습니다. 길게 뻗은 등지느러미 기조가 갈라진 가지에 끼입니다.',
      '뜰채가 몸통을 감싸고 들어 올립니다. 기조 사이 막이 세로로 찢어지고 기조 두 개가 부러집니다.',
      '통 안에서 {n}은 찢어진 지느러미를 세운 채 균형을 잡으려 몸을 기울입니다.',
      '찢어진 막 가장자리가 하얗게 일어나고, 사흘째 솜털 모양 균사가 덮습니다. 균사가 지느러미 기부를 지나 몸통 상피로 번집니다.']},
 'ORG-05-D':{kind:'bad',cat:'유통',tier:'fact',fx:'f-bucket',fact:'fAltum',
   l:['산성의 흑수에서 중성에 가까운 물로 옮겨지자, 아가미 새엽 상피가 점액을 과하게 냅니다. 점액이 새엽 사이를 메웁니다.',
      '이틀째 입가와 등에 하얀 반점이 생기고, 그 둘레가 노랗게 짓무릅니다. 짓무른 자리의 상피가 떨어져 나가고 아래 근육이 드러납니다.',
      '{n}은 수면 근처로 올라와 아가미 뚜껑을 빠르게 움직입니다. 몸을 곧게 세우지 못하고 옆으로 기웁니다.',
      '출하일 아침, 작업자가 그물로 {n}을 떠서 따로 둔 양동이에 담습니다.']},
 'ORG-07-D':{kind:'bad',cat:'조산',tier:'fact',fx:'f-net',fact:'민물가오리는 잡힐 때의 충격으로 배 속 새끼를 일찍 낳아 버리기도 합니다.',
   l:['어미가 그물 안에서 몸을 뒤틀 때, {n}이 총배설강 밖으로 밀려 나옵니다. {n}의 배 아래에는 다 흡수되지 않은 난황이 매달려 있습니다.',
      '몸판은 아직 얇고 부드럽습니다. {n}은 그물 바닥 모래 위에서 몸판 가장자리를 물결처럼 움직이며 물 쪽으로 기어갑니다. 모래알이 얇은 피부를 긁어 상피가 벗겨집니다.',
      '어부가 어미만 통에 담고 그물을 텁니다. {n}은 물가에서 한 뼘 떨어진 모래 위에 남습니다.',
      '해가 올라오자 몸판 가장자리부터 마르며 말려 올라갑니다.']},
 'ORG-08-D':{kind:'bad',cat:'독침 절단',tier:'fact',fx:'f-bottom',fact:'관상용 민물가오리는 다루는 사람이 쏘이지 않도록 꼬리 독침을 잘라 낸 채 거래되기도 합니다. 독침은 시간이 지나면 같은 자리에서 다시 자랍니다.',
   l:['펜치가 가시 기부보다 깊이 들어갑니다. 꼬리 위쪽 피부와 진피가 함께 잘려 나갑니다.',
      '비늘이 없는 피부라 상처를 덮을 것이 점액뿐입니다. 이틀째 상처 가장자리가 하얗게 부풀고, 사흘째부터 꼬리 끝 살이 물러져 떨어집니다.',
      '{n}은 바닥을 기어 다니며 꼬리를 모래에 끌고 다닙니다. 끌릴 때마다 무른 조직이 조금씩 더 떨어져 나갑니다.',
      '꼬리 절반이 사라진 날, 몸판 아래쪽에 붉은 반점이 퍼집니다.']},
 'ORG-10-D':{kind:'bad',cat:'채집',tier:'fact',fx:'f-net',fact:'fClown',
   l:['놀란 {n}이 눈 밑의 가시를 세웁니다. 가시가 나일론 그물코를 꿰고 그대로 고정됩니다.',
      '작업자가 손가락으로 {n}을 잡아당깁니다. 가시가 박힌 눈 아래 피부와 근육이 그물코 쪽으로 찢겨 나갑니다. 찢긴 자리 바로 위가 안와여서 눈알이 한쪽으로 돌아갑니다.',
      '{n}은 통 안에서 무리를 따라 헤엄치려 하지만, 한쪽 눈이 앞을 보지 못해 통 벽에 계속 부딪힙니다.',
      '부딪힌 자리마다 상피가 벗겨지고, 이틀째 하얀 점이 돋습니다.']},
 'ORG-11-D':{kind:'bad',cat:'부화 실패',tier:'fact',fx:'f-bucket',fact:'fBreed',
   l:['수정되지 않은 알이 먼저 하얗게 변합니다. 하얀 알에 물곰팡이가 피고, 균사가 옆 알로 건너옵니다.',
      '{n}의 알껍질에도 균사가 감깁니다. {n}은 껍질 안에서 꼬리를 칩니다.',
      '균사가 껍질을 뚫고 들어와 막 생긴 지느러미 주름에 닿습니다.',
      '작업자가 하얗게 변한 알 덩어리를 스포이트로 빨아내 버립니다. {n}이 든 알도 덩어리에 붙어 함께 빨려 나갑니다.']},
 'ORG-12-D':{kind:'bad',cat:'백점병',tier:'fact',fx:'f-bottom',fact:'fIch',
   l:['백점충이 상피 아래에 자리를 잡고 자랍니다. 아가미 새엽에도 하얀 점이 촘촘히 박힙니다.',
      '약은 상피 밖에 나와 있는 충만 죽이고 피부 밑의 충은 건드리지 못합니다. 같은 약이 {n}의 점막을 벗겨 냅니다.',
      '{n}은 무리를 따라 계속 헤엄칩니다. 아가미 새엽이 점과 점액으로 덮여 숨 쉴 면적이 줄어듭니다.',
      '{n}은 무리에서 처지고, 수면 쪽으로 기울며 옆으로 눕습니다. 이번에는 다시 일어나지 않습니다.']},
 'ORG-14-D':{kind:'bad',cat:'통 속 복어',tier:'likely',fx:'f-nipped',fact:'fPea',
   l:['옆 개체의 부리가 {n}의 눈을 정면에서 뭅니다. 각막이 찢어지고 수정체가 눈구멍 밖으로 밀려 나옵니다.',
      '{n}은 몸을 돌려 달아나다가 반대편 개체의 입에 다시 부딪힙니다. 빈 눈구멍 안쪽 조직이 물에 드러납니다.',
      '냄새를 따라온 다른 개체들이 그 자리를 차례로 뭅니다.',
      '사흘 뒤 통을 비울 때, {n}은 한쪽 머리뼈가 드러난 채 바닥에 있습니다.']},
 'ORG-16-D':{kind:'bad',cat:'부력 이상',tier:'fact',fx:'f-float',fact:'fPea',
   l:['{n}의 위에 물 대신 공기가 들어갑니다. 수조로 돌아온 뒤 {n}은 배를 위로 한 채 수면에 뜹니다.',
      '{n}은 꼬리를 쳐서 아래로 내려가려 합니다. 꼬리를 멈추면 다시 떠오릅니다.',
      '수면 밖으로 나온 배 피부가 마르면서 하얗게 갈라집니다. 위가 늘어난 채로 먹이를 받지 못합니다.',
      '이틀째, 수면에 떠 있는 {n}의 아가미 뚜껑이 느려집니다.']},
 'ORG-17-D':{kind:'bad',cat:'수질 급변',tier:'fact',fx:'f-bucket',fact:'fWild',
   l:['수출장의 수돗물 수조에 옮겨진 {n}의 아가미 새엽이 점액을 과하게 냅니다.',
      '{n}은 입에 문 알을 놓지 않습니다. 알을 문 채로는 수면 공기를 제대로 마시지 못합니다. 이틀째 {n}은 알을 뱉어 냅니다.',
      '사흘째 몸 표면 점막이 회색 막처럼 들뜹니다. {n}은 수면에 입을 대고 공기를 마시며 수조 모서리를 따라 헤엄칩니다.',
      '들뜬 막 아래로 세균이 번져, 등지느러미 기부부터 상피가 짓무릅니다.']},
 'ORG-18-D':{kind:'bad',cat:'서식지 소실',tier:'fact',fx:'f-sun',
   l:['물이 줄어드는 동안 웅덩이의 물고기가 한곳에 모입니다. 수온이 오르고 물속 산소가 떨어집니다.',
      '재가 섞인 물이 아가미 새엽 사이에 끼어 점액과 엉킵니다.',
      '물이 손가락 한 마디 깊이가 되자 {n}의 등이 공기에 드러납니다. {n}은 몸을 옆으로 눕혀 남은 물에 아가미를 담그려 합니다.',
      '등 쪽 피부가 마르며 갈라지고, 그날 오후 웅덩이 바닥의 진흙이 드러납니다.']},
 'ORG-19-D':{kind:'bad',cat:'채집',tier:'fact',fx:'f-net',
   l:['{n}은 진흙 속으로 머리부터 들어갑니다. 삽날이 진흙을 퍼 올립니다.',
      '삽날 모서리가 {n}의 등을 비스듬히 지나갑니다. 등 근육이 갈라지고 척추 옆의 붉은 근육이 드러납니다.',
      '{n}은 진흙 덩이 속에서 몸을 S자로 비틀며 빠져나오려 합니다. 비틀 때마다 갈라진 근육이 더 벌어집니다.',
      '공기 호흡을 하는 몸은 그 상태로 반나절을 움직입니다.']},
 'ORG-20-D':{kind:'bad',cat:'탈출',tier:'likely',fx:'f-floor',fact:()=>isSp('bichir')?'fBichir':null,
   l:['{n}은 통 가장자리를 넘어 시멘트 바닥에 떨어집니다. 바닥을 몸으로 밀며 물 냄새가 나는 쪽으로 기어갑니다.',
      '거친 시멘트가 배 쪽 비늘을 하나씩 떼어 냅니다. 배수구 쇠창살 틈에 머리가 들어갑니다. 몸통은 들어가지 않습니다.',
      '{n}은 공기를 마시며 몸을 앞뒤로 비틉니다. 아가미 뚜껑 뒤쪽 피부가 쇠창살에 쓸려 벗겨집니다.',
      '아침에 작업자가 창살을 들어 올렸을 때, {n}의 몸통 겉은 말라 있고 아가미만 젖어 있습니다.']},
 'ORG-23-D':{kind:'bad',cat:'그물',tier:'fact',fx:'f-net',fact:'코리도라스의 가슴 가시는 그물코에 쉽게 걸립니다. 그래서 옮길 때는 그물 대신 컵을 쓰라고 권합니다.',
   l:['가슴지느러미 가시가 그물코 두 개를 꿰고 잠깁니다. 작업자가 손톱으로 가시를 잡고 비틉니다. 가시는 관절에서 빠지지 않습니다.',
      '작업자가 가시를 잡은 채 몸을 당깁니다. 가시 기부의 관절이 부러지고, 그 둘레 피부와 근육이 함께 찢어집니다.',
      '{n}은 수조로 돌아와 바닥을 따라 헤엄치지만 한쪽 가슴지느러미가 움직이지 않습니다.',
      '찢긴 자리가 하얗게 일어나고 균사가 덮습니다. 바닥을 뒤질 때마다 그 자리가 모래에 쓸립니다.']},
 'ORG-24-D':{kind:'bad',cat:'약욕',tier:'fact',fx:'f-poison',fact:()=>isSp('ghost')?'fGhost':'fMed',
   l:['포름알데히드가 {n}의 체표 점막과 상피 단백질을 굳힙니다. 굳은 점막이 회색으로 들떠 물속에서 하늘거립니다.',
      '같은 약이 아가미 새엽 상피를 부풀립니다. {n}은 관 밖으로 나와 수조 위아래를 오갑니다.',
      '들뜬 점막이 관 가장자리에 쓸려 벗겨지고, 그 아래 진피가 드러납니다. 아가미 뚜껑이 빠르게 움직이다가 고르지 않게 멈칫거립니다.',
      '다음 날 아침, {n}은 관 입구에 머리를 걸친 채 움직이지 않습니다.']},
 'ORG-26-D':{kind:'bad',cat:'도태',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['그물이 연못에서 몸집이 큰 치어만 골라 뜹니다. {n}은 그물 안에서 다른 큰 치어들과 몸을 부딪칩니다.',
      '작업자가 그물째 양동이에 털어 넣습니다. 양동이는 연못 옆 다른 어종 사육지로 옮겨져 그대로 쏟아집니다.',
      '그곳의 큰 물고기들이 수면으로 모여듭니다. {n}은 바닥 쪽으로 내려가려 합니다.',
      '위턱과 아래턱이 {n}의 머리를 덮고, 몸이 꼬리부터 마지막으로 입 안으로 사라집니다.']},
 'ORG-26-D2':{kind:'bad',cat:'동족 포식',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['다른 큰 치어가 {n}의 꼬리를 뭅니다. 꼬리지느러미와 꼬리자루가 상대의 입 안으로 들어갑니다.',
      '{n}은 앞쪽 지느러미로 계속 앞으로 나아가려 합니다. 상대는 삼키는 동작을 멈추지 않습니다.',
      '꼬리부터 몸 절반이 들어간 채, {n}의 머리가 한동안 상대의 입 밖에서 아가미를 움직입니다.']},
 'ORG-27-D':{kind:'bad',cat:'도태',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['무늬가 한쪽으로 쏠렸다는 이유로, 손이 {n}을 도태 그릇으로 옮깁니다. 도태 그릇의 물고기들은 연못 옆 메기 사육지에 쏟아집니다.',
      '메기가 바닥에서 올라와 입을 벌립니다. {n}은 몸을 비틀어 메기의 입 가장자리에서 빠져나갑니다.',
      '메기의 작은 이빨 줄에 옆구리 비늘과 상피가 쓸려 떨어집니다.',
      '두 번째 메기가 머리부터 삼킵니다. 꼬리지느러미가 메기의 입 밖에서 한동안 움직입니다.']},
 'ORG-28-D':{kind:'bad',cat:'수확',tier:'fact',fx:'f-sun',fact:'fKoi',
   l:['{n}은 진흙 속으로 몸을 밀어 넣습니다. 그물이 지나간 뒤 남은 물이 마저 빠집니다. 진흙 위에 수면이 남지 않습니다.',
      '{n}은 진흙 속에서 아가미 뚜껑을 벌려 물을 찾습니다. 아가미 새엽 사이로 진흙이 들어와 엉깁니다.',
      '{n}은 진흙 위로 몸을 들어 올려 옆으로 뒤집습니다.',
      '해가 진흙 표면을 말리면서 {n}의 몸통이 진흙에 붙습니다.']},
 'ORG-28-K':{kind:'bad',cat:'KHV 처분',tier:'fact',fx:'f-bottom',fact:'fKHV',
   l:['수확한 잉어 몇 마리의 아가미에 하얀 얼룩과 붉은 얼룩이 섞여 있습니다. 검사 결과는 코이 허피스 양성입니다.',
      '{n}의 아가미 새엽 끝도 하얗게 괴사하고, 그 사이가 붉게 충혈됩니다. 두 눈이 눈구멍 안쪽으로 꺼져 들어갑니다.',
      '{n}은 격리 수조 수면 가까이에서 아가미 뚜껑을 빠르게 움직입니다.',
      '검사 결과가 나온 날, 연못 전체의 물이 빠집니다. 그 연못의 잉어는 {n}과 함께 모두 처분됩니다.']},
 'ORG-29-D':{kind:'bad',cat:'도태',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['꼬리는 한 갈래였습니다. 손뜰채가 {n}을 떠서 옆에 놓인 양동이에 넣습니다. 양동이에는 같은 날 걸러진 홑꼬리 치어들이 있습니다.',
      '양동이 물은 바로 옆 큰 금붕어 연못에 쏟아집니다. 큰 금붕어들이 수면으로 몰려와 입을 벌립니다.',
      '{n}은 몸이 작아 한 번에 삼켜집니다.',
      '한 번에 삼켜지지 않은 치어들은 반쯤 물린 채 연못 바닥으로 떨어집니다.']},
 'ORG-31-D':{kind:'bad',cat:'동족 포식',tier:'fact',fx:'f-eaten',fact:'fGar',
   l:['더 큰 치어가 {n}의 몸통 가운데를 옆에서 뭅니다. 가는 이빨 줄이 비늘 사이로 박힙니다.',
      '{n}은 몸을 비틀어 빠져나가려 합니다. 이빨이 박힌 채로 비틀어 옆구리 근육이 세로로 찢어집니다.',
      '상대는 {n}을 문 채 머리 쪽으로 돌려 잡습니다.',
      '{n}의 머리가 상대의 입 안으로 들어가고, 몸 뒤쪽이 한동안 수면에서 꼬리를 칩니다.']},
 'ORG-32-D':{kind:'bad',cat:'근친 혈통',tier:'fact',fx:'f-bottom',fact:'fOranda',
   l:['머리 혹의 조직이 자라 눈 위를 덮습니다. 혹의 주름 사이에 먹이 찌꺼기가 끼고, 그 속에서 세균이 번식합니다.',
      '주름 안쪽 상피가 짓무르며 하얗게 일어납니다.',
      '{n}은 앞을 보지 못한 채 수조 벽과 장식에 머리를 부딪칩니다. 부딪힌 자리마다 혹의 상처가 벌어집니다.',
      '먹이가 떨어진 위치를 찾지 못해, {n}은 먹이 냄새가 나는 쪽을 맴돌기만 합니다.']},
 'ORG-32-D2':{kind:'bad',cat:'근친 혈통',tier:'fact',fx:'f-float',fact:'fSwim',
   l:['짧게 접힌 몸 안에서 장이 부레를 누릅니다. {n}은 머리를 아래로 한 채 꼬리 쪽이 떠오릅니다.',
      '바로 서려고 꼬리를 칠 때마다 몸이 앞으로 굴러 뒤집힙니다. 배가 위를 향한 채 수면에 닿습니다.',
      '공기에 드러난 배 피부가 마르며 붉게 충혈됩니다.',
      '며칠 뒤, 충혈된 자리에서 상피가 벗겨집니다.']},
 'ORG-33-D':{kind:'bad',cat:'싸움',tier:'fact',fx:'f-nipped',fact:'fCulled',
   l:['다른 수컷이 {n}의 꼬리지느러미를 물고 흔듭니다. 지느러미 막이 기조를 따라 세로로 찢어집니다.',
      '{n}은 다시 돌아서서 상대의 옆구리를 뭅니다. 서로 엉켜 도는 동안 {n}의 아가미 뚜껑 가장자리가 찢어집니다.',
      '찢긴 지느러미 끝이 하얗게 녹기 시작합니다.',
      '녹은 자리가 기조 기부까지 내려가고, 몸통 상피에 붉은 반점이 번집니다.']},
 'ORG-35-D':{kind:'bad',cat:'혈통',tier:'fact',fx:'f-nipped',fact:'fBetta',
   l:['여러 번 갈라진 기조 끝이 무게를 이기지 못하고 세로로 갈라집니다. 갈라진 기조 사이 막이 찢어져 지느러미가 실 몇 가닥처럼 늘어집니다.',
      '{n}은 계속 수면으로 올라가 공기를 마시려 합니다. 무거운 지느러미 때문에 올라가는 데 시간이 걸리고, 내려올 때는 지느러미에 끌려 바닥에 떨어집니다.',
      '찢어진 끝이 하얗게 녹아 기조를 따라 몸 쪽으로 내려갑니다.',
      '바닥에 누운 시간이 점점 길어집니다.']},
 'ORG-36-D':{kind:'bad',cat:'근친 혈통',tier:'fact',fx:'f-bent',fact:'fBreed',
   l:['자라면서 {n}의 척추가 옆으로 휩니다. 휜 척추 때문에 꼬리자루가 한쪽으로 꺾입니다.',
      '{n}은 앞으로 헤엄치려 하지만 몸이 원을 그리며 돕니다. 먹이가 떨어지면 형제들이 먼저 닿습니다.',
      '선별하던 손이 {n}을 다른 그릇으로 옮깁니다.',
      '그 그릇의 물은 옆의 대형어 수조에 비워집니다.']},
 'ORG-36-D2':{kind:'bad',cat:'어미',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['태어난 지 몇 초 만에 어미가 돌아섭니다.',
      '{n}은 꼬리를 쳐서 수면 쪽으로 올라갑니다. 어미의 입이 {n}을 물과 함께 빨아들입니다.',
      '{n}의 몸은 어미의 인두치 사이를 지나 식도로 내려갑니다.']},
 'ORG-37-D':{kind:'bad',cat:'잡아먹힘',tier:'fact',fx:'f-pond',
   l:['왜가리의 부리가 수면을 뚫고 들어옵니다. 부리 끝이 {n}의 몸통을 옆에서 집습니다.',
      '{n}은 부리 사이에서 꼬리를 쳐 몸을 비틉니다. 부리 가장자리가 옆구리 비늘과 상피를 벗겨 냅니다.',
      '새가 머리를 젖혀 {n}을 머리부터 돌려 잡습니다.',
      '{n}은 꼬리를 친 채 새의 목 안으로 넘어갑니다.']},
 'ORG-38-D':{kind:'bad',cat:'처분',tier:'fact',fx:'f-bag',fact:'fNeon',
   l:['사람이 수조 전체의 물을 뺍니다. 무리는 남은 물 쪽으로 몰리며 서로의 몸에 부딪힙니다.',
      '{n}은 바닥 물웅덩이에서 몸을 옆으로 눕힌 채 꼬리를 칩니다. 아가미 뚜껑이 공기 속에서 벌어지지만, 아가미 새엽이 서로 들러붙어 산소를 받지 못합니다.',
      '작업자가 무리를 한꺼번에 그물로 떠서 봉지에 담고 입구를 묶습니다.',
      '봉지 안에서 몇 마리가 계속 몸을 튑니다.']},
 'ORG-39-D':{kind:'bad',cat:'동족 포식',tier:'fact',fx:'f-eaten',fact:'fBreed',
   l:['큰 치어가 {n}의 등지느러미를 뭅니다. 기조 몇 개와 막이 떨어져 나갑니다.',
      '{n}은 가장자리로 달아나지만 큰 치어가 다시 따라옵니다. 두 번째로 물린 곳은 꼬리자루입니다. 꼬리지느러미가 기부부터 떨어집니다.',
      '추진력을 잃은 {n}은 가슴지느러미로 수면 쪽에 떠오릅니다.',
      '큰 치어가 {n}을 머리부터 입에 넣습니다.']},
 'ORG-41-D':{kind:'bad',cat:'수확',tier:'fact',fx:'f-thin',
   l:['물이 다 빠진 뒤 굴 입구가 말라 굳습니다. {n}은 굴 안쪽 진흙에 배를 붙이고 있습니다.',
      '공기를 삼켜 장으로 산소를 받으며 며칠을 버팁니다. 진흙의 물기가 줄면서 아가미 새엽이 말라 서로 붙습니다.',
      '{n}은 입 빨판으로 굴 벽을 붙잡고 몸을 앞으로 끌어당깁니다. 굴 입구는 굳은 흙으로 막혀 있습니다.',
      '갑옷 판 사이 피부가 말라 갈라집니다.']},
 'ORG-42-D':{kind:'bad',cat:'동족 물기',tier:'fact',fx:'f-bottom',
   l:['옆 치어가 {n}의 바깥 아가미 한쪽을 뭅니다. 얇은 아가미 가지가 뿌리째 떨어집니다. 떨어진 자리에서 피가 실처럼 풀립니다.',
      '{n}은 몸을 비틀어 구석으로 기어갑니다. 냄새를 따라 다른 치어들이 남은 아가미 쪽으로 모입니다.',
      '반대쪽 아가미까지 잘린 {n}은 수면으로 올라가 공기를 삼킵니다.',
      '아직 덜 자란 폐로는 몸이 쓰는 산소를 채우지 못합니다.']}
});
