# 🌿 숲세권 스카우터 (Green Life Scouter) - 프로젝트 개요

## 🔎 프로젝트 링크
https://green-life-scouter.vercel.app/

---

## 📋 프로젝트 소개

**숲세권 스카우터**는 경기도 기후위성데이터를 활용한 친환경 생활 추천 웹 애플리케이션입니다. 사용자가 이사 갈 집이나 산책로의 '환경 점수'를 분석하고, 친환경 습관을 체크하며 지속 가능한 라이프스타일을 실천할 수 있도록 돕는 PWA(Progressive Web App)입니다.

### 주요 목표
- 경기도 지역의 녹지시설 및 주거구역 환경 점수 시각화
- 친환경 습관 트래킹 및 연속 달성 시스템
- 습관 완료에 따른 맞춤형 녹지시설 추천
- 환경 기여도 및 탄소 절감량 시각화

---

## 🎯 주요 기능

### 1. 지도 기반 환경 분석 (Map Page)

#### 1.1 녹지시설 표시
- **공원 (PARK)**: 녹지 면적이 넓은 공원 시설
- **무더위 쉼터 (SHELTER)**: 열쾌적성이 높은 쉼터
- **산책로 (TRAIL)**: 탄소 흡수량이 높은 산책로

#### 1.2 주거구역 환경 분석
- 주거구역별 환경 점수 시각화 (폴리곤)
- 클릭 시 상세 환경 분석 모달 표시
- 인근 녹지시설 목록 및 상세 정보 제공

#### 1.3 그린 스코어 시스템
- **점수 계산 알고리즘**:
  - 미세먼지 저감: 30%
  - 탄소 흡수량: 25%
  - 열쾌적성: 25%
  - 녹지 면적: 20%
- 0-100점 척도로 환경 점수 산출
- 점수별 등급 표시 (A+, A, B, C, D)

#### 1.4 특별 장소 해금 시스템
- **스트릭 기반 티어 시스템**:
  - **브론즈 (Bronze)**: 3일 연속 달성, 점수 85점 이상
  - **실버 (Silver)**: 7일 연속 달성, 점수 88점 이상
  - **골드 (Gold)**: 14일 연속 달성, 점수 90점 이상
- 티어별 색상 및 아이콘 표시
- 스트릭 달성 시 특별 장소 해금

#### 1.5 습관 기반 추천 시스템
- 완료한 습관에 따라 맞춤형 녹지시설 추천
- 추천 장소는 오렌지색 마커로 강조 표시
- 추천 이유 및 관련 습관 정보 제공

### 2. 에코 습관 트래커 (Tracker Page)

#### 2.1 일일 습관 체크리스트
- 8가지 친환경 습관:
  1. 텀블러 사용하기
  2. 대중교통 이용하기
  3. 일회용품 거절하기
  4. 장바구니 사용하기
  5. 플러그 뽑기
  6. 계단 이용하기
  7. 채식 한 끼 실천
  8. 쓰레기 분리수거

#### 2.2 연속 달성 (Streak) 시스템
- 매일 모든 습관 완료 시 연속 달성 일수 증가
- 스트릭 뱃지 및 애니메이션 표시
- 스트릭에 따른 특별 장소 해금

#### 2.3 주간 달성률
- 이번 주 평균 달성률 원형 차트 표시
- 주간 데이터 바 차트

#### 2.4 축하 모달
- 모든 습관 완료 시 축하 모달 팝업
- 환경 기여도 메시지 표시

### 3. 통계/기록 (Stats Page)

#### 3.1 주요 통계 카드
- 연속 달성 일수
- 이번 주 평균 달성률
- 오늘 완료율
- 총 완료 습관 수

#### 3.2 주간 달성률 차트
- 이번 주 일별 달성률 바 차트
- 요일별 완료 현황 시각화

#### 3.3 월간 추이 차트
- 이번 달 일별 달성률 라인 차트
- 장기 추이 분석

