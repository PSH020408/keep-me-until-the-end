/* ---------- v0.20: absurd routes, Gintama style ----------
   The realistic catalogue stays. Next to it, a fish that trains hard enough can do things no fish should:
   · more fish are born in the wild, and a wild-caught fish escapes the net more often
   · a fish living wild trains (waterfall, heron, angler, otter dojo, the old crucian) and can become 하천의 왕,
     or go on to the sea as 세계관 최강자
   · a strong fish at home can push the lid off and reach the Han river (한강의 전설); a pond fish rides the
     monsoon out to the reservoir (저수지의 군주)
   · a strong fish can beat the house cat; the cat becomes its subordinate
   · a dozen deadpan gags with a narrator who knows it is a game
   Comedy here is labelled as such: tier 'likely' so it shows on both difficulties; nothing in this file is
   shown as fact. */

const gin_c=()=>S.f&&S.f.car;
const gin_g=o=>()=>{const c=gin_c();if(c){if(o.sp)c.sp+=o.sp;if(o.mood)c.mood=clamp(c.mood+o.mood,0,4);if(o.vit)c.vit=clamp(c.vit+o.vit,0,100);
  ['owner','mate','snail','mirror'].forEach(k=>{if(o[k])c.bond[k]=clamp(c.bond[k]+o[k],0,100)})}};
const gin_ok=(t,g,fx,extra)=>Object.assign({t,c:'good',fx:fx||{},run:gin_g(g||{})},extra||{});
const gin_bad=(t,g,fx,extra)=>Object.assign({t,c:'bad',fx:fx||{},run:gin_g(g||{})},extra||{});
const gin_need=(k,r)=>()=>['p','g','w','c'].includes(k)?[k,Math.max(6,Math.round(statCap(k)*r))]:null;
const gin_rel=k=>fst()[k]/statCap(k);
const gin_top=()=>Math.max(...['p','g','w','c'].map(gin_rel));
const gin_tank=()=>S.f&&S.f.tank!=='pond';

/* ---------- 1. more wild births, and the net is easier to slip ---------- */
/* species that used to come only from farms get a wild home too (where a wild or escaped population lives) */
const GIN_REGION={betta:'태국 중부의 논두렁 수로',guppy:'트리니다드의 산골 개울',platy:'멕시코 베라크루스의 늪',oranda:'누군가 풀어 준 금붕어들이 사는 시골 저수지',ryukin:'누군가 풀어 준 금붕어들이 사는 시골 저수지',
  comet:'시골 저수지',koi:'니가타의 계단식 논 옆 연못',fig8:'인도네시아의 기수 하구',peapuffer:'인도 케랄라의 강 하류'};
Object.keys(FX).forEach(id=>{const x=FX[id];if(!x.region)x.region=GIN_REGION[id]||(x.temp==='cold'?'어느 시골 저수지':'이름 모를 열대의 개울')});
(()=>{const _i=fishInit;fishInit=function(){_i();const f=S.f,x=fx_(),sp=S.sp;if(!f||f.wild)return;
  const p=x.pW>0?Math.max(x.pW,.6):x.fancy?.12:.3;
  if(R()<p-(x.pW||0)){f.wild=true;f.capAge=clamp(sp.life*.06,.2,18);if(sp.id==='arowana')f.capAge=.15;if(sp.id==='clownloach')f.capAge=3;f.ginWild=1;f.track='wild';S.env='wildriver';S.status=PRO_TRACK.wild.l}}})();

/* ---------- 2. living wild: training in the river ---------- */
/* what the training buys: a fish that has trained in the river shrugs off a wild death now and then (at most three times) */
const GIN_NOSAVE=['natural','euth','free','apex'];
const gin_save=()=>{const wk=fl('wk')||0;if(!S.wild||S.ending||(wk<1&&!S.f.native)||(fl('wsave')||0)>=3||S.ageM/S.sp.life>.92)return false;
  if(R()>=Math.min(.7,(S.f.native?.35:.2)+.1*wk))return false;
  addFl('wsave');S.health=Math.max(S.health,30);S.f.stress=Math.max(0,S.f.stress-.2);
  addLog(T(pick(['★ 수련의 성과! 폭포에서 단련한 몸이 {n}을 붙잡았습니다. {n}은 비틀거리며 다시 헤엄쳤습니다.','★ 수련의 성과! {n}은 붕어 영감의 가르침대로 진흙 속에 몸을 묻고 그 밤을 넘겼습니다.','★ 수련의 성과! 죽을 뻔했습니다. 수련 덕분에 "죽을 뻔"에서 멈췄습니다.'])),'star');return true};
(()=>{const _e=fEnd;fEnd=function(key,arg){if(!GIN_NOSAVE.includes(key)&&gin_save())return;return _e(key,arg)}})();
(()=>{const _f=fevFinish;fevFinish=function(ref){const id=typeof ref==='string'?ref:ref&&ref.id,E=typeof ref==='string'?FEVEND[ref]:ref;
  if(E&&E.kind==='bad'&&!/^GIN-/.test(id||'')&&gin_save())return;return _f(ref)}})();

