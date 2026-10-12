# 04 · 수질 · 영양 · 질병 (Stage 3) — AREA HLT

Author: PARK, SEHO · Draft (2026-10-13)
기준 문서: FISH_REWORK.md (종 cap·특성·주인 22유형·문장 규칙). 판정 = (스탯 ÷ need)², 5–95%. need > cap이면 선택지 회색.
공통 규칙: 약·수질 변화는 물 전체에 퍼지므로 "피하기" 선택지는 없다. 물고기가 할 수 있는 것은 ① 주인에게 이상을 보이기(영리함·애교) ② 몸을 아껴 버티기(근성) ③ 가만히 있기 뿐이다. 실제 해결은 주인의 행동(환수·격리·정량 투약·수의사)으로만 일어난다.
화면에 사실로 보여 줄 병리·수치는 모두 `[출처]` 필요(어병학 교재, 수의 매뉴얼, 제조사 라벨).

---

## A. 수질 — 질소 순환 · pH · 염소 · 수온

### EV-HLT-01 새 수조의 첫 주 — 암모니아
- 장소: home_room, home_living, office, classroom, cafe
- 주인: eager, gift, casual, shared, decor, unbox, breakup (높음) / learner (중간) / expert, staff (거의 없음: 이미 사이클을 돌리거나 기존 여과재를 넣음)
- 종: 전 종. 몸이 큰 종일수록 배설량이 많아 더 빨리 터짐(oscar·arowana·koi·pleco·gar·channa 가중 ×1.5). 같은 농도라도 수온·pH가 높을수록 독성 형태(NH₃) 비율이 커짐 → 고온·고pH를 쓰는 종(guppy·platy 경수, fig8 기수)은 같은 날 더 위험. altum·wildbetta·apisto처럼 약산성 물을 쓰면 NH₃ 비율이 낮아 초기엔 덜 위험.
- 조건: cycled=0, 입수 1–3턴 이내
- 화면:
  > 물이 맑은데도 냄새가 달라졌습니다. 아가미를 열 때마다 따끔합니다. 바닥에는 어제 먹이가 그대로 있습니다.
  > {n}은…
  > ① 주인이 다가오면 수면 가까이 올라가 입을 빠르게 벌렸다 닫는다
  > ② 먹이가 떨어져도 입을 대지 않는다
  > ③ 바닥 구석에서 지느러미를 접고 가만히 있는다
- 숨은 판정:
  - ① 애교 need 50 (회색: comet 45, pleco 30, gar 40). 성공 → 주인이 "숨이 차 보인다"며 검색 → 50% 환수, 이후 주 2회 환수(nh3 -1). 실패 → "배고픈가 보다" → 먹이 추가(nh3 +1).
  - ② 영리함 need 40 (회색: oranda 30, ryukin 30, guppy 35, platy 35). 성공 → 남는 먹이가 줄어 nh3 상승 속도 절반. 실패 효과 없음. 대신 weight 1단계 감소.
  - ③ 판정 없음. 근성 need 45 자동 판정으로 이번 턴 생존(회색 개념 없음, 낮으면 확률만 낮음).
- 종별 결과:
  - airbreather(betta·wildbetta·channa·bichir·gar·pleco·cory): 수면 공기로 저산소는 버티지만 암모니아는 아가미·피부로 계속 들어옴 → 사망까지 시간이 길어짐(고통 기간 ↑). 주인이 "잘 버티네"로 착각, 학습 확률 -20%.
  - small(neon·guppy·platy·apisto·peapuffer): 몸이 작아 배설량은 적지만 아가미 손상에 약함. neon은 근성 cap 30 → ③ 자동 판정 성공률 최대 44%.
  - big(oscar·arowana·koi·gar·pleco·channa·motoro): 자기 배설물로 첫 3일 안에 nh3=3 도달 가능. 주인이 바로 환수하지 않으면 판정 보정 -20.
  - scaleless(motoro·ghost·clownloach·cory): 피부로도 흡수 → 근성 판정 need +10.
  - gold·koi: 먹이 반응이 좋아 ② 선택 시에도 영리함 판정 need +10(식욕 억제가 어려움).
- 🔴 배드엔딩 「첫 주」: 물속 암모니아가 아가미 새엽 상피를 녹입니다. 새엽 끝이 붉게 부어오르고, 옆 새엽과 서로 들러붙습니다. {n}은 아가미 뚜껑을 크게 벌려 물을 더 많이 통과시키려 합니다. 들러붙은 새엽 사이로는 물이 지나가지 못합니다. 혈중 암모니아가 신경을 흥분시켜 {n}은 갑자기 수조를 가로질러 돌진하고 유리에 머리를 부딪힙니다. 다음 날 아침 {n}은 바닥에 옆으로 누워 있고, 아가미 뚜껑 가장자리가 붉게 물들어 있습니다.
- 🟢 생존: 아가미 새엽에 흉터 조직(inj_gill)이 남음. 이후 수질 사건 근성 need +5(영구).
- 😂 블랙 코미디 (근성 cap 85 이상 종: comet·pleco·koi·channa·bichir·gar 중 근성 80+): 주인이 수조를 "물잡이" 할 생각도 없이 3주를 보냈고, {n} 혼자 그 3주를 버텨 수조의 여과 세균을 길러 냈습니다. 주인은 커뮤니티에 "물잡이 필요 없어요, 저는 그냥 넣었어요"라고 썼습니다. 그 글을 보고 물고기를 바로 넣은 사람이 열네 명이었습니다.
- 남김: nh3 +1~3, inj_gill(생존 시), near_miss(①성공 시) → EV-HLT-02(아질산 단계)로 이어짐, finrot·columnaris 발생률 ↑
- 주인 학습: near_miss 후 expert 95 / learner 70 / breeder 50 / grandma 40 / content·gift 20 / eager 30(대신 약을 산다 → EV-HLT-36) / casual 10 / neglect·cult·mill 0 / techbro 60(암모니아 센서 장착 → sensor=1). 학습 성공 → owner_learned:[cycle], 이후 새 수조 세팅 시 cycled=1로 시작.
- [출처: 암모니아 비이온화 비율과 pH·수온 관계(Emerson et al. 1975 표), 암모니아 아가미 병변(어병학 교재)]

### EV-HLT-02 갈색 피 — 아질산
- 장소: home_room, home_living, office, classroom, shop_tank, mart_tank
- 주인: 전체 (특히 EV-HLT-01을 넘긴 주인)
- 종: 전 종. 아질산 흡수는 아가미 염화물 세포 경로라 담수 종 모두 해당. guppy·platy·fig8(기수)처럼 물에 염분이 조금 있으면 염화이온이 경쟁해 흡수가 줄어듦(salt=1 또는 fig8 기수 조건이면 판정 need -15).
- 조건: no2 ≥ 2, cycled=0 (또는 EV-HLT-03 이후)
- 화면:
  > 암모니아 냄새는 옅어졌는데 숨은 더 가쁩니다. 헤엄을 조금만 쳐도 금세 지칩니다. 아가미 안쪽 색이 평소와 다릅니다.
  > {n}은…
  > ① 수면 아래에서 아가미를 크게 벌린 채 주인 쪽을 향한다
  > ② 여과기 물살이 나오는 곳 앞에 자리를 잡는다
  > ③ 바닥에 배를 대고 숨만 쉰다
- 숨은 판정:
  - ① 애교 need 55 (회색: comet, pleco, channa, bichir, gar). 성공 → 주인이 아가미 색을 보고 검색 → "아질산 중독" → 환수 + 소금 소량(salt=1). 소금 회피 종(cory·ghost·clownloach·motoro)은 learner·expert만 소금 대신 대량 환수로 대체, 나머지 주인은 정량 소금을 그대로 넣음 → EV-HLT-37 연결.
  - ② 영리함 need 45 (회색: oranda, ryukin, comet, guppy, neon, platy, pleco). 성공 → 산소 많은 물에서 버팀, 이번 턴 사망 확률 절반.
  - ③ 근성 need 50 자동 (회색 아님, 확률만).
- 종별 결과:
  - airbreather: 공기를 마셔도 해결되지 않음. 아질산은 헤모글로빈 자체를 메트헤모글로빈으로 바꿔 산소를 싣지 못하게 함 → 라비린스·폐 호흡 보정 없음(이 사건에서만 airbreather 이점 0). 화면 연출: 수면에서 공기를 마셔도 숨이 계속 가쁨.
  - livebearer: 원래 약한 염분에 적응 → need -10.
  - small: 몸이 작아 혈액량이 적음 → 같은 농도에서 진행이 빠름. 근성 판정 need +5.
  - scaleless: 소금 치료가 위험 → ① 성공해도 주인 유형에 따라 EV-HLT-37로 넘어감.
  - big: 회복 후 운동 능력 저하 2턴(힘 판정 -10).
- 🔴 배드엔딩 「갈색 피」: 아질산이 혈액 속 헤모글로빈을 메트헤모글로빈으로 바꿉니다. 피가 산소를 싣지 못하게 되고 색이 갈색으로 변합니다. 원래 붉어야 할 아가미 새엽이 초콜릿색이 됩니다. {n}은 물을 계속 아가미로 밀어 넣지만 근육으로 가는 산소는 늘지 않습니다. 지느러미 끝부터 움직임이 느려지고, 몸이 물살에 밀려 여과기 쪽으로 기웁니다. 아가미 뚜껑이 열린 채로 멈춥니다.
- 🟢 생존: 소금 투입 또는 대량 환수 후 1~2턴에 걸쳐 피 색이 돌아옴. 근성 +3.
- 남김: no2, inj_gill, salt(①성공 시), near_miss → cycled=1까지 2턴 후 no3 누적 시작(EV-HLT-04)
- 주인 학습: EV-HLT-01과 동일 표. 학습 성공 → owner_learned:[cycle, test_kit] → 이후 no2 사건 발생 확률 1/5.
- [출처: 아질산 메트헤모글로빈혈증과 염화이온 보호 효과(수산 질병 교재, Lewis & Morris 1986)]

### EV-HLT-03 수돗물로 헹군 여과재
- 장소: home_room, home_living, office, cafe
- 주인: eager(높음), gift, grandma, casual, decor, techbro / expert·staff 없음 / learner(낮음, 한 번은 함)
- 종: 전 종. 영향 크기는 배설량 비례(big 가중). pleco는 배설물이 많아 가장 빨리 터짐.
- 조건: cycled=1, filter≠none. 주인이 "여과기가 더러워 보인다" 이벤트로 청소
- 화면:
  > 주인이 여과기를 통째로 꺼내 욕실로 가져갑니다. 돌아온 여과기에서 수돗물 냄새가 납니다. 물이 지나치게 깨끗해 보입니다.
  > {n}은…
  > ① 여과기 출수구 앞에서 등을 돌리고 물 냄새를 피한다
  > ② 주인이 볼 때마다 유리에 몸을 붙였다 떼었다 한다
  > ③ 수초 사이에서 가만히 있는다
- 숨은 판정:
  - ① 판정 없음(물은 결국 다 섞임). 연출용. 영리함 +1.
  - ② 애교 need 60 (회색: comet, pleco, channa, bichir, gar). 성공 → learner·expert·staff·grandma만 "요즘 이상하다"며 수질 측정 → 이틀 일찍 환수(EV-HLT-01 진입 시 nh3 최대 1).
  - ③ 근성 need 45 자동.
- 종별 결과:
  - 전 종: cycled=0으로 리셋, 다음 턴 EV-HLT-01 강제 발생.
  - 수초·바닥재가 많은 수조(substrate=sand/gravel 이고 co2=1 또는 수초 많음): 바닥재와 수초 표면의 세균이 남아 nh3 최대 2로 제한.
  - gold·koi·pleco: 배설량이 많아 2턴 안에 nh3=3.
  - small 단독 사육: 배설량이 적어 nh3 1에서 멈출 수 있음.
- 🔴 배드엔딩: EV-HLT-01 「첫 주」 문장 사용. 끝에 한 줄 추가: 여과기 스펀지는 아주 하얗게 빨려 있습니다.
- 😂 블랙 코미디 (주인 eager, ② 성공): 주인은 "여과재는 수조 물로 헹구세요"라는 댓글을 받고, 그날부터 수조 물로 설거지를 시작했습니다. 그릇에서 비린내가 났지만 {n}은 살았습니다.
- 남김: cycled=0, owner_interest +1(②성공 시) → EV-HLT-01, EV-HLT-02
- 주인 학습: learner 80 / grandma 50 / eager 40 / gift 30 / casual 10 / techbro 70. 성공 → owner_learned:[media_rinse]. 이 사건 종료.
- [출처: 잔류 염소가 질산화 세균에 미치는 영향, 여과재 세척 권장 방법(수족관 관리 교재)]

### EV-HLT-04 오래된 물 — 질산염
- 장소: home_room, home_living, office, classroom, restaurant, cafe
- 주인: cult(매우 높음), neglect, casual, decor, shared, content / expert 거의 없음
- 종: 전 종이지만 피해 정도가 다름
  - 민감(motoro·altum·apisto·ghost·arowana·oscar): no3 2부터 증상
  - 보통(neon·cory·clownloach·betta·wildbetta·peapuffer·fig8·bichir·channa·gar)
  - 둔감(gold·koi·guppy·platy·pleco): no3 3에서도 바로는 안 죽음 → 대신 성장 정지(stunted)·면역 저하
- 조건: no3 ≥ 2, 환수 간격 길어짐 (owner_interest ≤ 1)
- 화면:
  > 물이 연한 노란색으로 변했습니다. 유리벽 아래쪽에 갈색 이끼가 덮였습니다. 먹이를 먹어도 몸이 예전처럼 차오르지 않습니다.
  > {n}은…
  > ① 주인이 지나갈 때마다 앞으로 나가 몸을 보여 준다
  > ② 움직임을 줄이고 하루 대부분을 쉰다
  > ③ 구석 그늘에 가만히 있는다
- 숨은 판정:
  - ① 애교 need 60 (회색: comet, pleco, channa, bichir, gar). 성공 → 주인이 "색이 빠졌네" → content·casual은 착색 사료를 삼(효과 없음), learner·expert·grandma는 환수(no3 -2).
  - ② 근성 need 55 (회색: neon, altum, peapuffer, ghost, motoro, apisto). 성공 → 이번 턴 증상 진행 정지.
  - ③ 판정 없음. 다음 턴 질병 1종 무작위 발생 확률 +20(finrot, hlle, fungus).
- 종별 결과:
  - motoro: 원반 가장자리가 위로 말리고(디스크 컬), 먹이를 거부. 2턴 지속 시 배드.
  - oscar: HLLE 시작 → EV-HLT-26.
  - arowana: 아가미 뚜껑 말림 → EV-HLT-41.
  - altum·apisto: 지느러미 접힘, 체색 어두워짐, 1턴 후 감염(finrot/columnaris).
  - gold·koi·pleco·comet: 당장 사망 없음. stunted 판정(EV-HLT-17).
  - guppy·platy: 출산 간격이 늘고 사산 증가(번식 사건 확률 ↓).
- 🔴 배드엔딩 「물을 갈지 않은 집」 (motoro 기준, 종 바꿔 적용): 질산염이 몇 달에 걸쳐 쌓입니다. {n}의 원반 가장자리가 바닥에서 들려 위로 말립니다. 배 쪽 피부에 붉은 반점이 생기고, 모래와 닿는 부분부터 점막이 벗겨집니다. {n}은 먹이를 앞에 두고 원반 가장자리만 물결치듯 움직입니다. 체중이 줄면서 등 쪽 중앙에 척추 선이 드러납니다. 어느 아침 {n}은 모래 위에서 원반을 접은 채 움직이지 않습니다.
- 🟢 생존 (② 성공 + 주인 환수): 색이 돌아오는 데 3턴. 근성 +2.
- 남김: no3, stunted(gold·koi·pleco·comet), hlle(oscar), gill_curl(arowana), finrot 확률 ↑ → EV-HLT-05 (오래 안 갈다가 한 번에 갈면)
- 주인 학습: learner 60 / expert 90 / grandma 30 / content 15 / cult 0(거꾸로 "환수는 생태계를 망친다"고 글 씀) / decor 10(관리 업체가 오는 날만 갈림). 성공 → owner_learned:[water_change] → no3 상한 1.
- [출처: 질산염 장기 노출 영향, 가오리 질산염 민감성(대형어 사육 문헌), 디스크 컬 증상]

### EV-HLT-05 한 번에 다 간 물 — pH 반전 (올드 탱크)
- 장소: home_room, home_living, office, classroom
- 주인: cult(변심), neglect(귀환), relay(새 주인 첫날), grandma(손주가 와서 대청소), eager
- 종: 전 종. 산성 물이 맞는 종(altum·wildbetta·apisto·neon)은 pH가 낮은 상태 자체는 견디지만 급상승에 약함. 경수 종(guppy·platy·fig8)은 pH 낮은 물에서 이미 쇠약.
- 조건: no3 ≥ 2, ph_crash=1 (KH 소진으로 pH 6 미만), 오래 환수 안 함 → 주인이 80% 이상 한 번에 환수
- 화면:
  > 오랜만에 주인이 양동이를 들고 옵니다. 물이 빠지고, 차갑고 낯선 냄새의 물이 쏟아집니다. 몇 분 뒤 아가미가 화끈거립니다.
  > {n}은…
  > ① 새 물이 쏟아지는 곳에서 가장 먼 쪽으로 간다
  > ② 수면으로 올라가 입을 내민다
  > ③ 바닥에 납작하게 붙어 가만히 있는다
- 숨은 판정: 물은 수 분 내 섞이므로 회피 없음.
  - ① 영리함 need 40 → 성공 시 노출 지연, 근성 판정 need -10.
  - ② airbreather만 의미 있음(공기 호흡 보정 +10). 비공기호흡 종은 연출만.
  - ③ 근성 need 55 자동 (cap 미만 종도 확률은 있음).
- 종별 결과:
  - pH가 낮을 때 수조에 쌓여 있던 암모늄(NH₄⁺)이 pH가 오르면서 독성 암모니아(NH₃)로 바뀜 → 같은 사건 안에서 EV-HLT-01 배드 문장으로 넘어갈 수 있음.
  - altum·apisto·wildbetta·neon: 급격한 pH 상승 + 경수 → 점막 과다 분비, 근성 need +15.
  - gold·koi·pleco: 견딤 확률 높음(need -10).
  - scaleless: 점막 손상 → slime_loss.
  - 수돗물 염소 처리를 빠뜨리면 EV-HLT-06 동시 발생.
- 🔴 배드엔딩 「대청소」: 새 물이 들어오며 pH가 몇 분 사이에 올라갑니다. 바닥에 쌓여 있던 암모늄이 암모니아로 바뀝니다. 아가미 새엽 상피가 점액을 한꺼번에 쏟아내고, 하얀 점액이 새엽 위에 막을 씌웁니다. {n}은 수면과 바닥을 번갈아 오가며 아가미 뚜껑을 크게 엽니다. 피부 점막이 군데군데 벗겨져 물에 흰 실처럼 떠다닙니다. 주인이 수조를 다 닦고 돌아섰을 때 {n}은 여과기 출수구 아래에서 거꾸로 기울어 있습니다.
- 남김: ph_crash=0, nh3 순간 +2, slime_loss, near_miss → 이후 주인이 "환수하니까 죽었다"고 결론 → cult·neglect·casual은 owner_learned:[no_water_change](역학습)
- 주인 학습: expert·learner만 "조금씩 나눠 갈아야 한다"를 배움(70/50). 나머지는 환수 자체를 끊음(이후 EV-HLT-04 확률 ↑). 이게 이 사건의 쓴 포인트.
- [출처: 올드 탱크 신드롬(KH 소진·pH 하락), pH 변화에 따른 암모니아/암모늄 비율]

