/* ---------- feathers, fins, scales, shells ---------- */
DRAW.bird=(L,m,o)=>{
  const K=L.big?1.14:L.small?.9:1, c=L.c;
  let s=o.noPerch?'':pF(pT([[-38,27.6],[0,26.6],[38,28]],5,4.6,false),'#7A5A3C',{lc:'#3A2A1C'})+pF(pT([[0,28],[0,33.6]],3.4,3.4,false),'#6A4C32',{line:false})+pF(pB(0,34.4,9,1.8),'#5A4030',{line:false});
  let b='';
  const tl=L.ltail===2?34:L.ltail?26:15;
  b+=pA('a-wagsmall',0,12,pF(pT([[0,12],[1,12+tl*.5],[2,12+tl]],L.ltail?9:10,L.ltail?3:5),L.tail)+(L.ltail===2?pF(pT([[0,26],[1.4,12+tl*.75],[2,12+tl]],4,2),L.wing2,{line:false,op:.8}):'')+`<path d="M1 14V${12+tl-2}" stroke="${pDk(L.tail,.35)}" stroke-width=".7" opacity=".6"/>`);
  b+=pF(pB(0,4,thin(16.6),20,{fur:[[30,150,1.6,12]]}),c);
  b+=pF(pB(0,10,thin(11),13),L.belly,{line:false,bleed:false});
  if(L.scallop){let d='';for(let y=-2;y<20;y+=3.4)for(let x=-12;x<=12;x+=4){if((x*x)/(thin(15)*thin(15))+((y-4)*(y-4))/400<1)d+=`M${x-1.8+(y%2)} ${y}q1.8 1.8 3.6 0`}b+=`<path d="${d}" stroke="${pLt(c,.5)}" stroke-width=".7" fill="none" opacity=".7"/>`}
  else b+=pS(0,8,10,12,14,pDk(L.belly,.2),{ang:90,len:2.2,op:.3});
  [-1,1].forEach(k=>{
    let w=pF(pB(k*thin(14.6),7,7.6,15.6,{rot:k*-12}),L.wing);
    if(L.wing2) w+=pF(pB(k*thin(15.2),13,6.4,9.6,{rot:k*-12}),L.wing2,{lw:.8});
    if(L.wingbar) w+=pF(pB(k*thin(14.2),2,4.8,4,{rot:k*-12}),L.wingbar,{line:false,bleed:false});
    w+=`<path d="M${k*thin(17.6)} 16q${-k*2} 2 ${-k*3} 0q${-k*2} 2 ${-k*3} 0M${k*thin(17.6)} 10q${-k*2} 2 ${-k*3} 0M${k*thin(17.8)} 4q${-k*2} 2 ${-k*3} 0" stroke="${pDk(L.wing,.4)}" stroke-width=".7" fill="none" opacity=".7"/>`;
    b+=pA(k<0?'a-flapL':'a-flapR',k*11,-4,w);
  });
  let h='';
  if(L.crest) h+=pA('a-crest',0,-24,pF(pT([[0,-23],[-1,-31],[2.6,-39],[7,-42]],5.4,1.4),L.crest)+pF(pT([[-2,-22],[-4,-29],[-3,-36]],3.6,1.2),L.crest));
  h+=pF(pB(0,-14,13.6,12.6,{fur:[[200,340,1.6,8]]}),c);
  if(L.face) h+=L.t==='bird'&&(L.big)?[-1,1].map(k=>pF(pB(k*6.6,-15,5.6,5.4),L.face,{line:false,bleed:false})).join('')+(L.jaw?`<path d="M-9 -12.6l2 .6M-9.6 -15.6l2 .4M9 -12.6l-2 .6M9.6 -15.6l-2 .4" stroke="#9A3A30" stroke-width=".6"/>`:'')
    :L.cap&&L.ring?pF(pB(0,-12,11.4,10),L.face,{line:false,bleed:false})+pF(pB(-6.4,-10,5.2,4.6),'#FFFFFF',{line:false,bleed:false,op:L.face==='#FFFFFF'?1:0})+pF(pB(6.4,-10,5.2,4.6),'#FFFFFF',{line:false,bleed:false,op:L.face==='#FFFFFF'?1:0})
    :pF(pB(0,-12,11,9.6),L.face,{line:false,bleed:false});
  if(L.cap) h+=pF(pB(0,-21.4,11.4,6.4),L.cap,{line:false,bleed:false})+(L.face==='#FFFFFF'?pF(pB(0,-4.6,5.6,2.6),L.cap,{line:false}):'');
  if(L.bars) h+=`<path d="M-9 -21q2 -1.4 4 0t4 0t4 0t4 0M-10 -18.6q2 -1.4 4 0t4 0t4 0t4 0t4 0M-11.6 -14q1.4 -1 2.6 0M11.6 -14q-1.4 -1 -2.6 0" stroke="${L.bars}" stroke-width=".9" fill="none" opacity=".75"/>`+[-4,0,4].map(x=>`<circle cx="${x}" cy="${-4.4+Math.abs(x)*.1}" r="1.1" fill="${L.bars}"/>`).join('');
  if(L.cheek) h+=[-1,1].map(k=>pF(pB(k*8.8,-9,L.bars?2.2:3.8,L.bars?3:3.4),L.cheek,{line:false,bleed:false})).join('');
  const er=L.big?3.1:2.8, ey=-15;
  h+=pFace({m,eyes:[[-6.6,ey],[6.6,ey]],r:er,iris:L.iris||'#2A1E18',pupil:L.iris?'round':'bead',lid:L.face&&!L.cap?L.face:c,cheeks:[[-9,-8],[9,-8]],kind:'beak',browC:'#2A1E18',delay:.8});
  if(L.ring) h+=[-1,1].map(k=>`<circle cx="${k*6.6}" cy="${ey}" r="${pN(er*1.35)}" fill="none" stroke="${L.ring}" stroke-width="1.2"/>`).join('');
  const open=m==='happy'||m==='scared'||m==='hungry';
  let bk='';
  if(L.cone){const w=L.face==='#FFFFFF'?3.8:3;bk+=`<path d="M${-w} -11.6Q0 -13 ${w} -11.6L${open?1.2:0} -4.8Z" fill="${Pt.rg(L.beak,{hi:.35})}" stroke="${pDk(L.beak,.5)}" stroke-width=".7"/>`;if(open)bk+=`<path d="M${-w*.8} -10.4L-1 -4.6L1.4 -6Z" fill="${pDk(L.beak,.15)}" stroke="${pDk(L.beak,.5)}" stroke-width=".6"/>`}
  else{const z=L.hook===2?1.55:1;const top=L.beak, jaw=L.jaw||L.beak;
    bk+=`<g transform="translate(0 -9) scale(${z}) translate(0 9)">`+(L.cere?`<ellipse cx="0" cy="-12.4" rx="3" ry="1.4" fill="${L.cere}"/>`:'')+
      `<path d="M-2.2 ${open?-5:-7.2}Q0 ${open?-2.6:-5.6} 2.2 ${open?-5:-7.2}Q0 ${open?-4.2:-6.6} -2.2 ${open?-5:-7.2}Z" fill="${jaw}" stroke="${pDk(jaw,.5)}" stroke-width=".6"/>`+
      `<path d="M-3.2 -11.6Q0 -13.2 3.2 -11.6Q3.3 -7.6 .2 -4.8Q-.4 -4.6 -.6 -5.4Q-3.2 -7.6 -3.2 -11.6Z" fill="${Pt.rg(top,{hi:.35})}" stroke="${pDk(top,.5)}" stroke-width=".6"/></g>`;
    if(open) bk+=`<path d="M-1.6 -6.2Q0 -4 1.6 -6.2" fill="#6E2A2A"/>`}
  h+=bk;
  if(m==='dead') h+=`<path d="M1 -5.4q1.4 2.6 3.2 2" stroke="#E87A86" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  b+=pA(m==='normal'?'a-peck':'',0,-6,h);
  s+=`<g transform="scale(${K})">${b}</g>`;
  [-1,1].forEach(k=>{s+=`<path d="M${k*5.4} ${pN(22.4*K)}q${-k*.6} 3 0 5.2M${k*3.4} ${pN(23*K)}q-.4 3 1 4.6M${k*7.4} ${pN(23*K)}q.4 3 -1 4.6" stroke="#8C7A70" stroke-width="1.7" fill="none" stroke-linecap="round"/>`});
  const a={head:[0,-14*K],hr:13*K,eyes:[[-6.6*K,ey*K],[6.6*K,ey*K]],er:er*K,nose:[0,-9*K],mouth:[0,-6*K],top:(L.crest?-40:-27)*K,leg:[-14*K,8*K],body:[0,6*K],bw:14*K,bh:16*K,feet:34,ear:[-11*K,-18*K]};
  return {s,a};
};

DRAW.chick=(L,m)=>{
  const c=L.c;let s='';
  const legc=L.leg;
  [-1,1].forEach(k=>{s+=`<path d="M${k*5} 22L${k*5.6} 31.6" stroke="${legc}" stroke-width="2" stroke-linecap="round"/>`+(L.bill?pF(Pt.path([[k*5.6,31],[k*1,34.2],[k*5.6,33.4],[k*10.4,34.2]]),legc,{lw:.6}):`<path d="M${k*5.6} 31.6l${-k*4} 2.2M${k*5.6} 31.6l0 2.8M${k*5.6} 31.6l${k*4} 2.2" stroke="${legc}" stroke-width="1.5" stroke-linecap="round"/>`)});
  let b=pF(pB(0,10,thin(19.4),18.6,{np:22,fur:[[0,360,L.quail?1.6:2.6,34]]}),c);
  if(L.quail){b+=pD(0,10,15,14,26,L.dark,1.2,{op:.75})+pS(0,8,15,14,18,L.light,{ang:70,len:3,op:.7})+pF(pB(0,14,thin(11),9),L.light,{line:false,bleed:false,op:.6})}
  else b+=pS(0,10,15,14,26,pDk(c,.15),{radial:true,len:2.6,op:.4});
  [-1,1].forEach(k=>{b+=pA(k<0?'a-flapL':'a-flapR',k*14,4,pF(pB(k*thin(17.4),10,5.4,8.6,{rot:k*-24,fur:[[50,130,2,5]]}),pDk(c,.08)))});
  let h=pF(pB(0,-10,13.6,12.6,{fur:[[180,360,2.2,16]]}),c);
  if(L.quail) h+=pD(0,-14,10,6,10,L.dark,1,{op:.7})+`<path d="M-11 -13q4.6 -4 9 -1.4M11 -13q-4.6 -4 -9 -1.4M0 -22.6V-14" stroke="${L.light}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  else h+=`<path d="M-1.6 -22q-.6 -4 1 -6M0 -22.4q1 -3.6 3 -4.4M1.4 -22q2 -2 4.4 -1.6" stroke="${pDk(c,.2)}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  h+=pFace({m,eyes:[[-6.2,-11.4],[6.2,-11.4]],r:2.6,pupil:'bead',lid:c,cheeks:[[-8.6,-6],[8.6,-6]],kind:'beak',browC:'#3A2A1C',delay:1.4});
  const open=m==='happy'||m==='scared'||m==='hungry';
  if(L.bill) h+=pF(pB(0,-5,6.4,3.4),L.beak,{lw:.7})+`<circle cx="-1.4" cy="-6.4" r=".5" fill="#7A3A10"/><circle cx="1.4" cy="-6.4" r=".5" fill="#7A3A10"/>`+(open?`<path d="M-4.6 -3.6Q0 -.6 4.6 -3.6" stroke="#7A3A10" stroke-width=".9" fill="#E8828C"/>`:'');
  else h+=pA(m==='normal'||m==='hungry'?'a-peep':'',0,-7.6,`<path d="M-2.6 -8.4L2.6 -8.4L0 ${open?-6.6:-4.6}Z" fill="${L.beak}" stroke="${pDk(L.beak,.4)}" stroke-width=".6"/>`+(open?`<path d="M-2.2 -6.6L2.2 -6.6L0 -3.6Z" fill="${pDk(L.beak,.1)}" stroke="${pDk(L.beak,.4)}" stroke-width=".6"/>`:''));
  b+=pA(m==='normal'?'a-peck':'',0,0,h);
  s+=pA(m==='happy'?'a-hop':'',0,30,b);
  return {s,a:{head:[0,-10],hr:13,eyes:[[-6.2,-11.4],[6.2,-11.4]],er:2.6,nose:[0,-7],mouth:[0,-5],top:-24,leg:[-14,10],body:[0,10],bw:16,bh:14,feet:34,ear:[-10,-16]}};
};

