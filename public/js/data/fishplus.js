/* ---------- v0.9.33: more of a game, and no softer ----------
   1. difficulty: 쉬움 (story) or 어려움 (real: the published anchors in LOG.md)
   2. owners have a personality, and their heart changes over the years
   3. stat routes: what the fish became opens its own events (star, tyrant, genius, survivor)
   4. special training unlocked by stats
   5. more everyday events, cruel and sometimes funny
   6. a short tutorial the first time */

/* ---------- 1. difficulty ---------- */
const MODES={
  story:{chk:1.6,l:'쉬움',d:'주인이 조금 더 너그럽고, 물고기의 선택이 결과를 더 크게 바꿉니다. 그래도 많이 죽습니다.',hz:.12,die:.15,dz:.12,dh:.33,bore:.65,wq:.55},
  real:{chk:1.2,l:'어려움',d:'실제 통계에 맞춘 난이도입니다. 대부분 끝까지 살지 못합니다.',hz:.3,die:.45,dz:.3,dh:.8,bore:.95,wq:.8}};
let MODE_NOW='story';
try{const m=localStorage.getItem('kmu_mode');if(MODES[m])MODE_NOW=m}catch(e){}
const modeK=k=>(MODES[(typeof S!=='undefined'&&S&&S.mode)||'real']||MODES.real)[k];

/* ---------- 2. owner personality ---------- */
const PERS={
  warm:{l:'다정한',bore:.8,learn:1},
  fickle:{l:'변덕스러운',bore:1.15,learn:.9},
  cool:{l:'무심한',bore:1.3,learn:.7},
  clingy:{l:'집착하는',bore:.65,learn:.9},
  showoff:{l:'허세 부리는',bore:1.1,learn:.8},
  careful:{l:'꼼꼼한',bore:.85,learn:1.25}};
const persK=k=>{const p=S.f&&PERS[S.f.pers];return p?p[k]:1};
const isP=k=>S.f&&S.f.pers===k;
{const so=setupOwner;setupOwner=function(own){so(own);
  S.f.pers=wpick([['warm',3],['fickle',3],['cool',own==='gift'||own==='casual'?4:2],['clingy',2],['showoff',own==='content'?6:2],['careful',own==='expert'||own==='learner'?4:1.5]])}}
{const ot=fishOwnerText;fishOwnerText=function(){const t=ot();return S.f&&PERS[S.f.pers]&&!S.preOwner?t+' · '+PERS[S.f.pers].l:t}}

/* ---------- 3. stat routes and 5. everyday events ---------- */
const st_=()=>fst();
const hasMates=()=>S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id);
const weakMate=()=>S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&(FX[m.id]||{cm:99}).cm<=fx_().cm*1.2)[0];
const old_=()=>S.ageM/S.sp.life>.72;
const nameIfNone=n=>{if(!S.name){S.name=n;S.disp=n;return true}return false};
const tankUp=()=>{const L=tankL(),x=fx_();const up=TANKS.filter(t=>t.k!=='pond'&&t.L>L&&t.L>=Math.min(x.minL,1620))[0];if(up&&S.f.tank!=='pond')fUpgrade(up,'주인은 다음 날 '+josa(up.l,'을')+' 주문했습니다. {n}이 몸을 다 펴고 헤엄쳤습니다.',true)};

