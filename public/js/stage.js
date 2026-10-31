/* ---------- v0.24 stage: painted scenes, a rigged fish, cut-ins ----------
   Replaces the SVG stage (art.js, art/*.js). Everything on screen is a painting from img/ (made from the GPT sheets
   by tools/import_assets.py); code only moves, lights and layers them.
   · the scene (background, inside the water or looking at a tank in a room) follows where the fish is
   · the fish is assembled from its parts (RIG in data/rig.js): the tail swings, the fins flutter, it wanders and turns
   · each story line can direct the stage (dir.js): a pose, an animal, a hand, a prop, a full-frame cut-in, a camera move
   · the end shows the ending's painting with the fish's last pose */

const FISH_BASE='img/fish/';
const fishImg=(id,k)=>FISH_BASE+id+'/'+(!k||k==='swim'?'swim':'p-'+k)+'.webp';
/* kept for older code that asks whether a species has art */
const FISHART={};Object.keys(typeof RIG==='object'?RIG:{}).forEach(id=>{FISHART[id]={swim:1,dead:1}});
function preloadFish(){if(typeof Image==='undefined'||!S||!S.sp)return;const id=S.sp.id;['body','tail','dorsal','pect','pelvic'].forEach(p=>{const i=new Image();i.src=FISH_BASE+id+'/'+p+'.webp'})}
function preloadArt(){}

const SP_BLACK=['altum','apisto','ghost','arowana','oscar','motoro','cory','neon','wildbetta'];
const OWN_IMG={expert:'pro',learner:'student',eager:'eager',casual:'lazy',gift:'accidental',breeder:'breeder',content:'sns',mill:'mill',cult:'nofilter',neglect:'neglect',alchemist:'alchemist',techbro:'smarthome',relay:'carrot',release:'release',shared:'office',decor:'fengshui',unbox:'unboxer',staff:'staff',bait:'baitshop',touch:'cafe',grandma:'grandma',breakup:'couple'};
const SICK_IMG={ich:1,velvet:2,cotton:3,dropsy:4,finrot:5,pits:6,popeye:7,pale:8,sunken:9,dark:10,bent:11,thin:12};
const skillIcon=k=>{const i=typeof CAR_SK!=='undefined'?CAR_SK.findIndex(s=>s.k===k):-1;return i<0?'':'img/skill/'+String(i+1).padStart(2,'0')+'.webp'};
const ownerImg=(mood)=>{if(!S||!S.f)return '';const k=OWN_IMG[S.f.kind]||OWN_IMG[S.f.own];return k?'img/owner/'+k+'-'+(mood||'normal')+'.webp':''};

/* ---------- where we are ---------- */
const END_ALIAS={eaten:'f-eaten',bite:'f-nipped',plate:'f-hand',flush:'f-toilet',bellyup:'f-float',sickdead:'f-bottom',starve:'f-thin',freeze:'f-ice',jump:'f-floor',bottle:'f-glass','f-curl':'f-bent',f_cat:'f-cat',cage:'f-bottom'};
const END_IMG=['f-angler','f-aquarium','f-bag','f-bent','f-bottom','f-box','f-bucket','f-burst','f-cat','f-cook','f-eaten','f-escape','f-euth','f-float','f-floor','f-freezer','f-glass','f-hand','f-ice','f-intake','f-net','f-nipped','f-poison','f-pond','f-rest','f-shop','f-shopeaten','f-shopnip','f-siphon','f-stall','f-sun','f-thin','f-toilet','f-trash','f-unsold'];
/* the dead body: which pose, and lying how */
const END_POSE={'f-float':['deadside','float'],'f-thin':['thin','bottom'],'f-sun':['thin','floor'],'f-bent':['bent','bottom'],'f-ice':['frozen','bottom'],'f-freezer':['frozen','bottom'],
  'f-floor':['deadside','floor'],'f-escape':['deadside','floor'],'f-burst':['deadside','floor'],'f-hand':['deadside','hand'],'f-eaten':[null],'f-shopeaten':[null],'f-cat':[null],
  'f-toilet':['deadside','swirl'],'f-cook':['deadside','float'],'f-poison':['deadside','float'],'f-intake':['deadside','wall'],'f-siphon':['deadside','wall'],'f-bag':['deadside','float'],'f-glass':['deadside','bottom'],'f-stall':['deadside','float'],'f-rest':['swim','rest']};
