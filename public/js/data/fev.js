/* ---------- v0.10: the event layer (docs/FISH_REWORK.md) ----------
   1. species caps: how strong, tough, clever and charming each species can ever get (FCAP)
   2. owner kinds: 22 kinds of people on top of the 7 base owners the engine already knows (KIND)
   3. events as data (FEV): where and to whom they happen, choices written as what the fish senses,
      hidden checks (chance = (stat/need)², 5–95%), options a species cannot take shown greyed out,
      flags that link one event to the next, and endings of three kinds (bad, happy, 보내 줌)
   4. truth tiers: 📌 fact · 🔸 likely · 🎭 story, weighted by difficulty
   Event data lives in data/fev_*.js and calls fev([...]) and fevEnd({...}). */

/* ---------- 1. species caps ---------- */
/* p 힘 · g 근성 · w 지능 · c 매력, and how fast training raises each (1.3 fast, .7 slow) */
const FCAP={
 oranda:{p:25,g:55,w:30,c:90,k:{p:.7,w:.7,c:1.3}}, comet:{p:70,g:85,w:40,c:45,k:{p:1.3,g:1.3}},
 ryukin:{p:30,g:60,w:30,c:80,k:{p:.7,w:.7,c:1.3}}, betta:{p:55,g:60,w:55,c:85,k:{c:1.3}},
 wildbetta:{p:45,g:55,w:65,c:60,k:{w:1.3}}, guppy:{p:20,g:60,w:35,c:75,k:{p:.7}},
 neon:{p:15,g:30,w:40,c:70,k:{p:.7,g:.7}}, platy:{p:25,g:65,w:35,c:60,k:{g:1.3}},
 cory:{p:30,g:70,w:50,c:70,k:{g:1.3}}, altum:{p:30,g:25,w:45,c:90,k:{p:.7,g:.7,c:1.3}},
 oscar:{p:85,g:80,w:85,c:85,k:{p:1.3,w:1.3,c:1.3}}, pleco:{p:70,g:95,w:40,c:30,k:{g:1.3,c:.7}},
 arowana:{p:90,g:60,w:60,c:80,k:{p:1.3}}, koi:{p:75,g:90,w:60,c:90,k:{g:1.3,c:1.3}},
 channa:{p:70,g:85,w:70,c:50,k:{g:1.3}}, peapuffer:{p:15,g:35,w:75,c:85,k:{p:.7,w:1.3,c:1.3}},
 fig8:{p:35,g:55,w:75,c:85,k:{w:1.3,c:1.3}}, clownloach:{p:40,g:50,w:60,c:75},
 bichir:{p:65,g:90,w:50,c:50,k:{g:1.3}}, ghost:{p:30,g:40,w:70,c:60,k:{g:.7,w:1.3}},
 motoro:{p:60,g:45,w:50,c:70}, apisto:{p:30,g:40,w:60,c:80,k:{c:1.3}},
 gar:{p:100,g:95,w:50,c:40,k:{p:1.3,g:1.3}}
};
const capOf=k=>{const c=S&&S.sp&&FCAP[S.sp.id];return c?c[k]:100};
const growOf=k=>{const c=S&&S.sp&&FCAP[S.sp.id];return c&&c.k&&c.k[k]||1};
/* stats never pass the species cap; gains are scaled by how fast this species trains that stat */
(()=>{const _fst=fst;
  fst=function(){const s=_fst();if(!S.f.capped){S.f.capped=1;for(const k in s)s[k]=Math.min(s[k],capOf(k))}return s};
})();

/* ---------- species groups (BRIEF.md vocabulary) ---------- */
const SPG={
 gold:['oranda','comet','ryukin'],koi:['koi'],livebearer:['guppy','platy'],small:['neon','guppy','platy','peapuffer','apisto','cory'],
 labyrinth:['betta','wildbetta'],airbreather:['betta','wildbetta','channa','bichir','gar','pleco','cory'],
 bottom:['cory','pleco','clownloach','bichir','motoro'],scaleless:['motoro','ghost','clownloach','cory'],
 predator:['oscar','arowana','channa','gar','bichir','fig8'],big:['oscar','arowana','gar','koi','pleco','channa','motoro'],
 jumper:['arowana','channa','comet','betta','wildbetta'],escaper:['channa','bichir','ghost'],puffer:['peapuffer','fig8'],
 brackish:['fig8'],longfin:['oranda','ryukin','betta','guppy'],schooling:['neon','clownloach','cory'],
 coldok:['oranda','comet','ryukin','koi','gar'],
 tropical:['betta','wildbetta','guppy','neon','platy','cory','altum','oscar','pleco','arowana','channa','peapuffer','fig8','clownloach','bichir','ghost','motoro','apisto']
};
/* isSp('betta','@gold') — true when this fish is one of them */
const isSp=(...ks)=>ks.flat().some(k=>k&&(k[0]==='@'?(SPG[k.slice(1)]||[]).includes(S.sp.id):k===S.sp.id));
const spIn=(id,...ks)=>ks.flat().some(k=>k&&(k[0]==='@'?(SPG[k.slice(1)]||[]).includes(id):k===id));