### EV-HLT-06 대형 수조 대환수 — 염소 처리 누락
- 장소: home_living, office, restaurant, cafe
- 주인: eager, techbro(자동 급수 장치), decor(관리 업체 신입), content(촬영용 대청소), casual
- 종: big 종 위주(대형 수조 = 환수량이 커서 컨디셔너 계산을 틀리거나 빠뜨림). 작은 종도 같은 수조면 동일.
  - 수돗물 직수 예시(금붕어)는 FISH_REWORK 예시와 겹치므로, 이 사건은 "수백 리터·대형어·자동 급수"로 한정.
- 조건: tankL ≥ 300 또는 techbro 자동 급수, chlorine=1
- 화면:
  > 호스에서 물이 한참 동안 쏟아집니다. 수영장 같은 냄새가 수조 전체에 퍼집니다. 눈 표면이 따갑습니다.
  > {n}은…
  > ① 호스 물줄기 반대편 끝으로 몸을 돌린다
  > ② 유리 앞에서 주인에게 몸을 세게 부딪힌다
  > ③ 바닥에 가라앉아 가만히 있는다
- 숨은 판정:
  - ① 판정 없음. 연출(염소는 몇 분 안에 수조 전체에 퍼짐).
  - ② 힘 need 60 (회색: oranda, ryukin, guppy, neon, platy, cory, altum, peapuffer, fig8, clownloach, ghost, apisto, wildbetta). 성공 → 쿵 소리에 주인이 돌아봄 → 컨디셔너 생각남 → 투입(chlorine=0). oscar·arowana는 애교로도 대체 가능(애교 need 70).
  - ③ 근성 need 60 자동.
- 종별 결과:
  - arowana: 놀라서 점프 → lid=0이면 점프 사건 연결.
  - koi: 근성 cap 90 → 버틸 확률 높음, 생존 시 inj_gill.
  - motoro·ghost: 피부로도 손상 → slime_loss 확정.
  - techbro: 자동 급수 밸브 오작동으로 반복 가능 → sensor 추가(염소 센서 없음) → "fix: valve" 로그.
- 🔴 배드엔딩 「수돗물 수백 리터」: 잔류 염소가 아가미 새엽 상피세포를 산화시킵니다. 상피가 부풀어 기저막에서 들뜹니다. {n}은 커다란 몸으로 수조 끝에서 끝까지 헤엄치며 물을 아가미로 밀어 넣습니다. 몸이 클수록 필요한 산소가 많아 숨이 먼저 바닥납니다. 눈 표면의 각막이 하얗게 흐려집니다. {n}은 수면 가까이에서 입을 벌린 채 천천히 옆으로 눕습니다.
- 남김: chlorine, inj_gill, inj_eye(각막 혼탁), slime_loss, cycled 절반 손상(nh3 +1)
- 주인 학습: expert 100(재발 없음) / learner 80 / eager 40 / content 50(영상으로 "제 실수" 콘텐츠) / techbro 60(염소 중화 펌프 자동화 → 새 고장 사건) / decor 20(업체가 교체될 뿐). 성공 → owner_learned:[dechlor].
- [출처: 잔류 염소 아가미 독성(어병학), 국내 수돗물 잔류 염소 기준(환경부 수도법 시행규칙)]

### EV-HLT-07 맞지 않는 물 — 연수와 경수
- 장소: home_room, home_living, shop_tank
- 주인: casual, eager, gift, relay, content (수조 하나에 "예쁜 애들 다 넣기")
- 종:
  - 연수·약산성 필요: altum, wildbetta, apisto, neon (+ 야생 개체 discus형) → 경수 수돗물·산호사 바닥재에서 고통
  - 경수·약알칼리 선호: guppy, platy, fig8 → 연수·산성(유목·피트) 수조에서 고통
  - 둔감: gold, koi, pleco, oscar, cory, channa, bichir, gar, clownloach(중간)
- 조건: 한 수조에 반대 성향 종 합사, 또는 주인이 "다른 종 기준" 물을 맞춤
- 화면:
  > 물에서 낯선 맛이 납니다. 피부가 미끈거리는 느낌이 평소보다 덜합니다. 몸이 자꾸 한쪽으로 흔들립니다.
  > {n}은…
  > ① 주인 앞에서 몸을 좌우로 흔든다
  > ② 유목 그늘 아래로 들어간다 (유목이 있을 때)
  > ③ 바닥 가까이에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 65 (회색: comet, wildbetta(60), platy(60), pleco, channa, bichir, gar, ghost(60)). 성공 → learner·expert가 "쉬미(shimmy)" 증상을 검색 → 물을 그 종에 맞게 조정 또는 분리.
  - ② 영리함 need 40. 유목이 pH를 조금 낮추는 곳 → 연수 종은 보정 +, 경수 종은 오히려 악화(경수 종 이 선택 시 근성 need +10).
  - ③ 근성 need 50 자동.
- 종별 결과:
  - guppy·platy (연수·산성): 지느러미를 접고 몸을 제자리에서 좌우로 흔드는 "쉬미"가 나타남(shimmy=1). 면역 저하 → columnaris 확률 ↑.
  - altum (경수): 근성 cap 25 → 가장 빨리 무너짐. 1턴 안에 지느러미 접힘·체색 검게 변함·먹이 거부.
  - wildbetta·apisto: 산란 행동 중단, 체색 소실. 2턴 후 감염 판정.
  - neon: 경수에서 수명 단축(최대 수명 -20%), neon_dz 발병률 ↑(스트레스).
  - fig8: 연수 산성 → EV-HLT-08로.
- 🔴 배드엔딩 「예쁜 애들 한 수조」 (altum 기준): 경도가 높은 물에서 {n}의 아가미와 피부는 이온을 맞추느라 계속 일합니다. 체색이 어두워지고, 높은 등지느러미가 몸 쪽으로 접힙니다. 점액이 탁해지고, 지느러미 막 가장자리가 하얗게 일어납니다. 그 자리에 세균이 붙어 지느러미 기조 사이 막이 녹아내립니다. {n}은 수초 사이에서 몸을 세우려 지느러미를 펴지만 반쯤 녹은 막은 펴지지 않습니다. 사흘 뒤 {n}은 수초에 기댄 채 기울어 있습니다.
- 남김: shimmy(livebearer), finrot/columnaris ↑, stunted(neon) → EV-HLT-20, EV-HLT-22
- 주인 학습: expert 90(종별 분리 수조) / learner 60 / staff 70 / eager 20 / casual 5 / content 15 / relay 0. 성공 → owner_learned:[water_type].
- [출처: 라이브베어러 쉬미 증상과 연수, 알텀 엔젤 사육 수질(원산지 오리노코 수질 측정값)]

