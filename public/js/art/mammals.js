/* ---------- furry templates: dog, cat, small mammals, exotics ----------
   Each returns {s: svg, a: anchors}. Local space: ground at y≈34, head near y≈-18.
   Anchors tell the gag layer where the head, eyes, a front leg and the torso are. */
const toes=(x,y,c)=>`<path d="M${pN(x-1.8)} ${pN(y+1.6)}v-1.5M${pN(x)} ${pN(y+2)}v-1.7M${pN(x+1.8)} ${pN(y+1.6)}v-1.5" stroke="${c}" stroke-width=".6" stroke-linecap="round" opacity=".7"/>`;
const curls=(cx,cy,rx,ry,k,c,s)=>{Pt.srand(cx+cy*3+k+(s||0));let d='';for(let i=0;i<k;i++){const a=Pt.rnd()*Math.PI*2,q=Math.sqrt(Pt.rnd())*.9,x=cx+Math.cos(a)*rx*q,y=cy+Math.sin(a)*ry*q,r=1.1+Pt.rnd()*.9;d+=`M${pN(x-r)} ${pN(y)}a${pN(r)} ${pN(r)} 0 1 1 ${pN(r*1.4)} ${pN(r*.8)}`}return `<path d="${d}" stroke="${c}" stroke-width=".7" fill="none" stroke-linecap="round" opacity=".55"/>`};
const whisk=(x,y,side,c,len,cls)=>{let d='';[[-2.2,-1],[0,.4],[2,2.2]].forEach(([dy,dy2])=>{d+=`M${pN(x)} ${pN(y+dy*.5)}Q${pN(x+side*len*.5)} ${pN(y+dy-1)} ${pN(x+side*len)} ${pN(y+dy*1.4+dy2)}`});return pA(cls||'a-whisk',x,y,`<path d="${d}" stroke="${c}" stroke-width=".55" fill="none" stroke-linecap="round" opacity=".9"/>`,side>0?';animation-direction:reverse':'')};
const happyTail=m=>m==='happy'?'a-wagfast':m==='sad'||m==='sick'||m==='dead'||m==='peace'?'':'a-wag';

