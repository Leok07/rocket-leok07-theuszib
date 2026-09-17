'use client';

import React, { useMemo } from 'react';
import { FutCardStats, AggregatedPlayerDashboard } from '@/types/dashboard';
import { resolveRankTheme } from '@/lib/rank-card-themes';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Crown,
  Zap,
} from 'lucide-react';

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
  dashboard?: AggregatedPlayerDashboard;
  carModel?: 'octane' | 'fennec';
}

interface ChemistryStyle {
  id: string;
  name: string;
  role: string;
  boosted: string;
  color: string;
  badgeBg: string;
}

// Compute Chemistry Playstyle based on top 2 attribute pillars (NO GREEN)
function getChemistryStyle(stats: FutCardStats): ChemistryStyle {
  const statList: Array<{ key: string; val: number }> = [
    { key: 'PAC', val: stats.pac },
    { key: 'SHO', val: stats.sho },
    { key: 'PAS', val: stats.pas },
    { key: 'DRI', val: stats.dri },
    { key: 'DEF', val: stats.def },
    { key: 'PHY', val: stats.phy },
  ];
  statList.sort((a, b) => b.val - a.val);
  const pair = `${statList[0].key}+${statList[1].key}`;

  if (pair.includes('SHO') && pair.includes('PAC')) {
    return { id: 'hunter', name: 'HUNTER', role: 'Ataque Letal', boosted: '+VEL +FIN', color: 'text-amber-300', badgeBg: 'bg-amber-950/70 border-amber-500/50' };
  }
  if (pair.includes('DEF') && pair.includes('PHY')) {
    return { id: 'anchor', name: 'ANCHOR', role: 'Âncora Defensiva', boosted: '+DEF +FIS', color: 'text-sky-300', badgeBg: 'bg-sky-950/70 border-sky-500/50' };
  }
  if (pair.includes('PAS') && pair.includes('DRI')) {
    return { id: 'artist', name: 'ARTIST', role: 'Criador Aéreo', boosted: '+PAS +AER', color: 'text-cyan-300', badgeBg: 'bg-cyan-950/70 border-cyan-500/50' };
  }
  if (pair.includes('DEF') && pair.includes('PAC')) {
    return { id: 'shadow', name: 'SHADOW', role: 'Shadow Defense', boosted: '+DEF +VEL', color: 'text-purple-300', badgeBg: 'bg-purple-950/70 border-purple-500/50' };
  }
  if (pair.includes('SHO') && pair.includes('PAS')) {
    return { id: 'deadeye', name: 'DEADEYE', role: 'Passe & Chute', boosted: '+FIN +PAS', color: 'text-rose-300', badgeBg: 'bg-rose-950/70 border-rose-500/50' };
  }
  return { id: 'tactician', name: 'TACTICIAN', role: 'Equilibrado', boosted: 'COMPLETO', color: 'text-slate-300', badgeBg: 'bg-slate-800/70 border-slate-600/50' };
}

// Official Rocket League Rank Badge Resolution (Authentic 1381x1381 Assets)
interface RankBadgeAsset {
  src: string;
  label: string;
  rankName: string;
}

function getRankBadge(stats: FutCardStats): RankBadgeAsset {
  if (stats.hasRankData && stats.rankTierNumber) {
    const tier = stats.rankTierNumber;
    if (tier === 16) {
      return { src: '/images/ranks/champion_1.png', label: 'CHAMPION I', rankName: 'Campeão I' };
    }
    if (tier === 17) {
      return { src: '/images/ranks/champion_2.png', label: 'CHAMPION II', rankName: 'Campeão II' };
    }
    if (tier === 18) {
      return { src: '/images/ranks/champion_3.png', label: 'CHAMPION III', rankName: 'Campeão III' };
    }
    if (tier >= 19) {
      return { src: '/images/ranks/grand_champion.png', label: 'GRAND CHAMPION', rankName: 'Grande Campeão' };
    }
    if (tier === 15) {
      return { src: '/images/ranks/diamond_3.png', label: 'DIAMOND III', rankName: 'Diamante III' };
    }
    if (tier === 14) {
      return { src: '/images/ranks/diamond_2.png', label: 'DIAMOND II', rankName: 'Diamante II' };
    }
    if (tier <= 13) {
      return { src: '/images/ranks/diamond_1.png', label: 'DIAMOND I', rankName: 'Diamante I' };
    }
  }

  // Fallback seguro ao ativo oficial unificado de Champion
  return {
    src: '/images/ranks/champion_official.png',
    label: 'CHAMPION',
    rankName: 'Campeão',
  };
}

