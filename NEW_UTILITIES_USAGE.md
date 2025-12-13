# 🛠️ 새로 생성된 유틸리티 파일 사용 가이드

## 📁 파일 목록

1. `src/utils/environmentalImpact.js` - 환경 기여도 계산
2. `src/utils/habitLocationMapper.js` - 습관별 맞춤 추천
3. `src/utils/specialLocations.js` - 스트릭 기반 특별 장소 해금

---

## 1. environmentalImpact.js - 환경 기여도 계산

### 📌 목적
습관 완료에 따른 환경 기여도(CO2 절감량)를 계산하고 시각화합니다.

### 🔧 주요 함수

#### `calculateEnvironmentalImpact(habitCompletion, location?)`
습관 완료에 따른 환경 기여도를 계산합니다.

**파라미터:**
- `habitCompletion`: 습관 완료 상태 객체 `{ [habitId]: boolean }`
- `location`: (선택) 장소 객체

**반환값:**
```javascript
{
  completedCount: 3,              // 완료한 습관 개수
  totalCO2: 1.05,                 // 총 CO2 절감량 (kg)
  locationBonus: 0.0024,          // 장소 보너스 (kg)
  totalImpact: 1.0524,            // 총 환경 기여도 (kg)
  treeEquivalent: 19.1,           // 나무 심기 개수 환산
  carKmEquivalent: 8.8,            // 자동차 주행 거리 환산 (km)
  message: "대단해요! 3개 습관으로 1.05kg CO2 절감!...",
  locationMessage: "이 장소에서 2.4g 추가 효과!",
  impactBreakdown: [               // 습관별 상세 내역
    {
      habitId: 1,
      habitText: "텀블러 사용하기",
      co2: 0.15,
      description: "일회용 컵 1개 = 약 15g CO2",
      category: "waste"
    },
    // ...
  ]
}
```

**사용 예시:**
```javascript
import { calculateEnvironmentalImpact } from '../utils/environmentalImpact';

// 습관 완료 상태
const habitCompletion = {
  1: true,  // 텀블러 사용하기
  2: true,  // 대중교통 이용하기
  5: true,  // 플러그 뽑기
};

// 환경 기여도 계산
const impact = calculateEnvironmentalImpact(habitCompletion);

console.log(impact.message);
// "대단해요! 3개 습관으로 1.05kg CO2 절감! 나무 19.1그루가 하루 동안 흡수하는 양이에요."

// 장소와 함께 계산
const location = {
  name: "광교 호수공원",
  details: {
    carbonAbsorption: 2.4  // 톤/년
  }
};

const impactWithLocation = calculateEnvironmentalImpact(habitCompletion, location);
console.log(impactWithLocation.locationMessage);
// "이 장소에서 2.4g 추가 효과!"
```

#### `calculateLocationImpact(location, habitCompletion)`
장소별 환경 기여도를 계산합니다.

**사용 예시:**
```javascript
import { calculateLocationImpact } from '../utils/environmentalImpact';

const locationImpact = calculateLocationImpact(location, habitCompletion);

// 반환값에 추가로 포함:
// - locationScore: 장소의 환경 지표
// - benefitMessage: 장소 방문 시 예상 효과 메시지
// - locationName: 장소 이름
```

#### `getCategoryBreakdown(habitCompletion)`
카테고리별 CO2 절감량을 반환합니다.

**사용 예시:**
```javascript
import { getCategoryBreakdown } from '../utils/environmentalImpact';

const breakdown = getCategoryBreakdown(habitCompletion);
// [
//   { category: 'waste', label: '폐기물 절감', co2: 0.5, color: '#10b981' },
//   { category: 'transport', label: '이동 수단', co2: 0.8, color: '#3b82f6' },
//   { category: 'energy', label: '에너지 절약', co2: 0.3, color: '#f59e0b' },
//   { category: 'food', label: '식습관', co2: 1.5, color: '#ef4444' },
// ]
```

#### `getHabitImpactList()`
모든 습관의 환경 기여도 데이터를 반환합니다.

**사용 예시:**
```javascript
import { getHabitImpactList } from '../utils/environmentalImpact';

const habitList = getHabitImpactList();
// 각 습관에 co2, description, category 정보가 포함됨
```

### 💡 실제 사용 예시 (LocationModal)

