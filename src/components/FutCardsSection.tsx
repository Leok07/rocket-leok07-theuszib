'use client';

import React from 'react';
import { AggregatedPlayerDashboard, SharedMatchItem } from '@/types/dashboard';
import { PlayerCardFUT } from '@/components/PlayerCardFUT';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { Trophy, HelpCircle, Target, Shield, Flame, Zap, Award, Crown, Sparkles, Link2 } from 'lucide-react';

interface FutCardsSectionProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
  sharedMatches?: SharedMatchItem[];
}

export function FutCardsSection({ player1, player2, sharedMatches }: FutCardsSectionProps) {
  const p1Fut = player1.futStats;
  const p2Fut = player2.futStats;

  if (!p1Fut || !p2Fut) {
    return null;
  }

  const p1MatchesCount = p1Fut.recentMatchesCount || 10;
  const p2MatchesCount = p2Fut.recentMatchesCount || 10;

  // Duo shared metrics
  const duoMatchesCount = sharedMatches?.length || Math.max(p1MatchesCount, p2MatchesCount);
  const duoWins = sharedMatches ? sharedMatches.filter((m) => m.result === 'win').length : 0;
  const duoWinRate = sharedMatches && duoMatchesCount > 0
    ? Math.round((duoWins / duoMatchesCount) * 100)
    : Math.round(((p1Fut.recentWinRate || 0) + (p2Fut.recentWinRate || 0)) / 2);
  const duoGoals = (p1Fut.recentGoals || 0) + (p2Fut.recentGoals || 0);

  const p1Leader = {
    pac: p1Fut.pac > p2Fut.pac,
    sho: p1Fut.sho > p2Fut.sho,
    pas: p1Fut.pas > p2Fut.pas,
    dri: p1Fut.dri > p2Fut.dri,
    def: p1Fut.def > p2Fut.def,
    phy: p1Fut.phy > p2Fut.phy,
    ovr: p1Fut.ovr > p2Fut.ovr,
  };

  const p2Leader = {
    pac: p2Fut.pac > p1Fut.pac,
    sho: p2Fut.sho > p1Fut.sho,
    pas: p2Fut.pas > p1Fut.pas,
    dri: p2Fut.dri > p1Fut.dri,
    def: p2Fut.def > p1Fut.def,
    phy: p2Fut.phy > p1Fut.phy,
    ovr: p2Fut.ovr > p1Fut.ovr,
  };

  return (
    <Card className="p-4 sm:p-5 border-[#1e1e24] bg-[#09090b] shadow-2xl">
      {/* Section Header */}
      <CardHeader className="pb-3 mb-4 border-b border-[#1e1e24]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <CardTitle className="text-xs sm:text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Cartas Competitivas Rocket League • Deck Oficial da Dupla</span>
          </CardTitle>

          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-950/40 text-amber-400 border border-amber-800/60 px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-auto">
            FORMA {duoMatchesCount} JOGOS
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          Cartas calibradas baseadas na patente competitiva real (Diamante para cima), com brasões oficiais da Psyonix e telemetria dos 6 pilares de gameplay.
        </p>
      </CardHeader>

      <CardContent>
        {/* Two Cards Side-by-Side (Desktop 2-Column / Mobile Stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto my-4 justify-items-center">
          {/* Player 1 Card (Leok07) */}
          <div className="w-full flex justify-center">
            <PlayerCardFUT
              playerName={player1.playerName}
              platformLabel={PLAYER_1.platformLabel}
              stats={p1Fut}
              teamTheme="blue"
              leaderStats={p1Leader}
              dashboard={player1}
            />
          </div>

          {/* Player 2 Card (Theuszrib) */}
          <div className="w-full flex justify-center">
            <PlayerCardFUT
              playerName={player2.playerName}
              platformLabel={PLAYER_2.platformLabel}
              stats={p2Fut}
              teamTheme="orange"
              leaderStats={p2Leader}
              dashboard={player2}
            />
          </div>
        </div>

        {/* SEÇÃO SEPARADA: Box de Estatísticas (Gols, Assists, Defesas & MVPs) */}
        <div className="mt-6 pt-4 border-t border-[#1e1e24]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-200">
                Estatísticas da Fase Recente (Últimos Jogos)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-[#0c0c10] px-2 py-0.5 rounded border border-[#1e1e24]">
              Base: {Math.max(p1MatchesCount, p2MatchesCount)} partidas
            </span>
          </div>

          {/* Stat Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-white">
            {/* 1. Gols Box */}
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[11px] font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> GOLS MARCADOS
                </span>
                <span className="text-[10px] text-zinc-400">Total (Média)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <div className="bg-sky-950/30 border border-sky-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-sky-400 block truncate">{player1.playerName}</span>
                  <span className="text-xl font-black text-sky-200 font-mono">{p1Fut.recentGoals}</span>
                  <span className="text-[9px] text-zinc-400 block">
                    ({(p1Fut.recentGoals / Math.max(p1MatchesCount, 1)).toFixed(1)}/j)
                  </span>
                </div>
                <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-orange-400 block truncate">{player2.playerName}</span>
                  <span className="text-xl font-black text-orange-200 font-mono">{p2Fut.recentGoals}</span>
                  <span className="text-[9px] text-zinc-400 block">
                    ({(p2Fut.recentGoals / Math.max(p2MatchesCount, 1)).toFixed(1)}/j)
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Assistências Box */}
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[11px] font-extrabold text-sky-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> ASSISTÊNCIAS
                </span>
                <span className="text-[10px] text-zinc-400">Total (Média)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <div className="bg-sky-950/30 border border-sky-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-sky-400 block truncate">{player1.playerName}</span>
                  <span className="text-xl font-black text-sky-200 font-mono">{p1Fut.recentAssists}</span>
                  <span className="text-[9px] text-zinc-400 block">
                    ({(p1Fut.recentAssists / Math.max(p1MatchesCount, 1)).toFixed(1)}/j)
                  </span>
                </div>
                <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-orange-400 block truncate">{player2.playerName}</span>
                  <span className="text-xl font-black text-orange-200 font-mono">{p2Fut.recentAssists}</span>
                  <span className="text-[9px] text-zinc-400 block">
                    ({(p2Fut.recentAssists / Math.max(p2MatchesCount, 1)).toFixed(1)}/j)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Defesas / Saves Box */}
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[11px] font-extrabold text-sky-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> DEFESAS REALIZADAS
                </span>
                <span className="text-[10px] text-zinc-400">Total (Média)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <div className="bg-sky-950/30 border border-sky-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-sky-400 block truncate">{player1.playerName}</span>
                  <span className="text-xl font-black text-sky-200 font-mono">{p1Fut.recentSaves}</span>
                  <span className="text-[9px] text-zinc-400 block">
                    ({(p1Fut.recentSaves / Math.max(p1MatchesCount, 1)).toFixed(1)}/j)
                  </span>
                </div>
                <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-orange-400 block truncate">{player2.playerName}</span>
                  <span className="text-xl font-black text-orange-200 font-mono">{p2Fut.recentSaves}</span>
                  <span className="text-[9px] text-zinc-400 block">
                    ({(p2Fut.recentSaves / Math.max(p2MatchesCount, 1)).toFixed(1)}/j)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary stats row: MVPs & Score */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[11px]">
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> MVPs Recentes
              </span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentMvps}</span> / <span className="text-orange-400">{p2Fut.recentMvps}</span>
              </span>
            </div>
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-400" /> Pontuação Média
              </span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentAvgScore}</span> / <span className="text-orange-400">{p2Fut.recentAvgScore}</span>
              </span>
            </div>
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" /> Chutes Totais
              </span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentShots}</span> / <span className="text-orange-400">{p2Fut.recentShots}</span>
              </span>
            </div>
            <div className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400">Streak de MVP</span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentMvpStreak || 0}x</span> / <span className="text-orange-400">{p2Fut.recentMvpStreak || 0}x</span>
              </span>
            </div>
          </div>
        </div>

        {/* Rarities & Attribute Reference Guide */}
        <div className="mt-6 pt-4 border-t border-[#1e1e24]">
          <div className="flex items-center gap-1.5 mb-2.5 text-zinc-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Guia de Raridades e Atributos FUT Rocket League:</span>
          </div>

          {/* Rarity Tags Grid: Harmonious Hybrid Blends, Modifiers, and Base Tiers */}
          <div className="space-y-2 mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Edições Míticas & Mesclas Visuais Híbridas:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="p-2 rounded bg-gradient-to-r from-amber-950/60 to-stone-950/80 border border-amber-500/50 text-amber-300 font-bold text-center">
                G.O.A.T. SUPREMO (OVR 94+ & 3x MVP)
              </div>
              <div className="p-2 rounded bg-gradient-to-r from-slate-900/70 via-indigo-950/80 to-amber-950/60 border border-yellow-400/50 text-yellow-200 font-bold text-center">
                ICON ÉLITE (Icon 91+ & Modifier Ativo)
              </div>
              <div className="p-2 rounded bg-gradient-to-r from-rose-950/60 via-stone-950/80 to-blue-950/60 border border-sky-400/50 text-sky-200 font-bold text-center">
                TWO-WAY TITAN (Striker + Guardian)
              </div>
              <div className="p-2 rounded bg-gradient-to-r from-purple-950/60 via-stone-950/80 to-orange-950/60 border border-orange-400/50 text-orange-300 font-bold text-center">
                APEX PREDATOR (Speedster + Enforcer)
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-1">
              Edições TOTW Híbridas & Especialistas:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[10px]">
              <div className="p-1.5 rounded bg-gradient-to-r from-yellow-950/50 to-rose-950/50 border border-rose-400/50 text-rose-300 font-bold text-center">
                TOTW STRIKER
              </div>
              <div className="p-1.5 rounded bg-gradient-to-r from-yellow-950/50 to-blue-950/50 border border-sky-400/50 text-sky-200 font-bold text-center">
                TOTW GUARDIAN
              </div>
              <div className="p-1.5 rounded bg-gradient-to-r from-yellow-950/50 to-cyan-950/50 border border-cyan-400/50 text-cyan-300 font-bold text-center">
                TOTW PLAYMAKER
              </div>
              <div className="p-1.5 rounded bg-[#101033] border border-indigo-400/50 text-indigo-300 font-bold text-center">
                VELOZ SUPERSÔNICO
              </div>
              <div className="p-1.5 rounded bg-[#291307] border border-orange-500/50 text-orange-300 font-bold text-center">
                DEMOLIDOR TÁTICO
              </div>
              <div className="p-1.5 rounded bg-yellow-950/50 border border-yellow-500/50 text-yellow-300 font-bold text-center">
                TOTW IN-FORM
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-1">
              Patentes Base Oficiais:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
              <div className="p-1.5 rounded bg-slate-800/60 border border-white/50 text-white font-bold text-center">
                RLCS ICON (91+)
              </div>
              <div className="p-1.5 rounded bg-[#0b1c2e] border border-cyan-400/50 text-cyan-200 font-bold text-center">
                DIAMANTE RARO (86-90)
              </div>
              <div className="p-1.5 rounded bg-[#2e1d05] border border-amber-500/40 text-amber-300 font-bold text-center">
                OURO RARO (76-85)
              </div>
              <div className="p-1.5 rounded bg-[#1a2130] border border-slate-400/40 text-slate-300 font-bold text-center">
                PRATA RARA (65-75)
              </div>
              <div className="p-1.5 rounded bg-[#221209] border border-amber-700/40 text-amber-400 font-bold text-center">
                BRONZE (&lt;65)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#0c0c10] border border-[#1e1e24]">
              <span className="font-extrabold text-amber-400 block">SHO (Finalização)</span>
              <span className="text-zinc-400 text-[10px]">
                Gols por partida e precisão no arremate. Representa 33% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0c0c10] border border-[#1e1e24]">
              <span className="font-extrabold text-amber-400 block">DEF (Defesa)</span>
              <span className="text-zinc-400 text-[10px]">
                Saves realizados e contenção no terço defensivo. Representa 33% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0c0c10] border border-[#1e1e24]">
              <span className="font-extrabold text-amber-400 block">PAS (Passe)</span>
              <span className="text-zinc-400 text-[10px]">
                Assistências por jogo e visão de jogo. Representa 17% do OVR base (+ bônus direto).
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0c0c10] border border-[#1e1e24]">
              <span className="font-extrabold text-amber-400 block">PAC (Ritmo)</span>
              <span className="text-zinc-400 text-[10px]">
                Velocidade média e % supersônico. Representa 7% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0c0c10] border border-[#1e1e24]">
              <span className="font-extrabold text-amber-400 block">DRI (Mecânica)</span>
              <span className="text-zinc-400 text-[10px]">
                Controle aéreo, powerslides e recuperação. Representa 5% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0c0c10] border border-[#1e1e24]">
              <span className="font-extrabold text-amber-400 block">PHY (Físico)</span>
              <span className="text-zinc-400 text-[10px]">
                Roubo de boost adversário, BPM e demolições. Representa 5% do OVR base.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
