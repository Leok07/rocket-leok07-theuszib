export type RlRankThemeKey = 'diamond' | 'champion' | 'grand_champion' | 'ssl';

export interface RlRankCardTheme {
  key: RlRankThemeKey;
  rankTitle: string;
  divisionFallback: string;
  shieldBorderGradient: string;
  cardBg: string;
  auraColor: string;
  foilGlow: string;
  crestBg: string;
  crestBorder: string;
  ovrText: string;
  posText: string;
  accentGradient: string;
  nameplateBorder: string;
  statNumberColor: string;
  statLabelColor: string;
  footerBadgeBg: string;
  glowColorHex: string;
}

export const RANK_CARD_THEMES: Record<RlRankThemeKey, RlRankCardTheme> = {
  diamond: {
    key: 'diamond',
    rankTitle: 'DIAMOND',
    divisionFallback: 'DIV III',
    shieldBorderGradient: 'from-cyan-300 via-sky-500 to-blue-800',
    cardBg: 'from-[#0b182d] via-[#060e1b] to-[#040810]',
    auraColor: 'rgba(6, 182, 212, 0.45)',
    foilGlow: 'rgba(6, 182, 212, 0.35)',
    crestBg: 'from-cyan-950/80 via-[#071324]/90 to-black/90',
    crestBorder: 'border-cyan-500/40',
    ovrText: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400',
    posText: 'text-cyan-300',
    accentGradient: 'from-cyan-400 to-sky-600',
    nameplateBorder: 'border-cyan-500/30 bg-cyan-950/40',
    statNumberColor: 'text-cyan-100',
    statLabelColor: 'text-cyan-400/80',
    footerBadgeBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-200',
    glowColorHex: '#06b6d4',
  },
  champion: {
    key: 'champion',
    rankTitle: 'CHAMPION',
    divisionFallback: 'DIV II',
    shieldBorderGradient: 'from-purple-300 via-fuchsia-500 to-indigo-950',
    cardBg: 'from-[#190c2e] via-[#0f061c] to-[#07030e]',
    auraColor: 'rgba(168, 85, 247, 0.5)',
    foilGlow: 'rgba(168, 85, 247, 0.4)',
    crestBg: 'from-purple-950/80 via-[#130724]/90 to-black/90',
    crestBorder: 'border-purple-500/40',
    ovrText: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-400',
    posText: 'text-purple-300',
    accentGradient: 'from-purple-400 to-indigo-600',
    nameplateBorder: 'border-purple-500/30 bg-purple-950/40',
    statNumberColor: 'text-purple-100',
    statLabelColor: 'text-purple-400/80',
    footerBadgeBg: 'bg-purple-950/60 border-purple-500/30 text-purple-200',
    glowColorHex: '#a855f7',
  },
  grand_champion: {
    key: 'grand_champion',
    rankTitle: 'GRAND CHAMPION',
    divisionFallback: 'DIV I',
    shieldBorderGradient: 'from-rose-400 via-red-600 to-amber-800',
    cardBg: 'from-[#280c14] via-[#140408] to-[#090204]',
    auraColor: 'rgba(244, 63, 94, 0.55)',
    foilGlow: 'rgba(244, 63, 94, 0.45)',
    crestBg: 'from-rose-950/80 via-[#1a050a]/90 to-black/90',
    crestBorder: 'border-rose-500/40',
    ovrText: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-400',
    posText: 'text-rose-400',
    accentGradient: 'from-rose-400 to-amber-600',
    nameplateBorder: 'border-rose-500/30 bg-rose-950/40',
    statNumberColor: 'text-rose-100',
    statLabelColor: 'text-rose-400/80',
    footerBadgeBg: 'bg-rose-950/60 border-rose-500/30 text-rose-200',
    glowColorHex: '#f43f5e',
  },
  ssl: {
    key: 'ssl',
    rankTitle: 'SUPERSONIC LEGEND',
    divisionFallback: 'ELITE',
    shieldBorderGradient: 'from-white via-slate-200 to-indigo-400',
    cardBg: 'from-[#16182c] via-[#0a0d18] to-[#04050a]',
    auraColor: 'rgba(255, 255, 255, 0.6)',
    foilGlow: 'rgba(224, 231, 255, 0.5)',
    crestBg: 'from-indigo-950/80 via-[#0d1022]/90 to-black/90',
    crestBorder: 'border-indigo-400/50',
    ovrText: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-indigo-300',
    posText: 'text-slate-100',
    accentGradient: 'from-white to-indigo-400',
    nameplateBorder: 'border-indigo-400/40 bg-indigo-950/40',
    statNumberColor: 'text-white',
    statLabelColor: 'text-indigo-300/90',
    footerBadgeBg: 'bg-indigo-950/60 border-indigo-400/40 text-slate-100',
    glowColorHex: '#ffffff',
  },
};

export function resolveRankTheme(rankTierNumber?: number, rankName?: string): RlRankCardTheme {
  const tier = rankTierNumber || 16;
  const name = (rankName || '').toLowerCase();

  if (tier >= 22 || name.includes('supersonic') || name.includes('ssl')) {
    return RANK_CARD_THEMES.ssl;
  }
  if (tier >= 19 || name.includes('grand champion') || name.includes('gc')) {
    return RANK_CARD_THEMES.grand_champion;
  }
  if (tier >= 16 || name.includes('champion') || name.includes('campe')) {
    return RANK_CARD_THEMES.champion;
  }
  // Default to diamond for diamond ranks or any other
  return RANK_CARD_THEMES.diamond;
}
