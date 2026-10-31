/* ---------- v0.23.1: the stage follows the story — as camera and light, not as drawn props ----------
   v0.23.0 drew props (a hand, a net, a cat's paw, a bucket, a heron) out of flat shapes; next to the painted fish they
   looked like a broken slide deck. Until painted prop sprites exist (img/props/, same pipeline as the fish), a line is
   shown with what code does well: light, colour grading, depth of field, particles, a predator's shadow, a flash, a shake.
   The painted fish itself is the only figure: it leaps out of the water, flops in the foreground on the floor, glows.
   A line is matched against EVFX (first match wins). When a life starts to end, the death scene appears with the first
   line of the ending instead of after the last one. */

const evSp=(pose,px,o)=>fishSprite(S.sp.id,pose,px,o||{});
const evPx=()=>clamp((S.f&&S.f.len||4)*3.2,30,100);
let EVID=0;
const evDefs=(id)=>`<defs>
 <filter id="${id}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
 <filter id="${id}p" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".8"/></filter>
 <radialGradient id="${id}v" cx=".5" cy=".5" r=".72"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="1"/></radialGradient>
 <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A57C"/><stop offset=".5" stop-color="#A9825A"/><stop offset="1" stop-color="#7E5E3E"/></linearGradient>
 <radialGradient id="${id}h" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#FFC2D4"/><stop offset="1" stop-color="#E8628E"/></radialGradient>
</defs>`;
/* building blocks */
const evTint=(col,op)=>`<rect width="260" height="200" fill="${col}" opacity="${op}" style="mix-blend-mode:multiply"/>`;
const evGlow=(col,op)=>`<rect width="260" height="200" fill="${col}" opacity="${op}" style="mix-blend-mode:screen"/>`;
const evMotes=(id,n,col,dir,op)=>Array.from({length:n},(_,i)=>{const x=10+(i*61)%240,y=dir<0?200:-6,r=.7+(i%4)*.45,d=5+(i%5)*1.6;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op||.8}" filter="url(#${id}p)"><animate attributeName="cy" values="${y};${dir<0?-8:206}" dur="${d}s" begin="${-i*.9}s" repeatCount="indefinite"/><animate attributeName="cx" values="${x};${x+(i%2?10:-10)};${x}" dur="${d}s" begin="${-i*.9}s" repeatCount="indefinite"/></circle>`}).join('');
const evSpark=(id,n,col)=>Array.from({length:n},(_,i)=>{const x=34+(i*67)%192,y=26+(i*41)%120,s=3+(i%3)*1.6;
  return `<g transform="translate(${x} ${y})" filter="url(#${id}g)"><path d="M0 ${-s*2}Q${s*.25} ${-s*.25} ${s*2} 0Q${s*.25} ${s*.25} 0 ${s*2}Q${-s*.25} ${s*.25} ${-s*2} 0Q${-s*.25} ${-s*.25} 0 ${-s*2}Z" fill="${col}"><animateTransform attributeName="transform" type="scale" values="0;1;0" dur="${1.4+i*.17}s" begin="${-i*.35}s" repeatCount="indefinite"/></path></g>`}).join('');
const evHearts=id=>Array.from({length:7},(_,i)=>{const x=36+(i*37)%190,s=.55+(i%3)*.18,d=3+i*.35;
  return `<g opacity="0"><animate attributeName="opacity" values="0;.95;0" dur="${d}s" begin="${-i*.6}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="${x} 196;${x+(i%2?8:-8)} 40" dur="${d}s" begin="${-i*.6}s" repeatCount="indefinite"/><path transform="scale(${s})" d="M0 6C-10 -4 -16 -10 -9 -15C-5 -18 -1 -15 0 -12C1 -15 5 -18 9 -15C16 -10 10 -4 0 6Z" fill="url(#${id}h)" filter="url(#${id}g)"/></g>`}).join('');
const evLines=(id,vertical)=>Array.from({length:9},(_,i)=>{const p=14+(i*29)%232,len=40+(i%3)*24;
  return vertical?`<path d="M${p} -40v${len}" stroke="#fff" stroke-width="${.8+(i%3)*.5}" stroke-linecap="round" opacity=".55"><animateTransform attributeName="transform" type="translate" values="0 0;0 260" dur="${.5+(i%4)*.12}s" begin="${-i*.11}s" repeatCount="indefinite"/></path>`
    :`<path d="M300 ${p}h-${len}" stroke="#fff" stroke-width="${.8+(i%3)*.5}" stroke-linecap="round" opacity=".5"><animateTransform attributeName="transform" type="translate" values="0 0;-360 0" dur="${.55+(i%4)*.12}s" begin="${-i*.13}s" repeatCount="indefinite"/></path>`}).join('');
const evShadow=(id,dur)=>`<ellipse cx="-80" cy="40" rx="90" ry="26" fill="#0A1418" opacity=".45" filter="url(#${id}s)"><animate attributeName="cx" values="-90;360" dur="${dur||3.4}s" repeatCount="indefinite"/></ellipse>`;
const evFlash=(col,period)=>`<rect width="260" height="200" fill="${col}" opacity="0"><animate attributeName="opacity" values="0;0;.85;0" keyTimes="0;.82;.86;1" dur="${period||2.2}s" repeatCount="indefinite"/></rect>`;

const EVSCN={
 /* the fish in the foreground: flopping on a wooden floor while the tank behind goes soft */
 floor:id=>`<rect width="260" height="200" fill="#F2EBDD" opacity=".55"/><rect width="260" height="200" fill="url(#${id}v)" opacity=".35"/>`+
   `<rect y="138" width="260" height="62" fill="url(#${id}w)"/>`+Array.from({length:7},(_,i)=>`<path d="M${-20+i*44} 138L${10+i*44} 200" stroke="#6E5236" stroke-width=".8" opacity=".45"/>`).join('')+
   `<ellipse cx="128" cy="170" rx="44" ry="6" fill="#3A2A1A" opacity=".35" filter="url(#${id}s)"><animate attributeName="rx" values="44;30;40;34;44" dur="1.1s" repeatCount="indefinite"/></ellipse>`+
   `<ellipse cx="132" cy="168" rx="26" ry="3" fill="#BFE1EC" opacity=".55"/>`+
   `<g transform="translate(128 152)"><g><animateTransform attributeName="transform" type="translate" values="0 0;-4 -26;-8 0;-2 -14;0 0" keyTimes="0;.25;.5;.75;1" calcMode="spline" keySplines=".2 .7 .4 1;.6 0 .8 .3;.2 .7 .4 1;.6 0 .8 .3" dur="1.1s" repeatCount="indefinite"/>`+
   `<g><animateTransform attributeName="transform" type="rotate" values="0;-28;14;-12;0" dur="1.1s" repeatCount="indefinite"/>${evSp('swim',evPx()*1.25)}</g></g></g>`+
   Array.from({length:5},(_,i)=>`<circle cx="${110+i*9}" cy="160" r="${1+(i%2)*.6}" fill="#DDF1F7" filter="url(#${id}p)"><animate attributeName="cy" values="160;${132-(i%3)*8};168" dur="${.9+i*.15}s" begin="${-i*.2}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="${.9+i*.15}s" begin="${-i*.2}s" repeatCount="indefinite"/></circle>`).join(''),
 /* the fish arcs up out of the water and falls back, with a splash */
 leap:id=>`<rect width="260" height="200" fill="#000" opacity=".12"/>`+
   `<g><animateMotion dur="1.8s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".25 .6 .5 1" path="M100 112 Q132 -6 168 78 Q176 98 170 116"/><g><animateTransform attributeName="transform" type="rotate" values="-40;10;70" dur="1.8s" repeatCount="indefinite"/><g filter="url(#${id}g)">${evSp('swim',Math.min(64,evPx()))}</g></g></g>`+
   [0,1,2].map(i=>`<ellipse cx="${i?168:100}" cy="${i?118:114}" rx="4" ry="1.2" fill="none" stroke="#fff" stroke-width="1.2" opacity=".9"><animate attributeName="rx" values="2;${20+i*6}" dur="${.9+i*.2}s" begin="${-i*.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="${.9+i*.2}s" begin="${-i*.3}s" repeatCount="indefinite"/></ellipse>`).join('')+
   Array.from({length:6},(_,i)=>`<circle cx="${96+i*3}" cy="112" r="1.3" fill="#E6F6FB"><animate attributeName="cy" values="112;${86-i*3};116" dur="${.8+i*.1}s" repeatCount="indefinite"/><animate attributeName="cx" values="${96+i*3};${84+i*6}" dur="${.8+i*.1}s" repeatCount="indefinite"/></circle>`).join(''),
 /* a predator from above: a shadow sweeps over, the water darkens at the edges */
 danger:id=>evTint('#203038',.25)+evShadow(id,2.8)+`<rect width="260" height="200" fill="#5A0E0E" opacity=".0"><animate attributeName="opacity" values="0;.18;0" dur="1.4s" repeatCount="indefinite"/></rect>`+`<rect width="260" height="200" fill="url(#${id}v)" opacity=".5"/>`,
 net:id=>evTint('#2A3A40',.18)+evShadow(id,2.2)+`<rect width="260" height="200" fill="url(#${id}v)" opacity=".35"/>`,
 hook:id=>evTint('#203840',.15)+`<path d="M170 -4V120" stroke="#E8F2F6" stroke-width=".7" opacity=".8"/><circle cx="170" cy="120" r="2.2" fill="#fff" filter="url(#${id}g)"><animate attributeName="opacity" values=".3;1;.3" dur="1.2s" repeatCount="indefinite"/></circle>`,
 current:id=>evTint('#4A3A20',.28)+evLines(id,false)+evMotes(id,14,'#D8C8A0',1,.6),
 fall:id=>evGlow('#DDEFFF',.12)+evLines(id,true)+evMotes(id,10,'#fff',-1,.7),
 dark:id=>evTint('#0E1A30',.62)+`<circle cx="214" cy="30" r="9" fill="#F6EEC8" filter="url(#${id}g)" opacity=".85"/>`+evMotes(id,6,'#BFD8FF',-1,.5),
 box:id=>evTint('#3A2A14',.55)+`<rect width="260" height="200" fill="url(#${id}v)" opacity=".7"/>`,
 flash:id=>evGlow('#FFF8E8',.06)+evFlash('#FFFFFF',2),
 feed:id=>Array.from({length:12},(_,i)=>{const x=96+(i*13)%70;return `<rect x="${x}" y="-6" width="${2+(i%3)}" height="${1.6+(i%2)}" rx=".6" fill="${['#C98A3A','#B8642E','#D9A050'][i%3]}"><animate attributeName="y" values="-6;${110+(i%4)*14}" dur="${2.4+i*.2}s" begin="${-i*.3}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" values="0 ${x} 60;180 ${x} 60" dur="${2.4+i*.2}s" begin="${-i*.3}s" repeatCount="indefinite"/></rect>`}).join(''),
 water:id=>evGlow('#E8F8FF',.14)+Array.from({length:4},(_,i)=>`<ellipse cx="${80+i*34}" cy="${60+(i%2)*20}" rx="4" ry="1.4" fill="none" stroke="#fff" stroke-width="1"><animate attributeName="rx" values="2;26" dur="${1.4+i*.2}s" begin="${-i*.4}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="${1.4+i*.2}s" begin="${-i*.4}s" repeatCount="indefinite"/></ellipse>`).join('')+evMotes(id,12,'#fff',-1,.8),
 sick:id=>evTint('#6A7A50',.28)+`<rect width="260" height="200" fill="url(#${id}v)" opacity=".4"/>`,
 hot:id=>evTint('#F2A050',.22)+evGlow('#FFD9A0',.12)+evMotes(id,8,'#FFE8C0',-1,.5),
 cold:id=>evTint('#7FA8D8',.25)+evGlow('#E8F4FF',.18)+evMotes(id,22,'#FFFFFF',1,.9),
 fight:id=>`<rect width="260" height="200" fill="#C0302A" opacity="0"><animate attributeName="opacity" values="0;.28;0" dur=".7s" repeatCount="indefinite"/></rect>`+`<rect width="260" height="200" fill="url(#${id}v)" opacity=".45"/>`,
 star:id=>evGlow('#FFF3C0',.12)+evSpark(id,8,'#FFE07A'),
 heart:id=>evGlow('#FFE0EA',.1)+evHearts(id),
 train:id=>evLines(id,false),
 bubble:id=>Array.from({length:9},(_,i)=>`<circle cx="${70+i*14}" cy="190" r="${1.6+(i%3)*.8}" fill="#fff" fill-opacity=".15" stroke="#fff" stroke-width=".8"><animate attributeName="cy" values="190;50" dur="${2.2+i*.3}s" begin="${-i*.35}s" repeatCount="indefinite"/><animate attributeName="cx" values="${70+i*14};${74+i*14};${70+i*14}" dur="1.2s" repeatCount="indefinite"/></circle>`).join('')
};
/* what to show for a line (first match wins) */
const EVFX=[
 [/마룻바닥|바닥에서 몸을 (튕|퍼덕)|수조 밖 바닥|바닥으로 떨어졌|수건 위로 떨어|바닥에서 퍼덕|욕조 바닥에서/,'floor'],
 [/수면 위로 (몸을 날|뛰어)|뛰어올랐|뛰어오릅|점프|뚜껑을 (머리로 )?밀어/,'leap'],
 [/왜가리|수달|가마우지|새가|부리|고양이|「대장」|배스|블랙|메기|포식/,'danger'],
 [/낚싯|낚시꾼|바늘|미끼|루어/,'hook'],
 [/뜰채|그물/,'net'],
 [/폭포/,'fall'],[/장마|홍수|불어난|떠내려|물살/,'current'],
 [/택배|상자|스티로폼|봉지/,'box'],
 [/정전|불 꺼진|불이 꺼|한밤중|새벽|밤새/,'dark'],
 [/물갈이|물을 (갈|반|채|조금씩)|양동이|수돗물/,'water'],
 [/먹이|사료|과식|간식/,'feed'],
 [/사진|카메라|영상|촬영|방송|휴대폰/,'flash'],
 [/병이|하얀 점|곰팡이|기생충|백점|지느러미가 녹|아가미가 (붉|부)|아팠/,'sick'],
 [/여름|더위|뜨거|과열|폭염/,'hot'],[/겨울|얼음|추위|차가운|살얼음/,'cold'],
 [/물렸|쪼아|싸움|공격|들이받|결투|박치기/,'fight'],
 [/♥|인연/,'heart'],
 [/★|고비 통과|우승|🏆|스킬 발동|수련의 성과|이겼/,'star'],
 [/훈련|헤엄쳤|왕복|거슬러/,'train'],
 [/숨|산소|기포|뻐끔/,'bubble']
];
const EV_HOME=['water','flash','feed','dark'];
const evHome=()=>S&&S.f&&!S.wild&&['tank','pond'].includes(S.env);
let EV_CUR=null;
function evSet(text){
  const m=text?EVFX.find(([r,k])=>r.test(text)&&(!EV_HOME.includes(k)||evHome())):null,k=m?m[1]:null;
  const st=typeof $==='function'&&$('stage');if(st&&st.dataset){if(k)st.dataset.ev=k;else delete st.dataset.ev}
  if(k===EV_CUR)return;EV_CUR=k;
  if(S&&S.f&&!skipping&&typeof drawStage==='function'){stageKey='';drawStage(true)}
}
(()=>{const _f=fishStageSvg;fishStageSvg=function(){
  /* the death scene comes with the first line of the ending */
  let s;if(S&&!S.done&&S.ending&&S.fx){S.done=true;try{s=_f()}finally{S.done=false}}else s=_f();
  if(EV_CUR&&EVSCN[EV_CUR]&&!S.done){const id='ev'+(EVID++);s=s.replace(/<\/svg>\s*$/,`<g class="evfx" pointer-events="none">${evDefs(id)}${EVSCN[EV_CUR](id)}</g></svg>`)}
  return s}})();
(()=>{const _e=endLife;endLife=function(lines,cat,fact,pl,calm,fx,pred){if(S&&!skipping){S.fx=fx||(calm?'ghost':'sickdead');S.pred=pred||null;S.calm=!!calm}return _e.apply(this,arguments)}})();
