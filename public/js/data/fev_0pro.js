/* ---------- v0.11: the prologue, rebuilt to the Stage 0–2 design ----------
   Three origin tracks, shown to the player from the first line:
     wild    — born in a river, caught, held, flown, quarantined           (GameRule ROOT A)
     farm    — born on a farm, sorted, shipped, through the wholesaler     (ROOT B)
     breeder — born in a home breeder's tank, selected, sold by the breeder (ROOT C)
   Every stage is a catalogue event (data/fev_*.js, stages origin / trade / shop), and every capture
   or sorting moment has a way out: a wild fish that gets away stays in its river ('free'), a farm fish
   that slips into the drain lives in the farm's ditch, a breeder's fish that jumps lands in a floor
   drain and ends up in a Korean stream. Outcomes that escape set {escape:1} (fevOut). */

/* ---------- which track ---------- */
/* share of each species that comes from a home breeder (rest of the non-wild ones: farms) */
const PRO_BREEDER={betta:.55,guppy:.55,apisto:.55,oranda:.45,ryukin:.45,koi:.4,platy:.45,cory:.3,peapuffer:.2,altum:.15,oscar:.25,comet:.2,fig8:.15,pleco:.25,neon:.12,motoro:.25,arowana:.1,channa:.15,bichir:.2};
/* v0.12: the fixed lines of the prologue, several of each (the same four lines opened two lives in three) */
const PRO_L={
 crew:r=>pick(['채집꾼들이 그물을 들고 '+r+'에 들어왔다. 오늘의 출연진이다.','건기가 되자 '+r+'의 물이 얕아졌다. 그 타이밍에 딱 채집꾼들이 들어왔다. 타이밍이 나쁘다. 이 작품은 늘 그렇다.',r+' 물가에 작은 배 두 척이 대어졌다. 배 바닥에는 빈 양동이가 쌓여 있었다. 빈 양동이. 복선이다. 아마.','새벽, '+r+' 위로 손전등 불빛 몇 개가 흔들렸다. 반딧불이가 아니었다. 채집꾼들이었다.']),
 middle:()=>pick(['{n}은 채집꾼 마을의 대야에서 중간상인에게, 중간상인에게서 수출업자에게 넘겨졌다. 릴레이다. 바통은 {n}이다. 주인이 바뀔 때마다 물도 바뀌었다.','{n}은 강가 마을의 시멘트 수조에서 몇 주를 지냈다. 수출업자의 트럭이 올 때까지 같은 물에 수백 마리. 합숙이다. 원하지 않은 합숙.','{n}은 중간상인의 오토바이 뒤, 비닐봉지 안에서 비포장도로를 세 시간 달렸다. 물고기다. 다시 말하지만 물고기다. 멀미는 한다.']),
 fly:()=>pick(['{n}은 물이 반쯤 찬 비닐봉지에 산소와 함께 담겨 스티로폼 상자에 실렸다. 첫 해외여행. 좌석은 화물칸. 어둡고 추웠다.','{n}의 봉지는 상자 맨 아래 칸에 놓였다. 그 위로 상자 다섯 개가 더 쌓였다. 비행기 화물칸은 어두웠다. 창가 자리는 아니었다.','{n}은 산소를 채운 봉지에 담겨 테이프로 봉한 상자 안에서 이틀을 보냈다. 경유지 공항의 창고는 더웠다. 환승 라운지는 없었다.']),
 qt:()=>pick(['인천의 수입업체 검역 수조. 기생충을 잡는 약을 탄 물에서 {n}은 며칠을 보냈다. 입국 심사다. 도장은 없다.','수입업체 직원이 상자를 열고 봉지째 수조에 띄웠다. 죽은 것을 건져 내고, 남은 것을 약을 탄 물에 옮겼다. {n}은 남은 쪽이었다. 일단은.','{n}은 "야생 개체 · 입고 2주 후 판매"라는 종이가 붙은 수조에서 약 냄새 나는 물속에 지냈다. 대기 번호를 받은 기분이다.']),
 hatch:farm=>isSp('@livebearer')?pick(['{n}은 '+farm+'의 어미 수조에서 태어났다. 어미는 한 번에 수십 마리를 낳았고, 낳자마자 몇 마리를 다시 먹었다. …엄마? 엄마!?','{n}은 '+farm+'의 산란통 그물 아래로 떨어지며 태어났다. 그물 위 어미의 입이 닿지 않는 쪽이었다. 태어나자마자 생존 게임이다.'])
   :pick(['{n}은 '+farm+'에서 수천 개의 알 중 하나로 깨어났다. 주인공 치고는 엑스트라 비율이 너무 높다.',farm+'의 연못에 알이 붙은 수초 다발이 옮겨졌다. 그 수초에서 {n}이 깨어났다. 수초 출신이다. 자랑은 아니다.','{n}은 '+farm+'에서 깨어났다. 같은 날 같은 물에서 깬 치어가 수만 마리였다. 동기가 너무 많다.']),
 sort:()=>pick(['양식장 사람들이 치어를 체에 걸러 지느러미와 몸 모양을 하나씩 살폈다. 오디션이다. 심사위원은 웃지 않는다.','작업자가 치어를 하얀 대야에 쏟고, 손가락으로 한 마리씩 다른 그릇에 옮겼다. 옮겨지지 않은 쪽이 어디로 가는지는 아무도 말하지 않았다. 말 안 해도 안다.','크기별로 구멍이 다른 체 세 개가 차례로 물에 들어갔다. 남는 것과 빠져나가는 것이 나뉘었다. 1차, 2차, 3차 면접이다.']),
 kept:()=>pick(['{n}은 "팔 수 있는" 쪽에 남았다. 합격이다. 축하할 일인지는 모르겠다.','{n}은 대야의 "출하" 쪽에 담겼다. 데뷔 확정. 소속사는 없다.','작업자의 손이 {n}을 지나쳤다. {n}은 남았다. 숨은 안 쉬었다. (아가미로는 쉬었다)']),
 ship:()=>pick(['출하 전 이틀 동안 먹이가 끊겼다. 강제 다이어트다. {n}은 수십 마리와 함께 비닐봉지에 담겼다.','{n}은 같은 크기의 형제 수십 마리와 함께 산소를 채운 봉지에 담겼다. 봉지 입구는 고무줄로 세 번 감겼다. 탈출 불가. 장인의 솜씨다.','출하 날 아침 연못 물이 빠졌다. 그물에 걸려 올라온 {n}은 다른 수백 마리와 함께 큰 통에 부어졌다. 대이동이다. 본인 의사는 묻지 않았다.']),
 whole:()=>pick(['도매상 수조에서 {n}은 다른 양식장에서 온 물고기들과 같은 물을 나눠 썼다. 낯선 얼굴들과 셰어하우스다.','도매상 창고의 수조들은 배관 하나로 모두 이어져 있었다. {n}의 수조에도 옆 칸의 물이 흘러들었다. 공유 경제다. 공유하고 싶지 않았다.','도매상에 도착한 날, 직원이 봉지를 수조에 쏟고 죽은 것만 골라냈다. 나머지는 그날 저녁 소매점 주문대로 다시 나뉘었다. 쉴 틈이 없다. 택배 상하차다.']),
 bsell:()=>pick(['분양이 정해졌다. {n}은 작은 봉지에 담겨 새 주인에게 가는 길에 올랐다. 새 주인. 두근두근. 물고기는 두근거릴 수 있다. (진짜다)','입금이 확인되자 {n}은 손바닥만 한 봉지에 담겼다. 봉지 겉에는 매직으로 이름 대신 번호가 적혔다. 아직은 번호다.','{n}은 지하철역 출구 앞에서 봉지째 새 주인 손에 건네졌다. 거래는 일 분도 안 걸렸다. 첩보 영화 같았다. 수상한 건 아니다. 아마.'])
};
const PRO_TRACK={wild:{l:'야생 채집',mark:'🌊'},farm:{l:'양식장',mark:'🏭'},breeder:{l:'개인 브리더',mark:'🏠'}};
(()=>{const _init=fishInit;
  fishInit=function(){_init();const f=S.f;
    f.track=f.wild?'wild':R()<(PRO_BREEDER[S.sp.id]||.03)?'breeder':'farm';
    if(f.track==='breeder'&&S.f.wild)f.wild=false;
    S.env=f.track==='wild'?'wildriver':'farm';S.status=PRO_TRACK[f.track].l;
  };
})();
FLAG.track=()=>S.f.track||(S.f.wild?'wild':'farm');

