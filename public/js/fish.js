/* ---------- fish life (관상어 데이, v0.9) ----------
   A fish does not start at the shop. Wild fish are born in a river and caught; bred fish are born
   on a farm and sorted. Both pass through holding, transport, quarantine and a shop tank before
   anyone signs a pledge. Then the owner decides the rest: tank size, filter, heater, lid, tankmates,
   water changes, what happens when the fish gets sick, too big, or boring.
   State lives in S.f. Data (species, shops, owners, diseases, choices, events) is in data/fish.js. */

const fx_=()=>FX[S.sp.id]||{};
const durLabel=m=>m<1?Math.max(1,Math.round(m*4.3))+'주':Math.round(m)+'개월';
const fishIs=k=>!!fx_()[k];
const season=()=>{const m=Math.floor(S.month)%12;return [11,0,1].includes(m)?'winter':m<5?'spring':m<8?'summer':'autumn'};
const ACTIVE_POOL=()=>SP.filter(s=>ACTIVE_GROUPS.includes(s.g));
const tankL=()=>tankOf(S.f.tank).L, tankLen=()=>tankOf(S.f.tank).len;
const mateCm=m=>m.cm*(m.grow?1:1);
function fLoad(){const f=S.f;return (f.len+f.mates.reduce((s,m)=>s+m.n*m.cm,0))/Math.max(.3,tankL())}
const fSameCount=()=>S.f.mates.filter(m=>m.id===S.sp.id).reduce((s,m)=>s+m.n,0);
const fHasMate=id=>S.f.mates.some(m=>m.id===id&&m.n>0);
const mateName=m=>m.feed?'먹이용 '+SP.find(s=>s.id===m.id).name:FX[m.id]?SP.find(s=>s.id===m.id).name:'물고기';
const mateFx=m=>FX[m.id]||{};
/* how fiercely this fish fights its own kind (females of the fighting species much less) */
const fTerr=id=>fbOf(id).terr*(['betta','wildbetta','apisto'].includes(id)&&(id!==S.sp.id||fem())?(id===S.sp.id?.4:.7):1);
const fEatable=()=>S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&m.cm<=S.f.len*Math.max(fbOf(S.sp.id).mouth,.05));
function fEatOne(){const e=fEatable();if(!e.length)return;const m=pick(e);m.n--;S.f.kills=(S.f.kills||0)+1;S.f.lastKill=m.id;S.f.mates=S.f.mates.filter(x=>x.n>0)}
/* biggest predator in the tank that could swallow us */
function fPredMate(){return S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&!m.feed&&m.cm*fbOf(m.id).mouth>=S.f.len).sort((a,b)=>b.cm-a.cm)[0]||null}
/* the worst bully in the tank: a hostile species big enough to chase us, or a nipper of any size */
function fBully(){return S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&!m.feed&&fbOf(m.id).hostile>0&&(m.cm>=S.f.len*.6||fbOf(m.id).nip)).sort((a,b)=>fbOf(b.id).hostile*b.n-fbOf(a.id).hostile*a.n)[0]||null}
function fMatePressure(){
  const f=S.f,x=fx_();let p=0;
  if(fPredMate()) p+=.35;
  if(x.longfin&&f.mates.some(m=>mateFx(m).nip&&m.id!==S.sp.id)) p+=.3;
  if(fSameCount()>0) p+=fTerr(S.sp.id)*.4;
  const bl=fBully();if(bl) p+=fbOf(bl.id).hostile*.3;
  if(f.mates.some(m=>m.id!==S.sp.id&&mateFx(m).aggro&&m.cm>=f.len)) p+=.15;
  if(f.mates.some(m=>m.id!==S.sp.id&&mateFx(m).big&&m.cm>f.len*2)) p+=.1;
  return clamp(p+(f.bully||0),0,1);
}

/* ---------- birth ---------- */
function fishInit(){
  const x=fx_(),sp=S.sp;
  S.f={wild:R()<x.pW,stage:'born',tank:'t60',mates:[],wq:85,len:0,stress:0,fin:0,ill:null,tankAge:0,cycled:1,filter:'없음',heater:0,lid:0,hides:0,waterOK:1,sand:0,
    nameLater:S.name,path:[]};
  S.name=null;S.disp=sp.name;S.preOwner=1;S.tank=null;
  /* a wild fish is born at 0 and caught months later (the capture step sets its age); arowana and clown loach fry are taken young */
  S.f.capAge=S.f.wild?clamp(sp.life*.06,.2,18):0;if(sp.id==='arowana') S.f.capAge=.15;if(sp.id==='clownloach') S.f.capAge=3;
  S.ageM=0;
  S.env=S.f.wild?'wildriver':'farm';S.status=S.f.wild?'야생':'양식장';
  S.origin=S.f.wild?x.region:x.farm;
  S.f.len=x.cm*.05;
}

/* ---------- the chain before any pledge ---------- */
function fishPrologue(){
  const x=fx_(),f=S.f;
  const steps=[];
  const step=(fn)=>steps.push(fn);
  const die=(p,key)=>R()<p*(f.odds&&f.odds[key]||1)*modeK('die')&&(fEnd(key),true);
  /* the fish's own moments on the way: a choice, then the step's odds */
  const ask=c=>q(null,null,()=>askChoice(c,()=>{}));
  f.odds={};f.preShop=wpick(x.shops);
  const grow=m=>{S.ageM+=m;S.month+=m;f.len=Math.max(f.len,x.cm*clamp(.05+S.ageM/(S.sp.life*.2),.05,x.start||.4))};
  if(f.wild){
    step(()=>{q(T(x.region+'. 그곳의 물에서 {n}이 태어났습니다.'),'neutral',()=>{S.env='wildriver'});q(null,null,next)});
    step(()=>{q(null,null,()=>{S.ageM=f.capAge;S.month+=f.capAge;f.len=x.cm*clamp(f.capAge/(S.sp.life*.2),.08,.8)});q(T(f.capAge>=1?'{n}은 그 물에서 '+josa(ageLabel(f.capAge),'을')+' 자랐습니다.':'{n}은 아직 손가락만 했습니다.'),'sub');
      /* the net comes first, the choice second; only a fish that did not get away is caught */
      q(T('채집꾼들이 그물을 들고 '+x.region+'에 들어왔습니다.'),'bad',()=>{S.status='채집 중';S.scaredT=3});
      ask(pSit('net'));
      q(null,null,()=>{
        if(f.escape){q(T('그물이 올라갔을 때, {n}은 거기 없었습니다.'),'good',()=>{S.status='강에서 삶';remember('그물이 지나갈 때까지 숨어 있었다. 그 물을 끝내 떠나지 않았다.',1.6)});
          q(T('같은 날 같은 물에서 태어난 형제들은 그날 밤 비행기에 실렸습니다.'),'sub');q(null,null,()=>fEnd('free'));return}
        q(T(x.catch||'{n}은 '+x.region+'에서 채집꾼의 그물에 걸렸습니다.'),'bad',()=>{S.env='catch';S.status='포획됨';f.path.push('포획')});
        q(null,null,()=>{if(!die(.03+.07*(1-x.hardy),'capture'))next()})})});
    step(()=>{q(T('{n}은 채집꾼 마을의 대야에서 중간상인에게, 중간상인에게서 수출업자에게 넘겨졌습니다. 주인이 바뀔 때마다 물도 바뀌었습니다.'),'sub',()=>{S.env='holding';S.status='중간 유통';grow(.6);f.path.push('중간상인')});
      q(T('출하 이틀 전부터 먹이가 끊겼습니다. 봉지 속 물을 덜 더럽히기 위해서입니다.'),'sub',()=>{S.health-=12});
      q(null,null,()=>{if(!die(.05+.13*(1-x.hardy),'holding'))next()})});
    step(()=>{q(T('{n}은 물이 반쯤 찬 비닐봉지에 산소와 함께 담겨 스티로폼 상자에 실렸습니다. 비행기 화물칸은 어둡고 추웠습니다.'),'sub',()=>{S.env='box';S.status='항공 운송';grow(.1);f.path.push('항공 운송')});
      ask(pSit('box'));
      q(null,null,()=>{if(!die(.03+.1*(1-x.hardy),'transport'))next()})});
    step(()=>{q(T('인천의 수입업체 검역 수조. 기생충을 잡는 약을 탄 물에서 {n}은 며칠을 보냈습니다.'),'sub',()=>{S.env='quarantine';S.status='수입 검역';grow(.4);f.path.push('수입 검역');
        if(R()<.6) f.carrier=S.sp.id==='clownloach'&&R()<.6?'skinny':'worms'});
      q(null,null,()=>{if(!die(.03+.08*(1-x.hardy)+(x.scaleless?.08:0),'quarantine'))next()})});
  } else {
    /* where it will be sold decides where it was born: fry shared by an acquaintance never saw a farm,
       a domestic breeder's fish is selected by the breeder and never goes through a wholesaler */
    const home=f.preShop==='friend'?'friend':f.preShop==='breeder'?'breeder':null;
    if(home==='friend'){
      step(()=>{q(T('{n}은 지인 집 수조에서 수십 마리 형제와 함께 태어났습니다. 어미는 그 집 주인이 몇 달 전 마트에서 사 온 한 쌍이었습니다.'),'neutral',()=>{S.env='farm';S.origin='지인 집 수조'});q(null,null,()=>{grow(clamp(S.sp.life*.04,1,4));next()})});
    } else {
    step(()=>{q(T(home==='breeder'?'{n}은 국내 한 브리더의 수조에서 태어났습니다. 어미와 아비는 브리더가 혈통을 보고 고른 한 쌍이었습니다.'
      :S.sp.id==='betta'?'{n}은 태국의 한 베타 농장에서 태어났습니다. 바닥에는 물이 담긴 유리병 수천 개가 줄지어 있었고, 다 자라면 {n}도 그중 한 병에 담길 차례였습니다.'
      :S.sp.id==='clownloach'?'양식장 사람들이 어미 로치에게 호르몬 주사를 놓았습니다. 그렇게 받아 낸 알에서 {n}이 깨어났습니다.'
      :S.sp.id==='gar'?'원산지에서 몰래 들여온 어미에게서, 아시아의 한 양식장이 치어를 받아 냈습니다. 그중 하나가 {n}이었습니다.'
      :'{n}은 '+x.farm+'에서 수천 개의 알 중 하나로 깨어났습니다.'),'neutral',()=>{S.env='farm'});q(null,null,next)});
    if(x.cull) step(()=>{q(T(home==='breeder'?'브리더가 치어를 한 마리씩 떠서 지느러미와 몸 모양을 살폈습니다.':S.sp.id==='betta'?'선별 작업자가 병을 하나씩 들어 불빛에 비춰 보았습니다.':S.sp.id==='koi'?'양식장 사람들이 치어를 체에 걸러 무늬를 하나씩 살폈습니다.':'양식장 사람들이 치어를 체에 걸러 지느러미와 몸 모양을 하나씩 살폈습니다.'),'sub',()=>{grow(1.5);f.path.push('선별')});
      ask(pSit('sieve'));
      q(null,null,()=>{if(R()<x.cull*(f.odds.cull||1)){fEnd('cull');return}q(T('{n}은 "팔 수 있는" 쪽에 남았습니다.'),'sub');next()})});
    if(!home) step(()=>{const bot=S.sp.id==='betta';
      q(T(bot?'{n}은 손바닥만 한 병에 혼자 담겼습니다. 출하 전 며칠은 먹이가 없었습니다. 작업자 말로는 봉지 안에서 꼬리를 물어뜯지 않게 물에 진정제를 탄다고 합니다.':'출하 전 이틀 동안 먹이가 끊겼습니다. {n}은 수십 마리와 함께 비닐봉지에 담겼습니다.'),'sub',()=>{S.env=bot?'bottles':'box';S.status='출하';S.health-=8;grow(clamp(S.sp.life*.04,1,5));f.path.push(bot?'병 사육':'출하')});
      if(!bot) ask(pSit('box'));
      q(null,null,()=>{if(!die(.02+.06*(1-x.hardy),'transport'))next()})});
    if(!home) step(()=>{q(T('도매상 수조에서 {n}은 다른 양식장에서 온 물고기들과 같은 물을 나눠 썼습니다.'),'sub',()=>{S.env='quarantine';S.status='도매';grow(.3);f.path.push('도매');if(R()<.3)f.carrier=pick(['ich','ich','velvet',S.sp.id==='guppy'||S.sp.id==='platy'?'tetra':'finrot'])});
      q(null,null,()=>{if(!die(.02+.05*(1-x.hardy),'quarantine'))next()})});
    }
  }
  /* the shop */
  step(()=>{
    let shop=f.preShop||wpick(x.shops);
    f.shop=shop;const sh=FSHOP[shop];
    if(shop==='breeder'||shop==='friend'){S.origin=sh.l;f.path.push(sh.l);q(T(shop==='friend'?(f.wild?'{n}을 사 온 지인이 "필요한 사람 가져가세요" 글을 올렸습니다. 어항이 생각보다 작았다고 했습니다.':'지인이 "치어 많이 태어났어요, 필요한 사람 가져가세요" 글을 올렸습니다. {n}은 그 형제들 중 한 마리였습니다.'):'{n}은 국내 브리더의 수조에서 분양 날짜를 기다렸습니다.'),'sub',()=>{S.env='shop'});q(null,null,next);return}
    if(shop==='fair'){fairStall();return}
    S.origin=sh.l;f.path.push(sh.l);
    q(T(shop==='mart'&&(x.cm>=25||f.wild)?'{n}은 대형마트 수족관 코너 끝 수조에 "이색 열대어"라는 이름표와 함께 넣어졌습니다. 다 자란 크기는 적혀 있지 않았습니다.':shop==='mart'?'{n}은 대형마트 수족관 코너의 작은 수조에 "특가" 가격표와 함께 넣어졌습니다. 같은 수조에 수십 마리가 있었습니다.'
      :shop==='fair'?'{n}은 축제장의 얕은 수조에서 종이 뜰채에 쫓겼습니다. 한 번에 천 원이었습니다.'
      :shop==='vase'?'{n}은 꽃집 진열대의 꽃병에 담겼습니다. 꽃병 위에는 식물이 꽂혀 수면을 덮고 있었습니다.'
      :shop==='online'?'{n}은 판매 사이트 사진 속 한 마리가 되었습니다. "생물 택배 가능, 도착 후 사망 시 사진 필수".'
      :shop==='bigshop'?'{n}은 대형어 전문 숍 수조에 들어갔습니다. 가격표에는 다 자란 크기가 적혀 있지 않았습니다.'
      :'{n}은 수족관 전문점 판매 수조에 들어갔습니다.'),'sub',()=>{S.env='shop';S.status='판매 중';S.ageM+=.5;S.month+=.5;if(shop==='mart'&&R()<.3&&!f.carrier)f.carrier='ich'});
    if(!['fair','vase'].includes(shop)) ask(pSit('shop'));
    q(null,null,()=>{if(!die((.02+.06*(1-x.hardy))*(shop==='mart'||shop==='fair'?1.6:1),'shop')&&!fShopFate())next()});
  });
  /* goldfish sold by the kilo to a night market's scooping game: a few nights in a plastic pool, then a child's bag,
     or whatever the vendor does with the leftovers when the market closes */
  function fairStall(){
    S.origin=FSHOP.fair.l;f.path.push('야시장 뜰채 체험');
    q(T('{n}은 킬로그램 단위로 달아 파는 "먹이용 금붕어" 상자에 담겨 야시장 상인에게 넘겨졌습니다. 한 상자에 수백 마리였습니다.'),'sub',()=>{S.env='box';S.status='야시장 상인'});
    q(T('해가 지자 천막 아래 얕은 플라스틱 풀에 물이 채워졌습니다. 전구 줄이 켜지고 "금붕어 뜰채 체험 · 한 판 3,000원" 간판이 걸렸습니다.'),'sub',()=>{S.env='stall';S.status='뜰채 체험장';S.ageM+=.2;S.month+=.2});
    let night=0;
    const nightStep=()=>{night++;
      ask({who:'뜰채 체험장에서',p:night===1?'종이 뜰채가 물을 가르며 내려온다. 풀 가장자리에 손들이 빼곡하다. 나는…':'또 밤이 왔다. 물은 어제보다 탁하고 미지근하다. 종이 뜰채가 내려온다. 나는…',o:[
        {l:'뜰채 가장자리로 빠져나간다',d:'오늘 밤은 넘긴다',r:'{n}은 뜰채 가장자리를 스치고 빠져나갔습니다. 젖은 종이가 찢어졌습니다.',c:'neutral',fx:()=>{f.dodge=1}},
        {l:'다른 금붕어들 밑으로 숨는다',r:'{n}은 무리 아래로 파고들었습니다.',c:'neutral',fx:()=>{f.dodge=R()<.7?1:0}},
        {l:'가만히 있는다',d:'누군가의 봉지로',r:'{n}은 움직이지 않았습니다. 종이 뜰채가 {n}을 떠 올렸습니다.',c:'neutral',fx:()=>{f.dodge=0}}]});
      q(null,null,()=>{
        if(R()<.06+(season()==='summer'?.06:0)+night*.02){fEnd('stall');return}
        if(!f.dodge){
          if(R()<.25){q(T('종이 뜰채가 중간에 찢어졌습니다. {n}은 아스팔트 바닥에 떨어져 퍼덕였고, 누군가 맨손으로 집어 풀에 다시 던졌습니다.'),'bad',()=>{S.health-=12;f.fin+=.1})}
          else{q(null,null,next);return}
        }
        if(night>=3){
          q(T('야시장 마지막 날 밤. 손님이 빠지자 상인이 풀에 남은 금붕어들을 내려다보았습니다.'),'sub');
          q(null,null,()=>{const o=wpick([['stream',35],['feeder',35],['trash',30]]);
            if(o==='stream'){q(T('상인은 남은 금붕어들을 양동이째 근처 하천에 쏟았습니다. "살 놈은 살겠지."'),'bad');q(null,null,()=>{f.released=1;f.len=Math.max(f.len,3);goWild('river')})}
            else if(o==='feeder'){q(T('남은 금붕어들은 "먹이용"으로 수족관에 헐값에 넘겨졌습니다.'),'bad');q(null,null,()=>fEnd('feeder',pick(['oscar','arowana','channa','bichir'])))}
            else fEnd('stalltrash')});
          return;
        }
        q(T(pick(['다음 날 밤, 풀의 물은 갈리지 않았습니다. 밤사이 떠오른 금붕어 몇 마리를 상인이 뜰채로 걷어 냈습니다.','한낮 햇볕을 받은 풀의 물은 미지근했습니다. 상인은 얼음 몇 덩이를 띄웠습니다.','손님들이 풀 가장자리에서 맥주를 쏟았습니다. 상인은 신경 쓰지 않았습니다.'])),'bad',()=>{S.health-=6;S.ageM+=.03;S.month+=.03});
        q(null,null,nightStep);
      });
    };
    nightStep();
  }
  /* the buyer */
  step(()=>{fishBuy()});
  let i=0;function next(){if(S.ending)return;const s=steps[i++];if(s)s()}
  next();
}

