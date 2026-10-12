/* ---------- v0.10 catalogue: owner kinds, part A (events/06_ownersA.md, EV-OWA-01 … 43) ----------
   expert · learner · eager · casual · gift · breeder · content · mill · cult · neglect · alchemist.
   Each kind: how the fish arrives, the events that are like that person, how they react after a near miss,
   and the event that hands the fish to someone else (fRehome). */

/* ---------- helpers ---------- */
const owa_air=()=>isSp('@airbreather');
const owa_scl=()=>isSp('@scaleless');
/* just arrived in this tank (a tick is weeks for a guppy, months for a koi) */
const owa_new=()=>S.f.tankAge<=S.dt*2+.01;
const owa_long=n=>S.f.tankAge>=S.dt*(n||6);
const owa_roll=(k,need)=>R()<clamp(Math.pow(fst()[k]/Math.max(5,need),2),.05,.95);
/* enduring what cannot be dodged: 근성 against need, a skilled owner helps a little */
function owa_hold(need,end,ok){
  const ch=clamp(Math.pow(fst().g/Math.max(5,need),2)*(.8+S.r*.4),.05,.93);
  return R()<ch?ok:{end};
}
/* the owner learns one thing (by kind); an alchemist learns the wrong thing */
function owa_learn(flag,line){
  if(fl(flag))return;const K=KIND[kindOf()]||{learn:.3};
  if(K.learn<0){addLog(T('주인은 이번 일로 약을 하나 더 사 두었습니다.'),'bad');addFl('meds');return}
  if(R()<K.learn*(S.f.lazy?.5:1)){setFl(flag,1);addLog(T(line),'good');S.r=clamp(S.r+.02,0,.97)}
  else if(R()<.4)addLog(T(pick(LAZY_NEAR)),'bad');
}
/* a new owner: base owner `own` (kind re-picked by the engine) or a fixed kind */
function owa_rehome(text,own,kind,opt,after){
  fRehome(text,Object.assign({},opt||{},own?{own}:{}));
  q(null,null,()=>{if(S.ending||S.done||!S.f||S.preOwner)return;
    if(kind&&KIND[kind]&&S.f.own===KIND[kind].base)S.f.kind=kind;
    if(after)after()});
}
/* the next owner, from weights; charm leans it toward people who will try */
function owa_next(list){return wpick(list.map(([k,w])=>[k,valOf(w)]).filter(z=>z[1]>0))}
const owa_base=k=>KIND[k]?KIND[k].base:k;
function owa_to(kind,text,opt,after){owa_rehome(text,owa_base(kind),kind,opt,after)}
const owa_bigger=()=>{const L=tankL();return TANKS.find(t=>t.k[0]==='t'&&t.L>L*1.5&&t.L>=fx_().minL)||TANKS.find(t=>t.k[0]==='t'&&t.L>L)};
const owa_ok=()=>!fl('old_age');

/* ======================= A. 물생활 고수 (expert) ======================= */

/* EV-OWA-01 검역 수조의 4주
   [출처: 수입 관상어 검역 기간·절차(어병학 교재), 알텀 수입 후 폐사율이 높다는 근거]
   [출처: 피퍼퍼 수입 개체 내부 기생충·구충 관행] */
function owa01_done(o){
  const x=isSp('peapuffer')?' 주인은 달팽이 번식통을 따로 굴려 {n}의 먹이로 썼습니다.'
   :isSp('clownloach')?' 흰 점이 돋았을 때 주인은 약을 절반 용량으로 쓰고 수온을 천천히 올렸습니다.'
   :isSp('cory','apisto','wildbetta')?' 주인은 검역 중에 구충제를 한 번 썼습니다.'
   :isSp('motoro')?' 주인은 꼬리 쪽 상처를 매일 들여다보았습니다.'
   :isSp('guppy','platy','betta')?' 아무 일도 없었습니다. 주인은 그래도 기간을 다 채웠습니다.':'';
  return Object.assign({},o,{t:o.t+x+' 4주 뒤 {n}은 본 수조로 옮겨졌습니다.',c:'good',
    set:{quarantined:1,qt:1,cycled:1,camallanus:0,snail_farm:isSp('peapuffer')?1:0},mem:'어둡고 텅 빈 수조. 그다음은 넓은 물.'});
}
function owa01_sick(){
  const dz=wpick([['ich',isSp('clownloach')?4:2],['columnaris',isSp('altum')?4:1.5],['velvet',1]]);
  return owa_hold(isSp('altum')?34:22,'OWA-01-D',{t:'검역 수조에서 {n}의 몸에 병이 올라왔습니다. 주인은 그날 바로 약과 수온을 맞췄습니다.',c:'bad',fx:{h:-10,st:.1},sick:dz,set:{qt:1}});
}
fev([{id:'OWA-01',tier:'fact',own:['expert'],once:1,
  w:()=>owa_new()?(isSp('wildbetta','peapuffer','altum','clownloach','apisto','cory','motoro')||fl('wild')?6:2):0,
  p:'새 수조에는 바닥재도 수초도 없습니다. 조명은 하루 종일 어둡고, 며칠에 한 번씩 물에서 낯선 약 냄새가 났다가 사라집니다. 유리 너머 큰 수조에서 다른 물고기들의 그림자가 오갑니다. {n}은…',
  o:[
   {l:'그림자가 보이는 쪽 유리에 붙어 계속 오르내린다',chk:['g',30],
    ok:()=>owa01_done({t:'{n}은 몇 주 동안 유리 앞을 오르내리며 버텼습니다.',fx:{g:2,st:.05}}),no:()=>owa01_sick()},
   {l:'핀셋 끝에서 흔들리는 낯선 먹이를 물어 본다',chk:['w',35],
    ok:()=>owa01_done({t:'{n}은 처음 보는 냉동 먹이를 받아먹기 시작했습니다.',fx:{w:2}}),
    no:()=>R()<Math.max(.5,S.r)?owa01_done({t:'{n}은 냉동 먹이를 뱉어 냈습니다. 주인은 이튿날부터 살아 있는 먹이를 핀셋으로 넣어 주었습니다.',fx:{h:-4}}):owa01_sick()},
   {l:'넣어 준 플라스틱 관 속으로 들어가 나오지 않는다',
    ok:()=>isSp('altum')?owa_hold(30,'OWA-01-D',owa01_done({t:'{n}은 관 속에서 4주를 버텼습니다. 옆구리의 쓸린 자리가 천천히 아물었습니다.',fx:{g:1,h:-10}}))
      :owa01_done(R()<.25?{t:'{n}은 관 속에서 거의 나오지 않았습니다. 주인이 {n}의 배가 홀쭉해진 걸 본 건 몇 주 뒤였습니다.',fx:{g:1,h:-6,fat:-.1}}:{t:'{n}은 관 속에서 4주를 보냈습니다.',fx:{g:1}})}
  ]}]);
fevEnd({'OWA-01-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',fact:()=>isSp('altum')?'fAltum':'fWater',
  after:'그날 밤 주인은 수조를 비우고, 원인을 노트에 적었습니다. 노트에는 "수입 7일째"라고 적혀 있었습니다.',
  l:['수송 중 봉지 벽에 쓸린 자리에서 상피가 벗겨져 있습니다. 그 자리에 세균이 붙어 번집니다.','등지느러미 기조 사이의 막이 회백색으로 흐려지고, 끝부터 녹아 기조만 남습니다.','아가미 새엽 가장자리도 같은 색으로 변합니다. {n}은 수면 가까이 올라와 아가미 뚜껑을 빠르게 움직입니다.','주인이 약을 넣고 수온을 맞춥니다. 처치는 정확합니다. 새엽은 계속 하얗게 변합니다.','사흘째 아침, {n}은 관 입구에 머리를 걸친 채 움직이지 않습니다.']}});

/* EV-OWA-02 정전 뒤의 여과통 [출처: 여과기 장시간 정지 후 재가동 시 혐기성 오염수 유입 — 제조사 매뉴얼/수족관 관리 문헌] */
function owa02(o,need){
  if(fl('owa02w'))return {t:'주인은 여과통을 열어 여과재를 수조 물에 헹군 뒤 다시 돌렸습니다. {n}은 잠깐 놀랐을 뿐이었습니다.',c:'good',fx:{st:.04},run:owa02_learn};
  if(o)return Object.assign({},o,{run:owa02_learn});
  const big=isSp('oscar','arowana','koi','@gold')?8:0,low=isSp('neon','altum')?6:0;
  return owa_hold(need+big+low,'OWA-02-D',{t:'썩은 물이 수조에 퍼졌습니다. {n}의 아가미가 한동안 붉게 부어 있었습니다.'+(owa_scl()?' 피부 점막도 뿌옇게 일어났습니다.':''),c:'bad',fx:{h:-18,st:.15,wq:-15},set:owa_scl()?{inj_gill:1,slime_loss:1}:{inj_gill:1},run:owa02_learn});
}
function owa02_learn(){setFl('near_miss',1);owa_learn('power_backup','주인은 그날 무정전 전원장치와 배터리 기포기를 주문했습니다.')}
fev([{id:'OWA-02',tier:'fact',own:['expert','learner','breeder'],cd:40,when:()=>!fl('power_backup'),
  w:()=>(isKind('expert')?2:.6)*(season()==='summer'?2:.5)*(fl('filter')==='canister'?1.5:.6),
  p:()=>{const wash=R()<(isKind('expert')?.85:isKind('breeder')?.55:.3);setFl('owa02w',wash?1:0);
    return '새벽에 수조 불빛과 함께 물 흐르는 소리가 멈춥니다. 몇 시간 동안 수면이 거울처럼 가만히 있습니다. '+(wash?'아침에 주인이 여과통을 열고 무언가를 씻는 소리가 납니다. 다시 소리가 나기 시작하자 출수구에서 맑은 물이 나옵니다.':'아침에 다시 소리가 나기 시작하자, 출수구에서 뿌연 물이 한 번에 쏟아져 나옵니다. 썩은 달걀 같은 냄새가 납니다.')+' {n}은…'},
  o:[
   {l:'출수구 반대편 끝으로 재빨리 헤엄쳐 간다',chk:['w',40],ok:()=>owa02({t:'{n}은 출수구에서 가장 먼 구석에 붙어 있었습니다. 썩은 물은 그쪽에 늦게 닿았습니다.',c:'good',fx:{w:2,h:-4}}),no:()=>owa02(null,40)},
   {l:'수면으로 올라가 입을 내민다',
    ok:()=>owa_air()?owa02({t:'{n}은 수면에서 공기를 삼키며 썩은 물이 묽어질 때까지 버텼습니다.',c:'good',fx:{g:1,h:-3}})
      :isSp('arowana')&&!S.f.lid&&!fl('owa02w')&&R()<.3?{t:'{n}이 수면을 박차고 올랐습니다.',c:'bad',run:()=>{owa02_learn();if(!S.waiting)q(null,null,()=>fCr('jump'))}}
      :owa02(null,45)},
   {l:'바닥에 배를 대고 가만히 있는다',ok:()=>owa02(null,50)}
  ]}]);
fevEnd({'OWA-02-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',fact:'fO2',pl:[[2,'정전 뒤 여과통을 씻지 않고 재가동']],
  after:'주인은 노트에 "재가동 전 여과통 세척 — 안 함"이라고 적었습니다. 그날 주인은 사흘째 야근 중이었습니다.',
  l:['멈춘 여과통 안에서 산소가 떨어지자, 여과재의 질화 세균 대신 산소 없이 사는 세균이 늘어납니다. 고인 물에 암모니아와 황화수소가 쌓입니다.','전원이 들어오는 순간, 그 물이 출수구로 한꺼번에 밀려 나옵니다.','{n}의 아가미 새엽이 붉게 부어오르고 서로 들러붙습니다. {n}은 수면과 바닥 사이를 오르내리며 물을 더 빨리 들이켭니다. 들이켤수록 더 많은 독이 새엽을 지나갑니다.','아가미 뚜껑이 벌어진 채 멈춥니다.']}});

/* EV-OWA-03 대환수 중 걸려 온 전화 (고수의 드문 실수) [출처: 잔류 염소의 아가미 상피 독성(어병학)] */
function owa03(o,need){
  if(!fl('owa03f'))return {t:'물이 조금 차가웠을 뿐입니다. 중화제는 이미 들어가 있었습니다. {n}은 저녁쯤 다시 먹이를 받아먹었습니다.',fx:{st:.06,h:-2}};
  if(o)return o;
  const n=need+(isSp('neon','altum')||owa_scl()?10:0)-(isSp('@gold','koi','pleco','gar')?10:0);
  return owa_hold(n,'OWA-03-D',{t:'통화를 마친 주인이 수조 냄새를 맡고 얼굴이 굳었습니다. 남은 물에 중화제를 넣고 절반을 다시 갈았습니다. {n}의 아가미는 며칠 동안 부어 있었습니다.',c:'bad',fx:{h:-18,st:.15},set:owa_scl()?{chlorine:1,slime_loss:1,inj_gill:1}:{chlorine:1,inj_gill:1},near:'dechlor',run:()=>setFl('dechlor_check',1)});
}
fev([{id:'OWA-03',tier:'fact',own:['expert'],cd:60,when:()=>!fl('dechlor_check'),w:()=>owa_long(8)?1.5:.3,
  p:()=>{setFl('owa03f',R()<clamp(1.05-S.r,.08,.5)?1:0);return '수도꼭지에 연결된 긴 호스로 새 물이 들어옵니다. 평소보다 물이 차갑고 냄새가 다릅니다. 거실 저편에서 휴대폰이 울리고, 주인의 발소리가 멀어집니다. 호스는 계속 물을 붓습니다. {n}은…'},
  o:[
   {l:'물이 쏟아지는 곳에서 멀리 떨어진다',chk:['w',35],ok:()=>owa03({t:'{n}은 호스에서 가장 먼 구석에서 옛 물을 마셨습니다. 주인이 돌아와 중화제를 넣을 때까지 버텼습니다.',fx:{w:2,h:-6},near:'dechlor',run:()=>setFl('dechlor_check',1)}),no:()=>owa03(null,45)},
   {l:'유리 앞으로 나와 주인이 사라진 쪽을 따라 헤엄친다',chk:['c',60],
    ok:()=>owa03(isSp('oscar','koi','arowana')&&fst().c>=capOf('c')*.85?{t:'{n}이 유리를 들이받으며 쫓아오자 주인은 "밥 달라고?" 하며 돌아왔다가 호스를 봤습니다. 그날 {n}은 밥도 받았습니다. 주인은 그 뒤로 환수 중엔 휴대폰을 수조 옆에 엎어 둡니다.',c:'good',fx:{c:2},near:'dechlor',run:()=>setFl('dechlor_check',1)}
      :{t:'통화하며 돌아본 주인이 유리 앞에서 이상하게 맴도는 {n}을 보고 호스를 잠갔습니다. 중화제 병은 선반 위에 그대로 있었습니다.',c:'good',fx:{h:-4},near:'dechlor',run:()=>setFl('dechlor_check',1)}),
    no:()=>owa03(null,45)},
   {l:'수초 사이에 들어가 가만히 있는다',ok:()=>owa03(null,45)}
  ]}]);
fevEnd({'OWA-03-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-float',fact:'fChlor',pl:[[2,'환수 중 자리를 비움']],
  after:'주인은 중화제 병을 수도꼭지 옆에 테이프로 붙였습니다. 이십 년 만의 실수였습니다.',
  l:['수조 물의 절반이 수돗물로 바뀝니다. 잔류 염소가 아가미 새엽 표면의 상피세포를 산화시킵니다.','벗겨진 상피 위로 점액이 하얗게 엉겨 붙습니다. {n}은 수면 바로 아래에서 입을 벌리고 닫기를 반복합니다.','몸 표면 점막도 같은 방식으로 벗겨지고, 비늘 사이로 붉은 반점이 번집니다.','통화를 끝낸 주인이 돌아왔을 때, {n}은 출수구 아래에서 옆으로 기울어 물살에 밀리고 있습니다.']}});

/* EV-OWA-04 늙은 {n} [출처: AVMA 동물 안락사 지침 — 어류 eugenol(정향유) 2단계 처치 / 노령 금붕어 종양 빈도] */
function owa04(o){
  addFl('owa_age');setFl('old_age',1);
  if(fl('owa_age')>=2&&R()<.25+fl('owa_age')*.1)return {t:o.t,c:o.c,fx:o.fx,end:isKind('expert','learner','staff','grandma')&&R()<.7?'OWA-04-E':'OWA-04-N'};
  return o;
}
fev([{id:'OWA-04',tier:'fact',own:['expert','learner'],cd:10,w:()=>fl('age')>=.8?(isKind('expert')?5:2):0,
  p:()=>'먹이가 떨어져도 예전처럼 빨리 다가가지 않습니다. 몸 한쪽에 작은 혹이 조금씩 자랍니다. 주인이 수조 앞에 앉아 있는 시간이 길어졌습니다. 수류가 약하게 바뀌고, 먹이가 잘게 부서져서 들어옵니다.'+(isSp('oranda')?' 머리의 혹이 눈을 덮어, 먹이가 어디 떨어졌는지 잘 보이지 않습니다.':isSp('betta')?' 지느러미 끝이 처지고 해져 있습니다. 수면 가까이에 쉴 수 있는 잎 하나가 새로 걸렸습니다.':'')+' {n}은…',
  o:[
   {l:'예전처럼 수면까지 올라가 먹이를 받는다',chk:['p',30],ok:()=>owa04({t:'{n}은 천천히, 그래도 끝까지 수면까지 올라갔습니다.',c:'good',fx:{p:1}}),no:()=>owa04({t:'수면까지 올라가는 데 한참이 걸렸습니다. {n}은 먹이를 반쯤 놓쳤습니다.',c:'bad',fx:{h:-8}})},
   {l:'주인이 앉은 자리 앞에 와서 멈춘다',chk:['c',50],ok:()=>owa04({t:'주인은 {n}과 눈높이를 맞추고 한참 앉아 있었습니다. 그 뒤로 매일 몸을 살펴보았습니다.',c:'good',fx:{i:.1,c:1},set:{owa_watch:1}}),no:()=>owa04({t:'{n}은 유리 앞에서 멈췄지만 주인은 휴대폰을 보고 있었습니다.',fx:{st:.03}})},
   {l:'바닥 가장 편한 자리에 내려가 쉰다',ok:()=>owa04({t:isSp('oranda')?'주인이 손으로 먹이를 {n}의 입 앞에 놓아 주었습니다. {n}은 쉬면서 받아먹었습니다.':'{n}은 바닥에서 하루를 쉬었습니다.',fx:{h:8}})}
  ]}]);
fevEnd({
 'OWA-04-E':{kind:'release',cat:'보내 줌',tier:'fact',fx:'f-euth',fact:'fEuth',
   l:['혹이 아가미와 복강을 누르기 시작했습니다. 주인이 작은 통에 수조 물을 뜨고, 정향유를 섞은 물을 조금씩 더합니다.','{n}의 움직임이 느려지고, 몸이 한쪽으로 기울며 평형을 잃습니다. 지느러미가 멈춥니다.','아가미 뚜껑의 움직임이 점점 얕아지고 간격이 벌어집니다. 마지막 움직임 뒤로 주인은 십 분을 더 기다립니다.','주인은 농도를 높인 두 번째 통을 준비합니다. 그동안 {n}의 아가미는 다시 움직이지 않습니다.','주인은 노트에 마지막 체중과 날짜를 적고, {n}이 살았던 햇수를 셌습니다.']},
 'OWA-04-N':{kind:'bad',cat:'노화',tier:'fact',fx:'f-bottom',fact:'fNatural',after:'주인은 노트에 마지막 체중과 날짜를 적고, {n}이 살았던 햇수를 셌습니다.',
   l:['혹이 복강을 눌러 부레가 밀립니다.','{n}은 몸이 기울어 바닥에 닿고, 일어서려고 가슴지느러미를 계속 젓습니다.','비늘이 바닥에 쓸리며 몇 장씩 빠집니다.','어느 새벽, 젓던 지느러미가 멈춥니다.']}
});

