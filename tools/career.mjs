// Career balance: plays lives with a diligent player (trains, rests when tired, buys skills, takes the best goal option)
// and prints final stat ranks, grades and how long the fish lived. Usage: node tools/career.mjs [lives=400] [species] [strategy=good|random]
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {gameScripts} from './scripts.mjs';
const N=+process.argv[2]||400, ONLY=process.argv[3]&&process.argv[3]!=='-'?process.argv[3]:undefined, STRAT=process.argv[4]||'good';
const el=()=>new Proxy({style:{},classList:{add(){},toggle(){},remove(){}},dataset:{}},{get(t,k){if(k in t)return t[k];if(['appendChild','append','prepend','setAttribute','remove','addEventListener','focus','scrollIntoView','insertBefore','insertAdjacentHTML','querySelectorAll'].includes(k))return ()=>el();if(['querySelector','firstChild','lastChild','lastElementChild'].includes(k))return k==='querySelector'?()=>el():el();return t[k]},set(t,k,v){t[k]=v;return true}});
const ids={},store={};
const ctx={SIM_MODE:'real',Math,JSON,Object,Array,String,Number,Boolean,Date,console,
  document:{getElementById:id=>ids[id]||(ids[id]=el()),createElement:()=>el(),querySelector:()=>null,querySelectorAll:()=>[]},
  window:{},localStorage:{getItem:k=>k in store?store[k]:null,setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}},setInterval:()=>1,clearInterval(){},setTimeout:()=>0,clearTimeout(){}};
vm.createContext(ctx);
const src=gameScripts().map(f=>readFileSync(new URL('../public/js/'+f+'.js',import.meta.url),'utf8')).join('\n')+`
;globalThis.__choose=(opts,strat)=>{
  const ok=opts.filter(o=>!o.dis),L=o=>String(typeof o.l==='function'?o.l():o.l||''),D=o=>String(o.d||'');
  if(strat!=='good')return pick(ok);
  const c=S.f&&S.f.car;
  // goal / contest style: best odds
  const odds=o=>{const d=D(o);return /가능성 높음/.test(d)?4:/가능성 보통/.test(d)?3:/가능성 낮음/.test(d)?2:/가능성 희박/.test(d)?1:0};
  if(ok.some(o=>/^힘 훈련|^근성 훈련/.test(L(o)))&&c){
    const sk=ok.find(o=>/^스킬 배우기/.test(L(o)));if(sk)return sk;
    if(c.mood<=1){const p=ok.find(o=>/^놀기/.test(L(o)));if(p)return p}
    if(c.vit<48){const r=ok.find(o=>/^휴식/.test(L(o)));if(r)return r}
    const ill=ok.find(o=>/^아픈 티/.test(L(o)));if(ill&&S.f.ill)return ill;
    const fr=ok.find(o=>/★우정/.test(L(o)));if(fr)return fr;
    const cup=ok.find(o=>/^출전/.test(L(o))&&odds(o)>=3);if(cup)return cup;
    const tr=ok.filter(o=>/^(힘|근성|지능|매력) 훈련/.test(L(o)));
    const g=CAR_GOAL[c.gi],st=fst();
    if(g&&st[g.k]<carNeed(g)*1.25){const t=tr.find(o=>L(o).startsWith(CAR_STATS[g.k]));if(t)return t}
    const low=['p','g','w','c'].sort((a,b)=>st[a]/statCap(a)-st[b]/statCap(b))[0];
    const t=tr.find(o=>L(o).startsWith(CAR_STATS[low]+' 훈련'));return t||pick(tr);
  }
  if(ok.some(o=>/^추천 · |SP \\d+$/.test(L(o)))&&ok.some(o=>/그만두고/.test(L(o)))){const b=ok.find(o=>!/그만두고/.test(L(o)));return b||ok[0]}
  const best=ok.map(o=>[o,odds(o)]).sort((a,b)=>b[1]-a[1]);if(best[0][1]>0)return best[0][0];
  return pick(ok)};
globalThis.__run=(sp,strat)=>{start(sp);skipping=true;const ac=askChoice;let n=0;
  while(!S.done&&n++<20000){if(S.pending)S.pending.resolve(__choose(S.pending.opts,strat));tick()}
  skipping=false;const c=S.f&&S.f.car,st=S.f&&S.f.st;
  return {id:S.sp.id,calm:S.calm,pct:S.ageM/S.sp.life,car:!!(c&&c.turn),turns:c&&c.turn,res:c&&c.result,gp:c&&c.gpass,gf:c&&c.gfail,sk:c?Object.keys(c.sk).length:0,
    ranks:st?['p','g','w','c'].map(k=>statRank(k)):[],rel:st?['p','g','w','c'].map(k=>st[k]/statCap(k)):[],fac:S.lastFactors||null,gag:Object.keys(S.seen).filter(k=>/^ev(GAG|GIN|CH|MOB|P[GTW])-/.test(k)).length,chs:Object.keys(S.seen).filter(k=>/^evCH-/.test(k)).length,lit:S.facLit||0}};`;
