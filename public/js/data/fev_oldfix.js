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
 feed:'위에서 알갱이가 떨어진다. 다른 물고기들이 몰려든다. 타임 세일 개시다. {n}은…',
 strange:'처음 보는 마른 알갱이가 떨어진다. 고향 물에서는 맡아 본 적 없는 냄새다. 이게… 밥? {n}은…',
 bully:'덩치 큰 물고기가 자꾸 뒤를 쫓아온다. 지느러미 끝에 물린 자국이 있다. 수조에도 일진이 있다. {n}은…',
 lid:'수면 위 틈으로 불빛이 보인다. 물 밖은 밝고 넓다. 넓어 보인다. 물은 없다. {n}은…',
 net:'뜰채가 물속으로 들어온다. 공포의 그물 등장. {n}은…',
 sickhide:'몸이 무겁다. 아가미가 빠르게 움직인다. 이건 개그가 아니다. {n}은…',
 intake:'여과기 흡입구 쪽 물살이 세다. 몸이 그쪽으로 끌려간다. 블랙홀이다. 수조판. {n}은…',
 glass:'유리벽이 쿵쿵 울린다. 커다란 얼굴이 유리에 붙어 있다. 거인의 습격이다. {n}은…',
 face:'먹이 시간마다 오는 그 얼굴이 유리 앞에 다가온다. 밥 주는 사람이다. 아마. {n}은…',
 air:'아가미가 빠르게 움직이는데도 숨이 모자란다. 수면 위에는 공기가 있다. {n}은…',
 newfish:'봉지에 담겨 온 낯선 물고기가 들어왔다. 물에서 낯선 냄새가 난다. 전학생이다. {n}은…',
 mirror:'유리벽에 똑같이 생긴 물고기가 비친다. 녀석도 지느러미를 펼친다. 따라 하지 마라. {n}은…',
 current:'물살이 세다. 지느러미가 자꾸 뒤로 접힌다. 태풍 한가운데다. 수조 안인데. {n}은…',
 night:'불이 꺼졌다. 수조 밖 방도 캄캄하다. 밤이다. {n}은…',
 hand:'물속으로 커다란 손이 들어온다. 신의 손이다. 손톱에 때가 껴 있다. {n}은…',
 leftover:'바닥에 며칠 지난 사료가 쌓여 있다. 곰팡이 냄새가 난다. 유통기한이란 개념은 수조에 없다. {n}은…',
 prey:'작은 물고기 한 마리가 바로 입 앞을 지나간다. 무방비다. {n}은…',
 shadow:'커다란 그림자가 머리 위를 맴돈다. 같은 수조의 큰 물고기다. 룸메이트가 무섭다. {n}은…',
 cold:'물이 차갑다. 몸이 굳어 간다. {n}은…',
 heat:'물이 미지근하고 숨이 차다. 목욕탕이다. 원한 적 없다. {n}은…',
 newhome:'처음 보는 물이다. 냄새도, 벽도 낯설다. 새 집이다. 리뷰는 아직 없다. {n}은…',
 school:'무리가 한쪽으로 꺾인다. 단체 군무다. 연습은 안 했다. {n}은…',
 gasp:'물에서 쓴맛이 난다. 아가미가 따갑다. 이 물, 뭔가 잘못됐다. {n}은…',
 sky:'수면 위로 커다란 그림자가 드리운다. 하늘에서 뭔가 온다. {n}은…',
 look:'주인이 오랜만에 수조 앞에 멈춰 섰다. 오랜만이다. 정말로. {n}은…',
 beg:'먹이 시간이 한참 지났다. 주인이 수조를 그냥 지나친다. 지나쳤다. 방금. {n}은…',
 gorge:'사료가 한 움큼 떨어진다. 배는 이미 불렀다. 뷔페 마감 10분 전의 고민이다. {n}은…',
 sickmate:'같은 수조의 물고기 몸에 하얀 점이 돋아 있다. 불길하다. {n}은…',
 bug:'수면 위에 날벌레 한 마리가 앉았다. 배달 음식이다. {n}은…',
 decor:'새 장식물이 들어왔다. 신도시 개발이다. 구멍 가장자리가 날카롭다. 부실 공사다. {n}은…',
 rival:'같은 종 한 마리가 영역 안으로 들어온다. 선전포고다. {n}은…',
 quiet:'오늘은 수조가 조용하다. 물도 맑다. 이런 날은 드물다. {n}은…',
 intruder:'영역 안으로 다른 물고기가 들어왔다. 무단 침입이다. {n}은…'
};
FCH.forEach(c=>{if(OFX_FCH_P[c.id]&&typeof ofx_val(c,'p')==='string')c.p=OFX_FCH_P[c.id]});
(()=>{const i=FCH.findIndex(c=>c.id==='eggs');if(i>=0)ofx_swap(FCH,i,'p',()=>brood()==='cave'?'굴 안 천장에 알이 붙어 있다. 다른 물고기들이 굴 입구를 기웃거린다. 보안 비상이다. {n}은…':'닦아 둔 돌 위에 알이 붙어 있다. 다른 물고기들이 다가온다. 보안 비상이다. {n}은…')})();

