import {
  SessionCoreSummary,
  SessionPositioningSummary,
  SessionBoostSummary,
  SessionMovementSummary,
  SessionDemoSummary,
  PlaystyleRadarPoint,
} from '@/types/dashboard';

export function calculateRadarStats(
  session: SessionCoreSummary,
  pos: SessionPositioningSummary,
  boost: SessionBoostSummary,
  mov: SessionMovementSummary,
  demos: SessionDemoSummary
): PlaystyleRadarPoint[] {
  const aggGoals = Math.min(40, (session.goalsPerMatch / 2.0) * 40);
  const aggShots = Math.min(30, (session.shotsPerMatch / 4.0) * 30);
  const aggThird = Math.min(20, (pos.avgOffensiveThird / 35.0) * 20);
  const aggDemos = Math.min(10, (demos.avgInflicted / 1.5) * 10);
  const aggressiveness = Math.round(Math.min(100, Math.max(10, aggGoals + aggShots + aggThird + aggDemos)));

  const defSaves = Math.min(45, (session.savesPerMatch / 2.0) * 45);
  const defThird = Math.min(30, (pos.avgDefensiveThird / 50.0) * 30);
  const defBehind = Math.min(25, (pos.avgBehindBall / 75.0) * 25);
  const defense = Math.round(Math.min(100, Math.max(10, defSaves + defThird + defBehind)));

  const mechShoot = Math.min(30, (session.shootingPercentage / 50.0) * 30);
  const mechSuper = Math.min(35, (mov.avgSupersonicPercent / 22.0) * 35);
  const mechAir = Math.min(20, (mov.avgHighAirPercent / 5.0) * 20);
  const mechSpeed = Math.min(15, (mov.avgSpeed / 1600.0) * 15);
  const mechanics = Math.round(Math.min(100, Math.max(10, mechShoot + mechSuper + mechAir + mechSpeed)));

  const supAssists = Math.min(45, (session.assistsPerMatch / 1.2) * 45);
  const supSpacing = Math.min(30, (pos.avgDistanceToTeammate / 3500.0) * 30);
  const supInfront = Math.max(0, 25 - (pos.avgInfrontBall / 40.0) * 25);
  const support = Math.round(Math.min(100, Math.max(10, supAssists + supSpacing + supInfront)));

  const bBcpm = Math.min(35, (boost.avgBcpm / 500.0) * 35);
  const bStolen = Math.min(30, (boost.avgStolenBig / 3.0) * 30);
  const bZeroGood = Math.max(0, 35 - (boost.avgZeroBoostPercent / 15.0) * 35);
  const boostControl = Math.round(Math.min(100, Math.max(10, bBcpm + bStolen + bZeroGood)));

  return [
    { axis: 'Agressividade', value: aggressiveness ?? 50, fullMark: 100 },
    { axis: 'Contencao Defensiva', value: defense ?? 50, fullMark: 100 },
    { axis: 'Eficiencia Mecanica', value: mechanics ?? 50, fullMark: 100 },
    { axis: 'Suporte e Posicionamento', value: support ?? 50, fullMark: 100 },
    { axis: 'Controle de Boost', value: boostControl ?? 50, fullMark: 100 },
  ];
}
