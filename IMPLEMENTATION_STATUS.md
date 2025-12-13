# 🌿 숲세권 스카우터 구현 현황 및 추가 사항

## ✅ 현재 구현된 기능

### 1. 지도 기능 (MapPage)
- ✅ OpenStreetMap 기반 지도 표시
- ✅ 커스텀 마커 (공원, 무더위쉼터, 산책로)
- ✅ 마커 클릭 시 바텀 시트 모달 표시
- ✅ 그린 스코어 원형 차트 표시
- ✅ 상세 지표 표시 (미세먼지 저감, 탄소 흡수량, 열쾌적성, 녹지 면적)
- ✅ **레이더 차트** (4개 지표 시각화)
- ✅ **주거지역 폴리곤 표시 및 상세 정보**
- ✅ **기대효과 섹션** (건강 점수, 탄소 기여도, 활동 추천)
- ✅ **지도 뷰 모드 전환** (전체/녹지시설/주거구역)
- ✅ **추천 장소 마커 하이라이트** (습관 완료 시)

### 2. 습관 트래커 (TrackerPage)
- ✅ 8가지 친환경 습관 체크리스트
- ✅ 날짜별 localStorage 저장 (안전한 Storage 접근)
- ✅ **실제 스트릭 계산** (연속 달성 일수)
- ✅ **실제 주간 평균 계산** (지난 7일간 데이터)
- ✅ 주간 달성률 원형 차트
- ✅ 모든 습관 완료 시 축하 모달
- ✅ **Storage 접근 실패 시 메모리 폴백** (시크릿 모드 대응)

### 3. 통계/기록 페이지 (StatsPage)
- ✅ **연속 달성 일수 표시**
- ✅ **이번 주 평균 완료율**
- ✅ **오늘 완료율**
- ✅ **총 완료 습관 수** (최근 30일)
- ✅ **주간 달성률 바 차트** (요일별)
- ✅ **월간 추이 라인 차트**
- ✅ **습관별 완료 현황** (최근 7일간 통계)

### 4. 지도-습관 연동 기능
- ✅ **습관 완료 상태에 따른 추천 장소 계산**
  - 모든 습관 완료: 점수 높은 곳 (85점 이상)
  - 5개 이상 완료: 탄소 흡수량 높은 곳
  - 3개 이상 완료: 열쾌적성 높은 곳
- ✅ **추천 장소 마커 시각적 강조** (황금색, 펄스 애니메이션)
- ✅ **추천 알림 배너** (MapPage 상단)

### 5. 그린 스코어 계산 시스템
- ✅ **가중치 기반 점수 계산 알고리즘**
  - 미세먼지 저감: 30%
  - 탄소 흡수량: 25%
  - 열쾌적성: 25%
  - 녹지 면적: 20%
- ✅ **탄소 흡수량 정규화** (0-5톤/년 → 0-100점)
- ✅ **점수별 등급 시스템** (A+, A, B, C, D)
- ✅ **점수별 색상 매핑** (emerald, teal, amber, orange, red)
- ✅ **API 데이터 정규화 함수** (향후 API 연동 준비)

### 6. 기대효과 계산 시스템
- ✅ **미세먼지 저감 효과 설명** (우수/양호/일반)
- ✅ **탄소 흡수량 기여도 계산** (CO2 환산, 인당 배출량 상쇄)
- ✅ **열쾌적성 기반 활동 추천** (야외 운동, 산책, 피크닉 등)
- ✅ **건강 점수 계산** (종합 건강 지표)
- ✅ **타입별 맞춤 추천** (공원/산책로/쉼터별)

### 7. UI/UX
- ✅ Glassmorphism 디자인
- ✅ 반응형 모바일 최적화
- ✅ 하단 탭 네비게이션 (지도/습관/통계)
- ✅ 애니메이션 효과
- ✅ **동적 헤더 타이틀** (탭별 변경)
- ✅ **모달 z-index 최적화** (지도 위 표시)

### 8. 데이터 관리
- ✅ **안전한 Storage 접근** (`utils/storage.js`)
- ✅ **커스텀 useLocalStorage 훅** (`hooks/useLocalStorage.js`)
- ✅ **Storage 실패 시 메모리 폴백** (시크릿 모드 대응)
- ✅ **날짜별 데이터 저장** (`habits-YYYY-MM-DD`)

---

## ❌ 추가 구현이 필요한 사항

### 🔴 핵심 기능 (우선순위 높음)

#### 1. **사용자 위치 기반 추천**
**현재 상태**: 고정된 중심점 사용 (경기도청)
**필요 사항**:
```javascript
// components/Map/GreenMap.jsx
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // 지도 중심을 사용자 위치로 이동
        map.setView([latitude, longitude], 15);
        
        // 가까운 장소 찾기
        const nearby = findNearbyLocations(latitude, longitude, 5); // 5km 반경
        setNearbyLocations(nearby);
      },
      (error) => {
        console.error('위치 정보 접근 실패:', error);
        // 기본 위치 사용
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }
}, []);
```