#### 3.4 습관별 완료 현황
- 각 습관별 최근 7일간 완료율
- 습관별 진행률 바 표시

### 4. 상세 정보 모달

#### 4.1 녹지시설 상세 모달 (LocationModal)
- **그린 스코어**: 0-100점 점수 및 등급
- **레이더 차트**: 4가지 지표 시각화
  - 미세먼지 저감
  - 탄소 흡수량
  - 열쾌적성
  - 녹지 면적
- **상세 지표**: 각 지표별 수치 및 진행률 바
- **기대 효과**: 건강 점수, 환경 기여도, 추천 활동
- **나의 환경 기여도**: 
  - CO2 절감량 (kg)
  - 나무 심기 개수 환산
  - 자동차 주행 거리 환산
  - 카테고리별 기여도
- **이 장소에서 실천할 수 있는 습관**: 관련 습관 목록
- **특별 장소 보너스**: 스트릭 티어별 보너스 메시지

#### 4.2 주거구역 상세 모달 (ZoneDetailModal)
- 주거구역 환경 분석 결과
- 인근 녹지시설 목록 (클릭 가능)
- 녹지시설 클릭 시 해당 시설 상세 모달로 전환

---

## 🛠 기술 스택

### 프론트엔드 프레임워크
- **React 19.2.0**: UI 라이브러리
- **Vite 7.2.4**: 빌드 도구 및 개발 서버
- **React DOM 19.2.0**: React 렌더링

### 스타일링
- **Tailwind CSS 3.4.19**: 유틸리티 기반 CSS 프레임워크
- **PostCSS 8.5.6**: CSS 후처리
- **Autoprefixer 10.4.22**: CSS 벤더 프리픽스 자동 추가
- **clsx 2.1.1**: 조건부 클래스명 유틸리티
- **tailwind-merge 3.4.0**: Tailwind 클래스 병합

### 지도 라이브러리
- **Leaflet 1.9.4**: 오픈소스 지도 라이브러리
- **react-leaflet 5.0.0**: React용 Leaflet 래퍼

### 차트 라이브러리
- **recharts 3.5.1**: React 차트 라이브러리
  - 레이더 차트 (RadarChart)
  - 바 차트 (BarChart)
  - 라인 차트 (LineChart)

### 아이콘
- **lucide-react 0.561.0**: 아이콘 라이브러리

### 날짜 처리
- **date-fns 4.1.0**: 날짜 유틸리티 라이브러리

### 개발 도구
- **ESLint 9.39.1**: 코드 린터
- **@vitejs/plugin-react 5.1.1**: Vite React 플러그인
- **eslint-plugin-react-hooks 7.0.1**: React Hooks 린트 규칙
- **eslint-plugin-react-refresh 0.4.24**: React Fast Refresh 지원

---

## 📁 프로젝트 구조

