import { X, MapPin, TreePine, Wind, Leaf, Thermometer, Home, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateGreenScore, getScoreGrade, getScoreColor } from '../../utils/scoreCalculator';
import GreenRadarChart from './RadarChart';
import TermTooltip from '../common/TermTooltip';
import { greenLocations } from '../../data/mockClimateData';

export default function ZoneDetailModal({ zone, onClose, onLocationClick }) {
  if (!zone) return null;

  const score = calculateGreenScore(zone.details);
  const grade = getScoreGrade(score);
  const scoreColor = getScoreColor(score);

  const metrics = [
    {
      icon: Wind,
      label: '미세먼지 저감',
      value: zone.details.pm10Reduction,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Leaf,
      label: '탄소 흡수량',
      value: zone.details.carbonAbsorption,
      unit: '톤/년',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Thermometer,
      label: '열쾌적성',
      value: zone.details.thermalComfort,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: TreePine,
      label: '녹지 면적',
      value: zone.details.greenCoverage,
      unit: '%',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  // 점수별 추천 메시지
  const getRecommendation = () => {
    if (score >= 85) {
      return {
        icon: TrendingUp,
        message: '환경 친화적인 최적의 주거지역입니다. 건강한 생활이 기대됩니다.',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      };
    }
    if (score >= 70) {
      return {
        icon: TrendingUp,
        message: '양호한 환경의 주거지역입니다. 쾌적한 생활이 가능합니다.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      };
    }
    if (score >= 55) {
      return {
        icon: Home,
        message: '평균적인 환경입니다. 인근 녹지공간 활용을 권장합니다.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      };
    }
    return {
      icon: TrendingDown,
      message: '환경 개선이 필요한 지역입니다. 주변 공원 접근성을 고려하세요.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    };
  };

  const recommendation = getRecommendation();
  const RecommendIcon = recommendation.icon;

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
              <Home className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">주거구역 환경분석</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{zone.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{zone.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors relative z-[60]"
            style={{ pointerEvents: 'auto' }}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Score Section */}
        <div className="px-6 py-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">환경 점수</p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-5xl font-bold"
                  style={{ color: scoreColor }}
                >
                  {score}
                </span>
                <span className="text-xl text-gray-500">/ 100</span>
              </div>
            </div>
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
              style={{ backgroundColor: `${scoreColor}20` }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: scoreColor }}
              >
                {grade.grade}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: scoreColor }}
              >
                {grade.label}
              </span>
            </div>
          </div>

          {/* Score Bar */}
          <div className="mt-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${score}%`,
                  background: `linear-gradient(90deg, ${scoreColor} 0%, ${scoreColor}cc 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span>40</span>
              <span>55</span>
              <span>70</span>
              <span>85</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`px-6 py-4 ${recommendation.bgColor}`}>
          <div className="flex items-start gap-3">
            <RecommendIcon className={`w-5 h-5 ${recommendation.color} mt-0.5`} />
            <p className={`text-sm ${recommendation.color} font-medium`}>
              {recommendation.message}
            </p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">환경 지표 분석</h3>
          <GreenRadarChart data={zone.details} />
        </div>

        {/* Metrics Grid */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">상세 지표</h3>
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
                    <div className="text-xs text-gray-600 mb-1">
                      <TermTooltip term={label} />
                    </div>
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

        {/* Nearby Parks */}
        {zone.nearbyParks.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-200 bg-emerald-50/50">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span className="text-base font-semibold text-gray-800">인근 녹지시설</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {zone.nearbyParks.map((parkName, idx) => {
                // 녹지시설 이름으로 greenLocations에서 찾기
                const location = greenLocations.find(loc => loc.name === parkName);
                
                if (location && onLocationClick) {
                  // 클릭 가능한 버튼
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onLocationClick(location);
                      }}
                      className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm rounded-full font-medium transition-colors active:bg-emerald-300"
                    >
                      {parkName}
                    </button>
                  );
                } else {
                  // 클릭 불가능한 텍스트
                  return (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium"
                    >
                      {parkName}
                    </span>
                  );
                }
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            이 데이터는 경기기후위성데이터를 기반으로 분석되었습니다
          </p>
        </div>
      </div>
    </div>
  );
}