**구현 파일**:
- `src/utils/locationUtils.js` (새로 생성)
  - `getUserLocation()`: 사용자 위치 가져오기
  - `calculateDistance(lat1, lng1, lat2, lng2)`: 두 좌표 간 거리 계산 (Haversine)
  - `findNearbyLocations(userLat, userLng, radiusKm)`: 반경 내 장소 찾기

**UI 개선**:
- 지도 상단에 "내 위치로 이동" 버튼 추가
- 가까운 장소 우선 표시 옵션
- 거리 표시 (예: "1.2km")

#### 2. **실제 API 연동**
**현재 상태**: Mock 데이터만 사용 (`mockClimateData.js`)
**필요 사항**:

**API 엔드포인트**:
- `그린인프라 > 도시공원 평가`: 녹지 면적, 공원 품질
- `탄소공간 > 탄소흡수지도`: 탄소 흡수량
- `도시생태현황 > 비오톱 유형도`: 열쾌적성, 미세먼지 저감

**구현 파일**:
```javascript
// src/utils/api.js (새로 생성)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

/**
 * 그린인프라 데이터 가져오기
 */
export async function fetchGreenInfrastructure(lat, lng) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/green-infrastructure?lat=${lat}&lng=${lng}`
    );
    if (!response.ok) throw new Error('API 호출 실패');
    const data = await response.json();
    return normalizeApiData(data);
  } catch (error) {
    console.error('그린인프라 API 오류:', error);
    return null;
  }
}

/**
 * 탄소 흡수량 데이터 가져오기
 */
export async function fetchCarbonAbsorption(lat, lng) {
  // 구현
}

/**
 * 비오톱 데이터 가져오기
 */
