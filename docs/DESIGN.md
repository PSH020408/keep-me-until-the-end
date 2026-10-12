# Design

This document explains what the game is for, how one life is simulated, and why the main
decisions were made. The game text is Korean; Korean terms used below are glossed in
parentheses the first time they appear. The full version history is in [`LOG.md`](../LOG.md).

## Purpose

Make a player feel, in a few minutes, how many ways a kept animal's life can go wrong and
how much of it depends on ordinary daily care: cycling a new tank, a lid, a heater that
works, not adding a fish that eats the others. The beta follows ornamental fish only
(관상어 데이, "ornamental fish day"), because fish are the pets people most often treat as
disposable, and their losses are the least visible: in the trade, in the shop, and in the bowl.

The tone is a **cruel fairy tale**: a carefully painted fish, plain past-tense sentences, and
outcomes shown as they are.

## One life

```
pledge (nickname) ─► slot machine draws one of 23 fish
        │
        ▼
choose a temperament (shy · curious · glutton · people-loving · feisty)
        │
        ▼
before any owner ── wild: river → net → box → exporter → quarantine → shop
                └─ farmed: hatchery pond → sorting sieve → box → wholesaler → shop
        │              (each step: a choice from the fish's point of view, then a roll)
        ▼
an owner signs ── owner type, tank, filter, heater, lid, layout, tankmates
        │
        ▼  every step (≈110 steps per life; 30 s per step at 1×)
   ├─ queued story lines           show one, run its effect
   ├─ growth, water quality, temperature, stress, health, disease
   ├─ the owner learns (or puts it off)
   ├─ hazards ──► most become a crisis: the fish chooses how to survive
   ├─ schedule card every 8–11 steps: how the coming weeks are spent (training)
   ├─ a situation choice (temperament / species options), or an everyday event
   └─ endings: natural, disease, neglect, accidents, rehoming, release into a river…
        │
        ▼
ending: stamp, life lived vs. possible, the six promises with broken ones struck in red pen,
        happiest memory, last words, one sourced fact; the life can be kept and replayed (주마등)
```

## State

| Group | Field | Meaning |
|---|---|---|
| The fish | 건강 health (HP) | 0 ends the life |
| | 힘 strength | wins fights with its own kind, less fin damage, a little crisis survival |
| | 근성 guts | survival weight in crises, slower health loss |
| | 지능 wits | lowers hazards the fish's own behaviour can avoid (jumping, predators, intake, siphon, cat) |
| | 매력 charm | slows the owner's loss of interest, fewer give-aways |
| | stress, fin damage, overfeeding, disease | hidden, shown as chips after each choice |
| The owner | 주인 실력 skill | 0–1; ranks 왕초보 → 초보 → 중수 → 고수 (novice → beginner → intermediate → expert) |
| | 수온 water temperature | °C from season, heater, bowl size, window, pond; bar shows distance from the species' range |
| | 수질 water quality | falls with load and a weak filter, crashes in an uncycled tank |
| | 보살핌 care | the owner's current interest |

## The six promises (서약)

1. 끝까지 함께하겠습니다 — stay until the end (abandonment, rehoming)
2. 아프면 알아보고 치료하겠습니다 — notice and treat illness
3. 다 자랄 몸에 맞는 수조, 깨끗한 물과 먹이를 챙기겠습니다 — a tank for the adult size, clean water, food
4. 탈출과 사고로부터 지키겠습니다 — protect from escapes and accidents
5. 번식시킨다면 태어난 생명까지 책임지겠습니다 — take responsibility for any offspring
6. 자연에 풀어놓지 않겠습니다 — never release it into the wild

A broken promise is struck through in red pen with the age and the reason in handwriting.
The pledge sheet and the red pen are the identity of the game; the layout was kept away from
other life-simulation sites on purpose.

## Owners

| Type | What they do |
|---|---|
| expert | sized tank, cycled, heater with thermostat, lid, quarantine |
| learner (공부하는 초보) | starts badly, looks things up, fixes one problem after another |
| casual | bowl or small tank, mixes anything, panics when the fish gasps |
| gift | a fish won or given; most do not last the first month |
| hobby breeder / fish mill | line breeding, culled fry, spent females |
| content creator | big or predatory fish for views |

Owners who could learn are split: diligent ones fix the cause after a crisis for good (that
hazard ×0.1) and gain skill week by week; **lazy ones know the fix and put it off** (×0.65,
"다음부턴" — "next time"), clean less and lose interest faster; some never notice anything.

