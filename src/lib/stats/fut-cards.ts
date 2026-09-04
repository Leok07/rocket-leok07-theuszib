import {
  SessionCoreSummary,
  SessionPositioningSummary,
  SessionBoostSummary,
  SessionMovementSummary,
  SessionDemoSummary,
  FutCardStats,
} from '@/types/dashboard';
import { FoundPlayerInMatch } from './player-matching';
import { selectDeterministicNickname } from './nicknames';
import {
  UNIFIED_OVR_WEIGHTS,
  DOMINANCE_WEIGHTS,
  MVP_BONUS,
  SCORE_BONUS,
  WIN_BONUS,
  PASSING_BONUS_CONFIG,
  MAX_TOTAL_OVR_BONUS,
  C1_BENCHMARKS,
  MOMENTUM_CONFIG,
} from './tuning-constants';
import { clamp, safeDiv, piecewiseLinearScale, inversePiecewiseLinearScale } from '@/lib/utils';

export function calculateFutCardStats(
  matches: FoundPlayerInMatch[],
  fallbackSession: SessionCoreSummary,
  fallbackPos: SessionPositioningSummary,
  fallbackBoost: SessionBoostSummary,
  fallbackMov: SessionMovementSummary,
  fallbackDemos: SessionDemoSummary
): FutCardStats {
  // Ensure chronological sort descending before slicing the LAST 20 matches (recent form)
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.replay.date).getTime() - new Date(a.replay.date).getTime()
  );
  const recentMatches = sortedMatches.slice(0, 20);
  const N = Math.max(recentMatches.length, 1);

  let recentWins = 0;
  let recentGoals = 0;
  let recentAssists = 0;
  let recentSaves = 0;
  let recentShots = 0;
  let recentScore = 0;
  let recentMvps = 0;

  // 5-minute normalized accumulators (equalizes overtime and early forfeit games)
  let recentGoals5min = 0;
  let recentAssists5min = 0;
  let recentSaves5min = 0;
  let recentShots5min = 0;
  let recentSmallPads5min = 0;
  let recentOverfill5min = 0;
  let recentZeroBoost5min = 0;
  let recentStolenBig5min = 0;

  let recentSpeed = 0;
  let recentSuperPct = 0;
  let recentBoostSpdPct = 0;
  let recentSlowSpeedPct = 0;
  let recentPowerslides = 0;
  let recentHighAir = 0;
  let recentLowAir = 0;

  let recentBpm = 0;
  let recentStolenBig = 0;
  let recentZeroBoost = 0;

  let recentDefThird = 0;
  let recentNeuThird = 0;
  let recentOffThird = 0;
  let recentBehindBall = 0;
  let recentInfrontBall = 0;
  let recentMostBack = 0;
  let recentMostForward = 0;
  let recentDistMates = 0;

  let recentDemos = 0;

  let posCount = 0;
  let movCount = 0;
  let boostCount = 0;

  // Track MVP streak across the recent matches
  let currentMvpRun = 0;
  let maxMvpRun = 0;

  recentMatches.forEach((m) => {
    if (m.isWin) recentWins++;
    const s = m.player.stats;
    const isMvp = !!(s?.core?.mvp || m.player.mvp);

    if (isMvp) {
      currentMvpRun++;
      if (currentMvpRun > maxMvpRun) maxMvpRun = currentMvpRun;
    } else {
      currentMvpRun = 0;
    }

    const duration = m.replay.duration || 300;
    const matchScale = 300 / Math.max(duration, 60);

    const g = s?.core?.goals || 0;
    const a = s?.core?.assists || 0;
    const sv = s?.core?.saves || 0;
    const sh = s?.core?.shots || 0;

    recentGoals += g;
    recentGoals5min += g * matchScale;

    recentAssists += a;
    recentAssists5min += a * matchScale;

    recentSaves += sv;
    recentSaves5min += sv * matchScale;

    recentShots += sh;
    recentShots5min += sh * matchScale;

    recentScore += s?.core?.score || m.player.score || 0;
    if (isMvp) recentMvps++;

    if (s?.movement) {
      movCount++;
      recentSpeed += s.movement.avg_speed || 0;
      recentSuperPct += s.movement.percent_supersonic_speed || 0;
      recentBoostSpdPct += s.movement.percent_boost_speed || 0;
      recentSlowSpeedPct += s.movement.percent_slow_speed || 0;
      recentPowerslides += s.movement.count_powerslide || 0;
      recentHighAir += s.movement.percent_high_air || 0;
      recentLowAir += s.movement.percent_low_air || 0;
    }

    if (s?.boost) {
      boostCount++;
      recentBpm += s.boost.bpm || 0;
      recentStolenBig += s.boost.count_stolen_big || 0;
      recentStolenBig5min += (s.boost.count_stolen_big || 0) * matchScale;
      recentZeroBoost += s.boost.percent_zero_boost || 0;
      recentZeroBoost5min += (s.boost.time_zero_boost || 0) * matchScale;
      recentOverfill5min += (s.boost.amount_overfill || 0) * matchScale;
      recentSmallPads5min += (s.boost.count_collected_small || 0) * matchScale;
    }

    if (s?.positioning) {
      posCount++;
      recentDefThird += s.positioning.percent_defensive_third || 0;
      recentNeuThird += s.positioning.percent_neutral_third || 0;
      recentOffThird += s.positioning.percent_offensive_third || 0;
      recentBehindBall += s.positioning.percent_behind_ball || 0;
      recentInfrontBall += s.positioning.percent_infront_ball || 0;
      recentMostBack += s.positioning.percent_most_back || 0;
      recentMostForward += s.positioning.percent_most_forward || 0;
      recentDistMates += s.positioning.avg_distance_to_mates || 0;
    }

    if (s?.demo) {
      recentDemos += s.demo.inflicted || 0;
    }
  });

  const recentMvpStreak = maxMvpRun;
  const pCnt = Math.max(posCount, 1);
  const mCnt = Math.max(movCount, 1);
  const bCnt = Math.max(boostCount, 1);

  // Raw & Normalized 5-minute averages
  const avgG = recentMatches.length > 0 ? recentGoals / N : fallbackSession.goalsPerMatch;
  const avgSv = recentMatches.length > 0 ? recentSaves / N : fallbackSession.savesPerMatch;
  const avgA = recentMatches.length > 0 ? recentAssists / N : fallbackSession.assistsPerMatch;
  const avgSh = recentMatches.length > 0 ? recentShots / N : fallbackSession.shotsPerMatch;

  const nGoals = recentMatches.length > 0 ? recentGoals5min / N : fallbackSession.goalsPerMatch;
  const nSaves = recentMatches.length > 0 ? recentSaves5min / N : fallbackSession.savesPerMatch;
  const nAssists = recentMatches.length > 0 ? recentAssists5min / N : fallbackSession.assistsPerMatch;
  const nShots = recentMatches.length > 0 ? recentShots5min / N : fallbackSession.shotsPerMatch;
  const nSmallPads = boostCount > 0 ? recentSmallPads5min / bCnt : (fallbackBoost.avgCollectedSmall || 40);
  const nStolen = boostCount > 0 ? recentStolenBig5min / bCnt : (fallbackBoost.avgStolenBig || 2.0);
  const nZeroB = boostCount > 0 ? recentZeroBoost5min / bCnt : 8.0;

  const rawAcc = recentShots > 0 ? (recentGoals / recentShots) * 100 : fallbackSession.shootingPercentage;
  const shootAcc = clamp(rawAcc, 0, 100);
  const avgScoreVal = recentMatches.length > 0 ? recentScore / N : fallbackSession.avgScore;

  const spd = movCount > 0 ? recentSpeed / mCnt : fallbackMov.avgSpeed;
  const superPct = movCount > 0 ? recentSuperPct / mCnt : fallbackMov.avgSupersonicPercent;
  const boostSpd = movCount > 0 ? recentBoostSpdPct / mCnt : fallbackMov.avgBoostSpeedPercent;
  const slowSpeed = movCount > 0 ? recentSlowSpeedPct / mCnt : (fallbackMov.avgSlowSpeedPercent || 62);
  const pSlides = movCount > 0 ? recentPowerslides / mCnt : fallbackMov.avgPowerslideCount;
  const hAir = movCount > 0 ? recentHighAir / mCnt : fallbackMov.avgHighAirPercent;
  const lAir = movCount > 0 ? recentLowAir / mCnt : (fallbackMov.avgLowAirPercent || 36);

  const bpm = boostCount > 0 ? recentBpm / bCnt : fallbackBoost.avgBpm;
  const zeroB = boostCount > 0 ? recentZeroBoost / bCnt : fallbackBoost.avgZeroBoostPercent;

  const behindB = posCount > 0 ? recentBehindBall / pCnt : fallbackPos.avgBehindBall;
  const mostBack = posCount > 0 ? recentMostBack / pCnt : fallbackPos.avgMostBack;

  const dInf = recentMatches.length > 0 ? recentDemos / N : fallbackDemos.avgInflicted;
  const recentWinRate = recentMatches.length > 0 ? Number(((recentWins / N) * 100).toFixed(1)) : fallbackSession.winRate;

  // Streak Calculation (Hot / Cold streak from recent matches)
  let streakCount = 0;
  let streakType: 'win' | 'loss' | 'neutral' = 'neutral';

  if (recentMatches.length > 0) {
    const firstResult = recentMatches[0].isWin;
    streakType = firstResult ? 'win' : 'loss';
    for (const m of recentMatches) {
      if (m.isWin === firstResult) {
        streakCount++;
      } else {
        break;
      }
    }
  }

  // Momentum Multiplier
  let momentumBonus = 0;
  if (streakType === 'win') {
    momentumBonus += Math.min(MOMENTUM_CONFIG.maxStreakModifier, streakCount * MOMENTUM_CONFIG.streakStep);
  } else if (streakType === 'loss') {
    momentumBonus -= Math.min(MOMENTUM_CONFIG.maxStreakModifier, streakCount * MOMENTUM_CONFIG.streakStep);
  }

  if (recentWinRate >= 70) momentumBonus += MOMENTUM_CONFIG.winRateHighBonus;
  else if (recentWinRate <= 30) momentumBonus -= MOMENTUM_CONFIG.winRateLowPenalty;

  const matchScoreBonus = Math.max(0, Math.min(2, (avgScoreVal - 330) / 60));
  const mvpBonusStat = Math.min(2, (recentMvps / N) * 3);
  momentumBonus += matchScoreBonus + mvpBonusStat;

  // --- 6 CHAMPION 1 PIECEWISE CALIBRATED PILARS (50 a 99) ---

  // 1. PAC (Pace / Ritmo: 50 - 99) - Speed, supersonic transitions & boost velocity
  const scoreSpeed = piecewiseLinearScale(spd, C1_BENCHMARKS.pac.speed.min, C1_BENCHMARKS.pac.speed.mid, C1_BENCHMARKS.pac.speed.max);
  const scoreSupersonic = piecewiseLinearScale(superPct, C1_BENCHMARKS.pac.supersonic.min, C1_BENCHMARKS.pac.supersonic.mid, C1_BENCHMARKS.pac.supersonic.max);
  const scoreBoostSpd = piecewiseLinearScale(boostSpd, C1_BENCHMARKS.pac.boostSpeed.min, C1_BENCHMARKS.pac.boostSpeed.mid, C1_BENCHMARKS.pac.boostSpeed.max);
  const scoreSlow = inversePiecewiseLinearScale(slowSpeed, C1_BENCHMARKS.pac.slowSpeed.best, C1_BENCHMARKS.pac.slowSpeed.mid, C1_BENCHMARKS.pac.slowSpeed.worst);
  const pac = Math.round(clamp((scoreSpeed * 0.35) + (scoreSupersonic * 0.30) + (scoreBoostSpd * 0.20) + (scoreSlow * 0.15) + (momentumBonus * 0.20), 50, 99));

  // 2. SHO (Shooting / Finalizacao: 50 - 99) - Gols, shots & accuracy (heavily rewarded for scoring difficulty)
  const scoreGoals = piecewiseLinearScale(nGoals, C1_BENCHMARKS.sho.goals5min.min, C1_BENCHMARKS.sho.goals5min.mid, C1_BENCHMARKS.sho.goals5min.max);
  const scoreShots = piecewiseLinearScale(nShots, C1_BENCHMARKS.sho.shots5min.min, C1_BENCHMARKS.sho.shots5min.mid, C1_BENCHMARKS.sho.shots5min.max);
  const scoreAcc = piecewiseLinearScale(shootAcc, C1_BENCHMARKS.sho.accuracy.min, C1_BENCHMARKS.sho.accuracy.mid, C1_BENCHMARKS.sho.accuracy.max);
  const sho = Math.round(clamp((scoreGoals * 0.50) + (scoreShots * 0.20) + (scoreAcc * 0.30) + (momentumBonus * 0.20), 50, 99));

  // 3. PAS (Passing / Criacao: 50 - 99) - Assists & supporting positioning
  const scoreAssists = piecewiseLinearScale(nAssists, C1_BENCHMARKS.pas.assists5min.min, C1_BENCHMARKS.pas.assists5min.mid, C1_BENCHMARKS.pas.assists5min.max);
  const scoreBehind = piecewiseLinearScale(behindB, C1_BENCHMARKS.pas.behindBall.min, C1_BENCHMARKS.pas.behindBall.mid, C1_BENCHMARKS.pas.behindBall.max);
  const pas = Math.round(clamp((scoreAssists * 0.65) + (scoreBehind * 0.35) + (momentumBonus * 0.20), 50, 99));

  // 4. DRI (Mechanics / Jogo Aereo & Controle: 50 - 99) - High/Low air aerial recoveries & powerslides
  const scoreHighAir = piecewiseLinearScale(hAir, C1_BENCHMARKS.dri.highAir.min, C1_BENCHMARKS.dri.highAir.mid, C1_BENCHMARKS.dri.highAir.max);
  const scoreLowAir = piecewiseLinearScale(lAir, C1_BENCHMARKS.dri.lowAir.min, C1_BENCHMARKS.dri.lowAir.mid, C1_BENCHMARKS.dri.lowAir.max);
  const scorePowerslides = piecewiseLinearScale(pSlides, C1_BENCHMARKS.dri.powerslides5min.min, C1_BENCHMARKS.dri.powerslides5min.mid, C1_BENCHMARKS.dri.powerslides5min.max);
  const dri = Math.round(clamp((scoreHighAir * 0.30) + (scoreLowAir * 0.40) + (scorePowerslides * 0.30) + (momentumBonus * 0.20), 50, 99));

  // 5. DEF (Defending / Defesa & Saves: 50 - 99) - Normalized 5-min saves & defensive third coverage
  const scoreSaves = piecewiseLinearScale(nSaves, C1_BENCHMARKS.def.saves5min.min, C1_BENCHMARKS.def.saves5min.mid, C1_BENCHMARKS.def.saves5min.max);
  const scoreDefBehind = piecewiseLinearScale(behindB, C1_BENCHMARKS.def.behindBall.min, C1_BENCHMARKS.def.behindBall.mid, C1_BENCHMARKS.def.behindBall.max);
  const def = Math.round(clamp((scoreSaves * 0.70) + (scoreDefBehind * 0.30) + (momentumBonus * 0.20), 50, 99));

  // 6. PHY (Physicality / Boost & Pressao: 50 - 99) - Small pad routing, BPM, boost steals & low zero boost
  const scoreSmallPads = piecewiseLinearScale(nSmallPads, C1_BENCHMARKS.phy.smallPads5min.min, C1_BENCHMARKS.phy.smallPads5min.mid, C1_BENCHMARKS.phy.smallPads5min.max);
  const scoreBpm = piecewiseLinearScale(bpm, C1_BENCHMARKS.phy.bpm.min, C1_BENCHMARKS.phy.bpm.mid, C1_BENCHMARKS.phy.bpm.max);
  const scoreStolen = piecewiseLinearScale(nStolen, C1_BENCHMARKS.phy.stolenBig5min.min, C1_BENCHMARKS.phy.stolenBig5min.mid, C1_BENCHMARKS.phy.stolenBig5min.max);
  const scoreZeroB = inversePiecewiseLinearScale(zeroB, C1_BENCHMARKS.phy.zeroBoostTime5min.best, C1_BENCHMARKS.phy.zeroBoostTime5min.mid, C1_BENCHMARKS.phy.zeroBoostTime5min.worst);
  const phy = Math.round(clamp((scoreSmallPads * 0.35) + (scoreBpm * 0.30) + (scoreStolen * 0.20) + (scoreZeroB * 0.15) + (momentumBonus * 0.15), 50, 99));

  // Purely Visual Position Assignment (Does NOT alter OVR formula)
  const visualAtkPower = (sho * DOMINANCE_WEIGHTS.cardAtk.sho) + (nGoals * DOMINANCE_WEIGHTS.matchAtk.goalsPerMatch) + (nShots * DOMINANCE_WEIGHTS.matchAtk.shotsPerMatch);
  const visualDefPower = (def * DOMINANCE_WEIGHTS.cardDef.def) + (nSaves * DOMINANCE_WEIGHTS.matchDef.savesPerMatch) + (mostBack * DOMINANCE_WEIGHTS.matchDef.mostBackPct);

  let position: 'ATA' | 'DEF' = 'ATA';
  let positionLabel = 'Ataque';
  if (visualDefPower > visualAtkPower) {
    position = 'DEF';
    positionLabel = 'Defensor';
  }

  // Unified, Position-Agnostic OVR Formula (SHO 33%, DEF 33%, PAS 17%, PAC 7%, DRI 5%, PHY 5%)
  const statsBaseOvr =
    (sho * UNIFIED_OVR_WEIGHTS.sho) +
    (def * UNIFIED_OVR_WEIGHTS.def) +
    (pas * UNIFIED_OVR_WEIGHTS.pas) +
    (pac * UNIFIED_OVR_WEIGHTS.pac) +
    (dri * UNIFIED_OVR_WEIGHTS.dri) +
    (phy * UNIFIED_OVR_WEIGHTS.phy);

  // Compute the direct average of the 6 visible card stats
  const simpleStatsAvg = (pac + sho + pas + dri + def + phy) / 6;

  // Blended Base OVR (75% tactical weights + 25% simple average)
  // Keeps the OVR grounded to the visible card stats while honoring primary strengths
  const blendedBaseOvr = (statsBaseOvr * 0.75) + (simpleStatsAvg * 0.25);

  // Direct Match Performance Bonuses with strict cap
  const mvpBonus = Math.min(MVP_BONUS.maxBonus, (recentMvps / N) * MVP_BONUS.multiplier);
  const scoreBonus = Math.max(0, Math.min(SCORE_BONUS.maxBonus, (avgScoreVal - SCORE_BONUS.baseline) / SCORE_BONUS.divisor));
  const winBonus = recentWinRate >= WIN_BONUS.highThreshold ? WIN_BONUS.highBonus : recentWinRate >= WIN_BONUS.midThreshold ? WIN_BONUS.midBonus : 0;
  const passingBonus = Math.max(0, Math.min(PASSING_BONUS_CONFIG.maxBonus, nAssists * PASSING_BONUS_CONFIG.assistMultiplier));

  const rawBonuses = mvpBonus + scoreBonus + winBonus + passingBonus;
  const totalBonuses = Math.min(MAX_TOTAL_OVR_BONUS, rawBonuses);
  let ovr = Math.round(clamp(blendedBaseOvr + totalBonuses, 50, 99));

  // Strict MVP rule: Special variations (TOTW, TOTW Hero, Icon TOTW, GOAT) ONLY trigger on exact streak of 3 MVPs in the 3 most recent matches
  const isMatchMvp = (m: FoundPlayerInMatch | undefined): boolean => {
    if (!m) return false;
    return !!(m.player.stats?.core?.mvp || m.player.mvp);
  };

  const has3ConsecutiveMvpsLast3 =
    sortedMatches.length >= 3 &&
    isMatchMvp(sortedMatches[0]) &&
    isMatchMvp(sortedMatches[1]) &&
    isMatchMvp(sortedMatches[2]);

  const isLegendLevel = ovr >= 90;

  let tier: FutCardStats['tier'] = 'gold';

  if (has3ConsecutiveMvpsLast3) {
    if (ovr >= 94) {
      tier = 'goat';
    } else if (isLegendLevel) {
      tier = 'icon_totw';
    } else if (ovr >= 85) {
      tier = 'totw_hero';
    } else {
      tier = 'totw';
    }
  } else {
    // Normal non-MVP tiers based strictly on OVR rating
    if (isLegendLevel) {
      tier = 'icon';
    } else if (ovr >= 85) {
      tier = 'hero';
    } else if (ovr >= 76) {
      tier = 'gold';
    } else if (ovr >= 65) {
      tier = 'silver';
    } else {
      tier = 'bronze';
    }
  }

  // Select Stable / Deterministic Nickname
  const isGoat = tier === 'goat';
  const playerName = matches[0]?.player?.name || fallbackSession.totalMatches > 0 ? 'Player' : 'Jogador';
  const { nickname, category: nicknameCategory, isNegative: isNegativeNickname } = selectDeterministicNickname(playerName, {
    ovr,
    pac,
    sho,
    pas,
    dri,
    def,
    phy,
    avgG,
    avgSv,
    avgA,
    avgSh,
    shootAcc,
    recentWinRate,
    recentMvps,
    dInf,
    superPct,
    avgScore: avgScoreVal,
    position,
    isGoat,
    recentMatchesCount: recentMatches.length,
  });

  return {
    ovr,
    tier,
    position,
    positionLabel,
    pac,
    sho,
    pas,
    dri,
    def,
    phy,
    streakCount,
    streakType,
    recentWinRate,
    recentMatchesCount: recentMatches.length,
    nickname,
    nicknameCategory,
    isNegativeNickname,
    recentGoals,
    recentAssists,
    recentSaves,
    recentShots,
    recentMvps,
    recentMvpStreak,
    recentAvgScore: Math.round(avgScoreVal),
  };
}