const OFX_FSIT_P={
 'g-feed':'먹이 시간이다. 알갱이가 수면에 톡톡 떨어진다. 하루의 하이라이트다. {n}은…',
 'g-hand':'커다란 손이 물속으로 들어온다. 수조 청소 시간이다. 대사건이다. {n}은…',
 'g-object':'처음 보는 물건이 수조 바닥에 놓였다. 낯선 냄새가 난다. 미확인 물체다. {n}은…',
 'g-night':'불이 꺼졌다. 방 안도 캄캄하다. 수조의 밤이 시작됐다. {n}은…',
 'g-glass':'유리벽이 쿵쿵 울린다. 커다란 눈이 바로 앞에 붙어 있다. 두드리지 마세요, 라고 써 붙일 손이 없다. {n}은…',
 'g-newcomer':'봉지에 담긴 낯선 물고기들이 쏟아져 들어왔다. 낯선 냄새가 난다. 단체 전학생이다. {n}은…',
 'g-badwater':'물에서 쓴맛이 난다. 아가미가 따끔거린다. 수질 경보다. {n}은…',
 'g-cold':'물이 차갑다. 몸이 자꾸 굳는다. {n}은…',
 'g-heat':'물이 미지근하다. 숨이 차다. 한증막 개장이다. {n}은…',
 'g-lonely':'주인 얼굴이 수조 앞에 나타나지 않은 지 오래다. 수조 불빛도 며칠째 꺼져 있다. 이 집, 괜찮은 걸까. {n}은…',
 'g-itch':'몸이 가렵고 무겁다. 지느러미가 자꾸 접힌다. 컨디션 난조다. {n}은…',
 'g-bully':'덩치 큰 물고기가 또 쫓아온다. 지느러미 끝이 따끔하다. 또다. 또야. {n}은…',
 'g-photo':'휴대폰 불빛이 번쩍인다. 주인이 사진을 찍는다. 화보 촬영이다. 출연료는 없다. {n}은…',
 'g-cat':'수조 위 선반에 털 달린 그림자가 앉았다. 초록 눈이 수조 안을 내려다본다. 최종 보스다. {n}은…',
 'g-gorge':'주인이 "여행 가는 동안 먹어"라며 먹이 블록을 넣고 나갔다. 셀프 도시락이다. {n}은…',
 'g-old':'몸이 예전 같지 않다. 지느러미가 무겁다. 세월이다. {n}은…',
 'g-algae':'유리와 돌에 초록 이끼가 잔뜩 끼었다. 정글 테마로 리모델링됐다. 아무도 안 했는데. {n}은…',
 'g-mate':'같은 종 한 마리가 곁에 있다. 몸 색이 진해진다. 이건… 설렘이다. {n}은…',
 'g-rain':'빗방울이 연못 수면을 두드린다. 물 냄새가 바뀌었다. 하늘에서 물이 온다. 물고기에겐 축제다. {n}은…',
 'g-mouth':'입안에 알이 가득하다. 몇 주째 아무것도 못 먹어 배가 홀쭉하다. 육아는 입으로 한다. 진짜다. {n}은…',
 'g-overfeed':'주인이 사료 통을 통째로 기울였다. 알갱이가 비처럼 쏟아진다. 사료 장마다. {n}은…',
 'g-medicine':'물에서 이상한 냄새가 난다. 주인이 파란 약을 병째 부었다. 병째. {n}은…',
 'g-redecor':'주인이 수조를 통째로 뒤엎어 새로 꾸몄다. 재개발이다. 늘 들어가던 굴이 철거됐다. {n}은…',
 'g-pencil':'작은 얼굴이 유리에 붙었다. 그 손에 연필이 들려 있다. 뚜껑이 열려 있다. 불길한 3단 콤보다. {n}은…',
 'g-party':'거실에 사람이 가득하다. 음악이 쿵쿵 울린다. 누가 수조 위에서 잔을 기울인다. 그 잔, 내리라고. {n}은…',
 'g-corpse':'함께 살던 물고기가 며칠째 바닥에 누워 있다. 아무도 치우지 않는다. {n}은…',
 'g-sell':'주인이 수조를 찍으며 통화한다. "그냥 가져가실래요? 수조째 드릴게요." 덤 취급이다. {n}은…',
 'g-heater':'히터 유리관 둘레의 물이 따뜻하다. 가까이 가면 데워진 물살이 몸에 닿는다. 겨울의 난로 앞이다. {n}은…',
 'g-light':'주인이 조명을 며칠째 끄지 않는다. 밤이 오지 않는다. 백야다. 수조에. {n}은…',
 'g-coldwater':'새로 부은 물이 얼음장 같다. 수온이 한순간에 떨어졌다. 얼음물 챌린지다. 동의한 적 없다. {n}은…'
};
FSIT.forEach(c=>{if(OFX_FSIT_P[c.id]&&typeof ofx_val(c,'p')==='string')c.p=OFX_FSIT_P[c.id]});
(()=>{const i=FSIT.findIndex(c=>c.id==='g-brood');if(i<0)return;
  ofx_swap(FSIT,i,'p',()=>({live:'배가 무겁다. 몸 안에서 무언가 꿈틀거린다. 수컷들은 여전히 쫓아온다. 눈치가 없다. {n}은…',
    scatter:'배가 알로 부풀었다. 수컷들이 꼬리를 물 듯 쫓아온다. 인기 폭발이다. 귀찮다. {n}은…',stick:'배가 알로 부풀었다. 수컷이 머리 옆에 몸을 붙인다. 가깝다. 너무 가깝다. {n}은…',
    bubble:'수면에 거품 둥지가 있다. 수컷이 둥지 아래서 몸을 펼쳐 보인다. 집 자랑이다. {n}은…',mouth:'배가 알로 부풀었다. 수컷이 입을 벌리고 기다린다. 표정이 진지하다. {n}은…',
    guard:'평평한 돌 위가 깨끗하다. 알을 낳을 때다. 분만실 준비 완료. {n}은…',cave:'굴 안이 조용하다. 알을 낳을 때다. 분만실 준비 완료. {n}은…'})[brood()]||'몸이 무겁다. {n}은…')})();