/* ---------- 2. owner kinds ---------- */
/* base: which of the engine's seven owners this person behaves like (tank setup, boredom, learning).
   learn: chance to learn after a near miss (1 = always, 0 = never, -1 = learns the wrong lesson) */
const KIND={
 expert:{l:'물생활 고수',base:'expert',learn:.95},
 learner:{l:'공부하는 초보',base:'learner',learn:.7},
 eager:{l:'의욕 과다 초보',base:'learner',learn:.45,r:-.12},
 casual:{l:'대충 키우는 사람',base:'casual',learn:.15},
 gift:{l:'얼떨결에 키우게 된 집',base:'gift',learn:.3},
 breeder:{l:'번식이 취미인 사람',base:'breeder',learn:.5},
 content:{l:'영상·SNS 주인',base:'content',learn:.25},
 mill:{l:'번식장',base:'mill',learn:0},
 cult:{l:'무환수·무여과 신봉자',base:'casual',learn:0,r:.05},
 neglect:{l:'극단적 방치파',base:'casual',learn:0,r:-.1,bore:1.6},
 alchemist:{l:'약품 연금술사',base:'learner',learn:-1},
 techbro:{l:'스마트홈 덕후',base:'learner',learn:.9,r:.05},
 relay:{l:'당근 나눔 돌려막기',base:'casual',learn:.1,bore:1.8},
 release:{l:'방생 법회 신도',base:'gift',learn:0},
 shared:{l:'탕비실·교실 어항',base:'casual',learn:.05},
 decor:{l:'풍수·인테리어 어항',base:'casual',learn:.1},
 unbox:{l:'생물 언박싱 유튜버',base:'content',learn:.2},
 staff:{l:'수족관 직원',base:'expert',learn:.8,r:-.15},
 bait:{l:'낚시 미끼 가게',base:'casual',learn:0},
 touch:{l:'체험 카페 \'물고기 잡기\'',base:'gift',learn:.05},
 grandma:{l:'효도 선물 어항',base:'learner',learn:.5,r:-.1,bore:.4},
 breakup:{l:'이별한 커플',base:'casual',learn:.2}
};
/* which kinds a base owner can turn out to be, with weights; some only fit some fish or some shops */
const KIND_W={
 expert:[['expert',8],['staff',1.5],['techbro',1]],
 learner:[['learner',6],['eager',3],['alchemist',1],['techbro',1],['grandma',1]],
 casual:[['casual',6],['neglect',1.3],['relay',1.3],['shared',1],['decor',()=>isSp('@gold','arowana','koi','oscar')?1.6:.3],['breakup',.8],['cult',.8],['bait',()=>isSp('comet','guppy')?1:0]],
 gift:[['gift',6],['release',()=>isSp('@gold','koi')?1:.4],['touch',()=>isSp('@gold','koi')?.8:0],['grandma',.8]],
 breeder:[['breeder',1]],mill:[['mill',1]],
 content:[['content',5],['unbox',()=>S.f.shop==='online'?3:.8]]
};
const kindOf=()=>S.f&&(S.f.kind||S.f.own);
const isKind=(...ks)=>ks.flat().includes(kindOf());
function pickKind(own){
  const list=(KIND_W[own]||[[own,1]]).map(([k,w])=>[k,typeof w==='function'?w():w]).filter(z=>z[1]>0);
  return wpick(list.length?list:[[own,1]]);
}
/* every kind also answers to FOWN, in case an event hands a kind id where a base owner is expected */
for(const k in KIND)if(!FOWN[k])FOWN[k]={l:KIND[k].l,skill:FOWN[KIND[k].base].skill};
(()=>{const _setup=setupOwner;
  setupOwner=function(own){
    let force=null;if(KIND[own]&&KIND[own].base!==own){force=own;own=KIND[own].base}
    _setup(own);const f=S.f,k=force||pickKind(own),K=KIND[k]||{};
    f.kind=k;if(K.r)S.r=clamp(S.r+K.r,.03,.97);
    if(k==='neglect'||k==='mill'||k==='cult'){f.lazy=0;f.grow=0}
    if(k==='cult'){f.filter='없음'}
    f.fl=f.fl||{};
  };
})();
/* the owner line shows the kind, not only the base */
(()=>{const _t=fishOwnerText;fishOwnerText=function(){const s=_t(),f=S.f;if(S.preOwner||!f||!f.kind||f.kind===f.own)return s;return s.replace(FOWN[f.own].l,KIND[f.kind].l)}})();

