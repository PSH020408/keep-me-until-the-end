/* ---------- v0.11: the old text pools, made to fit the species and the observer voice ----------
   Loaded after fish.js, fishchoice.js, fishgrow.js, fishplus.js, engine.js and fev.js. Changes text and when/need guards only.
   1. Lines that are only true for some species get a guard (or a per-species text):
      fighting and winning → a territorial species (FBEH terr ≥ .3); "wins" only with a 힘 cap ≥ 50
      biting a finger, a paw or a pencil → predators, cichlids and puffers
      flaring at its own reflection → betta, wild betta, apistogramma, oscar
      jumping out → species that jump (FX jump ≥ .1); bubble nests → betta only (the wild betta and apisto do not build them)
   2. Every prompt the fish answers is written from outside: what the fish senses, ending "{n}은…". No "나".
   3. No quoted thought of the fish in the log. Owner and people dialogue stays. */

/* ---------- species tests ---------- */
const ofx_terr=()=>fbOf(S.sp.id).terr>=.3;                      // holds a territory and chases intruders off
const ofx_fighter=()=>ofx_terr()&&capOf('p')>=50;               // and is strong enough to win
const ofx_biter=()=>isSp('@predator','@puffer','altum','oscar','apisto');
const ofx_mirror=()=>isSp('betta','wildbetta','apisto','oscar');
const ofx_jumper=()=>(fx_().jump||0)>=.1;
const ofx_shover=()=>!isSp('neon','guppy','platy','cory','altum','ghost','motoro');   // jostles others away from food
const ofx_surface=()=>!isSp('motoro','pleco','cory','bichir');                        // comes up to the surface or a finger for food
const ofx_big=n=>(fx_().cm||0)>=n;
const ofx_hostile=()=>ofx_terr()||fbOf(S.sp.id).hostile>=.3;

/* ---------- helpers ---------- */
const ofx_val=(o,k)=>{const d=o&&Object.getOwnPropertyDescriptor(o,k);return d&&'value' in d?d.value:undefined};
/* add a condition to an existing when/need */
const ofx_and=(o,key,fn)=>{if(!o)return;const w=o[key];o[key]=w?(...a)=>fn()&&(typeof w==='function'?w(...a):w):fn};
/* a text that depends on the species, read when it is shown */
const ofx_text=(o,key,fn)=>{if(o)Object.defineProperty(o,key,{get:fn,enumerable:true,configurable:true})};
const ofx_opt=(c,l)=>c&&c.o.find(o=>ofx_val(o,'l')===l);
const ofx_sit=id=>FSIT.find(c=>c.id===id);
const ofx_ch=id=>FCH.find(c=>c.id===id);
/* an object whose text was frozen by an older getter is replaced by a copy with the new getter */
function ofx_swap(arr,i,key,fn){
  const e=arr[i],n={};
  Object.keys(e).forEach(k=>{if(k!==key)Object.defineProperty(n,k,Object.getOwnPropertyDescriptor(e,k))});
  Object.defineProperty(n,key,{get:fn,enumerable:true,configurable:true});arr[i]=n;return n;
}

