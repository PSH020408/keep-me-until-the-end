/* ---------- v0.24 direction: what the stage does for the line being read ----------
   A recipe can set
     bg     a painting for this line (img/<bg>.webp); the fish stays in front of it
     pose   the fish's pose (jump, flop, charge, dizzy, proud, mouth, front, three) and how it moves (move)
     zone   where the fish may swim [x0,y0,x1,y1] (0..1 of the stage); small = shrink the fish for a busy painting
     actor  a painted animal / hand / prop entering the frame: [image, entrance]
     acc    something worn by the fish (headband, sunglasses…)
     owner  the owner's portrait slides in: 'normal' | 'smile' | 'panic'
     fx     particles · tint  colour grade · cam  shake | push | pulse · flash · tag  a short label (훈련 +5 …)
   The first rule that matches wins. Events can name their painting with `img` (see stVis / fevRun below). */

const DIR=[];const dir=(re,r)=>DIR.push([re,r]);
/* 육성 (career) lines first: they have fixed marks */
const D_GOAL={'첫 달':'goal-month1','첫 계절':'goal-season','다 자란 몸':'goal-grown','권태기':'goal-boredom','정전':'goal-blackout','노년의 겨울':'goal-winter'};
const D_CONTEST={'사진 콘테스트':'contest-photo','묘기 자랑':'contest-trick','품평회':'contest-show','물멍 마라톤':'contest-live','레이아웃':'contest-layout'};
const D_PAL={'주인':'owner','합사어':'mate','느림보':'snail','유리 속의 나':'mirror'};
dir(/^♥ (.+?) ([123])화/,m=>{const k=Object.keys(D_PAL).find(p=>m[1].includes(p))||'owner';return {bg:'career/bond-'+D_PAL[k]+'-'+m[2],pose:'proud',zone:[.55,.55,.85,.8],small:1,fx:'hearts'}});
dir(/^★ 우정 훈련/,(m,t)=>{const k=Object.keys(D_PAL).find(p=>t.includes(p)||t.includes(p.slice(0,2)))||'owner';return {bg:'career/friend-'+D_PAL[k],pose:'charge',fx:'speed',tag:'우정 훈련',cam:'push'}});
dir(/^훈련 실패/,{bg:'career/fail-hurt',pose:'dizzy',cam:'shake',tint:'dim'});
dir(/^◎ 고비 통과 — (.+?)\./,m=>{const k=Object.keys(D_GOAL).find(g=>m[1].includes(g));return {bg:'career/'+(D_GOAL[k]||'goal-grown'),pose:'proud',fx:'spark',tag:'고비 통과',flash:1}});
dir(/^✕ 고비 실패 — (.+?)\./,m=>{const k=Object.keys(D_GOAL).find(g=>m[1].includes(g));return {bg:'career/'+(D_GOAL[k]||'edge'),pose:'dizzy',tint:'dim',cam:'shake'}});
dir(/^🏆 (.+?) — 우승/,m=>{const k=Object.keys(D_CONTEST).find(c=>m[1].includes(c));return {bg:'career/'+(D_CONTEST[k]||'contest-show'),pose:'proud',zone:[.4,.55,.6,.72],fx:'spark',tag:'우승!',flash:1,owner:'smile'}});
dir(/^(.+?) — 아쉽게 졌습니다/,m=>{const k=Object.keys(D_CONTEST).find(c=>m[1].includes(c));return {bg:'career/'+(D_CONTEST[k]||'contest-show'),pose:'dizzy',tint:'dim'}});
dir(/^★ 스킬 「(.+?)」/,m=>{const s=typeof CAR_SK!=='undefined'&&CAR_SK.find(x=>x.n===m[1]);return {pose:'proud',fx:'spark',icon:s?skillIcon(s.k):'',tag:'스킬 획득',flash:1}});
dir(/스킬 「(.+?)」.*발동|발동했습니다/,m=>{const s=typeof CAR_SK!=='undefined'&&m[1]&&CAR_SK.find(x=>x.n===m[1]);return {pose:'proud',icon:s?skillIcon(s.k):'',tag:'스킬 발동!',flash:1,cam:'pulse'}});
dir(/벼랑 끝/,{bg:'career/edge',pose:'proud',tag:'벼랑 끝',cam:'push'});
dir(/계승|선배/,{bg:'career/legacy',pose:'proud',fx:'spark'});
dir(/깊이 쉬었|푹 쉬었|오래 잤|하루를 보냈습니다|반쯤만 쉬었|대충 쉬었/,{bg:'career/rest-sleep',pose:'three',move:'still',zone:[.4,.62,.6,.75]});
dir(/\(컨디션 ↑\)/,{bg:'career/rest-play',fx:'bubble'});
dir(/\(컨디션 ↓\)/,{bg:'career/rest-float',pose:'dizzy'});
/* 강의 수련 (river training) */
dir(/폭포/,{bg:'career/river-waterfall',pose:'jump',move:'leap',fx:'splash',cam:'push'});
dir(/왜가리와 눈싸움|왜가리가 먼저 고개/,{bg:'career/river-heron',pose:'front',zone:[.3,.6,.55,.8]});
dir(/미끼만|지렁이만/,{bg:'career/river-bait',pose:'mouth',actor:['prop/hook-worm','dangle']});
dir(/붕어 영감/,{bg:'career/river-elder',pose:'three',zone:[.55,.6,.8,.8]});
dir(/수박/,{bg:'career/river-melon',actor:['prop/watermelon','drift'],pose:'proud'});
dir(/수달 도장|새끼 수달/,{bg:'bg/otter-den',actor:['animal/otter-kids','right'],pose:'charge'});
/* 맞짱 · 수선조 · 폭주어단 */
dir(/수선조/,(m,t)=>({bg:/출동|순찰|단속|검문/.test(t)?'mob/suseon-march':'mob/suseon-form',acc:'suseon-headband',school:1,pose:/출동|순찰/.test(t)?'charge':'proud',tag:'수선조'}));
dir(/폭주어단/,(m,t)=>({bg:/폭주|레이스|질주/.test(t)?'mob/yankee-ride':'mob/yankee-form',acc:'yankee-shades',school:1,pose:/폭주|질주/.test(t)?'charge':'proud',tag:'폭주어단'}));
dir(/맞짱/,(m,t)=>({vs:1,pose:/이겼|쓰러|항복|서열 1위/.test(t)?'proud':/졌|밀려|숨었/.test(t)?'dizzy':'charge',cam:'shake',fx:'speed'}));
/* animals */
dir(/왜가리/,{actor:['animal/heron-stab','top'],tint:'danger',cam:'shake'});
dir(/수달/,{actor:['animal/otter-swim','right'],tint:'danger'});
dir(/가마우지/,{actor:['animal/cormorant-dive','dive'],tint:'danger',cam:'shake'});
dir(/「대장」|고양이/,(m,t)=>({actor:[/졌|고개를 숙|항복|부하/.test(t)?'animal/cat-lose':/잠|졸/.test(t)?'animal/cat-sleep':/바퀴벌레|공물|물어다/.test(t)?'animal/cat-gift':/앞발|발을 (넣|담)/.test(t)?'animal/cat-paw':'animal/cat-glare','peek'],tint:/졌|항복|부하/.test(t)?'':'danger'}));
dir(/배스|「블랙」/,(m,t)=>({actor:[/입을|삼키|덥석/.test(t)?'animal/bass-open':'animal/bass-glare','left'],tint:'danger',cam:'shake'}));
dir(/메기/,{actor:['animal/catfish-lie','bottom'],tint:'danger'});
dir(/상어/,{actor:['animal/shark','pass'],tint:'deep'});
dir(/문어/,{actor:['animal/octopus','left'],tint:'deep'});
dir(/고등어/,{actor:['animal/mackerel','pass']});
dir(/달팽이|「느림보」/,(m,t)=>({actor:[/숨|닫/.test(t)?'animal/snail-hide':/눈자루|노려/.test(t)?'animal/snail-eyes':'animal/snail-normal','glass']}));
/* the owner's hands and things */
dir(/뜰채|그물/,{actor:['hand/hand-net','top'],pose:'charge',cam:'shake',owner:'normal'});
dir(/낚싯|바늘|미끼|루어/,{actor:['prop/hook-worm','dangle']});
dir(/마룻바닥|바닥에서 몸을 (튕|퍼덕)|수조 밖 바닥|바닥으로 떨어졌|수건 위로 떨어|바닥에서 퍼덕|욕조 바닥에서/,{bg:'bg/floor',pose:'flop',move:'flop',zone:[.4,.7,.6,.78],cam:'shake'});
dir(/수면 위로 (몸을 날|뛰어)|뛰어올랐|뛰어오릅|점프|뚜껑을 (머리로 )?밀어/,{pose:'jump',move:'leap',fx:'splash'});
dir(/택배|상자/,{bg:'bg/box-cargo',actor:['prop/parcel','bottom'],tint:'dim'});
dir(/스티로폼/,{bg:'bg/box-cargo',actor:['prop/styro-box','bottom'],tint:'dim'});
dir(/봉지/,{bg:'bg/bag-crowd'});
dir(/정전|불 꺼진|불이 꺼|한밤중|새벽|밤새/,{tint:'night',fx:'bubble'});
dir(/물갈이|물을 (갈|반|채|조금씩)|양동이|수돗물/,{actor:['hand/hand-bucket','top'],fx:'bubble'});
dir(/사이펀|청소/,{actor:['prop/siphon','top']});
dir(/먹이|사료|과식|간식|알갱이/,{actor:['hand/hand-feed','top'],fx:'pellets',pose:'mouth'});
dir(/사진|카메라|촬영|영상|방송|휴대폰/,{actor:['hand/hand-phone','right'],flash:1,owner:'smile'});
dir(/유리를 (두드|톡톡)|손가락/,{actor:['hand/hand-point','glass'],pose:'front'});
dir(/손으로 (잡|움켜)|손바닥/,{actor:['hand/hand-grab','top'],cam:'shake'});
dir(/약을|약병|약품|소금욕|약욕/,{actor:['prop/medicine','drop'],tint:'sick'});
dir(/히터/,{actor:['prop/heater','glass'],tint:'hot'});
dir(/로봇청소기/,{actor:['prop/robovac','bottom']});
dir(/슬리퍼/,{actor:['prop/slipper','drift']});
dir(/레고/,{actor:['prop/lego','drop']});
dir(/케이크|생일/,{actor:['prop/cake','bottom'],fx:'spark',owner:'smile'});
dir(/맥주/,{actor:['prop/beer','glass'],owner:'normal'});
dir(/홍삼/,{actor:['prop/ginseng','drop']});
dir(/스피커|음악|노래/,{actor:['prop/speaker','glass'],fx:'hearts'});
dir(/뚜껑/,{actor:['prop/lid','top']});
/* moods */
dir(/병이|하얀 점|곰팡이|기생충|백점|지느러미가 녹|아가미가 (붉|부)|아팠/,{tint:'sick',pose:'three',move:'slow'});
dir(/장마|홍수|불어난|떠내려|물살/,{bg:'bg/flood',fx:'speed',pose:'charge',cam:'shake'});
dir(/여름|더위|뜨거|과열|폭염/,{tint:'hot'});
dir(/겨울|얼음|추위|차가운|살얼음/,{tint:'cold',fx:'snow'});
dir(/물렸|쪼아|싸움|공격|들이받|결투|박치기/,{pose:'charge',cam:'shake',fx:'speed'});
dir(/★|우승|이겼|수련의 성과|살아남/,{pose:'proud',fx:'spark'});
dir(/숨|산소|기포|뻐끔/,{pose:'mouth',fx:'bubble'});
/* v0.26: the last stand */
DIR.unshift([/벼랑 끝 승부 — 승리/,{pose:'proud',fx:'spark',flash:1,cam:'shake',tag:'역전!'}],[/벼랑 끝 승부 — 패배/,{pose:'dizzy',tint:'dark',tag:'…'}],[/해피 이벤트/,{fx:'hearts',flash:1,tag:'해피 이벤트'}]);

