# 🗺️ 지도 기능과 습관 트래커 연동 방안

## 📊 현재 연동 상태

### 구현된 기능
1. **습관 완료 개수 기반 추천 장소**
   - 3개 이상 완료: 열쾌적성 높은 곳 추천
   - 5개 이상 완료: 탄소 흡수량 높은 곳 추천
   - 모두 완료: 점수 높은 곳(85점 이상) 추천

2. **시각적 피드백**
   - 추천 장소 마커 하이라이트 (황금색, 펄스 애니메이션)
   - 추천 알림 배너 (MapPage 상단)

### 현재 문제점
- ❌ **연관성이 약함**: 단순히 개수만으로 추천하는 수준
- ❌ **동기 부여 부족**: "왜 이 장소를 추천받는지" 명확하지 않음
- ❌ **습관별 특화 없음**: 모든 습관을 동일하게 취급
- ❌ **피드백 부족**: 습관 완료 → 장소 방문의 연결고리가 약함

---

## 🎯 개선 방안

### 1. 습관별 맞춤 추천 시스템 ⭐ (우선순위: 높음)

**아이디어**: 각 습관과 관련된 장소 타입을 추천

```javascript
// 습관별 추천 로직
const habitLocationMapping = {
  'walk': ['TRAIL'],           // 걷기 → 산책로
  'park': ['PARK'],            // 공원 방문 → 공원
  'energy': ['PARK', 'TRAIL'], // 에너지 절약 → 녹지 공간
  'recycle': ['PARK'],         // 재활용 → 공원 (재활용 시설)
  'local': ['PARK'],           // 지역 식재료 → 공원 (농장/텃밭)
  'water': ['PARK'],           // 물 절약 → 공원 (호수/연못)
  'waste': ['PARK', 'TRAIL'],  // 쓰레기 줄이기 → 모든 녹지
  'green': ['PARK', 'TRAIL', 'SHELTER'], // 녹지 이용 → 모든 녹지
};
```

**구현 예시**:
- "걷기" 습관 완료 → 산책로(TRAIL) 타입 장소 추천
- "공원 방문" 습관 완료 → 공원(PARK) 타입 장소 추천
- "에너지 절약" 완료 → 탄소 흡수량 높은 장소 추천

**파일**: `src/utils/habitLocationMapper.js` (새로 생성)

---

### 2. 환경 기여도 시각화 ⭐⭐ (우선순위: 매우 높음)

**아이디어**: 습관 완료 시 해당 장소에서 얻을 수 있는 환경 기여도를 실시간으로 표시

**구현 내용**:
```javascript
// 습관 완료 시 환경 기여도 계산
function calculateEnvironmentalImpact(habitCompletion, location) {
  const completedCount = Object.values(habitCompletion).filter(Boolean).length;
  
  // 습관 완료 개수에 따른 CO2 절감량 계산
  const co2Reduction = completedCount * 0.1; // 습관당 0.1kg CO2
  
  // 장소의 탄소 흡수량과 결합
  const totalImpact = co2Reduction + (location.details.carbonAbsorption * 0.1);
  
  return {
    co2Reduction: co2Reduction.toFixed(2),
    totalImpact: totalImpact.toFixed(2),
    message: `오늘 ${completedCount}개 습관 완료 → 이 장소에서 ${totalImpact}kg CO2 절감 가능`
  };
}
```

**UI 표시**:
- LocationModal에 "환경 기여도" 섹션 추가
- 습관 완료 개수에 따라 동적으로 메시지 변경
- "오늘 3개 습관 완료 → 이 공원에서 0.5kg CO2 절감 가능" 같은 메시지

**파일**: 
- `src/utils/environmentalImpact.js` (새로 생성)
- `src/components/Map/LocationModal.jsx` (수정)

---

### 3. 습관-장소 챌린지 시스템 ⭐ (우선순위: 중간)

**아이디어**: 특정 장소 방문 + 습관 완료 = 보너스 포인트/배지

**구현 내용**:
```javascript
// 챌린지 데이터 구조
const challenges = [
  {
    id: 'park-walk',
    name: '공원에서 걷기',
    description: '공원 방문 + 걷기 습관 완료',
    locationTypes: ['PARK'],
    requiredHabits: ['walk', 'park'],
    reward: {
      type: 'points',
      amount: 50,
      badge: 'park-explorer'
    }
  },
  {
    id: 'trail-energy',
    name: '산책로에서 에너지 절약',
    description: '산책로 방문 + 에너지 절약 습관 완료',
    locationTypes: ['TRAIL'],
    requiredHabits: ['energy', 'walk'],
    reward: {
      type: 'points',
      amount: 30,
      badge: 'eco-hiker'
    }
  }
];
```

**UI 표시**:
- 지도에서 챌린지 가능한 장소에 특별 마커 표시
- LocationModal에 "오늘의 챌린지" 섹션 추가
- 챌린지 완료 시 축하 모달 + 배지 획득

**파일**: 
- `src/data/challenges.js` (새로 생성)
- `src/components/Map/ChallengeBadge.jsx` (새로 생성)

