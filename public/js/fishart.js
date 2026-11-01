/* ---------- v0.26: the fish drawn as one living painting ----------
   v0.24 moved each fin as its own image; fins swung away from the body and looked pinned on.
   Now the parts are put together once per species into one picture (with per-species corrections,
   FA_ADJ), and every frame that picture is drawn in thin vertical columns:
     · the body part of a column only shifts up and down in a travelling wave (head still, tail most)
     · the fin parts above and below the body stretch away from the body edge and back — fins breathe
       and flow from where they grow, never apart from it
     · past the tail joint the whole column fans open and shut and narrows a little: the tail beating
       toward and away from us
     · the pectoral fin is drawn last and rows around its own base
   How strongly each of these happens is the species' own (FA_STYLE + MOVE in stage.js). */

const FA_BASE='img/fish/';
/* corrections to the assembled picture: s scales a part around its joint, dx/dy move it (px of the 560-wide fish) */
const FA_ADJ={
 betta:{tail:{s:1.45,dx:-18,dy:-4},dorsal:{s:1.15,dx:70,dy:58},pelvic:{s:1.3,dx:10,dy:-16},pect:{s:.9}},
 wildbetta:{tail:{s:1.12,dx:-6},pelvic:{dy:-6},dorsal:{dy:6}},
 guppy:{tail:{s:1.08,dx:-6},dorsal:{dy:6},pelvic:{dy:-6}},
 platy:{dorsal:{dy:6},pelvic:{dy:-6},tail:{dx:-6}},
 neon:{dorsal:{dy:6},pelvic:{dy:-6},tail:{dx:-5}},
 oranda:{tail:{s:1.1,dx:-10},dorsal:{dy:10},pelvic:{dy:-14}},
 ryukin:{tail:{s:1.35,dx:-16},dorsal:{dy:12},pelvic:{dy:-18},pect:{dy:-4}},
 comet:{tail:{s:1.12,dx:-8},dorsal:{dy:6},pelvic:{dy:-6}},
 koi:{dorsal:{dy:6},pelvic:{dy:-6},tail:{dx:-6}},
 cory:{dorsal:{dy:6},pelvic:{dy:-8},tail:{dx:-8}},
 oscar:{dorsal:{dy:8},pelvic:{dy:-8},tail:{dx:-6}},
 pleco:{dorsal:{dy:6},pelvic:{dy:-8},tail:{dx:-8}},
 arowana:{dorsal:{dy:4},pelvic:{dy:-4},tail:{dx:-6}},
 clownloach:{dorsal:{dy:8},pelvic:{dy:-8},tail:{dx:-6}},
 apisto:{dorsal:{dy:8},pelvic:{dy:-8},tail:{dx:-6}},
 altum:{dorsal:{s:1.15,dy:10},pelvic:{s:1.15,dy:-12},tail:{dx:-8}},
 channa:{dorsal:{dy:4},pelvic:{dy:-4},tail:{dx:-6}},
 peapuffer:{dorsal:{dy:10},pelvic:{dy:-12},tail:{dx:-10}},
 fig8:{dorsal:{dy:12},pelvic:{dy:-14},tail:{dx:-10}},
 bichir:{dorsal:{dy:6},pelvic:{dy:-6},tail:{dx:-6}},
 gar:{dorsal:{dy:4},pelvic:{dy:-4},tail:{dx:-6}},
 motoro:{tail:{dx:-6}},
 ghost:{}
};
/* how the picture moves: wave = body sway, fan = tail fanning, squash = tail turning, fin = fin breathing,
   finHz = fin beat (× tail beat), ripple = the fin wave runs fast along the belly (knifefish, ray) */