/* ---------- 3. flags ---------- */
/* fl('lid') reads the tank the engine already keeps; anything else lives in S.f.fl */
const FLAG={
 lid:()=>S.f.lid?1:0, heater:()=>S.f.heater?1:0, filter:()=>({'없음':'none','스펀지 여과기':'sponge','걸이식 여과기':'hob','외부 여과기':'canister','저면 여과기':'ug'})[S.f.filter]||'other',
 cycled:()=>S.f.cycled?1:0, tankL:()=>tankL(), small_tank:()=>tankL()<fx_().minL*.5?1:0, pond:()=>S.f.tank==='pond'?1:0,
 season:()=>season(), wq:()=>S.f.wq, nh3:()=>S.f.wq<25?3:S.f.wq<40?2:S.f.wq<55?1:0,
 hides:()=>S.f.hides?1:0, cat:()=>S.f.cat?1:0, kids:()=>S.o&&S.o.fam==='아이 있는 가족'?1:0, place:()=>S.f.place||'home',
 ill:()=>S.f.ill?S.f.ill.id:0, age:()=>S.ageM/S.sp.life, old:()=>S.ageM/S.sp.life>.72?1:0, fem:()=>fem()?1:0,
 mates:()=>S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id)?1:0, predator:()=>fPredMate()?1:0, bully:()=>fBully()?1:0,
 alone:()=>fSameCount()===0?1:0, owner:()=>kindOf(), base:()=>S.f.own, skill:()=>S.r, interest:()=>S.interest,
 health:()=>S.health, stress:()=>S.f.stress, fin:()=>S.f.fin, fat:()=>S.f.fat||0, len:()=>S.f.len,
 shop:()=>S.f.shop, wild:()=>S.f.wild?1:0, released:()=>S.f.released?1:0, handed_over:()=>S.owners-1
};
const fl=k=>{if(!S||!S.f)return 0;if(FLAG[k])return FLAG[k]();const v=S.f.fl&&S.f.fl[k];return v===undefined?0:v};
const setFl=(k,v)=>{const f=S.f;f.fl=f.fl||{};
  if(k==='lid'){f.lid=v?1:0;return}if(k==='heater'){f.heater=v?1:0;return}if(k==='hides'){f.hides=v?1:0;return}
  if(k==='cycled'){f.cycled=v?1:0;return}if(k==='ill'){if(v&&DZ[v])fSick(v);return}
  f.fl[k]=v};
const addFl=(k,v)=>setFl(k,(fl(k)||0)+(v===undefined?1:v));

/* ---------- 4. truth tiers and difficulty ---------- */
const TIERW={real:{fact:1.25,likely:1,story:.3,big:0},story:{fact:.85,likely:1,story:1.6,big:1}};
const tierW=e=>{const t=TIERW[S.mode]||TIERW.real;return e.big?t.big:(t[e.tier||'likely']||1)};
const TIER_MARK={fact:'📌',likely:'',story:'😂'};

/* balance knobs: how much easier the hidden checks are, and how much rarer a death is among weighted outcomes */
const FEV_CHK={pre:1.6,home:1.25,wild:1.2};
const FEV_DEATHW={pre:.35,home:.5,wild:.6};

/* ---------- 5. registry ---------- */
const FEV=[],FEVEND={};
function fev(list){list.forEach(e=>{e.stage=e.stage||'home';FEV.push(e)})}
function fevEnd(map){Object.assign(FEVEND,map)}

/* is this event possible right now? */
function fevOk(e,stage){
  if(e.stage!==stage&&!(Array.isArray(e.stage)&&e.stage.includes(stage)))return false;
  if(e.sp&&!isSp(e.sp))return false;
  if(e.notSp&&isSp(e.notSp))return false;
  if(e.own&&!S.preOwner&&!isKind(e.own))return false;
  if(e.own&&S.preOwner&&stage==='home')return false;
  if(e.once&&S.once['ev'+e.id])return false;
  if(S.cd['ev'+e.id]>S.tick)return false;
  if(tierW(e)<=0)return false;
  if(e.need)for(const k in e.need){const want=e.need[k],have=fl(k);if(Array.isArray(want)?!want.includes(have):typeof want==='function'?!want(have):have!==want)return false}
  try{if(e.when&&!e.when())return false}catch(err){return false}
  if(typeof pondOK==='function'&&!pondOK(e.p))return false;
  return true;
}
const valOf=(v,...a)=>typeof v==='function'?v(...a):v;