DRAW.dog=(L,m,o)=>{
  const c=L.c,ec=L.ec,ch=L.chest,mz=L.muz,coat=L.coat;
  const fl=coat==='fluffy'?4.5:coat==='long'?4:coat==='curly'?2.2:2;
  const big=L.ear==='long'||coat==='fluffy'?4.2:3.8;
  let s='';
  /* tail */
  let tl='';
  if(L.tail==='curl') tl=pF(pT([[11,20],[19,12],[23,2],[19,-6],[12,-6],[10,0]],7,4),c)+pS(17,4,6,7,10,pDk(c,.3),{radial:true,len:2.6});
  else if(L.tail==='plume') tl=pF(pB(19,4,8,13,{rot:30,fur:[[0,360,3.5,22]]}),c)+pS(19,4,6,10,14,pDk(c,.25),{ang:-60,len:3});
  else if(L.tail==='pom') tl=pF(pT([[11,22],[17,14],[20,9]],5,3.5),c)+pF(pB(21,5,5.8,5.8,{fur:[[0,360,1.6,14]]}),c)+curls(21,5,4.5,4.5,6,pDk(c,.4));
  else tl=pF(pT([[11,24],[19,18],[25,8],[27,-2]],6.5,2.2),c,{lw:1});
  s+=pA(L.tail==='curl'?'a-wagsmall':happyTail(m),11,23,tl);
  /* haunches, body, chest */
  [-1,1].forEach(k=>{s+=pF(pB(k*thin(13),22,thin(11),11,{fur:[k<0?[120,240,fl*.6,4]:[300,60,fl*.6,4]]}),c)});
  s+=pF(pB(0,9,thin(15.5),20,{fur:[[330,30,fl,3],[150,210,fl,3]]}),c);
  s+=pF(pB(0,6,thin(9.5),15,{fur:[[20,160,coat==='short'?2.6:4,12]]}),ch,{line:false,bleed:false});
  s+=pS(0,6,thin(7),12,coat==='short'?10:18,pDk(ch,.25),{ang:90,len:coat==='short'?2.4:4,op:.35});
  if(coat==='curly') s+=curls(0,12,thin(13),16,30,pDk(c,.45));
  if(coat==='long') s+=pS(0,14,thin(14),16,26,pDk(c,.14),{ang:90,len:6,op:.5,spread:.4});
  s+=pF(pB(0,-2,thin(11),4.4),pDk(c,.55),{line:false,bleed:false,op:.22})+pF(pB(0,24,3,7),pDk(c,.6),{line:false,bleed:false,op:.25});
  /* legs */
  [-1,1].forEach(k=>{
    s+=pF(pT([[k*6.6,8],[k*6.8,20],[k*7,30]],thin(8.6),thin(7.4)),c,{lw:1});
    s+=pF(pB(k*19,32.6,6.2,3.4),c,{lw:.9})+toes(k*19,32.4,pDk(c,.6));
    s+=pF(pB(k*7.3,31.6,5.5,3.5),L.tail==='wag'?ch:c,{lw:.9})+toes(k*7.3,31.4,pDk(c,.6));
  });
  /* head */
  let h='';
  const earBack=L.ear==='prick'||L.ear==='small';
  if(earBack){
    const sm=L.ear==='small'?.9:L.ear==='prick'?.86:1;
    [-1,1].forEach(k=>{
      const e=pF(Pt.path([[k*16,-24],[k*16.5*sm-k*1,-35*sm-3],[k*13.5*sm,-45.5*sm-1,1],[k*8,-36],[k*5,-30]]),c)+pF(Pt.path([[k*14,-27],[k*14.2*sm,-35*sm-2],[k*12.6*sm,-41*sm-1,1],[k*9,-34],[k*7.5,-30]]),'#E7B3A5',{line:false,bleed:false})+pS(k*11.5,-33,2.2,4,5,pLt(c,.6),{ang:-90,len:3,op:.8});
      h+=pA(k<0?'a-earL':'a-earR',k*11,-27,e);
    });
  }
  if(L.ruff) h+=pF(pB(0,-9,23,17,{np:22,fur:[[-20,200,4.6,40]],sweep:.08}),pLt(c,.12))+pS(0,-6,20,13,34,pDk(c,.2),{radial:true,len:4,op:.4});
  h+=pF(pB(0,-18,18.5-TH*1.6,16,{np:18,fur:[[15,70,fl+.6,6],[110,165,fl+.6,6]]}),c);
  h+=pS(0,-22,14,9,26,pDk(c,.28),{radial:true,len:2.4,op:.35});
  if(L.ear==='flop') h+=pF(pB(0,-25,3.6,8.5),ch,{line:false,bleed:false,op:.85});
  if(L.ear==='curly'){[[-6,-34],[0,-36.5],[6,-34],[-3,-31],[3,-31]].forEach(p=>{h+=pF(pB(p[0],p[1],5.8,5.4,{fur:[[0,360,1.2,10]]}),c,{lw:.9})});h+=curls(0,-33,9,5,10,pDk(c,.4))}
  if(L.bow) h+=`<g transform="translate(6 -33) rotate(18)">`+pF('M0 0L-7 -4L-7 4Z',L.bow,{lw:.8})+pF('M0 0L7 -4L7 4Z',L.bow,{lw:.8})+pF(pB(0,0,2,2),Pt.dk(L.bow,.15),{lw:.7})+`</g>`;
  h+=pF(pB(0,L.ear==='prick'?-9.8:-10.4,L.ear==='prick'?10.4:9.6,L.ear==='prick'?8:7.2),mz,{lw:.9,lo:.45});
  h+=pS(0,-10,7.5,5,12,pDk(mz,.3),{radial:true,len:1.8,op:.3});
  const er=L.ear==='long'||L.ruff?4.1:3.8;
  h+=pFace({m,eyes:[[-7.4,-20],[7.4,-20]],r:er,iris:L.iris,pupil:'round',lid:c,cheeks:[[-11,-12],[11,-12]],mouth:[0,-8.4],ms:.95,kind:'dog',pant:m==='happy'||o.gag==='hot',delay:.3});
  h+=`<path d="M-3.9 -15.2Q0 -17.2 3.9 -15.2Q3.3 -11.6 0 -11Q-3.3 -11.6 -3.9 -15.2Z" fill="${Pt.rg(L.nose,{hi:.25})}"/><ellipse cx="-1.2" cy="-15.1" rx="1.4" ry=".7" fill="#fff" opacity=".6"/><path d="M0 -11v2.4" stroke="#3A2018" stroke-width=".9"/>`;
  if(L.ear==='flop') [-1,1].forEach(k=>{h+=pA(k<0?'a-flopL':'a-flopR',k*13,-30,pF(Pt.path([[k*12,-31],[k*19.5,-31],[k*24.5,-20],[k*23.5,-9],[k*19,-5.5],[k*15,-12],[k*12.5,-22]]),ec)+pS(k*19,-18,3.5,8,7,pDk(ec,.3),{ang:90,len:3,op:.4}))});
  if(L.ear==='long') [-1,1].forEach(k=>{h+=pA(k<0?'a-flopL':'a-flopR',k*13,-28,pF(pB(k*17.5,-12,7,17,{rot:k*-8,fur:[[20,160,4,10]]}),ec)+pS(k*17.5,-10,5,14,14,pDk(ec,.18),{ang:90,len:6,op:.55,spread:.3}))});
  if(L.ear==='curly') [-1,1].forEach(k=>{let e='';[[-19,-17],[-21.5,-9],[-19.5,-1.5],[-16,-11]].forEach(p=>{e+=pF(pB(-k*p[0],p[1],5.2,5,{fur:[[0,360,1.1,10]]}),ec,{lw:.9})});h+=pA(k<0?'a-flopL':'a-flopR',k*14,-24,e+curls(k*19.5,-9,4,9,8,pDk(ec,.4)))});
  s+=pA('a-tilt',0,-6,h);
  return {s,a:{head:[0,-18],hr:18,eyes:[[-7.4,-20],[7.4,-20]],er,nose:[0,-13.5],mouth:[0,-8.4],top:earBack?-44:-34,leg:[-6.8,22],body:[0,10],bw:15,bh:15,feet:34,ear:[-15,-28]}};
};

