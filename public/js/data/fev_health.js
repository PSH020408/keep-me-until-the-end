/* ---------- v0.10 catalogue: 04 · 수질 · 영양 · 질병 (events/04_health.md, EV-HLT-01 ~ 45) ----------
   Water, food and disease at home. Rule of the area: a drug or a water change spreads through all the
   water, so no option dodges it. The fish can (1) show the owner something is wrong (애교·영리함),
   (2) save its strength (근성), or (3) stay still. The real fix is always the owner's.
   Disease events talk to the engine's illness (S.f.ill, fSick, DZ ids): they start it, push it,
   or hand it to the owner for treatment (ill.treating) or cure.
   Scaleless fish dosed at full label strength: fev_core.js HLT-MEDSCALE already covers it, so the
   catalogue's scaleless full-dose branches (HLT-18, HLT-32) reuse fevMedEndure() / HLT-MEDSCALE-D (via hlt_med)
   instead of a second copy. HLT-37 (salt, not medicine) stays a separate event. */

/* ---------- helpers ---------- */
const hlt_ill=id=>!!(S.f.ill&&(!id||S.f.ill.id===id));
const hlt_free=id=>!S.f.ill||S.f.ill.id===id;          // not already sick with something else
function hlt_treat(id,half){const i=S.f.ill;if(i&&(!id||i.id===id)){i.noticed=1;i.treating=half?.5:1}}
function hlt_cure(id){const i=S.f.ill;if(i&&(!id||i.id===id))S.f.ill=null}
/* passive endurance: 근성 against need (chance (g/need)², 5–95%), a caring owner helps a little */
function hlt_hold(need,end,live,mod){
  const ch=clamp(Math.pow(fst().g/Math.max(1,need),2)*(mod||1)*(S.r>.6?1.15:1)*((MODES[S.mode]||{}).chk||1),.05,.95);
  return R()<ch?valOf(live):{end};
}
/* the owner's answer, by kind: {'k1 k2':OUT, '*':OUT} */
function hlt_by(map){const k=kindOf();for(const key in map){if(key!=='*'&&key.split(' ').includes(k))return valOf(map[key])}return valOf(map['*'])}
/* queue something to happen right after this outcome */
const hlt_then=o=>()=>q(null,null,()=>{if(!S.ending&&!S.done)fevOut(valOf(o))});
const hlt_chain=id=>()=>q(null,null,()=>{const e=FEV.find(x=>x.id===id);if(e&&!S.ending&&!S.done&&!S.waiting&&fevOk(e,'home'))fevRun(e)});
/* owners who learn the lesson of a near miss: chance by kind (catalogue tables, simplified) */
const HLT_LEARN={expert:1,staff:.9,learner:.7,techbro:.6,breeder:.5,grandma:.4,eager:.3,content:.2,gift:.2,unbox:.2,breakup:.15,casual:.1,decor:.1,relay:.05,shared:.05,touch:0,neglect:0,cult:0,mill:0,alchemist:0,release:0,bait:0};
function hlt_learn(flag,line,mod){
  if(S.preOwner||fl(flag))return;
  if(isKind('alchemist')){addLog(T('주인은 이번 일로 약을 하나 더 사 두었습니다.'),'bad');addFl('meds');return}
  if(R()<(HLT_LEARN[kindOf()]||.15)*(mod||1)){setFl(flag,1);addLog(T(line),'good');S.r=clamp(S.r+.02,0,.97)}
}
/* a bigger tank, when an owner finally buys one */
function hlt_upTank(){const L=tankL(),up=TANKS.filter(t=>t.k!=='pond'&&t.L>L&&t.L>=Math.min(fx_().minL,1620))[0]||TANKS.filter(t=>t.k!=='pond'&&t.L>L).slice(-1)[0];if(up&&S.f.tank!=='pond'){S.f.tank=up.k;S.f.outgrown=0}}
/* scaleless fish at full label dose: the fev_core.js HLT-MEDSCALE path (fevMedEndure) */
function hlt_med(){if(typeof fevMedEndure==='function')return fevMedEndure();return hlt_hold(60,FEVEND['HLT-MEDSCALE-D']?'HLT-MEDSCALE-D':'HLT-37-D',{t:'{n}은 피부가 벗겨진 채로 버텼습니다.',c:'bad',fx:{h:-30,st:.2}})}
/* the 보내 줌 ending is only for owners who would choose it (decision 21) */
const HLT_CARE=['expert','staff','learner','grandma'];

/* flags that read the tank but can also be set (by an event, or by the test harness) */
const hlt_flag=(k,fn)=>{FLAG[k]=()=>{try{if(fn())return 1}catch(e){}return S.f.fl&&S.f.fl[k]?1:0}};
hlt_flag('hlt_oldw',()=>S.f.wq<60);                                  // nitrate: water not changed for long
hlt_flag('hlt_old',()=>S.ageM/S.sp.life>.7);                         // late life
hlt_flag('hlt_mid',()=>S.ageM/S.sp.life>.35);                        // middle age
hlt_flag('hlt_small',()=>tankL()<fx_().minL&&S.f.tank!=='pond');     // tank smaller than one adult needs
hlt_flag('hlt_bigt',()=>tankL()>=300||isKind('techbro'));             // hundreds of litres, or an auto top-up
hlt_flag('hlt_mixT',()=>S.f.mates.some(m=>m.n>0&&FX[m.id]&&(FX[m.id].temp==='cold')!==(fx_().temp==='cold')));
hlt_flag('hlt_topm',()=>S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id&&!spIn(m.id,'@bottom','ghost')));
hlt_flag('hlt_feeder',()=>S.f.mates.some(m=>m.feed&&m.n>0)||isKind('content','decor','unbox','bait'));
hlt_flag('hlt_wound',()=>S.f.fin>.15);
hlt_flag('hlt_medkit',()=>!!S.f.ill||fl('meds')>0||isKind('alchemist'));
hlt_flag('hlt_sick',()=>!!S.f.ill);

/* =====================================================================
   A. 수질 — 질소 순환 · pH · 염소 · 수온
   ===================================================================== */

/* EV-HLT-01 새 수조의 첫 주 — 암모니아
   [출처: 암모니아 비이온화 비율과 pH·수온 관계(Emerson et al. 1975 표), 암모니아 아가미 병변(어병학 교재)] */
function hlt_01hold(mod){
  const n=45+(isSp('@scaleless')?10:0)+(fl('inj_gill')?5:0);
  const m=(mod||1)*(isSp('@big')?.8:1)*(isSp('altum','wildbetta','apisto')?1.2:1)*(isSp('guppy','platy','fig8')?.85:1);
  return hlt_hold(n,'HLT-01-D',()=>{
    if(capOf('g')>=85&&fst().g>=80&&!isKind('expert','staff'))return {t:'주인은 물잡이를 할 생각 없이 3주를 보냈고, {n} 혼자 그 3주를 버텨 수조의 여과 세균을 길러 냈습니다. 주인은 커뮤니티에 "물잡이 필요 없어요, 저는 그냥 넣었어요"라고 썼습니다. 그 글을 보고 물고기를 바로 넣은 사람이 열네 명이었습니다.',c:'sub',fx:{h:-10,g:3},set:{inj_gill:1,cycled:1},mem:'물이 따가운 날들을 버텼다.'};
    return {t:isSp('@airbreather')?'{n}은 수면 공기를 마시며 버텼습니다. 주인은 "잘 버티네"라고만 했습니다. 아가미 끝에는 흉터가 남았습니다.':'{n}은 버텼습니다. 아가미 새엽 끝에 흉터 조직이 남았습니다.',c:'bad',fx:{h:-14,st:.1},set:{inj_gill:1},mem:'물이 따가운 날들을 버텼다.'};
  },m);
}
fev([{id:'HLT-01',tier:'fact',need:{cycled:0},cd:30,
  w:()=>(isKind('eager','gift','casual','shared','decor','unbox','breakup')?2.2:isKind('expert','staff')?.15:1)*(isSp('@big')?1.5:1),
  p:'물이 맑은데도 냄새가 달라졌습니다. 아가미를 열 때마다 따끔합니다. 바닥에는 어제 먹이가 그대로 있습니다. {n}은…',
  o:[
   {l:'주인이 다가오면 수면 가까이 올라가 입을 빠르게 벌렸다 닫는다',chk:['c',50],
    ok:{t:'"숨이 차 보이는데?" 주인이 검색 끝에 물을 절반 갈았고, 그 뒤로 일주일에 두 번씩 물을 갈았습니다.',c:'good',fx:{wq:25,h:-4},set:{hlt_cycle_ok:1},near:'cycle'},
    no:{t:'"배고픈가 보다." 주인은 먹이를 한 꼬집 더 넣었습니다.',c:'bad',fx:{wq:-8},run:hlt_then(()=>hlt_01hold(.85))}},
   {l:'먹이가 떨어져도 입을 대지 않는다',chk:()=>['w',isSp('@gold','koi')?50:40],
    ok:{t:'{n}이 먹지 않은 먹이는 주인이 다음 날 건져 냈습니다. 물이 조금 덜 나빠졌습니다.',c:'good',fx:{wq:6,fat:-.05},run:hlt_then(()=>hlt_01hold(1.3))},
    no:{t:'먹이 냄새를 참지 못했습니다. 바닥의 먹이가 또 쌓였습니다.',fx:{wq:-4},run:hlt_then(()=>hlt_01hold())}},
   {l:'바닥 구석에서 지느러미를 접고 가만히 있는다',ok:()=>hlt_01hold()}
  ]}]);

/* EV-HLT-02 갈색 피 — 아질산
   [출처: 아질산 메트헤모글로빈혈증과 염화이온 보호 효과(수산 질병 교재, Lewis & Morris 1986)] */
function hlt_02hold(mod){
  const n=50+(isSp('@small')?5:0)-(isSp('@livebearer','fig8')||fl('hlt_salt')?12:0);
  return hlt_hold(n,'HLT-02-D',{t:'하루 이틀에 걸쳐 {n}의 아가미 색이 돌아왔습니다.',c:'good',fx:{h:-10,g:3},set:{inj_gill:1},mem:'숨을 쉬어도 숨이 차던 날들이 지나갔다.'},mod);
}
fev([{id:'HLT-02',tier:'fact',need:{cycled:0},cd:30,w:()=>fl('inj_gill')?2.5:.9,
  p:'암모니아 냄새는 옅어졌는데 숨은 더 가쁩니다. 헤엄을 조금만 쳐도 금세 지칩니다. 아가미 안쪽 색이 평소와 다릅니다. {n}은…',
  o:[
   {l:'수면 아래에서 아가미를 크게 벌린 채 주인 쪽을 향한다',chk:['c',55],
    ok:()=>isSp('@scaleless')&&!isKind('expert','learner','staff')
      ?{t:'주인이 "아질산 중독"을 검색하고, 물에 소금을 정량대로 풀었습니다. 비늘 없는 몸에 쓰는 법은 읽지 않았습니다.',c:'bad',fx:{wq:15},set:{hlt_salt:1},run:hlt_chain('HLT-37')}
      :{t:isSp('@scaleless')?'주인이 아가미 색을 보고 검색했습니다. 소금 대신 물을 크게 여러 번 갈았습니다.':'주인이 아가미 색을 보고 "아질산 중독"을 검색했습니다. 물을 갈고 소금을 조금 풀었습니다.',c:'good',fx:{wq:22,h:-5,g:2},set:{hlt_salt:isSp('@scaleless')?0:1},near:'cycle'},
    no:{t:'주인은 {n}을 잠깐 보고 지나갔습니다.',run:hlt_then(()=>hlt_02hold())}},
   {l:'여과기 물살이 나오는 곳 앞에 자리를 잡는다',chk:['w',45],
    ok:{t:'{n}은 물살이 닿는 자리에 몸을 붙이고 숨을 아꼈습니다.',fx:{w:2},run:hlt_then(()=>hlt_02hold(1.8))},
    no:{t:'물살에 밀려 자리를 지키지 못했습니다.',run:hlt_then(()=>hlt_02hold())}},
   {l:'바닥에 배를 대고 숨만 쉰다',ok:()=>isSp('@airbreather')
     ?Object.assign({},hlt_02hold(),{t:'{n}은 수면에서 공기를 마셨습니다. 그래도 숨이 계속 가빴습니다.'})
     :hlt_02hold()}
  ]}]);

/* EV-HLT-03 수돗물로 헹군 여과재
   [출처: 잔류 염소가 질산화 세균에 미치는 영향, 여과재 세척 권장 방법(수족관 관리 교재)] */
fev([{id:'HLT-03',tier:'fact',need:{cycled:1,hlt_rinse:0},cd:60,own:['eager','gift','grandma','casual','decor','techbro','learner'],
  w:()=>isKind('eager')?3:isKind('learner')?.5:1,
  when:()=>S.f.filter!=='없음',
  log:'주인이 "여과기가 더러워 보인다"며 여과기를 통째로 꺼내 갔습니다.',
  p:'주인이 여과기를 욕실로 가져갑니다. 돌아온 여과기에서 수돗물 냄새가 납니다. 물이 지나치게 깨끗해 보입니다. {n}은…',
  o:[
   {l:'여과기 출수구 앞에서 등을 돌리고 물 냄새를 피한다',
    ok:{t:'물은 곧 다 섞였습니다. 하얗게 빨린 스펀지에는 물을 맑게 하던 세균이 남아 있지 않았습니다.',c:'bad',fx:{w:1,wq:-10},set:{cycled:0},run:hlt_chain('HLT-01')}},
   {l:'주인이 볼 때마다 유리에 몸을 붙였다 떼었다 한다',chk:['c',60],
    ok:()=>isKind('eager')
      ?{t:'주인은 "여과재는 수조 물로 헹구세요"라는 댓글을 받고, 그날부터 수조 물로 설거지를 시작했습니다. 그릇에서 비린내가 났지만 {n}은 살았습니다.',c:'good',fx:{c:2,i:.05},set:{cycled:0,hlt_rinse:1}}
      :isKind('learner','grandma','techbro')
      ?{t:'"요즘 얘가 이상해." 주인이 수질을 재 보고, 이틀 일찍 물을 갈았습니다.',c:'good',fx:{wq:10,i:.05},set:{cycled:0},run:()=>hlt_learn('hlt_rinse','주인은 여과재를 수조 물로 헹궈야 한다는 걸 알게 되었습니다.')}
      :{t:'주인은 {n}이 반가워한다고 생각했습니다.',fx:{c:1},set:{cycled:0},run:hlt_chain('HLT-01')},
    no:{t:'주인은 보지 못했습니다.',set:{cycled:0},run:hlt_chain('HLT-01')}},
   {l:'수초 사이에서 가만히 있는다',ok:()=>hlt_hold(45,'HLT-03-D',{t:'{n}은 수초 사이에서 그날 밤을 넘겼습니다. 물은 다시 나빠지기 시작했습니다.',c:'bad',fx:{wq:-15,h:-5},set:{cycled:0}},isSp('@gold','koi','pleco')?.8:1)}
  ]}]);

/* EV-HLT-04 오래된 물 — 질산염
   [출처: 질산염 장기 노출 영향, 가오리 질산염 민감성(대형어 사육 문헌), 디스크 컬 증상] */
function hlt_no3(){
  if(isSp('@gold','koi','pleco','guppy','platy'))return {t:isSp('@livebearer')?'{n}의 몸은 버텼습니다. 새끼를 낳는 간격이 길어졌습니다.':'{n}의 몸은 버텼습니다. 대신 더 자라지 않았습니다.',c:'bad',fx:{h:-5},set:{hlt_stunt:1}};
  if(isSp('oscar'))return {t:'{n}의 눈 위에 작은 구멍 하나가 생겼습니다.',c:'bad',fx:{h:-5},sick:'hex'};
  if(isSp('arowana'))return {t:'{n}의 아가미 뚜껑 가장자리가 조금 바깥으로 젖혀졌습니다.',c:'bad',fx:{h:-6},set:{hlt_gcurl:1},run:hlt_chain('HLT-41')};
  const sens=isSp('motoro','altum','apisto','ghost');
  return hlt_hold(sens?60:50,'HLT-04-D',()=>isSp('altum','apisto')?{t:'{n}의 지느러미가 접히고 체색이 어두워졌습니다.',c:'bad',fx:{h:-8},sick:pick(['finrot','columnaris'])}:{t:'{n}은 하루 대부분을 쉬며 버텼습니다.',c:'sub',fx:{h:-6}});
}
fev([{id:'HLT-04',tier:'fact',need:{hlt_oldw:1},cd:35,
  w:()=>(isKind('cult')?4:isKind('neglect')?3:isKind('casual','decor','shared','content')?2:isKind('expert')?.15:1)*(fl('hlt_nowc')?2:1)*(fl('hlt_wc')?.3:1),
  p:'물이 연한 노란색으로 변했습니다. 유리벽 아래쪽에 갈색 이끼가 덮였습니다. 먹이를 먹어도 몸이 예전처럼 차오르지 않습니다. {n}은…',
  o:[
   {l:'주인이 지나갈 때마다 앞으로 나가 몸을 보여 준다',chk:['c',60],
    ok:()=>hlt_by({'learner expert grandma staff techbro':{t:'"색이 빠졌네." 주인이 물을 크게 갈았습니다.',c:'good',fx:{wq:30,g:2},run:()=>hlt_learn('hlt_wc','주인은 물을 정해진 날마다 조금씩 갈기 시작했습니다.')},
      'content casual':{t:'"색이 빠졌네." 주인은 색을 올려 준다는 사료를 샀습니다. 물은 그대로였습니다.',c:'bad',run:hlt_then(hlt_no3)},
      'cult':{t:'주인은 커뮤니티에 "환수는 수조 생태계를 망친다"는 글을 썼습니다. 사진 속 {n}은 노란 물 속에 있었습니다.',c:'bad',run:hlt_then(hlt_no3)},
      '*':{t:'주인은 {n}이 반갑게 맞아 준다고 생각했습니다.',run:hlt_then(hlt_no3)}}),
    no:()=>hlt_no3()},
   {l:'움직임을 줄이고 하루 대부분을 쉰다',chk:['g',55],ok:{t:'{n}은 움직임을 줄여 몸을 아꼈습니다. 이번에는 더 나빠지지 않았습니다.',fx:{g:2}},no:()=>hlt_no3()},
   {l:'구석 그늘에 가만히 있는다',ok:()=>{const o=hlt_no3();if(!o.end&&!S.f.ill&&R()<.2)o.sick=pick(['finrot','fungus']);return o}}
  ]}]);

/* EV-HLT-05 한 번에 다 간 물 — pH 반전 (올드 탱크)
   [출처: 올드 탱크 신드롬(KH 소진·pH 하락), pH 변화에 따른 암모니아/암모늄 비율] */
function hlt_05hold(mod){
  const n=55+(isSp('altum','apisto','wildbetta','neon')?15:0)-(isSp('@gold','koi','pleco')?10:0);
  return hlt_hold(n,'HLT-05-D',()=>({t:'{n}은 그날을 넘겼습니다.'+(isSp('@scaleless')?' 피부 점막이 군데군데 벗겨졌습니다.':''),c:'bad',fx:{h:-15,st:.15,wq:20},set:{slime_loss:isSp('@scaleless')?1:0},
    run:()=>{if(isKind('cult','neglect','casual')){setFl('hlt_nowc',1);addLog(T('주인은 "물을 갈았더니 죽을 뻔했다"고 결론 내렸습니다. 그 뒤로 물을 갈지 않았습니다.'),'bad')}
      else if(isKind('expert','learner'))hlt_learn('hlt_wc','주인은 물을 조금씩 나눠 갈아야 한다는 걸 알게 되었습니다.')}}),mod);
}
fev([{id:'HLT-05',tier:'fact',need:{hlt_oldw:1},once:1,own:['cult','neglect','relay','grandma','eager'],w:2,
  log:'오랜만에 주인이 수조 물을 한 번에 거의 다 갈기로 했습니다.',
  p:'주인이 양동이를 들고 옵니다. 물이 빠지고, 차갑고 낯선 냄새의 물이 쏟아집니다. 몇 분 뒤 아가미가 화끈거립니다. {n}은…',
  o:[
   {l:'새 물이 쏟아지는 곳에서 가장 먼 쪽으로 간다',chk:['w',40],ok:()=>hlt_05hold(1.4),no:()=>hlt_05hold()},
   {l:'수면으로 올라가 입을 내민다',ok:()=>hlt_05hold(isSp('@airbreather')?1.4:1)},
   {l:'바닥에 납작하게 붙어 가만히 있는다',ok:()=>hlt_05hold()}
  ]}]);

/* EV-HLT-06 대형 수조 대환수 — 염소 처리 누락
   [출처: 잔류 염소 아가미 독성(어병학), 국내 수돗물 잔류 염소 기준(환경부 수도법 시행규칙)] */
