/* ============================================================
   메인 대시보드 — 레이아웃 3안 (A 표준그리드 / B 2단 / C 지역스낵형)
   ============================================================ */

const RANK = { seoul:1, metro:2, local:3 };
const STAT = { live:0, soon:1, closed:2 };

function useDashData(region){
  const D = window.APP_DATA;
  let list = D.COMPLEXES.slice();
  if(region!=="all") list = list.filter(c=>c.region===region);
  // 중요도: 지역(서울>수도권>지방) > 상태(접수중>예정>마감)
  list.sort((a,b)=> (RANK[a.region]-RANK[b.region]) || (STAT[a.status]-STAT[b.status]) || ((b.rate||0)-(a.rate||0)));
  return list;
}
function regionCounts(){
  const D = window.APP_DATA, c={ all:D.COMPLEXES.length, seoul:0, metro:0, local:0 };
  D.COMPLEXES.forEach(x=>c[x.region]++);
  return c;
}

/* 경쟁률 보유 단지 (마감/접수중) */
function rateRows(list, n){
  return list.filter(c=>c.rate).sort((a,b)=>b.rate-a.rate).slice(0,n)
    .map(c=>({ id:c.id, name:c.name, rate:c.rate, region:c.region }));
}

/* ====================== LAYOUT A : 표준 그리드 ====================== */
function LayoutA({ list, go }){
  const D = window.APP_DATA;
  const rrows = rateRows(D.COMPLEXES, 5);
  const maxRate = Math.max(...rrows.map(r=>r.rate));
  const featured = list.find(c=>c.featured) || list[0];
  return (
    <div className="dash">
      <SummaryCards data={D.SUMMARY}/>

      <div className="split-2">
        {/* 청약 일정 */}
        <div className="card card-pad">
          <PanelHead title="이번주 청약 일정" more="신청·당첨 상세" onMore={()=>go("subscriptions")}/>
          <div>
            {list.slice(0,6).map(c=> <ScheduleItem key={c.id} c={c} go={go}/>)}
          </div>
        </div>

        {/* 우측 위젯 컬럼 */}
        <div className="col">
          <div className="card card-pad">
            <PanelHead title="실시간 경쟁률 TOP 5" more="경쟁률 상세" onMore={()=>go("competition")}/>
            <CompetitionBars rows={rrows} max={maxRate}/>
          </div>
          <div className="card card-pad">
            <PanelHead title={"특별공급 구성 · "+featured.name.split(" ")[0]}/>
            <SpecialSupply ss={featured.ss}/>
          </div>
        </div>
      </div>

      {/* 분양정보 */}
      <div>
        <div className="panel-head">
          <h3 className="h-section">진행 중 분양정보 <span style={{fontSize:"14px",color:"var(--gold-deep)"}} className="num">{list.length}</span></h3>
          <a className="more" onClick={()=>go("listings")}>분양정보 전체{Icon.chev()}</a>
        </div>
        <div className="grid-4">
          {list.slice(0,8).map(c=> <ListingCard key={c.id} c={c} go={go}/>)}
        </div>
      </div>
    </div>
  );
}