/* ---------- events name their own painting ---------- */
let CUR_EV=null;
(()=>{if(typeof fevRun!=='function')return;const _r=fevRun;fevRun=function(e){CUR_EV=e&&e.img?{img:valOf(e.img),id:e.id}:null;return _r.apply(this,arguments)}})();
(()=>{const _t=tick;tick=function(){if(!S||!S.pending)CUR_EV=null;return _t.apply(this,arguments)}})();
/* a function can also hand the next line a picture (training, rest…) */
let VIS_NEXT=null;
const stVis=v=>{VIS_NEXT=v};
(()=>{const _a=addLog;addLog=function(text,cls){_a(text,cls);const li=$('log').firstElementChild;if(li){if(VIS_NEXT){li._vis=VIS_NEXT;VIS_NEXT=null}else if(CUR_EV)li._vis={img:CUR_EV.img}}}})();
/* training: the facility's painting, the fish at full effort, the gain flashing up */
(()=>{if(typeof carTrain!=='function')return;const _t=carTrain;carTrain=function(k,ps,fr,fail){
  const c=typeof car==='function'&&car(),lv=c&&c.fac?c.fac[k]||1:1,st={p:'pow',g:'guts',w:'wits',c:'charm'}[k];
  /* v0.26: the living fish trains (a motion per training), and what it gained floats up */
  const v=st?{bg:'career/train-'+st+'-'+(lv>=3?5:1),train:k,fx:k==='p'?'speed':k==='c'?'hearts':k==='g'?'sweat':'spark',cam:'push',tag:CAR_STATS[k]+' 훈련'+(fr&&fr.length?' · ★우정':'')}:null;
  const before=typeof fst==='function'?Object.assign({},fst()):null;
  if(v)stVis(v);
  const r=_t.apply(this,arguments);
  if(v&&before){const now=fst(),g={};['p','g','w','c'].forEach(s=>{const d=Math.round((now[s]-before[s])*10);if(d)g[s]=d});v.gains=g}
  return r}})();