/* ---------- 2. prompts: observer view ---------- */
const OFX_FCH_P={
 feed:'위에서 알갱이가 떨어집니다. 다른 물고기들이 몰려듭니다. {n}은…',
 strange:'처음 보는 마른 알갱이가 떨어집니다. 고향 물에서는 맡아 본 적 없는 냄새입니다. {n}은…',
 bully:'덩치 큰 물고기가 자꾸 뒤를 쫓아옵니다. 지느러미 끝에 물린 자국이 있습니다. {n}은…',
 lid:'수면 위 틈으로 불빛이 보입니다. 물 밖은 밝고 넓습니다. {n}은…',
 net:'뜰채가 물속으로 들어옵니다. {n}은…',
 sickhide:'몸놀림이 무겁고 아가미가 빠르게 움직입니다. {n}은…',
 intake:'여과기 흡입구 쪽 물살이 셉니다. 몸이 그쪽으로 끌려갑니다. {n}은…',
 glass:'유리벽이 쿵쿵 울립니다. 커다란 얼굴이 유리에 붙어 있습니다. {n}은…',
 face:'먹이 시간마다 오는 얼굴이 유리 앞에 다가옵니다. {n}은…',
 air:'아가미가 빠르게 움직이는데도 숨이 모자랍니다. 수면 위에는 공기가 있습니다. {n}은…',
 newfish:'봉지에 담겨 온 낯선 물고기가 들어왔습니다. 물에서 낯선 냄새가 납니다. {n}은…',
 mirror:'유리벽에 똑같이 생긴 물고기가 비칩니다. 그 물고기도 지느러미를 펼칩니다. {n}은…',
 current:'물살이 셉니다. 지느러미가 자꾸 뒤로 접힙니다. {n}은…',
 night:'불이 꺼졌습니다. 수조 밖 방도 캄캄합니다. {n}은…',
 hand:'물속으로 커다란 손이 들어옵니다. {n}은…',
 leftover:'바닥에 며칠 지난 사료가 쌓여 있습니다. 곰팡이 냄새가 납니다. {n}은…',
 prey:'작은 물고기 한 마리가 바로 입 앞을 지나갑니다. {n}은…',
 shadow:'커다란 그림자가 머리 위를 맴돕니다. 같은 수조의 큰 물고기입니다. {n}은…',
 cold:'물이 차갑습니다. 몸이 굳어 갑니다. {n}은…',
 heat:'물이 미지근하고 숨이 찹니다. {n}은…',
 newhome:'처음 보는 물입니다. 냄새도, 벽도 낯섭니다. {n}은…',
 school:'무리가 한쪽으로 꺾입니다. {n}은…',
 gasp:'물에서 쓴맛이 납니다. 아가미가 따갑습니다. {n}은…',
 sky:'수면 위로 커다란 그림자가 드리웁니다. {n}은…',
 look:'주인이 오랜만에 수조 앞에 멈춰 섰습니다. {n}은…',
 beg:'먹이 시간이 한참 지났습니다. 주인이 수조를 그냥 지나칩니다. {n}은…',
 gorge:'사료가 한 움큼 떨어집니다. 배는 이미 불러 있습니다. {n}은…',
 sickmate:'같은 수조의 물고기 몸에 하얀 점이 돋아 있습니다. {n}은…',
 bug:'수면 위에 날벌레 한 마리가 앉았습니다. {n}은…',
 decor:'새 장식물이 들어왔습니다. 구멍 가장자리가 날카롭습니다. {n}은…',
 rival:'같은 종 한 마리가 영역 안으로 들어옵니다. {n}은…',
 quiet:'오늘은 수조가 조용합니다. 물도 맑습니다. {n}은…',
 intruder:'영역 안으로 다른 물고기가 들어왔습니다. {n}은…'
};
FCH.forEach(c=>{if(OFX_FCH_P[c.id]&&typeof ofx_val(c,'p')==='string')c.p=OFX_FCH_P[c.id]});
(()=>{const i=FCH.findIndex(c=>c.id==='eggs');if(i>=0)ofx_swap(FCH,i,'p',()=>brood()==='cave'?'굴 안 천장에 알이 붙어 있습니다. 다른 물고기들이 굴 입구를 기웃거립니다. {n}은…':'닦아 둔 돌 위에 알이 붙어 있습니다. 다른 물고기들이 다가옵니다. {n}은…')})();

