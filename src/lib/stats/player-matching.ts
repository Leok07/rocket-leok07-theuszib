import { ReplaySummary, PlayerInReplay, Platform, TeamInReplay } from '@/types/ballchasing';

export interface FoundPlayerInMatch {
  replay: ReplaySummary;
  player: PlayerInReplay;
  isBlue: boolean;
  isWin: boolean;
  teamGoals: number;
  opponentGoals: number;
}

export function getTeamGoals(team?: TeamInReplay | null): number {
  if (!team) return 0;
  if (typeof team.stats?.core?.goals === 'number') return team.stats.core.goals;
  if (typeof team.score === 'number') return team.score;
  if (typeof team.goals === 'number') return team.goals;
  if (Array.isArray(team.players)) {
    return team.players.reduce((sum: number, p: any) => sum + (p.stats?.core?.goals || 0), 0);
  }
  return 0;
}

export function findPlayerDataInReplay(
  replay: ReplaySummary,
  playerIdentifier: { name?: string; searchNames?: string[]; platform?: Platform | string; id?: string; platformId?: string }
): FoundPlayerInMatch | null {
  // Discard pending or errored replays that lack full parsed telemetry
  if (replay.status && replay.status !== 'ok') {
    return null;
  }

  const normNames = (playerIdentifier.searchNames || [playerIdentifier.name || ''])
    .map((n) => n.toLowerCase().trim())
    .filter(Boolean);
  const targetPlatform = playerIdentifier.platform?.toLowerCase().trim();
  const rawId = playerIdentifier.id || playerIdentifier.platformId || '';
  const targetId = rawId.includes(':') ? rawId.split(':').pop()?.toLowerCase().trim() : rawId.toLowerCase().trim();

  const blueGoals = getTeamGoals(replay.blue);
  const orangeGoals = getTeamGoals(replay.orange);

  // Strict, unambiguous player match check
  const checkPlayerMatch = (p: PlayerInReplay): boolean => {
    const pName = p.name?.toLowerCase().trim() || '';
    const pPlatform = p.id?.platform?.toLowerCase();
    const pId = p.id?.id?.toLowerCase();

    // Skip unnamed and invalid slots
    if (!pName && !pId) return false;

    // 1. Exact platform ID match (if ID is known)
    if (targetId && pId && pId === targetId) {
      return !targetPlatform || pPlatform === targetPlatform;
    }

    // 2. Exact match against target search names with platform verification
    for (const n of normNames) {
      if (pName === n) {
        if (targetPlatform && pPlatform && pPlatform !== targetPlatform) {
          continue;
        }
        return true;
      }
    }

    return false;
  };

  // Check blue team
  for (const p of replay.blue?.players || []) {
    if (checkPlayerMatch(p)) {
      const isWin = blueGoals > orangeGoals;
      return {
        replay,
        player: p,
        isBlue: true,
        isWin,
        teamGoals: blueGoals,
        opponentGoals: orangeGoals,
      };
    }
  }

  // Check orange team
  for (const p of replay.orange?.players || []) {
    if (checkPlayerMatch(p)) {
      const isWin = orangeGoals > blueGoals;
      return {
        replay,
        player: p,
        isBlue: false,
        isWin,
        teamGoals: orangeGoals,
        opponentGoals: blueGoals,
      };
    }
  }

  return null;
}
