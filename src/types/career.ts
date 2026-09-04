export interface CareerRankInfo {
  playlist: string;
  rank: string;
  division: number;
  mmr: number;
  iconUrl?: string;
}

export type CareerApiStatus =
  | 'CONNECTED'
  | 'BALLCHASING_ARCHIVE'
  | 'GATEWAY_502_UNREACHABLE'
  | 'RATE_LIMITED_429'
  | 'NO_API_KEY'
  | 'FALLBACK_ACTIVE';

export interface CareerPlayerStats {
  playerName: string;
  platform: string;
  platformLabel: string;
  avatarUrl?: string;
  presence?: string;
  estimatedMatches: number;
  wins: number;
  winRate: number;
  goals: number;
  goalsPerMatch: number;
  saves: number;
  savesPerMatch: number;
  assists: number;
  assistsPerMatch: number;
  shots: number;
  shotsPerMatch: number;
  shootingPercentage: number;
  mvps: number;
  mvpRate: number; // MVPs / Wins %
  rank2v2?: CareerRankInfo;
  isMockFallback?: boolean;
  apiStatus?: CareerApiStatus;
  apiMessage?: string;
}

export interface CareerComparisonData {
  player1: CareerPlayerStats;
  player2: CareerPlayerStats;
  comparison: {
    goalsLeader: 'p1' | 'p2' | 'tie';
    savesLeader: 'p1' | 'p2' | 'tie';
    winRateLeader: 'p1' | 'p2' | 'tie';
    mvpRateLeader: 'p1' | 'p2' | 'tie';
  };
  apiStatus?: CareerApiStatus;
  apiMessage?: string;
  lastSynced: string;
}

