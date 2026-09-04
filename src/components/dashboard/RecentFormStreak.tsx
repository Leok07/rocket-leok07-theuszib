import React from 'react';
import { SharedMatchItem } from '@/types/dashboard';
import { Flame, TrendingUp, ShieldAlert } from 'lucide-react';

interface RecentFormStreakProps {
  matches: SharedMatchItem[];
}

export const RecentFormStreak: React.FC<RecentFormStreakProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  // Matches are sorted newest first
  const recentMatches = matches.slice(0, 8);
  const totalRecent = recentMatches.length;
  const recentWins = recentMatches.filter((m) => m.result === 'win').length;
  const recentLosses = totalRecent - recentWins;
  const recentWinRate = Math.round((recentWins / totalRecent) * 100);

  // Calculate current active streak
  let currentStreakCount = 0;
  const streakType: 'win' | 'loss' | 'none' = matches[0]?.result || 'none';

  for (const m of matches) {
    if (m.result === streakType) {
      currentStreakCount++;
    } else {
      break;
    }
  }

  return (
    <div className="rounded-xl bg-[#11131a] border border-[#232736] p-3 sm:p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232736]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-800/50 text-sky-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-100">
              Forma Recente & Sequencia da Dupla
            </h4>
            <p className="text-[10px] text-zinc-400">
              Desempenho nas ultimas {totalRecent} partidas jogadas juntos
            </p>
          </div>
        </div>

        {/* Current streak badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {streakType === 'win' ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Sequencia: {currentStreakCount} {currentStreakCount === 1 ? 'Vitoria' : 'Vitorias'}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-700/60 text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Sequencia: {currentStreakCount} {currentStreakCount === 1 ? 'Derrota' : 'Derrotas'}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Pills sequence VVVDV */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Ultimos Jogos (Mais recente a esquerda)
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {recentMatches.map((m, idx) => {
              const isWin = m.result === 'win';
              return (
                <div
                  key={m.id || idx}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border transition-transform hover:scale-105 ${
                    isWin
                      ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                      : 'bg-rose-950/70 border-rose-500/60 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.15)]'
                  }`}
                  title={`${isWin ? 'Vitoria' : 'Derrota'}: ${m.teamGoals} x ${m.opponentGoals} (${m.formattedDate})`}
                >
                  {isWin ? 'V' : 'D'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Winrate box */}
        <div className="flex items-center gap-3 bg-[#181a24] border border-[#232736] px-3 py-2 rounded-lg justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
              Aproveitamento Recente
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              {recentWins}V - {recentLosses}D ({totalRecent} jogos)
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-base font-black ${
                recentWinRate >= 60
                  ? 'text-emerald-400'
                  : recentWinRate >= 45
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {recentWinRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