/* the sales tank: mixed tankmates, and the fish nobody picks */
function fShopFate(){
  const f=S.f,x=fx_(),shop=f.shop,me=S.sp.id;
  if(!['mart','shop','bigshop'].includes(shop)) return false;
  const eaters=(shop==='bigshop'?['arowana','channa','gar','bichir','oscar']:['altum','oscar','bichir']).filter(p=>p!==me);
  const small=f.len<=Math.min(6,x.cm*.6);
  if(small&&R()<(shop==='mart'?.03:shop==='bigshop'?.04:.015)){fEnd('shopmate',pick(eaters));return true}
  if(x.longfin&&shop!=='bigshop'&&R()<.02){fEnd('shopnip',pick(['peapuffer','fig8'].filter(p=>p!==me)));return true}
  const slow=(f.shopMood==='hide'?1.8:f.shopMood==='front'?.3:1)*(.01+(x.big?.025:0)+(f.carrier?.015:0)+(f.wild&&x.picky?.025:0)+(x.cm>=30?.01:0));
  if(R()<slow){
    if(shop!=='mart'&&x.cm<=25&&R()<.45){fEnd('unsoldfeed',pick(['arowana','channa','oscar','bichir'].filter(p=>p!==me)));return true}
    fEnd('unsold');return true}
  return false;
}

/* ---------- the owner arrives ---------- */
function fishBuy(){
  const f=S.f,x=fx_(),sh=FSHOP[f.shop];
  const fitOwn=(k,w)=>k==='content'&&!(x.big||x.pred||x.cm>=25)?0:['breeder','mill'].includes(k)&&!(x.breedEasy||['betta','wildbetta','apisto','oranda','ryukin','koi','cory','altum','peapuffer'].includes(S.sp.id))?0:w;
  /* in story mode the signer is more often the kind who tries */
  const own=wpick(sh.own.map(([k,w])=>[k,fitOwn(k,w)*(S.mode==='story'?({learner:1.8,expert:1.2,casual:.6,gift:.5}[k]||1):1)]).map(([k,w])=>[k,f.shopMood==='hide'?(['expert','learner','breeder'].includes(k)?w*1.6:w*.6):f.shopMood==='front'?(['casual','gift'].includes(k)?w*1.25:w):f.shopMood==='friendly'?(k==='learner'?w*1.5:w):f.shopMood==='show'?(k==='content'?w*3:k==='casual'?w*1.3:w):w]));
  setupOwner(own);
  S.preOwner=0;f.buyAge=S.ageM;f.firstOwn=own;
  fAdvice(own,f.shop);
  const shipLeg=sh.ship;
  q(T(own==='gift'&&f.shop==='fair'?'아이가 종이 뜰채로 {n}을 건져 올렸습니다. {n}은 손바닥만 한 비닐봉지에 담겼습니다.'
     :own==='gift'&&f.shop==='vase'?'{n}이 담긴 꽃병은 생일 선물로 포장되었습니다.'
     :(typeof KINTRO!=='undefined'&&S.f.kind&&KINTRO[S.f.kind]?KINTRO[S.f.kind]():null)||{expert:S.o.name+' 님은 수조 앞에 한참 서서 지느러미와 아가미를 하나하나 살펴본 물생활 고수였습니다.',learner:S.o.name+' 님은 휴대폰으로 사육법을 검색하며 수조 앞을 오래 서성이던 초보였습니다.',casual:S.o.name+' 님은 "이거 예쁘다" 한마디에 바로 결제한 사람이었습니다.',breeder:S.o.name+' 님은 번식시킬 짝을 찾던 사람이었습니다.',content:S.o.name+' 님은 "다 크면 얼마나 커져요?"부터 물어본 대형어 영상 채널 운영자였습니다.',gift:'{n}은 선물용 봉지에 담겨 포장되었습니다. 선물을 받은 사람은 '+S.o.name+' 님이었습니다.',mill:S.o.name+' 님은 "암컷 열, 수컷 다섯"을 한 번에 주문한 번식장 운영자였습니다.'}[own]),'neutral',()=>{S.status=shipLeg?'택배 이동 중':'집';drawPledges($('gamePledges'),true);render()});
  if(f.shop==='fair') q(T('{n}이 담긴 봉지는 아이 손에 들려 몇 시간 동안 야시장을 돌았습니다. 봉지 속 물은 손바닥 한 줌이었습니다.'),'bad'),q(null,null,()=>{if(R()<.15){S.preOwner=1;fEnd('fairbag');return}arrive()});
  else if(shipLeg) q(T('{n}은 비닐봉지째 택배 상자에 담겼습니다. 상자에는 "생물"이라는 스티커가 붙었습니다.'),'sub',()=>{S.env='box'}),
    q(null,null,()=>{const hot=season()==='summer',cold=season()==='winter';if(R()<(.02+.06*(1-x.hardy))*(hot||cold?2.5:1)){S.preOwner=1;f.shipHot=hot;fEnd('delivery');return}arrive()});
  else q(null,null,arrive);
  function arrive(){
    const t=tankOf(f.tank);
    if(f.nameLater){S.name=f.nameLater;S.disp=S.name}
    /* the pledge is signed first; what was already wrong that day is struck on the sheet once the fish is in the water */
    q(T('서약인 '+S.o.name+' 님이 서약서에 서명했습니다. 오늘부터 {n}의 주인입니다.'),'neutral');
    q(T(S.name?S.o.name+' 님은 {n}에게 이름을 붙여 주었습니다. "'+S.name+'".':S.o.name+' 님은 {n}에게 이름을 붙이지 않았습니다.'),S.name?'good':'sub',()=>{S.env=f.tank==='pond'?'pond':'tank';S.status='집';if(S.name)remember('이름이 생겼다. "'+S.name+'".',1.1);render()});
    q(T('{n}의 집은 '+fTankLine()),'sub');
    const acc=S.f.own==='expert'||S.f.own==='breeder'?'주인은 봉지를 수면에 30분 띄워 온도를 맞추고, 물을 조금씩 섞은 뒤에 {n}을 옮겼습니다.':R()<.5?'주인은 봉지를 그대로 수조에 쏟았습니다. '+(S.f.shop==='friend'?'지인 집 물':S.f.shop==='breeder'?'브리더의 물':S.f.shop==='online'?'택배 상자 속 물':S.f.shop==='fair'?'축제장 물':'가게 물')+'과 집 물의 온도가 달랐습니다.':'주인은 봉지를 잠깐 띄웠다가 {n}을 뜰채로 옮겼습니다.';
    q(T(acc),'sub',()=>{if(/쏟/.test(acc)){f.coldShock=1;f.stress+=.15}fSignCheck(/쏟/.test(acc))});
    if(!f.cycled) q(T('수조는 오늘 처음 물을 채운 새것이었습니다.'),'bad');
    if(f.carrier) q(null,null,()=>{});
  }
}
/* the day of signing: what the owner already got wrong is marked on the sheet at once */
function fSignCheck(dumped){
  const f=S.f,x=fx_(),L=tankOf(f.tank).L;
  if(!f.cycled) breakP(2,'물잡이 없이 바로 넣음');
  if(L<x.minL*.5) breakP(2,x.minL>=5000?'집 수조로는 다 키울 수 없는 종을 들임':'다 크면 '+x.minL+'L 넘게 필요한데 '+(L>=1?L+'L':'컵만 한')+' 수조에 넣음');
  if(x.temp==='trop'&&!f.heater&&f.tank!=='pond') breakP(2,'열대어인데 히터 없음');
  if(!f.waterOK) breakP(2,x.water==='brack'?'기수어인데 민물에 넣음':x.water==='soft'?'약산성 연수를 맞추지 않음':'경수를 맞추지 않음');
  if(x.social==='school'&&fSameCount()+1<5) breakP(2,'무리 지어 사는 종을 '+(fSameCount()+1)+'마리만 들임');
  if(dumped) breakP(2,'물맞춤 없이 봉지째 쏟음');
  if(fLoad()>1.3) breakP(2,'처음부터 과밀 수조');
  if(f.tank!=='pond'&&!f.lid&&((x.jump||0)>=.3||x.escape)) breakP(3,'잘 뛰는 물고기인데 뚜껑 없음');
  if(fPredMate()) breakP(3,'입에 들어갈 만큼 작은 채로 육식어와 합사');
}
/* which filter an owner puts on which tank. Small tanks get hang-on and sponge filters, goldfish people like top
   filters, big tanks get canisters and sumps, breeders use sponges (fry are not sucked in), careless owners skip it */
function fPickFilter(k,own){
  const L=tankOf(k).L,sk=S.r,gold=isGold()||S.sp.id==='koi';
  if(k==='pond') return '연못 여과기';
  if(['cup','vase'].includes(k)) return '없음';
  if(k==='bowl') return own==='gift'||R()<.7?'없음':'스펀지 여과기';
  if(own==='breeder') return wpick([['스펀지 여과기',6],['측면 여과기',1],['상면 여과기',gold?2:0]]);
  if(L<=27) return wpick([['걸이식 여과기',4],['스펀지 여과기',3],['측면 여과기',2],['없음',sk<.35?4:sk<.5?1:0]]);
  if(L<=64) return wpick([['걸이식 여과기',3],['상면 여과기',gold?4:2],['스펀지 여과기',2],['저면 여과기',sk<.5?2:.5],['외부 여과기',sk>.75?4:.6],['측면 여과기',1],['없음',sk<.3?2:0]]);
  return wpick([['상면 여과기',gold?4:2],['외부 여과기',sk>.6?5:1.5],['섬프 여과기',L>=300&&sk>.6?4:L>=300?1:0],['걸이식 여과기',sk<.5?1.5:.3],['저면 여과기',sk<.5?.8:0]]);
}
/* who the owner is and what tank they set up */
function setupOwner(own){
  const f=S.f,x=fx_(),sk=FOWN[own].skill;
  f.own=own;S.r=sk[0]+R()*(sk[1]-sk[0]);S.interest=1;
  /* some owners learn fast: they start badly and fix one thing after another (see fLearn) */
  f.grow=R()<({learner:.8,casual:.14,gift:.07,content:.15,breeder:.2}[own]||0)?1:0;f.lessons=0;
  /* some who could learn do not bother: they know the fix and put it off (see fMistake, fLearn) */
  f.lazy=f.grow&&R()<({learner:.35,casual:.55,gift:.6,content:.3,breeder:.2}[own]||0)?1:0;f.learnt={};f.mist={};
  f.trainAt=S.tick+2+Math.floor(R()*3);fst();
  fSetupTank(own);
  fSetupMates(own);
}
/* an owner who learns: notices the worst problem in the tank, looks it up and fixes it the same week */
function fLearn(m){
  const f=S.f,x=fx_(),own=f.own,L=tankL(),FI=filtOf(f.filter);
  if(!f.grow||S.preOwner||S.cd.learn>S.tick||R()>(own==='learner'?.65:.45)*Math.min(1,m*1.5)) return false;
  const fixes=[
    [!f.testKit&&(f.wq<45||(!f.cycled&&f.tankAge<2)),()=>{say('"물이 왜 이렇게 뿌옇지?" 밤새 검색하던 주인이 "물잡이"라는 말을 처음 알았습니다. 다음 날 수질 테스트 키트와 박테리아제를 사 왔습니다.','good');f.wq+=22;f.testKit=1;S.interest+=.1}],
    [f.testKit&&f.wq<40,()=>{say('주인이 테스트 키트 색을 보고 바로 물을 3분의 1 갈았습니다. 다음 날 한 번 더 갈았습니다.','good');f.wq+=20}],
    [fLoad()>1.2&&f.mates.some(m=>m.n>1&&m.id!==S.sp.id),()=>{const m=f.mates.filter(m=>m.id!==S.sp.id&&m.n>1).sort((a,b)=>b.n*b.cm-a.n*a.cm)[0];const k=Math.ceil(m.n/2);m.n-=k;say('"과밀이 문제구나." 주인은 '+mateName(m)+' '+k+'마리를 물생활 카페 회원에게 분양 보냈습니다. 수조가 한결 넓어졌습니다.','good');f.stress-=.1}],
    [L<x.minL*.6&&f.tank!=='pond'&&TANKS.some(t=>t.k!=='pond'&&t.L>L),()=>{const up=TANKS.filter(t=>t.k!=='pond'&&t.L>L&&t.L>=Math.min(x.minL,1620))[0]||TANKS.filter(t=>t.k!=='pond'&&t.L>L).slice(-1)[0];
      say('"다 크면 '+x.cm+'cm라고?" 주인은 {n}이 얼마나 자라는지 처음 찾아보았습니다.','sub');f.grow=2;fUpgrade(up,'주인은 '+josa(up.l,'을')+' 들였습니다. {n}이 몸을 다 펴고 헤엄쳤습니다.',true)}],
    [f.tank!=='pond'&&FI.k>=.8&&(f.wq<60||fLoad()>.9),()=>{const nf=L>=64?'외부 여과기':L>=27?'측면 여과기':'걸이식 여과기';say('"여과력이 모자라구나." 주인은 '+josa(f.filter==='없음'?'빈자리':f.filter,'을')+' 떼고 '+josa(nf,'을')+' 달았습니다. 옛 여과재는 새 여과기 안에 넣었습니다.','good');f.filter=nf;f.wq+=10}],
    [x.temp==='trop'&&!f.heater&&f.tank!=='pond',()=>{say('"열대어는 히터가 있어야 한대." 주인은 그날 바로 히터와 수온계를 주문했습니다.','good');f.heater=1;f.coldShock=0}],
    [!f.waterOK&&x.water!=='any',()=>{say(x.water==='brack'?'"기수어는 소금이 필요하다." 주인은 해수염과 비중계를 사서 조금씩 염도를 올렸습니다.':'"수질도 맞춰야 하는구나." 주인은 pH를 재고 물을 '+(x.water==='soft'?'약산성 연수로':'경수로')+' 천천히 바꿔 나갔습니다.','good');f.waterOK=1}],
    [x.social==='school'&&fSameCount()<4&&L>=27,()=>{const n=5-fSameCount();say('"무리 지어 사는 물고기구나." 주인은 같은 종 '+n+'마리를 따로 2주 검역한 뒤 넣어 주었습니다.','good');const mm=f.mates.find(m=>m.id===S.sp.id);if(mm)mm.n+=n;else f.mates.push({id:S.sp.id,n,cm:x.cm*.5});remember('같은 무늬의 물고기들이 왔다. 무리가 생겼다.',1.4)}],
    [!!fPredMate(),()=>{const p=fPredMate();say('"'+mateName(p)+'는 작은 물고기를 먹는구나." 주인은 '+josa(mateName(p),'을')+' 다른 수조로 옮겼습니다.','good');p.n=0}],
    [!f.lid&&f.tank!=='pond'&&((x.jump||0)>=.3||x.escape||f.cat),()=>{say(f.lidShift?'주인이 한쪽으로 밀려난 뚜껑을 발견하고 제자리에 닫았습니다. 그 뒤로 뚜껑 위에는 아무것도 올리지 않았습니다.':'"물고기가 뛰쳐나와 죽는 일이 흔하대." 주인은 수조 크기에 맞춰 뚜껑을 맞췄습니다.','good');f.lid=1;f.lidShift=0}],
    [FI.flow>.45&&(x.longfin||x.cm<5),()=>{say('주인은 출수구에 스펀지를 씌워 물살을 죽였습니다. "지느러미가 긴 애들은 센 물살이 힘들대."','good');f.stress-=.06}],
    [!f.hides,()=>{say(f.tank==='pond'?'"왜가리를 피할 곳이 있어야 한대." 주인은 연못 바닥에 굵은 토관과 수련을 넣어 주었습니다.':'"숨을 곳이 있어야 스트레스를 덜 받는대." 주인은 유목과 수초를 넣어 주었습니다.','good');f.hides=1;f.stress-=.05}],
    [f.tank==='pond'&&!f.net,()=>{say('"왜가리가 연못 물고기를 다 잡아간대." 주인은 연못 위에 그물을 쳤습니다.','good');f.net=1}],
    [!!f.pumpOff,()=>{say('주인은 에어펌프를 끄면 안 된다는 걸 알고, 조용한 펌프로 바꿔 다시 켜 두었습니다.','good');f.pumpOff=0}],
    [!!f.leak&&f.tank!=='pond',()=>{say('주인은 수평계를 대 보고서야 받침이 기운 걸 알았습니다. 받침을 바로잡았습니다.','good');f.leak=0}],
  ];
  const fx=fixes.find((z,i)=>z[0]&&!(f.learned&&f.learned[i]>S.tick));if(!fx)return false;
  if(f.lazy&&R()<.72){S.cd.learn=S.tick+3;
    /* v0.12: said at most every ~25 ticks, and not the same line twice in a row */
    if(R()<.5&&!(f.lazySaid>S.tick)){const L=['주인은 무엇을 고쳐야 하는지 알고 있었습니다. 귀찮아서 다음 주로 미뤘습니다.','"주말에 해야지." 주말은 세 번 지나갔습니다.','주인은 해야 할 일을 메모장에 적었습니다. 메모장은 거기까지였습니다.','주인은 장바구니에 필요한 것을 담아 두었습니다. 결제는 하지 않았습니다.','"이번 달만 지나면." 주인은 지난달에도 그렇게 말했습니다.'].filter(x=>x!==f.lazyLast);f.lazyLast=pick(L);f.lazySaid=S.tick+25;say(f.lazyLast,'bad')}return false}
  (f.learned=f.learned||{})[fixes.indexOf(fx)]=S.tick+12;
  S.cd.learn=S.tick+(own==='learner'?2:3);fx[1]();f.lessons++;S.r=clamp(S.r+.035*persK('learn'),0,.97);S.interest=clamp(S.interest+.05,0,1);
  if(own==='casual'&&f.lessons>=2){f.own='learner';say('대충 키우던 주인이 물생활 카페에 가입했습니다. 첫 글의 제목은 "초보인데 물고기가 자꾸 아파요"였습니다.','sub')}
  else if(own==='gift'&&f.lessons>=2){f.own='learner';say('경품으로 받은 금붕어 때문에 시작한 공부가, 어느새 취미가 되었습니다.','sub')}
  else if(own==='learner'&&f.lessons>=4&&f.lazy&&!f.lazyKnow){f.lazyKnow=1;say('주인은 이제 무엇이 문제인지 다 알았습니다. 하지 않았을 뿐입니다.','bad')}
  else if(own==='learner'&&f.lessons>=4&&!f.lazy){f.own='expert';S.r=Math.max(S.r,.82);say('주인은 이제 물생활 카페에서 질문보다 답을 더 많이 다는 사람이 되었습니다.','good');remember('주인의 손길이 달라졌다. 물이 늘 맑았다.',1.3)}
  f.wq=clamp(f.wq,0,100);f.stress=clamp(f.stress,0,1.2);render();return true;
}
function fSetupTank(own){
  const f=S.f,x=fx_();
  const fit=k=>tankOf(k).L>=x.minL*1.05;
  let k;
  if(own==='gift') k=f.shop==='vase'?(R()<.7?'vase':'cup'):wpick([['bowl',6],['t20',3],['cup',1]]);
  else if(own==='casual') k=x.big&&f.shop==='bigshop'?wpick([['t60',4],['t90',3],['t120',1]]):wpick([['bowl',3],['t20',2],['t30',3],['t45',2],['t60',1]]);
  else if(own==='learner'){/* a learner looks up the adult size first; for a giant it still often ends up short */
    const need=Math.min(x.minL*.5,650);k=wpick(TANKS.filter(t=>!['cup','vase','bowl','t20','pond'].includes(t.k)&&t.L>=need*.8).slice(0,3).map((t,i)=>[t.k,[5,3,1][i]]));if(!k)k='t60'}
  else if(own==='breeder') k=wpick([['t45',4],['t60',5]]);
  else if(own==='mill') k=wpick([['t30',3],['t45',5]]);
  else if(own==='content') k=wpick([['t120',3],['t180',3],['t240',2]]);
  else { // expert: the smallest tank that fits the adult; koi go to a pond
    k=x.pond?'pond':(TANKS.filter(t=>t.k!=='pond'&&t.L>=x.minL*1.1)[0]||tankOf('t240')).k;
    if(!x.big&&tankOf(k).L<64) k='t60';
  }
  if(S.sp.id==='koi'&&own!=='gift'&&own!=='casual'&&R()<.6) k='pond';
  f.tank=k;
  const sk=S.r, tiny=['cup','vase','bowl'].includes(k);
  f.filter=fPickFilter(k,own);
  f.heater=x.temp==='trop'||x.temp==='warm'?(k==='pond'?0:R()<(own==='expert'?.98:own==='learner'?.8:own==='gift'?.08:own==='casual'?.45:own==='content'?.95:.85)?1:0):0;
  f.lid=k==='pond'?0:R()<(own==='expert'?.95:own==='breeder'?.85:own==='content'?.8:own==='learner'?.55:own==='casual'?.3:.02)?1:0;
  f.lidTight=f.lid&&x.air&&own!=='expert'&&R()<.3?1:0;
  f.net=k==='pond'&&R()<(own==='expert'?.8:.3)?1:0;
  f.cycled=R()<(own==='expert'?.95:own==='breeder'?.9:own==='content'?.7:own==='learner'?.72:own==='casual'?.25:.05)?1:0;
  f.waterOK=x.water==='any'?1:R()<(own==='expert'?.9:own==='breeder'?.8:own==='learner'?.4:own==='content'?.45:.08)?1:0;
  f.hides=R()<(own==='expert'?.92:own==='learner'?.7:own==='breeder'?.6:own==='content'?.4:own==='casual'?.35:.08)?1:0;
  f.sand=R()<(own==='expert'?.9:.35)?1:0;
  f.snails=fishIs('beak')&&own==='expert'&&R()<.7?1:0;
  f.tankAge=0;f.wq=f.cycled?88:75;f.algae=0;
  f.coolWinter=x.temp==='cool'&&own==='expert'?1:0;
  f.cat=R()<.17?1:0;f.window=0;f.leak=0;f.pumpOff=0;
  if(own==='mill'){f.filter='스펀지 여과기';f.hides=0;f.cycled=1;f.heater=x.temp==='trop'?1:0}
  /* the layout: substrate, decoration, background — each owner type furnishes a tank its own way */
  const id=S.sp.id,big=x.big||x.pred;
  let lay;
  if(['cup','vase'].includes(k)) lay={sub:'none',deco:'none',bg:'none'};
  else if(k==='bowl') lay={sub:R()<.6?'color':'gravel',deco:R()<.5?'fake':'none',bg:'none'};
  else if(k==='pond') lay={sub:'pond',deco:'pond',bg:'none'};
  else if(own==='expert') lay=big?{sub:R()<.5?'bare':'sand',deco:'pipe',bg:'black'}:['altum','apisto','oscar','peapuffer','fig8','motoro'].includes(id)?{sub:'sand',deco:R()<.5?'wood':'rock',bg:'black'}:{sub:'soil',deco:'nature',bg:R()<.5?'black':'none'};
  else if(own==='learner') lay={sub:pick(['sand','gravel','soil']),deco:pick(['nature','wood','rock']),bg:pick(['blue','none','black'])};
  else if(own==='casual'||own==='gift') lay={sub:R()<.55?'color':'gravel',deco:R()<.6?'kitsch':'fake',bg:R()<.5?'print':'none'};
  else if(own==='content') lay={sub:'bare',deco:R()<.5?'pipe':'none',bg:'black'};
  else lay={sub:'bare',deco:own==='breeder'&&R()<.6?'mop':'none',bg:'none'};
  f.lay=lay;
  if(!['cup','vase','bowl','pond'].includes(k)){f.hides=['nature','wood','rock','kitsch','pipe','mop'].includes(lay.deco)?1:0;f.sand=lay.sub==='sand'?1:0}
}
/* tankmates are bought as shop-size juveniles and grow (fGrowMates). Experts and learners look up adult size and
   the tank each species needs before buying; casual owners buy whatever looks nice and find out later */
