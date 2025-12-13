import { ecoHabits } from '../data/mockClimateData';

/**
 * 습관별 환경 기여도 (CO2 절감량 kg)
 * 각 습관이 환경에 미치는 영향을 수치화
 */
const habitImpactData = {
  1: { // 텀블러 사용하기
    co2: 0.15,
    description: '일회용 컵 1개 = 약 15g CO2',
    category: 'waste',
  },
  2: { // 대중교통 이용하기
    co2: 0.8,
    description: '자가용 대신 대중교통 = 약 800g CO2 절감',
    category: 'transport',
  },
  3: { // 일회용품 거절하기
    co2: 0.1,
    description: '일회용품 1개 = 약 100g CO2',
    category: 'waste',
  },
  4: { // 장바구니 사용하기
    co2: 0.05,
    description: '비닐봉지 1개 = 약 50g CO2',
    category: 'waste',
  },
  5: { // 플러그 뽑기
    co2: 0.2,
    description: '대기전력 절약 = 약 200g CO2',
    category: 'energy',
  },
  6: { // 계단 이용하기
    co2: 0.1,
    description: '엘리베이터 1회 = 약 100g CO2',
    category: 'energy',
  },
  7: { // 채식 한 끼 실천
    co2: 1.5,
    description: '육류 대신 채식 = 약 1.5kg CO2 절감',
    category: 'food',
  },
  8: { // 쓰레기 분리수거
    co2: 0.3,
    description: '올바른 분리수거 = 약 300g CO2 절감',
    category: 'waste',
  },
};

/**
 * 습관 완료에 따른 환경 기여도 계산
 * @param {Object} habitCompletion - 습관 완료 상태 { [habitId]: boolean }
 * @param {Object} location - 장소 객체 (선택적)
 * @returns {Object} 환경 기여도 정보
 */
export function calculateEnvironmentalImpact(habitCompletion, location = null) {
  const completedHabits = Object.entries(habitCompletion)
    .filter(([_, completed]) => completed)
    .map(([habitId, _]) => parseInt(habitId));

  const completedCount = completedHabits.length;

  // 습관별 CO2 절감량 합산
  let totalCO2 = 0;
  const impactBreakdown = [];

  completedHabits.forEach((habitId) => {
    const impact = habitImpactData[habitId];
    const habit = ecoHabits.find((h) => h.id === habitId);
    if (impact && habit) {
      totalCO2 += impact.co2;
      impactBreakdown.push({
        habitId,
        habitText: habit.text,
        co2: impact.co2,
        description: impact.description,
        category: impact.category,
      });
    }
  });

  // 장소의 탄소 흡수량과 결합 (선택적)
  let locationBonus = 0;
  if (location && location.details) {
    // 장소 방문 시 추가 보너스 (장소 탄소 흡수량의 0.1%)
    locationBonus = location.details.carbonAbsorption * 0.001; // 톤 → kg 변환 후 0.1%
  }

  const totalImpact = totalCO2 + locationBonus;

  // 나무 심기 개수 환산 (1그루 나무 = 약 20kg CO2/년, 일일 환산 약 0.055kg)
  const treeDailyAbsorption = 0.055;
  const treeEquivalent = Math.round((totalImpact / treeDailyAbsorption) * 10) / 10;

  // 자동차 주행 거리 환산 (1km = 약 0.12kg CO2)
  const carKmEquivalent = Math.round((totalImpact / 0.12) * 10) / 10;

  // 메시지 생성
  let message = '';
  if (completedCount === 0) {
    message = '오늘 첫 습관을 완료해보세요!';
  } else if (completedCount <= 3) {
    message = `오늘 ${completedCount}개 습관 완료! ${totalImpact.toFixed(2)}kg CO2를 절감했어요.`;
  } else if (completedCount <= 6) {
    message = `대단해요! ${completedCount}개 습관으로 ${totalImpact.toFixed(2)}kg CO2 절감! 나무 ${treeEquivalent}그루가 하루 동안 흡수하는 양이에요.`;
  } else {
    message = `완벽해요! 모든 습관으로 ${totalImpact.toFixed(2)}kg CO2 절감! 자동차 ${carKmEquivalent}km 주행을 막은 효과예요.`;
  }

  // 장소와 연계된 메시지
  let locationMessage = '';
  if (location) {
    locationMessage = `이 장소에서 ${(locationBonus * 1000).toFixed(1)}g 추가 효과!`;
  }

  return {
    completedCount,
    totalCO2: Math.round(totalCO2 * 100) / 100,
    locationBonus: Math.round(locationBonus * 1000) / 1000,
    totalImpact: Math.round(totalImpact * 100) / 100,
    treeEquivalent,
    carKmEquivalent,
    message,
    locationMessage,
    impactBreakdown,
  };
}

/**
 * 장소별 환경 기여도 계산
 * @param {Object} location - 장소 객체
 * @param {Object} habitCompletion - 습관 완료 상태
 * @returns {Object} 장소별 환경 기여도
 */
export function calculateLocationImpact(location, habitCompletion) {
  const baseImpact = calculateEnvironmentalImpact(habitCompletion, location);

  // 장소의 환경 지표 기반 추가 점수
  const locationScore = {
    pm10Reduction: location.details.pm10Reduction,
    carbonAbsorption: location.details.carbonAbsorption,
    thermalComfort: location.details.thermalComfort,
    greenCoverage: location.details.greenCoverage,
  };

  // 장소 방문 시 예상 효과 메시지
  let benefitMessage = '';
  if (location.details.thermalComfort >= 85) {
    benefitMessage = '시원한 그늘에서 휴식하며 에너지를 절약할 수 있어요!';
  } else if (location.details.pm10Reduction >= 80) {
    benefitMessage = '맑은 공기로 건강한 산책을 즐길 수 있어요!';
  } else if (location.details.carbonAbsorption >= 2.0) {
    benefitMessage = '풍부한 녹지에서 자연의 탄소 흡수 효과를 느껴보세요!';
  } else {
    benefitMessage = '자연과 함께하는 시간을 즐겨보세요!';
  }

  return {
    ...baseImpact,
    locationScore,
    benefitMessage,
    locationName: location.name,
  };
}

/**
 * 카테고리별 기여도 요약
 * @param {Object} habitCompletion - 습관 완료 상태
 * @returns {Object} 카테고리별 CO2 절감량
 */
export function getCategoryBreakdown(habitCompletion) {
  const categories = {
    waste: { label: '폐기물 절감', co2: 0, color: '#10b981' },
    transport: { label: '이동 수단', co2: 0, color: '#3b82f6' },
    energy: { label: '에너지 절약', co2: 0, color: '#f59e0b' },
    food: { label: '식습관', co2: 0, color: '#ef4444' },
  };

  Object.entries(habitCompletion)
    .filter(([_, completed]) => completed)
    .forEach(([habitId, _]) => {
      const impact = habitImpactData[parseInt(habitId)];
      if (impact && categories[impact.category]) {
        categories[impact.category].co2 += impact.co2;
      }
    });

  return Object.entries(categories).map(([key, value]) => ({
    category: key,
    ...value,
    co2: Math.round(value.co2 * 100) / 100,
  }));
}

/**
 * 습관별 기여도 데이터 반환
 * @returns {Array} 습관별 기여도 배열
 */
export function getHabitImpactList() {
  return ecoHabits.map((habit) => {
    const impact = habitImpactData[habit.id];
    return {
      ...habit,
      co2: impact?.co2 || 0,
      description: impact?.description || '',
      category: impact?.category || 'other',
    };
  });
}