## Key decisions and why

**Difficulty follows real numbers, not comfort.** Early playtests felt too hard, and easing was
tried — then rejected: the point is to be close to what actually happens. Every owner type is
tuned against an anchor (public aquarium losses of 6–8% a year for experts, ≥90% of gift
goldfish dead in year one, 20–30% of traded fish dead before anyone buys them). The simulation
`tools/sim.mjs` plays thousands of lives with random choices after every change, and the
results are logged.

**Facts on screen must be sourced; estimates stay inside the mechanics.** Any number shown to
the player as fact has a source in `DATA_SOURCES.md`. A vague fact was rewritten when it said
nothing ("2% to over 70%" became a concrete case and a regional estimate).

**Choices belong to the fish.** The player does not play the owner. Choices are written in the
fish's first person ("나는…" — "I…") and depend on its temperament and species: a shy fish wedges
into rock, a labyrinth fish breathes air in a blackout, a puffer inflates and gets spat out.
Most options are gambles with weighted outcomes, so the same choice does not always end the
same way, and small unchosen surprises follow some choices.

**A crisis is a choice, not a dice roll.** Hazards that used to kill outright (jumping, a
predator tankmate, a stuck heater, chlorine, the cat) now open a survival choice. They are more
frequent, so a random player dies about as often as before, but a thoughtful one can survive.

**Raising the fish (육성).** Inspired by raising sims, a schedule card every few months trades
risk for growth. Failures are physical and specific to the tank (no heater burn without a
heater). Stats matter later: they change crisis odds, hazards and the owner's interest.

**Context must be right.** A pond has no glass, lid, lights or siphon; a solo fish has no
tankmates; a bowl without a filter has no filter noise. Text that needs a context it does not
have is filtered out, and automated passes scan hundreds of lives for contradictions.

**Releasing is not the same as dying.** A released fish enters a wild-survival model (first
winter, foraging, predators). Tropical fish die at the first frost; goldfish and koi can
establish; a predator may find a power plant's warm outflow and become the top of a river.
Each of those endings carries an ecological fact.

**Cruel fairy tale.** Drawings stay painterly and without gore. The text is plain and
unflinching; from v0.9.22 wounds may bleed in text (a deliberate change), and the fish's own
voice ("아가미가 뜨거워" — "my gills are burning") follows what happens to it.

## The signer is the player (v0.9.27)

The pledge cannot be sent without the player's name, and the sheet carries it as it is typed
("세호 님의 반려생물 입양 서약서"). The first owner of every fish is the player under that name;
what kind of keeper they turn out to be — expert, learner, casual, gift — is drawn, as it is in life:
people sign the same promise and keep it very differently. Owners after a rehoming are other people.
The choices still belong to the fish. The player makes the promise and watches how it is kept.

## One screen while a life plays (v0.9.27)

Playtesting on phones showed constant scrolling: down to a choice, up to the speed buttons, up again to
see the tank. During play the page is now a fixed layout and only the log scrolls:

| Screen | Layout |
|---|---|
| desktop, landscape tablet, landscape phone | card (tank, gauges, details) and controls on the left, the log in its own panel on the right |
| portrait tablet, phone | card on top (details folded behind "정보"), log in the middle, controls at the bottom |
| any | every choice is a dialog over the screen; on phones a bottom sheet |

At the ending the page returns to normal scrolling so the ending, the promises and the memorial can be
read in full.

## Shared memorial (v0.9.29)

A kept life can be posted for other players to replay. The design choices:

- **Opt-in and minimal.** A ticked box, with the consequence stated under it: the nickname, the fish,
  the ending and the last words become public. No accounts and no tracking.
- **The browser can only read and add.** The table (Supabase, Postgres) has row-level security with a
  read policy and an insert policy and nothing else; a trigger limits posts to 20 a minute.
- **What comes back is untrusted.** Each row is rebuilt with known types and lengths before it is shown,
  slurs are masked, and all text goes in as text.
- **The replay is the same for everyone.** A shared life opens in the same 주마등 view as one's own,
  line by line, then the summary of broken promises and the last words.

## Writing rules for the game text

- Short, plain sentences in the past tense. No exclamation marks in narration.
- Show the cause, then the result. Let the reader do the feeling.
- Names are written as `{n}이 / {n}은 / {n}을`; the particle is corrected automatically.
- Any line containing "처음" ("for the first time") happens once per life.
- Every ending carries one real-world fact.
