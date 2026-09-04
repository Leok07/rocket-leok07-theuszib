import { ReplaySummary, PlayerInReplay, DetailedPlayerStats, Platform, TeamInReplay } from '@/types/ballchasing';
import {
  AggregatedPlayerDashboard,
  SessionCoreSummary,
  SessionPositioningSummary,
  SessionBoostSummary,
  SessionMovementSummary,
  SessionDemoSummary,
  PlaystyleRadarPoint,
  FutCardStats,
  MatchHistoryItem,
  TrendHistoryPoint,
} from '@/types/dashboard';

export interface FoundPlayerInMatch {
  replay: ReplaySummary;
  player: PlayerInReplay;
  isBlue: boolean;
  isWin: boolean;
  teamGoals: number;
  opponentGoals: number;
}

export function getTeamGoals(team?: TeamInReplay | null): number {
  if (!team) return 0;
  if (typeof team.stats?.core?.goals === 'number') return team.stats.core.goals;
  if (typeof team.score === 'number') return team.score;
  if (typeof team.goals === 'number') return team.goals;
  if (Array.isArray(team.players)) {
    return team.players.reduce((sum: number, p: any) => sum + (p.stats?.core?.goals || 0), 0);
  }
  return 0;
}

export function findPlayerDataInReplay(
  replay: ReplaySummary,
  playerIdentifier: { name?: string; searchNames?: string[]; platform?: Platform | string; id?: string; platformId?: string }
): FoundPlayerInMatch | null {
  const normNames = (playerIdentifier.searchNames || [playerIdentifier.name || ''])
    .map((n) => n.toLowerCase().trim())
    .filter(Boolean);
  const targetPlatform = playerIdentifier.platform?.toLowerCase().trim();
  const rawId = playerIdentifier.id || playerIdentifier.platformId || '';
  const targetId = rawId.includes(':') ? rawId.split(':').pop()?.toLowerCase().trim() : rawId.toLowerCase().trim();

  const blueGoals = getTeamGoals(replay.blue);
  const orangeGoals = getTeamGoals(replay.orange);

  // Strict, unambiguous player match check
  const checkPlayerMatch = (p: PlayerInReplay): boolean => {
    const pName = p.name?.toLowerCase().trim() || '';
    const pPlatform = p.id?.platform?.toLowerCase();
    const pId = p.id?.id?.toLowerCase();

    // Skip unnamed and invalid slots
    if (!pName && !pId) return false;

    // 1. Exact platform ID match (if ID is known)
    if (targetId && pId && pId === targetId) {
      return !targetPlatform || pPlatform === targetPlatform;
    }

    // 2. Exact match against target search names with platform verification
    for (const n of normNames) {
      if (pName === n) {
        if (targetPlatform && pPlatform && pPlatform !== targetPlatform) {
          continue;
        }
        return true;
      }
    }

    return false;
  };

  // Check blue team
  for (const p of replay.blue?.players || []) {
    if (checkPlayerMatch(p)) {
      const isWin = blueGoals > orangeGoals;
      return {
        replay,
        player: p,
        isBlue: true,
        isWin,
        teamGoals: blueGoals,
        opponentGoals: orangeGoals,
      };
    }
  }

  // Check orange team
  for (const p of replay.orange?.players || []) {
    if (checkPlayerMatch(p)) {
      const isWin = orangeGoals > blueGoals;
      return {
        replay,
        player: p,
        isBlue: false,
        isWin,
        teamGoals: orangeGoals,
        opponentGoals: blueGoals,
      };
    }
  }

  return null;
}

