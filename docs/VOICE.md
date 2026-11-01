# Voice — how the game talks (v0.26)

The game reads like a gag manga in the manner of Gintama or 괴짜가족: a narrator who comments on what
just happened, deadpan exaggeration, sudden 츳코미 (a sharp retort), fourth-wall asides, and — now and
then — one quiet line that lands because everything around it was loud. It is never mean to the fish.

## Rules

1. **Narration is 해라체 (~했다 / ~다), not 합쇼체 (~했습니다).** Short sentences. A manga caption, not a report.
   - 합쇼체 stays only where a character speaks politely in quotes, or where the narrator addresses the player
     on purpose ("※ 이번 화는 예산 문제로…" asides may use ~입니다 for comic formality).
2. **Add a beat, not a paragraph.** Most lines become: what happened → a twist or retort. Keep the length
   close to the original (at most about 1.5×); the story box shows one line at a time.
3. **츳코미 forms** (vary them, never the same one twice in a row in a file):
   `…아니, 그게 아니잖아.` · `(진짜다)` · `(아님)` · `물고기다. 다시 말하지만 물고기다.` · `그걸 왜 지금 해!` ·
   `작가도 몰랐다.` · `이 집, 괜찮은 걸까.` · `—라고 생각한 건 주인뿐이었다.` · `참고로 물고기는 박수를 칠 수 없다.` ·
   `다음 화에 계속. 안 한다.` · `이게 무슨 소리냐고? 나도 모른다.` · `복선이다. 아마.`
   Make up new ones that fit the moment; these are only a taste.
4. **Exaggerate scale**: a water change is a 대사건, a new decoration is 신도시 개발, the cat is 최종 보스.
5. **Owners and family talk like manga characters**: casual, a little dumb, very sincere.
6. **Deaths and illness**: still no blood, no mockery of suffering. Make the *situation* or the *people* funny,
   then end on one plain, short line for the fish. Example below.
7. **Facts stay facts.** Do not change any number, species fact, disease mechanism or cause. You may restyle
   the sentence around a fact, but what it says must still be true and say the same thing. Never invent new facts.
8. **Placeholders and grammar.** Keep `{n}` and write it in the 받침 form: `{n}이`, `{n}은`, `{n}을`, `{n}과`
   (the game fixes the particle). Do not add `처음` to a line that did not have it. Keep every other `{…}`
   placeholder, `<b>`/HTML, emoji and punctuation that code depends on.
9. **Choice labels** stay actions in 해라체 plain form (`정면으로 박치기한다`), but may get funnier
   (`정면으로 박치기한다 (이마에 자신 있음)`). Keep them short — they are buttons.
10. **Labels that are categories or keys** (ending categories like `'질병'`, `'스트레스'`, short tags, ids, map keys,
    anything compared with `===` or used in a RegExp) — **do not touch.**
11. **Fragments joined by code** (`' 살았습니다.'`, `'번의 고비를 넘겼습니다. '`): rewrite only if you also fix the pieces
    they join with, so the joined sentence is still grammatical; otherwise leave them.
12. **No real people, brands, or quotes** from Gintama or any work; no character names from other works.

## Before → after

| Before | After |
|---|---|
| `{n}은 수초 그늘에서 지느러미를 접고 푹 쉬었습니다.` | `{n}은 수초 그늘에서 지느러미를 접고 잤다. 완벽한 휴식. 수조 휴양지 별점 다섯 개.` |
| `주인이 라벨대로 약을 넣었습니다.` | `주인이 라벨대로 약을 넣었다. 라벨을 읽는 주인이라니. 이 집, 성장했다.` |
| `주인이 약을 세 가지 한꺼번에 넣었습니다.` | `주인이 약 세 가지를 한꺼번에 넣었다. 섞으면 더 세지겠지, 라는 논리였다. 그런 논리는 없다.` |
| `두꺼비는 바닥 가운데 그대로 앉아 있습니다.` | `두꺼비는 바닥 한가운데 그대로 앉아 있다. 집주인 포스다. 집주인은 {n}인데.` |
| `아가미 뚜껑의 움직임이 빨라졌다가 불규칙해집니다.` | `아가미 뚜껑이 빨라졌다가, 박자를 놓쳤다. 이건 개그가 아니다. 진짜 위험 신호다.` |
| `"얘 너무 답답해 보인다." 주인이 더 큰 수조를 들였습니다.` | `"얘 너무 답답해 보이는데?" 주인이 더 큰 수조를 들였다. 신도시 입주 확정.` |
| `{n}은 가족의 품에서 조용히 눈을 감았습니다.` | `가족이 다 모였다. 아빠는 울고, 동생은 더 울고, 고양이는 왜 다들 우는지 몰랐다. {n}은 조용히 눈을 감았다.` |
| (choice) `평소처럼 가만히 지낸다` | `평소처럼 가만히 지낸다 (평화주의자)` |

## Checks after editing a file

```bash
node --check public/js/<file>.js
node tools/sim.mjs 200 >/dev/null && echo ok      # the whole game still loads and plays
```
