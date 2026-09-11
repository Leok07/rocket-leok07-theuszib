'use client';

import React, { useState } from 'react';
import { SharedMatchItem } from '@/types/dashboard';
import { CareerComparisonData } from '@/types/career';
import {
  TrendingUp,
  Shield,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Target,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  OFFICIAL_2V2_RANK_THRESHOLDS,
  getRankDetailsFromMmr,
  getBallchasingTierLabel,
  MmrThreshold,
} from '@/lib/stats/rank-tiers';

interface RankEvolutionChartProps {
  careerData: CareerComparisonData | null;
  matches: SharedMatchItem[];
  player1Name?: string;
  player2Name?: string;
}

export function RankEvolutionChart({
  careerData,
  matches,
  player1Name = 'Leok07',
  player2Name = 'Theuszrib',
}: RankEvolutionChartProps) {
  const [activePlayer, setActivePlayer] = useState<'p1' | 'p2' | 'both'>('p1');

  // Real MMR extracted directly from RapidAPI live rank service
  const p1LiveMmr = careerData?.player1?.rank2v2?.mmr || 0;
  const p2LiveMmr = careerData?.player2?.rank2v2?.mmr || 0;

  const p1LiveRank = careerData?.player1?.rank2v2?.rank || 'Sem Rank';
  const p2LiveRank = careerData?.player2?.rank2v2?.rank || 'Sem Rank';

  const p1Division = careerData?.player1?.rank2v2?.division || 1;
  const p2Division = careerData?.player2?.rank2v2?.division || 1;

  // Real rank analytics using official Psyonix competitive brackets
  const p1Details = getRankDetailsFromMmr(p1LiveMmr);
  const p2Details = getRankDetailsFromMmr(p2LiveMmr);

  const selectedMmr = activePlayer === 'p2' ? p2LiveMmr : p1LiveMmr;
  const selectedRankName = activePlayer === 'p2' ? p2LiveRank : p1LiveRank;
  const selectedDivision = activePlayer === 'p2' ? p2Division : p1Division;
  const selectedDetails = activePlayer === 'p2' ? p2Details : p1Details;
  const selectedName = activePlayer === 'p2' ? player2Name : player1Name;

  // Duo MMR Synergy & Disparity (100% Real)
  const duoMmrGap = Math.abs(p1LiveMmr - p2LiveMmr);
  const duoAverageMmr = Math.round((p1LiveMmr + p2LiveMmr) / 2);
  const higherPlayerName = p1LiveMmr >= p2LiveMmr ? player1Name : player2Name;
  const higherPlayerColor = p1LiveMmr >= p2LiveMmr ? 'text-sky-400' : 'text-orange-400';

  // Chronological real match ranks (from oldest to newest)
  const chronoMatches = [...matches].reverse();

  // Build list of matches that have real rank data from Ballchasing
  const matchRanks = chronoMatches.map((m, idx) => {
    const isWin = m.result === 'win' || m.teamGoals > m.opponentGoals;
    const p1Meta = m.p1RankName ? { name: m.p1RankName, tier: m.p1RankTier, div: m.p1RankDivision } : null;
    const p2Meta = m.p2RankName ? { name: m.p2RankName, tier: m.p2RankTier, div: m.p2RankDivision } : null;

    return {
      index: idx + 1,
      matchId: m.id,
      date: m.formattedDate,
      mapName: m.mapName,
      isWin,
      scoreText: `${m.teamGoals} x ${m.opponentGoals}`,
      p1Rank: p1Meta,
      p2Rank: p2Meta,
    };
  });

  // Calculate transitions between matches for selected player
  const matchesWithTransitions = matchRanks.map((item, idx) => {
    const prevItem = idx > 0 ? matchRanks[idx - 1] : null;
    const currentMeta = activePlayer === 'p2' ? item.p2Rank : item.p1Rank;
    const prevMeta = prevItem ? (activePlayer === 'p2' ? prevItem.p2Rank : prevItem.p1Rank) : null;

    let transition: 'up' | 'down' | 'same' | 'none' = 'none';

    if (currentMeta && prevMeta) {
      const currentTier = currentMeta.tier ?? 0;
      const prevTier = prevMeta.tier ?? 0;
      const currentDiv = currentMeta.div ?? 0;
      const prevDiv = prevMeta.div ?? 0;

      if (currentTier > prevTier || (currentTier === prevTier && currentDiv > prevDiv)) {
        transition = 'up';
      } else if (currentTier < prevTier || (currentTier === prevTier && currentDiv < prevDiv)) {
        transition = 'down';
      } else {
        transition = 'same';
      }
    }

    return {
      ...item,
      currentRankMeta: currentMeta,
      transition,
    };
  });

  const matchesWithRealRankCount = matchRanks.filter(
    (m) => (activePlayer === 'p2' ? m.p2Rank !== null : m.p1Rank !== null)
  ).length;

  return (
    <div className="rounded-2xl bg-[#11131a] border border-[#232736] p-4 sm:p-6 space-y-6 shadow-xl">
      {/* Header Widescreen */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232736]/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-800/60 text-purple-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              Classificacao Competitiva & Elo Real (2v2)
            </h3>
            <p className="text-xs text-zinc-400">
              Metricas 100% reais de MMR ao vivo via RapidAPI e patentes oficiais registradas nos replays do Ballchasing
            </p>
          </div>
        </div>

        {/* Player Tabs */}
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
            Sinergia da Dupla
          </button>
        </div>
      </div>

      {/* Duo Synergy & Disparity Banner (Desktop Widescreen) */}
      <div className="p-4 rounded-xl bg-[#141722] border border-[#2c3245] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
              Sinergia Competitiva da Dupla (2v2)
            </span>
            <span className="text-xs text-zinc-400">
              Disparidade de MMR: <strong className="text-white font-mono">{duoMmrGap} pts</strong> • Lider de Lobby:{' '}
              <strong className={higherPlayerColor}>{higherPlayerName}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="px-3 py-2 rounded-lg bg-[#181a24] border border-sky-900/40 text-center">
            <span className="text-[10px] uppercase font-bold text-sky-400 block">{player1Name}</span>
            <span className="text-sm font-black text-white font-mono">{p1LiveMmr || '-'}</span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-[#181a24] border border-purple-900/40 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">Media Dupla</span>
            <span className="text-sm font-black text-white font-mono">{duoAverageMmr || '-'}</span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-[#181a24] border border-orange-900/40 text-center">
            <span className="text-[10px] uppercase font-bold text-orange-400 block">{player2Name}</span>
            <span className="text-sm font-black text-white font-mono">{p2LiveMmr || '-'}</span>
          </div>
        </div>
      </div>

      {/* 3 Real Milestone Cards (Desktop Grid 3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Live MMR Card */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-[#232736] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              MMR Real ao Vivo • RapidAPI
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              Dado Real
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {selectedMmr ? selectedMmr.toLocaleString('pt-BR') : 'Sem MMR'}
            </span>
            <span className="text-xs font-bold text-emerald-400">MMR 2v2</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#232736]/60">
            <span className="text-zinc-300 font-semibold">{selectedRankName}</span>
            <span className="text-zinc-400 font-mono">
              Folga contra queda: <strong className="text-emerald-400">+{selectedDetails.demotionBuffer} pts</strong>
            </span>
          </div>
        </div>

        {/* Distance to Next Division */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-[#232736] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Proxima Divisao Oficial
            </span>
            <span className="text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
              Brackets Oficiais
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-400 font-mono">
              +{selectedDetails.pointsToNextDiv}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">MMR restantes</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#232736]/60">
            <span className="text-zinc-300 font-semibold">Meta: {selectedDetails.nextRank.name}</span>
            <span className="text-zinc-400 font-mono">Minimo: {selectedDetails.nextRank.mmr} MMR</span>
          </div>
        </div>

        {/* Distance to Next Major Tier */}
        <div className="p-4 rounded-xl bg-[#181a24] border border-amber-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block">
              Proxima Patente (Tier)
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              Salto de Patente
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300 font-mono">
              +{selectedDetails.pointsToNextMajor}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">MMR restantes</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#232736]/60">
            <span className="text-zinc-200 font-semibold">Meta: {selectedDetails.nextMajorRank.tier}</span>
            <span className="text-zinc-400 font-mono">Minimo: {selectedDetails.nextMajorRank.mmr} MMR</span>
          </div>
        </div>
      </div>

      {/* Real Division Ruler / Progress Bar */}
      <div className="p-4 rounded-xl bg-[#181a24] border border-[#232736] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Posicionamento na Divisao Atual: <strong className="text-sky-400">{selectedDetails.currentRank.name}</strong>
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {selectedDetails.divProgress.toFixed(0)}% percorrido
          </span>
        </div>

        <div className="h-3 w-full bg-[#0d0e14] rounded-full overflow-hidden p-0.5 border border-[#2c3245]">
          <div
            className="bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${selectedDetails.divProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-0.5">
          <span>{selectedDetails.currentRank.mmr} MMR ({selectedDetails.currentRank.name})</span>
          <span className="text-zinc-200 font-bold">Voce: {selectedMmr} MMR</span>
          <span>{selectedDetails.nextRank.mmr} MMR ({selectedDetails.nextRank.name})</span>
        </div>
      </div>

      {/* Real Match Rank Progression Timeline (Ballchasing Replay Metadata) */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#181a24] border border-[#232736] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232736]/60 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Patente Real Registrada nos Replays (Ballchasing)
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {matchesWithRealRankCount > 0
              ? `${matchesWithRealRankCount} de ${matches.length} partidas com patente no replay`
              : 'Aguardando replays competitivos com registro de patente'}
          </span>
        </div>

        {matchesWithTransitions.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-[#232736] rounded-xl">
            Nenhuma partida compartilhada carregada para exibir a timeline de patentes.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {matchesWithTransitions.map((m) => {
              const currentRank = m.currentRankMeta;
              const hasRank = currentRank !== null && currentRank.name;

              return (
                <div
                  key={m.matchId}
                  className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                    m.isWin
                      ? 'bg-[#141d24]/70 border-emerald-900/40'
                      : 'bg-[#1d161a]/70 border-rose-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-300">
                      J{m.index} • {m.mapName}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        m.isWin
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {m.isWin ? 'Vitoria' : 'Derrota'} ({m.scoreText})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">
                        Patente no Replay
                      </span>
                      <span className="font-bold text-zinc-200">
                        {hasRank ? currentRank.name : 'Casual / Sem Registro'}
                      </span>
                    </div>

                    {m.transition === 'up' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/50">
                        <ArrowUpRight className="w-3 h-3" /> Promocao
                      </span>
                    )}
                    {m.transition === 'down' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/70 px-2 py-0.5 rounded border border-rose-800/50">
                        <ArrowDownRight className="w-3 h-3" /> Descenso
                      </span>
                    )}
                    {m.transition === 'same' && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded">
                        <Minus className="w-3 h-3" /> Mantida
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official 2v2 Competitive Brackets Grid */}
      <div className="border-t border-[#232736]/60 pt-4 space-y-2">
        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
          Tabela Oficial de Brackets 2v2 (Rocket League • Competitivo)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-[10px] font-mono">
          <div
            className={`p-2.5 rounded-lg border transition-all ${
              selectedMmr >= 835 && selectedMmr < 995
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-[#181a24] border-[#232736] text-zinc-400'
            }`}
          >
            <strong className="text-cyan-400 block font-bold">Diamante I/II:</strong>
            <span>835 a 994 MMR</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border transition-all ${
              selectedMmr >= 995 && selectedMmr < 1075
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-[#181a24] border-[#232736] text-zinc-400'
            }`}
          >
            <strong className="text-cyan-400 block font-bold">Diamante III:</strong>
            <span>995 a 1074 MMR</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border transition-all ${
              selectedMmr >= 1075 && selectedMmr < 1216
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-[#181a24] border-[#232736] text-zinc-400'
            }`}
          >
            <strong className="text-purple-400 block font-bold">Campeao I:</strong>
            <span>1075 a 1215 MMR</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border transition-all ${
              selectedMmr >= 1216 && selectedMmr < 1376
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-[#181a24] border-[#232736] text-zinc-400'
            }`}
          >
            <strong className="text-purple-400 block font-bold">Campeao II:</strong>
            <span>1216 a 1375 MMR</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border transition-all ${
              selectedMmr >= 1376 && selectedMmr < 1536
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-[#181a24] border-[#232736] text-zinc-400'
            }`}
          >
            <strong className="text-purple-400 block font-bold">Campeao III:</strong>
            <span>1376 a 1535 MMR</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border transition-all ${
              selectedMmr >= 1536
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-[#181a24] border-[#232736] text-zinc-400'
            }`}
          >
            <strong className="text-rose-400 block font-bold">Grand Champion:</strong>
            <span>1536+ MMR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
