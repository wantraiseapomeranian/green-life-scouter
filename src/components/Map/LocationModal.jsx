import { X, TreePine, Wind, Leaf, Thermometer, Heart, Clock, Lightbulb, Sparkles, TrendingUp, Star, Crown, Trophy } from 'lucide-react';
import { markerTypes } from '../../data/mockClimateData';
import GreenRadarChart from './RadarChart';
import { calculateGreenScore } from '../../utils/scoreCalculator';
import { getOverallBenefits } from '../../utils/benefitCalculator';
import { calculateLocationImpact } from '../../utils/environmentalImpact';
import { getSpecialLocationInfo, getStreakProgress } from '../../utils/specialLocations';
import { getHabitsForLocation } from '../../utils/habitLocationMapper';

export default function LocationModal({ location, onClose, habitCompletion = {}, streak = 0 }) {
  if (!location) return null;

  const { name, type, details } = location;
  const typeInfo = markerTypes[type];

  // 그린 스코어 계산 (기존 score가 없으면 계산)
  const calculatedScore = location.score || calculateGreenScore(details);

  // 기대효과 계산
  const benefits = getOverallBenefits(details, type);

  // 환경 기여도 계산
  const environmentalImpact = calculateLocationImpact(location, habitCompletion);

  // 스트릭 특별 장소 정보
  const specialInfo = getSpecialLocationInfo(location.id, streak);
  const streakProgress = getStreakProgress(streak);

  // 이 장소에서 할 수 있는 습관
  const relatedHabits = getHabitsForLocation(location);

  // 티어 아이콘 매핑
  const tierIcons = {
    BRONZE: Star,
    SILVER: Crown,
    GOLD: Trophy,
  };

  const metrics = [
    {
      icon: Wind,
      label: '미세먼지 저감',
      value: details.pm10Reduction,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Leaf,
      label: '탄소 흡수량',
      value: details.carbonAbsorption,
      unit: '톤/년',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Thermometer,
      label: '열쾌적성',
      value: details.thermalComfort,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: TreePine,
      label: '녹지 면적',
      value: details.greenCoverage,
      unit: '%',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9999] animate-in slide-in-from-bottom duration-300 bg-white"
      onClick={onClose}
      style={{ zIndex: 99999, position: 'fixed' }}
    >
      <div
        className="glass-dark border-t border-white/30 rounded-t-3xl shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10000, paddingBottom: '100px' }}
      >
        {/* Header */}
        <div className="sticky top-0 glass-dark border-b border-white/20 px-6 py-4 flex items-start justify-between z-50">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: typeInfo.color }}
              >
                {typeInfo.label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors relative z-[60]"
            style={{ pointerEvents: 'auto' }}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Green Score */}
        <div className="px-6 py-6 border-b border-white/20">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">그린 스코어</p>
            <div className="relative inline-block mb-3">
              <svg width="140" height="140" className="transform -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 55}`}
                  strokeDashoffset={`${2 * Math.PI * 55 * (1 - calculatedScore / 100)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-600">{calculatedScore}</p>
                  <p className="text-xs text-gray-500">점</p>
                </div>
              </div>
            </div>
            {calculatedScore >= 85 && (
              <p className="text-xs text-emerald-600 font-medium">
                🌟 최고 수준의 환경 친화적 공간입니다
              </p>
            )}
            {calculatedScore >= 75 && calculatedScore < 85 && (
              <p className="text-xs text-blue-600 font-medium">
                👍 건강하고 쾌적한 환경입니다
              </p>
            )}
            {calculatedScore < 75 && (
              <p className="text-xs text-gray-600 font-medium">
                💡 환경 개선이 필요한 공간입니다
              </p>
            )}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">지표 분석</h3>
          <GreenRadarChart data={details} />
        </div>

        {/* 스트릭 특별 장소 배지 */}
        {specialInfo && (
          <div className={`px-6 py-4 border-b border-white/20 ${specialInfo.tierInfo.bgColor}`}>
            <div className="flex items-center gap-3">
              {(() => {
                const TierIcon = tierIcons[specialInfo.tierInfo.tier] || Star;
                return (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: specialInfo.tierInfo.color + '30' }}
                  >
                    <TierIcon
                      className="w-6 h-6"
                      style={{ color: specialInfo.tierInfo.color }}
                    />
                  </div>
                );
              })()}
              <div className="flex-1">
                <p className={`text-sm font-bold ${specialInfo.tierInfo.textColor}`}>
                  {specialInfo.tierInfo.label}
                </p>
                <p className="text-xs text-gray-600">
                  {specialInfo.bonusMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 나의 환경 기여도 섹션 */}
        {environmentalImpact.completedCount > 0 && (
          <div className="px-6 py-6 border-b border-white/20 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">나의 환경 기여도</h3>
            </div>

            {/* CO2 절감량 */}
            <div className="mb-4 p-4 bg-white/60 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">오늘 절감한 CO2</span>
                <span className="text-2xl font-bold text-blue-600">
                  {environmentalImpact.totalCO2}kg
                </span>
              </div>
              <p className="text-xs text-gray-600">{environmentalImpact.message}</p>
              {environmentalImpact.locationMessage && (
                <p className="text-xs text-cyan-600 mt-1 font-medium">
                  {environmentalImpact.locationMessage}
                </p>
              )}
            </div>

            {/* 환산 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/60 rounded-lg border border-green-200 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {environmentalImpact.treeEquivalent}
                </p>
                <p className="text-xs text-gray-600">나무 흡수량 (그루/일)</p>
              </div>
              <div className="p-3 bg-white/60 rounded-lg border border-orange-200 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {environmentalImpact.carKmEquivalent}km
                </p>
                <p className="text-xs text-gray-600">자동차 주행 절약</p>
              </div>
            </div>

            {/* 장소 방문 효과 */}
            <div className="mt-4 p-3 bg-emerald-100/50 rounded-lg">
              <p className="text-sm text-emerald-700 font-medium">
                {environmentalImpact.benefitMessage}
              </p>
            </div>
          </div>
        )}

        {/* 이 장소에서 할 수 있는 습관 */}
        {relatedHabits.length > 0 && (
          <div className="px-6 py-4 border-b border-white/20">
            <h3 className="text-sm font-bold text-gray-700 mb-3">이 장소에서 실천할 수 있는 습관</h3>
            <div className="flex flex-wrap gap-2">
              {relatedHabits.slice(0, 4).map((habit) => (
                <span
                  key={habit.id}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium"
                >
                  {habit.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 기대효과 섹션 */}
        <div className="px-6 py-6 border-b border-white/20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-800">기대효과</h3>
          </div>
          
          {/* 건강 점수 */}
          <div className="mb-4 p-4 bg-white/60 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className={`w-5 h-5 ${benefits.healthColor}`} />
                <span className="text-sm font-medium text-gray-700">건강 환경 점수</span>
              </div>
              <span className={`text-xl font-bold ${benefits.healthColor}`}>
                {benefits.healthLevel}
              </span>
            </div>
            <p className="text-xs text-gray-600">{benefits.pm10Benefit.healthTip}</p>
          </div>

          {/* 환경 기여도 */}
          <div className="mb-4 p-4 bg-white/60 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">환경 보호 기여</span>
            </div>
            <p className="text-sm text-gray-700 mb-1">{benefits.carbonContribution.description}</p>
            <p className="text-xs text-emerald-600 font-medium">
              💚 {benefits.carbonContribution.impact}
            </p>
          </div>

          {/* 추천 활동 */}
          {benefits.activities.length > 0 && (
            <div className="p-4 bg-white/60 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">추천 활동</span>
              </div>
              <div className="space-y-2">
                {benefits.activities.map((activity, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">{activity.activity}</span>
                        <span className="text-gray-500 ml-1">({activity.time})</span>
                        <p className="text-gray-600 mt-0.5">{activity.benefit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">상세 분석</h3>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map(({ icon: Icon, label, value, unit, color, bgColor }) => (
              <div
                key={label}
                className={`${bgColor} rounded-xl p-4 border border-white/30`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${color} mt-1`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-1 truncate">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>
                      {value}
                      {unit && <span className="text-sm ml-1">{unit}</span>}
                    </p>
                    {!unit && (
                      <div className="mt-2 bg-white/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-primary h-full rounded-full transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-6 py-4 bg-emerald-50/50">
          <p className="text-xs text-gray-600 text-center">
            💚 이 데이터는 경기기후위성데이터를 기반으로 산출되었습니다
          </p>
        </div>
      </div>
    </div>
  );
}
