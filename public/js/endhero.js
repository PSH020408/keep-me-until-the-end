/* ---------- v0.24 the result screen: the ending's painting, the fish's last pose, and an episode title ----------
   Every life gets a numbered episode title, the way a long-running comedy titles its episodes: 「제N훈 …」.
   N is the life's number in 육성 기록; the title says, in one line, what kind of fish this was. */

const SUB_FX={
 'f-floor':['바닥은 생각보다 딱딱하다','뚜껑은 닫으라고 있는 것이다','저 너머가 궁금했을 뿐인데 바닥이 먼저 왔다'],
 'f-escape':['뚜껑은 닫으라고 있는 것이다','탈출은 성공했다. 착지가 문제였을 뿐이다'],
 'f-burst':['유리는 생각보다 얇고, 마룻바닥은 생각보다 넓다'],
 'f-float':['물은 갈아 주라고 있는 것이다','수면 위의 불빛은 생각보다 멀다'],
 'f-bottom':['아프다고 말할 입이 있었다면 뻐끔이라도 크게 했을 것이다','바닥에도 바닥 나름의 사정이 있다'],
 'f-thin':['배꼽시계는 주인이 잊어도 울린다','밥그릇 소리는 기다리는 쪽만 기억한다'],
 'f-eaten':['먹이사슬은 위에서부터 읽는 게 아니다','큰 입 앞에서는 철학도 소용없다'],
 'f-shopeaten':['먹이사슬은 위에서부터 읽는 게 아니다'],
 'f-ice':['열대어에게 겨울은 장르가 다르다'],'f-freezer':['냉동실은 겨울잠 자는 곳이 아니다'],
 'f-cook':['따뜻한 것과 뜨거운 것은 한 글자 차이다'],
 'f-poison':['약도 많이 넣으면 독이고, 정성도 많이 넣으면 연금술이다'],
 'f-intake':['흡입구 앞에서는 모두가 평등하다'],'f-siphon':['청소는 물고기를 피해서 하는 것이다'],
 'f-toilet':['변기는 바다로 통하지 않는다'],
 'f-bag':['봉지 속 물은 생각보다 금방 끝난다'],'f-box':['택배 상자 속에도 인생은 있다'],
 'f-unsold':['가격표가 붙는 순간 생은 숫자가 된다'],'f-shop':['가격표가 붙는 순간 생은 숫자가 된다'],'f-shopnip':['진열대에도 서열은 있다'],
 'f-nipped':['합사는 사랑이 아니라 외교다'],
 'f-net':['뜰채는 늘 위에서 온다'],'f-bucket':['양동이는 집이 아니다'],
 'f-hand':['손바닥 위는 세상에서 가장 넓고 가장 마른 곳이다'],
 'f-cat':['고양이의 앞발은 물보다 빠르다'],'f-angler':['미끼가 공짜인 적은 한 번도 없었다'],
 'f-sun':['웅덩이는 기다려 주지 않는다'],'f-trash':['버려진 자리에서도 생은 끝까지 생이었다'],
 'f-glass':['작은 유리병 속에도 계절은 바뀐다'],'f-stall':['축제의 불빛은 금붕어에게 너무 밝았다'],
 'f-euth':['편안하게 보내 주는 것도 키우는 일의 끝이다'],'f-aquarium':['구경하는 쪽과 구경당하는 쪽은 유리 한 장 차이다'],
 'f-pond':['연못은 넓지만 하늘은 더 넓고, 새는 그 하늘에서 온다']
};
const SUB_END={'GIN-WK-H':['하천의 왕은 왕관 대신 비늘을 쓴다'],'GIN-SEA':['세계관이 좁으면 넓히면 된다'],'GIN-ESC':['고향은 수조가 아니라 마음속에 있다'],
 'GIN-POND':['저수지의 주인은 등기부가 아니라 붕어들이 정한다'],'GIN-CAT':['고양이도 결국 털 달린 생선 애호가일 뿐이다'],'GIN-CAT2':['고양이도 결국 털 달린 생선 애호가일 뿐이다']};
