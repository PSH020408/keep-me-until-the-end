/* ---------- fish choices that depend on temperament and species ----------
   Each situation offers up to four options, drawn from a pool:
   - up to two that only a fish of this temperament would think of (t),
   - one that only this kind of fish would do (g: a group below, or a species id),
   - the rest from the options any fish has.
   Most options are gambles: `out` lists weighted outcomes, so the same choice can go well or badly.
   out item: [weight, result text, colour, effect, memory]   (weight may be a function)  */

const FGROUP={
  GOLD:()=>isGold()||S.sp.id==='koi',
  LAB:()=>['betta','wildbetta'].includes(S.sp.id),
  SMALL:()=>['neon','guppy','platy','cory'].includes(S.sp.id),
  CICH:()=>['altum','oscar','apisto'].includes(S.sp.id),
  BOT:()=>['pleco','cory','clownloach'].includes(S.sp.id),
  PRED:()=>!!fx_().pred,
  PUFF:()=>fishIs('puff'),
  NIGHT:()=>['ghost','bichir','pleco','motoro'].includes(S.sp.id),
  RAY:()=>S.sp.id==='motoro',
  AIR:()=>fishIs('air'),
  JUMP:()=>(fx_().jump||0)>=.3,
  SCHOOL:()=>fx_().social==='school'&&fSameCount()>=2,
};
const fGroup=g=>typeof g==='function'?g():FGROUP[g]?FGROUP[g]():S.sp.id===g;
const GTAG={GOLD:'금붕어의 습성',LAB:'베타의 습성',SMALL:'작은 물고기의 습성',CICH:'시클리드의 습성',BOT:'바닥고기의 습성',PRED:'육식어의 본능',PUFF:'복어의 습성',NIGHT:'밤 물고기의 습성',RAY:'가오리의 습성',AIR:'공기 호흡',JUMP:'뛰는 물고기',SCHOOL:'무리의 습성'};
const TTAG={shy:'겁쟁이 본능',curious:'호기심',glutton:'먹보 본능',friendly:'사람 좋아함',feisty:'까칠함'};
/* fish-specific temperament descriptions for the first choice */
const FTEMPER_D={
  shy:'수초 뒤에서 잘 나오지 않는다. 그림자만 지나가도 숨는다.',
  curious:'새 물건, 틈, 수면 위가 궁금하다. 가끔 뛰어오른다.',
  glutton:'먹이라면 제일 먼저 달려든다. 먹으면 안 되는 것도 삼킨다.',
  friendly:'사람 얼굴이 보이면 유리 앞으로 온다. 손가락을 따라 헤엄친다.',
  feisty:'영역을 지키고, 건드리면 들이받는다.',
};
/* effect helper: X({h:health, st:stress, i:owner interest, wq:water, fin:fin damage, fat:overfeeding}) */
const X=d=>()=>{const f=S.f;if(d.h)S.health+=d.h;if(d.st)f.stress+=d.st;if(d.i)S.interest+=d.i;if(d.wq)f.wq+=d.wq;if(d.fin)f.fin=Math.max(0,f.fin+d.fin);if(d.fat)f.fat=(f.fat||0)+d.fat;if(d.scared)S.scaredT=d.scared;if(d.happy)S.happyT=d.happy;if(d.puff)f.puffT=d.puff};
const both=(...a)=>()=>a.forEach(fn=>fn&&fn());
const sickIf=(p,ids)=>()=>{if(R()<p){const id=pick(ids.filter(d=>DZ[d]));if(id)fSick(id)}};
const endNow=(k,a)=>()=>{render();fEnd(k,a)};
const lidOpen=()=>!S.f.lid&&S.f.tank!=='pond';
const mateSmall=()=>S.f.mates.filter(m=>m.n>0&&m.id!==S.sp.id&&!m.feed&&m.cm<=S.f.len*Math.max(fbOf(S.sp.id).mouth,.05));
const eatMate=()=>{const v=mateSmall();if(v.length){const t=pick(v);t.n--;S.f.kills=(S.f.kills||0)+1;S.f.lastKill=t.id;S.f.mates=S.f.mates.filter(m=>m.n>0);addLog(T('{n}이 '+josa(mateName(t),'을')+' 한입에 삼켰습니다.'),'neutral');S.health+=3}};

