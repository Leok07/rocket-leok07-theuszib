import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'amber';
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  color = 'default',
  className,
}: StatCardProps) {
  const colorMap = {
    default: 'text-zinc-100 border-[#232736] bg-[#11131a]',
    blue: 'text-sky-400 border-sky-950/60 bg-sky-950/20',
    orange: 'text-orange-400 border-orange-950/60 bg-orange-950/20',
    green: 'text-emerald-400 border-emerald-950/60 bg-emerald-950/20',
    red: 'text-rose-400 border-rose-950/60 bg-rose-950/20',
    purple: 'text-purple-400 border-purple-950/60 bg-purple-950/20',
    amber: 'text-amber-400 border-amber-950/60 bg-amber-950/20',
  };

  const iconColorMap = {
    default: 'text-zinc-400',
    blue: 'text-sky-400',
    orange: 'text-orange-400',
    green: 'text-emerald-400',
    red: 'text-rose-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-200 hover:border-zinc-700',
        colorMap[color],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        {Icon && <Icon className={cn('w-4 h-4', iconColorMap[color])} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {subValue && (
          <span className="text-xs font-medium text-zinc-400">{subValue}</span>
        )}
      </div>
    </div>
  );
}
