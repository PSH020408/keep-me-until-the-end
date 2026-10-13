/* ---------- v0.10 catalogue: owner kinds B + the owner-change system (events/07_ownersB.md, EV-OWB-01~47) ----------
   techbro · relay · release · shared · decor · unbox · staff · bait · touch · grandma · breakup, then
   moving, marriage, a baby, hospital, an owner who dies, a breakup, a closing business, boredom, a fish too big,
   and the first water of a new home. OWB-08 (방생 법회 대야) lives in fev_core.js.
   Probabilities and needs here are mechanism estimates (never shown as fact). */

/* ---------- helpers ---------- */
/* 근성 endurance: (g/need)², 5–95%; success → ok, failure → the ending */
/* a failed hold mostly leaves tissue damage (owb_scar); df = share of failures that end the life */
const OWB_HARSH=['mill','neglect','cult','alchemist','bait','touch','release'];
const owb_df=()=>OWB_HARSH.includes(kindOf())?.27:.2;
function owb_hold(need,end,ok,df){need=Math.max(8,need);
  if(R()<clamp(Math.pow(fst().g/need,2),.05,.95))return valOf(ok)||{t:'{n}은 버텼습니다.',c:'sub',fx:{h:-8}};
  if(R()<(df===undefined?owb_df():df))return {end:valOf(end)};
  return owb_scar(ok,valOf(end))}
const OWB_SCAR={
 gill:{t:'아가미 새엽 몇 줄이 끝부터 하얗게 죽어 떨어져 나갔습니다. 남은 새엽으로 {n}은 몇 주 동안 숨을 몰아쉬었습니다.',fx:{h:-8,st:.08},set:{inj_gill:1}},
 skin:{t:'점막이 벗겨진 옆구리에 붉은 궤양이 패었습니다. 궤양은 몇 주에 걸쳐 비늘 없는 거친 흉터로 덮였습니다.',fx:{h:-8,st:.06},set:{inj_skin:1,slime_loss:1}},
 fin:{t:'지느러미 막이 기조 사이마다 녹아 내려, 지느러미 끝이 기조만 남은 채 짧아졌습니다.',fx:{h:-6,fin:.12},set:{inj_fin:1}},
 thin:{t:'등 근육이 빠져 드러난 척추 선은 그 뒤로도 다시 덮이지 않았습니다.',fx:{h:-8,fat:-.2},set:{weight:'thin'}},
 cold:{t:'차가운 물에 오래 있던 지느러미 끝이 하얗게 괴사해 떨어져 나갔습니다.',fx:{h:-8,fin:.1},set:{inj_fin:1}},
 throat:{t:'찢긴 목구멍 점막은 아물며 두꺼운 흉터가 되었습니다. {n}은 그 뒤로 큰 먹이를 삼키다 자주 뱉어 냈습니다.',fx:{h:-8},set:{inj_gill:1}}
};
const OWB_SCAR_CAT={'질병':'skin','학대':'skin','체험':'skin','뜰채 체험':'skin','먹이':'skin','미끼':'skin','굶주림':'thin','동사':'cold','택배':'cold','스트레스':'fin'};
const OWB_SCAR_ID={'OWB-35-D':'fin','OWB-37-D':'thin','OWB-12-D':'cold','OWB-21-D':'throat','OWB-29-D':'skin','OWB-18-D':'thin'};
function owb_scar(ok,end){
  const E=FEVEND[end]||{},s=OWB_SCAR[OWB_SCAR_ID[end]||OWB_SCAR_CAT[E.cat]]||OWB_SCAR.gill;
  ok=valOf(ok)||{t:'{n}은 버텼습니다.',c:'sub',fx:{h:-8}};if(ok.end)return {t:s.t,c:'bad',fx:s.fx,set:s.set};
  const fx=Object.assign({},ok.fx||{});for(const k in s.fx)fx[k]=(fx[k]||0)+s.fx[k];
  return Object.assign({},ok,{c:'bad',fx,set:Object.assign({},ok.set||{},s.set),run:()=>{addLog(T(s.t),'bad');if(ok.run)ok.run()}});
}
/* a plain stat roll without showing an option check */
const owb_roll=(k,need)=>R()<clamp(Math.pow(fst()[k]/Math.max(1,need),2),.05,.95);
const owb_trop=()=>isSp('@tropical');
const owb_cold=()=>isSp('@gold','koi');
const owb_air=()=>isSp('@airbreather');
/* the better of two checks this species can actually attempt */
const owb_best=(a,b)=>{const ok=[a,b].filter(z=>z[1]<=capOf(z[0]));if(!ok.length)return a;return ok.sort((x,y)=>fst()[y[0]]/y[1]-fst()[x[0]]/x[1])[0]};
/* how often each kind learns after a near miss (07_ownersB §0, estimates) */
const OWB_LEARN={techbro:.8,relay:.1,release:0,shared:.05,decor:.15,unbox:.1,staff:.5,bait:0,touch:.1,grandma:.4,breakup:.2};
function owb_learn(key,line,p){
  const k=kindOf();if(p===undefined)p=OWB_LEARN[k]!==undefined?OWB_LEARN[k]:Math.max(0,(KIND[k]||{learn:.3}).learn);
  if(fl(key)||R()>=p)return;setFl(key,1);if(k==='techbro')addFl('sensor');
  addLog(T(line),'good');S.f.lessons=(S.f.lessons||0)+1;S.r=clamp(S.r+.02,0,.97)}

/* ---------- the owner-change system (07_ownersB §12) ---------- */
/* next owner by route; 'same' keeps the owner, 'shop' goes back to a shop and is sold again,
   'river' is a release, 'flush' a toilet or the bin, 'left' left behind */
const OWB_ROUTE={
 move:[['same',60],['grandma',10],['learner',8],['gift',12],['casual',10]],
 marry:[['same',50],['grandma',30],['relay',10],['casual',10]],
 baby:[['casual',30],['eager',20],['relay',20],['learner',15],['expert',5],['grandma',10]],
 hospital:[['grandma',30],['gift',30],['neglect',25],['same',15]],
 death:[['relay',30],['casual',20],['staff',15],['shop',15],['river',10],['flush',10]],
 breakup:[['breakup',40],['relay',20],['casual',20],['left',20]],
 closure:[['decor',25],['expert',10],['staff',20],['casual',20],['shop',15],['left',10]],
 bored:[['relay',30],['casual',20],['eager',15],['gift',15],['river',10],['flush',10]],
 oversize:[['expert',30],['decor',20],['relay',25],['river',25]]
};
const OWB_GOOD=['expert','learner'],OWB_MID=['content','breeder','grandma','staff','gift','shop','same'];
const owb_fits=k=>k==='bait'?isSp('comet','guppy','platy'):k==='touch'?isSp('@gold','koi'):k==='flush'?(isSp('@small')||fx_().cm<8):k==='mill'?false:true;
function owb_draw(route,o){
  o=o||{};const c=fst().c;let list=(OWB_ROUTE[route]||OWB_ROUTE.bored).map(z=>z.slice());
  if(o.only){const l2=list.filter(z=>o.only.includes(z[0]));list=l2.length?l2:o.only.map(k=>[k,1])}
  if(o.drop)list=list.filter(z=>!o.drop.includes(z[0]));
  const mul=(k,m)=>list.forEach(z=>{if(z[0]===k)z[1]*=m});
  /* charm: a fish that photographs well is taken by someone who chooses carefully */
  for(let i=0;i<=(o.bonus||0);i++)list.forEach(z=>{if(OWB_GOOD.includes(z[0]))z[1]*=1+c/50;else if(!OWB_MID.includes(z[0]))z[1]*=Math.max(.1,1-c/200)});
  if(isSp('arowana','koi'))mul('decor',2);
  if(isSp('oscar','channa')){mul('content',1.5);mul('unbox',1.5)}
  if(isSp('gar'))mul('river',3);if(isSp('pleco','motoro'))mul('river',1.5);
  if(isSp('betta'))mul('gift',1.5);
  if(isSp('neon','guppy','platy','cory'))mul('relay',1.5);
  if(isSp('comet','guppy'))mul('bait',1.5);
  if(o.mul)for(const k in o.mul)mul(k,o.mul[k]);
  list=list.filter(z=>owb_fits(z[0])&&z[1]>0);
  if(!list.length)return 'casual';
  return wpick(list);
}
/* transport (§12-3): 근성 need by how the fish travels */
const OWB_RIDE={icebox:30,bag:45,bottle:55,basin:50,truck:65,parcel:60,carry:40};
function owb_mode(k,route){
  if(isSp('@big'))return ['expert','staff'].includes(k)?'icebox':'basin';
  if(['expert','staff','breeder'].includes(k))return 'icebox';
  if(['grandma','shared','decor'].includes(k))return 'carry';
  if(k==='unbox')return 'parcel';
  if(route==='move')return 'truck';
  if(route==='breakup')return 'bottle';
  return 'bag';
}
function owb_rideNeed(mode,mod){
  let n=(OWB_RIDE[mode]||45)+(mod||0);const s=season(),tw=s==='winter'&&owb_trop();
  if(mode==='bag')n+=(s==='summer'?20:0)+(tw?15:0);
  if(mode==='bottle'||mode==='basin')n+=s==='summer'?15:0;
  if(mode==='truck')n+=(s==='summer'?20:0)+(tw?20:0);
  if(mode==='parcel')n+=(tw?20:0)+(s==='summer'?10:0);
  if(['bag','bottle','parcel','truck'].includes(mode)&&owb_air())n-=15;
  if(['bag','parcel'].includes(mode)&&isSp('pleco','cory','bichir','clownloach'))n+=10;
  if(isSp('@puffer'))n+=5;
  if(isSp('@big'))n+=10;
  return n;
}
const owb_ride=(mode,mod)=>owb_roll('g',owb_rideNeed(mode,mod));
/* hand the fish to a new owner of kind k (null: whoever buys it from a shop) */
function owb_rehome(k,text,o){
  o=o||{};
  fRehome(text,{own:k?KIND[k].base:undefined,tank:o.tank,place:o.place,name:o.name,note:o.note||'다른 사람에게 넘김'});
  q(null,null,()=>{
    if(S.ending||S.done)return;const f=S.f;
    if(k){f.kind=k;if(['neglect','cult','mill'].includes(k)){f.lazy=0;f.grow=0}if(k==='cult')f.filter='없음'}
    setFl('owb_recv',1);setFl('breakup_stage',k==='breakup'?(o.bstage||0):0);setFl('feeder',k==='bait'?1:0);setFl('hooked',0);setFl('blanket',0);setFl('vase',0);
    if(o.after)o.after();
    setFl('owb_new',1);
    if(['expert','learner','staff'].includes(kindOf())){setFl('owb_new',0);addLog(T('새 주인은 봉지를 수면에 띄워 수온을 맞추고, 물을 조금씩 섞었습니다.'),'good');return}
    const e=FEV.find(x=>x.id==='OWB-47');if(e&&!S.waiting&&fevOk(e,'home'))fevRun(e);
  });
}
const OWB_TXT={
 move:'이삿날, 주인은 {n}을 데려가지 않기로 했습니다.',marry:'신혼집에는 수조 자리가 없었습니다. {n}은 다른 집으로 갔습니다.',
 baby:'"아기 때문에요." 판매글에는 그렇게 적혀 있었습니다. {n}은 다른 집으로 갔습니다.',hospital:'주인이 오래 입원하게 되자, 가족이 {n}을 맡았습니다.',
 death:'유품을 정리하던 가족이 {n}을 다른 사람에게 넘겼습니다.',breakup:'두 사람이 헤어지고, {n}은 다른 집으로 갔습니다.',
 closure:'가게가 문을 닫는 날, {n}은 다른 사람 손에 넘어갔습니다.',bored:'주인은 "어항째 무료 나눔" 글을 올렸습니다. {n}은 다른 집으로 갔습니다.',
 oversize:'수조가 {n}의 몸을 감당하지 못했습니다. {n}은 다른 집으로 갔습니다.'};
const OWB_NOTE={move:'이사하며 넘김',marry:'결혼하며 넘김',baby:'아기가 생겨 넘김',hospital:'입원으로 맡김',death:'주인이 돌아오지 않음',breakup:'이별하며 넘김',closure:'폐업하며 넘김',bored:'싫증 나서 넘김',oversize:'너무 커져서 넘김'};
/* a route as an outcome: draw the next owner, travel, arrive. o: bonus only drop mul force ride rideMod rideEnd(+If) endFlush endLeft endRiver(+If) text sameText */
function owb_move(route,o){
  o=o||{};const k=o.force||owb_draw(route,o);
  const out={c:'sub'};
  if(k==='flush')return {end:o.endFlush||'OWB-45-D'};
  if(k==='left')return o.endLeft?{end:o.endLeft}:{run:()=>{render();fEnd('left')}};
  if(k==='river'){
    if(o.endRiver&&(!o.endRiverIf||o.endRiverIf()))return {end:o.endRiver};
    return {t:o.riverText||'주인은 밤에 {n}을 근처 하천으로 데려갔습니다.',c:'bad',run:()=>fRelease()};
  }
  const mode=o.ride||owb_mode(k,route);
  if(!owb_ride(mode,o.rideMod)){
    if(o.rideEnd&&(!o.rideEndIf||o.rideEndIf())&&R()<(o.rideDf===undefined?.25:o.rideDf))return {end:o.rideEnd};
    out.t=pick(['가는 길에 봉지 속 물이 뿌옇게 흐려졌습니다. 도착했을 때 {n}은 옆으로 기운 채 아가미를 크게 벌리고 있었습니다.','오는 내내 봉지가 흔들렸습니다. {n}의 옆구리 비늘 몇 장이 봉지 바닥에 떨어져 있었습니다.']);out.c='bad';out.fx={h:-18,st:.15};
  }
  if(k==='same'){out.t=(out.t?out.t+' ':'')+(o.sameText||'주인은 {n}을 데리고 갔습니다.');return out}
  const text=o.text||OWB_TXT[route]||OWB_TXT.bored;
  out.run=()=>owb_rehome(k==='shop'?null:k,k==='shop'?'{n}은 수족관으로 되돌아갔고, 며칠 뒤 다시 팔렸습니다.':text,{note:OWB_NOTE[route],tank:o.tank,place:o.place,bstage:o.bstage});
  return out;
}

/* ================= 1. techbro — 스마트홈 덕후 ================= */
/* [출처: 수온 상승에 따른 용존산소 감소 / 온도 컨트롤러 센서 이탈로 인한 과열 사고 사례] */
fev([{id:'OWB-01',stage:'home',tier:'fact',own:['techbro','eager','expert'],need:{heater:1},cd:50,
  when:()=>!fl('owb01_fix')&&(isKind('techbro')||fl('sensor')>0),w:()=>isKind('techbro')?4:.4,
  p:'새벽, 수조 뒤에서 작은 딸깍 소리가 납니다. 유리에 붙어 있던 하얀 선 하나가 수면 위로 늘어져 흔들립니다. 히터 쪽 물이 조금씩 따뜻해집니다. {n}은…',
  o:[
   {l:'히터에서 가장 먼 쪽, 물이 덜 따뜻한 곳을 찾아간다',chk:['w',40],ok:()=>owb01(-15),no:()=>owb01(0)},
   {l:'수조 앞 작은 카메라 렌즈 쪽 유리에 붙어 크게 맴돈다',chk:()=>['c',isSp('@big')?42:isSp('@small')?60:50],
    ok:{t:'새벽 4시, 주인의 휴대폰에 "움직임 감지" 알림이 떴습니다. 주인은 일어나 물 밖으로 빠진 센서를 다시 물에 넣었습니다. 다음 날 수조에는 센서가 세 개, 컨트롤러가 두 개 달렸습니다.',c:'good',fx:{h:-5,c:2},mem:'밤에 물이 뜨거워졌다. 불이 켜지고 손이 들어왔다.',
     run:()=>owb_learn('owb01_fix','주인은 센서를 고정 클립으로 물속에 묶고, 컨트롤러를 하나 더 달았습니다.')},
    no:()=>owb01(0)},
   {l:'바닥 은신처에 가만히 있는다',ok:()=>owb01(0)}
  ]}]);
function owb01(mod){
  const need=60+mod-(owb_air()?10:0)+(owb_cold()?10:0);
  return owb_hold(need,'OWB-01-D',{t:'아침 7시, 주인이 앱의 온도 그래프를 보고 히터 플러그를 뽑았습니다. {n}은 수면 아래에서 아가미를 빠르게 여닫으며 버티고 있었습니다.',c:'bad',fx:{h:-18,st:.15},set:{inj_gill:1},
    run:()=>owb_learn('owb01_fix','주인은 센서를 고정 클립으로 물속에 묶고, 컨트롤러를 하나 더 달았습니다.')});
}
fevEnd({'OWB-01-D':{kind:'bad',cat:'과열',tier:'fact',fx:'f-cook',pl:[[3,'온도 센서를 물 밖에 둠']],
  fact:'물이 따뜻할수록 물에 녹아 있을 수 있는 산소는 줄어듭니다. 온도 센서가 물 밖으로 빠지면 컨트롤러는 물이 아니라 공기의 온도를 읽습니다.',
  l:['센서는 물 밖에서 방 안 공기 온도를 읽습니다. 컨트롤러는 계속 "온도 낮음"으로 판단하고 히터를 끄지 않습니다.','수온이 오를수록 물에 녹는 산소는 줄고, {n}의 몸이 쓰는 산소는 늘어납니다.','{n}은 수면 바로 아래에서 아가미 뚜껑을 빠르게 여닫습니다. 아가미 새엽의 모세혈관이 늘어나 새엽이 붉게 부풉니다.','{n}은 평형을 잃고 옆으로 기운 채 가슴지느러미만 계속 젓습니다.','아침 7시, 앱의 온도 그래프는 밤새 한 방향으로 올라가 있습니다.']}});

/* [출처: 자동 급이기 습기 뭉침·막힘 사례 / 과잉 급이와 암모니아 상승] */
fev([{id:'OWB-02',stage:'home',tier:'fact',own:['techbro','casual'],cd:50,
  when:()=>!fl('owb02_fix')&&(isKind('techbro')||fl('autofeeder')>0),w:()=>isKind('techbro')?3:.5,
  log:()=>{setFl('owb02j',R()<.5?1:0);return '주인이 나흘 동안 집을 비웠습니다. 급이기 앱에는 "하루 두 번"이 설정되어 있었습니다.'},
  p:()=>fl('owb02j')?'수조 위 급이기에서 모터 소리가 납니다. 소리만 나고, 아무것도 떨어지지 않습니다. 다음 날도, 그다음 날도 그렇습니다. {n}은…'
    :'수조 위 급이기에서 모터 소리가 납니다. 평소처럼 가루가 흩날리지 않고, 뭉친 사료 덩어리 하나가 통째로 떨어집니다. 덩어리는 물을 먹고 천천히 가라앉습니다. {n}은…',
  o:[
   {l:'가라앉는 덩어리를 따라가 계속 뜯어 먹는다',when:()=>!fl('owb02j'),chk:()=>isSp('@small')?null:['g',50],
    ok:()=>isSp('@small')?owb02w(0):{t:'{n}은 배가 불룩해질 때까지 먹었습니다. 남은 덩어리는 바닥으로 내려갔습니다.',c:'sub',fx:{fat:.2},run:()=>q(null,null,()=>fevOut(owb02w(isSp('oscar','arowana')?-10:0)))},
    no:()=>isSp('@gold')?{t:'{n}의 배가 부풀어 올랐습니다. 몸이 자꾸 한쪽으로 기울었습니다.',c:'bad',sick:'swimb',run:()=>q(null,null,()=>fevOut(owb02w(0)))}
      :{t:'{n}은 먹은 것을 다 소화하지 못하고 하얀 똥을 길게 달고 다녔습니다.',c:'bad',fx:{h:-8,wq:-8},run:()=>q(null,null,()=>fevOut(owb02w(0)))}},
   {l:'떨어져 나온 부스러기 몇 개만 먹고 물살 쪽으로 간다',when:()=>!fl('owb02j'),chk:['w',35],ok:()=>owb02w(-10),no:()=>owb02w(0)},
   {l:'은신처에 가만히 있는다',when:()=>!fl('owb02j'),ok:()=>owb02w(isSp('@bottom')?5:0)},
   {l:'모터 소리가 날 때마다 수면으로 올라간다',when:()=>!!fl('owb02j'),ok:()=>owb02s(0)},
   {l:'유리와 바닥의 이끼를 뒤진다',when:()=>!!fl('owb02j'),chk:['w',35],ok:()=>owb02s(-10),no:()=>owb02s(0)},
   {l:'은신처에 가만히 있는다',when:()=>!!fl('owb02j'),ok:()=>owb02s(-5)}
  ]}]);
