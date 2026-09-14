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
  Shield,
  Zap,
  Target,
  Flame,
  Gauge,
  Swords,
  Crosshair,
  Compass,
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

// Compute EA FC Chemistry Style based on top 2 attribute pillars
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
    return { id: 'hunter', name: 'HUNTER', role: 'Caçador Ofensivo', boosted: '+PAC +SHO', color: 'text-rose-400', badgeBg: 'bg-rose-950/70 border-rose-500/50' };
  }
  if (pair === 'DEF+PAC') {
    return { id: 'shadow', name: 'SHADOW', role: 'Sombra Defensiva', boosted: '+PAC +DEF', color: 'text-emerald-400', badgeBg: 'bg-emerald-950/70 border-emerald-500/50' };
  }
  if (pair === 'DRI+PAS') {
    return { id: 'engine', name: 'ENGINE', role: 'Motor Tático', boosted: '+PAS +DRI', color: 'text-amber-400', badgeBg: 'bg-amber-950/70 border-amber-500/50' };
  }
  if (pair === 'DEF+PHY') {
    return { id: 'anchor', name: 'ANCHOR', role: 'Âncora Blindada', boosted: '+DEF +PHY', color: 'text-cyan-400', badgeBg: 'bg-cyan-950/70 border-cyan-500/50' };
  }
  if (pair === 'PAS+SHO') {
    return { id: 'catalyst', name: 'CATALYST', role: 'Catalisador Ofensivo', boosted: '+SHO +PAS', color: 'text-yellow-400', badgeBg: 'bg-yellow-950/70 border-yellow-500/50' };
  }
  if (pair === 'DRI+PAC') {
    return { id: 'hawk', name: 'HAWK', role: 'Falcão Mecânico', boosted: '+PAC +DRI', color: 'text-orange-400', badgeBg: 'bg-orange-950/70 border-orange-500/50' };
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
    return { id: 'powerhouse', name: 'POWERHOUSE', role: 'Força Bruta', boosted: '+PAC +PHY', color: 'text-teal-400', badgeBg: 'bg-teal-950/70 border-teal-500/50' };
  }
  if (pair === 'DEF+DRI') {
    return { id: 'sentinel', name: 'SENTINEL', role: 'Sentinela Aéreo', boosted: '+DRI +DEF', color: 'text-indigo-400', badgeBg: 'bg-indigo-950/70 border-indigo-500/50' };
  }
  return { id: 'basic', name: 'BASIC', role: 'Equilibrado', boosted: 'ESTILO BASE', color: 'text-zinc-300', badgeBg: 'bg-zinc-800/70 border-zinc-600/50' };
}

