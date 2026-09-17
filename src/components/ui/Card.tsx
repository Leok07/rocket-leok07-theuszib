import React from 'react';
import { cn } from '@/lib/utils';

const variantStyles = {
  default: 'bg-[#09090b] border-[#1e1e24]',
  raised: 'bg-[#121215] border-[#27272a]',
  'glow-blue': 'bg-[#09090b] border-[#0284c7]/40 shadow-[0_0_15px_rgba(2,132,199,0.15)]',
  'glow-orange': 'bg-[#09090b] border-[#ea580c]/40 shadow-[0_0_15px_rgba(234,88,12,0.15)]',
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'glow-blue' | 'glow-orange';
}

export function Card({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-all duration-200 text-white',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-4 border-b border-[#1e1e24] mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-semibold tracking-wider uppercase text-zinc-300 flex items-center gap-2', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