/* wild-origin moments that take place after the fish is already in the net */
const PRO_POSTCATCH=['ORG-15','TRK-W09','TRK-W10'];

/* ---------- escape ---------- */
/* fevOut understands {escape:1}; the prologue reads f.escape after each moment */
(()=>{const _out=fevOut;fevOut=function(o,e){
  if(o&&typeof o==='object'&&!Array.isArray(o)&&o.escape){S.f.escape=1;S.f.escTrack=S.f.track}
  return _out(o,e)}})();
/* an escape option for a moment whose event has none, written for the track and checked against the species */
function proEscapeOpt(stage){
  const f=S.f,x=fx_(),small=x.cm<8,t=f.track;
  if(t==='wild'&&stage==='origin')return {l:small?'그물코가 성긴 쪽으로 몸을 비튼다 (작아서 다행)':'진흙을 파고들어 그물 밑으로 빠진다',chk:small?['w',35]:['p',55],
    ok:{t:small?'{n}의 몸이 그물코 사이로 쏙 빠져나갔다. 비늘 몇 장이 그물에 남았다. 기념품이다. 채집꾼은 기뻐하지 않았다.':'{n}은 진흙을 헤집고 그물 밑으로 빠져나갔다. 진흙 범벅. 하지만 자유다.',c:'good',fx:{h:-6},escape:1,mem:'그물이 지나갔다. 그 물에 남았다.'},
    no:{t:'{n}은 몸을 비틀었다. 그물코는 생각보다 촘촘했다. 계산 착오다. 아가미 뚜껑 가장자리가 그물에 쓸려 찢어졌다.',c:'bad',fx:{h:-10,fin:.08}}};
  if(t==='farm'&&stage==='origin')return {l:'체를 박차고 배수구 쪽으로 뛴다',chk:small?['p',22]:['p',45],
    ok:{t:'{n}은 체 가장자리를 차고 튀어 올랐다. 착지 지점은 연못 배수구였다. 물살이 {n}을 콘크리트 관 속으로 끌고 갔다. 탈옥 영화의 그 장면이다.',c:'good',fx:{h:-12},escape:1},
    no:{t:'{n}은 튀어 올랐다가 체 그물 위로 다시 떨어졌다. 작업자의 장갑 낀 손이 {n}을 다른 치어들 위로 눌렀다. 탈옥 실패. 다음 화에 계속. 안 한다.',c:'bad',fx:{h:-8,fin:.05}}};
  if(t==='breeder'&&stage==='origin'&&(x.jump||0)<.1)return {l:'사이펀 호스 입구로 다가간다 (위험한 호기심)',chk:['w',30],
    ok:{t:'{n}은 호스 입구로 빨려 들어갔다. 양동이에 쏟아진 물은 그대로 욕실 배수구로 부어졌고, {n}도 함께 쓸려 내려갔다. 워터슬라이드. 편도.',c:'good',fx:{h:-15},escape:1},
    no:{t:'호스 입구가 {n}의 옆구리를 빨아들였다가 놓았다. 비늘 몇 장과 점막이 호스 안으로 사라졌다. 호스는 사과하지 않았다.',c:'bad',fx:{h:-8}}};
  if(t==='breeder'&&stage==='origin')return {l:'열린 뚜껑 틈으로 뛰어오른다',chk:['p',35],
    ok:{t:'{n}은 뚜껑 틈으로 뛰어올랐다. 욕실 타일에 떨어져 몇 번 튀다가, 배수구 거름망 틈으로 미끄러져 들어갔다. 골인. 이게 골인인지는 모르겠다.',c:'good',fx:{h:-18},escape:1},
    no:{t:'{n}은 뚜껑 가장자리에 머리를 박고 수조 안으로 떨어졌다. 쿵. 주둥이 끝이 하얗게 짓물렀다.',c:'bad',fx:{h:-8}}};
  return null;
}

