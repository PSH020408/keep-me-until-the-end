/* ---------- v0.25: 인자 (factors) — what a raised fish leaves to the next ones, in the manner of Uma Musume ----------
   At the end of a raised life the fish leaves factors, each with one to three stars:
     · 스탯 인자 (blue)   — its best stat, sometimes the second best: stars by how high the stat got
     · 스킬 인자 (green)  — some of the skills it learned: more and brighter with a better grade
     · 고유 인자 (pink)   — its title, from grade A up: starting SP, the owner's bond, a good mood
   Before a life, up to two earlier fish are picked as 선배 (on the title screen; the best two by default).
   Twice in the next career — when it starts, and about halfway — every factor of both 선배 rolls to light up:
   ★ 20 %, ★★ 35 %, ★★★ 55 % (×1.2 if the 선배 was the same species). A lit stat factor adds to the stat directly,
   a lit skill factor gives a hint (★ 25 %, ★★ 50 % off the skill) or, at ★★★, the skill itself, a lit 고유 인자 gives SP and bond.
   This replaces the v0.14 same-species 계승 (old records are carried over as one stat factor each). */

const FAC_KEY='kiwojuseyo-factors',FAC_PICK='kiwojuseyo-parents',FAC_MAX=24;
const FAC_ON={1:.2,2:.35,3:.55};
const facStars=n=>'★'.repeat(n);
const facVal=L=>(L.f||[]).reduce((a,f)=>a+f.s*(f.t==='u'?2:1),0)+(CAR_RANK.findIndex(r=>r[1]===L.rank)/4);
function facAll(){
  try{const v=JSON.parse(localStorage.getItem(FAC_KEY)||'null');if(Array.isArray(v))return v}catch(e){}
  /* first run: the old same-species legacy becomes one stat factor per species */
  const out=[];try{const old=JSON.parse(localStorage.getItem(CAR_LEG_KEY)||'null');
    if(old&&typeof old==='object'&&!old.k)Object.entries(old).forEach(([sp,L])=>{if(!L||!L.k)return;
      const ri=CAR_RANK.findIndex(r=>r[1]===L.rank);out.push({id:'old-'+sp,name:L.name||'선배',sp,spName:L.sp,rank:L.rank,title:L.title,f:[{t:'s',k:L.k,s:ri>=9?3:ri>=7?2:1}]})});
    localStorage.setItem(FAC_KEY,JSON.stringify(out))}catch(e){}
  return out}
function facSave(list){try{localStorage.setItem(FAC_KEY,JSON.stringify(list))}catch(e){}}
function facPicked(){const all=facAll();let ids=[];try{ids=JSON.parse(localStorage.getItem(FAC_PICK)||'null')||[]}catch(e){}
  if(!Array.isArray(ids))ids=[];
  const got=ids.map(id=>all.find(L=>L.id===id)).filter(Boolean);
  if(got.length||ids.length&&ids[0]==='none')return got.slice(0,2);
  return all.slice().sort((a,b)=>facVal(b)-facVal(a)).slice(0,2)}
function facSetPick(ids){try{localStorage.setItem(FAC_PICK,JSON.stringify(ids.length?ids.slice(0,2):['none']))}catch(e){}}
const facName=f=>f.t==='s'?CAR_STATS[f.k]:f.t==='k'?((carSkill(f.k)||{}).n||f.k):f.n;
const facLabel=f=>facName(f)+' '+facStars(f.s);

/* ---------- leaving factors ---------- */
function facMake(g,calm){
  const c=car(),st=fst(),ri=Math.max(0,CAR_RANK.findIndex(r=>r[1]===g.rank)),f=[];
  const rel=['p','g','w','c'].map(k=>[k,st[k]/Math.max(1,statCap(k))]).sort((a,b)=>b[1]-a[1]);
  const sStar=r=>r>=.9?3:r>=.65?2:1;
  if(rel[0][1]>=.2)f.push({t:'s',k:rel[0][0],s:sStar(rel[0][1])});
  if(rel[1][1]>=.45&&R()<.4)f.push({t:'s',k:rel[1][0],s:Math.max(1,sStar(rel[1][1])-1)});
  const sk=Object.keys(c.sk||{}).sort(()=>R()-.5);let n=0;
  for(const k of sk){if(n>=3)break;if(R()<.15+ri*.02){const r=R()+ri*.015;f.push({t:'k',k,s:r>1.05?3:r>.7?2:1});n++}}
  if(ri>=7)f.push({t:'u',n:g.title,s:ri>=12?3:ri>=9?2:1});
  return f}
function facRecord(g,calm){
  const c=car();if(!c||c.factors)return c&&c.factors;
  const f=facMake(g,calm);c.factors=f;
  const L={id:'f'+Date.now().toString(36)+Math.floor(R()*1e4),name:S.disp,sp:S.sp.id,spName:S.sp.name,rank:g.rank,title:g.title,calm:!!calm,f};
  S.lastFactors=L;
  if(f.length){let all=facAll();all.unshift(L);
    if(all.length>FAC_MAX){const keep=new Set(facPicked().map(x=>x.id));all=all.filter((x,i)=>i===0||keep.has(x.id)).concat(all.filter((x,i)=>i>0&&!keep.has(x.id)).sort((a,b)=>facVal(b)-facVal(a))).slice(0,FAC_MAX)}
    facSave(all)}
  return f}

