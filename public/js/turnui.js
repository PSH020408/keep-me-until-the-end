/* ---------- v0.20: one click at a time (Uma Musume style) ----------
   · the story box shows one line per click; nothing else moves until the line is read
   · 기록 opens the whole log; ▶▶ skips to the next choice
   · each 육성 turn is a menu (훈련 / 휴식 / 놀기 / 출전 / 스킬 …) under the story box; a category opens a popup
   · every other choice is a popup, shown only after the lines before it have been read
   The simulation itself is untouched: this file only decides when the next step runs and how it is shown. */

const ST={q:[],cur:null,skip:false};
const stBusy=()=>!!(ST.cur||ST.q.length);
const stOn=()=>!skipping&&S&&!S.done&&!$('game').hidden;

/* every line still goes to the log; while a life is being watched it also waits in the story queue */
(()=>{const _a=addLog;addLog=function(text,cls){_a(text,cls);
  if(!stOn()||ST.skip||cls==='pick')return;const li=$('log').firstElementChild;if(li)ST.q.push(li)}})();
(()=>{const _d=showDelta;showDelta=function(a,b){_d(a,b);stDraw()}})();

function stDraw(){
  const box=$('story');if(!box)return;const li=ST.cur||ST.last;
  box.classList.toggle('wait',!!ST.cur);box.classList.toggle('idle',!ST.cur);
  if(!li){box.querySelector('.st-t').textContent='';box.querySelector('.st-a').textContent='';box.querySelector('.st-n').textContent='';return}
  box.dataset.c=li.className||'';
  box.querySelector('.st-a').textContent=li.querySelector('.t').textContent;
  box.querySelector('.st-t').innerHTML=li.querySelector('p').innerHTML;
  box.querySelector('.st-n').textContent=ST.q.length?'▼ '+ST.q.length:'▼';
}
function stNext(){
  if(ST.q.length){ST.cur=ST.q.shift();ST.last=ST.cur;stDraw();return true}
  ST.cur=null;stDraw();return false}
function stClick(){
  if(!S||S.done)return;
  if(ST.cur){ST.cur=null;if(stNext())return}
  run();
}
function stSkip(){
  if(!S||S.done)return;ST.q=[];ST.cur=null;ST.skip=true;stDraw();run()}

/* time moves only between choices, and only while no line is waiting to be read */
run=function(){
  stop();if(!S||S.done){tbHide();return}
  if(!S.waiting)tbHide();
  if(ST.cur)return;
  if(ST.q.length){stNext();return}
  if(S.waiting){ST.skip=false;tbReveal();return}
  tbHide();
  timer=setTimeout(()=>{timer=null;let n=0;
    while(S&&!S.done&&!S.waiting&&!(ST.q.length&&!ST.skip)&&n++<400)tick();
    if(S&&!S.done)render();run()},ST.skip?0:30);
};

/* ---------- the turn menu ---------- */
const TB_CAT=[['train','훈련','🏋'],['rest','휴식','💤'],['play','놀기','🫧'],['cup','출전','🏆'],['skill','스킬','✦'],['sick','아픈 티','🤒'],['etc','기타','…']];
const tbKind=k=>['p','g','w','c','sp'].includes(k)?'train':TB_CAT.some(c=>c[0]===k)?k:'etc';
let TB=null;
function tbHide(){const t=$('turnbar');if(t)t.hidden=true;TB=null}
function tbReveal(){
  const box=$('choice');
  if(TB){$('turnbar').hidden=false;box.hidden=true;return}
  if(S.pending)box.hidden=false;
}
function tbBuild(){
  const box=$('choice'),bar=$('turnbar');bar.innerHTML='';
  const who=box.querySelector('.who'),strip=box.querySelector('.hubstrip'),prompt=box.querySelector('.prompt');
  const head=document.createElement('div');head.className='tb-head';head.textContent=who?who.textContent:'육성';bar.appendChild(head);
  if(strip)bar.appendChild(strip);
  const tiles=[...box.querySelectorAll('.opts button')];
  const groups={};tiles.forEach(b=>{const g=tbKind(b.dataset.k||'etc');(groups[g]=groups[g]||[]).push(b)});
  const menu=document.createElement('div');menu.className='tb-menu';
  TB_CAT.forEach(([g,n,ic])=>{if(!groups[g])return;const b=document.createElement('button');b.type='button';b.className='tb-btn';b.dataset.g=g;
    b.innerHTML='<i></i><span></span>';b.querySelector('i').textContent=ic;b.querySelector('span').textContent=n;
    if(groups[g].some(x=>x.classList.contains('friend')))b.classList.add('friend');
    if(groups[g].every(x=>x.disabled))b.disabled=true;
    b.onclick=()=>tbOpen(g,n,groups[g]);menu.appendChild(b)});
  bar.appendChild(menu);
  if(prompt){prompt.classList.add('tb-flavor');bar.appendChild(prompt)}
  TB={groups};box.hidden=true;bar.hidden=stBusy();
}
function tbOpen(g,n,list){
  const box=$('choice');box.classList.add('hub','pop');
  const who=box.querySelector('.who');if(who)who.textContent=n;
  box.querySelectorAll('.opts button').forEach(b=>{b.hidden=!list.includes(b)});
  let back=box.querySelector('.tb-back');
  if(!back){back=document.createElement('button');back.type='button';back.className='tb-back';back.textContent='◀ 돌아가기';back.onclick=()=>{box.hidden=true};box.appendChild(back)}
  box.hidden=false;
}

/* choices: the 육성 turn becomes the menu; everything else waits for the story */
(()=>{const _c=askChoice;askChoice=function(c,cb){
  _c(c,cb);if(skipping||!S||!S.pending)return;
  const box=$('choice');box.classList.remove('pop');
  if(c.strip){tbBuild();return}
  tbHide();if(stBusy())box.hidden=true;
}})();

/* a fresh life starts with an empty story */
(()=>{const _s=start;start=function(force){ST.q=[];ST.cur=null;ST.last=null;ST.skip=false;tbHide();
  /* the names from the title screen: the owner's (used by makeOwner through NICK) and the fish's (given on the day it is bought) */
  const fn=(($('fname')&&$('fname').value)||'').trim().slice(0,10);
  try{localStorage.setItem('survive-names',JSON.stringify({o:(($('nick').value)||'').trim(),f:fn}))}catch(e){}
  const r=_s(force);if(fn&&S&&S.f){S.f.nameLater=fn;S.f.fixedName=fn}stDraw();return r}})();
try{const n=JSON.parse(localStorage.getItem('survive-names')||'{}');if(n.o)$('nick').value=n.o;if(n.f&&$('fname'))$('fname').value=n.f}catch(e){}

/* the log as a popup */
function logOpen(on){document.body.classList.toggle('logopen',on)}
(()=>{const box=$('story');if(!box)return;
  box.addEventListener('click',e=>{if(e.target.closest('button'))return;stClick()});
  $('stLog').onclick=e=>{e.stopPropagation();logOpen(true)};
  $('stSkip').onclick=e=>{e.stopPropagation();stSkip()};
  const lc=$('logClose');if(lc)lc.onclick=()=>logOpen(false);
  document.addEventListener('keydown',e=>{if(!document.body.classList.contains('ingame'))return;
    if(e.key==='Escape'){logOpen(false);const b=$('choice');if(b.classList.contains('pop'))b.hidden=true;return}
    if((e.key===' '||e.key==='Enter')&&ST.cur&&!e.target.closest('input,textarea,button')){e.preventDefault();stClick()}});
})();