DRAW.fish=(L,m)=>{
  const c=L.c,c2=L.c2,fin=L.fin,K=L.kind;let s='';
  const finG=Pt.lg([[0,fin,.95],[1,pLt(fin,.5),.55]],{h:true});
  const rays=(ox,oy,pts)=>`<path d="${pts.map(p=>`M${ox} ${oy}Q${pN((ox+p[0])/2)} ${pN((oy+p[1])/2+1)} ${p[0]} ${p[1]}`).join('')}" stroke="${pDk(fin,.3)}" stroke-width=".55" fill="none" opacity=".55"/>`;
  let tail,dors,anal,body,pec,eye,mouthAt,bw,bh;
  if(K==='betta'){
    tail=pF(Pt.path([[-17,-4],[-30,-24],[-52,-32],[-63,-8],[-61,14],[-50,32],[-30,26],[-17,4]]),c2,{grad:Pt.lg([[0,c],[.35,c2],[1,pLt(c2,.25)]],{h:true}),op:.92,lw:.8})+rays(-17,0,[[-52,-30],[-60,-14],[-62,2],[-58,18],[-48,30]]);
    dors=pF(Pt.path([[-14,-9],[-22,-25],[-6,-32],[6,-12]]),c2,{op:.9,lw:.8})+rays(-6,-10,[[-20,-24],[-12,-29],[-4,-30]]);
    anal=pF(Pt.path([[-15,8],[-28,26],[-4,31],[8,9]]),c2,{op:.9,lw:.8})+rays(-4,9,[[-26,25],[-14,30],[-4,30]]);
    bw=22;bh=thin(10.6);body=pF(pB(0,0,bw,bh),c,{grad:Pt.lg([[0,pDk(c,.25)],[.5,c],[1,L.belly]])})+pD(-2,0,16,7,22,pLt(c,.55),.8,{op:.6});
    pec=pF(Pt.path([[6,3],[-1,9],[3,11]]),c2,{op:.85,lw:.6});eye=[13,-2,3];mouthAt=[21.6,1.4];
  } else if(K==='guppy'){
    tail=pF(Pt.path([[-9,-2],[-24,-17],[-41,-15],[-44,0],[-41,15],[-24,17],[-9,2]]),fin,{grad:Pt.lg([[0,fin],[.7,pLt(fin,.2)],[1,'#3E7AC8']],{h:true}),op:.92,lw:.8})+pD(-30,0,10,11,9,'#1E1A18',1.1,{op:.8});
    dors=pF(Pt.path([[-2,-6],[-10,-15],[4,-7]]),fin,{op:.9,lw:.7});anal=pF(Pt.path([[-2,6],[-6,12],[3,7]]),pLt(c,.3),{op:.8,lw:.6});
    bw=15;bh=thin(7.6);body=pF(pB(3,0,bw,bh),c,{grad:Pt.lg([[0,pDk(c,.3)],[.55,c],[1,L.belly]])})+pF(pB(-4,-1,3,2),'#F29A2E',{line:false})+pF(pB(2,2,2.4,1.6),'#3FA9C9',{line:false});
    pec=pF(Pt.path([[8,2],[3,6],[6,7]]),pLt(c,.3),{op:.8,lw:.5});eye=[11,-1.6,2.6];mouthAt=[17.6,.6];
  } else {
    tail=pF(Pt.path([[-16,-3],[-26,-14],[-40,-24],[-49,-17],[-42,-6],[-31,-1]]),fin,{grad:finG,op:.86,lw:.8})+pF(Pt.path([[-16,3],[-28,8],[-44,9],[-51,20],[-38,25],[-26,14]]),fin,{grad:finG,op:.86,lw:.8})+rays(-16,0,[[-40,-23],[-47,-14],[-42,-5],[-46,10],[-49,19],[-38,24]]);
    dors=pF(Pt.path([[-9,-16],[-4,-31],[7,-30],[12,-17]]),fin,{grad:Pt.lg([[0,fin,.95],[1,pLt(fin,.4),.6]]),op:.9,lw:.8})+rays(1,-16,[[-4,-30],[2,-31],[7,-29]]);
    anal=pF(Pt.path([[-6,15],[-14,25],[-1,22]]),fin,{op:.85,lw:.7})+pF(Pt.path([[6,17],[3,27],[11,20]]),fin,{op:.85,lw:.7});
    bw=24;bh=thin(19.4);
    body=pF(pB(2,0,bw,bh),c,{grad:Pt.lg([[0,pDk(c,.18)],[.42,c],[.7,c2],[1,L.belly]])});
    let sc='';for(let y=-12;y<=12;y+=4.6)for(let x=-14;x<=12;x+=4.6){const xx=x+(Math.round(y/4.6)%2?2.3:0);if(((xx-2)*(xx-2))/(22*22)+(y*y)/(bh*bh*.8)<1)sc+=`M${pN(xx-2.3)} ${pN(y)}q2.3 2.4 4.6 0`}
    body+=`<path d="${sc}" stroke="${pLt(c2,.55)}" stroke-width=".75" fill="none" opacity=".55"/>`;
    body+=pF(pB(15,-8,9.6,8,{j:.09}),pDk(c,.08),{line:false,bleed:false,op:.85})+pF(pB(-4,-11,9,3),'#fff',{line:false,bleed:false,op:.25});
    body+=`<path d="M10 -10Q5.6 0 10 10" stroke="${pDk(c,.4)}" stroke-width=".9" fill="none" opacity=".5"/>`;
    pec=pF(Pt.path([[5,6],[-4,14],[2,16]]),fin,{op:.85,lw:.6});eye=[17,-2,3.6];mouthAt=[26.2,1.8];
  }
  s+=pA('a-ftail',K==='guppy'?-9:-16,0,tail);
  s+=pA('a-fin',0,K==='betta'?-8:-16,dors)+anal+body;
  s+=pA('a-pec',K==='guppy'?8:5,4,pec);
  s+=pFace({m,eyes:[[eye[0],eye[1]]],r:eye[2],iris:K==='gold'?'#E8B23A':K==='betta'?'#B23A3A':'#C9B26A',pupil:'round',lid:c,blink:false,mouth:mouthAt,ms:K==='guppy'?.7:1,kind:'fish',white:K==='gold'});
  return {s,a:{head:[eye[0]-2,eye[1]-2],hr:K==='gold'?11:8,eyes:[[eye[0],eye[1]]],er:eye[2],nose:mouthAt,mouth:mouthAt,top:-20,leg:[0,8],body:[0,0],bw:bw*.8,bh:bh*.8,feet:20,side:1,ear:[eye[0]-4,eye[1]-6]}};
};

