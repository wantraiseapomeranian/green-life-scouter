import { Sparkles, X } from 'lucide-react';

export default function CelebrationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white animate-in fade-in duration-300">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-60 animate-pulse" />
            <div className="relative bg-gradient-primary rounded-full p-6 animate-float">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-primary mb-2">
              축하합니다!
            </h2>
            <p className="text-gray-700 text-lg">
              오늘의 모든 에코 습관을<br />완료하셨습니다! 🎉
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>🌱 지구가 당신에게 감사합니다</p>
            <p>💚 내일도 함께 실천해요!</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-primary text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
