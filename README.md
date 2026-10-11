# 키워주세요 — 끝까지 (*Keep Me — Until the End*)

A browser life-simulation about the promises we make to the animals we keep.

![키워주세요 — 끝까지](public/og.png)

> One of 23 ornamental fish is born in a river or on a farm, survives (or doesn't) the net,
> the sorting sieve, the shipping box and the shop tank, and goes home with an owner who has
> signed six promises. You choose its temperament, make its choices when it matters, raise it
> through the seasons — and watch which promises are struck out in red pen.

**Status:** public beta (v0.9.26, *관상어 데이* — "ornamental fish day": fish only) · **Live:** _see the link in the repository description once Render is connected_ · **Stack:** plain HTML / CSS / JavaScript, no build step · **Hosting:** Render static site · **Language:** the game is in Korean; all documentation is in English

> **Content warning.** Neglect, breeding mills, smuggling, fish eaten by tankmates or flushed
> alive are told as a cruel fairy tale: plain sentences, wounds that bleed in text, no gore in the
> drawings. Intended for ages 15+.

| Desktop | Phone |
|---|---|
| ![desktop](docs/img/beta-desktop.png) | ![phone](docs/img/beta-phone.png) |

## What happens in a life

1. **The pledge.** Sign the adoption pledge with a nickname; a slot machine draws one of 23 fish.
2. **Before any owner.** Wild fish face the net; farmed fish face the sorting sieve. Then the
   box, the wholesaler, the shop tank — about a quarter die here, as in the trade.
3. **The owner.** Expert, learner, casual, gift, hobby breeder, content creator or fish mill —
   each with a tank, filter, heater, lid, layout and tankmates that fit (or don't).
   Learners improve week by week; some know the fix and are too lazy to do it.
4. **Raising the fish.** Five stats of its own — health (HP), strength, guts, wits and charm — and
   four the owner keeps — skill, water temperature, water quality and care. Every few months a schedule card decides how the
   weeks are spent; strength wins fights, guts survives crises, wits avoids accidents, charm keeps
   the owner interested. Every choice shows what it changed.
5. **Crises.** Jumping, a predator in the tank, the filter intake, a stuck heater, a blackout,
   chlorine, the cat, a burst tank — each one a choice that can end the life.
6. **The ending.** A stamp with the cause, the life lived against the life possible, the six
   promises with the broken ones struck out, the fish's happiest memory and last words, and one
   real, sourced fact. A life can be kept in the **주마등** (*revolving lantern* — "life flashing
   before one's eyes") and replayed.

## Balance — anchored to real numbers

`node tools/sim.mjs 6000` plays thousands of lives with random choices. The beta is tuned to:

| Anchor | Target (source in docs/DATA_SOURCES.md) | Beta |
|---|---|---|
| Expert keeper, deaths per fish-year | public aquarium 6–8% | 5–7% |
| Gift goldfish dead in year 1 | ≥ 90% | 92–96% |
| Casual owner dead in year 1 | most | ~80% |
| Learner dead in year 1 | 20–30% | ~20% |
| Dead before any owner | 20–30% (trade losses) | ~27% |

## How it was made — the thinking behind it

The full design rationale is in [docs/DESIGN.md](docs/DESIGN.md) and every version is recorded
in [LOG.md](LOG.md) (what changed, why, and the balance numbers after the change). The main
decisions, in short:

- **Realism over comfort.** When playtesting found the game too hard, an easing pass was tried
  and then reverted: the goal is to match what happens to real fish. Each owner type is tuned
  against a published anchor and re-checked with a headless simulation after every change.
- **Only sourced numbers are shown as fact.** Estimates stay inside the mechanics; any figure
  on screen has a source in [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md). A fact that was too vague to
  mean anything ("2% to over 70%") was replaced by a concrete case.
- **The player is the fish, not the owner.** Choices are written in the fish's first person and
  depend on its temperament and species; most are gambles with weighted outcomes.
- **Crises are choices.** Accidents that used to kill outright became survival decisions, with
  their frequency raised so the overall death rate stays realistic.
- **People differ.** Some owners learn from a mistake for good, some know the fix and put it off,
  some never notice. The simulation shows the difference (diligent learners ≈37% of lives lived
  out, lazy ones ≈28%, owners who never learn ≈17%).
- **Context is checked automatically.** Scripts play hundreds of lives in a pond, a bowl or a
  heated tank and flag any line that does not fit (a lid on a pond, a heater burn without a
  heater, tankmates for a fish living alone).
- **Responsive by test, not by eye.** The layout is rendered at 320–1440 px and on a landscape
  phone in headless Chromium and checked for overflow on every screen of a life.

## Run it

```bash
npm start                         # http://localhost:5173 (npx serve public)
python3 -m http.server 5173 -d public   # or any static server
npm run sim                       # 3000 headless lives
node tools/sim.mjs 2000 betta     # one species
```

## Layout

```
public/            the site (index.html, css/, js/, img/, og.png, favicon)
  js/data/fish.js        23 fish, tanks, filters, shops, owners, diseases, events
  js/data/fishchoice.js  situations by temperament and species, crises
  js/data/fishgrow.js    stats, schedule, breeding modes, learning/lazy owners, context checks
  js/fish.js             the fish life loop, hazards, endings
  js/art/fish.js         painted fish in a tank drawn to scale
tools/sim.mjs      headless balance simulation (prints endings, owner anchors, learning vs. not)
tools/fishsheet.html  contact sheet of tanks and deaths
docs/              DESIGN (rationale), DATA_SOURCES, EVENTS (content authoring), DEPLOY, portfolio outline
LOG.md             development log (every version, every balance snapshot)
render.yaml        Render blueprint
```

## Glossary

| Korean | Meaning |
|---|---|
| 키워주세요 — 끝까지 | "Please keep me — until the end" |
| 서약서 | adoption pledge sheet |
| 주마등 | revolving lantern; one's life flashing before one's eyes — the replay gallery |
| 육성 | raising / training (the schedule card) |
| 고비 — 살아남기 | crisis — survive |
| 왕초보 · 초보 · 중수 · 고수 | owner ranks: novice · beginner · intermediate · expert |

## Author

**PARK, SEHO** — design, writing, research and development. See [LOG.md](LOG.md) for the
development history. Fish illustrations were cut from generated sheets and retouched
(`tools/import_fish.py`).

## License

MIT — see [LICENSE](LICENSE).