// Vector Silhouette of the Legendary Octane
function OctaneSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 28 C6 27, 2 29, 0 31 C2 33, 7 32, 11 31 Z" fill="url(#octaneBoostGrad)" opacity="0.85" />
      <path d="M10 29 C5 28.5, 3 30, 1 31 C3 32, 6 31.5, 9 30.5 Z" fill="#ffffff" opacity="0.9" />
      <path d="M15 16 L26 12 L28 15 L17 18 Z" fill="currentColor" opacity="0.95" />
      <path d="M21 15 L22 23 L24 23 L23 15 Z" fill="currentColor" opacity="0.75" />
      <path d="M28 22 L38 15 L56 16 L65 24 L27 24 Z" fill="currentColor" opacity="0.4" />
      <path
        d="M14 26 L23 20 L40 18 L55 18 L70 23 L85 26 L94 28 L94 32 L88 34 L78 34 C76 30, 68 30, 66 34 L44 34 C42 30, 34 30, 32 34 L18 34 L14 30 Z"
        fill="currentColor"
      />
      <path d="M48 16 L56 16 L53 19 L46 19 Z" fill="#ffffff" opacity="0.85" />
      <polygon points="86,27 93,29 90,31 84,30" fill="#38bdf8" />
      <circle cx="72" cy="34" r="7" fill="#0f172a" stroke="currentColor" strokeWidth="2" />
      <circle cx="72" cy="34" r="3.5" fill="#38bdf8" opacity="0.85" />
      <circle cx="38" cy="34" r="8" fill="#0f172a" stroke="currentColor" strokeWidth="2" />
      <circle cx="38" cy="34" r="4" fill="#38bdf8" opacity="0.85" />
      <defs>
        <linearGradient id="octaneBoostGrad" x1="0" y1="30" x2="12" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" stopOpacity="0" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Vector Silhouette of the Iconic Fennec
function FennecSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 29 C6 28, 2 30, 0 32 C2 34, 7 33, 11 32 Z" fill="url(#fennecBoostGrad)" opacity="0.85" />
      <path d="M10 30 C5 29.5, 3 31, 1 32 C3 33, 6 32.5, 9 31.5 Z" fill="#ffffff" opacity="0.9" />
      <path d="M16 19 L20 18 L32 18 L55 18 L68 23 L20 23 Z" fill="currentColor" opacity="0.4" />
      <path d="M16 17 L22 17 L21 19 L15 19 Z" fill="currentColor" opacity="0.95" />
      <path
        d="M15 23 L20 19 L60 19 L72 24 L90 26 L94 28 L94 33 L88 34 L78 34 C76 30, 68 30, 66 34 L44 34 C42 30, 34 30, 32 34 L17 34 L15 28 Z"
        fill="currentColor"
      />
      <polygon points="88,27 93,28 92,31 87,30" fill="#fb923c" />
      <rect x="89" y="30" width="4" height="2" fill="#fed7aa" opacity="0.9" />
      <circle cx="72" cy="34" r="7.5" fill="#0f172a" stroke="currentColor" strokeWidth="2" />
      <circle cx="72" cy="34" r="3.5" fill="#fb923c" opacity="0.85" />
      <circle cx="38" cy="34" r="7.5" fill="#0f172a" stroke="currentColor" strokeWidth="2" />
      <circle cx="38" cy="34" r="3.5" fill="#fb923c" opacity="0.85" />
      <defs>
        <linearGradient id="fennecBoostGrad" x1="0" y1="31" x2="12" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c2410c" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Authentic EA FC Ultimate Team Shield Geometry
const SHIELD_CLIP_PATH = 'polygon(10% 0%, 90% 0%, 100% 6%, 100% 92%, 50% 100%, 0% 92%, 0% 6%)';

export const PlayerCardFUT = React.memo(function PlayerCardFUT({
  playerName,
  platformLabel,
  stats,
  teamTheme,
  leaderStats,
  dashboard,
  carModel,
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
    isHybrid,
    activePerks = [],
    recentMvpStreak,
  } = stats;

  const currentTierStyles = TIER_STYLES[tier] || TIER_STYLES.gold;
  const matchCountDisplay = recentMatchesCount || 10;
  const chemistryStyle = useMemo(() => getChemistryStyle(stats), [stats]);

  // Car model selection (Leok07 defaults to Octane, Theuszrib to Fennec)
  const resolvedCarModel = carModel || (playerName.toLowerCase().includes('leo') ? 'octane' : 'fennec');

  // Mouse move handler for smooth 3D parallax tilt & specular light
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = (mouseX / rect.width) * 2 - 1;
    const normY = (mouseY / rect.height) * 2 - 1;

    const tiltX = -normY * 9;
    const tiltY = normX * 9;
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
        { label: 'Velocidade Média', value: dashboard ? `${dashboard.movement.avgSpeed.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km/h` : '1.410 km/h' },
        { label: '% Supersônico', value: dashboard ? `${(dashboard.movement.avgSupersonicPercent * 100).toFixed(1)}%` : '14.5%' },
        { label: '% Boost Speed', value: dashboard ? `${(dashboard.movement.avgBoostSpeedPercent * 100).toFixed(1)}%` : '28.0%' },
      ],
    },
    SHO: {
      title: 'Finalização & Gols',
      items: [
        { label: 'Gols Recentes', value: `${stats.recentGoals || 0}` },
        { label: 'Chutes Recentes', value: `${stats.recentShots || 0}` },
        { label: 'Conversão em Gol', value: stats.recentShots > 0 ? `${((stats.recentGoals / stats.recentShots) * 100).toFixed(1)}%` : '0.0%' },
      ],
    },
    PAS: {
      title: 'Playmaking & Passes',
      items: [
        { label: 'Assistências', value: `${stats.recentAssists || 0}` },
        { label: 'Assists / Jogo', value: `${(stats.recentAssists / Math.max(matchCountDisplay, 1)).toFixed(2)}` },
        { label: 'Participação Total', value: `${(stats.recentGoals || 0) + (stats.recentAssists || 0)} gols` },
      ],
    },
    DRI: {
      title: 'Mecânica & Controle Aéreo',
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
        { label: 'Terço Defensivo', value: dashboard ? `${(dashboard.positioning.avgDefensiveThird * 100).toFixed(1)}%` : '46.5%' },
        { label: 'Atrás da Bola', value: dashboard ? `${(dashboard.positioning.avgBehindBall * 100).toFixed(1)}%` : '78.2%' },
      ],
    },
    PHY: {
      title: 'Fisicalidade & Pressão',
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
      className="relative w-full max-w-[305px] sm:max-w-[325px] mx-auto select-none transition-transform duration-100 ease-out cursor-pointer group"
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        filter: leaderStats?.ovr
          ? `drop-shadow(0 16px 28px rgba(245, 158, 11, 0.4)) drop-shadow(0 0 14px ${currentTierStyles.foilGlow || 'rgba(245, 158, 11, 0.3)'})`
          : `drop-shadow(0 16px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 12px ${currentTierStyles.foilGlow || 'rgba(255, 255, 255, 0.15)'})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Layer 1: Authentic EA FC Shield Chamfered Metallic Frame */}
      <div
        className={`relative p-[2.5px] bg-gradient-to-b ${
          currentTierStyles.shieldBorderGradient || 'from-amber-300 via-amber-500 to-amber-700'
        } transition-all duration-300`}
        style={{ clipPath: SHIELD_CLIP_PATH }}
      >
        {/* Layer 2: Inner Shield Body Card Container */}
        <div
          className={`relative overflow-hidden bg-gradient-to-b ${currentTierStyles.cardBg} p-3.5 sm:p-4 text-white pb-7 backdrop-blur-xl`}
          style={{ clipPath: SHIELD_CLIP_PATH }}
        >
          {/* Layer 3: Dynamic Holographic Specular Foil Sheen Layer */}
          {tilt.isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge transition-opacity duration-150"
              style={{
                background: `radial-gradient(circle 220px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 35%, transparent 75%), linear-gradient(${tilt.x * 12}deg, rgba(255, 0, 128, 0.12), rgba(0, 255, 255, 0.12), rgba(255, 215, 0, 0.12), transparent)`,
                opacity: 0.9,
              }}
            />
          )}

          {/* Top Metallic Header Ribbon */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded border border-white/15">
              <Award className={`w-3.5 h-3.5 ${currentTierStyles.headerIconColor}`} />
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-100">
                {currentTierStyles.tierLabel}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[9px] font-extrabold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                BR
              </span>
              <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded border border-white/15">
                {platformLabel}
              </span>
            </div>
          </div>

          {/* Dynamic Form / Streak Banner */}
          <div className="relative z-10 mb-2 flex items-center justify-between text-[10px] bg-black/60 px-2.5 py-1 rounded border border-white/10">
            <span className="text-zinc-400 font-medium">Forma Recente:</span>
            {recentMvpStreak && recentMvpStreak >= 3 ? (
              <span className="text-amber-300 flex items-center gap-1 font-black">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {recentMvpStreak}x MVP Seguidos
              </span>
            ) : streakType === 'win' && streakCount >= 1 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-black">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                +{streakCount} Vitórias Seguidas
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

          {/* Upper Deck: Left OVR & Position Stack + Right Rocket League Vehicle Crest */}
          <div className="relative z-10 flex items-center justify-between gap-2 px-1 py-1">
            {/* Left OVR & Position Info Block */}
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
                className={`mt-1.5 px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${chemistryStyle.badgeBg} ${chemistryStyle.color}`}
                title={`Estilo de Química: ${chemistryStyle.role} (${chemistryStyle.boosted})`}
              >
                <Zap className="w-2.5 h-2.5" />
                <span>{chemistryStyle.name}</span>
              </div>
            </div>

            {/* Right Rocket League Vehicle Crest (Octane / Fennec Silhouette) */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div
                className={`w-28 h-24 sm:w-32 sm:h-26 rounded-xl flex flex-col items-center justify-center relative border ${currentTierStyles.crestBorder} bg-gradient-to-b ${currentTierStyles.crestBg} p-2 shadow-inner overflow-hidden`}
              >
                {/* Vehicle Silhouette Vector */}
                <div
                  className={`w-full h-14 flex items-center justify-center ${
                    teamTheme === 'blue'
                      ? 'text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]'
                      : 'text-orange-300 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]'
                  }`}
                >
                  {resolvedCarModel === 'octane' ? (
                    <OctaneSilhouette className="w-full h-full object-contain" />
                  ) : (
                    <FennecSilhouette className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Car Model & League Crest Label */}
                <div className="mt-1 flex items-center justify-between w-full px-1 border-t border-white/10 pt-1">
                  <span className="text-[8px] font-mono font-black tracking-widest text-zinc-300 uppercase">
                    {resolvedCarModel === 'octane' ? 'OCTANE RL' : 'FENNEC RL'}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-amber-300 tracking-wider">
                    CHAMP I
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nameplate: Authentic EA FC Metallic Banner */}
          <div className={`relative z-10 mt-2 text-center py-1.5 px-2 rounded border ${currentTierStyles.nameplateBorder}`}>
            <h2
              className={`text-sm sm:text-base font-black tracking-[0.16em] uppercase ${
                teamTheme === 'blue' ? 'text-sky-100' : 'text-orange-100'
              }`}
            >
              {playerName}
            </h2>

            <div className="mt-0.5 flex items-center justify-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${currentTierStyles.editionBadge}`}>
                <Sparkles className="w-3 h-3" />
                {editionTitle || currentTierStyles.tierLabel}
              </span>
            </div>
          </div>

          {/* Official 2x3 EA FC Attributes Grid with Metallic Hairline Divider */}
          <div className="relative z-10 mt-2 grid grid-cols-2 gap-x-4 text-xs sm:text-sm py-1">
            {/* Center Vertical Divider */}
            <div className="absolute top-0.5 bottom-0.5 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent" />

            {/* Left Column: PAC, SHO, PAS */}
            <div className="space-y-1 pr-1">
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
            <div className="space-y-1 pl-1">
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

          {/* Interactive In-Card Inspection HUD Tray */}
          <div className="relative z-10 mt-2 min-h-[50px]">
            {inspectedStat && inspectionDetails[inspectedStat] ? (
              <div className="bg-black/70 border border-white/20 rounded-lg p-2 animate-fadeIn transition-all">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 mb-1.5">
                  <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1">
                    <Info className="w-2.5 h-2.5" />
                    {inspectedStat} • {inspectionDetails[inspectedStat].title}
                  </span>
                  <span className="text-[8px] text-zinc-400">Ballchasing Real</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  {inspectionDetails[inspectedStat].items.map((it, idx) => (
                    <div key={idx} className="bg-white/5 rounded px-1 py-0.5 border border-white/5">
                      <span className="text-[7.5px] text-zinc-400 block truncate">{it.label}</span>
                      <span className="text-[10px] font-mono font-bold text-white block">{it.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Active Performance Perks */}
                {activePerks && activePerks.length > 0 ? (
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {activePerks.slice(0, 3).map((perk, i) => (
                      <span
                        key={i}
                        className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tight ${perk.color}`}
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

          {/* Card Footer: Clean, fully visible above shield bottom point */}
          <div className="relative z-10 mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
            <span>FORMA {matchCountDisplay} JOGOS</span>
            <span className="font-mono text-zinc-300">{editionRarity ? `${editionRarity} • RLCS` : 'CHAMPION I • PRO CARD'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});