---

### 4. 습관 달성률 기반 필터링 ⭐ (우선순위: 중간)

**아이디어**: 습관 달성률에 따라 지도에 표시되는 장소 필터링

**구현 내용**:
```javascript
// 습관 달성률에 따른 필터링
function getFilteredLocations(habitCompletionRate) {
  if (habitCompletionRate >= 80) {
    // 높은 달성률: 모든 장소 표시
    return greenLocations;
  } else if (habitCompletionRate >= 50) {
    // 중간 달성률: 점수 70점 이상만 표시
    return greenLocations.filter(loc => loc.score >= 70);
  } else {
    // 낮은 달성률: 점수 85점 이상만 표시 + 동기 부여 메시지
    return greenLocations.filter(loc => loc.score >= 85);
  }
}
```

**UI 표시**:
- 지도 상단에 "습관 달성률: 60% → 더 많은 장소를 보려면 습관을 완료하세요!" 메시지
- 낮은 달성률일 때 "이 장소 방문으로 습관 달성 도움" 메시지

**파일**: 
- `src/utils/locationFilter.js` (새로 생성)
- `src/components/Map/GreenMap.jsx` (수정)

---

### 5. 스트릭 기반 특별 장소 해금 ⭐⭐ (우선순위: 높음)

**아이디어**: 연속 달성 일수에 따라 특별한 장소가 해금됨

**구현 내용**:
```javascript
// 스트릭 기반 특별 장소
const specialLocations = {
  3: {
    name: '숨겨진 명소',
    locations: greenLocations.filter(loc => loc.score >= 90),
    message: '3일 연속 달성! 최고 점수 장소가 해금되었어요'
  },
  7: {
    name: '프리미엄 명소',
    locations: greenLocations.filter(loc => loc.score >= 95),
    message: '7일 연속 달성! 프리미엄 장소가 해금되었어요'
  },
  14: {
    name: '레전드 명소',
    locations: greenLocations.filter(loc => loc.score === 100),
    message: '14일 연속 달성! 레전드 장소가 해금되었어요'
  }
};
```

**UI 표시**:
- 스트릭 달성 시 축하 모달 + 해금된 장소 알림
- 지도에서 해금된 장소에 특별 마커 표시 (예: 별 모양)
- StatsPage에 "해금된 장소" 섹션 추가

**파일**: 
- `src/utils/specialLocations.js` (새로 생성)
- `src/components/Map/SpecialLocationMarker.jsx` (새로 생성)

---

### 6. 습관 완료 → 장소 방문 추적 ⭐ (우선순위: 중간)

**아이디어**: 습관 완료 후 실제로 해당 장소를 방문했는지 추적

**구현 내용**:
```javascript
// 방문 기록 저장
function recordLocationVisit(locationId, habitIds) {
  const visit = {
    locationId,
    habitIds,
    date: format(new Date(), 'yyyy-MM-dd'),
    timestamp: Date.now()
  };
  
  // localStorage에 저장
  const visits = getItem('location-visits', []);
  visits.push(visit);
  setItem('location-visits', visits);
}

// 방문 통계 계산
function getVisitStats() {
  const visits = getItem('location-visits', []);
  const last30Days = visits.filter(v => {
    const visitDate = new Date(v.timestamp);
    const daysAgo = (Date.now() - visitDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  });
  
  return {
    totalVisits: last30Days.length,
    uniqueLocations: new Set(last30Days.map(v => v.locationId)).size,
    habitsCompleted: last30Days.reduce((sum, v) => sum + v.habitIds.length, 0)
  };
}
```

**UI 표시**:
- LocationModal에 "이 장소에서 완료한 습관" 표시
- StatsPage에 "방문한 장소" 섹션 추가
- 지도에서 방문한 장소에 체크마크 표시

**파일**: 
- `src/utils/visitTracker.js` (새로 생성)
- `src/components/Map/VisitBadge.jsx` (새로 생성)

---

### 7. 습관별 환경 기여도 차트 ⭐ (우선순위: 낮음)

**아이디어**: 각 습관이 환경에 미치는 영향을 시각화

**구현 내용**:
```javascript
// 습관별 환경 기여도
const habitImpact = {
  'walk': { co2: 0.1, description: '대중교통 이용으로 CO2 절감' },
  'recycle': { co2: 0.2, description: '재활용으로 폐기물 감소' },
  'energy': { co2: 0.3, description: '에너지 절약으로 CO2 절감' },
  // ...
};

// 차트 데이터 생성
function getHabitImpactChart(habitCompletion) {
  return Object.entries(habitCompletion)
    .filter(([_, completed]) => completed)
    .map(([habitId, _]) => ({
      habit: ecoHabits.find(h => h.id === habitId)?.text,
      impact: habitImpact[habitId]?.co2 || 0
    }));
}
```

**UI 표시**:
- StatsPage에 "습관별 환경 기여도" 바 차트 추가
- 각 습관이 얼마나 환경에 도움이 되는지 시각화

**파일**: 
- `src/utils/habitImpact.js` (새로 생성)
- `src/pages/StatsPage.jsx` (수정)

