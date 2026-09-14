import { FutCardTier } from '@/types/dashboard';

export interface TierStyleConfig {
  cardBg: string;
  outerBorder: string;
  borderGlow: string;
  innerBorder: string;
  ovrText: string;
  posText: string;
  statLabel: string;
  statValue: string;
  tierLabel: string;
  headerIconColor: string;
  crestBorder: string;
  crestBg: string;
  nameplateBorder: string;
  editionBadge: string;
  accentGradient: string;
  foilGlow?: string;
  shieldBorderGradient?: string;
  auraColor?: string;
}

export const TIER_STYLES: Record<FutCardTier, TierStyleConfig> = {
  // 1. GOAT (Supremo Ouro Preto 24k)
  goat: {
    cardBg: 'from-[#1c160c] via-[#0a0703] to-[#241706]',
    outerBorder: 'border-[#f59e0b]',
    borderGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.5),inset_0_0_25px_rgba(245,158,11,0.2)]',
    innerBorder: 'border-[#fbbf24]/40',
    ovrText: 'text-[#fef08a] drop-shadow-[0_2px_12px_rgba(245,158,11,0.9)]',
    posText: 'text-[#fef9c3]',
    statLabel: 'text-[#fbbf24] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'G.O.A.T. SUPREMO',
    headerIconColor: 'text-amber-400',
    crestBorder: 'border-[#fbbf24]/80 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    crestBg: 'from-amber-950/70 via-stone-950/90 to-amber-950/70',
    nameplateBorder: 'border-[#fbbf24]/40 bg-gradient-to-r from-amber-950/50 via-stone-950/80 to-amber-950/50',
    editionBadge: 'bg-amber-950/90 border-amber-400/80 text-amber-200',
    accentGradient: 'from-amber-400 via-yellow-200 to-amber-500',
    foilGlow: 'rgba(245, 158, 11, 0.45)',
    shieldBorderGradient: 'from-[#fbbf24] via-[#fef08a] to-[#d97706]',
    auraColor: 'rgba(245, 158, 11, 0.35)',
  },

  // 2. ICON HYBRID (Icon Élite - Holográfico + Ouro Real)
  icon_hybrid: {
    cardBg: 'from-[#151c28] via-[#0b0f19] to-[#241b10]',
    outerBorder: 'border-[#fde047]',
    borderGlow: 'shadow-[0_0_35px_rgba(250,204,21,0.45),inset_0_0_20px_rgba(255,255,255,0.2)]',
    innerBorder: 'border-[#fde047]/40',
    ovrText: 'text-white drop-shadow-[0_2px_12px_rgba(250,204,21,0.9)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-[#fde047] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'ICON ÉLITE IN-FORM',
    headerIconColor: 'text-yellow-300',
    crestBorder: 'border-[#fde047]/80 shadow-[0_0_20px_rgba(250,204,21,0.35)]',
    crestBg: 'from-slate-900/80 via-indigo-950/90 to-slate-900/80',
    nameplateBorder: 'border-[#fde047]/40 bg-gradient-to-r from-indigo-950/60 via-slate-950/80 to-amber-950/60',
    editionBadge: 'bg-yellow-950/90 border-yellow-400/80 text-yellow-200',
    accentGradient: 'from-yellow-300 via-white to-yellow-400',
    foilGlow: 'rgba(250, 204, 21, 0.45)',
    shieldBorderGradient: 'from-[#fde047] via-[#ffffff] to-[#ca8a04]',
    auraColor: 'rgba(250, 204, 21, 0.3)',
  },

  // 3. ICON (RLCS Icon Lendário Puro)
  icon: {
    cardBg: 'from-[#1e293b] via-[#090d14] to-[#17202e]',
    outerBorder: 'border-[#ffffff]',
    borderGlow: 'shadow-[0_0_30px_rgba(255,255,255,0.35),inset_0_0_20px_rgba(255,255,255,0.12)]',
    innerBorder: 'border-white/30',
    ovrText: 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]',
    posText: 'text-zinc-200',
    statLabel: 'text-zinc-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'RLCS ICON LENDÁRIO',
    headerIconColor: 'text-zinc-100',
    crestBorder: 'border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)]',
    crestBg: 'from-slate-800/70 via-slate-950/90 to-slate-800/70',
    nameplateBorder: 'border-white/30 bg-gradient-to-r from-slate-900/70 via-slate-950/90 to-slate-900/70',
    editionBadge: 'bg-slate-800/90 border-white/50 text-white',
    accentGradient: 'from-slate-200 via-white to-slate-300',
    foilGlow: 'rgba(255, 255, 255, 0.4)',
    shieldBorderGradient: 'from-[#ffffff] via-[#cbd5e1] to-[#64748b]',
    auraColor: 'rgba(255, 255, 255, 0.25)',
  },

  // 4. TWO-WAY TITAN (Híbrido Striker + Guardian: Carmesim e Esmeralda Neon)
  two_way_titan: {
    cardBg: 'from-[#290a14] via-[#0a1210] to-[#0a2018]',
    outerBorder: 'border-emerald-400',
    borderGlow: 'shadow-[0_0_32px_rgba(52,211,153,0.4),0_0_16px_rgba(244,63,94,0.35)]',
    innerBorder: 'border-emerald-400/40',
    ovrText: 'text-[#a7f3d0] drop-shadow-[0_2px_10px_rgba(52,211,153,0.8)]',
    posText: 'text-[#fecdd3]',
    statLabel: 'text-emerald-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'TWO-WAY TITAN',
    headerIconColor: 'text-emerald-300',
    crestBorder: 'border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
    crestBg: 'from-rose-950/60 via-stone-950/90 to-emerald-950/60',
    nameplateBorder: 'border-emerald-400/40 bg-gradient-to-r from-rose-950/60 via-stone-950/80 to-emerald-950/60',
    editionBadge: 'bg-emerald-950/90 border-emerald-400/80 text-emerald-200',
    accentGradient: 'from-rose-400 via-white to-emerald-400',
    foilGlow: 'rgba(52, 211, 153, 0.4)',
    shieldBorderGradient: 'from-[#34d399] via-[#ffffff] to-[#f43f5e]',
    auraColor: 'rgba(52, 211, 153, 0.3)',
  },

  // 5. APEX PREDATOR (Híbrido Speedster + Enforcer: Violeta e Âmbar)
  apex_predator: {
    cardBg: 'from-[#200a2b] via-[#100714] to-[#2b1605]',
    outerBorder: 'border-orange-400',
    borderGlow: 'shadow-[0_0_32px_rgba(251,146,60,0.4),0_0_16px_rgba(168,85,247,0.35)]',
    innerBorder: 'border-orange-400/40',
    ovrText: 'text-[#fed7aa] drop-shadow-[0_2px_10px_rgba(251,146,60,0.8)]',
    posText: 'text-[#e9d5ff]',
    statLabel: 'text-orange-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'APEX PREDATOR',
    headerIconColor: 'text-orange-400',
    crestBorder: 'border-orange-400/80 shadow-[0_0_20px_rgba(251,146,60,0.35)]',
    crestBg: 'from-purple-950/60 via-stone-950/90 to-orange-950/60',
    nameplateBorder: 'border-orange-400/40 bg-gradient-to-r from-purple-950/60 via-stone-950/80 to-orange-950/60',
    editionBadge: 'bg-orange-950/90 border-orange-400/80 text-orange-200',
    accentGradient: 'from-purple-400 via-amber-300 to-orange-400',
    foilGlow: 'rgba(251, 146, 60, 0.4)',
    shieldBorderGradient: 'from-[#fb923c] via-[#f3e8ff] to-[#a855f7]',
    auraColor: 'rgba(251, 146, 60, 0.3)',
  },

  // 6. TOTW STRIKER (Híbrido TOTW + Striker: Ouro Imperial e Carmesim)
  totw_striker: {
    cardBg: 'from-[#241706] via-[#1a080c] to-[#2b0c16]',
    outerBorder: 'border-rose-400',
    borderGlow: 'shadow-[0_0_30px_rgba(244,63,94,0.45),inset_0_0_18px_rgba(234,179,8,0.2)]',
    innerBorder: 'border-rose-400/40',
    ovrText: 'text-[#ffe4e6] drop-shadow-[0_2px_10px_rgba(244,63,94,0.8)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-rose-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'TOTW STRIKER',
    headerIconColor: 'text-rose-400',
    crestBorder: 'border-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.35)]',
    crestBg: 'from-yellow-950/60 via-stone-950/90 to-rose-950/60',
    nameplateBorder: 'border-rose-400/40 bg-gradient-to-r from-yellow-950/60 via-stone-950/80 to-rose-950/60',
    editionBadge: 'bg-rose-950/90 border-rose-400/80 text-rose-200',
    accentGradient: 'from-yellow-400 via-rose-300 to-rose-500',
  },

  // 7. TOTW GUARDIAN (Híbrido TOTW + Guardian: Ouro Imperial e Esmeralda)
  totw_guardian: {
    cardBg: 'from-[#241706] via-[#0a1712] to-[#0b241b]',
    outerBorder: 'border-emerald-400',
    borderGlow: 'shadow-[0_0_30px_rgba(52,211,153,0.45),inset_0_0_18px_rgba(234,179,8,0.2)]',
    innerBorder: 'border-emerald-400/40',
    ovrText: 'text-[#d1fae5] drop-shadow-[0_2px_10px_rgba(52,211,153,0.8)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-emerald-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'TOTW GUARDIAN',
    headerIconColor: 'text-emerald-400',
    crestBorder: 'border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
    crestBg: 'from-yellow-950/60 via-stone-950/90 to-emerald-950/60',
    nameplateBorder: 'border-emerald-400/40 bg-gradient-to-r from-yellow-950/60 via-stone-950/80 to-emerald-950/60',
    editionBadge: 'bg-emerald-950/90 border-emerald-400/80 text-emerald-200',
    accentGradient: 'from-yellow-400 via-emerald-300 to-emerald-500',
  },

  // 8. TOTW PLAYMAKER (Híbrido TOTW + Playmaker: Ouro Imperial e Ciano)
  totw_playmaker: {
    cardBg: 'from-[#241706] via-[#071726] to-[#0a2233]',
    outerBorder: 'border-cyan-400',
    borderGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.45),inset_0_0_18px_rgba(234,179,8,0.2)]',
    innerBorder: 'border-cyan-400/40',
    ovrText: 'text-[#cffafe] drop-shadow-[0_2px_10px_rgba(6,182,212,0.8)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-cyan-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'TOTW PLAYMAKER',
    headerIconColor: 'text-cyan-400',
    crestBorder: 'border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    crestBg: 'from-yellow-950/60 via-stone-950/90 to-cyan-950/60',
    nameplateBorder: 'border-cyan-400/40 bg-gradient-to-r from-yellow-950/60 via-stone-950/80 to-cyan-950/60',
    editionBadge: 'bg-cyan-950/90 border-cyan-400/80 text-cyan-200',
    accentGradient: 'from-yellow-400 via-cyan-300 to-cyan-500',
  },

  // 9. TOTW (Team of the Week Clássico)
  totw: {
    cardBg: 'from-[#171309] via-[#070502] to-[#1a1408]',
    outerBorder: 'border-[#eab308]',
    borderGlow: 'shadow-[0_0_28px_rgba(234,179,8,0.4),inset_0_0_20px_rgba(234,179,8,0.12)]',
    innerBorder: 'border-[#eab308]/35',
    ovrText: 'text-[#fef08a] drop-shadow-[0_2px_10px_rgba(234,179,8,0.8)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-[#eab308] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'TOTW IN-FORM',
    headerIconColor: 'text-yellow-400',
    crestBorder: 'border-[#eab308]/80 shadow-[0_0_20px_rgba(234,179,8,0.35)]',
    crestBg: 'from-yellow-950/70 via-stone-950/90 to-yellow-950/70',
    nameplateBorder: 'border-[#eab308]/40 bg-gradient-to-r from-yellow-950/60 via-stone-950/80 to-yellow-950/60',
    editionBadge: 'bg-yellow-950/90 border-yellow-400/70 text-yellow-200',
    accentGradient: 'from-yellow-400 via-amber-200 to-yellow-500',
  },

  // 10. GUARDIAN (Especialista Defensivo: Esmeralda Profundo)
  guardian: {
    cardBg: 'from-[#071c14] via-[#030d0a] to-[#0a261c]',
    outerBorder: 'border-emerald-400',
    borderGlow: 'shadow-[0_0_26px_rgba(52,211,153,0.35),inset_0_0_18px_rgba(52,211,153,0.1)]',
    innerBorder: 'border-emerald-400/35',
    ovrText: 'text-[#d1fae5] drop-shadow-[0_2px_10px_rgba(52,211,153,0.8)]',
    posText: 'text-[#a7f3d0]',
    statLabel: 'text-emerald-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'GUARDIÃO DEFENSIVO',
    headerIconColor: 'text-emerald-400',
    crestBorder: 'border-emerald-400/80 shadow-[0_0_18px_rgba(52,211,153,0.3)]',
    crestBg: 'from-emerald-950/70 via-stone-950/90 to-emerald-950/70',
    nameplateBorder: 'border-emerald-400/40 bg-gradient-to-r from-emerald-950/60 via-stone-950/80 to-emerald-950/60',
    editionBadge: 'bg-emerald-950/90 border-emerald-400/70 text-emerald-200',
    accentGradient: 'from-emerald-400 via-teal-200 to-emerald-500',
  },

  // 11. STRIKER (Especialista em Gols: Carmesim e Rubi)
  striker: {
    cardBg: 'from-[#260810] via-[#0f0307] to-[#290a15]',
    outerBorder: 'border-rose-500',
    borderGlow: 'shadow-[0_0_26px_rgba(244,63,94,0.35),inset_0_0_18px_rgba(244,63,94,0.1)]',
    innerBorder: 'border-rose-500/35',
    ovrText: 'text-[#ffe4e6] drop-shadow-[0_2px_10px_rgba(244,63,94,0.8)]',
    posText: 'text-[#fecdd3]',
    statLabel: 'text-rose-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'ARTILHEIRO NATO',
    headerIconColor: 'text-rose-400',
    crestBorder: 'border-rose-500/80 shadow-[0_0_18px_rgba(244,63,94,0.3)]',
    crestBg: 'from-rose-950/70 via-stone-950/90 to-rose-950/70',
    nameplateBorder: 'border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-stone-950/80 to-rose-950/60',
    editionBadge: 'bg-rose-950/90 border-rose-400/70 text-rose-200',
    accentGradient: 'from-rose-400 via-red-200 to-rose-500',
  },

  // 12. PLAYMAKER (Especialista em Assistências: Ciano Elétrico)
  playmaker: {
    cardBg: 'from-[#071829] via-[#030a12] to-[#0a1e33]',
    outerBorder: 'border-cyan-400',
    borderGlow: 'shadow-[0_0_26px_rgba(6,182,212,0.35),inset_0_0_18px_rgba(6,182,212,0.1)]',
    innerBorder: 'border-cyan-400/35',
    ovrText: 'text-[#cffafe] drop-shadow-[0_2px_10px_rgba(6,182,212,0.8)]',
    posText: 'text-[#a5f3fc]',
    statLabel: 'text-cyan-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'MAESTRO CRIADOR',
    headerIconColor: 'text-cyan-400',
    crestBorder: 'border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.3)]',
    crestBg: 'from-cyan-950/70 via-stone-950/90 to-cyan-950/70',
    nameplateBorder: 'border-cyan-400/40 bg-gradient-to-r from-cyan-950/60 via-stone-950/80 to-cyan-950/60',
    editionBadge: 'bg-cyan-950/90 border-cyan-400/70 text-cyan-200',
    accentGradient: 'from-cyan-400 via-sky-200 to-cyan-500',
  },

  // 13. ENFORCER (Especialista Físico e Demolições: Âmbar Incandescente)
  enforcer: {
    cardBg: 'from-[#291307] via-[#120703] to-[#261005]',
    outerBorder: 'border-orange-500',
    borderGlow: 'shadow-[0_0_26px_rgba(249,115,22,0.35),inset_0_0_18px_rgba(249,115,22,0.1)]',
    innerBorder: 'border-orange-500/35',
    ovrText: 'text-[#ffedd5] drop-shadow-[0_2px_10px_rgba(249,115,22,0.8)]',
    posText: 'text-[#fed7aa]',
    statLabel: 'text-orange-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'DEMOLIDOR TÁTICO',
    headerIconColor: 'text-orange-400',
    crestBorder: 'border-orange-500/80 shadow-[0_0_18px_rgba(249,115,22,0.3)]',
    crestBg: 'from-orange-950/70 via-stone-950/90 to-orange-950/70',
    nameplateBorder: 'border-orange-500/40 bg-gradient-to-r from-orange-950/60 via-stone-950/80 to-orange-950/60',
    editionBadge: 'bg-orange-950/90 border-orange-400/70 text-orange-200',
    accentGradient: 'from-orange-400 via-amber-200 to-orange-500',
  },

  // 14. SPEEDSTER (Especialista em Ritmo e Rotação: Violeta Elétrico)
  speedster: {
    cardBg: 'from-[#101033] via-[#06061a] to-[#1c0c38]',
    outerBorder: 'border-indigo-400',
    borderGlow: 'shadow-[0_0_26px_rgba(129,140,248,0.35),inset_0_0_18px_rgba(129,140,248,0.1)]',
    innerBorder: 'border-indigo-400/35',
    ovrText: 'text-[#e0e7ff] drop-shadow-[0_2px_10px_rgba(129,140,248,0.8)]',
    posText: 'text-[#c7d2fe]',
    statLabel: 'text-indigo-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'VELOZ SUPERSÔNICO',
    headerIconColor: 'text-indigo-400',
    crestBorder: 'border-indigo-400/80 shadow-[0_0_18px_rgba(129,140,248,0.3)]',
    crestBg: 'from-indigo-950/70 via-stone-950/90 to-indigo-950/70',
    nameplateBorder: 'border-indigo-400/40 bg-gradient-to-r from-indigo-950/60 via-stone-950/80 to-indigo-950/60',
    editionBadge: 'bg-indigo-950/90 border-indigo-400/70 text-indigo-200',
    accentGradient: 'from-indigo-400 via-violet-200 to-indigo-500',
  },

  // 15. DIAMOND (Diamante Raro 86 - 90 OVR)
  diamond: {
    cardBg: 'from-[#0b1c2e] via-[#050f1c] to-[#0e273d]',
    outerBorder: 'border-cyan-300',
    borderGlow: 'shadow-[0_0_26px_rgba(103,232,249,0.35),inset_0_0_18px_rgba(103,232,249,0.1)]',
    innerBorder: 'border-cyan-300/30',
    ovrText: 'text-[#e0f2fe] drop-shadow-[0_2px_10px_rgba(103,232,249,0.8)]',
    posText: 'text-[#bae6fd]',
    statLabel: 'text-cyan-200 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'DIAMANTE RARO',
    headerIconColor: 'text-cyan-300',
    crestBorder: 'border-cyan-300/80 shadow-[0_0_18px_rgba(103,232,249,0.3)]',
    crestBg: 'from-cyan-950/70 via-stone-950/90 to-cyan-950/70',
    nameplateBorder: 'border-cyan-300/40 bg-gradient-to-r from-cyan-950/60 via-stone-950/80 to-cyan-950/60',
    editionBadge: 'bg-cyan-950/90 border-cyan-300/70 text-cyan-100',
    accentGradient: 'from-cyan-300 via-sky-100 to-cyan-400',
    foilGlow: 'rgba(103, 232, 249, 0.35)',
    shieldBorderGradient: 'from-[#67e8f9] via-[#e0f2fe] to-[#0284c7]',
    auraColor: 'rgba(103, 232, 249, 0.28)',
  },

  // 16. GOLD (Ouro Raro 76 - 85 OVR)
  gold: {
    cardBg: 'from-[#2e1d05] via-[#0f0a02] to-[#241503]',
    outerBorder: 'border-[#f59e0b]',
    borderGlow: 'shadow-[0_0_24px_rgba(245,158,11,0.35),inset_0_0_18px_rgba(245,158,11,0.08)]',
    innerBorder: 'border-[#f59e0b]/25',
    ovrText: 'text-[#fde68a] drop-shadow-[0_2px_8px_rgba(245,158,11,0.7)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-[#fbbf24] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'OURO RARO',
    headerIconColor: 'text-amber-400',
    crestBorder: 'border-[#f59e0b]/70 shadow-[0_0_18px_rgba(245,158,11,0.3)]',
    crestBg: 'from-amber-950/60 via-stone-950/90 to-amber-950/60',
    nameplateBorder: 'border-[#f59e0b]/35 bg-gradient-to-r from-amber-950/50 via-stone-950/80 to-amber-950/50',
    editionBadge: 'bg-amber-950/70 border-amber-400/40 text-amber-200',
    accentGradient: 'from-amber-400 via-yellow-200 to-amber-500',
    foilGlow: 'rgba(245, 158, 11, 0.3)',
    shieldBorderGradient: 'from-[#f59e0b] via-[#fef3c7] to-[#b45309]',
    auraColor: 'rgba(245, 158, 11, 0.25)',
  },

  // 17. SILVER (Prata Rara 65 - 75 OVR)
  silver: {
    cardBg: 'from-[#1a2130] via-[#090d14] to-[#141b26]',
    outerBorder: 'border-[#94a3b8]',
    borderGlow: 'shadow-[0_0_20px_rgba(148,163,184,0.3),inset_0_0_15px_rgba(148,163,184,0.08)]',
    innerBorder: 'border-[#94a3b8]/25',
    ovrText: 'text-[#e2e8f0] drop-shadow-[0_2px_8px_rgba(148,163,184,0.6)]',
    posText: 'text-[#cbd5e1]',
    statLabel: 'text-[#94a3b8] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'PRATA RARA',
    headerIconColor: 'text-slate-300',
    crestBorder: 'border-[#94a3b8]/70 shadow-[0_0_18px_rgba(148,163,184,0.25)]',
    crestBg: 'from-slate-900/60 via-stone-950/90 to-slate-900/60',
    nameplateBorder: 'border-[#94a3b8]/30 bg-gradient-to-r from-slate-900/50 via-stone-950/80 to-slate-900/50',
    editionBadge: 'bg-slate-900/70 border-slate-400/40 text-slate-200',
    accentGradient: 'from-slate-300 via-white to-slate-400',
    foilGlow: 'rgba(148, 163, 184, 0.25)',
    shieldBorderGradient: 'from-[#94a3b8] via-[#f1f5f9] to-[#475569]',
    auraColor: 'rgba(148, 163, 184, 0.2)',
  },

  // 18. BRONZE (Bronze < 65 OVR)
  bronze: {
    cardBg: 'from-[#221209] via-[#0d0603] to-[#1a0c06]',
    outerBorder: 'border-[#b45309]',
    borderGlow: 'shadow-[0_0_16px_rgba(180,83,9,0.25),inset_0_0_12px_rgba(180,83,9,0.06)]',
    innerBorder: 'border-[#b45309]/20',
    ovrText: 'text-[#fed7aa] drop-shadow-[0_2px_6px_rgba(180,83,9,0.5)]',
    posText: 'text-[#fed7aa]',
    statLabel: 'text-[#d97706] font-black',
    statValue: 'text-zinc-200 font-black',
    tierLabel: 'BRONZE',
    headerIconColor: 'text-amber-500',
    crestBorder: 'border-[#b45309]/60 shadow-[0_0_15px_rgba(180,83,9,0.2)]',
    crestBg: 'from-amber-950/50 via-stone-950/90 to-amber-950/50',
    nameplateBorder: 'border-[#b45309]/25 bg-gradient-to-r from-amber-950/40 via-stone-950/80 to-amber-950/40',
    editionBadge: 'bg-amber-950/60 border-amber-600/40 text-amber-300',
    accentGradient: 'from-amber-600 via-amber-400 to-amber-700',
    foilGlow: 'rgba(180, 83, 9, 0.2)',
    shieldBorderGradient: 'from-[#b45309] via-[#fed7aa] to-[#78350f]',
    auraColor: 'rgba(180, 83, 9, 0.15)',
  },
};