### EV-HLT-08 팔자복어 — 자라면서 바뀌는 물
- 장소: shop_tank, mart_tank, home_room
- 주인: 전체 ("민물 복어"라는 판매 문구)
- 종: fig8 전용 (FISH_REWORK #10 심화). peapuffer는 순수 담수종이라 반대로 소금을 넣으면 안 됨 → 하단 참고.
- 조건: species=fig8, salt=0, 입수 후 일정 턴 경과(어릴 때는 담수에서도 버팀)
- 화면:
  > 처음 몇 달은 아무렇지 않았습니다. 몸이 커지면서 물이 점점 맞지 않습니다. 피부가 거칠어지고 색이 바래 갑니다.
  > {n}은…
  > ① 주인이 오면 몸을 둥글게 부풀린 채 유리 앞을 맴돈다
  > ② 먹이 시간마다 주인의 눈을 따라 움직인다
  > ③ 바닥 돌 옆에 가만히 있는다
- 숨은 판정:
  - ① 판정 없음. 부풀리기는 스트레스 반응 → 주인 content·unbox는 "귀엽다"며 촬영(학습 0). 몸에 공기가 들어갈 위험(물 밖 촬영 시) → inj 기록. 
  - ② 영리함+애교 평균 need 70 (fig8 cap 75/85 → 가능). 성공 → 주인이 "팔자복어 흰 반점" 검색 → 기수어임을 알게 됨 → 소금을 몇 주에 걸쳐 조금씩 올림(salinity=low→mid). 실패 → 백점병 약 투여(EV-HLT-18 오진 루트).
  - ③ 근성 need 50 자동.
- 종별 결과:
  - fig8: 담수가 길어질수록 매 턴 근성 need +5 누적. 기수 전환 성공 시 이후 수명 정상화, 근성 +5.
  - 주인이 소금을 "한 번에" 맞추면(eager·alchemist): 삼투 충격 → 판정 need +20.
  - peapuffer(오해 반대 사례): 주인이 "복어니까 소금"이라며 소금을 넣는 경우 → peapuffer는 담수종이라 장기 노출 시 근성 판정 반복(need 30). 같은 사건 화면 재사용.
  - 함께 사는 담수 종(neon·cory 등): fig8를 위해 소금을 올리면 그쪽이 무너짐 → 분리 필요 → 주인이 하나를 포기(handed_over).
- 🔴 배드엔딩 「민물 복어」: 담수에서 몇 달을 지낸 {n}의 피부는 계속 물을 빨아들입니다. 콩팥이 물을 내보내느라 쉬지 않고 일합니다. 피부색이 회색으로 바래고, 배의 흰 부분에 작은 출혈 반점이 생깁니다. 면역이 떨어진 피부에 백점충이 붙어 온몸에 하얀 점이 돋습니다. {n}은 유리 앞에 와서 주인의 얼굴 높이에서 멈춥니다. 다음 날부터 먹이를 받으러 오지 않고, 일주일 뒤 수면에 배를 위로 하고 떠오릅니다.
- 🟢 생존 + 😂 블랙 코미디: 주인은 소금 농도를 맞추려고 비중계를 샀고, 비중계를 맞추려고 해수어 카페에 가입했고, 1년 뒤 거실에는 산호 수조가 하나 더 생겼습니다. {n}의 수조는 그 옆에서 "입문용"이라고 불렸습니다.
- 남김: salinity(fresh/low/mid), salt, ich 확률 ↑(담수 유지 시), handed_over(합사어 정리 시)
- 주인 학습: expert 95 / learner 70 / staff 90 / content 30 / eager 40(소금 급변 위험) / casual 5. 성공 → owner_learned:[brackish] → 이 사건 종료.
- [출처: Dichotomyctere ocellatus(팔자복어) 성장 단계별 염분 요구, 복어 기수 사육 문헌]

### EV-HLT-09 금붕어와 열대어 한 수조 — 수온
- 장소: home_living, office, classroom, restaurant, decor 수조
- 주인: gift, casual, shared, decor, relay (작은 수조 하나에 받은 물고기 다 넣기)
- 종:
  - gold(oranda·comet·ryukin)·koi: 냉수성. 히터 26–28°C 수조에 넣으면 대사가 빨라지고 배설·산소 소모 증가, 장기적으로 수명 단축
  - tropical 전 종: 금붕어 기준 히터 없는 물(겨울 15–18°C)에선 면역 저하 → ich
  - gar: 둘 다 버팀(cold-tolerant)
  - 추가 위험: comet·koi는 커서 작은 열대어를 먹음(neon·guppy 치어)
- 조건: 한 수조에 gold/koi + tropical, heater 상태에 따라 갈림
- 화면:
  > 이 물은 누군가에게는 따뜻하고 누군가에게는 차갑습니다. 같은 수조의 다른 물고기들이 숨을 쉬는 속도가 서로 다릅니다.
  > {n}은…
  > ① 히터 가까이 (또는 히터에서 먼 곳으로) 자리를 옮긴다
  > ② 주인이 먹이를 줄 때 가장 먼저 수면에 올라간다
  > ③ 무리 사이에 섞여 가만히 있는다
- 숨은 판정:
  - ① 영리함 need 45 (회색: oranda, ryukin, comet, guppy, neon, platy, pleco). 성공 → 수조 안 온도 차이를 이용, 이번 턴 영향 절반.
  - ② 애교 need 50 → 성공 시 주인이 "이 애만 활발하네" → learner·grandma만 검색 → "금붕어는 열대어랑 같이 못 키워요" → 분리(handed_over 또는 수조 추가).
  - ③ 근성 need 50 자동.
- 종별 결과:
  - heater=0 (겨울): tropical 쪽 사건 → EV-HLT-18(ich) 자동 발생 확률 60%. altum·neon·ghost·motoro·clownloach는 우선 발병.
  - heater=1: gold 쪽 → 산소 부족(수면 호흡), 과식 시 nh3 +1, 수명 상한 -15%. 짧은 몸 금붕어(oranda·ryukin)는 부레 이상 확률 ↑.
  - comet + small 합사: 코메트 힘 cap 70 → neon·guppy를 삼킬 수 있음 → 포식 사건 연결.
  - gar: 수온 문제 없음, 대신 합사어 전부 먹이가 됨.
- 🔴 배드엔딩 「미지근한 물」 (neon in 금붕어 수조 겨울): 수온이 17도로 내려간 밤, {n}의 체온도 같이 내려갑니다. 면역세포가 느려진 사이 백점충이 피부 상피 아래로 파고듭니다. 하루 만에 지느러미와 몸통에 하얀 점이 돋습니다. {n}은 바닥 돌에 몸을 문지릅니다. 문지른 자리마다 상피가 벗겨집니다. 옆에서 금붕어가 바닥을 뒤지다 {n}이 있던 자리에서 멈추고, 입을 몇 번 오물거립니다.
- 남김: temp(low/high), ich(tropical), swimbladder 확률(gold), mates=predator(comet 합사 시)
- 주인 학습: learner 60 / grandma 50 / expert 100 / gift 20 / casual 5 / shared 0 / decor 10. 성공 → owner_learned:[temp_group] → 분리.
- [출처: 금붕어 적정 수온(냉수성), 수온과 백점충 생활사 및 어류 면역 관계]

### EV-HLT-10 여름 연못의 새벽 — 산소
- 장소: pond_outdoor, farm_pond, restaurant(옥외 연못), temple_river 인근 사찰 연못, touch_pool
- 주인: grandma, decor, touch, release(사찰), expert(드묾)
- 종: koi, comet (연못어). oranda·ryukin이 연못에 있으면 몸이 둔해 가장 먼저 쓰러짐. gold보다 koi가 크고 산소 소모가 많음.
- 조건: season=summer, 녹조(주인이 물 안 갈고 햇볕), filter=none 또는 폭포 펌프 정지, 무풍 열대야
- 화면:
  > 낮에는 물이 초록색으로 빛났습니다. 해가 지자 물이 조용해집니다. 새벽이 가까워질수록 숨이 짧아집니다.
  > {n}은…
  > ① 연못 가장자리 폭포 펌프 쪽으로 간다
  > ② 수면에 입을 내밀고 공기를 빨아들인다
  > ③ 연못 깊은 곳에서 움직임을 줄인다
- 숨은 판정:
  - ① 영리함 need 50 (회색: oranda, ryukin, comet). 펌프가 돌면 생존 확률 크게 ↑, 정지 상태면 효과 없음.
  - ② 판정 없음. 금붕어·잉어는 수면 막의 산소를 조금 얻음(생존 보정 +10). 다만 airbreather가 아니므로 한계.
  - ③ 근성 need 70 (회색: oranda 55, ryukin 60). 성공 → 대사 줄여 해 뜰 때까지 버팀.
- 종별 결과:
  - koi: 크기 때문에 가장 먼저 수면에 몰림. 근성 cap 90 → 버틸 수는 있음.
  - comet: 힘 좋은 개체는 펌프 쪽 경쟁에서 밀어냄.
  - oranda·ryukin: 짧은 몸, 느린 유영 → ① 회색, ③ 회색 → ②만 가능.
  - 연못에 함께 사는 channa·gar가 있으면(방생 후 연못 등) airbreather라 거의 피해 없음 → 아침엔 그들만 남음.
- 🔴 배드엔딩 「열대야」: 해가 지면 녹조는 광합성을 멈추고 산소를 쓰기 시작합니다. 새벽 4시, 물속 산소가 가장 적어집니다. {n}은 수면에 입을 대고 빠르게 뻐끔거립니다. 다른 잉어들이 같은 자리로 몰려와 서로의 머리를 밀어냅니다. 아가미 새엽의 모세혈관이 확장되고, 아가미 뚜껑이 뒤로 젖혀진 채 굳습니다. 해가 뜰 무렵 {n}은 연못 가장자리 수초에 걸려 배를 위로 하고 떠 있습니다. 아침 9시에 녹조가 다시 산소를 만들기 시작합니다.
- 😂 블랙 코미디 (koi 근성 80+, 주인 grandma): 새벽 다섯 시에 산책 나온 할아버지가 연못에 몰린 잉어들을 보고 "아침밥 달라는구나" 하며 사료를 뿌렸습니다. 잉어들은 먹지 않았고, 할아버지는 이상하다며 수도꼭지를 틀어 호스를 연못에 꽂아 두었습니다. 찬 물줄기가 산소를 넣었습니다. 그날부터 할아버지는 새벽마다 호스를 꽂았고 이웃은 수도요금을 이상하게 여겼습니다. (단, 호스 물 염소 → 다음 턴 EV-HLT-06 경량판 확률)
- 남김: inj_gill, near_miss, 연못 동료 수 감소 → 연못 KHV(EV-HLT-28) 시 전파 속도 변화
- 주인 학습: expert 100(에어 펌프·그늘막) / grandma 40 / decor 15 / touch 10 / release 0. 성공 → owner_learned:[aeration] → 이 사건 종료(정전 시 예외).
- [출처: 연못 용존산소 일주기(새벽 최저), 녹조 호흡과 산소 고갈]

### EV-HLT-11 겨울 연못과 먹이
- 장소: pond_outdoor, temple_river(사찰 연못), restaurant 옥외 연못, farm_pond
- 주인: grandma, decor, touch(방문객 먹이 판매), release
- 종: koi, comet, oranda(연못 월동은 위험), ryukin(위험). gar는 연못에서 월동 가능하나 먹이 의존 적음.
- 조건: season=winter, temp=low (수온 약 10°C 미만), 방문객·주인이 먹이를 계속 줌, 또는 수면 완전 결빙
- 화면:
  > 물이 차가워져 몸이 무겁습니다. 위에서 사람들이 먹이를 계속 뿌립니다. 연못 위쪽에 얇은 얼음이 끼기 시작합니다.
  > {n}은…
  > ① 수면에 올라가 사람들 앞에서 입을 벌린다
  > ② 떨어진 먹이를 지나쳐 바닥으로 내려간다
  > ③ 연못 가장 깊은 곳에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 50 → 성공하면 먹이를 많이 받음 = 오히려 위험(소화 안 됨). 이 사건의 "함정" 선택지. 근성 판정 need +20으로 이어짐.
  - ② 영리함 need 50 (회색: oranda, ryukin, comet). 성공 → 먹지 않고 버팀.
  - ③ 근성 need 60 (회색: oranda 55). 성공 → 월동.
- 종별 결과:
  - koi: 근성 cap 90 → 월동 가능. ① 선택이 반복되면 장 내 먹이 부패 → 복부 팽만 → dropsy 확률.
  - comet: 근성 85 → 월동 가능.
  - oranda·ryukin: 연못 월동 자체가 근성 판정 need +20(짧은 몸·부레). 결빙 시 바닥에서 부레 이상(swimbladder).
  - 전면 결빙: 가스 교환이 막혀 결빙 일수만큼 매 턴 판정. pond_net 여부 무관. 주인이 얼음을 망치로 깨면(eager·grandma) 충격파로 판정 -10 (실제로 권장되지 않는 방법) → 고수는 뜨거운 냄비를 올려 구멍을 녹임.
- 🔴 배드엔딩 「겨울 먹이」: 수온이 8도인 연못에서 {n}의 장은 거의 움직이지 않습니다. 방문객이 던진 사료가 장 안에서 소화되지 않은 채 머뭅니다. 장 안에서 세균이 번식하며 가스가 찹니다. 배가 부풀고, 항문 주변이 붉게 부어오릅니다. {n}은 몸을 수평으로 유지하려 가슴지느러미를 계속 젓습니다. 장벽을 넘어간 세균이 복강에 퍼지고, 비늘 아래로 물이 차기 시작합니다. 봄이 오기 전 {n}은 얼음 아래에서 옆으로 누워 떠오르지도 가라앉지도 않습니다.
- 남김: dropsy 확률 ↑, swimbladder(gold), near_miss → 봄 EV-HLT-28(KHV)·궤양병 연결
- 주인 학습: expert 100 / grandma 40("배고플 텐데" 정이 학습을 이김) / decor 20(안내판 설치: "먹이 주지 마세요") / touch 0(먹이가 매출).
- [출처: 저수온기 잉어 급이 중단 권장 수온(비단잉어 사육 문헌), 결빙 연못 가스 교환]

---

## B. 영양 · 먹이

### EV-HLT-12 지나가는 사람마다 한 줌 — 과식
- 장소: office, classroom, cafe, restaurant
- 주인: shared(최고), decor, grandma(정), touch, eager
- 종: gold(먹이 반응 최상, 위가 따로 없음), oscar(조르기), koi, guppy, platy, betta(배가 작음). 반대로 cory·pleco·ghost·bichir는 경쟁에서 밀려 굶음 → EV-HLT-13.
- 조건: owner=shared 또는 autofeeder=1 + 사람 급이 중복
- 화면:
  > 오늘만 다섯 번째 손이 뚜껑 위에서 흔들립니다. 수면에 먹이가 떠 있고, 바닥에도 어제 먹이가 깔려 있습니다. 배가 무겁습니다.
  > {n}은…
  > ① 수면으로 달려가 떨어지는 먹이를 받는다
  > ② 먹이를 보고도 수초 쪽에 머문다
  > ③ 바닥에서 가만히 있는다
- 숨은 판정:
  - ① 판정 없음. 애교 +2, weight +1(fat), nh3 +1. oscar 훈련 "먹이 조르기" 부작용 연결.
  - ② 영리함 need 45 (회색: oranda, ryukin, comet, guppy, neon, platy, pleco). 성공 → 과식 회피. gold·koi는 need +10(먹이 충동).
  - ③ 근성 need 40 자동.
- 종별 결과:
  - gold(oranda·ryukin 특히): 장이 눌려 부레 이상 → EV-HLT-25. 배설 폭증 → 수질 붕괴(nh3·no2).
  - betta: 배가 공처럼 불러 변비 → 부레 이상 일시 발생(1턴).
  - oscar: 지방 축적(weight=fat), 수질 악화로 hlle 확률 ↑.
  - guppy·platy: 남은 먹이로 수질 악화가 주 피해.
  - 바닥 종(cory·pleco·clownloach·bichir·motoro): 위층 종이 다 먹어 정작 굶음 → EV-HLT-13.
- 🔴 배드엔딩 「월요일 아침」 (gold 기준): 금요일 오후, 회식 전에 들른 사람들이 저마다 먹이를 한 꼬집씩 넣습니다. 주말 동안 바닥의 먹이가 썩으며 물이 뿌옇게 흐려집니다. {n}의 장은 위가 없이 이어진 관이라 먹이가 들어오는 대로 꽉 찹니다. 부푼 장이 부레를 눌러 {n}은 머리를 아래로 한 채 기울어집니다. 흐린 물의 암모니아가 아가미 새엽을 붓게 합니다. {n}은 꼬리를 저어 몸을 바로 세우려 하고, 그때마다 다시 뒤집힙니다. 월요일 아침, 탕비실 어항 수면에 {n}과 먹이 찌꺼기가 같이 떠 있습니다.
- 😂 블랙 코미디 → H1(탕비실의 실세) 조건 진입 보정 (oscar·koi + ② 반복 성공 3회).
- 남김: weight=fat, nh3/no2 ↑, swimbladder(gold), hlle(oscar) → EV-HLT-25, EV-HLT-26, EV-HLT-13
- 주인 학습: shared 5(누군가 "먹이 주지 마세요" 공지) / decor 10 / grandma 30 / eager 30 / expert 100. 성공 → autofeeder 정량 설정 또는 급이 담당 지정.
- [출처: 잉어과 어류 무위(無胃) 소화관, 과급이와 수질 악화]

### EV-HLT-13 바닥까지 내려오지 않는 먹이
- 장소: home_room, home_living, office, classroom, shop_tank
- 주인: casual, gift, shared, eager("청소 물고기"로 산 경우), relay
- 종: bottom(cory·pleco·clownloach·bichir·motoro) + ghost(야행성). 위층 종과 합사 시. 단독 사육이면 발생 안 함.
  - pleco: "이끼 먹는 청소부" 오해(FISH_REWORK #8과 연결, 여기선 합사 경쟁 버전)
  - cory: "바닥 찌꺼기 청소" 오해
  - ghost·bichir: 야행성 → 낮 급이에서 굶음
  - motoro: 먹이가 바닥에 닿기 전에 다 사라짐
- 조건: 합사어가 수면 종(gold, guppy, platy, oscar, betta, arowana), 침강성 먹이 없음
- 화면:
  > 수면에서 먹이가 부서지는 소리가 납니다. 아래로 내려오는 건 작은 가루뿐입니다. 불이 꺼진 뒤에는 아무것도 남아 있지 않습니다.
  > {n}은…
  > ① 낮에 수면 가까이 올라가 먹이 경쟁에 끼어든다
  > ② 주인이 손을 넣을 때 그 손 아래 바닥으로 다가간다
  > ③ 바닥 은신처에서 가만히 있는다
- 숨은 판정:
  - ① 힘 need 50 (회색: cory 30, clownloach 40, ghost 30). 성공 → 조금 얻음. 실패 → 다른 종에게 지느러미 물림(inj_fin).
  - ② 애교 need 60 (회색: pleco 30, bichir 50). 성공 → 주인이 "바닥 애도 먹여야 하나?" → learner·grandma·expert는 침강 사료·소등 후 급이 시작.
  - ③ 근성 need 50 자동 → weight -1.
- 종별 결과:
  - pleco: 근성 cap 95 → 오래 버티며 수조 장식·유목을 갉음. 2턴 무급이 시 weight=thin.
  - cory: 무리어 → 혼자면 근성 -10. 여러 마리면 조금씩 나눠 먹어 오래 버팀.
  - clownloach: 굶으면 배가 꺼지는 "마름병" 형태 → 기생충 동반 시 EV-HLT-43 경로.
  - ghost: 야행성 + 전기 감지 → ② 대신 "밤에 손 냄새 따라가기"로 연출, 영리함 need 50(cap 70 가능).
  - motoro: 먹이 경쟁에서 지면 원반이 얇아지고 배가 꺼짐 → 2턴이면 배드.
- 🔴 배드엔딩 「청소 물고기」 (cory 기준): {n}은 매일 모래를 수염으로 뒤집으며 먹이를 찾습니다. 위에서 내려오는 가루는 위층 물고기의 배설물과 섞여 있습니다. 몸에 저장된 지방이 먼저 줄고, 다음으로 근육이 줄어듭니다. 배가 안쪽으로 꺼지고, 갑옷 판 사이로 등뼈 선이 드러납니다. {n}은 계속 모래를 뒤지고, 수염 끝이 닳아 짧아집니다. 어느 날 {n}은 다른 코리들 사이에서 옆으로 누운 채 수염만 천천히 움직입니다.
- 남김: weight=thin, inj_barbel(cory·substrate=gravel_sharp), inj_fin → 마른 개체는 이후 모든 질병 근성 need +10
- 주인 학습: learner 70 / expert 100 / grandma 40 / casual 10 / shared 0 / eager 30. 성공 → owner_learned:[bottom_feed].
- [출처: 플레코·코리도라스 식성(잡식, 단독 이끼로는 부족), 야행성 어종 급이 시간]

### EV-HLT-14 먹이 붕어만 먹는 육식어 — 티아민 결핍과 지방간
- 장소: home_living, office, restaurant, decor 수조
- 주인: content(먹방 영상), decor(풍수 아로와나), casual, unbox, eager
- 종: predator(oscar·arowana·channa·gar·bichir) 먹는 쪽. fig8는 먹이 붕어보다 달팽이·냉동 먹이 쪽(해당 없음). 먹히는 쪽은 FISH_REWORK #13.
- 조건: 먹이 = 살아 있는 먹이용 금붕어·구피만, 연속 3턴 이상
- 화면:
  > 봉지가 열리고 작은 물고기들이 쏟아집니다. 쫓는 것은 쉽고, 배가 금방 찹니다. 요즘은 헤엄칠 때 몸이 무겁고, 가끔 균형이 흐트러집니다.
  > {n}은…
  > ① 쏟아진 먹이를 끝까지 쫓아 다 먹는다
  > ② 주인이 다른 먹이(새우·사료)를 넣을 때 그것부터 문다
  > ③ 은신처 앞에서 기다리며 다가오는 것만 먹는다
- 숨은 판정:
  - ① 힘 판정 없음, 힘 +1. 결핍 누적 +1.
  - ② 애교 need 60 (회색: channa 50, bichir 50, gar 40). 성공 → 주인이 "사료도 잘 먹네" → 식단 다양화 시작(결핍 누적 리셋).
  - ③ 근성 need 50 → 결핍 누적 +0.5.
- 종별 결과:
  - 결핍 누적 3: 금붕어 내장의 티아민 분해 효소(티아미나아제) 때문에 비타민 B1 결핍 → 균형 상실·경련(thiamine=1).
  - arowana·oscar: 고지방 먹이 누적 → 간에 지방 축적(fatty_liver=1). 배가 처지고 활동 감소.
  - gar: 먹이 양이 많아 가장 빨리 누적(×1.5). 대신 근성 cap 95로 버팀은 김.
  - channa: 먹이 붕어 기생충 동시 노출 → EV-HLT-15 확률 ↑.
  - bichir: 야행성이라 먹이 붕어를 다 못 잡아 남은 붕어가 수조에서 병을 퍼뜨림.
- 🔴 배드엔딩 「먹방」 (arowana 기준): 몇 달 동안 {n}은 먹이용 금붕어만 먹습니다. 간세포에 지방이 쌓여 간이 노랗게 부풀고, 복강을 채웁니다. 금붕어 내장 속 효소가 비타민 B1을 분해해 신경이 제대로 신호를 보내지 못합니다. {n}은 수면 근처에서 균형을 잃고 몸을 한쪽으로 기울인 채 원을 그립니다. 경련이 오면 수조 벽에 턱을 부딪히고, 아래턱 수염이 휘어집니다. 촬영 조명 아래에서 {n}은 마지막 먹이를 쫓다 수면에서 비스듬히 멈춥니다.
- 🟢 생존: 주인이 식단 바꾸고 비타민 보충 → 2턴 회복. 영리함 +2.
- 남김: thiamine, fatty_liver, weight=fat, camallanus·flukes·lernaea 노출 → EV-HLT-15
- 주인 학습: content 30(댓글 지적 많을 때만) / expert 100 / learner 70 / decor 10 / unbox 20. 성공 → owner_learned:[varied_diet].
- [출처: 금붕어·잉어과 티아미나아제와 육식어 티아민 결핍, 대형 육식어 지방간(관상어 영양학)]

### EV-HLT-15 먹이 붕어에 묻어 온 것 — 닻벌레 · 물이 · 흡충
- 장소: home_living, office, bait_shop 경유
- 주인: content, casual, eager, bait, decor
- 종: 먹는 쪽 predator(oscar·arowana·channa·gar·bichir), 같은 수조의 모든 종. 기생충 숙주 선호: 닻벌레·물이는 잉어과·대형어에 잘 붙음, 비늘 없는 종(motoro·clownloach·cory·ghost)은 치료 약이 위험.
- 조건: 먹이 붕어 급이(검역 없음), 또는 bait_shop·pond에서 온 개체 합사, qt=0
- 화면:
  > 며칠 전 들어온 먹이 붕어 몇 마리가 다 먹히지 않고 남았습니다. 몸 어딘가가 자꾸 가렵습니다. 비늘 사이에 무언가가 붙어 있습니다.
  > {n}은…
  > ① 바닥 돌과 유목에 몸을 세게 문지른다
  > ② 주인 앞에서 몸을 돌려 가려운 쪽을 보인다
  > ③ 수초 그늘에 가만히 있는다
- 숨은 판정:
  - ① 힘 need 40 (회색: neon, guppy, platy, peapuffer, oranda, ryukin, cory, altum, ghost, apisto, fig8). 성공 → 물이 일부가 떨어짐. 실패 → 긁힌 자리 inj_skin → 수생균(EV-HLT-23).
  - ② 애교 need 60 (회색: comet, pleco, channa, bichir, gar). 성공 → 주인이 핀셋으로 닻벌레 제거 + 상처 소독 → 생존.
  - ③ 근성 need 55 자동.
- 종별 결과:
  - 닻벌레(lernaea): 암컷 요각류가 머리를 근육에 박고 몸을 밖으로 내놓음. koi·comet·gar·arowana에 흔함. 뽑을 때 머리가 근육에 남으면 염증.
  - 물이(argulus): 납작한 갑각류가 피부에 붙어 체액을 빨아먹음. 금붕어·잉어·대형어. 상처 → 2차 세균 감염.
  - 흡충(gyrodactylus/dactylogyrus): 아가미·피부 → EV-HLT-32로.
  - 소형어(neon·guppy 등): 같은 수조면 물이 1마리만 붙어도 체격 대비 상처가 큼 → 근성 need +15.
  - motoro·cory·ghost·clownloach: 치료(유기인계 구충제 등) 투여 시 EV-HLT-37 계열 약품 사건.
  - pleco: 갑옷 판 사이가 아니면 잘 안 붙음 → 확률 ×0.5.
- 🔴 배드엔딩 「덤으로 온 것」 (oscar 기준): 닻벌레 암컷이 {n}의 옆구리 비늘 사이로 머리를 박고 근육 속에 갈고리를 펼칩니다. 밖으로 나온 몸통 끝에 알주머니 두 개가 매달립니다. 박힌 자리 주변의 근육이 붉게 부어오르고 비늘이 들립니다. {n}은 유목에 옆구리를 문질러 떼어 내려 합니다. 문지를 때마다 상처가 넓어지고 그 자리에 세균이 자리 잡습니다. 염증이 근육을 따라 퍼지며 옆구리에 구멍이 납니다. {n}은 구멍 난 쪽을 아래로 하고 바닥에 눕습니다.
- 🟢 생존 + 😂: 주인은 핀셋으로 닻벌레를 뽑는 영상을 올렸습니다. "여드름 짜기 같아요"라는 댓글이 달렸고, 조회수가 잘 나와 이후 주인은 먹이 붕어를 일부러 같은 가게에서 샀습니다.
- 남김: lernaea / argulus / flukes, inj_skin, near_miss → EV-HLT-23, EV-HLT-32
- 주인 학습: expert 100(먹이 검역·냉동 먹이 전환) / learner 70 / content 20(위 코미디) / bait 0 / casual 10. 성공 → owner_learned:[qt] → qt=1.
- [출처: Lernaea·Argulus 숙주와 병변(어병학), 먹이어를 통한 기생충 유입]

### EV-HLT-16 복어의 이빨 — 달팽이 · 부리 · 수의사
- 장소: home_room, home_living, shop_tank
- 주인: 전체
- 종: puffer(peapuffer·fig8) 전용. FISH_REWORK #9 심화(치료 루트 추가). 다른 종 해당 없음.
- 조건: 먹이가 사료·물렁한 냉동만, snails=0, 연속 4턴 이상
- 화면:
  > 이빨이 서로 맞물리지 않습니다. 먹이를 물어도 잘 끊어지지 않습니다. 입 앞쪽이 조금씩 길어집니다.
  > {n}은…
  > ① 유리벽과 돌 모서리에 입을 대고 긁는다
  > ② 주인 눈을 따라 다니다 입을 벌렸다 다물기를 반복해 보인다
  > ③ 은신처에서 가만히 있는다
- 숨은 판정:
  - ① 힘 need 25 (회색: peapuffer 15). fig8 성공 → 이빨 조금 마모, 진행 1턴 지연.
  - ② 영리함 need 60 + 애교 need 60 (둘 다 성공 필요, 각각 판정). 둘 다 성공 → 주인이 "복어 입" 검색 → 달팽이 사육 시작(snails=1) + 이미 길면 수의사 방문 결정.
  - ③ 근성 need 35 자동 (peapuffer cap 35 → 최대 95%).
- 종별 결과:
  - peapuffer: 몸이 작아 부리가 조금만 자라도 입이 막힘. 진행 빠름(×1.5).
  - fig8: 진행 보통. 기수 미전환 상태(EV-HLT-08)면 둘이 겹쳐 근성 need +15.
  - 치료 루트(expert·learner·staff만 선택 가능): 수의사가 마취제로 재운 뒤 부리를 갈아 냄. 마취 판정(근성 need 40, peapuffer 회색이지만 이 판정은 자동 판정으로 확률만 낮음).
  - 주인이 직접 집에서 손톱깎이로 시도(eager·content·unbox): 근성 need 60 자동, 실패 시 턱 골절 → 배드.
  - 구리 약 사용 이력(EV-HLT-38) → 달팽이 몰살 → snails=0으로 이 사건 재발.
- 🔴 배드엔딩 「길어진 부리」: 위아래 이빨판이 계속 자라 입 앞으로 튀어나옵니다. 입이 끝까지 닫히지 않습니다. {n}은 먹이 앞에서 입을 벌렸다 닫으며 먹이를 물려고 합니다. 먹이는 이빨판 끝에 부딪혀 튕겨 나갑니다. 지방이 빠지고 배가 오목하게 꺼지며, 피부 아래로 등뼈 마디가 보입니다. {n}은 마지막까지 주인이 다가오면 유리 앞으로 나옵니다.
- 🔴 배드엔딩 「손톱깎이」 (집에서 자르기 실패): 주인이 {n}을 젖은 손수건으로 감싸 쥡니다. {n}은 몸을 부풀려 빠져나가려 하고, 공기가 위로 들어갑니다. 손톱깎이 날이 이빨판을 자르다 아래턱뼈 쪽으로 미끄러집니다. 턱뼈에 금이 가고 입 안쪽 점막이 찢어집니다. 물로 돌아온 {n}은 위에 들어간 공기 때문에 배를 위로 하고 수면에 떠오릅니다. 입이 비뚤어진 채 다시 다물리지 않습니다.
- 🟢 생존 (수의사): 마취에서 깨어난 {n}은 한참 동안 수조 바닥에 비스듬히 누워 있다가, 저녁에 달팽이 하나를 깨 먹습니다.
- 😂 블랙 코미디: 주인은 달팽이를 먹이려고 달팽이 수조를 따로 차렸습니다. 달팽이 수조가 세 개로 늘었고, 주인은 이제 달팽이 번식 카페의 운영진입니다. {n}의 사진은 카페 배너에 "고객님"으로 올라가 있습니다.
- 남김: beak_overgrowth, snails(0/1), weight=thin, near_miss
- 주인 학습: expert 100 / learner 80 / staff 90 / content 40 / eager 30 / casual 5. 성공 → owner_learned:[snails] → snails=1 유지 시 종료.
- [출처: 복어류 치판 과성장과 수의 치료(마취 하 트리밍), 피퍼퍼 먹이(달팽이)]

### EV-HLT-17 작은 수조에서 멈춘 성장
- 장소: home_room, office, classroom, cafe, restaurant
- 주인: casual, gift, shared, decor(작은 어항 인테리어), relay, cult(무여과 작은 어항)
- 종: big(oscar·arowana·gar·koi·pleco·channa·motoro) + comet. 소형 종은 해당 없음(tankL < minL 조건이 거의 안 걸림).
  - 금붕어 어항(comet in 원형 어항)이 대표.
- 조건: tankL < 종 minL (small_tank), 3턴 이상 지속
- 화면:
  > 몸을 돌릴 때 꼬리가 유리에 닿습니다. 먹은 만큼 몸이 자라지 않습니다. 물은 늘 탁합니다.
  > {n}은…
  > ① 좁은 수조를 끝에서 끝까지 쉬지 않고 오간다
  > ② 주인이 볼 때마다 유리 앞에서 몸을 크게 돌려 보인다
  > ③ 가운데에서 움직임을 줄인다
- 숨은 판정:
  - ① 힘 판정 없음. 힘 +1, 수조 벽 충돌로 inj_fin·inj_skin 확률.
  - ② 애교 need 65 (회색: comet 45, pleco 30, channa 50, gar 40). 성공 → relay·casual은 "너무 커졌다"며 넘김(handed_over +1, EV-HLT 이외 나눔 사건), learner·expert·grandma는 더 큰 수조.
  - ③ 근성 need 60 자동 → 이번 턴 변형 진행 정지.
- 종별 결과:
  - comet·koi: 몸길이가 멈추고 척추가 휘는 변형(stunted=1), 수명 대폭 단축.
  - oscar: 몸이 짧고 높아지며, 수질 악화로 HLLE 동반(EV-HLT-26).
  - arowana: 몸을 돌릴 때마다 머리·턱을 유리에 부딪혀 아래턱 변형, 눈 처짐 관련 사건 연결(다른 영역).
  - pleco: 근성 cap 95 → 오래 버티지만 수조가 배설물로 가득 → nh3 반복.
  - gar: 성장 잠재력이 가장 크고 좁은 수조에서 척추 굽음, 주둥이 손상.
  - channa·motoro: 꼬리·원반 가장자리 손상.
- 🔴 배드엔딩 「작은 집」 (comet in 원형 어항): 몇 년 동안 {n}의 몸은 어항 지름에 맞춰 멈춥니다. 몸길이는 그대로인데 척추 마디가 한쪽으로 휩니다. 몸이 휘면서 부레가 눌려 수평을 잡기 어려워집니다. 고인 물의 암모니아가 아가미를 계속 자극해 새엽 끝이 두꺼워집니다. {n}은 어항 벽을 따라 같은 방향으로 계속 돕니다. 어느 날 아침 {n}은 휜 몸 그대로 바닥에 누워 있고, 어항은 창가에서 햇빛을 받고 있습니다.
- 😂 블랙 코미디 (koi, 애교 80+): 원룸 어항에서 몸이 휜 채 자란 {n}을 본 이웃 할머니가 마당 연못으로 데려갔습니다. 휜 몸으로 헤엄치는 {n}을 동네 사람들은 "춤추는 잉어"라고 불렀습니다. 휘어 버린 척추는 다시 펴지지 않았습니다.
- 남김: stunted, inj_spine, hlle(oscar), handed_over(②) → relay 루트
- 주인 학습: expert 100 / learner 70 / grandma 50 / casual 10 / relay 0(넘김으로 해결) / decor 5. 성공 → tankL 상향.
- [출처: 관상어 성장 억제와 사육 공간·수질(어류 생리학), 작은 수조 금붕어 기형 사례]

---

## C. 질병 — 실제 병원체 · 종별 병리

### EV-HLT-18 하얀 점 — 백점병 (치료 방법이 종마다 다르다)
- 장소: 전 장소 (특히 shop_tank, mart_tank 직후, 수온 급변 후)
- 주인: 전체
- 종: 전 종이 걸림. 감수성 차이:
  - 매우 높음: clownloach(1순위), altum, neon, ghost, motoro, peapuffer, fig8(담수 유지 시)
  - 보통: betta, guppy, platy, apisto, cory, oscar, arowana, gold, koi
  - 낮음: pleco, bichir, gar, channa (그래도 걸림)
  - 치료법 차이: 열대어는 수온을 올려 생활사를 빠르게 돌리고 유영충 단계에 약을 맞힘 / gold·koi는 고온 요법을 크게 쓸 수 없음(냉수성, 고온에 산소 부족) → 소금·약 위주 / scaleless는 약 반 용량 필수 / 무척추(달팽이)가 있으면 구리·말라카이트 그린 위험
- 조건: temp 급변 또는 qt=0 신규 입수, 또는 EV-HLT-09·EV-HLT-08 연결
- 화면:
  > 지느러미 끝에 작은 흰 점이 몇 개 보입니다. 다음 날 점이 몸통까지 번집니다. 몸 여기저기가 따끔거려 가만히 있을 수가 없습니다.
  > {n}은…
  > ① 바닥 돌과 수초에 몸을 비빈다
  > ② 주인 앞으로 나와 지느러미를 다 펴고 멈춘다
  > ③ 수초 사이에 지느러미를 접고 가만히 있는다
- 숨은 판정:
  - ① 판정 없음. 상피가 긁혀 inj_skin(2차 감염 ↑). 가려움 해소 연출만 있고 병은 진행.
  - ② 애교 need 60 (회색: comet, pleco, channa, bichir, gar). 성공 → 주인이 흰 점을 발견 → 주인 유형별 치료 분기(아래).
  - ③ 근성 need 50 자동, 실패 시 아가미 감염 단계로 진행.
- 주인 치료 분기 (② 성공 또는 3턴 경과 시 자동 발견):
  - expert·staff: 격리 + 종에 맞는 방법(열대어 고온+정량, 비늘 없는 종 반 용량, 금붕어 소금+약). 생존 90%.
  - learner: 라벨대로 정량 → scaleless면 EV-HLT-37/일반 약품 과민 사건으로 분기(라벨 확인 판정 50%).
  - eager·alchemist: 약 여러 개 동시 → EV-HLT-36.
  - casual·content·gift: 마트 백점약 정량, 환수 없음 → 기본 생존 50%, scaleless 20%.
  - neglect·cult: 치료 없음 → 근성 판정만.
  - 고온 요법을 gold·koi에 그대로(learner 오해): 산소 부족 + 대사 폭증 → EV-HLT-10 배드 문장 재사용.
- 종별 결과:
  - clownloach: "죽은 척" 습성 때문에 주인이 늦게 발견(발견 턴 +1, 훈련 부작용).
  - motoro·ghost: 피부가 얇아 점이 크게 보이고 상피 손상 깊음. 약 민감.
  - gold·koi: 소금 치료 효과 좋음. 회복 후 면역(재감염 확률 ↓).
  - betta·wildbetta: 긴 지느러미가 먼저 덮여 무게로 처짐 → finrot 병발.
  - 아가미 감염이 주된 사망 원인: 몸에 점이 적어도 아가미에 많으면 갑자기 죽음.
- 🔴 배드엔딩 「소금 같은 점」: 백점충이 피부 상피 아래로 파고들어 자리를 잡습니다. 상피가 그 위를 덮어 작은 흰 혹이 됩니다. 혹마다 다 자란 충체가 피부를 뚫고 나오고, 그 자리에 구멍이 남습니다. 아가미 새엽 사이사이에도 충체가 박혀 새엽이 두꺼워지고 서로 붙습니다. {n}은 수면 바로 아래에서 아가미 뚜껑을 크게 벌리며 같은 자리에 떠 있습니다. 피부 구멍으로 물이 스며들어 몸의 염분이 빠져나갑니다. {n}은 수초 잎에 기댄 채 아가미만 움직이다가 멈춥니다.
- 🟢 생존: 흰 점이 떨어진 자리가 2턴 동안 거칠게 남음(scar). 근성 +3.
- 남김: ich, inj_skin, inj_gill, near_miss, toxin(약 종류) → EV-HLT-36·37·38, EV-HLT-22
- 주인 학습: 위 분기 + near_miss 후 qt 학습(expert 100 / learner 60 / staff 80 / breeder 50 / 나머지 ≤20). 성공 → owner_learned:[qt, scaleless_dose].
- [출처: Ichthyophthirius multifiliis 생활사와 수온, 비늘 없는 어종 약물 감수성, 금붕어 백점병 소금 치료]

### EV-HLT-19 금가루 — 벨벳병
- 장소: home_room, shop_tank, breeder_room, farm_rack
- 주인: casual, eager, breeder, mill, gift, unbox
- 종: labyrinth(betta·wildbetta) 최다, 이어서 small(neon·guppy·platy·apisto), gold. 대형어·pleco·bichir·gar·channa 낮음.
  - 육안 구분 어려움: 점이 백점보다 훨씬 작고 노랗게 빛남. 손전등을 비스듬히 비춰야 보임.
- 조건: temp low/불안정, mill 출신(병 사육), qt=0, 조명 강함
- 화면:
  > 몸 표면이 빛을 받으면 금빛 먼지가 앉은 것처럼 보입니다. 지느러미를 펴는 것이 힘들고 자꾸 몸에 붙습니다. 숨이 빨라집니다.
  > {n}은…
  > ① 어두운 수초 그늘을 찾아 들어간다
  > ② 수면에서 공기를 자주 마신다
  > ③ 바닥에서 지느러미를 접고 가만히 있는다
- 숨은 판정:
  - ① 영리함 need 45 (회색: guppy 35, platy 35, neon 40, oranda 30, comet 40, ryukin 30). 성공 → 이 기생충은 몸속에 엽록체가 있어 빛으로 에너지를 얻음 → 어두운 곳에서 진행 둔화(턴 지연).
  - ② airbreather만: 근성 need 45. 성공 → 아가미 손상을 공기 호흡으로 보완, 시간 벌기. 비공기호흡 종은 연출만.
  - ③ 근성 need 50 자동.
- 주인 치료: expert·staff·breeder = 소등(암막) + 수온 조정 + 구리계 또는 전용 약(무척추·scaleless 주의) → 생존 80%. learner = 백점약으로 오진(50%) → 효과 약함. casual·gift = 발견 못 함(금빛이 "원래 색"으로 보임) → 근성 판정만. mill = 출하 전 일괄 약욕, 실패 개체 폐기.
- 종별 결과:
  - betta: 원래 화려한 체색 때문에 발견 지연(+1턴). 지느러미 접힘(clamped fins)이 첫 신호.
  - wildbetta: 영리함 cap 65 → ① 성공률 높음.
  - neon: 몸이 작아 아가미 감염 시 1턴 내 사망.
  - gold: 진행 느림, 발견 쉬움(주황 몸 위 금가루는 오히려 안 보이고 흐린 막으로 보임) → 50:50.
- 🔴 배드엔딩 「금가루」: 와편모충이 {n}의 피부와 아가미 상피에 뿌리 같은 돌기를 박아 넣습니다. 그 아래 상피세포가 죽어 떨어지고, 피부가 빛을 받아 노랗게 반짝입니다. 지느러미 막이 몸 쪽으로 오그라들어 펴지지 않습니다. 아가미 새엽 표면이 기생충으로 덮여 두꺼워집니다. {n}은 수면에 올라가 공기를 마시고, 다시 내려오고, 다시 올라갑니다. 공기를 마셔도 피부와 아가미의 상처는 계속 넓어집니다. 사흘째 {n}은 수면 거품집 옆에서 지느러미를 붙인 채 떠 있습니다.
- 🟢 생존: 암막 3일 후 회복. 영리함 +2. 주인이 "불을 끄니까 나았다"를 기억 → 이후 조명 시간 단축.
- 남김: velvet, inj_gill, inj_skin, light24=0(학습 시) → finrot·fungus 2차 감염
- 주인 학습: expert 100 / staff 90 / breeder 70 / learner 50 / casual 10 / gift 5. 성공 → owner_learned:[velvet_check].
- [출처: Piscinoodinium pillulare 생물학(엽록체 보유, 광 의존성), 벨벳병 진단·치료(어병학)]

### EV-HLT-20 안장 모양 흰 반점 — 컬럼나리스 (따뜻하게 하면 더 빨라지는 병)
- 장소: shop_tank, mart_tank, wholesale, farm_rack, home 전반
- 주인: 전체 (특히 백점병처럼 보여 고온 요법을 쓰는 learner·eager)
- 종: livebearer(guppy·platy) 최다(대량 양식 개체), gold, koi, betta, altum, neon, clownloach, cory. 대형어도 걸림(oscar·arowana 입 주변). 진행 속도: 수온 높을수록 빠름.
- 조건: 운송 직후·과밀·수질 악화(nh3 ≥1), 또는 shimmy·stunted 개체, temp=high
- 화면:
  > 등지느러미 아래 피부가 하얗게 바래 갑니다. 하얀 자리가 등 양옆으로 번져 띠처럼 보입니다. 입 주변이 솜털처럼 뿌옇게 일어납니다.
  > {n}은…
  > ① 주인 앞에서 등을 보이며 천천히 돈다
  > ② 여과기 물살이 약한 구석으로 간다
  > ③ 바닥에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 55. 성공 → 주인 발견. 주인 분기:
    - expert·staff: "컬럼나리스" 정확 진단 → 수온을 오히려 약간 낮추고, 소금(scaleless 제외) + 항생제 약욕 → 생존 75%.
    - learner: 50% 확률로 "곰팡이"로 오진 → 항진균제 → 효과 없음(EV-HLT-21) / 50% 정확.
    - eager·casual: 백점병으로 오진 → 수온 올림 → 진행 ×2.
  - ② 영리함 need 40. 성공 → 체력 소모 줄여 1턴 지연.
  - ③ 근성 need 55 자동.
- 종별 결과:
  - guppy·platy: 하루 이틀 안에 끝나는 급성형 흔함 → 근성 판정 need +15.
  - gold·koi: 입 주변 침식 → 먹이를 못 먹음 → EV-HLT-21과 겹침.
  - betta: 지느러미 끝과 몸통 동시.
  - altum: 수입 직후 대량 폐사 원인 중 하나 → EV-HLT-44.
  - scaleless(cory·clownloach): 소금 사용 시 EV-HLT-37 추가.
  - 아가미형: 겉은 멀쩡한데 아가미가 썩어 들어감 → 발견 불가, ② ③만 의미.
- 🔴 배드엔딩 「안장」: 실 모양 세균이 등지느러미 아래 피부에 무리 지어 붙습니다. 세균이 내는 효소가 상피와 그 아래 진피를 녹여, 비늘이 빠진 자리에 하얀 띠가 생깁니다. 띠는 하루 사이에 옆구리로 내려와 몸통을 안장처럼 감쌉니다. 같은 세균이 아가미 새엽 끝을 갉아 새엽이 짧고 하얗게 변합니다. {n}은 물살이 약한 구석에서 지느러미를 저어 자세를 유지합니다. 주인이 수온을 올린 밤, 하얀 띠가 근육까지 내려가고 {n}은 그 띠를 위로 한 채 기울어집니다.
- 🟢 생존: 등에 비늘 없는 흉터(scar). 이후 컬럼나리스 재발 시 진단 빨라짐(주인 학습 보정).
- 남김: columnaris, inj_skin, inj_gill, temp=high(오진 시), scar → EV-HLT-21, EV-HLT-37
- 주인 학습: expert 100 / staff 90 / learner 50 / eager 20 / casual 5. 성공 → owner_learned:[columnaris_vs_ich].
- [출처: Flavobacterium columnare 병리와 수온 의존성, 컬럼나리스 치료(어병학)]

### EV-HLT-21 입 곰팡이라는 이름 — 오진과 항진균제
- 장소: home 전반, shop_tank
- 주인: learner, eager, alchemist, casual, grandma
- 종: gold, koi, livebearer, betta, oscar, arowana, channa(입이 큰 종은 입 손상 시 먹이 못 먹음 영향 큼). 
- 조건: columnaris 입 주변형, 또는 inj_skin 입 주변(EV-HLT-12 먹이 경쟁·유리 충돌 후)
- 화면:
  > 입술 가장자리가 하얗게 부풀어 있습니다. 먹이를 물면 아픕니다. 입을 다물 때 무언가 걸리는 느낌이 있습니다.
  > {n}은…
  > ① 먹이를 물었다가 뱉기를 반복한다
  > ② 주인이 오면 입을 벌리고 유리에 대고 멈춘다
  > ③ 먹이를 포기하고 구석에 있는다
- 숨은 판정:
  - ① 판정 없음. weight -1. 주인 content·casual은 "입맛이 없나" → 먹이 교체(효과 없음).
  - ② 애교 need 65 (회색: comet, pleco, channa, bichir, gar, wildbetta, platy, ghost). 성공 → 사진을 찍어 커뮤니티 질문 → 첫 댓글이 "입 곰팡이 아니고 컬럼나리스예요"일 확률 = 주인 유형 보정(learner 60 / grandma 20 / eager 30).
  - ③ 근성 need 50 자동.
- 종별 결과:
  - 오진 → 항진균제 투여: 원인이 세균이라 효과 없음 → 1턴 낭비 후 EV-HLT-20 배드로 진행. 정진 → 항생제 약욕 → 생존.
  - oscar·arowana·channa: 입 주변 조직 손실이 크면 회복 후에도 아래턱 변형(inj_spine 대신 scar_jaw).
  - gold·koi: 입이 작아 침식이 빠르게 입 안쪽 점막까지 감.
  - betta: 입 손상 + 공기 호흡 방해 → 수면 호흡 시 고통 연출.
- 🔴 배드엔딩 「곰팡이약」: 입술 가장자리 피부가 세균에 녹아 하얀 솜 같은 조직으로 일어납니다. 주인은 곰팡이약을 넣고 사흘을 기다립니다. 그동안 세균은 입술 연골을 지나 아래턱뼈 표면까지 내려갑니다. {n}은 먹이를 물려고 입을 벌리지만 위아래 턱이 맞물리지 않습니다. 녹은 입술 사이로 물이 새어 아가미로 가는 물흐름도 약해집니다. {n}은 먹이가 떨어진 자리 위에서 입을 벌린 채 천천히 가라앉습니다.
- 남김: columnaris, weight=thin, scar_jaw, toxin(항진균제) → 주인 "약이 안 들었다" → alchemist화 확률(eager → 약 추가 구매)
- 주인 학습: learner 60 / expert 100 / grandma 20 / eager 20(대신 약 하나 더) / alchemist 거꾸로. 성공 → owner_learned:[columnaris_vs_ich].
- [출처: "mouth fungus"가 Flavobacterium columnare 감염이라는 어병학 기술]

### EV-HLT-22 녹는 지느러미 — 지느러미 썩음병
- 장소: home_room, office, mart_tank, breeder_room
- 주인: cult(병 베타), neglect, casual, mill, gift
- 종: longfin(betta·oranda·ryukin·guppy) 최다. 그 외 전 종 가능(수질 악화 시). 
  - betta "플레어링" 훈련 부작용으로 확률 ↑ (FISH_REWORK)
  - 지느러미 물기 합사(nipper: peapuffer·fig8·clownloach가 longfin 물기) 후 감염
  - koi·comet·pleco·gar: 지느러미가 짧고 두꺼워 진행 느림
- 조건: no3 ≥ 2 또는 nh3 ≥ 1, inj_fin, mates=nipper
- 화면:
  > 꼬리지느러미 끝이 들쭉날쭉해졌습니다. 가장자리가 하얗거나 검게 변했습니다. 매일 조금씩 짧아집니다.
  > {n}은…
  > ① 지느러미를 크게 펴 주인에게 보인다
  > ② 수초 잎 위에 올라가 쉰다
  > ③ 바닥에서 지느러미를 접고 있는다
- 숨은 판정:
  - ① 애교 need 60 (회색: comet, pleco, channa, bichir, gar). 성공 → 주인 발견 → 환수 + (필요 시) 항균제 → 진행 정지. 지느러미는 다시 자라지만 모양이 다름(scar_fin).
  - ② 근성 need 45 → longfin은 무거운 지느러미 쉬게 해 진행 1턴 지연.
  - ③ 근성 need 50 자동.
- 종별 결과:
  - betta: 가장 빠르게 눈에 띄지만 cult 주인은 "베타는 원래 지느러미가 잘 상해요"로 무시.
  - oranda·ryukin: 꼬리 갈라진 부분부터 녹음, 부레 이상과 겹치면 헤엄 못 함.
  - guppy: 수컷 꼬리가 짧아지면 mill에서 등급 탈락 → 폐기 루트.
  - 기조까지 녹아 몸통에 닿으면 "몸통 썩음"으로 진행 → 배드.
  - 회복 시: 지느러미가 다시 자라며 기조가 꼬이거나 색이 다른 띠가 남음(scar_fin). 플레어링 애교 -5.
- 🔴 배드엔딩 「짧아지는 꼬리」: 세균이 지느러미 막의 가장자리부터 녹이고 들어옵니다. 막이 녹은 자리에 지느러미 기조만 가시처럼 남았다가 그것도 끊어집니다. 녹는 선은 하루에 몇 밀리미터씩 몸 쪽으로 다가옵니다. 꼬리자루에 닿자 피부가 붉게 짓무르고 비늘이 빠집니다. {n}은 남은 지느러미 밑동을 저어 헤엄치려 하고, 짓무른 꼬리자루가 수초에 쓸립니다. 세균이 혈관으로 들어가 몸 곳곳에 붉은 출혈점이 생기고, {n}은 꼬리가 없는 몸으로 수면 가까이에 머물다 가라앉습니다.
- 남김: finrot, inj_fin, scar_fin, near_miss → dropsy(혈류 감염 시), EV-HLT-23
- 주인 학습: learner 70 / expert 100 / breeder 60(값 나가는 개체만) / gift 20 / casual 10 / cult 0 / mill 0. 성공 → owner_learned:[water_change].
- [출처: Aeromonas·Pseudomonas 지느러미 부식(어병학), 수질과 지느러미 썩음]

### EV-HLT-23 솜털 — 물곰팡이 (사프롤레그니아)
- 장소: home 전반, pond_outdoor(겨울), breeder_room(알)
- 주인: 전체
- 종: 전 종. 차가운 물에서 잘 퍼짐 → gold·koi(겨울 연못), tropical(heater=0). 상처가 있는 개체만 걸림(건강한 피부엔 잘 안 붙음).
  - 상처 원인 연결: 손으로 잡기(touch·unbox), 그물, 점프 후 바닥, 물이 긁기, 닻벌레 제거 자리.
- 조건: inj_skin 또는 inj_fin 또는 slime_loss, temp=low 가중
- 화면:
  > 며칠 전 다친 자리에 흰 솜털 같은 것이 자랍니다. 물살에 털이 흔들립니다. 그 아래가 욱신거립니다.
  > {n}은…
  > ① 솜털이 난 쪽을 돌에 문질러 떼어 내려 한다
  > ② 주인 앞에서 다친 쪽을 보인다
  > ③ 가만히 있는다
- 숨은 판정:
  - ① 힘 need 35. 성공 → 솜털 일부 떨어짐. 실패 → 상처 확대(inj_skin +1). 어느 쪽이든 균사는 남음.
  - ② 애교 need 55 (회색: comet, pleco, channa, bichir, gar). 성공 → 주인 발견:
    - gold·koi: 소금 + 수온 조금 올림 → 생존 80%.
    - tropical: 히터 + 항진균제 → 생존 70%.
    - scaleless: 소금 금지 → 반 용량 약 → 주인 학습 여부에 따라 EV-HLT-37.
  - ③ 근성 need 55 자동.
- 종별 결과:
  - koi·comet: 겨울 연못에서 큰 상처에 생기면 근육까지 파고듦.
  - oranda: 육혹 주름 사이에 생기면 발견 늦음.
  - motoro: 배 쪽(모래와 닿는 면)에 생겨 주인이 못 봄.
  - 알(번식 사건): 무정란에서 시작해 옆 알로 번짐 → breeder 사건 연결.
- 🔴 배드엔딩 「솜」: 상처 위에 내려앉은 물곰팡이 포자가 싹을 틔웁니다. 가는 균사가 상처 안쪽 진피와 근육 사이로 뻗어 들어갑니다. 바깥으로는 하얀 솜털이 자라 물결에 흔들립니다. 균사가 지나간 자리의 근육이 회색으로 변하고 물러집니다. {n}은 솜털이 난 쪽을 돌에 문지르고, 문지를 때마다 솜과 함께 물러진 살점이 떨어져 나갑니다. 상처로 물이 계속 스며들어 몸의 염분이 빠집니다. {n}은 상처를 위로 하고 바닥에 눕고, 솜털은 그 위에서 계속 자랍니다.
- 남김: fungus, inj_skin(확대), scar
- 주인 학습: 상처 원인 쪽 학습(손으로 잡지 않기, 그물 사용) → touch·unbox는 0.
- [출처: Saprolegnia spp.(난균류) 2차 감염, 저수온과 발병]

### EV-HLT-24 솔방울 — 복수(腹水)와 주인의 마지막 결정
- 장소: home 전반, office
- 주인: 전체 (이 사건의 핵심은 주인 분기)
- 종: gold(최다, 특히 oranda·ryukin), betta, guppy, platy, koi(나이 많음), oscar. pleco·cory는 갑옷 판 때문에 비늘 들림이 잘 안 보이고 배 팽창으로만 보임.
- 조건: 다음 중 둘 이상 — weight=fat, finrot/columnaris 이력, no3 ≥2, 나이 후반, EV-HLT-11 겨울 과급이
- 화면:
  > 배가 계속 부풀어 오릅니다. 위에서 보면 비늘이 몸에서 들떠 솔방울처럼 일어서 있습니다. 눈이 조금 튀어나왔습니다.
  > {n}은…
  > ① 먹이가 떨어지면 그래도 수면으로 올라간다
  > ② 주인 손가락이 유리에 닿으면 그쪽으로 다가간다
  > ③ 바닥에서 거의 움직이지 않는다
- 숨은 판정:
  - ① 근성 need 60 → 성공 시 1턴 연장(회색: neon, altum, peapuffer, ghost, motoro, apisto, clownloach, wildbetta).
  - ② 애교 need 50 → 성공 시 주인 분기 진입.
  - ③ 판정 없음. 다음 턴 배드 확률 70%.
- 주인 분기 (복수는 대부분 콩팥 기능 상실·전신 세균 감염의 마지막 단계라 회복이 드물다):
  - expert·staff: 엡솜염(황산마그네슘) 약욕 + 항생제로 1~2턴 시도 → 회복 15%. 실패 시 정향유로 안락사 → 🕊 엔딩 「정향유」.
  - learner: 같은 시도, 안락사 방법 검색 성공 50%.
  - grandma: "물고기도 아프면 병원 가야지" → 수의사(드묾, 회복 20%, 실패 시 안락사).
  - casual·content·gift·relay: 아직 살아 있는 채로 변기에 버림 → 🔴 「변기」.
  - neglect·cult: 그대로 둠 → 🔴 「솔방울」.
- 종별 결과:
  - oranda·ryukin: 부레 압박으로 뒤집힘 동반.
  - betta: 배 팽창 + 눈 돌출이 빨리 보임 → 발견 쉬움.
  - koi: 몸이 커서 진행 길어짐(고통 기간 ↑).
  - pleco·cory: 배 팽창만 보여 "알 밴 줄 알았다" → 발견 늦음.
- 🔴 배드엔딩 「솔방울」: 콩팥이 물을 내보내지 못하게 됩니다. 몸에 남은 물이 복강과 비늘 주머니 아래에 고입니다. 배가 둥글게 부풀고, 비늘 하나하나가 아래에서 밀려 몸통에서 일어섭니다. 눈 뒤에도 물이 차 안구가 앞으로 밀려 나옵니다. {n}은 부푼 배 때문에 꼬리 쪽이 가라앉아 머리를 위로 한 채 헤엄칩니다. 아가미 뚜껑이 점점 느려지고, {n}은 비늘이 일어선 채 바닥에 비스듬히 닿습니다.
- 🔴 배드엔딩 「변기」: 주인이 {n}을 그물로 떠서 변기에 넣습니다. {n}은 물에 닿자 꼬리를 젓습니다. 물이 내려가며 {n}은 좁은 배수관 안으로 휩쓸려 들어갑니다. 부푼 배가 관 벽에 쓸리고, 일어선 비늘이 꺾여 떨어집니다. 그 뒤로 {n}이 어디까지 살아 있었는지는 아무도 모릅니다.
- 🕊 엔딩 「정향유」 (배드 아님, 별도 분류 '보내 줌'): 주인이 수조 물을 작은 그릇에 덜고 정향유를 몇 방울 풀어 흔듭니다. {n}이 그릇으로 옮겨집니다. 아가미 뚜껑이 천천히 느려지고, {n}은 그릇 바닥에 옆으로 눕습니다. 주인은 한참 뒤 정향유를 더 넣고, 아가미가 완전히 멈춘 것을 확인합니다. 그날 밤 주인은 원인을 노트에 적습니다.
- 남김: dropsy → 엔딩
- 주인 학습: 안락사 엔딩은 주인 학습을 다음 생 "추모관 메모"로 남김(게임 외부 효과 없음).
- [출처: 어류 복수증(dropsy)의 원인과 예후, 관상어 안락사 지침(AVMA 어류 안락사 지침·정향유/유제놀), 살아 있는 물고기 변기 처리 문제]

### EV-HLT-25 뒤집힌 배 — 부레 이상 (치료 루트)
- 장소: home 전반
- 주인: 전체
- 종: oranda·ryukin(짧은 몸, 최다), betta(과식), 그 외 드묾. FISH_REWORK #7(밥알·식빵)의 치료·분기 확장.
  - comet·koi는 몸이 길어 거의 없음(확률 ×0.1)
- 조건: EV-HLT-12 과식, 마른 사료 수면 급이(공기 삼킴), 밥알·식빵, 저수온 급변
- 화면:
  > 몸이 마음대로 기울어집니다. 꼬리를 저으면 머리가 아래로 박히고, 멈추면 배가 위로 떠오릅니다.
  > {n}은…
  > ① 꼬리를 세게 저어 바로 서려 한다
  > ② 수초 잎이나 바닥 돌 사이에 몸을 끼워 기울지 않게 한다
  > ③ 기울어진 채 가만히 떠 있는다
- 숨은 판정:
  - ① 힘 need 30 (oranda cap 25 → 회색; ryukin 30 가능). 성공 → 일시 회복 연출, 실패 → 체력 소모.
  - ② 영리함 need 30 (oranda 30, ryukin 30 가능). 성공 → 체력 보존, 1턴 지연.
  - ③ 판정 없음.
- 주인 분기:
  - expert·learner: 2~3일 금식 → 껍질 깐 데친 완두콩 → 수위 낮추기 → 가라앉는 사료로 변경 → 회복 60%(만성형은 재발).
  - grandma: 밥알을 더 줌("기운 내라고") → 악화.
  - content: 뒤집힌 채 헤엄치는 영상 → "귀엽다" 댓글 → 학습 0.
  - casual: 방치 → 만성 → FISH_REWORK #7 배드.
- 종별 결과:
  - oranda: 육혹이 무거워 머리가 아래로 박히는 형태.
  - ryukin: 등이 높아 옆으로 눕는 형태.
  - betta: 대부분 과식 변비 → 금식으로 빨리 회복(80%).
  - 만성형: 수면에 뜬 배 피부가 공기에 마르고 갈라짐(FISH_REWORK #7) → 2차 감염.
- 🔴 배드엔딩: FISH_REWORK #7 문장을 규칙 2로 다시 씀 — 장에 찬 가스와 사료가 부레를 눌러 {n}의 배가 위로 떠오릅니다. {n}은 꼬리를 저어 몸을 뒤집으려 하고, 멈추는 순간 다시 배가 수면 위로 나옵니다. 공기에 닿은 배 피부가 마르면서 비늘 사이 피부가 하얗게 갈라집니다. 갈라진 틈으로 세균이 들어가 배 피부가 붉게 짓무릅니다. 몇 주 동안 {n}은 뒤집힌 채로 먹이를 받아먹습니다. 어느 날 아침 {n}은 같은 자세로 떠 있고, 꼬리는 움직이지 않습니다.
- 😂 블랙 코미디 (oranda 애교 85+, 만성형 생존): 주인은 뒤집혀서도 손가락을 따라오는 {n}을 위해 수위를 손가락 두 마디 높이로 낮춘 전용 수조를 만들었습니다. {n}은 바닥에 배를 대고 걸어 다니듯 헤엄치며 7년을 더 살았습니다. 주인은 끝내 밥알을 끊지 않았지만 양은 줄였습니다.
- 남김: swimbladder, weight, near_miss
- 주인 학습: expert 100 / learner 70 / grandma 30 / content 10 / casual 5. 성공 → owner_learned:[sinking_food].
- [출처: 팬시 금붕어 부레 이상 원인(체형·급이), 금식·완두콩 관리(관상어 수의 자료)]

### EV-HLT-26 머리의 구멍 — HLLE
- 장소: home_living, office, restaurant, cafe
- 주인: content, casual, decor, shared, techbro(활성탄 과다 사용 가설)
- 종: oscar(대표), apisto·altum(시클리드), arowana(드묾), motoro(해당 없음). gold·small 종 해당 없음.
- 조건: no3 ≥ 2 장기, 단조로운 먹이(먹이 붕어·한 가지 사료), small_tank, weight=fat
- 화면:
  > 눈 위쪽 피부에 작은 구멍이 몇 개 생겼습니다. 구멍이 옆줄을 따라 늘어섭니다. 유리에 비친 얼굴이 낯섭니다.
  > {n}은…
  > ① 주인 얼굴을 알아보고 유리 앞에서 먹이를 조른다
  > ② 은신처 돌을 입으로 밀어 옮긴다
  > ③ 은신처 안에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 70 (oscar cap 85 가능, apisto 80 가능, altum 90 가능, arowana 80 가능). 성공 → 주인이 얼굴을 가까이 봄 → 구멍 발견 → 분기.
  - ② 힘 need 50(oscar만 의미, 돌 옮기기 훈련) → 성공 시 주인 주의 끌기 + 히터 넘어뜨림 확률(다른 영역 사건).
  - ③ 근성 need 60 자동, 진행 1단계.
- 주인 분기: 원인이 하나로 정리되지 않은 병(수질·영양·장내 편모충·활성탄 등 가설이 여러 개) → expert·learner는 대환수 계획 + 사료 다양화 + 필요 시 메트로니다졸 → 진행 정지 70%, 흉터 남음. content는 "얼굴 상처 영상" → 학습 낮음. casual은 "싸워서 생긴 상처"로 오해.
- 종별 결과:
  - oscar: 얼굴 흉터가 영구적으로 남음 → 애교 -10, 다만 "주인 알아봄" 특성은 유지.
  - apisto·altum: 작은 몸이라 구멍이 깊어지면 감염 → 사망 확률 높음.
  - arowana: 옆줄 침식 형태.
- 🔴 배드엔딩 「구멍」: 머리와 옆줄을 따라 피부가 움푹 패입니다. 패인 자리의 상피가 사라지고 그 아래 연조직이 드러납니다. 구멍들이 서로 이어지며 눈 위쪽부터 아가미 뚜껑까지 한 줄의 골이 됩니다. 드러난 조직에 세균이 붙어 골의 가장자리가 하얗게 짓무릅니다. {n}은 여전히 주인 얼굴이 보이면 유리 앞으로 나와 지느러미를 흔듭니다. 먹이를 조르는 횟수가 줄고, 은신처 안에서 머리를 벽에 대고 있는 시간이 길어집니다. 어느 저녁 {n}은 주인이 다가와도 은신처에서 나오지 않습니다.
- 남김: hlle, scar(얼굴), weight
- 주인 학습: expert 100 / learner 60 / content 25 / casual 10 / decor 5. 성공 → owner_learned:[water_change, varied_diet].
- [출처: HLLE 원인 가설(수질·영양·활성탄·Hexamita)과 오스카 사례, "원인 미확정" 명시]

### EV-HLT-27 항문의 빨간 실 — 카말라누스
- 장소: farm_rack, breeder_room, mart_tank, home 전반
- 주인: mill(출처), breeder, casual, gift, relay(나눔 개체)
- 종: livebearer(guppy·platy) 최다. 이어서 betta, neon, apisto, cory. 포식어가 감염 구피를 먹으면 옮을 수 있음(oscar·arowana·channa·peapuffer).
- 조건: mill·farm_rack 출신, qt=0, 다른 수조 개체 합사
- 화면:
  > 배가 홀쭉해지는데 먹이는 계속 먹고 싶습니다. 꼬리 근처에서 무언가 가늘고 붉은 것이 흔들립니다. 몸을 웅크리면 그것이 다시 안으로 들어갑니다.
  > {n}은…
  > ① 먹이 시간마다 가장 먼저 올라가 많이 먹는다
  > ② 주인 앞에 꼬리를 보이며 멈춘다
  > ③ 무리 속에 섞여 가만히 있는다
- 숨은 판정:
  - ① 판정 없음. 연출(먹어도 마름). weight 변화 없음.
  - ② 애교 need 55. 성공 → 주인이 "물고기 엉덩이 빨간 실" 검색 → 구충제(레바미솔·펜벤다졸 계열)로 수조 전체 치료 → 생존 75%. 단 learner가 1회 투약만 하면 알·유충이 남아 재발(50%).
  - ③ 근성 need 55 자동(회색 아님).
- 종별 결과:
  - guppy: 체격 대비 기생충이 커서 2턴이면 배드. 임신한 암컷은 사산·조산.
  - platy: 근성 cap 65 → 조금 더 버팀.
  - betta: 단독 사육이라 감염원 없으면 발생 안 함(mill 출신만).
  - 포식어: 먹이 구피 경로. 진행 느림, 체중 감소로만 나타남.
  - 수조 전체 문제: 한 마리 발견 = 대부분 감염 → 주인은 전체 투약해야 함(무척추 영향 주의).
- 🔴 배드엔딩 「빨간 실」: 선충이 {n}의 창자 벽에 입을 박고 피를 빨아먹습니다. 수가 늘어나면서 창자 벽이 얇아지고 곳곳에 출혈이 생깁니다. 다 자란 암컷의 꼬리 끝이 항문 밖으로 나와 물속에서 흔들립니다. {n}은 먹이를 먹고 또 먹지만 등 근육이 빠져 머리만 크게 보입니다. 빈혈로 아가미 색이 연분홍으로 바랩니다. {n}은 무리 맨 뒤에서 지느러미를 접은 채 따라가다가 수초 아래로 처집니다.
- 남김: camallanus(수조 전체 플래그), weight=thin, toxin(구충제) → 같은 수조 합사어 감염
- 주인 학습: expert 100 / breeder 60(번식 라인 보호) / learner 60 / mill 0 / casual 10. 성공 → owner_learned:[qt, deworm].
- [출처: Camallanus cotti 생활사·병리, 라이브베어러 양식장 감염 보고]

### EV-HLT-28 새로 온 잉어 한 마리 — KHV
- 장소: pond_outdoor, farm_pond, restaurant 연못, temple_river 사찰 연못, touch_pool, cafe
- 주인: grandma, decor, touch, release, breeder(잉어 품평회 귀환), expert(드묾 → 격리함)
- 종: koi만(잉어 계열만 걸리는 바이러스. 같은 연못의 gold는 걸리지 않음). FISH_REWORK #16 심화.
- 조건: 새 잉어 입식 qt=0, 수온 약 16–28°C(봄·가을), 품평회·업체 연못 경유
- 화면:
  > 새로 들어온 잉어가 연못 가장자리에서 혼자 떠 있습니다. 며칠 뒤 다른 잉어들도 수면 가까이에서 입을 벌립니다. 아가미 안쪽이 쓰라립니다.
  > {n}은…
  > ① 폭포 물줄기 가까이 간다
  > ② 사람들이 오면 손바닥 쪽으로 다가간다
  > ③ 연못 가장자리 그늘에 가만히 있는다
- 숨은 판정: 바이러스는 연못 물 전체로 퍼짐 → 회피 없음. 생존은 근성 + 주인 대응.
  - ① 영리함 need 50 → 산소 보정, 1턴 연장.
  - ② 애교 need 60 → 성공 시 주인 이상 감지(grandma·expert만 수산 질병 신고/수의사). decor·touch는 "날이 더워서"로 넘김.
  - ③ 근성 need 70 자동 (koi cap 90).
- 종별 결과:
  - koi: 감염 연못 폐사율이 매우 높음. 근성 판정 성공 개체도 평생 보균(khv=carrier) → 다른 연못으로 옮겨지면(relay·release) 그곳에 퍼뜨림.
  - gold·comet(같은 연못): 걸리지 않음 → 잉어만 사라진 연못에 금붕어만 남는 장면 연출.
  - 국내에서는 법정 수산생물전염병 → expert 신고 시 연못 전체 살처분·소독 가능성(🔴/별도 엔딩 「신고」).
  - 수온을 바이러스 활동 범위 밖으로 올리는 방법은 개인 연못에서 사실상 불가(고수만 시도, 보균 남음).
- 🔴 배드엔딩 「사흘」: 바이러스가 아가미 새엽 상피세포 안에서 늘어납니다. 감염된 세포가 죽어 떨어지며 새엽에 하얗고 붉은 얼룩이 생깁니다. 얼룩진 새엽 사이에 점액과 죽은 조직이 엉겨 물이 지나가지 못합니다. {n}의 눈이 안와 안쪽으로 꺼지고, 피부 점막이 군데군데 벗겨져 거칠어집니다. {n}은 폭포 아래로 가서 입을 벌리고, 다른 잉어들도 같은 자리로 모여 서로의 몸을 밉니다. 사흘 사이 연못의 잉어가 한 마리씩 떠오르고, {n}은 그 사이에 섞여 수면에서 천천히 돕니다.
- 🟢 생존(보균): 다음 생 추모관에 "이 연못의 마지막 잉어" 표시. 이후 연못으로 옮겨지는 사건 시 전파 플래그.
- 남김: khv(감염/보균), 연못 개체 수 급감, near_miss → 신고 루트
- 주인 학습: expert 100(입식 전 격리 3주 이상) / breeder 70 / grandma 30 / decor 10 / touch 0 / release 0. 성공 → owner_learned:[qt].
- [출처: 코이 헤르페스바이러스(CyHV-3) 병리·수온 범위·폐사율·보균(OIE/WOAH 매뉴얼), 국내 수산생물전염병 지정 여부(수산생물질병 관리법)]

### EV-HLT-29 붉어지는 아가미 — 금붕어 헤르페스 (CyHV-2)
- 장소: wholesale, mart_tank, fair_stall, shop_tank, home 전반
- 주인: gift(축제·마트), casual, relay, decor(풍수 9마리), shared
- 종: gold(comet·oranda·ryukin)만. koi는 걸리지 않음(다른 바이러스). 열대어 해당 없음.
- 조건: 도매·마트에서 대량 유통 개체 입식, 수온 약 15–25°C, qt=0
- 화면:
  > 같이 온 금붕어 한 마리가 어제부터 바닥에 가라앉아 있습니다. 오늘은 두 마리입니다. 숨이 빨라지고 몸에 힘이 들어가지 않습니다.
  > {n}은…
  > ① 수면에서 먹이를 받는다
  > ② 주인이 오면 유리 앞에서 지느러미를 흔든다
  > ③ 바닥에서 다른 금붕어 곁에 가만히 있는다
- 숨은 판정: 물 전체 전파, 회피 없음.
  - ① 판정 없음.
  - ② 애교 need 60 (comet 45 회색). 성공 → learner·expert가 "금붕어 집단 폐사" 검색 → 원인 바이러스 → 치료 약은 없음, 수질 안정·스트레스 최소화로 버티게 함 → 근성 판정 need -15.
  - ③ 근성 need 60 자동 (oranda 55 → 확률 상한 낮음).
- 종별 결과:
  - comet: 근성 cap 85 → 생존 가능성 상대적 높음, 생존 시 보균.
  - oranda·ryukin: 근성 cap 낮아 대부분 배드.
  - decor(풍수 9마리): 죽는 대로 같은 색 금붕어 보충 → 새 개체도 감염 → 반복. H7 「풍수 9마리 중 진짜 생존자」 조건과 연결(comet 근성 75+ 생존 시).
- 🔴 배드엔딩 「같은 봉지」: 바이러스가 비장과 콩팥의 조혈 조직을 망가뜨립니다. 새 혈구가 만들어지지 않아 아가미 새엽이 창백하게 바랩니다. 비장과 콩팥이 부어 복강 안에서 다른 장기를 밀어냅니다. {n}은 바닥에 배를 대고 아가미 뚜껑만 빠르게 움직입니다. 피부 아래에 작은 출혈점이 번지고, 지느러미 밑동이 붉게 물듭니다. 같은 봉지로 온 금붕어들 옆에서 {n}도 옆으로 기웁니다.
- 😂 블랙 코미디 → H7 연결: 주인은 3주 동안 금붕어를 다섯 번 새로 샀습니다. {n}만 처음부터 있었습니다. 주인은 "이 집 금붕어는 오래 산다"고 손님에게 말했습니다.
- 남김: cyhv2, 수조 개체 교체 기록 → H7
- 주인 학습: expert 100(격리·도매 개체 주의) / learner 50 / decor 0 / gift 10. 성공 → owner_learned:[qt].
- [출처: Cyprinid herpesvirus 2(금붕어 조혈기 괴사증) 병리·수온, 국내 금붕어 집단 폐사 보고]

### EV-HLT-30 하얗게 굳는 등 — 네온병
- 장소: wholesale, shop_tank, home 전반
- 주인: 전체
- 종: neon 최다. 같은 기생충이 다른 테트라·잉어과 소형어·cory·apisto에도 감염 보고 있음(확률 낮게). 대형어 해당 없음.
  - 원인은 미포자충(Pleistophora hyphessobryconis). 감염된 사체를 먹으면 옮음.
- 조건: neon 무리, 수조 내 사체 방치(neglect·casual), qt=0
- 화면:
  > 무리 중 한 마리의 푸른 줄이 끊어진 것처럼 흐려졌습니다. 그 아이는 밤에도 무리를 떠나 혼자 헤엄칩니다. 다음 날 아침 그 아이가 바닥에 있고, 다른 물고기들이 그 몸을 쪼고 있습니다.
  > {n}은…
  > ① 바닥의 그 몸을 쪼는 무리에 끼어든다
  > ② 무리와 함께 수초 위쪽으로 올라간다
  > ③ 수초 사이에서 가만히 있는다
- 숨은 판정:
  - ① 판정 없음 → 감염 확률 크게 ↑ (이 사건의 핵심: 사체를 빨리 치우지 않는 주인 + 자연스러운 행동).
  - ② 영리함 need 35. 성공 → 사체 접촉 회피, 감염 확률 ↓.
  - ③ 근성 need 30 자동.
- 주인 분기: 치료법 없음. expert·staff·learner(검색 성공 시)는 증상 개체를 즉시 빼내 안락사, 나머지 무리를 지킴. casual·neglect는 사체 방치 → 수조 전체로 퍼짐.
- 종별 결과:
  - neon: 근성 cap 30, 감염 시 사실상 생존 불가 → 감염 판정 자체가 핵심(①②).
  - cory·apisto: 확률 낮음, 감염 시 진행 느림.
  - guppy·platy: 확률 매우 낮음.
- 🔴 배드엔딩 「끊어진 줄」: 미포자충의 포자가 장벽을 뚫고 등 근육 속으로 들어갑니다. 근육 섬유 안에서 포자 덩어리가 자라며 근육이 하얗고 불투명하게 변합니다. 푸른 줄 아래의 근육부터 하얘져 줄의 색이 끊긴 것처럼 보입니다. 굳은 근육 때문에 몸이 한쪽으로 휘고 헤엄이 비틀거립니다. {n}은 무리를 따라가려 꼬리를 젓지만 휜 몸은 옆으로만 밀려 나갑니다. 밤에 {n}은 무리에서 떨어져 수초 아래로 내려가고, 아침에는 다른 네온들이 그 몸을 쪼고 있습니다.
- 남김: neon_dz(수조 전체 플래그), schooling 감소
- 주인 학습: expert 100 / staff 90 / learner 50 / casual 5 / neglect 0. 성공 → owner_learned:[remove_dead].
- [출처: Pleistophora hyphessobryconis 감염 경로·병리, 치료법 부재]

### EV-HLT-31 튀어나온 눈 — 팝아이 (한쪽과 양쪽)
- 장소: home 전반, shop_tank
- 주인: 전체
- 종: 전 종 가능. 
  - 한쪽 눈: 외상(점프·충돌·싸움) → arowana·channa·comet·betta(jumper), oscar(돌 옮기기), clownloach(놀람 돌진)
  - 양쪽 눈: 수질·전신 감염 → gold(특히 oranda는 원래 눈 주변 연조직 많음), betta, guppy, oscar
  - 출목 금붕어(텔레스코프)는 우리 종 목록에 없음 → 해당 없음
- 조건: inj_eye 또는 nh3/no3 높음 또는 dropsy 진행
- 화면:
  > 한쪽 (또는 양쪽) 눈이 조금씩 앞으로 밀려 나옵니다. 눈 표면이 뿌옇게 흐려 사물이 번져 보입니다.
  > {n}은…
  > ① 보이는 쪽 눈으로 주인을 따라 몸을 돌린다
  > ② 수조 벽과 장식에서 멀리 떨어진 가운데에 머문다
  > ③ 은신처에 가만히 있는다
- 숨은 판정:
  - ① 애교 need 55 → 성공 시 발견 → 한쪽형: 환수·외상 원인 제거·엡솜염 → 회복 70%(시력 일부 손실 가능). 양쪽형: 원인(수질·감염) 치료 필요 → 회복 40%.
  - ② 영리함 need 40 → 성공 시 추가 충돌 방지(한쪽형 진행 정지).
  - ③ 근성 need 50 자동.
- 종별 결과:
  - arowana: 대형 수조 점프·충돌 → 한쪽형 흔함. 눈이 크고 안구 손상 시 시력 상실 → 먹이 사냥 실패.
  - oscar: 시력 의존 먹이 조르기 → 애교 판정 -10.
  - ghost: 시력보다 전기 감각 의존 → 시력 손실 영향 적음(판정 보정 +10).
  - bichir·cory: 후각·수염 의존 → 영향 적음.
  - 안구 파열: 진행 시 각막이 터지고 안구 내용물 유출 → 한쪽 눈 상실(inj_eye 영구).
- 🔴 배드엔딩 「밀려 나온 눈」 (양쪽형): 눈 뒤쪽 안와 조직에 세균과 체액이 고입니다. 안구가 안와에서 앞으로 밀려 나오고, 각막이 하얗게 흐려집니다. 각막 표면이 장식 모서리에 쓸려 벗겨지고 그 자리로 세균이 들어갑니다. 한쪽 각막이 터져 안구의 투명한 내용물이 물에 풀립니다. {n}은 남은 눈으로 방향을 잡으려 몸을 비스듬히 돌립니다. 몸속 감염이 콩팥까지 번져 비늘이 들뜨기 시작하고, {n}은 바닥에 눈이 없는 쪽을 대고 눕습니다.
- 🟢 생존(한쪽 실명): 😂 한쪽 눈을 잃은 {n}은 언제나 같은 방향으로만 돕니다. 주인은 먹이를 늘 왼쪽에서 넣는 법을 배웠고, 손님이 오면 "얘는 왼쪽 담당"이라고 소개했습니다.
- 남김: popeye, inj_eye, dropsy(양쪽형 진행) → EV-HLT-24
- 주인 학습: 외상 원인(lid·장식) 학습 → lid=1, 장식 모서리 제거. expert 100 / learner 60 / casual 10.
- [출처: 어류 안구돌출(exophthalmia) 원인 분류(외상 vs 전신 질환)]

### EV-HLT-32 아가미 흡충 — 포르말린과 산소
- 장소: wholesale, importer, shop_tank, pond_outdoor, home 전반
- 주인: alchemist, eager, learner, expert, staff
- 종: gold·koi(수입 개체 흔함: 아가미 흡충 Dactylogyrus), livebearer(피부 흡충 Gyrodactylus), discus형 시클리드(altum·apisto·oscar), clownloach. 대형 공기호흡어(bichir·gar·channa)는 아가미 의존도가 낮아 증상이 늦게 보임.
- 조건: 수입·도매 경유 개체 qt=0, 연못 개체 합사, EV-HLT-15
- 화면:
  > 아가미 한쪽이 자꾸 벌어진 채 닫히지 않습니다. 가끔 몸이 저절로 휙 돌며 바닥에 옆구리를 긁습니다. 아가미 안에서 무언가 꿈틀거립니다.
  > {n}은…
  > ① 바닥 모래와 돌에 아가미 쪽을 긁는다
  > ② 물살이 센 곳에서 아가미를 크게 연다
  > ③ 은신처에서 가만히 있는다
- 숨은 판정:
  - ① 판정 없음. 긁는 행동 = 주인 발견 확률 +20(이 사건에서 유일하게 ①이 주인 신호 역할). inj_gill 확률.
  - ② 근성 need 50 → 1턴 연장.
  - ③ 근성 need 55 자동.
- 주인 치료 분기:
  - expert·staff: 프라지콴텔 투약(대부분 종에 비교적 안전) + 재투약 → 생존 85%.
  - alchemist·eager: 포르말린 고농도 + 에어레이션 없음 → 🔴 「포르말린」(포르말린은 물속 산소를 소모함).
  - learner: 라벨대로 포르말린 + 에어레이션 → 생존 65%, scaleless는 반 용량 확인 판정.
  - casual: 백점약으로 오진 → 효과 거의 없음.
- 종별 결과:
  - gold·koi: 아가미형 흔함, 프라지콴텔 반응 좋음.
  - guppy·platy: 피부 흡충(새끼를 몸 안에 품고 나오는 흡충) → 무리 전체 빠른 확산.
  - airbreather(bichir·gar·channa·betta·cory·pleco): 아가미 손상을 공기 호흡으로 보완 → 근성 need -10. 대신 포르말린 저산소 사건에서도 버팀(이 경우 airbreather만 「포르말린」 회피 확률 +30).
  - motoro·ghost·clownloach: 포르말린 민감 → 반 용량 아니면 EV-HLT-37급 손상.
- 🔴 배드엔딩 「흡충」: 흡충이 아가미 새엽에 갈고리를 박고 상피를 갉아먹습니다. 상처 난 상피가 두꺼워지고 점액이 늘어 새엽 사이가 메워집니다. {n}은 아가미 뚜껑을 한쪽만 크게 연 채 숨을 쉽니다. 몸을 뒤집어 바닥에 아가미를 긁고, 긁힌 새엽 끝에서 피가 납니다. 흡충은 새엽에서 새엽으로 옮겨 가며 수를 늘립니다. {n}은 수면 바로 아래에서 아가미 뚜껑이 열린 채 멈춥니다.
- 🔴 배드엔딩 「포르말린」: 주인이 포르말린을 라벨의 두 배로 넣고 소리가 시끄럽다며 에어 펌프를 끕니다. 포르말린이 물속 산소를 소모하기 시작합니다. 흡충은 죽어 떨어지지만 그 자리의 새엽 상피도 함께 상합니다. {n}은 수면으로 올라가 입을 내밀지만 수면 근처의 산소도 줄어 있습니다. 아가미 뚜껑이 점점 크게 열렸다가 열린 채 굳습니다. 아침에 주인은 흡충이 다 사라졌는지 확인하려고 손전등을 비춥니다.
- 남김: flukes, inj_gill, toxin(formalin/praziquantel)
- 주인 학습: expert 100 / staff 90 / learner 60 / alchemist 거꾸로(약 추가) / eager 30. 성공 → owner_learned:[qt, aeration_during_meds].
- [출처: Dactylogyrus·Gyrodactylus 병리, 프라지콴텔 치료, 포르말린의 용존산소 소모(어병 치료 매뉴얼)]

### EV-HLT-33 봄 연못의 궤양 — 면역보다 먼저 깨어나는 세균
- 장소: pond_outdoor, farm_pond, restaurant 연못, temple_river 사찰 연못
- 주인: grandma, decor, touch, breeder, expert
- 종: koi, comet (연못 월동 개체). oranda·ryukin 연못 월동 생존 개체도 해당. 열대어 해당 없음.
- 조건: season=spring, 겨울 직후 수온 상승기, EV-HLT-11 통과, inj_skin 또는 argulus 이력
- 화면:
  > 물이 조금씩 따뜻해집니다. 몸은 아직 겨울처럼 무겁습니다. 옆구리 비늘 한 장이 빠진 자리가 붉게 동그랗게 번집니다.
  > {n}은…
  > ① 햇볕이 드는 얕은 곳으로 올라간다
  > ② 사람들이 던지는 먹이를 받아먹는다
  > ③ 깊은 곳에 가만히 있는다
- 숨은 판정:
  - ① 근성 need 60 (회색: oranda 55). 성공 → 체온 올려 면역 회복 빨라짐, 1턴 지연.
  - ② 애교 need 60 (comet 45 회색). 성공 → 주인이 가까이서 상처 발견 → expert·breeder는 격리 + 상처 소독 + 항생제(수의사), grandma는 빨간약을 바름(포비돈 요오드 국소 도포는 실제로 쓰이는 방법 → 운 좋게 효과 50%).
  - ③ 근성 need 70 자동.
- 종별 결과:
  - koi: 수온이 올라도 면역 반응은 늦게 따라오고 세균은 먼저 활발해짐 → 궤양 확률 최고. 근성 cap 90.
  - comet: 몸이 작아 궤양이 근육까지 금방 닿음.
  - 궤양 깊이 단계: 비늘 빠짐 → 붉은 원 → 근육 노출 → 늑골 노출(배드).
- 🔴 배드엔딩 「봄」: 비늘이 빠진 자리에 세균이 자리를 잡고 피부를 녹입니다. 붉은 테두리를 두른 둥근 구멍이 하루에 조금씩 넓어집니다. 구멍 바닥에 하얀 근육이 드러나고, 그 근육도 가장자리부터 녹아 패입니다. {n}은 다른 잉어들과 함께 햇볕 드는 얕은 곳으로 올라옵니다. 몸을 틀 때마다 구멍 가장자리가 벌어지고, 깊은 곳에 늑골 끝이 보입니다. 상처로 물이 계속 들어와 몸의 염분이 빠지고, {n}은 얕은 물가 돌 위에 옆구리를 대고 멈춥니다.
- 남김: inj_skin(궤양), scar, near_miss
- 주인 학습: expert 100 / breeder 70 / grandma 40 / decor 10 / touch 0. 성공 → owner_learned:[spring_check].
- [출처: 잉어 궤양병(Aeromonas salmonicida 비정형 등)과 봄철 수온·면역 지연]

### EV-HLT-34 오래 산 금붕어의 혹 — 종양과 잉어 수두
- 장소: home 전반, pond_outdoor
- 주인: grandma(최다 — 오래 키움), expert, learner, content
- 종:
  - gold(나이 후반 — 수명 70% 이후): 피부·생식소 종양 발생 보고가 많음
  - koi: 겨울에 피부에 촛농 같은 혹(잉어 수두, CyHV-1) → 수온 오르면 대개 사라지는 양성. 배드 아님 → 블랙 코미디 경로
  - 기타 종: 해당 없음(장수 개체만, 확률 낮음)
- 조건: 나이 ≥ 수명의 70%, gold 또는 koi
- 화면:
  > 오래 살았습니다. 몸 한쪽에 작은 혹이 생겼고, 해가 지날수록 조금씩 커집니다. (koi: 추운 계절이 되자 몸에 하얀 촛농 같은 것이 굳어 붙습니다.)
  > {n}은…
  > ① 주인이 부르는 소리에 늘 하던 대로 다가간다
  > ② 혹이 있는 쪽을 바닥에 대고 쉰다
  > ③ 은신처에 가만히 있는다
- 숨은 판정:
  - ① 애교 need 60 → 성공 시 주인 발견 → expert·learner는 수의사 상담(외과 절제 가능 여부: 피부 혹은 가능, 복강 안쪽은 어려움). grandma는 "나이 먹으면 다 그래" → 그대로 같이 지냄(고통 없을 때는 이 선택이 나쁘지 않음).
  - ② 판정 없음. 혹 표면 쓸림 → 2차 감염 확률.
  - ③ 근성 need 50 자동.
- 종별 결과:
  - oranda: 육혹과 혹이 헷갈려 발견 지연.
  - comet: 복강 종양(생식소)이 커지면 배가 한쪽으로 부풂 → dropsy·egg_bound와 구분 어려움.
  - koi 잉어 수두: 봄이 되면 대부분 저절로 사라짐 → 🟢. 주인이 긁어내면(eager·content) 상처 → EV-HLT-23.
  - 복강 종양이 장기를 누르면 부레 이상(swimbladder) 동반.
- 🔴 배드엔딩 「혹」 (gold 복강 종양): 생식소에 생긴 종양이 몇 달에 걸쳐 커집니다. 종양이 복강을 채우며 창자와 부레를 한쪽으로 밀어냅니다. 배의 한쪽만 불룩해지고, 몸이 그쪽으로 기울어 헤엄칩니다. 창자가 눌려 먹이가 조금만 들어가도 배가 더 부풉니다. {n}은 주인이 부르면 여전히 수면으로 올라오려 꼬리를 젓고, 기운 몸이 중간에서 멈춥니다. 어느 아침 {n}은 불룩한 쪽을 아래로 하고 바닥에 누워 있습니다.
- 😂 블랙 코미디 (koi 잉어 수두): 할머니는 겨울마다 {n}의 몸에 생기는 하얀 촛농을 보고 "또 늙었네" 하며 걱정했고, 봄마다 그게 사라지면 "젊어졌다"며 동네에 자랑했습니다. 그렇게 열두 번의 겨울과 봄이 지났습니다. 바이러스는 {n}의 몸속에 그대로 있었습니다.
- 남김: tumor(gold), carp_pox(koi), swimbladder(동반) → 엔딩·안락사 분기(EV-HLT-24 「정향유」 재사용)
- 주인 학습: 해당 없음(노화 사건). 주인 유형별 사후 한 줄만.
- [출처: 금붕어 종양 발생 보고(관상어 병리), 잉어 수두(CyHV-1) 계절성 증상]

### EV-HLT-35 터지지 않은 알 — 알막힘
- 장소: home 전반, pond_outdoor
- 주인: casual, gift, grandma, decor
- 종: gold(암컷, 수컷 없이 혼자 키울 때·수온 변화가 적을 때 흔히 거론). koi 암컷 드묾. 난태생(guppy·platy)은 해당 없음 → 대신 출산 사고는 다른 영역. betta 암컷(포란 후 미산란) 가능.
- 조건: 성별 암컷, 번식기(spring), 수컷 없음 또는 수온 자극 없음
- 화면:
  > 봄이 왔는데 배가 계속 무겁습니다. 몸 안의 것이 나가지 않습니다. 배가 한쪽으로 단단하게 부풀었습니다.
  > {n}은…
  > ① 수초와 장식에 배를 대고 문지른다
  > ② 주인이 다가오면 배를 보이며 천천히 돈다
  > ③ 바닥에서 가만히 있는다
- 숨은 판정:
  - ① 근성 need 45 → 성공 시 일부 산란(알 배출) → 회복. 실패 → 알이 몸 안에서 굳어감.
  - ② 애교 need 60 (comet 45 회색). 성공 → expert·learner: 수온을 조금씩 바꿔 산란 자극, 수컷 합사, 수의사 상담(배 마사지로 짜내는 방법은 숙련자만, 잘못하면 장기 손상). eager: 손으로 배를 눌러 짬 → 🔴 「손」.
  - ③ 근성 need 55 자동.
- 종별 결과:
  - oranda·ryukin: 짧은 몸 → 알 덩어리가 부레를 눌러 swimbladder 동반.
  - comet: 근성 cap 85 → 자연 흡수·배출 확률 높음.
  - betta: 알이 몸 안에서 흡수되는 경우가 많아 배드 확률 낮음.
  - dropsy와 혼동: 위에서 보면 비늘이 일어서지 않으면 알막힘, 일어서면 복수 → learner 판정 오진 30%.
- 🔴 배드엔딩 「봄의 배」: 나오지 못한 알이 난소 안에서 덩어리로 굳습니다. 굳은 알 덩어리가 썩으며 세균이 늘어나고, 난소 벽에 염증이 생깁니다. 염증이 복강으로 번져 복막이 붉게 붓습니다. {n}의 배가 한쪽으로 단단하게 부풀고 생식공 주변이 붉게 튀어나옵니다. {n}은 수초에 배를 대고 문지르기를 반복합니다. 이틀 뒤 {n}은 수초 사이에 배를 걸친 채 아가미만 움직이다가 멈춥니다.
- 🔴 배드엔딩 「손」: 주인이 {n}을 손바닥에 올리고 엄지로 배를 아래쪽으로 훑어 내립니다. {n}은 손바닥에서 몸을 튕기며 꼬리를 칩니다. 압력에 굳은 알 덩어리가 나오지 못하고 난소 벽이 찢어집니다. 생식공으로 알과 피가 섞여 나옵니다. 물로 돌아간 {n}은 배를 아래로 향하지 못하고 비스듬히 떠 있습니다.
- 남김: egg_bound, swimbladder(동반) → EV-HLT-24 혼동 분기
- 주인 학습: expert 100 / learner 50 / grandma 30 / eager 10 / casual 5.
- [출처: 금붕어 알막힘(egg retention) 원인·증상(관상어 수의 자료)]

---

## D. 치료의 실수와 성공 — 약은 물 전체에 퍼진다

### EV-HLT-36 약 칵테일 — 여과 세균의 몰살
- 장소: home 전반
- 주인: alchemist(최다), eager, content(약 리뷰 영상)
- 종: 전 종. 피해 순서: scaleless > small > tropical > gold·koi > big·airbreather.
- 조건: 질병 플래그 1개 이상 + 주인이 2종 이상 약 동시 투여(메틸렌블루·항생제·말라카이트 그린·소금 등)
- 화면:
  > 물이 파랗게 물들었다가, 다음 날 노랗게, 그다음 날 초록빛으로 바뀝니다. 여과기 스펀지가 원래 색을 잃었습니다. 사흘째부터 다시 그 냄새가 납니다.
  > {n}은…
  > ① 주인이 병을 들고 올 때마다 수조 가장 먼 끝으로 간다
  > ② 수면 가까이에서 아가미를 보이며 떠 있는다
  > ③ 바닥에서 가만히 있는다
- 숨은 판정: 약은 물 전체 → 회피 없음.
  - ① 판정 없음(연출). 영리함 +1.
  - ② 애교 need 65 → 성공 시 alchemist도 30% 확률로 "약 너무 넣었나?" → 대환수 1회. eager는 60%.
  - ③ 근성 need 60 자동 (회색 개념 없음; neon·altum·peapuffer·ghost·motoro·apisto·clownloach·wildbetta는 cap 미만 → 최대 확률 낮음).
- 종별 결과:
  - 메틸렌블루·일부 항생제가 여과 세균을 죽임 → cycled=0 → 다음 턴 EV-HLT-01·02 연결(약 + 암모니아 이중).
  - scaleless: 말라카이트 그린·포르말린 겹침 → slime_loss 확정.
  - neon·altum·apisto: 아가미 상피 손상 → 근성 need +15.
  - pleco·bichir·gar: 버팀 확률 높지만 이후 식욕 저하 2턴.
  - 수초·달팽이·새우: 몰살 → snails=0 (puffer는 EV-HLT-16 재발).
- 🔴 배드엔딩 「약장」: 서로 다른 약 네 가지가 같은 물에 풀립니다. 약 성분이 여과 스펀지의 세균을 죽이고, 물속 암모니아가 다시 오르기 시작합니다. {n}의 피부 점막이 약에 씻겨 얇아지고 상피가 군데군데 벗겨집니다. 벗겨진 상피 위로 암모니아가 닿아 아가미 새엽이 붉게 붓습니다. {n}은 수면과 바닥을 천천히 오가다 여과기 출수구 앞에서 몸을 지탱하려 지느러미를 계속 젓습니다. 주인이 다섯 번째 병을 열 때, {n}은 출수구 물살에 밀려 수조 구석에 닿아 있습니다.
- 남김: toxin(복합), cycled=0, slime_loss, snails=0 → EV-HLT-01·02·16
- 주인 학습: alchemist는 역학습(사후 한 줄: "다음 물고기를 위해 약을 한 병 더 샀습니다"). eager 40 / content 20 / learner 70. 성공 → owner_learned:[one_med_at_a_time].
- [출처: 메틸렌블루·항생제의 질산화 세균 영향, 관상어 약품 병용 주의(제조사 라벨)]

### EV-HLT-37 비늘 없는 몸에 소금
- 장소: home 전반, shop_tank
- 주인: learner(인터넷 "소금욕 만능"), grandma, eager, casual, alchemist
- 종: scaleless(cory·ghost·clownloach·motoro) + 일부 민감 종. 소금에 강한 종(gold·koi·guppy·platy·fig8)은 해당 없음(오히려 치료). FISH_REWORK #11(백점약 정량)과 별개 — 이쪽은 소금.
  - motoro: 담수 가오리는 염분 조절이 바다 가오리와 다름 → 소금 민감 [출처]
  - cory·clownloach·ghost: 소금 민감으로 널리 알려짐(소량은 견딘다는 보고도 있음 → 과량·장기일 때만 배드) [출처]
- 조건: salt=1 투입(EV-HLT-02·18·20·23 치료 경로), 합사 수조에서 다른 종을 위해 넣음
- 화면:
  > 물이 조금 짭짤해졌습니다. 몸의 미끈한 점액이 뭉쳐 떨어지는 느낌이 듭니다. 수염 (또는 원반 가장자리) 끝이 쓰라립니다.
  > {n}은…
  > ① 주인이 오면 유리 앞에서 몸을 뒤집으며 바닥을 긁는다
  > ② 여과기 물살 앞 산소 많은 곳에 머문다
  > ③ 모래에 몸을 파묻고 가만히 있는다
- 숨은 판정:
  - ① 영리함 need 50 + 애교 need 50 (각각; 둘 다 성공해야 함. cory 50/70·clownloach 60/75·ghost 70/60·motoro 50/70 모두 가능). 성공 → 주인이 "코리 소금" 검색 → 대환수로 염분 제거.
  - ② 근성 need 50 (회색: ghost 40, motoro 45). 성공 → 1턴 버팀.
  - ③ 근성 need 45 자동. motoro·cory는 모래 파묻기 습성 → 주인 발견 지연(-1턴).
- 종별 결과:
  - cory: 무리라 한 마리가 먼저 옆으로 누우면 주인이 발견할 확률 ↑ (동료가 신호).
  - clownloach: "죽은 척" 습성 → 주인이 "또 자네" → 발견 지연(FISH_REWORK 훈련 부작용).
  - ghost: 야행성 + 은신 → 발견 가장 늦음.
  - motoro: 배 쪽 점막 손상 → 모래 쓸림으로 2차 감염.
- 🔴 배드엔딩 「소금욕」: 물속 염분이 피부 점막의 물을 빨아냅니다. 비늘 없이 점막과 상피로만 덮인 피부가 쭈글쭈글하게 오그라듭니다. 점액이 뭉쳐 하얀 막으로 벗겨지고, 그 아래 상피가 붉게 드러납니다. {n}은 바닥 모래에 몸을 비비고, 비빌 때마다 드러난 피부가 더 벗겨집니다. 아가미 새엽에서도 수분이 빠져 상피가 쭈그러듭니다. {n}은 모래 위에서 옆으로 누운 채 아가미 뚜껑만 빠르게 움직이다 느려집니다.
- 🟢 생존: 점막 회복 2턴. 이후 소금 사건 재발 시 주인 학습 보정.
- 남김: slime_loss, salt=0(학습 시), near_miss
- 주인 학습: learner 70 / expert 100 / grandma 30 / eager 30 / casual 10 / alchemist 0. 성공 → owner_learned:[scaleless_dose].
- [출처: 비늘 없는 어종·담수 가오리 염분 민감성(사육 문헌), 소금욕 농도와 삼투 손상]

### EV-HLT-38 구리 — 달팽이가 먼저 죽는다
- 장소: home 전반, shop_tank, importer(검역용 구리)
- 주인: alchemist, eager, learner, staff(가게 수조 방식 그대로 집에)
- 종: 전 종 영향. 특히 scaleless(motoro·ghost·clownloach·cory), puffer(peapuffer·fig8 — 달팽이 의존 + 민감), altum·neon(아가미 섬세). gold·koi·pleco·bichir·gar는 정량에서 비교적 버팀.
- 조건: velvet 또는 ich 치료로 구리계 약 사용, 측정 키트 없이 투입(eager·alchemist는 "조금 더")
- 화면:
  > 수조 벽에 붙어 있던 달팽이들이 하나둘 바닥으로 떨어집니다. 새우가 몸을 뒤집고 움직이지 않습니다. 물에서 쇠 맛이 납니다.
  > {n}은…
  > ① 떨어진 달팽이를 쪼아 본다
  > ② 수면 가까이 산소 많은 곳으로 올라간다
  > ③ 은신처에서 가만히 있는다
- 숨은 판정:
  - ① puffer만: 영리함 need 60 → 성공 시 "먹지 않음"(약 성분 흡수 회피). 실패 → 근성 need +10. 다른 종은 연출.
  - ② 근성 need 45 → 1턴 버팀.
  - ③ 근성 need 55 자동.
- 종별 결과:
  - peapuffer·fig8: snails=0 → 치료가 끝나도 EV-HLT-16 재발 경로. 피부 민감 → need +10.
  - scaleless: 반 용량이 아니면 아가미·피부 동시 손상 → need +20.
  - altum·neon: 아가미 손상 → need +15.
  - gold·koi·pleco: 정량이면 대부분 생존.
  - staff: 측정 키트 사용 → 정량 유지 → 이 사건 배드 확률 1/3.
  - 구리는 바닥재·실리콘에 흡착되어 오래 남음 → 이후 달팽이를 다시 넣어도 죽음(snails 복구 2턴 지연).
- 🔴 배드엔딩 「구리」: 물속 구리 이온이 아가미 새엽 상피세포에 쌓입니다. 상피가 부풀고 일부는 괴사해 떨어집니다. 새엽 끝에서 피가 배어 나오고, 점액이 엉겨 새엽 사이를 막습니다. {n}은 수면 가까이 올라가 입과 아가미를 크게 엽니다. 바닥에는 껍데기만 남은 달팽이들이 흩어져 있습니다. {n}은 수면에서 천천히 기울며 수조 앞쪽 유리에 몸이 닿습니다.
- 남김: toxin(copper), snails=0, inj_gill → EV-HLT-16
- 주인 학습: staff 90 / expert 100 / learner 60(측정 키트 구매) / eager 20 / alchemist 0. 성공 → owner_learned:[copper_test].
- [출처: 구리 약제의 무척추·연골어·비늘 없는 어종 독성, 구리 이온 측정과 유효 농도 범위(제조사 라벨)]

### EV-HLT-39 보라색 물 — 과망간산칼륨 과량
- 장소: home 전반, pond_outdoor(연못 소독), farm_pond
- 주인: alchemist, eager, grandma(옛날식 소독), breeder(구식 관리)
- 종: 전 종. 피해 크기: small·scaleless 최대 / gold·koi 중간 / airbreather는 아가미 손상을 공기 호흡으로 일부 보완.
- 조건: 연못·수조 소독 또는 기생충 치료로 과망간산칼륨 사용, 정량 초과 또는 장시간 방치
- 화면:
  > 물이 진한 보라색으로 변했습니다. 몇 시간 뒤 보라색이 갈색으로 바뀝니다. 아가미 안이 화끈거리고 몸 표면이 뻣뻣해집니다.
  > {n}은…
  > ① 물 색이 옅은 쪽(수면·출수구)을 찾아 올라간다
  > ② 주인 앞에서 아가미를 크게 열어 보인다
  > ③ 바닥에서 가만히 있는다
- 숨은 판정:
  - ① 판정 없음(물은 곧 섞임).
  - ② 애교 need 60 → 성공 시 grandma·breeder는 물을 일부 갈아 줌(색이 진하면 위험하다는 옛 경험), alchemist는 0.
  - ③ 근성 need 60 자동.
- 종별 결과:
  - 물이 갈색으로 변하는 것은 약이 유기물과 반응해 소모되었다는 뜻 → 그 뒤 다시 넣으면(eager·alchemist) 손상 누적.
  - airbreather(betta·channa·bichir·gar·pleco·cory): 공기 호흡 보정 +10. 다만 cory는 scaleless 페널티 -10과 상쇄.
  - koi: 몸이 커서 버팀 확률 높음, 생존 시 아가미 흉터.
  - small: 1턴 내 결판.
- 🔴 배드엔딩 「보라색」: 과망간산칼륨이 아가미 새엽 표면의 상피와 점액을 산화시킵니다. 새엽이 갈색으로 물들고 상피가 굳어 벗겨집니다. 피부 점막도 갈색으로 변해 표면이 거칠어집니다. {n}은 출수구 앞으로 올라가 물을 아가미로 통과시키려 입을 크게 엽니다. 굳은 새엽 사이로는 물이 잘 흐르지 않습니다. {n}은 갈색 물 속에서 출수구 아래에 몸을 붙인 채 아가미 뚜껑을 몇 번 더 움직이고 멈춥니다.
- 남김: toxin(KMnO4), inj_gill, slime_loss
- 주인 학습: grandma 40 / breeder 50 / expert 100 / eager 20 / alchemist 0.
- [출처: 과망간산칼륨 어류 치료 농도와 과량 시 아가미 손상(어병 치료 매뉴얼)]

### EV-HLT-40 눈과 아가미를 덮는 혹 — 오란다 육혹
- 장소: home 전반, breeder_room, mill
- 주인: breeder(혹 키우기 사료), mill, content, grandma, expert
- 종: oranda 전용 (육혹 특성). ryukin·comet 해당 없음.
- 조건: species=oranda, 고단백 "혹 키우기" 사료, 나이 중반 이후
- 화면:
  > 머리의 혹이 해마다 커졌습니다. 이제 눈 위로 내려와 한쪽이 잘 보이지 않습니다. 아가미 뚜껑을 열 때 혹이 걸립니다.
  > {n}은…
  > ① 주인 손가락을 따라 헤엄친다
  > ② 먹이 냄새를 따라 바닥을 더듬는다
  > ③ 수초 옆에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 70 (cap 90). 성공 → 주인이 "눈이 안 보이는 것 같다" → expert·learner는 수의사에게 혹 일부 절제(마취) → 생존 80%. breeder·content는 "혹이 클수록 등급이 높다"며 그대로.
  - ② 영리함 need 30 (cap 30 → 최대 95%). 성공 → 시력 없이도 먹이 찾음.
  - ③ 근성 need 50 자동.
- 종별 결과(oranda 내):
  - 눈만 덮음: 먹이 경쟁에서 밀림 → weight=thin → 합사 수조면 더 심함.
  - 아가미 덮음: 호흡 효율 저하 → 수질 사건 근성 need +10(영구).
  - 혹 주름 사이 감염: 주름에 세균·물곰팡이 → EV-HLT-23 발견 지연.
  - 절제 후: 혹은 다시 자람 → 수년 간격으로 반복 사건.
- 🔴 배드엔딩 「품평회 등급」: 혹 조직이 두 눈 위로 덮여 내려와 각막 앞을 가립니다. 아가미 뚜껑 가장자리까지 혹이 자라 뚜껑이 끝까지 열리지 않습니다. {n}은 먹이 냄새를 따라 바닥을 더듬고, 다른 금붕어가 먼저 먹이를 가져갑니다. 혹 주름 사이에 고인 찌꺼기에서 세균이 자라 주름 안쪽이 하얗게 짓무릅니다. {n}은 열리지 않는 아가미 뚜껑을 계속 움직이며 수면 쪽으로 머리를 듭니다. 체중이 줄어 몸통은 가늘어지고 머리만 커 보이는 채로 {n}은 수초 옆에 기댑니다.
- 😂 블랙 코미디 (절제 후 생존): 수의사가 잘라 낸 혹의 무게를 재 주었습니다. 주인은 그 숫자를 {n}의 생일 케이크 초 개수로 썼습니다. 혹은 이듬해 다시 자랐고, 초는 해마다 늘었습니다.
- 남김: wen_block, weight=thin, inj_eye(시야), fungus 확률
- 주인 학습: expert 100 / learner 70 / grandma 40 / breeder 20(등급 우선) / content 30 / mill 0.
- [출처: 오란다 육혹(wen) 과성장과 수의 외과 절제 사례]

### EV-HLT-41 젖혀지는 아가미 뚜껑 — 아로와나 아가미 말림
- 장소: home_living, office, restaurant, decor 수조
- 주인: decor(풍수), content, casual, techbro, expert
- 종: arowana 최다(어린 개체). oscar·channa 드묾. 다른 종 해당 없음.
- 조건: species=arowana, no3 ≥ 2 또는 산소 부족, small_tank, 성장기
- 화면:
  > 아가미 뚜껑 가장자리가 바깥쪽으로 조금씩 젖혀집니다. 숨을 쉴 때 뚜껑이 완전히 닫히지 않습니다. 수면을 순찰하는 일이 피곤해집니다.
  > {n}은…
  > ① 수면 가까이에서 주인이 오는 쪽을 바라본다
  > ② 수류가 센 곳을 피해 천천히 순찰한다
  > ③ 수조 아래쪽에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 65 (cap 80). 성공 → 주인 발견 → expert: 수질 개선 + 초기라면 수의사가 젖혀진 가장자리를 다듬음 → 정상 회복 70%. decor: "용이 숨을 크게 쉰다"며 풍수적 길조로 해석(학습 0).
  - ② 영리함 need 50 → 진행 정지 1턴.
  - ③ 근성 need 50 자동.
- 종별 결과:
  - arowana: 진행 시 아가미가 드러나 감염 확률 ↑, 관상 가치 하락 → decor는 "기운이 나간다"며 교체(handed_over).
  - oscar·channa: 드묾. 수질 개선만으로 대부분 정지.
- 🔴 배드엔딩 「젖혀진 뚜껑」: 아가미 뚜껑 가장자리 연골과 막이 바깥으로 말립니다. 덮여 있어야 할 아가미 새엽이 밖으로 드러납니다. 드러난 새엽 끝이 물살과 수조 벽에 쓸려 상합니다. 상한 새엽에 세균이 붙어 끝부터 하얗게 짓무릅니다. {n}은 말린 뚜껑으로 물을 밀어내려 더 자주 아가미를 움직이고, 순찰 속도가 느려집니다. {n}은 수면 바로 아래에서 꼬리를 늘어뜨린 채 머리를 수면 쪽으로 든 자세로 멈춥니다.
- 😂 블랙 코미디 → H2 연결 보정: 주인은 아가미가 말린 {n}을 "기운이 나간 용"이라며 헐값에 팔았습니다. 새 주인은 수질부터 바로잡았고, 반년 뒤 말렸던 뚜껑 자리는 거의 보이지 않았습니다. 옛 주인은 새 용을 샀고, 그 용의 뚜껑이 다시 말리기 시작했습니다.
- 남김: gill_curl, inj_gill, handed_over(decor)
- 주인 학습: expert 100 / learner 60 / content 30 / decor 5 / techbro 50(질산염 센서 추가 → 고장 사건).
- [출처: 아로와나 아가미 말림(gill curl) 원인 가설(수질·산소·성장기)과 외과 교정 사례]

### EV-HLT-42 사람에게도 옮는 것 — 어류 결핵
- 장소: shop_tank, wholesale, home 전반, touch_pool
- 주인: staff(최다 — "아픈 애들" 데려옴), touch, breeder, mill, casual
- 종: 전 종(특히 neon·guppy·platy·betta·gold·apisto·cory). 대형어도 만성으로 걸림. 진행이 느리고 증상이 애매함(마름·비늘 들뜸·안구 돌출·척추 휨).
- 조건: staff가 가게 병어 데려옴, mill 출신, 사체 방치, 감염 개체 합사
- 화면:
  > 몇 달째 조금씩 마릅니다. 먹이는 먹는데 등이 휘어 갑니다. 피부 여기저기에 작은 상처가 낫지 않습니다.
  > {n}은…
  > ① 주인이 손을 넣으면 그 손에 다가가 몸을 댄다
  > ② 무리에서 조금 떨어져 천천히 헤엄친다
  > ③ 수초 밑에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 60 → 이 사건의 함정: 성공하면 주인이 손을 자주 넣음 → 주인 손 상처로 감염(주인 측 사건 발생: 손가락 결절 → 주인이 피부과 방문 → "물고기 키우세요?" → 원인 학습). 실패 → 연출만.
  - ② 근성 need 55 → 1턴 연장.
  - ③ 근성 need 55 자동.
- 주인 분기: 치료가 매우 어렵고 오래 걸림 → expert·staff는 감염 수조 전체 정리(안락사·소독) 결정. learner는 항생제 시도(대부분 재발). casual은 모름.
- 종별 결과:
  - small: 진행 빠름(몇 턴). neon은 neon_dz와 혼동.
  - gold·koi·oscar: 수년 만성. 종양·복수와 혼동.
  - 주인 측: 손에 상처가 있는 상태로 수조에 손을 넣는 주인(touch·staff·eager·grandma)은 "주인 감염" 이벤트 → 주인 교체 사유(입원 아님, 장기 치료) 또는 학습.
- 🔴 배드엔딩 「결절」: 마이코박테리아가 {n}의 비장, 콩팥, 간에 자리 잡습니다. 각 장기 안에 작은 회백색 결절이 여러 개 생기고, 결절이 정상 조직을 밀어냅니다. 근육이 빠지며 척추가 위아래로 휩니다. 피부의 작은 상처는 아물지 않고 얕은 궤양으로 남습니다. {n}은 무리 뒤에서 휜 몸으로 따라가려 꼬리를 젓습니다. 몇 달에 걸쳐 그렇게 마르다가, {n}은 수초 밑에서 휜 몸 그대로 멈춥니다.
- 남김: mycob(수조 전체), weight=thin, inj_spine, owner_infected(주인 측)
- 주인 학습: 주인 감염 이벤트 발생 시 학습 100%(장갑 착용, 손 상처 시 금지) → 이후 손 넣는 사건(오란다 손가락 훈련 등) 확률 ↓.
- [출처: Mycobacterium marinum 등 어류 마이코박테리아증 병리와 사람 피부 감염(fish tank granuloma), 질병관리청/CDC 자료]

### EV-HLT-43 야생에서 온 작은 복어 — 몸속 기생충
- 장소: wild_india → exporter_holding → importer → shop_tank → home
- 주인: 전체
- 종: peapuffer 최다(유통 개체 대부분 야생 채집). fig8(야생 채집 많음), clownloach(야생 채집·마름), wildbetta, altum. 양식 종(guppy·platy·betta·gold·koi)은 이 사건 대신 EV-HLT-27.
- 조건: 야생 채집 이력(origin=wild_*), 구충 안 함
- 화면:
  > 먹이를 잘 먹는데 배가 오목하게 꺼집니다. 배설물이 하얗고 가늘게 늘어집니다. 눈이 커 보입니다.
  > {n}은…
  > ① 주인 눈을 따라 다니며 먹이를 조른다
  > ② 달팽이를 깨 먹는 데 시간을 쓴다
  > ③ 수초 사이에서 가만히 있는다
- 숨은 판정:
  - ① 영리함 need 60 + 애교 need 60(peapuffer 75/85, fig8 75/85, clownloach 60/75, wildbetta 65/60, altum 45 → altum은 영리함 회색). 성공 → 주인이 "복어 배가 홀쭉" 검색 → "야생 복어는 들여오면 구충부터" → 프라지콴텔·레바미솔 등 구충 → 회복 75%.
  - ② peapuffer·fig8만: 힘 need 25 (peapuffer 15 회색, fig8 35 가능) → 성공 시 영양 보충, 1턴 연장.
  - ③ 근성 need 35 자동 (peapuffer cap 35).
- 종별 결과:
  - peapuffer: 진행 빠름. 구충 약 중 일부는 복어에 강하게 작용 → expert만 정확 용량.
  - clownloach: "마름병"(배 꺼짐) 형태 → 무리 전체 감염 흔함.
  - altum: 수입 스트레스와 겹쳐 EV-HLT-45로.
  - wildbetta: 단독 사육이면 진행 느림.
- 🔴 배드엔딩 「야생에서 같이 온 것」: 창자 안의 기생충이 {n}이 먹은 영양분을 먼저 가져갑니다. 창자 벽이 두꺼워지고 염증으로 붉게 붓습니다. 배설물에 점액과 기생충 마디가 섞여 하얗게 늘어집니다. {n}은 계속 먹이를 받아먹지만 배는 점점 오목해지고 머리와 눈만 커 보입니다. 부풀리기를 하려 해도 몸이 둥글게 차오르지 않습니다. {n}은 주인이 다가오면 유리 앞까지 나오다가, 어느 날부터 수초 사이에 머물고 그 자리에서 멈춥니다.
- 남김: intestinal_worm, weight=thin
- 주인 학습: expert 100 / staff 90 / learner 70 / casual 10. 성공 → owner_learned:[deworm_wild].
- [출처: 야생 채집 피퍼퍼 내부 기생충 보유와 구충 권장(복어 사육 문헌), 사용 구충제 종류]

### EV-HLT-44 알텀의 첫 달 — 수입 직후 폐사
- 장소: exporter_holding → airport_cargo → importer → wholesale → shop_tank → home
- 주인: expert(희귀종 수집), content, eager, staff
- 종: altum 전용(FISH_REWORK A-2' 이후 단계). 비슷한 위험: wildbetta·apisto(야생), clownloach(정도 덜함).
- 조건: species=altum, 입수 3턴 이내, 경수·고pH 수돗물, qt=0
- 화면:
  > 상자가 열리고 낯선 물에 들어옵니다. 물이 단단하고 무겁습니다. 높은 지느러미를 펴려 해도 자꾸 접힙니다.
  > {n}은…
  > ① 주인 쪽으로 몸을 세우고 지느러미를 다 펴 보인다
  > ② 수초 사이에 몸을 세우고 움직이지 않는다
  > ③ 바닥 가까이 가라앉아 가만히 있는다
- 숨은 판정:
  - ① 애교 need 80 (cap 90). 성공 → expert·staff는 "알텀 플루"로 불리는 수입 직후 폐사를 알고 있음 → 연수(RO수)·저pH·고온 + 예방 약욕(항생제·항원충제) → 생존 70%. content는 촬영 조명 켬 → 스트레스.
  - ② 근성 need 25 (cap 25 → 최대 95%). 성공 → 1턴 버팀.
  - ③ 판정 없음 → 다음 턴 감염(columnaris·flukes) 확률 70%.
- 종별 결과(altum 내):
  - 수돗물 경수 그대로 → EV-HLT-07 배드 동시 진행.
  - 입식 무리가 클수록 한 마리가 무너지면 연쇄(사체 → 수질).
  - 생존 개체는 이후 극도로 안정적(근성 판정 -10 보정, 수질만 맞으면).
- 🔴 배드엔딩 「첫 달」: 수입 상자에서 나온 {n}의 아가미와 피부는 이미 긁힌 자리투성이입니다. 바뀐 물에서 점액이 탁해지고, 긁힌 자리마다 세균이 자라 하얀 반점이 생깁니다. 아가미 새엽 끝이 하얗게 짓물러 숨이 빨라집니다. {n}은 수초 사이에서 몸을 세우려 지느러미를 펴고, 펴는 순간 등지느러미 막이 기조 사이로 갈라집니다. 이틀 사이 같은 상자에서 온 알텀들이 차례로 수초 아래로 기울고, {n}도 그 옆에서 기울어 멈춥니다.
- 남김: columnaris/flukes, inj_fin, inj_gill
- 주인 학습: expert 90 / staff 80 / content 20 / eager 20.
- [출처: 알텀 엔젤 수입 직후 대량 폐사("altum flu") 사육자 보고, 원인 추정(세균·원충·수질 급변)]

### EV-HLT-45 성공한 치료 — 격리 수조와 기록장
- 장소: home 전반
- 주인: expert, learner(학습 누적 3개 이상), staff, breeder(종어), grandma(손주와 함께)
- 종: 전 종 (치료 성공 경로 사건 — 배드엔딩 비중 낮음, 그러나 종마다 위험 지점이 다름)
- 조건: owner_learned에 qt 또는 scaleless_dose 또는 cycle 중 2개 이상, 질병 플래그 1개
- 화면:
  > 주인이 작은 수조를 하나 더 꺼냅니다. 원래 수조의 물을 반쯤 옮겨 담고 히터와 스펀지 여과기를 넣습니다. 그물이 다가옵니다.
  > {n}은…
  > ① 그물 쪽으로 스스로 헤엄쳐 들어간다
  > ② 그물을 피해 수초 사이로 숨는다
  > ③ 바닥에서 가만히 있는다
- 숨은 판정:
  - ① 애교 need 60 (회색: comet, pleco, channa, bichir, gar) → 성공 시 포획 스트레스 0. 애교 +2.
  - ② 영리함 need 50 → 성공하면 숨는 데 성공 → 주인이 수조를 다 뒤집어 잡음(inj_fin·slime_loss 확률, 치료는 결국 진행). 이 사건의 쓴 선택지: 똑똑할수록 다친다.
  - ③ 판정 없음 → 그물 포획 일반.
- 종별 결과:
  - 격리 + 정량·종별 용량 + 매일 환수 + 기록 → 대부분 회복.
  - scaleless: 반 용량 정확히 → 회복. 
  - big(arowana·gar·koi·motoro): 격리 수조가 작아 스트레스 → 점프·충돌 → lid 필수(lid=0이면 점프 사건 연결). motoro는 그물 대신 통으로 떠야 함(독침 → 주인 쏘임 사건 연결).
  - cory·clownloach: 가슴·눈 밑 가시가 그물에 걸림 → 그물 대신 컵 사용(expert만) / 나머지는 inj_fin.
  - channa·bichir: 격리 수조 뚜껑 틈 탈출 → 소파 밑 사건(FISH_REWORK #2) 연결.
  - schooling(neon·cory·clownloach): 혼자 격리되면 스트레스 → 근성 -10. expert는 같은 무리 2~3마리 같이 격리.
- 🔴 배드엔딩 (드묾, big·escaper 한정 「격리 수조」, channa 기준): 격리 수조 뚜껑과 히터 전선 사이에 손가락 하나 들어갈 틈이 있습니다. {n}은 밤에 그 틈으로 머리를 밀어 넣고 몸을 빼냅니다. 바닥에 떨어진 {n}은 지느러미와 몸통으로 마루를 밀며 기어갑니다. 마루 위에서 상처 자리의 점막이 마르고 먼지가 들러붙습니다. 공기 호흡으로 몇 시간을 버티는 동안 피부가 말라 갈라집니다. 아침에 주인은 기록장에 "3일차: 상처 호전"이라고 적어 둔 페이지를 펼친 채, 책상 밑에서 {n}을 찾습니다.
- 🟢 생존 + 😂 블랙 코미디: 주인의 기록장은 두 권이 되었습니다. 한 권은 {n}의 약 기록, 한 권은 주인 자신의 병원 기록입니다. 주인은 {n}의 약 시간은 한 번도 놓치지 않았고, 자기 약은 자주 잊었습니다.
- 남김: owner_learned 강화, near_miss 해제, qt=1, 질병 플래그 해제
- 주인 학습: 이 사건 자체가 학습의 결과. 성공 시 이후 같은 질병 재발 시 자동으로 이 경로.
- [출처: 관상어 격리·치료 표준 절차(수족관 관리 교재)]

---

## 새 플래그
- `salinity` (fresh/low/mid) — 기수 전환 단계 (EV-HLT-08)
- `kh_low` — ph_crash 전 단계, KH 소진 (EV-HLT-05) *(ph_crash로 대체 가능)*
- `qt` (0/1) — 격리 수조 보유·사용 (EV-HLT-15·18·27·28·29·45)
- `snails` (0/1) — 복어용 달팽이 공급 (EV-HLT-16·36·38)
- `shimmy` — 라이브베어러 쉬미 증상 (EV-HLT-07)
- `thiamine` — 비타민 B1 결핍 (EV-HLT-14)
- `fatty_liver` — 육식어 지방간 (EV-HLT-14)
- `lernaea` · `argulus` — 닻벌레·물이 (EV-HLT-15)
- `flukes` — 아가미·피부 흡충 (EV-HLT-15·32)
- `cyhv2` — 금붕어 헤르페스 (EV-HLT-29)
- `khv` 값 확장 — 감염/carrier(보균) (EV-HLT-28)
- `tumor` — 노령 금붕어 종양 (EV-HLT-34)
- `carp_pox` — 잉어 수두 CyHV-1 (EV-HLT-34)
- `egg_bound` — 알막힘 (EV-HLT-35)
- `wen_block` — 오란다 육혹이 눈·아가미 덮음 (EV-HLT-40)
- `gill_curl` — 아로와나 아가미 말림 (EV-HLT-04·41)
- `mycob` — 어류 결핵(수조 전체) (EV-HLT-42)
- `owner_infected` — 주인 측 감염 이벤트 (EV-HLT-42)
- `intestinal_worm` — 야생 개체 내부 기생충 (EV-HLT-43)
- `scar_fin` · `scar_jaw` — scar 세부 (EV-HLT-21·22)
- `origin` (wild_*/farm/mill) — 야생 채집 여부 (EV-HLT-43·44) *(장소 이력으로 대체 가능)*
- `age_ratio` — 수명 대비 나이 (EV-HLT-34) *(엔진 기존 값 있으면 대체)*
- owner_learned 항목 추가: cycle, test_kit, media_rinse, water_change, water_type, brackish, temp_group, aeration, varied_diet, bottom_feed, snails, sinking_food, qt, scaleless_dose, columnaris_vs_ich, velvet_check, deworm, deworm_wild, remove_dead, aeration_during_meds, one_med_at_a_time, copper_test, spring_check, dechlor
- 엔딩 분류 추가: 🕊 「보내 줌」(안락사 — 배드도 해피도 아닌 별도 분류, EV-HLT-24·34)

총 45개 사건 (EV-HLT-01 ~ EV-HLT-45), 배드엔딩 49개, 블랙 코미디·생존 코미디 15개, 🕊 엔딩 1개.
