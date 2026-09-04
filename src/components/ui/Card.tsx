import React from 'react';
import { cn } from '@/lib/utils';

const variantStyles = {
  default: 'bg-[#11131a] border-[#232736]',
  raised: 'bg-[#181a24] border-[#2c3245]',
  'glow-blue': 'bg-[#11131a] border-[#0284c7]/40 shadow-[0_0_15px_rgba(2,132,199,0.15)]',
  'glow-orange': 'bg-[#11131a] border-[#ea580c]/40 shadow-[0_0_15px_rgba(234,88,12,0.15)]',
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
    <div className={cn('flex items-center justify-between pb-4 border-b border-[#232736] mb-4', className)} {...props}>
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