```javascript
// LocationModal.jsx에서 사용
import { calculateLocationImpact } from '../../utils/environmentalImpact';
import { getTodayHabitCompletion } from '../../utils/mapIntegration';

export default function LocationModal({ location, onClose }) {
  const habitCompletion = getTodayHabitCompletion();
  const environmentalImpact = calculateLocationImpact(location, habitCompletion);

  return (
    <div>
      {/* 환경 기여도 표시 */}
      {environmentalImpact.completedCount > 0 && (
        <div className="bg-emerald-50 p-4 rounded-lg">
          <p className="font-bold text-emerald-800">
            {environmentalImpact.totalCO2}kg CO2 절감
          </p>
          <p className="text-sm text-gray-600">
            {environmentalImpact.message}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            나무 {environmentalImpact.treeEquivalent}그루 심기 효과
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 2. habitLocationMapper.js - 습관별 맞춤 추천

### 📌 목적
완료된 습관에 따라 관련된 장소 타입을 추천합니다.

### 🔧 주요 함수

#### `getRecommendedLocationsByHabits(habitCompletion)`
완료된 습관에 따라 맞춤 추천 장소를 반환합니다.

**파라미터:**
- `habitCompletion`: 습관 완료 상태 객체 `{ [habitId]: boolean }`

**반환값:**
```javascript
[
  {
    id: 1,
    name: "광교 호수공원",
    type: "PARK",
    score: 92,
    details: { ... },
    recommendReason: {
      habitId: 1,
      habitText: "텀블러 사용하기",
      description: "친환경 생활을 실천하셨네요! 깨끗한 공원에서 휴식하세요"
    },
    sortedBy: "greenCoverage"
  },
  // 최대 5개
]
```

**사용 예시:**
```javascript
import { getRecommendedLocationsByHabits } from '../utils/habitLocationMapper';

const habitCompletion = {
  1: true,  // 텀블러 사용하기 → PARK 추천
  2: true,  // 대중교통 이용하기 → TRAIL 추천
};

const recommended = getRecommendedLocationsByHabits(habitCompletion);
// PARK와 TRAIL 타입의 장소가 추천됨
// 정렬 기준: 가장 많이 선택된 정렬 기준 (greenCoverage, thermalComfort 등)
```

#### `getLocationTypesForHabit(habitId)`
특정 습관에 맞는 장소 타입을 반환합니다.

**사용 예시:**
```javascript
import { getLocationTypesForHabit } from '../utils/habitLocationMapper';

const types = getLocationTypesForHabit(1); // 텀블러 사용하기
// ['PARK']
```

#### `getHabitsForLocation(location)`
특정 장소에서 수행할 수 있는 습관을 반환합니다.

**사용 예시:**
```javascript
import { getHabitsForLocation } from '../utils/habitLocationMapper';

const location = {
  type: 'PARK',
  name: '광교 호수공원'
};

const relatedHabits = getHabitsForLocation(location);
// [
//   {
//     id: 1,
//     text: "텀블러 사용하기",
//     recommendation: "친환경 생활을 실천하셨네요! 깨끗한 공원에서 휴식하세요"
//   },
//   // ...
// ]
```

#### `getHabitCompletionMessage(habitId)`
습관 완료 시 표시할 추천 메시지를 반환합니다.

**사용 예시:**
```javascript
import { getHabitCompletionMessage } from '../utils/habitLocationMapper';

const message = getHabitCompletionMessage(1);
// "친환경 생활을 실천하셨네요! 깨끗한 공원에서 휴식하세요"
```

### 💡 실제 사용 예시 (App.jsx)

```javascript
// App.jsx에서 기존 추천 로직 대체
import { getRecommendedLocationsByHabits } from './utils/habitLocationMapper';
import { getTodayHabitCompletion } from './utils/mapIntegration';

function App() {
  const [habitCompletion, setHabitCompletion] = useState({});
  const [recommendedLocations, setRecommendedLocations] = useState([]);

  useEffect(() => {
    const todayCompletion = getTodayHabitCompletion();
    setHabitCompletion(todayCompletion);
    
    // 기존: getRecommendedLocations(todayCompletion)
    // 새로운: 습관별 맞춤 추천
    const recommended = getRecommendedLocationsByHabits(todayCompletion);
    setRecommendedLocations(recommended);
  }, [activeTab]);
}
```

### 💡 실제 사용 예시 (LocationModal)

```javascript
// LocationModal.jsx에서 "이 장소에서 할 수 있는 습관" 표시
import { getHabitsForLocation } from '../../utils/habitLocationMapper';