vm.runInContext(src,ctx);
// the skipping path picks randomly: route it through the strategy
vm.runInContext(`(()=>{const _a=askChoice;askChoice=function(c,cb){if(skipping){const s=skipping;skipping=false;try{_a(c,cb);}finally{skipping=s}const p=S.pending;if(p)p.resolve(__choose(p.opts,__STRAT));return}return _a(c,cb)}})()`,Object.assign(ctx,{__STRAT:STRAT}));
const R={gag:0,chs:0,n:0,fac:0,facS:0,lit:0,car:0,calm:0,pct:0,turns:0,grade:{},rank:{},top:{},rel:0,gp:0,gf:0,sk:0,max:0};
const order=['G','F','E','D','C','B','A','S','SS','UF','UE','UD','UC','UB','UA','US'];
for(let i=0;i<N;i++){const r=ctx.__run(ONLY,STRAT);R.n++;R.gag+=r.gag;R.chs+=r.chs;if(r.calm)R.calm++;R.pct+=r.pct;
  if(!r.car)continue;R.car++;if(r.fac){R.fac+=r.fac.f.length;R.facS+=r.fac.f.reduce((a,f)=>a+f.s,0)}R.lit+=r.lit||0;R.turns+=r.turns;R.gp+=r.gp;R.gf+=r.gf;R.sk+=r.sk;
  if(r.res)R.grade[r.res.rank]=(R.grade[r.res.rank]||0)+1;
  r.ranks.forEach(x=>R.rank[x]=(R.rank[x]||0)+1);const t=r.ranks.sort((a,b)=>order.indexOf(b)-order.indexOf(a))[0];R.top[t]=(R.top[t]||0)+1;
  R.rel+=r.rel.reduce((a,b)=>a+b,0)/4;if(r.rel.some(v=>v>=.999))R.max++}
const pc=(o,n)=>order.filter(k=>o[k]).map(k=>k+' '+(o[k]/n*100).toFixed(0)+'%').join(' · ');
console.log(`${STRAT} · lives ${R.n} · career ${R.car} · lived out ${(R.calm/R.n*100).toFixed(0)}% · mean life ${(R.pct/R.n*100).toFixed(0)}% · turns ${(R.turns/R.car).toFixed(0)} · goals ${(R.gp/R.car).toFixed(1)}/${((R.gp+R.gf)/R.car).toFixed(1)} · skills ${(R.sk/R.car).toFixed(1)}`);
console.log('gag events seen per life '+(R.gag/R.n).toFixed(1)+' (new chaos '+(R.chs/R.n).toFixed(1)+')');
console.log('mean stat (of cap) '+(R.rel/R.car*100).toFixed(0)+'% · lives with a maxed stat '+(R.max/R.car*100).toFixed(0)+'%');
console.log('stat ranks: '+pc(R.rank,R.car*4));
console.log('best stat:  '+pc(R.top,R.car));
console.log('factors left per life '+(R.fac/R.car).toFixed(1)+' ('+(R.facS/R.car).toFixed(1)+' stars) · lit per life '+(R.lit/R.car).toFixed(1));
console.log('grade:      '+pc(R.grade,R.car));
