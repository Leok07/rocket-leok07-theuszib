import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CompareBar, CompareBarProps } from './CompareBar';
import { LucideIcon } from 'lucide-react';

interface CompareSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  badgeText?: string;
  metrics: CompareBarProps[];
}

export const CompareSection = React.memo(function CompareSection({
  title,
  icon: Icon,
  iconColor = 'text-sky-400',
  badgeText,
  metrics,
}: CompareSectionProps) {
  return (
    <Card className="p-4 sm:p-5">
      <CardHeader className="pb-3 mb-3">
        <CardTitle className="text-xs sm:text-sm">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span>{title}</span>
        </CardTitle>
        {badgeText && (
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-[#181a24] px-2 py-0.5 rounded border border-[#2c3245]">
            {badgeText}
          </span>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {metrics.map((m) => (
            <CompareBar key={m.label} {...m} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
