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
export const MAX_TOTAL_OVR_BONUS = 2.5;

// Champion 1 (C1) Benchmarks for 5-minute normalized play (Calibrated for Competitive 2v2)
export const C1_BENCHMARKS = {
  pac: {
    speed: { min: 950, mid: 1220, max: 1380 },
    supersonic: { min: 1.0, mid: 4.0, max: 8.0 },
    boostSpeed: { min: 12.0, mid: 25.0, max: 38.0 },
    slowSpeed: { best: 45.0, mid: 60.0, worst: 75.0 },
  },
  sho: {
    goals5min: { min: 0.10, mid: 0.70, max: 1.50 },
    shots5min: { min: 0.30, mid: 1.80, max: 3.50 },
    accuracy: { min: 10.0, mid: 30.0, max: 48.0 },
  },
  pas: {
    assists5min: { min: 0.0, mid: 0.40, max: 0.95 },
    behindBall: { min: 30.0, mid: 48.0, max: 65.0 },
  },
  dri: {
    highAir: { min: 0.3, mid: 1.3, max: 2.8 },
    lowAir: { min: 18.0, mid: 30.0, max: 44.0 },
    powerslides5min: { min: 8.0, mid: 20.0, max: 38.0 },
  },
  def: {
    saves5min: { min: 0.20, mid: 1.20, max: 2.50 },
    behindBall: { min: 30.0, mid: 48.0, max: 65.0 },
  },
  phy: {
    smallPads5min: { min: 18.0, mid: 34.0, max: 52.0 },
    bpm: { min: 160, mid: 230, max: 310 },
    stolenBig5min: { min: 0.2, mid: 1.5, max: 3.8 },
    zeroBoostTime5min: { best: 3.0, mid: 9.0, worst: 20.0 },
  },
};

// Streak / Momentum multipliers
export const MOMENTUM_CONFIG = {
  maxStreakModifier: 3,
  streakStep: 1.0,
  winRateHighBonus: 1.5, // WR >= 70%
  winRateLowPenalty: 1.5, // WR <= 30%
};