```
green-life-scouter/
├── public/                 # 정적 파일
├── src/
│   ├── assets/            # 이미지 등 리소스
│   ├── components/        # React 컴포넌트
│   │   ├── common/        # 공통 컴포넌트
│   │   │   └── TermTooltip.jsx      # 용어 설명 툴팁
│   │   ├── Layout/        # 레이아웃 컴포넌트
│   │   │   ├── Header.jsx           # 상단 헤더
│   │   │   └── BottomNav.jsx        # 하단 네비게이션
│   │   ├── Map/          # 지도 관련 컴포넌트
│   │   │   ├── GreenMap.jsx         # 메인 지도 컴포넌트
│   │   │   ├── LocationModal.jsx    # 녹지시설 상세 모달
│   │   │   ├── ZoneDetailModal.jsx  # 주거구역 상세 모달
│   │   │   ├── ResidentialZone.jsx # 주거구역 폴리곤
│   │   │   └── RadarChart.jsx       # 레이더 차트
│   │   ├── Tracker/      # 습관 트래커 컴포넌트
│   │   │   ├── HabitList.jsx        # 습관 체크리스트
│   │   │   ├── StreakBadge.jsx      # 스트릭 뱃지
│   │   │   ├── WeeklyChart.jsx      # 주간 차트
│   │   │   └── CelebrationModal.jsx # 축하 모달
│   │   └── UI/           # UI 컴포넌트
│   │       └── GlassCard.jsx        # 글래스모피즘 카드
│   ├── data/             # 데이터 파일
│   │   ├── mockClimateData.js       # 목업 기후 데이터
│   │   └── terminology.js           # 용어 정의
│   ├── hooks/            # 커스텀 훅
│   │   └── useLocalStorage.js       # localStorage 훅
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── MapPage.jsx              # 지도 페이지
│   │   ├── TrackerPage.jsx          # 습관 트래커 페이지
│   │   └── StatsPage.jsx            # 통계 페이지
│   ├── utils/            # 유틸리티 함수
│   │   ├── storage.js                # 안전한 localStorage 유틸
│   │   ├── scoreCalculator.js       # 그린 스코어 계산
│   │   ├── habitUtils.js            # 습관 관련 유틸
│   │   ├── mapIntegration.js       # 지도-습관 통합
│   │   ├── environmentalImpact.js   # 환경 기여도 계산
│   │   ├── habitLocationMapper.js   # 습관-장소 매핑
│   │   ├── specialLocations.js      # 특별 장소 해금 시스템
│   │   ├── benefitCalculator.js     # 기대 효과 계산
│   │   └── cn.js                    # 클래스명 유틸
│   ├── App.jsx           # 메인 앱 컴포넌트
│   ├── main.jsx          # 앱 진입점
│   └── index.css         # 전역 스타일
├── index.html            # HTML 템플릿
├── package.json          # 의존성 관리
├── vite.config.js        # Vite 설정
├── tailwind.config.js    # Tailwind 설정
├── postcss.config.js     # PostCSS 설정
└── eslint.config.js      # ESLint 설정
```

---

## 🔧 주요 구현 사항

### 1. 안전한 데이터 저장 시스템

#### 문제점
- `localStorage` 접근이 불가능한 환경 (시크릿 모드, iframe 등)에서 앱이 작동하지 않음
- `SecurityError`, `QuotaExceededError` 등 예외 처리 필요

#### 해결 방법
- **`src/utils/storage.js`**: 안전한 localStorage 래퍼
  - `isStorageAvailable()`: Storage 사용 가능 여부 확인
  - `safeGetItem()`, `safeSetItem()`: 예외 처리된 저장/로드
  - 메모리 기반 폴백 스토리지 구현
- **`src/hooks/useLocalStorage.js`**: React 훅으로 래핑
  - Storage 실패 시 자동으로 메모리 모드로 전환
  - `isStorageReady` 플래그로 사용자에게 알림

### 2. 그린 스코어 계산 알고리즘

#### 구현 위치
- `src/utils/scoreCalculator.js`

#### 알고리즘
```javascript
Green Score = 
  (미세먼지 저감 × 0.30) +
  (탄소 흡수량 정규화 × 0.25) +
  (열쾌적성 × 0.25) +
  (녹지 면적 × 0.20)
```

#### 특징
- 탄소 흡수량은 0-5톤/년 범위로 정규화
- 점수별 색상 및 등급 자동 계산
- API 데이터 표준화 함수 제공

### 3. 환경 기여도 계산 시스템

#### 구현 위치
- `src/utils/environmentalImpact.js`

#### 계산 항목
- **CO2 절감량**: 습관별 CO2 절감량 합산
- **나무 심기 개수 환산**: 1그루 = 20kg CO2/년 기준
- **자동차 주행 거리 환산**: 1km = 0.12kg CO2 기준
- **카테고리별 기여도**: 폐기물, 이동수단, 에너지, 식습관