/* EV-OWA-05 해외 발령, 정리 분양 (주인 교체) */
function owa05(bias){
  const big=isSp('arowana','gar','motoro','oscar');
  if(big&&R()<.4)return {t:'수조째 넘길 사람이 나타나지 않았습니다. 주인은 {n}을 단골 수족관에 맡겼습니다.',c:'sub',run:()=>owa_to('staff','주인은 해외 발령을 받았습니다. 받을 사람을 끝내 찾지 못해, {n}은 수족관 직원의 집으로 갔습니다.',{note:'해외 발령으로 위탁'},owa05_after)};
  const k=owa_next([['expert',4+bias*3],['learner',5+bias*3],['casual',3-bias*2],['relay',bias<0?3:.5]]);
  return {t:'주인은 해외 발령을 받았습니다. A4 세 장짜리 사육 인수인계서를 썼습니다.',c:'sub',run:()=>owa_to(k,'{n}은 인수인계서와 함께 새 집으로 갔습니다. 새 주인은 첫 장만 읽었습니다.',{note:'해외 발령으로 분양'},owa05_after)};
}
function owa05_after(){const f=S.f;f.lid=1;setFl('heater_cover',1);if(isSp('koi')&&f.tank==='pond')f.net=0}
fev([{id:'OWA-05',tier:'likely',own:['expert','learner','breeder'],once:1,when:owa_ok,w:()=>isKind('expert')?.7:.25,
  p:'거실에 상자가 쌓이기 시작합니다. 주인이 수조 앞에서 휴대폰으로 사진을 여러 장 찍습니다. 낯선 사람들이 와서 수조를 들여다보고 갑니다. 한 사람은 오래 보고, 한 사람은 금방 갑니다. {n}은…',
  o:[
   {l:'오래 보는 사람 앞으로 나와 지느러미를 활짝 편다',chk:['c',50],ok:()=>owa05(1),no:()=>owa05(0)},
   {l:'평소처럼 먹이를 받아먹는다',ok:()=>owa05(.3)},
   {l:'유목 뒤로 숨는다',ok:()=>owa05(-1)}
  ]}]);

/* ======================= B. 공부하는 초보 (learner) ======================= */

/* EV-OWA-06 2주 물잡이 — 아직 덜 잡힌 물 [출처: 질소 순환 — 물잡이 기간 중 암모니아·아질산 독성(어병학/수질 관리 문헌)] */
function owa06(need){
  if(fl('owa06n'))return {t:'시험지 색이 바뀐 걸 본 주인은 그날부터 매일 물을 3분의 1씩 갈았습니다. {n}은 버텼습니다.',c:'good',fx:{h:-5},near:'cycle'};
  const n=need+(isSp('@gold')?5:0)+(isSp('@big')?10:0)-(owa_air()?10:0);
  return owa_hold(n,'OWA-06-D',{t:'며칠 동안 아가미가 쓰렸습니다. '+(isSp('betta')?'{n}은 겉으로 멀쩡해 보였고, 주인은 한참 뒤에야 알았습니다.':'주인은 "왜 물이 뿌옇지" 검색하다 물잡이를 다시 공부했습니다.'),c:'bad',fx:{h:-15,st:.12,wq:-10},set:{inj_gill:1,near_miss:1},near:'cycle'});
}
fev([{id:'OWA-06',tier:'fact',own:['learner'],once:1,need:{cycled:0},w:()=>owa_new()?6:1,
  p:()=>{setFl('owa06n',R()<.6*(.6+S.r)?1:0);return '수조는 깨끗하고 물은 투명합니다. 주인은 매일 저녁 작은 종이 띠를 물에 담갔다가 색을 비교합니다. 사흘째부터 물에서 시큼한 냄새가 납니다. 아가미 안쪽이 따끔거립니다. {n}은…'},
  o:[
   {l:'종이 띠를 든 주인 앞으로 나와 수면을 빙빙 돈다',chk:['c',45],
    ok:{t:'주인이 {n}의 움직임을 동영상으로 찍어 커뮤니티에 물었습니다. 첫 답이 "물잡이 덜 됐어요"였습니다. 그날부터 환수가 시작되었습니다.',c:'good',fx:{h:-4},near:'cycle'},
    no:()=>owa_roll('w',30)?{t:'주인이 시험지 색과 {n}을 번갈아 보다 커뮤니티에 질문을 올렸습니다. 그날부터 환수가 시작되었습니다.',c:'good',fx:{h:-6},near:'cycle'}:owa06(40)},
   {l:'여과기 출수구 물살 바로 아래에 자리 잡는다',chk:['w',40],ok:{t:'{n}은 산소가 많은 물살 아래에서 버텼습니다.',c:'good',fx:{g:2,h:-5},near:'cycle'},no:()=>owa06(45)},
   {l:'바닥에 내려가 움직임을 줄인다',ok:()=>owa06(40)}
  ]}]);
fevEnd({'OWA-06-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',fact:'fCycle',pl:[[2,'물잡이가 안 된 수조']],
  after:'주인은 커뮤니티에 사진을 올리고 "2주 기다렸는데 왜 죽었을까요"라고 물었습니다. 첫 댓글은 "물잡이는 기다리는 게 아니라 키우는 거예요"였습니다.',
  l:['물속 암모니아가 아가미를 통해 혈액으로 들어옵니다. 아가미 새엽 끝이 붉게 부어오르고, 새엽 사이 틈이 좁아집니다.','{n}은 수면 가까이 떠서 입을 빠르게 여닫습니다. 지느러미 끝이 붉게 충혈됩니다.','혈중 암모니아가 오르자 {n}은 갑자기 수조를 가로질러 헤엄치다 벽에 부딪힙니다. 부딪힌 자리의 비늘이 떨어집니다.','밤사이 경련 간격이 길어지고, 아침에는 여과기 흡입구 쪽으로 몸이 붙어 있습니다.']}});

/* EV-OWA-07 커뮤니티 답변 세 개 [출처: 백점충 생활사와 수온, 비늘 없는 어종 약품 감수성, 고온 시 용존산소 감소] */
function owa07(need,hurt){
  const one=fl('owa07o');
  const n=need-(one?10:0)+(owa_scl()&&!one?15:0)+(isSp('@gold')&&!one?10:0);
  return owa_hold(n,'OWA-07-D',Object.assign({t:(one?'주인은 답변 셋 중 하나만 골랐습니다. ':'수온과 소금과 약이 한꺼번에 들어왔습니다. ')+'며칠 뒤 흰 점이 떨어졌습니다. {n}은 기운 없이 바닥에 붙어 있었습니다.',c:'bad',fx:{h:-14,st:.1},run:()=>{S.f.ill=null;setFl('med_one',1)}},hurt||{}));
}
fev([{id:'OWA-07',tier:'fact',own:['learner'],cd:30,need:{ill:'ich'},w:()=>isSp('clownloach')?3:isSp('neon','guppy','altum','betta','oranda')?2:isSp('pleco','gar','bichir')?.4:1,
  p:()=>{setFl('owa07o',R()<S.r?1:0);return '지느러미와 몸에 소금 알갱이 같은 흰 점이 돋습니다. {n}은 바닥 돌에 몸을 문지릅니다. 주인은 휴대폰을 들여다보며 한참을 망설입니다. '+(fl('owa07o')?'그날 밤 수온이 조금씩 오릅니다.':'그날 밤 수조에 세 가지가 차례로 바뀝니다. 수온이 오르고, 물에서 짠맛이 나고, 다음 날엔 파란 약이 풀립니다.')+' {n}은…'},
  o:[
   {l:'따뜻해진 물에서 평소보다 활발하게 헤엄친다',chk:()=>['g',isSp('@gold')?50:40],
    ok:{t:'따뜻한 물에서 흰 점이 빨리 떨어져 나갔습니다. {n}은 일주일 만에 다시 먹이를 받아먹었습니다.',c:'good',fx:{g:2,h:-4},run:()=>{S.f.ill=null;setFl('med_one',1)}},
    no:()=>owa07(45,{set:{inj_gill:1}})},
   {l:'수면 근처에 머물며 숨을 고른다',ok:()=>owa_air()?{t:'{n}은 수면에서 공기를 마시며 치료가 끝날 때까지 버텼습니다.',c:'good',fx:{h:-5},run:()=>{S.f.ill=null;setFl('med_one',1)}}:owa07(35)},
   {l:'돌 틈에 들어가 몸을 문지르지 않고 참는다',chk:['w',40],
    ok:{t:'{n}은 몸을 문지르지 않고 버텼습니다. 흰 점이 떨어진 자리가 깨끗하게 아물었습니다.',c:'good',fx:{w:2,h:-6},run:()=>{S.f.ill=null;setFl('med_one',1)}},
    no:()=>owa07(40,{set:{inj_skin:1},t:'흰 점 자리를 돌에 문지른 상처가 남았습니다. '+(isSp('betta')&&R()<.4?'주인은 처음에 벨벳병인 줄 알고 다른 약을 넣었습니다. ':'')+'흰 점은 떨어졌지만 {n}의 옆구리는 한동안 붉었습니다.'})}
  ]}]);
fevEnd({'OWA-07-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',fact:'fIch',pl:[[1,'세 가지 치료를 한꺼번에']],
  after:'주인은 세 답변 모두에 "감사합니다, 덕분에 흰 점은 없어졌어요"라고 썼다가 지웠습니다.',
  l:['수온이 오른 물에는 녹아 있는 산소가 줄어듭니다. 백점충이 박힌 아가미 새엽은 이미 산소를 받아들일 면적이 줄어 있습니다.','염분과 약이 더해지자 피부 점막이 벗겨져 물에 하얗게 떠다닙니다. 흰 점이 있던 자리마다 작은 구멍이 남습니다.','{n}은 수면으로 올라가 입을 벌리고, 다시 가라앉고, 또 올라갑니다. 오르내릴 때마다 아가미 뚜껑 가장자리가 붉어집니다.','다음 날 아침 흰 점은 모두 떨어져 있습니다. {n}도 바닥에 떨어져 있습니다.']}});

/* EV-OWA-08 입대 영장 (주인 교체) */
function owa08(k){
  const t='주인이 수조 옆에 빽빽한 종이를 한 장 붙였습니다. 며칠 뒤 수조는 차에 실려 주인의 본가 거실로 옮겨졌습니다.';
  if(k==='grandma')return {t,c:'sub',run:()=>owa_to('grandma','입대한 아들 대신 어머니가 {n}을 맡았습니다.',{note:'입대로 본가에 맡김'},()=>q(T('어머니는 종이를 한 번 읽고 먹이통을 들었습니다. 아버지도 지나갈 때마다 한 꼬집씩 넣었습니다. 종이에는 "하루 한 번"이라고 쓰여 있었습니다.'),'sub',()=>{S.f.fat=(S.f.fat||0)+.25;S.f.wq-=6}))};
  return {t,c:'sub',run:()=>owa_to(isSp('pleco','gar','bichir')&&R()<.4?'relay':'casual',isSp('pleco','gar','bichir')?'본가 식구들은 {n}을 보고 "징그럽다"고 했습니다. 먹이 주는 손이 자주 바뀌었습니다.':'본가 거실에서는 텔레비전 소리가 컸습니다. 먹이는 생각날 때 들어왔습니다.',{note:'입대로 본가에 맡김'},()=>{if(isSp('betta')&&R()<.5){S.f.tank='t20';addLog(T('부모님은 "작은 어항이 관리가 쉽다"며 {n}을 미니 어항으로 옮겼습니다.'),'bad')}})};
}
fev([{id:'OWA-08',tier:'likely',own:['learner','casual','eager'],once:1,when:owa_ok,w:()=>isKind('learner')?.5:.2,
  p:'주인이 수조 옆에 종이를 한 장 붙입니다. 글씨가 빽빽합니다. 며칠 뒤 수조는 차에 실려 다른 집 거실로 옮겨집니다. 새 집에서는 텔레비전 소리가 크고, 먹이를 주는 손이 바뀝니다. 손은 종이를 한 번 보고 먹이통을 듭니다. {n}은…',
  o:[
   {l:'새 손이 다가올 때마다 유리 앞으로 나간다',chk:['c',55],ok:()=>owa08('grandma'),no:()=>owa08('casual')},
   {l:'거실 소리가 잦아드는 밤에만 움직인다',chk:['w',40],ok:()=>Object.assign(owa08(R()<.5?'grandma':'casual'),{fx:{g:2}}),no:()=>owa08(R()<.35?'grandma':'casual')},
   {l:'은신처에서 나오지 않는다',ok:()=>owa08(R()<.2?'grandma':'casual')}
  ]}]);

/* ======================= C. 의욕 과다 초보 (eager) ======================= */

/* EV-OWA-09 첫날 — 퐁퐁으로 닦은 어항 [출처: 세제(계면활성제)의 어류 아가미 독성] */
function owa09(need){
  const n=need+(owa_scl()?10:0)-(owa_air()&&!owa_scl()?8:0);
  const ok=owa_hold(n,'OWA-09-D',{t:'다음 날 주인은 "뭔가 이상하다"며 물을 전부 갈았습니다. 이번엔 중화제를 넣었습니다. {n}의 아가미는 며칠 동안 부어 있었습니다.',c:'bad',fx:{h:-16,st:.12},set:{chlorine:1,toxin:'detergent',slime_loss:1,cycled:0},near:'dechlor'});
  if(ok.end&&R()<.4*(1+S.r))return {t:'다음 날 주인은 "뭔가 이상하다"며 물을 전부 갈았습니다. 이번엔 중화제를 넣었습니다. {n}은 겨우 살아남았습니다.',c:'bad',fx:{h:-28,st:.2},set:{chlorine:1,toxin:'detergent',slime_loss:1,cycled:0},near:'dechlor'};
  return ok;
}
fev([{id:'OWA-09',tier:'fact',own:['eager'],once:1,w:()=>owa_new()?(isSp('@big')?1:6):0,
  p:'새 수조는 반짝입니다. 주인은 어항, 돌, 인조 수초를 주방 세제로 박박 문질러 헹궜습니다. 수돗물을 받은 지 한 시간 만에 봉지가 뜯깁니다. 물에서 미끈하고 쓴 냄새가 납니다. 수면에 아주 작은 거품이 오래 남아 있습니다. {n}은…',
  o:[
   {l:'거품이 없는 쪽 수면을 찾아 올라간다',chk:()=>['w',owa_scl()?45:35],ok:()=>owa09(30),no:()=>owa09(42)},
   {l:'돌 사이를 빠르게 오가며 출구를 찾는다',ok:()=>owa09(isSp('neon')?60:52)},
   {l:'봉지에서 나온 자리 바닥에 그대로 있는다',chk:()=>['g',owa_scl()?50:40],ok:()=>owa09(25),no:()=>owa09(45)}
  ]}]);
fevEnd({'OWA-09-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-float',fact:'세제 성분은 물고기 아가미를 덮은 보호 점액을 녹입니다. 어항과 장식은 맹물로만 헹궈야 합니다.',pl:[[2,'세제로 닦은 어항에 수돗물 그대로']],
  after:'주인은 다음 날 같은 가게에 가서 "물고기가 약한 것 같다"고 말했습니다. 직원은 같은 종 다섯 마리를 더 권했습니다.',
  l:['세제의 계면활성제가 아가미 새엽 표면을 덮은 점액층을 녹여 냅니다. 보호막이 사라진 상피에 잔류 염소가 닿습니다.','새엽 상피가 부어 떨어져 나가고, 그 자리에서 피가 배어 나옵니다.','{n}은 수면에 입을 대고 숨을 쉽니다. 몸 표면의 점액이 실처럼 늘어져 물에 흔들립니다.','저녁에 주인이 사진을 찍으러 왔을 때, {n}은 인조 수초 잎 사이에 걸린 채 아가미만 천천히 움직입니다. 밤사이 그것도 멈춥니다.']}});

/* EV-OWA-10 하루 다섯 번 밥 [출처: 과잉 급여와 수질 악화, 금붕어 부레 이상과 소화 관련 문헌] */
function owa10_full(){
  if(isSp('oranda','ryukin','comet'))return owa_hold(isSp('comet')?35:50,'OWA-10-D',{t:'{n}의 배가 불러 몸이 기울었습니다. 머리가 아래로 향한 채 며칠을 보냈습니다.',c:'bad',fx:{h:-12,fat:.25},sick:'swimb'});
  if(isSp('betta'))return {t:'{n}의 배가 눈에 띄게 부풀었습니다. 며칠 동안 수면 근처에서 움직이지 않았습니다.',c:'bad',fx:{h:-10,fat:.3}};
  if(isSp('oscar'))return {t:'{n}은 조를 때마다 받았습니다. 머리 옆에 작은 구멍이 하나 생겼습니다.',c:'bad',fx:{h:-8,fat:.3,wq:-8},set:{hlle:1}};
  return owa_hold(40,'OWA-10-D',{t:'{n}은 배가 불러 바닥에 내려앉아 있었습니다.',c:'bad',fx:{h:-10,fat:.3}});
}
function owa10_after(o){
  return Object.assign({},o,{fx:Object.assign({wq:-12},o.fx||{}),run:()=>{
    if(isSp('@livebearer')){const m=S.f.mates.find(m=>m.id===S.sp.id);if(m)m.n+=6;else S.f.mates.push({id:S.sp.id,n:6,cm:1.5});addLog(T('잘 먹은 물고기들이 새끼를 낳았습니다. 수조가 금세 붐볐습니다.'),'sub')}
    owa_learn('feed_once',R()<.3?'주인은 자동 급여기를 달았습니다. 하루 한 번, 정해진 양만 떨어집니다.':'주인은 "먹이는 하루 한 번"이라는 글을 읽고 메모지를 수조에 붙였습니다.')}});
}
fev([{id:'OWA-10',tier:'fact',own:['eager','gift'],cd:30,when:()=>!fl('feed_once'),w:()=>isSp('@gold','oscar','koi')?2:isSp('pleco','ghost')?.4:1,
  p:'주인이 수조 앞을 지날 때마다 뚜껑이 열리고 먹이가 쏟아집니다. 아침에도, 점심에도, 저녁 뉴스 때도, 자기 전에도. 바닥에 먹지 못한 알갱이가 불어 쌓입니다. 이틀째부터 그 위에 하얀 솜털이 핍니다. {n}은…',
  o:[
   {l:'떨어지는 대로 다 받아먹는다',chk:['g',50],ok:()=>owa10_after({t:'{n}은 다 받아먹었습니다. 몸이 눈에 띄게 둥글어졌습니다.',fx:{fat:.25}}),no:()=>owa10_after(owa10_full())},
   {l:'몇 알만 먹고 돌아선다',chk:['w',35],ok:()=>owa10_after({t:'{n}은 몇 알만 먹고 돌아섰습니다. 남은 먹이는 바닥에서 썩어 갔습니다.',c:'good',fx:{w:2}}),no:()=>owa10_after(owa10_full())},
   {l:'바닥에 쌓인 알갱이 틈을 뒤진다',ok:()=>owa10_after(isSp('@bottom')?(R()<.35&&isSp('cory','pleco','clownloach')?{t:'썩는 먹이 사이를 뒤지던 {n}의 수염 끝이 붉게 짓물렀습니다.',c:'bad',fx:{h:-8},set:{inj_barbel:1}}:{t:'{n}은 바닥에서 배불리 먹었습니다. 썩는 냄새가 가까웠습니다.',fx:{h:-3,fat:.1}})
      :{t:'바닥 알갱이 사이에서 {n}의 아가미가 따끔거렸습니다.',c:'bad',fx:{h:-6}})}
  ]}]);