DRAW.axo=(L,m)=>{
  const c=L.c,gc=L.gill;let s='';
  s+=pA('a-wagsmall',10,14,pF(pT([[10,14],[24,16],[36,10],[43,3]],10,1.6),c,{op:.95})+pF(Pt.path([[14,10],[28,8],[42,1],[30,14]]),pLt(c,.4),{line:false,op:.5}));
  [-1,1].forEach(k=>{s+=pF(pT([[k*8+6,20],[k*12+6,25]],3.6,2.8),c,{lw:.7})});
  s+=pF(pB(4,12,thin(16),10.4),c);
  [-1,1].forEach(k=>{s+=pF(pT([[k*12,8],[k*15,15],[k*17,20]],4.4,3),c,{lw:.7})+`<path d="M${k*17} 20l${k*-1.6} 2.4M${k*17} 20l0 2.8M${k*17} 20l${k*1.6} 2.4" stroke="${pDk(c,.3)}" stroke-width=".8" stroke-linecap="round"/>`});
  [-1,1].forEach(k=>{
    let gl='';
    [[-14,-4.6],[-9,-2],[-3,0]].forEach(([y,ang],i)=>{const bx=k*17.4,by=y+i*.4;const p=[[bx,by],[bx+k*7,by-4+i*2],[bx+k*13,by-9+i*5]];gl+=pF(pT(p,3.4,1.6),gc,{lw:.6});let fr='';for(let t=.25;t<1;t+=.15){const x=p[0][0]+(p[2][0]-p[0][0])*t,y2=p[0][1]+(p[2][1]-p[0][1])*t;fr+=`M${pN(x)} ${pN(y2)}l${pN(k*1.6)} ${pN(-2.4)}M${pN(x)} ${pN(y2)}l${pN(k*2.4)} ${pN(1.4)}`}gl+=`<path d="${fr}" stroke="${pLt(gc,.25)}" stroke-width=".9" stroke-linecap="round"/>`});
    s+=pA(k<0?'a-gillL':'a-gillR',k*17,-8,gl);
  });
  s+=pF(pB(0,-6,23.4,15.4),c);
  s+=pF(pB(0,1.4,16,6),pLt(c,.35),{line:false,bleed:false});
  s+=pFace({m,eyes:[[-11.4,-8.6],[11.4,-8.6]],r:2.5,pupil:'bead',lid:c,cheeks:[[-14,-2],[14,-2]],blushAlways:1,br:3.4,mouth:[0,-.4],ms:1.1,kind:'reptile',delay:2.6});
  return {s,a:{head:[0,-6],hr:20,eyes:[[-11.4,-8.6],[11.4,-8.6]],er:2.5,nose:[0,-3],mouth:[0,-.4],top:-21,leg:[-15,15],body:[4,12],bw:14,bh:8,feet:24,ear:[-18,-12]}};
};

