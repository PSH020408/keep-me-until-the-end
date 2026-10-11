/* ---------- ornamental fish (관상어 데이, v0.9) ----------
   23 species from the Gemini sheets. Each fish lives through the whole chain:
   wild river or breeding farm → capture / culling → holding → transport → quarantine → shop
   → an owner (type, tank, tankmates) → water, crowding, disease, accidents, abuse, release …
   Numbers here are game mechanics (estimates) unless docs/DATA_SOURCES.md gives a source.
   Facts shown on screen are in F (below) and every one of them is sourced there. */

/* species extras
   cm     adult size (Seriously Fish / FishBase; DATA_SOURCES)
   minL   litres for one adult (sources where given, else estimate)
   temp   cold = goldfish/koi, trop = tropical (needs a heater), cool = needs a cool winter
   water  any | soft (soft acid) | hard | brack (brackish)
   social school (needs a group) | solo (fights its own kind) | any
   pW     share of trade fish that are wild-caught (estimate from the sources' wording)
   hardy  how well it survives handling and shipping (0–1, estimate)
   jump escape pred nip aggro longfin scaleless fancy air picky : behaviour and body flags
   dz     typical diseases [id, weight]
   shops  where it is bought [shop, weight]
   coldWild  chance to get through a Korean winter if released */
const FX={
 oranda:{cm:20,minL:75,temp:'cold',water:'any',social:'any',pW:0,hardy:.55,jump:.15,longfin:1,fancy:1,cull:.12,start:.35,
  dz:[['cyhv2',2],['swimb',3],['ich',2],['finrot',2],['aero',2],['fungus',1]],shops:[['mart',4],['shop',5],['online',2],['breeder',1]],coldWild:.85,
  farm:'금붕어 양식장의 흙빛 연못',sculpt:'머리 위 붉은 혹'},
 comet:{cm:30,minL:112,temp:'cold',water:'any',social:'any',pW:0,hardy:.85,jump:.35,cull:.05,start:.25,
  dz:[['ich',3],['cyhv2',2],['finrot',1],['aero',2],['fungus',1]],shops:[['fair',6],['mart',5],['shop',1],['friend',1]],coldWild:.95,
  farm:'금붕어 양식장의 흙빛 연못'},
 ryukin:{cm:15,minL:75,temp:'cold',water:'any',social:'any',pW:0,hardy:.5,jump:.1,longfin:1,fancy:2,cull:.12,start:.35,
  dz:[['swimb',4],['cyhv2',2],['ich',2],['aero',2],['finrot',1]],shops:[['mart',3],['shop',5],['online',2],['fair',1]],coldWild:.8,
  farm:'금붕어 양식장의 흙빛 연못'},
 betta:{cm:7,minL:20,temp:'trop',water:'any',social:'solo',pW:0,hardy:.6,jump:.6,aggro:1,longfin:1,air:1,cull:.15,start:.7,
  dz:[['velvet',3],['finrot',4],['irido',1],['ich',1],['aero',1]],shops:[['mart',5],['vase',3],['shop',3],['online',2]],coldWild:.02,
  farm:'태국의 베타 농장'},
 wildbetta:{cm:10,minL:70,temp:'cool',water:'soft',social:'solo',pW:.9,hardy:.45,jump:.8,aggro:1,air:1,start:.8,
  dz:[['fungus',3],['velvet',2],['worms',2],['finrot',1]],shops:[['online',5],['shop',3]],coldWild:.03,
  region:'말레이시아 사라왁의 이탄 습지 개울',farm:'유럽의 한 동호인 수조',
  catch:'채집꾼이 이탄 습지 개울 가장자리의 낙엽을 뜰채로 훑었습니다. {n}은 낙엽과 함께 들려 올라갔습니다.'},
 guppy:{cm:4,minL:40,temp:'trop',water:'hard',social:'school',pW:0,hardy:.6,jump:.2,longfin:1,breedEasy:1,cull:.1,start:.6,
  dz:[['tetra',5],['velvet',2],['finrot',2],['ich',2],['tb',1]],shops:[['mart',6],['friend',4],['shop',2]],coldWild:.06,
  farm:'동남아의 구피 양식장 연못'},
 neon:{cm:3,minL:54,temp:'trop',water:'soft',social:'school',pW:.05,hardy:.45,jump:.1,start:.7,
  dz:[['neond',4],['columnaris',3],['ich',2],['tb',1]],shops:[['mart',6],['shop',4],['online',1]],coldWild:.02,
  region:'페루 아마존강 지류',farm:'동남아의 양식장 연못'},
 platy:{cm:5,minL:54,temp:'trop',water:'hard',social:'any',pW:0,hardy:.65,jump:.15,breedEasy:1,cull:.05,start:.6,
  dz:[['tetra',3],['ich',2],['finrot',1],['aero',1]],shops:[['mart',6],['friend',3],['shop',2]],coldWild:.05,
  farm:'동남아의 양식장 연못'},
 cory:{cm:7.5,minL:72,temp:'trop',water:'any',social:'school',pW:.1,hardy:.7,jump:.05,air:1,scaleless:1,start:.5,
  dz:[['finrot',2],['columnaris',2],['ich',1],['aero',1]],shops:[['mart',5],['shop',4]],coldWild:.05,
  region:'페루의 얕은 개울',farm:'동남아의 양식장 연못',barbel:1},
 altum:{cm:18,minL:250,temp:'trop',water:'soft',social:'school',pW:.9,hardy:.3,jump:.1,pred:1,longfin:1,picky:1,start:.5,
  dz:[['hex',3],['irido',2],['ich',2],['columnaris',2],['tb',1]],shops:[['shop',4],['online',3],['bigshop',2]],coldWild:.01,
  region:'콜롬비아와 베네수엘라 사이, 오리노코강 상류의 아타바포강',farm:'동유럽의 한 번식장',
  catch:'밤, 카누를 탄 채집꾼이 손전등으로 물속을 비추고 그물을 던졌습니다. {n}은 불빛에 굳어 달아나지 못했습니다.'},
 oscar:{cm:35,minL:540,temp:'trop',water:'any',social:'any',pW:.05,hardy:.75,jump:.2,pred:1,big:1,start:.12,
  dz:[['hex',4],['irido',1],['aero',1],['ich',1],['worms',1]],shops:[['mart',1],['shop',4],['bigshop',4]],coldWild:.05,
  region:'브라질 아마존의 범람림',farm:'동유럽 또는 아시아의 양식장'},
 pleco:{cm:50,minL:650,temp:'trop',water:'any',social:'any',pW:0,hardy:.85,jump:.05,big:1,start:.1,
  dz:[['aero',2],['ich',1],['worms',1],['finrot',1]],shops:[['mart',6],['shop',3]],coldWild:.04,
  farm:'양식장 연못'},
 arowana:{cm:80,minL:1500,temp:'trop',water:'soft',social:'any',pW:.9,hardy:.55,jump:1,pred:1,big:1,start:.12,
  dz:[['aero',1],['ich',1],['fungus',1],['tb',1]],shops:[['bigshop',6],['online',2]],coldWild:.02,dropEye:1,
  region:'페루 아마존의 범람림 호수',farm:'남미의 야외 양식 연못',
  catch:'채집꾼은 입속에 새끼들을 품고 있던 아빠 아로와나를 잡았습니다. 그 입에서 쏟아져 나온 새끼 수십 마리 중 하나가 {n}이었습니다.'},
 koi:{cm:60,minL:950,temp:'cold',water:'any',social:'group',pW:0,hardy:.75,jump:.25,big:1,pond:1,cull:.2,start:.15,
  dz:[['khv',3],['tetra',1],['aero',2],['ich',2],['fungus',1]],shops:[['shop',4],['mart',2],['online',2],['breeder',2]],coldWild:.95,
  farm:'비단잉어 양식장'},
 channa:{cm:17,minL:108,temp:'cool',water:'any',social:'solo',pW:.5,hardy:.7,jump:.7,escape:.5,pred:1,air:2,start:.4,
  dz:[['worms',2],['fungus',2],['aero',1]],shops:[['online',5],['bigshop',3],['shop',2]],coldWild:.15,
  region:'인도 아삼 지방의 개울',farm:'국내 동호인의 번식 수조',
  catch:'개울가 수초 밑에서 {n}은 손그물에 걸렸습니다. 같은 날 잡힌 다른 물고기들은 시장에 반찬거리로 팔려 갔습니다.'},
 peapuffer:{cm:2.5,minL:12,temp:'trop',water:'any',social:'solo',pW:.85,hardy:.5,jump:.05,nip:1,aggro:1,picky:1,puff:1,start:.8,
  dz:[['worms',4],['ich',1],['finrot',1]],shops:[['shop',4],['online',4],['mart',1]],coldWild:.02,
  region:'인도 남부 서고츠산맥의 강',farm:'유럽의 한 동호인 수조',
  catch:'채집꾼이 강가 수초를 통째로 들어 올려 털었습니다. 아직 알을 낳아 보지도 못한 {n}이 바구니 위로 떨어졌습니다.'},
 fig8:{cm:8,minL:68,temp:'trop',water:'brack',social:'any',pW:.9,hardy:.55,jump:.05,nip:1,puff:1,beak:1,start:.4,
  dz:[['ich',2],['worms',2],['aero',1],['fungus',1]],shops:[['mart',3],['shop',4],['online',2]],coldWild:.02,
  region:'인도네시아의 강어귀',farm:'아시아의 양식장',
  catch:'강어귀 맹그로브 뿌리 사이에서 {n}은 그물에 걸렸습니다. 놀라서 몸을 공처럼 부풀렸지만 소용없었습니다.'},
 clownloach:{cm:30,minL:648,temp:'trop',water:'any',social:'school',pW:.6,hardy:.55,jump:.3,scaleless:1,big:1,start:.15,
  dz:[['ich',4],['skinny',4],['finrot',1]],shops:[['mart',4],['shop',4],['online',1]],coldWild:.02,
  region:'인도네시아 수마트라의 바탕하리강',farm:'호르몬 주사로 번식시키는 양식장',
  catch:'우기, 강물에 떠내려가던 손톱만 한 치어 {n}은 강을 가로지른 그물에 걸렸습니다. 같은 그물에 수천 마리가 함께 걸렸습니다.'},
 bichir:{cm:35,minL:540,temp:'trop',water:'any',social:'any',pW:.85,hardy:.85,jump:.2,escape:1,pred:1,air:2,big:1,start:.3,
  dz:[['worms',3],['fungus',1],['aero',1]],shops:[['shop',4],['online',3],['bigshop',2],['mart',1]],coldWild:.02,
  region:'서아프리카 세네갈강의 범람원',farm:'아시아의 양식장',
  catch:'범람원 웅덩이가 말라 갈 무렵, 채집꾼이 바닥 진흙을 퍼 올렸습니다. {n}은 진흙째 양동이에 담겼습니다.'},
 ghost:{cm:50,minL:648,temp:'trop',water:'any',social:'solo',pW:.2,hardy:.5,jump:.1,scaleless:1,big:1,shy:1,start:.2,
  dz:[['ich',3],['finrot',2],['skinny',1],['fungus',1]],shops:[['shop',5],['online',3],['bigshop',2]],coldWild:.01,
  region:'아마존강 지류',farm:'인도네시아의 야외 연못 양식장'},
 motoro:{cm:45,minL:1620,temp:'trop',water:'soft',social:'any',pW:.5,hardy:.4,jump:0,scaleless:1,big:1,picky:1,sting:1,start:.3,
  dz:[['worms',2],['aero',1],['fungus',1]],shops:[['bigshop',6],['online',2]],coldWild:.01,
  region:'남미 파라나강 유역의 모래 강바닥',farm:'아시아의 가오리 번식장',
  catch:'얕은 모래톱에 몸을 묻고 있던 {n} 위로 그물이 덮였습니다. 채집꾼은 장갑 낀 손으로 꼬리부터 붙잡았습니다.'},
 apisto:{cm:7.5,minL:54,temp:'trop',water:'soft',social:'pair',pW:.25,hardy:.5,jump:.1,aggro:.5,longfin:1,start:.5,
  dz:[['hex',2],['ich',2],['worms',1],['tb',1]],shops:[['shop',5],['online',4],['breeder',2]],coldWild:.02,
  region:'페루 우카얄리강 유역의 작은 개울',farm:'동유럽의 개량 번식장'},
 gar:{cm:180,minL:99999,temp:'warm',water:'any',social:'any',pW:0,hardy:.8,jump:.3,pred:1,big:1,air:1,start:.06,
  dz:[['aero',1],['fungus',1],['worms',1]],shops:[['bigshop',5],['online',3]],coldWild:.45,
  farm:'원산지에서 몰래 들여온 어미로 치어를 받는 아시아의 양식장'},
};
const isGold=()=>['oranda','comet','ryukin'].includes(S.sp.id);

