/**
 * 그린 스코어 계산 알고리즘
 * 여러 API 데이터를 가중치 기반으로 합산하여 0-100 점수로 환산
 * 
 * 가중치:
 * - 미세먼지 저감: 30%
 * - 탄소 흡수량: 25%
 * - 열쾌적성: 25%
 * - 녹지 면적: 20%
 */

/**
 * 탄소 흡수량을 0-100 점수로 정규화
 * @param {number} carbonAbsorption - 탄소 흡수량 (톤/년)
 * @returns {number} 0-100 점수
 */
function normalizeCarbonAbsorption(carbonAbsorption) {
  // 최대값 5톤/년을 기준으로 정규화
  const max = 5.0;
  const min = 0.0;
  const normalized = Math.min(100, Math.max(0, (carbonAbsorption / max) * 100));
  return Math.round(normalized);
}

/**
 * 그린 스코어 계산
 * @param {Object} details - 상세 지표 데이터
 * @param {number} details.pm10Reduction - 미세먼지 저감 등급 (0-100)
 * @param {number} details.carbonAbsorption - 탄소 흡수량 (톤/년)
 * @param {number} details.thermalComfort - 열쾌적성 등급 (0-100)
 * @param {number} details.greenCoverage - 녹지 면적 비율 (0-100)
 * @returns {number} 0-100 사이의 그린 스코어
 */
export function calculateGreenScore(details) {
  const {
    pm10Reduction = 0,
    carbonAbsorption = 0,
    thermalComfort = 0,
    greenCoverage = 0,
  } = details;

  // 탄소 흡수량 정규화
  const normalizedCarbon = normalizeCarbonAbsorption(carbonAbsorption);

  // 가중치 기반 점수 계산
  const weights = {
    pm10Reduction: 0.30,      // 30%
    carbonAbsorption: 0.25,   // 25%
    thermalComfort: 0.25,    // 25%
    greenCoverage: 0.20,      // 20%
  };

  const score =
    pm10Reduction * weights.pm10Reduction +
    normalizedCarbon * weights.carbonAbsorption +
    thermalComfort * weights.thermalComfort +
    greenCoverage * weights.greenCoverage;

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * API 데이터를 표준 형식으로 변환
 * @param {Object} apiData - API에서 받은 원시 데이터
 * @returns {Object} 표준화된 상세 지표
 */
export function normalizeApiData(apiData) {
  return {
    pm10Reduction: apiData.pm10Reduction || apiData.airQuality || 0,
    carbonAbsorption: apiData.carbonAbsorption || apiData.carbon || 0,
    thermalComfort: apiData.thermalComfort || apiData.comfort || 0,
    greenCoverage: apiData.greenCoverage || apiData.greenArea || 0,
  };
}

/**
 * 점수에 따른 색상 반환
 * @param {number} score - 그린 스코어 (0-100)
 * @returns {string} HEX 색상 코드
 */
export function getScoreColor(score) {
  if (score >= 85) {
    return '#10b981'; // emerald-500
  } else if (score >= 70) {
    return '#14b8a6'; // teal-500
  } else if (score >= 55) {
    return '#f59e0b'; // amber-500
  } else if (score >= 40) {
    return '#f97316'; // orange-500
  } else {
    return '#ef4444'; // red-500
  }
}

/**
 * 점수에 따른 색상과 투명도 반환
 * @param {number} score - 그린 스코어 (0-100)
 * @param {number} opacity - 투명도 (0-1)
 * @returns {string} RGBA 색상 코드
 */
export function getScoreColorWithOpacity(score, opacity = 0.5) {
  const color = getScoreColor(score);
  // HEX를 RGB로 변환
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * 점수에 따른 등급 반환
 * @param {number} score - 그린 스코어 (0-100)
 * @returns {Object} 등급 정보 {grade: string, label: string}
 */
export function getScoreGrade(score) {
  if (score >= 85) {
    return { grade: 'A+', label: '최우수' };
  } else if (score >= 70) {
    return { grade: 'A', label: '우수' };
  } else if (score >= 55) {
    return { grade: 'B', label: '양호' };
  } else if (score >= 40) {
    return { grade: 'C', label: '보통' };
  } else {
    return { grade: 'D', label: '개선필요' };
  }
}

