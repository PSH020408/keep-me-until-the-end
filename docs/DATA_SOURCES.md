# Data sources

Status: 🟢 sourced · 🟡 estimate from reported cases · 🔴 to be sourced (P4)

| Shown in game | Value | Status | Source |
|---|---|---|---|
| Lost and abandoned animals rescued in 2024 | 106,824 | 🟢 | MAFRA 2024 동물보호·복지 실태조사, reported by Dailyvet (2025-06) — https://www.dailyvet.co.kr/news/policy/248072 |
| Share that died in shelters (natural death) | 27.5% | 🟢 | same |
| Share euthanised | 18.5% | 🟢 | same |
| Share adopted | about 1 in 4 | 🟢 | same |
| Dogs / cats among abandoned animals | 72.4% / 26.0% | 🟢 | same |
| Shelter notice period before ownership passes to the municipality | 10 days | 🟢 | 동물보호법 (public notice period) |
| Dog meat ban enacted 2024, penalties from 2027 | — | 🟢 | 개식용 종식 특별법 (2024) |
| Wildlife exhibition outside zoos banned from Dec 2023 (cafés given a grace period) | — | 🟢 | 야생생물 보호 및 관리에 관한 법률 개정 |
| Red-eared slider is a designated ecosystem-disturbing species | — | 🟢 | 환경부 생태계교란 생물 지정 |
| Grey parrot, slow loris, fennec fox, Indian star tortoise under CITES trade control | — | 🟢 | CITES appendices |
| Lifespans per species | see `species.js` | 🔴 | to be sourced per species (P4.1). The ten dog breeds added in v0.8 (Shih Tzu, Bichon Frise, Shiba Inu, Corgi, French Bulldog, Golden Retriever, Husky, Border Collie, Greyhound, German Shepherd) carry placeholder estimates too |
| Monthly hazard of every ending | see `endings.js` | 🟡 | estimates; tuned for variety |
| Winter survival / foraging / predator rates in the wild | see `species.js` `WILD` | 🟡 | estimates from species biology (temperate vs tropical) |
| Treatment costs in illness events | 8만 – 300만 원 | 🟡 | typical Korean clinic prices from public posts; to be checked |

## Ornamental fish (v0.9, 관상어 데이)

Every line in `F.f…` (the "실제로는" box for fish, `js/data/fish.js`) traces to a row here. Opened 2026-10-11.

