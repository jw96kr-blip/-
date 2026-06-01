/* ============================================================
   공통 컴포넌트 + 아이콘  (window 전역으로 export)
   ============================================================ */

/* ---------- 아이콘 (단순 라인 아이콘) ---------- */
const Icon = {
  cal: (p)=> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>,
  bell:(p)=> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>,
  search:(p)=> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>,
  chev:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 6 6 6-6 6"/></svg>,
  up:(p)=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 14l7-7 7 7"/></svg>,
  dn:(p)=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 10l7 7 7-7"/></svg>,
  pin:(p)=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  bldg:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></svg>,
  users:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>,
  trophy:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>,
  bolt:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>,
  doc:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>,
  star:(p)=> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>,
};
window.Icon = Icon;

/* ---------- 상태 배지 ---------- */
function StatusBadge({ status }){
  if(status==="live")   return <span className="badge live"><span className="pip"></span>접수중</span>;
  if(status==="soon")   return <span className="badge soon"><span className="pip"></span>예정</span>;
  return <span className="badge closed"><span className="pip"></span>마감</span>;
}
function RegionTag({ region }){
  const D = window.APP_DATA.REGIONS[region];
  return <span className={"tag "+D.tag}>{D.label}</span>;
}
window.StatusBadge = StatusBadge;
window.RegionTag = RegionTag;

/* ---------- 헤더 ---------- */
function Header({ route, go, today }){
  const nav = [
    { k:"dashboard",    label:"대시보드" },
    { k:"subscriptions",label:"청약 신청·당첨" },
    { k:"competition",  label:"경쟁률·특별공급" },
    { k:"listings",     label:"분양정보" },
  ];
  return (
    <header className="hdr">
      <div className="wrap hdr-row">
        <div className="brand" onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>
          <div className="brand-mark">청</div>
          <div>
            <div className="brand-name">청약 라운지</div>
            <div className="brand-sub">SUBSCRIPTION DASHBOARD</div>
          </div>
        </div>
        <nav className="nav">
          {nav.map(n=>(
            <a key={n.k} className={"nav-link"+(route===n.k?" on":"")} onClick={()=>go(n.k)}>{n.label}</a>
          ))}
        </nav>
        <div className="hdr-right">
          <span className="hdr-date"><b>{today}</b> 기준</span>
          <button className="icon-btn" title="검색">{Icon.search()}</button>
          <button className="icon-btn" title="알림">{Icon.bell()}</button>
        </div>
      </div>
    </header>
  );
}
window.Header = Header;

/* ---------- 지역 필터 바 ---------- */
function RegionBar({ value, onChange, counts }){
  const R = window.APP_DATA.REGIONS;
  const items = [
    { key:"all", label:"전체" },
    { key:"seoul", label:"서울" },
    { key:"metro", label:"수도권" },
    { key:"local", label:"지방" },
  ];
  return (
    <div className="regionbar">
      <div className="wrap regionbar-row scroll-x">
        {items.map(it=>(
          <button key={it.key} className={"region-chip"+(value===it.key?" on":"")} onClick={()=>onChange(it.key)}>
            {it.key!=="all" && <span className="dot"></span>}
            {it.label}
            <span className="cnt">{counts[it.key]}</span>
          </button>
        ))}
        <span className="spacer"></span>
        <span style={{fontSize:"12px",fontWeight:700,color:"var(--brown-soft)",paddingRight:"4px",whiteSpace:"nowrap"}}>
          중요도순 · 서울 › 수도권 › 지방
        </span>
      </div>
    </div>
  );
}
window.RegionBar = RegionBar;