const OFX_FSIT_P={
 'g-feed':'먹이 시간입니다. 알갱이가 수면에 톡톡 떨어집니다. {n}은…',
 'g-hand':'커다란 손이 물속으로 들어옵니다. 수조 청소 시간입니다. {n}은…',
 'g-object':'처음 보는 물건이 수조 바닥에 놓였습니다. 낯선 냄새가 납니다. {n}은…',
 'g-night':'불이 꺼졌습니다. 방 안도 캄캄합니다. {n}은…',
 'g-glass':'유리벽이 쿵쿵 울립니다. 커다란 눈이 바로 앞에 붙어 있습니다. {n}은…',
 'g-newcomer':'봉지에 담긴 낯선 물고기들이 쏟아져 들어왔습니다. 낯선 냄새가 납니다. {n}은…',
 'g-badwater':'물에서 쓴맛이 납니다. 아가미가 따끔거립니다. {n}은…',
 'g-cold':'물이 차갑습니다. 몸이 자꾸 굳습니다. {n}은…',
 'g-heat':'물이 미지근합니다. 숨이 찹니다. {n}은…',
 'g-lonely':'주인 얼굴이 수조 앞에 나타나지 않은 지 오래입니다. 수조 불빛도 며칠째 꺼져 있습니다. {n}은…',
 'g-itch':'몸이 가렵고 무겁습니다. 지느러미가 자꾸 접힙니다. {n}은…',
 'g-bully':'덩치 큰 물고기가 또 쫓아옵니다. 지느러미 끝이 따끔합니다. {n}은…',
 'g-photo':'휴대폰 불빛이 번쩍입니다. 주인이 사진을 찍습니다. {n}은…',
 'g-cat':'수조 위 선반에 털 달린 그림자가 앉았습니다. 초록 눈이 수조 안을 내려다봅니다. {n}은…',
 'g-gorge':'주인이 "여행 가는 동안 먹으라"며 먹이 블록을 넣고 나갔습니다. {n}은…',
 'g-old':'몸이 예전 같지 않습니다. 지느러미가 무겁습니다. {n}은…',
 'g-algae':'유리와 돌에 초록 이끼가 잔뜩 끼었습니다. {n}은…',
 'g-mate':'같은 종 한 마리가 곁에 있습니다. 몸 색이 진해집니다. {n}은…',
 'g-rain':'빗방울이 연못 수면을 두드립니다. 물 냄새가 바뀌었습니다. {n}은…',
 'g-mouth':'입안에 알이 가득합니다. 몇 주째 아무것도 먹지 못해 배가 홀쭉합니다. {n}은…',
 'g-overfeed':'주인이 사료 통을 통째로 기울였습니다. 알갱이가 비처럼 쏟아집니다. {n}은…',
 'g-medicine':'물에서 이상한 냄새가 납니다. 주인이 파란 약을 병째 부었습니다. {n}은…',
 'g-redecor':'주인이 수조를 통째로 뒤엎어 새로 꾸몄습니다. 늘 들어가던 굴이 없습니다. {n}은…',
 'g-pencil':'작은 얼굴이 유리에 붙었습니다. 그 손에 연필이 들려 있습니다. 뚜껑이 열려 있습니다. {n}은…',
 'g-party':'거실에 사람이 가득합니다. 음악이 쿵쿵 울립니다. 누가 수조 위에서 잔을 기울입니다. {n}은…',
 'g-corpse':'함께 살던 물고기가 며칠째 바닥에 누워 있습니다. 아무도 치우지 않습니다. {n}은…',
 'g-sell':'주인이 수조를 찍으며 통화합니다. "그냥 가져가실래요? 수조째 드릴게요." {n}은…',
 'g-heater':'히터 유리관 둘레의 물이 따뜻합니다. 가까이 가면 데워진 물살이 몸에 닿습니다. {n}은…',
 'g-light':'주인이 조명을 며칠째 끄지 않습니다. 밤이 오지 않습니다. {n}은…',
 'g-coldwater':'새로 부은 물이 얼음장 같습니다. 수온이 한순간에 떨어졌습니다. {n}은…'
};
FSIT.forEach(c=>{if(OFX_FSIT_P[c.id]&&typeof ofx_val(c,'p')==='string')c.p=OFX_FSIT_P[c.id]});
(()=>{const i=FSIT.findIndex(c=>c.id==='g-brood');if(i<0)return;
  ofx_swap(FSIT,i,'p',()=>({live:'배가 무겁습니다. 몸 안에서 무언가 꿈틀거립니다. 수컷들은 여전히 쫓아옵니다. {n}은…',
    scatter:'배가 알로 부풀었습니다. 수컷들이 꼬리를 물 듯 쫓아옵니다. {n}은…',stick:'배가 알로 부풀었습니다. 수컷이 머리 옆에 몸을 붙입니다. {n}은…',
    bubble:'수면에 거품 둥지가 있습니다. 수컷이 둥지 아래에서 몸을 펼쳐 보입니다. {n}은…',mouth:'배가 알로 부풀었습니다. 수컷이 입을 벌리고 기다립니다. {n}은…',
    guard:'평평한 돌 위가 깨끗합니다. 알을 낳을 때입니다. {n}은…',cave:'굴 안이 조용합니다. 알을 낳을 때입니다. {n}은…'})[brood()]||'몸이 무겁습니다. {n}은…')})();