/* an option's hidden check: [stat, need] → chance, or 'locked' when the species can never reach it */
function fevChance(chk){
  chk=valOf(chk);if(!chk)return 1;
  const [k,need]=chk;if(need>capOf(k))return -1;
  const s=fst()[k],m=((MODES[S.mode]||{}).chk||1)*(S.preOwner?FEV_CHK.pre:S.wild?FEV_CHK.wild:FEV_CHK.home);
  return clamp(Math.pow(s/need,2)*m,.05,.95);
}
/* apply an outcome: text, numbers, flags, memory, owner learning, an ending */
function fevOut(o,e){
  if(!o)return;
  /* weighted outcomes: deaths among them are damped by stage (balance without saving anyone afterwards) */
  if(Array.isArray(o)){const dk=(S.preOwner?FEV_DEATHW.pre:S.wild?FEV_DEATHW.wild:FEV_DEATHW.home)*(S.mode==='story'?.55:1);
    o=wpick(o.map(z=>{const out=z[1],w=valOf(z[0]);const kills=out&&typeof out==='object'&&out.end&&(FEVEND[out.end]||{}).kind==='bad';return [out,w*(kills?dk:1)]}));}
  o=valOf(o,e);if(!o)return;
  const f=S.f;
  if(o.t)addLog(T(valOf(o.t)),o.c||'sub');
  const d=o.fx||{};
  if(d.h)S.health+=d.h;if(d.st)f.stress+=d.st;if(d.wq)f.wq+=d.wq;if(d.i)S.interest+=d.i;if(d.fin)f.fin+=d.fin;if(d.fat)f.fat=(f.fat||0)+d.fat;
  ['p','g','w','c'].forEach(k=>{if(d[k])fStat(k,d[k])});
  if(o.set)for(const k in o.set)setFl(k,valOf(o.set[k]));
  if(o.add)for(const k in o.add)addFl(k,o.add[k]);
  if(o.sick&&DZ[o.sick]&&!f.ill)fSick(o.sick);
  if(o.pl)o.pl.forEach(p=>breakP(p[0],p[1]));
  if(o.mem)remember(o.mem,o.mw||1.2);
  if(o.run)o.run();
  if(o.near)fevNear(o.near);
  S.health=clamp(S.health,0,S.hMax||100);f.wq=clamp(f.wq,0,100);f.stress=clamp(f.stress,0,1.2);S.interest=clamp(S.interest,.02,1);
  if(o.end)fevFinish(o.end);
  else if(S.health<=0&&!S.ending){render();fEnd(fCause())}
}

/* ---------- 6. owners who learn after a near miss ---------- */
/* what a lesson fixes; key → [does it need fixing?, the fix, the line] */
const FEV_FIX={
 lid:[()=>!S.f.lid&&S.f.tank!=='pond',()=>{S.f.lid=1},'주인은 그날 밤 수조에 맞는 뚜껑을 주문했습니다.'],
 heater_cover:[()=>S.f.heater&&!fl('heater_cover'),()=>setFl('heater_cover',1),'주인은 히터에 덮개를 씌웠습니다.'],
 heater:[()=>!S.f.heater&&isSp('@tropical'),()=>{S.f.heater=1},'주인은 히터와 수온계를 사 왔습니다.'],
 intake_guard:[()=>!fl('intake_guard'),()=>setFl('intake_guard',1),'주인은 여과기 흡입구에 스펀지를 씌웠습니다.'],
 dechlor:[()=>!fl('dechlor'),()=>{setFl('dechlor',1);if(S.f.learnt)S.f.learnt.tap=1},'주인은 물을 갈 때마다 염소 중화제를 넣기 시작했습니다.'],
 cycle:[()=>!S.f.cycled,()=>{S.f.cycled=1;S.f.wq+=15},'주인은 "물잡이"를 검색하고 박테리아제와 테스트 키트를 샀습니다.'],
 net:[()=>S.f.tank==='pond'&&!S.f.net,()=>{S.f.net=1},'주인은 연못 위에 그물을 쳤습니다.'],
 qt:[()=>!fl('qt'),()=>setFl('qt',1),'주인은 새 물고기를 들이기 전에 따로 두는 격리 수조를 마련했습니다.'],
 label:[()=>!fl('label'),()=>setFl('label',1),'주인은 약을 넣기 전에 라벨 뒷면을 끝까지 읽게 되었습니다.'],
 mates:[()=>!!fPredMate(),()=>{const p=fPredMate();if(p)p.n=0},'주인은 큰 물고기를 다른 수조로 옮겼습니다.'],
 hides:[()=>!S.f.hides,()=>{S.f.hides=1},'주인은 숨을 곳이 될 유목과 수초를 넣었습니다.']
};
const LAZY_NEAR=['주인은 "다음엔 조심해야지"라고 했습니다. 그뿐이었습니다.','주인은 그 일을 금방 잊었습니다.','주인은 해야 할 일을 알았습니다. 하지 않았습니다.'];
function fevNear(key){
  const f=S.f;if(S.preOwner||!f.own)return;
  const K=KIND[kindOf()]||{learn:.3},fx=FEV_FIX[key];
  if(!fx||!fx[0]())return;
  let p=K.learn;if(f.lazy)p*=.4;if(f.stubborn)p=0;
  if(p<0){addLog(T('주인은 이번 일로 약을 하나 더 사 두었습니다.'),'bad');addFl('meds');return}
  if(R()<p){fx[1]();addLog(T(fx[2]),'good');f.lessons=(f.lessons||0)+1;S.r=clamp(S.r+.02,0,.97)}
  else if(!skipping&&R()<.5)addLog(T(pick(LAZY_NEAR)),'bad');
}

