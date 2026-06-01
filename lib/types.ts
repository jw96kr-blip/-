// ─── 분양정보 상세 ──────────────────────────────────────────────────────────────
// ApplyhomeInfoDetailSvc/getAPTLttotPblancDetail
export interface Listing {
  HOUSE_NM: string;
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  RCEPT_BGNDE?: string;            // 청약접수 시작일 YYYY-MM-DD
  RCEPT_ENDDE?: string;            // 청약접수 종료일
  SPSPLY_RCEPT_BGNDE?: string;     // 특별공급 접수 시작일
  SPSPLY_RCEPT_ENDDE?: string;     // 특별공급 접수 종료일
  HSSPLY_ADRES?: string;           // 공급위치
  HSSPLY_ZIP?: string;             // 우편번호
  TOT_SUPLY_HSHLDCO?: number;      // 공급세대수 합계
  RENT_SECD_NM?: string;           // 분양주택/임대주택
  HOUSE_SECD?: string;             // 주택구분코드
  HOUSE_SECD_NM?: string;          // APT 등
  HOUSE_DTL_SECD?: string;
  HOUSE_DTL_SECD_NM?: string;      // 민영/국민
  SUBSCRPT_AREA_CODE?: string;
  SUBSCRPT_AREA_CODE_NM?: string;  // 지역명
  PRZWNER_PRESNATN_DE?: string;    // 당첨자 발표일
  CNTRCT_CNCLS_BGNDE?: string;     // 계약 시작일
  CNTRCT_CNCLS_ENDDE?: string;     // 계약 종료일
  MVN_PREARNGE_YM?: string;        // 입주예정월 YYYYMM
  BSNS_MBY_NM?: string;            // 사업주체명 (시행사)
  CNSTRCT_ENTRPS_NM?: string;      // 건설업체명 (시공사)
  MDHS_TELNO?: string;             // 문의처
  HMPG_ADRES?: string;             // 홈페이지 주소
  PBLANC_URL?: string;             // 청약홈 공고 상세 URL
  RCRIT_PBLANC_DE?: string;        // 모집공고일
  NSPRC_NM?: string;               // 신문사
  PARCPRC_ULS_AT?: string;         // 분양가상한제 Y/N
  SPECLT_RDN_EARTH_AT?: string;    // 투기과열지구 Y/N
  MDAT_TRGET_AREA_SECD?: string;   // 조정대상지역 Y/N
  PUBLIC_HOUSE_EARTH_AT?: string;  // 공공주택지구 Y/N
}

// ─── 주택형별 분양정보 (분양가) ─────────────────────────────────────────────────
// ApplyhomeInfoDetailSvc/getAPTLttotPblancMdl
export interface ListingModel {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  MODEL_NO?: string;
  HOUSE_TY?: string;               // 주택형 (예: 084.9124A)
  SUPLY_AR?: string;               // 공급면적
  SUPLY_HSHLDCO?: number;          // 일반공급세대수
  SPSPLY_HSHLDCO?: number;         // 특별공급세대수
  LTTOT_TOP_AMOUNT?: string;       // 분양최고금액 (단위: 만원)
  MNYCH_HSHLDCO?: number;
  NWWDS_HSHLDCO?: number;
  LFE_FRST_HSHLDCO?: number;
  OLD_PARNTS_SUPORT_HSHLDCO?: number;
  INSTT_RECOMEND_HSHLDCO?: number;
  YGMN_HSHLDCO?: number;
  NWBB_HSHLDCO?: number;           // 신생아
}

// ─── 경쟁률 ─────────────────────────────────────────────────────────────────────
// ApplyhomeInfoCmpetRtSvc/getAPTLttotPblancCmpet
export interface CompetitionRate {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  MODEL_NO?: string;
  HOUSE_TY?: string;
  CMPET_RATE?: string;             // 경쟁률 문자열 ("401.00", "-", "(△61)")
  SUPLY_HSHLDCO?: number;
  REQ_CNT?: string;
  RESIDE_SECD?: string;            // 01=해당지역 02=기타지역
  RESIDE_SENM?: string;
  SUBSCRPT_RANK_CODE?: number;     // 1순위/2순위
}

// ─── 당첨가점 ────────────────────────────────────────────────────────────────────
// ApplyhomeInfoCmpetRtSvc/getAptLttotPblancScore
export interface WinningScore {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  MODEL_NO?: string;
  HOUSE_TY?: string;
  RESIDE_SECD?: string;
  RESIDE_SENM?: string;
  LWET_SCORE?: string;             // 최저당첨가점
  TOP_SCORE?: string;              // 최고당첨가점
  AVRG_SCORE?: string;             // 평균당첨가점
}

// ─── 특별공급 신청현황 ───────────────────────────────────────────────────────────
// ApplyhomeInfoCmpetRtSvc/getAPTSpsplyReqstStus
export interface SpecialSupply {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  HOUSE_TY?: string;
  SPSPLY_HSHLDCO?: number;
  MNYCH_HSHLDCO?: number;
  NWWDS_NMTW_HSHLDCO?: number;
  LFE_FRST_HSHLDCO?: number;
  OLD_PARNTS_SUPORT_HSHLDCO?: number;
  INSTT_RECOMEND_HSHLDCO?: number;
  YGMN_HSHLDCO?: number;
  SUBSCRPT_RESULT_NM?: string;
}

// ─── 지역별 가점제 당첨자 ───────────────────────────────────────────────────────
// ApplyhomeStatSvc/getAPTApsPrzwnerStat
export interface SubscriptionWinner {
  STAT_DE?: string;                // YYYYMM
  SUBSCRPT_AREA_CODE?: string;
  SUBSCRPT_AREA_CODE_NM?: string;
  RESIDE_SECD?: string;
  RESIDE_SECD_NM?: string;
  AVRG_SCORE?: number;             // 평균 가점
  MED_SCORE?: number;              // 중위 가점
  TOP_SCORE?: number;              // 최고 가점
  LWET_SCROE?: number;             // 최저 가점
  // 연령별 필드 (getAPTPrzwnerAreaStat fallback)
  AGE_30?: number;
  AGE_40?: number;
  AGE_50?: number;
  AGE_60?: number;
}

export interface ApiResponse<T> {
  items: T[];
  totalCount: number;   // cond 무관 전체 DB 크기 — KPI에 쓰지 말 것
  matchCount: number;   // 필터 적용 후 실제 결과 수 — KPI/페이지네이션에 사용
  pageNo: number;
  numOfRows: number;
}