const FSIT=[
 {id:'g-feed',p:'먹이 시간이다. 알갱이가 수면에 톡톡 떨어진다. 나는…',o:[
  {l:'제 몫만 먹는다',out:[[1,'{n}은 알갱이 몇 개를 먹고 멈췄습니다.','good',X({h:2})]]},
  {l:'수면까지 올라가 먼저 먹는다',out:[[3,'{n}이 제일 먼저 알갱이를 낚아챘습니다.','good',X({h:3})],[1,'서두르다 다른 물고기와 부딪쳤습니다. 지느러미 끝이 찢겼습니다.','bad',X({h:1,fin:.05})]]},
  {l:'남의 몫까지 빼앗아 먹는다',t:'glutton',d:'배가 터질지도',out:[[2,'{n}의 배가 동그랗게 부풀 때까지 먹었습니다.','neutral',X({h:4,fat:.2})],[1,'너무 많이 먹은 {n}이 한동안 옆으로 기울어 헤엄쳤습니다.','bad',both(X({fat:.3}),sickIf(.6,['swimb']))]]},
  {l:'바닥에 가라앉은 것까지 다 주워 먹는다',t:'glutton',out:[[2,'{n}이 바닥을 쓸고 다니며 남은 사료를 다 먹었습니다. 물이 조금 덜 썩었습니다.','good',X({h:3,wq:4})],[1,'썩은 사료 덩어리가 섞여 있었습니다. 다음 날 {n}의 배가 이상했습니다.','bad',sickIf(.7,['aero','dropsy'])]]},
  {l:'다들 먹고 난 뒤 부스러기를 노린다',t:'shy',out:[[()=>S.f.mates.length?1:3,'남은 부스러기로 {n}은 배를 채웠습니다.','neutral',X({h:1})],[()=>S.f.mates.length?3:0,'부스러기는 남지 않았습니다. {n}은 오늘도 배를 곯았습니다.','bad',X({h:-3})]]},
  {l:'수면 위 손가락까지 따라 올라간다',t:'friendly',out:[[3,'{n}이 주인 손가락 끝에서 알갱이를 받아먹었습니다. 주인이 웃었습니다.','good',X({h:2,i:.12}),'손가락 끝에서 밥을 받아먹었다.'],[1,'주인은 깜짝 놀라 손을 빼다 사료를 한꺼번에 쏟았습니다.','bad',X({wq:-8,fat:.1})]]},
  {l:'다가오는 물고기를 들이받고 먹는다',t:'feisty',need:()=>S.f.mates.some(m=>m.n>0),out:[[3,'{n}이 다른 물고기들을 밀어내고 배를 채웠습니다.','neutral',X({h:4})],[1,'밀려난 물고기가 되받아쳤습니다. {n}의 비늘이 몇 장 떨어졌습니다.','bad',X({h:-4})]]},
  {l:'사료 봉지가 흔들리는 수면 위를 올려다본다',t:'curious',out:[[1,'{n}이 수면에서 기다리자 주인이 한 꼬집을 더 넣어 주었습니다.','good',X({h:2,i:.05})],[1,()=>S.f.mates.some(m=>m.n>0)?'아무 일도 없었습니다. 그사이 사료는 다른 물고기들 차지였습니다.':'아무 일도 없었습니다. 그사이 사료는 바닥으로 가라앉아 불어 갔습니다.','neutral',X({h:-1})]]},
  {l:'자갈을 입에 넣었다 뱉으며 남은 걸 찾는다',g:'GOLD',out:[[3,'{n}이 자갈을 뒤집으며 숨은 알갱이를 찾아 먹었습니다. 물이 뿌옇게 일었습니다.','neutral',X({h:2,wq:-3})],[1,'작은 자갈 하나가 {n}의 입에 끼었습니다. 한참 뒤에야 뱉어냈습니다.','bad',X({h:-6,st:.05})]]},
  {l:'수면 위로 튀어 올라 낚아챈다',g:'LAB',out:[[4,'{n}이 수면을 박차고 올라 알갱이를 낚아챘습니다.','good',X({h:3})],[()=>lidOpen()?1:0,'너무 높이 뛰었습니다.','bad',endNow('jump')]]},
  {l:'사료는 두고 움직이는 것을 기다린다',g:'PRED',out:[[()=>mateSmall().length?3:0,'','neutral',eatMate],[2,'{n}은 마른 사료를 외면했습니다. 하루 더 배를 곯았습니다.','bad',X({h:-3})]]},
  {l:'불이 꺼질 때까지 기다렸다가 바닥에서 먹는다',g:'NIGHT',out:[[3,'밤이 되자 {n}이 바닥에 남은 먹이를 천천히 먹었습니다.','good',X({h:3,st:-.03})],[()=>S.f.mates.length?2:0,'밤까지 남은 먹이는 없었습니다.','bad',X({h:-3})]]},
  {l:'알갱이를 뱉고 달팽이를 찾아다닌다',g:'PUFF',out:[[()=>S.f.snails?3:0,'{n}이 달팽이 껍데기를 와작 깨 먹었습니다.','good',both(X({h:4}),()=>{S.f.beak=Math.max(0,(S.f.beak||0)-.3)})],[()=>S.f.snails?0:3,'달팽이는 없었습니다. {n}의 이빨은 또 조금 자랐습니다.','bad',()=>{S.f.beak=(S.f.beak||0)+.15}]]},
 ]},
 {id:'g-hand',p:'커다란 손이 물속으로 들어온다. 수조 청소 시간이다. 나는…',when:()=>S.f.tank!=='pond'&&S.interest>.3,o:[
  {l:'손을 피해 반대편으로 간다',out:[[1,'{n}은 손이 나갈 때까지 반대편에서 기다렸습니다.','neutral']]},
  {l:'수초 깊숙이 숨는다',t:'shy',out:[[2,'{n}은 수초 사이에서 꼼짝하지 않았습니다.','neutral',X({st:.03})],[1,'주인이 수초를 뽑아 헹구는 바람에 {n}은 숨을 곳을 잃고 허둥댔습니다.','bad',X({st:.1,scared:3})]]},
  {l:'사이펀 호스 입구를 들여다본다',t:'curious',need:()=>S.f.len<6,out:[[3,'{n}이 호스 입구 앞에서 빨려 드는 물살을 구경했습니다.','neutral'],[1,'물살이 {n}을 끌어당겼습니다.','bad',()=>{if(R()<.5){render();fEnd('siphon')}else addLog(T('호스에 빨려 들어간 {n}을 주인이 양동이에서 겨우 건져 냈습니다.'),'bad'),S.health-=12}]]},
  {l:'주인 손등에 몸을 비빈다',t:'friendly',out:[[3,'{n}이 손등에 몸을 비볐습니다. 주인은 한참 손을 빼지 않았습니다.','good',X({i:.15,happy:3}),'주인 손등에 몸을 비볐다. 따뜻했다.'],[1,'주인은 깜짝 놀라 손을 홱 뺐습니다. 물이 튀었습니다.','neutral',X({st:.03})]]},
  {l:'손가락을 문다',t:'feisty',out:[[2,'{n}이 손가락을 콱 물었습니다. 주인은 웃으며 "성깔 있네"라고 했습니다.','neutral',X({i:.05})],[1,'"아야!" 주인은 그 뒤로 청소를 한동안 미뤘습니다.','bad',X({i:-.12,wq:-5})]]},
  {l:'손가락을 먹이인 줄 알고 쫀다',t:'glutton',out:[[1,'{n}이 손가락을 쪼았지만 먹을 건 없었습니다.','neutral'],[1,'주인이 웃으며 손을 빼고 간식을 한 알 넣어 주었습니다.','good',X({h:2,i:.05})]]},
  {l:'몸을 공처럼 부풀린다',g:'PUFF',out:[[1,'{n}이 몸을 동그랗게 부풀렸습니다. 주인이 사진을 찍었습니다.','bad',X({h:-3,puff:2,i:.05})]]},
  {l:'꼬리 가시를 세운다',g:'RAY',out:[[3,'{n}이 꼬리를 치켜들자 주인이 손을 조심스럽게 뺐습니다.','neutral'],[1,'꼬리 가시가 주인 손목을 스쳤습니다. 주인은 응급실에 다녀온 뒤 {n}을 다른 사람에게 넘기기로 했습니다.','bad',()=>{q(null,null,()=>fRehome('"가오리는 무서워서 못 키우겠다." 주인은 {n}을 대형어 동호회에 분양 글로 올렸습니다.'))}]]},
  {l:'이빨을 드러내고 덤빈다',g:'PRED',need:()=>S.f.len>15,out:[[2,'{n}이 손을 향해 돌진했습니다. 주인이 놀라 뜰채를 놓쳤습니다.','neutral',X({st:.03})],[1,'"이거 위험한데." 주인은 그 뒤로 집게로만 청소를 했습니다.','neutral',X({i:-.05})]]},
 ]},
 {id:'g-object',p:'처음 보는 물건이 수조에 들어왔다. 장식물인지, 먹이인지 모르겠다. 나는…',log:'주인이 수조에 새 장식물을 하나 넣었습니다.',when:()=>S.f.tank!=='pond',o:[
  {l:'멀리서 지켜본다',out:[[1,'{n}은 한참 그 물건을 지켜보기만 했습니다.','neutral']]},
  {l:'안으로 들어가 본다',t:'curious',out:[[3,'{n}이 물건 속 구멍을 들락날락했습니다. 새 놀이터가 생겼습니다.','good',both(X({st:-.05}),()=>{S.f.hides=1}),'새 굴을 찾았다. 들락날락했다.'],[1,'좁은 구멍에 몸이 끼었습니다. 빠져나오며 지느러미가 찢겼습니다.','bad',X({fin:.15,h:-5})]]},
  {l:'그 뒤에 숨어 산다',t:'shy',out:[[1,'{n}은 그날부터 그 물건 뒤를 집으로 삼았습니다.','good',both(X({st:-.06}),()=>{S.f.hides=1})]]},
  {l:'입에 넣어 본다',t:'glutton',out:[[2,'먹을 수 없는 것이었습니다. {n}은 퉤 뱉었습니다.','neutral'],[1,'작은 조각이 떨어져 {n}이 삼켰습니다. 며칠 동안 배설을 못 했습니다.','bad',X({h:-10})]]},
  {l:'영역에 들어온 침입자로 보고 들이받는다',t:'feisty',out:[[2,'{n}이 물건을 몇 번 들이받더니 그 옆을 자기 자리로 삼았습니다.','neutral',X({st:-.03})],[1,'날카로운 모서리에 머리를 부딪쳤습니다.','bad',X({h:-6})]]},
  {l:'바닥 모래를 파서 물건 밑에 굴을 판다',g:'CICH',out:[[1,'{n}이 입으로 모래를 날라 물건 밑에 굴을 팠습니다.','good',both(X({st:-.05}),()=>{S.f.hides=1})]]},
  {l:'물건 표면의 이끼를 갉아 먹는다',g:'BOT',out:[[1,'{n}이 물건에 붙은 이끼를 깨끗이 갉아 먹었습니다.','good',X({h:2})]]},
 ]},
 {id:'g-night',p:'불이 꺼졌다. 방 안도 캄캄하다. 나는…',o:[
  {l:'바닥 가까이에서 쉰다',out:[[1,'{n}은 지느러미를 접고 잠들었습니다.','good',X({h:2,st:-.03})]]},
  {l:'캄캄한 수면 위를 탐험한다',t:'curious',out:[[3,'{n}은 수면 바로 밑을 천천히 돌아다녔습니다.','neutral'],[()=>lidOpen()?1:0,'어둠 속에서 {n}이 수면 위로 몸을 날렸습니다.','bad',endNow('jump')]]},
  {l:'수초 사이에 몸을 끼우고 잔다',t:'shy',out:[[1,'{n}은 수초 사이에 몸을 끼우고 아침까지 잤습니다.','good',X({st:-.05,h:1})]]},
  {l:'밤새 바닥을 뒤지며 먹을 걸 찾는다',t:'glutton',out:[[2,'{n}이 밤새 바닥을 훑어 남은 사료를 찾아 먹었습니다.','good',X({h:2,wq:3})],[1,'아무것도 찾지 못한 채 밤을 새웠습니다.','neutral',X({h:-1})]]},
  {l:'유리 앞에서 주인이 다시 오길 기다린다',t:'friendly',out:[[1,'{n}은 밤새 유리 앞에 떠 있었습니다. 아침에 주인이 그 모습을 봤습니다.','good',X({i:.08}),'밤새 유리 앞에서 주인을 기다렸다.']]},
  {l:'영역을 순찰하며 다른 물고기를 쫓는다',t:'feisty',need:()=>S.f.mates.some(m=>m.n>0),out:[[2,'{n}이 밤새 영역 경계를 순찰했습니다.','neutral',X({st:-.02})],[1,'밤새 싸운 탓에 아침이 되자 {n}도 지쳐 있었습니다.','bad',X({h:-4})]]},
  {l:'이제부터가 내 시간이다',g:'NIGHT',out:[[1,'어둠이 내리자 {n}이 은신처에서 나와 수조 끝까지 헤엄쳤습니다.','good',X({h:3,st:-.05}),'캄캄해지자 비로소 내 세상이었다.']]},
  {l:'수면에 입을 대고 공기를 마시며 쉰다',g:'AIR',out:[[1,'{n}은 수면에 입을 대고 숨을 고르며 쉬었습니다.','good',X({h:2})]]},
 ]},
 {id:'g-glass',p:'유리벽이 쿵쿵 울린다. 커다란 눈이 바로 앞에 붙어 있다. 나는…',when:()=>S.f.tank!=='pond',o:[
  {l:'반대편 구석으로 간다',out:[[1,'누군가 유리를 쿵쿵 두드리자 {n}은 반대편 구석으로 피했습니다.','neutral',X({st:.02})]]},
  {l:'바닥에 납작 엎드린다',t:'shy',out:[[1,'유리벽이 쿵쿵 울렸습니다. {n}은 바닥에 납작 엎드려 유리 앞의 커다란 눈이 사라질 때까지 기다렸습니다.','bad',X({st:.06,scared:2})]]},
  {l:'손가락을 따라 헤엄친다',t:'friendly',out:[[3,'{n}이 유리 너머 손가락을 따라 이리저리 헤엄쳤습니다. 손가락의 주인이 소리 내어 웃었습니다.','good',X({i:.12,happy:2}),'유리 너머 손가락을 따라 헤엄쳤다.'],[1,'{n}이 손가락을 따라오자 신이 난 사람이 유리를 더 세게 두드렸습니다.','bad',X({st:.06})]]},
  {l:'유리를 향해 돌진한다',t:'feisty',out:[[2,'{n}이 유리에 붙은 얼굴을 향해 돌진하자 얼굴이 화들짝 물러났습니다.','neutral',X({st:-.02})],[1,'{n}은 유리 앞의 얼굴을 향해 돌진하다 유리에 머리를 세게 부딪쳤습니다.','bad',X({h:-5})]]},
  {l:'그 눈을 가까이서 들여다본다',t:'curious',out:[[1,'{n}은 유리에 바짝 붙은 커다란 눈과 한참 서로를 들여다보았습니다.','neutral',X({i:.05}),'커다란 눈과 한참 마주 보았다.']]},
  {l:'지느러미와 아가미를 활짝 편다',g:'LAB',out:[[1,'{n}이 아가미 뚜껑까지 활짝 펴고 위협했습니다. "와, 화났다!" 유리 밖의 사람은 더 신이 났습니다.','neutral',X({st:.04,i:.05})]]},
  {l:'몸을 부풀린다',g:'PUFF',out:[[1,'유리 앞의 얼굴에 놀란 {n}이 몸을 동그랗게 부풀렸습니다. 유리 밖에서 손뼉 소리가 났습니다.','bad',X({h:-3,puff:2})]]},
 ]},
 {id:'g-newcomer',p:'봉지에 담긴 낯선 물고기들이 쏟아져 들어왔다. 낯선 냄새가 난다. 나는…',when:()=>S.f.newcomer,o:[
  {l:'모르는 척 내 할 일을 한다',out:[[1,'{n}은 새 물고기들을 신경 쓰지 않았습니다.','neutral',()=>{S.f.newcomer=0}]]},
  {l:'며칠 동안 숨어 지낸다',t:'shy',out:[[1,'{n}은 며칠 동안 은신처에서 나오지 않았습니다.','neutral',both(X({st:.05,h:-2}),()=>{S.f.newcomer=0})]]},
  {l:'새 물고기에게 다가가 냄새를 맡는다',t:['curious','friendly'],out:[[2,'{n}은 금세 새 물고기들과 섞여 헤엄쳤습니다.','good',both(X({st:-.03}),()=>{S.f.newcomer=0})],[()=>S.f.carrier?3:1,'새 물고기 몸에 하얀 점이 있었습니다. 며칠 뒤 {n}의 몸에도 같은 점이 돋았습니다.','bad',()=>{S.f.newcomer=0;fSick(S.f.carrier&&DZ[S.f.carrier]?S.f.carrier:'ich')}]]},
  {l:'내 영역에서 내쫓는다',t:'feisty',out:[[2,'{n}이 새 물고기들을 영역 밖으로 몰아냈습니다.','neutral',()=>{S.f.newcomer=0}],[1,'새 물고기 중 하나가 {n}보다 컸습니다. {n}은 꼬리를 물렸습니다.','bad',both(X({fin:.15,h:-5}),()=>{S.f.newcomer=0})]]},
  {l:'제일 작은 녀석을 노린다',g:'PRED',need:()=>mateSmall().length>0,out:[[1,'','neutral',both(eatMate,()=>{S.f.newcomer=0})]]},
 ]},
 {id:'g-badwater',p:'물에서 쓴맛이 난다. 아가미가 따끔거린다. 나는…',when:()=>S.f.wq<50,o:[
  {l:'바닥에서 꼼짝 않고 버틴다',out:[[1,'{n}은 바닥에서 아가미만 빠르게 움직이며 버텼습니다.','bad',X({h:-4})]]},
  {l:'수면에서 입을 뻐끔거린다',d:'누가 봐 주길',out:[[()=>S.interest+.1,'주인이 수면에서 뻐끔거리는 {n}을 보고 물을 갈아 주었습니다.','good',X({wq:22,i:.05})],[()=>1.2-S.interest,'아무도 보지 못했습니다.','bad',X({h:-3})]]},
  {l:'주인이 볼 때까지 유리 앞에서 기다린다',t:'friendly',out:[[2,'유리 앞에서 기운 없이 떠 있는 {n}을 주인이 알아챘습니다. 그날 물을 절반 갈았습니다.','good',X({wq:28,i:.08})],[1,'주인은 "오늘따라 얌전하네" 하고 지나갔습니다.','bad',X({h:-3})]]},
  {l:'수면을 첨벙첨벙 친다',t:'feisty',out:[[1,'물이 튀는 소리에 주인이 다가왔습니다. 그러고는 물을 갈았습니다.','good',X({wq:20})],[1,'주인은 "얘 왜 이래" 하고 수조 뚜껑을 덮어 버렸습니다.','bad',X({h:-3,st:.05})]]},
  {l:'수면 위로 뛰어올라 탈출한다',t:'curious',need:lidOpen,out:[[2,'{n}이 수면을 박차고 올랐다가 다시 떨어졌습니다.','bad',X({h:-4})],[1,'{n}은 수조 밖으로 떨어졌습니다.','bad',endNow('jump')]]},
  {l:'수면 공기로 숨을 쉰다',g:'AIR',out:[[1,'{n}은 수면에 입을 대고 공기를 들이켰습니다. 물이 나빠도 숨은 쉴 수 있었습니다.','good',X({h:1})]]},
 ]},
 {id:'g-cold',p:'물이 차갑다. 몸이 자꾸 굳는다. 나는…',when:()=>season()==='winter'&&fx_().temp==='trop'&&!S.f.heater&&S.f.tank!=='pond',o:[
  {l:'바닥에 붙어 힘을 아낀다',out:[[1,'{n}은 바닥에 붙어 거의 움직이지 않았습니다.','neutral',X({h:-3})]]},
  {l:'조명 바로 밑으로 올라가 몸을 데운다',t:'curious',out:[[2,'조명 밑 수면이 조금 따뜻했습니다. {n}은 그곳에서 겨울을 났습니다.','good',X({h:1})],[1,'조명이 꺼진 밤에는 소용이 없었습니다.','bad',X({h:-5})]]},
  {l:'먹을 수 있을 때 잔뜩 먹어 둔다',t:'glutton',out:[[1,'{n}은 먹이를 가리지 않고 먹었습니다. 차가운 물에서 소화가 되지 않았습니다.','bad',both(X({fat:.2}),sickIf(.3,['swimb','aero']))],[1,'든든히 먹은 {n}은 추위를 조금 더 버텼습니다.','good',X({h:2})]]},
  {l:'유리 앞에 붙어 주인을 본다',t:'friendly',out:[[1,'주인이 유리를 만져 보고 "물이 왜 이렇게 차" 하더니 히터를 주문했습니다.','good',()=>{S.f.heater=1}],[2,'주인은 알아채지 못했습니다.','bad',X({h:-4})]]},
 ]},
 {id:'g-heat',p:'물이 미지근하다. 숨이 차다. 나는…',when:()=>season()==='summer'&&S.f.tank!=='pond'&&!S.f.fan,o:[
  {l:'수면에서 숨을 쉰다',out:[[1,'{n}은 수면에 입을 대고 뻐끔거렸습니다.','neutral',X({h:-2})]]},
  {l:'바닥 그늘에서 꼼짝 않는다',t:'shy',out:[[1,'{n}은 바닥 그늘에서 숨을 아꼈습니다.','neutral',X({h:-1})]]},
  {l:'여과기 물살 바로 앞에 붙는다',t:['curious','feisty'],need:()=>S.f.filter!=='없음',out:[[1,'여과기 물살에는 산소가 조금 더 있었습니다.','good',X({h:1})],[()=>filtOf(S.f.filter).intake&&S.f.len<4?1:0,'물살이 {n}을 흡입구로 끌어당겼습니다.','bad',endNow('intake')]]},
  {l:'유리 앞에서 헐떡이는 모습을 보인다',t:'friendly',out:[[1,'주인이 "더운가 보다" 하며 냉각팬을 사 왔습니다.','good',()=>{S.f.fan=1}],[1,'주인은 에어컨을 켜고 외출했습니다. 그래도 조금 나았습니다.','neutral']]},
 ]},
 {id:'g-lonely',p:'주인 얼굴을 본 지 오래다. 수조 불빛도 며칠째 꺼져 있다. 나는…',when:()=>S.interest<.4&&S.f.tank!=='pond',o:[
  {l:'그냥 기다린다',out:[[1,'{n}은 기다렸습니다.','neutral',X({st:.03})]]},
  {l:'하루 종일 유리 앞에 떠 있는다',t:'friendly',out:[[2,'지나가던 주인이 유리 앞의 {n}과 눈이 마주쳤습니다. 그날 오랜만에 물을 갈았습니다.','good',X({i:.18,wq:15}),'주인이 다시 나를 봤다.'],[1,'아무도 지나가지 않았습니다.','bad',X({st:.05})]]},
  {l:'수면을 첨벙거려 소리를 낸다',t:'feisty',out:[[1,'물소리에 주인이 다가왔습니다. "아, 밥!"','good',X({i:.15,h:2})],[1,'물이 바닥으로 튀었습니다. 주인은 짜증을 내며 수조를 창고 방으로 옮겼습니다.','bad',X({i:-.1,st:.08})]]},
  {l:'유리에 낀 이끼를 뜯어 먹으며 버틴다',t:['glutton','curious'],out:[[1,'{n}은 유리에 낀 이끼를 뜯어 먹으며 버텼습니다.','neutral',X({h:1})]]},
  {l:'더 깊이 숨는다',t:'shy',out:[[1,'{n}은 더 깊이 숨었습니다. 이제 주인이 와도 {n}을 찾지 못할 것입니다.','bad',X({i:-.05,st:.04})]]},
 ]},
 {id:'g-itch',p:'몸이 가렵고 무겁다. 뭔가 잘못됐다. 나는…',when:()=>S.f.ill&&!S.f.ill.noticed,o:[
  {l:'바닥에서 쉰다',out:[[1,'{n}은 바닥에서 지느러미를 접고 쉬었습니다. 아무도 몰랐습니다.','neutral']]},
  {l:'돌에 몸을 문지른다',d:'눈에 띌지도',out:[[2,'{n}이 돌에 몸을 비비는 걸 주인이 봤습니다. "얘 왜 이래?"','good',()=>{S.f.seen=(S.f.seen||0)+.6}],[1,'돌에 쓸린 자리에 상처가 났습니다.','bad',X({h:-5})]]},
  {l:'일부러 유리 앞에서 헤엄친다',t:'friendly',out:[[3,'주인이 유리 앞의 {n}을 오래 들여다보다 몸의 이상을 알아챘습니다.','good',()=>{S.f.seen=(S.f.seen||0)+1}],[1,'주인은 "오늘 기분 좋네" 하고 지나갔습니다.','neutral']]},
  {l:'은신처에 숨는다',t:'shy',out:[[1,'{n}은 숨었습니다. 병은 아무도 모르게 깊어졌습니다.','bad',()=>{S.f.ill.sev+=.1}]]},
  {l:'그래도 먹는다',t:'glutton',out:[[2,'{n}은 아파도 먹었습니다. 몸이 조금 버텼습니다.','good',X({h:4})],[1,'먹은 것이 그대로 떠올랐습니다.','bad',X({wq:-4})]]},
 ]},
 {id:'g-bully',p:'덩치 큰 녀석이 또 쫓아온다. 지느러미가 따끔하다. 나는…',when:()=>!!fBully()||fMatePressure()>.3,o:[
  {l:'구석으로 달아난다',out:[[1,'{n}은 구석으로 달아났습니다.','neutral',X({st:.04})]]},
  {l:'수초 속에 숨는다',t:'shy',out:[[()=>S.f.hides?3:1,'{n}은 수초 속에서 녀석이 지나가길 기다렸습니다.','good',X({st:-.02})],[()=>S.f.hides?0:2,'숨을 곳이 없었습니다.','bad',X({fin:.1,st:.06})]]},
  {l:'맞서 싸운다',t:'feisty',out:[[()=>S.f.len,'{n}이 맞서자 녀석이 물러났습니다.','good',X({st:-.05})],[()=>{const b=fBully();return b?b.cm:5},'{n}은 크게 물렸습니다.','bad',X({h:-8,fin:.15})]]},
  {l:'같은 무리 속에 섞인다',g:'SCHOOL',out:[[1,'{n}은 무리 한가운데로 파고들었습니다. 녀석은 누구를 쫓아야 할지 몰랐습니다.','good',X({st:-.03})]]},
  {l:'주인 쪽 유리 앞으로 도망친다',t:'friendly',out:[[1,'주인이 쫓기는 {n}을 보고 칸막이를 꽂아 주었습니다.','good',X({st:-.08,i:.05})],[1,'주인은 "사이좋게 노네"라고 했습니다.','bad',X({fin:.08})]]},
 ]},
 {id:'g-photo',p:'휴대폰 불빛이 번쩍인다. 주인이 사진을 찍는다. 나는…',when:()=>S.interest>.35&&S.f.tank!=='pond',o:[
  {l:'평소처럼 헤엄친다',out:[[1,'사진에는 {n}의 꼬리만 흐릿하게 찍혔습니다.','neutral']]},
  {l:'렌즈 앞에서 멈춘다',t:'friendly',out:[[1,'{n}이 렌즈 앞에서 지느러미를 폈습니다. 그 사진은 주인의 배경 화면이 되었습니다.','good',X({i:.12}),'불빛 앞에서 지느러미를 폈다. 주인이 좋아했다.']]},
  {l:'불빛을 피해 숨는다',t:'shy',out:[[2,'{n}은 숨었습니다. 주인은 포기했습니다.','neutral'],[1,'주인이 뜰채로 {n}을 꺼내 들고 사진을 찍었습니다.','bad',X({h:-6,st:.08})]]},
  {l:'렌즈에 비친 내 모습에 덤빈다',t:'feisty',out:[[1,'{n}이 렌즈에 비친 자신에게 덤비는 영상이 SNS에 올라갔습니다.','neutral',X({st:.03,i:.05})]]},
  {l:'카메라를 먹이인 줄 알고 쫀다',t:'glutton',out:[[1,'{n}이 유리 너머 카메라를 쪼는 영상이 찍혔습니다. "밥 달래요ㅋㅋ"','neutral',X({i:.06})]]},
 ]},
 {id:'g-cat',p:'수조 위 선반에 털 달린 그림자가 앉았다. 초록 눈이 나를 본다. 나는…',when:()=>S.f.cat&&S.f.tank!=='pond',o:[
  {l:'바닥으로 내려간다',out:[[1,'{n}은 바닥으로 내려가 움직이지 않았습니다.','neutral',X({st:.03})]]},
  {l:'수초 깊숙이 숨는다',t:'shy',out:[[1,'그림자는 한참 뒤 사라졌습니다.','good']]},
  {l:'수면으로 올라가 가까이 본다',t:'curious',out:[[()=>lidOpen()?1:0,'','bad',endNow('cat')],[2,'뚜껑 너머에서 앞발이 몇 번 유리를 긁고 사라졌습니다.','neutral',X({st:.04})]]},
  {l:'지느러미를 펴고 위협한다',t:'feisty',out:[[1,'{n}이 지느러미를 펴자 그림자가 고개를 갸웃했습니다.','neutral'],[()=>lidOpen()?1:0,'그림자의 앞발이 물속으로 들어왔습니다.','bad',endNow('cat')]]},
 ]},
 {id:'g-gorge',p:'주인이 "여행 가는 동안 먹으라"며 먹이 블록을 넣고 나갔다. 나는…',when:()=>S.interest<.6&&S.r<.6&&!S.cd.gorge,o:[
  {l:'조금씩 아껴 먹는다',out:[[1,'{n}은 먹이 블록을 조금씩 뜯어 먹었습니다.','good',both(X({wq:-6}),()=>{S.cd.gorge=1})]]},
  {l:'첫날 다 먹어 치운다',t:'glutton',out:[[1,'{n}은 첫날 블록을 거의 다 먹었습니다. 남은 며칠은 길었습니다.','bad',both(X({h:-6,fat:.25,wq:-10}),()=>{S.cd.gorge=1})]]},
  {l:'남들이 먹는 걸 지켜본다',t:'shy',out:[[1,'{n}이 다가갔을 땐 블록이 없었습니다.','bad',both(X({h:-6}),()=>{S.cd.gorge=1})]]},
  {l:'블록을 지키며 다른 물고기를 쫓는다',t:'feisty',need:()=>S.f.mates.some(m=>m.n>0),out:[[1,'{n}이 블록을 독차지했습니다.','neutral',both(X({h:2,wq:-6}),()=>{S.cd.gorge=1})]]},
 ]},
 {id:'g-old',p:'몸이 예전 같지 않다. 지느러미가 무겁다. 나는…',when:()=>S.ageM>S.sp.life*.7,o:[
  {l:'천천히, 아끼며 헤엄친다',out:[[1,'{n}은 바닥 가까이에서 천천히 헤엄쳤습니다.','good',X({h:2})]]},
  {l:'젊을 때처럼 수조 끝까지 헤엄친다',t:['curious','feisty'],out:[[1,'{n}이 수조 끝에서 끝까지 헤엄쳤습니다. 한참 숨을 몰아쉬었습니다.','neutral',X({h:-3}),'끝에서 끝까지 헤엄쳤다. 아직 할 수 있었다.']]},
  {l:'주인 손이 닿는 곳에서 지낸다',t:'friendly',out:[[1,'주인은 늙은 {n}에게 매일 아침 인사를 했습니다.','good',X({i:.1}),'매일 아침 인사를 받았다.']]},
  {l:'은신처에서 거의 나오지 않는다',t:'shy',out:[[1,'{n}은 은신처 안에서 하루 대부분을 보냈습니다.','neutral',X({st:-.04})]]},
 ]},
 {id:'g-algae',p:'유리와 돌에 초록 이끼가 잔뜩 끼었다. 나는…',when:()=>S.f.algae,o:[
  {l:'신경 쓰지 않는다',out:[[1,'이끼는 점점 두꺼워졌습니다.','neutral']]},
  {l:'이끼를 갉아 먹는다',g:'BOT',out:[[1,'{n}이 하룻밤 사이 유리 한 면을 깨끗하게 만들었습니다.','good',both(X({h:2}),()=>{S.f.algae=0})]]},
  {l:'이끼를 뜯어 먹는다',g:'GOLD',out:[[1,'{n}이 돌에 붙은 이끼를 뜯어 먹었습니다.','good',X({h:1})]]},
  {l:'이끼 속을 헤집고 다닌다',t:['curious','glutton'],out:[[2,'이끼 속에서 작은 벌레를 찾아 먹었습니다.','good',X({h:2})],[1,'헤집은 이끼 가루가 물을 흐렸습니다.','bad',X({wq:-4})]]},
 ]},
 {id:'g-mate',p:'나와 같은 종이 곁에 있다. 몸 색이 진해진다. 나는…',when:()=>fSameCount()>=1&&S.ageM>S.sp.life*.12&&!fem()&&['betta','wildbetta','apisto','altum','oscar','guppy','platy','oranda','ryukin','comet','koi','cory'].includes(S.sp.id),o:[
  {l:'그냥 함께 헤엄친다',out:[[1,'{n}은 같은 종 곁에서 헤엄쳤습니다.','good',X({st:-.03})]]},
  {l:'수면에 거품 둥지를 짓는다',g:'LAB',out:[[1,'{n}이 하루 종일 거품을 불어 둥지를 지었습니다.','good',X({st:-.04}),'거품 둥지를 지었다.']]},
  {l:'평평한 돌을 깨끗이 닦는다',g:'CICH',out:[[1,'{n}이 입으로 돌을 닦아 알 낳을 자리를 만들었습니다.','good',X({st:-.04})]]},
  {l:'상대를 따라다니며 구애한다',t:['friendly','curious'],out:[[2,'며칠 뒤 수초 사이에 알이 붙었습니다.','good',()=>{S.f.spawns=(S.f.spawns||0)+1}],[1,'상대는 관심이 없었습니다.','neutral']]},
  {l:'경쟁자를 몰아낸다',t:'feisty',out:[[1,'{n}이 다른 수컷을 몰아냈습니다.','neutral',X({st:.03})],[1,'싸움 끝에 {n}의 지느러미가 찢겼습니다.','bad',X({fin:.15})]]},
  {l:'알을 먹는다',t:'glutton',need:()=>S.f.spawns>0,out:[[1,'{n}이 수초에 붙은 알을 먹어 치웠습니다.','neutral',X({h:2})]]},
 ]},
 {id:'g-rain',p:'빗방울이 연못 수면을 두드린다. 물 냄새가 바뀌었다. 나는…',when:()=>S.f.tank==='pond',o:[
  {l:'깊은 곳에서 기다린다',out:[[1,'{n}은 연못 바닥에서 비가 그치길 기다렸습니다.','neutral']]},
  {l:'수면으로 올라가 빗방울을 쫀다',t:['curious','glutton'],out:[[2,'빗물에 떨어진 벌레를 몇 마리 먹었습니다.','good',X({h:2}),'빗방울이 수면을 두드렸다.'],[()=>S.f.net?0:1,'수면 가까이 올라온 {n}을 왜가리가 보았습니다.','bad',endNow('pond')]]},
  {l:'넘친 물길을 따라 가 본다',t:'curious',need:()=>!S.f.net,out:[[3,'물길은 금세 말랐습니다. {n}은 서둘러 연못으로 돌아왔습니다.','neutral',X({st:.04})],[1,'{n}은 넘친 물길을 따라 연못 밖 도랑으로 흘러갔습니다.','bad',()=>{S.f.released=1;q(T('{n}은 도랑을 따라 하천까지 흘러갔습니다.'),'bad');q(null,null,()=>goWild('river'))}]]},
 ]},
];

