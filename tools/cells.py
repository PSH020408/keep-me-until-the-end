import numpy as np, cv2
from PIL import Image
def cut_cells(im, cols, rows, pad=6, count=None, gap=.1):
    """Cut the `count` (default cols*rows) largest blobs of a sheet and return them in reading order.
    Rows are found by clustering blob centres vertically (GPT does not always keep to the grid);
    small specks (splashes, stars) join the nearest big blob when they sit near its box."""
    a=np.array(im.convert('RGBA')); A=a[:,:,3]; H,W=A.shape
    m=cv2.dilate((A>24).astype(np.uint8),np.ones((7,7),np.uint8))
    n,lab,st,cen=cv2.connectedComponentsWithStats(m,8)
    comps=sorted([i for i in range(1,n) if st[i,cv2.CC_STAT_AREA]>W*H*.00005],key=lambda i:-st[i,cv2.CC_STAT_AREA])
    K=count or cols*rows
    big=comps[:K]; small=comps[K:]
    # drop "big" blobs that are tiny compared with the median (sheet had fewer drawings than cells)
    if big:
        med=np.median([st[i,cv2.CC_STAT_AREA] for i in big]); big=[i for i in big if st[i,cv2.CC_STAT_AREA]>med*.08]
    grp={b:[b] for b in big}
    for i in small:
        b=min(big,key=lambda b:(cen[b][0]-cen[i][0])**2+(cen[b][1]-cen[i][1])**2)
        x,y,w,h=st[b,0],st[b,1],st[b,2],st[b,3]
        if x-w*.3<cen[i][0]<x+w*1.3 and y-h*.4<cen[i][1]<y+h*1.4: grp[b].append(i)
    # reading order
    by=sorted(big,key=lambda i:cen[i][1]); rowsL=[]
    for i in by:
        if rowsL and cen[i][1]-np.mean([cen[j][1] for j in rowsL[-1]])<H*gap: rowsL[-1].append(i)
        else: rowsL.append([i])
    order=[i for r in rowsL for i in sorted(r,key=lambda i:cen[i][0])]
    out=[]
    for b in order:
        keep=grp[b]; mask=np.isin(lab,keep); ys,xs=np.where(mask)
        x0,x1,y0,y1=max(0,xs.min()-pad),min(W,xs.max()+pad+1),max(0,ys.min()-pad),min(H,ys.max()+pad+1)
        crop=a[y0:y1,x0:x1].copy(); crop[:,:,3]=np.where(mask[y0:y1,x0:x1],crop[:,:,3],0)
        out.append(Image.fromarray(crop))
    return out+[None]*(K-len(out))