/* before any owner */
Object.assign(PSIT.net,{p:['그물이 물을 가르며 다가옵니다. 형제들이 한쪽으로 몰립니다. {n}은…','물이 흙탕물로 변했습니다. 사람 다리가 강바닥을 휘젓습니다. {n}은…','손전등 불빛이 물속을 비춥니다. 밤인데도 사람들이 있습니다. {n}은…']});
Object.assign(PSIT.box,{p:['봉지 속 물이 미지근해지고 숨이 찹니다. 상자는 계속 흔들립니다. {n}은…','상자 안이 캄캄합니다. 옆 봉지에서 무언가가 움직이지 않습니다. {n}은…','엔진 소리가 멎었습니다. 상자가 몇 시간째 움직이지 않습니다. {n}은…']});
Object.assign(PSIT.sieve,{p:['커다란 체가 물을 떠 올립니다. 불빛이 몸을 비춥니다. {n}은…','작업자의 손가락이 형제들을 하나씩 밀어냅니다. 손가락이 바로 앞까지 왔습니다. {n}은…','"이건 버리고, 이건 남기고." 목소리가 가까워집니다. {n}은…']});
Object.assign(PSIT.shop,{p:['유리 앞에 사람이 멈춰 섭니다. 손가락이 이쪽을 가리킵니다. {n}은…','아이가 유리에 얼굴을 붙이고 "이거! 이거!" 합니다. {n}은…','점원이 뜰채를 들고 수조 위에 섰습니다. "어느 거요?" {n}은…','어떤 사람이 휴대폰으로 사육법을 검색하며 한참 들여다봅니다. {n}은…','"이거 다 크면 얼마나 커요?" 누군가 묻습니다. {n}은…']});

/* crises */
const OFX_CRISIS_P={
 jump:['수면 위 틈 너머로 불빛이 보입니다. 꼬리 근육이 자꾸 움찔거립니다. {n}은…','수면에 날벌레가 내려앉았습니다. 뚜껑은 없습니다. {n}은…'],
 eaten:['커다란 그림자가 천천히 다가옵니다. 입이 열립니다. {n}은…','밤입니다. 무언가 바닥을 훑으며 다가옵니다. {n}은…'],
 intake:['물살이 몸을 흡입구 쪽으로 끌어당깁니다. {n}은…'],
 cook:['물이 점점 뜨거워집니다. 히터 불이 꺼지지 않습니다. {n}은…'],
 cold:['물이 얼음장 같습니다. 지느러미가 움직이지 않습니다. {n}은…'],
 oxygen:['정전입니다. 여과기가 멈췄습니다. 아가미가 점점 빨라집니다. {n}은…','폭염의 밤, 물이 미지근합니다. 숨이 점점 가빠집니다. {n}은…'],
 tapwater:['새 물에서 소독약 냄새가 납니다. 아가미가 따갑고 가장자리가 하얗게 질려 갑니다. {n}은…'],
 poison:['물 위에 무지갯빛 막이 떴습니다. 쓴 냄새가 납니다. {n}은…'],
 burst:['퍽. 수조가 터졌습니다. 물이 한꺼번에 빠져나갑니다. {n}은…'],
 cat:['앞발이 물속으로 들어옵니다. 발톱이 물을 가릅니다. {n}은…'],
 siphon:['호스가 물을 빨아들입니다. 몸이 끌려갑니다. {n}은…'],
 sun:['물이 목욕물처럼 데워집니다. 숨이 찹니다. {n}은…'],
 bread:['하얗게 불은 빵 조각이 떨어집니다. 고소한 냄새가 퍼집니다. {n}은…'],
 squeeze:['작은 손이 물속으로 들어와 이리저리 휘젓습니다. 손이 점점 가까워집니다. {n}은…'],
 cycle:['물이 독합니다. 아가미 끝이 붉게 붓고 눈앞이 뿌옇습니다. {n}은…','수면에 하얀 거품이 떠 있습니다. 숨을 쉴 때마다 아가미 뚜껑이 크게 벌어집니다. {n}은…'],
 disease:['몸이 무겁습니다. 지느러미가 더는 펴지지 않습니다. {n}은…'],
 escape:['뚜껑 틈으로 바깥 공기가 들어옵니다. 몸이 그쪽으로 끌립니다. {n}은…']
};
for(const k in OFX_CRISIS_P)if(CRISIS[k])CRISIS[k].p=OFX_CRISIS_P[k];

/* the schedule */
TRAIN_P.splice(0,TRAIN_P.length,'앞으로 몇 주가 흘러갑니다. {n}은…','계절이 바뀝니다. {n}은…','오늘부터 한동안, {n}은…','수조의 하루가 또 시작됩니다. {n}은…','물이 데워지고 식기를 몇 번 되풀이합니다. {n}은…','주인의 발소리가 하루에도 몇 번씩 지나갑니다. {n}은…');

/* prompts written inside the engine (the night-market pool, a heron over the river, a hook):
   the text is swapped when the choice is shown; any other "…나는…" prompt in a fish's life ends in "{n}은…" */
