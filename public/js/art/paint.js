/* ---------- painterly drawing kit ----------
   Small helpers for a soft, picture-book look in plain SVG (no filters on moving parts):
   gradient fills with a warm light from the upper left, organic outlines with fur tufts,
   tapered strokes for tails and limbs, and expressive eyes and mouths.
   Everything is deterministic (seeded) so a redraw never jitters. */
const Pt=(()=>{
  const defs=new Map();
  const n=v=>Math.round(v*10)/10;
  const hx=c=>{c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(c.substr(i,2),16))};
  const toHex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
  const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t))};
  const lt=(c,t)=>mix(c,'#FFF9EF',t), dk=(c,t)=>mix(c,'#24160F',t);
  const grey=(c,t)=>{const A=hx(c),g=(A[0]*.3+A[1]*.59+A[2]*.11);return toHex(A.map(v=>v+(g-v)*t))};
  let seed=1;
  const srand=s=>{seed=(Math.abs(Math.floor(s*9301+49297))%233280)+1};
  const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};

  /* closed or open smooth path through points; points flagged [x,y,1] become sharp tips */
  function path(p,closed){
    if(closed===undefined)closed=true;
    const N=p.length, m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
    if(!closed){
      let d=`M${n(p[0][0])} ${n(p[0][1])}`;
      for(let i=1;i<N-1;i++){const q=m(p[i],p[i+1]);d+=p[i][2]?`L${n(p[i][0])} ${n(p[i][1])}L${n(q[0])} ${n(q[1])}`:`Q${n(p[i][0])} ${n(p[i][1])} ${n(q[0])} ${n(q[1])}`}
      return d+`L${n(p[N-1][0])} ${n(p[N-1][1])}`;
    }
    const s=m(p[N-1],p[0]);let d=`M${n(s[0])} ${n(s[1])}`;
    for(let i=0;i<N;i++){const q=m(p[i],p[(i+1)%N]);d+=p[i][2]?`L${n(p[i][0])} ${n(p[i][1])}L${n(q[0])} ${n(q[1])}`:`Q${n(p[i][0])} ${n(p[i][1])} ${n(q[0])} ${n(q[1])}`}
    return d+'Z';
  }
  /* organic ellipse. fur: [[fromDeg,toDeg,len,count]] adds pointed tufts on that arc (0° = right, 90° = down) */
  function blob(cx,cy,rx,ry,o){
    o=o||{};srand((o.s||0)+cx*7.1+cy*3.3+rx*13+ry*5);
    const np=o.np||16, j=o.j==null?.035:o.j, rot=(o.rot||0)*Math.PI/180, fur=o.fur||[];
    const pts=[];
    const put=(a,r,sharp)=>{const x=Math.cos(a)*rx*r,y=Math.sin(a)*ry*r;pts.push([cx+x*Math.cos(rot)-y*Math.sin(rot),cy+x*Math.sin(rot)+y*Math.cos(rot),sharp])};
    const inFur=deg=>{deg=((deg%360)+360)%360;for(const f of fur){let a=((f[0]%360)+360)%360,b=((f[1]%360)+360)%360;if(a<=b?deg>=a&&deg<=b:deg>=a||deg<=b)return f}return null};
    for(let i=0;i<np;i++){
      const a=i/np*Math.PI*2, deg=a*180/Math.PI;
      put(a,1+(rnd()-.5)*2*j);
      const f=inFur(deg+180/np);
      if(f){
        const k=Math.max(1,Math.round((f[3]||np)/np));
        for(let t=0;t<k;t++){
          const aa=a+(t+.5+(rnd()-.5)*.5)/k*(Math.PI*2/np);
          const L=f[2]*(.6+rnd()*.7)/Math.min(rx,ry);
          const sw=(o.sweep||0)*(rnd()*.6+.7);
          put(aa+sw,1+L,1);
          if(t<k-1) put(aa+(.5/k)*(Math.PI*2/np),1-.02);
        }
      }
    }
    return path(pts,true);
  }
  /* tapered stroke along points: w0 at start, w1 at end. returns closed outline */
  function taper(p,w0,w1,round){
    const L=[],Rr=[],N=p.length;
    for(let i=0;i<N;i++){
      const a=p[Math.max(0,i-1)],b=p[Math.min(N-1,i+1)];
      let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
      const w=(w0+(w1-w0)*i/(N-1))/2;
      L.push([p[i][0]-dy*w,p[i][1]+dx*w]);Rr.push([p[i][0]+dy*w,p[i][1]-dx*w]);
    }
    const tip=p[N-1],base=p[0];
    const ring=L.concat(round===false?[]:[[tip[0]+(tip[0]-p[N-2][0])*.25,tip[1]+(tip[1]-p[N-2][1])*.25]]).concat(Rr.reverse());
    if(round!==false&&w0>2) ring.push([base[0]-(p[1][0]-base[0])*.15,base[1]-(p[1][1]-base[1])*.15]);
    return path(ring,true);
  }
  /* gradients */
  function rg(c,o){
    o=o||{};const cx=o.cx==null?.36:o.cx, cy=o.cy==null?.3:o.cy, hi=o.hi==null?.3:o.hi, sh=o.sh==null?.32:o.sh;
    const id='r'+c.slice(1)+'_'+Math.round(cx*100)+Math.round(cy*100)+Math.round(hi*100)+Math.round(sh*100);
    if(!defs.has(id)) defs.set(id,`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${o.r||.78}"><stop offset="0" stop-color="${lt(c,hi)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${dk(c,sh)}"/></radialGradient>`);
    return `url(#${id})`;
  }
  function lg(stops,o){
    o=o||{};const id='l'+stops.map(s=>s[1].slice(1)+Math.round(s[0]*100)).join('')+(o.h?'h':'v');
    if(!defs.has(id)) defs.set(id,`<linearGradient id="${id}" x1="0" y1="0" x2="${o.h?1:0}" y2="${o.h?0:1}">${stops.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"${s[2]!=null?` stop-opacity="${s[2]}"`:''}/>`).join('')}</linearGradient>`);
    return `url(#${id})`;
  }
  function def(id,s){if(!defs.has(id))defs.set(id,s)}
  const reset=()=>defs.clear();
  const out=()=>`<defs>${[...defs.values()].join('')}</defs>`;
  /* painted shape: gradient fill, soft warm outline, faint watercolour bleed */
  function fill(d,c,o){
    o=o||{};
    const f=o.flat?c:(o.grad||rg(c,o));
    const line=o.line===false?'':` stroke="${o.lc||dk(c,.58)}" stroke-width="${o.lw||1.15}" stroke-opacity="${o.lo==null?.75:o.lo}" stroke-linejoin="round"`;
    return `<path d="${d}" fill="${f}"${o.op!=null?` opacity="${o.op}"`:''}${line}/>`+(o.bleed===false?'':`<path d="${d}" fill="none" stroke="${dk(c,.3)}" stroke-width="2.4" stroke-opacity=".1" transform="translate(.7 .9)"/>`);
  }
  /* short hair strokes inside an ellipse, mostly flowing downward */
  function strokes(cx,cy,rx,ry,k,c,o){
    o=o||{};srand(cx*3+cy*5+k+(o.s||0));let d='';
    const ang=(o.ang==null?90:o.ang)*Math.PI/180, len=o.len||3.2;
    for(let i=0;i<k;i++){
      const a=rnd()*Math.PI*2, r=Math.sqrt(rnd())*.92;
      const x=cx+Math.cos(a)*rx*r, y=cy+Math.sin(a)*ry*r;
      const aa=ang+(rnd()-.5)*(o.spread||.9)+(o.radial?Math.atan2(y-cy,x-cx)-ang:0);
      const l=len*(.6+rnd()*.7);
      d+=`M${n(x)} ${n(y)}q${n(Math.cos(aa)*l*.5+(rnd()-.5))} ${n(Math.sin(aa)*l*.5)} ${n(Math.cos(aa)*l)} ${n(Math.sin(aa)*l)}`;
    }
    return `<path d="${d}" stroke="${c}" stroke-width="${o.w||.8}" fill="none" stroke-linecap="round" opacity="${o.op==null?.45:o.op}"/>`;
  }
  /* speckles / spots */
  function dots(cx,cy,rx,ry,k,c,r,o){
    o=o||{};srand(cx+cy*2+k*3+(o.s||0));let s='';
    for(let i=0;i<k;i++){const a=rnd()*Math.PI*2,q=Math.sqrt(rnd())*.9;s+=`<ellipse cx="${n(cx+Math.cos(a)*rx*q)}" cy="${n(cy+Math.sin(a)*ry*q)}" rx="${n(r*(.6+rnd()*.7))}" ry="${n(r*(.5+rnd()*.6))}" transform="rotate(${Math.round(rnd()*180)} ${n(cx+Math.cos(a)*rx*q)} ${n(cy+Math.sin(a)*ry*q)})"/>`}
    return `<g fill="${c}" opacity="${o.op==null?.9:o.op}">${s}</g>`;
  }
  const ell=(cx,cy,rx,ry)=>`M${n(cx-rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 0 ${n(rx*2)} 0a${n(rx)} ${n(ry)} 0 1 0 ${n(-rx*2)} 0Z`;
  const anim=(cls,ox,oy,inner,extra)=>`<g class="${cls}" style="transform-origin:${n(ox)}px ${n(oy)}px${extra||''}">${inner}</g>`;

  /* ---------- eyes ----------
     m: normal happy sad scared sick hungry dead peace angry grumpy dizzy sleepy
     o: {iris, pupil:'round'|'slit'|'bead'|'bar', lid (fur colour), side:-1|1, look:[dx,dy], cloudy, delay} */
  function eye(x,y,r,m,o){
    o=o||{};const ink='#2A1A14', lid=o.lid||'#C9935A', side=o.side||1;
    const L=(d,w,c)=>`<path d="${d}" stroke="${c||ink}" stroke-width="${n(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    if(m==='dead'){const k=r*.95;return L(`M${n(x-k)} ${n(y-k)}L${n(x+k)} ${n(y+k)}M${n(x+k)} ${n(y-k)}L${n(x-k)} ${n(y+k)}`,Math.max(1.3,r*.42))}
    if(m==='happy') return L(`M${n(x-r)} ${n(y+r*.35)}Q${n(x)} ${n(y-r*1.25)} ${n(x+r)} ${n(y+r*.35)}`,Math.max(1.2,r*.42));
    if(m==='peace'||m==='sleepy') return L(`M${n(x-r)} ${n(y)}Q${n(x)} ${n(y+r*.85)} ${n(x+r)} ${n(y)}`,Math.max(1.1,r*.36))+(m==='peace'?L(`M${n(x-r*.9)} ${n(y+r*.15)}l${n(-r*.35)} ${n(r*.25)}`,r*.2):'');
    if(m==='dizzy'){let d='';for(let t=0;t<=16;t++){const a=t*.75,rr=r*.08+r*.9*t/16;d+=(t?'L':'M')+n(x+Math.cos(a)*rr)+' '+n(y+Math.sin(a)*rr)}
      return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r*1.12)}" fill="#FBF6EE" stroke="${ink}" stroke-width="${n(r*.18)}"/>`+anim('a-spin',x,y,L(d,r*.26));}
    let big=1,pup=.5,white=!!o.white,ly=(o.look||[0,0])[1],lx=(o.look||[0,0])[0];
    if(m==='scared'){big=1.38;white=true;pup=.22}
    if(m==='hungry'){big=1.12;pup=.62;ly=-r*.22}
    if(m==='sad'){ly=r*.12}
    if(m==='angry'||m==='grumpy'){pup=.36}
    if(m==='grumpy') lx=side*r*.28;
    const R=r*big;let s='';
    s+=`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R*1.1)}" ry="${n(R*1.06)}" fill="${dk(lid,.62)}"/>`;
    if(white) s+=`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R)}" ry="${n(R*(m==='scared'?1.12:.96))}" fill="#FBF7F0"/>`;
    const ir=white?R*(m==='scared'?.42:.68):R*.97;
    if(o.pupil==='bead'&&!white){
      s+=`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R)}" ry="${n(R*.96)}" fill="${rg('#3A2A24',{cx:.4,cy:.35,hi:.12,sh:.6})}"/>`;
    } else {
      s+=`<ellipse cx="${n(x+lx)}" cy="${n(y+ly)}" rx="${n(ir)}" ry="${n(ir*.97)}" fill="${rg(o.iris||'#7A4A2A',{cx:.5,cy:.62,hi:.38,sh:.45})}"/>`;
      const pr=ir*pup*(o.pupil==='slit'?1:1);
      if(o.pupil==='slit') s+=`<ellipse cx="${n(x+lx)}" cy="${n(y+ly)}" rx="${n(m==='hungry'||m==='scared'?pr:pr*.32)}" ry="${n(ir*.86)}" fill="#120B08"/>`;
      else if(o.pupil==='bar') s+=`<ellipse cx="${n(x+lx)}" cy="${n(y+ly)}" rx="${n(ir*.7)}" ry="${n(pr*.45)}" fill="#120B08"/>`;
      else s+=`<circle cx="${n(x+lx)}" cy="${n(y+ly)}" r="${n(pr)}" fill="#120B08"/>`;
    }
    if(o.cloudy) s+=`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R*.9)}" ry="${n(R*.86)}" fill="#DCE6EC" opacity=".62"/>`;
    // catchlights
    const hl=m==='hungry'?1.35:1;
    s+=`<ellipse cx="${n(x-R*.34+lx*.5)}" cy="${n(y-R*.36+ly*.5)}" rx="${n(R*.3*hl)}" ry="${n(R*.26*hl)}" fill="#fff" opacity=".95"/><circle cx="${n(x+R*.34+lx*.5)}" cy="${n(y+R*.3+ly*.5)}" r="${n(R*.13*hl)}" fill="#fff" opacity=".85"/>`;
    if(m==='hungry') s+=`<circle cx="${n(x+R*.05)}" cy="${n(y-R*.5)}" r="${n(R*.12)}" fill="#fff"/>`;
    // eyelids by mood
    const lidP=(d)=>`<path d="${d}" fill="${lid}" stroke="${dk(lid,.6)}" stroke-width="${n(Math.max(.7,r*.16))}" stroke-linejoin="round"/>`;
    const top=y-R*1.25,X0=x-R*1.3,X1=x+R*1.3;
    if(m==='sick') s+=lidP(`M${n(X0)} ${n(top)}L${n(X1)} ${n(top)}L${n(X1)} ${n(y-R*.05)}Q${n(x)} ${n(y+R*.18)} ${n(X0)} ${n(y-R*.05)}Z`)+L(`M${n(x-R*.8)} ${n(y+R*1.25)}Q${n(x)} ${n(y+R*1.6)} ${n(x+R*.8)} ${n(y+R*1.25)}`,r*.18,'#8A6A7A');
    if(m==='grumpy') s+=lidP(`M${n(X0)} ${n(top)}L${n(X1)} ${n(top)}L${n(X1)} ${n(y-R*.1)}L${n(X0)} ${n(y-R*.1)}Z`);
    if(m==='angry'){const inn=x-side*R*1.3,outr=x+side*R*1.3;s+=lidP(`M${n(inn)} ${n(top)}L${n(outr)} ${n(top)}L${n(outr)} ${n(y-R*.85)}L${n(inn)} ${n(y+R*.05)}Z`)}
    if(m==='sad'){const inn=x-side*R*1.3,outr=x+side*R*1.3;s+=lidP(`M${n(inn)} ${n(top)}L${n(outr)} ${n(top)}L${n(outr)} ${n(y-R*.15)}L${n(inn)} ${n(y-R*.95)}Z`)+`<ellipse cx="${n(x)}" cy="${n(y+R*.78)}" rx="${n(R*.75)}" ry="${n(R*.22)}" fill="#BFE6FA" opacity=".85"/>`}
    // blink
    if(m!=='scared'&&m!=='sick'&&m!=='grumpy'&&m!=='angry'&&o.blink!==false)
      s+=`<g class="a-blink" style="transform-origin:${n(x)}px ${n(y-R*1.1)}px;animation-delay:${o.delay||0}s"><ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R*1.2)}" ry="${n(R*1.16)}" fill="${lid}"/><path d="M${n(x-R*1.1)} ${n(y+R*.3)}Q${n(x)} ${n(y+R*.95)} ${n(x+R*1.1)} ${n(y+R*.3)}" stroke="${dk(lid,.6)}" stroke-width="${n(Math.max(.7,r*.2))}" fill="none" stroke-linecap="round"/></g>`;
    return s;
  }
  /* cartoon brows, only when the mood needs them */
  function brows(m,x1,x2,y,r,c){
    const k=r*1.15, w=Math.max(1,r*.38);
    const B=(x,side)=>{
      let a,b;
      if(m==='sad'||m==='sick'||m==='hungry'){a=[x+side*k,y+r*.25];b=[x-side*k*.6,y-r*.55]}
      else if(m==='angry'){a=[x+side*k,y-r*.55];b=[x-side*k*.6,y+r*.35]}
      else if(m==='scared'){a=[x+side*k,y-r*.25];b=[x-side*k*.5,y-r*.75]}
      else if(m==='grumpy'){a=[x+side*k,y+r*.05];b=[x-side*k*.7,y+r*.15]}
      else return '';
      return `<path d="M${n(a[0])} ${n(a[1])}Q${n((a[0]+b[0])/2)} ${n((a[1]+b[1])/2-r*.3)} ${n(b[0])} ${n(b[1])}" stroke="${c||'#3A2418'}" stroke-width="${n(w)}" fill="none" stroke-linecap="round"/>`;
    };
    if(m==='scared') y-=r*.6;
    return (x1==null?'':B(x1,-1))+B(x2,1);
  }
  /* mouths. kind: dog cat rodent beak fish reptile bug */
  function mouth(x,y,s,m,kind,o){
    o=o||{};const ink='#3A2018';
    const L=(d,w)=>`<path d="${d}" stroke="${ink}" stroke-width="${n(w||1.1*s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const open=(w,h,tongue)=>`<path d="M${n(x-w)} ${n(y)}Q${n(x)} ${n(y-h*.25)} ${n(x+w)} ${n(y)}Q${n(x+w*.7)} ${n(y+h)} ${n(x)} ${n(y+h)}Q${n(x-w*.7)} ${n(y+h)} ${n(x-w)} ${n(y)}Z" fill="#6E2A2A" stroke="${ink}" stroke-width="${n(.9*s)}" stroke-linejoin="round"/>`+(tongue?`<ellipse cx="${n(x)}" cy="${n(y+h*.72)}" rx="${n(w*.55)}" ry="${n(h*.32)}" fill="#E8828C"/>`:'');
    const tongueOut=(len,cls)=>anim(cls||'',x,y+s*.6,`<path d="M${n(x-2.4*s)} ${n(y+s*.4)}Q${n(x-2.6*s)} ${n(y+len*s)} ${n(x)} ${n(y+len*s)}Q${n(x+2.6*s)} ${n(y+len*s)} ${n(x+2.4*s)} ${n(y+s*.4)}Z" fill="#E87A86" stroke="#A9424E" stroke-width="${n(.7*s)}"/><path d="M${n(x)} ${n(y+s)}L${n(x)} ${n(y+(len-1.4)*s)}" stroke="#C9566A" stroke-width="${n(.6*s)}"/>`);
    if(kind==='beak') return '';
    if(kind==='fish'){
      if(m==='dead') return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(1.6*s)}" ry="${n(2.2*s)}" fill="#5A2424"/>`;
      if(m==='happy') return L(`M${n(x-3*s)} ${n(y-1*s)}Q${n(x-1*s)} ${n(y+2.2*s)} ${n(x+1*s)} ${n(y-.4*s)}`);
      if(m==='scared'||m==='hungry') return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(1.8*s)}" ry="${n(2.4*s)}" fill="#6E2A2A" stroke="${ink}" stroke-width="${n(.6*s)}"/>`;
      if(m==='sad'||m==='sick'||m==='grumpy') return L(`M${n(x-3*s)} ${n(y+1*s)}Q${n(x-1*s)} ${n(y-1.6*s)} ${n(x+.6*s)} ${n(y+.4*s)}`);
      return anim('a-gulp',x,y,`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(1.1*s)}" ry="${n(1.5*s)}" fill="#7A3030"/>`);
    }
    const w=(kind==='reptile'?5:kind==='rodent'?1.6:kind==='bug'?1.6:3)*s;
    switch(m){
      case 'dead': return L(`M${n(x-w)} ${n(y+.5*s)}L${n(x+w)} ${n(y+.5*s)}`)+(kind==='bug'||kind==='reptile'?'':tongueOut(5.5));
      case 'happy': case 'peace':
        if(kind==='reptile') return L(`M${n(x-w)} ${n(y-1*s)}Q${n(x)} ${n(y+3.4*s)} ${n(x+w)} ${n(y-1*s)}`,1.2*s);
        if(m==='peace') return L(`M${n(x-w)} ${n(y)}Q${n(x-w/2)} ${n(y+1.6*s)} ${n(x)} ${n(y)}Q${n(x+w/2)} ${n(y+1.6*s)} ${n(x+w)} ${n(y)}`);
        return open(w,(kind==='rodent'?2.6:4.6)*s,true)+(o.pant?tongueOut(6.5,'a-pant'):'');
      case 'sad': case 'sick': return L(`M${n(x-w)} ${n(y+1.6*s)}Q${n(x)} ${n(y-1.4*s)} ${n(x+w)} ${n(y+1.6*s)}`)+(m==='sick'?'':'');
      case 'scared': return `<ellipse cx="${n(x)}" cy="${n(y+1.8*s)}" rx="${n(w*.62)}" ry="${n(2.6*s)}" fill="#6E2A2A" stroke="${ink}" stroke-width="${n(.9*s)}"/><path d="M${n(x-w*.5)} ${n(y+.4*s)}l${n(w*.25)} ${n(1.1*s)}l${n(w*.25)} ${n(-1.1*s)}l${n(w*.25)} ${n(1.1*s)}l${n(w*.25)} ${n(-1.1*s)}" fill="#fff" stroke="none"/>`;
      case 'hungry': return open(w*.8,3.2*s,true)+anim('a-drool',x+w*.5,y+2*s,`<path d="M${n(x+w*.5)} ${n(y+2*s)}q${n(-.9*s)} ${n(3.2*s)} 0 ${n(4.6*s)}q${n(.9*s)} ${n(-1.4*s)} 0 ${n(-4.6*s)}Z" fill="#BFE6FA" stroke="#7FB4CF" stroke-width=".5"/>`);
      case 'angry': return `<path d="M${n(x-w)} ${n(y+.4*s)}L${n(x+w)} ${n(y+.4*s)}L${n(x+w*.8)} ${n(y+2.6*s)}L${n(x-w*.8)} ${n(y+2.6*s)}Z" fill="#fff" stroke="${ink}" stroke-width="${n(.9*s)}" stroke-linejoin="round"/><path d="M${n(x-w*.4)} ${n(y+.4*s)}L${n(x-w*.4)} ${n(y+2.6*s)}M${n(x)} ${n(y+.4*s)}L${n(x)} ${n(y+2.6*s)}M${n(x+w*.4)} ${n(y+.4*s)}L${n(x+w*.4)} ${n(y+2.6*s)}" stroke="${ink}" stroke-width="${n(.5*s)}"/>`;
      case 'grumpy': return L(`M${n(x-w)} ${n(y+1.2*s)}L${n(x+w*.4)} ${n(y+.6*s)}Q${n(x+w*.8)} ${n(y+.4*s)} ${n(x+w)} ${n(y+1.3*s)}`);
      case 'dizzy': return L(`M${n(x-w)} ${n(y+1*s)}q${n(w/3)} ${n(-1.6*s)} ${n(w*2/3)} 0t${n(w*2/3)} 0t${n(w*2/3)} 0`);
      default:
        if(kind==='cat'||kind==='rodent') return L(`M${n(x-w*.9)} ${n(y)}Q${n(x-w*.45)} ${n(y+1.8*s)} ${n(x)} ${n(y)}Q${n(x+w*.45)} ${n(y+1.8*s)} ${n(x+w*.9)} ${n(y)}`,.95*s);
        if(kind==='reptile') return L(`M${n(x-w)} ${n(y-.6*s)}Q${n(x)} ${n(y+2.2*s)} ${n(x+w)} ${n(y-.6*s)}`,1.1*s);
        if(kind==='bug') return '';
        return L(`M${n(x-w)} ${n(y-.2*s)}Q${n(x-w/2)} ${n(y+2*s)} ${n(x)} ${n(y)}Q${n(x+w/2)} ${n(y+2*s)} ${n(x+w)} ${n(y-.2*s)}`)+(o.pant?tongueOut(5,'a-pant'):'');
    }
  }
  const blush=(x,y,r,op)=>`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r*.6)}" fill="#F27A8A" opacity="${op||.35}"/>`;
  return {n,mix,lt,dk,grey,srand,rnd,path,blob,taper,rg,lg,def,reset,out,fill,strokes,dots,ell,anim,eye,brows,mouth,blush};
})();
