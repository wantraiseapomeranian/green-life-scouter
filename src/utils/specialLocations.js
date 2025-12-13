import { greenLocations } from '../data/mockClimateData';

/**
 * 스트릭 기반 특별 장소 해금 시스템
 * 연속 달성 일수에 따라 특별한 장소가 해금됨
 */

/**
 * 스트릭 티어 정의
 */
export const STREAK_TIERS = {
  BRONZE: {
    minDays: 3,
    name: '브론즈',
    label: '숨겨진 명소',
    color: '#cd7f32',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    minScore: 85,
    message: '3일 연속 달성! 숨겨진 명소가 해금되었어요',
    icon: 'Star',
  },
  SILVER: {
    minDays: 7,
    name: '실버',
    label: '프리미엄 명소',
    color: '#c0c0c0',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-700',
    minScore: 88,
    message: '7일 연속 달성! 프리미엄 명소가 해금되었어요',
    icon: 'Crown',
  },
  GOLD: {
    minDays: 14,
    name: '골드',
    label: '레전드 명소',
    color: '#ffd700',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    minScore: 90,
    message: '14일 연속 달성! 레전드 명소가 해금되었어요',
    icon: 'Trophy',
  },
};

/**
 * 현재 스트릭에 해당하는 티어 반환
 * @param {number} streak - 연속 달성 일수
 * @returns {Object|null} 티어 정보
 */
export function getCurrentTier(streak) {
  if (streak >= STREAK_TIERS.GOLD.minDays) {
    return { ...STREAK_TIERS.GOLD, tier: 'GOLD' };
  }
  if (streak >= STREAK_TIERS.SILVER.minDays) {
    return { ...STREAK_TIERS.SILVER, tier: 'SILVER' };
  }
  if (streak >= STREAK_TIERS.BRONZE.minDays) {
    return { ...STREAK_TIERS.BRONZE, tier: 'BRONZE' };
  }
  return null;
}

/**
 * 다음 티어까지 필요한 일수 계산
 * @param {number} streak - 현재 연속 달성 일수
 * @returns {Object|null} 다음 티어 정보와 남은 일수
 */
export function getNextTierInfo(streak) {
  if (streak >= STREAK_TIERS.GOLD.minDays) {
    return null; // 최고 티어 달성
  }

  let nextTier;
  let daysRemaining;

  if (streak >= STREAK_TIERS.SILVER.minDays) {
    nextTier = STREAK_TIERS.GOLD;
    daysRemaining = STREAK_TIERS.GOLD.minDays - streak;
  } else if (streak >= STREAK_TIERS.BRONZE.minDays) {
    nextTier = STREAK_TIERS.SILVER;
    daysRemaining = STREAK_TIERS.SILVER.minDays - streak;
  } else {
    nextTier = STREAK_TIERS.BRONZE;
    daysRemaining = STREAK_TIERS.BRONZE.minDays - streak;
  }

  return {
    tier: nextTier,
    daysRemaining,
    message: `${daysRemaining}일 더 달성하면 ${nextTier.label}이 해금돼요!`,
  };
}

/**
 * 스트릭에 따라 해금된 특별 장소 반환
 * @param {number} streak - 연속 달성 일수
 * @returns {Array} 해금된 특별 장소 배열
 */
export function getUnlockedSpecialLocations(streak) {
  const currentTier = getCurrentTier(streak);

  if (!currentTier) {
    return [];
  }

  // 현재 티어의 최소 점수 이상인 장소 필터링
  const unlockedLocations = greenLocations
    .filter((loc) => loc.score >= currentTier.minScore)
    .sort((a, b) => b.score - a.score)
    .map((loc) => ({
      ...loc,
      isSpecial: true,
      tierUnlocked: currentTier.tier,
      tierInfo: currentTier,
    }));

  return unlockedLocations;
}

/**
 * 특정 장소가 특별 장소인지 확인
 * @param {number} locationId - 장소 ID
 * @param {number} streak - 연속 달성 일수
 * @returns {Object|null} 특별 장소 정보
 */
export function getSpecialLocationInfo(locationId, streak) {
  const currentTier = getCurrentTier(streak);

  if (!currentTier) {
    return null;
  }

  const location = greenLocations.find((loc) => loc.id === locationId);

  if (!location) {
    return null;
  }

  // 장소의 점수에 따라 해당하는 티어 결정
  let locationTier = null;
  if (location.score >= STREAK_TIERS.GOLD.minScore) {
    locationTier = STREAK_TIERS.GOLD;
  } else if (location.score >= STREAK_TIERS.SILVER.minScore) {
    locationTier = STREAK_TIERS.SILVER;
  } else if (location.score >= STREAK_TIERS.BRONZE.minScore) {
    locationTier = STREAK_TIERS.BRONZE;
  }

  // 장소의 티어가 없거나, 현재 스트릭으로 해금되지 않은 경우 null 반환
  if (!locationTier || locationTier.minDays > streak) {
    return null;
  }

  return {
    isSpecial: true,
    tierInfo: { ...locationTier, tier: locationTier === STREAK_TIERS.GOLD ? 'GOLD' : locationTier === STREAK_TIERS.SILVER ? 'SILVER' : 'BRONZE' },
    bonusMessage: `${locationTier.name} 티어 특별 장소! 스트릭 ${streak}일 유지 보상`,
  };
}