/* where a fish is bought, and who tends to buy there */
const FSHOP={
 mart:{l:'대형마트 수족관 코너',own:[['casual',58],['learner',27],['gift',12],['expert',3]]},
 shop:{l:'수족관 전문점',own:[['learner',38],['expert',30],['casual',18],['breeder',9],['content',5]]},
 online:{l:'온라인 생물 택배',own:[['expert',30],['learner',25],['breeder',15],['mill',10],['content',15],['casual',15]],ship:1},
 fair:{l:'야시장 금붕어 뜰채 체험',own:[['gift',80],['casual',20]]},
 vase:{l:'꽃집의 꽃병 선물',own:[['gift',100]]},
 bigshop:{l:'대형어 전문 숍',own:[['content',35],['expert',30],['casual',25],['learner',10]]},
 breeder:{l:'국내 브리더',own:[['expert',45],['breeder',40],['mill',20],['learner',15]]},
 friend:{l:'지인이 치어를 나눠 줌',own:[['casual',50],['learner',30],['gift',20]]},
};

/* owner types. skill drives almost everything (S.r) */
const FOWN={
 expert:{l:'물생활 고수',skill:[.82,.97]},
 learner:{l:'공부하는 초보',skill:[.45,.72]},
 casual:{l:'대충 키우는 사람',skill:[.15,.42]},
 gift:{l:'경품·선물로 받은 사람',skill:[.04,.25]},
 breeder:{l:'번식이 취미인 사람',skill:[.6,.88]},
 mill:{l:'물고기 번식장 운영자',skill:[.3,.6]},
 content:{l:'대형어 영상 채널 운영자',skill:[.35,.65]},
};

/* filters: k = how fast the water still goes bad with it (lower is better), flow = current (hard on long fins
   and small fish in small tanks), intake = an open intake that can pull in small fish, air = driven by a noisy air pump,
   ug = under-gravel plate that clogs if the gravel is never cleaned */
const FILT={
 '없음':{k:1.8,flow:0},
 '스펀지 여과기':{k:1,flow:.1,air:1},
 '저면 여과기':{k:.8,flow:.2,air:1,ug:1},
 '걸이식 여과기':{k:.8,flow:.5,intake:1},
 '측면 여과기':{k:.75,flow:.4,intake:1},
 '상면 여과기':{k:.65,flow:.55,intake:1},
 '외부 여과기':{k:.5,flow:.65,intake:1},
 '섬프 여과기':{k:.4,flow:.6,intake:1},
 '연못 여과기':{k:.4,flow:.3},
};
const filtOf=k=>FILT[k]||FILT['스펀지 여과기'];

/* temperament toward other fish, per species.
   terr = fights its own kind (betta males to the death, snakeheads, pea puffers, arowanas, knifefish, plecos over caves)
   hostile = harasses or kills other species (snakeheads, pea puffers, oscars, arowanas; bettas chase long-finned guppies)
   mouth = the largest fish it swallows, as a share of its own length (an oscar takes a fish a third of its size)
   nip = attacks fish much bigger than itself, fin by fin (pea and figure-8 puffers)
   Female bettas, wild bettas and apistogramma fight far less (×0.4). */
const FBEH={
 oranda:{terr:0,hostile:0,mouth:.1},comet:{terr:0,hostile:0,mouth:.12},ryukin:{terr:0,hostile:0,mouth:.1},
 betta:{terr:1,hostile:.35,mouth:.15},wildbetta:{terr:.6,hostile:.15,mouth:.15},
 guppy:{terr:0,hostile:0,mouth:0},neon:{terr:0,hostile:0,mouth:0},platy:{terr:0,hostile:0,mouth:0},cory:{terr:0,hostile:0,mouth:0},
 altum:{terr:.3,hostile:.15,mouth:.25},oscar:{terr:.5,hostile:.45,mouth:.35},pleco:{terr:.45,hostile:.1,mouth:0},
 arowana:{terr:.75,hostile:.4,mouth:.5},koi:{terr:0,hostile:0,mouth:.08},channa:{terr:.9,hostile:.8,mouth:.5},
 peapuffer:{terr:.8,hostile:.7,mouth:.1,nip:1},fig8:{terr:.4,hostile:.4,mouth:.15,nip:1},clownloach:{terr:.05,hostile:0,mouth:0},
 bichir:{terr:.2,hostile:.1,mouth:.3},ghost:{terr:.7,hostile:.2,mouth:.2},motoro:{terr:.15,hostile:.1,mouth:.2},
 apisto:{terr:.55,hostile:.25,mouth:.1},gar:{terr:.15,hostile:.2,mouth:.4},
};
const fbOf=id=>FBEH[id]||{terr:0,hostile:0,mouth:0};
/* will a careful owner put these two together? */
function fCompatible(a,b){const A=fbOf(a),B=fbOf(b),ca=FX[a].cm,cb=FX[b].cm;
  if(A.mouth*ca>=cb*.8||B.mouth*cb>=ca*.8) return false;
  if(A.hostile>=.4||B.hostile>=.4) return false;
  if((A.nip&&FX[b].longfin)||(B.nip&&FX[a].longfin)) return false;
  return true}

/* tanks: litres and length in cm (the stage draws the fish to scale against the length) */
const TANKS=[
 {k:'cup',l:'플라스틱 컵',L:.4,len:8},
 {k:'vase',l:'꽃병',L:1,len:12},
 {k:'bowl',l:'볼어항',L:4,len:20},
 {k:'t20',l:'20cm 미니 어항',L:8,len:20},
 {k:'t30',l:'30cm 어항',L:27,len:30},
 {k:'t45',l:'45cm 어항',L:40,len:45},
 {k:'t60',l:'60cm 수조',L:64,len:60},
 {k:'t90',l:'90cm 수조',L:160,len:90},
 {k:'t120',l:'120cm 수조',L:300,len:120},
 {k:'t180',l:'180cm 수조',L:650,len:180},
 {k:'t240',l:'240cm 대형 수조',L:1620,len:240},
 {k:'pond',l:'마당 연못',L:3000,len:300},
];
const tankOf=k=>TANKS.find(t=>t.k===k);

/* generic tankmates that are not among the 23 */

/* diseases. prog = how fast it gets worse untreated (per month), cure = chance one correct treatment works,
   ov = how the stage draws it on the fish */
const DZ={
 ich:{n:'백점병',sym:'{n}의 몸과 지느러미에 소금을 뿌린 것 같은 하얀 점이 돋았습니다.',ov:'ich',prog:.45,cure:.7,fact:'fIch'},
 velvet:{n:'벨벳병',sym:'{n}의 몸이 금가루를 뿌린 듯 탁한 금빛으로 덮였습니다. 지느러미를 접고 유리벽에 몸을 비빕니다.',ov:'velvet',prog:.6,cure:.5,fact:'fIch'},
 columnaris:{n:'솜병',sym:'{n}의 입가와 등에 하얀 솜 같은 막이 번졌습니다.',ov:'cotton',prog:.8,cure:.45,fact:'fWater'},
 aero:{n:'솔방울병',sym:'{n}의 배가 부풀어 오르고, 비늘이 솔방울처럼 일어섰습니다.',ov:'dropsy',prog:.4,cure:.25,fact:'fWater'},
 finrot:{n:'지느러미썩음병',sym:'{n}의 지느러미 끝이 하얗게 녹아내리며 조금씩 짧아졌습니다.',ov:'finrot',prog:.3,cure:.75,fact:'fWater'},
 fungus:{n:'물곰팡이병',sym:'{n}의 상처 자리에 하얀 솜뭉치가 피어올랐습니다.',ov:'cotton',prog:.45,cure:.6,fact:'fTemp'},
 tb:{n:'어류 결핵',sym:'{n}이 먹는 만큼 마르기 시작했습니다. 등이 조금씩 휘었습니다.',ov:'bent',prog:.15,cure:0,fact:'fTB'},
 hex:{n:'구멍병',sym:'{n}의 머리와 옆줄을 따라 작은 구멍이 패이기 시작했습니다.',ov:'pits',prog:.22,cure:.65,fact:'fHole'},
 tetra:{n:'테트라히메나',sym:'{n}의 몸 곳곳이 하얗게 벗겨지고, 눈이 부어올랐습니다.',ov:'popeye',prog:.9,cure:.1,fact:'fTetra'},
 neond:{n:'네온테트라병',sym:'{n}의 등 근육이 하얗게 탁해지고, 파란 줄이 빠지기 시작했습니다. 혼자 비틀거리며 헤엄칩니다.',ov:'pale',prog:.3,cure:0,fact:'fNeon'},
 khv:{n:'코이 허피스',sym:'{n}의 아가미가 얼룩덜룩해지고 눈이 움푹 꺼졌습니다. 수면에서 숨을 헐떡입니다.',ov:'sunken',prog:1.3,cure:0,fact:'fKHV'},
 cyhv2:{n:'금붕어 허피스',sym:'{n}의 아가미가 하얗게 질렸습니다. 바닥에 가라앉아 움직이지 않습니다.',ov:'pale',prog:1,cure:0,fact:'fCyHV'},
 irido:{n:'이리도바이러스',sym:'{n}의 몸이 검게 변하고, 수조 안을 빙글빙글 돌기 시작했습니다.',ov:'dark',prog:1.5,cure:0,fact:'fIrido'},
 swimb:{n:'부레병',sym:'{n}의 몸이 기울더니, 배를 위로 하고 둥 떠올랐습니다. 지느러미는 아직 움직입니다.',ov:'flip',prog:.25,cure:.5,fact:'fSwim'},
 skinny:{n:'마름병',sym:'{n}은 잘 먹는데도 배가 홀쭉하게 꺼져 갔습니다.',ov:'thin',prog:.3,cure:.55,fact:'fClown'},
 worms:{n:'내부 기생충',sym:'{n}의 배가 꺼지고 하얀 실 같은 변이 늘어졌습니다. 야생에서 몸속에 함께 온 기생충입니다.',ov:'thin',prog:.25,cure:.6,fact:'fWild'},
};

