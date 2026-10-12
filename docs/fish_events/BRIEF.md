# Event writing brief — 「키워주세요 — 끝까지」 fish rework

You are writing game events (Korean game text) for a web life-sim where a random ornamental fish lives one life. Purpose: make players feel the responsibility of keeping fish. Bad endings must be REAL things that happen to aquarium fish, described goreily but purely factually (veterinary/pathology). Happy endings are black comedy with a bitter last line.

Read the design file first: /tmp/claude-0/-home-claude/b3cf8e0e-e65a-54dd-8d9e-16a0bf1c19e6/scratchpad/FISH_REWORK.md (species caps & traits, owner roster, principles, sentence rules, examples, decisions log). Follow it exactly.

## Hard rules
1. **Facts only.** No invented chemistry, no invented statistics. If a claim would be shown as a fact and needs a source, append `[출처: 무엇을 찾아야 하는지]`. If you are not confident something really happens, don't write it.
2. **Bad-ending prose**: observer view, present tense "~합니다", one action per sentence, real tissue names (아가미 새엽, 상피, 점막, 복강, 늑골, 척수, 측선, 부레, 수정체, 지느러미 기조 …) and what actually happens to them. Fish keeps trying to live; its movement worsens the wound. NO inner thoughts/dialogue of the fish anywhere. NO hyperbole similes ("분수처럼", "미친 듯이", "팝콘처럼"). 3–7 sentences.
3. **Screen text & choices**: written as what the fish senses and does. Never show stat names, numbers or outcomes in choices. Always include one passive option (숨기/가만히 있기 등) available to every species.
4. **Hidden checks**: 힘/근성/영리함/애교 + owner skill. Success chance = (stat/need)², 5–95%. If need > species cap, that option is unavailable for that species (say which species). Unavoidable things (drug spreads through all water, 4°C river for tropical fish) get NO check.
5. **Species differences are mandatory**: every event lists how results differ by species/group. Never one-size-fits-all. A small fish never becomes an apex predator.
6. **Organic links**: each event has `조건` (flags it needs) and `남김` (flags it sets) using ONLY the shared flag vocabulary below (you may add new flags but list them at the end of your file under "새 플래그").
7. **Owner reaction**: after a near-miss, owner learning chance depends on owner type (see roster). Note which flag removes the event (e.g. `lid=1` ends jump events).
8. {n} for the fish name, written in 받침 form ({n}이, {n}은, {n}을).
9. Game text Korean. Structure labels may be Korean too.

## Shared vocabulary

**Species ids**: oranda, comet, ryukin, betta, wildbetta, guppy, neon, platy, cory, altum, oscar, pleco, arowana, koi, channa, peapuffer, fig8, clownloach, bichir, ghost, motoro, apisto, gar
**Groups**: gold(oranda,comet,ryukin) · koi · livebearer(guppy,platy) · small(neon,guppy,platy,peapuffer,apisto,cory) · labyrinth(betta,wildbetta) · airbreather(betta,wildbetta,channa,bichir,gar,pleco,cory) · bottom(cory,pleco,clownloach,bichir,motoro) · scaleless(motoro,ghost,clownloach,cory — 약품 민감) · predator(oscar,arowana,channa,gar,bichir,fig8) · big(oscar,arowana,gar,koi,pleco,channa,motoro) · jumper(arowana,channa,comet,betta,wildbetta) · escaper(channa,bichir,ghost) · puffer(peapuffer,fig8) · brackish(fig8) · tropical(all except gold, koi; gar is cold-tolerant) · longfin(oranda,ryukin,betta,guppy) · schooling(neon,clownloach,cory)

**Owner ids** (22): expert, learner, eager, casual, gift, breeder, content | mill, cult, neglect, alchemist, techbro | relay, release, shared, decor, unbox, staff, bait, touch, grandma, breakup

**Places**: wild_amazon, wild_asia(river/peat), wild_india, farm_pond, farm_rack(hormone/indoor), breeder_room, exporter_holding, airport_cargo, importer, wholesale, shop_tank, mart_tank, fair_stall, parcel, home_room, home_living, office, classroom, restaurant, cafe, pond_outdoor, temple_river, korean_river, warm_outflow, bait_shop, touch_pool

**Flags**
- 장비: lid(0/1), heater(0/1/broken), heater_cover(0/1), filter(none/sponge/hob/canister/ug), intake_guard(0/1), cycled(0/1), tankL(number; compare to species minL → small_tank), substrate(sand/gravel_sharp/bare), light24(0/1), co2(0/1), autofeeder(0/1), sensor(0/1), pond_net(0/1)
- 수질: nh3(0–3), no2(0–3), no3(0–3), temp(low/ok/high), ph_crash(0/1), chlorine(0/1), salt(0/1), toxin(종류)
- 몸: inj_fin, inj_skin, inj_gill, inj_eye, inj_barbel, inj_burn, inj_spine, slime_loss, weight(thin/ok/fat), scar
- 병: ich, finrot, fungus, columnaris, dropsy, swimbladder, hlle, camallanus, khv, neon_dz, velvet, popeye, beak_overgrowth, stunted
- 관계: mates(aggressive/nipper/predator/same_male/schooling_ok/alone), owner_interest(0–3), owner_learned:[list], near_miss, viral, handed_over(count), escaped, released, season(spring/summer/autumn/winter)

## Event format (use exactly)

```
### EV-<AREA>-<NN> 제목
- 장소: …
- 주인: … (ids 또는 전체)
- 종: … (ids/그룹, 확률 차이)
- 조건: …
- 화면:
  > (2–4문장, 관찰자, "~합니다")
  > {n}은…
  > ① …
  > ② …
  > ③ … (소극적 선택지)
- 숨은 판정: ①→… ②→… ③→…
- 종별 결과:
  - <종/그룹>: …
  - <종/그룹>: …
- 🔴 배드엔딩 「엔딩 이름」: (규칙 2의 문장)
- 🟢 생존 / 😂 블랙 코미디 (있으면): …
- 남김: (flags set; what this leads to — name other EV ids or general event types)
- 주인 학습: (who learns, what flag ends this)
- [출처: …] (필요시)
```

Write as MANY high-quality events as you can for your area (target given in your task). Quality and realism over filler. No duplicates of the 24 events already in FISH_REWORK.md section 3 unless you substantially deepen them in your area. Save to the file path given in your task. End the file with "새 플래그" list and a one-line count.