| Shown in game | Value | Status | Source |
|---|---|---|---|
| Wild-caught ornamental fish lost before export (fact `fChain`, rewritten v0.9.22) | 40 of 50 boxes of cardinal tetras imported from South America to the US lost to mortality (Chapman et al. 1997); 30–70% of fish captured in the Brazilian Amazon die before reaching the final consumer (Waichman et al. 2001) | 🟡 | Both cited in Oliveira et al. (2008), *Tolerance to temperature, pH, ammonia and nitrite in cardinal tetra*, Acta Amazonica 38(4) — https://acta.inpa.gov.br/fasciculos/38-4/BODY/v38n4a23.html . The old wording ("2% to over 70%") was replaced because a range that wide says nothing. |
| Thai betta farms: bottles, culling of fish with damaged fins, export to 16 countries incl. Korea | — | 🟡 | PETA Asia investigation (2019), shown as PETA's claim — https://www.petaasia.com/?p=15323 |
| New tank cycling 4–6 weeks, "most common cause of death in new tanks" | — | 🟢 | PetMD — https://www.petmd.com/fish/conditions/systemic/new-tank-syndrome-fish |
| Goldfish up to 30 years in large tanks, weeks in small bowls; tank does not limit size | — | 🟢 | SPCA NZ — https://www.spca.nz/advice-and-welfare/article/debunking-goldfish-myths |
| Bettas survive cups only by air-breathing; need a heater; vase myth | — | 🟢 | SPCA NZ — https://spca.nz/advice-and-welfare/article/fish-deserve-betta-than-a-bowl ; PETA — https://www.peta.org/issues/companion-animal-issues/betta-fish/ |
| Ich: up to 1,024 offspring per parasite, often 1–3 weeks after shipping | — | 🟢 | UF/IFAS FA006 — https://ask.ifas.ufl.edu/publication/FA006 |
| Temperature drop of about 10 ℃ in 24 h weakens immunity (fungus) | — | 🟢 | SRAC 4700 — https://www.srac.msstate.edu/pdfs/Fact%20Sheets/4700%20Saprolegniasis-Winter%20Fungus-%20and%20Branchiomycosis%20of%20Commercially%20Cultured%20Channel%20Catfish.pdf |
| Fish TB incurable, depopulation advised, infects human skin | — | 🟢 | SRAC 4706 — https://www.srac.msstate.edu/pdfs/Fact%20Sheets/4706%20Myobacterial%20Infections%20of%20Fish.pdf |
| Tetrahymena killed 87–100% of guppies in experiments | — | 🟢 | comparative infection study — https://cris.iucc.ac.il/en/publications/comparative-study-of-infection-with-tetrahymena-of-different-orna-2/ ; inbreeding: Seriously Fish guppy page |
| Neon tetra disease untreatable | — | 🟢 | Seriously Fish — https://www.seriouslyfish.com/species/paracheirodon-innesi/ |
| KHV 80–100% mortality, survivors carry it, goldfish carry it | — | 🟢 | UF/IFAS VM113 — https://ask.ifas.ufl.edu/publication/VM113 |
| CyHV-2 over 90%; 230 of 700 goldfish in a Korean public aquarium (2014) | — | 🟢 | KoreaScience — https://koreascience.or.kr/article/JAKO202224561984984.pdf |
| Iridovirus up to 100% within about a week | — | 🟢 | UF/IFAS FA182 — https://ask.ifas.ufl.edu/publication/FA182 |
| Swim bladder disorder in short-bodied fancy goldfish | — | 🟢 | CVMA — https://www.canadianveterinarians.net/related-resources/swim-bladder-problems-in-goldfish/ |
| Clown loach 20+ years, 30 cm+, groups of 5–6, ~10 million larvae a year collected (estimate), rests on its side | — | 🟢 | Seriously Fish — https://www.seriouslyfish.com/species/chromobotia-macracanthus/ |
| Pleco 50 cm, oscar 35 cm, clown loach 30 cm+ | — | 🟢 | scotcat, Seriously Fish species pages |
| Maok reservoir piranhas (2015), Gulpo stream guppies (2026) | — | 🟢 | 경향 — https://sports.khan.co.kr/article/201507051434433 ; 경인일보 — https://www.kyeongin.com/article/1765041 |
| Flushing / freezing not humane; clove oil | — | 🟢 | RSPCA Australia — https://kb.rspca.org.au/knowledge-base/what-is-the-most-humane-way-to-euthanase-aquarium-fish/ |
| Ornamental fish covered by the Animal Protection Act (legal opinion); 5 of 15 goldfish died in the 2022 exhibit | — | 🟢 | 로톡 — https://www.lawtalk.co.kr/posts/44031 (article numbers changed in the 2023 revision; check law.go.kr before quoting) |
| UK man banned from keeping fish for 5 years after a live-goldfish swallowing video | — | 🟢 | Practical Fishkeeping — https://www.practicalfishkeeping.co.uk/fishkeeping-news/man-banned-from-keeping-fish-for-five-years/ |
| Power cuts: heat tropical fish before about 13 ℃ | — | 🟢 | NC State CVM — https://cvm.ncsu.edu/news/dealing-with-aquariums-and-ponds-during-power-outages/ |
| Chlorine fatal in tiny amounts; chloramine does not air off | — | 🟢 | UF/IFAS EDIS — https://journals.flvc.org/edis/article/download/118585/116516/173921 |
| Copper: narrow margin between dose and lethal dose; scaleless fish sensitive | — | 🟢 | UF/IFAS FA008 — https://ask.ifas.ufl.edu/publication/FA008 ; Fishkeeper (black ghost) |
| Crowding lowers immunity | — | 🟢 | RSPCA UK freshwater care — https://rspca.org.uk/documents/1494939/7712578/Freshwater+Fish+Care.pdf ; UF/IFAS FA119 |
| Puffer teeth grow for life; overgrowth starves; trimming needs sedation | — | 🟢 | Chewy — https://www.chewy.com/education/fish/saltwater-fish/pufferfish-teeth-care (contested for pea puffers, so only fig-8 uses it) |
| Motoro: imports arrive thin, "death curl", 20+ years, 50 cm disc | — | 🟢 | Seriously Fish — https://www.seriouslyfish.com/species/potamotrygon-motoro/ |
| Silver arowana collected by killing mouth-brooding males; Peru ~1 million in 2001; 80 cm, 2 m tank | — | 🟢 | Practical Fishkeeping — https://www.practicalfishkeeping.co.uk/fishkeeping-news/silver-arowana-under-threat/ ; Seriously Fish |
| Altum mostly wild, caught at night from canoes, changes hands 2–3 times, pH ~4 | — | 🟢 | Amazonas — https://www.amazonasmagazine.com/2015/12/14/altum-origins-shedding-light-on-the-supply-chain-of-wild-altum-angels/ |
| Pea puffer decline from collection, IUCN VU | — | 🟢 | Marine & Freshwater Research — https://connectsci.au/mf/article-abstract/75/5/MF23170/61135/Demographics-and-reproductive-characteristics-of ; FishBase |
| Bichir air-breathing, escapes, 30+ years recorded | — | 🟢 | Seriously Fish — https://www.seriouslyfish.com/species/polypterus-senegalus-senegalus/ |
| Alligator gar 2.6 m, up to 95 years reported, released fish found abroad | — | 🟢 | FishBase; US FWS ERSS — https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Alligator-gar.pdf |
| US banned all snakeheads in 2002 after the Crofton pond case | — | 🟢 | US FWS — https://fws.gov/policy/library/2002/02fr62193.html |
| Koi 30–40 years, ~950 L (250 gal) per fish, predators | — | 🟢 | cafishvet — https://cafishvet.com/wp-content/uploads/2021/04/how-to-not-kill-your-koi-pdf.pdf |
| Black ghost: electric sense, scaleless, 50 cm, stops feeding when bullied | — | 🟢 | Seriously Fish — https://www.seriouslyfish.com/species/apteronotus-albifrons/ ; Fishkeeper |
| Oranda wen overgrowth and surgery | — | 🟢 | cafishvet oranda page; Vet Nurse Online case |
| Fish sizes (`FX.cm`) | per species | 🟢 | Seriously Fish / FishBase pages listed in the research doc |
| Fish lifespans (`SP.life`) | per species | 🟡 | sourced where a page gives one (koi, clown loach, bichir, oscar, betta, motoro, gar); others are estimates and are shown only as "기대수명" — to be confirmed in P4.1 |
| Minimum tanks (`FX.minL`) | per species | 🟡 | from Seriously Fish / SPCA / cafishvet where given, else estimate |
| Wild/bred share (`FX.pW`), capture, transport, shop and disease rates | — | 🟡 | estimates from the sources' wording; mechanics only |
| Fair goldfish: of live-animal prize cases reported in Wales 2014–2018, 60% were goldfish at fairs; councils banning animal prizes on their land (fact `fFair`, v0.9.12) | 60% | 🟢 | Senedd Research brief P-05-933 (RSPCA figures) — https://business.senedd.wales/documents/s98084/Research%20Brief.html ; ITV, Redcar and Cleveland ban 2023 — https://itv.com/news/tyne-tees/2023-10-02/council-to-ban-use-of-goldfish-as-funfair-prizes |

