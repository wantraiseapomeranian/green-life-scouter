import { useEffect, useState } from 'react';
import GreenMap from '../components/Map/GreenMap';
import GlassCard from '../components/UI/GlassCard';
import { Sparkles } from 'lucide-react';
import { calculateStreak } from '../utils/habitUtils';

export default function MapPage({ recommendedLocations = [], habitCompletion = {} }) {
  const hasRecommendations = recommendedLocations.length > 0;
  const completedCount = Object.values(habitCompletion).filter(Boolean).length;
  const [streak, setStreak] = useState(0);

  // 스트릭 계산
  useEffect(() => {
    setStreak(calculateStreak());
  }, [habitCompletion]);

  return (
    <div className="h-full w-full p-4 space-y-4">
      {/* 추천 장소 알림 */}
      {hasRecommendations && (
        <GlassCard className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-800">
                {completedCount}개 습관 완료! 추천 장소를 확인해보세요
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                {recommendedLocations.map(loc => loc.name).join(', ')}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="h-[calc(100vh-12rem)] w-full rounded-2xl overflow-hidden shadow-lg">
        <GreenMap 
          recommendedLocations={recommendedLocations}
          habitCompletion={habitCompletion}
          streak={streak}
        />
      </div>
    </div>
  );
}
