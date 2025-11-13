interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressRing({ 
  value, 
  size = 120, 
  strokeWidth = 8,
  label,
  showPercentage = true 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = () => {
    if (value >= 80) return "#22C55E";
    if (value >= 60) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="flex flex-col items-center gap-2" data-testid={`progress-ring-${label?.toLowerCase()}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: getColor() }}>
              {showPercentage ? `${Math.round(value)}%` : Math.round(value)}
            </div>
          </div>
        </div>
      </div>
      {label && (
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
      )}
    </div>
  );
}
