import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

/**
 * 레이더 차트 컴포넌트
 * 4개 지표를 레이더 차트로 시각화
 * 모달 렌더링 타이밍 이슈를 해결하기 위해 지연 렌더링 적용
 */
export default function GreenRadarChart({ data }) {
  const [isReady, setIsReady] = useState(false);

  // 컴포넌트 마운트 후 약간의 지연을 두고 차트 렌더링 (모달 애니메이션 완료 대기)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const { pm10Reduction, carbonAbsorption, thermalComfort, greenCoverage } = data;

  // 탄소 흡수량 정규화 (0-100)
  const normalizedCarbon = Math.min(100, Math.max(0, (carbonAbsorption / 5.0) * 100));

  const chartData = [
    {
      subject: '미세먼지\n저감',
      value: pm10Reduction,
      fullMark: 100,
    },
    {
      subject: '탄소\n흡수',
      value: normalizedCarbon,
      fullMark: 100,
    },
    {
      subject: '열쾌적성',
      value: thermalComfort,
      fullMark: 100,
    },
    {
      subject: '녹지\n면적',
      value: greenCoverage,
      fullMark: 100,
    },
  ];

  // 준비되지 않은 상태에서는 플레이스홀더 표시
  if (!isReady) {
    return (
      <div
        className="w-full flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ height: '256px', minHeight: '256px' }}
      >
        <div className="text-gray-400 text-sm">차트 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: '256px', minHeight: '256px' }}>
      <ResponsiveContainer width="100%" height={256} minWidth={200} minHeight={200}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="지표"
            dataKey="value"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

