const $=id=>document.getElementById(id);
const R=Math.random, pick=a=>a[Math.floor(R()*a.length)], clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wpick=l=>{let t=l.reduce((s,x)=>s+x[1],0),r=R()*t;for(const x of l){if((r-=x[1])<=0)return x[0]}return l[l.length-1][0]};

/* Korean particles: "{n}은" picks 은/는 from the name's last syllable */
const hb=w=>{const c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0};
const rl=w=>{const c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28===8};
const PAIR={'이':'이가','가':'이가','은':'은는','는':'은는','을':'을를','를':'을를','와':'과와','과':'과와','아':'아야','야':'아야'};
function josa(n,p){if(p==='으로'||p==='로')return n+(hb(n)&&!rl(n)?'으로':'로');const pr=PAIR[p];return n+(hb(n)?pr[0]:pr[1])}
function T(s){const n=S.disp;return s.replace(/\{n\}이었/g,()=>n+(hb(n)?'이었':'였')).replace(/\{n\}이라/g,()=>n+(hb(n)?'이라':'라')).replace(/\{n\}(으로|이|가|은|는|을|를|와|과|로|아|야)?/g,(_,p)=>p?josa(n,p):n).replace(/\{a\}/g,S.sp.adult||'').replace(/\{d\}/g,S.sp.dish||'')}

const PLEDGE_BREED='번식시킨다면 태어난 생명까지 책임지겠습니다';
/* fish, reptiles and insects are often bred on purpose, so their fifth promise is about the young */
const BREED_G=['fish','reptile','snake','amphib','insect','turtle'];
/* fish keep the same five promises, worded for a tank: there is rarely a fish vet, and the tank itself is most of the care */
const PLEDGE_FISH=['끝까지 함께하겠습니다','아프면 알아보고 치료하겠습니다','다 자랄 몸에 맞는 수조, 깨끗한 물과 먹이를 챙기겠습니다','탈출과 사고로부터 지키겠습니다',PLEDGE_BREED,'자연에 풀어놓지 않겠습니다'];
const pledgeList=sheet=>{const only=g=>typeof ACTIVE_GROUPS!=='undefined'&&ACTIVE_GROUPS.every(x=>g.includes(x));
  const g=!sheet&&S?S.sp.g:null;
  if(g==='fish'||(!g&&only(['fish']))) return PLEDGE_FISH;
  return (g?BREED_G.includes(g):only(BREED_G))?PLEDGE.slice(0,4).concat([PLEDGE_BREED]):PLEDGE};
const PLEDGE=['끝까지 함께하겠습니다','아프면 병원에 데려가겠습니다','매일 먹이와 물, 깨끗한 환경을 챙기겠습니다','탈출과 사고로부터 지키겠습니다','사고팔거나 번식에 이용하지 않겠습니다'];