const FFL3=[
 /* star: charm and wits */
 {t:'주인이 {n}의 영상을 SNS에 올렸습니다. 유리 앞에서 주인 손가락을 따라 도는 15초짜리 영상이었습니다. 하루 만에 조회수가 3만을 넘었습니다.',c:'star',once:'star1',w:3,
  when:()=>st_().c>=48&&st_().w>=38&&S.interest>.35,fx:()=>{S.f.fame=Math.max(S.f.fame||0,1);S.interest+=.15;fStat('c',3)},m:'작은 빛이 번쩍였다. 그 사람이 소리 내어 웃었다.'},
 {t:()=>'팔로워가 만 명을 넘었습니다. 주인은 '+(S.name?'"'+S.name+'"'+(hb(S.name)?'이라는':'라는')+' 이름':'팬들이 지어 준 이름 "'+(S.f.fanName=S.f.fanName||pick(['뽀글이','왕눈이','지느러미 공주','수조 아이돌','물멍 대장']))+'"')+'으로 계정을 따로 만들었습니다. 프로필 사진은 {n}의 옆모습이었습니다.',c:'star',once:'star2',w:4,
  when:()=>(S.f.fame||0)>=1&&st_().c>=55,fx:()=>{S.f.fame=2;if(S.f.fanName)nameIfNone(S.f.fanName);S.interest+=.1}},
 {t:'방송국에서 연락이 왔습니다. 촬영 날, 조명 네 개가 수조를 비췄고 {n}은 하루 종일 숨을 곳이 없었습니다. 방송에 나간 건 7분이었습니다.',c:'star',once:'star3',w:4,
  when:()=>(S.f.fame||0)>=2&&st_().c+st_().w>=115,fx:()=>{S.f.fame=3;S.f.stress+=.25;S.interest+=.2;S.health-=5},m:'조명이 뜨거웠다. 그래도 그 사람이 웃었다.'},
 {t:'"먹방이 조회수가 잘 나온다." 주인은 하루에 다섯 번 사료를 주며 영상을 찍었습니다. 영상은 잘 됐고, {n}의 배는 늘 부어 있었습니다.',c:'bad',once:'starfood',w:3,
  when:()=>(S.f.fame||0)>=2,fx:()=>{S.f.fat=(S.f.fat||0)+.35;S.f.wq-=10}},
 {t:'{n}의 얼굴이 들어간 굿즈가 나왔습니다. 머그컵, 스티커, 에코백. 정작 {n}의 여과기는 몇 년째 그대로였습니다.',c:'sub',once:'goods',w:2,when:()=>(S.f.fame||0)>=2},
 {t:'댓글 하나가 달렸습니다. "이 수조 너무 작은 거 아닌가요?" 주인은 댓글을 지웠습니다.',c:'bad',once:'starsmall',w:3,
  when:()=>(S.f.fame||0)>=1&&tankL()<fx_().minL&&S.r<.55},
 {t:'댓글 하나가 달렸습니다. "이 수조 너무 작은 거 아닌가요?" 주인은 밤새 검색을 했습니다.',c:'good',once:'starsmall',w:3,
  when:()=>(S.f.fame||0)>=1&&tankL()<fx_().minL&&S.r>=.55,fx:()=>{tankUp()}},
 {t:'사료 회사에서 협찬이 들어왔습니다. 협찬 사료는 {n}의 입에 맞지 않았지만, 주인은 계약 기간 내내 그 사료만 주었습니다.',c:'bad',once:'sponsor',w:2,when:()=>(S.f.fame||0)>=2,fx:()=>{S.health-=6;S.f.stress+=.08}},
 {t:'알고리즘이 바뀌었습니다. 조회수가 백 단위로 떨어지자 주인은 계정을 더 이상 열지 않았습니다. 수조 앞에 세워 두었던 조명도 치웠습니다.',c:'bad',once:'starfall',w:2,
  when:()=>(S.f.fame||0)>=2&&S.ageM>(S.f.buyAge||0)+S.sp.life*.15,fx:()=>{S.interest-=.25;S.f.fame=1}},
 {t:'팬 몇 명이 집까지 찾아왔습니다. 그들은 수조 유리에 휴대폰을 대고 플래시를 터뜨렸습니다. {n}은 그날 밤 먹이를 먹지 않았습니다.',c:'bad',once:'fans',w:2,when:()=>(S.f.fame||0)>=3,fx:()=>{S.f.stress+=.2;S.health-=6}},

 /* tyrant: strength and guts */
 {t:'{n}이 수조에서 가장 좋은 자리를 차지했습니다. 다른 물고기가 가까이 오면 들이받아 쫓아냈습니다.',c:'star',once:'tyr1',w:3,
  when:()=>st_().p>=44&&st_().g>=34&&hasMates(),fx:()=>{S.f.tyr=Math.max(S.f.tyr||0,1);S.f.stress-=.06}},
 {t:()=>{const m=weakMate()||S.f.mates.find(m=>m.n>0&&m.id!==S.sp.id);if(!m)return '{n}이 다른 물고기의 지느러미를 물어뜯었습니다.';return '{n}이 '+mateName(m)+'의 지느러미를 물어뜯었습니다. 찢어진 조각이 물에 떠다니다 여과기로 빨려 들어갔습니다. 물에 가는 핏줄이 풀렸습니다.'},c:'star',once:'tyr2',w:3,
  when:()=>(S.f.tyr||0)>=1&&st_().p>=50&&hasMates(),fx:()=>{S.f.tyr=2;fStat('p',3)}},
 {t:()=>{const m=weakMate();if(!m)return '{n}이 밤새 다른 물고기를 쫓아다녔습니다.';S.f.tyrKill=m.id;return '{n}이 밤새 '+mateName(m)+' 한 마리를 쫓아다녔습니다. 아침에 그 물고기는 비늘이 다 벗겨지고 한쪽 눈이 없는 채로 바닥에 누워 있었습니다. 배는 이미 뜯겨 열려 있었습니다.'},c:'star',once:'tyr3',w:4,
  when:()=>(S.f.tyr||0)>=2&&st_().p>=56&&!!weakMate(),fx:()=>{const m=S.f.mates.find(x=>x.id===S.f.tyrKill&&x.n>0);if(m)m.n--;S.f.tyr=3;S.f.title='수조의 폭군';fStat('p',4);fStat('g',2)},m:'이 수조는 내 것이다.',mw:1.2},
 {t:'"우리 애 싸움 진짜 잘하네." 주인은 그 장면을 찍어 올렸습니다. 댓글의 절반은 욕이었고, 주인은 욕한 사람들을 차단했습니다.',c:'sub',once:'tyrshow',w:4,
  when:()=>(S.f.tyr||0)>=3&&isP('showoff'),fx:()=>{S.f.fame=Math.max(S.f.fame||0,1);S.interest+=.1}},
 {t:'주인이 수조 한가운데에 칸막이를 꽂았습니다. {n}은 칸막이를 며칠 동안 들이받았습니다. 반대편 물고기들은 그제야 바닥에서 올라왔습니다.',c:'neutral',once:'tyrwall',w:3,
  when:()=>(S.f.tyr||0)>=2&&S.r>=.55&&hasMates(),fx:()=>{S.f.walled=1;S.f.stress+=.05}},
 {t:'참다못한 주인이 다른 물고기들을 지인에게 보냈습니다. 넓어진 수조를 {n}이 혼자 차지했습니다.',c:'neutral',once:'tyralone',w:2,
  when:()=>(S.f.tyr||0)>=3&&S.r>=.45&&hasMates(),fx:()=>{S.f.mates.forEach(m=>{if(m.id!==S.sp.id)m.n=0});S.f.stress-=.1}},

 /* genius: wits */
 {t:'{n}이 주인 손가락이 그리는 원을 따라 한 바퀴 도는 법을 익혔습니다. 주인은 친구들을 불러 몇 번이고 시켜 보았습니다.',c:'star',once:'gen1',w:3,
  when:()=>st_().w>=55&&S.interest>.3,fx:()=>{fStat('c',3);S.interest+=.1;S.f.fame=Math.max(S.f.fame||0,.5)},m:'손가락이 원을 그렸다. 따라 돌았다. 웃음소리가 들렸다.'},
 {t:'{n}이 주인의 발소리를 외웠습니다. 현관문이 열리기 3초 전부터 수면 그 자리에 가 있었습니다. 주인은 그걸 "마중"이라고 불렀습니다.',c:'star',once:'gen2',w:2,when:()=>st_().w>=50&&S.interest>.3},
 {t:'{n}이 수면 위로 뛰어 수조 밖 바닥에 떨어졌습니다. 몇 번 펄떡이던 몸이 스스로 튀어 수조 받침 아래 물이 고인 틈으로 들어갔습니다. 주인이 찾았을 때 {n}은 아직 아가미를 움직이고 있었습니다. 주인은 그날 바로 뚜껑을 맞췄습니다.',c:'star',once:'gen3',w:3,
  when:()=>st_().w>=60&&!S.f.lid&&S.f.tank!=='pond'&&(fx_().jump||0)>=.2,fx:()=>{S.health-=22;S.f.lid=1;fStat('g',4)},m:'숨이 막혔다. 몸을 튕겼다. 물이 있었다.'},
 {t:'{n}이 바닥 자갈을 하나씩 물어 옮겨 수조 한쪽에 자기만의 무더기를 쌓았습니다. 주인은 "얘 인테리어 감각 있다"며 사진을 찍었습니다.',c:'star',once:'gen4',w:2,when:()=>st_().w>=48&&(fGroup('CICH')||tm('curious'))&&S.f.tank!=='pond'},

 /* survivor: guts — some fish do well when nobody looks */
 {t:'몇 달 동안 아무도 수조를 제대로 들여다보지 않았습니다. {n}은 이끼와 가라앉은 부스러기를 뜯어 먹으며 오히려 몸이 불었습니다. 오랜만에 수조를 본 주인이 말했습니다. "얘 왜 이렇게 컸어?"',c:'star',once:'surv1',w:4,
  when:()=>S.interest<.32&&fx_().hardy>=.7&&st_().g>=48,fx:()=>{S.health+=12;fStat('g',4);S.interest+=.12}},
 {t:'사흘 동안 아무도 밥을 주지 않았습니다. {n}은 움직임을 줄이고 수조 벽의 이끼를 갉아 먹으며 버텼습니다.',c:'star',once:'surv2',w:3,when:()=>S.interest<.4&&st_().g>=55,fx:()=>{fStat('g',3)}},

 /* charm keeps it in the family */
 {t:'이사를 앞두고 가족이 "물고기는 두고 가자"고 했습니다. 주인은 {n}의 수조를 비닐로 감싸 무릎에 올리고 차에 탔습니다.',c:'star',once:'charm1',w:2,
  when:()=>st_().c>=60&&S.f.tank!=='pond'&&tankL()<=64,fx:()=>{S.interest+=.2},m:'흔들렸다. 그래도 그 품 안이었다.',mw:1.3},

 /* the owner's heart changes */
 {t:'주인이 연애를 시작했습니다. 수조 앞에 앉아 있던 저녁은 통화하는 저녁이 되었습니다.',c:'sub',once:'love',w:2,when:()=>S.o.age<45,fx:()=>{S.interest-=.14}},
 {t:'주인이 헤어졌습니다. 그 뒤 한 달 동안, 주인은 매일 밤 수조 불빛 앞에서 잠들었습니다. 물은 그 어느 때보다 깨끗했습니다.',c:'good',once:'breakup',w:3,when:()=>S.once.fflove,fx:()=>{S.interest+=.25;S.f.wq+=10}},
 {t:'주인이 이직했습니다. 야근이 늘었고, 수조 물갈이는 주말로, 다음 주말로 밀렸습니다.',c:'bad',once:'job',w:2,when:()=>S.o.age<60,fx:()=>{S.interest-=.12;S.f.wq-=8}},
 {t:'주인이 재택근무를 시작했습니다. 책상이 수조 옆으로 옮겨졌고, {n}은 하루에 몇 번씩 주인과 눈이 마주쳤습니다.',c:'good',once:'wfh',w:2,when:()=>S.o.age<60&&S.f.tank!=='pond',fx:()=>{S.interest+=.15}},
 {t:'주인이 새 취미로 캠핑을 시작했습니다. 주말마다 집이 비었습니다. 수조 앞의 의자는 베란다로 옮겨졌습니다.',c:'bad',once:'hobby',w:2,when:()=>isP('fickle')||isP('cool'),fx:()=>{S.interest-=.18}},
 {t:'주인이 갑자기 다시 {n}에게 빠졌습니다. 수조용 조명과 새 수초를 한꺼번에 주문했고, 하루에 열 번씩 수조를 들여다보았습니다.',c:'good',once:'fickle2',w:3,when:()=>isP('fickle')&&S.interest<.5,fx:()=>{S.interest+=.3;S.f.hides=1}},
 {t:'주인이 {n}을 하루에 세 번 손으로 건져 "건강 검진"을 했습니다. 지느러미를 손가락으로 펴 보고, 배를 눌러 보았습니다.',c:'bad',once:'clingy1',w:3,when:()=>isP('clingy')&&S.f.tank!=='pond',fx:()=>{S.f.stress+=.18;S.f.fin+=.06}},
 {t:'주인이 {n}에게 말을 걸었습니다. 회사 이야기, 엄마 이야기, 어제 꾼 꿈 이야기. {n}은 유리 앞에서 지느러미를 천천히 움직였습니다.',c:'good',w:1.2,when:()=>isP('warm')&&S.f.tank!=='pond',fx:()=>{S.interest+=.06},m:'목소리가 들렸다. 무슨 말인지는 몰라도 좋았다.'},
 {t:'주인이 수질 기록표에 "pH 7.2, 암모니아 0, 기분 좋아 보임"이라고 적었습니다.',c:'good',w:1,when:()=>isP('careful'),fx:()=>{S.f.wq+=4}},
 {t:'주인이 친구들에게 {n}을 "몇십만 원짜리"라고 소개했습니다. 실제로는 마트 특가였습니다.',c:'sub',once:'showoff1',w:2,when:()=>isP('showoff')},
 {t:'주인은 {n}이 살아 있는지 일주일 동안 한 번도 확인하지 않았습니다. 확인할 이유를 찾지 못했습니다.',c:'bad',w:1.2,when:()=>isP('cool')&&S.interest<.5,fx:()=>{S.interest-=.05;S.f.wq-=6}},

 /* everyday, cruel and sometimes funny */
 {t:'주인이 술에 취해 들어와 수조에 대고 한 시간 동안 하소연을 했습니다. {n}은 끝까지 들어 주었습니다.',c:'neutral',w:1.2,when:()=>S.o.age>=20&&S.f.tank!=='pond',fx:()=>{S.interest+=.04}},
 {t:'주인 친구가 수조를 들여다보며 "이거 회 떠 먹으면 맛있냐"고 물었습니다. 다들 웃었습니다.',c:'sub',once:'sashimi',w:1.5,when:()=>fx_().cm>=10},
 {t:'수조를 청소하던 주인이 {n}을 뜰채째 세면대에 올려놓고 깜빡했습니다. 2분 뒤 주인의 비명이 들렸고, {n}은 물로 돌아왔습니다. 아가미 끝이 말라 있었습니다.',c:'bad',once:'sink',w:1.5,
  when:()=>S.f.tank!=='pond'&&tankL()<=200&&S.r<.7,fx:()=>{S.health-=16;S.f.stress+=.12},m:'공기가 아가미를 태웠다.'},
 {t:'아이가 {n}에게 과자 부스러기를 "나눠" 주었습니다. 기름이 수면에 무지갯빛 막을 만들었습니다.',c:'bad',w:1.2,when:()=>fKids(),fx:()=>{S.f.wq-=12;S.f.fat=(S.f.fat||0)+.1}},
 {t:'아이가 {n}을 "구해 주겠다"며 손으로 건져 국그릇에 옮겼습니다. 그릇의 물은 수돗물이었습니다. 엄마가 보고 소리를 질렀을 때 {n}은 옆으로 누워 있었습니다.',c:'bad',once:'kidbowl',w:1.5,
  when:()=>fKids()&&S.f.tank!=='pond'&&fx_().cm<15,fx:()=>{S.health-=22;S.f.stress+=.15},m:'물이 따가웠다. 숨이 쉬어지지 않았다.'},
 {t:'주인이 유튜브에서 본 대로 수조에 소금을 넣었습니다. 숟가락이 아니라 국자였습니다.',c:'bad',once:'salt',w:1.5,when:()=>S.r<.5&&fx_().water!=='brack',fx:()=>{S.health-=(fx_().scaleless?18:10);S.f.stress+=.1}},
 {t:'로봇청소기가 바닥에 떨어진 사료 알갱이를 주워 먹으며 돌아다녔습니다. 그 집에서 가장 꼬박꼬박 밥을 먹는 건 로봇청소기였습니다.',c:'sub',once:'robotfeed',w:1,when:()=>S.f.tank!=='pond'&&S.interest<.6},
 {t:'주인이 소개팅 상대에게 휴대폰 속 {n}의 사진을 열두 장 보여 주었습니다. 두 번째 만남은 없었습니다.',c:'sub',once:'date',w:1.2,when:()=>S.o.age<40&&S.interest>.5},
 {t:'주인 어머니가 "물고기가 외로워 보인다"며 시장에서 미꾸라지 세 마리를 사 와 수조에 넣었습니다. 사흘 뒤 하얀 점이 수조 전체에 번졌습니다.',c:'bad',once:'mom',w:1.3,
  when:()=>S.f.tank!=='pond'&&tankL()>=27&&!S.f.ill,fx:()=>{fSick('ich')}},
 {t:'정전이 된 밤, 주인은 휴대폰 손전등으로 {n}을 비추며 계속 물었습니다. "살아 있지? 살아 있지?"',c:'neutral',once:'blackoutlove',w:1,when:()=>S.interest>.5&&S.f.tank!=='pond'},
 {t:'주인이 휴가지에서 {n}에게 영상 통화를 걸었습니다. 받은 건 주인의 룸메이트였고, 룸메이트는 그날 처음으로 {n}에게 밥을 주었습니다.',c:'sub',once:'vcall',w:1,when:()=>S.o.fam!=='1인 가구'},
 {t:'새로 산 LED 조명이 너무 밝았습니다. 열흘 만에 수조는 초록색 국물이 되었고, 주인은 {n}이 어디 있는지 한참 찾았습니다.',c:'bad',once:'greenwater',w:1.3,when:()=>S.f.tank!=='pond'&&S.r<.6,fx:()=>{S.f.wq-=14;S.f.algae=1}},
 {t:'수초에 붙어 달팽이 한 마리가 따라 들어왔습니다. 한 달 뒤에는 이백 마리였습니다. 주인은 핀셋으로 하나씩 잡다가 포기했습니다.',c:'sub',once:'snails',w:1.3,when:()=>S.f.hides&&S.f.tank!=='pond',fx:()=>{S.f.wq-=6}},
 {t:'집들이 날, 손님 하나가 남은 맥주를 수조에 부었습니다. "얘도 한잔해." 다음 날 아침 {n}은 수면에서 비틀거리며 헤엄쳤습니다.',c:'bad',once:'beer',w:1.2,when:()=>S.o.age>=22&&S.f.tank!=='pond'&&!S.f.lid,fx:()=>{S.health-=18;S.f.wq-=18},m:'물맛이 이상했다. 세상이 돌았다.'},
 {t:'주인이 다이어트를 시작하며 {n}도 같이 굶겼습니다. "너도 살 좀 빼자."',c:'bad',once:'diet',w:1.3,when:()=>(S.f.fat||0)>.2||tm('glutton'),fx:()=>{S.f.fat=0;S.health-=8}},
 {t:'{n}이 먹이인 줄 알고 주인 손가락을 물었습니다. 주인은 "아야" 하고 웃었습니다. 그날부터 {n}은 손가락만 보면 달려들었고, 주인은 그걸 좋아했습니다.',c:'good',once:'finger',w:1.2,when:()=>(tm('feisty')||tm('glutton'))&&fx_().cm>=5&&S.f.tank!=='pond',fx:()=>{fStat('c',3);S.interest+=.08}},
 {t:'주인 동생이 {n}을 "피라냐"라고 부르며 친구들에게 자랑했습니다. 친구들은 무서워하며 손가락을 유리에 대 보았습니다.',c:'sub',once:'piranha',w:1,when:()=>S.o.fam!=='1인 가구'&&fx_().cm<20},
 {t:'{n}이 유리에 비친 자기 모습과 하루 종일 싸웠습니다. 주인은 그 영상을 "우리 애 춤춤"이라는 제목으로 올렸습니다.',c:'sub',once:'mirror',w:1.3,when:()=>(S.sp.id==='betta'||tm('feisty'))&&S.f.tank!=='pond',fx:()=>{S.f.stress+=.08;S.f.fame=Math.max(S.f.fame||0,.5)}},
 {t:'택배 상자를 수조 뚜껑 위에 올려 두었다가 상자가 미끄러지며 뚜껑이 밀렸습니다. 아무도 몰랐습니다.',c:'bad',once:'box',w:1,when:()=>S.f.lid&&S.f.tank!=='pond',fx:()=>{S.f.lid=0}},
 {t:'옆집 공사 소음이 열흘 동안 이어졌습니다. 드릴 소리가 날 때마다 수면이 떨렸고, {n}은 바닥에 붙어 지냈습니다.',c:'bad',once:'drill',w:1,when:()=>S.f.tank!=='pond',fx:()=>{S.f.stress+=.15}},
 {t:'주인 집에 온 조카가 수조 뚜껑을 열고 {n}에게 장난감 낚싯대를 드리웠습니다. 바늘은 없었지만, {n}은 그 줄을 한참 쫓아다녔습니다.',c:'sub',once:'toyrod',w:1,when:()=>S.f.tank!=='pond'&&tm('curious')},
 {t:'연못에 백로가 내려앉았습니다. {n}은 바닥 진흙에 몸을 묻었고, 백로는 연못 가장자리에서 한참 서 있다 날아갔습니다. 다음 날 연못의 물고기는 한 마리 줄어 있었습니다.',c:'bad',once:'egret',w:1.5,
  when:()=>S.f.tank==='pond'&&hasMates(),fx:()=>{const m=S.f.mates.find(m=>m.n>0&&m.id!==S.sp.id);if(m)m.n--;S.f.stress+=.12}},

 /* old age */
 {t:'{n}의 비늘 색이 바랬습니다. 주인은 "많이 늙었구나" 하며 사료를 부드러운 것으로 바꾸고 물살을 약하게 줄였습니다.',c:'good',once:'old1',w:4,when:()=>old_()&&S.r>=.5&&S.interest>.3,fx:()=>{S.f.stress-=.1},m:'먹이가 부드러웠다. 물이 잔잔했다.',mw:1.2},
 {t:'나이 든 {n}은 하루 대부분을 바닥에서 보냈습니다. 주인은 그 앞에 쪼그려 앉아 오래 들여다보았습니다.',c:'neutral',once:'old2',w:3,when:()=>old_()&&S.interest>.4},
 {t:'"어차피 오래 살았잖아." 주인은 늙은 {n}의 수조 청소를 자꾸 미뤘습니다.',c:'bad',once:'old3',w:3,when:()=>old_()&&S.interest<.45,fx:()=>{S.f.wq-=15}},
 {t:'{n}의 등이 조금 굽었습니다. 먹이를 쫓다 자주 놓쳤고, 다른 물고기가 그 몫을 가져갔습니다.',c:'bad',once:'old4',w:2,when:()=>old_()&&hasMates(),fx:()=>{S.health-=6}},
];
FFL3.forEach(e=>{e.i=FFL.length;if(typeof e.t==='function'){const fn=e.t;Object.defineProperty(e,'t',{get:fn,enumerable:true})}FFL.push(e)});

