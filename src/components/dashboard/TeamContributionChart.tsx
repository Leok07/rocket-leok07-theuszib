import React from 'react';
import { AggregatedPlayerDashboard } from '@/types/dashboard';
import { PieChart as PieIcon, Crosshair, Shield, Flame, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface TeamContributionChartProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
}

interface ContributionItemProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  p1Value: number;
  p2Value: number;
  p1Name: string;
  p2Name: string;
  unit?: string;
}

const ContributionDonut: React.FC<ContributionItemProps> = ({
  title,
  icon: Icon,
  iconColor,
  p1Value,
  p2Value,
  p1Name,
  p2Name,
  unit = '',
}) => {
  const total = p1Value + p2Value;
  const p1Pct = total > 0 ? Math.round((p1Value / total) * 100) : 50;
  const p2Pct = total > 0 ? 100 - p1Pct : 50;

  const data = [
    { name: p1Name, value: p1Value || 0.001, color: '#38bdf8' }, // sky-400
    { name: p2Name, value: p2Value || 0.001, color: '#fb923c' }, // orange-400
  ];

  return (
    <div className="p-3 rounded-xl bg-[#181a24] border border-[#232736] flex flex-col justify-between space-y-2">
      <div className="flex items-center justify-between border-b border-[#232736]/60 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">{title}</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-medium">
          Total: {total} {unit}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 py-1">
        {/* Donut Chart */}
        <div className="w-20 h-20 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={36}
                paddingAngle={4}
                dataKey="value"
                stroke="#181a24"
                strokeWidth={2}
              >
                <Cell fill="#38bdf8" />
                <Cell fill="#fb923c" />
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="bg-[#11131a] border border-[#232736] px-2 py-1 rounded text-[11px] text-white shadow-lg">
                        <span className="font-bold">{item.name}: </span>
                        <span>{item.value} ({Math.round(((item.value as number) / (total || 1)) * 100)}%)</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-zinc-400">{p1Pct}%</span>
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="flex-1 space-y-2 text-xs">
          {/* Player 1 Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <span className="text-zinc-300 font-medium text-[11px] truncate max-w-[80px]">
                {p1Name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-sky-400">{p1Value}</span>
              <span className="text-[10px] text-zinc-500 ml-1">({p1Pct}%)</span>
            </div>
          </div>

          {/* Player 2 Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              <span className="text-zinc-300 font-medium text-[11px] truncate max-w-[80px]">
                {p2Name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-orange-400">{p2Value}</span>
              <span className="text-[10px] text-zinc-500 ml-1">({p2Pct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeamContributionChart: React.FC<TeamContributionChartProps> = ({
  player1,
  player2,
}) => {
  const p1Goals = player1.session.goalsPerMatch * (player1.session.totalMatches || 1);
  const p2Goals = player2.session.goalsPerMatch * (player2.session.totalMatches || 1);

  const p1Assists = player1.session.assistsPerMatch * (player1.session.totalMatches || 1);
  const p2Assists = player2.session.assistsPerMatch * (player2.session.totalMatches || 1);

  const p1Saves = player1.session.savesPerMatch * (player1.session.totalMatches || 1);
  const p2Saves = player2.session.savesPerMatch * (player2.session.totalMatches || 1);

  const p1Demos = Math.round(player1.demos.avgInflicted * (player1.session.totalMatches || 1));
  const p2Demos = Math.round(player2.demos.avgInflicted * (player2.session.totalMatches || 1));

  return (
    <div className="rounded-xl bg-[#11131a] border border-[#232736] p-3 sm:p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232736]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-100">
              Contribuicao Proporcional do Time
            </h4>
            <p className="text-[10px] text-zinc-400">
              Divisao percentual das acoes ofensivas, defensivas e fisicas da dupla
            </p>
          </div>
        </div>
      </div>

      {/* 4-Column Grid of Donut Charts for Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ContributionDonut
          title="Gols Marcados"
          icon={Crosshair}
          iconColor="text-emerald-400"
          p1Value={Math.round(p1Goals)}
          p2Value={Math.round(p2Goals)}
          p1Name={player1.playerName}
          p2Name={player2.playerName}
          unit="gols"
        />

        <ContributionDonut
          title="Assistencias"
          icon={Activity}
          iconColor="text-cyan-400"
          p1Value={Math.round(p1Assists)}
          p2Value={Math.round(p2Assists)}
          p1Name={player1.playerName}
          p2Name={player2.playerName}
          unit="assists"
        />

        <ContributionDonut
          title="Defesas & Saves"
          icon={Shield}
          iconColor="text-indigo-400"
          p1Value={Math.round(p1Saves)}
          p2Value={Math.round(p2Saves)}
          p1Name={player1.playerName}
          p2Name={player2.playerName}
          unit="saves"
        />

        <ContributionDonut
          title="Demolicoes Infligidas"
          icon={Flame}
          iconColor="text-rose-400"
          p1Value={p1Demos}
          p2Value={p2Demos}
          p1Name={player1.playerName}
          p2Name={player2.playerName}
          unit="demos"
        />
      </div>
    </div>
  );
};
