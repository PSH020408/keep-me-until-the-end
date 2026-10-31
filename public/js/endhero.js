/* ---------- v0.24.2 the result screen, Uma Musume × Gintama ----------
   · the ending's painting with the fish's last pose, a stamp, and the episode title 「제N훈 …」 on a brush scroll
   · a result card: the grade letter, the title, the four stats as rank letters, a few numbers
   · instead of a lecture, the narrator's "next episode" preview
   N is the life's number in 육성 기록. Comedy throughout; the life itself was told straight in the story. */

const SUB_FX={
 'f-floor':['마룻바닥은 바다가 아니다','점프는 착지까지가 점프다'],
 'f-escape':['탈출 계획은 착지 지점부터 짜라','자유는 생각보다 건조했다'],
 'f-burst':['수조가 깨지면 인생도 금이 간다'],
 'f-float':['배를 뒤집는 건 항복이 아니라 물갈이 요청이다','나쁜 물고기는 없다. 나쁜 수질만 있을 뿐'],
 'f-bottom':['바닥에 누운 건 쉬는 게 아니다. 아프다는 거다, 이 바보야','아프면 아프다고 해라. 뻐끔으로'],
 'f-thin':['배꼽시계는 주인 휴대폰 알람보다 정확하다','사료는 마음으로 주는 게 아니라 손으로 주는 거다'],
 'f-eaten':['먹는 쪽과 먹히는 쪽은 입 크기로 정해진다','합사는 같은 반 배정이 아니다'],
 'f-shopeaten':['판매 수조에서는 옆집 이웃이 저녁 메뉴다'],
 'f-ice':['열대어한테 사계절은 사치다','히터는 장식품이 아니다'],
 'f-freezer':['냉동실은 겨울잠 자는 방이 아니다'],
 'f-cook':['목욕물 온도는 사람 기준으로 정하지 마라'],
 'f-poison':['약은 약사에게, 물고기는 물고기에게'],
 'f-intake':['흡입구는 미끄럼틀이 아니다'],'f-siphon':['청소기는 물고기를 청소하는 기계가 아니다'],
 'f-toilet':['변기 물은 바다로 안 간다. 하수처리장으로 간다'],
 'f-bag':['봉지 속 물은 무한 리필이 아니다'],'f-box':['택배 상자에는 반품 버튼이 없다'],
 'f-unsold':['할인 스티커는 생명의 가격표가 아니다'],'f-shop':['할인 스티커는 생명의 가격표가 아니다'],'f-shopnip':['진열대에도 일진은 있다'],
 'f-nipped':['합사는 사랑이 아니라 외교다'],
 'f-net':['뜰채는 언제나 위에서 온다. 위를 봐라'],'f-bucket':['양동이는 집이 아니다. 대기실도 아니다'],
 'f-hand':['손바닥은 수조가 아니다'],
 'f-cat':['고양이는 물을 싫어한다. 물고기는 좋아한다'],'f-angler':['공짜 지렁이에는 바늘이 들어 있다'],
 'f-sun':['웅덩이는 기다려 주지 않는다. 해도 기다려 주지 않는다'],'f-trash':['쓰레기통은 분리수거만 받는다'],
 'f-glass':['유리병은 인테리어고, 물고기는 소품이 아니다'],'f-stall':['축제 금붕어도 축제가 끝나면 그냥 금붕어다'],
 'f-euth':['편히 보내 주는 것도 주인의 레벨업이다'],'f-aquarium':['구경하는 쪽도 유리 한 장 너머에선 구경거리다'],
 'f-pond':['연못은 하늘이 뚫린 수조다. 왜가리도 그걸 안다']
};
const SUB_END={'GIN-WK-H':['하천의 왕은 왕관 대신 비늘을 쓴다'],'GIN-SEA':['세계관이 좁으면 넓히면 된다'],'GIN-ESC':['고향은 수조가 아니라 한강이었다'],
 'GIN-POND':['저수지의 주인은 등기부가 아니라 붕어들이 정한다'],'GIN-CAT':['고양이도 결국 털 달린 생선 애호가일 뿐이다'],'GIN-CAT2':['고양이도 결국 털 달린 생선 애호가일 뿐이다']};