DRAW.turtle=(L,m)=>{
  const c=L.c,sk=L.skin;let s='';
  [-1,1].forEach(k=>{s+=pF(pB(k*24,13,6.6,4.6,{rot:k*20}),sk,{lw:.8})});
  s+=pF(pB(0,15.6,27,6.2),'#E2CF7A',{lw:.9});
  s+=pF(pB(0,4,thin(30),thin(19.6)),c);
  s+=`<path d="M-8 -8L8 -8L13.4 3L7 14L-7 14L-13.4 3ZM-8 -8L-14 -13M8 -8L14 -13M13.4 3L28 3M-13.4 3L-28 3M7 14L11 21M-7 14L-11 21M0 -8L0 -15" stroke="${pDk(c,.45)}" stroke-width="1.1" fill="none" stroke-linejoin="round" opacity=".7"/>`;
  s+=`<path d="M-4 -3q4 3 8 0M-20 -4q3 4 1 8M20 -4q-3 4 -1 8M-4 7q4 3 8 0" stroke="${L.line}" stroke-width=".9" fill="none" opacity=".55"/>`+pF(pB(-10,-6,10,4.6),'#fff',{line:false,bleed:false,op:.18});
  [-1,1].forEach(k=>{s+=pF(pB(k*19.6,20.6,7.4,5),sk,{lw:.8})+`<path d="M${k*16} 19l${k*7} 1M${k*16} 22l${k*6} .4" stroke="${L.line}" stroke-width=".8" opacity=".8"/><path d="M${k*23} 24.6l${k*1.4} 1.6M${k*20} 25.4l.4 1.8M${k*17} 25l-.6 1.6" stroke="#3A3428" stroke-width=".9" stroke-linecap="round"/>`});
  let h=pF(pT([[0,16],[0,8],[0,0]],10,9.4,false),sk,{lw:.8})+`<path d="M-3 14V2M3 14V2M0 15V3" stroke="${L.line}" stroke-width=".9" opacity=".7"/>`;
  h+=pF(pB(0,-7.6,10.4,8.8),sk);
  h+=`<path d="M-4 -15q-1 6 -5 8M4 -15q1 6 5 8M0 -16V-11M-7 -2q7 3 14 0" stroke="${L.line}" stroke-width=".9" fill="none" opacity=".8"/>`;
  [-1,1].forEach(k=>{h+=pF(pB(k*8.8,-5.4,2.2,3.6),L.ear,{line:false})});
  h+=pFace({m,eyes:[[-4.8,-9.6],[4.8,-9.6]],r:2.5,iris:'#E8C64A',pupil:'round',lid:sk,cheeks:[[-6,-4],[6,-4]],mouth:[0,-3.2],ms:.7,kind:'reptile',delay:3});
  s+=pA('a-headout',0,10,h);
  return {s,a:{head:[0,-7.6],hr:9,eyes:[[-4.8,-9.6],[4.8,-9.6]],er:2.5,nose:[0,-6],mouth:[0,-3.2],top:-17,leg:[-19.6,20],body:[0,4],bw:24,bh:14,feet:26,ear:[-9,-12]}};
};