const SUB_CALM=['끝까지 살아남은 놈이 결국 주인공이다','긴 생은 거창한 게 아니라 매일 먹은 사료 한 알이다','오래 사는 비결은 오래 사는 것이다'];
const subHash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
function lifeSub(){
  const f=S.f||{},ek=typeof stEndKey==='function'?stEndKey():'',seed=(S.disp||'')+S.ageM;
  const pickS=a=>a[subHash(seed)%a.length];
  const flag=k=>typeof fl==='function'&&fl(k);
  if(SUB_END[ek])return pickS(SUB_END[ek]);
  if(flag('catboss'))return '고양이도 결국 털 달린 생선 애호가일 뿐이다';
  if(flag('suseon_cap'))return '규율은 사료 시간 3분 전까지만 지켜라';
  if(flag('yankee_cap'))return '폭주에도 수온 관리는 필요하다';
  if(flag('suseon'))return '무리를 지으면 그게 곧 규율이 된다';
  if(flag('yankee'))return '양아치에게도 밥때는 있다';
  if(flag('duel_win')>=2)return '서열은 지느러미가 아니라 이마로 정하는 것이다';
  const c=f.car;if(c&&(c.wins||0)>=3)return '상장은 벽이 모자랄 때까지 받는 것이다';
  if(S.calm)return S.wild?'강은 집세를 받지 않는다':pickS(SUB_CALM);
  if(S.preOwner)return '주인을 만나기 전에도 생은 이미 시작되어 있었다';
  let fx=S.fx||'f-bottom';fx=(typeof END_ALIAS!=='undefined'&&END_ALIAS[fx])||fx;
  if(SUB_FX[fx])return pickS(SUB_FX[fx]);
  return '물고기에게도 할 말은 있다. 다만 뻐끔으로 들릴 뿐이다';
}
/* the episode number: this life's place in 육성 기록 */
const lifeEp=()=>(typeof mem!=='undefined'&&mem?mem.length:0)+1;

function endHero(){
  const E=$('ending');if(!E||!S||!S.f)return;
  const P=typeof stEndScene==='function'?stEndScene():{bg:'end/f-rest',pose:'swim'};
  S.sub=S.sub||lifeSub();S.ep=S.ep||lifeEp();
  const h=document.createElement('div');h.className='endhero';
  h.innerHTML='<img alt="" class="eh-bg"><div class="eh-fish"><img alt=""></div><div class="eh-vig"></div>'+
    '<div class="eh-sub"><img alt="" src="img/ui/subtitle-card.webp"><div class="eh-t"><span class="eh-ep"></span><b class="eh-s"></b></div></div>';
  h.querySelector('.eh-bg').src='img/'+P.bg+'.webp';
  const fi=h.querySelector('.eh-fish');fi.dataset.lie=P.lie||'';
  if(P.pose)fi.querySelector('img').src=fishImg(S.sp.id,P.pose==='swim'?null:P.pose);else fi.remove();
  h.querySelector('.eh-ep').textContent='제'+S.ep+'훈';
  h.querySelector('.eh-s').textContent=S.sub;
  E.insertBefore(h,E.firstChild);
}
(()=>{const _e=showEnd;showEnd=function(){const r=_e.apply(this,arguments);try{endHero()}catch(e){if(typeof console!=='undefined')console.error(e)}return r}})();
(()=>{const _l=lifeRecord;lifeRecord=function(){const r=_l.apply(this,arguments);try{r.sub=S.sub||lifeSub();r.ep=S.ep||lifeEp()}catch(e){}return r}})();
/* 육성 기록 lists each life by its episode title */
(()=>{const _d=drawMem;drawMem=function(){const r=_d.apply(this,arguments);try{
  const ul=$('memList');const list=memAll?mem:mem.slice(0,8);[...ul.children].forEach((li,i)=>{const m=list[i];if(!m||!m.sub)return;const s=document.createElement('span');s.className='msub';s.textContent='제'+(m.ep||'?')+'훈 「'+m.sub+'」';li.querySelector('.mrow').prepend(s)})}catch(e){}return r}})();
try{drawMem()}catch(e){}
/* a fresh life forgets the last one's title */
(()=>{const _s=start;start=function(){if(S){S.sub=null;S.ep=null}return _s.apply(this,arguments)}})();