const OFX_INLINE_P={
 '종이 뜰채가 물을 가르며 내려온다. 풀 가장자리에 손들이 빼곡하다. 나는…':'종이 뜰채가 물을 가르며 내려옵니다. 풀 가장자리에 손들이 빼곡합니다. {n}은…',
 '또 밤이 왔다. 물은 어제보다 탁하고 미지근하다. 종이 뜰채가 내려온다. 나는…':'또 밤이 왔습니다. 물은 어제보다 탁하고 미지근합니다. 종이 뜰채가 내려옵니다. {n}은…',
 '물 위로 길쭉한 그림자가 드리운다. 부리 끝이 반짝인다. 나는…':'물 위로 길쭉한 그림자가 드리웁니다. 부리 끝이 반짝입니다. {n}은…',
 '바닥 진흙이 꿈틀거린다. 수염 달린 커다란 입이 다가온다. 나는…':'바닥 진흙이 꿈틀거립니다. 수염 달린 커다란 입이 다가옵니다. {n}은…',
 '커다란 입을 가진 물고기가 빠르게 다가온다. 나는…':'커다란 입을 가진 물고기가 빠르게 다가옵니다. {n}은…',
 '눈앞에서 통통한 지렁이가 흔들린다. 배가 고프다. 나는…':'눈앞에서 통통한 지렁이가 흔들립니다. 먹이 냄새가 물에 퍼집니다. {n}은…'
};
function ofx_prompt(c){
  if(!c||!S||!S.sp||S.sp.g!=='fish'||typeof c.p!=='string')return c;
  const p=OFX_INLINE_P[c.p];
  if(p)return Object.assign({},c,{p});
  if(/(^|\s)나는…$/.test(c.p))return Object.assign({},c,{p:c.p.replace(/\s*나는…$/,' {n}은…')});
  return c;
}
(()=>{const _ask=askChoice;askChoice=function(c,cb){return _ask(ofx_prompt(c),cb)}})();
/* a fish facing a heron: only a fish that holds its ground and is strong enough (or a gar) gets "맞서 싸운다" */
(()=>{const _pc=predChoice;predChoice=function(pred){const c=_pc(pred);
  if(c&&S&&S.sp&&S.sp.g==='fish'&&c.o)c.o=c.o.filter(x=>!x.fight||ofx_fighter()||isSp('gar'));return c}})();

/* temperament cards: a neon is not territorial and a stingray does not jump */
ofx_text(FTEMPER_D,'feisty',()=>S&&S.sp&&S.f&&!ofx_terr()?'먹이 앞에서 밀리지 않는다. 건드리면 재빨리 몸을 튼다.':'영역을 지키고, 건드리면 들이받는다.');
ofx_text(FTEMPER_D,'curious',()=>S&&S.sp&&S.f&&!ofx_jumper()?'새 물건, 틈, 그림자가 궁금하다. 무엇이든 가까이 가 본다.':'새 물건, 틈, 수면 위가 궁금하다. 가끔 뛰어오른다.');

/* ---------- 1. species guards: fixed choices (FCH) ---------- */
(()=>{
  const lid=ofx_ch('lid');ofx_and(lid,'when',ofx_jumper);
  ofx_and(ofx_opt(ofx_ch('bully'),'몸을 세우고 맞선다'),'when',ofx_terr);
  const mir=ofx_opt(ofx_ch('mirror'),'모른 척 거품집을 짓는다');
  if(mir){
    ofx_text(mir,'l',()=>isSp('betta')?'모른 척 거품집을 짓는다':isSp('apisto')?'모른 척 굴 입구를 정리한다':'모른 척 돌 틈으로 들어간다');
    ofx_text(mir,'r',()=>isSp('betta')?'{n}은 수면에 거품을 하나씩 붙여 집을 지었습니다.':isSp('apisto')?'{n}은 굴 입구의 모래를 입으로 날라 치웠습니다.':'{n}은 돌 틈으로 들어가 지느러미를 접었습니다.');
    ofx_text(mir,'m',()=>isSp('betta')?'수면에 거품집을 지었다. 혼자였지만.':'');
  }
  ofx_and(ofx_opt(ofx_ch('hand'),'손가락을 톡 쪼아 본다'),'when',ofx_surface);
  const sh=ofx_ch('shadow');
  if(sh){ofx_and(ofx_opt(sh,'수면 쪽으로 도망친다'),'when',ofx_jumper);
    sh.o.push({l:'바닥에 납작 붙어 움직이지 않는다',r:'{n}은 바닥에 몸을 붙이고 그림자가 지나가길 기다렸습니다.',c:'neutral',fx:()=>{S.f.stress+=.03}})}
  ofx_and(ofx_opt(ofx_ch('night'),'수면 가까이 떠서 잠든다'),'when',()=>!isSp('@bottom'));
  const run=ofx_opt(ofx_ch('net'),'있는 힘을 다해 달아난다');if(run)run.r='{n}이 수조 안을 이리저리 달아났습니다. 비늘 몇 개가 떨어졌습니다.';
})();

