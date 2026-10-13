// Catalogue test: loads the game like sim.mjs, then forces every catalogue event many times
// on fish it can happen to, picks options at random, and plays on to the end of the life.
// Usage: node tools/fevtest.mjs [runsPerEvent=25] [file ...]   (files: data/fev_xxx, default all in index.html)
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
const RUNS=+process.argv[2]||25;
const only=process.argv.slice(3);
const base=['core','data/species','data/facts','data/events','data/endings','data/choices','data/fish','data/fishchoice','engine','fish','data/fishgrow','data/fishplus','data/fev','art/paint','art/look','art/raster','art/mammals','art/others','art/gags','art/death','art/fish','art','ui'];
const all=readdirSync(new URL('../public/js/data/',import.meta.url)).filter(f=>/^fev_.*\.js$/.test(f)).sort().map(f=>'data/'+f.replace(/\.js$/,''));
const fevFiles=only.length?only:all;
const files=base.slice(0,13).concat(fevFiles).concat(base.slice(13));
const el=()=>new Proxy({style:{},classList:{add(){},toggle(){},remove(){},contains(){return false}},dataset:{}},{get(t,k){if(k in t)return t[k];if(['appendChild','append','prepend','setAttribute','remove','addEventListener','focus','scrollIntoView','insertBefore','insertAdjacentHTML','querySelectorAll'].includes(k))return ()=>el();if(['querySelector','firstChild','lastChild','lastElementChild','firstElementChild'].includes(k))return k==='querySelector'?()=>el():el();return t[k]},set(t,k,v){t[k]=v;return true}});
const ids={};const warns=[];
const ctx={SIM_MODE:'real',Math,JSON,Object,Array,String,Number,Boolean,Date,console:{log(){},warn:(...a)=>warns.push(a.join(' ')),error:(...a)=>warns.push('ERR '+a.join(' '))},
  document:{getElementById:id=>ids[id]||(ids[id]=el()),createElement:()=>el(),querySelector:()=>null,querySelectorAll:()=>[]},
  window:{},localStorage:{getItem:()=>null,setItem(){}},setInterval:()=>1,clearInterval(){},setTimeout:()=>0,clearTimeout(){}};
