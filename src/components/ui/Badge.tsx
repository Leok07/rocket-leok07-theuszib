import React from 'react';
import { cn } from '@/lib/utils';

const variantStyles = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  win: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
  loss: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
  blue: 'bg-sky-950/70 text-sky-300 border-sky-800/80',
  orange: 'bg-orange-950/70 text-orange-300 border-orange-800/80',
  amber: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
  outline: 'bg-transparent text-zinc-300 border-zinc-700',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'win' | 'loss' | 'blue' | 'orange' | 'outline' | 'amber';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