fevEnd({'OWA-10-D':{kind:'bad',cat:'과식',tier:'fact',fx:'f-float',fact:()=>isGold()?'fSwim':'fWater',pl:[[2,'하루 다섯 번 먹이']],
  after:'주인은 "밥을 너무 안 줘서 그런가" 하고 더 좋은 사료를 샀습니다.',
  l:()=>[isGold()?'불어난 사료가 장을 채웁니다. 늘어난 장이 바로 위의 부레를 누릅니다.':'불어난 사료가 장을 채우고, 배가 둥글게 늘어납니다.',isGold()?'{n}은 꼬리가 들리고 머리가 아래로 향한 채 기울어집니다. 바로 서려고 가슴지느러미를 계속 젓습니다.':'{n}은 바닥에 내려앉아 가슴지느러미만 천천히 젓습니다.','바닥의 썩은 먹이에서 암모니아가 올라옵니다. 아가미 새엽이 붉게 부어오릅니다.','며칠 뒤 {n}은 배를 위로 한 채 수면에 붙습니다. 물 밖으로 나온 배 피부가 마르면서 하얗게 갈라집니다. 아래쪽 아가미는 계속 움직입니다.']}});

/* EV-OWA-11 주말 대청소 — 여과재를 수돗물에 [출처: 여과재 수돗물 세척 시 질화 세균 사멸] */
function owa11(o){
  addFl('owa11n');
  return Object.assign({},o,{run:()=>{
    if(isSp('pleco'))addLog(T('꺼낸 유목은 베란다에서 바싹 말랐습니다. {n}이 갉을 것이 없어졌습니다.'),'sub');
    owa_learn('media_ok','주인은 "여과재는 수조 물에 헹군다"는 글을 저장했습니다.');
    if(isKind('eager')&&fl('media_ok')&&fl('owa11n')>=2&&R()<.6){S.f.kind='learner';addLog(T('그 뒤로 주인은 무언가를 하기 전에 먼저 찾아보게 되었습니다.'),'good')}}});
}
function owa11h(need){
  const n=need+(isSp('neon','altum')?5:0)-(isSp('cory')?10:0);
  return owa11(owa_hold(n,'OWA-11-D',{t:'일주일 내내 물이 시큼했습니다. {n}의 아가미가 부었다 가라앉았습니다.',c:'bad',fx:{h:-15,st:.1},set:{near_miss:1},near:'cycle'}));
}
fev([{id:'OWA-11',tier:'fact',own:['eager'],cd:30,need:{cycled:1},when:()=>!fl('media_ok'),
  log:'주말 아침, 수조 물이 거의 다 빠졌습니다.',
  p:()=>'돌과 장식이 전부 꺼내지고, 여과기 안의 갈색 스펀지는 세면대에서 하얘질 때까지 빨립니다.'+(isSp('cory')?' 물이 빠지는 동안 {n}은 젖은 바닥 위에 몇 분 동안 남겨집니다.':'')+' 다시 채운 물은 지나치게 깨끗합니다. 이틀 뒤부터 물에서 익숙한 시큼한 냄새가 다시 납니다. {n}은…',
  o:[
   {l:'낯선 배치가 된 수조를 구석구석 돌아본다',chk:['w',30],
    ok:()=>owa11({t:'{n}은 새 돌 밑에서 숨을 자리를 먼저 찾았습니다.',c:'good',fx:{w:2,st:-.05,wq:-15},set:{cycled:0}}),
    no:()=>owa11(fBully()||(isSp('apisto','oscar','betta')&&S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id))?{t:'배치가 바뀌자 영역 다툼이 다시 시작되었습니다. {n}의 지느러미가 찢겼습니다.',c:'bad',fx:{fin:.15,h:-6,wq:-15},set:{cycled:0}}:{t:'{n}은 낯선 수조를 한참 헤맸습니다.',fx:{st:.08,wq:-15},set:{cycled:0}})},
   {l:'수면 근처에서 숨을 고른다',ok:()=>{setFl('cycled',0);S.f.wq-=15;return owa_air()?owa11({t:'{n}은 수면에서 공기를 마시며 버텼습니다.',fx:{h:-5}}):owa11h(40)}},
   {l:'새로 놓인 돌 아래에 들어가 버틴다',chk:['g',45],ok:()=>owa11({t:'{n}은 돌 아래에서 물이 다시 잡힐 때까지 버텼습니다.',c:'good',fx:{g:2,h:-6,wq:-15},set:{cycled:0}}),no:()=>{setFl('cycled',0);S.f.wq-=15;return owa11h(45)}}
  ]}]);
fevEnd({'OWA-11-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',fact:'fCycle',pl:[[2,'여과재를 수돗물에 빪']],
  after:'주인은 "지난주에 청소했는데 왜 또 물이 뿌옇지" 하고 다음 주말에 한 번 더 청소했습니다.',
  l:['세면대 수돗물의 잔류 염소가 스펀지 속 질화 세균을 죽입니다. 다시 채운 물에서 암모니아를 처리할 세균이 없습니다.','아가미 새엽이 붉게 부어오르고 서로 붙습니다. {n}은 새 돌 아래에서 나와 수면으로 갔다가, 다시 돌 아래로 돌아갑니다.','그 왕복이 점점 느려집니다. 일요일 밤, {n}은 돌 아래에서 꼬리만 내민 채 움직이지 않습니다.']}});

/* EV-OWA-12 외로울까 봐 — 친구 열 마리 [출처: 대표 합사 금기(베타-구피, 복어 지느러미 뜯기)] */
function owa12(o){return Object.assign({},o,{fx:Object.assign({wq:-10},o.fx||{}),near:'qt'})}
function owa12_hurt(){
  if(isSp('@puffer'))return owa12({t:'{n}은 새로 온 물고기들의 지느러미를 하나씩 뜯었습니다. 주인은 "애들이 왜 이렇게 지느러미가 짧지" 했습니다.',c:'bad',fx:{st:.05},set:{nippy:1}});
  if(isSp('@predator')&&fst().p>=35)return owa12({t:'밤마다 새로 온 작은 물고기가 하나씩 사라졌습니다. {n}의 배가 불룩했습니다.',c:'bad',fx:{fat:.15},run:()=>{fEatOne();fEatOne();if(R()<.3)fSick('worms')}});
  return owa_hold(isSp('@longfin')?50:42,'OWA-12-D',owa12({t:'새로 온 물고기들이 {n}의 지느러미를 쪼았습니다. 찢긴 가장자리가 하얗게 일어났습니다.',c:'bad',fx:{fin:.2,h:-8}}));
}
fev([{id:'OWA-12',tier:'fact',own:['eager'],once:1,w:()=>fl('alone')||fl('small_tank')?3:1,
  log:'주인이 봉지 여러 개를 들고 들어왔습니다. 한 시간 뒤, 수조는 처음 보는 지느러미들로 가득 찼습니다.',
  p:()=>{fAddMates(isSp('@big')?3:5,true);return '봉지마다 색이 다른 물고기들이 들어 있었습니다. 물이 금세 탁해지고, 먹이가 떨어지는 자리마다 몸들이 부딪힙니다. {n}은…'},
  o:[
   {l:'새로 온 무리 쪽으로 다가간다',chk:['c',40],
    ok:()=>isSp('@schooling')?owa12({t:'주인이 아무 생각 없이 사 온 물고기들 덕분에, {n}은 처음으로 무리 속에서 잠들었습니다. 주인은 그 이유를 끝내 몰랐습니다. 함께 온 물고기 중 절반은 첫 달에 죽었습니다.',c:'good',fx:{st:-.2,c:1},set:{schooling_ok:1}})
      :isSp('@puffer')?owa12_hurt():owa12({t:'{n}은 새로 온 물고기들 사이에 섞였습니다.',fx:{st:.04}}),
    no:()=>owa12_hurt()},
   {l:'자기 자리를 지키며 다가오는 것을 밀어낸다',chk:['p',50],ok:()=>isSp('@predator')?owa12_hurt():owa12({t:'{n}은 자기 자리를 지켰습니다. 다른 물고기들이 그 자리를 비켜 갔습니다.',c:'good',fx:{p:2}}),
    no:()=>owa12({t:'밀어내던 {n}이 오히려 여럿에게 쫓겼습니다. 옆구리와 지느러미가 찢겼습니다.',c:'bad',fx:{fin:.15,h:-10},set:{inj_skin:1}})},
   {l:'은신처 가장 안쪽으로 물러난다',ok:()=>isSp('@puffer','@predator')?owa12_hurt():owa_roll('w',30)?owa12({t:'{n}은 은신처 안쪽에서 다툼이 가라앉을 때까지 지냈습니다.',fx:{w:1}}):owa12({t:'먹이가 떨어질 때마다 {n}은 밀려났습니다. 배가 홀쭉해졌습니다.',c:'bad',fx:{h:-8,fat:-.15}})}
  ]}]);
fevEnd({'OWA-12-D':{kind:'bad',cat:'합사',tier:'fact',fx:'f-nipped',fact:'fShopMix',pl:[[3,'검역 없이 한꺼번에 합사']],
  after:'주인은 "친구가 많아서 행복했을 거야"라고 말했습니다.',
  l:['새로 온 물고기들이 {n}의 꼬리지느러미를 쪼아 기조 사이 막을 조금씩 찢습니다. 찢긴 가장자리는 하얗게 일어납니다.','{n}은 은신처로 들어가지만 은신처마다 이미 다른 몸이 있습니다. {n}은 다시 밖으로 나와 헤엄칩니다.','지느러미가 기조만 남은 꼬리로 헤엄치느라 몸통 전체가 크게 흔들립니다. 상처 가장자리에 솜 같은 곰팡이가 핍니다.','과밀한 물에서 곰팡이는 아가미 가장자리까지 번집니다. {n}은 수면 구석에서 멈춥니다.']}});

/* EV-OWA-13 석 달 뒤 — 식은 의욕 (주인 교체) */
function owa13(b){
  const lv=isSp('@livebearer'),big=isSp('oscar','pleco')&&S.f.len>=fx_().cm*.5;
  const k=owa_next([['learner',3+b*4],['expert',b>0?1.5:.3],['casual',4-b],['relay',b<0?5:2]]);
  const title=lv?'"구피 50마리 일괄 나눔"':big?'"생각보다 커져서 보냅니다"':'"애지중지 키운 아이 좋은 분께"';
  return {t:'나눔 글 제목은 '+title+'이었습니다. 마지막 환수는 7주 전이었습니다.',c:'sub',fx:{i:-.3},run:()=>owa_to(k,'{n}은 수조와 장비째 새 주인에게 넘어갔습니다.',{note:'의욕이 식어 나눔'},()=>{S.f.heater=S.f.heater||(isSp('@tropical')?1:0);S.f.lid=1})};
}
fev([{id:'OWA-13',tier:'likely',own:['eager'],once:1,when:owa_ok,w:()=>owa_long(4)?1.2:.2,
  p:'처음 몇 주 동안 하루에 열 번씩 들여다보던 얼굴이 이제 일주일에 한 번 보입니다. 수조 유리에 녹색 막이 끼고, 휴대폰 사진 찍는 소리가 다시 들립니다. 이번 사진은 수조 전체를, 가격표처럼, 여러 각도에서 찍습니다. {n}은…',
  o:[
   {l:'카메라 앞으로 나와 몸을 돌린다',chk:['c',60],ok:()=>owa13(1),no:()=>owa13(0)},
   {l:'녹색 유리를 쪼며 이끼를 먹는다',ok:()=>Object.assign(owa13(0),{fx:{g:1,i:-.3}})},
   {l:'녹조 낀 구석에서 움직이지 않는다',ok:()=>owa13(-1)}
  ]}]);

/* ======================= D. 대충 키우는 사람 (casual) ======================= */

/* EV-OWA-14 여섯 달 만의 환수 [출처: 오래된 수조 증후군(old tank syndrome) — 질산염 축적·pH 하락 뒤 대량 환수 충격] */
function owa14(o){
  return Object.assign({},o,{run:()=>{setFl('near_miss',1);
    if(!o.end&&R()<.3){setFl('no_wc',1);S.f.lazy=1;addLog(T('주인은 "물 갈아 주면 죽는다더라"는 말을 믿게 되었습니다. 그 뒤로는 줄어든 만큼만 채웠습니다.'),'bad')}}});
}
function owa14h(need){
  const n=need+(owa_scl()?10:0)+(isSp('motoro')?5:0)-(isSp('@gold','koi','platy','pleco','channa')?10:0);
  return owa14(owa_hold(n,'OWA-14-D',{t:'{n}은 하루 종일 옆으로 기울었다 일어서기를 반복했습니다. 이튿날부터 조금씩 먹기 시작했습니다.',c:'bad',fx:{h:-18,st:.15},set:{inj_gill:1}}));
}
fev([{id:'OWA-14',tier:'fact',own:['casual'],cd:50,when:()=>!fl('no_wc'),w:()=>owa_long(6)?1.5:.3,
  p:()=>{S.f.wq=Math.min(S.f.wq,55);return '몇 달 동안 물은 줄어든 만큼만 수돗물로 채워졌습니다. 물은 옅은 홍차색이고, 유리에는 물때 줄이 여러 겹 생겼습니다. 오늘 주인이 소매를 걷습니다. 물의 대부분이 한 번에 빠지고, 차가운 새 물이 쏟아집니다. {n}은…'},
  o:[
   {l:'새 물이 쏟아지는 곳으로 다가가 본다',chk:['g',55],ok:()=>owa14({t:'{n}은 새 물 속에서 오히려 몸을 폈습니다.'+(isGold()?' 그 뒤로 눈에 띄게 활발해졌습니다.':'')+(isSp('oscar')?' 머리 옆 작은 구멍은 더 커지지 않았습니다.':''),c:'good',fx:{g:2,wq:35}}),no:()=>owa14h(50)},
   {l:'남은 옛 물이 고인 바닥 구석에 머문다',chk:['w',35],ok:()=>owa14({t:'{n}은 옛 물이 남은 구석에서 새 물이 섞일 때까지 버텼습니다.',c:'good',fx:{g:3,wq:35,h:-4}}),no:()=>owa14h(50)},
   {l:'수면에 떠서 숨을 쉰다',ok:()=>owa_air()?owa14({t:'{n}은 수면에서 공기를 마시며 하루를 버텼습니다.',fx:{wq:35,h:-6}}):owa14h(50)}
  ]}]);
fevEnd({'OWA-14-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',fact:'fTemp',pl:[[2,'몇 달 동안 물을 갈지 않다가 한 번에 바꿈']],
  after:'주인은 "물 갈아 주면 죽는다더니 진짜네"라고 말하고, 다음부터는 물을 갈지 않았습니다.',
  l:['몇 달 사이 산성으로 기운 물에 맞춰져 있던 몸이 한 시간 만에 전혀 다른 물에 놓입니다.','아가미 새엽 상피의 염분 조절이 따라가지 못합니다. 아가미 뚜껑이 빠르게 움직이다 불규칙해집니다.','{n}은 수조를 가로질러 헤엄치다 갑자기 멈추고, 몸을 옆으로 눕혔다가 다시 일어섭니다. 몇 번 반복할 때마다 일어서는 데 시간이 더 걸립니다.','피부 점막이 뿌옇게 떠오르고, 지느러미 끝이 붉게 충혈됩니다.','저녁에 주인이 깨끗해진 수조를 보러 왔을 때, {n}은 맑은 물 한가운데 옆으로 떠 있습니다.']}});

/* EV-OWA-15 친구에게 맡긴 휴가 [출처: 과잉 급여 → 용존산소 저하·암모니아 상승] */
function owa15(o){return Object.assign({},o,{run:()=>{setFl('near_miss',1);if(R()<.1){setFl('autofeeder',1);addLog(T('주인은 다음 휴가를 위해 자동 급여기를 샀습니다.'),'sub')}}})}
function owa15h(need){
  if(fl('owa15c'))return owa15({t:'친구는 셋째 날 "먹이가 그대로 있네" 하며 양을 줄였습니다. 물은 탁했지만 {n}은 버텼습니다.',fx:{h:-6,wq:-15}});
  const tough=isSp('@gold','pleco','koi','channa');
  if(tough&&fst().g>=capOf('g')*.85)return owa15({t:'일주일 뒤 돌아온 주인은 녹색 수프가 된 물속에서 두 배로 통통해진 {n}을 봤습니다. 친구는 "애가 너무 잘 먹더라"고 했습니다. 주인은 친구에게 다음 휴가도 부탁했습니다.',c:'good',fx:{fat:.3,wq:-30,h:-4}});
  return owa15(owa_hold(need,'OWA-15-D',Object.assign({t:'주인이 돌아왔을 때 물은 썩어 있었습니다. {n}은 수면에서 입을 뻐끔거리며 버티고 있었습니다.',c:'bad',fx:{h:-18,wq:-30,fat:.15}},isSp('cory','pleco','clownloach')&&R()<.4?{set:{inj_barbel:1}}:{})));
}
fev([{id:'OWA-15',tier:'fact',own:['casual','gift','eager'],cd:40,when:()=>!fl('autofeeder'),w:()=>['summer','winter'].includes(season())?1.5:.2,
  p:()=>{setFl('owa15c',R()<.3?1:0);return '주인이 큰 가방을 끌고 나간 다음 날, 낯선 사람이 들어옵니다. 그 사람은 먹이통을 들고 한참 망설이다가, 뚜껑을 열고 통을 기울입니다. 먹이가 수면을 덮습니다. 다음 날도, 그 다음 날도 같은 사람이 같은 양을 붓습니다. {n}은…'},
  o:[
   {l:'떠 있는 먹이를 계속 먹는다',chk:['g',50],ok:()=>owa15({t:'{n}은 다 먹고도 버텼습니다. 배가 둥글어졌습니다.',fx:{fat:.25,wq:-20}}),no:()=>owa15h(isSp('@gold','oscar','koi')?50:45)},
   {l:'먹지 않고 물살이 있는 쪽에 머문다',chk:['w',40],ok:()=>owa15({t:'{n}은 물살 쪽에서 휴가가 끝나기를 기다렸습니다.',c:'good',fx:{w:2,h:-4,wq:-20}}),no:()=>owa15h(40)},
   {l:'수초 아래로 내려가 쉰다',ok:()=>owa_air()&&!isSp('@bottom')?owa15({t:'{n}은 수면 공기로 숨을 이으며 버텼습니다. 아가미는 따끔거렸습니다.',fx:{h:-8,wq:-20}}):owa15h(45)}
  ]}]);
fevEnd({'OWA-15-D':{kind:'bad',cat:'과식',tier:'fact',fx:'f-float',fact:'fO2',pl:[[2,'휴가 동안 먹이를 맡김']],
  after:'주인은 친구에게 "괜찮아, 원래 잘 죽어"라고 답장했습니다. 선물로 사 온 열쇠고리를 건넸습니다.',
  l:['수면을 덮은 먹이가 가라앉아 바닥에서 썩습니다. 세균이 늘면서 물속 산소를 먼저 씁니다.','바닥 쪽 물은 산소가 거의 없고, 위쪽 물에는 암모니아가 녹아 있습니다. {n}은 그 사이를 오르내립니다.','아가미 새엽이 붓고, 피부에 붉은 반점이 번집니다. 먹이가 떨어질 때마다 {n}은 반사적으로 수면으로 올라갑니다.','나흘째 아침, 친구가 뚜껑을 열었을 때 수면에는 불은 먹이와 {n}이 함께 떠 있습니다.']}});

