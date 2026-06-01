// 분양정보 - ApplyhomeInfoDetailSvc/getAPTLttotPblancDetail
export interface Listing {
  HOUSE_NM: string;
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  RCEPT_BGNDE?: string;          // YYYY-MM-DD
  RCEPT_ENDDE?: string;
  HSSPLY_ADRES?: string;
  TOT_SUPLY_HSHLDCO?: number;
  RENT_SECD_NM?: string;         // 분양주택/임대주택
  HOUSE_SECD_NM?: string;        // APT 등
  HOUSE_DTL_SECD_NM?: string;    // 민영/국민 등
  SUBSCRPT_AREA_CODE_NM?: string; // 지역
  PRZWNER_PRESNATN_DE?: string;  // 당첨자 발표일
}

// 경쟁률 - ApplyhomeInfoCmpetRtSvc/getAPTLttotPblancCmpet
export interface CompetitionRate {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  HOUSE_TY?: string;             // 평형 (예: 084.9124A)
  CMPET_RATE?: string;           // 경쟁률 (예: "1.50", "(△61)")
  SUPLY_HSHLDCO?: number;        // 공급세대수
  REQ_CNT?: string;              // 청약접수 건수
  RESIDE_SENM?: string;          // 해당지역/기타지역
  SUBSCRPT_RANK_CODE?: number;   // 청약 순위 (1순위/2순위)
}

// 특별공급 - ApplyhomeInfoCmpetRtSvc/getAPTSpsplyReqstStus
export interface SpecialSupply {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO?: string;
  HOUSE_TY?: string;
  SPSPLY_HSHLDCO?: number;             // 특별공급 세대수
  MNYCH_HSHLDCO?: number;              // 다자녀
  NWWDS_NMTW_HSHLDCO?: number;        // 신혼부부
  LFE_FRST_HSHLDCO?: number;          // 생애최초
  OLD_PARNTS_SUPORT_HSHLDCO?: number; // 노부모부양
  INSTT_RECOMEND_HSHLDCO?: number;    // 기관추천
  YGMN_HSHLDCO?: number;             // 청년
  SUBSCRPT_RESULT_NM?: string;        // 청약접수 종료 등
}

// 당첨자 지역별 통계 - ApplyhomeStatSvc/getAPTPrzwnerAreaStat
export interface SubscriptionWinner {
  STAT_DE?: string;                  // 통계연월 (YYYYMM)
  SUBSCRPT_AREA_CODE?: string;
  SUBSCRPT_AREA_CODE_NM?: string;    // 지역명
  AGE_30?: number;                   // 30대 당첨자수
  AGE_40?: number;
  AGE_50?: number;
  AGE_60?: number;
}

export interface ApiResponse<T> {
  items: T[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}
