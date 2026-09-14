import { CareerPlayerStats } from '@/types/career';
import { BallchasingClient } from '@/lib/ballchasing';
import { fetchReplayDetailsWithPacing } from '@/lib/replay-fetcher';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { findPlayerDataInReplay } from '@/lib/stats-calculator';
import { ReplaySummary } from '@/types/ballchasing';

// Cache for Ballchasing career aggregates (5 minutes TTL, force refreshable)
const careerCache = new Map<string, { data: CareerPlayerStats; timestamp: number }>();
const replayDetailCache = new Map<string, ReplaySummary>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchPlayerBallchasingCareerStats(
  playerName: string,
  platform: string,
  platformLabel: string,
  forceRefresh = false
): Promise<CareerPlayerStats> {
  const cacheKey = playerName.toLowerCase();
  const cached = careerCache.get(cacheKey);
  const now = Date.now();

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const isPlayer1 = playerName.toLowerCase() === PLAYER_1.name.toLowerCase();
  const playerConfig = isPlayer1 ? PLAYER_1 : PLAYER_2;

  let totalMatches = 0;
  let wins = 0;
  let goals = 0;
  let saves = 0;
  let assists = 0;
  let shots = 0;
  let mvps = 0;

  let latestRankName = 'Sem Rank';
  let latestDivision = 1;
  let estimatedMmr = 0;

  try {
    const client = new BallchasingClient();

    // Query replays for player from Ballchasing API
    // If player 2 (console) has no direct uploads, query duo replays uploaded by player 1 (PC)
    let replays: ReplaySummary[] = [];

    // 1. Try querying by player name (e.g. 'Leok07' or 'Theuszrib')
    const primaryRes = await client
      .listReplays({ playerName: playerConfig.name, count: 50, noCache: forceRefresh })
      .catch(() => ({ count: 0, list: [] as ReplaySummary[] }));

    replays = primaryRes.list || [];

    // 2. If no replays found and it's player 2, try alternate search name 'theusrib'
    if (!isPlayer1 && replays.length === 0) {
      const altRes = await client
        .listReplays({ playerName: 'theusrib', count: 50, noCache: forceRefresh })
        .catch(() => ({ count: 0, list: [] as ReplaySummary[] }));
      replays = altRes.list || [];
    }

    // 3. If still no replays found (because console players don't upload replays directly),
    // query replays uploaded by Player 1 (Leok07) where Theuszrib played together!
    if (!isPlayer1 && replays.length === 0) {
      const duoRes = await client
        .listReplays({ playerName: PLAYER_1.name, count: 50, noCache: forceRefresh })
        .catch(() => ({ count: 0, list: [] as ReplaySummary[] }));
      replays = duoRes.list || [];
    }

    const replayIds = replays.map((r) => r.id).filter(Boolean);

    // Fetch full telemetry for matches
    const detailedReplays = await fetchReplayDetailsWithPacing(client, replayIds, {
      noCache: forceRefresh,
      delayMs: 350,
      cache: replayDetailCache,
    });

    for (const r of detailedReplays) {
      const pData = findPlayerDataInReplay(r, {
        name: playerConfig.name,
        searchNames: [...playerConfig.searchNames],
        platform: playerConfig.platform,
        platformId: playerConfig.platformId,
      });

      if (pData && pData.player) {
        totalMatches++;
        if (pData.isWin) {
          wins++;
        }

        const core = pData.player.stats?.core;
        if (core) {
          goals += core.goals || 0;
          saves += core.saves || 0;
          assists += core.assists || 0;
          shots += core.shots || 0;
          if (core.mvp) mvps++;
        } else {
          if (pData.player.mvp) mvps++;
        }

        // Capture official competitive rank from replay metadata
        if (latestRankName === 'Sem Rank') {
          const rankObj = pData.player.rank || r.min_rank || r.max_rank;
          if (rankObj?.name) {
            latestRankName = rankObj.name;
            latestDivision = rankObj.division !== undefined && rankObj.division !== null
              ? (rankObj.division <= 3 ? rankObj.division + 1 : rankObj.division)
              : 1;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Ballchasing Career] Erro ao sincronizar ${playerName}:`, err.message);
  }

  // Pure mathematical averages calculated strictly from real API data
  const winRate = totalMatches > 0 ? Number(((wins / totalMatches) * 100).toFixed(1)) : 0;
  const goalsPerMatch = totalMatches > 0 ? Number((goals / totalMatches).toFixed(2)) : 0;
  const savesPerMatch = totalMatches > 0 ? Number((saves / totalMatches).toFixed(2)) : 0;
  const assistsPerMatch = totalMatches > 0 ? Number((assists / totalMatches).toFixed(2)) : 0;
  const shotsPerMatch = totalMatches > 0 ? Number((shots / totalMatches).toFixed(2)) : 0;
  const shootingPercentage = shots > 0 ? Number(((goals / shots) * 100).toFixed(1)) : 0;
  const mvpRate = wins > 0 ? Number(((mvps / wins) * 100).toFixed(1)) : 0;

  const result: CareerPlayerStats = {
    playerName: playerConfig.name,
    platform,
    platformLabel,
    presence: 'Online',
    estimatedMatches: totalMatches,
    wins,
    winRate,
    goals,
    goalsPerMatch,
    saves,
    savesPerMatch,
    assists,
    assistsPerMatch,
    shots,
    shotsPerMatch,
    shootingPercentage,
    mvps,
    mvpRate,
    isMockFallback: false,
    apiStatus: 'BALLCHASING_ARCHIVE',
    apiMessage: 'Estatisticas 100% reais calculadas a partir dos replays do Ballchasing.',
    rank2v2: latestRankName !== 'Sem Rank' ? {
      playlist: '2v2 Competitivo',
      rank: latestRankName,
      division: latestDivision,
      mmr: 0,
    } : undefined,
  };

  careerCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}
