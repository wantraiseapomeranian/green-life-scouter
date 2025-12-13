import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import GlassCard from '../components/UI/GlassCard';
import { 
  calculateStreak, 
  getWeeklyData, 
  getWeeklyAverage,
  getMonthlyData,
  getTotalCompletedHabits,
  calculateCompletionRate
} from '../utils/habitUtils';
import { getItem } from '../utils/storage';
import { ecoHabits } from '../data/mockClimateData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

export default function StatsPage() {
  const [streak, setStreak] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [todayCompletion, setTodayCompletion] = useState(0);

  useEffect(() => {
    // 통계 데이터 로드
    setStreak(calculateStreak());
    setWeeklyData(getWeeklyData());
    setWeeklyAverage(getWeeklyAverage());
    setMonthlyData(getMonthlyData());
    setTotalCompleted(getTotalCompletedHabits());
    
    const today = format(new Date(), 'yyyy-MM-dd');
    setTodayCompletion(calculateCompletionRate(today));
  }, []);

  const statsCards = [
    {
      icon: Award,
      label: '연속 달성',
      value: `${streak}일`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Target,
      label: '이번 주 평균',
      value: `${weeklyAverage}%`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      icon: Calendar,
      label: '오늘 완료율',
      value: `${todayCompletion}%`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: TrendingUp,
      label: '총 완료 습관',
      value: `${totalCompleted}개`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">나의 통계</h2>
        <p className="text-sm text-gray-600 mt-1">
          {format(new Date(), 'yyyy년 MM월', { locale: ko })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {statsCards.map(({ icon: Icon, label, value, color, bgColor }) => (
          <GlassCard key={label} className={`${bgColor} border-2`}>
            <div className="text-center">
              <div className={`${color} flex justify-center mb-2`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-600 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Weekly Chart */}
      <GlassCard>
        <h3 className="text-lg font-bold text-gray-800 mb-4">이번 주 달성률</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dayName" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="completion" 
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Monthly Trend */}
      <GlassCard>
        <h3 className="text-lg font-bold text-gray-800 mb-4">이번 달 추이</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="completion" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Habit Breakdown */}
      <GlassCard>
        <h3 className="text-lg font-bold text-gray-800 mb-4">습관별 완료 현황</h3>
        <div className="space-y-3">
          {ecoHabits.map((habit) => {
            // 최근 7일간 완료 횟수 계산
            let completedCount = 0;
            const weekData = getWeeklyData();
            weekData.forEach(({ date }) => {
              const data = getItem(`habits-${date}`, {});
              if (data && data[habit.id]) {
                completedCount++;
              }
            });
            
            const completionRate = Math.round((completedCount / 7) * 100);
            
            return (
              <div key={habit.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{habit.text}</span>
                  <span className="text-emerald-600 font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

