"""Cut a Gemini character sheet into poses, remove the background and save WebP sprites.

Usage: python3 tools/import_art.py <sheet.png> <species-id> public/img/pets
After cutting, mark eyes and nose for sit / puppy / tired in js/art/raster.js.
If two figures touch (adult and puppy), split them with a watershed as done for the retriever.
Poses are recognised by shape: tall figures are sit (largest) and puppy (next),
wide figures are lie (upper one, eyes closed) and tired (lower one).
Needs: pillow numpy scipy rembg onnxruntime
"""
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage
from rembg import remove, new_session

DIL = 5
def cut(path, sid, out, session, dil=None):
    global DIL
    if dil: DIL = dil
    im = Image.open(path).convert('RGB'); a = np.asarray(im).astype(int)
    ink = (255 - a.min(axis=2)) > 22
    ink = ndimage.binary_dilation(ink, iterations=DIL)
    lab, n = ndimage.label(ink)
    objs = ndimage.find_objects(lab)
    H, W = ink.shape; parts = []
    for i, sl in enumerate(objs):
        area = (lab[sl] == i + 1).sum()
        if area < H * W * 0.015: continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        parts.append(dict(box=(x0, y0, x1, y1), area=area, w=x1 - x0, h=y1 - y0))
    tall = sorted([p for p in parts if p['h'] / p['w'] > .85], key=lambda p: -p['area'])
    wide = sorted([p for p in parts if p['h'] / p['w'] <= .85], key=lambda p: p['box'][1])
    poses = {}
    if tall: poses['sit'] = tall[0]
    if len(tall) > 1: poses['puppy'] = tall[1]
    if wide: poses['lie'] = wide[0]
    if len(wide) > 1: poses['tired'] = wide[1]
    meta = {}
    for name, p in poses.items():
        x0, y0, x1, y1 = p['box']; pad = 6
        crop = im.crop((max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)))
        rgba = remove(crop, session=session)
        al = np.asarray(rgba.getchannel('A')).copy()
        core, k = ndimage.label(al > 120)
        if k > 1:  # keep the figure, drop shadows and specks
            sizes = ndimage.sum(np.ones_like(al), core, range(1, k + 1))
            keep = np.isin(core, [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * .04])
            keep = ndimage.binary_dilation(keep, iterations=3)
            al[~keep] = 0
        al[al < 40] = 0
        rgba.putalpha(Image.fromarray(al))
        bb = Image.fromarray(al).point(lambda v: 255 if v > 120 else 0).getbbox()
        rgba = rgba.crop(bb)
        target = 420 if name in ('sit', 'puppy') else 300
        k = target / rgba.height
        rgba = rgba.resize((max(1, round(rgba.width * k)), target), Image.LANCZOS)
        fn = f'{sid}-{name}.webp'
        rgba.save(f'{out}/{fn}', 'WEBP', quality=84, method=6)
        meta[name] = dict(w=rgba.width, h=rgba.height)
    return meta

if __name__ == '__main__':
    s = new_session('isnet-general-use')
    print(json.dumps(cut(sys.argv[1], sys.argv[2], sys.argv[3], s)))