/* facts shown on the ending card ("실제로는"). Sources: docs/DATA_SOURCES.md § fish */
Object.assign(F,{
 fChain:'남미에서 미국으로 수입된 카디널테트라 50상자 중 40상자가 통째로 폐사한 사례가 있습니다(Chapman 외, 1997). 브라질 아마존에서 잡힌 관상어는 소비자에게 닿기 전에 30~70%가 죽는다는 조사도 있습니다(Waichman 외, 2001).',
 fCulled:'동물단체 PETA 아시아는 태국 베타 농장 조사(2019)에서 병 하나에 한 마리씩 담긴 수천 마리 베타와, 지느러미가 상해 팔 수 없는 개체를 양동이나 근처 수로에 버리는 모습을 보았다고 밝혔습니다. 이 농장들의 수출국에는 한국도 있었습니다.',
 fCycle:'새 수조에서 물고기 배설물을 분해할 박테리아가 자리 잡는 데는 4~6주가 걸립니다. 이 \'물잡이\' 없이 넣은 물고기는 암모니아와 아질산에 중독되며, 이는 새 수조에서 가장 흔한 사망 원인입니다.',
 fBowlAny:'작은 어항에는 배설물을 희석할 물이 적어서, 며칠만 물을 갈지 않아도 암모니아가 쌓입니다. 물고기가 어항 크기만큼만 자라는 게 아니라, 나쁜 물이 성장을 막는 것입니다.',
 fBowl:'금붕어는 큰 수조에서 30년까지 살 수 있지만, 작은 어항에서는 몇 주 만에 죽기도 합니다. 물고기가 어항 크기만큼만 자라는 게 아니라, 나쁜 물이 성장을 막는 것입니다.',
 fBetta:'베타가 컵에서 버티는 건 수면의 공기를 마실 수 있는 미로기관 덕분일 뿐, 좁은 곳을 좋아해서가 아닙니다. 열대어라 히터가 필요합니다. 꽃병 베타가 식물 뿌리를 먹고 산다는 말도 사실이 아닙니다.',
 fIch:'백점병은 방치하면 수조 전체를 죽일 수 있습니다. 기생충 한 마리가 최대 1,024마리로 불어나고, 새 물고기를 들인 뒤 1~3주 사이에 자주 나타납니다.',
 fUnsold:'매장에 오래 남는 물고기는 대개 너무 크게 자랐거나, 색이 덜 예쁘거나, 아파 보이는 개체입니다. 팔리지 않은 생물이 어디로 가는지는 가격표에 적혀 있지 않습니다.',
 fShopMix:'판매 수조에서는 크기와 식성이 다른 물고기가 한 수조에 섞이기도 합니다. 입에 들어가는 크기의 물고기는 그 수조에서 먹이가 됩니다.',
 fBurst:'수조 받침은 수평이어야 하고, 무게를 버틸 수 있어야 합니다. 한쪽으로 기운 수조는 실리콘 이음매에 힘이 몰려 어느 날 갑자기 터지기도 합니다.',
 fCat:'뚜껑 없는 수조는 고양이에게 장난감 상자입니다. 고양이를 키우는 집이라면 수조 뚜껑은 선택이 아닙니다.',
 fSun:'작은 어항은 물이 적어 햇볕에 금방 데워집니다. 수온이 오르면 물에 녹아 있는 산소가 줄어듭니다. 어항은 직사광선이 들지 않는 곳에 둬야 합니다.',
 fBread:'빵이나 밥 같은 사람 음식은 물속에서 불어 물을 썩게 하고, 물고기의 소화관을 막습니다.',
 fPlace:'교실·사무실·식당의 수조는 "모두의 물고기"라서 누구의 물고기도 아니게 되기 쉽습니다. 방학과 연휴에는 아무도 오지 않습니다.',
 fFair:'영국 RSPCA 집계로 2014~2018년 웨일스에서 신고된 "살아 있는 동물 경품" 사례 중 60%가 축제의 금붕어였습니다. 영국의 여러 지자체는 자기 땅에서 열리는 행사에서 동물을 경품으로 주는 것을 금지했습니다. 경품 금붕어는 대개 작은 봉지에 담겨 몇 시간을 돌아다닌 뒤, 준비되지 않은 집에 도착합니다.',
 fTemper:'물고기의 공격성은 종마다 다릅니다. 베타 수컷끼리는 한쪽이 죽을 때까지 싸우고, 가물치나 오스카 같은 육식어는 입에 들어가는 크기의 물고기를 먹이로 봅니다. 합사할 때는 지금 크기가 아니라 다 자랐을 때의 크기와 성격을 봐야 합니다.',
 fApex:'버려진 열대 육식어는 한국의 물에서도 발견됩니다. 2015년 강원도 횡성의 마옥저수지에서 피라니아 3마리와 레드파쿠 1마리가 발견되자, 환경부는 저수지 물을 빼고 두 종을 위해우려종으로 지정하기로 했습니다. 정부는 한국 기후에서 살아남기 어렵다고 보면서도 정착 가능성을 배제하지 못했습니다.',
 fWater:'관상어 질병 대부분의 뿌리는 나쁜 물입니다. 과밀, 과식, 청소하지 않은 수조에서 세균이 상처와 아가미를 파고듭니다.',
 fTemp:'하루 사이에 수온이 10℃쯤 떨어지면 면역이 약해져 물곰팡이와 백점병이 따라옵니다.',
 fTB:'어류 결핵은 치료법이 없어 수조 전체를 정리하라는 권고가 나오는 병입니다. 사람 손의 상처로 옮아 피부병을 일으키기도 합니다.',
 fHole:'머리에 구멍이 패이는 구멍병은 오스카 같은 시클리드에게 흔합니다. 원인은 아직 확실히 밝혀지지 않았습니다.',
 fTetra:'실험에서 테트라히메나에 감염된 구피는 87~100%가 죽었습니다. 근친 번식과 대량 생산으로 약해진 상업 구피·플래티는 병에 약하고 일찍 죽는 경우가 많습니다.',
 fNeon:'네온테트라병은 치료법이 없습니다. 감염된 물고기를 먹은 물고기에게 옮기 때문에, 병든 개체를 빨리 빼내는 수밖에 없습니다.',
 fKHV:'코이 허피스(KHV)는 처음 걸린 비단잉어의 80~100%를 죽이고 치료법이 없습니다. 살아남은 개체는 평생 바이러스를 지니고, 금붕어는 증상 없이 옮길 수 있습니다.',
 fCyHV:'금붕어 허피스(CyHV-2)는 치사율이 90%를 넘기도 합니다. 2014년 국내 한 공공 수족관에서는 금붕어 700마리 중 230마리가 이 병으로 죽었습니다.',
 fIrido:'이리도바이러스는 일주일 안에 수조 전체를 죽이기도 하는 바이러스입니다. 여름 고온과 운송 스트레스 뒤에 잘 터지고, 치료법이 없습니다.',
 fSwim:'배를 위로 하고 떠 있는 금붕어가 다 죽은 것은 아닙니다. 몸통이 짧고 둥글게 개량된 금붕어는 부레병에 잘 걸립니다.',
 fClown:'클라운 로치는 20년 넘게 살고 30cm 넘게 자라며, 5~6마리 이상 무리로 지내야 합니다. 수마트라에서는 해마다 최대 약 1,000만 마리의 치어가 채집된다는 추정이 있습니다. 옆으로 누워 쉬는 습성 때문에 죽은 줄 아는 사람도 있습니다.',
 fWild:'야생에서 잡힌 물고기는 몸속에 기생충을 지닌 채 오기도 하고, 처음 보는 사료를 거부하다 굶어 죽기도 합니다.',
 fOutgrow:'플레코는 50cm, 오스카는 35cm, 클라운 로치는 30cm 넘게 자랍니다. 손가락만 할 때 팔리는 물고기 중에는 가정 수조에 맞지 않는 종이 많습니다.',
 fRelease:'2015년 강원 횡성 마옥저수지에서 피라냐가 발견돼 저수지 물을 빼는 소동이 있었고, 2026년 인천 굴포천에서는 버려진 구피가 발견됐습니다. 열대어는 한국의 겨울을 넘기지 못하고, 견디는 종은 토종 생태계를 흔듭니다.',
 fFlush:'살아 있는 물고기를 변기에 내리거나 냉동실에 넣거나 물 밖에 두는 것은 인도적인 방법이 아닙니다. 동물단체는 정향유를 이용한 마취를 권합니다. 변기에 내린 물고기는 야생 물고기에게 병을 옮기기도 합니다.',
 fLaw:'식용이 아닌 관상어도 동물보호법의 보호를 받는다는 법률 해석이 있습니다. 2022년 한 미술관 전시에서 수액 팩에 담긴 금붕어 15마리 중 5마리가 죽어 논란이 됐습니다.',
 fLive:'살아 있는 동물을 대형어에게 던져 주는 영상이 조회수를 위해 올라옵니다. 영국에서는 살아 있는 금붕어를 삼키는 영상을 올린 남성이 5년간 물고기 사육 금지 처분을 받았습니다.',
 fO2:'정전이 되면 여과기와 히터가 함께 멈춰 수온, 산소, 수질이 한꺼번에 무너집니다. 열대어는 수온이 13℃ 아래로 내려가기 전에 데워 줘야 합니다.',
 fChlor:'수돗물의 염소는 아주 적은 양도 물고기에게 치명적입니다. 클로라민은 하루 묵혀도 빠지지 않아 중화제가 필요합니다.',
 fMed:'물고기 약은 치료하는 양과 죽이는 양의 차이가 좁습니다. 구리 성분 약은 특히 그렇고, 비늘 없는 물고기는 약에 더 약합니다.',
 fCrowd:'과밀한 수조에서는 스트레스로 면역이 떨어지고 수질이 빠르게 나빠져 병이 쉽게 번집니다.',
 fBeak:'복어의 이빨은 평생 자랍니다. 단단한 먹이 없이 자란 부리는 입을 막아 굶어 죽게 만들고, 깎으려면 마취가 필요합니다.',
 fMotoro:'수입 가오리는 마른 채 도착해 먹이를 거부하는 경우가 많고, 몸 가장자리가 위로 말려 올라가는 \'데스 컬\'은 대개 죽음의 신호입니다. 모토로 가오리는 20년 넘게 살고 지름 50cm까지 자랍니다.',
 fArowana:'실버 아로와나는 새끼를 입에 품은 수컷을 잡아 새끼를 얻는 방식으로 채집됩니다. 페루는 2001년 한 해 약 100만 마리를 수출했습니다. 다 크면 80cm, 2m 넘는 수조가 필요합니다.',
 fAltum:'알텀 엔젤은 대부분 야생 채집 개체입니다. 밤에 카누에서 잡혀 두세 번 주인이 바뀐 뒤 수출되고, pH 4 안팎의 물에서 살다 갑자기 다른 물을 만나 수입 뒤 많이 죽습니다.',
 fPea:'피퍼퍼는 관상어 거래를 위한 채집으로 인도 서고츠산맥의 개체수가 크게 줄었습니다. 번식하기 전에 잡혀 가기 때문입니다. IUCN 취약종입니다.',
 fBichir:'폴립테루스는 폐로 숨 쉬는 고대어로, 수조 틈으로 잘 빠져나가 물 밖에서 말라 죽습니다. 수조에서 30년 넘게 산 기록도 있습니다.',
 fGar:'앨리게이터 가아는 최대 2.6m까지 자라고 95년까지 산다는 보고가 있습니다. 키우다 버려진 개체가 미국 캘리포니아, 이란, 싱가포르, 인도 등 원산지 밖에서 발견됐습니다.',
 fChanna:'미국은 2002년 가물치과 물고기 전체의 수입을 금지했습니다. 연못에 풀린 두 마리가 번식해 100마리 넘는 치어가 잡힌 일이 계기였습니다.',
 fKoi:'비단잉어는 30~40년을 살아 주인보다 오래 사는 경우도 많습니다. 한 마리당 약 950L 이상의 연못이 권장되고, 고양이와 새가 연못의 큰 위협입니다.',
 fGhost:'블랙 고스트는 눈이 거의 보이지 않아 약한 전기로 주변을 느낍니다. 비늘이 없어 약에 약하고, 50cm까지 자랍니다. 괴롭힘을 당하면 먹이를 끊고 말라 갑니다.',
 fBreed:'번식은 어미의 몸을 소모시킵니다. 팔 수 없는 치어를 변기에 흘려보내거나 먹이로 쓰는 일도 흔합니다.',
 fOranda:'오란다의 머리 혹은 계속 자라 눈을 덮기도 합니다. 영국에서는 혹을 잘라 시력을 되찾게 하는 수술이 이뤄진 적도 있습니다.',
 fJumpF:'베타, 아로와나, 가물치류는 이름난 점프 선수입니다. 수조 뚜껑 하나가 생사를 가릅니다.',
 fEuth:'치료할 수 없는 병이라면, 고통을 줄이는 인도적인 안락사도 마지막 책임입니다. 동물단체는 정향유를 천천히 넣는 방법을 권합니다.',
 fNatural:'관상어가 기대수명을 다 산다는 건, 그 긴 시간 동안 누군가 매주 물을 갈고 수온과 먹이를 챙겼다는 뜻입니다.',
});