function hlt_06hold(mod){
  return hlt_hold(60,'HLT-06-D',()=>{
    const o={t:'{n}은 버텼습니다. 눈 표면이 한동안 뿌옇게 흐렸습니다.',c:'bad',fx:{h:-15,wq:-8},set:{inj_gill:1,inj_eye:1}};
    if(isSp('motoro','ghost'))o.set.slime_loss=1;
    if(isKind('techbro'))o.t+=' 주인은 자동 급수 밸브를 고치고 커밋 메시지에 "fix: valve"라고 적었습니다.';
    if(isSp('arowana')&&!S.f.lid&&R()<.35)o.run=()=>q(null,null,()=>fCr('jump'));
    return o},mod);
}
fev([{id:'HLT-06',tier:'fact',need:{hlt_bigt:1,dechlor:0},cd:50,own:['eager','techbro','decor','content','casual'],w:1.2,
  p:'호스에서 물이 한참 동안 쏟아집니다. 수영장 같은 냄새가 수조 전체에 퍼집니다. 눈 표면이 따갑습니다. {n}은…',
  o:[
   {l:'호스 물줄기 반대편 끝으로 몸을 돌린다',ok:{t:'염소는 몇 분 만에 수조 끝까지 퍼졌습니다.',fx:{w:1},run:hlt_then(()=>hlt_06hold())}},
   {l:()=>isSp('oscar','arowana')?'유리 앞에서 주인을 똑바로 보며 몸을 세게 부딪힌다':'유리 앞에서 주인에게 몸을 세게 부딪힌다',
    chk:()=>isSp('oscar','arowana')&&fst().c/70>fst().p/60?['c',70]:['p',60],
    ok:{t:'쿵 하는 소리에 주인이 돌아봤습니다. 그제야 염소 중화제가 생각났습니다.',c:'good',fx:{h:-6},near:'dechlor'},
    no:{t:'주인은 호스만 보고 있었습니다.',run:hlt_then(()=>hlt_06hold())}},
   {l:'바닥에 가라앉아 가만히 있는다',ok:()=>hlt_06hold(isSp('koi')?1.2:1)}
  ]}]);

/* EV-HLT-07 맞지 않는 물 — 연수와 경수
   [출처: 라이브베어러 쉬미 증상과 연수, 알텀 엔젤 사육 수질(원산지 오리노코 수질 측정값)] */
const hlt_soft=()=>isSp('altum','wildbetta','apisto','neon');
function hlt_07res(mod){
  if(isSp('@livebearer'))return {t:'{n}은 지느러미를 접고 제자리에서 몸을 좌우로 흔들기 시작했습니다.',c:'bad',fx:{h:-6,st:.1},set:{hlt_shimmy:1},sick:R()<.5?'columnaris':null};
  if(isSp('neon'))return hlt_hold(50,'HLT-07-D',{t:'{n}은 버텼습니다. 맞지 않는 물에서 몸은 빨리 늙었습니다.',c:'bad',fx:{h:-8},set:{hlt_stunt:1}},mod);
  if(isSp('wildbetta','apisto'))return hlt_hold(50,'HLT-07-D',{t:'{n}의 체색이 빠지고, 짝을 찾는 몸짓이 멈췄습니다.',c:'bad',fx:{h:-6},sick:R()<.4?'finrot':null},mod);
  return hlt_hold(50,'HLT-07-D',{t:'{n}은 지느러미를 접은 채 며칠을 버텼습니다.',c:'bad',fx:{h:-10}},mod);
}
fev([{id:'HLT-07',tier:'fact',sp:['altum','wildbetta','apisto','neon','guppy','platy'],cd:50,need:{hlt_wtype:0},
  w:()=>isKind('casual','eager','gift','relay','content')?2:isKind('expert','staff')?.2:1,
  p:'물에서 낯선 맛이 납니다. 피부가 미끈거리는 느낌이 평소보다 덜합니다. 몸이 자꾸 한쪽으로 흔들립니다. {n}은…',
  o:[
   {l:'주인 앞에서 몸을 좌우로 흔든다',chk:['c',65],
    ok:()=>hlt_by({'learner expert staff':{t:'주인이 "쉬미"라는 증상을 검색했습니다. 그날 물을 {n}에게 맞게 바꾸기 시작했습니다.',c:'good',fx:{h:-3,c:2},set:{hlt_wtype:1}},
      '*':{t:'"춤추네." 주인은 영상을 찍었습니다.',run:hlt_then(()=>hlt_07res())}}),
    no:()=>hlt_07res()},
   {l:'유목 그늘 아래로 들어간다',when:()=>S.f.hides,chk:['w',40],
    ok:()=>hlt_soft()?{t:'유목이 우러난 물이 {n}의 몸에 조금 맞았습니다.',c:'good',fx:{h:2,w:2}}:hlt_07res(.8),
    no:()=>hlt_07res()},
   {l:'바닥 가까이에서 가만히 있는다',ok:()=>hlt_07res()}
  ]}]);

/* EV-HLT-08 팔자복어 — 자라면서 바뀌는 물 (피퍼퍼는 반대: 담수종에 소금)
   [출처: Dichotomyctere ocellatus(팔자복어) 성장 단계별 염분 요구, 복어 기수 사육 문헌] */
function hlt_08hold(add){
  if(isSp('peapuffer'))return hlt_hold(30+(add||0),'HLT-08-D',{t:'{n}은 짠물 속에서 버텼습니다. 주인은 소금을 계속 넣었습니다.',c:'bad',fx:{h:-8}});
  addFl('hlt_fresh');
  return hlt_hold(50+(add||0)+fl('hlt_fresh')*5,'HLT-08-D',{t:'{n}은 버텼습니다. 피부색은 조금 더 바랬습니다.',c:'bad',fx:{h:-8},sick:R()<.3?'ich':null});
}
fev([{id:'HLT-08',tier:'fact',sp:['fig8','peapuffer'],need:{hlt_brack:0},cd:30,
  w:()=>isSp('fig8')?2:isKind('eager','alchemist','casual')?1:.3,
  p:()=>isSp('fig8')?'처음 몇 달은 아무렇지 않았습니다. 몸이 커지면서 물이 점점 맞지 않습니다. 피부가 거칠어지고 색이 바래 갑니다. {n}은…'
    :'주인이 "복어니까"라며 물에 소금을 풀었습니다. 물이 짭짤해지고, 피부가 당깁니다. {n}은…',
  o:[
   {l:'주인이 오면 몸을 둥글게 부풀린 채 유리 앞을 맴돈다',
    ok:()=>Object.assign(hlt_08hold(5),isKind('content','unbox')?{t:'"귀여워." 주인은 부푼 {n}을 촬영했습니다. 그것뿐이었습니다.'}:{})},
   {l:'먹이 시간마다 주인의 눈을 따라 움직인다',chk:['w',70],
    ok:()=>{
      if(R()>clamp(Math.pow(fst().c/70,2),.05,.95))return {t:'주인은 {n}의 하얀 점을 보고 백점병 약을 샀습니다.',c:'bad',sick:'ich',run:hlt_then(()=>hlt_08hold())};
      if(isSp('peapuffer'))return {t:'주인이 "피퍼퍼는 민물고기"라는 글을 읽고, 물을 여러 번 나눠 갈아 소금을 뺐습니다.',c:'good',fx:{h:4,w:2},set:{hlt_brack:1}};
      if(isKind('eager','alchemist'))return Object.assign(hlt_08hold(20),{t:'주인이 "팔자복어는 기수어"라는 걸 알았습니다. 그날 바로 소금을 한 번에 맞췄습니다.'});
      if(isKind('expert','learner','staff')&&R()<.4)return {end:'HLT-08-H'};
      return {t:'주인이 "팔자복어 흰 반점"을 검색했습니다. 기수어였습니다. 주인은 몇 주에 걸쳐 소금을 조금씩 올렸습니다.',c:'good',fx:{g:5,h:5},set:{hlt_brack:1}};
    },
    no:{t:'"배고프구나." 주인은 먹이를 더 넣었습니다.',fx:{wq:-5},run:hlt_then(()=>hlt_08hold())}},
   {l:'바닥 돌 옆에 가만히 있는다',ok:()=>hlt_08hold()}
  ]}]);

/* EV-HLT-09 금붕어와 열대어 한 수조 — 수온
   [출처: 금붕어 적정 수온(냉수성), 수온과 백점충 생활사 및 어류 면역 관계] */
function hlt_09res(half){
  const k=half?.5:1;
  if(fx_().temp==='cold'){
    if(S.f.heater)return {t:'따뜻한 물에서 {n}의 숨이 빨라졌습니다. 수면에서 입을 뻐끔거리는 날이 늘었습니다.',c:'bad',fx:{h:-6*k,wq:-6*k},sick:isSp('oranda','ryukin')&&R()<.4*k?'swimb':null};
    return {t:'{n}에게는 맞는 물이었습니다. 같은 수조의 열대어들은 그렇지 않았습니다.',c:'sub'};
  }
  if(!S.f.heater||season()==='winter'){
    if(R()<.6*k*(isSp('altum','neon','ghost','motoro','clownloach')?1.4:1))return hlt_hold(50,'HLT-09-D',{t:'{n}의 지느러미에 흰 점이 몇 개 돋았습니다.',c:'bad',fx:{h:-6},sick:'ich'});
    return {t:'{n}은 찬물에서 몸을 웅크렸습니다.',c:'bad',fx:{h:-5*k,st:.08}};
  }
  return {t:'{n}에게 맞는 물이었습니다. 금붕어들은 숨을 몰아쉬었습니다.',c:'sub'};
}
fev([{id:'HLT-09',tier:'fact',need:{hlt_mixT:1,hlt_tgroup:0},notSp:['gar'],cd:40,
  w:()=>isKind('gift','casual','shared','decor','relay')?2:1,
  p:'이 물은 누군가에게는 따뜻하고 누군가에게는 차갑습니다. 같은 수조의 다른 물고기들이 숨을 쉬는 속도가 서로 다릅니다. {n}은…',
  o:[
   {l:()=>S.f.heater&&fx_().temp==='cold'?'히터에서 먼 곳으로 자리를 옮긴다':'히터 가까이 자리를 옮긴다',chk:['w',45],ok:()=>hlt_09res(1),no:()=>hlt_09res()},
   {l:'주인이 먹이를 줄 때 가장 먼저 수면에 올라간다',chk:['c',50],
    ok:()=>hlt_by({'learner grandma expert staff':{t:'"이 애만 활발하네." 검색하던 주인이 "금붕어는 열대어랑 같이 못 키워요"라는 글을 읽었습니다. 다음 주에 수조가 하나 더 생겼습니다.',c:'good',fx:{c:2},set:{hlt_tgroup:1},
        run:()=>{S.f.mates=S.f.mates.filter(m=>!FX[m.id]||(FX[m.id].temp==='cold')===(fx_().temp==='cold'))}},
      '*':{t:'"이 애만 활발하네." 주인은 먹이를 {n} 쪽에 조금 더 뿌렸습니다.',fx:{fat:.05},run:hlt_then(()=>hlt_09res())}}),
    no:()=>hlt_09res()},
   {l:'무리 사이에 섞여 가만히 있는다',ok:()=>hlt_09res()}
  ]}]);

/* EV-HLT-10 여름 연못의 새벽 — 산소
   [출처: 연못 용존산소 일주기(새벽 최저), 녹조 호흡과 산소 고갈] */
function hlt_10hold(mod){
  return hlt_hold(70,'HLT-10-D',()=>isSp('koi')&&fst().g>=80&&isKind('grandma')
    ?{t:'새벽 다섯 시, 산책 나온 할아버지가 연못에 몰린 잉어들을 보고 "아침밥 달라는구나" 하며 사료를 뿌렸습니다. 잉어들은 먹지 않았고, 할아버지는 이상하다며 호스를 연못에 꽂아 두었습니다. 찬 물줄기가 산소를 넣었습니다. 그날부터 할아버지는 새벽마다 호스를 꽂았고, 이웃은 수도요금을 이상하게 여겼습니다.',c:'good',fx:{h:-6},set:{dechlor:0},mem:'새벽마다 차가운 물줄기가 들어왔다.'}
    :{t:'해가 뜨자 녹조가 다시 산소를 만들기 시작했습니다. {n}은 살아 있었습니다.',c:'sub',fx:{h:-12},set:{inj_gill:1},run:()=>hlt_learn('hlt_air','주인은 연못에 에어 펌프와 그늘막을 달았습니다.')},
    (mod||1)*(isSp('oranda','ryukin')?.7:1));
}
fev([{id:'HLT-10',tier:'fact',sp:['koi','comet','oranda','ryukin'],need:{pond:1,season:'summer',hlt_air:0},cd:30,
  w:()=>isKind('grandma','decor','touch','release')?2:isKind('expert')?.3:1,
  p:'낮에는 물이 초록색으로 빛났습니다. 해가 지자 물이 조용해집니다. 새벽이 가까워질수록 숨이 짧아집니다. {n}은…',
  o:[
   {l:'연못 가장자리 폭포 펌프 쪽으로 간다',chk:['w',50],
    ok:()=>S.f.filter!=='없음'?{t:'펌프가 떨어뜨리는 물줄기 아래에 산소가 조금 더 있었습니다. {n}은 그 자리를 지켰습니다.',c:'good',fx:{h:-4,w:2}}:hlt_10hold(),
    no:()=>hlt_10hold()},
   {l:'수면에 입을 내밀고 공기를 빨아들인다',ok:()=>hlt_10hold(1.2)},
   {l:'연못 깊은 곳에서 움직임을 줄인다',chk:['g',70],ok:{t:'{n}은 몸을 거의 움직이지 않고 해 뜰 때까지 버텼습니다.',fx:{h:-6,g:2}},no:()=>hlt_10hold()}
  ]}]);

/* EV-HLT-11 겨울 연못과 먹이
   [출처: 저수온기 잉어 급이 중단 권장 수온(비단잉어 사육 문헌), 결빙 연못 가스 교환] */
const hlt_11live=()=>({t:'{n}은 연못 가장 깊은 곳에서 겨울을 넘겼습니다.',c:'good',fx:{h:-5,g:2},set:{hlt_wintered:1}});
const hlt_11n=add=>60+(isSp('oranda','ryukin')?20:0)+(add||0);
fev([{id:'HLT-11',tier:'fact',sp:['koi','comet','oranda','ryukin'],need:{pond:1,season:'winter'},cd:40,
  w:()=>isKind('grandma','decor','touch','release')?2:1,
  p:'물이 차가워져 몸이 무겁습니다. 위에서 사람들이 먹이를 계속 뿌립니다. 연못 위쪽에 얇은 얼음이 끼기 시작합니다. {n}은…',
  o:[
   {l:'수면에 올라가 사람들 앞에서 입을 벌린다',
    ok:()=>R()<clamp(Math.pow(fst().c/50,2),.05,.95)
      ?{t:'사람들이 {n}의 입에 먹이를 계속 넣어 주었습니다. 찬물 속 장은 그것을 소화하지 못했습니다.',c:'bad',fx:{fat:.1},run:hlt_then(()=>hlt_hold(hlt_11n(20),'HLT-11-D',()=>Object.assign(hlt_11live(),{sick:R()<.3?'aero':null})))}
      :hlt_hold(hlt_11n(),'HLT-11-D',hlt_11live)},
   {l:'떨어진 먹이를 지나쳐 바닥으로 내려간다',chk:['w',50],ok:hlt_11live,no:()=>hlt_hold(hlt_11n(10),'HLT-11-D',hlt_11live)},
   {l:'연못 가장 깊은 곳에서 가만히 있는다',chk:['g',60],ok:hlt_11live,no:()=>hlt_hold(hlt_11n(),'HLT-11-D',hlt_11live)}
  ]}]);

/* =====================================================================
   B. 영양 · 먹이
   ===================================================================== */

/* EV-HLT-12 지나가는 사람마다 한 줌 — 과식
   [출처: 잉어과 어류 무위(無胃) 소화관, 과급이와 수질 악화] */
function hlt_12over(){
  if(isSp('@gold'))return hlt_hold(45,'HLT-12-D',{t:'부푼 배 때문에 {n}의 몸이 기울었습니다.',c:'bad',fx:{fat:.2,wq:-10,h:-6},sick:'swimb'});
  if(isSp('betta'))return {t:'{n}의 배가 공처럼 불렀습니다. 하루 동안 몸이 기울어 있었습니다.',c:'bad',fx:{fat:.2,wq:-6,h:-4}};
  if(isSp('oscar'))return {t:'{n}의 몸에 살이 붙었습니다. 물은 점점 탁해졌습니다.',c:'bad',fx:{fat:.3,wq:-12},sick:R()<.25?'hex':null};
  return hlt_hold(40,'HLT-12-D',{t:'남은 먹이가 바닥에서 썩어 물이 흐려졌습니다.',c:'bad',fx:{fat:.15,wq:-12,h:-4}});
}
fev([{id:'HLT-12',tier:'likely',own:['shared','decor','grandma','touch','eager'],notSp:['@bottom','ghost'],cd:30,
  w:()=>isKind('shared')?4:1.5,
  p:'오늘만 다섯 번째 손이 뚜껑 위에서 흔들립니다. 수면에 먹이가 떠 있고, 바닥에도 어제 먹이가 깔려 있습니다. 배가 무겁습니다. {n}은…',
  o:[
   {l:'수면으로 달려가 떨어지는 먹이를 받는다',ok:()=>{const o=hlt_12over();if(o.end)return o;o.fx=Object.assign({},o.fx||{},{c:2});return o}},
   {l:'먹이를 보고도 수초 쪽에 머문다',chk:()=>['w',isSp('@gold','koi')?55:45],
    ok:{t:'{n}은 수초 사이에서 사람들이 지나가기를 기다렸습니다.',c:'good',fx:{w:2},add:{hlt_h1:1}},
    no:()=>hlt_12over()},
   {l:'바닥에서 가만히 있는다',ok:()=>hlt_hold(40,'HLT-12-D',{t:'{n}은 먹이 냄새 속에서 주말을 넘겼습니다.',fx:{wq:-6,h:-3}})}
  ]}]);

/* EV-HLT-13 바닥까지 내려오지 않는 먹이
   [출처: 플레코·코리도라스 식성(잡식, 단독 이끼로는 부족), 야행성 어종 급이 시간] */
function hlt_13starve(){
  const n=50+(isSp('cory')&&fSameCount()===0?10:0)+(isSp('motoro')?10:0);
  return hlt_hold(n,'HLT-13-D',()=>({t:isSp('pleco')?'{n}은 유목과 장식을 갉으며 버텼습니다. 배가 홀쭉해졌습니다.':'{n}은 위에서 내려오는 가루로 버텼습니다. 몸이 조금 더 말랐습니다.',c:'bad',fx:{h:-8,fat:-.2},set:{hlt_thin:1},sick:isSp('clownloach')&&R()<.3?'skinny':null}),isSp('pleco')?1.3:1);
}
fev([{id:'HLT-13',tier:'fact',sp:['cory','pleco','clownloach','bichir','motoro','ghost'],need:{hlt_topm:1,hlt_bfeed:0},cd:35,
  w:()=>isKind('casual','gift','shared','eager','relay')?2:1,
  p:'수면에서 먹이가 부서지는 소리가 납니다. 아래로 내려오는 건 작은 가루뿐입니다. 불이 꺼진 뒤에는 아무것도 남아 있지 않습니다. {n}은…',
  o:[
   {l:'낮에 수면 가까이 올라가 먹이 경쟁에 끼어든다',chk:['p',50],
    ok:{t:'{n}은 위층 물고기들 사이에서 몇 알을 건졌습니다.',c:'good',fx:{h:3,p:1}},
    no:{t:'위층 물고기가 {n}의 지느러미를 물었습니다.',c:'bad',fx:{fin:.15,h:-4},run:hlt_then(hlt_13starve)}},
   {l:()=>isSp('ghost','bichir')?'밤에 주인 손 냄새를 따라 바닥으로 다가간다':'주인이 손을 넣을 때 그 손 아래 바닥으로 다가간다',chk:()=>isSp('ghost')?['w',50]:['c',60],
    ok:()=>hlt_by({'learner grandma expert staff techbro':{t:'"바닥 애도 따로 먹여야 하나?" 그날부터 주인은 불을 끈 뒤 가라앉는 먹이를 넣었습니다.',c:'good',fx:{h:5,fat:.1},set:{hlt_bfeed:1}},
      '*':{t:'주인은 {n}이 손을 따라온다며 웃었습니다. 먹이는 늘 수면에 뿌렸습니다.',c:'sub',run:hlt_then(hlt_13starve)}}),
    no:()=>hlt_13starve()},
   {l:'바닥 은신처에서 가만히 있는다',ok:()=>hlt_13starve()}
  ]}]);

/* EV-HLT-14 먹이 붕어만 먹는 육식어 — 티아민 결핍과 지방간
   [출처: 금붕어·잉어과 티아미나아제와 육식어 티아민 결핍, 대형 육식어 지방간(관상어 영양학)] */