const juvCm=id=>{const d=FX[id];return clamp(d.cm*.22,Math.min(d.cm,2.5),9)};
function fSetupMates(own){
  const f=S.f,x=fx_(),L=tankL();f.mates=[];
  const careful=['expert','learner','breeder'].includes(own);
  const adultLoad=()=>(x.cm+f.mates.reduce((s,m)=>s+m.n*FX[m.id].cm,0))/Math.max(.3,L);
  const add=(id,n)=>{const d=FX[id];if(!d)return;
    if(id!==S.sp.id){
      if(careful&&(d.minL>L*1.1||d.temp!==x.temp&&!(d.temp!=='cold'&&x.temp!=='cold')||!fCompatible(S.sp.id,id)))return;
      if(!careful&&own!=='casual'&&d.cm>tankLen()*.4)return;
      if(careful&&d.cm>=25)n=1;
    }
    for(let k=0;k<n;k++){const m=f.mates.find(m=>m.id===id&&!m.feed);if(m)m.n++;else f.mates.push({id,n:1,cm:id===S.sp.id?f.len:juvCm(id)});
      if(careful&&adultLoad()>(own==='expert'?.8:1)){const mm=f.mates.find(m=>m.id===id&&!m.feed);mm.n--;if(!mm.n)f.mates.splice(f.mates.indexOf(mm),1);break}}
  };
  const small=['neon','guppy','platy','cory'];
  if(['cup','vase'].includes(f.tank)) return;
  if(own==='gift'){if(isGold()&&R()<.5)add('comet',1+Math.floor(R()*2));return}
  if(own==='expert'){
    if(x.social==='school') add(S.sp.id,7+Math.floor(R()*6));
    else if(x.social==='group') add(S.sp.id,2+Math.floor(R()*3));
    else if(x.social==='pair'||(fTerr(S.sp.id)<.5&&x.social==='any'&&R()<.3)) add(S.sp.id,1);
    if(!x.pred&&!x.aggro&&!x.big&&x.temp==='trop'&&R()<.6) add(pick(small.filter(s=>s!==S.sp.id&&(FX[s].water!=='hard'||x.water==='hard'))),6);
    if(x.big&&!x.pred&&R()<.4) add('pleco',1);
    return;
  }
  if(own==='breeder'){add(S.sp.id,x.social==='solo'?1:3+Math.floor(R()*4));return}
  if(own==='mill'){const n=x.social==='solo'?1:6+Math.floor(R()*8),m=f.mates.find(m=>m.id===S.sp.id);if(m)m.n+=n;else f.mates.push({id:S.sp.id,n,cm:f.len});f.pair=1;return}
  if(own==='content'){
    const bigs=['oscar','arowana','channa','gar','bichir','pleco','clownloach','motoro'].filter(s=>s!==S.sp.id);
    add(pick(bigs),1);if(R()<.5)add(pick(bigs),1);
    return;
  }
  if(own==='learner'){
    /* a learner starts with the fish itself (and its school), and adds a peaceful species only once the tank is cycled */
    if(x.social==='school') add(S.sp.id,4+Math.floor(R()*4));
    else if(x.social==='group') add(S.sp.id,1+Math.floor(R()*2));
    if(f.cycled&&!x.pred&&!x.aggro&&R()<.6) add(pick(['neon','guppy','platy','cory','apisto'].filter(s=>s!==S.sp.id)),3+Math.floor(R()*4));
    return;
  }
  /* casual: whatever looked nice at the shop, in whatever numbers, adult size unknown */
  if(x.social==='school') add(S.sp.id,Math.floor(R()*3));
  if(x.social==='solo'&&R()<.15) add(S.sp.id,1);
  const pool=['neon','guppy','platy','cory','comet','oranda','ryukin','clownloach','pleco','oscar','fig8','peapuffer','betta'];
  for(let i=0,n=2+Math.floor(R()*3);i<n;i++){const id=pick(pool);if(id===S.sp.id)continue;add(id,FX[id].cm>=25?1:1+Math.floor(R()*3))}
  /* a big fish in a small tank: the owner keeps only it, or adds feeders */
  if(x.pred&&R()<.5&&S.sp.id!=='comet'){const n=4+Math.floor(R()*6),m=f.mates.find(m=>m.id==='comet'&&m.feed);if(m)m.n+=n;else f.mates.push({id:'comet',n,cm:4,feed:1})}
  /* nobody fits a crowd into a bowl … almost nobody */
  if(L<30){let room=L<10?2:5;f.mates.forEach(m=>{m.n=Math.min(m.n,room);room-=m.n});f.mates=f.mates.filter(m=>m.n>0)}
}
/* tankmates grow like our fish: toward adult size, held back by a small tank */
function fGrowMates(m){
  const f=S.f,cap=tankLen()*.55;
  f.mates.forEach(mt=>{if(mt.feed||!FX[mt.id])return;const d=FX[mt.id],life=(SP.find(s=>s.id===mt.id)||{life:60}).life;
    if(mt.id===S.sp.id){mt.cm=Math.max(mt.cm,Math.min(f.len,d.cm));return}
    mt.cm=Math.min(cap,mt.cm+(d.cm-mt.cm)*clamp(m/(life*.12),0,.5))});
}
function fAddMates(n,unq){
  const f=S.f;const pool=['neon','guppy','platy','cory','comet','oranda','ryukin','betta','clownloach','oscar','peapuffer'];
  for(let i=0;i<n;i++){const id=pick(pool);if(id===S.sp.id){const m=f.mates.find(m=>m.id===id);if(m)m.n++;else f.mates.push({id,n:1,cm:f.len});continue}
    const d=FX[id];if(!d)continue;if(S.r>.5&&(d.minL>tankL()*1.1||d.cm>tankLen()*.4))continue;
    /* an owner who has read up does not put cold-water and tropical fish together, or a fish that eats or bullies the others */
    const tw=t=>t==='cold'?0:1;if((S.r>.45||(f.grow&&!f.lazy))&&(tw(d.temp)!==tw(fx_().temp)||!fCompatible(S.sp.id,id)||f.mates.some(m=>m.n>0&&FX[m.id]&&!fCompatible(m.id,id))))continue;const m=f.mates.find(m=>m.id===id&&!m.feed);if(m)m.n++;else f.mates.push({id,n:1,cm:juvCm(id)})}
  if(unq){f.newcomer=1;f.carrier=wpick([['ich',5],['velvet',2],['tetra',f.mates.some(m=>['guppy','platy'].includes(m.id))?2:0],['khv',S.sp.id==='koi'||f.mates.some(m=>m.id==='koi')?3:0],['cyhv2',isGold()?2:0],['neond',S.sp.id==='neon'?2:0],['tb',1]]);f.stress+=.1}
}
const fTankLine=()=>{const f=S.f,t=tankOf(f.tank),x=fx_();
  const m=f.mates.filter(m=>m.n>0);
  return t.l+(t.L>=1?' ('+t.L+'L)':'')+'입니다. '+(f.tank==='pond'?'연못 여과기가 돌아갑니다':f.filter==='없음'?'여과기는 없습니다':'여과기는 '+f.filter+'입니다')+'. '+
    (x.temp==='trop'&&f.tank!=='pond'?(f.heater?'히터가 있고, ':'히터는 없고, '):'')+(f.tank==='pond'?(f.net?'연못 위에는 그물이 쳐져 있고, ':'연못 위는 열려 있고, '):(f.lid?'뚜껑이 있고, ':'뚜껑은 없고, '))+
    (m.length?'함께 사는 물고기는 '+m.map(m=>mateName(m)+' '+m.n+'마리').join(', ')+'입니다.':'함께 사는 물고기는 없습니다.');
};
function fishTankText(){const f=S.f,t=tankOf(f.tank);const mates=f.mates.reduce((s,m)=>s+m.n,0);
  return t.l+(t.L>=1?' '+t.L+'L':'')+' · '+(f.tank==='pond'?'연못':f.filter==='없음'?'여과기 없음':f.filter.replace(' 여과기',''))+(fx_().temp==='trop'&&f.tank!=='pond'?' · 히터 '+(f.heater?'있음':'없음'):'')+(f.tank==='pond'?'':' · 뚜껑 '+(f.lid?'있음':'없음'))+' · '+(mates?'합사 '+mates+'마리':'혼자')+(fLoad()>1.2?' (과밀)':'')}
function fishOwnerText(){if(S.preOwner)return S.o.name+' · 아직 만나지 못함 ('+(S.status||'유통 중')+')';const f=S.f;const rk=typeof fRank==='function'?fRank(S.r):'',up=(rk==='고수'&&f.own!=='expert')||(rk==='중수'&&['casual','gift','learner','content'].includes(f.own));
  return S.o.name+' · '+S.o.age+'세 · '+FOWN[f.own].l+(up?' → 지금은 '+rk:'')+(f.stubborn?' · 고집불통':f.grow&&f.lazy?' · 알지만 귀찮아함':f.grow&&rk!=='고수'?' · 배우는 중':'')}

