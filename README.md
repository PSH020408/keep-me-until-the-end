# 살아남아라! 끝까지! (*Survive — Until the End!*)

A browser raising-and-survival game: you are an ornamental fish, and the people who keep you are the hazard.

Formerly 키워주세요 — 끝까지 (*Keep Me — Until the End*); renamed in v0.17, when the adoption pledge was removed.

<p align="center">
  <a href="https://keep-me-until-the-end.onrender.com"><img alt="Play the beta" src="https://img.shields.io/badge/%E2%96%B6%20Play%20the%20beta-keep--me--until--the--end.onrender.com-C4301F?style=for-the-badge"></a><br>
  <sub>Free · no sign-up · phone, tablet and desktop · in Korean</sub>
</p>

[![살아남아라! 끝까지! — click to play](public/og.png)](https://keep-me-until-the-end.onrender.com)

> One of 23 ornamental fish is born in a river or on a farm, survives (or doesn't) the net,
> the sorting sieve, the shipping box and the shop tank, and goes home with a random owner.
> From then on you raise it in the manner of Uma Musume and Princess Maker — train, rest, learn
> skills, pass goals — so that it can outlast whatever the owner gets wrong.

**Status:** public beta (v0.24.1, *관상어 데이* — "ornamental fish day": fish only) · **Live:** [keep-me-until-the-end.onrender.com](https://keep-me-until-the-end.onrender.com) · **Stack:** plain HTML / CSS / JavaScript, no build step · **Hosting:** Render static site + Supabase (shared memorial) · **Language:** the game is in Korean; all documentation is in English

> **Content warning.** Neglect, breeding mills, smuggling, fish eaten by tankmates or flushed
> alive are told plainly. Since v0.10 bad endings describe, from outside and in plain veterinary
> terms, what happens to the gills, skin and organs — no inner voice, no exaggeration, no gore in
> the drawings. Intended for ages 15+.

| Desktop — the painted stage, the story under it, the card and turn menu beside it | Phone — stage, story, a compact status strip |
|---|---|
| ![a family gag: the father sings to the tank](docs/img/play-desktop.webp) | ![training on a phone](docs/img/play-phone.webp) |
| ![맞짱: a duel with the tank bully](docs/img/play-duel.webp) | ![grandmother knits a sweater](docs/img/play-phone-gag.webp) |

The end of a life: the ending's painting, the fish's last pose and its episode title (제N훈).

![result screen](docs/img/result.webp)

## Data and privacy

- Events and odds are estimates tuned to real figures (annual mortality in public aquariums, losses in transport and sale, survival of goldfish given as prizes). Every number shown on screen as a fact has a source in [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).
- Saved lives (육성 기록) stay in the player's browser (localStorage).
- Only a life the player chooses to post goes to 모두의 육성 기록 (Supabase), anonymously: the fish, the ending and the last words.

## What happens in a life

1. **The title screen.** Pick 쉬움 or 어려움 and press start; a slot machine draws one of 23 fish. (Until v0.16 the player signed an adoption pledge with a nickname; the pledge is gone.)
2. **Before any owner.** Wild fish face the net; farmed fish face the sorting sieve. Then the
   box, the wholesaler, the shop tank — about a quarter die here, as in the trade.
3. **The owner.** One of 22 kinds of people, from the expert and the over-eager beginner to the
   no-filter believer, the medicine hoarder, the office tea-room tank, the temple release ceremony,
   the unboxing YouTuber and the grandmother given a tank as a present — each with a tank, filter,
   heater, lid, layout and tankmates that fit (or don't). Some learn after a near miss, some know
   the fix and put it off, some learn the wrong lesson. Owners change: a fish can be passed on
   through a second-hand app, a move, a hospital stay or a break-up, and a charming fish is more
   often taken by someone who will try.
4. **Career mode (육성, v0.13–0.14).** Once the fish has an owner, every second step is a turn on the 육성 card —
   train 힘 · 근성 · 지능 · 매력 (energy cost, failure rate, facility levels), rest, play, signal sickness, buy
   skills. Companions (the owner, a tankmate, a snail, the fish's own reflection) build bonds and give 우정 훈련;
   six goals arrive on schedule with a visible requirement; skills and 벼랑 끝 last stands let a fish that has
   grown live through the house's unfairness; the shop recommends the skill for the threat at hand. Bond stories,
   출전 contests and 계승 (a good career gives the next one a head start) round it out. Each stat wears a letter (G → SS → UF … US). The life ends
   with a grade (G → US) and a title. See
   [docs/CAREER.md](docs/CAREER.md).
5. **Raising the fish.** Five stats of its own — health (HP), strength, guts, wits and charm — and
   four the owner keeps — skill, water temperature, water quality and care. Each species has its own
   ceiling and training speed (a neon tetra never gets strong, a gar does), and its own training,
   each with a hidden cost (an arowana that practises jumping jumps more). Every few months a schedule
   card decides how the weeks are spent; every choice shows what it changed. A training repeated goes
   up to Lv.3, and the training level opens ★ special trainings (staring down a tankmate, playing
   dead, a double jump, surfing the filter outlet…). The stat the player builds opens a route —
   star, tyrant, genius, survivor — and each route has a climax that can end the life either way.
6. **Events.** About 450 catalogue events across the whole chain — capture, export, air cargo,
   shop tanks, the home, water and disease, tankmates and breeding, each kind of owner, and Korean
   rivers after a release. Choices describe only what the fish senses; the stat being checked and
   the odds are hidden (chance = (stat / need)², 5–95%). An option beyond the species' ceiling is
   shown greyed — "{n}의 몸으로는 할 수 없다" — and there is always a passive option. Things no fish
   can dodge (a drug that spreads through the water, a 4 ℃ river for a tropical fish) have no choice.
7. **The ending.** Three kinds: a bad ending, a black-comedy happy ending with a bitter last line,
   or 보내 줌 (a caring owner's humane euthanasia when nothing else can be done). A stamp with the cause, the life lived against the life possible, the six
   promises with the broken ones struck out, the fish's happiest memory and last words, and one
   real, sourced fact. A life can be kept in the **주마등** (*revolving lantern* — "life flashing
   before one's eyes") and replayed — and, if the player chooses, posted to **모두의 주마등** (the shared
   memorial) where other players can replay it.

The player signs the pledge with a nickname and is the fish's first owner under that name; what kind of
keeper they turn out to be (expert, learner, casual…) is drawn. While a life plays, everything is on one
screen: the tank and gauges, a scrolling log, and choices that open as dialogs.

## Shared memorial (모두의 주마등)

Finished lives can be shared between players. When a life is kept, a ticked box also posts it to a
shared table; every visitor sees the latest lives at the bottom of the page and can replay any of them
line by line, with its broken promises and last words.

```
browser (static site on Render)                 Supabase (Postgres, Seoul)
  share.js ── POST /rest/v1/lives ───────────►  lives: nick, species, cause, kept, rec (jsonb)
           ◄─ GET  /rest/v1/lives, life_stats ─  row-level security: read + insert only
```

- **No accounts, opt-in.** Only the nickname, the fish, the ending and the life record are stored, and
  only when the player leaves the box ticked. The footer says so.
- **Safe by construction.** The page holds only the publishable key; row-level security allows reading
  and inserting and nothing else, so no visitor can edit or delete a row. A trigger caps posts at 20 a
  minute, text columns have length checks, and a life record is limited to 24 KB.
- **Untrusted on the way back.** Every row read from the table is rebuilt field by field with known
  types and lengths, slurs are masked, and all text is inserted as text, never as HTML.
- Setup, SQL and moderation: [docs/SHARING.md](docs/SHARING.md).

## Balance — anchored to real numbers

Two difficulties (v0.10.0): **어려움** (hard) is tuned to the anchors below; **쉬움** (easy, the default)
makes owners kinder, the fish's checks a little likelier and black comedy commoner. With random
choices, 14% of lives are lived out in 어려움 and 20% in 쉬움; happy endings are 9% and 14% of lives.
`node tools/sim.mjs 6000` plays thousands of lives with random choices (`MODE=story` for 쉬움), and
`node tools/fevtest.mjs` forces every catalogue event on every species it fits and plays the life out.

Every event carries a truth tier: 📌 fact (it happens and the mechanism is verified), 🔸 likely (real
mechanism, invented scene) or 🎭 story (black comedy). 어려움 shows more 📌 and little 🎭; the biggest
comedies appear only in 쉬움. Facts shown on screen still need a source in docs/DATA_SOURCES.md.

| Anchor (어려움) | Target (source in docs/DATA_SOURCES.md) | v0.10.0 |
|---|---|---|
| Expert keeper, deaths per fish-year | public aquarium 6–8% | 13% — to be retuned |
| Gift goldfish dead in year 1 | ≥ 90% | 89% |
| Casual owner dead in year 1 | most | 74% |
| Learner dead in year 1 | 20–30% | 26% |
| Dead before any owner | 20–30% (trade losses) | 20% (escapes not counted) |

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
- **The player signs, the fish chooses.** The player is the owner by name — the pledge cannot be sent
  without one — but what kind of keeper they turn out to be is drawn, and the choices belong to the
  fish, written in its first person and shaped by its temperament and species. You make the promise;
  you do not get to decide how well you keep it. Since v0.10 the fish has no inner voice: its
  thoughts are no longer quoted, and the new events and bad endings are told from outside.
- **One screen while a life plays.** Playtesters on phones kept scrolling between the log, the tank and
  the speed buttons. The play view is now a fixed layout where only the log scrolls and choices open as
  dialogs (bottom sheets on phones), checked from 360×640 to 1440×900.
- **Crises are choices.** Accidents that used to kill outright became survival decisions, with
  their frequency raised so the overall death rate stays realistic.
- **People differ.** Some owners learn from a mistake for good, some know the fix and put it off,
  some never notice. The simulation shows the difference (diligent learners ≈37% of lives lived
  out, lazy ones ≈28%, owners who never learn ≈17%).
- **Context is checked automatically.** Scripts play hundreds of lives in a pond, a bowl or a
  heated tank and flag any line that does not fit (a lid on a pond, a heater burn without a
  heater, tankmates for a fish living alone).
- **Facts must match the fish.** `tools/check_facts.mjs` plays every species and lists which
  real-world fact each ending showed; it caught a pea puffer being shown the betta fact and a dozen
  similar mismatches.
- **Every screenshot is read like a player would.** Retaking the README screenshots turned up
  fourteen small contradictions — a "beginner" labelled with an expert's skill, a fish named before
  the pledge was signed, plant shade in a tank drawn with stones, a 31℃ heatwave next to a 28℃
  gauge — each fixed and logged in v0.9.31 before the images were taken again.
- **Responsive by test, not by eye.** The layout is rendered at 320–1440 px and on a landscape
  phone in headless Chromium and checked for overflow on every screen of a life.

## Milestones

| Version | Date | What changed |
|---|---|---|
| v0.1–v0.6 | 2026-10-10 | single-file prototype → modules; 42 species, pledge sheet and red pen, wild-survival model |
| v0.7–v0.8 | 2026-10-10 | painted characters, cartoon gags, painted dog breeds |
| v0.9 | 2026-10-11 | 관상어 데이: 23 painted fish, a full supply chain before any owner, tanks drawn to scale |
| v0.9.12–0.9.20 | 2026-10-11 | balance against published anchors (easing reverted), crises as choices, owner types, layouts |
| v0.9.21–0.9.24 | 2026-10-11 | raising the fish (stats, schedule), breeding modes, learning vs. lazy owners, context checks |
| v0.9.25–0.9.26 | 2026-10-12 | public beta: responsive layout, OG image, GitHub → Render deploy |
| v0.9.27–0.9.33 | 2026-10-12 | one-screen play, the player as owner, facts checked per species, shared memorial on Supabase |
| v0.9.34 | 2026-10-13 | difficulty renamed 쉬움 / 어려움 |
| v0.10.0 | 2026-10-13 | event layer: species ceilings, hidden checks, 22 owner kinds, 372 catalogue events, 415 endings, truth tiers, no inner voice |
| v0.11.0 | 2026-10-13 | prologue rebuilt with three visible origin tracks and escapes, 54 track events, all old endings rewritten, near-miss save removed, ~10 catalogue events per life |
| v0.12.0 | 2026-10-13 | playtest fixes: picked options kept in the log, disease order fixed, training levels and ★ special trainings, stat routes with climaxes, fewer relapses and four new diseases, several versions of the common endings and of the prologue |
| v0.13.0 | 2026-10-30 | career mode (육성): turn card with energy, mood, facility levels, companions and 우정 훈련, 17 skills against 억까, 벼랑 끝 last stands, six goals, grade G–SS and titles; 24 comic events |
| v0.14.0 | 2026-10-31 | final pass: skills against disease and neglect, a skill shop that recommends by threat, careers twice as long, stats ×10, fewer deaths before an owner, harder last stands and top ranks, bond stories, 출전 contests, 계승 legacy |
| v0.15.0 | 2026-10-31 | stats start low against the species ceiling; Uma Musume style letters per stat (G → SS → UF … US) and career grades past SS |
| v0.16.0 | 2026-10-31 | game UI for the play screen: stat boxes with rank badges, training tiles, message-window log, chunky buttons, under-water HUD |
| v0.17.0 | 2026-10-31 | renamed 살아남아라! 끝까지!; the adoption pledge and nickname removed, a game title screen with only the difficulty choice; new share image |
| v0.17.1 | 2026-10-31 | title screen trimmed to title, difficulty and start; 주마등 renamed 명예의 전당 |
| v0.18.0 | 2026-10-31 | Uma Musume style skin: pale striped background, white panels, lime accent, outlined gradient rank letters; light theme everywhere; friendlier footer |
| v0.18.1 | 2026-10-31 | 명예의 전당 renamed 육성 기록; on-screen explanations moved to the README |
| v0.19.0 | 2026-10-31 | turn-based: no timer or speed buttons; one Uma Musume style training screen with the options in the screen |
| v0.20.0 | 2026-10-31 | one line per click with a log popup; turn menu with popups; owner and fish names; absurd routes — wild births, river training, 하천의 왕, 세계관 최강자, 한강의 전설, 저수지의 군주, beating the cat — and twelve Gintama-style gags |
| v0.21.0 | 2026-10-31 | turn menu under the stats, three lines of story history, aquarium animation (smooth turns, light, shimmer, swaying plants), a real hand net, pond wording, same-species legacy |
| v0.22.0 | 2026-10-31 | no species stat ceiling (aptitude instead), full story history, owned skills on the card, 생전 하이라이트 at the end |
| v0.22.1 | 2026-10-31 | fish in small scenes hover instead of swimming backwards |
| v0.23.0 | 2026-10-31 | the stage acts out each story line (23 scenes and overlays); the death scene arrives with the ending's first line |
| v0.23.1 | 2026-10-31 | event scenes as light, colour grading and camera moves instead of flat props |
| v0.24.0 | 2026-11-01 | rebuilt on 339 painted assets: rigged fish (tail and fins move), painted places, 35 ending paintings, owner portraits, hands, animals and props per story line, career cut-ins, a new play layout, a painted title screen, a result screen with an episode title (제N훈); 맞짱, 수선조 / 폭주어단 and sixteen family gags; the pet-sim code and art removed |
| v0.24.1 | 2026-11-01 | each species swims its own way; the fish keeps swimming between story lines; the current line no longer scrolls away; the turn menu back beside the card |

Every row is expanded in [LOG.md](LOG.md).

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
  js/data/fev.js         event layer: species ceilings, owner kinds, hidden checks, flags, endings, truth tiers
  js/data/fev_*.js       the catalogue as data (origin, trade, home, health, mates, owners A/B, wild + happy endings;
                         fev_zgrow.js: training levels, ★ trainings, route climaxes, ending versions;
                         fev_zz_career.js: career mode; fev_zz_fun.js: comic home events)
  js/stage.js            the stage: painted scene, rigged fish (data/rig.js), tank in a room, particles, the side card
  js/dir.js              direction: what the stage does for each story line (pose, painting, animal, hand, prop, cut-in)
  js/endhero.js          the result screen: ending painting, last pose, episode title (제N훈)
  js/data/fev_zz_mob.js  맞짱 duels, 수선조 / 폭주어단 schools, sixteen family gags
  img/                   WebP made by tools/import_assets.py (fish/<id>/ layers and poses, bg/, end/, glory/, career/,
                         gag/, mob/, owner/, animal/, hand/, prop/, skill/, sick/, ui/)
  js/share.js            shared memorial (Supabase REST, opt-in, sanitised)
tools/sim.mjs      headless balance simulation (prints endings, owner anchors, learning vs. not)
tools/fevtest.mjs  forces every catalogue event on fitting species and plays the life out
tools/check_facts.mjs  which fact each species ends with, and log lines that contradict the tank
tools/import_assets.py  cuts the painted sheets (art_raw/, not in git) into the WebP in public/img and rigs the fish
tools/rig_overrides.json  per-species fin and head corrections for the rig
docs/              DESIGN (rationale), DATA_SOURCES, EVENTS (content authoring), DEPLOY, SHARING (shared memorial), portfolio outline
  FISH_REWORK.md     v0.10 design: principles, species ceilings, owners, endings, decisions log
  fish_events/       the event catalogue in Markdown, the writing brief, and the conversion guide
LOG.md             development log (every version, every balance snapshot)
render.yaml        Render blueprint
```

## Glossary

| Korean | Meaning |
|---|---|
| 키워주세요 — 끝까지 | "Please keep me — until the end" |
| 서약서 | adoption pledge sheet |
| 육성 기록 | raising record — the replay gallery of saved lives |
| 모두의 육성 기록 | the shared memorial of lives other players posted |
| 제N훈 | "lesson N" — the episode title each life gets |
| 맞짱 | a one-on-one fight (with a tank bully) |
| 수선조 · 폭주어단 | the disciplined patrol and the reckless gang a school of small fish can found |
| 육성 | raising / training (the schedule card) |
| 고비 — 살아남기 | crisis — survive |
| 쉬움 · 어려움 | easy · hard (difficulty) |
| 보내 줌 | "letting go" — humane euthanasia by a caring owner, the third kind of ending |
| 왕초보 · 초보 · 중수 · 고수 | owner ranks: novice · beginner · intermediate · expert |

## Author

**PARK, SEHO** — design, writing, research and development. See [LOG.md](LOG.md) for the
development history. The illustrations were generated as sheets (339 pictures, see
[docs/ART.md](docs/ART.md)), then cut, rigged and converted by `tools/import_assets.py`.

## License

MIT — see [LICENSE](LICENSE).