/* ---------- 4. special training, opened by stats ---------- */
TRAIN.push(
 {l:'카메라 앞에서 포즈를 잡는다',sp:1,need:()=>fst().c>=42&&S.interest>.25&&S.f.tank!=='pond',gain:{c:9},d:'매력 ↑↑ · 스타가 될지도',
  ok:['{n}은 휴대폰이 다가오면 지느러미를 활짝 펴고 멈추는 법을 익혔습니다.',()=>{S.f.fame=(S.f.fame||0)+.5}],fail:[['플래시가 터졌습니다. {n}은 놀라 유리에 머리를 박았습니다.',X({h:-6,st:.1})]]},
 {l:'영역 싸움에서 이기는 법을 익힌다',sp:1,need:()=>fst().p>=42&&S.f.mates.some(m=>m.n>0),gain:{p:8,g:3},d:'힘 ↑↑ · 근성 ↑ · 다른 물고기가 다칠지도',
  ok:['{n}은 들이받는 각도와 무는 자리를 익혔습니다. 다른 물고기들이 {n}의 길을 비켜 갔습니다.',()=>{S.f.tyr=(S.f.tyr||0)+.5}],fail:[['덩치 큰 상대에게 덤볐다가 오히려 꼬리를 물렸습니다. 꼬리 끝에서 피가 실처럼 풀렸습니다.',X({h:-10,fin:.15})]]},
 {l:'주인 손짓을 따라 하는 묘기를 익힌다',sp:1,need:()=>fst().w>=42&&S.f.tank!=='pond',gain:{w:6,c:4},d:'지능 ↑ · 매력 ↑ · 주인 관심 ↑',
  ok:['{n}은 주인 손가락이 원을 그리면 한 바퀴 도는 법을 익혔습니다.',X({i:.1})],fail:[['{n}이 손가락을 따라오지 않자 주인이 유리를 톡톡 두드렸습니다.',X({st:.08})]]},
 {l:'배고픔을 참는 법을 익힌다',sp:1,need:()=>fst().g>=42,gain:{g:8},d:'근성 ↑↑ · 방치를 더 잘 버팀',
  ok:['{n}은 며칠 굶어도 움직임을 줄여 버티는 법을 익혔습니다.'],fail:[['너무 오래 참다 {n}의 배가 홀쭉하게 꺼졌습니다.',X({h:-8})]]},
 {l:'다른 물고기 몫을 가로채는 법을 익힌다',sp:1,need:()=>fst().p>=35&&S.f.mates.some(m=>m.n>0),gain:{p:4,g:4},d:'힘 ↑ · 근성 ↑ · 과식 주의',
  ok:['{n}은 먹이가 떨어지는 순간 다른 물고기 입 앞에서 낚아채는 법을 익혔습니다.',X({h:4})],fail:[['남의 몫까지 삼킨 {n}의 배가 터질 듯 부풀었습니다.',X({fat:.3,h:-4})]]},
 {l:'늙은 몸을 아껴 쓴다',sp:1,need:()=>S.ageM/S.sp.life>.7,gain:{g:3},d:'건강 ↑ · 노년을 버팀',rest:0,
  ok:['{n}은 바닥 가까이에서 천천히 움직이며 힘을 아꼈습니다.',X({h:8,st:-.1})],fail:[['조금만 움직여도 숨이 찼습니다.',X({h:-3})]]});