vm.createContext(ctx);
const src=files.map(f=>'/*FILE '+f+'*/\n'+readFileSync(new URL('../public/js/'+f+'.js',import.meta.url),'utf8')).join('\n');
vm.runInContext(src+'\n;MODE_NOW="real";',ctx,{filename:'game.js'});
vm.runInContext(`
globalThis.__ids=()=>FEV.map(e=>e.id);
globalThis.__static=()=>{const out=[];const seen={};
  FEV.forEach(e=>{if(seen[e.id])out.push('duplicate id '+e.id);seen[e.id]=1;
    if(!['home','origin','trade','shop','wild'].includes(e.stage)&&!Array.isArray(e.stage))out.push(e.id+': bad stage '+e.stage);
    if(e.o&&!e.p)out.push(e.id+': options but no prompt');
    if(!e.o&&!e.auto)out.push(e.id+': neither options nor auto');
    if(e.o&&e.o.length&&!e.o.some(o=>!o.chk))out.push(e.id+': no option without a check (passive option missing)');
    const s=String(JSON.stringify(e,(k,v)=>typeof v==='function'?v.toString():v));
    (s.match(/end:\\\\?["']([A-Za-z0-9_-]+)\\\\?["']/g)||[]).forEach(m=>{const id=m.replace(/end:\\\\?["']|\\\\?["']/g,'');if(!FEVEND[id])out.push(e.id+': missing ending '+id)});
  });
  for(const k in FEVEND){const E=FEVEND[k];if(!['bad','happy','release'].includes(E.kind))out.push('ending '+k+': kind '+E.kind)}
  return out};
const STAGE_PRE={origin:1,trade:1,shop:1};
globalThis.__force=(id)=>{
  const e=FEV.find(x=>x.id===id);
  let sp=SP.filter(s=>s.g==='fish'&&(!e.sp||(()=>{const S0=S;S={sp:s};const r=isSp(e.sp)&&!(e.notSp&&isSp(e.notSp));S=S0;return r})()));
  if(!sp.length)return {err:'no species'};
  start(pick(sp).id);skipping=true;let n=0;
  const pre=STAGE_PRE[e.stage]||(Array.isArray(e.stage)&&e.stage.some(s=>STAGE_PRE[s]));
  if(!pre){while(S.preOwner&&!S.done&&n++<5000){if(S.pending)S.pending.resolve(pick(S.pending.opts.filter(o=>!o.dis)));tick()}
    if(S.done)return {skip:'died before owner'};
    if(e.stage==='wild'||(Array.isArray(e.stage)&&e.stage.includes('wild')&&!e.stage.includes('home'))){S.f.released=1;goWild('river');S.queue=[]}
    if(e.own){const k=pick([].concat(e.own));S.f.kind=k;if(KIND[k]&&S.f.own!==KIND[k].base)S.f.own=KIND[k].base}}
  if(e.need)for(const k in e.need){const v=e.need[k];if(typeof v!=='function'){try{setFl(k,Array.isArray(v)?v[0]:v)}catch(x){}}}
  if(e.need&&e.need.season){const want=[].concat(e.need.season)[0];let g=0;while(season()!==want&&g++<12)S.month+=1}
  if(e.need&&e.need.pond&&!S.preOwner){S.f.tank='pond'}
  const okNow=fevOk(e,Array.isArray(e.stage)?e.stage[0]:e.stage);
  fevRun(e);
  let m=0;while(!S.done&&m++<6000){if(S.pending)S.pending.resolve(pick(S.pending.opts.filter(o=>!o.dis)));tick()}
  return {ok:okNow,end:S.f&&S.f.endKey,cat:S.endCat,calm:S.calm,done:S.done};
};`,ctx);
const st=ctx.__static();
const evIds=ctx.__ids();
let errs=0;const report=[];
for(const id of evIds){
  const r={id,n:0,err:[],unreach:0,ends:{}};
  for(let i=0;i<RUNS;i++){
    try{const o=ctx.__force(id);if(o.err){r.err.push(o.err);break}if(o.skip)continue;r.n++;if(!o.ok)r.unreach++;const k=o.end&&String(o.end).startsWith('ev:')?o.end:'(other)';r.ends[k]=(r.ends[k]||0)+1}
    catch(x){r.err.push((x&&x.message||String(x)).slice(0,160)+' @'+((x&&x.stack||'').split('\n')[1]||'').trim().slice(0,80));errs++}
  }
  report.push(r);
}
console.log(`events ${evIds.length} · endings ${Object.keys(ctx.FEVEND||{}).length||vm.runInContext('Object.keys(FEVEND).length',ctx)} · files ${fevFiles.join(', ')}`);
if(st.length){console.log('STATIC ('+st.length+'):');st.forEach(s=>console.log('  '+s))}
const bad=report.filter(r=>r.err.length);
if(bad.length){console.log('RUNTIME ERRORS:');bad.forEach(r=>console.log('  '+r.id+': '+[...new Set(r.err)].slice(0,3).join(' | ')))}
const unr=report.filter(r=>r.n&&r.unreach===r.n);
if(unr.length)console.log('NEVER POSSIBLE when forced (check need/when/sp/own):',unr.map(r=>r.id).join(', '));
const w=[...new Set(warns)];if(w.length){console.log('WARNINGS:');w.slice(0,30).forEach(s=>console.log('  '+s))}
if(process.env.VERBOSE)report.forEach(r=>console.log(r.id,r.n,JSON.stringify(r.ends)));
console.log(errs||st.length?'FAIL':'PASS');