DRAW.cat=(L,m,o)=>{
  const c=L.c,ch=L.chest,mz=L.muz,sp=L.stripe;
  let s='';
  /* tail behind */
  let tl=pF(pT([[11,27],[21,23],[27,12],[27.5,-2],[24,-11],[19.5,-10.5]],7,4.6),c,{lw:1});
  if(sp) tl+=`<path d="M22 20.5l4.5 3M26 13l4 1.5M27 4.5l4 .3M26.5 -4l3.8 -1.2" stroke="${sp}" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>`;
  s+=pA(m==='happy'?'a-swishfast':'a-swish',11,26,tl);
  [-1,1].forEach(k=>{s+=pF(pB(k*thin(12.5),23,thin(10.4),10.4,{fur:[k<0?[120,240,1.6,4]:[300,60,1.6,4]]}),c)});
  s+=pF(pB(0,10,thin(14.4),19),c);
  if(sp) [-1,1].forEach(k=>{s+=`<path d="M${k*thin(13)} 2q${-k*4} 1 ${-k*5.5} 4M${k*thin(14)} 10q${-k*4} 1 ${-k*5} 4M${k*thin(13)} 18q${-k*3} 1 ${-k*4} 3.6" stroke="${sp}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".7"/>`});
  s+=pF(pB(0,7,thin(9),15,{fur:[[30,150,4.6,12]],sweep:.05}),ch,{line:false,bleed:false});
  s+=pS(0,8,thin(7),12,16,pDk(ch,.2),{ang:90,len:3.6,op:.4});
  if(L.sheen) s+=pS(0,10,thin(12),17,30,'#D6DEE6',{ang:80,len:3,op:.5,w:.7});
  s+=pF(pB(0,-1,thin(10),4),pDk(c,.55),{line:false,bleed:false,op:.22})+pF(pB(0,25,2.6,6.4),pDk(c,.6),{line:false,bleed:false,op:.25});
  [-1,1].forEach(k=>{
    s+=pF(pT([[k*5.8,9],[k*6,20],[k*6.2,30.5]],thin(7.2),thin(6.2)),c,{lw:1});
    if(sp) s+=`<path d="M${k*5.8-3} 17h6M${k*6-3} 22.5h6" stroke="${sp}" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>`;
    s+=pF(pB(k*16.8,32.8,5.4,3),c,{lw:.9});
    s+=pF(pB(k*6.3,31.8,4.9,3.2),c,{lw:.9})+toes(k*6.3,31.6,pDk(c,.6));
  });
  /* head */
  let h='';
  [-1,1].forEach(k=>{
    let e;
    if(L.ear==='fold') e=pF(Pt.path([[k*16,-25],[k*16.5,-31.5],[k*12,-34.5],[k*6,-31.5],[k*8,-28]]),c)+`<path d="M${k*15} -29.5Q${k*11} -31.5 ${k*7.6} -29.6" stroke="${pDk(c,.45)}" stroke-width=".9" fill="none" opacity=".7"/>`;
    else e=pF(Pt.path([[k*17.5,-22],[k*18.6,-34],[k*15.6,-43.5,1],[k*9,-35],[k*5,-30]]),c)+pF(Pt.path([[k*15.4,-25],[k*16,-34],[k*14.8,-40,1],[k*10.4,-33.2],[k*8,-30]]),'#EFA9A8',{line:false,bleed:false})+pS(k*12.8,-31,2.4,4,6,'#FFF6EC',{ang:-100+k*20,len:3.4,op:.85,w:.6});
    h+=pA(k<0?'a-earL':'a-earR',k*11,-27,e);
  });
  const rx=L.round?20.5:19.5, ry=L.round?17:16;
  h+=pF(pB(0,-17,rx-TH*1.6,ry,{np:18,fur:[[10,62,4.2,7],[118,170,4.2,7]],sweep:.06}),c);
  h+=pS(0,-22,15,9,22,pDk(c,.25),{radial:true,len:2.2,op:.3});
  if(sp) h+=`<path d="M-5.6 -30.5l1.3 5.6M-1.8 -31.4l.5 6.2M1.8 -31.4l-.5 6.2M5.6 -30.5l-1.3 5.6M-19 -16.5q5 .6 8 -1.4M-19 -12.2q5 .8 7.6 -.6M19 -16.5q-5 .6 -8 -1.4M19 -12.2q-5 .8 -7.6 -.6" stroke="${sp}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".75"/>`;
  if(L.sheen) h+=pS(0,-18,16,12,30,'#D6DEE6',{radial:true,len:2.2,op:.55,w:.6});
  h+=pF(pB(-3.5,-10.2,4.5,3.4),mz,{line:false,bleed:false})+pF(pB(3.5,-10.2,4.5,3.4),mz,{line:false,bleed:false})+pF(pB(0,-6.8,3.6,2.2),mz,{line:false,bleed:false});
  const er=L.round?5:4.6;
  h+=pFace({m,eyes:[[-7.7,-18.3],[7.7,-18.3]],r:er,iris:L.iris,pupil:'slit',lid:c,cheeks:[[-12,-11],[12,-11]],mouth:[0,-10.4],ms:.85,kind:'cat',browUp:1.7,delay:1.1});
  h+=`<path d="M-2.5 -14.4Q0 -15.4 2.5 -14.4Q1.3 -12.1 0 -11.6Q-1.3 -12.1 -2.5 -14.4Z" fill="${L.nose}" stroke="${pDk(L.nose,.4)}" stroke-width=".6"/>`;
  const wc=c==='#8D9AA8'||Pt.grey(c,1)<'#999'?'#F1F0EC':'#F7F1E6';
  h+=whisk(-6,-10.6,-1,wc,21)+whisk(6,-10.6,1,wc,21);
  s+=pA('a-tilt',0,-4,h);
  return {s,a:{head:[0,-17],hr:19,eyes:[[-7.7,-18.3],[7.7,-18.3]],er,nose:[0,-13.4],mouth:[0,-10.4],top:L.ear==='fold'?-34:-43,leg:[-6,22],body:[0,10],bw:14,bh:15,feet:34,ear:[-15,-28]}};
};