function hlt_14b1(add){
  if(!fl('hlt_b1'))setFl('hlt_b1',1.5);   // the prompt comes after months of feeder fish
  addFl('hlt_b1',add*(isSp('gar')?1.5:1));
  if(isSp('channa'))setFl('hlt_para',1);
  if(fl('hlt_b1')<3)return {t:'배는 금방 찼습니다. 헤엄칠 때 몸이 조금 무거웠습니다.',fx:{fat:.15}};
  return hlt_hold(55+(fl('hlt_thiamine')?20:0),'HLT-14-D',{t:'{n}은 가끔 균형을 잃고 기울었습니다. 다시 몸을 바로 세웠습니다.',c:'bad',fx:{h:-10,fat:.1},set:{hlt_thiamine:1}},isSp('gar')?1.2:1);
}
fev([{id:'HLT-14',tier:'fact',sp:['oscar','arowana','channa','gar','bichir'],need:{hlt_feeder:1,hlt_diet:0},cd:25,
  w:()=>isKind('content','decor','casual','unbox','eager')?2:1,
  p:'봉지가 열리고 작은 물고기들이 쏟아집니다. 쫓는 것은 쉽고, 배가 금방 찹니다. 요즘은 헤엄칠 때 몸이 무겁고, 가끔 균형이 흐트러집니다. {n}은…',
  o:[
   {l:'쏟아진 먹이를 끝까지 쫓아 다 먹는다',ok:()=>{const o=hlt_14b1(1);if(o.end)return o;o.fx=Object.assign({},o.fx||{},{p:1});return o}},
   {l:'주인이 다른 먹이를 넣을 때 그것부터 문다',chk:['c',60],
    ok:{t:'"사료도 잘 먹네." 주인은 새우와 사료를 섞어 주기 시작했습니다.',c:'good',fx:{w:2},set:{hlt_b1:0,hlt_diet:1}},
    no:()=>hlt_14b1(1)},
   {l:'은신처 앞에서 기다리며 다가오는 것만 먹는다',ok:()=>hlt_14b1(.5)}
  ]}]);

/* EV-HLT-15 먹이 붕어에 묻어 온 것 — 닻벌레 · 물이 · 흡충
   [출처: Lernaea·Argulus 숙주와 병변(어병학), 먹이어를 통한 기생충 유입] */
function hlt_15hold(){return hlt_hold(55+(isSp('@small')?15:0),'HLT-15-D',{t:'{n}의 비늘 사이에 붙은 것은 떨어지지 않았습니다. 그 자리가 붉게 부었습니다.',c:'bad',fx:{h:-10},set:{hlt_wound:1},run:hlt_chain('HLT-23')},isSp('pleco')?1.4:1)}
fev([{id:'HLT-15',tier:'fact',need:{qt:0},cd:45,
  w:()=>(fl('hlt_feeder')||fl('hlt_para')||S.f.tank==='pond'?2.5:.4)*(isKind('bait','content','casual','eager','decor')?1.5:1),
  p:'며칠 전 들어온 물고기 몇 마리가 다 먹히지 않고 남았습니다. 몸 어딘가가 자꾸 가렵습니다. 비늘 사이에 무언가가 붙어 있습니다. {n}은…',
  o:[
   {l:'바닥 돌과 유목에 몸을 세게 문지른다',chk:['p',40],
    ok:{t:'{n}의 몸에서 납작한 것 몇 마리가 떨어져 나갔습니다.',c:'good',fx:{h:-3,p:1}},
    no:{t:'긁힌 자리의 비늘이 떨어졌습니다.',c:'bad',fx:{h:-6},set:{hlt_wound:1},run:hlt_then(hlt_15hold)}},
   {l:'주인 앞에서 몸을 돌려 가려운 쪽을 보인다',chk:['c',60],
    ok:()=>hlt_by({'content unbox':{t:'주인은 핀셋으로 닻벌레를 뽑는 영상을 올렸습니다. "여드름 짜기 같아요"라는 댓글이 달렸고, 조회수가 잘 나와 주인은 그 뒤로 먹이 붕어를 일부러 같은 가게에서 샀습니다.',c:'sub',fx:{h:-4},set:{hlt_feeder:1}},
      '*':{t:'주인이 핀셋으로 붙어 있던 것을 뽑고 상처를 소독했습니다.',c:'good',fx:{h:-3},near:'qt'}}),
    no:()=>hlt_15hold()},
   {l:'수초 그늘에 가만히 있는다',ok:()=>hlt_15hold()}
  ]}]);

/* EV-HLT-16 복어의 이빨 — 달팽이 · 부리 · 수의사
   [출처: 복어류 치판 과성장과 수의 치료(마취 하 트리밍), 피퍼퍼 먹이(달팽이)] */
function hlt_16hold(){return hlt_hold(35+(isSp('fig8')&&!fl('hlt_brack')?15:0),'HLT-16-D',{t:'{n}은 먹이 앞에서 입을 여러 번 벌렸다 닫았습니다. 몇 개는 삼켰습니다.',c:'bad',fx:{h:-8,fat:-.15},run:()=>{S.f.beak=(S.f.beak||0)+.2}},isSp('peapuffer')?.75:1)}
fev([{id:'HLT-16',tier:'fact',sp:['@puffer'],cd:30,when:()=>!S.f.snails,w:()=>1+(S.f.beak||0)*3,
  p:'이빨이 서로 맞물리지 않습니다. 먹이를 물어도 잘 끊어지지 않습니다. 입 앞쪽이 조금씩 길어집니다. {n}은…',
  o:[
   {l:'유리벽과 돌 모서리에 입을 대고 긁는다',chk:['p',25],
    ok:{t:'{n}의 이빨 끝이 조금 닳았습니다.',c:'good',fx:{p:1},run:()=>{S.f.beak=Math.max(0,(S.f.beak||0)-.15)}},
    no:()=>hlt_16hold()},
   {l:'주인 눈을 따라 다니다 입을 벌렸다 다물기를 반복해 보인다',chk:['w',60],
    ok:()=>{
      if(R()>clamp(Math.pow(fst().c/60,2),.05,.95))return {t:'주인은 {n}이 밥을 달라는 줄 알았습니다.',fx:{wq:-4},run:hlt_then(hlt_16hold)};
      return hlt_by({'expert learner staff':()=>R()<.3?{end:'HLT-16-H'}:{t:'주인이 "복어 입"을 검색했습니다. 달팽이를 키우기 시작했고, 수의사에게 데려가 마취한 뒤 부리를 갈아 냈습니다. 마취에서 깬 {n}은 한참 바닥에 비스듬히 누워 있다가, 저녁에 달팽이 하나를 깨 먹었습니다.',c:'good',fx:{h:-5},run:()=>{S.f.snails=1;S.f.beak=0}},
        'eager content unbox':{t:'주인이 "복어 부리 자르기" 영상을 찾았습니다. 그리고 손톱깎이를 꺼냈습니다.',c:'bad',run:hlt_then(()=>hlt_hold(60,'HLT-16-C',{t:'손톱깎이가 이빨판 끝만 잘라 냈습니다. {n}은 한참 떨다가 숨을 골랐습니다.',c:'sub',fx:{h:-12,st:.2},run:()=>{S.f.beak=0}}))},
        '*':{t:'주인은 달팽이를 몇 마리 사 와 수조에 넣었습니다.',c:'good',fx:{w:2},run:()=>{S.f.snails=1;S.f.beak=Math.max(0,(S.f.beak||0)-.3)}}});
    },
    no:()=>hlt_16hold()},
   {l:'은신처에서 가만히 있는다',ok:()=>hlt_16hold()}
  ]}]);

/* EV-HLT-17 작은 수조에서 멈춘 성장
   [출처: 관상어 성장 억제와 사육 공간·수질(어류 생리학), 작은 수조 금붕어 기형 사례] */
function hlt_17res(){
  if(isSp('oscar'))return hlt_hold(60,'HLT-17-D',{t:'{n}의 몸이 짧고 높아졌습니다. 머리에 작은 구멍이 생겼습니다.',c:'bad',fx:{h:-8},sick:'hex',set:{hlt_stunt:1}});
  if(isSp('pleco'))return hlt_hold(60,'HLT-17-D',{t:'{n}은 버텼습니다. 수조는 배설물로 가득 찼습니다.',c:'bad',fx:{wq:-15,h:-5}},1.3);
  return hlt_hold(60,'HLT-17-D',{t:isSp('channa','motoro')?'{n}의 꼬리와 몸 가장자리가 유리에 쓸려 상했습니다.':'{n}의 몸은 더 자라지 않았습니다. 척추가 조금 휘었습니다.',c:'bad',fx:{h:-8,fin:.08},set:{hlt_stunt:1,inj_spine:1}});
}
fev([{id:'HLT-17',tier:'fact',sp:['@big','comet'],need:{hlt_small:1},cd:40,
  w:()=>isKind('casual','gift','shared','decor','relay','cult')?2:1,
  p:'몸을 돌릴 때 꼬리가 유리에 닿습니다. 먹은 만큼 몸이 자라지 않습니다. 물은 늘 탁합니다. {n}은…',
  o:[
   {l:'좁은 수조를 끝에서 끝까지 쉬지 않고 오간다',ok:()=>{const o=hlt_17res();if(!o.end)o.fx=Object.assign({},o.fx||{},{p:1});return o}},
   {l:'주인이 볼 때마다 유리 앞에서 몸을 크게 돌려 보인다',chk:['c',65],
    ok:()=>{
      if(isSp('koi')&&fst().c>=80&&R()<.5)return {end:'HLT-17-H'};
      return hlt_by({'relay casual gift shared':{t:'"너무 커졌다." 주인은 {n}을 나눔 글에 올렸습니다.',c:'bad',run:()=>fRehome('주인은 "너무 커져서" {n}을 무료 분양 글에 올렸습니다.')},
        'learner expert grandma staff techbro':{t:'"얘 너무 답답해 보인다." 주인이 더 큰 수조를 들였습니다.',c:'good',fx:{c:2,st:-.1},run:hlt_upTank},
        '*':{t:'주인은 {n}이 춤을 춘다고 생각했습니다.',run:hlt_then(hlt_17res)}});
    },
    no:()=>hlt_17res()},
   {l:'가운데에서 움직임을 줄인다',chk:['g',60],ok:{t:'{n}은 몸을 아꼈습니다. 이번에는 더 나빠지지 않았습니다.',fx:{g:2}},no:()=>hlt_17res()}
  ]}]);

/* =====================================================================
   C. 질병 — 실제 병원체 · 종별 병리
   ===================================================================== */

/* EV-HLT-18 하얀 점 — 백점병 (치료 방법이 종마다 다르다)
   [출처: Ichthyophthirius multifiliis 생활사와 수온, 비늘 없는 어종 약물 감수성, 금붕어 백점병 소금 치료] */
function hlt_18hold(mod){return hlt_hold(50,'HLT-18-D',{t:'{n}은 하얀 점을 단 채 며칠을 버텼습니다.',c:'bad',fx:{h:-10},sick:'ich'},(mod||1)*(isSp('pleco','bichir','gar','channa')?1.3:1)*(isSp('clownloach','altum','neon','ghost','motoro','peapuffer')?.8:1))}
function hlt_18owner(){
  const sc=isSp('@scaleless');
  return hlt_by({
   'expert staff':{t:sc?'주인이 {n}을 격리 수조로 옮겼습니다. 비늘 없는 몸에 맞게 약은 절반만 넣었습니다.':isSp('@gold','koi')?'주인이 {n}을 격리하고 소금과 약으로 치료를 시작했습니다.':'주인이 {n}을 격리하고 수온을 조금씩 올리며 약을 정량대로 넣었습니다.',c:'good',sick:'ich',run:()=>{hlt_treat('ich');fevNear('qt')}},
   'learner':()=>sc&&R()<.5?Object.assign(hlt_med(),{sick:'ich'}):{t:sc?'주인이 라벨 뒷면을 끝까지 읽고 약을 절반만 넣었습니다.':isSp('@gold','koi')?'주인은 "수온을 올리세요"라는 글대로 히터를 세게 틀었습니다. 찬물 고기의 숨이 가빠졌습니다.':'주인이 라벨대로 약을 넣었습니다.',c:isSp('@gold','koi')&&!sc?'bad':'good',fx:isSp('@gold','koi')&&!sc?{h:-8,wq:-6}:{},sick:'ich',run:()=>{hlt_treat('ich');if(sc)fevNear('label')}},
   'eager alchemist':{t:'주인이 약을 세 가지 한꺼번에 넣었습니다.',c:'bad',sick:'ich',set:{hlt_cocktail:1},run:()=>{hlt_treat('ich',1);hlt_chain('HLT-36')()}},
   'neglect cult':{t:'주인은 하얀 점을 보고도 아무것도 하지 않았습니다.',c:'bad',pl:[[1,'백점병을 그냥 둠']],run:hlt_then(()=>hlt_18hold())},
   '*':()=>sc?Object.assign(hlt_med(),{sick:'ich'}):{t:'주인이 마트에서 백점약을 사 와 넣었습니다. 물은 갈지 않았습니다.',c:'sub',sick:'ich',run:()=>hlt_treat('ich',1)}
  });
}
fev([{id:'HLT-18',tier:'fact',cd:40,when:()=>hlt_free('ich'),
  w:()=>(hlt_ill('ich')?3:1)*(isSp('clownloach')?2.5:isSp('altum','neon','ghost','motoro','peapuffer')?1.6:isSp('pleco','bichir','gar','channa')?.5:1)*(fl('qt')?.4:1),
  p:'지느러미 끝에 작은 흰 점이 몇 개 보입니다. 다음 날 점이 몸통까지 번집니다. 몸 여기저기가 따끔거려 가만히 있을 수가 없습니다. {n}은…',
  o:[
   {l:'바닥 돌과 수초에 몸을 비빈다',ok:{t:'비빈 자리마다 피부가 긁혔습니다. 흰 점은 그대로였습니다.',c:'bad',fx:{h:-4},set:{hlt_wound:1},sick:'ich',run:hlt_then(()=>hlt_18hold(.9))}},
   {l:'주인 앞으로 나와 지느러미를 다 펴고 멈춘다',chk:['c',60],ok:()=>hlt_18owner(),
    no:()=>isSp('clownloach')?{t:'"또 자네." 주인은 옆으로 누운 {n}을 보고 지나갔습니다.',sick:'ich',run:hlt_then(()=>hlt_18hold())}:hlt_18hold()},
   {l:'수초 사이에 지느러미를 접고 가만히 있는다',ok:()=>hlt_18hold()}
  ]}]);

/* EV-HLT-19 금가루 — 벨벳병
   [출처: Piscinoodinium pillulare 생물학(엽록체 보유, 광 의존성), 벨벳병 진단·치료(어병학)] */
function hlt_19hold(mod){return hlt_hold(50,'HLT-19-D',()=>hlt_19owner(),(mod||1)*(isSp('neon')?.7:1))}
function hlt_19owner(){
  return hlt_by({
   'expert staff breeder':{t:'주인이 손전등을 비스듬히 비춰 금가루를 찾아냈습니다. 수조에 암막을 치고 약을 넣었습니다. 사흘 뒤 {n}의 몸이 맑아졌습니다.',c:'good',fx:{h:-6,w:2},run:()=>{hlt_cure('velvet');setFl('hlt_dark',1)}},
   'learner':()=>R()<.5?{t:'주인은 백점병 약을 넣었습니다. 잘 듣지 않았습니다.',c:'bad',fx:{h:-8},sick:'velvet',run:()=>hlt_treat('velvet',1)}:{t:'주인이 "벨벳병"을 찾아냈습니다. 불을 끄고 약을 넣었습니다.',c:'good',sick:'velvet',run:()=>hlt_treat('velvet')},
   'mill':{t:'출하 전 일괄 약욕이 있었습니다. {n}은 살아남은 쪽이었습니다.',c:'sub',fx:{h:-10},run:()=>hlt_cure('velvet')},
   '*':{t:isSp('betta')?'주인은 금빛이 원래 {n}의 색인 줄 알았습니다.':'주인은 아무것도 알아채지 못했습니다.',c:'bad',fx:{h:-8},sick:'velvet'}
  });
}
fev([{id:'HLT-19',tier:'fact',cd:40,when:()=>hlt_free('velvet'),
  w:()=>(hlt_ill('velvet')?3:1)*(isSp('@labyrinth')?2.5:isSp('@small','@gold')?1.4:isSp('@big','bichir','gar','channa','pleco')?.3:1)*(isKind('mill','breeder','casual','eager')?1.4:1),
  p:'몸 표면이 빛을 받으면 금빛 먼지가 앉은 것처럼 보입니다. 지느러미를 펴는 것이 힘들고 자꾸 몸에 붙습니다. 숨이 빨라집니다. {n}은…',
  o:[
   {l:'어두운 수초 그늘을 찾아 들어간다',chk:['w',45],ok:()=>hlt_19hold(1.5),no:()=>hlt_19hold()},
   {l:'수면에서 공기를 자주 마신다',chk:()=>isSp('@airbreather')?['g',45]:null,
    ok:()=>isSp('@airbreather')?hlt_19hold(1.4):hlt_19hold(),no:()=>hlt_19hold()},
   {l:'바닥에서 지느러미를 접고 가만히 있는다',ok:()=>hlt_19hold()}
  ]}]);

/* EV-HLT-20 안장 모양 흰 반점 — 컬럼나리스 (따뜻하게 하면 더 빨라지는 병)
   [출처: Flavobacterium columnare 병리와 수온 의존성, 컬럼나리스 치료(어병학)] */
function hlt_20hold(mod){return hlt_hold(55+(isSp('@livebearer')||fl('hlt_shimmy')?15:0),'HLT-20-D',{t:'{n}의 등에 하얀 띠가 남았습니다. 아직 헤엄치고 있습니다.',c:'bad',fx:{h:-10},sick:'columnaris'},mod)}
fev([{id:'HLT-20',tier:'fact',cd:40,when:()=>hlt_free('columnaris'),
  w:()=>(hlt_ill('columnaris')?3:1)*(isSp('@livebearer')?2:isSp('@gold','koi','betta','altum','neon','clownloach','cory')?1.3:.7)*(S.f.wq<55?1.5:1),
  p:'등지느러미 아래 피부가 하얗게 바래 갑니다. 하얀 자리가 등 양옆으로 번져 띠처럼 보입니다. 입 주변이 솜털처럼 뿌옇게 일어납니다. {n}은…',
  o:[
   {l:'주인 앞에서 등을 보이며 천천히 돈다',chk:['c',55],
    ok:()=>hlt_by({'expert staff':{t:'주인이 "컬럼나리스"라고 바로 알아봤습니다. 수온을 오히려 조금 낮추고 약욕을 시작했습니다.',c:'good',sick:'columnaris',run:()=>hlt_treat('columnaris')},
      'learner':()=>R()<.5?{t:'주인은 곰팡이라고 생각했습니다.',c:'bad',sick:'columnaris',run:hlt_chain('HLT-21')}:{t:'주인이 증상을 비교해 보고 세균 감염이라는 걸 알았습니다. 약욕을 시작했습니다.',c:'good',sick:'columnaris',run:()=>hlt_treat('columnaris')},
      'eager casual gift content':{t:'주인은 백점병이라며 히터 온도를 올렸습니다.',c:'bad',run:hlt_then(()=>hlt_20hold(.5))},
      '*':{t:'주인은 하얀 자리를 보고도 지나갔습니다.',c:'bad',run:hlt_then(()=>hlt_20hold())}}),
    no:()=>hlt_20hold()},
   {l:'여과기 물살이 약한 구석으로 간다',chk:['w',40],ok:()=>hlt_20hold(1.4),no:()=>hlt_20hold()},
   {l:'바닥에서 가만히 있는다',ok:()=>hlt_20hold()}
  ]}]);

/* EV-HLT-21 입 곰팡이라는 이름 — 오진과 항진균제
   [출처: "mouth fungus"가 Flavobacterium columnare 감염이라는 어병학 기술] */
function hlt_21hold(mod){return hlt_hold(50,'HLT-21-D',{t:'{n}의 입술 가장자리가 하얗게 남았습니다. 먹이를 조금씩 물기 시작했습니다.',c:'bad',fx:{h:-8,fat:-.1},sick:'columnaris',set:{scar_jaw:isSp('oscar','arowana','channa')?1:0}},mod)}
fev([{id:'HLT-21',tier:'fact',sp:['@gold','koi','guppy','platy','betta','oscar','arowana','channa'],cd:40,when:()=>hlt_free('columnaris'),
  w:()=>(hlt_ill('columnaris')?3:.6)*(isKind('learner','eager','alchemist','casual','grandma')?1.4:1),
  p:'입술 가장자리가 하얗게 부풀어 있습니다. 먹이를 물면 아픕니다. 입을 다물 때 무언가 걸리는 느낌이 있습니다. {n}은…',
  o:[
   {l:'먹이를 물었다가 뱉기를 반복한다',ok:()=>Object.assign(hlt_21hold(.9),isKind('content','casual')?{t:'"입맛이 없나." 주인은 사료를 바꿨습니다.'}:{})},
   {l:'주인이 오면 입을 벌리고 유리에 대고 멈춘다',chk:['c',65],
    ok:()=>R()<({expert:1,staff:1,learner:.6,eager:.3,grandma:.2}[kindOf()]||.3)
      ?{t:'주인이 사진을 찍어 올렸습니다. 첫 댓글은 "입 곰팡이 아니고 컬럼나리스예요"였습니다. 주인은 항생제 약욕을 시작했습니다.',c:'good',sick:'columnaris',run:()=>hlt_treat('columnaris')}
      :{t:'주인이 사진을 찍어 올렸습니다. 첫 댓글은 "입 곰팡이네요"였습니다. 주인은 곰팡이약을 넣고 사흘을 기다렸습니다.',c:'bad',run:()=>{if(isKind('eager'))addFl('meds');q(null,null,()=>fevOut(hlt_21hold(.6)))}},
    no:()=>hlt_21hold()},
   {l:'먹이를 포기하고 구석에 있는다',ok:()=>hlt_21hold()}
  ]}]);

