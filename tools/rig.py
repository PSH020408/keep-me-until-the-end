import sys,json,numpy as np
from PIL import Image
sys.path.insert(0,__file__.rsplit('/',1)[0]); from cells import cut_cells
def colspan(A,x,th=60):
    ys=np.where(A[:,x]>th)[0]; return (ys.min(),ys.max()) if len(ys) else None
def rowspan(A,y,th=60):
    xs=np.where(A[y,:]>th)[0]; return (xs.min(),xs.max()) if len(xs) else None
def rig(parts, ov=None):
    ov=ov or {}
    body,tail,dors,pect,pelv,head=parts
    B=np.array(body)[:,:,3]; H,W=B.shape
    # body: rear socket = right-most columns
    xr=max(x for x in range(W) if B[:,x].max()>60)
    xl=min(x for x in range(W) if B[:,x].max()>60)
    L=xr-xl
    soc=[colspan(B,x) for x in range(xr-int(L*.03),xr+1)]; soc=[s for s in soc if s]
    sy=np.mean([ (a+b)/2 for a,b in soc]); sh=np.mean([b-a for a,b in soc])
    T=np.array(tail)[:,:,3]; tw=T.shape[1]
    tl=min(x for x in range(tw) if T[:,x].max()>60)
    stub=[colspan(T,x) for x in range(tl,tl+max(3,int(tw*.04)))]; stub=[s for s in stub if s]
    ty=np.mean([(a+b)/2 for a,b in stub]); th=np.mean([b-a for a,b in stub])
    ts=ov.get('ts', float(np.clip(sh/max(th,1),.6,1.6)))
    spans=[colspan(B,x) for x in range(xl,xr,4)]; Bh=max(b-a for a,b in [s for s in spans if s])
    lead=[colspan(B,x) for x in range(xl,xl+max(3,int(L*.02)))]; lead=[s for s in lead if s]
    headless=ov.get('headless',np.mean([b-a for a,b in lead])>Bh*.45)
    def at(fx,top=True):
        x=int(xl+L*fx); s=colspan(B,x); return x,(s[0] if top else s[1]) if s else H/2
    P={}
    P['tail']=dict(x=xr-sh*ov.get('tov',.35)-tl*ts, y=sy-ty*ts, s=ts, px=tl, py=ty)   # pivot in part px
    D=np.array(dors)[:,:,3]; dh,dw=D.shape
    dx0=min(x for x in range(dw) if D[:,x].max()>60)
    base_y=max(y for y in range(dh) if D[y,:].max()>60)
    ds=ov.get('ds',Bh*ov.get('dr',.5)/max(dh,1)); fx=ov.get('dx',.36)
    x,ytop=at(fx,True)
    P['dorsal']=dict(x=x-dx0*ds, y=ytop-base_y*ds+dh*ds*ov.get('dsink',.18), s=ds, px=dx0, py=base_y)
    Pa=np.array(pect)[:,:,3]; ph,pw=Pa.shape
    px0=min(x for x in range(pw) if Pa[:,x].max()>60); ps_=colspan(Pa,px0+2) or (0,ph); py0=(ps_[0]+ps_[1])/2
    ps=ov.get('ps',Bh*ov.get('pr',.42)/max(max(ph,pw),1)); x,yt=at(ov.get('px',.28),True); _,yb=at(ov.get('px',.28),False)
    P['pect']=dict(x=x-px0*ps, y=yt+(yb-yt)*ov.get('py',.62)-py0*ps, s=ps, px=px0, py=py0)
    V=np.array(pelv)[:,:,3]; vh,vw=V.shape
    vy0=min(y for y in range(vh) if V[y,:].max()>60); vr=rowspan(V,vy0+2) or (0,vw); vx0=vr[0]
    vs=ov.get('vs',Bh*ov.get('vr',.5)/max(max(vh,vw),1)); x,yb=at(ov.get('vx',.42),False)
    P['pelvic']=dict(x=x-vx0*vs, y=yb-vh*vs*ov.get('vsink',.22)-vy0*vs*0, s=vs, px=vx0, py=vy0)
    # closed-eye head over the head
    Hh=np.array(head)[:,:,3]; hh,hw=Hh.shape
    if headless:
        fy=np.mean([(a+b)/2 for a,b in lead]); fh=np.mean([b-a for a,b in lead])
        hr=max(x for x in range(hw) if Hh[:,x].max()>60)
        hst=[colspan(Hh,x) for x in range(hr-max(3,int(hw*.05)),hr+1)]; hst=[q for q in hst if q]
        hy=np.mean([(a+b)/2 for a,b in hst]); hsh=np.mean([b-a for a,b in hst])
        hs=ov.get('hs',fh/max(hsh,1)*1.03)
        P['head']=dict(x=xl+fh*.12-hr*hs, y=fy-hy*hs, s=hs)
    else:
        x18=int(xl+L*.16); s=colspan(B,x18); hs=ov.get('hs',(s[1]-s[0])/hh*1.02 if s else 1)
        P['head']=dict(x=xl-ov.get('hx',0)*L, y=(s[0]+s[1])/2-hh*hs/2 if s else 0, s=hs)
    P['body']=dict(x=0,y=0,s=1,headless=bool(headless),L=int(L),Bh=int(Bh))
    return P