// Complete database of 56 positive nicknames across 7 categories + 10 negative nicknames
const NICKNAME_DATABASE = {
  negative: [
    'Cone de Trânsito',
    'Chute Fofo',
    'Fantasma em Campo',
    'Fominha Ineficiente',
    'Tartaruga Motorizada',
    'Falso Garçom',
    'Ímã de Demolição',
    'Sem Boost Permanente',
    'Afobado no Double-Commit',
    'Descalibrado da Arena',
  ],
  striker: [
    'Artilheiro Implacável',
    'Sniper da Gaveta',
    'Predador de Área',
    'Carrasco dos Goleiros',
    'Matador Sangue-Frio',
    'Homem-Gol',
    'Canhão de Octane',
    'Terror da Rede',
  ],
  guardian: [
    'Muralha Intransponível',
    'Goleiro de Ferro',
    'Guardião da Trave',
    'Último Homem',
    'Portão Blindado',
    'Salvador da Pátria',
    'Cerberus do Gol',
    'Escudo de Titânio',
  ],
  playmaker: [
    'Maestro do Meio-Campo',
    'Arquiteto das Jogadas',
    'Visão de Raio-X',
    'Garçom de Elite',
    'Motorzinho do Time',
    'Distribuidor de Passes',
    'Cérebro da Dupla',
    'Engenheiro Tático',
  ],
  mechanic: [
    'Mecânico Aéreo',
    'Mago do Air Roll',
    'Acrobata dos Céus',
    'Malabarista de Bola',
    'Rei do Flip Reset',
    'Mestre do Drible',
    'Freestyler Letal',
    'Especialista em Ceiling',
  ],
  speedster: [
    'Relâmpago Supersônico',
    'Foguete Sem Freio',
    'Turbina Ligada',
    'Velocista Noturno',
    'Flash da Arena',
    'Motor V8',
    'Bala Humana',
    'Vento Supersônico',
  ],
  brawler: [
    'Demolidor Implacável',
    'Ladrão de Boost',
    'Trator da Arena',
    'Tanque de Guerra',
    'Aspirador de Big Boost',
    'Predador de Chassi',
    'Derrubador de Paredes',
    'Pesadelo Físico',
  ],
  legend: [
    'Gênio Incontestável',
    'Estrela do Clutch',
    'MVP Indiscutível',
    'Lenda da Arena',
    'O Maestro Supremo',
    'Titã dos Campeonatos',
    'Inabalável',
    'O Senhor do Jogo',
  ],
};

function selectDeterministicNickname(
  playerName: string,
  data: {
    ovr: number;
    pac: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
    avgG: number;
    avgSv: number;
    avgA: number;
    avgSh: number;
    shootAcc: number;
    recentWinRate: number;
    recentMvps: number;
    dInf: number;
    superPct: number;
    avgScore: number;
    position: 'ATA' | 'DEF';
    isGoat: boolean;
    recentMatchesCount: number;
  }
): { nickname: string; category: string; isNegative: boolean } {
  // Hash function based on player name and rounded stat tiers
  // Rounding stats by step of 4-5 prevents flickering across F5 updates
  const statBracket = `${playerName.toLowerCase()}_ovr${Math.floor(data.ovr / 4)}_p${data.position}_sh${Math.floor(data.sho / 5)}_df${Math.floor(data.def / 5)}_mvp${data.recentMvps}`;
  let hash = 0;
  for (let i = 0; i < statBracket.length; i++) {
    hash = (hash << 5) - hash + statBracket.charCodeAt(i);
    hash |= 0;
  }
  const getIndex = (arrLength: number) => Math.abs(hash) % arrLength;

  // 1. Check for Negative Phase (underperforming)
  const isNegative =
    data.recentMatchesCount >= 3 &&
    ((data.recentWinRate <= 25 && data.ovr <= 72) ||
      (data.avgG === 0 && data.avgA === 0 && data.avgScore < 230) ||
      (data.shootAcc < 15 && data.avgSh >= 2.5) ||
      (data.avgScore < 200 && data.recentMvps === 0));

  if (isNegative) {
    const list = NICKNAME_DATABASE.negative;
    return {
      nickname: list[getIndex(list.length)],
      category: 'Fase Crítica',
      isNegative: true,
    };
  }

  // 2. Legend / GOAT / Elite Tier
  if (data.isGoat || data.ovr >= 92 || data.recentMvps >= 4) {
    const list = NICKNAME_DATABASE.legend;
    return {
      nickname: list[getIndex(list.length)],
      category: 'Lendário',
      isNegative: false,
    };
  }

  // 3. Category based on dominant playstyle & performance
  let categoryKey: keyof typeof NICKNAME_DATABASE = 'playmaker';
  let categoryLabel = 'Criação';

  if (data.position === 'ATA' || data.avgG >= 1.2 || (data.sho >= 84 && data.sho >= data.def + 6)) {
    categoryKey = 'striker';
    categoryLabel = 'Artilharia';
  } else if (data.position === 'DEF' || data.avgSv >= 1.7 || (data.def >= 84 && data.def >= data.sho + 6)) {
    categoryKey = 'guardian';
    categoryLabel = 'Muralha Defensiva';
  } else if (data.avgA >= 1.2 || (data.pas >= 82 && data.pas >= data.sho + 4)) {
    categoryKey = 'playmaker';
    categoryLabel = 'Maestro / Visão';
  } else if (data.dri >= 82 || data.sho >= 80) {
    categoryKey = 'mechanic';
    categoryLabel = 'Mecânica Aérea';
  } else if (data.pac >= 83 || data.superPct >= 17) {
    categoryKey = 'speedster';
    categoryLabel = 'Velocidade / Ritmo';
  } else if (data.dInf >= 1.2 || data.phy >= 82) {
    categoryKey = 'brawler';
    categoryLabel = 'Físico / Demolição';
  } else {
    // Fallback: Pick by highest attribute
    const maxStat = Math.max(data.pac, data.sho, data.pas, data.dri, data.def, data.phy);
    if (maxStat === data.def) {
      categoryKey = 'guardian';
      categoryLabel = 'Defensivo';
    } else if (maxStat === data.sho) {
      categoryKey = 'striker';
      categoryLabel = 'Ofensivo';
    } else if (maxStat === data.pac) {
      categoryKey = 'speedster';
      categoryLabel = 'Velocidade';
    } else if (maxStat === data.dri) {
      categoryKey = 'mechanic';
      categoryLabel = 'Mecânica';
    } else if (maxStat === data.phy) {
      categoryKey = 'brawler';
      categoryLabel = 'Físico';
    } else {
      categoryKey = 'playmaker';
      categoryLabel = 'Armação';
    }
  }

  const list = NICKNAME_DATABASE[categoryKey];
  return {
    nickname: list[getIndex(list.length)],
    category: categoryLabel,
    isNegative: false,
  };
}

