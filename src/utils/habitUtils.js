import { format, subDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ecoHabits } from '../data/mockClimateData';
import { getItem } from './storage';

/**
 * 특정 날짜의 습관 완료율 계산
 * @param {string} dateStr - 날짜 문자열 (yyyy-MM-dd)
 * @returns {number} 0-100 사이의 완료율
 */
export function calculateCompletionRate(dateStr) {
  const data = getItem(`habits-${dateStr}`, {});
  if (!data || Object.keys(data).length === 0) return 0;

  const completed = ecoHabits.filter((habit) => data[habit.id]).length;
  return Math.round((completed / ecoHabits.length) * 100);
}

/**
 * 연속 달성 일수 계산
 * @returns {number} 연속 달성 일수
 */
export function calculateStreak() {
  let streak = 0;
  let date = new Date();
  date.setHours(0, 0, 0, 0);

  while (true) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const data = getItem(`habits-${dateStr}`, {});
    
    if (!data || Object.keys(data).length === 0) break;

    const allCompleted = ecoHabits.every((habit) => data[habit.id]);

    if (allCompleted) {
      streak++;
      date = subDays(date, 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 주간 데이터 가져오기
 * @param {Date} startDate - 시작 날짜 (기본값: 이번 주 시작)
 * @returns {Array} 주간 데이터 배열
 */
export function getWeeklyData(startDate = null) {
  const weekStart = startDate 
    ? startOfWeek(startDate, { locale: ko })
    : startOfWeek(new Date(), { locale: ko });
  
  const weekData = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const completion = calculateCompletionRate(dateStr);
    
    weekData.push({
      date: dateStr,
      dateObj: date,
      completion,
      dayName: format(date, 'EEE', { locale: ko }),
    });
  }
  
  return weekData;
}

/**
 * 주간 평균 완료율 계산
 * @returns {number} 주간 평균 완료율 (0-100)
 */
export function getWeeklyAverage() {
  const weekData = getWeeklyData();
  const total = weekData.reduce((sum, day) => sum + day.completion, 0);
  return Math.round(total / weekData.length);
}

/**
 * 월간 데이터 가져오기
 * @param {Date} month - 월 (기본값: 이번 달)
 * @returns {Array} 월간 데이터 배열
 */
export function getMonthlyData(month = new Date()) {
  const year = month.getFullYear();
  const monthNum = month.getMonth();
  const daysInMonth = new Date(year, monthNum + 1, 0).getDate();
  
  const monthlyData = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum, day);
    const dateStr = format(date, 'yyyy-MM-dd');
    const completion = calculateCompletionRate(dateStr);
    
    monthlyData.push({
      date: dateStr,
      dateObj: date,
      completion,
      day: day,
    });
  }
  
  return monthlyData;
}

/**
 * 총 완료한 습관 수 계산
 * @returns {number} 총 완료한 습관 수
 */
export function getTotalCompletedHabits() {
  let total = 0;
  const today = new Date();
  
  // 최근 30일간 데이터 확인
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const data = getItem(`habits-${dateStr}`, {});
    
    if (data && Object.keys(data).length > 0) {
      total += ecoHabits.filter((habit) => data[habit.id]).length;
    }
  }
  
  return total;
}

