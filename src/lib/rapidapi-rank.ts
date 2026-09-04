import { CareerRankInfo } from '@/types/career';

interface RapidApiRankCacheEntry {
  data: CareerRankInfo | null;
  timestamp: number;
}

const rankCache = new Map<string, RapidApiRankCacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache to avoid rate limits

const DEFAULT_API_KEY = '9d9bc21862mshd4b1f1e6a0295b3p187138jsn20f40dd8a929';
const RAPIDAPI_HOST = 'rocket-league1.p.rapidapi.com';

/**
 * Maps player platform to RapidAPI expected format
 */
function getPlatformSlug(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes('epic')) return 'epic';
  if (p.includes('psn') || p.includes('playstation') || p.includes('ps4') || p.includes('ps5')) return 'psn';
  if (p.includes('xbox') || p.includes('xbl')) return 'xbl';
  if (p.includes('steam')) return 'steam';
  return 'epic';
}

/**
 * Dedicated, lightweight service to fetch ONLY 2v2 Competitive Rank & MMR from RapidAPI.
 * Features 30-minute in-memory caching and graceful error fallback.
 */
export async function fetchRapidApi2v2Rank(
  playerName: string,
  platform: string,
  forceRefresh = false
): Promise<CareerRankInfo | null> {
  const apiKey = process.env.RAPIDAPI_KEY || DEFAULT_API_KEY;
  const platformSlug = getPlatformSlug(platform);
  const cacheKey = `${platformSlug}:${playerName.toLowerCase()}`;
  const now = Date.now();

  const cached = rankCache.get(cacheKey);
  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (!apiKey) {
    return cached?.data || null;
  }

  try {
    const url = `https://${RAPIDAPI_HOST}/v2/ranks/${platformSlug}/${encodeURIComponent(playerName)}`;
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': RAPIDAPI_HOST,
        'User-Agent': 'TrackerRocket/1.5.0',
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      if (res.status === 429) {
        console.warn(`[RapidAPI Rank] Rate limit atingido para ${playerName}. Retornando cache.`);
        return cached?.data || null;
      }
      throw new Error(`RapidAPI retornou status ${res.status}`);
    }

    const payload = await res.json();
    const segments = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : payload?.segments || [];

    // Find Ranked Doubles 2v2 playlist segment
    const doublesSegment = segments.find((s: any) => {
      const name = (s?.playlist || s?.name || s?.metadata?.name || '').toLowerCase();
      return name.includes('doubles') || name.includes('2v2') || s?.playlistId === 11;
    });

    if (doublesSegment) {
      const rankName = doublesSegment.rank || doublesSegment.tier || doublesSegment.stats?.tier?.metadata?.name || 'Sem Rank';
      const division = doublesSegment.division || doublesSegment.stats?.division?.value || 1;
      const mmr = doublesSegment.rating || doublesSegment.mmr || doublesSegment.stats?.rating?.value || 0;
      const iconUrl = doublesSegment.iconUrl || doublesSegment.stats?.tier?.metadata?.iconUrl || '';

      const rankInfo: CareerRankInfo = {
        playlist: 'Ranked Doubles 2v2',
        rank: rankName,
        division: Number(division),
        mmr: Number(mmr),
        iconUrl,
      };

      rankCache.set(cacheKey, { data: rankInfo, timestamp: now });
      return rankInfo;
    }
  } catch (err: any) {
    console.warn(`[RapidAPI Rank] Nao foi possivel buscar rank para ${playerName}:`, err.message);
  }

  return cached?.data || null;
}