/* beating 블랙 ends the life as 하천의 왕, unless the fish is strong enough to want more (then: the sea) */
const gin_king=()=>fl('wk')>=5&&gin_top()>=.6&&R()<.45?{t:'{n}은 블랙을 하류로 날려 보냈습니다. 강의 물고기들이 지느러미를 두드렸습니다. 왕좌에 앉았습니다. 그런데 강이 좁아 보였습니다.',c:'star',set:{river_king:1},fx:{p:3,g:3},mem:'블랙을 이겼다. 강이 좁아 보였다.'}:{end:'GIN-WK-H'};
fev([
 {id:'GIN-W1',stage:'wild',tier:'likely',cd:6,w:4,
  log:'상류에 폭포가 있습니다. 높이는 {n} 몸길이의 마흔 배쯤 됩니다. 강의 물고기들은 그 폭포를 "저승 계단"이라고 부릅니다. 아무도 그렇게 부르라고 한 적은 없습니다.',
  p:'폭포 아래 소용돌이가 몸을 잡아당깁니다. 위에서 떨어지는 물이 등을 때립니다. {n}은…',
  o:[{l:'거꾸로 오른다. 오늘은 오른다',chk:gin_need('p',.45),ok:gin_ok('{n}은 폭포를 세 번째 바위까지 올랐습니다. 네 번째 바위에서 떨어졌지만, 떨어지는 폼이 좋았습니다. (힘 ↑)',{},{p:4,h:-4},{add:{wk:1}}),
     no:gin_bad('{n}은 첫 번째 바위에서 튕겨 나와 소용돌이 속을 열두 바퀴 돌았습니다. 수련의 길은 멉니다.',{},{h:-8,p:1})},
   {l:'폭포 소리를 들으며 명상한다',chk:gin_need('g',.4),ok:gin_ok('{n}은 폭포 아래에서 반나절을 버텼습니다. 깨달은 것은 없었지만 비늘이 단단해졌습니다. (근성 ↑)',{},{g:4,st:-.05},{add:{wk:1}}),
     no:gin_bad('명상 3분 만에 잠들었고, 떠내려갔습니다.',{},{h:-3})},
   {l:'폭포는 폭포고, 오늘은 쉰다',ok:{t:'{n}은 폭포를 등지고 하류에서 장구벌레를 먹었습니다. 합리적인 판단이었습니다.',c:'sub',fx:{h:3}}}]},
 {id:'GIN-W2',stage:'wild',tier:'likely',cd:8,w:3,
  log:'얕은 여울에 왜가리 한 마리가 서 있습니다. 왜가리는 움직이지 않습니다. 이십 분째입니다. 이것은 눈싸움입니다. 적어도 {n}은 그렇게 받아들였습니다.',
  p:'왜가리의 노란 눈이 수면을 봅니다. 부리 끝이 아주 조금 내려옵니다. {n}은…',
  o:[{l:'눈을 피하지 않는다',chk:gin_need('w',.45),ok:gin_ok('사십 분 뒤, 왜가리가 먼저 고개를 돌리고 날아갔습니다. 아마 그냥 배가 불렀던 것 같지만, {n}은 이겼다고 생각했습니다. (지능 ↑)',{},{w:4},{add:{wk:1}}),
     no:()=>R()<.25?{end:'GIN-W2-D'}:gin_bad('부리가 수면을 찔렀습니다. {n}은 비늘 세 장을 내주고 돌 밑으로 숨었습니다. 눈싸움은 패배였습니다.',{},{h:-12})},
   {l:'돌 밑에 숨어 왜가리가 갈 때까지 기다린다',ok:{t:'{n}은 돌 밑에서 두 시간을 보냈습니다. 왜가리는 다른 물고기를 먹고 갔습니다.',c:'sub'}}]},
 {id:'GIN-W3',stage:'wild',tier:'likely',cd:8,w:3,
  log:'다리 위에 낚시꾼이 앉았습니다. 낚싯대가 세 대입니다. 아이스박스에는 "오늘은 손맛"이라고 적혀 있습니다.',
  p:'지렁이가 바늘에 꿰인 채 눈앞에서 흔들립니다. {n}은…',
  o:[{l:'바늘은 건드리지 않고 지렁이만 갉아 먹는다',chk:gin_need('w',.5),ok:gin_ok('낚시꾼은 세 시간 동안 빈 바늘만 열일곱 번 올렸습니다. "이 강에 뭐가 살아." 살고 있었습니다. {n}이. (지능 ↑)',{},{w:4,h:4},{add:{wk:1}}),
     no:()=>R()<.3?{end:'GIN-W3-D'}:gin_bad('입술에 바늘이 걸렸다가 찢어지며 빠졌습니다. {n}은 그날 이후 지렁이를 보면 이를 갑니다. 물고기에게 이가 있는지는 종마다 다릅니다.',{},{h:-10})},
   {l:'지렁이를 무시한다',ok:{t:'{n}은 지렁이 앞을 세 번 지나갔습니다. 세 번 다 참았습니다.',c:'sub',fx:{g:1}}}]},
 {id:'GIN-W4',stage:'wild',tier:'likely',cd:10,w:2.5,when:()=>fl('wk')>=1,
  log:'강 하류의 바위굴에 수달 가족이 삽니다. 동네 물고기들은 그 굴을 "도장"이라고 부릅니다. 들어간 물고기 중 나온 물고기는 없다고 합니다. 소문입니다.',
  p:'굴 입구에서 새끼 수달 두 마리가 장난을 치고 있습니다. {n}은…',
  o:[{l:'도장 깨기. 새끼들 사이를 정면으로 통과한다',chk:gin_need('g',.55),ok:gin_ok('{n}은 새끼 수달의 앞발 사이를 세 번 빠져나갔습니다. 새끼들은 울면서 엄마를 불렀습니다. {n}은 엄마가 오기 전에 떠났습니다. 도장 깨기 성공. (근성 ↑ 힘 ↑)',{},{g:4,p:2},{add:{wk:2}}),
     no:()=>R()<.35?{end:'GIN-W4-D'}:gin_bad('새끼 수달이 {n}을 장난감처럼 굴리다 놓쳤습니다. {n}은 꼬리지느러미 반을 도장에 기부하고 돌아왔습니다.',{},{h:-18,fin:.3})},
   {l:'도장 앞에 인사만 하고 지나간다',ok:{t:'{n}은 굴 앞에서 지느러미를 한 번 접었다 폈습니다. 인사였습니다. 수달은 못 봤습니다.',c:'sub'}}]},
 {id:'GIN-W5',stage:'wild',tier:'likely',once:1,w:3,when:()=>fl('wk')>=1,
  log:'저수지 바닥에 늙은 붕어가 삽니다. 비늘 반이 하얗게 셌습니다. 동네에서는 "붕어 영감"이라고 부릅니다. 영감은 사십 년째 이 저수지에서 한 번도 잡힌 적이 없다고 합니다. 붕어의 수명을 생각하면 거짓말입니다.',
  p:'붕어 영감이 {n}을 한참 봅니다. 그리고 진흙 속으로 들어가며 꼬리를 한 번 칩니다. 따라오라는 뜻 같습니다. {n}은…',
  o:[{l:'따라간다. 비전을 배운다',chk:gin_need('c',.35),ok:gin_ok('영감은 일주일 동안 {n}에게 진흙 속에 숨는 법, 그물 그림자를 읽는 법, 낚싯줄 냄새를 맡는 법을 보여 줬습니다. 말은 한 마디도 안 했습니다. 붕어니까요. (지능 ↑ 근성 ↑)',{},{w:3,g:3},{add:{wk:2},mem:'붕어 영감에게 배웠다. 말은 없었다.'}),
     no:gin_bad('영감은 진흙 속으로 사라졌고, 다시 나오지 않았습니다. {n}은 진흙만 잔뜩 먹었습니다.',{},{h:-3})},
   {l:'늙은이의 꼬리 따위',ok:{t:'{n}은 따라가지 않았습니다. 영감은 진흙 속에서 한숨을 쉬었습니다. 붕어가 한숨을 쉬는지는 확인되지 않았습니다.',c:'sub'}}]},
 {id:'GIN-W6',stage:'wild',tier:'likely',cd:14,w:2.5,need:{season:'summer'},
  log:'장마입니다. 강물이 흙색으로 불어 둑 끝까지 차올랐습니다. 떠내려오는 것: 나뭇가지, 슬리퍼 한 짝, 수박 한 통, 그리고 누군가의 축구공.',
  p:'물살이 평소의 다섯 배입니다. {n}은…',
  o:[{l:'수박을 타고 홍수를 서핑한다',chk:gin_need('p',.5),ok:gin_ok('{n}은 수박 꼭지 옆에 붙어 하류 3킬로미터를 내려갔습니다. 다리 위 사람들이 "수박이 헤엄친다"며 사진을 찍었습니다. (힘 ↑)',{},{p:4,h:-4},{add:{wk:1}}),
     no:gin_bad('수박이 돌았습니다. {n}도 돌았습니다. 둘 다 둑에 부딪혔고, 수박만 깨졌습니다.',{},{h:-14})},
   {l:'바닥 돌 틈에 몸을 박고 버틴다',chk:gin_need('g',.4),ok:gin_ok('사흘 뒤 물이 빠졌습니다. 강의 지형이 바뀌었고, {n}은 그대로였습니다. (근성 ↑)',{},{g:3},{add:{wk:1}}),
     no:gin_bad('{n}은 돌 틈에서 빠져나와 논두렁까지 떠밀렸습니다. 사흘 동안 논에서 우렁이와 지냈습니다.',{},{h:-8})},
   {l:'떠내려오는 슬리퍼 안으로 들어간다',ok:{t:'{n}은 슬리퍼 안에서 사흘을 보냈습니다. 슬리퍼는 하류의 모래톱에 걸렸고, {n}은 무사했습니다. 슬리퍼의 주인은 끝내 나타나지 않았습니다.',c:'sub',fx:{h:-2}}}]},
 /* the climax: the river's strongest */
 {id:'GIN-WK',stage:'wild',tier:'likely',once:1,w:10,when:()=>fl('wk')>=3&&gin_top()>=.42,
  log:'하천 생태계에 소문이 돌았습니다. "상류에서 내려온 놈이 폭포를 오르고 수달 도장을 깼다." 소문을 들은 배스 대장 블랙(53cm, 전과 다수)이 {n}을 찾아왔습니다.',
  p:'블랙의 입이 {n}의 몸통보다 큽니다. 주변 물고기들이 바위 뒤에서 구경합니다. 누군가 자갈로 박자를 맞춥니다. {n}은…',
  o:[{l:'정면 돌파. 필살 「저승 계단 역류」',chk:gin_need('p',.5),ok:()=>gin_king(),no:()=>R()<.5?{end:'GIN-WK-D'}:gin_bad('블랙의 꼬리에 맞아 {n}은 여울 끝까지 날아갔습니다. 살았습니다. 명예는 잃었습니다.',{},{h:-25},{add:{wk:-2}})},
   {l:'블랙의 입 안으로 들어갔다가 아가미로 빠져나온다',chk:gin_need('w',.55),ok:()=>gin_king(),no:{end:'GIN-WK-D'}},
   {l:'"오늘은 컨디션이…" 하고 돌 밑으로 간다',ok:{t:'{n}은 돌 밑으로 갔습니다. 블랙은 "겁쟁이"라고 했습니다. 물고기가 말을 하는지는 종마다 다릅니다.',c:'sub',fx:{st:.1}}}]}
]);
/* a king strong enough does not stop at the river: one more step, to the sea */
fev([{id:'GIN-SEA',stage:'wild',tier:'likely',once:1,w:5,when:()=>fl('river_king')&&gin_top()>=.65,
  log:'강의 물고기들이 {n}을 "형님"이라고 부르기 시작했습니다. 형님은 심심했습니다. 강이 좁았습니다. 하류 끝에 짠물 냄새가 났습니다.',
  p:'민물고기는 바닷물에서 살 수 없습니다. 삼투압 때문입니다. 이건 과학입니다. {n}은…',
  o:[{l:'삼투압은 근성으로 버틴다',chk:gin_need('g',.75),ok:{end:'GIN-SEA-H'},no:{end:'GIN-SEA-D'}},
   {l:'과학을 존중하고 강에 남는다',ok:{t:'{n}은 하구에서 돌아섰습니다. 현명했습니다. 이 게임에서 몇 안 되는 현명한 선택이었습니다.',c:'good',fx:{w:2}}}]}]);

