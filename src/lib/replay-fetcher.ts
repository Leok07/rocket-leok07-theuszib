import { BallchasingClient } from './ballchasing';
import { ReplaySummary } from '@/types/ballchasing';

export interface FetchPacingOptions {
  noCache?: boolean;
  delayMs?: number;
  cache?: Map<string, ReplaySummary>;
}

/**
 * Shared helper for fetching replay details sequentially with rate limit protection (429 retry),
 * safe pacing delay (default 550ms) and optional in-memory caching.
 */
export async function fetchReplayDetailsWithPacing(
  client: BallchasingClient,
  replayIds: string[],
  options: FetchPacingOptions = {}
): Promise<ReplaySummary[]> {
  const { noCache = false, delayMs = 300, cache } = options;
  const results: ReplaySummary[] = [];

  for (let i = 0; i < replayIds.length; i++) {
    const id = replayIds[i];

    if (!noCache && cache?.has(id)) {
      results.push(cache.get(id)!);
      continue;
    }

    let detail: ReplaySummary | null = null;
    try {
      detail = await client.getReplay(id, { noCache });
    } catch (err: any) {
      if (err.message && (err.message.includes('429') || err.message.includes('Rate limit'))) {
        // Wait and retry once on rate limit
        await new Promise((r) => setTimeout(r, Math.max(delayMs * 2, 1200)));
        detail = await client.getReplay(id, { noCache }).catch(() => null);
      }
    }

    if (detail && (detail.blue?.players?.length || detail.orange?.players?.length)) {
      if (cache) {
        cache.set(id, detail);
      }
      results.push(detail);
    }

    // Pacing delay between requests to preserve Ballchasing 2 req/s limit
    if (i < replayIds.length - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return results;
}