/* EV-HLT-22 녹는 지느러미 — 지느러미 썩음병
   [출처: Aeromonas·Pseudomonas 지느러미 부식(어병학), 수질과 지느러미 썩음] */
function hlt_22hold(mod){return hlt_hold(50,'HLT-22-D',{t:'{n}의 지느러미 끝이 조금 더 짧아졌습니다.',c:'bad',fx:{h:-6,fin:.1},sick:'finrot'},(mod||1)*(isSp('koi','comet','pleco','gar')?1.3:1))}
fev([{id:'HLT-22',tier:'fact',cd:40,when:()=>hlt_free('finrot'),
  w:()=>(hlt_ill('finrot')?3:1)*(isSp('@longfin')?2.5:1)*sideK('flare')*(S.f.wq<55||S.f.fin>.15?1.6:.6)*(isKind('cult','neglect','casual','mill','gift')?1.4:1),
  p:'꼬리지느러미 끝이 들쭉날쭉해졌습니다. 가장자리가 하얗거나 검게 변했습니다. 매일 조금씩 짧아집니다. {n}은…',
  o:[
   {l:'지느러미를 크게 펴 주인에게 보인다',chk:['c',60],
    ok:()=>isKind('cult')&&isSp('betta')?{t:'"베타는 원래 지느러미가 잘 상해요." 주인은 그렇게 말했습니다.',c:'bad',sick:'finrot',run:hlt_then(()=>hlt_22hold())}
      :hlt_by({'neglect mill':{t:'주인은 보지 않았습니다.',sick:'finrot',run:hlt_then(()=>hlt_22hold())},
        '*':{t:'주인이 물을 갈고 약을 넣었습니다. 지느러미는 다시 자랐지만, 예전과 다른 모양이었습니다.',c:'good',fx:{c:-2},set:{scar_fin:1},sick:'finrot',run:()=>{hlt_treat('finrot');hlt_learn('hlt_wc','주인은 물을 정해진 날마다 갈기 시작했습니다.')}}}),
    no:()=>hlt_22hold()},
   {l:'수초 잎 위에 올라가 쉰다',chk:['g',45],ok:()=>hlt_22hold(isSp('@longfin')?1.5:1.2),no:()=>hlt_22hold()},
   {l:'바닥에서 지느러미를 접고 있는다',ok:()=>hlt_22hold()}
  ]}]);

/* EV-HLT-23 솜털 — 물곰팡이 (사프롤레그니아)
   [출처: Saprolegnia spp.(난균류) 2차 감염, 저수온과 발병] */
function hlt_23hold(mod){return hlt_hold(55,'HLT-23-D',{t:'솜털 아래 상처가 조금 더 넓어졌습니다.',c:'bad',fx:{h:-8},sick:'fungus'},(mod||1)*(season()==='winter'?.85:1))}
fev([{id:'HLT-23',tier:'fact',need:{hlt_wound:1},cd:35,when:()=>hlt_free('fungus'),w:()=>hlt_ill('fungus')?3:1.2,
  p:'며칠 전 다친 자리에 흰 솜털 같은 것이 자랍니다. 물살에 털이 흔들립니다. 그 아래가 욱신거립니다. {n}은…',
  o:[
   {l:'솜털이 난 쪽을 돌에 문질러 떼어 내려 한다',chk:['p',35],
    ok:{t:'솜털 일부가 떨어졌습니다. 상처 속 균사는 남았습니다.',fx:{h:-3},sick:'fungus',run:hlt_then(()=>hlt_23hold(1.2))},
    no:{t:'상처가 더 벌어졌습니다.',c:'bad',fx:{h:-6},sick:'fungus',run:hlt_then(()=>hlt_23hold(.85))}},
   {l:'주인 앞에서 다친 쪽을 보인다',chk:['c',55],
    ok:()=>isSp('@scaleless')
      ?(isKind('expert','staff','learner')?{t:'주인이 비늘 없는 몸에 맞게 약을 절반만 넣었습니다.',c:'good',sick:'fungus',run:()=>hlt_treat('fungus')}:{t:'주인이 물에 소금을 풀었습니다.',c:'bad',sick:'fungus',set:{hlt_salt:1},run:hlt_chain('HLT-37')})
      :isSp('@gold','koi')?{t:'주인이 소금을 풀고 수온을 조금 올렸습니다.',c:'good',sick:'fungus',run:()=>hlt_treat('fungus')}
      :{t:'주인이 히터를 켜고 곰팡이약을 넣었습니다.',c:'good',sick:'fungus',run:()=>{S.f.heater=1;hlt_treat('fungus')}},
    no:()=>hlt_23hold()},
   {l:'가만히 있는다',ok:()=>hlt_23hold()}
  ]}]);

/* EV-HLT-24 솔방울 — 복수(腹水)와 주인의 마지막 결정
   [출처: 어류 복수증(dropsy)의 원인과 예후, 관상어 안락사 지침(AVMA 어류 안락사 지침·정향유/유제놀), 살아 있는 물고기 변기 처리 문제] */
function hlt_24owner(){
  return hlt_by({
   'expert staff':()=>R()<.15?{t:'주인이 엡솜염 약욕과 항생제를 며칠 이어 갔습니다. {n}의 배가 조금씩 가라앉았습니다.',c:'good',fx:{h:-10},run:()=>hlt_cure('aero')}:{end:'HLT-24-R'},
   'learner':()=>R()<.15?{t:'주인이 검색한 대로 엡솜염 약욕을 했습니다. {n}의 비늘이 다시 몸에 붙었습니다.',c:'good',fx:{h:-12},run:()=>hlt_cure('aero')}:R()<.5?{end:'HLT-24-R'}:{t:'주인은 방법을 찾다가 밤을 새웠습니다. 결정을 내리지 못했습니다.',c:'bad',sick:'aero',fx:{h:-10}},
   'grandma':()=>R()<.2?{t:'"물고기도 아프면 병원 가야지." 할머니가 {n}을 수의사에게 데려갔습니다. 주사를 맞은 {n}의 배가 조금씩 가라앉았습니다.',c:'good',fx:{h:-10},run:()=>hlt_cure('aero')}:{end:'HLT-24-R'},
   'neglect cult':{end:'HLT-24-D'},
   '*':{end:'HLT-24-T'}
  });
}
fev([{id:'HLT-24',tier:'fact',cd:40,when:()=>hlt_free('aero'),
  w:()=>(hlt_ill('aero')?4:.4)*((S.f.fat||0)>.2?1.6:1)*(fl('old')?1.6:1)*(isSp('@gold','betta','guppy','platy','koi','oscar')?1.4:.7),
  p:'배가 계속 부풀어 오릅니다. 위에서 보면 비늘이 몸에서 들떠 솔방울처럼 일어서 있습니다. 눈이 조금 튀어나왔습니다. {n}은…',
  o:[
   {l:'먹이가 떨어지면 그래도 수면으로 올라간다',chk:['g',60],
    ok:{t:'{n}은 부푼 배로 수면까지 올라가 먹이를 받았습니다.',fx:{h:-6},sick:'aero'},
    no:()=>hlt_hold(60,'HLT-24-D',{t:'{n}은 중간에서 멈췄다가 다시 가라앉았습니다.',c:'bad',fx:{h:-10},sick:'aero'})},
   {l:'주인 손가락이 유리에 닿으면 그쪽으로 다가간다',chk:['c',50],ok:()=>hlt_24owner(),
    no:()=>hlt_hold(60,'HLT-24-D',{t:'주인은 {n}이 살이 쪘다고 생각했습니다.',c:'bad',fx:{h:-10},sick:'aero'})},
   {l:'바닥에서 거의 움직이지 않는다',ok:()=>R()<.7?(R()<.5?hlt_24owner():{end:'HLT-24-D'}):{t:'{n}은 바닥에서 하루를 더 넘겼습니다.',c:'bad',fx:{h:-12},sick:'aero'}}
  ]}]);

/* EV-HLT-25 뒤집힌 배 — 부레 이상 (치료 루트)
   [출처: 팬시 금붕어 부레 이상 원인(체형·급이), 금식·완두콩 관리(관상어 수의 자료)] */
function hlt_25owner(){
  return hlt_by({
   'expert learner staff techbro':()=>R()<(isSp('betta')?.8:.6)?{t:'주인은 {n}을 사흘 굶긴 뒤 껍질 깐 완두콩을 주고, 수위를 낮추고, 가라앉는 사료로 바꿨습니다. {n}의 몸이 다시 수평이 되었습니다.',c:'good',fx:{h:4},run:()=>{hlt_cure('swimb');setFl('hlt_sink',1)}}
     :isSp('oranda')&&fst().c>=85?{end:'HLT-25-H'}:{t:'{n}은 한동안 나아졌다가 다시 기울었습니다.',c:'bad',sick:'swimb',run:()=>hlt_treat('swimb',1)},
   'grandma':{t:'"기운 내라고." 할머니는 밥알을 더 넣어 주었습니다.',c:'bad',fx:{fat:.15,h:-6},sick:'swimb',run:hlt_then(()=>hlt_hold(45,'HLT-25-D',{t:'{n}은 기운 채로 하루를 더 넘겼습니다.',fx:{h:-6}}))},
   'content unbox':{t:'주인은 뒤집혀 헤엄치는 {n}을 찍어 올렸습니다. "귀엽다"는 댓글이 달렸습니다.',c:'bad',sick:'swimb'},
   '*':()=>hlt_hold(45,'HLT-25-D',{t:'주인은 그대로 두었습니다. {n}은 기운 채로 살았습니다.',c:'bad',fx:{h:-8},sick:'swimb'})
  });
}
fev([{id:'HLT-25',tier:'fact',sp:['oranda','ryukin','betta','comet','koi'],cd:35,when:()=>hlt_free('swimb'),
  w:()=>(hlt_ill('swimb')?3:1)*(isSp('comet','koi')?.1:isSp('oranda','ryukin')?2:1)*((S.f.fat||0)>.2?1.6:1)*(fl('hlt_sink')?.3:1),
  p:'몸이 마음대로 기울어집니다. 꼬리를 저으면 머리가 아래로 박히고, 멈추면 배가 위로 떠오릅니다. {n}은…',
  o:[
   {l:'꼬리를 세게 저어 바로 서려 한다',chk:['p',30],ok:()=>hlt_25owner(),no:{t:'{n}은 기운이 빠져 다시 뒤집혔습니다.',c:'bad',fx:{h:-4},sick:'swimb',run:hlt_then(hlt_25owner)}},
   {l:'수초 잎이나 바닥 돌 사이에 몸을 끼워 기울지 않게 한다',chk:['w',30],ok:{t:'{n}은 수초 사이에 몸을 끼우고 힘을 아꼈습니다.',fx:{w:2},sick:'swimb',run:hlt_then(hlt_25owner)},no:()=>hlt_25owner()},
   {l:'기울어진 채 가만히 떠 있는다',ok:()=>hlt_25owner()}
  ]}]);

/* EV-HLT-26 머리의 구멍 — HLLE
   [출처: HLLE 원인 가설(수질·영양·활성탄·Hexamita)과 오스카 사례, "원인 미확정" 명시] */
function hlt_26hold(){return hlt_hold(60,'HLT-26-D',{t:'{n}의 머리에 구멍이 하나 더 늘었습니다.',c:'bad',fx:{h:-8},sick:'hex'},isSp('apisto','altum')?.7:1)}
fev([{id:'HLT-26',tier:'fact',sp:['oscar','apisto','altum','arowana'],cd:40,when:()=>hlt_free('hex'),
  w:()=>(hlt_ill('hex')?3:1)*(isSp('oscar')?2:1)*(S.f.wq<60||fl('hlt_feeder')?1.5:.6)*(isKind('content','casual','decor','shared','techbro')?1.4:1),
  p:'눈 위쪽 피부에 작은 구멍이 몇 개 생겼습니다. 구멍이 옆줄을 따라 늘어섭니다. 유리에 비친 얼굴이 낯섭니다. {n}은…',
  o:[
   {l:'주인 얼굴을 알아보고 유리 앞에서 먹이를 조른다',chk:['c',70],
    ok:()=>hlt_by({'expert learner staff':{t:'주인이 얼굴을 가까이 대고 구멍을 보았습니다. 물을 크게 갈고, 먹이를 바꾸고, 약을 썼습니다. 구멍은 멈췄고 흉터가 남았습니다.',c:'good',fx:{c:isSp('oscar')?-10:-3},sick:'hex',run:()=>{hlt_treat('hex');setFl('hlt_diet',1)}},
      'content unbox':{t:'주인은 "얼굴 상처" 영상을 올렸습니다.',c:'bad',sick:'hex',run:hlt_then(hlt_26hold)},
      '*':{t:'"싸웠나 보네." 주인은 그렇게 생각했습니다.',c:'bad',sick:'hex',run:hlt_then(hlt_26hold)}}),
    no:()=>hlt_26hold()},
   {l:'은신처 돌을 입으로 밀어 옮긴다',when:()=>isSp('oscar'),chk:['p',50],
    ok:{t:'돌이 굴러가는 소리에 주인이 다가왔습니다. 얼굴의 구멍을 보았습니다.',c:'good',sick:'hex',run:()=>{hlt_treat('hex',1);if(S.f.heater&&R()<.3){setFl('heater_crack',1);addLog(T('굴러간 돌이 히터 유리관에 부딪혔습니다.'),'bad')}}},
    no:()=>hlt_26hold()},
   {l:'은신처 안에서 가만히 있는다',ok:()=>hlt_26hold()}
  ]}]);

/* EV-HLT-27 항문의 빨간 실 — 카말라누스
   [출처: Camallanus cotti 생활사·병리, 라이브베어러 양식장 감염 보고] */
function hlt_27hold(mod){return hlt_hold(55,'HLT-27-D',{t:'{n}은 먹고 또 먹었습니다. 몸은 조금 더 말랐습니다.',c:'bad',fx:{h:-8,fat:-.15},sick:'skinny',set:{hlt_camal:1}},(mod||1)*(isSp('guppy')?.7:isSp('@predator')?1.3:1))}
fev([{id:'HLT-27',tier:'fact',sp:['guppy','platy','betta','neon','apisto','cory','oscar','arowana','channa','peapuffer'],need:{qt:0},cd:45,when:()=>hlt_free('skinny'),
  w:()=>(isSp('@livebearer')?2.5:isSp('betta')?(isKind('mill')?1:.2):1)*(isKind('mill','breeder','casual','gift','relay')?1.5:1),
  p:'배가 홀쭉해지는데 먹이는 계속 먹고 싶습니다. 꼬리 근처에서 무언가 가늘고 붉은 것이 흔들립니다. 몸을 웅크리면 그것이 다시 안으로 들어갑니다. {n}은…',
  o:[
   {l:'먹이 시간마다 가장 먼저 올라가 많이 먹는다',ok:{t:'먹어도 배는 차오르지 않았습니다.',run:hlt_then(()=>hlt_27hold())}},
   {l:'주인 앞에 꼬리를 보이며 멈춘다',chk:['c',55],
    ok:()=>hlt_by({'expert staff breeder':{t:'주인이 "물고기 엉덩이 빨간 실"을 검색했습니다. 수조 전체에 구충제를 넣고, 몇 주 뒤 한 번 더 넣었습니다.',c:'good',fx:{h:-4},run:()=>{hlt_cure('skinny');setFl('hlt_camal',0);fevNear('qt')}},
      'learner':()=>R()<.5?{t:'주인이 구충제를 한 번 넣었습니다. 몇 주 뒤 빨간 실이 다시 보였습니다.',c:'bad',sick:'skinny',run:()=>hlt_treat('skinny',1)}:{t:'주인이 구충제를 두 번에 나눠 넣었습니다.',c:'good',run:()=>hlt_cure('skinny')},
      'mill':{t:'주인은 {n}을 다른 상품들과 함께 출하 목록에 올렸습니다.',c:'bad',sick:'skinny'},
      '*':{t:'주인은 {n}이 똥을 매달고 있다고 생각했습니다.',c:'bad',run:hlt_then(()=>hlt_27hold())}}),
    no:()=>hlt_27hold()},
   {l:'무리 속에 섞여 가만히 있는다',ok:()=>hlt_27hold()}
  ]}]);

/* EV-HLT-28 새로 온 잉어 한 마리 — KHV
   [출처: 코이 헤르페스바이러스(CyHV-3) 병리·수온 범위·폐사율·보균(OIE/WOAH 매뉴얼), 국내 수산생물전염병 지정 여부(수산생물질병 관리법)] */
function hlt_28hold(mod){return hlt_hold(70,'HLT-28-D',{t:'연못의 잉어 대부분이 떠오른 뒤에도 {n}은 살아 있었습니다. 바이러스는 {n}의 몸속에 남았습니다.',c:'bad',fx:{h:-25,st:.2},run:()=>{S.f.carrier='khv';setFl('hlt_khvc',1)},mem:'연못이 조용해졌다. 혼자 남았다.'},mod)}
fev([{id:'HLT-28',tier:'fact',sp:['koi'],need:{pond:1,qt:0,season:['spring','autumn']},cd:80,when:()=>hlt_free('khv'),
  w:()=>isKind('grandma','decor','touch','release','breeder')?2:isKind('expert')?.3:1,
  log:'연못에 새 잉어 한 마리가 들어왔습니다.',
  p:'새로 들어온 잉어가 연못 가장자리에서 혼자 떠 있습니다. 며칠 뒤 다른 잉어들도 수면 가까이에서 입을 벌립니다. 아가미 안쪽이 쓰라립니다. {n}은…',
  o:[
   {l:'폭포 물줄기 가까이 간다',chk:['w',50],ok:()=>hlt_28hold(1.25),no:()=>hlt_28hold()},
   {l:'사람들이 오면 손바닥 쪽으로 다가간다',chk:['c',60],
    ok:()=>hlt_by({'expert':()=>R()<.5?{end:'HLT-28-K'}:{t:'주인이 바로 수산 질병 신고를 했습니다. 연못의 수온을 바꾸고 몇 주를 버텼습니다.',c:'sub',run:hlt_then(()=>hlt_28hold(1.4))},
      'grandma breeder':{t:'주인이 이상한 걸 알아채고 수의사를 불렀습니다.',c:'sub',run:hlt_then(()=>hlt_28hold(1.3))},
      '*':{t:'"날이 더워서 그래." 주인은 그렇게 말했습니다.',c:'bad',run:hlt_then(()=>hlt_28hold())}}),
    no:()=>hlt_28hold()},
   {l:'연못 가장자리 그늘에 가만히 있는다',ok:()=>hlt_28hold()}
  ]}]);

/* EV-HLT-29 붉어지는 아가미 — 금붕어 헤르페스 (CyHV-2)
   [출처: Cyprinid herpesvirus 2(금붕어 조혈기 괴사증) 병리·수온, 국내 금붕어 집단 폐사 보고] */
function hlt_29hold(mod){return hlt_hold(60,'HLT-29-D',()=>isSp('comet')&&fst().g>=75&&isKind('decor')?{end:'HLT-29-H'}
  :{t:'같이 온 금붕어들이 떠오른 뒤에도 {n}은 살아 있었습니다.',c:'bad',fx:{h:-20},run:()=>{S.f.carrier='cyhv2'}},mod)}
fev([{id:'HLT-29',tier:'fact',sp:['@gold'],need:{qt:0},cd:80,when:()=>hlt_free('cyhv2'),
  w:()=>(isKind('gift','casual','relay','decor','shared')?2:1)*(['spring','autumn'].includes(season())?1.5:.6),
  p:'같이 온 금붕어 한 마리가 어제부터 바닥에 가라앉아 있습니다. 오늘은 두 마리입니다. 숨이 빨라지고 몸에 힘이 들어가지 않습니다. {n}은…',
  o:[
   {l:'수면에서 먹이를 받는다',ok:()=>hlt_29hold()},
   {l:'주인이 오면 유리 앞에서 지느러미를 흔든다',chk:['c',60],
    ok:()=>isKind('learner','expert','staff')?{t:'주인이 "금붕어 집단 폐사"를 검색했습니다. 약은 없었습니다. 주인은 물을 맑게 유지하고 수조를 조용한 곳으로 옮겼습니다.',c:'sub',run:hlt_then(()=>hlt_29hold(1.6))}
      :{t:'주인은 빈자리에 새 금붕어를 넣었습니다.',c:'bad',run:hlt_then(()=>hlt_29hold())},
    no:()=>hlt_29hold()},
   {l:'바닥에서 다른 금붕어 곁에 가만히 있는다',ok:()=>hlt_29hold()}
  ]}]);

