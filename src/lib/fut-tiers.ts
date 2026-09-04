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
  nicknameBadge: string;
  accentGradient: string;
}

export const TIER_STYLES: Record<FutCardTier, TierStyleConfig> = {
  // 1. GOAT (Supremo Ouro Preto 24k)
  goat: {
    cardBg: 'from-[#1c160c] via-[#0a0703] to-[#241706]',
    outerBorder: 'border-[#f59e0b]',
    borderGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.45),inset_0_0_25px_rgba(245,158,11,0.15)]',
    innerBorder: 'border-[#fbbf24]/30',
    ovrText: 'text-[#fef08a] drop-shadow-[0_2px_12px_rgba(245,158,11,0.9)]',
    posText: 'text-[#fef9c3]',
    statLabel: 'text-[#fbbf24] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'G.O.A.T. SUPREMO',
    headerIconColor: 'text-amber-400',
    crestBorder: 'border-[#fbbf24]/80 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    crestBg: 'from-amber-950/70 via-stone-950/90 to-amber-950/70',
    nameplateBorder: 'border-[#fbbf24]/40 bg-gradient-to-r from-amber-950/50 via-stone-950/80 to-amber-950/50',
    nicknameBadge: 'bg-amber-950/80 border-amber-400/60 text-amber-300',
    accentGradient: 'from-amber-400 via-yellow-200 to-amber-500',
  },
  // 2. Icon TOTW (Lenda In-Form - Hibrida)
  icon_totw: {
    cardBg: 'from-[#0e1626] via-[#04060d] to-[#1a1740]',
    outerBorder: 'border-[#fde047]',
    borderGlow: 'shadow-[0_0_35px_rgba(250,204,21,0.45),inset_0_0_25px_rgba(255,255,255,0.15)]',
    innerBorder: 'border-[#fde047]/30',
    ovrText: 'text-white drop-shadow-[0_2px_12px_rgba(250,204,21,0.9)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-[#fde047] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'ICON TOTW IN-FORM',
    headerIconColor: 'text-yellow-300',
    crestBorder: 'border-[#fde047]/80 shadow-[0_0_20px_rgba(250,204,21,0.35)]',
    crestBg: 'from-slate-900/80 via-indigo-950/90 to-slate-900/80',
    nameplateBorder: 'border-[#fde047]/40 bg-gradient-to-r from-indigo-950/60 via-slate-950/80 to-indigo-950/60',
    nicknameBadge: 'bg-yellow-950/80 border-yellow-400/60 text-yellow-200',
    accentGradient: 'from-yellow-300 via-white to-yellow-400',
  },
  // 3. Icon Hero (Lenda Protagonista - Hibrida)
  icon_hero: {
    cardBg: 'from-[#2e0e3d] via-[#0c0417] to-[#1c0a2e]',
    outerBorder: 'border-[#e879f9]',
    borderGlow: 'shadow-[0_0_35px_rgba(232,121,249,0.45),inset_0_0_25px_rgba(251,191,36,0.15)]',
    innerBorder: 'border-[#e879f9]/30',
    ovrText: 'text-[#fae8ff] drop-shadow-[0_2px_12px_rgba(232,121,249,0.9)]',
    posText: 'text-[#f5d0fe]',
    statLabel: 'text-[#e879f9] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'ICON HERO SUPREMO',
    headerIconColor: 'text-fuchsia-300',
    crestBorder: 'border-[#e879f9]/80 shadow-[0_0_20px_rgba(232,121,249,0.35)]',
    crestBg: 'from-fuchsia-950/70 via-purple-950/90 to-amber-950/50',
    nameplateBorder: 'border-[#e879f9]/40 bg-gradient-to-r from-fuchsia-950/60 via-purple-950/80 to-fuchsia-950/60',
    nicknameBadge: 'bg-purple-950/80 border-fuchsia-400/60 text-fuchsia-200',
    accentGradient: 'from-fuchsia-400 via-amber-300 to-fuchsia-500',
  },
  // 4. Icon (Lendario Puro)
  icon: {
    cardBg: 'from-[#1e293b] via-[#090d14] to-[#17202e]',
    outerBorder: 'border-[#ffffff]',
    borderGlow: 'shadow-[0_0_30px_rgba(255,255,255,0.35),inset_0_0_20px_rgba(255,255,255,0.1)]',
    innerBorder: 'border-white/25',
    ovrText: 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]',
    posText: 'text-zinc-200',
    statLabel: 'text-zinc-300 font-black',
    statValue: 'text-white font-black',
    tierLabel: 'RLCS ICON LENDARIO',
    headerIconColor: 'text-zinc-100',
    crestBorder: 'border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)]',
    crestBg: 'from-slate-800/70 via-slate-950/90 to-slate-800/70',
    nameplateBorder: 'border-white/30 bg-gradient-to-r from-slate-900/70 via-slate-950/90 to-slate-900/70',
    nicknameBadge: 'bg-slate-800/80 border-white/40 text-white',
    accentGradient: 'from-slate-200 via-white to-slate-300',
  },
  // 5. TOTW Hero (Heroi em Chamas - Hibrida)
  totw_hero: {
    cardBg: 'from-[#1c0c29] via-[#07030d] to-[#160a24]',
    outerBorder: 'border-[#c084fc]',
    borderGlow: 'shadow-[0_0_30px_rgba(192,132,252,0.45),inset_0_0_20px_rgba(250,204,21,0.15)]',
    innerBorder: 'border-[#c084fc]/30',
    ovrText: 'text-[#f3e8ff] drop-shadow-[0_2px_10px_rgba(192,132,252,0.8)]',
    posText: 'text-[#e9d5ff]',
    statLabel: 'text-[#c084fc] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'HERO TOTW ON FIRE',
    headerIconColor: 'text-purple-300',
    crestBorder: 'border-[#c084fc]/80 shadow-[0_0_20px_rgba(192,132,252,0.35)]',
    crestBg: 'from-purple-950/70 via-stone-950/90 to-purple-950/70',
    nameplateBorder: 'border-[#c084fc]/40 bg-gradient-to-r from-purple-950/60 via-stone-950/80 to-purple-950/60',
    nicknameBadge: 'bg-purple-950/80 border-purple-400/60 text-purple-200',
    accentGradient: 'from-purple-400 via-amber-300 to-purple-500',
  },
  // 6. Hero (Heroi da Semana)
  hero: {
    cardBg: 'from-[#280c59] via-[#090317] to-[#180938]',
    outerBorder: 'border-[#a855f7]',
    borderGlow: 'shadow-[0_0_28px_rgba(168,85,247,0.4),inset_0_0_20px_rgba(168,85,247,0.1)]',
    innerBorder: 'border-[#a855f7]/30',
    ovrText: 'text-[#f3e8ff] drop-shadow-[0_2px_10px_rgba(168,85,247,0.8)]',
    posText: 'text-[#d8b4fe]',
    statLabel: 'text-[#c084fc] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'HEROI DA SEMANA',
    headerIconColor: 'text-purple-300',
    crestBorder: 'border-[#a855f7]/80 shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    crestBg: 'from-purple-950/70 via-indigo-950/90 to-purple-950/70',
    nameplateBorder: 'border-[#a855f7]/40 bg-gradient-to-r from-purple-950/60 via-indigo-950/80 to-purple-950/60',
    nicknameBadge: 'bg-purple-950/80 border-purple-400/50 text-purple-200',
    accentGradient: 'from-purple-500 via-fuchsia-300 to-purple-500',
  },
  // 7. TOTW (Team of the Week In-Form)
  totw: {
    cardBg: 'from-[#171309] via-[#070502] to-[#1a1408]',
    outerBorder: 'border-[#eab308]',
    borderGlow: 'shadow-[0_0_28px_rgba(234,179,8,0.4),inset_0_0_20px_rgba(234,179,8,0.1)]',
    innerBorder: 'border-[#eab308]/30',
    ovrText: 'text-[#fef08a] drop-shadow-[0_2px_10px_rgba(234,179,8,0.8)]',
    posText: 'text-[#fef08a]',
    statLabel: 'text-[#eab308] font-black',
    statValue: 'text-white font-black',
    tierLabel: 'TOTW IN-FORM',
    headerIconColor: 'text-yellow-400',
    crestBorder: 'border-[#eab308]/80 shadow-[0_0_20px_rgba(234,179,8,0.35)]',
    crestBg: 'from-yellow-950/70 via-stone-950/90 to-yellow-950/70',
    nameplateBorder: 'border-[#eab308]/40 bg-gradient-to-r from-yellow-950/60 via-stone-950/80 to-yellow-950/60',
    nicknameBadge: 'bg-yellow-950/80 border-yellow-400/50 text-yellow-200',
    accentGradient: 'from-yellow-400 via-amber-200 to-yellow-500',
  },
  // 8. Ouro Raro
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
    nicknameBadge: 'bg-amber-950/70 border-amber-400/40 text-amber-200',
    accentGradient: 'from-amber-400 via-yellow-200 to-amber-500',
  },
  // 9. Prata Rara
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
    nicknameBadge: 'bg-slate-900/70 border-slate-400/40 text-slate-200',
    accentGradient: 'from-slate-300 via-white to-slate-400',
  },
  // 10. Bronze
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
    nicknameBadge: 'bg-amber-950/60 border-amber-600/40 text-amber-300',
    accentGradient: 'from-amber-600 via-amber-400 to-amber-700',
  },
};