DRAW.hamster=(L,m)=>{
  const c=L.c,b=L.belly;let s='';
  [-1,1].forEach(k=>{s+=pA(k<0?'a-earL':'a-earR',k*12.5,-11,pF(pB(k*12.6,-14.5,5.8,5.4),c)+pF(pB(k*12.6,-14,3.4,3.2),L.ear,{line:false,bleed:false}))});
  s+=pF(pB(0,12,thin(21.5),22.5,{np:20,fur:[[0,360,2,26]]}),c);
  s+=pS(0,2,17,14,30,pDk(c,.25),{radial:true,len:2.2,op:.35});
  if(L.stripe) s+=pF(pT([[0,-10],[0,-7],[0,-5]],3,1),L.stripe,{line:false,op:.55});
  s+=pF(pB(0,18,thin(14.5),15,{fur:[[0,180,2,12]]}),b,{line:false,bleed:false});
  [-1,1].forEach(k=>{s+=pA('a-chew',k*10.6,2,pF(pB(k*10.6,2,9.8,7.8,{fur:[k<0?[100,220,1.8,6]:[320,80,1.8,6]]}),b,{lw:.8,lo:.35}))});
  s+=pFace({m,eyes:[[-7.4,-4],[7.4,-4]],r:3.2,pupil:'bead',lid:c,cheeks:[[-11,2],[11,2]],mouth:[0,4.2],ms:.9,kind:'rodent',browC:'#3A2A22',delay:2});
  s+=pF(pB(0,1.4,1.9,1.3),'#E99AA0',{lw:.6})+whisk(-3,2,-1,pDk(c,.5),11)+whisk(3,2,1,pDk(c,.5),11);
  if(m!=='dead') s+=`<path d="M-1.3 12.2Q0 7.4 1.3 12.2Q1.6 16.2 0 17Q-1.6 16.2 -1.3 12.2Z" fill="#2E2A26"/><path d="M-.5 9.8L-.4 16.4M.5 9.8L.4 16.4" stroke="#E9E4DC" stroke-width=".5"/>`;
  [-1,1].forEach(k=>{s+=pF(pB(k*3.2,12.8,2.6,2),'#F1B3AE',{lw:.6});s+=pF(pB(k*9.2,33.2,4.8,2.4),'#F1B3AE',{lw:.7})+toes(k*9.2,33,'#B57670')});
  return {s,a:{head:[0,-4],hr:16,eyes:[[-7.4,-4],[7.4,-4]],er:3.2,nose:[0,1.4],mouth:[0,4.2],top:-20,leg:[-9,30],body:[0,15],bw:17,bh:14,feet:34,ear:[-12.6,-14]}};
};

DRAW.guinea=(L,m)=>{
  const c=L.c,b=L.belly;let s='';
  s+=pF(pB(0,15,thin(27),17,{np:20,fur:[[0,360,2.6,30]]}),c);
  s+=pF(pB(-11,15,thin(9),15.5,{fur:[[60,300,2.4,10]]}),b,{line:false,bleed:false});
  s+=pS(0,10,24,12,40,pDk(c,.25),{ang:30,len:3,op:.35});
  [-1,1].forEach(k=>{s+=pF(pB(k*10,31.2,4,2),'#E9B2A6',{lw:.6})+pF(pB(k*19,30.4,4,2),'#E9B2A6',{lw:.6})});
  let h=pF(pB(0,3,16.5,14,{fur:[[0,180,2,12]]}),c);
  h+=pF(pB(-8,1,6.5,6.5,{j:.08}),L.dark,{line:false,op:.85});
  h+=pF(pB(0,4.5,5,12.5),b,{line:false,bleed:false});
  [-1,1].forEach(k=>{h+=pA(k<0?'a-earL':'a-earR',k*13,-5,pF(Pt.path([[k*12,-5],[k*18,-9],[k*21.5,-4],[k*17,-.5]]),pDk(c,.2),{lw:.8}))});
  h+=pFace({m,eyes:[[-8.3,0],[8.3,0]],r:3.2,pupil:'bead',lid:m==='dead'?c:c,cheeks:[[-10,7],[10,7]],mouth:[0,11.4],ms:.9,kind:'rodent',delay:3});
  h+=pF(pB(0,8.4,2.4,1.5),'#C98A86',{lw:.6})+whisk(-3,9,-1,pDk(c,.5),11)+whisk(3,9,1,pDk(c,.5),11);
  s+=pA('a-nod',0,10,h);
  return {s,a:{head:[0,3],hr:15,eyes:[[-8.3,0],[8.3,0]],er:3.2,nose:[0,8.4],mouth:[0,11.4],top:-11,leg:[-10,28],body:[0,16],bw:22,bh:10,feet:32,ear:[-17,-4]}};
};