/* EV-OWA-16 이삿날 — 데려갈까, 올릴까 (주인 교체 가능) */
function owa16(b){
  const huge=isSp('oscar','arowana','gar','koi','pleco')&&S.f.len>=fx_().cm*.4;
  const give=clamp((huge?.8:.5)+(tankL()>=160?.1:0)-b,.05,.95);
  if(R()>=give)return {t:'주인은 {n}을 데려가기로 했습니다.'+(isSp('betta','guppy')?' {n}은 작은 컵에 담겨 차 조수석에 실렸습니다.':''),c:'sub',fx:season()==='summer'&&isSp('betta','guppy')?{h:-10,st:.1}:{},run:()=>fMove()};
  const k=owa_next([['relay',4],['casual',3],['eager',2],['learner',fst().c>=50?3:1]]);
  return {t:'나눔 글에는 "이사 때문에 어쩔 수 없이"라고 쓰여 있었습니다. 새 집 사진에는 같은 자리에 새 수조가 있었습니다.',c:'bad',run:()=>owa_to(k,isSp('koi')?'"수조 통째 무료 나눔, 직접 가져가셔야 함." {n}은 물이 반쯤 빠진 수조째 실려 갔습니다.':'{n}은 나눔 글을 보고 온 사람에게 넘어갔습니다.',{note:'이사하며 나눔'})};
}
fev([{id:'OWA-16',tier:'likely',own:['casual'],once:1,when:owa_ok,w:.5,
  p:'방이 비어 갑니다. 마지막까지 남은 건 수조뿐입니다. 주인이 수조와 현관을 번갈아 봅니다. 주인이 휴대폰으로 무언가를 오래 씁니다. 한 번 지웠다가 다시 씁니다. {n}은…',
  o:[
   {l:'주인 쪽 유리 앞에서 멈춰 바라본다',chk:['c',50],ok:()=>owa16(.3),no:()=>owa16(0)},
   {l:'평소처럼 먹이 떨어지는 자리를 맴돈다',ok:()=>owa16(0)},
   {l:'바닥에 내려가 움직이지 않는다',ok:()=>owa16(-.1)}
  ]}]);

/* ======================= E. 얼떨결에 키우게 된 집 (gift) ======================= */

/* EV-OWA-17 축제 봉지와 김치통 [출처: 축제 금붕어 뽑기 운송·사육 실태] */
function owa17(o){
  return Object.assign({},o,{set:Object.assign({chlorine:1},o.set||{}),run:()=>{
    if(o.end)return;
    const buy=R()<.5+(fst().c-40)/120;
    if(buy){const up=TANKS.find(t=>t.k==='t30');q(T('다음 날 아이가 졸라 대자 부모가 "어항이라도 사야지" 하며 작은 어항을 사 왔습니다. 물은 또 수돗물이었습니다.'),'sub',()=>{S.f.tank=up.k;S.f.cycled=0;S.f.tankAge=0})}
    else q(T('{n}은 반찬통에서 계속 지냈습니다.'),'bad',()=>{S.f.tank='bowl';S.f.wq-=10;if(isSp('comet'))setFl('stunted',1)});
    if(isSp('ryukin')&&R()<.3)fSick('swimb');
    if(isSp('betta'))setFl('small_ok',1);}});
}
function owa17h(need){return owa17(owa_hold(need+(isSp('guppy')?5:0),'OWA-17-D',{t:'{n}은 밤새 아가미를 빠르게 움직이며 버텼습니다.',c:'bad',fx:{h:-15,st:.15}}))}
fev([{id:'OWA-17',tier:'fact',own:['gift'],once:1,sp:['comet','guppy','ryukin','betta','oranda'],w:()=>owa_new()?(isSp('comet')?6:4):0,
  p:'손잡이 달린 작은 비닐봉지가 하루 종일 흔들립니다. 저녁에 봉지가 열리고, {n}은 플라스틱 반찬통에 부어집니다. 통은 좁고, 물은 방금 받은 수돗물입니다. 식탁 위 조명이 밤새 켜져 있습니다. {n}은…',
  o:[
   {l:'통 가장자리를 따라 계속 헤엄친다',chk:['g',50],ok:()=>owa17({t:'{n}은 밤새 통 가장자리를 돌며 버텼습니다.',fx:{g:2,h:-6}}),no:()=>owa17h(45)},
   {l:'수면에 입을 대고 머문다',ok:()=>owa_air()?owa17({t:'{n}은 수면 공기를 마시며 첫날을 넘겼습니다.',fx:{h:-5}}):owa17h(40)},
   {l:'통 바닥에 가만히 가라앉아 있는다',chk:['g',45],ok:()=>owa17({t:'{n}은 통 바닥에서 아침을 기다렸습니다.',fx:{g:1,h:-6}}),no:()=>owa17h(45)}
  ]}]);
fevEnd({'OWA-17-D':{kind:'bad',cat:'경품',tier:'fact',fx:'f-bag',fact:'fFair',pl:[[2,'반찬통에 수돗물']],
  after:'아이는 학교에서 그 얘기를 하지 않았습니다. 다음 해 축제에서 아이는 또 뽑기를 했습니다.',
  l:['봉지 속에서 하루 동안 쌓인 암모니아에 이미 아가미 새엽이 부어 있습니다. 반찬통의 수돗물에서 잔류 염소가 그 새엽에 닿습니다.','{n}은 통 가장자리를 돌다가 수면으로 올라가고, 다시 가장자리를 돕니다. 지느러미 끝이 통 벽에 쓸려 해집니다.','아가미 뚜껑 가장자리가 붉게 변하고, 움직임이 짧고 빨라집니다.','아침에 아이가 통을 들여다봤을 때, {n}은 수면에 옆으로 떠서 식탁 조명을 받고 있습니다.']}});

/* EV-OWA-18 쥐어 보고 싶은 손 [출처: 손으로 만질 때 어류 점막·내부 손상] */
function owa18_grab(){
  if(isSp('cory'))return R()<.7?{t:'작은 손이 {n}을 움켜쥐었다가 "앗!" 하고 놓았습니다. 가슴 가시가 손가락을 찔렀습니다. 아이는 울었고, {n}은 물속으로 떨어졌습니다.',c:'bad',fx:{h:-6,st:.15},set:{slime_loss:1},near:'lid'}
    :{t:'가슴 가시가 아이 손바닥 피부에 걸렸습니다. 아이가 손을 털자 {n}이 같이 끌려 나와 바닥에 떨어졌습니다. 부모가 주워 넣었습니다.',c:'bad',fx:{h:-18,st:.2},set:{slime_loss:1},near:'lid'};
  const r=R()+fst().g/200;
  if(r>.75)return {t:'작은 손이 {n}을 잡았다 놓았습니다. 손이 닿은 자리의 점막이 벗겨졌습니다.'+(isSp('betta')?' 긴 지느러미가 손가락에 감겨 찢겼습니다.':''),c:'bad',fx:{h:-8,st:.1,fin:isSp('betta')?.2:0},set:{slime_loss:1},near:'lid'};
  if(r>.4)return owa_hold(isSp('guppy','platy')?55:45,'OWA-18-D',{t:'손에서 풀려난 {n}은 한동안 옆으로 기운 채 헤엄쳤습니다.',c:'bad',fx:{h:-18,st:.15},set:{slime_loss:1,inj_spine:1},near:'lid'});
  return {t:'손가락 사이로 미끄러진 {n}이 수조 밖 바닥에 떨어졌습니다.',c:'bad',run:()=>{if(!S.waiting)q(null,null,()=>fCr('jump'))},near:'lid'};
}
fev([{id:'OWA-18',tier:'fact',own:['gift'],cd:30,need:{lid:0},sp:['@gold','guppy','platy','betta','cory'],w:()=>fl('kids')?2:1,
  p:'뚜껑 없는 수조 위로 작은 손이 내려옵니다. 손이 물을 휘젓고, 먹이통이 통째로 기울고, 장난감 하나가 바닥으로 떨어집니다. 손가락이 {n}의 꼬리 근처를 스칩니다. {n}은…',
  o:[
   {l:'손이 닿지 않는 반대편으로 빠르게 헤엄친다',chk:['p',35],ok:{t:'{n}은 손이 닿지 않는 구석까지 달아났습니다. 손은 한참 물을 휘젓다 나갔습니다.',c:'good',fx:{p:2,st:.05}},no:()=>owa18_grab()},
   {l:'손가락 끝을 따라 다가가 본다',chk:['c',60],ok:{t:'아이가 손가락을 따라오는 {n}을 보고 웃었습니다. 그날부터 놀이는 "먹이 주기"가 되었습니다.',c:'good',fx:{c:2,i:.1,wq:-8,fat:.1}},no:()=>owa18_grab()},
   {l:'장식 동굴 안으로 들어간다',ok:()=>{if(owa_roll('w',30))return {t:'{n}은 동굴 안에서 손이 나갈 때까지 기다렸습니다.',fx:{w:1},set:R()<.3?{toxin:'paint'}:{}};const g=owa18_grab();return Object.assign({},g,{t:'아이가 동굴째 들어 올렸습니다. '+(g.t||'')})}}
  ]}]);
fevEnd({'OWA-18-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-hand',fact:'fLaw',pl:[[3,'뚜껑 없는 수조에 아이 손']],
  after:'부모는 아이에게 "물고기가 하늘나라에 갔어"라고 말했습니다. 아이는 그날 이후 수조에 손을 넣지 않았습니다.',
  l:['작은 손가락이 {n}의 몸통을 감쌉니다. {n}은 꼬리를 세게 휘두르며 빠져나가려 합니다.','손가락이 놀라 오므라듭니다. 늑골이 안쪽으로 눌리고, 복강 안의 부레가 압박받습니다. 몸 표면의 점막이 손바닥에 묻어 벗겨집니다.','손이 펴지자 {n}은 물속으로 떨어지며 옆으로 기웁니다. 바로 서려고 지느러미를 저을수록 몸이 한쪽으로 돕니다.','점막이 벗겨진 옆구리에 하루 만에 하얀 솜이 핍니다. 사흘째, {n}은 장난감 옆 바닥에 눕습니다.']}});

/* EV-OWA-19 꽃병 속 베타 [출처: 베타 화병(peace lily vase) 사육 유행과 베타 식성(육식)] */
function owa19(o,need){
  if(R()<.15+(fst().c>=60?.1:0))return {t:'선물한 사람이 놀러 와서 꽃병을 보고 물었습니다. "밥은 주지?" 그날 주인은 작은 어항과 먹이를 사 왔습니다.',c:'good',fx:{h:-4},set:{fed_ok:1},run:()=>{S.f.tank='t20';S.f.heater=0}};
  if(o)return o;
  return owa_hold(need+(season()==='winter'&&isSp('@tropical')?10:0),'OWA-19-D',{t:'몇 주 동안 먹이가 없었습니다. {n}의 배가 안쪽으로 오목해졌습니다.',c:'bad',fx:{h:-15,fat:-.25},set:{thin:1}});
}
fev([{id:'OWA-19',tier:'fact',own:['gift'],sp:['betta','wildbetta','comet','guppy'],cd:20,when:()=>!fl('fed_ok'),w:()=>owa_new()?(isSp('betta')?6:1.5):(fl('owa19')?1:0),
  p:()=>{setFl('owa19',1);S.f.tank=isSp('@labyrinth')?'vase':'bowl';return isSp('@labyrinth')?'투명한 꽃병 위로 초록 잎을 단 식물이 꽂혀 있습니다. 하얀 뿌리가 물속으로 길게 내려와 있습니다. 카드에는 "물고기가 뿌리를 먹고 식물은 물을 깨끗하게 해요. 밥 안 줘도 돼요"라고 적혀 있습니다. {n}은…'
    :'작은 유리 어항 위에 리본이 묶여 있습니다. 카드에는 "손 안 가는 물고기 세트"라고 적혀 있습니다. 먹이는 세트에 들어 있지 않았습니다. {n}은…'},
  o:[
   {l:()=>isSp('@labyrinth')?'뿌리 사이를 헤집고 먹을 것을 찾는다':'어항 바닥을 헤집고 먹을 것을 찾는다',chk:['w',40],ok:()=>owa19({t:'{n}은 뿌리 사이의 작은 벌레들로 몇 주를 버텼습니다.',fx:{w:2,h:-6,fat:-.1}}),no:()=>owa19(null,isSp('@labyrinth')?45:40)},
   {l:'좁은 수면 틈으로 올라가 공기를 마신다',chk:['g',40],ok:()=>owa19({t:'{n}은 잎 사이 틈으로 공기를 마시며 버텼습니다.',fx:{g:2,h:-6}}),no:()=>owa19(null,45)},
   {l:()=>isSp('@labyrinth')?'뿌리 아래 바닥에 가만히 있는다':'어항 바닥에 가만히 있는다',ok:()=>owa19(null,40)}
  ]}]);
fevEnd({'OWA-19-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',fact:()=>isSp('betta')?'fBetta':'fBowlAny',pl:[[2,'먹이를 주지 않음']],
  after:'주인은 선물한 사람에게 아무 말도 하지 않았습니다. 식물은 그 뒤로도 잘 자랐습니다.',
  l:()=>['먹이가 없는 날이 몇 주 이어집니다. 몸은 근육과 간에 저장해 둔 것을 차례로 씁니다.','등 근육이 빠지면서 등지느러미 아래가 움푹 꺼지고, 배가 안쪽으로 오목해집니다.',isSp('@labyrinth')?'{n}은 수면에 올라가 공기를 마시려 하지만, 식물 잎이 꽃병 입구를 덮고 있습니다. 잎 사이 틈으로 입을 들이밀었다가 미끄러져 내려옵니다.':'{n}은 어항 바닥 자갈을 물었다 뱉기를 반복합니다.',season()==='winter'?'겨울 밤, 수온이 떨어지면서 움직임이 더 느려집니다. {n}은 몸 색이 바랜 채 멈춥니다.':'{n}은 바닥에 몸을 기댄 채, 몸 색이 바랜 상태로 멈춥니다.']}});

/* EV-OWA-20 아이는 이제 축구를 한다 (주인 교체) */
function owa20(b){
  const r=owa_next([['stay',b>0?4:1],['shared',isSp('@gold','guppy','cory','pleco')?3:1.5],['grandma',isSp('oranda','koi','comet')?2.5:1+(b>0?1:0)],['relay',b<0?3:1.5]]);
  if(r==='stay')return {t:'아이가 다시 수조 앞에 쪼그려 앉기 시작했습니다. 어른들은 {n}을 그냥 두기로 했습니다.',c:'good',fx:{i:.25}};
  if(r==='shared'){
    if(isSp('cory','comet','pleco')&&R()<.3)return {t:'아이는 {n}을 학교 교실 수조로 가져갔습니다.',c:'sub',end:'OWA-20-H'};
    return {t:'아이는 {n}을 학교 교실에 기증했습니다.',c:'sub',run:()=>fRehome('교실 어항 이름표에는 아이가 붙인 이름 대신 "3반 물고기"라고 적혔습니다.',{own:'casual',tank:'t45',place:'classroom',name:'3학년 3반',note:'교실에 기증'})};
  }
  if(r==='grandma')return {t:'어른 하나가 할머니 댁에 전화를 걸었습니다.',c:'sub',run:()=>owa_to('grandma','{n}은 할머니 댁 거실로 갔습니다.',{note:'할머니 댁에 보냄'})};
  return {t:'"애가 이제 안 봐서요." 어른 하나가 나눔 글을 올렸습니다.',c:'bad',run:()=>owa_to('relay',isSp('pleco')?'교실도 할머니 댁도 커다란 {n}을 거절했습니다. {n}은 나눔 글로 넘어갔습니다.':'{n}은 나눔 글로 넘어갔습니다.',{note:'관심이 식어 나눔'})};
}
fev([{id:'OWA-20',tier:'likely',own:['gift'],once:1,when:owa_ok,w:()=>S.interest<.4?2:.3,
  p:'수조 앞에 서 있던 아이가 이제는 공을 들고 그 앞을 지나갑니다. 먹이는 어른이 생각날 때 줍니다. 어느 날 어른 둘이 수조를 가리키며 오래 이야기합니다. 한 사람은 고개를 젓고, 한 사람은 휴대폰으로 누군가에게 전화를 겁니다. {n}은…',
  o:[
   {l:'아이가 지나갈 때 유리 앞까지 따라 나간다',chk:['c',55],ok:()=>owa20(1),no:()=>owa20(0)},
   {l:'어른이 먹이를 줄 때만 올라온다',ok:()=>owa20(0)},
   {l:'은신처에 머문다',ok:()=>owa20(-1)}
  ]}]);
fevEnd({'OWA-20-H':{kind:'happy',cat:'3반 물고기',tier:'story',fx:'f-rest',
  l:['교실 어항 이름표에는 아이가 붙인 이름 대신 "3반 물고기"라고 적혔습니다.','{n}은 그 이름으로 3년을 더 살았습니다. 그사이 담임이 두 번 바뀌었고, 먹이 당번은 매 학기 새로 뽑혔습니다.','{n}을 처음 데려온 아이는 졸업할 때까지 한 번도 어항 앞에 서지 않았습니다.']}});

/* ======================= F. 번식이 취미인 사람 (breeder) ======================= */

/* EV-OWA-21 합방 — 산란 다음 날 [출처: 베타 번식 시 수컷의 산란 후 암컷 공격, 금붕어 산란 쫓기] */
function owa21(o,need){
  addFl('breeding_count');
  if(fl('owa21s'))return {t:'주인이 아침 일찍 와서 {n}을 다른 통으로 옮겼습니다.',c:'good',fx:{h:-3}};
  if(o)return o;
  const male=!fem()&&isSp('betta','wildbetta');
  if(male)return isSp('wildbetta')?{t:'{n}은 알을 입에 품고 몇 주를 굶었습니다. 몸이 눈에 띄게 말랐습니다.',fx:{h:-10,fat:-.3},set:{thin:1}}
    :{t:'{n}은 거품집 밑을 지키며 상대를 쫓았습니다. 주인은 늦게 와서 거품집만 챙겼습니다. 상대는 다음 날 보이지 않았습니다.',c:'bad',fx:{st:.05}};
  if(isSp('cory'))return {t:'산란은 조용히 끝났습니다. {n}은 조금 지쳤습니다.',fx:{h:-3}};
  const hurt={t:isSp('oranda','ryukin')?'수컷들이 {n}을 수초와 벽에 밀어붙이며 밤새 쫓았습니다. 몸의 점막이 쓸려 벗겨졌습니다.':isSp('@livebearer')?'수컷 여럿이 {n}을 쉬지 않고 쫓았습니다. 지느러미가 찢겼습니다.':'상대가 {n}을 몇 번 물었습니다. 지느러미가 찢기고 비늘 몇 장이 떨어졌습니다.',c:'bad',fx:{h:-14,fin:.2,st:.12},set:{inj_fin:1}};
  return owa_hold(need,'OWA-21-D',hurt);
}
fev([{id:'OWA-21',tier:'fact',own:['breeder'],cd:30,sp:['betta','wildbetta','apisto','guppy','platy','oranda','ryukin','cory'],w:()=>fl('age')<.15?0:isSp('betta')?4:2,
  p:()=>{setFl('owa21s',R()<S.r*.85?1:0);const male=!fem()&&isSp('betta','wildbetta');
    return male?'작은 수조 안에 다른 개체 하나가 들어옵니다. {n}은 몸을 크게 펴고 수면에 거품을 쌓습니다. 밤새 몸을 감싸고 알을 받은 뒤, 상대가 거품집 근처를 맴돕니다. 주인은 아직 오지 않았습니다. {n}은…'
      :isSp('apisto')?'굴 하나를 사이에 두고 상대가 들어옵니다. 굴 안에 알이 붙자, 굴을 지키는 쪽이 다른 쪽을 향해 돌진하기 시작합니다. 주인은 아직 오지 않았습니다. {n}은…'
      :'작은 수조 안에 다른 개체가 들어옵니다. 상대는 몸을 크게 펴고, 밤새 {n}을 쫓습니다. 알이 바닥과 수초에 붙은 뒤에도 쫓기는 멈추지 않습니다. 주인은 아직 오지 않았습니다. {n}은…'},
  o:[
   {l:'맞서서 같이 지느러미를 편다',chk:['p',55],ok:()=>owa21({t:'{n}이 물러서지 않자 상대가 먼저 거리를 두었습니다.',c:'good',fx:{p:2,h:-4}}),no:()=>owa21({t:'맞서던 {n}이 물렸습니다. 지느러미와 옆구리가 크게 찢겼습니다.',c:'bad',fx:{h:-18,fin:.25,st:.1},set:{inj_fin:1,inj_skin:1}})},
   {l:'수조 반대편 수초 뭉치 속으로 들어간다',chk:()=>['w',isSp('@livebearer')?30:40],ok:()=>owa21({t:'{n}은 수초 뭉치 속에서 아침까지 들키지 않았습니다.',c:'good',fx:{w:2}}),no:()=>owa21(null,50)},
   {l:'수면 구석에서 머리를 낮추고 몸을 접는다',ok:()=>owa21(null,45)}
  ]}]);
