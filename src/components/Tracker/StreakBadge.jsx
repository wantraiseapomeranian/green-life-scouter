import { Flame } from 'lucide-react';
import GlassCard from '../UI/GlassCard';

export default function StreakBadge({ streak }) {
  return (
    <GlassCard className="bg-gradient-to-br from-orange-100/60 to-red-100/60 border-orange-200">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-xl animate-pulse" />
          <Flame className="w-12 h-12 text-orange-500 animate-flame relative z-10" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">연속 달성</p>
          <p className="text-3xl font-bold text-orange-600">
            {streak}
            <span className="text-lg ml-1">일</span>
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
