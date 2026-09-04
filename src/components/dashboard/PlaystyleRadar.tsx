'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { PlaystyleRadarPoint } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Crosshair } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface PlaystyleRadarProps {
  radar1: PlaystyleRadarPoint[];
  radar2: PlaystyleRadarPoint[];
  player1Name?: string;
  player2Name?: string;
}

export function PlaystyleRadar({
  radar1,
  radar2,
  player1Name = 'Leok07',
  player2Name = 'Theuszrib',
}: PlaystyleRadarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return (radar1 || []).map((item, idx) => {
      const comp = radar2?.[idx];
      return {
        axis: item.axis,
        p1: item.value,
        p2: comp ? comp.value : 0,
        fullMark: 100,
      };
    });
  }, [radar1, radar2]);

  if (!mounted) {
    return (
      <Card className="h-[360px] flex items-center justify-center p-4">
        <div className="animate-pulse text-zinc-500 text-xs">Carregando Radar...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-5">
      <CardHeader className="pb-2 mb-2">
        <CardTitle className="text-xs sm:text-sm">
          <Crosshair className="w-4 h-4 text-sky-400" />
          <span>Radar de Estilo de Jogo</span>
        </CardTitle>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>{player1Name}</span>
          </div>
          <div className="flex items-center gap-1 text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>{player2Name}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[260px] sm:h-[300px] w-full -my-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#232736" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#232736"
                tick={{ fill: '#71717a', fontSize: 8 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#11131a',
                  borderColor: '#232736',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '6px 10px',
                }}
                formatter={(value: any, name: any) => [
                  `${value} / 100`,
                  name === 'p1' ? player1Name : player2Name,
                ]}
              />
              <Radar
                name="p1"
                dataKey="p1"
                stroke="#0284c7"
                fill="#0284c7"
                fillOpacity={0.35}
              />
              <Radar
                name="p2"
                dataKey="p2"
                stroke="#ea580c"
                fill="#ea580c"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Value Comparison grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center text-[10px] sm:text-xs pt-2 border-t border-[#232736]/60">
          {chartData.map((item) => (
            <div key={item.axis} className="p-1.5 rounded bg-[#141722] border border-[#232736]/60">
              <span className="text-zinc-400 font-medium block truncate text-[9px] sm:text-[10px]">
                {item.axis}
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5 font-bold">
                <span className="text-sky-400">{item.p1}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-orange-400">{item.p2}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