DRAW.mouse=(L,m)=>{
  const c=L.c;let s='';
  s+=pA('a-swish',9,28,pF(pT([[9,29],[20,33],[31,29],[34,19],[30,12]],2.6,.8),L.tail,{lw:.6}));
  [-1,1].forEach(k=>{s+=pA(k<0?'a-earL':'a-earR',k*10,-10,pF(pB(k*11.5,-16,8.6,8.2),c)+pF(pB(k*11.5,-15.6,6,5.8),L.ear,{line:false,bleed:false,op:.85}))});
  s+=pF(pB(0,16,thin(14.5),17,{fur:[[0,360,1.6,18]]}),c);
  s+=pF(pB(0,19,thin(9),11),pLt(c,.5),{line:false,bleed:false});
  s+=pF(pB(0,-4,12.6,11.5,{fur:[[20,160,1.8,10]]}),c)+pF(pB(0,1.6,6.6,5.2),c,{lw:.8});
  s+=pFace({m,eyes:[[-5.6,-5.6],[5.6,-5.6]],r:2.7,iris:L.iris,pupil:'round',lid:c,cheeks:[[-8,0],[8,0]],mouth:[0,6.2],ms:.8,kind:'rodent',delay:1.7});
  s+=pF(pB(0,3.8,1.7,1.3),'#F09AA6',{lw:.5})+whisk(-2.6,4,-1,'#B9B2AA',12)+whisk(2.6,4,1,'#B9B2AA',12);
  [-1,1].forEach(k=>{s+=pF(pB(k*3.6,13,2.2,1.8),'#F4B6BE',{lw:.5})+pF(pB(k*8,33,4.2,2.1),'#F4B6BE',{lw:.6})});
  return {s,a:{head:[0,-3],hr:12,eyes:[[-5.6,-5.6],[5.6,-5.6]],er:2.7,nose:[0,3.8],mouth:[0,6.2],top:-24,leg:[-8,30],body:[0,17],bw:13,bh:13,feet:34,ear:[-11.5,-16]}};
};

DRAW.rabbit=(L,m)=>{
  const c=L.c;let s='';
  const droop=m==='sad'||m==='sick'||m==='dead';
  [-1,1].forEach(k=>{
    const e=pF(pB(k*6.6,-36,5.8,16.5,{rot:k*-9}),c)+pF(pB(k*6.6,-35,3,12.5,{rot:k*-9}),L.ear,{line:false,bleed:false})+pS(k*6.6,-36,3.5,12,8,pDk(c,.15),{ang:90,len:3,op:.35});
    s+=droop?`<g transform="rotate(${k*55} ${k*5} -21)">${e}</g>`:pA(k<0?'a-earL':'a-earR2',k*6,-21,e);
  });
  s+=pF(pB(0,14,thin(18),19.5,{np:18,fur:[[0,360,2.2,20]]}),c);
  s+=pF(pB(0,16.5,thin(11),13.5),pLt(c,.6),{line:false,bleed:false});
  [-1,1].forEach(k=>{s+=pF(pB(k*12.5,32.4,8.2,3.6),c,{lw:.9})+toes(k*16,32.2,pDk(c,.5));s+=pF(pB(k*5,30.6,3.8,3),c,{lw:.9})});
  let h=pF(pB(0,-10,15.6,13.6,{fur:[[20,160,3,14]]}),c);
  h+=pS(0,-12,12,9,20,pDk(c,.14),{radial:true,len:2.2,op:.4});
  h+=pFace({m,eyes:[[-8,-12],[8,-12]],r:4,iris:L.iris,pupil:'round',lid:c,cheeks:[[-10,-5],[10,-5]],mouth:[0,-3.4],ms:.9,kind:'rodent',delay:.6});
  h+=pA('a-nose',0,-6,`<path d="M-2.2 -7.2Q0 -8.2 2.2 -7.2Q1.2 -5 0 -4.8Q-1.2 -5 -2.2 -7.2Z" fill="#E98A98"/>`)+whisk(-3,-5,-1,pDk(c,.35),13)+whisk(3,-5,1,pDk(c,.35),13);
  s+=h;
  return {s,a:{head:[0,-10],hr:15,eyes:[[-8,-12],[8,-12]],er:4,nose:[0,-6.4],mouth:[0,-3.4],top:-52,leg:[-5,26],body:[0,15],bw:16,bh:15,feet:34,ear:[-7,-36]}};
};