/* ---------- monthly life ---------- */
function fishTick(){
  const f=S.f,x=fx_(),sp=S.sp,dt=S.dt,m=dt; // m = months this tick
  S.tick++;S.ageM+=dt;S.month+=dt;f.tankAge+=dt;
  if(S.happyT>0)S.happyT--;if(S.scaredT>0)S.scaredT--;if(f.puffT>0)f.puffT--;
  const frac=dt/sp.life,prev=(S.ageM-dt)/sp.life,now=S.ageM/sp.life;
  for(const [mm,t] of MILES) if(prev<mm&&now>=mm){addLog(T(t),'mile');render();return}
  /* owner attention */
  const dec=tm('friendly')?.7:tm('feisty')?1.15:1, own=f.own;
  const bore=own==='expert'?.35:own==='breeder'?.6:own==='learner'?.9:own==='content'?.8:own==='casual'?1.5:2.1;
  S.interest=clamp(S.interest-frac*(.3+(1-S.r)*1.2)*BORE.fish*bore*dec*fCharmK()*(f.lazy?1.35:1)*modeK('bore')*persK('bore')+frac*S.r*1.0,.02,1);
  /* owners who grow get better week by week; the lazy ones barely */
  if(f.grow&&!f.stubborn)S.r=clamp(S.r+(f.lazy?.001:.0036)*m*persK('learn'),0,.92);
  if(f.lazy&&S.r>.7)S.r=.7; // knowing the fix and not doing it never makes a 고수
  fRankTick();
  const care=clamp(S.interest*(.3+.7*S.r),0,1);
  if(S.interest<.22) breakP(2,'돌봄 소홀');
  if(f.wq<35&&f.wasCycled) breakP(2,'더러운 물을 오래 둠');
  if((f.stunt||0)>.25) breakP(2,'좁은 수조에 둬 성장이 멈춤');
  if(fLoad()>1.5) breakP(2,'과밀 수조');
  /* growth: toward adult size, slowed by stress and dirty water, stopped by the tank */
  const target=x.cm*clamp(1-Math.exp(-S.ageM/(sp.life*.12)),.05,1);
  const cap=Math.min(tankLen()*.55,x.cm);
  if(f.len<target){const g=(target-f.len)*clamp(m/(sp.life*.05),0,1)*(f.wq>55?1:.5)*(1-f.stress*.5)*(tm('glutton')?1.15:1);f.len=Math.min(f.len+g,cap)}
  fGrowMates(m);
  if(target>cap*1.02&&f.len>=cap*.98) f.stunt=clamp((f.stunt||0)+m*.04*(target/cap),0,1.5);
  /* water quality */
  const L=tankL(), load=fLoad();
  const FI=filtOf(f.filter),filt=FI.k*(FI.ug&&f.tankAge>12&&own!=='expert'?1.35:1)*(f.pumpOff?1.25:1);
  const tiny=L<5?1.6:1;
  const decay=(4+20*load)*filt*tiny*((f.fat||0)>.3?1.2:1)*modeK('wq');
  const spike=(f.cycled?0:34*(.2+Math.min(load,2))*Math.exp(-f.tankAge/1))*modeK('wq');
  const clean=care*(30+20*S.r)*(f.lazy?.82:1)+(f.cycled&&f.hides?5:f.cycled?3:0);
  f.wq=clamp(f.wq+(clean-decay-spike)*Math.min(m,1.2),0,100);
  if(!f.cycled&&f.tankAge>1.6) f.cycled=1;
  f.fat=Math.max(0,(f.fat||0)-.05*m);
  /* temperature */
  const ss=season();let tempHit=0;
  if(ss==='winter'&&x.temp==='trop'&&!f.heater&&f.tank!=='pond'){tempHit=.9;f.coldShock=1}
  if(ss==='winter'&&x.temp==='trop'&&f.tank==='pond'){tempHit=3}
  if(ss==='summer'&&f.tank!=='pond'&&!f.fan&&(L<30||x.temp==='cold')) tempHit+=x.temp==='cold'?.4:.2;
  if(x.temp==='cold'&&f.heater&&f.mates.some(mt=>FX[mt.id]&&FX[mt.id].temp==='trop')) tempHit+=.15;
  if(x.temp==='cool'&&!f.coolWinter&&ss==='winter'&&f.heater) tempHit+=.12;
  /* stress */
  const cramped=clamp((f.len/tankLen()-.25)*2.6,0,1);
  const crowd=clamp((load-1)*.5,0,1);
  const alone=x.social==='school'&&fSameCount()<4?.3:x.social==='group'&&fSameCount()<2?.15:0;
  const waterBad=f.waterOK?0:x.water==='brack'?.3:.22;
  const nohide=!f.hides?(x.shy||tm('shy')?.18:.05):0;
  const dirty=f.wq<55?(55-f.wq)/90:0;
  /* strong current: long fins and tiny fish in a small tank fight it all day */
  const flow=FI.flow>.45&&tankL()<170&&(x.longfin||x.cm<5||fishIs('puff'))&&!(own==='expert'&&R()<.8)?(FI.flow-.4)*.5:0;
  const tgt=clamp(flow+cramped*.55+crowd*.45+fMatePressure()*.6+alone+waterBad+nohide+dirty+tempHit*.3+(f.stunt||0)*.3,0,1.2);
  f.stress=clamp(f.stress*.55+tgt*.45,0,1.2);f.bully=Math.max(0,(f.bully||0)-.05);
  /* fins */
  if(x.longfin&&f.mates.some(mt=>mateFx(mt).nip&&mt.id!==S.sp.id)) f.fin+=.06*m*(f.hides?.5:1)*fPowK();
  if(f.fin>.3&&f.wq<60&&!f.ill&&R()<.3*m) fSick(R()<.7?'finrot':'fungus');
  /* wild fish that will not eat */
  if(f.wild&&fishIs('picky')&&f.refuse===undefined) f.refuse=R()<.55?1:0;
  if(f.refuse){const fix=own==='expert'?.5:own==='learner'||own==='content'?.18:.03;if(R()<fix*m){f.refuse=0;addLog(T(own==='expert'?'주인이 냉동 장구벌레와 살아 있는 실지렁이를 구해 와 핀셋으로 하나씩 내밀었습니다. {n}이 마침내 받아먹었습니다.':'주인이 사료를 바꿔 보았습니다. {n}이 조금씩 먹기 시작했습니다.'),'good');remember('고향 물에서 먹던 것과 비슷한 맛. 다시 먹었다.',1.3)}}
  /* health */
  let dh=(f.wq>65?6:f.wq>40?-2:-(40-f.wq)*.55)-f.stress*11-tempHit*9-(f.refuse?16:0)-((f.beak||0)>1?14:0)-(f.stunt||0)*9;
  if(f.ill) dh-=DZ[f.ill.id].prog*f.ill.sev*22;
  /* old age: past ~70% of the lifespan the body wears out — recovery slows and the ceiling of health falls */
  const age=S.ageM/sp.life,old=clamp((age-.7)/.3,0,1.2);S.hMax=Math.round(100-old*68);
  if(old>0){dh=(dh>0?dh*(1-old*.7):dh)-old*4}
  /* some fish do fine when nobody looks: hardy species with guts lose less when neglected */
  if(dh<0&&S.interest<.35&&x.hardy>=.7&&f.st)dh*=clamp(1-(f.st.g-30)/90,.5,1);
  if(dh<0)dh*=modeK('dh');
  S.health=clamp(S.health+(dh<0?dh*fEndureK():dh)*Math.min(m,1.2),0,S.hMax);
  fMendCheck();
  /* disease */
  if(f.ill) fIllTick(care,m);
  else{
    const rate=.008*(1+4*f.stress)*(f.wq<50?1+(50-f.wq)/15:1)*(f.carrier?6:1)*(f.coldShock?3:1)*(1.6-x.hardy)*(S.ageM>sp.life*.75?1.8:1)*(typeof z_dzK==='function'?z_dzK():1);
    if(R()<1-Math.exp(-rate*m*lifeK()*modeK('dz'))) fSick(f.carrier&&R()<.7?f.carrier:fPickDz());
  }
  if(f.coldShock&&R()<.5) f.coldShock=0;
  if(S.done||S.ending||S.waiting) return;
  /* deaths that come from the state */
  if(f.wq<3){const k=f.tankAge<2.6&&!f.wasCycled?'cycle':'neglect';if(!f.cycleCr){f.cycleCr=1;CRISIS.neglect=CRISIS.cycle;return void fCr(k)}render();return fEnd(k)}
  if(S.health<=0){render();return fEnd(fCause())}
  if(S.ageM>=S.target){render();return fEnd(fGoodOwner()?'natural':'natural')}
  if(f.cycled) f.wasCycled=1;
  /* a fish gasping in dirty water: what a careless owner does about it */
  if(f.wq<28&&['casual','gift'].includes(f.own)&&!f.panicked&&R()<.5*Math.min(1,m*2)){
    f.panicked=1;const o=wpick([['change',35],['flush',25],['release',20],['none',20]]);
    if(o==='change'){if(R()<.45*fL('tap')){render();return fEnd('tapwater')}say('물고기가 수면에서 뻐끔거리자 주인이 놀라 물을 절반 갈았습니다. 수돗물 냄새가 났지만 {n}은 버텼습니다.','sub');f.wq+=30;f.stress+=.1;render();return}
    if(o==='flush'){render();return fEnd('flushalive','sick')}
    if(o==='release'){q(T('주인은 "물이 안 맞나 보다"며 {n}을 근처 하천에 놓아주기로 했습니다.'),'bad');q(null,null,()=>fRelease());render();return}
    say('{n}이 수면에서 입을 뻐끔거렸지만, 주인은 "밥 달라는 건가" 하고 사료를 더 넣었습니다.','bad');f.wq-=5;
  }
  if(f.wq>50) f.panicked=0;
  /* an owner who learns fixes things */
  if(!f.stubborn&&fLearn(m)) return;
  /* a predator that ate its tankmates */
  if((x.pred||fbOf(S.sp.id).hostile>=.4)&&(f.kills||0)>=2&&!f.shock&&['casual','learner','gift','content'].includes(f.own)&&R()<.5){render();fShock();return}
  /* hazards */
  if(fHazards(m)) return;
  /* the schedule: how the fish spends the coming weeks (fishgrow.js) */
  if(fTrainDue()){fTrain();render();return}
  /* catalogue events (data/fev_*.js) */
  if(typeof fevHappyTry==='function'&&fevHappyTry('home'))return;
  if(!(S.cd.choice>S.tick)&&typeof fevTry==='function'&&R()<FEV_HOME_P&&fevTry('home')){S.cd.choice=S.tick+3;return}
  /* choices and everyday events */
  if(!(S.cd.choice>S.tick)&&R()<.12){
    /* situations whose options depend on temperament and species (FSIT), and the fixed ones (FCH) */
    const sit=FSIT.filter(c=>!(S.cd['fs'+c.id]>S.tick)&&(!c.when||c.when())&&pondOK(c.p)).map(c=>[c,1.6/(1+1.5*(S.seen['fs'+c.id]||0))]);
    const fix=FCH.filter(c=>pondOK(c.p)&&c.o.filter(o=>pondOK(o.l,o.r)).length>=2&&(!c.once||!S.once['fc'+c.i])&&!(S.cd['fc'+c.i]>S.tick)&&(!c.when||c.when())).map(c=>[c,1/(1+2*(S.seen['fc'+c.i]||0))]);
    const all=sit.concat(fix);
    if(all.length){const c=wpick(all);S.cd.choice=S.tick+3;
      if(c.o&&FSIT.includes(c)){const opts=fBuildOpts(c);if(opts.length>=2){if(c.log)addLog(T(c.log),'sub');S.seen['fs'+c.id]=(S.seen['fs'+c.id]||0)+1;S.cd['fs'+c.id]=S.tick+12;askChoice({p:c.p,o:opts});render();return}}
      else{S.seen['fc'+c.i]=(S.seen['fc'+c.i]||0)+1;S.cd['fc'+c.i]=S.tick+30;if(c.once)S.once['fc'+c.i]=1;askChoice(Object.assign({},c,{o:c.o.filter(o=>(!o.when||o.when())&&pondOK(o.l,o.r))}));render();return}}
  }
  if(R()<.28){
    const pool=FFL.filter(e=>pondOK(e.t)&&(!e.once||!S.once['ff'+e.once])&&!(S.cd['ff'+e.i]>S.tick)&&(!e.when||e.when()));
    if(pool.length){const e=wpick(pool.map(p=>[p,(p.w||1)/(1+1.6*(S.seen['ff'+p.i]||0))]));
      S.seen['ff'+e.i]=(S.seen['ff'+e.i]||0)+1;if(e.once)S.once['ff'+e.once]=1;S.cd['ff'+e.i]=S.tick+30;
      addLog(T(e.t),e.c);if(e.fx)e.fx();if(e.m)remember(e.m,e.mw);
      f.wq=clamp(f.wq,0,100);f.stress=clamp(f.stress,0,1.2);S.health=clamp(S.health,0,100);S.interest=clamp(S.interest,.02,1)}
  }
  render();
}
/* long-lived fish meet fewer accidents per month, or a koi would never see thirty */
/* a promise that was broken and then put right: a small tank swapped for a big one before the fish outgrew it,
   a heater fitted, a lid made, a school completed. The red line stays, the correction is written beside it,
   and a promise whose every fault was put right counts as kept. */
function mendP(i,re,label){const p=S.pl[i];if(!p||S.preOwner||S.wild)return;let did=0;
  [p].concat(p.more||[]).forEach(r=>{if(!r.mended&&re.test(r.note)){r.mended={age:S.ageM,label};did=1}});
  if(did){drawPledges($('gamePledges'),true);if(!skipping)addLog(T('서약서 '+(i+1)+'번 줄 옆에 고친 흔적이 생겼습니다. '+label+'.'),'good')}}
const plKept=p=>!p||[p].concat(p.more||[]).every(r=>r.mended);
function fMendCheck(){const f=S.f,x=fx_();if(S.preOwner||S.wild||!f.own)return;
  if(tankL()>=x.minL*.5&&f.len<x.cm*.9&&!(f.stunt>.25)) mendP(2,/수조에 넣음|몸보다 작은 수조|처음부터 과밀|키울 수 없는 종/,'큰 수조로 바꿔 줌');
  if(fLoad()<=1.1) mendP(2,/^과밀 수조$/,'수조를 넓혀 줌');
  if(f.heater) mendP(2,/히터 없음|히터 없이/,'히터를 달아 줌');
  if(f.lid) mendP(3,/뚜껑 없음/,'뚜껑을 맞춰 줌');
  if(x.social==='school'&&fSameCount()+1>=5) mendP(2,/무리 지어 사는 종을/,'무리를 채워 줌');
  if(f.waterOK) mendP(2,/맞추지 않음|기수어인데/,'물을 맞춰 줌');
  /* torn fins left as they are for months: that is not noticing */
  if(f.fin>.45){f.finT=(f.finT||0)+S.dt;if(f.finT>=4)breakP(1,'찢어진 지느러미를 몇 달째 그대로 둠')}else if(f.fin<.2)f.finT=0}
const lifeK=()=>clamp(Math.sqrt(120/S.sp.life),.5,1.4);
const fGoodOwner=()=>S.r>.6&&S.interest>.4;
function fCause(){
  const f=S.f,x=fx_();
  if(f.ill) return 'disease';
  if(f.wq<35&&f.tankAge<2.6&&!f.wasCycled) return 'cycle';
  if((f.beak||0)>1) return 'starve:beak';
  if(f.refuse) return S.sp.id==='motoro'?'starve:curl':'starve:refuse';
  if(season()==='winter'&&x.temp==='trop'&&!f.heater) return 'cold';
  if((f.stunt||0)>.6) return 'stunt';
  if(f.fin>.9) return 'nipped';
  if(f.wq<35) return 'neglect';
  return 'stress';
}
function fPickDz(){
  const f=S.f,x=fx_();
  const w=x.dz.map(([id,wt])=>{let k=wt;
    if(f.coldShock&&['ich','fungus','velvet'].includes(id))k*=3;
    if(f.wq<50&&['aero','finrot','columnaris'].includes(id))k*=2.5;
    if(f.fin>.3&&['finrot','fungus'].includes(id))k*=2.5;
    if(S.ageM>S.sp.life*.6&&id==='tb')k*=1.5;
    if(id==='swimb'&&(f.fat||0)>.2)k*=2;
    if(id==='irido'&&season()==='summer')k*=2;
    return [id,k]});
  return wpick(w);
}
function fSick(id){
  const f=S.f;if(f.ill||!DZ[id]||S.done||S.ending)return;
  f.ill={id,sev:.15,noticed:0,treating:0};f.seen=0;
  if(f.carrier===id)f.carrier=null;
  addLog(T(DZ[id].sym),'bad');
}
function fIllTick(care,m){
  const f=S.f,ill=f.ill,d=DZ[ill.id],x=fx_(),own=f.own;
  ill.sev+=d.prog*m*(ill.treating?.25:1)*(.6+f.stress)*(f.wq<50?1.3:1)*(typeof modeK==='function'?(modeK('dz')+1)/2:1);
  if(ill.id==='swimb') ill.sev=Math.min(ill.sev,.92);
  const watch={expert:1,breeder:.9,content:.85,learner:.7,casual:.35,gift:.2}[own]||.4,vis=d.ov?1.2:.55;
  if(!ill.noticed&&R()<clamp(watch*vis*(.35+ill.sev)*(.45+.55*S.interest)*(.6+.4*S.r),0,1)*Math.min(1,m*2)){
    ill.noticed=1;
    if(own==='expert'||own==='breeder'||(own==='learner'&&R()<.6)||(own==='content'&&R()<.65)){
      if(d.cure>0){ill.treating=1;say('주인이 '+josa(d.n,'을')+' 알아보고 격리 수조를 꾸려 약욕을 시작했습니다.'+(x.scaleless?' 비늘 없는 {n}을 위해 약은 절반만 넣었습니다.':''),'good')}
      else {ill.incurable=1;say('주인은 '+josa(d.n,'이')+' 치료법이 없는 병이라는 걸 알았습니다. 주인은 {n}을 따로 옮기고 오래 들여다보았습니다.','sub')}
    } else if(own==='learner'||own==='content'||(own==='casual'&&R()<.3)){
      say(own==='casual'?'주인은 마트에서 "만능 치료제"를 사 와 뚜껑으로 대충 부었습니다.':'주인은 인터넷 카페 댓글대로 소금과 약을 한꺼번에 넣었습니다.','bad');
      if(x.scaleless||R()<.22){render();return fEnd('poison','med')}
      ill.treating=.5;
    } else {say('주인은 "물고기가 다 그렇지" 하며 지켜보기만 했습니다.','bad');breakP(1,'병든 물고기를 그냥 둠')}
  }
  if(ill.treating&&R()<d.cure*1.05*Math.min(1,m*1.5)*(ill.treating===1?1:.5)){
    addLog(typeof Z_HEAL==='object'&&Z_HEAL[ill.id]?T(Z_HEAL[ill.id]):T(d.n+'이 나았습니다. {n}이 다시 지느러미를 폈습니다.').replace(d.n+'이',josa(d.n,'이')),'good');remember('아팠던 몸이 다시 가벼워졌다. 누군가 나를 돌봤다.',1.4);f.ill=null;S.health=clamp(S.health+12,0,100);return;
  }
  if(ill.incurable&&ill.sev>.75&&R()<.35){render();return fEnd('euth')}
  if(ill.sev>=1){render();
    if(['casual','gift'].includes(own)&&R()<.45) return fEnd(R()<.7?'flushalive':R()<.5?'trash':'freezer','sick');
    if(!ill.crisis){ill.crisis=1;return void fCr('disease')}
    return fEnd('disease');
  }
  if(ill.id==='swimb'&&ill.noticed&&['casual','gift'].includes(own)&&R()<.25*m){render();return fEnd('flushalive','swimb')}
}

