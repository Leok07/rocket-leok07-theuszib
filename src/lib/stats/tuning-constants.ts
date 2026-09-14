// Tuning constants for Tracker Rocket League (v1.4.0)

// Unified, Position-Agnostic OVR Weights
// Distributed fairly: SHO 33%, DEF 33%, PAS 17%, PAC 7%, DRI 5%, PHY 5%
export const UNIFIED_OVR_WEIGHTS = {
  sho: 0.33, // 33% Finalizacao / Chute
  def: 0.33, // 33% Defesa & Contencao
  pas: 0.17, // 17% Passe & Visao de Jogo
  pac: 0.07, // 7% Ritmo & Rotacao
  dri: 0.05, // 5% Mecanica & Drible
  phy: 0.05, // 5% Fisico & Boost
};

// Backwards-compatible alias
export const OVR_WEIGHTS = {
  ATA: UNIFIED_OVR_WEIGHTS,
  DEF: UNIFIED_OVR_WEIGHTS,
};

// Dominance Split for Purely Visual Position Identification (ATA vs DEF)
export const DOMINANCE_WEIGHTS = {
  cardAtk: { sho: 0.50, dri: 0.10, pac: 0.10 },
  matchAtk: { goalsPerMatch: 30, shotsPerMatch: 10, offensiveThirdPct: 0.4 },
  cardDef: { def: 0.50, phy: 0.10 },
  matchDef: { savesPerMatch: 25, mostBackPct: 0.5, defensiveThirdPct: 0.4 },
};

// Direct match performance bonus limits and multipliers
export const MVP_BONUS = {
  maxBonus: 1.0,
  multiplier: 2.5,
};

// Score Performance Bonus (based on average points in match)
export const SCORE_BONUS = {
  baseline: 340,
  divisor: 160,
  maxBonus: 0.8,
};

// Win Rate Performance Bonus
export const WIN_BONUS = {
  highThreshold: 60,
  highBonus: 0.7,
  midThreshold: 45,
  midBonus: 0.4,
};

// Passing / Playmaker direct bonus to OVR
export const PASSING_BONUS_CONFIG = {
  assistMultiplier: 0.8,
  maxBonus: 0.6,
};

// Maximum total bonus that can be added to the base OVR across all direct match bonuses
export const MAX_TOTAL_OVR_BONUS = 3.0;

// Grand Champion 3 (GC3) Benchmarks for 5-minute normalized play
// Calibrated so that an elite GC3 (1850+ MMR) achieves 99 OVR
// Champion 1 (1075 MMR) naturally sits at 84 - 88 OVR base (reaching 89-93 on hot streaks)
export const GC3_BENCHMARKS = {
  pac: {
    speed: { min: 1050, mid: 1300, max: 1460 },
    supersonic: { min: 2.0, mid: 7.5, max: 16.0 },
    boostSpeed: { min: 15.0, mid: 28.0, max: 45.0 },
    slowSpeed: { best: 36.0, mid: 52.0, worst: 70.0 },
  },
  sho: {
    goals5min: { min: 0.15, mid: 0.90, max: 1.80 },
    shots5min: { min: 0.70, mid: 2.40, max: 4.50 },
    accuracy: { min: 15.0, mid: 36.0, max: 54.0 },
  },
  pas: {
    assists5min: { min: 0.10, mid: 0.55, max: 1.25 },
    behindBall: { min: 32.0, mid: 50.0, max: 68.0 },
  },
  dri: {
    highAir: { min: 0.4, mid: 2.0, max: 4.5 },
    lowAir: { min: 20.0, mid: 34.0, max: 48.0 },
    powerslides5min: { min: 10.0, mid: 26.0, max: 50.0 },
  },
  def: {
    saves5min: { min: 0.25, mid: 1.30, max: 2.70 },
    behindBall: { min: 32.0, mid: 50.0, max: 68.0 },
  },
  phy: {
    smallPads5min: { min: 20.0, mid: 38.0, max: 62.0 },
    bpm: { min: 180, mid: 290, max: 410 },
    stolenBig5min: { min: 0.3, mid: 1.8, max: 4.5 },
    zeroBoostTime5min: { best: 2.0, mid: 7.0, worst: 16.0 },
  },
};

// Backwards compatibility alias
export const C1_BENCHMARKS = GC3_BENCHMARKS;

// Modifiers / Perks thresholds (accessible across all skill levels)
export const MODIFIER_THRESHOLDS = {
  totw: {
    minWinStreak: 3,
    minWinRate: 70,
    minMvps: 2,
  },
  guardian: {
    minSavesPerMatch: 1.8,
    minDefScore: 84,
  },
  striker: {
    minGoalsPerMatch: 1.3,
    minAccuracy: 40.0,
    minShoScore: 84,
  },
  playmaker: {
    minAssistsPerMatch: 0.7,
    minPasScore: 82,
  },
  enforcer: {
    minDemosPerMatch: 1.2,
    minBpm: 300,
  },
  speedster: {
    minSupersonicPct: 7.5,
    minSpeed: 1280,
  },
  goat: {
    minOvr: 94,
    mvpStreak: 3,
  },
};

// Streak / Momentum multipliers
export const MOMENTUM_CONFIG = {
  maxStreakModifier: 3,
  streakStep: 1.0,
  winRateHighBonus: 1.5, // WR >= 70%
  winRateLowPenalty: 1.5, // WR <= 30%
};