/* ---------- 3. at home: the lid, the cat ---------- */
fev([
 {id:'GIN-ESC',stage:'home',tier:'likely',once:1,w:1.6,when:()=>gin_tank()&&gin_rel('p')>=.55&&(gin_c()?gin_c().turn>=8:true),
  log:'새벽 세 시. 주인은 자고 있습니다. 수조 뚜껑과 유리 사이에 손가락 하나만 한 틈이 있습니다. {n}은 몇 주째 그 틈을 보고 있었습니다.',
  p:'힘은 충분합니다. 바닥에는 수건이 깔려 있고, 수건 너머는 거실, 거실 너머는 화장실, 화장실 너머는… 이론상 한강입니다. {n}은…',
  o:[{l:'간다. 세계는 넓다',chk:gin_need('p',.65),ok:{end:'GIN-ESC-H'},no:()=>R()<.6?{end:'GIN-ESC-D'}:gin_bad('{n}은 뚜껑을 밀어 올리다 다시 물로 떨어졌습니다. 아침에 주인은 뚜껑이 삐뚤어진 걸 보고 "지진 났었나" 했습니다.',{},{h:-6})},
   {l:'아직 때가 아니다',ok:{t:'{n}은 틈을 한 번 더 보고 수초 그늘로 돌아갔습니다. 이 결정이 맞았는지는 아무도 모릅니다.',c:'sub',fx:{g:1}}}]},
 {id:'GIN-POND',stage:'home',tier:'likely',once:1,w:2,need:{season:'summer'},when:()=>S.f.tank==='pond'&&gin_top()>=.5,
  log:'장마가 닷새째입니다. 마당 연못의 물이 테두리 돌 위로 넘치기 시작했습니다. 넘친 물은 배수로로, 배수로는 논으로, 논은 저수지로 이어집니다.',
  p:'연못 밖으로 이어지는 물길이 오늘 밤에만 열려 있습니다. {n}은…',
  o:[{l:'물길을 탄다',chk:gin_need('g',.55),ok:{end:'GIN-POND-H'},no:()=>R()<.6?{end:'GIN-POND-D'}:gin_bad('{n}은 배수로 입구까지 갔다가 물이 빠지면서 연못으로 돌아왔습니다. 주인은 아침에 연못 물이 줄어든 것만 걱정했습니다.',{},{h:-5})},
   {l:'연못에 남는다',ok:{t:'{n}은 연못 바닥에서 비가 그치기를 기다렸습니다.',c:'sub'}}]},
 {id:'GIN-CAT',stage:'home',tier:'likely',once:1,w:3,when:()=>S.f.cat&&gin_top()>=.5,
  log:'집 고양이 「대장」이 오늘도 수조 위에 올라앉았습니다. 앞발 하나를 수면에 담그고 휘휘 젓습니다. 매일 하는 일입니다. 오늘은 {n}이 피하지 않았습니다.',
  p:'고양이 앞발이 코앞에서 물을 가릅니다. 이것은 결투입니다. 고양이는 모릅니다. {n}은…',
  o:[{l:'앞발을 정면으로 들이받는다',chk:gin_need('p',.6),ok:gin_ok('퍽. 대장은 수조에서 굴러떨어져 소파 뒤로 사라졌습니다. 다음 날부터 대장은 수조 앞을 지날 때 고개를 숙입니다. 고양이를 부하로 얻었습니다.',{sp:15,mood:2},{p:3},{set:{catboss:1},mem:'고양이를 이겼다. 대장은 이제 내 부하다.'}),
     no:()=>R()<.35?{end:'GIN-CAT-D'}:gin_bad('{n}의 박치기는 발톱에 빗나갔습니다. 대장은 하품을 하고 내려갔습니다. 패배보다 무시가 더 아팠습니다.',{mood:-1},{h:-8})},
   {l:'눈싸움을 건다',chk:gin_need('w',.6),ok:gin_ok('삼십 분 동안 아무도 움직이지 않았습니다. 대장이 먼저 졸았습니다. 졸다가 수조에 머리를 박고 도망갔습니다. 고양이를 부하로 얻었습니다.',{sp:15,mood:2},{w:3},{set:{catboss:1},mem:'고양이를 이겼다. 대장은 이제 내 부하다.'}),
     no:gin_bad('{n}이 먼저 눈을 피했습니다. 물고기는 눈꺼풀이 없어서 눈을 피하는 방법이 몸을 돌리는 것밖에 없습니다. 몸을 돌렸습니다.',{mood:-1})},
   {l:'애교로 포섭한다',chk:gin_need('c',.6),ok:gin_ok('{n}이 유리 앞에서 지느러미를 흔들자 대장이 골골 소리를 냈습니다. 그날 밤부터 대장은 수조 옆에서 잡니다. 경비병이 생겼습니다.',{sp:12,mood:2},{c:3},{set:{catboss:1},mem:'고양이와 친구가 됐다. 아니, 부하다.'}),
     no:gin_bad('대장은 애교를 사냥 신호로 받아들였습니다. {n}은 수초 뒤에서 하루를 보냈습니다.',{mood:-1},{st:.1})},
   {l:'바닥으로 피한다',ok:{t:'{n}은 바닥으로 피했습니다. 대장은 오늘도 이겼다고 생각했습니다.',c:'sub'}}]},
 {id:'GIN-CAT2',stage:'home',tier:'likely',cd:40,w:1.5,when:()=>fl('catboss')&&gin_tank(),
  log:'부하 고양이 「대장」이 오늘도 보고를 하러 왔습니다. 입에 뭔가를 물고 있습니다.',
  p:'대장이 수조 앞에 공물을 내려놓습니다. 바퀴벌레입니다. {n}은…',
  o:[{l:'공물을 치하한다 (지느러미를 펴 준다)',ok:gin_ok('대장은 만족한 얼굴로 돌아갔습니다. 주인은 바닥의 바퀴벌레를 보고 비명을 질렀습니다. 대장은 주인에게는 아무것도 바치지 않습니다.',{sp:6,mood:1})},
   {l:'"다음엔 주인 간식을 가져와라"',chk:gin_need('w',.5),ok:gin_ok('다음 날 수조 앞에 주인의 육포가 놓여 있었습니다. 주인은 육포를 찾느라 한 시간을 썼습니다.',{sp:8,mood:1},{},{fx:{i:-.03}}),
     no:{t:'대장은 알아듣지 못했습니다. 다음 날도 바퀴벌레였습니다.',c:'sub'}}]}
]);

