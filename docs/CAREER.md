# Career mode (육성) — v0.13, revised in v0.14

Author: PARK, SEHO

The game was a life you watched with occasional choices. From v0.13, once the fish has an owner, it is
a raising game in the manner of Uma Musume and Princess Maker.

- The house still throws its unfairness (억까) at the fish: owners' mistakes, disease, the cat, power cuts.
- The player answers by building the fish up turn by turn, until it can survive them.

Code: `public/js/data/fev_zz_career.js` (career) and `public/js/data/fev_zz_fun.js` (24 comic events).

## The turn

**Timing**

- Every second simulation step after the purchase is a turn on the 육성 card.
- A short life gets a handful of turns; a long one gets 40–50.
- Hazards, catalogue events and the old everyday lines keep running on the steps in between.

**The status strip** shows:

- 기력 (energy, 0–100)
- 컨디션 (mood, five levels)
- SP (skill points)
- the four stats against the species ceiling
- the next 고비 with its turns left and the stat it needs
- the bonds

**The options on the card**

| Option | Effect |
|---|---|
| 힘 / 근성 / 지능 / 매력 훈련 | Gain shown as numbers, scaled to the species ceiling; energy cost (지능 restores a little); failure rate; facility level 1–5, which rises after four uses and changes the training's name |
| 특별 훈련 (about half the turns) | A temperament or species training, or a ★ special training from v0.12 |
| 휴식 | Energy +45 (sometimes more, sometimes interrupted) |
| 놀기 | 컨디션 up; ten comic outcomes, two of them bad |
| 아픈 티 내기 (only when sick) | The owner is more likely to notice |
| 스킬 배우기 | Does not use the turn |

**Failure**

- The failure rate is about 1.7 per point of energy below 55, plus stress and sickness.
- A failed training costs a stat point, a level of 컨디션 and some health, with an injury line from the old training failures.

**컨디션** multiplies gains: ×0.8 (최악) up to ×1.2 (최고).

**Starting point**

- When the owner takes the fish home, each stat drops to 60% of where it was (at least 25% of the ceiling).
- Gains are scaled to the species ceiling, so every species needs a similar number of trainings to reach its top.

## Companions and 우정 훈련

| Companion | Shown when | Favourite training |
|---|---|---|
| 주인 (owner) | always | 매력 |
| 합사어 (tankmate) | there are tankmates | 힘 |
| 수조 달팽이 「느림보」 | in a tank | 근성 |
| 유리 속의 나 (the reflection) | in a tank | 지능 |

- **Appearing:** each companion turns up on a random training about half the turns.
- **Bond:** training with a companion raises its bond by 7–11 and gains by 10%.
- **우정 훈련:** at bond 80 on the companion's favourite training, gains ×1.5, +4 SP, and a line of its own.
- **Owner bond 70:** the owner wakes up once — skill +0.12, stops being lazy, starts learning.

## Skills

There are 17 skills, bought with SP. SP comes from:

- training: 3 + facility level
- special training: 5
- 우정 훈련: 4 more
- goals: 25 + 5 per goal passed
- comic events

**What skills do**

- Some lower risk or raise checks:
  - 부상 방지, 꿀잠, 애교 장인
  - one per stat — 괴력, 맷집, 눈치, 아이컨택: the hidden check of that stat ×1.15
- Most turn a specific 억까 into something the fish can live through.

| Skill | Death it stops | Chance |
|---|---|---|
| 점프 착지술 | jump | 50% |
| 고양이 무시 | cat | 60% |
| 흡입구 회피 | intake | 70% |
| 겨울잠 체질 | cold | 45% |
| 산소 절약 | oxygen | 55% |
| 약 냄새 감지 | poison | 55% |
| 강철 아가미 | water shock, tap water, cycling | 35% |
| 죽은 척 장인 | being flushed alive | 70% |
| 숨바꼭질 고수 | being eaten | 35% |

- **How a save works:**
  - It replaces the death with a survival line.
  - The fish loses 18–32 health and a level of 컨디션.
  - The owner gets a near-miss lesson.
