export interface AiCoachSynergy {
  score: number; // 0 to 100
  verdict: string;
  summary: string;
}

export interface AiCoachMacroOverview {
  matchCount: number;
  winRate: number;
  offensiveDynamics: string;
  defensiveAnchor: string;
  boostEconomy: string;
  keyStrengths: string[];
  bottlenecks: string[];
}

export interface AiCoachRecentMicro {
  matchCount: number;
  trend: 'alta' | 'estavel' | 'alerta';
  keyShift: string;
  hotPlayer: string;
  criticalNotice: string;
}

export interface AiCoachLeakage {
  title: string;
  severity: 'critica' | 'moderada' | 'leve';
  metricTrigger: string;
  impact: string;
  correction: string;
}

export interface AiCoachRoadToGc {
  step: string;
  priority: string;
  drill: string;
  targetMetric: string;
}

export interface AiCoachGameplanRule {
  number: number;
  title: string;
  trigger: string;
  action: string;
}

export interface AiCoachAnalysis {
  synergy: AiCoachSynergy;
  macroOverview: AiCoachMacroOverview;
  recentFormMicro: AiCoachRecentMicro;
  leakageDiagnosis: AiCoachLeakage[];
  roadToGc: AiCoachRoadToGc[];
  gameplanRules: AiCoachGameplanRule[];
  metadata: {
    generatedAt: string;
    cacheKey: string;
    totalMatchesAnalyzed: number;
    source: 'gemini' | 'cache' | 'heuristic';
    modelUsed: string;
  };
}

export interface AiCoachRequestBody {
  cacheKey: string;
  forceRefresh?: boolean;
  player1: {
    name: string;
    stats: Record<string, any>;
    recentStats?: Record<string, any>;
  };
  player2: {
    name: string;
    stats: Record<string, any>;
    recentStats?: Record<string, any>;
  };
  sharedMatchesSummary: {
    totalMatches: number;
    recentMatchesCount: number;
    wins: number;
    losses: number;
    matchIds: string[];
    latestMatchDate: string;
  };
}

export interface AiCoachApiResponse {
  success: boolean;
  cached: boolean;
  data: AiCoachAnalysis;
  error?: string;
}