/* ---------- 4. the narrator knows ---------- */
fev([
 {id:'GIN-01',stage:'home',tier:'likely',once:1,w:1,
  log:'오늘은 이벤트가 없습니다. 개발자가 이 사건을 쓰다가 잠들었기 때문입니다.',
  p:'선택지가 하나뿐입니다. 죄송합니다. {n}은…',
  o:[{l:'그래도 고른다',ok:gin_ok('{n}은 하나뿐인 선택지를 골랐습니다. 성실함을 인정받아 SP를 받았습니다. 어디서 주는지는 묻지 마세요.',{sp:10})}]},
 {id:'GIN-02',stage:'home',tier:'likely',once:1,w:1,
  log:'갑자기 화면이 흑백이 되고 잔잔한 피아노가 흐릅니다. 회상 장면입니다. "그때 {n}은 아직 어렸다…"',
  p:'회상할 과거가 생후 넉 달밖에 없습니다. {n}은…',
  o:[{l:'넉 달을 성실하게 회상한다',ok:gin_ok('회상은 11초 만에 끝났습니다. 피아노도 머쓱하게 멈췄습니다. 그래도 {n}은 조금 성숙해졌습니다.',{mood:1},{g:1})},
   {l:'남의 회상을 빌려 온다 (옆 수조 금붕어 것)',chk:gin_need('w',.4),ok:gin_ok('옆 수조 금붕어의 회상은 3초였습니다. 금붕어의 기억력은 3초라는 말은 사실이 아닙니다. 이 금붕어만 그랬습니다.',{mood:1},{w:1}),
     no:{t:'남의 회상은 저작권 문제로 재생되지 않았습니다.',c:'sub'}}]},
 {id:'GIN-03',stage:'home',tier:'likely',once:1,w:1,
  log:'주인이 먹이를 주면서 휴대폰으로 장엄한 전투 음악을 틀었습니다. 합창단이 라틴어로 무언가를 외칩니다.',
  p:'먹이 세 알이 천천히 가라앉습니다. 슬로모션처럼 보입니다. 음악 탓입니다. {n}은…',
  o:[{l:'음악에 맞춰 각성한 척 먹이를 낚아챈다',chk:gin_need('c',.4),ok:gin_ok('주인이 영상을 올렸고, 조회수가 4만이 나왔습니다. 댓글 1위는 "물고기 2기 언제 나옴"이었습니다.',{sp:8,owner:8,mood:1},{c:2}),
     no:gin_bad('{n}이 각성하는 순간 광고가 나왔습니다. 음악이 끊긴 수조에서 {n}은 먹이를 놓쳤습니다.',{mood:-1})},
   {l:'평소처럼 먹는다',ok:{t:'음악이 너무 장엄해서 평범하게 먹는 {n}이 오히려 웃겼습니다. 주인은 웃다가 먹이를 한 숟갈 더 쏟았습니다.',c:'sub',fx:{fat:.1}}}]},
 {id:'GIN-04',stage:'home',tier:'likely',once:1,w:1.2,when:()=>gin_tank(),
  log:'수조 달팽이 「느림보」가 수조 왼쪽 절반의 독립을 선언했습니다. 국호는 「느림보 공화국」. 국경선은 유리에 낀 이끼 자국입니다.',
  p:'공화국 국경을 넘으면 「느림보」가 촉수를 접고 노려봅니다. 아주 천천히. {n}은…',
  o:[{l:'외교 협상을 한다',chk:gin_need('w',.4),ok:gin_ok('사흘간의 협상 끝에 「느림보」는 이끼 50% 양보를 조건으로 {n}의 통행권을 인정했습니다. 협상 내내 「느림보」는 3cm 움직였습니다.',{sp:8,snail:15},{w:2}),
     no:{t:'협상은 결렬됐습니다. 「느림보」는 다음 날 이 일을 잊었습니다.',c:'sub'}},
   {l:'무력으로 병합한다',chk:gin_need('p',.4),ok:gin_ok('공화국은 2분 만에 멸망했습니다. 「느림보」는 껍데기 속에서 망명 정부를 세웠습니다.',{sp:6,snail:-10},{p:2}),
     no:{t:'{n}이 들이받자 「느림보」가 껍데기를 닫았습니다. 단단했습니다. {n}의 코가 아팠습니다.',c:'bad',fx:{h:-3}}},
   {l:'국경을 존중한다',ok:gin_ok('{n}은 오른쪽 절반에서만 살았습니다. 평화는 언제나 조금 좁습니다.',{snail:8})}]},
 {id:'GIN-05',stage:'home',tier:'likely',once:1,w:1,
  log:'새벽 한 시. 주인이 수조 앞에 쭈그리고 앉아 맥주를 땄습니다. "야… 나 고백할까 말까."',
  p:'주인은 진지합니다. 대상은 회사 옆자리 사람이라고 합니다. {n}은…',
  o:[{l:'수면으로 올라와 뻐끔(=해라)',ok:()=>R()<.5?gin_ok('주인은 고백했고, 성공했습니다. 다음 주말 그 사람이 {n}을 보러 왔습니다. "얘가 그 물고기야?" {n}은 큐피드로 기록되었습니다.',{sp:10,owner:15,mood:2},{},{fx:{i:.08}}):gin_bad('주인은 고백했고, 차였습니다. 그 뒤로 일주일 동안 먹이가 늦게 나왔습니다. 물고기의 연애 상담에는 책임이 따릅니다.',{owner:-5,mood:-1},{},{fx:{i:-.08}})},
   {l:'바닥으로 내려간다 (=하지 마라)',ok:gin_ok('주인은 고백하지 않았습니다. 석 달 뒤 그 사람은 퇴사했습니다. 주인은 가끔 {n}을 원망스럽게 봅니다.',{owner:-3})}]},
 {id:'GIN-06',stage:'home',tier:'likely',once:1,w:1,when:()=>(S.f.fame||0)>=1||(gin_c()&&gin_c().wins>=1),
  log:'택배가 왔습니다. 주인이 주문한 것은 {n}의 얼굴이 인쇄된 머그컵, 쿠션, 그리고 실물 크기 인형입니다. 실물 크기라서 손가락만 합니다.',
  p:'인형이 수조 옆에 놓였습니다. 인형과 {n}이 마주 봅니다. {n}은…',
  o:[{l:'인형과 똑같은 자세를 취한다',chk:gin_need('c',.5),ok:gin_ok('주인은 어느 쪽이 진짜인지 몰라서 인형에 먹이를 줄 뻔했습니다. 사진은 SNS에서 "숨은 물고기 찾기"로 퍼졌습니다.',{sp:8,owner:6,mood:1},{c:2}),
     no:{t:'{n}은 인형보다 못생기게 나왔습니다. 굿즈는 원작을 이깁니다.',c:'sub'}},
   {l:'인형을 라이벌로 인정한다',ok:gin_ok('{n}은 그날부터 인형을 볼 때마다 훈련을 했습니다. 인형은 아무것도 하지 않았습니다. 그래도 이겼다고는 할 수 없습니다.',{mood:1},{p:1,g:1})}]},
 {id:'GIN-07',stage:'home',tier:'likely',once:1,w:1,
  log:'주인이 TV로 낚시 프로그램을 봅니다. 화면 속 사람이 커다란 물고기를 들어 올리며 웃습니다. 수조는 TV 정면에 있습니다.',
  p:'{n}은 그 장면을 처음부터 끝까지 봤습니다. {n}은…',
  o:[{l:'적의 수법을 연구한다',chk:gin_need('w',.35),ok:gin_ok('{n}은 루어의 움직임, 바늘의 모양, 낚싯줄의 반짝임을 외웠습니다. 쓸 일은 없겠지만, 지식은 힘입니다. (지능 ↑)',{sp:6},{w:3}),
     no:{t:'{n}은 광고에 나온 치킨을 더 오래 봤습니다.',c:'sub'}},
   {l:'충격받고 수초 뒤로 숨는다',ok:gin_ok('주인은 채널을 돌렸습니다. 다음 채널은 회 뜨는 법이었습니다. 주인은 TV를 껐습니다.',{owner:4},{},{fx:{st:.05}})}]},
 {id:'GIN-08',stage:'home',tier:'likely',cd:60,w:1,need:{season:'summer'},
  log:'여름밤, 모기 한 마리가 수면에 내려앉았습니다. 주인은 그 모기에게 이미 일곱 방을 물렸습니다.',
  p:'모기는 수면에 다리를 딛고 쉬고 있습니다. 주인이 "잡아!"라고 외칩니다. {n}은…',
  o:[{l:'수면 위로 솟구쳐 잡는다',chk:gin_need('p',.45),ok:gin_ok('철썩. 모기는 사라졌고 주인은 박수를 쳤습니다. {n}은 그날부터 「모기 사냥꾼」으로 불립니다. (힘 ↑)',{sp:8,owner:8,mood:1},{p:2}),
     no:gin_bad('{n}은 모기를 놓치고 수조 뚜껑에 머리를 박았습니다. 모기는 주인을 한 번 더 물고 갔습니다.',{owner:-2},{h:-4})},
   {l:'모기는 모기고, 나는 물고기다',ok:{t:'모기는 날아가 주인의 발목을 물었습니다. {n}은 아무 잘못이 없습니다.',c:'sub'}}]},
 {id:'GIN-09',stage:'home',tier:'likely',once:1,w:1.2,when:()=>S.f.mates&&S.f.mates.some(m=>m.n>0),
  log:'합사어들이 수조 구석에 모여 회의를 하고 있습니다. 안건은 「{n} 퇴출의 건」입니다. 이유: 먹이를 너무 잘 먹음, 주인의 사랑을 독차지함, 잘난 척함.',
  p:'회의장에 {n}이 들어섭니다. 모두가 조용해집니다. {n}은…',
  o:[{l:'연설한다',chk:gin_need('c',.5),ok:gin_ok('{n}의 연설은 7분이었습니다. 끝났을 때 합사어들은 {n}을 대표로 추대했습니다. 첫 번째 안건은 「먹이 분배의 건」이었고, {n}이 제일 많이 먹기로 했습니다.',{sp:10,mate:15,mood:1},{c:2}),
     no:gin_bad('연설 도중 {n}이 먹이 떨어지는 소리에 뛰쳐나갔습니다. 퇴출안은 만장일치로 통과됐습니다. 집행은 하지 않았습니다. 수조가 하나라서요.',{mate:-8,mood:-1})},
   {l:'회의장을 힘으로 해산시킨다',chk:gin_need('p',.5),ok:gin_ok('{n}이 한 바퀴 돌자 회의는 끝났습니다. 민주주의는 오늘 수조에서 졌습니다.',{sp:6,mate:-5},{p:2}),
     no:{t:'합사어들이 동시에 {n}을 쳐다봤습니다. {n}은 조용히 나갔습니다.',c:'sub',fx:{st:.06}}},
   {l:'회의에 참석해 조용히 찬성표를 던진다',ok:{t:'{n}은 자기 퇴출안에 찬성했습니다. 회의장이 술렁였습니다. 아무도 집행 방법을 몰라 안건은 보류되었습니다.',c:'sub'}}]},
 {id:'GIN-10',stage:'home',tier:'likely',once:1,w:1,when:()=>gin_c()&&gin_c().turn>=4,
  log:'훈련을 하다 보니 {n}에게 필살기가 생겼습니다. 아직 이름이 없습니다.',
  p:'이름 없는 필살기는 필살기가 아닙니다. 주인이 수조 앞에서 후보를 부릅니다. {n}은…',
  o:[{l:'「심해 일격 · 극」을 고른다',ok:gin_ok('주인은 그날부터 먹이를 줄 때마다 "심해 일격 · 극!"을 외칩니다. 이웃이 한 번 신고했습니다.',{sp:8,owner:6,mood:1},{p:1})},
   {l:'「수조 뒤집기」를 고른다',ok:gin_ok('이름이 너무 정직해서 주인이 불안해졌습니다. 수조 뚜껑에 클립이 하나 더 생겼습니다.',{sp:6},{},{fx:{i:.03}})},
   {l:'「뻐끔」을 고른다',ok:gin_ok('가장 강한 필살기는 가장 짧은 이름을 가진다고 합니다. 아무도 그렇게 말한 적은 없습니다.',{sp:8,mood:2},{g:1})}]},
 {id:'GIN-11',stage:'home',tier:'likely',once:1,w:1,when:()=>gin_c()&&gin_c().bond&&gin_c().bond.mirror>=10,
  log:'유리에 비친 「유리 속의 나」가 오늘따라 다르게 움직입니다. 0.5초 늦게. 평행세계의 {n}입니다. 아마도. 아니면 유리에 물때가 낀 겁니다.',
  p:'평행세계의 {n}이 지느러미로 도발합니다. {n}은…',
  o:[{l:'평행세계와 결투한다',chk:gin_need('g',.5),ok:gin_ok('결투는 무승부였습니다. 둘은 서로를 인정했습니다. 주인은 물고기가 유리를 사십 분째 들이받는 걸 보고 물때를 닦았습니다. 평행세계는 닫혔습니다.',{sp:10,mirror:20,mood:1},{g:2}),
     no:gin_bad('{n}이 졌습니다. 0.5초 늦은 쪽이 이겼습니다. 이해할 수 없는 패배였습니다.',{mirror:5,mood:-1})},
   {l:'"너도 고생이 많다"',ok:gin_ok('평행세계의 {n}이 고개를 끄덕였습니다. 0.5초 늦게.',{mirror:12,mood:1})}]},
 {id:'GIN-12',stage:'home',tier:'likely',once:1,w:.8,
  log:'주인 친구가 놀러 와서 수조를 보더니 말했습니다. "이거 매운탕 하면 몇 인분 나와?"',
  p:'방 안이 조용해집니다. 주인이 친구를 봅니다. {n}도 친구를 봅니다. {n}은…',
  o:[{l:'친구에게 정면으로 물을 튀긴다',chk:gin_need('p',.4),ok:gin_ok('친구의 안경에 물이 튀었습니다. 주인은 "얘가 알아들어"라며 웃었고, 친구는 그날 이후 {n}에게 존댓말을 씁니다.',{sp:8,owner:8,mood:1},{p:1}),
     no:{t:'물은 주인 얼굴에 튀었습니다. 주인은 "왜 나야"라고 했습니다.',c:'sub'}},
   {l:'몸을 최대한 작게 웅크린다 (0.5인분 연기)',chk:gin_need('w',.4),ok:gin_ok('친구는 "에이, 반 인분도 안 나오겠네"라며 흥미를 잃었습니다. 연기력의 승리입니다.',{sp:6},{w:1}),no:{t:'{n}은 웅크렸지만 여전히 1인분이었습니다.',c:'sub'}},
   {l:'못 들은 척한다',ok:{t:'주인이 친구의 등을 한 대 쳤습니다. 그날 저녁 메뉴는 매운탕이 아니었습니다.',c:'sub'}}]}
]);