/* ---------- 7. endings ---------- */
/* FEVEND[id] = {kind:'bad'|'happy'|'release', cat, l:[lines], fx (art), pl:[[promise, note]], fact, tier}
   a bad ending gets the owner's after-death line for the owner's kind */
const AFTER={
 expert:'그날 밤 주인은 수조를 비우고, 원인을 노트에 적었습니다.',
 learner:'주인은 커뮤니티에 사진을 올리고 "왜 죽었을까요"라고 물었습니다.',
 eager:'주인은 다음 날 같은 가게에 가서 "이번엔 잘 키워 보겠다"고 말했습니다.',
 casual:'다음 날 주인은 같은 가게에서 같은 물고기를 열 마리 더 샀습니다.',
 gift:'주인은 선물한 사람에게 아무 말도 하지 않았습니다.',
 breeder:'주인은 {n}을 장부에서 지우고, 같은 배에서 난 다른 개체의 가격을 올렸습니다.',
 content:'주인은 추모 영상을 올렸습니다. 조회수는 생전 영상보다 높았습니다.',
 mill:'{n}은 그날 나온 다른 사체들과 한 봉지에 담겼습니다.',
 cult:'주인은 "자연의 순리"라며 {n}을 수조 바닥에 그대로 두었습니다.',
 neglect:'주인은 {n}이 죽은 걸 일주일 뒤에 알았습니다.',
 alchemist:'주인은 다음 물고기를 위해 약을 한 병 더 샀습니다.',
 techbro:'주인은 로그 파일을 열어 버그를 고쳤습니다. 커밋 메시지는 "fix"였습니다.',
 relay:'주인은 빈 어항을 "어항 세트 무료 나눔"으로 올렸습니다.',
 release:'신도들은 공덕을 쌓았다며 합장했습니다.',
 shared:'누군가 어항 앞에 "먹이 주지 마세요"를 붙였습니다. 이미 늦었습니다.',
 decor:'주인은 같은 색 물고기를 사 와 숫자를 맞췄습니다. 아무도 눈치채지 못했습니다.',
 unbox:'주인은 그 장면을 잘라 내고 영상을 올렸습니다.',
 staff:'주인은 다음 날 출근해 판매 수조에서 같은 종을 한 마리 골랐습니다.',
 bait:'주인은 {n}을 미끼 통 옆 양동이에 비웠습니다.',
 touch:'다음 날 아침, 체험장 풀에는 새 물고기들이 채워졌습니다.',
 grandma:'할머니는 한동안 어항 앞 의자에 앉아 계셨습니다.',
 breakup:'두 사람 중 누구도 상대에게 그 일을 알리지 않았습니다.'
};
/* balance: a catalogue death is sometimes a near miss instead — the fish is marked, and the owner may learn.
   Pre-owner deaths are saved less (nobody is there to notice). An ending can set always:1 to skip this. */
const FEV_SAVE={real:{pre:.62,home:.85,wild:.55},story:{pre:.78,home:.93,wild:.7}};
const FEV_SAVED=['{n}은 거기서 끝나지 않았습니다. 한동안 바닥에 붙어 숨만 쉬다가, 다시 지느러미를 폈습니다.','{n}은 간신히 버텼습니다. 그 일은 몸 어딘가에 흔적으로 남았습니다.','며칠 동안 {n}은 거의 움직이지 않았습니다. 그리고 살아남았습니다.'];
function fevSaved(E){
  const where=S.preOwner?'pre':S.wild?'wild':'home',p=((FEV_SAVE[S.mode]||FEV_SAVE.real)[where])*(.75+fst().g/200);
  if(E.always||R()>p)return false;
  addLog(T(pick(FEV_SAVED)),'bad');
  S.health=clamp(Math.min(S.health,60)-20,8,100);if(S.f){S.f.stress=clamp(S.f.stress+.2,0,1.2);addFl('scar')}
  remember('죽을 뻔했다. 살아남았다.',1.3);
  if(!S.preOwner&&S.f&&S.f.own&&!S.wild){const keys=Object.keys(FEV_FIX).filter(k=>FEV_FIX[k][0]());if(keys.length)fevNear(pick(keys))}
  render();return true;
}
function fevFinish(ref){
  if(S.ending)return;
  const id=typeof ref==='string'?ref:ref.id, E=typeof ref==='string'?FEVEND[ref]:ref;
  if(!E){console.warn('fev: no ending',id);return}
  /* v0.11: no near-miss save — a catalogue death is a death */
  const f=S.f;f.endKey='ev:'+id;
  const lines=valOf(E.l).map(t=>T(valOf(t)));
  if(E.kind==='bad'&&!S.preOwner&&f.own){const a=E.after===false?null:valOf(E.after)||AFTER[kindOf()];if(a)lines.push(T(a))}
  const mark=TIER_MARK[E.tier||'likely'];
  const happy=E.kind==='happy';
  let fact=valOf(E.fact)||null;if(fact&&F[fact])fact=F[fact];
  render();
  endLife(lines,(E.kind==='release'?'보내 줌':E.cat||'사고')+(mark&&E.kind==='happy'?' '+mark:''),fact,S.preOwner?null:valOf(E.pl)||null,happy,E.fx||(happy?'f-rest':'f-bottom'),E.pred||null);
}
FEND.euth.cat='보내 줌';