function owb02w(mod){
  const f=fl('filter');const need=55+mod+(f==='canister'||f==='hob'?-10:f==='none'?15:0)+(isSp('@bottom')?5:0);
  return owb_hold(need,'OWB-02-D',{t:'나흘 뒤 돌아온 주인이 뿌옇게 흐린 물을 보고 절반을 갈았습니다. {n}의 아가미 끝이 붉게 부어 있었습니다.',c:'bad',fx:{h:-12,wq:-10},set:{inj_gill:1},
    run:()=>owb_learn('owb02_fix','주인은 습기 막는 급이기로 바꾸고 수질 센서를 하나 더 달았습니다.',isKind('techbro')?.8:.05)});
}
function owb02s(mod){
  if(!isSp('neon','guppy','peapuffer')&&isSp('@big'))return {t:'나흘 동안 아무것도 떨어지지 않았습니다. 큰 몸의 {n}에게 나흘은 긴 시간이 아니었습니다.',c:'sub',fx:{h:-2}};
  if(owb_roll('g',(isSp('neon','guppy','peapuffer')?55:40)+mod))return {t:'나흘째, 돌아온 주인이 급이기를 열어 굳은 사료를 긁어냈습니다. {n}의 배가 조금 꺼져 있었습니다.',c:'sub',fx:{h:-6},run:()=>owb_learn('owb02_fix','주인은 습기 막는 급이기로 바꾸고 수질 센서를 하나 더 달았습니다.',isKind('techbro')?.8:.05)};
  return {t:'나흘 동안 {n}의 배가 안쪽으로 꺼졌습니다. 등뼈 선이 드러났습니다.',c:'bad',fx:{h:-20,st:.1},set:{weight:'thin'}};
}
fevEnd({'OWB-02-D':{kind:'bad',cat:'수질 악화',tier:'fact',fx:'f-float',pl:[[2,'급이기에 맡기고 집을 비움']],fact:'fWater',
  l:['뭉친 사료가 바닥에 가라앉아 풀어집니다. 이틀째 바닥에 하얀 곰팡이 실이 덮이고 물이 뿌옇게 흐려집니다.','분해되는 사료에서 나온 암모니아가 아가미 새엽 상피를 붓게 합니다.','{n}은 여과기 출수구 아래 물살에 머리를 대고 아가미를 벌립니다. 부은 새엽들이 서로 들러붙어 숨 쉬는 면이 줄어듭니다.','나흘째 {n}은 출수구 아래에서 물살에 밀려 천천히 바닥으로 내려갑니다.','주인의 휴대폰에는 "급여 완료" 알림이 하루 두 번씩 계속 옵니다.']}});

/* [출처: 이산화탄소 과다(고탄산혈증)와 어류 혈중 산소 운반(Root·Bohr 효과) / 수초 수조 CO2 과다 폐사 사례] */
fev([{id:'OWB-03',stage:'home',tier:'fact',own:['techbro','expert'],cd:50,
  when:()=>!fl('owb03_fix')&&(isKind('techbro')||fl('co2')>0),w:()=>isKind('techbro')?2+fl('sensor')*.5:.3,
  p:'조명이 꺼졌는데 디퓨저에서 작은 기포가 계속 올라옵니다. 수초 잎 사이 물이 무겁게 느껴집니다. 다른 물고기들이 수면 쪽으로 몰립니다. {n}은…',
  o:[
   {l:'수면으로 올라가 입을 대고 버틴다',chk:['g',50],ok:()=>owb03(owb_air()?-10:0,owb_air()),no:()=>owb03(0)},
   {l:'여과기 출수구 물살이 수면을 흔드는 곳으로 간다',chk:['w',40],ok:()=>owb03(-15),no:()=>owb03(0)},
   {l:'수초 아래에 가만히 있는다',ok:()=>owb03(0)}
  ]}]);
function owb03(mod,gain){
  const fix=()=>owb_learn('owb03_fix','주인은 밸브를 두 겹으로 바꾸고 pH 컨트롤러를 달았습니다. "센서 하나 더"라고 메모했습니다.');
  if(isSp('@labyrinth'))return {t:'아침, 수조의 물고기들이 모두 수면에 매달려 있었습니다. {n}만 평소처럼 수면에서 공기를 한 모금씩 마시고 있었습니다. 주인은 로그를 보고 "베타는 이산화탄소 센서로 쓸 수 있겠다"고 메모했습니다. 다음 주 수조에는 pH 컨트롤러가 붙었고, {n}은 여전히 센서 대신 지켜보는 쪽이었습니다.',c:'good',fx:{g:gain?3:1},set:{ph_crash:1},run:fix};
  const need=55+mod-(isSp('cory','bichir','gar','channa','pleco')?20:0)-(isSp('peapuffer')?5:0);
  return owb_hold(need,'OWB-03-D',{t:'아침 9시, 조명이 켜지고 수초 잎에서 기포가 올라오기 시작했습니다. {n}은 수면 아래에서 아가미를 크게 벌린 채 버텼습니다.',c:'bad',fx:{h:-15,st:.12,g:gain?3:0},set:{ph_crash:1},run:fix});
}
fevEnd({'OWB-03-D':{kind:'bad',cat:'질식',tier:'fact',fx:'f-bottom',pl:[[3,'이산화탄소 밸브 점검 안 함']],
  fact:'물속 이산화탄소가 너무 많아지면 물고기는 피 속 이산화탄소를 내보내지 못하고, 피가 산소를 덜 붙잡게 됩니다.',
  l:['밤새 솔레노이드 밸브가 닫히지 않고 이산화탄소가 물에 녹아듭니다.','물속 이산화탄소가 높아지자 {n}의 아가미는 혈액 속 이산화탄소를 물로 내보내지 못합니다. 혈액이 산성으로 기울고 헤모글로빈이 산소를 덜 붙잡습니다.','{n}은 수면에 입을 대고 아가미를 빠르게 움직입니다. 움직일수록 몸은 산소를 더 씁니다.','새벽, {n}은 수면에서 떨어져 수초 사이에 옆으로 눕습니다.','아침 9시, 타이머가 조명을 켜고 수초 잎에서 산소 기포가 올라오기 시작합니다.']}});

/* [출처: 자동 급수 장치 플로트 고착 침수 사례 / 잔류 염소 어류 아가미 독성] */
fev([{id:'OWB-04',stage:'home',tier:'fact',own:['techbro'],cd:60,when:()=>!fl('owb04_fix'),w:()=>.6+fl('sensor')*.8,
  p:'수조 옆 가는 관에서 물이 계속 졸졸 흘러듭니다. 수면이 유리 테두리까지 올라오고, 물에서 수돗물 냄새가 납니다. 테두리 너머로 물이 넘치기 시작합니다. {n}은…',
  o:[
   {l:'넘치는 물살이 당기는 수면 가장자리에 머문다',chk:['p',40],ok:()=>owb04c(0),no:()=>owb04c(5)},
   {l:'물살 반대편, 수조 가장 깊은 곳으로 내려간다',chk:['w',35],ok:()=>owb04c(-10),no:()=>isSp('@small')&&!fl('lid')&&R()<.15?{end:'OWB-04-S'}:owb04c(0)},
   {l:'은신처에 가만히 있는다',ok:()=>isSp('@small')&&!fl('lid')&&R()<.08?{end:'OWB-04-S'}:owb04c(0)}
  ]}]);
function owb04c(mod){
  const need=45+mod-(tankL()>=120?10:0)-(isSp('@big')?10:0)+(isSp('@scaleless')?10:0);
  return owb_hold(need,'OWB-04-C',{t:'퇴근한 주인이 젖은 바닥을 보고 밸브를 잠갔습니다. {n}의 몸 표면이 뿌옇게 흐려져 있었습니다.',c:'bad',fx:{h:-15,st:.1},set:{chlorine:1,slime_loss:1},near:'dechlor',
    run:()=>{owb_learn('owb04_fix','주인은 역삼투 정수기와 누수 센서를 달았습니다.');if(isSp('@jumper')&&!fl('lid')&&!S.waiting&&R()<.3)q(null,null,()=>fCr('jump'))}});
}
fevEnd({
 'OWB-04-S':{kind:'bad',cat:'사고',tier:'fact',fx:'f-floor',pl:[[3,'자동 급수기 점검 안 함']],
  l:['수면이 테두리를 넘자 물이 유리 가장자리를 따라 흘러내립니다. 수면 근처에 있던 {n}은 넘치는 물에 실려 테두리 밖으로 나갑니다.','받침대 위 얕은 물에서 {n}은 몸을 튕깁니다. 물이 마루 틈으로 빠지면서 {n}의 몸 아래가 마릅니다.','피부 점막이 마르며 마루에 들러붙습니다. 아가미 뚜껑이 열린 채 새엽이 말라 서로 붙습니다.','수도관에 이어진 밸브는 계속 열려 있습니다.']},
 'OWB-04-C':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[2,'수돗물이 계속 들어감']],fact:'fChlor',
  l:['몇 시간 동안 염소가 든 수돗물이 수조로 들어옵니다. 잔류 염소가 아가미 새엽 표면 상피세포를 산화시킵니다.','상처를 덮으려 나온 점액이 새엽 위에 하얗게 엉깁니다.','{n}은 물이 들어오는 관 반대편 바닥에서 아가미 뚜껑을 빠르게 움직입니다. 피부 점막이 벗겨져 몸 표면이 뿌옇게 흐려집니다.','아랫집 천장에 물 얼룩이 번질 무렵 {n}의 아가미 뚜껑은 멈춰 있습니다.']}
});

/* ================= 2. relay — 당근 나눔 돌려막기 ================= */
/* [출처: 아질산 중독(갈색혈액병)과 메트헤모글로빈 / 염화물의 아질산 흡수 억제] */
fev([{id:'OWB-05',stage:'home',tier:'fact',own:['relay','casual','eager'],need:{cycled:0},cd:40,
  when:()=>isKind('relay')||S.owners>1,w:()=>isKind('relay')?4:1.5,
  p:'새 집의 물은 냄새가 없습니다. 유리도 자갈도 반짝입니다. 사흘째부터 물이 아주 조금씩 비릿해집니다. {n}은…',
  o:[
   {l:'주는 먹이를 다 먹지 않고 조금만 먹는다',chk:['g',40],ok:()=>owb05(-10),no:()=>owb05(0)},
   {l:'여과기 물살이 닿는 곳을 찾아가 머문다',chk:['w',35],ok:()=>owb05(-5),no:()=>owb05(0)},
   {l:'바닥에 가만히 있는다',ok:()=>owb05(0)}
  ]}]);
function owb05(mod){
  const need=50+mod-(isSp('platy','comet','pleco','gar','channa','bichir')?15:0)+(isSp('neon','altum','clownloach','ghost','motoro')?15:0)-(fl('salt')?10:0);
  return owb_hold(need,'OWB-05-D',{t:'둘째 주가 지나자 물 냄새가 가라앉았습니다. {n}의 아가미 끝은 한동안 거무스름했습니다.',c:'bad',fx:{h:-14,st:.1,i:-.1},set:{cycled:1,inj_gill:1},
    run:()=>owb_learn('owb05_fix','주인은 "물잡이"라는 말을 처음 검색했습니다. 다음 주인에게는 전해지지 않을 공부였습니다.')});
}
fevEnd({'OWB-05-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',pl:[[2,'물잡이 없이 바로 넣음']],fact:'fCycle',
  l:['첫 주에는 암모니아가, 둘째 주에는 아질산이 쌓입니다.','아질산이 아가미로 들어와 혈액의 헤모글로빈을 메트헤모글로빈으로 바꿉니다. 산소를 나르지 못하는 피가 갈색을 띱니다.','{n}의 아가미 새엽은 붉은빛을 잃고 초콜릿색이 됩니다. {n}은 물속 산소가 충분한데도 수면에서 입을 벌립니다.','헤엄칠수록 숨이 더 가빠지고, {n}은 여과기 옆 구석에 몸을 기대고 멈춥니다.']}});

/* [출처: 대형 관상어 분양 거절·유기 사례(플레코·가아 등)] */
fev([{id:'OWB-06',stage:'home',tier:'fact',own:['relay'],sp:['@big','bichir'],cd:40,w:()=>S.f.len>=fx_().cm*.4?3:1,
  log:'"15cm라더니요." 대야를 들여다본 사람이 말했습니다.',
  p:'대야 위로 낯선 얼굴이 내려다봅니다. 얼굴이 한참 멈춰 있다가 뒤로 물러납니다. 사람들 목소리가 높아집니다. {n}은…',
  o:[
   {l:'고개를 들어 낯선 얼굴 쪽으로 다가간다',chk:()=>['c',isSp('motoro')?63:55],ok:()=>owb_move('oversize',{bonus:1,drop:['river'],text:'낯선 사람은 한참 망설이다 대야째 {n}을 차에 실었습니다.'}),no:()=>owb06b()},
   {l:'대야 벽을 꼬리로 치며 몸을 돌린다',chk:()=>['p',isSp('motoro')?68:60],ok:()=>owb_move('oversize',{mul:{expert:1.5},drop:['river'],text:'"힘이 좋네요." 대형어를 키운다는 사람이 {n}을 데려갔습니다.'}),
    no:{t:'물이 사방으로 튀었습니다. 낯선 사람은 젖은 바지를 털며 돌아갔습니다.',c:'bad',run:()=>q(null,null,()=>fevOut(owb06b()))}},
   {l:'몸을 둥글게 말고 가만히 있는다',ok:()=>owb06b()}
  ]}]);
function owb06b(){
  if(isSp('channa')&&R()<.2)return {t:'밤사이 {n}은 대야 가장자리를 넘어 베란다 바닥으로 기어 나갔습니다.',c:'bad',run:()=>{if(!S.waiting)fCr('escape')}};
  return owb_hold(60-(owb_air()?15:0),'OWB-06-D',()=>{
    addFl('owb06_rej');
    if(isSp('gar')&&fl('owb06_rej')>=3)return Object.assign({t:'세 번째 거절이었습니다.'},owb_move('oversize',{force:'river'}));
    return Object.assign({},owb_move('oversize',{drop:['river']}),{t:'사흘 뒤, 같은 사진으로 올린 판매글에 다른 사람이 연락해 왔습니다.',c:'sub'});
  });
}
fevEnd({'OWB-06-D':{kind:'bad',cat:'버려짐',tier:'fact',fx:'f-bucket',pl:[[2,'몸보다 작은 대야에 둠']],fact:'fOutgrow',
  l:['대야의 물은 {n}의 몸 높이보다 얕습니다. {n}은 몸을 둥글게 말아 대야 벽에 꼬리를 댑니다.','여과기 없는 물에 배설물이 쌓이고 암모니아가 오릅니다. 수면 밖으로 나온 등지느러미 끝이 마르고, 마른 자리부터 기조 사이 막이 갈라집니다.','사흘째 오후, 베란다 볕이 대야를 데웁니다. {n}은 몸을 돌리려고 꼬리를 치다 대야 벽에 주둥이를 부딪혀 피부가 벗겨집니다.','저녁, {n}의 아가미 뚜껑은 수면 아래에서 멈춰 있고, 같은 사진으로 새 판매글이 올라옵니다.']}});

/* [출처: 백점충(Ichthyophthirius multifiliis) 생활사·감염 경로 / 신규 개체 격리 권고] */
fev([{id:'OWB-07',stage:'home',tier:'fact',own:['casual','eager','learner','relay'],need:{owb_recv:1,qt:0},once:1,w:4,
  when:()=>!(isSp('@small')&&fPredMate()),
  log:'새 주인은 {n}을 데려온 날 바로 원래 있던 수조에 넣기로 했습니다.',
  p:'봉지가 열리자마자 {n}은 낯선 물고기들이 가득한 수조로 쏟아집니다. 몇 마리가 다가와 {n}의 지느러미 근처를 맴돕니다. 바닥 자갈에 몸을 문지르는 물고기가 하나 보입니다. {n}은…',
  o:[
   {l:'기존 물고기 무리 쪽으로 섞여 들어간다',chk:['g',45],ok:{t:'{n}은 낯선 무리 사이에서 며칠을 보냈습니다. 몸에 흰 점은 돋지 않았습니다.',c:'good'},no:()=>owb07(0)},
   {l:'앞유리 쪽, 사람 그림자가 오가는 곳에서 몸을 드러낸다',chk:['c',50],
    ok:{t:'주인이 {n}의 지느러미에 돋은 흰 점을 보고 검색했습니다. 그날 밤 수조 전체의 수온을 천천히 올리고 소금을 녹여 넣었습니다.',c:'good',fx:{h:-5},near:'qt'},no:()=>owb07(0)},
   {l:'수초 뒤 구석에 가만히 있는다',ok:()=>owb07(-.1)}
  ]}]);
function owb07(mod){
  const pred=isSp('oscar','channa','arowana');
  let p=(isSp('clownloach','neon','altum')?.8:pred?.3:.6)+mod;
  const pre=pred?'{n}은 들어가자마자 작은 합사어 한 마리를 삼켰습니다. ':'';
  if(R()>p)return {t:pre+'{n}은 수초 뒤에서 며칠을 보냈습니다. 다른 물고기들이 자갈에 몸을 문지르는 동안 {n}의 몸은 깨끗했습니다.',c:'sub',fx:isSp('betta')?{fin:.08}:{}};
  if(isKind('alchemist'))addFl('meds');
  const need=55-(isKind('learner','expert')?10:0);
  return Object.assign({t:pre+'{n}의 지느러미에 하얀 점이 돋기 시작했습니다.',c:'bad',sick:'ich'},owb_hold(need,'OWB-07-D',{fx:{h:-15,fin:isSp('betta')?.1:0},set:{slime_loss:1},c:'bad'}));
}
fevEnd({'OWB-07-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'격리 없이 바로 합사']],fact:'fIch',
  l:['백점충 유충이 {n}의 피부와 아가미 상피 아래로 파고듭니다. 상피가 기생충을 덮으며 하얀 점이 솟습니다.','하루 만에 점은 지느러미와 몸통 전체로 번집니다. 아가미 새엽에 박힌 점들이 숨 쉬는 면을 막습니다.','{n}은 바닥 자갈에 옆구리를 문지릅니다. 문지른 자리의 점막이 벗겨지고 그 자리에 물곰팡이가 앉습니다.','같은 수조의 물고기들도 같은 자갈에 몸을 문지르기 시작합니다.']}});

/* ================= 3. release — 방생 법회 신도 (OWB-08 is in fev_core.js) ================= */
/* [출처: 국내 민물고기 바다 방생 사례 보도 / 담수어 해수 노출 삼투압 쇼크 / 팔자복어 염분 내성 / 구피 염분 적응력]
   most species get no choice: osmotic shock cannot be dodged */
fev([{id:'OWB-09',stage:'home',tier:'fact',own:['release'],once:1,w:3,
  log:'법회는 바닷가 사찰 선착장에서 열렸습니다.',
  p:'봉지가 기울어지고 물이 바뀝니다. 입안에 짠맛이 가득 찹니다. 파도가 몸을 방파제 쪽으로 밀어붙입니다. {n}은…',
  o:[
   {l:'파도를 거슬러 넓은 물 쪽으로 헤엄친다',when:()=>isSp('fig8','@livebearer'),chk:['p',30],ok:()=>owb09(-10),no:()=>owb09(5)},
   {l:'테트라포드 틈의 물살이 약한 곳으로 들어간다',when:()=>isSp('fig8','@livebearer'),chk:['w',35],ok:()=>owb09(-5),no:()=>owb09(0)},
   {l:'바위 아래에 가만히 있는다',when:()=>isSp('fig8','@livebearer'),ok:()=>owb09(0)}
  ],
  auto:{t:'신도들이 염불을 외며 봉지를 거꾸로 듭니다. 바닷물에 닿은 {n}의 몸이 뻣뻣해집니다.',c:'bad',end:'OWB-09-D'}}]);