/* ---------- one moment of the prologue as a choice ---------- */
function proChoice(stage){
  const pool=fevPool(stage);
  if(!pool.length){const esc=proEscapeOpt(stage);return esc?{who:null,p:'{n}은…',o:[esc,{l:'가만히 있는다',ok:{t:'{n}은 움직이지 않았다.'}}].map(o=>proOpt(o,null))}:null}
  const e=wpick(pool);
  S.seen['ev'+e.id]=(S.seen['ev'+e.id]||0)+1;if(e.once)S.once['ev'+e.id]=1;S.cd['ev'+e.id]=S.tick+(e.cd||40);
  if(e.log)q(T(valOf(e.log)),'sub');
  if(!e.o)return {who:null,p:null,auto:e,ev:e};
  let opts=e.o.filter(o=>!o.when||o.when());
  const hasEsc=JSON.stringify(e.o,(k,v)=>typeof v==='function'?v.toString():v).includes('escape');
  const esc=hasEsc||PRO_POSTCATCH.includes(e.id)?null:proEscapeOpt(stage);
  if(esc&&opts.length<5)opts=opts.concat([esc]);
  return {who:e.who||null,p:valOf(e.p),o:opts.map(o=>proOpt(o,e)),ev:e};
}
function proOpt(o,e){
  /* escapes are possible but rare: a way out, not a habit */
  const isEsc=JSON.stringify(o,(k,v)=>typeof v==='function'?v.toString():v).includes('escape');
  /* v0.12: a fry a few weeks old is netted with the leaves; it does not choose a way out */
  if(isEsc&&S.ageM<1.5)return {l:valOf(o.l),d:'아직 너무 어리다 (쌀알 사이즈)',dis:1,c:'neutral',r:''};
  const ch0=fevChance(o.chk),ch=ch0<0?ch0:isEsc?ch0*(S.f.track==='wild'?.8:.2):ch0;   // v0.20: a wild fish slips the net more often
  if(ch<0)return {l:valOf(o.l),d:o.lockText||'{n}의 몸으로는 무리다',dis:1,c:'neutral',r:''};
  const c=valOf(o.chk);
  return {l:valOf(o.l),d:o.d?valOf(o.d):'',c:'neutral',r:'',fx:()=>{const ok=c?R()<ch:true;fevOut(ok?o.ok:(o.no||o.ok),e);if(c&&ok)fStat(c[0],2)}};
}

