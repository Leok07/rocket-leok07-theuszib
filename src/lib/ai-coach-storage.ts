import fs from 'fs/promises';
import path from 'path';
import { AiCoachAnalysis } from '../types/ai-coach';

export interface LastAnalyzedMatchMeta {
  matchId: string;
  matchDate: string;
}

// Check whether a remote KV/Redis store is configured via environment variables
function hasRemoteKvConfig(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

// Get remote KV client dynamically
async function getRemoteKvClient() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import('@vercel/kv');
      return kv;
    } catch {
      // Fallback below
    }
  }

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = await import('@upstash/redis');
      return Redis.fromEnv();
    } catch {
      // Fallback below
    }
  }

  return null;
}

// Local filesystem paths (uses /tmp on Vercel Serverless to prevent read-only filesystem crash)
function getLocalCacheDir(): string {
  if (process.env.VERCEL) {
    return path.join('/tmp', '.cache');
  }
  return path.join(process.cwd(), '.cache');
}

function getLocalCacheFile(): string {
  return path.join(getLocalCacheDir(), 'ai-coach-cache.json');
}

function getLocalMetaFile(): string {
  return path.join(getLocalCacheDir(), 'ai-coach-last-match.json');
}

/**
 * Read AI Coach analysis from cache (KV remote or local disk fallback)
 */
export async function readAiCoachCache(cacheKey: string): Promise<AiCoachAnalysis | null> {
  // 1. Try remote KV/Redis if configured
  if (hasRemoteKvConfig()) {
    try {
      const client = await getRemoteKvClient();
      if (client) {
        const data = await client.get<AiCoachAnalysis>(`ai-coach:${cacheKey}`);
        if (data) {
          return data;
        }
      }
    } catch (err: any) {
      console.warn('[ai-coach-storage] Falha ao ler do KV/Redis remoto, tentando fallback local:', err?.message);
    }
  }

  // 2. Local filesystem fallback
  try {
    const raw = await fs.readFile(getLocalCacheFile(), 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.cacheKey === cacheKey && parsed.data) {
      return parsed.data;
    }
  } catch {
    // Cache miss or file doesn't exist
  }

  return null;
}

/**
 * Write AI Coach analysis to cache (KV remote or local disk fallback)
 */
export async function writeAiCoachCache(cacheKey: string, data: AiCoachAnalysis): Promise<void> {
  // 1. Try remote KV/Redis if configured
  if (hasRemoteKvConfig()) {
    try {
      const client = await getRemoteKvClient();
      if (client) {
        // Cache indefinitely or 30 days
        await client.set(`ai-coach:${cacheKey}`, data);
      }
    } catch (err: any) {
      console.warn('[ai-coach-storage] Falha ao gravar no KV/Redis remoto:', err?.message);
    }
  }

  // 2. Local filesystem fallback
  try {
    const dir = getLocalCacheDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      getLocalCacheFile(),
      JSON.stringify({ cacheKey, updatedAt: data.metadata?.generatedAt, data }, null, 2),
      'utf-8'
    );
  } catch (err: any) {
    // Graceful warning for read-only filesystem environments
    console.warn('[ai-coach-storage] Nao foi possivel persistir cache no disco local:', err?.message);
  }
}

/**
 * Fase 4: Read metadata of last analyzed match
 */
export async function getLastAnalyzedMatch(): Promise<LastAnalyzedMatchMeta | null> {
  if (hasRemoteKvConfig()) {
    try {
      const client = await getRemoteKvClient();
      if (client) {
        const meta = await client.get<LastAnalyzedMatchMeta>('ai-coach:last-analyzed-match');
        if (meta) {
          return meta;
        }
      }
    } catch (err: any) {
      console.warn('[ai-coach-storage] Falha ao ler last-analyzed-match do KV:', err?.message);
    }
  }

  try {
    const raw = await fs.readFile(getLocalMetaFile(), 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.matchId && parsed.matchDate) {
      return parsed;
    }
  } catch {
    // File not found or empty
  }

  return null;
}

/**
 * Fase 4: Record metadata of last analyzed match
 */
export async function setLastAnalyzedMatch(meta: LastAnalyzedMatchMeta): Promise<void> {
  if (hasRemoteKvConfig()) {
    try {
      const client = await getRemoteKvClient();
      if (client) {
        await client.set('ai-coach:last-analyzed-match', meta);
      }
    } catch (err: any) {
      console.warn('[ai-coach-storage] Falha ao gravar last-analyzed-match no KV:', err?.message);
    }
  }

  try {
    const dir = getLocalCacheDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(getLocalMetaFile(), JSON.stringify(meta, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[ai-coach-storage] Nao foi possivel gravar last-match no disco local:', err?.message);
  }
}
