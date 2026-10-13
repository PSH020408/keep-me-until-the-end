# Playtest of v0.11.0 (2026-10-13)

Author: PARK, SEHO

What was played:

- 42 lives on the live site, posted to 모두의 주마등 under the nicknames 클로드검수01–클로드검수42.
  - Odd numbers are 쉬움 and even numbers are 어려움.
  - The choice policy rotates through random, careful (last option) and bold (first option).
- About 800 more lives in the browser that were not posted.
- 8000 headless lives with `tools/sim.mjs`.

Fixes are in v0.12.0 (see LOG.md).

## Findings

| Area | What was seen | Fix in v0.12 |
|---|---|---|
| Repetition: training | 19% of all choices (26% in long lives) were the same six training prompts | Fewer sessions; prompts follow the life; Lv.1–3; ★ special trainings by training level |
| Repetition: disease | Up to 16 illness lines in one life, every one ending "○○이 나았습니다. 다시 지느러미를 폈습니다" | Recurrence damping, health events rarer as seen, four new diseases, a different mark per healed disease |
| Repetition: prologue | 23 of 27 farm lives opened with the same four lines; breeder track only 4 of 42 | 3–4 versions of every fixed line, more breeder fish |
| Repetition: endings | Seven old endings (disease, neglect, cycling, poison, culling, flushing, euthanasia) ended about half of all lives, each with one text | 1–3 more versions each; varied first and last disease lines; owner last lines per kind |
| Log order | A disease's outcome line came before its symptom (19 of 26 pairs) | Symptom first, unless the line tells the cause |
| Log readability | The option chosen was not recorded, so result lines had no context | "▸ option" line in grey |
| Logic | Parcel moved the lid, then "owner bought a lid"; stunted fish "grew too big"; expert owner dumped a gar in a river; move event contradicted an expert's careful move; corys jumped out of a breeder's tank; a one-week-old clown loach escaped and the life ended in nine lines; wild capture told twice; tank-stand leak and dried filter media never came back | All fixed (see LOG.md) |
| Bugs | Wild survival ending stored `undefined` as its key; an ending art key given as a function was not evaluated; "연못를" | Fixed |
| Stat events | Route lines (star, tyrant, genius, survivor) needed absolute stat values, so they opened in 7–11% of lives and stopped at the first step; stat-gated endings (`-H`) in 0.2% of lives | Routes measured against the species cap and led by what the player trained; a climax choice per route with good and bad endings |
| Gore | Disease, poisoning, culling, flushing and nitrite deaths at the intended standard; stress, stunting, quarantine-drug and old-age endings vague; predators ended only ~4% of lives | New versions written to the standard; a "gentle" predator tankmate event; more give-aways end in a predator's tank |
| Balance | Lived out 12.7% (어려움) / ~19% (쉬움) | 13.1% / 21.3% (어려움 health loss ×0.7) |

## Still open

- **Lived-out rates:** below the old targets (17% and 28%). The gore direction keeps 어려움 low on purpose.
- **Data sources:** catalogue `[출처]` notes still need rows in `DATA_SOURCES.md`.
- **Pre-owner deaths:** about 28% of lives on 어려움 end before any owner, mostly from culling and transport.