/* fish choices: the fish decides. fx runs after the line is logged */
const FCH=[
 {id:'feed',p:'위에서 알갱이가 떨어진다. 다른 물고기들이 몰려든다. 나는…',when:()=>S.f.mates.length>0&&!S.f.refuse,o:[
  {l:'제일 먼저 달려든다',r:'{n}이 알갱이를 낚아챘습니다.',c:'good',fx:()=>{S.health+=4;if(fishIs('aggro')||S.f.pred)S.f.bully=(S.f.bully||0)+.1}},
  {l:'바닥에 떨어지는 걸 기다린다',r:'{n}은 바닥에 가라앉은 부스러기를 주워 먹었습니다.',c:'neutral',fx:()=>{S.health+=1}},
  {l:'수초 뒤에서 지켜본다',r:'{n}이 숨어 있는 사이 먹이는 다른 물고기들 차지가 되었습니다.',c:'bad',fx:()=>{S.health-=4}}]},
 {id:'strange',p:'처음 보는 마른 알갱이가 떨어진다. 고향 물에서는 본 적 없는 냄새다. 나는…',once:1,when:()=>S.f.wild&&fishIs('picky'),o:[
  {l:'한 입 먹어 본다',r:'{n}은 알갱이를 입에 넣었다 뱉었다 하다가, 결국 삼켰습니다.',c:'good',fx:()=>{S.f.refuse=0;S.health+=3},m:'처음 보는 먹이를 삼켰다. 살아야 했다.'},
  {l:'외면한다',r:'{n}은 알갱이를 외면했습니다. 알갱이는 바닥에서 썩어 갔습니다.',c:'bad',fx:()=>{S.f.refuse=1;S.f.wq-=4}}]},
 {id:'bully',p:'덩치 큰 물고기가 자꾸 나를 쫓아온다. 지느러미 끝이 따끔하다. 나는…',when:()=>fMatePressure()>.25,o:[
  {l:'수초와 돌 틈으로 숨는다',r:'{n}이 돌 틈으로 몸을 숨겼습니다.',c:'neutral',fx:()=>{if(S.f.hides){S.f.stress-=.1;say('좁은 틈 안까지는 쫓아오지 못했습니다.','good')}else{S.f.fin+=.15;say('숨을 데가 없었습니다. 맨유리 수조에는 수초 하나 없었습니다.','bad')}}},
  {l:'수면 가까이에서 버틴다',r:'{n}은 수면 가까이 구석에서 몸을 웅크렸습니다.',c:'bad',fx:()=>{S.f.stress+=.08;S.f.fin+=.08}},
  {l:'몸을 세우고 맞선다',r:'{n}이 지느러미를 활짝 펴고 맞섰습니다.',c:'neutral',fx:()=>{if(fishIs('aggro')||S.f.len>8){S.f.bully=0;say('상대가 물러났습니다.','good')}else{S.f.fin+=.25;S.health-=8;say('상대는 더 세게 물어뜯었습니다.','bad')}}}]},
 {id:'lid',p:'수면 위 틈으로 불빛이 보인다. 저 너머는 어떤 물일까. 나는…',when:()=>!S.f.lid,o:[
  {l:'꼬리를 힘껏 치고 뛰어오른다',r:'{n}이 수면 위로 몸을 날렸습니다.',c:'bad',fx:()=>{if(R()<.45+fx_().jump*.3)fEnd('jump');else say('{n}은 수조 가장자리에 부딪혀 다시 물속으로 떨어졌습니다.','sub')}},
  {l:'바닥으로 내려간다',r:'{n}은 불빛을 등지고 바닥으로 내려갔습니다.',c:'neutral'}]},
 {id:'net',p:'뜰채가 물속으로 들어온다. 나는…',when:()=>S.f.moveSoon,o:[
  {l:'있는 힘을 다해 달아난다',r:'{n}이 수조 안을 미친 듯이 달아났습니다. 비늘 몇 개가 떨어졌습니다.',c:'bad',fx:()=>{S.f.stress+=.1;S.health-=5;if(fishIs('puff')){S.f.puffT=2;say('{n}이 공처럼 몸을 부풀렸습니다.','bad')}}},
  {l:'가만히 몸을 맡긴다',r:'{n}은 뜰채 안에서 몸을 접었습니다.',c:'neutral'}]},
 {id:'sickhide',p:'몸이 무겁고 숨이 가쁘다. 나는…',when:()=>!!S.f.ill,o:[
  {l:'장식 뒤 구석에 숨는다',r:'{n}이 장식 뒤에 숨었습니다. 아무도 {n}을 보지 못했습니다.',c:'bad',fx:()=>{S.f.seen=-.4}},
  {l:'수조 앞쪽 유리 가까이에 머문다',r:'{n}은 유리 가까이에서 힘없이 떠 있었습니다.',c:'neutral',fx:()=>{S.f.seen=.4}}]},
 {id:'intake',p:'여과기 흡입구 쪽 물살이 세다. 몸이 끌려간다. 나는…',when:()=>S.f.len<4&&S.f.filter!=='없음'&&S.f.filter!=='스펀지 여과기',o:[
  {l:'물살을 타고 논다',r:'{n}이 흡입구 앞에서 물살을 탔습니다.',c:'bad',fx:()=>{if(R()<(S.r>.7?.05:.3))fEnd('intake');else say('{n}은 흡입구 망에 몸이 붙었다가 겨우 떨어져 나왔습니다.','sub')}},
  {l:'물살을 피해 수초 쪽으로 간다',r:'{n}은 물살이 약한 곳으로 피했습니다.',c:'neutral'}]},
 {id:'glass',p:'유리벽이 쿵쿵 울린다. 커다란 얼굴이 붙어 있다. 나는…',when:()=>S.o.fam==='아이 있는 가족',o:[
  {l:'수초 뒤로 숨는다',r:'{n}이 숨자 아이는 유리를 더 세게 두드렸습니다.',c:'bad',fx:()=>{S.f.stress+=.06}},
  {l:'유리 앞으로 헤엄쳐 간다',r:'{n}이 유리 앞으로 오자 아이가 손가락으로 {n}을 따라 그렸습니다.',c:'good',m:'유리 너머 작은 손가락이 나를 따라왔다.',fx:()=>{S.interest+=.06}}]},
 {id:'face',p:'밥 줄 시간마다 오는 얼굴이 유리 앞에 다가온다. 나는…',when:()=>['oscar','arowana','channa','koi','pleco','gar'].includes(S.sp.id)&&S.interest>.4,o:[
  {l:'반갑게 다가가 지느러미를 흔든다',r:'{n}이 주인을 알아보고 유리 앞에서 몸을 흔들었습니다. 주인이 한참 웃었습니다.',c:'good',m:'주인 얼굴을 알아보았다. 주인도 나를 알아보았다.',mw:1.4,fx:()=>{S.interest+=.12}},
  {l:'모른 척 바닥에 있는다',r:'{n}은 바닥에서 꼼짝하지 않았습니다.',c:'neutral'}]},
 {id:'air',p:'숨이 차다. 물 위의 공기가 필요하다. 나는…',when:()=>fishIs('air')&&(S.f.lidTight||S.f.wq<45),o:[
  {l:'수면으로 올라가 공기를 들이마신다',r:'{n}이 수면으로 올라갔습니다.',c:'neutral',fx:()=>{if(S.f.lidTight&&fx_().air>1&&R()<.35)fEnd('noair');else S.health+=3}},
  {l:'바닥에서 참는다',r:'{n}은 바닥에서 아가미만 빠르게 움직였습니다.',c:'bad',fx:()=>{S.health-=6}}]},
 {id:'newfish',p:'봉지에 담긴 낯선 물고기가 들어왔다. 낯선 냄새가 난다. 나는…',when:()=>S.f.newcomer,o:[
  {l:'다가가 냄새를 맡는다',r:'{n}이 새 물고기 곁으로 다가갔습니다.',c:'neutral',fx:()=>{if(S.f.carrier&&R()<.5)fSick(S.f.carrier);S.f.newcomer=0}},
  {l:'멀리 떨어져 지낸다',r:'{n}은 새 물고기를 피해 반대편 구석에서 지냈습니다.',c:'neutral',fx:()=>{S.f.newcomer=0;if(S.f.carrier&&R()<.25)fSick(S.f.carrier)}}]},
 {id:'mirror',p:'유리벽에 나와 똑같이 생긴 녀석이 있다. 지느러미를 펼친다. 나는…',when:()=>['betta','wildbetta','apisto'].includes(S.sp.id),o:[
  {l:'지느러미를 활짝 펴고 위협한다',r:'{n}이 아가미 뚜껑까지 펴고 유리에 비친 자신과 한참 겨뤘습니다.',c:'neutral',fx:()=>{S.f.stress+=.03}},
  {l:'모른 척 거품집을 짓는다',r:'{n}은 수면에 거품을 하나씩 붙여 집을 지었습니다.',c:'good',m:'수면에 거품집을 지었다. 혼자였지만.'}]},
];
FCH.push(
 {id:'current',p:'물살이 세다. 지느러미가 자꾸 뒤로 접힌다. 나는…',when:()=>filtOf(S.f.filter).flow>.45&&(fx_().longfin||fx_().cm<5),o:[
  {l:'물살을 거슬러 버틴다',r:'{n}은 물살에 맞서 몇 시간을 헤엄쳤습니다. 지느러미 끝이 해졌습니다.',c:'bad',fx:()=>{S.health-=4;S.f.fin+=.05}},
  {l:'수초 뒤로 숨는다',r:'{n}은 수초 뒤 잔잔한 구석을 찾아냈습니다.',c:'good',fx:()=>{S.f.stress-=.04}},
  {l:'바닥에 붙어 쉰다',r:'{n}은 바닥에 몸을 붙이고 물살이 지나가길 기다렸습니다.',c:'neutral'}]},
 {id:'night',p:'불이 꺼졌다. 수조 밖 방도 캄캄하다. 나는…',o:[
  {l:'바닥에 내려가 쉰다',r:'{n}은 바닥 가까이에서 지느러미를 접고 쉬었습니다.',c:'good',fx:()=>{S.f.stress-=.04;S.health+=2}},
  {l:'밤새 유리벽을 따라 돈다',r:'{n}은 밤새 유리벽을 따라 돌았습니다.',c:'bad',fx:()=>{S.f.stress+=.04}},
  {l:'수면 가까이 떠서 잠든다',r:'{n}은 수면 근처에 떠서 잠들었습니다.',c:'neutral'}]},
 {id:'hand',p:'물속으로 커다란 손이 들어온다. 나는…',when:()=>S.f.tank!=='pond',o:[
  {l:'구석으로 달아난다',r:'{n}은 구석으로 쏜살같이 달아났습니다.',c:'neutral',fx:()=>{S.f.stress+=.03}},
  {l:'손가락을 톡 쪼아 본다',r:'{n}이 손가락을 톡 쪼았습니다. 주인이 웃었습니다.',c:'good',fx:()=>{S.interest+=.08},m:'손가락을 쪼았다. 주인이 웃었다.'},
  {l:'가만히 있는다',r:'{n}은 꼼짝하지 않았습니다. 손은 {n}을 지나쳐 갔습니다.',c:'neutral'}]},
 {id:'leftover',p:'바닥에 며칠 지난 사료가 쌓여 있다. 곰팡이 냄새가 난다. 나는…',when:()=>S.f.wq<60,o:[
  {l:'배가 고프니 먹는다',r:'{n}은 곰팡이 핀 사료를 주워 먹었습니다.',c:'bad',fx:()=>{S.health+=2;if(R()<.3)fSick(pick(['aero','dropsy','swimb'].filter(d=>DZ[d])))}},
  {l:'먹지 않는다',r:'{n}은 썩은 사료를 외면하고 배를 곯았습니다.',c:'neutral',fx:()=>{S.health-=3}}]},
 {id:'prey',p:'작은 물고기 한 마리가 내 입 앞을 지나간다. 나는…',when:()=>fx_().pred&&fEatable().length>0,o:[
  {l:'삼킨다',r:'{n}이 순식간에 입을 벌렸습니다. 작은 물고기는 사라졌습니다.',c:'neutral',fx:()=>{fEatOne();S.health+=3}},
  {l:'그냥 보낸다',r:'{n}은 작은 물고기를 그냥 보냈습니다. 아직 배가 고프지 않았습니다.',c:'neutral'}]},
 {id:'shadow',p:'커다란 그림자가 머리 위를 맴돈다. 같은 수조의 큰 물고기다. 나는…',when:()=>!!fPredMate(),o:[
  {l:'무리 속에 섞인다',r:'{n}은 같은 종 무리 한가운데로 파고들었습니다.',c:'good',when:()=>fSameCount()>=3,fx:()=>{S.f.stress-=.03}},
  {l:'수초 속으로 숨는다',r:'{n}은 수초 깊숙이 몸을 밀어 넣었습니다.',c:'neutral',fx:()=>{if(!S.f.hides)S.health-=6}},
  {l:'수면 쪽으로 도망친다',r:'{n}은 수면 위로 몸을 날렸습니다.',c:'bad',fx:()=>{if(!S.f.lid&&R()<.3)fEnd('jump');else S.f.stress+=.06}}]},
 {id:'cold',p:'물이 차갑다. 몸이 굳어 간다. 나는…',when:()=>season()==='winter'&&fx_().temp==='trop'&&!S.f.heater&&S.f.tank!=='pond',o:[
  {l:'바닥에 붙어 힘을 아낀다',r:'{n}은 바닥에 붙어 꼼짝하지 않았습니다.',c:'neutral',fx:()=>{S.health-=3}},
  {l:'계속 헤엄쳐 버틴다',r:'{n}은 차가운 물속을 계속 헤엄쳤습니다. 몸이 더 지쳤습니다.',c:'bad',fx:()=>{S.health-=6}}]},
 {id:'heat',p:'물이 미지근하고 숨이 차다. 나는…',when:()=>season()==='summer'&&S.f.tank!=='pond'&&!S.f.fan,o:[
  {l:'수면에서 숨을 쉰다',r:'{n}은 수면에 입을 대고 뻐끔거렸습니다.',c:'neutral',fx:()=>{S.health-=2}},
  {l:'바닥에 가라앉아 움직이지 않는다',r:'{n}은 바닥에 가라앉아 숨을 아꼈습니다.',c:'neutral',fx:()=>{S.f.stress+=.03}}]},
 {id:'newhome',p:'처음 보는 물이다. 냄새도, 벽도 낯설다. 나는…',when:()=>S.f.moved,o:[
  {l:'구석구석 둘러본다',r:'{n}은 새 수조를 끝에서 끝까지 헤엄쳐 보았습니다.',c:'good',fx:()=>{S.f.moved=0;S.f.stress-=.05},m:'새 물을 끝에서 끝까지 헤엄쳐 보았다.'},
  {l:'한쪽 구석에 숨어 지낸다',r:'{n}은 며칠 동안 한쪽 구석에서 나오지 않았습니다.',c:'neutral',fx:()=>{S.f.moved=0;S.f.stress+=.04}}]},
 {id:'school',p:'무리가 한쪽으로 꺾인다. 나는…',when:()=>fx_().social==='school'&&fSameCount()>=3,o:[
  {l:'함께 꺾는다',r:'{n}은 무리와 한 몸처럼 방향을 틀었습니다.',c:'good',fx:()=>{S.f.stress-=.04},m:'무리와 한 몸처럼 꺾었다.'},
  {l:'혼자 반대로 간다',r:'{n}은 혼자 반대쪽으로 헤엄쳤습니다.',c:'neutral',fx:()=>{S.f.stress+=.02}}]},
 {id:'eggs',p:'돌 위에 알이 붙어 있다. 다른 물고기들이 다가온다. 나는…',when:()=>['apisto','altum','betta','wildbetta','oscar','channa'].includes(S.sp.id)&&fSameCount()>=1&&S.ageM>S.sp.life*.12,o:[
  {l:'알 앞을 막아선다',r:'{n}은 지느러미를 펴고 알 앞을 지켰습니다. 다가오던 물고기들이 물러났습니다.',c:'good',fx:()=>{S.f.stress+=.05;S.f.spawns=(S.f.spawns||0)+1},m:'알을 지켰다. 끝까지.'},
  {l:'내버려 둔다',r:'{n}은 알을 내버려 두었습니다. 다음 날 아침 돌 위는 비어 있었습니다.',c:'neutral'}]},
 {id:'gasp',p:'물에서 쓴맛이 난다. 아가미가 따갑다. 나는…',when:()=>S.f.wq<40,o:[
  {l:'수면에 올라 숨을 쉰다',r:'{n}은 수면에서 입을 뻐끔거렸습니다. 주인이 그걸 봤습니다.',c:'neutral',fx:()=>{if(S.r>.4){S.f.wq+=20;addLog(T('주인이 놀라 물을 갈아 주었습니다.'),'good')}}},
  {l:'바닥에서 버틴다',r:'{n}은 바닥에서 아가미만 빠르게 움직였습니다.',c:'bad',fx:()=>{S.health-=5}}]},
 {id:'sky',p:'수면 위로 커다란 그림자가 드리운다. 나는…',when:()=>S.f.tank==='pond',o:[
  {l:'깊은 곳으로 내려간다',r:'{n}은 연못 바닥 그늘로 내려갔습니다. 그림자는 곧 날아갔습니다.',c:'good'},
  {l:'먹이인 줄 알고 올라간다',r:'{n}은 수면으로 올라갔습니다.',c:'bad',fx:()=>{if(!S.f.net&&R()<.35)fEnd('pond');else S.scaredT=2}}]},
);
FCH.push(
 {id:'look',p:'주인이 오랜만에 수조 앞에 멈춰 섰다. 나는…',when:()=>S.interest<.55&&!S.preOwner,o:[
  {l:'유리 앞으로 가서 꼬리를 흔든다',r:'{n}이 유리 앞에서 꼬리를 흔들었습니다. 주인이 한참 들여다보더니 물을 갈아 주었습니다.',c:'good',fx:()=>{S.interest+=.18;S.f.wq+=12},m:'주인이 다시 나를 봤다.'},
  {l:'수초 뒤에 숨는다',r:'{n}은 숨었습니다. 주인은 곧 돌아섰습니다.',c:'neutral',fx:()=>{S.interest-=.03}}]},
 {id:'beg',p:'밥 줄 시간이 한참 지났다. 주인이 수조를 그냥 지나친다. 나는…',when:()=>S.interest<.7,o:[
  {l:'수면에서 입을 뻐끔거린다',r:'{n}이 수면에서 입을 뻐끔거렸습니다. 주인이 "아, 맞다" 하며 사료를 넣었습니다.',c:'good',fx:()=>{S.interest+=.1;S.health+=3}},
  {l:'바닥에서 기다린다',r:'{n}은 기다렸습니다. 사료는 다음 날에야 떨어졌습니다.',c:'neutral',fx:()=>{S.health-=3}}]},
 {id:'gorge',p:'사료가 한 움큼 떨어진다. 다 먹으면 배가 터질 것 같다. 나는…',when:()=>S.r<.6,o:[
  {l:'보이는 대로 다 먹는다',r:'{n}은 배가 동그래질 때까지 먹었습니다.',c:'bad',fx:()=>{S.f.fat=(S.f.fat||0)+.2;S.health+=2;if(R()<.2&&DZ.swimb)fSick('swimb')}},
  {l:'적당히 먹고 멈춘다',r:'{n}은 몇 알만 먹고 멈췄습니다. 나머지는 바닥에 가라앉았습니다.',c:'good',fx:()=>{S.health+=2;S.f.wq-=3}}]},
 {id:'sickmate',p:'같은 수조의 물고기 몸에 하얀 점이 돋아 있다. 나는…',when:()=>S.f.mates.some(m=>m.n>0)&&!S.f.ill,o:[
  {l:'멀찍이 떨어져 지낸다',r:'{n}은 수조 반대편 구석에서 지냈습니다.',c:'good',fx:()=>{S.f.stress+=.02}},
  {l:'평소처럼 지낸다',r:'{n}은 그 물고기 옆을 평소처럼 지나다녔습니다.',c:'neutral',fx:()=>{if(R()<.35)fSick('ich')}}]},
 {id:'bug',p:'수면 위에 날벌레 한 마리가 앉았다. 나는…',when:()=>!S.f.lid&&S.f.tank!=='pond'&&(fx_().jump||0)>=.3,o:[
  {l:'뛰어올라 낚아챈다',r:'{n}이 수면 위로 몸을 날렸습니다.',c:'bad',fx:()=>{if(R()<.3)fEnd('jump');else{addLog(T('{n}은 벌레를 물고 물속으로 다시 떨어졌습니다.'),'good');S.health+=2}}},
  {l:'수면 아래서 기다린다',r:'{n}은 벌레가 떨어지길 기다렸습니다. 벌레는 날아갔습니다.',c:'neutral'}]},
 {id:'decor',p:'새 장식물이 들어왔다. 구멍 가장자리가 날카롭다. 나는…',when:()=>S.f.tank!=='pond'&&S.r<.7,o:[
  {l:'구멍 속으로 들어가 본다',r:'{n}은 구멍 속으로 몸을 밀어 넣었습니다.',c:'neutral',fx:()=>{if(fx_().longfin||R()<.3){S.f.fin+=.15;addLog(T('나올 때 지느러미가 찢어졌습니다.'),'bad')}else{S.f.hides=1;S.f.stress-=.04}}},
  {l:'멀리 돌아간다',r:'{n}은 장식물을 멀리 돌아 헤엄쳤습니다.',c:'neutral'}]},
 {id:'rival',p:'나와 닮은 녀석이 영역 안으로 들어온다. 나는…',when:()=>(fx_().aggro||['oscar','channa','apisto','altum'].includes(S.sp.id))&&fSameCount()>=1,o:[
  {l:'정면으로 맞선다',r:'{n}이 아가미를 펴고 덤볐습니다.',c:'bad',fx:()=>{S.health-=8;S.f.fin+=.1;S.f.stress+=.05}},
  {l:'영역을 내주고 물러난다',r:'{n}은 구석으로 물러났습니다.',c:'neutral',fx:()=>{S.f.stress+=.04}},
  {l:'지느러미만 펴고 버틴다',r:'{n}이 지느러미를 펴고 버티자 상대가 먼저 물러났습니다.',c:'good',fx:()=>{S.f.stress-=.02}}]},
 {id:'quiet',p:'오늘은 수조가 조용하다. 물도 맑다. 나는…',when:()=>S.f.wq>70&&S.f.stress<.3,o:[
  {l:'수조 끝에서 끝까지 헤엄친다',r:'{n}은 수조 끝에서 끝까지 천천히 헤엄쳤습니다.',c:'good',fx:()=>{S.health+=3},m:'맑은 물, 조용한 하루.'},
  {l:'수초 그늘에서 쉰다',r:'{n}은 그늘에서 지느러미를 접고 쉬었습니다.',c:'good',fx:()=>{S.f.stress-=.04}}]},
);
FCH.push(
 {id:'intruder',p:'내 영역에 다른 물고기가 들어왔다. 나는…',when:()=>fbOf(S.sp.id).hostile>=.3&&S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id&&!m.feed),o:[
  {l:'지느러미를 펴고 쫓아낸다',r:'{n}이 지느러미를 펴자 그 물고기는 수조 반대편으로 달아났습니다.',c:'neutral',fx:()=>{S.f.stress-=.02}},
  {l:'끝까지 쫓아가 문다',r:'{n}은 그 물고기를 수조 끝까지 쫓아가 물었습니다.',c:'bad',fx:()=>{const v=S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&!m.feed&&m.cm<=S.f.len*1.3);if(v.length&&R()<.5){const t=pick(v);t.n--;S.f.mates=S.f.mates.filter(m=>m.n>0);addLog(T('며칠 뒤, 그 '+josa(mateName(t),'은')+' 수면에 떠올랐습니다.'),'bad')}}},
  {l:'모른 척 지나간다',r:'{n}은 그 물고기를 내버려 두었습니다.',c:'good',fx:()=>{S.f.stress+=.02}}]},
);
FCH.forEach((c,i)=>{c.i=i;c.o.forEach(o=>o.c=o.c||'neutral')});