/* EV-HLT-30 하얗게 굳는 등 — 네온병
   [출처: Pleistophora hyphessobryconis 감염 경로·병리, 치료법 부재] */
function hlt_30inf(p){
  if(R()>p*(isSp('neon')?1:.3))return {t:'{n}은 무리와 함께 그 자리를 떠났습니다.',fx:{w:1}};
  return hlt_by({
   'expert staff':{end:'HLT-24-R'},
   'learner':()=>R()<.5?{end:'HLT-24-R'}:hlt_hold(30,'HLT-30-D',{t:'{n}의 등 근육 한쪽이 조금 하얘졌습니다.',c:'bad',fx:{h:-10},sick:'neond'}),
   '*':()=>hlt_hold(30,'HLT-30-D',{t:'{n}의 등 근육 한쪽이 조금 하얘졌습니다.',c:'bad',fx:{h:-10},sick:'neond'},isSp('neon')?.6:1.3)
  });
}
fev([{id:'HLT-30',tier:'fact',sp:['neon','cory','apisto','guppy','platy'],cd:50,when:()=>hlt_free('neond'),
  w:()=>(isSp('neon')?3:.3)*(isKind('casual','neglect')?1.5:1),
  p:'무리 중 한 마리의 줄무늬가 끊어진 것처럼 흐려졌습니다. 그 물고기는 밤에도 무리를 떠나 혼자 헤엄칩니다. 다음 날 아침 그 몸이 바닥에 있고, 다른 물고기들이 그 몸을 쪼고 있습니다. {n}은…',
  o:[
   {l:'바닥의 그 몸을 쪼는 무리에 끼어든다',ok:()=>hlt_30inf(.7)},
   {l:'무리와 함께 수초 위쪽으로 올라간다',chk:['w',35],ok:()=>hlt_30inf(.1),no:()=>hlt_30inf(.35)},
   {l:'수초 사이에서 가만히 있는다',ok:()=>hlt_30inf(.25)}
  ]}]);

/* EV-HLT-31 튀어나온 눈 — 팝아이 (한쪽과 양쪽)
   [출처: 어류 안구돌출(exophthalmia) 원인 분류(외상 vs 전신 질환)] */
const hlt_31one=()=>isSp('arowana','channa','comet','betta','oscar','clownloach')&&S.f.wq>=55;
function hlt_31hold(mod){
  if(hlt_31one())return {t:'한쪽 눈이 하얗게 흐려진 채 남았습니다.',c:'bad',fx:{h:-8},set:{inj_eye:1}};
  return hlt_hold(50,'HLT-31-D',{t:'{n}의 두 눈이 조금 더 밀려 나왔습니다.',c:'bad',fx:{h:-8},set:{inj_eye:1},sick:R()<.3?'aero':null},(mod||1)*(isSp('ghost','bichir','cory')?1.3:1));
}
fev([{id:'HLT-31',tier:'fact',cd:50,when:()=>hlt_free('aero'),
  w:()=>(fl('inj_eye')||hlt_ill('aero')?2.5:.5)*(S.f.wq<50?1.6:1)*(isSp('@jumper','oscar','@gold')?1.4:1),
  p:'눈이 조금씩 앞으로 밀려 나옵니다. 눈 표면이 뿌옇게 흐려 사물이 번져 보입니다. {n}은…',
  o:[
   {l:'보이는 쪽 눈으로 주인을 따라 몸을 돌린다',chk:()=>['c',isSp('oscar')?65:55],
    ok:()=>{
      if(R()<(hlt_31one()?.7:.4))return {t:'주인이 눈을 보고 물을 갈고 엡솜염을 풀었습니다. 눈이 조금씩 들어갔습니다.',c:'good',fx:{h:3},run:()=>{hlt_cure('aero');fevNear('lid')}};
      if(hlt_31one())return {t:'한쪽 눈을 잃은 {n}은 언제나 같은 방향으로만 돌았습니다. 주인은 먹이를 늘 왼쪽에서 넣는 법을 배웠고, 손님이 오면 "얘는 왼쪽 담당"이라고 소개했습니다.',c:'sub',fx:{h:-6},set:{inj_eye:1,hlt_oneeye:1},mem:'세상이 반만 보인다. 먹이는 늘 왼쪽에서 온다.'};
      return hlt_31hold(1.2);
    },
    no:()=>hlt_31hold()},
   {l:'수조 벽과 장식에서 멀리 떨어진 가운데에 머문다',chk:['w',40],ok:{t:'{n}은 아무것에도 부딪히지 않았습니다. 눈은 더 나빠지지 않았습니다.',fx:{w:2}},no:()=>hlt_31hold()},
   {l:'은신처에 가만히 있는다',ok:()=>hlt_31hold()}
  ]}]);

/* EV-HLT-32 아가미 흡충 — 포르말린과 산소
   [출처: Dactylogyrus·Gyrodactylus 병리, 프라지콴텔 치료, 포르말린의 용존산소 소모(어병 치료 매뉴얼)] */
function hlt_32hold(mod){return hlt_hold(55,'HLT-32-D',{t:'{n}은 한쪽 아가미를 벌린 채 며칠을 버텼습니다.',c:'bad',fx:{h:-10},set:{inj_gill:1,hlt_flukes:1}},(mod||1)*(isSp('@airbreather')?1.3:1))}
function hlt_32owner(){
  return hlt_by({
   'expert staff':()=>R()<.85?{t:'주인이 아가미를 들여다보고 흡충 약을 넣었습니다. 일주일 뒤 한 번 더 넣었습니다.',c:'good',fx:{h:-3},set:{hlt_flukes:0},run:()=>fevNear('qt')}:hlt_32hold(),
   'alchemist eager':()=>R()<(isSp('@airbreather')?.3:0)?{t:'주인이 포르말린을 두 배로 넣고 에어 펌프를 껐습니다. {n}은 수면 공기를 마시며 그 밤을 넘겼습니다.',c:'sub',fx:{h:-15},set:{hlt_flukes:0}}:{end:'HLT-32-F'},
   'learner':()=>isSp('@scaleless')?hlt_med():R()<.65?{t:'주인이 라벨대로 포르말린을 넣고, 에어 펌프를 세게 틀었습니다.',c:'good',fx:{h:-6},set:{hlt_flukes:0}}:hlt_32hold(),
   '*':{t:'주인은 백점병 약을 넣었습니다. 아가미 속의 것은 그대로였습니다.',c:'bad',run:hlt_then(()=>hlt_32hold())}
  });
}
fev([{id:'HLT-32',tier:'fact',need:{qt:0},cd:45,
  w:()=>(isSp('@gold','koi','@livebearer','altum','apisto','oscar','clownloach')?2:1)*(fl('hlt_flukes')?2:1)*(isKind('alchemist','eager','learner','expert','staff')?1.3:1),
  p:'아가미 한쪽이 자꾸 벌어진 채 닫히지 않습니다. 가끔 몸이 저절로 휙 돌며 바닥에 옆구리를 긁습니다. 아가미 안에서 무언가 꿈틀거립니다. {n}은…',
  o:[
   {l:'바닥 모래와 돌에 아가미 쪽을 긁는다',ok:()=>R()<.55?hlt_32owner():Object.assign(hlt_32hold(.9),{t:'긁은 자리에서 피가 났습니다. 주인은 보지 못했습니다.'})},
   {l:'물살이 센 곳에서 아가미를 크게 연다',chk:['g',50],ok:()=>hlt_32owner(),no:()=>hlt_32hold()},
   {l:'은신처에서 가만히 있는다',ok:()=>hlt_32hold()}
  ]}]);

/* EV-HLT-33 봄 연못의 궤양 — 면역보다 먼저 깨어나는 세균
   [출처: 잉어 궤양병(Aeromonas salmonicida 비정형 등)과 봄철 수온·면역 지연] */
function hlt_33hold(mod){return hlt_hold(70,'HLT-33-D',{t:'{n}의 옆구리에 둥근 흉터가 남았습니다.',c:'bad',fx:{h:-15},set:{hlt_wound:1}},(mod||1)*(isSp('comet')?.85:1))}
fev([{id:'HLT-33',tier:'fact',sp:['koi','comet','oranda','ryukin'],need:{pond:1,season:'spring'},cd:60,
  w:()=>(fl('hlt_wintered')||fl('hlt_wound')?2.5:1)*(isSp('koi')?1.5:1),
  p:'물이 조금씩 따뜻해집니다. 몸은 아직 겨울처럼 무겁습니다. 옆구리 비늘 한 장이 빠진 자리가 붉게 동그랗게 번집니다. {n}은…',
  o:[
   {l:'햇볕이 드는 얕은 곳으로 올라간다',chk:['g',60],ok:()=>hlt_33hold(1.5),no:()=>hlt_33hold()},
   {l:'사람들이 던지는 먹이를 받아먹는다',chk:['c',60],
    ok:()=>hlt_by({'expert breeder staff':{t:'주인이 상처를 보고 {n}을 격리했습니다. 수의사가 상처를 소독하고 주사를 놓았습니다.',c:'good',fx:{h:-5},run:()=>hlt_learn('hlt_spring','주인은 봄마다 잉어들의 몸을 하나하나 살피게 되었습니다.')},
      'grandma':()=>R()<.5?{t:'할머니가 상처에 빨간약을 발라 주었습니다. 상처가 아물었습니다.',c:'good',fx:{h:-5}}:hlt_33hold(),
      '*':()=>hlt_33hold()}),
    no:()=>hlt_33hold()},
   {l:'깊은 곳에 가만히 있는다',ok:()=>hlt_33hold()}
  ]}]);

/* EV-HLT-34 오래 산 금붕어의 혹 — 종양과 잉어 수두
   [출처: 금붕어 종양 발생 보고(관상어 병리), 잉어 수두(CyHV-1) 계절성 증상] */
function hlt_34gold(){return hlt_hold(50,'HLT-34-D',{t:'{n}은 혹을 단 채 한 해를 더 살았습니다.',c:'sub',fx:{h:-6}})}
fev([{id:'HLT-34',tier:'fact',sp:['@gold','koi'],need:{hlt_old:1},cd:60,w:()=>isKind('grandma')?2.5:1,
  p:()=>isSp('koi')?'오래 살았습니다. 추운 계절이 되자 몸에 하얀 촛농 같은 것이 굳어 붙습니다. {n}은…':'오래 살았습니다. 몸 한쪽에 작은 혹이 생겼고, 해가 지날수록 조금씩 커집니다. {n}은…',
  o:[
   {l:'주인이 부르는 소리에 늘 하던 대로 다가간다',chk:['c',60],
    ok:()=>isSp('koi')
      ?hlt_by({'grandma':{end:'HLT-34-H'},'eager content unbox':{t:'주인이 하얀 혹을 손톱으로 긁어냈습니다. 그 자리에 상처가 남았습니다.',c:'bad',fx:{h:-6},set:{hlt_wound:1},run:hlt_chain('HLT-23')},'*':{t:'주인이 걱정하는 사이 봄이 왔고, 하얀 혹은 사라졌습니다.',c:'good'}})
      :hlt_by({'expert learner staff':()=>R()<.5?{t:'수의사가 피부의 혹을 떼어 냈습니다. {n}은 이틀 동안 바닥에 있다가 다시 먹이를 받으러 올라왔습니다.',c:'good',fx:{h:-8}}:{t:'수의사는 배 속의 혹이라 떼기 어렵다고 했습니다. 주인은 {n}이 아파 보이면 보내 주기로 했습니다.',c:'sub',set:{hlt_tumor:1},run:hlt_then(()=>hlt_hold(50,'HLT-24-R',{t:'{n}은 기운 몸으로 한 계절을 더 살았습니다.',c:'sub',fx:{h:-6}}))},
        'grandma':{t:'"나이 먹으면 다 그래." 할머니는 {n}과 그대로 지냈습니다.',c:'sub',set:{hlt_tumor:1}},
        '*':()=>hlt_34gold()}),
    no:()=>isSp('koi')?{t:'봄이 오자 하얀 혹은 사라졌습니다.',c:'good'}:hlt_34gold()},
   {l:'혹이 있는 쪽을 바닥에 대고 쉰다',ok:{t:'혹 표면이 바닥에 쓸렸습니다.',c:'bad',fx:{h:-5},set:{hlt_wound:1},run:hlt_then(()=>isSp('koi')?{t:'봄이 오자 하얀 혹은 사라졌습니다. 쓸린 자리는 남았습니다.'}:hlt_34gold())}},
   {l:'은신처에 가만히 있는다',ok:()=>isSp('koi')?{t:'봄이 오자 하얀 혹은 사라졌습니다.',c:'good'}:hlt_34gold()}
  ]}]);

/* EV-HLT-35 터지지 않은 알 — 알막힘
   [출처: 금붕어 알막힘(egg retention) 원인·증상(관상어 수의 자료)] */
function hlt_35hold(mod){return hlt_hold(55,'HLT-35-D',{t:'{n}의 배 속 알이 조금씩 흡수되었습니다. 배가 가라앉았습니다.',c:'good',fx:{h:-6}},(mod||1)*(isSp('betta')?1.5:isSp('comet')?1.3:1)*(isSp('oranda','ryukin')?.85:1))}
fev([{id:'HLT-35',tier:'fact',sp:['@gold','koi','betta'],need:{season:'spring'},cd:80,when:()=>fem(),
  w:()=>(isKind('casual','gift','grandma','decor')?1.6:1)*(fSameCount()===0?1.5:.7),
  p:'봄이 왔는데 배가 계속 무겁습니다. 몸 안의 것이 나가지 않습니다. 배가 한쪽으로 단단하게 부풀었습니다. {n}은…',
  o:[
   {l:'수초와 장식에 배를 대고 문지른다',chk:['g',45],ok:{t:'{n}이 수초 사이에 알을 쏟아 냈습니다. 배가 가벼워졌습니다.',c:'good',fx:{g:2}},no:()=>hlt_35hold()},
   {l:'주인이 다가오면 배를 보이며 천천히 돈다',chk:['c',60],
    ok:()=>hlt_by({'expert learner staff':{t:'주인이 수온을 조금씩 바꾸고 수컷을 한 마리 들였습니다. 며칠 뒤 {n}이 알을 낳았습니다.',c:'good',fx:{h:2}},
      'eager':{end:'HLT-35-M'},
      '*':()=>hlt_35hold()}),
    no:()=>hlt_35hold()},
   {l:'바닥에서 가만히 있는다',ok:()=>hlt_35hold()}
  ]}]);

/* =====================================================================
   D. 치료의 실수와 성공 — 약은 물 전체에 퍼진다
   ===================================================================== */

/* EV-HLT-36 약 칵테일 — 여과 세균의 몰살
   [출처: 메틸렌블루·항생제의 질산화 세균 영향, 관상어 약품 병용 주의(제조사 라벨)] */
function hlt_36hold(mod){
  const n=60+(isSp('neon','altum','apisto')?15:0)+(isSp('@scaleless')?10:0);
  return hlt_hold(n,'HLT-36-D',{t:'{n}은 버텼습니다. 물에서는 다시 그 냄새가 올라오기 시작했습니다.',c:'bad',fx:{h:-15,wq:-15},set:{cycled:0,slime_loss:isSp('@scaleless')?1:0,hlt_cocktail:0},run:()=>{S.f.snails=0}},(mod||1)*(isSp('pleco','bichir','gar')?1.3:1));
}
fev([{id:'HLT-36',tier:'fact',own:['alchemist','eager','content'],need:{hlt_medkit:1},cd:35,w:()=>(isKind('alchemist')?4:1.2)*(fl('hlt_cocktail')?3:1),
  p:'물이 파랗게 물들었다가, 다음 날 노랗게, 그다음 날 초록빛으로 바뀝니다. 여과기 스펀지가 원래 색을 잃었습니다. 사흘째부터 다시 그 냄새가 납니다. {n}은…',
  o:[
   {l:'주인이 병을 들고 올 때마다 수조 가장 먼 끝으로 간다',ok:{t:'약은 수조 끝까지 퍼졌습니다.',fx:{w:1},run:hlt_then(()=>hlt_36hold())}},
   {l:'수면 가까이에서 아가미를 보이며 떠 있는다',chk:['c',65],
    ok:()=>R()<({alchemist:.3,eager:.6,content:.4}[kindOf()]||.5)
      ?{t:'"약 너무 넣었나?" 주인이 물을 크게 갈았습니다.',c:'good',fx:{wq:25,h:-6},set:{cycled:0,hlt_cocktail:0},run:()=>hlt_learn('hlt_onemed','주인은 약을 한 번에 하나만 쓰기로 했습니다.')}
      :{t:'주인은 약이 덜 들은 줄 알고 한 병을 더 열었습니다.',c:'bad',run:()=>{addFl('meds');q(null,null,()=>fevOut(hlt_36hold(.8)))}},
    no:()=>hlt_36hold()},
   {l:'바닥에서 가만히 있는다',ok:()=>hlt_36hold()}
  ]}]);

/* EV-HLT-37 비늘 없는 몸에 소금
   [출처: 비늘 없는 어종·담수 가오리 염분 민감성(사육 문헌), 소금욕 농도와 삼투 손상] */
function hlt_37hold(mod){return hlt_hold(45,'HLT-37-D',{t:'{n}의 점막이 군데군데 벗겨진 채 남았습니다.',c:'bad',fx:{h:-12},set:{slime_loss:1}},(mod||1)*(isSp('motoro','cory')?.9:1))}
fev([{id:'HLT-37',tier:'fact',sp:['@scaleless'],need:{hlt_salt:1},cd:30,
  w:()=>isKind('learner','grandma','eager','casual','alchemist')?2:1,
  p:()=>'물이 조금 짭짤해졌습니다. 몸의 미끈한 점액이 뭉쳐 떨어지는 느낌이 듭니다. '+(isSp('motoro')?'원반 가장자리':'수염')+' 끝이 쓰라립니다. {n}은…',
  o:[
   {l:'주인이 오면 유리 앞에서 몸을 뒤집으며 바닥을 긁는다',chk:['w',50],
    ok:()=>R()<clamp(Math.pow(fst().c/50,2),.05,.95)
      ?{t:'주인이 "'+(isSp('cory')?'코리':'비늘 없는 물고기')+' 소금"을 검색했습니다. 그날 물을 크게 여러 번 갈아 소금을 뺐습니다.',c:'good',fx:{h:-4},set:{hlt_salt:0},run:()=>hlt_learn('hlt_scdose','주인은 비늘 없는 물고기에게는 약도 소금도 따로 계산해야 한다는 걸 알게 되었습니다.')}
      :{t:'주인은 {n}이 놀고 있다고 생각했습니다.',run:hlt_then(()=>hlt_37hold())},
    no:()=>hlt_37hold()},
   {l:'여과기 물살 앞 산소 많은 곳에 머문다',chk:['g',50],ok:()=>hlt_37hold(1.5),no:()=>hlt_37hold()},
   {l:'모래에 몸을 파묻고 가만히 있는다',ok:()=>hlt_37hold(isSp('motoro','cory')?.85:1)}
  ]}]);

/* EV-HLT-38 구리 — 달팽이가 먼저 죽는다
   [출처: 구리 약제의 무척추·연골어·비늘 없는 어종 독성, 구리 이온 측정과 유효 농도 범위(제조사 라벨)] */
function hlt_38hold(add){
  const n=55+(add||0)+(isSp('@puffer')?10:0)+(isSp('@scaleless')?20:0)+(isSp('altum','neon')?15:0)-(isSp('@gold','koi','pleco','bichir','gar')?10:0);
  return hlt_hold(n,'HLT-38-D',{t:'{n}은 버텼습니다. 바닥에는 빈 달팽이 껍데기가 흩어져 있었습니다.',c:'bad',fx:{h:-12},set:{inj_gill:1}},isKind('staff')?1.5:1);
}
fev([{id:'HLT-38',tier:'fact',need:{hlt_medkit:1},cd:45,
  w:()=>(isKind('alchemist','eager','learner','staff')?1.6:.6)*(hlt_ill('velvet')||hlt_ill('ich')?2:1)*(isSp('@puffer','@scaleless','altum','neon')?1.4:1),
  log:'주인이 구리 성분 약을 넣었습니다. 측정 키트는 없었습니다.',
  p:'수조 벽에 붙어 있던 달팽이들이 하나둘 바닥으로 떨어집니다. 새우가 몸을 뒤집고 움직이지 않습니다. 물에서 쇠 맛이 납니다. {n}은…',
  o:[
   {l:'떨어진 달팽이를 쪼아 본다',chk:()=>isSp('@puffer')?['w',60]:null,
    ok:()=>isSp('@puffer')?{t:'{n}은 달팽이를 입에 넣었다가 뱉었습니다.',fx:{w:2},run:()=>{S.f.snails=0;q(null,null,()=>fevOut(hlt_38hold()))}}:{t:'달팽이는 껍데기만 남아 있었습니다.',run:()=>{S.f.snails=0;q(null,null,()=>fevOut(hlt_38hold()))}},
    no:()=>{S.f.snails=0;return hlt_38hold(10)}},
   {l:'수면 가까이 산소 많은 곳으로 올라간다',chk:['g',45],ok:()=>{S.f.snails=0;return hlt_38hold(-10)},no:()=>{S.f.snails=0;return hlt_38hold()}},
   {l:'은신처에서 가만히 있는다',ok:()=>{S.f.snails=0;return hlt_38hold()}}
  ]}]);

