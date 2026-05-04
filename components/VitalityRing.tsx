type VitalityRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
};

export default function VitalityRing({
  value,
  size = 88,
  strokeWidth = 8,
}: VitalityRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const ringColor = "var(--leaf, #4ecb5c)";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`Vitality ${clamped}%`}
      role="img"
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-sm font-semibold" style={{ color: ringColor }}>
          {clamped}%
        </div>
        <div className="text-[10px] uppercase tracking-widest text-white/40">
          Vitality
        </div>
      </div>
    </div>
  );
}