/* ---------- FSIT: options by temperament and kind ---------- */
(()=>{
  const N=(id,l,fn)=>ofx_and(ofx_opt(ofx_sit(id),l),'need',fn);
  /* the surface and the fingers */
  N('g-feed','수면까지 올라가 먼저 먹는다',ofx_surface);
  N('g-feed','수면 위 손가락까지 따라 올라간다',ofx_surface);
  N('g-feed','다가오는 물고기를 들이받고 먹는다',ofx_shover);
  N('g-hand','손가락을 먹이인 줄 알고 쫀다',ofx_surface);
  N('g-hand','주인 손등에 몸을 비빈다',()=>isSp('@gold','koi','oscar','motoro'));
  /* biting */
  N('g-hand','손가락을 문다',ofx_biter);
  N('g-sell','사러 온 사람의 손가락을 문다',ofx_biter);
  N('g-pencil','연필을 문다',()=>ofx_biter()||isSp('betta','wildbetta'));
  /* territory */
  N('g-object','영역에 들어온 침입자로 보고 들이받는다',ofx_terr);
  N('g-night','영역을 순찰하며 다른 물고기를 쫓는다',ofx_terr);
  N('g-cat','지느러미를 펴고 위협한다',ofx_terr);
  N('g-gorge','블록을 지키며 다른 물고기를 쫓는다',ofx_terr);
  N('g-mate','경쟁자를 몰아낸다',ofx_terr);
  N('g-redecor','새 장식을 하나하나 들이받아 본다',ofx_terr);
  N('g-glass','유리를 향해 돌진한다',ofx_terr);
  const nc=ofx_sit('g-newcomer');
  const nc1=ofx_opt(nc,'모르는 척 내 할 일을 한다');if(nc1)nc1.l='새 물고기들에게 신경 쓰지 않는다';
  const nc2=ofx_opt(nc,'내 영역에서 내쫓는다');if(nc2){nc2.l='영역 밖으로 내쫓는다';ofx_and(nc2,'need',ofx_terr)}
  /* fighting back: only a territorial fish stands its ground, and only a strong one makes the bully back off */
  const bf=ofx_opt(ofx_sit('g-bully'),'맞서 싸운다');
  if(bf){ofx_and(bf,'need',ofx_terr);bf.out[0][1]=()=>ofx_fighter()?'{n}이 맞서자 녀석이 물러났습니다.':'{n}이 지느러미를 세우고 버티자 녀석이 잠깐 방향을 틀었습니다. 다음 날 또 쫓아왔습니다.'}
  /* reflections */
  const ph=ofx_opt(ofx_sit('g-photo'),'렌즈에 비친 내 모습에 덤빈다');if(ph){ph.l='렌즈에 비친 제 모습에 덤빈다';ofx_and(ph,'need',ofx_mirror)}
  /* jumping and splashing */
  N('g-night','캄캄한 수면 위를 탐험한다',()=>!lidOpen()||ofx_jumper());
  N('g-badwater','수면 위로 뛰어올라 탈출한다',ofx_jumper);
  N('g-badwater','수면을 첨벙첨벙 친다',()=>ofx_big(10));
  N('g-lonely','수면을 첨벙거려 소리를 낸다',()=>ofx_big(10));
  /* bubble nests are a betta thing; an apisto spawns in a cave */
  N('g-mate','수면에 거품 둥지를 짓는다',()=>isSp('betta'));
  N('g-mate','평평한 돌을 깨끗이 닦는다',()=>!isSp('apisto'));
  /* labels in the first person, a quoted "그만" */
  const ng=ofx_opt(ofx_sit('g-night'),'이제부터가 내 시간이다');if(ng)ng.l='불이 꺼지자 은신처에서 나온다';
  const ov=ofx_opt(ofx_sit('g-overfeed'),'유리 앞에서 "그만"이라고 지느러미를 흔든다');if(ov)ov.l='유리 앞에서 지느러미를 크게 흔든다';
  /* hyperbole */
  const cw=ofx_opt(ofx_sit('g-coldwater'),'헤엄쳐서 몸을 데운다');if(cw)cw.out[0][1]='{n}은 쉬지 않고 헤엄쳤습니다. 조금 나았습니다.';
  const bn=ofx_opt(ofx_sit('g-brood'),'둥지를 부순다');if(bn)bn.out[0][1]='{n}이 둥지를 들이받아 거품을 흩뜨렸습니다. 수컷이 쉬지 않고 덤볐습니다.';
})();