function owb09(mod){
  if(isSp('fig8'))return owb_hold(30+mod,'OWB-09-D',{end:'OWB-09-H'},1);
  return owb_hold(70+mod,'OWB-09-D',{end:'OWB-09-G'},1);
}
fevEnd({
 'OWB-09-D':{kind:'bad',cat:'방생',tier:'fact',fx:'f-float',pl:[[5,'바다에 방생']],fact:'fRelease',
  l:['바닷물은 {n}의 체액보다 훨씬 짭니다. 몸속의 물이 아가미 새엽과 피부를 통해 바다 쪽으로 빠져나갑니다.','아가미 상피세포가 쭈그러들고 점액이 끈적하게 엉깁니다.','{n}은 방파제 바위 쪽으로 헤엄칩니다. 헤엄칠수록 더 많은 바닷물이 아가미를 지나갑니다.','근육의 수분이 빠지며 몸이 뻣뻣하게 굽습니다. 파도가 {n}을 테트라포드 틈으로 밀어 넣습니다.']},
 'OWB-09-H':{kind:'happy',cat:'바다로 간 복어',tier:'story',fx:'f-rest',
  l:['"민물 복어"로 팔려 몇 달 동안 피부가 회색으로 바래던 {n}은 바다에 들어간 뒤 처음으로 몸의 하얀 반점이 옅어집니다.','신도들은 복어 한 마리가 힘차게 헤엄쳐 가는 것을 보고 기적이라며 합장합니다.','같은 봉지의 다른 물고기들은 밀물에 실려 선착장으로 돌아옵니다.']},
 'OWB-09-G':{kind:'happy',cat:'갯바위 웅덩이',tier:'story',fx:'f-rest',
  l:['{n}은 썰물 때마다 바닷물이 고이는 갯바위 웅덩이에 남았습니다. 몸은 짠물을 견디는 법을 조금 알고 있었습니다.','웅덩이 위로 갈매기 그림자가 하루에도 몇 번씩 지나갔습니다.','같은 봉지에서 나온 물고기 중 그 웅덩이까지 온 것은 {n}뿐이었습니다.']}
});

/* [출처: 고인 물 연못의 새벽 용존산소 최저 현상 / 사찰 연못 방생 과밀 사례] */
fev([{id:'OWB-10',stage:'home',tier:'fact',own:['release'],need:{season:'summer'},once:1,w:3,
  log:'법회는 사찰 안 연꽃 연못에서 열렸습니다. {n}은 연못에 쏟아졌습니다.',
  p:'연못에는 해마다 방생된 물고기들이 겹겹이 삽니다. 밤이 깊을수록 물이 무거워지고 녹색 물빛이 짙어집니다. 해 뜨기 직전, 수면 전체에 입들이 떠오릅니다. {n}은…',
  o:[
   {l:'수면의 입들 사이로 주둥이를 밀어 넣는다',chk:['p',50],ok:()=>owb10(-10),no:()=>owb10(0)},
   {l:'연못으로 물이 흘러드는 돌 틈 입구를 찾아간다',chk:['w',45],ok:()=>owb10(-99),no:()=>owb10(0)},
   {l:'바닥 진흙 위에 가만히 있는다',ok:()=>owb10(-5)}
  ]}]);
function owb10(mod){
  if(!owb_air()){let hurt=0;for(let i=0;i<3;i++)if(!owb_roll('g',60+mod)){if(R()<.12)return {end:'OWB-10-D'};hurt++}
    if(hurt)addLog(T(hurt>=2?'새벽마다 숨이 막혔던 아가미 새엽 끝이 검붉게 죽어 떨어져 나갔습니다. {n}의 숨은 그 뒤로도 짧았습니다.':'숨이 막혔던 새벽, {n}의 아가미 새엽 끝이 붉게 터졌다가 천천히 아물었습니다.'),'bad');
    if(hurt){S.health-=8*hurt;setFl('inj_gill',1)}}
  const tx=owb_air()?'새벽마다 다른 물고기들이 수면에 매달렸지만 {n}은 공기를 마시며 여름을 넘겼습니다.':'{n}은 여름 내내 새벽마다 수면에서 입을 벌리며 버텼습니다.';
  if(isSp('channa','gar'))return {t:tx+' 연못의 작은 물고기들이 하나둘 사라졌고, {n}은 점점 커졌습니다. 어느 장마철, 넘친 물을 따라 {n}은 수로로 나갔습니다.',c:'bad',fx:{fat:.2},run:()=>fRelease()};
  if(!owb_trop()&&R()<.3)return {t:tx+' 장마철 넘친 물을 따라 {n}은 연못 수로를 지나 하천으로 나갔습니다.',c:'bad',run:()=>fRelease()};
  return {t:tx,c:'sub',fx:{h:-10},run:()=>owb_rehome('neglect','법회가 끝나고 신도들은 돌아갔습니다. {n}은 사찰 연못에 남았습니다.',{tank:'pond',note:'사찰 연못에 방생'})};
}
fevEnd({'OWB-10-D':{kind:'bad',cat:'방생',tier:'fact',fx:'f-pond',pl:[[5,'사찰 연못에 방생']],fact:'fRelease',
  l:['밤새 연못의 녹조와 물고기들이 함께 산소를 씁니다. 해 뜨기 직전, 물속 산소가 하루 중 가장 낮아집니다.','{n}은 수면에 떠 있는 입들 사이로 주둥이를 밀어 넣습니다. 옆 물고기의 몸통에 밀려 다시 아래로 가라앉습니다.','아가미 뚜껑이 점점 크게, 점점 느리게 열립니다. {n}은 다시 올라가려고 꼬리를 칩니다.','해가 오르고 녹조가 다시 산소를 만들기 시작할 즈음, {n}은 연잎 아래에 배를 위로 하고 떠 있습니다.']}});

/* ================= 4. shared — 회사 탕비실 · 학교 교실 어항 ================= */
/* [출처: 과잉 급이와 수질 악화] */
fev([{id:'OWB-11',stage:'home',tier:'fact',own:['shared'],cd:25,w:()=>fl('owb11_note')>S.tick?1.5:3,
  p:'사람 그림자가 수조 앞을 지날 때마다 수면에 먹이가 떨어집니다. 오전에 세 번, 점심 뒤에 다섯 번입니다. 바닥에는 어제 먹이가 그대로 남아 있습니다. {n}은…',
  o:[
   {l:'그림자가 올 때마다 수면으로 올라가 입을 벌린다',chk:['g',55],
    ok:()=>{addFl('owb_h1');return {t:'{n}은 지나가는 사람마다 입을 벌렸습니다. 사람들은 {n}을 "탕비실 실세"라고 불렀습니다.',c:'good',fx:{fat:.15,i:.05,c:2},run:()=>q(null,null,()=>fevOut(owb11(0)))}},
    no:()=>Object.assign(isSp('oranda','ryukin')?{t:'{n}의 배가 부풀어 몸이 한쪽으로 기울었습니다.',c:'bad',sick:'swimb'}:isSp('oscar')?{t:'{n}의 몸이 눈에 띄게 둥글어졌습니다.',c:'bad',fx:{fat:.3},set:{weight:'fat'}}:{t:'{n}은 먹은 것을 다 소화하지 못했습니다.',c:'bad',fx:{h:-8}},{run:()=>q(null,null,()=>fevOut(owb11(0)))})},
   {l:'먹이가 떨어져도 몇 개만 먹고 돌아선다',chk:['w',35],ok:()=>owb11(-10),no:()=>owb11(0)},
   {l:'바닥 장식 뒤에 가만히 있는다',ok:()=>owb11(isSp('@bottom')?5:0)}
  ]}]);
function owb11(mod){
  const need=50+mod+(isSp('@livebearer')?10:0)+(season()==='summer'?5:0);
  return owb_hold(need,'OWB-11-D',()=>fl('owb_h1')>=3?{t:'누군가 수조 앞에 "먹이 주지 마세요" 공지를 붙였습니다. 다음 날부터 사람들은 먹이 대신 송별회에서 남은 새우를 넣었습니다.',c:'sub',fx:{h:-5,wq:-8},set:{owb11_note:S.tick+8}}
    :{t:'월요일 아침, 누군가 뿌연 물을 보고 물을 반쯤 갈았습니다. {n}의 지느러미 끝이 하얗게 짓물러 있었습니다.',c:'bad',fx:{h:-12,wq:-5,fin:.06},run:()=>owb_learn('owb11_fix','누군가 수조 앞에 "먹이는 당번만"이라고 적은 종이를 붙였습니다.')});
}
fevEnd({'OWB-11-D':{kind:'bad',cat:'수질 악화',tier:'fact',fx:'f-float',pl:[[2,'아무나 먹이를 줌']],fact:'fPlace',
  l:['금요일 오후, 퇴근하는 사람들이 한 꼬집씩 먹이를 넣고 갑니다. 다 먹지 못한 사료가 주말 동안 바닥에서 썩습니다.','물이 뿌옇게 흐려지고 수면에 기름막이 뜹니다. 늘어난 세균이 물속 산소를 씁니다.','{n}은 수면 바로 아래에서 아가미를 빠르게 여닫습니다. 지느러미 가장자리가 하얗게 짓무르기 시작합니다.','월요일 아침, 첫 출근자가 커피를 내려놓고 수면에 떠 있는 {n}을 봅니다.']}});

/* [출처: 저수온과 어류 면역 저하] — a tropical fish without a heater in a cold classroom gets no check */
fev([{id:'OWB-12',stage:'home',tier:'fact',own:['shared'],need:{season:['winter','summer']},cd:40,w:2,when:()=>!(season()==='winter'&&owb_trop()&&!fl('heater')),
  p:()=>season()==='winter'?'교실 불이 꺼진 지 며칠이 지났습니다. 창가 쪽 물이 차가워지고, 먹이는 더 이상 떨어지지 않습니다. 복도에서 발소리가 사라졌습니다. {n}은…'
    :'창문이 닫힌 교실에 오후 햇볕이 오래 머뭅니다. 물이 미지근해지다 뜨거워집니다. 수면이 조금씩 내려갑니다. {n}은…',
  o:[
   {l:()=>season()==='winter'?'히터 근처에 붙어 지낸다':'수조 가장 아래쪽에 붙어 지낸다',chk:['w',35],ok:()=>owb12(-10,1),no:()=>owb12(0)},
   {l:'다른 물고기들과 한데 모여 움직임을 줄인다',chk:()=>['g',isSp('@schooling')?35:45],ok:()=>owb12(-10),no:()=>owb12(0)},
   {l:'바닥 장식 뒤에 가만히 있는다',ok:()=>owb12(-5)}
  ]}]);
function owb12(mod,warm){
  const w=season()==='winter';
  if(isSp('pleco','cory','comet'))addFl('owb_h5');
  if(w&&owb_trop()&&!fl('heater'))return {end:'OWB-12-D'};
  let need;
  if(w)need=owb_trop()?(warm?0:70):40;
  else need=owb_cold()?60:45;
  if(!need)return {t:'히터 옆 따뜻한 물에서 {n}은 방학을 넘겼습니다. 배가 조금 꺼졌습니다.',c:'sub',fx:{h:-8}};
  need+=mod-(isSp('pleco','cory','comet')?10:0)+(isSp('neon','guppy')?10:0)+(!w&&fl('filter')==='hob'?10:0);
  const ok=()=>fl('owb_h5')>=2?{t:'개학 날, 혼자 남은 {n}에게 반 아이들이 이름표를 새로 붙여 주었습니다. 이름표는 지난 학기와 달랐습니다.',c:'good',fx:{h:-10},set:{weight:'thin'}}
    :{t:'개학 날, 반장이 뚜껑을 열고 먹이를 넣었습니다. {n}은 바닥에서 천천히 올라왔습니다.',c:'sub',fx:{h:-12},set:{weight:'thin'}};
  if(owb_roll('g',need))return ok();
  if(w&&owb_trop())return R()<owb_df()?{end:'OWB-12-D'}:owb_scar(ok(),'OWB-12-D');
  return {run:()=>{render();fEnd(S.f.place==='office'?'office':'classroom')}};
}
fevEnd({'OWB-12-D':{kind:'bad',cat:'방치',tier:'fact',fx:'f-ice',pl:[[2,'방학 동안 방치']],fact:'fTemp',
  l:['교실 기온이 밤마다 내려갑니다. 수온이 떨어지자 {n}의 대사가 느려지고 먹이를 찾지 않습니다.','면역 반응이 약해지고 피부 점액 분비가 줄어듭니다. {n}은 바닥 가까이에서 지느러미를 몸에 붙인 채 거의 움직이지 않습니다.','몸이 옆으로 기울고 다시 바로 서지 못합니다. 아가미 뚜껑이 점점 드물게 움직이다 멈춥니다.','개학 날, 반장이 뚜껑을 엽니다.']}});

/* [출처: 피레스로이드계 살충제의 어류 독성·작용 기전 / 방역 시 수조 덮개 권고] — once in the water, nothing dodges it */
fev([{id:'OWB-13',stage:'home',tier:'fact',own:['shared'],need:{lid:0},cd:60,when:()=>!fl('owb13_fix'),
  p:'주말, 마스크를 쓴 사람이 분무기를 들고 들어옵니다. 사람이 수조 앞에서 잠깐 멈춥니다. 공기에서 처음 맡는 냄새가 납니다. {n}은…',
  o:[
   {l:'멈춰 선 사람 쪽 유리로 다가가 몸을 보인다',chk:['c',45],ok:()=>owb13ok(),no:()=>owb13(0)},
   {l:'수면을 빠르게 휘저으며 맴돈다',chk:['p',35],ok:()=>owb13ok(),no:()=>owb13(0)},
   {l:'바닥 장식 뒤에 가만히 있는다',ok:()=>owb13(0)}
  ]}]);
const owb13ok=()=>({t:'방역 직원이 수조를 비닐로 덮고 여과기 플러그를 뽑은 뒤 분무를 시작했습니다.',c:'good',fx:{st:.05},
  run:()=>{if(R()<.3){setFl('owb13_fix',1);addLog(T('방역 업체는 다음 방문 공지에 "어항 덮개 요청"을 적었습니다.'),'good')}}});
function owb13(mod){
  const need=70+mod-(isSp('@big')||tankL()>=120?20:0)+(isSp('@scaleless','@small')?10:0);
  return Object.assign({t:'약제 방울이 수면에 내려앉았습니다.',c:'bad'},owb_hold(need,'OWB-13-D',{fx:{h:-22,st:.2},set:{toxin:'pyrethroid',inj_skin:1},c:'bad'}));
}
fevEnd({'OWB-13-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[3,'방역할 때 수조를 덮지 않음']],
  fact:'피레스로이드계 살충제는 물고기에게 독성이 강합니다. 방역할 때는 수조를 덮고 여과기를 꺼 두어야 합니다.',
  l:['수면에 내려앉은 약제가 물에 녹아 아가미로 들어옵니다.','피레스로이드는 신경 세포막의 나트륨 통로를 열린 채로 붙잡아 둡니다. 신경이 멈추지 않고 신호를 보냅니다.','{n}의 몸통 근육이 잘게 떨리고 지느러미가 따로따로 경련합니다. {n}은 수면과 바닥 사이를 비스듬히 오가며 유리에 부딪힙니다.','부딪힌 주둥이 피부가 벗겨집니다. 아가미 뚜껑의 움직임이 불규칙해지다 멈춥니다.']}});

/* [출처: 맨손 취급과 어류 점액층 손상·수생균(Saprolegnia) 감염 / 손 소독제·비누 잔여물의 어류 피부 영향 — 출처 못 찾으면 "알코올 냄새" 삭제] */
fev([{id:'OWB-14',stage:'home',tier:'fact',own:['shared'],need:{lid:0},notSp:['arowana','gar','motoro','koi','pleco'],cd:30,when:()=>!(fl('owb14_stop')>S.tick),
  log:'수조는 교실 뒤편으로 옮겨졌습니다. "관찰 학습"이라는 이름표가 붙었습니다.',
  p:'쉬는 시간마다 작은 손들이 물속으로 들어옵니다. 손에서 비누와 알코올 냄새가 납니다. 손가락이 천천히 다가오다 갑자기 오므라듭니다. {n}은…',
  o:[
   {l:'손가락 쪽으로 다가가 따라 헤엄친다',chk:()=>isSp('oscar','channa')?null:['g',50],
    ok:()=>isSp('oscar','channa')?{t:'{n}이 손가락을 덥석 물었습니다. 아이가 울었고, 다음 날 수조는 교무실로 옮겨졌습니다.',c:'bad',run:()=>owb_rehome('shared','{n}의 수조는 교무실 구석으로 옮겨졌습니다.',{place:'office',note:'아이를 물어 옮겨짐'})}
      :{t:'아이들이 {n}을 보러 쉬는 시간마다 몰려왔습니다. {n}의 옆구리 점막이 조금씩 얇아졌습니다.',c:'sub',fx:{h:-4,i:.06}},
    no:()=>owb14hurt()},
   {l:'손이 들어오면 빠르게 방향을 틀어 빠져나간다',chk:()=>owb_best(['p',35],['w',40]),ok:{t:'{n}은 손가락 사이로 빠져나갔습니다. 아이들은 "얘는 못 잡아"라며 다른 물고기를 쫓았습니다.',c:'good'},no:()=>owb14hurt()},
   {l:'돌 뒤에 가만히 있는다',ok:()=>owb_roll('w',30)?{t:'작은 손은 돌 틈까지 들어오지 못했습니다.',c:'sub'}:owb14hurt()}
  ]}]);
function owb14hurt(){
  if(isSp('cory'))return {t:'아이 손에 잡힌 {n}이 가슴지느러미 가시를 세웠습니다. 아이 손가락에서 피가 났고, 담임은 "물고기 만지지 말 것"이라고 칠판에 적었습니다.',c:'bad',fx:{fin:.12,h:-6},set:{owb14_stop:S.tick+12},
    run:()=>owb_learn('owb14_fix','담임은 수조 위에 뚜껑을 덮었습니다.',.3)};
  if(isSp('guppy','neon')&&R()<.3)return {t:'작은 손이 {n}의 몸통을 꽉 쥐었다가 놓았습니다. {n}은 몸을 비스듬히 기울인 채 헤엄쳤습니다.',c:'bad',fx:{h:-18},set:{inj_spine:1}};
  return R()<.1?{end:'OWB-14-D'}:{t:'손이 지나간 자리의 점막이 벗겨졌습니다. 옆구리 비늘 몇 장이 들떴습니다.',c:'bad',fx:{h:-10,st:.08},set:{slime_loss:1}};
}
fevEnd({'OWB-14-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-hand',pl:[[3,'아이들 손에 맡김']],
  fact:'물고기 피부를 덮은 점액은 세균과 곰팡이를 막는 벽입니다. 맨손으로 만질 때마다 그 벽이 벗겨집니다.',
  l:['아이들의 손이 하루에도 여러 번 물속으로 들어옵니다. 손가락이 {n}의 몸을 쥘 때마다 피부 점액이 손에 묻어 나갑니다.','점액이 벗겨진 옆구리에서 비늘 몇 장이 들뜹니다. 그 자리에 물곰팡이 포자가 내려앉아 실 같은 균사를 뻗습니다.','하얀 균사 덩어리가 옆구리에서 지느러미 쪽으로 번집니다.','{n}은 바닥 돌에 몸을 문지릅니다. 문지른 자리에서 균사와 함께 그 아래 살이 떨어져 나갑니다.']}});

