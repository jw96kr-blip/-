/* ============================================================
   루트 App — 라우팅 / 지역 필터 / 레이아웃 / Tweaks
   ============================================================ */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "defaultLayout": "A",
  "accent": ["#C69860","#A87C42","#EFE2CE","#F8F1E6"],
  "fontScale": 100,
  "density": "regular",
  "cardStyle": "soft"
}/*EDITMODE-END*/;

const ACCENTS = [
  ["#C69860","#A87C42","#EFE2CE","#F8F1E6"], // 골드 (지정)
  ["#B98A4E","#8F6630","#E8D8BE","#F4ECDC"], // 딥 카멜
  ["#A88B62","#7E6840","#E6DECB","#F3EEE2"], // 토프
  ["#9C8A5E","#6F6038","#E2DCC4","#F0ECDD"], // 올리브 골드
];

function applyTweaks(t){
  const r = document.documentElement.style;
  const [g,gd,gs,gw] = t.accent || ACCENTS[0];
  r.setProperty("--gold", g);
  r.setProperty("--gold-deep", gd);
  r.setProperty("--gold-soft", gs);
  r.setProperty("--gold-wash", gw);
  r.setProperty("--soon", g);
  document.documentElement.style.fontSize = (t.fontScale/100*16).toFixed(1)+"px";
  document.body.dataset.density = t.density;
  document.body.dataset.card = t.cardStyle;
}

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState("dashboard");
  const [region, setRegion] = useState("all");
  const [layout, setLayout] = useState(t.defaultLayout || "A");

  useEffect(()=>{ applyTweaks(t); }, [t]);
  useEffect(()=>{ setLayout(t.defaultLayout); }, [t.defaultLayout]);

  const go = (r)=>{ setRoute(r); window.scrollTo({top:0,behavior:"smooth"}); };
  const counts = regionCounts();

  return (
    <div className="app">
      <Header route={route} go={go} today={window.APP_DATA.TODAY}/>
      <RegionBar value={region} onChange={setRegion} counts={counts}/>

      <main style={{flex:1}}>
        {route==="dashboard"     && <Dashboard layout={layout} setLayout={setLayout} region={region} go={go}/>}
        {route==="subscriptions" && <SubscriptionsPage region={region} go={go}/>}
        {route==="competition"   && <CompetitionPage region={region} go={go}/>}
        {route==="listings"      && <ListingsPage region={region} go={go}/>}
      </main>

      <footer className="ft">
        <div className="wrap ft-row">
          <div className="ft-note">
            <b>청약 라운지</b> — 청약 일정·경쟁률·분양정보 통합 대시보드<br/>
            본 화면의 단지·수치는 모두 <b>데모용 가상 데이터</b>이며 실제 청약 정보와 무관합니다.
          </div>
          <div className="ft-note" style={{textAlign:"right"}}>
            데이터 기준 <b>{window.APP_DATA.TODAY}</b><br/>
            서울 › 수도권 › 지방 중요도 정렬
          </div>
        </div>
      </footer>

      <TweaksPanel>
        <TweakSection label="레이아웃"/>
        <TweakRadio label="기본 레이아웃" value={t.defaultLayout}
          options={["A","B","C"]} onChange={v=>setTweak("defaultLayout",v)}/>
        <TweakRadio label="밀도" value={t.density}
          options={["compact","regular","comfy"]} onChange={v=>setTweak("density",v)}/>
        <TweakRadio label="카드 스타일" value={t.cardStyle}
          options={["soft","flat","line"]} onChange={v=>setTweak("cardStyle",v)}/>

        <TweakSection label="브랜드"/>
        <TweakColor label="메인 컬러" value={t.accent} options={ACCENTS}
          onChange={v=>setTweak("accent",v)}/>
        <TweakSlider label="글자 크기" value={t.fontScale} min={85} max={120} step={5} unit="%"
          onChange={v=>setTweak("fontScale",v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