/* the endings worth a painting of their own */
const GLORY_END={'GIN-WK-H':'gin-riverking','GIN-SEA':'gin-strongest','GIN-ESC':'gin-hangang','GIN-POND':'gin-reservoir','GIN-CAT':'happy-05','GIN-CAT2':'happy-05'};
function stEndKey(){const f=S.f||{};return f.endKey&&String(f.endKey).startsWith('ev:')?String(f.endKey).slice(3):''}
function stEndScene(){
  const ek=stEndKey();
  if(GLORY_END[ek])return {bg:'glory/'+GLORY_END[ek],mode:'inside',pose:'proud',lie:'glory'};
  let fx=S.fx||'f-bottom';fx=END_ALIAS[fx]||fx;
  if(S.calm||fx==='ghost'){return {bg:'end/f-rest',mode:'inside',pose:'swim',lie:'rest'}}
  if(fx==='f-home'||fx==='apex'||fx==='free')return {bg:SP_BLACK.includes(S.sp.id)?'bg/river-blackwater':'bg/river-tropic',mode:'inside',pose:'swim',lie:'rest'};
  if(!END_IMG.includes(fx))fx=S.wild?'f-pond':'f-bottom';
  const p=END_POSE[fx]||['deadside','bottom'];
  return {bg:'end/'+fx,mode:'inside',pose:p[0],lie:p[1]};
}
function stPlace(){
  const f=S.f,env=S.env,win=typeof season==='function'&&season()==='winter';
  if(S.done||(S.ending&&S.fx))return stEndScene();
  if(S.wild||env==='river'||env==='lake'){
    if(fl&&fl('hangang'))return {bg:'bg/han-weir',mode:'inside'};
    if(f.warm)return {bg:'bg/warm-outflow',mode:'inside'};
    if(env==='lake'||fl&&fl('reservoir'))return {bg:'bg/reservoir',mode:'inside',cold:win};
    return {bg:SP_BLACK.includes(S.sp.id)?'bg/river-blackwater':'bg/river-tropic',mode:'inside',cold:win};
  }
  switch(env){
    case 'wildriver':return {bg:SP_BLACK.includes(S.sp.id)?'bg/river-blackwater':'bg/river-tropic',mode:'inside',school:5};
    case 'catch':return {bg:'bg/collect-night',mode:'inside',school:3,hand:'net'};
    case 'holding':return {bg:'bg/wholesale',mode:'room',tank:'bg/quarantine',school:3};
    case 'box':return {bg:f.air?'bg/air-cargo':'bg/box-cargo',mode:f.air?'room':'inside',tank:'bg/box-cargo'};
    case 'bottles':return {bg:'bg/bag-crowd',mode:'inside'};
    case 'farm':return {bg:'bg/farm',mode:'inside',school:6};
    case 'quarantine':return {bg:'bg/quarantine',mode:'room',tank:'career/rest-float'};
    case 'shop':return {bg:f.shop==='mart'?'bg/mart':f.shop==='breeder'?'bg/breeder-rack':f.shop==='online'?'bg/wholesale':'bg/shop-tank',mode:'room',tank:'career/rest-float',school:3};
    case 'stall':return {bg:'bg/nightmarket',mode:'inside',school:6};
  }
  if(f.tank==='pond')return {bg:win?'bg/pond-winter':'bg/pond-summer',mode:'inside',cold:win};
  const place=f.place||S.f.placeK;
  if(place==='classroom')return {bg:'bg/classroom',mode:'room',tank:'career/goal-month1'};
  if(place==='office')return {bg:'bg/office',mode:'room',tank:'career/goal-month1'};
  if(place==='cafe'||isKind&&isKind('touch'))return {bg:'bg/cafe',mode:'room',tank:'career/goal-month1'};
  return {bg:f.len<fx_().cm*.45?'career/goal-month1':'career/goal-grown',mode:'inside',home:1};
}

/* ---------- the DOM ---------- */
const STG={el:null,cam:null,bg:[],bgOn:0,bgKey:'',world:null,tank:null,fish:null,mates:[],props:null,cut:null,fx:null,tint:null,raf:0,last:0,W:0,H:0,dir:null,key:''};
function stBuild(){
  const st=$('stage');if(!st)return null;
  if(STG.el&&st.contains(STG.el))return STG.el;
  st.innerHTML='';
  const el=document.createElement('div');el.className='stg';
  el.innerHTML='<div class="stg-cam"><div class="stg-bg"><img alt="" class="on"><img alt=""></div>'+
    '<div class="stg-tank" hidden><div class="tk-in"><img alt="" class="tk-bg"><div class="tk-world"></div></div><div class="tk-glass"></div></div>'+
    '<div class="stg-world"></div><div class="stg-props"></div><div class="stg-fx"></div></div>'+
    '<div class="stg-tint"></div><div class="stg-cut"></div><div class="stg-vig"></div><div class="stg-flash"></div>';
  st.appendChild(el);
  STG.el=el;STG.cam=el.querySelector('.stg-cam');STG.bg=[...el.querySelectorAll('.stg-bg img')];STG.tank=el.querySelector('.stg-tank');
  STG.world=el.querySelector('.stg-world');STG.tworld=el.querySelector('.tk-world');STG.props=el.querySelector('.stg-props');STG.fx=el.querySelector('.stg-fx');
  STG.tint=el.querySelector('.stg-tint');STG.cut=el.querySelector('.stg-cut');STG.flash=el.querySelector('.stg-flash');
  STG.fish=null;STG.mates=[];STG.bgKey='';
  stFx('rays');
  return el;
}
function stSetBg(key){
  if(key===STG.bgKey)return;STG.bgKey=key;
  const src='img/'+key+'.webp',[a,b]=STG.bgOn?[STG.bg[1],STG.bg[0]]:[STG.bg[0],STG.bg[1]];
  b.onload=()=>{b.classList.add('on');a.classList.remove('on')};b.src=src;STG.bgOn^=1;
  if(b.complete&&b.naturalWidth){b.classList.add('on');a.classList.remove('on')}
}

