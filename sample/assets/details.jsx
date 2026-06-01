/* ============================================================
   상세 페이지 — 청약 신청·당첨 / 경쟁률·특별공급 / 분양정보
   ============================================================ */

function Crumb({ go, label }){
  return (
    <div className="crumb">
      <a onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>대시보드</a>
      {Icon.chev({style:{opacity:.5}})}
      <span style={{color:"var(--brown)"}}>{label}</span>
    </div>
  );
}

function PageBand({ go, crumb, title, lead, stats }){
  return (
    <div className="pageband">
      <div className="wrap pageband-row">
        <Crumb go={go} label={crumb}/>
        <h1 className="h-page">{title}</h1>
        <p className="page-lead">{lead}</p>
        {stats && (
          <div className="statstrip">
            {stats.map(s=>(
              <div className="s" key={s.k}><div className="k">{s.k}</div><div className="v num">{s.v}</div></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function sortByImportance(list){
  const RANK={seoul:1,metro:2,local:3}, STAT={live:0,soon:1,closed:2};
  return list.slice().sort((a,b)=>(RANK[a.region]-RANK[b.region])||(STAT[a.status]-STAT[b.status])||((b.rate||0)-(a.rate||0)));
}

/* ============ 1) 청약 신청·당첨 ============ */
function SubscriptionsPage({ region, go }){
  const D = window.APP_DATA;
  let list = D.COMPLEXES.filter(c=> region==="all"||c.region===region);
  list = sortByImportance(list);
  const live = list.filter(c=>c.status==="live").length;
  const totalApply = list.reduce((a,c)=> a + (c.rate? Math.round(c.general*c.rate):0),0);

  return (
    <div>
      <PageBand go={go} crumb="청약 신청·당첨" title="청약 신청 · 당첨자 현황"
        lead="접수 일정과 신청 경쟁률, 당첨자 발표일·당첨가점 컷오프를 한 표에서 확인합니다. 서울 → 수도권 → 지방 중요도 순으로 정렬됩니다."
        stats={[
          { k:"접수중 단지", v:live+"개" },
          { k:"누적 신청 추정", v:totalApply.toLocaleString()+"건" },
          { k:"평균 당첨가점 컷", v:"61점" },
          { k:"이번주 발표", v:"2건" },
        ]}/>
      <div className="wrap" style={{padding:"24px 0 10px"}}>
        <div className="card" style={{padding:"6px 6px"}}>
          <div style={{overflowX:"auto"}} className="scroll-x">
            <table className="tbl" style={{minWidth:"760px"}}>
              <thead>
                <tr>
                  <th>단지 / 위치</th><th>구분</th><th>접수기간</th>
                  <th className="r">공급세대</th><th className="r">경쟁률</th>
                  <th>당첨자 발표</th><th className="r">가점컷</th><th>상태</th>
                </tr>
              </thead>
              <tbody>
                {list.map(c=>(
                  <tr key={c.id} onClick={()=>go("competition")}>
                    <td>
                      <div className="t-name">{c.name}</div>
                      <div className="t-sub">{c.gu}</div>
                    </td>
                    <td><RegionTag region={c.region}/></td>
                    <td className="num" style={{fontWeight:700,color:"var(--ink)"}}>{c.receiptStart}~{c.receiptEnd}</td>
                    <td className="r num">{c.units.toLocaleString()}<span style={{color:"var(--ink-soft)",fontWeight:400}}> / 일반 {c.general}</span></td>
                    <td className="r"><span className="t-num">{c.rate? c.rate.toFixed(1)+" :1":"–"}</span></td>
                    <td className="num" style={{fontWeight:700,color:"var(--brown-soft)"}}>{c.announce}</td>
                    <td className="r num" style={{fontWeight:700,color:c.cutScore?"var(--brown)":"var(--ink-soft)"}}>{c.cutScore? c.cutScore+"점":"–"}</td>
                    <td><StatusBadge status={c.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="ft-note" style={{marginTop:"14px"}}>
          <b>※ 데모용 가상 데이터</b> · 경쟁률·가점컷은 마감 단지 기준이며, 예정 단지는 발표 전입니다.
        </div>
      </div>
    </div>
  );
}

/* ============ 2) 경쟁률·특별공급 ============ */
function CompetitionPage({ region, go }){
  const D = window.APP_DATA;
  let list = sortByImportance(D.COMPLEXES.filter(c=> region==="all"||c.region===region));
  const withRate = list.filter(c=>c.rate);
  const [selId, setSelId] = React.useState((withRate[0]||list[0]).id);
  const sel = D.COMPLEXES.find(c=>c.id===selId);

  // 지역 평균
  const avg = (rg)=>{
    const r = D.COMPLEXES.filter(c=>c.region===rg && c.rate);
    return r.length? (r.reduce((a,c)=>a+c.rate,0)/r.length):0;
  };
  const regionAvg = [
    { name:"서울 평균", rate:avg("seoul"), region:"seoul" },
    { name:"수도권 평균", rate:avg("metro"), region:"metro" },
    { name:"지방 평균", rate:avg("local"), region:"local" },
  ].filter(r=>r.rate);
  const maxAvg = Math.max(...regionAvg.map(r=>r.rate));

  // 단지별 경쟁률 랭킹
  const rank = withRate.map(c=>({id:c.id,name:c.name,rate:c.rate,region:c.region})).sort((a,b)=>b.rate-a.rate);
  const maxRank = Math.max(...rank.map(r=>r.rate),1);

  // 선택 단지 주택형별
  const typeRows = (sel.types||[]).filter(t=>t.rate!=null).map(t=>({name:t.name,rate:t.rate,region:sel.region}));
  const maxType = Math.max(...typeRows.map(t=>t.rate),1);

  return (
    <div>
      <PageBand go={go} crumb="경쟁률·특별공급" title="경쟁률 · 특별공급 분석"
        lead="단지별·주택형별 청약 경쟁률과 특별공급 유형 구성을 비교합니다. 지역 평균과 비교해 과열 정도를 가늠해 보세요."
        stats={[
          { k:"전체 평균 경쟁률", v:"84 :1" },
          { k:"서울 평균", v:Math.round(avg("seoul"))+" :1" },
          { k:"최고 경쟁률", v:Math.max(...withRate.map(c=>c.rate)).toFixed(0)+" :1" },
          { k:"특공 평균 비중", v:"45%" },
        ]}/>

      <div className="wrap" style={{padding:"24px 0 10px",display:"flex",flexDirection:"column",gap:"20px"}}>
        {/* 지역 평균 + 단지 랭킹 */}
        <div className="grid-2">
          <div className="card card-pad">
            <PanelHead title="지역별 평균 경쟁률"/>
            <CompetitionBars rows={regionAvg} max={maxAvg}/>
            <hr className="divider"/>
            <div style={{fontSize:"12.5px",color:"var(--ink-soft)",lineHeight:1.6}}>
              서울 단지의 평균 경쟁률이 수도권의 <b style={{color:"var(--brown)"}}>약 {(avg("seoul")/avg("metro")).toFixed(1)}배</b>로,
              중요도 순위(서울 › 수도권 › 지방)와 동일한 흐름을 보입니다.
            </div>
          </div>
          <div className="card card-pad">
            <PanelHead title="단지별 경쟁률 순위"/>
            <CompetitionBars rows={rank} max={maxRank}/>
          </div>
        </div>

        {/* 단지 선택 → 주택형별 + 특공 */}
        <div className="card card-pad">
          <div className="wrap-row" style={{justifyContent:"space-between",marginBottom:"16px"}}>
            <h3 className="h-section">단지 상세 · 주택형별 경쟁률 / 특별공급</h3>
            <select value={selId} onChange={e=>setSelId(e.target.value)}
              style={{fontFamily:"inherit",fontSize:"13.5px",fontWeight:700,color:"var(--brown)",padding:"8px 12px",borderRadius:"9px",border:"1px solid var(--line-strong)",background:"var(--card)"}}>
              {list.map(c=> <option key={c.id} value={c.id}>{c.name}{c.rate?"":" (예정)"}</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--brown-soft)",marginBottom:"12px"}}>주택형별 경쟁률</div>
              {typeRows.length
                ? <CompetitionBars rows={typeRows} max={maxType}/>
                : <div style={{fontSize:"13px",color:"var(--ink-soft)",padding:"18px 0"}}>예정 단지로 아직 경쟁률이 집계되지 않았습니다.</div>}
            </div>
            <div>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--brown-soft)",marginBottom:"12px"}}>특별공급 유형 구성</div>
              <SpecialSupply ss={sel.ss}/>
            </div>
          </div>
          <hr className="divider"/>
          <div className="wrap-row" style={{gap:"26px"}}>
            <div><div style={{fontSize:"12px",fontWeight:700,color:"var(--brown-soft)"}}>총 공급</div><div className="num" style={{fontSize:"19px",fontWeight:700,color:"var(--brown)"}}>{sel.units.toLocaleString()}세대</div></div>
            <div><div style={{fontSize:"12px",fontWeight:700,color:"var(--brown-soft)"}}>특별공급</div><div className="num" style={{fontSize:"19px",fontWeight:700,color:"var(--brown)"}}>{sel.special}세대</div></div>
            <div><div style={{fontSize:"12px",fontWeight:700,color:"var(--brown-soft)"}}>일반공급</div><div className="num" style={{fontSize:"19px",fontWeight:700,color:"var(--brown)"}}>{sel.general}세대</div></div>
            <div><div style={{fontSize:"12px",fontWeight:700,color:"var(--brown-soft)"}}>분양가 {sel.area}</div><div className="num" style={{fontSize:"19px",fontWeight:700,color:"var(--gold-deep)"}}>{sel.price}억</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ 3) 분양정보 ============ */
function ListingsPage({ region, go }){
  const D = window.APP_DATA;
  const [sort, setSort] = React.useState("importance");
  let list = D.COMPLEXES.filter(c=> region==="all"||c.region===region);
  if(sort==="importance") list = sortByImportance(list);
  if(sort==="price-hi") list = list.slice().sort((a,b)=>b.price-a.price);
  if(sort==="price-lo") list = list.slice().sort((a,b)=>a.price-b.price);
  if(sort==="units")    list = list.slice().sort((a,b)=>b.units-a.units);
  if(sort==="deadline") list = list.slice().sort((a,b)=> a.receiptEnd.localeCompare(b.receiptEnd));

  const sorts = [
    {k:"importance",label:"중요도순"},{k:"deadline",label:"마감임박순"},
    {k:"price-hi",label:"분양가↓"},{k:"price-lo",label:"분양가↑"},{k:"units",label:"세대수"},
  ];
  return (
    <div>
      <PageBand go={go} crumb="분양정보" title="분양정보"
        lead="진행 중·예정 단지의 분양가, 공급 규모, 접수·입주 일정을 카드로 둘러봅니다. 서울 → 수도권 → 지방 순으로 정렬됩니다."
        stats={[
          { k:"전체 단지", v:list.length+"개" },
          { k:"평균 분양가 84㎡", v:(list.reduce((a,c)=>a+c.price,0)/list.length).toFixed(1)+"억" },
          { k:"총 공급세대", v:list.reduce((a,c)=>a+c.units,0).toLocaleString()+"세대" },
        ]}/>

      <div className="wrap" style={{padding:"22px 0 10px"}}>
        <div className="wrap-row" style={{justifyContent:"space-between",marginBottom:"16px"}}>
          <div className="kr-eyebrow">{region==="all"?"전체 지역":D.REGIONS[region].label} · {list.length}개 단지</div>
          <div className="lswitch">
            {sorts.map(s=> <button key={s.k} className={sort===s.k?"on":""} onClick={()=>setSort(s.k)}>{s.label}</button>)}
          </div>
        </div>
        <div className="grid-4">
          {list.map(c=> <ListingCard key={c.id} c={c} go={go}/>)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SubscriptionsPage, CompetitionPage, ListingsPage });
