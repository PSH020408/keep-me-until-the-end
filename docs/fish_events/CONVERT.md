# Converting the event catalogue into game data

Repo root: `/tmp/claude-0/-home-claude/b3cf8e0e-e65a-54dd-8d9e-16a0bf1c19e6/scratchpad/repo`
Catalogue (Markdown, source of truth for content): `/tmp/claude-0/-home-claude/b3cf8e0e-e65a-54dd-8d9e-16a0bf1c19e6/scratchpad/events/0X_*.md`
Design rules: `/tmp/claude-0/-home-claude/b3cf8e0e-e65a-54dd-8d9e-16a0bf1c19e6/scratchpad/FISH_REWORK.md` (read §0 principles, §1 caps & sentence rules, §9 decisions log, §10 truth tiers).

Read these engine files before writing anything:
- `public/js/data/fev.js` — the event layer (API below is a summary of it)
- `public/js/data/fev_core.js` — three worked examples; copy their style exactly
- skim `public/js/fish.js` (FEND endings, fRelease, fCr, fSick) and `public/js/data/fish.js` (FX species data: cm, minL, temp, jump, escape, hardy…; DZ diseases)

## Your output
One file: `public/js/data/fev_<area>.js` (name given in your task). Plain browser JS, no modules, no imports.
**All files share one global scope.** Every top-level `const`/`let`/`function` you declare must start with your file prefix (e.g. `org_`, `trd_`, `hom_`, `hlt_`, `mat_`, `owa_`, `owb_`, `wld_`). Never redeclare an existing name. Do not edit any other file.

## API

```js
fev([ {event}, … ]);          // register events
fevEnd({ 'ID': {ending}, … }); // register endings
```

### Event
| field | meaning |
|---|---|
| `id` | catalogue id, e.g. `'HOM-07'` (keep the EV-xxx-NN number; drop "EV-") |
| `stage` | `'origin'` (wild capture / farm sorting, before any owner) · `'trade'` (holding, export, air cargo, wholesale, transport) · `'shop'` (shop/mart/fair tanks) · `'home'` (with an owner) · `'wild'` (released/escaped in Korea). Pre-owner stages only appear at the prologue's moments: origin ↔ net (wild fish) or sieve (farm fish); trade ↔ box; shop ↔ shop tank. Use `when:()=>fl('wild')` / `!fl('wild')` to split wild-caught vs farm. |
| `tier` | `'fact'` 📌 (really happens + mechanism verified — must carry a `[출처]` note in a comment) · `'likely'` 🔸 (mechanism real, scene invented) · `'story'` 🎭 (black comedy; happy endings mostly). `big:1` = big comedy, only on 쉬움. |
| `sp` | species filter: array of ids and/or groups: `['betta','@gold']`. Groups: gold koi livebearer small labyrinth airbreather bottom scaleless predator big jumper escaper puffer brackish longfin schooling coldok tropical. Omit = all 23. `notSp` excludes. |
| `own` | owner kinds that can see it (22 kinds: expert learner eager casual gift breeder content mill cult neglect alchemist techbro relay release shared decor unbox staff bait touch grandma breakup). Omit = any owner. Signature events of a kind: set `own` and `w:3`–`6`. |
| `need` | flag requirements `{lid:0, season:'winter', pond:0}`; value may be an array (any of) or a function `v=>v>=2`. |
| `when` | extra condition `()=>bool` |
| `w` | weight (number or function), default 1 |
| `once` | 1 = at most once per life |
| `cd` | cooldown in ticks before it can repeat (default 40; a life is ~110 ticks) |
| `log` | a line written to the log before the choice (optional) |
| `p` | the prompt (what the fish senses), ends with `{n}은…` |
| `o` | options (array). **At least one option without `chk`** — the passive one every species can take. |
| `auto` | outcome used when there are no options (an event that just happens) |

### Option
`{l:'what the fish does', chk:['w',40], ok:OUT, no:OUT}`
- `chk:[stat, need]` — stat `p` 힘 · `g` 근성 · `w` 지능 · `c` 매력. Hidden check: chance = (stat/need)², clamped 5–95%. If `need` is above the species cap (FCAP in fev.js) the option is shown greyed with "{n}의 몸으로는 할 수 없다". Choose needs so that the cap table produces the species differences the catalogue describes (e.g. need p 45 locks neon/guppy/peapuffer…). `chk` may be a function returning `[k,n]` or `null` (no check for this species).
- `ok` / `no` — outcome on success / failure. Without `chk`, only `ok` is used.
- `when:()=>bool` — option only shown when true. `lockText` overrides the greyed note.
- Option labels and `d` never show stats or results.

### Outcome (OUT)
An object, a function returning one (for species differences), or a weighted list `[[weight, OUT], …]`.
```js
{t:'log line', c:'good'|'bad'|'sub', fx:{h:-10, st:.1, wq:-5, i:.05, fin:.1, fat:.2, p:2, g:2, w:2, c:2},
 set:{flag:value}, add:{flag:1}, sick:'ich', pl:[[promiseIndex,'note']], mem:'memory line (fish point of view, short)',
 near:'lid', run:()=>{…}, end:'ENDING-ID'}
```
- `fx` numbers: h health (0–100), st stress (0–1.2), wq water quality (0–100), i owner interest (0–1), fin fin damage (>1.1 kills), stat deltas.
- `sick`: DZ ids `ich velvet columnaris aero finrot fungus tb hex tetra neond khv cyhv2 irido swimb skinny worms`.
- `pl`: break a promise on the pledge sheet. Index 0 끝까지 함께 · 1 아프면 치료 · 2 수조·물·먹이 · 3 탈출·사고 · 4 번식 · 5 자연에 풀어놓지 않음.
- `near:'key'` — a near miss; the owner may learn depending on kind. Keys: `lid heater_cover heater intake_guard dechlor cycle net qt label mates hides`.
- `run` for anything else: `fCr('jump')` (existing crisis), `fEnd('cat')` (existing ending key in FEND), `fRelease()` (owner releases to river → wild stage), `fRehome('text')` (owner change), `fSick(id)`, `q(null,null,fn)` to queue.
- `end:'ID'` finishes the life with a catalogue ending.