/* ---------- choices on the way (before any owner): several prompts, pools by temperament and species ---------- */
const fo=(k,v)=>()=>{S.f.odds[k]=v};
const PSIT={
 net:{who:'그물 앞에서',p:['그물이 물을 가르며 다가온다. 형제들이 한쪽으로 몰린다. 나는…','물이 흙탕물로 변했다. 사람 다리가 강바닥을 휘젓는다. 나는…','손전등 불빛이 물속을 비춘다. 밤인데도 사람들이 있다. 나는…'],o:[
  {l:'진흙 속으로 파고든다',d:'운이 좋으면',out:[[1,'{n}은 바닥 진흙 속으로 몸을 밀어 넣었습니다.','neutral',()=>{S.f.escape=R()<.22}]]},
  {l:'형제들 틈에 섞인다',out:[[1,'{n}은 무리 한가운데로 파고들었습니다.','neutral',fo('capture',.6)]]},
  {l:'그물 반대쪽으로 내달린다',d:'빠르지만 위험하게',out:[[1,'{n}은 그물 반대쪽으로 내달렸습니다.','neutral',()=>{S.f.escape=R()<.12;S.f.odds.capture=1.6}]]},
  {l:'바위 틈 깊숙이 몸을 넣는다',t:'shy',out:[[1,'{n}은 바위 틈에 몸을 끼우고 숨을 죽였습니다.','neutral',()=>{S.f.escape=R()<.3;S.f.odds.capture=.8}]]},
  {l:'불빛 쪽으로 가 본다',t:'curious',d:'궁금하다',out:[[1,'{n}은 불빛 쪽으로 다가갔습니다.','bad',fo('capture',2)]]},
  {l:'휘저어진 진흙 속 벌레를 먹는다',t:'glutton',out:[[1,'{n}은 흙탕물 속에서 떠오른 벌레를 정신없이 먹었습니다.','bad',fo('capture',1.8)]]},
  {l:'그물을 들이받는다',t:'feisty',out:[[1,'{n}이 그물 코를 들이받았습니다.','neutral',()=>{S.f.escape=R()<.16;S.f.odds.capture=1.3;S.health-=5}]]},
  {l:'형제 곁에 꼭 붙어 있는다',t:'friendly',out:[[1,'{n}은 형제 곁에 꼭 붙어 있었습니다.','neutral',fo('capture',.8)]]},
  {l:'낮에는 굴 깊숙이 들어가 나오지 않는다',g:'NIGHT',out:[[1,'{n}은 굴 깊숙이 들어가 해가 질 때까지 나오지 않았습니다.','neutral',()=>{S.f.escape=R()<.35}]]},
  {l:'진흙에 몸을 묻고 공기를 아낀다',g:'AIR',out:[[1,'{n}은 진흙에 몸을 묻었습니다. 공기 한 모금이면 한참 버틸 수 있었습니다.','neutral',()=>{S.f.escape=R()<.28}]]},
  {l:'몸을 부풀려 그물 코에 걸리지 않게 한다',g:'PUFF',out:[[1,'{n}이 몸을 부풀리자 그물 코에 걸렸습니다. 오히려 빼낼 수가 없었습니다.','bad',fo('capture',1.4)]]},
 ]},
 box:{who:'상자 속에서',p:['봉지 속 물이 미지근해지고 숨이 차다. 상자는 계속 흔들린다. 나는…','상자 안이 캄캄하다. 옆 봉지에서 무언가가 움직이지 않는다. 나는…','엔진 소리가 멎었다. 상자가 몇 시간째 움직이지 않는다. 나는…'],o:[
  {l:'움직이지 않고 숨을 아낀다',out:[[1,'{n}은 봉지 바닥에 가만히 몸을 붙였습니다.','neutral',fo('transport',.55)]]},
  {l:'봉지 벽을 밀며 빠져나가려 한다',out:[[1,'{n}은 봉지 벽에 몇 번이고 몸을 부딪쳤습니다.','bad',both(fo('transport',1.7),X({h:-5}))]]},
  {l:'봉지 구석에 몸을 웅크린다',t:'shy',out:[[1,'{n}은 봉지 구석에 웅크려 흔들림을 버텼습니다.','neutral',fo('transport',.6)]]},
  {l:'봉지 벽 너머를 살핀다',t:'curious',out:[[1,'{n}은 비닐 너머 어둠을 오래 들여다보았습니다.','neutral',fo('transport',1)]]},
  {l:'떠다니는 찌꺼기를 먹는다',t:'glutton',out:[[1,'{n}은 봉지에 떠다니는 찌꺼기를 먹었습니다. 물이 더 탁해졌습니다.','bad',both(fo('transport',1.3),()=>{if(R()<.3)S.f.carrier='aero'})]]},
  {l:'봉지 벽을 들이받는다',t:'feisty',out:[[1,'{n}이 봉지 벽을 들이받았습니다. 비닐이 늘어났습니다.','bad',fo('transport',1.8)]]},
  {l:'함께 담긴 형제 곁에 붙는다',t:'friendly',out:[[1,'{n}은 형제의 몸에 기대어 흔들림을 버텼습니다.','neutral',fo('transport',.7)]]},
  {l:'봉지 위 공기층에서 숨을 쉰다',g:'AIR',out:[[1,'{n}은 봉지 위 공기층에 입을 대고 숨을 쉬었습니다.','good',fo('transport',.4)]]},
  {l:'몸을 부풀린다',g:'PUFF',out:[[1,'좁은 봉지 안에서 {n}이 몸을 부풀렸습니다. 공기를 삼켰고, 다시 빠지지 않았습니다.','bad',fo('transport',2.4)]]},
 ]},
 sieve:{who:'선별대 위에서',p:['커다란 체가 물을 떠 올린다. 불빛이 몸을 비춘다. 나는…','작업자의 손가락이 형제들을 하나씩 밀어낸다. 내 차례다. 나는…','"이건 버리고, 이건 남기고." 목소리가 가까워진다. 나는…'],o:[
  {l:'지느러미를 활짝 편다',d:'보기 좋게',out:[[1,'{n}은 지느러미를 끝까지 펼쳤습니다.','good',fo('cull',.55)]]},
  {l:'체 바닥에 몸을 숨긴다',out:[[1,'{n}은 다른 치어들 밑으로 파고들었습니다.','neutral',fo('cull',.9)]]},
  {l:'체 밖으로 튀어 오른다',d:'어디로 떨어질지는 모른다',out:[[1,'{n}은 체 밖으로 몸을 튕겼습니다.','bad',()=>{S.f.odds.cull=R()<.5?.2:2.2}]]},
  {l:'체 바닥에 납작 엎드린다',t:'shy',out:[[1,'{n}은 체 바닥에 납작 엎드렸습니다. 작업자는 {n}을 "약한 놈"으로 봤습니다.','bad',fo('cull',1.3)]]},
  {l:'불빛 쪽으로 몸을 튼다',t:'curious',out:[[1,'{n}이 불빛 쪽으로 몸을 틀자 무늬가 환하게 드러났습니다.','good',fo('cull',.7)]]},
  {l:'체에 걸린 찌꺼기를 먹는다',t:'glutton',out:[[1,'{n}은 체에 걸린 찌꺼기를 먹느라 바빴습니다. 통통한 배가 눈에 띄었습니다.','neutral',fo('cull',.8)]]},
  {l:'옆 치어를 밀어낸다',t:'feisty',out:[[1,'{n}이 옆 치어를 밀어냈습니다. "이놈은 기운이 좋네."','good',fo('cull',.6)]]},
  {l:'작업자 손가락을 따라간다',t:'friendly',out:[[1,'{n}이 손가락을 따라 헤엄치자 작업자가 피식 웃었습니다.','good',fo('cull',.65)]]},
  {l:'몸 색을 가장 진하게 낸다',g:'LAB',out:[[1,'{n}이 온몸의 색을 끝까지 끌어올렸습니다.','good',fo('cull',.4)]]},
  {l:'꼬리를 부채처럼 편다',g:'GOLD',out:[[1,'{n}이 꼬리를 부채처럼 펼쳤습니다.','good',fo('cull',.5)]]},
 ]},
 shop:{who:'판매 수조에서',p:['유리 앞에 사람이 멈춰 선다. 손가락이 이쪽을 가리킨다. 나는…','아이가 유리에 얼굴을 붙이고 "이거! 이거!" 한다. 나는…','점원이 뜰채를 들고 수조 위에 섰다. "어느 거요?" 나는…','어떤 사람이 휴대폰으로 사육법을 검색하며 한참 들여다본다. 나는…','"이거 다 크면 얼마나 커요?" 누군가 묻는다. 나는…'],o:[
  {l:'유리 앞으로 헤엄쳐 나간다',d:'눈에 띄게',out:[[1,'{n}은 유리 앞으로 나가 지느러미를 폈습니다.','neutral',()=>{S.f.shopMood='front';S.f.odds.shop=.8}]]},
  {l:'수초 뒤에 숨는다',d:'아무 손에나 가지 않게',out:[[1,'{n}은 수초 뒤로 숨었습니다.','neutral',()=>{S.f.shopMood='hide'}]]},
  {l:'바닥에서 가만히 지켜본다',out:[[1,'{n}은 바닥에서 그 얼굴을 올려다보았습니다.','neutral']]},
  {l:'여과기 뒤로 숨는다',t:'shy',out:[[1,'{n}은 여과기 뒤로 숨었습니다. 점원이 뜰채로 휘저었습니다.','bad',()=>{S.f.shopMood='hide';S.health-=3}]]},
  {l:'유리에 비친 얼굴을 따라 헤엄친다',t:'curious',out:[[1,'{n}은 유리 너머 얼굴을 따라 이리저리 헤엄쳤습니다.','neutral',()=>{S.f.shopMood='front'}]]},
  {l:'손가락을 먹이인 줄 알고 따라간다',t:'glutton',out:[[1,'{n}이 손가락을 따라 수면까지 올라왔습니다. "얘 밥 달래요!"','neutral',()=>{S.f.shopMood='front'}]]},
  {l:'유리에 몸을 붙인다',t:'friendly',out:[[1,'{n}이 유리에 몸을 붙였습니다. 그 사람이 한참 쪼그려 앉아 들여다봤습니다.','good',()=>{S.f.shopMood='friendly'}]]},
  {l:'뜰채를 들이받는다',t:'feisty',out:[[1,'{n}이 뜰채를 들이받았습니다. "이놈 기운 좋네, 이걸로 주세요."','neutral',()=>{S.f.shopMood='show'}]]},
  {l:'지느러미를 펴고 위협한다',g:'LAB',out:[[1,'{n}이 아가미까지 펴고 유리 너머를 위협했습니다.','neutral',()=>{S.f.shopMood='front'}]]},
  {l:'먹이로 넣어 준 금붕어를 덮친다',g:'PRED',out:[[1,'{n}이 먹이 금붕어를 한입에 삼켰습니다. 구경하던 사람들이 휴대폰을 꺼냈습니다.','neutral',()=>{S.f.shopMood='show'}]]},
  {l:'낮에는 은신처에서 나오지 않는다',g:'NIGHT',out:[[1,'{n}은 은신처 관 속에서 나오지 않았습니다.','neutral',()=>{S.f.shopMood='hide'}]]},
 ]},
};
function pSit(k){const P=PSIT[k];return {who:P.who,p:pick(P.p),o:fBuildOpts({o:P.o,noTwist:1})}}