/* ---------- a rigged fish ---------- */
const LAYERS=['tail','pelvic','dorsal','body','pect'];
function rigEl(id){
  const R=RIG[id];if(!R)return null;
  const d=document.createElement('div');d.className='rig';d.style.width=R.w+'px';d.style.height=R.h+'px';
  LAYERS.forEach(k=>{const p=R.l[k];if(!p)return;const i=document.createElement('img');i.alt='';i.className='rl rl-'+k;i.src=FISH_BASE+id+'/'+k+'.webp';i.draggable=false;
    i.style.cssText=`left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;transform-origin:${k==='dorsal'?(p.w*.3)+'px '+p.h+'px':k==='body'?'50% 50%':p.px+'px '+p.py+'px'}`;
    d.appendChild(i)});
  return d;
}
/* ---------- how each species moves ----------
   sp speed · zone [top,bottom] of the water it keeps to · wait [min,max] s between moves · dart chance of a sudden burst
   tw tail beat (s) · ta tail swing (deg) · pa pectoral swing · pr pectoral beat (× tail) · bob up-down (px) · glide body stays still
   rev swims backwards at times (knifefish) · rest pose it rests in now and then · roll lies on its side to rest */
const MOVE={
 guppy:{sp:1.25,zone:[.18,.62],wait:[.2,1.2],dart:.35,tw:.32,ta:14,pa:22,pr:.7,bob:2},
 platy:{sp:1.05,zone:[.25,.7],wait:[.3,1.4],dart:.25,tw:.38,ta:12,pa:20,pr:.7,bob:2},
 neon:{sp:1.3,zone:[.3,.66],wait:[.2,.9],dart:.3,tw:.28,ta:10,pa:18,pr:.6,bob:1},
 betta:{sp:.55,zone:[.12,.55],wait:[1.4,3.6],dart:.08,tw:.9,ta:8,pa:24,pr:.45,bob:4,flow:1},
 wildbetta:{sp:.8,zone:[.12,.6],wait:[.8,2.4],dart:.15,tw:.6,ta:10,pa:22,pr:.5,bob:3},
 oranda:{sp:.5,zone:[.3,.75],wait:[.6,2],dart:.05,tw:.55,ta:9,pa:26,pr:.5,bob:6,wobble:1},
 ryukin:{sp:.6,zone:[.3,.72],wait:[.6,2],dart:.06,tw:.5,ta:10,pa:26,pr:.5,bob:5,wobble:1},
 comet:{sp:1.05,zone:[.2,.7],wait:[.2,1],dart:.12,tw:.45,ta:13,pa:16,pr:.8,bob:2,cruise:1},
 koi:{sp:.7,zone:[.35,.8],wait:[.2,1.2],dart:.05,tw:.7,ta:10,pa:14,pr:.9,bob:3,cruise:1},
 cory:{sp:.9,zone:[.76,.88],wait:[.6,2.4],dart:.25,tw:.3,ta:12,pa:26,pr:.5,bob:0,gulp:.12,hop:1},
 pleco:{sp:.3,zone:[.8,.9],wait:[2.5,6],dart:.1,tw:.6,ta:7,pa:10,pr:1,bob:0,glass:1},
 clownloach:{sp:.9,zone:[.62,.88],wait:[.5,2],dart:.3,tw:.32,ta:13,pa:20,pr:.6,bob:1,roll:.1},
 apisto:{sp:.8,zone:[.6,.86],wait:[.8,2.2],dart:.3,tw:.4,ta:11,pa:24,pr:.5,bob:1,hop:1,show:.12},
 oscar:{sp:.55,zone:[.35,.78],wait:[1.2,3],dart:.12,tw:.6,ta:8,pa:20,pr:.6,bob:2,look:1},
 arowana:{sp:.7,zone:[.12,.3],wait:[.1,.6],dart:.06,tw:.8,ta:6,pa:10,pr:1.1,bob:1,cruise:1},
 gar:{sp:.4,zone:[.12,.28],wait:[2,5],dart:.2,tw:.9,ta:5,pa:12,pr:.8,bob:1,still:1},
 channa:{sp:.45,zone:[.55,.85],wait:[2,5],dart:.22,tw:.6,ta:7,pa:14,pr:.7,bob:1,gulp:.15,still:1},
 altum:{sp:.45,zone:[.2,.6],wait:[1.2,3],dart:.04,tw:.8,ta:6,pa:16,pr:.6,bob:3,glide:1},
 peapuffer:{sp:.75,zone:[.2,.7],wait:[.3,1.2],dart:.1,tw:.5,ta:4,pa:34,pr:.22,bob:2,hover:1},
 fig8:{sp:.6,zone:[.25,.72],wait:[.4,1.6],dart:.08,tw:.55,ta:5,pa:32,pr:.25,bob:3,hover:1},
 bichir:{sp:.35,zone:[.8,.9],wait:[2,5],dart:.12,tw:.5,ta:9,pa:22,pr:.6,bob:0,gulp:.12,still:1},
 ghost:{sp:.5,zone:[.4,.8],wait:[1,3],dart:.05,tw:.9,ta:3,pa:10,pr:1,bob:1,rev:1,glide:1},
 motoro:{sp:.45,zone:[.82,.9],wait:[1.5,4],dart:.06,tw:.8,ta:6,pa:8,pr:1,bob:0,ray:1,glide:1}
};
const MOVE0={sp:.9,zone:[.25,.75],wait:[.4,2],dart:.15,tw:.45,ta:11,pa:20,pr:.7,bob:2};
const rnd=(a,b)=>a+Math.random()*(b-a);
class Swimmer{
  constructor(id,opt){
    this.id=id;this.o=opt||{};this.m=MOVE[id]||MOVE0;this.el=document.createElement('div');this.el.className='actor mv-'+id+(this.o.mate?' mate':'');
    this.el.style.setProperty('--ta',this.m.ta+'deg');this.el.style.setProperty('--pa',this.m.pa+'deg');this.el.style.setProperty('--pr',this.m.pr);
    this.inner=document.createElement('div');this.inner.className='act-in';this.el.appendChild(this.inner);
    if(this.o.mate||!RIG[id]){const i=document.createElement('img');i.alt='';i.className='mate-img';i.src=fishImg(RIG[id]?id:'neon');this.inner.appendChild(i);this.nat=RIG[id]?[RIG[id].w,RIG[id].h]:[560,203]}
    else{this.rig=rigEl(id);this.inner.appendChild(this.rig);this.nat=[RIG[id].w,RIG[id].h]}
    const z=this.m.zone;this.pose=null;this.x=rnd(.25,.75);this.y=rnd(z[0],z[1]);this.vx=0;this.vy=0;this.face=1;this.faceT=1;this.tx=this.x;this.ty=this.y;this.wait=rnd(0,1);this.burst=0;this.t=Math.random()*9;
  }
  setLen(px){if(px===this.px)return;this.px=px;const s=px/this.nat[0];this.s=s;this.inner.style.width=this.nat[0]+'px';this.inner.style.height=this.nat[1]+'px'}
  setPose(p,cls){
    if(p===this.pose&&cls===this.poseCls)return;this.pose=p;this.poseCls=cls;
    let pi=this.inner.querySelector('.pose');
    if(!p||p==='swim'){if(pi)pi.remove();if(this.rig)this.rig.style.display='';const m=this.inner.querySelector('.mate-img');if(m)m.style.display='';this.el.dataset.pose='';return}
    if(!pi){pi=document.createElement('img');pi.alt='';pi.className='pose';this.inner.appendChild(pi)}
    pi.src=fishImg(this.id,p);if(this.rig)this.rig.style.display='none';
    const m=this.inner.querySelector('.mate-img');if(m)m.style.display='none';
    this.el.dataset.pose=cls||p;
  }
  /* the next thing this fish decides to do, in its own way */
  plan(B){
    const m=this.m,z=this.o.zone||m.zone;
    const y0=Math.max(B[1],z[0]),y1=Math.min(B[3],Math.max(z[1],y0+.02));
    this.wait=rnd(m.wait[0],m.wait[1])*(this.o.mate?.8:1)*(this.o.sick?1.8:1);
    this.burst=Math.random()<m.dart?rnd(.35,.7):0;
    /* air from the surface (corydoras, snakehead, bichir), then back down */
    if(m.gulp&&Math.random()<m.gulp&&!this.o.zone){this.tx=Math.min(B[2],Math.max(B[0],this.x+rnd(-.08,.08)));this.ty=B[1];this.gulping=1;this.burst=.8;return}
    this.gulping=0;
    const reach=m.cruise?rnd(.35,.8):m.hover||m.still?rnd(.05,.18):m.hop?rnd(.06,.22):rnd(.12,.5);
    let tx=this.x+(Math.random()<.5?-1:1)*reach;if(tx<B[0]||tx>B[2])tx=this.x-(tx-this.x);
    this.tx=Math.min(B[2],Math.max(B[0],tx));
    this.ty=Math.min(y1,Math.max(y0,m.cruise||m.glide?this.y+rnd(-.08,.08):rnd(y0,y1)));
    /* a resting loach lies on its side for a moment */
    this.roll=m.roll&&Math.random()<m.roll?rnd(1.5,3):0;
  }
  step(dt,W,H,B){
    if(this.hold){this.render(W,H,dt);return}
    this.t+=dt;const m=this.m;
    const sp=(this.o.speed||1)*m.sp*(this.o.sick?.45:1)*(this.burst>0?2.6:1);
    if(this.burst>0)this.burst-=dt;
    if(this.roll>0)this.roll-=dt;
    if(this.wait>0){this.wait-=dt;this.vx*=Math.pow(.15,dt);this.vy*=Math.pow(.15,dt)}
    else{
      const dx=this.tx-this.x,dy=this.ty-this.y,d=Math.hypot(dx*W,dy*H);
      if(d<10){if(this.gulping){this.gulping=0;this.ty=Math.min(B[3],m.zone[1]);this.wait=0;this.burst=.5}else this.plan(B)}
      else{const v=(26+this.px*.3)*sp,k=Math.min(1,dt*(m.cruise||m.glide?1:2.2));this.vx+=(dx*W/d*v-this.vx)*k;this.vy+=(dy*H/d*v*.7-this.vy)*k}
    }
    this.x=Math.min(B[2],Math.max(B[0],this.x+this.vx*dt/W));this.y=Math.min(B[3],Math.max(B[1],this.y+this.vy*dt/H));
    /* facing: the art looks left; a knifefish may back up without turning */
    const back=m.rev&&Math.abs(this.vx)<22&&this.wait<=0&&Math.random()<.002;
    if(!back){if(this.vx<-6)this.faceT=1;else if(this.vx>6)this.faceT=-1}
    this.face+=(this.faceT-this.face)*Math.min(1,dt*(m.cruise?4:7));
    this.render(W,H,dt);
  }
  render(W,H){
    const m=this.m,sp=Math.hypot(this.vx,this.vy);
    let tilt=Math.max(-14,Math.min(14,(this.vy/(Math.abs(this.vx)+20))*16))*this.faceT;
    if(m.wobble)tilt+=Math.sin(this.t*3.2)*4;
    if(this.gulping)tilt=-28*this.faceT;
    if(this.roll>0)tilt+=70*this.faceT;
    const bob=Math.sin(this.t*(m.hover?2.6:1.7))*(m.bob??2);
    const sx=this.s*(Math.abs(this.face)<.12?.12*Math.sign(this.face||1):this.face);
    this.el.style.transform=`translate(${(this.x*W).toFixed(1)}px,${(this.y*H+bob).toFixed(1)}px)`;
    this.inner.style.transform=`translate(-50%,-50%) rotate(${((this.o.tilt||0)+tilt).toFixed(1)}deg) scale(${sx.toFixed(3)},${this.s.toFixed(3)})`;
    /* the tail beats faster when the fish swims faster, from the species' own resting beat */
    const tw=Math.max(.16,m.tw*(1-Math.min(.6,sp/160))).toFixed(2);if(tw!==this.tw){this.tw=tw;this.el.style.setProperty('--tw',tw+'s')}
  }
}

