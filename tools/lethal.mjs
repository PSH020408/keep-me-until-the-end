// Per-event death rate: plays N lives with random choices and lists, for every catalogue event, how often it fired
// and how often the life ended in one of its endings. Usage: node tools/lethal.mjs . 3000 [ID-prefix]
import {readFileSync,readdirSync} from 'node:fs';import vm from 'node:vm';
const root=process.argv[2],N=+process.argv[3]||2000;
const base=['core','data/species','data/facts','data/events','data/endings','data/choices','data/fish','data/fishchoice','engine','fish','data/fishgrow','data/fishplus','data/fev'];
const fev=readdirSync(root+'/public/js/data').filter(f=>/^fev_/.test(f)).sort().map(f=>'data/'+f.replace('.js',''));
const rest=['art/paint','art/look','art/raster','art/mammals','art/others','art/gags','art/death','art/fish','art','ui'];
const el=()=>new Proxy({style:{},classList:{add(){},toggle(){},remove(){},contains(){return false}},dataset:{}},{get(t,k){if(k in t)return t[k];if(['appendChild','append','prepend','setAttribute','remove','addEventListener','focus','scrollIntoView','insertBefore','insertAdjacentHTML','querySelectorAll'].includes(k))return ()=>el();if(['querySelector','firstChild','lastChild','lastElementChild','firstElementChild'].includes(k))return k==='querySelector'?()=>el():el();return t[k]},set(t,k,v){t[k]=v;return true}});
const ids={};const ctx={Math,JSON,Object,Array,String,Number,Boolean,Date,console:{log(){},warn(){}},document:{getElementById:id=>ids[id]||(ids[id]=el()),createElement:()=>el(),querySelector:()=>null,querySelectorAll:()=>[]},window:{},localStorage:{getItem:()=>null,setItem(){}},setInterval:()=>1,clearInterval(){},setTimeout:()=>0,clearTimeout(){}};
vm.createContext(ctx);vm.runInContext(base.concat(fev,rest).map(f=>readFileSync(root+'/public/js/'+f+'.js','utf8')).join('\n')+';MODE_NOW="'+(process.env.MODE||'real')+'";',ctx);
const PFX=process.argv[4]||"";const out=vm.runInContext(`(()=>{const fired={},killed={},pre={pre:0,esc:0};const stageOf={};FEV.forEach(e=>stageOf[e.id]=[].concat(e.stage).join('/'));
for(let i=0;i<${N};i++){start();skipping=true;let n=0,last=null;
 while(!S.done&&n++<9000){if(S.pending)S.pending.resolve(pick(S.pending.opts.filter(o=>!o.dis)));tick();}
 const ev=Object.keys(S.seen).filter(k=>k.startsWith('ev')).map(k=>k.slice(2));ev.forEach(id=>fired[id]=(fired[id]||0)+1);
 const k=String(S.f.endKey||'');if(k.startsWith('ev:')){const id=k.slice(3);const base=ev.find(e=>id.startsWith(e+'-'))||id.replace(/-[A-Z0-9]+$/,'');killed[base]=(killed[base]||0)+1}
 if(!S.f.buyAge&&S.f.buyAge!==0)pre.pre++;}
const rows=Object.keys(fired).map(id=>[id,stageOf[id],fired[id],killed[id]||0,((killed[id]||0)/fired[id]).toFixed(2)]).sort((a,b)=>b[3]-a[3]);return {pre,rows:rows.filter(r=>r[0].startsWith("${PFX}"))}})()`,ctx);
console.log(JSON.stringify(out.pre));out.rows.forEach(r=>console.log(r.join('\t')));