/* ---------- inheriting ---------- */
function facInherit(n){
  const c=car(),P=facPicked();if(!c||!P.length)return;
  c.inh=c.inh||[];if(c.inh.includes(n))return;c.inh.push(n);
  c.hint=c.hint||{};const lit=[];
  P.forEach(L=>(L.f||[]).forEach(f=>{
    if(R()>=Math.min(.95,FAC_ON[f.s]*(L.sp===S.sp.id?1.2:1)))return;
    let eff='';
    if(f.t==='s'){const st=fst(),cap=statCap(f.k),add=cap*(.015+.02*f.s);st[f.k]=Math.min(cap,st[f.k]+add);eff=CAR_STATS[f.k]+' +'+carD(add)}
    else if(f.t==='k'){const s=carSkill(f.k);if(!s)return;
      if(c.sk[f.k]){c.sp+=5*f.s;eff='이미 익힌 스킬 · SP +'+5*f.s}
      else if(f.s>=3){c.sk[f.k]=1;eff='「'+s.n+'」 습득!'}
      else{const d=f.s>=2?.5:.75;c.hint[f.k]=Math.min(c.hint[f.k]||1,d);eff='「'+s.n+'」 힌트 · 비용 '+Math.round((1-d)*100)+'% 할인'}}
    else{c.sp+=8*f.s;c.bond.owner=clamp(c.bond.owner+5*f.s,0,100);c.mood=Math.min(4,c.mood+1);eff='SP +'+8*f.s+' · 주인 인연 +'+5*f.s}
    lit.push(facLabel(f)+' ('+L.name+') → '+eff)}));
  S.facLit=(S.facLit||0)+lit.length;
  const who=P.map(L=>'「'+L.title+'」 '+L.name+'('+L.rank+')').join(', ');
  if(lit.length){addLog(T('★ 계승'+(n>1?' 2회차':'')+'! 선배 '+who+'의 인자가 빛났다. 선배, 고맙습니다.'),'star');lit.forEach(x=>addLog('　'+x,'good'))}
  else addLog(T(pick(['★ 계승'+(n>1?' 2회차':'')+' — 선배 '+who+'의 인자가… 빛나지 않았다. 선배들은 지금 휴가 중이다.','★ 계승'+(n>1?' 2회차':'')+' — 선배들이 꿈에 나왔지만 아무것도 가르쳐 주지 않고 사료만 먹고 갔다. 선배란 그런 것이다.'])),'sub');
}
/* the first 계승 when the career starts (in place of the old same-species legacy), the second about halfway */
carLegacyLoad=function(){return null};
carLegacySave=function(){};
(()=>{const _i=carInit;carInit=function(){const had=!!(S.f&&S.f.car);const c=_i();if(!had)facInherit(1);return c}})();
(()=>{const _t=fTrain;fTrain=function(){const c=S.f&&S.f.car;if(c&&!(c.inh||[]).includes(2)&&c.turn+1>=Math.round(c.total*.45))facInherit(2);return _t.apply(this,arguments)}})();
/* hints make a skill cheaper */
function facCosts(){const c=car();CAR_SK.forEach(s=>{if(s.cost0==null)s.cost0=s.cost;s.cost=Math.round(s.cost0*((c&&c.hint&&c.hint[s.k])||1))})}
(()=>{const _h=carHub,_s=carShop;carHub=function(){facCosts();return _h.apply(this,arguments)};carShop=function(){facCosts();return _s.apply(this,arguments)}})();
/* factors are made when the grade is */
(()=>{const _g=carGrade;carGrade=function(calm){const g=_g(calm);try{facRecord(g,calm)}catch(e){}return g}})();

/* ---------- v0.25: 물고기 도감 — every species raised is registered with its best grade; the 도감 pays back ----------
   Each registered species adds 1 SP when a career starts, each species raised to S or higher another 2. */
const DEX_KEY='kiwojuseyo-dex';
const RANK_I=r=>CAR_RANK.findIndex(x=>x[1]===r);
function dexAll(){try{const v=JSON.parse(localStorage.getItem(DEX_KEY)||'null');if(v&&typeof v==='object')return v}catch(e){}return {}}
function dexBonus(){const d=dexAll(),v=Object.values(d);return v.length+v.filter(x=>RANK_I(x.best)>=RANK_I('S')).length*2}
/* called once per finished life; says what was new */
function dexRecord(){
  if(!S||!S.sp||S.dexDone)return S&&S.dexNew;S.dexDone=1;
  const d=dexAll(),id=S.sp.id,c=S.f&&S.f.car,rank=c&&c.result?c.result.rank:null,e=d[id]||{lives:0,calm:0,best:null,titles:[]};
  const isNew=!d[id],better=rank&&(e.best==null||RANK_I(rank)>RANK_I(e.best));
  e.lives++;if(S.calm)e.calm++;
  if(better){e.best=rank;e.name=S.disp}
  if(c&&c.result&&!e.titles.includes(c.result.title))e.titles.push(c.result.title);
  d[id]=e;try{localStorage.setItem(DEX_KEY,JSON.stringify(d))}catch(err){}
  S.dexNew={isNew,better:better&&!isNew?rank:better&&isNew?rank:null,prev:isNew?null:(d[id]&&e.best)};return S.dexNew}
(()=>{const _i=carInit;carInit=function(){const had=!!(S.f&&S.f.car);const c=_i();if(!had){const b=dexBonus();if(b){c.sp+=b;
  const n=Object.keys(dexAll()).length;addLog(T('★ 도감 보너스 — 지금까지 키워 본 물고기 '+n+'종. SP +'+b+' 받고 시작한다. 경력직 우대.'),'good')}}return c}})();
(()=>{const _e=endLife;endLife=function(){const r=_e.apply(this,arguments);try{dexRecord()}catch(e){}return r}})();