---

## 📋 구현 우선순위

### Phase 1 (즉시 구현) - 핵심 연동
1. **습관별 맞춤 추천 시스템** ⭐
   - 각 습관과 관련된 장소 타입 추천
   - 구현 난이도: 낮음
   - 사용자 가치: 높음

2. **환경 기여도 시각화** ⭐⭐
   - 습관 완료 → 장소 방문의 환경 기여도 표시
   - 구현 난이도: 중간
   - 사용자 가치: 매우 높음

3. **스트릭 기반 특별 장소 해금** ⭐⭐
   - 연속 달성 일수에 따른 특별 장소 해금
   - 구현 난이도: 중간
   - 사용자 가치: 높음 (게이미피케이션)

### Phase 2 (다음 단계) - 고급 기능
4. **습관-장소 챌린지 시스템** ⭐
   - 특정 장소 방문 + 습관 완료 = 보너스
   - 구현 난이도: 높음
   - 사용자 가치: 중간

5. **습관 달성률 기반 필터링** ⭐
   - 달성률에 따른 장소 필터링
   - 구현 난이도: 낮음
   - 사용자 가치: 중간

6. **습관 완료 → 장소 방문 추적** ⭐
   - 방문 기록 및 통계
   - 구현 난이도: 중간
   - 사용자 가치: 중간

### Phase 3 (향후) - 확장 기능
7. **습관별 환경 기여도 차트** ⭐
   - 각 습관의 환경 기여도 시각화
   - 구현 난이도: 낮음
   - 사용자 가치: 낮음

---

## 🎨 UI/UX 개선 사항

### 1. 습관 완료 시 즉각적인 피드백
- 습관 체크 시 지도 탭으로 자동 전환 (선택적)
- "이 습관 완료로 추천된 장소" 토스트 알림
- 추천 장소 마커에 펄스 애니메이션 강화

### 2. 지도에서 습관 연관성 표시
- LocationModal에 "이 장소에서 할 수 있는 습관" 섹션 추가
- 예: "광교 호수공원 → 걷기, 공원 방문, 녹지 이용 습관 완료 가능"

### 3. 습관 트래커에서 지도 연동
- TrackerPage에 "오늘 추천 장소" 미리보기 카드 추가
- 습관 완료 시 "이 장소 방문하기" 버튼 표시

---

## 📝 구현 예시 코드

### 습관별 맞춤 추천 구현

```javascript
// src/utils/habitLocationMapper.js
import { greenLocations } from '../data/mockClimateData';
import { ecoHabits } from '../data/mockClimateData';

const habitLocationMapping = {
  'walk': ['TRAIL'],
  'park': ['PARK'],
  'energy': ['PARK', 'TRAIL'],
  'recycle': ['PARK'],
  'local': ['PARK'],
  'water': ['PARK'],
  'waste': ['PARK', 'TRAIL'],
  'green': ['PARK', 'TRAIL', 'SHELTER'],
};

export function getRecommendedLocationsByHabits(habitCompletion) {
  const completedHabits = Object.entries(habitCompletion)
    .filter(([_, completed]) => completed)
    .map(([habitId, _]) => habitId);
  
  if (completedHabits.length === 0) {
    return [];
  }
  
  // 완료된 습관과 관련된 장소 타입 찾기
  const relevantTypes = new Set();
  completedHabits.forEach(habitId => {
    const types = habitLocationMapping[habitId] || [];
    types.forEach(type => relevantTypes.add(type));
  });
  
  // 관련 타입의 장소 필터링 및 정렬
  return greenLocations
    .filter(loc => relevantTypes.has(loc.type))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
```

### 환경 기여도 계산 구현

```javascript
// src/utils/environmentalImpact.js
export function calculateEnvironmentalImpact(habitCompletion, location) {
  const completedCount = Object.values(habitCompletion).filter(Boolean).length;
  
  // 습관 완료 개수에 따른 CO2 절감량 (kg)
  const co2Reduction = completedCount * 0.1;
  
  // 장소의 탄소 흡수량과 결합 (톤 → kg 변환)
  const locationCarbon = location.details.carbonAbsorption * 1000; // 톤 → kg
  const totalImpact = co2Reduction + (locationCarbon * 0.1);
  
  // 나무 심기 개수 환산 (1그루 나무 = 약 20kg CO2/년)
  const treeEquivalent = Math.round(totalImpact / 20);
  
  return {
    co2Reduction: co2Reduction.toFixed(2),
    totalImpact: totalImpact.toFixed(2),
    treeEquivalent,
    message: `오늘 ${completedCount}개 습관 완료 → 이 장소에서 ${totalImpact}kg CO2 절감 가능 (나무 ${treeEquivalent}그루 심기 효과)`
  };
}
```

---

## 🚀 다음 단계

1. **즉시 구현**: 습관별 맞춤 추천 시스템
2. **다음 구현**: 환경 기여도 시각화
3. **향후 구현**: 스트릭 기반 특별 장소 해금

---

**작성일**: 2024년
**최종 업데이트**: 현재