/* ---------- stage update (called by render) ---------- */
let stageKey='';
function drawStage(force){
  if(typeof skipping!=='undefined'&&skipping&&!force)return;
  if(!S||!S.f||typeof requestAnimationFrame!=='function'||!stBuild())return;
  const P=stPlace(),f=S.f,x=fx_();
  const dirBg=STG.dir&&STG.dir.bg;
  stSetBg(dirBg||P.bg);
  const room=P.mode==='room'&&!dirBg;
  STG.el.dataset.mode=room?'room':'inside';STG.el.classList.toggle('cold',!!P.cold);STG.el.classList.toggle('ending',!!(S.done||S.ending&&S.fx));
  STG.tank.hidden=!room;
  if(room){const tb=STG.tank.querySelector('.tk-bg');const s='img/'+(P.tank||'career/goal-month1')+'.webp';if(tb.dataset.k!==s){tb.dataset.k=s;tb.src=s}}
  const host=room?STG.tworld:STG.world;
  /* the fish is made once per life (and per ending); moving between scenes keeps it where it was */
  const key=[S.sp.id,S.done,!!(S.ending&&S.fx)].join('|');
  if(key!==STG.key||!STG.fish){STG.key=key;STG.world.innerHTML='';STG.tworld.innerHTML='';STG.mates=[];STG.mkey='';STG.fish=new Swimmer(S.sp.id,{})}
  if(STG.fish.el.parentNode!==host)host.appendChild(STG.fish.el);
  /* the others in the water: tankmates at home, siblings before an owner */
  const ids=[];
  if(P.school)for(let i=0;i<P.school;i++)ids.push([S.sp.id,.55]);
  else if(!S.done)f.mates.filter(m=>m.n>0&&RIG[m.id]).forEach(m=>{for(let j=0;j<Math.min(m.n,3);j++)ids.push([m.id,Math.max(.35,Math.min(.8,m.cm/Math.max(1,f.len||1)))])});
  const mkey=ids.slice(0,5).map(z=>z[0]).join(',')+'|'+(room?'r':'i');
  if(mkey!==STG.mkey){STG.mkey=mkey;
    const keep=STG.mates;STG.mates=[];
    ids.slice(0,5).forEach(([id,r],i)=>{let m=keep.find(k=>k.id===id&&!k.used);if(m)m.used=1;else{m=new Swimmer(id,{mate:1,speed:.8+i*.07});if(id===S.sp.id)m.el.classList.add('same')}m.r=r;host.insertBefore(m.el,STG.fish.el);STG.mates.push(m)});
    keep.filter(k=>!k.used).forEach(k=>k.el.remove());STG.mates.forEach(m=>delete m.used)}
  /* size: big on screen like a character (inside), true to the tank (room) */
  const g=Math.min(1,(f.len||1)/(x.cm||5));
  const W=host.clientWidth||300;
  const len=room?W*Math.max(.18,Math.min(.62,.2+.45*g)):W*Math.max(.26,Math.min(.52,.24+.32*g));
  const hmax=(host.clientHeight||200)*(room?.5:.46),nat=RIG[S.sp.id]||{w:560,h:200};const len2=Math.min(len,hmax*nat.w/nat.h);
  STG.baseLen=len2;STG.fish.setLen(Math.round(len2*(STG.dir&&STG.dir.small?.55:STG.dir&&STG.dir.big?1.2:1)));
  STG.mates.forEach(m=>m.setLen(Math.round(Math.max(W*.07,Math.min(W*.3,len*m.r*.8)))));
  /* how the fish looks now */
  STG.fish.o.sick=!S.done&&(S.health<35||!!(f.ill&&f.ill.sev>.5));
  stFishState(P);
  if(!STG.raf&&typeof requestAnimationFrame==='function'){STG.last=performance.now();STG.raf=requestAnimationFrame(stLoop)}
  const ch=$('chips');if(ch&&typeof fishChips==='function'){const t=fishChips().map(z=>z.join(':')).join('|');if(ch.dataset.k!==t){ch.dataset.k=t;ch.innerHTML='';fishChips().forEach(([tx,kk])=>{const sp=document.createElement('span');sp.className='chip '+kk;sp.textContent=tx;ch.appendChild(sp)})}}
}
function stFishState(P){
  const F=STG.fish,f=S.f;if(!F)return;
  const el=F.el;
  el.classList.toggle('sick',!S.done&&(S.health<35||!!(f.ill&&f.ill.sev>.5)));
  el.classList.toggle('thin',!!(f.refuse||f.ill&&DZ[f.ill.id]&&DZ[f.ill.id].ov==='thin'));
  /* disease shows on the body (a painted overlay), not as a word */
  let ov=f.ill&&DZ[f.ill.id]?DZ[f.ill.id].ov:'';let oi=F.inner.querySelector('.sickov');
  if(ov&&SICK_IMG[ov]&&!S.done&&ov!=='bent'&&ov!=='thin'){if(!oi){oi=document.createElement('img');oi.alt='';oi.className='sickov';F.inner.appendChild(oi)}oi.src='img/sick/'+String(SICK_IMG[ov]).padStart(2,'0')+'.webp';oi.dataset.k=ov}
  else if(oi)oi.remove();
  if(S.done||(S.ending&&S.fx)){
    const pose=P.pose;F.hold=true;F.vx=F.vy=0;
    if(!pose){F.el.style.opacity='0';return}
    F.el.style.opacity='';
    F.setPose(pose==='swim'?null:pose,P.lie);
    const L={float:[.52,.22],bottom:[.5,.74],floor:[.5,.76],hand:[.62,.58],swirl:[.5,.6],wall:[.78,.5],rest:[.5,.55],glory:[.5,.5]}[P.lie]||[.5,.7];
    F.x=L[0];F.y=L[1];F.face=F.faceT=1;
    el.classList.toggle('dead',P.lie!=='rest'&&P.lie!=='glory');
    return;
  }
  F.hold=false;el.classList.remove('dead');F.el.style.opacity='';
  if(fishIs&&fishIs('puff')&&(f.puffT>0||S.scaredT>0))F.setPose('front','puff');
  else if(f.ill&&DZ[f.ill.id]&&DZ[f.ill.id].ov==='flip')F.setPose('deadside','flip');
  else if(!STG.dir||!STG.dir.pose)F.setPose(null);
}

