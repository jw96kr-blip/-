// 분양정보 조회 서비스
export interface Listing {
  houseNm: string;         // 주택명
  houseManageNo: string;   // 주택관리번호
  rceptBgnde: string;      // 청약접수 시작일
  rceptEndde: string;      // 청약접수 종료일
  hssplyAdres: string;     // 공급위치
  totSuplyHshldco: number; // 공급세대수 합계
  sttusNm?: string;        // 상태명
  houseSecd?: string;      // 주택구분코드
  houseSecdNm?: string;    // 주택구분명
  rentSecdNm?: string;     // 분양/임대 구분
}

// 경쟁률 조회 - ApplyhomeInfoCmpetRtSvc
export interface CompetitionRate {
  houseNm: string;         // 주택명
  houseManageNo: string;
  suplyTyNm?: string;      // 공급유형명
  suplyHshldco?: number;   // 공급세대수
  rceptHshldco?: number;   // 청약접수 세대수
  compRate?: string;       // 경쟁률 (문자열 "X.XX" 형태)
  CMPT_RATE?: string;      // API에 따라 필드명 다를 수 있음
  SUPLY_HSHLDCO?: number;
  RCEPT_HSHLDCO?: number;
  HOUSE_NM?: string;
  rceptBgnde?: string;
  rceptEndde?: string;
}

// 특별공급 신청현황
export interface SpecialSupply {
  houseNm: string;
  houseManageNo: string;
  spsplyHshldco?: number;         // 특별공급 세대수
  mhouseHoldRceptHshldco?: number; // 다자녀 청약접수 세대수
  nwwdsRceptHshldco?: number;     // 신혼부부 청약접수 세대수
  firstCritnc?: number;           // 생애최초 청약접수
  oldprntsSptRceptHshldco?: number; // 노부모부양 청약접수
  insttRecomendRceptHshldco?: number; // 기관추천 청약접수
  etcRceptHshldco?: number;       // 기타 청약접수
  rceptBgnde?: string;
  rceptEndde?: string;
}

// 청약 당첨자 통계 (지역별) - ApplyhomeStatSvc
export interface SubscriptionWinner {
  rnum?: number;           // 순번
  sido: string;            // 시도
  sgg?: string;            // 시군구
  lttotPblancNm?: string;  // 청약공고명
  przwnerCo?: number;      // 당첨자수
  rceptNmpr?: number;      // 청약접수인원
  suplyHshldco?: number;   // 공급세대수
  lttotPblancDe?: string;  // 청약공고일
  przwnerPresnatnDe?: string; // 당첨자발표일
}

export interface ApiResponse<T> {
  items: T[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}