- **Catalogue deaths:** checked by their category at 45%.
- **기사회생 (150 SP):** saves one death a life, except natural death, euthanasia and freedom.

## 벼랑 끝 (last stand)

**When it happens**

- A death the fish could still fight becomes one desperate choice with three approaches.
- The kinds are: body, bad water, air, out of the tank, cat, intake, bite, cold.

**The odds**

- Each approach shows the stat it uses, the requirement (55% of the ceiling) and a rough chance.
- Success leaves the fish at 10–20 health with 컨디션 at the bottom.
- Success also fixes what caused it: water changed, lid fitted, heater bought, partition put in.
- Failing is the death.

**Limits**

- Twice a life (three times on 쉬움), at least eight steps apart.
- Never for a deliberate killing (abuse, flushing, freezing), release, euthanasia, culling or pre-owner deaths.

## 고비 (goals)

There are six goals at fixed shares of the lifespan. A goal already passed by age when the fish is bought is skipped.

| Goal | Share of lifespan | Stat | Need (share of ceiling) |
|---|---|---|---|
| 첫 달 | 5% | 근성 | 0.40 |
| 첫 계절 | 15% | 지능 | 0.50 |
| 다 자란 몸 | 27% | 매력 | 0.60 |
| 주인의 권태기 | 42% | 매력 | 0.70 |
| 한여름 밤의 정전 | 58% | 근성 | 0.80 |
| 노년의 겨울 | 78% | 근성 | 0.90 |

- **Approaches:** each goal offers three, each using a stat. Chance = (stat / need)^2.5 × 컨디션 (× 1.25 on 쉬움) − 0.05, between 5% and 92%.
- **Passing gives:**
  - SP
  - 컨디션
  - owner bond
  - +3 to the stat
  - the goal's reward (for example a bigger tank, or the owner's interest back)
- **Failing hurts:**
  - water and health
  - cold shock
  - stunting
  - the owner losing interest (35% chance of being given away)
  - an oxygen crisis
  - health in old age

## Grade and title

Score =

- each stat's share of the ceiling × 12
- \+ goals passed × 10, − goals failed × 6
- \+ skills × 3
- \+ share of lifespan lived × 45
- \+ owner bond ÷ 6
- \+ 20 if lived out
- \+ 우정 훈련 × 3

| Rank | Score from |
|---|---|
| G | 0 |
| F | 30 |
| E | 45 |
| D | 60 |
| C | 75 |
| B | 95 |
| A | 115 |
| S | 145 |
| SS | 175 |

The title is chosen Princess Maker style from how the life ended and what was built.

**Lived out**

- 끝까지 해낸 물고기 (every goal and S or above)
- 가족이 된 물고기 (bond 90)
- 만능 물고기 (every stat at 70% of the ceiling)
- Otherwise by the stat the player trained most:
  - 수조의 왕 (힘)
  - 불사조 (근성)
  - 수조의 현자 (지능)
  - 거실의 아이돌 (매력)

**Died**