/* ---------- the frame loop ---------- */
function stLoop(now){
  STG.raf=0;if(!STG.el||!document.body.contains(STG.el))return;
  const dt=Math.min(.05,(now-STG.last)/1000);STG.last=now;
  const room=STG.el.dataset.mode==='room',host=room?STG.tworld:STG.world;
  const W=host.clientWidth,H=host.clientHeight;
  if(W&&H&&!document.hidden){
    const F=STG.fish;
    if(F){const sx=F.px/W/2+.02,sy=Math.min(.4,F.px*F.nat[1]/F.nat[0]/H/2+.04);
      const B=STG.dir&&STG.dir.zone||(room?[sx,sy+.08,1-sx,1-sy]:[sx+.04,Math.max(.14,sy),1-sx-.04,Math.min(.9,1-sy)]);
      F.o.zone=STG.dir&&STG.dir.zone?[B[1],B[3]]:null;
      F.step(dt,W,H,B)}
    STG.mates.forEach(m=>{const sx=m.px/W/2+.02,sy=Math.min(.4,m.px*m.nat[1]/m.nat[0]/H/2+.03);m.step(dt,W,H,[sx,Math.max(.12,sy),1-sx,Math.min(.9,1-sy)])});
  }
  STG.raf=requestAnimationFrame(stLoop);
}

