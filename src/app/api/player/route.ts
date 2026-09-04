import { NextRequest, NextResponse } from 'next/server';
import { BallchasingClient } from '@/lib/ballchasing';
import { fetchReplayDetailsWithPacing } from '@/lib/replay-fetcher';
import { calculateAggregatedDashboard } from '@/lib/stats-calculator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name') || undefined;
    const platform = searchParams.get('platform') || undefined;
    const id = searchParams.get('id') || undefined;
    const playlist = searchParams.get('playlist') || 'ranked-doubles';
    const count = parseInt(searchParams.get('count') || '50', 10);

    if (!name && !id) {
      return NextResponse.json(
        { success: false, error: 'Informe o nome do jogador ou o ID da plataforma' },
        { status: 400 }
      );
    }

    const client = new BallchasingClient();

    let fullPlayerId: string | undefined = undefined;
    if (id) {
      fullPlayerId = platform ? `${platform}:${id}` : id;
    }

    // 1. Fetch replay list from Ballchasing
    const replayListResponse = await client.listReplays({
      playerName: name,
      playerId: fullPlayerId,
      playlist,
      count: Math.min(count, 50),
    });

    const replays = replayListResponse.list || [];

    if (replays.length === 0) {
      return NextResponse.json({
        success: true,
        data: calculateAggregatedDashboard([], { name, platform: platform as any, id }),
        message: 'Nenhuma partida encontrada para este jogador.',
      });
    }

    // 2. Fetch full stats for top 20 replays using shared pacing helper
    const maxDetailed = Math.min(replays.length, 20);
    const topReplayIds = replays.slice(0, maxDetailed).map((r) => r.id);

    const detailedReplays = await fetchReplayDetailsWithPacing(client, topReplayIds, {
      delayMs: 550,
    });

    // Append remaining replays from summary
    for (let i = maxDetailed; i < replays.length; i++) {
      detailedReplays.push(replays[i]);
    }

    const dashboard = calculateAggregatedDashboard(detailedReplays, {
      name,
      platform: platform as any,
      id,
    });

    return NextResponse.json({
      success: true,
      data: dashboard,
      isMock: false,
    });
  } catch (error: any) {
    console.error('Erro na rota /api/player:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Falha ao buscar dados do jogador',
      },
      { status: 500 }
    );
  }
}
