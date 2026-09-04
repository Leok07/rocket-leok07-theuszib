'use client';

import React from 'react';
import { AggregatedPlayerDashboard } from '@/types/dashboard';
import { PlayerCardFUT } from '@/components/PlayerCardFUT';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { Trophy, HelpCircle, Target, Shield, Flame, Zap, Award, Crown, Sparkles } from 'lucide-react';

interface FutCardsSectionProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
}

export function FutCardsSection({ player1, player2 }: FutCardsSectionProps) {
  const p1Fut = player1.futStats;
  const p2Fut = player2.futStats;

  if (!p1Fut || !p2Fut) {
    return null;
  }

  const p1MatchesCount = p1Fut.recentMatchesCount || 10;
  const p2MatchesCount = p2Fut.recentMatchesCount || 10;

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
    <Card className="p-4 sm:p-5 border-[#2c3245] bg-[#0c0e14]">
      {/* Section Header */}
      <CardHeader className="pb-3 mb-4 border-b border-[#232736]/80">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xs sm:text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Cards EA FC Ultimate • TOTW & Forma Recente</span>
          </CardTitle>

          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-950/40 text-amber-400 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
            ÚLTIMOS 20 JOGOS
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          Cartas dinâmicas estilo FUT com OVR focado em finalização e defesa, bônus direto de passe/playmaking, bônus de MVP e títulos de honra.
        </p>
      </CardHeader>

      <CardContent>
        {/* Two Cards Side-by-Side (Desktop) / Stacked (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center my-2">
          {/* Player 1 Card (Leok07) */}
          <div>
            <PlayerCardFUT
              playerName={player1.playerName}
              platformLabel={PLAYER_1.platformLabel}
              stats={p1Fut}
              teamTheme="blue"
              leaderStats={p1Leader}
            />
          </div>

          {/* Player 2 Card (Theuszrib) */}
          <div>
            <PlayerCardFUT
              playerName={player2.playerName}
              platformLabel={PLAYER_2.platformLabel}
              stats={p2Fut}
              teamTheme="orange"
              leaderStats={p2Leader}
            />
          </div>
        </div>

        {/* SEÇÃO SEPARADA: Box de Estatísticas (Gols, Assists, Defesas & MVPs) */}
        <div className="mt-6 pt-4 border-t border-[#232736]/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-200">
                Estatísticas da Fase Recente (Últimos Jogos)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-[#161a26] px-2 py-0.5 rounded border border-[#2c3245]">
              Base: {Math.max(p1MatchesCount, p2MatchesCount)} partidas
            </span>
          </div>

          {/* Stat Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-white">
            {/* 1. Gols Box */}
            <div className="bg-[#121520] border border-[#252b3d] rounded-xl p-3 flex flex-col justify-between">
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
            <div className="bg-[#121520] border border-[#252b3d] rounded-xl p-3 flex flex-col justify-between">
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
            <div className="bg-[#121520] border border-[#252b3d] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5">
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
            <div className="bg-[#141722] border border-[#232736]/60 rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> MVPs Recentes
              </span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentMvps}</span> / <span className="text-orange-400">{p2Fut.recentMvps}</span>
              </span>
            </div>
            <div className="bg-[#141722] border border-[#232736]/60 rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-400" /> Pontuação Média
              </span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentAvgScore}</span> / <span className="text-orange-400">{p2Fut.recentAvgScore}</span>
              </span>
            </div>
            <div className="bg-[#141722] border border-[#232736]/60 rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Chutes Totais
              </span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentShots}</span> / <span className="text-orange-400">{p2Fut.recentShots}</span>
              </span>
            </div>
            <div className="bg-[#141722] border border-[#232736]/60 rounded-lg p-2 flex items-center justify-between">
              <span className="text-zinc-400">Streak de MVP</span>
              <span className="font-mono font-bold">
                <span className="text-sky-400">{p1Fut.recentMvpStreak || 0}x</span> / <span className="text-orange-400">{p2Fut.recentMvpStreak || 0}x</span>
              </span>
            </div>
          </div>
        </div>

        {/* Rarities & Attribute Reference Guide */}
        <div className="mt-6 pt-4 border-t border-[#232736]/70">
          <div className="flex items-center gap-1.5 mb-2.5 text-zinc-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Guia de Raridades e Atributos FUT Rocket League:</span>
          </div>

          {/* Rarity Tags Grid (10 Tiers & Hybrid Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3 text-[10px]">
            <div className="p-1.5 rounded bg-gradient-to-r from-amber-950/40 to-yellow-950/20 border border-amber-500/40 text-amber-300 font-bold text-center">
              G.O.A.T. (OVR 94+ & 3+ MVPs)
            </div>
            <div className="p-1.5 rounded bg-gradient-to-r from-yellow-950/50 via-slate-900/60 to-yellow-950/50 border border-yellow-400/50 text-yellow-200 font-bold text-center">
              ICON TOTW (Lenda + 3x MVP)
            </div>
            <div className="p-1.5 rounded bg-gradient-to-r from-fuchsia-950/50 via-amber-950/40 to-fuchsia-950/50 border border-fuchsia-400/50 text-fuchsia-200 font-bold text-center">
              ICON HERO (Lenda + Heroi)
            </div>
            <div className="p-1.5 rounded bg-gradient-to-r from-zinc-800/60 to-zinc-900/40 border border-zinc-400/40 text-zinc-200 font-bold text-center">
              RLCS ICON (OVR 90+)
            </div>
            <div className="p-1.5 rounded bg-gradient-to-r from-purple-950/50 via-amber-950/30 to-purple-950/50 border border-purple-400/50 text-purple-200 font-bold text-center">
              HERO TOTW (Heroi + 3x MVP)
            </div>
            <div className="p-1.5 rounded bg-gradient-to-r from-purple-950/50 to-purple-900/20 border border-purple-500/40 text-purple-300 font-bold text-center">
              HEROI (OVR 85+ & 3+ MVPs)
            </div>
            <div className="p-1.5 rounded bg-gradient-to-r from-yellow-950/50 to-amber-900/20 border border-yellow-500/40 text-yellow-300 font-bold text-center">
              TOTW (3 MVPs Seguidos)
            </div>
            <div className="p-1.5 rounded bg-[#2a1c05] border border-amber-500/40 text-amber-300 font-bold text-center">
              OURO RARO (OVR 76+)
            </div>
            <div className="p-1.5 rounded bg-[#181f2c] border border-slate-400/40 text-slate-300 font-bold text-center">
              PRATA RARA (OVR 65+)
            </div>
            <div className="p-1.5 rounded bg-[#201108] border border-amber-700/40 text-amber-400 font-bold text-center">
              BRONZE (OVR &lt; 65)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#141722] border border-[#232736]/60">
              <span className="font-extrabold text-amber-400 block">SHO (Finalizacao)</span>
              <span className="text-zinc-400 text-[10px]">
                Gols por partida e precisao no arremate. Representa 33% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#141722] border border-[#232736]/60">
              <span className="font-extrabold text-amber-400 block">DEF (Defesa)</span>
              <span className="text-zinc-400 text-[10px]">
                Saves realizados e contencao no terco defensivo. Representa 33% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#141722] border border-[#232736]/60">
              <span className="font-extrabold text-amber-400 block">PAS (Passe)</span>
              <span className="text-zinc-400 text-[10px]">
                Assistencias por jogo e visao de jogo. Representa 17% do OVR base (+ bonus direto).
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#141722] border border-[#232736]/60">
              <span className="font-extrabold text-amber-400 block">PAC (Ritmo)</span>
              <span className="text-zinc-400 text-[10px]">
                Velocidade media e % supersonico. Representa 7% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#141722] border border-[#232736]/60">
              <span className="font-extrabold text-amber-400 block">DRI (Mecanica)</span>
              <span className="text-zinc-400 text-[10px]">
                Controle aereo, powerslides e recuperacao. Representa 5% do OVR base.
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#141722] border border-[#232736]/60">
              <span className="font-extrabold text-amber-400 block">PHY (Fisico)</span>
              <span className="text-zinc-400 text-[10px]">
                Roubo de boost adversario, BPM e demolicoes. Representa 5% do OVR base.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
