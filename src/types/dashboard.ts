import { ReplaySummary, Platform } from './ballchasing';

export interface SessionCoreSummary {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  totalGoals: number;
  goalsPerMatch: number;
  totalAssists: number;
  assistsPerMatch: number;
  totalSaves: number;
  savesPerMatch: number;
  totalShots: number;
  shotsPerMatch: number;
  shootingPercentage: number;
  avgScore: number;
  mvpCount: number;
  avgDurationSeconds: number;
  overtimeCount: number;
}

export interface SessionPositioningSummary {
  avgDefensiveThird: number;
  avgNeutralThird: number;
  avgOffensiveThird: number;
  avgDefensiveHalf: number;
  avgOffensiveHalf: number;
  avgBehindBall: number;
  avgInfrontBall: number;
  avgDistanceToTeammate: number;
  avgDistanceToBall: number;
  avgMostBack: number;
  avgMostForward: number;
}

export interface SessionBoostSummary {
  avgBpm: number;
  avgBcpm: number;
  avgAmount: number;
  avgStolenBig: number;
  avgStolenSmall: number;
  totalStolenBig: number;
  avgCollectedBig: number;
  avgCollectedSmall: number;
  avgSupersonicWaste: number;
  avgZeroBoostPercent: number;
  avgFullBoostPercent: number;
  avgOverfill: number;
  boostDistribution: {
    range0_25: number;
    range25_50: number;
    range50_75: number;
    range75_100: number;
  };
}

export interface SessionMovementSummary {
  avgSpeed: number;
  avgSpeedPercentage: number;
  avgSupersonicPercent: number;
  avgBoostSpeedPercent: number;
  avgSlowSpeedPercent: number;
  avgGroundPercent: number;
  avgLowAirPercent: number;
  avgHighAirPercent: number;
  avgPowerslideCount: number;
  avgPowerslideDuration: number;
  totalDistance: number;
}

export interface SessionDemoSummary {
  totalInflicted: number;
  totalTaken: number;
  avgInflicted: number;
  avgTaken: number;
  demoRatio: number;
}

export interface PlaystyleRadarPoint {
  axis: string;
  value: number; // 0 to 100
  fullMark: number;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  mapName: string;
  result: 'win' | 'loss';
  scoreTeam: number;
  scoreOpponent: number;
  duration: number;
  isOvertime: boolean;
  goals: number;
  assists: number;
  saves: number;
  shots: number;
  score: number;
  bpm: number;
  supersonicPercent: number;
  demoInflicted: number;
}

export interface TrendHistoryPoint {
  matchIndex: number;
  date: string;
  result: 'win' | 'loss';
  winRateRolling: number;
  goals: number;
  saves: number;
  bpm: number;
  speed: number;
  boostStolen: number;
  supersonicPercent: number;
}

export interface SharedMatchItem {
  id: string;
  date: string;
  formattedDate: string;
  mapName: string;
  teamGoals: number;
  opponentGoals: number;
  result: 'win' | 'loss';
  sameTeam: boolean;
  durationSeconds: number;
  isOvertime: boolean;
  p1Goals: number;
  p1Assists: number;
  p1Saves: number;
  p1Score: number;
  p1Bpm: number;
  p2Goals: number;
  p2Assists: number;
  p2Saves: number;
  p2Score: number;
  p2Bpm: number;
}

export type FutCardTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'totw'
  | 'hero'
  | 'totw_hero'
  | 'icon'
  | 'icon_totw'
  | 'icon_hero'
  | 'goat';

export interface FutCardStats {
  ovr: number;
  tier: FutCardTier;
  position: 'ATA' | 'DEF';
  positionLabel: string; // 'Ataque', 'Defensor'
  pac: number; // Pace / Speed
  sho: number; // Shooting / Finishing
  pas: number; // Passing / Playmaking
  dri: number; // Dribbling / Aerial Mechanics
  def: number; // Defending / Saves & Positioning
  phy: number; // Physical / Boost & Demos
  streakCount: number;
  streakType: 'win' | 'loss' | 'neutral';
  recentWinRate: number;
  recentMatchesCount: number;
  nickname: string;
  nicknameCategory?: string;
  isNegativeNickname?: boolean;
  recentGoals: number;
  recentAssists: number;
  recentSaves: number;
  recentShots: number;
  recentMvps: number;
  recentMvpStreak: number;
  recentAvgScore: number;
}

export interface AggregatedPlayerDashboard {
  playerName: string;
  platform?: Platform;
  platformId?: string;
  replaysAnalyzed: number;
  session: SessionCoreSummary;
  positioning: SessionPositioningSummary;
  boost: SessionBoostSummary;
  movement: SessionMovementSummary;
  demos: SessionDemoSummary;
  radar: PlaystyleRadarPoint[];
  futStats?: FutCardStats;
  matchHistory: MatchHistoryItem[];
  trendHistory: TrendHistoryPoint[];
  replays: ReplaySummary[];
}

export interface PlayerComparisonData {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
  sharedMatches?: SharedMatchItem[];
}