const FA_STYLE={
 betta:{wave:.018,fan:.12,squash:.1,fin:.16,finHz:.55,flow:1},
 wildbetta:{wave:.022,fan:.12,squash:.12,fin:.1,finHz:.7},
 guppy:{wave:.03,fan:.16,squash:.16,fin:.07,finHz:.8},
 platy:{wave:.026,fan:.13,squash:.14,fin:.06,finHz:.8},
 neon:{wave:.024,fan:.12,squash:.14,fin:.05,finHz:.9},
 oranda:{wave:.02,fan:.16,squash:.12,fin:.12,finHz:.6,flow:1},
 ryukin:{wave:.02,fan:.16,squash:.12,fin:.12,finHz:.6,flow:1},
 comet:{wave:.03,fan:.15,squash:.15,fin:.08,finHz:.7},
 koi:{wave:.028,fan:.12,squash:.14,fin:.06,finHz:.7},
 cory:{wave:.02,fan:.12,squash:.12,fin:.05,finHz:1},
 pleco:{wave:.016,fan:.1,squash:.1,fin:.04,finHz:.8},
 clownloach:{wave:.026,fan:.12,squash:.14,fin:.06,finHz:.9},
 apisto:{wave:.024,fan:.12,squash:.14,fin:.1,finHz:.7},
 oscar:{wave:.018,fan:.1,squash:.12,fin:.07,finHz:.6},
 arowana:{wave:.012,fan:.08,squash:.1,fin:.05,finHz:.6},
 gar:{wave:.01,fan:.08,squash:.08,fin:.04,finHz:.6},
 channa:{wave:.02,fan:.1,squash:.1,fin:.07,finHz:.9,ripple:1},
 altum:{wave:.01,fan:.08,squash:.08,fin:.07,finHz:.45,flow:1},
 peapuffer:{wave:.004,fan:.07,squash:.06,fin:.16,finHz:3.2},
 fig8:{wave:.004,fan:.07,squash:.06,fin:.15,finHz:3},
 bichir:{wave:.024,fan:.1,squash:.1,fin:.08,finHz:1,ripple:1},
 ghost:{wave:.004,fan:.06,squash:.05,fin:.13,finHz:2.6,ripple:1},
 motoro:{wave:.03,fan:.04,squash:.02,fin:.12,finHz:.6,ripple:1,ray:1}
};
const FA_STYLE0={wave:.024,fan:.12,squash:.13,fin:.07,finHz:.8};

const FA_CACHE={};
function faImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
/* put the parts together once per species */
function faComp(id){
  if(FA_CACHE[id])return FA_CACHE[id];
  const R=typeof RIG!=='undefined'&&RIG[id];if(!R)return null;
  const C=FA_CACHE[id]={ready:false,id};
  const parts=['tail','pelvic','dorsal','body','pect'];
  Promise.all(parts.map(k=>faImg(FA_BASE+id+'/'+k+'.webp'))).then(imgs=>{
    const A=FA_ADJ[id]||{},box={};
    parts.forEach((k,i)=>{const p=R.l[k],a=A[k]||{},s=a.s||1;
      box[k]={img:imgs[i],w:p.w*s,h:p.h*s,x:p.x+p.px-p.px*s+(a.dx||0),y:p.y+p.py-p.py*s+(a.dy||0),px:p.px*s,py:p.py*s}});
    /* the canvas holds every part, with room for the fins to open */
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    parts.forEach(k=>{const b=box[k];x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.w);y1=Math.max(y1,b.y+b.h)});
    const W=Math.ceil(x1-x0),H=Math.ceil(y1-y0);
    parts.forEach(k=>{box[k].x-=x0;box[k].y-=y0});
    /* the picture without the pectoral fin */
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
    ['tail','pelvic','dorsal'].forEach(k=>{const b=box[k];if(b.img)g.drawImage(b.img,b.x,b.y,b.w,b.h)});
    /* the body's painted cut end fades out over the tail's root, so the joint never shows */
    {const b=box.body;if(b.img){const t=document.createElement('canvas');t.width=W;t.height=H;const tg=t.getContext('2d');tg.drawImage(b.img,b.x,b.y,b.w,b.h);
      const fw=b.w*((A.body&&A.body.fade)||.05),xr=b.x+b.w,gr=tg.createLinearGradient(xr-fw,0,xr,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.55,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,1)');
      tg.globalCompositeOperation='destination-out';tg.fillStyle=gr;tg.fillRect(xr-fw,0,fw+2,H);g.drawImage(t,0,0)}}
    /* where the body is, column by column (the fins grow from its edges) */
    const bc=document.createElement('canvas');bc.width=W;bc.height=H;const bg=bc.getContext('2d');const b=box.body;if(b.img)bg.drawImage(b.img,b.x,b.y,b.w,b.h);
    const A8=bg.getImageData(0,0,W,H).data,top=new Float32Array(W),bot=new Float32Array(W);
    const cyAll=b.y+b.h/2;
    for(let x=0;x<W;x++){let t=-1,u=-1;for(let y=0;y<H;y++){if(A8[(y*W+x)*4+3]>140){if(t<0)t=y;u=y}}
      if(t<0){top[x]=cyAll;bot[x]=cyAll}else{top[x]=t;bot[x]=u}}
    const tl=box.tail;
    Object.assign(C,{ready:true,cv,W,H,top,bot,cy:cyAll,joint:(tl.x+tl.px)/W,pect:box.pect,head:b.x/W,ox:x0,oy:y0});
  });
  return C;
}
/* fin rot, painted into the fish itself: the fin edges are eaten back unevenly and turn milky white.
   Built once per species from the finished picture, so the rotten fins move with the fish (no second copy on top). */