/* ---------- 요약 카드 ---------- */
function SummaryCards({ data }){
  const icons = { live:Icon.bolt, soon:Icon.cal, new:Icon.doc, rate:Icon.trophy };
  return (
    <div className="summary-grid">
      {data.map((s,i)=>(
        <div key={s.key} className={"scard"+(i%2?" alt":"")}>
          <div className="scard-label">{icons[s.key] && icons[s.key]({style:{color:"var(--gold-deep)"}})}{s.label}</div>
          <div className="scard-num num">{s.value}<small>{s.unit}</small></div>
          <div className="scard-foot">
            {s.dir==="up" && <span className="up" style={{display:"inline-flex",alignItems:"center",gap:"2px"}}>{Icon.up()}{s.foot}</span>}
            {s.dir==="flat" && <span style={{color:"var(--brown-soft)"}}>{s.foot}</span>}
            <span style={{color:"var(--ink-soft)",marginLeft:"6px",fontWeight:400}}>· {s.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
window.SummaryCards = SummaryCards;

/* ---------- 일정 리스트 아이템 ---------- */
function ScheduleItem({ c, go }){
  const [mon,day] = c.receiptStart.split(".");
  return (
    <div className="sched-item" onClick={()=>go("subscriptions")}>
      <div className="sched-date">
        <div className="sched-day num">{day}</div>
        <div className="sched-mon">{mon}월</div>
      </div>
      <div className="sched-body">
        <div className="sched-name">{c.name}</div>
        <div className="sched-meta">
          <RegionTag region={c.region}/>
          <span>{Icon.pin({style:{verticalAlign:"-2px",opacity:.6}})} {c.gu}</span>
          <span>· {c.units.toLocaleString()}세대</span>
        </div>
      </div>
      <div style={{textAlign:"right",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"}}>
        <StatusBadge status={c.status}/>
        <span style={{fontSize:"12.5px",fontWeight:700,color:"var(--gold-deep)"}} className="num">{c.price}억~</span>
      </div>
    </div>
  );
}
window.ScheduleItem = ScheduleItem;

/* ---------- 경쟁률 바 (가로) ---------- */
function CompetitionBars({ rows, max }){
  return (
    <div className="cbar-wrap">
      {rows.map(r=>(
        <div className="cbar" key={r.id||r.name}>
          <div className="cbar-name" title={r.name}>{r.name}</div>
          <div className="cbar-track">
            <div className={"cbar-fill"+(r.region==="metro"||r.region==="local"?" metro":"")} style={{width:Math.max(4,(r.rate/max)*100)+"%"}}></div>
          </div>
          <div className="cbar-val num">{r.rate ? r.rate.toFixed(1) : "–"}{r.rate?" :1":""}</div>
        </div>
      ))}
    </div>
  );
}
window.CompetitionBars = CompetitionBars;

/* ---------- 특별공급 분포 ---------- */
function SpecialSupply({ ss }){
  const T = window.APP_DATA.SS_TYPES;
  const total = T.reduce((a,t)=>a+(ss[t.key]||0),0);
  return (
    <div>
      <div style={{display:"flex",height:"12px",borderRadius:"999px",overflow:"hidden",marginBottom:"14px"}}>
        {T.map(t=> <div key={t.key} style={{width:((ss[t.key]||0)/total*100)+"%",background:t.color}}></div>)}
      </div>
      {T.map(t=>(
        <div className="ss-row" key={t.key}>
          <span className="ss-key"><span style={{display:"inline-block",width:"8px",height:"8px",borderRadius:"3px",background:t.color,marginRight:"7px",verticalAlign:"1px"}}></span>{t.label}</span>
          <span className="ss-track"><span className="ss-fill" style={{width:((ss[t.key]||0)/total*100)+"%",background:t.color}}></span></span>
          <span className="ss-val num">{Math.round((ss[t.key]||0)/total*100)}%</span>
        </div>
      ))}
    </div>
  );
}
window.SpecialSupply = SpecialSupply;

/* ---------- 분양 카드 ---------- */
function ListingCard({ c, go }){
  return (
    <div className="lcard" onClick={()=>go("listings")}>
      <div className="lcard-img">
        <span className="ph">단지 투시도</span>
        <StatusBadge status={c.status}/>
      </div>
      <div className="lcard-body">
        <div className="wrap-row" style={{gap:"6px"}}>
          <RegionTag region={c.region}/>
          <span style={{fontSize:"11.5px",color:"var(--ink-soft)",fontWeight:700}}>{c.type}</span>
        </div>
        <div className="lcard-title">{c.name}</div>
        <div style={{fontSize:"12.5px",color:"var(--ink-soft)"}}>{Icon.pin({style:{verticalAlign:"-2px",opacity:.6}})} {c.gu}</div>
        <div className="lcard-meta">
          <span><b>{c.units.toLocaleString()}</b>세대</span>
          <span>입주 <b>{c.move}</b></span>
          <span>접수 <b>{c.receiptStart}~{c.receiptEnd}</b></span>
        </div>
        <div className="row" style={{justifyContent:"space-between",marginTop:"2px"}}>
          <span className="lcard-price num">{c.price}억<span style={{fontSize:"12px",color:"var(--ink-soft)",fontWeight:400}}> / {c.area}</span></span>
          <span style={{fontSize:"12.5px",fontWeight:700,color:"var(--gold-deep)",display:"inline-flex",alignItems:"center",gap:"2px"}}>자세히{Icon.chev()}</span>
        </div>
      </div>
    </div>
  );
}
window.ListingCard = ListingCard;

/* ---------- 작은 통계 ---------- */
function Gauge({ value, max, label, sub }){
  const pct = Math.min(100, value/max*100);
  return (
    <div>
      <div className="row" style={{justifyContent:"space-between",marginBottom:"6px"}}>
        <span style={{fontSize:"13px",fontWeight:700,color:"var(--ink)"}}>{label}</span>
        <span className="num" style={{fontSize:"13px",fontWeight:700,color:"var(--brown)"}}>{sub}</span>
      </div>
      <div className="ss-track"><span className="ss-fill" style={{width:pct+"%",background:"linear-gradient(90deg,var(--gold),var(--gold-deep))"}}></span></div>
    </div>
  );
}
window.Gauge = Gauge;

/* ---------- 패널 헤더 ---------- */
function PanelHead({ title, more, onMore }){
  return (
    <div className="panel-head">
      <h3 className="h-section">{title}</h3>
      {more && <a className="more" onClick={onMore}>{more}{Icon.chev()}</a>}
    </div>
  );
}
window.PanelHead = PanelHead;

Object.assign(window, { Icon, StatusBadge, RegionTag, Header, RegionBar, SummaryCards, ScheduleItem, CompetitionBars, SpecialSupply, ListingCard, Gauge, PanelHead });