/* ---------- 6. tutorial ---------- */
const TUT=[
 ['서약서','닉네임을 적고 서약서를 보내면 물고기 한 마리가 무작위로 정해집니다. 서명한 당신이 첫 주인이 됩니다.'],
 ['당신은 물고기입니다','주인이 어떤 사람일지는 정해져 있지 않습니다. 당신은 물고기의 기질을 고르고, 때때로 물고기가 되어 선택합니다.'],
 ['화면 보는 법','위쪽 그림은 지금의 수조입니다. 물고기 몫(건강·힘·근성·지능·매력)은 선택과 육성으로 바뀌고, 주인 몫(실력·수온·수질·보살핌)은 주인이 하기 나름입니다. 수온 막대는 온도계입니다. 칸 테두리가 알맞은 범위이고, 빨강은 너무 뜨거움, 파랑은 너무 차가움입니다.'],
 ['육성과 특별 이벤트','몇 달마다 육성 카드가 나옵니다. 매력과 지능이 높으면 SNS 스타가, 힘과 근성이 높으면 수조의 폭군이 될 수도 있습니다. 대신 실패하면 다칩니다.'],
 ['서약서와 빨간 펜','주인이 약속을 어기면 서약서에 빨간 줄이 그어집니다. 나중에 고치면 그 옆에 초록색으로 고친 흔적이 남고, 다 고친 약속은 지킨 것으로 칩니다.'],
 ['기록','아래(넓은 화면에서는 오른쪽) 기록은 새 줄이 위에 쌓입니다. ▶ 플레이와 배속 버튼으로 속도를 조절하고, 끝나면 그 생을 주마등에 남길 수 있습니다.']];
