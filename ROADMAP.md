# Roadmap — the plan, the gates, and what comes next

> Each stage has a **gate** that has to pass before the next one starts. The outcome
> lines are added as gates pass or get rewritten. The prototype (v0.6) in this repository
> is the agreed starting point.

```
P0 Prototype ─► P1 Structure ─► P2 Content ─► P3 Art
                                                │
                                                ▼
                         P4 Data & balance ◄────┘
                                │
                                ▼
                         P5 Release (GitHub → Render)
                                │
                                ▼
                         P6 Portfolio (Notion)
```

## P0 · Prototype ✅
- Gate: one complete life plays from adoption to ending in the browser.
- Outcome: single-file draft, iterated five times in one day (v0.1–v0.5).

## P1 · Structure ✅
- Gate: the page no longer reads like the reference site; every life has a pledge
  sheet, an owner, a temperament and a place on the stage.
- Outcome: pledge sheet + red-pen strikes, wild-survival model, 20 death scenes.

## P2 · Content ✅ (first pass)
- Gate: in 100 random lives of the same species, no everyday event appears more than
  twice in one life, and "처음" events never repeat.
- Outcome: 213 events, recency weighting, once-only firsts. **Next:** a second pass per
  species group (fish, reptiles and insects still have thinner pools than dogs and cats).

## P3 · Art ✅ (second pass)
- Gate: all 42 species render in normal / happy / hungry / sick / sad / scared and in every
  death scene without overlaps (checked by rendering a contact sheet in headless Chromium).
- Outcome (v0.7): painterly round characters from 24 body templates, idle animation per
  body type, cartoon gags for injuries and moods, explicit bloodless bad endings.
  Contact sheet: `tools/sheet.html`.
- Outcome (v0.8): painted sprites for 15 dog breeds from Gemini sheets.
- Outcome (v0.9, 관상어 데이): 23 painted fish, realistic tank-to-scale stage and bloodless realistic deaths; fish-only mode with a full supply-chain life model.
- **Next:** painted sheets for cats and the other groups (same pipeline), breed-specific events from researched cases, owner silhouette, seasonal backgrounds.

## P4 · Data & balance 🔄
- Next for fish: casual and gift owners never reach the end of a lifespan in the simulation (0%); check against cases and decide whether that is the message or a tuning gap. Confirm estimated fish lifespans.
- Gate: every number shown to the player has a source in `docs/DATA_SOURCES.md`, and every
  species group's "lived out" share is within a target band agreed in the design doc.
- Tasks
  - P4.1 Source table for lifespans per species (veterinary references).
  - P4.2 Replace estimated monthly hazards for the top five causes with published rates
    where they exist (abandonment by species, shelter outcomes by year).
  - P4.3 Per-group tuning with `tools/sim.mjs`; record snapshots in `LOG.md`.
  - P4.4 Unit-style checks in `tools/` for the particle fixer and ending reachability
    (every ending id reached at least once in 20,000 lives).

## P5 · Release ✅ (public beta)
- Gate: public URL loads in under 2 s on a phone, share preview shows title and image.
- Done (v0.9.25): responsive layout checked at 320–1440 px and landscape phones, OG image,
  favicon set, privacy note (only localStorage), Render blueprint with headers, caching and a
  rewrite to the game for unknown paths, README and DEPLOY guide for the beta.
- Live (2026-10-12): https://keep-me-until-the-end.onrender.com from GitHub `PSH020408/keep-me-until-the-end` via the Render blueprint;
  every push to `main` redeploys.
- Same day, from playtest feedback: one-screen play on every screen size, the player as the named
  owner, per-species fact checks, and the shared memorial on Supabase (`docs/SHARING.md`).
- Next: watch the shared memorial for abuse in the first weeks; add a report button if needed; consider
  a weekly summary of shared lives (most common causes of death) on the page.

## P6 · Portfolio ⬜
- Gate: a Notion page that someone can read in five minutes and understand the problem,
  the design decisions, the numbers and the result. Outline in `docs/NOTION_PORTFOLIO.md`.

## Ideas parked (not scheduled)
- Several animals in one household that affect each other.
- Shareable ending card image.
- English version.
- Sound (only after a user gesture).
