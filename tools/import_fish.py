"""Cut a Gemini fish sheet into poses, remove the white background and save WebP sprites.

Usage: python3 tools/import_fish.py <sheet.png> <species-id> <out-dir> [flip-list]
Figures are read in reading order (top row left to right, then the next row), matching the
prompt: swim, young, sick, dead, and puff for the two pufferfish.
flip-list: comma-separated pose indexes (0-based) that face right and must be mirrored,
or 'all'. Every sprite is saved facing LEFT.
The alpha is the union of the rembg mask and a soft "not white" mask, so white bodies
(tancho, koi) survive rembg and pale fins keep their translucency.
Needs: pillow numpy scipy rembg onnxruntime
"""
import sys, json, numpy as np
from PIL import Image, ImageOps
from scipy import ndimage
from rembg import remove, new_session

POSES = ['swim', 'young', 'sick', 'dead', 'puff']

def figures(a, dil):
    ink = (255 - a.min(axis=2)) > 18
    ink = ndimage.binary_dilation(ink, iterations=dil)
    lab, n = ndimage.label(ink)
    H, W = ink.shape
    parts = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        area = (lab[sl] == i + 1).sum()
        if area < H * W * 0.004: continue
        parts.append(dict(box=(sl[1].start, sl[0].start, sl[1].stop, sl[0].stop), area=area, lab=i + 1))
    # reading order: group into rows by vertical centre
    parts.sort(key=lambda p: (p['box'][1] + p['box'][3]) / 2)
    rows = []
    for p in parts:
        cy = (p['box'][1] + p['box'][3]) / 2
        if rows and abs(cy - rows[-1][0]) < H * 0.18: rows[-1][1].append(p)
        else: rows.append([cy, [p]])
    out = []
    for _, r in rows: out += sorted(r, key=lambda p: p['box'][0])
    return out, lab

def cut(path, sid, out, session, flips='', dil=6):
    im = Image.open(path).convert('RGB'); a = np.asarray(im).astype(int)
    parts, lab = figures(a, dil)
    H, W = a.shape[:2]
    flip = set(range(len(parts))) if flips == 'all' else {int(x) for x in flips.split(',') if x != ''}
    meta = {}
    for idx, p in enumerate(parts[:5]):
        name = POSES[idx]
        x0, y0, x1, y1 = p['box']; pad = 8
        box = (max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad))
        crop = im.crop(box)
        rgba = remove(crop, session=session)
        al = np.asarray(rgba.getchannel('A')).astype(float)
        c = np.asarray(crop).astype(float)
        soft = np.clip(((255 - c.min(axis=2)) - 10) / 45, 0, 1) * 255
        own = lab[box[1]:box[3], box[0]:box[2]] == p['lab']
        soft[~own] = 0
        al = np.maximum(al, soft)
        core, k = ndimage.label(al > 110)
        if k > 1:
            sizes = ndimage.sum(np.ones_like(al), core, range(1, k + 1))
            keep = np.isin(core, [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * .03])
            keep = ndimage.binary_dilation(keep, iterations=4)
            al[~keep] = 0
        al[al < 30] = 0
        rgba = Image.merge('RGBA', (*crop.split(), Image.fromarray(al.astype(np.uint8))))
        bb = Image.fromarray(al.astype(np.uint8)).point(lambda v: 255 if v > 100 else 0).getbbox()
        rgba = rgba.crop(bb)
        if idx in flip: rgba = ImageOps.mirror(rgba)
        k = 420 / max(rgba.width, rgba.height * 1.2)
        rgba = rgba.resize((max(1, round(rgba.width * k)), max(1, round(rgba.height * k))), Image.LANCZOS)
        rgba.save(f'{out}/{sid}-{name}.webp', 'WEBP', quality=84, method=6)
        meta[name] = dict(w=rgba.width, h=rgba.height, src=[x1 - x0, y1 - y0])
    return meta

if __name__ == '__main__':
    s = new_session('isnet-general-use')
    print(json.dumps(cut(sys.argv[1], sys.argv[2], sys.argv[3], s, sys.argv[4] if len(sys.argv) > 4 else '')))