export default function LocationModal({ location, onClose }) {
  const relatedHabits = getHabitsForLocation(location);

  return (
    <div>
      <h3>이 장소에서 할 수 있는 습관</h3>
      {relatedHabits.map(habit => (
        <div key={habit.id}>
          <p>{habit.text}</p>
          <p className="text-sm text-gray-600">{habit.recommendation}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 3. specialLocations.js - 스트릭 기반 특별 장소 해금

### 📌 목적
연속 달성 일수(스트릭)에 따라 특별한 장소를 해금합니다.

### 🔧 주요 함수

#### `getCurrentTier(streak)`
현재 스트릭에 해당하는 티어를 반환합니다.

**티어 시스템:**
- **BRONZE** (3일 이상): 숨겨진 명소 (85점 이상)
- **SILVER** (7일 이상): 프리미엄 명소 (88점 이상)
- **GOLD** (14일 이상): 레전드 명소 (90점 이상)

**사용 예시:**
```javascript
import { getCurrentTier } from '../utils/specialLocations';

const tier = getCurrentTier(5); // 5일 연속 달성
// {
//   tier: 'BRONZE',
//   name: '브론즈',
//   label: '숨겨진 명소',
//   color: '#cd7f32',
//   minScore: 85,
//   message: '3일 연속 달성! 숨겨진 명소가 해금되었어요',
//   icon: 'Star'
// }
```

#### `getUnlockedSpecialLocations(streak)`
스트릭에 따라 해금된 특별 장소를 반환합니다.

**사용 예시:**
```javascript
import { getUnlockedSpecialLocations } from '../utils/specialLocations';

const streak = 7; // 7일 연속 달성
const specialLocations = getUnlockedSpecialLocations(streak);
// [
//   {
//     id: 1,
//     name: "광교 호수공원",
//     score: 92,
//     isSpecial: true,
//     tierUnlocked: 'SILVER',
//     tierInfo: { ... }
//   },
//   // 88점 이상인 모든 장소
// ]
```

#### `getSpecialLocationInfo(locationId, streak)`
특정 장소가 특별 장소인지 확인합니다.

**사용 예시:**
```javascript
import { getSpecialLocationInfo } from '../utils/specialLocations';

const specialInfo = getSpecialLocationInfo(1, 7); // locationId: 1, streak: 7
// {
//   isSpecial: true,
//   tierInfo: { ... },
//   bonusMessage: "실버 티어 특별 장소! 스트릭 7일 유지 보상"
// }
```

#### `getNextTierInfo(streak)`
다음 티어까지 필요한 일수를 계산합니다.

**사용 예시:**
```javascript
import { getNextTierInfo } from '../utils/specialLocations';

const nextTier = getNextTierInfo(5); // 현재 5일
// {
//   tier: { ...SILVER_TIER_INFO },
//   daysRemaining: 2,
//   message: "2일 더 달성하면 프리미엄 명소가 해금돼요!"
// }
```

#### `getStreakProgress(streak)`
스트릭 진행 상황을 반환합니다.

**사용 예시:**
```javascript
import { getStreakProgress } from '../utils/specialLocations';

const progress = getStreakProgress(5);
// {
//   streak: 5,
//   currentTier: { ...BRONZE_TIER },
//   nextTierInfo: { ...SILVER_TIER_INFO },
//   unlockedCount: 3,
//   totalSpecialLocations: 5,
//   progressPercent: 50,
//   progressMessage: "2일 후 실버 등급!"
// }
```

#### `getStreakCelebration(previousStreak, currentStreak)`
티어 변경 시 축하 메시지를 반환합니다.

**사용 예시:**
```javascript
import { getStreakCelebration } from '../utils/specialLocations';

// 2일 → 3일 (브론즈 티어 달성)
const celebration = getStreakCelebration(2, 3);
// {
//   tierAchieved: { ...BRONZE_TIER },
//   message: "3일 연속 달성! 숨겨진 명소가 해금되었어요",
//   newLocationsCount: 3,
//   newLocations: [ ... ],
//   celebrationType: "bronze"
// }
```

#### `getLockedLocations(streak)`
아직 해금되지 않은 고득점 장소를 반환합니다.

**사용 예시:**
```javascript
import { getLockedLocations } from '../utils/specialLocations';

const locked = getLockedLocations(5);
// [
//   {
//     id: 1,
//     name: "광교 호수공원",
//     score: 92,
//     isLocked: true,
//     requiredTier: { ...SILVER_TIER },
//     unlockMessage: "7일 연속 달성 시 해금"
//   }
// ]
```

### 💡 실제 사용 예시 (GreenMap.jsx)

```javascript
// GreenMap.jsx에서 특별 장소 마커 표시
import { getSpecialLocationInfo, getCurrentTier } from '../../utils/specialLocations';
import { calculateStreak } from '../../utils/habitUtils';

export default function GreenMap({ recommendedLocations = [] }) {
  const streak = calculateStreak();
  const currentTier = getCurrentTier(streak);

  return (
    <MapContainer>
      {greenLocations.map((location) => {
        const specialInfo = getSpecialLocationInfo(location.id, streak);
        const isRecommended = recommendedIds.includes(location.id);
        
        return (
          <Marker
            key={location.id}
            icon={createCustomIcon(location.type, isRecommended, specialInfo)}
            // ...
          />
        );
      })}
    </MapContainer>
  );
}
```

### 💡 실제 사용 예시 (TrackerPage.jsx)

```javascript
// TrackerPage.jsx에서 티어 달성 축하
import { getStreakCelebration } from '../../utils/specialLocations';
import { calculateStreak } from '../../utils/habitUtils';

export default function TrackerPage({ onHabitChange }) {
  const [previousStreak, setPreviousStreak] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const newStreak = calculateStreak();
    setStreak(newStreak);
    
    // 티어 변경 확인
    const celebration = getStreakCelebration(previousStreak, newStreak);
    if (celebration) {
      setShowCelebration(true);
      // 축하 모달 표시
    }
    
    setPreviousStreak(newStreak);
  }, [checkedHabits]);

  return (
    <div>
      {/* 스트릭 배지 */}
      <StreakBadge streak={streak} />
      
      {/* 티어 정보 */}
      {currentTier && (
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="font-bold">{currentTier.label}</p>
          <p className="text-sm">{currentTier.message}</p>
        </div>
      )}
    </div>
  );
}
```

### 💡 실제 사용 예시 (StatsPage.jsx)

```javascript
// StatsPage.jsx에서 스트릭 진행 상황 표시
import { getStreakProgress, getUnlockedSpecialLocations } from '../../utils/specialLocations';

export default function StatsPage() {
  const streak = calculateStreak();
  const progress = getStreakProgress(streak);
  const unlockedLocations = getUnlockedSpecialLocations(streak);

  return (
    <div>
      {/* 진행 상황 바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>스트릭 진행</span>
          <span>{progress.progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {progress.progressMessage}
        </p>
      </div>

      {/* 해금된 특별 장소 */}
      {unlockedLocations.length > 0 && (
        <div>
          <h3>해금된 특별 장소 ({unlockedLocations.length}개)</h3>
          {unlockedLocations.map(loc => (
            <div key={loc.id}>
              <p>{loc.name}</p>
              <p className="text-xs">{loc.tierInfo.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 통합 사용 예시

### App.jsx에서 모든 기능 통합

```javascript
import { useState, useEffect } from 'react';
import { getTodayHabitCompletion } from './utils/mapIntegration';
import { getRecommendedLocationsByHabits } from './utils/habitLocationMapper';
import { getUnlockedSpecialLocations } from './utils/specialLocations';
import { calculateStreak } from './utils/habitUtils';

function App() {
  const [habitCompletion, setHabitCompletion] = useState({});
  const [recommendedLocations, setRecommendedLocations] = useState([]);
  const [specialLocations, setSpecialLocations] = useState([]);

  useEffect(() => {
    const todayCompletion = getTodayHabitCompletion();
    const streak = calculateStreak();
    
    setHabitCompletion(todayCompletion);
    
    // 습관별 맞춤 추천
    const recommended = getRecommendedLocationsByHabits(todayCompletion);
    setRecommendedLocations(recommended);
    
    // 스트릭 기반 특별 장소
    const special = getUnlockedSpecialLocations(streak);
    setSpecialLocations(special);
  }, [activeTab]);

  return (
    // ...
  );
}
```

---

## 📝 주의사항

1. **습관 ID 매핑**: `habitLocationMapper.js`와 `environmentalImpact.js`는 습관 ID를 숫자로 사용합니다.
   - 습관 ID는 `mockClimateData.js`의 `ecoHabits` 배열의 `id` 필드와 일치해야 합니다.

2. **장소 타입**: `habitLocationMapper.js`는 장소 타입(`PARK`, `TRAIL`, `SHELTER`)을 사용합니다.
   - 장소 객체의 `type` 필드와 일치해야 합니다.

3. **스트릭 계산**: `specialLocations.js`는 `calculateStreak()` 함수를 사용합니다.
   - `habitUtils.js`의 `calculateStreak()` 함수와 함께 사용해야 합니다.

4. **데이터 일관성**: 모든 유틸리티는 `mockClimateData.js`의 데이터 구조를 가정합니다.
   - 실제 API 연동 시 데이터 구조가 변경되면 유틸리티도 수정이 필요합니다.

---

## 🚀 다음 단계

이 유틸리티들을 실제 컴포넌트에 통합하려면:

1. **App.jsx**: 습관별 추천과 특별 장소 로직 통합
2. **LocationModal.jsx**: 환경 기여도 표시 (이미 부분적으로 구현됨)
3. **TrackerPage.jsx**: 티어 달성 축하 모달 추가
4. **StatsPage.jsx**: 스트릭 진행 상황 및 해금된 장소 표시

---

**작성일**: 2024년
**최종 업데이트**: 현재

