/* ============================================================
   청약 대시보드 — 가상 샘플 데이터
   * 모든 단지/수치는 데모용 가상 데이터입니다 (실제 단지 아님)
   * 지역 중요도: 서울(1) > 수도권(2) > 지방(3)
   ============================================================ */
window.APP_DATA = (function(){
  // region meta
  const REGIONS = {
    seoul: { key:"seoul", label:"서울",   tag:"seoul", rank:1 },
    metro: { key:"metro", label:"수도권", tag:"metro", rank:2 },
    local: { key:"local", label:"지방",   tag:"local", rank:3 },
  };

  // 단지 마스터 (status: live 접수중 / soon 예정 / closed 마감)
  const COMPLEXES = [
    {
      id:"seocho-grande", name:"서초 그란데르 위브", region:"seoul", gu:"서초구 반포동",
      status:"live", price:18.4, area:"84㎡", units:642, special:286, general:356,
      receiptStart:"06.02", receiptEnd:"06.04", announce:"06.11", move:"2028.09",
      rate:124.6, cutScore:69, builder:"위브건설", type:"민영",
      types:[
        {name:"59㎡A", units:120, rate:188.2}, {name:"74㎡", units:158, rate:142.0},
        {name:"84㎡A", units:201, rate:118.4}, {name:"84㎡B", units:163, rate:97.5},
      ],
      ss:{ first:34, newly:28, multi:18, parent:8, region:12 },
      featured:true,
    },
    {
      id:"cheongdam-lumi", name:"청담 루미에르", region:"seoul", gu:"강남구 청담동",
      status:"live", price:24.9, area:"84㎡", units:284, special:112, general:172,
      receiptStart:"06.02", receiptEnd:"06.03", announce:"06.10", move:"2028.05",
      rate:212.3, cutScore:74, builder:"한신스페이스", type:"민영",
      types:[
        {name:"72㎡", units:84, rate:256.0}, {name:"84㎡", units:120, rate:209.4},
        {name:"101㎡", units:80, rate:171.6},
      ],
      ss:{ first:26, newly:24, multi:20, parent:10, region:20 },
    },
    {
      id:"mapo-river", name:"마포 리버센트럴", region:"seoul", gu:"마포구 아현동",
      status:"soon", price:14.2, area:"84㎡", units:512, special:228, general:284,
      receiptStart:"06.09", receiptEnd:"06.11", announce:"06.18", move:"2028.03",
      rate:null, cutScore:null, builder:"센트럴디앤씨", type:"민영",
      types:[
        {name:"59㎡", units:160, rate:null}, {name:"74㎡", units:152, rate:null},
        {name:"84㎡", units:200, rate:null},
      ],
      ss:{ first:32, newly:30, multi:16, parent:8, region:14 },
    },
    {
      id:"yongsan-parkone", name:"용산 파크원 더힐", region:"seoul", gu:"용산구 한강로",
      status:"soon", price:21.0, area:"84㎡", units:198, special:74, general:124,
      receiptStart:"06.16", receiptEnd:"06.18", announce:"06.25", move:"2028.11",
      rate:null, cutScore:null, builder:"파크원개발", type:"민영",
      types:[
        {name:"84㎡", units:110, rate:null}, {name:"110㎡", units:88, rate:null},
      ],
      ss:{ first:24, newly:22, multi:22, parent:12, region:20 },
    },
    {
      id:"dongjak-forena", name:"동작 흑석 포레나", region:"seoul", gu:"동작구 흑석동",
      status:"closed", price:15.8, area:"84㎡", units:326, special:138, general:188,
      receiptStart:"05.26", receiptEnd:"05.28", announce:"06.04", move:"2027.12",
      rate:88.4, cutScore:64, builder:"포레나건설", type:"민영",
      types:[
        {name:"59㎡", units:120, rate:104.2}, {name:"84㎡", units:206, rate:78.9},
      ],
      ss:{ first:36, newly:26, multi:18, parent:8, region:12 },
    },

    {
      id:"gwangmyeong-hills", name:"광명 포레힐스", region:"metro", gu:"경기 광명시 철산동",
      status:"live", price:9.6, area:"84㎡", units:874, special:402, general:472,
      receiptStart:"06.03", receiptEnd:"06.05", announce:"06.12", move:"2028.06",
      rate:38.7, cutScore:58, builder:"대원에스티", type:"민영",
      types:[
        {name:"59㎡", units:280, rate:52.4}, {name:"74㎡", units:240, rate:41.0},
        {name:"84㎡", units:354, rate:29.8},
      ],
      ss:{ first:38, newly:32, multi:14, parent:6, region:10 },
    },
    {
      id:"gwacheon-proud", name:"과천 그랜드프라우드", region:"metro", gu:"경기 과천시 별양동",
      status:"live", price:13.4, area:"84㎡", units:436, special:196, general:240,
      receiptStart:"06.02", receiptEnd:"06.04", announce:"06.11", move:"2028.08",
      rate:74.2, cutScore:63, builder:"프라우드건설", type:"민영",
      types:[
        {name:"74㎡", units:160, rate:96.1}, {name:"84㎡", units:200, rate:68.3},
        {name:"99㎡", units:76, rate:52.0},
      ],
      ss:{ first:30, newly:28, multi:18, parent:10, region:14 },
    },
    {
      id:"dongtan-lakeedu", name:"동탄 레이크에듀포레", region:"metro", gu:"경기 화성시 동탄2",
      status:"soon", price:7.2, area:"84㎡", units:1248, special:586, general:662,
      receiptStart:"06.10", receiptEnd:"06.12", announce:"06.19", move:"2028.04",
      rate:null, cutScore:null, builder:"에듀포레개발", type:"민영",
      types:[
        {name:"74㎡", units:420, rate:null}, {name:"84㎡", units:560, rate:null},
        {name:"96㎡", units:268, rate:null},
      ],
      ss:{ first:40, newly:34, multi:12, parent:6, region:8 },
    },
    {
      id:"wirye-first", name:"위례 더퍼스트", region:"metro", gu:"경기 성남시 위례",
      status:"soon", price:10.8, area:"84㎡", units:592, special:268, general:324,
      receiptStart:"06.17", receiptEnd:"06.19", announce:"06.26", move:"2028.07",
      rate:null, cutScore:null, builder:"퍼스트하우징", type:"민영",
      types:[
        {name:"84㎡", units:360, rate:null}, {name:"101㎡", units:232, rate:null},
      ],
      ss:{ first:34, newly:30, multi:16, parent:8, region:12 },
    },
    {
      id:"geomdan-central", name:"검단 센트럴파크", region:"metro", gu:"인천 서구 검단신도시",
      status:"closed", price:5.9, area:"84㎡", units:968, special:454, general:514,
      receiptStart:"05.27", receiptEnd:"05.29", announce:"06.05", move:"2027.11",
      rate:12.4, cutScore:49, builder:"센트럴주택", type:"민영",
      types:[
        {name:"74㎡", units:380, rate:18.6}, {name:"84㎡", units:588, rate:8.2},
      ],
      ss:{ first:42, newly:30, multi:14, parent:6, region:8 },
    },

    {
      id:"sejong-river", name:"세종 리버뷰 데시앙", region:"local", gu:"세종시 다정동",
      status:"live", price:5.1, area:"84㎡", units:724, special:336, general:388,
      receiptStart:"06.03", receiptEnd:"06.05", announce:"06.12", move:"2028.05",
      rate:9.8, cutScore:44, builder:"데시앙건설", type:"민영",
      types:[
        {name:"74㎡", units:300, rate:14.2}, {name:"84㎡", units:424, rate:6.9},
      ],
      ss:{ first:40, newly:28, multi:16, parent:6, region:10 },
    },
    {
      id:"busan-marine", name:"부산 마린시티 자이르", region:"local", gu:"부산 해운대구",
      status:"soon", price:8.4, area:"84㎡", units:388, special:172, general:216,
      receiptStart:"06.16", receiptEnd:"06.18", announce:"06.25", move:"2028.09",
      rate:null, cutScore:null, builder:"마린개발", type:"민영",
      types:[
        {name:"84㎡", units:220, rate:null}, {name:"114㎡", units:168, rate:null},
      ],
      ss:{ first:28, newly:24, multi:18, parent:10, region:20 },
    },
  ];

  // KPI 요약 (오늘 기준)
  const TODAY = "2026.06.01";
  const SUMMARY = [
    { key:"live",   label:"오늘 접수중",     value:5,  unit:"개 단지", foot:"+2", dir:"up",  note:"어제 대비" },
    { key:"soon",   label:"이번주 마감 임박", value:3,  unit:"건",      foot:"06.04 마감", dir:"flat", note:"서초·청담·과천" },
    { key:"new",    label:"신규 분양 공고",   value:4,  unit:"건",      foot:"+1", dir:"up",  note:"이번주 게시" },
    { key:"rate",   label:"평균 경쟁률",      value:84, unit:":1",      foot:"+11", dir:"up", note:"서울 평균 152:1" },
  ];

  // 특별공급 유형 라벨 + 색
  const SS_TYPES = [
    { key:"first",  label:"생애최초", color:"#C69860" },
    { key:"newly",  label:"신혼부부", color:"#A88A5C" },
    { key:"multi",  label:"다자녀",   color:"#8A8E73" },
    { key:"parent", label:"노부모부양", color:"#B0A88E" },
    { key:"region", label:"기관·기타", color:"#CFC8B6" },
  ];

  return { REGIONS, COMPLEXES, SUMMARY, SS_TYPES, TODAY };
})();