def compose(parts,P,order=('tail','pelvic','dorsal','body','pect'),blink=False):
    imgs=dict(zip(('body','tail','dorsal','pect','pelvic','head'),parts))
    xs=[];ys=[]
    for k,p in P.items():
        im=imgs[k]; xs+= [p['x'],p['x']+im.width*p['s']]; ys+=[p['y'],p['y']+im.height*p['s']]
    ox,oy=-min(xs),-min(ys); W=int(max(xs)+ox)+2; H=int(max(ys)+oy)+2
    can=Image.new('RGBA',(W,H),(0,0,0,0))
    for k in order+(('head',) if blink else ()):
        p=P[k]; im=imgs[k]
        if p['s']!=1: im=im.resize((max(1,int(im.width*p['s'])),max(1,int(im.height*p['s']))),Image.LANCZOS)
        layer=Image.new('RGBA',(W,H),(0,0,0,0)); layer.paste(im,(int(p['x']+ox),int(p['y']+oy))); can=Image.alpha_composite(can,layer)
    return can,(ox,oy)

def open_eye(head):
    """Paint an open eye over a closed-eye head (for bodies drawn without a head)."""
    import numpy as np
    from PIL import ImageDraw,ImageFilter
    a=np.array(head).astype(float); A=a[:,:,3]; lum=a[:,:,:3].mean(2)
    h,w=A.shape; m=(A>200)&(lum<70)
    m[:, :int(w*.2)]=False; m[:, int(w*.75):]=False; m[:int(h*.15)]=False; m[int(h*.7):]=False
    ys,xs=np.where(m)
    if len(xs)<10: return head
    cx,cy=xs.mean(),ys.mean()-(xs.max()-xs.min())*.1; r=(xs.max()-xs.min())*.2
    im=head.copy(); d=ImageDraw.Draw(im)
    d.ellipse([cx-r*1.08,cy-r*1.08,cx+r*1.08,cy+r*1.08],fill=(200,205,215,255))
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(150,120,70,255))
    d.ellipse([cx-r*.66,cy-r*.66,cx+r*.66,cy+r*.66],fill=(18,14,12,255))
    d.ellipse([cx-r*.5-r*.1,cy-r*.55,cx-r*.1+r*.05,cy-r*.12],fill=(255,255,255,235))
    return im

def plug_head(parts,ov):
    """Body drawn without a head (a cut socket at the front) and a head with a cut socket at the back:
    trim both caps and bake the head (eye opened) onto the body, so the rest of the rig sees a whole body."""
    import numpy as np
    from PIL import Image
    body,head=parts[0],parts[5]
    B=np.array(body).copy(); A=B[:,:,3]; H,W=A.shape
    xl=min(x for x in range(W) if A[:,x].max()>60); xr=max(x for x in range(W) if A[:,x].max()>60)
    cut=xl+int((xr-xl)*ov.get('bcap',.05)); B[:,:cut,3]=0
    Hd=np.array(head).copy(); hA=Hd[:,:,3]; hh,hw=hA.shape
    hr=max(x for x in range(hw) if hA[:,x].max()>60); hc=hr-int(hw*ov.get('hcap',.14)); Hd[:,hc:,3]=0
    fw=int(hw*.1)
    for i in range(fw): Hd[:,hc-fw+i,3]=(Hd[:,hc-fw+i,3]*(1-(i+1)/(fw+1))).astype(np.uint8)
    hs=ov.get('hs',.8)
    hi=open_eye(Image.fromarray(Hd)); hi=hi.resize((int(hw*hs),int(hh*hs)),Image.LANCZOS)
    cols=[np.where(A[:,x]>60)[0] for x in range(cut,cut+6)]; cy=np.mean([c.mean() for c in cols if len(c)])
    hcy=np.mean(np.where(hA[:,:hc]>60)[0])*hs
    ox=int(hc*hs)-int(hw*hs*.12); w2=W+ox; can=Image.new('RGBA',(w2-cut+ox,max(H,int(hh*hs))+40),(0,0,0,0))
    can=Image.new('RGBA',(W+ox,H+int(hh*hs)),(0,0,0,0)); dy=int(hh*hs/2)
    can.alpha_composite(Image.fromarray(B),(ox-cut,dy))
    can.alpha_composite(hi,(0,int(dy+cy-hcy)))
    bb=can.getbbox(); parts[0]=can.crop(bb)
    return parts