/* EV-HLT-39 보라색 물 — 과망간산칼륨 과량
   [출처: 과망간산칼륨 어류 치료 농도와 과량 시 아가미 손상(어병 치료 매뉴얼)] */
function hlt_39hold(mod){return hlt_hold(60,'HLT-39-D',{t:'{n}은 갈색 물 속에서 하루를 넘겼습니다.',c:'bad',fx:{h:-12},set:{inj_gill:1}},(mod||1)*(isSp('@airbreather')&&!isSp('cory')?1.3:1)*(isSp('@small','@scaleless')?.75:1)*(isSp('koi')?1.2:1))}
fev([{id:'HLT-39',tier:'fact',cd:60,w:()=>isKind('alchemist','eager','grandma','breeder')?1.5:.25,
  log:'주인이 "옛날엔 이걸로 다 소독했다"며 과망간산칼륨을 풀었습니다.',
  p:'물이 진한 보라색으로 변했습니다. 몇 시간 뒤 보라색이 갈색으로 바뀝니다. 아가미 안이 화끈거리고 몸 표면이 뻣뻣해집니다. {n}은…',
  o:[
   {l:'물 색이 옅은 쪽을 찾아 올라간다',ok:{t:'물은 곧 다 같은 색이 되었습니다.',run:hlt_then(()=>hlt_39hold())}},
   {l:'주인 앞에서 아가미를 크게 열어 보인다',chk:['c',60],
    ok:()=>hlt_by({'grandma breeder expert staff learner':{t:'"색이 너무 진하네." 주인이 물을 절반 갈았습니다.',c:'good',fx:{h:-4}},
      'alchemist':{t:'주인은 약이 잘 들고 있다고 생각했습니다. 색이 갈색으로 바뀌자 한 번 더 넣었습니다.',c:'bad',run:hlt_then(()=>hlt_39hold(.7))},
      '*':()=>R()<.5?{t:'주인이 물을 조금 갈았습니다.',c:'good',fx:{h:-6}}:hlt_39hold()}),
    no:()=>hlt_39hold()},
   {l:'바닥에서 가만히 있는다',ok:()=>hlt_39hold()}
  ]}]);

/* EV-HLT-40 눈과 아가미를 덮는 혹 — 오란다 육혹
   [출처: 오란다 육혹(wen) 과성장과 수의 외과 절제 사례] */
function hlt_40hold(){return hlt_hold(50,'HLT-40-D',{t:'{n}은 혹 아래로 먹이 냄새를 따라다녔습니다. 몸이 조금 말랐습니다.',c:'bad',fx:{h:-8,fat:-.1},set:{hlt_wen:1}})}
fev([{id:'HLT-40',tier:'fact',sp:['oranda'],need:{hlt_mid:1,hlt_wencut:0},cd:60,
  w:()=>isKind('breeder','mill','content','grandma','expert')?2:1,
  p:'머리의 혹이 해마다 커졌습니다. 이제 눈 위로 내려와 한쪽이 잘 보이지 않습니다. 아가미 뚜껑을 열 때 혹이 걸립니다. {n}은…',
  o:[
   {l:'주인 손가락을 따라 헤엄친다',chk:['c',70],
    ok:()=>hlt_by({'expert learner staff grandma':()=>R()<.8?(R()<.35?{end:'HLT-40-H'}:{t:'수의사가 {n}을 마취하고 눈을 덮은 혹을 잘라 냈습니다. {n}은 다시 주인 손가락을 보았습니다.',c:'good',fx:{h:-8},set:{hlt_wencut:1}}):hlt_40hold(),
      'breeder content mill':{t:'"혹이 클수록 등급이 높아." 주인은 그대로 두었습니다.',c:'bad',run:hlt_then(hlt_40hold)},
      '*':()=>hlt_40hold()}),
    no:()=>hlt_40hold()},
   {l:'먹이 냄새를 따라 바닥을 더듬는다',chk:['w',30],ok:{t:'{n}은 보이지 않아도 먹이를 찾아냈습니다.',fx:{w:2}},no:()=>hlt_40hold()},
   {l:'수초 옆에서 가만히 있는다',ok:()=>hlt_40hold()}
  ]}]);

/* EV-HLT-41 젖혀지는 아가미 뚜껑 — 아로와나 아가미 말림
   [출처: 아로와나 아가미 말림(gill curl) 원인 가설(수질·산소·성장기)과 외과 교정 사례] */
function hlt_41hold(){return hlt_hold(50,'HLT-41-D',{t:'{n}의 아가미 뚜껑 가장자리가 조금 더 젖혀졌습니다.',c:'bad',fx:{h:-8},set:{hlt_gcurl:1,inj_gill:1}})}
fev([{id:'HLT-41',tier:'fact',sp:['arowana','oscar','channa'],cd:50,
  when:()=>fl('hlt_gcurl')||S.f.wq<75||tankL()<fx_().minL,
  w:()=>(isSp('arowana')?3:.3)*(isKind('decor','content','casual','techbro')?1.4:1),
  p:'아가미 뚜껑 가장자리가 바깥쪽으로 조금씩 젖혀집니다. 숨을 쉴 때 뚜껑이 완전히 닫히지 않습니다. 수면을 순찰하는 일이 피곤해집니다. {n}은…',
  o:[
   {l:'수면 가까이에서 주인이 오는 쪽을 바라본다',chk:['c',65],
    ok:()=>hlt_by({'expert staff learner':()=>R()<.7?{t:'주인이 수질부터 바로잡았습니다. 수의사가 젖혀진 가장자리를 다듬었습니다.',c:'good',fx:{h:-4},set:{hlt_gcurl:0}}:hlt_41hold(),
      'decor':()=>R()<.4?{end:'HLT-41-H'}:{t:'"용이 숨을 크게 쉰다." 주인은 좋은 징조라며 손님들에게 자랑했습니다.',c:'bad',run:hlt_then(hlt_41hold)},
      'techbro':{t:'주인은 질산염 센서를 하나 더 달았습니다. 물은 갈지 않았습니다.',c:'bad',run:hlt_then(hlt_41hold)},
      '*':()=>hlt_41hold()}),
    no:()=>hlt_41hold()},
   {l:'수류가 센 곳을 피해 천천히 순찰한다',chk:['w',50],ok:{t:'{n}은 숨을 아끼며 천천히 헤엄쳤습니다.',fx:{w:2}},no:()=>hlt_41hold()},
   {l:'수조 아래쪽에서 가만히 있는다',ok:()=>hlt_41hold()}
  ]}]);

/* EV-HLT-42 사람에게도 옮는 것 — 어류 결핵
   [출처: Mycobacterium marinum 등 어류 마이코박테리아증 병리와 사람 피부 감염(fish tank granuloma), 질병관리청/CDC 자료] */
function hlt_42hold(mod){return hlt_hold(55,'HLT-42-D',{t:'{n}은 휜 몸으로 몇 달을 더 살았습니다.',c:'bad',fx:{h:-10,fat:-.1},sick:'tb'},(mod||1)*(isSp('@small')?.7:isSp('@gold','koi','oscar')?1.3:1))}
function hlt_42owner(){
  return hlt_by({
   'expert staff':()=>R()<.6?{end:'HLT-24-R'}:{t:'주인은 수조를 비우고 소독하기로 했습니다. {n}만은 따로 옮겨 지켜보기로 했습니다.',c:'sub',sick:'tb'},
   'learner':{t:'주인이 항생제를 썼습니다. 한동안 나아 보였습니다.',c:'sub',sick:'tb',run:()=>hlt_treat('tb',1)},
   '*':()=>hlt_42hold()
  });
}
fev([{id:'HLT-42',tier:'fact',cd:60,when:()=>hlt_free('tb'),
  w:()=>(hlt_ill('tb')?3:.5)*(isKind('staff')?4:isKind('touch','breeder','mill','casual')?1.5:1)*(isSp('neon','guppy','platy','betta','@gold','apisto','cory')?1.3:1),
  p:'몇 달째 조금씩 마릅니다. 먹이는 먹는데 등이 휘어 갑니다. 피부 여기저기에 작은 상처가 낫지 않습니다. {n}은…',
  o:[
   {l:'주인이 손을 넣으면 그 손에 다가가 몸을 댄다',chk:['c',60],
    ok:{t:'주인이 {n}을 자주 손으로 쓰다듬었습니다. 몇 주 뒤 주인 손가락에 낫지 않는 혹이 생겼습니다. 피부과 의사가 물었습니다. "혹시 물고기 키우세요?"',c:'bad',sick:'tb',set:{hlt_ownerinf:1},run:()=>{S.f.hands=0;q(null,null,()=>fevOut(hlt_42owner()))}},
    no:()=>hlt_42hold()},
   {l:'무리에서 조금 떨어져 천천히 헤엄친다',chk:['g',55],ok:()=>hlt_42hold(1.4),no:()=>hlt_42hold()},
   {l:'수초 밑에서 가만히 있는다',ok:()=>hlt_42hold()}
  ]}]);

/* EV-HLT-43 야생에서 온 작은 복어 — 몸속 기생충
   [출처: 야생 채집 피퍼퍼 내부 기생충 보유와 구충 권장(복어 사육 문헌), 사용 구충제 종류] */
function hlt_43hold(mod){return hlt_hold(35,'HLT-43-D',{t:'{n}의 배는 조금 더 꺼졌습니다.',c:'bad',fx:{h:-8,fat:-.15},sick:'worms'},(mod||1)*(isSp('peapuffer')?.8:isSp('wildbetta')?1.3:1))}
fev([{id:'HLT-43',tier:'fact',sp:['peapuffer','fig8','clownloach','wildbetta','altum'],cd:45,when:()=>(S.f.wild||isSp('peapuffer'))&&hlt_free('worms')&&!fl('hlt_deworm'),
  w:()=>(hlt_ill('worms')?3:1)*(isSp('peapuffer')?2.5:1),
  p:'먹이를 잘 먹는데 배가 오목하게 꺼집니다. 배설물이 하얗고 가늘게 늘어집니다. 눈이 커 보입니다. {n}은…',
  o:[
   {l:'주인 눈을 따라 다니며 먹이를 조른다',chk:['w',60],
    ok:()=>R()<clamp(Math.pow(fst().c/60,2),.05,.95)
      ?{t:'주인이 "복어 배가 홀쭉"을 검색했습니다. "야생 개체는 들여오면 구충부터"라는 글을 읽고 구충제를 넣었습니다.',c:'good',fx:{h:-4},set:{hlt_deworm:1},run:()=>{hlt_cure('worms');if(isSp('peapuffer')&&!isKind('expert','staff')&&R()<.25)q(T('약이 {n}에게 조금 셌습니다. {n}은 하루 동안 바닥에 누워 있었습니다.'),'bad',()=>{S.health-=12})}}
      :{t:'주인은 먹이를 더 주었습니다.',run:hlt_then(()=>hlt_43hold())},
    no:()=>hlt_43hold()},
   {l:'달팽이를 깨 먹는 데 시간을 쓴다',when:()=>isSp('@puffer'),chk:['p',25],ok:()=>hlt_43hold(1.4),no:()=>hlt_43hold()},
   {l:'수초 사이에서 가만히 있는다',ok:()=>hlt_43hold()}
  ]}]);

/* EV-HLT-44 알텀의 첫 달 — 수입 직후 폐사
   [출처: 알텀 엔젤 수입 직후 대량 폐사("altum flu") 사육자 보고, 원인 추정(세균·원충·수질 급변)] */
function hlt_44hold(mod){return hlt_hold(isSp('altum')?25:45,'HLT-44-D',{t:'{n}은 첫 달을 넘겼습니다.',c:'good',fx:{h:-10,g:2},set:{hlt_settled:1}},mod)}
fev([{id:'HLT-44',tier:'fact',sp:['altum','wildbetta','apisto','clownloach'],once:1,
  w:()=>(isSp('altum')?4:.8)*((S.f.tankAge||0)<3?1:.15),
  p:'상자가 열리고 낯선 물에 들어옵니다. 물이 단단하고 무겁습니다. 높은 지느러미를 펴려 해도 자꾸 접힙니다. {n}은…',
  o:[
   {l:'주인 쪽으로 몸을 세우고 지느러미를 다 펴 보인다',chk:['c',80],
    ok:()=>hlt_by({'expert staff':()=>R()<.7?{t:'주인은 수입 직후의 알텀이 어떻게 무너지는지 알고 있었습니다. 연수를 만들고, 수온을 올리고, 예방 약욕을 했습니다.',c:'good',fx:{h:-5},set:{hlt_settled:1}}:hlt_44hold(),
      'content unbox':{t:'주인은 지느러미를 편 {n}을 찍으려고 조명을 켰습니다.',c:'bad',fx:{st:.2},run:hlt_then(()=>hlt_44hold(.7))},
      '*':()=>hlt_44hold()}),
    no:()=>hlt_44hold()},
   {l:'수초 사이에 몸을 세우고 움직이지 않는다',chk:['g',25],ok:{t:'{n}은 수초 사이에서 버텼습니다.',fx:{g:2},run:hlt_then(()=>hlt_44hold(1.3))},no:()=>hlt_44hold()},
   {l:'바닥 가까이 가라앉아 가만히 있는다',ok:()=>R()<.7?Object.assign({sick:pick(['columnaris','columnaris','ich'])},hlt_44hold(.8)):hlt_44hold()}
  ]}]);

/* EV-HLT-45 성공한 치료 — 격리 수조와 기록장
   [출처: 관상어 격리·치료 표준 절차(수족관 관리 교재)] */
function hlt_45catch(hurt){
  if(isSp('channa','bichir')&&!S.f.lid&&R()<.35)return hlt_hold(70,'HLT-45-D',{t:'{n}이 밤에 격리 수조 틈으로 빠져나왔다가, 아침에 책상 밑에서 발견되었습니다. 먼지를 뒤집어쓴 채 아가미를 움직이고 있었습니다.',c:'bad',fx:{h:-15},near:'lid'});
  if(isSp('arowana','gar','koi','motoro')&&!S.f.lid&&R()<.25)return {t:'좁은 격리 수조에서 {n}이 몸을 튕겼습니다.',c:'bad',run:()=>q(null,null,()=>fCr('jump'))};
  if(isKind('expert','learner')&&R()<.2)return {end:'HLT-45-H'};
  return {t:'격리 수조에서 정량의 약, 매일의 환수, 기록장. {n}은 나았습니다.'+(hurt?' 잡히는 동안 생긴 상처는 남았습니다.':''),c:'good',fx:hurt?{fin:.12,h:-4}:{h:5},set:{qt:1},run:()=>hlt_cure()};
}
fev([{id:'HLT-45',tier:'fact',own:['expert','learner','staff','breeder','grandma'],need:{hlt_sick:1},cd:40,
  w:()=>1+(fl('qt')+fl('hlt_scdose')+fl('hlt_cycle_ok')+fl('dechlor'))*.8,
  p:'주인이 작은 수조를 하나 더 꺼냅니다. 원래 수조의 물을 반쯤 옮겨 담고 히터와 스펀지 여과기를 넣습니다. 그물이 다가옵니다. {n}은…',
  o:[
   {l:'그물 쪽으로 스스로 헤엄쳐 들어간다',chk:['c',60],ok:()=>Object.assign({fx:{c:2}},hlt_45catch(0)),no:()=>hlt_45catch(0)},
   {l:'그물을 피해 수초 사이로 숨는다',chk:['w',50],
    ok:{t:'{n}을 잡으려고 주인이 수초를 다 뽑고 장식을 다 꺼냈습니다.',c:'bad',fx:{st:.15},run:hlt_then(()=>hlt_45catch(1))},
    no:()=>hlt_45catch(0)},
   {l:'바닥에서 가만히 있는다',ok:()=>hlt_45catch(isSp('cory','clownloach')&&!isKind('expert')?1:0)}
  ]}]);

/* =====================================================================
   Endings
   ===================================================================== */
