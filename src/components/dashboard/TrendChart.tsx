'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MatchHistoryItem } from '@/types/dashboard';
import { TrendingUp, Target, Shield, Zap, Award } from 'lucide-react';

interface TrendSectionProps {
  player1History: MatchHistoryItem[];
  player2History: MatchHistoryItem[];
  player1Name: string;
  player2Name: string;
}

type MetricKey = 'goals' | 'saves' | 'bpm' | 'score';

interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: MetricConfig[] = [
  { key: 'goals', label: 'Gols', unit: 'gols', icon: Target },
  { key: 'saves', label: 'Saves', unit: 'defesas', icon: Shield },
  { key: 'bpm', label: 'BPM', unit: 'bpm', icon: Zap },
  { key: 'score', label: 'Pontos', unit: 'pts', icon: Award },
];

export function TrendChart({
  player1History,
  player2History,
  player1Name,
  player2Name,
}: TrendSectionProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('goals');

  // Reverse so games appear chronologically (Game 1 -> Game N)
  const p1Chrono = [...player1History].reverse();
  const p2Chrono = [...player2History].reverse();
  const totalGames = Math.max(p1Chrono.length, p2Chrono.length);

  if (totalGames === 0) {
    return null;
  }

  const chartData = Array.from({ length: totalGames }, (_, i) => {
    const p1Match = p1Chrono[i];
    const p2Match = p2Chrono[i];
    return {
      game: `J${i + 1}`,
      [player1Name]: p1Match ? p1Match[activeMetric] : 0,
      [player2Name]: p2Match ? p2Match[activeMetric] : 0,
      map: p1Match?.mapName || p2Match?.mapName || 'Arena',
      resultP1: p1Match?.result === 'win' ? 'Vitória' : 'Derrota',
    };
  });

  const currentConfig = METRICS.find((m) => m.key === activeMetric) || METRICS[0];
  const IconComponent = currentConfig.icon;

  return (
    <div className="rounded-xl bg-[#11131a] border border-[#232736] p-3.5 sm:p-4 space-y-3.5">
      {/* Header with Title and Metric Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232736]/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-1.5">
              Evolução Temporal & Tendências
            </h3>
            <p className="text-[10px] text-zinc-400">
              Desempenho comparativo partida a partida ao longo das partidas da dupla
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-[#232736] self-start sm:self-auto overflow-x-auto max-w-full">
          {METRICS.map((m) => {
            const MIcon = m.icon;
            const isActive = activeMetric === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#232736]/50'
                }`}
              >
                <MIcon className="w-3 h-3" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Summary Legend */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span className="font-bold text-sky-400">{player1Name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
            <span className="font-bold text-orange-400">{player2Name}</span>
          </div>
        </div>

        <div className="text-[11px] text-zinc-500 font-mono">
          {totalGames} {totalGames === 1 ? 'partida analisada' : 'partidas em sequência'}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-52 sm:h-60 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232736" opacity={0.7} />
            <XAxis
              dataKey="game"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232736' }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232736' }}
              width={36}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#11131a',
                borderColor: '#232736',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
              labelStyle={{ color: '#e4e4e7', fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(val: any, name: any) => [`${val} ${currentConfig.unit}`, name]}
            />
            <Line
              type="monotone"
              dataKey={player1Name}
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#38bdf8', strokeWidth: 0 }}
              activeDot={{ r: 5.5, stroke: '#38bdf8', strokeWidth: 2, fill: '#090a0f' }}
            />
            <Line
              type="monotone"
              dataKey={player2Name}
              stroke="#fb923c"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#fb923c', strokeWidth: 0 }}
              activeDot={{ r: 5.5, stroke: '#fb923c', strokeWidth: 2, fill: '#090a0f' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
