'use client';

import React from 'react';
import { FutCardStats } from '@/types/dashboard';
import { TIER_STYLES } from '@/lib/fut-tiers';
import { Award, TrendingUp, TrendingDown, Sparkles, ShieldAlert, Crown, Shield, Zap } from 'lucide-react';

export interface StatLeaderFlags {
  pac?: boolean;
  sho?: boolean;
  pas?: boolean;
  dri?: boolean;
  def?: boolean;
  phy?: boolean;
  ovr?: boolean;
}

interface PlayerCardFUTProps {
  playerName: string;
  platformLabel: string;
  stats: FutCardStats;
  teamTheme: 'blue' | 'orange';
  leaderStats?: StatLeaderFlags;
}

export const PlayerCardFUT = React.memo(function PlayerCardFUT({
  playerName,
  platformLabel,
  stats,
  teamTheme,
  leaderStats,
}: PlayerCardFUTProps) {
  const {
    ovr,
    tier = 'gold',
    position,
    pac,
    sho,
    pas,
    dri,
    def,
    phy,
    streakCount,
    streakType,
    recentWinRate,
    recentMatchesCount,
    nickname,
    isNegativeNickname,
    recentMvpStreak,
  } = stats;

  const currentTierStyles = TIER_STYLES[tier] || TIER_STYLES.gold;
  const matchCountDisplay = recentMatchesCount || 10;
  const safeInitials = (playerName || 'RL').slice(0, 2).toUpperCase();

  return (
    <div className="relative w-full max-w-[285px] sm:max-w-[315px] mx-auto select-none group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
      {/* Leadership Aura Glow if player is OVR Leader */}
      {leaderStats?.ovr && (
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-b from-amber-400/30 via-transparent to-amber-500/20 blur-md pointer-events-none" />
      )}
      {/* Outer EA FC Card Shell */}
      <div
        className={`relative overflow-hidden rounded-[24px] border-[2px] ${currentTierStyles.outerBorder} ${currentTierStyles.borderGlow} bg-gradient-to-b ${currentTierStyles.cardBg} p-3.5 sm:p-4 text-white shadow-2xl backdrop-blur-xl`}
      >
        {/* Subtle Inner Bevel Inset Ring */}
        <div
          className={`absolute inset-1.5 rounded-[18px] border ${currentTierStyles.innerBorder} pointer-events-none`}
        />

        {/* Ambient Top Glow */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"
        />

        {/* Top Metallic Header Ribbon */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
            <Award className={`w-3.5 h-3.5 ${currentTierStyles.headerIconColor}`} />
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-100">
              {currentTierStyles.tierLabel}
            </span>
          </div>

          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
            {platformLabel}
          </span>
        </div>

        {/* Dynamic Form / Streak Banner */}
        <div className="relative z-10 mb-2.5 flex items-center justify-between text-[10px] bg-black/50 px-2.5 py-1 rounded-md border border-white/10">
          <span className="text-zinc-400 font-medium">Forma Recente:</span>
          {recentMvpStreak && recentMvpStreak >= 3 ? (
            <span className="text-amber-300 flex items-center gap-1 font-black">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              {recentMvpStreak}x MVP Seguidos
            </span>
          ) : streakType === 'win' && streakCount >= 1 ? (
            <span className="text-emerald-400 flex items-center gap-1 font-black">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              +{streakCount} Vitorias Seguidas
            </span>
          ) : streakType === 'loss' && streakCount >= 1 ? (
            <span className="text-rose-400 flex items-center gap-1 font-black">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              -{streakCount} Derrotas Seguidas
            </span>
          ) : (
            <span className="text-zinc-300 font-semibold">{recentWinRate}% WR ({matchCountDisplay}j)</span>
          )}
        </div>

        {/* Upper Deck: Left OVR & Position Stack + Right Club Shield Crest */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-1 py-1">
          {/* Left OVR & Position Info Block */}
          <div className="flex flex-col items-center shrink-0 w-16 text-center">
            <span
              className={`text-5xl sm:text-6xl font-black font-mono leading-none tracking-tight ${currentTierStyles.ovrText}`}
            >
              {ovr}
            </span>
            <span className={`text-sm sm:text-base font-black tracking-widest uppercase mt-1 ${currentTierStyles.posText}`}>
              {position}
            </span>
            <div className={`w-8 h-[2px] my-1 rounded-full bg-gradient-to-r ${currentTierStyles.accentGradient} opacity-70`} />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
              {position === 'ATA' ? 'ATAQUE' : 'DEFESA'}
            </span>
          </div>

          {/* Right Player Shield Crest (Volumetric 3D Badge) */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center border-2 bg-gradient-to-b ${currentTierStyles.crestBg} ${currentTierStyles.crestBorder}`}
            >
              <div className="text-center">
                <span
                  className={`text-3xl sm:text-4xl font-black tracking-tighter ${
                    teamTheme === 'blue' ? 'text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]' : 'text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]'
                  }`}
                >
                  {safeInitials}
                </span>
                <span className="block text-[9px] font-mono font-black tracking-widest text-zinc-400 mt-0.5 uppercase">
                  DUO RL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nameplate: Authentic EA FC Metallic Banner */}
        <div className={`relative z-10 mt-2 text-center py-1.5 px-2 rounded-lg border ${currentTierStyles.nameplateBorder}`}>
          <h2
            className={`text-sm sm:text-base font-black tracking-[0.18em] uppercase ${
              teamTheme === 'blue' ? 'text-sky-100' : 'text-orange-100'
            }`}
          >
            {playerName}
          </h2>
          {nickname && (
            <div className="mt-1 flex items-center justify-center">
              {isNegativeNickname ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded bg-rose-950/90 border border-rose-600/60 text-rose-300 uppercase tracking-wide">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  {nickname}
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${currentTierStyles.nicknameBadge}`}>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  &quot;{nickname}&quot;
                </span>
              )}
            </div>
          )}
        </div>

        {/* Official 2x3 EA FC Attributes Grid with Metallic Hairline Divider */}
        <div className="relative z-10 mt-2.5 grid grid-cols-2 gap-x-5 text-xs sm:text-sm py-1">
          {/* Center Vertical Divider */}
          <div className="absolute top-0.5 bottom-0.5 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Left Column: PAC, SHO, PAS */}
          <div className="space-y-1 pr-1">
            <div
              className={`flex items-center justify-between border-b border-white/5 pb-0.5 px-1 rounded transition-colors ${
                leaderStats?.pac ? 'bg-amber-400/10 border-amber-400/30' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] sm:text-[12px] tracking-wider ${
                    leaderStats?.pac ? 'text-amber-300 font-bold' : currentTierStyles.statLabel
                  }`}
                >
                  PAC
                </span>
                {leaderStats?.pac && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                )}
              </div>
              <span
                className={`font-mono text-sm sm:text-base ${
                  leaderStats?.pac
                    ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : currentTierStyles.statValue
                }`}
              >
                {pac}
              </span>
            </div>

            <div
              className={`flex items-center justify-between border-b border-white/5 pb-0.5 px-1 rounded transition-colors ${
                leaderStats?.sho ? 'bg-amber-400/10 border-amber-400/30' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] sm:text-[12px] tracking-wider ${
                    leaderStats?.sho ? 'text-amber-300 font-bold' : currentTierStyles.statLabel
                  }`}
                >
                  SHO
                </span>
                {leaderStats?.sho && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                )}
              </div>
              <span
                className={`font-mono text-sm sm:text-base ${
                  leaderStats?.sho
                    ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : currentTierStyles.statValue
                }`}
              >
                {sho}
              </span>
            </div>

            <div
              className={`flex items-center justify-between px-1 rounded transition-colors ${
                leaderStats?.pas ? 'bg-amber-400/10 border-amber-400/30' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] sm:text-[12px] tracking-wider ${
                    leaderStats?.pas ? 'text-amber-300 font-bold' : currentTierStyles.statLabel
                  }`}
                >
                  PAS
                </span>
                {leaderStats?.pas && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                )}
              </div>
              <span
                className={`font-mono text-sm sm:text-base ${
                  leaderStats?.pas
                    ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : currentTierStyles.statValue
                }`}
              >
                {pas}
              </span>
            </div>
          </div>

          {/* Right Column: DRI, DEF, PHY */}
          <div className="space-y-1 pl-1">
            <div
              className={`flex items-center justify-between border-b border-white/5 pb-0.5 px-1 rounded transition-colors ${
                leaderStats?.dri ? 'bg-amber-400/10 border-amber-400/30' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] sm:text-[12px] tracking-wider ${
                    leaderStats?.dri ? 'text-amber-300 font-bold' : currentTierStyles.statLabel
                  }`}
                >
                  DRI
                </span>
                {leaderStats?.dri && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                )}
              </div>
              <span
                className={`font-mono text-sm sm:text-base ${
                  leaderStats?.dri
                    ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : currentTierStyles.statValue
                }`}
              >
                {dri}
              </span>
            </div>

            <div
              className={`flex items-center justify-between border-b border-white/5 pb-0.5 px-1 rounded transition-colors ${
                leaderStats?.def ? 'bg-amber-400/10 border-amber-400/30' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] sm:text-[12px] tracking-wider ${
                    leaderStats?.def ? 'text-amber-300 font-bold' : currentTierStyles.statLabel
                  }`}
                >
                  DEF
                </span>
                {leaderStats?.def && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                )}
              </div>
              <span
                className={`font-mono text-sm sm:text-base ${
                  leaderStats?.def
                    ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : currentTierStyles.statValue
                }`}
              >
                {def}
              </span>
            </div>

            <div
              className={`flex items-center justify-between px-1 rounded transition-colors ${
                leaderStats?.phy ? 'bg-amber-400/10 border-amber-400/30' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] sm:text-[12px] tracking-wider ${
                    leaderStats?.phy ? 'text-amber-300 font-bold' : currentTierStyles.statLabel
                  }`}
                >
                  PHY
                </span>
                {leaderStats?.phy && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                )}
              </div>
              <span
                className={`font-mono text-sm sm:text-base ${
                  leaderStats?.phy
                    ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : currentTierStyles.statValue
                }`}
              >
                {phy}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Clean, fully visible and properly spaced */}
        <div className="relative z-10 mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
          <span>FORMA {matchCountDisplay} JOGOS</span>
          <span className="font-mono text-zinc-300">RLCS PRO CARD</span>
        </div>
      </div>
    </div>
  );
});