/* ---------- escapes, by track ---------- */
fevEnd({
 'ESC-FARM':{kind:'happy',cat:'배수로',tier:'likely',fx:'f-home',
  l:()=>['배수관 끝은 양식장 뒤 흙탕물 수로였다. {n}은 수로 바닥 갈대 뿌리 사이에 몸을 붙였다. 새 주소: 흙탕물 수로 갈대 뿌리 1번지.','양식장에서 흘러나온 사료 찌꺼기가 수로로 쏟아졌다. {n}은 그것을 먹고 자랐다. 공짜 급식이다. 출처가 좀 그렇지만.',
   '{n}은 '+josa(ageLabel(S.sp.life*(.4+R()*.4)),'을')+' 그 수로에서 살았다. 체 위에 남은 형제들은 그해 겨울 모두 비닐봉지에 담겨 팔려 나갔다. 흙탕물도 집은 집이었다.']}
});

/* ---------- the prologue ---------- */
fishPrologue=function(){
  const x=fx_(),f=S.f,t=f.track||'wild';
  const steps=[];const step=fn=>steps.push(fn);
  const die=(p,key)=>S.ending||R()<p*(f.odds&&f.odds[key]||1)*modeK('die')*.45&&(fEnd(key),true);   // v0.14: the prologue is a taste of 억까, not where most lives end
  const grow=m=>{S.ageM+=m;S.month+=m;f.len=Math.max(f.len,x.cm*clamp(.05+S.ageM/(S.sp.life*.2),.05,x.start||.4))};
  /* a catalogue moment: the choice, or an automatic event, then whatever follows */
  const moment=(stage,before)=>q(null,null,()=>{const c=proChoice(stage);if(!c)return;
    if(before)before(c.ev);
    if(c.auto){fevOut(c.auto.auto,c.auto);return}
    if(c.o.filter(o=>!o.dis).length)askChoice(c,()=>{})});
  /* after a capture or sorting moment: an escaped fish leaves the chain */
  const escaped=()=>{
    if(!f.escape)return false;
    if(t==='wild'){q(T('그물이 올라갔을 때, {n}은 거기 없었다. 채집꾼이 그물을 두 번 봤다. 없다.'),'good',()=>{S.status='강에서 삶'});
      q(T('같은 날 같은 물에서 태어난 형제들은 그날 밤 비행기에 실렸다.'),'sub');q(null,null,()=>fEnd('free'));return true}
    if(t==='farm'){q(null,null,()=>fevFinish('ESC-FARM'));return true}
    q(T('바닥 배수관은 아파트 하수관으로, 하수관은 동네 하천으로 이어져 있었다. 대탈주 루트 완성. 냄새는 묻지 마라.'),'bad');
    q(null,null,()=>{f.released=1;f.len=Math.max(f.len,x.cm*.15);S.preOwner=1;goWild('river')});return true;
  };
  f.odds={};f.preShop=t==='breeder'?(R()<.7?'breeder':'friend'):wpick(x.shops.filter(s=>!['breeder','friend'].includes(s[0])).concat(t==='farm'?[]:[]))||wpick(x.shops);
  if(t!=='breeder'&&['breeder','friend'].includes(f.preShop))f.preShop='shop';

  /* the banner: where this life starts */
  step(()=>{q(T(PRO_TRACK[t].mark+' 출신 — '+PRO_TRACK[t].l),'mile');next()});

  if(t==='wild'){
    step(()=>{q(T(x.region+'. 그곳의 물에서 {n}이 태어났다. 이것이 이 이야기의 1화다.'),'neutral',()=>{S.env='wildriver'});q(null,null,next)});
    step(()=>{q(null,null,()=>{S.ageM=f.capAge;S.month+=f.capAge;f.len=x.cm*clamp(f.capAge/(S.sp.life*.2),.08,.8)});
      q(T(f.capAge>=1?'{n}은 그 물에서 '+josa(ageLabel(f.capAge),'을')+' 자랐다. 평화로웠다. 아직은.':'{n}은 아직 몸길이가 쌀알 몇 개만 했다. 주인공 사이즈는 아니다.'),'sub');
      q(T(PRO_L.crew(x.region)),'bad',()=>{S.status='채집 중';S.scaredT=3});
      /* v0.12: a moment that already happens after the catch (a bucket, a boat floor) gets the catch line first, and only once */
      const caught=()=>{f.capShown=1;addLog(T(x.catch||'{n}은 '+x.region+'에서 채집꾼의 그물에 걸렸다. 1화 만에 위기다.'),'bad');S.env='catch';S.status='포획됨';f.path.push('포획')};
      moment('origin',ev=>{if(ev&&PRO_POSTCATCH.includes(ev.id))caught()});
      q(null,null,()=>{if(S.ending||escaped())return;
        if(!f.capShown)q(null,null,caught);
        q(null,null,()=>{if(!die(.03+.07*(1-x.hardy),'capture'))next()})})});
    step(()=>{q(T(PRO_L.middle()),'sub',()=>{S.env='holding';S.status='중간 유통';grow(.6);f.path.push('중간상인')});
      moment('trade');
      q(null,null,()=>{if(!die(.05+.13*(1-x.hardy),'holding'))next()})});
    step(()=>{q(T(PRO_L.fly()),'sub',()=>{S.env='box';S.status='항공 운송';grow(.1);f.path.push('항공 운송')});
      moment('trade');
      q(null,null,()=>{if(!die(.03+.1*(1-x.hardy),'transport'))next()})});
    step(()=>{q(T(PRO_L.qt()),'sub',()=>{S.env='quarantine';S.status='수입 검역';grow(.4);f.path.push('수입 검역');
        if(R()<.6) f.carrier=S.sp.id==='clownloach'&&R()<.6?'skinny':'worms'});
      q(null,null,()=>{if(!die(.03+.08*(1-x.hardy)+(x.scaleless?.08:0),'quarantine'))next()})});
  } else if(t==='farm'){
    step(()=>{q(T(S.sp.id==='betta'?'{n}은 태국의 한 베타 농장에서 태어났다. 바닥에는 물 담긴 유리병 수천 개가 줄지어 있었다. 다 자라면 {n}도 그중 한 병에 들어갈 차례였다. 원룸이다. 아주 작은 원룸.'
      :S.sp.id==='clownloach'?'양식장 사람들이 어미 로치에게 호르몬 주사를 놓았다. 그렇게 받아 낸 알에서 {n}이 깨어났다. 출생의 비밀이다. 별로 낭만은 없다.'
      :S.sp.id==='gar'?'원산지에서 몰래 들여온 어미에게서, 아시아의 한 양식장이 치어를 받아 냈다. 그중 하나가 {n}이었다. 출신부터 수상하다.'
      :PRO_L.hatch(x.farm)),'neutral',()=>{S.env='farm'});q(null,null,next)});
    step(()=>{q(T(S.sp.id==='betta'?'선별 작업자가 병을 하나씩 들어 불빛에 비춰 봤다. 와인 감정사처럼. 물고기 감정사다.':S.sp.id==='koi'?'양식장 사람들이 치어를 체에 걸러 무늬를 하나씩 살폈다. 무늬가 운명을 가른다. 잉어의 세계는 냉정하다.':PRO_L.sort()),'sub',()=>{grow(1.5);f.path.push('선별')});
      moment('origin');
      q(null,null,()=>{if(escaped())return;if(S.ending)return;if(R()<(x.cull||.03)*(f.odds.cull||1)*.5){fEnd('cull');return}q(T(PRO_L.kept()),'sub');next()})});
    step(()=>{const bot=S.sp.id==='betta';
      q(T(bot?'{n}은 손바닥만 한 병에 혼자 담겼다. 출하 전 며칠은 먹이가 없었다. 원룸에 식비 없음.':PRO_L.ship()),'sub',()=>{S.env=bot?'bottles':'box';S.status='출하';S.health-=8;grow(clamp(S.sp.life*.04,1,5));f.path.push(bot?'병 사육':'출하')});
      moment('trade');
      q(null,null,()=>{if(!die(.02+.06*(1-x.hardy),'transport'))next()})});
    step(()=>{q(T(PRO_L.whole()),'sub',()=>{S.env='quarantine';S.status='도매';grow(.3);f.path.push('도매');if(R()<.3)f.carrier=pick(['ich','ich','velvet',S.sp.id==='guppy'||S.sp.id==='platy'?'tetra':'finrot'])});
      moment('trade');
      q(null,null,()=>{if(!die(.02+.05*(1-x.hardy),'quarantine'))next()})});
  } else {
    step(()=>{q(T(f.preShop==='friend'?'{n}은 한 동호인의 거실 수조에서 수십 마리 형제와 함께 태어났다. 어미는 그 사람이 몇 달 전 마트에서 사 온 한 쌍이었다. 계획에 없던 대가족이다.'
      :'{n}은 한 개인 브리더의 방에서 태어났다. 선반마다 같은 크기의 수조가 줄지어 있었다. 어미와 아비는 브리더가 혈통을 보고 고른 한 쌍이었다. 명문가다. 본인은 모른다.'),'neutral',()=>{S.env='farm';S.status='개인 브리더'});
      q(null,null,()=>{grow(clamp(S.sp.life*.04,1,4));next()})});
    step(()=>{q(T(f.preShop==='friend'?'치어가 수십 마리로 불어나자 주인은 "다 키울 수는 없어…" 하며 한 마리씩 들여다봤다. 이제 알았냐.':'브리더가 치어를 한 마리씩 떠서 지느러미와 몸 모양, 무늬를 살폈다. 옆에는 빈 양동이가 놓여 있었다. 그 양동이가 무섭다.'),'sub',()=>{f.path.push('브리더 선별')});
      moment('origin');
      q(null,null,()=>{if(escaped())return;if(S.ending)return;if(R()<(x.cull||.05)*(f.odds.cull||1)*.4){fEnd('cull');return}q(T('{n}은 "분양할" 쪽에 남았다. 양동이는 피했다.'),'sub');next()})});
  }

  /* the shop (or the breeder's sale) */
  step(()=>{
    const shop=f.preShop||wpick(x.shops);f.shop=shop;const sh=FSHOP[shop];
    if(shop==='breeder'||shop==='friend'){S.origin=sh.l;f.path.push(sh.l);
      q(T(shop==='friend'?'주인이 "치어 많이 태어났어요, 필요한 사람 가져가세요" 글을 올렸다. {n}은 그 형제들 중 한 마리였다. 무료 나눔. 가격표가 없는 삶의 시작이다.':'{n}은 브리더의 분양 글 사진 속 한 마리가 되었다. 프로필 사진 데뷔. 보정은 없다.'),'sub',()=>{S.env='shop'});
      moment('shop');q(T(PRO_L.bsell()),'sub',()=>{S.env='box'});moment('trade');q(null,null,next);return}
    if(shop==='fair'){proFair();return}
    S.origin=sh.l;f.path.push(sh.l);
    q(T(shop==='mart'&&(x.cm>=25||f.wild)?'{n}은 대형마트 수족관 코너 끝 수조에 "이색 열대어" 이름표와 함께 들어갔다. 다 자란 크기는 적혀 있지 않았다. 그게 제일 중요한 정보인데.':shop==='mart'?'{n}은 대형마트 수족관 코너의 작은 수조에 "특가" 가격표와 함께 들어갔다. 같은 수조에 수십 마리. 1+1 행사장이다.'
      :shop==='vase'?'{n}은 꽃집 진열대의 꽃병에 담겼다. 꽃병 위에는 식물이 꽂혀 수면을 덮고 있었다. 인테리어 소품 취급이다. 물고기다. 다시 말하지만 물고기다.'
      :shop==='online'?'{n}은 판매 사이트 사진 속 한 마리가 되었다. "생물 택배 가능, 도착 후 사망 시 사진 필수". 이용 약관이 무섭다.'
      :shop==='bigshop'?'{n}은 대형어 전문 숍 수조에 들어갔다. 가격표에는 다 자란 크기가 적혀 있지 않았다. 전문 숍인데. 전문 숍인데!'
      :pick(['{n}은 수족관 전문점 판매 수조에 들어갔다. 쇼윈도 데뷔다.','{n}은 수족관 전문점 벽면 수조의 맨 아래 칸에 들어갔다. 가격표 글씨가 물기에 번져 있었다. 얼마인지 아무도 모른다. 본인도.','{n}의 판매 수조 앞에 "신규 입고" 종이가 붙었다. 다음 주에 그 종이는 다른 수조로 이사했다. 신인의 유통기한은 일주일이다.'])),'sub',()=>{S.env='shop';S.status='판매 중';S.ageM+=.5;S.month+=.5;if(shop==='mart'&&R()<.3&&!f.carrier)f.carrier='ich'});
    if(shop!=='vase')moment('shop');
    q(null,null,()=>{if(!die((.02+.06*(1-x.hardy))*(shop==='mart'?1.6:1),'shop')&&!fShopFate())next()});
  });
  /* the night-market scooping pool: kept from v0.9, unchanged */
  function proFair(){
    S.origin=FSHOP.fair.l;f.path.push('야시장 뜰채 체험');
    q(T('{n}은 킬로그램 단위로 파는 "먹이용 금붕어" 상자에 담겨 야시장 상인에게 넘겨졌다. 한 상자에 수백 마리. 단위가 "마리"가 아니라 "킬로"다.'),'sub',()=>{S.env='box';S.status='야시장 상인'});
    q(T('해가 지자 천막 아래 얕은 플라스틱 풀에 물이 채워졌다. 전구 줄이 켜지고 "금붕어 뜰채 체험 · 한 판 3,000원" 간판이 걸렸다. 축제다. 금붕어만 빼고.'),'sub',()=>{S.env='stall';S.status='뜰채 체험장';S.ageM+=.2;S.month+=.2});
    moment('shop');
    let night=0;
    const nightStep=()=>{night++;
      q(null,null,()=>askChoice({who:'뜰채 체험장에서',p:night===1?'종이 뜰채가 물을 가르며 내려온다. 풀 가장자리에 손들이 빼곡하다. 사방이 적이다. {n}은…':'또 밤이 왔다. 물은 어제보다 탁하고 미지근하다. 종이 뜰채가 또 내려온다. 2회차다. {n}은…',o:[
        {l:'뜰채 가장자리로 빠져나간다 (종이는 약하다)',r:'{n}은 뜰채 가장자리를 스치고 빠져나갔다. 젖은 종이가 찢어졌다. 아이가 울었다. 3,000원이 날아갔다.',c:'neutral',fx:()=>{f.dodge=R()<.85?1:0}},
        {l:'다른 금붕어들 밑으로 숨는다 (미안, 동료들)',r:'{n}은 무리 아래로 파고들었다. 인간 방패. 아니, 금붕어 방패.',c:'neutral',fx:()=>{f.dodge=R()<.7?1:0}},
        {l:'가만히 있는다',r:'{n}은 움직이지 않았다. 종이 뜰채가 {n}을 떠 올렸다. "잡았다!" 아이가 환호했다.',c:'neutral',fx:()=>{f.dodge=0}}]},()=>{}));
      q(null,null,()=>{
        if(R()<.06+(season()==='summer'?.06:0)+night*.02){fEnd('stall');return}
        if(!f.dodge){if(R()<.25){q(T('종이 뜰채가 중간에 찢어졌다. {n}은 아스팔트 바닥에 떨어져 퍼덕였고, 누군가 맨손으로 집어 풀에 다시 던졌다. 손이 닿은 자리의 점막이 벗겨졌다. 친절은 늘 정답이 아니다.'),'bad',()=>{S.health-=12;f.fin+=.1})}else{q(null,null,next);return}}
        if(night>=3){q(T('야시장 마지막 날 밤. 손님이 빠지자 상인이 풀에 남은 금붕어들을 내려다봤다. 재고 정리의 시간이다.'),'sub');
          q(null,null,()=>{const o=wpick([['stream',35],['feeder',35],['trash',30]]);
            if(o==='stream'){q(T('상인은 남은 금붕어들을 양동이째 근처 하천에 쏟았다. "살 놈은 살겠지." 그런 대사는 악역이 한다.'),'bad');q(null,null,()=>{f.released=1;f.len=Math.max(f.len,3);goWild('river')})}
            else if(o==='feeder'){q(T('남은 금붕어들은 "먹이용"으로 수족관에 헐값에 넘겨졌다. 장르가 바뀌었다. 공포물이다.'),'bad');q(null,null,()=>fEnd('feeder',pick(['oscar','arowana','channa','bichir'])))}
            else fEnd('stalltrash')});return}
        q(T(pick(['다음 날 밤, 풀의 물은 갈리지 않았다. 밤사이 떠오른 금붕어 몇 마리를 상인이 뜰채로 걷어 냈다. 아무 말도 없이.','한낮 햇볕을 받은 풀의 물은 미지근했다. 상인은 얼음 몇 덩이를 띄웠다. 대책이다. 대책이라고 부르기로 했다.'])),'bad',()=>{S.health-=6;S.ageM+=.03;S.month+=.03});
        q(null,null,nightStep)});
    };
    nightStep();
  }
  step(()=>{fishBuy()});
  let i=0;function next(){if(S.ending)return;const s=steps[i++];if(s)s()}
  next();
};