/* ================= 5. decor — 풍수 금전운 어항 · 식당·카페 인테리어 어항 ================= */
/* [출처: 컬럼나리스병(Flavobacterium columnare) 병변 양상 / 신규 개체 격리 권고] */
fev([{id:'OWB-15',stage:'home',tier:'fact',own:['decor'],cd:40,w:3,
  log:()=>isSp('arowana')?'사장은 "아로와나는 짝이 있어야 돈이 붙는다"는 말을 들었습니다.':'수조의 한 마리가 배를 뒤집고 떠 있다 건져졌습니다. 풍수에서 숫자는 아홉이어야 했습니다.',
  p:()=>isSp('arowana')?'아침, 큰 봉지 하나가 들어옵니다. 봉지 속에 {n}과 꼭 닮은 은빛 몸이 접혀 있습니다. 봉지가 열리고 은빛 몸이 수조로 미끄러져 들어옵니다. {n}은…'
    :'아침, 새 물고기 한 마리가 봉지째 들어옵니다. 등에 작은 회색 얼룩이 있습니다. 새 물고기는 수면 근처에서 지느러미를 접고 떠 있습니다. {n}은…',
  o:[
   {l:'새로 온 물고기 곁으로 다가가 같이 헤엄친다',chk:['g',55],ok:{t:'{n}은 새 물고기와 나란히 헤엄쳤습니다. 며칠이 지나도 몸에 얼룩은 번지지 않았습니다.',c:'good'},no:()=>owb15(0)},
   {l:'새 물고기와 거리를 두고 수조 반대편에 머문다',chk:['w',35],ok:()=>owb15(-.2),no:()=>owb15(0)},
   {l:'바닥 장식 뒤에 가만히 있는다',ok:()=>owb15(-.1)}
  ]}]);
function owb15(mod){
  if(isSp('arowana'))return {t:'두 아로와나는 수조 끝과 끝을 차지하고 서로를 들이받았습니다. {n}의 지느러미 끝이 찢겼습니다.',c:'bad',fx:{fin:.15,h:-8,st:.15}};
  if(R()>.55+mod)return {t:'새 물고기의 얼룩은 다른 물고기에게 옮겨 갔지만, {n}의 몸에는 오지 않았습니다.',c:'sub'};
  const dz=isSp('koi')?'khv':'columnaris';
  return Object.assign({t:'{n}의 등지느러미 아래에 회색 얼룩이 생겼습니다.',c:'bad',sick:dz},owb_hold(60,'OWB-15-D',()=>{if(isSp('comet'))addFl('owb_h7');return {fx:{h:-15},c:'bad'}}));
}
fevEnd({'OWB-15-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'아픈 물고기를 교체만 함']],fact:'fWater',
  l:['새로 온 물고기의 등에 있던 회색 반점이 이틀 만에 다른 물고기들에게 옮겨 갑니다.','컬럼나리스균이 {n}의 등지느러미 아래 피부를 녹이며 안장 모양으로 번집니다. 피부가 벗겨진 자리에 근육이 드러납니다.','균은 아가미로도 들어가 새엽 끝을 갈색으로 썩힙니다. {n}은 수면 근처에서 지느러미를 몸에 붙인 채 천천히 떠 있습니다.','다음 날 아침 사장은 같은 색 물고기 한 마리를 사 옵니다.']}});

/* [출처: 에탄올의 어류 마취 작용·독성 농도] */
fev([{id:'OWB-16',stage:'home',tier:'fact',own:['decor'],need:{lid:0},cd:30,w:()=>1.5+(fl('owb16_fan')?1.5:0),
  log:'{n}의 수조는 식당 홀 한가운데에 있었습니다.',
  p:'밤 10시, 수조 바로 앞 테이블에서 웃음소리가 커집니다. 사람 손이 수면 위로 내려와 무언가를 흔듭니다. 손에서 시큼하고 독한 냄새가 납니다. {n}은…',
  o:[
   {l:'손 아래 수면으로 올라가 입을 벌린다',ok:()=>{if(fst().c>=70)setFl('owb16_fan',1);return owb16(15)}},
   {l:'수조 반대편 끝으로 헤엄쳐 간다',chk:['w',40],ok:()=>owb16(-10),no:()=>owb16(0)},
   {l:'바닥에 가만히 있는다',ok:()=>owb16(0)}
  ]}]);
function owb16(mod){
  const L=tankL(),need=45+mod-(L>=200?20:0)+(L<30?20:0)+(isSp('oranda','ryukin')?20:0);
  return Object.assign({t:'"얘도 한잔해야지." 소주잔이 수면 위에서 기울어졌습니다.',c:'bad'},owb_hold(need,'OWB-16-D',{c:'bad',fx:{h:-14,st:.15},set:{toxin:'ethanol',inj_gill:1},sick:isSp('oranda','ryukin')?'swimb':null,
    run:()=>owb_learn('owb16_fix','사장은 수조에 뚜껑을 덮고 "술·음식 넣지 마세요" 팻말을 세웠습니다.')}));
}
fevEnd({'OWB-16-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[3,'손님이 수조에 술을 부음']],fact:'fLaw',
  l:['소주가 수면에서 물과 섞이며 아래로 퍼집니다. 에탄올이 아가미 새엽을 지나 혈액으로 들어옵니다.','{n}의 헤엄이 느려지고 몸이 한쪽으로 기웁니다. {n}은 평형을 잡으려고 가슴지느러미를 빠르게 젓지만 몸은 계속 돌아갑니다.','아가미 새엽이 붉게 부어오릅니다. 바닥에 닿은 {n}은 입을 벌린 채 아가미 뚜껑만 느리게 움직입니다.','테이블에서 "얘도 취했다"는 말과 함께 웃음이 터집니다.']}});

/* [출처: 광주기 교란·만성 스트레스(코르티솔)와 어류 면역 저하] */
fev([{id:'OWB-17',stage:'home',tier:'fact',own:['decor'],cd:20,when:()=>!fl('owb17_fix'),w:2,
  log:()=>fl('light24')?'밤 11시가 넘었습니다. 수조 조명은 그대로 켜져 있습니다.':'사장은 "손님이 볼 수 있게" 수조 조명을 밤새 켜 두기로 했습니다.',
  p:'조명이 밤에도 꺼지지 않습니다. 유리 앞으로 계속 얼굴이 다가오고, 손가락이 유리를 톡톡 두드립니다. 두드릴 때마다 물이 미세하게 떨립니다. {n}은…',
  o:[
   {l:'유리 앞으로 나와 얼굴들을 마주 본다',chk:['c',60],
    ok:{t:'손님들이 {n}의 사진을 찍어 올렸습니다. 사장은 그 주부터 물을 더 자주 갈았습니다.',c:'good',fx:{i:.15,wq:10,c:2},run:()=>q(null,null,()=>fevOut(owb17(-10)))},
    no:()=>Object.assign({},owb17(5),{t:'얼굴이 다가올 때마다 {n}은 몸을 움찔했습니다.'})},
   {l:'수초와 유목이 그늘을 만드는 곳으로 들어간다',chk:['w',45],ok:()=>owb17(-10),no:()=>owb17(0)},
   {l:'바닥 장식 뒤에 가만히 있는다',ok:()=>owb_roll('g',45+(fl('hides')?0:15)+(isSp('ghost')?15:0))?owb17(-5):owb17(5)}
  ]}]);
function owb17(mod){
  setFl('light24',1);addFl('owb17_n');
  const n=fl('owb17_n'),need=40+5*(n-1)+mod+(isSp('ghost')?15:0);
  const side=isSp('clownloach')&&R()<.4?{t:'옆으로 누워 쉬는 {n}을 보고 손님이 "죽었어요"라고 했습니다. 사장이 뜰채로 {n}을 건졌다 다시 넣었습니다.',c:'bad',fx:{h:-8,st:.1}}
    :isSp('arowana')&&!fl('lid')&&R()<.35?{t:'유리 두드리는 소리에 {n}이 수면 위로 튀어 올랐습니다.',c:'bad',run:()=>{if(!S.waiting)q(null,null,()=>fCr('jump'))}}
    :isSp('altum')?{t:'놀란 {n}이 유리에 몸을 부딪쳤습니다.',c:'bad',fx:{h:-6},set:{inj_skin:1}}:null;
  const ok={t:'{n}은 또 한 주를 불빛 아래에서 보냈습니다. 몸 색이 조금 바랬습니다.',c:'sub',fx:{st:.08,h:-4},run:()=>owb_learn('owb17_fix','사장은 조명에 타이머를 달았습니다. 밤 11시면 수조가 어두워졌습니다.')};
  if(!owb_roll('g',need)){if(R()<owb_df())return {end:'OWB-17-D'};const sc=owb_scar(ok,'OWB-17-D');return side?Object.assign({},side,{fx:Object.assign({},side.fx,{h:((side.fx||{}).h||0)-10,fin:.12}),run:()=>{if(side.run)side.run();sc.run()}}):sc}
  return side?Object.assign({},side,{run:()=>{if(side.run)side.run();ok.run()}}):ok;
}
fevEnd({'OWB-17-D':{kind:'bad',cat:'스트레스',tier:'fact',fx:'f-bottom',pl:[[2,'조명을 밤새 켜 둠']],fact:'fWater',
  l:['{n}은 몇 주째 어둠 없이 지냅니다. 스트레스 호르몬이 높게 유지되며 면역 반응이 약해집니다.','유리 두드림에 놀라 장식 돌에 부딪힌 꼬리지느러미 끝이 갈라집니다. 갈라진 기조 사이 막부터 하얗게 짓무르며 지느러미가 짧아집니다.','썩음은 꼬리자루까지 내려와 근육을 드러냅니다. {n}은 짧아진 꼬리로 은신처를 찾아 수조 안을 맴돕니다.','카페 계정에는 매일 같은 각도의 어항 사진이 올라옵니다.']}});

/* [출처: "꽃병 베타"(베타+스파티필룸) 유행과 '뿌리를 먹고 산다'는 오해 / 베타 필요 수온] */
fev([{id:'OWB-18',stage:'home',tier:'fact',own:['decor','gift'],sp:['betta','wildbetta','guppy'],need:{heater:0},once:1,w:3,when:()=>tankL()<=20,
  log:'{n}은 흰 꽃이 꽂힌 유리 꽃병으로 옮겨졌습니다. "뿌리를 먹고 사는 물고기"라는 설명이 붙었습니다.',
  p:'유리 꽃병 위쪽은 하얀 꽃과 뿌리가 차지하고 있습니다. 뿌리 사이로 좁은 틈 몇 개만 수면에 닿습니다. 며칠째 아무것도 떨어지지 않습니다. {n}은…',
  o:[
   {l:'뿌리 틈을 비집고 올라가 공기를 마신다',chk:['g',45],ok:()=>owb18(0),
    no:()=>Object.assign({},owb18(0),{t:'뿌리 사이를 비집다 지느러미가 걸려 찢겼습니다.',fx:{fin:isSp('betta')?.15:.08}})},
   {l:'뿌리 끝을 쪼아 본다',chk:['w',40],ok:()=>Object.assign({},owb18(-10),{t:'{n}은 뿌리 사이에서 작은 벌레 유충 몇 마리를 찾아 먹었습니다.'}),no:()=>owb18(0)},
   {l:'꽃병 바닥에 가만히 있는다',ok:()=>owb18(5)}
  ]}]);
function owb18(mod){
  setFl('vase',1);
  const need=50+mod+(isSp('guppy')?10:0)+(season()==='winter'?10:0);
  return owb_hold(need,'OWB-18-D',{c:'bad',fx:{h:-15},set:{weight:'thin'},sick:season()==='winter'&&R()<.5?'finrot':null,
    run:()=>owb_learn('owb18_fix','"베타는 뿌리를 안 먹어요." 손님이 남긴 댓글을 본 사장이 {n}을 작은 수조로 옮기고 먹이를 사 왔습니다.',isKind('gift')?.1:.15)},.12);
}
fevEnd({'OWB-18-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',pl:[[2,'꽃병에 넣고 먹이를 주지 않음']],fact:'fBetta',
  l:['꽃병의 물은 한 컵 남짓입니다. 가게 사람들은 베타가 식물 뿌리를 먹고 산다고 들었습니다. 아무도 먹이를 주지 않습니다.','{n}은 뿌리 틈을 비집고 올라가 공기를 마십니다. 마실 때마다 지느러미가 뿌리에 걸려 찢어집니다.','몸통 근육이 줄며 등뼈 선이 드러나고 배가 안쪽으로 꺼집니다.','꽃이 시들어 꽃병째 버려지는 날, {n}은 뿌리 사이에 걸린 채 움직이지 않습니다.']}});

/* ================= 6. unbox — 생물 언박싱 유튜버 ================= */
/* [출처: 장거리 운송 봉지의 CO2 축적·pH 저하·암모니아 형태 변화와 개봉 후 독성 상승] — the pH rise after opening cannot be dodged; only how fast the owner moves the fish */
fev([{id:'OWB-19',stage:'home',tier:'fact',own:['unbox'],once:1,w:6,
  log:'{n}은 택배 상자에 담겨 사흘 만에 도착했습니다. 주인은 카메라를 켜고 상자를 열었습니다.',
  p:'상자 테이프가 뜯기고 강한 조명이 봉지 위로 쏟아집니다. 사흘 동안 어두웠던 봉지 속 물이 탁하고 비릿합니다. 봉지 입구 고무줄이 풀리는 소리가 납니다. {n}은…',
  o:[
   {l:'봉지 벽에 몸을 붙이고 렌즈 쪽을 바라본다',chk:['c',50],ok:{t:'실시간 채팅에 "물맞춤 하지 말고 바로 건져서 옮기세요"라는 댓글이 올라왔습니다. 주인은 봉지 물을 버리고 {n}을 바로 수조로 옮겼습니다.',c:'good',fx:{h:-5}},no:()=>owb19()},
   {l:'봉지 안에서 몸을 크게 뒤척인다',chk:['p',40],ok:{t:'"엄청 활발하네요!" 주인은 {n}을 바로 꺼내 수조에 넣었습니다.',c:'good',fx:{h:-5}},no:()=>owb19()},
   {l:'봉지 바닥에 가만히 있는다',ok:()=>owb19()}
  ]}]);
function owb19(){
  const need=62+(isSp('cory')&&R()<.5?15:0)+(isSp('pleco','cory','bichir')&&R()<.5?10:0)+(isSp('@puffer')?5:0);
  return Object.assign({t:'"물맞춤은 20분 해 줄게요." 주인은 봉지를 수면에 띄웠습니다.',c:'sub'},owb_hold(need,'OWB-19-D',{c:'bad',fx:{h:-15,st:.15},set:{inj_gill:1}}));
}
fevEnd({'OWB-19-D':{kind:'bad',cat:'운송',tier:'fact',fx:'f-bag',pl:[[2,'장거리 택배 개체를 오래 물맞춤']],fact:'fChain',
  l:['봉지가 열리자 사흘 동안 물에 쌓였던 이산화탄소가 빠져나갑니다. pH가 오르면서 봉지 속 암모늄이 독성이 강한 암모니아로 바뀝니다.','암모니아가 아가미 새엽 상피세포를 손상시키고 새엽이 붓습니다. {n}은 봉지 바닥에서 몸을 뒤집으며 입을 크게 벌립니다.','주인은 물맞춤을 위해 봉지를 수면에 20분 더 띄워 둡니다. {n}은 봉지 벽을 따라 돌다 옆으로 눕습니다.','영상 제목에는 "도착 즉시 사망 ㄷㄷ"이 붙습니다.'],
  after:'주인은 다음 언박싱 영상 첫머리에 {n}의 사진을 잠깐 넣었습니다.'}});

/* [출처: 복어가 물 밖에서 공기로 팽창할 때의 위험 / 맨손 취급과 점액층 손상] */
fev([{id:'OWB-20',stage:'home',tier:'fact',own:['unbox','content'],cd:40,when:()=>S.interest>=.4,w:()=>isKind('unbox')?3:1,
  p:'물이 갑자기 사라지고 따뜻하고 마른 손바닥이 몸을 받칩니다. 강한 빛과 카메라 렌즈가 바로 앞에 있습니다. 손가락이 배를 꾹 누릅니다. {n}은…',
  o:[
   {l:'손 안에서 몸을 크게 튕긴다',chk:['p',50],ok:()=>owb20({t:'{n}이 손에서 미끄러져 물로 떨어졌습니다. 썸네일은 흔들려 쓸 수 없었습니다.',c:'good',fx:{h:-3}}),
    no:()=>owb20({t:'{n}이 손에서 튀어 나가 바닥에 떨어졌습니다. 주인이 집어 수조에 넣었을 때 옆구리 비늘 몇 장이 바닥에 남았습니다.',c:'bad',fx:{h:-15,st:.12},set:{inj_skin:1}})},
   {l:'몸을 부풀린다',when:()=>isSp('@puffer'),ok:()=>R()<.12?{end:'OWB-20-P'}:{t:'동그랗게 부푼 {n}이 썸네일에 담겼습니다. 물에 돌아온 {n}은 한참 동안 공기를 뱉어 냈습니다. 그 영상의 조회수가 가장 높았습니다.',c:'bad',fx:{h:-10,i:.1}}},
   {l:'손 안에서 가만히 있는다',ok:()=>owb20(owb_roll('g',45-(isSp('betta','wildbetta','channa','bichir','pleco')?15:0)+(isSp('neon','guppy','altum')?15:0))
      ?{t:'30초 뒤 {n}은 물로 돌아왔습니다. 손이 닿은 자리의 점막이 얇게 벗겨져 있었습니다.',c:'sub',fx:{h:-6},set:{slime_loss:1}}
        :R()<.12?{end:'OWB-20-D'}:{t:'물로 돌아온 {n}의 몸 한쪽이 뿌옇게 흐려져 있었습니다. 손이 닿은 자리였습니다.',c:'bad',fx:{h:-14},set:{slime_loss:1}})}
  ]}]);
function owb20(o){
  if(isSp('motoro'))return {t:'손으로 {n}을 받친 순간, 꼬리의 독침이 주인 손바닥을 찔렀습니다. 주인은 병원에 갔고, 영상은 조회수가 터졌습니다. 일주일 뒤 주인은 {n}의 독침을 잘라 냈습니다.',c:'bad',fx:{h:-18,st:.2},set:{barb_cut:1}};
  return o;
}
fevEnd({
 'OWB-20-P':{kind:'bad',cat:'학대',tier:'fact',fx:'f-float',pl:[[3,'썸네일 촬영으로 물 밖에 꺼냄']],
  fact:'복어가 물 밖에서 몸을 부풀리면 물 대신 공기를 삼키게 되고, 그 공기를 다시 빼내지 못하는 경우가 있습니다.',
  l:['손바닥 위에서 {n}은 물 대신 공기를 삼켜 몸을 부풀립니다. 위가 공기로 늘어나며 배 피부가 팽팽해집니다.','물속으로 돌아온 {n}은 공기를 내보내려고 입을 여닫습니다. 공기가 빠지지 않아 {n}은 배를 위로 한 채 수면에 뜹니다.','수면 밖으로 나온 배 피부가 마르며 갈라집니다. {n}은 꼬리를 저어 아래로 내려가려 하지만 다시 떠오릅니다.','썸네일 속 {n}은 동그랗고, 눈이 반짝입니다.']},
 'OWB-20-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-hand',pl:[[3,'썸네일 촬영으로 물 밖에 꺼냄']],
  fact:'물고기 피부를 덮은 점액은 세균과 곰팡이를 막는 벽입니다. 맨손으로 만질 때마다 그 벽이 벗겨집니다.',
  l:['손바닥이 {n}의 몸을 쥐는 동안 피부 점액이 손에 묻어 나갑니다.','점액이 벗겨진 옆구리에서 비늘 몇 장이 들뜹니다. 그 자리에 물곰팡이 포자가 내려앉아 실 같은 균사를 뻗습니다.','하얀 균사 덩어리가 옆구리에서 지느러미 쪽으로 번집니다. {n}은 바닥 돌에 몸을 문지릅니다. 문지른 자리에서 균사와 함께 그 아래 살이 떨어져 나갑니다.','영상은 "물고기 손바닥 위에 올려 봄"으로 올라갑니다.']}
});