fevEnd({'OWA-21-D':{kind:'bad',cat:'번식',tier:'fact',fx:'f-nipped',fact:'fBreed',pl:[[4,'산란 뒤 분리하지 않음']],
  after:'주인은 {n}을 장부에서 지우고, 알 사진을 동호회에 올렸습니다. "부화 시작했어요."',
  l:['상대가 {n}의 옆구리를 물고 놓습니다. 비늘 몇 장이 떨어지고 그 아래 상피가 드러납니다.','{n}은 수초 뭉치로 들어가지만, 수초는 몸을 다 가리지 못합니다. 상대는 알 곁으로 돌아갔다가 다시 옵니다.','지느러미 막이 기조 사이마다 찢어져 너덜거립니다. 찢어진 자리마다 피가 가늘게 번집니다.','새벽, {n}은 수면 구석에서 기울어진 채 아가미만 움직입니다. 그 위로 상대가 떨어진 알을 하나씩 물어 제자리에 다시 붙입니다.']}});

/* EV-OWA-22 도태 — 꼬리 모양이 맞지 않는다 [출처: 관상어(베타·구피·금붕어) 번식 선별(culling) 관행, 도태 개체 생먹이 사용] */
function owa22_judge(){
  const need=isSp('platy')?45:55;
  if(R()<clamp(Math.pow(fst().c/need,2),.05,.95)){
    if(R()<.4)return {t:'{n}은 "같은 배 최상급"으로 사진이 찍혔습니다. 같은 배에서 난 형제 중 사진이 찍힌 건 셋이었습니다. 나머지는 그날 오스카가 먹었습니다.',c:'good',fx:{c:2},set:{graded:'top'}};
    return {t:'{n}은 판매 등급을 받았습니다. 며칠 뒤 수족관으로 가는 봉지에 담겼습니다.',c:'sub',set:{graded:'sale'},run:()=>owa_rehome('{n}은 수족관 판매 수조를 거쳐 새 주인에게 팔렸습니다.',null,null,{note:'번식장에서 판매'})};
  }
  setFl('graded','cull');return {end:'OWA-22-D'};
}
fev([{id:'OWA-22',tier:'fact',own:['breeder'],once:1,sp:['betta','guppy','oranda','ryukin','apisto','platy'],w:()=>fl('age')<.3?5:0,
  p:'치어통에 수백 마리가 함께 헤엄칩니다. 매일 저녁 그물이 들어와 몇 마리씩 떠서 다른 통으로 옮깁니다. 옮겨진 통의 물고기들은 다시 보이지 않습니다. 오늘 그물이 {n}이 있는 쪽으로 천천히 내려옵니다. 주인은 확대경을 들고 있습니다. {n}은…',
  o:[
   {l:'그물 앞에서 지느러미를 최대한 펴고 머문다',ok:()=>owa22_judge()},
   {l:'무리 한가운데로 파고든다',chk:['w',35],ok:{t:'그물은 {n}을 비켜 갔습니다. 다음 선별까지는 며칠이 남았습니다.',c:'good',fx:{w:2}},no:()=>owa22_judge()},
   {l:'통 바닥 구석에 붙는다',ok:()=>R()<.5?{t:'그물은 오늘 바닥까지 내려오지 않았습니다.',fx:{st:.05}}:owa22_judge()}
  ]}]);
fevEnd({'OWA-22-D':{kind:'bad',cat:'도태',tier:'fact',fx:'f-eaten',fact:()=>isSp('betta')?'fCulled':'fBreed',pl:[[4,'선별에서 떨어진 치어를 먹이로 줌']],
  after:'주인은 {n}을 장부에 적지 않았습니다. 적기 전이었습니다.',
  l:['{n}은 그물째 오스카 수조 위로 옮겨집니다. 그물이 뒤집힙니다.','{n}은 수면 바로 아래에서 바로 몸을 돌려 바닥 쪽으로 헤엄칩니다. 오스카의 입이 열리며 물이 빨려 들어갑니다.','몸이 통째로 입안으로 들어가고, 인두치가 몸통을 누릅니다. 늑골이 꺾이고 복강이 터집니다.','오스카의 아가미 틈으로 비늘 몇 장과 지느러미 조각이 흘러나옵니다.']}});

/* EV-OWA-23 종어의 계절 [출처: 구피 정자 저장·연속 출산, 난태생어 난산] */
function owa23(o,need){
  addFl('breeding_count');
  if(o)return o;
  const n=need+fl('breeding_count')*3-(fst().c>=70?10:0);
  return owa_hold(n,'OWA-23-D',{t:fem()?'출산이 끝났습니다. {n}은 칸막이 구석에서 한참 움직이지 않았습니다.':'{n}은 상대가 보이는 통에서 며칠씩 지느러미를 펴고 있었습니다. 지느러미 끝이 해졌습니다.',c:'bad',fx:{h:-14,fat:-.15,fin:fem()?0:.15},set:{thin:1}});
}
fev([{id:'OWA-23',tier:'fact',own:['breeder'],cd:20,sp:['guppy','platy','betta','apisto','oranda','cory'],
  w:()=>(fl('graded')==='top'||fl('breeding_count')>=2)?3:(fl('age')>.2?.3:0),
  p:()=>fem()?'배가 다시 부풉니다. 지난번 출산 뒤 얼마 지나지 않았습니다. 주인은 {n}을 그물 칸막이가 있는 작은 통으로 옮기고, 하루에 세 번 진한 먹이를 넣습니다. 몸은 무겁고, 칸막이 아래로 작은 것들이 빠져나갑니다. {n}은…'
    :'좁은 통 옆에 상대가 보이는 통이 붙어 있습니다. 주인은 하루에 세 번 진한 먹이를 넣고, 합방 날을 기다립니다. {n}의 몸은 늘 긴장해 있습니다. {n}은…',
  o:[
   {l:'넣어 주는 먹이를 모두 먹는다',chk:()=>['g',50+Math.min(20,fl('breeding_count')*5)],ok:()=>owa23({t:'{n}은 잘 먹고 회복했습니다. 주인은 다음 날짜를 장부에 적었습니다.',fx:{g:2,h:4}}),no:()=>owa23(null,50)},
   {l:'칸막이 구석에서 쉬려고 몸을 붙인다',ok:()=>owa23(fem()&&isSp('@livebearer')&&R()<.3?{t:'출산 직후, {n}은 칸막이 사이로 빠져나가지 못한 새끼 하나를 삼켰습니다.',fx:{h:3}}:{t:'{n}은 구석에서 몸을 쉬었습니다.',fx:{h:6}})},
   {l:'통 안을 천천히 계속 돈다',chk:['g',40],ok:()=>owa23({t:'{n}은 버텼습니다.',fx:{g:1,h:-4}}),no:()=>owa23(null,45)}
  ]}]);
fevEnd({'OWA-23-D':{kind:'bad',cat:'번식 소모',tier:'fact',fx:'f-bottom',fact:'fBreed',pl:[[4,'쉬지 않고 번식시킴']],
  l:()=>fem()&&isSp('@livebearer')?['산도 앞에 새끼 한 마리가 걸려 나오지 않습니다. 배 근육이 계속 수축합니다.','{n}은 칸막이 그물에 몸을 대고 꼬리를 세게 휘두릅니다. 휘두를 때마다 배 아래쪽 피부가 붉게 부어오릅니다.','걸린 새끼는 반쯤 나온 채 움직이지 않습니다. 몇 시간 뒤 {n}의 움직임이 점점 짧아집니다.','아침에 칸막이 아래에는 살아 있는 치어 열두 마리가 헤엄치고, 위에는 {n}이 기울어진 채 걸려 있습니다.']
    :['산란과 회복 사이의 간격이 짧아집니다. 간에 저장해 둔 것이 다 쓰이고, 등 근육이 빠집니다.','{n}은 통 바닥에서 몸을 일으키려 가슴지느러미를 젓습니다. 지느러미 끝은 해져 있습니다.','진한 먹이가 바닥에 남아 썩습니다. 지친 아가미 새엽이 그 물에 붓습니다.','다음 합방 날 아침, {n}은 통 구석에서 아가미를 멈춘 채 떠 있습니다.']}});

/* EV-OWA-24 은퇴 종어 일괄 분양 (주인 교체) */
function owa24(o){
  const k=owa_next([['learner',fst().c>=60?5:3],['eager',3],['breeder',1.5]]);
  return Object.assign({},o||{},{run:()=>owa_to(k,'"은퇴 종어 일괄." {n}은 같은 통의 물고기들과 한 봉지에 담겨 새 주인에게 갔습니다.',{note:'은퇴 종어 일괄 분양'},()=>{
    if(fem()&&isSp('@livebearer')){setFl('birth_after_move',1);const m=S.f.mates.find(m=>m.id===S.sp.id);if(m)m.n+=20;else S.f.mates.push({id:S.sp.id,n:20,cm:1.2});
      q(T('새 주인은 "은퇴한 엄마 구피"를 데려와 첫 주에 치어 스무 마리를 봤습니다. 주인은 "번식 쉽네"라며 브리더 동호회에 가입했습니다.'),'sub')}
    if(isSp('oranda','ryukin')&&R()<.3)fSick('swimb')})});
}
fev([{id:'OWA-24',tier:'likely',own:['breeder'],once:1,when:owa_ok,sp:['guppy','platy','betta','apisto','oranda','ryukin','cory'],w:()=>fl('breeding_count')>=3?4:.3,
  p:'통 위에 테이프가 붙습니다. 글씨는 "은퇴 · 일괄"입니다. 주인은 한 마리씩 사진을 찍지 않고, 통 전체를 한 번에 찍습니다. 며칠 뒤 같은 통의 물고기들이 하나의 봉지에 담깁니다. {n}은…',
  o:[
   {l:'봉지 안에서 다른 개체와 떨어진 자리를 찾는다',chk:['w',40],ok:()=>owa24({t:'{n}은 봉지 구석에서 다툼을 피했습니다.',fx:{w:2}}),no:()=>owa24({t:'봉지 안에서 {n}의 지느러미가 다른 몸에 찢겼습니다.',c:'bad',fx:{fin:.15,h:-6}})},
   {l:'봉지 아래쪽에 몸을 낮춘다',ok:()=>owa24(owa_roll('g',45)?{t:'{n}은 봉지 바닥에서 운송을 버텼습니다.',fx:{g:1}}:{t:'운송 동안 {n}은 지쳤습니다.',c:'bad',fx:{h:-10,st:.1}})},
   {l:'함께 담긴 무리 사이에 섞인다',ok:()=>owa24({t:'{n}은 무리 사이에서 흔들림을 견뎠습니다.',fx:isSp('@schooling')?{st:-.05}:{st:.05},set:isSp('cory')?{schooling_ok:1}:{}})}
  ]}]);

/* ======================= G. 영상·SNS 주인 (content) ======================= */

/* EV-OWA-25 부풀려 주세요 (숏폼) [출처: 복어가 공기로 부풀 때의 위험(공기 배출 실패), 베타 장시간 거울 노출 스트레스] */
const owa25g=()=>isSp('@puffer')?'puff':isSp('betta','wildbetta','apisto','oscar')?'mirror':'hand';
function owa25_air(){return owa_hold(40,'OWA-25-D',{t:'{n}은 한참 수면에 뒤집혀 떠 있다가, 입으로 공기를 조금씩 뱉어 내고 가라앉았습니다.',c:'bad',fx:{h:-15,st:.15},set:{viral:1},run:owa25_learn})}
function owa25_learn(){setFl('near_miss',1);if(R()<.5){setFl('no_inflate',1);addLog(T('"복어를 공기로 부풀리면 죽어요" 댓글이 쌓였습니다. 주인은 "몰랐어요, 앞으로 조심할게요"라는 영상을 올렸습니다.'),'sub')}else addLog(T('영상 조회수는 높았습니다. 주인은 비슷한 영상을 하나 더 찍기로 했습니다.'),'bad')}
function owa25_side(){
  if(owa25g()==='mirror')return owa_roll('g',45)?{t:'"거울 보여 주면 화내요" 영상이 올라갔습니다. {n}은 그날 저녁 지쳐 바닥에 누웠습니다.',fx:{h:-4,c:1},set:{viral:1,flare:1}}
    :{t:'거울 촬영은 며칠 동안 하루 몇 시간씩 이어졌습니다. {n}의 지느러미 끝이 해지기 시작했습니다.',c:'bad',fx:{h:-10,fin:.15,st:.12},set:{viral:1},run:()=>{if(isSp('betta')&&R()<.4)fSick('finrot')}};
  return {t:'주인은 {n}을 손바닥에 올려 물 밖에서 촬영했습니다. 손이 닿은 자리의 점막이 벗겨졌습니다.',c:'bad',fx:{h:-8,st:.1},set:{viral:1,slime_loss:1}};
}
fev([{id:'OWA-25',tier:'fact',own:['content'],cd:30,sp:['@puffer','betta','wildbetta','apisto','oscar','@gold','koi'],when:()=>!fl('no_inflate'),w:()=>isSp('@puffer')?3:1,
  p:()=>owa25g()==='puff'?'환한 조명이 수조 위에 켜지고, 휴대폰이 유리에 바짝 붙습니다. 손가락이 물속으로 들어와 {n}의 옆구리를 톡톡 건드립니다. 손가락이 물러났다가 다시 옵니다. 이번엔 손바닥이 {n}을 감싸 수면 쪽으로 들어 올립니다. {n}은…'
    :owa25g()==='mirror'?'환한 조명이 켜지고, 휴대폰이 유리에 바짝 붙습니다. 수조 앞에 작은 거울이 세워집니다. 거울 속에서 낯선 개체가 {n}을 노려봅니다. {n}은…'
    :'환한 조명이 켜지고, 휴대폰이 유리에 바짝 붙습니다. 손바닥이 물속으로 들어와 {n} 밑을 받칩니다. 손바닥이 천천히 수면 쪽으로 올라옵니다. {n}은…',
  o:[
   {l:()=>owa25g()==='puff'?'몸을 부풀려 버틴다':owa25g()==='mirror'?'아가미를 펴고 거울 속 상대에게 맞선다':'손바닥 위에서 가만히 있는다',
    ok:()=>owa25g()==='puff'?(R()<.4?{t:'{n}은 물속에서 물로 부풀었다가 금방 가라앉았습니다. 촬영은 "실패"였습니다.',fx:{st:.06},set:{viral:1}}:owa25_air()):owa25_side()},
   {l:()=>owa25g()==='puff'?'손가락 사이로 빠져나가려 몸을 비튼다':'몸을 비틀어 빠져나간다',chk:['w',50],ok:{t:'{n}은 손가락 사이로 빠져나가 수초 밑으로 들어갔습니다. 촬영은 실패했습니다.',c:'good',fx:{w:2,st:.04}},no:()=>owa25g()==='puff'?owa25_air():owa25_side()},
   {l:'바닥 수초 밑에 바짝 붙어 움직이지 않는다',chk:['w',35],ok:{t:'주인은 한참 기다리다 "오늘은 안 되겠다"며 조명을 껐습니다.',fx:{w:1}},no:()=>owa25g()==='puff'?owa25_air():owa25_side()}
  ]}]);
fevEnd({'OWA-25-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-hand',fact:'fPea',pl:[[3,'촬영하려고 물 밖으로 들어 올림']],
  after:'주인은 추모 영상을 올렸습니다. 조회수는 생전 영상보다 높았습니다.',
  l:['{n}은 물 밖에서 입으로 공기를 삼켜 위를 부풀립니다. 피부가 팽팽하게 늘어나고, 가시가 섭니다.','손이 {n}을 다시 물에 넣습니다. {n}은 수면에 뒤집힌 채 떠서 배를 위로 한 채 돕니다.','공기를 다시 내보내려고 입을 여닫고 몸을 비틉니다. 공기는 일부만 빠지고, 늘어난 위가 부레와 장을 누릅니다.','{n}은 다음 날까지 수면에 떠 있습니다. 물 밖으로 나온 배 피부가 말라 하얗게 일어납니다. 그 다음 날 아침, 아가미 움직임이 멈춰 있습니다.']}});

/* EV-OWA-26 합사 실험 — "누가 이길까" [출처: 대형 육식어 합사 공격성 — 사육 문헌] */
function owa26(o){return Object.assign({},o,{set:Object.assign({viral:1},o.set||{}),near:'mates'})}
function owa26_bit(){
  if(R()<.5)return owa26({t:'피가 보이자 주인이 칸막이를 다시 내렸습니다. {n}의 옆구리 비늘 여러 장이 뜯겨 있었습니다.',c:'bad',fx:{h:-15,st:.15},set:{inj_skin:1}});
  return owa_hold(isSp('bichir','pleco')?40:50,'OWA-26-D',owa26({t:'칸막이는 한참 뒤에야 내려왔습니다. {n}의 아가미 뚜껑 가장자리가 찢겨 있었습니다.',c:'bad',fx:{h:-22,st:.2},set:{inj_skin:1,inj_gill:1}}));
}
fev([{id:'OWA-26',tier:'fact',own:['content'],cd:40,sp:['oscar','arowana','channa','gar','bichir','fig8','motoro','pleco'],w:()=>tankL()>=160?2:.6,
  p:'수조 한가운데에 투명 칸막이가 서 있습니다. 칸막이 너머에서 처음 보는 큰 몸이 천천히 돌아다닙니다. 카메라 세 대가 켜지고, 주인이 칸막이를 들어 올립니다. {n}은…',
  o:[
   {l:'먼저 다가가 몸을 옆으로 세우고 아가미를 벌린다',chk:()=>['p',isSp('bichir')?65:70],
    ok:()=>owa26({t:'{n}이 먼저 물었습니다. 상대가 물러섰고, 상대 옆구리에서 피가 실처럼 풀렸습니다. 물이 금세 탁해졌습니다.',c:'good',fx:{p:3,wq:-10}}),
    no:()=>owa26_bit()},
   {l:'수조 끝 유목 아래로 물러나 지켜본다',chk:['w',50],ok:()=>owa26({t:'{n}은 유목 아래에서 서열이 정리될 때까지 나오지 않았습니다.'+(isSp('channa')?' 한 번 상대 꼬리를 물고 놓지 않았습니다.':''),c:'good',fx:{w:2}}),
    no:()=>owa26({t:'상대가 유목 아래 자리를 차지했습니다. {n}은 밤새 수조 가운데를 떠돌았습니다.',c:'bad',fx:{st:.15,h:-5}})},
   {l:'바닥에 납작 붙어 움직이지 않는다',
    ok:()=>isSp('motoro')?owa26({t:'상대가 위에서 덮치자 {n}의 꼬리가 휘어 올라 상대를 찔렀습니다. 상대는 다시 오지 않았습니다.',c:'good',fx:{st:.08}})
      :isSp('pleco')&&fst().g>=capOf('g')*.85?owa26({t:'두 대형어가 서로를 물어뜯는 동안 {n}은 유리벽에 붙어 이끼를 먹었습니다. 댓글 1위는 "진정한 승자: 플레코"였습니다. 주인은 그 댓글을 고정했습니다.',c:'good',fx:{g:1}})
      :owa_roll('g',50)?owa26({t:'상대는 바닥에 붙은 {n}을 몇 번 건드리다 지나갔습니다.',fx:{g:2}}):owa26_bit()}
  ]}]);