/* ---------- small drawn effects: light rays, bubbles, snow, pellets ---------- */
function stFx(kind,n){
  const box=STG.fx;if(!box)return;
  if(kind==='clear'){box.querySelectorAll('.fx-tmp').forEach(e=>e.remove());return}
  if(kind==='rays'){if(box.querySelector('.rays'))return;const r=document.createElement('div');r.className='rays';r.innerHTML='<i></i><i></i><i></i><i></i>';box.appendChild(r);
    const b=document.createElement('div');b.className='bubbles';b.innerHTML=Array.from({length:12},(_,i)=>`<i style="left:${(i*37)%100}%;animation-delay:${-i*1.3}s;animation-duration:${6+(i%5)*1.4}s;--s:${.5+(i%3)*.4}"></i>`).join('');box.appendChild(b);return}
  const d=document.createElement('div');d.className='fx-tmp fx-'+kind;
  const N=n||14;
  if(kind==='pellets')d.innerHTML=Array.from({length:N},(_,i)=>`<i style="left:${38+(i*13)%26}%;animation-delay:${-(i*.23)}s;animation-duration:${2.2+(i%4)*.35}s"></i>`).join('');
  else if(kind==='snow')d.innerHTML=Array.from({length:N*2},(_,i)=>`<i style="left:${(i*29)%100}%;animation-delay:${-(i*.6)}s;animation-duration:${5+(i%5)}s"></i>`).join('');
  else if(kind==='speed')d.innerHTML=Array.from({length:N},(_,i)=>`<i style="top:${(i*41)%100}%;animation-delay:${-(i*.11)}s;animation-duration:${.45+(i%4)*.1}s"></i>`).join('');
  else if(kind==='spark')d.innerHTML=Array.from({length:N},(_,i)=>`<i style="left:${10+(i*53)%80}%;top:${8+(i*37)%70}%;animation-delay:${-(i*.27)}s"></i>`).join('');
  else if(kind==='splash')d.innerHTML=Array.from({length:N},(_,i)=>`<i style="left:${44+(i*7)%14}%;--dx:${(i%2?1:-1)*(10+(i*17)%40)}px;animation-delay:${-(i*.07)}s"></i>`).join('');
  else if(kind==='hearts')d.innerHTML=Array.from({length:8},(_,i)=>`<i style="left:${12+(i*31)%76}%;animation-delay:${-(i*.5)}s"></i>`).join('');
  box.appendChild(d);
}