/* [출처: 코리도라스·메기류 가시가 포식어 목에 걸린 사례] */
fev([{id:'OWB-21',stage:'home',tier:'fact',own:['unbox'],sp:['oscar','arowana','channa','gar','bichir','fig8','@small','cory','guppy','comet'],cd:60,w:2,
  p:()=>isSp('@predator')?'수면에서 작은 물고기들이 한꺼번에 쏟아져 내립니다. 그중 몇 마리는 가시를 세운 채 바닥으로 내려갑니다. 렌즈 너머로 사람 숨소리가 들립니다. {n}은…'
    :'넓은 수조로 쏟아지자 아래쪽에서 큰 그림자가 천천히 몸을 돌립니다. 물이 한 번 크게 흔들립니다. 카메라 빨간 불이 깜박입니다. {n}은…',
  o:[
   {l:'같이 쏟아진 무리 한가운데로 파고든다',when:()=>!isSp('@predator'),chk:['w',35],ok:()=>owb21prey(1),no:()=>owb21prey(0)},
   {l:'바닥 모래나 유리 모서리에 몸을 붙인다',when:()=>!isSp('@predator'),chk:()=>['w',isSp('cory')?30:40],ok:()=>owb21prey(1),no:()=>owb21prey(0)},
   {l:'그 자리에 멈춰 가만히 있는다',when:()=>!isSp('@predator'),ok:()=>owb21prey(R()<.5?1:0)},
   {l:'가장 가까운 것을 바로 덮친다',when:()=>isSp('@predator'),ok:()=>owb21pred()},
   {l:'한동안 지켜보다 약한 것을 고른다',when:()=>isSp('@predator'),chk:['w',50],ok:{t:'{n}은 가시가 없는 작은 물고기만 골라 삼켰습니다. 영상은 "의외로 신중한 포식자"라는 제목으로 올라갔습니다.',c:'sub',fx:{fat:.1}},no:()=>owb21pred()},
   {l:'은신처에 가만히 있는다',when:()=>isSp('@predator'),ok:{t:'{n}은 은신처에서 나오지 않았습니다. 주인은 "다음엔 굶겨서 찍어야겠다"고 말했습니다.',c:'sub',fx:{i:-.05}}}
  ]}]);
function owb21prey(safe){
  if(safe)return {t:'큰 입은 다른 물고기를 물었습니다. {n}은 무리 사이에서 살아남았습니다. 영상이 끝나고 {n}은 다시 봉지에 담겼습니다.',c:'bad',fx:{st:.15,h:-4}};
  if(R()<.15)return {end:'OWB-21-E'};
  return {t:'큰 턱이 {n}의 꼬리 쪽을 물었다 놓았습니다. 꼬리지느러미 절반이 떨어져 나가고, 꼬리자루 비늘 아래로 이빨 자국이 줄지어 패었습니다. 영상이 끝나고 {n}은 다시 봉지에 담겼습니다.',c:'bad',fx:{h:-18,fin:.3,st:.2},set:{inj_fin:1,inj_skin:1}};
}
function owb21pred(){
  if(isSp('fig8'))return {t:'{n}은 작은 물고기들의 지느러미만 뜯었습니다. 댓글 반응은 시들했고, 주인은 다음 실험을 접었습니다.',c:'sub'};
  if(R()<.35)return Object.assign({t:'{n}이 덮친 것은 코리도라스였습니다. 목구멍에 무언가 걸렸습니다.',c:'bad'},owb_hold(55,'OWB-21-D',{t:'{n}은 머리를 크게 흔들어 코리도라스를 뱉어 냈습니다. 목구멍 점막이 찢겨 며칠 동안 먹이를 먹지 못했습니다.',c:'bad',fx:{h:-18},set:{inj_gill:1}}));
  return {t:isSp('gar','arowana')?'{n}은 한 번에 삼켰습니다. 영상은 짧았습니다.':'{n}은 가장 가까운 물고기를 삼켰습니다.',c:'sub',fx:{fat:.1}};
}
fevEnd({
 'OWB-21-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-bottom',pl:[[3,'영상용으로 먹이 실험']],fact:'fLive',
  l:['{n}은 코리도라스를 머리부터 삼키려 합니다. 겁먹은 코리도라스가 가슴지느러미 가시를 세우고 고정합니다.','가시가 {n}의 목구멍 점막을 뚫고 아가미활 사이에 걸립니다. {n}은 삼키지도 뱉지도 못한 채 머리를 흔듭니다.','흔들 때마다 가시가 더 깊이 박히고, 아가미 사이로 피가 실처럼 풀립니다. 입이 닫히지 않아 아가미로 물이 제대로 흐르지 않습니다.','영상은 "충격 결말"이라는 제목으로 올라갑니다.']},
 'OWB-21-E':{kind:'bad',cat:'먹이',tier:'likely',fx:'f-eaten',pl:[[0,'영상용으로 포식어 수조에 넣음']],fact:'fLive',
  l:['{n}은 지느러미를 최대한 빠르게 저어 수조 구석으로 달아납니다. 큰 턱이 뒤에서 닫힙니다.','이빨이 가장 얇은 배 쪽을 뚫고 들어가 복강이 열립니다. {n}은 계속 헤엄칩니다. 몸을 비틀 때마다 찢긴 옆구리가 더 벌어지고, 그 사이로 하얀 늑골이 드러납니다.','두 번째로 물렸을 때 척추가 꺾입니다. 척수가 끊긴 뒤에도 꼬리지느러미는 한동안 반사적으로 떨립니다.','카메라의 빨간 불은 끝까지 켜져 있습니다.']}
});

/* [출처: 국내 택배사 생물 배송 규정(생물 취급 금지 여부) — 금지라면 "고속버스 화물"로 교체] */
fev([{id:'OWB-22',stage:'home',tier:'fact',own:['unbox'],once:1,w:1.5,
  log:()=>'촬영이 끝난 {n}은 "구독자 이벤트 당첨 선물"이 되었습니다.'+(isSp('@big')?' 상자에 들어가지 않아 고속버스 화물로 부쳐졌습니다.':''),
  p:'다시 봉지에 담기고, 상자 안이 어두워집니다. 상자가 흔들리다 차가운 바닥에 놓입니다. 상자 안 작은 주머니의 온기가 밤사이 식어 갑니다. {n}은…',
  o:[
   {l:'봉지 안을 계속 돌며 몸을 움직인다',ok:()=>owb22(10)},
   {l:'봉지 모서리에 몸을 기대고 지느러미를 접는다',chk:['g',40],ok:()=>owb22(-10),no:()=>owb22(0)},
   {l:'봉지 바닥에 가만히 있는다',ok:()=>owb22(0)}
  ]}]);
function owb22(mod){
  return owb_move('bored',{ride:'parcel',rideMod:mod,rideEnd:'OWB-22-D',rideDf:.1,drop:['river','flush','same'],text:'상자는 당첨자의 집에 도착했습니다. {n}의 새 주인이었습니다.'});
}
fevEnd({'OWB-22-D':{kind:'bad',cat:'택배',tier:'fact',fx:'f-box',pl:[[0,'경품으로 택배 발송']],fact:'fChain',
  l:['택배 상자는 물류 터미널의 차가운 바닥에서 하룻밤을 보냅니다. 핫팩은 새벽에 식습니다.','봉지 속 수온이 내려가며 {n}의 움직임이 느려집니다. {n}은 봉지 모서리에 몸을 기대고 지느러미를 접습니다.','아가미 뚜껑이 점점 느리게 움직입니다.','수신인이 상자를 연 것은 사흘 뒤입니다.']}});

/* ================= 7. staff — 수족관 직원 본인 ================= */
/* [출처: 벨벳병(Oodinium/Piscinoodinium) 부착 방식·증상 / 신규 개체 격리 권고] */
fev([{id:'OWB-23',stage:'home',tier:'fact',own:['staff'],need:{qt:0},cd:50,w:3,
  p:'밤 11시, 주인이 작은 봉지를 들고 들어옵니다. 봉지 속 물고기들은 지느러미를 접고 몸에 노란 가루 같은 점이 있습니다. 봉지가 격리 수조가 아닌 큰 수조 위에 놓입니다. {n}은…',
  o:[
   {l:'새로 온 물고기들 쪽으로 다가간다',chk:['g',55],ok:{t:'{n}은 새로 온 물고기들 사이를 헤엄쳤습니다. 몸은 깨끗하게 남았습니다.',c:'good'},no:()=>owb23(0)},
   {l:'앞유리로 나와 주인 쪽을 오래 바라본다',chk:['c',45],ok:{t:'봉지를 붓으려던 주인이 {n}과 눈이 마주치자 멈칫했습니다. 주인은 한숨을 쉬고 창고에서 격리 통을 꺼냈습니다.',c:'good',set:{qt:1}},no:()=>owb23(0)},
   {l:'수초 뒤에 가만히 있는다',ok:()=>owb23(-.1)}
  ]}]);
function owb23(mod){
  if(R()>(isSp('@labyrinth')?.65:.5)+mod)return {t:'새로 온 물고기들은 일주일 안에 모두 죽었습니다. {n}의 몸에는 가루가 앉지 않았습니다.',c:'sub'};
  const late=R()<.5;
  const need=60+(isSp('@small','@schooling')?10:0)+(isSp('@scaleless')?5:0)-(isSp('@big')?10:0)+(late?10:0);
  return Object.assign({t:'{n}의 몸이 노르스름한 가루를 뒤집어쓴 것처럼 흐려졌습니다.'+(late?' 주인은 병명을 바로 알았지만, 약을 가져오는 걸 하루 미뤘습니다.':' 주인은 다음 날 가게에서 약을 가져왔습니다.'),c:'bad',sick:'velvet'},
    owb_hold(need,'OWB-23-D',{c:'bad',fx:{h:-14},set:{slime_loss:1,inj_gill:1},run:()=>owb_learn('qt_staff','주인은 집에도 격리 수조를 하나 들여 상설로 돌렸습니다.')}));
}
fevEnd({'OWB-23-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'아픈 물고기를 격리 없이 들임']],fact:'fWater',
  l:['벨벳병 원충이 {n}의 피부와 아가미 새엽에 달라붙어 뿌리 모양 돌기를 상피세포 안으로 박습니다.','몸 표면이 노르스름한 가루를 뒤집어쓴 것처럼 흐려집니다. 아가미 새엽 상피가 부어 서로 붙습니다.','{n}은 지느러미를 몸에 붙인 채 여과기 출수구 앞에 머뭅니다. 피부가 군데군데 얇게 벗겨져 떨어집니다.','주인은 병명을 바로 압니다. 약은 가게에 두고 왔습니다.'],
  after:'다음 날 주인은 가게에서 같은 종을 손님에게 팔며 "튼튼한 애예요"라고 말했습니다.'}});

/* [출처: 오래된 수조 증후군(Old Tank Syndrome)과 대량 환수 시 pH 상승·암모니아 독성] */
fev([{id:'OWB-24',stage:'home',tier:'fact',own:['staff'],cd:50,when:()=>!fl('owb24_fix'),w:2,
  p:'몇 달째 물이 갈리지 않습니다. 물빛이 옅은 노란색으로 변하고 유리에 갈색 막이 낍니다. 일요일 아침, 주인이 호스와 양동이를 잔뜩 들고 옵니다. {n}은…',
  o:[
   {l:'양동이 쪽, 새 물이 들어오는 곳으로 다가간다',chk:()=>['g',60+owb24m()],ok:()=>owb24x({t:'새 물이 쏟아지는 곳에서 {n}은 아가미를 크게 벌리며 버텼습니다.',c:'bad',fx:{h:-15},set:{inj_gill:1}}),no:()=>owb24x(owb_hold(70+owb24m(),'OWB-24-D',{t:'새 물이 쏟아지는 곳에서 {n}은 아가미를 크게 벌리며 버텼습니다.',c:'bad',fx:{h:-15},set:{inj_gill:1}}))},
   {l:'새 물이 들어오는 반대편 구석으로 간다',chk:['w',40],ok:()=>owb24x(owb_hold(40+owb24m(),'OWB-24-D')),no:()=>owb24x(owb_hold(55+owb24m(),'OWB-24-D'))},
   {l:'바닥에 가만히 있는다',ok:()=>owb24x(owb_hold(55+owb24m(),'OWB-24-D'))}
  ]}]);
const owb24m=()=>(isSp('altum','neon','apisto')?10:0)+(isSp('@livebearer','@gold')?5:0);
function owb24x(o){
  if(R()<.5)return {t:'호스를 수조에 넣던 주인이 손을 멈췄습니다. "아, 이거 오래 묵은 물이지." 주인은 그날부터 며칠에 걸쳐 조금씩 물을 갈았습니다.',c:'good',fx:{wq:20},run:()=>owb_learn('owb24_fix','주인은 쉬는 날 아침마다 집 수조 환수 알림을 맞춰 두었습니다.')};
  return o;
}
fevEnd({'OWB-24-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',pl:[[2,'몇 달 물을 안 갈다 한 번에 갈음']],fact:'fWater',
  l:['석 달 동안 물속 완충력이 바닥나고 pH가 내려가 있었습니다. 새 물이 한꺼번에 들어오자 pH가 몇 분 사이에 올라갑니다.','물에 쌓여 있던 암모늄이 독성이 강한 암모니아로 바뀝니다. {n}의 아가미 새엽 상피가 부어오르고 점액이 두껍게 덮입니다.','{n}은 수조 구석을 따라 비스듬히 헤엄치다 유리에 몸을 부딪힙니다. 아가미 뚜껑이 크게 열린 채 멈춥니다.','주인은 그 전날에도 가게에서 수조 마흔 개의 물을 갈았습니다.']}});

/* [출처: 정전 시 수조 용존산소 감소·여과 세균 손실, 재가동 시 주의사항] */
fev([{id:'OWB-25',stage:'home',tier:'fact',own:['staff','breeder'],need:{season:'winter'},cd:60,when:()=>!fl('owb25_fix'),w:1.5,
  log:'주인 방의 멀티탭 하나에 수조 여섯 개의 히터와 여과기가 꽂혀 있었습니다.',
  p:'새벽, 딸깍 소리와 함께 방 안의 모든 소리가 한꺼번에 멎습니다. 수면을 흔들던 물살이 멈추고 수면이 거울처럼 잔잔해집니다. 몇 시간이 지나자 물이 조금씩 차가워집니다. {n}은…',
  o:[
   {l:'수면으로 올라가 입을 대고 버틴다',chk:()=>owb_air()?null:['g',50],ok:()=>owb25(owb_air()?-30:-10),no:()=>owb25(0)},
   {l:'몸을 바닥에 붙이고 움직임을 줄인다',chk:['g',40],ok:()=>owb25(-10),no:()=>owb25(0)},
   {l:'은신처에 가만히 있는다',ok:()=>owb25(0)}
  ]}]);
function owb25(mod){
  const need=50+mod+(owb_trop()?10:0)+(isSp('@big')?10:0)-(owb_air()?20:0)-(isSp('@small')?5:0);
  return owb_hold(need,'OWB-25-D',()=>R()<.5?{t:'아침에 차단기를 올린 주인은 여과기를 열어 썩은 물을 빼고 헹군 뒤 다시 켰습니다.',c:'sub',fx:{h:-8},run:()=>owb_learn('owb25_fix','주인은 회로를 나누고 에어펌프에 무정전 전원 장치를 달았습니다.')}
    :{t:'아침에 차단기를 올리자 멈춰 있던 여과기에서 검은 물이 쏟아졌습니다. {n}은 뿌연 물속에서 아가미를 크게 벌렸습니다.',c:'bad',fx:{h:-12,wq:-20},set:{cycled:0}});
}
fevEnd({'OWB-25-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-bottom',pl:[[2,'멀티탭 하나에 수조 여러 개']],fact:'fO2',
  l:['여과기가 멈추자 수면이 움직이지 않습니다. 물에 새로 녹아드는 산소가 줄어듭니다.','몸이 큰 물고기일수록 산소를 많이 씁니다. {n}은 수면에 입을 대고 아가미를 크게 벌립니다.','여과재 속 세균도 산소를 잃고 죽어 갑니다. 수온이 밤새 내려가며 {n}의 지느러미 움직임이 느려집니다.','아침 9시, 차단기를 올린 주인은 바닥에 가라앉은 {n}과 다시 돌기 시작한 여과기에서 나오는 검은 물을 봅니다.']}});

/* ================= 8. bait — 낚시 미끼 가게 ================= */
/* [출처: 먹이용 금붕어 과밀 사육과 질병(컬럼나리스·기생충) 보유율] */
fev([{id:'OWB-26',stage:'home',tier:'fact',own:['bait'],sp:['comet','guppy','platy'],cd:30,w:3,
  p:'한 수조에 수백 마리가 들어 있습니다. 매일 아침 그물이 바닥을 한 번 훑고 지나갑니다. 바닥에는 하얗게 변한 몸들이 깔려 있고, 다른 물고기들이 그 몸을 쪼고 있습니다. {n}은…',
  o:[
   {l:'무리를 헤치고 수면 쪽 물살이 있는 곳을 차지한다',chk:['p',45],ok:{t:'{n}은 수면 쪽 물살 자리를 차지했습니다. 떨어지는 먹이를 가장 먼저 먹었습니다.',c:'good',set:{feeder:1}},no:()=>owb26(0)},
   {l:'바닥의 하얀 몸들에서 멀리 떨어진 곳에 머문다',chk:['w',35],ok:()=>owb26(-.2),no:()=>owb26(0)},
   {l:'무리 한가운데에 가만히 섞여 있는다',ok:()=>Object.assign({},owb26(0),{add:{owb_net:isSp('guppy')?0:1}})}
  ]}]);
function owb26(mod){
  setFl('feeder',1);
  if(R()>.5+mod)return {t:'{n}은 그물이 지나가는 아침을 또 한 번 넘겼습니다.',c:'sub',set:{feeder:1}};
  return Object.assign({t:'바닥의 하얀 몸에서 {n}의 입가로 솜 같은 막이 옮아 붙었습니다.',c:'bad',sick:'columnaris',set:{feeder:1}},owb_hold(55,'OWB-26-D',{c:'bad',fx:{h:-12}}));
}
fevEnd({'OWB-26-D':{kind:'bad',cat:'먹이',tier:'fact',fx:'f-trash',pl:[[2,'먹이용으로 과밀 사육']],fact:'fCrowd',
  l:['컬럼나리스균이 바닥의 사체에서 {n}의 입 주변으로 옮겨 붙습니다. 입술 피부가 하얗게 짓무르며 솜털 모양으로 일어납니다.','{n}은 먹이를 물려고 입을 벌리지만 턱 끝이 녹아 닫히지 않습니다. 균이 아가미로 번져 새엽 끝이 갈색으로 무너집니다.','{n}은 수면 근처에서 무리 사이로 밀려다닙니다. 사흘째 {n}은 바닥에 깔린 몸들 사이에 놓입니다.','주인은 그물로 바닥을 한 번 훑어 쓰레기통에 털고 새 상자를 붓습니다.'],
  after:'{n}의 값은 영수증에 "미끼 外"로 찍혔습니다.'}});