function faRot(C){
  if(C.rcv||!C.ready)return C.rcv;
  const W=C.W,H=C.H,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');g.drawImage(C.cv,0,0);
  const im=g.getImageData(0,0,W,H),d=im.data,A=i=>d[i*4+3];
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  /* a ragged edge: a slow wave with a few V-shaped bites taken out of it */
  const rag=n=>{const a=new Float32Array(n),p1=rnd()*6,p2=rnd()*6;
    for(let i=0;i<n;i++)a[i]=.45+.2*Math.sin(i*.045+p1)+.12*Math.sin(i*.16+p2);
    for(let k=0,m=Math.max(3,Math.round(n/45));k<m;k++){const c=rnd()*n,w=5+rnd()*12,dp=.25+rnd()*.3;
      for(let i=Math.max(0,Math.floor(c-w));i<Math.min(n,Math.ceil(c+w));i++)a[i]+=dp*(1-Math.abs(i-c)/w)}
    for(let i=0;i<n;i++)a[i]=Math.min(1,Math.max(0,a[i]));return a};
  const J=Math.round(C.joint*W),E=Math.max(10,Math.round(Math.min(W,H)*.09));
  const cut=i=>{d[i*4+3]=0};
  const milk=(i,k)=>{k=Math.min(1,k);d[i*4]+=(252-d[i*4])*k;d[i*4+1]+=(249-d[i*4+1])*k;d[i*4+2]+=(244-d[i*4+2])*k;d[i*4+3]*=1-.4*k*k};
  /* the tail: each row loses the outer part of its length; the new edge is milky */
  const rr=rag(H);
  for(let y=0;y<H;y++){let xr=-1;for(let x=W-1;x>J;x--)if(A(y*W+x)>40){xr=x;break}
    if(xr<0)continue;const len=xr-J,c=Math.round(xr-len*(.1+.4*rr[y]));
    for(let x=c+1;x<=xr;x++)cut(y*W+x);
    for(let x=Math.max(J,c-E);x<=c;x++){const i=y*W+x;if(A(i)>0)milk(i,.95*Math.pow(1-(c-x)/E,1.3))}}
  /* fins above and below the body, before the tail joint */
  const rc=rag(W),rb=rag(W);
  for(let x=0;x<J;x++){const top=Math.round(C.top[x]),bot=Math.round(C.bot[x]);
    let y0=-1;for(let y=0;y<top;y++)if(A(y*W+x)>40){y0=y;break}
    if(y0>=0&&top-y0>6){const c=Math.round(y0+(top-y0)*(.1+.45*rc[x]));for(let y=y0;y<c;y++)cut(y*W+x);
      for(let y=c;y<Math.min(top,c+E);y++){const i=y*W+x;if(A(i)>0)milk(i,.9*Math.pow(1-(y-c)/E,1.3))}}
    let y1=-1;for(let y=H-1;y>bot;y--)if(A(y*W+x)>40){y1=y;break}
    if(y1>=0&&y1-bot>6){const c=Math.round(y1-(y1-bot)*(.1+.45*rb[x]));for(let y=c+1;y<=y1;y++)cut(y*W+x);
      for(let y=Math.max(bot,c-E);y<=c;y++){const i=y*W+x;if(A(i)>0)milk(i,.9*Math.pow(1-(c-y)/E,1.3))}}}
  g.putImageData(im,0,0);C.rcv=cv;return cv;
}
/* a fish on screen: a canvas that draws the species' picture, moving */
class FishArt{
  constructor(id,opt){
    this.id=id;this.o=opt||{};this.st=Object.assign({},FA_STYLE0,FA_STYLE[id]||{});
    const R=RIG[id];this.nat=[R.w,R.h];
    this.el=document.createElement('canvas');this.el.className='rig fa';
    this.el.style.width=R.w+'px';this.el.style.height=R.h+'px';
    this.C=faComp(id);this.k=0;this.t=Math.random()*10;this.beat=.6;this.amp=1;this.skip=0;
  }
  /* resolution follows the size on screen (and the screen's pixel density) */
  size(scale){
    const dpr=Math.min(2,(typeof devicePixelRatio==='number'?devicePixelRatio:1));
    const k=Math.max(.25,Math.min(1.6,scale*dpr));
    if(Math.abs(k-this.k)<.08&&this.el.width)return;
    this.k=k;this.el.width=Math.round(this.nat[0]*k);this.el.height=Math.round(this.nat[1]*k);this.ctx=this.el.getContext('2d');
  }
  /* beat: seconds per tail beat · amp: 0 still … 1 swimming … 2 sprinting */
  draw(dt,beat,amp){
    const C=this.C;if(!C||!C.ready||!this.ctx)return;
    if(this.o.lowfps&&(this.skip^=1))return;
    this.t+=dt*(this.o.lowfps?2:1);this.beat+=(beat-this.beat)*.1;this.amp+=(amp-this.amp)*.08;
    const g=this.ctx,k=this.k,S=this.st,W=C.W,H=C.H,cw=this.el.width,ch=this.el.height;
    const SRC=this.rot&&faRot(C)||C.cv;
    /* the picture fits the rig box (RIG w,h) as the old layered fish did */
    const fit=Math.min(cw/W,ch/H)*.97,ox=(cw-W*fit)/2,oy=(ch-H*fit)/2;
    g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cw,ch);g.imageSmoothingEnabled=true;
    const w=2*Math.PI/Math.max(.15,this.beat),ph0=this.t*w,a=this.amp;
    const fw=2*Math.PI/Math.max(.08,this.beat/(S.finHz||1)),fph=this.t*fw;
    const step=Math.max(2,Math.round((this.o.mate?7:3.5)/fit)),J=C.joint,hd=C.head+.18;
    let dx=0;
    for(let x=0;x<W;x+=step){
      const sw=Math.min(step,W-x),u=(x+sw/2)/W;
      const ph=ph0-u*5.2;
      const env=u<hd?0:Math.min(1,(u-hd)/Math.max(.05,J-hd));
      const tail=u<J-.03?0:Math.min(1,(u-J+.03)/.1);
      const dy=H*S.wave*a*(env*.55+tail*.6)*Math.sin(ph)*(S.ray?1.6:1);
      /* fins open and close; a ripple runs faster along the length */
      const fp=S.ripple?fph-u*14:fph-u*3;
      const finT=1+S.fin*Math.max(.35,a)*(.6+.4*env)*Math.sin(fp+(S.flow?Math.sin(u*4+this.t):0));
      const finB=1+S.fin*Math.max(.35,a)*(.6+.4*env)*Math.sin(fp+1.7);
      const fan=1+S.fan*a*tail*Math.sin(ph+1.1);
      const cwid=sw*(1-S.squash*a*tail*(.5+.5*Math.sin(ph+.4)));
      const X=ox+(x+dx)*fit;
      const xi=Math.min(W-1,Math.round(x+sw/2)),top=C.top[xi],bot=C.bot[xi];
      if(tail>.5||bot-top<2){
        /* the tail: the whole column fans around the body's middle */
        const c=C.cy,hh=H*fan;g.drawImage(SRC,x,0,sw,H,X,oy+(c-c*fan+dy)*fit,cwid*fit+.6,hh*fit);
      }else{
        g.drawImage(SRC,x,top,sw,bot-top,X,oy+(top+dy)*fit,cwid*fit+.6,(bot-top)*fit+.5);
        if(top>1){const h2=top*finT;g.drawImage(SRC,x,0,sw,top,X,oy+(top+dy-h2)*fit,cwid*fit+.6,h2*fit+.5)}
        if(bot<H-1){const h3=(H-bot)*finB;g.drawImage(SRC,x,bot,sw,H-bot,X,oy+(bot+dy)*fit-.5,cwid*fit+.6,h3*fit)}
      }
      dx+=cwid-sw;
    }
    /* the pectoral fin rows around its base */
    const P=C.pect;if(P&&P.img){
      const pr=S.ray?0:(this.o.pa||18)*Math.PI/180*(.35+.25*a)*Math.sin(this.t*w/Math.max(.2,(this.o.pr||.7)));
      const bx=P.x+P.px,by=P.y+P.py,xi=Math.min(W-1,Math.max(0,Math.round(bx)));
      const u=bx/W,env=u<hd?0:Math.min(1,(u-hd)/Math.max(.05,J-hd)),dy=H*S.wave*a*env*.55*Math.sin(ph0-u*5.2);
      g.setTransform(fit,0,0,fit,ox+bx*fit,oy+(by+dy)*fit);g.rotate(pr);g.transform(1,0,0,1-.12*Math.abs(Math.sin(pr*3)),0,0);
      g.drawImage(P.img,-P.px,-P.py,P.w,P.h);g.setTransform(1,0,0,1,0,0);
    }
  }
}