/* ---------- crises ---------- */
(()=>{
  const C=(k,l)=>CRISIS[k]&&CRISIS[k].o.find(o=>ofx_val(o,'l')===l);
  const ea=C('eaten','정면으로 맞선다');
  if(ea){ofx_and(ea,'need',ofx_terr);ea.out[0][1]=()=>ofx_fighter()?'{n}이 덤비자 그림자가 움찔 물러났습니다.':'{n}이 몸을 돌려 지느러미를 세우자 그림자가 한순간 멈칫했습니다. 그 틈에 {n}은 바닥 틈으로 빠져나갔습니다.'}
  ofx_and(C('cat','앞발을 문다'),'need',ofx_biter);
  ofx_and(C('jump','힘껏 뛰어오른다'),'need',ofx_jumper);
  ofx_and(C('jump','벌레를 낚아채러 뛴다'),'need',ofx_jumper);
  ofx_and(C('squeeze','손가락을 문다'),'need',ofx_biter);
  const ik=C('intake','흡입구 망을 물고 버틴다');
  if(ik)ofx_text(ik,'l',()=>S&&S.sp&&isSp('pleco')?'입으로 흡입구 옆 유리에 달라붙어 버틴다':S&&S.sp&&ofx_biter()?'흡입구 망을 물고 버틴다':'꼬리를 세차게 치며 버틴다');
  const ds=C('disease','마지막 힘으로 헤엄친다');if(ds)ds.out[0][1]='{n}은 수조를 한 바퀴 천천히 돌았습니다. 그리고 버텼습니다.';
})();

/* ---------- the schedule (TRAIN) ---------- */
(()=>{
  const tr=l=>TRAIN.find(t=>ofx_val(t,'l')===l);
  const mt=tr('유리에 비친 나와 싸운다');if(mt){mt.l='유리에 비친 제 모습과 싸운다';ofx_and(mt,'need',ofx_mirror)}
  ofx_and(tr('수면 위 세상을 구경한다'),'need',ofx_jumper);
  ofx_and(tr('영역 싸움에서 이기는 법을 익힌다'),'need',ofx_terr);
  ofx_and(tr('거품 둥지를 짓는 연습을 한다'),'need',()=>isSp('betta'));
  /* a school has no rank fights: the neon is pushed to the back instead of being bitten */
  const so=tr('같은 종과 어울린다');
  if(so&&so.fail[0]){const t0=so.fail[0][0];Object.defineProperty(so.fail[0],0,{get:()=>S&&S.sp&&!ofx_terr()&&!isSp('@gold','koi','@livebearer')?'무리 안에서 자리다툼에 밀렸습니다. {n}은 지느러미 끝이 해진 채 무리 맨 끝으로 밀려났습니다.':t0,enumerable:true,configurable:true})}
})();