/* owner-made and accidental hazards. returns true when something took over the tick */
function fHazards(m){
  const f=S.f,x=fx_(),own=f.own,ss=season();
  const hit=r=>R()<1-Math.exp(-r*m*HZ*lifeK()*modeK('hz'));
  const low=1-S.r;
  // jump / escape
  if(f.tank!=='pond'&&hit((x.jump||0)*.025*(f.lid?.04:1)*(1+f.stress)*tmod('jump')*fWitsK()*fL('lid')*(typeof sideK==='function'?sideK('jumpy'):1))){return fCr('jump')}
  if(x.escape&&f.tank!=='pond'&&hit((typeof sideK==='function'?sideK('escapey'):1)*x.escape*.03*(f.lid?(own==='expert'?.05:.35):1)*fWitsK()*fL('lid'))){return fCr('escape')}
  if(x.air>1&&f.lidTight&&hit(.03)){render();fEnd('noair');return true}
  // tankmates
  const pm=fPredMate();
  if(pm&&hit(.1*pm.n*(f.hides?.5:1)*(fT('hide')>=3?.6:1)*fWitsK()*fL('mates'))){return fCr('eaten',pm.id)}
  if(fBehave(m,hit)) return true;
  if(f.fin>1.1){render();fEnd('nipped');return true}
  if(f.len<3.5&&filtOf(f.filter).intake&&hit(.007*(S.r>.75?.2:1)*fWitsK()*fL('intake'))){return fCr('intake')}
  // equipment and weather
  if(f.heater&&hit(.0025*(own==='expert'?.3:1)*fL('heater'))){return fCr('cook')}
  if(ss==='winter'&&x.temp==='trop'&&f.tank!=='pond'&&hit(.007*(f.heater?.4:3)*fL('heater'))){return fCr('cold')}
  if(ss==='winter'&&f.tank==='pond'&&x.temp==='trop'){render();fEnd('cold');return true}
  if((ss==='summer'||ss==='winter')&&hit(.004*(1+fLoad())*fL('power'))){
    if(own==='expert'&&R()<.75){say('정전이 됐습니다. 주인은 건전지 에어펌프를 켜고 수조를 담요로 감쌌습니다.','good');remember('정전된 밤, 주인이 담요로 수조를 감쌌다.',1.2);render();return true}
    return fCr('oxygen')}
  // owner mistakes
  if(f.tank!=='pond'&&hit(.006*low*low*(own==='expert'?0:1)*fL('tap'))){if(R()<x.hardy*.35){say('염소를 빼지 않은 수돗물로 물을 다 바꿨습니다. {n}이 비틀거렸지만 겨우 버텼습니다.','bad');S.health-=25;fMistake('tap');render();return true}return fCr('tapwater')}
  if(x.water==='soft'&&own!=='expert'&&hit(.012*low)){render();fEnd('shock');return true}
  if(f.tank!=='pond'&&hit(.002*low*(own==='expert'?0:1)*fL('poison'))){return fCr('poison',R()<.55?'soap':'spray')}
  // the absurd ones: a tilted stand, the cat, the siphon, a sunny window, bread, hot water
  if(f.tank!=='pond'&&tankL()>=27&&hit(.00025*(f.leak?10:1)*(f.tankAge>60?2:1)*(own==='casual'?1.6:own==='expert'?.3:1)*fL('level'))){return fCr('burst')}
  if(f.cat&&!f.lid&&f.tank!=='pond'&&hit(.012*(f.len<12?1:.3)*fWitsK()*fL('lid'))){return fCr('cat')}
  if(f.len<4&&f.tank!=='pond'&&own!=='expert'&&hit(.003*low*fWitsK()*fL('siphon'))){return fCr('siphon')}
  if(['bowl','t20','vase','cup'].includes(f.tank)&&ss==='summer'&&(f.window||['gift','casual'].includes(own))&&hit(.02*(f.window?2.5:.6)*fL('sun'))){return fCr('sun')}
  if(S.o.fam==='아이 있는 가족'&&own!=='expert'&&hit(.003*low*fWitsK()*fL('kids'))){return fCr('bread')}
  if(own!=='expert'&&f.tank!=='pond'&&hit(.0012*low*fL('poison'))){render();fEnd('poison','hot');return true}
  // places: a classroom over the holidays, an office over a long weekend
  if(f.place==='classroom'&&(ss==='summer'||ss==='winter')&&!(S.cd.vac>S.tick)&&hit(.6)){S.cd.vac=S.tick+6;
    q(T(ss==='summer'?'여름방학이 시작됐습니다. 교실 문이 잠겼습니다.':'겨울방학이 시작됐습니다. 교실 난방이 꺼졌습니다.'),'bad',()=>breakP(2,'방학 동안 방치'));
    q(null,null,()=>{if(R()<.45)fEnd('classroom');else{S.health-=35;f.wq-=45;say('개학날, {n}은 녹색으로 변한 물속에서 겨우 살아 있었습니다. 아이들이 "살아 있다!" 하고 소리쳤습니다.','sub')}});render();return true}
  if(f.place==='office'&&hit(.03)){q(T('연휴가 시작됐습니다. 사무실 불이 꺼졌습니다.'),'bad',()=>breakP(2,'연휴 동안 방치'));
    q(null,null,()=>{if(R()<.35)fEnd('office');else{S.health-=20;f.wq-=30;say('연휴가 끝나고 출근한 직원이 사료를 한 숟갈 크게 넣었습니다. "많이 먹어라."','sub')}});render();return true}
  // abuse
  if(S.o.fam==='아이 있는 가족'&&f.len<8&&f.tank!=='pond'&&hit(.006*low*fWitsK()*fL('kids'))){return fCr('squeeze')}
  if(['casual','gift'].includes(own)&&S.o.age<40&&hit(.0012*low)){render();fEnd(R()<.7?'poison':'swallow','soju');return true}
  // pond predators
  if(f.tank==='pond'&&!f.net&&hit(.03)){render();fEnd('pond');return true}
  // species
  if(S.sp.id==='clownloach'&&['casual','gift'].includes(own)&&hit(.03)){render();fEnd('flushalive','rest');return true}
  if((f.beak||0)>1.2){render();fEnd('starve','beak');return true}
  // breeding
  if(f.pair&&['breeder','mill'].includes(own)&&(f.spawns||0)>3&&hit(.04*(f.spawns||0)*(own==='mill'?1.8:1))){render();fEnd('breedout');return true}
  // life events
  if(hit(.022*(fL('vacation')<1?.5:1))&&(ss==='summer'||ss==='winter')) return fVacation();
  if(hit(.007)) return fMove();
  if(!f.outgrown&&f.len>tankLen()*.32) return fOutgrow();
  if(S.interest<(own==='learner'?.3:.5)&&['casual','gift','learner','content'].includes(own)&&hit(.05*(own==='learner'?.4:1)*(fT('social')>=3?.5:1)*(1.3-fst().c/100*.7))) return fDispose();
  if(own==='mill'&&fem()&&S.ageM>S.sp.life*.35&&hit(.05)){render();fEnd('millcull',pick(['oscar','arowana','channa'].filter(p=>p!==S.sp.id)));return true}
  if(!f.place&&['casual','learner','gift','content','breeder'].includes(own)&&hit(.003*(own==='breeder'?1.6:1))) return fGiveAway();
  if(hit(.00035*((S.o.age+S.ageM/12)>65?5:1))){runBranch('ownergone');render();return true}
  return false;
}
function fVacation(){
  const f=S.f,own=f.own;
  if(own==='expert'||own==='breeder'){say('주인이 여행을 떠나며 자동 먹이 급여기를 달고, 지인에게 이틀에 한 번 물 상태를 봐 달라고 부탁했습니다.','good');render();return true}
  if(own==='learner'||own==='content'){say('주인이 사흘 여행을 다녀왔습니다. 굶었지만 버틸 만했습니다.','sub');S.health-=6;render();return true}
  if(own==='casual'){q(T('주인이 일주일 여행을 떠나며 "먹이 블록"을 하나 넣어 두었습니다.'),'bad',()=>{f.wq-=35;S.health-=20;breakP(2,'여행 가며 방치')});
    q(null,null,()=>{if(S.health<=0||f.wq<10||R()<.25)fEnd('starve','vacation');else{say('주인이 돌아왔을 때 물은 뿌옇게 썩어 있었습니다. {n}은 수면에서 입을 뻐끔거리며 버티고 있었습니다.','sub');fMistake('vacation')}});return true}
  q(T('주인은 열흘 동안 집을 비웠습니다. 수조는 잊혔습니다.'),'bad',()=>{breakP(2,'여행 가며 방치')});
  q(null,null,()=>{if(R()<.6)fEnd('starve','vacation');else{S.health-=30;f.wq-=40;say('{n}은 탁한 물속에서 홀로 살아남았습니다.','sub')}});return true;
}
function fMove(){
  const f=S.f,own=f.own;
  if(['casual','gift'].includes(own)&&R()<.3){q(T('이사가 정해졌습니다. 주인은 "수조는 옮기기 힘들다"고 했습니다.'),'bad');q(null,null,()=>fEnd('left'));return true}
  if(['casual','gift'].includes(own)&&R()<.25){q(T('이사를 앞두고 주인은 수조를 정리하기로 했습니다.'),'bad');q(null,null,()=>fRelease());return true}
  q(T(own==='expert'||S.r>=.78?'이사 날, 주인은 {n}을 산소를 채운 봉지에 담고 여과재는 수조 물에 담가 따로 챙겼습니다.':'이사 날, {n}은 비닐봉지에 담겨 이삿짐 트럭 짐칸에서 몇 시간을 흔들렸습니다.'),own==='expert'||S.r>=.78?'sub':'bad',()=>{const good=own==='expert'||S.r>=.78;f.stress+=good?.05:.25;if(!good){f.cycled=0;f.tankAge=0}S.health-=good?3:12});
  render();return true;
}
/* the fish has outgrown its tank: a bigger tank (new and uncycled, unless the owner moves the filter media),
   a pond, or another home */
function fUpgrade(up,good,keep){
  const f=S.f,own=f.own,keepMedia=keep||own==='expert'||own==='breeder'||S.r>=.78||(own==='learner'&&R()<.5);
  q(T(good||'주인은 '+josa(up.l,'을')+' 들였습니다. {n}이 몸을 다 펴고 헤엄쳤습니다.'),'good',()=>{f.tank=up.k;f.filter=fPickFilter(up.k,own);f.outgrown=0;f.moved=1;f.stress-=.15;
    if(!keepMedia){f.cycled=0;f.tankAge=0;f.wasCycled=0}else f.tankAge=Math.max(f.tankAge,2);
    remember('수조가 넓어졌다. 몸을 다 펴고 헤엄쳤다.',1.5);render()});
  q(T(keepMedia?'주인은 옛 수조의 여과재를 새 여과기에 옮겨 담았습니다. 물속 박테리아도 함께 이사했습니다.':'새 수조는 오늘 처음 물을 채운 새것이었습니다. 옛 수조의 물은 하수구에 버려졌습니다.'),keepMedia?'sub':'bad',()=>{if(!keepMedia)breakP(2,'새 수조를 물잡이 없이 씀');render()});
  return true;
}
const x_region=()=>fx_().region||'고향 물';
const fPondFish=()=>isGold()||S.sp.id==='koi';
function fOutgrow(){
  const f=S.f,x=fx_(),own=f.own;f.outgrown=1;
  const up=TANKS.filter(t=>t.k!=='pond'&&t.len>tankLen()&&t.L>=x.minL)[0]||TANKS.filter(t=>t.k!=='pond'&&t.len>tankLen()).slice(-1)[0];
  const next=TANKS.filter(t=>t.k!=='pond'&&t.len>tankLen())[R()<.6?0:1]||up;
  const say2=t=>q(T(t),'sub');
  q(T((f.stunt>.2||(f.fl&&(f.fl.hlt_stunt||f.fl.stunted))?'{n}의 몸은 자라다 휘었는데도 '+tankOf(f.tank).l+'에는 너무 큽니다.':'{n}의 몸이 '+tankOf(f.tank).l+'에 비해 너무 커졌습니다.')+' 돌아설 때마다 꼬리가 유리에 닿습니다.'),'bad');
  if(own==='expert'){
    if(x.pond&&f.tank!=='pond'){q(T('주인은 마당을 파 연못을 만들었습니다. {n}은 처음으로 하늘이 보이는 물에 들어갔습니다.'),'good',()=>{f.tank='pond';f.filter='연못 여과기';S.env='pond';f.outgrown=0;remember('하늘이 보이는 물. 몸을 다 펴도 닿지 않았다.',1.6)});return true}
    if(up&&up.L>=x.minL&&up.k!==f.tank) return fUpgrade(up);
    if(fPondFish()&&R()<.5){q(null,null,()=>fRehome('주인은 "이 집에서는 더 못 키운다"며 마당에 연못이 있는 동호회 회원에게 {n}을 보냈습니다.',{tank:'pond',own:'expert',note:'연못 있는 사람에게 보냄'}));return true}
    if(R()<.3){q(null,null,()=>fEnd('donate'));return true}
    say2('더 큰 수조를 둘 자리는 집에 없었습니다. 주인은 받아 줄 수족관을 찾아 연락을 돌렸지만, 모두 "이미 너무 많다"고 거절했습니다.');return true;
  }
  if(own==='learner'||own==='breeder'||own==='content'){
    const o=wpick([['up',own==='content'?60:45],['pond',fPondFish()?25:0],['rehome',own==='content'?10:25],['keep',20]]);
    if(o==='up'&&next) return fUpgrade(next,next.L>=x.minL?null:'주인은 '+josa(next.l,'로')+' 수조를 바꿨습니다. 그래도 다 자란 {n}에게 넉넉한 크기는 아니었습니다.');
    if(o==='pond'){q(null,null,()=>fRehome('"어항에서는 못 키우겠다." 주인은 연못이 있는 시골 친척 집에 {n}을 데려다주었습니다.',{tank:'pond',own:'learner',note:'연못 있는 집에 보냄'}));return true}
    if(o==='rehome'){q(null,null,()=>fRehome('주인은 "더 잘 키워 줄 사람에게"라며 {n}을 중고거래 앱에 무료 분양으로 올렸습니다.'));return true}
    say2('주인은 "조금만 더"라며 수조를 바꾸지 않았습니다.');return true;
  }
  if(own==='casual'||own==='gift'){
    const o=wpick([['up',20],['rehome',20],['pond',fPondFish()?15:0],['release',25],['shop',10],['keep',25]]);
    if(o==='up'&&next) return fUpgrade(next,'주인은 할인하는 '+josa(next.l,'을')+' 사 왔습니다. 물은 수돗물을 받아 바로 채웠습니다.');
    if(o==='pond'){q(null,null,()=>fRehome('주인은 "연못 있는 집이면 잘 살겠지"라며 동네 식당 마당 연못에 {n}을 넣어 주고 왔습니다.',{tank:'pond',own:'casual',place:'restaurant',note:'남의 연못에 넘김'}));return true}
    if(o==='rehome') q(null,null,()=>fRehome('주인은 "커져서 감당이 안 된다"며 {n}을 중고거래 앱에 무료 분양으로 올렸습니다.'));
    else if(o==='release') q(T('주인은 "넓은 데서 살라"며 {n}을 들고 근처 하천으로 갔습니다.'),'bad',()=>{}),q(null,null,()=>fRelease(true));
    else if(o==='shop') q(null,null,()=>fRehome('주인은 {n}을 샀던 가게에 되돌려 주었습니다. 가게는 {n}을 다시 판매 수조에 넣었습니다. 몇 주 뒤 다른 사람이 {n}을 사 갔습니다.'));
    else say2('주인은 아무것도 바꾸지 않았습니다. {n}은 그 수조 안에서 계속 자라려 했습니다.');
    return true;
  }
  say2('주인은 수조를 바꿀 생각이 없었습니다.');return true;
}
function fDispose(){
  const f=S.f,own=f.own;
  const o=wpick([['release',S.r>=.7?0:own==='gift'?45:35],['rehome',30],['place',15],['shop',15],['ignore',20]]);
  if(o==='ignore'){say(S.f.tank==='pond'?'주인은 연못 쪽으로 나가지 않게 되었습니다. 연못 위에 낙엽이 쌓여 갔습니다.':'주인은 수조 쪽을 보지 않게 되었습니다. 수조 조명은 몇 주째 꺼져 있습니다.','bad');S.interest=Math.max(.02,S.interest-.05);render();return true}
  if(o==='release'){q(T(pick(['수조 청소가 귀찮아진 주인은 "자연으로 돌려보내 준다"며 수조를 들고 하천으로 갔습니다.','주인은 "방생하면 복 받는다"는 말을 떠올리고 {n}을 근처 저수지로 데려갔습니다.'])),'bad');q(null,null,()=>fRelease());return true}
  if(o==='place') return fGiveAway();
  if(o==='shop'){q(null,null,()=>fRehome('주인은 {n}을 수족관에 헐값에 넘겼습니다. {n}은 다시 판매 수조에 들어갔고, 몇 주 뒤 다른 사람에게 팔렸습니다.'));return true}
  q(null,null,()=>fRehome('주인은 "사정이 생겼다"며 {n}을 중고거래 앱에 무료 분양 글로 올렸습니다.'));return true;
}
/* given away while the owner can still keep it: a classroom, an office lobby, a restaurant, a club member, a pond */
function fGiveAway(){
  const f=S.f,x=fx_();
  const o=wpick([['classroom',x.cm<=20?3:0],['office',2],['restaurant',x.cm>=15?3:1],['club',3],['pond',fPondFish()&&f.len>12?4:0]]);
  const T_={classroom:['아이가 "반 친구들도 보고 싶대"라며 {n}을 학교 교실 수조로 가져갔습니다. 수조 옆에는 "우리 반 물고기"라는 이름표가 붙었습니다.',{own:'casual',tank:'t45',place:'classroom',name:'3학년 2반',note:'교실에 넘김'}],
    office:['주인은 "회사 로비가 허전하다"는 말에 {n}을 사무실 수조로 보냈습니다. 먹이 당번은 정해지지 않았습니다.',{own:'casual',tank:'t60',place:'office',name:'총무팀',note:'사무실에 넘김'}],
    restaurant:['주인은 단골 식당 사장에게 {n}을 넘겼습니다. 식당 입구 수조에 "행운을 부르는 물고기"라는 글씨가 붙었습니다.',{own:'casual',tank:x.cm>=30?'t120':'t90',place:'restaurant',name:'식당 사장',note:'식당에 넘김'}],
    club:['물생활 카페에 분양 글이 올라갔습니다. {n}은 다른 사람의 수조로 갔습니다.',{note:'분양 보냄'}],
    pond:['"어항에서는 이제 못 키우겠다." 주인은 마당에 연못이 있는 사람에게 {n}을 넘겼습니다.',{tank:'pond',own:R()<.5?'expert':'learner',note:'연못 있는 사람에게 보냄'}]}[o];
  q(null,null,()=>fRehome(T_[0],T_[1]));return true;
}
/* a new owner. Free fish online are also taken as live food for bigger fish */
function fRehome(text,opt){
  const f=S.f;opt=opt||{};
  q(T(text),'bad',()=>breakP(0,opt.note||'파양'));
  if(!opt.own&&/무료 분양/.test(text)&&R()<.22){
    const pred=pick(['oscar','arowana','channa','gar','bichir'].filter(s=>s!==S.sp.id));
    q(T('{n}을 데려간 사람은 "잘 키울게요"라고 했습니다. 그 사람의 수조에는 '+SP.find(s=>s.id===pred).name+'가 있었습니다.'),'sub');
    q(null,null,()=>fEnd('feeder',pred));return;
  }
  q(null,null,()=>{
    /* the old owner's broken promises are kept for 주마등 before the sheet is handed over */
    const broke=pledgeList().map((p,i)=>S.pl[i]?{p,n:[S.pl[i]].concat(S.pl[i].more||[]).map(r=>r.note+(r.mended?' → '+r.mended.label:'')),a:ageLabel(S.pl[i].age)}:null).filter(Boolean);
    (S.prevPl=S.prevPl||[]).push({o:S.o.name+' · '+(f.place?{classroom:'교실',office:'사무실',restaurant:'식당'}[f.place]:(FOWN[f.own]||{l:'유통업자'}).l),pls:broke});
    S.owners++;S.o=makeOwner();if(opt.name)S.o.name=opt.name;if(opt.place)S.o.fam=opt.place==='classroom'?'아이 있는 가족':'1인 가구';
    if(opt.tank==='pond')S.o.house='마당 있는 주택';
    /* a fish people like the look of is more often taken by someone who will try (charm) */
    const ck=clamp(1+(fst().c-35)/60,.6,1.8);
    const own=opt.own||wpick([['learner',35*ck],['casual',35/ck],['expert',12*ck],['gift',8],['content',10]]);
    setupOwner(own);
    if(opt.tank){f.tank=opt.tank;f.filter=fPickFilter(opt.tank,own);if(opt.tank==='pond'){f.net=R()<(own==='expert'?.8:.3)?1:0;f.lid=0;f.cycled=1;f.mates=f.mates.filter(m=>FX[m.id]&&FX[m.id].temp!=='trop')}}
    f.place=opt.place||null;f.moved=1;
    S.status=opt.place?{classroom:'교실 수조',office:'사무실 수조',restaurant:'식당 수조'}[opt.place]:'집';S.env=f.tank==='pond'?'pond':'tank';f.outgrown=0;f.ill=null;
    S.pl=S.pl.map(()=>null);drawPledges($('gamePledges'),true);
    addLog(T('{n}의 '+S.owners+'번째 주인은 '+(opt.place?S.o.name:FOWN[own].l)+'입니다. 새 집은 '+fTankLine()),'sub');
    remember(f.tank==='pond'?'하늘이 보이는 넓은 물. 낯선 물, 낯선 얼굴.':'낯선 물, 낯선 얼굴. 또 다른 집.',f.tank==='pond'?1.4:1);render();
  });
}
/* release into a Korean river: tropical fish meet the winter */
function fRelease(){
  const f=S.f;f.released=1;
  q(T(pick(['물이 쏟아졌고, {n}은 처음 보는 흙탕물 속으로 떨어졌습니다. 수조보다 훨씬 넓고, 훨씬 차가웠습니다.','주인이 수조를 기울였습니다. {n}은 물살과 함께 하천으로 미끄러져 들어갔습니다.'])),'bad',()=>{breakP(5,'하천에 방생');breakP(0,'끝까지 키우지 않고 놓아줌')});
  q(null,null,()=>{goWild('river')});
}
/* released goldfish and koi: once they are big and have seen a winter, herons stop being a threat and the river keeps them */
/* a natural death after several crises the fish got through */
function fWonLines(){const w=S.f.won||0;if(w<2)return null;
  return [T('{n}은 '+josa(ageLabel(S.ageM),'을')+' 살았습니다.'),T('그동안 {n}은 '+w+'번의 고비를 넘겼습니다. '+(fT('hide')>=3?'숨을 곳을 아는 물고기였습니다.':fT('bold')>=3?'물러서지 않는 물고기였습니다.':fT('social')>=3?'주인이 늘 들여다보는 물고기였습니다.':'운도 따랐습니다.')),T('어느 아침, {n}은 바닥에 가만히 누워 있었습니다. 이번에는 일어나지 않았습니다.')]}
