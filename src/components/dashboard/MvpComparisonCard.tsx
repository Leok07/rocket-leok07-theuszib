import React from 'react';
import { AggregatedPlayerDashboard } from '@/types/dashboard';
import { Crown, Award, Zap, ChevronRight } from 'lucide-react';

interface MvpComparisonCardProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
}

export const MvpComparisonCard: React.FC<MvpComparisonCardProps> = ({ player1, player2 }) => {
  const p1Mvp = player1.session.mvpCount || 0;
  const p2Mvp = player2.session.mvpCount || 0;
  const totalMvps = p1Mvp + p2Mvp;

  const p1Wins = player1.session.wins || 1;
  const p2Wins = player2.session.wins || 1;

  const p1MvpRateOnWins = Math.round((p1Mvp / p1Wins) * 100);
  const p2MvpRateOnWins = Math.round((p2Mvp / p2Wins) * 100);

  const p1PercentageOfTotal = totalMvps > 0 ? Math.round((p1Mvp / totalMvps) * 100) : 50;
  const p2PercentageOfTotal = totalMvps > 0 ? 100 - p1PercentageOfTotal : 50;

  const mvpLeader = p1Mvp > p2Mvp ? player1.playerName : p2Mvp > p1Mvp ? player2.playerName : 'Empate';

  return (
    <div className="rounded-xl bg-[#11131a] border border-[#232736] p-3 sm:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232736]/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-100">
              Impacto Individual & Estatistica de MVP
            </h4>
            <p className="text-[10px] text-zinc-400">
              Contagem de condecoracoes de Melhor da Partida nas vitorias conjuntas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-700/50 text-amber-300">
            Lider: {mvpLeader}
          </span>
        </div>
      </div>

      {/* Main MVP Score Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Player 1 MVP Block */}
        <div
          className={`p-3.5 rounded-xl border relative overflow-hidden flex flex-col justify-between space-y-2 transition-all ${
            p1Mvp >= p2Mvp
              ? 'bg-sky-950/30 border-sky-600/50 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
              : 'bg-[#181a24] border-[#232736]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400">{player1.playerName}</span>
            {p1Mvp > p2Mvp && <Crown className="w-4 h-4 text-amber-400" />}
          </div>

          <div>
            <span className="text-3xl font-black text-white">{p1Mvp}</span>
            <span className="text-[11px] text-zinc-400 font-medium ml-1.5">MVPs</span>
          </div>

          <div className="space-y-1 border-t border-[#232736]/60 pt-2 text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span>Taxa nas Vitorias:</span>
              <span className="font-bold text-zinc-200">{p1MvpRateOnWins}%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Media p/ Jogo:</span>
              <span className="font-bold text-zinc-200">
                {(p1Mvp / (player1.session.totalMatches || 1)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Player 2 MVP Block */}
        <div
          className={`p-3.5 rounded-xl border relative overflow-hidden flex flex-col justify-between space-y-2 transition-all ${
            p2Mvp >= p1Mvp
              ? 'bg-orange-950/30 border-orange-600/50 shadow-[0_0_15px_rgba(251,146,60,0.08)]'
              : 'bg-[#181a24] border-[#232736]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400">{player2.playerName}</span>
            {p2Mvp > p1Mvp && <Crown className="w-4 h-4 text-amber-400" />}
          </div>

          <div>
            <span className="text-3xl font-black text-white">{p2Mvp}</span>
            <span className="text-[11px] text-zinc-400 font-medium ml-1.5">MVPs</span>
          </div>

          <div className="space-y-1 border-t border-[#232736]/60 pt-2 text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span>Taxa nas Vitorias:</span>
              <span className="font-bold text-zinc-200">{p2MvpRateOnWins}%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Media p/ Jogo:</span>
              <span className="font-bold text-zinc-200">
                {(p2Mvp / (player2.session.totalMatches || 1)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share / Proportion Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
          <span className="text-sky-400">{player1.playerName}: {p1PercentageOfTotal}%</span>
          <span className="text-zinc-500 uppercase text-[10px]">Divisao de MVPs na Dupla</span>
          <span className="text-orange-400">{player2.playerName}: {p2PercentageOfTotal}%</span>
        </div>

        <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
            style={{ width: `${p1PercentageOfTotal}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
            style={{ width: `${p2PercentageOfTotal}%` }}
          />
        </div>
      </div>
    </div>
  );
};