#### 습관별 CO2 절감량
- 텀블러 사용: 0.15kg
- 대중교통 이용: 0.8kg
- 일회용품 거절: 0.1kg
- 장바구니 사용: 0.05kg
- 플러그 뽑기: 0.2kg
- 계단 이용: 0.1kg
- 채식 한 끼: 1.5kg
- 분리수거: 0.3kg

### 4. 습관-장소 매핑 시스템

#### 구현 위치
- `src/utils/habitLocationMapper.js`

#### 매핑 로직
- 각 습관에 관련된 장소 타입 정의
- 완료된 습관에 따라 관련 장소 필터링
- 정렬 기준 가중치 계산 (여러 습관 완료 시)
- 최대 5개 장소 추천

#### 습관별 추천 장소 타입
- 텀블러 사용 → 공원 (녹지 면적 기준)
- 대중교통 이용 → 산책로 (열쾌적성 기준)
- 일회용품 거절 → 공원, 산책로 (미세먼지 저감 기준)
- 장바구니 사용 → 공원 (녹지 면적 기준)
- 플러그 뽑기 → 공원, 산책로 (탄소 흡수량 기준)
- 계단 이용 → 산책로 (열쾌적성 기준)
- 채식 한 끼 → 공원 (녹지 면적 기준)
- 분리수거 → 공원, 산책로 (미세먼지 저감 기준)

### 5. 스트릭 기반 특별 장소 해금 시스템

#### 구현 위치
- `src/utils/specialLocations.js`

#### 티어 시스템
- **브론즈**: 3일 연속 달성, 점수 85점 이상
- **실버**: 7일 연속 달성, 점수 88점 이상
- **골드**: 14일 연속 달성, 점수 90점 이상

#### 특징
- 각 장소의 점수에 따라 해당 티어 결정
- 현재 스트릭이 티어를 해금한 경우에만 표시
- 티어별 색상 및 아이콘 표시 (Star, Crown, Trophy)
- 다음 티어까지 남은 일수 계산

### 6. 글래스모피즘 UI 디자인

#### 디자인 컨셉
- 반투명 배경 (`bg-white/40`)
- 백드롭 블러 효과 (`backdrop-blur-md`)
- 둥근 모서리 (`rounded-2xl`)
- 부드러운 그림자 효과

#### 구현 위치
- `src/components/UI/GlassCard.jsx`
- 전역 CSS 클래스: `glass`, `glass-dark`

### 7. 반응형 모달 시스템

#### 문제점
- 모달이 하단 네비게이션에 가려짐
- 스크롤 시 닫기 버튼이 클릭 불가
- z-index 충돌로 지도 위에 표시되지 않음

#### 해결 방법
- 모달 배경: `z-[99999]` 설정
- 헤더: `sticky top-0 z-50` 설정
- 닫기 버튼: `relative z-[60]` 및 `pointer-events: auto`
- 콘텐츠: `paddingBottom: '100px'` 추가

### 8. 동적 툴팁 위치 조정

#### 구현 위치
- `src/components/common/TermTooltip.jsx`

#### 기능
- 아이콘 오른쪽에 툴팁 표시
- 화면 경계 감지 및 너비 자동 조정
- 하단 네비게이션 영역 회피
- 위/아래 위치 자동 조정

### 9. 지도 마커 커스터마이징

#### 구현 위치
- `src/components/Map/GreenMap.jsx` - `createCustomIcon()`

#### 마커 타입
- **일반 마커**: 기본 색상 및 크기
- **추천 마커**: 오렌지색, 크기 50px, 펄스 애니메이션
- **특별 마커**: 티어별 색상, 크기 48px, 티어 배지 아이콘

#### 아이콘 렌더링
- React 컴포넌트를 `renderToStaticMarkup()`으로 HTML 변환
- Leaflet `divIcon`으로 커스텀 마커 생성

### 10. 이벤트 처리 최적화

#### 문제점
- Leaflet Popup의 "상세보기" 버튼 클릭이 작동하지 않음
- React 이벤트와 Leaflet 이벤트 충돌

