/**
 * 환경 지표 용어 정의
 * 툴팁에서 사용자에게 전문 용어를 쉽게 설명하기 위한 데이터
 */
export const TERM_DEFINITIONS = {
  "미세먼지 저감": "나무와 숲이 대기 중의 오염 물질을 흡착하여 공기를 맑게 하는 능력입니다.",
  "탄소 흡수량": "나무가 광합성을 통해 대기 중의 이산화탄소를 흡수하고 저장하는 양입니다.",
  "열쾌적성": "여름철 나무 그늘과 증산 작용으로 주변 온도를 낮추어 사람이 느끼는 시원한 정도입니다.",
  "녹지 면적": "해당 구역 내에서 식물이 자라고 있는 땅의 비율입니다."
};

/**
 * 용어 정의 가져오기
 * @param {string} term - 용어명
 * @returns {string|null} - 용어 설명 또는 null
 */
export function getTermDefinition(term) {
  return TERM_DEFINITIONS[term] || null;
}