/* [출처: 생미끼 꿰는 방식(등 꿰기) / 국내 생미끼 낚시에 쓰이는 어종] */
fev([{id:'OWB-27',stage:'home',tier:'fact',own:['bait'],sp:['comet','guppy'],need:{feeder:1},cd:20,w:()=>2+fl('owb_net'),
  log:'낚시객 한 사람이 "생미끼 스무 마리"를 주문했습니다. {n}은 작은 통에 옮겨졌습니다.',
  p:'작은 통 속 물이 흔들리고 에어 펌프 소리가 끊겼다 이어집니다. 위에서 손 하나가 물속으로 들어옵니다. 손 옆으로 작은 얼굴 하나가 통을 들여다봅니다. {n}은…',
  o:[
   {l:'손을 피해 통 구석으로 빠르게 몸을 돌린다',chk:()=>owb_best(['p',40],['w',35]),ok:{t:'손은 {n} 대신 옆의 다른 물고기를 집어 갔습니다.',c:'sub',fx:{st:.1}},no:()=>owb27hook()},
   {l:'통을 들여다보는 작은 얼굴 쪽 수면으로 올라간다',chk:['c',55],
    ok:{t:'"아빠, 얘는 키우자." 500원짜리 미끼는 아이의 첫 반려동물이 되었습니다. 아이 아빠는 그날 한 마리도 낚지 못했습니다. 통에 남은 열아홉 마리는 다음 주말 같은 저수지로 갔습니다.',c:'good',
     run:()=>owb_rehome('gift','{n}은 비닐봉지에 담겨 낚시객의 아이와 함께 집으로 갔습니다.',{note:'미끼로 팔림'})},
    no:()=>owb27hook()},
   {l:'통 바닥에 가만히 있는다',ok:()=>R()<.25?owb27hook():{t:'손은 바닥에 가만히 있는 {n}을 지나쳤습니다.',c:'sub'}}
  ]}]);
function owb27hook(){
  const tear=isSp('comet')?.6:.35;
  if(R()<tear&&!(isSp('guppy')&&season()==='winter'))return {t:'바늘이 {n}의 등을 꿰었습니다. 낚싯줄이 저수지로 날아갔고, 물속에서 몸부림치던 {n}의 등 근육이 찢어지며 바늘이 빠졌습니다.',c:'bad',fx:{h:-20,st:.2},
    run:()=>{breakP(0,'미끼로 팔아넘김');S.f.released=1;setFl('hooked',1);goWild('river');q(null,null,()=>{const e=FEV.find(x=>x.id==='OWB-28');if(e&&!S.ending&&!S.waiting)fevRun(e)})}};
  return {end:'OWB-27-D'};
}
fevEnd({'OWB-27-D':{kind:'bad',cat:'미끼',tier:'fact',fx:'f-eaten',pl:[[0,'미끼로 팔아넘김']],fact:'fLaw',
  l:['바늘이 등지느러미 앞쪽 근육을 꿰뚫습니다. 바늘 끝이 척추 옆을 지나 반대편 피부로 나옵니다.','{n}은 꼬리를 치며 앞으로 나아가려 합니다. 움직일 때마다 바늘 구멍이 넓어지고 근육 섬유가 찢어집니다.','줄 끝에 매달린 채 {n}은 저수지 물속으로 던져집니다.','물풀 사이에서 가물치가 다가와 {n}을 머리부터 삼킵니다.'],
  after:'{n}의 값은 영수증에 "미끼 外"로 찍혔습니다.'}});

/* [출처: 상처 부위 세균성 궤양(Aeromonas) / 국내 하천 금붕어 정착 여부] — a guppy in winter water gets no event: the cold decides */
fev([{id:'OWB-28',stage:'wild',tier:'fact',sp:['comet','guppy'],need:{hooked:1},once:1,w:5,when:()=>!(isSp('guppy')&&season()==='winter'),
  p:'몸을 붙잡던 당김이 갑자기 사라집니다. 등에서 물이 스며드는 감각이 납니다. 주위는 탁하고 넓은 물, 물풀 냄새가 짙습니다. {n}은…',
  o:[
   {l:'물풀 깊숙한 곳까지 헤엄쳐 들어간다',chk:['w',35],ok:()=>owb28(0),no:()=>owb28(10)},
   {l:'상처를 끌고 얕은 물가 쪽으로 멀리 간다',chk:['p',50],ok:()=>owb28(-5),no:()=>owb28(5)},
   {l:'바닥 진흙 위에 가만히 있는다',ok:()=>owb28(0)}
  ]}]);
function owb28(mod){
  setFl('hooked',0);
  const need=52+mod+(season()==='summer'?5:0);
  return owb_hold(need,'OWB-28-D',()=>isSp('comet')?{end:'OWB-28-H'}:{t:'{n}의 등 상처에 얇은 막이 덮였습니다. 저수지의 여름은 아직 따뜻했습니다.',c:'sub',fx:{h:-10},set:{scar:1}});
}
fevEnd({
 'OWB-28-D':{kind:'bad',cat:'미끼',tier:'fact',fx:'f-pond',pl:[[0,'미끼로 팔아넘김']],
  fact:'바늘이나 상처 자리로 물속 세균이 들어가면 궤양이 생겨 점점 넓어집니다.',
  l:['바늘이 빠진 자리는 등 근육에 뚫린 구멍으로 남습니다. 저수지 물의 세균이 구멍 가장자리 근육으로 들어갑니다.','상처 둘레의 비늘이 일어나고 붉은 테두리가 번집니다. 궤양이 날마다 넓어져 척추 옆 근육이 드러납니다.','{n}은 물풀 아래에서 몸을 기울인 채 가슴지느러미로 균형을 잡습니다. 균형을 잃은 몸이 점점 수면 쪽으로 떠오릅니다.','물가에서 왜가리가 목을 뺍니다.']},
 'OWB-28-H':{kind:'happy',cat:'저수지의 금붕어',tier:'story',fx:'f-rest',
  l:['미끼로 팔려 간 금붕어가 저수지에서 혼자 겨울을 넘깁니다.','등에는 바늘 자국이 하얀 흉터로 남았습니다. {n}은 진흙 바닥을 뒤져 토종 물고기의 알을 먹으며 커 갑니다.','같은 통에서 나간 다른 금붕어들은 모두 가물치 뱃속에 있었습니다.']}
});

/* ================= 9. touch — 체험 카페 · 축제 '물고기 잡기' ================= */
/* [출처: 반복 포획·맨손 취급과 점액층 손상, 수생균 2차 감염] */
fev([{id:'OWB-29',stage:'home',tier:'fact',own:['touch'],sp:['comet','koi','oranda','ryukin'],cd:15,w:3,
  p:'얕은 수조에 아이들의 손이 한꺼번에 들어옵니다. 물이 출렁이고 바닥 모래가 일어납니다. 손 하나가 옆구리를 스치고, 다른 손이 꼬리를 움켜쥡니다. {n}은…',
  o:[
   {l:'손이 오는 순간 재빨리 방향을 튼다',chk:()=>['p',isSp('koi')?60:50],ok:()=>owb29(1),no:()=>owb29(3)},
   {l:'다른 물고기들 틈으로 섞여 들어간다',chk:['w',40],ok:()=>owb29(2),no:()=>owb29(3)},
   {l:'수조 구석 바닥에 가만히 있는다',ok:()=>owb29(4)}
  ]}]);
function owb29(n){
  addFl('owb29_n',n);
  const need=46+fl('owb29_n')*2-(fl('owb29_fix')?10:0);
  return owb_hold(need,'OWB-29-D',()=>Object.assign({t:'그날 {n}은 '+['','한','두','세','네'][n]+' 번쯤 잡혔다 놓였습니다. 손이 닿은 자리의 점막이 얇아졌습니다.',c:'bad',fx:{h:-6,st:.06},set:{slime_loss:1},
    run:()=>owb_learn('owb29_fix','민원이 들어온 뒤, 체험장 벽에 "한 번 잡으면 바로 놓아 주세요" 안내문이 붙었습니다.')},
    isSp('oranda','ryukin')&&R()<.2?{sick:'swimb'}:{}));
}
fevEnd({'OWB-29-D':{kind:'bad',cat:'체험',tier:'fact',fx:'f-hand',pl:[[3,'맨손 잡기 체험에 씀']],fact:'fFair',
  l:['아이가 두 손으로 {n}을 들어 올립니다. {n}이 몸을 비틀자 손이 미끄러집니다. {n}은 수조 테두리에 부딪힌 뒤 바닥 타일에 떨어집니다.','떨어진 충격으로 옆구리 비늘이 한 줄 떨어져 나가고 그 아래 피부가 터집니다. 진행 요원이 {n}을 다시 물에 넣고, 그날 오후에도 {n}은 열 번 넘게 더 잡힙니다.','사흘 뒤 터진 자리에서 하얀 균사가 자라 지느러미 기조 사이로 번집니다.','균사 아래 근육이 회색으로 물러지고, {n}은 체험 수조 배수구 망에 기댄 채 움직이지 않습니다.'],
  after:'그날 체험은 예정대로 열렸습니다. 수조 안 숫자는 아무도 세지 않았습니다.'}});

/* [출처: 젖병 잉어 먹이 주기 체험 운영 사례 / 유기물 부하와 세균성 아가미병] */
fev([{id:'OWB-30',stage:'home',tier:'fact',own:['touch'],sp:['koi','comet'],need:{season:['summer','spring']},cd:25,w:3,
  p:'수면 위로 젖병 수십 개가 내려옵니다. 젖병 꼭지에서 사료가 흘러나오고, 수면이 입과 몸으로 빽빽해집니다. 바닥에는 다 먹지 못한 사료가 쌓여 물컹합니다. {n}은…',
  o:[
   {l:'다른 물고기를 밀치고 젖병 꼭지로 올라간다',chk:['p',55],ok:()=>Object.assign({},owb30(0),{fx:{fat:.2,h:-4}}),no:()=>Object.assign({},owb30(0),{fx:{fin:.1,h:-6}})},
   {l:'무리 가장자리에서 떨어지는 사료만 먹는다',chk:['w',40],ok:()=>owb30(-10),no:()=>owb30(0)},
   {l:'연못 깊은 곳에 가만히 있는다',ok:()=>owb30(0)}
  ]}]);
function owb30(mod){
  return owb_hold(50+mod+(R()<.5?10:0),'OWB-30-D',{t:'체험이 쉬는 월요일, 직원이 바닥의 사료 찌꺼기를 걷어 냈습니다. {n}의 아가미 끝이 하얗게 부어 있었습니다.',c:'bad',fx:{h:-10,wq:-8},set:{inj_gill:1},
    run:()=>owb_learn('owb30_fix','체험장은 하루 젖병 판매 수량을 정했습니다.')});
}
fevEnd({'OWB-30-D':{kind:'bad',cat:'체험',tier:'fact',fx:'f-pond',pl:[[2,'먹이 체험으로 과식시킴']],fact:'fWater',
  l:['하루에 수백 개의 젖병이 비워집니다. 다 먹지 못한 사료가 바닥에 쌓여 썩습니다.','물속 유기물이 늘자 아가미 표면에 세균이 붙어 자랍니다. 아가미 새엽 끝이 부어 서로 붙고 새엽 가장자리가 하얗게 썩습니다.','{n}은 물이 들어오는 입구에 머리를 대고 아가미를 벌립니다. 다음 날도 체험은 열리지만 {n}은 젖병 앞으로 올라오지 않습니다.','마감 시간, 직원이 뜰채로 수면에 뜬 {n}을 건져 냅니다.']}});

/* [출처: 국내 축제 금붕어 건지기 행사 운영 사례 / 수온과 용존산소] */
fev([{id:'OWB-31',stage:'home',tier:'fact',own:['touch'],sp:['comet','oranda','ryukin','guppy'],need:{season:'summer'},once:1,w:3,
  log:'여름 축제 날, {n}의 수조는 천막 아래 "금붕어 건지기" 판으로 옮겨졌습니다.',
  p:'천막 아래 얕은 수조의 물이 오후 내내 데워집니다. 종이를 붙인 작은 뜰채가 수면 아래로 천천히 들어옵니다. 뜰채가 찢어질 때마다 아이들의 탄성이 들립니다. {n}은…',
  o:[
   {l:'다가오는 뜰채 쪽으로 헤엄쳐 간다',chk:()=>isSp('guppy')?null:['c',40],ok:()=>owb31take(),no:()=>owb31stay()},
   {l:'뜰채를 피해 수조 반대편으로 달아난다',chk:['p',30],ok:()=>owb31stay(),no:()=>owb31stay()},
   {l:'수조 가운데 바닥에 가만히 있는다',ok:()=>owb31stay()}
  ]}]);
function owb31take(){
  return owb_move('bored',{force:'gift',ride:'bag',text:'종이 뜰채가 {n}을 건졌습니다. {n}은 손바닥만 한 봉지에 담겨 아이를 따라갔습니다.'});
}
function owb31stay(){
  return owb_hold(55,'OWB-31-D',()=>{
    const r=R();
    if(r<.4)return {t:'축제가 끝나고, 남은 물고기들은 운영자의 창고 수조로 돌아갔습니다.',c:'sub',fx:{h:-8}};
    if(r<.7&&owb_fits('bait'))return {t:'축제가 끝나고, 남은 물고기들은 미끼 가게 업자에게 한꺼번에 넘겨졌습니다.',c:'bad',run:()=>owb_rehome('bait','{n}은 미끼 가게의 "먹이용" 수조로 갔습니다.',{note:'축제 뒤 일괄 처분'})};
    return owb_move('bored',{force:'gift',ride:'bag',text:'"공짜로 가져가세요." 지나가던 사람이 {n}이 든 봉지를 받아 갔습니다.'});
  });
}
fevEnd({'OWB-31-D':{kind:'bad',cat:'뜰채 체험',tier:'fact',fx:'f-stall',pl:[[2,'뙤약볕 아래 얕은 수조']],fact:'fFair',
  l:['오후 햇볕이 천막을 데우고, 얕은 수조의 수온이 계속 오릅니다. 수온이 오를수록 물에 녹는 산소는 줄어듭니다.','수백 마리가 같은 물의 산소를 씁니다. {n}은 수면에서 입을 벌리고 아가미 뚜껑을 빠르게 움직입니다.','뜰채가 몸을 스칠 때마다 점막이 조금씩 벗겨집니다. 해 질 무렵 {n}은 옆으로 기울어 수조 가장자리로 밀려갑니다.','천막을 걷을 때 {n}은 물 위에 떠 있습니다.']}});

/* ================= 10. grandma — 효도 선물 어항 ================= */
/* [출처: 여과재 수돗물 세척과 질산화 세균 손실 / 전체 환수의 위험] */
fev([{id:'OWB-32',stage:'home',tier:'fact',own:['grandma'],cd:20,when:()=>!fl('owb32_fix'),w:3,
  p:'일요일 아침, 주름진 손이 수조 안으로 들어와 {n}을 바가지에 옮겨 담습니다. 수조의 물이 다 버려지고, 자갈과 여과 솜이 수도꼭지 아래에서 박박 씻깁니다. 새 물은 차갑고 냄새가 납니다. {n}은…',
  o:[
   {l:'할머니 손가락을 따라 수면으로 올라간다',chk:['c',50],
    ok:()=>{addFl('owb_h9');return Object.assign({t:'할머니가 손주에게 영상 통화로 {n}을 자랑했습니다. 손주가 말했습니다. "할머니, 물 다 갈면 안 돼요."',c:'good',fx:{i:.05}},
      R()<.4?{run:()=>{setFl('owb32_fix',1);addLog(T('할머니는 그 뒤로 물을 3분의 1만, 하루 받아 둔 물로 갈았습니다.'),'good')}}:{run:()=>q(null,null,()=>fevOut(owb32(0)))})},
    no:()=>owb32(0)},
   {l:'바가지 안에서 가장자리를 따라 천천히 돈다',chk:['g',40],ok:()=>owb32(-10),no:()=>owb32(0)},
   {l:'바가지 바닥에 가만히 있는다',ok:()=>owb32(0)}
  ]}]);
function owb32(mod){
  const need=50+mod-(owb_cold()?10:0)+(owb_trop()?(season()==='winter'?15:5):0);
  return owb_hold(need,'OWB-32-D',{t:'금요일쯤 물에서 비린내가 났고, 일요일에 물은 또 다 바뀌었습니다. {n}은 이번 주도 버텼습니다.',c:'bad',fx:{h:-10,st:.08},set:{cycled:0,chlorine:1}});
}
fevEnd({'OWB-32-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',pl:[[2,'매주 물을 다 갈고 여과재를 수돗물로 씻음']],fact:'fCycle',
  l:['일요일마다 할머니는 수조의 물을 다 버리고 여과 솜을 수돗물에 박박 씻습니다. 여과 솜에 붙어 살던 질산화 세균이 씻겨 나가고 염소에 죽습니다.','금요일쯤 물에서 비린내가 납니다. 암모니아가 오르자 {n}의 아가미 새엽이 붉게 붓고 지느러미에 붉은 실핏줄이 섭니다.','{n}은 수면에서 입을 벌립니다. 일요일, 할머니는 물을 또 다 갈아 줍니다.','열두 번째 일요일 아침, {n}은 바닥에 옆으로 누워 있습니다.'],
  after:'할머니는 빈 어항을 한동안 치우지 않고 아침마다 그 앞에 섰습니다.'}});

/* [출처: 녹조 수역 주야간 용존산소 변동 / 열대어 저수온 한계] — a tropical fish without a heater on a winter balcony gets no check */
fev([{id:'OWB-33',stage:'home',tier:'fact',own:['grandma','casual'],need:{season:['summer','winter']},cd:40,when:()=>!fl('owb33_fix')&&!(season()==='winter'&&owb_trop()&&!fl('heater')),w:()=>isKind('grandma')?2.5:.4,
  log:'어항은 아파트 베란다 창가에 놓여 있었습니다.',
  p:()=>season()==='summer'?'남향 창으로 들어온 햇볕이 유리 어항을 오후 내내 데웁니다. 물빛이 날마다 짙은 초록으로 변합니다. 밤이 되면 물이 무겁게 느껴집니다. {n}은…'
    :'베란다 창틈으로 찬 공기가 들어옵니다. 물 표면이 차갑고, 아침마다 할머니 입김이 유리에 하얗게 서립니다. {n}은…',
  o:[
   {l:'할머니가 나오는 아침마다 유리 앞으로 나간다',chk:['c',55],
    ok:{t:'"얘가 오늘은 왜 이렇게 굼뜨지." 할머니는 어항을 거실 안쪽으로 들여놓았습니다.',c:'good',set:{owb33_fix:1}},no:()=>owb33(0)},
   {l:()=>season()==='summer'?'수초 그늘에 머문다':'바닥 깊은 곳에 머문다',chk:['w',35],ok:()=>owb33(-10),no:()=>owb33(0)},
   {l:'바닥에 가만히 있는다',ok:()=>owb33(0)}
  ]}]);
function owb33(mod){
  if(season()==='winter'){
    if(!owb_trop())return {t:'베란다의 물은 차가웠지만, {n}의 몸은 그 물을 알고 있었습니다. {n}은 바닥에서 느릿느릿 겨울을 났습니다.',c:'sub'};
    if(!fl('heater'))return R()<owb_df()?{end:'OWB-33-W'}:owb_scar({t:'밤마다 베란다의 물이 식었습니다. {n}은 바닥에 몸을 붙인 채 겨울을 났습니다.',c:'bad',fx:{h:-12}},'OWB-33-W');
    return owb_hold(50+mod,'OWB-33-W',{t:'히터가 밤새 쉬지 않고 돌았습니다. {n}은 히터 옆에 붙어 겨울을 났습니다.',c:'sub',fx:{h:-8}});
  }
  return owb_hold(55+mod-(owb_air()?15:0),'OWB-33-S',{t:'새벽마다 {n}은 수면에서 입을 벌렸습니다. 여름이 끝날 무렵 물빛은 조금 옅어졌습니다.',c:'bad',fx:{h:-12,st:.1}});
}
fevEnd({
 'OWB-33-S':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-sun',pl:[[2,'볕 드는 베란다에 어항을 둠']],fact:'fSun',
  l:['7월 오후, 햇볕이 유리 어항을 데우고 녹조가 번져 물이 짙은 초록이 됩니다.','낮에는 녹조가 산소를 만들고, 밤에는 녹조와 {n}이 함께 산소를 씁니다. 수온이 오른 물에는 산소가 적게 녹습니다.','새벽, {n}은 수면에서 입을 벌립니다. 아가미 뚜껑이 점점 크게, 점점 느리게 움직입니다.','할머니가 아침 인사를 하러 나왔을 때 {n}은 초록 물 위에 배를 보이고 떠 있습니다.']},
 'OWB-33-W':{kind:'bad',cat:'동사',tier:'fact',fx:'f-ice',pl:[[2,'겨울 베란다에 열대어를 둠']],fact:'fTemp',
  l:['밤사이 베란다 기온이 떨어지고 수온이 함께 내려갑니다.','{n}의 근육이 느려지고 지느러미가 몸에 붙습니다. {n}은 바닥에 몸을 대고 거의 움직이지 않습니다. 아가미 뚜껑이 점점 드물게 열립니다.','아침, 할머니는 "추워서 자나 보다" 하고 먹이를 넣습니다.','먹이는 {n}의 입 앞에 그대로 가라앉습니다.']}
});

