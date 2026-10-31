/* ---------- v0.23: the stage follows the story ----------
   Each line in the story box can call up a short scene: the fish flopping on the floor, leaping out of the water, a hand
   net coming down, the cat's paw, food falling, a water change, a power cut, a camera flash, a heron, an otter, a hook…
   A line is matched against EVFX (first match wins). A 'full' scene replaces the stage while the line is on screen;
   an 'over' scene is drawn on top of the tank. When a life starts to end, the death scene appears with the first line
   of the ending instead of after the last one. */

const evSp=(pose,px,o)=>fishSprite(S.sp.id,pose,px,o||{});
const evPx=()=>clamp((S.f&&S.f.len||4)*3.2,26,96);
const evBg=(top,bot,line)=>`<rect width="260" height="200" fill="${top}"/><rect y="${line}" width="260" height="${200-line}" fill="${bot}"/>`;
const evDrops=(x,y,n)=>Array.from({length:n},(_,i)=>`<circle cx="${x-14+i*9}" cy="${y}" r="1.6" fill="#BFE3F0"><animate attributeName="cy" values="${y};${y+18}" dur="${.7+i*.17}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="${.7+i*.17}s" repeatCount="indefinite"/></circle>`).join('');
const evStars=(n,col)=>Array.from({length:n},(_,i)=>{const x=30+(i*53)%200,y=24+(i*37)%120,s=4+(i%3)*2;return `<path d="M${x} ${y-s}L${x+s*.3} ${y-s*.3}L${x+s} ${y}L${x+s*.3} ${y+s*.3}L${x} ${y+s}L${x-s*.3} ${y+s*.3}L${x-s} ${y}L${x-s*.3} ${y-s*.3}Z" fill="${col}"><animate attributeName="opacity" values="0;1;0" dur="${1.2+i*.2}s" begin="${-i*.3}s" repeatCount="indefinite"/></path>`}).join('');

