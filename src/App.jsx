import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import MapPage from './pages/MapPage';
import TrackerPage from './pages/TrackerPage';
import StatsPage from './pages/StatsPage';
import { getTodayHabitCompletion, getRecommendedLocations } from './utils/mapIntegration';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [habitCompletion, setHabitCompletion] = useState({});
  const [recommendedLocations, setRecommendedLocations] = useState([]);

  // 습관 완료 상태 업데이트 및 추천 장소 계산
  useEffect(() => {
    const todayCompletion = getTodayHabitCompletion();
    setHabitCompletion(todayCompletion);
    setRecommendedLocations(getRecommendedLocations(todayCompletion));
  }, [activeTab]); // 탭 변경 시 업데이트

  const getHeaderTitle = () => {
    const titles = {
      map: '숲세권 스카우터',
      tracker: '에코 습관 트래커',
      stats: '통계/기록',
    };
    return titles[activeTab] || '숲세권 스카우터';
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <Header title={getHeaderTitle()} />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24 overflow-auto">
        <div className="max-w-2xl mx-auto px-4 h-full">
          {activeTab === 'map' && (
            <MapPage 
              recommendedLocations={recommendedLocations}
              habitCompletion={habitCompletion}
            />
          )}
          {activeTab === 'tracker' && (
            <TrackerPage 
              onHabitChange={() => {
                const todayCompletion = getTodayHabitCompletion();
                setHabitCompletion(todayCompletion);
                setRecommendedLocations(getRecommendedLocations(todayCompletion));
              }}
            />
          )}
          {activeTab === 'stats' && <StatsPage />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
