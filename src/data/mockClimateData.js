// 경기도 주요 공원 및 기후 쉼터 데이터
export const greenLocations = [
  {
    id: 1,
    name: "광교 호수공원",
    lat: 37.283,
    lng: 127.062,
    type: "PARK",
    score: 92,
    details: {
      pm10Reduction: 85, // 미세먼지 저감 등급 (0-100)
      carbonAbsorption: 2.4, // 탄소 흡수량 (톤/년)
      thermalComfort: 88, // 열쾌적성 등급 (0-100)
      greenCoverage: 75, // 녹지 면적 비율 (%)
    }
  },
  {
    id: 2,
    name: "인계동 무더위쉼터",
    lat: 37.266,
    lng: 127.030,
    type: "SHELTER",
    score: 75,
    details: {
      pm10Reduction: 70,
      carbonAbsorption: 1.2,
      thermalComfort: 82,
      greenCoverage: 45,
    }
  },
  {
    id: 3,
    name: "수원천 산책로",
    lat: 37.263,
    lng: 127.028,
    type: "TRAIL",
    score: 88,
    details: {
      pm10Reduction: 80,
      carbonAbsorption: 1.8,
      thermalComfort: 90,
      greenCoverage: 65,
    }
  },
  {
    id: 4,
    name: "영통 중앙공원",
    lat: 37.257,
    lng: 127.073,
    type: "PARK",
    score: 86,
    details: {
      pm10Reduction: 82,
      carbonAbsorption: 2.1,
      thermalComfort: 85,
      greenCoverage: 70,
    }
  },
  {
    id: 5,
    name: "율전 쉼터",
    lat: 37.294,
    lng: 127.055,
    type: "SHELTER",
    score: 72,
    details: {
      pm10Reduction: 68,
      carbonAbsorption: 0.9,
      thermalComfort: 78,
      greenCoverage: 40,
    }
  },
  {
    id: 6,
    name: "청명 숲길",
    lat: 37.272,
    lng: 127.051,
    type: "TRAIL",
    score: 84,
    details: {
      pm10Reduction: 78,
      carbonAbsorption: 1.6,
      thermalComfort: 87,
      greenCoverage: 62,
    }
  },
  {
    id: 7,
    name: "망포 근린공원",
    lat: 37.244,
    lng: 127.060,
    type: "PARK",
    score: 80,
    details: {
      pm10Reduction: 75,
      carbonAbsorption: 1.5,
      thermalComfort: 83,
      greenCoverage: 58,
    }
  },
];

// 기본 위치 (경기도청)
export const defaultCenter = {
  lat: 37.275,
  lng: 127.010,
};

// 마커 타입별 정보
export const markerTypes = {
  PARK: {
    label: "공원",
    color: "#10b981", // emerald-500
    icon: "TreeDeciduous",
  },
  SHELTER: {
    label: "무더위쉼터",
    color: "#14b8a6", // teal-500
    icon: "Tent",
  },
  TRAIL: {
    label: "산책로",
    color: "#059669", // emerald-600
    icon: "Route",
  },
};

// 습관 체크리스트 데이터
export const ecoHabits = [
  { id: 1, text: "텀블러 사용하기", icon: "Coffee" },
  { id: 2, text: "대중교통 이용하기", icon: "Bus" },
  { id: 3, text: "일회용품 거절하기", icon: "ShoppingBag" },
  { id: 4, text: "장바구니 사용하기", icon: "ShoppingBasket" },
  { id: 5, text: "플러그 뽑기", icon: "Plug" },
  { id: 6, text: "계단 이용하기", icon: "TrendingUp" },
  { id: 7, text: "채식 한 끼 실천", icon: "Leaf" },
  { id: 8, text: "쓰레기 분리수거", icon: "Recycle" },
];