/* the little state tags over the stage */
function fishChips(){
  const f=S.f,c=[];
  if(S.done) return c;
  if(S.preOwner){c.push([S.status,'']);if(S.health<60)c.push(['굶주림','bad']);return c}
  if(S.wild){if(season()==='winter')c.push(['추위','bad']);if(S.health<55)c.push(['배고픔','bad']);return c.length?c:[['낯선 하천','']]}
  if(f.ill) c.push([DZ[f.ill.id].n,'bad']);
  if(f.wq<45) c.push(['수질 나쁨','bad']);
  if(!f.cycled) c.push(['물잡이 안 됨','bad']);
  if(fLoad()>1.2) c.push(['과밀','bad']);
  if(f.len>tankLen()*.3) c.push(['비좁음','bad']);
  if(fMatePressure()>.3) c.push(['합사 스트레스','bad']);
  if(fx_().social==='school'&&fSameCount()<4) c.push(['무리 없음','bad']);
  if(f.fin>.3) c.push(['지느러미 손상','bad']);
  if(f.refuse) c.push(['먹이 거부','bad']);
  if((f.beak||0)>.5) c.push(['이빨 자람','bad']);
  if(season()==='winter'&&fx_().temp==='trop'&&!f.heater) c.push(['추위','bad']);
  if((f.stunt||0)>.3) c.push(['성장 정체','bad']);
  if(f.puffT>0) c.push(['몸을 부풀림','bad']);
  if(S.happyT>0) c.push(['평온','good']);
  if(!c.length) c.push([f.stress<.25?'평온':'긴장','']);
  return c;
}