/* everyday fish events (non-fatal). when()/fx() read S.f. "처음" → once */
const FFL=[
 // water and care
 {t:'물이 탁해졌지만 아무도 눈치채지 못합니다.',c:'bad',w:1.4,when:()=>S.f.wq<70,fx:()=>{S.f.wq-=5}},
 {t:'주인이 물을 3분의 1쯤 갈아 주었습니다. 온도와 염소까지 맞춘 새 물이었습니다.',c:'good',when:()=>S.r>.55,fx:()=>{S.f.wq+=15},m:'새 물이 들어왔다. 아가미가 시원했다.'},
 {t:'주인이 사료를 한 움큼 넣었습니다. 다 먹지 못한 사료가 바닥에서 썩기 시작했습니다.',c:'bad',when:()=>S.r<.5,fx:()=>{S.f.wq-=8;S.f.fat=(S.f.fat||0)+.1}},
 {t:'주인이 여과재를 수돗물로 박박 빨았습니다. 물을 맑게 해 주던 박테리아가 한꺼번에 죽었습니다.',c:'bad',once:'sponge',when:()=>!['없음','연못 여과기'].includes(S.f.filter)&&S.r<.55,fx:()=>{S.f.cycled=0;S.f.tankAge=0;S.f.wq-=12}},
 {t:'수조 조명을 하루 종일 켜 둬서 녹조가 폈습니다. 유리가 초록색이 되었습니다.',c:'bad',when:()=>S.r<.6,fx:()=>{S.f.algae=1;S.f.wq-=3}},
 {t:'주인이 유리의 녹조를 긁어내고 바닥 찌꺼기를 사이펀으로 빨아냈습니다.',c:'good',when:()=>S.r>.5,fx:()=>{S.f.algae=0;S.f.wq+=10}},
 {t:'물이 증발해서 수위가 손가락 두 마디만큼 내려갔습니다.',c:'bad',when:()=>S.r<.6,fx:()=>{S.f.wq-=4}},
 {t:'주인이 수질 테스트 키트로 암모니아와 아질산을 재고 노트에 적었습니다.',c:'good',when:()=>S.r>.75,fx:()=>{S.f.wq+=6}},
 {t:'주인이 수초를 몇 포기 심어 주었습니다. {n}은 수초 사이를 들락날락했습니다.',c:'good',once:'plant',when:()=>!S.f.hides&&S.r>.35,fx:()=>{S.f.hides=1;S.f.stress-=.1},m:'수초 사이 그늘. 숨을 곳이 생겼다.'},
 {t:'주인이 작은 걸이식 여과기를 사서 달아 주었습니다. 물이 흐르기 시작했습니다.',c:'good',once:'filterup',when:()=>S.f.filter==='없음'&&S.r>.3,fx:()=>{S.f.filter='걸이식 여과기';S.r=clamp(S.r+.05,0,.98)},m:'물이 흐르기 시작했다. 숨쉬기가 편했다.'},
 {t:'주인이 수조 뚜껑을 샀습니다.',c:'good',once:'lid',when:()=>!S.f.lid&&S.r>.4,fx:()=>{S.f.lid=1}},
 {t:'정전으로 여과기가 하룻밤 멈췄습니다. 아침에 물에서 비린내가 났습니다.',c:'bad',w:.6,when:()=>S.f.filter!=='없음',fx:()=>{S.f.wq-=10}},
 {t:'폭염으로 수온계가 31도를 가리킵니다. 물속 산소가 모자라 {n}이 수면에서 입을 뻐끔거립니다.',c:'bad',when:()=>season()==='summer'&&S.f.tank!=='pond',fx:()=>{S.health-=fx_().temp==='cold'?9:5;S.f.stress+=.05}},
 {t:'주인이 수조에 냉각팬을 달아 주었습니다. 물 표면이 잔잔하게 일렁였습니다.',c:'good',once:'fan',when:()=>season()==='summer'&&S.r>.6,fx:()=>{S.f.fan=1}},
 {t:'히터가 고장 났습니다. 열대어인 {n}의 움직임이 느려졌습니다.',c:'bad',w:.7,when:()=>season()==='winter'&&fx_().temp==='trop'&&S.f.heater,fx:()=>{S.health-=8;S.f.coldShock=1}},
 {t:'히터 없이 겨울을 맞았습니다. 수온계가 17도에 멈춰 있습니다. {n}은 바닥에서 움직이지 않습니다.',c:'bad',w:1.5,when:()=>season()==='winter'&&fx_().temp==='trop'&&!S.f.heater,fx:()=>{S.health-=10;S.f.coldShock=1;S.f.stress+=.1}},
 {nm:1,t:'주인이 마트에서 물고기 몇 마리를 더 사 와 봉지째 쏟아 넣었습니다. 검역은 없었습니다.',c:'bad',once:'morefish',when:()=>S.r<.6&&S.f.tank!=='cup'&&S.f.tank!=='vase',fx:()=>{fAddMates(2+Math.floor(R()*3),true)}},
 {nm:1,t:'주인이 새 물고기를 따로 2주 동안 검역한 뒤에 합사했습니다.',c:'good',once:'morefish',when:()=>S.r>.7,fx:()=>{fAddMates(2,false)}},
 // breeders: line breeding as a hobby, and mills
 {t:'주인이 {n}의 지느러미 모양을 고정하려고 같은 핏줄끼리 짝을 지었습니다. 태어난 치어 중 절반은 등이 굽어 있었습니다.',c:'bad',once:'line',when:()=>S.f.own==='breeder',fx:()=>{S.f.spawns=(S.f.spawns||0)+1;breakP(4,'근친 번식')}},
 {t:'주인이 번식 기록장에 {n}의 혈통과 산란 날짜를 적었습니다. 치어들은 한 마리씩 이름표가 붙은 컵으로 옮겨졌습니다.',c:'neutral',when:()=>S.f.own==='breeder'},
 {t:'번식장 선반에는 똑같은 수조 수십 개가 층층이 쌓여 있었습니다. {n}의 수조에는 이름 대신 번호가 붙었습니다.',c:'bad',once:'mill',when:()=>S.f.own==='mill',fx:()=>{S.f.stress+=.05}},
 {t:'알을 더 받기 위해 주인이 수온을 올리고 조명 시간을 늘렸습니다. {n}은 쉴 틈이 없었습니다.',c:'bad',when:()=>S.f.own==='mill',fx:()=>{S.f.stress+=.06;S.health-=4;S.f.spawns=(S.f.spawns||0)+1}},
 {t:'무늬가 고르지 않은 치어 수백 마리가 양동이째 하수구에 쏟아졌습니다. 그중 몇은 {n}의 새끼였습니다.',c:'bad',when:()=>S.f.own==='mill'&&(S.f.spawns||0)>0,fx:()=>{breakP(4,'치어를 하수구에 버림')}},
 {t:'"이번 배는 못생겼다." 주인은 치어 전부를 대형어 수조에 쏟았습니다. 오스카가 수면에서 입을 벌렸습니다.',c:'bad',when:()=>S.f.own==='mill'&&(S.f.spawns||0)>1,fx:()=>{breakP(4,'치어를 먹이로 줌')}},
 // filters: each kind has its own trouble
 {t:'스펀지 여과기의 에어펌프가 밤새 "드르륵" 울립니다. 주인은 시끄럽다며 밤마다 펌프 전원을 뽑았습니다.',c:'bad',once:'pump',when:()=>filtOf(S.f.filter).air&&S.r<.6,fx:()=>{S.f.pumpOff=1;S.f.wq-=6}},
 {t:'주인이 에어펌프에 소음 방지 패드를 깔고 다시 켜 두었습니다.',c:'good',once:'pumpok',when:()=>S.f.pumpOff&&S.r>.4,fx:()=>{S.f.pumpOff=0}},
 {t:'바닥재를 한 번도 청소하지 않은 저면 여과기가 막혔습니다. 자갈 아래에서 썩은 물 냄새가 올라옵니다.',c:'bad',when:()=>filtOf(S.f.filter).ug&&S.f.tankAge>10&&S.r<.7,fx:()=>{S.f.wq-=12}},
 {t:'외부 여과기 물살이 너무 셉니다. {n}의 지느러미가 물살에 계속 뒤로 접힙니다.',c:'bad',when:()=>filtOf(S.f.filter).flow>.45&&(fx_().longfin||fx_().cm<5)&&tankL()<170,fx:()=>{S.f.stress+=.05;if(fx_().longfin)S.f.fin+=.05}},
 {t:'주인이 여과기 출수구에 스펀지를 씌워 물살을 줄였습니다.',c:'good',once:'baffle',when:()=>filtOf(S.f.filter).flow>.45&&(fx_().longfin||fx_().cm<5)&&S.r>.6,fx:()=>{S.f.stress-=.08}},
 {t:'상면 여과기 위 뚜껑 틈으로 물 떨어지는 소리가 하루 종일 납니다. 주인은 그 소리가 좋다고 했습니다.',c:'neutral',when:()=>S.f.filter==='상면 여과기'},
 {t:'로봇청소기가 여과기 전선을 걸고 지나가 콘센트가 뽑혔습니다. 사흘 뒤에야 누군가 알아챘습니다.',c:'bad',once:'robot',when:()=>S.f.filter!=='없음'&&S.f.tank!=='pond',fx:()=>{S.f.wq-=22;S.health-=6}},
 {t:'섬프 여과기 배수관이 막혀 물이 넘칠 뻔했습니다. 주인이 새벽에 일어나 관을 뚫었습니다.',c:'neutral',when:()=>S.f.filter==='섬프 여과기'},
 // the absurd
 {t:'수조 받침이 한쪽으로 살짝 기울어 있습니다. 실리콘 이음매에 물방울이 맺혀 있지만 아무도 보지 못했습니다.',c:'bad',once:'leak',when:()=>S.f.tank!=='pond'&&tankL()>=27&&S.r<.75,fx:()=>{S.f.leak=1}},
 {t:'주인이 수평계를 대 보고 받침 다리 밑에 고무판을 괴었습니다.',c:'good',once:'level',when:()=>S.f.leak&&S.r>.55,fx:()=>{S.f.leak=0}},
 {t:'주인이 어항을 남향 창가로 옮겼습니다. "햇볕 좀 보라고."',c:'bad',once:'window',when:()=>['bowl','t20','t30'].includes(S.f.tank)&&S.r<.55,fx:()=>{S.f.window=1;S.f.algae=1}},
 {t:'주인이 수조에 형광색 장식돌을 넣었습니다. 며칠 뒤 물이 이상한 색으로 물들었습니다.',c:'bad',once:'deco',when:()=>S.r<.5&&S.f.tank!=='pond',fx:()=>{S.f.wq-=10;S.f.stress+=.05}},
 {t:'아이가 수조에 장난감 자동차를 빠뜨렸습니다. 녹슨 물이 바닥에서 조금씩 번졌습니다.',c:'bad',once:'toy',when:()=>S.o.fam==='아이 있는 가족'&&S.f.tank!=='pond',fx:()=>{S.f.wq-=8}},
 {t:'주인이 "물이 깨끗해 보이라고" 락스를 한 방울 탔습니다. {n}의 아가미가 하얗게 질렸다가 겨우 돌아왔습니다.',c:'bad',once:'bleach',when:()=>S.r<.35,fx:()=>{S.health-=22;S.f.stress+=.15}},
 // what people do to a fish for a photo, a laugh, a bet
 {t:'주인이 {n}을 손으로 건져 아이에게 만져 보게 했습니다. 몇 초 동안 {n}은 공기 속에서 입을 벌렸습니다.',c:'bad',when:()=>S.o.fam==='아이 있는 가족'&&S.r<.55&&S.f.len<25,fx:()=>{S.health-=8;S.f.stress+=.08;S.scaredT=3}},
 {t:'손님에게 보여 주겠다며 주인이 {n}을 유리컵에 떠서 식탁에 올려 두었습니다. 컵은 저녁 내내 그 자리에 있었습니다.',c:'bad',when:()=>S.r<.45&&S.f.len<12,fx:()=>{S.health-=10;S.f.stress+=.1}},
 {t:'주인이 SNS에 올릴 사진을 찍으려 {n}을 뜰채째 들어 올렸습니다. 셔터 소리가 열 번 넘게 났습니다.',c:'bad',when:()=>S.r<.6,fx:()=>{S.health-=6;S.f.stress+=.06}},
 {t:'"화난 모습이 멋있다." 주인이 {n}의 수조 앞에 거울을 세워 두고 하루 종일 치우지 않았습니다.',c:'bad',when:()=>['betta','wildbetta'].includes(S.sp.id)&&S.r<.6,fx:()=>{S.f.stress+=.12;S.health-=4}},
 {t:'술자리에서 누군가 {n}이 먼저 먹이를 먹는지를 두고 내기를 걸었습니다. 사료가 한 움큼씩 연달아 떨어졌습니다.',c:'bad',when:()=>S.o.age<40&&S.r<.5,fx:()=>{S.f.wq-=10;S.f.fat=(S.f.fat||0)+.15}},
 {t:'주인이 "운동시킨다"며 뜰채로 {n}을 수조 끝까지 몰았습니다. {n}이 지쳐 바닥에 누울 때까지.',c:'bad',when:()=>S.r<.35,fx:()=>{S.health-=7;S.f.stress+=.1}},
 // cruelty for fun
 {t:'술자리에서 누군가 {n}을 다른 수컷 베타와 한 컵에 넣고 "싸움 붙이자"며 만 원씩 걸었습니다. 둘은 컵 안에서 서로의 지느러미를 찢었습니다.',c:'bad',once:'betfight',when:()=>S.sp.id==='betta'&&!fem()&&S.o.age<40&&['casual','content'].includes(S.f.own),fx:()=>{S.f.fin+=.45;S.health-=25;S.f.stress+=.2;if(S.health<=15){render();fEnd('fight')}}},
 {t:'아이들이 {n}을 뜰채로 떠서 거실 바닥에 놓고, 누가 먼저 맨손으로 잡나 내기를 했습니다.',c:'bad',once:'floor',when:()=>S.o.fam==='아이 있는 가족'&&S.f.len<10&&S.r<.5&&S.f.tank!=='pond',fx:()=>{S.health-=22;S.f.stress+=.15;if(R()<.3)fCr('squeeze')}},
 {t:'주인 친구가 "이거 회 떠도 되냐"며 {n}을 뜰채로 들어 도마 위에 올려 보았습니다. 다들 웃었습니다. {n}은 한참 도마 위에서 입을 벌렸습니다.',c:'bad',once:'board',when:()=>S.f.len>=20&&['casual','content'].includes(S.f.own),fx:()=>{S.health-=14;S.f.stress+=.15},m:'도마는 차갑고 말라 있었다.',mw:1.4},
 {t:'식당 사장이 손님에게 보여 주려고 {n}을 뜰채로 떴다가 바닥에 떨어뜨렸습니다. 손님들이 비명을 질렀고, 사장은 {n}을 맨손으로 집어 수조에 던져 넣었습니다.',c:'bad',once:'drop',when:()=>S.f.place==='restaurant',fx:()=>{S.health-=20;S.f.stress+=.1}},
 {t:'주인이 "물고기도 운동해야 한다"며 {n}을 세면대 물에 풀어 놓고 수도꼭지를 틀었습니다. 차가운 물살이 {n}을 배수구 쪽으로 밀었습니다.',c:'bad',once:'sink',when:()=>S.r<.3&&S.f.len<15&&S.f.tank!=='pond',fx:()=>{S.health-=15;S.f.coldShock=1;if(R()<.15){render();fEnd('sink')}}},
 // places
 {t:'아이들이 돌아가며 먹이 당번을 했습니다. 오늘은 세 명이 각자 한 숟갈씩 넣었습니다.',c:'bad',when:()=>S.f.place==='classroom',fx:()=>{S.f.wq-=10;S.f.fat=(S.f.fat||0)+.1}},
 {t:'쉬는 시간마다 아이들이 수조 유리를 두드리며 {n}의 이름을 불렀습니다.',c:'neutral',when:()=>S.f.place==='classroom',m:'작은 얼굴들이 유리에 붙어 내 이름을 불렀다.',fx:()=>{S.f.stress+=.03}},
 {t:'주말 이틀 동안 사무실에는 아무도 없었습니다. 월요일 아침, 누군가 사료를 두 배로 넣었습니다.',c:'bad',when:()=>S.f.place==='office',fx:()=>{S.f.wq-=8;S.health-=3}},
 {t:'직원이 커피를 들고 수조를 들여다보다 몇 방울을 흘렸습니다. 아무도 닦지 않았습니다.',c:'bad',when:()=>S.f.place==='office',fx:()=>{S.f.wq-=4}},
 {t:'손님의 아이들이 수조 유리를 손바닥으로 탕탕 두드렸습니다. 사장은 웃으며 "괜찮아요"라고 했습니다.',c:'bad',when:()=>S.f.place==='restaurant',fx:()=>{S.f.stress+=.06;S.scaredT=2}},
 {t:'주방 기름 연기가 수조 위에 앉아 수면에 얇은 막이 생겼습니다.',c:'bad',when:()=>S.f.place==='restaurant'&&S.f.tank!=='pond',fx:()=>{S.f.wq-=7}},
 {t:'사장은 손님 보기 좋으라고 수조 조명을 밤새 켜 두었습니다. {n}은 잘 시간이 없었습니다.',c:'bad',when:()=>S.f.place==='restaurant',fx:()=>{S.f.stress+=.05;S.f.algae=1}},
 {t:'손님이 먹다 남은 밥알을 연못에 던졌습니다. 물고기들이 몰려들자 다들 박수를 쳤습니다.',c:'bad',when:()=>S.f.place==='restaurant'&&S.f.tank==='pond',fx:()=>{S.f.wq-=6}},
 // stress, crowding, mates
 {t:'수조에 물고기가 너무 많습니다. 서로 지느러미가 스칠 만큼 비좁습니다.',c:'bad',when:()=>fLoad()>1.2,fx:()=>{S.f.stress+=.06}},
 {t:'무리 지어 사는 {n}에게 같은 종 친구가 한 마리도 없습니다. {n}은 구석에서 색이 바래 갑니다.',c:'bad',once:'alone',when:()=>fx_().social==='school'&&fSameCount()<4,fx:()=>{S.f.stress+=.08}},
 {t:'{n}이 같은 종 무리 사이에서 나란히 헤엄쳤습니다. 무리가 한쪽으로 꺾일 때 {n}도 함께 꺾였습니다.',c:'good',when:()=>fx_().social==='school'&&fSameCount()>=5,m:'무리와 함께 헤엄쳤다. 혼자가 아니었다.',fx:()=>{S.f.stress-=.04}},
 {t:'같은 수조의 지느러미 뜯는 물고기가 {n}의 긴 지느러미를 쫓아다니며 뜯었습니다.',c:'bad',when:()=>fx_().longfin&&S.f.mates.some(m=>m.n>0&&m.id!==S.sp.id&&mateFx(m).nip),fx:()=>{S.f.fin+=.2;S.f.stress+=.05}},
 {t:'{n}이 수조의 작은 물고기를 한 마리 삼켰습니다. 주인은 "원래 그런 애"라며 웃었습니다.',c:'neutral',when:()=>fx_().pred&&fEatable().length>0,fx:()=>{fEatOne();S.health+=3}},
 {t:'{n}이 지나가는 물고기들의 지느러미를 하나씩 물어뜯었습니다.',c:'neutral',when:()=>fx_().nip&&S.f.mates.length>0,fx:()=>{S.f.wq-=2}},
 // owner types
 {t:'주인이 물생활 커뮤니티에 {n}의 사진과 수질 기록을 올렸습니다. "정성이 대단하다"는 댓글이 달렸습니다.',c:'good',when:()=>S.f.own==='expert',m:'주인은 매일 내 물을 쟀다.'},
 {t:'주인이 유튜브로 "물잡이" 영상을 보고 노트에 받아 적었습니다.',c:'good',once:'study',when:()=>S.f.own==='learner',fx:()=>{S.r=clamp(S.r+.12,0,.95)}},
 {t:'주인은 {n}에게 "어차피 물고기"라며 일주일 넘게 눈길도 주지 않았습니다.',c:'bad',when:()=>['casual','gift'].includes(S.f.own),fx:()=>{S.interest-=.06}},
 {t:'주인이 살아 있는 먹이용 금붕어 한 봉지를 사 왔습니다. 물고기들이 {n}의 입속으로 하나씩 사라졌습니다. 그중 몇 마리는 이미 하얀 점이 돋아 있었습니다.',c:'bad',when:()=>fx_().pred&&['content','casual'].includes(S.f.own)&&S.f.len>8,fx:()=>{S.health+=4;if(R()<.35)fSick(R()<.5?'ich':'worms')}},
 {t:'주인이 {n}의 먹방 영상을 찍었습니다. 썸네일에는 "괴물 물고기의 식사"라고 적혔습니다.',c:'neutral',when:()=>S.f.own==='content'&&fx_().pred,m:'불빛이 번쩍였다. 사람들이 나를 보고 있었다.'},
 {t:'주인이 조회수를 위해 {n}이 있는 수조에 다른 대형어를 넣고 촬영했습니다. {n}의 몸에 이빨 자국이 남았습니다.',c:'bad',once:'fight',when:()=>S.f.own==='content'&&fx_().big,fx:()=>{S.health-=14;S.f.fin+=.2;S.f.stress+=.15}},
 {t:'주인이 번식을 위해 {n}에게 짝을 붙여 주었습니다.',c:'neutral',once:'pair',when:()=>S.f.own==='breeder'&&!S.f.pair,fx:()=>{S.f.pair=1}},
 {t:'치어가 태어났습니다. 주인은 무늬가 고르지 않은 치어들을 골라 대형어의 먹이로 주었습니다.',c:'bad',when:()=>S.f.pair&&S.f.own==='breeder',fx:()=>{S.f.spawns=(S.f.spawns||0)+1;S.health-=fem()?6:2;breakP(4,'치어를 먹이로 줌')}},
 {t:'치어가 태어났습니다. 주인은 키울 데가 없다며 치어들을 변기에 흘려보냈습니다.',c:'bad',when:()=>fx_().breedEasy&&S.f.own!=='breeder'&&fSameCount()>=1&&S.r<.6,fx:()=>{S.f.spawns=(S.f.spawns||0)+1;if(fem())S.health-=3;breakP(4,'치어를 변기에 버림')}},
 {t:'치어가 수조 가득 늘었습니다. 주인은 "무료 분양"이라며 중고거래 앱에 사진을 올렸습니다.',c:'neutral',when:()=>fx_().breedEasy&&fSameCount()>=1,fx:()=>{S.f.spawns=(S.f.spawns||0)+1;S.f.wq-=4}},
 // species
 {t:'{n}의 머리 위 혹이 조금 더 자라 눈가까지 내려왔습니다.',c:'bad',when:()=>S.sp.id==='oranda'&&S.ageM>18,fx:()=>{S.f.wen=(S.f.wen||0)+.25}},
 {t:'주인이 수의사에게 데려가 {n}의 눈을 덮던 혹을 조금 잘라 냈습니다. {n}이 다시 앞을 봅니다.',c:'good',once:'wen',when:()=>S.sp.id==='oranda'&&S.f.wen>.6&&S.r>.75,fx:()=>{S.f.wen=0},m:'다시 앞이 보였다. 물빛이 이렇게 밝았다.',mw:1.4},
 {t:'{n}이 수면에 거품 둥지를 지었습니다. 알을 낳을 상대는 없었습니다.',c:'neutral',when:()=>S.sp.id==='betta'||S.sp.id==='wildbetta'},
 {t:'{n}이 수면 위로 입을 내밀고 공기를 한 모금 들이켰습니다.',c:'neutral',when:()=>fishIs('air')},
 {t:'{n}이 바닥 자갈을 입에 물었다 뱉었다 하며 놀았습니다.',c:'neutral',when:()=>isGold()||S.sp.id==='koi'},
 {t:'{n}이 다른 클라운 로치들과 옆으로 누워 쉬고 있습니다. 딸깍딸깍 작은 소리가 납니다.',c:'good',when:()=>S.sp.id==='clownloach'&&fSameCount()>=3,m:'친구들과 나란히 누워 쉬었다. 딸깍, 딸깍.'},
 {t:'{n}의 부리 같은 이빨이 자라 입이 잘 닫히지 않습니다.',c:'bad',when:()=>fx_().beak&&!S.f.snails,fx:()=>{S.f.beak=(S.f.beak||0)+.2}},
 {t:'주인이 달팽이를 키워 {n}에게 주었습니다. {n}이 껍데기째 와작 깨 먹었습니다.',c:'good',when:()=>fishIs('puff')&&S.r>.6,fx:()=>{S.f.snails=1;S.f.beak=Math.max(0,(S.f.beak||0)-.4);S.f.refuse=0},m:'달팽이 껍데기를 깨 먹었다. 고향 강 맛이 났다.'},
 {t:'주인이 수조 물에 해수염을 조금씩 늘려 갔습니다. {n}의 색이 진해졌습니다.',c:'good',once:'salt',when:()=>fx_().water==='brack'&&S.r>.7,fx:()=>{S.f.waterOK=1}},
 {t:'{n}은 민물에서 지냅니다. 강어귀에서 온 몸이 조금씩 지쳐 갑니다.',c:'bad',when:()=>fx_().water==='brack'&&!S.f.waterOK,fx:()=>{S.f.stress+=.04}},
 {t:'{n}이 밤마다 유리벽에 부딪힙니다. 한쪽 눈이 조금씩 아래로 처지기 시작했습니다.',c:'bad',once:'drop',when:()=>S.sp.id==='arowana'&&S.f.len>30,fx:()=>{S.f.dropEye=1}},
 {t:'{n}의 가장자리 지느러미가 물결치듯 일렁였습니다. 모래 속에 몸을 반쯤 묻고 쉽니다.',c:'good',when:()=>S.sp.id==='motoro'&&S.f.sand},
 {t:'{n}이 모래 없는 맨바닥 수조에서 배를 쓸립니다. 몸 아래가 붉게 헐었습니다.',c:'bad',when:()=>S.sp.id==='motoro'&&!S.f.sand,fx:()=>{S.health-=4;S.f.stress+=.05}},
 {t:'{n}이 밤이 되자 은신처 관에서 나와 바닥을 훑고 다녔습니다. 몸 주위로 보이지 않는 전기가 흐릅니다.',c:'neutral',when:()=>S.sp.id==='ghost'},
 {t:'{n}은 낮 내내 숨을 곳을 찾아 헤맸습니다. 수조에는 몸을 넣을 관이 없었습니다.',c:'bad',when:()=>S.sp.id==='ghost'&&!S.f.hides,fx:()=>{S.f.stress+=.06}},
 {t:'{n}이 수면으로 올라와 폐로 숨을 쉬었습니다. 2억 년 전 조상이 하던 그대로입니다.',c:'neutral',when:()=>S.sp.id==='bichir'},
 {t:'{n}의 몸길이가 수조 폭을 넘어섰습니다. 돌아설 때마다 꼬리가 유리에 닿습니다.',c:'bad',when:()=>S.f.len>tankOf(S.f.tank).len*.38,fx:()=>{S.f.stress+=.06}},
 {t:'주인이 "손가락만 했는데"라며 {n}의 사진을 SNS에 올렸습니다. "그 수조로는 안 된다"는 댓글이 달렸습니다.',c:'neutral',once:'grow',when:()=>fx_().big&&S.f.len>tankOf(S.f.tank).len*.3},
 {t:'{n}은 사람 그림자가 보이면 몸을 공처럼 부풀렸습니다.',c:'bad',when:()=>fishIs('puff')&&S.f.stress>.4,fx:()=>{S.f.puffT=2;S.health-=2}},
 {t:'아이가 수조 앞에 의자를 놓고 한참 {n}을 들여다봤습니다.',c:'good',when:()=>S.o.fam==='아이 있는 가족',m:'아이가 의자를 놓고 나를 오래 들여다봤다.',mw:1.3,fx:()=>{S.interest+=.1}},
 {t:'아이가 사료통을 통째로 수조에 쏟았습니다. 물이 금세 뿌옇게 흐려졌습니다.',c:'bad',when:()=>S.o.fam==='아이 있는 가족'&&S.r<.6,fx:()=>{S.f.wq-=18}},
 {t:'집 고양이가 수조 앞에 앉아 {n}을 몇 시간째 노려봅니다.',c:'bad',when:()=>S.f.cat&&S.f.tank!=='pond',fx:()=>{S.f.stress+=.03;S.scaredT=2}},
 {t:'왜가리 한 마리가 연못가에 서서 한참 물속을 내려다보다 날아갔습니다.',c:'bad',when:()=>S.f.tank==='pond',fx:()=>{S.scaredT=2}},
 {t:'봄이 오자 연못 물이 데워졌습니다. {n}이 수면 가까이 올라와 햇볕을 쬐었습니다.',c:'good',when:()=>S.f.tank==='pond'&&season()==='spring',m:'봄볕이 수면을 데웠다.'},
 {t:'{n}이 유리에 비친 자기 모습을 쫓아 한참 빙빙 돌았습니다.',c:'neutral',when:()=>fx_().aggro||['oscar','apisto','altum','channa','fig8'].includes(S.sp.id)},
 {t:'{n}이 유리벽을 따라 위아래로 쉬지 않고 오르내렸습니다. 수조가 답답할 때 물고기가 하는 일입니다.',c:'bad',when:()=>fLoad()>1||S.f.stress>.4,fx:()=>{S.f.stress+=.03}},
 {t:'수초 잎 위에서 {n}이 잠시 쉬었습니다.',c:'neutral',when:()=>S.f.hides&&S.f.len<8},
 {t:'주인이 "물멍"을 한다며 불 꺼진 방에서 한참 수조를 바라보았습니다.',c:'good',when:()=>S.interest>.6,m:'불 꺼진 방, 수조 불빛 앞의 얼굴.',fx:()=>{S.interest+=.04}},
 {t:'주인이 수조 유리를 손가락으로 톡톡 두드리며 "밥 줄까?"라고 말했습니다.',c:'neutral',when:()=>S.r<.6},
 {t:'친구들이 놀러 와 수조 앞에서 플래시를 터뜨리며 사진을 찍었습니다.',c:'bad',when:()=>S.r<.6,fx:()=>{S.f.stress+=.04;S.scaredT=2}},
];
FFL.forEach((f,i)=>{f.i=i;if(f.nm){const w=f.when;f.when=()=>!S.f.noMates&&(!w||w())}});
