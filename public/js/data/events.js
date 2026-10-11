/* ---------- everyday events (non-fatal) ----------
   Fields
     g      groups the event applies to ('*' = any)
     type   good | bad | neutral        (log colour)
     t      text, or a function returning text. {n} = the animal's name; the particle after it is fixed automatically
     h i r  change to health / owner's care / owner's responsibility
     sc     1 = the animal gets scared for a moment
     stage  ['baby','adult','senior'] limits by life stage
     once   happens at most once per life (any text that says "처음" must be once). Events sharing a once key exclude each other.
     when   extra condition
     w      weight (default 1). The weight also drops each time the event has already happened.
     m mw   memory line for the ending's 돌아보기 and how much it mattered
     reflect  opens the 소감 box: the player writes what the animal felt
     fx     anything else
*/
const OWNED=['dog','cat','fish','rodent','rabbit','turtle','tortoise','reptile','snake','bird','parrot','chick','insect','crab','amphib','hedgehog','ferret','exotic'];
const FURRY=['dog','cat','rodent','rabbit','hedgehog','ferret','exotic'];
const SMALLM=['rodent','hedgehog','rabbit','ferret'];
const REPT=['reptile','snake','turtle','tortoise'];
const BIRDS=['bird','parrot'];
const home=()=>!S.noPledge&&!S.flags.fac&&!S.flags.cafeLife&&!S.wild;
const smallDog=()=>S.sp.g==='dog'&&!S.sp.big&&!S.sp.mid&&S.sp.id!=='mix';

/* health problems: each one is a single decision about money and care */
const ILL={
  dog:[['슬개골이 빠졌습니다. 뒷다리 하나를 들고 깡충깡충 걷습니다','수술비 250만 원',()=>smallDog()],['귀에서 냄새가 나고 자꾸 머리를 텁니다. 외이염입니다','치료비 15만 원'],['입 냄새가 심해졌습니다. 치석이 가득합니다','스케일링 40만 원'],['온몸을 긁어 피부가 벌겋게 일어났습니다','피부병 치료 30만 원'],['기침을 하고 쉽게 지칩니다. 심장 판막이 약해졌습니다','평생 약값 매달 10만 원',()=>sen()>.6],['물을 많이 마시고 배가 볼록해졌습니다. 쿠싱증후군입니다','검사와 약값 120만 원',()=>sen()>.6]],
  cat:[['오줌에 피가 섞여 나옵니다. 방광염입니다','치료비 30만 원'],['밥을 먹다 아파서 비명을 지릅니다. 구내염입니다','전발치 150만 원'],['물을 많이 마시고 살이 빠집니다. 신장 수치가 높습니다','수액과 처방식 매달 30만 원',()=>sen()>.55],['토를 자주 하고 털이 푸석합니다','검사비 40만 원']],
  rodent:[['배에 혹이 만져집니다. 종양입니다','수술비 60만 원, 몸값의 서른 배',()=>sen()>.5],['눈곱이 끼고 콧물이 납니다','치료비 8만 원']],
  rabbit:[['하루 종일 똥을 싸지 않습니다. 위장 정체입니다','응급 치료 25만 원'],['한쪽 눈이 하얗게 탁해졌습니다','치료비 15만 원']],
  ferret:[['털이 빠지고 배가 부풀었습니다. 부신 질환입니다','치료비 80만 원',()=>sen()>.4]],
  bird:[['깃털을 부풀린 채 횃대에서 졸기만 합니다','특수동물 병원 진료 20만 원'],['소낭이 부어 먹은 걸 게워 냅니다. 소낭염입니다','치료비 15만 원']],
  parrot:[['깃털이 비틀리고 부리가 갈라집니다. 부리깃털병이 의심됩니다','검사비 30만 원']],
  reptile:[['허물이 발가락에 남아 발가락이 까맣게 변했습니다','치료비 10만 원'],['입 주변이 붓고 고름이 납니다. 구내염입니다','치료비 20만 원']],
  snake:[['석 달째 먹이를 거부하고 살이 빠집니다','검사비 15만 원'],['비늘 밑에 진드기가 바글바글합니다','치료비 10만 원']],
  turtle:[['등갑 한쪽이 하얗게 물러졌습니다. 등갑 부패입니다','치료비 15만 원'],['눈이 퉁퉁 부어 뜨지 못합니다. 비타민 A 결핍입니다','치료비 8만 원']],
  tortoise:[['코에서 거품이 납니다. 호흡기 감염입니다','특수동물 병원 30만 원']],
  hedgehog:[['한쪽으로 자꾸 넘어지고 비틀거립니다','검사비 20만 원',()=>sen()>.5]],
  exotic:[['밥을 안 먹고 구석에만 있습니다','특수동물 병원 진료 40만 원, 진료 가능한 곳은 차로 두 시간']],
};
const illEvents=[];
Object.entries(ILL).forEach(([g,list])=>list.forEach(([what,cost,cond],k)=>illEvents.push({
  g:[g],type:'bad',once:'ill-'+g+k,w:.9,when:()=>home()&&S.ageM>S.sp.life*.08&&(!cond||cond()),
  t:()=>what+'. '+cost+'.',
  fx:()=>{
    if(R()<S.r+.15){
      say(pick(['주인은 적금을 깼습니다. {n}은 치료를 받았습니다.','주인이 카드 할부로 병원비를 냈습니다. {n}은 회복했습니다.','주인이 반차를 내고 {n}을 병원에 데려갔습니다. 치료는 잘 끝났습니다.']),'good');
      S.health=clamp(S.health+15,0,100);S.flags.untreated=0;
      remember('아팠는데 주인이 병원에 데려가 주었다.',1.1);
    } else {
      say(pick(['주인은 "좀 더 지켜보자"며 병원에 가지 않았습니다.','주인은 견적서를 서랍에 넣었습니다.','주인은 인터넷에서 찾은 민간요법을 썼습니다.']),'bad');
      S.flags.untreated=1;S.health-=10;breakP(1,'병원비 때문에 치료 안 함');
    }
  }})));