- 너무 짧았던 생
- 억까의 증인 (killed by the owner's mistake)
- 먹이사슬의 한 칸
- 병과 싸운 물고기
- 겨울을 넘지 못한 물고기
- 뚜껑이 없던 밤
- 보내진 물고기
- 끝까지 싸운 물고기 (three or more skills)
- 고비를 넘지 못한 물고기
- 여기까지 온 물고기

The grade shows as a card on the ending screen and as the last line of the story, so it reaches the memorial.

## v0.14 changes (after the 24,000-life report)

The report showed that growth rarely beat the house's unfairness. These changes fix that.

**Skills**

- Two new skills for the two biggest killers:
  - 면역력: disease progresses 35% slower, and a disease death is survived 40% of the time.
  - 버티는 몸: neglect, starvation and stress deaths are survived 40% of the time, and health is lost 25% slower when nobody looks.
- A save now reads "★ 스킬 발동!" in the log.

**Skill shop**

- Every affordable skill is shown, not just nine.
- Skills that answer a current threat come first, marked 추천 with the reason. Threats include sick, neglect, bad water, no lid, a cat, no heater, a big tankmate, a medicine-happy owner, a small fish near the intake, summer, an owner who flushes, and age.
- Up to three recommended skills the fish cannot yet afford are shown greyed, with the SP missing.

**Turns**

- At home a step is half as long. A turn still comes every second step, so careers about double in length (mean 32 turns, up to ~95).
- Catalogue events roll on half of those steps, so a life holds about as many as before. The wild keeps its own pace.

**Display**

- Stats are shown ×10 on the card, the meters, the change chips and the ending (힘 310/750, +40).
- The meters fill toward the species ceiling.

**Prologue**

- Deaths before an owner are cut. Step deaths ×0.45, catalogue deaths weighted 0.2, culling halved.
- About 16% of lives on 어려움 now end before an owner, down from 25%.
- More species come from home breeders. Farms are about 53% of lives, down from 61%.

**벼랑 끝**

- Need 65% of the ceiling, chance (stat/need)^2.2 − 0.08, at most 75%.

**Grades**

- Re-banded for longer careers: G 0, F 30, E 50, D 75, C 105, B 140, A 180, S 215, SS 250.
- Contest wins add 4 each.

**Bond stories**

- Each companion has three chapters, at bond 30, 60 and 90: twelve in all.
- Each is a choice that raises a stat, gives 12 SP, and lifts mood and the bond.

**출전 (contests)**

- From turn 6, about every seven turns, the card offers one of five contests: photo contest, trick video, fish show, a twelve-hour stream, aquascape model.
- Each has a visible stat requirement and costs 25 energy.
- A win gives 20 SP, mood, owner bond and a 🏆 line. A loss gives stress and a bad line.
- Three wins in a lived-out life earn the title 대회 그랜드슬램.

**계승 (legacy)**

- A career graded B or better is remembered in the browser.
- The next career starts with the stat that fish built raised by 4–10% of the ceiling, and +10 SP.

**Rare events**

- About 140 catalogue events whose endings were almost never reached in 8,000 simulated lives are three times as likely.

## v0.15 changes: Uma Musume style stat ranks

**Stats no longer start full**

- Before an owner, the four stats were 18–30 points on a 0–100 scale. A species with a low ceiling (a neon tetra's 힘 is 15) started at its ceiling.
- Each stat now starts at 10–40% of the species ceiling (usually F to C).
- The old values are kept as the fish's instinct. Before an owner, hidden checks use whichever is higher; at home they use the higher of the stat and 75% of the instinct. Survival before an owner is unchanged (~20% die before one).
- At the owner's, stats drop to 90% (was 60%), at least 10% of the ceiling. A stat never drops below 1.

**Letters**

- Each stat shows a letter by its share of the species ceiling, on the card, the meters and the ending:

| Letter | Share from |
|---|---|
| G | 0 |
| F | 10% |
| E | 18% |
| D | 27% |
| C | 37% |
| B | 47% |
| A | 57% |
| S | 66% |
| SS | 74% |
| UF | 80% |
| UE | 85% |
| UD | 89% |
| UC | 93% |
| UB | 96% |
| UA | 98.5% |
| US | 100% |

- A low stat grows faster: training gains ×(1 + 1.6 × (0.5 − share)) below half the ceiling. The first letters come quickly; the U letters slowly.

**Grades**

- The career grade continues past SS: UF 275, UE 295, UD 315, UC 335, UB 355, UA 375, US 400.
- In 1,500 lives (sensible choices), UF and above is about 3% on 어려움 and 6% on 쉬움.

**Goals**

The first three goals are a little lower, because the career now starts lower:

- 첫 달: 0.3
- 첫 계절: 0.42
- 다 자란 몸: 0.55

## Balance (800 lives each, 어려움, v0.13)

Two choice policies:

- **random:** picks any option.
- **smart:** rests below 40 energy, plays when 컨디션 is low, prefers trainings with companions, buys skills, takes the most likely approach.

| Measure | random | smart |
|---|---|---|
| Lived out, careers only | 15% | 32% |
| Goals passed / failed per career | 1.4 / 1.3 | 2.2 / 0.7 |
| Skills per career | 1.1 | 3.3 |
| SS / S | 1% / 6% | 20% / 10% |

The choices matter. 어려움 stays hard. 쉬움 (random play) lives out 26% of all lives.

## v0.25 changes: factors, the 도감, slower growth, a grade for a whole life

**Growth.** Every stat gain (training, events, bond stories) is multiplied by `statSoft(stat / ceiling)` in
`fStat`: ×1.4 at 0, ×1 at 30 %, ×0.6 at 50 %, ×0.34 at 65 %, ×0.19 at 75 %, ×0.08 at 85 %, ×0.035 at 93 %,
×0.02 at the ceiling. Training's base gain is `gain × multipliers × ceiling / 115` (was `/ 60`, with a
separate catch-up for low stats that the curve now replaces). 지능 훈련 costs 6 energy (it gave 4 back, which
made it free to repeat). With `tools/career.mjs`, a diligent player ends a full life with a mean stat of about
60 % of the ceiling and a best stat around SS–UE; no stat maxes from training alone.

**고비 requirements** follow the curve: 20, 27, 35, 44, 50 and 56 % of the ceiling (were 30–90 %).

**Grade.** `carScore` adds: stats (mean share of the ceiling × 110), the share of the life lived (× 90, +20
when lived out), 고비 passed of those met (× 40) plus 4 per pass, skills (2.5 each, up to 10), the owner's
bond (÷ 5), friendship trainings (1.5 each, up to 15) and trophies (4 each, up to 16). Thresholds:
F 40 · E 60 · D 80 · C 100 · B 125 · A 150 · S 175 · SS 200 · UF 220 · UE 240 · UD 260 · UC 280 · UB 298 ·
UA 316 · US 335.

**인자 (factors)** replace the same-species 계승. At the end of a career the fish leaves:

| Factor | When | Stars |
|---|---|---|
| 스탯 (blue) | its best stat if ≥ 20 % of the ceiling; the second best (≥ 45 %) half the time | ★★★ ≥ 90 %, ★★ ≥ 65 %, else ★ |
| 스킬 (green) | each learned skill with 15 % + 2 % per grade step, at most three | rolled, brighter with the grade |
| 고유 (pink) | grade S or better; named after the title | ★★★ from UC, ★★ from UF |

Up to 24 fish are kept (the picked 선배 are never dropped). The player picks up to two 선배 on the title or
result screen (the two most valuable by default). When the next career starts and again at about 45 % of
its turns, every factor of each 선배 lights up with ★ 20 % · ★★ 35 % · ★★★ 55 % (× 1.2 for the same species):
a stat factor adds (1.5 + 2 × stars) % of the ceiling directly; a skill factor gives a hint (★ 25 %, ★★ 50 %
off the skill) or, at ★★★, the skill; a skill already known gives 5 SP per star; a 고유 인자 gives 8 SP and
5 bond per star and a better mood.

**물고기 도감.** Every finished life registers its species with the best grade reached, lives, lives lived
out and titles. A career starts with 1 SP per registered species plus 2 per species with S or better.

## v0.26 changes: no lives that just stop

**해피 이벤트.** While a career runs and less than 80 % of the lifespan is lived, a happy catalogue ending in
which the fish stays where it is (`FIX_STAY` in `data/fev_zz_fix.js`) does not end the life: its first lines are
told, the fish gets SP +15, owner bond +8, health +10 and a better mood, and the story goes on. Happy endings that
take the fish away (another owner, a pond, the river) are not rolled until the last fifth of the life; the
outgrown fish's donation to a public aquarium becomes a move.

**벼랑 끝 승부.** A death at 45 health or more that the career's own 벼랑 끝 has no scene for (being flushed alive,
the freezer, the trash, catalogue endings of other categories) is first put to a fight: power, guts, wits or charm,
chance `0.12 + stat/ceiling × 0.75 × (0.6 + 0.4 × health/100)` (+0.08 with the stat's skill), 10–85 %. Win: health
−28 and the life goes on. At most twice a life, 12 steps apart.

**Training lines** come from a shuffled deck per training (11 each), none repeated before the others are used.