/* before any owner */
Object.assign(PSIT.net,{p:['그물이 물을 가르며 다가온다. 형제들이 한쪽으로 몰린다. 1화부터 위기다. {n}은…','물이 흙탕물로 변했다. 사람 다리가 강바닥을 휘젓는다. 거인들의 침공이다. {n}은…','손전등 불빛이 물속을 비춘다. 밤인데도 사람들이 있다. 야근이다. {n}은…']});
Object.assign(PSIT.box,{p:['봉지 속 물이 미지근해지고 숨이 차다. 상자는 계속 흔들린다. 최악의 여행 패키지다. {n}은…','상자 안이 캄캄하다. 옆 봉지에서 무언가가 움직이지 않는다. {n}은…','엔진 소리가 멎었다. 상자가 몇 시간째 움직이지 않는다. 잊혀졌다. 아마도. {n}은…']});
Object.assign(PSIT.sieve,{p:['커다란 체가 물을 떠 올린다. 불빛이 몸을 비춘다. 심사 시작이다. {n}은…','작업자의 손가락이 형제들을 하나씩 밀어낸다. 손가락이 바로 앞까지 왔다. 다음 차례다. {n}은…','"이건 버리고, 이건 남기고." 목소리가 가까워진다. 오디션 결과 발표다. {n}은…']});
Object.assign(PSIT.shop,{p:['유리 앞에 사람이 멈춰 선다. 손가락이 이쪽을 가리킨다. 나? 나요? {n}은…','아이가 유리에 얼굴을 붙이고 "이거! 이거!" 한다. 지명당했다. {n}은…','점원이 뜰채를 들고 수조 위에 섰다. "어느 거요?" 운명의 순간이다. {n}은…','어떤 사람이 휴대폰으로 사육법을 검색하며 한참 들여다본다. 검색하는 손님. 레어 등급이다. {n}은…','"이거 다 크면 얼마나 커요?" 누군가 묻는다. 좋은 질문이다. 아주 좋은 질문이다. {n}은…']});