DRAW.hedgehog=(L,m)=>{
  const c=L.c,sp=L.spine;let s='';
  s+=pF(pB(0,8,thin(28),24,{np:26,fur:[[175,365,6,52]]}),sp,{lc:'#2E2018'});
  Pt.srand(77);let d='',d2='';
  for(let i=0;i<80;i++){const a=Math.PI*(1.04+(i/80)*.92+(Pt.rnd()-.5)*.03),r0=.42+(i%4)*.13,r1=r0+.26+Pt.rnd()*.1;const x0=Math.cos(a)*thin(28)*r0,y0=8+Math.sin(a)*24*r0,x1=Math.cos(a)*thin(28)*Math.min(1.12,r1),y1=8+Math.sin(a)*24*Math.min(1.12,r1);d+=`M${pN(x0)} ${pN(y0)}L${pN(x1)} ${pN(y1)}`;d2+=`M${pN(x0+(x1-x0)*.7)} ${pN(y0+(y1-y0)*.7)}L${pN(x1)} ${pN(y1)}`}
  s+=pA('a-puff',0,20,`<path d="${d}" stroke="#2E2018" stroke-width="1.1" stroke-linecap="round" opacity=".8"/><path d="${d2}" stroke="#EFE3D0" stroke-width=".9" stroke-linecap="round" opacity=".8"/>`);
  [-1,1].forEach(k=>{s+=pF(pB(k*9,31.5,4.2,2.2),'#C9A08A',{lw:.6})+pF(pB(k*18,29.5,4,2.2),'#C9A08A',{lw:.6})});
  [-1,1].forEach(k=>{s+=pF(pB(k*12.5,2.5,3.6,3.4),c)+pF(pB(k*12.5,2.8,2,2),'#E8B3A6',{line:false,bleed:false})});
  s+=pF(pB(0,13,16,13.4,{fur:[[0,180,2,14]]}),c);
  s+=pFace({m,eyes:[[-6.6,9],[6.6,9]],r:2.6,pupil:'bead',lid:c,cheeks:[[-9,14],[9,14]],mouth:[0,22.4],ms:.75,kind:'rodent',delay:2.4});
  s+=pF(pB(0,17.6,6.8,5.2),pLt(c,.3),{lw:.8});
  s+=pA('a-sniff',0,18.6,`<ellipse cx="0" cy="18.6" rx="2.6" ry="2" fill="${Pt.rg('#2A1E18',{hi:.3})}"/><ellipse cx="-.8" cy="18" rx=".8" ry=".45" fill="#fff" opacity=".7"/>`);
  return {s,a:{head:[0,12],hr:14,eyes:[[-6.6,9],[6.6,9]],er:2.6,nose:[0,18.6],mouth:[0,22.4],top:-16,leg:[-9,29],body:[0,4],bw:22,bh:12,feet:33,ear:[-12.5,2.5]}};
};

DRAW.ferret=(L,m)=>{
  const c=L.c,dkc=L.dark;let s='';
  s+=pA('a-swish',8,26,pF(pT([[8,27],[18,31],[28,27],[34,18]],7,3),dkc)+pS(22,27,8,4,10,'#2A1E16',{ang:0,len:3}));
  s+=pF(pB(0,14,thin(12),19.5,{fur:[[0,360,1.6,16]]}),c,{grad:Pt.lg([[0,c],[.45,c],[1,dkc]])});
  [-1,1].forEach(k=>{s+=pF(pB(k*8,31.6,5.2,3),dkc,{lw:.8})});
  [-1,1].forEach(k=>{s+=pF(pT([[k*7,0],[k*5.6,4],[k*4.6,7]],4,3.2),dkc,{lw:.7})});
  let h='';
  [-1,1].forEach(k=>{h+=pA(k<0?'a-earL':'a-earR',k*10,-20,pF(pB(k*10.4,-22.6,4.2,4),c)+pF(pB(k*10.4,-22.4,2.4,2.2),'#E2B3A8',{line:false,bleed:false}))});
  h+=pF(pB(0,-14,12.6,10.6,{fur:[[20,160,1.6,8]]}),c);
  h+=pF(pB(0,-15.4,11.4,4.2,{j:.1}),dkc,{line:false,op:.85});
  h+=pF(pB(0,-9.4,7.2,5.2),'#FBF6EC',{lw:.7,lo:.4});
  h+=pFace({m,eyes:[[-5.4,-15.6],[5.4,-15.6]],r:2.5,pupil:'bead',lid:dkc,cheeks:[[-8,-10],[8,-10]],mouth:[0,-6.2],ms:.75,kind:'rodent',delay:.9});
  h+=pF(pB(0,-10.6,1.8,1.3),'#E28A92',{lw:.5})+whisk(-3,-9,-1,'#F4EEE4',11)+whisk(3,-9,1,'#F4EEE4',11);
  s+=pA('a-look',0,-6,h);
  return {s,a:{head:[0,-14],hr:12,eyes:[[-5.4,-15.6],[5.4,-15.6]],er:2.5,nose:[0,-10.6],mouth:[0,-6.2],top:-27,leg:[-5,4],body:[0,14],bw:11,bh:15,feet:34,ear:[-10.4,-22.6]}};
};

DRAW.meerkat=(L,m)=>{
  const c=L.c,dkc=L.dark;let s='';
  s+=pF(pT([[5,28],[14,32],[24,34]],6,2.4),c)+pF(pB(23.5,33.6,2.4,1.6),dkc,{line:false});
  [-1,1].forEach(k=>{s+=pF(pB(k*6,31.8,4.8,2.8),pDk(c,.25),{lw:.8})});
  s+=pF(pB(0,9,thin(11.6),21,{fur:[[0,360,1.4,16]]}),c);
  s+=pF(pB(0,11,thin(6.6),15.5),pLt(c,.35),{line:false,bleed:false});
  s+=pS(0,8,9,18,24,pDk(c,.3),{ang:90,len:3,op:.35});
  [-1,1].forEach(k=>{s+=pF(pT([[k*7,-6],[k*7.4,0],[k*6.4,5]],3.6,3),c,{lw:.8})+pF(pB(k*6.2,5.6,2,1.6),dkc,{line:false})});
  s+=pF(pB(0,-14,7.6,8),c,{line:false});
  let h=pF(pB(0,-22,9.2,8.6,{fur:[[180,360,1.2,8]]}),c);
  h+=pF(Pt.path([[-5.4,-20],[-2,-16],[0,-14.4],[2,-16],[5.4,-20],[0,-18.5]]),pLt(c,.3),{lw:.7,lo:.4});
  [-1,1].forEach(k=>{h+=pF(pB(k*8.8,-23.4,2,2.4),dkc,{line:false});h+=pF(pB(k*4.5,-23.2,3.4,2.8,{rot:k*20}),dkc,{line:false})});
  h+=pFace({m,eyes:[[-4.5,-23.2],[4.5,-23.2]],r:1.9,iris:'#3A2A1E',pupil:'round',lid:dkc,cheeks:[[-6,-18],[6,-18]],mouth:[0,-13.2],ms:.55,kind:'rodent',delay:1.3});
  h+=pF(pB(0,-15,1.7,1.2),'#2A2018',{line:false});
  s+=pA('a-look',0,-14,h);
  return {s,a:{head:[0,-22],hr:9,eyes:[[-4.5,-23.2],[4.5,-23.2]],er:1.9,nose:[0,-15],mouth:[0,-13.2],top:-31,leg:[-7,0],body:[0,9],bw:11,bh:16,feet:34,ear:[-8.8,-23.4]}};
};