/* ---------- 8. running an event ---------- */
function fevRun(e){
  S.seen['ev'+e.id]=(S.seen['ev'+e.id]||0)+1;if(e.once)S.once['ev'+e.id]=1;S.cd['ev'+e.id]=S.tick+(e.cd||40);
  if(e.log)addLog(T(valOf(e.log)),'sub');
  if(!e.o){fevOut(e.auto,e);render();return}
  const opts=e.o.filter(o=>!o.when||o.when()).map(o=>{
    const ch=fevChance(o.chk);
    if(ch<0)return {l:valOf(o.l),d:o.lockText||'{n}의 몸으로는 할 수 없다',dis:1,c:'neutral',r:''};
    const c=valOf(o.chk);
    return {l:valOf(o.l),d:o.d?valOf(o.d):'',c:'neutral',r:'',fx:()=>{
      const ok=c?R()<ch:true;
      fevOut(ok?o.ok:(o.no||o.ok),e);
      if(c&&ok&&o.grow!==false)fStat(c[0],2);
    }};
  });
  if(opts.filter(o=>!o.dis).length<1){fevOut(e.auto,e);render();return}
  askChoice({who:e.who||null,p:valOf(e.p),o:opts});render();
}
/* candidates for this stage, weighted: rarer the more often seen, by tier and difficulty */
const isHap=e=>/^HAP/.test(e.id);
function fevPool(stage,hap){
  return FEV.filter(e=>!!hap===isHap(e)&&fevOk(e,stage)).map(e=>[e,valOf(e.w||1)*tierW(e)/(1+1.5*(S.seen['ev'+e.id]||0))]).filter(z=>z[1]>0);
}
/* happy endings (HAP-*) have their own roll, like a natural death: whenever one fits, a small chance each tick */
const FEV_HAP_P={real:.3,story:.9};
function fevHappyTry(stage){
  if(!S||!S.f||S.ending||S.waiting||S.preOwner)return false;
  if(R()>(FEV_HAP_P[S.mode]||FEV_HAP_P.real))return false;
  const pool=fevPool(stage,true);if(!pool.length)return false;
  fevRun(wpick(pool));return true;
}
function fevTry(stage,p){
  if(!S||!S.f||S.ending||S.waiting)return false;
  if(R()>(p===undefined?1:p))return false;
  const pool=fevPool(stage);if(!pool.length)return false;
  fevRun(wpick(pool));return true;
}

/* ---------- 9. hooks into the existing life ---------- */
/* before any owner: the prologue's moments (net, sieve, box, shop) sometimes become a catalogue event */
const FEV_PRE={net:'origin',sieve:'origin',box:'trade',shop:'shop'};
const FEV_PRE_P={origin:.4,trade:.35,shop:.35};
(()=>{const _pSit=pSit;
  pSit=function(k){
    const st=FEV_PRE[k];
    if(st&&R()<FEV_PRE_P[st]){const pool=fevPool(st);if(pool.length){const e=wpick(pool);
      S.seen['ev'+e.id]=(S.seen['ev'+e.id]||0)+1;if(e.once)S.once['ev'+e.id]=1;
      if(!e.o)return {who:null,p:'…',o:[{l:'…',c:'neutral',r:'',fx:()=>fevOut(e.auto,e)}]};
      const o=e.o.filter(o=>!o.when||o.when()).map(o=>{const ch=fevChance(o.chk);
        if(ch<0)return {l:valOf(o.l),d:o.lockText||'{n}의 몸으로는 할 수 없다',dis:1,c:'neutral',r:''};
        const c=valOf(o.chk);
        return {l:valOf(o.l),d:o.d?valOf(o.d):'',c:'neutral',r:'',fx:()=>{const ok=c?R()<ch:true;fevOut(ok?o.ok:(o.no||o.ok),e);if(c&&ok)fStat(c[0],2)}}});
      if(o.some(x=>!x.dis))return {who:e.who||null,p:valOf(e.p),o};}}
    return _pSit(k);
  };
})();
/* in a Korean river after release: some months bring a catalogue event (data/fev_wild.js) */
const FEV_WILD_P=.22;
(()=>{const _w=wildTick;wildTick=function(){const r=_w();if(S&&S.f&&S.wild&&!S.done&&!S.ending&&!S.waiting&&!S.queue.length&&!fevHappyTry('wild')&&R()<FEV_WILD_P)fevTry('wild');return r}})();
/* at home: part of the choice moments and the everyday lines come from the catalogue (fish.js fishTick) */
const FEV_HOME_P=.4;

