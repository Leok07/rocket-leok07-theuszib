import { PingResponse, ReplayListParams, ReplayListResponse, ReplaySummary } from '@/types/ballchasing';

const BASE_URL = 'https://ballchasing.com/api';

export class BallchasingClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BALLCHASING_API_KEY || '';
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  private async fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`Tempo limite excedido (${timeoutMs / 1000}s) ao comunicar com Ballchasing.com`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  public async ping(): Promise<PingResponse> {
    if (!this.apiKey) {
      return {
        ball: 'is life',
        boost: 'over ball',
        chaser: true,
        name: 'Modo Offline (Sem Chave)',
        error: 'Chave de API nao configurada',
      };
    }

    try {
      const res = await this.fetchWithTimeout(`${BASE_URL}/`, {
        headers: this.getHeaders(),
        cache: 'no-store',
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Erro de autenticacao: HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || 'Falha ao conectar com Ballchasing.com');
    }
  }

  public async listReplays(params: ReplayListParams): Promise<ReplayListResponse> {
    if (!this.apiKey) {
      throw new Error('Chave de API nao fornecida');
    }

    const query = new URLSearchParams();

    // Support single or multiple player names using append (produces &player-name=A&player-name=B)
    if (params.playerNames && params.playerNames.length > 0) {
      for (const name of params.playerNames) {
        if (name) query.append('player-name', name);
      }
    } else if (params.playerName) {
      query.append('player-name', params.playerName);
    }

    // Support single or multiple player IDs
    if (params.playerIds && params.playerIds.length > 0) {
      for (const id of params.playerIds) {
        if (id) query.append('player-id', id);
      }
    } else if (params.playerId) {
      query.append('player-id', params.playerId);
    }
    
    // Only filter playlist if explicitly defined and not 'all'
    if (params.playlist && params.playlist !== 'all' && params.playlist !== 'all-2v2') {
      query.set('playlist', params.playlist);
    }

    query.set('count', String(params.count || 50));
    query.set('sort-by', params.sortBy || 'replay-date');
    query.set('sort-dir', params.sortDir || 'desc');

    if (params.after) query.set('after', params.after);
    if (params.before) query.set('before', params.before);

    const url = `${BASE_URL}/replays?${query.toString()}`;

    const fetchOptions: RequestInit = {
      headers: this.getHeaders(),
      ...(params.noCache ? { cache: 'no-store' } : { next: { revalidate: 60 } }),
    };

    const res = await this.fetchWithTimeout(url, fetchOptions);

    if (res.status === 429) {
      throw new Error('Limite de requisicoes excedido no Ballchasing.com (Rate limit 429). Aguarde alguns segundos.');
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Erro ao buscar replays: HTTP ${res.status}`);
    }

    return await res.json();
  }

  public async getReplay(id: string, options?: { noCache?: boolean }): Promise<ReplaySummary> {
    if (!this.apiKey) {
      throw new Error('Chave de API nao fornecida');
    }

    const url = `${BASE_URL}/replays/${id}`;

    const fetchOptions: RequestInit = {
      headers: this.getHeaders(),
      ...(options?.noCache ? { cache: 'no-store' } : { next: { revalidate: 3600 } }),
    };

    const res = await this.fetchWithTimeout(url, fetchOptions);

    if (res.status === 429) {
      throw new Error('Limite de requisicoes excedido (429). Aguarde alguns segundos.');
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Erro ao obter detalhes da partida: HTTP ${res.status}`);
    }

    return await res.json();
  }
}
