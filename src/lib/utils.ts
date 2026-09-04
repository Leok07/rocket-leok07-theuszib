import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0';
  if (decimals === 0) return Math.round(value).toLocaleString('pt-BR');
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function clamp(val: number, minVal: number = 0, maxVal: number = 99): number {
  return Math.max(minVal, Math.min(maxVal, val));
}

export function safeDiv(numerator: number, denominator: number, defaultVal: number = 0): number {
  return denominator && denominator > 0 ? numerator / denominator : defaultVal;
}

export function piecewiseLinearScale(val: number, minVal: number, midVal: number, maxVal: number): number {
  if (val <= minVal) return 50.0;
  if (val <= midVal) {
    const pct = (val - minVal) / (midVal - minVal);
    return 50.0 + pct * 30.0; // 50 to 80
  }
  const pct = (val - midVal) / (maxVal - midVal);
  return clamp(80.0 + pct * 19.0, 80.0, 99.0); // 80 to 99
}

export function inversePiecewiseLinearScale(val: number, bestVal: number, midVal: number, worstVal: number): number {
  if (val <= bestVal) return 99.0;
  if (val <= midVal) {
    const pct = (val - bestVal) / (midVal - bestVal);
    return 99.0 - pct * 19.0; // 99 down to 80
  }
  const pct = (val - midVal) / (worstVal - midVal);
  return clamp(80.0 - pct * 30.0, 50.0, 80.0); // 80 down to 50
}