fevEnd({'OWA-26-D':{kind:'bad',cat:'합사',tier:'fact',fx:'f-nipped',fact:'fTemper',pl:[[3,'대형어끼리 합사 실험']],
  after:'영상 제목은 "결과는 예상 밖"이었습니다. 썸네일에는 칸막이를 올리기 전 장면만 쓰였습니다.',
  l:['상대가 {n}의 옆구리를 물고 머리를 좌우로 흔듭니다. 비늘 여러 장이 한꺼번에 뜯기고, 그 아래 근육이 드러납니다.','{n}은 몸을 비틀어 빠져나오고 유목 쪽으로 헤엄칩니다. 헤엄칠 때마다 찢어진 근육 사이로 피가 실처럼 풀립니다.','상대가 다시 와서 이번에는 눈 바로 뒤를 뭅니다. 아가미 뚜껑이 찢어지고 새엽 일부가 밖으로 드러납니다.','칸막이가 다시 내려왔을 때, {n}은 바닥에서 기울어진 채 드러난 새엽으로 물을 넘기고 있습니다. 밤사이 그 위로 하얀 솜이 핍니다.']}});

/* EV-OWA-27 댓글 1위 — "수조가 너무 작아요" [출처: 종별 권장 수조 크기, 소형 수조 성장 저해(stunting)] */
function owa27(p){
  if(R()>=p)return {t:'주인은 새 수조를 거실 구석에 세워 두었습니다. 옮기는 영상은 "다음 주에"였습니다.',fx:{st:.04}};
  const up=owa_bigger();if(!up)return {t:'주인은 더 큰 수조를 찾지 못했습니다.',fx:{}};
  const rush=R()<.6;
  return {t:'옮기는 과정 영상이 촬영되었습니다.',c:'good',set:{tank_size:1},run:()=>{
    fUpgrade(up,'{n}은 넓은 수조에서 몸을 처음으로 길게 폈습니다. 영상의 마지막 자막은 "여러분 덕분이에요"였습니다. 처음부터 작은 수조를 산 것도 주인이었습니다.',!rush);
    if(rush)q(null,null,()=>{if(S.ending)return;const o=owa_hold(40,'OWA-27-D',{t:'새 수조의 물은 아직 잡히지 않았습니다. {n}의 아가미가 며칠 동안 따끔거렸습니다.',c:'bad',fx:{h:-12,st:.1}});fevOut(o)});
    if(isSp('arowana')&&!S.f.lid)q(T('새 수조에는 뚜껑이 없었습니다.'),'bad')}};
}
fev([{id:'OWA-27',tier:'fact',own:['content'],cd:40,when:()=>!fl('tank_size'),w:()=>fl('small_tank')||S.f.outgrown?4:.2,
  p:'휴대폰 화면 불빛이 수조 유리에 비칩니다. 주인이 화면을 한참 내리다가 한숨을 쉽니다. 다음 날 커다란 상자가 들어옵니다. 상자에서 나온 수조가 지금 수조 옆에 놓입니다. 카메라가 그 둘을 나란히 찍습니다. {n}은…',
  o:[
   {l:'카메라를 향해 유리 앞으로 나온다',chk:['c',55],ok:()=>owa27(1),no:()=>owa27(.6)},
   {l:'좁은 수조에서 평소처럼 몸을 돌린다',ok:()=>owa27(.7)},
   {l:'바닥에 내려가 쉰다',ok:()=>owa27(.6)}
  ]}]);
fevEnd({'OWA-27-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',fact:'fCycle',pl:[[2,'물잡이 안 된 새 수조로 서둘러 옮김']],
  after:'영상 제목은 "드디어 넓은 집으로!"였습니다. 다음 영상은 올라오지 않았습니다.',
  l:['넓은 새 수조에는 아직 암모니아를 처리할 세균이 없습니다.','물속 암모니아가 아가미를 통해 혈액으로 들어옵니다. 아가미 새엽 끝이 붉게 부어오르고, 새엽 사이 틈이 좁아집니다.','{n}은 처음으로 몸을 길게 펴고 헤엄치다, 수면 가까이 떠서 입을 빠르게 여닫습니다.','밤사이 경련 간격이 길어지고, 아침에는 새 수조 바닥 한가운데에 옆으로 누워 있습니다.']}});

/* EV-OWA-28 채널 정리 — "대형어 분양합니다" (주인 교체) [출처: 국내 외래 관상어 하천 방류 사례] [출처: 레인보우 스네이크헤드 방류·생태계 위해성] */
function owa28(b){
  const r=owa_next([['club',4+b*2],['staff',isSp('motoro')?4:2.5],['relay',2.5-b],['release',(isSp('gar','channa')?2:1)-b*.5]]);
  const end='마지막 영상 제목은 "그동안 감사했습니다 ({n} 근황 공개)"였습니다. 근황은 "좋은 분께 갔어요" 한 줄이었습니다.';
  if(r==='release')return {t:'주인은 받을 사람을 찾지 못했습니다. 밤에 {n}을 대형 아이스박스에 담아 차에 실었습니다.',c:'bad',run:()=>{q(T(end+' 주인은 그분 이름을 몰랐습니다.'),'bad');fRelease()}};
  const k=r==='club'?(R()<.5?'expert':'learner'):r;
  return {t:'낯선 사람이 아이스박스에 {n}을 담아 갔습니다.',c:'sub',run:()=>owa_to(k,end+' 주인은 그분 이름을 몰랐습니다.',{note:'채널 정리로 분양'},()=>{if(isSp('oscar'))q(T('{n}은 새 주인의 얼굴을 낯설어하며 며칠 동안 먹이를 거부했습니다.'),'sub',()=>{S.health-=6})})};
}
fev([{id:'OWA-28',tier:'fact',own:['content'],once:1,when:owa_ok,sp:['arowana','oscar','gar','channa','motoro','pleco','bichir'],w:()=>owa_long(6)?1:.3,
  p:'카메라 삼각대가 접혀 상자에 들어갑니다. 수조 조명은 켜져 있지만 아무도 앞에 앉지 않습니다. 며칠 뒤, 낯선 사람이 대형 아이스박스를 들고 옵니다. 주인은 그 사람과 수조를 번갈아 보며 가격을 이야기합니다. {n}은…',
  o:[
   {l:'낯선 사람 쪽 유리로 다가가 몸을 보인다',chk:['c',60],ok:()=>owa28(1),no:()=>owa28(0)},
   {l:'늘 하던 대로 수면 근처를 순찰한다',ok:()=>owa28(0)},
   {l:'은신처 깊숙이 들어가 나오지 않는다',ok:()=>owa28(-1)}
  ]}]);

/* ======================= H. 번식장 (mill) ======================= */

/* EV-OWA-29 랙 400통, 그물 하나 [출처: 양식장 항생제 상시 사용과 내성균(Aeromonas·Flavobacterium) 문헌] */
function owa29(o,need){
  setFl('resistant',1);
  if(o)return o;
  const dz=wpick([['columnaris',isSp('oranda','ryukin')?4:2],['fungus',2],['velvet',isSp('betta')?2:1],['finrot',isSp('betta')?2:1]]);
  return owa_hold(need+(isSp('clownloach')?8:0),'OWA-29-D',{t:'옆 통에서 옮겨 온 병이 {n}에게도 올라왔습니다. 물속 약 때문에 증상은 늦게 보였습니다.',c:'bad',fx:{h:-12,st:.1},sick:dz,set:isSp('clownloach')?{slime_loss:1}:{}});
}
fev([{id:'OWA-29',tier:'fact',own:['mill'],cd:30,sp:['betta','guppy','oranda','ryukin','platy','apisto','clownloach'],w:()=>fl('age')<.4?3:.6,
  p:'같은 크기의 통이 벽을 따라 몇 층으로 쌓여 있습니다. 작업자가 그물 하나로 이 통 저 통을 차례로 훑고 지나갑니다. 그물에서 물방울과 함께 다른 통의 냄새가 떨어집니다. 이웃 통의 물고기 몸에 하얀 솜이 핀 지 며칠 되었습니다. {n}은…',
  o:[
   {l:'그물이 들어오면 재빨리 반대편으로 피한다',chk:['p',35],ok:()=>owa29({t:'{n}은 그물을 피했습니다. 그물은 옆의 몸들을 쓸고 지나갔습니다.',c:'good',fx:{p:2}}),no:()=>owa29(null,40)},
   {l:'그물이 지나가는 동안 몸을 낮추고 기다린다',chk:['g',40],ok:()=>owa29({t:'{n}은 그물이 스쳐 간 뒤에도 멀쩡했습니다.',fx:{g:2}}),no:()=>owa29(null,45)},
   {l:'통 구석에 붙어 움직이지 않는다',ok:()=>R()<.5?owa29({t:'그물은 이번에 {n}을 건드리지 않았습니다.',fx:{g:1}}):owa29(null,40)}
  ]}]);
fevEnd({'OWA-29-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',fact:'항생제를 물에 늘 타 두면, 약이 듣지 않는 세균만 살아남습니다.',pl:[[1,'항생제를 늘 물에 탐']],
  l:['그물에 쓸린 지느러미 끝에서 상피가 벗겨집니다. 그 자리에 세균이 붙어 회백색 띠를 만듭니다.','통의 물에는 항생제가 늘 섞여 있습니다. 회백색 띠는 그래도 넓어집니다. 지느러미가 끝부터 녹아 기조만 남습니다.','띠는 등 쪽 피부로 번져 안장 모양으로 하얗게 벗겨집니다. {n}은 통 벽에 몸을 문지르며 계속 헤엄칩니다. 문지를 때마다 벗겨진 범위가 넓어집니다.','아가미 새엽까지 회백색으로 변한 날, {n}은 통 바닥에 기울어진 채 멈춥니다.']}});

/* EV-OWA-30 형제끼리 — 같은 색을 고정하는 법 [출처: 관상어 근친 번식과 척추 기형·면역 저하] */
function owa30_sell(o){
  return Object.assign({},o,{run:()=>{if(isSp('oranda','ryukin')&&R()<.4)fSick('swimb');
    const k=owa_next([['eager',3],['casual',3],['gift',2]]);
    owa_to(k,'{n}은 "등급 외 헐값" 상자에 담겨 대형 마트 수조로 갔습니다. 며칠 뒤 누군가 {n}을 골랐습니다.',{note:'번식장 출신'})}});
}
fev([{id:'OWA-30',tier:'fact',own:['mill'],once:1,sp:['betta','guppy','oranda','ryukin','platy','apisto'],w:()=>fl('age')<.3?4:0,
  log:'같은 통에서 함께 태어난 몸들이 모두 같은 색이었습니다. 부모도 형제였고, 그 부모의 부모도 같은 통 출신이었습니다.',
  p:()=>{setFl('inbred',1);return (isSp('platy')&&R()<.6?'{n}의 몸은 곧습니다. 다만 형제들 사이에서 유난히 작습니다.':'{n}의 등줄기가 한쪽으로 조금 휘어 있습니다. 헤엄칠 때마다 몸이 살짝 기웁니다.')+' {n}은…'},
  o:[
   {l:'휘어진 몸을 펴듯 힘껏 헤엄친다',chk:['p',40],ok:()=>owa30_sell({t:'{n}의 휜 등은 검품 그물 앞에서 잘 드러나지 않았습니다.',c:'good',fx:{p:2}}),
    no:()=>owa_hold(45,'OWA-30-D',owa30_sell({t:'힘껏 헤엄칠수록 휜 등이 더 당겼습니다.',c:'bad',fx:{h:-10},set:{inj_spine:1}}))},
   {l:'먹이가 떨어지는 자리를 남보다 먼저 차지한다',chk:['w',35],ok:()=>owa30_sell({t:'{n}은 형제들 사이에서 먹이를 먼저 차지했습니다.',fx:{w:2,fat:.05}}),no:()=>owa30_sell({t:'{n}은 형제들에게 밀려 늘 마지막에 먹었습니다.',c:'bad',fx:{h:-6,fat:-.15}})},
   {l:'무리 가장자리에서 천천히 따라 헤엄친다',ok:()=>isSp('platy')||R()<.5?owa30_sell({t:'검품 작업자는 {n}을 다른 몸들과 함께 판매 통으로 떴습니다.',fx:{}}):owa_hold(isSp('oranda','ryukin')?55:45,'OWA-30-D',owa30_sell({t:'{n}은 기울어진 채 검품을 겨우 통과했습니다.',c:'bad',fx:{h:-8}}))}
  ]}]);
fevEnd({'OWA-30-D':{kind:'bad',cat:'도태',tier:'fact',fx:'f-bucket',fact:'fBreed',pl:[[4,'형제끼리 번식시킴']],
  after:'양동이는 저녁에 한 번 비워졌습니다.',
  l:['휘어진 척추가 자라면서 더 휩니다. 휜 쪽 근육이 당겨지고, 반대쪽 늑골 사이가 벌어집니다.','{n}은 똑바로 가려고 할 때마다 한쪽으로 원을 그립니다. 꼬리지느러미를 더 세게 저어 방향을 바로잡습니다.','휜 자리 아래 복강이 눌려 부레가 제자리를 잃습니다. {n}은 머리를 아래로 한 채 떠오르고, 다시 가라앉으려고 지느러미를 젓습니다.','출하 검품 날, 작업자가 그물로 {n}을 뜹니다. 그물은 판매 통이 아니라 바닥 배수구 옆 양동이로 갑니다.']}});

/* EV-OWA-31 겨울 택배 출하 (주인 교체) [출처: 관상어 출하 전 절식 관행(정상 1–2일), 국내 관상어 택배 거래 실태, 열대어 저온 운송 폐사] */
function owa31(need){
  const days=wpick([[1,2],[2,3],[3,2]]);
  const n=need+(days===3?15:days===1?-8:0);
  const o=owa_hold(n,'OWA-31-D',{t:'상자는 '+(days===3?'주말을 넘겨 ':'')+days+'일 만에 열렸습니다. 봉지 속 {n}은 차가운 물 바닥에서 아가미만 천천히 움직이고 있었습니다.',c:'bad',fx:{h:-18,st:.2}});
  if(o.end)return o;
  return Object.assign(o,{run:()=>{const k=owa_next([['learner',3],['eager',3],['breeder',1.5],['content',1.5]]);
    owa_to(k,'택배 상자를 받은 사람이 {n}의 새 주인이 되었습니다.',{note:'겨울 택배로 판매'},()=>{
      if(isKind('eager','casual')){q(T('새 주인은 봉지를 뜯자마자 {n}을 수조에 쏟았습니다.'),'bad',()=>{S.health-=8;S.f.stress+=.1})}
      if(isSp('betta')&&R()<.4)fSick(R()<.6?'ich':'velvet')})}});
}
fev([{id:'OWA-31',tier:'fact',own:['mill'],once:1,need:{season:'winter'},sp:['betta','guppy','neon','peapuffer','apisto','cory','platy'],w:()=>isSp('betta')?4:2,
  p:'사흘째 먹이가 들어오지 않습니다. 그날 {n}은 작은 봉지에 담기고, 봉지는 신문지에 말려 스티로폼 상자 안에 들어갑니다. 상자에는 핫팩이 없습니다. 상자가 몇 번 던져지고, 기울어지고, 차가운 곳에 오래 놓입니다. 봉지 속 물이 점점 차가워집니다. {n}은…',
  o:[
   {l:'봉지 안에서 몸을 계속 움직여 버틴다',chk:['p',30],ok:()=>owa31(55),no:()=>owa31(65)},
   {l:'봉지 바닥에서 지느러미를 접고 움직임을 줄인다',ok:()=>owa31(45)},
   {l:'봉지 위쪽 공기 가까이 몸을 붙인다',chk:()=>owa_air()?null:['g',40],ok:()=>owa31(owa_air()?40:42),no:()=>owa31(55)}
  ]}]);
fevEnd({'OWA-31-D':{kind:'bad',cat:'택배',tier:'fact',fx:'f-box',fact:'fChain',pl:[[2,'겨울 택배, 핫팩 없음']],
  after:'번식장은 "도착 사진 보내 주시면 50% 환불"이라고 답했습니다. 같은 날 같은 상자가 서른 개 나갔습니다.',
  l:['수온이 내려가자 {n}의 대사가 느려지고, 지느러미 움직임이 점점 약해집니다.','봉지 속 물에 사흘 전 먹은 것의 배설물이 녹아 있습니다. 차가운 물에서 아가미 새엽의 혈류가 느려집니다.','{n}은 봉지 모서리에 몸이 끼인 채 가끔 아가미 뚜껑만 움직입니다. 상자가 다시 기울 때 몸이 봉지 반대편으로 미끄러집니다.','상자가 열렸을 때, 봉지 속 {n}의 몸은 색이 바래 있고, 눈이 흐립니다.']}});

/* EV-OWA-32 단속 다음 날 (주인 교체 또는 사망) [출처: 관상어 번식장 폐업·단속 후 처리 실태(국내 보도 확인 필요)] */
function owa32(b){
  const r=owa_next([['dealer',4.5],['rescue',2+b*2.5],['staff',1.5],['dump',2]]);
  if(r==='dump')return {end:'OWA-32-D'};
  if(r==='rescue')return {t:'구조하러 온 동호인이 {n}을 봉지에 담았습니다. 구조 카페 글에는 "백 마리 넘게 구조했습니다"라고 쓰여 있었습니다. 그 아래 댓글은 "그 번식장 어디예요? 싸게 사고 싶어요"였습니다.',c:'good',run:()=>owa_to(R()<.6?'learner':'expert','{n}은 구조한 사람의 집으로 갔습니다.',{note:'번식장 단속 후 구조'})};
  if(r==='staff')return {t:'수족관 직원이 대야에서 몇 마리를 골라 갔습니다. {n}도 그중 하나였습니다.',c:'sub',run:()=>owa_to('staff','{n}은 수족관 직원의 집으로 갔습니다.',{note:'번식장 단속 후 위탁'})};
  return {t:'"통째로 가져가면 싸게 줄게." 다른 업자가 대야째 실어 갔습니다.',c:'bad',run:()=>owa_to('mill','{n}은 다른 번식장의 통으로 옮겨졌습니다.',{note:'번식장 재고로 넘김'})};
}
fev([{id:'OWA-32',tier:'fact',own:['mill'],once:1,w:.4,
  p:'통마다 붙어 있던 이름표가 떼어집니다. 작업자 둘이 통을 하나씩 들어 큰 고무 대야에 쏟습니다. 종류도 크기도 섞입니다. 대야 위로 전화 통화 소리가 납니다. "통째로 가져가면 싸게 줄게." {n}은…',
  o:[
   {l:'대야 안에서 큰 몸들을 피해 가장자리를 돈다',chk:['w',35],ok:()=>owa32(0),
    no:()=>isSp('@small')&&R()<.4?{t:'대야 속 큰 물고기의 입이 {n}을 스쳤습니다. 꼬리지느러미 절반이 없어졌습니다.',c:'bad',fx:{fin:.3,h:-10},run:()=>q(null,null,()=>fevOut(owa32(0)))}:owa32(0)},
   {l:'대야 바닥에 모인 무리 아래로 파고든다',ok:()=>owa_roll('g',40)?owa32(0):{t:'대야 바닥의 물은 숨이 찼습니다. {n}은 지쳐 버렸습니다.',c:'bad',fx:{h:-10,st:.1},run:()=>q(null,null,()=>fevOut(owa32(-.3)))}},
   {l:'대야 구석에 혼자 떨어져 움직이지 않는다',chk:['c',60],ok:()=>owa32(1),no:()=>owa32(-.2)}
  ]}]);
fevEnd({'OWA-32-D':{kind:'bad',cat:'버려짐',tier:'fact',fx:'f-trash',fact:'fFlush',pl:[[0,'남은 물고기를 배수구에 버림']],
  after:'다음 달, 같은 사람이 다른 주소에서 같은 이름의 번식장 계정을 열었습니다.',
  l:['대야가 기울고, 물과 함께 수십 마리가 배수구 쇠살 위로 쏟아집니다. {n}은 쇠살 사이에 몸이 걸립니다.','꼬리를 세게 저어 빠져나오려 하자 쇠살 모서리에 옆구리 비늘이 벗겨집니다. 물이 빠져나가고 공기만 남습니다.','아가미 새엽이 공기 중에서 서로 달라붙어 접힙니다. {n}은 입을 크게 벌리고 아가미 뚜껑을 들어 올립니다. 들어오는 것은 공기뿐입니다.','몇 분 뒤, 쇠살 위의 몸들이 하나씩 움직임을 멈춥니다. 작업자가 그 위로 다음 대야를 붓습니다.']}});