export function calculateFutCardStats(
  matches: FoundPlayerInMatch[],
  fallbackSession: SessionCoreSummary,
  fallbackPos: SessionPositioningSummary,
  fallbackBoost: SessionBoostSummary,
  fallbackMov: SessionMovementSummary,
  fallbackDemos: SessionDemoSummary
): FutCardStats {
  // Ensure chronological sort descending before slicing the LAST 10 matches (recent form)
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.replay.date).getTime() - new Date(a.replay.date).getTime()
  );
  const recentMatches = sortedMatches.slice(0, 10);
  const N = Math.max(recentMatches.length, 1);

  let recentWins = 0;
  let recentGoals = 0;
  let recentAssists = 0;
  let recentSaves = 0;
  let recentShots = 0;
  let recentSpeed = 0;
  let recentSuperPct = 0;
  let recentBoostSpdPct = 0;
  let recentBpm = 0;
  let recentStolenBig = 0;
  let recentDefThird = 0;
  let recentNeuThird = 0;
  let recentOffThird = 0;
  let recentBehindBall = 0;
  let recentInfrontBall = 0;
  let recentMostBack = 0;
  let recentMostForward = 0;
  let recentDistMates = 0;
  let recentPowerslides = 0;
  let recentHighAir = 0;
  let recentLowAir = 0;
  let recentDemos = 0;
  let recentZeroBoost = 0;

  let posCount = 0;
  let movCount = 0;
  let boostCount = 0;

  let recentScore = 0;
  let recentMvps = 0;

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

    recentGoals += s?.core?.goals || 0;
    recentAssists += s?.core?.assists || 0;
    recentSaves += s?.core?.saves || 0;
    recentShots += s?.core?.shots || 0;
    recentScore += s?.core?.score || m.player.score || 0;
    if (isMvp) recentMvps++;

    if (s?.movement) {
      movCount++;
      recentSpeed += s.movement.avg_speed || 0;
      recentSuperPct += s.movement.percent_supersonic_speed || 0;
      recentBoostSpdPct += s.movement.percent_boost_speed || 0;
      recentPowerslides += s.movement.count_powerslide || 0;
      recentHighAir += s.movement.percent_high_air || 0;
      recentLowAir += s.movement.percent_low_air || 0;
    }

    if (s?.boost) {
      boostCount++;
      recentBpm += s.boost.bpm || 0;
      recentStolenBig += s.boost.count_stolen_big || 0;
      recentZeroBoost += s.boost.percent_zero_boost || 0;
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

  // Recent rates
  const avgG = recentMatches.length > 0 ? recentGoals / N : fallbackSession.goalsPerMatch;
  const avgSv = recentMatches.length > 0 ? recentSaves / N : fallbackSession.savesPerMatch;
  const avgA = recentMatches.length > 0 ? recentAssists / N : fallbackSession.assistsPerMatch;
  const avgSh = recentMatches.length > 0 ? recentShots / N : fallbackSession.shotsPerMatch;
  const rawAcc = avgSh > 0 ? (avgG / avgSh) * 100 : fallbackSession.shootingPercentage;
  const shootAcc = Math.min(100, Math.max(0, rawAcc));
  const avgScoreVal = recentMatches.length > 0 ? recentScore / N : fallbackSession.avgScore;

  const spd = movCount > 0 ? recentSpeed / mCnt : fallbackMov.avgSpeed;
  const superPct = movCount > 0 ? recentSuperPct / mCnt : fallbackMov.avgSupersonicPercent;
  const boostSpd = movCount > 0 ? recentBoostSpdPct / mCnt : fallbackMov.avgBoostSpeedPercent;
  const pSlides = movCount > 0 ? recentPowerslides / mCnt : fallbackMov.avgPowerslideCount;
  const hAir = movCount > 0 ? recentHighAir / mCnt : fallbackMov.avgHighAirPercent;
  const lAir = movCount > 0 ? recentLowAir / mCnt : fallbackMov.avgLowAirPercent;

  const bpm = boostCount > 0 ? recentBpm / bCnt : fallbackBoost.avgBpm;
  const stolen = boostCount > 0 ? recentStolenBig / bCnt : fallbackBoost.avgStolenBig;
  const zeroB = boostCount > 0 ? recentZeroBoost / bCnt : fallbackBoost.avgZeroBoostPercent;

  const defThird = posCount > 0 ? recentDefThird / pCnt : fallbackPos.avgDefensiveThird;
  const neuThird = posCount > 0 ? recentNeuThird / pCnt : fallbackPos.avgNeutralThird;
  const offThird = posCount > 0 ? recentOffThird / pCnt : fallbackPos.avgOffensiveThird;
  const behindB = posCount > 0 ? recentBehindBall / pCnt : fallbackPos.avgBehindBall;
  const infrontB = posCount > 0 ? recentInfrontBall / pCnt : fallbackPos.avgInfrontBall;
  const mostBack = posCount > 0 ? recentMostBack / pCnt : fallbackPos.avgMostBack;
  const mostFwd = posCount > 0 ? recentMostForward / pCnt : fallbackPos.avgMostForward;
  const distMates = posCount > 0 ? recentDistMates / pCnt : fallbackPos.avgDistanceToTeammate;

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

  // Momentum Multiplier (Phase Modifier: max +10 for historic runs, +2 to +4 for normal good form)
  let momentumBonus = 0;
  if (streakType === 'win') {
    momentumBonus += Math.min(4, streakCount * 1.5);
  } else if (streakType === 'loss') {
    momentumBonus -= Math.min(4, streakCount * 1.5);
  }

  if (recentWinRate >= 70) momentumBonus += 2;
  else if (recentWinRate <= 30) momentumBonus -= 2;

  // Impact Bonus based on points (Score) - Baseline 320 in competitive 2v2
  const scoreBonus = Math.max(0, Math.min(2, (avgScoreVal - 320) / 80));
  // Direct MVP contribution bonus based on MVP rate in recent matches
  const mvpBonus = Math.min(2, (recentMvps / N) * 4);
  momentumBonus += scoreBonus + mvpBonus;

  // 1. PAC (Pace: 45 - 99)
  const pacScore = 22 + (spd / 1550) * 35 + (superPct / 18) * 25 + (boostSpd / 42) * 18;
  const pac = Math.round(Math.min(99, Math.max(45, pacScore + (momentumBonus * 0.5))));

  // 2. SHO (Shooting: 40 - 99) - Calibrated: 1.0 g/j with 37% acc yields ~81 SHO
  const shoScore = 22 + (avgG / 1.4) * 42 + (shootAcc / 48) * 23 + (avgSh / 3.2) * 13;
  const sho = Math.round(Math.min(99, Math.max(40, shoScore + (momentumBonus * 0.45))));

  // 3. PAS (Passing: 45 - 99) - Calibrated: 0.7 a/j yields ~84 PAS
  const pasScore = 22 + (avgA / 1.0) * 45 + (distMates / 3300) * 20 + (mostFwd / 50) * 13;
  const pas = Math.round(Math.min(99, Math.max(45, pasScore + (momentumBonus * 0.45))));

  // 4. DRI (Mechanics: 45 - 99)
  const driScore = 22 + (pSlides / 90) * 30 + (hAir / 4.5) * 30 + (lAir / 32) * 18;
  const dri = Math.round(Math.min(99, Math.max(45, driScore + (momentumBonus * 0.5))));

  // 5. DEF (Defending: 45 - 99) - Calibrated: 1.5 saves yields ~82 DEF
  const defScore = 22 + (avgSv / 2.2) * 45 + (mostBack / 60) * 18 + (defThird / 50) * 10 + (behindB / 78) * 5;
  const def = Math.round(Math.min(99, Math.max(45, defScore + (momentumBonus * 0.4))));

  // 6. PHY (Physicality / Boost: 45 - 99)
  const phyScore = 22 + (stolen / 2.0) * 30 + (bpm / 420) * 30 + (dInf / 1.4) * 15 + Math.max(0, 5 - (zeroB / 12) * 5);
  const phy = Math.round(Math.min(99, Math.max(45, phyScore + (momentumBonus * 0.35))));

  // Dynamic Position Determination (ATA vs DEF only)
  let position: 'ATA' | 'DEF' = 'ATA';
  let positionLabel = 'Ataque';

  const attackDominance = sho + (avgG * 15);
  const defenseDominance = def + (avgSv * 15);

  if (defenseDominance > attackDominance) {
    position = 'DEF';
    positionLabel = 'Defensor';
  }

  // Position-Specific OVR Weighting
  let baseOvr = 0;
  if (position === 'ATA') {
    // Attack: SHO 35%, DRI 22%, PAC 20%, PAS 13%, PHY 6%, DEF 4%
    baseOvr = (sho * 0.35) + (dri * 0.22) + (pac * 0.20) + (pas * 0.13) + (phy * 0.06) + (def * 0.04);
  } else {
    // Defense: DEF 35%, PAS 22%, PHY 20%, PAC 13%, DRI 6%, SHO 4%
    baseOvr = (def * 0.35) + (pas * 0.22) + (phy * 0.20) + (pac * 0.13) + (dri * 0.06) + (sho * 0.04);
  }

  // Final OVR
  let ovr = Math.round(baseOvr);
  ovr = Math.min(99, Math.max(50, ovr));

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

function calculateRadarStats(
  session: SessionCoreSummary,
  pos: SessionPositioningSummary,
  boost: SessionBoostSummary,
  mov: SessionMovementSummary,
  demos: SessionDemoSummary
): PlaystyleRadarPoint[] {
  const aggGoals = Math.min(40, (session.goalsPerMatch / 2.0) * 40);
  const aggShots = Math.min(30, (session.shotsPerMatch / 4.0) * 30);
  const aggThird = Math.min(20, (pos.avgOffensiveThird / 35.0) * 20);
  const aggDemos = Math.min(10, (demos.avgInflicted / 1.5) * 10);
  const aggressiveness = Math.round(Math.min(100, Math.max(10, aggGoals + aggShots + aggThird + aggDemos)));

  const defSaves = Math.min(45, (session.savesPerMatch / 2.0) * 45);
  const defThird = Math.min(30, (pos.avgDefensiveThird / 50.0) * 30);
  const defBehind = Math.min(25, (pos.avgBehindBall / 75.0) * 25);
  const defense = Math.round(Math.min(100, Math.max(10, defSaves + defThird + defBehind)));

  const mechShoot = Math.min(30, (session.shootingPercentage / 50.0) * 30);
  const mechSuper = Math.min(35, (mov.avgSupersonicPercent / 22.0) * 35);
  const mechAir = Math.min(20, (mov.avgHighAirPercent / 5.0) * 20);
  const mechSpeed = Math.min(15, (mov.avgSpeed / 1600.0) * 15);
  const mechanics = Math.round(Math.min(100, Math.max(10, mechShoot + mechSuper + mechAir + mechSpeed)));

  const supAssists = Math.min(45, (session.assistsPerMatch / 1.2) * 45);
  const supSpacing = Math.min(30, (pos.avgDistanceToTeammate / 3500.0) * 30);
  const supInfront = Math.max(0, 25 - (pos.avgInfrontBall / 40.0) * 25);
  const support = Math.round(Math.min(100, Math.max(10, supAssists + supSpacing + supInfront)));

  const bBcpm = Math.min(35, (boost.avgBcpm / 500.0) * 35);
  const bStolen = Math.min(30, (boost.avgStolenBig / 3.0) * 30);
  const bZeroGood = Math.max(0, 35 - (boost.avgZeroBoostPercent / 15.0) * 35);
  const boostControl = Math.round(Math.min(100, Math.max(10, bBcpm + bStolen + bZeroGood)));

  return [
    { axis: 'Agressividade', value: aggressiveness ?? 50, fullMark: 100 },
    { axis: 'Contencao Defensiva', value: defense ?? 50, fullMark: 100 },
    { axis: 'Eficiencia Mecanica', value: mechanics ?? 50, fullMark: 100 },
    { axis: 'Suporte e Posicionamento', value: support ?? 50, fullMark: 100 },
    { axis: 'Controle de Boost', value: boostControl ?? 50, fullMark: 100 },
  ];
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