(()=>{if(typeof carRest!=='function')return;const _r=carRest;carRest=function(){stVis({bg:'career/rest-sleep',pose:'three',move:'still',zone:[.4,.62,.6,.75]});return _r.apply(this,arguments)}})();
(()=>{if(typeof carPlay!=='function')return;const _r=carPlay;carPlay=function(){stVis({bg:'career/rest-play',fx:'bubble'});return _r.apply(this,arguments)}})();

/* ---------- apply ---------- */
function dirFor(text,li){
  if(li&&li._vis&&!/^훈련 실패|^✕|아쉽게 졌/.test(text||'')){const v=li._vis;if(v.img){const r=dirImg(v.img);return Object.assign(r,v,{img:undefined})}return v}
  if(!text)return null;
  for(const [re,r] of DIR){const m=text.match(re);if(m)return typeof r==='function'?r(m,text):Object.assign({},r)}
  return null;
}
/* an event painting: a full scene; gag paintings leave the lower right for the fish */
function dirImg(img){
  if(/^gag\//.test(img))return {bg:img,zone:[.68,.66,.86,.82],small:1};
  if(/^mob\/suseon-/.test(img))return {bg:img,school:1,acc:'suseon-headband',tag:'수선조',pose:/march/.test(img)?'charge':'proud'};
  if(/^mob\/yankee-/.test(img))return {bg:img,school:1,acc:'yankee-shades',tag:'폭주어단',pose:/ride/.test(img)?'charge':'proud'};
  return {bg:img};
}
function stDirect(text,li){
  if(!STG.el||!S||!S.f)return;
  if(S.done||(S.ending&&S.fx)){stClearDir();return}
  let d=dirFor(text,li);
  if(!d&&!text&&CUR_EV&&CUR_EV.img)d=dirImg(CUR_EV.img);
  /* the owner's face when the owner speaks or acts, from the moment someone owns the fish */
  if(text&&!S.preOwner&&!S.wild&&/주인/.test(text)){d=d||{};if(!d.owner)d.owner=li&&/good|star/.test(li.className)?'smile':li&&/bad/.test(li.className)?'panic':'normal'}
  stApply(d);
}
function stClearDir(){stApply(null)}
function stApply(d){
  const prev=STG.dir;STG.dir=d||null;const el=STG.el;if(!el)return;
  /* background for this line, or back to where the fish is; the fish keeps swimming where it was */
  const P=stPlace();drawStage(true);
  STG.el.classList.toggle('solo',!!(d&&d.small));STG.el.classList.toggle('schoolmode',!!(d&&d.school));
  const F=STG.fish;
  if(F){
    if(d&&d.pose)F.setPose(d.pose,d.move||d.pose);else stFishState(P);
    F.script=d&&d.train?{k:d.train,t:0}:null;if(F.script)F.setPose(null);
    if(STG.baseLen)F.setLen(STG.baseLen*(d&&d.small?.55:d&&d.big?1.2:1));
    F.o.speed=d&&d.move==='still'?.15:d&&d.move==='slow'?.4:1;
    /* worn things */
    let acc=F.inner.querySelector('.acc');if(d&&d.acc){if(!acc){acc=document.createElement('img');acc.alt='';F.inner.appendChild(acc)}acc.className='acc acc-'+d.acc.split('-')[1];acc.src='img/mob/'+d.acc+'.webp'}else if(acc)acc.remove();
    if(d&&d.zone){F.tx=(d.zone[0]+d.zone[2])/2;F.ty=(d.zone[1]+d.zone[3])/2}
  }
  if(d&&d.school&&STG.mates.filter(m=>m.id===S.sp.id).length<4){const host=STG.world;for(let i=0;i<5;i++){const m=new Swimmer(S.sp.id,{mate:1,speed:.9});m.el.classList.add('same');m.r=.86+Math.random()*.14;m.x=.2+i*.14;m.y=.6+(i%2)*.1;m.tx=m.x;m.ty=m.y;m.setLen(Math.round((STG.baseLen||120)*m.r));host.insertBefore(m.el,STG.fish?STG.fish.el:null);STG.mates.push(m)}}
  if(d&&d.school&&d.acc)STG.mates.filter(m=>m.id===S.sp.id).forEach(m=>{if(m.inner.querySelector('.acc'))return;const a=document.createElement('img');a.alt='';a.className='acc acc-'+d.acc.split('-')[1];a.src='img/mob/'+d.acc+'.webp';m.inner.appendChild(a)});
  STG.mates.forEach(m=>{if(!(d&&d.acc)){const a=m.inner.querySelector('.acc');if(a)a.remove()}});
  /* actors */
  const ak=d&&d.actor?d.actor.join('|'):'';
  if(STG.props.dataset.k!==ak){STG.props.dataset.k=ak;STG.props.innerHTML='';
    if(ak){const [img,how]=d.actor;const a=document.createElement('img');a.alt='';a.className='prop in-'+how+(/^hand\//.test(img)?' hand':'');a.src='img/'+img+'.webp';STG.props.appendChild(a)}}
  if(d&&d.vs)stVs();
  /* light and camera */
  el.dataset.tint=d&&d.tint||'';
  STG.cam.classList.remove('shake','push','pulse');void STG.cam.offsetWidth;if(d&&d.cam)STG.cam.classList.add(d.cam);
  stFx('clear');if(d&&d.fx)stFx(d.fx);
  if(d&&d.flash){STG.flash.classList.remove('go');void STG.flash.offsetWidth;STG.flash.classList.add('go')}
  if(d&&d.gains)stGains(d.gains);
  /* cut-ins */
  stCut(d);
}
/* numbers that float up from the fish: 힘 +32 */
function stGains(g){
  const box=STG.fx;if(!box)return;box.querySelectorAll('.gain').forEach(e=>e.remove());
  const F=STG.fish,W=box.clientWidth||300,H=box.clientHeight||200;let i=0;
  Object.entries(g).forEach(([k,v])=>{const e=document.createElement('div');e.className='gain fx-tmp';e.dataset.k=k;
    e.textContent=(typeof CAR_STATS!=='undefined'?CAR_STATS[k]:k)+(v>0?' +':' ')+v;
    e.style.left=Math.round((F?F.x:.5)*100)+'%';e.style.top=Math.round((F?F.y:.5)*100-12-i*9)+'%';e.style.animationDelay=(.25+i*.18)+'s';box.appendChild(e);i++});
}
/* the owner's portrait, a label, a skill icon */
function stCut(d){
  const c=STG.cut;if(!c)return;
  let o=c.querySelector('.cut-owner');
  const src=d&&d.owner?ownerImg(d.owner):'';
  if(src){if(!o){o=document.createElement('div');o.className='cut-owner';o.innerHTML='<img alt=""><span class="nm"></span>';c.appendChild(o)}
    const im=o.querySelector('img');if(im.getAttribute('src')!==src){im.src=src;o.classList.remove('in');void o.offsetWidth}o.classList.add('in');
    o.querySelector('.nm').textContent=(S.o&&S.o.name?S.o.name:'주인')+(S.f.kind&&KIND[S.f.kind]?' · '+KIND[S.f.kind].l:'')}
  else if(o)o.classList.remove('in');
  let t=c.querySelector('.cut-tag');if(t)t.remove();
  if(d&&(d.tag||d.icon)){t=document.createElement('div');t.className='cut-tag';t.innerHTML=(d.icon?'<img alt="" src="'+d.icon+'">':'')+'<b></b>';t.querySelector('b').textContent=d.tag||'';c.appendChild(t)}
  let v=c.querySelector('.cut-vs');if(v&&!(d&&d.vs))v.remove();
}
/* 맞짱: a split frame, the opponent glaring from the right */
function stVs(){
  const c=STG.cut;if(c.querySelector('.cut-vs'))return;
  const bl=typeof fBully==='function'&&fBully();const opp=bl&&RIG[bl.id]?fishImg(bl.id,'mouth'):'img/mob/'+pick(['barb','angel','gourami'])+'-glare.webp';
  const v=document.createElement('div');v.className='cut-vs';v.innerHTML='<img alt="" class="vs-frame" src="img/ui/vs-frame.webp"><img alt="" class="vs-opp"><b>VS</b>';v.querySelector('.vs-opp').src=opp;c.appendChild(v);
}

/* the story box calls this for each line it shows (and with null when no line is waiting) */
let EV_CUR=null;
function evSet(text,li){EV_CUR=text||null;try{stDirect(text,li||null)}catch(e){if(typeof console!=='undefined')console.error(e)}}

/* the side card follows every render */
(()=>{const _r=render;render=function(){const r=_r.apply(this,arguments);try{panelDraw()}catch(e){}return r}})();

/* the last stand's choice looks like a crisis */
(()=>{const _a=askChoice;askChoice=function(c,cb){const r=_a.apply(this,arguments);try{if(c&&/벼랑 끝/.test(c.who||'')){const b=$('choice');if(b&&b.classList)b.classList.add('crisis');if(typeof stApply==='function')stApply({cam:'shake',flash:1,tint:'dark',tag:'벼랑 끝 승부'})}}catch(e){}return r}})();
