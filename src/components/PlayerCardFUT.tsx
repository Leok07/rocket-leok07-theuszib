'use client';

import React, { useRef, useState, useMemo } from 'react';
import { FutCardStats, AggregatedPlayerDashboard } from '@/types/dashboard';
import { TIER_STYLES } from '@/lib/fut-tiers';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Crown,
  Zap,
  Info,
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

// Compute EA FC Chemistry Style based on top 2 attribute pillars (ZERO GREEN)
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
  const pair = [statList[0].key, statList[1].key].sort().join('+');

  if (pair === 'PAC+SHO') {
    return { id: 'hunter', name: 'HUNTER', role: 'Cacador Ofensivo', boosted: '+PAC +SHO', color: 'text-rose-400', badgeBg: 'bg-rose-950/70 border-rose-500/50' };
  }
  if (pair === 'DEF+PAC') {
    return { id: 'shadow', name: 'SHADOW', role: 'Sombra Defensiva', boosted: '+PAC +DEF', color: 'text-sky-300', badgeBg: 'bg-sky-950/70 border-sky-500/50' };
  }
  if (pair === 'DRI+PAS') {
    return { id: 'engine', name: 'ENGINE', role: 'Motor Tatico', boosted: '+PAS +DRI', color: 'text-amber-400', badgeBg: 'bg-amber-950/70 border-amber-500/50' };
  }
  if (pair === 'DEF+PHY') {
    return { id: 'anchor', name: 'ANCHOR', role: 'Ancora Blindada', boosted: '+DEF +PHY', color: 'text-cyan-400', badgeBg: 'bg-cyan-950/70 border-cyan-500/50' };
  }
  if (pair === 'PAS+SHO') {
    return { id: 'catalyst', name: 'CATALYST', role: 'Catalisador Ofensivo', boosted: '+SHO +PAS', color: 'text-yellow-400', badgeBg: 'bg-yellow-950/70 border-yellow-500/50' };
  }
  if (pair === 'DRI+PAC') {
    return { id: 'hawk', name: 'HAWK', role: 'Falcao Mecanico', boosted: '+PAC +DRI', color: 'text-orange-400', badgeBg: 'bg-orange-950/70 border-orange-500/50' };
  }
  if (pair === 'DEF+PAS') {
    return { id: 'gladiator', name: 'GLADIATOR', role: 'Gladiador de Campo', boosted: '+PAS +DEF', color: 'text-blue-400', badgeBg: 'bg-blue-950/70 border-blue-500/50' };
  }
  if (pair === 'PHY+SHO') {
    return { id: 'marksman', name: 'MARKSMAN', role: 'Franco-Atirador', boosted: '+SHO +PHY', color: 'text-red-400', badgeBg: 'bg-red-950/70 border-red-500/50' };
  }
  if (pair === 'DRI+SHO') {
    return { id: 'finisher', name: 'FINISHER', role: 'Finalizador Letal', boosted: '+SHO +DRI', color: 'text-purple-400', badgeBg: 'bg-purple-950/70 border-purple-500/50' };
  }
  if (pair === 'PAC+PHY') {
    return { id: 'powerhouse', name: 'POWERHOUSE', role: 'Forca Bruta', boosted: '+PAC +PHY', color: 'text-blue-300', badgeBg: 'bg-blue-950/70 border-blue-500/50' };
  }
  if (pair === 'DEF+DRI') {
    return { id: 'sentinel', name: 'SENTINEL', role: 'Sentinela Aereo', boosted: '+DRI +DEF', color: 'text-indigo-400', badgeBg: 'bg-indigo-950/70 border-indigo-500/50' };
  }
  return { id: 'basic', name: 'BASIC', role: 'Equilibrado', boosted: 'ESTILO BASE', color: 'text-zinc-300', badgeBg: 'bg-zinc-800/70 border-zinc-600/50' };
}

// Minimalist Rocket League Champion Badge Asset (No numbers, purely CHAMPION)
const CHAMPION_MINIMALIST_BADGE = {
  src: '/images/ranks/champion_minimalist.png',
  label: 'CHAMPION',
};

// Authentic EA FC Ultimate Team Shield Geometry
const SHIELD_CLIP_PATH = 'polygon(10% 0%, 90% 0%, 100% 6%, 100% 92%, 50% 100%, 0% 92%, 0% 6%)';

