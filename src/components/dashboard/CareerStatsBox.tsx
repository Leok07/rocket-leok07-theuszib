'use client';

import React from 'react';
import { CareerComparisonData } from '@/types/career';
import { AggregatedPlayerDashboard } from '@/types/dashboard';
import {
  Trophy,
  Target,
  Shield,
  Zap,
  Award,
  Flame,
  Medal,
  Crosshair,
  TrendingUp,
  History,
} from 'lucide-react';

interface CareerStatsBoxProps {
  careerData: CareerComparisonData | null;
  player1Dashboard?: AggregatedPlayerDashboard;
  player2Dashboard?: AggregatedPlayerDashboard;
  isLoading?: boolean;
}

export function CareerStatsBox({
  careerData,
  player1Dashboard,
  player2Dashboard,
  isLoading,
}: CareerStatsBoxProps) {
  if (isLoading || !careerData) {
    return (
      <div className="p-5 rounded-2xl bg-[#11131a] border border-[#232736] animate-pulse space-y-4">
        <div className="h-6 w-72 bg-zinc-800 rounded-md" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="h-24 bg-zinc-800/60 rounded-xl" />
          <div className="h-24 bg-zinc-800/60 rounded-xl" />
          <div className="h-24 bg-zinc-800/60 rounded-xl" />
        </div>
      </div>
    );
  }

  const { player1: p1, player2: p2 } = careerData;

  // 100% Real Stats with safe mathematical fallbacks (0 if not played)
  const p1Matches = p1.estimatedMatches ?? 0;
  const p2Matches = p2.estimatedMatches ?? 0;

  const p1Goals = p1.goals ?? 0;
  const p2Goals = p2.goals ?? 0;
  const p1Saves = p1.saves ?? 0;
  const p2Saves = p2.saves ?? 0;
  const p1Wins = p1.wins ?? 0;
  const p2Wins = p2.wins ?? 0;
  const p1Assists = p1.assists ?? 0;
  const p2Assists = p2.assists ?? 0;
  const p1Shots = p1.shots ?? 0;
  const p2Shots = p2.shots ?? 0;
  const p1Mvps = p1.mvps ?? 0;
  const p2Mvps = p2.mvps ?? 0;

  const p1GoalsPerMatch = p1.goalsPerMatch ?? 0;
  const p2GoalsPerMatch = p2.goalsPerMatch ?? 0;
  const p1SavesPerMatch = p1.savesPerMatch ?? 0;
  const p2SavesPerMatch = p2.savesPerMatch ?? 0;
  const p1AssistsPerMatch = p1.assistsPerMatch ?? 0;
  const p2AssistsPerMatch = p2.assistsPerMatch ?? 0;
  const p1WinRate = p1.winRate ?? 0;
  const p2WinRate = p2.winRate ?? 0;
  const p1ShootingPct = p1.shootingPercentage ?? 0;
  const p2ShootingPct = p2.shootingPercentage ?? 0;
  const p1MvpRate = p1.mvpRate ?? 0;
  const p2MvpRate = p2.mvpRate ?? 0;

  // Compute Delta between Recent 2v2 Duo Form vs Lifetime Replay Average
  const p1RecentG = player1Dashboard?.session.goalsPerMatch || 0;
  const p1DeltaG = p1GoalsPerMatch > 0 ? ((p1RecentG - p1GoalsPerMatch) / p1GoalsPerMatch) * 100 : 0;

  const p2RecentSv = player2Dashboard?.session.savesPerMatch || 0;
  const p2DeltaSv = p2SavesPerMatch > 0 ? ((p2RecentSv - p2SavesPerMatch) / p2SavesPerMatch) * 100 : 0;

  const metrics = [
    {
      label: 'Gols Totais nos Replays',
      p1Val: p1Goals.toLocaleString('pt-BR'),
      p2Val: p2Goals.toLocaleString('pt-BR'),
      p1Raw: p1Goals,
      p2Raw: p2Goals,
      p1Sub: `${p1GoalsPerMatch.toFixed(2)} / jogo`,
      p2Sub: `${p2GoalsPerMatch.toFixed(2)} / jogo`,
      icon: Target,
      color: 'text-emerald-400',
    },
    {
      label: 'Saves Totais nos Replays',
      p1Val: p1Saves.toLocaleString('pt-BR'),
      p2Val: p2Saves.toLocaleString('pt-BR'),
      p1Raw: p1Saves,
      p2Raw: p2Saves,
      p1Sub: `${p1SavesPerMatch.toFixed(2)} / jogo`,
      p2Sub: `${p2SavesPerMatch.toFixed(2)} / jogo`,
      icon: Shield,
      color: 'text-cyan-400',
    },
    {
      label: 'Vitorias Totais',
      p1Val: p1Wins.toLocaleString('pt-BR'),
      p2Val: p2Wins.toLocaleString('pt-BR'),
      p1Raw: p1Wins,
      p2Raw: p2Wins,
      p1Sub: `${p1WinRate.toFixed(1)}% winrate`,
      p2Sub: `${p2WinRate.toFixed(1)}% winrate`,
      icon: Trophy,
      color: 'text-amber-400',
    },
    {
      label: 'Assists Totais',
      p1Val: p1Assists.toLocaleString('pt-BR'),
      p2Val: p2Assists.toLocaleString('pt-BR'),
      p1Raw: p1Assists,
      p2Raw: p2Assists,
      p1Sub: `${p1AssistsPerMatch.toFixed(2)} / jogo`,
      p2Sub: `${p2AssistsPerMatch.toFixed(2)} / jogo`,
      icon: Zap,
      color: 'text-purple-400',
    },
    {
      label: 'Precisao de Finalizacao',
      p1Val: `${p1ShootingPct.toFixed(1)}%`,
      p2Val: `${p2ShootingPct.toFixed(1)}%`,
      p1Raw: p1ShootingPct,
      p2Raw: p2ShootingPct,
      p1Sub: `${p1Shots.toLocaleString('pt-BR')} chutes`,
      p2Sub: `${p2Shots.toLocaleString('pt-BR')} chutes`,
      icon: Crosshair,
      color: 'text-rose-400',
    },
    {
      label: 'Total de MVPs',
      p1Val: p1Mvps.toLocaleString('pt-BR'),
      p2Val: p2Mvps.toLocaleString('pt-BR'),
      p1Raw: p1Mvps,
      p2Raw: p2Mvps,
      p1Sub: `${p1MvpRate.toFixed(1)}% das vitorias`,
      p2Sub: `${p2MvpRate.toFixed(1)}% das vitorias`,
      icon: Award,
      color: 'text-yellow-400',
    },
  ];

  // Dynamic Leaders for Real Milestones
  const topGoalLeader = p1Goals >= p2Goals ? p1.playerName : p2.playerName;
  const topGoalCount = Math.max(p1Goals, p2Goals);

  const topSaveLeader = p1Saves >= p2Saves ? p1.playerName : p2.playerName;
  const topSaveCount = Math.max(p1Saves, p2Saves);

  const topWinLeader = p1Wins >= p2Wins ? p1.playerName : p2.playerName;
  const topWinCount = Math.max(p1Wins, p2Wins);

  const topAssistLeader = p1Assists >= p2Assists ? p1.playerName : p2.playerName;
  const topAssistCount = Math.max(p1Assists, p2Assists);

  return (
    <div className="rounded-2xl bg-[#11131a] border border-[#232736] p-4 sm:p-6 space-y-5 shadow-xl">
      {/* Header - Desktop Widescreen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232736]/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-950/70 border border-sky-800/60 text-sky-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              Estatisticas Acumuladas no Ballchasing
            </h3>
            <p className="text-xs text-zinc-400">
              Dados 100% reais calculados a partir dos replays registrados na API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-md bg-sky-950/90 border border-sky-600/60 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
            title="Estatisticas 100% reais extraidas diretamente dos arquivos de replay do Ballchasing."
          >
            Ballchasing • Dados Reais da API
          </span>
        </div>
      </div>

      {/* Player Profile & Real Record Cards - Desktop 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Card */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-sky-900/40 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              <span className="text-sm font-bold text-sky-400">{p1.playerName}</span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              {p1.platformLabel} • {p1Matches} partidas analisadas
            </p>
          </div>

          <div className="text-right space-y-0.5">
            {p1.rank2v2 ? (
              <>
                <span className="text-sm font-black text-zinc-100 block tracking-wide">
                  {p1.rank2v2.rank}
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {p1.rank2v2.mmr.toLocaleString('pt-BR')} MMR • 2v2
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-black text-zinc-100 block font-mono">
                  {p1Matches} partidas
                </span>
                <span className="text-xs text-zinc-400">
                  {p1Wins}V - {p1Matches - p1Wins}D ({p1WinRate.toFixed(1)}% WR)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-orange-900/40 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
              <span className="text-sm font-bold text-orange-400">{p2.playerName}</span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              {p2.platformLabel} • {p2Matches} partidas analisadas
            </p>
          </div>

          <div className="text-right space-y-0.5">
            {p2.rank2v2 ? (
              <>
                <span className="text-sm font-black text-zinc-100 block tracking-wide">
                  {p2.rank2v2.rank}
                </span>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {p2.rank2v2.mmr.toLocaleString('pt-BR')} MMR • 2v2
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-black text-zinc-100 block font-mono">
                  {p2Matches} partidas
                </span>
                <span className="text-xs text-zinc-400">
                  {p2Wins}V - {p2Matches - p2Wins}D ({p2WinRate.toFixed(1)}% WR)
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Career Metric Comparison Rows - Desktop 2-Column Grid of Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {metrics.map((m) => {
          const totalVal = (m.p1Raw || 0) + (m.p2Raw || 0);
          const p1Pct = totalVal > 0 ? ((m.p1Raw || 0) / totalVal) * 100 : 50;
          const p2Pct = totalVal > 0 ? ((m.p2Raw || 0) / totalVal) * 100 : 50;
          const MIcon = m.icon;

          return (
            <div
              key={m.label}
              className="p-3.5 rounded-xl bg-[#181a24]/80 border border-[#232736] space-y-2 hover:border-[#38bdf8]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                {/* P1 Value */}
                <div className="text-left">
                  <span className="text-sm font-black text-sky-400 block font-mono">{m.p1Val}</span>
                  <span className="text-[11px] text-zinc-400 font-medium">{m.p1Sub}</span>
                </div>

                {/* Metric Center Label */}
                <div className="flex items-center gap-1.5 text-center text-zinc-200 font-bold text-xs">
                  <MIcon className={`w-4 h-4 ${m.color}`} />
                  <span>{m.label}</span>
                </div>

                {/* P2 Value */}
                <div className="text-right">
                  <span className="text-sm font-black text-orange-400 block font-mono">{m.p2Val}</span>
                  <span className="text-[11px] text-zinc-400 font-medium">{m.p2Sub}</span>
                </div>
              </div>

              {/* Dual Comparison Bar */}
              <div className="h-2 w-full bg-[#11131a] rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-500 rounded-l-full"
                  style={{ width: `${p1Pct}%` }}
                />
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 rounded-r-full"
                  style={{ width: `${p2Pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sinergia de Dupla vs Media Geral (Desktop 2-Column Split) */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#181a24] via-[#11131a] to-[#181a24] border border-[#232736] space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200">
            Sinergia na Dupla vs Media dos Replays
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* P1 Synergy Delta */}
          <div className="p-3 rounded-lg bg-[#11131a] border border-[#232736] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 text-sm">{p1.playerName}</span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  p1DeltaG >= 0
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {p1DeltaG >= 0 ? `+${p1DeltaG.toFixed(1)}% Gols` : `${p1DeltaG.toFixed(1)}% Gols`}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Produzindo{' '}
              <strong className="text-zinc-100 font-bold">{p1RecentG.toFixed(2)} gols/jogo</strong> na sessao vs{' '}
              <strong className="text-zinc-300">{p1GoalsPerMatch.toFixed(2)} na media dos replays</strong>.
            </p>
          </div>

          {/* P2 Synergy Delta */}
          <div className="p-3 rounded-lg bg-[#11131a] border border-[#232736] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 text-sm">{p2.playerName}</span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  p2DeltaSv >= 0
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {p2DeltaSv >= 0
                  ? `+${p2DeltaSv.toFixed(1)}% Saves`
                  : `${p2DeltaSv.toFixed(1)}% Saves`}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Garantindo{' '}
              <strong className="text-zinc-100 font-bold">{p2RecentSv.toFixed(2)} saves/jogo</strong> na sessao vs{' '}
              <strong className="text-zinc-300">{p2SavesPerMatch.toFixed(2)} na media dos replays</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Badges e Marcos de Legado - 100% Dinamicos e Reais */}
      <div className="border-t border-[#232736]/60 pt-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Medal className="w-4 h-4 text-yellow-400" />
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300">
            Liderancas Reais Registradas
          </h4>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#181a24] border border-amber-500/30 text-center space-y-1">
            <span className="text-xs text-amber-400 font-black uppercase block tracking-wider">Top Artilheiro</span>
            <span className="font-bold text-zinc-100">{topGoalLeader} ({topGoalCount.toLocaleString('pt-BR')} Gols)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181a24] border border-cyan-500/30 text-center space-y-1">
            <span className="text-xs text-cyan-400 font-black uppercase block tracking-wider">Top Muralha</span>
            <span className="font-bold text-zinc-100">{topSaveLeader} ({topSaveCount.toLocaleString('pt-BR')} Saves)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181a24] border border-sky-500/30 text-center space-y-1">
            <span className="text-xs text-sky-400 font-black uppercase block tracking-wider">Mais Vitorias</span>
            <span className="font-bold text-zinc-100">{topWinLeader} ({topWinCount.toLocaleString('pt-BR')} Vitorias)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#181a24] border border-purple-500/30 text-center space-y-1">
            <span className="text-xs text-purple-400 font-black uppercase block tracking-wider">Top Garcom</span>
            <span className="font-bold text-zinc-100">{topAssistLeader} ({topAssistCount.toLocaleString('pt-BR')} Assists)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