DRAW.tortoise=(L,m)=>{
  const c=L.c,sk=L.skin;let s='';
  [-1,1].forEach(k=>{s+=pF(pT([[k*20,18],[k*21,26],[k*21,32]],9.6,9),sk,{lw:.9})+pD(k*21,26,3.6,5,5,pDk(sk,.3),.8,{op:.6})+`<path d="M${k*21-3} 33.4l.4 -1.4M${k*21} 33.6v-1.4M${k*21+3} 33.4l-.4 -1.4" stroke="#3A3020" stroke-width=".9"/>`});
  s+=pF(pB(0,15.6,26,5.4),pDk(c,.15));
  s+=pF(pB(0,-1,thin(28),thin(24)),c);
  const sc=[[0,-14],[-14,-6],[14,-6],[0,0],[-21,6],[21,6],[-9,11],[9,11],[0,-24]];
  let r='';sc.forEach(([x,y],i)=>{if(i===8)return;const n=8;for(let t=0;t<n;t++){const a=t/n*Math.PI*2;r+=`M${x+Math.cos(a)*2.4} ${y+Math.sin(a)*2}L${pN(x+Math.cos(a)*7.4)} ${pN(y+Math.sin(a)*6.2)}`}});
  s+=`<path d="M-7 -20L7 -20L9 -8L0 -6L-9 -8ZM-9 -8L-20 -12M9 -8L20 -12M-9 -8L-6 5L6 5L9 -8M-6 5L-14 10M6 5L14 10M-20 -12L-27 0M20 -12L27 0" stroke="#15120E" stroke-width="1.6" fill="none" stroke-linejoin="round" opacity=".8"/>`;
  s+=`<path d="${r}" stroke="${L.ray}" stroke-width="1.5" stroke-linecap="round"/>`+sc.slice(0,8).map(([x,y])=>pF(pB(x,y,2.8,2.3),L.ray,{line:false,bleed:false})).join('');
  s+=pF(pB(-10,-13,11,4),'#fff',{line:false,bleed:false,op:.14});
  let h=pF(pB(0,15.4,8.8,7.6),sk);
  h+=pD(0,12,6,4,6,pDk(sk,.25),.9,{op:.5});
  h+=pFace({m,eyes:[[-3.9,13.6],[3.9,13.6]],r:2.2,pupil:'bead',lid:sk,cheeks:[[-5,18],[5,18]],mouth:[0,19.4],ms:.6,kind:'reptile',delay:1.9});
  s+=pA('a-chomp',0,20,h);
  return {s,a:{head:[0,15],hr:8,eyes:[[-3.9,13.6],[3.9,13.6]],er:2.2,nose:[0,17],mouth:[0,19.4],top:-25,leg:[-21,26],body:[0,-2],bw:24,bh:18,feet:34,ear:[-6,10]}};
};

