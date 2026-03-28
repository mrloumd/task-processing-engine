interface Props {
  value: number; // 0–100
  showLabel?: boolean;
  pulse?: boolean;
}

export function ProgressBar({ value, showLabel = false, pulse = false }: Props) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-muted">Progress</span>
          <span className="text-xs font-semibold tabular-nums text-brand">{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className={`h-full rounded-full bg-brand transition-all duration-500 ease-out ${pulse ? 'animate-pulse' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