function showTut(force){
  let seen=false;try{seen=localStorage.getItem('kmu_tut')==='1'}catch(e){}
  if(seen&&!force)return;const box=$('tut');if(!box)return;let i=0;
  const draw=()=>{box.querySelector('.tut-h').textContent=TUT[i][0];box.querySelector('.tut-p').textContent=TUT[i][1];
    box.querySelector('.tut-n').textContent=(i+1)+' / '+TUT.length;box.querySelector('.tut-prev').disabled=i===0;box.querySelector('.tut-next').textContent=i===TUT.length-1?'시작하기':'다음'};
  box.querySelector('.tut-prev').onclick=()=>{if(i>0){i--;draw()}};
  box.querySelector('.tut-next').onclick=()=>{if(i<TUT.length-1){i++;draw()}else close()};
  box.querySelector('.tut-x').onclick=()=>close();
  const close=()=>{box.hidden=true;try{localStorage.setItem('kmu_tut','1')}catch(e){}};
  box.hidden=false;draw();
}
if(typeof window!=='undefined'&&window.document&&document.getElementById('tut')){
  const hb=document.getElementById('helpBtn');if(hb)hb.onclick=()=>showTut(true);
  setTimeout(()=>showTut(false),400);
  /* difficulty picker on the pledge sheet */
  const mp=document.getElementById('modePick');
  if(mp&&mp.querySelectorAll){const sync=()=>{mp.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===MODE_NOW?'true':'false'));const d=document.getElementById('modeDesc');if(d)d.textContent=MODES[MODE_NOW].d};
    mp.querySelectorAll('button').forEach(b=>b.onclick=()=>{MODE_NOW=b.dataset.mode;try{localStorage.setItem('kmu_mode',MODE_NOW)}catch(e){}sync()});sync()}
}
