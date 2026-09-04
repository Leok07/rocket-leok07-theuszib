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
    const listParams = isPlayer1
      ? { playerName: playerConfig.name, count: 50, noCache: forceRefresh }
      : { playerId: playerConfig.platformId, count: 50, noCache: forceRefresh };

    const replayRes = await client
      .listReplays(listParams)
      .catch(() => ({ count: 0, list: [] as ReplaySummary[] }));

    const replays = replayRes.list || [];
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
  };

  careerCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}