DRAW.gecko=(L,m)=>{
  const c=L.c,cr=L.kind==='crested';let s='';
  let tl=pF(pT([[11,20],[23,24],[33,20],[38,10],[34,2]],thin(10.6),3),c);
  if(!cr) tl+=`<path d="M17 18.4l-1 7.6M24 20l1 7.6M31 18l3.6 6.4M35 11.4l5 2.4" stroke="#3A2E22" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`+pD(28,18,7,4,5,L.spot,.9);
  else tl+=`<path d="M13 16.6Q24 19 32 15Q37 10 34 3" stroke="${pDk(c,.3)}" stroke-width="1.6" fill="none" stroke-dasharray="1.6 1.4"/>`;
  s+=pA('a-wagsmall',11,20,tl);
  [-1,1].forEach(k=>{s+=pF(pT([[k*14,20],[k*21,25],[k*24,29]],5,3.2),c,{lw:.8})+[0,1,2,3].map(t=>`<circle cx="${pN(k*24+k*(t-1.5)*1.8)}" cy="${pN(30.4+Math.abs(t-1.5)*-.6)}" r="${cr?1.2:.8}" fill="${pDk(c,.2)}"/>`).join('')});
  s+=pF(pB(0,15,thin(17),11),c);
  s+=pD(0,14,13,8,cr?4:16,L.spot,cr?1.6:1.2);
  [-1,1].forEach(k=>{s+=pF(pT([[k*11,7],[k*18,13],[k*22,18]],5,3.4),c,{lw:.8})+[0,1,2,3].map(t=>`<circle cx="${pN(k*22.6+k*(t-1.5)*1.7)}" cy="${pN(19.6-Math.abs(t-1.5)*.5)}" r="${cr?1.2:.8}" fill="${pDk(c,.2)}"/>`).join('')});
  let h=pF(pB(0,-2,19.2,13.8),c);
  if(cr){h+=pF(pB(0,3,14,5),L.belly,{line:false,bleed:false});
    [-1,1].forEach(k=>{let d=`M${k*19} -2`;for(let t=0;t<7;t++){const x=k*(18-t*2.2),y=-6-t*1.4-(t>3?(t-3)*-.6:0);d+=`L${pN(x+k*1.2)} ${pN(y-2.4)}L${pN(x)} ${pN(y)}`}h+=`<path d="${d}" stroke="${pDk(c,.4)}" stroke-width=".9" fill="${pLt(c,.25)}" stroke-linejoin="round"/>`});
  } else {h+=pF(pB(0,3.4,14,5),L.belly,{line:false,bleed:false})+pD(0,-6,14,6,14,L.spot,1.1)}
  h+=pFace({m,eyes:[[-10.4,-5],[10.4,-5]],r:cr?4.4:4.8,iris:cr?'#C9A04A':'#6A625C',pupil:'slit',lid:c,cheeks:[[-13,1],[13,1]],mouth:[0,3.6],ms:1.2,kind:'reptile',delay:.4});
  h+=`<circle cx="-2" cy="-1.6" r=".6" fill="#3A2E22"/><circle cx="2" cy="-1.6" r=".6" fill="#3A2E22"/>`;
  if(m==='normal') h+=pA('a-lick',5,3,`<path d="M5 3.4Q9 1 9.6 -2.4Q11 -.6 8 3.6Z" fill="#E8828C" stroke="#B9505E" stroke-width=".5"/>`);
  s+=h;
  return {s,a:{head:[0,-2],hr:18,eyes:[[-10.4,-5],[10.4,-5]],er:cr?4.4:4.8,nose:[0,-1.6],mouth:[0,3.6],top:-16,leg:[-18,13],body:[0,15],bw:15,bh:8,feet:30,ear:[-15,-8]}};
};

