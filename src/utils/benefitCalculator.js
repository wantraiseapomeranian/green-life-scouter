/**
 * 지표 데이터를 기반으로 사용자에게 제공할 실질적인 혜택과 기대효과 계산
 */

/**
 * 미세먼지 저감 효과 설명
 */
export function getPM10ReductionBenefit(pm10Reduction) {
  if (pm10Reduction >= 80) {
    return {
      level: 'excellent',
      title: '우수한 공기질',
      description: '이곳은 미세먼지가 도심 평균보다 약 30% 낮아요',
      healthTip: '호흡기 건강에 매우 좋은 환경입니다. 산책이나 운동하기에 최적이에요!',
      icon: 'lungs',
    };
  } else if (pm10Reduction >= 70) {
    return {
      level: 'good',
      title: '양호한 공기질',
      description: '미세먼지가 도심 평균보다 약 20% 낮아요',
      healthTip: '호흡기 건강에 도움이 되는 환경입니다.',
      icon: 'wind',
    };
  } else {
    return {
      level: 'normal',
      title: '일반적인 공기질',
      description: '도심 평균 수준의 공기질입니다',
      healthTip: '마스크 착용을 권장합니다.',
      icon: 'shield',
    };
  }
}

/**
 * 탄소 흡수량 기여도 계산
 */
export function getCarbonContribution(carbonAbsorption) {
  // 1톤의 탄소 = 약 3.67톤의 CO2
  // 평균 한국인 1인당 연간 탄소 배출량: 약 12톤
  const co2Equivalent = carbonAbsorption * 3.67;
  const personEquivalent = (carbonAbsorption / 12) * 100; // 몇 명분의 배출량을 상쇄하는지
  
  return {
    co2Equivalent: co2Equivalent.toFixed(1),
    personEquivalent: personEquivalent.toFixed(1),
    description: `이 녹지가 연간 ${carbonAbsorption}톤의 탄소를 흡수해요`,
    impact: `약 ${personEquivalent}명분의 연간 탄소 배출량을 상쇄합니다`,
  };
}

/**
 * 열쾌적성 기반 활동 추천
 */
export function getActivityRecommendation(thermalComfort, type) {
  const recommendations = [];
  
  if (thermalComfort >= 85) {
    recommendations.push({
      activity: '야외 운동',
      time: '오전 6-10시, 오후 6-8시',
      benefit: '시원하고 쾌적한 환경에서 운동하기 좋아요',
    });
    recommendations.push({
      activity: '피크닉',
      time: '오전 10시-오후 4시',
      benefit: '그늘에서 휴식하기에 최적이에요',
    });
  } else if (thermalComfort >= 75) {
    recommendations.push({
      activity: '산책',
      time: '오전/오후',
      benefit: '편안하게 산책하기 좋은 환경이에요',
    });
  }
  
  if (type === 'PARK') {
    recommendations.push({
      activity: '가족 나들이',
      time: '하루 종일',
      benefit: '넓은 공간에서 아이들과 함께 시간 보내기 좋아요',
    });
  } else if (type === 'TRAIL') {
    recommendations.push({
      activity: '조깅/걷기',
      time: '오전 6-9시',
      benefit: '신선한 공기와 함께 운동하기 좋아요',
    });
  } else if (type === 'SHELTER') {
    recommendations.push({
      activity: '더위 피하기',
      time: '오후 1-5시 (여름)',
      benefit: '무더위 쉼터로 시원하게 휴식할 수 있어요',
    });
  }
  
  return recommendations;
}

/**
 * 종합 기대효과 계산
 */
export function getOverallBenefits(details, type) {
  const pm10Benefit = getPM10ReductionBenefit(details.pm10Reduction);
  const carbonContribution = getCarbonContribution(details.carbonAbsorption);
  const activities = getActivityRecommendation(details.thermalComfort, type);
  
  // 건강 점수 계산
  const healthScore = Math.round(
    (details.pm10Reduction * 0.5) + (details.thermalComfort * 0.3) + (details.greenCoverage * 0.2)
  );
  
  let healthLevel = '보통';
  let healthColor = 'text-gray-600';
  if (healthScore >= 85) {
    healthLevel = '매우 좋음';
    healthColor = 'text-emerald-600';
  } else if (healthScore >= 75) {
    healthLevel = '좋음';
    healthColor = 'text-blue-600';
  }
  
  return {
    healthScore,
    healthLevel,
    healthColor,
    pm10Benefit,
    carbonContribution,
    activities,
  };
}