export const PlayerCardFUT = React.memo(function PlayerCardFUT({
  playerName,
  platformLabel,
  stats,
  teamTheme,
  leaderStats,
  dashboard,
}: PlayerCardFUTProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });
  const [inspectedStat, setInspectedStat] = useState<string | null>(null);

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
    editionTitle,
    editionRarity,
    activePerks = [],
    recentMvpStreak,
    isProvisional,
  } = stats;

  const currentTierStyles = TIER_STYLES[tier] || TIER_STYLES.gold;
  const matchCountDisplay = recentMatchesCount || 10;
  const chemistryStyle = useMemo(() => getChemistryStyle(stats), [stats]);

  // Clean, single-line platform formatting to prevent wrapping
  const formattedPlatform = useMemo(() => {
    const p = (platformLabel || '').toLowerCase();
    if (p.includes('epic')) return 'EPIC (PC)';
    if (p.includes('playstation') || p.includes('ps5') || p.includes('ps4')) return 'PS5';
    if (p.includes('steam')) return 'STEAM';
    if (p.includes('xbox')) return 'XBOX';
    return platformLabel.toUpperCase();
  }, [platformLabel]);

  // Mouse move handler for 3D parallax tilt & specular sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = (mouseX / rect.width) * 2 - 1;
    const normY = (mouseY / rect.height) * 2 - 1;

    const tiltX = -normY * 8;
    const tiltY = normX * 8;
    const glareX = (mouseX / rect.width) * 100;
    const glareY = (mouseY / rect.height) * 100;

    setTilt({ x: tiltX, y: tiltY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  // Micro-attribute inspection definitions
  const inspectionDetails: Record<string, { title: string; items: Array<{ label: string; value: string }> }> = {
    PAC: {
      title: 'Ritmo & Velocidade',
      items: [
        { label: 'Velocidade Media', value: dashboard ? `${dashboard.movement.avgSpeed.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} uu/s` : '1.410 uu/s' },
        { label: '% Supersonico', value: dashboard ? `${(dashboard.movement.avgSupersonicPercent * 100).toFixed(1)}%` : '14.5%' },
        { label: '% Boost Speed', value: dashboard ? `${(dashboard.movement.avgBoostSpeedPercent * 100).toFixed(1)}%` : '28.0%' },
      ],
    },
    SHO: {
      title: 'Finalizacao & Gols',
      items: [
        { label: 'Gols Recentes', value: `${stats.recentGoals || 0}` },
        { label: 'Chutes Recentes', value: `${stats.recentShots || 0}` },
        { label: 'Conversao em Gol', value: stats.recentShots > 0 ? `${((stats.recentGoals / stats.recentShots) * 100).toFixed(1)}%` : '0.0%' },
      ],
    },
    PAS: {
      title: 'Playmaking & Passes',
      items: [
        { label: 'Assistencias', value: `${stats.recentAssists || 0}` },
        { label: 'Assists / Jogo', value: `${(stats.recentAssists / Math.max(matchCountDisplay, 1)).toFixed(2)}` },
        { label: 'Participacao Total', value: `${(stats.recentGoals || 0) + (stats.recentAssists || 0)} gols` },
      ],
    },
    DRI: {
      title: 'Mecanica & Controle Aereo',
      items: [
        { label: '% Ar Alto (Aerials)', value: dashboard ? `${(dashboard.movement.avgHighAirPercent * 100).toFixed(1)}%` : '8.2%' },
        { label: 'Powerslides / Jogo', value: dashboard ? `${dashboard.movement.avgPowerslideCount.toFixed(0)}` : '18' },
        { label: '% Ar Baixo', value: dashboard ? `${(dashboard.movement.avgLowAirPercent * 100).toFixed(1)}%` : '19.4%' },
      ],
    },
    DEF: {
      title: 'Solidez Defensiva',
      items: [
        { label: 'Saves Realizados', value: `${stats.recentSaves || 0}` },
        { label: 'Terco Defensivo', value: dashboard ? `${(dashboard.positioning.avgDefensiveThird * 100).toFixed(1)}%` : '46.5%' },
        { label: 'Atras da Bola', value: dashboard ? `${(dashboard.positioning.avgBehindBall * 100).toFixed(1)}%` : '78.2%' },
      ],
    },
    PHY: {
      title: 'Fisicalidade & Pressao',
      items: [
        { label: 'BPM (Boost/min)', value: dashboard ? `${dashboard.boost.avgBpm.toFixed(0)}` : '385' },
        { label: 'Boost Roubado / Jogo', value: dashboard ? `${dashboard.boost.avgStolenBig.toFixed(1)}` : '1.4' },
        { label: 'Demos / Jogo', value: dashboard ? `${dashboard.demos.avgInflicted.toFixed(2)}` : '0.8' },
      ],
    },
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[320px] sm:w-[340px] h-[570px] mx-auto select-none transition-transform duration-100 ease-out cursor-pointer group shrink-0"
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        filter: leaderStats?.ovr
          ? `drop-shadow(0 18px 32px rgba(245, 158, 11, 0.45)) drop-shadow(0 0 16px ${currentTierStyles.foilGlow || 'rgba(245, 158, 11, 0.35)'})`
          : `drop-shadow(0 18px 32px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px ${currentTierStyles.foilGlow || 'rgba(255, 255, 255, 0.2)'})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer Glow Halo Ring */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-60 blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentTierStyles.auraColor || 'rgba(255,255,255,0.2)'} 0%, transparent 70%)`,
        }}
      />

      {/* Layer 1: Detailed Metallic Outer Shield Bevel */}
      <div
        className={`relative w-full h-full p-[2.5px] bg-gradient-to-b ${
          currentTierStyles.shieldBorderGradient || 'from-amber-300 via-amber-500 to-amber-700'
        } transition-all duration-300`}
        style={{ clipPath: SHIELD_CLIP_PATH }}
      >
        {/* Layer 2: Middle Dark Metallic Accent Groove */}
        <div
          className="relative w-full h-full p-[1.5px] bg-black/85"
          style={{ clipPath: SHIELD_CLIP_PATH }}
        >
          {/* Layer 3: Inner Metallic Hairline Ring */}
          <div
            className="relative w-full h-full p-[1px] bg-gradient-to-b from-white/35 via-white/10 to-transparent"
            style={{ clipPath: SHIELD_CLIP_PATH }}
          >
            {/* Layer 4: Card Body Container with Generous Breathing Space */}
            <div
              className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b ${currentTierStyles.cardBg} px-5 sm:px-5.5 pt-4 pb-8 text-white backdrop-blur-xl`}
              style={{ clipPath: SHIELD_CLIP_PATH }}
            >
              {/* Subtle Tech Watermark Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"
              />

              {/* Dynamic Holographic Specular Foil Sheen Layer */}
              {tilt.isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge transition-opacity duration-150"
                  style={{
                    background: `radial-gradient(circle 220px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 35%, transparent 75%), linear-gradient(${tilt.x * 12}deg, rgba(255, 0, 128, 0.12), rgba(0, 255, 255, 0.12), rgba(255, 215, 0, 0.12), transparent)`,
                    opacity: 0.9,
                  }}
                />
              )}

              {/* Top Metallic Header Ribbon (Generous top clearance, no edge touching) */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5 h-7 shrink-0 mb-1">
                <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-0.5 rounded border border-white/20 shrink-0 shadow-sm">
                  <Award className={`w-3.5 h-3.5 ${currentTierStyles.headerIconColor}`} />
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-100">
                    {currentTierStyles.tierLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isProvisional && (
                    <span className="text-[8.5px] font-black bg-amber-950/80 border border-amber-500/50 text-amber-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PROV
                    </span>
                  )}
                  <span className="text-[9px] font-bold bg-zinc-800/80 border border-white/20 text-zinc-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    BR
                  </span>
                  <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider bg-black/60 px-2.5 py-0.5 rounded border border-white/20 whitespace-nowrap shadow-sm">
                    {formattedPlatform}
                  </span>
                </div>
              </div>

              {/* Dynamic Form / Streak Banner (No green, balanced spacing) */}
              <div className="relative z-10 flex items-center justify-between text-[10px] bg-black/60 px-3 py-1 rounded border border-white/10 h-7 shrink-0 mb-1 shadow-sm">
                <span className="text-zinc-400 font-medium">Forma Recente:</span>
                {recentMvpStreak && recentMvpStreak >= 3 ? (
                  <span className="text-amber-300 flex items-center gap-1 font-black">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    {recentMvpStreak}x MVP Seguidos
                  </span>
                ) : streakType === 'win' && streakCount >= 1 ? (
                  <span className="text-sky-300 flex items-center gap-1 font-black">
                    <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
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

              {/* Upper Deck: Left OVR & Position + Right Minimalist Champion Crest */}
              <div className="relative z-10 flex items-center justify-between gap-3 px-1 py-1 h-[134px] shrink-0 mb-1">
                {/* Left OVR & Position Block */}
                <div className="flex flex-col items-center shrink-0 w-20 text-center">
                  <span
                    className={`text-5xl sm:text-6xl font-black font-mono leading-none tracking-tight ${currentTierStyles.ovrText}`}
                  >
                    {ovr}
                  </span>
                  <span className={`text-sm sm:text-base font-black tracking-widest uppercase mt-0.5 ${currentTierStyles.posText}`}>
                    {position}
                  </span>
                  <div className={`w-10 h-[2px] my-1 rounded-full bg-gradient-to-r ${currentTierStyles.accentGradient} opacity-80`} />
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    {position === 'ATA' ? 'ATAQUE' : 'DEFESA'}
                  </span>

                  {/* EA FC Chemistry Style Mini Badge */}
                  <div
                    className={`mt-1.5 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${chemistryStyle.badgeBg} ${chemistryStyle.color} shadow-sm`}
                    title={`Estilo de Quimica: ${chemistryStyle.role} (${chemistryStyle.boosted})`}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    <span>{chemistryStyle.name}</span>
                  </div>
                </div>

                {/* Right Minimalist Rocket League Champion Crest (NO NUMBERS) */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div
                    className={`w-32 h-28 sm:w-36 sm:h-[122px] rounded-xl flex flex-col items-center justify-between relative border ${currentTierStyles.crestBorder} bg-gradient-to-b ${currentTierStyles.crestBg} p-1.5 shadow-inner overflow-hidden group/badge`}
                  >
                    {/* Subtle violet aura behind rank badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-700/25 via-purple-500/10 to-transparent pointer-events-none" />

                    {/* High-Resolution Minimalist Champion Rank Emblem */}
                    <div className="w-full h-[78px] sm:h-[82px] flex items-center justify-center relative z-10 transition-transform duration-300 group-hover/badge:scale-105">
                      <img
                        src={CHAMPION_MINIMALIST_BADGE.src}
                        alt="CHAMPION"
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(168,85,247,0.55)]"
                        loading="eager"
                      />
                    </div>

                    {/* Minimalist Rank Label: purely CHAMPION • RL 2V2 */}
                    <div className="flex items-center justify-between w-full px-2 border-t border-white/10 pt-1 relative z-10 bg-black/50 rounded-b">
                      <span className="text-[8.5px] font-black tracking-widest text-purple-300 uppercase truncate">
                        CHAMPION
                      </span>
                      <span className="text-[7.5px] font-mono font-bold text-amber-300 tracking-wider shrink-0 ml-1">
                        RL 2V2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nameplate: EA FC Metallic Banner (Generous side breathing room) */}
              <div className={`relative z-10 text-center py-1.5 px-3 rounded border ${currentTierStyles.nameplateBorder} h-12 flex flex-col justify-center items-center shrink-0 mb-1 shadow-sm`}>
                <h2
                  className={`text-sm sm:text-base font-black tracking-[0.16em] uppercase truncate max-w-[240px] leading-tight ${
                    teamTheme === 'blue' ? 'text-sky-100' : 'text-orange-100'
                  }`}
                >
                  {playerName}
                </h2>

                <div className="mt-0.5 flex items-center justify-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 text-[8.5px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${currentTierStyles.editionBadge}`}>
                    <Sparkles className="w-2.5 h-2.5" />
                    {editionTitle || currentTierStyles.tierLabel}
                  </span>
                </div>
              </div>

              {/* Official 2x3 EA FC Attributes Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-x-4 text-xs sm:text-sm py-1 h-[106px] shrink-0 mb-1">
                {/* Center Vertical Divider */}
                <div className="absolute top-0.5 bottom-0.5 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent" />

                {/* Left Column: PAC, SHO, PAS */}
                <div className="space-y-0.5 pr-1">
                  {[
                    { key: 'PAC', label: 'PAC', val: pac, isLeader: leaderStats?.pac },
                    { key: 'SHO', label: 'SHO', val: sho, isLeader: leaderStats?.sho },
                    { key: 'PAS', label: 'PAS', val: pas, isLeader: leaderStats?.pas },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onMouseEnter={() => setInspectedStat(item.key)}
                      onClick={() => setInspectedStat(inspectedStat === item.key ? null : item.key)}
                      className={`flex items-center justify-between border-b border-white/5 pb-0.5 px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        inspectedStat === item.key
                          ? 'bg-white/15 border-white/30 scale-[1.02]'
                          : item.isLeader
                          ? 'bg-amber-400/10 border-amber-400/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[11px] sm:text-[12px] tracking-wider ${
                            inspectedStat === item.key
                              ? 'text-white font-black'
                              : item.isLeader
                              ? 'text-amber-300 font-bold'
                              : currentTierStyles.statLabel
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.isLeader && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                        )}
                      </div>
                      <span
                        className={`font-mono text-sm sm:text-base ${
                          item.isLeader
                            ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : currentTierStyles.statValue
                        }`}
                      >
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Column: DRI, DEF, PHY */}
                <div className="space-y-0.5 pl-1">
                  {[
                    { key: 'DRI', label: 'DRI', val: dri, isLeader: leaderStats?.dri },
                    { key: 'DEF', label: 'DEF', val: def, isLeader: leaderStats?.def },
                    { key: 'PHY', label: 'PHY', val: phy, isLeader: leaderStats?.phy },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onMouseEnter={() => setInspectedStat(item.key)}
                      onClick={() => setInspectedStat(inspectedStat === item.key ? null : item.key)}
                      className={`flex items-center justify-between border-b border-white/5 pb-0.5 px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        inspectedStat === item.key
                          ? 'bg-white/15 border-white/30 scale-[1.02]'
                          : item.isLeader
                          ? 'bg-amber-400/10 border-amber-400/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[11px] sm:text-[12px] tracking-wider ${
                            inspectedStat === item.key
                              ? 'text-white font-black'
                              : item.isLeader
                              ? 'text-amber-300 font-bold'
                              : currentTierStyles.statLabel
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.isLeader && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                        )}
                      </div>
                      <span
                        className={`font-mono text-sm sm:text-base ${
                          item.isLeader
                            ? 'text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : currentTierStyles.statValue
                        }`}
                      >
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspection HUD Tray / Perks (Strictly locked 48px height) */}
              <div className="relative z-10 h-12 flex flex-col justify-center shrink-0 overflow-hidden mb-1">
                {inspectedStat && inspectionDetails[inspectedStat] ? (
                  <div className="bg-black/75 border border-white/20 rounded p-1.5 animate-fadeIn shadow-sm">
                    <div className="flex items-center justify-between pb-0.5 border-b border-white/10 mb-1">
                      <span className="text-[8.5px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1">
                        <Info className="w-2.5 h-2.5" />
                        {inspectedStat} • {inspectionDetails[inspectedStat].title}
                      </span>
                      <span className="text-[7.5px] text-zinc-400">Ballchasing</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      {inspectionDetails[inspectedStat].items.map((it, idx) => (
                        <div key={idx} className="bg-white/5 rounded px-1 py-0.5 border border-white/5">
                          <span className="text-[7px] text-zinc-400 block truncate">{it.label}</span>
                          <span className="text-[9px] font-mono font-bold text-white block truncate">{it.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    {activePerks && activePerks.length > 0 ? (
                      <div className="flex items-center justify-center gap-1.5 flex-nowrap overflow-hidden">
                        {activePerks.slice(0, 3).map((perk, i) => (
                          <span
                            key={i}
                            className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tight truncate max-w-[95px] ${perk.color}`}
                          >
                            {perk.label}: {perk.value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-1 text-[8px] font-mono text-zinc-400 tracking-wider">
                        PASSE O MOUSE NOS ATRIBUTOS PARA INSPECIONAR
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Comfortably positioned above shield bottom taper */}
              <div className="relative z-10 pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[9px] text-zinc-400 font-bold tracking-widest uppercase h-6 shrink-0">
                <span>FORMA {matchCountDisplay} JOGOS</span>
                <span className="font-mono text-zinc-300">{editionRarity ? `${editionRarity} • RLCS` : 'CHAMPION • PRO CARD'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
