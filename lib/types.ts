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

// 경쟁률 및 특별공급 신청현황
export interface CompetitionRate {
  houseNm: string;         // 주택명
  houseManageNo: string;
  suplyTyNm: string;       // 공급유형명
  suplyHshldco: number;    // 공급세대수
  rceptHshldco: number;    // 청약접수 세대수
  compRate: string;        // 경쟁률
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

// 청약 신청·당첨자 정보
export interface SubscriptionWinner {
  houseNm: string;
  houseManageNo: string;
  suplyTyNm: string;       // 공급유형명
  drwtHshldco: number;     // 당첨세대수
  mnmScre?: number;        // 최저당첨 가점
  mxmScre?: number;        // 최고당첨 가점
  avrgScre?: number;       // 평균당첨 가점
  rceptBgnde?: string;
  rceptEndde?: string;
}

export interface ApiResponse<T> {
  items: T[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}