/* ====================== LAYOUT B : 2단 워크스페이스 ====================== */
function LayoutB({ list, go }){
  const D = window.APP_DATA;
  const rrows = rateRows(D.COMPLEXES, 6);
  const maxRate = Math.max(...rrows.map(r=>r.rate));
  const featured = list.find(c=>c.featured) || list[0];
  return (
    <div className="dash">
      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:"20px",alignItems:"start"}} className="bgrid">
        {/* 좌측 캘린더 레일 */}
        <div className="col" style={{position:"sticky",top:"84px"}}>
          <div className="card card-pad">
            <PanelHead title="청약 캘린더" more="전체" onMore={()=>go("subscriptions")}/>
            <div style={{fontSize:"12.5px",fontWeight:700,color:"var(--brown-soft)",marginBottom:"6px"}}>2026년 6월 · 접수 일정</div>
            <div>
              {list.slice(0,7).map(c=> <ScheduleItem key={c.id} c={c} go={go}/>)}
            </div>
          </div>
        </div>

        {/* 우측 본문 */}
        <div className="col">
          <SummaryCards data={D.SUMMARY}/>
          <div className="grid-2">
            <div className="card card-pad">
              <PanelHead title="경쟁률 순위" more="상세" onMore={()=>go("competition")}/>
              <CompetitionBars rows={rrows} max={maxRate}/>
            </div>
            <div className="card card-pad">
              <PanelHead title="특별공급 구성"/>
              <div style={{fontSize:"12.5px",fontWeight:700,color:"var(--brown)",marginBottom:"10px"}}>{featured.name}</div>
              <SpecialSupply ss={featured.ss}/>
            </div>
          </div>
          <div>
            <div className="panel-head">
              <h3 className="h-section">진행 중 분양정보</h3>
              <a className="more" onClick={()=>go("listings")}>전체{Icon.chev()}</a>
            </div>
            <div className="grid-3">
              {list.slice(0,6).map(c=> <ListingCard key={c.id} c={c} go={go}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== LAYOUT C : 지역 우선 스낵형 ====================== */
function RegionRail({ region, list, go }){
  const R = window.APP_DATA.REGIONS[region];
  const items = list.filter(c=>c.region===region);
  if(!items.length) return null;
  return (
    <div>
      <div className="sec-head">
        <h3 className="h-section">{R.label}</h3>
        <span className="cnt num">{items.length}개 단지</span>
        <span className="spacer"></span>
        <a className="more" onClick={()=>go("listings")}>더보기{Icon.chev()}</a>
      </div>
      <div className="rail scroll-x">
        {items.map(c=> <div key={c.id} style={{width:"280px"}}><ListingCard c={c} go={go}/></div>)}
      </div>
    </div>
  );
}

function LayoutC({ list, go }){
  const D = window.APP_DATA;
  const featured = D.COMPLEXES.find(c=>c.featured);
  const rrows = rateRows(D.COMPLEXES, 5);
  const maxRate = Math.max(...rrows.map(r=>r.rate));
  // 지역 표시 순서 = 중요도순
  const order = ["seoul","metro","local"].filter(rg=> list.some(c=>c.region===rg));
  return (
    <div className="dash">
      {/* hero + summary */}
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"18px",alignItems:"stretch"}} className="cgrid">
        <div className="hero" onClick={()=>go("listings")} style={{cursor:"pointer"}}>
          <div className="hero-eyebrow">오늘의 주목 단지 · 서울</div>
          <div className="hero-title">{featured.name}</div>
          <div style={{position:"relative",display:"flex",gap:"8px",alignItems:"center"}}>
            <StatusBadge status={featured.status}/>
            <span style={{fontSize:"13px",color:"var(--gold-soft)"}}>{featured.gu} · {featured.units.toLocaleString()}세대</span>
          </div>
          <div className="hero-meta">
            <div><div className="k">분양가 {featured.area}</div><div className="v num">{featured.price}억</div></div>
            <div><div className="k">청약 경쟁률</div><div className="v num">{featured.rate}:1</div></div>
            <div><div className="k">당첨가점 컷</div><div className="v num">{featured.cutScore}점</div></div>
            <div><div className="k">접수마감</div><div className="v num">{featured.receiptEnd}</div></div>
          </div>
        </div>
        <div className="col">
          <div className="summary-grid" style={{gridTemplateColumns:"1fr 1fr"}}>
            {D.SUMMARY.map((s,i)=>(
              <div key={s.key} className={"scard"+(i%2?" alt":"")}>
                <div className="scard-label">{s.label}</div>
                <div className="scard-num num">{s.value}<small>{s.unit}</small></div>
                <div className="scard-foot"><span style={{color:"var(--ink-soft)",fontWeight:400}}>{s.note}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 지역별 레일 (서울 > 수도권 > 지방) */}
      {order.map(rg=> <RegionRail key={rg} region={rg} list={list} go={go}/>)}

      {/* 하단 인사이트 */}
      <div className="grid-2">
        <div className="card card-pad">
          <PanelHead title="경쟁률 TOP 5" more="경쟁률 상세" onMore={()=>go("competition")}/>
          <CompetitionBars rows={rrows} max={maxRate}/>
        </div>
        <div className="card card-pad">
          <PanelHead title={"특별공급 · "+featured.name}/>
          <SpecialSupply ss={featured.ss}/>
        </div>
      </div>
    </div>
  );
}

/* ====================== 디스패처 ====================== */
function Dashboard({ layout, setLayout, region, go }){
  const list = useDashData(region);
  return (
    <div className="wrap">
      <div className="row" style={{justifyContent:"space-between",alignItems:"flex-end",paddingTop:"22px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <div className="kr-eyebrow">2026년 6월 · 청약 현황 한눈에 보기</div>
          <h1 className="h-page" style={{marginTop:"6px"}}>오늘의 청약 대시보드</h1>
        </div>
        <div className="row" style={{gap:"10px"}}>
          <span style={{fontSize:"12.5px",fontWeight:700,color:"var(--brown-soft)"}}>레이아웃</span>
          <div className="lswitch">
            <button className={layout==="A"?"on":""} onClick={()=>setLayout("A")}>표준 그리드</button>
            <button className={layout==="B"?"on":""} onClick={()=>setLayout("B")}>2단 워크스페이스</button>
            <button className={layout==="C"?"on":""} onClick={()=>setLayout("C")}>지역 스낵형</button>
          </div>
        </div>
      </div>

      {layout==="A" && <LayoutA list={list} go={go}/>}
      {layout==="B" && <LayoutB list={list} go={go}/>}
      {layout==="C" && <LayoutC list={list} go={go}/>}
    </div>
  );
}

Object.assign(window, { Dashboard });
