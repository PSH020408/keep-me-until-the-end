# Writing events

All content lives in `public/js/data/`. Text uses `{n}` for the animal's name; the Korean
particle right after it (이/가, 은/는, 을/를, 와/과, 으로/로) is corrected automatically,
so always write the form for a name ending in a consonant: `{n}이`, `{n}은`, `{n}을`.

## Everyday events — `events.js`

```js
{g:['dog'], type:'bad', stage:['adult','senior'],
 t:'산책 중 풀숲을 헤집다 진드기가 붙었습니다.',
 h:-8,                       // health change
 i:0, r:0,                   // owner care / responsibility change
 sc:1,                       // the animal gets scared
 once:'tick1',               // at most once per life (required if the text says 처음)
 when:()=>S.r<.6,            // extra condition
 w:1,                        // weight
 m:'…', mw:1.2,              // memory for 돌아보기
 reflect:{p:'…', ph:'예) …'},// opens the 소감 box
 fx:()=>{ … }}               // anything else (may call fireEnd('foreign'))
```

Groups: `dog cat fish rodent rabbit turtle tortoise reptile snake bird parrot chick insect
crab amphib hedgehog ferret exotic feeder fmouse`, plus helpers `OWNED FURRY SMALLM REPT
BIRDS LAND CARED`.

Life stages: `baby` (first 15% of the lifespan), `adult`, `senior` (last 28%).

Illness decisions are generated from the `ILL` table at the top of the file: add a row
`['symptom and diagnosis', 'cost', optional condition]` to a group.

## Choices — `choices.js`

```js
{id:'bell', g:['dog'], when:()=>home(),
 p:'딩동. 현관 너머에서 낯선 사람 냄새가 난다. 나는…',
 o:[{l:'option label', r:'what happened', c:'good|bad|neutral', m:'memory', fx:()=>{…}}, …]}
```

## Endings — `endings.js`

```js
{id:'fire', g:OWNED, rate:.00015,            // hazard per month
 mod:()=>…,                                  // multiplier (owner, age, flags)
 cat:'화재', fact:F.fire,                    // stamp text and the real-world fact
 fx:'heat', pred:null,                       // death scene on the stage
 pl:[[3,'red-pen note']],                    // promises broken
 text:()=>[line, line, …],
 save:'near-miss line', saveFx:()=>{…},      // optional: owner can prevent it
 wild:'river'}                               // optional: instead of dying, go wild
```

Death scenes available in `art.js`: `bite eaten flat freeze heat flush fall starve
poison drown sickdead bellyup jump plate cage truck bottle zap gone ghost`.

## After adding content

```bash
node tools/sim.mjs 3000          # nothing should throw; check the shares
node tools/sim.mjs 2000 <species> # look at one species
```
Record a snapshot in `LOG.md` when the overall numbers move.