| Piranhas (3) and a red pacu (1) found in Maok Reservoir, Hoengseong, 2015; reservoir drained; Ministry of Environment to designate both as 위해우려종 while unable to rule out establishment (fact `fApex`, v0.9.20) | 3 + 1, 2015 | 🟢 | 서울신문 2015-07-08 — https://m.go.seoul.co.kr/news/2015/07/08/20150708014026 |

### Balance anchors for fish (v0.9.12, mechanics only — never shown as fact)

Hard data on how long home aquarium fish live is scarce, so the simulation is tuned against the few anchors that exist and checked with `node tools/sim.mjs` (line "first owner: deaths per fish-year at home · died within 1st year").

| Owner type | Anchor | Target | v0.9.12 result |
|---|---|---|---|
| expert | A public aquarium's post-quarantine fish: goal under 10% a year, settled at 6–8% (Hemdal, 20 years of records) — reefs.com, https://reefs.com/magazine/aquarium-fish-mortality-rates-of-fishes-in-captivity/ . A skilled home keeper should sit at or slightly above that. | ~6–10%/yr | 9%/yr, 11% die in year 1 |
| gift (fair prizes, flower-vase bettas) | "90 per cent of them or more probably die within a very short time" — an unsourced estimate quoted in the Welsh Senedd committee (same brief as above); petition: they "usually only last a couple of months". 🟡 | ≥90% in year 1 | 95% in year 1 |
| casual | New-tank losses dominate; hobby forums repeat claims of most fish in a new, uncycled tank dying within weeks (unsourced). 🟡 | most die in year 1 | 82% in year 1 |
| learner / breeder / content | No anchor; set between the two. 🔴 | — | 37–45% in year 1 |
| before any owner | 30–70% of Amazon-caught fish die before the consumer (Waichman et al. 2001, fact `fChain`); bred fish lose fewer in transport but are culled at the farm. 🟡 | 20–30% | 28% |

