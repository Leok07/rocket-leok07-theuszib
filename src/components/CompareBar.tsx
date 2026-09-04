import React from 'react';

export interface CompareBarProps {
  label: string;
  p1Value: number;
  p2Value: number;
  p1Formatted: string;
  p2Formatted: string;
  higherIsBetter?: boolean;
  unit?: string;
}

export const CompareBar = React.memo(function CompareBar({
  label,
  p1Value,
  p2Value,
  p1Formatted,
  p2Formatted,
  higherIsBetter = true,
  unit,
}: CompareBarProps) {
  // Sanitize values against NaNs
  const v1 = isNaN(p1Value) ? 0 : p1Value;
  const v2 = isNaN(p2Value) ? 0 : p2Value;

  const isTie = v1 === v2;
  const isP1Leading = !isTie && (higherIsBetter ? v1 > v2 : v1 < v2);
  const isP2Leading = !isTie && (higherIsBetter ? v2 > v1 : v2 < v1);

  // Calculate visual advantage ratio safely
  let p1Ratio = 50;
  if (!isTie) {
    // Offset negative numbers to positive space if either is negative
    const minVal = Math.min(v1, v2);
    const offset = minVal < 0 ? Math.abs(minVal) + 1 : 0;
    const adjV1 = v1 + offset;
    const adjV2 = v2 + offset;
    const total = Math.max(0.0001, adjV1 + adjV2);

    if (higherIsBetter) {
      p1Ratio = Math.min(90, Math.max(10, (adjV1 / total) * 100));
    } else {
      // When lower is better, invert the visual share
      p1Ratio = Math.min(90, Math.max(10, (adjV2 / total) * 100));
    }
  }
  const p2Ratio = 100 - p1Ratio;

  return (
    <div className="py-2 px-3 rounded-lg bg-[#141722]/90 border border-[#232736]/70 hover:border-zinc-700 transition-colors">
      {/* Values & Label Line */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Player 1 (Leok07) Value */}
        <div className="w-16 sm:w-20 text-left shrink-0">
          <span
            className={`font-bold text-xs sm:text-base tabular-nums ${
              isP1Leading ? 'text-sky-400 font-black drop-shadow-[0_0_8px_rgba(2,132,199,0.3)]' : 'text-zinc-400'
            }`}
          >
            {p1Formatted}
          </span>
        </div>

        {/* Central Label */}
        <div className="flex-1 text-center truncate px-1">
          <span className="text-zinc-200 font-semibold text-xs sm:text-sm tracking-wide">
            {label}
          </span>
          {unit && <span className="text-[10px] text-zinc-500 ml-1">({unit})</span>}
        </div>

        {/* Player 2 (Theuszrib) Value */}
        <div className="w-16 sm:w-20 text-right shrink-0">
          <span
            className={`font-bold text-xs sm:text-base tabular-nums ${
              isP2Leading ? 'text-orange-400 font-black drop-shadow-[0_0_8px_rgba(234,88,12,0.3)]' : 'text-zinc-400'
            }`}
          >
            {p2Formatted}
          </span>
        </div>
      </div>

      {/* Comparison Progress Bar */}
      <div className="mt-1.5 h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden flex gap-0.5">
        <div
          style={{ width: `${p1Ratio}%` }}
          className={`h-full rounded-l-full transition-all duration-500 ${
            isP1Leading
              ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]'
              : isTie
              ? 'bg-sky-700/60'
              : 'bg-sky-950'
          }`}
        />
        <div
          style={{ width: `${p2Ratio}%` }}
          className={`h-full rounded-r-full transition-all duration-500 ${
            isP2Leading
              ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'
              : isTie
              ? 'bg-orange-700/60'
              : 'bg-orange-950'
          }`}
        />
      </div>
    </div>
  );
});