DRAW.raccoon=(L,m)=>{
  const c=L.c,dkc=L.dark,lc=L.light;let s='';
  let tl=pF(pB(20,4,7.4,16.5,{rot:25,fur:[[0,360,2.6,20]]}),c);
  tl+=`<g transform="rotate(25 20 4)"><path d="M13.4 -6h13.2M13 1h14M13.4 8h13.2M15 15h10" stroke="${dkc}" stroke-width="3" stroke-linecap="round" opacity=".85"/></g>`;
  s+=pA(happyTail(m)||'a-wagsmall',12,20,tl);
  [-1,1].forEach(k=>{s+=pF(pB(k*thin(13),23,thin(10),10,{fur:[k<0?[120,240,1.6,4]:[300,60,1.6,4]]}),c)});
  s+=pF(pB(0,10,thin(16),19.4,{fur:[[0,360,2,16]]}),c);
  s+=pF(pB(0,13,thin(9),12),pLt(c,.3),{line:false,bleed:false});
  [-1,1].forEach(k=>{s+=pF(pB(k*14,32.4,5.4,3),dkc,{lw:.8})});
  s+=pA('a-wash',0,8,pF(pB(-3.6,8,3.4,2.6),dkc,{lw:.7})+pF(pB(3.6,8.4,3.4,2.6),dkc,{lw:.7}));
  let h='';
  [-1,1].forEach(k=>{h+=pA(k<0?'a-earL':'a-earR',k*12,-26,pF(Pt.path([[k*17,-24],[k*16,-31],[k*12.5,-33.5],[k*8,-29],[k*8,-25]]),c)+pF(Pt.path([[k*15.4,-26],[k*14.8,-30.4],[k*12.4,-32],[k*9.6,-28.6]]),lc,{line:false,bleed:false}))});
  h+=pF(pB(0,-14,18.6,15,{fur:[[15,165,3.4,14]]}),c);
  h+=pF(pB(0,-11.4,14.4,10.4),lc,{line:false,bleed:false});
  h+=pF(Pt.path([[-17,-15],[-10,-20],[-3,-17.4],[0,-15.4],[3,-17.4],[10,-20],[17,-15],[11,-10.6],[3.6,-12.4],[0,-11],[-3.6,-12.4],[-11,-10.6]]),dkc,{line:false});
  h+=pF(pT([[0,-28],[0,-21],[0,-15]],4.4,2.2),dkc,{line:false,op:.75});
  h+=pF(pB(0,-6.8,6.8,5),lc,{lw:.7,lo:.4});
  h+=pFace({m,eyes:[[-7.2,-15.6],[7.2,-15.6]],r:2.8,pupil:'bead',lid:dkc,cheeks:[[-11,-8],[11,-8]],mouth:[0,-4.2],ms:.85,kind:'dog',browC:'#F4F0EA',browUp:2.4,delay:.5});
  h+=`<ellipse cx="0" cy="-8.4" rx="2.6" ry="1.8" fill="${Pt.rg('#1E1A18',{hi:.3})}"/>`+whisk(-4,-6.8,-1,'#F4F0EA',12)+whisk(4,-6.8,1,'#F4F0EA',12);
  s+=pA('a-tilt',0,-4,h);
  return {s,a:{head:[0,-14],hr:18,eyes:[[-7.2,-15.6],[7.2,-15.6]],er:2.8,nose:[0,-8.4],mouth:[0,-4.2],top:-33,leg:[-4,10],body:[0,12],bw:15,bh:15,feet:34,ear:[-12.5,-30]}};
};

