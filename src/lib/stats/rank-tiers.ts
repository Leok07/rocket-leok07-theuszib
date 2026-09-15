export interface RankTierInfo {
  tierNumber: number;
  name: string;
  tierName: string;
  divisionName: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface MmrThreshold {
  name: string;
  tier: string;
  division: number;
  mmr: number;
  isMajor: boolean;
  color: string;
}

// Complete Official 2v2 Competitive MMR Brackets (Valid for Seasons 10+)
export const OFFICIAL_2V2_RANK_THRESHOLDS: MmrThreshold[] = [
  // Bronze
  { name: 'Bronze I Div 1', tier: 'Bronze I', division: 1, mmr: 0, isMajor: true, color: '#cd7f32' },
  { name: 'Bronze I Div 2', tier: 'Bronze I', division: 2, mmr: 60, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze I Div 3', tier: 'Bronze I', division: 3, mmr: 100, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze I Div 4', tier: 'Bronze I', division: 4, mmr: 140, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze II Div 1', tier: 'Bronze II', division: 1, mmr: 175, isMajor: true, color: '#cd7f32' },
  { name: 'Bronze II Div 2', tier: 'Bronze II', division: 2, mmr: 195, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze II Div 3', tier: 'Bronze II', division: 3, mmr: 215, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze II Div 4', tier: 'Bronze II', division: 4, mmr: 235, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze III Div 1', tier: 'Bronze III', division: 1, mmr: 255, isMajor: true, color: '#cd7f32' },
  { name: 'Bronze III Div 2', tier: 'Bronze III', division: 2, mmr: 275, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze III Div 3', tier: 'Bronze III', division: 3, mmr: 295, isMajor: false, color: '#cd7f32' },
  { name: 'Bronze III Div 4', tier: 'Bronze III', division: 4, mmr: 315, isMajor: false, color: '#cd7f32' },

  // Silver
  { name: 'Prata I Div 1', tier: 'Prata I', division: 1, mmr: 335, isMajor: true, color: '#94a3b8' },
  { name: 'Prata I Div 2', tier: 'Prata I', division: 2, mmr: 355, isMajor: false, color: '#94a3b8' },
  { name: 'Prata I Div 3', tier: 'Prata I', division: 3, mmr: 375, isMajor: false, color: '#94a3b8' },
  { name: 'Prata I Div 4', tier: 'Prata I', division: 4, mmr: 395, isMajor: false, color: '#94a3b8' },
  { name: 'Prata II Div 1', tier: 'Prata II', division: 1, mmr: 415, isMajor: true, color: '#94a3b8' },
  { name: 'Prata II Div 2', tier: 'Prata II', division: 2, mmr: 435, isMajor: false, color: '#94a3b8' },
  { name: 'Prata II Div 3', tier: 'Prata II', division: 3, mmr: 455, isMajor: false, color: '#94a3b8' },
  { name: 'Prata II Div 4', tier: 'Prata II', division: 4, mmr: 475, isMajor: false, color: '#94a3b8' },
  { name: 'Prata III Div 1', tier: 'Prata III', division: 1, mmr: 495, isMajor: true, color: '#94a3b8' },
  { name: 'Prata III Div 2', tier: 'Prata III', division: 2, mmr: 515, isMajor: false, color: '#94a3b8' },
  { name: 'Prata III Div 3', tier: 'Prata III', division: 3, mmr: 535, isMajor: false, color: '#94a3b8' },
  { name: 'Prata III Div 4', tier: 'Prata III', division: 4, mmr: 555, isMajor: false, color: '#94a3b8' },

  // Gold
  { name: 'Ouro I Div 1', tier: 'Ouro I', division: 1, mmr: 575, isMajor: true, color: '#eab308' },
  { name: 'Ouro I Div 2', tier: 'Ouro I', division: 2, mmr: 595, isMajor: false, color: '#eab308' },
  { name: 'Ouro I Div 3', tier: 'Ouro I', division: 3, mmr: 615, isMajor: false, color: '#eab308' },
  { name: 'Ouro I Div 4', tier: 'Ouro I', division: 4, mmr: 635, isMajor: false, color: '#eab308' },
  { name: 'Ouro II Div 1', tier: 'Ouro II', division: 1, mmr: 655, isMajor: true, color: '#eab308' },
  { name: 'Ouro II Div 2', tier: 'Ouro II', division: 2, mmr: 675, isMajor: false, color: '#eab308' },
  { name: 'Ouro II Div 3', tier: 'Ouro II', division: 3, mmr: 695, isMajor: false, color: '#eab308' },
  { name: 'Ouro II Div 4', tier: 'Ouro II', division: 4, mmr: 715, isMajor: false, color: '#eab308' },
  { name: 'Ouro III Div 1', tier: 'Ouro III', division: 1, mmr: 735, isMajor: true, color: '#eab308' },
  { name: 'Ouro III Div 2', tier: 'Ouro III', division: 2, mmr: 755, isMajor: false, color: '#eab308' },
  { name: 'Ouro III Div 3', tier: 'Ouro III', division: 3, mmr: 775, isMajor: false, color: '#eab308' },
  { name: 'Ouro III Div 4', tier: 'Ouro III', division: 4, mmr: 795, isMajor: false, color: '#eab308' },

  // Platinum
  { name: 'Platina I Div 1', tier: 'Platina I', division: 1, mmr: 815, isMajor: true, color: '#38bdf8' },
  { name: 'Platina I Div 2', tier: 'Platina I', division: 2, mmr: 835, isMajor: false, color: '#38bdf8' },
  { name: 'Platina I Div 3', tier: 'Platina I', division: 3, mmr: 855, isMajor: false, color: '#38bdf8' },
  { name: 'Platina I Div 4', tier: 'Platina I', division: 4, mmr: 875, isMajor: false, color: '#38bdf8' },
  { name: 'Platina II Div 1', tier: 'Platina II', division: 1, mmr: 895, isMajor: true, color: '#38bdf8' },
  { name: 'Platina II Div 2', tier: 'Platina II', division: 2, mmr: 915, isMajor: false, color: '#38bdf8' },
  { name: 'Platina II Div 3', tier: 'Platina II', division: 3, mmr: 935, isMajor: false, color: '#38bdf8' },
  { name: 'Platina II Div 4', tier: 'Platina II', division: 4, mmr: 955, isMajor: false, color: '#38bdf8' },
  { name: 'Platina III Div 1', tier: 'Platina III', division: 1, mmr: 975, isMajor: true, color: '#38bdf8' },
  { name: 'Platina III Div 2', tier: 'Platina III', division: 2, mmr: 995, isMajor: false, color: '#38bdf8' },
  { name: 'Platina III Div 3', tier: 'Platina III', division: 3, mmr: 1015, isMajor: false, color: '#38bdf8' },
  { name: 'Platina III Div 4', tier: 'Platina III', division: 4, mmr: 1035, isMajor: false, color: '#38bdf8' },

  // Diamond
  { name: 'Diamante I Div 1', tier: 'Diamante I', division: 1, mmr: 835, isMajor: true, color: '#06b6d4' },
  { name: 'Diamante I Div 2', tier: 'Diamante I', division: 2, mmr: 855, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante I Div 3', tier: 'Diamante I', division: 3, mmr: 875, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante I Div 4', tier: 'Diamante I', division: 4, mmr: 895, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante II Div 1', tier: 'Diamante II', division: 1, mmr: 915, isMajor: true, color: '#06b6d4' },
  { name: 'Diamante II Div 2', tier: 'Diamante II', division: 2, mmr: 935, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante II Div 3', tier: 'Diamante II', division: 3, mmr: 955, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante II Div 4', tier: 'Diamante II', division: 4, mmr: 975, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante III Div 1', tier: 'Diamante III', division: 1, mmr: 995, isMajor: true, color: '#06b6d4' },
  { name: 'Diamante III Div 2', tier: 'Diamante III', division: 2, mmr: 1015, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante III Div 3', tier: 'Diamante III', division: 3, mmr: 1035, isMajor: false, color: '#06b6d4' },
  { name: 'Diamante III Div 4', tier: 'Diamante III', division: 4, mmr: 1055, isMajor: false, color: '#06b6d4' },

  // Champion
  { name: 'Campeao I Div 1', tier: 'Campeao I', division: 1, mmr: 1075, isMajor: true, color: '#a855f7' },
  { name: 'Campeao I Div 2', tier: 'Campeao I', division: 2, mmr: 1111, isMajor: false, color: '#a855f7' },
  { name: 'Campeao I Div 3', tier: 'Campeao I', division: 3, mmr: 1146, isMajor: false, color: '#a855f7' },
  { name: 'Campeao I Div 4', tier: 'Campeao I', division: 4, mmr: 1181, isMajor: false, color: '#a855f7' },
  { name: 'Campeao II Div 1', tier: 'Campeao II', division: 1, mmr: 1216, isMajor: true, color: '#a855f7' },
  { name: 'Campeao II Div 2', tier: 'Campeao II', division: 2, mmr: 1256, isMajor: false, color: '#a855f7' },
  { name: 'Campeao II Div 3', tier: 'Campeao II', division: 3, mmr: 1296, isMajor: false, color: '#a855f7' },
  { name: 'Campeao II Div 4', tier: 'Campeao II', division: 4, mmr: 1336, isMajor: false, color: '#a855f7' },
  { name: 'Campeao III Div 1', tier: 'Campeao III', division: 1, mmr: 1376, isMajor: true, color: '#a855f7' },
  { name: 'Campeao III Div 2', tier: 'Campeao III', division: 2, mmr: 1416, isMajor: false, color: '#a855f7' },
  { name: 'Campeao III Div 3', tier: 'Campeao III', division: 3, mmr: 1456, isMajor: false, color: '#a855f7' },
  { name: 'Campeao III Div 4', tier: 'Campeao III', division: 4, mmr: 1496, isMajor: false, color: '#a855f7' },

  // Grand Champion
  { name: 'Grand Champion I Div 1', tier: 'Grand Champion I', division: 1, mmr: 1536, isMajor: true, color: '#f43f5e' },
  { name: 'Grand Champion I Div 2', tier: 'Grand Champion I', division: 2, mmr: 1576, isMajor: false, color: '#f43f5e' },
  { name: 'Grand Champion I Div 3', tier: 'Grand Champion I', division: 3, mmr: 1616, isMajor: false, color: '#f43f5e' },
  { name: 'Grand Champion I Div 4', tier: 'Grand Champion I', division: 4, mmr: 1656, isMajor: false, color: '#f43f5e' },
  { name: 'Grand Champion II Div 1', tier: 'Grand Champion II', division: 1, mmr: 1696, isMajor: true, color: '#f43f5e' },
  { name: 'Grand Champion II Div 2', tier: 'Grand Champion II', division: 2, mmr: 1736, isMajor: false, color: '#f43f5e' },
  { name: 'Grand Champion II Div 3', tier: 'Grand Champion II', division: 3, mmr: 1776, isMajor: false, color: '#f43f5e' },
  { name: 'Grand Champion II Div 4', tier: 'Grand Champion II', division: 4, mmr: 1816, isMajor: false, color: '#f43f5e' },
  { name: 'Grand Champion III Div 1', tier: 'Grand Champion III', division: 1, mmr: 1856, isMajor: true, color: '#f43f5e' },

  // Supersonic Legend
  { name: 'Supersonic Legend', tier: 'Supersonic Legend', division: 1, mmr: 1900, isMajor: true, color: '#f8fafc' },
];

const TIER_NAMES: Record<number, { tierName: string; color: string; bgColor: string; borderColor: string }> = {
  0: { tierName: 'Sem Rank', color: 'text-zinc-400', bgColor: 'bg-zinc-800/60', borderColor: 'border-zinc-700/60' },
  1: { tierName: 'Bronze I', color: 'text-amber-700', bgColor: 'bg-amber-950/50', borderColor: 'border-amber-900/60' },
  2: { tierName: 'Bronze II', color: 'text-amber-700', bgColor: 'bg-amber-950/50', borderColor: 'border-amber-900/60' },
  3: { tierName: 'Bronze III', color: 'text-amber-700', bgColor: 'bg-amber-950/50', borderColor: 'border-amber-900/60' },
  4: { tierName: 'Prata I', color: 'text-slate-300', bgColor: 'bg-slate-900/50', borderColor: 'border-slate-700/60' },
  5: { tierName: 'Prata II', color: 'text-slate-300', bgColor: 'bg-slate-900/50', borderColor: 'border-slate-700/60' },
  6: { tierName: 'Prata III', color: 'text-slate-300', bgColor: 'bg-slate-900/50', borderColor: 'border-slate-700/60' },
  7: { tierName: 'Ouro I', color: 'text-yellow-400', bgColor: 'bg-yellow-950/50', borderColor: 'border-yellow-800/60' },
  8: { tierName: 'Ouro II', color: 'text-yellow-400', bgColor: 'bg-yellow-950/50', borderColor: 'border-yellow-800/60' },
  9: { tierName: 'Ouro III', color: 'text-yellow-400', bgColor: 'bg-yellow-950/50', borderColor: 'border-yellow-800/60' },
  10: { tierName: 'Platina I', color: 'text-sky-300', bgColor: 'bg-sky-950/50', borderColor: 'border-sky-800/60' },
  11: { tierName: 'Platina II', color: 'text-sky-300', bgColor: 'bg-sky-950/50', borderColor: 'border-sky-800/60' },
  12: { tierName: 'Platina III', color: 'text-sky-300', bgColor: 'bg-sky-950/50', borderColor: 'border-sky-800/60' },
  13: { tierName: 'Diamante I', color: 'text-cyan-400', bgColor: 'bg-cyan-950/50', borderColor: 'border-cyan-800/60' },
  14: { tierName: 'Diamante II', color: 'text-cyan-400', bgColor: 'bg-cyan-950/50', borderColor: 'border-cyan-800/60' },
  15: { tierName: 'Diamante III', color: 'text-cyan-400', bgColor: 'bg-cyan-950/50', borderColor: 'border-cyan-800/60' },
  16: { tierName: 'Campeao I', color: 'text-purple-400', bgColor: 'bg-purple-950/50', borderColor: 'border-purple-800/60' },
  17: { tierName: 'Campeao II', color: 'text-purple-400', bgColor: 'bg-purple-950/50', borderColor: 'border-purple-800/60' },
  18: { tierName: 'Campeao III', color: 'text-purple-400', bgColor: 'bg-purple-950/50', borderColor: 'border-purple-800/60' },
  19: { tierName: 'Grand Champion I', color: 'text-rose-400', bgColor: 'bg-rose-950/50', borderColor: 'border-rose-800/60' },
  20: { tierName: 'Grand Champion II', color: 'text-rose-400', bgColor: 'bg-rose-950/50', borderColor: 'border-rose-800/60' },
  21: { tierName: 'Grand Champion III', color: 'text-rose-400', bgColor: 'bg-rose-950/50', borderColor: 'border-rose-800/60' },
  22: { tierName: 'Supersonic Legend', color: 'text-white', bgColor: 'bg-indigo-950/60', borderColor: 'border-indigo-500/70' },
};

export function getBallchasingTierLabel(
  tier?: number,
  division?: number,
  rawName?: string
): RankTierInfo | null {
  if (rawName && rawName.trim().length > 0) {
    const foundTier = Object.entries(TIER_NAMES).find(([_, info]) =>
      rawName.toLowerCase().includes(info.tierName.toLowerCase())
    );
    const colorConfig = foundTier ? foundTier[1] : TIER_NAMES[0];
    const divLabel = division !== undefined && division !== null ? `Div ${division + (division === 0 ? 1 : 0)}` : '';

    return {
      tierNumber: tier ?? (foundTier ? Number(foundTier[0]) : 0),
      name: rawName,
      tierName: foundTier ? foundTier[1].tierName : rawName,
      divisionName: divLabel,
      color: colorConfig.color,
      bgColor: colorConfig.bgColor,
      borderColor: colorConfig.borderColor,
    };
  }

  if (tier === undefined || tier === null || tier === 0) {
    return null;
  }

  const meta = TIER_NAMES[tier] || TIER_NAMES[0];
  const divNumber = division !== undefined && division !== null ? (division <= 3 ? division + 1 : division) : 1;
  const divLabel = `Div ${divNumber}`;
  const fullName = tier === 22 ? meta.tierName : `${meta.tierName} ${divLabel}`;

  return {
    tierNumber: tier,
    name: fullName,
    tierName: meta.tierName,
    divisionName: divLabel,
    color: meta.color,
    bgColor: meta.bgColor,
    borderColor: meta.borderColor,
  };
}

export function getRankDetailsFromMmr(mmr: number) {
  const safeMmr = Math.max(0, Math.round(mmr));
  let currentRank = OFFICIAL_2V2_RANK_THRESHOLDS[0];
  let nextRank = OFFICIAL_2V2_RANK_THRESHOLDS[1];

  for (let i = 0; i < OFFICIAL_2V2_RANK_THRESHOLDS.length; i++) {
    if (safeMmr >= OFFICIAL_2V2_RANK_THRESHOLDS[i].mmr) {
      currentRank = OFFICIAL_2V2_RANK_THRESHOLDS[i];
      nextRank = OFFICIAL_2V2_RANK_THRESHOLDS[i + 1] || OFFICIAL_2V2_RANK_THRESHOLDS[i];
    }
  }

  const nextMajorRank = OFFICIAL_2V2_RANK_THRESHOLDS.find((r) => r.isMajor && r.mmr > safeMmr) || nextRank;

  const pointsToNextDiv = Math.max(0, nextRank.mmr - safeMmr);
  const pointsToNextMajor = Math.max(0, nextMajorRank.mmr - safeMmr);

  const currentDivBase = currentRank.mmr;
  const nextDivBase = nextRank.mmr;
  const divRange = Math.max(1, nextDivBase - currentDivBase);
  const divProgress = Math.min(100, Math.max(0, ((safeMmr - currentDivBase) / divRange) * 100));

  const prevRankIndex = OFFICIAL_2V2_RANK_THRESHOLDS.findIndex((r) => r.name === currentRank.name) - 1;
  const prevRank = prevRankIndex >= 0 ? OFFICIAL_2V2_RANK_THRESHOLDS[prevRankIndex] : null;
  const demotionBuffer = prevRank ? Math.max(0, safeMmr - currentDivBase) : safeMmr;

  return {
    currentRank,
    nextRank,
    nextMajorRank,
    prevRank,
    pointsToNextDiv,
    pointsToNextMajor,
    divProgress,
    demotionBuffer,
  };
}
