import { ReplaySummary, Platform } from '@/types/ballchasing';
import {
  AggregatedPlayerDashboard,
  SessionCoreSummary,
  SessionPositioningSummary,
  SessionBoostSummary,
  SessionMovementSummary,
  SessionDemoSummary,
  MatchHistoryItem,
  TrendHistoryPoint,
} from '@/types/dashboard';
import { findPlayerDataInReplay, FoundPlayerInMatch } from './player-matching';
import { calculateRadarStats } from './radar';
import { calculateFutCardStats } from './fut-cards';

export function calculateAggregatedDashboard(
  replays: ReplaySummary[],
  playerQuery: { name?: string; searchNames?: string[]; platform?: Platform | string; id?: string; platformId?: string }
): AggregatedPlayerDashboard {
  const matches: FoundPlayerInMatch[] = [];

  for (const r of replays) {
    const found = findPlayerDataInReplay(r, playerQuery);
    if (found) {
      matches.push(found);
    }
  }

  const total = matches.length;
  const playerName = playerQuery.name || matches[0]?.player.name || 'Jogador';
  const platform = (matches[0]?.player.id?.platform || playerQuery.platform) as Platform | undefined;
  const platformId = matches[0]?.player.id?.id || playerQuery.id;

  if (total === 0) {
    return createEmptyDashboard(playerName, platform, platformId);
  }

  let wins = 0;
  let totalGoals = 0;
  let totalAssists = 0;
  let totalSaves = 0;
  let totalShots = 0;
  let totalScore = 0;
  let mvpCount = 0;
  let totalDuration = 0;
  let overtimeCount = 0;

  // Positioning
  let sumDefThird = 0;
  let sumNeuThird = 0;
  let sumOffThird = 0;
  let sumDefHalf = 0;
  let sumOffHalf = 0;
  let sumBehindBall = 0;
  let sumInfrontBall = 0;
  let sumDistMates = 0;
  let sumDistBall = 0;
  let sumMostBack = 0;
  let sumMostForward = 0;
  let countPositioning = 0;

  // Boost
  let sumBpm = 0;
  let sumBcpm = 0;
  let sumAvgBoost = 0;
  let sumStolenBig = 0;
  let sumStolenSmall = 0;
  let sumCollectedBig = 0;
  let sumCollectedSmall = 0;
  let sumSupersonicWaste = 0;
  let sumZeroBoostPct = 0;
  let sumFullBoostPct = 0;
  let sumOverfill = 0;
  let sumBoost0_25 = 0;
  let sumBoost25_50 = 0;
  let sumBoost50_75 = 0;
  let sumBoost75_100 = 0;
  let countBoost = 0;

  // Movement
  let sumSpeed = 0;
  let sumSpeedPct = 0;
  let sumSupersonicPct = 0;
  let sumBoostSpeedPct = 0;
  let sumSlowSpeedPct = 0;
  let sumGroundPct = 0;
  let sumLowAirPct = 0;
  let sumHighAirPct = 0;
  let sumPowerslideCount = 0;
  let sumPowerslideDuration = 0;
  let sumDistance = 0;
  let countMovement = 0;

  // Demos
  let totalInflicted = 0;
  let totalTaken = 0;

  const matchHistory: MatchHistoryItem[] = [];
  const trendHistory: TrendHistoryPoint[] = [];

  // Process all matches
  matches.forEach((m) => {
    const s = m.player.stats;
    const core = s?.core;
    const boost = s?.boost;
    const mov = s?.movement;
    const pos = s?.positioning;
    const demo = s?.demo;

    if (m.isWin) wins++;
    if (m.replay.overtime) overtimeCount++;
    totalDuration += m.replay.duration || 300;

    const g = core?.goals || 0;
    const a = core?.assists || 0;
    const sv = core?.saves || 0;
    const sh = core?.shots || 0;
    const sc = core?.score || m.player.score || 0;

    totalGoals += g;
    totalAssists += a;
    totalSaves += sv;
    totalShots += sh;
    totalScore += sc;
    if (core?.mvp || m.player.mvp) mvpCount++;

    if (pos) {
      countPositioning++;
      sumDefThird += pos.percent_defensive_third || 0;
      sumNeuThird += pos.percent_neutral_third || 0;
      sumOffThird += pos.percent_offensive_third || 0;
      sumDefHalf += pos.percent_defensive_half || 0;
      sumOffHalf += pos.percent_offensive_half || 0;
      sumBehindBall += pos.percent_behind_ball || 0;
      sumInfrontBall += pos.percent_infront_ball || 0;
      sumDistMates += pos.avg_distance_to_mates || 0;
      sumDistBall += pos.avg_distance_to_ball || 0;
      sumMostBack += pos.percent_most_back || 0;
      sumMostForward += pos.percent_most_forward || 0;
    }

    if (boost) {
      countBoost++;
      sumBpm += boost.bpm || 0;
      sumBcpm += boost.bcpm || 0;
      sumAvgBoost += boost.avg_amount || 0;
      sumStolenBig += boost.count_stolen_big || 0;
      sumStolenSmall += boost.count_stolen_small || 0;
      sumCollectedBig += boost.count_collected_big || 0;
      sumCollectedSmall += boost.count_collected_small || 0;
      sumSupersonicWaste += boost.amount_used_while_supersonic || 0;
      sumZeroBoostPct += boost.percent_zero_boost || 0;
      sumFullBoostPct += boost.percent_full_boost || 0;
      sumOverfill += boost.amount_overfill || 0;
      sumBoost0_25 += boost.percent_boost_0_25 || 0;
      sumBoost25_50 += boost.percent_boost_25_50 || 0;
      sumBoost50_75 += boost.percent_boost_50_75 || 0;
      sumBoost75_100 += boost.percent_boost_75_100 || 0;
    }

    if (mov) {
      countMovement++;
      sumSpeed += mov.avg_speed || 0;
      sumSpeedPct += mov.avg_speed_percentage || 0;
      sumSupersonicPct += mov.percent_supersonic_speed || 0;
      sumBoostSpeedPct += mov.percent_boost_speed || 0;
      sumSlowSpeedPct += mov.percent_slow_speed || 0;
      sumGroundPct += mov.percent_ground || 0;
      sumLowAirPct += mov.percent_low_air || 0;
      sumHighAirPct += mov.percent_high_air || 0;
      sumPowerslideCount += mov.count_powerslide || 0;
      sumPowerslideDuration += mov.avg_powerslide_duration || 0;
      sumDistance += mov.total_distance || 0;
    }

    if (demo) {
      totalInflicted += demo.inflicted || 0;
      totalTaken += demo.taken || 0;
    }

    matchHistory.push({
      id: m.replay.id,
      date: m.replay.date,
      mapName: m.replay.map_name || 'Estadio',
      result: m.isWin ? 'win' : 'loss',
      scoreTeam: m.teamGoals,
      scoreOpponent: m.opponentGoals,
      duration: m.replay.duration || 300,
      isOvertime: !!m.replay.overtime,
      goals: g,
      assists: a,
      saves: sv,
      shots: sh,
      score: sc,
      bpm: Math.round(boost?.bpm || 0),
      supersonicPercent: Number((mov?.percent_supersonic_speed || 0).toFixed(1)),
      demoInflicted: demo?.inflicted || 0,
    });
  });

  const pCount = Math.max(countPositioning, 1);
  const bCount = Math.max(countBoost, 1);
  const mCount = Math.max(countMovement, 1);

  const session: SessionCoreSummary = {
    totalMatches: total,
    wins,
    losses: total - wins,
    winRate: Number(((wins / total) * 100).toFixed(1)),
    totalGoals,
    goalsPerMatch: Number((totalGoals / total).toFixed(2)),
    totalAssists,
    assistsPerMatch: Number((totalAssists / total).toFixed(2)),
    totalSaves,
    savesPerMatch: Number((totalSaves / total).toFixed(2)),
    totalShots,
    shotsPerMatch: Number((totalShots / total).toFixed(2)),
    shootingPercentage: totalShots > 0 ? Number(((totalGoals / totalShots) * 100).toFixed(1)) : 0,
    avgScore: Number((totalScore / total).toFixed(1)),
    mvpCount,
    avgDurationSeconds: Math.round(totalDuration / total),
    overtimeCount,
  };

  const positioning: SessionPositioningSummary = {
    avgDefensiveThird: Number((sumDefThird / pCount).toFixed(1)),
    avgNeutralThird: Number((sumNeuThird / pCount).toFixed(1)),
    avgOffensiveThird: Number((sumOffThird / pCount).toFixed(1)),
    avgDefensiveHalf: Number((sumDefHalf / pCount).toFixed(1)),
    avgOffensiveHalf: Number((sumOffHalf / pCount).toFixed(1)),
    avgBehindBall: Number((sumBehindBall / pCount).toFixed(1)),
    avgInfrontBall: Number((sumInfrontBall / pCount).toFixed(1)),
    avgDistanceToTeammate: Math.round(sumDistMates / pCount) || 3200,
    avgDistanceToBall: Math.round(sumDistBall / pCount) || 2400,
    avgMostBack: Number((sumMostBack / pCount).toFixed(1)),
    avgMostForward: Number((sumMostForward / pCount).toFixed(1)),
  };

  const boost: SessionBoostSummary = {
    avgBpm: Number((sumBpm / bCount).toFixed(1)),
    avgBcpm: Number((sumBcpm / bCount).toFixed(1)),
    avgAmount: Number((sumAvgBoost / bCount).toFixed(1)),
    avgStolenBig: Number((sumStolenBig / bCount).toFixed(1)),
    avgStolenSmall: Number((sumStolenSmall / bCount).toFixed(1)),
    totalStolenBig: sumStolenBig,
    avgCollectedBig: Number((sumCollectedBig / bCount).toFixed(1)),
    avgCollectedSmall: Number((sumCollectedSmall / bCount).toFixed(1)),
    avgSupersonicWaste: Number((sumSupersonicWaste / bCount).toFixed(1)),
    avgZeroBoostPercent: Number((sumZeroBoostPct / bCount).toFixed(1)),
    avgFullBoostPercent: Number((sumFullBoostPct / bCount).toFixed(1)),
    avgOverfill: Number((sumOverfill / bCount).toFixed(1)),
    boostDistribution: {
      range0_25: Number((sumBoost0_25 / bCount).toFixed(1)),
      range25_50: Number((sumBoost25_50 / bCount).toFixed(1)),
      range50_75: Number((sumBoost50_75 / bCount).toFixed(1)),
      range75_100: Number((sumBoost75_100 / bCount).toFixed(1)),
    },
  };

  const movement: SessionMovementSummary = {
    avgSpeed: Math.round(sumSpeed / mCount),
    avgSpeedPercentage: Number((sumSpeedPct / mCount).toFixed(1)),
    avgSupersonicPercent: Number((sumSupersonicPct / mCount).toFixed(1)),
    avgBoostSpeedPercent: Number((sumBoostSpeedPct / mCount).toFixed(1)),
    avgSlowSpeedPercent: Number((sumSlowSpeedPct / mCount).toFixed(1)),
    avgGroundPercent: Number((sumGroundPct / mCount).toFixed(1)),
    avgLowAirPercent: Number((sumLowAirPct / mCount).toFixed(1)),
    avgHighAirPercent: Number((sumHighAirPct / mCount).toFixed(1)),
    avgPowerslideCount: Math.round(sumPowerslideCount / mCount),
    avgPowerslideDuration: Number((sumPowerslideDuration / mCount).toFixed(2)),
    totalDistance: Math.round(sumDistance / mCount),
  };

  const demos: SessionDemoSummary = {
    totalInflicted,
    totalTaken,
    avgInflicted: Number((totalInflicted / total).toFixed(2)),
    avgTaken: Number((totalTaken / total).toFixed(2)),
    demoRatio: totalTaken > 0 ? Number((totalInflicted / totalTaken).toFixed(2)) : totalInflicted,
  };

  const radar = calculateRadarStats(session, positioning, boost, movement, demos);
  const futStats = calculateFutCardStats(matches, session, positioning, boost, movement, demos);

  return {
    playerName,
    platform,
    platformId,
    replaysAnalyzed: total,
    session,
    positioning,
    boost,
    movement,
    demos,
    radar,
    futStats,
    matchHistory,
    trendHistory,
    replays,
  };
}