// Geometry for Rocket League Competitive Shield
const SHIELD_CLIP_PATH = 'polygon(10% 0%, 90% 0%, 100% 6%, 100% 92%, 50% 100%, 0% 92%, 0% 6%)';

export const PlayerCardFUT = React.memo(function PlayerCardFUT({
  playerName,
  platformLabel,
  stats,
  teamTheme,
  leaderStats,
}: PlayerCardFUTProps) {
  const {
    ovr,
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
    recentMvpStreak,
    isProvisional,
  } = stats;

  const rankBadge = useMemo(() => getRankBadge(stats), [stats]);
  const rankTheme = useMemo(
    () => resolveRankTheme(stats.rankTierNumber, stats.rankName),
    [stats.rankTierNumber, stats.rankName]
  );
  const chemistryStyle = useMemo(() => getChemistryStyle(stats), [stats]);

  const formattedPlatform = useMemo(() => {
    const p = (platformLabel || '').toLowerCase();
    if (p.includes('epic')) return 'EPIC';
    if (p.includes('playstation') || p.includes('ps5') || p.includes('ps4')) return 'PSN';
    if (p.includes('steam')) return 'STEAM';
    if (p.includes('xbox')) return 'XBOX';
    return (platformLabel || 'PC').toUpperCase();
  }, [platformLabel]);

  const cardStats = [
    { label: 'PAC', val: pac },
    { label: 'SHO', val: sho },
    { label: 'PAS', val: pas },
    { label: 'DRI', val: dri },
    { label: 'DEF', val: def },
    { label: 'PHY', val: phy },
  ];

  return (
    <div
      className="relative w-[315px] sm:w-[335px] h-[525px] mx-auto select-none transition-transform duration-200 hover:-translate-y-1.5 cursor-pointer group shrink-0"
      style={{
        filter: `drop-shadow(0 18px 34px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 20px ${rankTheme.foilGlow})`,
      }}
    >
      {/* Dynamic Rank Aura Halo */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-50 blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-85"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rankTheme.auraColor} 0%, transparent 70%)`,
        }}
      />

      {/* Layer 1: Metallic Outer Shield Bevel */}
      <div
        className={`relative w-full h-full p-[2.5px] bg-gradient-to-b ${rankTheme.shieldBorderGradient} transition-all duration-300`}
        style={{ clipPath: SHIELD_CLIP_PATH }}
      >
        {/* Layer 2: Dark Metallic Groove */}
        <div
          className="relative w-full h-full p-[1.5px] bg-black/90"
          style={{ clipPath: SHIELD_CLIP_PATH }}
        >
          {/* Layer 3: Inner Hairline Highlight */}
          <div
            className="relative w-full h-full p-[1px] bg-gradient-to-b from-white/30 via-white/5 to-transparent"
            style={{ clipPath: SHIELD_CLIP_PATH }}
          >
            {/* Layer 4: Card Body Container */}
            <div
              className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b ${rankTheme.cardBg} px-5 sm:px-5.5 pt-4 pb-12 text-white backdrop-blur-xl`}
              style={{ clipPath: SHIELD_CLIP_PATH }}
            >
              {/* Subtle Tech Cyber Mesh */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Top Header Ribbon: Official Rank Title & Platform */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5 h-7 shrink-0 mb-1">
                <div className="flex items-center gap-1.5 bg-black/70 px-2.5 py-0.5 rounded border border-white/15 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-white">
                    {rankBadge.label}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isProvisional && (
                    <span className="text-[8.5px] font-black bg-amber-950/80 border border-amber-500/50 text-amber-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PROV
                    </span>
                  )}
                  <span className="text-[9px] font-bold bg-zinc-800/90 border border-white/20 text-zinc-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    BR
                  </span>
                  <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-white/15 whitespace-nowrap shadow-sm">
                    {formattedPlatform}
                  </span>
                </div>
              </div>

              {/* Streak / Momentum Mini Bar */}
              <div className="relative z-10 flex items-center justify-between text-[10px] bg-black/60 px-3 py-1 rounded border border-white/10 h-7 shrink-0 mb-1 shadow-sm">
                <span className="text-zinc-400 font-medium">Momento:</span>
                {recentMvpStreak && recentMvpStreak >= 3 ? (
                  <span className="text-amber-300 flex items-center gap-1 font-black">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    {recentMvpStreak}x MVP Seguidos
                  </span>
                ) : streakType === 'win' && streakCount >= 1 ? (
                  <span className="text-sky-300 flex items-center gap-1 font-black">
                    <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                    +{streakCount} Vitórias
                  </span>
                ) : streakType === 'loss' && streakCount >= 1 ? (
                  <span className="text-rose-400 flex items-center gap-1 font-black">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    -{streakCount} Derrotas
                  </span>
                ) : (
                  <span className="text-zinc-300 font-semibold">{recentWinRate}% WR ({recentMatchesCount || 20}j)</span>
                )}
              </div>

              {/* Upper Deck: OVR Score & Authentic Rocket League Rank Crest */}
              <div className="relative z-10 flex items-center justify-between gap-3 px-1 py-1 h-[134px] shrink-0 mb-1">
                {/* Left OVR Block */}
                <div className="flex flex-col items-center shrink-0 w-20 text-center">
                  <span
                    className={`text-5xl sm:text-6xl font-black font-mono leading-none tracking-tight ${rankTheme.ovrText}`}
                  >
                    {ovr}
                  </span>
                  <span className={`text-sm sm:text-base font-black tracking-widest uppercase mt-0.5 ${rankTheme.posText}`}>
                    {position}
                  </span>
                  <div className={`w-10 h-[2px] my-1 rounded-full bg-gradient-to-r ${rankTheme.accentGradient} opacity-80`} />
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    {position === 'ATA' ? 'ATAQUE' : 'DEFESA'}
                  </span>

                  {/* Chemistry Style Tag */}
                  <div
                    className={`mt-1.5 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${chemistryStyle.badgeBg} ${chemistryStyle.color} shadow-sm`}
                    title={`Estilo: ${chemistryStyle.role} (${chemistryStyle.boosted})`}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    <span>{chemistryStyle.name}</span>
                  </div>
                </div>

                {/* Right Official Rank Crest */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div
                    className={`w-32 h-28 sm:w-36 sm:h-[122px] rounded-xl flex flex-col items-center justify-between relative border ${rankTheme.crestBorder} bg-gradient-to-b ${rankTheme.crestBg} p-1.5 shadow-inner overflow-hidden group/badge`}
                  >
                    {/* Subtle Rank Glow Behind Icon */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${rankTheme.auraColor} 0%, transparent 75%)`,
                      }}
                    />

                    {/* Official Game Rank Icon (1381x1381 Authentic) */}
                    <div className="w-full h-[78px] sm:h-[82px] flex items-center justify-center relative z-10">
                      <img
                        src={rankBadge.src}
                        alt={rankBadge.label}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                        loading="eager"
                      />
                    </div>

                    {/* Rank Subtitle Bar */}
                    <div className="flex items-center justify-between w-full px-2 border-t border-white/10 pt-1 relative z-10 bg-black/60 rounded-b">
                      <span className={`text-[8.5px] font-black tracking-widest uppercase truncate ${rankTheme.posText}`}>
                        {rankBadge.label}
                      </span>
                      <span className="text-[7.5px] font-mono font-bold text-amber-300 tracking-wider shrink-0 ml-1">
                        RL 2V2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Nameplate */}
              <div className={`relative z-10 text-center py-2 px-3 rounded border ${rankTheme.nameplateBorder} flex flex-col justify-center items-center shrink-0 mb-1 shadow-sm`}>
                <h2
                  className={`text-base sm:text-lg font-black tracking-[0.22em] uppercase truncate max-w-[250px] leading-none ${
                    teamTheme === 'blue' ? 'text-sky-100' : 'text-orange-100'
                  }`}
                >
                  {playerName}
                </h2>
                <span className="text-[8px] font-bold tracking-widest text-zinc-400 uppercase mt-1">
                  {position === 'ATA' ? 'DUO STRIKER • 2V2' : 'DUO ANCHOR • 2V2'}
                </span>
              </div>

              {/* EA FC 26 Horizontal 6 Stats Row (Uma do lado da outra) */}
              <div className="relative z-10 my-1 bg-black/50 px-2 py-2 rounded-lg border border-white/10 shadow-inner">
                <div className="grid grid-cols-6 divide-x divide-white/10 text-center">
                  {cardStats.map((st) => (
                    <div
                      key={st.label}
                      className="flex flex-col items-center justify-center px-0.5"
                    >
                      <span className={`font-mono font-black text-base sm:text-lg ${rankTheme.statNumberColor} leading-none tracking-tight`}>
                        {st.val}
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-black tracking-wider ${rankTheme.statLabelColor} uppercase mt-1 leading-none`}>
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Banner: Generous clearance above the bottom shield point */}
              <div className="relative z-10 mt-1 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] tracking-wider text-zinc-400">
                <span className={`px-2 py-0.5 rounded border text-[8.5px] font-black uppercase tracking-widest ${rankTheme.footerBadgeBg}`}>
                  {rankTheme.rankTitle}
                </span>
                <span className="font-mono font-bold text-zinc-300">
                  {recentWinRate}% WR • {recentMatchesCount || 20} JOGOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
