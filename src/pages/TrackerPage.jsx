import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import HabitList from '../components/Tracker/HabitList';
import StreakBadge from '../components/Tracker/StreakBadge';
import WeeklyChart from '../components/Tracker/WeeklyChart';
import CelebrationModal from '../components/Tracker/CelebrationModal';
import { ecoHabits } from '../data/mockClimateData';
import { calculateStreak, getWeeklyAverage } from '../utils/habitUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function TrackerPage({ onHabitChange }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const storageKey = `habits-${today}`;
  
  // useLocalStorage 훅 사용 (Storage 접근 실패 시 메모리 State로 폴백)
  const [checkedHabits, setCheckedHabits, isStorageReady] = useLocalStorage(storageKey, {});
  
  const [streak, setStreak] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // 통계 계산
  useEffect(() => {
    setStreak(calculateStreak());
    setWeeklyAverage(getWeeklyAverage());
  }, [checkedHabits]);

  const handleToggle = (habitId) => {
    const newChecked = {
      ...checkedHabits,
      [habitId]: !checkedHabits[habitId],
    };
    
    // useLocalStorage의 setValue가 자동으로 저장 처리 (성공/실패 모두 처리)
    setCheckedHabits(newChecked);

    // Notify parent component about habit change
    if (onHabitChange) {
      onHabitChange();
    }

    // Check if all habits are completed
    const allCompleted = ecoHabits.every((habit) => newChecked[habit.id]);
    if (allCompleted && !showCelebration) {
      setTimeout(() => setShowCelebration(true), 300);
    }
  };

  // Calculate today's completion percentage
  const completedToday = Object.values(checkedHabits).filter(Boolean).length;
  const todayPercentage = Math.round((completedToday / ecoHabits.length) * 100);

  return (
    <div className="space-y-6 pb-4">
      {/* Date Header */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {format(new Date(), 'yyyy년 MM월 dd일 EEEE', { locale: ko })}
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">
          오늘의 에코 습관 체크
        </h2>
      </div>

      {/* Streak Badge */}
      <StreakBadge streak={streak} />

      {/* Weekly Chart */}
      <WeeklyChart percentage={weeklyAverage} label="이번 주 평균" />

      {/* Habit List */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">
          습관 체크리스트
        </h3>
        <HabitList
          habits={ecoHabits}
          checkedHabits={checkedHabits}
          onToggle={handleToggle}
        />
      </div>

      {/* Progress Info */}
      <div className="text-center text-sm text-gray-600 pt-4">
        <p>
          {completedToday} / {ecoHabits.length} 완료
        </p>
        {completedToday === ecoHabits.length && (
          <p className="text-emerald-600 font-medium mt-2">
            🎉 오늘의 모든 습관을 완료했어요!
          </p>
        )}
        {!isStorageReady && (
          <p className="text-amber-600 text-xs mt-2">
            ⚠️ 데이터는 이 세션 동안만 저장됩니다
          </p>
        )}
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}
