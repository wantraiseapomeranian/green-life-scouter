import { Sparkles } from 'lucide-react';

export default function Header({ title }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-primary text-white shadow-lg">
      <div className="flex items-center justify-center gap-2 py-4 px-6">
        <Sparkles className="w-6 h-6 animate-pulse" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
}