### Ending
```js
fevEnd({'HOM-07-D':{kind:'bad'|'happy'|'release', cat:'short category', tier:'fact'|'likely'|'story',
  fx:'f-floor', pl:[[3,'note']], fact:'fJumpF' or 'plain sentence', l:['line', 'line', …], after:false}})
```
- `kind:'bad'` gets the owner kind's after-death line automatically (set `after:false` to skip, or `after:'custom line'`). `'happy'` = black-comedy survival (calm). `'release'` = 보내 줌 (humane euthanasia by a caring owner).
- `fx` art keys: f-net f-bucket f-box f-shop f-unsold f-shopeaten f-shopnip f-stall f-trash f-bag f-float f-ice f-cook f-bottom f-eaten f-nipped f-floor f-escape f-intake f-poison f-hand f-glass f-toilet f-freezer f-euth f-thin f-curl f-bent f-pond f-burst f-cat f-siphon f-sun f-rest f-home f-angler f-aquarium apex freeze
- `fact` keys (shown as "실제로는"): fChain fCulled fCycle fBowlAny fBowl fBetta fIch fUnsold fShopMix fBurst fCat fSun fBread fPlace fFair fTemper fApex fWater fTemp fTB fHole fTetra fNeon fKHV fCyHV fIrido fSwim fClown fWild fOutgrow fRelease fFlush fLaw fLive fO2 fChlor fMed fCrowd fBeak fMotoro fArowana fAltum fPea fBichir fGar fChanna fKoi fGhost fBreed fOranda fJumpF fEuth fNatural, or omit. Do not invent numbers in a fact.

### Helpers you can call
`fl(k)` read a flag · `setFl(k,v)` · `addFl(k,n)` · `isSp(...)` · `isKind(...)` · `kindOf()` · `fst()` stats {p,g,w,c} · `capOf(k)` · `season()` · `fx_()` species data (FX) · `S.f` fish state (`len`, `wq`, `stress`, `mates`, `tank`, `filter`, `heater`, `lid`, `own`, `kind`, `fl`) · `S.health` · `S.r` owner skill 0–1 · `S.interest` · `S.ageM`/`S.sp.life` · `fem()` · `fPredMate()` · `fBully()` · `fSameCount()` · `tankL()` · `R()` random · `pick(a)` · `wpick([[x,w]])` · `clamp(v,a,b)` · `sideK(flag)`.

Built-in flags (read via `fl`): lid heater filter(none/sponge/hob/canister/ug/other) cycled tankL small_tank pond season wq nh3(0–3) hides cat kids place ill age old fem mates predator bully alone owner base skill interest health stress fin fat len shop wild released handed_over. Any other flag name lives in `S.f.fl` (default 0). Use the catalogue's flag names (BRIEF.md + each file's "새 플래그") when they fit; keep names short, lowercase, snake_case.

## Writing rules (from the user — non-negotiable)
1. Korean game text. Prompt and options in **what the fish senses and does**, never stats or results.
2. **No inner voice anywhere** — no quoted thoughts or speech of the fish. Observer view, present tense "~합니다" in bad-ending lines (log lines may be past tense like the existing game: "~했습니다").
3. Bad endings: gore by plain veterinary fact (real tissue names, what happens to them, the fish keeps trying to live). No hyperbole similes. 3–6 lines.
4. Happy endings: black comedy, **last line bitter**.
5. `{n}` for the fish name, always in 받침 form: `{n}이`, `{n}은`, `{n}을`, `{n}과` (particles are fixed automatically).
6. Species differences are mandatory (via `sp`, option `when`, `chk` vs caps, or outcome functions). A small fish never becomes an apex predator.
7. Unavoidable things (drug spreads through all the water, 4°C river for tropical fish) get no dodge option and no check.
8. Keep `[출처: …]` notes from the catalogue as JS comments next to the event; set tier 'fact' only where the catalogue gives a real-world basis, else 'likely'.
9. Facts shown on screen must not contain invented numbers.
10. Some catalogue events overlap things the engine already does (jump, cat, siphon, intake, tap water, cold, release basin…). Still write them; give overlapping ones `w:.5`.

## Testing (required)
```
cd /tmp/claude-0/-home-claude/b3cf8e0e-e65a-54dd-8d9e-16a0bf1c19e6/scratchpad/repo
node tools/fevtest.mjs 25 data/fev_<area>        # must end with PASS
VERBOSE=1 node tools/fevtest.mjs 25 data/fev_<area>   # per-event endings
```
It forces every event on fitting species, picks random options and plays the life out. Fix every STATIC issue, RUNTIME ERROR and "NEVER POSSIBLE" entry (an event that can never fire when forced has a wrong `need`/`when`/`sp`/`own`/`stage`). Do not run tools/sim.mjs (other files are being written at the same time).
