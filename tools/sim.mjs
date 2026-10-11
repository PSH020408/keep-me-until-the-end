// Balance check: plays thousands of lives headlessly and prints how they end.
// Usage: node tools/sim.mjs [lives=3000] [speciesId]
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const N=+process.argv[2]||3000, ONLY=process.argv[3];
const files=['core','data/species','data/facts','data/events','data/endings','data/choices','data/fish','data/fishchoice','engine','fish','data/fishgrow','art/paint','art/look','art/raster','art/mammals','art/others','art/gags','art/death','art/fish','art','ui'];
const el=()=>new Proxy({style:{},classList:{add(){},toggle(){},remove(){}},dataset:{}},{get(t,k){if(k in t)return t[k];if(['appendChild','append','prepend','setAttribute','remove','addEventListener','focus','scrollIntoView','insertBefore','insertAdjacentHTML','querySelectorAll'].includes(k))return ()=>el();if(['querySelector','firstChild','lastChild','lastElementChild'].includes(k))return k==='querySelector'?()=>el():el();return t[k]},set(t,k,v){t[k]=v;return true}});
const ids={};
const ctx={Math,JSON,Object,Array,String,Number,Boolean,Date,console,
  document:{getElementById:id=>ids[id]||(ids[id]=el()),createElement:()=>el(),querySelector:()=>null,querySelectorAll:()=>[]},
  window:{},localStorage:{getItem:()=>null,setItem(){}},setInterval:()=>1,clearInterval(){},setTimeout:()=>0,clearTimeout(){}};
vm.createContext(ctx);
const src=files.map(f=>readFileSync(new URL('../public/js/'+f+'.js',import.meta.url),'utf8')).join('\n')+
  '\n;globalThis.__run=(sp)=>{start(sp);skipping=true;let n=0;while(!S.done&&n++<9000){if(S.pending)S.pending.resolve(pick(S.pending.opts));tick()}skipping=false;return {g:S.sp.g,cat:S.endCat,pre:!!S.preOwner,own:S.f&&S.f.own,wildFish:S.f&&S.f.wild,id:S.sp.id,fx:S.fx,calm:S.calm,wild:S.wild,pct:S.ageM/S.sp.life,events:Object.keys(S.seen).length,mem:S.mem.length,first:S.f&&S.f.firstOwn,grow:S.f&&S.f.grow,lazy:S.f&&S.f.lazy,lessons:S.f&&S.f.lessons,yrs:S.f&&S.f.buyAge!=null?(S.ageM-S.f.buyAge)/12:0,diedHome:S.f&&S.f.buyAge!=null&&!S.calm&&!S.wild,kept:S.preOwner||S.wild&&!S.pl?null:S.pl.filter(x=>!x).length,p3:S.pl&&S.pl[2]?[S.pl[2].note].concat((S.pl[2].more||[]).map(r=>r.note)):[]}};';
vm.runInContext(src,ctx);
const gr={},ann={},cc={},p3={},by={},fx={},cats={},sps={},owns={};let calm=0,wild=0,pct=0,ev=0,pre=0;
for(let i=0;i<N;i++){
  const r=ctx.__run(ONLY);
  by[r.g]=by[r.g]||{n:0,calm:0};by[r.g].n++;if(r.calm){by[r.g].calm++;calm++}
  fx[r.fx]=(fx[r.fx]||0)+1;if(r.wild)wild++;pct+=r.pct;ev+=r.events;cats[r.cat]=(cats[r.cat]||0)+1;if(r.pre)pre++;
  sps[r.id]=sps[r.id]||{n:0,calm:0,pct:0};sps[r.id].n++;sps[r.id].pct+=r.pct;if(r.calm)sps[r.id].calm++;
  if(r.own){owns[r.own]=owns[r.own]||{n:0,calm:0,pct:0};owns[r.own].n++;owns[r.own].pct+=r.pct;if(r.calm)owns[r.own].calm++;if(r.kept!=null&&!r.pre){owns[r.own].kept=(owns[r.own].kept||0)+r.kept;owns[r.own].kn=(owns[r.own].kn||0)+1}}
  if(r.first&&!r.pre){const k=r.first+(r.grow?(r.lazy?' (lazy)':' (learns)'):'');const g=gr[k]=gr[k]||{n:0,c:0,p:0,l:0};g.n++;g.p+=r.pct;g.l+=r.lessons||0;if(r.calm)g.c++}
  if(r.first){const a=ann[r.first]=ann[r.first]||{y:0,d:0,n:0,y1:0};a.y+=r.yrs;a.n++;if(r.diedHome)a.d++;if(r.diedHome&&r.yrs<1)a.y1++}
  if(r.own==='casual'&&!r.pre)cc[r.cat]=(cc[r.cat]||0)+1;
  (r.p3||[]).forEach(t=>{t=t.replace(/\d+L|컵만 한/g,'…');p3[t]=(p3[t]||0)+1});
}
console.log(`lives ${N} · lived out their lifespan ${(calm/N*100).toFixed(1)}% · ended in the wild ${(wild/N*100).toFixed(1)}% · mean share of lifespan lived ${(pct/N*100).toFixed(0)}% · distinct events per life ${(ev/N).toFixed(1)}`);
console.log('by group (lived out %):',Object.entries(by).map(([g,v])=>`${g} ${(v.calm/v.n*100).toFixed(0)}% (n=${v.n})`).join(' · '));
console.log('death scene:',Object.entries(fx).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(' · '));
console.log('ending:',Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${(v/N*100).toFixed(1)}%`).join(' · '));
console.log(`died before any owner ${(pre/N*100).toFixed(1)}%`);
console.log('by owner (lived out % · mean life %):',Object.entries(owns).map(([k,v])=>`${k} ${(v.calm/v.n*100).toFixed(0)}% · ${(v.pct/v.n*100).toFixed(0)}% (n=${v.n})`).join(' · '));
console.log('pledges kept of 6, mean by owner:',Object.entries(owns).map(([k,v])=>`${k} ${(v.kept/v.kn).toFixed(1)}`).join(' · '));
console.log('pledge 03 reasons (lives):',Object.entries(p3).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(' · '));
console.log('first owner: deaths per fish-year at home · died within 1st year:',Object.entries(ann).map(([k,a])=>`${k} ${(a.d/a.y*100).toFixed(0)}%/yr · ${(a.y1/a.n*100).toFixed(0)}%`).join(' · '));
console.log('owners who learn vs not (lived out · mean life · lessons):',Object.entries(gr).sort().map(([k,g])=>`${k} ${(g.c/g.n*100).toFixed(0)}% · ${(g.p/g.n*100).toFixed(0)}% · ${(g.l/g.n).toFixed(1)}`).join(' | '));
console.log('casual endings:',Object.entries(cc).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>`${k} ${v}`).join(' · '));
console.log('by species (lived out % · mean life %):',Object.entries(sps).map(([k,v])=>`${k} ${(v.calm/v.n*100).toFixed(0)}·${(v.pct/v.n*100).toFixed(0)}`).join(' · '));
