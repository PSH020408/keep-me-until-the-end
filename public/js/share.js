/* ---------- 모두의 주마등: lives other players chose to share ----------
   A kept life can also be posted to a shared table (Supabase, Postgres behind a REST API).
   The page only ever reads and inserts; rows cannot be changed or deleted from the browser
   (row-level security, see docs/SHARING.md). Nothing is sent unless the player ticks the box.
   With no project configured below, the shared section stays hidden and the game works as before. */
const SHARE_CFG={
  url:'https://oauxtbxyjrtchxsfyucm.supabase.co',
  key:'sb_publishable_twic4vU9mUSIjonkj6ybQg_ijxC1qmq',   // publishable key: safe to publish, row-level security decides what it may do
};
const shareOn=()=>!!(SHARE_CFG.url&&SHARE_CFG.key)&&typeof fetch==='function';
const SHARE_VER='0.10.0';

/* words that are masked in names and last words before posting and again when showing */
const BADW=['씨발','시발','씨바','씹','좆','병신','븅신','지랄','개새','새끼','니미','느금','엠창','fuck','shit','bitch','cunt','nigg'];
function clean(t,max){t=String(t==null?'':t).replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
  BADW.forEach(w=>{t=t.replace(new RegExp(w,'gi'),m=>'○'.repeat(m.length))});return t}

/* a record coming back from the table is treated as untrusted: every field is rebuilt with known types and lengths */
const LINE_C=['','good','bad','sub','end','mile','neutral','inner','star'];
function sanitizeRec(r){
  const m=r&&typeof r.rec==='object'&&r.rec?r.rec:{};const s=(v,n)=>clean(v,n);
  const sp=typeof FX!=='undefined'&&FX[m.sp]?m.sp:'';
  const pl=x=>({p:s(x&&x.p,60),a:s(x&&x.a,24),n:(Array.isArray(x&&x.n)?x.n:[]).slice(0,4).map(v=>s(v,60))});
  return {id:'pub'+(r.id|0),pub:1,nick:s(r.nick,12),n:s(m.n,40),sp,lived:s(m.lived,24),pot:s(m.pot,24),pct:Math.max(0,Math.min(100,m.pct|0)),
    cat:s(m.cat,20),calm:!!m.calm,kept:m.kept==null?null:Math.max(0,Math.min(9,m.kept|0)),of:Math.max(1,Math.min(9,m.of|0||6)),
    own:m.own?s(m.own,40):null,path:s(m.path,140),fact:s(m.fact,400),lw:s(m.lw,80),d:s(m.d,10),
    pls:(Array.isArray(m.pls)?m.pls:[]).slice(0,9).map(pl),
    prev:(Array.isArray(m.prev)?m.prev:[]).slice(0,4).map(p=>({o:s(p&&p.o,40),pls:(Array.isArray(p&&p.pls)?p.pls:[]).slice(0,9).map(pl)})),
    story:(Array.isArray(m.story)?m.story:[]).slice(0,40).map(l=>({a:s(l&&l.a,24),t:s(l&&l.t,300),c:LINE_C.includes(l&&l.c)?l.c:''}))};
}

/* a publishable key (sb_publishable_…) goes in the apikey header only; an old JWT anon key also as a bearer token */
const shareHeaders=extra=>Object.assign({apikey:SHARE_CFG.key,'Content-Type':'application/json'},/^eyJ/.test(SHARE_CFG.key)?{Authorization:'Bearer '+SHARE_CFG.key}:{},extra||{});
const api=(path,opt)=>fetch(SHARE_CFG.url.replace(/\/$/,'')+'/rest/v1/'+path,Object.assign({headers:shareHeaders()},opt||{}));

async function sharePost(rec){
  if(!shareOn())return false;
  const body={nick:clean(S.o&&S.o.name||'익명',12)||'익명',species:rec.sp||'',cause:clean(rec.cat,20),calm:!!rec.calm,kept:rec.kept,ver:SHARE_VER,
    rec:Object.assign({},rec,{id:undefined,n:clean(rec.n,40),own:rec.own?clean(rec.own,40):null,lw:clean(rec.lw,80),story:(rec.story||[]).slice(0,40)})};
  try{const r=await api('lives',{method:'POST',headers:shareHeaders({Prefer:'return=minimal'}),body:JSON.stringify(body)});
    if(r.ok)setTimeout(shareLoad,600);return r.ok}catch(e){return false}
}

let pubRows=[],pubAll=false;
async function shareLoad(){
  const sec=$('pubSec');if(!sec)return;
  if(!shareOn()){sec.hidden=true;return}
  sec.hidden=false;$('pubSummary').textContent='불러오는 중…';
  try{
    const [rows,st]=await Promise.all([
      api('lives?select=id,nick,rec,created_at&order=created_at.desc&limit=60').then(r=>r.ok?r.json():[]),
      api('life_stats?select=*').then(r=>r.ok?r.json():[])]);
    pubRows=(Array.isArray(rows)?rows:[]).map(sanitizeRec);
    const t=Array.isArray(st)&&st[0]||{};
    $('pubSummary').textContent=t.total?('지금까지 남겨진 생 '+t.total+' · 끝까지 산 생 '+t.lived+' ('+Math.round(t.lived/t.total*100)+'%) · 눌러서 다시 보기'):'아직 아무도 남기지 않았습니다. 첫 번째 생을 남겨 주세요.';
    drawPub();
  }catch(e){$('pubSummary').textContent='모두의 주마등을 불러오지 못했습니다. 잠시 뒤 다시 열어 주세요.'}
}
function drawPub(){
  const ul=$('pubList');ul.innerHTML='';
  (pubAll?pubRows:pubRows.slice(0,10)).forEach(m=>{const li=document.createElement('li');
    li.innerHTML='<button type="button" class="mrow"><span></span><span class="c"></span></button>';
    const r=li.firstChild;r.firstChild.textContent=(m.nick||'익명')+' 님의 '+m.n+' · '+m.lived+(m.kept!=null?' · 서약 '+m.kept+'/'+m.of:'')+(m.lw?' — "'+m.lw+'"':'');
    const c=r.lastChild;c.textContent=m.cat;if(m.calm)c.classList.add('calm');r.onclick=()=>replay(m);ul.appendChild(li)});
  const more=$('pubMore');if(more){more.hidden=pubRows.length<=10;more.textContent=pubAll?'접기':'더 보기 ('+pubRows.length+')'}
}
if($('pubMore'))$('pubMore').onclick=()=>{pubAll=!pubAll;drawPub()};
shareLoad();
