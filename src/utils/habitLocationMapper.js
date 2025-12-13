import { greenLocations, ecoHabits } from '../data/mockClimateData';

/**
 * 습관별 추천 장소 타입 매핑
 * 각 습관과 관련된 장소 타입을 정의
 */
const habitLocationMapping = {
  1: { // 텀블러 사용하기
    types: ['PARK'],
    sortBy: 'greenCoverage',
    description: '친환경 생활을 실천하셨네요! 깨끗한 공원에서 휴식하세요',
  },
  2: { // 대중교통 이용하기
    types: ['TRAIL'],
    sortBy: 'thermalComfort',
    description: '걷기 습관과 함께 산책로를 이용해보세요',
  },
  3: { // 일회용품 거절하기
    types: ['PARK', 'TRAIL'],
    sortBy: 'pm10Reduction',
    description: '맑은 공기를 느낄 수 있는 녹지를 추천해요',
  },
  4: { // 장바구니 사용하기
    types: ['PARK'],
    sortBy: 'greenCoverage',
    description: '환경 보호 습관에 맞는 녹지 공간이에요',
  },
  5: { // 플러그 뽑기
    types: ['PARK', 'TRAIL'],
    sortBy: 'carbonAbsorption',
    description: '에너지 절약과 함께 탄소 흡수량 높은 곳을 방문해보세요',
  },
  6: { // 계단 이용하기
    types: ['TRAIL'],
    sortBy: 'thermalComfort',
    description: '운동을 좋아하시네요! 산책로를 추천해요',
  },
  7: { // 채식 한 끼 실천
    types: ['PARK'],
    sortBy: 'greenCoverage',
    description: '자연과 함께하는 식사 후 공원에서 산책해보세요',
  },
  8: { // 쓰레기 분리수거
    types: ['PARK', 'TRAIL'],
    sortBy: 'pm10Reduction',
    description: '깨끗한 환경을 위한 노력! 맑은 공기의 녹지를 즐기세요',
  },
};

/**
 * 완료된 습관에 따라 맞춤 추천 장소 반환
 * @param {Object} habitCompletion - 습관 완료 상태 { [habitId]: boolean }
 * @returns {Array} 추천 장소 배열 (최대 5개)
 */
export function getRecommendedLocationsByHabits(habitCompletion) {
  const completedHabits = Object.entries(habitCompletion)
    .filter(([_, completed]) => completed)
    .map(([habitId, _]) => parseInt(habitId));

  if (completedHabits.length === 0) {
    return [];
  }

  // 완료된 습관과 관련된 장소 타입 및 정렬 기준 수집
  const relevantTypes = new Set();
  const sortCriteria = new Map();

  completedHabits.forEach((habitId) => {
    const mapping = habitLocationMapping[habitId];
    if (mapping) {
      mapping.types.forEach((type) => relevantTypes.add(type));
      // 정렬 기준 가중치 누적
      const current = sortCriteria.get(mapping.sortBy) || 0;
      sortCriteria.set(mapping.sortBy, current + 1);
    }
  });

  // 가장 많이 선택된 정렬 기준 결정
  let primarySortBy = 'score';
  let maxCount = 0;
  sortCriteria.forEach((count, criteria) => {
    if (count > maxCount) {
      maxCount = count;
      primarySortBy = criteria;
    }
  });

  // 관련 타입의 장소 필터링 및 정렬
  const filteredLocations = greenLocations.filter((loc) =>
    relevantTypes.has(loc.type)
  );

  // 정렬
  const sortedLocations = filteredLocations.sort((a, b) => {
    if (primarySortBy === 'score') {
      return b.score - a.score;
    }
    return (b.details[primarySortBy] || 0) - (a.details[primarySortBy] || 0);
  });

  // 최대 5개 반환, 추천 이유 포함
  return sortedLocations.slice(0, 5).map((loc) => ({
    ...loc,
    recommendReason: getRecommendReason(completedHabits, loc),
    sortedBy: primarySortBy,
  }));
}

/**
 * 추천 이유 생성
 */
function getRecommendReason(completedHabitIds, location) {
  const reasons = [];

  completedHabitIds.forEach((habitId) => {
    const mapping = habitLocationMapping[habitId];
    if (mapping && mapping.types.includes(location.type)) {
      const habit = ecoHabits.find((h) => h.id === habitId);
      if (habit) {
        reasons.push({
          habitId,
          habitText: habit.text,
          description: mapping.description,
        });
      }
    }
  });

  return reasons.length > 0 ? reasons[0] : null;
}

/**
 * 특정 습관에 맞는 장소 타입 반환
 * @param {number} habitId - 습관 ID
 * @returns {Array} 관련 장소 타입 배열
 */
export function getLocationTypesForHabit(habitId) {
  const mapping = habitLocationMapping[habitId];
  return mapping ? mapping.types : [];
}

/**
 * 특정 장소에서 수행할 수 있는 습관 반환
 * @param {Object} location - 장소 객체
 * @returns {Array} 관련 습관 배열
 */
export function getHabitsForLocation(location) {
  const relatedHabits = [];

  Object.entries(habitLocationMapping).forEach(([habitId, mapping]) => {
    if (mapping.types.includes(location.type)) {
      const habit = ecoHabits.find((h) => h.id === parseInt(habitId));
      if (habit) {
        relatedHabits.push({
          ...habit,
          recommendation: mapping.description,
        });
      }
    }
  });

  return relatedHabits;
}

/**
 * 습관 완료 시 표시할 추천 메시지 생성
 * @param {number} habitId - 완료한 습관 ID
 * @returns {string|null} 추천 메시지
 */
export function getHabitCompletionMessage(habitId) {
  const mapping = habitLocationMapping[habitId];
  return mapping ? mapping.description : null;
}