const SUB_CALM=['오래 사는 비결? 오래 사는 것이다','끝까지 살아남은 놈이 결국 주인공이다','장수의 비결은 주인 뽑기 운이다'];
const SUB_PRE=['1화에서 퇴장하는 주인공도 있다','주인 얼굴도 못 보고 엔딩 크레딧'];
const subHash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
const endFx=()=>{let fx=S.fx||'f-bottom';return (typeof END_ALIAS!=='undefined'&&END_ALIAS[fx])||fx};
function lifeSub(){
  const f=S.f||{},ek=typeof stEndKey==='function'?stEndKey():'',seed=(S.disp||'')+S.ageM;
  const pickS=a=>a[subHash(seed)%a.length];
  const flag=k=>typeof fl==='function'&&fl(k);
  if(SUB_END[ek])return pickS(SUB_END[ek]);
  if(flag('catboss'))return '고양이도 결국 털 달린 생선 애호가일 뿐이다';
  if(flag('suseon_cap'))return '규율은 사료 시간 3분 전까지만 지켜라';
  if(flag('yankee_cap'))return '폭주에도 수온 관리는 필요하다';
  if(flag('suseon'))return '무리를 지으면 머리띠가 생긴다';
  if(flag('yankee'))return '양아치에게도 밥때는 있다';
  if((flag('duel_win')||0)>=2)return '서열은 지느러미가 아니라 이마로 정하는 것이다';
  const c=f.car;if(c&&(c.wins||0)>=3)return '상장은 벽이 모자랄 때까지 받는 것이다';
  if(S.calm)return S.wild?'강은 월세를 받지 않는다':pickS(SUB_CALM);
  if(S.preOwner)return pickS(SUB_PRE);
  const fx=endFx();
  if(SUB_FX[fx])return pickS(SUB_FX[fx]);
  return '물고기에게도 할 말은 있다. 다만 뻐끔으로 들릴 뿐이다';
}
/* the narrator's preview of the next life (the episode is over; the narrator is not) */
const YOKOKU_FX={
 'f-floor':['「착지술을 배우자」','점프 착지술은 SP 60입니다. 광고 아닙니다.'],
 'f-escape':['「뚜껑, 그것은 사랑」','주인에게 뚜껑 하나만 사 달라고 하세요. 하나면 됩니다.'],
 'f-float':['「물은 갈아라, 주인아」','이 화면을 주인에게 보여 주세요. 주인은 지금 휴대폰을 보고 있습니다.'],
 'f-bottom':['「아프면 병원에 가라」','물고기 병원도 있습니다. 진짜로 있습니다.'],
 'f-thin':['「밥은 먹고 다니냐」','다음 생에는 사료 통이 손 닿는 곳에 있기를.'],
 'f-eaten':['「먹이사슬 거꾸로 오르기」','다음 생에는 입이 큰 쪽으로 태어나세요.'],
 'f-shopeaten':['「이웃을 고르는 법」','진열대 배치는 가게 사장님 소관입니다. 항의는 사장님께.'],
 'f-ice':['「히터를 켜라」','열대어 대표로 한마디: 추워요.'],'f-cook':['「히터를 꺼라」','지난 화와 정반대 부탁입니다. 적당히가 제일 어렵습니다.'],
 'f-poison':['「약통 내려놓으세요」','약은 정량. 정량이 뭔지 모르면 넣지 마세요.'],
 'f-toilet':['「하수도 대모험」','하수도에서 살아남는 물고기는 없습니다. 이건 개그가 아닙니다. 아, 개그 코너였죠.'],
 'f-cat':['「고양이 무시 스킬을 배우자」','고양이 무시는 SP 40입니다. 고양이는 SP를 모릅니다.'],
 'f-box':['「택배는 빠른 배송으로」','상자 안은 생각보다 길고 어둡습니다. 별점 하나.'],
 'f-bag':['「봉지 탈출」','봉지 속 산소는 생각보다 빨리 떨어집니다. 사장님, 산소 좀 더요.']
};
function yokoku(){
  const ek=typeof stEndKey==='function'?stEndKey():'',fx=endFx();
  if(/^GIN-/.test(ek)||S.calm)return ['「끝까지 살아 버렸다」','작가가 엔딩 그림을 한 장 더 그려야 해서 곤란해졌습니다. 다음 생도 이렇게 부탁드립니다.'];
  if(S.preOwner)return ['「이번엔 가게 수조까지는 가 보자」','주인공이 1화에서 퇴장하는 작품도 있습니다. 이 작품입니다.'];
  return YOKOKU_FX[fx]||['「다음엔 진짜 끝까지」','예고는 예고일 뿐, 실제 생과 다를 수 있습니다. 대개 더 험합니다.'];
}
/* a title when there was no career to grade (a life that ended before an owner) */
const END_TITLE={'f-eaten':'누군가의 저녁 식사','f-shopeaten':'진열대의 간식','f-floor':'마룻바닥 탐험가','f-escape':'탈출 전문가(착지 미숙)','f-float':'수면 위의 별','f-bag':'봉지 속의 철학자','f-box':'택배 상자 속 VIP','f-unsold':'재고 1위','f-shop':'특가 상품','f-net':'뜰채의 인연','f-bucket':'양동이 동기','f-stall':'축제의 주인공(이었던)','f-toilet':'하수도 원정대'};
const lifeEp=()=>(typeof mem!=='undefined'&&mem?mem.length:0)+1;