/* crises */
const OFX_CRISIS_P={
 jump:['수면 위 틈 너머로 불빛이 보인다. 꼬리 근육이 자꾸 움찔거린다. 뛰고 싶다. 뛰면 안 된다. {n}은…','수면에 날벌레가 내려앉았다. 뚜껑은 없다. 이 조합, 위험하다. {n}은…'],
 eaten:['커다란 그림자가 천천히 다가온다. 입이 열린다. 크다. 입이 너무 크다. {n}은…','밤이다. 무언가 바닥을 훑으며 다가온다. 공포 영화 BGM이 깔린다. {n}은…'],
 intake:['물살이 몸을 흡입구 쪽으로 끌어당긴다. 빨려 간다. 진짜로. {n}은…'],
 cook:['물이 점점 뜨거워진다. 히터 불이 꺼지지 않는다. 히터가 폭주했다. {n}은…'],
 cold:['물이 얼음장 같다. 지느러미가 움직이지 않는다. {n}은…'],
 oxygen:['정전이다. 여과기가 멈췄다. 아가미가 점점 빨라진다. 위기다. 진짜 위기다. {n}은…','폭염의 밤, 물이 미지근하다. 숨이 점점 가빠진다. 주인은 에어컨 앞에 있다. {n}은…'],
 tapwater:['새 물에서 소독약 냄새가 난다. 아가미가 따갑고 가장자리가 하얗게 질려 간다. 수돗물 그대로다. {n}은…'],
 poison:['물 위에 무지갯빛 막이 떴다. 예쁘다. 예쁘면 안 되는 거다. 쓴 냄새가 난다. {n}은…'],
 burst:['퍽. 수조가 터졌다. 물이 한꺼번에 빠져나간다. 세계가 무너졌다. 말 그대로. {n}은…'],
 cat:['앞발이 물속으로 들어온다. 발톱이 물을 가른다. 최종 보스의 공격이다. {n}은…'],
 siphon:['호스가 물을 빨아들인다. 몸이 끌려간다. 주인은 폰을 보고 있다. {n}은…'],
 sun:['물이 목욕물처럼 데워진다. 숨이 차다. 반신욕은 사람이 하는 거다. {n}은…'],
 bread:['하얗게 불은 빵 조각이 떨어진다. 고소한 냄새가 퍼진다. 냄새는 좋다. 그게 문제다. {n}은…'],
 squeeze:['작은 손이 물속으로 들어와 이리저리 휘젓는다. 손이 점점 가까워진다. 어른은 어디 갔지. {n}은…'],
 cycle:['물이 독하다. 아가미 끝이 붉게 붓고 눈앞이 뿌옇다. 물이 맑아 보여도 이렇다. {n}은…','수면에 하얀 거품이 떠 있다. 숨을 쉴 때마다 아가미 뚜껑이 크게 벌어진다. {n}은…'],
 disease:['몸이 무겁다. 지느러미가 더는 펴지지 않는다. {n}은…'],
 escape:['뚜껑 틈으로 바깥 공기가 들어온다. 몸이 그쪽으로 끌린다. 탈옥의 냄새다. {n}은…']
};
for(const k in OFX_CRISIS_P)if(CRISIS[k])CRISIS[k].p=OFX_CRISIS_P[k];