export function createEmptyDashboard(
  playerName: string,
  platform?: Platform,
  platformId?: string
): AggregatedPlayerDashboard {
  return {
    playerName,
    platform,
    platformId,
    replaysAnalyzed: 0,
    session: {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalGoals: 0,
      goalsPerMatch: 0,
      totalAssists: 0,
      assistsPerMatch: 0,
      totalSaves: 0,
      savesPerMatch: 0,
      totalShots: 0,
      shotsPerMatch: 0,
      shootingPercentage: 0,
      avgScore: 0,
      mvpCount: 0,
      avgDurationSeconds: 0,
      overtimeCount: 0,
    },
    positioning: {
      avgDefensiveThird: 0,
      avgNeutralThird: 0,
      avgOffensiveThird: 0,
      avgDefensiveHalf: 0,
      avgOffensiveHalf: 0,
      avgBehindBall: 0,
      avgInfrontBall: 0,
      avgDistanceToTeammate: 0,
      avgDistanceToBall: 0,
      avgMostBack: 0,
      avgMostForward: 0,
    },
    boost: {
      avgBpm: 0,
      avgBcpm: 0,
      avgAmount: 0,
      avgStolenBig: 0,
      avgStolenSmall: 0,
      totalStolenBig: 0,
      avgCollectedBig: 0,
      avgCollectedSmall: 0,
      avgSupersonicWaste: 0,
      avgZeroBoostPercent: 0,
      avgFullBoostPercent: 0,
      avgOverfill: 0,
      boostDistribution: { range0_25: 0, range25_50: 0, range50_75: 0, range75_100: 0 },
    },
    movement: {
      avgSpeed: 0,
      avgSpeedPercentage: 0,
      avgSupersonicPercent: 0,
      avgBoostSpeedPercent: 0,
      avgSlowSpeedPercent: 0,
      avgGroundPercent: 0,
      avgLowAirPercent: 0,
      avgHighAirPercent: 0,
      avgPowerslideCount: 0,
      avgPowerslideDuration: 0,
      totalDistance: 0,
    },
    demos: { totalInflicted: 0, totalTaken: 0, avgInflicted: 0, avgTaken: 0, demoRatio: 0 },
    radar: [
      { axis: 'Agressividade', value: 0, fullMark: 100 },
      { axis: 'Contencao Defensiva', value: 0, fullMark: 100 },
      { axis: 'Eficiencia Mecanica', value: 0, fullMark: 100 },
      { axis: 'Suporte e Posicionamento', value: 0, fullMark: 100 },
      { axis: 'Controle de Boost', value: 0, fullMark: 100 },
    ],
    futStats: {
      ovr: 60,
      tier: 'bronze',
      position: 'ATA',
      positionLabel: 'Ataque',
      pac: 60,
      sho: 60,
      pas: 60,
      dri: 60,
      def: 60,
      phy: 60,
      streakCount: 0,
      streakType: 'neutral',
      recentWinRate: 50,
      recentMatchesCount: 0,
      nickname: 'Iniciante da Arena',
      nicknameCategory: 'Inicial',
      isNegativeNickname: false,
      recentGoals: 0,
      recentAssists: 0,
      recentSaves: 0,
      recentShots: 0,
      recentMvps: 0,
      recentMvpStreak: 0,
      recentAvgScore: 0,
    },
    matchHistory: [],
    trendHistory: [],
    replays: [],
  };
}
