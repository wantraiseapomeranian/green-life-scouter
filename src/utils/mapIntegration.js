import { greenLocations } from '../data/mockClimateData';
import { format } from 'date-fns';
import { ecoHabits } from '../data/mockClimateData';
import { getItem } from './storage';

/**
 * 습관 완료 상태에 따라 추천 장소 계산
 * @param {Object} habitCompletion - 습관 완료 상태
 * @returns {Array} 추천 장소 배열
 */
export function getRecommendedLocations(habitCompletion = {}) {
  const completedCount = Object.values(habitCompletion).filter(Boolean).length;
  const allCompleted = ecoHabits.every((habit) => habitCompletion[habit.id]);

  if (allCompleted) {
    // 모든 습관 완료 시: 점수가 높은 곳 추천
    return greenLocations
      .filter((loc) => loc.score >= 85)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  } else if (completedCount >= 5) {
    // 5개 이상 완료 시: 탄소 흡수량 높은 곳 추천
    return greenLocations
      .filter((loc) => loc.details.carbonAbsorption >= 2.0)
      .sort((a, b) => b.details.carbonAbsorption - a.details.carbonAbsorption)
      .slice(0, 3);
  } else if (completedCount >= 3) {
    // 3개 이상 완료 시: 열쾌적성 높은 곳 추천
    return greenLocations
      .filter((loc) => loc.details.thermalComfort >= 85)
      .sort((a, b) => b.details.thermalComfort - a.details.thermalComfort)
      .slice(0, 3);
  }

  return [];
}

/**
 * 오늘의 습관 완료 상태 가져오기
 * @returns {Object} 습관 완료 상태
 */
export function getTodayHabitCompletion() {
  const today = format(new Date(), 'yyyy-MM-dd');
  return getItem(`habits-${today}`, {});
}

/**
 * 연속 달성 일수에 따라 특별 표시할 장소 계산
 * @param {number} streak - 연속 달성 일수
 * @returns {Array} 특별 표시할 장소 배열
 */
export function getSpecialLocationsByStreak(streak) {
  if (streak >= 7) {
    // 7일 이상 연속 달성: 최고 점수 장소
    return greenLocations
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);
  } else if (streak >= 3) {
    // 3일 이상 연속 달성: 점수 상위 3개
    return greenLocations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
  return [];
}