DRAW.snake=(L,m)=>{
  const c=L.c;let s='';
  const coil=(y,rx,ry,sd)=>pF(pB(0,y,thin(rx),ry),c)+pD(0,y-1,rx*.8,ry*.6,Math.round(rx/3),L.spot,ry*.32,{s:sd})+`<path d="M${pN(-thin(rx)*.85)} ${pN(y+ry*.45)}Q0 ${pN(y+ry*1.05)} ${pN(thin(rx)*.85)} ${pN(y+ry*.45)}" stroke="${L.belly}" stroke-width="1.2" fill="none" opacity=".45"/>`;
  s+=coil(26,30,9.4,1)+coil(15,24,8.6,2)+coil(5,17.6,7.6,3);
  let h=pF(pT([[3,4],[6,-4],[4,-11]],9.4,8.4,false),c,{lw:.8});
  h+=pF(pB(4,-16,12,8.8),c);
  h+=`<path d="M-6 -17.6Q4 -21 14 -17.6" stroke="${L.spot}" stroke-width="2.2" fill="none" opacity=".75"/>`+pF(pB(4,-12,8.4,3.2),L.belly,{line:false,bleed:false});
  h+=pFace({m,eyes:[[-2.8,-17.4],[10.8,-17.4]],r:2.3,iris:'#6A4A2E',pupil:'round',lid:c,cheeks:[[-4,-12],[12,-12]],mouth:[4,-11.6],ms:.8,kind:'reptile',delay:2.8});
  if(m!=='dead') h+=pA('a-tongue',4,-9.4,`<path d="M4 -9.4V-3.6M4 -3.6l-1.8 2.6M4 -3.6l1.8 2.6" stroke="#D63C4A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`);
  s+=pA('a-sway',4,4,h);
  return {s,a:{head:[4,-16],hr:11,eyes:[[-2.8,-17.4],[10.8,-17.4]],er:2.3,nose:[4,-14],mouth:[4,-11.6],top:-25,leg:[-20,24],body:[0,18],bw:22,bh:10,feet:34,ear:[-6,-18]}};
};

DRAW.bug=(L,m)=>{
  const c=L.c,c2=L.c2,stag=L.kind==='stag';let s='';
  const legs=[-1,1].map(k=>`<path d="M${k*9} 2L${k*21} -4L${k*28} 2M${k*11} 11L${k*25} 13L${k*30} 21M${k*9} 20L${k*21} 28L${k*23} 34" stroke="${c2}" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M${k*15} -1.4l${k*1} -1.6M${k*20} 12.4l${k*.4} -1.8M${k*16} 24.6l${k*1.4} -1" stroke="${c2}" stroke-width="1.1"/>`).join('');
  s+=legs;
  s+=pF(pB(0,14,thin(17),19.4),c,{grad:Pt.rg(c,{cx:.35,cy:.25,hi:.4,sh:.5})});
  s+=`<path d="M0 -4V33" stroke="${pDk(c,.6)}" stroke-width="1.1"/>`+pF(pB(-8,8,3,10,{rot:8}),'#fff',{line:false,bleed:false,op:.28})+pF(pB(8,10,2,8,{rot:-8}),'#fff',{line:false,bleed:false,op:.16});
  s+=pF(pB(0,-6,12.6,8.6),c2,{grad:Pt.rg(c2,{cx:.35,cy:.25,hi:.45,sh:.5})})+pF(pB(-4,-9,3.6,1.6),'#fff',{line:false,bleed:false,op:.3});
  let h=pF(pB(0,-14.6,7.4,5.4),c2);
  if(stag) [-1,1].forEach(k=>{h+=pA(k<0?'a-snipL':'a-snipR',k*3,-17,pF(pT([[k*3,-17],[k*10,-26],[k*12,-36],[k*7,-44]],4.4,1.6),c2,{lw:.8})+`<path d="M${k*11} -31l${-k*3} .6" stroke="${c2}" stroke-width="1.6" stroke-linecap="round"/>`)});
  else h+=pA('a-horn',0,-16,pF(pT([[0,-16],[0,-28],[-1,-39],[0,-45]],5.4,3),c2,{lw:.8})+pF(pT([[0,-43],[-5,-50]],3,1.2),c2,{lw:.7})+pF(pT([[0,-43],[5,-50]],3,1.2),c2,{lw:.7}))+pF(pT([[0,-8],[0,-17]],3.2,1.4),c2,{lw:.6});
  h+=`<path d="M-4 -18q-6 -4 -8 -10M4 -18q6 -4 8 -10" stroke="${c2}" stroke-width=".9" fill="none"/>`;
  h+=pFace({m,eyes:[[-5,-14.6],[5,-14.6]],r:2.2,iris:'#C98A3A',pupil:'round',lid:c2,cheeks:[[-5,-11],[5,-11]],mouth:[0,-10.6],ms:.6,kind:'bug',browC:'#E9D9C0',delay:3.1});
  s+=h;
  return {s,a:{head:[0,-14],hr:7,eyes:[[-5,-14.6],[5,-14.6]],er:2.2,nose:[0,-12],mouth:[0,-10.6],top:stag?-44:-50,leg:[-21,-4],body:[0,14],bw:15,bh:15,feet:34,ear:[-6,-18]}};
};