The v0.9.11 easing (hazards ×0.72, disease 0.0058, ammonia spike 28) was reverted to the v0.9.10 values because it pushed experts well below the 6–8% professional benchmark.

Rules
- A number shown as fact in the "실제로는" box must be 🟢.
- Estimates are allowed in the mechanics, never stated as fact in the text.

### Breeding modes (v0.9.21, mechanics and story text — no number is shown as fact)

| Species | Mode used in the game | Source |
|---|---|---|
| Guppy, platy | Livebearers; broods every ~4 weeks, females store sperm | FishBase species summaries (*Poecilia reticulata*, *Xiphophorus maculatus*) |
| Motoro stingray | Gives birth to a few live pups | FishBase (*Potamotrygon motoro*) |
| Silver arowana | Paternal mouthbrooder | FishBase (*Osteoglossum bicirrhosum*); see also fArowana |
| *Betta macrostoma*, *Channa bleheri* | Paternal mouthbrooders | FishBase / Seriously Fish species profiles |
| Betta | Bubble nest, male guards | FishBase (*Betta splendens*) |
| Altum, oscar | Open substrate spawners, both parents guard | FishBase (*Pterophyllum altum*, *Astronotus ocellatus*) |
| Apistogramma, pleco | Cave / burrow spawners | FishBase (*Apistogramma* spp., *Pterygoplichthys* spp.) |
| Goldfish, koi, neon, pea puffer, bichir, gar | Egg scatterers, no care | FishBase species summaries |
| Corydoras | Female carries eggs between pelvic fins and sticks them to surfaces | FishBase / Seriously Fish (*Corydoras* spp.) |
| Clown loach, black ghost | Commercial production by hormone-induced spawning | Seriously Fish species profiles |

Owner learning (diligent / lazy / never) and the fish stats (근성 · 영리함 · 애교) are game mechanics, not data.

### Water temperature ranges (v0.9.22, meter only — the °C reading is game state, not a claim)

The 수온 bar compares the simulated temperature with a comfortable range per group: cold-water fish (goldfish, koi) 18–24 °C, cool (wild betta, rainbow snakehead) 22–26 °C, tropical 24–28 °C, warm (alligator gar) 22–30 °C. These are the usual husbandry ranges in FishBase / Seriously Fish species profiles, rounded.