/* ---------- endings ---------- */
fevEnd({
 'GIN-WK-H':{kind:'happy',cat:'하천의 왕',tier:'likely',fx:'f-home',
  l:()=>['{n}은 블랙의 턱 밑으로 파고들어 꼬리로 아가미 뚜껑을 쳤습니다. 블랙이 처음으로 뒤로 물러났습니다.','구경하던 물고기들이 지느러미를 두드렸습니다. 자갈 박자가 빨라졌습니다. 블랙은 하류로 떠났고, 다시는 올라오지 않았습니다.',
   '그날부터 강의 상석, 여울 위 가장 물살 좋은 자리는 {n}의 자리입니다. {n}은 '+josa(ageLabel(S.sp.life*(.5+R()*.4)),'을')+' 그 강의 왕으로 살았습니다.','낚시꾼들 사이에 전설이 돌았습니다. "그 다리 밑엔 절대 안 잡히는 놈이 있다." 맞는 말이었습니다.']},
 'GIN-WK-D':{kind:'bad',cat:'하천 결투',tier:'likely',fx:'f-eaten',
  l:['블랙의 입이 열렸습니다. 배스의 입은 몸통 지름만큼 벌어지고, 물을 함께 빨아들입니다. {n}은 물과 함께 빨려 들어갔습니다.','배스는 먹이를 머리부터 삼킵니다. 목 안쪽의 거친 이빨판이 {n}의 비늘을 붙잡아 뒤로 밉니다.',
   '위산이 {n}의 지느러미부터 녹였습니다. 구경하던 물고기들은 흩어졌습니다. 강은 원래대로 돌아갔습니다.','배스는 외래종입니다. 사람이 들여왔고, 사람이 풀었습니다. 이건 개그가 아닙니다.']},
 'GIN-W2-D':{kind:'bad',cat:'왜가리',tier:'likely',fx:'f-eaten',
  l:['왜가리의 부리가 수면을 뚫었습니다. 부리 끝이 {n}의 옆구리를 꿰고 그대로 들어 올립니다.','공중에서 {n}은 몸을 비틉니다. 왜가리는 부리를 한 번 털어 {n}을 머리부터 삼킵니다.','눈싸움은 왜가리의 승리였습니다. 왜가리는 원래 눈싸움을 한 적이 없습니다.']},
 'GIN-W3-D':{kind:'bad',cat:'낚시',tier:'likely',fx:'f-hand',
  l:['바늘 끝이 입천장을 뚫고 미늘이 걸렸습니다. 낚싯줄이 팽팽해지며 {n}은 물 밖으로 들려 나옵니다.','낚시꾼이 손으로 {n}을 잡고 바늘을 비틀어 빼냅니다. 입 안쪽이 찢어지고, 손바닥의 열이 비늘의 점액을 벗깁니다.',
   '"작네." 낚시꾼은 {n}을 다리 위 양동이에 던졌습니다. 양동이는 해가 질 때까지 햇볕 아래 있었습니다.']},
 'GIN-W4-D':{kind:'bad',cat:'수달',tier:'likely',fx:'f-eaten',
  l:['어미 수달이 돌아왔습니다. 수달은 물고기를 앞발로 잡고 머리부터 씹습니다.','{n}의 도장 깨기는 거기서 끝났습니다. 새끼 수달들은 그날 저녁 배가 불렀습니다.','수달은 천연기념물입니다. {n}은 아니었습니다.']},
 'GIN-SEA-H':{kind:'happy',cat:'세계관 최강자',tier:'likely',fx:'f-home',
  l:()=>['{n}은 하구를 지나 바다로 나갔습니다. 짠물이 아가미를 태웠습니다. {n}은 근성으로 버텼습니다. 과학적으로는 불가능합니다. 이 장면은 픽션입니다.','첫날 고등어 떼를 지나쳤고, 사흘째 문어와 싸워 다리 두 개를 받아 냈고, 일주일째에는 상어가 {n}을 피해 돌아갔습니다.',
   '한 달 뒤 해양 조사선의 수중 카메라에 정체불명의 민물고기가 찍혔습니다. 보고서에는 "판독 불가"라고 적혔습니다.','{n}의 이야기는 여기까지입니다. 세계관이 감당하지 못해서요.']},
 'GIN-SEA-D':{kind:'bad',cat:'삼투압',tier:'likely',fx:'f-float',
  l:['바닷물은 민물고기의 몸보다 짭니다. 몸 안의 물이 아가미와 피부를 통해 바깥으로 빠져나갑니다.','{n}은 바닷물을 마셨지만, 민물고기의 신장은 소금을 내보내지 못합니다. 피가 진해지고 근육이 떨리기 시작합니다.',
   '하구의 탁한 물 위로 {n}이 떠올랐습니다. 근성으로는 안 되는 것이 있었습니다. 삼투압이었습니다.']},
 'GIN-ESC-H':{kind:'happy',cat:'한강의 전설',tier:'likely',fx:'f-home',
  l:()=>['{n}은 뚜껑을 머리로 밀어 올리고 수건 위로 떨어졌습니다. 수건에서 거실 매트로, 매트에서 욕실 문턱으로. 몸이 마르기 전에 욕실 바닥의 물기에 닿았습니다.','배수구 덮개는 열려 있었습니다. 주인이 청소하다 안 닫았기 때문입니다. 하수관 3.2킬로미터, 처리장 침사지, 방류구. {n}은 다 지나갔습니다.',
   '아침에 주인은 빈 수조와 바닥의 물자국을 보고 울었습니다. 같은 시각, 한강 잠실 수중보 아래에서 {n}은 처음 보는 넓은 물을 보고 있었습니다.','그해 여름 한강 낚시 커뮤니티에 글이 올라왔습니다. "잠실에 관상어가 산다. 안 잡힌다. 눈빛이 장난 아니다." 조회수 12만.']},
 'GIN-ESC-D':{kind:'bad',cat:'탈출',tier:'likely',fx:'f-floor',
  l:['{n}은 뚜껑 틈을 빠져나가 바닥으로 떨어졌습니다. 수건은 없었습니다. 마룻바닥이었습니다.','바닥에서 {n}은 몸을 튕기며 물을 찾았습니다. 아가미가 마르면서 새엽이 서로 들러붙습니다.',
   '아침에 주인은 수조 앞 바닥에서 {n}을 발견했습니다. 뚜껑 틈은 손가락 하나만 했습니다. {n}에게는 충분했고, 바닥까지는 너무 멀었습니다.']},
 'GIN-POND-H':{kind:'happy',cat:'저수지의 군주',tier:'likely',fx:'f-pond',
  l:()=>['{n}은 넘친 물을 타고 배수로로, 배수로에서 논으로, 논에서 저수지로 갔습니다. 밤새 6킬로미터였습니다.','저수지에는 토박이 붕어, 잉어, 그리고 누군가 풀어 놓은 거북이 있었습니다. {n}은 그 모두와 한 번씩 싸웠습니다.',
   '가을이 되자 저수지 물고기들은 {n}이 지나가면 길을 비켰습니다. 주인은 연못 그물망을 새로 샀습니다. {n}에게는 이제 필요 없는 것이었습니다.']},
 'GIN-POND-D':{kind:'bad',cat:'배수로',tier:'likely',fx:'f-pond',
  l:['물길은 배수로 중간에서 끊겼습니다. 비가 그치자 물이 빠르게 빠졌고, {n}은 배수로 바닥의 진흙 웅덩이에 남았습니다.','웅덩이는 해가 뜨면서 줄어들었습니다. 진흙 속 산소가 바닥나고 물이 뜨거워집니다.',
   '{n}은 진흙 속에서 아가미를 크게 벌리다 멈췄습니다. 주인은 연못 물이 줄어든 것만 걱정했습니다.']},
 'GIN-CAT-D':{kind:'bad',cat:'고양이',tier:'likely',fx:'f-floor',
  l:['대장의 발톱이 {n}의 몸통에 걸렸습니다. 고양이 발톱은 갈고리처럼 휘어 있어서, 한 번 걸리면 빠지지 않습니다.','{n}은 수조 밖으로 끌려 나와 바닥에 떨어졌습니다. 대장은 앞발로 {n}을 이리저리 굴렸습니다.',
   '결투는 고양이의 승리였습니다. 고양이는 결투라는 걸 끝까지 몰랐습니다.']}
});