DRAW.crab=(L,m)=>{
  const c=L.c;let s='';
  [-1,0,1].forEach(i=>{s+=pF(pT([[-8+i*5,14],[-14+i*7,22],[-16+i*9,31]],3.2,2),c,{lw:.7})+`<path d="M${-12+i*6} 19l1.6 -.4M${-15+i*8} 26l1.6 -.2" stroke="#F4D2B8" stroke-width=".9"/>`});
  s+=pF(pB(6,-2,thin(21),19.6),L.shell);
  s+=`<path d="M6 -2m-3 0a3 3 0 1 1 6 0a7 7 0 1 1 -14 0a11 11 0 1 1 22 0a15 15 0 1 1 -30 0" stroke="#A87F55" stroke-width="1.6" fill="none" opacity=".7"/>`+pS(6,-2,16,15,20,'#C9A77A',{radial:true,len:2.4,op:.4});
  s+=pF(pB(-6,11,9,6.4),'#4A2A20',{line:false});
  s+=pF(pB(-8,10,8,5.6),c);
  s+=`<path d="M-9 6Q-18 -6 -26 -14M-7 6Q-12 -10 -20 -18" stroke="#E58A4A" stroke-width=".8" fill="none"/>`;
  [-1,1].forEach(k=>{const ex=k<0?-14:-3,ey=-8;s+=pA('a-stalk',ex<-8?-10:-6,6,pF(pT([[k<0?-10:-6,6],[ex,ey+3]],2.6,2.2,false),c,{lw:.7}))});
  s+=pA('a-claw',-14,12,pF(pB(-20,14,8.4,6.2,{rot:-20}),L.claw)+pF(Pt.path([[-25,9],[-31,6],[-30,11]]),L.claw,{lw:.8})+pF(Pt.path([[-26,14],[-32,15],[-28,17]]),L.claw,{lw:.8})+pD(-20,14,6,4,6,'#F2D9E2',.7,{op:.6}));
  s+=pF(pB(-1,18,4.4,3.2),c,{lw:.7});
  s+=pFace({m,eyes:[[-14,-8],[-3,-8.6]],r:2.6,pupil:'bead',lid:c,cheeks:[[-11,9],[-3,9]],mouth:[-8,12],ms:.6,kind:'bug',browC:'#3A2018',delay:.2});
  return {s,a:{head:[-8,-4],hr:9,eyes:[[-14,-8],[-3,-8.6]],er:2.6,nose:[-8,8],mouth:[-8,12],top:-22,leg:[-20,14],body:[6,0],bw:17,bh:15,feet:32,ear:[-14,-12]}};
};

DRAW.cricket=(L,m)=>{
  const c=L.c;let s='';
  s+=pA('a-ant',20,-2,`<path d="M20 -2Q34 -26 48 -22" stroke="${c}" stroke-width=".9" fill="none"/>`)+pA('a-ant2',20,-3,`<path d="M20 -3Q28 -34 42 -36" stroke="${c}" stroke-width=".9" fill="none"/>`);
  s+=`<path d="M10 8L12 20L14 21M4 9L2 20L0 21M-8 13L-10 20" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  s+=pF(pB(-8,8,thin(17),7.6),c,{grad:Pt.rg(c,{hi:.25,sh:.5})});
  s+=pA('a-chirp',6,2,pF(pB(-6,3.6,15.4,5.4),pDk(c,.2),{grad:Pt.lg([[0,pDk(c,.35)],[1,pLt(c,.15)]])})+pF(pB(4,1,2.8,1.8),L.spot,{line:false})+`<path d="M-18 4Q-6 1 6 3" stroke="${pLt(c,.3)}" stroke-width=".6" fill="none" opacity=".7"/>`);
  s+=pF(pT([[-4,7],[-13,-3],[-21,-7]],7.4,4.4),c)+pF(pT([[-21,-7],[-27,10],[-31,22]],2.6,1.6),c,{lw:.6})+`<path d="M-24 0l-2 -.8M-26 7l-2 -.6M-28 14l-2 -.6" stroke="${c}" stroke-width=".8"/>`;
  s+=pF(pB(8,3,7.4,6.6),c)+pF(pB(17,2,7,6.6),c,{grad:Pt.rg(c,{hi:.3,sh:.5})});
  s+=pFace({m,eyes:[[19.4,-.6]],r:2.4,pupil:'bead',lid:c,mouth:[22.4,5],ms:.6,kind:'bug',browC:'#E2B85A',delay:.7});
  return {s,a:{head:[17,2],hr:7,eyes:[[19.4,-.6]],er:2.4,nose:[22,3],mouth:[22.4,5],top:-10,leg:[-22,-6],body:[-6,6],bw:15,bh:6,feet:21,side:1,ear:[14,-4]}};
};