const FLAV=[
 /* ===== dog ===== */
 {g:['dog'],type:'good',once:'potty',stage:['baby'],t:'{n}이 배변 패드 위에 처음으로 쉬를 했습니다. 온 가족이 박수를 쳤습니다.',i:.1,m:'패드 위에 쉬를 했더니 다들 박수를 쳤다.'},
 {g:['dog'],type:'bad',stage:['baby'],t:'배변 실수를 했습니다. 주인이 이불을 빨며 한숨을 쉽니다.',i:-.04},
 {g:['dog'],type:'neutral',stage:['baby'],t:'이갈이가 시작됐습니다. {n}이 의자 다리를 오징어처럼 씹어 놓았습니다.',i:-.03},
 {g:['dog'],type:'bad',stage:['baby'],once:'cry1',t:'첫날 밤, {n}은 낯선 집이 무서워 밤새 낑낑거렸습니다.',sc:1},
 {g:['dog'],type:'good',once:'walk1',stage:['baby'],t:'처음으로 산책을 나갔습니다. 바람, 낙엽, 다른 개의 오줌 냄새. 모든 게 처음이었습니다.',m:'첫 산책. 세상에 냄새가 이렇게 많은 줄 몰랐다.',mw:1.5},
 {g:['dog'],type:'good',once:'sit',t:'{n}이 처음으로 "앉아"를 해냈습니다. 가족 모두 박수를 쳤습니다.',m:'"앉아"를 했더니 모두가 박수를 쳤다.',i:.15},
 {g:['dog'],type:'good',w:1.3,when:()=>!S.flags.yard,t:'산책 시간이 길어졌습니다. {n}은 꼬리를 흔들며 앞장섰습니다.',m:'산책길 풀 냄새. 주인 발소리 옆에서 걷는 게 좋았다.',i:.12,h:4},
 {g:['dog'],type:'neutral',t:'{n}이 주인 양말 한 짝을 물고 온 집을 뛰어다녔습니다. 잡히지 않는 게 핵심입니다.',i:.04},
 {g:['dog'],type:'bad',when:()=>S.r<.6,t:'물그릇이 하루 종일 비어 있었습니다. 주인은 퇴근하고서야 물을 채웠습니다.',h:-5},
 {g:['dog'],type:'good',once:'fountain',when:()=>S.r>.4&&!S.flags.yard,t:'주인이 물이 졸졸 흐르는 정수기형 물그릇을 사 왔습니다. {n}은 한참 물줄기를 노려봤습니다.',h:3},
 {g:['dog'],type:'neutral',t:'물을 너무 급하게 마시다 사레가 들려 한참 켁켁거렸습니다.'},
 {g:['dog'],type:'bad',stage:['adult','senior'],t:'산책 중 풀숲을 헤집다 진드기가 붙었습니다.',fx:()=>{if(S.r>.5)say('주인이 집에 와서 바로 떼어 내고 약을 발라 주었습니다.','sub');else{say('아무도 몰랐습니다. 진드기는 {n}의 귀 뒤에서 콩알만큼 부풀었습니다.','sub');S.health-=8}}},
 {g:['dog'],type:'bad',when:()=>S.r<.55,t:'{n}이 몸을 박박 긁기 시작했습니다. 벼룩이었습니다.',h:-4},
 {g:['dog'],type:'neutral',when:()=>S.r>.45,t:'심장사상충 약 먹는 날. 주인이 고기 속에 약을 숨겼지만 {n}은 약만 정확히 뱉어 냈습니다.'},
 {g:['dog'],type:'bad',w:1.1,when:()=>!S.flags.yard,t:'산책 중 주인이 휴대폰을 보는 사이, {n}이 바닥에 떨어진 닭 뼈를 주워 삼켰습니다.',fx:()=>{if(R()<.3)fireEnd('foreign');else{say('다행히 그냥 넘어갔습니다. 주인은 그날 밤 내내 {n} 곁을 지켰습니다.','sub');S.health-=3}}},
 {g:['dog'],type:'bad',t:'주인이 한눈판 사이 {n}이 쓰레기통을 엎었습니다. 거실이 전쟁터가 되었습니다.',i:-.08,fx:()=>{S.flags.annoyed=Math.max(S.flags.annoyed||0,4)}},
 {g:['dog'],type:'bad',when:()=>!S.flags.yard,t:'택배 기사님이 초인종을 누를 때마다 {n}이 온 아파트가 울리도록 짖습니다.',i:-.04},
 {g:['dog'],type:'bad',t:'천둥이 치는 밤, {n}은 욕조 안에 숨어 밤새 떨었습니다.',sc:1},
 {g:['dog'],type:'bad',once:'fireworks',w:.6,t:'불꽃놀이 축제 날, 터지는 소리에 놀란 {n}이 목줄을 끊고 달아났습니다.',sc:1,fx:()=>{if(R()<.45)fireEnd('lost');else say('주인이 세 블록을 쫓아가 겨우 {n}을 붙잡았습니다.','sub')}},
 {g:['dog'],type:'neutral',t:'목욕을 했습니다. {n}은 젖은 생쥐 꼴로 온 집을 뛰어다니며 몸을 털었습니다.',m:'목욕 뒤 따뜻한 드라이기 바람.'},
 {g:['dog'],type:'neutral',once:'groom',when:()=>['maltese','poodle','pome','shihtzu','bichon'].includes(S.sp.id),t:'미용실에서 털을 바짝 밀고 왔습니다.',reflect:{p:'털을 바짝 밀고 온 날. 거울 속에 처음 보는 동물이 서 있습니다.',ph:'예) 이게… 나라고?'}},
 {g:['dog'],type:'bad',t:'발톱을 깎다 피가 났습니다. 그날부터 {n}은 발톱깎이 소리만 나면 숨습니다.',h:-2},
 {g:['dog'],type:'neutral',when:()=>S.r<.6,t:'주인이 식탁에서 고기를 자꾸 떼어 줍니다. {n}의 배가 동그래졌습니다.',fx:()=>{S.size=Math.min(1.25,S.size+.04);S.flags.fat=1}},
 {g:['dog','cat'],type:'neutral',once:'diet',when:()=>S.flags.fat,t:'동물병원에서 비만 판정을 받았습니다. 밥그릇에 다이어트 사료가 담겼습니다. {n}은 밥그릇을 한참 쳐다봤습니다.',fx:()=>{S.size=Math.max(1,S.size-.04);S.flags.fat=0}},
 {g:['dog'],type:'bad',t:'사료를 갑자기 바꿨더니 사흘 내내 설사를 했습니다.',h:-5},
 {g:['dog'],type:'good',when:()=>!S.flags.yard,t:'공원에서 처음 보는 개와 한참 뛰어놀았습니다.',m:'공원에서 만난 친구와 끝없이 뛰었다.',h:4},
 {g:['dog','cat'],type:'good',once:'wfh',when:home,t:'주인이 재택근무를 시작했습니다. 하루 종일 함께 있습니다.',i:.2,m:'주인이 하루 종일 집에 있었다. 매일이 주말 같았다.',mw:1.4},
 {g:['dog'],type:'bad',when:()=>S.interest<.5&&!S.flags.yard,t:'분리불안이 생겼습니다. 주인이 나가면 현관 앞에서 몇 시간씩 울부짖습니다. 이웃 쪽지가 붙었습니다.',i:-.1},
 {g:['dog'],type:'good',when:()=>S.r>.5,t:'주인이 수건으로 노즈워크 담요를 만들어 주었습니다. {n}은 간식 찾기에 30분을 썼습니다.',m:'담요 속에 숨은 간식 찾기.'},
 {g:['dog'],type:'neutral',t:'{n}이 1년 전 소파 밑에 숨겨 둔 개껌을 찾아냈습니다. 표정이 의기양양합니다.'},
 {g:['dog'],type:'bad',when:()=>S.r<.5&&!S.flags.yard,t:'한여름 한낮 산책. 아스팔트가 너무 뜨거워 {n}의 발바닥이 데었습니다.',h:-6},
 {g:['dog'],type:'bad',t:'겨울 산책길에 뿌린 염화칼슘에 발바닥이 갈라졌습니다.',h:-3},
 {g:['dog'],type:'good',once:'bed',when:()=>!S.flags.yard,t:'{n}이 처음으로 주인 침대에 올라가 잤습니다. 주인은 내쫓지 않았습니다.',m:'처음으로 주인 침대에서 잤다. 주인 냄새가 났다.',mw:1.3},
 {g:['dog'],type:'neutral',when:()=>!S.flags.yard,t:'엘리베이터에서 만난 이웃이 {n}을 보고 인상을 찌푸렸습니다. 주인이 {n}을 안아 올렸습니다.'},
 {g:['dog'],type:'neutral',when:()=>S.flags.yard,t:'{n}이 개집 지붕 위로 올라가 동네를 내려다봤습니다.'},
 {g:['dog'],type:'bad',when:()=>S.flags.yard,t:'한겨울, 마당 물그릇이 꽁꽁 얼었습니다. {n}은 얼음을 핥았습니다.',h:-6},
 {g:['dog'],type:'bad',when:()=>S.flags.yard,t:'한여름 땡볕, 그늘 없는 마당에서 {n}은 혀를 길게 빼고 헐떡였습니다.',h:-6},
 {g:['dog'],type:'bad',stage:['senior'],once:'cataract',t:'{n}의 눈이 뿌옇게 변했습니다. 백내장입니다. 가구에 자꾸 부딪힙니다.',h:-4},
 {g:['dog','cat'],type:'bad',stage:['senior'],once:'dementia',t:'밤마다 벽을 보고 서 있거나 같은 자리를 빙빙 돕니다. 인지장애가 시작됐습니다.',i:-.05},
 {g:['dog'],type:'neutral',stage:['senior'],t:'계단을 오르지 못해 주인이 안아서 올려 줍니다.',m:'계단 앞에서 주인이 나를 안아 올렸다.',mw:1.2},
 {g:['dog','cat'],type:'neutral',stage:['senior'],once:'teethout',t:'이빨이 몇 개 빠졌습니다. 이제 불린 사료를 먹습니다.'},
 {g:['dog'],type:'good',stage:['senior'],once:'stroller',when:()=>S.r>.5,t:'주인이 유모차를 사서 걷기 힘든 {n}을 태우고 산책합니다.',m:'걷지 못하게 되어도 주인은 나를 태우고 바람을 맞게 해 주었다.',mw:1.6},

 /* ===== cat ===== */
 {g:['cat'],type:'good',once:'lap',t:'{n}이 처음으로 주인 무릎 위에서 잠들었습니다.',m:'처음으로 주인 무릎 위에서 잠들었다. 따뜻했다.',mw:1.5,i:.18},
 {g:['cat'],type:'good',w:.8,when:()=>S.once.lap,t:'{n}이 주인 무릎 위에서 낮잠을 잤습니다. 주인은 화장실을 한 시간 참았습니다.',i:.1},
 {g:['cat'],type:'neutral',t:'새벽 4시, {n}이 이유 없이 온 집을 우다다 달렸습니다.'},
 {g:['cat'],type:'neutral',t:'{n}이 책상 위 컵을 앞발로 툭 쳐서 떨어뜨렸습니다. 주인과 눈이 마주쳤습니다. 사과는 없었습니다.'},
 {g:['cat'],type:'neutral',t:'주인이 보고서를 쓰는 동안 {n}이 키보드 위에 드러누웠습니다. 문서에 "ㅁㅁㅁㅁㅁㅁㅁ"가 300줄 생겼습니다.',i:.03},
 {g:['cat'],type:'bad',t:'헤어볼을 토했습니다. 하필 주인 슬리퍼 안에.'},
 {g:['cat'],type:'bad',t:'{n}이 창가 화분 잎을 뜯어 먹었습니다.',fx:()=>{if(R()<.3&&S.r<.6){say('고양이에게 독이 있는 몬스테라였습니다. {n}은 하루 종일 침을 흘리며 토했습니다.','sub');S.health-=12}}},
 {g:['cat'],type:'good',t:'택배 상자가 왔습니다. {n}은 내용물보다 상자를 더 좋아했습니다.',m:'택배 상자 속. 딱 맞았다.'},
 {g:['cat'],type:'neutral',t:'{n}은 물그릇 물은 안 마시고 꼭 세면대 수도꼭지 물만 마십니다.'},
 {g:['cat'],type:'good',once:'catfountain',when:()=>S.r>.4,t:'주인이 고양이 정수기를 들여왔습니다. {n}이 물을 더 많이 마시기 시작했습니다.',h:4},
 {g:['cat'],type:'bad',when:()=>S.r<.5,t:'모래 화장실을 사흘째 안 치웠습니다. {n}이 화장실 옆 바닥에 볼일을 봤습니다.',i:-.05},
 {g:['cat'],type:'good',t:'주인이 낚싯대 장난감을 흔들자 {n}이 10분 동안 맹수가 되었습니다.',m:'깃털 낚싯대를 잡았다. 나는 사냥꾼이었다.',h:3},
 {g:['cat'],type:'neutral',t:'손님이 오자 {n}은 하루 종일 침대 밑에서 나오지 않았습니다.',sc:1},
 {g:['cat'],type:'good',t:'{n}이 주인 배 위에서 꾹꾹이를 하며 골골송을 불렀습니다.',m:'주인 배 위에서 꾹꾹이. 골골골.',mw:1.4,i:.1},
 {g:['cat'],type:'neutral',t:'간식을 하나 더 달라고 한 시간 동안 울었습니다. 결국 받아 냈습니다.'},
 {g:['cat'],type:'bad',t:'목욕을 시키다 주인 팔에 할퀸 자국이 열 줄 생겼습니다.',i:-.04},
 {g:['cat'],type:'neutral',t:'발톱깎이를 피해 옷장 꼭대기로 피신했습니다.'},
 {g:['cat'],type:'bad',t:'실 달린 장난감을 삼키려 했습니다.',fx:()=>{if(S.r>.5)say('주인이 급히 입에서 실을 빼냈습니다.','sub');else fireEnd('foreign')}},
 {g:['cat'],type:'neutral',t:'{n}이 창밖 비둘기를 보며 하루 종일 꼬리를 탁탁 쳤습니다.'},
 {g:['cat'],type:'neutral',stage:['senior'],t:'{n}은 이제 냉장고 위에 뛰어오르지 못합니다. 의자를 밟고 천천히 올라갑니다.'},
 {g:['cat'],type:'good',stage:['senior'],once:'steps',when:()=>S.r>.5,t:'주인이 {n}을 위해 침대 옆에 계단식 발판을 만들었습니다.',m:'주인이 만들어 준 계단으로 다시 침대에 올라갔다.',mw:1.3},
 {g:['cat'],type:'good',once:'tower',t:'주인이 캣타워를 조립했습니다. {n}은 캣타워가 담겨 온 상자만 좋아했습니다.',m:'캣타워보다 그 상자가 좋았다.',i:.08},

 /* ===== dog & cat & furry shared ===== */
 {g:['dog','cat','rabbit','ferret'],type:'good',once:'vacc',stage:['baby'],t:'동물병원에서 첫 예방접종을 맞았습니다. 맞고 나서 하루 종일 축 처졌습니다.',h:5},
 {g:['dog'],type:'good',once:'reg',when:()=>S.r>.35,t:'동물등록을 마쳤습니다. 목덜미에 쌀알만 한 칩이 들어갔습니다.',fx:()=>{S.flags.registered=1}},
 {g:['dog','cat','rabbit','ferret'],type:'good',once:'neuter',w:1.4,when:()=>S.r>.4&&S.ageM>5&&!S.flags.neutered&&home(),t:'중성화 수술을 받았습니다. 넥카라를 쓴 채 집에 돌아왔습니다.',h:3,fx:()=>{S.flags.neutered=1},reflect:{p:'중성화 수술을 받았습니다. 마취에서 깨어나 보니 어딘가 허전합니다. 넥카라 너머로 세상이 동그랗게 보입니다.',ph:'예) 내 소중한 무언가가 사라졌다…'}},
 {g:['dog','cat'],type:'good',once:'ins',when:()=>S.r>.6,t:'주인이 펫보험에 가입했습니다.',r:.05},
 {g:FURRY.concat(BIRDS),type:'good',when:home,t:'가족 모두가 {n}을 쓰다듬으며 저녁을 보냈습니다.',m:'모두가 나를 쓰다듬어 준 저녁.',mw:1.2,i:.12},
 {g:['dog','cat'],type:'good',once:'bday',when:()=>S.ageM>12&&home(),t:'생일에 주인이 {n}을 위한 고구마 케이크를 만들었습니다. 고깔모자는 3초 만에 벗겨졌습니다.',m:'내 생일 케이크 냄새.',mw:1.3,i:.15},
 {g:['dog','cat'],type:'neutral',once:'sns',when:home,t:'주인이 {n} 이름으로 SNS 계정을 만들었습니다. 팔로워가 300명이 되었습니다.'},
 {g:['dog','cat'],type:'good',once:'calendar',when:()=>home()&&S.r>.5,t:'주인이 {n}의 사진으로 달력을 만들어 가족에게 돌렸습니다.',m:'열두 달 내내 내 얼굴이 걸려 있었다.'},
 {g:['dog','cat'],type:'bad',w:.6,when:()=>S.r<.35&&home(),t:'주인이 기분 나쁜 날, {n}에게 소리를 지르고 밀쳤습니다. {n}은 한동안 침대 밑에서 나오지 않았습니다.',h:-8,sc:1},
 {g:['dog','cat'],type:'bad',once:'holiday',when:home,t:'명절 사흘 동안 {n}은 혼자 남겨졌습니다. 자동급식기가 이틀째에 고장 났습니다.',h:-18,i:-.05},
 {g:['dog','cat'],type:'good',once:'sitter',when:()=>home()&&S.r>.55,t:'주인이 여행을 가면서 {n}을 펫시터에게 맡겼습니다. 하루 두 번 산책 사진이 왔습니다.'},
 {g:['dog','cat'],type:'bad',once:'baby',when:()=>S.ageM>18&&S.o.fam!=='1인 가구'&&home(),t:'집에 아기가 태어났습니다. 가족들이 털 이야기를 꺼내기 시작했습니다.',i:-.15,fx:()=>{S.flags.baby=1}},
 {g:['dog','cat'],type:'bad',once:'homebreed',when:()=>!S.flags.neutered&&S.r<.6&&S.ageM>12&&home(),t:()=>fem()?'"한 번쯤 새끼를 보게 해 주자." 주인이 {n}을 교배시켰습니다. 새끼 다섯 마리는 중고거래 앱으로 분양되었습니다.':'주인이 동네 사람에게 돈을 받고 {n}을 교배용으로 빌려주었습니다.',h:-10,fx:()=>breakP(4,fem()?'새끼 받아 팖':'교배용으로 빌려줌')},

 /* ===== small mammals ===== */
 {g:['rodent'],type:'good',when:()=>S.sp.id!=='guinea',t:'해바라기씨를 볼주머니 가득 채웠습니다. 얼굴이 두 배가 되었습니다.',m:'볼주머니 가득 해바라기씨. 부자가 된 기분.'},
 {g:['rodent'],type:'good',when:()=>S.sp.id==='guinea',t:'냉장고 문 여는 소리에 {n}이 "뀨이익!" 하고 소리를 질렀습니다. 채소를 받았습니다.',m:'냉장고 소리는 곧 채소.'},
 {g:SMALLM,type:'good',t:'톱밥을 새로 갈아 주었습니다. {n}이 새 톱밥에 몸을 비비며 굴렀습니다.',h:4},
 {g:['rodent','hedgehog'],type:'bad',once:'nowheel',when:()=>S.r<.5,t:'쳇바퀴 소리가 시끄럽다며 주인이 쳇바퀴를 빼 버렸습니다. {n}은 밤새 케이지 모서리를 왔다 갔다 했습니다.',h:-5},
 {g:['rodent','hedgehog'],type:'good',t:'쳇바퀴를 새것으로 바꿔 주었습니다. {n}이 밤새 달립니다.',m:'새 쳇바퀴에서 밤새 달렸다.',i:.08},
 {g:SMALLM,type:'bad',when:()=>S.r<.6,t:'급수기 볼이 막혀 하루 종일 물이 나오지 않았습니다.',h:-8},
 {g:['rodent'],type:'bad',when:()=>S.interest<.5,t:'{n}이 밤새 케이지 철장을 갉았습니다. 좁고 심심하다는 신호였습니다.',h:-3},
 {g:SMALLM,type:'bad',w:.7,t:'케이지 문틈으로 빠져나가 소파 밑에서 이틀을 보냈습니다. 먼지를 뒤집어쓰고 나왔습니다.',h:-6,sc:1},
 {g:['rodent','rabbit'],type:'bad',when:()=>kids()>1,t:'아이가 {n}을 인형처럼 들고 다닙니다.',h:-8,sc:1},
 {g:['rabbit'],type:'good',t:'{n}이 기분이 좋아 공중에서 몸을 비트는 빙키를 했습니다.',m:'너무 좋아서 공중에서 몸을 비틀었다.',mw:1.3},
 {g:['rabbit'],type:'bad',when:()=>S.r<.5,t:'{n}은 사료만 먹고 건초는 거들떠보지 않습니다. 주인은 그냥 사료를 더 줍니다.'},
 {g:['rabbit','ferret','rodent'],type:'bad',w:.8,t:'주인이 한눈판 사이 {n}이 충전기 선을 갉았습니다.',fx:()=>{if(R()<.1*tmod('cable'))fireEnd('cable');else say('주인이 비명을 지르며 전선을 빼앗았습니다.','sub')}},
 {g:['hedgehog'],type:'neutral',t:'{n}이 가시를 바짝 세우고 "퓨퓨" 소리를 냈습니다. 주인 손이 따끔했습니다.'},
 {g:['hedgehog'],type:'good',t:'{n}이 손바닥 위에서 배를 보이고 잠들었습니다.',m:'손바닥 위에서 배를 내놓고 잤다. 하나도 안 무서웠다.',mw:1.3},
 {g:['ferret'],type:'neutral',t:'{n}이 양말 열두 짝을 훔쳐 소파 밑에 숨겨 두었습니다.'},
 {g:['ferret'],type:'good',t:'{n}이 몸을 둥글게 말고 옆으로 깡충깡충, 전쟁 춤을 췄습니다.',m:'신나서 전쟁 춤을 췄다.'},

 /* ===== fish & tank ===== */
 {g:['fish'],type:'bad',w:1.4,t:'물이 탁해졌지만 아무도 눈치채지 못합니다.',fx:()=>{S.health-=7*tankMult()}},
 {g:['fish','amphib'],type:'bad',when:()=>S.r<.65,t:'어항 물이 증발해서 수위가 손가락 두 마디만큼 내려갔습니다.',h:-4},
 {g:['fish','amphib'],type:'good',t:'주인이 증발한 만큼 물을 채우고, 하루 묵힌 물로 3분의 1을 갈아 주었습니다.',h:8,m:'새 물이 들어왔다. 상쾌했다.'},
 {g:['fish'],type:'bad',when:()=>S.r<.55,t:'주인이 사료를 한 움큼 넣었습니다. 다 먹지 못한 사료가 바닥에 쌓여 썩기 시작했습니다.',h:-6},
 {g:['fish'],type:'bad',once:'sponge',when:()=>S.tank.filter!=='없음'&&S.r<.6,t:'주인이 여과기 스펀지를 수돗물로 박박 빨았습니다. 물을 맑게 해 주던 박테리아가 다 죽었습니다.',h:-12},
 {g:['fish'],type:'bad',t:'어항 조명을 하루 종일 켜 둬서 녹조가 폈습니다. 유리가 초록색이 되었습니다.',h:-4},
 {g:['fish'],type:'good',once:'plant',t:'주인이 수초를 몇 포기 심어 주었습니다. {n}은 수초 사이를 들락날락했습니다.',m:'수초 사이 그늘. 숨을 곳이 생겼다.',h:5},
 {g:['fish','amphib'],type:'bad',t:'집 고양이가 어항 앞에 앉아 {n}을 몇 시간째 노려봅니다.',sc:1},
 {g:['fish','amphib'],type:'bad',t:'폭염으로 수온계가 31도를 가리킵니다. 물속 산소가 부족합니다.',h:-7},
 {g:['fish'],type:'bad',when:()=>['betta','guppy'].includes(S.sp.id),t:'한겨울에 어항 히터가 고장 났습니다. 열대어인 {n}의 움직임이 느려졌습니다.',h:-10},
 {g:['fish'],type:'good',when:()=>S.tank.filter==='없음',t:'주인이 걸이식 여과기를 사서 달아 주었습니다. 물이 흐르기 시작했습니다.',m:'물이 맑아졌다. 숨쉬기가 편했다.',r:.1,h:10,fx:()=>{S.tank.filter='걸이식 여과기'}},
 {g:['fish'],type:'bad',when:()=>S.tank.filter!=='없음',t:'정전으로 여과기가 하룻밤 멈췄습니다. 아침에 물에서 비린내가 났습니다.',h:-10},
 {g:['fish'],type:'bad',once:'morefish',when:()=>S.r<.6,t:'주인이 마트에서 물고기 세 마리를 더 사 와 그대로 어항에 넣었습니다.',fx:()=>{S.tank.crowd+=3;S.flags.newfish=1}},
 {g:['fish'],type:'good',once:'lid',when:()=>!S.tank.lid&&S.r>.4,t:'주인이 어항 뚜껑을 샀습니다.',fx:()=>{S.tank.lid=true}},
 {g:['fish'],type:'good',once:'bigger',when:()=>S.tank.vessel==='볼어항'&&S.r>.45,t:'주인이 볼어항을 치우고 45cm 어항으로 옮겨 주었습니다.',m:'세상이 세 배로 넓어졌다.',mw:1.4,fx:()=>{S.tank.vessel='45cm 어항'}},
 {g:['fish'],type:'good',t:'아이가 어항 앞에 의자를 놓고 한참 {n}을 들여다봤습니다.',m:'아이가 의자를 놓고 나를 오래 들여다봤다. 그 눈이 좋았다.',mw:1.3,i:.15},
 {g:['fish'],type:'neutral',t:'{n}이 유리에 비친 자기 모습을 쫓아 한참 빙빙 돌았습니다.'},
 {g:['fish'],type:'bad',w:.7,when:()=>S.sp.id==='guppy',t:'치어가 태어났습니다. 주인은 키울 데가 없다며 치어들을 변기에 흘려보냈습니다.',i:-.05},
 {g:['fish'],type:'neutral',when:()=>S.sp.id==='betta',t:'{n}이 수면에 거품 둥지를 지었습니다. 알을 낳을 상대는 없었습니다.'},
 {g:['fish'],type:'neutral',when:()=>S.sp.id==='goldfish',t:'{n}이 바닥 자갈을 입에 물었다 뱉었다 하며 놀았습니다.'},
 {g:['amphib'],type:'good',t:'{n}이 웃는 얼굴로 수조 유리에 딱 붙었습니다. 주인이 사진을 50장 찍었습니다.',m:'유리 너머 주인 얼굴.'},
 {g:['amphib'],type:'bad',t:'아가미가 뒤로 말렸습니다. 물이 너무 따뜻하다는 신호입니다.',h:-6},

 /* ===== reptiles ===== */
 {g:['reptile','snake'],type:'good',t:'{n}의 탈피가 한 번에 깔끔하게 끝났습니다.',m:'허물을 한 번에 벗었다. 몸이 가벼웠다.',h:6},
 {g:['reptile'],type:'bad',when:()=>S.r<.55,t:'사육장에 넣은 귀뚜라미를 다 먹지 못했습니다. 남은 귀뚜라미들이 밤새 {n}의 꼬리를 갉았습니다.',h:-8},
 {g:REPT,type:'bad',when:()=>S.r<.5,t:'바닥 보온 매트가 너무 뜨거웠습니다. {n}의 배에 화상 자국이 생겼습니다.',h:-8},
 {g:['reptile','snake'],type:'neutral',t:'{n}이 물그릇에 들어가 몸을 푹 담갔습니다. 물이 넘쳤습니다.'},
 {g:['snake'],type:'bad',w:.7,when:home,t:'주인 친구들이 놀러 와 {n}을 목에 감고 돌아가며 사진을 찍었습니다.',h:-5,sc:1},
 {g:['reptile'],type:'neutral',when:()=>S.sp.id==='leo',t:'{n}이 꼬리를 살랑살랑 흔들며 밀웜에게 다가갔습니다. 사냥 성공.'},
 {g:['reptile'],type:'neutral',when:()=>S.sp.id==='crested',t:'{n}이 유리벽에 딱 붙어 혀로 자기 눈을 핥았습니다.'},
 {g:['turtle','tortoise'],type:'good',t:'일광욕 램프 아래에서 다리를 쭉 펴고 잠들었습니다.',m:'따뜻한 램프 아래 낮잠.',h:4},
 {g:['turtle','tortoise'],type:'bad',when:()=>S.r<.5,t:'먹이를 너무 많이 줘서 등갑이 울퉁불퉁 솟아올랐습니다.',h:-3},
 {g:['turtle','tortoise'],type:'bad',w:1.2,when:()=>S.ageM>12&&home(),t:'{n}이 커지면서 사육장 냄새가 심해졌습니다. 가족들이 불평합니다.',i:-.15},
 {g:REPT.concat(['exotic']),type:'bad',once:'trend',when:()=>S.ageM>6&&home(),t:'유행이 지났습니다. 주인은 SNS에 {n}의 사진을 더 이상 올리지 않습니다.',i:-.2},

 /* ===== birds ===== */
 {g:BIRDS,type:'bad',when:()=>S.r<.6,t:'모이통엔 껍질만 남았는데 주인은 모이가 가득한 줄 알았습니다.',h:-7},
 {g:BIRDS,type:'good',t:'목욕 그릇에 뛰어들어 물을 사방에 튀겼습니다.',m:'첨벙첨벙 목욕.',h:3},
 {g:['bird'],type:'good',t:'{n}이 주인 휘파람을 따라 불었습니다.',m:'주인 휘파람을 따라 불었다. 주인이 웃었다.',mw:1.2,i:.15},
 {g:BIRDS,type:'good',once:'word1',when:()=>['budgie','cockatiel','grey','macaw'].includes(S.sp.id),t:'{n}이 처음으로 말을 했습니다. "밥 먹어!"',m:'처음 배운 말: "밥 먹어!" 다들 깜짝 놀랐다.',mw:1.4,i:.15},
 {g:BIRDS,type:'bad',t:'{n}이 주인 손가락을 피가 나도록 물었습니다.',i:-.06},
 {g:BIRDS,type:'neutral',t:'털갈이 시기라 깃털이 온 방에 날립니다.'},
 {g:BIRDS,type:'neutral',t:'{n}이 창문에 비친 자기 모습과 하루 종일 싸웠습니다.'},
 {g:BIRDS,type:'good',when:home,t:'주인이 새장 문을 열어 두고 {n}과 거실에서 놀았습니다.',m:'거실을 마음껏 날았다.',i:.14},
 {g:['bird'],type:'bad',once:'wingclip',when:()=>S.r<.5,t:'날아다니는 게 귀찮다며 주인이 {n}의 날개깃을 바짝 잘랐습니다. {n}은 횃대에서 떨어지기 일쑤입니다.',h:-8},
 {g:BIRDS,type:'bad',t:'밤에 놀라 새장 안에서 푸드덕거리다 날개를 부딪쳤습니다.',h:-5,sc:1},
 {g:['parrot'],type:'good',t:'{n}이 주인 목소리로 "사랑해"라고 말했습니다.',m:'"사랑해"라고 말했더니 주인이 울었다.',mw:1.6,i:.2},
 {g:['parrot'],type:'neutral',t:'{n}이 전화 벨소리를 똑같이 흉내 냅니다. 주인은 하루에 세 번 속습니다.'},
 {g:['parrot'],type:'bad',when:home,t:'{n}의 비명 같은 울음 때문에 관리사무소에 민원이 들어왔습니다.',i:-.15},
 {g:['parrot'],type:'neutral',t:'{n}이 리모컨 버튼을 전부 뜯어 놓았습니다.'},
 {g:['parrot','tortoise'],type:'neutral',once:'cites',when:()=>!S.smuggled&&home(),t:'국제적 멸종위기종이라 양도·양수 신고가 필요하다는 걸 주인이 뒤늦게 알았습니다.'},

 /* ===== festival birds ===== */
 {g:['chick'],type:'good',once:'peck1',stage:['baby'],t:'{n}이 처음으로 모이를 쪼아 먹었습니다.',m:'처음 쪼아 먹은 모이.'},
 {g:['chick'],type:'good',when:()=>S.ageM<4,t:'{n}이 주인 발뒤꿈치를 졸졸 따라다닙니다. 처음 본 사람을 엄마로 여기는 것입니다.',m:'커다란 발을 졸졸 따라다녔다. 엄마인 줄 알았다.',mw:1.3,i:.15},
 {g:['chick'],type:'neutral',t:'날개깃이 돋아나기 시작했습니다. 솜털이 듬성듬성 빠집니다.'},
 {g:['chick'],type:'bad',t:'{n}의 울음소리에 가족들이 밤잠을 설칩니다.',i:-.18},
 {g:['chick'],type:'good',when:()=>S.r>.4,t:'{n}이 보온등 아래에서 꾸벅꾸벅 졸았습니다.',m:'따뜻한 전구 아래 꾸벅꾸벅.',h:4},

 /* ===== insects / crab ===== */
 {g:['insect'],type:'good',t:'곤충 젤리를 새로 넣어 주었습니다.',m:'새 젤리가 달았다.',i:.1,h:6},
 {g:['insect'],type:'bad',once:'school',t:'방학이 끝났습니다. 아이는 더 이상 사육통을 들여다보지 않습니다.',i:-.4},
 {g:['insect'],type:'bad',when:()=>!fem(),t:'다른 수컷과 같은 사육통에 넣었더니 밤새 뿔싸움을 했습니다. 다리 하나가 떨어졌습니다.',h:-10},
 {g:['insect'],type:'bad',t:'사육통을 햇볕 드는 창가에 두었습니다. 통 안이 사우나가 되었습니다.',h:-8},
 {g:['insect'],type:'neutral',t:'{n}이 뒤집어져 버둥거렸습니다. 한참 뒤에 나뭇가지를 잡고 일어났습니다.'},
 {g:['crab'],type:'good',t:'{n}이 새 껍데기로 이사했습니다. 헌 껍데기를 한참 돌아봤습니다.',m:'새 껍데기로 이사했다.'},
 {g:['crab'],type:'bad',t:'바닷물 대신 수돗물을 넣어 주었습니다.',h:-12},

 /* ===== exotics ===== */
 {g:['exotic'],type:'bad',when:()=>S.sp.id==='fennec'&&home(),t:'밤에 깨어 있는 {n}을 낮마다 깨워 사진을 찍습니다.',h:-6},
 {g:['exotic'],type:'neutral',when:()=>S.sp.id==='fennec',t:'{n}이 밤새 장판을 긁으며 굴을 파는 시늉을 했습니다.'},
 {g:['exotic'],type:'neutral',when:()=>S.sp.id==='raccoon'&&home(),t:'{n}이 냉장고 문을 열고 달걀 한 판을 꺼냈습니다.'},
 {g:['exotic'],type:'good',when:()=>S.sp.id==='meerkat',t:'{n}이 두 발로 서서 창밖을 경계했습니다. 아무 일도 없었습니다.'},
 {g:['exotic'],type:'bad',w:1.4,when:()=>S.flags.cafeLife,t:'손님들이 하루 종일 {n}을 들어 올리고 플래시를 터뜨립니다.',h:-8,sc:1},
 {g:['exotic','parrot','tortoise'],type:'good',when:()=>S.flags.fac,t:'사육사가 {n}의 먹이를 놀잇감 속에 숨겨 두었습니다.',m:'사육사가 숨겨 둔 먹이를 찾아냈다.',h:6},
 {g:['exotic','parrot','tortoise'],type:'neutral',when:()=>S.flags.fac,t:'견학 온 학생들이 유리 너머로 {n}을 봅니다. 안내판에는 "밀수 압수 개체"라고 적혀 있습니다.'},

 /* ===== feeders ===== */
 {g:['feeder'],type:'neutral',w:3,t:'상자 안에서 다른 귀뚜라미들이 하나씩 핀셋에 집혀 나갑니다.'},
 {g:['feeder'],type:'neutral',t:'계란판 사이에서 다른 귀뚜라미가 울었습니다. 찌르르.'},
 {g:['fmouse'],type:'neutral',w:2,t:'좁은 플라스틱 통 안에 수십 마리가 함께 있습니다. 크기를 재는 손이 들어옵니다.'},

 /* ===== the owner's own life ===== */
 {g:OWNED,type:'good',once:'study',when:home,t:'주인이 {n}에 대해 공부하기 시작했습니다. 사육 카페 글을 밤새 읽었습니다.',m:'주인이 밤새 나에 대해 읽었다. 그날부터 집이 조금 더 편해졌다.',r:.08,i:.15},
 {g:OWNED,type:'good',w:.6,when:()=>home()&&S.once.study,t:'주인이 사육 영상을 보다가 {n}의 환경을 조금 바꿔 주었습니다.',r:.04,h:4},
 {g:OWNED,type:'bad',w:1.1,when:home,t:'주인의 야근이 잦아졌습니다. {n}은 하루 대부분을 혼자 보냅니다.',i:-.12},
 {g:OWNED,type:'bad',once:'newpet',w:.7,when:home,t:'새 반려동물이 들어왔습니다. 관심이 그쪽으로 옮겨 갑니다.',i:-.2},
 {g:OWNED,type:'good',once:'promo',w:.5,when:home,t:'주인이 승진했습니다. 기분이 좋은 주인이 {n}에게 비싼 간식을 사 왔습니다.',i:.08},
 {g:OWNED,type:'bad',once:'jobloss',w:.5,when:home,t:'주인이 회사를 그만뒀습니다. 사료가 제일 싼 것으로 바뀌었습니다.',r:-.06,fx:()=>{S.flags.broke=1}},
 {g:OWNED,type:'good',once:'newjob',w:.6,when:()=>home()&&S.flags.broke,t:'주인이 새 직장을 구했습니다. 원래 먹던 사료가 돌아왔습니다.',fx:()=>{S.flags.broke=0}},
 {g:LAND.concat(['fish','turtle']),type:'bad',once:'move',w:.8,when:()=>S.ageM>6&&home(),t:'이사 갈 집이 반려동물 불가라고 합니다. 주인이 한숨을 쉽니다.',fx:()=>{S.flags.moving=6}},
 {g:OWNED,type:'neutral',once:'moved',w:.7,when:()=>S.ageM>6&&home(),t:'이사를 했습니다. 낯선 냄새가 나는 집에서 {n}은 사흘 동안 거의 먹지 않았습니다.',h:-5,sc:1},
 {g:OWNED,type:'good',once:'marry',w:.3,when:()=>home()&&S.o.age<45&&S.o.fam==='1인 가구',t:'주인이 결혼했습니다. 새로 온 사람은 {n}을 무척 좋아합니다.',i:.1,m:'새 가족이 한 명 늘었다. 그 사람도 나를 좋아했다.',mw:1.2,fx:()=>{S.o.fam='부부'}},
 {g:OWNED,type:'bad',once:'marry',w:.2,when:()=>home()&&S.o.age<45&&S.o.fam==='1인 가구',t:'주인이 결혼했습니다. 새로 온 사람은 {n}을 보자마자 재채기를 했습니다. 알레르기입니다.',i:-.1,fx:()=>{S.o.fam='부부';S.flags.moving=8}},
 {g:OWNED,type:'bad',once:'divorce',w:.3,when:()=>home()&&S.o.fam==='부부',t:'주인 부부가 헤어졌습니다. 누가 {n}을 데려갈지로 오래 싸웠습니다.',i:-.1,fx:()=>{S.o.fam='1인 가구';if(R()<.35)q(null,null,()=>runBranch('rehome'))}},
 {g:FURRY.concat(BIRDS),type:'good',w:.6,when:home,t:'주인이 독감으로 일주일을 앓았습니다. {n}은 침대 곁을 떠나지 않았습니다.',m:'아픈 주인 곁을 지켰다.',mw:1.3},
 {g:OWNED,type:'bad',once:'hospital',w:.5,when:home,t:'주인이 수술을 받느라 2주간 입원했습니다.',fx:()=>{
   const o=wpick([['neighbor',4],['hotel',3],['alone',3]]);
   if(o==='neighbor') say('옆집 사람이 하루에 한 번 들러 {n}에게 밥을 주었습니다.','sub');
   else if(o==='hotel'){say('{n}은 2주 동안 펫호텔의 좁은 칸에서 지냈습니다.','sub');S.health-=5}
   else{say('아무도 오지 않았습니다. {n}은 2주 동안 처음 부어 둔 먹이로 버텼습니다.','bad');S.health-=25;breakP(2,'입원 중 방치')}}},
 {g:OWNED,type:'bad',once:'abroad',w:.35,when:()=>home()&&S.o.age<40,t:'주인이 해외 발령을 받았습니다.',fx:()=>{
   if(['dog','cat'].includes(S.sp.g)&&R()<.45){say('주인은 {n}을 데려가기로 했습니다. 검역 서류만 석 달이 걸렸습니다. {n}은 비행기 화물칸에서 열네 시간을 버텼습니다.','good');remember('춥고 시끄러운 화물칸. 문이 열리자 주인이 있었다.',1.6)}
   else q(null,null,()=>runBranch('rehome'))}},
 {g:OWNED,type:'bad',w:.6,when:()=>home()&&kids()>1,t:'주인 조카들이 놀러 와 {n}을 하루 종일 쫓아다녔습니다.',h:-4,sc:1},
 {g:FURRY.concat(BIRDS),type:'neutral',w:.5,when:home,t:'주인이 새벽에 술에 취해 들어와 {n}을 붙잡고 한 시간 동안 하소연했습니다.'},
 {g:LAND,type:'bad',once:'army',w:.5,when:()=>S.ageM>10&&S.o.age<28&&home(),t:'주인이 군에 입대합니다. {n}은 주인 부모님 집에 맡겨졌습니다.',fx:()=>{S.interest=Math.min(S.interest,.4);S.r=clamp(S.r-.1,0,1)}},
 {g:OWNED,type:'good',once:'discharge',w:.6,when:()=>home()&&S.once.army,t:'주인이 전역했습니다. 현관문을 열자마자 {n}에게 달려왔습니다.',m:'오래 기다린 발소리가 돌아왔다.',mw:1.6,i:.3},
 {g:OWNED,type:'bad',w:.5,when:()=>home()&&S.r<.4,t:'주인이 {n}을 중고거래 앱에 올렸다가, 문의가 없어 글을 내렸습니다.',i:-.05},
 {g:['rodent'],type:'bad',once:'pups',when:()=>!fem()&&S.r<.5,t:'암컷과 같이 두었더니 새끼 열두 마리가 태어났습니다. 남은 새끼들은 파충류 먹이 업자에게 넘어갔습니다.',fx:()=>breakP(4,'새끼를 먹이로 넘김')},
 {g:['reptile','snake'],type:'bad',once:'malebreed',when:()=>!fem()&&S.r<.5,t:'수컷 {n}은 여러 암컷 사육장을 번갈아 오갔습니다. 교배 중 다툼으로 꼬리 끝이 잘렸습니다.',h:-10,fx:()=>breakP(4,'교배에 돌려 씀')},
 {g:CARED,type:'good',w:.6,when:()=>S.r>.5&&home(),t:'정기 건강검진을 받았습니다. 모든 수치가 정상입니다.',h:6},
].concat(illEvents);
FLAV.forEach((f,i)=>f.i=i);