/* ---------- crises: a hazard strikes, and what the fish does decides whether it is the end ----------
   die() ends with the crisis that is happening; lived(text, effect) survives with a scar */
const die=()=>{const f=S.f;render();fEnd(f.ck,f.ca)};
const lived=(fx,m)=>both(fx,()=>{S.f.won=(S.f.won||0)+1;if(m)remember(m,1.3);fStat('g',3);if(typeof fMistake==='function')q(null,null,()=>fMistake(S.f.ck))});
const CRISIS={
 jump:{p:['수면 위 틈 너머로 불빛이 보인다. 몸이 근질거린다. 나는…','수면에 날벌레가 내려앉았다. 뚜껑은 없다. 나는…'],o:[
  {l:'참는다',out:[[4,'{n}은 수면 아래에서 몸을 돌렸습니다.','neutral',lived()],[1,'그래도 몸이 먼저 튀어 올랐습니다.','bad',die]]},
  {l:'바닥으로 내려간다',t:'shy',out:[[5,'{n}은 바닥으로 내려가 그 충동이 지나가길 기다렸습니다.','good',lived()]]},
  {l:'힘껏 뛰어오른다',t:['curious','feisty'],out:[[2,'{n}이 공중으로 솟았다가 다시 물속에 떨어졌습니다. 심장이 쿵쾅거렸습니다.','neutral',lived(X({st:.05}),'공중을 날았다. 다시 물로 떨어졌다.')],[3,'','bad',die]]},
  {l:'벌레를 낚아채러 뛴다',t:'glutton',out:[[3,'{n}이 벌레를 물고 물속으로 떨어졌습니다.','good',lived(X({h:2}))],[2,'','bad',die]]},
  {l:'유리벽 쪽으로 낮게 뛴다',g:'JUMP',out:[[3,'{n}의 몸이 유리벽에 부딪혀 물속으로 떨어졌습니다.','neutral',lived(X({h:-5}))],[2,'','bad',die]]},
 ]},
 eaten:{p:['커다란 그림자가 천천히 다가온다. 입이 열린다. 나는…','밤이다. 무언가 바닥을 훑으며 다가온다. 나는…'],o:[
  {l:'수초 속으로 파고든다',out:[[()=>S.f.hides?4:1,'{n}은 수초 깊숙이 몸을 밀어 넣었습니다. 그림자는 지나갔습니다.','good',lived(X({st:.08}),'그림자가 지나갔다. 살았다.')],[2,'','bad',die]]},
  {l:'무리 한가운데로 숨는다',g:'SCHOOL',out:[[4,'그림자는 무리 중 다른 한 마리를 물고 돌아섰습니다.','neutral',lived(()=>{const m=S.f.mates.find(m=>m.id===S.sp.id&&m.n>0);if(m)m.n--})],[1,'','bad',die]]},
  {l:'꼼짝 않고 바닥에 붙는다',t:'shy',out:[[2,'그림자는 움직이지 않는 {n}을 알아보지 못했습니다.','good',lived()],[2,'','bad',die]]},
  {l:'정면으로 맞선다',t:'feisty',out:[[1,'{n}이 덤비자 그림자가 움찔 물러났습니다.','good',lived(X({fin:.2,h:-10}),'덩치 큰 놈에게 덤볐다. 살아남았다.')],[3,'','bad',die]]},
  {l:'수면 쪽으로 달아난다',t:['curious','friendly'],out:[[2,'{n}은 수면 바로 밑까지 도망쳤습니다. 그림자는 따라오지 않았습니다.','neutral',lived()],[()=>lidOpen()?1:0,'{n}은 수면을 넘어 수조 밖으로 떨어졌습니다.','bad',()=>{render();fEnd('jump')}],[2,'','bad',die]]},
  {l:'몸을 터질 듯 부풀린다',g:'PUFF',out:[[4,'그림자가 {n}을 입에 넣었다가 뱉어 냈습니다.','good',lived(X({h:-12}),'삼켜졌다가 뱉어졌다.')],[1,'','bad',die]]},
 ]},
 intake:{p:['물살이 몸을 흡입구 쪽으로 끌어당긴다. 나는…'],o:[
  {l:'반대쪽으로 힘껏 헤엄친다',out:[[3,'{n}은 간신히 물살을 벗어났습니다.','neutral',lived(X({h:-4}))],[2,'','bad',die]]},
  {l:'바닥 돌 뒤로 몸을 숨긴다',t:'shy',out:[[3,'{n}은 돌 뒤에서 물살이 약해질 때까지 버텼습니다.','good',lived()],[1,'','bad',die]]},
  {l:'흡입구 망을 물고 버틴다',t:'feisty',out:[[2,'{n}이 버티는 사이 주인이 여과기를 껐습니다.','good',lived(X({fin:.1}))],[2,'','bad',die]]},
  {l:'흡입구 안이 궁금해 들여다본다',t:'curious',out:[[1,'','bad',die]]},
 ]},
 cook:{p:['물이 점점 뜨거워진다. 히터 불이 꺼지지 않는다. 나는…'],o:[
  {l:'히터에서 가장 먼 바닥 구석으로 간다',out:[[3,'다음 날 아침, 주인이 수온계를 보고 히터 플러그를 뽑았습니다.','neutral',lived(X({h:-15}),'끓는 물을 버텼다.')],[2,'','bad',die]]},
  {l:'수면에서 숨을 쉰다',out:[[2,'수면에서 버티던 {n}을 주인이 발견했습니다.','neutral',lived(X({h:-12}))],[2,'','bad',die]]},
  {l:'유리 앞에서 헐떡이며 주인을 기다린다',t:'friendly',out:[[()=>S.interest*4,'헐떡이는 {n}을 본 주인이 히터를 뽑고 얼음 팩을 띄웠습니다.','good',lived(X({h:-8,i:.08}),'주인이 나를 봤다.')],[2,'','bad',die]]},
  {l:'수면 공기로 숨을 쉰다',g:'AIR',out:[[4,'{n}은 수면 공기로 숨을 쉬며 물이 식을 때까지 버텼습니다.','good',lived(X({h:-10}))],[1,'','bad',die]]},
 ]},
 cold:{p:['물이 얼음장 같다. 지느러미가 움직이지 않는다. 나는…'],o:[
  {l:'바닥에 붙어 힘을 아낀다',out:[[2,'{n}은 거의 죽은 듯 바닥에 붙어 추위를 버텼습니다.','neutral',lived(X({h:-15}),'얼음장 같은 물을 버텼다.')],[2,'','bad',die]]},
  {l:'계속 헤엄쳐 몸을 데운다',t:['feisty','curious'],out:[[1,'{n}은 밤새 헤엄쳤습니다. 아침 햇볕이 들었습니다.','neutral',lived(X({h:-18}))],[3,'','bad',die]]},
  {l:'조명 밑 수면으로 올라간다',t:'curious',out:[[2,'조명 밑 물이 조금 따뜻했습니다.','good',lived(X({h:-10}))],[2,'','bad',die]]},
 ]},
 oxygen:{p:['정전이다. 여과기가 멈췄다. 숨이 막혀 온다. 나는…','폭염의 밤, 물이 미지근하다. 숨이 점점 가빠진다. 나는…'],o:[
  {l:'수면에 입을 대고 숨을 쉰다',out:[[3,'{n}은 밤새 수면에 입을 대고 버텼습니다. 새벽에 전기가 들어왔습니다.','neutral',lived(X({h:-12}),'숨 막히는 밤을 버텼다.')],[2,'','bad',die]]},
  {l:'움직이지 않고 숨을 아낀다',t:'shy',out:[[3,'{n}은 꼼짝 않고 숨을 아꼈습니다.','good',lived(X({h:-8}))],[2,'','bad',die]]},
  {l:'수면 위 공기를 마신다',g:'AIR',out:[[5,()=>S.f.mates.some(m=>m.n>0)?'{n}에게는 공기가 있었습니다. 다른 물고기들이 떠오르는 동안 {n}은 살아남았습니다.':'{n}에게는 공기가 있었습니다. 수면에 입을 대고, {n}은 그 밤을 넘겼습니다.','good',lived(X({h:-5}),'다들 떠오르는데 나는 숨을 쉬었다.')]]},
  {l:'몸부림치며 물을 휘젓는다',t:'feisty',out:[[1,'{n}이 휘저은 물에 조금 산소가 섞였습니다.','neutral',lived(X({h:-15}))],[3,'','bad',die]]},
 ]},
 tapwater:{p:['새 물에서 소독약 냄새가 난다. 아가미가 타는 듯하다. 나는…'],o:[
  {l:'바닥에서 버틴다',out:[[()=>fx_().hardy*3,'{n}은 아가미가 하얗게 질린 채 버텼습니다.','neutral',lived(X({h:-20}),'타는 물을 버텼다.')],[2,'','bad',die]]},
  {l:'수면으로 올라가 몸부림친다',t:['feisty','friendly'],out:[[2,'몸부림치는 {n}을 보고 주인이 물을 다시 반쯤 갈았습니다. 이번엔 약을 넣었습니다.','good',lived(X({h:-15,i:.05}))],[2,'','bad',die]]},
 ]},
 poison:{p:['물 위에 무지갯빛 막이 떴다. 쓴 냄새가 난다. 나는…'],o:[
  {l:'바닥 깊이 내려간다',out:[[2,'{n}은 바닥에서 버텼습니다. 다음 날 주인이 물을 갈았습니다.','neutral',lived(X({h:-20}))],[3,'','bad',die]]},
  {l:'여과기 물살 쪽으로 간다',t:'curious',out:[[2,'여과기 물살 근처의 물이 조금 덜 썼습니다.','neutral',lived(X({h:-18}))],[3,'','bad',die]]},
  {l:'수면에서 몸을 뒤틀어 주인을 부른다',t:'friendly',out:[[()=>S.interest*3,'주인이 이상한 걸 알아채고 {n}을 양동이로 옮겼습니다.','good',lived(X({h:-15}),'주인이 나를 건져 냈다.')],[3,'','bad',die]]},
 ]},
 burst:{p:['퍽. 수조가 터졌다. 물이 한꺼번에 빠져나간다. 나는…'],o:[
  {l:'남은 물웅덩이로 몸을 굴린다',out:[[2,'잠에서 깬 주인이 바닥에서 퍼덕이는 {n}을 건져 냄비에 담았습니다.','neutral',lived(()=>{S.health-=25;S.f.wq=60;S.f.cycled=0;S.f.tankAge=0},'바닥에서 퍼덕였다. 누군가 건져 줬다.')],[3,'','bad',die]]},
  {l:'퍼덕이며 소리를 낸다',t:['friendly','feisty'],out:[[3,'퍼덕이는 소리에 주인이 뛰어나왔습니다.','neutral',lived(()=>{S.health-=20;S.f.cycled=0;S.f.tankAge=0})],[2,'','bad',die]]},
  {l:'가만히 숨을 아낀다',t:'shy',out:[[1,'{n}은 물기 남은 바닥에서 아침까지 버텼습니다.','neutral',lived(()=>{S.health-=30;S.f.cycled=0;S.f.tankAge=0})],[3,'','bad',die]]},
  {l:'공기로 숨을 쉬며 버틴다',g:'AIR',out:[[4,'{n}은 공기로 숨을 쉬며 아침까지 바닥에서 버텼습니다.','good',lived(()=>{S.health-=15;S.f.cycled=0;S.f.tankAge=0},'물 밖에서 밤을 버텼다.')],[1,'','bad',die]]},
 ]},
 cat:{p:['앞발이 물속으로 들어온다. 발톱이 물을 가른다. 나는…'],o:[
  {l:'바닥으로 내려간다',out:[[3,'앞발은 바닥까지 닿지 않았습니다.','good',lived(X({st:.1}))],[2,'','bad',die]]},
  {l:'수초 속으로 숨는다',t:'shy',out:[[()=>S.f.hides?4:1,'앞발은 수초만 헤집다 사라졌습니다.','good',lived()],[2,'','bad',die]]},
  {l:'앞발을 문다',t:'feisty',out:[[2,'{n}이 앞발을 물자 고양이가 깜짝 놀라 도망쳤습니다.','good',lived(X({h:-5}),'고양이 발을 물었다.')],[2,'','bad',die]]},
  {l:'앞발에 다가가 본다',t:['curious','friendly'],out:[[1,'','bad',die]]},
 ]},
 siphon:{p:['호스가 물을 빨아들인다. 몸이 끌려간다. 나는…'],o:[
  {l:'반대쪽으로 헤엄친다',out:[[3,'{n}은 간신히 호스를 벗어났습니다.','neutral',lived()],[2,'','bad',die]]},
  {l:'돌 틈에 몸을 끼운다',t:'shy',out:[[3,'{n}은 돌 틈에서 버텼습니다.','good',lived()],[1,'','bad',die]]},
  {l:'호스 입구를 들여다본다',t:'curious',out:[[1,'','bad',die]]},
 ]},
 sun:{p:['물이 목욕물처럼 데워진다. 숨이 차다. 나는…'],o:[
  {l:'바닥 그늘에서 버틴다',out:[[2,'해가 지자 물이 조금 식었습니다.','neutral',lived(X({h:-15}))],[3,'','bad',die]]},
  {l:'유리 앞에서 헐떡인다',t:'friendly',out:[[()=>S.interest*4,'주인이 어항을 그늘로 옮겼습니다.','good',lived(()=>{S.health-=10;S.f.window=0})],[3,'','bad',die]]},
 ]},
 bread:{p:['하얗게 불은 빵 조각이 떨어진다. 냄새가 좋다. 나는…'],o:[
  {l:'먹지 않는다',out:[[4,'{n}은 빵을 외면했습니다. 빵은 바닥에서 썩었습니다.','neutral',lived(X({wq:-12}))],[1,'','bad',die]]},
  {l:'조금만 먹는다',out:[[2,'배가 조금 부풀었다가 가라앉았습니다.','neutral',lived(X({h:-6}))],[2,'','bad',die]]},
  {l:'보이는 대로 다 먹는다',t:'glutton',out:[[1,'{n}은 하룻밤 옆으로 누워 있다가 겨우 일어났습니다.','neutral',lived(X({h:-20}))],[4,'','bad',die]]},
 ]},
 squeeze:{p:['작은 손이 물속으로 들어와 나를 잡으려 한다. 나는…'],o:[
  {l:'쏜살같이 피한다',out:[[3,'작은 손은 물만 휘젓다 나갔습니다.','good',lived()],[2,'','bad',die]]},
  {l:'은신처로 숨는다',t:'shy',out:[[()=>S.f.hides?4:1,'손은 은신처까지 들어오지 못했습니다.','good',lived()],[2,'','bad',die]]},
  {l:'손가락을 문다',t:'feisty',out:[[3,'아이가 "앗!" 하고 손을 뺐습니다. 다시는 손을 넣지 않았습니다.','good',lived(X({h:-4}),'작은 손을 물었다.')],[1,'','bad',die]]},
  {l:'손바닥 위로 헤엄쳐 간다',t:'friendly',out:[[1,'아이는 {n}을 손바닥에 올려 엄마에게 보여 준 뒤 다시 넣었습니다.','neutral',lived(X({h:-12}))],[3,'','bad',die]]},
 ]},
 cycle:{p:['물이 독하다. 아가미가 타는 듯하고 눈앞이 뿌옇다. 나는…','수면에 하얀 거품이 떠 있다. 숨을 쉴 때마다 아프다. 나는…'],o:[
  {l:'수면에서 숨을 쉰다',out:[[1,'{n}은 수면에 입을 대고 하룻밤을 버텼습니다. 다음 날 물이 조금 나아졌습니다.','neutral',lived(()=>{S.health=Math.max(8,S.health-20);S.f.wq+=18},'독한 물을 버텼다.')],[3,'','bad',die]]},
  {l:'바닥에서 꼼짝 않는다',out:[[1,'{n}은 바닥에서 아가미만 움직이며 버텼습니다.','neutral',lived(()=>{S.health=Math.max(6,S.health-25);S.f.wq+=12})],[3,'','bad',die]]},
  {l:'유리 앞에서 주인을 기다린다',t:'friendly',out:[[()=>S.interest*3,'유리 앞에서 기운 없이 떠 있는 {n}을 주인이 봤습니다. 그날 물을 절반 갈았습니다.','good',lived(()=>{S.f.wq+=35;S.health=Math.max(10,S.health-10);S.interest+=.1},'주인이 물을 갈아 줬다.')],[2,'','bad',die]]},
  {l:'수면 위 공기를 마신다',g:'AIR',out:[[3,'{n}은 물 대신 공기로 숨을 쉬며 버텼습니다.','good',lived(()=>{S.f.wq+=15;S.health=Math.max(10,S.health-10)})],[2,'','bad',die]]},
 ]},
 disease:{p:['몸이 무겁다. 지느러미가 더는 펴지지 않는다. 나는…'],o:[
  {l:'가만히 쉰다',out:[[1,'{n}은 바닥에서 며칠을 꼼짝 않고 지냈습니다. 고비가 지나갔습니다.','neutral',lived(()=>{S.f.ill.sev=.55;S.health=Math.max(12,S.health)},'고비를 넘겼다.')],[3,'','bad',die]]},
  {l:'마지막 힘으로 헤엄친다',t:['feisty','curious'],out:[[1,'{n}은 이를 악물 듯 수조를 한 바퀴 돌았습니다. 그리고 버텼습니다.','neutral',lived(()=>{S.f.ill.sev=.6;S.health=Math.max(10,S.health)})],[4,'','bad',die]]},
  {l:'유리 앞에서 주인을 본다',t:'friendly',out:[[()=>S.interest*3,'주인이 그제야 {n}이 아프다는 걸 알아챘습니다. 그날 바로 약을 사 왔습니다.','good',lived(()=>{S.f.ill.sev=.5;S.f.ill.noticed=1;S.f.ill.treating=1;S.health=Math.max(15,S.health)},'주인이 알아챘다.')],[3,'','bad',die]]},
  {l:'먹이를 억지로라도 먹는다',t:'glutton',out:[[1,'{n}은 억지로 먹었습니다. 몸이 조금 버텼습니다.','neutral',lived(()=>{S.f.ill.sev=.6;S.health=Math.max(14,S.health)})],[3,'','bad',die]]},
  {l:'은신처 깊숙이 들어간다',t:'shy',out:[[1,'{n}은 은신처 안에서 혼자 고비를 넘겼습니다.','neutral',lived(()=>{S.f.ill.sev=.6;S.health=Math.max(10,S.health)})],[3,'','bad',die]]},
 ]},
 escape:{p:['뚜껑 틈으로 바깥 공기가 들어온다. 몸이 그쪽으로 끌린다. 나는…'],o:[
  {l:'참는다',out:[[4,'{n}은 틈 앞에서 몸을 돌렸습니다.','neutral',lived()],[1,'','bad',die]]},
  {l:'틈으로 몸을 밀어 본다',t:['curious','feisty'],out:[[1,'몸이 반쯤 빠져나갔다가 다시 물로 미끄러졌습니다.','neutral',lived(X({h:-8}))],[3,'','bad',die]]},
  {l:'은신처로 돌아간다',t:'shy',out:[[5,'{n}은 은신처 관 속으로 돌아갔습니다.','good',lived()]]},
 ]},
};
function fCrisis(k,arg){
  const f=S.f,c=CRISIS[k];if(!c){render();fEnd(k,arg);return}
  f.ck=k;f.ca=arg;
  const opts=fBuildOpts({o:c.o,crisis:1});if(opts.length<2){render();fEnd(k,arg);return}
  askChoice({who:'고비 — 살아남기',p:pick(c.p),o:opts});render();
}