#### 해결 방법
- Popup에서 "상세보기" 버튼 제거
- 마커/폴리곤 클릭 시 직접 모달 열기
- Popup 인스턴스를 `useRef`로 관리하여 모달 닫힘 시 자동 닫기

---

## 🎨 UI/UX 디자인

### 컬러 테마
- **Primary**: Emerald (#10b981) ~ Teal (#14b8a6) 그라데이션
- **Background**: Light cream (#f0fdf4)
- **Accent**: Amber (#f59e0b) - 추천 장소

### 컴포넌트 스타일
- **글래스모피즘**: 반투명 배경 + 블러 효과
- **둥근 모서리**: `rounded-2xl` 이상
- **부드러운 그림자**: `shadow-lg`, `shadow-xl`
- **애니메이션**: 펄스, 페이드인, 줌인 효과

### 반응형 디자인
- 모바일 우선 설계
- 최대 너비: `max-w-2xl`
- 하단 네비게이션: 고정 위치 (80px)
- 상단 헤더: 고정 위치 (64px)

---

## 📊 데이터 구조

### 녹지시설 데이터
```javascript
{
  id: number,
  name: string,
  lat: number,
  lng: number,
  type: 'PARK' | 'SHELTER' | 'TRAIL',
  score: number, // 0-100
  details: {
    pm10Reduction: number,    // 0-100
    carbonAbsorption: number,  // 톤/년
    thermalComfort: number,   // 0-100
    greenCoverage: number     // 0-100 (%)
  }
}
```

### 주거구역 데이터
```javascript
{
  id: number,
  name: string,
  coordinates: [[lat, lng], ...],
  score: number,
  details: { ... },
  nearbyParks: [locationId, ...]
}
```

### 습관 데이터
```javascript
{
  id: number,
  text: string,
  icon: string,
  category: 'waste' | 'transport' | 'energy' | 'food'
}
```

---

## 🚀 실행 방법

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 요구사항
- Node.js 18+
- npm 또는 yarn

---

## 📝 주요 파일 설명

### 핵심 컴포넌트
- **`App.jsx`**: 메인 앱 컴포넌트, 탭 네비게이션 관리
- **`MapPage.jsx`**: 지도 페이지, 추천 장소 알림 표시
- **`TrackerPage.jsx`**: 습관 트래커 페이지, 체크리스트 및 통계
- **`StatsPage.jsx`**: 통계 페이지, 차트 및 분석

### 유틸리티 함수
- **`scoreCalculator.js`**: 그린 스코어 계산 알고리즘
- **`environmentalImpact.js`**: 환경 기여도 및 CO2 절감량 계산
- **`habitLocationMapper.js`**: 습관-장소 매핑 및 추천 로직
- **`specialLocations.js`**: 스트릭 기반 특별 장소 해금 시스템
- **`storage.js`**: 안전한 localStorage 접근 유틸리티
- **`habitUtils.js`**: 습관 관련 통계 계산 (스트릭, 주간 평균 등)

### 커스텀 훅
- **`useLocalStorage.js`**: 안전한 localStorage를 사용하는 React 훅

---

## 🔮 향후 개선 사항

### API 연동
- 경기도 기후위성데이터 API 연동
- 실시간 데이터 업데이트
- 위치 기반 추천 강화

### 기능 추가
- 사용자 위치 자동 감지
- 즐겨찾기 기능
- 공유 기능 (SNS 연동)
- 알림 기능 (습관 리마인더)

### 성능 최적화
- 지도 마커 클러스터링
- 이미지 지연 로딩
- 코드 스플리팅

### 접근성 개선
- 키보드 네비게이션
- 스크린 리더 지원
- 다국어 지원

---

## 📄 라이선스

이 프로젝트는 교육 및 포트폴리오 목적으로 제작되었습니다.

---

## 👥 기여자

- 프로젝트 개발 및 설계
- UI/UX 디자인
- 알고리즘 구현

---

**마지막 업데이트**: 2025년 12월 13일

