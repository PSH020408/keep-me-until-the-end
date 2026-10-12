// Which "실제로는" fact does each species end with? Prints fact → species, to catch a fact shown to the wrong fish.
// Usage: node tools/check_facts.mjs [lives per species=300]
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const N=+process.argv[2]||300;
const src0=readFileSync(new URL('./sim.mjs',import.meta.url),'utf8');
const files=JSON.parse(src0.match(/const files=(\[[^\]]+\])/)[1].replace(/'/g,'"'));
const el=()=>new Proxy({style:{},classList:{add(){},toggle(){},remove(){},contains(){return false}},dataset:{}},{get(t,k){if(k in t)return t[k];if(['appendChild','append','prepend','setAttribute','remove','addEventListener','focus','scrollIntoView','insertBefore','insertAdjacentHTML','querySelectorAll'].includes(k))return ()=>el();if(['querySelector','firstChild','lastChild','lastElementChild'].includes(k))return k==='querySelector'?()=>el():el();return t[k]},set(t,k,v){t[k]=v;return true}});
const ids={};
const ctx={Math,JSON,Object,Array,String,Number,Boolean,Date,console,
  document:{getElementById:id=>ids[id]||(ids[id]=el()),createElement:()=>el(),querySelector:()=>null,querySelectorAll:()=>[],body:el()},
  window:{},localStorage:{getItem:()=>null,setItem(){}},setInterval:()=>1,clearInterval(){},setTimeout:()=>0,clearTimeout(){}};
vm.createContext(ctx);
const src=files.map(f=>readFileSync(new URL('../public/js/'+f+'.js',import.meta.url),'utf8')).join('\n')+`
;globalThis.__seen={};globalThis.__bad={};const __al=addLog;addLog=function(t,c){__al(t,c);if(!S||!S.f||!t)return;const f=S.f,g=isGold();const flag=m=>{(__bad[m]=__bad[m]||{})[S.sp.id+': '+t.slice(0,90)]=1};
 if(/히터/.test(t)&&!f.heater&&!/히터(가|는)? ?없|히터를 (사|주문|달)|히터와 수온계|히터 없이/.test(t))flag('heater mentioned, none in tank');
 if(f.filter==='없음'&&!S.preOwner&&/여과기/.test(t)&&!/여과기(는|가)? ?없|여과기를 (사|달)/.test(t))flag('filter mentioned, none');
 if(f.tank==='pond'&&!S.preOwner&&!S.wild&&/유리|뚜껑|거실|마룻바닥|조명|히터|수조 위/.test(t))flag('indoor word in a pond');
 if(f.tank!=='pond'&&!S.preOwner&&!S.wild&&/연못/.test(t)&&!/연못이 있는|연못으로|연못에 사는|연못 같은/.test(t))flag('pond word in a tank');
 if(!g&&S.sp.id!=='koi'&&/금붕어(는|가|의)/.test(t)&&/^(금붕어|.{0,6}금붕어는)/.test(t))flag('goldfish sentence for another fish');
 if(/베타(는|가|의)/.test(t)&&!['betta','wildbetta'].includes(S.sp.id)&&!f.mates.some(m=>m.id==='betta')&&!/베타 한 마리/.test(t))flag('betta sentence for another fish');
};const __se=showEnd;showEnd=function(cat,fact,calm){const k=Object.keys(F).find(k=>F[k]===fact)||('text:'+String(fact).slice(0,40));(__seen[k]=__seen[k]||{})[S.sp.id+' ('+(S.f&&S.f.endKey||'?')+')']=1;return __se(cat,fact,calm)};
globalThis.__run=(sp)=>{start(sp);skipping=true;let n=0;while(!S.done&&n++<9000){if(S.pending)S.pending.resolve(pick(S.pending.opts));tick()}skipping=false};
globalThis.__ids=SP.filter(s=>s.g==='fish').map(s=>s.id);`;
vm.runInContext(src,ctx);
for(const id of ctx.__ids)for(let i=0;i<N;i++)ctx.__run(id);
console.log('--- context flags in log lines');
for(const [k,v] of Object.entries(ctx.__bad)){console.log(k);Object.keys(v).slice(0,12).forEach(x=>console.log('   ',x))}
console.log('--- fact → species (ending)');
for(const [k,v] of Object.entries(ctx.__seen).sort()){
  const sp={};Object.keys(v).forEach(x=>{const [s,e]=x.split(' ');(sp[s]=sp[s]||new Set()).add(e)});
  console.log(k.padEnd(14),Object.entries(sp).map(([s,e])=>s+[...e].join('')).join(' '));
}
