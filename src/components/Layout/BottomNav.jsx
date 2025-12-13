import { Map, ListChecks, BarChart3 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'map', label: '숲세권 지도', icon: Map },
    { id: 'tracker', label: '에코 습관', icon: ListChecks },
    { id: 'stats', label: '통계/기록', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/20 shadow-2xl">
      <div className="flex items-center justify-around px-6 py-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300",
              activeTab === id
                ? "bg-gradient-primary text-white shadow-lg scale-105"
                : "text-gray-600 hover:text-emerald-600"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