DRAW.fennec=(L,m)=>{
  const c=L.c,inn=L.inner;let s='';
  s+=pA(happyTail(m)||'a-wagsmall',14,26,pF(pB(14,29.4,12.4,5.6,{rot:-8,fur:[[0,360,2.2,16]]}),c)+pF(pB(3.4,31.6,3.8,3.2),'#2E241C',{line:false}));
  [-1,1].forEach(k=>{s+=pF(pB(k*thin(12),23,thin(9.4),9.6,{fur:[k<0?[120,240,1.4,4]:[300,60,1.4,4]]}),c)});
  s+=pF(pB(0,11,thin(13.6),18.4),c);
  s+=pF(pB(0,8,thin(8),13.4,{fur:[[30,150,3,10]]}),inn,{line:false,bleed:false});
  [-1,1].forEach(k=>{s+=pF(pT([[k*5,9],[k*5.2,20],[k*5.4,30.6]],thin(5.6),thin(4.8)),c,{lw:.9})+pF(pB(k*5.6,31.8,4,2.8),c,{lw:.8})});
  let h='';
  [-1,1].forEach(k=>{
    const e=pF(Pt.path([[k*14.5,-19],[k*21,-36],[k*23.5,-54,1],[k*14,-38],[k*4,-25]]),c)+pF(Pt.path([[k*12.8,-22],[k*18.4,-36],[k*21,-48.5,1],[k*13.4,-37],[k*6.5,-25.4]]),'#F2C2B4',{line:false,bleed:false})+pS(k*14,-34,4,9,14,inn,{ang:-90+k*25,len:4,op:.95,w:.8});
    h+=pA(k<0?'a-earL':'a-earR2',k*10,-24,e);
  });
  h+=pF(pB(0,-13,13.6,11.6,{fur:[[25,155,2.4,10]]}),c);
  h+=pF(Pt.path([[-5.6,-12.4],[-2,-7],[0,-4.8],[2,-7],[5.6,-12.4],[0,-11]]),inn,{lw:.7,lo:.4});
  h+=pF(pB(-6,-15,5.4,4.4),inn,{line:false,bleed:false,op:.7})+pF(pB(6,-15,5.4,4.4),inn,{line:false,bleed:false,op:.7});
  h+=`<path d="M-8.6 -12.4q-1.6 3 -1 5.6M8.6 -12.4q1.6 3 1 5.6" stroke="#8A5A3A" stroke-width=".9" fill="none" opacity=".7"/>`;
  h+=pFace({m,eyes:[[-6,-14.6],[6,-14.6]],r:3.7,iris:'#4A2A18',pupil:'round',lid:c,cheeks:[[-9,-9],[9,-9]],mouth:[0,-3.4],ms:.7,kind:'dog',delay:2.2});
  h+=`<ellipse cx="0" cy="-5.6" rx="1.7" ry="1.2" fill="#1E1614"/>`+whisk(-2.6,-5,-1,'#5A4434',10)+whisk(2.6,-5,1,'#5A4434',10);
  s+=pA('a-tilt',0,-4,h);
  return {s,a:{head:[0,-13],hr:13,eyes:[[-6,-14.6],[6,-14.6]],er:3.7,nose:[0,-5.6],mouth:[0,-3.4],top:-52,leg:[-5,22],body:[0,11],bw:13,bh:15,feet:34,ear:[-16,-34]}};
};

DRAW.loris=(L,m,o)=>{
  const c=L.c,dkc=L.dark;let s='';
  if(!o.noPerch) s+=pF(pT([[-42,13],[0,10.6],[42,13.4]],6.4,5.4,false),'#6E5236',{lc:'#3A2A1C'})+`<path d="M-30 12.4l5 -.4M-6 11l6 .2M18 11.8l6 .4" stroke="#3A2A1C" stroke-width=".7" opacity=".6"/>`;
  s+=pF(pB(0,3,thin(17),15,{fur:[[0,360,1.8,18]]}),c);
  s+=pF(pT([[0,-8],[0,4],[1,14]],5,3),dkc,{line:false,op:.6});
  [-1,1].forEach(k=>{s+=pF(pT([[k*10,-1],[k*16,6],[k*18,11]],5,4),c,{lw:.8})+pF(pB(k*18.4,12.4,3.4,2.6),pDk(c,.35),{lw:.7});s+=pF(pT([[k*14,10],[k*22,10],[k*25,12.4]],5,4),c,{lw:.8})+pF(pB(k*25.6,13,3.4,2.4),pDk(c,.35),{lw:.7})});
  let h=pF(pB(0,-14,14.6,12.6,{fur:[[0,360,1.6,16]]}),c);
  [-1,1].forEach(k=>{h+=pF(pB(k*13,-20,2.6,2.6),pDk(c,.2),{lw:.7})});
  h+=pF(pT([[0,-27],[0,-20],[0,-14]],3.6,2),dkc,{line:false,op:.8});
  [-1,1].forEach(k=>{h+=pF(pB(k*6.1,-14,6.2,6.8,{rot:k*-12}),dkc,{line:false,op:.92})});
  h+=pF(pT([[0,-21],[0,-13],[0,-7.4]],3.2,2.6),'#F6EEE2',{line:false});
  h+=pFace({m,eyes:[[-6.1,-14],[6.1,-14]],r:4.6,iris:'#8A4E1A',pupil:'round',lid:dkc,cheeks:[[-10,-7],[10,-7]],mouth:[0,-4.6],ms:.65,kind:'rodent',browC:'#F6EEE2',delay:3.4});
  h+=pF(pB(0,-7.2,1.6,1.1),'#C98A86',{line:false});
  s+=pA('a-sway',0,10,h);
  return {s,a:{head:[0,-14],hr:14,eyes:[[-6.1,-14],[6.1,-14]],er:4.6,nose:[0,-7.2],mouth:[0,-4.6],top:-27,leg:[-16,6],body:[0,3],bw:15,bh:10,feet:14,ear:[-13,-20]}};
};