/* ======================= I. 무환수·무여과 신봉자 (cult) ======================= */

/* EV-OWA-33 밀폐 유리병 생태계 [출처: 밀폐 수조(sealed jar ecosystem)에 물고기를 넣었을 때의 실패 원인 — 산소·질소 축적, 야간 식물 호흡] */
function owa33(o,need){
  if(R()<.1)return {t:'놀러 온 가족이 병을 들여다보며 "이거 살아 있어?" 하더니 테이프를 뜯었습니다. 그날 {n}은 작은 어항으로 옮겨졌습니다.',c:'good',fx:{h:-5},run:()=>owa_to(R()<.5?'casual':'gift','{n}은 가족의 집으로 갔습니다.',{note:'밀폐 병에서 꺼내짐'})};
  if(o)return o;
  const n=need+(season()==='summer'?10:0);
  return owa_hold(n,'OWA-33-D',{t:'병 안의 물이 날마다 탁해졌습니다. {n}은 수초 위에 기대어 숨을 쉬었습니다.'+(season()==='summer'?' 창가 햇볕에 물이 데워졌습니다.':''),c:'bad',fx:{h:-15,fat:-.2,wq:-15},set:{thin:1}});
}
fev([{id:'OWA-33',tier:'fact',own:['cult'],once:1,sp:['betta','guppy','neon','platy','cory','wildbetta'],w:()=>owa_new()?6:0,
  p:()=>{S.f.tank='vase';S.f.filter='없음';return '둥근 유리병 안에 흙, 이끼, 수초가 층층이 깔려 있습니다. {n}이 들어가자 뚜껑이 닫히고, 틈에 테이프가 감깁니다. 병은 창가에 놓입니다. 주인은 "이제 아무것도 안 해도 스스로 돌아간다"며 사진을 찍습니다. {n}은…'},
  o:[
   {l:'수초 잎 사이를 뒤져 먹을 것을 찾는다',chk:()=>['w',isSp('cory')?30:40],ok:()=>owa33({t:'{n}은 잎 사이 작은 벌레와 흙 속 먹이로 연명했습니다.',fx:{w:2,h:-6,fat:-.1}}),no:()=>owa33(null,45)},
   {l:'병 꼭대기 공기층 바로 아래에 머문다',chk:()=>['g',owa_air()?40:55],ok:()=>owa33({t:'{n}은 병 꼭대기 공기층에 입을 대고 버텼습니다.',fx:{g:2,h:-6}}),no:()=>owa33(null,50)},
   {l:'흙 바닥에 가만히 내려앉는다',ok:()=>owa33(null,48)}
  ]}]);
fevEnd({'OWA-33-D':{kind:'bad',cat:'질식',tier:'fact',fx:'f-float',fact:'fO2',pl:[[2,'밀폐 병에 넣음']],
  after:'주인은 "자연의 순리"라며 {n}을 병 속에 그대로 두었습니다. 병은 여전히 "스스로 돌아가는 생태계"로 책상 위에 있습니다.',
  l:['밤마다 수초는 산소를 만들지 않고 씁니다. 병 안의 산소는 새벽마다 바닥 가까이 떨어집니다.','배설물과 썩은 잎에서 나온 암모니아가 병 밖으로 나갈 곳이 없습니다. 아가미 새엽이 붓고, 새엽 끝이 붉어집니다.','{n}은 병 꼭대기 공기층에 입을 대고 숨을 쉽니다. 공기층의 산소도 날마다 줄어듭니다.','몇 주 사이 등 근육이 빠지고 배가 오목해집니다. 어느 오후, 창가 햇볕 아래에서 {n}은 수초 잎 위에 얹힌 채 아가미를 멈춥니다. 병은 그 뒤에도 몇 주 동안 초록색입니다.']}});

/* EV-OWA-34 무여과 수초 어항 — 새벽 네 시 [출처: 야간 수초 호흡과 새벽 용존산소 저하, CO2 과다] */
function owa34(o){return Object.assign({},o,{run:()=>{setFl('near_miss',1);if(!o.end&&R()<.15){setFl('airstone',1);addLog(T('같이 사는 가족이 주인 몰래 수조 뒤에 기포기를 꽂았습니다.'),'good')}else if(owa_air())addLog(T('주인은 아침에 멀쩡한 {n}을 보고 "봐라, 문제없다"고 말했습니다.'),'sub')}})}
function owa34h(need){
  const n=need+(isSp('oscar','koi','@gold','clownloach','arowana')?10:0)+(fl('co2')?10:0);
  return owa34(owa_hold(n,'OWA-34-D',{t:'아침에 {n}은 수면에서 입을 벌리고 있었습니다. 주인은 "밥 달라는 거"라며 먹이를 넣었습니다.',c:'bad',fx:{h:-15,st:.15,wq:-5},set:{inj_gill:1}}));
}
fev([{id:'OWA-34',tier:'fact',own:['cult'],cd:25,when:()=>!fl('airstone'),w:()=>fl('filter')==='none'?3:.5,
  p:'수조는 수초로 빽빽합니다. 여과기도 기포기도 없습니다. 낮에는 잎에서 작은 공기 방울이 올라옵니다. 불이 꺼지고 몇 시간 뒤, 수면이 움직이지 않습니다. 물이 무겁게 느껴집니다. {n}은…',
  o:[
   {l:'수면으로 올라가 입을 내민다',ok:()=>owa_air()?owa34({t:'{n}은 수면에서 공기를 삼키며 새벽을 넘겼습니다.',fx:{h:-3}}):owa34h(45)},
   {l:'수초에서 멀리, 수조 가운데로 나간다',chk:['w',45],ok:()=>owa34({t:'{n}은 수초에서 먼 물층에서 아침을 기다렸습니다.',c:'good',fx:{w:2,h:-4}}),no:()=>owa34h(45)},
   {l:'수초 밑 바닥에서 움직임을 줄인다',chk:['g',55],ok:()=>owa34({t:'{n}은 움직임을 줄인 채 동이 틀 때까지 버텼습니다.',fx:{g:2,h:-5}}),no:()=>owa34h(55)}
  ]}]);
fevEnd({'OWA-34-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-float',fact:'fO2',pl:[[2,'여과기도 기포기도 없는 수조']],
  after:'주인은 "자연의 순리"라며 {n}을 수조 바닥에 그대로 두었습니다. "분해되면 수초 거름이 된다"고 했습니다.',
  l:['밤새 수초와 세균과 물고기가 같은 물속 산소를 씁니다. 새벽이 되자 물에 녹아 있는 산소가 거의 남지 않습니다.','{n}은 수면으로 올라가 입을 수면 위로 내밀고 물과 공기를 함께 들이켭니다. 아가미 뚜껑이 크게 벌어졌다 닫힙니다.','아가미 새엽의 모세혈관이 넓어지고, 새엽이 짙은 붉은색으로 변합니다. 헤엄치는 동안 근육에 젖산이 쌓여 움직임이 둔해집니다.','동이 틀 무렵, {n}은 수면에서 미끄러져 수초 잎 위로 가라앉습니다. 조명이 켜지고, 잎에서 다시 공기 방울이 올라옵니다.']}});

/* EV-OWA-35 그대로 둔 사체 — 그리고 카페 분양 [출처: 사체 부패에 따른 암모니아 상승과 2차 감염, 수종(dropsy)의 솔방울 비늘 증상] */
function owa35(o){
  return Object.assign({},o,{fx:Object.assign({wq:-15},o.fx||{}),run:()=>{
    if(o.end)return;const r=R();
    if(r<.15)q(null,null,()=>owa_to('cult','사진을 본 카페 회원이 "우리 집 자연 수조로 데려가겠다"고 했습니다. {n}은 또 다른 여과기 없는 수조로 갔습니다.',{note:'카페 회원에게 분양'}));
    else if(r<.25)q(null,null,()=>owa_to('learner','카페의 다른 회원이 "이건 학대"라며 구조를 제안했습니다. 구조한 회원은 첫날 여과기를 꽂고 물을 반 갈았습니다. 원래 주인은 그 회원을 카페에서 강퇴했습니다. 강퇴 사유는 "자연 훼손"이었습니다.',{note:'카페 회원이 구조'}));}});
}
function owa35h(need,dz){return owa35(owa_hold(need,'OWA-35-D',{t:'물이 뿌옇게 흐려진 채 일주일이 갔습니다. {n}의 지느러미 가장자리가 붉게 짓물렀습니다.',c:'bad',fx:{h:-14,st:.1},sick:dz||'finrot'}))}
fev([{id:'OWA-35',tier:'fact',own:['cult'],cd:40,w:()=>S.f.mates.some(m=>m.n>0)?2:.4,
  p:()=>{const m=S.f.mates.find(m=>m.n>0&&m.id!==S.sp.id)||S.f.mates.find(m=>m.n>0);if(m){m.n--;S.f.mates=S.f.mates.filter(x=>x.n>0)}setFl('corpse',1);
    return '합사어 하나가 바닥에 누운 지 사흘째입니다. 그 몸이 하얗게 부풀고, 주변 물이 뿌옇게 흐려집니다. 주인은 수조 앞에서 사진을 찍어 어딘가에 올립니다. "자연의 순환 과정." {n}은…'},
  o:[
   {l:'부푼 몸에 다가가 뜯어 본다',chk:['g',50],ok:()=>owa35({t:'{n}은 사체를 뜯어 배를 채웠습니다.',fx:{g:1,fat:.1}}),no:()=>owa35h(45,R()<.5?'aero':'finrot')},
   {l:'사체에서 가장 먼 수면 쪽으로 간다',chk:['w',35],ok:()=>owa35({t:'{n}은 사체에서 먼 수면 쪽에서 지냈습니다.',fx:{w:2,h:-4}}),no:()=>owa35h(40)},
   {l:'수초 사이에 들어가 움직이지 않는다',ok:()=>owa35h(45)}
  ]}]);
fevEnd({'OWA-35-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',fact:'fWater',pl:[[2,'죽은 물고기를 치우지 않음']],
  after:'주인은 "자연의 순리"라며 {n}도 바닥에 그대로 두었습니다. 카페 글의 제목은 "2차 순환 시작"이었습니다.',
  l:['부푼 사체에서 빠져나온 세균이 물에 퍼집니다. {n}의 지느러미 가장자리에 붉은 줄이 생기고, 줄을 따라 막이 녹습니다.','아가미 새엽은 암모니아에 붓고, 그 위로 세균이 들러붙습니다. {n}은 수면 가까이 올라가 오래 머뭅니다.','비늘 몇 장이 솔방울처럼 바깥으로 들립니다. 복강에 체액이 차서 배가 둥글게 부풉니다.','일주일 뒤, 바닥에는 누운 몸이 둘이 됩니다.']}});

/* ======================= J. 극단적 방치파 (neglect) ======================= */

/* EV-OWA-36 반쯤 남은 물과 드러난 히터 [출처: 히터 제조사 경고(수위 아래 사용, 공기 중 노출 시 파손·과열)] */
function owa36(o,need){
  const f=S.f;f.wq-=20;setFl('filter_dry',1);
  if(!f.heater)return o||owa_hold(need,'OWA-36-D2',{t:'여과기는 며칠 동안 물 밖에서 덜덜거리다 멈췄습니다. 남은 물이 짙어졌습니다.',c:'bad',fx:{h:-10,st:.08}});
  if(fl('owa36h')==='broken'){
    f.heater=0;setFl('heater_broken',1);
    if(isSp('@tropical')&&season()==='winter')return owa_hold(need+10,'OWA-36-C',{t:'히터 유리관이 갈라져 꺼졌습니다. 수온이 방 온도를 따라 내려갔습니다. {n}은 바닥에서 지느러미를 접었습니다.',c:'bad',fx:{h:-15,st:.15}});
    return Object.assign({t:'물이 튄 히터 유리관이 갈라져 꺼졌습니다.',c:'bad',fx:{st:.05}},o||{});
  }
  if(o)return Object.assign({},o,{t:o.t+' 물은 점점 뜨거워졌습니다.'});
  return owa_hold(need,'OWA-36-D',{t:'물이 점점 뜨거워졌습니다. {n}은 얕은 물 표면에서 입을 벌리고 며칠을 버텼습니다.',c:'bad',fx:{h:-18,st:.15}});
}
fev([{id:'OWA-36',tier:'fact',own:['neglect'],cd:40,w:()=>S.f.heater?2:(isSp('@gold','koi')?1:.2),
  p:()=>{setFl('owa36h',R()<.5?'broken':'hot');return '몇 주 동안 아무도 물을 채우지 않았습니다. '+(S.f.heater?'수위가 히터의 표시선 아래로 내려가, 히터 위쪽 유리가 공기 중에 드러나 있습니다. ':'수위가 절반 아래로 내려갔습니다. ')+'걸이식 여과기의 흡입구도 물 밖으로 올라와 덜덜거리는 소리만 냅니다. 남은 물은 진한 갈색입니다. {n}은…'},
  o:[
   {l:'히터 근처 따뜻한 물로 다가간다',chk:['w',45],ok:()=>owa36({t:'{n}은 히터 바로 옆의 뜨거운 자리는 피했습니다.',fx:{w:2,h:-4}}),
    no:()=>owa36({t:'{n}의 옆구리가 드러난 히터 유리에 닿았습니다. 닿은 자리의 비늘이 하얗게 익었습니다.',c:'bad',fx:{h:-14},set:{inj_burn:1}},45)},
   {l:'수조 반대편 가장자리에 머문다',chk:()=>['g',isSp('altum','neon','motoro')?55:45],ok:()=>owa36({t:'{n}은 반대편 가장자리에서 버텼습니다.',fx:{g:2,h:-6}}),no:()=>owa36(null,50)},
   {l:'바닥에 가만히 있는다',ok:()=>isSp('pleco','clownloach','bichir')&&S.f.heater&&R()<.5?owa36({t:'바닥에서 쉬던 {n}의 배가 히터 아래쪽에 닿아 있었습니다. 배 피부가 하얗게 데었습니다.',c:'bad',fx:{h:-16},set:{inj_burn:1}},45):owa36(null,45)}
  ]}]);
fevEnd({
 'OWA-36-D':{kind:'bad',cat:'과열',tier:'fact',fx:'f-cook',fact:'fTemp',pl:[[2,'몇 주 동안 물을 채우지 않음']],
   after:'주인은 {n}이 죽은 걸 일주일 뒤에 알았습니다. 냄새 때문이었습니다.',
   l:['물이 절반으로 줄자, 같은 히터가 데우는 물의 양도 절반이 됩니다. 수온이 계속 오릅니다.','몸이 쓰는 산소가 늘어나는 동안, 뜨거운 물에 녹아 있는 산소는 줄어듭니다. {n}은 얕은 물 표면에서 입을 벌립니다.','근육 단백질이 굳기 시작하며 지느러미 움직임이 뻣뻣해집니다. {n}은 옆으로 기운 채 가슴지느러미만 움직입니다.','남은 물이 더 증발합니다. 며칠 뒤 수조 바닥에는 갈색 물 몇 센티미터와, 그 안에 눈의 수정체가 하얗게 흐려진 {n}이 있습니다.']},
 'OWA-36-C':{kind:'bad',cat:'동사',tier:'fact',fx:'f-ice',fact:'fTemp',pl:[[2,'몇 주 동안 물을 채우지 않음']],
   after:'주인은 {n}이 죽은 걸 일주일 뒤에 알았습니다.',
   l:['공기 중에서 달궈진 히터 유리관에 물이 튀자 유리관이 갈라집니다. 갈라진 틈으로 물이 스며들고, 히터는 꺼집니다.','그 뒤로 수온은 방 온도를 따라 내려갑니다. 열대의 물에서 온 {n}의 대사가 느려지고, 지느러미가 접힙니다.','{n}은 바닥 가장 따뜻한 자리를 찾아 몸을 붙입니다. 아가미 뚜껑의 움직임이 하루하루 얕아집니다.']},
 'OWA-36-D2':{kind:'bad',cat:'방치',tier:'fact',fx:'f-float',fact:'neglectFish',pl:[[2,'몇 주 동안 물을 채우지 않음']],
   l:['여과기가 멈춘 물에서 배설물이 그대로 쌓입니다. 줄어든 물에 암모니아가 진하게 남습니다.','아가미 새엽이 붉게 부어오르고 서로 들러붙습니다. {n}은 얕은 물 표면에서 입을 벌립니다.','{n}은 갈색 물 바닥에 몸을 붙인 채, 아가미 뚜껑만 느리게 움직입니다. 며칠 뒤 그것도 멈춥니다.']}
});

/* EV-OWA-37 불 꺼진 방의 마지막 둘 [출처: 어류 기아 시 체성분 소모 순서(근육·간)] */
function owa37h(need){
  const tough=isSp('pleco','@gold','koi');
  if(tough&&fst().g>=capOf('g')*.85&&R()<.5)return {t:'반년 만에 조명을 켠 주인은 수조에 {n} 혼자 남아 있는 걸 봤습니다. 처음 산 무리 중 하나였습니다. 주인은 "역시 이 종이 튼튼하네"라며 같은 종 열 마리를 더 샀습니다.',c:'good',fx:{h:-10,fat:-.2},set:{stunted:1},run:()=>{const m=S.f.mates.find(m=>m.id===S.sp.id);if(m)m.n+=10;else S.f.mates.push({id:S.sp.id,n:10,cm:juvCm(S.sp.id)})}};
  return owa_hold(need,'OWA-37-D',{t:'먹이 없는 날이 몇 주 더 이어졌습니다. {n}의 등뼈 선이 드러났습니다.',c:'bad',fx:{h:-16,fat:-.3},set:{thin:1,stunted:1}});
}
fev([{id:'OWA-37',tier:'fact',own:['neglect'],cd:40,w:()=>owa_long(4)?2:.5,
  p:()=>{const f=S.f;let left=1;f.mates.forEach(m=>{if(left>0&&m.n>0){m.n=1;left--}else m.n=0});f.mates=f.mates.filter(m=>m.n>0);
    return '조명은 몇 주째 켜지지 않습니다. 창문 틈으로 들어오는 빛만으로 낮과 밤이 구분됩니다. 먹이는 오지 않습니다. 처음 있던 무리 중 지금 헤엄치는 몸은 '+(f.mates.length?'둘뿐입니다':'{n}뿐입니다')+'. 바닥의 다른 몸들은 이미 반쯤 사라졌습니다. {n}은…'},
  o:[
   {l:'유리벽과 장식에 붙은 이끼와 막을 갉는다',chk:['g',50],ok:{t:'{n}은 유리와 장식의 이끼를 갉아 먹으며 버텼습니다. 몸은 마른 채 멈췄습니다.',c:'good',fx:{g:2,h:-4,fat:-.1},set:{thin:1}},no:()=>owa37h(45)},
   {l:'남은 다른 하나를 따라다닌다',chk:['p',50],
    ok:()=>isSp('@predator')&&S.f.mates.length?{t:'{n}은 마지막 합사어를 삼켰습니다. 그 뒤로 수조에는 {n}뿐이었습니다.',c:'bad',fx:{h:6},run:()=>{S.f.mates=[];if(R()<.3)fSick('worms')}}:{t:'{n}은 떨어지는 부스러기를 남보다 먼저 차지했습니다.',fx:{p:2,h:-3}},
    no:()=>Object.assign(owa37h(45),{fx:{h:-18,st:.1,fat:-.3}})},
   {l:'움직이지 않고 기력을 아낀다',ok:()=>owa37h(40)}
  ]}]);