/**
 * 잠긴 장소 목록 반환 (아직 해금되지 않은 고득점 장소)
 * @param {number} streak - 연속 달성 일수
 * @returns {Array} 잠긴 장소 배열과 해금 조건
 */
export function getLockedLocations(streak) {
  const currentTier = getCurrentTier(streak);
  const currentMinScore = currentTier?.minScore || 100;

  // 현재 티어로는 해금되지 않은 고득점 장소
  const lockedLocations = greenLocations
    .filter((loc) => loc.score > currentMinScore)
    .map((loc) => {
      // 해금에 필요한 티어 찾기
      let requiredTier = null;
      if (loc.score >= STREAK_TIERS.GOLD.minScore) {
        requiredTier = STREAK_TIERS.GOLD;
      } else if (loc.score >= STREAK_TIERS.SILVER.minScore) {
        requiredTier = STREAK_TIERS.SILVER;
      } else if (loc.score >= STREAK_TIERS.BRONZE.minScore) {
        requiredTier = STREAK_TIERS.BRONZE;
      }

      return {
        ...loc,
        isLocked: true,
        requiredTier,
        unlockMessage: requiredTier
          ? `${requiredTier.minDays}일 연속 달성 시 해금`
          : null,
      };
    });

  return lockedLocations;
}

/**
 * 스트릭 진행 상황 반환
 * @param {number} streak - 연속 달성 일수
 * @returns {Object} 진행 상황 정보
 */
export function getStreakProgress(streak) {
  const currentTier = getCurrentTier(streak);
  const nextTierInfo = getNextTierInfo(streak);
  const unlockedCount = getUnlockedSpecialLocations(streak).length;
  const totalSpecialLocations = greenLocations.filter(
    (loc) => loc.score >= STREAK_TIERS.BRONZE.minScore
  ).length;

  // 다음 마일스톤 계산
  let progressPercent = 0;
  let progressMessage = '';

  if (streak >= STREAK_TIERS.GOLD.minDays) {
    progressPercent = 100;
    progressMessage = '최고 등급 달성! 모든 명소가 해금되었어요';
  } else if (streak >= STREAK_TIERS.SILVER.minDays) {
    progressPercent = 66 + ((streak - STREAK_TIERS.SILVER.minDays) / (STREAK_TIERS.GOLD.minDays - STREAK_TIERS.SILVER.minDays)) * 34;
    progressMessage = `${STREAK_TIERS.GOLD.minDays - streak}일 후 골드 등급!`;
  } else if (streak >= STREAK_TIERS.BRONZE.minDays) {
    progressPercent = 33 + ((streak - STREAK_TIERS.BRONZE.minDays) / (STREAK_TIERS.SILVER.minDays - STREAK_TIERS.BRONZE.minDays)) * 33;
    progressMessage = `${STREAK_TIERS.SILVER.minDays - streak}일 후 실버 등급!`;
  } else {
    progressPercent = (streak / STREAK_TIERS.BRONZE.minDays) * 33;
    progressMessage = `${STREAK_TIERS.BRONZE.minDays - streak}일 후 첫 해금!`;
  }

  return {
    streak,
    currentTier,
    nextTierInfo,
    unlockedCount,
    totalSpecialLocations,
    progressPercent: Math.min(100, Math.round(progressPercent)),
    progressMessage,
  };
}

/**
 * 스트릭 달성 시 축하 메시지 반환
 * @param {number} previousStreak - 이전 스트릭
 * @param {number} currentStreak - 현재 스트릭
 * @returns {Object|null} 축하 메시지 (티어 변경 시)
 */
export function getStreakCelebration(previousStreak, currentStreak) {
  const previousTier = getCurrentTier(previousStreak);
  const currentTier = getCurrentTier(currentStreak);

  // 티어가 변경되었는지 확인
  if (!currentTier) return null;
  if (previousTier?.tier === currentTier.tier) return null;

  // 새 티어 달성!
  const newLocations = getUnlockedSpecialLocations(currentStreak);

  return {
    tierAchieved: currentTier,
    message: currentTier.message,
    newLocationsCount: newLocations.length,
    newLocations: newLocations.slice(0, 3), // 상위 3개만
    celebrationType: currentTier.tier.toLowerCase(),
  };
}