/* [출처: 과잉 급이와 수질 악화] */
fev([{id:'OWB-34',stage:'home',tier:'fact',own:['grandma'],need:{season:['autumn','spring']},cd:60,w:2,
  log:'명절이었습니다. 손주들이 할머니 댁에 왔습니다.',
  p:'집 안이 갑자기 시끄러워집니다. 작은 손바닥들이 유리를 두드리고, 수면 위로 먹이통이 통째로 기울어집니다. 휴대폰 플래시가 수조 안을 번쩍 비춥니다. {n}은…',
  o:[
   {l:'유리 앞 작은 얼굴들 쪽으로 나간다',chk:['c',50],
    ok:()=>{addFl('owb_h9');return {t:'손주 하나가 {n}을 한참 들여다보다 휴대폰으로 검색했습니다. 냉장고에 "먹이는 하루 한 번 조금"이라는 메모가 붙었습니다.',c:'good',fx:{i:.08},set:{owb34_fix:1,owb32_fix:1},run:()=>q(null,null,()=>fevOut(owb34(-10)))}},
    no:()=>Object.assign({t:'아이들이 신이 나서 먹이통을 한 번 더 기울였습니다.',c:'bad',fx:{fat:.2,wq:-10}},isSp('oranda','ryukin')?{sick:'swimb'}:{},{run:()=>q(null,null,()=>fevOut(owb34(5)))})},
   {l:'쏟아지는 먹이를 피해 수조 끝으로 간다',chk:['w',35],ok:()=>owb34(-10),no:()=>owb34(0)},
   {l:'은신처에 가만히 있는다',ok:()=>Object.assign({},owb34(0),isSp('@small')&&R()<.4?{t:'플래시가 터질 때마다 놀란 {n}이 유리에 몸을 부딪쳤습니다.',fx:{h:-5}}:{})}
  ]}]);
function owb34(mod){
  const bite=isSp('oscar','channa')&&R()<.4;
  return owb_hold(45+mod,'OWB-34-D',{t:bite?'{n}이 수면에 내민 손주 손가락을 물었습니다. 할머니는 수조를 손주 손이 닿지 않는 장 위로 옮겼습니다.':'명절 뒤 사흘, 바닥의 사료가 썩어 물이 탁해졌습니다. {n}은 수면 아래에서 버텼습니다.',c:'bad',fx:{h:-10,wq:-10}});
}
fevEnd({'OWB-34-D':{kind:'bad',cat:'수질 악화',tier:'fact',fx:'f-float',pl:[[2,'먹이통째 쏟음']],fact:'fWater',
  l:['바닥에 가라앉은 사료 한 통이 물을 먹고 부풀어 풀어집니다. 사흘 사이 사료가 썩으며 물이 탁해지고 수면에 거품이 남습니다.','늘어난 세균과 암모니아가 아가미 새엽을 붓게 합니다. {n}은 수면 바로 아래에서 아가미 뚜껑을 빠르게 여닫습니다.','지느러미 가장자리가 하얗게 짓무릅니다.','손주들이 돌아간 날 저녁, {n}은 여과기 흡입구 망에 몸이 붙은 채 움직이지 않습니다.']}});

/* ================= 11. breakup — 이별한 커플 ================= */
/* [출처: 수질 악화와 지느러미 썩음병] */
fev([{id:'OWB-35',stage:'home',tier:'fact',own:['breakup'],cd:20,w:3,when:()=>fl('breakup_stage')<2,
  p:'두 사람의 목소리가 날마다 조금씩 높아집니다. 한 달째 물이 갈리지 않고, 유리 안쪽에 갈색 막이 낍니다. 두 사람 모두 수조 앞을 빠르게 지나갑니다. {n}은…',
  o:[
   {l:'둘 중 누가 지나갈 때마다 유리 앞으로 나간다',chk:['c',55],ok:{t:'"얘 물 언제 갈았어?" "네가 갈았잖아." 그날 밤 물은 갈렸고, 두 사람은 한 번 더 다퉜습니다.',c:'sub',fx:{wq:20},add:{breakup_stage:1}},no:()=>owb35(0)},
   {l:'수면 가까이 머물며 숨을 고른다',chk:()=>['g',owb_air()?35:45],ok:()=>owb35(-10),no:()=>owb35(0)},
   {l:'은신처에 가만히 있는다',ok:()=>owb35(0)}
  ]}]);
function owb35(mod){
  addFl('breakup_stage');
  const need=50+mod+(isSp('@longfin')?5:0)+(isSp('@gold')?5:0);
  return owb_hold(need,'OWB-35-D',{t:'{n}의 지느러미 가장자리가 검게 변하기 시작했습니다.',c:'bad',fx:{h:-10,fin:.1,wq:-8},
    run:()=>owb_learn('owb35_fix','한 사람이 말없이 물을 갈았습니다. 다른 사람은 그걸 보고도 아무 말 하지 않았습니다.',.2)});
}
fevEnd({'OWB-35-D':{kind:'bad',cat:'방치',tier:'fact',fx:'f-nipped',pl:[[2,'서로 미루며 물을 안 갈음']],fact:'fWater',
  l:['두 사람은 서로 상대가 물을 갈았다고 생각합니다. 한 달 동안 물은 그대로입니다.','{n}의 지느러미 가장자리가 검게 변하고 기조 사이 막이 녹아 사라집니다. 녹은 자리 끝에 하얀 테두리가 생기고 썩음이 몸 쪽으로 내려옵니다.','{n}은 짧아진 지느러미를 끌며 수면으로 올라가 공기를 마십니다.','썩음이 꼬리자루 근육까지 닿은 주, {n}은 수초에 걸린 채 움직이지 않습니다. 두 사람은 그 일로 처음 크게 싸웁니다.'],
  after:false}});

/* [출처: 무리어 소수 사육 스트레스 / 네온병(Pleistophora hyphessobryconis) 증상] — a lone male betta gets OWB-43 instead */
fev([{id:'OWB-36',stage:'home',tier:'fact',own:['breakup'],need:{breakup_stage:2},notSp:['betta'],once:1,w:5,
  log:'두 사람은 헤어지기로 했습니다. 물고기도 반씩 나누기로 했습니다.',
  p:'그물이 수조를 휘젓고, 무리가 둘로 갈라집니다. 절반은 이쪽 봉지, 절반은 저쪽 봉지에 담깁니다. 봉지 두 개가 서로 다른 문으로 나갑니다. {n}은…',
  o:[
   {l:'무리에서 가장 가까운 친구를 따라 같은 그물로 들어간다',chk:['w',40],ok:()=>owb36(-10),no:()=>owb36(0)},
   {l:'그물을 피해 수조에 끝까지 남는다',chk:['p',40],ok:()=>Object.assign({t:'마지막까지 그물에 걸리지 않은 {n}은 빈 방에 수조째 남았습니다. 두 사람 모두 "네가 데려가"라고 했습니다.',c:'bad'},owb_move('breakup',{only:['left','casual','relay']})),no:()=>owb36(0)},
   {l:'바닥에 가만히 있는다',ok:()=>owb36(0)}
  ]}]);
function owb36(mod){
  const need=45+mod+(isSp('@schooling')?15:0);
  const preg=isSp('@livebearer')&&fem()?' {n}의 배는 이미 불러 있었습니다. 새 집 수조에는 몇 주 뒤 치어가 가득했습니다.':'';
  if(isSp('neon')&&!owb_roll('g',need)&&R()<.15)return {t:'새 집에서 {n}은 수초 뒤에서 나오지 않았습니다.',c:'bad',sick:'neond',run:()=>q(null,null,()=>fevOut({end:'OWB-36-D'}))};
  return owb_hold(need,'OWB-36-D',{t:'{n}이 담긴 봉지는 한 사람의 새 집으로 갔습니다.'+preg,c:'sub',fx:{st:.12},
    run:()=>owb_rehome('breakup','{n}은 헤어진 두 사람 중 한 사람의 새 집으로 갔습니다.',{bstage:3,note:'이별하며 나눔'})});
}
fevEnd({'OWB-36-D':{kind:'bad',cat:'스트레스',tier:'fact',fx:'f-bent',pl:[[0,'이별하며 무리를 나눔']],fact:()=>isSp('neon')?'fNeon':'fCrowd',
  l:['여섯 마리 중 세 마리가 한 봉지에 담겨 새 집 수조에 풀립니다. 새 수조는 넓고 셋은 흩어집니다.','무리가 작아지자 {n}은 낮에도 수초 뒤에서 나오지 않습니다. 먹이 시간에 수면으로 올라오지 못해 몸통이 얇아집니다.','약해진 몸에 미포자충이 자리 잡아 등 근육의 색 띠 아래가 하얗게 바랩니다. {n}의 척추가 휘어 비스듬히 헤엄칩니다.','한 달 뒤, 수초 뒤에서 {n}은 옆으로 누워 있습니다.']}});

/* EV-OWB-37 담요를 덮은 수조 (출처 없음 → likely) */
fev([{id:'OWB-37',stage:'home',tier:'likely',own:['breakup'],need:{breakup_stage:3},cd:30,w:4,when:()=>!fl('owb37_done'),
  p:'수조 위로 담요가 덮입니다. 물속이 오래도록 어둡습니다. 가끔 담요 끝이 들리고 먹이 몇 알이 떨어진 뒤 다시 어두워집니다. {n}은…',
  o:[
   {l:'담요 틈으로 빛이 들어오는 수면 쪽에서 기다린다',chk:['c',50],
    ok:()=>{setFl('owb37_done',1);setFl('blanket',0);return R()<.3?{t:'담요를 들던 주인이 {n}과 눈이 마주쳤습니다. 주인은 담요를 걷고 그날 물을 갈았습니다.',c:'good',fx:{i:.3,wq:15}}
      :Object.assign({t:'담요를 들던 주인이 {n}과 눈이 마주쳤습니다. 주인은 담요를 걷고, 그날 밤 판매글을 올렸습니다. "잘 키워 주실 분만."'},owb_move('breakup',{bonus:1,drop:['left','breakup']}))},
    no:()=>owb37(0)},
   {l:'어둠 속에서 바닥을 뒤져 먹을 것을 찾는다',chk:()=>['w',isSp('@bottom','ghost')?35:45],ok:()=>owb37(-10),no:()=>owb37(0)},
   {l:'은신처에 가만히 있는다',ok:()=>owb37(-5)}
  ]}]);
function owb37(mod){
  setFl('blanket',1);
  const need=50+mod-(isSp('ghost','bichir','clownloach')?10:0)+(isSp('altum','apisto')?10:0)+(isSp('pleco')&&!fl('hides')?10:0);
  return owb_hold(need,'OWB-37-D',{t:'담요 아래에서 또 한 주가 지났습니다. {n}의 배가 조금 더 꺼졌습니다.',c:'bad',fx:{h:-10,wq:-6},set:{weight:'thin'}});
}
fevEnd({'OWB-37-D':{kind:'bad',cat:'방치',tier:'likely',fx:'f-thin',pl:[[2,'수조를 덮어 두고 방치']],
  l:['몇 주 동안 수조에 빛이 들어오지 않습니다. 수초가 빛을 받지 못해 잎부터 녹고, 녹은 잎이 바닥에서 썩습니다.','먹이는 생각날 때만 담요 틈으로 들어옵니다. {n}의 몸통 근육이 줄어 등뼈 선이 드러나고 배가 안쪽으로 꺼집니다.','{n}은 담요 틈에서 빛이 새는 쪽 수면에 머뭅니다.','이사 날, 담요를 걷은 주인은 처음으로 수조 안을 들여다봅니다. {n}은 녹은 수초 더미 위에 누워 있습니다.']}});

/* ================= 12. owner changes (any owner) ================= */
/* [출처: 수온과 용존산소 / 운송 중 고온 폐사] */
fev([{id:'OWB-38',stage:'home',tier:'fact',cd:80,w:()=>isKind('relay','breakup')?.6:.2,
  log:'주인이 이사를 하게 되었습니다.',
  p:'집 안의 물건이 하나둘 상자로 들어갑니다. 수조의 물이 호스로 빠져나가 수위가 발끝까지 내려옵니다. 그물 하나가 내려옵니다. {n}은…',
  o:[
   {l:'그물 쪽으로 다가가 주인의 손에 몸을 맡긴다',chk:['c',45],ok:()=>owb38({mul:{same:1.5},bonus:1,better:1}),no:()=>owb38({})},
   {l:'남은 물에서 그물을 피해 돈다',chk:['p',40],ok:()=>owb38({mul:{same:.6}}),no:()=>Object.assign({},owb38({}),{fx:{fin:.08}})},
   {l:'바닥에 가만히 있는다',ok:()=>owb38({})}
  ]}]);
function owb38(o){
  if(isSp('@big')&&R()<.5)return owb_move('oversize',{text:'이삿짐 업체는 큰 수조를 받지 않았습니다. 주인은 {n}을 데려갈 수 없었습니다.'});
  const k=owb_draw('move',o);
  const ride=['expert','staff','breeder'].includes(kindOf())?'icebox':o.better?'bag':'truck';
  return owb_move('move',{force:k,ride,rideEnd:'OWB-38-D',rideDf:.15,rideEndIf:()=>season()==='summer'&&ride==='truck',sameText:'짐을 다 푼 저녁, {n}은 새 집 수조에 다시 풀렸습니다.'});
}
fevEnd({'OWB-38-D':{kind:'bad',cat:'운송',tier:'fact',fx:'f-box',pl:[[0,'이사 짐칸에 실음']],fact:'fO2',
  l:['봉지는 반찬통에 담겨 상자들 사이 짐칸에 실립니다. 7월 오후, 닫힌 짐칸의 공기가 데워지고 봉지 속 수온이 오릅니다.','수온이 오를수록 물에 녹는 산소는 줄고 {n}이 쓰는 산소는 늘어납니다. {n}은 봉지 위쪽 물에 입을 대고 아가미를 빠르게 움직입니다.','트럭이 흔들릴 때마다 {n}의 몸이 봉지 벽에 부딪힙니다. 아가미 새엽이 붉게 부풀고 {n}은 옆으로 기울어 봉지 바닥에 닿습니다.','새 집에서 반찬통을 연 것은 짐을 다 푼 저녁입니다.']}});

/* EV-OWB-39 결혼 (출처 없음 → likely) */
fev([{id:'OWB-39',stage:'home',tier:'likely',cd:80,w:.18,
  p:'처음 보는 사람이 수조 앞에 쪼그려 앉아 오래 들여다봅니다. 두 사람이 수조를 가리키며 이야기를 나눕니다. 며칠 뒤 집 안에 상자가 쌓이기 시작합니다. {n}은…',
  o:[
   {l:'낯선 사람의 얼굴 앞으로 다가가 따라 움직인다',chk:['c',55],ok:()=>owb39(1),no:()=>owb39(0)},
   {l:'수조를 크게 가로지르며 힘차게 헤엄친다',chk:()=>['p',isSp('@big')?40:50],ok:()=>owb39(1),no:()=>owb39(0)},
   {l:'은신처에 가만히 있는다',ok:()=>owb39(0)}
  ]}]);
function owb39(liked){
  if(!liked&&isSp('gar','pleco','motoro')&&R()<.4)return owb_move('oversize',{text:'"그건 못 데려가." 새 배우자의 말에 주인은 {n}을 보낼 곳을 찾았습니다.'});
  const k=liked?'same':owb_draw('marry');
  if(R()<.25)return owb_move('marry',{force:k,ride:'bag',rideMod:15,rideEnd:'OWB-39-D',rideDf:.15,sameText:'"얘 귀엽다." 새 배우자가 {n}을 신혼집 거실 한가운데에 두자고 했습니다.'});
  if(k==='same')return {t:liked?'"얘 귀엽다." 새 배우자가 {n}을 신혼집 거실 한가운데에 두자고 했습니다.':'{n}은 신혼집으로 함께 옮겨졌습니다.',c:'good',fx:{i:liked?.2:0},run:()=>{if(liked&&R()<.3){S.r=clamp(S.r+.05,0,.97);addLog(T('새 배우자는 물생활 카페에 가입했습니다.'),'good')}}};
  return owb_move('marry',{force:k});
}
fevEnd({'OWB-39-D':{kind:'bad',cat:'운송',tier:'likely',fx:'f-bag',pl:[[0,'이삿짐 사이에 잊음']],
  l:['봉지는 신혼집 거실 상자 더미 사이에 놓입니다. 이틀 동안 아무도 그 상자를 열지 않습니다.','봉지 속 산소가 줄어들고 {n}의 배설물에서 나온 암모니아가 쌓입니다. {n}은 봉지 위쪽 공기와 맞닿은 수면에 입을 댑니다.','아가미 새엽 상피가 부어 숨 쉬는 면이 줄어듭니다. 봉지 벽에 기댄 {n}의 아가미 뚜껑이 점점 느리게 움직입니다.','셋째 날, 상자를 열던 사람이 짧게 소리를 냅니다.']}});

/* EV-OWB-40 출산 (출처 없음 → likely) — a tropical fish on an unheated winter balcony gets no check */
fev([{id:'OWB-40',stage:'home',tier:'likely',cd:80,w:.15,
  log:'주인 집에 아기가 태어났습니다.',
  p:'수조가 있던 방에 작은 침대가 들어옵니다. 수조는 베란다로 옮겨지고, 히터 플러그가 뽑힌 자리에 가습기 플러그가 꽂힙니다. 사람들이 수조 앞을 지나가는 횟수가 줄어듭니다. {n}은…',
  o:[
   {l:'사람이 베란다 문을 열 때마다 유리 앞으로 나간다',chk:['c',50],ok:()=>owb40(0,1),no:()=>Object.assign({},owb40(0,0),{fx:{i:-.2}})},
   {l:'수조에서 가장 깊고 덜 차가운 곳에 머문다',chk:['w',35],ok:()=>owb40(-10,0),no:()=>owb40(0,0)},
   {l:'바닥에 가만히 있는다',ok:()=>owb40(0,0)}
  ]}]);
function owb40(mod,good){
  if(isSp('@big'))return owb_move('oversize',{text:'큰 수조는 베란다로 옮길 수 없었습니다. 주인은 {n}을 보낼 곳을 찾았습니다.'});
  setFl('heater',0);S.interest=clamp(S.interest-.3,.02,1);
  const s=season();
  if(s==='winter'&&owb_trop())return R()<.06?{end:'OWB-40-D'}:{t:'베란다 창은 이중창이었습니다. 수온은 낮에도 미지근한 데서 더 오르지 않았고, {n}은 몇 주 동안 바닥에서 지느러미를 접고 지냈습니다. 지느러미 끝이 하얗게 괴사해 떨어져 나갔습니다.',c:'bad',fx:{h:-18,fin:.1,st:.1},set:{inj_fin:1}};
  if(s==='summer'&&!owb_roll('g',55+mod-(owb_air()?15:0)))return {t:'베란다 어항의 물이 초록으로 변했습니다. 새벽마다 {n}은 수면에서 입을 벌렸습니다.',c:'bad',fx:{h:-20,st:.12}};
  if(R()<.6)return owb_move('baby',{bonus:good?1:0});
  return {t:'몇 달 동안 {n}의 수조는 베란다에 그대로 있었습니다. 먹이는 생각날 때만 떨어졌습니다.',c:'bad',fx:{h:-6}};
}
fevEnd({'OWB-40-D':{kind:'bad',cat:'동사',tier:'likely',fx:'f-ice',pl:[[2,'히터를 뽑고 베란다로 옮김']],fact:'fTemp',
  l:['히터가 꺼진 베란다 수조의 수온이 밤마다 내려갑니다. {n}의 대사가 느려지고 먹이를 찾지 않습니다.','면역 반응이 약해지고 피부 점액이 얇아집니다. {n}은 바닥에 몸을 대고 지느러미를 몸에 붙입니다.','몸이 옆으로 기울어 다시 바로 서지 못합니다. 아가미 뚜껑이 점점 드물게 열리다 멈춥니다.','거실에서는 가습기가 밤새 하얀 김을 뿜습니다.']}});