// 주거구역 환경 점수 데이터
// 각 구역은 폴리곤 좌표와 환경 지표를 포함
export const residentialZones = [
  {
    id: "zone-1",
    name: "광교 신도시 A구역",
    center: { lat: 37.285, lng: 127.058 },
    // 폴리곤 좌표 (시계방향)
    polygon: [
      [37.290, 127.052],
      [37.290, 127.064],
      [37.280, 127.064],
      [37.280, 127.052],
    ],
    details: {
      pm10Reduction: 88,
      carbonAbsorption: 2.8,
      thermalComfort: 90,
      greenCoverage: 72,
    },
    nearbyParks: ["광교 호수공원"],
    description: "대규모 호수공원 인접, 최상급 녹지환경",
  },
  {
    id: "zone-2",
    name: "영통구 매탄동",
    center: { lat: 37.262, lng: 127.038 },
    polygon: [
      [37.268, 127.032],
      [37.268, 127.044],
      [37.256, 127.044],
      [37.256, 127.032],
    ],
    details: {
      pm10Reduction: 72,
      carbonAbsorption: 1.4,
      thermalComfort: 78,
      greenCoverage: 48,
    },
    nearbyParks: ["인계동 무더위쉼터", "수원천 산책로"],
    description: "수원천 접근성 양호, 중밀도 주거지역",
  },
  {
    id: "zone-3",
    name: "영통 중심상업지구",
    center: { lat: 37.253, lng: 127.072 },
    polygon: [
      [37.260, 127.066],
      [37.260, 127.078],
      [37.246, 127.078],
      [37.246, 127.066],
    ],
    details: {
      pm10Reduction: 58,
      carbonAbsorption: 0.8,
      thermalComfort: 65,
      greenCoverage: 28,
    },
    nearbyParks: ["영통 중앙공원"],
    description: "상업시설 밀집, 녹지 보완 필요",
  },
  {
    id: "zone-4",
    name: "망포역 인근",
    center: { lat: 37.248, lng: 127.055 },
    polygon: [
      [37.254, 127.048],
      [37.254, 127.062],
      [37.242, 127.062],
      [37.242, 127.048],
    ],
    details: {
      pm10Reduction: 65,
      carbonAbsorption: 1.2,
      thermalComfort: 72,
      greenCoverage: 42,
    },
    nearbyParks: ["망포 근린공원"],
    description: "역세권 개발 진행 중, 녹지 확충 예정",
  },
  {
    id: "zone-5",
    name: "광교 테크노밸리",
    center: { lat: 37.278, lng: 127.048 },
    polygon: [
      [37.284, 127.042],
      [37.284, 127.054],
      [37.272, 127.054],
      [37.272, 127.042],
    ],
    details: {
      pm10Reduction: 75,
      carbonAbsorption: 1.6,
      thermalComfort: 82,
      greenCoverage: 55,
    },
    nearbyParks: ["청명 숲길"],
    description: "첨단산업단지, 옥상녹화 적극 도입",
  },
  {
    id: "zone-6",
    name: "율전동 주거단지",
    center: { lat: 37.296, lng: 127.050 },
    polygon: [
      [37.302, 127.044],
      [37.302, 127.056],
      [37.290, 127.056],
      [37.290, 127.044],
    ],
    details: {
      pm10Reduction: 82,
      carbonAbsorption: 2.0,
      thermalComfort: 85,
      greenCoverage: 62,
    },
    nearbyParks: ["율전 쉼터"],
    description: "신규 아파트 단지, 조경 우수",
  },
  {
    id: "zone-7",
    name: "인계동 구시가지",
    center: { lat: 37.270, lng: 127.025 },
    polygon: [
      [37.276, 127.018],
      [37.276, 127.032],
      [37.264, 127.032],
      [37.264, 127.018],
    ],
    details: {
      pm10Reduction: 45,
      carbonAbsorption: 0.5,
      thermalComfort: 55,
      greenCoverage: 18,
    },
    nearbyParks: [],
    description: "노후 주거지역, 도시재생 필요",
  },
  {
    id: "zone-8",
    name: "원천동 대학가",
    center: { lat: 37.298, lng: 127.038 },
    polygon: [
      [37.304, 127.032],
      [37.304, 127.044],
      [37.292, 127.044],
      [37.292, 127.032],
    ],
    details: {
      pm10Reduction: 70,
      carbonAbsorption: 1.3,
      thermalComfort: 75,
      greenCoverage: 50,
    },
    nearbyParks: [],
    description: "대학 캠퍼스 녹지 활용 가능",
  },
];