fevEnd({
 'HLT-01-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',pl:[[2,'물잡이 없이 바로 넣음']],fact:'fCycle',
   l:['물속 암모니아가 아가미 새엽 상피를 녹입니다. 새엽 끝이 붉게 부어오르고, 옆 새엽과 서로 들러붙습니다.','{n}은 아가미 뚜껑을 크게 벌려 물을 더 많이 통과시키려 합니다. 들러붙은 새엽 사이로는 물이 지나가지 못합니다.','혈중 암모니아가 신경을 흥분시킵니다. {n}은 갑자기 수조를 가로질러 돌진하고 유리에 머리를 부딪힙니다.','다음 날 아침 {n}은 바닥에 옆으로 누워 있고, 아가미 뚜껑 가장자리가 붉게 물들어 있습니다.']},
 'HLT-02-D':{kind:'bad',cat:'아질산 중독',tier:'fact',fx:'f-float',pl:[[2,'물잡이 없이 바로 넣음']],fact:'fCycle',
   l:['아질산이 혈액 속 헤모글로빈을 메트헤모글로빈으로 바꿉니다. 피가 산소를 싣지 못하게 되고 색이 갈색으로 변합니다.','원래 붉어야 할 아가미 새엽이 초콜릿색이 됩니다.','{n}은 물을 계속 아가미로 밀어 넣지만 근육으로 가는 산소는 늘지 않습니다.','지느러미 끝부터 움직임이 느려지고, 몸이 물살에 밀려 여과기 쪽으로 기웁니다. 아가미 뚜껑이 열린 채로 멈춥니다.']},
 'HLT-03-D':{kind:'bad',cat:'물잡이 실패',tier:'fact',fx:'f-float',pl:[[2,'여과재를 수돗물로 헹굼']],fact:'fCycle',
   l:['물속 암모니아가 아가미 새엽 상피를 녹입니다. 새엽 끝이 붉게 부어오르고, 옆 새엽과 서로 들러붙습니다.','{n}은 아가미 뚜껑을 크게 벌려 물을 더 많이 통과시키려 합니다. 들러붙은 새엽 사이로는 물이 지나가지 못합니다.','다음 날 아침 {n}은 바닥에 옆으로 누워 있고, 아가미 뚜껑 가장자리가 붉게 물들어 있습니다.','여과기 스펀지는 아주 하얗게 빨려 있습니다.']},
 'HLT-04-D':{kind:'bad',cat:'방치',tier:'fact',fx:()=>isSp('motoro')?'f-curl':'f-bottom',pl:[[2,'물을 갈지 않음']],fact:()=>isSp('motoro')?'fMotoro':'fWater',
   l:()=>isSp('motoro')
    ?['질산염이 몇 달에 걸쳐 쌓입니다. {n}의 원반 가장자리가 바닥에서 들려 위로 말립니다.','배 쪽 피부에 붉은 반점이 생기고, 모래와 닿는 부분부터 점막이 벗겨집니다.','{n}은 먹이를 앞에 두고 원반 가장자리만 물결치듯 움직입니다. 체중이 줄면서 등 쪽 중앙에 척추 선이 드러납니다.','어느 아침 {n}은 모래 위에서 원반을 접은 채 움직이지 않습니다.']
    :['질산염이 몇 달에 걸쳐 쌓입니다. {n}의 지느러미가 몸 쪽으로 접히고 체색이 어두워집니다.','배 쪽 피부에 붉은 반점이 생기고, 바닥과 닿는 부분부터 점막이 벗겨집니다.','{n}은 먹이를 앞에 두고 지느러미만 천천히 움직입니다. 체중이 줄면서 등 쪽에 척추 선이 드러납니다.','어느 아침 {n}은 노란 물 속 바닥에서 움직이지 않습니다.']},
 'HLT-05-D':{kind:'bad',cat:'수질 쇼크',tier:'fact',fx:'f-float',pl:[[2,'물을 한 번에 다 바꿈']],fact:'fTemp',
   l:['새 물이 들어오며 pH가 몇 분 사이에 올라갑니다. 바닥에 쌓여 있던 암모늄이 암모니아로 바뀝니다.','아가미 새엽 상피가 점액을 한꺼번에 쏟아내고, 하얀 점액이 새엽 위에 막을 씌웁니다.','{n}은 수면과 바닥을 번갈아 오가며 아가미 뚜껑을 크게 엽니다. 피부 점막이 군데군데 벗겨져 물에 흰 실처럼 떠다닙니다.','주인이 수조를 다 닦고 돌아섰을 때, {n}은 여과기 출수구 아래에서 거꾸로 기울어 있습니다.']},
 'HLT-06-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-float',pl:[[2,'수돗물을 그대로 부음']],fact:'fChlor',
   l:['잔류 염소가 아가미 새엽 상피세포를 산화시킵니다. 상피가 부풀어 기저막에서 들뜹니다.','{n}은 커다란 몸으로 수조 끝에서 끝까지 헤엄치며 물을 아가미로 밀어 넣습니다. 몸이 클수록 필요한 산소가 많아 숨이 먼저 바닥납니다.','눈 표면의 각막이 하얗게 흐려집니다.','{n}은 수면 가까이에서 입을 벌린 채 천천히 옆으로 눕습니다.']},
 'HLT-07-D':{kind:'bad',cat:'맞지 않는 물',tier:'fact',fx:'f-bottom',pl:[[2,'종에 맞지 않는 물']],fact:()=>isSp('altum')?'fAltum':'fWater',
   l:()=>['경도가 맞지 않는 물에서 {n}의 아가미와 피부는 이온을 맞추느라 계속 일합니다.',isSp('altum')?'체색이 어두워지고, 높은 등지느러미가 몸 쪽으로 접힙니다.':'체색이 어두워지고, 지느러미가 몸 쪽으로 접힙니다.','점액이 탁해지고, 지느러미 막 가장자리가 하얗게 일어납니다. 그 자리에 세균이 붙어 지느러미 기조 사이 막이 녹아내립니다.','{n}은 수초 사이에서 몸을 세우려 지느러미를 펴지만 반쯤 녹은 막은 펴지지 않습니다.','사흘 뒤 {n}은 수초에 기댄 채 기울어 있습니다.']},
 'HLT-08-D':{kind:'bad',cat:'맞지 않는 물',tier:'fact',fx:'f-bottom',pl:[[2,'종에 맞지 않는 물']],fact:'fWater',
   l:()=>isSp('peapuffer')
    ?['소금이 풀린 물에서 몇 달을 지낸 {n}의 몸은 계속 물을 빼앗깁니다. 콩팥과 아가미가 쉬지 않고 일합니다.','피부색이 회색으로 바래고, 배의 흰 부분에 작은 출혈 반점이 생깁니다.','{n}은 유리 앞에 와서 주인의 얼굴 높이에서 멈춥니다.','다음 날부터 먹이를 받으러 오지 않고, 일주일 뒤 수면에 배를 위로 하고 떠오릅니다.']
    :['담수에서 몇 달을 지낸 {n}의 피부는 계속 물을 빨아들입니다. 콩팥이 물을 내보내느라 쉬지 않고 일합니다.','피부색이 회색으로 바래고, 배의 흰 부분에 작은 출혈 반점이 생깁니다. 면역이 떨어진 피부에 백점충이 붙어 온몸에 하얀 점이 돋습니다.','{n}은 유리 앞에 와서 주인의 얼굴 높이에서 멈춥니다.','다음 날부터 먹이를 받으러 오지 않고, 일주일 뒤 수면에 배를 위로 하고 떠오릅니다.']},
 'HLT-08-H':{kind:'happy',cat:'입문용 수조',tier:'story',fx:'f-rest',
   l:['주인은 소금 농도를 맞추려고 비중계를 샀고, 비중계를 맞추려고 해수어 카페에 가입했습니다.','1년 뒤 거실에는 산호 수조가 하나 더 생겼습니다.','{n}은 소금이 맞는 물에서 오래 살았습니다.','{n}의 수조는 그 옆에서 "입문용"이라고 불렸습니다.']},
 'HLT-09-D':{kind:'bad',cat:'수온',tier:'fact',fx:'f-bottom',pl:[[2,'금붕어와 열대어를 한 수조에']],fact:'fIch',
   l:['수온이 내려간 밤, {n}의 체온도 같이 내려갑니다. 면역세포가 느려진 사이 백점충이 피부 상피 아래로 파고듭니다.','하루 만에 지느러미와 몸통에 하얀 점이 돋습니다.','{n}은 바닥 돌에 몸을 문지릅니다. 문지른 자리마다 상피가 벗겨집니다.','옆에서 금붕어가 바닥을 뒤지다 {n}이 있던 자리에서 멈추고, 입을 몇 번 오물거립니다.']},
 'HLT-10-D':{kind:'bad',cat:'산소 부족',tier:'fact',fx:'f-pond',pl:[[2,'여름 연못에 산소 대비 없음']],fact:'fO2',
   l:['해가 지면 녹조는 광합성을 멈추고 산소를 쓰기 시작합니다. 새벽, 물속 산소가 가장 적어집니다.','{n}은 수면에 입을 대고 빠르게 뻐끔거립니다. 다른 물고기들이 같은 자리로 몰려와 서로의 머리를 밀어냅니다.','아가미 새엽의 모세혈관이 확장되고, 아가미 뚜껑이 뒤로 젖혀진 채 굳습니다.','해가 뜰 무렵 {n}은 연못 가장자리 수초에 걸려 배를 위로 하고 떠 있습니다.','아침 아홉 시에 녹조가 다시 산소를 만들기 시작합니다.']},
 'HLT-11-D':{kind:'bad',cat:'겨울 먹이',tier:'fact',fx:'f-ice',pl:[[2,'겨울 연못에 먹이를 줌']],fact:'fKoi',
   l:['찬 연못에서 {n}의 장은 거의 움직이지 않습니다. 사람들이 던진 사료가 장 안에서 소화되지 않은 채 머뭅니다.','장 안에서 세균이 번식하며 가스가 찹니다. 배가 부풀고, 항문 주변이 붉게 부어오릅니다.','{n}은 몸을 수평으로 유지하려 가슴지느러미를 계속 젓습니다.','장벽을 넘어간 세균이 복강에 퍼지고, 비늘 아래로 물이 차기 시작합니다.','봄이 오기 전 {n}은 얼음 아래에서 옆으로 누워 떠오르지도 가라앉지도 않습니다.']},
 'HLT-12-D':{kind:'bad',cat:'과식',tier:'likely',fx:'f-float',pl:[[2,'먹이 담당 없이 아무나 먹이를 줌']],fact:'fWater',
   l:()=>[isKind('shared')?'금요일 오후, 회식 전에 들른 사람들이 저마다 먹이를 한 꼬집씩 넣습니다.':'하루에도 몇 번씩, 지나가는 손마다 먹이를 한 꼬집씩 넣습니다.','바닥의 먹이가 썩으며 물이 뿌옇게 흐려집니다.',isSp('@gold','koi')?'{n}의 장은 위가 없이 이어진 관이라 먹이가 들어오는 대로 꽉 찹니다. 부푼 장이 부레를 눌러 {n}은 머리를 아래로 한 채 기울어집니다.':'{n}의 배가 부풀고, 흐린 물 속에서 몸이 자꾸 기울어집니다.','흐린 물의 암모니아가 아가미 새엽을 붓게 합니다. {n}은 꼬리를 저어 몸을 바로 세우려 하고, 그때마다 다시 뒤집힙니다.',isKind('shared')?'월요일 아침, 탕비실 어항 수면에 {n}과 먹이 찌꺼기가 같이 떠 있습니다.':'어느 아침, 수면에 {n}과 먹이 찌꺼기가 같이 떠 있습니다.']},
 'HLT-13-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',pl:[[2,'바닥 물고기 먹이를 챙기지 않음']],fact:()=>isSp('pleco')?'fOutgrow':'fWild',
   l:()=>[isSp('cory')?'{n}은 매일 모래를 수염으로 뒤집으며 먹이를 찾습니다. 위에서 내려오는 가루는 위층 물고기의 배설물과 섞여 있습니다.':'{n}은 매일 바닥을 뒤지며 먹이를 찾습니다. 위에서 내려오는 가루는 위층 물고기의 배설물과 섞여 있습니다.','몸에 저장된 지방이 먼저 줄고, 다음으로 근육이 줄어듭니다.',isSp('cory','pleco')?'배가 안쪽으로 꺼지고, 갑옷 판 사이로 등뼈 선이 드러납니다.':'배가 안쪽으로 꺼지고, 피부 아래로 등뼈 선이 드러납니다.',isSp('cory')?'{n}은 계속 모래를 뒤지고, 수염 끝이 닳아 짧아집니다.':'{n}은 계속 바닥을 뒤집니다.',isSp('cory')?'어느 날 {n}은 다른 코리들 사이에서 옆으로 누운 채 수염만 천천히 움직입니다.':'어느 날 {n}은 바닥에서 옆으로 누운 채 아가미만 천천히 움직입니다.']},
 'HLT-14-D':{kind:'bad',cat:'영양 결핍',tier:'fact',fx:'f-bottom',pl:[[2,'먹이 붕어만 먹임']],fact:'fLive',
   l:()=>['몇 달 동안 {n}은 먹이용 금붕어만 먹습니다. 간세포에 지방이 쌓여 간이 노랗게 부풀고, 복강을 채웁니다.','금붕어 내장 속 효소가 비타민 B1을 분해해 신경이 제대로 신호를 보내지 못합니다.','{n}은 수면 근처에서 균형을 잃고 몸을 한쪽으로 기울인 채 원을 그립니다.',isSp('arowana')?'경련이 오면 수조 벽에 턱을 부딪히고, 아래턱 수염이 휘어집니다.':'경련이 오면 수조 벽에 턱을 부딪힙니다.',isKind('content','unbox')?'촬영 조명 아래에서 {n}은 마지막 먹이를 쫓다 수면에서 비스듬히 멈춥니다.':'{n}은 마지막 먹이를 쫓다 수면에서 비스듬히 멈춥니다.']},
 'HLT-15-D':{kind:'bad',cat:'기생충',tier:'fact',fx:'f-bottom',pl:[[1,'기생충을 치료하지 않음']],fact:'fLive',
   l:['닻벌레 암컷이 {n}의 옆구리 비늘 사이로 머리를 박고 근육 속에 갈고리를 펼칩니다. 밖으로 나온 몸통 끝에 알주머니 두 개가 매달립니다.','박힌 자리 주변의 근육이 붉게 부어오르고 비늘이 들립니다.','{n}은 바닥 돌에 옆구리를 문질러 떼어 내려 합니다. 문지를 때마다 상처가 넓어지고 그 자리에 세균이 자리 잡습니다.','염증이 근육을 따라 퍼지며 옆구리에 구멍이 납니다. {n}은 구멍 난 쪽을 아래로 하고 바닥에 눕습니다.']},
 'HLT-16-D':{kind:'bad',cat:'굶주림',tier:'fact',fx:'f-thin',pl:[[2,'복어에게 단단한 먹이를 주지 않음']],fact:'fBeak',
   l:['위아래 이빨판이 계속 자라 입 앞으로 튀어나옵니다. 입이 끝까지 닫히지 않습니다.','{n}은 먹이 앞에서 입을 벌렸다 닫으며 먹이를 물려고 합니다. 먹이는 이빨판 끝에 부딪혀 튕겨 나갑니다.','지방이 빠지고 배가 오목하게 꺼지며, 피부 아래로 등뼈 마디가 보입니다.','{n}은 마지막까지 주인이 다가오면 유리 앞으로 나옵니다.']},
 'HLT-16-C':{kind:'bad',cat:'사고',tier:'likely',fx:'f-hand',pl:[[1,'집에서 부리를 자름']],fact:'fBeak',
   l:['주인이 {n}을 젖은 손수건으로 감싸 쥡니다. {n}은 몸을 부풀려 빠져나가려 하고, 공기가 위로 들어갑니다.','손톱깎이 날이 이빨판을 자르다 아래턱뼈 쪽으로 미끄러집니다. 턱뼈에 금이 가고 입 안쪽 점막이 찢어집니다.','물로 돌아온 {n}은 위에 들어간 공기 때문에 배를 위로 하고 수면에 떠오릅니다.','입이 비뚤어진 채 다시 다물리지 않습니다.']},
 'HLT-16-H':{kind:'happy',cat:'달팽이 카페의 고객님',tier:'story',fx:'f-rest',
   l:['주인은 {n}에게 달팽이를 먹이려고 달팽이 수조를 따로 차렸습니다.','달팽이 수조는 세 개로 늘었고, 주인은 이제 달팽이 번식 카페의 운영진입니다.','{n}의 사진은 카페 배너에 "고객님"으로 올라가 있습니다.','{n}의 수조에 들어간 달팽이 중 돌아 나온 것은 없습니다.']},
 'HLT-17-D':{kind:'bad',cat:'성장 정체',tier:'fact',fx:'f-bent',pl:[[2,'몸보다 작은 수조']],fact:()=>isSp('comet')?'fBowl':'fOutgrow',
   l:['몇 년 동안 {n}의 몸은 수조 크기에 맞춰 멈춥니다. 몸길이는 그대로인데 척추 마디가 한쪽으로 휩니다.','몸이 휘면서 부레가 눌려 수평을 잡기 어려워집니다.','고인 물의 암모니아가 아가미를 계속 자극해 새엽 끝이 두꺼워집니다.','{n}은 수조 벽을 따라 같은 방향으로 계속 돕니다.','어느 날 아침 {n}은 휜 몸 그대로 바닥에 누워 있고, 수조는 창가에서 햇빛을 받고 있습니다.']},
 'HLT-17-H':{kind:'happy',cat:'춤추는 잉어',tier:'story',fx:'f-pond',
   l:['원룸 수조에서 몸이 휜 채 자란 {n}을 본 이웃 할머니가 {n}을 마당 연못으로 데려갔습니다.','휜 몸으로 헤엄치는 {n}을 동네 사람들은 "춤추는 잉어"라고 불렀습니다.','{n}은 넓은 연못에서 오래 살았습니다.','휘어 버린 척추는 다시 펴지지 않았습니다.']},
 'HLT-18-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'백점병을 제때 치료하지 않음']],fact:'fIch',
   l:['백점충이 피부 상피 아래로 파고들어 자리를 잡습니다. 상피가 그 위를 덮어 작은 흰 혹이 됩니다.','혹마다 다 자란 충체가 피부를 뚫고 나오고, 그 자리에 구멍이 남습니다. 아가미 새엽 사이사이에도 충체가 박혀 새엽이 두꺼워지고 서로 붙습니다.','{n}은 수면 바로 아래에서 아가미 뚜껑을 크게 벌리며 같은 자리에 떠 있습니다. 피부 구멍으로 물이 스며들어 몸의 염분이 빠져나갑니다.','{n}은 수초 잎에 기댄 채 아가미만 움직이다가 멈춥니다.']},
 'HLT-19-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'벨벳병을 알아채지 못함']],fact:'fIch',
   l:()=>['와편모충이 {n}의 피부와 아가미 상피에 뿌리 같은 돌기를 박아 넣습니다. 그 아래 상피세포가 죽어 떨어지고, 피부가 빛을 받아 노랗게 반짝입니다.','지느러미 막이 몸 쪽으로 오그라들어 펴지지 않습니다. 아가미 새엽 표면이 기생충으로 덮여 두꺼워집니다.',isSp('@airbreather')?'{n}은 수면에 올라가 공기를 마시고, 다시 내려오고, 다시 올라갑니다. 공기를 마셔도 피부와 아가미의 상처는 계속 넓어집니다.':'{n}은 수면 바로 아래에서 아가미를 빠르게 움직입니다. 피부와 아가미의 상처는 계속 넓어집니다.',isSp('betta')?'사흘째 {n}은 수면 거품집 옆에서 지느러미를 붙인 채 떠 있습니다.':'사흘째 {n}은 수면 가까이에서 지느러미를 붙인 채 떠 있습니다.']},
 'HLT-20-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'세균 감염을 잘못 치료함']],fact:'fWater',
   l:['실 모양 세균이 등지느러미 아래 피부에 무리 지어 붙습니다. 세균이 내는 효소가 상피와 그 아래 진피를 녹여, 비늘이 빠진 자리에 하얀 띠가 생깁니다.','띠는 하루 사이에 옆구리로 내려와 몸통을 안장처럼 감쌉니다. 같은 세균이 아가미 새엽 끝을 갉아 새엽이 짧고 하얗게 변합니다.','{n}은 물살이 약한 구석에서 지느러미를 저어 자세를 유지합니다.','수온이 오른 밤, 하얀 띠가 근육까지 내려가고 {n}은 그 띠를 위로 한 채 기울어집니다.']},
 'HLT-21-D':{kind:'bad',cat:'오진',tier:'fact',fx:'f-bottom',pl:[[1,'세균병에 곰팡이약을 씀']],fact:'fMed',
   l:['입술 가장자리 피부가 세균에 녹아 하얀 솜 같은 조직으로 일어납니다.','주인은 곰팡이약을 넣고 사흘을 기다립니다. 그동안 세균은 입술 연골을 지나 아래턱뼈 표면까지 내려갑니다.','{n}은 먹이를 물려고 입을 벌리지만 위아래 턱이 맞물리지 않습니다. 녹은 입술 사이로 물이 새어 아가미로 가는 물흐름도 약해집니다.','{n}은 먹이가 떨어진 자리 위에서 입을 벌린 채 천천히 가라앉습니다.']},
 'HLT-22-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'지느러미 썩음병을 두고 봄']],fact:'fWater',
   l:['세균이 지느러미 막의 가장자리부터 녹이고 들어옵니다. 막이 녹은 자리에 지느러미 기조만 가시처럼 남았다가 그것도 끊어집니다.','녹는 선은 하루에 몇 밀리미터씩 몸 쪽으로 다가옵니다. 꼬리자루에 닿자 피부가 붉게 짓무르고 비늘이 빠집니다.','{n}은 남은 지느러미 밑동을 저어 헤엄치려 하고, 짓무른 꼬리자루가 수초에 쓸립니다.','세균이 혈관으로 들어가 몸 곳곳에 붉은 출혈점이 생기고, {n}은 꼬리가 없는 몸으로 수면 가까이에 머물다 가라앉습니다.']},
 'HLT-23-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'상처를 치료하지 않음']],fact:'fTemp',
   l:['상처 위에 내려앉은 물곰팡이 포자가 싹을 틔웁니다. 가는 균사가 상처 안쪽 진피와 근육 사이로 뻗어 들어갑니다.','바깥으로는 하얀 솜털이 자라 물결에 흔들립니다. 균사가 지나간 자리의 근육이 회색으로 변하고 물러집니다.','{n}은 솜털이 난 쪽을 돌에 문지르고, 문지를 때마다 솜과 함께 물러진 살점이 떨어져 나갑니다.','상처로 물이 계속 스며들어 몸의 염분이 빠집니다. {n}은 상처를 위로 하고 바닥에 눕고, 솜털은 그 위에서 계속 자랍니다.']},
 'HLT-24-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'아픈 물고기를 그대로 둠']],fact:'fWater',
   l:['콩팥이 물을 내보내지 못하게 됩니다. 몸에 남은 물이 복강과 비늘 주머니 아래에 고입니다.','배가 둥글게 부풀고, 비늘 하나하나가 아래에서 밀려 몸통에서 일어섭니다. 눈 뒤에도 물이 차 안구가 앞으로 밀려 나옵니다.','{n}은 부푼 배 때문에 꼬리 쪽이 가라앉아 머리를 위로 한 채 헤엄칩니다.','아가미 뚜껑이 점점 느려지고, {n}은 비늘이 일어선 채 바닥에 비스듬히 닿습니다.']},
 'HLT-24-T':{kind:'bad',cat:'학대',tier:'fact',fx:'f-toilet',pl:[[0,'산 채로 변기에 버림']],fact:'fFlush',
   l:['주인이 {n}을 그물로 떠서 변기에 넣습니다. {n}은 물에 닿자 꼬리를 젓습니다.','물이 내려가며 {n}은 좁은 배수관 안으로 휩쓸려 들어갑니다.','부푼 배가 관 벽에 쓸리고, 일어선 비늘이 꺾여 떨어집니다.','그 뒤로 {n}이 어디까지 살아 있었는지는 아무도 모릅니다.']},
 'HLT-24-R':{kind:'release',cat:'정향유',tier:'fact',fx:'f-euth',fact:'fEuth',
   l:['주인이 수조 물을 작은 그릇에 덜고 정향유를 몇 방울 풀어 흔듭니다. {n}이 그릇으로 옮겨집니다.','아가미 뚜껑이 천천히 느려지고, {n}은 그릇 바닥에 옆으로 눕습니다.','주인은 한참 뒤 정향유를 더 넣고, 아가미가 완전히 멈춘 것을 확인합니다.','그날 밤 주인은 원인을 노트에 적습니다.']},
 'HLT-25-D':{kind:'bad',cat:'부레병',tier:'fact',fx:'f-float',pl:[[1,'부레병을 그대로 둠']],fact:'fSwim',
   l:['장에 찬 가스와 사료가 부레를 눌러 {n}의 배가 위로 떠오릅니다. {n}은 꼬리를 저어 몸을 뒤집으려 하고, 멈추는 순간 다시 배가 수면 위로 나옵니다.','공기에 닿은 배 피부가 마르면서 비늘 사이 피부가 하얗게 갈라집니다. 갈라진 틈으로 세균이 들어가 배 피부가 붉게 짓무릅니다.','몇 주 동안 {n}은 뒤집힌 채로 먹이를 받아먹습니다.','어느 날 아침 {n}은 같은 자세로 떠 있고, 꼬리는 움직이지 않습니다.']},
 'HLT-25-H':{kind:'happy',cat:'두 마디 수조',tier:'story',fx:'f-rest',
   l:['주인은 뒤집혀서도 손가락을 따라오는 {n}을 위해, 수위를 손가락 두 마디 높이로 낮춘 전용 수조를 만들었습니다.','{n}은 바닥에 배를 대고 걸어 다니듯 헤엄치며 7년을 더 살았습니다.','주인은 끝내 밥알을 끊지 않았습니다. 양만 줄였습니다.']},
 'HLT-26-D':{kind:'bad',cat:'구멍병',tier:'fact',fx:'f-bottom',pl:[[2,'수질·먹이 관리 소홀']],fact:'fHole',
   l:['머리와 옆줄을 따라 피부가 움푹 패입니다. 패인 자리의 상피가 사라지고 그 아래 연조직이 드러납니다.','구멍들이 서로 이어지며 눈 위쪽부터 아가미 뚜껑까지 한 줄의 골이 됩니다. 드러난 조직에 세균이 붙어 골의 가장자리가 하얗게 짓무릅니다.','{n}은 여전히 주인 얼굴이 보이면 유리 앞으로 나와 지느러미를 흔듭니다. 먹이를 조르는 횟수가 줄고, 은신처 안에서 머리를 벽에 대고 있는 시간이 길어집니다.','어느 저녁 {n}은 주인이 다가와도 은신처에서 나오지 않습니다.']},
 'HLT-27-D':{kind:'bad',cat:'기생충',tier:'fact',fx:'f-thin',pl:[[1,'기생충을 치료하지 않음']],fact:'fWild',
   l:['선충이 {n}의 창자 벽에 입을 박고 피를 빨아먹습니다. 수가 늘어나면서 창자 벽이 얇아지고 곳곳에 출혈이 생깁니다.','다 자란 암컷의 꼬리 끝이 항문 밖으로 나와 물속에서 흔들립니다.','{n}은 먹이를 먹고 또 먹지만 등 근육이 빠져 머리만 크게 보입니다. 빈혈로 아가미 색이 연분홍으로 바랩니다.','{n}은 무리 맨 뒤에서 지느러미를 접은 채 따라가다가 수초 아래로 처집니다.']},
 'HLT-28-D':{kind:'bad',cat:'바이러스',tier:'fact',fx:'f-pond',pl:[[1,'새 잉어를 격리 없이 넣음']],fact:'fKHV',
   l:['바이러스가 아가미 새엽 상피세포 안에서 늘어납니다. 감염된 세포가 죽어 떨어지며 새엽에 하얗고 붉은 얼룩이 생깁니다.','얼룩진 새엽 사이에 점액과 죽은 조직이 엉겨 물이 지나가지 못합니다. {n}의 눈이 안와 안쪽으로 꺼지고, 피부 점막이 군데군데 벗겨져 거칠어집니다.','{n}은 폭포 아래로 가서 입을 벌리고, 다른 잉어들도 같은 자리로 모여 서로의 몸을 밉니다.','사흘 사이 연못의 잉어가 한 마리씩 떠오르고, {n}은 그 사이에 섞여 수면에서 천천히 돕니다.']},
 'HLT-28-K':{kind:'bad',cat:'살처분',tier:'likely',fx:'f-pond',pl:[[1,'새 잉어를 격리 없이 넣음']],fact:'fKHV',
   l:['주인이 수산 질병 신고를 했습니다. 며칠 뒤 방역복을 입은 사람들이 왔습니다.','연못의 물이 빠지고, 바닥에 남은 잉어들이 그물로 떠집니다. {n}은 그물 안에서 몸을 튕깁니다.','{n}은 아직 아가미가 붉었습니다. 같은 연못의 다른 잉어들과 함께 통에 담깁니다.','빈 연못 바닥에 소독약이 뿌려집니다.'],after:'주인은 다음 잉어를 들이기 전에 격리 수조부터 샀습니다.'},
 'HLT-29-D':{kind:'bad',cat:'바이러스',tier:'fact',fx:'f-bottom',pl:[[1,'새 금붕어를 격리 없이 넣음']],fact:'fCyHV',
   l:['바이러스가 비장과 콩팥의 조혈 조직을 망가뜨립니다. 새 혈구가 만들어지지 않아 아가미 새엽이 창백하게 바랩니다.','비장과 콩팥이 부어 복강 안에서 다른 장기를 밀어냅니다.','{n}은 바닥에 배를 대고 아가미 뚜껑만 빠르게 움직입니다. 피부 아래에 작은 출혈점이 번지고, 지느러미 밑동이 붉게 물듭니다.','같은 봉지로 온 금붕어들 옆에서 {n}도 옆으로 기웁니다.']},
 'HLT-29-H':{kind:'happy',cat:'처음부터 있던 한 마리',tier:'story',fx:'f-rest',
   l:['주인은 3주 동안 금붕어를 다섯 번 새로 샀습니다. 죽는 대로 같은 색을 채워 넣었습니다.','{n}만 처음부터 있었습니다.','주인은 "이 집 금붕어는 오래 산다"고 손님에게 말했습니다.','{n}과 함께 왔던 여덟 마리를 기억하는 사람은 없었습니다.']},
 'HLT-30-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bent',pl:[[1,'죽은 물고기를 바로 치우지 않음']],fact:'fNeon',
   l:()=>['미포자충의 포자가 장벽을 뚫고 등 근육 속으로 들어갑니다. 근육 섬유 안에서 포자 덩어리가 자라며 근육이 하얗고 불투명하게 변합니다.',isSp('neon')?'푸른 줄 아래의 근육부터 하얘져 줄의 색이 끊긴 것처럼 보입니다.':'등 근육이 군데군데 하얗게 굳어 갑니다.','굳은 근육 때문에 몸이 한쪽으로 휘고 헤엄이 비틀거립니다. {n}은 무리를 따라가려 꼬리를 젓지만 휜 몸은 옆으로만 밀려 나갑니다.','밤에 {n}은 무리에서 떨어져 수초 아래로 내려가고, 아침에는 다른 물고기들이 그 몸을 쪼고 있습니다.']},
 'HLT-31-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[1,'눈병을 그대로 둠']],fact:'fWater',
   l:['눈 뒤쪽 안와 조직에 세균과 체액이 고입니다. 안구가 안와에서 앞으로 밀려 나오고, 각막이 하얗게 흐려집니다.','각막 표면이 장식 모서리에 쓸려 벗겨지고 그 자리로 세균이 들어갑니다. 한쪽 각막이 터져 안구의 투명한 내용물이 물에 풀립니다.','{n}은 남은 눈으로 방향을 잡으려 몸을 비스듬히 돌립니다.','몸속 감염이 콩팥까지 번져 비늘이 들뜨기 시작하고, {n}은 바닥에 눈이 없는 쪽을 대고 눕습니다.']},
 'HLT-32-D':{kind:'bad',cat:'기생충',tier:'fact',fx:'f-bottom',pl:[[1,'흡충을 잘못 치료함']],fact:'fMed',
   l:['흡충이 아가미 새엽에 갈고리를 박고 상피를 갉아먹습니다. 상처 난 상피가 두꺼워지고 점액이 늘어 새엽 사이가 메워집니다.','{n}은 아가미 뚜껑을 한쪽만 크게 연 채 숨을 쉽니다. 몸을 뒤집어 바닥에 아가미를 긁고, 긁힌 새엽 끝에서 피가 납니다.','흡충은 새엽에서 새엽으로 옮겨 가며 수를 늘립니다.','{n}은 수면 바로 아래에서 아가미 뚜껑이 열린 채 멈춥니다.']},
 'HLT-32-F':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[1,'약을 두 배로 넣고 산소를 끊음']],fact:'fMed',
   l:['주인이 포르말린을 라벨의 두 배로 넣고, 소리가 시끄럽다며 에어 펌프를 끕니다. 포르말린이 물속 산소를 소모하기 시작합니다.','흡충은 죽어 떨어지지만 그 자리의 새엽 상피도 함께 상합니다.','{n}은 수면으로 올라가 입을 내밀지만 수면 근처의 산소도 줄어 있습니다. 아가미 뚜껑이 점점 크게 열렸다가 열린 채 굳습니다.','아침에 주인은 흡충이 다 사라졌는지 확인하려고 손전등을 비춥니다.']},
 'HLT-33-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-pond',pl:[[1,'상처를 치료하지 않음']],fact:'fKoi',
   l:['비늘이 빠진 자리에 세균이 자리를 잡고 피부를 녹입니다. 붉은 테두리를 두른 둥근 구멍이 하루에 조금씩 넓어집니다.','구멍 바닥에 하얀 근육이 드러나고, 그 근육도 가장자리부터 녹아 패입니다.','{n}은 다른 물고기들과 함께 햇볕 드는 얕은 곳으로 올라옵니다. 몸을 틀 때마다 구멍 가장자리가 벌어지고, 깊은 곳에 늑골 끝이 보입니다.','상처로 물이 계속 들어와 몸의 염분이 빠지고, {n}은 얕은 물가 돌 위에 옆구리를 대고 멈춥니다.']},
 'HLT-34-D':{kind:'bad',cat:'노화',tier:'fact',fx:'f-bottom',fact:'fNatural',
   l:['생식소에 생긴 종양이 몇 달에 걸쳐 커집니다. 종양이 복강을 채우며 창자와 부레를 한쪽으로 밀어냅니다.','배의 한쪽만 불룩해지고, 몸이 그쪽으로 기울어 헤엄칩니다. 창자가 눌려 먹이가 조금만 들어가도 배가 더 부풉니다.','{n}은 주인이 부르면 여전히 수면으로 올라오려 꼬리를 젓고, 기운 몸이 중간에서 멈춥니다.','어느 아침 {n}은 불룩한 쪽을 아래로 하고 바닥에 누워 있습니다.']},
 'HLT-34-H':{kind:'happy',cat:'열두 번의 봄',tier:'likely',fx:'f-pond',
   l:['할머니는 겨울마다 {n}의 몸에 생기는 하얀 촛농을 보고 "또 늙었네" 하며 걱정했습니다.','봄마다 그게 사라지면 "젊어졌다"며 동네에 자랑했습니다.','그렇게 열두 번의 겨울과 봄이 지났습니다.','바이러스는 {n}의 몸속에 그대로 있었습니다.']},
 'HLT-35-D':{kind:'bad',cat:'알막힘',tier:'fact',fx:'f-bottom',fact:'fWater',
   l:['나오지 못한 알이 난소 안에서 덩어리로 굳습니다. 굳은 알 덩어리가 썩으며 세균이 늘어나고, 난소 벽에 염증이 생깁니다.','염증이 복강으로 번져 복막이 붉게 붓습니다. {n}의 배가 한쪽으로 단단하게 부풀고 생식공 주변이 붉게 튀어나옵니다.','{n}은 수초에 배를 대고 문지르기를 반복합니다.','이틀 뒤 {n}은 수초 사이에 배를 걸친 채 아가미만 움직이다가 멈춥니다.']},
 'HLT-35-M':{kind:'bad',cat:'사고',tier:'likely',fx:'f-hand',pl:[[1,'손으로 알을 짜냄']],fact:'fWater',
   l:['주인이 {n}을 손바닥에 올리고 엄지로 배를 아래쪽으로 훑어 내립니다. {n}은 손바닥에서 몸을 튕기며 꼬리를 칩니다.','압력에 굳은 알 덩어리가 나오지 못하고 난소 벽이 찢어집니다.','생식공으로 알과 피가 섞여 나옵니다.','물로 돌아간 {n}은 배를 아래로 향하지 못하고 비스듬히 떠 있다가, 그대로 움직이지 않습니다.']},
 'HLT-36-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[1,'약을 여러 가지 한꺼번에 넣음']],fact:'fMed',
   l:['서로 다른 약 네 가지가 같은 물에 풀립니다. 약 성분이 여과 스펀지의 세균을 죽이고, 물속 암모니아가 다시 오르기 시작합니다.','{n}의 피부 점막이 약에 씻겨 얇아지고 상피가 군데군데 벗겨집니다. 벗겨진 상피 위로 암모니아가 닿아 아가미 새엽이 붉게 붓습니다.','{n}은 수면과 바닥을 천천히 오가다 여과기 출수구 앞에서 몸을 지탱하려 지느러미를 계속 젓습니다.','주인이 다섯 번째 병을 열 때, {n}은 출수구 물살에 밀려 수조 구석에 닿아 있습니다.']},
 'HLT-37-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[1,'비늘 없는 물고기에 소금']],fact:'fMed',
   l:['물속 염분이 피부 점막의 물을 빨아냅니다. 비늘 없이 점막과 상피로만 덮인 피부가 쭈글쭈글하게 오그라듭니다.','점액이 뭉쳐 하얀 막으로 벗겨지고, 그 아래 상피가 붉게 드러납니다. {n}은 바닥 모래에 몸을 비비고, 비빌 때마다 드러난 피부가 더 벗겨집니다.','아가미 새엽에서도 수분이 빠져 상피가 쭈그러듭니다.','{n}은 모래 위에서 옆으로 누운 채 아가미 뚜껑만 빠르게 움직이다 느려집니다.']},
 'HLT-38-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[1,'측정 없이 구리 약을 씀']],fact:'fMed',
   l:['물속 구리 이온이 아가미 새엽 상피세포에 쌓입니다. 상피가 부풀고 일부는 괴사해 떨어집니다.','새엽 끝에서 피가 배어 나오고, 점액이 엉겨 새엽 사이를 막습니다.','{n}은 수면 가까이 올라가 입과 아가미를 크게 엽니다. 바닥에는 껍데기만 남은 달팽이들이 흩어져 있습니다.','{n}은 수면에서 천천히 기울며 수조 앞쪽 유리에 몸이 닿습니다.']},
 'HLT-39-D':{kind:'bad',cat:'중독',tier:'fact',fx:'f-poison',pl:[[1,'소독약을 과하게 씀']],fact:'fMed',
   l:['과망간산칼륨이 아가미 새엽 표면의 상피와 점액을 산화시킵니다. 새엽이 갈색으로 물들고 상피가 굳어 벗겨집니다.','피부 점막도 갈색으로 변해 표면이 거칠어집니다.','{n}은 출수구 앞으로 올라가 물을 아가미로 통과시키려 입을 크게 엽니다. 굳은 새엽 사이로는 물이 잘 흐르지 않습니다.','{n}은 갈색 물 속에서 출수구 아래에 몸을 붙인 채 아가미 뚜껑을 몇 번 더 움직이고 멈춥니다.']},
 'HLT-40-D':{kind:'bad',cat:'육혹',tier:'fact',fx:'f-thin',pl:[[1,'눈을 덮은 혹을 그대로 둠']],fact:'fOranda',
   l:['혹 조직이 두 눈 위로 덮여 내려와 각막 앞을 가립니다. 아가미 뚜껑 가장자리까지 혹이 자라 뚜껑이 끝까지 열리지 않습니다.','{n}은 먹이 냄새를 따라 바닥을 더듬고, 다른 물고기가 먼저 먹이를 가져갑니다.','혹 주름 사이에 고인 찌꺼기에서 세균이 자라 주름 안쪽이 하얗게 짓무릅니다. {n}은 열리지 않는 아가미 뚜껑을 계속 움직이며 수면 쪽으로 머리를 듭니다.','체중이 줄어 몸통은 가늘어지고 머리만 커 보이는 채로 {n}은 수초 옆에 기댑니다.']},
 'HLT-40-H':{kind:'happy',cat:'생일 케이크',tier:'story',fx:'f-rest',
   l:['수의사가 {n}에게서 잘라 낸 혹의 무게를 재 주었습니다.','주인은 그 숫자를 {n}의 생일 케이크 초 개수로 썼습니다.','혹은 이듬해 다시 자랐고, 초는 해마다 늘었습니다.']},
 'HLT-41-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bottom',pl:[[2,'수질·산소 관리 소홀']],fact:'fWater',
   l:['아가미 뚜껑 가장자리 연골과 막이 바깥으로 말립니다. 덮여 있어야 할 아가미 새엽이 밖으로 드러납니다.','드러난 새엽 끝이 물살과 수조 벽에 쓸려 상합니다. 상한 새엽에 세균이 붙어 끝부터 하얗게 짓무릅니다.','{n}은 말린 뚜껑으로 물을 밀어내려 더 자주 아가미를 움직이고, 순찰 속도가 느려집니다.','{n}은 수면 바로 아래에서 꼬리를 늘어뜨린 채 머리를 수면 쪽으로 든 자세로 멈춥니다.']},
 'HLT-41-H':{kind:'happy',cat:'헐값의 용',tier:'story',fx:'f-home',
   l:['주인은 아가미가 말린 {n}을 "기운이 나간 용"이라며 헐값에 팔았습니다.','새 주인은 수질부터 바로잡았고, 반년 뒤 말렸던 뚜껑 자리는 거의 보이지 않았습니다.','옛 주인은 새 용을 샀습니다.','그 용의 뚜껑이 다시 말리기 시작했습니다.']},
 'HLT-42-D':{kind:'bad',cat:'질병',tier:'fact',fx:'f-bent',pl:[[1,'병든 물고기를 데려와 합사']],fact:'fTB',
   l:['마이코박테리아가 {n}의 비장, 콩팥, 간에 자리 잡습니다. 각 장기 안에 작은 회백색 결절이 여러 개 생기고, 결절이 정상 조직을 밀어냅니다.','근육이 빠지며 척추가 위아래로 휩니다. 피부의 작은 상처는 아물지 않고 얕은 궤양으로 남습니다.','{n}은 무리 뒤에서 휜 몸으로 따라가려 꼬리를 젓습니다.','몇 달에 걸쳐 그렇게 마르다가, {n}은 수초 밑에서 휜 몸 그대로 멈춥니다.']},
 'HLT-43-D':{kind:'bad',cat:'기생충',tier:'fact',fx:'f-thin',pl:[[1,'구충하지 않음']],fact:'fWild',
   l:()=>['창자 안의 기생충이 {n}이 먹은 영양분을 먼저 가져갑니다. 창자 벽이 두꺼워지고 염증으로 붉게 붓습니다.','배설물에 점액과 기생충 마디가 섞여 하얗게 늘어집니다.','{n}은 계속 먹이를 받아먹지만 배는 점점 오목해지고 머리와 눈만 커 보입니다.'+(isSp('@puffer')?' 부풀리기를 하려 해도 몸이 둥글게 차오르지 않습니다.':''),'{n}은 주인이 다가오면 유리 앞까지 나오다가, 어느 날부터 수초 사이에 머물고 그 자리에서 멈춥니다.']},
 'HLT-44-D':{kind:'bad',cat:'수입 직후 폐사',tier:'likely',fx:'f-bottom',pl:[[2,'수입 직후 물을 맞추지 않음']],fact:()=>isSp('altum')?'fAltum':'fWild',
   l:()=>['수입 상자에서 나온 {n}의 아가미와 피부는 이미 긁힌 자리투성이입니다.','바뀐 물에서 점액이 탁해지고, 긁힌 자리마다 세균이 자라 하얀 반점이 생깁니다. 아가미 새엽 끝이 하얗게 짓물러 숨이 빨라집니다.',isSp('altum')?'{n}은 수초 사이에서 몸을 세우려 지느러미를 펴고, 펴는 순간 등지느러미 막이 기조 사이로 갈라집니다.':'{n}은 지느러미를 펴려 하고, 펴는 순간 지느러미 막이 기조 사이로 갈라집니다.','이틀 사이 같은 상자에서 온 물고기들이 차례로 수초 아래로 기울고, {n}도 그 옆에서 기울어 멈춥니다.']},
 'HLT-45-D':{kind:'bad',cat:'탈출',tier:'likely',fx:'f-escape',pl:[[3,'격리 수조 틈을 막지 않음']],fact:()=>isSp('channa')?'fChanna':'fBichir',
   l:['격리 수조 뚜껑과 히터 전선 사이에 손가락 하나 들어갈 틈이 있습니다. {n}은 밤에 그 틈으로 머리를 밀어 넣고 몸을 빼냅니다.','바닥에 떨어진 {n}은 지느러미와 몸통으로 마루를 밀며 기어갑니다. 마루 위에서 상처 자리의 점막이 마르고 먼지가 들러붙습니다.','공기 호흡으로 몇 시간을 버티는 동안 피부가 말라 갈라집니다.','아침에 주인은 기록장에 "3일차: 상처 호전"이라고 적어 둔 페이지를 펼친 채, 책상 밑에서 {n}을 찾습니다.']},
 'HLT-45-H':{kind:'happy',cat:'기록장 두 권',tier:'story',fx:'f-rest',
   l:['{n}은 나았고, 그 뒤로도 오래 살았습니다.','주인의 기록장은 두 권이 되었습니다. 한 권은 {n}의 약 기록, 한 권은 주인 자신의 병원 기록입니다.','주인은 {n}의 약 시간은 한 번도 놓치지 않았습니다.','자기 약은 자주 잊었습니다.']}
});