/* the schedule */
TRAIN_P.splice(0,TRAIN_P.length,'앞으로 몇 주가 흘러간다. 몽타주 BGM 재생. {n}은…','계절이 바뀐다. 수조 안은 잘 모른다. {n}은…','오늘부터 한동안, {n}은…','수조의 하루가 또 시작된다. 어제랑 똑같다. {n}은…','물이 데워지고 식기를 몇 번 되풀이한다. 세월이 간다. {n}은…','주인의 발소리가 하루에도 몇 번씩 지나간다. 멈추지는 않는다. {n}은…');

/* prompts written inside the engine (the night-market pool, a heron over the river, a hook):
   the text is swapped when the choice is shown; any other "…나는…" prompt in a fish's life ends in "{n}은…" */
const OFX_INLINE_P={
 '종이 뜰채가 물을 가르며 내려온다. 풀 가장자리에 손들이 빼곡하다. 나는…':'종이 뜰채가 물을 가르며 내려온다. 풀 가장자리에 손들이 빼곡하다. 사방이 적이다. {n}은…',
 '또 밤이 왔다. 물은 어제보다 탁하고 미지근하다. 종이 뜰채가 내려온다. 나는…':'또 밤이 왔다. 물은 어제보다 탁하고 미지근하다. 종이 뜰채가 또 내려온다. 2회차다. {n}은…',
 '물 위로 길쭉한 그림자가 드리운다. 부리 끝이 반짝인다. 나는…':'물 위로 길쭉한 그림자가 드리운다. 부리 끝이 반짝인다. 왜가리다. 표정이 없다. {n}은…',
 '바닥 진흙이 꿈틀거린다. 수염 달린 커다란 입이 다가온다. 나는…':'바닥 진흙이 꿈틀거린다. 수염 달린 커다란 입이 다가온다. 강바닥의 터줏대감이다. {n}은…',
 '커다란 입을 가진 물고기가 빠르게 다가온다. 나는…':'커다란 입을 가진 물고기가 빠르게 다가온다. 입이 몸의 절반이다. {n}은…',
 '눈앞에서 통통한 지렁이가 흔들린다. 배가 고프다. 나는…':'눈앞에서 통통한 지렁이가 흔들린다. 먹이 냄새가 물에 퍼진다. 너무 맛있어 보인다. 수상할 만큼. {n}은…'
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
ofx_text(FTEMPER_D,'feisty',()=>S&&S.sp&&S.f&&!ofx_terr()?'먹이 앞에서 밀리지 않는다. 건드리면 재빨리 몸을 튼다. 작지만 깡이 있다.':'영역을 지키고, 건드리면 들이받는다. 동네 조폭 기질.');
ofx_text(FTEMPER_D,'curious',()=>S&&S.sp&&S.f&&!ofx_jumper()?'새 물건, 틈, 그림자가 궁금하다. 무엇이든 가까이 가 본다. 호기심이 목숨보다 크다.':'새 물건, 틈, 수면 위가 궁금하다. 가끔 뛰어오른다. 뚜껑 필수.');

/* ---------- 1. species guards: fixed choices (FCH) ---------- */
(()=>{
  const lid=ofx_ch('lid');ofx_and(lid,'when',ofx_jumper);
  ofx_and(ofx_opt(ofx_ch('bully'),'몸을 세우고 맞선다'),'when',ofx_terr);
  const mir=ofx_opt(ofx_ch('mirror'),'모른 척 거품집을 짓는다');
  if(mir){
    ofx_text(mir,'l',()=>isSp('betta')?'모른 척 거품집을 짓는다':isSp('apisto')?'모른 척 굴 입구를 청소한다 (관심 없는 척)':'모른 척 돌 틈으로 들어간다 (관심 없는 척)');
    ofx_text(mir,'r',()=>isSp('betta')?'{n}은 수면에 거품을 하나씩 붙여 집을 지었다. 거울 속 녀석? 누구? 모르는데?':isSp('apisto')?'{n}은 굴 입구의 모래를 입으로 날라 치웠다. 바쁜 척이다. 아주 바쁜 척.':'{n}은 돌 틈으로 들어가 지느러미를 접었다. 안 보면 없는 거다.');
    ofx_text(mir,'m',()=>isSp('betta')?'수면에 거품집을 지었다. 혼자였지만.':'');
  }
  ofx_and(ofx_opt(ofx_ch('hand'),'손가락을 톡 쪼아 본다'),'when',ofx_surface);
  const sh=ofx_ch('shadow');
  if(sh){ofx_and(ofx_opt(sh,'수면 쪽으로 도망친다'),'when',ofx_jumper);
    sh.o.push({l:'바닥에 납작 붙어 움직이지 않는다 (나는 돌이다)',r:'{n}은 바닥에 몸을 붙이고 그림자가 지나가길 기다렸다. 돌이다. 지금은 돌이다.',c:'neutral',fx:()=>{S.f.stress+=.03}})}
  ofx_and(ofx_opt(ofx_ch('night'),'수면 가까이 떠서 잠든다'),'when',()=>!isSp('@bottom'));
  const run=ofx_opt(ofx_ch('net'),'있는 힘을 다해 달아난다');if(run)run.r='{n}이 수조 안을 이리저리 달아났다. 추격전이다. 비늘 몇 개가 떨어졌다.';
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
  const nc1=ofx_opt(nc,'모르는 척 내 할 일을 한다');if(nc1)nc1.l='새 물고기들에게 신경 쓰지 않는다 (쿨함)';
  const nc2=ofx_opt(nc,'내 영역에서 내쫓는다');if(nc2){nc2.l='영역 밖으로 내쫓는다 (텃세)';ofx_and(nc2,'need',ofx_terr)}
  /* fighting back: only a territorial fish stands its ground, and only a strong one makes the bully back off */
  const bf=ofx_opt(ofx_sit('g-bully'),'맞서 싸운다');
  if(bf){ofx_and(bf,'need',ofx_terr);bf.out[0][1]=()=>ofx_fighter()?'{n}이 맞서자 녀석이 물러났다. 일진 교체다.':'{n}이 지느러미를 세우고 버티자 녀석이 잠깐 방향을 틀었다. 이겼다! …다음 날 또 쫓아왔다.'}
  /* reflections */
  const ph=ofx_opt(ofx_sit('g-photo'),'렌즈에 비친 내 모습에 덤빈다');if(ph){ph.l='렌즈에 비친 제 모습에 덤빈다 (상대는 나)';ofx_and(ph,'need',ofx_mirror)}
  /* jumping and splashing */
  N('g-night','캄캄한 수면 위를 탐험한다',()=>!lidOpen()||ofx_jumper());
  N('g-badwater','수면 위로 뛰어올라 탈출한다',ofx_jumper);
  N('g-badwater','수면을 첨벙첨벙 친다',()=>ofx_big(10));
  N('g-lonely','수면을 첨벙거려 소리를 낸다',()=>ofx_big(10));
  /* bubble nests are a betta thing; an apisto spawns in a cave */
  N('g-mate','수면에 거품 둥지를 짓는다',()=>isSp('betta'));
  N('g-mate','평평한 돌을 깨끗이 닦는다',()=>!isSp('apisto'));
  /* labels in the first person, a quoted "그만" */
  const ng=ofx_opt(ofx_sit('g-night'),'이제부터가 내 시간이다');if(ng)ng.l='불이 꺼지자 은신처에서 나온다 (야행성)';
  const ov=ofx_opt(ofx_sit('g-overfeed'),'유리 앞에서 "그만"이라고 지느러미를 흔든다');if(ov)ov.l='유리 앞에서 지느러미를 크게 흔든다 (그만 줘)';
  /* hyperbole */
  const cw=ofx_opt(ofx_sit('g-coldwater'),'헤엄쳐서 몸을 데운다');if(cw)cw.out[0][1]='{n}은 쉬지 않고 헤엄쳤다. 조금 나았다. 물고기판 제자리 뛰기다.';
  const bn=ofx_opt(ofx_sit('g-brood'),'둥지를 부순다');if(bn)bn.out[0][1]='{n}이 둥지를 들이받아 거품을 흩뜨렸다. 집이 날아갔다. 수컷이 쉬지 않고 덤볐다. 당연하다.';
})();

/* ---------- crises ---------- */
(()=>{
  const C=(k,l)=>CRISIS[k]&&CRISIS[k].o.find(o=>ofx_val(o,'l')===l);
  const ea=C('eaten','정면으로 맞선다');
  if(ea){ofx_and(ea,'need',ofx_terr);ea.out[0][1]=()=>ofx_fighter()?'{n}이 덤비자 그림자가 움찔 물러났다. 덩치는 저쪽이 컸다. 깡은 이쪽이 컸다.':'{n}이 몸을 돌려 지느러미를 세우자 그림자가 한순간 멈칫했다. 허세 성공. 그 틈에 {n}은 바닥 틈으로 빠져나갔다.'}
  ofx_and(C('cat','앞발을 문다'),'need',ofx_biter);
  ofx_and(C('jump','힘껏 뛰어오른다'),'need',ofx_jumper);
  ofx_and(C('jump','벌레를 낚아채러 뛴다'),'need',ofx_jumper);
  ofx_and(C('squeeze','손가락을 문다'),'need',ofx_biter);
  const ik=C('intake','흡입구 망을 물고 버틴다');
  if(ik)ofx_text(ik,'l',()=>S&&S.sp&&isSp('pleco')?'흡입구 옆 유리에 입으로 달라붙는다 (빨판 파워)':S&&S.sp&&ofx_biter()?'흡입구 망을 물고 버틴다':'꼬리를 세차게 치며 버틴다 (전력 질주)');
  const ds=C('disease','마지막 힘으로 헤엄친다');if(ds)ds.out[0][1]='{n}은 수조를 한 바퀴 천천히 돌았다. 그리고 버텼다.';
})();

/* ---------- the schedule (TRAIN) ---------- */
(()=>{
  const tr=l=>TRAIN.find(t=>ofx_val(t,'l')===l);
  const mt=tr('유리에 비친 나와 싸운다');if(mt){mt.l='유리에 비친 제 모습과 싸운다 (영원한 무승부)';ofx_and(mt,'need',ofx_mirror)}
  ofx_and(tr('수면 위 세상을 구경한다'),'need',ofx_jumper);
  ofx_and(tr('영역 싸움에서 이기는 법을 익힌다'),'need',ofx_terr);
  ofx_and(tr('거품 둥지를 짓는 연습을 한다'),'need',()=>isSp('betta'));
  /* a school has no rank fights: the neon is pushed to the back instead of being bitten */
  const so=tr('같은 종과 어울린다');
  if(so&&so.fail[0]){const t0=so.fail[0][0];Object.defineProperty(so.fail[0],0,{get:()=>S&&S.sp&&!ofx_terr()&&!isSp('@gold','koi','@livebearer')?'무리 안에서 자리다툼에 밀렸다. {n}은 지느러미 끝이 해진 채 무리 맨 끝으로 밀려났다. 단체 사진 맨 끝자리다.':t0,enumerable:true,configurable:true})}
})();

/* ---------- everyday lines (FFL, FFL2, FFL3) ---------- */
(()=>{
  const byT=s=>FFL.find(e=>{const t=ofx_val(e,'t');return typeof t==='string'&&t.startsWith(s)});
  const byOnce=o=>FFL.find(e=>e.once===o);
  const noFarm=()=>!['farm','rare'].includes(brood())&&!isSp('arowana','gar','pleco');
  /* line breeding: what is being fixed depends on the fish; hormone-bred and pond-bred species are not bred at home */
  const ln=byOnce('line');
  if(ln){ofx_and(ln,'when',noFarm);
    ofx_text(ln,'t',()=>'주인이 {n}의 '+josa(isSp('koi')?'무늬':isSp('@longfin')?'지느러미 모양':'몸 색','을')+' 고정하려고 같은 핏줄끼리 짝을 지었다. "이게 브리딩이지!" 태어난 치어 중 절반은 등이 굽어 있었다.')}
  const rec=byT('주인이 번식 기록장에');
  if(rec){ofx_and(rec,'when',noFarm);
    ofx_text(rec,'t',()=>'주인이 번식 기록장에 {n}의 혈통과 '+BW().spawn+' 날짜를 적었다. 꼼꼼하다. 무섭게 꼼꼼하다. '+(isSp('betta')?'치어들은 한 마리씩 이름표가 붙은 컵으로 옮겨졌다. 컵 원룸 단지다.':'치어들은 크기별로 나뉜 수조로 옮겨졌다. 반 배정이다.'))}
  const mill=FFL.find(e=>ofx_val(e,'t')===undefined&&e.c==='bad'&&String(e.when).includes("own==='mill'")&&String(e.fx).includes('S.health-=4'));
  ofx_and(mill,'when',noFarm);
  ofx_and(byT('치어가 태어났습니다. 주인은 무늬가'),'when',noFarm);
  ofx_and(byT('{n}이 수면에 거품 둥지를 지었다'),'when',()=>isSp('betta'));
  ofx_and(byT('{n}이 유리에 비친 자기 모습을 쫓아'),'when',ofx_mirror);

  /* FFL3: the tyrant route only goes on to bite and kill for a fish that does that */
  const t1=byOnce('tyr1');
  if(t1)ofx_text(t1,'t',()=>ofx_terr()?'{n}이 수조에서 가장 좋은 자리를 차지했다. 다른 물고기가 가까이 오면 들이받아 쫓아냈다. 수조의 왕, 즉위.':'{n}이 먹이가 떨어지는 자리를 늘 먼저 차지했다. {n}이 지나가면 다른 물고기들이 길을 비켰다. 레드 카펫이다.');
  ofx_and(byOnce('tyr2'),'when',ofx_hostile);
  ofx_and(byOnce('tyr3'),'when',ofx_hostile);
  /* a finger in the mouth: teeth for a predator, a cichlid or a puffer; a goldfish or a koi only sucks */
  const fg=byOnce('finger');
  if(fg){ofx_and(fg,'when',()=>ofx_biter()||isSp('@gold','koi'));
    ofx_text(fg,'t',()=>isSp('@gold','koi')?'{n}이 먹이인 줄 알고 주인 손가락 끝을 입에 물고 빨았다. 이빨 없는 입이라 간지럽기만 했다. 그날부터 {n}은 손가락만 보면 달려들었고, 주인은 그걸 아주 좋아했다. 서로 오해 중이다.':'{n}이 먹이인 줄 알고 주인 손가락을 물었다. 주인은 "아야!" 하고 웃었다. 그날부터 {n}은 손가락만 보면 달려들었고, 주인은 그걸 좋아했다. 애정 표현이 아니다. 식욕이다.')}
  const mr=byOnce('mirror');
  if(mr){mr.when=()=>ofx_mirror()&&S.f.tank!=='pond'}
  ofx_and(byOnce('gen4'),'when',()=>fGroup('CICH'));
  /* surviving neglect: only a grazer lives on algae; the rest scavenge */
  const graze=()=>isSp('@gold','koi','pleco','platy','guppy');
  const s1=byOnce('surv1');
  if(s1)ofx_text(s1,'t',()=>'몇 달 동안 아무도 수조를 제대로 들여다보지 않았다. {n}은 '+(graze()?'이끼와 가라앉은 부스러기를 뜯어 먹으며':'바닥에 가라앉은 부스러기와 수조에 저절로 생긴 달팽이를 주워 먹으며')+' 오히려 몸이 불었다. 오랜만에 수조를 본 주인이 말했다. "얘 왜 이렇게 컸어?" 네가 안 봐서다.');
  const s2=byOnce('surv2');
  if(s2)ofx_text(s2,'t',()=>'사흘 동안 아무도 밥을 주지 않았다. {n}은 움직임을 줄이고 '+(graze()?'수조 벽의 이끼를 갉아 먹으며':'바닥에 남은 부스러기를 찾아 먹으며')+' 버텼다. 생존 예능 단독 출연이다.');
})();

/* ---------- in a Korean river (WILD_FLAV) ---------- */
(()=>{
  const W=s=>WILD_FLAV.find(f=>typeof f.t==='string'&&f.t.startsWith(s));
  ofx_and(W('밤이 되자 호숫가 덤불에서'),'when',()=>S.sp.g!=='fish');
  ofx_and(W('아이들이 뜰채로 {n}을 쫓았습니다'),'when',()=>!S.f||S.f.len<30);
  const big=W('{n}은 어느새 팔뚝만 하게 자랐습니다');
  if(big)big.t=()=>'{n}은 어느새 팔뚝만 하게 자랐다. '+(isSp('comet')?'주황색 비늘은':'화려하던 비늘 색은')+' 누렇게 바랬다. 이제 왜가리도 쉽게 못 덤빈다. 강의 거물이다.';
})();
