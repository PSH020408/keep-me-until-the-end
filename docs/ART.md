# Art pipeline (v0.24)

All pictures in the game are paintings generated as GPT image sheets and single pictures
(339 PNG, about 730 MB) from the asset list, then cut and converted to WebP by
`tools/import_assets.py`. The originals live in `art_raw/` on the author's machine and are not in
git; only the WebP in `public/img/` are.

## Folders

| Source (`art_raw/`) | Output (`public/img/`) | What | How it is used |
|---|---|---|---|
| `01_fish/<id>/parts.png` | `fish/<id>/body, tail, dorsal, pect, pelvic, head.webp`, `swim.webp` | 3 × 2 parts sheet per species | rigged fish (layers move), `swim.webp` for tankmates, the slot reel and the gallery |
| `01_fish/<id>/poses.png` | `fish/<id>/p-<pose>.webp` | 4 × 3 pose sheet: front, three, flop, jump, mouth, proud, charge, dizzy, deadside, thin, bent, frozen | event poses and dead bodies |
| `02_bg/` | `bg/` | 34 places | where the fish is (river, farm, shop, home, pond, …) |
| `07_ending/` | `end/` | 35 ending places, no fish in them | death scenes, with the fish's dead pose placed on top |
| `08_glory/` | `glory/`, `ui/title-frame.webp` | the four absurd endings, twelve happy endings, title backgrounds | glory endings, the title screen |
| `09_career/` | `career/` | training ×8, bond ×12, goals ×6, contests ×5, rest, river training, legacy | 육성 lines |
| `13_gag/` | `gag/` | sixteen family gags (space left lower right for the fish) | `GAG-01…16` |
| `12_mob/` | `mob/` | 수선조 / 폭주어단 scenes and accessories, three tank bullies | `MOB-*` |
| `03_owner/` | `owner/` | 22 owner kinds × normal / smile / panic | owner cut-ins and the owner card |
| `04_animal/`, `05_hand/`, `06_prop/` | `animal/`, `hand/`, `prop/` | cats, birds, otters, predators; six hands; 24 props | per-line direction (`js/dir.js`) |
| `10_skill/`, `11_sick/` | `skill/01…19`, `sick/01…12` | icon and overlay sheets | skill tags, disease overlays on the body |
| `14_ui/` | `ui/` | subtitle card, record card, VS frame, shock lines | result screen, duels |

## Re-running

```bash
python3 tools/import_assets.py art_raw --only=fish --sp=guppy,betta   # some species (also rewrites js/data/rig.js)
python3 tools/import_assets.py art_raw --only=bg --dir=02_bg          # one painting folder
python3 tools/import_assets.py art_raw --only=cut                     # owners, animals, hands, props, accessories, UI
python3 tools/import_assets.py art_raw --only=icons --force            # skill icons and disease overlays
```

Existing outputs are kept unless `--force` is given (fish are always rewritten). Needs Python
with Pillow, NumPy and OpenCV.

## The rig

`tools/cells.py` cuts a sheet by connected components (blobs in reading order, not a fixed grid:
long bodies cross grid lines). `tools/rig.py` assembles a fish: the tail's stub is matched to the
body's rear socket in height and position; dorsal, pectoral and pelvic fins are scaled to a share of
the body's height and placed along it. Corrections per species are in
`tools/rig_overrides.json` (`dr`/`pr`/`vr` fin size, `dx`/`px`/`vx` position along the body,
`dsink`/`vsink` depth, `plug` for a body drawn without a head). In the browser each layer turns
around its own joint (`css/stage.css`); swimming speed sets the beat.

## Rules for new pictures

Same style as the rest (soft watercolour, left-top light, no outlines), fish and animals facing
left, transparent background for cut-outs, no blood (the story tells it; the picture implies it),
no names or characters from existing works.
