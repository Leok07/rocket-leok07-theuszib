import React from 'react';
import { SharedMatchItem } from '@/types/dashboard';
import { Sparkles, Trophy, Target, Shield, Clock } from 'lucide-react';

interface MatchHighlightsProps {
  matches: SharedMatchItem[];
  player1Name: string;
  player2Name: string;
}

export const MatchHighlights: React.FC<MatchHighlightsProps> = ({
  matches,
  player1Name,
  player2Name,
}) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  // 1. Biggest Win (highest goal difference)
  const winningMatches = matches.filter((m) => m.result === 'win');
  let biggestWin: SharedMatchItem | null = null;
  let maxGoalDiff = -1;

  for (const m of winningMatches) {
    const diff = m.teamGoals - m.opponentGoals;
    if (diff > maxGoalDiff) {
      maxGoalDiff = diff;
      biggestWin = m;
    }
  }

  // 2. Highest score player 1
  let topP1Match: SharedMatchItem | null = null;
  let maxP1Score = -1;
  for (const m of matches) {
    if (m.p1Score > maxP1Score) {
      maxP1Score = m.p1Score;
      topP1Match = m;
    }
  }

  // 3. Highest score player 2
  let topP2Match: SharedMatchItem | null = null;
  let maxP2Score = -1;
  for (const m of matches) {
    if (m.p2Score > maxP2Score) {
      maxP2Score = m.p2Score;
      topP2Match = m;
    }
  }

  // 4. Most clutch win (Overtime win or tightest 1-goal win)
  const overtimeWins = winningMatches.filter((m) => m.isOvertime);
  const clutchMatch =
    overtimeWins.length > 0
      ? overtimeWins[0]
      : winningMatches.find((m) => m.teamGoals - m.opponentGoals === 1) || winningMatches[0];

  return (
    <div className="rounded-xl bg-[#11131a] border border-[#232736] p-3 sm:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#232736]/60 pb-2.5">
        <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-100">
            Destaques & Recordes da Sessao
          </h4>
          <p className="text-[10px] text-zinc-400">
            Principais feitos coletivos e individuais registrados nos replays
          </p>
        </div>
      </div>

      {/* Grid of Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {/* Card 1: Maior Goleada */}
        {biggestWin && (
          <div className="p-3 rounded-xl bg-[#181a24] border border-[#232736] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                Maior Goleada
              </span>
              <span className="text-[10px] text-zinc-500">{biggestWin.formattedDate}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-white">
                  {biggestWin.teamGoals} x {biggestWin.opponentGoals}
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  Saldo de +{biggestWin.teamGoals - biggestWin.opponentGoals} gols
                </span>
              </div>
              <span className="text-xs font-semibold text-zinc-400 truncate max-w-[110px]">
                {biggestWin.mapName}
              </span>
            </div>

            <div className="text-[10px] text-zinc-400 border-t border-[#232736]/60 pt-1.5 flex justify-between">
              <span>{player1Name}: {biggestWin.p1Goals}G / {biggestWin.p1Assists}A</span>
              <span>{player2Name}: {biggestWin.p2Goals}G / {biggestWin.p2Assists}A</span>
            </div>
          </div>
        )}

        {/* Card 2: Recorde Individual P1 */}
        {topP1Match && (
          <div className="p-3 rounded-xl bg-[#181a24] border border-[#232736] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                Pico de Pontuacao ({player1Name})
              </span>
              <span className="text-[10px] text-zinc-500">{topP1Match.formattedDate}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-sky-400">
                  {topP1Match.p1Score} pts
                </span>
                <span className="text-[11px] text-zinc-300 block">
                  {topP1Match.p1Goals} gols • {topP1Match.p1Saves} saves • {topP1Match.p1Assists} assists
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  topP1Match.result === 'win'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {topP1Match.result === 'win' ? 'Vitoria' : 'Derrota'}
              </span>
            </div>

            <div className="text-[10px] text-zinc-400 border-t border-[#232736]/60 pt-1.5 flex justify-between">
              <span>BPM: {topP1Match.p1Bpm}</span>
              <span className="truncate max-w-[120px]">{topP1Match.mapName}</span>
            </div>
          </div>
        )}

        {/* Card 3: Recorde Individual P2 */}
        {topP2Match && (
          <div className="p-3 rounded-xl bg-[#181a24] border border-[#232736] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-orange-400" />
                Pico de Pontuacao ({player2Name})
              </span>
              <span className="text-[10px] text-zinc-500">{topP2Match.formattedDate}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-orange-400">
                  {topP2Match.p2Score} pts
                </span>
                <span className="text-[11px] text-zinc-300 block">
                  {topP2Match.p2Goals} gols • {topP2Match.p2Saves} saves • {topP2Match.p2Assists} assists
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  topP2Match.result === 'win'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {topP2Match.result === 'win' ? 'Vitoria' : 'Derrota'}
              </span>
            </div>

            <div className="text-[10px] text-zinc-400 border-t border-[#232736]/60 pt-1.5 flex justify-between">
              <span>BPM: {topP2Match.p2Bpm}</span>
              <span className="truncate max-w-[120px]">{topP2Match.mapName}</span>
            </div>
          </div>
        )}

        {/* Card 4: Jogo Mais Clutch / Overtime */}
        {clutchMatch && (
          <div className="p-3 rounded-xl bg-[#181a24] border border-[#232736] flex flex-col justify-between space-y-2 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Vitoria Mais Acirrada (Clutch)
              </span>
              <span className="text-[10px] text-zinc-500">{clutchMatch.formattedDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-white">
                  {clutchMatch.teamGoals} x {clutchMatch.opponentGoals}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {clutchMatch.isOvertime ? 'Vitoria na Prorrogacao (Overtime)' : 'Vitoria por 1 gol de diferenca'}
                </span>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                {clutchMatch.mapName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
