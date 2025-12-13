import { cn } from '../../utils/cn';

export default function GlassCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-4 shadow-lg border border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