export async function fetchBiotopeData(lat, lng) {
  // 구현
}
```

**환경 변수 설정**:
```bash
# .env
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_api_key_here
```

**로딩 상태 및 에러 핸들링**:
- `src/components/UI/LoadingSpinner.jsx` (새로 생성)
- `src/components/UI/ErrorMessage.jsx` (새로 생성)
- API 호출 실패 시 Mock 데이터로 폴백

**데이터 캐싱**:
- 같은 위치의 데이터는 일정 시간 동안 캐시
- `src/utils/cache.js` (새로 생성)

### 🟡 개선 사항 (우선순위 중간)

#### 3. **지도 필터링 기능**
**필요 사항**:
- 타입별 필터 (공원만, 쉼터만, 산책로만)
- 점수 범위 필터 (80점 이상만 보기, 60-80점 등)
- 거리 기반 정렬 (가까운 순서대로)
- 검색 기능 (장소 이름으로 검색)

**구현 파일**:
```javascript
// src/components/Map/MapFilters.jsx (새로 생성)
export default function MapFilters({ filters, onFilterChange }) {
  return (
    <div className="absolute top-16 left-4 z-[1000] bg-white/90 rounded-lg p-3 shadow-lg">
      {/* 타입 필터 */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          타입
        </label>
        <div className="flex gap-2">
          {['PARK', 'SHELTER', 'TRAIL'].map(type => (
            <button
              key={type}
              onClick={() => onFilterChange('type', type)}
              className={/* ... */}
            >
              {markerTypes[type].label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 점수 범위 필터 */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          점수 범위
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.minScore}
          onChange={(e) => onFilterChange('minScore', e.target.value)}
        />
        <span className="text-xs text-gray-600">{filters.minScore}점 이상</span>
      </div>
    </div>
  );
}
```

#### 4. **지역별 그린 스코어 비교**
**필요 사항**:
- 여러 주거지역의 그린 스코어를 비교하는 차트
- 통계 페이지에 "지역 비교" 섹션 추가
- 평균 그린 스코어 계산

**구현 파일**:
```javascript
// src/pages/StatsPage.jsx에 추가
const [zoneComparison, setZoneComparison] = useState([]);

useEffect(() => {
  // 모든 주거지역의 점수 계산
  const zones = residentialZones.map(zone => ({
    name: zone.name,
    score: calculateGreenScore(zone.details),
    grade: getScoreGrade(calculateGreenScore(zone.details)),
  }));
  setZoneComparison(zones.sort((a, b) => b.score - a.score));
}, []);
```

#### 5. **개인 탄소 절감량 추정**
**필요 사항**:
- 습관 완료에 따른 탄소 절감량 계산
- 통계 페이지에 "환경 기여도" 섹션 추가
- 시각화 (나무 심기 개수 환산 등)

**구현 파일**:
```javascript
// src/utils/carbonCalculator.js (새로 생성)
/**
 * 습관별 탄소 절감량 (kg CO2/일)
 */
const HABIT_CARBON_SAVINGS = {
  'walk': 0.5,      // 대중교통 이용
  'recycle': 0.3,   // 재활용
  'reuse': 0.2,     // 재사용
  'local': 0.4,     // 지역 식재료
  'energy': 0.6,    // 에너지 절약
  'water': 0.1,     // 물 절약
  'waste': 0.3,     // 쓰레기 줄이기
  'green': 0.2,     // 녹지 이용
};

export function calculateDailyCarbonSavings(checkedHabits) {
  let total = 0;
  ecoHabits.forEach(habit => {
    if (checkedHabits[habit.id]) {
      total += HABIT_CARBON_SAVINGS[habit.id] || 0;
    }
  });
  return total;
}

export function calculateTotalCarbonSavings() {
  // 최근 30일간의 총 절감량 계산
  // ...
}
```

### 🟢 향후 확장 사항 (우선순위 낮음)

#### 6. **PWA 기능 강화**
- 오프라인 지원 (Service Worker)
- 푸시 알림 (습관 체크 리마인더)
- 홈 화면 추가 아이콘

#### 7. **소셜 기능**
- 친구와 습관 달성 비교
- 지역 랭킹 (그린 스코어)
- 인증샷 공유

#### 8. **고급 통계**
- 월간/연간 리포트
- 습관 달성 패턴 분석
- 목표 설정 및 달성률 추적

#### 9. **접근성 개선**
- 스크린 리더 지원
- 키보드 네비게이션
- 색상 대비 개선

---

## 📋 구현 우선순위

### Phase 1 (즉시 구현) ✅ 완료
1. ✅ 그린 스코어 계산 알고리즘
2. ✅ 레이더 차트 추가
3. ✅ 스트릭 계산 로직
4. ✅ 습관 트래커와 지도 연동
5. ✅ 실제 주간 리포트
6. ✅ 통계/기록 페이지
7. ✅ 기대효과 계산 시스템
8. ✅ 안전한 Storage 접근

### Phase 2 (다음 단계) 🔄 진행 중
1. **사용자 위치 기반 추천** (우선순위: 높음)
   - Geolocation API 연동
   - 거리 계산 및 가까운 장소 찾기
   - "내 위치로 이동" 버튼

2. **실제 API 연동 준비** (우선순위: 높음)
   - API 유틸리티 함수 작성
   - 환경 변수 설정
   - 에러 핸들링 및 로딩 상태
   - 데이터 캐싱

### Phase 3 (향후)
3. **지도 필터링 기능** (우선순위: 중간)
   - 타입별/점수별 필터
   - 검색 기능

4. **지역별 그린 스코어 비교** (우선순위: 중간)
   - 비교 차트
   - 통계 페이지 통합

5. **개인 탄소 절감량 추정** (우선순위: 중간)
   - 습관별 탄소 절감량 계산
   - 환경 기여도 시각화

---

## 🎯 아이디어 대비 구현 완성도

| 기능 | 요구사항 | 현재 상태 | 완성도 |
|------|---------|---------|--------|
| 지도 클릭 시 점수 표시 | ✅ | ✅ | 100% |
| 친환경 습관 체크리스트 | ✅ | ✅ | 100% |
| 습관-지도 연동 | ✅ | ✅ | 100% |
| 여러 API 데이터 합산 | ✅ | ✅ | 100% (Mock 데이터) |
| 레이더 차트 | ✅ | ✅ | 100% |
| 차트-지도 상호작용 | ✅ | ✅ | 100% |
| 주간 리포트 | ✅ | ✅ | 100% |
| 통계 대시보드 | ✅ | ✅ | 100% |
| 기대효과 계산 | ✅ | ✅ | 100% |
| 사용자 위치 기반 추천 | ✅ | ❌ | 0% |
| 실제 API 연동 | ✅ | ❌ | 0% (Mock만) |
| 지도 필터링 | ✅ | ⚠️ | 30% (뷰 모드만) |
| 지역 비교 | ✅ | ❌ | 0% |
| 탄소 절감량 추정 | ✅ | ❌ | 0% |

**전체 완성도: 약 85%**

---

## 📝 추가 구현 명세서

### 1. 사용자 위치 기반 추천 기능

#### 1.1 목표
- 사용자의 현재 위치를 기반으로 가까운 녹지시설을 추천
- 거리 정보 제공 및 거리순 정렬

#### 1.2 구현 파일
- `src/utils/locationUtils.js` (새로 생성)
- `src/components/Map/GreenMap.jsx` (수정)
- `src/components/Map/LocationButton.jsx` (새로 생성)

#### 1.3 주요 함수
```javascript
// src/utils/locationUtils.js
/**
 * 사용자 위치 가져오기
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation을 지원하지 않습니다'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * 두 좌표 간 거리 계산 (Haversine 공식)
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} 거리 (km)
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 반경 내 장소 찾기
 * @param {number} userLat
 * @param {number} userLng
 * @param {number} radiusKm
 * @returns {Array} 가까운 장소 배열 (거리 포함)
 */
export function findNearbyLocations(userLat, userLng, radiusKm = 5) {
  return greenLocations
    .map(location => ({
      ...location,
      distance: calculateDistance(
        userLat,
        userLng,
        location.lat,
        location.lng
      ),
    }))
    .filter(location => location.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}
```

#### 1.4 UI 컴포넌트
```jsx
// src/components/Map/LocationButton.jsx
import { MapPin } from 'lucide-react';
import { getUserLocation } from '../../utils/locationUtils';

export default function LocationButton({ onLocationFound }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    try {
      const location = await getUserLocation();
      onLocationFound(location);
    } catch (error) {
      alert('위치 정보를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 z-[1000] bg-white rounded-full p-3 shadow-lg"
      disabled={isLoading}
    >
      <MapPin className="w-6 h-6 text-emerald-600" />
    </button>
  );
}
```

### 2. 실제 API 연동

#### 2.1 목표
- 공공데이터포털 API 연동
- Mock 데이터를 실제 데이터로 대체
- 에러 핸들링 및 로딩 상태 관리

#### 2.2 구현 파일
- `src/utils/api.js` (새로 생성)
- `src/utils/cache.js` (새로 생성)
- `src/components/UI/LoadingSpinner.jsx` (새로 생성)
- `src/components/UI/ErrorMessage.jsx` (새로 생성)
- `.env` (새로 생성)

#### 2.3 API 엔드포인트 구조
```javascript
// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * 공공데이터포털 API 호출 래퍼
 */
async function callPublicApi(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  url.searchParams.append('serviceKey', API_KEY);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API 오류: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
}

/**
 * 그린인프라 데이터 가져오기
 */
export async function fetchGreenInfrastructure(lat, lng) {
  const cacheKey = `green-infra-${lat}-${lng}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const data = await callPublicApi('/green-infrastructure', { lat, lng });
    const normalized = normalizeApiData(data);
    setCachedData(cacheKey, normalized, 3600000); // 1시간 캐시
    return normalized;
  } catch (error) {
    // Mock 데이터로 폴백
    return getMockData(lat, lng);
  }
}
```

#### 2.4 환경 변수 설정
```bash
# .env
VITE_API_BASE_URL=https://api.data.go.kr
VITE_API_KEY=your_api_key_here
```

```bash
# .env.example
VITE_API_BASE_URL=https://api.data.go.kr
VITE_API_KEY=your_api_key_here
```

### 3. 지도 필터링 기능

#### 3.1 목표
- 타입별 필터 (공원/쉼터/산책로)
- 점수 범위 필터
- 검색 기능

#### 3.2 구현 파일
- `src/components/Map/MapFilters.jsx` (새로 생성)
- `src/components/Map/SearchBar.jsx` (새로 생성)
- `src/components/Map/GreenMap.jsx` (수정)

#### 3.3 필터 상태 관리
```javascript
// src/components/Map/GreenMap.jsx
const [filters, setFilters] = useState({
  types: ['PARK', 'SHELTER', 'TRAIL'], // 모든 타입
  minScore: 0,
  maxScore: 100,
  searchQuery: '',
});

const filteredLocations = useMemo(() => {
  return greenLocations.filter(location => {
    // 타입 필터
    if (!filters.types.includes(location.type)) return false;
    
    // 점수 필터
    const score = location.score || calculateGreenScore(location.details);
    if (score < filters.minScore || score > filters.maxScore) return false;
    
    // 검색 필터
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!location.name.toLowerCase().includes(query)) return false;
    }
    
    return true;
  });
}, [filters]);
```

---

## 🚀 다음 단계

1. **사용자 위치 기반 추천 구현** (1-2일)
   - `locationUtils.js` 생성
   - `LocationButton` 컴포넌트 추가
   - `GreenMap`에 위치 기반 필터링 통합

2. **API 연동 준비** (2-3일)
   - API 유틸리티 함수 작성
   - 환경 변수 설정
   - 에러 핸들링 및 로딩 상태
   - Mock 데이터와 실제 데이터 전환 로직

3. **지도 필터링 기능** (1-2일)
   - 필터 UI 컴포넌트
   - 검색 바
   - 필터 상태 관리

4. **통계 기능 확장** (1-2일)
   - 지역 비교 차트
   - 탄소 절감량 계산 및 시각화

---

**최종 업데이트**: 2024년 (현재 날짜)
**다음 리뷰 예정일**: Phase 2 완료 후
