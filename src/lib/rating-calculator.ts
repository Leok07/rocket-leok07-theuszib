import { AggregatedPlayerDashboard } from '@/types/dashboard';

export interface RLRatingPillars {
  combat: number;      // 30% weight: Gols/5m, Chutes/5m, Precisao de chute
  impact: number;      // 25% weight: Pontuacao/min, Taxa de MVP, Demos infligidos
  defense: number;     // 20% weight: Saves/5m, Posicionamento defensivo (goal-side e metade defensiva)
  support: number;     // 15% weight: Assists/5m, Presenca no terco ofensivo
  efficiency: number;  // 10% weight: Velocidade media, tempo supersonico e economia de boost
}

export interface RLRatingResult {
  overallRating: number;
  tierLabel: string;
  tierColor: string;
  pillars: RLRatingPillars;
}

// Benchmark reference constants for competitive Champion 2v2 (1.00 = expected solid performance)
const BENCHMARKS = {
  combat: {
    goalsPerMatch: 1.00,
    shotsPerMatch: 2.60,
    shootingAccuracy: 40.0,
  },
  impact: {
    scorePerMatch: 420.0,
    mvpRate: 40.0,
    demosPerMatch: 1.0,
  },
  defense: {
    savesPerMatch: 1.10,
    behindBallPct: 68.0,
    defensiveHalfPct: 52.0,
  },
  support: {
    assistsPerMatch: 0.60,
    offensiveThirdPct: 30.0,
  },
  efficiency: {
    speed: 1280.0,
    supersonicPct: 5.0,
    zeroBoostPctMax: 10.0,
  },
};

export function calculateRLRating(player: AggregatedPlayerDashboard): RLRatingResult {
  const s = player.session;
  const b = player.boost;
  const p = player.positioning;
  const m = player.movement;
  const d = player.demos;

  const totalMatches = Math.max(s.totalMatches || 1, 1);

  // 1. Combate & Finalizacao (30%)
  const gRatio = (s.goalsPerMatch || 0) / BENCHMARKS.combat.goalsPerMatch;
  const shRatio = (s.shotsPerMatch || 0) / BENCHMARKS.combat.shotsPerMatch;
  const accRatio = (s.shootingPercentage || 0) / BENCHMARKS.combat.shootingAccuracy;
  const combatRating = Number(((gRatio * 0.50 + shRatio * 0.25 + accRatio * 0.25)).toFixed(2));

  // 2. Impacto & Decisao (25%)
  const scoreRatio = (s.avgScore || 0) / BENCHMARKS.impact.scorePerMatch;
  const mvpRatio = s.wins > 0 ? ((s.mvpCount || 0) / s.wins * 100) / BENCHMARKS.impact.mvpRate : 0.8;
  const demoRatio = (d.avgInflicted || 0) / BENCHMARKS.impact.demosPerMatch;
  const impactRating = Number(((scoreRatio * 0.40 + mvpRatio * 0.35 + demoRatio * 0.25)).toFixed(2));

  // 3. Solidez Defensiva (20%)
  const svRatio = (s.savesPerMatch || 0) / BENCHMARKS.defense.savesPerMatch;
  const behindRatio = (p.avgBehindBall || 60) / BENCHMARKS.defense.behindBallPct;
  const defHalfRatio = (p.avgDefensiveHalf || 48) / BENCHMARKS.defense.defensiveHalfPct;
  const defenseRating = Number(((svRatio * 0.55 + behindRatio * 0.25 + defHalfRatio * 0.20)).toFixed(2));

  // 4. Criacao & Suporte (15%)
  const aRatio = (s.assistsPerMatch || 0) / BENCHMARKS.support.assistsPerMatch;
  const offThirdRatio = (p.avgOffensiveThird || 28) / BENCHMARKS.support.offensiveThirdPct;
  const supportRating = Number(((aRatio * 0.60 + offThirdRatio * 0.40)).toFixed(2));

  // 5. Eficiencia & Movimento (10%)
  const spdRatio = (m.avgSpeed || 1200) / BENCHMARKS.efficiency.speed;
  const superRatio = (m.avgSupersonicPercent || 4.5) / BENCHMARKS.efficiency.supersonicPct;
  const zeroBoostPenalty = Math.max(0.5, 1.15 - ((b.avgZeroBoostPercent || 8) / BENCHMARKS.efficiency.zeroBoostPctMax) * 0.3);
  const efficiencyRating = Number(((spdRatio * 0.40 + superRatio * 0.30 + zeroBoostPenalty * 0.30)).toFixed(2));

  // Composite RLRating 3.0 Formula
  const overall = Number((
    combatRating * 0.30 +
    impactRating * 0.25 +
    defenseRating * 0.20 +
    supportRating * 0.15 +
    efficiencyRating * 0.10
  ).toFixed(2));

  // Tier Classification
  let tierLabel = 'Solido';
  let tierColor = 'text-sky-400 bg-sky-950/80 border-sky-700/60';

  if (overall >= 1.30) {
    tierLabel = 'Dominante (Elite)';
    tierColor = 'text-amber-300 bg-amber-950/80 border-amber-600/70';
  } else if (overall >= 1.15) {
    tierLabel = 'Alto Impacto';
    tierColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-700/60';
  } else if (overall >= 1.00) {
    tierLabel = 'Solido (Na Media)';
    tierColor = 'text-sky-300 bg-sky-950/80 border-sky-700/60';
  } else if (overall >= 0.85) {
    tierLabel = 'Abaixo da Media';
    tierColor = 'text-orange-300 bg-orange-950/80 border-orange-700/60';
  } else {
    tierLabel = 'Critico';
    tierColor = 'text-rose-300 bg-rose-950/80 border-rose-700/60';
  }

  return {
    overallRating: overall,
    tierLabel,
    tierColor,
    pillars: {
      combat: combatRating,
      impact: impactRating,
      defense: defenseRating,
      support: supportRating,
      efficiency: efficiencyRating,
    },
  };
}