/* ---------- everyday lines (FFL, FFL2, FFL3) ---------- */
(()=>{
  const byT=s=>FFL.find(e=>{const t=ofx_val(e,'t');return typeof t==='string'&&t.startsWith(s)});
  const byOnce=o=>FFL.find(e=>e.once===o);
  const noFarm=()=>!['farm','rare'].includes(brood())&&!isSp('arowana','gar','pleco');
  /* line breeding: what is being fixed depends on the fish; hormone-bred and pond-bred species are not bred at home */
  const ln=byOnce('line');
  if(ln){ofx_and(ln,'when',noFarm);
    ofx_text(ln,'t',()=>'주인이 {n}의 '+josa(isSp('koi')?'무늬':isSp('@longfin')?'지느러미 모양':'몸 색','을')+' 고정하려고 같은 핏줄끼리 짝을 지었습니다. 태어난 치어 중 절반은 등이 굽어 있었습니다.')}
  const rec=byT('주인이 번식 기록장에');
  if(rec){ofx_and(rec,'when',noFarm);
    ofx_text(rec,'t',()=>'주인이 번식 기록장에 {n}의 혈통과 '+BW().spawn+' 날짜를 적었습니다. '+(isSp('betta')?'치어들은 한 마리씩 이름표가 붙은 컵으로 옮겨졌습니다.':'치어들은 크기별로 나뉜 수조로 옮겨졌습니다.'))}
  const mill=FFL.find(e=>ofx_val(e,'t')===undefined&&e.c==='bad'&&String(e.when).includes("own==='mill'")&&String(e.fx).includes('S.health-=4'));
  ofx_and(mill,'when',noFarm);
  ofx_and(byT('치어가 태어났습니다. 주인은 무늬가'),'when',noFarm);
  ofx_and(byT('{n}이 수면에 거품 둥지를 지었습니다'),'when',()=>isSp('betta'));
  ofx_and(byT('{n}이 유리에 비친 자기 모습을 쫓아'),'when',ofx_mirror);

  /* FFL3: the tyrant route only goes on to bite and kill for a fish that does that */
  const t1=byOnce('tyr1');
  if(t1)ofx_text(t1,'t',()=>ofx_terr()?'{n}이 수조에서 가장 좋은 자리를 차지했습니다. 다른 물고기가 가까이 오면 들이받아 쫓아냈습니다.':'{n}이 먹이가 떨어지는 자리를 늘 먼저 차지했습니다. {n}이 지나가면 다른 물고기들이 길을 비켰습니다.');
  ofx_and(byOnce('tyr2'),'when',ofx_hostile);
  ofx_and(byOnce('tyr3'),'when',ofx_hostile);
  /* a finger in the mouth: teeth for a predator, a cichlid or a puffer; a goldfish or a koi only sucks */
  const fg=byOnce('finger');
  if(fg){ofx_and(fg,'when',()=>ofx_biter()||isSp('@gold','koi'));
    ofx_text(fg,'t',()=>isSp('@gold','koi')?'{n}이 먹이인 줄 알고 주인 손가락 끝을 입에 물고 빨았습니다. 이빨이 없는 입이라 간지럽기만 했습니다. 그날부터 {n}은 손가락만 보면 달려들었고, 주인은 그걸 좋아했습니다.':'{n}이 먹이인 줄 알고 주인 손가락을 물었습니다. 주인은 "아야" 하고 웃었습니다. 그날부터 {n}은 손가락만 보면 달려들었고, 주인은 그걸 좋아했습니다.')}
  const mr=byOnce('mirror');
  if(mr){mr.when=()=>ofx_mirror()&&S.f.tank!=='pond'}
  ofx_and(byOnce('gen4'),'when',()=>fGroup('CICH'));
  /* surviving neglect: only a grazer lives on algae; the rest scavenge */
  const graze=()=>isSp('@gold','koi','pleco','platy','guppy');
  const s1=byOnce('surv1');
  if(s1)ofx_text(s1,'t',()=>'몇 달 동안 아무도 수조를 제대로 들여다보지 않았습니다. {n}은 '+(graze()?'이끼와 가라앉은 부스러기를 뜯어 먹으며':'바닥에 가라앉은 부스러기와 수조에 저절로 생긴 달팽이를 주워 먹으며')+' 오히려 몸이 불었습니다. 오랜만에 수조를 본 주인이 말했습니다. "얘 왜 이렇게 컸어?"');
  const s2=byOnce('surv2');
  if(s2)ofx_text(s2,'t',()=>'사흘 동안 아무도 밥을 주지 않았습니다. {n}은 움직임을 줄이고 '+(graze()?'수조 벽의 이끼를 갉아 먹으며':'바닥에 남은 부스러기를 찾아 먹으며')+' 버텼습니다.');
})();

/* ---------- in a Korean river (WILD_FLAV) ---------- */
(()=>{
  const W=s=>WILD_FLAV.find(f=>typeof f.t==='string'&&f.t.startsWith(s));
  ofx_and(W('밤이 되자 호숫가 덤불에서'),'when',()=>S.sp.g!=='fish');
  ofx_and(W('아이들이 뜰채로 {n}을 쫓았습니다'),'when',()=>!S.f||S.f.len<30);
  const big=W('{n}은 어느새 팔뚝만 하게 자랐습니다');
  if(big)big.t=()=>'{n}은 어느새 팔뚝만 하게 자랐습니다. '+(isSp('comet')?'주황색 비늘은':'화려하던 비늘 색은')+' 누렇게 바랬고, 이제 왜가리도 쉽게 덤비지 못합니다.';
})();