/* the career title: a fish with a cat for a subordinate */
(()=>{if(typeof carGrade!=='function')return;const _g=carGrade;carGrade=function(calm){const g=_g(calm);
  if(calm&&fl('catboss')&&!/끝까지 해낸/.test(g.title)){g.title='고양이의 주군';g.desc=T('집 고양이 「대장」은 끝까지 {n}에게 고개를 숙였습니다.')}return g}})();

/* a wild fish that slips the net no longer ends there (자유): most stay and live in their home river, where the training above happens */
(()=>{const _e=fEnd;fEnd=function(key,arg){
  const f=S&&S.f;
  if(key==='free'&&f&&f.track==='wild'&&S.preOwner&&!S.wild&&!f.nativeDone&&!S.ending&&R()<.85){
    f.nativeDone=1;f.warm=1;f.native=1;f.escape=0;S.wild=true;S.env='river';S.status='야생 · 고향의 강';S.interest=0;S.cd.pred=S.tick+3;
    addLog(T(pick(['그날부터 {n}은 아무의 물고기도 아니었습니다. 강의 물고기였습니다. 그리고 강은 수련하기 좋은 곳이었습니다.',
      '채집꾼의 배가 멀어졌습니다. {n}은 강바닥에 배를 붙이고 다짐했습니다. 강해지자. 그물보다, 사람보다.',
      '{n}은 살아남았습니다. 이제부터는 혼자 강해져야 합니다. 이 강에는 폭포가 있고, 왜가리가 있고, 수달 도장이 있습니다.'])),'star');
    if(typeof remember==='function')remember('그물을 빠져나왔다. 강이 내 집이 되었다.',1.3);
    render();return}
  return _e(key,arg)}})();
/* the home river is the fish's own climate: no Korean winter for a fish that never left the Amazon */
(()=>{const _w=wildTick;wildTick=function(){if(S&&S.f&&S.f.native){const w=wildOf(),c0=w.cold;w.cold=Math.max(c0,.97);try{return _w.apply(this,arguments)}finally{w.cold=c0}}return _w.apply(this,arguments)}})();