/* how each new kind of owner first appears */
const KINTRO={
 eager:()=>S.o.name+' 님은 가게에서 어항, 여과기, 약, 장식, 사료를 한 번에 다 산 사람이었습니다. 설명서는 집에 가서 읽을 생각이었습니다.',
 cult:()=>S.o.name+' 님은 "여과기는 자연을 거스르는 장치"라고 믿는 사람이었습니다.',
 neglect:()=>S.o.name+' 님은 "물고기는 손이 안 가서 좋다"는 말을 듣고 온 사람이었습니다.',
 alchemist:()=>S.o.name+' 님의 수조 옆 선반에는 약병이 여섯 개 놓여 있었습니다.',
 techbro:()=>S.o.name+' 님은 수조를 사기 전에 온도 센서와 스마트 플러그부터 주문한 사람이었습니다.',
 relay:()=>'{n}은 중고거래 앱의 "어항째 무료 나눔" 글로 '+S.o.name+' 님에게 갔습니다.',
 release:()=>S.o.name+' 님은 절의 방생 법회에 쓸 물고기를 한꺼번에 사 가는 신도였습니다.',
 shared:()=>'{n}은 '+(S.o.name)+' 님이 고른 회사 탕비실 수조로 갔습니다. 먹이 당번은 정해지지 않았습니다.',
 decor:()=>S.o.name+' 님은 "물고기를 키우면 돈이 들어온다"는 말을 믿는 가게 사장이었습니다.',
 unbox:()=>S.o.name+' 님은 생물 택배 개봉 영상을 올리는 유튜버였습니다.',
 staff:()=>S.o.name+' 님은 그 수족관의 직원이었습니다. 퇴근길에 {n}을 집으로 데려갔습니다.',
 bait:()=>S.o.name+' 님은 저수지 앞 낚시 가게 주인이었습니다. {n}은 "미끼용" 수조로 갔습니다.',
 touch:()=>S.o.name+' 님은 아이들 "물고기 잡기 체험" 카페를 하는 사람이었습니다.',
 grandma:()=>'{n}은 자식이 홀로 사는 어머니께 드린 효도 선물이었습니다. 받은 사람은 '+S.o.name+' 님이었습니다.',
 breakup:()=>S.o.name+' 님 커플은 "우리 물고기"라며 {n}을 함께 골랐습니다.'
};

