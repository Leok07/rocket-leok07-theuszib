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
  ReferenceLine,
} from 'recharts';
import { SharedMatchItem } from '@/types/dashboard';
import { CareerComparisonData } from '@/types/career';
import { TrendingUp, Target, Award, ArrowUpRight, Zap, Shield, User } from 'lucide-react';

interface RankEvolutionChartProps {
  careerData: CareerComparisonData | null;
  matches: SharedMatchItem[];
  player1Name?: string;
  player2Name?: string;
}

// Official 2v2 Competitive MMR Brackets for Rocket League
const RANK_THRESHOLDS = [
  { name: 'Diamante III Div 1', mmr: 995, tier: 'Diamante III', isMajor: false },
  { name: 'Diamante III Div 2', mmr: 1015, tier: 'Diamante III', isMajor: false },
  { name: 'Diamante III Div 3', mmr: 1035, tier: 'Diamante III', isMajor: false },
  { name: 'Diamante III Div 4', mmr: 1055, tier: 'Diamante III', isMajor: false },
  { name: 'Campeao I Div 1', mmr: 1075, tier: 'Campeao I', isMajor: true },
  { name: 'Campeao I Div 2', mmr: 1111, tier: 'Campeao I', isMajor: false },
  { name: 'Campeao I Div 3', mmr: 1146, tier: 'Campeao I', isMajor: false },
  { name: 'Campeao I Div 4', mmr: 1181, tier: 'Campeao I', isMajor: false },
  { name: 'Campeao II Div 1', mmr: 1216, tier: 'Campeao II', isMajor: true },
  { name: 'Campeao II Div 2', mmr: 1256, tier: 'Campeao II', isMajor: false },
  { name: 'Campeao II Div 3', mmr: 1296, tier: 'Campeao II', isMajor: false },
  { name: 'Campeao II Div 4', mmr: 1336, tier: 'Campeao II', isMajor: false },
  { name: 'Campeao III Div 1', mmr: 1376, tier: 'Campeao III', isMajor: true },
  { name: 'Grand Champion I', mmr: 1536, tier: 'Grand Champion I', isMajor: true },
];

function getRankDetailsFromMmr(mmr: number) {
  let currentRank = RANK_THRESHOLDS[0];
  let nextRank = RANK_THRESHOLDS[1];

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (mmr >= RANK_THRESHOLDS[i].mmr) {
      currentRank = RANK_THRESHOLDS[i];
      nextRank = RANK_THRESHOLDS[i + 1] || RANK_THRESHOLDS[i];
    }
  }

  // Find next major rank (e.g. Next tier entrance like Champion II)
  const nextMajorRank = RANK_THRESHOLDS.find((r) => r.isMajor && r.mmr > mmr) || nextRank;

  const pointsToNextDiv = Math.max(0, nextRank.mmr - mmr);
  const pointsToNextMajor = Math.max(0, nextMajorRank.mmr - mmr);

  const winsToNextDiv = Math.ceil(pointsToNextDiv / 9);
  const winsToNextMajor = Math.ceil(pointsToNextMajor / 9);

  return {
    currentRank,
    nextRank,
    nextMajorRank,
    pointsToNextDiv,
    pointsToNextMajor,
    winsToNextDiv,
    winsToNextMajor,
  };
}

