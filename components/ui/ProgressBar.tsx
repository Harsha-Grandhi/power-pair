'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showSteps?: boolean;
  color?: string;
}

export default function ProgressBar({
  current,
  total,
  label,
  showSteps = true,
  color = '#F6B17A',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full">
      {(label || showSteps) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-xs font-medium text-pp-text-muted tracking-wide uppercase">
              {label}
            </span>
          )}
          {showSteps && (
            <span className="text-xs text-pp-text-muted ml-auto">
              {current} / {total}
            </span>
          )}
        </div>
      )}
      <div className="relative h-1 w-full bg-white/8 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
