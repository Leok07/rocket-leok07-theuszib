import { NextRequest, NextResponse } from 'next/server';
import { BallchasingClient } from '@/lib/ballchasing';
import { fetchReplayDetailsWithPacing } from '@/lib/replay-fetcher';
import { calculateAggregatedDashboard, findPlayerDataInReplay, getTeamGoals, createEmptyDashboard } from '@/lib/stats-calculator';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { ReplaySummary } from '@/types/ballchasing';
import { SharedMatchItem } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// In-memory cache
let cachedResponse: {
  data: any;
  timestamp: number;
  playlist: string;
} | null = null;

// Persistent cache for completed replays (match data is immutable)
const replayDetailCache = new Map<string, ReplaySummary>();

const CACHE_TTL_MS = 30 * 1000;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const playlist = searchParams.get('playlist') || 'all';

    const now = Date.now();
    if (!forceRefresh && cachedResponse && cachedResponse.playlist === playlist && now - cachedResponse.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        ...cachedResponse.data,
        isCached: true,
      });
    }

    const client = new BallchasingClient();

    // 1. Fetch replays from both player profiles sequentially to respect Ballchasing 2 req/s limit
    const replayMap = new Map<string, ReplaySummary>();

    try {
      // Query Player 1 (Leok07)
      const resP1 = await client
        .listReplays({ playerName: PLAYER_1.name, playlist, count: 50, noCache: forceRefresh })
        .catch(() => ({ count: 0, list: [] }));

      for (const r of resP1.list || []) {
        if (r.id) replayMap.set(r.id, r);
      }

      // Small delay to protect Free-tier rate limits
      await new Promise((res) => setTimeout(res, 550));

      // Query Player 2 (Theuszrib / theusrib on PSN)
      const resP2 = await client
        .listReplays({ playerId: PLAYER_2.platformId, playlist, count: 50, noCache: forceRefresh })
        .catch(() => ({ count: 0, list: [] }));

      for (const r of resP2.list || []) {
        if (r.id) replayMap.set(r.id, r);
      }
    } catch (e) {
      // Continue with whatever was gathered
    }

    const allReplays = Array.from(replayMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (allReplays.length === 0) {
      if (cachedResponse?.data) {
        return NextResponse.json({ ...cachedResponse.data, isCachedFallback: true });
      }
      return NextResponse.json({
        success: true,
        data: {
          player1: createEmptyDashboard(PLAYER_1.name, PLAYER_1.platform, PLAYER_1.platformId),
          player2: createEmptyDashboard(PLAYER_2.name, PLAYER_2.platform, PLAYER_2.platformId),
          sharedMatches: [],
        },
        isMock: false,
      });
    }

    // Pre-filter: identify matches where BOTH players are confirmed on the SAME team
    const checkPlayerInTeam = (team: any, searchNames: string[]): boolean => {
      const players = team?.players || [];
      return players.some((p: any) => {
        const name = (p.name || '').toLowerCase().trim();
        return searchNames.some((s) => name.includes(s.toLowerCase()));
      });
    };

    const p1Names = [PLAYER_1.name, ...PLAYER_1.searchNames];
    const p2Names = [PLAYER_2.name, ...PLAYER_2.searchNames];

    const confirmedDuoReplays = allReplays.filter((r) => {
      const p1InBlue = checkPlayerInTeam(r.blue, p1Names);
      const p2InBlue = checkPlayerInTeam(r.blue, p2Names);
      const p1InOrange = checkPlayerInTeam(r.orange, p1Names);
      const p2InOrange = checkPlayerInTeam(r.orange, p2Names);
      return (p1InBlue && p2InBlue) || (p1InOrange && p2InOrange);
    });

    const candidateReplays = confirmedDuoReplays.length >= 5 ? confirmedDuoReplays : allReplays;

    // 2. Fetch full telemetry for EXACTLY the top 20 confirmed duo matches
    const maxDetailed = Math.min(candidateReplays.length, 20);
    const topReplayIds = candidateReplays.slice(0, maxDetailed).map((r) => r.id);

    const detailedSharedReplays = await fetchReplayDetailsWithPacing(client, topReplayIds, {
      noCache: forceRefresh,
      delayMs: 300,
      cache: replayDetailCache,
    });

    // 3. Build SharedMatchItem list with strict same-team validation
    const sharedMatches: SharedMatchItem[] = [];
    const validSharedTeamReplays: ReplaySummary[] = [];

    for (const r of detailedSharedReplays) {
      const p1Data = findPlayerDataInReplay(r, {
        name: PLAYER_1.name,
        searchNames: [...PLAYER_1.searchNames],
        platform: PLAYER_1.platform,
        platformId: PLAYER_1.platformId,
      });
      const p2Data = findPlayerDataInReplay(r, {
        name: PLAYER_2.name,
        searchNames: [...PLAYER_2.searchNames],
        platform: PLAYER_2.platform,
        platformId: PLAYER_2.platformId,
      });

      if (p1Data && p2Data) {
        const sameTeam = p1Data.isBlue === p2Data.isBlue;
        
        // Strict Duo Verification: Only matches played on the SAME team count as shared duo games
        if (!sameTeam) {
          continue;
        }

        // Only include matches that actually have detailed stats to prevent "0 goals" data corruption
        const hasDetailedStats = !!(p1Data.player.stats?.core && p2Data.player.stats?.core);
        if (!hasDetailedStats) {
          continue;
        }

        validSharedTeamReplays.push(r);

        const blueGoals = getTeamGoals(r.blue);
        const orangeGoals = getTeamGoals(r.orange);
        const teamGoals = p1Data.isBlue ? blueGoals : orangeGoals;
        const opponentGoals = p1Data.isBlue ? orangeGoals : blueGoals;
        const result: 'win' | 'loss' = teamGoals > opponentGoals ? 'win' : 'loss';

        sharedMatches.push({
          id: r.id,
          date: r.date,
          formattedDate: formatDate(r.date),
          mapName: r.map_name || r.map_code || 'Estadio',
          teamGoals,
          opponentGoals,
          result,
          sameTeam: true,
          durationSeconds: r.duration || 300,
          isOvertime: !!r.overtime,
          p1Goals: p1Data.player.stats?.core?.goals || 0,
          p1Assists: p1Data.player.stats?.core?.assists || 0,
          p1Saves: p1Data.player.stats?.core?.saves || 0,
          p1Score: p1Data.player.stats?.core?.score || p1Data.player.score || 0,
          p1Bpm: Math.round(p1Data.player.stats?.boost?.bpm || 0),
          p2Goals: p2Data.player.stats?.core?.goals || 0,
          p2Assists: p2Data.player.stats?.core?.assists || 0,
          p2Saves: p2Data.player.stats?.core?.saves || 0,
          p2Score: p2Data.player.stats?.core?.score || p2Data.player.score || 0,
          p2Bpm: Math.round(p2Data.player.stats?.boost?.bpm || 0),
        });
      }
    }

    const replaysForDashboard = validSharedTeamReplays.length > 0 ? validSharedTeamReplays : detailedSharedReplays;

    // 4. Calculate aggregated comparison specifically for verified shared matches
    const dashboardP1 = calculateAggregatedDashboard(replaysForDashboard, {
      name: PLAYER_1.name,
      searchNames: [...PLAYER_1.searchNames],
      platform: PLAYER_1.platform,
      platformId: PLAYER_1.platformId,
    });

    const dashboardP2 = calculateAggregatedDashboard(replaysForDashboard, {
      name: PLAYER_2.name,
      searchNames: [...PLAYER_2.searchNames],
      platform: PLAYER_2.platform,
      platformId: PLAYER_2.platformId,
    });

    const responsePayload = {
      success: true,
      data: {
        player1: dashboardP1,
        player2: dashboardP2,
        sharedMatches,
      },
      isRealP1: true,
      isRealP2: true,
      isMock: false,
    };

    cachedResponse = {
      data: responsePayload,
      timestamp: Date.now(),
      playlist,
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('Erro na rota /api/compare:', error);
    if (cachedResponse?.data) {
      return NextResponse.json({ ...cachedResponse.data, isCachedFallback: true });
    }
    return NextResponse.json({
      success: true,
      data: {
        player1: createEmptyDashboard(PLAYER_1.name, PLAYER_1.platform, PLAYER_1.platformId),
        player2: createEmptyDashboard(PLAYER_2.name, PLAYER_2.platform, PLAYER_2.platformId),
        sharedMatches: [],
      },
      isMock: false,
    });
  }
}