function endHero(){
  const E=$('ending');if(!E||!S||!S.f)return;
  const P=typeof stEndScene==='function'?stEndScene():{bg:'end/f-rest',pose:'swim'};
  S.sub=S.sub||lifeSub();S.ep=S.ep||lifeEp();
  E.classList.add('uma-end');
  /* the lecture and the "in reality" box give way to the narrator */
  [...E.children].forEach(ch=>{if(ch.classList.contains('fact')||ch.classList.contains('ask'))ch.remove()});
  const glory=!!(S.calm||/^GIN-/.test(stEndKey()));
  /* 1. the painting */
  const h=document.createElement('div');h.className='endhero'+(glory?' glory':'');
  h.innerHTML='<img alt="" class="eh-bg"><div class="eh-fish"><img alt=""></div><div class="eh-vig"></div>'+
    '<div class="eh-sub"><img alt="" src="img/ui/subtitle-card.webp"><div class="eh-t"><span class="eh-ep"></span><b class="eh-s"></b></div></div>'+
    '<div class="eh-stamp"></div><p class="eh-cap"></p>';
  h.querySelector('.eh-bg').src='img/'+P.bg+'.webp';
  const fi=h.querySelector('.eh-fish');fi.dataset.lie=P.lie||'';
  if(P.pose)fi.querySelector('img').src=fishImg(S.sp.id,P.pose==='swim'?null:P.pose);
  else{fi.remove();h.querySelector('.eh-cap').textContent='※ 본인은 이번 장면에 출연하지 않습니다. 사정이 있습니다.'}
  h.querySelector('.eh-ep').textContent='제'+S.ep+'훈';
  h.querySelector('.eh-s').textContent=S.sub;
  h.querySelector('.eh-stamp').textContent=glory?'끝까지 생존!':S.preOwner?'1화 퇴장':'육성 종료';
  /* 2. the result card */
  const c=S.f.car,res=c&&c.result,old=E.querySelector('.grade');if(old)old.remove();
  const card=document.createElement('div');card.className='endcard';
  const rank=res?res.rank:'G',title=res?res.title:(END_TITLE[endFx()]||(S.preOwner?'1화 퇴장 전문 배우':'수조의 엑스트라'));
  const desc=res?res.desc:(S.preOwner?'주인 얼굴은 못 봤지만, 형제들 사이에서는 꽤 유명했습니다.':'다음 생에는 훈련부터 해 봅시다.');
  card.innerHTML='<div class="ec-rank"><small>평가</small><span class="rk"></span></div><div class="ec-main"><span class="ec-lab">칭호</span><b class="ec-title"></b><p class="ec-desc"></p></div>'+
    '<div class="ec-stats"></div><div class="ec-nums"></div>';
  card.querySelector('.rk').textContent=rank;card.querySelector('.ec-rank').dataset.rg=typeof rankGroup==='function'?rankGroup(rank):'';
  card.querySelector('.ec-title').textContent='「'+title+'」';card.querySelector('.ec-desc').textContent=desc;
  const sb=card.querySelector('.ec-stats');
  if(typeof fst==='function'&&typeof statRank==='function'){const st=fst();
    [['p','힘'],['g','근성'],['w','지능'],['c','매력']].forEach(([k,n])=>{const d=document.createElement('div');d.className='ec-st';d.dataset.k=k;const r=statRank(k);
      d.innerHTML='<span class="n"></span><b class="rk"></b><span class="v"></span>';d.querySelector('.n').textContent=n;d.querySelector('.rk').textContent=r;d.dataset.rg=rankGroup(r);d.querySelector('.v').textContent=Math.round(st[k]*10);sb.appendChild(d)})}
  const nums=[['산 기간',ageLabel(S.ageM)],['기대수명 대비',Math.round(Math.min(1,S.ageM/S.sp.life)*100)+'%']];
  if(c){nums.push(['넘은 고비',(c.gpass||0)+'개']);nums.push(['익힌 스킬',Object.keys(c.sk||{}).length+'개'])}
  if(S.owners)nums.push(['거친 주인',S.owners+'명']);
  const nb=card.querySelector('.ec-nums');nums.forEach(([a,b])=>{const d=document.createElement('div');d.innerHTML='<span></span><b></b>';d.firstChild.textContent=a;d.lastChild.textContent=b;nb.appendChild(d)});
  /* 3. next episode */
  const [yt,yl]=yokoku();
  const y=document.createElement('div');y.className='yokoku';
  y.innerHTML='<span class="yk-who">나레이션</span><p><b>다음 생 예고</b> <i></i></p><p class="yk-l"></p>';
  y.querySelector('i').textContent=yt;y.querySelector('.yk-l').textContent=yl;
  /* order: painting, card, the story's highlights (turnui), the rest, the preview just before the buttons */
  E.insertBefore(card,E.firstChild);E.insertBefore(h,card);
  const keep=E.querySelector('.keep');E.insertBefore(y,keep||E.querySelector('.row'));
  const cmp=E.querySelector('.compare');if(cmp)cmp.remove();
  /* the career's own grade box (added by another wrapper) is folded into the card */
  setTimeout(()=>{const g=E.querySelector(':scope > .grade');if(g)g.remove()},0);
}
(()=>{const _e=showEnd;showEnd=function(){const r=_e.apply(this,arguments);try{endHero()}catch(e){if(typeof console!=='undefined')console.error(e)}return r}})();
(()=>{const _l=lifeRecord;lifeRecord=function(){const r=_l.apply(this,arguments);try{r.sub=S.sub||lifeSub();r.ep=S.ep||lifeEp()}catch(e){}return r}})();
/* 육성 기록 lists each life by its episode title */
(()=>{const _d=drawMem;drawMem=function(){const r=_d.apply(this,arguments);try{
  const ul=$('memList');const list=memAll?mem:mem.slice(0,8);[...ul.children].forEach((li,i)=>{const m=list[i];if(!m||!m.sub)return;const s=document.createElement('span');s.className='msub';s.textContent='제'+(m.ep||'?')+'훈 「'+m.sub+'」';li.querySelector('.mrow').prepend(s)})}catch(e){}return r}})();
try{drawMem()}catch(e){}
/* a fresh life forgets the last one's title */
(()=>{const _s=start;start=function(){if(S){S.sub=null;S.ep=null}const E=$('ending');if(E)E.classList.remove('uma-end');return _s.apply(this,arguments)}})();
