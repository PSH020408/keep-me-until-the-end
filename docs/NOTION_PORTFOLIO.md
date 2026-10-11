# Portfolio page — outline

Title: **키워주세요 — 끝까지** (*Keep Me — Until the End*) · a life-simulation about the promises we make to kept animals

1. **One-line pitch, live link and a 20-second clip** of one fish's life (slot → pledge → stamp).
2. **Problem.** Ornamental fish are the pets most often treated as disposable, and their losses
   are the least visible: 30–70% of Amazon-caught fish die before reaching a buyer; most gift
   goldfish do not survive their first year. The game lets a player watch it happen to one fish.
3. **What I built.** Screens: the pledge sheet, the slot, a life in progress (stage, two rows of
   meters), a crisis choice, a schedule (training) card, the ending with broken promises in red
   pen, the 주마등 replay. Desktop and phone.
4. **Design decisions** (one paragraph each, from `docs/DESIGN.md`)
   - The pledge sheet and red pen as the core metaphor (not a stats dashboard).
   - The player is the fish: choices by temperament and species, outcomes as gambles.
   - Realism over comfort: anchors, and why the easing pass was reverted.
   - Owners who learn, owners who are lazy, owners who never notice.
   - Release is not death: the wild-survival model and its ecological endings.
   - Cruel fairy tale: painted fish, plain sentences, no looking away.
5. **How it works.** The life loop diagram; data tables (fish, owners, tanks, crises); the
   headless simulation and the automated context checks.
6. **Numbers.** Balance snapshots and anchors from `LOG.md`; a chart of ending causes from
   `tools/sim.mjs`; learning vs. lazy vs. never.
7. **Process.** Version history from `LOG.md`: what playtest feedback changed what.
8. **What I would do next.** From `ROADMAP.md`.
9. **Sources.** From `docs/DATA_SOURCES.md`.