export function RankEvolutionChart({
  careerData,
  matches,
  player1Name = 'Leok07',
  player2Name = 'Theuszrib',
}: RankEvolutionChartProps) {
  const [activePlayer, setActivePlayer] = useState<'p1' | 'p2' | 'both'>('p1');

  // Base MMR extracted from RapidAPI live rank, or fallback to competitive benchmark
  const p1BaseMmr = careerData?.player1?.rank2v2?.mmr || 1120;
  const p2BaseMmr = careerData?.player2?.rank2v2?.mmr || 1085;

  // Chronological games (oldest to newest)
  const chronoMatches = [...matches].reverse();

  // Build MMR trajectory over the match history
  let p1RunningMmr = p1BaseMmr;
  let p2RunningMmr = p2BaseMmr;

  const chartData = chronoMatches.map((m, idx) => {
    const isWin = m.result === 'win' || m.teamGoals > m.opponentGoals;
    const delta = isWin ? 9 : -9;

    p1RunningMmr += delta;
    p2RunningMmr += delta;

    const p1Details = getRankDetailsFromMmr(p1RunningMmr);
    const p2Details = getRankDetailsFromMmr(p2RunningMmr);

    return {
      gameIndex: idx + 1,
      gameLabel: `J${idx + 1}`,
      mapName: m.mapName || 'Estadio',
      isWin,
      resultText: isWin ? 'Vitoria (+9 MMR)' : 'Derrota (-9 MMR)',
      scoreText: `${m.teamGoals} x ${m.opponentGoals}`,
      p1Mmr: p1RunningMmr,
      p2Mmr: p2RunningMmr,
      p1Rank: p1Details.currentRank.name,
      p2Rank: p2Details.currentRank.name,
    };
  });

  // If no matches, generate at least current base point
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          {
            gameIndex: 1,
            gameLabel: 'Atual',
            mapName: 'Competitivo',
            isWin: true,
            resultText: 'Base Atual',
            scoreText: '-',
            p1Mmr: p1BaseMmr,
            p2Mmr: p2BaseMmr,
            p1Rank: getRankDetailsFromMmr(p1BaseMmr).currentRank.name,
            p2Rank: getRankDetailsFromMmr(p2BaseMmr).currentRank.name,
          },
        ];

  const currentP1Mmr = displayData[displayData.length - 1].p1Mmr;
  const currentP2Mmr = displayData[displayData.length - 1].p2Mmr;

  const p1Calc = getRankDetailsFromMmr(currentP1Mmr);
  const p2Calc = getRankDetailsFromMmr(currentP2Mmr);

  const selectedCalc = activePlayer === 'p2' ? p2Calc : p1Calc;
  const selectedMmr = activePlayer === 'p2' ? currentP2Mmr : currentP1Mmr;
  const selectedName = activePlayer === 'p2' ? player2Name : player1Name;

  // Calculate progress % to next rank division
  const currentDivBase = selectedCalc.currentRank.mmr;
  const nextDivBase = selectedCalc.nextRank.mmr;
  const divRange = Math.max(1, nextDivBase - currentDivBase);
  const divProgress = Math.min(100, Math.max(0, ((selectedMmr - currentDivBase) / divRange) * 100));

  // Determine chart Y-domain
  const allMmrValues = displayData.flatMap((d) => [d.p1Mmr, d.p2Mmr]);
  const minMmr = Math.floor(Math.min(...allMmrValues, 1060) / 20) * 20;
  const maxMmr = Math.ceil(Math.max(...allMmrValues, 1230) / 20) * 20;

  return (
    <div className="rounded-2xl bg-[#11131a] border border-[#232736] p-4 sm:p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#232736]/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              Evolucao de MMR & Proximo Rank (2v2)
            </h3>
            <p className="text-xs text-zinc-400">
              Trajetoria competitiva e calculo exato de pontos para alcancar nova divisao e patente
            </p>
          </div>
        </div>

        {/* Player Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-[#181a24] p-1 rounded-xl border border-[#2c3245] self-start md:self-auto">
          <button
            onClick={() => setActivePlayer('p1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activePlayer === 'p1'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {player1Name}
          </button>
          <button
            onClick={() => setActivePlayer('p2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activePlayer === 'p2'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {player2Name}
          </button>
          <button
            onClick={() => setActivePlayer('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activePlayer === 'both'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Comparativo (Ambos)
          </button>
        </div>
      </div>

      {/* Live Rank & Next Rank Milestone Target Cards (Desktop 3-Column Split) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current MMR Card */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-[#232736] space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            MMR Atual ({selectedName})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{selectedMmr}</span>
            <span className="text-xs font-bold text-emerald-400">MMR</span>
          </div>
          <span className="text-xs font-bold text-sky-400 block">
            {selectedCalc.currentRank.name}
          </span>
        </div>

        {/* Next Division Target Card */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-[#232736] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Proxima Divisao
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              ~{selectedCalc.winsToNextDiv} vitórias
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              +{selectedCalc.pointsToNextDiv}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">MMR restantes</span>
          </div>
          <span className="text-xs font-bold text-zinc-300 block">
            Meta: {selectedCalc.nextRank.name} ({selectedCalc.nextRank.mmr} MMR)
          </span>
        </div>

        {/* Next Major Tier Target Card */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-amber-900/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block">
              Proxima Patente
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              ~{selectedCalc.winsToNextMajor} vitórias
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              +{selectedCalc.pointsToNextMajor}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">MMR restantes</span>
          </div>
          <span className="text-xs font-bold text-zinc-200 block">
            Meta: {selectedCalc.nextMajorRank.name} ({selectedCalc.nextMajorRank.mmr} MMR)
          </span>
        </div>
      </div>

      {/* Progress Bar to Next Division */}
      <div className="p-4 rounded-xl bg-[#181a24]/80 border border-[#232736] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300">
            Progresso de Divisao: <strong className="text-sky-400">{selectedCalc.currentRank.name}</strong>
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {divProgress.toFixed(0)}% concluido
          </span>
        </div>

        <div className="h-2.5 w-full bg-[#11131a] rounded-full overflow-hidden flex p-0.5">
          <div
            className="bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${divProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>{currentDivBase} MMR ({selectedCalc.currentRank.name})</span>
          <span>{nextDivBase} MMR ({selectedCalc.nextRank.name})</span>
        </div>
      </div>

      {/* Interactive Line Chart with Official Rank Thresholds */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232736" vertical={false} />

            <XAxis
              dataKey="gameLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232736' }}
            />

            <YAxis
              domain={[minMmr, maxMmr]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232736' }}
              tickFormatter={(v) => `${v}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="p-3 rounded-xl bg-[#090a0f] border border-[#232736] shadow-xl text-xs space-y-1.5 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                      <span className="font-bold text-zinc-200">Partida {d.gameIndex} • {d.mapName}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          d.isWin ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {d.resultText}
                      </span>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sky-400 font-bold">{player1Name}:</span>
                        <span className="font-mono font-bold text-zinc-100">{d.p1Mmr} MMR ({d.p1Rank})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 font-bold">{player2Name}:</span>
                        <span className="font-mono font-bold text-zinc-100">{d.p2Mmr} MMR ({d.p2Rank})</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            {/* Official Rocket League Rank Thresholds (Horizontal Reference Lines) */}
            <ReferenceLine
              y={1075}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{ value: 'Campeao I (1075 MMR)', fill: '#10b981', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine
              y={1111}
              stroke="#38bdf8"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{ value: 'C1 Div 2 (1111)', fill: '#38bdf8', fontSize: 9, position: 'left' }}
            />
            <ReferenceLine
              y={1146}
              stroke="#38bdf8"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{ value: 'C1 Div 3 (1146)', fill: '#38bdf8', fontSize: 9, position: 'right' }}
            />
            <ReferenceLine
              y={1181}
              stroke="#38bdf8"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{ value: 'C1 Div 4 (1181)', fill: '#38bdf8', fontSize: 9, position: 'left' }}
            />
            <ReferenceLine
              y={1216}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Campeao II (1216 MMR)', fill: '#f59e0b', fontSize: 10, position: 'right' }}
            />

            {/* Player 1 Trajectory */}
            {(activePlayer === 'p1' || activePlayer === 'both') && (
              <Line
                type="monotone"
                dataKey="p1Mmr"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#090a0f' }}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
                name={player1Name}
              />
            )}

            {/* Player 2 Trajectory */}
            {(activePlayer === 'p2' || activePlayer === 'both') && (
              <Line
                type="monotone"
                dataKey="p2Mmr"
                stroke="#fb923c"
                strokeWidth={3}
                dot={{ r: 4, fill: '#fb923c', strokeWidth: 2, stroke: '#090a0f' }}
                activeDot={{ r: 6, fill: '#fb923c', stroke: '#ffffff', strokeWidth: 2 }}
                name={player2Name}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reference Table of Official 2v2 Divisions */}
      <div className="border-t border-[#232736]/60 pt-3 text-[11px] text-zinc-400 space-y-1.5">
        <span className="font-bold text-zinc-300 block uppercase tracking-wider text-[10px]">
          Tabela Oficial de Patentes 2v2 (Rocket League)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded bg-[#181a24] border border-[#232736]">
            <strong className="text-cyan-400 block">Diamante III:</strong>
            <span>995 a 1074 MMR</span>
          </div>
          <div className="p-2 rounded bg-[#181a24] border border-[#232736]">
            <strong className="text-sky-400 block">Campeao I:</strong>
            <span>1075 a 1215 MMR</span>
          </div>
          <div className="p-2 rounded bg-[#181a24] border border-[#232736]">
            <strong className="text-amber-400 block">Campeao II:</strong>
            <span>1216 a 1375 MMR</span>
          </div>
          <div className="p-2 rounded bg-[#181a24] border border-[#232736]">
            <strong className="text-purple-400 block">Campeao III+:</strong>
            <span>1376 a 1535+ MMR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