/* a hazard as a crisis: ~1.7× as frequent as the old instant death, with a choice that can survive it */
function fCr(k,a){if(typeof CRISIS!=='undefined'&&CRISIS[k]&&!S.waiting){fCrisis(k,a);return true}render();fEnd(k,a);return true}
/* what the player's choices made of this fish: hide, bold, social, greed */
const fT=k=>S.f&&S.f.pick&&S.f.pick[k]||0;
/* a predator that has eaten its tankmates: the owner finds what is left in the morning */
function fShock(){
  const f=S.f,own=f.own,v=f.lastKill?(SP.find(s=>s.id===f.lastKill)||{}).name||'작은 물고기':'작은 물고기';f.shock=1;
  q(T(pick(['아침, 주인은 수조 바닥에서 배 속이 텅 빈 '+v+'를 건져 냈습니다. 비늘 몇 장만 물에 떠다녔습니다. {n}은 아무 일 없다는 듯 수조를 돌고 있었습니다.','주인이 수조를 들여다봤을 때, '+v+'는 머리만 남아 바닥에 가라앉아 있었습니다. {n}의 배가 불룩했습니다.','밤사이 '+josa(v,'이')+' 하나둘 사라졌습니다. 주인은 수초 사이에서 반쯤 남은 꼬리지느러미를 찾았습니다.'])),'bad',()=>{S.scaredT=0});
  if(own==='content'){q(T('주인은 그 장면을 영상으로 올렸습니다. 조회수가 평소의 열 배가 나왔습니다. 주인은 먹이용 물고기를 더 사 왔습니다.'),'bad',()=>{S.interest+=.1;fAddMates(3,true)});return true}
  const o=own==='learner'?wpick([['split',60],['rehome',30],['release',10]]):wpick([['release',45],['rehome',25],['keep',30]]);
  if(o==='split'){q(T('주인은 "합사가 아니었구나" 하며 {n}을 혼자 다른 수조로 옮겼습니다.'),'sub',()=>{f.mates=[];f.noMates=1});return true}
  if(o==='keep'){q(T('주인은 한동안 수조 쪽을 보지 않았습니다. 다시는 다른 물고기를 넣지 않았습니다.'),'sub',()=>{f.mates=f.mates.filter(m=>m.id===S.sp.id);f.noMates=1;S.interest-=.15});return true}
  if(o==='rehome'){q(null,null,()=>fRehome('"이런 걸 집에서 못 키우겠다." 주인은 {n}을 대형어 카페에 분양 글로 올렸습니다.',{note:'다른 물고기를 잡아먹었다며 분양 보냄'}));return true}
  q(T('주인은 질린 얼굴로 {n}을 들통에 담아 근처 저수지로 갔습니다. "가서 실컷 잡아먹어라."'),'bad');q(null,null,()=>fRelease());return true;
}
/* the shop keeper's advice: learners write it down, many casual owners laugh it off */
function fAdvice(own,shop){
  const f=S.f,x=fx_();
  if(!['shop','bigshop'].includes(shop)){if(shop==='mart'&&own!=='expert'&&R()<.5)q(T('마트 직원은 사료 한 통을 같이 계산해 주었습니다. 설명은 없었습니다.'),'sub');return}
  if(own==='learner'||(own==='casual'&&R()<.35)||(own==='gift'&&R()<.2)){
    f.advice=1;
    q(T(pick(['수족관 사장이 "물부터 잡고 넣으세요. 박테리아제 넣고 2주"라며 메모를 써 주었습니다. 주인은 휴대폰으로 메모를 찍었습니다.','사장은 '+fx_().cm+'cm까지 큰다는 걸 손으로 보여 주며 "수조는 미리 크게 가세요"라고 했습니다. 주인은 고개를 끄덕였습니다.','사장이 "처음엔 사료 하루 한 번, 2분 안에 먹을 만큼만"이라고 말해 주었습니다.'])),'good',()=>{
      f.cycled=f.cycled||R()<.7?1:0;if(x.temp==='trop'&&f.tank!=='pond')f.heater=1;if((x.jump||0)>=.3)f.lid=1;
      f.mates=f.mates.filter(m=>m.id===S.sp.id||fCompatible(S.sp.id,m.id));S.r=clamp(S.r+.1,0,.95);f.grow=1});
  } else if(['casual','gift','content'].includes(own)){
    f.stubborn=1;f.grow=0;
    q(T(pick(['사장이 "그 어항은 너무 작아요"라고 했지만, 주인은 "괜찮아요, 금방 안 커요"라며 웃었습니다.','사장이 "물부터 잡으셔야 해요"라고 하자 주인은 "그냥 수돗물 받아 넣으면 되죠?"라고 되물었습니다. 사장은 더 말하지 않았습니다.','"같이 넣으면 안 되는 애들이에요." 사장의 말에 주인은 "어차피 다 물고기잖아요"라고 했습니다.'])),'bad');
  }
}
/* tank politics: fights with its own kind, bullies, and what this fish does to the others */
function fBehave(m,hit){
  const f=S.f,me=S.sp.id,B=fbOf(me),cramp=tankL()<fx_().minL?1.6:.7,cover=f.hides?.7:1;
  // its own kind
  const terr=fTerr(me);
  if(fSameCount()>0&&terr>0&&hit(.06*terr*cramp*cover)){
    if(terr>=.7&&R()<.45){render();fEnd('fight');return true}
    const win=R()<.3+fst().p/100*.45;
    if(win){const mm=f.mates.find(x=>x.id===me&&x.n>0);if(terr>=.5&&R()<.5){mm.n--;say('{n}이 같은 종 한 마리와 밤새 싸웠습니다. 아침에 진 쪽은 바닥에 누워 있었습니다. 주인은 그 물고기를 건져 냈습니다.','bad')}else say('{n}이 같은 종과 영역을 두고 다퉜습니다. {n}이 이겼습니다.','neutral')}
    else{f.fin+=.15*fPowK();S.health-=10*fPowK();f.stress+=.1;say(pick(['{n}이 같은 종과 싸워 졌습니다. 꼬리지느러미가 반쯤 뜯겨 나갔고, 뜯긴 자리에서 붉은 실 같은 피가 물에 풀렸습니다.','밤새 싸웠습니다. {n}의 옆구리 비늘이 한 줄로 벗겨져 분홍색 살이 드러났습니다.']),'bad')}
    f.mates=f.mates.filter(x=>x.n>0);render();return false}
  // a bully in the tank
  const bl=fBully();
  if(bl&&hit(.05*fbOf(bl.id).hostile*Math.min(3,bl.n)*cramp*cover)){
    if(S.health<45*fPowK()||R()<.2*fbOf(bl.id).hostile*fPowK()){render();fEnd('mauled',bl.id);return true}
    f.fin+=(fbOf(bl.id).nip?.2:.1)*fPowK();S.health-=8*fPowK();f.stress+=.1;S.scaredT=2;
    say(fbOf(bl.id).nip?josa(mateName(bl),'이')+' {n}의 지느러미를 한 입씩 뜯어 갔습니다. 너덜너덜한 지느러미 끝이 붉게 물들었습니다.':josa(mateName(bl),'이')+' {n}을 수조 끝까지 쫓아가 물었습니다. 물린 자리의 비늘이 떨어져 나가고 피가 배어 나왔습니다.','bad');render();return false}
  // what this fish does to the others
  if(B.hostile>0){
    const v=f.mates.filter(x=>x.n>0&&x.id!==me&&!x.feed&&(x.cm<=f.len*1.3||B.nip)&&fbOf(x.id).hostile<B.hostile);
    if(v.length&&hit(.07*B.hostile*cramp)){const t=pick(v);t.n--;f.kills=(f.kills||0)+1;f.lastKill=t.id;f.mates=f.mates.filter(x=>x.n>0);
      say(B.nip?'{n}이 '+mateName(t)+'의 지느러미를 며칠에 걸쳐 다 뜯어 먹었습니다. 그 물고기는 바닥에 누운 채 다시 일어나지 못했습니다.':'{n}이 '+josa(mateName(t),'을')+' 며칠 동안 쫓아다녔습니다. 결국 그 물고기는 물린 자리투성이로 수면에 떠올랐습니다.','bad');
      if(f.own!=='content')S.interest-=.03;render();return false}
  }
  return false;
}
const _wildTick=wildTick;
wildTick=function(){
  if(S.f&&S.wild&&S.f.released){const f=S.f,x=fx_(),w=wildOf();
    if(fT('bold')>=2&&!(S.cd.pred>S.tick)&&R()<.4)S.cd.pred=S.tick+1;
    if((x.big||x.pred)&&f.len>=15&&R()<.012*S.dt){render();fEnd('angler');return}
    /* a tropical fish may find the warm outflow of a power plant before winter */
    if(x.coldWild<.4&&season()==='autumn'&&!f.warmTried){f.warmTried=1;if(R()<.18+fT('bold')*.08+(x.pred?.12:0)){f.warm=1;addLog(T('찬 바람이 불기 시작할 무렵, {n}은 미지근한 물이 흘러드는 물목을 찾아냈습니다. 발전소 온배수였습니다.'),'good');remember('겨울인데도 물이 따뜻했다.',1.5)}}
    if(f.warm){f.warmM=(f.warmM||0)+S.dt;if(x.pred&&f.warmM>=12){render();fEnd('apex');return}
      /* a big fish that is not a hunter (pleco, clown loach) settles in the warm water without ruling it */
      if(!x.pred&&x.big&&f.warmM>=18){addLog(T('{n}은 온배수 물목의 바닥에 자리를 잡았습니다. 그 물목에는 이제 {n}을 닮은 물고기가 몇 마리 더 보였습니다.'),'sub');return wildSurvived()}
      const c0=w.cold;w.cold=.97;try{_wildTick()}finally{w.cold=c0}return}
    f.len=Math.min(x.cm*(isGold()?1.4:1),f.len+S.dt*(x.temp==='trop'?.1:.6));
    const hardy=x.coldWild>=.4;
    if(hardy&&!S.flags.wintered&&R()<.5)S.cd.pred=Math.max(S.cd.pred||0,S.tick+1);
    if(hardy&&S.flags.wintered&&f.len>=Math.min(10,x.cm*.5)){f.wildM=(f.wildM||0)+S.dt;S.cd.pred=S.tick+3;
      if(f.wildM>=8){addLog(T(isGold()?'{n}은 하천의 누런 붕어들 사이에 섞여 들어갔습니다. 몸은 팔뚝만 해졌습니다.':S.sp.id==='koi'?'{n}은 하천에서 가장 큰 물고기가 되었습니다. 왜가리도 {n}을 건드리지 않았습니다.':'{n}은 그 하천의 물에 몸이 익었습니다. 이제 {n}을 노리는 것은 없었습니다.'),'sub');return wildSurvived()}}
  }
  return _wildTick();
};
/* options for a situation: up to two of this temperament, one of this kind of fish, the rest general; outcomes rolled on choice */
function fBuildOpts(c){
  const ok=o=>(!o.t||[].concat(o.t).includes(S.temper))&&(!o.g||fGroup(o.g))&&(!o.need||o.need())&&(typeof pondOK!=='function'||pondOK(optTexts(o)));
  const pool=c.o.filter(ok),shuf=a=>a.map(x=>[R(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
  const tem=shuf(pool.filter(o=>o.t)).slice(0,2),sp=c.gen?[]:shuf(pool.filter(o=>o.g&&!o.t)).slice(0,1);
  let o=tem.concat(sp);o=o.concat(shuf(pool.filter(x=>!x.t&&(c.gen||!x.g))).slice(0,Math.max(1,4-o.length))).slice(0,4);
  return shuf(o).map(x=>({l:x.l,d:[x.d,x.t?TTAG[S.temper]:x.g&&typeof x.g==='string'?GTAG[x.g]||'':''].filter(Boolean).join(' · '),c:'neutral',r:'',
    fx:()=>{const k=x.k||(x.t?{shy:'hide',curious:'bold',feisty:'bold',friendly:'social',glutton:'greed'}[S.temper]:null);if(k&&S.f){(S.f.pick=S.f.pick||{})[k]=(S.f.pick[k]||0)+1}
      /* in a crisis, guts makes the surviving outcomes likelier */
      const outs=x.out.map(z=>[z,(typeof z[0]==='function'?Math.max(0,z[0]()):z[0])*(c.crisis&&z[3]!==die&&S.f?fGutsK():1)]).filter(z=>z[1]>0);if(!outs.length)return;const z=wpick(outs);
      const tx=typeof z[1]==='function'?z[1]():z[1];
      if(tx)addLog(T(tx),z[2]||'neutral');if(z[3])z[3]();if(z[4])remember(z[4],1.2);
      /* every choice leaves a little on the fish; then the room may do something nobody chose */
      if(S.f&&!S.ending&&!S.done){const sk={hide:'w',bold:'g',social:'c',greed:'p'}[k];if(sk)fStat(sk,2);
        if(!c.crisis&&!c.noTwist&&!S.preOwner&&!S.wild&&S.f.own&&R()<.14)fTwist()}}}));
}
/* the shared newOwner (used by inheritance and wild rescue) goes through fRehome for fish */
const _newOwner=newOwner;
newOwner=function(text,from,rf,opt){if(S&&S.f&&!S.wild)return fRehome(text);if(S&&S.f&&S.wild){S.wild=false;S.f.released=0;return fRehome(text)}return _newOwner(text,from,rf,opt)};

/* ---------- endings ---------- */
const fPredName=id=>id?(SP.find(s=>s.id===id)||{}).name||'큰 물고기':'큰 물고기';
const FEND={
 capture:{cat:'포획',fx:'f-net',fact:'fChain',l:()=>pick([['그물 속에서 {n}은 다른 물고기들 밑에 깔렸습니다.','배에 실린 양동이 물은 한낮의 햇볕에 금세 데워졌습니다. 양동이를 비울 때, {n}은 바닥에서 움직이지 않았습니다.'],['채집꾼들이 물고기를 그물 쪽으로 몰려고 강바닥을 발로 휘저었습니다. 흙탕물이 일었습니다.','그물이 올라왔을 때 {n}의 아가미에는 진흙이 가득 차 있었습니다. 채집꾼은 {n}을 강둑에 던지고 다음 그물을 펼쳤습니다.']])},
 holding:{cat:'유통',fx:'f-bucket',fact:'fChain',l:()=>pick([['창고 바닥에는 물고기가 든 대야와 봉지가 줄지어 있었습니다. 물은 며칠째 갈리지 않았습니다.','대야를 비울 때, {n}은 죽은 물고기들 사이에 섞여 쏟아졌습니다.'],['수출업자의 창고에서 {n}은 같은 종 수백 마리와 한 수조에 들어갔습니다. 하룻밤 사이 그 수조에 병이 번졌습니다.','아침에 직원들은 수면에 뜬 것들을 뜰채로 걷어 냈습니다. 그 안에 {n}도 있었습니다. 장부의 숫자가 하나 줄었습니다.']])},
 transport:{cat:'운송',fx:'f-box',fact:'fChain',l:()=>pick([['상자가 열린 건 서른여섯 시간 뒤였습니다.','봉지 속 물은 뿌옇게 흐려져 있었고, {n}은 봉지 바닥에 옆으로 누워 있었습니다. 같은 상자의 봉지 몇 개도 그랬습니다.'],['상자는 서류 문제로 공항 화물 터미널에 하루 더 묶여 있었습니다.','봉지 속 산소가 먼저 바닥났고, 그다음은 {n}의 차례였습니다.'],['상자가 거꾸로 실렸습니다. 흔들리던 봉지 하나가 터졌고, 물은 스티로폼 바닥으로 다 빠져나갔습니다.','상자를 연 직원은 마른 봉지 속에서 {n}을 꺼내 수를 세었습니다. 송장에는 "운송 폐사"라는 칸이 따로 있었습니다.']])},
 quarantine:{cat:'검역',fx:'f-shop',fact:()=>fishIs('scaleless')?'fMed':'fChain',l:()=>['수조에 기생충을 잡는 약이 풀렸습니다.',fishIs('scaleless')?'비늘 없는 {n}의 몸에는 그 양이 너무 많았습니다. 다음 날 아침, {n}은 수조 바닥에 하얗게 질려 있었습니다.':'긴 여행에 지친 {n}은 그 물을 버티지 못했습니다. 직원은 뜰채로 {n}을 건져 다른 죽은 물고기들과 함께 비닐봉지에 담았습니다.']},
 unsold:{cat:'미판매',fx:'f-unsold',fact:'fUnsold',l:()=>['같은 날 들어온 물고기들은 하나둘 팔려 나갔습니다. {n}의 가격표는 두 번 바뀌었습니다. 처음엔 "특가", 그다음엔 "떨이".','아무도 {n}을 고르지 않았습니다. 판매 수조에서 몇 달을 보내는 동안 {n}의 색은 바래고 지느러미는 접혔습니다.','어느 아침 {n}은 수조 구석에 가라앉아 있었고, 같은 수조의 물고기들이 그 몸을 쪼고 있었습니다. 직원은 뜰채로 {n}을 건져 쓰레기통에 넣었습니다.']},
 unsoldfeed:{cat:'미판매',fx:'f-shopeaten',fact:'fUnsold',l:p=>['몇 달이 지나도 {n}은 팔리지 않았습니다. 자리만 차지한다는 말이 나왔습니다.','직원은 {n}을 뜰채로 건져 매장 전시 수조에 넣었습니다. 그 수조의 '+fPredName(p)+'에게 그날은 먹이 주는 날이었습니다.']},
 shopmate:{cat:'판매 수조 합사',fx:'f-shopeaten',fact:'fShopMix',l:p=>['판매 수조에는 크기가 제각각인 물고기들이 섞여 있었습니다. 그중에는 '+fPredName(p)+'도 있었습니다.','밤사이 '+josa(fPredName(p),'이')+' 수조를 돌았습니다. 아침에 직원이 마릿수를 세었을 때, {n}은 없었습니다.']},
 shopnip:{cat:'판매 수조 합사',fx:'f-shopnip',fact:'fShopMix',l:p=>['같은 판매 수조에 '+josa(fPredName(p),'이')+' 몇 마리 섞여 있었습니다.','{n}의 긴 지느러미는 며칠 만에 너덜너덜해졌습니다. 뜯긴 자리에 하얀 곰팡이가 피었습니다.','직원은 "상품성이 없다"며 {n}을 건져 냈습니다. 수조 앞 가격표는 그대로였습니다.']},
 shop:{cat:'판매 수조',fx:'f-shop',fact:'fWater',l:()=>['판매 수조 수십 개가 한 여과 장치로 이어져 있었습니다. 물이 이어져 있으니 병도 이어졌습니다.','{n}은 가격표가 붙은 수조 바닥에 가라앉았습니다. 직원은 아침마다 죽은 물고기를 건져 냈고, 빈자리는 새 물고기로 채워졌습니다.']},
 cull:{cat:'도태',fx:'f-bucket',fact:()=>S.sp.id==='betta'?'fCulled':'fBreed',l:()=>[S.sp.id==='betta'?'{n}의 꼬리 끝이 조금 찢어져 있었습니다.':S.sp.id==='koi'?'{n}의 무늬는 "볼품없다"는 판정을 받았습니다.':'{n}의 지느러미 모양이 기준에 맞지 않았습니다.','"팔 수 없는" 물고기는 산 것과 죽은 것이 뒤섞인 양동이에 쏟아졌습니다. 양동이는 그날 저녁 근처 수로에 비워졌습니다.']},
 delivery:{cat:'택배',fx:'f-box',fact:'fChain',l:()=>[S.f.shipHot?'한여름, 택배 상자는 하루 늦게 도착했습니다. 트럭 짐칸은 40도가 넘었습니다.':'한겨울, 택배 상자는 하루 늦게 도착했습니다. 핫팩은 이미 식어 있었습니다.','상자를 연 주인은 봉지 속에서 배를 뒤집은 {n}을 보았습니다. 판매자는 "사진을 보내 주시면 환불해 드린다"고 답했습니다.']},
 stall:{cat:'뜰채 체험',fx:'f-stall',fact:'fFair',l:()=>['밤 열한 시, 풀의 물은 미지근했고 비린내가 났습니다. 수백 마리가 한 물을 나눠 썼고, 물은 한 번도 갈리지 않았습니다.','종이 뜰채가 하룻밤에 수백 번 물을 휘저었습니다. {n}은 몇 번이나 뜰채에 걸렸다 떨어졌습니다.','새벽, 상인이 물 위에 뜬 금붕어들을 뜰채로 걷어 쓰레기봉투에 담았습니다. {n}도 그 안에 있었습니다.']},
 stalltrash:{cat:'버려짐',fx:'f-trash',fact:'fFair',l:()=>['야시장이 끝난 새벽, 상인은 풀의 물을 하수구로 빼냈습니다.','바닥에 남은 금붕어들은 쓰레받기에 쓸려 음식물 쓰레기통에 쏟아졌습니다. {n}은 그 안에서 한동안 입을 뻐끔거렸습니다.']},
 fairbag:{cat:'경품',fx:'f-bag',fact:'fFair',l:()=>['{n}은 손바닥만 한 비닐봉지에 담겨 축제장을 돌아다녔습니다. 봉지는 아이 손에서 이리저리 흔들렸습니다.','집에 도착했을 때 봉지 속 물은 미지근했고, {n}은 봉지 구석에 기대어 움직이지 않았습니다. 봉지는 그대로 쓰레기통에 들어갔습니다.']},
 cycle:{cat:'물잡이 실패',fx:'f-float',fact:'fCycle',pl:[[2,'물잡이 없이 바로 넣음']],l:()=>['새 수조에는 아직 물을 맑게 해 줄 박테리아가 없었습니다. 배설물과 남은 사료가 암모니아로 바뀌어 쌓였습니다.','{n}의 아가미가 거칠게 부풀고 숨이 가빠졌습니다. 주인은 "물이 맑은데 왜 그러지" 하며 사료를 더 넣었습니다.','수조에 온 지 '+durLabel(S.f.tankAge)+' 만에, {n}은 배를 뒤집고 떠올랐습니다.']},
 neglect:{cat:'방치',fx:'f-float',fact:()=>tankL()<10?(isGold()?'fBowl':'fBowlAny'):'neglectFish',pl:[[2,'물을 갈지 않음']],l:()=>[tankL()<10?'좁은 어항의 물은 며칠 만에 썩어 갔습니다.':'물을 갈지 않은 지 오래, 수조 바닥에 찌꺼기가 쌓이고 물에서 냄새가 났습니다.','{n}은 수면에서 입을 뻐끔거리다, 어느 날 아침 배를 뒤집었습니다.',['casual','gift'].includes(S.f.own)?'주인은 {n}을 뜰채로 건져 변기에 넣고 물을 내렸습니다.':'주인은 그제야 수조를 들여다보았습니다.']},
 oxygen:{cat:'산소 부족',fx:'f-float',fact:'fO2',pl:[[2,'정전·폭염 대비 없음']],l:()=>[season()==='summer'?'열대야가 이어지던 밤, 정전으로 여과기가 멈췄습니다. 미지근한 물에서 산소가 빠져나갔습니다.':'한겨울 밤, 정전으로 여과기와 히터가 함께 멈췄습니다.',fLoad()>1?'비좁은 수조의 물고기들이 모두 수면으로 몰려 입을 뻐끔거렸습니다.':'{n}은 수면에서 입을 뻐끔거렸습니다.','전기가 다시 들어왔을 때, {n}은 수면 아래 비스듬히 떠 있었습니다.']},
 cold:{cat:'동사',fx:'f-ice',fact:'fO2',pl:[[2,'겨울에 히터 없이 둠']],l:()=>[S.f.tank==='pond'?'겨울이 왔습니다. 연못에 살얼음이 끼었습니다.':S.f.heater?'한겨울 밤, 히터가 고장 났습니다. 주인은 주말에 새로 사겠다고 했습니다.':'한겨울, 수조에는 히터가 없었습니다. 베란다 쪽 방의 물은 밤마다 차가워졌습니다.','열대의 물에서 온 {n}의 몸은 조금씩 굳어 갔습니다. 지느러미가 접히고, 아가미가 느려졌습니다.','아침, {n}은 차가운 바닥에 옆으로 누워 있었습니다.']},
 cook:{cat:'과열',fx:'f-cook',fact:'accident',pl:[[3,'히터 점검 안 함']],l:()=>['히터의 온도 조절기가 고장 나 꺼지지 않았습니다.','수온계가 38도를 넘었습니다. 물은 데워진 국물처럼 뿌옇게 흐려졌습니다.','{n}은 수면 가까이에서 하얗게 질린 채 떠 있었습니다.']},
 disease:{cat:'질병',fx:'f-bottom',fact:()=>DZ[S.f.ill.id].fact,pl:[[1,'치료하지 않음']],l:()=>{const d=DZ[S.f.ill.id];return [S.f.ill.treating?'치료는 너무 늦게 시작되었습니다.':S.f.ill.noticed?'주인은 지켜보기만 했습니다.':'아무도 {n}이 아프다는 걸 알아차리지 못했습니다.','{n}은 '+josa(d.n,'을')+' 이기지 못했습니다. 수조 바닥, 장식 뒤에서 {n}은 조용히 숨을 멈췄습니다.']}},
 eaten:{cat:'합사',fx:'f-eaten',fact:'합사할 때는 지금 크기가 아니라 다 자랐을 때의 크기와 식성을 봐야 합니다. 입에 들어가는 물고기는 먹이입니다.',pl:[[3,'큰 육식어와 합사']],l:p=>['같은 수조의 '+josa(fPredName(p),'은')+' 하루가 다르게 자랐습니다.','어느 밤, '+josa(fPredName(p),'이')+' 수조를 한 바퀴 돌았습니다. 아침에 {n}은 보이지 않았고, '+fPredName(p)+'의 아가미 사이로 꼬리지느러미 끝이 비쳤습니다.']},
 nipped:{cat:'합사',fx:'f-nipped',fact:'fWater',pl:[[3,'지느러미 뜯는 물고기와 합사']],l:()=>['{n}의 지느러미는 매일 조금씩 뜯겨 나갔습니다.','뜯긴 자리에 하얀 곰팡이가 피었고, 지느러미는 다시 자라지 않았습니다.','{n}은 지느러미 없는 몸으로 바닥에 누웠습니다.']},
 mauled:{cat:'합사',fx:'f-nipped',fact:'fTemper',pl:[[3,'공격적인 물고기와 합사']],l:p=>{const nm=fPredName(p);return [fbOf(p).nip?'같은 수조의 '+josa(nm,'이')+' 매일 {n}의 지느러미를 한 조각씩 뜯어 갔습니다.':'같은 수조의 '+josa(nm,'은')+' {n}이 보이기만 하면 쫓아왔습니다. {n}은 숨을 곳을 찾아 수조 구석만 맴돌았습니다.','지느러미는 실처럼 갈라지고, 몸 옆에는 물린 자국이 늘어 갔습니다. 주인은 "물고기끼리 장난치는 것"이라고 했습니다.','어느 아침, {n}은 수초 뒤에서 움직이지 않았습니다. '+josa(nm,'은')+' 아무 일 없다는 듯 수조를 돌고 있었습니다.']}},
 fight:{cat:'싸움',fx:'f-nipped',fact:'fBetta',pl:[[3,'싸우는 물고기를 합사']],l:()=>[S.sp.id==='betta'?'주인은 "둘이면 덜 외롭겠지"라며 수조에 베타 한 마리를 더 넣었습니다.':'같은 수조에 같은 종 수컷이 한 마리 더 있었습니다.',(['betta','wildbetta'].includes(S.sp.id)?'둘은 밤새 아가미를 펴고 싸웠습니다.':'둘은 밤새 서로를 쫓으며 지느러미를 물어뜯었습니다.')+' 아침, {n}의 지느러미는 실처럼 찢겨 있었습니다.','{n}은 수초 뒤에서 다시 나오지 않았습니다.']},
 stress:{cat:'스트레스',fx:'f-bottom',fact:'fCrowd',pl:[[2,'좁고 붐비는 수조']],l:()=>['좁고 붐비는 수조에서 {n}은 하루도 마음 편히 헤엄치지 못했습니다.','색이 바래고, 먹이를 거르고, 지느러미를 접은 채 구석에서 지냈습니다.','어느 날 {n}은 그 구석에서 움직이지 않았습니다.']},
 jump:{cat:'점프사',fx:'f-floor',fact:'fJumpF',pl:[[3,'수조 뚜껑 없음']],l:()=>['한밤중, {n}이 수면 위로 몸을 날렸습니다. 뚜껑은 없었습니다.','{n}은 마룻바닥에 떨어져 한참 몸을 퍼덕였습니다. 집 안의 누구도 깨어나지 않았습니다.','아침에 발견된 {n}은 먼지가 들러붙은 채 말라 있었습니다.']},
 escape:{cat:'탈출',fx:'f-escape',fact:()=>S.sp.id==='channa'?'fChanna':'fBichir',pl:[[3,'수조 틈을 막지 않음']],l:()=>['전선이 지나가는 뚜껑 틈이 손가락 두 개만큼 벌어져 있었습니다.','{n}은 그 틈으로 몸을 밀어 넣고 바닥으로 미끄러져 내려갔습니다. 물을 찾아 기어간 곳은 장식장 밑이었습니다.','며칠 뒤 냄새를 따라 장식장을 들어낸 주인은 먼지를 뒤집어쓴 채 말라붙은 {n}을 찾았습니다.']},
 noair:{cat:'질식',fx:'f-bottom',fact:'fBichir',pl:[[2,'수면 공기층을 막음']],l:()=>['뚜껑과 수면 사이에 틈이 없었습니다.','공기로 숨을 쉬어야 하는 {n}은 수면에 입을 대고 계속 부딪쳤습니다.','{n}은 물속에서 숨이 막혀 죽었습니다. 물고기가 물에 빠져 죽을 수도 있다는 걸 주인은 몰랐습니다.']},
 intake:{cat:'사고',fx:'f-intake',fact:'accident',pl:[[3,'흡입구에 망을 씌우지 않음']],l:()=>['여과기 흡입구에는 망이 씌워져 있지 않았습니다.','작은 {n}의 몸이 물살에 끌려 흡입구에 붙었습니다. 다시 떨어지지 못했습니다.']},
 tapwater:{cat:'중독',fx:'f-float',fact:'fChlor',pl:[[2,'수돗물을 그대로 부음']],l:()=>['오랜만에 물을 갈았습니다. 염소를 빼지 않은 수돗물을, 온도도 맞추지 않고 한 번에 다 바꿨습니다.','{n}은 몇 번 몸을 뒤틀더니 한 시간 만에 수면으로 떠올랐습니다.']},
 shock:{cat:'수질 쇼크',fx:'f-float',fact:'fTemp',pl:[[2,'물을 한 번에 다 바꿈']],l:()=>['주인이 수조 물을 한 번에 거의 다 갈았습니다. 새 물은 차갑고, {n}이 살던 물과 너무 달랐습니다.','{n}은 바닥으로 가라앉아 아가미만 빠르게 움직이다 멈췄습니다.']},
 poison:{cat:'중독',fx:p=>p==='hot'?'f-cook':'f-poison',fact:p=>p==='med'?'fMed':p==='soju'?'fLaw':'accident',pl:[[3,'수조에 독이 들어감']],l:p=>p==='hot'?['주인이 수조 청소를 한다며 뜨거운 물로 자갈과 여과재를 헹궜습니다. 식히는 걸 잊었습니다.','새 물을 붓자 수조 위로 김이 올랐습니다.','{n}은 몇 번 몸을 뒤틀더니, 하얗게 익은 눈으로 떠올랐습니다.']:p==='soap'?['주인이 수조 유리를 주방 세제로 닦고 대충 헹궜습니다.','물 위에 무지갯빛 막이 떴습니다. {n}의 아가미가 하얗게 질렸습니다.','그날 밤 수조의 물고기들은 하나도 남지 않았습니다.']
  :p==='spray'?['모기가 많던 밤, 주인이 방 안 가득 살충제를 뿌렸습니다. 수조 뚜껑은 열려 있었습니다.','다음 날 아침 수조 안의 물고기들은 모두 바닥에 누워 있었습니다.']
  :p==='soju'?['술자리에서 친구가 "물고기도 한잔해야지"라며 소주를 수조에 부었습니다. 다들 웃었습니다.','{n}은 수조 안을 미친 듯이 돌다가, 옆으로 기울어 떠올랐습니다.']
  :['주인이 인터넷 카페에서 본 대로 약을 탔습니다. 양은 "넉넉하게"였습니다.',fishIs('scaleless')?'비늘 없는 {n}에게는 치사량이었습니다.':'{n}의 아가미가 하얗게 질렸습니다.','다음 날 {n}은 바닥에 누워 있었습니다.']},
 squeeze:{cat:'학대',fx:'f-hand',fact:'fLaw',pl:[[3,'아이 손에 맡김']],l:()=>['아이가 수조에 손을 넣어 {n}을 움켜쥐었습니다. "잡았다!"','{n}은 작은 손 안에서 몸을 비틀었습니다. 아이는 놓지 않았습니다.','바닥에 떨어진 {n}은 다시 헤엄치지 못했습니다. 어른들은 "물고기니까" 하고 웃어넘겼습니다.']},
 swallow:{cat:'학대',fx:'f-glass',fact:'fLive',pl:[[3,'술자리에 물고기를 내줌']],l:()=>['술자리가 길어지자 누군가 휴대폰 카메라를 켜며 말했습니다. "영상 하나 찍자."','{n}은 소주잔에 담겨 탁자 위에 올려졌습니다.','잔이 비었습니다. 영상은 그날 밤 SNS에 올라갔습니다.']},
 feeder:{cat:'먹이',fx:'f-eaten',fact:'fLive',pl:[[0,'다른 물고기의 먹이로 넘김']],l:p=>[S.f.own==='content'?'"오늘은 특식." 주인이 카메라를 켜고 뜰채로 {n}을 떴습니다.':'{n}은 '+fPredName(p)+'의 수조 위에서 뜰채째 기울여졌습니다.','{n}은 '+fPredName(p)+'의 수조에 떨어졌습니다. 한 번 꼬리를 쳤고, 그걸로 끝이었습니다.']},
 sink:{cat:'사고',fx:'f-toilet',fact:'fFlush',pl:[[3,'세면대에 물고기를 풀어 놓음']],l:()=>['세면대 배수구 마개는 빠져 있었습니다.','{n}은 물살과 함께 배수구로 빨려 들어갔습니다. 주인은 배수관을 한참 들여다보다가 수도꼭지를 잠갔습니다.']},
 flushalive:{cat:'학대',fx:'f-toilet',fact:'fFlush',pl:[[0,'산 채로 변기에 버림']],l:p=>[p==='swimb'?'배를 뒤집고 떠 있는 {n}을 본 주인은 죽은 줄 알았습니다.':p==='rest'?'{n}이 다른 로치들처럼 바닥에 옆으로 누워 쉬고 있었습니다. 주인은 죽은 줄 알았습니다.':'"어차피 죽을 거." 주인은 바닥에 가라앉은 {n}을 뜰채로 건졌습니다.','{n}은 변기에 쏟아졌습니다. 그때 {n}의 지느러미는 아직 움직이고 있었습니다. 물 내리는 소리가 났습니다.']},
 trash:{cat:'버려짐',fx:'f-trash',fact:'fFlush',pl:[[0,'산 채로 쓰레기통에 버림']],l:()=>['주인은 "어차피 죽을 거"라며 {n}을 비닐봉지에 담아 쓰레기통에 넣었습니다.','봉지 안에는 물이 한 줌 남아 있었습니다. 뚜껑이 닫혔습니다.']},
 freezer:{cat:'학대',fx:'f-freezer',fact:'fFlush',pl:[[1,'냉동실에 넣어 처리']],l:()=>['인터넷에서 "냉동실에 넣으면 잠들듯 간다"는 글을 본 주인은 {n}을 물과 함께 지퍼백에 담아 냉동실에 넣었습니다.','물은 바깥부터 얼어 들어왔습니다. {n}은 얼음이 다 차오를 때까지 지느러미를 움직였습니다.']},
 euth:{cat:'안락사',fx:'f-euth',fact:'fEuth',l:()=>['치료할 수 없는 병이었습니다. 주인은 {n}이 괴로워하는 걸 더 보고 있을 수 없었습니다.','작은 통에 수조 물을 담고 정향유를 몇 방울씩 천천히 떨어뜨렸습니다. {n}은 서서히 잠들었고, 다시 깨어나지 않았습니다.','주인은 {n}을 화분 흙에 묻었습니다.']},
 starve:{cat:'굶주림',fx:p=>p==='curl'?'f-curl':'f-thin',fact:p=>p==='beak'?'fBeak':p==='curl'?'fMotoro':p==='vacation'?'neglectFish':'fWild',pl:p=>p==='vacation'?[[2,'여행 가며 방치']]:p==='beak'?[[2,'단단한 먹이를 주지 않음']]:null,l:p=>p==='beak'?['자라난 이빨이 {n}의 입을 막았습니다. 먹이를 물어도 삼킬 수가 없었습니다.','{n}은 사료 앞에서 입만 뻐끔거리다 말라 갔습니다.']
  :p==='curl'?['수입될 때부터 마른 몸이던 {n}은 수조에 와서도 먹이를 거의 먹지 않았습니다.','꼬리 쪽 뼈가 도드라지고, 두 눈 사이가 움푹 꺼졌습니다. 몸 가장자리가 위로 말려 올라갔습니다.','{n}은 말린 몸 그대로 바닥에 멈췄습니다.']
  :p==='vacation'?['먹이 블록은 이틀 만에 녹아 물을 흐렸고, 그 뒤로는 아무것도 없었습니다.','주인이 돌아왔을 때 수조는 조용했습니다.']
  :['{n}은 고향 강에서 먹던 것과 다른 먹이를 끝내 받아들이지 못했습니다.','하루하루 배가 꺼졌습니다. 수조 바닥에는 먹지 않은 사료가 쌓여 썩어 갔습니다.','{n}은 사료 알갱이 사이에 누웠습니다.']},
 stunt:{cat:'성장 정체',fx:'f-bent',fact:()=>fx_().big?'fOutgrow':isGold()?'fBowl':'fBowlAny',pl:[[2,'몸보다 작은 수조']],l:()=>['{n}의 몸은 더 자라야 했지만 수조가 허락하지 않았습니다.','몸은 자라지 못했고, 등은 휘었습니다. 돌아설 때마다 유리벽에 부딪혔습니다.','{n}은 자기 몸에 맞지 않는 수조에서 생을 마쳤습니다.']},
 breedout:{cat:'번식 소모',fx:()=>S.f.fedOff?'f-eaten':'f-bottom',fact:'fBreed',pl:()=>S.f.fedOff?[[4,'쉬지 않고 번식시킴'],[0,'쓸모없어지자 대형어 먹이로 넘김']]:[[4,'어미를 쉬지 않고 번식시킴']],l:()=>fem()?['{n}은 몇 달마다 알을 낳았고, 쉬는 기간은 없었습니다.','배는 늘 부풀었다 꺼졌고, 몸은 점점 말라 갔습니다.',(S.f.spawns||4)+'번째 산란 뒤, {n}은 산란통 바닥에서 일어나지 못했습니다.']:['{n}은 수컷 한 마리로 여러 암컷과 차례로 짝지어졌습니다.','짝짓기 때마다 지느러미가 찢기고 몸에 상처가 늘었습니다.','더 이상 쓸모가 없어진 {n}은 대형어 수조의 먹이로 넘겨졌습니다.']},
 pond:{cat:'잡아먹힘',fx:'f-pond',fact:'fKoi',pl:[[3,'연못에 그물을 치지 않음']],l:()=>['새벽, 연못가에 왜가리 한 마리가 내려앉았습니다.','긴 부리가 물속으로 꽂혔습니다. 아침에 주인이 본 건 연못가 돌 위의 비늘 몇 장뿐이었습니다.']},
 burst:{cat:'사고',fx:'f-burst',fact:'fBurst',pl:[[3,'수평이 안 맞는 받침에 수조를 둠']],l:()=>['새벽 세 시, 거실에서 "퍽" 하는 소리가 났습니다.','한쪽으로 기운 받침 위에서 몇 달을 버티던 실리콘 이음매가 터졌습니다. '+tankL()+'리터의 물이 한꺼번에 쏟아졌습니다.','{n}은 거실 바닥 물웅덩이에서 퍼덕였습니다. 물은 마룻바닥 틈으로 빠르게 스며들었습니다. 주인이 불을 켰을 때, {n}은 유리 조각 사이에 누워 있었습니다.']},
 cat:{cat:'사고',fx:'f-cat',fact:'fCat',pl:[[3,'고양이 있는 집에 뚜껑 없는 수조']],l:()=>['주인이 출근한 오후, 고양이가 수조 위 선반에 올라앉았습니다.','앞발이 수면을 몇 번 휘저었습니다. 세 번째에 {n}이 걸려 나왔습니다.','저녁에 주인이 찾은 건 소파 밑의 {n}과, 바닥에 찍힌 젖은 발자국이었습니다. 고양이는 {n}을 먹지도 않았습니다.']},
 siphon:{cat:'사고',fx:'f-siphon',fact:'accident',pl:[[3,'물갈이 때 물고기를 확인하지 않음']],l:()=>['주인이 사이펀 호스로 바닥 찌꺼기를 빨아내며 휴대폰을 보고 있었습니다.','작은 {n}이 호스 입구로 끌려 들어갔습니다. 아무도 보지 못했습니다.','{n}은 더러운 물과 함께 양동이 바닥에 떨어졌고, 양동이 물은 그대로 하수구에 쏟아졌습니다.']},
 sun:{cat:'과열',fx:'f-sun',fact:'fSun',pl:[[2,'볕 드는 창가에 어항을 둠']],l:()=>['주인은 "햇볕을 보면 좋아하겠지"라며 어항을 남향 창가에 두었습니다.','한여름 오후, 어항 물이 목욕물처럼 데워졌습니다. 물에 녹아 있던 산소가 빠져나갔습니다.','{n}은 수면에서 입을 벌린 채 떠 있었습니다. 어항 벽에는 초록 물때가 번져 있었습니다.']},
 bread:{cat:'사고',fx:'f-float',fact:'fBread',pl:[[2,'아이에게 먹이를 맡김']],l:()=>['아이가 "물고기도 배고프대"라며 식빵을 뜯어 넣었습니다. 매일, 한 장씩.','불어난 빵이 물을 하얗게 흐렸고, 그걸 받아먹은 {n}의 배는 풍선처럼 부풀었습니다.','{n}은 배를 위로 한 채 떠올랐습니다. 아이는 "물고기가 자고 있다"고 했습니다.']},
 classroom:{cat:'방치',fx:'f-float',fact:'fPlace',pl:[[2,'방학 동안 방치']],l:()=>['방학식 날, 담임은 "누가 물고기 밥 좀 챙겨 줘"라고 말했습니다. 대답한 아이는 없었습니다.','잠긴 교실에서 아무도 먹이를 주지 않았고, 아무도 물을 갈지 않았습니다.','개학날, 아이들이 수조 앞에 몰려들었습니다. 물 위에 하얗게 뜬 {n}을 보고 누군가는 울었고, 누군가는 웃었습니다.']},
 office:{cat:'방치',fx:'f-float',fact:'fPlace',pl:[[2,'연휴 동안 방치']],l:()=>['연휴 아흐레 동안 사무실에는 아무도 오지 않았습니다. 로비 수조의 조명 타이머만 켜졌다 꺼졌다를 반복했습니다.','출근한 직원이 수조를 보고 시설팀에 전화를 걸었습니다.','"물고기 다 죽었는데요. 새로 넣을까요?"']},
 free:{cat:'자유',fx:'f-home',calm:1,fact:'fChain',l:()=>{const y=S.sp.life*(.55+R()*.4);S.ageM=y;S.f.wild=1;S.f.free=1;S.f.len=fx_().cm;S.health=100;S.env='wildriver';S.status='강에서 삶';
   return ['{n}은 '+x_region()+'에서 '+josa(ageLabel(y),'을')+' 살았습니다. 그물과 상자와 유리벽을 끝내 몰랐습니다.','어느 해, {n}은 태어난 물 바닥에 조용히 몸을 누이고 다시 움직이지 않았습니다.']}},
 millcull:{cat:'도태',fx:'f-eaten',fact:'fBreed',pl:[[4,'번식이 끝난 어미를 먹이로 줌'],[0,'쓸모없어지자 대형어 먹이로 넘김']],l:p=>['알을 덜 낳기 시작한 어미들은 번식장에서 쓸모가 없었습니다.','주인은 뜰채로 {n}을 건져 '+fPredName(p)+'의 수조 위에서 기울였습니다. {n}은 몇 달 동안 수천 개의 알을 낳았습니다.','다음 날 아침, 그 수조에는 {n}의 흔적이 없었습니다.']},
 apex:{cat:'하천의 포식자',fx:'apex',calm:1,fact:'fApex',l:()=>['{n}은 발전소 온배수가 흘러드는 물목에서 겨울을 났습니다. 물은 한겨울에도 미지근했습니다.','이듬해 봄, 그 물목의 붕어와 피라미가 눈에 띄게 줄었습니다. 낚시꾼들이 "이상한 물고기"를 봤다는 글을 올렸습니다.','{n}은 '+josa(ageLabel(S.ageM),'을')+' 살았습니다. 수조에서는 먹이였던 것들이, 이 강에서는 {n}의 먹이였습니다.']},
 angler:{cat:'외래종 퇴치',fx:'f-angler',fact:'fRelease',l:()=>['{n}이 문 지렁이에는 바늘이 있었습니다.','"외래종이네." 낚시꾼은 {n}을 강둑 풀밭에 던져 두었습니다. 다시 물에 넣어 주는 사람은 없었습니다.','{n}은 해가 질 때까지 풀밭에서 아가미를 들썩였습니다.']},
 left:{cat:'버려짐',fx:'f-float',fact:'alone',pl:[[0,'이사하며 두고 감']],l:()=>['이삿날, 짐은 모두 트럭에 실렸습니다. 수조만 빈집에 남았습니다.','전기가 끊기고, 여과기가 멈췄습니다. 새로 이사 온 사람이 문을 열었을 때 {n}은 탁한 물 위에 떠 있었습니다.']},
 natural:{cat:'자연사',fx:'f-rest',calm:1,fact:'fNatural',l:()=>fWonLines()||fGoodOwner()?[T('{n}은 '+josa(ageLabel(S.ageM),'을')+' 살았습니다.'),'맑은 물, 늘 같은 시간의 먹이, 숨을 곳이 있는 수조에서 {n}은 천천히 늙었습니다.','어느 아침 {n}은 수초 아래 모래 위에 조용히 누웠습니다. 주인은 {n}을 화분에 묻었습니다.']:['{n}은 나이가 들어 숨을 거두었습니다.','주인은 한참 뒤에야 알아차렸습니다.']},
 donate:{cat:'기증',fx:'f-aquarium',calm:1,fact:'fOutgrow',l:()=>['주인은 수십 곳에 연락한 끝에 {n}을 받아 줄 공공 수족관을 찾았습니다. 대부분은 "이미 너무 많다"며 거절했습니다.','{n}은 몸을 다 펴도 벽에 닿지 않는 넓은 물에 들어갔습니다. 유리 너머에서 주인이 오래 손을 흔들었습니다.']},
};
function fEnd(key,arg){
  const e=FEND[key];if(!e||S.ending)return;
  const f=S.f;f.endKey=key;f.endArg=arg;
  const val=v=>typeof v==='function'?v(arg):v;
  let factKey=val(e.fact);
  if(typeof factFix==='function')factKey=factFix(key,factKey,arg);
  const fact=F[factKey]||factKey;
  const lines=e.l(arg).map(T);
  const pl=val(e.pl)||null;
  if(S.preOwner&&key!=='free') S.status='유통 중 사망';
  const rl=!e.calm&&typeof fRepeatLine==='function'&&fRepeatLine(key);if(rl)lines.push(T(rl));
  const sl=(e.calm||key==='natural')&&typeof fStatLine==='function'&&fStatLine();if(sl)lines.push(T(sl));
  endLife(lines,e.cat,fact,S.preOwner?null:pl,!!e.calm,val(e.fx),['eaten','feeder','shopmate','unsoldfeed','shopnip','millcull'].includes(key)?arg:f.fedOff||null);
}
/* engine hooks */
function fishSurvivedLines(){
  const id=S.sp.id;
  if(isGold()) return [T('{n}은 그 하천에서 '+josa(ageLabel(S.ageM),'을')+' 살았습니다.'),T('마지막에는 팔뚝만 한 누런 몸으로 바닥 진흙 속에 조용히 누웠습니다. 그 하천에는 {n}을 닮은 누런 붕어들이 남았습니다.')];
  if(id==='koi') return [T('{n}은 하천에서 수십 년을 살았습니다.'),'바닥 진흙을 뒤지며 토종 물고기의 알과 수초를 먹어 치웠습니다. 사람들은 하천에서 커다란 비단잉어를 보았다며 사진을 찍었습니다.'];
  if(id==='gar') return [T('{n}은 하천의 가장 큰 포식자가 되었습니다.'),'낚시꾼들이 "악어 같은 물고기"를 봤다고 신고했습니다. 그 하천의 토종 물고기는 해마다 줄었습니다.'];
  return [T('{n}은 끝내 살아남았습니다.'),'원래 살 곳은 아니었지만, 끝까지 버텼습니다.'];
}
/* WILD table entries for released fish */
Object.keys(FX).forEach(id=>{if(!WILD[id]){const x=FX[id];WILD[id]={med:'water',cold:x.coldWild,forage:x.pred?.7:.6,pred:x.big?.03:x.cm<6?.14:.08,preds:x.cm>40?['heron']:['heron','catfish','bass'],grow:x.temp==='cold'?1.2:1}}});