/* the death scene comes with the first line of the ending: remember how it ends as soon as it starts to */
(()=>{const _e=endLife;endLife=function(lines,cat,fact,pl,calm,fx,pred){if(S&&!skipping){S.fx=fx||(calm?'ghost':'sickdead');S.pred=pred||null;S.calm=!!calm;STG.key=''}return _e.apply(this,arguments)}})();

/* ---------- the side card: the owner (a face, not just numbers) and the 육성 status ---------- */
function panelDraw(){
  const op=$('ownPanel'),cp=$('carPanel');if(!op||!cp||!S||!S.f)return;
  const own=!S.preOwner&&!S.wild&&!S.done&&S.o;
  op.hidden=!own;
  if(own){
    const src=ownerImg(S.interest<.3?'panic':S.interest>.75?'smile':'normal');
    const kind=KIND[S.f.kind]||KIND[S.f.own];
    const key=src+'|'+(S.o.name)+'|'+(kind&&kind.l)+'|'+Math.round(S.r*20)+'|'+Math.round(S.interest*20);
    if(op.dataset.k!==key){op.dataset.k=key;
      op.innerHTML='<img alt="" class="op-face"><div class="op-t"><span class="op-l">주인</span><b class="op-n"></b><span class="op-k"></span>'+
        '<div class="op-m"><span>실력</span><i><b style="width:'+Math.round(S.r*100)+'%"></b></i></div><div class="op-m"><span>관심</span><i><b style="width:'+Math.round(S.interest*100)+'%"></b></i></div></div>';
      op.querySelector('.op-face').src=src;op.querySelector('.op-n').textContent=S.o.name;op.querySelector('.op-k').textContent=(kind?kind.l:'')+' · '+S.o.age+'세 · '+S.o.house}
  }
  const c=typeof car==='function'&&car();
  cp.hidden=!c||S.done;
  if(c&&!S.done){
    const g=CAR_GOAL[c.gi],left=g&&c.goalAt[c.gi]>=0?Math.max(0,c.goalAt[c.gi]-c.turn):null;
    const key=[Math.round(c.vit),c.mood,c.sp,c.gi,left,c.turn].join('|');
    if(cp.dataset.k!==key){cp.dataset.k=key;
      cp.innerHTML='<div class="cp-row"><span class="cp-turn"></span><span class="cp-mood"></span><span class="cp-sp"></span></div>'+
        '<div class="cp-vit"><span>기력</span><i><b></b></i><em></em></div><div class="cp-goal"><span class="cp-gl">다음 고비</span><b></b><em></em></div>';
      cp.querySelector('.cp-turn').textContent=c.turn+'턴째';
      const md=cp.querySelector('.cp-mood');md.textContent=CAR_MOOD[c.mood];md.dataset.m=c.mood;
      cp.querySelector('.cp-sp').textContent='SP '+c.sp;
      const vb=cp.querySelector('.cp-vit b');vb.style.width=Math.round(c.vit)+'%';vb.classList.toggle('low',c.vit<30);cp.querySelector('.cp-vit em').textContent=Math.round(c.vit);
      cp.querySelector('.cp-goal b').textContent=g&&left!=null?g.n:'남은 고비 없음 — 끝까지';
      cp.querySelector('.cp-goal em').textContent=g&&left!=null?(left?left+'턴 뒤':'이번 턴')+' · 필요 '+CAR_STATS[g.k]+' '+carD(carNeed(g)):''}
  }
}

/* ---------- the title screen: a few painted fish swimming past ---------- */
(()=>{const box=typeof document!=='undefined'&&document.getElementById&&document.getElementById('tsParade');if(!box||!box.appendChild)return;
  const ids=Object.keys(RIG).sort(()=>Math.random()-.5).slice(0,6);
  ids.forEach((id,i)=>{const d=document.createElement('div');d.className='tp'+(i%2?' rev':'');
    d.style.cssText=`top:${12+i*13}%;animation-duration:${18+i*4}s;animation-delay:${-i*5.5}s;--w:${Math.round(70+((i*37)%5)*18)}px`;
    const im=document.createElement('img');im.alt='';im.src=fishImg(id);d.appendChild(im);box.appendChild(d)})})();