fevEnd({'OWA-37-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',fact:'neglectFish',pl:[[2,'몇 주 동안 먹이를 주지 않음']],
  after:'주인은 {n}이 죽은 걸 일주일 뒤에 알았습니다. 어항을 치운 건 그로부터 두 달 뒤였습니다.',
  l:['먹이가 끊긴 몸은 근육 단백질을 분해해 씁니다. 등 근육이 빠져 척추의 선이 등 위로 드러납니다.','머리는 그대로인데 몸통이 가늘어져, 머리가 몸보다 커 보입니다. 배는 안쪽으로 꺼집니다.','{n}은 유리벽을 입으로 쪼고, 바닥 자갈을 물었다가 뱉습니다. 움직일 때마다 남은 힘이 줄어듭니다.','어느 날 {n}은 바닥에서 몸을 일으키지 못합니다. 아가미 뚜껑은 며칠 더 느리게 움직입니다.']}});

/* EV-OWA-38 집주인이 문을 연 날 (주인 교체 또는 사망) */
function owa38_take(b){
  const k=owa_next([['grandma',2],['casual',3],['learner',2+b*2],['relay',b<0?2:.5]]);
  return {t:'청소 업체 직원은 {n}을 생수병에 담아 퇴근했습니다.',c:'good',run:()=>owa_to(k,'그날 처음으로 {n}은 사람의 손에서 먹이를 받았습니다. 그 손은 {n}의 원래 이름을 끝내 몰랐습니다.',{note:'방치된 집에서 발견됨'})};
}
fev([{id:'OWA-38',tier:'likely',own:['neglect'],once:1,w:()=>owa_long(6)?1:.3,
  p:'현관 쪽에서 열쇠 소리가 나고, 여러 사람의 발소리가 들어옵니다. 누군가 코를 막으며 창문을 엽니다. 한 사람이 녹색 수조 앞에 멈춰 섭니다. "이거 아직 살아 있는 거 아냐?" {n}은…',
  o:[
   {l:'남은 힘으로 유리 앞까지 나와 몸을 보인다',chk:['c',45],ok:()=>owa38_take(1),no:()=>R()<.5?owa38_take(-1):{end:'OWA-38-D'}},
   {l:'녹조 사이에서 천천히 움직인다',ok:()=>R()<.5?owa38_take(-1):{end:'OWA-38-D'}},
   {l:'바닥 구석에서 움직이지 않는다',ok:()=>isSp('clownloach')&&owa_roll('w',50)?{t:'수조를 비우려던 직원이 옆으로 누운 {n}을 건지려는 순간, {n}이 몸을 뒤집어 헤엄쳤습니다. 직원은 비명을 지르고, 웃고, 생수병을 찾았습니다.',c:'good',run:()=>q(null,null,()=>fevOut(owa38_take(0)))}
      :isSp('@escaper')&&R()<.3?{t:'수조는 이미 비어 있었습니다. 일주일 뒤, 소파를 들어낸 직원이 먼지를 뒤집어쓴 채 아가미를 움직이는 {n}을 찾았습니다.',c:'good',fx:{h:-15},run:()=>q(null,null,()=>fevOut(owa38_take(0)))}
      :R()<.2?owa38_take(-1):{end:'OWA-38-D'}}
  ]}]);
fevEnd({'OWA-38-D':{kind:'bad',cat:'버려짐',tier:'likely',fx:'f-trash',fact:'fFlush',pl:[[0,'수조째 방치하고 떠남']],
  after:'원래 주인은 보증금 정산 문자에만 답장했습니다.',
  l:['수조가 기울어지고 녹색 물이 욕실 배수구로 쏟아집니다. {n}은 물과 함께 미끄러져 배수구 거름망에 걸립니다.','물이 빠지자 아가미 새엽이 공기 중에 접혀 달라붙습니다. {n}은 몸을 튕기며 거름망 위에서 뒤집힙니다.','청소 직원이 거름망을 들어 쓰레기봉투에 털어 넣습니다. 봉투 안에서 몸이 몇 번 더 튑니다.']}});

/* ======================= K. 약품 연금술사 (alchemist) ======================= */

/* EV-OWA-39 예방 칵테일 [출처: 메틸렌블루·일부 항생제의 질화 세균 억제, 말라카이트그린의 무비늘어·테트라류 감수성, 복합 투약 위험] */
function owa39_stage2(extra){
  setFl('cycled',0);
  const n=40+(extra||0)+(owa_scl()?20:0)+(isSp('motoro')?5:0)+(isSp('neon','altum')?10:0)-(isSp('@gold','koi','pleco')?10:0);
  return owa_hold(n,'OWA-39-D',{t:'청록색 물에서 며칠이 갔습니다. {n}의 피부 점막이 얇게 벗겨졌다가 천천히 다시 덮였습니다.',c:'bad',fx:{h:-18,st:.12,wq:-10},set:{toxin:'med_mix',slime_loss:1,inj_gill:1},run:()=>{addFl('meds');addLog(T('주인은 "약이 부족했다"며 약을 한 병 더 샀습니다.'),'bad')}});
}
function owa39_seen(){
  if(fst().w>=capOf('w')*.85&&fst().c>=capOf('c')*.85)return {t:'유리에 몸을 붙이고 빙빙 도는 {n}을 한참 보던 주인이 처음으로 물을 절반 갈았습니다.',c:'good',fx:{h:-5,wq:15}};
  addLog(T('주인은 {n}의 움직임을 보고 "약이 덜 들었다"며 한 병을 더 열었습니다.'),'bad');addFl('meds');
  return owa39_stage2(10);
}
fev([{id:'OWA-39',tier:'fact',own:['alchemist'],cd:25,w:()=>S.f.ill?1:2,
  p:'수조에 파란 약이 풀리고, 한 시간 뒤엔 초록빛이 더해지고, 저녁에는 흰 가루가 쏟아집니다. 물 색이 탁한 청록색이 됩니다. 다음 날 여과기에서 나오는 물에서 시큼한 냄새가 납니다. 피부가 따끔거립니다. {n}은…',
  o:[
   {l:'주인이 다가올 때마다 유리 앞으로 나와 몸을 붙인다',chk:['c',50],ok:()=>owa39_seen(),no:()=>owa39_stage2()},
   {l:'수면을 빙빙 돈다',chk:['w',40],ok:()=>owa39_seen(),no:()=>owa39_stage2()},
   {l:'구석에 가만히 있는다',ok:()=>owa39_stage2()}
  ]}]);
fevEnd({'OWA-39-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',fact:'fMed',pl:[[1,'아프지도 않은데 약을 섞어 넣음']],
  after:'주인은 다음 물고기를 위해 약을 한 병 더 샀습니다. 이번 병은 "강력"이라고 쓰여 있었습니다.',
  l:['섞인 약이 피부 점막을 녹여 냅니다. 점막이 없는 피부에 다음 약이 그대로 닿습니다.','비늘 사이와 지느러미 막에서 상피가 얇게 벗겨져 물에 하늘거립니다. 아가미 새엽 상피도 같은 방식으로 떨어져 나갑니다.','여과재 속 세균이 죽은 물에서 암모니아가 오릅니다. {n}은 수면 가까이 떠서 입을 여닫습니다. 벗겨진 피부는 청록색으로 물들어 있습니다.','사흘째, {n}은 히터 옆에 몸을 붙인 채 아가미 뚜껑을 멈춥니다.']}});

/* EV-OWA-40 소금은 많을수록 [출처: 담수어 소금욕 권장 농도·시간 vs 고농도 장기 노출의 삼투 피해, 팔자복어 기수 요구] */
function owa40h(need){
  const n=need+(owa_scl()||isSp('altum','neon')?15:0)-(isSp('@livebearer')?10:0)-(isSp('@gold','koi')?5:0);
  return owa_hold(n,'OWA-40-D',{t:'짠물 속에서 며칠이 갔습니다. {n}의 피부 점막이 하얗게 엉겼다가 천천히 가라앉았습니다.',c:'bad',fx:{h:-16,st:.12,wq:-5},set:{salt:1,slime_loss:1,inj_gill:1},run:()=>{addFl('meds')}});
}
fev([{id:'OWA-40',tier:'fact',own:['alchemist'],cd:30,w:()=>S.f.ill||fl('inj_skin')?2:1,
  p:'주인이 굵은 소금을 한 줌, 또 한 줌 수조에 넣습니다. 소금 알갱이가 바닥에 쌓여 천천히 녹습니다. 물이 짜고 무겁습니다. 몸이 물을 빼앗기는 느낌이 듭니다. 아가미가 쓰립니다. {n}은…',
  o:[
   {l:'녹지 않은 소금 더미에서 멀리 떨어진다',chk:['w',35],ok:()=>isSp('fig8')?owa40_fig():owa40h(35),no:()=>isSp('fig8')?owa40_fig():owa40h(50)},
   {l:'주인 앞 유리로 나와 몸을 비튼다',chk:['c',55],ok:()=>isSp('fig8')?owa40_fig():{t:'주인이 "너무 짠가?" 하더니 물을 절반 갈았습니다.',c:'good',fx:{h:-6,wq:5},set:{salt:1}},no:()=>isSp('fig8')?owa40_fig():owa40h(50)},
   {l:'은신처에 들어가 움직이지 않는다',ok:()=>isSp('fig8')?owa40_fig():owa40h(50)}
  ]}]);
function owa40_fig(){return {t:'담수에서 시들던 {n}은 주인이 "치료"로 부은 소금 덕분에 몇 달 만에 색이 돌아왔습니다. 주인은 소금이 백점병 약이라고 확신했습니다. {n}은 처음부터 바닷물 쪽 물고기였습니다.',c:'good',fx:{h:15,st:-.15},set:{salt:1,brackish:1}}}
fevEnd({'OWA-40-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',fact:'소금욕은 정해진 농도로 짧게 하는 치료입니다. 본 수조에 진한 소금을 며칠씩 두면 몸의 물이 빠져나갑니다.',pl:[[1,'소금을 진하게 오래 넣음']],
  after:'주인은 커뮤니티에 "소금욕 했는데도 못 살렸네요"라고 썼습니다. 댓글에 농도를 묻는 질문이 달렸고, 주인은 "적당히"라고 답했습니다.',
  l:['바깥 물이 몸속보다 짜지자, 아가미와 피부를 통해 몸의 물이 빠져나갑니다.','피부 점막이 두껍게 엉겨 하얗게 일어나고, 아가미 새엽 상피가 오그라듭니다. 지느러미 막 가장자리가 말라 갈라집니다.','{n}은 은신처에서 나와 수면으로 갔다가, 다시 바닥으로 내려옵니다. 오르내릴 때마다 몸이 더 굳습니다.','눈이 안쪽으로 꺼지고, 몸통 옆선이 주름져 보입니다. 다음 날 아침, {n}은 바닥에 쌓인 소금 결정 옆에 누워 있습니다.']}});

/* EV-OWA-41 pH를 쫓는 사람 [출처: pH 쫓기(pH chasing)의 위험, KH 완충과 산성 급락, pH에 따른 비이온 암모니아 비율] */
function owa41(o,need){
  addFl('owa41n');
  const done=()=>{if(isKind('learner')){owa_learn('stable_ph','주인은 "수치보다 안정"이라는 글을 읽고 약병을 서랍에 넣었습니다.')}else{addFl('meds');addLog(T('주인은 완충제를 한 병 더 샀습니다.'),'bad')}};
  if(fl('owa41n')>=3&&R()<.5){setFl('owa41n',0);return owa_hold((need||45)+10,'OWA-41-D',{t:'하룻밤 사이 물이 급격히 산성으로 기울었습니다. {n}은 아가미를 크게 움직이며 아침을 맞았습니다.',c:'bad',fx:{h:-20,st:.15},set:{ph_crash:1,inj_gill:1,slime_loss:1},run:done})}
  if(o)return Object.assign({},o,{run:done});
  const n=need+(isSp('@gold','koi','@livebearer')&&fl('nh3')?10:0)+(isSp('fig8')?10:0)-(isSp('pleco','bichir','channa')?10:0);
  return owa_hold(n,'OWA-41-D',{t:'매일 바뀌는 물에 {n}은 지쳐 갔습니다. 아가미 안쪽이 늘 붉었습니다.',c:'bad',fx:{h:-10,st:.15},set:{inj_gill:1},run:done});
}
fev([{id:'OWA-41',tier:'fact',own:['alchemist','learner'],cd:25,when:()=>!fl('stable_ph'),w:()=>(isKind('alchemist')?2:.4)*(isSp('altum','neon','apisto','wildbetta','ghost','motoro','@gold','koi','@livebearer')?1.5:1),
  p:'매일 아침 작은 시험관에 물이 담기고, 색이 비교됩니다. 그때마다 수조에 무언가가 몇 방울 떨어집니다. 어제는 오르는 약, 오늘은 내리는 약입니다. 물의 맛이 하루하루 다릅니다. 아가미 안쪽이 늘 낯섭니다. {n}은…',
  o:[
   {l:'물이 바뀔 때마다 수조를 크게 돌며 적응한다',chk:['g',50],ok:()=>owa41({t:'{n}은 바뀌는 물에 그때그때 몸을 맞췄습니다.',fx:{g:2,st:.04}}),no:()=>owa41(null,45)},
   {l:'약이 떨어지는 자리에서 먼 쪽에 머문다',chk:['w',35],ok:()=>owa41({t:'{n}은 약이 떨어지는 자리를 피했습니다.',fx:{w:2,st:.05}}),no:()=>owa41({t:'약이 떨어지는 순간 {n}이 그 아래에 있었습니다. 아가미가 한동안 쓰렸습니다.',c:'bad',fx:{h:-6,st:.06},set:{inj_gill:1}})},
   {l:'바닥에 가만히 있는다',ok:()=>owa41(null,45)}
  ]}]);
fevEnd({'OWA-41-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',fact:'pH를 숫자에 맞추려고 매일 약을 넣으면, 물의 완충력이 바닥난 날 pH가 한꺼번에 떨어집니다. 물고기에게는 정확한 수치보다 안정이 중요합니다.',pl:[[2,'pH 수치를 매일 바꿈']],
  after:'주인은 기록장에 "pH 6.5 달성"이라고 적었습니다. 그 줄 아래에 다른 기록은 없었습니다.',
  l:['완충할 것이 다 떨어진 물에 내리는 약이 한 번 더 들어갑니다. 하룻밤 사이 물이 급격히 산성으로 기웁니다.','아가미 새엽 표면에 점액이 두껍게 분비되어 새엽 사이를 막습니다. 피부 점막도 뿌옇게 일어납니다.','{n}은 수면 근처에서 아가미 뚜껑을 빠르게 움직이고, 몸을 유리에 비빕니다. 비빈 자리에서 점막이 벗겨집니다.','아침에 시험관의 색은 처음으로 목표 숫자와 같습니다. {n}은 그 아래 바닥에서 아가미를 멈춰 있습니다.']}});

/* EV-OWA-42 과산화수소 — 이끼 잡는 법 [출처: 과산화수소의 수조 이끼 처리 사용과 과량 시 어류 아가미 손상] */
function owa42(o,need){
  const tail=()=>{setFl('cycled',0);if(R()<.25){setFl('h2o2_out',1);addLog(T('주인은 "물고기를 빼고 하면 된다"는 걸 알아냈습니다. 다음부터는 {n}을 손으로 건져 냈습니다.'),'sub')}else{addFl('meds')}};
  if(o)return Object.assign({},o,{run:tail});
  const n=need+(owa_scl()?15:0)-(isSp('@gold','koi','pleco')?10:0);
  return owa_hold(n,'OWA-42-D',{t:'거품이 가라앉고 나서도 {n}의 아가미는 며칠 동안 하얗게 부어 있었습니다.',c:'bad',fx:{h:-18,st:.12,wq:-8},set:{toxin:'h2o2',inj_gill:1,slime_loss:1},run:tail});
}
fev([{id:'OWA-42',tier:'fact',own:['alchemist'],cd:30,when:()=>!fl('h2o2_out'),w:()=>fl('light24')||(S.f.algae||0)>.3?2:1,
  p:'수조 유리와 돌에 검은 털 같은 이끼가 자랍니다. 주인은 갈색 병을 들고 와 뚜껑으로 양을 재지 않고 직접 붓습니다. 물속에서 작은 거품이 끝없이 올라옵니다. 이끼와 수초 잎과 유리 모두에서 거품이 납니다. 아가미가 타는 듯이 따갑습니다. {n}은…',
  o:[
   {l:'거품이 가장 적은 쪽으로 헤엄쳐 간다',chk:['w',45],ok:()=>owa42(null,35),no:()=>owa42(null,50)},
   {l:'수면으로 올라가 숨을 쉰다',ok:()=>owa_air()?owa42({t:'{n}은 수면에서 공기를 마시며 거품이 잦아들 때까지 버텼습니다.',fx:{h:-6}}):owa42(null,50)},
   {l:'은신처 안쪽으로 들어간다',chk:['g',50],ok:()=>owa42({t:'은신처 안의 물은 처음엔 덜 따가웠습니다. {n}은 버텼습니다.',fx:{g:2,h:-8}}),no:()=>owa42(null,50)}
  ]}]);
fevEnd({'OWA-42-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',fact:'과산화수소는 이끼를 태우는 만큼 물고기 아가미도 태웁니다. 양을 재지 않고 부으면 물 전체가 아가미에 닿습니다.',pl:[[1,'과산화수소를 재지 않고 부음']],
  after:'주인은 "이끼 제거 성공"이라는 제목으로 전후 사진을 올렸습니다. {n}은 "전" 사진에만 있었습니다.',
  l:['과산화수소가 이끼를 하얗게 탈색시키는 동안, 같은 물에 닿는 아가미 새엽 상피도 산화됩니다.','새엽 표면이 하얗게 변하며 부풀고, 새엽 끝에서 피가 배어 나옵니다. 피부 점막도 거품과 함께 벗겨져 떠오릅니다.','{n}은 수면에 입을 대고 숨을 쉬다가, 다시 바닥으로 내려가고, 또 올라옵니다. 오르내릴 때마다 아가미 뚜껑이 더 크게 벌어집니다.','다음 날 아침, 수조 안의 이끼는 모두 하얗게 죽어 있습니다. {n}은 그 이끼 사이에 끼인 채 움직이지 않습니다.']}});

/* EV-OWA-43 약장 정리 — "생체 포함 일괄" (주인 교체, alchemist 사건 줄의 끝) */
function owa43(b){
  const k=owa_next([['alchemist',3.5-b],['learner',3+b*2],['expert',b>0?1.5:.2],['casual',2],['relay',1.5]]);
  return {t:'판매 글에는 "약품 30종, 생체 1(서비스), 수조 포함"이라고 쓰여 있었습니다.',c:'sub',run:()=>owa_to(k,k==='alchemist'?'{n}은 약품 상자와 함께 또 다른 선반 앞 수조로 갔습니다.':'구매자는 약품을 다 버리고 {n}만 키웠습니다. 원래 주인은 그 사실을 몰랐습니다.',{note:'약품과 함께 일괄 판매'},()=>{
    setFl('toxin',0);if(isKind('learner','expert')){S.health=Math.min(S.hMax||100,S.health+12);addLog(T('첫 환수에서 약 냄새가 빠졌습니다. {n}의 피부가 천천히 맑아졌습니다.'),'good')}})};
}
fev([{id:'OWA-43',tier:'likely',own:['alchemist'],once:1,when:owa_ok,w:()=>fl('meds')>=2?2:.3,
  p:'선반 위 약병들이 상자에 쓸려 담깁니다. 병이 서른 개가 넘습니다. 주인은 상자와 수조를 한 장의 사진에 담습니다. 수조에 남은 건 {n}뿐입니다. 물은 여러 약의 색이 섞여 탁합니다. {n}은…',
  o:[
   {l:'사진을 찍는 쪽 유리로 나와 몸을 돌린다',chk:['c',55],ok:()=>owa43(1),no:()=>owa43(0)},
   {l:'탁한 물속에서 평소처럼 헤엄친다',ok:()=>owa43(0)},
   {l:'바닥 구석에 머문다',ok:()=>owa43(-.5)}
  ]}]);