const EVSCN={
 /* full scenes */
 floor:()=>({full:1,s:evBg('#E4DED2','#B89A74',140)+`<rect y="136" width="260" height="6" fill="#8E7454"/>`+Array.from({length:6},(_,i)=>`<path d="M${i*46} 142L${i*46+30} 200" stroke="#A88A64" stroke-width="1.2"/>`).join('')+
   `<rect x="150" y="40" width="96" height="70" fill="#9FC9D6" stroke="#4A5458" stroke-width="2.4" opacity=".9"/><rect x="146" y="110" width="104" height="30" fill="#7E6A52"/>`+
   `<g transform="translate(96 150)"><g><animateTransform attributeName="transform" type="translate" values="0 0;-6 -22;-10 0;-4 -12;0 0" dur="1.1s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="rotate" values="0;-35;20;-15;0" dur="1.1s" repeatCount="indefinite"/>${evSp('swim',evPx())}</g></g></g>`+
   `<ellipse cx="96" cy="166" rx="30" ry="4" fill="#7FA9B6" opacity=".45"/>`+evDrops(96,150,4)}),
 leap:()=>({full:1,s:evBg('#E4DED2','#9C8466',168)+`<rect x="40" y="70" width="180" height="96" fill="#A9D6E4" stroke="#4A5458" stroke-width="2.6"/><path d="M40 70H220" stroke="#fff" stroke-width="1.5" opacity=".6"/>`+
   `<g><animateMotion dur="1.6s" repeatCount="indefinite" path="M90 110 Q130 -10 170 60 Q190 100 150 120 Q120 130 90 110"/><g><animateTransform attributeName="transform" type="rotate" values="-30;20;60;-30" dur="1.6s" repeatCount="indefinite"/>${evSp('swim',Math.min(60,evPx()))}</g></g>`+
   `<g fill="none" stroke="#fff" stroke-width="1.4" opacity=".8"><ellipse cx="96" cy="70" rx="10" ry="2"><animate attributeName="rx" values="2;18;2" dur="1.6s" repeatCount="indefinite"/></ellipse></g>`+evDrops(130,40,3)}),
 box:()=>({full:1,s:evBg('#D8D2C4','#B8A88A',150)+`<g transform="translate(130 112)"><path d="M-62 -40H62V48H-62Z" fill="#C9A87A" stroke="#7E6440" stroke-width="2"/><path d="M-62 -40L-40 -62H84L62 -40Z" fill="#DBBE8E" stroke="#7E6440" stroke-width="2"/><rect x="-22" y="-14" width="44" height="18" fill="#F4F0E6"/><text y="0" text-anchor="middle" font-size="9" font-family="Jua,sans-serif" fill="#C4301F">생물 · 취급주의</text>`+
   `<animateTransform attributeName="transform" type="rotate" values="0;-3;2;0" dur="1.4s" repeatCount="indefinite" additive="sum"/></g>`}),
 heron:()=>({full:1,s:evBg('#CFE0D8','#6E9A8A',96)+`<path d="M0 96Q80 88 160 94T260 92" stroke="#fff" stroke-width="1.5" fill="none" opacity=".6"/>`+
   `<g transform="translate(70 64)"><path d="M10 64L12 10" stroke="#5A5A5A" stroke-width="3"/><path d="M24 64L22 12" stroke="#5A5A5A" stroke-width="3"/><ellipse cx="18" cy="0" rx="22" ry="12" fill="#B8C0C8"/><path d="M30 -6Q44 -30 40 -46" stroke="#B8C0C8" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="40" cy="-48" r="7" fill="#D8DEE4"/>`+
   `<g><path d="M44 -48L78 -40L44 -44Z" fill="#E8C24A"><animateTransform attributeName="transform" type="rotate" values="0 44 -46;24 44 -46;0 44 -46" dur="2.2s" repeatCount="indefinite"/></path></g><circle cx="42" cy="-50" r="1.6" fill="#1A1A1A"/></g>`+
   `<g transform="translate(160 140)">${evSp('swim',Math.min(50,evPx()))}<animateTransform attributeName="transform" type="translate" values="160 140;150 146;160 140" dur="2s" repeatCount="indefinite"/></g>`}),
 otter:()=>({full:1,s:evBg('#8EAA92','#5E8478',60)+`<path d="M0 60Q60 52 130 58T260 54" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/><path d="M0 200L0 150Q60 120 110 150L140 200Z" fill="#6A5E4A"/>`+
   `<g transform="translate(90 120)"><ellipse rx="34" ry="14" fill="#6A4E34"/><circle cx="-30" cy="-6" r="11" fill="#7A5A3C"/><circle cx="-34" cy="-9" r="1.8" fill="#111"/><circle cx="-40" cy="-4" r="2" fill="#222"/><path d="M30 0Q50 4 56 -4" stroke="#6A4E34" stroke-width="6" fill="none" stroke-linecap="round"/>`+
   `<animateTransform attributeName="transform" type="translate" values="90 120;104 116;90 120" dur="1.8s" repeatCount="indefinite"/></g>`+
   `<g transform="translate(180 128)"><g><animateTransform attributeName="transform" type="translate" values="0 0;-10 -6;8 4;0 0" dur=".9s" repeatCount="indefinite"/>${evSp('swim',Math.min(50,evPx()))}</g></g>`}),
 angler:()=>({full:1,s:evBg('#CFE0E8','#5E8A98',70)+`<rect x="0" y="40" width="260" height="10" fill="#8A7A6A"/><path d="M40 40L220 -10" stroke="#3A3A3A" stroke-width="2.4"/><path d="M220 -10L200 140" stroke="#DDD" stroke-width=".8"/>`+
   `<g transform="translate(200 140)"><path d="M0 0q4 8 -2 10" stroke="#9AA4AA" stroke-width="1.4" fill="none"/><path d="M-2 10q-6 2 -4 -6" stroke="#C9584B" stroke-width="3" fill="none" stroke-linecap="round"/></g>`+
   `<g transform="translate(150 150)"><g><animateTransform attributeName="transform" type="translate" values="0 0;24 -6;0 0" dur="2.6s" repeatCount="indefinite"/>${evSp('swim',Math.min(56,evPx()))}</g></g>`}),
 waterfall:()=>({full:1,s:evBg('#B8CCC0','#6E9A8A',120)+`<path d="M90 0H170V120H90Z" fill="#DDEFF2"/>`+Array.from({length:6},(_,i)=>`<path d="M${96+i*12} 0V120" stroke="#fff" stroke-width="3" opacity=".7" stroke-dasharray="12 10"><animate attributeName="stroke-dashoffset" values="0;-44" dur=".6s" repeatCount="indefinite"/></path>`).join('')+
   `<path d="M60 120Q130 104 200 120" stroke="#fff" stroke-width="2" fill="none"/><g transform="translate(130 100)"><g><animateTransform attributeName="transform" type="translate" values="0 20;0 -40;0 20" dur="2.4s" repeatCount="indefinite"/><g transform="rotate(90)">${evSp('swim',Math.min(50,evPx()))}</g></g></g>`}),
 flood:()=>({full:1,s:evBg('#A8987A','#8A7A5A',40)+Array.from({length:5},(_,i)=>`<path d="M-40 ${60+i*30}Q30 ${50+i*30} 100 ${60+i*30}T240 ${60+i*30}T380 ${60+i*30}" stroke="#C8B898" stroke-width="2" fill="none"><animateTransform attributeName="transform" type="translate" values="0 0;-80 0" dur="${1.2+i*.2}s" repeatCount="indefinite"/></path>`).join('')+
   `<g transform="translate(130 100)"><circle r="20" fill="#3E7A34"/><path d="M-20 0A20 20 0 0 1 20 0" fill="#C4301F" opacity=".4"/><g transform="translate(-6 -22)">${evSp('swim',38)}</g><animateTransform attributeName="transform" type="translate" values="130 100;140 96;130 100" dur="1.2s" repeatCount="indefinite"/></g>`}),
 /* overlays on the tank */
 net:()=>({s:`<g><animateTransform attributeName="transform" type="translate" values="0 -70;0 0;0 0;0 -70" keyTimes="0;.35;.7;1" dur="2.4s" repeatCount="indefinite"/><path d="M150 -20L150 70" stroke="#6A5034" stroke-width="5"/><ellipse cx="150" cy="96" rx="34" ry="10" fill="none" stroke="#2E7A4A" stroke-width="3"/><path d="M116 96Q150 150 184 96" fill="#2E7A4A" opacity=".25" stroke="#2E7A4A"/></g>`}),
 cat:()=>({s:`<g><animateTransform attributeName="transform" type="translate" values="0 0;0 18;0 0" dur="1.3s" repeatCount="indefinite"/><ellipse cx="190" cy="34" rx="34" ry="24" fill="#E8A64A"/><path d="M164 22L170 0L182 16ZM212 16L222 0L218 24Z" fill="#E8A64A"/><circle cx="180" cy="32" r="3" fill="#2A2A2A"/><circle cx="200" cy="32" r="3" fill="#2A2A2A"/><path d="M186 42q4 4 8 0" stroke="#2A2A2A" fill="none"/><path d="M150 52Q140 80 150 104" stroke="#E8A64A" stroke-width="14" stroke-linecap="round" fill="none"/></g>`}),
 feed:()=>({s:`<path d="M110 14q20 -10 40 0l-6 20h-28z" fill="#E86A4A"/>`+Array.from({length:10},(_,i)=>`<circle cx="${112+(i*7)%40}" cy="40" r="1.8" fill="#C98A3A"><animate attributeName="cy" values="40;${120+(i%4)*12}" dur="${1.6+i*.15}s" begin="${-i*.2}s" repeatCount="indefinite"/></circle>`).join('')}),
 water:()=>({s:`<g transform="translate(206 4) rotate(30)"><path d="M-18 0H18L14 34H-14Z" fill="#7FA0B8" stroke="#4A6478" stroke-width="2"/></g><path d="M196 34Q190 70 186 120" stroke="#CFEAF4" stroke-width="7" fill="none" opacity=".85" stroke-dasharray="10 6"><animate attributeName="stroke-dashoffset" values="0;-32" dur=".5s" repeatCount="indefinite"/></path>`}),
 dark:()=>({s:`<rect width="260" height="200" fill="#0E1424" opacity=".62"/><circle cx="220" cy="30" r="12" fill="#F4E8B0" opacity=".8"/>`+Array.from({length:4},(_,i)=>`<circle cx="${40+i*50}" cy="${20+(i%2)*14}" r="1.2" fill="#fff"><animate attributeName="opacity" values=".2;1;.2" dur="${1.5+i*.4}s" repeatCount="indefinite"/></circle>`).join('')}),
 hand:()=>({s:`<g><animateTransform attributeName="transform" type="translate" values="0 -30;0 10;0 -30" dur="2.2s" repeatCount="indefinite"/><path d="M168 0V50q0 10 -8 10h-6q-8 0 -8 -10V0" fill="#F2C9A4" stroke="#C99A74" stroke-width="1.5"/><path d="M146 30v22" stroke="#C99A74"/></g>`}),
 camera:()=>({s:`<g transform="translate(206 24)"><rect x="-26" y="-14" width="52" height="34" rx="6" fill="#2E3438"/><circle r="9" cy="3" fill="#5A6A7A" stroke="#9AA4AA" stroke-width="2"/></g><rect width="260" height="200" fill="#FFFFFF" opacity="0"><animate attributeName="opacity" values="0;0;.75;0" keyTimes="0;.8;.85;1" dur="1.8s" repeatCount="indefinite"/></rect>`}),
 sick:()=>({s:`<g fill="#F4F4EE" opacity=".85">`+Array.from({length:12},(_,i)=>`<circle cx="${70+(i*31)%120}" cy="${70+(i*17)%70}" r="${1.2+(i%3)*.5}"><animate attributeName="opacity" values=".3;1;.3" dur="${1.4+i*.1}s" repeatCount="indefinite"/></circle>`).join('')+`</g><text x="230" y="30" font-size="22" text-anchor="middle">🤒</text>`}),
 hot:()=>({s:`<circle cx="226" cy="28" r="18" fill="#F4C24A"><animate attributeName="r" values="16;20;16" dur="1.6s" repeatCount="indefinite"/></circle>`+Array.from({length:4},(_,i)=>`<path d="M${50+i*44} 180q6 -10 0 -20q-6 -10 0 -20" stroke="#F49A6A" stroke-width="2" fill="none" opacity=".6"><animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="${1.4+i*.2}s" repeatCount="indefinite"/></path>`).join('')}),
 cold:()=>({s:`<rect width="260" height="200" fill="#DDEFF8" opacity=".28"/>`+Array.from({length:14},(_,i)=>`<text x="${(i*41)%250+5}" y="0" font-size="${8+(i%3)*3}" fill="#fff">❄<animate attributeName="y" values="-10;210" dur="${4+i*.4}s" begin="${-i*.5}s" repeatCount="indefinite"/></text>`).join('')}),
 fight:()=>({s:`<g font-size="18" font-family="Jua,sans-serif" fill="#C9584B"><text x="70" y="70">!</text><text x="180" y="90">!!</text></g><g stroke="#C9584B" stroke-width="2"><path d="M110 80l14 -10M118 96l16 2M108 110l12 10"><animate attributeName="opacity" values="1;0;1" dur=".5s" repeatCount="indefinite"/></path></g>`}),
 star:()=>({s:evStars(9,'#F2C84A')}),
 heart:()=>({s:Array.from({length:6},(_,i)=>`<text x="${40+i*36}" y="170" font-size="${12+(i%3)*4}" fill="#E8789A">♥<animate attributeName="y" values="180;40" dur="${2.4+i*.3}s" begin="${-i*.4}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="${2.4+i*.3}s" begin="${-i*.4}s" repeatCount="indefinite"/></text>`).join('')}),
 train:()=>({s:Array.from({length:5},(_,i)=>`<path d="M${220-i*6} ${70+i*14}h-40" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;-60 0" dur=".7s" begin="${-i*.12}s" repeatCount="indefinite"/></path>`).join('')}),
 bubble:()=>({s:Array.from({length:8},(_,i)=>`<circle cx="${60+i*20}" cy="180" r="${2+(i%3)}" fill="none" stroke="#fff" stroke-width="1"><animate attributeName="cy" values="180;60" dur="${2+i*.3}s" begin="${-i*.3}s" repeatCount="indefinite"/></circle>`).join('')})
};
/* what to show for a line (first match wins; scenes that only make sense in a tank are skipped elsewhere) */
const EVFX=[
 [/마룻바닥|바닥에서 몸을 (튕|퍼덕)|수조 밖 바닥|바닥으로 떨어졌|수건 위로 떨어|바닥에서 퍼덕|욕조 바닥에서/,'floor'],
 [/수면 위로 (몸을 날|뛰어)|뛰어올랐|뛰어오릅|점프|뚜껑을 (머리로 )?밀어/,'leap'],
 [/왜가리/,'heron'],[/수달/,'otter'],[/낚싯|낚시꾼|바늘|미끼|루어/,'angler'],[/폭포/,'waterfall'],[/장마|홍수|불어난|떠내려/,'flood'],
 [/택배|상자|스티로폼/,'box'],
 [/뜰채|그물/,'net'],[/고양이|「대장」/,'cat'],
 [/정전|불 꺼진|불이 꺼|한밤중|새벽/,'dark'],
 [/물갈이|물을 (갈|반|채|조금씩)|양동이|수돗물/,'water'],
 [/먹이|사료|과식|간식/,'feed'],
 [/손가락|손바닥|손으로|손을 넣/,'hand'],
 [/사진|카메라|영상|촬영|방송|휴대폰/,'camera'],
 [/병이|하얀 점|곰팡이|기생충|백점|지느러미가 녹|아가미가 (붉|부)/,'sick'],
 [/여름|더위|뜨거|과열|폭염/,'hot'],[/겨울|얼음|추위|차가운|살얼음/,'cold'],
 [/물렸|쪼아|싸움|공격|들이받|결투|박치기/,'fight'],
 [/♥|인연|웃었|좋아/,'heart'],
 [/★|고비 통과|우승|🏆|스킬 발동|수련의 성과|이겼/,'star'],
 [/훈련|헤엄쳤|왕복|거슬러/,'train'],
 [/숨|산소|기포|뻐끔/,'bubble']
];
let EV_CUR=null;
/* overlays that need a home tank: not in a river, a net, a box or a shop line */
const EV_HOME=['water','hand','camera','cat','feed','sick','dark'];
const evHome=()=>S&&S.f&&!S.wild&&['tank','pond'].includes(S.env);
function evSet(text){
  const m=text?EVFX.find(([r,k])=>r.test(text)&&(!EV_HOME.includes(k)||evHome())):null,k=m?m[1]:null;
  if(k===EV_CUR)return;EV_CUR=k;
  if(S&&S.f&&!skipping&&typeof drawStage==='function'){stageKey='';drawStage(true)}
}
(()=>{const _f=fishStageSvg;fishStageSvg=function(){
  /* the death scene comes with the first line of the ending */
  let s;if(S&&!S.done&&S.ending&&S.fx){S.done=true;try{s=_f()}finally{S.done=false}}else s=_f();
  if(EV_CUR&&EVSCN[EV_CUR]&&!S.done){const o=EVSCN[EV_CUR]();
    const scene=o.full?`<g class="evscene">${o.s}</g>`:`<g class="evover">${o.s}</g>`;s=s.replace(/<\/svg>\s*$/,scene+'</svg>')}
  return s}})();
(()=>{const _e=endLife;endLife=function(lines,cat,fact,pl,calm,fx,pred){if(S&&!skipping){S.fx=fx||(calm?'ghost':'sickdead');S.pred=pred||null;S.calm=!!calm}return _e.apply(this,arguments)}})();