/* species training: each one raises a stat and quietly raises a risk (FISH_REWORK §1) */
const sideK=k=>1+(S.f&&S.f.fl&&S.f.fl[k]||0)*.25;
TRAIN.push(
 {l:'수면 위 벌레를 노려 뛰어오른다',g:()=>isSp('arowana'),gain:{p:7},d:'힘 ↑↑',ok:['{n}은 수면 위 그림자를 보고 몸을 튕겨 올리는 법을 익혔습니다.',()=>addFl('jumpy')],fail:[['너무 높이 뛰었습니다.',()=>{addFl('jumpy');if(lidOpen()&&!S.waiting)q(null,null,()=>fCr('jump'));else{addLog(T('{n}이 뚜껑에 머리를 부딪치고 가라앉았습니다.'),'bad');S.health-=10}}]]},
 {l:'수면을 향해 돌진한다',g:()=>isSp('comet'),gain:{p:6,g:2},d:'힘 ↑ · 근성 ↑',ok:['{n}은 수조 끝에서 수면까지 단숨에 치고 올라갔습니다.',()=>addFl('jumpy')],fail:[['{n}이 유리벽에 주둥이를 부딪쳤습니다.',X({h:-6})]]},
 {l:'먹이를 조른다',g:()=>isSp('oscar'),gain:{c:8},d:'매력 ↑↑',ok:['{n}은 주인이 지나갈 때마다 유리 앞에서 입을 크게 벌렸습니다. 주인이 웃으며 먹이를 더 주었습니다.',()=>{addFl('begs');X({i:.06,fat:.15})()}],fail:[['조르는 {n}에게 주인이 냉동 새우를 한 봉지 다 쏟았습니다.',X({fat:.3,wq:-12})]]},
 {l:'돌을 입으로 옮긴다',g:()=>isSp('oscar'),gain:{p:6},d:'힘 ↑',ok:['{n}은 바닥 돌을 하나씩 물어 원하는 자리로 옮겼습니다.'],fail:[['{n}이 옮기던 돌이 히터 유리관에 부딪쳤습니다.',()=>{if(S.f.heater&&R()<.4){addLog(T('히터 유리관에 금이 갔습니다.'),'bad');setFl('heater_crack',1)}}]]},
 {l:'뚜껑의 틈을 찾는다',g:()=>isSp('channa','bichir'),gain:{w:7},d:'지능 ↑↑',ok:['{n}은 밤마다 뚜껑 가장자리를 주둥이로 밀어 보았습니다.',()=>addFl('escapey')],fail:[['{n}이 틈에 머리를 끼웠다 빠져나왔습니다. 주둥이가 쓸렸습니다.',X({h:-6})]]},
 {l:'아가미를 펴고 상대를 노려본다',g:()=>isSp('betta'),gain:{c:7,p:2},d:'매력 ↑↑',ok:['{n}의 지느러미가 부채처럼 펼쳐졌습니다. 주인이 사진을 찍었습니다.',()=>addFl('flare')],fail:[['너무 오래 지느러미를 폈습니다. 지느러미 끝이 물살에 갈라졌습니다.',X({fin:.12})]]},
 {l:'수면에서 공기를 마시는 연습을 한다',g:()=>isSp('@labyrinth'),gain:{g:7},d:'근성 ↑↑',ok:['{n}은 물이 나빠져도 수면 공기로 버티는 법을 익혔습니다.',()=>addFl('airtrust')],fail:[['수면까지 올라가다 힘이 빠졌습니다.',X({h:-5})]]},
 {l:'주인 손가락을 따라간다',g:()=>isSp('oranda','ryukin'),gain:{c:8},d:'매력 ↑↑',ok:['{n}은 수면을 톡톡 치는 손가락을 따라 이리저리 헤엄쳤습니다.',()=>{addFl('hands');X({i:.05})()}],fail:[['주인이 손을 물에 넣어 {n}을 쓰다듬었습니다. 손이 지나간 자리의 점막이 벗겨졌습니다.',X({h:-5,st:.05})]]},
 {l:'손바닥 위 먹이를 받아먹는다',g:()=>isSp('koi'),gain:{c:8},d:'매력 ↑↑',ok:['{n}은 주인 손바닥에 입을 대고 먹이를 받아먹었습니다.',()=>{addFl('tame');X({i:.06})()}],fail:[['처음 보는 사람의 손에 놀라 {n}이 몸을 틀다 돌에 긁혔습니다.',X({h:-4})]]},
 {l:'주인과 눈을 맞춘다',g:()=>isSp('@puffer'),gain:{c:8,w:2},d:'매력 ↑↑',ok:['{n}은 주인이 다가오면 유리 앞에서 멈춰 눈을 굴렸습니다.',()=>addFl('nippy')],fail:[['유리 앞에서 기다리다 지나가는 합사어의 지느러미를 물었습니다.',()=>addFl('nippy')]]},
 {l:'옆으로 누워 쉬는 법을 익힌다',g:()=>isSp('clownloach'),gain:{w:7},d:'지능 ↑↑',ok:['{n}은 바닥에 옆으로 누워 꼼짝 않고 쉬었습니다. 다른 로치들도 그랬습니다.',()=>addFl('playdead')],fail:[['너무 오래 누워 있었습니다. 주인이 뜰채를 들고 다가왔다가 {n}이 움직이자 놀라 물러났습니다.',()=>addFl('playdead')]]},
 {l:'유목을 갉는다',g:()=>isSp('pleco'),gain:{g:7},d:'근성 ↑↑',ok:['{n}은 유목에 붙어 하루 종일 갉았습니다.',X({wq:-4})],fail:[['유목이 없어 유리만 핥았습니다. 배가 홀쭉해졌습니다.',X({h:-5})]]},
 {l:'바닥을 기어 다닌다',g:()=>isSp('bichir'),gain:{p:6},d:'힘 ↑',ok:['{n}은 가슴지느러미로 바닥을 짚고 기어 다녔습니다.',()=>addFl('escapey')],fail:[['여과기 호스 틈에 몸이 끼었다 빠져나왔습니다.',X({h:-5})]]},
 {l:'매복했다가 튀어 나간다',g:()=>isSp('gar'),gain:{p:8},d:'힘 ↑↑',ok:['{n}은 수면 바로 밑에 통나무처럼 떠 있다가 순식간에 튀어 나갔습니다.',()=>addFl('growfast')],fail:[['튀어 나가다 유리벽을 들이받았습니다.',X({h:-7})]]},
 {l:'모래 속에 몸을 묻는다',g:()=>isSp('motoro'),gain:{g:6},d:'근성 ↑',ok:['{n}은 모래를 덮고 눈만 내놓았습니다.',()=>addFl('buried')],fail:[['모래가 거칠었습니다. 배 쪽 피부가 쓸렸습니다.',X({h:-6})]]}
);