/* EV-OWB-41 입원 (출처 없음 → likely) */
fev([{id:'OWB-41',stage:'home',tier:'likely',cd:80,w:()=>isKind('grandma')?.6:.15,
  log:'주인이 갑자기 입원했습니다.',
  p:'며칠째 집 안에 아무도 없습니다. 어느 날 낯선 사람이 문을 열고 들어와 먹이통을 들고 수조 앞에 섭니다. 그 사람은 먹이통을 오래 들여다봅니다. {n}은…',
  o:[
   {l:'낯선 사람 앞 수면으로 올라가 입을 벌린다',chk:['c',50],ok:()=>owb41(-15,1),no:()=>Object.assign({t:'"얼마나 줘야 해?" 그 사람은 먹이통을 반이나 부었습니다.',c:'bad'},owb_hold(55,'OWB-41-D',()=>owb41(0,0),.1))},
   {l:'수조 이끼나 바닥 찌꺼기를 뒤진다',chk:()=>['w',isSp('@bottom','pleco')?25:40],ok:()=>owb41(-10,0),no:()=>owb41(0,0)},
   {l:'은신처에 가만히 있는다',ok:()=>owb41(0,0)}
  ]}]);
function owb41(mod,fam){
  const need=50+mod+(isSp('neon','guppy','peapuffer','altum')?15:0)-(isSp('oscar','arowana','koi','gar','channa')?15:0)+(fl('filter')==='hob'?10:0);
  return owb_hold(need,'OWB-41-D',()=>{
    if(R()<.15)return {t:'몇 주 뒤 주인이 퇴원해 돌아왔습니다. 수조의 물은 절반으로 줄어 있었지만, {n}은 살아 있었습니다.',c:'sub',fx:{h:-10},set:{weight:'thin'},
      run:()=>{if(isKind('grandma')){setFl('autofeeder',1);addLog(T('손주가 와서 수조 위에 자동 급이기를 달아 주고 갔습니다.'),'sub')}}};
    return Object.assign({},owb_move('hospital',{only:fam?['grandma','gift']:undefined,drop:['same']}),{fx:{h:-10}});
  },.1);
}
fevEnd({'OWB-41-D':{kind:'bad',cat:'굶주림',tier:'likely',fx:'f-thin',pl:[[2,'입원 중 아무도 돌보지 않음']],
  l:['수위가 날마다 조금씩 내려갑니다. 걸이식 여과기의 흡입구가 수면 위로 드러나고 물이 더 이상 돌지 않습니다.','남은 물에 배설물이 쌓이고 암모니아가 오릅니다. {n}의 몸통 근육이 줄어 등뼈 선이 드러납니다.','{n}은 바닥 찌꺼기를 입으로 뒤지다 수면으로 올라가 입을 벌립니다. 아가미 새엽이 부어 숨 쉬는 면이 줄어듭니다.','주인이 퇴원해 돌아온 날, 수조 안의 물은 절반으로 줄어 있습니다.'],after:false}});

/* EV-OWB-42 주인이 돌아오지 않는 집 (출처 없음 → likely). The owner's death is never shown, only the absence. */
fev([{id:'OWB-42',stage:'home',tier:'likely',once:1,w:()=>isKind('grandma')?.5:isSp('koi','comet','pleco','gar','arowana','oscar')?.2:.06,
  p:'며칠째 불이 켜지지 않습니다. 히터와 여과기만 같은 소리로 돌고, 먹이는 떨어지지 않습니다. 어느 날 현관문이 열리고 여러 사람의 발소리가 들어옵니다. {n}은…',
  o:[
   {l:'수조 앞에 선 사람들 쪽으로 다가가 따라 움직인다',chk:['c',55],
    ok:()=>owb_move('death',{only:['grandma','learner','gift','expert'],text:fl('owb_h9')>=2?'"엄마가 아끼던 거야." 딸이 {n}의 어항을 품에 안고 나갔습니다. 냉장고에는 손주가 붙인 메모가 그대로 있었습니다.':'"엄마가 아끼던 거야." 가족 중 한 사람이 {n}을 데려갔습니다.'}),no:()=>owb42()},
   {l:'수조 안을 크게 돌며 움직임을 보인다',chk:['p',40],ok:()=>owb_move('death',{only:['relay','casual','staff','shop'],text:'"얘 아직 살아 있네." 가족은 {n}을 나눔으로 올렸습니다.'}),
    no:()=>Object.assign({},owb42(),{fx:{fin:.08}})},
   {l:'은신처에 가만히 있는다',ok:()=>owb42()}
  ]}]);
function owb42(){
  const need=50+(isSp('@small')?15:0)-(isSp('@big')?15:0);
  return Object.assign({t:'"이것도 정리해야겠네."',c:'bad'},owb_hold(need,'OWB-42-D',()=>owb_move('death',{endFlush:'OWB-42-D',riverText:'가족 중 한 사람이 {n}을 근처 하천에 놓아주었습니다.'}),.1));
}
fevEnd({'OWB-42-D':{kind:'bad',cat:'버려짐',tier:'likely',fx:'f-trash',pl:[[0,'유품과 함께 버림']],
  l:['정리 업체 사람들이 수조를 옮기려고 물을 하수구로 빼냅니다. {n}은 물이 빠지는 쪽으로 몸이 끌려가지 않으려고 바닥에 지느러미를 벌립니다.','수위가 등지느러미 아래로 내려가고 {n}은 옆으로 눕습니다. 바닥 자갈에 닿은 쪽 피부 점막이 마르기 시작합니다.','아가미 뚜껑이 열릴 때마다 물 대신 공기가 들어가고 새엽이 서로 붙습니다.','수조는 그대로 현관 밖 폐기물 더미 옆에 놓입니다.'],after:false}});

/* EV-OWB-43 이별 — 누가 데려가나 (출처 없음 → likely) */
fev([{id:'OWB-43',stage:'home',tier:'likely',cd:80,w:()=>isKind('breakup')&&fl('breakup_stage')>=2?(isSp('betta')?6:3):.12,
  when:()=>!(isKind('breakup')&&fl('breakup_stage')>=3),
  p:'두 사람이 수조 양쪽에 서 있습니다. 한 사람이 휴대폰 사진을 넘기고, 다른 사람은 상자에 짐을 넣습니다. 수조를 사이에 두고 오래 아무 말이 없습니다. {n}은…',
  o:[
   {l:'한 사람 쪽 유리로 다가가 그 사람 앞에 머문다',chk:['c',50],ok:()=>owb43({drop:['left']}),no:()=>owb43({})},
   {l:'수조 가운데에서 두 사람을 번갈아 따라 움직인다',chk:['c',65],ok:()=>owb43({drop:['left'],bonus:2}),no:()=>({t:'"네가 데려가." "아니, 네가."',c:'bad',run:()=>q(null,null,()=>fevOut(R()<.5?{run:()=>{render();fEnd('left')}}:owb43({force:'breakup'})))})},
   {l:'은신처에 가만히 있는다',ok:()=>owb43({})}
  ]}]);
function owb43(o){
  const k=o.force||owb_draw('breakup',o);
  if(k==='breakup'){
    if(!owb_ride('bottle')&&R()<.1)return {end:'OWB-43-D'};
    if(isKind('breakup'))return {t:'한 사람이 {n}을 데려갔습니다. 새 집에는 수조가 없어서, {n}은 한동안 반찬통에서 지냈습니다.',c:'bad',fx:{h:-10},set:{breakup_stage:3}};
    return owb_move('breakup',{force:'breakup',ride:'icebox',bstage:3,text:'두 사람이 헤어지고, 한 사람이 {n}을 데려갔습니다.'});
  }
  return owb_move('breakup',{force:k,ride:'bottle',rideEnd:'OWB-43-D',rideDf:.1});
}
fevEnd({'OWB-43-D':{kind:'bad',cat:'방치',tier:'likely',fx:'f-float',pl:[[2,'아이스크림 통에 옮겨 둠']],fact:'fBowlAny',
  l:['{n}은 빈 아이스크림 통에 수조 물 한 컵과 함께 담깁니다. 새 집에는 수조가 없고, 통은 싱크대 옆에 놓입니다.','좁은 물에 배설물이 쌓이며 하루 만에 물이 탁해집니다. {n}은 통 벽을 따라 돌다 몸을 돌릴 때마다 지느러미가 벽에 눌려 접힙니다.','암모니아에 아가미 새엽이 부어 {n}은 수면에 입을 대고 있습니다.','나흘째 통의 물은 노랗고, {n}은 통 바닥에 옆으로 누워 있습니다.'],
  after:'두 사람은 각자 상대에게 그 일을 알리지 않았습니다.'}});

/* EV-OWB-44 폐업 (출처 없음 → likely) */
fev([{id:'OWB-44',stage:'home',tier:'likely',own:['decor','shared','staff','touch','bait'],once:1,w:.4,
  log:'가게가 문을 닫게 되었습니다.',
  p:'의자가 테이블 위로 올라가고, 벽의 그림이 떼어집니다. 낯선 사람들이 수조 앞에서 숫자를 적어 갑니다. 조명이 꺼지고 다음 날 아침에도 켜지지 않습니다. {n}은…',
  o:[
   {l:'숫자를 적는 사람 앞으로 나가 몸을 길게 편다',chk:['c',60],
    ok:()=>isSp('arowana')?Object.assign({t:'압류 목록 맨 위에 "은룡 1"이 적혔습니다. 채권단 사장실 수조로 간 {n}은 그 회사에서 가장 비싼 물건이 되었습니다.'},owb_move('closure',{force:'decor',ride:'icebox'}))
      :owb_move('closure',{only:['decor','expert'],text:'{n}은 경매 목록에 "값나가는 물고기"로 올랐고, 새 주인이 데려갔습니다.'}),no:()=>owb44()},
   {l:'수조 안을 힘차게 돌며 움직인다',chk:['p',50],ok:()=>owb_move('closure',{only:['staff','casual'],text:'"얘 아직 살아 있네." 마지막 날 직원이 {n}을 데려갔습니다.'}),no:()=>owb44()},
   {l:'은신처에 가만히 있는다',ok:()=>owb44()}
  ]}]);
function owb44(){
  return owb_hold(55,'OWB-44-D',()=>owb_move('closure',{endLeft:'OWB-44-D',mul:isSp('@small')?{left:2}:isSp('@gold')?{relay:1.5}:undefined}),.1);
}
fevEnd({'OWB-44-D':{kind:'bad',cat:'버려짐',tier:'likely',fx:'f-bucket',pl:[[0,'폐업하며 버림']],
  l:['철거 업체 사람들이 수조 물을 양동이로 퍼서 배수구에 붓습니다. {n}은 바닥에 남은 물과 함께 양동이에 쏟아집니다.','양동이는 가게 앞 길가에 하룻밤 놓입니다. 밤사이 기온이 떨어지고 좁은 물속 산소가 줄어듭니다.','{n}은 양동이 벽에 몸을 붙인 채 수면에 입을 댑니다. 아가미 뚜껑이 점점 느리게 움직이다 멈춥니다.','아침 수거 차량이 양동이를 비웁니다.'],after:false}});

/* [출처: 하수관 내 저산소·황화수소 환경] */
fev([{id:'OWB-45',stage:'home',tier:'fact',cd:60,w:()=>S.interest<.3?(isKind('casual','eager','gift','content','unbox')?2:1):.06,
  p:'수조 앞을 지나는 발걸음이 빨라졌습니다. 먹이는 가끔 떨어지고, 휴대폰 카메라가 수조를 한 번 찍고 사라집니다. 며칠 뒤 그물이 내려옵니다. {n}은…',
  o:[
   {l:'사진을 찍을 때 렌즈 앞에서 지느러미를 활짝 편다',chk:['c',50],ok:()=>owb45({bonus:2,drop:['flush','river']}),no:()=>owb45({})},
   {l:'그물을 피해 수조 안을 돈다',chk:['p',40],ok:{t:'그물질이 귀찮아진 주인은 "다음에 하자"며 그물을 내려놓았습니다.',c:'sub',fx:{i:.08}},no:()=>owb45({})},
   {l:'바닥에 가만히 있는다',ok:()=>owb45({})}
  ]}]);
function owb45(o){
  if(isSp('@big'))return owb_move('oversize',Object.assign({},o,{text:'판매글을 본 사람들은 {n}의 크기를 묻고는 연락을 끊었습니다. 결국 한 사람이 데려갔습니다.'}));
  return owb_move('bored',Object.assign({endFlush:'OWB-45-D'},o));
}
fevEnd({'OWB-45-D':{kind:'bad',cat:'학대',tier:'fact',fx:'f-toilet',pl:[[0,'산 채로 변기에 버림']],fact:'fFlush',
  l:['변기 물이 소용돌이치며 {n}을 배수구 쪽으로 끌어당깁니다. {n}은 물살 반대 방향으로 꼬리를 칩니다.','좁은 배수관 굽은 곳에서 몸이 도기 벽에 부딪혀 비늘과 점막이 벗겨집니다.','관을 지난 물은 정화조와 하수관의 물과 섞입니다. 그 물에는 산소가 거의 없고 암모니아와 황화수소가 많습니다.','{n}은 어두운 물속에서 아가미 뚜껑을 크게 몇 번 열다 멈춥니다.']}});

/* [출처: 대형 관상어 하천 유기 사례 / 앨리게이터가아 국내 생태계교란 생물 지정 여부·연도·방류 처벌 규정]
   a tropical giant released in the cold months gets no check */
fev([{id:'OWB-46',stage:'home',tier:'fact',sp:['@big','bichir'],cd:80,w:()=>S.f.len>=fx_().cm*.6||tankL()<fx_().minL*.5?1:.12,
  p:'수조 안에서 몸을 돌리면 꼬리가 유리에 닿습니다. 주인이 수조 사진을 들고 여러 가게를 다녀옵니다. 돌아온 주인은 오래 수조 앞에 앉아 있습니다. {n}은…',
  o:[
   {l:'주인 얼굴 앞에 머물며 손가락을 따라간다',chk:()=>['c',isSp('oscar')?54:60],
    ok:()=>R()<.4?{t:'주인은 그 주말 거실 벽을 재고, 더 큰 수조를 주문했습니다.',c:'good',fx:{i:.2},run:()=>{S.f.outgrown=0;S.f.tank=(TANKS.filter(t=>t.k!=='pond'&&t.L>=fx_().minL)[0]||TANKS.filter(t=>t.k!=='pond').slice(-1)[0]).k}}
      :owb46({mul:{expert:2},drop:['river'],text:'주인은 대형어 동호회에 글을 올렸고, 큰 수조를 가진 사람이 {n}을 데려갔습니다.'}),
    no:()=>owb46({})},
   {l:'수조 안에서 몸을 크게 뒤척여 힘을 보인다',chk:['p',70],ok:()=>owb46({force:'decor',text:'"볼거리가 되겠네요." 대형어를 둔 식당 사장이 {n}을 데려갔습니다.'}),
    no:()=>Object.assign({},owb46({}),isSp('motoro')?{t:'뒤척이던 {n}의 꼬리가 수조에 손을 넣은 주인 손등을 스쳤습니다. 주인은 그날 병원에 갔습니다.'}:{t:'뒤척이던 {n}의 몸에 히터가 부딪혀 유리관에 금이 갔습니다.',set:{heater_crack:1}})},
   {l:'바닥에 몸을 붙이고 가만히 있는다',ok:()=>owb46({})}
  ]}]);
function owb46(o){
  const cold=['autumn','winter'].includes(season())&&isSp('oscar','arowana','motoro','pleco');
  return owb_move('oversize',Object.assign({endRiver:'OWB-46-D',endRiverIf:()=>cold,riverText:'수족관 세 곳이 {n}을 받지 않았습니다. 주인은 밤에 다리 아래로 내려가 대야를 기울였습니다.'},o));
}
fevEnd({'OWB-46-D':{kind:'bad',cat:'방생',tier:'fact',fx:'f-ice',pl:[[5,'커지자 하천에 버림']],fact:'fRelease',
  l:['주인은 밤에 다리 아래로 내려가 대야를 기울입니다. 11월의 강물은 {n}이 살던 물보다 훨씬 차갑습니다.','{n}은 강바닥 쪽으로 헤엄쳐 내려갑니다. 수온이 내려가며 근육의 움직임이 느려지고 지느러미가 몸에 붙습니다.','몸이 옆으로 기울고, 물살이 {n}을 하류 쪽 바위로 밀어붙입니다. 바위에 쓸린 옆구리에서 비늘이 떨어지고 그 아래 피부가 드러납니다.','며칠 뒤 하류 보에 걸린 큰 물고기 사진이 지역 커뮤니티에 올라옵니다.']}});

/* [출처: 수온·수질 급변(온도 쇼크·pH 쇼크)과 물맞춤 권고] — the last step of every owner change (owb_rehome runs it) */
fev([{id:'OWB-47',stage:'home',tier:'fact',need:{owb_new:1},cd:3,w:5,
  p:'봉지가 새 수조 수면 위에 놓입니다. 봉지 밖 물빛과 냄새가 지금까지와 다릅니다. 봉지 입구가 열리고, 봉지가 천천히 기울어지기 시작합니다. {n}은…',
  o:[
   {l:'봉지 입구 쪽으로 나가 새 물을 조금씩 맛본다',chk:['w',40],ok:()=>owb47(-10,0),no:()=>owb47(0,0)},
   {l:'봉지 안쪽 깊은 곳으로 물러난다',ok:()=>owb47(0,1)},
   {l:'봉지 바닥에 가만히 있는다',ok:()=>owb47(0,0)}
  ]}]);
function owb47(mod,back){
  setFl('owb_new',0);
  if(isKind('expert','learner','staff'))return {t:'새 주인은 봉지를 수면에 띄워 수온을 맞추고, 물을 조금씩 섞었습니다.',c:'good'};
  const s=season(),need=20+mod+(s==='summer'||s==='winter'?10:0)+(isSp('altum','neon','apisto')?15:0)+(isSp('@livebearer')?5:0)-(owb_cold()?10:0)+(isSp('@scaleless')&&fl('meds')?10:0);
  const dirty=fl('nh3')>=2?{wq:-10}:{};
  if(isSp('fig8')&&!S.f.waterOK)addFl('owb_fresh');
  return owb_hold(need,'OWB-47-D',{t:'봉지가 뒤집히며 {n}은 새 물로 쏟아졌습니다. 한동안 바닥에서 비스듬히 헤엄쳤지만 저녁이 되자 몸을 바로 세웠습니다.',c:'sub',fx:Object.assign({h:back?-3:-8,st:.08},dirty),set:back?{}:{inj_skin:1}},.1);
}
fevEnd({'OWB-47-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',pl:[[2,'봉지째 부음']],fact:'fTemp',
  l:['봉지가 뒤집히며 {n}은 온도가 크게 다른 물로 한 번에 쏟아집니다. 갑작스러운 온도 변화에 {n}의 몸이 경직되고 평형을 잃습니다.','삼투압과 pH가 다른 물이 아가미 새엽 상피를 자극해 점액이 과다하게 나옵니다. {n}은 수조 바닥을 비스듬히 미끄러지며 지느러미를 떱니다.','수면으로 올라가려 할 때마다 몸이 뒤집힙니다. 아가미를 덮은 점액 때문에 숨 쉬는 면이 줄어들고, {n}은 새 수조의 장식 뒤에 끼인 채 멈춥니다.','새 주인은 "적응 중인가 봐요"라고 판매자에게 메시지를 보냅니다.']}});
